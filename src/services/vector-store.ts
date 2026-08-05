import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import type { SupabaseClient } from "@supabase/supabase-js";

const EMBEDDING_MODEL = "text-embedding-004";
const EMBEDDING_DIMENSIONS = 768;
const DEFAULT_MATCH_COUNT = 5;
const DEFAULT_SIMILARITY_THRESHOLD = 0.7;

let embeddingsClient: GoogleGenerativeAIEmbeddings | null = null;

const getEmbeddingsClient = () => {
  if (embeddingsClient) return embeddingsClient;

  const apiKey =
    process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is not configured for embeddings.");
  }

  embeddingsClient = new GoogleGenerativeAIEmbeddings({
    apiKey,
    model: EMBEDDING_MODEL,
  });

  return embeddingsClient;
};

const validateEmbedding = (vector: number[]) => {
  if (vector.length !== EMBEDDING_DIMENSIONS) {
    console.warn(
      `Embedding length mismatch. Expected ${EMBEDDING_DIMENSIONS}, received ${vector.length}.`
    );
  }
};

export const embedAndStoreDocument = async ({
  supabase,
  userId,
  content,
  metadata = {},
}: {
  supabase: SupabaseClient;
  userId: string;
  content: string;
  metadata?: Record<string, unknown>;
}) => {
  if (!content.trim()) {
    throw new Error("Cannot embed empty content.");
  }

  const embeddings = getEmbeddingsClient();
  const vector = await embeddings.embedQuery(content);

  validateEmbedding(vector);

  const { error } = await supabase.from("documents").insert([
    {
      content,
      user_id: userId,
      metadata,
      embedding: vector,
    },
  ]);

  if (error) {
    throw new Error(`Failed to store embedding: ${error.message}`);
  }
};

export type MatchedDocument = {
  id?: string;
  content: string;
  metadata: Record<string, unknown> | null;
  similarity: number;
};

type SearchDocumentsArgs = {
  supabase: SupabaseClient;
  userId: string;
  query: string;
  matchCount?: number;
  similarityThreshold?: number;
};

const normalizeMetadata = (
  metadata: unknown
): Record<string, unknown> | null => {
  if (!metadata) return null;
  if (typeof metadata === "object") return metadata as Record<string, unknown>;

  if (typeof metadata === "string") {
    try {
      return JSON.parse(metadata);
    } catch {
      return { value: metadata };
    }
  }

  return { value: metadata };
};

export const searchRelevantDocuments = async ({
  supabase,
  userId,
  query,
  matchCount = DEFAULT_MATCH_COUNT,
  similarityThreshold = DEFAULT_SIMILARITY_THRESHOLD,
}: SearchDocumentsArgs): Promise<MatchedDocument[]> => {
  if (!query.trim()) return [];

  try {
    const embeddings = getEmbeddingsClient();
    const queryEmbedding = await embeddings.embedQuery(query);

    validateEmbedding(queryEmbedding);

    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: similarityThreshold,
      match_count: matchCount,
      filter: { user_id: userId },
    });

    if (error) {
      console.error("match_documents RPC failed:", error);
      return [];
    }

    if (!Array.isArray(data)) return [];

    return data.map((entry) => ({
      id: entry.id ?? entry.document_id ?? undefined,
      content: entry.content ?? "",
      metadata: normalizeMetadata(entry.metadata),
      similarity: typeof entry.similarity === "number" ? entry.similarity : 0,
    }));
  } catch (error) {
    console.error("Failed to execute document search:", error);
    return [];
  }
};

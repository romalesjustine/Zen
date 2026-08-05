"use server";

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { MatchedDocument, searchRelevantDocuments } from "@/services/vector-store";
import { checkAndIncrementUsage } from "@/services/subscription-limits";

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODEL_NAME =
  process.env.GOAL_HELPER_MODEL ?? "gemini-2.5-flash-lite";

const SYSTEM_PROMPT = `
You are the Zen Goal Helper AI. Provide motivating, tactical support that helps users plan and complete their study or productivity goals.
- Prioritize clarity and step-by-step suggestions.
- Reference retrieved context snippets when they are relevant. If you include details from them, mention that they came from the user's notes.
- When no context is available, say that you are sharing general guidance and still answer helpfully.
- Suggest related Zen features (Weekly Wrap, Study Deck, Notes, Exams, Flashcards, AI Notes, Progress Tracker, Pomodoro) when it makes sense.
- Return well-structured markdown. Avoid headings solely for hyperlinks.
`.trim();

const truncate = (value: string, max = 1200) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
};

const formatContextBlock = (documents: MatchedDocument[]) => {
  if (!documents.length) {
    return "No relevant documents were found for this query. Rely on general best practices.";
  }

  return documents
    .map((doc, index) => {
      const metadata = doc.metadata ? JSON.stringify(doc.metadata) : "{}";
      return `Document ${index + 1} (similarity: ${doc.similarity.toFixed(
        2
      )})
Metadata: ${metadata}
Content:
${truncate(doc.content)}`;
    })
    .join("\n\n");
};

const mapHistoryForModel = (history: HistoryMessage[]) =>
  history
    .filter((message) => message.content?.trim())
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    }));

const getModel = () => {
  const apiKey =
    process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.4,
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt ?? "";
    const history: HistoryMessage[] = Array.isArray(body?.history)
      ? body.history
      : [];

    if (!prompt.trim()) {
      return NextResponse.json(
        { message: "Prompt is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const charCost = prompt.length;
    const limitCheck = await checkAndIncrementUsage(user.id, "aiChar", charCost);

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { message: limitCheck.message || "Daily AI character limit reached." },
        { status: 403 }
      );
    }

    const documents = await searchRelevantDocuments({
      supabase,
      userId: user.id,
      query: prompt,
    });

    const contextBlock = formatContextBlock(documents);
    const model = getModel();

    const conversation = [
      ...mapHistoryForModel(history),
      {
        role: "user" as const,
        parts: [
          {
            text: `Context:\n${contextBlock}\n\nUser question:\n${prompt.trim()}`,
          },
        ],
      },
    ];

    const result = await model.generateContent({
      contents: conversation,
    });

    const textResponse = result.response.text();

    if (!textResponse.trim()) {
      return NextResponse.json(
        {
          message: "The model returned an empty response.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      answer: textResponse,
      references: documents.map((doc) => ({
        id: doc.id,
        similarity: doc.similarity,
        metadata: doc.metadata,
      })),
    });
  } catch (error) {
    console.error("Goal helper chat failed:", error);
    return NextResponse.json(
      {
        message: "Unable to process your request at the moment.",
      },
      { status: 500 }
    );
  }
}
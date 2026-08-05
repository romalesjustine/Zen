import { prisma } from "@/lib/prisma";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { BaseMessage } from "@langchain/core/messages";
import { checkAndIncrementUsage } from "./subscription-limits";

const MIN_FLASHCARDS = 20;
const MODEL_NAME = "gemini-2.5-flash-lite";

const SUMMARIZATION_PROMPT = (data: string) =>
  `
You are a helpful assistant tasked with processing text input and generating a well-structured educational reviewer. Format your response using clear headings and bullet points for readability.

Instructions:

1. Provide a general overview of the given text input, summarizing the key points and topics. Ensure the overview is at least five sentences long.
2. Organize the content into distinct categories based on the topic. Each category should have a bold heading followed by a brief summary.
3. Use bullet points within each category to highlight key terms, concepts, and explanations.
4. Ensure concise yet informative bullet points, explaining relationships between ideas when possible. Include relevant mnemonics to help with memorization if applicable.
5. Maintain a clean, structured format, similar to professional study guides. Return also a title for the whole document.

Input text:

${data}
`.trim();

const FLASHCARD_PROMPT = (data: string) =>
  `
Create flashcards from the following text:

${data}

For each flashcard, provide:

* **Front:** The question or prompt.
* **Back:** The answer or explanation.

Format the flashcards like this in an array of JSON objects:

Front: [Front Text]
Back: [Back Text]

... and so on.

Focus on creating concise and clear flashcards. It must contain a minimum of 20 flashcards.
`.trim();

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractTextFromMessage = (message: BaseMessage) => {
  if (typeof message.content === "string") {
    return message.content.trim();
  }

  return message.content
    .map((part) => {
      if (typeof part === "string") return part;
      if ("text" in part && typeof part.text === "string") return part.text;
      return "";
    })
    .join(" ")
    .trim();
};

const deriveTitle = (markdown: string) => {
  const normalized = markdown.trim();
  const titleLine =
    normalized.match(/^Title\s*[:\-]\s*(.+)$/im)?.[1] ??
    normalized.match(/^#\s*(.+)$/m)?.[1];

  return (titleLine ?? "AI Generated Notes").trim();
};

const stripLeadingTitleLine = (markdown: string, title: string) => {
  const lines = markdown.split("\n");
  if (!lines.length) return markdown.trim();

  const [firstLine, ...rest] = lines;
  if (
    new RegExp(`^Title\\s*[:\\-]\\s*${escapeRegExp(title)}`, "i").test(
      firstLine.trim()
    ) ||
    firstLine.replace(/^#+\s*/, "").trim() === title
  ) {
    return rest.join("\n").trim();
  }

  return markdown.trim();
};

const tryParseJsonFlashcards = (rawText: string) => {
  const cleaned = rawText.replace(/```json|```/gi, "").trim();
  const jsonCandidate = cleaned.startsWith("[")
    ? cleaned
    : cleaned.match(/\[[\s\S]*\]/)?.[0];

  if (!jsonCandidate) return null;

  try {
    const parsed = JSON.parse(jsonCandidate);
    if (!Array.isArray(parsed)) return null;

    const normalized = parsed
      .map((item) => {
        if (typeof item !== "object" || item === null) return null;

        const front =
          item.front ??
          item.Front ??
          item.question ??
          item.Question ??
          item.prompt ??
          item.Prompt;
        const back =
          item.back ??
          item.Back ??
          item.answer ??
          item.Answer ??
          item.response ??
          item.Response;

        if (typeof front === "string" && typeof back === "string") {
          return { front: front.trim(), back: back.trim() };
        }

        return null;
      })
      .filter((card): card is { front: string; back: string } => Boolean(card))
      .filter((card) => card.front && card.back);

    return normalized.length ? normalized : null;
  } catch {
    return null;
  }
};

const parseFlashcards = (rawText: string) => {
  const jsonCards = tryParseJsonFlashcards(rawText);
  if (jsonCards) {
    return jsonCards;
  }

  const cards: { front: string; back: string }[] = [];
  const regex = /Front:\s*([\s\S]*?)\s*Back:\s*([\s\S]*?)(?=\n\s*Front:|$)/g;
  let match: RegExpExecArray | null = null;

  while ((match = regex.exec(rawText)) !== null) {
    const front = match[1].trim();
    const back = match[2].trim();

    if (front && back) {
      cards.push({ front, back });
    }
  }

  return cards;
};

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  return new ChatGoogleGenerativeAI({
    apiKey,
    model: MODEL_NAME,
    temperature: 0.3,
  });
};

const ensureMinimumFlashcards = (
  flashcards: { front: string; back: string }[]
) => flashcards.length >= MIN_FLASHCARDS;

export const generateStudyMaterials = async (text: string) => {
  const model = getModel();

  const [reviewerMessage, flashcardMessage] = await Promise.all([
    model.invoke(SUMMARIZATION_PROMPT(text)),
    model.invoke(FLASHCARD_PROMPT(text)),
  ]);

  const reviewerMarkdown = extractTextFromMessage(reviewerMessage);
  const flashcardRaw = extractTextFromMessage(flashcardMessage);

  const flashcards = parseFlashcards(flashcardRaw);

  if (!ensureMinimumFlashcards(flashcards)) {
    throw new Error(
      `Flashcard generation returned only ${flashcards.length} cards. At least ${MIN_FLASHCARDS} are required.`
    );
  }

  const title = deriveTitle(reviewerMarkdown);
  const markdownContent = stripLeadingTitleLine(reviewerMarkdown, title);

  return { title, markdownContent, flashcards };
};

export const persistStudyMaterials = async ({
  userId,
  title,
  markdownContent,
  flashcards,
  deadline,
}: {
  userId: string;
  title: string;
  markdownContent: string;
  flashcards: { front: string; back: string }[];
  deadline?: Date;
}) => {
  const note = await prisma.note.create({
    data: {
      userId,
      title,
      content: { markdown: markdownContent },
      isAiGenerated: true,
      deadline,
    },
  });

  await prisma.flashcard.createMany({
    data: flashcards.map((card) => ({
      noteId: note.id,
      userId,
      front: card.front,
      back: card.back,
      isAiGenerated: true,
    })),
  });

  return {
    noteId: note.id,
    title: note.title,
    content: markdownContent,
    flashcardsCreated: flashcards.length,
  };
};

export const generateAndPersistStudyMaterials = async (
  text: string,
  userId: string,
  deadline?: Date
) => {
  const charCount = text.length;
  const usageCheck = await checkAndIncrementUsage(userId, 'aiChar', charCount);
  
  if (!usageCheck.allowed) {
    throw new Error(usageCheck.message || 'Daily AI character limit reached');
  }

  const { title, markdownContent, flashcards } = await generateStudyMaterials(
    text
  );

  const flashcardCheck = await checkAndIncrementUsage(userId, 'flashcard', flashcards.length);
  
  if (!flashcardCheck.allowed) {
    throw new Error(flashcardCheck.message || 'Daily flashcard limit reached');
  }

  return persistStudyMaterials({
    userId,
    title,
    markdownContent,
    flashcards,
    deadline,
  });
};

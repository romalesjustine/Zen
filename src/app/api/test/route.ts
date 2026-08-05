import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

interface Question {
  choices: string[];
  question: string;
  answer: string;
  selectedAnswer?: string;
}

const stringifyNoteContent = (content: unknown): string => {
  if (!content) {
    return "";
  }

  if (typeof content === "string") {
    return content;
  }

  if (
    typeof content === "object" &&
    content !== null &&
    "markdown" in content &&
    typeof (content as { markdown?: string }).markdown === "string"
  ) {
    return (content as { markdown: string }).markdown;
  }

  try {
    return JSON.stringify(content);
  } catch (error) {
    console.error("Failed to stringify note content:", error);
    return "";
  }
};

const mapQuestionType = (type: string): string => {
  const mapping: Record<string, string> = {
    trueOrFalse: "True/False",
    multipleChoice: "Multiple Choice",
    identification: "Identification",
  };

  return mapping[type] ?? type;
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (
    !body ||
    typeof body !== "object" ||
    !("selectedTypes" in body) ||
    !("id" in body)
  ) {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const { selectedTypes, id } = body as {
    selectedTypes: unknown;
    id: unknown;
  };

  if (typeof id !== "string" || id.trim().length === 0) {
    return NextResponse.json({ error: "Note id is required." }, { status: 400 });
  }

  if (!Array.isArray(selectedTypes) || selectedTypes.length === 0) {
    return NextResponse.json(
      { error: "At least one question type must be selected." },
      { status: 400 }
    );
  }

  const normalizedTypes = selectedTypes
    .map((type) => (typeof type === "string" ? type : ""))
    .filter(Boolean);

  if (normalizedTypes.length === 0) {
    return NextResponse.json(
      { error: "Invalid question types provided." },
      { status: 400 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  try {
    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const activity = await prisma.activity.create({
      data: {
        userId: user.id,
        activityType: "EXAM",
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Failed to create activity" },
        { status: 500 }
      );
    }

    const prompt = `Generate a practice test based on the following educational content: "${
      stringifyNoteContent(note.content)
    }"

            Instructions:
            - Create 5 questions
            - Only use the following question types: ${normalizedTypes
              .map(mapQuestionType)
              .join(", ")}
            - Each question should test understanding of the provided content
            - Format the response as a JSON array

            Required JSON structure:
            {
            "questions": [
                {
                "question": "The actual question text",
                "type": "one of: ${normalizedTypes
                  .map(mapQuestionType)
                  .join(", ")}",
                "choices": ["array of choices for multiple choice/true-false", "empty array for identification"],
                "answer": "The correct answer",
                "selectedAnswer": ""
                }
            ]
            }

            Rules:
            1. For Multiple Choice questions:
            - Include 4 plausible choices
            - Only one correct answer
            - Choices should be clear and distinct

            2. For True/False questions:
            - Choices array should be ["True", "False"]
            - Answer must be either "True" or "False"

            3. For Identification questions:
            - Choices array must be empty []
            - Answer should be concise and specific
            - Generate a realistic identification question suitable for an academic exam
            - Ensure the question is clear, relevant, and appropriate for assessing knowledge in a specific subject
            - Avoid overly obscure, unrealistic, or impractical questions
            - The question format should involve a clear and concise description of a person, concept, or term, followed by a list of key details that allow the student to identify the subject
            - There should be only exactly ONE correct answer (one word, or one phrase, avoid questions like "identify two..." or "list three...").
            - If the answer is specific (e.g., a date, name, or term), state the expected format in the question. Examples:
                - For dates, specify: “Answer in YYYY format” or “Provide the full date (Month Day, Year).
                - For names, specify: “Provide the full name” or “Last name only is acceptable.
                - For terms/concepts, specify: “Give the precise term used in [subject].”

            Important:
            - All questions must be directly related to the provided content
            - Ensure answers are accurate and unambiguous
            - Keep questions clear and at an appropriate difficulty level
            - Format response as valid JSON

            Return only the JSON output without any additional text or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the response
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const parsedTest = JSON.parse(cleanedText);

      // Validate the structure
      if (!parsedTest.questions || !Array.isArray(parsedTest.questions)) {
        throw new Error("Invalid test structure");
      }

      // Validate each question
      parsedTest.questions = parsedTest.questions.map((q: Question) => ({
        ...q,
        choices: Array.isArray(q.choices) ? q.choices : [],
        selectedAnswer: "",
      }));

      return NextResponse.json(
        {
          questions: parsedTest.questions,
        },
        {
          status: 200,
        }
      );
    } catch (parseError) {
      console.error("Error parsing test:", parseError);
      return NextResponse.json(
        {
          error: "Invalid test format received",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Error generating test:", error);
    return NextResponse.json(
      { error: "Failed to generate test" },
      { status: 500 }
    );
  }
}

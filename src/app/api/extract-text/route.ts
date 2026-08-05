import { NextResponse } from "next/server";
import {
  OCR_ERROR_MESSAGES,
  OcrServiceError,
  extractTextViaOcrSpace,
} from "@/services/ocr-space";
import { createClient } from "@/lib/supabase/server";
import { embedAndStoreDocument } from "@/services/vector-store";
import { checkAndIncrementUsage } from "@/services/subscription-limits";

export const runtime = "nodejs";

const ROUTE_ERROR_MESSAGES = {
  missingFile: "No file provided in request.",
  invalidType: "Invalid file payload received.",
  unauthorized: "You must be signed in to upload files.",
};

const ALLOWED_UPLOAD_SOURCES = new Set(["upload", "google_drive"]);

const parseUploadSource = (
  value: FormDataEntryValue | null
): "upload" | "google_drive" => {
  if (typeof value !== "string") {
    return "upload";
  }

  return ALLOWED_UPLOAD_SOURCES.has(value)
    ? (value as "upload" | "google_drive")
    : "upload";
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: ROUTE_ERROR_MESSAGES.missingFile },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: ROUTE_ERROR_MESSAGES.invalidType },
        { status: 400 }
      );
    }

    const uploadSource = parseUploadSource(formData.get("source"));

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: ROUTE_ERROR_MESSAGES.unauthorized },
        { status: 401 }
      );
    }

    // Check upload limit before processing
    const usageCheck = await checkAndIncrementUsage(user.id, 'upload');
    
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { error: usageCheck.message || 'Daily upload limit reached' },
        { status: 403 }
      );
    }

    const extractedText = await extractTextViaOcrSpace(file);
    await embedAndStoreDocument({
      supabase,
      userId: user.id,
      content: extractedText,
      metadata: {
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        source: uploadSource,
      },
    });

    console.log("Extracted text content:", extractedText);

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error("Text extraction error:", error);

    if (error instanceof OcrServiceError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    const message =
      error instanceof Error ? error.message : OCR_ERROR_MESSAGES.failedParsing;

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const PDF_MIME_TYPE = "application/pdf";
const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const OCR_SPACE_ENDPOINT = "https://api.ocr.space/parse/image";

export const OCR_ERROR_MESSAGES = {
  unsupportedFile: "Only PDF and DOCX files are supported.",
  oversizedFile: "File must be 5MB or smaller.",
  failedParsing: "Unable to extract text from the provided file.",
  missingApiKey: "OCR.space API key is not configured.",
};

export class OcrServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const hasExtension = (file: File, extension: string) =>
  file.name.toLowerCase().endsWith(extension);

const isPdf = (file: File) =>
  file.type === PDF_MIME_TYPE || hasExtension(file, ".pdf");

const isDocx = (file: File) =>
  file.type === DOCX_MIME_TYPE || hasExtension(file, ".docx");

type OcrSpaceErrorMessage = string | string[];

interface OcrSpaceResult {
  ParsedText?: string;
}

interface OcrSpaceResponse {
  ParsedResults?: OcrSpaceResult[];
  IsErroredOnProcessing?: boolean;
  ErrorMessage?: OcrSpaceErrorMessage;
  ErrorDetails?: string;
}

const normalizeErrorMessage = (message?: OcrSpaceErrorMessage) => {
  if (!message) return undefined;
  return Array.isArray(message) ? message.join(" ") : message;
};

const ensureSupportedFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new OcrServiceError(OCR_ERROR_MESSAGES.oversizedFile, 400);
  }

  if (!isPdf(file) && !isDocx(file)) {
    throw new OcrServiceError(OCR_ERROR_MESSAGES.unsupportedFile, 400);
  }
};

export const extractTextViaOcrSpace = async (file: File) => {
  ensureSupportedFile(file);

  const apiKey = process.env.OCR_SPACE_API_KEY;

  if (!apiKey) {
    throw new OcrServiceError(OCR_ERROR_MESSAGES.missingApiKey, 500);
  }

  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], {
    type: file.type || "application/octet-stream",
  });

  const body = new FormData();
  body.append("file", blob, file.name);
  body.append("OCREngine", "2");
  body.append("scale", "true");

  const response = await fetch(OCR_SPACE_ENDPOINT, {
    method: "POST",
    headers: {
      apikey: apiKey,
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new OcrServiceError(
      `OCR.space request failed with status ${response.status}: ${errorText}`,
      response.status >= 500 ? 502 : 400
    );
  }

  const payload = (await response.json()) as OcrSpaceResponse;

  if (payload.IsErroredOnProcessing) {
    throw new OcrServiceError(
      normalizeErrorMessage(payload.ErrorMessage) ||
        payload.ErrorDetails ||
        OCR_ERROR_MESSAGES.failedParsing,
      500
    );
  }

  const extractedText =
    payload.ParsedResults?.map((result) => result.ParsedText?.trim() ?? "")
      .join("\n")
      .trim() ?? "";

  if (!extractedText) {
    throw new OcrServiceError(OCR_ERROR_MESSAGES.failedParsing, 500);
  }

  return extractedText;
};

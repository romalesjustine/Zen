import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAndPersistStudyMaterials } from "@/services/ai-notes";
import { checkAndIncrementUsage } from "@/services/subscription-limits"; 

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { text, deadline } = (await request.json()) as { text?: string; deadline?: string };

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text payload is required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to generate notes." },
        { status: 401 }
      );
    }

    const limitCheck = await checkAndIncrementUsage(user.id, "upload", 1);

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.message || "Daily course generation limit reached." },
        { status: 403 }
      );
    }

    // Convert deadline date string to DateTime if provided
    const deadlineDate = deadline 
      ? new Date(deadline + 'T00:00:00.000Z')
      : undefined;

    const result = await generateAndPersistStudyMaterials(text, user.id, deadlineDate);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI notes generation failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate notes.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserUsageStats } from "@/services/subscription-limits";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const stats = await getUserUsageStats(user.id);

    return NextResponse.json({
      tier: stats.tier,
      subscriptionEnds: stats.subscriptionEnds,
      uploads: {
        used: stats.uploads.used,
        limit: stats.uploads.limit === Infinity ? '∞' : stats.uploads.limit,
        remaining: stats.uploads.remaining === Infinity ? '∞' : stats.uploads.remaining,
      },
      flashcards: {
        used: stats.flashcards.used,
        limit: stats.flashcards.limit === Infinity ? '∞' : stats.flashcards.limit,
        remaining: stats.flashcards.remaining === Infinity ? '∞' : stats.flashcards.remaining,
      },
      aiChars: {
        used: stats.aiChars.used,
        limit: stats.aiChars.limit === Infinity ? '∞' : stats.aiChars.limit,
        remaining: stats.aiChars.remaining === Infinity ? '∞' : stats.aiChars.remaining,
      },
    });
  } catch (error) {
    console.error("Failed to fetch usage stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage statistics" },
      { status: 500 }
    );
  }
}

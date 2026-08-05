import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { updateStreakAndTier } from "@/services/streak";

export async function POST(req: NextRequest) {
  try {
    const { duration, dateStopped } = await req.json();

    if (typeof duration !== "number" || Number.isNaN(duration) || duration < 0) {
      return NextResponse.json(
        { error: "Invalid duration" },
        { status: 400 },
      );
    }

    if (!dateStopped) {
      return NextResponse.json(
        { error: "Missing session date" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        email: user.email,
      },
      select: {
        id: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const previousSession = await prisma.session.findUnique({
      where: {
        userId: profile.id,
      },
      select: {
        id: true,
        totalHr: true,
      },
    });

    if (!previousSession) {
      await prisma.session.create({
        data: {
          userId: profile.id,
          totalHr: duration,
          prevTotalHr: 0,
        },
      });
    } else if (previousSession.totalHr < duration) {
      await prisma.session.update({
        where: {
          id: previousSession.id,
        },
        data: {
          prevTotalHr: previousSession.totalHr,
          totalHr: duration,
        },
      });
    }

    const normalizedDate = new Date(dateStopped);
    normalizedDate.setHours(0, 0, 0, 0);

    if (Number.isNaN(normalizedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid session date" },
        { status: 400 },
      );
    }

    const nextDay = new Date(normalizedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId: profile.id,
        date: {
          gte: normalizedDate,
          lt: nextDay,
        },
      },
      select: {
        id: true,
        progress: true,
      },
    });

    if (existingProgress) {
      await prisma.progress.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          progress: existingProgress.progress + duration,
        },
      });
    } else {
      await prisma.progress.create({
        data: {
          userId: profile.id,
          progress: duration,
          date: normalizedDate,
        },
      });
    }

    // Update streak and tier based on activity
    const streakResult = await updateStreakAndTier(profile.id);

    return NextResponse.json({ 
      success: true,
      streak: streakResult,
    });
  } catch (error) {
    console.error("Error in study session API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

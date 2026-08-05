import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const formatProgress = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const percentage = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, Math.round(percentage)));
};

const deriveIcon = (title?: string | null) => {
  if (!title) {
    return "📘";
  }

  const firstChar = title.trim().charAt(0).toUpperCase();
  return firstChar || "📘";
};

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to view your study deck." },
        { status: 401 }
      );
    }

    const [notes, profile] = await Promise.all([
      prisma.note.findMany({
        where: {
          userId: user.id,
          flashcards: {
            some: {},
          },
        },
        orderBy: { lastModified: "desc" },
        select: {
          id: true,
          title: true,
          flashcardProgress: true,
          lastModified: true,
          deadline: true,
          icon_url: true,
          flashcards: {
            orderBy: { lastModified: "desc" },
            take: 30,
            select: {
              id: true,
              noteId: true,
              userId: true,
              lastModified: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.profile.findUnique({
        where: { id: user.id },
        select: {
          username: true,
          full_name: true,
          email: true,
        },
      }),
    ]);

    const noteMap = new Map(
      notes.map((note) => [
        note.id,
        {
          ...note,
          progress: formatProgress(note.flashcardProgress),
        },
      ])
    );

    const recentFlashcards = notes
      .map((note) => {
        const latestCard = note.flashcards.at(0);
        if (!latestCard) {
          return null;
        }

        return {
          id: latestCard.id,
          noteId: note.id,
          courseName: note.title ?? "Untitled Note",
          progress: noteMap.get(note.id)?.progress ?? 0,
          imageUrl: note.icon_url ?? "/flashcard-bg.png",
        };
      })
      .filter((card): card is NonNullable<typeof card> => Boolean(card))
      .slice(0, 30);

    const myCourses = notes.map((note) => ({
      id: note.id,
      courseName: note.title ?? "Untitled Note",
      icon: deriveIcon(note.title),
      deadline: note.deadline,
    }));

    const weeklyProgress =
      myCourses.length > 0
        ? Math.round(
            myCourses.reduce(
              (sum, course) => sum + (noteMap.get(course.id)?.progress ?? 0),
              0
            ) / myCourses.length
          )
        : 0;

    return NextResponse.json({
      userName:
        profile?.username ??
        profile?.full_name ??
        profile?.email ??
        user.email ??
        "Learner",
      recentFlashcards,
      myCourses,
      weeklyProgress,
    });
  } catch (error) {
    console.error("Study deck API failed:", error);
    return NextResponse.json(
      { error: "Failed to load study deck data." },
      { status: 500 }
    );
  }
}

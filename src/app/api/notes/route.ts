import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "User is not logged in" },
        { status: 401 }
      );
    }

    // Convert deadline date string to DateTime if provided
    const deadlineDate = body.deadline 
      ? new Date(body.deadline + 'T00:00:00.000Z')
      : undefined;

    const newNote = await prisma.note.create({
      data: {
        userId: user.id,
        title: body.title,
        content: body.content,
        isAiGenerated: body.isAiGenerated,
        lastModified: body.lastModified,
        deadline: deadlineDate,
      },
    });

    await prisma.flashcard.createMany({
      data: body.flashcards.map(
        (flashcard: { Front: string; Back: string }) => ({
          noteId: newNote.id,
          userId: user.id,
          isAiGenerated: true,
          front: flashcard.Front,
          back: flashcard.Back,
        })
      ),
    });

    await prisma.activity.create({
      data: {
        activityType: "NOTES",
        userId: user.id,
      },
    });

    return NextResponse.json(newNote, { status: 200 });
  } catch (error) {
    console.log("An error occurred:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

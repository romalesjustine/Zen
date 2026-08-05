import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await params;
    const body = await req.json();

    console.log(body);

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

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...body,
      },
    });

    await prisma.activity.create({
      data: {
        activityType: "NOTES",
        userId: user.id,
      },
    });
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.log("An error occured", error);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    const { noteId } = await params;
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

    // Delete all related records first
    await prisma.$transaction([
      // Delete related flashcards
      prisma.flashcard.deleteMany({
        where: { noteId },
      }),

      // Delete related exams
      prisma.exam.deleteMany({
        where: { noteId },
      }),

      // Delete the note itself
      prisma.note.delete({
        where: { id: noteId },
      }),

      // Create activity log
      prisma.activity.create({
        data: {
          activityType: "NOTES",
          userId: user.id,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("An error occurred during deletion:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while deleting the note",
      },
      { status: 500 }
    );
  }
}

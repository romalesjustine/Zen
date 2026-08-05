import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndIncrementUsage } from "@/services/subscription-limits";

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
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

    if (data.type === "progress update") {
      const response = await prisma.flashcard.update({
        where: {
          id: data.id,
        },
        data: {
          isAnswered: data.isAnswered,
        },
      });

      if (!response) {
        return NextResponse.json(
          { message: "Failed to update flashcard" },
          { status: 500 }
        );
      }

      const note = await prisma.note.update({
        where: {
          id: response.noteId,
        },
        data: {
          flashcardProgress: data.progress,
        },
      });

      if (!note) {
        return NextResponse.json(
          { message: "Failed to update note" },
          { status: 500 }
        );
      }

      const activity = await prisma.activity.create({
        data: {
          userId: user.id,
          activityType: "FLASHCARDS",
        },
      });

      if (!activity) {
        return NextResponse.json(
          { message: "Failed to create activity" },
          { status: 500 }
        );
      }

      return NextResponse.json(response);
    } else {
      const response = await prisma.flashcard.update({
        where: {
          id: data.id,
        },
        data: {
          front: data.front,
          back: data.back,
        },
      });

      if (!response) {
        return NextResponse.json(
          { message: "Failed to update flashcard" },
          { status: 500 }
        );
      }

      const activity = await prisma.activity.create({
        data: {
          userId: user.id,
          activityType: "FLASHCARDS",
        },
      });

      if (!activity) {
        return NextResponse.json(
          { message: "Failed to create activity" },
          { status: 500 }
        );
      }

      return NextResponse.json(response);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = await createClient();

    console.log(data);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "User is not logged in" },
        { status: 401 }
      );
    }

    // Check flashcard creation limit
    const usageCheck = await checkAndIncrementUsage(user.id, 'flashcard', 1);
    
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { message: usageCheck.message || 'Daily flashcard limit reached' },
        { status: 403 }
      );
    }

    const response = await prisma.flashcard.create({
      data: {
        noteId: data.id,
        userId: user.id,
        isAiGenerated: false,
        front: data.front,
        back: data.back,
        isAnswered: false,
      },
    });

    if (!response) {
      return NextResponse.json(
        { message: "Failed to create flashcard" },
        { status: 500 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        userId: user.id,
        activityType: "FLASHCARDS",
      },
    });

    if (!activity) {
      return NextResponse.json(
        { message: "Failed to create activity" },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("An error occurred:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
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

    const response = await prisma.flashcard.delete({
      where: {
        id: data.id,
      },
    });

    if (!response) {
      return NextResponse.json(
        { message: "Failed to delete flashcard" },
        { status: 500 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        userId: user.id,
        activityType: "FLASHCARDS",
      },
    });

    if (!activity) {
      return NextResponse.json(
        { message: "Failed to create activity" },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("An error occurred:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

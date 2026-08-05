import { prisma } from "@/lib/prisma";
import Dashboard from "./dashboard";

export default async function Course({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const notes = await prisma.note.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      deadline: true,
      icon_url: true,
    },
  });

  const flashcards = await prisma.flashcard.findMany({
    where: {
      noteId: id,
    },
    select: {
      id: true,
      front: true,
      back: true,
    },
  });

  if (!notes) {
    return <div>Note not found</div>;
  }

  return <Dashboard notes={notes} flashcards={flashcards} id={id} />;
}

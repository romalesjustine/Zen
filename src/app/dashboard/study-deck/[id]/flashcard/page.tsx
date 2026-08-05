import { NotebookPen, PenLine, ChevronLeft } from "lucide-react";
import Markdown from "react-markdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FlashcardArray from "./flashcardArray";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateTest from "@/components/modals/create-test-modal";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const notes = await prisma.note.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      flashcardProgress: true,
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
      isAnswered: true,
    },
  });

  return (
    <div className="w-full p-10">
      <div className="flex items-center justify-center w-full relative mb-8">
        <div className="absolute left-0">
          <Link href={`/dashboard/study-deck/${id}`}>
            <ChevronLeft size={36} className="dark:text-light text-black" />
          </Link>
        </div>
        <h1 className="text-3xl dark:text-light text-black">Flashcards</h1>
      </div>
      <div className="sticky top-0  backdrop-blur-sm z-10">
        <div className="flex items-center justify-between py-4 border-b border-black dark:border-white/20">
          <div className="text-2xl font-semibold">
            <h1 className="dark:text-light text-black">{notes?.title}</h1>
          </div>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex items-center justify-center px-4 py-2 gap-2
                                text-white rounded-xl bg-[radial-gradient(50%_50%_at_50%_50%,#9B77CB_0%,#591DA9_100%)] 
                                hover:opacity-90 transition-opacity duration-200 min-w-fit"
              >
                <NotebookPen size={18} />
                <span>Study Deck</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border-purple-600 text-white p-4 space-y-3">
                <Link href={`/dashboard/study-deck/${id}/notes`} className="block">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-[20px] border-2 border-[#591DA9] bg-[#591DA9] dark:[background:var(--background-image-flashcard-gradient)] py-2 px-3 hover:bg-[#591DA9]/30 cursor-pointer transition-all"
                  >
                    <PenLine size={20} />
                    <p className="text-base font-normal">Notes</p>
                  </button>
                </Link>
                <CreateTest id={id} title={notes?.title} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div>
        <FlashcardArray
          flashcard={flashcards}
          progress={notes?.flashcardProgress || 0}
        />
      </div>
    </div>
  );
}

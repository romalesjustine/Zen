"use client";
import { ChevronLeft, NotebookPen } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import FlashcardArray from "@/components/studydeck/[id]/flashcardArray";
import FlashcardList from "@/components/studydeck/[id]/flashcardList";
import CreateTest from "@/components/modals/create-test-modal";
import EditCourseModal from "@/components/modals/edit-course-modal";
import { runWithToast } from "@/lib/toast";

interface DashboardProps {
  notes: {
    title: string;
    deadline?: Date | null;
    icon_url?: string | null;
  };
  flashcards: {
    id: string;
    front: string;
    back: string;
  }[];
  id: string;
}

export default function Dashboard({ notes, flashcards, id }: DashboardProps) {
  const [updatedFlashcards, setUpdatedFlashcards] = useState(flashcards);
  const [courseTitle, setCourseTitle] = useState(notes.title);
  const [courseDeadline, setCourseDeadline] = useState<string | null>(
    notes.deadline ? new Date(notes.deadline).toISOString().split("T")[0] : null
  );
  const [courseIcon, setCourseIcon] = useState<string>(
    notes.icon_url ?? "/cover/cover_1.png"
  );

  const handleCourseUpdate = async (next: {
    title: string;
    deadline: string | null;
    icon: string;
  }) => {
    try {
      await runWithToast(
        async () => {
          const response = await fetch(`/api/notes/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: next.title,
              deadline: next.deadline ? new Date(next.deadline).toISOString() : null,
              icon_url: next.icon,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update course");
          }
        },
        {
          loading: "Updating course...",
          success: "Course updated successfully!",
          error: "Failed to update course. Please try again.",
        },
        { toastId: "updateCourse" }
      );

      setCourseTitle(next.title);
      setCourseDeadline(next.deadline);
      setCourseIcon(next.icon);
      return true;
    } catch (error) {
      console.error("Error updating course:", error);
      return false;
    }
  };

  return (
    <>
      <div className="w-full p-10">
        <div className="relative mb-8 flex w-full items-center justify-center">
          <div className="absolute left-0">
            <Link href="/dashboard/study-deck">
              <ChevronLeft size={24} className="dark:text-light text-black" />
            </Link>
          </div>
          <h1 className="text-2xl dark:text-light text-black"> Course Dashboard </h1>
        </div>
        <div className="w full flex items-center justify-between border-b dark:border-white border-black pb-4 text-2xl font-normal">
          <div className="flex items-center gap-3 flex-1 ">
            <h1 className="dark:text-light text-black">{courseTitle}</h1>
          </div>
          <EditCourseModal
            title={courseTitle}
            deadline={courseDeadline}
            icon={courseIcon}
            onSave={handleCourseUpdate}
          />
        </div>
        <div className="mt-7 w-full space-y-8 rounded-lgpx-[80px] py-[42px]">
          <div className="flex w-full justify-between gap-4">
            <Link
              className="flex w-full items-center justify-center gap-2 rounded-[20px] border-2 border-[#591DA9] bg-[#591DA9] dark:[background:var(--background-image-flashcard-gradient)] py-4 hover:bg-[#591DA9]/30"
              href={`/dashboard/study-deck/${id}/notes`}
            >
              <NotebookPen size={30} />
              <p className="text-xl font-normal">Summary</p>
            </Link>
            <Link
              className="flex w-full items-center justify-center gap-2 rounded-[20px] border-2 border-[#591DA9] bg-[#591DA9] dark:[background:var(--background-image-flashcard-gradient)]  py-4 hover:bg-[#591DA9]/30"
              href={`/dashboard/study-deck/${id}/flashcard`}
            >
              <NotebookPen size={30} />
              <p className="text-xl font-normal">Flashcards</p>
            </Link>
            <CreateTest id={id} title={courseTitle} />
          </div>

          {updatedFlashcards.length > 0 && (
            <div className="w-full">
              <FlashcardArray
                flashcard={updatedFlashcards}
                isFlashcard={false}
              />
            </div>
          )}
        </div>
        {updatedFlashcards.length > 0 && (
          <FlashcardList
            flashcards={updatedFlashcards}
            handleFlashcardsChange={setUpdatedFlashcards}
            id={id}
          />
        )}
      </div>
    </>
  );
}

"use client";

import StudyDeckHeader from "@/components/studydeck/studydeck-header";
import FlashcardItem from "@/components/studydeck/flashcard-item";
import CourseItem from "@/components/studydeck/course-item";
import ProgressWidget from "@/components/studydeck/progress-widget";
import styles from "./study-deck.module.css";
import type { StudyDeckData } from "@/types/study-deck";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StudyDeckDashboardClient({
  data,
}: {
  data: StudyDeckData;
}) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [deadline, setDeadline] = useState<string>("");

  const handleCreateCourse = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled Course",
          content: [
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ],
          isAiGenerated: false,
          lastModified: new Date(),
          deadline: deadline || undefined,
          flashcards: [
            {
              Front: "Front of card",
              Back: "Back of card",
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const newNote = await response.json();
      setDeadline("");
      setShowDeadlineModal(false);
      router.push(`/dashboard/study-deck/${newNote.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const openCreateModal = () => {
    setShowDeadlineModal(true);
  };

  const cancelCreate = () => {
    setShowDeadlineModal(false);
    setDeadline("");
  };

  return (
    <>
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-4 rounded-lg bg-primary-7 p-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray border-t-accent-200"></div>
            <p className="text-light">Creating new course...</p>
          </div>
        </div>
      )}

      {showDeadlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col gap-6 rounded-lg bg-primary-7 p-8 w-[400px]">
            <h3 className="text-2xl font-bold text-light">Create New Course</h3>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="deadline" className="text-light text-sm font-medium">
                Set Deadline (Optional)
              </label>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="px-4 py-2 rounded-lg bg-primary-8 text-light border border-primary-3 focus:outline-none focus:border-accent-200"
              />
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={cancelCreate}
                className="px-6 py-2 rounded-3xl bg-gray/20 text-light hover:bg-gray/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCourse}
                disabled={isCreating}
                className="px-6 py-2 rounded-3xl bg-primary hover:bg-primary/90 text-light transition-colors disabled:opacity-50"
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 w-full min-w-0 overflow-hidden">
        <StudyDeckHeader userName={data.userName} />

      <section className="mb-12 px-8 min-w-0 bg-[#591DA9] dark:bg-transparent dark:text-light dark:pt-0 pt-4 rounded-xl">
        <h2 className="text-3xl font-bold mb-6">
          Recent Flashcards
        </h2>

        {data.recentFlashcards.length === 0 ? (
          <p className="px-10 opacity-70">
            You have not created any flashcards yet.
          </p>
        ) : (
          <div className="w-full overflow-hidden">
            <div
              className="overflow-x-auto pb-4"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#6B21A8 transparent" }}
            >
              <div
                className="flex items-start gap-6 w-max"
              >
                {data.recentFlashcards.map((flashcard) => (
                  <FlashcardItem
                    key={flashcard.id}
                    courseName={flashcard.courseName}
                    progress={flashcard.progress}
                    imageUrl={flashcard.imageUrl}
                    href={`/dashboard/study-deck/${flashcard.noteId}/flashcard`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-between mb-12 gap-10">
        <section className="min-w-0 max-w-[1000px] flex-1 dark:text-light bg-[#591DA9] dark:bg-transparent pt-5 px-8 rounded-xl ">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold ">My Courses</h2>
            <button
              onClick={openCreateModal}
              disabled={isCreating}
              className="bg-primary hover:bg-primary/90 text-light rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {data.myCourses.length === 0 ? (
            <p className="text-light/70">
              No courses yet. Create notes to start building your study deck.
            </p>
          ) : (
            <div
              className="space-y-3 max-h-[380px] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#6B21A8 transparent",
              }}
            >
              {data.myCourses.map((course) => (
                <CourseItem
                  key={course.id}
                  courseName={course.courseName}
                  icon={course.icon}
                  href={`/dashboard/study-deck/${course.id}`}
                  deadline={course.deadline}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="w-[420px] flex-shrink-0">
          <ProgressWidget weeklyProgress={data.weeklyProgress} />
        </aside>
      </div>
    </div>
    </>
  );
}

"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/modified-textarea";
import { useState } from "react";
import LoadingSpinner from "@/components/feedback/loading-spinner";
import { runWithToast, showErrorToast } from "@/lib/toast";

interface flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardModalProps {
  handleFlashcardChange: (flashcard: flashcard) => void;
  id: string;
}

export default function Flashcardmodal({
  handleFlashcardChange,
  id,
}: FlashcardModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!front.trim() || !back.trim()) {
      showErrorToast("Please provide both a term and a definition.");
      return;
    }

    setIsSaving(true);

    try {
      await runWithToast(
        async () => {
          const response = await fetch("/api/flashcard", {
            headers: {
              contentType: "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              id: id,
              front,
              back,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Failed to save flashcard" }));
            
            // Check if it's a subscription limit error
            if (response.status === 403) {
              throw new Error(`${errorData.message || "Daily flashcard limit reached."}\nUpgrade to Premium for unlimited flashcards!`);
            }
            
            throw new Error(errorData.message || "Failed to save flashcard");
          }

          const data = await response.json();
          handleFlashcardChange({
            id: data.id,
            front,
            back,
          });

          setFront("");
          setBack("");
        },
        {
          loading: "Saving flashcard...",
          success: "Flashcard saved",
          error: "Failed to save flashcard",
        },
        { toastId: "saveFlashcard" }
      );
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex gap-2 rounded-xl border border-white px-6 py-[16px] transition-opacity hover:bg-[#591DA9]/30">
          <Plus size={24} />
          <p className="text-lg font-normal">Add Deck</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:min-w-[1000px]">
        <DialogTitle className="hidden">Add Deck</DialogTitle>
        <div
          className="min-w-4/5 space-y-8 rounded-3xl bg-secondary-8 px-14 pb-10 pt-20"
          style={{ boxShadow: "0px 0px 20px 2px rgba(89, 29, 169, 0.50)" }}
        >
          <h1 className="text-5xl font-bold">Add Card</h1>
          <div className="rounded-2xl border border-white px-[40px]">
            <input
              type="text"
              placeholder="Enter Term"
              className="w-full resize-none whitespace-pre-wrap break-words border-none bg-transparent py-4 text-2xl font-normal text-white outline-none placeholder:text-[#C0B4D0] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              value={front}
              onChange={(e) => setFront(e.target.value)}
            />
          </div>
          <div className="min-h-[140px] rounded-2xl border border-white px-[40px]">
            <Textarea
              placeholder="Enter Definition"
              className="w-full resize-none whitespace-pre-wrap break-words border-none bg-transparent py-4 text-2xl font-normal text-white outline-none placeholder:text-[#C0B4D0] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <button className="flex h-fit rounded-xl border border-white px-6 py-3 transition-opacity hover:bg-[#591DA9]/30">
                <p>Cancel</p>
              </button>
            </DialogClose>
            <button
              className="flex h-fit rounded-xl bg-[radial-gradient(50%_50%_at_50%_50%,#9B77CB_0%,#591DA9_100%)] px-6 py-3 transition-opacity hover:opacity-90"
              style={{
                boxShadow:
                  "0px 2px 1px 0px rgba(255, 255, 255, 0.25) inset, 0px -4px 2px 0px rgba(0, 0, 0, 0.25) inset, 0px 0px 1px 4px rgba(255, 255, 255, 0.10)",
              }}
              onClick={() => handleSave()}
              disabled={isSaving}
            >
              {isSaving ? (
                <LoadingSpinner
                  size={20}
                  thickness={3}
                  label="Saving..."
                  className="text-white"
                  variant="light"
                />
              ) : (
                <p>Add Card</p>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

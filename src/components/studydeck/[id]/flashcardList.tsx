"use client";
import { useState } from "react";
import { Ellipsis, Check } from "lucide-react";
import { Textarea } from "@/components/ui/modified-textarea";

import Flashcardmodal from "@/components/modals/add-flashcard-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface flashcardListProps {
  flashcards: {
    id: string;
    front: string;
    back: string;
  }[];
  id: string;
  handleFlashcardsChange: (flashcards: flashcard[]) => void;
}

interface flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardComponentProps {
  flashcard: flashcard;
  handleFlashcardChange: (flashcard: flashcard) => void;
  handleDeleteFlashcard: (flashcard: flashcard) => void;
}

const FlashcardComponent = ({
  flashcard,
  handleFlashcardChange,
  handleDeleteFlashcard,
}: FlashcardComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [front, setFront] = useState(flashcard.front);
  const [back, setBack] = useState(flashcard.back);

  const handleSave = () => {
    setIsEditing(false);

    try {
      fetch("/api/flashcard", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          id: flashcard.id,
          front,
          back,
          type: "update",
        }),
      });
    } catch (error) {
      console.error("An error occurred:", error);
      return;
    }

    handleFlashcardChange({
      id: flashcard.id,
      front,
      back,
    });
  };

  const handleDelete = () => {
    try {
      fetch("/api/flashcard", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({
          id: flashcard.id,
        }),
      });
    } catch (error) {
      console.error("An error occurred:", error);
      return;
    }

    handleDeleteFlashcard(flashcard);
  };

  return (
    <div className="bg-[#231942] dark:[background:var(--background-image-flashcard-gradient)] text-white p-7 rounded-xl border-[#591DA9] border-2 flex min-h-[110px] justify-between">
      <div className="flex flex-1">
        <div className="pr-4 border-r-2 border-white max-w-[300px] min-w-[300px] text-wrap">
          {isEditing ? (
            <Textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="bg-transparent text-white border-white/20 resize-none text-xl font-normal w-full p-0 border-none focus:ring-0 focus-visible:ring-0 whitespace-pre-wrap break-words"
              placeholder="Front of flashcard"
            />
          ) : (
            <h1 className="text-xl font-normal text-wrap break-words">
              {front}
            </h1>
          )}
        </div>
        <div className="pl-4 font-normal text-xl flex-1">
          {isEditing ? (
            <Textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="bg-transparent text-white border-white/20 resize-none h-full text-xl font-normal w-full p-0 border-none focus:ring-0 focus-visible:ring-0"
              placeholder="Back of flashcard"
            />
          ) : (
            <p>{back}</p>
          )}
        </div>
      </div>
      <div>
        {isEditing ? (
          <button
            onClick={() => handleSave()}
            className="hover:opacity-80 transition-opacity"
          >
            <Check size={24} />
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis size={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-purple-600 text-white">
              <DropdownMenuItem
                onClick={() => setIsEditing(true)}
                className="hover:bg-gradient-to-r from-[#9B77CB] to-[#591DA9] hover:text-white focus:bg-gradient-to-r focus:from-[#9B77CB] focus:to-[#591DA9] focus:text-white"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gradient-to-r from-[#9B77CB] to-[#591DA9] hover:text-white focus:bg-gradient-to-r focus:from-[#9B77CB] focus:to-[#591DA9] focus:text-white"
                onClick={() => handleDelete()}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default function FlashcardList({
  flashcards,
  id,
  handleFlashcardsChange,
}: flashcardListProps) {
  const handleFlashcardChange = (flashcard: flashcard) => {
    const updatedFlashcards = flashcards.map((f) => {
      if (f.id === flashcard.id) {
        return flashcard;
      }
      return f;
    });

    handleFlashcardsChange(updatedFlashcards);
  };

  const handleAddFlashcard = (flashcard: flashcard) => {
    console.log("Adding flashcard with id:", id); // Add this log to debug
    handleFlashcardsChange([...flashcards, flashcard]);
  };

  const handleDeleteFlashcard = (flashcard: flashcard) => {
    const updatedFlashcards = flashcards.filter((f) => f.id !== flashcard.id);
    handleFlashcardsChange(updatedFlashcards);
  };

  return (
    <div className="w-full mt-7 py-[42px] px-[80px] bg-[var(--major-surface-muted)] space-y-8 rounded-xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-normal mb-4">Flashcards</h1>
        <Flashcardmodal handleFlashcardChange={handleAddFlashcard} id={id} />
      </div>
      {flashcards.map((flashcard, index) => (
        <FlashcardComponent
          key={index}
          flashcard={flashcard}
          handleFlashcardChange={handleFlashcardChange}
          handleDeleteFlashcard={handleDeleteFlashcard}
        />
      ))}
    </div>
  );
}

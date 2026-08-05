"use client";
import { useState } from "react";
import Flashcard from "@/components/studydeck/[id]/flashcard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FlashcardArrayProps {
  flashcard: {
    id: string;
    front: string;
    back: string;
    isAnswered: boolean;
  }[];
  progress: number;
}

export default function FlashcardArray({
  flashcard,
  progress,
}: FlashcardArrayProps) {
  const [currentCard, setCurrentCard] = useState(
    flashcard.filter((flashcard) => flashcard.isAnswered).length
  );
  const [progressState, setProgressState] = useState(progress);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNextCard = async () => {
    if (currentCard === flashcard.length - 1) {
      return;
    }

    setProgressState(((currentCard + 1) / flashcard.length) * 100);
    setCurrentCard((prev) => prev + 1);
    setIsFlipped(false);

    try {
      await fetch("/api/flashcard", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          id: flashcard[currentCard].id,
          isAnswered: true,
          progress: ((currentCard + 1) / flashcard.length) * 100,
          type: "progress update",
        }),
      });
    } catch (error) {
      console.error("An error occurred:", error);
      return;
    }
  };

  const handlePrevCard = async () => {
    if (currentCard === 0) {
      return;
    }

    setProgressState((currentCard / flashcard.length) * 100);
    setCurrentCard((prev) => prev - 1);
    setIsFlipped(false);

    try {
      await fetch("/api/flashcard", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          id: flashcard[currentCard].id,
          isAnswered: false,
          progress: (currentCard / flashcard.length) * 100,
          type: "progress update",
        }),
      });
    } catch (error) {
      console.error("An error occurred:", error);
      return;
    }
  };

  return (
    <div className="bg-flashcard-background-gradient">
      <Progress value={progressState} />
      <div>
        <div className="flex items-center justify-center mt-4 h-[530px] px-[70px] py-[50px] rounded-xl overflow-hidden">
          <Flashcard
            front={flashcard[currentCard].front}
            back={flashcard[currentCard].back}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />
        </div>
        <div>
          <div className="flex items-center justify-center gap-12 mt-6">
            <button
              className="flex items-center justify-center px-7 py-2 dark:border-[#CB98ED] border-[#591DA9] rounded-xl border"
              onClick={handlePrevCard}
            >
              <ArrowLeft size={24} className="dark:text-light text-[#591DA9]" />
            </button>
            <h1 className="font-semibold text-xl dark:text-light text-[#591DA9]">
              {" "}
              {currentCard + 1} / {flashcard.length}
            </h1>
            <button
              className="flex items-center justify-center px-7 py-2 dark:border-[#CB98ED] border-[#591DA9] rounded-xl border"
              onClick={handleNextCard}
            >
              <ArrowRight size={24} className="dark:text-light text-[#591DA9]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

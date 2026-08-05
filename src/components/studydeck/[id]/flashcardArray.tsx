"use client";
import { useState } from "react";
import Flashcard from "./flashcard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FlashcardArrayProps {
  flashcard: {
    front: string;
    back: string;
  }[];
  isFlashcard: boolean;
}

export default function FlashcardArray({
  flashcard,
  isFlashcard,
}: FlashcardArrayProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNextCard = () => {
    if (currentCard === flashcard.length - 1) {
      return;
    }
    setCurrentCard((prev) => prev + 1);
    setIsFlipped(false);
  };

  const handlePrevCard = () => {
    if (currentCard === 0) {
      return;
    }
    setCurrentCard((prev) => prev - 1);
    setIsFlipped(false);
  };

  return (
    <div className="mt-8">
      {isFlashcard && <Progress value={33} />}
      <div className="flex items-center justify-center mt-4 h-[480px]">
        <Flashcard
          front={flashcard[currentCard].front}
          back={flashcard[currentCard].back}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
        />
      </div>
      <div>
        <div className="flex items-center justify-center gap-12 mt-8 dark:text-light text-[#591DA9]">
          <button
            className="flex items-center justify-center px-7 py-2 dark:border-[#CB98ED] border-[#591DA9] rounded-xl border"
            onClick={handlePrevCard}
          >
            <ArrowLeft size={24} className="dark:text-light text-[#591DA9]" />
          </button>
          <h1 className="font-semibold text-xl ">
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
  );
}

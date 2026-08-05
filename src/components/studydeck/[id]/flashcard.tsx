"use client";

import React from "react";

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}

export default function Flashcard({
  front,
  back,
  isFlipped,
  setIsFlipped,
}: FlashcardProps) {
  const cardFrontClasses =
    "absolute w-full h-full rounded-xl shadow-lg p-8 flex items-center justify-center border-2 border-[#591DA9] bg-[#591DA9] dark:[background:var(--background-image-flashcard-gradient)] [backface-visibility:hidden]";
  
  const cardBackClasses =
    "absolute w-full h-full rounded-xl shadow-lg p-8 flex items-center justify-center border-2 border-[#CB98ED] bg-[#2A1055] dark:bg-[#591DA9] [backface-visibility:hidden]";

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      className={`relative w-full h-full cursor-pointer [perspective:1200px] transition-all duration-300 ${
        isFlipped ? "drop-shadow-[0_0_20px_rgba(203,152,237,0.6)]" : ""
      }`}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front of card */}
        <div className={cardFrontClasses}>
          <p className="text-2xl font-medium text-white text-center break-words">
            {front}
          </p>
        </div>

        {/* Back of card */}
        <div className={`${cardBackClasses} [transform:rotateY(180deg)]`}>
          <p className="text-2xl font-semibold text-[#E0C3FF] dark:text-[#E0C3FF] text-center break-words italic">
            {back}
          </p>
        </div>
      </div>
    </div>
  );
}

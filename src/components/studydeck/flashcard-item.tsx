"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface FlashcardItemProps {
  courseName: string;
  progress: number; // 0-100
  imageUrl?: string;
  href?: string;
  onClick?: () => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({
  courseName,
  progress,
  imageUrl = "/flashcard-bg.png",
  href,
  onClick,
}) => {
  const router = useRouter();
  const isInteractive = Boolean(onClick || href);
  const cardClasses = [
    "flex-shrink-0 rounded-xl overflow-hidden max-w-[280px] hover:scale-105 transition-transform duration-200 mb-10",
    isInteractive ? "cursor-pointer" : "cursor-default",
  ].join(" ");

  const handleNavigate = () => {
    onClick?.();
    if (href) {
      router.push(href);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <div
      className={cardClasses}
      style={{ minWidth: "280px" }}
      onClick={isInteractive ? handleNavigate : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {/* Card Image/Background */}
      <div className="h-[160px] flex items-center justify-center relative">
        {/* Gradient Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-400 to-purple-800 z-0" />

        {/* Image Layer on Top */}
        {imageUrl && (
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
      </div>

      {/* Card Content */}
      <div className="bg-[var(--studydeck-card-surface)] p-4">
        <h3 className="text-white font-semibold text-sm mb-2">{courseName}</h3>

        {/* Progress Info */}
        <div className="space-y-2">
          <p className="text-gray-400 text-xs">{progress}% completed</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;

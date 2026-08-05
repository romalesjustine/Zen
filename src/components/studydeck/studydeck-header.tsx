'use client';

import React from 'react';

interface StudyDeckHeaderProps {
  userName?: string;
  onSearch?: (query: string) => void;
}

const StudyDeckHeader: React.FC<StudyDeckHeaderProps> = ({
  userName = 'Sam',
  onSearch,
}) => {
  return (
    <div className="flex justify-between items-center mb-8 px-10">
      {/* Left: Greeting */}
      <h1 className="text-3xl text-black dark:text-white">Hi, {userName}! 👋</h1>

      {/* Right: Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Course"
          className="bg-[var(--studydeck-input-surface)] text-light rounded-lg px-4 py-2 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default StudyDeckHeader;

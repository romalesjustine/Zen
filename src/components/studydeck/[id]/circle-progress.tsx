"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const CircleProgress = ({ progress }: { progress: number }) => {
  const [, setCurrentProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Reset to 0 when progress changes
    setCurrentProgress(0);
    setDisplayProgress(0);

    // Animate circle progress
    const circleTimer = setTimeout(() => {
      setCurrentProgress(progress);
    }, 100);

    // Animate number counting
    const duration = 1000; // 1 second
    const steps = 60; // 60 steps for smooth animation
    const increment = progress / steps;
    let current = 0;

    const counterTimer = setInterval(() => {
      current += increment;
      if (current >= progress) {
        current = progress;
        clearInterval(counterTimer);
      }
      setDisplayProgress(Math.round(current));
    }, duration / steps);

    return () => {
      clearTimeout(circleTimer);
      clearInterval(counterTimer);
    };
  }, [progress]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const circles = Math.floor(progress / 100);
  const remainingProgress = progress % 100;
  const strokeDashoffset =
    circumference - (remainingProgress / 100) * circumference;

  return (
    <div className="relative h-24 w-24">
      <svg className="h-full w-full -rotate-90 transform">
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#591DA9" />
            <stop offset="100%" stopColor="#C795E9" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          className="fill-none stroke-accent-200/20"
          strokeWidth="16"
        />

        {/* Complete circles for every 100% with rotation offset */}
        {[...Array(circles)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 48 48)`}>
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="fill-none"
              stroke="url(#progressGradient)"
              strokeWidth="16"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: 0,
                opacity: 0.4 + (0.6 * (i + 1)) / circles,
                transition: "all 1s ease-in-out",
              }}
            />
          </g>
        ))}

        {/* Remaining progress circle */}
        {remainingProgress > 0 && (
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="fill-none"
            stroke="url(#progressGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transition: "stroke-dashoffset 1s ease-in-out",
            }}
          />
        )}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className={cn(
            "text-lg font-bold text-gray",
            progress > 100 && "text-accent-200",
          )}
        >
          {displayProgress}%
        </p>
      </div>
    </div>
  );
};

export default CircleProgress;

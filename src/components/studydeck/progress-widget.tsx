"use client";

import Link from "next/link";
import React from "react";

interface ProgressWidgetProps {
  weeklyProgress?: number;
}

const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  weeklyProgress: _weeklyProgress = 75, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  return (
    <div
      className="rounded-3xl p-6 relative overflow-hidden text-[#6A34B2] dark:text-light"
      style={{
        backgroundImage: "url(/track-progress-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-purple-500/20" />

      <div className="relative z-10 mb-60">
        <h3 className=" text-xl font-medium mb-1 w-60">
          Track Your Study Progress!
        </h3>
        <p className="text-sm w-50">
          See how much you&apos;ve accomplished this week.
        </p>
      </div>

      {/* Check Progress Button */}
      <Link
        href="/dashboard/progress-tracker"
        className="relative z-10 w-full text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden radial-gradient-button h-12 cursor-pointer"
      >
        Check Progress ✨
      </Link>
    </div>
  );
};

export default ProgressWidget;

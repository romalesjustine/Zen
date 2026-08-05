"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageLimitBannerProps {
  className?: string;
}

interface UsageStats {
  tier: "FREE" | "PREMIUM";
  uploads: { used: number; limit: number | string; remaining: number | string };
  flashcards: { used: number; limit: number | string; remaining: number | string };
  aiChars: { used: number; limit: number | string; remaining: number | string };
}

export function UsageLimitBanner({ className }: UsageLimitBannerProps) {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await fetch("/api/usage-stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch usage stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats || stats.tier === "PREMIUM") {
    return null;
  }

  const uploadsPercent = typeof stats.uploads.limit === 'number' 
    ? (stats.uploads.used / stats.uploads.limit) * 100 
    : 0;
  const flashcardsPercent = typeof stats.flashcards.limit === 'number'
    ? (stats.flashcards.used / stats.flashcards.limit) * 100
    : 0;
  const aiCharsPercent = typeof stats.aiChars.limit === 'number'
    ? (stats.aiChars.used / stats.aiChars.limit) * 100
    : 0;

  const isNearLimit = uploadsPercent >= 80 || flashcardsPercent >= 80 || aiCharsPercent >= 80;
  const hasReachedLimit = uploadsPercent >= 100 || flashcardsPercent >= 100 || aiCharsPercent >= 100;

  if (!isNearLimit && !hasReachedLimit) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-4 mb-4",
        hasReachedLimit
          ? "border-red-500/50 bg-red-500/10"
          : "border-yellow-500/50 bg-yellow-500/10",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle 
          className={cn(
            "h-5 w-5 mt-0.5 flex-shrink-0",
            hasReachedLimit ? "text-red-400" : "text-yellow-400"
          )} 
        />
        <div className="flex-1 space-y-3">
          <div>
            <h3 className={cn(
              "font-semibold mb-1",
              hasReachedLimit ? "text-red-300" : "text-yellow-300"
            )}>
              {hasReachedLimit ? "Daily Limit Reached" : "Approaching Daily Limit"}
            </h3>
            <p className="text-sm text-gray-300">
              {hasReachedLimit 
                ? "You've reached your daily usage limit. Upgrade to Premium for unlimited access!"
                : "You're running low on your daily quota. Consider upgrading to Premium!"}
            </p>
          </div>

          <a
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-medium transition-all text-sm"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to Premium
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: number;
  thickness?: number;
  label?: string;
  className?: string;
  variant?: "default" | "light";
}

const LoadingSpinner = ({
  size = 32,
  thickness = 4,
  label,
  className,
  variant = "default",
}: LoadingSpinnerProps) => {
  const ringStyles =
    variant === "light"
      ? "border-white/40 border-t-white"
      : "border-accent-200 border-t-primary";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-gray",
        className
      )}
    >
      <span
        className="relative inline-flex"
        style={{ width: size, height: size }}
      >
        <span
          className={cn(
            "absolute inset-0 animate-spin rounded-full border-solid",
            ringStyles
          )}
          style={{ borderWidth: thickness }}
        />
      </span>
      {label ? <span>{label}</span> : null}
    </span>
  );
};

export default LoadingSpinner;

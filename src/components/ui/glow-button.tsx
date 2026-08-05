import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const GlowButton = ({
  className,
  showIcon = true,
  children,
  ...props
}: GlowButtonProps) => {
  return (
    <button
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-full px-10 py-2 text-lg transition-all duration-300",
        "before:absolute before:inset-0 before:rounded-full",
        "before:bg-[radial-gradient(circle_at_center,#9b77cb_0%,#591da9_100%)]",
        "before:shadow-[inset_0px_2px_1px_rgba(255,255,255,0.25),inset_0px_-4px_2px_rgba(0,0,0,0.25)]",
        "before:transition-all before:duration-300 hover:before:opacity-50 hover:before:shadow-[inset_0px_2px_1px_rgba(255,255,255,0.75),inset_0px_-4px_2px_rgba(0,0,0,0.45)]",
        "border-[3px] border-white/10",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 select-none">{children}</span>
      {showIcon && <Sparkles className="z-10 h-4 w-4 fill-white" />}
    </button>
  );
};

export default GlowButton;

import React from "react";
import { cn } from "@/lib/utils";

interface GlareProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Glare = ({ className, ...props }: GlareProps) => {
  return (
    <div
      className={cn(
        "animate-twinkle relative h-8 w-8 bg-black opacity-20 mix-blend-color-dodge",
        className
      )}
      {...props}
    >
      <div
        className="absolute left-6 top-0 h-12 w-0.5 overflow-hidden rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,1.0) 15%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        className="absolute left-0 top-6 h-0.5 w-12 overflow-hidden rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,1.0) 15%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
};

export default Glare;

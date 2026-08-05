import { cn } from "@/lib/utils";
import React from "react";

const Slide = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 h-full w-full transition-all duration-1000",
        // isActive ? "opacity-100 delay-500" : "-z-50 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Slide;

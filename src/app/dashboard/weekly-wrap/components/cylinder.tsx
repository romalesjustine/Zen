import { cn } from "@/lib/utils";
import React from "react";

const Cylinder = ({ className }: { className?: string }) => {
  return (
    <div className={cn("cylinder absolute", className)}>
      <div className="relative">
        <div
          className={cn(
            "absolute left-0 top-0 z-20 aspect-square w-40 origin-top-right rounded-full bg-accent-200 [transform:rotateX(60deg)]",
          )}
        />
        <div className="absolute z-50 h-40 w-40 -translate-y-[60%] rounded-full bg-[linear-gradient(180deg,white_25%,#6a34b2_150%)] shadow-[inset_0px_-16px_20px_#0050A3]" />
        <div
          className={cn(
            "absolute left-0 top-10 h-[50vh] w-40",
            "before:absolute before:left-0 before:top-0 before:-z-10",
            "before:h-full before:w-full before:bg-[linear-gradient(180deg,#9b77cb_0%,#051960_100%)]",
            "after:absolute after:left-0 after:top-0 after:z-10",
            "bg-cover after:h-full after:w-full after:bg-[url('/noise.jpg')]",
            "after:opacity-10 after:mix-blend-overlay",
          )}
        />
      </div>
    </div>
  );
};

export default Cylinder;

import GlowButton from "@/components/ui/glow-button";
import { cn } from "@/lib/utils";
import React from "react";

const IntroSlide = ({ goToNextPage }: { goToNextPage: () => void }) => {
  return (
    <div
      className={cn(
        "z-50 flex h-full w-full flex-col items-center justify-center gap-12 opacity-100 transition-all delay-500 duration-500",
      )}
    >
      <div className="glow-down absolute -top-1/2 left-1/2 -z-0 aspect-square w-80 -translate-x-1/2 rounded-full bg-accent-100 blur-[150px]" />
      <div className="glow-up absolute -bottom-[65%] left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 rounded-full bg-primary blur-[150px]" />

      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-4xl font-bold">Your Weekly Study Wrap</p>
        <p className="w-3/4 lg:w-max">
          A recap of your key takeaways from this week&apos;s notes
        </p>
      </div>
      <div className="flex w-full flex-col items-center justify-center -space-y-28">
        <div className="animate-glow inner-glow-multi h-52 w-52 rounded-full bg-[#fee9c2]" />
        <div className="animate-orbit inner-glow h-52 w-52 rounded-full bg-white/10 blur-sm backdrop-blur-xl" />
      </div>
      <GlowButton onClick={goToNextPage} className="mt-8">
        Check Progress
      </GlowButton>
    </div>
  );
};

export default IntroSlide;

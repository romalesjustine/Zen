import { cn } from "@/lib/utils";
import React from "react";
import Slide from "../components/slide";
import { useGSAP } from "@gsap/react";

const FifthSlide = ({
  timeline,
  totalNotes,
  mostReviewed,
  studyStreak,
  aiSuggestion,
}: {
  timeline: GSAPTimeline;
  totalNotes: number;
  mostReviewed: string;
  studyStreak: number;
  aiSuggestion: string;
}) => {
  useGSAP(() => {
    timeline.add("start");

    timeline.fromTo(
      ".slide-content",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        delay: 0.5,
      },
      "start",
    );

    timeline.fromTo(
      ".stat",
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
      },
      "<1",
    );

    timeline.fromTo(
      ".stat-last",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      ">2",
    );
  });

  return (
    <Slide className="slide relative">
      <div
        className={cn(
          "slide-content absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-12 bg-[url(/summary-bg.png)] bg-cover bg-center opacity-0",
        )}
      >
        <div className="flex h-full flex-col items-center justify-center gap-2 self-start">
          <div className="z-50 flex w-3/4 flex-col items-center justify-center gap-12">
            <p className="stat text-5xl font-bold uppercase">
              Smart Study Insights
            </p>
            <div className="flex flex-col items-start justify-center gap-8 text-start">
              <p className="stat text-3xl">
                Notes Taken: <span className="font-bold">{totalNotes}</span>
              </p>
              <p className="stat text-3xl">
                Study Streak:{" "}
                <span className="font-bold">{studyStreak} Days in a Row! </span>
              </p>
              <p className="stat text-3xl">
                Top Focus Area:{" "}
                <span className="font-bold">{mostReviewed}</span>
              </p>
              <p className="stat text-3xl">
                AI Suggests: <span className="font-bold">{aiSuggestion}</span>
              </p>
            </div>
            <p className="stat-last text-3xl font-bold">
              Keep going! Every note gets you closer to mastery.
            </p>
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default FifthSlide;

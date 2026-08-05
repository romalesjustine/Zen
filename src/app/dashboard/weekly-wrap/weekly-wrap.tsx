"use client";

import gsap from "gsap";
import { cn, glaresPositions } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import FirstSlide from "./slides/slide1";
import FifthSlide from "./slides/slide5";
import ThirdSlide from "./slides/slide3";
import FourthSlide from "./slides/slide4";
import IntroSlide from "./slides/intro-slide";
import PageLoadingBar from "./components/page-loading-bar";
import SecondSlide from "./slides/slide2";
import Glare from "@/components/glare";
import SixthSlide from "./slides/slide6";

const SLIDES = [
  { Component: FirstSlide, id: 1 },
  { Component: FifthSlide, id: 2 },
  { Component: ThirdSlide, id: 3 },
  { Component: FourthSlide, id: 4 },
  { Component: FifthSlide, id: 5 },
  { Component: SixthSlide, id: 6 },
] as const;

export const generateGlares = () => {
  return Array.from({ length: 9 }, (_, i) => (
    <Glare
      key={i}
      className={`absolute`}
      style={{
        left: glaresPositions[i].left,
        top: glaresPositions[i].top,
        animationDelay: glaresPositions[i].delay,
        animationDuration: glaresPositions[i].duration,
      }}
    />
  ));
};

export interface WeeklyWrapProps {
  username: string;
  startDate: string;
  endDate: string;
  totalNotes: number;
  prevTotalNotes: number;
  longestStudySession: number;
  studyStreak: number;
  mostReviewed: string;
  mostReviewedTotalExam: number;
  mostReviewedPassedExam: number;
  weakArea: string;
  summaryNotes: string;
  aiSuggestion: string;
  catPersonality:
    | "Curious Cat"
    | "Focused Feline"
    | "Strategic Stray"
    | "Goal-Getter Kitten"
    | "Night Owl Panther"
    | "Chill Kitty"
    | "Adaptive Alley Cat";
}

const WeeklyWrap: React.FC<WeeklyWrapProps> = (weeklyWrapStats) => {
  console.log("In weekly-wrap.tsx Weekly Wrap: ", weeklyWrapStats);

  const [isAtStart, setIsAtStart] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  const timelines = useRef([
    gsap.timeline(),
    gsap.timeline(),
    gsap.timeline(),
    gsap.timeline(),
    gsap.timeline(),
    gsap.timeline(),
  ]);

  const handleStart = () => {
    setIsAtStart(false);
    setIsPaused(false);
  };

  const onArrowClick = (action: "next" | "back") => {
    if (action === "next") {
      if (currentPage < SLIDES.length) {
        setCurrentPage((prev) => {
          timelines.current[prev - 1].restart();
          return prev + 1;
        });
      } else {
        return;
      }
    } else if (action === "back") {
      if (currentPage > 1) {
        setCurrentPage((prev) => {
          timelines.current[prev - 1].restart();
          return prev - 1;
        });
      } else {
        return;
      }
    }

    setIsPaused(false);
  };

  const onAnimationEnd = () => {
    if (currentPage < SLIDES.length) {
      setCurrentPage((prev) => prev + 1);
    } else {
      timelines.current[currentPage - 1].restart();
      setIsPaused(true);
    }
  };

  // useEffect(() => {
  //   if (currentPage === 0) {
  //     setCurrentPage(0);
  //     setIsAtStart(false);
  //     setIsPaused(true);
  //   }
  // }, [currentPage]);

  useEffect(() => {
    timelines.current[currentPage - 1].paused(isPaused);
  }, [isPaused, currentPage]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* Left scroll button */}
      <button
        onClick={() => onArrowClick("back")}
        className={cn(
          isMobile ? "absolute left-2 top-1/2 z-50" : "block",
          "rounded-full bg-accent-200/50 p-1 hover:bg-accent-200 disabled:pointer-events-none disabled:opacity-20"
        )}
        disabled={currentPage <= 1 || isAtStart}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="relative flex h-[calc(100vh_-_64px)] w-full flex-1 overflow-hidden bg-gradient-to-br from-primary/20 to-[#051960]/0 px-6 text-center lg:m-8 lg:my-0 lg:h-[calc(100%_-_3rem)] lg:rounded-2xl 2xl:p-0">
        {isAtStart ? (
          <>
            {generateGlares()}
            <IntroSlide goToNextPage={handleStart} />
          </>
        ) : (
          <>
            <div className="absolute left-0 top-0 z-50 flex w-full max-w-full items-center gap-1 p-4 transition-all duration-200">
              <PageLoadingBar
                duration={13}
                isActive={currentPage === 1}
                setActivePage={setCurrentPage}
                isPaused={isPaused}
                onAnimationEnd={onAnimationEnd}
              />
              <PageLoadingBar
                duration={15.75}
                isActive={currentPage === 2}
                setActivePage={setCurrentPage}
                isPaused={isPaused}
                onAnimationEnd={onAnimationEnd}
              />
              <PageLoadingBar
                duration={18.5}
                isActive={currentPage === 3}
                setActivePage={setCurrentPage}
                isPaused={isPaused}
                onAnimationEnd={onAnimationEnd}
              />
              <PageLoadingBar
                duration={14.75}
                isActive={currentPage === 4}
                setActivePage={setCurrentPage}
                isPaused={isPaused}
                onAnimationEnd={onAnimationEnd}
              />
              <PageLoadingBar
                duration={12}
                isActive={currentPage === 5}
                setActivePage={setCurrentPage}
                isPaused={isPaused}
                onAnimationEnd={onAnimationEnd}
              />
              <PageLoadingBar
                duration={18}
                isActive={currentPage === 6}
                setActivePage={setCurrentPage}
                isPaused={isPaused}
                onAnimationEnd={onAnimationEnd}
              />
            </div>
            {isPaused ? (
              <Play
                size={20}
                className="absolute right-8 top-10 z-[250] cursor-pointer fill-gray text-transparent"
                onClick={() => setIsPaused((prev) => !prev)}
              />
            ) : (
              <Pause
                size={20}
                className="absolute right-8 top-10 z-[250] cursor-pointer fill-gray text-transparent"
                onClick={() => setIsPaused((prev) => !prev)}
              />
            )}
            {currentPage === 1 && (
              <FirstSlide
                timeline={timelines.current[0]}
                {...weeklyWrapStats}
              />
            )}

            {currentPage === 2 && (
              <SecondSlide
                timeline={timelines.current[1]}
                {...weeklyWrapStats}
              />
            )}

            {currentPage === 3 && (
              <ThirdSlide
                timeline={timelines.current[2]}
                {...weeklyWrapStats}
              />
            )}

            {currentPage === 4 && (
              <FourthSlide
                timeline={timelines.current[3]}
                {...weeklyWrapStats}
              />
            )}

            {currentPage === 5 && (
              <FifthSlide
                timeline={timelines.current[4]}
                {...weeklyWrapStats}
              />
            )}

            {currentPage === 6 && (
              <SixthSlide
                timeline={timelines.current[5]}
                {...weeklyWrapStats}
              />
            )}
          </>
        )}

        {/* {SLIDES.map(({ Component, id }) => (
          <Component
            key={id}
            isActive={currentPage === id}
            timeline={timelines.current[id]}
          />
        ))} */}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => onArrowClick("next")}
        disabled={currentPage === SLIDES.length || isAtStart}
        className={cn(
          isMobile ? "absolute right-2 top-1/2 z-50" : "block",
          "rounded-full bg-accent-200/50 p-1 hover:bg-accent-200 disabled:pointer-events-none disabled:opacity-20"
        )}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default WeeklyWrap;

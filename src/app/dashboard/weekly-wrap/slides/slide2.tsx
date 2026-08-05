import { cn, glaresPositions } from "@/lib/utils";
import React from "react";
import Cylinder from "../components/cylinder";
import { useGSAP } from "@gsap/react";
import Slide from "../components/slide";

const StaticGlare = ({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) => (
  <div
    style={style}
    className={cn(
      "relative h-8 w-8 bg-black opacity-20 mix-blend-color-dodge",
      className
    )}
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

const SecondSlide = ({
  timeline,
  startDate,
  endDate,
  totalNotes,
  prevTotalNotes,
  longestStudySession,
  studyStreak,
}: {
  timeline: GSAPTimeline;
  startDate: string;
  endDate: string;
  totalNotes: number;
  prevTotalNotes: number;
  longestStudySession: number;
  studyStreak: number;
}) => {
  const currentMonth = new Date(startDate).getMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const startMonthIndex = (currentMonth - 11 + 12) % 12;
  const orderedMonths = [];
  for (let i = 0; i < 12; i++) {
    orderedMonths.push(monthNames[(startMonthIndex + i) % 12]);
  }

  const targetY = -518;
  const finalY = -528;

  useGSAP(() => {
    timeline.add("start");

    timeline.fromTo(
      ".month-scroll",
      {
        y: 0,
        opacity: 0,
      },
      {
        opacity: 1,
        y: targetY,
        duration: 2,
        ease: "power2.inOut",
      },
      "start"
    );

    timeline
      .to(
        ".month-scroll",
        {
          y: targetY,
          duration: 0.3,
          ease: "power2.out",
        },
        ">-0.1"
      )
      .to(
        ".month-scroll",
        {
          y: finalY,
          duration: 0.2,
          ease: "power2.in",
        },
        ">"
      );

    timeline.to(
      ".month-scroll-container",
      {
        x: -100,
      },
      ">1"
    );

    timeline.fromTo(
      ".day-container",
      {
        opacity: 0,
        x: 125,
      },
      {
        opacity: 1,
        x: 125,
      },
      "<"
    );

    timeline.to(
      ".day-container",
      {
        opacity: 0,
      },
      ">1"
    );

    timeline.to(
      ".month-scroll-container",
      {
        opacity: 0,
      },
      "<"
    );

    timeline.fromTo(
      ".cylinder",
      {
        opacity: 0,
        y: 200,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
      },
      "<"
    );

    timeline.fromTo(
      ".static-glare",
      {
        opacity: 0,
        scale: 1,
      },
      {
        opacity: 0.4,
        scale: 1.2,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      },
      "<"
    );

    timeline.fromTo(
      ".quick-study-notes",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
      },
      "<"
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
        stagger: 0.3,
        duration: 1,
        ease: "power2.out",
      },
      "<"
    );

    timeline.fromTo(
      ".glow",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
      },
      "<"
    );

    timeline.fromTo(
      ".glow-1",
      {
        x: -100,
        y: -100,
      },
      {
        x: 500,
        y: 500,
        duration: 6,
        yoyo: true,
        repeat: -1,
      },
      "<"
    );

    timeline.fromTo(
      ".glow-2",
      {
        y: 100,
      },
      {
        y: -500,
        duration: 6,
        yoyo: true,
        repeat: -1,
      },
      "<"
    );

    timeline.to(
      ".cylinder",
      {
        opacity: 0,
        y: 200,
      },
      ">3"
    );

    timeline.to(
      ".quick-study-notes",
      {
        opacity: 0,
        duration: 1,
      },
      "<"
    );

    timeline.to(
      ".stat",
      {
        opacity: 0,
        y: 200,
        stagger: -0.3,
        duration: 1,
        ease: "power2.out",
      },
      "<"
    );

    timeline.to(
      ".slide",
      {
        opacity: 0,
      },
      "<0.5"
    );
  });

  return (
    <>
      {glaresPositions.map((pos, i) => (
        <StaticGlare
          key={i}
          className={`static-glare absolute`}
          style={{
            left: pos.left,
            top: pos.top,
          }}
        />
      ))}

      <Slide className="slide relative">
        <div>
          <div className="month-scroll-container absolute left-1/2 top-1/2 flex max-h-[48px] min-w-[200px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden">
            <div className="month-scroll flex flex-col">
              {orderedMonths.map((month, index) => (
                <p
                  key={index}
                  className="month-text text-5xl font-bold leading-none"
                >
                  {month}
                </p>
              ))}
            </div>
          </div>
          <div className="day-container absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="flex gap-4 text-5xl font-bold leading-none">
              <span className="text-accent-200">
                {new Date(startDate).getDate()}
              </span>{" "}
              to{" "}
              <span className="text-accent-200">
                {new Date(endDate).getDate()}
              </span>
            </p>
          </div>
          <div className="glow-1 glow absolute left-1/4 top-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/50 blur-[150px]" />
          <div className="glow-2 glow absolute left-1/3 top-1/2 -z-10 aspect-square w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-200/50 blur-[150px]" />
          <Cylinder className="left-[57.5%] top-3/4" />
          <Cylinder className="left-[70.5%] top-[60%]" />
          <Cylinder className="left-[83.5%] top-[45%]" />

          <div className="quick-study-notes absolute left-[15%] top-[15%] w-[500px]">
            <div className="mb-12 flex flex-col items-center justify-center gap-2">
              <p className="text-5xl font-bold">Quick Study Notes</p>
              <p className="text-lg">
                {new Date(startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                -{" "}
                {new Date(endDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="stat flex items-center gap-2">
              <p className="w-[150px] max-w-[150px] font-[Robinson] text-[120px] font-medium leading-none">
                {totalNotes}
              </p>
              <div className="flex flex-col items-start justify-center gap-1">
                <p className="flex gap-4 text-xl leading-none">
                  Total Notes Taken
                </p>
                <p className="text-gray">
                  <span className="font-bold text-white">
                    {totalNotes - prevTotalNotes > 0 && "+"}
                    {totalNotes - prevTotalNotes}
                  </span>{" "}
                  from last week
                </p>
              </div>
            </div>
            <div className="stat flex items-center gap-2">
              <p className="w-[200px] max-w-[200px] font-[Robinson] text-[120px] font-medium leading-none">
                {longestStudySession.toFixed(1)}
              </p>
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="flex gap-4 text-lg leading-none">
                  minutes of non-stop studying
                </p>
              </div>
            </div>
            <div className="stat flex items-center gap-2">
              <p className="w-[150px] max-w-[150px] font-[Robinson] text-[120px] font-medium leading-none">
                {studyStreak}
              </p>
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="flex gap-4 text-lg leading-none">
                  days of study streak!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Slide>
    </>
  );
};

export default SecondSlide;

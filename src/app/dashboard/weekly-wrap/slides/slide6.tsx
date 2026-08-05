import React from "react";
import { useGSAP } from "@gsap/react";
import Slide from "../components/slide";
import Image from "next/image";

const SixthSlide = ({
  timeline,
  catPersonality,
}: {
  timeline: GSAPTimeline;
  catPersonality:
    | "Curious Cat"
    | "Focused Feline"
    | "Strategic Stray"
    | "Goal-Getter Kitten"
    | "Night Owl Panther"
    | "Chill Kitty"
    | "Adaptive Alley Cat";
}) => {
  const catColors = {
    "Curious Cat": ["#090311", "#120622"],
    "Focused Feline": ["#acc8f3", "#051960"],
    "Strategic Stray": ["#cb98ed", "#2d0f55"],
    "Goal-Getter Kitten": ["#9b77cb", "#591da9"],
    "Night Owl Panther": ["#00020a", "#030d30"],
    "Chill Kitty": ["#75a3eb", "#120622"],
    "Adaptive Alley Cat": ["#46628d", "#00020a"],
  };

  useGSAP(() => {
    timeline.add("start");

    timeline.fromTo(
      ".welcome",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        duration: 1,
        y: 0,
        ease: "expo.inOut",
      },
      "start",
    );

    timeline.fromTo(
      ".glow-purple",
      {
        opacity: 1,
        y: 1000,
      },
      { opacity: 0, y: -100, duration: 6 },
      "<",
    );

    timeline.fromTo(
      ".glow-purple",
      {
        opacity: 1,
        y: -1000,
      },
      {
        opacity: 0,
        y: 100,
        backgroundColor: `${catColors[catPersonality][0]}`,
        duration: 6,
      },
      "<0.5",
    );

    timeline.to(
      ".group-1",
      { opacity: 0, y: -100, duration: 1, ease: "expo.inOut" },
      "<4",
    );

    timeline.fromTo(
      ".group-2",
      { opacity: 0 },
      { opacity: 1, duration: 2 },
      ">1",
    );

    timeline.to(
      ".slide",
      {
        opacity: 0,
      },
      ">10",
    );
  });

  return (
    <Slide className="slide relative">
      <div className="ml-20 flex h-full w-1/2 flex-col items-center justify-center gap-2"></div>
      <div className="glow-purple absolute left-1/2 top-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[150px]" />

      <div className="group-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 space-y-4 text-center text-5xl font-semibold text-white">
        <p className="welcome leading-normal">
          and for your cat personality of this week...
        </p>
      </div>

      <div className="group-2 absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-gradient-2">
        <div
          className="flex h-3/4 w-full items-center justify-center opacity-50 blur-[1px]"
          style={{
            background: `${catColors[catPersonality][0]}`,
          }}
        />
        <div
          className="flex h-1/4 w-full items-center justify-center opacity-50 blur-[1px]"
          style={{
            background: `${catColors[catPersonality][1]}`,
          }}
        />
        <p className="absolute left-1/2 top-[15%] z-50 flex -translate-x-1/2 -translate-y-1/2 gap-2 text-4xl">
          You are a <span className="font-semibold">{catPersonality}!</span>
        </p>
        <div className="absolute left-1/2 top-[60%] flex -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-primary/25 drop-shadow-2xl">
          <Image
            src={`/cats/${catPersonality.toLowerCase().split(" ").join("-")}.png`}
            width={1300}
            height={950}
            alt="Curious Cat"
          />
        </div>
      </div>
    </Slide>
  );
};

export default SixthSlide;

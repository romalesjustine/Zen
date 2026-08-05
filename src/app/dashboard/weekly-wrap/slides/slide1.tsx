import { useGSAP } from "@gsap/react";
import Slide from "../components/slide";

const FirstSlide = ({
  timeline,
  username,
}: {
  timeline: GSAPTimeline;
  username: string;
}) => {
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
      ".quick-study-notes",
      {
        maxHeight: 0,
        opacity: 0,
        y: 100,
      },
      {
        maxHeight: 200,
        opacity: 1,
        duration: 1,
        y: 0,
        ease: "expo.inOut",
      },
      "<2",
    );

    timeline.to(
      ".group-1",
      {
        opacity: 0,
        y: -100,
      },
      ">2",
    );

    timeline.fromTo(
      ".group-2-1",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
      },
      ">0.5",
    );

    timeline.fromTo(
      ".glow-purple",
      {
        opacity: 1,
        y: -1000,
      },
      { opacity: 0, y: 100, backgroundColor: "#75A3EB", duration: 6 },
      "<0.5",
    );

    timeline.fromTo(
      ".group-2-2",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
      },
      "<1.5",
    );

    timeline.to(
      ".slide",
      {
        opacity: 0,
      },
      ">2",
    );
  });

  return (
    <Slide className="slide relative">
      <div className="ml-20 flex h-full w-1/2 flex-col items-center justify-center gap-2"></div>
      <div className="glow-purple absolute left-1/2 top-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-[150px]" />

      <div className="group-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 space-y-4 text-center text-5xl font-semibold text-white">
        <p className="welcome mt-12">
          Hi, <span className="text-accent-200">{username}</span>
        </p>
        <p className="quick-study-notes text-4xl">
          Let&lsquo;s take a look at your Study Wrap!
        </p>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 space-y-4 text-center text-5xl font-semibold text-white">
        <p className="group-2-1 mt-12">For the past week...</p>
        <p className="group-2-2">
          {/* {oneSentenceDescription} */}
          We can tell you&apos;re on a{" "}
          <span className="text-accent-200">roll</span>.
        </p>
      </div>
    </Slide>
  );
};

export default FirstSlide;

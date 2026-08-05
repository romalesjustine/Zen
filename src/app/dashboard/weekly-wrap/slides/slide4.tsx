import { useGSAP } from "@gsap/react";
import Slide from "../components/slide";
import Cube from "../components/cube";

const FourthSlide = ({
  timeline,
  summaryNotes,
}: {
  timeline: GSAPTimeline;
  summaryNotes: string;
}) => {
  useGSAP(() => {
    timeline.add("start");

    // Animate background blur
    timeline.fromTo(
      ".blur-bg",
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 0.6,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      },
      "start",
    );

    // Animate cubes
    timeline.fromTo(
      ".cube-wrapper",
      {
        rotateX: 0,
        scale: 0.5,
      },
      {
        scale: 1,
        rotateX: 247,
        duration: 12,
        stagger: 0.25,
        ease: "expo.out",
      },
      "start",
    );

    // Animate text
    timeline.fromTo(
      ".title",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      "<1",
    );

    timeline.fromTo(
      ".subtitle",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      "<1",
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
      <div className="slide-content flex h-full w-full flex-col items-center justify-center gap-2 self-start">
        <div className="blur-bg absolute left-[50%] top-[40%] z-0 aspect-square w-3/4 rounded-full bg-primary blur-[150px]" />
        <div className="blur-bg absolute left-[-50%] top-[-40%] z-0 aspect-square w-3/4 rounded-full bg-primary blur-[150px]" />
        <Cube
          size={250}
          className="cube absolute left-16 top-16"
          rotateY={20}
        />
        <Cube
          size={120}
          className="cube absolute right-12 top-24"
          rotateY={20}
        />
        <Cube
          rotateY={80}
          size={250}
          className="cube absolute bottom-40 right-32 rotate-45"
        />
        <Cube
          rotateY={48}
          size={185}
          className="cube absolute bottom-20 left-32 rotate-45"
        />
        <div className="z-50 flex flex-col items-center justify-center gap-12">
          <p className="title text-5xl font-bold uppercase">
            A quick summary of your notes!
          </p>
          <p className="subtitle w-4/5 text-2xl font-medium leading-relaxed">
            {summaryNotes}
          </p>
        </div>
      </div>
    </Slide>
  );
};

export default FourthSlide;

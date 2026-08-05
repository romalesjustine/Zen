import React from "react";
import Slide from "../components/slide";
import { useGSAP } from "@gsap/react";

const FifthSlide = ({
  timeline,
  mostReviewed,
  mostReviewedTotalExam,
  mostReviewedPassedExam,
  weakArea,
}: {
  timeline: GSAPTimeline;
  mostReviewed: string;
  mostReviewedTotalExam: number;
  mostReviewedPassedExam: number;
  weakArea: string;
}) => {
  useGSAP(() => {
    timeline.add("start");

    timeline.fromTo(
      ".sphere-1",
      {
        x: -150,
        y: -150,
      },
      {
        x: 20,
        y: 20,
        duration: 10,
        ease: "expo.out",
      },
      "start",
    );

    timeline.fromTo(
      ".small-sphere",
      {
        rotate: 0,
      },
      {
        rotate: 360,
        duration: 12,
        yoyo: true,
        repeat: -1,
        stagger: 0.25,
        ease: "power2.out",
      },
      "<",
    );

    timeline.fromTo(
      ".glow",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 2,
        ease: "expo.out",
      },
      "<",
    );

    timeline.fromTo(
      ".group-1",
      {
        opacity: 0,
        x: -200,
      },
      {
        opacity: 1,
        x: -50,
        ease: "expo.out",
        duration: 3,
      },
      "<1",
    );

    timeline.to(
      ".sphere-1",
      {
        rotate: 200,
        x: 800,
        y: 200,
        duration: 5,
        ease: "expo.out",
      },
      ">2",
    );

    timeline.to(
      ".small-sphere",
      {
        x: -600,
        y: -200,
        duration: 5,
        ease: "expo.out",
      },
      "<",
    );

    timeline.to(
      ".glow",
      {
        y: -500,
        duration: 2,
        ease: "power1.inOut",
      },
      "<",
    );

    timeline.to(
      ".group-1",
      {
        opacity: 0,
        x: -200,
      },
      "<",
    );

    timeline.fromTo(
      ".group-2",
      {
        opacity: 0,
        x: -150,
      },
      {
        opacity: 1,
        x: 0,
        duration: 2,
        ease: "expo.inOut",
      },
      "<",
    );

    timeline.to(
      ".group-2",
      {
        opacity: 0,
        x: -150,
        duration: 2,
        ease: "power1.inOut",
      },
      ">3",
    );

    timeline.to(
      ".small-sphere",
      {
        x: 500,
        opacity: 0,
        duration: 2,
        scale: 0,
        ease: "power1.inOut",
      },
      "<0.5",
    );

    timeline.to(
      ".glow",
      {
        opacity: 0,
        duration: 2,
        ease: "power1.inOut",
      },
      "<",
    );

    timeline.to(
      ".sphere-1",
      {
        rotate: 420,
        x: 350,
        y: 300,
        scale: 1,
        duration: 2,
        ease: "expo.out",
      },
      "<",
    );

    timeline.fromTo(
      ".group-3",
      {
        opacity: 0,
        y: -400,
      },
      {
        opacity: 1,
        y: -200,
        duration: 2,
        ease: "expo.out",
      },
      "<1",
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
      <div
        className="sphere-1 sphere absolute left-20 top-40 z-0 aspect-square w-[500px] rotate-[90deg] rounded-full"
        style={{
          background:
            " radial-gradient(56.7% 56.7% at 94.06% 70.62%, var(--P1, #EEE8F6) 0%, rgba(238, 232, 246, 0.00) 100%), radial-gradient(71.43% 71.43% at 92.5% 79.38%, var(--Accent_2, #CB98ED) 0%, rgba(203, 152, 237, 0.00) 100%), radial-gradient(71.43% 71.43% at 92.5% 79.38%, var(--Accent_2, #CB98ED) 0%, rgba(203, 152, 237, 0.00) 100%), radial-gradient(71.43% 71.43% at 92.5% 79.38%, var(--Accent_2, #CB98ED) 0%, rgba(203, 152, 237, 0.00) 100%), radial-gradient(135.33% 83.58% at 6.25% 17.19%, var(--S4, #051960) 0%, rgba(5, 25, 96, 0.00) 100%), radial-gradient(118.72% 128.45% at -5.62% 100%, #000 0%, rgba(0, 0, 0, 0.00) 100%), radial-gradient(118.72% 128.45% at -5.62% 100%, #000 0%, rgba(0, 0, 0, 0.00) 100%), var(--Primary, #591DA9)",
        }}
      />
      <div
        className="small-sphere absolute -right-32 top-1/4 -z-10 h-64 w-64 rounded-full"
        style={{
          transform: "rotate(13.248deg)",
          background:
            "radial-gradient(56.13% 56.13% at -1.82% 26.8%, var(--Accent_1, #75A3EB) 0%, rgba(117, 163, 235, 0.00) 100%), radial-gradient(69.37% 69.37% at 74.98% 3.79%, var(--Primary, #591DA9) 0%, rgba(89, 29, 169, 0.00) 100%), radial-gradient(126.23% 77.96% at 72.77% 84.6%, var(--S4, #051960) 0%, rgba(5, 25, 96, 0.00) 100%), radial-gradient(88.74% 96.02% at 87.21% 76.73%, #000 0%, rgba(0, 0, 0, 0.00) 73.38%), var(--Accent_2, #CB98ED)",
        }}
      />
      <div
        className="small-sphere absolute -bottom-16 right-[20%] -z-10 h-72 w-72 rounded-full"
        style={{
          transform: "rotate(13.248deg)",
          background:
            "radial-gradient(56.13% 56.13% at -1.82% 26.8%, var(--Accent_2, #CB98ED) 0%, rgba(238, 232, 246, 0.00) 100%), radial-gradient(69.37% 69.37% at 74.98% 3.79%, var(--Primary, #591DA9) 0%, rgba(89, 29, 169, 0.00) 100%), radial-gradient(126.23% 77.96% at 72.77% 84.6%, var(--Secondary, #051960) 0%, rgba(5, 25, 96, 0.00) 100%), radial-gradient(88.74% 96.02% at 87.21% 76.73%, #000 0%, rgba(0, 0, 0, 0.00) 73.38%), var(--Accent_2, #CB98ED)",
        }}
      />
      <div
        className="small-sphere absolute -right-16 bottom-4 -z-50 h-52 w-52 rounded-full"
        style={{
          transform: "rotate(13.248deg)",
          background:
            "radial-gradient(56.13% 56.13% at -1.82% 26.8%, var(--Accent_2, #CB98ED) 0%, rgba(238, 232, 246, 0.00) 100%), radial-gradient(69.37% 69.37% at 74.98% 3.79%, var(--Primary, #591DA9) 0%, rgba(89, 29, 169, 0.00) 100%), radial-gradient(126.23% 77.96% at 72.77% 84.6%, var(--Secondary, #051960) 0%, rgba(5, 25, 96, 0.00) 100%), radial-gradient(88.74% 96.02% at 87.21% 76.73%, #000 0%, rgba(0, 0, 0, 0.00) 73.38%), var(--Accent_2, #CB98ED)",
        }}
      />
      {/* <div
        className="small-sphere absolute -right-16 bottom-4 z-50 h-52 w-52 rounded-full"
        style={{
          transform: "rotate(120.434deg)",
          background:
            "radial-gradient(56.7% 56.7% at 94.06% 70.62%, var(--P2, #BDA5DD) 0%, rgba(189, 165, 221, 0.00) 100%), radial-gradient(71.43% 71.43% at 92.5% 79.38%, var(--Primary, #591DA9) 0%, rgba(89, 29, 169, 0.00) 100%), radial-gradient(71.43% 71.43% at 92.5% 79.38%, var(--Primary, #591DA9) 0%, rgba(89, 29, 169, 0.00) 100%), radial-gradient(71.43% 71.43% at 92.5% 79.38%, var(--Primary, #591DA9) 0%, rgba(89, 29, 169, 0.00) 100%), radial-gradient(135.33% 83.58% at 6.25% 17.19%, var(--Secondary, #051960) 0%, rgba(5, 25, 96, 0.00) 100%), radial-gradient(118.72% 128.45% at -5.62% 100%, #000 0%, rgba(0, 0, 0, 0.00) 100%), radial-gradient(118.72% 128.45% at -5.62% 100%, #000 0%, rgba(0, 0, 0, 0.00) 100%), var(--Accent_2, #CB98ED)",
        }}
      /> */}
      <div className="glow absolute left-[-5%] top-[40%] z-20 aspect-square w-3/4 rounded-full bg-primary/70 blur-[150px]" />
      <div className="glow absolute left-[-10%] top-[65%] z-20 aspect-square w-1/2 rounded-full bg-accent-100/70 blur-[150px]" />

      <div className="group-1 absolute left-1/2 top-1/2 z-20 -translate-x-[20%] -translate-y-1/2 items-center justify-end gap-4 space-y-4 text-center text-5xl font-semibold text-white">
        <p>When in comes to studying,</p>
        <p>you also have your favorite.</p>
      </div>

      <div className="group-2 absolute left-[10%] top-1/2 z-20 -translate-x-[20%] -translate-y-1/2 items-center justify-start gap-4 space-y-4 text-left text-3xl font-medium text-white/80">
        <p>Based on your studies this week,</p>
        <p>You reviewed</p>
        <p className="text-5xl font-bold leading-normal text-accent-200/100">
          {mostReviewed}
        </p>
        <p>the most.</p>
        <p className="text-base font-normal">
          You took {mostReviewedTotalExam} exam
          {mostReviewedTotalExam > 1 ? "s" : ""} this week and passed{" "}
          <span className="font-bold text-accent-200">
            {mostReviewedPassedExam === mostReviewedTotalExam
              ? "all"
              : mostReviewedPassedExam}{" "}
          </span>
          of them.
        </p>
      </div>

      <div className="group-3 t absolute left-1/2 top-1/2 z-20 flex w-full -translate-x-[50%] -translate-y-[90%] items-center justify-center gap-4 space-y-4 text-center text-2xl font-semibold text-white">
        {/* <p>You&lsquo;re doing awesome!</p> */}
        {/* <p>To reach even greater heights,</p> */}
        <p className="max-w-[80%] text-5xl text-accent-200">{weakArea}</p>
        {/* <p>could use a bit more of your magic ✨</p> */}
      </div>
    </Slide>
  );
};

export default FifthSlide;

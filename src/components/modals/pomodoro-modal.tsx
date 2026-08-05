import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Check,
  Circle,
  Minus,
  Pause,
  Play,
  RefreshCw,
  Settings,
  SkipForward,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

interface PomodoroModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
}

type TimerType = "Pomodoro" | "Short Break" | "Long Break";

const PomodoroModal = ({ isOpen, onOpen, onClose }: PomodoroModalProps) => {
  const [time, setTime] = useState(5); // 25 minutes in seconds

  const [minimized, setMinimized] = useState(false);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const [isMounted, setisMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(time * 60); // 25 minutes in seconds
  const [progress, setProgress] = useState(100);
  const [timerType, setTimerType] = useState<TimerType>("Pomodoro");
  const [pomodoroCounter, setPomodoroCounter] = useState(0);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChangeSettings = () => {
    setSettingsIsOpen(false);
    setTimeLeft(time * 60);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(100);

    // Reset timer based on current type
    switch (timerType) {
      case "Pomodoro":
        setTimeLeft(time * 60);
        break;
      case "Short Break":
        setTimeLeft(time * 60 * 0.2);
        break;
      case "Long Break":
        setTimeLeft(time * 60 * 0.8);
        break;
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    setProgress(100);

    // Move to next timer type
    switch (timerType) {
      case "Pomodoro":
        if (pomodoroCounter >= 3) {
          setTimerType("Long Break");
          setTimeLeft(time * 60 * 0.8);
        } else {
          setTimerType("Short Break");
          setTimeLeft(time * 60 * 0.2);
        }
        setPomodoroCounter((prev) => prev + 1);
        break;
      case "Short Break":
        setTimerType("Pomodoro");
        setTimeLeft(time * 60);
        break;
      case "Long Break":
        setTimerType("Pomodoro");
        setTimeLeft(time * 60);
        setPomodoroCounter(0);
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMinimized(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setisMounted(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(
            (newTime /
              (timerType === "Pomodoro"
                ? time * 60
                : timerType === "Long Break"
                ? time * 60 * 0.8
                : time * 60 * 0.2)) *
              100
          );
          console.log("Progress: ", progress);
          return newTime;
        });
      }, 1000);
    }

    if (timeLeft === 0) {
      const handleTimerComplete = () => {
        setIsPlaying(false);

        if (!isOpen) {
          onOpen();
        }

        setProgress(100);

        if (timerType === "Pomodoro") {
          if (pomodoroCounter >= 3) {
            setTimeLeft(time * 60 * 0.8);
            setTimerType("Long Break");
          } else {
            setTimeLeft(time * 60 * 0.2);
            setTimerType("Short Break");
            setPomodoroCounter((prev) => prev + 1);
          }
        } else {
          setTimeLeft(time * 60);
          setTimerType("Pomodoro");
          if (timerType === "Long Break") {
            setPomodoroCounter(0);
          }
        }
      };

      handleTimerComplete();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft, isOpen, onOpen, pomodoroCounter, progress, time, timerType]);

  if (!isMounted) return null;

  return (
    <>
      <dialog
        open={settingsIsOpen}
        className={cn(
          "fixed inset-0 flex w-[500px] scale-90 flex-col gap-2 rounded-[50px] bg-[#00020a] py-6 text-white opacity-0 shadow-[0px_0px_32px_2px_rgba(0,0,0,0.25)] transition-all duration-100",
          settingsIsOpen && "z-[101] scale-100 opacity-100",
          !settingsIsOpen && "-z-50 opacity-0"
        )}
        style={{
          boxShadow: `0px 0px 20px 2px rgba(89, 29, 169, 0.50)`,
        }}
      >
        <div className="flex w-full items-center justify-between p-8 py-2 pb-2">
          <p className="text-2xl font-medium">Settings</p>
          <button
            onClick={() => {
              setSettingsIsOpen(false);
            }}
          >
            <X className="h-8 w-8 text-white" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 p-3 px-8 pb-2">
          <p className="uppercase">Time (Minutes)</p>
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-4 text-white">
              <p className="w-full">pomodoro</p>
              <div className="rounded-2xl border border-transparent bg-gray transition-all duration-200 focus-within:border-white">
                <input
                  className="h-full w-full bg-transparent px-4 py-2 text-white outline-none focus:outline-none"
                  type="number"
                  value={time}
                  step={5}
                  min={5}
                  onChange={(e) => setTime(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-4 text-white">
              <p className="w-full">short break</p>
              <div className="rounded-2xl border border-transparent bg-gray transition-all duration-200 focus-within:border-white">
                <input
                  className="h-full w-full bg-transparent px-4 py-2 text-white outline-none focus:outline-none"
                  type="number"
                  value={time * 0.2}
                  readOnly
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-4 text-white">
              <p className="w-full">long break</p>
              <div className="rounded-2xl border border-transparent bg-gray transition-all duration-200 focus-within:border-white">
                <input
                  className="h-full w-full bg-transparent px-4 py-2 text-white outline-none focus:outline-none"
                  type="number"
                  value={time * 0.8}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center p-4 pb-0">
          <button
            onClick={handleChangeSettings}
            className="flex items-center justify-center rounded-full bg-white p-4 shadow-[0px_0px_12px_2px_rgba(255,255,255,_0.5)]"
          >
            <Check className="h-6 w-6 text-[#a136e8]" />
          </button>
        </div>
      </dialog>

      <div
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-full bg-[#00020A]/80 opacity-100 backdrop-blur-sm transition-all",
          !isOpen && "-z-50 opacity-0",
          minimized && "-z-50 bg-transparent backdrop-blur-none"
        )}
      ></div>
      <div
        className={cn(
          "fixed left-1/2 top-1/2 z-[100] flex h-2/5 w-[350px] -translate-x-1/2 -translate-y-1/2 scale-90 flex-col gap-2 rounded-3xl p-4 text-white opacity-0 shadow-[0px_0px_20px_2px_rgba(89,_29,_169,_0.50)] transition-all duration-200",
          isOpen && "scale-100 opacity-100",
          settingsIsOpen && "blur-sm",
          minimized &&
            isOpen &&
            "left-[99%] top-[99%] -translate-x-[100%] -translate-y-[100%] opacity-25 hover:opacity-100",
          !isOpen && "-z-50 opacity-0"
        )}
        style={{
          background: `linear-gradient(180deg, var(--Primary, #591DA9) 0%, var(--Text, #120622) 100%)`,
        }}
      >
        <div className="flex w-full items-center justify-between px-1">
          <Settings
            className="h-5 w-5 cursor-pointer text-gray"
            onClick={() => setSettingsIsOpen(true)}
          />
          <div className="flex items-center justify-center gap-3">
            {/* <button onClick={() => setMinimized(!minimized)}> */}
            <button onClick={onClose}>
              <Minus className="h-6 w-6 text-gray" />
            </button>
            <button
              onClick={() => {
                onClose();
              }}
            >
              <X className="h-5 w-5 text-gray" />
            </button>
          </div>
        </div>
        <div className="flex h-full flex-col justify-between gap-6 px-12 pb-6">
          <div className="flex w-full items-center justify-center">
            <p className="text-3xl font-medium">{timerType}</p>
          </div>
          <div className="flex h-full w-full items-center justify-center gap-10">
            <RefreshCw
              onClick={handleReset}
              className="h-8 w-8 cursor-pointer text-white"
            />
            <div className="group relative flex h-[140px] w-[140px] flex-col items-center justify-center gap-8 transition-all duration-200">
              <div
                className={cn(
                  "absolute left-1/2 top-1/2 aspect-square h-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9900ff] p-4"
                )}
                style={{
                  boxShadow: `-5px -5px 50px 0px rgba(255, 255, 255, 0.50) inset, 5px 5px 50px 0px rgba(0, 0, 0, 0.40) inset`,
                }}
              />

              {/* Progress circle */}
              <svg className="absolute left-1/2 top-1/2 aspect-square h-[90%] -translate-x-1/2 -translate-y-1/2 -rotate-90 transform">
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 46}%`}
                  strokeDashoffset={`${
                    ((100 - progress) / 100) * (2 * Math.PI * 46)
                  }%`}
                  style={{
                    transition: "stroke-dashoffset 1s linear",
                  }}
                />
              </svg>

              {/* Timer display */}
              <div className="relative flex flex-col items-center gap-4">
                <p className="select-none text-3xl text-white">
                  {formatTime(timeLeft)}
                </p>
              </div>

              {/* Play/Pause button overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute left-1/2 top-1/2 flex h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-[#00020A]/80 group-hover:opacity-100"
              >
                <div className="flex h-fit w-fit items-center justify-center rounded-full bg-[#6a34b2] p-3">
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-white" />
                  ) : (
                    <Play className="h-6 w-6 translate-x-[1px] text-white" />
                  )}
                </div>
              </button>
            </div>
            <SkipForward
              onClick={handleNext}
              className="h-8 w-8 cursor-pointer fill-white text-white"
            />
          </div>

          <div className="flex w-full items-center justify-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Circle
                key={`pomodoro-${i}`}
                className={cn(
                  "h-2.5 w-2.5 transition-colors duration-200",
                  i < pomodoroCounter
                    ? "fill-white text-white"
                    : "text-white/50"
                )}
              />
            ))}
          </div>

          {/* <div className="flex w-full items-center justify-evenly">
            <RefreshCw className="h-6 w-6 cursor-pointer text-white" />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center rounded-full bg-[#a136e8] p-4"
              style={{
                background: `var(--streak-10-contributions, #90F)`,
                boxShadow: `-5px -5px 50px 0px rgba(255, 255, 255, 0.50) inset, -5px -5px 50px 0px rgba(255, 255, 255, 0.50)`,
              }}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white" />
              )}
            </button>
            <Settings
              className="h-6 w-6 cursor-pointer text-white"
              onClick={() => setSettingsIsOpen(true)}
            />
          </div> */}
        </div>
      </div>
      {!isOpen && (
        <Button
          variant={"ghost"}
          onClick={onOpen}
          className="fixed left-[95%] top-[95%] z-50 m-0 flex aspect-square h-20 w-20 -translate-x-[100%] -translate-y-[100%] items-center justify-center rounded-xl p-0 hover:bg-transparent"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#120622] opacity-25 drop-shadow-xl transition-all duration-200 hover:opacity-100">
            {/* Split colored background */}
            <div
              className="absolute h-10 w-10 rounded-full bg-[#6a34b2]"
              style={{
                clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
              }}
            />
            <div
              className="absolute h-10 w-10 rounded-full bg-[#591da9]"
              style={{
                clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
              }}
            />
            {/* Timer display for minimized state */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isPlaying ? (
                <p className="text-xs font-medium text-white">
                  {formatTime(timeLeft)}
                </p>
              ) : (
                <Image
                  src="/settings.svg"
                  width={50}
                  height={50}
                  alt="Pomodoro"
                />
              )}
            </div>
            {isPlaying && (
              <svg
                className="absolute inset-0"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                style={{
                  width: "100%",
                  height: "100%",
                  transform: "rotate(-90deg)",
                }}
              >
                {/* Background circle for better visibility */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeOpacity="0.1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${
                    ((100 - progress) / 100) * (2 * Math.PI * 45)
                  }`}
                  style={{
                    transition: "stroke-dashoffset 1s linear",
                  }}
                />
              </svg>
            )}
          </div>
        </Button>
      )}
    </>
  );
};

export default PomodoroModal;

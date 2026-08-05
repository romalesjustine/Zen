"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import GlowButton from "../ui/glow-button";
import axios from "axios";
import LoadingSpinner from "@/components/feedback/loading-spinner";
import { runWithToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

const FEEDBACKS = [
  "Great start! Small but focused sessions build consistency. Keep it up!",
  "Impressive! Keep it up! Break it into chunks to stay sharp and avoid burnout.",
  "Well done! You're dedicated. Balance with breaks and self-care for the best results.",
  "Nice commitment! Keep a steady pace with regular breaks to stay fresh.",
  "Incredible effort! But remember, quality is key—rest and breaks are essential.",
  "That's a lot! Be careful of burnout—balance with breaks, hydration, and rest.",
];

interface GoalSettingModalProps {
  goal: number;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const GoalSettingModal: React.FC<GoalSettingModalProps> = ({
  goal: _goal,
  isOpen,
  onClose,
  loading,
  setLoading,
}) => {
  const router = useRouter();
  const [isMounted, setisMounted] = useState(false);

  const [goal, setGoal] = useState(_goal);

  const [feedback, setFeedback] = useState("");
  const [isTextAnimating, setIsTextAnimating] = useState(false);


  useEffect(() => {
    if (goal <= 1) return setFeedback(FEEDBACKS[0]);
    if (goal <= 3) return setFeedback(FEEDBACKS[1]);
    if (goal <= 6) return setFeedback(FEEDBACKS[2]);
    if (goal <= 9) return setFeedback(FEEDBACKS[3]);
    if (goal < 12) return setFeedback(FEEDBACKS[4]);
    if (goal == 12) return setFeedback(FEEDBACKS[5]);
  }, [goal]);

  useEffect(() => {
    setIsTextAnimating(true);
    const timer = setTimeout(() => setIsTextAnimating(false), 200);
    return () => clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    setisMounted(true);
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await runWithToast(
        async () => {
          await axios.patch(`/api/profile`, {
            studyHrsGoal: goal,
          });
        },
        {
          loading: "Updating goal...",
          success: "Goal updated successfully!",
          error: "Failed to update goal. Please try again.",
        },
        { toastId: "updateGoal" }
      );
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <dialog
      open={isOpen}
      className={cn(
        "absolute left-0 top-0 z-50 flex h-full w-full bg-[#00020A]/80 opacity-100 backdrop-blur-sm transition-all",
        !isOpen && "-z-50 opacity-0",
      )}
    >
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-3/4 w-1/4 -translate-x-1/2 -translate-y-1/2 scale-90 rounded-3xl bg-[#00020A]/90 p-8 text-white opacity-0 shadow-[0px_0px_20px_2px_rgba(89,_29,_169,_0.50)] transition-all duration-200",
          isOpen && "scale-100 opacity-100",
        )}
      >
        <button
          onClick={() => {
            setGoal(_goal);
            onClose();
          }}
        >
          <p className="text-accent-100">Cancel</p>
        </button>
        <div className="flex h-full w-full flex-col items-center justify-evenly gap-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-4xl font-bold text-white">
              Daily Study Goal
            </p>
            <p className="w-3/4 text-center text-xs text-gray">
              Set a goal based on how many hours you study, or how much
              you`&apos;`d like to achieve each day.
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <div className="flex h-full w-full items-center justify-center gap-8">
              <button
                disabled={goal === 1}
                onClick={() => setGoal((prev) => prev - 0.5)}
                className="flex items-center justify-center rounded-full bg-background-light/50 px-2 py-2 transition-all duration-300 disabled:opacity-20"
              >
                <Minus className="h-5 w-5 fill-white" />
              </button>
              <p className="px-6 text-4xl font-bold">{goal.toFixed(1)}</p>
              <button
                disabled={goal === 12}
                onClick={() => setGoal((prev) => prev + 0.5)}
                className="flex items-center justify-center rounded-full bg-background-light/50 px-2 py-2 transition-all duration-300 disabled:opacity-20"
              >
                <Plus className="h-5 w-5 fill-white" />
              </button>
            </div>
            <p className="select-none text-lg">hours/day</p>
          </div>
          <p
            className={cn(
              "w-3/4 text-center text-sm font-medium opacity-100 transition-all duration-200",
              isTextAnimating ? "scale-120 opacity-0" : "scale-100",
              goal <= 3
                ? "text-accent-100"
                : goal <= 9
                  ? "text-accent-200"
                  : goal < 12
                    ? "text-red-300"
                    : goal == 12
                      ? "text-red-500"
                      : "",
            )}
          >
            {feedback}
          </p>
          <div className="relative flex w-4/5 flex-col gap-1">
            {/* Progress bar */}
            <div className="relative h-1.5 w-full bg-background-light/20">
              <div
                className="absolute h-full w-full overflow-hidden rounded-full"
                style={{
                  background: `linear-gradient(90deg, #73a1e7 0%, #c795e9 25%, #c795e9 50%, #eb4343 100%)`,
                }}
              />

              {/* Current position indicator */}
              <div
                className="absolute h-3 w-3 -translate-y-1/4 rounded-full bg-white drop-shadow-[0px_0px_20px_white] transition-all duration-300"
                style={{
                  left: `${((goal - 1) / 11) * 100}%`,
                  transform: `translateX(-50%) translateY(-25%)`,
                }}
              />
            </div>

            {/* Hour markers */}
            <div className="relative w-full">
              <span className="absolute left-0 -translate-x-1/2 text-[10px] text-gray">
                1h
              </span>
              <span className="absolute left-[25%] -translate-x-1/2 text-[10px] text-gray">
                3h
              </span>
              <span className="absolute left-[50%] -translate-x-1/2 text-[10px] text-gray">
                6h
              </span>
              <span className="absolute left-[75%] -translate-x-1/2 text-[10px] text-gray">
                9h
              </span>
              <span className="absolute right-0 translate-x-1/2 text-[10px] text-gray">
                12h
              </span>
            </div>
          </div>
          <GlowButton
            onClick={handleSubmit}
            className="w-3/4 px-4 text-base"
            showIcon={false}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner
                size={20}
                thickness={3}
                label="Saving..."
                className="text-white"
                variant="light"
              />
            ) : (
              "Change Goal"
            )}
          </GlowButton>
        </div>
      </div>
    </dialog>
  );
};

export default GoalSettingModal;

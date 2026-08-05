"use client";

import React from "react";
import { useRouter } from "next/navigation";
import WeeklyProgress, {
  DayProgress,
} from "@/components/dashboard/weekly-progress";
import CourseCard from "@/components/dashboard/course-card";
import Link from "next/link";
import Image from "next/image";

interface RecentNote {
  id: string;
  title: string;
  flashcardProgress: number;
  deadline?: string | null;
  iconUrl?: string | null;
}

interface DashboardWidgetsProps {
  streakCount: number;
  recentNotes: RecentNote[];
  weeklyProgress: DayProgress[];
}

const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({
  streakCount,
  recentNotes,
  weeklyProgress,
}) => {
  const router = useRouter();
  const streakRef = React.useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const mousePositionRef = React.useRef({ x: 0, y: 0 });
  const streakLabel = streakCount === 1 ? "day streak" : "days streak";

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      if (streakRef.current && isHovered) {
        const rect = streakRef.current.getBoundingClientRect();
        const mouseX = mousePositionRef.current.x;
        const mouseY = mousePositionRef.current.y;

        // Check if mouse is still within element bounds
        const isMouseOver =
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom;

        if (!isMouseOver) {
          setIsHovered(false);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isHovered]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5 mb-8">
      <div className="flex flex-col gap-5">
        {/* Weekly Progress */}
        <section className="bg-[var(--tracker-surface)] rounded-xl p-6 h-[255px] lg:max-w-[800px]">
          <div className="flex items-center mb-4">
            <h2 className="text-3xl font-semibold text-light mr-2">
              Weekly Progress
            </h2>
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.4911 0H7.16163C2.67483 0 0 2.7125 0 7.2625V17.725C0 22.2875 2.67483 25 7.16163 25H17.4788C21.9656 25 24.6405 22.2875 24.6405 17.7375V7.2625C24.6528 2.7125 21.978 0 17.4911 0ZM6.93976 20.1875C6.93976 20.7 6.52066 21.125 6.01528 21.125C5.5099 21.125 5.0908 20.7 5.0908 20.1875V17.6C5.0908 17.0875 5.5099 16.6625 6.01528 16.6625C6.52066 16.6625 6.93976 17.0875 6.93976 17.6V20.1875ZM13.2509 20.1875C13.2509 20.7 12.8318 21.125 12.3264 21.125C11.821 21.125 11.4019 20.7 11.4019 20.1875V15C11.4019 14.4875 11.821 14.0625 12.3264 14.0625C12.8318 14.0625 13.2509 14.4875 13.2509 15V20.1875ZM19.562 20.1875C19.562 20.7 19.1429 21.125 18.6375 21.125C18.1321 21.125 17.713 20.7 17.713 20.1875V12.4125C17.713 11.9 18.1321 11.475 18.6375 11.475C19.1429 11.475 19.562 11.9 19.562 12.4125V20.1875ZM19.562 8.4625C19.562 8.975 19.1429 9.4 18.6375 9.4C18.1321 9.4 17.713 8.975 17.713 8.4625V7.25C14.5698 10.525 10.6377 12.8375 6.23715 13.95C6.16319 13.975 6.08924 13.975 6.01528 13.975C5.59618 13.975 5.22639 13.6875 5.11545 13.2625C4.99219 12.7625 5.28802 12.25 5.7934 12.125C9.9474 11.075 13.6453 8.8625 16.579 5.7375H15.0382C14.5328 5.7375 14.1137 5.3125 14.1137 4.8C14.1137 4.2875 14.5328 3.8625 15.0382 3.8625H18.6498C18.6991 3.8625 18.7361 3.8875 18.7854 3.8875C18.847 3.9 18.9087 3.9 18.9703 3.925C19.0319 3.95 19.0813 3.9875 19.1429 4.025C19.1799 4.05 19.2168 4.0625 19.2538 4.0875C19.2661 4.1 19.2661 4.1125 19.2785 4.1125C19.3278 4.1625 19.3648 4.2125 19.4017 4.2625C19.4387 4.3125 19.4757 4.35 19.488 4.4C19.5127 4.45 19.5127 4.5 19.525 4.5625C19.5373 4.625 19.562 4.6875 19.562 4.7625C19.562 4.775 19.5743 4.7875 19.5743 4.8V8.4625H19.562Z"
                fill="url(#paint0_linear_4002_4315)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_4002_4315"
                  x1="12.3202"
                  y1="0"
                  x2="12.3202"
                  y2="25"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#E5CCF6" />
                  <stop offset="0.325" stopColor="var(--color-pink-accent)" />
                  <stop offset="1" stopColor="var(--color-primary)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <WeeklyProgress weekData={weeklyProgress} />
        </section>

        {/* Streak */}
        <section
          ref={streakRef}
          className="rounded-xl p-6 flex flex-col items-center justify-center h-[409px]"
          style={{
            backgroundColor: "var(--streak-bg-base)",
            background: `radial-gradient(79.22% 79.22% at 49.93% 20.78%, var(--streak-radial-color) 0%, var(--streak-bg-base) 100%), linear-gradient(139deg, rgba(89, 29, 169, 0.60) -6.39%, rgba(0, 2, 10, 0.00) 112.17%)`,
            backdropFilter: "blur(12.5px)",
            WebkitBackdropFilter: "blur(12.5px)",
            isolation: "isolate",
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
            transition: "box-shadow 0.2s ease",
            boxShadow: isHovered ? "0 0 10px 10px #591DA9" : "none",
            position: "relative",
            zIndex: 1,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src="/streak-icon.png"
            alt="Streak Icon"
            width={162}
            height={176}
            className="mb-4"
          />
          <h2 className="text-6xl font-bold mb-2 bg-gradient-to-b from-pink-accent-2 via-pink-accent to-primary bg-clip-text text-transparent">
            {streakCount}
          </h2>
          <span className="text-3xl font-medium mb-2 bg-gradient-to-b from-pink-accent-2 via-pink-accent to-primary bg-clip-text text-transparent">
            {streakLabel}
          </span>
          <span className="text-light">
            Keep the momentum going by showing up every day.
          </span>
        </section>
      </div>

      {/* Recent Files */}
      <section className="bg-[var(--widget-surface)] rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold text-light">Recent Files</h2>
          <Link
            href="/dashboard/study-deck/"
            className="text-base hover:underline"
            style={{ color: "var(--view-all-link-color)" }}
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentNotes.length === 0 ? (
            <p className="text-light/70 text-base">
              You have not created any notes yet.
            </p>
          ) : (
            recentNotes.map((note) => (
              <CourseCard
                key={note.id}
                courseName={note.title || "Untitled note"}
                progress={Math.max(0, note.flashcardProgress)}
                deadline={note.deadline}
                onClick={() => router.push(`/dashboard/study-deck/${note.id}`)}
                iconUrl={note.iconUrl}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardWidgets;

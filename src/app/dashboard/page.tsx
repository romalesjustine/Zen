import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardWidgets from "@/components/dashboard/dashboard-widgets";
import type { DayProgress } from "@/components/dashboard/weekly-progress";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { Progress } from "@prisma/client";
import { redirect } from "next/navigation";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const getStartOfWeek = (reference: Date) => {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
};

const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

type ProgressEntry = Pick<Progress, "date" | "progress">;

const buildWeeklyProgressData = (
  entries: ProgressEntry[],
  startOfWeek: Date,
  today: Date,
): DayProgress[] => {
  const todayKey = formatDateKey(today);
  const progressByDate = new Map<string, number>();

  entries.forEach((entry) => {
    if (!entry.date) return;
    const key = formatDateKey(entry.date);
    const normalized = Number.isFinite(entry.progress)
      ? Math.max(0, Math.min(100, Math.round(entry.progress)))
      : 0;
    progressByDate.set(key, normalized);
  });

  return DAY_LABELS.map((label, index) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + index);
    const key = formatDateKey(dayDate);
    return {
      day: label,
      progress: progressByDate.get(key) ?? 0,
      isCurrentDay: key === todayKey,
    };
  });
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { email: user.email },
    select: {
      id: true,
      currentStreak: true,
    },
  });

  if (!profile) {
    redirect("/login");
  }

  const recentNotes = await prisma.note.findMany({
    where: { userId: profile.id },
    orderBy: { dateCreated: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      flashcardProgress: true,
      deadline: true,
      icon_url: true,
    },
  });

  const referenceDate = new Date();
  const startOfWeek = getStartOfWeek(referenceDate);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const weeklyProgressEntries = await prisma.progress.findMany({
    where: {
      userId: profile.id,
      date: {
        gte: startOfWeek,
        lt: endOfWeek,
      },
    },
    orderBy: { date: "asc" },
    select: {
      date: true,
      progress: true,
    },
  });

  const weeklyProgressData = buildWeeklyProgressData(
    weeklyProgressEntries,
    startOfWeek,
    referenceDate,
  );

  return (
    <div className="p-8">
      <DashboardHeader />
      <DashboardWidgets
        streakCount={profile.currentStreak ?? 0}
        recentNotes={recentNotes.map((note) => ({
          id: note.id,
          title: note.title,
          flashcardProgress:
            typeof note.flashcardProgress === "number"
              ? Math.round(note.flashcardProgress)
              : 0,
          deadline: note.deadline ? note.deadline.toISOString() : null,
          iconUrl: note.icon_url ?? null,
        }))}
        weeklyProgress={weeklyProgressData}
      />
    </div>
  );
}

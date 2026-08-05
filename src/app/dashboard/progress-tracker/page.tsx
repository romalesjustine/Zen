import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import ProgressTracker from "./progress-tracker";
import { getCurrentWeekProgress } from "@/lib/utils";

const ProgressTrackerPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await prisma.profile.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!profile) redirect("/login");

  const weeklyProgress = await getCurrentWeekProgress(profile.id);

  const activities = await prisma.activity.findMany({
    where: {
      userId: profile?.id,
    },
    select: {
      dateCreated: true,
    },
    orderBy: {
      dateCreated: "asc",
    },
  });

  // Create a map to count activities per day

  const activityMap = activities.reduce(
    (acc: { [key: string]: number }, activity: { dateCreated: Date }) => {
      // Convert to local timezone and get date string
      const date = new Date(activity.dateCreated);
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      acc[localDate] = (acc[localDate] || 0) + 1;
      return acc;
    },
    {}
  );

  console.log(activityMap);

  return (
    <ProgressTracker
      profile={profile}
      progresses={weeklyProgress}
      activityData={activityMap}
    />
  );
};

export default ProgressTrackerPage;

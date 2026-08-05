import React from "react";
import GoalHelper from "./goal-helper";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const GoalHelperPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!profile) {
    redirect("/login");
  }

  return <GoalHelper profile={profile} />;
};

export default GoalHelperPage;

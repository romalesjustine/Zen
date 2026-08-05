import { ReactNode } from "react";
import DashboardLayoutClient from "@/components/dashboard/dashboard-layout-client";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
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

  return (
    <DashboardLayoutClient profile={profile}>{children}</DashboardLayoutClient>
  );
}

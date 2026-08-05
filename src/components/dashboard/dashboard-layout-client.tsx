"use client";

import { ReactNode, useState } from "react";
import type { Profile } from "@prisma/client";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import PomodoroModal from "@/components/modals/pomodoro-modal";

interface DashboardLayoutClientProps {
  children: ReactNode;
  profile: Profile;
}

const DashboardLayoutClient = ({
  children,
  profile,
}: DashboardLayoutClientProps) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isPomodoroLoading, setIsPomodoroLoading] = useState(false);
  return (
    <div className="flex min-h-screen">
      <PomodoroModal
        isOpen={isPomodoroOpen}
        onOpen={() => setIsPomodoroOpen(true)}
        onClose={() => setIsPomodoroOpen(false)}
        loading={isPomodoroLoading}
        setLoading={setIsPomodoroLoading}
      />
      <DashboardSidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((prev) => !prev)}
        profile={profile}
      />
      <main
        className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${
          sidebarExpanded ? "ml-70" : "ml-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayoutClient;

"use client";
import CircleProgress from "@/components/circle-progress";
import ContributionHeatmap from "@/components/contribution-graph";
import GoalSettingModal from "@/components/modals/goal-setting-modal";
import Streak from "@/components/streak";
import GlowButton from "@/components/ui/glow-button";
import { DAYS } from "@/lib/utils";
import { Profile, Progress } from "@prisma/client";
import React, { useState } from "react";

const ProgressTracker = ({
  profile,
  progresses,
  activityData,
}: {
  progresses: Progress[];
  profile: Profile;
  activityData: { [key: string]: number };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <GoalSettingModal
        goal={profile.studyHrsGoal}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        loading={isLoading}
        setLoading={setIsLoading}
      />

        <div className="relative grid pt-8 flex-1 grid-cols-2 grid-rows-[6fr_4fr] gap-4 overflow-hidden px-6 text-center lg:m-8 lg:my-0 lg:h-[calc(100%_-_3rem)] lg:rounded-2xl">
          <div className="col-span-2 row-span-1 grid h-full grid-cols-2 space-x-4 rounded-xl bg-[#5C22AB] dark:bg-[#060810] px-6 py-5 2xl:px-10 2xl:py-8">
          <div className="col-span-1">
            <Streak
              value={profile.currentStreak}      
              className="h-full items-center justify-center gap-6 p-4 pt-8 2xl:pt-8"
            />
          </div>
          <div className="col-span-1 row-span-1 flex h-full flex-col items-center justify-center space-y-4">
            <div className="flex w-full items-center justify-between">
              <p className="mx-2 text-xl font-semibold">Weekly Progress</p>
              <GlowButton
                className="px-4 text-base"
                showIcon={false}
                onClick={() => setIsOpen(true)}
              >
                Change Goal
              </GlowButton>
            </div>
            <div className="grid h-full w-full grid-cols-4 grid-rows-2">
              {Array.from({ length: 7 }).map((_, idx) => (
                <div
                  key={idx}
                  className="col-span-1 row-span-1 flex flex-col items-center gap-1"
                >
                  <p className="select-none text-lg font-medium">{DAYS[idx]}</p>
                  <div className="flex items-center justify-center rounded-3xl bg-gradient-2 p-3 backdrop-blur-xl">
                    <CircleProgress
                      progress={
                        progresses.filter((v) => v.date.getDay() === idx)
                          .length > 0
                          ? (progresses.filter(
                              (v) => v.date.getDay() === idx
                            )[0].progress /
                              (profile.studyHrsGoal * 60)) *
                            100
                          : 0
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-1 flex h-full flex-col gap-4 rounded-xl bg-[#5C22AB] dark:bg-[#060810] px-6 py-5 2xl:px-10 2xl:py-8">
          <ContributionHeatmap
            userId={profile.id}
            activityData={activityData}
            className="h-full w-full px-2"
          />
        </div>
      </div>
    </>
  );
};

export default ProgressTracker;

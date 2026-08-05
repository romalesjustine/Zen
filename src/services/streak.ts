import { prisma } from "@/lib/prisma";
import { SubscriptionTier } from "@prisma/client";

/**
 * Updates the user's streak based on their last active date.
 * Handles automatic upgrade to GOLD (30+ days) or downgrade to FREE (missed day).
 */
export async function updateStreakAndTier(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      id: true,
      lastActive: true,
      currentStreak: true,
      highestStreak: true,
      tier: true,
    },
  });

  if (!profile) return;

  // Properly normalize dates without mutation
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const lastActive = new Date(profile.lastActive);
  const lastActiveMidnight = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

  // Calculate difference in days
  const diffTime = todayMidnight.getTime() - lastActiveMidnight.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let newStreak = profile.currentStreak;
  let newHighestStreak = profile.highestStreak;
  let newTier = profile.tier;
  let shouldUpdateStreak = false;

  // Streak logic
  if (diffDays === 0) {
    // Same day - no streak change, just update lastActive
  } else if (diffDays === 1) {
    // Consecutive day - increment streak
    newStreak += 1;
    shouldUpdateStreak = true;
    
    // Update highest streak if new record
    if (newStreak > newHighestStreak) {
      newHighestStreak = newStreak;
    }
  } else {
    // Missed day(s) - reset streak to 1
    newStreak = 1;
    shouldUpdateStreak = true;
  }

  // Tier management (only for non-PREMIUM users)
  if (profile.tier !== SubscriptionTier.PREMIUM) {
    if (newStreak >= 30 && profile.tier !== SubscriptionTier.GOLD) {
      // Reward: Upgrade to GOLD for 30+ day streak
      newTier = SubscriptionTier.GOLD;
    } else if (newStreak < 30 && profile.tier === SubscriptionTier.GOLD) {
      // Penalty: Downgrade to FREE if streak broken
      newTier = SubscriptionTier.FREE;
    }
  }

  // Update profile
  const tierChanged = newTier !== profile.tier;
  
  await prisma.profile.update({
    where: { id: userId },
    data: {
      lastActive: new Date(),
      ...(shouldUpdateStreak && {
        currentStreak: newStreak,
        highestStreak: newHighestStreak,
      }),
      ...(tierChanged && {
        tier: newTier,
      }),
    },
  });

  return { 
    newStreak, 
    newTier, 
    wasStreakBroken: diffDays > 1,
    isNewRecord: newStreak > profile.currentStreak && newStreak === newHighestStreak,
  };
}
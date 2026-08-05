import { prisma } from '@/lib/prisma';
import { SubscriptionTier } from '@prisma/client';

// Define tier limits
const TIER_LIMITS = {
  FREE: {
    dailyUploads: 2,
    dailyFlashcards: 15,
    dailyAiChars: 2000,
  },
  GOLD: {
    dailyUploads: 4,
    dailyFlashcards: 30,
    dailyAiChars: 4000,
  },
  PREMIUM: {
    dailyUploads: Infinity,
    dailyFlashcards: Infinity,
    dailyAiChars: Infinity,
  },
} as const;

type UsageType = 'upload' | 'flashcard' | 'aiChar';

interface UsageCheckResult {
  allowed: boolean;
  remaining?: number;
  limit?: number;
  message?: string;
}

/**
 * Check if it's a new day compared to lastUsageDate
 */
function isNewDay(lastUsageDate: Date): boolean {
  const now = new Date();
  const last = new Date(lastUsageDate);
  
  // Compare dates (ignore time)
  return (
    now.getFullYear() !== last.getFullYear() ||
    now.getMonth() !== last.getMonth() ||
    now.getDate() !== last.getDate()
  );
}

/**
 * Reset daily counts
 */
async function resetCountsIfNeeded(userId: string): Promise<void> {
  const user = await prisma.profile.findUnique({
    where: { id: userId },
    select: { lastUsageDate: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (isNewDay(user.lastUsageDate)) {
    await prisma.profile.update({
      where: { id: userId },
      data: {
        dailyUploadCount: 0,
        dailyFlashcardCount: 0,
        dailyAiCharCount: 0,
        lastUsageDate: new Date(),
      },
    });
  }
}

/**
 * Get the current tier for a user
 */
async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const user = await prisma.profile.findUnique({
    where: { id: userId },
    select: { 
      tier: true, 
      subscriptionEnds: true 
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Check if subscription has expired
  if (user.tier === 'PREMIUM' && user.subscriptionEnds) {
    if (new Date() > user.subscriptionEnds) {
      // Downgrade to FREE
      await prisma.profile.update({
        where: { id: userId },
        data: { tier: 'FREE' },
      });
      return 'FREE';
    }
  }

  return user.tier;
}

/**
 * Check if user can perform an action and return usage details
 */
export async function checkUsageLimit(
  userId: string,
  usageType: UsageType,
  amount: number = 1
): Promise<UsageCheckResult> {
  // Reset counts
  await resetCountsIfNeeded(userId);

  // Get current tier
  const tier = await getUserTier(userId);

  // Get user's current usage
  const user = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      dailyUploadCount: true,
      dailyFlashcardCount: true,
      dailyAiCharCount: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Determine current count and limit based on usage type
  let currentCount: number;
  let limit: number;

  switch (usageType) {
    case 'upload':
      currentCount = user.dailyUploadCount;
      limit = TIER_LIMITS[tier].dailyUploads;
      break;
    case 'flashcard':
      currentCount = user.dailyFlashcardCount;
      limit = TIER_LIMITS[tier].dailyFlashcards;
      break;
    case 'aiChar':
      currentCount = user.dailyAiCharCount;
      limit = TIER_LIMITS[tier].dailyAiChars;
      break;
    default:
      throw new Error('Invalid usage type');
  }

  // Check if user has reached limit
  const newCount = currentCount + amount;
  const allowed = newCount <= limit;
  const remaining = Math.max(0, limit - currentCount);

  if (!allowed) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      message: `Daily ${usageType} limit reached. ${tier === 'FREE' ? 'Upgrade to Premium for unlimited usage.' : ''}`,
    };
  }

  return {
    allowed: true,
    remaining: limit === Infinity ? Infinity : remaining - amount,
    limit,
  };
}

/**
 * Increment usage count after successful action
 */
export async function incrementUsage(
  userId: string,
  usageType: UsageType,
  amount: number = 1
): Promise<void> {
  switch (usageType) {
    case 'upload':
      await prisma.profile.update({
        where: { id: userId },
        data: {
          dailyUploadCount: { increment: amount },
          lastUsageDate: new Date(),
        },
      });
      break;
    case 'flashcard':
      await prisma.profile.update({
        where: { id: userId },
        data: {
          dailyFlashcardCount: { increment: amount },
          lastUsageDate: new Date(),
        },
      });
      break;
    case 'aiChar':
      await prisma.profile.update({
        where: { id: userId },
        data: {
          dailyAiCharCount: { increment: amount },
          lastUsageDate: new Date(),
        },
      });
      break;
    default:
      throw new Error('Invalid usage type');
  }
}

/**
 * Check and increment usage in one operation
 */
export async function checkAndIncrementUsage(
  userId: string,
  usageType: UsageType,
  amount: number = 1
): Promise<UsageCheckResult> {
  const check = await checkUsageLimit(userId, usageType, amount);
  
  if (check.allowed) {
    await incrementUsage(userId, usageType, amount);
  }
  
  return check;
}

/**
 * Get user's current usage stats
 */
export async function getUserUsageStats(userId: string) {
  await resetCountsIfNeeded(userId);
  const tier = await getUserTier(userId);

  const user = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      tier: true,
      subscriptionEnds: true,
      dailyUploadCount: true,
      dailyFlashcardCount: true,
      dailyAiCharCount: true,
      lastUsageDate: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    tier,
    subscriptionEnds: user.subscriptionEnds,
    uploads: {
      used: user.dailyUploadCount,
      limit: TIER_LIMITS[tier].dailyUploads,
      remaining: TIER_LIMITS[tier].dailyUploads === Infinity 
        ? Infinity 
        : Math.max(0, TIER_LIMITS[tier].dailyUploads - user.dailyUploadCount),
    },
    flashcards: {
      used: user.dailyFlashcardCount,
      limit: TIER_LIMITS[tier].dailyFlashcards,
      remaining: TIER_LIMITS[tier].dailyFlashcards === Infinity 
        ? Infinity 
        : Math.max(0, TIER_LIMITS[tier].dailyFlashcards - user.dailyFlashcardCount),
    },
    aiChars: {
      used: user.dailyAiCharCount,
      limit: TIER_LIMITS[tier].dailyAiChars,
      remaining: TIER_LIMITS[tier].dailyAiChars === Infinity 
        ? Infinity 
        : Math.max(0, TIER_LIMITS[tier].dailyAiChars - user.dailyAiCharCount),
    },
  };
}

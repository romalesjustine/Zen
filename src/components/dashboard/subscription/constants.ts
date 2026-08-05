import { SubscriptionDetails, Plan } from './types';

export const DEFAULT_SUBSCRIPTION: SubscriptionDetails = {
    plan: 'Basic',
    progressTracker: 'Accessible',
    studyDeck: 'Accessible',
    aiNotes: '2 File-Upload Limit Daily',
    flashcards: '15 Flashcard Limit Daily',
    goalHelperAI: '2000-Character Limit Daily',
};

export const GOLD_SUBSCRIPTION:SubscriptionDetails = {
    plan: 'Gold',
    progressTracker: 'Accessible',
    studyDeck: 'Accessible',
    aiNotes: '4 File-Upload Limit Daily',
    flashcards: '30 Flashcard Limit Daily',
    goalHelperAI: '4000-Character Limit Daily',
};

export const PREMIUM_SUBSCRIPTION: SubscriptionDetails = {
    plan: 'Premium',
    progressTracker: 'Accessible',
    studyDeck: 'Accessible',
    aiNotes: 'Unlimited File Upload',
    flashcards: 'Unlimited Flashcard Generation',
    goalHelperAI: 'Unlimited Goal Helper AI',
};

export const SUBSCRIPTION_PLANS: Plan[] = [
    {
        name: 'Basic',
        price: '0 Php',
        perks: [
            { text: 'Progress Tracker', available: true },
            { text: '2-File Upload Limit', available: true },
            { text: '15 Flashcard Limit', available: true },
            { text: '2000-character\nGoal Helper Limit', available: true },
        ],
        buttonText: '',
        isLink: true,
        bgClass: 'bg-[var(--plan-basic-surface)]',
    },
    {
        name: 'Gold',
        price: 'Unlocked after 1 Month Streak',
        perks: [
            { text: 'Progress Tracker', available: true },
            { text: '4-File Upload Limit', available: true },
            { text: '30 Flashcard Limit', available: true },
            { text: '4000-character\nGoal Helper Limit', available: true },
        ],
        buttonText: '',
        isLink: true,
        bgClass: 'bg-gradient-to-b from-[#BE9639] to-[#E0BB20]',
        shadowClass: 'shadow-[0_0_10px_rgba(255,217,61,0.7),0_0_80px_rgba(255,217,61,0.3)]',
    },
    {
        name: 'Premium',
        price: '250 Php/month',
        perks: [
            { text: 'Progress Tracker', available: true },
            { text: 'Unlimited Upload', available: true },
            { text: 'Unli-Flashcards', available: true },
            { text: 'No limit Goal Helper', available: true },
        ],
        buttonText: 'Subscribe',
        isLink: false,
        bgClass: 'bg-[var(--plan-premium-surface)]',
        shadowClass: 'shadow-[0_0_31.6px_0_#591DA9,0_0_60.2px_0_rgba(0,0,0,0.36)_inset]',
    },
];

export const SUBSCRIPTION_DETAILS_FIELDS = [
    { label: 'Plan', key: 'plan' as keyof SubscriptionDetails },
    { label: 'Progress Tracker', key: 'progressTracker' as keyof SubscriptionDetails },
    { label: 'Study Deck', key: 'studyDeck' as keyof SubscriptionDetails },
    { label: 'AI Notes', key: 'aiNotes' as keyof SubscriptionDetails },
    { label: 'Flashcards', key: 'flashcards' as keyof SubscriptionDetails },
    { label: 'Goal Helper AI', key: 'goalHelperAI' as keyof SubscriptionDetails },
];

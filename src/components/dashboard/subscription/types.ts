export type SubscriptionDetails = {
    plan: string;
    progressTracker: string;
    studyDeck: string;
    aiNotes: string;
    flashcards: string;
    goalHelperAI: string;
};

export type Perk = {
    text: string;
    available: boolean;
};

export type Plan = {
    name: string;
    price: string;
    perks: Perk[];
    buttonText: string;
    isLink: boolean;
    bgClass: string;
    shadowClass?: string;
};

export type SubscriptionSectionProps = {
    currentSubscription?: SubscriptionDetails;
};

export type PlanCardProps = {
    plan: Plan;
    isSubscribed: boolean;
    onSubscribeClick: () => void;
};

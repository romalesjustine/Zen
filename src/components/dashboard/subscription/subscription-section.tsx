"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import CheckIcon from "@/components/dashboard/check-icon";
import XIcon from "@/components/dashboard/x-icon";
import SubscribeButton from "@/components/dashboard/subscribe-button";
import {
  DEFAULT_SUBSCRIPTION,
  GOLD_SUBSCRIPTION,
  PREMIUM_SUBSCRIPTION,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_DETAILS_FIELDS,
} from "./constants";
import { SubscriptionTier } from "@prisma/client";
import type {
  SubscriptionDetails,
  SubscriptionSectionProps,
  PlanCardProps,
} from "./types";

export type { SubscriptionDetails };

interface ExtendedPlanCardProps extends PlanCardProps {
  isLoading: boolean;
}

function PlanCard({ plan, isSubscribed, onSubscribeClick, isLoading }: ExtendedPlanCardProps) {
  const isPremiumPlan = plan.name === "Premium";
  
  // Determine which badge to show
  const getBadgeImage = () => {
    if (plan.name === "Basic") return "/Basic Tier.png";
    if (plan.name === "Gold") return "/Gold Tier.png";
    if (plan.name === "Premium") return "/Premium Tier.png";
    return null;
  };

  const badgeImage = getBadgeImage();

  return (
    <div
      className={`relative flex flex-col w-75 h-100 rounded-2xl py-8 px-5 ${
        plan.bgClass
      } ${plan.shadowClass || ""}`}
    >
      {/* Tier Badge in top right corner */}
      {badgeImage && (
        <div className="absolute top-3 right-3">
          <Image
            src={badgeImage}
            alt={`${plan.name} Tier`}
            width={40}
            height={40}
            className="object-cover"
            style={{ width: '40px', height: '40px' }}
          />
        </div>
      )}
      
      <h1
        className={`text-4xl text-light font-bold text-center ${
          isPremiumPlan ? "[text-shadow:0_0_7.6px_#FFF]" : ""
        }`}
      >
        {plan.name}
      </h1>
      <p className="text-base text-light text-center mb-2">{plan.price}</p>
      <div className="w-full h-[1px] bg-border/50" />
      <h2 className={`text-2xl font-medium text-center my-2 ${plan.name === 'Gold' ? 'text-light' : 'text-pink-accent'
        }`}>
        Perks
      </h2>

      <div className="flex flex-col justify-end gap-2 my-2">
        {plan.perks.map((perk, index) => (
          <div key={index} className="flex flex-row items-center gap-2 px-7">
            {perk.available ? <CheckIcon width={28} height={28} /> : <XIcon />}
            <p className="text-base text-light font-medium">
              {perk.text.split("\n").map((line, i) => (
                <Fragment key={i}>
                  {line}
                  {i < perk.text.split("\n").length - 1 && <br />}
                </Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>

      {plan.isLink ? (
        <p
          className={`absolute left-1/2 bottom-8 -translate-x-1/2 text-xs text-pink-accent underline ${
            isSubscribed ? "hidden" : ""
          }`}
        >
          {plan.buttonText}
        </p>
      ) : (
        <div className="absolute left-1/2 bottom-8 -translate-x-1/2">
          <SubscribeButton
            onClick={onSubscribeClick}
            disabled={isSubscribed || isLoading} 
            variant={isSubscribed ? "outline" : "default"}
          >
            {isSubscribed 
              ? "Subscribed" 
              : isLoading 
                ? "Redirecting..."
                : "Subscribe"}
          </SubscribeButton>
        </div>
      )}
    </div>
  );
}

export default function SubscriptionSection({
  currentSubscription,
  userTier,
}: SubscriptionSectionProps & { userTier?: SubscriptionTier }) {
  // We track loading state for the API call
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine subscription based on user tier
  const getSubscriptionByTier = (tier?: SubscriptionTier) => {
    if (tier === SubscriptionTier.PREMIUM) return PREMIUM_SUBSCRIPTION;
    if (tier === SubscriptionTier.GOLD) return GOLD_SUBSCRIPTION;
    return DEFAULT_SUBSCRIPTION;
  };
  
  const [isSubscribed] = useState(false); 
  const [subscription] = useState<SubscriptionDetails>(
    currentSubscription || getSubscriptionByTier(userTier)
  );

  /**
   * HANDLES THE PAYMONGO REDIRECT
   */
  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // 1. Call our new API route
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // 2. Redirect to PayMongo
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error(error);
      alert("Could not initialize payment. Please try again.");
    } finally {
    }
  };

  return (
    <div className="p-8" style={{ background: "var(--subscription-surface)" }}>
      <h1 className="text-3xl font-medium text-light text-center pt-3 mb-3">
        Subscriptions and Benefits
      </h1>
      <div className="p-12 text-light text-xl text-center">
        <p>Choose between our student-friendly plans.</p>
      </div>

      <div className="flex flex-row justify-center gap-12 py-5">
        {SUBSCRIPTION_PLANS.map((plan, index) => {
          // Check if user is subscribed to this specific plan
          const isUserSubscribed = 
            (plan.name === "Premium" && userTier === SubscriptionTier.PREMIUM) ||
            (plan.name === "Gold" && userTier === SubscriptionTier.GOLD) ||
            (plan.name === "Basic" && userTier === SubscriptionTier.FREE);
          
          return (
            <PlanCard
              key={index}
              plan={plan}
              isSubscribed={isUserSubscribed}
              isLoading={isLoading}
              onSubscribeClick={() => {
                // Only trigger checkout if it's the Premium plan and not subscribed
                if (plan.name === "Premium" && !isUserSubscribed) {
                  handleCheckout();
                }
              }}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <h2 className="text-center text-2xl text-light font-semibold">
          Current Subscription:
        </h2>
        <div className="grid grid-cols-2 gap-2 max-w-full mx-auto">
          {SUBSCRIPTION_DETAILS_FIELDS.map((item, index) => (
            <Fragment key={index}>
              <p className="text-right text-xl text-light font-semibold">
                {item.label}
              </p>
              <p
                className={`text-left text-xl font-light ${
                  isSubscribed
                    ? "text-[#D5FF63] [text-shadow:0_0_11.2px_#FFF]"
                    : "text-light"
                }`}
              >
                {subscription[item.key]}
              </p>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

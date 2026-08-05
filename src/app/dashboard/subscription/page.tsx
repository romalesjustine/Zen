import SubscriptionSection from "@/components/dashboard/subscription/subscription-section";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { email: user.email },
    select: {
      tier: true,
    },
  });

  if (!profile) {
    redirect("/login");
  }

  return <SubscriptionSection userTier={profile.tier} />;
}

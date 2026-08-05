import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SubscriptionTier } from "@prisma/client";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // 1. VERIFY WEBHOOK SIGNATURE
    const signatureHeader = req.headers.get("paymongo-signature");
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

    if (!webhookSecret || !signatureHeader) {
      console.error("Missing secret or signature header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // PayMongo Header Format: "t=161234567,te=generated_hash_here"
    const parts = signatureHeader.split(",");
    const timestamp = parts.find((p) => p.startsWith("t="))?.split("=")[1];
    const signature = parts.find((p) => p.startsWith("te="))?.split("=")[1];

    if (!timestamp || !signature) {
      console.error("Invalid signature format");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payloadToHash = `${timestamp}.${rawBody}`;
    
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payloadToHash)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Signature mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate Event Type
    const eventType = body.data.attributes.type;
    
    if (eventType !== 'checkout_session.payment.paid') {
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    // 3. Extract Metadata
    const eventData = body.data.attributes.data;
    const metadata = eventData.attributes.metadata;
    const userId = metadata?.userId;

    if (!userId) {
      console.error("No userId found in webhook metadata");
      return NextResponse.json({ error: "No userId found" }, { status: 400 });
    }

    // 4. Update Database
    await prisma.profile.update({
      where: { id: userId }, 
      data: {
        tier: SubscriptionTier.PREMIUM,
        subscriptionEnds: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
    });

    console.log(`User ${userId} upgraded to PREMIUM via Webhook`);

    // 5. Respond Success
    return NextResponse.json({ status: "success" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
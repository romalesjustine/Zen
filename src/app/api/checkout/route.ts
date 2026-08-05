import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the User
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const AMOUNT_IN_CENTAVOS = 25000; 

    // 2. Get the base URL and validate it
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   (req.headers.get('origin')) || 
                   'http://localhost:3000';
    
    // Ensure the URL has a protocol
    const appUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

    // 3. Create the PayMongo Session Payload
    const payload = {
      data: {
        attributes: {
          line_items: [
            {
              currency: "PHP",
              amount: AMOUNT_IN_CENTAVOS,
              description: "Unlimited AI, Flashcards & Uploads",
              name: "Zen Premium Subscription",
              quantity: 1,
            },
          ],
          payment_method_types: ["card", "gcash", "paymaya"],
          success_url: `${appUrl}/dashboard?payment=success`,
          cancel_url: `${appUrl}/dashboard?payment=cancelled`,
          description: "Zen Premium Upgrade",
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          metadata: {
            userId: user.id, 
            plan: "PREMIUM"
          }
        },
      },
    };

    // 4. Send Request to PayMongo
    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        //Basic Auth: Base64 encode the Secret Key
        Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // 5. Handle Errors
    if (data.errors) {
      console.error("PayMongo API Error:", data.errors);
      return NextResponse.json({ error: "Payment provider error" }, { status: 500 });
    }

    // 6. Return the URL to the frontend
    return NextResponse.json({ checkoutUrl: data.data.attributes.checkout_url });

  } catch (error) {
    console.error("Checkout creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
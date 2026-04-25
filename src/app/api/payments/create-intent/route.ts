import { NextResponse } from "next/server";
import Stripe from "stripe";
import type { BookingConfirmationDraft } from "@/types/booking";

type PaymentIntentRequestBody = {
  confirmation?: BookingConfirmationDraft;
};

function parseDisplayPriceToCents(displayPrice: string): number | null {
  const sanitized = displayPrice.replace(/[^0-9.]/g, "");
  if (!sanitized) return null;
  const asNumber = Number.parseFloat(sanitized);
  if (!Number.isFinite(asNumber) || asNumber <= 0) return null;
  return Math.round(asNumber * 100);
}

function isValidConfirmationDraft(
  confirmation: BookingConfirmationDraft | undefined
): confirmation is BookingConfirmationDraft {
  if (!confirmation) return false;

  return (
    typeof confirmation.firstName === "string" &&
    typeof confirmation.lastName === "string" &&
    typeof confirmation.email === "string" &&
    typeof confirmation.phone === "string" &&
    typeof confirmation.startIso === "string" &&
    typeof confirmation.durationHours === "number" &&
    typeof confirmation.quotedPriceDisplay === "string" &&
    typeof confirmation.clientCreatedAtIso === "string" &&
    typeof confirmation.confirmationCode === "string" &&
    typeof confirmation.confirmedAtIso === "string" &&
    confirmation.status === "reserved_unpaid"
  );
}

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "Missing STRIPE_SECRET_KEY. Add it to .env.local and deployment environment variables.",
      },
      { status: 500 }
    );
  }

  let body: PaymentIntentRequestBody;
  try {
    body = (await req.json()) as PaymentIntentRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  if (!isValidConfirmationDraft(body.confirmation)) {
    return NextResponse.json(
      { error: "Missing or invalid booking confirmation payload." },
      { status: 400 }
    );
  }

  const amountCents = parseDisplayPriceToCents(body.confirmation.quotedPriceDisplay);
  if (!amountCents) {
    return NextResponse.json(
      { error: "Unable to parse amount from quoted booking price." },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(secretKey);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        confirmationCode: body.confirmation.confirmationCode,
        startIso: body.confirmation.startIso,
        durationHours: String(body.confirmation.durationHours),
        guestEmail: body.confirmation.email,
      },
    });

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "Stripe did not return a client secret." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amountCents,
      currency: "usd",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[api/payments/create-intent]", error);
    }
    return NextResponse.json(
      { error: "Unable to create a Stripe payment intent right now." },
      { status: 502 }
    );
  }
}

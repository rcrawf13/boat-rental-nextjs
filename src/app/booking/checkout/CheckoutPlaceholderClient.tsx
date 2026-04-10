"use client";

/**
 * ---------------------------------------------------------------------------
 * STRIPE CHECKOUT — intentionally disabled (STRIPE_ENABLED = false).
 *
 * When you are ready:
 * 1. Install: `npm i @stripe/stripe-js @stripe/react-stripe-js stripe`
 * 2. Vercel / .env.local:
 *      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 *      STRIPE_SECRET_KEY=sk_test_...          (server only — use in Route Handler)
 * 3. Create `app/api/checkout/session/route.ts` (POST):
 *      - import Stripe from 'stripe'
 *      - const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
 *      - session = await stripe.checkout.sessions.create({ mode: 'payment', ... })
 *      - return Response.json({ url: session.url })
 * 4. Client: loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) or redirect to session.url
 * 5. Webhook route: verify signature, update `bookings.status` + stripe_* columns
 *
 * Supabase: after payment success, call an RPC or update row using service role
 * from the webhook handler (never expose service role to the browser).
 * ---------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/navigation";
import FadeDiv from "@/components/fade_div/FadeDiv";
import BookingButton from "@/components/shared/booking-button/BookingButton";
import "@/components/booking/booking.css";
import type { BookingCheckoutDraft, BookingConfirmationDraft } from "@/types/booking";
import {
  BOOKING_CHECKOUT_DRAFT_KEY,
  BOOKING_CONFIRMATION_KEY,
} from "@/types/booking";

/** Flip to true only after Stripe keys + API route exist */
const STRIPE_ENABLED = false;

export default function CheckoutPlaceholderClient() {
  const router = useRouter();
  const [draft, setDraft] = useState<BookingCheckoutDraft | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_CHECKOUT_DRAFT_KEY);
      if (!raw) {
        setDraft(null);
        return;
      }
      const parsed = JSON.parse(raw) as BookingCheckoutDraft;
      setDraft(parsed);
    } catch {
      setParseError("Invalid booking data in storage.");
    }
  }, []);

  const formattedStart = useMemo(() => {
    if (!draft) return "";
    const date = new Date(draft.startIso);
    return Number.isNaN(date.getTime())
      ? draft.startIso
      : date.toLocaleString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
  }, [draft]);

  const handleConfirmReservation = () => {
    if (!draft) return;

    setSubmitError(null);
    setIsConfirming(true);

    try {
      const confirmation: BookingConfirmationDraft = {
        ...draft,
        confirmationCode: `BR-${Math.random()
          .toString(36)
          .slice(2, 8)
          .toUpperCase()}`,
        confirmedAtIso: new Date().toISOString(),
        status: "reserved_unpaid",
      };

      // TODO: replace this local session write with a server insert call.
      // TODO: create Stripe Checkout Session here once payment is re-enabled.
      sessionStorage.setItem(
        BOOKING_CONFIRMATION_KEY,
        JSON.stringify(confirmation)
      );
      sessionStorage.removeItem(BOOKING_CHECKOUT_DRAFT_KEY);

      // TODO: redirect to Stripe session.url here instead of local confirmation route.
      router.push("/booking/confirmation");
    } catch {
      setSubmitError(
        "Could not complete the local confirmation step. Please try again."
      );
      setIsConfirming(false);
    }
  };

  if (parseError) {
    return (
      <div className="container">
        <FadeDiv>
          <div className="bookingContainer">
            <Box
              sx={{
                gridColumn: "1 / -1",
                width: "100%",
                maxWidth: 560,
                justifySelf: "center",
                minWidth: 0,
                p: { xs: 1, sm: 2 },
              }}
            >
              <Alert severity="error">{parseError}</Alert>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <BookingButton
                  variant="outlined"
                  label="Back to booking"
                  customCB={() => router.push("/booking")}
                />
              </Box>
            </Box>
          </div>
        </FadeDiv>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="container">
        <FadeDiv>
          <div className="bookingContainer">
            <Box
              sx={{
                gridColumn: "1 / -1",
                width: "100%",
                maxWidth: 560,
                justifySelf: "center",
                minWidth: 0,
                p: { xs: 1, sm: 2 },
              }}
            >
              <Alert severity="info">
                No booking draft found. Submit the form on the booking page first.
              </Alert>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <BookingButton
                  variant="filled"
                  label="Go to booking"
                  customCB={() => router.push("/booking")}
                />
              </Box>
            </Box>
          </div>
        </FadeDiv>
      </div>
    );
  }

  return (
    <div className="container">
      <FadeDiv>
        <div className="bookingContainer">
          <Box
            sx={{
              gridColumn: "1 / -1",
              width: "100%",
              maxWidth: 760,
              justifySelf: "center",
              minWidth: 0,
              p: { xs: 1, sm: 2 },
            }}
          >
            <Stack spacing={3}>
              <Box sx={{ color: "inherit" }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                  Review your reservation
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(47, 111, 102, 0.92)" }}
                >
                  Confirm the booking details below. Online payment is not
                  active yet, so this will save a local confirmation only.
                </Typography>
              </Box>

              <Alert severity="info">
                This is the temporary checkout workflow. Payment and database
                booking creation will plug in here later without changing the
                user journey.
              </Alert>

              {submitError && <Alert severity="error">{submitError}</Alert>}

              <Paper elevation={2} sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography variant="h6">Reservation summary</Typography>
                  <Divider />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Guest
                      </Typography>
                      <Typography>
                        {draft.firstName} {draft.lastName}
                      </Typography>
                      <Typography>{draft.email}</Typography>
                      <Typography>{draft.phone}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Booking details
                      </Typography>
                      <Typography>{formattedStart}</Typography>
                      <Typography>{draft.durationHours} hour rental</Typography>
                      <Typography>{draft.quotedPriceDisplay}</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>

              {!STRIPE_ENABLED && (
                <Alert severity="warning">
                  Payment is paused for this phase. After confirmation, the
                  customer will land on a success page with a local reservation
                  reference.
                </Alert>
              )}

              {STRIPE_ENABLED && (
                <Alert severity="info">
                  {/* TODO: load Stripe, create Checkout Session, and redirect to session.url. */}
                  Stripe integration goes here.
                </Alert>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <BookingButton
                  variant="filled"
                  label="Edit booking"
                  customCB={() => router.push("/booking")}
                />
                <BookingButton
                  variant="filled"
                  label={isConfirming ? "Confirming..." : "Confirm"}
                  customCB={handleConfirmReservation}
                  disabled={isConfirming}
                />
              </Stack>
            </Stack>
          </Box>
        </div>
      </FadeDiv>
    </div>
  );
}

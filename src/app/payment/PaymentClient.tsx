"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { BookingConfirmationDraft } from "@/types/booking";
import { BOOKING_CONFIRMATION_KEY } from "@/types/booking";

type CreatePaymentIntentResponse =
  | {
      clientSecret: string;
      amountCents: number;
      currency: string;
    }
  | {
      error: string;
    };

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function PaymentElementForm({
  onPaymentComplete,
}: {
  onPaymentComplete: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setSubmitError(null);
    setIsSubmitting(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      setSubmitError(result.error.message ?? "Payment failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onPaymentComplete();
  };

  return (
    <Stack spacing={2}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <PaymentElement />
          {submitError && <Alert severity="error">{submitError}</Alert>}
          <Button type="submit" variant="contained" disabled={!stripe || isSubmitting}>
            {isSubmitting ? "Processing..." : "Pay now"}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

export default function PaymentClient() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<BookingConfirmationDraft | null>(
    null
  );
  const [parseError, setParseError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currency, setCurrency] = useState("usd");
  const [amountCents, setAmountCents] = useState<number | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_CONFIRMATION_KEY);
      if (!raw) {
        setConfirmation(null);
        return;
      }
      setConfirmation(JSON.parse(raw) as BookingConfirmationDraft);
    } catch {
      setParseError("Could not load your booking confirmation draft.");
    }
  }, []);

  useEffect(() => {
    const createIntent = async () => {
      if (!confirmation) return;

      setFetchError(null);
      setIsLoadingIntent(true);

      try {
        const res = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmation }),
        });
        const json = (await res.json()) as CreatePaymentIntentResponse;
        if (!res.ok || "error" in json) {
          setFetchError(
            "error" in json ? json.error : "Unable to initialize payment."
          );
          return;
        }
        setClientSecret(json.clientSecret);
        setAmountCents(json.amountCents);
        setCurrency(json.currency);
      } catch {
        setFetchError("Network error while preparing Stripe payment.");
      } finally {
        setIsLoadingIntent(false);
      }
    };

    void createIntent();
  }, [confirmation]);

  const formattedStart = useMemo(() => {
    if (!confirmation) return "";
    const date = new Date(confirmation.startIso);
    return Number.isNaN(date.getTime())
      ? confirmation.startIso
      : date.toLocaleString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
  }, [confirmation]);

  if (!publishableKey) {
    return (
      <Box sx={{ p: 3, maxWidth: 760, mx: "auto" }}>
        <Alert severity="warning">
          Missing <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>. Add it to{" "}
          <code>.env.local</code> and your deployment environment variables.
        </Alert>
      </Box>
    );
  }

  if (parseError) {
    return (
      <Box sx={{ p: 3, maxWidth: 760, mx: "auto" }}>
        <Alert severity="error">{parseError}</Alert>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => router.push("/booking")}>
          Return to booking
        </Button>
      </Box>
    );
  }

  if (!confirmation) {
    return (
      <Box sx={{ p: 3, maxWidth: 760, mx: "auto" }}>
        <Alert severity="info">
          No confirmation draft found. Complete booking and confirmation first.
        </Alert>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => router.push("/booking")}
        >
          Go to booking
        </Button>
      </Box>
    );
  }

  if (paymentDone) {
    return (
      <Box sx={{ p: 3, maxWidth: 760, mx: "auto" }}>
        <Stack spacing={2}>
          <Alert severity="success">
            Payment completed successfully for reference code{" "}
            <strong>{confirmation.confirmationCode}</strong>.
          </Alert>
          <Button variant="contained" onClick={() => router.push("/booking")}>
            Start another booking
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 760, mx: "auto" }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Complete payment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your reservation is confirmed. Complete payment below to finalize it.
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Typography variant="h6">Reservation summary</Typography>
            <Divider />
            <Typography>
              <strong>Reference:</strong> {confirmation.confirmationCode}
            </Typography>
            <Typography>
              <strong>Guest:</strong> {confirmation.firstName} {confirmation.lastName}
            </Typography>
            <Typography>
              <strong>Start time:</strong> {formattedStart}
            </Typography>
            <Typography>
              <strong>Duration:</strong> {confirmation.durationHours} hour rental
            </Typography>
            <Typography>
              <strong>Quoted price:</strong> {confirmation.quotedPriceDisplay}
            </Typography>
            {amountCents !== null && (
              <Typography>
                <strong>Charge amount:</strong> $
                {(amountCents / 100).toFixed(2)} {currency.toUpperCase()}
              </Typography>
            )}
          </Stack>
        </Paper>

        {fetchError && <Alert severity="error">{fetchError}</Alert>}

        {isLoadingIntent && (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={18} />
            <Typography>Preparing secure payment...</Typography>
          </Stack>
        )}

        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentElementForm onPaymentComplete={() => setPaymentDone(true)} />
          </Elements>
        )}
      </Stack>
    </Box>
  );
}

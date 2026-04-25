"use client";

import { useMemo, useState } from "react";
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

export default function ConfirmationStepClient() {
  const router = useRouter();
  const [draftLoad] = useState<{
    draft: BookingCheckoutDraft | null;
    parseError: string | null;
  }>(() => {
    if (typeof window === "undefined") {
      return { draft: null, parseError: null };
    }
    try {
      const raw = sessionStorage.getItem(BOOKING_CHECKOUT_DRAFT_KEY);
      if (!raw) return { draft: null, parseError: null };
      return {
        draft: JSON.parse(raw) as BookingCheckoutDraft,
        parseError: null,
      };
    } catch {
      return { draft: null, parseError: "Invalid booking data in storage." };
    }
  });
  const { draft, parseError } = draftLoad;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

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

  const handleContinueToPayment = () => {
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

      sessionStorage.setItem(
        BOOKING_CONFIRMATION_KEY,
        JSON.stringify(confirmation)
      );
      sessionStorage.removeItem(BOOKING_CHECKOUT_DRAFT_KEY);

      router.push("/payment");
    } catch {
      setSubmitError(
        "Could not complete this confirmation step. Please try again."
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
                  Confirm the booking details below, then continue to secure
                  payment.
                </Typography>
              </Box>

              <Alert severity="info">
                This confirmation step replaces the previous checkout route.
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
                  label={isConfirming ? "Preparing payment..." : "Continue to payment"}
                  customCB={handleContinueToPayment}
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

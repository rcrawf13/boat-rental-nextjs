"use client";

import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useRouter } from "next/navigation";
import type {
  BookingCheckoutDraft,
  BookingConfirmationDraft,
} from "@/types/booking";
import {
  BOOKING_CHECKOUT_DRAFT_KEY,
  BOOKING_CONFIRMATION_KEY,
} from "@/types/booking";

export default function ConfirmationClient() {
  const router = useRouter();
  const [confirmation, setConfirmation] =
    useState<BookingConfirmationDraft | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BOOKING_CONFIRMATION_KEY);
      if (!raw) {
        setConfirmation(null);
        return;
      }
      setConfirmation(JSON.parse(raw) as BookingConfirmationDraft);
    } catch {
      setParseError("Could not load the reservation confirmation.");
    }
  }, []);

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

  const handleEditBooking = () => {
    if (!confirmation) return;

    const draft: BookingCheckoutDraft = {
      firstName: confirmation.firstName,
      lastName: confirmation.lastName,
      email: confirmation.email,
      phone: confirmation.phone,
      startIso: confirmation.startIso,
      durationHours: confirmation.durationHours,
      quotedPriceDisplay: confirmation.quotedPriceDisplay,
      clientCreatedAtIso: confirmation.clientCreatedAtIso,
    };

    sessionStorage.setItem(BOOKING_CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
    router.push("/booking");
  };

  const handleStartNewBooking = () => {
    sessionStorage.removeItem(BOOKING_CONFIRMATION_KEY);
    sessionStorage.removeItem(BOOKING_CHECKOUT_DRAFT_KEY);
    router.push("/booking");
  };

  if (parseError) {
    return (
      <Box sx={{ p: 3, maxWidth: 560 }}>
        <Alert severity="error">{parseError}</Alert>
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleStartNewBooking}>
          Return to booking
        </Button>
      </Box>
    );
  }

  if (!confirmation) {
    return (
      <Box sx={{ p: 3, maxWidth: 560 }}>
        <Alert severity="info">
          No confirmation was found. Complete the booking review step first.
        </Alert>
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleStartNewBooking}>
          Go to booking
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 760, mx: "auto" }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Reservation details confirmed
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your reservation has been saved locally for this demo workflow.
            Payment will be connected here later.
          </Typography>
        </Box>

        <Alert severity="success">
          Reference code: <strong>{confirmation.confirmationCode}</strong>
        </Alert>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Reservation summary</Typography>
            <Divider />
            <Typography>
              <strong>Guest:</strong> {confirmation.firstName}{" "}
              {confirmation.lastName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {confirmation.email}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {confirmation.phone}
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
            <Typography>
              <strong>Status:</strong> Reserved, payment not yet collected
            </Typography>
          </Stack>
        </Paper>

        <Alert severity="warning">
          Payment and booking persistence are intentionally paused in this phase.
          Later, this screen will be reached after the booking insert and payment
          completion flow succeeds.
        </Alert>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="outlined" onClick={handleEditBooking}>
            Edit booking
          </Button>
          <Button variant="contained" onClick={handleStartNewBooking}>
            Start a new booking
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

import type { Metadata } from "next";
import ConfirmationStepClient from "./ConfirmationStepClient";

export const metadata: Metadata = {
  title: "Confirm Reservation Details",
  description:
    "Review your Lake Norman boat rental details before you continue to payment with Nomad Adventure Rentals.",
  alternates: {
    canonical: "/booking/confirmation",
  },
};

export default function BookingConfirmationPage() {
  return <ConfirmationStepClient />;
}

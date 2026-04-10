import type { Metadata } from "next";
import ConfirmationClient from "./ConfirmationClient";

export const metadata: Metadata = {
  title: "Booking Confirmation",
  description:
    "View your Nomad Adventure Rentals confirmation details for your Lake Norman boat reservation.",
  alternates: {
    canonical: "/booking/confirmation",
  },
};

export default function BookingConfirmationPage() {
  return <ConfirmationClient />;
}

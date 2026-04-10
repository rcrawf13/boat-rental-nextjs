import type { Metadata } from "next";
import CheckoutPlaceholderClient from "./CheckoutPlaceholderClient";

export const metadata: Metadata = {
  title: "Review Reservation Details",
  description:
    "Review your Lake Norman boat rental details before final confirmation with Nomad Adventure Rentals.",
  alternates: {
    canonical: "/booking/checkout",
  },
};

export default function BookingCheckoutPage() {
  return <CheckoutPlaceholderClient />;
}

import type { Metadata } from "next";

import "@/components/booking/booking.css";
import Booking from "@/components/booking/Booking";
import Providers from "../providers";

export const metadata: Metadata = {
  title: "Book a Pontoon on Lake Norman",
  description:
    "Choose your date, time, and rental details for Nomad Adventure Rentals at Lake Norman near Charlotte, NC.",
  alternates: {
    canonical: "/booking",
  },
};

export default function BookingPage() {
  return (
    <Providers>
      <Booking />
    </Providers>
  );
}

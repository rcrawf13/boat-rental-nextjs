import type { Metadata } from "next";

import Root from "@/components/Root";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Boat Rentals at Lake Norman, NC",
  description:
    "Reserve your Lake Norman pontoon rental with Nomad Adventure Rentals near Charlotte, North Carolina.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <Providers>
      <Root />
    </Providers>
  );
}

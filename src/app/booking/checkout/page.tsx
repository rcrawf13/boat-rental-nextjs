import { redirect } from "next/navigation";

export default function BookingCheckoutPageRedirect() {
  redirect("/booking/confirmation");
}

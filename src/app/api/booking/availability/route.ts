import { NextResponse } from "next/server";
import { defaultBookingAvailability } from "@/lib/bookingAvailabilitySeed";

/**
 * GET — schedule + booked slots for the booking picker (see APIResponse).
 *
 * Later (not done yet):
 * - Load schedule + bookedSlots from Supabase / DB
 * - POST /api/bookings — persist reservation, server-side validation
 * - Stripe Checkout + webhook → update booking payment status
 * - Confirmation email (Resend / etc.)
 * - Rate limiting / abuse protection
 */
export async function GET() {
  return NextResponse.json(defaultBookingAvailability);
}

/**
 * Shape of booking data collected on /booking (matches session handoff to confirmation step).
 * Used for sessionStorage draft until Supabase insert is wired.
 */
export interface BookingCheckoutDraft {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** ISO string for selected rental start */
  startIso: string;
  /** Rental length in hours */
  durationHours: number;
  /** Display string e.g. "$250.00" */
  quotedPriceDisplay: string;
  /** When draft was created (client clock) */
  clientCreatedAtIso: string;
}

export const BOOKING_CHECKOUT_DRAFT_KEY = "bookingCheckoutDraft";

/**
 * Local confirmation payload used between /booking/confirmation and /payment.
 * Replace this with a server response payload once Supabase/Stripe are wired.
 */
export interface BookingConfirmationDraft extends BookingCheckoutDraft {
  confirmationCode: string;
  confirmedAtIso: string;
  status: "reserved_unpaid";
}

export const BOOKING_CONFIRMATION_KEY = "bookingConfirmationDraft";

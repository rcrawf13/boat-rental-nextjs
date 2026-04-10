/**
 * Shape of booking data collected on /booking (matches DB + session handoff to checkout).
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
 * Local-only confirmation shape used until real booking insert + payment exist.
 * Replace this with a server response payload once Supabase/Stripe are wired.
 */
export interface BookingConfirmationDraft extends BookingCheckoutDraft {
  confirmationCode: string;
  confirmedAtIso: string;
  status: "reserved_unpaid";
}

export const BOOKING_CONFIRMATION_KEY = "bookingConfirmationDraft";

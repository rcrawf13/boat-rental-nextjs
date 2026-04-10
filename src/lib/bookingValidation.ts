import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { APIResponse } from "@/context/contexts_types/APIRes";
import { shouldDisableTime } from "@/components/booking/static-date-time-picker/should_disabile_time_util";
import { MIN_RENTAL_HOURS } from "@/lib/bookingConstants";

/** Re-export for callers that already import from `bookingValidation`. */
export { MIN_RENTAL_HOURS };

/** Letters (ASCII + Latin-1 supplement), spaces, apostrophes, hyphens — no digits */
const NAME_PATTERN = /^[A-Za-z\u00C0-\u024F\s'-]+$/;

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export type BookingFieldKey = "firstName" | "lastName" | "email" | "phone";

export type BookingFieldErrors = Partial<Record<BookingFieldKey | "datetime" | "duration", string>>;

/**
 * Quoted price string for a whole-hour rental length (same formula as APIDurationComponents).
 */
export function priceDisplayForDurationHours(hours: number): string {
  const additionalHours = hours - 4;
  const priceAdditional = 400 + additionalHours * 75;
  return `$${priceAdditional}.00`;
}

/**
 * How many whole hours you can add to `start` and still finish on or before `close`.
 * Example: start 6pm, close 10pm → 4 hours (rental ends exactly at close).
 */
function maxWholeHoursUntilClose(start: Dayjs, close: Dayjs): number {
  let longest = 0;
  for (let hours = 1; hours <= 72; hours++) {
    const rentalEnd = start.add(hours, "hour");
    if (!rentalEnd.isAfter(close)) longest = hours;
    else break;
  }
  return longest;
}

/** Same geometry as validateBookingWindow — single source for validation + UI */
export function getMaxDurationHours(
  selectedDayJSObj: Dayjs | null | undefined,
  apiRes: APIResponse
): number {
  if (!selectedDayJSObj) return 0;

  const dayIndex = selectedDayJSObj.day();
  const dailyRule = apiRes.schedule[dayIndex];

  if (!dailyRule || !dailyRule.isOpen) return 0;

  const start = selectedDayJSObj;

  const open = start
    .hour(dailyRule.startHour)
    .minute(dailyRule.startMinute)
    .second(0)
    .millisecond(0);

  const close = start
    .hour(dailyRule.endHour)
    .minute(dailyRule.endMinute)
    .second(0)
    .millisecond(0);

  if (start.isBefore(open)) return 0;

  // Start with "how long until closing," then shorten if a future booking is in the way.
  let maxHours = maxWholeHoursUntilClose(start, close);

  const sortedBookings = [...apiRes.bookedSlots].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  for (const booking of sortedBookings) {
    const bookStart = dayjs(booking.start);
    const bookEnd = dayjs(booking.end);

    // Start time falls inside someone else's booking → cannot rent here.
    const startsDuringExisting = start.isBefore(bookEnd) && !start.isBefore(bookStart);
    if (startsDuringExisting) return 0;

    // Ignore bookings that already ended before our start.
    if (!bookStart.isAfter(start)) continue;

    // Longest rental that ends on or before the next booking begins.
    let hoursUntilNextBooking = 0;
    for (let h = 1; h <= maxHours; h++) {
      const rentalEnd = start.add(h, "hour");
      if (!rentalEnd.isAfter(bookStart)) hoursUntilNextBooking = h;
      else break;
    }
    maxHours = Math.min(maxHours, hoursUntilNextBooking);
    break;
  }

  return maxHours;
}

/**
 * Picker value must pass the same hour/minute disable rules used by StaticDateTimePicker.
 */
export function isDateTimeAllowedByPickerRules(
  start: Dayjs,
  apiRes: APIResponse
): boolean {
  if (shouldDisableTime(start, "hours", apiRes)) return false;
  if (shouldDisableTime(start, "minutes", apiRes)) return false;
  return true;
}

/** Aligns with StaticDateTimePicker `disablePast` (minute precision). */
export function isValidBookingPickerSelection(
  selected: Dayjs,
  apiRes: APIResponse,
  now: Dayjs = dayjs()
): boolean {
  if (selected.isBefore(now, "minute")) return false;
  return isDateTimeAllowedByPickerRules(selected, apiRes);
}

/** Round up to the next :00 or :30 (picker steps in 30-minute increments). */
function ceilToHalfHour(d: Dayjs): Dayjs {
  const t = d.second(0).millisecond(0);
  const minute = t.minute();
  if (minute === 0 || minute === 30) return t;
  if (minute < 30) return t.minute(30);
  return t.add(1, "hour").minute(0);
}

/** First opening instant on or after calendar `dayStart` (start of that day). */
function firstOpenOnOrAfter(dayStart: Dayjs, apiRes: APIResponse): Dayjs | null {
  let d = dayStart.startOf("day");
  for (let k = 0; k < 370; k++) {
    const rule = apiRes.schedule[d.day()];
    if (rule?.isOpen) {
      return d
        .hour(rule.startHour)
        .minute(rule.startMinute)
        .second(0)
        .millisecond(0);
    }
    d = d.add(1, "day");
  }
  return null;
}

/**
 * Walk forward from `from` until we hit a time the picker would allow (not in the past,
 * open hours, no collisions — same rules as `shouldDisableTime`).
 * Returns `from` if nothing works within the iteration limit (should be rare).
 */
export function findNextSelectableBookingStart(
  from: Dayjs,
  apiRes: APIResponse,
  now: Dayjs = dayjs()
): Dayjs {
  if (isValidBookingPickerSelection(from, apiRes, now)) return from;

  let candidate = from.second(0).millisecond(0);
  const maxIterations = 3000;

  for (let i = 0; i < maxIterations; i++) {
    // Past times are never valid (matches MUI "disable past").
    if (candidate.isBefore(now, "minute")) {
      candidate = ceilToHalfHour(now);
    }

    const rule = apiRes.schedule[candidate.day()];

    if (!rule?.isOpen) {
      const nextOpen = firstOpenOnOrAfter(candidate.startOf("day"), apiRes);
      if (!nextOpen) return from;
      candidate = nextOpen;
      continue;
    }

    const openTime = candidate
      .hour(rule.startHour)
      .minute(rule.startMinute)
      .second(0)
      .millisecond(0);
    const closeTime = candidate
      .hour(rule.endHour)
      .minute(rule.endMinute)
      .second(0)
      .millisecond(0);
    // Latest start so a MIN_RENTAL_HOURS rental still ends by closing.
    const latestStartForMinRental = closeTime.subtract(MIN_RENTAL_HOURS, "hour");

    if (candidate.isBefore(openTime)) candidate = openTime;

    if (candidate.isBefore(now, "minute")) {
      const earliestToday = ceilToHalfHour(now);
      if (candidate.isBefore(earliestToday, "minute")) candidate = earliestToday;
    }

    if (candidate.isAfter(latestStartForMinRental)) {
      const nextOpen = firstOpenOnOrAfter(candidate.startOf("day").add(1, "day"), apiRes);
      if (!nextOpen) return from;
      candidate = nextOpen;
      continue;
    }

    if (isValidBookingPickerSelection(candidate, apiRes, now)) return candidate;

    candidate = candidate.add(30, "minute");
  }

  return from;
}

/**
 * Full window: open → close, no overlap with bookedSlots for [start, start + duration).
 */
export function validateBookingWindow(
  start: Dayjs,
  durationHours: number,
  apiRes: APIResponse
): string | null {
  const dayIndex = start.day();
  const dailyRule = apiRes.schedule[dayIndex];

  if (!dailyRule || !dailyRule.isOpen) {
    return "That day is closed — choose another date.";
  }

  if (durationHours < MIN_RENTAL_HOURS) {
    return `Minimum rental is ${MIN_RENTAL_HOURS} hours.`;
  }

  const open = start
    .hour(dailyRule.startHour)
    .minute(dailyRule.startMinute)
    .second(0)
    .millisecond(0);

  const close = start
    .hour(dailyRule.endHour)
    .minute(dailyRule.endMinute)
    .second(0)
    .millisecond(0);

  if (start.isBefore(open)) {
    return "Start time is before opening.";
  }

  const end = start.add(durationHours, "hour");
  if (end.isAfter(close)) {
    return "That rental length goes past closing time — shorten the duration or pick an earlier start.";
  }

  const overlap = apiRes.bookedSlots.some((booking) => {
    const bookStart = dayjs(booking.start);
    const bookEnd = dayjs(booking.end);
    return start.isBefore(bookEnd) && end.isAfter(bookStart);
  });

  if (overlap) {
    return "That time overlaps an existing booking — pick a different start or length.";
  }

  if (!isDateTimeAllowedByPickerRules(start, apiRes)) {
    return "Selected day or time is not available — adjust using the calendar rules.";
  }

  return null;
}

export function validateNameField(value: string, label: string): string | null {
  const t = value.trim();
  if (!t) return `${label} is required.`;
  if (!NAME_PATTERN.test(t)) {
    return `${label} may only include letters, spaces, hyphens, and apostrophes.`;
  }
  return null;
}

export function validateEmail(value: string): string | null {
  const t = value.trim();
  if (!t) return "Email is required.";
  if (!EMAIL_PATTERN.test(t)) return "Enter a valid email address.";
  return null;
}

/** Keeps digits; requires 10–15 digits (international-friendly) */
export function validatePhone(value: string): string | null {
  const t = value.trim();
  if (!t) return "Phone number is required.";
  const digits = t.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return "Enter a valid phone number (10–15 digits).";
  }
  return null;
}

export function validateBookingFormFields(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}): BookingFieldErrors {
  const out: BookingFieldErrors = {};

  const fn = validateNameField(input.firstName, "First name");
  if (fn) out.firstName = fn;

  const ln = validateNameField(input.lastName, "Last name");
  if (ln) out.lastName = ln;

  const em = validateEmail(input.email);
  if (em) out.email = em;

  const ph = validatePhone(input.phone);
  if (ph) out.phone = ph;

  return out;
}

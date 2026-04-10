import type { Dayjs } from "dayjs";
import type { TimeView } from "@mui/x-date-pickers/models";
import type { APIResponse } from "@/context/contexts_types/APIRes";
import { MIN_RENTAL_HOURS } from "@/lib/bookingConstants";
import dayjs from "dayjs";
import type { RefObject, Dispatch, SetStateAction } from "react";
import type { PickerValue } from "@mui/x-date-pickers/internals";

/**
 * MUI calls this when rendering hour/minute cells. Return true to grey out a value.
 * Rules mirror the business: open days only, start not too early/late for a min-length rental,
 * and no overlap with existing bookings (for the hour list).
 */
export function shouldDisableTime(
  timeValue: Dayjs,
  view: TimeView,
  APIRes: APIResponse
): boolean {
  const dayIndex = timeValue.day();
  const dailyRule = APIRes.schedule[dayIndex];
  if (!dailyRule || !dailyRule.isOpen) {
    return true;
  }

  const hour = timeValue.hour();
  const lastAllowedStartHour = dailyRule.endHour - MIN_RENTAL_HOURS;
  const beforeOpen = hour < dailyRule.startHour;
  const afterLastAllowedStart = hour > lastAllowedStartHour;

  if (view === "hours" && (beforeOpen || afterLastAllowedStart)) {
    return true;
  }

  if (view === "minutes") {
    if (hour === dailyRule.startHour) {
      return timeValue.minute() < dailyRule.startMinute;
    }
    if (hour === lastAllowedStartHour) {
      return timeValue.minute() > 0;
    }
  }

  const rentalStart = timeValue;
  const rentalEnd = timeValue.add(MIN_RENTAL_HOURS, "hour");
  const overlapsABooking = APIRes.bookedSlots.some((booking) => {
    const bookStart = dayjs(booking.start);
    const bookEnd = dayjs(booking.end);
    return rentalStart.isBefore(bookEnd) && rentalEnd.isAfter(bookStart);
  });

  if (view === "hours" && overlapsABooking) {
    return true;
  }

  return false;
}

/**
 * Snap minutes when the user picks a new hour so the value matches common schedule steps
 * (e.g. weekday opens at 5:30 → hour 17 uses :30, later hours use :00).
 * TODO: drive this from `dailyRule.startHour/startMinute` instead of hard-coded 17.
 */
const WEEKDAY_OPEN_HOUR = 17;

export const handleChange = (
  e: PickerValue,
  prevHourRef: RefObject<number | null>,
  setSelectedDayJSObj: Dispatch<SetStateAction<Dayjs>>
) => {
  if (!e) return;

  const hour = e.hour();
  const previousHour = prevHourRef.current;

  let newValue = e;

  if (hour !== previousHour) {
    if (hour === WEEKDAY_OPEN_HOUR) {
      newValue = e.minute(30);
    } else if (hour > WEEKDAY_OPEN_HOUR) {
      newValue = e.minute(0);
    }
  }

  prevHourRef.current = hour;
  setSelectedDayJSObj(newValue);
};

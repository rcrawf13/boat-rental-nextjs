import type { APIResponse } from "@/context/contexts_types/APIRes";

/**
 * Default schedule (Sun–Sat) until this is read from a database.
 * Keep in sync with any future admin / Supabase source of truth.
 */
export const defaultBookingAvailability: APIResponse = {
  schedule: [
    { startHour: 10, startMinute: 0, endHour: 20, endMinute: 0, isOpen: true },
    { startHour: 17, startMinute: 30, endHour: 22, endMinute: 0, isOpen: true },
    { startHour: 17, startMinute: 30, endHour: 22, endMinute: 0, isOpen: true },
    { startHour: 17, startMinute: 30, endHour: 22, endMinute: 0, isOpen: true },
    { startHour: 17, startMinute: 30, endHour: 22, endMinute: 0, isOpen: true },
    { startHour: 17, startMinute: 30, endHour: 22, endMinute: 0, isOpen: true },
    { startHour: 10, startMinute: 0, endHour: 20, endMinute: 0, isOpen: true },
  ],
  bookedSlots: [],
};

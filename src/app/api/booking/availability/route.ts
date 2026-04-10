import { NextResponse } from "next/server";
import type { APIResponse, DaySchedule } from "@/context/contexts_types/APIRes";
import { createServiceRoleClient } from "@/lib/supabaseService";

const SCHEDULE_DAY_COUNT = 7;

type WeeklyHoursRow = {
  weekday: number;
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
  is_open: boolean;
};

const closedDay: DaySchedule = {
  startHour: 0,
  startMinute: 0,
  endHour: 0,
  endMinute: 0,
  isOpen: false,
};

function logSupabaseQueryError(label: string, err: { message: string }) {
  console.error(`${label}:`, err.message);
  const cause = (err as { cause?: unknown }).cause;
  if (cause !== undefined) console.error(`${label} cause:`, cause);
}

function buildSchedule(rows: WeeklyHoursRow[] | null): DaySchedule[] {
  const byWeekday = new Map<number, WeeklyHoursRow>();
  for (const row of rows ?? []) {
    byWeekday.set(row.weekday, row);
  }
  return Array.from({ length: SCHEDULE_DAY_COUNT }, (_, weekday) => {
    const row = byWeekday.get(weekday);
    if (!row) return { ...closedDay };
    return {
      startHour: row.start_hour,
      startMinute: row.start_minute,
      endHour: row.end_hour,
      endMinute: row.end_minute,
      isOpen: row.is_open,
    };
  });
}

/**
 * GET — schedule + booked slots for the booking picker (see APIResponse).
 *
 * Data: Supabase tables `booking_weekly_hours`, `booked_slots` (service role on server only).
 */
export async function GET() {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[api/booking/availability]", e);
    }
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const [hoursRes, slotsRes] = await Promise.all([
    supabase
      .from("booking_weekly_hours")
      .select(
        "weekday, start_hour, start_minute, end_hour, end_minute, is_open"
      )
      .order("weekday", { ascending: true }),
    supabase.from("booked_slots").select("start_at, end_at"),
  ]);

  if (hoursRes.error) {
    logSupabaseQueryError("booking_weekly_hours", hoursRes.error);
    return NextResponse.json(
      { error: "Failed to load booking schedule" },
      { status: 502 }
    );
  }
  if (slotsRes.error) {
    logSupabaseQueryError("booked_slots", slotsRes.error);
    return NextResponse.json(
      { error: "Failed to load booked slots" },
      { status: 502 }
    );
  }

  const schedule = buildSchedule(hoursRes.data as WeeklyHoursRow[] | null);
  const bookedSlots = (slotsRes.data ?? []).map((row) => ({
    start: row.start_at as string,
    end: row.end_at as string,
  }));

  const body: APIResponse = { schedule, bookedSlots };
  return NextResponse.json(body);
}

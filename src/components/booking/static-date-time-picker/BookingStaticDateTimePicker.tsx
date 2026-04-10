"use client";

import {
  useCallback,
  useContext,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ActivePriceContext from "@/context/ActivePriceContext";
import APIResContext from "@/context/APIResContext";
import BookingMobilePickerActionBar from "@/components/booking/BookingMobilePickerActionBar";
import { handleChange, shouldDisableTime } from "./should_disabile_time_util";

export type BookingStaticDateTimePickerProps = {
  /** Called when the user completes the picker (OK on final step). */
  onFinish: () => void;
};

/**
 * Single shared date/time picker for booking — uses should_disabile_time_util
 * and the custom action bar so OK always commits and runs onFinish.
 */
export default function BookingStaticDateTimePicker({
  onFinish,
}: BookingStaticDateTimePickerProps) {
  const prevHourRef = useRef<number | null>(null);
  const [currentView, setCurrentView] = useState<
    "day" | "hours" | "minutes"
  >("day");
  const APIRes = useContext(APIResContext);
  const { selectedDayJSObj, setSelectedDayJSObj } =
    useContext(ActivePriceContext);

  const actionBarSlot = useCallback(
    (barProps: ComponentProps<typeof BookingMobilePickerActionBar>) => (
      <BookingMobilePickerActionBar
        {...barProps}
        onFinish={onFinish}
        onBackInPicker={() => setCurrentView("day")}
        onNextInPicker={() =>
          setCurrentView((prev) => (prev === "day" ? "hours" : "minutes"))
        }
      />
    ),
    [onFinish]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateTimePicker
        sx={{ backgroundColor: "transparent", justifySelf: "center" }}
        localeText={
          {
            dateTimePickerToolbarTitle: "Select Day & Start Time",
          } as Record<string, string>
        }
        disablePast
        value={selectedDayJSObj}
        view={currentView}
        onViewChange={(nextView) =>
          setCurrentView(nextView as "day" | "hours" | "minutes")
        }
        onChange={(e) => handleChange(e, prevHourRef, setSelectedDayJSObj)}
        shouldDisableTime={(value, view) =>
          shouldDisableTime(value, view, APIRes)
        }
        slots={{ actionBar: actionBarSlot }}
      />
    </LocalizationProvider>
  );
}

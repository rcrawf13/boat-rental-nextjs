"use client";

import Button from "@mui/material/Button";
import BookingStaticDateTimePicker from "./BookingStaticDateTimePicker";
import ActivePriceContext from "@/context/ActivePriceContext";
import { useContext } from "react";

export type StaticDateTimeProps = {
  /** When true, show the compact summary instead of the picker (synced with mobile “step 2”). */
  detailsStepActive: boolean;
  /** User finished the picker (OK) — parent sets detailsStepActive true. */
  onPickerFinished: () => void;
  /** User wants to change date/time from summary — parent sets detailsStepActive false. */
  onRequestChangeDateTime: () => void;
};

const StaticDateTime = ({
  detailsStepActive,
  onPickerFinished,
  onRequestChangeDateTime,
}: StaticDateTimeProps) => {
  const { selectedDayJSObj } = useContext(ActivePriceContext);

  return (
    <div
      className={
        detailsStepActive
          ? "dateTimeInputs dateTimeInputs--summaryMode"
          : "dateTimeInputs"
      }
    >
      {detailsStepActive ? (
        <div className="dateTimeInputsSummary">
          <p className="dateTimeInputsSummary-label">Start time selected</p>
          <p className="dateTimeInputsSummary-value" aria-live="polite">
            {selectedDayJSObj.format("ddd, MMM D, YYYY · h:mm A")}
          </p>
          <Button
            type="button"
            variant="outlined"
            onClick={onRequestChangeDateTime}
            className="dateTimeInputsSummary-edit"
            sx={{
              borderColor: "#FFFFFF",
              color: "#FFFFFF",
              "&:hover": {
                borderColor: "#FFFFFF",
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Change date & time
          </Button>
        </div>
      ) : (
        <BookingStaticDateTimePicker onFinish={onPickerFinished} />
      )}
    </div>
  );
};

export default StaticDateTime;

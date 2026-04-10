"use client";

import BookingForm from "./components/BookingForm";
import FadeDiv from "@/components/fade_div/FadeDiv";
import StaticDateTime from "@/components/booking/static-date-time-picker/StaticDateTime";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMediaQuery from "@mui/material/useMediaQuery";
import APIResContext from "@/context/APIResContext";
import NumberValueContext from "@/context/NumberValueContext";
import ActivePriceContext from "@/context/ActivePriceContext";
import type { APIResponse } from "@/context/contexts_types/APIRes";
import {
  findNextSelectableBookingStart,
  getMaxDurationHours,
  isValidBookingPickerSelection,
  priceDisplayForDurationHours,
} from "@/lib/bookingValidation";
import "./booking.css";

const Booking = () => {
  const [bookingAvailability, setBookingAvailability] = useState<
    APIResponse | undefined
  >();
  const [availabilityError, setAvailabilityError] = useState(false);
  const [availabilityRetryKey, setAvailabilityRetryKey] = useState(0);
  const [numberValue, setNumberValue] = useState<number>(2);
  const [durationClampHint, setDurationClampHint] = useState<string | null>(
    null
  );
  const [detailsStepActive, setDetailsStepActive] = useState(false);
  const numberValueRef = useRef(numberValue);

  const { selectedDayJSObj, setSelectedDayJSObj, setActive, setCurrentPrice } =
    useContext(ActivePriceContext);

  const clearDurationClampHint = useCallback(() => {
    setDurationClampHint(null);
  }, []);
  const isNarrow = useMediaQuery("(max-width: 879px)", { noSsr: true });

  useEffect(() => {
    let cancelled = false;
    setAvailabilityError(false);

    (async () => {
      try {
        const res = await fetch("/api/booking/availability");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as APIResponse;
        if (!cancelled) setBookingAvailability(data);
      } catch {
        if (!cancelled) {
          setAvailabilityError(true);
          setBookingAvailability(undefined);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [availabilityRetryKey]);

  useEffect(() => {
    numberValueRef.current = numberValue;
  }, [numberValue]);

  useEffect(() => {
    if (!bookingAvailability) return;
    if (!isValidBookingPickerSelection(selectedDayJSObj, bookingAvailability)) {
      const next = findNextSelectableBookingStart(
        selectedDayJSObj,
        bookingAvailability
      );
      if (isValidBookingPickerSelection(next, bookingAvailability)) {
        setSelectedDayJSObj(next);
      }
      return;
    }
    const max = getMaxDurationHours(selectedDayJSObj, bookingAvailability);
    if (max < 2) return;

    const prev = numberValueRef.current;
    const next = Math.min(prev, max);
    if (next >= prev) return;

    setNumberValue(next);
    setCurrentPrice(priceDisplayForDurationHours(next));
    if (next === 2) setActive(2);
    else if (next === 4) setActive(4);

    setDurationClampHint(
      `Adjusted to ${next} hour${next === 1 ? "" : "s"} to fit closing time and availability.`
    );
  }, [
    selectedDayJSObj,
    bookingAvailability,
    setActive,
    setCurrentPrice,
    setSelectedDayJSObj,
  ]);

  useEffect(() => {
    if (!durationClampHint) return;
    const t = setTimeout(() => setDurationClampHint(null), 8000);
    return () => clearTimeout(t);
  }, [durationClampHint]);

  if (availabilityError) {
    return (
      <div
        className="container"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1rem",
          textAlign: "center",
          color: "#D7E3E2",
        }}
      >
        <p style={{ margin: 0 }}>Could not load booking schedule.</p>
        <Button
          type="button"
          variant="outlined"
          onClick={() => setAvailabilityRetryKey((k) => k + 1)}
          sx={{ borderColor: "#D7E3E2", color: "#D7E3E2" }}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!bookingAvailability) {
    return (
      <div
        className="container"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <CircularProgress sx={{ color: "#D7E3E2" }} size="10vh" />
      </div>
    );
  }

  return (
    <APIResContext.Provider value={bookingAvailability}>
      <NumberValueContext.Provider
        value={{
          numberValue,
          setNumberValue,
          durationClampHint,
          clearDurationClampHint,
        }}
      >
        <div className="container">
          <FadeDiv>
            <div className="bookingContainer">
              {(!isNarrow || !detailsStepActive) && (
                <StaticDateTime
                  detailsStepActive={detailsStepActive}
                  onPickerFinished={() => setDetailsStepActive(true)}
                  onRequestChangeDateTime={() => setDetailsStepActive(false)}
                />
              )}
              {isNarrow ? (
                detailsStepActive && (
                  <div className="bookingFormStepMobile">
                    <Button
                      type="button"
                      variant="text"
                      onClick={() => setDetailsStepActive(false)}
                      sx={{ color: "#2F6F66", alignSelf: "flex-start" }}
                      aria-label="Back to date and time selection"
                    >
                      <ArrowBackIcon />
                    </Button>
                    <BookingForm />
                  </div>
                )
              ) : (
                <BookingForm flowLocked={!detailsStepActive} />
              )}
            </div>
          </FadeDiv>
        </div>
      </NumberValueContext.Provider>
    </APIResContext.Provider>
  );
};

export default Booking;

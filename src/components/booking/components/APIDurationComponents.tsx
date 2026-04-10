"use client";

import { motion } from "motion/react";
import { useCallback, useContext, useState } from "react";
import type { Dayjs } from "dayjs";
import ActivePriceContext from "@/context/ActivePriceContext";
import APIResContext from "@/context/APIResContext";
import NumberValueContext from "@/context/NumberValueContext";
import BookingNumber from "./BookingNumber";
import addIcon from "@/assets/add-icon.svg";
import { staticImportSrc } from "@/lib/staticImportSrc";
import {
  getMaxDurationHours,
  priceDisplayForDurationHours,
} from "@/lib/bookingValidation";

// Define types clearly
interface ActiveContextType {
  active?: number;
  setActive?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPrice: React.Dispatch<React.SetStateAction<string>>;
  selectedDayJSObj?: Dayjs;
}

const APIDurationComponents = () => {
  const { selectedDayJSObj, active, setActive, setCurrentPrice } = useContext(
    ActivePriceContext
  ) as ActiveContextType;
  const apiRes = useContext(APIResContext);
  const { setNumberValue, clearDurationClampHint, durationClampHint } =
    useContext(NumberValueContext);
  const [open, setOpen] = useState<boolean>(true);

  const maxDuration = getMaxDurationHours(selectedDayJSObj, apiRes);

  const updateCurrentPrice = useCallback(
    (value: number | null) => {
      if (value != null && value >= 2) {
        setCurrentPrice(priceDisplayForDurationHours(value));
      }
    },
    [setCurrentPrice]
  );

  const handleChange = (val: number): void => {
    if (setActive) setActive(val);
    setNumberValue(val);
    updateCurrentPrice(val);
    clearDurationClampHint();
  };

  const handleOpen = (): void => {
    setOpen(!open);
  };

  // If less than 2 hours available, don't show booking options
  if (maxDuration < 2) return null; 

  return (
    <div className="durCont">
      <p>Choose Your time on the water</p>
      {durationClampHint ? (
        <p className="bookingFlowClampHint" role="status">
          {durationClampHint}
        </p>
      ) : null}
      {open ? (
        <div className="bookingFlowDurationBtns">
          {/* Always show 2 Hrs (since maxDuration >= 2) */}
          <motion.button
            type="button"
            className={
              active === 2
                ? "bookingFlowDurBtn bookingFlowDurBtn--active"
                : "bookingFlowDurBtn"
            }
            whileHover={{ cursor: "pointer" }}
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            style={{ transformOrigin: "center" }}
            onClick={() => handleChange(2)}
          >
            2 Hrs
          </motion.button>

          {maxDuration >= 4 && (
            <motion.button
              type="button"
              className={
                active === 4
                  ? "bookingFlowDurBtn bookingFlowDurBtn--active"
                  : "bookingFlowDurBtn"
              }
              whileHover={{ cursor: "pointer" }}
              initial={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformOrigin: "center" }}
              onClick={() => handleChange(4)}
            >
              4 Hrs
            </motion.button>
          )}

          {/* Custom Button - Logic to show input */}
          <motion.button
            type="button"
            whileHover={{ cursor: "pointer" }}
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              transformOrigin: "center",
              backgroundImage: `url(${staticImportSrc(addIcon)})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "50%",
              backgroundPosition: "center center",
            }}
            id="customTime"
            onClick={handleOpen}
          />
        </div>
      ) : (
        /* Custom Input View */
        <BookingNumber 
           totalAvailableBookingTime={maxDuration} 
           updateCurrentPrice={updateCurrentPrice} 
        />
      )}
    </div>
  );
};

export default APIDurationComponents;
"use client";

import { motion, useAnimate } from "motion/react";
import { useRouter } from "next/navigation";
import "./bookingbutton.css";
interface BookingButtonProps {
  variant?: "outlined" | "filled";
  label?: string;
  customCB?: () => void;
  disabled?: boolean;
}
const BookingButton = ({
  variant = "outlined",
  label = "Book Now",
  customCB = undefined,
  disabled = false,
}: BookingButtonProps) => {
  const router = useRouter();
  const navigateToBooking = () => router.push("/booking");
  const [scope, animate] = useAnimate();

  const runClickAction = async () => {
    if (disabled) return;
    await animate(scope.current, { scale: [1.2, 0.5, 1] }, { duration: 0.2 });
    if (customCB) {
      customCB();
      return;
    }
    navigateToBooking();
  };

  return (
    <>
      {variant === "outlined" ? (
        <motion.button
          ref={scope}
          type="button"
          id="outlined"
          disabled={disabled}
          aria-disabled={disabled}
          onClick={runClickAction}
        >
          {label}
        </motion.button>
      ) : (
        <motion.button
          ref={scope}
          type="button"
          id="filled"
          disabled={disabled}
          aria-disabled={disabled}
          onClick={runClickAction}
        >
          {label}
        </motion.button>
      )}
    </>
  );
};
export default BookingButton;

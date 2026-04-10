"use client";

import Button from "@mui/material/Button";
import DialogActions, { type DialogActionsProps } from "@mui/material/DialogActions";
import { usePickerContext, usePickerTranslations } from "@mui/x-date-pickers/hooks";
import { useRouter } from "next/navigation";

export type BookingMobilePickerActionBarProps = DialogActionsProps & {
  /** Called after the user confirms the final step (OK), including when the value was unchanged (MUI may omit onAccept in that case). */
  onFinish?: () => void;
  /** Called when user presses Back from the final time step. */
  onBackInPicker?: () => void;
  /** Called when user presses Next while still inside picker steps. */
  onNextInPicker?: () => void;
};

/**
 * Replaces the default action bar so "OK" always runs our navigation after acceptValueChanges.
 * Mirrors nextOrAccept: Next on multi-step, then OK commits and runs onFinish.
 */
export default function BookingMobilePickerActionBar({
  onFinish,
  onBackInPicker,
  onNextInPicker,
  ...dialogActionsProps
}: BookingMobilePickerActionBarProps) {
  const { acceptValueChanges, hasNextStep } = usePickerContext();
  const router = useRouter();
  const translations = usePickerTranslations();

  const handleBack = () => {
    // On the final time-selection step, return to date-selection view.
    // Otherwise, leave booking and return to the home route.
    if (!hasNextStep) {
      onBackInPicker?.();
      return;
    }
    router.push("/");
  };

  return (
    <DialogActions {...dialogActionsProps}>
      <Button onClick={handleBack}>Back</Button>
      <Button
        onClick={() => {
          if (hasNextStep) {
            onNextInPicker?.();
          } else {
            acceptValueChanges();
            onFinish?.();
          }
        }}
      >
        {hasNextStep ? translations.nextStepButtonLabel : translations.okButtonLabel}
      </Button>
    </DialogActions>
  );
}

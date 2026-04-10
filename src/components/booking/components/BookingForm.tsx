"use client";

import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import BookingButton from "@/components/shared/booking-button/BookingButton";
import APIDurationComponents from "./APIDurationComponents";
import ImgPriceComp from "./ImgPriceComp";
import ActivePriceContext from "@/context/ActivePriceContext";
import APIResContext from "@/context/APIResContext";
import NumberValueContext from "@/context/NumberValueContext";
import {
  getMaxDurationHours,
  validateBookingFormFields,
  validateBookingWindow,
  type BookingFieldErrors,
} from "@/lib/bookingValidation";
import { useRouter } from "next/navigation";
import type { BookingCheckoutDraft } from "@/types/booking";
import { BOOKING_CHECKOUT_DRAFT_KEY } from "@/types/booking";

type BookingFormProps = {
  flowLocked?: boolean;
};

const BookingForm = ({ flowLocked = false }: BookingFormProps) => {
  const router = useRouter();
  const apiRes = useContext(APIResContext);
  const { selectedDayJSObj, currentPrice } = useContext(ActivePriceContext);
  const { numberValue } = useContext(NumberValueContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [fieldErrors, setFieldErrors] = useState<BookingFieldErrors>({});
  const [showSummaryError, setShowSummaryError] = useState<string | null>(null);

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (!digits) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };
  const isAllowedPhoneKey = (key: string) =>
    key.length !== 1 || /\d/.test(key);

  const handleSubmit = () => {
    if (flowLocked) return;
    setShowSummaryError(null);

    const fe = validateBookingFormFields({
      firstName,
      lastName,
      email,
      phone,
    });
    setFieldErrors(fe);
    if (Object.keys(fe).length > 0) {
      return;
    }

    const maxD = getMaxDurationHours(selectedDayJSObj, apiRes);
    if (maxD < 2) {
      setFieldErrors((prev) => ({
        ...prev,
        datetime:
          "Not enough rental time available for the selected date — pick another day or time.",
      }));
      setShowSummaryError(
        "Adjust your date or time using the calendar (see schedule rules)."
      );
      return;
    }

    if (numberValue < 2 || numberValue > maxD) {
      setFieldErrors((prev) => ({
        ...prev,
        duration: `Choose a duration between 2 and ${maxD} hour(s) for this start time.`,
      }));
      setShowSummaryError("Choose a valid rental length.");
      return;
    }

    const windowErr = validateBookingWindow(
      selectedDayJSObj,
      numberValue,
      apiRes
    );
    if (windowErr) {
      setFieldErrors((prev) => ({ ...prev, datetime: windowErr }));
      setShowSummaryError(windowErr);
      return;
    }

    const draft: BookingCheckoutDraft = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      startIso: selectedDayJSObj.toISOString(),
      durationHours: numberValue,
      quotedPriceDisplay: currentPrice,
      clientCreatedAtIso: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(BOOKING_CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      setShowSummaryError("Could not save your booking draft. Check browser storage settings.");
      return;
    }

    router.push("/booking/checkout");
  };

  const isDefaultLayoutLocked = flowLocked;

  const summaryAlert =
    showSummaryError && (
      <Alert severity="warning" sx={{ maxWidth: 462, width: "100%" }}>
        {showSummaryError}
      </Alert>
    );

  const durationErrorAlert =
    (fieldErrors.datetime || fieldErrors.duration) && (
      <Alert severity="error" sx={{ maxWidth: 462, width: "100%" }}>
        {fieldErrors.datetime ?? fieldErrors.duration}
      </Alert>
    );

  const fieldsGrid = (
    <div className="bookingFormFields">
      <TextField
        fullWidth
        label="First Name"
        required
        disabled={isDefaultLayoutLocked}
        value={firstName}
        error={!!fieldErrors.firstName}
        helperText={fieldErrors.firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Last Name"
        required
        disabled={isDefaultLayoutLocked}
        value={lastName}
        error={!!fieldErrors.lastName}
        helperText={fieldErrors.lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        required
        disabled={isDefaultLayoutLocked}
        value={email}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Phone Number"
        required
        disabled={isDefaultLayoutLocked}
        value={phone}
        error={!!fieldErrors.phone}
        helperText={fieldErrors.phone}
        onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
        onKeyDown={(e) => {
          if (!isAllowedPhoneKey(e.key)) {
            e.preventDefault();
          }
        }}
        inputProps={{ inputMode: "numeric" }}
      />
    </div>
  );

  return (
    <div
      className={`bookingForm${isDefaultLayoutLocked ? " bookingForm--flowLocked" : ""}`}
      aria-disabled={isDefaultLayoutLocked}
    >
      <ImgPriceComp />
      <fieldset className="bookingFormFieldset" disabled={isDefaultLayoutLocked}>
        <APIDurationComponents />
        {summaryAlert}
        {fieldsGrid}
        {durationErrorAlert}
        <BookingButton variant="filled" label="Submit" customCB={handleSubmit} />
      </fieldset>
    </div>
  );
};

export default BookingForm;

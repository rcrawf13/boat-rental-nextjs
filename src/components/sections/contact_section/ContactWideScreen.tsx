"use client";

import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import BookingButton from "@/components/shared/booking-button/BookingButton";
import { useState } from "react";
import { validateEmail, validateNameField } from "@/lib/bookingValidation";
import SuccessCheckMark from "./SuccessCheckMark";

type ContactFormValues = {
  fName: string;
  lName: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

const MyTextField = styled(TextField)({
  "& .MuiInputLabel-root": {
    color: "#3A745C",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "solid #3A745C 1pt",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "solid #3A745C 2pt",
  },
});

const ContactWideScreen = () => {
  const formFields: ContactFormValues = {
    fName: "",
    lName: "",
    email: "",
    subject: "",
    message: "",
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formFieldsObj, setFormFieldsObj] = useState(formFields);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  const formInsert = async () => {
    // Supabase submission intentionally disabled for local UI preview.
    return Promise.resolve();
  };

  const validateFields = (): ContactFieldErrors => {
    const errors: ContactFieldErrors = {};

    const firstNameError = validateNameField(formFieldsObj.fName, "First name");
    if (firstNameError) errors.fName = firstNameError;

    const lastNameError = validateNameField(formFieldsObj.lName, "Last name");
    if (lastNameError) errors.lName = lastNameError;

    const emailError = validateEmail(formFieldsObj.email);
    if (emailError) errors.email = emailError;

    if (!formFieldsObj.subject.trim()) errors.subject = "Subject is required.";
    if (!formFieldsObj.message.trim()) errors.message = "Message is required.";

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    await formInsert();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="contactWideScreenContain">
        <div className="contactSuccessState">
          <SuccessCheckMark />
          <h3 className="contactSuccessState__title">Message Received</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="contactWideScreenContain">
      <div className="greyBox">
        <h3>Leave a Message</h3>
        <div className="nameInputs">
          <MyTextField
            label="First Name"
            InputLabelProps={{ shrink: true }}
            required
            value={formFieldsObj.fName}
            error={!!fieldErrors.fName}
            helperText={fieldErrors.fName}
            onChange={(e) => {
              setFormFieldsObj({ ...formFieldsObj, fName: e.target.value });
              if (fieldErrors.fName) setFieldErrors((prev) => ({ ...prev, fName: undefined }));
            }}
          />
          <MyTextField
            label="Last Name"
            InputLabelProps={{ shrink: true }}
            required
            value={formFieldsObj.lName}
            error={!!fieldErrors.lName}
            helperText={fieldErrors.lName}
            onChange={(e) => {
              setFormFieldsObj({ ...formFieldsObj, lName: e.target.value });
              if (fieldErrors.lName) setFieldErrors((prev) => ({ ...prev, lName: undefined }));
            }}
          />
        </div>

        <MyTextField
          sx={{ width: "100%" }}
          label="Email"
          required
          InputLabelProps={{ shrink: true }}
          value={formFieldsObj.email}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
          onChange={(e) => {
            setFormFieldsObj({ ...formFieldsObj, email: e.target.value });
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />
        <MyTextField
          sx={{ width: "100%" }}
          label="Subject"
          required
          InputLabelProps={{ shrink: true }}
          value={formFieldsObj.subject}
          error={!!fieldErrors.subject}
          helperText={fieldErrors.subject}
          onChange={(e) => {
            setFormFieldsObj({ ...formFieldsObj, subject: e.target.value });
            if (fieldErrors.subject) setFieldErrors((prev) => ({ ...prev, subject: undefined }));
          }}
        />
        <MyTextField
          sx={{ width: "100%" }}
          label="Message"
          multiline
          rows={5}
          required
          InputLabelProps={{ shrink: true }}
          value={formFieldsObj.message}
          error={!!fieldErrors.message}
          helperText={fieldErrors.message}
          onChange={(e) => {
            setFormFieldsObj({ ...formFieldsObj, message: e.target.value });
            if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: undefined }));
          }}
        />

        <BookingButton variant="filled" label="Send Message" customCB={handleSubmit} />
      </div>
    </div>
  );
};

export default ContactWideScreen;
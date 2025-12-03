"use client";

import Typography from '@mui/material/Typography';

import { RHFPhoneInput } from 'src/components/hook-form/rhf-phone-input';

export function PhoneStep() {
  return (
    <>
      <Typography variant="subtitle1">Add your phone number</Typography>
      <RHFPhoneInput name="stepTwo.phone" />
    </>
  );
}

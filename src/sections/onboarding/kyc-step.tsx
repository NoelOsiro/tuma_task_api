"use client";

import Typography from '@mui/material/Typography';

import { Field } from 'src/components/hook-form/fields';

export function KYCStep() {
  return (
    <>
      <Typography variant="subtitle1">Tell us your full name</Typography>
      <Field.Text name="stepOne.fullName" label="Full name" variant="filled" />
    </>
  );
}

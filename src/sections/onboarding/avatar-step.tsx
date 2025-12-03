"use client";

import Typography from '@mui/material/Typography';

import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';

export function AvatarStep() {
  return (
    <>
      <Typography variant="subtitle1">Upload an avatar</Typography>
      <RHFUploadAvatar name="stepThree.avatar" slotProps={{ wrapper: { sx: { display: 'flex', justifyContent: 'center' } } }} />
    </>
  );
}

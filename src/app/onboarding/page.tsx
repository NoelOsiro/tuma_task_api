"use client";

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Step from '@mui/material/Step';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { CONFIG } from 'src/global-config';
import { AuthCenteredLayout } from 'src/layouts/auth-centered/layout';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form/form-provider';

import { KYCStep } from 'src/sections/onboarding/kyc-step';
import { PhoneStep } from 'src/sections/onboarding/phone-step';
import { AvatarStep } from 'src/sections/onboarding/avatar-step';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';

const STEPS = ['KYC', 'Phone', 'Avatar'];

const StepOneSchema = zod.object({ fullName: zod.string().min(1, 'Full name is required') });
const StepTwoSchema = zod.object({ phone: zod.string().min(1, 'Phone is required') });
const StepThreeSchema = zod.object({ avatar: zod.any().optional() });

const WizardSchema = zod.object({ stepOne: StepOneSchema, stepTwo: StepTwoSchema, stepThree: StepThreeSchema });
type WizardType = zod.infer<typeof WizardSchema>;

const defaultValues: WizardType = {
  stepOne: { fullName: '' },
  stepTwo: { phone: '' },
  stepThree: { avatar: undefined },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, checkUserSession } = useAuthContext();

  // If the user already completed onboarding, redirect to dashboard immediately
  useEffect(() => {
    try {
      if (user && typeof user.onboarding === 'boolean' && user.onboarding === true) {
        const target = CONFIG.auth.redirectPath || '/dashboard';
        router.replace(target);
      }
    } catch (err) {
      // ignore
    }
  }, [user, router]);

  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm<WizardType>({ mode: 'onChange', resolver: zodResolver(WizardSchema), defaultValues });

  const { handleSubmit, trigger, setValue, getValues, formState } = methods;

  const handleNext = useCallback(
    async (step?: 'stepOne' | 'stepTwo') => {
      if (step) {
        const isValid = await trigger(step);
        if (isValid) setActiveStep((s) => s + 1);
      } else {
        setActiveStep((s) => s + 1);
      }
    },
    [trigger]
  );

  const handleBack = useCallback(() => setActiveStep((s) => s - 1), []);

  const onSubmit = handleSubmit(async (values) => {
      const promise = (async () => {
      // upload avatar if present via server endpoint
      const avatar = values.stepThree.avatar as File | undefined;
      let avatarPath: string | undefined = undefined;

      if (avatar instanceof File) {
        const userId = user?.id;
        if (!userId) throw new Error('Not authenticated');

        const formData = new FormData();
        formData.append('avatar', avatar, (avatar as any).name);
        formData.append('userId', userId);

        const uploadResRaw = await fetch('/api/profile/avatar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user?.access_token || user?.accessToken || ''}`,
          },
          body: formData,
        });
        const uploadRes = await uploadResRaw.json();

        // support multiple response shapes: { error } | { data: {...} } | { path, signedUrl }
        const uploadError = uploadRes?.error || uploadRes?.data?.error;
        if (uploadError) throw new Error(uploadError);

        // server returns either top-level path or data.path
        avatarPath = uploadRes?.path || uploadRes?.data?.path || uploadRes?.data?.object || uploadRes?.object || undefined;
      }

      const payload: any = { onboarding: true, phone: values.stepTwo.phone, full_name: values.stepOne.fullName };
      if (avatarPath) payload.avatar_path = avatarPath;

      const onboardingResRaw = await fetch('/api/profile/onboarding', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access_token || user?.accessToken || ''}`,
        },
        body: JSON.stringify(payload),
      });
      const res = await onboardingResRaw.json();
      if (res?.error) throw new Error(res.error);

      if (typeof checkUserSession === 'function') await checkUserSession();

      // done
      return res?.data;
    })();

    try {
      await toast.promise(promise, {
        loading: 'Saving onboarding...',
        success: 'Onboarding complete',
        error: (err) => `Onboarding failed: ${String(err)}`,
      });

      router.replace(CONFIG.auth.redirectPath || '/dashboard');
    } catch (err) {
      console.error('Onboarding submit error', err);
    }
  });

  const completed = activeStep === STEPS.length;

  return (
    <AuthCenteredLayout
      sx={{ position: 'relative' }}
      slotProps={{
        header: {
          disableOffset: true,
          disableElevation: true,
          sx: { zIndex: 9, position: { md: 'relative' } },
          slots: {
            topArea: (
              <Alert severity="info" sx={{ borderRadius: 0 }}>
                Complete your profile so we can get you started.
              </Alert>
            ),
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, px: { xs: 2, md: 4 } }}>
        <Card sx={{ p: { xs: 3, md: 6 }, width: '100%', maxWidth: { xs: '100%', md: 1000 } }} elevation={6}>
          <Stack spacing={3}>
            <Typography variant="h5">Complete your onboarding</Typography>

            <Stepper activeStep={activeStep} alternativeLabel>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Form methods={methods} onSubmit={onSubmit}>
              <Box sx={{ p: { xs: 1, md: 2 }, mb: 1, minHeight: { xs: 220, md: 320 }, display: 'flex', flexDirection: 'column', gap: 3, maxWidth: { xs: '100%', md: 760 }, mx: 'auto' }}>
                {activeStep === 0 && <KYCStep />}

                {activeStep === 1 && <PhoneStep />}

                {activeStep === 2 && <AvatarStep />}

                {completed && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography>Onboarding complete — redirecting...</Typography>
                  </Box>
                )}
              </Box>

              {!completed && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mr: 2 }}>
                      Back
                    </Button>
                  )}

                  <Box sx={{ flex: '1 1 auto' }} />

                  {activeStep < STEPS.length - 1 && (
                    <Button variant="contained" onClick={() => handleNext(activeStep === 0 ? 'stepOne' : 'stepTwo')}>
                      Next
                    </Button>
                  )}

                  {activeStep === STEPS.length - 1 && (
                    <LoadingButton type="submit" variant="contained" loading={formState.isSubmitting} sx={{ ml: 1 }}>
                      Finish
                    </LoadingButton>
                  )}
                </Box>
              )}
            </Form>
          </Stack>
        </Card>
      </Box>
    </AuthCenteredLayout>
  );
}

import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fPercent } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutWhat({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container
        component={MotionViewport}
        sx={{ py: { xs: 10, md: 15 }, textAlign: { xs: 'center', md: 'unset' } }}
      >
        <Grid container columnSpacing={{ md: 3 }} sx={{ alignItems: 'flex-start' }}>
          <Grid
            container
            size={{ xs: 12, md: 6, lg: 7 }}
            sx={{ pr: { md: 7 }, alignItems: 'center', display: { xs: 'none', md: 'flex' } }}
          >
            <Grid size={6}>
              <m.div variants={varFade('inUp')}>
                <Image
                  alt="Our office small"
                  src={`${CONFIG.assetsDir}/assets/images/about/what-small.webp`}
                  ratio="1/1"
                  sx={(theme) => ({
                    borderRadius: 3,
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                    ...theme.applyStyles('dark', {
                      boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                    }),
                  })}
                />
              </m.div>
            </Grid>

            <Grid size={6}>
              <m.div variants={varFade('inUp')}>
                <Image
                  alt="Our office large"
                  src={`${CONFIG.assetsDir}/assets/images/about/what-large.webp`}
                  ratio="3/4"
                  sx={(theme) => ({
                    borderRadius: 3,
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
                    ...theme.applyStyles('dark', {
                      boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                    }),
                  })}
                />
              </m.div>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <Typography component={m.h2} variants={varFade('inRight')} variant="h2" sx={{ mb: 3 }}>
              What is TumaTask?
            </Typography>

            <Typography
              component={m.p}
              variants={varFade('inRight')}
              sx={[
                (theme) => ({
                  color: 'text.secondary',
                  ...theme.applyStyles('dark', {
                    color: 'common.white',
                  }),
                }),
              ]}
            >
              TumaTask is Kenya’s easiest way to earn money through local tasks. 
              Whether you want to deliver items, help with cleaning, run errands, or offer digital services, our app connects you with people in your area who need your help. 
              Get paid safely, track your tasks, and grow your earnings — all from your phone.

            </Typography>

            <Box
              sx={{
                my: 5,
                gap: 3,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {SKILLS.map((progress, index) => (
                <m.div key={progress.label} variants={varFade('inRight')}>
                  <Box
                    sx={{
                      mb: 1,
                      display: 'flex',
                      typography: 'body2',
                      alignItems: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ flexGrow: 1, color: 'text.primary' }}>
                      {progress.label}
                    </Typography>
                    {fPercent(progress.value)}
                  </Box>

                  <LinearProgress
                    color={(index === 0 && 'primary') || (index === 1 && 'warning') || 'error'}
                    variant="determinate"
                    value={progress.value}
                  />
                </m.div>
              ))}
            </Box>

            <Button
              component={m.button}
              variants={varFade('inRight')}
              variant="outlined"
              color="inherit"
              size="large"
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            >
              Our work
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

const SKILLS = Array.from({ length: 3 }, (_, index) => ({
  value: [85, 92, 78][index],
  label: ['Local Deliveries', 'Home Services', 'Digital Tasks'][index],
}));

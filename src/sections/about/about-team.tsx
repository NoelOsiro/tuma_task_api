import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { _socials } from 'src/_mock';
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from 'src/assets/icons';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

export function AboutTeam({ sx, ...other }: BoxProps) {
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
    },
  });

  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 10, md: 15 } }}>
        <m.div variants={varFade('inDown')}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Featured Services
          </Typography>
        </m.div>

        <m.div variants={varFade('inUp')}>
          <Typography variant="h2" sx={{ my: 3 }}>
            Popular Task Categories
          </Typography>
        </m.div>

        <m.div variants={varFade('inUp')}>
          <Typography sx={{ mx: 'auto', maxWidth: 640, color: 'text.secondary' }}>
            Discover the most in-demand services on TumaTask. From quick deliveries to professional home services, find the perfect task that matches your skills and schedule.
          </Typography>
        </m.div>

        <Box sx={{ position: 'relative' }}>
          <CarouselArrowFloatButtons {...carousel.arrows} options={carousel.options} />

          <Carousel carousel={carousel} sx={{ px: 0.5 }}>
            {TASK_CATEGORIES.map((category) => (
              <Box
                key={category.id}
                component={m.div}
                variants={varFade('in')}
                sx={{ py: { xs: 8, md: 10 } }}
              >
                <TaskCard category={category} />
              </Box>
            ))}
          </Carousel>
        </Box>

        <Button
          size="large"
          color="inherit"
          variant="outlined"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={24} />}
          sx={{ mx: 'auto' }}
        >
          Browse all categories
        </Button>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

type TaskCardProps = {
  category: (typeof TASK_CATEGORIES)[number];
};

function TaskCard({ category }: TaskCardProps) {
  return (
    <Card>
      <Typography variant="subtitle1" sx={{ mt: 2.5, mb: 0.5 }}>
        {category.name}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2.5, color: 'text.secondary' }}>
        {category.description}
      </Typography>

      <Box sx={{ px: 1 }}>
        <Image alt={category.name} src={category.imageUrl} ratio="1/1" sx={{ borderRadius: 2 }} />
      </Box>

      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: 'primary.main' }}>
          {category.taskCount}+ Tasks
        </Typography>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

const TASK_CATEGORIES = [
  {
    id: 1,
    name: 'Package Delivery',
    description: 'Quick and reliable delivery services across Nairobi',
    imageUrl: `${CONFIG.assetsDir}/assets/images/tasks/delivery.webp`,
    taskCount: 250,
  },
  {
    id: 2,
    name: 'Home Cleaning',
    description: 'Professional cleaning services for homes and offices',
    imageUrl: `${CONFIG.assetsDir}/assets/images/tasks/cleaning.webp`,
    taskCount: 180,
  },
  {
    id: 3,
    name: 'Digital Services',
    description: 'Online tasks including data entry and social media',
    imageUrl: `${CONFIG.assetsDir}/assets/images/tasks/digital.webp`,
    taskCount: 320,
  },
  {
    id: 4,
    name: 'Handyman Services',
    description: 'Repairs, maintenance, and home improvement tasks',
    imageUrl: `${CONFIG.assetsDir}/assets/images/tasks/handyman.webp`,
    taskCount: 150,
  },
];

'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import { ContactHero } from '../contact-hero';
import { ContactForm } from '../contact-form';

// ----------------------------------------------------------------------

export function ContactView() {
  return (
    <>
      <ContactHero />
      <Container component="section" sx={{ py: 10 }}>
        <Box
          sx={{
            gap: 10,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          <ContactForm />

          <Box
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              height: { xs: 300, md: '100%' },
            }}
          >
            <Image
              alt="TumaTask Location Map"
              src={`${CONFIG.assetsDir}/assets/images/contact/location.png`}
              ratio="16/9"
              sx={{
                width: 1,
                height: 1,
                objectFit: 'cover',
              }}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
}

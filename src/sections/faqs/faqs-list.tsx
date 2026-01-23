import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function FaqsList({ sx, ...other }: BoxProps) {
  return (
    <Box sx={sx} {...other}>
      {TUMATASK_FAQS.map((accordion) => (
        <Accordion key={accordion.id}>
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">{accordion.heading}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography>{accordion.detail}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

const TUMATASK_FAQS = [
  {
    id: 'faq-1',
    value: 'panel1',
    heading: 'How do I start earning money on TumaTask?',
    detail: 'Getting started is easy! Download the TumaTask app, create your account, complete your profile verification, and start browsing available tasks in your area. Once you find a task you like, accept it and complete it to get paid.',
  },
  {
    id: 'faq-2',
    value: 'panel2',
    heading: 'How and when do I get paid for completed tasks?',
    detail: 'Payments are processed within 24 hours after task completion and client approval. You can receive payments via M-Pesa, bank transfer, or other mobile money options available in Kenya. Minimum withdrawal is KES 100.',
  },
  {
    id: 'faq-3',
    value: 'panel3',
    heading: 'What types of tasks are available on TumaTask?',
    detail: 'TumaTask offers various task categories including package deliveries, home cleaning, handyman services, digital tasks like data entry, errands, tutoring, pet care, and many more. Tasks are available across major Kenyan cities.',
  },
  {
    id: 'faq-4',
    value: 'panel4',
    heading: 'Is TumaTask safe and secure?',
    detail: 'Yes! We verify all users, secure payments through our platform, and provide 24/7 customer support. We also have a rating system to ensure quality and safety for both task posters and task completers.',
  },
  {
    id: 'faq-5',
    value: 'panel5',
    heading: 'What are the fees for using TumaTask?',
    detail: 'TumaTask charges a small service fee of 10% from task completers and 5% from task posters. This fee covers payment processing, customer support, and platform maintenance. No hidden charges.',
  },
  {
    id: 'faq-6',
    value: 'panel6',
    heading: 'Can I work part-time on TumaTask?',
    detail: 'Absolutely! TumaTask is designed for flexibility. You can work as much or as little as you want, choose tasks that fit your schedule, and earn supplemental income alongside your main job or studies.',
  },
  {
    id: 'faq-7',
    value: 'panel7',
    heading: 'What happens if there\'s a dispute with a client?',
    detail: 'Our support team mediates disputes fairly. We review evidence from both parties and make decisions based on our terms of service. We also hold payments in escrow until disputes are resolved to protect both parties.',
  },
  {
    id: 'faq-8',
    value: 'panel8',
    heading: 'How do I increase my chances of getting more tasks?',
    detail: 'Complete your profile fully, maintain good ratings, respond quickly to task invitations, offer competitive pricing, and specialize in popular services. Building a strong reputation will help you get more task opportunities.',
  },
];

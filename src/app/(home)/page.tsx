import type { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'TumaTask: ISP Billing System',
  keywords: ['TumaTask', 'ISP Billing System', 'ISP Billing System UI', 'ISP Billing System UI Kit', 'ISP Billing System UI Kit UI'],
  description:
    'TumaTask is a billing system for ISPs, built on the newest version of Material-UI ©, ready to be customized to your style',
  openGraph: {
    title: 'TumaTask: ISP Billing System',
    description: 'TumaTask is a billing system for ISPs, built on the newest version of Material-UI ©, ready to be customized to your style',
    type: 'website',
    url: 'https://TumaTask.com',
    siteName: 'TumaTask',
    images: [
      {
        url: 'https://TumaTask.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TumaTask: ISP Billing System',
      },
    ],
  },
  twitter: {
    title: 'TumaTask: ISP Billing System',
    description: 'TumaTask is a billing system for ISPs, built on the newest version of Material-UI ©, ready to be customized to your style',
    card: 'summary_large_image',
    images: [
      {
        url: 'https://TumaTask.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TumaTask: ISP Billing System',
      },
    ],
  },
};

export default function Page() {
  return <HomeView />;
}

import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { OverviewAppView } from 'src/sections/overview/app/view';
import { OverviewBookingView } from 'src/sections/overview/booking/view/overview-booking-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewBookingView />;
}

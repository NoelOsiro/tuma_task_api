import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { BidNotifications } from 'src/sections/tasks/bid-notifications';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Task Bid | Dashboard - ${CONFIG.appName}`,
};
  
export default function Page() {
  return <BidNotifications />;
}

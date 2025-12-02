import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { PostListView } from 'src/sections/blog/view/post-list-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Booking | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PostListView />;
}

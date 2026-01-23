import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { getDoc, getLatestDocs } from 'src/actions/doc-ssr';

import { PostDetailsHomeView } from 'src/sections/blog/view';

export const metadata: Metadata = { title: `Post details - ${CONFIG.appName}` };

type Props = {
  params: { title: string };
};

export default async function Page({ params }: Props) {
  const { title } = params;

  const { doc } = await getDoc(title);

  const { latestDocs } = await getLatestDocs(title);

  return <PostDetailsHomeView post={doc} latestPosts={latestDocs} />;
}



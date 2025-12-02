import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import TaskGeneralView from 'src/sections/tasks/view/task-general-view';


// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Task | Dashboard - ${CONFIG.appName}`,
};

type Props = {
  params: { id: string };
};


export default function Page({ params }: Props) {
  const { id } = params;
  return <TaskGeneralView id={id} />;
}

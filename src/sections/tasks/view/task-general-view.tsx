

import type ITaskItem from 'src/types/task';

import Box from '@mui/material/Box';

import { fetcher, endpoints } from 'src/lib/axios';

import { TaskGeneral } from './task-general';

// ----------------------------------------------------------------------

export default async function TaskGeneralView({ id }: { id: string }) {
  try {
    const data = await fetcher(`${endpoints.tasks.details}${id}`);

    // normalize response: API may return { data } or the object directly
    const task: ITaskItem | undefined = data?.data ? data.data : data;

    return (
      <Box>
        <TaskGeneral task={task} />
      </Box>
    );
  } catch (error: any) {
    console.error('Server fetch failed for task', error);
    return <Box>Error loading task: {String(error?.message ?? error)}</Box>;
  }
}

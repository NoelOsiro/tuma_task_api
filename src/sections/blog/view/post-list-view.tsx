'use client';

import type { ITaskItem, ITaskFilters } from 'src/types/task';

import { orderBy } from 'es-toolkit';
import { useState, useCallback } from 'react';
import { useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { POST_SORT_OPTIONS } from 'src/_mock';
import { useGetTasks } from 'src/actions/task';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostSort } from '../post-sort';
import { PostSearch } from '../post-search';
import { PostListHorizontal } from '../post-list-horizontal';
// ----------------------------------------------------------------------

export function PostListView() {
  const { tasks, tasksLoading } = useGetTasks();

  const tasksList = Array.isArray(tasks) ? tasks : (tasks && Array.isArray((tasks as any).data) ? (tasks as any).data : []);

  const [sortBy, setSortBy] = useState('latest');

  const { state, setState } = useSetState<ITaskFilters>({ status: 'open' });

  const dataFiltered = applyFilter({ inputData: tasksList, filters: state, sortBy });

  const handleFilterPublish = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setState({ status: newValue });
    },
    [setState]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Tasks', href: paths.dashboard.tasks.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Task
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        sx={{
          gap: 3,
          display: 'flex',
          mb: { xs: 3, md: 5 },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-end', sm: 'center' },
        }}
      >
        <PostSearch redirectPath={(id: string) => paths.dashboard.post.details(id)} />

        <PostSort
          sort={sortBy}
          onSort={(newValue: string) => setSortBy(newValue)}
          sortOptions={POST_SORT_OPTIONS}
        />
      </Box>

      <Tabs value={state.status} onChange={handleFilterPublish} sx={{ mb: { xs: 3, md: 5 } }}>
        {['open', 'completed', 'cancelled'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'open' || tab === state.status) && 'filled') || 'soft'}
                color={(tab === 'completed' && 'info') || 'default'}
              >
                {tab === 'open' && tasksList.length}
                {tab === 'completed' && tasksList.filter((task:ITaskItem) => task.status === 'completed').length}
                {tab === 'cancelled' && tasksList.filter((task:ITaskItem) => task.status === 'cancelled').length}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <PostListHorizontal tasks={dataFiltered} loading={tasksLoading} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ITaskItem[];
  filters: ITaskFilters;
  sortBy: string;
};

function applyFilter({ inputData, filters, sortBy }: ApplyFilterProps) {
  const { status } = filters;

  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['created_at'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['created_at'], ['asc']);
  }


  if (status !== 'open') {
    inputData = inputData.filter((task) => task.status === status);
  }

  return inputData;
}

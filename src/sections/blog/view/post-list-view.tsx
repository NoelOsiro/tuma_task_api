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
import { useGetPosts } from 'src/actions/blog';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostSort } from '../post-sort';
import { PostSearch } from '../post-search';
import { PostListHorizontal } from '../post-list-horizontal';
import { useGetTasks } from 'src/actions/task';
// ----------------------------------------------------------------------

export function PostListView() {
  const { tasks, tasksLoading } = useGetTasks();

  const [sortBy, setSortBy] = useState('latest');

  const { state, setState } = useSetState<ITaskFilters>({ status: 'open' });

  const dataFiltered = applyFilter({ inputData: tasks, filters: state, sortBy });

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
          { name: 'Blog', href: paths.dashboard.post.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New post
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
        <PostSearch redirectPath={(title: string) => paths.dashboard.post.details(title)} />

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
                {tab === 'open' && tasks.length}
                {tab === 'completed' && tasks.filter((task) => task.status === 'completed').length}
                {tab === 'cancelled' && tasks.filter((task) => task.status === 'cancelled').length}
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

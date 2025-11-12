import type { IPostItem } from 'src/types/blog';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { PostItemSkeleton } from './post-skeleton';
import { PostItemHorizontal } from './post-item-horizontal';
import ITaskItem from 'src/types/task';

// ----------------------------------------------------------------------

type Props = {
  tasks: ITaskItem[];
  loading?: boolean;
};

export function PostListHorizontal({ tasks, loading }: Props) {
  const renderLoading = () => <PostItemSkeleton variant="horizontal" />;

  const renderList = () =>
    tasks.map((task) => (
      <PostItemHorizontal
        key={task.id}
        task={task}
        detailsHref={paths.dashboard.tasks.details(task.title)}
        editHref={paths.dashboard.tasks.edit(task.title)}
      />
    ));

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        }}
      >
        {loading ? renderLoading() : renderList()}
      </Box>

      {tasks.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}

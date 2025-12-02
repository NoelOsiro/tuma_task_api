import type { SWRConfiguration } from 'swr';
import type ITaskItem from 'src/types/task';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';


// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type TasksData =  ITaskItem[];

export function useGetTasks() {
  const url = endpoints.tasks.list;

  const { data, isLoading, error, isValidating } = useSWR<TasksData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      tasks: data || [],
      tasksLoading: isLoading,
      tasksError: error,
      taskValidating: isValidating,
  // guard against undefined data.tasks; treat missing array as empty
  tasksEmpty: !isLoading && (data?.length ?? 0) === 0,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

type TaskData = {
  task: ITaskItem | null;
};

export function useGetTask(id: string) {
  const url = id ? `${endpoints.tasks.details}${id}` : '';

  const { data, isLoading, error, isValidating } = useSWR<TaskData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      task: data?? (data as any)?.data ?? null,
      taskLoading: isLoading,
      taskError: error,
      taskValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchTasksData = {
  results: ITaskItem[];
};

export function useSearchTasks(query: string) {
  const url = query ? [endpoints.tasks.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchTasksData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

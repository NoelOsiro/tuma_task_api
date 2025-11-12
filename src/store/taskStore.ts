import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import axios, { endpoints } from 'src/lib/axios';
import { JWT_STORAGE_KEY } from 'src/auth/context/jwt/constant';
import type { ITaskItem } from 'src/types/task';

type TaskItem = ITaskItem;

type TaskState = {
  tasks: TaskItem[];
  loading: boolean;
  error: Error | null;
  setTasks: (tasks: TaskItem[]) => void;
  fetchTasks: (opts?: { limit?: number; offset?: number }) => Promise<void>;
  createTask: (task: Partial<TaskItem>) => Promise<TaskItem>;
  editTask: (task: TaskItem) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,
      setTasks: (tasks) => set({ tasks }),

      fetchTasks: async (opts) => {
        try {
          set({ loading: true, error: null });
          const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);
          const params: any = {};
          if (opts?.limit) params.limit = opts.limit;
          if (opts?.offset) params.offset = opts.offset;

          const response = await axios.get(endpoints.tasks.list, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params,
          });

          // API may return { data: [...] } or the array directly
          const data = response?.data?.data ?? response?.data ?? [];
          set({ tasks: data, loading: false });
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to fetch tasks');
          set({ error: err, loading: false });
          throw err;
        }
      },

      createTask: async (task) => {
        try {
          set({ loading: true, error: null });
          const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);
          const response = await axios.post(endpoints.tasks.create, task, {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          });

          const created = response?.data?.data ?? response?.data;

          set((state) => ({ tasks: [...state.tasks, ...(Array.isArray(created) ? created : [created])], loading: false }));

          return created;
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to create task');
          set({ error: err, loading: false });
          throw err;
        }
      },

      editTask: async (task) => {
        try {
          set({ loading: true, error: null });
          const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);
          await axios.put(`${endpoints.tasks.update}`, task, {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          });

          set((state) => ({ tasks: state.tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)), loading: false }));
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to update task');
          set({ error: err, loading: false });
          throw err;
        }
      },

      deleteTask: async (taskId) => {
        try {
          set({ loading: true, error: null });
          const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);
          await axios.delete(`${endpoints.tasks.delete}/${taskId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId), loading: false }));
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to delete task');
          set({ error: err, loading: false });
          throw err;
        }
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTaskStore;

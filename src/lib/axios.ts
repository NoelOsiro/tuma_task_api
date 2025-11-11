import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const poster = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.post(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to post:', error);
    throw error;
  }
};

export const putter = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.put(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to put:', error);
    throw error;
  }
};

export const deleter = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.delete(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to delete:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/chat',
  kanban: '/kanban',
  calendar: '/calendar',
  auth: { me: '/auth/me', signIn: '/auth/login', signUp: '/auth/register' },
  mail: { list: '/mail/list', details: '/mail/details', labels: '/mail/labels' },
  post: {
    list: '/post/list',
    details: '/post/details',
    latest: '/post/latest',
    search: '/post/search',
  },
  tasks: {
    list: '/tasks',
    details: '/tasks/',
    search: '/tasks/search',
    create: '/tasks/create/',
    update: '/tasks/update',
    delete: '/tasks',
  },
  customer: {
    list: '/customers',
    details: '/customers/',
    search: '/customers/search',
    create: '/customers/create/',
    update: '/customers/',
    delete: '/customers',
  },
  package: {
    list: '/packages',
    details: '/packages/',
    search: '/packages/search',
    create: '/packages/create/',
    update: '/packages/update',
    delete: '/packages',
  },
};

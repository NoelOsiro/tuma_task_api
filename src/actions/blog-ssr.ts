import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export async function getPosts() {
  const res = await axios.get(endpoints.tasks.list);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getPost(title: string) {
  const URL = title ? `${endpoints.tasks.details}?title=${title}` : '';

  const res = await axios.get(URL);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getLatestPosts(title: string) {
  const URL = title ? `${endpoints.tasks.list}?title=${title}` : '';

  const res = await axios.get(URL);

  return res.data;
}

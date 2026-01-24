import axios, { endpoints } from 'src/lib/axios';
import { docsContent } from 'src/data/docs-content';

// ----------------------------------------------------------------------

export async function getDocs() {
  return docsContent;
}

// ----------------------------------------------------------------------

export async function getDoc(title: string) {
  const docs = await getDocs();
  const doc = docs.find(d => d.id === title || d.title.toLowerCase().includes(title.toLowerCase()));
  
  return { doc };
}

// ----------------------------------------------------------------------

export async function getLatestDocs(title: string) {
  const docs = await getDocs();
  const latestDocs = docs.filter(d => d.id !== title).slice(0, 4);
  
  return { latestDocs };
}

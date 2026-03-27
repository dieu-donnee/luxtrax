import { useEffect } from 'react';

export const usePageMeta = (title: string, description?: string) => {
  useEffect(() => {
    document.title = title;

    if (!description) return;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
};


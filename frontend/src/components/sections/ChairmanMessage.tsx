import Link from 'next/link';
import { fetchSettings } from '@/lib/api/settings';
import ChairmanMessageClient from './ChairmanMessageClient';

export default async function ChairmanMessage() {
  const settings = await fetchSettings().catch(() => null);
  const s = settings as unknown as Record<string, string> | null;

  const data = {
    name:     s?.chairmanName    || 'Dr. Mrinal Kanti Baowaly',
    title:    s?.chairmanTitle   || 'Professor & Chairman',
    photo:    s?.chairmanPhoto   || '/images/SIR.jpg',
    email:    s?.chairmanEmail   || 'baowaly@gmail.com',
    email2:   s?.chairmanEmail2  || 'baowaly@gstu.edu.bd',
    message:  s?.chairmanMessage || '',
  };

  return <ChairmanMessageClient data={data} />;
}

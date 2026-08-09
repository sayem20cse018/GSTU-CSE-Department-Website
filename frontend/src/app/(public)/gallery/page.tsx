import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Photo Gallery — GSTU CSE' };

interface Album {
  id: string; title: string; slug: string; category: string;
  mediaCount: number; albumDate: string; coverImage?: string;
  isPublished: boolean; isFeatured: boolean; description?: string;
}

const CATS = [
  { key: 'all',           label: 'All Albums' },
  { key: 'event',         label: 'Events' },
  { key: 'lab',           label: 'Labs' },
  { key: 'student_life',  label: 'Student Life' },
  { key: 'faculty',       label: 'Faculty' },
  { key: 'convocation',   label: 'Convocation' },
  { key: 'sports',        label: 'Sports' },
  { key: 'competition',   label: 'Competitions' },
];

const MOCK: Album[] = [
  { id:'1', title:'Annual Convocation 2023', slug:'convocation-2023', category:'convocation', mediaCount:48, albumDate:'2023-11-15', coverImage:'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', isPublished:true, isFeatured:true, description:'Annual convocation ceremony for graduating students.' },
  { id:'2', title:'Programming Contest 2024', slug:'programming-contest-2024', category:'competition', mediaCount:32, albumDate:'2024-03-10', coverImage:'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80', isPublished:true, isFeatured:true, description:'National programming contest hosted at GSTU.' },
  { id:'3', title:'AI Research Lab Opening', slug:'ai-lab-opening', category:'lab', mediaCount:24, albumDate:'2024-01-20', coverImage:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', isPublished:true, isFeatured:false, description:'Inauguration of the new AI & Machine Learning lab.' },
  { id:'4', title:'Cultural Program 2024', slug:'cultural-2024', category:'student_life', mediaCount:60, albumDate:'2024-02-14', coverImage:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80', isPublished:true, isFeatured:false, description:'Annual cultural evening organized by students.' },
  { id:'5', title:'Tech Talk: Industry Leaders', slug:'tech-talk-2024', category:'event', mediaCount:18, albumDate:'2024-03-25', coverImage:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', isPublished:true, isFeatured:false, description:'Guest lectures from industry professionals.' },
  { id:'6', title:'Sports Day 2023', slug:'sports-day-2023', category:'sports', mediaCount:42, albumDate:'2023-12-05', coverImage:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80', isPublished:true, isFeatured:false, description:'Inter-batch sports competition.' },
  { id:'7', title:'Faculty Workshop 2024', slug:'faculty-workshop-2024', category:'faculty', mediaCount:16, albumDate:'2024-04-10', coverImage:'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80', isPublished:true, isFeatured:false, description:'Faculty development workshop on modern pedagogy.' },
  { id:'8', title:'Hackathon GSTU 2024', slug:'hackathon-2024', category:'competition', mediaCount:55, albumDate:'2024-04-20', coverImage:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', isPublished:true, isFeatured:true, description:'48-hour hackathon with 30+ teams competing.' },
  { id:'9', title:'Orientation Day 2024', slug:'orientation-2024', category:'student_life', mediaCount:28, albumDate:'2024-01-05', coverImage:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80', isPublished:true, isFeatured:false, description:'Welcome ceremony for new students.' },
];

async function fetchAlbums(): Promise<Album[]> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${api}/gallery?isPublished=true&limit=50`, { next: { revalidate: 600 } });
    if (!res.ok) return MOCK;
    const json = await res.json() as { data: Album[] };
    return json.data?.length ? json.data : MOCK;
  } catch { return MOCK; }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat = 'all' } = await searchParams;
  const albums = await fetchAlbums();
  const filtered = cat === 'all' ? albums : albums.filter(a => a.category === cat);
  const featured = albums.filter(a => a.isFeatured).slice(0, 3);

  return (
    <>
      <SectionHero
        tag="Gallery"
        title="Photo Gallery"
        description="Capturing memories — events, achievements, and life at GSTU CSE."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
      />

      <div className="bg-white section-py">
        <div className="container-custom">

          {/* ── Featured albums ── */}
          {featured.length > 0 && cat === 'all' && (
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-oswald)', color: '#1a7a3c' }}>
                  FEATURED ALBUMS
                </h2>
                <div className="flex-1 h-[2px] bg-[#1a7a3c]" aria-hidden="true"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featured.map(a => (
                  <Link key={a.id} href={`/gallery/${a.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="h-48 overflow-hidden bg-slate-100">
                      {a.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.coverImage} alt={a.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-green-800 to-green-900">
                          🖼️
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5"
                        style={{ background: '#fbbf24', color: '#1a1a1a' }}>⭐ FEATURED</span>
                      <h3 className="text-white font-bold leading-snug"
                        style={{ fontFamily: 'var(--font-oswald)', fontSize: '1rem' }}>
                        {a.title}
                      </h3>
                      <p className="text-white/60 text-xs mt-1">{a.mediaCount} photos · {formatDate(a.albumDate)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Category filter ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATS.map(c => (
              <Link key={c.key} href={`/gallery${c.key === 'all' ? '' : `?cat=${c.key}`}`}
                className="text-xs font-semibold px-4 py-2 rounded-full border transition"
                style={cat === c.key
                  ? { background: '#1a7a3c', color: '#fff', borderColor: '#1a7a3c' }
                  : { background: '#fff', color: '#374151', borderColor: '#e2e8f0' }}>
                {c.label}
              </Link>
            ))}
          </div>

          {/* ── Albums grid ── */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <span className="text-5xl block mb-4" aria-hidden="true">🖼️</span>
              <p className="font-semibold text-slate-500">No albums in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(a => (
                <Link key={a.id} href={`/gallery/${a.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    {a.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.coverImage} alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl"
                        style={{ background: 'linear-gradient(135deg,#0b3d1f,#1a7a3c)' }}>
                        🖼️
                      </div>
                    )}
                    {/* Photo count overlay */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white"
                      style={{ background: 'rgba(0,0,0,0.6)' }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {a.mediaCount}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-green-700 transition line-clamp-2"
                      style={{ fontFamily: 'var(--font-inter)' }}>
                      {a.title}
                    </h3>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                        style={{ background: '#f0fdf4', color: '#166534' }}>
                        {a.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(a.albumDate)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ── Total count ── */}
          <p className="text-center text-sm text-slate-400 mt-8">
            Showing {filtered.length} album{filtered.length !== 1 ? 's' : ''}
            {cat !== 'all' && ` in "${CATS.find(c => c.key === cat)?.label ?? cat}"`}
          </p>
        </div>
      </div>
    </>
  );
}

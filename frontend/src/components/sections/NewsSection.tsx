import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { formatDate, truncate } from '@/lib/utils/format';

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  publishedAt: string;
  authorName: string;
}

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchNews(): Promise<NewsItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/news?limit=4&published=true`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return MOCK_NEWS;
    const json = await res.json() as { data: { data: NewsItem[] } };
    return json.data?.data?.length ? json.data.data : MOCK_NEWS;
  } catch {
    return MOCK_NEWS;
  }
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_NEWS: NewsItem[] = [
  {
    _id: '1', title: 'CSE Students Win Gold at International Programming Contest', slug: 'cse-win-gold-ipc-2024',
    excerpt: 'A team of three undergraduate students from the CSE Department secured first place at the ACM ICPC Regional contest held in Dhaka.',
    category: 'achievement', publishedAt: new Date().toISOString(), authorName: 'Dept. of CSE',
  },
  {
    _id: '2', title: 'New Research Lab Inaugurated for AI & Machine Learning', slug: 'ai-ml-lab-inauguration',
    excerpt: 'The university inaugurated a state-of-the-art Artificial Intelligence and Machine Learning research lab equipped with high-performance GPU clusters.',
    category: 'research', publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(), authorName: 'Admin',
  },
  {
    _id: '3', title: 'Industry-Academia Collaboration with TechBD Ltd. Signed', slug: 'techbd-mou-signed',
    excerpt: 'A Memorandum of Understanding was signed between GSTU CSE Department and TechBD Ltd. to foster internship, research and placement opportunities.',
    category: 'collaboration', publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(), authorName: 'Admin',
  },
  {
    _id: '4', title: '3-Day Workshop on Ethical Hacking & Cybersecurity Held', slug: 'cybersecurity-workshop-2024',
    excerpt: 'Over 120 students participated in an intensive workshop on ethical hacking, penetration testing and network security fundamentals.',
    category: 'event', publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(), authorName: 'CSE Club',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  achievement:   'bg-amber-100 text-amber-700',
  research:      'bg-blue-100 text-blue-700',
  collaboration: 'bg-violet-100 text-violet-700',
  event:         'bg-emerald-100 text-emerald-700',
  general:       'bg-slate-100 text-slate-600',
};

// ── Placeholder image gradient ────────────────────────────────────────────────
const GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-violet-600 to-purple-600',
  'from-emerald-600 to-teal-600',
  'from-rose-600 to-pink-600',
];

// ── Component ─────────────────────────────────────────────────────────────────
export default async function NewsSection() {
  const news = await fetchNews();
  const [featured, ...rest] = news;

  return (
    <section className="section-py bg-white" aria-labelledby="news-heading">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              News &amp; Updates
            </p>
            <h2 id="news-heading" className="text-3xl font-bold text-slate-900">
              Latest from the Department
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 border border-blue-200 hover:border-blue-400 px-4 py-2 rounded-lg transition shrink-0"
          >
            All News
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Featured card ──────────────────────────────────────────── */}
          {featured && (
            <article className="lg:col-span-2 group rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              {/* Image / gradient */}
              <div className={cn(
                'h-52 relative bg-gradient-to-br',
                GRADIENTS[0],
              )}>
                {featured.coverImage ? (
                  <img src={featured.coverImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20" aria-hidden="true">
                    <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <span className={cn(
                  'absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-md',
                  CATEGORY_COLORS[featured.category] ?? CATEGORY_COLORS.general,
                )}>
                  {featured.category.charAt(0).toUpperCase() + featured.category.slice(1)}
                </span>
              </div>
              <div className="p-6">
                <p className="text-xs text-slate-400 mb-2">
                  {formatDate(featured.publishedAt)} · {featured.authorName}
                </p>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug mb-3">
                  <Link href={`/news/${featured.slug}`}>{featured.title}</Link>
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {truncate(featured.excerpt, 180)}
                </p>
                <Link
                  href={`/news/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
                >
                  Read more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          )}

          {/* ── Side cards ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {rest.map((item, idx) => (
              <article
                key={item._id}
                className="group flex gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                {/* Tiny image / gradient */}
                <div className={cn(
                  'w-16 h-16 shrink-0 rounded-lg bg-gradient-to-br flex items-center justify-center overflow-hidden',
                  GRADIENTS[(idx + 1) % GRADIENTS.length],
                )}>
                  {item.coverImage ? (
                    <img src={item.coverImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                  ) : (
                    <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded',
                    CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.general,
                  )}>
                    {item.category}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition leading-snug line-clamp-2">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(item.publishedAt)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Link href="/news" className="text-sm font-semibold text-blue-700">View All News →</Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatDate, truncate } from "@/lib/utils/format";

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

async function fetchNews(): Promise<NewsItem[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

    const res = await fetch(`${apiUrl}/news?limit=4&published=true`, {
      next: { revalidate: 600 },
    });

    if (!res.ok) return MOCK_NEWS;

    const json = await res.json();

    return json.data?.data?.length ? json.data.data : MOCK_NEWS;
  } catch {
    return MOCK_NEWS;
  }
}

const MOCK_NEWS: NewsItem[] = [
  {
    _id: "1",
    title: "CSE Students Win International Programming Contest",
    slug: "programming-contest",
    excerpt:
      "CSE students achieved remarkable success in international programming competitions.",
    category: "Achievement",
    publishedAt: new Date().toISOString(),
    authorName: "CSE Department",
  },
  {
    _id: "2",
    title: "AI Research Laboratory Started",
    slug: "ai-lab",
    excerpt:
      "A modern AI and Machine Learning research laboratory has been inaugurated.",
    category: "Research",
    publishedAt: new Date().toISOString(),
    authorName: "Admin",
  },
  {
    _id: "3",
    title: "Industry Collaboration Program",
    slug: "industry",
    excerpt: "New collaboration opportunities created for students.",
    category: "Event",
    publishedAt: new Date().toISOString(),
    authorName: "Admin",
  },
];

const CATEGORY_STYLE: Record<string, string> = {
  Achievement: "bg-yellow-100 text-yellow-700",
  Research: "bg-blue-100 text-blue-700",
  Event: "bg-green-100 text-green-700",
};

const COLORS = [
  "from-blue-600 to-indigo-700",
  "from-purple-600 to-pink-600",
  "from-emerald-600 to-teal-600",
];

export default async function NewsSection() {
  const news = await fetchNews();

  return (
    <section className="section-py bg-slate-50">
      <div className="container-custom">
        {/* Section Heading */}

        <div className="text-center mb-12">
         
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
            Latest News
          </h2>

          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Stay updated with the latest activities, achievements, research and
            events of our department.
          </p>
        </div>

        {/* News Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <article
              key={item._id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}

              <div
                className={cn(
                  "h-52 relative bg-gradient-to-br overflow-hidden",
                  COLORS[index % COLORS.length],
                )}
              >
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg
                      className="w-20 h-20 text-white/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth="1.5"
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2Z"
                      />
                    </svg>
                  </div>
                )}

                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-blue-700">
                  {item.category}
                </span>
              </div>

              {/* Content */}

              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>{formatDate(item.publishedAt)}</span>

                  <span>{item.authorName}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-2">
                  <Link href={`/news/${item.slug}`}>{item.title}</Link>
                </h3>

                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                  {truncate(item.excerpt, 120)}
                </p>

                <Link
                  href={`/news/${item.slug}`}
                  className="inline-flex mt-5 items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Button */}

        <div className="text-center mt-12">
          <Link
            href="/news"
            className="inline-flex px-6 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
}

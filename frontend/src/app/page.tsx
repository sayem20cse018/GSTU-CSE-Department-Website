import Link from "next/link";
import { SITE } from "@/constants";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Badge */}
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
          Project Foundation Ready
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          {SITE.name}
        </h1>
        <p className="text-slate-500 text-lg">{SITE.tagline}</p>

        {/* Status grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
          {[
            { label: "Frontend", value: "Next.js 16 + TypeScript", ok: true },
            { label: "Backend", value: "NestJS on :4000", ok: true },
            { label: "Database", value: "MongoDB Atlas", ok: true },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${item.ok ? "bg-green-500" : "bg-yellow-400"}`}
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin Login
          </Link>
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-sm font-semibold px-6 py-3 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            API Docs (Swagger)
          </a>
        </div>
      </div>
    </main>
  );
}

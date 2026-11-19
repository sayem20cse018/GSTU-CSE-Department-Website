'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface FacultyLoadErrorProps {
  title?: string;
  message?: string;
  /** Smaller, left-aligned layout for embedded sections (e.g. the homepage). */
  compact?: boolean;
}

/**
 * Graceful fallback shown when the public Faculty API cannot be reached
 * (timeout, cold-start, or network failure). Distinct from an empty list —
 * which is handled separately by each page. "Try Again" re-renders the
 * server components (a soft refresh) to retry the fetch.
 */
export default function FacultyLoadError({
  title = "Couldn't load faculty",
  message = 'We had trouble reaching the server. This sometimes happens right after the site starts up — please try again in a moment.',
  compact = false,
}: FacultyLoadErrorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className={compact ? 'py-6' : 'py-16'}>
      <div
        className={
          compact
            ? 'flex items-start gap-4'
            : 'flex flex-col items-center text-center max-w-md mx-auto'
        }
      >
        <div
          className={
            compact
              ? 'shrink-0 w-11 h-11 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500'
              : 'w-14 h-14 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-4'
          }
          aria-hidden="true"
        >
          <svg
            className={compact ? 'w-5 h-5' : 'w-7 h-7'}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 7v6m0 4h.01"
            />
          </svg>
        </div>

        <div className={compact ? 'min-w-0' : undefined}>
          <h3
            className={
              compact
                ? 'font-bold text-slate-900 text-base'
                : 'text-lg font-bold text-slate-900'
            }
          >
            {title}
          </h3>
          <p
            className={
              compact
                ? 'text-sm text-slate-500 mt-1'
                : 'text-sm text-slate-500 mt-2'
            }
          >
            {message}
          </p>

          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => router.refresh())}
            className={
              compact
                ? 'mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition'
                : 'mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition'
            }
            style={{
              background: 'linear-gradient(135deg,#166534,#15803d)',
              opacity: pending ? 0.7 : 1,
            }}
          >
            {pending ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 12a8 8 0 018-8"
                  />
                </svg>
                Retrying…
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.582m-15.356-2a8.003 8.003 0 0015.356 2m0 0H15"
                  />
                </svg>
                Try Again
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

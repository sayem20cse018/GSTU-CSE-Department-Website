'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface Tab {
  id:      string;
  label:   string;
  icon:    ReactNode;
  content: string;
}

interface Props { tabs: Tab[] }

export default function AboutTabs({ tabs }: Props) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find(t => t.id === active) ?? tabs[0];

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-1 border-b border-slate-200 mb-5" role="tablist" aria-label="About sections">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg -mb-px border-b-2 transition-all',
              active === tab.id
                ? 'text-blue-700 border-blue-700 bg-blue-50/50'
                : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      <div
        key={active}
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="animate-[fadeIn_0.25s_ease]"
      >
        <div className="prose prose-sm prose-slate max-w-none">
          {current.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-slate-600 leading-relaxed text-[0.9375rem] mb-3 last:mb-0 whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

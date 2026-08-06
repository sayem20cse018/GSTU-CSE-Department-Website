import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Scholarships — GSTU CSE' };

const SCHOLARSHIPS = [
  { name: "Vice Chancellor's Merit Scholarship", provider: 'GSTU', amount: '100% Tuition Waiver', eligibility: 'Top 5% of batch by CGPA', type: 'merit', deadline: 'Each semester', desc: 'Awarded to outstanding students who maintain the highest academic standing in their batch.' },
  { name: 'CSE Department Excellence Award', provider: 'Dept. of CSE', amount: '50% Tuition Waiver', eligibility: 'CGPA ≥ 3.75, Active participation', type: 'merit', deadline: 'Annually', desc: 'Recognizes students who excel both academically and in co-curricular activities.' },
  { name: 'Need-Based Financial Aid', provider: 'GSTU', amount: 'Variable (up to 75%)', eligibility: 'Financial need + CGPA ≥ 2.75', type: 'need', deadline: 'Each semester', desc: 'Supports students from financially disadvantaged backgrounds to continue their education.' },
  { name: 'Research Assistantship (MSc/PhD)', provider: 'Research Office', amount: 'Monthly stipend + fee waiver', eligibility: 'Graduate students assigned to projects', type: 'research', deadline: 'Rolling', desc: 'Graduate students working on funded research projects receive stipend and tuition support.' },
  { name: 'Government Technical Scholarship', provider: 'Bangladesh Govt.', amount: 'BDT 3,000–6,000/month', eligibility: 'SSC/HSC GPA ≥ 4.00, Income criteria', type: 'government', deadline: 'September each year', desc: 'Government-funded scholarship for meritorious students from low-income families.' },
  { name: 'Industry Sponsored Scholarship', provider: 'Various Tech Companies', amount: 'Variable', eligibility: 'CGPA ≥ 3.50, 3rd/4th year students', type: 'industry', deadline: 'Varies by sponsor', desc: 'Technology companies sponsor students in exchange for internship commitment.' },
];

const TYPE_STYLE: Record<string, { label: string; cls: string }> = {
  merit:      { label: 'Merit',      cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  need:       { label: 'Need-Based', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  research:   { label: 'Research',   cls: 'bg-violet-50 text-violet-700 border-violet-200' },
  government: { label: 'Government', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  industry:   { label: 'Industry',   cls: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function ScholarshipsPage() {
  return (
    <>
      <SectionHero tag="Students" title="Scholarships"
        description="Financial support and recognition for deserving students at GSTU CSE."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Students', href: '/students' }, { label: 'Scholarships' }]}/>
      <div className="bg-white section-py"><div className="container-custom">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[['6+', 'Scholarship Types'], ['30%', 'Students Receive Aid'], ['100%', 'Max Waiver Available'], ['Rolling', 'Some Applications']].map(([v, l]) => (
            <div key={l} className="text-center rounded-xl py-5 px-3 border border-slate-200">
              <p className="text-2xl font-black text-[#0b3d1f]">{v}</p>
              <p className="text-xs text-slate-500 mt-1">{l}</p>
            </div>
          ))}
        </div>

        {/* Scholarships list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {SCHOLARSHIPS.map(s => {
            const style = TYPE_STYLE[s.type] ?? TYPE_STYLE.merit;
            return (
              <div key={s.name} className="border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-slate-900 leading-snug text-sm">{s.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${style.cls}`}>
                    {style.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{s.desc}</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex gap-2"><span className="font-semibold text-slate-600 w-20 shrink-0">Provider:</span><span className="text-slate-500">{s.provider}</span></div>
                  <div className="flex gap-2"><span className="font-semibold text-slate-600 w-20 shrink-0">Amount:</span><span className="text-green-700 font-bold">{s.amount}</span></div>
                  <div className="flex gap-2"><span className="font-semibold text-slate-600 w-20 shrink-0">Eligible:</span><span className="text-slate-500">{s.eligibility}</span></div>
                  <div className="flex gap-2"><span className="font-semibold text-slate-600 w-20 shrink-0">Deadline:</span><span className="text-slate-500">{s.deadline}</span></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Apply CTA */}
        <div className="text-center bg-[#0b3d1f] text-white rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">How to Apply</h2>
          <p className="text-green-100/80 text-sm mb-5 max-w-xl mx-auto">Download the scholarship application form, fill it out, and submit it to the department office with required documents.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/forms" className="px-5 py-2.5 text-sm font-bold bg-white hover:bg-green-50 rounded-xl transition"
              style={{ color: '#0b3d1f' }}>Download Application Form</Link>
            <Link href="/contact" className="px-5 py-2.5 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 rounded-xl transition">Contact Office</Link>
          </div>
        </div>
      </div></div>
    </>
  );
}

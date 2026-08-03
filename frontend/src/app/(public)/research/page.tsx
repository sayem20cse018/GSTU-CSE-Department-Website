import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHero from '@/components/academics/SectionHero';
import { RESEARCH_AREAS } from '@/constants';

export const metadata: Metadata = { title: 'Research — GSTU CSE' };

const PROJECTS = [
  { title:'Bangla Handwritten OCR using Deep CNN', area:'Machine Learning & AI', status:'active', pi:'Dr. Mohammad Rahman', year:2023, desc:'High-accuracy recognition system for Bangla handwritten text using convolutional neural networks and transfer learning.' },
  { title:'IoT-Based Smart Agriculture System',    area:'IoT & Embedded Systems', status:'active', pi:'Mr. Arif Ahmed', year:2024, desc:'Low-cost IoT platform for real-time crop monitoring using edge computing and wireless sensor networks.' },
  { title:'Network Intrusion Detection with ML',   area:'Cybersecurity', status:'completed', pi:'Dr. Fatima Khatun', year:2023, desc:'ML-based intrusion detection system achieving 98.7% accuracy on benchmark datasets.' },
  { title:'Sentiment Analysis of Bangla Social Media', area:'Natural Language Processing', status:'active', pi:'Dr. Karim Hossain', year:2024, desc:'Deep learning approaches for opinion mining and sentiment classification of Bangla text.' },
];

export default function ResearchPage() {
  return (
    <>
      <SectionHero tag="Research & Innovation" title="Research at GSTU CSE"
        description="Cutting-edge research spanning AI, cybersecurity, IoT, NLP and more."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Research'}]}/>

      <div className="bg-white section-py">
        <div className="container-custom">

          {/* Research areas */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Research Areas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {RESEARCH_AREAS.map(a => (
                <div key={a.name} className="bg-[#0b3d1f] text-white rounded-xl p-5 text-center hover:bg-[#0f5530] transition">
                  <span className="text-3xl block mb-2" aria-hidden="true">{a.icon}</span>
                  <p className="text-xs font-semibold text-green-100 leading-snug">{a.name}</p>
                  <p className="text-[10px] mt-1" style={{color:'rgba(134,239,172,0.7)'}}>{a.count} projects</p>
                </div>
              ))}
            </div>
          </section>

          {/* Featured projects */}
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Featured Projects</h2>
              <Link href="/research/publications" className="text-sm font-semibold text-green-700 hover:text-green-900">
                View Publications →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROJECTS.map(p => (
                <article key={p.title} className="border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-100 text-green-700">{p.area}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.status==='active'?'bg-emerald-100 text-emerald-700':'bg-slate-100 text-slate-600'}`}>
                      {p.status==='active'?'● Active':'✓ Done'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 leading-snug">{p.title}</h3>
                  <p className="text-sm text-slate-500 mb-3">{p.desc}</p>
                  <div className="flex justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                    <span>PI: {p.pi}</span><span>{p.year}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-[#0b3d1f] text-white rounded-2xl p-10">
            <h2 className="text-2xl font-bold mb-3">Interested in Research Collaboration?</h2>
            <p className="text-green-100 mb-6 max-w-xl mx-auto">We welcome collaborations with industry partners, other universities, and funding agencies.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white font-bold px-6 py-3 rounded-xl transition hover:bg-green-50"
              style={{color:'#0b3d1f'}}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

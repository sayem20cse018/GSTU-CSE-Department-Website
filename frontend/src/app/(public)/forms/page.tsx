import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Forms & Downloads — GSTU CSE' };

const FORMS = [
  { cat:'General Forms', items:[
    { name:'Course Registration Form',   type:'pdf', desc:'For enrolling in courses each semester' },
    { name:'Leave Application Form',     type:'pdf', desc:'Student leave application' },
    { name:'ID Card Replacement Form',   type:'pdf', desc:'For lost or damaged ID card' },
    { name:'Transcript Request Form',    type:'pdf', desc:'Official transcript application' },
    { name:'Change of Program Form',     type:'pdf', desc:'Request to change degree program' },
  ]},
  { cat:'Evaluation Forms', items:[
    { name:'Course Evaluation Form',      type:'pdf', desc:'Student evaluation of course and instructor' },
    { name:'Research Supervisor Form',    type:'pdf', desc:'Supervisor evaluation for thesis/project' },
    { name:'Internship Evaluation Form',  type:'pdf', desc:'Industry supervisor evaluation form' },
  ]},
  { cat:'Thesis & Project', items:[
    { name:'Thesis Proposal Template',   type:'docx', desc:'Standard template for thesis proposal' },
    { name:'Project Report Template',    type:'docx', desc:'Template for final project report' },
    { name:'Thesis Submission Checklist',type:'pdf',  desc:'Items to verify before submission' },
  ]},
];

export default function FormsPage() {
  return (
    <>
      <SectionHero tag="Resources" title="Forms & Downloads"
        description="Download official forms, templates and documents."
        breadcrumbs={[{label:'Home',href:'/'},{label:'Forms'}]}/>
      <div className="bg-white section-py"><div className="container-custom max-w-4xl">
        {FORMS.map(group => (
          <section key={group.cat} className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">{group.cat}</h2>
            <div className="space-y-3">
              {group.items.map(item => (
                <div key={item.name}
                  className="flex items-center justify-between gap-4 border border-slate-200 rounded-xl px-5 py-4 hover:border-green-300 transition">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${item.type==='pdf'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>
                      {item.type}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-green-700 border border-green-300 hover:bg-green-50 px-3 py-1.5 rounded-lg transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
                    </svg>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div></div>
    </>
  );
}

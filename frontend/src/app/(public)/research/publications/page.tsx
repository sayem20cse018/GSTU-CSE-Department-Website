import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Publications — GSTU CSE Research' };

const PUBS = [
  { title:'Deep Learning for Bangla OCR', authors:'Rahman M., Islam A.', venue:'IEEE Access', year:2024, type:'journal', doi:'10.1109/ACCESS.2024.XXXXXX' },
  { title:'Smart IoT Framework for Precision Agriculture', authors:'Ahmed A., Hasan T.', venue:'IoT Journal', year:2023, type:'journal', doi:'' },
  { title:'ML-Based Network Intrusion Detection', authors:'Khatun F., Islam N.', venue:'ICCA 2023', year:2023, type:'conference', doi:'' },
  { title:'Bangla Sentiment Analysis with Transformers', authors:'Hossain K.', venue:'ACL 2024', year:2024, type:'conference', doi:'' },
  { title:'Federated Learning for Privacy-Preserving Healthcare', authors:'Rahman M., Khatun F.', venue:'IEEE TII', year:2024, type:'journal', doi:'' },
];

const TYPE_COLOR: Record<string,string> = { journal:'bg-blue-100 text-blue-700', conference:'bg-violet-100 text-violet-700' };

export default function PublicationsPage() {
  return (
    <>
      <SectionHero tag="Research" title="Publications"
        breadcrumbs={[{label:'Home',href:'/'},{label:'Research',href:'/research'},{label:'Publications'}]}/>
      <div className="bg-white section-py"><div className="container-custom max-w-4xl">
        <div className="space-y-4">
          {PUBS.map((p,i) => (
            <article key={i} className="border border-slate-200 rounded-xl p-5 hover:border-green-300 transition">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${TYPE_COLOR[p.type]}`}>{p.type}</span>
                <span className="text-xs text-slate-400">{p.year}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{p.title}</h3>
              <p className="text-sm text-slate-500">{p.authors} · <em>{p.venue}</em></p>
              {p.doi && <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-green-700 hover:underline mt-1 inline-block">DOI: {p.doi}</a>}
            </article>
          ))}
        </div>
      </div></div>
    </>
  );
}

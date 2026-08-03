import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';

export const metadata: Metadata = { title: 'Vision & Mission — GSTU CSE' };

export default function VisionPage() {
  return (
    <>
      <SectionHero tag="About" title="Vision & Mission"
        breadcrumbs={[{label:'Home',href:'/'},{label:'About',href:'/about'},{label:'Vision & Mission'}]}/>
      <div className="bg-white section-py"><div className="container-custom max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title:'Our Vision', icon:'🎯', color:'border-t-green-600',
              body:'To be a leading center of excellence in Computer Science and Engineering education and research in Bangladesh, recognized for producing graduates who make significant contributions to technology, society, and the global knowledge economy. We aspire to foster an inclusive, innovative, and intellectually vibrant environment where students, faculty, and researchers collaborate to solve real-world problems and advance the frontiers of computing.' },
            { title:'Our Mission', icon:'🚀', color:'border-t-blue-600',
              body:'To provide rigorous, high-quality education in computer science and engineering that prepares students for lifelong learning and professional success. We are committed to delivering a curriculum that balances theory with practice, conducting impactful research that contributes to national development, fostering ethical and collaborative thinking, and creating an inclusive environment that welcomes students from all backgrounds.' },
          ].map(item => (
            <div key={item.title} className={`bg-white border-2 border-slate-200 ${item.color} border-t-4 rounded-2xl p-8 shadow-sm`}>
              <span className="text-4xl block mb-4" aria-hidden="true">{item.icon}</span>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h2>
              <p className="text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[['Excellence','Striving for the highest standards in teaching, research, and service.','⭐'],
              ['Integrity','Upholding honesty, transparency, and ethical conduct in all activities.','🛡️'],
              ['Innovation','Encouraging creative thinking and new approaches to problem-solving.','💡'],
              ['Collaboration','Fostering teamwork among students, faculty, and industry partners.','🤝'],
              ['Inclusivity','Welcoming and supporting students from diverse backgrounds.','🌍'],
              ['Impact','Creating knowledge that matters to society and the economy.','🎓'],
            ].map(([title, desc, icon]) => (
              <div key={title} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-green-300 transition">
                <span className="text-2xl block mb-2" aria-hidden="true">{icon}</span>
                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div></div>
    </>
  );
}

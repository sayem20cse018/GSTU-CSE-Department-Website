import type { Metadata } from 'next';
import SectionHero from '@/components/academics/SectionHero';
import { SITE } from '@/constants';

export const metadata: Metadata = { title: "Chairman's Message — GSTU CSE" };

export default function ChairmanPage() {
  return (
    <>
      <SectionHero tag="About" title="Chairman's Message"
        breadcrumbs={[{label:'Home',href:'/'},{label:'About',href:'/about'},{label:"Chairman's Message"}]}/>
      <div className="bg-white section-py"><div className="container-custom max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Photo */}
          <div className="text-center">
            <div className="w-40 h-40 rounded-2xl mx-auto bg-gradient-to-br from-green-700 to-green-900
                            flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-4">
              C
            </div>
            <h3 className="font-bold text-slate-900">Prof. Dr. [Name]</h3>
            <p className="text-sm text-green-700 font-medium">Chairman</p>
            <p className="text-xs text-slate-500 mt-1">Dept. of CSE, {SITE.universityShort}</p>
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">A Message from the Chairman</h2>
            <div className="prose prose-slate max-w-none space-y-4 text-slate-600">
              <p className="text-lg italic border-l-4 border-green-500 pl-4 py-1">
                "Excellence in education is not merely about imparting knowledge — it is about inspiring minds to question, create, and lead."
              </p>
              <p>Welcome to the Department of Computer Science and Engineering at {SITE.university}. It is my privilege and honour to lead this dynamic and talented academic community.</p>
              <p>Our department has been committed since its establishment in {SITE.founded} to providing high-quality education that bridges theoretical knowledge and practical application. We take immense pride in our faculty, who are not only accomplished educators but also active researchers contributing to the global body of knowledge.</p>
              <p>The world of technology is evolving at an unprecedented pace, and we are committed to ensuring our curriculum, laboratories, and research programs remain at the cutting edge. Our students are our greatest achievement — their successes in industry and academia are a testament to the quality of education we provide.</p>
              <p>I invite prospective students, collaborators, and well-wishers to be part of our journey. Together, we will continue to advance computing education and research for the benefit of Bangladesh and the world.</p>
              <p className="font-semibold text-slate-900">Prof. Dr. [Name]<br/>
                <span className="font-normal text-slate-600 text-sm">Chairman, Department of CSE<br/>{SITE.university}</span>
              </p>
            </div>
          </div>
        </div>
      </div></div>
    </>
  );
}

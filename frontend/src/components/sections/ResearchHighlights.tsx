import Link from "next/link";
import { RESEARCH_AREAS } from "@/constants";

const FEATURED_PROJECTS = [
  {
    id: "1",
    title: "Bangla Handwritten Character Recognition using Deep CNN",
    area: "Machine Learning & AI",
    status: "active",
    pi: "Dr. Mohammad Rahman",
    funding: "ICT Division, Bangladesh",
    year: 2023,
    description:
      "Developing a high-accuracy recognition system for Bangla handwritten characters using convolutional neural networks and transfer learning.",
  },
  {
    id: "2",
    title: "IoT-Based Smart Agriculture Monitoring System",
    area: "IoT & Embedded Systems",
    status: "active",
    pi: "Mr. Arif Ahmed",
    funding: "GSTU Research Grant",
    year: 2024,
    description:
      "A low-cost IoT platform for real-time monitoring of soil moisture, temperature and crop health using edge computing.",
  },
  {
    id: "3",
    title: "Network Intrusion Detection using Machine Learning",
    area: "Cybersecurity",
    status: "completed",
    pi: "Dr. Fatima Khatun",
    funding: "Self-funded",
    year: 2023,
    description:
      "An ML-based intrusion detection system achieving 98.7% accuracy on the KDD Cup dataset with real-time processing capabilities.",
  },
];


export default function ResearchHighlights() {
  return (
    <section className="section-py bg-white">

      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-14">

          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
            Innovation & Research
          </p>

          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Research & Innovation
          </h2>

          <p className="max-w-3xl mx-auto text-slate-600">
            Our faculty members and students are working on advanced research
            areas in computer science and engineering.
          </p>

        </div>


        {/* Research Areas */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-16">

          {RESEARCH_AREAS.map((area)=>(
            <div
              key={area.name}
              className="
              bg-white
              rounded-2xl
              border border-slate-200
              p-5
              text-center
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-1
              transition-all
              "
            >

              <div className="text-4xl mb-3">
                {area.icon}
              </div>


              <h3 className="text-sm font-semibold text-slate-800">
                {area.name}
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                {area.count} Projects
              </p>


            </div>
          ))}

        </div>



        {/* Project Cards */}

        <h3 className="text-2xl font-bold text-slate-900 mb-8">
          Featured Research Projects
        </h3>


        <div className="grid md:grid-cols-3 gap-7">


        {
          FEATURED_PROJECTS.map((project)=>(

          <article
          key={project.id}
          className="
          bg-white
          rounded-3xl
          border border-slate-200
          p-6
          shadow-sm
          hover:shadow-xl
          hover:border-blue-200
          transition-all
          flex flex-col
          "
          >


            {/* Top */}

            <div className="flex justify-between items-center mb-5">


              <span
              className="
              text-xs
              font-semibold
              text-blue-700
              bg-blue-50
              px-3
              py-1.5
              rounded-full
              "
              >
                {project.area}
              </span>


              <span
              className={`
              text-xs
              font-semibold
              px-3
              py-1.5
              rounded-full

              ${
                project.status==="active"
                ?
                "bg-green-50 text-green-700"
                :
                "bg-slate-100 text-slate-600"
              }

              `}
              >

                {
                  project.status==="active"
                  ?
                  "● Active"
                  :
                  "✓ Completed"
                }

              </span>


            </div>



            {/* Title */}

            <h4
            className="
            text-lg
            font-bold
            text-slate-900
            leading-snug
            mb-4
            "
            >

              {project.title}

            </h4>



            <p
            className="
            text-sm
            text-slate-600
            leading-relaxed
            mb-6
            "
            >

              {project.description}

            </p>




            {/* Details */}


            <div
            className="
            border-t
            border-slate-200
            pt-5
            space-y-3
            text-sm
            mt-auto
            "
            >


              <div className="flex justify-between">
                <span className="text-slate-500">
                  Principal Investigator
                </span>

                <span className="font-semibold text-slate-800">
                  {project.pi}
                </span>
              </div>



              <div className="flex justify-between">

                <span className="text-slate-500">
                  Funding
                </span>

                <span className="font-semibold text-slate-800">
                  {project.funding}
                </span>

              </div>




              <div className="flex justify-between">

                <span className="text-slate-500">
                  Year
                </span>

                <span className="font-semibold text-slate-800">
                  {project.year}
                </span>

              </div>



            </div>


          </article>

          ))
        }


        </div>




        {/* Button */}

        <div className="text-center mt-12">


          <Link
          href="/research"
          className="
          inline-flex
          items-center
          gap-2
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-semibold
          px-7
          py-3
          rounded-xl
          shadow-md
          transition
          "
          >

            View All Research


            <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            >

              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
              />

            </svg>


          </Link>


        </div>



      </div>


    </section>
  );
}
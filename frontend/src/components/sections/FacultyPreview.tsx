import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface FacultyMember {
  _id: string;
  name: string;
  designation: string;
  title?: string;
  photo?: string;
  email: string;
  slug?: string;
}

async function fetchFaculty(): Promise<FacultyMember[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

    const res = await fetch(`${apiUrl}/faculty`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return MOCK_FACULTY;

    const json = (await res.json()) as { data: FacultyMember[] };

    return json.data?.length ? json.data.slice(0, 6) : MOCK_FACULTY;
  } catch {
    return MOCK_FACULTY;
  }
}

const MOCK_FACULTY: FacultyMember[] = [
  {
    _id: "1",
    name: "Dr. Mohammad Rahman",
    designation: "Professor",
    title: "Dr.",
    email: "mrahman@gstu.edu.bd",
    slug: "dr-mohammad-rahman",
  },
  {
    _id: "2",
    name: "Dr. Fatima Khatun",
    designation: "Associate Professor",
    title: "Dr.",
    email: "fkhatun@gstu.edu.bd",
    slug: "dr-fatima-khatun",
  },
  {
    _id: "3",
    name: "Dr. Karim Hossain",
    designation: "Associate Professor",
    title: "Dr.",
    email: "khossain@gstu.edu.bd",
    slug: "dr-karim-hossain",
  },
  {
    _id: "4",
    name: "Mr. Arif Ahmed",
    designation: "Assistant Professor",
    email: "aahmed@gstu.edu.bd",
    slug: "mr-arif-ahmed",
  },
  {
    _id: "5",
    name: "Ms. Nadia Islam",
    designation: "Assistant Professor",
    email: "nislam@gstu.edu.bd",
    slug: "ms-nadia-islam",
  },
  {
    _id: "6",
    name: "Mr. Tanvir Hasan",
    designation: "Lecturer",
    email: "thasan@gstu.edu.bd",
    slug: "mr-tanvir-hasan",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-teal-600",
];

const DESIGNATION_BADGE: Record<string, string> = {
  Professor: "bg-blue-50 text-blue-700",
  "Associate Professor": "bg-purple-50 text-purple-700",
  "Assistant Professor": "bg-emerald-50 text-emerald-700",
  Lecturer: "bg-orange-50 text-orange-700",
};

export default async function FacultyPreview() {
  const faculty = await fetchFaculty();

  return (
    <section className="section-py bg-slate-50">
      <div className="container-custom">
        {/* Header */}

        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Our People
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
            Faculty Members
          </h2>

          <p className="mt-4 max-w-xl mx-auto text-slate-500">
            Meet our experienced faculty members dedicated to teaching, research
            and innovation.
          </p>
        </div>

        {/* Faculty Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {faculty.map((member, index) => (
            <article
              key={member._id}
              className="group bg-white rounded-3xl border border-slate-200 p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}

              <div className="flex justify-center">
                <div
                  className={cn(
                    "w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-slate-100",
                    member.photo
                      ? ""
                      : AVATAR_COLORS[index % AVATAR_COLORS.length],
                  )}
                >
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(member.name)
                  )}
                </div>
              </div>

              {/* Name */}

              <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-blue-700 transition">
                <Link href={`/faculty/${member.slug ?? member._id}`}>
                  {member.title} {member.name}
                </Link>
              </h3>

              {/* Designation */}

              <span
                className={cn(
                  "inline-block mt-3 px-4 py-1 rounded-full text-xs font-semibold",
                  DESIGNATION_BADGE[member.designation] ??
                    "bg-slate-100 text-slate-600",
                )}
              >
                {member.designation}
              </span>

              {/* Email */}

              <a
                href={`mailto:${member.email}`}
                className="mt-5 flex justify-center items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition"
              >
                ✉{member.email}
              </a>

              {/* Profile Button */}

              <Link
                href={`/faculty/${member.slug ?? member._id}`}
                className="mt-6 inline-flex w-full justify-center items-center py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
              >
                View Profile →
              </Link>
            </article>
          ))}
        </div>

        {/* All Faculty */}

        <div className="text-center mt-12">
          <Link
            href="/faculty"
            className="inline-flex px-8 py-3 rounded-xl border border-blue-700 text-blue-700 font-semibold hover:bg-blue-700 hover:text-white transition"
          >
            View All Faculty
          </Link>
        </div>
      </div>
    </section>
  );
}

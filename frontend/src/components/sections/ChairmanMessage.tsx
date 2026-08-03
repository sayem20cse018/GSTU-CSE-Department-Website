"use client";

import { useState } from "react";

export default function ChairmanMessage() {
  const [photoError, setPhotoError] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <section
      className="section-py"
      aria-labelledby="chairman-heading"
      style={{ background: "#f8faf8" }}
    >
      <div className="container-custom">
        {/* Heading */}
        <div className="text-center mb-6">
          <p
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: "#166534" }}
          >
            From the Chairman&apos;s Desk
          </p>

          <h2
            id="chairman-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Chairman&apos;s Message
          </h2>

          <div
            className="mt-2 mx-auto w-10 h-1 rounded-full"
            style={{ background: "linear-gradient(90deg,#166534,#4ade80)" }}
          />
        </div>

        {/* Card */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Profile */}
            <div
              className="flex flex-col items-center text-center px-5 py-6"
              style={{
                background: "linear-gradient(160deg,#0b3d1f,#134e2a,#052e16)",
              }}
            >
              {/* Image */}
              <div
                className="w-44 h-44 rounded-lg overflow-hidden border-4 mb-4 shadow-lg flex items-center justify-center"
                style={{ borderColor: "#fbbf24" }}
              >
                {photoError ? (
                  <span className="text-5xl font-bold text-yellow-400">M</span>
                ) : (
                  <img
                    src="public/images/SIR.jpg"
                    alt="Dr. Mrinal Kanti Baowaly"
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    onError={() => {
                      console.log("Image failed to load");
                      setPhotoError(true);
                    }}
                  />
                )}
              </div>

              <h3 className="text-lg font-bold text-white">
                Dr. Mrinal Kanti Baowaly
              </h3>

              <p
                className="text-sm font-semibold mt-1"
                style={{ color: "#fbbf24" }}
              >
                Professor & Chairman
              </p>

              <div
                className="w-12 h-[1px] my-3"
                style={{ background: "rgba(251,191,36,.5)" }}
              />

              <p className="text-xs" style={{ color: "#bbf7d0" }}>
                Department of Computer Science and Engineering
              </p>

              <p className="text-xs mt-1" style={{ color: "#bbf7d0" }}>
                Gopalganj Science and Technology University
              </p>

              <p className="text-xs" style={{ color: "#bbf7d0" }}>
                Bangladesh
              </p>
            </div>

            {/* Message */}
            <div className="lg:col-span-2 p-6 md:p-8">
              <div className="text-4xl font-black" style={{ color: "#dcfce7" }}>
                &ldquo;
              </div>

              <div className="text-sm text-slate-600 leading-relaxed">
                <p>
                  Welcome to the Department of Computer Science and Engineering
                  at Gopalganj Science and Technology University. It is my
                  pleasure to serve as the Chairman of this growing department.
                  We have dedicated faculty members, research activities, and
                  modern laboratories that support innovation and academic
                  excellence.
                </p>

                {showMore && (
                  <div className="space-y-3 mt-3">
                    <p>
                      Our department is committed to providing quality education
                      in computer science and engineering and preparing students
                      for modern technology challenges.
                    </p>

                    <p>
                      I welcome students, researchers and industry partners to
                      join our community and contribute to the future of
                      computing.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-5 pt-4 border-t">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Dr. Mrinal Kanti Baowaly
                  </p>

                  <p
                    className="text-xs font-semibold"
                    style={{ color: "#166534" }}
                  >
                    Chairman, Dept. of CSE
                  </p>
                </div>

                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-xs font-bold px-5 py-2 rounded-lg text-white transition-all hover:scale-105"
                  style={{ background: "#166534" }}
                >
                  {showMore ? "Show Less" : "See More"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

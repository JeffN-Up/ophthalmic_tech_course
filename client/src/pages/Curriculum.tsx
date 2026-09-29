import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { curriculumModules, getTotalCourseDuration } from "@/data/curriculum";
import { ArrowLeft, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

export default function Curriculum() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const totalDuration = getTotalCourseDuration();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-4 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <a href="/" className="mb-7 inline-flex items-center text-sm text-blue-200 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Course Home
          </a>
          <div className="flex items-start gap-4">
            <BookOpen className="mt-1 h-10 w-10 text-cyan-400" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Public Preview</p>
              <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Ophthalmic Technician Foundations</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                Ten self-paced modules with instructional lessons, supervised-practice checklists, safety guidance, and end-of-module assessments.
              </p>
              <p className="mt-4 inline-flex items-center text-blue-100">
                <Clock className="mr-2 h-5 w-5" /> Approximately {totalDuration.toFixed(1)} hours
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="space-y-4">
          {curriculumModules.map((module) => {
            const expanded = expandedDay === module.day;
            return (
              <Card key={module.id} className="overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedDay(expanded ? null : module.day)}
                  className="flex w-full items-start gap-4 p-6 text-left hover:bg-blue-50"
                  aria-expanded={expanded}
                >
                  <span className="text-4xl">{module.icon}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="font-bold text-blue-600">Day {module.day}</span>
                      <span className="text-slate-500">{module.duration}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{module.difficulty}</span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">{module.title}</h2>
                    <p className="mt-2 text-slate-600">{module.description}</p>
                  </div>
                  <span className="text-2xl font-light text-blue-600">{expanded ? "−" : "+"}</span>
                </button>

                {expanded && (
                  <div className="border-t border-slate-200 bg-slate-50 p-6">
                    <div className="grid gap-7 md:grid-cols-2">
                      <div>
                        <h3 className="font-bold text-slate-900">Learning Objectives</h3>
                        <ul className="mt-4 space-y-3">
                          {module.objectives.map((objective) => (
                            <li key={objective} className="flex items-start gap-3 text-slate-700">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" /> {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Key Topics</h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {module.topics.map((topic) => (
                            <span key={topic} className="rounded-full border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700">{topic}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="mt-10 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Ready to begin?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Individual enrollment is $699. Practices can enroll five learners for $1,200. Both options include all lessons, quizzes, saved progress, and course completion certificates.
          </p>
          <a href="/#pricing">
            <Button className="mt-6 bg-blue-600 px-8 py-6 text-white hover:bg-blue-700">View Pricing and Enroll</Button>
          </a>
        </Card>
      </main>
    </div>
  );
}


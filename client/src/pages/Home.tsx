import { EnrollmentForm } from "@/components/EnrollmentForm";
import { SpindelLogo } from "@/components/SpindelLogo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { curriculumModules, getTotalCourseDuration } from "@/data/curriculum";
import { ArrowRight, Award, CheckCircle2, Clock, Eye, LogIn, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrollmentType, setEnrollmentType] = useState<"individual" | "practice">("individual");
  const totalDuration = getTotalCourseDuration();
  const openEnrollment = (type: "individual" | "practice") => {
    setEnrollmentType(type);
    setShowEnrollmentForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 font-bold">
            <Eye className="h-6 w-6 text-cyan-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">OptiTech Academy</span>
          </a>
          <div className="hidden items-center gap-7 md:flex">
            <a href="#curriculum" className="text-sm text-slate-100 hover:text-cyan-200">Curriculum</a>
            <a href="#pricing" className="text-sm text-slate-100 hover:text-cyan-200">Pricing</a>
            <a href="#standards" className="text-sm text-slate-100 hover:text-cyan-200">Course Standards</a>
          </div>
          <div className="flex items-center gap-2">
            <a href="/login">
              <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </a>
            <Button onClick={() => openEnrollment("individual")} className="hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 sm:inline-flex">
              Enroll
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden px-4 py-24 sm:py-32">
          <div className="absolute inset-0 -z-0">
            <div className="absolute left-10 top-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                Ten-module self-paced ophthalmic technician foundation course
              </p>
              <h1 className="text-5xl font-bold leading-tight sm:text-7xl">
                Build the skills behind a dependable ophthalmic examination.
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-100">
                Learn core anatomy, history taking, lensometry, tonometry, slit lamp workflow, imaging, visual fields, documentation, communication, and professional development.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => openEnrollment("individual")} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600">
                  Enroll for $699 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <a href="/curriculum"><Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">Preview Curriculum</Button></a>
              </div>
              <p className="mt-4 text-sm text-slate-200">One-time price per student seat. Secure checkout is processed by Stripe.</p>
            </div>

            <Card className="premium-glass premium-card border-white/10 p-8 text-white">
              <Eye className="mb-5 h-14 w-14 text-cyan-400" />
              <h2 className="text-2xl font-bold">What is included</h2>
              <ul className="mt-5 space-y-4 text-white">
                {[
                  "Ten structured instructional modules",
                  "Clinical workflow and safety guidance",
                  "Practice checklists for supervised training",
                  "End-of-module quizzes with explanations",
                  "Saved progress and student dashboard",
                  "Printable certificate of course completion",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/5 px-4 py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 text-center md:grid-cols-4">
            {[
              ["10", "Modules"],
              [`${totalDuration.toFixed(1)}`, "Estimated Hours"],
              ["70%", "Quiz Passing Score"],
              ["1", "Completion Certificate"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-4xl font-bold text-cyan-100">{value}</p>
                <p className="mt-1 text-sm text-slate-100">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="curriculum" className="px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-100">Curriculum</p>
              <h2 className="mt-2 text-4xl font-bold">A practical ten-day learning path</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {curriculumModules.map((module) => (
                <Card key={module.id} className="premium-glass premium-card border-white/10 p-5 text-white">
                  <div className="text-3xl">{module.icon}</div>
                  <p className="mt-4 text-sm font-bold text-cyan-100">Day {module.day}</p>
                  <h3 className="mt-1 font-bold">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-100">{module.description}</p>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center"><a href="/curriculum"><Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">View Detailed Curriculum</Button></a></div>
          </div>
        </section>

        <section id="pricing" className="bg-slate-950/40 px-4 py-20">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-100">Pricing</p>
            <h2 className="mt-2 text-4xl font-bold">Choose the path that fits.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-100">Learn independently, enroll a five-person practice team, or enter the private employee-onboarding portal.</p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <Card className="premium-card flex flex-col border-2 border-cyan-400/40 bg-white p-8 text-left text-slate-900 shadow-2xl">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">For individuals</p>
                <h3 className="mt-3 text-2xl font-bold">Ophthalmic Technician Foundations</h3>
                <p className="mt-2 text-slate-600">Complete course access for one learner building a strong clinical foundation.</p>
              </div>
              <div className="mt-7">
                <span className="text-5xl font-bold text-blue-700">$699</span>
                <p className="text-sm text-slate-500">one-time · one seat</p>
              </div>
              <div className="mt-7 space-y-3">
                {["All ten modules", "Knowledge checks and explanations", "Saved progress", "Completion certificate"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-green-600" /> {item}</div>
                ))}
              </div>
              <Button onClick={() => openEnrollment("individual")} className="mt-8 w-full bg-blue-600 py-6 text-white hover:bg-blue-700">Enroll as an Individual</Button>
            </Card>

            <Card className="premium-card relative flex flex-col border-2 border-amber-400 bg-white p-8 text-left text-slate-900 shadow-2xl">
              <span className="absolute right-5 top-5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Save $2,295</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">For practices</p>
                <h3 className="mt-3 text-2xl font-bold">Practice Starter Package</h3>
                <p className="mt-2 text-slate-600">Train a small team together with manager visibility and private seat invitations.</p>
              </div>
              <div className="mt-7">
                <span className="text-5xl font-bold text-blue-700">$1,200</span>
                <p className="text-sm text-slate-500">one-time · five seats ($240 each)</p>
              </div>
              <div className="mt-7 space-y-3">
                {["Five complete course seats", "Manager progress dashboard", "Private employee invitations", "Five completion certificates"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-700"><CheckCircle2 className="h-4 w-4 text-green-600" /> {item}</div>
                ))}
              </div>
              <Button onClick={() => openEnrollment("practice")} className="mt-8 w-full bg-amber-500 py-6 text-slate-950 hover:bg-amber-400">Enroll a Practice Team</Button>
            </Card>

            <Card className="premium-card flex flex-col border border-white/10 bg-gradient-to-br from-blue-950 to-cyan-900 p-8 text-left text-white shadow-2xl">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">For onboarding employees</p>
                <SpindelLogo variant="stacked" className="mt-5 h-28 w-28 shadow-xl" />
                <h3 className="mt-3 text-2xl font-bold">Spindel Employee Onboarding</h3>
                <p className="mt-2 text-blue-100">Private staff education covering culture, privacy, workflows, safety, and readiness.</p>
              </div>
              <div className="mt-7">
                <span className="text-3xl font-bold text-white">Manager-issued access</span>
                <p className="mt-2 text-sm text-blue-100">No public purchase required</p>
              </div>
              <div className="mt-7 space-y-3">
                {["Ten Spindel onboarding modules", "80% knowledge-check standard", "Employee progress tracking", "Supervisor validation reminders"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-white"><CheckCircle2 className="h-4 w-4 text-cyan-100" /> {item}</div>
                ))}
              </div>
              <a href="/spindel" className="mt-8 block">
                <Button className="w-full bg-white py-6 text-blue-950 hover:bg-cyan-50">Open Employee Onboarding</Button>
              </a>
            </Card>
            </div>
          </div>
        </section>

        <section id="standards" className="px-4 py-20">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Clear Scope", text: "Lessons reinforce supervision, clinic protocols, infection control, and appropriate escalation." },
              { icon: Users, title: "Team Enrollment", text: "Practice managers receive private seat invitation links and can view team completion progress." },
              { icon: Award, title: "Accurate Certificate", text: "The certificate confirms course completion and does not claim licensure or professional certification." },
            ].map((item) => (
              <Card key={item.title} className="premium-glass premium-card border-white/10 p-7 text-white">
                <item.icon className="h-10 w-10 text-cyan-400" />
                <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 leading-7 text-slate-100">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-slate-200">
        OptiTech Academy is an independent educational course. It does not award licensure or JCAHPO certification.
      </footer>

      {showEnrollmentForm && <EnrollmentForm tier={enrollmentType} defaultType={enrollmentType} onClose={() => setShowEnrollmentForm(false)} />}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  spindelOnboardingCourseTitle,
  spindelOnboardingLanes,
} from "@shared/course/spindelOnboardingSourceMap";
import { skillsPassport } from "@shared/skills/skillsPassport";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Building2,
  ClipboardCheck,
  Compass,
  Layers3,
  Printer,
  ShieldAlert,
} from "lucide-react";

export default function SkillsPassport() {
  const isLocalDemoPreview =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white print:border-b-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <a
              href="/learn"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 print:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to learner dashboard
            </a>
            <p className="mt-5 text-sm font-semibold text-blue-700">
              OptiTech Academy
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              {skillsPassport.title}
            </h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              {skillsPassport.purpose}
            </p>
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-2 md:w-auto md:min-w-[360px] print:hidden">
            <a href="/learn" className="sm:col-span-2">
              <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">
                <BookOpen className="mr-2 h-4 w-4" />
                Start Module 1
              </Button>
            </a>
            <a href="/onboarding">
              <Button variant="outline" className="w-full">
                <Compass className="mr-2 h-4 w-4" />
                Find my path
              </Button>
            </a>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            {isLocalDemoPreview && (
              <a
                href="/api/dev/demo-learner/start?email=jeff.demo%40example.com"
                className="sm:col-span-2"
              >
                <Button
                  variant="secondary"
                  className="w-full border border-green-200 bg-green-50 text-green-900 hover:bg-green-100"
                >
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Start as demo learner
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 print:px-0">
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] print:hidden">
          <Card className="border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Start here
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Open the lesson before using the checklist
                </h2>
                <p className="mt-2 max-w-2xl leading-7 text-blue-900">
                  Module 1 is where the online course begins. The Skills
                  Passport is the supervised practice record that follows the
                  lessons.
                </p>
              </div>
              <a href="/learn" className="w-full md:w-auto">
                <Button className="w-full bg-blue-700 text-white hover:bg-blue-800 md:w-auto">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Module 1
                </Button>
              </a>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-5 text-slate-950 shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold">
              <Layers3 className="h-5 w-5 text-blue-700" />
              Learning layers
            </h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-950">
                  1. Online Module 1
                </p>
                <p>Read the lesson and complete course progress.</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-950">
                  2. Skills Passport
                </p>
                <p>Practice skills with supervisor observation.</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-950">
                  3. Spindel onboarding
                </p>
                <p>Add SEA-only workflows after internal review.</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="break-inside-avoid rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <Building2 className="h-4 w-4" />
                Spindel Eye onboarding layer
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {spindelOnboardingCourseTitle}
              </h2>
              <p className="mt-2 max-w-3xl leading-7 text-slate-600">
                SEA-specific protocols sit on top of the public OptiTech
                foundations. Keep doctor preferences, clinic workflows, and
                internal signoffs private to Spindel onboarding.
              </p>
            </div>
            <a href="/onboarding" className="w-full md:w-auto print:hidden">
              <Button variant="outline" className="w-full md:w-auto">
                <Compass className="mr-2 h-4 w-4" />
                Onboarding assessment
              </Button>
            </a>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {spindelOnboardingLanes.map(lane => (
              <Card
                key={lane.id}
                className="border-emerald-100 bg-emerald-50/50 p-4 shadow-none"
              >
                <h3 className="font-semibold text-slate-950">{lane.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {lane.description}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Private storage
                </p>
                <p className="mt-1 break-words rounded-md bg-white p-2 text-xs text-slate-700">
                  {lane.storageRoot}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm">
          <div className="flex gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 flex-shrink-0 text-amber-700" />
            <p className="leading-7">{skillsPassport.disclaimer}</p>
          </div>
        </Card>

        <section className="grid gap-3 md:grid-cols-5 print:grid-cols-5">
          {skillsPassport.statuses.map(status => (
            <Card
              key={status.id}
              className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm"
            >
              <h2 className="font-semibold">{status.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {status.description}
              </p>
            </Card>
          ))}
        </section>

        <section className="space-y-5">
          {skillsPassport.skills.map(skill => (
            <Card
              key={skill.id}
              className="break-inside-avoid border-slate-200 bg-white p-6 text-slate-950 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700">
                    Module {skill.moduleNumber}: {skill.moduleTitle}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">{skill.name}</h2>
                </div>
                <div className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                  Status: __________________
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-3">
                <section>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <ClipboardCheck className="h-4 w-4 text-blue-700" />
                    Learner preparation
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {skill.learnerPreparation.map(item => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <BadgeCheck className="h-4 w-4 text-green-700" />
                    Observable criteria
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {skill.observableCriteria.map(item => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <ShieldAlert className="h-4 w-4 text-amber-700" />
                    Safety-critical errors
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {skill.safetyCriticalErrors.map(item => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-700">
                  {skill.supervisorPrompt}
                </p>
                <div className="mt-5 grid gap-4 text-sm text-slate-700 md:grid-cols-3">
                  <p>Supervisor: __________________</p>
                  <p>Date: __________________</p>
                  <p>Notes: __________________</p>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}

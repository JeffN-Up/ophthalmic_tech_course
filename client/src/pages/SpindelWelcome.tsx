import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpindelLogo } from "@/components/SpindelLogo";
import { spindelOnboardingModules } from "@/data/spindelOnboarding";
import { ArrowRight, CheckCircle2, LockKeyhole, MapPin, ShieldCheck, Users } from "lucide-react";

const locations = ["Derry", "Windham", "Londonderry", "Raymond", "Bedford"];

export default function SpindelWelcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-950 via-blue-900 to-cyan-900 text-white">
      <header className="border-b border-white/15 bg-slate-950/35 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <a href="/spindel" className="flex items-center gap-3">
            <SpindelLogo className="h-12 w-48 shadow-lg" />
            <span className="hidden text-xs uppercase tracking-[0.22em] text-cyan-200 sm:block">Employee Onboarding</span>
          </a>
          <a href="/spindel/login"><Button className="bg-white text-blue-900 hover:bg-cyan-50">Employee Sign In</Button></a>
        </div>
      </header>

      <main>
        <section className="px-4 py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="inline-flex items-center rounded-full border border-cyan-200/30 bg-cyan-100/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                <ShieldCheck className="mr-2 h-4 w-4" /> Private staff education portal
              </p>
              <h1 className="mt-6 text-5xl font-bold leading-tight sm:text-7xl">A clearer start to your Spindel career.</h1>
              <p className="mt-6 max-w-3xl text-xl leading-8 text-blue-100">
                Ten focused modules. One shared standard. Build the judgment, habits, and team connections that help every patient experience feel safe, respectful, and unmistakably Spindel.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="/spindel/login"><Button size="lg" className="bg-white px-7 text-blue-900 hover:bg-cyan-50">Continue Onboarding <ArrowRight className="ml-2 h-4 w-4" /></Button></a>
                <a href="#modules"><Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">Review Modules</Button></a>
              </div>
            </div>

            <Card className="premium-glass premium-card border-white/15 p-8 text-white">
              <SpindelLogo variant="stacked" className="h-32 w-32 shadow-xl" />
              <h2 className="mt-5 text-3xl font-bold">Everything you need to get oriented</h2>
              <ul className="mt-6 space-y-4 text-blue-50">
                {["Private manager-issued invitation links", "Saved quiz scores and completion progress", "Manager team-progress dashboard", "Spindel-branded onboarding certificate", "Clinical content reinforced by supervised training"].map((item) => (
                  <li key={item} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-200" /> {item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/5 px-4 py-12">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            <div className="premium-glass premium-card rounded-2xl p-6"><Users className="h-9 w-9 text-cyan-200" /><h2 className="mt-4 text-xl font-bold">Patient-First Culture</h2><p className="mt-2 text-blue-100">Respectful communication, reliable handoffs, accountability, and safe escalation.</p></div>
            <div className="premium-glass premium-card rounded-2xl p-6"><LockKeyhole className="h-9 w-9 text-cyan-200" /><h2 className="mt-4 text-xl font-bold">Protected Information</h2><p className="mt-2 text-blue-100">HIPAA, minimum-necessary access, secure systems, and immediate incident reporting.</p></div>
            <div className="premium-glass premium-card rounded-2xl p-6"><MapPin className="h-9 w-9 text-cyan-200" /><h2 className="mt-4 text-xl font-bold">One Multi-Office Team</h2><p className="mt-2 text-blue-100">Shared standards across {locations.join(", ")}.</p></div>
          </div>
        </section>

        <section id="modules" className="bg-slate-50 px-4 py-20 text-slate-900">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Onboarding Path</p>
              <h2 className="mt-3 text-4xl font-bold">Your ten-module learning path</h2>
              <p className="mx-auto mt-4 max-w-3xl text-slate-600">Move at a thoughtful pace, score at least 80% on each knowledge check, and bring questions to your supervisor. Hands-on clinical tasks still require direct training and validation.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {spindelOnboardingModules.map((module) => (
                <Card key={module.id} className="premium-card border-slate-700 bg-slate-950 p-5 text-white shadow-md">
                  <div className="text-4xl">{module.icon}</div>
                  <p className="mt-4 text-sm font-bold text-cyan-200">Module {module.day}</p>
                  <h3 className="mt-1 font-bold">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-100">{module.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-blue-100">
        Spindel Eye Associates Employee Onboarding · Internal education and supervised training support
      </footer>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  LockKeyhole,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { FormEvent, useState } from "react";
import {
  spindelOnboardingCourseTitle,
  spindelOnboardingLanes,
} from "@shared/course/spindelOnboardingSourceMap";

interface SpindelOnboardingSessionResponse {
  employeeName: string;
  email: string;
  accessExpiresAt: string;
  nextUrl: string;
}

async function createSpindelOnboardingSession({
  employeeName,
  email,
  password,
}: {
  employeeName: string;
  email: string;
  password: string;
}) {
  const response = await fetch("/api/spindel-onboarding/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ employeeName, email, password }),
  });
  const payload = (await response.json()) as
    | SpindelOnboardingSessionResponse
    | { error?: string };

  if (!response.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : "Spindel onboarding access could not be created."
    );
  }

  return payload as SpindelOnboardingSessionResponse;
}

export default function SpindelOnboarding() {
  const [password, setPassword] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const session = await createSpindelOnboardingSession({
        employeeName,
        email,
        password,
      });

      setSuccess(
        `${session.employeeName} is ready to begin. Progress will be saved under ${session.email}.`
      );
      window.setTimeout(() => {
        window.location.href = session.nextUrl;
      }, 700);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Spindel onboarding access could not be created."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-300/10 px-4 py-2 text-sm font-semibold text-blue-100">
              <Eye className="h-4 w-4" />
              Spindel Eye Associates
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-normal md:text-5xl">
              {spindelOnboardingCourseTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
              Internal onboarding access for new employees. Create an employee
              course account, unlock the training path, and track lesson
              progress under that employee email.
            </p>
          </div>
          <Card className="border-blue-300/20 bg-white/10 p-5 text-white shadow-xl backdrop-blur">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 text-blue-200" />
              <div>
                <h2 className="font-semibold">Universal onboarding access</h2>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  The shared Spindel password opens the course and creates a
                  tracked learner record for the employee.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-1 h-6 w-6 text-blue-700" />
              <div>
                <h2 className="text-xl font-bold">What this unlocks</h2>
                <p className="mt-2 leading-7 text-slate-600">
                  This gives the employee open course access using the same
                  learner system as the public course. When they complete
                  lessons, progress is saved to their onboarding account.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                "Full course learner access",
                "Progress saved by employee email",
                "Spindel-only onboarding lanes",
              ].map(item => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <FileText className="h-5 w-5 text-blue-700" />
              Spindel onboarding layers
            </h2>
            <div className="mt-5 grid gap-4">
              {spindelOnboardingLanes.map(lane => (
                <section
                  key={lane.id}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-semibold text-slate-950">{lane.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {lane.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lane.assetKinds.map(kind => (
                      <span
                        key={kind}
                        className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600"
                      >
                        {kind.replaceAll("-", " ")}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2 border-t border-slate-200 pt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Source gathering queue
                    </p>
                    {lane.sourceReferences.map(source => (
                      <a
                        key={`${lane.id}-${source.title}`}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-md bg-white p-3 text-sm transition hover:bg-blue-50"
                      >
                        <span className="font-semibold text-blue-700">
                          {source.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {source.notes}
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </Card>
        </div>

        <Card className="h-fit border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
          <div className="flex items-start gap-3">
            <UserPlus className="mt-1 h-6 w-6 text-blue-700" />
            <div>
              <h2 className="text-xl font-bold">Create onboarding account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use the employee email they should use when returning to the
                course.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Universal password
              </span>
              <div className="mt-2 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <LockKeyhole className="h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  autoComplete="current-password"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Employee name
              </span>
              <input
                type="text"
                value={employeeName}
                onChange={event => setEmployeeName(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
                placeholder="New technician name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Employee email
              </span>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2"
                placeholder="employee@spindeleye.com"
              />
            </label>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-800">
                {success}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-700 text-white hover:bg-blue-800"
            >
              {submitting ? "Creating account..." : "Start onboarding"}
            </Button>
          </form>
        </Card>
      </section>
    </main>
  );
}

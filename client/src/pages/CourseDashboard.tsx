import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpindelLogo } from "@/components/SpindelLogo";
import { curriculumModules } from "@/data/curriculum";
import { isSpindelOrganization, spindelOnboardingModules } from "@/data/spindelOnboarding";
import { ApiError, apiRequest, type CourseUser } from "@/lib/api";
import {
  Award,
  CheckCircle2,
  Clipboard,
  Eye,
  Loader2,
  LogOut,
  PlayCircle,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TeamResponse {
  team: CourseUser[];
  invites: Array<{
    code: string;
    createdAt: string;
    usedAt?: string;
    usedBy?: string;
  }>;
  seatLimit: number;
}

export default function CourseDashboard() {
  const [user, setUser] = useState<CourseUser | null>(null);
  const [team, setTeam] = useState<TeamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiRequest<{ user: CourseUser }>("/api/auth/me");
        setUser(response.user);
        if (response.user.role === "manager") {
          setTeam(await apiRequest<TeamResponse>("/api/practice/team"));
        }
      } catch (requestError) {
        if (requestError instanceof ApiError && requestError.status === 401) {
          window.location.assign("/login");
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Unable to load the course.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const logout = async () => {
    await apiRequest("/api/auth/logout", { method: "POST" });
    window.location.assign(isSpindelOrganization(user?.organizationName) ? "/spindel" : "/");
  };

  const copyInvite = async (code: string) => {
    const inviteUrl = `${window.location.origin}/join/${code}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Loading your course...
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen bg-slate-950 p-8 text-center text-red-300">{error || "Course access is unavailable."}</div>;
  }

  const spindel = isSpindelOrganization(user.organizationName);
  const modules = spindel ? spindelOnboardingModules : curriculumModules;
  const percentComplete = Math.round((user.completedModules / modules.length) * 100);
  const brandName = spindel ? "Spindel Eye Associates" : "OptiTech Academy";
  const programName = spindel ? "Employee Onboarding" : "Ophthalmic Technician Foundations";
  const passingScore = spindel ? 80 : 70;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${spindel ? "from-sky-950 via-blue-900 to-cyan-900" : "from-slate-950 via-blue-950 to-slate-900"} text-white`}>
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <a href="/course" className="flex items-center gap-3 font-bold">
            {spindel
              ? <SpindelLogo className="h-11 w-40 shadow" />
              : <span className="text-cyan-400"><Eye className="h-6 w-6" /></span>}
            <span>
              {!spindel && <span className="block">{brandName}</span>}
              {spindel && <span className="block text-[10px] uppercase tracking-[0.2em] text-cyan-200">Employee Onboarding</span>}
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-300 sm:inline">{user.firstName} {user.lastName}</span>
            <Button variant="outline" onClick={logout} className="border-white/20 bg-transparent text-white hover:bg-white/10">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="border-white/10 bg-white/10 p-8 text-white backdrop-blur">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-300">{spindel ? "Employee Dashboard" : "Student Dashboard"}</p>
            <h1 className="text-4xl font-bold">{spindel ? `Good to see you, ${user.firstName}.` : `Welcome back, ${user.firstName}`}</h1>
            <p className="mt-3 max-w-2xl text-slate-200">
              {spindel
                ? `Your onboarding path is ready. Complete each lesson and earn at least ${passingScore}% on every knowledge check; hands-on duties still require supervisor validation.`
                : `Complete each lesson and earn at least ${passingScore}% on every module quiz to receive the course completion certificate.`}
            </p>
            <div className="mt-7">
              <div className="mb-2 flex justify-between text-sm text-slate-300">
                <span>{user.completedModules} of {modules.length} modules passed</span>
                <span>{percentComplete}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${percentComplete}%` }} />
              </div>
            </div>
          </Card>

          <Card className="border-white/10 bg-white/10 p-8 text-white backdrop-blur">
            <Award className="mb-4 h-10 w-10 text-amber-300" />
            <h2 className="text-2xl font-bold">{spindel ? "Onboarding Certificate" : "Completion Certificate"}</h2>
            <p className="mt-2 text-sm text-slate-300">
              {user.certificateEligible
                ? `All ${modules.length} modules are complete. Your printable certificate is ready.`
                : `${modules.length - user.completedModules} module(s) remain.`}
            </p>
            <a href="/course/certificate" className="mt-5 block">
              <Button disabled={!user.certificateEligible} className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400">
                View Certificate
              </Button>
            </a>
          </Card>
        </section>

        {spindel && (
          <section className="rounded-2xl border border-cyan-200/20 bg-cyan-100/10 p-6 text-sm leading-7 text-cyan-50">
            <strong>Keep the learning lens clear:</strong> Use fictional examples only—never patient information. Current written policies, physician instructions, and supervisor direction always take priority over course examples.
          </section>
        )}

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">{spindel ? "Required Onboarding" : "Course Modules"}</p>
              <h2 className="text-3xl font-bold">{spindel ? "Bring the full picture into focus" : "10-Day Learning Path"}</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {modules.map((module) => {
              const progress = user.progress.find((item) => item.day === module.day);
              return (
                <Card key={module.id} className="border-white/10 bg-white p-6 text-slate-900 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{module.icon}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-blue-700">{spindel ? "Module" : "Day"} {module.day}</span>
                        {progress?.passed && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Passed {progress.score}%
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-xl font-bold">{module.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{module.description}</p>
                      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                        <span>{module.duration}</span>
                        <span>{module.difficulty}</span>
                      </div>
                      <a href={`/course/module/${module.day}`} className="mt-5 block">
                        <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          {progress?.passed ? "Review Module" : progress ? "Continue Module" : "Start Module"}
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {user.role === "manager" && team && (
          <section className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">{spindel ? "Onboarding Management" : "Practice Management"}</p>
              <h2 className="flex items-center gap-2 text-3xl font-bold"><Users className="h-7 w-7" /> {spindel ? "Employee Seats" : "Team Seats"}</h2>
              <p className="mt-2 text-slate-300">{team.team.length} of {team.seatLimit} assigned seats are in use.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Card className="bg-white p-6 text-slate-900">
                <h3 className="mb-4 text-xl font-bold">{spindel ? "Employee Onboarding Progress" : "Team Progress"}</h3>
                <div className="space-y-3">
                  {team.team.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <div>
                        <p className="font-semibold">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-700">{member.completedModules}/{modules.length}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white p-6 text-slate-900">
                <h3 className="mb-2 text-xl font-bold">Unused Invitation Links</h3>
                <p className="mb-4 text-sm text-slate-600">{spindel ? "Send one private link to each new employee. The employee creates a password from that link." : "Copy one private link for each additional staff member."}</p>
                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                  {team.invites.filter((invite) => !invite.usedAt).map((invite) => (
                    <div key={invite.code} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
                      <code className="min-w-0 flex-1 truncate text-xs">{window.location.origin}/join/{invite.code}</code>
                      <Button size="sm" variant="outline" onClick={() => copyInvite(invite.code)}>
                        <Clipboard className="mr-1 h-3 w-3" /> {copiedCode === invite.code ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  ))}
                  {team.invites.every((invite) => invite.usedAt) && (
                    <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">No unused invitations remain.</p>
                  )}
                </div>
              </Card>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 px-4 py-7 text-center text-sm text-slate-300">
        {spindel ? `${brandName} · ${programName} · Internal use` : `${brandName} · ${programName}`}
      </footer>
    </div>
  );
}
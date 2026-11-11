import { Button } from "@/components/ui/button";
import { SpindelLogo } from "@/components/SpindelLogo";
import { Card } from "@/components/ui/card";
import { isSpindelOrganization } from "@/data/spindelCrashCourse";
import { ApiError, apiRequest, type CourseUser } from "@/lib/api";
import { Award, Loader2, Printer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Certificate() {
  const [user, setUser] = useState<CourseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiRequest<{ user: CourseUser }>("/api/auth/me");
        setUser(response.user);
      } catch (requestError) {
        if (requestError instanceof ApiError && requestError.status === 401) {
          window.location.assign("/login");
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Unable to load the certificate.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const completionDate = useMemo(() => {
    if (!user?.certificateEligible) return "";
    const completedDates = user.progress
      .flatMap((item) => (item.completedAt ? [new Date(item.completedAt)] : []))
      .sort((left, right) => right.getTime() - left.getTime());
    return (completedDates[0] ?? new Date()).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Preparing certificate...
      </div>
    );
  }

  if (!user?.certificateEligible) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-20 text-center text-white">
        <Award className="mx-auto h-16 w-16 text-amber-300" />
        <h1 className="mt-5 text-3xl font-bold">Certificate Not Yet Available</h1>
        <p className="mt-3 text-slate-300">{error || "Pass all ten module quizzes to unlock your certificate of completion."}</p>
        <a href="/course"><Button className="mt-7">Return to Dashboard</Button></a>
      </div>
    );
  }

  const spindel = isSpindelOrganization(user.organizationName);

  return (
    <div className="min-h-screen bg-slate-200 px-4 py-10 print:bg-white print:p-0">
      <div className="mx-auto mb-6 flex max-w-5xl justify-between print:hidden">
        <a href="/course"><Button variant="outline">Return to Dashboard</Button></a>
        <Button onClick={() => window.print()} className="bg-blue-700 text-white hover:bg-blue-800">
          <Printer className="mr-2 h-4 w-4" /> Print or Save as PDF
        </Button>
      </div>

      <Card className={`mx-auto flex min-h-[700px] max-w-5xl flex-col items-center justify-center border-[12px] border-double ${spindel ? "border-cyan-800" : "border-blue-900"} bg-white px-10 py-16 text-center shadow-2xl print:min-h-screen print:max-w-none print:shadow-none`}>
        {spindel ? <SpindelLogo className="mb-7 h-20 w-72" /> : <Award className="mb-7 h-20 w-20 text-amber-500" />}
        <p className="text-lg font-semibold uppercase tracking-[0.3em] text-blue-800">{spindel ? "10 Day Crash Course" : "OptiTech Academy"}</p>
        <h1 className="mt-5 font-serif text-6xl font-bold text-slate-900">Certificate of Completion</h1>
        <p className="mt-9 text-xl text-slate-600">This certifies that</p>
        <p className="mt-4 border-b-2 border-slate-400 px-12 pb-3 font-serif text-5xl font-semibold text-blue-950">
          {user.firstName} {user.lastName}
        </p>
        <p className="mt-8 max-w-3xl text-xl leading-8 text-slate-700">
          {spindel ? (
            <>successfully completed the ten-module <strong>Spindel Eye Associates 10 Day Crash Course</strong> and passed each knowledge assessment.</>
          ) : (
            <>successfully completed the ten-module <strong>Ophthalmic Technician Foundations</strong> educational course and passed each module assessment.</>
          )}
        </p>
        <p className="mt-8 text-lg text-slate-600">Completed {completionDate}</p>

        <div className="mt-14 grid w-full max-w-3xl gap-10 border-t border-slate-300 pt-8 text-sm text-slate-500 sm:grid-cols-2">
          <div>
            <div className="mx-auto mb-2 w-56 border-b border-slate-600" />
            {spindel ? "Supervisor or Manager" : "Course Administrator"}
          </div>
          <div>
            <div className="mx-auto mb-2 w-56 border-b border-slate-600" />
            Date of Completion
          </div>
        </div>

        <p className="mt-12 max-w-3xl text-xs leading-5 text-slate-500">
          {spindel
            ? "This document confirms completion of the online 10 Day Crash Course. It does not replace the employee handbook, current practice policies, hands-on training, supervisor competency validation, licensure, or professional certification."
            : "This document confirms completion of an independent educational course. It is not licensure, professional certification, JCAHPO certification, or proof of independent clinical competency."}
        </p>
      </Card>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpindelLogo } from "@/components/SpindelLogo";
import { apiRequest, type CourseUser } from "@/lib/api";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { useState } from "react";

export default function SpindelLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await apiRequest<{ user: CourseUser }>("/api/auth/spindel-staff", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      window.location.assign("/course");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-950 via-blue-900 to-cyan-900 px-4 py-16">
      <Card className="mx-auto w-full max-w-md bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <SpindelLogo variant="stacked" className="mx-auto h-32 w-32 border border-blue-100 shadow-lg" />
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-blue-700">Employee Onboarding</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Employee Onboarding Sign In</h1>
          <p className="mt-2 text-slate-600">Enter your @spindeleye.com email and staff access password. Your course opens automatically.</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <a href="/forgot-password" className="text-sm font-semibold text-blue-700 hover:underline">Forgot password?</a>
            </div>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          {error && <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /><span>{error}</span></div>}

          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-700 py-6 text-white hover:bg-blue-800">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />} Sign In
          </Button>
        </form>

        <div className="mt-7 space-y-2 text-center text-sm text-slate-500">
          <p>First time here? Your staff learner account will be created when you sign in.</p>
          <p><a href="/login" className="font-semibold text-blue-700 hover:underline">Manager or personal account sign in</a></p>
          <p><a href="/spindel" className="font-semibold text-blue-700 hover:underline">Return to the onboarding portal</a></p>
        </div>
      </Card>
    </div>
  );
}

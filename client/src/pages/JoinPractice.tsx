import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpindelLogo } from "@/components/SpindelLogo";
import { apiRequest } from "@/lib/api";
import { AlertCircle, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { useRoute } from "wouter";

export default function JoinPractice() {
  const [, params] = useRoute("/join/:code");
  const code = params?.code ?? "";
  const spindel = code.toUpperCase().startsWith("SEA-");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmation: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("/api/practice/redeem", {
        method: "POST",
        body: JSON.stringify({
          code,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });
      window.location.assign("/course");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create your account.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${spindel ? "from-sky-950 via-blue-900 to-cyan-900" : "from-slate-950 via-blue-950 to-slate-900"} px-4 py-16`}>
      <Card className="mx-auto w-full max-w-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          {spindel ? <SpindelLogo className="mx-auto mb-4 h-16 w-56" /> : <Users className="mx-auto mb-4 h-12 w-12 text-blue-600" />}
          {spindel && <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-700">10 Day Crash Course</p>}
          <h1 className="text-3xl font-bold text-slate-900">{spindel ? "Create Your 10 Day Crash Course Account" : "Join Your Practice Team"}</h1>
          <p className="mt-2 text-slate-600">{spindel ? "This private invitation assigns your 10 Day Crash Course seat and saves your progress." : "Create your individual course account using the purchased team seat."}</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">First Name</label>
              <input name="firstName" value={form.firstName} onChange={update} required className="w-full rounded-lg border border-slate-300 px-4 py-3" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={update} required className="w-full rounded-lg border border-slate-300 px-4 py-3" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={update} autoComplete="email" required className="w-full rounded-lg border border-slate-300 px-4 py-3" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Create Password</label>
            <input type="password" name="password" value={form.password} onChange={update} autoComplete="new-password" minLength={10} required className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="At least 10 characters" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
            <input type="password" name="confirmation" value={form.confirmation} onChange={update} autoComplete="new-password" minLength={10} required className="w-full rounded-lg border border-slate-300 px-4 py-3" />
          </div>

          {spindel && <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">Do not use a password from Veradigm, email, or another work system. This course account has separate credentials.</div>}

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting || !code} className="w-full bg-blue-700 py-6 text-white hover:bg-blue-800">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {spindel ? "Create My 10 Day Crash Course Account" : "Create My Course Account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

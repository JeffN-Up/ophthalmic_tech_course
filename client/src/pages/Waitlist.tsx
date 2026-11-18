import { useState, type FormEvent } from "react";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

export default function Waitlist() {
  const [interest, setInterest] = useState("individual");
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await apiRequest("/api/waitlist", { method: "POST", body: JSON.stringify(fields) });
      setJoined(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to join. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-5 py-12 text-white">
        <div className="mx-auto max-w-xl">
          <a href="/" className="font-semibold text-cyan-200">OptiTech Academy</a>
          <h1 className="mt-4 text-4xl font-bold">Join the founding-buyer waitlist</h1>
          <p className="mt-4 text-slate-200">
            Get launch details for Ophthalmic Technician Foundations, a self-paced course for new
            and developing technicians and the practices that train them.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-8">
        {joined ? (
          <section role="status" className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">You’re on the waitlist</h2>
            <p className="mt-2">We’ll use your email to share launch details.</p>
          </section>
        ) : (
          <form onSubmit={submit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
            <label className="block font-medium">
              Name
              <Input className="mt-2" name="name" autoComplete="name" maxLength={120} required />
            </label>
            <label className="block font-medium">
              Email
              <Input className="mt-2" name="email" type="email" autoComplete="email" maxLength={254} required />
            </label>
            <label className="block font-medium">
              I’m interested in
              <select name="interest" value={interest} onChange={(event) => setInterest(event.target.value)}
                className="mt-2 block w-full rounded-md border border-slate-300 bg-white p-2">
                <option value="individual">Individual enrollment</option>
                <option value="practice">Practice team enrollment</option>
              </select>
            </label>
            {interest === "practice" && (
              <label className="block font-medium">
                Practice name (optional)
                <Input className="mt-2" name="practiceName" autoComplete="organization" maxLength={160} />
              </label>
            )}
            <p className="text-sm text-slate-600">
              No payment or commitment is required. By joining, you’re asking us to email you
              about the course launch. See our <a href="/privacy" className="underline">Privacy Policy</a>.
            </p>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Joining…" : "Join the waitlist"}
            </Button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

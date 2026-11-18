import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";

export function FoundingBuyerForm({ onClose }: { onClose: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<"individual" | "practice">("individual");
  const [organizationName, setOrganizationName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(""); setSubmitting(true);
    try {
      await apiRequest("/api/founding-buyer-interest", { method: "POST", body: JSON.stringify({ firstName, email, interest, organizationName, note }) });
      setComplete(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We couldn't save your request. Please try again.");
    } finally { setSubmitting(false); }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
    <Card className="my-8 w-full max-w-xl bg-white p-6 shadow-2xl sm:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-blue-700">Founding-buyer list</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Get launch details first.</h2></div><button type="button" onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-slate-800"><X /></button></div>
      {complete ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-green-600" /><h3 className="mt-4 text-xl font-bold text-slate-900">You’re on the list.</h3><p className="mt-2 text-slate-600">We’ll contact you with founding-buyer availability and enrollment details.</p><Button className="mt-6" onClick={onClose}>Done</Button></div> :
      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block text-sm font-medium text-slate-700">First name *<input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /></label>
        <label className="block text-sm font-medium text-slate-700">Email address *<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /></label>
        <label className="block text-sm font-medium text-slate-700">I’m interested in<select value={interest} onChange={(e) => setInterest(e.target.value as "individual" | "practice")} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"><option value="individual">Individual technician enrollment</option><option value="practice">Practice or clinic team enrollment</option></select></label>
        {interest === "practice" && <label className="block text-sm font-medium text-slate-700">Practice or clinic name *<input required value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /></label>}
        <label className="block text-sm font-medium text-slate-700">What would make this useful for you? <span className="font-normal">(optional)</span><textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={3} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" /></label>
        {error && <p className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
        <p className="text-xs leading-5 text-slate-500">By joining, you agree to receive launch and enrollment information from OptiTech Academy. We will not sell your information.</p>
        <Button type="submit" disabled={submitting} className="w-full bg-blue-600 py-6 text-white hover:bg-blue-700">{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{submitting ? "Saving your request" : "Join the founding-buyer list"}</Button>
      </form>}
    </Card>
  </div>;
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useState } from "react";

interface EnrollmentFormProps {
  tier: string;
  defaultType?: "individual" | "practice";
  onClose: () => void;
}

const INDIVIDUAL_PRICE = 699;
const PRACTICE_PRICE = 1200;
const PRACTICE_SEATS = 5;

export function EnrollmentForm({ tier, defaultType = "individual", onClose }: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "beginner",
    goal: "",
    type: defaultType,
    organizationName: "",
    seats: defaultType === "practice" ? String(PRACTICE_SEATS) : "1",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isPractice = formData.type === "practice";
  const seatCount = isPractice ? PRACTICE_SEATS : 1;
  const total = isPractice ? PRACTICE_PRICE : INDIVIDUAL_PRICE;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "type" ? { seats: value === "practice" ? String(PRACTICE_SEATS) : "1" } : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest<{ url: string }>("/api/enrollment/checkout", {
        method: "POST",
        body: JSON.stringify({ ...formData, tier }),
      });
      window.location.assign(response.url);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to start secure checkout.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
      <Card className="my-8 w-full max-w-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {isPractice ? "Enroll Your Practice Team" : "Enroll in OptiTech Academy"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              ${total.toLocaleString()} one-time total for {seatCount} student seat{seatCount === 1 ? "" : "s"}.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close enrollment form" className="text-slate-500 hover:text-slate-800">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900">Purchaser Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                First Name *
                <input name="firstName" value={formData.firstName} onChange={handleChange} autoComplete="given-name" required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Last Name *
                <input name="lastName" value={formData.lastName} onChange={handleChange} autoComplete="family-name" required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Email Address *
              <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Phone Number *
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
            </label>
          </section>

          <section className="space-y-4">
            <h3 className="font-bold text-slate-900">Enrollment Details</h3>
            <label className="block text-sm font-medium text-slate-700">
              Experience Level *
              <select name="experience" value={formData.experience} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3">
                <option value="beginner">Beginner — no ophthalmic experience</option>
                <option value="some">Some experience in eye care</option>
                <option value="experienced">Experienced technician seeking additional training</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Enrollment Type *
              <select name="type" value={formData.type} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3">
                <option value="individual">Individual Technician</option>
                <option value="practice">Practice or Clinic Team</option>
              </select>
            </label>

            {isPractice && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Practice or Clinic Name *
                  <input name="organizationName" value={formData.organizationName} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
                </label>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950">
                  <strong>Practice Starter Package:</strong> five course seats, manager invitation links, and team-progress visibility for $1,200 total.
                </div>
              </div>
            )}

            <label className="block text-sm font-medium text-slate-700">
              Primary Training Goal *
              <textarea name="goal" value={formData.goal} onChange={handleChange} required maxLength={500} rows={3} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Tell us what you hope to learn or improve." />
            </label>
          </section>

          <div className="rounded-lg bg-blue-50 p-4">
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input type="checkbox" required className="mt-1 h-4 w-4" />
              <span>
                I understand the price is {isPractice ? "$1,200 for five course seats" : "$699 for one course seat"}, the course is self-paced, supervised hands-on training may still be required, and the completion certificate is not licensure or professional certification.
              </span>
            </label>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 py-6 text-white hover:bg-blue-700">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Opening Secure Checkout" : `Continue to Stripe — $${total.toLocaleString()}`}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1 py-6">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}


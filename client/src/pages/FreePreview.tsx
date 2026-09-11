import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock3,
  GraduationCap,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { freePreviewLesson } from "@shared/course/freePreview";
import {
  formatOfferPrice,
  foundingLearnerOffer,
  practicePackOffers,
} from "@shared/commerce/offers";

export default function FreePreview() {
  const starterPracticePack = practicePackOffers[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course home
          </a>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Free course preview
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                Try one beginner ophthalmic lesson before buying
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                This preview shows the tone of OptiTech Academy: plain English,
                clinic context, safe boundaries, and supervised-practice
                expectations.
              </p>
            </div>
            <Card className="border-blue-100 bg-blue-50 p-5 text-blue-950 shadow-sm">
              <p className="text-sm font-semibold text-blue-700">
                Preview lesson
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {freePreviewLesson.title}
              </h2>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <Clock3 className="h-4 w-4" />
                About {freePreviewLesson.durationMinutes} minutes
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px]">
        <section className="space-y-6">
          <Card className="border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-1 h-6 w-6 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  Sample lesson
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  {freePreviewLesson.title}
                </h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {freePreviewLesson.lessonBody.map(paragraph => (
                <p key={paragraph} className="leading-8 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-6 w-6 text-blue-700" />
                <h2 className="text-xl font-bold">Clinic connection</h2>
              </div>
              <p className="mt-4 leading-7 text-slate-700">
                {freePreviewLesson.clinicConnection}
              </p>
            </Card>
            <Card className="border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-amber-700" />
                <h2 className="text-xl font-bold">Patient-friendly words</h2>
              </div>
              <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4 leading-7 text-slate-700">
                {freePreviewLesson.patientFriendlyScript}
              </p>
            </Card>
          </div>

          <Card className="border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
            <h2 className="text-2xl font-bold">Quick checkpoint</h2>
            <p className="mt-3 leading-7">
              {freePreviewLesson.checkpoint.prompt}
            </p>
            <div className="mt-5 rounded-md border border-amber-200 bg-white p-4">
              <p className="text-sm font-semibold text-amber-800">
                Safe answer
              </p>
              <p className="mt-2 leading-7">
                {freePreviewLesson.checkpoint.safeAnswer}
              </p>
            </div>
            <p className="mt-4 text-sm leading-6">
              {freePreviewLesson.checkpoint.whyItMatters}
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Who this course fits</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {freePreviewLesson.courseFit.map(item => (
                <div
                  key={item}
                  className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card className="sticky top-6 border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">
              Continue from the preview
            </p>
            <h2 className="mt-2 text-2xl font-bold">Choose your path</h2>
            <div className="mt-5 space-y-3">
              <a href="/checkout">
                <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Individual access {formatOfferPrice(foundingLearnerOffer)}
                </Button>
              </a>
              <a href="/practice-packs">
                <Button className="w-full" variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Practice packs from {formatOfferPrice(starterPracticePack)}
                </Button>
              </a>
              <a href="/curriculum">
                <Button className="w-full" variant="outline">
                  View full curriculum
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <a href="/buyer-guide">
                <Button className="w-full" variant="outline">
                  Open buyer guide
                </Button>
              </a>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-5">
              <h3 className="font-semibold">Before buying</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {freePreviewLesson.nextSteps.map(step => (
                  <li key={step}>- {step}</li>
                ))}
              </ul>
            </div>
            <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
              Completion is education, not certification, employment, or
              independent clinical competency.
            </p>
          </Card>
        </aside>
      </div>
    </main>
  );
}

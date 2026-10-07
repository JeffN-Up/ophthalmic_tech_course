import { ProtocolLesson } from "@/components/ProtocolLesson";
import CourseQuiz from "@/components/CourseQuiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpindelLogo } from "@/components/SpindelLogo";
import { getCourseContent } from "@/data/courseContent";
import { getCourseQuizByDay } from "@/data/courseQuizzes";
import { curriculumModules } from "@/data/curriculum";
import {
  getApprovedMediaEndpoint,
  getSpindelMediaForDay,
  type SpindelApprovedMedia,
} from "@/data/spindelMedia";
import {
  getSpindelLesson,
  getSpindelQuiz,
  isSpindelOrganization,
  spindelOnboardingModules,
} from "@/data/spindelOnboarding";
import { ApiError, apiRequest, type CourseUser } from "@/lib/api";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Headphones,
  Image as ImageIcon,
  Loader2,
  PlayCircle,
  Presentation,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";

export default function CourseModule() {
  const [, params] = useRoute("/course/module/:day");
  const day = Number(params?.day);
  const [user, setUser] = useState<CourseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvedMedia, setApprovedMedia] = useState<SpindelApprovedMedia[]>([]);
  const [mediaError, setMediaError] = useState("");
  const [missingMedia, setMissingMedia] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setApprovedMedia([]);
      setMediaError("");
      setMissingMedia([]);
      try {
        const response = await apiRequest<{ user: CourseUser }>("/api/auth/me");
        setUser(response.user);
        try {
          const mediaResponse = await apiRequest<{ media: SpindelApprovedMedia[]; missingMedia?: { day: number; types: string[] }[] }>(
            getApprovedMediaEndpoint(response.user.organizationName),
          );
          const moduleMedia = getSpindelMediaForDay(mediaResponse.media, day);
          setMissingMedia(mediaResponse.missingMedia?.find(item => item.day === day)?.types ?? []);
          const hasProfessionalSkillsVideo = moduleMedia.some(
            (item) => item.type === "video" && item.title === "Professional skills and EMR",
          );
          setApprovedMedia(moduleMedia.filter((item) => !(
            isSpindelOrganization(response.user.organizationName) &&
            day === 9 && hasProfessionalSkillsVideo &&
            item.type === "video" && item.title === "Workup quality"
          )));
        } catch (mediaRequestError) {
          setMediaError(
            mediaRequestError instanceof Error
              ? mediaRequestError.message
              : "Approved media is temporarily unavailable.",
          );
        }
      } catch (requestError) {
        if (requestError instanceof ApiError && requestError.status === 401) {
          window.location.assign("/login");
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Unable to load this module.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [day]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Loading module...
      </div>
    );
  }

  const spindel = isSpindelOrganization(user?.organizationName);
  const modules = spindel ? spindelOnboardingModules : curriculumModules;
  const module = modules.find((candidate) => candidate.day === day);
  const lesson = spindel ? getSpindelLesson(day) : getCourseContent(day);
  const quiz = spindel ? getSpindelQuiz(day) : getCourseQuizByDay(day);

  const saveScore = async (score: number) => {
    const response = await apiRequest<{ user: CourseUser }>("/api/course/progress", {
      method: "POST",
      body: JSON.stringify({ day, score }),
    });
    setUser(response.user);
  };

  const continueCourse = () => {
    window.location.assign(day < modules.length ? `/course/module/${day + 1}` : "/course");
  };

  if (!module || !lesson || !quiz || !user) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">Module unavailable</h1>
        <p className="mt-3 text-slate-300">{error || "This module could not be found."}</p>
        <a href="/course"><Button className="mt-6">Return to Dashboard</Button></a>
      </div>
    );
  }

  const priorProgress = user.progress.find((item) => item.day === day);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className={`bg-gradient-to-r ${spindel ? "from-sky-950 via-blue-900 to-cyan-900" : "from-slate-950 via-blue-950 to-slate-900"} text-white`}>
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <a href="/course" className="inline-flex items-center text-sm text-blue-100 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> {spindel ? "Onboarding Dashboard" : "Course Dashboard"}
            </a>
            {spindel && <SpindelLogo className="h-11 w-44 shadow" />}
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="text-6xl">{module.icon}</div>
            <div>
              <p className="font-semibold uppercase tracking-wider text-cyan-200">{spindel ? "Module" : "Day"} {module.day} · {module.difficulty}</p>
              <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{module.title}</h1>
              <p className="mt-4 max-w-3xl text-lg text-blue-100">{module.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-blue-100">
                {!spindel && <span className="inline-flex items-center"><Clock className="mr-2 h-4 w-4" /> {module.duration}</span>}
                {priorProgress?.passed && (
                  <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-green-100">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Passed with {priorProgress.score}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <Card className="p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold" style={{ color: "#ffffff" }}>{spindel ? "What you’ll be able to do" : "Learning Objectives"}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {module.objectives.map((objective) => (
              <div key={objective} className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-700" />
                <span>{objective}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 text-slate-100 shadow-lg sm:p-8">
          <p className="text-lg leading-8 text-slate-200">{lesson.introduction}</p>
        </Card>

        {approvedMedia.length > 0 && (
          <Card className="overflow-hidden shadow-lg">
            <div className="border-b border-slate-200 bg-gradient-to-r from-sky-950 via-blue-900 to-cyan-900 p-6 text-white sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-200">{spindel ? "Physician-approved media" : "Module media"}</p>
              <h2 className="mt-2 text-2xl font-bold">Watch, listen, and review</h2>
              <p className="mt-2 max-w-3xl text-blue-100">
                {spindel
                  ? "These resources support the current Spindel onboarding lesson and reinforce supervised practice."
                  : "Use the video and audio overviews to reinforce the written lesson before completing the assessment."}
              </p>
            </div>
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
              {approvedMedia.map((item) => {
                const MediaIcon = item.type === "video"
                  ? PlayCircle
                  : item.type === "audio"
                    ? Headphones
                    : item.type === "document"
                      ? FileText
                      : item.type === "slide"
                        ? Presentation
                    : ImageIcon;

                return (
                  <article key={item.driveFileId} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <iframe
                      src={item.embedUrl}
                      title={item.title}
                      className={item.type === "audio"
                        ? "h-56 w-full border-0 bg-slate-950 sm:h-60"
                        : item.type === "document" || item.type === "slide"
                          ? "h-96 w-full border-0 bg-slate-950"
                        : "aspect-[16/10] min-h-64 w-full border-0 bg-slate-950"}
                      loading="lazy"
                      allow="autoplay"
                      allowFullScreen
                    />
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-700">
                        <MediaIcon className="h-4 w-4" /> {item.type} · {item.learningTier === "core" ? "Core learning" : "Extended learning"}
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                      <p className="mt-2 text-xs text-slate-500">Source: {item.sourceLabel}</p>
                      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm leading-6 text-slate-700">
                        <span className="font-semibold text-slate-900">What this helps with: </span>
                        {item.learningObjective}
                      </div>
                      {item.aiGenerated && (
                        <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                          <p><strong>Optional AI visual aid:</strong> This video can make the topic easier to picture, but AI visuals may simplify or inaccurately represent anatomy. Use the written lesson, current practice protocols, and supervised training as the source of truth.</p>
                        </div>
                      )}
                      <a
                        href={item.openUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900"
                      >
                        {item.type === "slide"
                          ? "Open slide deck"
                          : item.type === "document"
                            ? "Open full document"
                            : "Open full media"} <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </Card>
        )}

        {missingMedia.length > 0 && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
            <strong>Overview pending:</strong> This module’s {missingMedia.join(" and ")} overview is not connected yet. The available resources, written lesson, and knowledge check remain usable.
          </div>
        )}

        {mediaError && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
            <strong>Media unavailable:</strong> {mediaError} Continue with the written lesson and notify a supervisor if access should be restored.
          </div>
        )}

        {spindel && <ProtocolLesson day={day} />}

        {lesson.sections.map((section) => (
          <Card key={section.title} className="p-6 text-slate-100 shadow-lg sm:p-8">
            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-slate-200">
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.keyPoints && (
              <div className="mt-6 rounded-xl bg-slate-900 p-5">
                <h3 className="font-bold text-white">{spindel ? "Keep these in focus" : "Key Points"}</h3>
                <ul className="mt-3 space-y-2 text-slate-200">
                  {section.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="font-bold text-blue-300">•</span> {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}

        <Card className="p-6 text-slate-100 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">{spindel ? "From screen to supervised practice" : "Skills Practice Checklist"}</h2>
          <p className="mt-2 text-slate-200">Use this checklist with a qualified supervisor and the practice’s current approved protocol. Checking a box here records your review; it does not replace competency validation.</p>
          <div className="mt-5 space-y-3">
            {lesson.practiceChecklist.map((item) => (
              <label key={item} className="flex items-start gap-3 rounded-lg border border-white/20 p-4">
                <input type="checkbox" className="mt-1 h-4 w-4" />
                <span className="text-slate-100">{item}</span>
              </label>
            ))}
          </div>
        </Card>

        <div className="flex items-start gap-4 rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-950">
          <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0" />
          <div>
            <h2 className="font-bold">Clinical Safety Note</h2>
            <p className="mt-1 leading-7">{lesson.safetyNote}</p>
          </div>
        </div>

        <CourseQuiz quiz={quiz} onComplete={saveScore} onContinue={continueCourse} />
      </main>
    </div>
  );
}

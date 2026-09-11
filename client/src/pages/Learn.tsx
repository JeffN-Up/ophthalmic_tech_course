import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  createEmptyProgress,
  getProgressPercent,
  loadProgress,
  saveProgress,
} from "@/lib/progressStore";
import {
  fetchLearnerSessionAccess,
  type LearnerSessionAccess,
} from "@/lib/learnerSessionClient";
import {
  fetchProtectedModuleOneLessons,
  type ProtectedModuleOneLessons,
} from "@/lib/protectedLessonsClient";
import { getCheckoutStatus } from "@/lib/checkoutStatus";
import { createMailtoHref } from "@shared/commerce/offers";
import { buyerSupportContact } from "@shared/commerce/policies";
import { getModuleStudyMaterialBundle } from "@shared/course/moduleStudyMaterials";
import {
  fetchModuleOneLessonProgress,
  markModuleOneLessonComplete,
} from "@/lib/lessonProgressClient";
import { requestPasswordlessSignInLink } from "@/lib/passwordlessSignInClient";
import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";
import { optiTechCourse } from "@shared/course/courseCatalog";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  ExternalLink,
  FileText,
  Headphones,
  HelpCircle,
  ImageIcon,
  Mail,
  ShieldAlert,
  Star,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const storage = typeof window === "undefined" ? null : window.localStorage;
const supportHref = createMailtoHref({
  email: buyerSupportContact.email,
  subject: buyerSupportContact.subject,
  body: buyerSupportContact.emailBody,
});

export default function Learn() {
  const [selectedLessonId, setSelectedLessonId] = useState<string>();
  const [progress, setProgress] = useState(() =>
    storage ? loadProgress(storage) : createEmptyProgress()
  );
  const [learnerAccess, setLearnerAccess] =
    useState<LearnerSessionAccess | null>(null);
  const [learnerAccessError, setLearnerAccessError] = useState("");
  const [protectedLessons, setProtectedLessons] =
    useState<ProtectedModuleOneLessons | null>(null);
  const [lessonContentError, setLessonContentError] = useState("");
  const [lessonProgressError, setLessonProgressError] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInRequestMessage, setSignInRequestMessage] = useState("");
  const [signInRequestError, setSignInRequestError] = useState("");
  const [isRequestingSignIn, setIsRequestingSignIn] = useState(false);

  const lessonList = protectedLessons?.lessons ?? [];
  const selectedLesson = useMemo(
    () =>
      lessonList.find(lesson => lesson.id === selectedLessonId) ??
      lessonList[0],
    [lessonList, selectedLessonId]
  );

  const completePercent = getProgressPercent(progress, lessonList.length);
  const moduleOne = protectedLessons?.module ?? optiTechCourse.modules[0];
  const moduleStudyMaterials = getModuleStudyMaterialBundle(
    moduleOne.moduleNumber
  );
  const materialKindIconMap: Record<string, LucideIcon> = {
    audio: Headphones,
    image: ImageIcon,
    pdf: FileText,
    video: Video,
  };
  const checkoutStatus =
    typeof window === "undefined"
      ? null
      : getCheckoutStatus(window.location.search);
  const normalizedSignInEmail = normalizeCheckoutEmail(signInEmail);
  const showSignInEmailValidation =
    signInEmail.trim().length > 0 && !normalizedSignInEmail;

  const requestSignInLink = async () => {
    setIsRequestingSignIn(true);
    setSignInRequestError("");
    setSignInRequestMessage("");

    try {
      const result = await requestPasswordlessSignInLink({
        email: signInEmail,
      });
      setSignInRequestMessage(result.message);
    } catch (error) {
      setSignInRequestError(
        error instanceof Error
          ? error.message
          : "Sign-in link could not be requested."
      );
    } finally {
      setIsRequestingSignIn(false);
    }
  };

  const completeLesson = async () => {
    if (!selectedLesson) return;

    try {
      setLessonProgressError("");
      const serverProgress = await markModuleOneLessonComplete({
        lessonId: selectedLesson.id,
      });
      const nextProgress = {
        completedLessonIds: serverProgress.completedLessonIds,
        quizScores: progress.quizScores,
        updatedAt: serverProgress.updatedAt,
      };

      setProgress(nextProgress);
      if (storage) {
        saveProgress(storage, nextProgress);
      }
    } catch (error) {
      setLessonProgressError(
        error instanceof Error
          ? error.message
          : "Lesson progress could not be saved."
      );
    }
  };

  useEffect(() => {
    let active = true;

    fetchLearnerSessionAccess()
      .then(access => {
        if (!active) return;
        setLearnerAccess(access);
      })
      .catch(error => {
        if (!active) return;
        setLearnerAccessError(
          error instanceof Error
            ? error.message
            : "Learner access is unavailable right now."
        );
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetchProtectedModuleOneLessons()
      .then(payload => {
        if (!active) return;
        setProtectedLessons(payload);
        setLearnerAccess(payload.access);
        setSelectedLessonId(
          currentLessonId => currentLessonId ?? payload.lessons[0]?.id
        );
      })
      .catch(error => {
        if (!active) return;
        setLessonContentError(
          error instanceof Error
            ? error.message
            : "Lesson content is unavailable right now."
        );
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!learnerAccess?.hasAccess || !storage) {
      return () => {
        active = false;
      };
    }

    fetchModuleOneLessonProgress()
      .then(serverProgress => {
        if (!active) return;
        const nextProgress = {
          completedLessonIds: serverProgress.completedLessonIds,
          quizScores: progress.quizScores,
          updatedAt: serverProgress.updatedAt,
        };

        setProgress(nextProgress);
        saveProgress(storage, nextProgress);
      })
      .catch(error => {
        if (!active) return;
        setLessonProgressError(
          error instanceof Error
            ? error.message
            : "Lesson progress is unavailable right now."
        );
      });

    return () => {
      active = false;
    };
  }, [learnerAccess?.hasAccess]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              OptiTech Academy
            </p>
            <h1 className="mt-2 text-3xl font-bold">{moduleOne.title}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{moduleOne.outcome}</p>
          </div>
          <a href="/">
            <Button variant="outline">Back to course home</Button>
          </a>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          {checkoutStatus?.tone === "success" && (
            <Card className="border-green-200 bg-green-50 p-4 text-green-950 shadow-sm">
              <h2 className="font-semibold">{checkoutStatus.title}</h2>
              <p className="mt-2 text-sm leading-6">{checkoutStatus.message}</p>
              <ul className="mt-3 space-y-1 text-sm leading-6">
                {checkoutStatus.nextSteps.map(step => (
                  <li key={step} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              {!learnerAccess?.hasAccess && (
                <p className="mt-3 rounded-md border border-green-200 bg-white p-3 text-sm leading-6">
                  Need access on this device? Request a sign-in link below using
                  the same email entered at checkout.
                </p>
              )}
              <a
                href={supportHref}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950"
              >
                <Mail className="h-4 w-4" />
                Email support if access looks wrong
              </a>
            </Card>
          )}

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldAlert
                className={`mt-1 h-5 w-5 ${
                  learnerAccess?.hasAccess ? "text-green-700" : "text-amber-600"
                }`}
              />
              <div>
                <h2 className="font-semibold">Access status</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {learnerAccess?.hasAccess
                    ? `Signed in as ${learnerAccess.email}. Access is active through ${new Date(
                        learnerAccess.accessExpiresAt
                      ).toLocaleDateString()}.`
                    : learnerAccess
                      ? learnerAccess.reason
                      : learnerAccessError || "Checking learner access..."}
                </p>
                {!learnerAccess?.hasAccess && (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <label
                      htmlFor="learner-sign-in-email"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Email used for checkout
                    </label>
                    <input
                      id="learner-sign-in-email"
                      type="email"
                      value={signInEmail}
                      aria-invalid={showSignInEmailValidation}
                      aria-describedby="learner-sign-in-email-help"
                      onChange={event => setSignInEmail(event.target.value)}
                      placeholder="learner@example.com"
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none ring-blue-500 focus:ring-2"
                    />
                    <p
                      id="learner-sign-in-email-help"
                      className={`mt-2 text-sm leading-5 ${
                        showSignInEmailValidation
                          ? "text-red-700"
                          : "text-slate-500"
                      }`}
                    >
                      {showSignInEmailValidation
                        ? "Enter a valid email like learner@example.com."
                        : "Use the email that received the Stripe receipt."}
                    </p>
                    {signInRequestMessage && (
                      <p className="mt-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-900">
                        {signInRequestMessage}
                      </p>
                    )}
                    {signInRequestError && (
                      <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
                        {signInRequestError}
                      </p>
                    )}
                    <Button
                      className="mt-3 w-full"
                      disabled={isRequestingSignIn || !normalizedSignInEmail}
                      onClick={requestSignInLink}
                    >
                      {isRequestingSignIn
                        ? "Sending sign-in link..."
                        : "Send sign-in link"}
                    </Button>
                    <a
                      href="/checkout"
                      className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                    >
                      Review access options
                    </a>
                    {checkoutStatus?.tone === "success" && (
                      <a
                        href={supportHref}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                      >
                        <Mail className="h-4 w-4" />
                        Email support if access is missing
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="mt-1 h-5 w-5 text-blue-700" />
              <div>
                <h2 className="font-semibold">Skills Passport</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Track practice skills separately from online lesson progress.
                </p>
                <a
                  href="/skills-passport"
                  className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Open passport
                </a>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-start gap-3">
              <BriefcaseBusiness className="mt-1 h-5 w-5 text-blue-700" />
              <div>
                <h2 className="font-semibold">Career Toolkit</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Prepare resume language, interview answers, and job-search
                  next steps.
                </p>
                <a
                  href="/career-toolkit"
                  className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Open toolkit
                </a>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-start gap-3">
              <Compass className="mt-1 h-5 w-5 text-blue-700" />
              <div>
                <h2 className="font-semibold">Starting Path</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Take the onboarding assessment to frame your learning path.
                </p>
                <a
                  href="/onboarding"
                  className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Find your path
                </a>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-start gap-3">
              <Award className="mt-1 h-5 w-5 text-blue-700" />
              <div>
                <h2 className="font-semibold">Certificate Preview</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  See the completion language before it is used.
                </p>
                <a
                  href="/certificate-preview"
                  className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  View preview
                </a>
              </div>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Module progress</span>
              <span className="text-sm text-slate-600">{completePercent}%</span>
            </div>
            <Progress className="mt-3" value={completePercent} />
            {lessonProgressError && (
              <p className="mt-3 text-sm leading-6 text-amber-700">
                {lessonProgressError}
              </p>
            )}
          </Card>

          <Card className="overflow-hidden border-slate-200 bg-white text-slate-950 shadow-sm">
            {lessonList.length === 0 && (
              <div className="p-4 text-sm leading-6 text-slate-600">
                {lessonContentError ||
                  "Checking whether lesson content is available..."}
              </div>
            )}
            {lessonList.map(lesson => {
              const complete = progress.completedLessonIds.includes(lesson.id);
              const active = selectedLesson?.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  className={`flex w-full items-start gap-3 border-b px-4 py-4 text-left last:border-b-0 ${
                    active ? "bg-blue-50" : "bg-white hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedLessonId(lesson.id)}
                >
                  {complete ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                  ) : (
                    <BookOpen className="mt-1 h-5 w-5 text-blue-700" />
                  )}
                  <span>
                    <span className="block font-semibold">{lesson.title}</span>
                    <span className="text-sm text-slate-600">
                      {lesson.durationMinutes} minutes
                    </span>
                  </span>
                </button>
              );
            })}
          </Card>
        </aside>

        {!selectedLesson && (
          <article>
            <Card className="border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
              <h2 className="text-2xl font-bold">Lesson access required</h2>
              <p className="mt-3 leading-7">
                {lessonContentError ||
                  "We are checking your sign-in and enrollment before loading paid lesson content."}
              </p>
              <a href="/checkout">
                <Button className="mt-5">Review access options</Button>
              </a>
            </Card>
          </article>
        )}

        {selectedLesson && (
          <article className="space-y-6">
            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <p className="text-sm font-semibold text-blue-700">Lesson</p>
              <h2 className="mt-2 text-3xl font-bold">
                {selectedLesson.title}
              </h2>
              <p className="mt-3 text-lg text-slate-700">
                {selectedLesson.outcome}
              </p>
              <div className="mt-6 space-y-4">
                {selectedLesson.body.map(paragraph => (
                  <p key={paragraph} className="leading-7 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            <Card className="grid gap-4 border-slate-200 bg-white p-6 text-slate-950 shadow-sm md:grid-cols-2">
              <section>
                <h3 className="font-semibold">In the clinic</h3>
                <p className="mt-2 text-slate-700">
                  {selectedLesson.clinicContext}
                </p>
              </section>
              <section>
                <h3 className="font-semibold">Patient-friendly words</h3>
                <p className="mt-2 rounded-md bg-slate-100 p-3 text-slate-700">
                  {selectedLesson.patientFriendlyScript}
                </p>
              </section>
            </Card>

            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <h3 className="font-semibold">Common mistakes to avoid</h3>
              <ul className="mt-3 space-y-2">
                {selectedLesson.commonMistakes.map(mistake => (
                  <li key={mistake} className="flex gap-2 text-slate-700">
                    <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-600" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <h3 className="font-semibold">Scenario practice</h3>
              <p className="mt-2 text-slate-700">
                {selectedLesson.scenarioPrompt}
              </p>
              <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                {selectedLesson.scopeNote}
              </p>
            </Card>

            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <h3 className="font-semibold">Sources and review status</h3>
              <p className="mt-2 text-sm text-slate-600">
                Review: {selectedLesson.review.reviewStatus}. Reviewer:{" "}
                {selectedLesson.review.clinicalReviewer}.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedLesson.sources.map(source => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
                  >
                    {source.title}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </Card>

            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <h3 className="font-semibold">Module-linked extras</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                These optional reviewed materials support Module{" "}
                {moduleOne.moduleNumber}, but they are separate from required
                lesson completion. Use them when you want a quick reference, an
                overview, or deeper bonus context.
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {moduleStudyMaterials.groups.map(group => (
                  <section
                    key={group.category}
                    className="rounded-md border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start gap-2">
                      <Star className="mt-1 h-4 w-4 flex-shrink-0 text-blue-700" />
                      <div>
                        <h4 className="text-sm font-semibold">{group.label}</h4>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {group.materials.map(material => {
                        const MaterialIcon =
                          materialKindIconMap[material.kind] ?? FileText;

                        return (
                          <li
                            key={material.storageKey}
                            className="rounded-md bg-white p-3 text-sm"
                          >
                            <div className="flex items-start gap-2">
                              <MaterialIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {material.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {material.kind.toUpperCase()} source:{" "}
                                  {material.sourceFilename}
                                </p>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            </Card>

            <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
              <h3 className="font-semibold">Notebook study prompts</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Source notebook: {moduleStudyMaterials.studyNotes.notebookTitle}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <section>
                  <h4 className="text-sm font-semibold">Clinical pearls</h4>
                  <ul className="mt-2 space-y-2">
                    {moduleStudyMaterials.studyNotes.clinicalPearls.map(
                      pearl => (
                        <li key={pearl} className="flex gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
                          <span>{pearl}</span>
                        </li>
                      )
                    )}
                  </ul>
                </section>
                <section>
                  <h4 className="text-sm font-semibold">Review prompts</h4>
                  <ul className="mt-2 space-y-2">
                    {moduleStudyMaterials.studyNotes.reviewPrompts.map(
                      prompt => (
                        <li key={prompt} className="flex gap-2 text-sm">
                          <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
                          <span>{prompt}</span>
                        </li>
                      )
                    )}
                  </ul>
                </section>
              </div>
            </Card>

            <Button className="w-full md:w-auto" onClick={completeLesson}>
              Mark lesson complete
            </Button>
          </article>
        )}
      </div>
    </main>
  );
}

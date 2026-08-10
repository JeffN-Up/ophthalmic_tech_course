import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  HelpCircle,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  createMailtoHref,
  customPracticeInquiryOffer,
  formatOfferPrice,
  practicePackOffers,
} from "@shared/commerce/offers";
import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";
import {
  calculatePracticeValueEstimate,
  formatPracticeValueCurrency,
} from "@shared/commerce/practiceValueCalculator";
import { buyerSupportContact } from "@shared/commerce/policies";
import { getCheckoutStatus } from "@/lib/checkoutStatus";
import {
  buyerConfidenceAnswers,
  foundingReleaseStatus,
  practiceBuyerHandoffSteps,
  practiceBuyerSalesPath,
  practiceValueProofPoints,
  purchaseAssurances,
} from "@shared/commerce/salesReadiness";
import { useEffect, useState } from "react";
import {
  createCheckoutSession,
  fetchCheckoutAvailability,
  type CheckoutAvailabilityReport,
} from "@/lib/checkoutClient";
import { submitPracticeInquiry } from "@/lib/practiceInquiryClient";

interface PracticeInquiryFormState {
  practiceName: string;
  contactName: string;
  contactEmail: string;
  estimatedLearnerCount: string;
  targetTimeline: string;
  message: string;
}

const emptyPracticeInquiryForm: PracticeInquiryFormState = {
  practiceName: "",
  contactName: "",
  contactEmail: "",
  estimatedLearnerCount: "",
  targetTimeline: "",
  message: "",
};

export default function PracticePacks() {
  const [emailByOfferId, setEmailByOfferId] = useState<Record<string, string>>(
    {}
  );
  const [acceptedTermsByOfferId, setAcceptedTermsByOfferId] = useState<
    Record<string, boolean>
  >({});
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutAvailability, setCheckoutAvailability] =
    useState<CheckoutAvailabilityReport | null>(null);
  const [practiceInquiryForm, setPracticeInquiryForm] =
    useState<PracticeInquiryFormState>(emptyPracticeInquiryForm);
  const [practiceInquiryStatus, setPracticeInquiryStatus] = useState<
    "idle" | "submitting" | "sent"
  >("idle");
  const [practiceInquiryMessage, setPracticeInquiryMessage] = useState<
    string | null
  >(null);
  const [practiceValueLearners, setPracticeValueLearners] = useState("6");
  const [practiceValueHourlyCost, setPracticeValueHourlyCost] = useState("45");
  const [practiceValueHoursSaved, setPracticeValueHoursSaved] = useState("3");
  const checkoutStatus =
    typeof window === "undefined"
      ? null
      : getCheckoutStatus(window.location.search);
  const checkoutUnavailable = checkoutAvailability?.ready === false;
  const practiceValueEstimate = calculatePracticeValueEstimate({
    learnerCount: Number(practiceValueLearners),
    supervisorHourlyCost: Number(practiceValueHourlyCost),
    estimatedHoursSavedPerLearner: Number(practiceValueHoursSaved),
  });
  const manualPaymentLinksByOfferId: Record<string, string | undefined> = {
    "practice-six-seat-pack":
      checkoutAvailability?.manualPaymentLinks.practiceSixSeatPack,
    "practice-fifteen-seat-pack":
      checkoutAvailability?.manualPaymentLinks.practiceFifteenSeatPack,
  };

  useEffect(() => {
    let isMounted = true;

    fetchCheckoutAvailability()
      .then(availability => {
        if (!isMounted) return;
        setCheckoutAvailability(availability);
      })
      .catch(() => {
        if (!isMounted) return;
        setCheckoutAvailability(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const startCheckout = async (offerId: string) => {
    setActiveOfferId(offerId);
    setCheckoutError(null);

    try {
      const { url } = await createCheckoutSession({
        email: emailByOfferId[offerId] ?? "",
        offerId,
        acceptedTerms: Boolean(acceptedTermsByOfferId[offerId]),
      });

      window.location.href = url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Practice checkout could not start. Please try again."
      );
    } finally {
      setActiveOfferId(null);
    }
  };
  const getOfferEmailState = (offerId: string) => {
    const email = emailByOfferId[offerId] ?? "";
    const normalizedEmail = normalizeCheckoutEmail(email);

    return {
      email,
      normalizedEmail,
      showEmailValidation: email.trim().length > 0 && !normalizedEmail,
    };
  };
  const updatePracticeInquiryField = (
    field: keyof PracticeInquiryFormState,
    value: string
  ) => {
    setPracticeInquiryForm(current => ({
      ...current,
      [field]: value,
    }));
  };
  const handlePracticeInquirySubmit = async () => {
    setPracticeInquiryStatus("submitting");
    setPracticeInquiryMessage(null);

    try {
      const result = await submitPracticeInquiry({
        inquiry: {
          practiceName: practiceInquiryForm.practiceName,
          contactName: practiceInquiryForm.contactName,
          contactEmail: practiceInquiryForm.contactEmail,
          estimatedLearnerCount: Number(
            practiceInquiryForm.estimatedLearnerCount
          ),
          targetTimeline: practiceInquiryForm.targetTimeline,
          message: practiceInquiryForm.message,
        },
      });

      setPracticeInquiryStatus("sent");
      setPracticeInquiryForm(emptyPracticeInquiryForm);
      setPracticeInquiryMessage(
        result.notificationSent
          ? "Inquiry received. Jeff has been notified."
          : "Inquiry received. Jeff can review it from the protected inquiry list."
      );
    } catch (error) {
      setPracticeInquiryStatus("idle");
      setPracticeInquiryMessage(
        error instanceof Error
          ? error.message
          : "Practice inquiry could not be sent."
      );
    }
  };
  const customPracticeHref = createMailtoHref({
    email: customPracticeInquiryOffer.contactEmail,
    subject: customPracticeInquiryOffer.subject,
    body: customPracticeInquiryOffer.emailBody,
  });
  const supportHref = createMailtoHref({
    email: buyerSupportContact.email,
    subject: buyerSupportContact.subject,
    body: buyerSupportContact.emailBody,
  });

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
          <div className="mt-6 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-700" />
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Practice onboarding
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">
                Train new ophthalmic team members with a shared foundation
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-600">
            Practice packs help managers give new hires the same vocabulary,
            safety expectations, and supervisor-ready Skills Passport while
            keeping hands-on verification inside the clinic where it belongs.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px]">
        <section className="grid gap-5 md:grid-cols-2">
          {checkoutStatus && (
            <Card
              className={`border p-5 shadow-sm md:col-span-2 ${
                checkoutStatus.tone === "success"
                  ? "border-green-200 bg-green-50 text-green-950"
                  : "border-blue-200 bg-blue-50 text-blue-950"
              }`}
            >
              <h2 className="text-xl font-bold">{checkoutStatus.title}</h2>
              <p className="mt-2 leading-7">{checkoutStatus.message}</p>
              <ul className="mt-3 space-y-1 text-sm leading-6">
                {checkoutStatus.nextSteps.map(step => (
                  <li key={step} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <a
                href={checkoutStatus.action.href}
                className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${
                  checkoutStatus.tone === "success"
                    ? "text-green-800 hover:text-green-950"
                    : "text-blue-800 hover:text-blue-950"
                }`}
              >
                {checkoutStatus.action.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Card>
          )}

          {checkoutAvailability && (
            <Card
              className={`border p-5 shadow-sm md:col-span-2 ${
                checkoutAvailability.ready
                  ? "border-green-200 bg-green-50 text-green-950"
                  : "border-amber-200 bg-amber-50 text-amber-950"
              }`}
            >
              <h2 className="text-xl font-bold">
                {checkoutAvailability.title}
              </h2>
              <p className="mt-2 leading-7">{checkoutAvailability.message}</p>
              {!checkoutAvailability.ready && (
                <a
                  href="#practice-inquiry"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-950"
                >
                  Start a practice conversation instead
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </Card>
          )}

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold">
              What buying for a practice looks like
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {practiceBuyerSalesPath.map(section => (
                <section
                  key={section.title}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-semibold">{section.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {section.items.map(item => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </Card>

          <Card className="border-blue-100 bg-blue-50 p-6 text-blue-950 shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold">Purchase confidence</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {purchaseAssurances.map(item => (
                <section
                  key={item.title}
                  className="rounded-md border border-blue-100 bg-white p-4"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </section>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold">After-payment handoff</h2>
            <p className="mt-3 leading-7 text-slate-600">
              This keeps the practice purchase connected to real onboarding
              steps after Stripe confirms the payment.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {practiceBuyerHandoffSteps.map((step, index) => (
                <section
                  key={step.title}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-blue-700">
                    Handoff {index + 1}
                  </p>
                  <h3 className="mt-2 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </section>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm md:col-span-2">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-blue-700" />
              <h2 className="text-2xl font-bold">
                Questions managers ask first
              </h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {buyerConfidenceAnswers.map(answer => (
                <section
                  key={answer.question}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-semibold">{answer.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {answer.answer}
                  </p>
                </section>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold">Founding release status</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {foundingReleaseStatus.map(item => (
                <section
                  key={item.title}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </section>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold">
              Why managers use a practice pack
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {practiceValueProofPoints.map(point => (
                <section
                  key={point.title}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-semibold">{point.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {point.description}
                  </p>
                </section>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6 text-slate-950 shadow-sm md:col-span-2">
            <div className="flex items-start gap-3">
              <Calculator className="mt-1 h-7 w-7 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  Practice value planner
                </p>
                <h2 className="text-2xl font-bold">
                  Estimate the training time a shared foundation may protect
                </h2>
                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                  This is a planning estimate, not a promise. Use your own
                  numbers to compare seat-pack cost against supervisor time that
                  may be spent repeating basic vocabulary, clinic flow, and
                  onboarding expectations.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <label className="block text-sm font-semibold text-slate-700">
                Learners to onboard
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={practiceValueLearners}
                  onChange={event =>
                    setPracticeValueLearners(event.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none ring-blue-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Supervisor hourly cost
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={practiceValueHourlyCost}
                  onChange={event =>
                    setPracticeValueHourlyCost(event.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none ring-blue-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Basic-training hours saved per learner
                <input
                  type="number"
                  min="0"
                  max="80"
                  step="0.5"
                  value={practiceValueHoursSaved}
                  onChange={event =>
                    setPracticeValueHoursSaved(event.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none ring-blue-500 focus:ring-2"
                />
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-600">
                  Estimated supervisor time value
                </h3>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {formatPracticeValueCurrency(
                    practiceValueEstimate.estimatedSupervisorTimeValue
                  )}
                </p>
              </section>
              <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-600">
                  Suggested next step
                </h3>
                <p className="mt-2 text-lg font-bold text-slate-950">
                  {practiceValueEstimate.recommendedOffer
                    ? practiceValueEstimate.recommendedOffer.name
                    : "Custom practice conversation"}
                </p>
              </section>
              <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-600">
                  Planning comparison
                </h3>
                <p className="mt-2 text-lg font-bold text-slate-950">
                  {practiceValueEstimate.recommendedOffer
                    ? `${formatPracticeValueCurrency(
                        practiceValueEstimate.estimatedNetPlanningValue
                      )} after pack cost`
                    : "Ask about a larger rollout"}
                </p>
              </section>
            </div>

            {practiceValueEstimate.recommendedOffer && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <section className="rounded-md border border-blue-100 bg-blue-50 p-4">
                  <h3 className="text-sm font-semibold text-blue-900">
                    Estimated cost per learner
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-blue-950">
                    {formatPracticeValueCurrency(
                      practiceValueEstimate.estimatedCostPerLearner ?? 0
                    )}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-900">
                    Based on the selected learner count and the suggested pack
                    price.
                  </p>
                </section>
                <section className="rounded-md border border-blue-100 bg-blue-50 p-4">
                  <h3 className="text-sm font-semibold text-blue-900">
                    Unused seats in suggested pack
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-blue-950">
                    {practiceValueEstimate.unusedSeatCount}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-blue-900">
                    Extra seats can help if another learner joins the same
                    onboarding group.
                  </p>
                </section>
              </div>
            )}

            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
              This tool estimates possible planning value only. It does not
              guarantee saved time, staffing outcomes, employee retention,
              competency, certification, exam results, or revenue.
            </p>
          </Card>

          {practicePackOffers.map(offer =>
            (() => {
              const { email, normalizedEmail, showEmailValidation } =
                getOfferEmailState(offer.id);
              const acceptedTerms = Boolean(acceptedTermsByOfferId[offer.id]);
              const emailHelpId = `${offer.id}-email-help`;
              const manualPaymentLink = manualPaymentLinksByOfferId[offer.id];
              const canUseManualPaymentLink =
                checkoutUnavailable &&
                Boolean(manualPaymentLink) &&
                Boolean(normalizedEmail) &&
                acceptedTerms;

              return (
                <Card
                  key={offer.id}
                  className="flex flex-col border-slate-200 bg-white p-6 text-slate-950 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        {offer.seatCount} learner seats
                      </p>
                      <h2 className="mt-2 text-2xl font-bold">{offer.name}</h2>
                    </div>
                    <Users className="h-8 w-8 flex-shrink-0 text-blue-700" />
                  </div>

                  <p className="mt-4 leading-7 text-slate-600">
                    {offer.description}
                  </p>
                  <p className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-950">
                    {offer.idealFor}
                  </p>

                  <div className="mt-6">
                    <span className="text-4xl font-bold">
                      {formatOfferPrice(offer)}
                    </span>
                    <span className="ml-2 text-slate-500">one-time</span>
                  </div>

                  <section className="mt-6">
                    <h3 className="font-semibold">Included</h3>
                    <ul className="mt-3 space-y-2">
                      {offer.includes.map(item => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm text-slate-700"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="mt-6">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <ShieldCheck className="h-4 w-4 text-amber-700" />
                      Clear limits
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {offer.limitations.map(item => (
                        <li
                          key={item}
                          className="text-sm leading-6 text-slate-700"
                        >
                          - {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <label className="block text-sm font-semibold text-slate-700">
                      Billing email
                    </label>
                    <input
                      type="email"
                      required
                      aria-invalid={showEmailValidation}
                      aria-describedby={emailHelpId}
                      value={email}
                      onChange={event =>
                        setEmailByOfferId(current => ({
                          ...current,
                          [offer.id]: event.target.value,
                        }))
                      }
                      placeholder="manager@example.com"
                      className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 outline-none ring-blue-500 focus:ring-2"
                    />
                    <p
                      id={emailHelpId}
                      className={`mt-2 text-sm leading-5 ${
                        showEmailValidation ? "text-red-700" : "text-slate-500"
                      }`}
                    >
                      {showEmailValidation
                        ? "Enter a valid email like manager@example.com."
                        : "We use this email for the receipt and seat setup."}
                    </p>
                    <label className="mt-4 flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={event =>
                          setAcceptedTermsByOfferId(current => ({
                            ...current,
                            [offer.id]: event.target.checked,
                          }))
                        }
                        className="mt-1 h-4 w-4 flex-shrink-0"
                      />
                      <span>
                        I reviewed the practice-pack terms, refund policy,
                        privacy expectations, and course limits. I understand
                        supervisors remain responsible for local protocols and
                        hands-on competency signoff.
                      </span>
                    </label>
                    <Button
                      className="mt-4 w-full bg-blue-700 text-white hover:bg-blue-800"
                      disabled={
                        activeOfferId === offer.id ||
                        !normalizedEmail ||
                        !acceptedTerms ||
                        checkoutUnavailable
                      }
                      onClick={() => startCheckout(offer.id)}
                    >
                      {activeOfferId === offer.id
                        ? "Starting checkout..."
                        : checkoutUnavailable
                          ? "Enrollment not open yet"
                          : "Buy with Stripe"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {checkoutUnavailable && manualPaymentLink && (
                      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                        <p className="font-semibold">
                          Approved first-buyer payment link
                        </p>
                        <p className="mt-1">
                          Automated seat setup is still paused. Use this only if
                          Jeff has approved manual fulfillment for this practice
                          pack.
                        </p>
                        <Button
                          className="mt-3 w-full bg-amber-700 text-white hover:bg-amber-800"
                          disabled={!canUseManualPaymentLink}
                          onClick={() => {
                            window.location.href = manualPaymentLink;
                          }}
                        >
                          Open manual Stripe payment link
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        {!canUseManualPaymentLink && (
                          <p className="mt-2 text-xs leading-5">
                            Enter the billing email and accept the practice-pack
                            terms before opening the payment link.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })()
          )}
        </section>

        <aside>
          <Card className="sticky top-6 border-slate-200 bg-white p-6 text-slate-950 shadow-sm">
            <h2 className="text-2xl font-bold">Employer purchase path</h2>
            {checkoutError && (
              <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {checkoutError}
              </p>
            )}
            <p className="mt-3 leading-7 text-slate-600">
              Teams can purchase a pack directly through Stripe, then use a
              short setup conversation to confirm learner seats, supervisor
              expectations, and practice-specific onboarding needs.
            </p>
            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
              <p>- Confirm number of learner seats.</p>
              <p>- Identify the practice lead or supervisor.</p>
              <p>- Align Skills Passport use with local policy.</p>
              <p>
                - Keep practice-specific workflows out of the national core.
              </p>
            </div>
            <a
              href="#practice-inquiry"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Ask about custom setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-center text-sm leading-6 text-slate-600">
              Seat management is available after purchase through the protected
              practice setup process.
            </p>
            <a
              href="/policies"
              className="mt-4 block text-center text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Review course policies
            </a>
            <a
              href="/buyer-guide"
              className="mt-4 block text-center text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Open buyer guide
            </a>
            <a
              href={supportHref}
              className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              <Mail className="h-4 w-4" />
              Need purchase help?
            </a>
          </Card>
        </aside>
      </div>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Larger practice or Spindel pilot rollout
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {customPracticeInquiryOffer.name}
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              {customPracticeInquiryOffer.description}
            </p>
            <p className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-950">
              {customPracticeInquiryOffer.idealFor}
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <section>
                <h3 className="font-semibold">Good topics</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {customPracticeInquiryOffer.includes.map(item => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-semibold">Next steps</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {customPracticeInquiryOffer.nextSteps.map(item => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-semibold">Clear limits</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {customPracticeInquiryOffer.limitations.map(item => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
          <Card
            id="practice-inquiry"
            className="border-slate-200 bg-slate-50 p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold">Need more than 15 seats?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Send a short inquiry before buying.
            </p>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Practice name
                <input
                  value={practiceInquiryForm.practiceName}
                  onChange={event =>
                    updatePracticeInquiryField(
                      "practiceName",
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none ring-blue-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Primary contact
                <input
                  value={practiceInquiryForm.contactName}
                  onChange={event =>
                    updatePracticeInquiryField(
                      "contactName",
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none ring-blue-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Contact email
                <input
                  type="email"
                  value={practiceInquiryForm.contactEmail}
                  onChange={event =>
                    updatePracticeInquiryField(
                      "contactEmail",
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none ring-blue-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Estimated learners
                <input
                  type="number"
                  min="1"
                  value={practiceInquiryForm.estimatedLearnerCount}
                  onChange={event =>
                    updatePracticeInquiryField(
                      "estimatedLearnerCount",
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none ring-blue-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Timeline
                <input
                  value={practiceInquiryForm.targetTimeline}
                  onChange={event =>
                    updatePracticeInquiryField(
                      "targetTimeline",
                      event.target.value
                    )
                  }
                  placeholder="Example: next hiring class"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none ring-blue-500 focus:ring-2"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Onboarding need
                <textarea
                  value={practiceInquiryForm.message}
                  onChange={event =>
                    updatePracticeInquiryField("message", event.target.value)
                  }
                  rows={5}
                  className="mt-2 w-full resize-y rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none ring-blue-500 focus:ring-2"
                />
              </label>
            </div>
            {practiceInquiryMessage && (
              <p
                className={`mt-4 rounded-md border p-3 text-sm leading-6 ${
                  practiceInquiryStatus === "sent"
                    ? "border-green-200 bg-green-50 text-green-900"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {practiceInquiryMessage}
              </p>
            )}
            <Button
              className="mt-5 w-full bg-blue-700 text-white hover:bg-blue-800"
              disabled={practiceInquiryStatus === "submitting"}
              onClick={handlePracticeInquirySubmit}
            >
              {practiceInquiryStatus === "submitting"
                ? "Sending inquiry..."
                : "Start practice conversation"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a
              href={customPracticeHref}
              className="mt-4 block text-center text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Use email instead
            </a>
          </Card>
        </div>
      </section>
    </main>
  );
}

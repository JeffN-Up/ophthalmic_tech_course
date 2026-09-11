import { Card } from "@/components/ui/card";
import {
  Award,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FileBadge2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { curriculumModules } from "@/data/curriculum";
import { Button } from "@/components/ui/button";
import {
  formatOfferPrice,
  foundingLearnerOffer,
  practicePackOffers,
} from "@shared/commerce/offers";
import { buyerConfidenceAnswers } from "@shared/commerce/salesReadiness";
import { useEffect, useState } from "react";
import {
  fetchCheckoutAvailability,
  type CheckoutAvailabilityReport,
} from "@/lib/checkoutClient";

export default function Home() {
  const [checkoutAvailability, setCheckoutAvailability] =
    useState<CheckoutAvailabilityReport | null>(null);
  const [checkoutAvailabilityFailed, setCheckoutAvailabilityFailed] =
    useState(false);
  const curriculumDays = curriculumModules.map(module => ({
    day: `Day ${module.day}`,
    title: module.title,
    description: module.description,
    icon: module.icon,
  }));

  const pricingTiers = [
    {
      id: "standard",
      name: "Ophthalmic Technician Foundations",
      price: formatOfferPrice(foundingLearnerOffer),
      description:
        "Founding learner access to the self-paced foundations course",
      features: foundingLearnerOffer.includes,
      cta: "Enroll Now",
      highlighted: true,
    },
  ];

  const starterPracticePack = practicePackOffers[0];
  const checkoutReady = checkoutAvailability?.ready === true;
  const checkoutPaused = checkoutAvailability?.ready === false;
  const individualCheckoutHref = checkoutReady
    ? "/checkout"
    : "/checkout#learner-interest";
  const practiceCheckoutHref = checkoutReady
    ? "/practice-packs"
    : "/practice-packs#practice-inquiry";
  const individualCtaLabel = checkoutReady
    ? "Buy for Myself"
    : "Join Learner Interest";
  const practiceCtaLabel = checkoutReady
    ? "Buy for My Practice"
    : "Start Practice Inquiry";
  const heroStatusTitle =
    checkoutAvailability?.title ??
    (checkoutAvailabilityFailed
      ? "Enrollment status could not load"
      : "Checking enrollment status");
  const heroStatusMessage =
    checkoutAvailability?.message ??
    (checkoutAvailabilityFailed
      ? "Use the buyer guide or free preview first. If you are ready to start, open the checkout page and join the interest list."
      : "The page is checking whether checkout, manual first-buyer links, or the interest list should be the safest next step.");
  const heroStatusTone = checkoutReady
    ? "border-green-400/40 bg-green-400/10 text-green-100"
    : checkoutPaused
      ? "border-amber-300/40 bg-amber-300/10 text-amber-100"
      : "border-white/15 bg-white/10 text-gray-100";

  useEffect(() => {
    let isMounted = true;

    fetchCheckoutAvailability()
      .then(availability => {
        if (!isMounted) return;
        setCheckoutAvailability(availability);
        setCheckoutAvailabilityFailed(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setCheckoutAvailability(null);
        setCheckoutAvailabilityFailed(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    { number: "10", label: "Planned modules" },
    { number: "3", label: "Module 1 starter lessons" },
    { number: "80%", label: "Target passing score" },
    { number: "12 mo", label: "Founding learner access" },
  ];

  const supportResources = [
    {
      href: "/skills-passport",
      icon: CheckCircle2,
      title: "Skills Passport",
      description:
        "Show learners and supervisors how online study connects to future observed practice without claiming hands-on competency.",
    },
    {
      href: "/career-toolkit",
      icon: BriefcaseBusiness,
      title: "Career Toolkit",
      description:
        "Help career changers and medical assistants explain their learning path clearly when preparing for eye-care roles.",
    },
    {
      href: "/certificate-preview",
      icon: FileBadge2,
      title: "Certificate Preview",
      description:
        "Let buyers see what completion recognition looks like while keeping the limits honest and easy to understand.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-dark border-b border-white/10 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              OptiTech Academy
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/first-sale"
              className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              First Sale
            </a>
            <a
              href="/buyer-guide"
              className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              Buyer Guide
            </a>
            <a
              href="/preview"
              className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              Free Preview
            </a>
            <a
              href="#curriculum"
              className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              Curriculum
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              Pricing
            </a>
            <a
              href="/practice-packs"
              className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              Practice Packs
            </a>
            <a
              href="/policies"
              className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              Policies
            </a>
            <a
              href="#why"
              className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
            >
              Why Us
            </a>
          </div>
          <a href="#pricing">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
              Get Started
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 glass-dark px-4 py-2 w-fit">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300">
                  Founding learner preview now open
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                  Build Eye-Care
                </span>
                <br />
                <span className="text-white">Foundations</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Build the vocabulary, habits, and supervised practice plan
                needed to begin training for an ophthalmic assistant or
                technician role.
              </p>
              <div className="grid gap-4 pt-4 sm:grid-cols-2">
                <a href="/first-sale">
                  <Button
                    size="lg"
                    className="w-full bg-white text-slate-950 hover:bg-slate-200 text-base"
                  >
                    Start Here <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a href={individualCheckoutHref}>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 text-base"
                  >
                    {individualCtaLabel} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a href={practiceCheckoutHref}>
                  <Button
                    size="lg"
                    className="w-full glass-dark text-white border border-white/20 hover:bg-white/10 text-base"
                  >
                    {practiceCtaLabel}
                    <Building2 className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a href="/buyer-guide">
                  <Button
                    size="lg"
                    className="w-full glass-dark text-white border border-white/20 hover:bg-white/10 text-base"
                  >
                    Buyer Guide
                  </Button>
                </a>
                <a href="/curriculum">
                  <Button
                    size="lg"
                    className="w-full glass-dark text-white border border-white/20 hover:bg-white/10 text-base"
                  >
                    View Curriculum
                  </Button>
                </a>
                <a href="/preview">
                  <Button
                    size="lg"
                    className="w-full glass-dark text-white border border-white/20 hover:bg-white/10 text-base"
                  >
                    Try Free Preview
                  </Button>
                </a>
                <a href="/spindel-onboarding">
                  <Button
                    size="lg"
                    className="w-full glass-dark text-white border border-blue-300/30 hover:bg-blue-300/10 text-base"
                  >
                    Spindel Staff Onboarding
                    <Building2 className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-2 text-green-400 pt-4">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Completion is education, not certification
                </span>
              </div>
              <div
                className={`rounded-md border p-4 text-sm leading-6 ${heroStatusTone}`}
              >
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{heroStatusTitle}</p>
                    <p className="mt-1 opacity-90">{heroStatusMessage}</p>
                    {checkoutPaused && (
                      <a
                        href={individualCheckoutHref}
                        className="mt-3 inline-flex items-center gap-2 font-semibold text-white hover:text-cyan-100"
                      >
                        Go to the safest next step
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10">
              <div className="grid gap-4">
                <a
                  href={individualCheckoutHref}
                  className="glass-card block p-6 transition-all hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-cyan-300">
                        Individual learners
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-white">
                        Start a new ophthalmic career path
                      </h2>
                    </div>
                    <Users className="h-8 w-8 flex-shrink-0 text-cyan-300" />
                  </div>
                  <p className="mt-4 text-gray-300">
                    Self-paced access for career changers, medical assistants,
                    and new technicians who want practical clinic vocabulary and
                    more confident onboarding conversations.
                  </p>
                  <div className="mt-5 flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">
                      {formatOfferPrice(foundingLearnerOffer)}
                    </span>
                    <span className="pb-1 text-sm text-gray-400">one-time</span>
                  </div>
                </a>

                <a
                  href={practiceCheckoutHref}
                  className="glass-card block p-6 transition-all hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-cyan-300">
                        Practices and managers
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-white">
                        Give new hires a shared foundation
                      </h2>
                    </div>
                    <Building2 className="h-8 w-8 flex-shrink-0 text-cyan-300" />
                  </div>
                  <p className="mt-4 text-gray-300">
                    Seat packs help practices onboard multiple learners with the
                    same core lessons, Skills Passport language, and
                    supervisor-led follow-up.
                  </p>
                  <div className="mt-5 flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">
                      {formatOfferPrice(starterPracticePack)}
                    </span>
                    <span className="pb-1 text-sm text-gray-400">
                      starts at {starterPracticePack.seatCount} seats
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section id="curriculum" className="relative z-10 py-20 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                10-Day Foundations Path
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              A planned foundations path built from Bootcamp source materials,
              with published content released as review gates are completed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {curriculumDays.map((day, idx) => (
              <div
                key={idx}
                className="glass-card p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-blue-400 font-bold mb-2">{day.day}</div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                  {day.title}
                </h3>
                <p className="text-gray-400 text-sm">{day.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/curriculum">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
              >
                View Full Curriculum
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-gray-300 text-lg">
              Founding access to the published course content and planned future
              releases
            </p>
          </div>

          <div className="flex justify-center max-w-2xl mx-auto">
            {pricingTiers.map(tier => (
              <Card
                key={tier.id}
                className="relative p-8 border-2 transition-all w-full max-w-md glass-card border-blue-500/50 hover:border-blue-400"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Founding Access
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4">{tier.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {tier.price}
                  </span>
                  <span className="text-gray-400 ml-2">one-time</span>
                </div>
                <a href={individualCheckoutHref}>
                  <Button className="w-full mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0">
                    {checkoutReady ? tier.cta : "Join Interest List"}
                  </Button>
                </a>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why" className="relative z-10 py-20 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Why Choose OptiTech Academy?
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Self-Paced Learning",
                desc: "Learn at your own pace with 12 months of founding learner access",
              },
              {
                icon: Award,
                title: "Completion Certificate",
                desc: "Receive a certificate of completion for finished published content",
              },
              {
                icon: Users,
                title: "Practice-Informed Content",
                desc: "Built from ophthalmic bootcamp materials and reviewed before release",
              },
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-8">
                <item.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learner Support Resources */}
      <section className="relative z-10 py-20 px-4">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Built-In Support For Starting Out
              </span>
            </h2>
            <p className="text-gray-300 text-lg">
              Extra tools help learners, supervisors, and managers connect the
              course to real onboarding conversations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {supportResources.map(resource => (
              <a
                key={resource.href}
                href={resource.href}
                className="glass-card block p-8 transition-all hover:bg-white/10"
              >
                <resource.icon className="h-10 w-10 text-cyan-300" />
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {resource.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-300">
                  {resource.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
                  Open resource
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Confidence Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Questions Buyers Ask First
              </span>
            </h2>
            <p className="text-gray-300 text-lg">
              Clear answers for learners, managers, and supervisors before
              checkout.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {buyerConfidenceAnswers.map(answer => (
              <Card key={answer.question} className="glass-card p-6">
                <h3 className="text-xl font-semibold text-white">
                  {answer.question}
                </h3>
                <p className="mt-3 leading-7 text-gray-300">{answer.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container">
          <div className="glass-card p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Building Ophthalmic Foundations?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join the founding learner group and help shape a practical, honest
              training path for new ophthalmic techs
            </p>
            <a href={individualCheckoutHref}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 text-base"
              >
                {checkoutReady ? "Start Learning Today" : "Join Interest List"}{" "}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a
              href="/preview"
              className="ml-0 mt-3 inline-flex md:ml-3 md:mt-0"
            >
              <Button
                size="lg"
                className="glass-dark text-white border border-white/20 hover:bg-white/10 text-base"
              >
                Preview a Lesson
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

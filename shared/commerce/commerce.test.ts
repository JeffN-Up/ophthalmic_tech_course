import { describe, expect, it } from "vitest";
import { normalizeCheckoutEmail } from "./checkoutEmail";
import {
  createMailtoHref,
  customPracticeInquiryOffer,
  foundingLearnerOffer,
  practicePackOffers,
} from "./offers";
import { buyerSupportContact, commercePolicies } from "./policies";

describe("normalizeCheckoutEmail", () => {
  it("normalizes valid buyer emails for checkout and access records", () => {
    expect(normalizeCheckoutEmail(" Learner@Example.COM ")).toBe(
      "learner@example.com"
    );
  });

  it("rejects missing or invalid buyer emails", () => {
    expect(normalizeCheckoutEmail(undefined)).toBeNull();
    expect(normalizeCheckoutEmail("")).toBeNull();
    expect(normalizeCheckoutEmail("not-an-email")).toBeNull();
    expect(normalizeCheckoutEmail("learner@example")).toBeNull();
  });
});

describe("foundingLearnerOffer", () => {
  it("uses the approved founding learner price and access period", () => {
    expect(foundingLearnerOffer.id).toBe("founding-learner");
    expect(foundingLearnerOffer.priceCents).toBe(29900);
    expect(foundingLearnerOffer.currency).toBe("usd");
    expect(foundingLearnerOffer.accessMonths).toBe(12);
  });

  it("does not promise certification, employment, or hands-on verification", () => {
    const combined = [
      foundingLearnerOffer.description,
      ...foundingLearnerOffer.includes,
      ...foundingLearnerOffer.limitations,
    ].join(" ");

    expect(combined).toMatch(/not certification/i);
    expect(combined).toMatch(/does not guarantee employment/i);
    expect(combined).toMatch(/does not verify hands-on/i);
  });
});

describe("practicePackOffers", () => {
  it("defines the approved employer seat packs", () => {
    expect(practicePackOffers.map(offer => offer.id)).toEqual([
      "practice-six-seat-pack",
      "practice-fifteen-seat-pack",
    ]);
    expect(practicePackOffers[0].seatCount).toBe(6);
    expect(practicePackOffers[0].priceCents).toBe(99900);
    expect(practicePackOffers[1].seatCount).toBe(15);
    expect(practicePackOffers[1].priceCents).toBe(179900);
  });

  it("keeps employer offers honest about supervision and competency", () => {
    const combined = practicePackOffers
      .flatMap(offer => [
        offer.description,
        ...offer.includes,
        ...offer.limitations,
      ])
      .join(" ");

    expect(combined).toMatch(/supervisor/i);
    expect(combined).toMatch(/does not independently verify/i);
    expect(combined).not.toMatch(/guaranteed competency/i);
  });
});

describe("customPracticeInquiryOffer", () => {
  it("gives larger practices a clear next step without bypassing checkout terms", () => {
    expect(customPracticeInquiryOffer.id).toBe("custom-practice-onboarding");
    expect(customPracticeInquiryOffer.contactEmail).toContain("@");
    expect(customPracticeInquiryOffer.subject).toMatch(/custom practice/i);
    expect(customPracticeInquiryOffer.emailBody).toMatch(/Practice name/i);
    expect(customPracticeInquiryOffer.emailBody).toMatch(/learner count/i);
    expect(customPracticeInquiryOffer.emailBody).toMatch(
      /larger custom quote/i
    );
    expect(customPracticeInquiryOffer.nextSteps.join(" ")).toMatch(
      /larger custom quote/i
    );
  });

  it("keeps custom practice language honest about supervision and agreements", () => {
    const combined = [
      customPracticeInquiryOffer.description,
      customPracticeInquiryOffer.idealFor,
      ...customPracticeInquiryOffer.includes,
      ...customPracticeInquiryOffer.nextSteps,
      ...customPracticeInquiryOffer.limitations,
    ].join(" ");

    expect(combined).toMatch(/separate written agreement/i);
    expect(combined).toMatch(/employer supervision/i);
    expect(combined).not.toMatch(/guarantee/i);
  });

  it("builds a safe prefilled inquiry email link", () => {
    const href = createMailtoHref({
      email: customPracticeInquiryOffer.contactEmail,
      subject: customPracticeInquiryOffer.subject,
      body: customPracticeInquiryOffer.emailBody,
    });

    expect(href).toContain("mailto:jeff.chapin@spindeleye.com");
    expect(href).toContain("subject=OptiTech+custom+practice+onboarding");
    expect(href).toContain("body=");
    expect(decodeURIComponent(href)).toContain("Practice name:");
    expect(decodeURIComponent(href)).toContain("Approximate learner count:");
    expect(decodeURIComponent(href)).not.toMatch(/patient/i);
    expect(decodeURIComponent(href)).not.toMatch(/card number/i);
  });
});

describe("commercePolicies", () => {
  it("contains all public policy sections required before purchase", () => {
    expect(commercePolicies.map(policy => policy.slug)).toEqual([
      "educational-limitations",
      "refund-policy",
      "privacy-summary",
      "terms-summary",
      "practice-pack-terms",
      "support-expectations",
    ]);
  });

  it("keeps policy sections learner-facing and non-empty", () => {
    for (const policy of commercePolicies) {
      expect(policy.title.length).toBeGreaterThan(8);
      expect(policy.body.length).toBeGreaterThan(120);
      expect(policy.body).not.toMatch(/legal advice/i);
    }
  });

  it("sets buyer expectations for privacy, practice packs, and support", () => {
    const combinedPolicies = commercePolicies
      .map(policy => policy.body)
      .join(" ");

    expect(combinedPolicies).toMatch(/protected health information/i);
    expect(combinedPolicies).toMatch(/should not be shared/i);
    expect(combinedPolicies).toMatch(/Support is intended/i);
    expect(combinedPolicies).toMatch(/does not replace clinical supervision/i);
  });
});

describe("buyerSupportContact", () => {
  it("gives buyers a safe support path without collecting sensitive data", () => {
    expect(buyerSupportContact.email).toContain("@");
    expect(buyerSupportContact.subject).toMatch(/support request/i);
    expect(buyerSupportContact.emailBody).toMatch(/Request type/i);
    expect(buyerSupportContact.emailBody).toMatch(/refund review/i);
    expect(buyerSupportContact.safeDetails.join(" ")).toMatch(/checkout/i);
    expect(buyerSupportContact.expectedUse).toMatch(/refund review/i);

    const neverSend = buyerSupportContact.neverSend.join(" ");

    expect(neverSend).toMatch(/protected health information/i);
    expect(neverSend).toMatch(/Card numbers/i);
    expect(neverSend).toMatch(/raw sign-in links/i);
  });

  it("builds a safe prefilled support email link", () => {
    const href = createMailtoHref({
      email: buyerSupportContact.email,
      subject: buyerSupportContact.subject,
      body: buyerSupportContact.emailBody,
    });

    expect(href).toContain("mailto:jeff.chapin@spindeleye.com");
    expect(href).toContain("subject=OptiTech+Academy+support+request");
    expect(href).toContain("body=");
    expect(decodeURIComponent(href)).toContain("Request type:");
    expect(decodeURIComponent(href)).toContain("Approximate purchase date");
    expect(decodeURIComponent(href)).not.toMatch(/card number:/i);
    expect(decodeURIComponent(href)).not.toMatch(/password:/i);
  });
});

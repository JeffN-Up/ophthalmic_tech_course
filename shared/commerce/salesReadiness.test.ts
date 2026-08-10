import { describe, expect, it } from "vitest";
import {
  buyerConfidenceAnswers,
  foundingReleaseStatus,
  getSalesPathItemCount,
  individualBuyerHandoffSteps,
  individualLearnerFirstMonthPlan,
  individualLearnerSalesPath,
  individualLearnerStartSteps,
  learnerValueProofPoints,
  practiceBuyerHandoffSteps,
  practiceBuyerSalesPath,
  practiceValueProofPoints,
  purchaseAssurances,
} from "./salesReadiness";

describe("sales readiness copy", () => {
  it("explains who each paid path is for", () => {
    expect(individualLearnerSalesPath.map(section => section.title)).toEqual([
      "Best fit",
      "What learners can expect",
      "After payment",
    ]);
    expect(practiceBuyerSalesPath.map(section => section.title)).toEqual([
      "Best fit",
      "What practices can expect",
      "After payment",
    ]);
  });

  it("keeps each paid path specific enough for buyer confidence", () => {
    expect(
      getSalesPathItemCount(individualLearnerSalesPath)
    ).toBeGreaterThanOrEqual(9);
    expect(getSalesPathItemCount(practiceBuyerSalesPath)).toBeGreaterThanOrEqual(
      9
    );
    expect(
      individualLearnerSalesPath.flatMap(section => section.items).join(" ")
    ).toContain("passwordless sign-in");
    expect(
      practiceBuyerSalesPath.flatMap(section => section.items).join(" ")
    ).toContain("practice-seat tool");
  });

  it("does not promise certification, employment, or independent competency", () => {
    const combined = [
      ...individualLearnerSalesPath.flatMap(section => section.items),
      ...practiceBuyerSalesPath.flatMap(section => section.items),
    ].join(" ");

    expect(combined).not.toMatch(/guarantee/i);
    expect(combined).not.toMatch(/certified/i);
    expect(combined).not.toMatch(/independently verifies/i);
  });

  it("gives individual learners a clear first-session path after purchase", () => {
    expect(individualLearnerStartSteps.map(step => step.title)).toEqual([
      "Use the same email at checkout",
      "Request your sign-in link",
      "Start Module 1",
      "Keep hands-on skills supervised",
    ]);

    const combined = individualLearnerStartSteps
      .map(step => `${step.title} ${step.description}`)
      .join(" ");

    expect(combined).toMatch(/Stripe confirms payment/i);
    expect(combined).toMatch(/same email/i);
    expect(combined).toMatch(/supervisor/i);
    expect(combined).not.toMatch(/guarantee/i);
  });

  it("gives individual learners a safe first-month plan after purchase", () => {
    expect(individualLearnerFirstMonthPlan.map(step => step.timeframe)).toEqual(
      ["Days 1-3", "Days 4-10", "Days 11-20", "Days 21-30"]
    );

    const combined = individualLearnerFirstMonthPlan
      .map(step => `${step.timeframe} ${step.title} ${step.description}`)
      .join(" ");

    expect(combined).toMatch(/checkout email/i);
    expect(combined).toMatch(/knowledge checks/i);
    expect(combined).toMatch(/Skills Passport/i);
    expect(combined).toMatch(/supervisor/i);
    expect(combined).toMatch(/without claiming independent competency/i);
    expect(combined).not.toMatch(/guarantee/i);
    expect(combined).not.toMatch(/certified technician/i);
  });

  it("answers common buyer objections without overpromising", () => {
    expect(buyerConfidenceAnswers).toHaveLength(5);

    const combined = buyerConfidenceAnswers
      .map(answer => `${answer.question} ${answer.answer}`)
      .join(" ");

    expect(combined).toMatch(/certification course/i);
    expect(combined).toMatch(/career changers/i);
    expect(combined).toMatch(/same email/i);
    expect(combined).toMatch(/practice-seat tool/i);
    expect(combined).toMatch(/future modules/i);
    expect(combined).not.toMatch(/guarantee/i);
    expect(combined).not.toMatch(/certified technician/i);
    expect(combined).not.toMatch(/proves competency/i);
  });

  it("gives buyers purchase assurances without risky claims", () => {
    expect(purchaseAssurances.map(item => item.title)).toEqual([
      "Stripe handles payment",
      "Access follows the buyer email",
      "Support path is visible",
      "Expectations stay honest",
    ]);

    const combined = purchaseAssurances
      .map(item => `${item.title} ${item.description}`)
      .join(" ");

    expect(combined).toMatch(/does not store card details/i);
    expect(combined).toMatch(/same email/i);
    expect(combined).toMatch(/refund review/i);
    expect(combined).toMatch(/does not promise certification/i);
    expect(combined).not.toMatch(/guarantee/i);
  });

  it("gives buyers a concrete after-payment handoff without overpromising", () => {
    expect(individualBuyerHandoffSteps.map(step => step.title)).toEqual([
      "Receipt and access email",
      "First sign-in attempt",
      "First lesson completion",
      "Support path saved",
    ]);
    expect(practiceBuyerHandoffSteps.map(step => step.title)).toEqual([
      "Receipt and seat pack record",
      "Practice lead identified",
      "Learner seats assigned",
      "Local signoff plan confirmed",
    ]);

    const combined = [
      ...individualBuyerHandoffSteps,
      ...practiceBuyerHandoffSteps,
    ]
      .map(step => `${step.title} ${step.description}`)
      .join(" ");

    expect(combined).toMatch(/Stripe receipt/i);
    expect(combined).toMatch(/passwordless sign-in link/i);
    expect(combined).toMatch(/seat pack/i);
    expect(combined).toMatch(/local observation/i);
    expect(combined).toMatch(/private clinical details/i);
    expect(combined).not.toMatch(/guarantee/i);
    expect(combined).not.toMatch(/certified technician/i);
    expect(combined).not.toMatch(/employment/i);
  });

  it("states founding release status without selling planned content as complete", () => {
    expect(foundingReleaseStatus.map(item => item.title)).toEqual([
      "Published first",
      "Planned next",
      "Reviewed before release",
      "Supervised skills stay local",
    ]);

    const combined = foundingReleaseStatus
      .map(item => `${item.title} ${item.description}`)
      .join(" ");

    expect(combined).toMatch(/published Module 1/i);
    expect(combined).toMatch(/10-day Bootcamp source path/i);
    expect(combined).toMatch(/pass review before/i);
    expect(combined).toMatch(/remain with the learner's practice or supervisor/i);
    expect(combined).not.toMatch(/guarantee/i);
    expect(combined).not.toMatch(/certified technician/i);
    expect(combined).not.toMatch(/all modules are complete/i);
  });

  it("helps practice managers justify a pack without promising staffing outcomes", () => {
    expect(practiceValueProofPoints.map(point => point.title)).toEqual([
      "Same first explanation for every learner",
      "Less repeated basic onboarding",
      "Seat packs match small teams",
      "Local signoff stays local",
    ]);

    const combined = practiceValueProofPoints
      .map(point => `${point.title} ${point.description}`)
      .join(" ");

    expect(combined).toMatch(/New hires hear the same foundation/i);
    expect(combined).toMatch(/Supervisors can spend more time/i);
    expect(combined).toMatch(/Six-seat and fifteen-seat packs/i);
    expect(combined).toMatch(/competency observation/i);
    expect(combined).not.toMatch(/guarantee/i);
    expect(combined).not.toMatch(/retention/i);
    expect(combined).not.toMatch(/staffing outcome/i);
  });

  it("helps individual learners justify buying without promising jobs or credentials", () => {
    expect(learnerValueProofPoints.map(point => point.title)).toEqual([
      "Learn the language before the room feels overwhelming",
      "Study at your own pace",
      "Prepare for supervised practice conversations",
      "Explore eye care without overclaiming credentials",
    ]);

    const combined = learnerValueProofPoints
      .map(point => `${point.title} ${point.description}`)
      .join(" ");

    expect(combined).toMatch(/ophthalmic vocabulary/i);
    expect(combined).toMatch(/12 months of founding access/i);
    expect(combined).toMatch(/Skills Passport/i);
    expect(combined).toMatch(/education, not certification/i);
    expect(combined).not.toMatch(/guarantee/i);
    expect(combined).not.toMatch(/employment/i);
    expect(combined).not.toMatch(/certified technician/i);
  });
});

import { describe, expect, it } from "vitest";
import {
  calculatePracticeValueEstimate,
  getRecommendedPracticePack,
} from "./practiceValueCalculator";

describe("getRecommendedPracticePack", () => {
  it("recommends the smallest practice pack that can hold the learner count", () => {
    expect(getRecommendedPracticePack(3)?.id).toBe("practice-six-seat-pack");
    expect(getRecommendedPracticePack(5)?.id).toBe("practice-six-seat-pack");
    expect(getRecommendedPracticePack(6)?.id).toBe("practice-six-seat-pack");
    expect(getRecommendedPracticePack(7)?.id).toBe(
      "practice-fifteen-seat-pack"
    );
    expect(getRecommendedPracticePack(15)?.id).toBe(
      "practice-fifteen-seat-pack"
    );
    expect(getRecommendedPracticePack(16)).toBeUndefined();
  });
});

describe("calculatePracticeValueEstimate", () => {
  it("estimates supervisor time value without promising outcomes", () => {
    const estimate = calculatePracticeValueEstimate({
      learnerCount: 6,
      supervisorHourlyCost: 45,
      estimatedHoursSavedPerLearner: 4,
    });

    expect(estimate.recommendedOffer?.id).toBe("practice-six-seat-pack");
    expect(estimate.estimatedSupervisorTimeValue).toBe(1080);
    expect(estimate.estimatedNetPlanningValue).toBe(81);
    expect(estimate.estimatedValueMultiple).toBeCloseTo(1.0811, 4);
    expect(estimate.estimatedCostPerLearner).toBeCloseTo(166.5, 1);
    expect(estimate.unusedSeatCount).toBe(0);
    expect(estimate.needsCustomConversation).toBe(false);
  });

  it("routes larger groups to a custom conversation", () => {
    const estimate = calculatePracticeValueEstimate({
      learnerCount: 22,
      supervisorHourlyCost: 45,
      estimatedHoursSavedPerLearner: 3,
    });

    expect(estimate.recommendedOffer).toBeUndefined();
    expect(estimate.needsCustomConversation).toBe(true);
    expect(estimate.estimatedValueMultiple).toBeNull();
    expect(estimate.estimatedCostPerLearner).toBeNull();
    expect(estimate.unusedSeatCount).toBeNull();
  });

  it("clamps unrealistic inputs into safe planning ranges", () => {
    const estimate = calculatePracticeValueEstimate({
      learnerCount: -4,
      supervisorHourlyCost: 999,
      estimatedHoursSavedPerLearner: 999,
    });

    expect(estimate.learnerCount).toBe(1);
    expect(estimate.estimatedSupervisorTimeValue).toBe(40000);
  });
});

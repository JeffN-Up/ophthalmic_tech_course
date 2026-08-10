import { describe, expect, it } from "vitest";
import { getCheckoutStatus } from "./checkoutStatus";

describe("getCheckoutStatus", () => {
  it("recognizes successful Stripe returns", () => {
    expect(getCheckoutStatus("?checkout=success")).toEqual({
      tone: "success",
      title: "Payment received",
      message:
        "Stripe confirmed your payment. Use the same checkout email to request a sign-in link, then open Module 1 from your learner account.",
      nextSteps: [
        "Check your email for the Stripe receipt.",
        "Request a passwordless sign-in link with the email used at checkout.",
        "Open Module 1 after your learner access is confirmed.",
        "Do not share patient information in course forms or support requests.",
      ],
      action: {
        label: "Request sign-in and start Module 1",
        href: "/learn",
      },
    });
  });

  it("recognizes successful practice pack Stripe returns", () => {
    expect(
      getCheckoutStatus("?checkout=success&offer=practice-six-seat-pack")
    ).toEqual({
      tone: "success",
      title: "Practice pack payment received",
      message:
        "Stripe confirmed the practice pack payment. Your seat pack is being prepared for learner assignment and onboarding setup.",
      nextSteps: [
        "Check the billing email for the Stripe receipt.",
        "Gather the learner emails that should receive seats.",
        "Use the protected practice setup process to assign seats when ready.",
        "Do not send patient information, passwords, or private staff details in setup notes.",
      ],
      action: {
        label: "Open seat setup tools",
        href: "/practice-seat-admin",
      },
    });
  });

  it("recognizes canceled Stripe returns", () => {
    expect(getCheckoutStatus("?checkout=cancelled")).toEqual({
      tone: "notice",
      title: "Checkout canceled",
      message:
        "No payment was taken. You can review the offer and restart checkout when ready.",
      nextSteps: ["Return to checkout when you are ready to enroll."],
      action: {
        label: "Return to checkout",
        href: "/checkout",
      },
    });
  });

  it("recognizes canceled practice pack Stripe returns", () => {
    expect(
      getCheckoutStatus("?checkout=cancelled&offer=practice-six-seat-pack")
    ).toEqual({
      tone: "notice",
      title: "Checkout canceled",
      message:
        "No payment was taken. You can review the offer and restart checkout when ready.",
      nextSteps: [
        "Return to the practice pack options when you are ready to buy seats.",
      ],
      action: {
        label: "Return to practice packs",
        href: "/practice-packs",
      },
    });
  });

  it("returns null when there is no checkout result", () => {
    expect(getCheckoutStatus("")).toBeNull();
  });
});

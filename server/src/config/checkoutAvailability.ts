import type { PaidCheckoutGateStatus } from "./paidCheckoutGate";

export type CheckoutAvailabilityPrimaryAction =
  | "continue-to-checkout"
  | "use-manual-payment-link"
  | "join-interest-list";

export interface ManualPaymentLinks {
  foundingLearner?: string;
  practiceSixSeatPack?: string;
  practiceFifteenSeatPack?: string;
}

export interface CheckoutAvailabilityReport {
  ready: boolean;
  title: string;
  message: string;
  primaryAction: CheckoutAvailabilityPrimaryAction;
  manualPaymentLinks: ManualPaymentLinks;
}

export type CheckoutAvailabilityEnvironment = Record<
  string,
  string | undefined
>;

function readStripePaymentLink(value?: string): string | undefined {
  const trimmedValue = value?.trim();

  if (!trimmedValue) return undefined;

  try {
    const url = new URL(trimmedValue);

    if (url.protocol !== "https:" || url.hostname !== "buy.stripe.com") {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}

export function getManualPaymentLinks(
  env: CheckoutAvailabilityEnvironment = process.env
): ManualPaymentLinks {
  return {
    foundingLearner: readStripePaymentLink(
      env.PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER
    ),
    practiceSixSeatPack: readStripePaymentLink(
      env.PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS
    ),
    practiceFifteenSeatPack: readStripePaymentLink(
      env.PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS
    ),
  };
}

function hasManualPaymentLinks(
  manualPaymentLinks: ManualPaymentLinks
): boolean {
  return Object.values(manualPaymentLinks).some(Boolean);
}

export function getCheckoutAvailabilityReport(
  checkoutGate: PaidCheckoutGateStatus,
  env: CheckoutAvailabilityEnvironment = process.env
): CheckoutAvailabilityReport {
  const manualPaymentLinks = getManualPaymentLinks(env);

  if (checkoutGate.ready) {
    return {
      ready: true,
      title: "Enrollment is open",
      message:
        "Stripe checkout is available for individual learners and practice packs.",
      primaryAction: "continue-to-checkout",
      manualPaymentLinks,
    };
  }

  if (hasManualPaymentLinks(manualPaymentLinks)) {
    return {
      ready: false,
      title: "Manual Stripe payment links are available",
      message:
        "Automated checkout is still paused, but approved first buyers can use a Stripe Payment Link while access is fulfilled manually.",
      primaryAction: "use-manual-payment-link",
      manualPaymentLinks,
    };
  }

  return {
    ready: false,
    title: "Enrollment is not open yet",
    message:
      "The course can collect interest, but payment is paused until the final launch checks are complete.",
    primaryAction: "join-interest-list",
    manualPaymentLinks,
  };
}

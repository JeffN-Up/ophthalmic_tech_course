import { normalizeCheckoutEmail } from "@shared/commerce/checkoutEmail";

interface CheckoutResponse {
  url?: string;
  error?: string;
}

type Fetcher = typeof fetch;

export interface CheckoutAvailabilityReport {
  ready: boolean;
  title: string;
  message: string;
  primaryAction:
    | "continue-to-checkout"
    | "use-manual-payment-link"
    | "join-interest-list";
  manualPaymentLinks: {
    foundingLearner?: string;
    practiceSixSeatPack?: string;
    practiceFifteenSeatPack?: string;
  };
}

interface CheckoutAvailabilityErrorResponse {
  error?: string;
}

export async function createCheckoutSession({
  email,
  offerId,
  acceptedTerms,
  fetcher = fetch,
}: {
  email: string;
  offerId?: string;
  acceptedTerms?: boolean;
  fetcher?: Fetcher;
}): Promise<{ url: string }> {
  const normalizedEmail = normalizeCheckoutEmail(email);

  if (!normalizedEmail) {
    throw new Error(
      "Enter a valid email so we can send your receipt and course access."
    );
  }

  if (!acceptedTerms) {
    throw new Error(
      "Review and accept the course policies before continuing to Stripe."
    );
  }

  const response = await fetcher("/api/checkout/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: normalizedEmail, offerId, acceptedTerms }),
  });

  const payload = (await response.json()) as CheckoutResponse;

  if (!response.ok) {
    throw new Error(payload.error ?? "Checkout is unavailable right now.");
  }

  if (!payload.url) {
    throw new Error("Checkout did not return a redirect URL.");
  }

  return { url: payload.url };
}

export async function fetchCheckoutAvailability({
  fetcher = fetch,
}: {
  fetcher?: Fetcher;
} = {}): Promise<CheckoutAvailabilityReport> {
  const response = await fetcher("/api/checkout/availability");
  const payload = (await response.json()) as
    | CheckoutAvailabilityReport
    | CheckoutAvailabilityErrorResponse;

  if (!response.ok) {
    throw new Error(
      "error" in payload && payload.error
        ? payload.error
        : "Checkout availability is unavailable right now."
    );
  }

  return payload as CheckoutAvailabilityReport;
}

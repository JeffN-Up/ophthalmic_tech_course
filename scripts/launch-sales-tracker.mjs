#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const recommendedOutputDir = path.join(
  "launch-evidence",
  "sales-tracker-templates"
);

function getArgValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find(arg => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : fallback;
}

function getOutputDir() {
  return path.resolve(
    getArgValue("output-dir") ||
      process.env.LAUNCH_SALES_TRACKER_OUTPUT_DIR ||
      recommendedOutputDir
  );
}

const outputDir = getOutputDir();

const trackers = [
  {
    fileName: "lead-tracker.csv",
    rows: [
      [
        "Date Added",
        "Lead Type",
        "Name Or Practice",
        "Source",
        "Buyer Path",
        "Status",
        "Next Follow-Up",
        "Safe Notes",
      ],
      [
        "2026-07-16",
        "Individual",
        "Example Learner",
        "Referral",
        "Individual course",
        "New",
        "2026-07-19",
        "Wants beginner-friendly ophthalmic technician training.",
      ],
    ],
  },
  {
    fileName: "purchase-tracker.csv",
    rows: [
      [
        "Purchase Date",
        "Buyer Type",
        "Buyer Name Or Practice",
        "Buyer Email",
        "Offer",
        "Amount",
        "Stripe Checkout Session ID",
        "Stripe Event ID",
        "Fulfillment Status",
        "Sign-In Confirmed",
        "Support Needed",
        "Safe Notes",
      ],
      [
        "2026-07-16",
        "Individual",
        "Example Learner",
        "learner@example.com",
        "Founding Learner Access",
        "299",
        "cs_test_example",
        "evt_test_example",
        "Access sent",
        "No",
        "No",
        "Example row only. Replace with real safe business details.",
      ],
    ],
  },
  {
    fileName: "practice-seat-tracker.csv",
    rows: [
      [
        "Practice",
        "Pack Size",
        "Seats Assigned",
        "Seats Remaining",
        "Practice Contact",
        "Onboarding Lead",
        "Next Check-In",
        "Safe Notes",
      ],
      [
        "Example Eye Care",
        "6",
        "0",
        "6",
        "manager@example.com",
        "Jeff",
        "2026-07-23",
        "Example row only. Do not add private employee performance notes.",
      ],
    ],
  },
  {
    fileName: "practice-inquiry-tracker.csv",
    rows: [
      [
        "Date",
        "Inquiry ID",
        "Practice",
        "Contact Email",
        "Estimated Learners",
        "Timeline",
        "Status",
        "Next Step",
      ],
      [
        "2026-07-16",
        "practice_inquiry_example",
        "Example Eye Care",
        "manager@example.com",
        "18",
        "Next hiring class",
        "New",
        "Schedule rollout call.",
      ],
    ],
  },
  {
    fileName: "refund-support-tracker.csv",
    rows: [
      [
        "Request Date",
        "Buyer Type",
        "Buyer Name Or Practice",
        "Category",
        "Offer",
        "Stripe Refund ID",
        "Status",
        "Follow-Up Date",
        "Safe Reason Theme",
        "Safe Notes",
      ],
      [
        "2026-07-16",
        "Individual",
        "Example Learner",
        "Sign-in help",
        "Founding Learner Access",
        "N/A",
        "Open",
        "2026-07-17",
        "Email not received",
        "Example row only. Never paste raw sign-in links.",
      ],
    ],
  },
  {
    fileName: "first-24-hour-sale-review.csv",
    rows: [
      [
        "Purchase Date",
        "Buyer Type",
        "Offer",
        "Access Worked Without Manual Fix",
        "Sign-In Worked",
        "Support Issue Found",
        "Outreach Decision",
        "Safe Notes",
      ],
      [
        "2026-07-16",
        "Individual",
        "Founding Learner Access",
        "Yes / No",
        "Yes / No",
        "None / Sign-in / Access / Payment / Other",
        "Continue / Pause / Fix first",
        "Use this before sending checkout links broadly.",
      ],
    ],
  },
  {
    fileName: "first-buyer-fulfillment-checklist.csv",
    rows: [
      [
        "Buyer Type",
        "Checklist Item",
        "Status",
        "Evidence To Save",
        "Safe Notes",
      ],
      [
        "Preflight",
        "Confirm paid enrollment is enabled only after all launch gates pass",
        "Not started",
        "/api/launch/readiness shows readyForPaidLaunch true",
        "Use the go-live checklist first if readiness is false.",
      ],
      [
        "Individual",
        "Confirm Stripe payment status is paid",
        "Not started",
        "Stripe payment and checkout session IDs",
        "Never paste card data or Stripe secret keys.",
      ],
      [
        "Individual",
        "Confirm checkout.session.completed webhook delivered",
        "Not started",
        "Stripe event ID and webhook delivery status",
        "If missing, keep outreach paused until fixed.",
      ],
      [
        "Individual",
        "Confirm buyer lookup shows purchase and active enrollment",
        "Not started",
        "Safe support IDs from Practice Seat Admin",
        "Use support IDs instead of private raw database notes.",
      ],
      [
        "Individual",
        "Confirm welcome email was sent or skip reason recorded",
        "Not started",
        "Email provider event or safe admin note",
        "Do not save raw passwordless sign-in links.",
      ],
      [
        "Individual",
        "Confirm buyer can request passwordless sign-in with checkout email",
        "Not started",
        "Sign-in request timestamp or email event",
        "Record only that it worked, not the private link.",
      ],
      [
        "Individual",
        "Confirm buyer can open Module 1",
        "Not started",
        "Support check or buyer confirmation",
        "This is the green light for more individual outreach.",
      ],
      [
        "Practice",
        "Confirm practice seat pack exists with correct seat count",
        "Not started",
        "Practice pack support ID and seat count",
        "Do not add private employee performance notes.",
      ],
      [
        "Practice",
        "Confirm buyer lookup shows purchase and remaining seats",
        "Not started",
        "Safe support IDs from Practice Seat Admin",
        "Use this before assigning learners.",
      ],
      [
        "Practice",
        "Confirm manager can assign learner seats",
        "Not started",
        "Assignment support IDs",
        "Keep notes to business access status only.",
      ],
      [
        "Practice",
        "Confirm assigned learner can request passwordless sign-in",
        "Not started",
        "Email provider event or safe admin note",
        "Never paste raw sign-in links.",
      ],
      [
        "Post-sale",
        "Review Stripe, buyer lookup, sign-in, and support notes within 24 hours",
        "Not started",
        "Completed first 24-hour sale review row",
        "Continue outreach only if no blocking issue is found.",
      ],
    ],
  },
  {
    fileName: "first-buyer-feedback-tracker.csv",
    rows: [
      [
        "Feedback Date",
        "Buyer Type",
        "Offer",
        "Feedback Received",
        "Top Useful Theme",
        "Top Confusing Theme",
        "Next Improvement",
        "Testimonial Consent",
        "Approved Public Quote",
        "Safe Notes",
      ],
      [
        "2026-08-06",
        "Individual",
        "Founding Learner Access",
        "Yes / No",
        "Beginner-friendly clinic language",
        "None yet",
        "Improve welcome email.",
        "Yes / No / Not asked",
        "",
        "Do not save patient information, PHI, raw sign-in links, or private workplace details.",
      ],
    ],
  },
  {
    fileName: "weekly-business-review.csv",
    rows: [
      [
        "Week Of",
        "Leads Added",
        "Sales Closed",
        "Revenue",
        "Refunds",
        "Biggest Blocker",
        "Best Source",
        "Next Experiment",
      ],
      [
        "2026-07-20",
        "0",
        "0",
        "0",
        "0",
        "Need first outreach list",
        "Not known yet",
        "Email five local practices.",
      ],
    ],
  },
];

function escapeCsvCell(value) {
  const text = String(value);
  if (!/[",\n\r]/.test(text)) {
    return text;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

function renderCsv(rows) {
  return `${rows.map(row => row.map(escapeCsvCell).join(",")).join("\n")}\n`;
}

const readme = [
  "# OptiTech Academy Sales Tracker Templates",
  "",
  "These CSV files are safe starter templates for Excel or Google Sheets.",
  "",
  "Do not paste secrets, card numbers, raw sign-in links, session cookies, database passwords, patient information, protected health information, or private employee performance details into these trackers.",
  "",
  "Use the trackers to answer four simple business questions:",
  "",
  "1. Who might buy?",
  "2. Who already bought?",
  "3. Did they get access successfully?",
  "4. What should happen next?",
  "",
  "Use first-buyer-fulfillment-checklist.csv before broad outreach. It is the plain-English proof sheet for checking that a real buyer paid, received access, signed in, and reached the course without private data being stored.",
  "",
  "Use first-buyer-feedback-tracker.csv after the first buyer has access and any urgent support issue is resolved. It captures useful themes, confusing themes, next improvements, and testimonial consent without private data.",
  "",
  "Source guide: docs/launch/revenue-and-sales-tracker-template.md",
  "",
].join("\n");

await mkdir(outputDir, { recursive: true });

for (const tracker of trackers) {
  await writeFile(
    path.join(outputDir, tracker.fileName),
    renderCsv(tracker.rows),
    "utf8"
  );
}

await writeFile(path.join(outputDir, "README.md"), readme, "utf8");

const lines = [
  "# OptiTech Academy Sales Tracker Export",
  "",
  `Created ${trackers.length} CSV templates in:`,
  "",
  outputDir,
  "",
  `Recommended output folder: ${recommendedOutputDir}`,
  "Override with LAUNCH_SALES_TRACKER_OUTPUT_DIR or --output-dir=...",
  "",
  "Files:",
  ...trackers.map(tracker => `- ${tracker.fileName}`),
  "- README.md",
  "",
  "Do not paste secrets, card numbers, raw sign-in links, session cookies, database passwords, patient information, protected health information, or private employee performance details into these trackers.",
  "",
];

console.log(lines.join("\n"));

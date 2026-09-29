import SiteFooter from "@/components/SiteFooter";
import { Card } from "@/components/ui/card";
import { usePublicConfig } from "@/lib/publicConfig";
import { Eye } from "lucide-react";
import type { ReactNode } from "react";

function PolicyLayout({ title, children }: { title: string; children: ReactNode }) {
  const config = usePublicConfig();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <a href="/" className="inline-flex items-center gap-2 font-bold text-white">
            <Eye className="h-6 w-6 text-cyan-400" /> {config.businessName}
          </a>
          <h1 className="mt-6 text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-slate-300">Effective July 21, 2026</p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Card className="space-y-7 p-6 text-slate-700 shadow-lg sm:p-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_p]:leading-7 [&_li]:leading-7">
          {children}
          <section>
            <h2>Contact</h2>
            <p className="mt-2">
              Questions may be submitted through the <a href="/support" className="font-semibold text-blue-600 hover:underline">Support page</a>
              {config.supportEmail ? <> or emailed to <a className="font-semibold text-blue-600" href={`mailto:${config.supportEmail}`}>{config.supportEmail}</a></> : null}.
            </p>
            {config.businessAddress ? <p className="mt-2">Business address: {config.businessAddress}</p> : null}
          </section>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Terms() {
  const config = usePublicConfig();
  return (
    <PolicyLayout title="Terms of Service">
      <section>
        <h2>Agreement</h2>
        <p className="mt-2">By purchasing, accessing, or using the course, you agree to these Terms of Service and the posted Privacy and Refund Policies. The course is provided by {config.businessLegalName} under the {config.businessName} name.</p>
      </section>
      <section>
        <h2>Educational purpose</h2>
        <p className="mt-2">The course provides general ophthalmic technician education. It does not confer licensure, professional certification, continuing-education credit, employment eligibility, or authority to perform a procedure. Students must follow applicable law, employer policies, manufacturer instructions, and supervision requirements.</p>
      </section>
      <section>
        <h2>Purchases and access</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>Individual course access is currently ${config.pricePerSeat}. The five-seat practice package is currently $1,200 unless a promotion applies.</li>
          <li>Payments are processed by Stripe. We do not store complete payment-card information.</li>
          <li>Each seat is for one named learner. Account sharing, resale, publication, scraping, and credential sharing are prohibited.</li>
          <li>Practice managers may distribute only the number of seats purchased.</li>
        </ul>
      </section>
      <section>
        <h2>Student responsibilities</h2>
        <p className="mt-2">You are responsible for accurate registration information, protecting your password, maintaining compatible internet access, and using the material safely. Do not upload patient-identifying information or use the course as a clinical decision system.</p>
      </section>
      <section>
        <h2>Intellectual property</h2>
        <p className="mt-2">Course text, quizzes, graphics, branding, and downloadable materials are protected content. A purchase grants a limited, personal, non-transferable right to use the course for learning or internal staff training associated with purchased seats. No ownership rights are transferred.</p>
      </section>
      <section>
        <h2>Availability and changes</h2>
        <p className="mt-2">We may correct errors, update clinical material, modify features, and perform maintenance. We will make reasonable efforts to preserve purchased access, but uninterrupted availability is not guaranteed.</p>
      </section>
      <section>
        <h2>Suspension or termination</h2>
        <p className="mt-2">Access may be suspended for fraud, chargebacks, abusive conduct, unauthorized sharing, security threats, or material violation of these terms. Lawful refund and consumer rights are not waived.</p>
      </section>
      <section>
        <h2>Disclaimers and limitation</h2>
        <p className="mt-2">The course is provided for education on an “as available” basis. To the fullest extent permitted by law, we disclaim implied warranties and are not responsible for employment outcomes, examination results, clinical decisions, or indirect or consequential losses. Any liability that cannot legally be excluded is limited to the amount paid for the affected seat.</p>
      </section>
      <section>
        <h2>Changes to these terms</h2>
        <p className="mt-2">Material changes will be posted with a new effective date. Continued use after notice constitutes acceptance to the extent permitted by law.</p>
      </section>
    </PolicyLayout>
  );
}

export function Privacy() {
  return (
    <PolicyLayout title="Privacy Policy">
      <section>
        <h2>Information collected</h2>
        <p className="mt-2">We collect enrollment details such as name, email, telephone number, organization, training goals, purchased seats, account credentials in hashed form, course progress, quiz scores, support messages, and technical logs needed to operate and secure the service.</p>
      </section>
      <section>
        <h2>Payment information</h2>
        <p className="mt-2">Stripe processes payment information. We receive transaction identifiers, payment status, customer contact details, and purchase metadata, but not complete card numbers.</p>
      </section>
      <section>
        <h2>How information is used</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>Provide purchased course access and practice-team seats.</li>
          <li>Track progress, quiz completion, and certificate eligibility.</li>
          <li>Send activation, password-reset, receipt-related, support, and service communications.</li>
          <li>Prevent fraud, investigate abuse, maintain security, and comply with legal obligations.</li>
          <li>Improve course content and customer experience using aggregated or de-identified information.</li>
        </ul>
      </section>
      <section>
        <h2>Service providers</h2>
        <p className="mt-2">Information may be processed by providers that host the application, process payments, deliver transactional email, monitor reliability, or provide professional services. These providers receive only information reasonably necessary for their role.</p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p className="mt-2">The service uses an essential, signed, HTTP-only session cookie to keep students signed in. Optional analytics will be disclosed before use if added.</p>
      </section>
      <section>
        <h2>Retention and security</h2>
        <p className="mt-2">Records are retained as reasonably necessary to provide access, document purchases, resolve disputes, and meet legal obligations. We use access controls, password hashing, encrypted transport, signed sessions, and restricted data files, but no system can guarantee absolute security.</p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p className="mt-2">You may request access, correction, or deletion of personal information through Support. Some purchase, fraud-prevention, and legal records may need to be retained. Account deletion may end course access and remove progress.</p>
      </section>
      <section>
        <h2>Children and patient information</h2>
        <p className="mt-2">The service is intended for adults and workforce trainees, not children under 13. Do not submit patient names, dates of birth, medical-record numbers, images, or other protected health information.</p>
      </section>
    </PolicyLayout>
  );
}

export function Refunds() {
  const config = usePublicConfig();
  return (
    <PolicyLayout title="Refund Policy">
      <section>
        <h2>{config.refundDays}-day limited refund</h2>
        <p className="mt-2">Unless applicable law requires otherwise, a purchaser may request a refund within {config.refundDays} calendar days of purchase when the learner has not passed two or more course modules and no certificate has been issued.</p>
      </section>
      <section>
        <h2>Practice purchases</h2>
        <p className="mt-2">For multi-seat purchases, unused and unassigned seats may be eligible under the same {config.refundDays}-day period. Activated seats are evaluated individually based on course usage. Partial refunds may be issued for eligible unused seats.</p>
      </section>
      <section>
        <h2>How to request a refund</h2>
        <p className="mt-2">Submit the purchaser’s name, checkout email, purchase date, and reason through Support. Approved refunds are returned to the original payment method. Financial institutions may require additional processing time.</p>
      </section>
      <section>
        <h2>Non-refundable circumstances</h2>
        <ul className="mt-2 list-disc space-y-2 pl-6">
          <li>Requests made after the stated period, except where law requires otherwise.</li>
          <li>Accounts that have passed two or more modules or received a certificate.</li>
          <li>Accounts terminated for fraud, unauthorized sharing, or abuse.</li>
          <li>Price differences created by promotions offered after purchase.</li>
        </ul>
      </section>
      <section>
        <h2>Chargebacks</h2>
        <p className="mt-2">Contact Support first so we can investigate and resolve billing concerns. Nothing in this policy limits rights that cannot legally be waived.</p>
      </section>
    </PolicyLayout>
  );
}

export function Disclaimer() {
  return (
    <PolicyLayout title="Training and Clinical Disclaimer">
      <section>
        <h2>Not medical advice</h2>
        <p className="mt-2">Course material is educational and is not medical advice, diagnosis, treatment guidance for a specific patient, or a substitute for a licensed clinician’s judgment.</p>
      </section>
      <section>
        <h2>Supervision and scope</h2>
        <p className="mt-2">Hands-on skills must be learned and performed only with appropriate authorization, competency assessment, infection-control procedures, and supervision. Laws and permitted duties vary by jurisdiction and employer.</p>
      </section>
      <section>
        <h2>Equipment and procedures</h2>
        <p className="mt-2">Always follow current manufacturer instructions, maintenance requirements, clinical protocols, and emergency procedures. Training examples cannot cover every device, patient, contraindication, or complication.</p>
      </section>
      <section>
        <h2>Certification</h2>
        <p className="mt-2">The course certificate documents completion of this private training program. It is not a JCAHPO credential, state license, academic degree, continuing-education approval, or guarantee of examination eligibility or employment.</p>
      </section>
    </PolicyLayout>
  );
}


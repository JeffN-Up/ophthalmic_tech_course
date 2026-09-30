import type {
  ClinicProtocolGuide,
  DoctorProtocol,
  ProtocolStep,
  TrainingSource,
  VisitProtocol,
} from "./spindelTrainingTypes";

const reviewedOn = "2026-09-30";
const siteUrl = "https://sites.google.com/view/seatechalley/clinical-workup-protocol";

function source(label: string, id: string, available = true): TrainingSource {
  const base = id === "site" ? siteUrl : `https://drive.google.com/open?id=${id}`;
  return { label, url: base, reviewedOn, available };
}

const baselineSteps: ProtocolStep[] = [
  { label: "Review", detail: "Read the appointment type, previous plan, and testing orders before beginning." },
  { label: "History", detail: "Confirm the chief concern, interval change, drops, medications, allergies, and relevant history." },
  { label: "Vision", detail: "Measure the vision required for the visit and use pinhole when the protocol calls for it." },
  { label: "Entrance testing", detail: "Complete only the entrance tests required by the visit type and doctor protocol." },
  { label: "Ordered testing", detail: "Perform and document source-listed imaging or measurements; repeat questionable results when safe." },
  { label: "Handoff", detail: "Tell the doctor about abnormal, inconsistent, urgent, or incomplete findings." },
];

function standardVisits(extraRoutine: ProtocolStep[] = [], extraEmergency: ProtocolStep[] = []): VisitProtocol[] {
  return [
    {
      visitType: "REE / CE",
      summary: "Annual routine or medical comprehensive workup.",
      steps: [...baselineSteps, ...extraRoutine],
    },
    {
      visitType: "EMER",
      summary: "Symptom-focused same-day workup; urgency and safety take priority.",
      steps: [
        ...baselineSteps.slice(0, 3),
        { label: "Urgency", detail: "Document onset, laterality, pain, trauma, flashes, floaters, field loss, and recent surgery." },
        ...extraEmergency,
        baselineSteps[5],
      ],
    },
    {
      visitType: "IOP / VFFU",
      summary: "Pressure or visual-field follow-up based on the previous plan.",
      steps: [baselineSteps[0], baselineSteps[1], baselineSteps[2], { label: "Pressure", detail: "Complete ORA and/or Goldmann exactly as the doctor source requires." }, baselineSteps[5]],
    },
  ];
}

export const clinicProtocolGuides: ClinicProtocolGuide[] = [
  {
    id: "daily-reminders",
    title: "Daily Clinical Reminders",
    source: source("SEA Tech Alley — Daily Clinical Reminders", "1ejWNBdf32iIAseoB2gM9qjSBlehpf5gP6kVqxCZ4E-I"),
    summary: "Doctor-specific reminders that apply across the clinic day.",
    points: ["Check in every patient and set the correct status.", "Keep the HPI brief, accurate, and relevant.", "Send OCT reports according to the approved reporting list."],
  },
  {
    id: "when-to-refract",
    title: "When to Refract",
    source: source("SEA Tech Alley — When to Refract", "1rXIxMQQ8JZRkpsxcpQC0NxLEantezkd9x26saKJYbbM"),
    summary: "Use refraction to establish best-corrected vision when vision changes, the patient reports a change, or vision treatment is being considered.",
    points: ["Unexpected acuity decrease may require BCVA.", "Patient-reported change matters even when screening acuity looks stable.", "A deferred glasses prescription does not always remove the clinical need for BCVA."],
  },
  {
    id: "optomap",
    title: "Optomap Guidelines",
    source: source("SEA Tech Alley — Optomap Photos", "11nKE-ka-NDAP5TniTalv3ZHIg4uCd__5DGjfSZSOGlQ"),
    summary: "Doctor-specific indications, filters, and steering guidance.",
    points: ["Use red/green views as required.", "Steer for peripheral findings when directed.", "Follow the individual doctor's dilation and Optomap rule."],
  },
  {
    id: "oct-reports",
    title: "OCT Scans and Reports",
    source: source("SEA Tech Alley — OCT Scans and Reports", "1hbmmYR58RlN6_Tjnz97Ifwqu_2NuQEZqIRbx8wNZHMw"),
    summary: "Approved scan and report combinations for macular, optic-nerve, glaucoma, corneal, and anterior-segment testing.",
    points: ["Match the scan type to the disease question.", "Confirm signal and segmentation quality before accepting.", "Send the report listed for the ordered scan."],
  },
  {
    id: "post-op-iols",
    title: "Post-Op IOL Reference",
    source: source("SEA Tech Alley — IOL List", "1MjWqDx7A8GYk0c5RxYf-GWILWFaADaBjb3L6NQU1bDE"),
    summary: "Doctor-specific IOL categories used to understand post-operative vision expectations.",
    points: ["Confirm the exact implanted lens from the chart.", "Do not infer lens category from patient memory alone.", "Use the current source because lens lists change."],
  },
  {
    id: "oct-day-to-day",
    title: "OCT Scans and Reports — Day-to-Day",
    source: source("SEA Tech Alley — OCT day-to-day link", "1YaRxssEO37rbjEowm_59l0CDYymH4ARp69YXNcnTX6Y", false),
    summary: "The linked source was unavailable during review. Use the current accessible OCT guide and supervisor direction.",
    points: [],
  },
];

export const spindelDoctorProtocols: DoctorProtocol[] = [
  {
    id: "spindel",
    doctorName: "Dr. Spindel",
    source: source("SEA Tech Alley — Dr. Spindel Protocol", "1dYTlCJ-A1m6MycY9Au9xYYo3I64y6AFEFQli8ficuK4"),
    visits: standardVisits(
      [{ label: "Dilation/Optomap", detail: "Follow the visit table; all dilated patients get Optomap." }],
      [{ label: "Extra testing", detail: "Do not add extra testing unless Dr. Spindel asks; new flashes or floaters require both dilation and Optomap." }],
    ),
    reminders: ["All dilated patients get Optomap.", "When unsure about an additional ordered test outside an emergency workup, ask before proceeding."],
  },
  {
    id: "vazan",
    doctorName: "Dr. Vazan",
    source: source("SEA Tech Alley — Dr. Vazan Protocol", "1vWZPnwdk0T6vWfw4Idm0Jy6fP_4_sb6WBD8qmCtG6mM"),
    visits: standardVisits([{ label: "Near vision", detail: "Do not check near vision unless the patient has a near-sighted, monovision, or PanOptix IOL." }]),
    reminders: ["Ask about eye drops at every visit.", "Do not code encounters.", "Match ocular history to the previous visit rather than adding unverified history."],
  },
  {
    id: "guenena",
    doctorName: "Dr. Guenena",
    source: source("SEA Tech Alley — Dr. Guenena Protocol", "1KYHgh4f2cw6faUU4cwgocT6HZT7ptQxPCOWC-7uPcos"),
    visits: standardVisits([{ label: "Pentacam", detail: "Perform Pentacam for cataract evaluations and for cylinder of -2.50 D or greater." }, { label: "OCT macula", detail: "Perform when vision cannot be corrected better than 20/30 unless an obvious non-retinal cause is documented." }]),
    reminders: ["All dilated patients get Optomap.", "All minor procedures and lasers require a vision check."],
  },
  {
    id: "slentz",
    doctorName: "Dr. Slentz",
    source: source("SEA Tech Alley — Dr. Slentz Protocol", "1swAehPSfZMVNhxo537oAxsvToLZ67_tJt0M3VLEEhp8"),
    visits: standardVisits(),
    reminders: ["Use the linked visit table as the source of truth and review the previous plan before adding testing."],
  },
  {
    id: "farahani",
    doctorName: "Dr. Farahani",
    source: source("SEA Tech Alley — Dr. Farahani Protocol", "1xT885U2d1qomCtwphrghKwtNIw7ut__VjlEbiBfzOJc"),
    visits: standardVisits([{ label: "Optomap", detail: "Every dilated patient receives red/green Optomap images." }]),
    reminders: ["Confirm the implanted IOL from the current chart and approved IOL reference for post-operative visits."],
  },
  {
    id: "wood",
    doctorName: "Dr. Wood",
    source: source("SEA Tech Alley — Dr. Wood Protocol", "1wXo2EQc3A67cd7z01SbRxMPKmWQaWxIid4fS9Wo3g6c"),
    visits: standardVisits([{ label: "Dilation/Optomap", detail: "For routine exams, established patients 40 or older require dilation or Optomap unless the source says otherwise." }]),
    reminders: ["Use stereo for VSP routine exams.", "Use stereo and color for new routine/comprehensive patients under 18."],
  },
  {
    id: "oblock",
    doctorName: "Dr. O'Block",
    source: source("SEA Tech Alley — Dr. O'Block Protocol", "1D1Ph1SnlHWkHiiyaGgdQrSLXQkjJq5nZe1ksiTSY3DI"),
    visits: standardVisits([{ label: "Dilation/Optomap", detail: "For routine exams, new patients 30 or older require dilation or Optomap." }]),
    reminders: ["Use stereo for VSP routine exams.", "Use stereo and color for new routine/comprehensive patients under 18."],
  },
  {
    id: "nguyen",
    doctorName: "Dr. Nguyen",
    source: source("SEA Tech Alley — Dr. Nguyen Protocol", "1EZWJ-nBmzN95MP1mAlqHp1WGpKTcdhuq9--_ijB-7ho"),
    visits: standardVisits([{ label: "Dilation/Optomap", detail: "All new routine and comprehensive exams require dilation or Optomap." }]),
    reminders: ["Use stereo for VSP routine exams.", "Use stereo and color for new routine/comprehensive patients under 18."],
  },
  {
    id: "leo",
    doctorName: "Dr. Leo",
    source: source("SEA Tech Alley — Dr. Leo Protocol", "1xa3i9QrnOsfgsyOlOLzJIduDBFchBq5OhNU3g5-rSu8"),
    visits: standardVisits([{ label: "Goldmann", detail: "Confirm with Goldmann when ORA thresholds apply or the pressure difference between eyes is greater than 4 mmHg." }]),
    reminders: ["ORA is expected for patients able to sit for it.", "Dilation/Optomap decisions vary by new/established status and age."],
  },
  {
    id: "noall",
    doctorName: "Dr. Noall",
    source: source("SEA Tech Alley — Dr. Noall Protocol", "1_4on3D6QLwjvt__IjZDR7kA45xN-Jkahej3eXc7Fqag"),
    visits: standardVisits([{ label: "Dilation/Optomap", detail: "Established patients 40 and older require dilation or Optomap; under 40 follow the chart indication." }]),
    reminders: ["Use the prior plan for additional testing.", "Emergency visits with new flashes or floaters require both dilation and Optomap."],
  },
];

export function getDoctorProtocol(id: string): DoctorProtocol | undefined {
  return spindelDoctorProtocols.find((protocol) => protocol.id === id);
}

export function getProtocolsForModuleDay(day: number): DoctorProtocol[] {
  if (day === 8) return spindelDoctorProtocols.slice(0, 5);
  if (day === 9) return spindelDoctorProtocols.slice(5, 10);
  return [];
}

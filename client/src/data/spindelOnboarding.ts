import type { QuizData } from "@/components/ModuleQuiz";
import type { LessonContent } from "@/data/courseContent";
import type { CurriculumModule } from "@/data/curriculum";
import { spindelTechnicianModules } from "@/data/spindelTechnicianModules";

export const SPINDEL_ORGANIZATION = "Spindel Eye Associates";
export const SPINDEL_PASSING_SCORE = 80;

export function isSpindelOrganization(organizationName?: string): boolean {
  return organizationName?.trim().toLowerCase().includes("spindel eye") ?? false;
}

const legacySpindelOnboardingModules: CurriculumModule[] = [
  {
    id: "spindel-01-welcome",
    day: 1,
    title: "Welcome to Spindel Eye Associates",
    description: "Meet the people, standards, and shared purpose behind a confident first day at Spindel.",
    objectives: [
      "Describe the practice's patient-first service standard",
      "Recognize the primary office locations and shared-team model",
      "Understand professional conduct and attendance expectations",
      "Know when to ask a supervisor for guidance",
    ],
    topics: ["Mission and culture", "Office locations", "Professional conduct", "Team communication"],
    assets: ["Welcome Guide", "Location Overview", "New-Hire Checklist"],
    icon: "👋",
    duration: "45 minutes",
    difficulty: "Beginner",
  },
  {
    id: "spindel-02-privacy",
    day: 2,
    title: "HIPAA, Privacy & Information Security",
    description: "Build privacy-first habits for conversations, screens, records, messages, and everyday work.",
    objectives: [
      "Apply the minimum-necessary standard",
      "Identify common privacy and security risks",
      "Use approved systems and communication channels",
      "Report suspected incidents immediately",
    ],
    topics: ["HIPAA basics", "Screen and document security", "Passwords", "Incident reporting"],
    assets: ["Privacy Checklist", "Security Scenarios", "Acknowledgement"],
    icon: "🔒",
    duration: "60 minutes",
    difficulty: "Beginner",
  },
  {
    id: "spindel-03-patient-arrival",
    day: 3,
    title: "Patient Arrival & Veradigm Acknowledgement",
    description: "Welcome the right patient, acknowledge the right appointment, and keep the day moving accurately.",
    objectives: [
      "Confirm the correct patient and appointment",
      "Acknowledge arrivals promptly in Veradigm",
      "Understand the impact of missed acknowledgement",
      "Coordinate respectfully with front-desk and clinical teams",
    ],
    topics: ["Identity confirmation", "Arrival acknowledgement", "No-show prevention", "Handoffs"],
    assets: ["Arrival Workflow", "Veradigm Checklist", "Scenario Quiz"],
    icon: "✅",
    duration: "45 minutes",
    difficulty: "Beginner",
  },
  {
    id: "spindel-04-clinical-workflow",
    day: 4,
    title: "Technician Workflow & Documentation",
    description: "Turn careful listening, precise testing, and clear documentation into a dependable clinical handoff.",
    objectives: [
      "Build a useful chief complaint and history",
      "Document pertinent positives and negatives accurately",
      "Verify medications, allergies, and relevant history",
      "Escalate findings outside normal expectations",
    ],
    topics: ["HPI structure", "Medication reconciliation", "Testing workflow", "Clinical escalation"],
    assets: ["HPI Guide", "Documentation Examples", "Skills Checklist"],
    icon: "📝",
    duration: "90 minutes",
    difficulty: "Intermediate",
  },
  {
    id: "spindel-05-safety",
    day: 5,
    title: "Clinical Safety, Infection Control & Equipment",
    description: "Create a clean, ready, reliable room through consistent turnover and thoughtful equipment checks.",
    objectives: [
      "Follow hand hygiene and disinfection expectations",
      "Prepare and reset examination rooms safely",
      "Recognize equipment problems before patient use",
      "Report injuries, exposures, and device concerns promptly",
    ],
    topics: ["Hand hygiene", "Surface disinfection", "Room readiness", "Equipment reporting"],
    assets: ["Room Turnover Checklist", "Equipment Safety Guide", "Incident Scenarios"],
    icon: "🧼",
    duration: "60 minutes",
    difficulty: "Beginner",
  },
  {
    id: "spindel-06-communication",
    day: 6,
    title: "Patient Communication & Service Recovery",
    description: "Make every interaction clearer, calmer, and more human—even when the schedule has other ideas.",
    objectives: [
      "Use respectful and understandable language",
      "Acknowledge delays and patient concerns",
      "Maintain boundaries during difficult interactions",
      "Know when to involve a supervisor or physician",
    ],
    topics: ["Empathy", "Delay communication", "Difficult interactions", "Service recovery"],
    assets: ["Communication Phrases", "Escalation Guide", "Role-Play Scenarios"],
    icon: "💬",
    duration: "60 minutes",
    difficulty: "Beginner",
  },
  {
    id: "spindel-07-referrals",
    day: 7,
    title: "Referrals, Patient Handouts & Care Coordination",
    description: "Create clean referral handoffs with approved information, verified details, and no avoidable plot twists.",
    objectives: [
      "Provide approved specialty information sheets",
      "Explain appointment expectations without giving unauthorized medical advice",
      "Confirm referral details and required records",
      "Complete a clear handoff to scheduling and front-desk teams",
    ],
    topics: ["Retina referrals", "Oculoplastic referrals", "Patient handouts", "Care coordination"],
    assets: ["Referral Checklist", "Handout Inventory", "Handoff Scenarios"],
    icon: "📄",
    duration: "45 minutes",
    difficulty: "Beginner",
  },
  {
    id: "spindel-08-urgent-calls",
    day: 8,
    title: "Urgent Calls, Same-Day Requests & Escalation",
    description: "Gather essential facts calmly and route urgent concerns through the current clinical escalation process.",
    objectives: [
      "Recognize symptoms requiring prompt clinical review",
      "Collect concise and complete callback information",
      "Use the approved late-day escalation workflow",
      "Document who received the message and what instructions were given",
    ],
    topics: ["Red-flag symptoms", "Telephone documentation", "Late-day workflow", "Provider escalation"],
    assets: ["Urgent Call Template", "Red-Flag Guide", "Escalation Scenarios"],
    icon: "☎️",
    duration: "60 minutes",
    difficulty: "Intermediate",
  },
  {
    id: "spindel-09-quality",
    day: 9,
    title: "Quality, Coding Support & Accountability",
    description: "Support accurate care through documentation that is complete, honest, and ready for a second look.",
    objectives: [
      "Understand how documentation supports coding",
      "Avoid adding information that was not obtained or performed",
      "Correct errors through approved procedures",
      "Take ownership while communicating respectfully across departments",
    ],
    topics: ["Documentation integrity", "Coding support", "Audit readiness", "Team accountability"],
    assets: ["Quality Checklist", "Documentation Scenarios", "Audit Awareness"],
    icon: "🎯",
    duration: "60 minutes",
    difficulty: "Intermediate",
  },
  {
    id: "spindel-10-readiness",
    day: 10,
    title: "Onboarding Readiness & Final Acknowledgement",
    description: "Bring the full onboarding picture into focus and plan the supervised practice that comes next.",
    objectives: [
      "Demonstrate understanding of core practice expectations",
      "Identify tasks that still require supervised validation",
      "Know where to locate current written protocols",
      "Commit to asking questions and protecting patient safety",
    ],
    topics: ["Final review", "Competency validation", "Ongoing education", "Employee acknowledgement"],
    assets: ["Final Assessment", "Supervisor Sign-Off", "Completion Certificate"],
    icon: "🏁",
    duration: "60 minutes",
    difficulty: "Intermediate",
  },
];

void legacySpindelOnboardingModules;
export const spindelOnboardingModules = spindelTechnicianModules;

export const spindelOnboardingLessons: LessonContent[] = [
  {
    day: 1,
    introduction: "Welcome to Spindel Eye Associates. This program is your guided tour of how we care for patients, support one another, and turn good intentions into dependable daily habits. Think of it as the wide-angle view before role-specific training brings the finer details into focus.",
    sections: [
      {
        title: "The Spindel Standard: Patient First, Team Always",
        paragraphs: [
          "Patients often arrive worried about vision changes, unfamiliar testing, wait times, insurance, or surgery. A calm greeting, accurate information, and a reliable handoff can shape the entire visit.",
          "Professionalism includes punctuality, appropriate appearance, respectful language, confidentiality, ownership of assigned work, and prompt communication when help is needed.",
        ],
        keyPoints: ["Protect dignity", "Communicate early", "Own the handoff", "Ask before guessing"],
      },
      {
        title: "Five Offices, One Team",
        paragraphs: [
          "Spindel Eye Associates serves patients through the Derry, Windham, Londonderry, Raymond, and Bedford offices. Procedures, staffing, and available equipment may vary by site, so employees must confirm local workflow with the supervisor at that location.",
          "Policies and schedules can change. The current written protocol, direct supervisor, and assigned physician take priority over training examples in this course.",
        ],
      },
    ],
    practiceChecklist: [
      "Identify your primary office, supervisor, and department contacts",
      "Locate the current employee handbook and clinical protocol resources",
      "Review attendance, call-out, break, and communication expectations",
      "Tour patient areas, staff areas, emergency exits, and supply locations—because the best time to find the tonometer covers is before you need them",
    ],
    safetyNote: "This onboarding course supports orientation but does not replace direct training, competency validation, the employee handbook, or current written practice policy.",
  },
  {
    day: 2,
    introduction: "Trust is part of every patient encounter. Protecting information is not a background task; it is a daily professional habit across electronic records, printed pages, messages, conversations, photographs, and screens.",
    sections: [
      {
        title: "Access With Purpose",
        paragraphs: [
          "Access only the information needed to perform your assigned work. Curiosity is not a valid reason to open a chart, including the chart of a friend, coworker, public figure, or family member.",
          "Discuss patient information only with authorized individuals and only where conversations cannot reasonably be overheard by unrelated patients or visitors.",
        ],
        keyPoints: ["Use only your own login", "Lock screens when stepping away", "Do not photograph records", "Dispose of paper securely"],
      },
      {
        title: "See Something, Report It Promptly",
        paragraphs: [
          "Report lost paperwork, misdirected messages, suspicious emails, unauthorized access, or accidental disclosure immediately. Fast reporting allows leadership to reduce harm and meet legal obligations.",
          "Do not attempt to hide or independently investigate an incident. Preserve relevant information and notify the designated supervisor or privacy contact.",
        ],
      },
    ],
    practiceChecklist: [
      "Demonstrate how to lock your workstation",
      "Identify approved methods for sending patient information",
      "Locate secure shredding and confidential disposal containers",
      "Name the person or role to contact for a suspected privacy incident",
    ],
    safetyNote: "Never enter real patient information into training examples, personal email, consumer AI tools, unapproved websites, or personal devices.",
  },
  {
    day: 3,
    introduction: "A polished visit starts with a precise arrival. Confirming the correct patient and acknowledging the correct appointment keeps the schedule trustworthy and prevents the awkward surprise of a no-show notice arriving while the patient is already in the building.",
    sections: [
      {
        title: "Right Patient, Right Appointment, Right Status",
        paragraphs: [
          "Use approved identifiers to confirm the correct patient and appointment. Similar names, family members arriving together, and multiple same-day appointments increase the risk of selecting the wrong chart.",
          "Acknowledge the patient promptly in Veradigm according to the employee's assigned role. If the system status appears incorrect or the patient is not on the expected schedule, pause and ask the front desk or supervisor rather than choosing a workaround.",
        ],
        keyPoints: ["Correct patient", "Correct appointment", "Prompt acknowledgement", "Escalate discrepancies"],
      },
      {
        title: "One Click, Many Consequences",
        paragraphs: [
          "An unacknowledged patient may receive an automated no-show notice even while being seen. This is confusing and embarrassing for the patient and creates avoidable follow-up work for staff.",
          "Good handoffs include a clear status update when a patient has arrived, is waiting, has a special need, or requires assistance moving through the office.",
        ],
      },
    ],
    practiceChecklist: [
      "Observe the approved arrival and acknowledgement workflow",
      "Practice finding the correct appointment without using real training data",
      "Explain what to do when the patient is missing from the expected schedule",
      "Describe how to report an acknowledgement error promptly",
    ],
    safetyNote: "Never acknowledge a patient you have not correctly identified. Ask for help whenever the schedule, chart, or arrival status does not match.",
  },
  {
    day: 4,
    introduction: "Excellent technician documentation turns a busy visit into a clear clinical story: why the patient is here, what changed, what was measured, and what needs attention. The goal is useful precision—not a novel, and definitely not creative fiction.",
    sections: [
      {
        title: "Build the Clinical Story",
        paragraphs: [
          "Begin with the patient's concern in plain language, then clarify onset, duration, laterality, frequency, severity, triggers, associated symptoms, and relevant treatments. Document meaningful negatives when they affect clinical urgency.",
          "For visual symptoms, determine whether the issue is monocular or binocular, constant or intermittent, and associated with pain, redness, discharge, photophobia, flashes, floaters, field loss, diplopia, trauma, or recent surgery.",
        ],
        keyPoints: ["Do not diagnose", "Do not copy forward without verification", "Use the patient's words", "Escalate red flags"],
      },
      {
        title: "Measure Carefully. Document Honestly.",
        paragraphs: [
          "Verify medications, allergies, ocular history, surgeries, and relevant systemic conditions according to the visit type. Record only tests and observations that were actually completed.",
          "When a measurement appears inconsistent, repeat it when appropriate, check technique and equipment, and notify the clinician. Never change a result simply to make it look expected.",
        ],
      },
    ],
    practiceChecklist: [
      "Complete a supervised sample HPI using a fictional scenario",
      "Demonstrate medication and allergy verification",
      "Review the approved testing sequence for your assigned doctors",
      "Identify findings that require immediate clinician notification",
    ],
    safetyNote: "Clinical testing must be performed only after training and within the employee's assigned scope. A course quiz is not proof of hands-on competency.",
  },
  {
    day: 5,
    introduction: "A room can look tidy and still not be ready. Consistent infection control, thoughtful setup, and a quick equipment check create the quiet reliability patients and clinicians depend on.",
    sections: [
      {
        title: "Reset the Room With Intention",
        paragraphs: [
          "Perform hand hygiene at the appropriate times and disinfect patient-contact surfaces using the approved product, contact time, and workflow. Replace disposable items and restock without creating contamination.",
          "Do not assume a room was cleaned because it appears orderly. Follow the defined turnover process and communicate when a room cannot safely be used.",
        ],
        keyPoints: ["Correct product", "Correct wet contact time", "Clean patient-contact surfaces", "Separate clean and used items"],
      },
      {
        title: "When the Equipment Blinks First",
        paragraphs: [
          "Before use, check that equipment moves, locks, illuminates, and responds as expected. Examples of reportable concerns include unstable slit lamps, dim or intermittent illumination, loose headrests, damaged handles, or phoropters that do not lock.",
          "Remove unsafe equipment from service when directed, label it appropriately, and report the room, device, symptoms, and urgency to the responsible person. Do not attempt unauthorized repairs.",
        ],
      },
    ],
    practiceChecklist: [
      "Demonstrate approved room turnover",
      "Locate personal protective equipment and spill supplies",
      "Perform a pre-use equipment safety check",
      "Practice writing a clear equipment problem report",
    ],
    safetyNote: "Stop using equipment when a defect could affect patient safety or measurement accuracy. Notify the supervisor and clinician immediately.",
  },
  {
    day: 6,
    introduction: "Patients remember how we made a complicated day feel. Clear expectations, a calm tone, and a reliable next step can lower the temperature of an interaction—even when the schedule refuses to behave like a perfectly aligned eye chart.",
    sections: [
      {
        title: "Clarity Is a Form of Care",
        paragraphs: [
          "Introduce yourself, explain your role, describe the next step, and check understanding. Avoid unexplained medical terms and do not promise a diagnosis, treatment, wait time, or result that you cannot guarantee.",
          "When delays occur, acknowledge the wait and provide an honest update. Silence often feels dismissive even when the team is working hard behind the scenes.",
        ],
        keyPoints: ["Listen without interrupting", "Acknowledge the concern", "Explain the next step", "Avoid promises outside your authority"],
      },
      {
        title: "Stay Calm, Set Boundaries, Bring Help Early",
        paragraphs: [
          "Remain calm, do not argue, and set respectful limits. Patients may be upset, but threatening, discriminatory, or abusive conduct should be escalated according to policy.",
          "Bring in a supervisor early when a concern involves clinical advice, money, privacy, repeated dissatisfaction, threats, or demands outside established policy.",
        ],
      },
    ],
    practiceChecklist: [
      "Practice a delay update using plain language",
      "Role-play acknowledging a frustrated patient's concern",
      "Identify phrases that sound dismissive or argumentative",
      "Name the situations that require supervisor involvement",
    ],
    safetyNote: "Never allow pressure from an upset person to cause unsafe care, unauthorized disclosure, alteration of a record, or a promise outside your role.",
  },
  {
    day: 7,
    introduction: "A referral is more than a destination. It is a handoff that should leave the patient knowing where to go, what to bring, and what happens next—without sending them on an administrative scavenger hunt.",
    sections: [
      {
        title: "Approved Patient Information",
        paragraphs: [
          "Use the current approved information sheet for the specialty and keep examination rooms stocked according to office procedure. Handouts reduce confusion about visit length, dilation, testing, transportation, and preparation.",
          "Do not replace an approved handout with memory or personal advice. When a patient's situation falls outside the written information, ask the referring doctor, technician, scheduler, or supervisor.",
        ],
        keyPoints: ["Use current forms", "Stock designated rooms", "Explain logistics, not unauthorized medical advice", "Document important instructions"],
      },
      {
        title: "Complete Care Coordination",
        paragraphs: [
          "Confirm the reason for referral, intended specialist, urgency, records, testing, and patient contact information. A vague handoff can create delays and repeated calls.",
          "Before the patient leaves, make sure the next step is clear: scheduling, checkout, a phone call, a referral form, or instructions from the clinician.",
        ],
      },
    ],
    practiceChecklist: [
      "Locate current retina and oculoplastic information sheets",
      "Review who is responsible for stocking and distributing handouts",
      "Complete a fictional referral handoff",
      "Explain what to do when referral instructions are unclear",
    ],
    safetyNote: "Urgency and medical instructions must come from an authorized clinician. Do not downgrade, delay, or reinterpret a clinical referral independently.",
  },
  {
    day: 8,
    introduction: "Urgent calls require calm, structured information gathering and prompt clinical review. Your role is to capture essential facts, document accurately, and connect the caller with the approved clinical pathway—not to diagnose or decide independently that concerning symptoms can wait.",
    sections: [
      {
        title: "Collect the Essentials",
        paragraphs: [
          "Record the patient's name, reliable callback number, affected eye, symptom, onset, severity, relevant surgery or trauma, and associated warning signs. Confirm the message was routed to the correct clinical team.",
          "Warning signs can include sudden vision loss, a curtain or field defect, new flashes and floaters, severe pain, chemical exposure, trauma, postoperative concerns, marked redness, or neurologic symptoms. Follow the current urgent-care protocol rather than relying only on this list.",
        ],
        keyPoints: ["Do not diagnose", "Use a reliable callback number", "Record onset and laterality", "Escalate warning signs promptly"],
      },
      {
        title: "Late-Day Requests",
        paragraphs: [
          "When no same-day emergency slot remains late in the day, follow the current call-center and clinical escalation process. The established workflow has included collecting the patient's name, phone number, and brief concern for doctor review through the designated clinical team.",
          "Because provider location and coverage can change, verify the current process for Derry and the alternate workflow when no reviewing doctor is available there. Document the person who accepted the message and any instructions communicated to the patient.",
        ],
      },
    ],
    practiceChecklist: [
      "Use the urgent-call template with a fictional scenario",
      "Identify current same-day and late-day escalation contacts",
      "Explain how to document a completed handoff",
      "Review emergency-service instructions approved by leadership",
    ],
    safetyNote: "A patient with a potentially vision- or life-threatening problem must receive prompt direction from an authorized clinician or emergency service according to current policy.",
  },
  {
    day: 9,
    introduction: "High-quality documentation helps the next person understand what happened without guesswork. It supports continuity, accountability, coding, audits, and patient trust—and it should hold up when viewed through more than one lens.",
    sections: [
      {
        title: "Documentation Integrity",
        paragraphs: [
          "Document what was obtained, observed, communicated, and performed. Do not add a normal finding because it is usually present, and do not copy information forward without confirming it remains accurate.",
          "When an error is found, follow the approved correction process. Never delete, backdate, or obscure information in a way that misrepresents the original record.",
        ],
        keyPoints: ["Only document completed work", "Verify copied information", "Use approved corrections", "Ask when coding responsibility is unclear"],
      },
      {
        title: "Quality Is Shared Work",
        paragraphs: [
          "Technicians, front-desk staff, call-center staff, billers, managers, and doctors depend on each other's accuracy. Raise recurring workflow problems with facts and examples rather than blame.",
          "Audit requests and appeals may require precise records. Timely completion, legible scanning, correct routing, and confirmation of receipt reduce avoidable rework.",
        ],
      },
    ],
    practiceChecklist: [
      "Review an approved example of a complete technician note",
      "Identify documentation that supports the visit without overstating it",
      "Practice correcting a fictional entry using the approved method",
      "Describe how to raise a recurring quality concern professionally",
    ],
    safetyNote: "Never change documentation solely to increase reimbursement or satisfy an expected code. The record must reflect the care actually provided.",
  },
  {
    day: 10,
    introduction: "You are at the final module: the place to bring the full onboarding picture into focus. Completion confirms understanding of core expectations; it does not validate every hands-on skill or expand your assigned scope.",
    sections: [
      {
        title: "Readiness Is More Than a Quiz",
        paragraphs: [
          "Employees must demonstrate required tasks with a qualified trainer or supervisor. Some skills require repeated observation, supervised practice, and formal sign-off before independent performance.",
          "A safe employee speaks up when unsure, identifies changes in policy, and asks for feedback. Questions are expected during onboarding and remain appropriate throughout employment.",
        ],
        keyPoints: ["Complete supervised validation", "Use current protocols", "Ask before acting", "Report safety concerns"],
      },
      {
        title: "Your Ongoing Responsibilities",
        paragraphs: [
          "Maintain confidentiality, complete assigned education, communicate schedule or attendance concerns promptly, and participate respectfully in quality improvement.",
          "Review changes communicated by managers and physicians. When a verbal instruction appears inconsistent with written policy or patient safety, pause and seek clarification through the chain of command.",
        ],
      },
    ],
    practiceChecklist: [
      "Review remaining competencies with your supervisor",
      "Identify your next scheduled training or observation",
      "Confirm where updated policies and announcements are posted",
      "Complete the final knowledge assessment and employee acknowledgement",
    ],
    safetyNote: "The completion certificate documents online onboarding only. It is not professional certification, licensure, or authorization to perform unsupervised clinical procedures.",
  },
];

function question(
  id: string,
  prompt: string,
  options: string[],
  correctAnswer: string,
  explanation: string,
) {
  return { id, question: prompt, type: "multiple-choice" as const, options, correctAnswer, explanation };
}

export const spindelOnboardingQuizzes: QuizData[] = [
  {
    id: "spindel-quiz-1", title: "The Spindel Standard", description: "Check your understanding of the habits that help five offices work as one team.", day: 1, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s1q1", "You arrive at a different Spindel office and a local workflow is unclear. What is the best next step?", ["Guess based on a prior employer", "Ask the current supervisor and review the written protocol", "Wait until an error occurs", "Create a personal workaround"], "Ask the current supervisor and review the written protocol", "Current written policy and supervisor direction take priority."),
      question("s1q2", "Which action best supports a patient-first culture?", ["Avoid discussing delays", "Complete only tasks visible to patients", "Provide accurate updates and reliable handoffs", "Promise an exact visit end time"], "Provide accurate updates and reliable handoffs", "Clear updates and ownership reduce confusion."),
      question("s1q3", "Online onboarding replaces hands-on competency validation.", ["True", "False"], "False", "Clinical skills still require direct training and sign-off."),
    ],
  },
  {
    id: "spindel-quiz-2", title: "Privacy in Practice", description: "Apply minimum-necessary access and prompt incident reporting to everyday situations.", day: 2, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s2q1", "A familiar name appears on tomorrow's schedule. When may an employee open that patient's chart?", ["Whenever the patient is known personally", "Only when needed for assigned work", "Whenever a coworker is curious", "After work for education"], "Only when needed for assigned work", "Chart access must have a legitimate work purpose."),
      question("s2q2", "What is the best response to a misdirected patient message?", ["Delete it and say nothing", "Try to solve it privately", "Report it immediately through the approved process", "Post a warning in a group chat"], "Report it immediately through the approved process", "Prompt reporting helps limit harm."),
      question("s2q3", "Real patient information may be used in personal AI tools when names are removed.", ["True", "False"], "False", "Use only approved systems and follow the practice's privacy rules."),
    ],
  },
  {
    id: "spindel-quiz-3", title: "A Smooth Arrival", description: "Practice the checks that keep appointment status accurate from the front door forward.", day: 3, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s3q1", "Two patients have similar names on the schedule. Before acknowledging an arrival, staff should first:", ["Choose the first similar name", "Confirm the correct patient and appointment", "Wait until checkout", "Ask another patient"], "Confirm the correct patient and appointment", "Correct identity and appointment selection are essential."),
      question("s3q2", "What can happen when a present patient is not acknowledged?", ["Nothing", "The patient may receive an incorrect no-show notice", "The chart closes permanently", "The insurance automatically denies"], "The patient may receive an incorrect no-show notice", "Arrival status affects automated communications."),
      question("s3q3", "A schedule discrepancy should be handled with a personal workaround.", ["True", "False"], "False", "Pause and involve the appropriate front-desk or supervisory staff."),
    ],
  },
  {
    id: "spindel-quiz-4", title: "The Clear Clinical Story", description: "Apply safe history-taking, measurement, and documentation principles.", day: 4, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s4q1", "Which note is most useful?", ["Eyes bad", "No complaints", "Intermittent binocular diplopia for two weeks, worse at distance, no pain or trauma", "Same as last visit"], "Intermittent binocular diplopia for two weeks, worse at distance, no pain or trauma", "Specific onset, pattern, and associated symptoms support clinical review."),
      question("s4q2", "A measurement does not fit the rest of the examination. What should the technician do?", ["Change it to a normal value", "Ignore it", "Check technique, repeat when appropriate, and notify the clinician", "Delete the test"], "Check technique, repeat when appropriate, and notify the clinician", "Unexpected results require verification and escalation, not alteration."),
      question("s4q3", "A technician should diagnose the cause of symptoms before the doctor enters.", ["True", "False"], "False", "The technician gathers and documents information without independently diagnosing."),
    ],
  },
  {
    id: "spindel-quiz-5", title: "Ready Room, Reliable Equipment", description: "Check your approach to room turnover, disinfection, and equipment concerns.", day: 5, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s5q1", "A slit lamp light is intermittent. What is the best action?", ["Keep using it until it stops", "Report it and follow instructions for removing unsafe equipment from use", "Strike the housing", "Ask the patient if it is bright enough"], "Report it and follow instructions for removing unsafe equipment from use", "Equipment defects can affect safety and accuracy."),
      question("s5q2", "Room disinfection should follow:", ["Whatever product is nearby", "The approved product, surfaces, and contact time", "A dry paper towel only", "A once-daily schedule regardless of use"], "The approved product, surfaces, and contact time", "Effective disinfection depends on the approved process."),
      question("s5q3", "Employees may perform unauthorized repairs when the office is busy.", ["True", "False"], "False", "Report and isolate unsafe equipment rather than improvising repairs."),
    ],
  },
  {
    id: "spindel-quiz-6", title: "Clarity Under Pressure", description: "Choose responses that combine empathy, boundaries, and timely escalation.", day: 6, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s6q1", "A patient asks for an update after an unexpected delay. Which response is most helpful?", ["The doctor is always late", "I do not know", "I am sorry for the wait. The team is completing the prior patient's care, and I will update you again shortly", "You can leave"], "I am sorry for the wait. The team is completing the prior patient's care, and I will update you again shortly", "Acknowledge the concern and provide an honest next step."),
      question("s6q2", "When should a supervisor be involved?", ["Only after a complaint is posted online", "Early when concerns involve safety, privacy, money, threats, or demands outside policy", "Never", "Only at closing"], "Early when concerns involve safety, privacy, money, threats, or demands outside policy", "Early escalation supports safe service recovery."),
      question("s6q3", "Staff should promise an exact outcome to calm an upset patient.", ["True", "False"], "False", "Do not make promises outside your authority."),
    ],
  },
  {
    id: "spindel-quiz-7", title: "Close the Referral Loop", description: "Build specialty handoffs that are complete, consistent, and easy to follow.", day: 7, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s7q1", "Why are approved specialty handouts important?", ["They replace the doctor", "They help explain logistics and expectations consistently", "They guarantee treatment", "They eliminate scheduling"], "They help explain logistics and expectations consistently", "Current handouts reduce avoidable confusion."),
      question("s7q2", "A referral note leaves the next step unclear. What should happen before the patient leaves?", ["Invent a likely answer", "Ask the authorized clinician, scheduler, or supervisor", "Discard the referral", "Tell the patient to search online"], "Ask the authorized clinician, scheduler, or supervisor", "Unclear clinical or scheduling instructions require clarification."),
      question("s7q3", "A referral is complete once the patient leaves the exam room.", ["True", "False"], "False", "The next step and responsible handoff must be clear."),
    ],
  },
  {
    id: "spindel-quiz-8", title: "Urgent Calls and Escalation", description: "Confirm the information and routing required for prompt clinical review.", day: 8, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s8q1", "Which information is essential for an urgent callback?", ["Name and reliable phone number only", "Name, callback number, affected eye, onset, symptom, and warning signs", "Insurance plan only", "Preferred pharmacy only"], "Name, callback number, affected eye, onset, symptom, and warning signs", "A concise clinical message needs identifying, contact, and symptom details."),
      question("s8q2", "What should staff do when no same-day slot remains late in the day?", ["Tell every patient to wait until morning", "Follow the current designated clinical escalation workflow", "Diagnose over the phone", "Delete the message"], "Follow the current designated clinical escalation workflow", "Provider coverage and routing must follow current policy."),
      question("s8q3", "Sudden vision loss can wait for routine scheduling without clinical review.", ["True", "False"], "False", "Sudden vision loss requires prompt escalation."),
    ],
  },
  {
    id: "spindel-quiz-9", title: "Quality You Can Stand Behind", description: "Apply documentation integrity and constructive accountability to daily work.", day: 9, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s9q1", "What may be documented in the medical record?", ["Only information actually obtained, observed, communicated, or performed", "Any normal finding expected for the visit", "A copied note that seems close enough", "Information added solely to support a higher code"], "Only information actually obtained, observed, communicated, or performed", "The record must truthfully reflect the encounter."),
      question("s9q2", "You notice the same workflow problem several times. How should you raise it?", ["With blame and public criticism", "With facts, examples, and the appropriate chain of communication", "By changing the process alone", "By ignoring it"], "With facts, examples, and the appropriate chain of communication", "Specific, professional reporting supports improvement."),
      question("s9q3", "Documentation may be changed solely to increase reimbursement.", ["True", "False"], "False", "Documentation must reflect actual care."),
    ],
  },
  {
    id: "spindel-quiz-10", title: "Bring It All Into Focus", description: "Confirm your readiness to continue role-specific, supervised training.", day: 10, passingScore: SPINDEL_PASSING_SCORE,
    questions: [
      question("s10q1", "What does the onboarding certificate confirm?", ["Independent clinical competency", "Professional certification", "Completion of the online onboarding modules", "Licensure"], "Completion of the online onboarding modules", "Hands-on competency requires separate validation."),
      question("s10q2", "What is the safest response when a task exceeds your training?", ["Attempt it quietly", "Ask a qualified supervisor before proceeding", "Ask the patient for instructions", "Document that it was done"], "Ask a qualified supervisor before proceeding", "Speaking up protects patients and employees."),
      question("s10q3", "Current written policy and supervisor direction take priority over training examples.", ["True", "False"], "True", "Operational protocols can change and must be confirmed."),
    ],
  },
];

export function getSpindelLesson(day: number): LessonContent | undefined {
  return spindelOnboardingLessons.find((lesson) => lesson.day === day);
}

export function getSpindelQuiz(day: number): QuizData | undefined {
  return spindelOnboardingQuizzes.find((quiz) => quiz.day === day);
}


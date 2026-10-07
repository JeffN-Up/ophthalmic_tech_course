import type { CurriculumModule } from "@/data/curriculum";

const objectives = [
  ['Identify anterior and posterior structures', 'Trace light and the visual pathway', 'Connect anatomy with clinical testing'],
  ['Explain refractive error and prescription components', 'Compare objective and subjective testing', 'Recognize measurement setup errors'],
  ['Obtain a focused HPI and reconcile drops', 'Perform ordered entrance tests under supervision', 'Document observations and escalate abnormal findings'],
  ['Measure acuity and pinhole accurately', 'Measure and document glasses with lensometry', 'Support supervised refraction and BCVA'],
  ['Explain factors influencing IOP', 'Demonstrate supervised Goldmann technique', 'Document method, quality, and escalation'],
  ['Select ordered imaging and field protocols', 'Recognize artifacts and reliability problems', 'Verify saved images and reports'],
  ['Adapt workup to the visit type', 'Apply contact-lens and postoperative instructions', 'Resolve conflicts with the current doctor order'],
  ['Review all five ophthalmologist protocols', 'Preserve conditional testing differences', 'Demonstrate physician-specific workup handoffs'],
  ['Review all five optometrist protocols', 'Apply age and visit-specific testing differences', 'Demonstrate physician-specific workup handoffs'],
  ['Recognize urgent symptoms and escalate', 'Demonstrate infection control and procedure safety', 'Complete a supervised mock workup and competency plan'],
];

export const spindelTechnicianModules: CurriculumModule[] = [
  ["spindel-01-anatomy", "Eye Anatomy & Visual Pathways", "Learn the eye's structures and follow light from the cornea to the brain.", "👁️", "Beginner"],
  ["spindel-02-optics", "Optics & Testing Physics", "Understand how light, lenses, focus, and measurement create the results technicians record.", "🔬", "Beginner"],
  ["spindel-03-exam-skills", "Core Examination Skills", "Build an accurate history and perform the entrance tests used throughout a patient visit.", "🩺", "Beginner"],
  ["spindel-04-refraction", "Visual Acuity, Lensometry & Refraction", "Connect visual acuity, pinhole, glasses measurements, and best-corrected vision.", "👓", "Intermediate"],
  ["spindel-05-tonometry", "Tonometry & Pressure Testing", "Learn why pressure measurements differ and when results need confirmation or escalation.", "🎯", "Intermediate"],
  ["spindel-06-diagnostics", "Diagnostic Imaging & Equipment", "Capture dependable OCT, Optomap, field, and corneal test results while spotting artifacts.", "📷", "Intermediate"],
  ["spindel-07-visit-workups", "Visit-Type Workups", "Practice the shared sequence for routine, medical, urgent, pressure, contact-lens, and muscle visits.", "📋", "Intermediate"],
  ["spindel-08-doctor-workups-a", "MD (Ophthalmologists) Workups", "Learn the required workup differences for Spindel, Vazan, Guenena, Slentz, and Farahani.", "🧭", "Advanced"],
  ["spindel-09-doctor-workups-b", "OD (Optometrists) Workups", "Learn the required workup differences for Wood, O'Block, Nguyen, Leo, and Noall.", "🗂️", "Advanced"],
  ["spindel-10-readiness", "Safety, Urgency & Final Readiness", "Bring anatomy, testing, workups, safety, and escalation together for supervised practice.", "🏁", "Advanced"],
].map(([id, title, description, icon, difficulty], index) => ({
  id,
  day: index + 1,
  title,
  description,
  objectives: objectives[index],
  topics: [],
  assets: [],
  icon,
  duration: "60 minutes",
  difficulty: difficulty as CurriculumModule["difficulty"],
}));

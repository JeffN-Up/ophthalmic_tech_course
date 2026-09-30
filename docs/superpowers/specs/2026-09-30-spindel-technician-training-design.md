# Spindel Technician Training Course Design

**Date:** 2026-09-30  
**Status:** Approved direction; implementation planning follows

## Goal

Rebuild the current Spindel onboarding course so its main purpose is training ophthalmic technicians. Keep only the administrative material technicians truly need, and make anatomy, optics, testing, equipment skills, patient workups, and doctor-specific protocols the center of the course.

The finished course must keep the current Spindel-branded staff experience, sign-in, progress tracking, quizzes, and completion system.

## Approved source material

Use these sources without inventing clinical instructions:

1. The existing technician lessons, quizzes, and curriculum already in this repository.
2. The user's Google Drive **Bootcamp** folder, including the numbered media files and their index descriptions.
3. The **SEA Tech Alley** Clinical Workup Protocol page and its linked source documents.

The source documents remain the authority for clinical workflow. If two sources conflict, flag the conflict for review instead of silently choosing one.

## Required audience

Every technician completes the full course, including all included doctor-specific protocols. The course will not hide protocols based on the technician's usual location or doctor assignment.

## Doctor protocol scope

Include the currently listed workup protocols for:

- Dr. Spindel
- Dr. Vazan
- Dr. Guenena
- Dr. Slentz
- Dr. Farahani
- Dr. Wood
- Dr. O'Block
- Dr. Nguyen
- Dr. Leo
- Dr. Noall

Do **not** include Dr. Prendergast.

Clinic-wide source material includes daily clinical reminders, when to refract, Optomap guidelines, OCT scans and reports, and post-op IOL information. The unavailable day-to-day OCT link must be flagged as a source gap and must not be guessed or recreated.

## Course structure

### 1. Foundations of the Eye

- Ocular anatomy and anatomical language
- External and internal structures
- Extraocular muscles
- The visual pathway from cornea to brain
- Basic physiology and common conditions connected to each structure

Use the strongest Bootcamp anatomy and visual-pathway media as Core material. Place useful alternate explanations in Extended Learning.

### 2. Optics and Testing Physics

- How light travels through and focuses in the eye
- Sphere, cylinder, axis, plus/minus power, and astigmatism
- Visual acuity and pinhole principles
- Lensometry and autorefraction principles
- Refraction principles and best-corrected visual acuity
- Sources of measurement error and why results may not match

Content must explain both how to perform a task and why the measurement matters.

### 3. Core Technician Examination Skills

- Patient history and symptom-focused HPI
- Distance and near vision
- Pupils, EOMs, CVFs, stereo, and color vision
- Lensometry, autorefraction, and autokeratometry
- Tonometry, including ORA and Goldmann decision points
- Dilation preparation and safety
- Accurate documentation and escalation

Administrative instructions may appear here only when they directly support safe clinical work.

### 4. Diagnostic Testing and Equipment

- OCT macula, optic nerve/RNFL, ganglion cell, anterior segment, and OCT-A concepts
- Optomap capture, filters, steering, and doctor-specific rules
- Visual fields
- Corneal testing and Pentacam
- Retinal imaging and other equipment already represented in the repository
- Image quality, artifacts, troubleshooting, report selection, and when to repeat a test

Each lesson should combine anatomy, physics, equipment steps, quality checks, and the relevant workup rule.

### 5. Visit-Type Workups

Teach the shared meaning and normal sequence for each supported visit type, including:

- Routine Eye Exam (REE)
- Comprehensive Exam (CE)
- Dilated Exam (DE)
- External Exam (EE)
- Emergency Exam (EMER)
- IOP Check
- Visual Field Follow-Up (VFFU)
- Contact Lens New Fit and Check
- Muscle Exam
- Relevant post-op and surgical follow-ups in the source protocols

Use a common baseline first, then clearly show where an individual doctor's protocol differs.

### 6. Doctor-Specific Workup Protocols

Give each included doctor a dedicated, required lesson. Organize each lesson by visit type rather than presenting a large unstructured document.

Each doctor lesson should contain:

- Required steps in order
- Conditional steps and thresholds
- Testing differences
- Dilation/Optomap rules
- Doctor-specific reminders
- A short scenario-based knowledge check
- A visible source/update note so staff know when the protocol was last reviewed

### 7. Safety, Urgency, and Communication

- New flashes and floaters
- Sudden vision loss or change
- Pain, trauma, infection, and other urgent symptoms
- Infection control and equipment cleaning
- When to pause and ask the doctor
- Safe handoff and documentation

Training must teach technicians to collect accurate information, perform authorized tests, and escalate concerns. It must not teach independent diagnosis or treatment.

### 8. Readiness and Completion

- Module knowledge checks
- Scenario questions that require choosing the correct workup or test
- Practical observation checklists for skills that cannot be proven by a quiz
- A final mixed assessment covering anatomy, optics, testing, safety, visit types, and doctor protocols
- Existing progress and completion tracking

## Content placement rules

Every content item must be mapped before it is added.

For each document, video, image, or lesson, record:

- Source and stable identifier
- Topic
- Learning objective
- Destination module and lesson
- Core or Extended Learning status
- Any doctor or visit-type relationship
- Whether a transcript, caption, or text alternative is available
- Review status and safety notes

A content item may appear in more than one lesson when it directly supports more than one learning objective. Reuse should be intentional; the same item should not be copied merely to increase lesson size.

Prefer one canonical content record with references from multiple lessons so corrections only need to be made once.

## Bootcamp media rules

- Place media beside the lesson concept it demonstrates.
- Use the clearest and most accurate item as Core.
- Put alternate explanations, repeated anatomy views, and deeper surgical context in Extended Learning.
- Add a brief introduction explaining what the learner should watch for.
- Add a knowledge check or practical connection after Core media.
- Preserve creator/source attribution.
- Clearly label AI-generated or simulated visuals.
- Never use a visual as the sole authority for a clinical protocol.

## User experience

The course home should lead with technician skills and show the learning path in plain language. Administrative topics should no longer dominate the first screen.

Learners should be able to:

- See what they will learn and why it matters
- Resume where they stopped
- Distinguish Core from Extended Learning
- Find a doctor protocol quickly after completing training
- See protocol source and last-reviewed information

## Data and maintenance design

Keep reusable course content separate from the page layout. Use structured records for modules, lessons, media, quizzes, visit types, and doctor protocol variations.

Doctor protocol content should be easy to update without rewriting the whole course. Protocol records must include a source link and review date. A future update can compare the local course record with the SEA Tech Alley source and flag changes for human review.

## Verification requirements

Before completion:

- Every included doctor must have a required lesson.
- Dr. Prendergast must not appear in course content or assessments.
- Every Bootcamp item used must have an intentional module placement.
- No broken media should be presented as available.
- All clinical instructions must trace back to an approved source.
- Existing sign-in, progress, quiz, and completion behavior must still work.
- Automated tests, type checking, and production build must pass.
- The rendered course must be checked at desktop and narrow/mobile widths.
- A manual source review must confirm doctor and visit-type differences were not flattened into one generic protocol.

## Out of scope for this phase

- Changing the SEA Tech Alley website or source documents
- Inventing missing clinical instructions
- Payment or enrollment changes
- Removing the staff-access system
- Making doctor protocols optional by technician assignment

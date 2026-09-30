# Spindel Technician Training Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the administration-heavy Spindel onboarding path with a required ten-module ophthalmic technician course built from the repository curriculum, the Bootcamp Drive folder, and approved SEA Tech Alley protocols.

**Architecture:** Preserve the existing ten-module progress and certificate contract while separating curriculum, clinical protocols, and protected media into focused typed data files. Render those records through the existing dashboard and module page, with doctor-specific workups as required lesson sections and Bootcamp media labeled Core or Extended Learning.

**Tech Stack:** React 19, TypeScript 5.6, Vite 7, Express 4, Vitest 2, Tailwind CSS, Google Drive protected-media embeds

**Spec:** `docs/superpowers/specs/2026-09-30-spindel-technician-training-design.md`

## Global Constraints

- Keep exactly ten numbered modules so existing progress records and `MODULE_COUNT = 10` remain compatible.
- Every Spindel technician completes every module and all included doctor protocols.
- Include Drs. Spindel, Vazan, Guenena, Slentz, Farahani, Wood, O'Block, Nguyen, Leo, and Noall; exclude Dr. Prendergast everywhere.
- Clinical instructions must trace to SEA Tech Alley or an approved linked source; never invent missing guidance.
- Mark the inaccessible day-to-day OCT document unavailable; do not reconstruct its content.
- Use one canonical media record that may reference multiple module days.
- Label every media record `core` or `extended`, retain attribution, and visibly warn on AI-generated or simulated visuals.
- Keep Spindel branding, staff authentication, quiz scoring, progress, and certificate behavior working.
- Do not require payment or Stripe configuration for Spindel staff training.
- Preserve the five pre-existing uncommitted files unless a planned task intentionally modifies them; inspect their diffs before every commit.

## Review Focus

- A returning technician with old day-based progress must keep the same completed-day records after the curriculum changes; Task 6 pins the ten-day contract.
- A media item mapped to multiple lessons must render in each intended lesson without duplicate records; Tasks 2 and 5 test this.
- An unavailable, malformed, or unapproved Drive item must not produce a broken learner card; Tasks 2 and 5 test filtering and fallback behavior.
- Similar doctor workups must retain their real differences instead of being merged into one generic sequence; Tasks 3 and 4 assert doctor and visit-type coverage.
- Narrow/mobile screens must keep module navigation, protocol tables, and Core/Extended labels readable; Task 7 includes responsive browser checks.

---

### Task 1: Training Data Contracts and Ten-Module Skeleton

**Files:**
- Create: `client/src/data/spindelTrainingTypes.ts`
- Create: `client/src/data/spindelTrainingCatalog.test.ts`
- Modify: `client/src/data/spindelOnboarding.ts`

**Interfaces:**
- Produces: `TrainingTier = "core" | "extended"`
- Produces: `TrainingSource { label: string; url: string; reviewedOn: string; available: boolean }`
- Produces: `ProtocolStep { label: string; detail: string; condition?: string }`
- Produces: `VisitProtocol { visitType: string; summary: string; steps: ProtocolStep[] }`
- Produces: `DoctorProtocol { id: string; doctorName: string; source: TrainingSource; visits: VisitProtocol[]; reminders: string[] }`
- Produces: existing exports `spindelOnboardingModules`, `spindelOnboardingLessons`, `spindelOnboardingQuizzes`, `getSpindelLessonByDay`, and `getSpindelQuizByDay` remain stable.

- [ ] **Step 1: Write the failing catalog-shape test**

Add assertions that the Spindel course has days `1` through `10` exactly once and uses these module titles in order: `Eye Anatomy & Visual Pathways`, `Optics & Testing Physics`, `Core Examination Skills`, `Visual Acuity, Lensometry & Refraction`, `Tonometry & Pressure Testing`, `Diagnostic Imaging & Equipment`, `Visit-Type Workups`, `Doctor Workups: Spindel through Farahani`, `Doctor Workups: Wood through Noall`, and `Safety, Urgency & Final Readiness`.

- [ ] **Step 2: Run the targeted test and verify it fails**

Run: `pnpm vitest run client/src/data/spindelTrainingCatalog.test.ts`

Expected: FAIL because the new module titles and training types do not exist.

- [ ] **Step 3: Create the training types and replace only the module metadata**

Define the interfaces above in `spindelTrainingTypes.ts`. Replace `spindelOnboardingModules` with the approved ten-module skeleton; keep days and export names stable. Do not write the detailed lesson bodies in this task.

- [ ] **Step 4: Run the targeted test and type checker**

Run: `pnpm vitest run client/src/data/spindelTrainingCatalog.test.ts && pnpm run check`

Expected: PASS.

- [ ] **Step 5: Commit the task**

```bash
git add client/src/data/spindelTrainingTypes.ts client/src/data/spindelTrainingCatalog.test.ts client/src/data/spindelOnboarding.ts
git commit -m "feat: define Spindel technician training path"
```

### Task 2: Bootcamp Media Inventory and Placement Rules

**Files:**
- Create: `client/src/data/spindelMediaCatalog.test.ts`
- Modify: `client/src/data/spindelMedia.ts`
- Modify: `server/security.ts`
- Modify: `server/security.test.ts`
- Modify: `README.md`
- Modify: `render.yaml`

**Interfaces:**
- Consumes: `TrainingTier` from Task 1.
- Produces: `SpindelApprovedMedia` with `sourceLabel: string`, `learningObjective: string`, `learningTier: TrainingTier`, `moduleDays: number[]`, `aiGenerated: boolean`, and the existing Drive/embed fields.
- Produces: `getSpindelMediaForDay(media, day, tier?)` where omitted `tier` returns both tiers.
- Produces: `groupSpindelMediaForDay(media, day): { core: SpindelApprovedMedia[]; extended: SpindelApprovedMedia[] }`.
- Produces: `parseProtectedMediaCatalog(value)` accepting at most 100 canonical items so all Bootcamp files can be represented.

- [ ] **Step 1: Write failing client tests for canonical reuse and learning tiers**

Test that one media object with `moduleDays: [1, 2]` is returned for both days, `tier: "core"` filters correctly, duplicate records are unnecessary, and every catalog item has attribution and a learning objective.

- [ ] **Step 2: Write failing server tests for the expanded protected schema**

Test acceptance of 42 unique items, rejection at 101 items, rejection of invalid tiers, preservation of `aiGenerated`, and filtering of module days outside `1..10`.

- [ ] **Step 3: Run client and server media tests to verify failure**

Run: `pnpm vitest run client/src/data/spindelMedia.test.ts client/src/data/spindelMediaCatalog.test.ts server/security.test.ts`

Expected: FAIL on missing tier/source/objective fields and the current 20-item limit.

- [ ] **Step 4: Extend the shared client/server media shape**

Add the exact fields above to `SpindelApprovedMedia` and `ProtectedMediaItem`. Update `parseProtectedMediaCatalog` to trim `sourceLabel` to 160 characters, `learningObjective` to 500 characters, accept only `core|extended`, and allow at most 100 items.

- [ ] **Step 5: Build the Bootcamp placement catalog**

Transcribe the Drive folder inventory using stable file IDs and the supplied index descriptions. Map the clearest anatomy, visual pathway, and physics items to modules 1–2 as Core; map alternate/repeated anatomy and surgical-context media as Extended. Assign multiple module days only when the same item directly supports each module objective. Do not add an item whose topic cannot be identified.

- [ ] **Step 6: Document the environment value and unavailable items**

Update `README.md` and the `render.yaml` variable description with the expanded JSON fields and list any Drive item deliberately omitted because it is unavailable, unidentified, or unsafe to present as instruction. Keep the actual Drive IDs in the protected `SPINDEL_MEDIA_CATALOG_JSON` environment value rather than committing them into the browser bundle.

- [ ] **Step 7: Run targeted tests and type checker**

Run: `pnpm vitest run client/src/data/spindelMedia.test.ts client/src/data/spindelMediaCatalog.test.ts server/security.test.ts && pnpm run check`

Expected: PASS.

- [ ] **Step 8: Commit the task**

```bash
git add client/src/data/spindelMedia.ts client/src/data/spindelMedia.test.ts client/src/data/spindelMediaCatalog.test.ts server/security.ts server/security.test.ts
git add README.md render.yaml
git commit -m "feat: map Bootcamp media to technician lessons"
```

### Task 3: Clinic-Wide and Doctor Protocol Catalog

**Files:**
- Create: `client/src/data/spindelProtocols.ts`
- Create: `client/src/data/spindelProtocols.test.ts`

**Interfaces:**
- Consumes: `DoctorProtocol`, `TrainingSource`, and `VisitProtocol` from Task 1.
- Produces: `clinicProtocolGuides: ClinicProtocolGuide[]`
- Produces: `spindelDoctorProtocols: DoctorProtocol[]`
- Produces: `getDoctorProtocol(id: string): DoctorProtocol | undefined`
- Produces: `getProtocolsForModuleDay(day: number): DoctorProtocol[]`, mapping the first five included doctors to day 8 and the remaining five to day 9.

- [ ] **Step 1: Write the failing source-integrity tests**

Assert the exact included doctor list and order, assert that no case-insensitive value contains `prendergast`, assert five doctors on day 8 and five on day 9, assert every doctor has at least one visit protocol and a SEA Tech Alley/Drive source URL, and assert every protocol has a `reviewedOn` value.

- [ ] **Step 2: Add visit-difference tests**

Choose representative source-backed differences for Spindel, Guenena, Wood, Leo, and Noall (for example dilation/Optomap conditions, testing thresholds, or emergency testing) and assert the exact condition text is retained under the correct doctor and visit type.

- [ ] **Step 3: Run the protocol tests to verify failure**

Run: `pnpm vitest run client/src/data/spindelProtocols.test.ts`

Expected: FAIL because the catalog does not exist.

- [ ] **Step 4: Transcribe clinic-wide guides from approved sources**

Create typed records for Daily Clinical Reminders, When to Refract, Optomap Guidelines, OCT Scans and Reports, and Post-Op IOLs. Add the day-to-day OCT source with `available: false` and no invented steps.

- [ ] **Step 5: Transcribe the ten doctor protocols**

Organize each doctor's source content by visit type and preserve required, optional, and conditional wording. Exclude Dr. Prendergast even if a clinic-wide source mentions that name.

- [ ] **Step 6: Run protocol tests and type checker**

Run: `pnpm vitest run client/src/data/spindelProtocols.test.ts && pnpm run check`

Expected: PASS.

- [ ] **Step 7: Commit the task**

```bash
git add client/src/data/spindelProtocols.ts client/src/data/spindelProtocols.test.ts
git commit -m "feat: add approved Spindel workup protocols"
```

### Task 4: Technician Lessons, Practical Checklists, and Quizzes

**Files:**
- Modify: `client/src/data/spindelOnboarding.ts`
- Modify: `client/src/data/spindelTrainingCatalog.test.ts`
- Test: `client/src/data/spindelProtocols.test.ts`

**Interfaces:**
- Consumes: module skeleton from Task 1 and clinic/doctor catalogs from Task 3.
- Produces: ten `LessonContent` records and ten `QuizData` records using the existing public exports.

- [ ] **Step 1: Extend the failing catalog tests for complete learning content**

Assert one lesson and quiz per day, an 80% passing score, at least three questions per quiz, at least one safety/escalation question in day 10, anatomy objectives in day 1, optics/physics objectives in day 2, equipment-quality objectives in day 6, visit-type coverage in day 7, and all ten doctor names across days 8–9 with no Dr. Prendergast text in serialized modules, lessons, or quizzes.

- [ ] **Step 2: Run the tests and verify failure**

Run: `pnpm vitest run client/src/data/spindelTrainingCatalog.test.ts client/src/data/spindelProtocols.test.ts`

Expected: FAIL on the old administration-heavy lessons and quizzes.

- [ ] **Step 3: Write modules 1–3**

Reuse and adapt repository material for functional anatomy, visual pathways, optics/testing physics, HPI, pupils, EOMs, CVFs, stereo, color vision, and documentation. Keep administrative material only where it supports safe clinical work.

- [ ] **Step 4: Write modules 4–6**

Cover visual acuity, pinhole, lensometry, autorefraction, refraction/BCVA, ORA and Goldmann, OCT, Optomap, visual fields, Pentacam, artifacts, measurement error, equipment quality, and troubleshooting.

- [ ] **Step 5: Write module 7**

Teach the shared baseline and sequence for REE, CE, DE, EE, EMER, IOP, VFFU, contact lens visits, muscle exams, and approved post-op workflows; clearly tell learners that the doctor modules override the baseline where they differ.

- [ ] **Step 6: Write modules 8–9**

Create a dedicated section and scenario question for every included doctor using `getProtocolsForModuleDay`. Do not flatten doctor-specific differences into shared text.

- [ ] **Step 7: Write module 10**

Cover flashes/floaters, sudden change or loss of vision, pain, trauma, infection control, equipment safety, escalation, and final readiness. State that technicians collect data and escalate but do not independently diagnose or treat.

- [ ] **Step 8: Run catalog tests and type checker**

Run: `pnpm vitest run client/src/data/spindelTrainingCatalog.test.ts client/src/data/spindelProtocols.test.ts && pnpm run check`

Expected: PASS.

- [ ] **Step 9: Commit the task**

```bash
git add client/src/data/spindelOnboarding.ts client/src/data/spindelTrainingCatalog.test.ts client/src/data/spindelProtocols.test.ts
git commit -m "feat: write required technician training lessons"
```

### Task 5: Learner Module Experience

**Files:**
- Create: `client/src/components/ProtocolLesson.tsx`
- Create: `client/src/components/ProtocolLesson.test.tsx`
- Modify: `client/src/pages/CourseModule.tsx`
- Modify: `client/src/data/spindelMedia.test.ts`

**Interfaces:**
- Consumes: `DoctorProtocol[]` and `getProtocolsForModuleDay(day)` from Task 3.
- Consumes: tiered `SpindelApprovedMedia[]` and `getSpindelMediaForDay(media, day, tier?)` from Task 2.
- Produces: `ProtocolLesson({ protocols }: { protocols: DoctorProtocol[] })`.

- [ ] **Step 1: Write failing component tests**

Using the installed `react-dom/server` package, test that static rendering shows the doctor name, visit-type headings, ordered steps, conditional text, source/review metadata, and an unavailable-source notice without rendering fake steps.

- [ ] **Step 2: Write failing module-media tests**

Test `groupSpindelMediaForDay` for separate Core and Extended groups and confirm one multi-day item appears on each mapped day. Add rendered-page assertions where practical for the Core/Extended labels and existing AI warning; browser verification in Task 7 covers request-failure fallback while keeping the written lesson usable.

- [ ] **Step 3: Run component tests and verify failure**

Run: `pnpm vitest run client/src/components/ProtocolLesson.test.tsx client/src/data/spindelMedia.test.ts`

Expected: FAIL because the protocol component and tiered rendering do not exist.

- [ ] **Step 4: Implement `ProtocolLesson`**

Render accessible headings, ordered lists, condition callouts, reminders, source label, review date, and an unavailable badge. Keep it read-only; it is a training reference, not a patient-care form.

- [ ] **Step 5: Update `CourseModule`**

For Spindel days 8–9, render the required doctor protocol cards. Split approved media by tier, include a one-sentence learning prompt for each item, retain attribution and the AI warning, and keep existing quiz/progress calls unchanged.

- [ ] **Step 6: Run component, media, and type checks**

Run: `pnpm vitest run client/src/components/ProtocolLesson.test.tsx client/src/data/spindelMedia.test.ts && pnpm run check`

Expected: PASS.

- [ ] **Step 7: Commit the task**

```bash
git add client/src/components/ProtocolLesson.tsx client/src/components/ProtocolLesson.test.tsx client/src/pages/CourseModule.tsx client/src/data/spindelMedia.test.ts
git commit -m "feat: present technician lessons and workup protocols"
```

### Task 6: Dashboard, Welcome Copy, and Completion Compatibility

**Files:**
- Create: `server/courseProgress.test.ts`
- Modify: `client/src/pages/CourseDashboard.tsx`
- Modify: `client/src/pages/SpindelWelcome.tsx`
- Modify: `client/src/pages/Certificate.tsx`
- Modify: `server/index.ts`

**Interfaces:**
- Consumes: ten-module catalog from Task 1.
- Produces: `SPINDEL_MODULE_COUNT = 10` and existing API response fields `completedModules` and `certificateEligible` with unchanged meaning.

- [ ] **Step 1: Write failing completion-contract tests**

Test that nine unique passed days are not certificate eligible, ten unique passed days are eligible, repeated scores for one day count once, and out-of-range days do not increase completion.

- [ ] **Step 2: Run the server test and verify failure where coverage is missing**

Run: `pnpm vitest run server/courseProgress.test.ts`

Expected: FAIL until the completion calculation is extracted/testable or hardened.

- [ ] **Step 3: Centralize the ten-module completion rule**

Extract a pure `summarizeCourseProgress(progress, moduleCount = 10)` helper used by `toPublicUser`; count unique passed days in `1..10` and preserve the API shape.

- [ ] **Step 4: Rewrite Spindel-facing page copy**

Change `Employee Onboarding` and administration-first language to `Ophthalmic Technician Training`, lead with clinical skills, and explain that all doctor protocols are required. Keep manager seat controls and staff authentication intact.

- [ ] **Step 5: Run completion tests and type checker**

Run: `pnpm vitest run server/courseProgress.test.ts && pnpm run check`

Expected: PASS.

- [ ] **Step 6: Commit the task**

```bash
git add server/courseProgress.test.ts server/index.ts client/src/pages/CourseDashboard.tsx client/src/pages/SpindelWelcome.tsx client/src/pages/Certificate.tsx
git commit -m "feat: focus Spindel experience on technician training"
```

### Task 7: Full Validation and Rendered Course Review

**Files:**
- Modify only files required to fix failures found by this task.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a verified local production build and a browser-reviewed technician course.

- [ ] **Step 1: Run the complete automated validation**

Run: `pnpm run validate`

Expected: all Vitest tests pass, TypeScript reports no errors, and Vite/Express production builds finish successfully.

- [ ] **Step 2: Start the built app with the existing local Spindel staff configuration**

Use the same local staff-access environment already used for port 3001. Do not print or commit credentials.

- [ ] **Step 3: Verify desktop learner flow in the browser**

Confirm the Spindel logo and technician-training language, all ten modules in order, Core and Extended media labels, modules 8–9 containing exactly ten required doctor lessons with no Dr. Prendergast, source/review notes, quizzes, progress saving, and certificate eligibility only after all ten passed days.

- [ ] **Step 4: Verify failure and fallback states**

Temporarily test an unavailable media response and the unavailable OCT source record. Confirm written lessons and quizzes remain usable and no invented content or broken iframe is presented.

- [ ] **Step 5: Verify narrow/mobile layout**

At a viewport near 390×844, check dashboard cards, module navigation, protocol steps/tables, media labels, quiz controls, and source metadata for readable wrapping and no horizontal overflow.

- [ ] **Step 6: Audit source placement**

Compare every used Bootcamp file against its catalog learning objective and destination days. Compare each doctor lesson against the approved source document. Record and correct any misplaced media, flattened doctor difference, or unsupported claim.

- [ ] **Step 7: Re-run validation after fixes**

Run: `pnpm run validate`

Expected: PASS after any corrections.

- [ ] **Step 8: Commit verification fixes**

Use `git diff --name-only` to identify only the files changed to correct Steps 1–6, inspect each diff, stage those exact files, and commit them with message `test: verify Spindel technician training course`. If validation requires no correction, do not create an empty commit.

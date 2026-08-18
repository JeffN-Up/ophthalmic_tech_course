# Spindel onboarding live release

This branch deploys the validated payment-free Spindel Eye Associates onboarding build.

- Source release commit: `b9635b6`
- Release package SHA-256: `475903b2569233e92e6307637a2c05e7cc9aaa5d6b88c9c1e87bf7a5262b9905`
- Paid enrollment: disabled
- Staff access: `SPINDEL_ACCESS_CODE` supplied only through the Render secret environment setting
- Persistent learner accounts and progress: `/var/data/course-data.json`
- Primary employee entry route: `/spindel`

The split base64 files are concatenated, decoded, and extracted by the Render build command. No production password or other secret is stored in this repository.

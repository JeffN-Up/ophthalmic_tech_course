# Course video editing

Owner-authorized editors can open `/course/admin/videos`, also linked as **Edit course videos** on their course dashboard. Student and manager roles alone never grant editing access.

## Deployment settings

- `OPTITECH_EDITOR_EMAILS`: comma-separated exact emails and optional `@domain` entries for existing accounts permitted to edit OptiTech. For example, `@spindeleye.com,dtechalley1@gmail.com,jefchapin@gmail.com` permits any `@spindeleye.com` account plus those two Gmail accounts.
- `SPINDEL_EDITOR_EMAILS`: separate comma-separated emails permitted to edit Spindel.
- `GOOGLE_DRIVE_API_KEY`: server-only API key for a Google Cloud project with Drive API enabled. Restrict it to the Drive API and appropriate server addresses. Do not use an HTTP-referrer restricted browser key.
- Continue using the existing persistent `DATA_FILE` volume and back it up before release. Video locations, drafts and history are added to the same database without replacing users, enrollment or progress.

The first admin visit imports that workspace's configured media catalog into stable per-module locations. Thereafter the persisted workspace map is authoritative; changing the environment catalog does not overwrite published replacements or append new locations. Adding/removing catalog items needs a separate explicit content-map migration. The original catalog must remain configured for the existing learner endpoint coverage checks. Existing learners continue to use their original media endpoints.

## Editor workflow

1. Choose workspace, module and original video position. Start an edit task before leaving for Google.
2. Open the source in Drive. Import/download it as needed for Google Vids. There is no automatic Vids import/export integration.
3. Export the finished video to **a new Drive file**. Keep the Vids project separately. Reusing the original file's bytes is deliberately rejected because saved file IDs cannot restore overwritten bytes.
4. Return to the saved task, paste the finished file link/ID and save the draft. Reopen the dashboard at any time to resume it.
5. Preview the finished video, check playback with an intended learner account, review the workspace/module/position and old/new file IDs, then publish.
6. To undo, preview the previous video, confirm playback and restore. Restore creates another revision and keeps history; repeated restore toggles between the two most recent published videos.

Each publication changes only one placeholder, retaining its title, objective, tier, order and module. Other links in that workspace are listed, and other workspaces remain independent. Editors must update other locations individually; there is no bulk or implicit cross-workspace replacement.

## Validation and limits

Publication and restoration fail closed unless the Drive API confirms an existing, non-trashed `video/*` file accessible using the API key without user OAuth. This baseline supports anonymously accessible Drive videos. Organization-restricted media needs a separately designed Google OAuth connection; do not broaden confidential file sharing merely to satisfy this workflow. The dashboard also requires an explicit learner-playback confirmation because file metadata cannot prove embedded playback in a learner's browser.

The preview shows the selected location's breadcrumb, title and objective with the new video. **View original position in course** links to the actual learner module. That link uses the signed-in account's existing learner workspace; editors need the corresponding learner account to inspect each workspace. No automatic learner-role switching is added.

Draft versions and published-location versions are checked inside the existing serialized atomic store mutation. Stale editors receive a conflict and must reload. Failed validation or writes leave the working published video unchanged. As with the existing file database, deploy a single server instance per data file; a multi-instance deployment needs a shared transactional database first.

This change covers video editing only. Text/quiz editing, deck editing and white-label practice provisioning remain separate work.

## Release verification

Run the automated tests, TypeScript check and production build. Then configure an authorized editor and the Drive API key in staging, perform a real Google Vids export, replace a video, verify playback as a learner and restore it after a server restart. Google Vids, real Drive permissions and the deployed course must be checked before claiming the end-to-end workflow is live.

# CODE NEXUS — Build Plan

## Phase 0 — Foundations (documentation and provider selection complete)
- Verify repository and access.
- Record product, architecture, security, and free-only constraints.
- Compare Bolt.new and Base44 using current official plan terms.
- Select Bolt.new Free + Bolt Cloud built-in backend + Bolt Free hosting.
- Record the reason Supabase is not the initial backend: Bolt's native Supabase integration is listed as Pro/Teams-only.
- Prepare one implementation brief and acceptance checklist before spending scarce builder credits.
- Commit builder decision and master prompt to the repository.

Acceptance: private repository and documentation verified; no paid dependency required for initial build; builder has a documented free-tier two-way GitHub sync path; free hosting and database constraints are explicit.

## Owner-prioritized presentation milestone — Phase 1A + 1B

The owner requested a presentable public UI/UX and a Google-based event-intake demonstration before member accounts, teammate matching or project collaboration.

### Phase 1A — Public discovery foundation (first product slice)
Committed source files:
- package.json, index.html, vite.config.ts, tsconfig.json
- src/main.tsx, src/App.tsx, src/index.css
- src/data/demoEvents.ts, src/lib/googleFeed.ts

Included in source:
- React + TypeScript + Vite application foundation, Tailwind CSS plugin, React Router and lucide-react.
- Premium, light-first responsive landing page and navigation.
- Explore search, format, experience, location, entry-fee and near-deadline filters, plus sorting.
- Source-health snapshot, platform/context facts, conflict warnings and organizer suggestion link when a live feed is connected.
- Clearly labelled illustrative event records until the owner connects the real feed.
- How it works, About, Contact, Privacy, Terms, Accessibility and 404 routes.

Current status: public discovery foundation is committed. GitHub Actions verifies the TypeScript/Vite production build. Browser preview, visual QA and hosting are intentionally deferred; publication is not part of this milestone.

### Phase 1B — Automatic discovery + organizer intake
Committed source files:
- automation/google-apps-script/Code.gs
- automation/google-apps-script/README.md
- docs/GOOGLE_APPS_SCRIPT_SETUP.md

Automated feed flow:
Hackalendar JSON API + Brabble hackathons RSS → daily Apps Script fetch → SourceRecords → normalization/deduplication/cross-match → AutoEvents + EventHistory → read-only JSONP endpoint → Explore.

Separate organizer flow:
Google Form → OrganizerIntake (REVIEW_REQUIRED) → moderator checks original organizer page → future approved publishing flow. Submitted URLs are stored only; they are not fetched or automatically published.

Source policy:
- Hackalendar public no-key API is enabled with attribution and organizer links.
- Brabble hackathons RSS is enabled with daily refresh and attribution; its feed may contain selected listings from Unstop and Devpost. CODE NEXUS must not present Brabble's full index as its own.
- Devpost direct scraping is disabled because its terms prohibit automated crawling without permission.
- Hack2Skill and Reskilll direct sources remain disabled pending an approved public feed/API or written permission.
- Unstop direct crawling remains disabled; use attributed Brabble feed entries for now.

Current status: code creates six spreadsheet tabs, an organizer suggestion form, daily and form-submit triggers, source status, material event history, attribution, conflict labels and expiry/cancellation filtering. No Google Sheet has been created, Apps Script authorized, triggers installed or /exec endpoint deployed yet. Feed-sourced events need no per-event approval; community suggestions do.

Acceptance for 1A/1B:
- GitHub Actions passes Apps Script syntax check and TypeScript/Vite production build.
- Owner creates the Google Sheet and authorizes Sheets, Forms and URL Fetch.
- Verify the first fetch, six tabs, organizer form, both triggers and RunLog entries.
- Deploy the read-only endpoint and connect it once in Explore.
- Confirm source labels, source conflicts, attribution, organizer links and expired/cancelled exclusion.
- Check responsive layout and keyboard focus in browser preview before publication.

## Phase 1 — Application foundation and public discovery shell (original specification)
- Import the existing private GitHub repository into Bolt and verify repository/branch sync before code generation.
- Scaffold React + TypeScript + Vite, Tailwind, routes, design tokens and reusable accessible components.
- Build the public landing page, Explore shell, event detail template, informational/legal placeholders and 404.
- Use only a small illustrative dataset, visibly labelled as demo data; no fake live metrics or verified events.
- Keep existing Markdown documentation intact.
- Do not provision external services or implement OAuth/event ingestion in this phase.

Status: implementation source has been added as Phase 1A; validation remains outstanding. The owner-prioritized 1B Google intake source is documented above.

Acceptance: the app builds; public routes and navigation work; mobile/desktop layouts and basic accessibility are checked; demo data is labelled; the existing repo is synced and the resulting commit is visible on GitHub.

## Phase 2 — Backend foundation
- Use Bolt Cloud built-in database/auth/storage/server functions; do not connect Supabase through Bolt's Pro/Teams integration under the free-only plan.
- Create schema, indexes, access policies, and clearly labelled demo seed data.
- Test anonymous/member isolation, role escalation and file access.
- Keep schema and data exportable for a future provider migration.

Acceptance: access policies are enabled and tested on all private/client-exposed tables; no privileged key appears in browser code; no paid plan is activated.

## Phase 3 — Discovery engine and event details
- Search, filters, sorting, pagination, shareable state.
- Internal event details with source, verification, timezone, separate deadlines, and official registration CTA.
- Save, compare, report.

Acceptance: filters compose correctly; unknown facts remain unknown; CTA uses verified organizer destination; no fake metrics.

## Phase 4 — Authentication and dashboard
- Email/Google authentication where supported without paid requirements; profile onboarding and privacy.
- Saved events, comparisons, notifications, submissions.

Acceptance: members cannot read or mutate another member's private data.

## Phase 5 — Teammates and collaboration
- Teammate posts, explainable complementary skill suggestions, invitations, join requests.
- Teams, projects, tasks, milestones, comments, and submission checklist.

Acceptance: team resources isolated by membership; matching explanations are honest.

## Phase 6 — Expanded event ingestion and moderation
- Extend the bounded RSS/Atom prototype with organizer submissions and separately reviewed permitted public sources/APIs.
- Optional Gmail Alerts workflow only after explicit owner approval for dedicated-label access and minimum OAuth scopes.
- Extraction, validation, deduplication, provenance, review, refresh, expiry, and change tracking.

Acceptance: published events have traceable source evidence; unknown facts remain null; untrusted sources require human review; provider policies and quotas are respected.

## Phase 7 — Quality, deployment, operations
- Functional, security, RLS, accessibility, mobile, and performance checks.
- Export/backup guide, admin runbook, privacy/terms review, deployment.
- Verify actual free-tier limits and deployment behavior, including the 333,000 monthly web-request hosting cap and Bolt branding.
- Document the .bolt.host URL, no-custom-domain limitation, backup/export process and migration options.

Acceptance: critical flows pass; no known critical security issue; deployment verified; operational limits and recovery documented.

## Working protocol
At each phase report files changed, tests actually executed/results, limitations, and exact browser-only next steps. Stop for owner approval before the next major phase and before any account, billing, OAuth, or secret-sensitive action.

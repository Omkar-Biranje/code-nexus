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

### Phase 1A — Public UI/UX source prototype
Committed source files:
- package.json, index.html, vite.config.ts, tsconfig.json
- src/main.tsx, src/App.tsx, src/index.css
- src/data/demoEvents.ts, src/lib/googleFeed.ts

Included in source:
- React + TypeScript + Vite application foundation, Tailwind CSS plugin, React Router and lucide-react.
- Premium, light-first responsive landing page and navigation.
- Explore page with search, format and experience filters.
- Clearly labelled illustrative event cards and sample detail pages.
- How it works, About, Contact, Privacy, Terms, Accessibility and 404 routes.
- A public Google-feed URL input on Explore.

Current status: source committed to main. Dependency installation, build, type-check and browser QA have NOT yet been executed.

### Phase 1B — Google Sheets / Apps Script intake prototype
Committed source files:
- automation/google-apps-script/Code.gs
- automation/google-apps-script/README.md
- docs/GOOGLE_APPS_SCRIPT_SETUP.md

Intended flow:
Official RSS/Atom feeds → Apps Script → Candidates sheet (Pending review) → human review → Published sheet (Published + Verified) → read-only JSONP endpoint → Explore page.

Current status: source and setup instructions committed. No Google Sheet has been created, no feed source configured, no script authorized, no timer trigger installed, and no public endpoint deployed or tested. Gmail inbox access is not part of this prototype.

Acceptance for 1A/1B:
- Install dependencies and run a successful production build.
- Check all routes, Explore filters, event date fields, mobile layout and keyboard focus.
- Create Google Sheet and authorize only requested spreadsheet / URL-fetch access.
- Test with one permitted official RSS/Atom feed.
- Confirm new feed items enter Candidates as Pending review.
- Confirm public endpoint returns only rows explicitly marked Published and Verified.
- Connect the endpoint in Explore and verify a test listing.
- Verify new commits appear in the imported Bolt project / GitHub two-way sync.

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

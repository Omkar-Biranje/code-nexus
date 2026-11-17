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

## Phase 1 — Application foundation and public discovery shell
- Import the existing private GitHub repository into Bolt and verify repository/branch sync before code generation.
- Scaffold React + TypeScript + Vite, Tailwind, routes, design tokens and reusable accessible components.
- Build the public landing page, Explore shell, event detail template, informational/legal placeholders and 404.
- Use only a small illustrative dataset, visibly labelled as demo data; no fake live metrics or verified events.
- Keep existing Markdown documentation intact.
- Do not provision external services or implement OAuth/event ingestion in this phase.

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
- Email/Google auth where supported; profile onboarding and privacy.
- Saved events, comparisons, notifications, submissions.

Acceptance: members cannot read or mutate another member's private data.

## Phase 5 — Teammates and collaboration
- Teammate posts, explainable complementary skill suggestions, invitations, join requests.
- Teams, projects, tasks, milestones, comments, submission checklist.

Acceptance: team resources isolated by membership; matching explanations are honest.

## Phase 6 — Event ingestion and moderation
- Official feeds/APIs, permitted public URLs, organizer submissions, optional Gmail/Apps Script workflow.
- Extraction, validation, deduplication, provenance, review, refresh, expiry, change tracking.

Acceptance: published events have traceable source evidence; unknown facts remain null; untrusted sources require review; provider policies and quotas respected.

## Phase 7 — Quality, deployment, operations
- Functional, security, RLS, accessibility, mobile, and performance checks.
- Export/backup guide, admin runbook, privacy/terms review, deployment.
- Verify actual free-tier limits and deployment behavior, including the 333,000 monthly web-request hosting cap and Bolt branding.
- Document the .bolt.host URL, no-custom-domain limitation, backup/export process and migration options.

Acceptance: critical flows pass; no known critical security issue; deployment verified; operational limits and recovery documented.

## Working protocol
At each phase report files changed, tests actually executed/results, limitations, and exact browser-only next steps. Stop for owner approval before the next major phase and before any account, billing, OAuth, or secret-sensitive action.

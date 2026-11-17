# CODE NEXUS — Build Plan

## Phase 0 — Foundations
- Verify repository and access.
- Record product, architecture, security, and free-only constraints.
- Compare browser builder options using current official plan terms.
- Prepare one implementation brief and acceptance checklist before spending scarce builder credits.

Acceptance: private repository accessible; scope documented; no paid dependency required for initial build; builder has a verified GitHub sync/export path within free plan.

## Phase 1 — Backend foundation
- Provision Supabase only after owner authorization.
- Create migrations, schema, indexes, RLS/storage policies, and clearly labeled demo seed data.
- Test anonymous/member isolation and role escalation.

Acceptance: RLS enabled/tested on all client-exposed tables; no service-role key in browser.

## Phase 2 — Design system and public shell
- Responsive navigation/footer, design tokens, accessible components.
- Home, Explore shell, About, How it works, legal, contact, report, and 404 pages.

Acceptance: mobile/desktop layouts work; navigation resolves; keyboard review passes.

## Phase 3 — Discovery and event details
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
- Verify actual free-tier limits and deployment behavior.

Acceptance: critical flows pass; no known critical security issue; deployment verified; operational limits and recovery documented.

## Working protocol
At each phase report files changed, tests actually executed/results, limitations, and exact browser-only next steps. Stop for owner approval before the next major phase and before any account, billing, OAuth, or secret-sensitive action.

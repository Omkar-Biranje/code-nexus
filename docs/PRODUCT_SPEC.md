# CODE NEXUS — Product Specification

## 1. Product promise
Help people discover relevant hackathons, understand eligibility, find teammates with complementary skills, and manage work through submission.

Journey: **DISCOVER → UNDERSTAND → MATCH → TEAM → PLAN → BUILD → TRACK → SUBMIT**

## 2. Roles
- Visitor: browse public listings and event details.
- Member/student: profile, bookmarks, compare events, teammate requests, teams, and projects.
- Organizer: submit and maintain events.
- Moderator: review submissions, source evidence, reports, and changes.
- Administrator: manage roles, source integrations, audit records, and configuration.

Privileged roles must be assigned and checked securely. Users cannot grant themselves moderator/admin access.

## 3. Public website
Responsive landing page, Explore, internal event detail pages, how-it-works, about, contact, report event, privacy, terms, accessibility, and not-found/error pages. Include SEO metadata, canonical URLs, sitemap, and robots configuration.

## 4. Global hackathon discovery
Search, filters, sorting, pagination, and shareable filter state. Filters should support:
- Skills, interests, themes, tracks, technologies, and difficulty where stated
- Online/offline/hybrid; country, city, venue, and remote eligibility
- Registration deadline, submission deadline, and event dates
- Team size and participation mode
- Age, student status, education level, branch/discipline, institution, country/residency
- Entry fee and currency; prize amount and currency
- Organizer, freshness, and verification status

Do not infer eligibility or beginner status without evidence. Unknown values remain unknown.

## 5. Event detail pages
Every event has an internal Code Nexus page with title, organizer, summary, description, tracks, rules, official source, eligibility, team size, mode, location, fees, prizes, currency, and separate registration/submission/event dates. Preserve IANA timezone and display localized time.

Include official registration CTA, provenance, verification status, discovered/last-checked timestamps, change history, save, compare, share, and report issue.

A successful fetch is not proof that event facts are verified.

## 6. Event submission and organizers
Multi-step validated event submission with drafts. New events enter pending review. Organizer profiles and authorized updates require evidence and audit history. Do not auto-publish untrusted submissions.

## 7. Member profile and dashboard
Email/Google authentication where supported without paid requirements. Onboarding may collect country, timezone, education/branch, skills, interests, experience, preferred roles, availability, and collaboration preferences. Provide privacy controls. Dashboard includes saved events, comparisons, teammate requests, invitations, teams, projects, notifications, and submission status. Avoid unnecessary sensitive data.

## 8. Teammate matching
Members can post teammate requests linked to events/projects, specify roles, skill gaps, experience, availability, timezone overlap, language, and team size. Explain match reasons and missing profile data. Matching is advisory, not a guarantee. Support invitations, join approvals, blocking, and reporting.

## 9. Team workspace
Private team workspace with membership roles, project overview, milestones, task board, comments, repository/demo links, and submission checklist. Enforce team membership permissions.

## 10. Admin and moderation
Verification queue with source evidence; approve, reject, request edits, merge duplicates, mark expired; source configuration and ingestion logs; reports; organizer verification; role management; audit log; real database-backed analytics. Log privileged actions.

## 11. Event discovery automation
Use only permitted public sources: official feeds/APIs, RSS/Atom, organizer submissions, public pages that permit automated access, and admin-provided URLs. A Gmail Alerts workflow may be added only with explicit OAuth consent and dedicated-label access.

Extraction order: Schema.org Event JSON-LD, RSS/Atom and OpenGraph, bounded public-page extraction, then optional AI-assisted strict-schema extraction. AI output is untrusted; deterministic validation and moderation control publication.

Never invent title, date, eligibility, fee, prize, or registration URL. Preserve evidence, provenance, extraction method, and last-checked time. New/untrusted sources require human review. Respect robots directives, terms, API rules, and rate limits; never bypass login, CAPTCHA, or paywalls.

## 12. Analytics and future business model
Analytics must derive from actual database records and show time windows. No fake production counts. Potential future revenue hypotheses include organizer tools, promoted listings, sponsorships, optional premium student features, and partnerships. None are commitments; any paid feature requires owner approval and legal/payment review.

## 13. Design direction
Premium calm global SaaS aesthetic: off-white surfaces, restrained blue/indigo, soft greys, strong typography, whitespace, mobile-first responsive layouts, 44px touch targets, keyboard accessibility, visible focus, WCAG AA-minded contrast, subtle motion, reduced-motion support. One lightweight network-inspired hero with static fallback. Avoid neon overload and heavy 3D.

## 14. Quality requirements
No dead links or inert buttons. Forms need validation and feedback. Include loading, empty, error, and permission states. Filters must be testable. Unknown is distinct from zero/none. No fake metrics or placeholder content presented as live data.

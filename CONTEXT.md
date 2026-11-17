# CODE NEXUS — Working Context

Last updated: 2026-11-17

## Confirmed owner decisions
- Product: CODE NEXUS
- Tagline: Find Hackathons. Find Teammates. Build Smarter.
- Audience: global student and builder community
- Launch intent: global-ready foundations from day one
- Budget: strictly free-only; no paid APIs, paid plans, card-required services, or surprise billing
- Repository: https://github.com/Omkar-Biranje/code-nexus
- Owner: Omkar-Biranje; private repository; default branch: main
- Build preference: browser-based AI builder; avoid local terminal, VS Code, Node/npm setup, and manual coding where possible
- Build approach: complete specification and acceptance criteria before consuming scarce builder credits

## Selected initial stack (verified 2026-11-17; not yet connected)
- AI builder: Bolt.new Free (1,000,000 tokens/month; 300,000/day at time of verification)
- Backend: Bolt Cloud built-in database, authentication, storage, and server functions
- Hosting: Bolt Free with a public .bolt.host URL; Bolt branding and a 333,000 monthly web-request limit apply
- Source control: GitHub two-way sync; import the existing private repository Omkar-Biranje/code-nexus
- Frontend: React + TypeScript + Vite; Tailwind CSS; React Router; lucide-react
- Supabase is not selected for the initial build: Bolt's native Supabase integration is currently listed as Pro/Teams-only. Reassess a portable migration only if a separately verified free connection path is needed.
- Google Apps Script with permitted public feeds and optionally a dedicated Gmail label for bounded ingestion, in a later phase
- Optional free-tier model for extraction; deterministic validation and human review remain authoritative
- No OpenAI API dependency required for the initial build
- Decision details and dated official sources: docs/AI_BUILDER_DECISION.md
- Ready-to-use build prompt and acceptance checklist: docs/BOLT_MASTER_PROMPT.md

## Non-negotiable constraints
- Never claim an integration, build, test, or deployment succeeded until verified.
- Never ask for passwords, OTPs, recovery codes, or API keys in chat.
- Keep provider secrets out of source code and browser bundles.
- ChatGPT subscription does not imply API credits.
- Do not claim comprehensive Google/social discovery. Use permitted documented sources only.
- Never invent event facts. Unknown values remain NULL or "Not specified".
- Separate registration deadline, submission deadline, event start, and event end.
- Preserve event-local IANA timezone; do not assume India time.
- Do not fabricate analytics, counts, ratings, match scores, or verification claims.
- Enable RLS on every client-exposed private/user-owned table.
- Document export/backup because free database plans may not include automated backups.
- Recheck official free-plan quotas and terms before provider commitment or publishing.
- Bolt Free currently limits hosting to 333,000 web requests per month; free sites may stop serving content when this cap is reached. No unlimited uptime or traffic claim is permitted.
- Custom domains and Bolt's native Supabase integration are paid features; do not activate them under the free-only decision.

## Workflow
At each phase: state scope, make changes, report files, report tests actually run, give browser-only test steps, update this file, and stop for approval before the next major phase or any account/security-sensitive action.

## Status
- [x] Private GitHub repository verified.
- [x] README initialized and verified.
- [x] Add complete product and architecture documentation.
- [x] Confirm AI builder free-plan limits and GitHub sync.
- [x] Finalize implementation prompt and acceptance criteria.
- [ ] Import this private repository into Bolt and verify two-way GitHub sync.
- [ ] Build the first public application shell in Bolt.
- [ ] Provision Bolt Cloud database/auth and apply schema/security policies after owner authorization.
- [ ] Implement bounded event ingestion and moderation.
- [ ] Test security, accessibility, mobile, and core workflows.
- [ ] Deploy and document operating limits.

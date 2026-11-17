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

## Initial stack direction (not yet integrated)
- React + TypeScript + Tailwind CSS
- Supabase for database/auth/storage, only within verified free quotas
- GitHub for source control
- Browser-based AI builder and hosting: verify current free plan, GitHub sync, export, and hosting limits before selection
- Google Apps Script with permitted public feeds and optionally a dedicated Gmail label for bounded ingestion
- Optional free-tier model for extraction; deterministic validation and human review remain authoritative
- No OpenAI API dependency required for the initial build

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
- Recheck official free-plan quotas and terms before provider commitment.

## Workflow
At each phase: state scope, make changes, report files, report tests actually run, give browser-only test steps, update this file, and stop for approval before the next major phase or any account/security-sensitive action.

## Status
- [x] Private GitHub repository verified.
- [x] README initialized and verified.
- [ ] Add complete product and architecture documentation.
- [ ] Confirm AI builder free-plan limits and GitHub sync.
- [ ] Finalize implementation prompt and acceptance criteria.
- [ ] Create Supabase project and apply schema/RLS after owner authorization.
- [ ] Generate frontend and connect integrations.
- [ ] Implement bounded event ingestion and moderation.
- [ ] Test security, accessibility, mobile, and core workflows.
- [ ] Deploy and document operating limits.

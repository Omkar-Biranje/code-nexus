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

## Selected initial stack
- AI builder: Bolt.new Free. The current free plan lists 300,000 tokens/day and 1,000,000/month; the owner's daily quota is currently exhausted. Do not purchase tokens or create accounts merely to bypass provider limits.
- Backend: Bolt Cloud built-in database, authentication, storage, and server functions — deferred until the public shell is tested.
- Hosting: Bolt Free with a public .bolt.host URL; Bolt branding and a 333,000 monthly web-request limit apply.
- Source control: existing private GitHub repository Omkar-Biranje/code-nexus; GitHub is the durable source of truth.
- Frontend: React + TypeScript + Vite; Tailwind CSS; React Router; lucide-react.
- Google discovery pipeline: Google Sheets + bound Apps Script. It automatically fetches Hackalendar JSON and Brabble hackathons RSS daily, deduplicates, cross-matches, auto-publishes source-attributed records, and exposes a read-only feed. It does not read Gmail. Direct Hack2Skill/Reskilll crawlers are disabled pending permission/feed; direct Devpost crawling is disabled by its published terms; Unstop is used via Brabble for now.
- Supabase is not selected for the initial build: Bolt's native Supabase integration is listed as Pro/Teams-only in the provider decision checked 2026-11-17.
- No OpenAI API dependency required for the initial build.
- Decision details and dated official sources: docs/AI_BUILDER_DECISION.md
- Product and architecture requirements: docs/PRODUCT_SPEC.md and docs/ARCHITECTURE.md

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
- Enable RLS on every client-exposed private/user-owned table when a backend is introduced.
- Document export/backup because free database plans may not include automated backups.
- Recheck official free-plan quotas and terms before provider commitment or publishing.
- Bolt Free currently limits hosting to 333,000 web requests per month; free sites may stop serving content when this cap is reached. No unlimited uptime or traffic claim is permitted.
- Custom domains and Bolt's native Supabase integration are paid features; do not activate them under the free-only decision.
- Auto-discovered and cross-source corroborated are discovery labels, not guarantees of organizer verification. Preserve source attribution and official source links; unknown facts stay blank. Never present aggregator data as independently verified by CODE NEXUS.

## Current implementation status — 2026-11-17
- [x] Private GitHub repository, permissions, and main branch verified.
- [x] Product, architecture, build, AI-builder and master-prompt documentation added and preserved.
- [x] Public application source scaffold committed to main in commit d6637a40939263dc75b5ba6bc8619c2153619400.
- [x] Landing page, responsive navigation, Explore filters, illustrative event cards/details, informational routes, and Google feed connection control added in source.
- [x] Google Apps Script feed-intake source and setup guide committed to main in commit 9e888603d98cbdc4f47db352261c6a34900a8bfd.
- [x] GitHub Actions dependency install, TypeScript check and Vite production build passed for commit 2e23405e9b4214951234fc9a652db876736e3bf0; latest crawler/provenance edits need a fresh CI pass.
- [x] Apps Script automatic discovery source added with daily schedule, attribution, dedupe and cross-index matching.
- [ ] Confirm Bolt imported workspace has pulled the new GitHub commits and two-way sync is working.
- [ ] Create and authorize the Google Sheet, run the preconfigured Hackalendar + Brabble sources, verify the daily trigger, and deploy the read-only endpoint.
- [ ] Connect the deployed endpoint in Explore and verify only approved Published + Verified rows are returned.
- [ ] Backend/auth, member profiles, teammate matching, collaboration and full admin tools.

## Workflow
At each phase: state scope, make changes, report files, report tests actually run, give browser-only test steps, update this file and docs/BUILD_PLAN.md, and stop for approval before the next major phase or any account/security-sensitive action.

## Presentation milestone boundary
The frontend source has passed a GitHub Actions TypeScript/Vite production build at commit 2e23405e9b4214951234fc9a652db876736e3bf0. Later crawler/provenance edits still need a fresh CI check. It has not yet been browser-previewed, hosted, or connected to a live Google Sheet. The Explore page uses illustrative demo records until the owner completes one-time Apps Script authorization, deployment and URL connection. Do not describe the crawler as live until its first fetch and daily trigger are verified.

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
- Google discovery pipeline code: Google Sheets + bound Apps Script. The committed source is designed to fetch Hackalendar JSON and Brabble hackathons RSS daily, deduplicate/cross-match, retain attribution, track material changes and expose a read-only feed. The source has not yet been authorized or deployed in the owner's Google account. It also creates an organizer suggestion form whose submissions are held for review. It does not read Gmail. Direct Hack2Skill/Reskilll crawlers are disabled pending permission/feed; direct Devpost crawling is disabled by its published terms; Unstop listings may arrive via Brabble.
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

### First product slice (approximately the requested first 20%)
- [x] Private GitHub repository, owner permissions and main branch verified.
- [x] React + TypeScript + Vite frontend foundation and responsive landing/navigation.
- [x] Public Explore search and filters for format, experience, location, entry fee and near deadlines; closing-soon/A–Z sorting.
- [x] Illustrative event-card/detail foundations; demo records are visibly labelled and not presented as live.
- [x] Global event data foundations: country/city, timezone, separate registration/submission/event dates, fee/currency, prize, team size, skills and eligibility where supplied.
- [x] Feed connection UI, source status, last-check visibility, source/platform context, attribution and conflict warnings.
- [x] Apps Script adapters for Hackalendar JSON and Brabble RSS, exact endpoint allowlists, blocked redirects, bounded fetches, deduplication, cross-source matching and retention of prior records after temporary fetch failures.
- [x] Daily refresh trigger definition and read-only JSON/JSONP publisher source.
- [x] Organizer suggestion form and review-queue definition, separate from automatic feed imports.
- [x] Event history for new records and material changes; cancelled/known-expired records excluded from the public snapshot.
- [x] Deterministic tests for source allowlists, canonical URLs, event identity, unknown fields and expiry.
- [x] Setup documentation and source-policy limitations updated.

### Not yet live / remaining in this milestone
- [ ] Owner creates the Google Sheet, authorizes Sheets + Forms + URL Fetch, runs setupCodeNexus, and confirms the first successful fetch and both triggers.
- [ ] Owner deploys the read-only Apps Script web app and connects its /exec URL in Explore.
- [ ] Confirm the new commits have synced into the imported Bolt workspace.
- [ ] Browser preview and visual QA on desktop/mobile, including live-feed empty/error/loading behavior.
- [ ] Do not publish the public website yet; publication is intentionally deferred.

### Later phases
- [ ] Backend, authentication, profiles, saved events and comparisons.
- [ ] Teammate discovery/matching, team formation, invitations and project workspace.
- [ ] Internal organizer dashboard, moderator/admin tools, submission workflow and report handling.
- [ ] Production security/accessibility/performance QA, privacy/legal review and deployment.

The "first 20%" is a planning milestone, not a measured percentage of production completeness.

## Workflow
At each phase: state scope, make changes, report files, report tests actually run, give browser-only test steps, update this file and docs/BUILD_PLAN.md, and stop for approval before the next major phase or any account/security-sensitive action.

## Presentation milestone boundary

The public discovery foundation and automation source are committed to the private GitHub repository. GitHub Actions now includes Apps Script syntax, deterministic discovery tests and the TypeScript/Vite production build. The project has not been browser-previewed, hosted or connected to a live Google Sheet. Explore remains in illustrative demo mode until the owner completes Google authorization, first fetch, trigger verification, deployment and feed connection. Do not describe discovery as live until these account-side checks pass.

# CODE NEXUS — Bolt Project Master Instructions

Use this document as the standing project brief / Project Knowledge for the CODE NEXUS project in Bolt. It defines product intent, architecture constraints and build discipline. It does not authorize purchases, paid services, OAuth connections or handling of secrets.

## 1. Product identity

Product: CODE NEXUS  
Tagline: Find Hackathons. Find Teammates. Build Smarter.  
Audience: students and builders around the world.

CODE NEXUS helps people discover relevant hackathons, understand eligibility and deadlines, find complementary teammates, form teams, and organize their project work through submission.

Core journey:
DISCOVER → UNDERSTAND → MATCH → TEAM → PLAN → BUILD → TRACK → SUBMIT

The product must be more useful than a directory of links. Its differentiators are reliable freshness and provenance, explainable fit, complementary team matching, and a collaboration workspace.

## 2. Strict operating constraints

- Free-only. Do not select paid plans, paid APIs, paid hosting, custom domains, payment products, or features that require a credit card.
- Do not trigger paid usage or turn on automatic billing. Stop and ask the owner if a required feature has no free route.
- Use Bolt Cloud's built-in database/authentication/storage/server functions for the first build. Do not select the native Bolt-to-Supabase integration; Bolt currently lists it as Pro/Teams-only.
- Connect only the owner's existing private repository: https://github.com/Omkar-Biranje/code-nexus
- Preserve all existing project documentation. Never delete, rename, overwrite or substantially rewrite CONTEXT.md, docs/PRODUCT_SPEC.md, docs/ARCHITECTURE.md, docs/BUILD_PLAN.md or docs/AI_BUILDER_DECISION.md without explaining the change.
- Do not ask for or print passwords, OTPs, recovery codes, API keys or private tokens. Secrets belong only in official provider secret settings.
- Never add real secrets to source files, browser code, commit history, screenshots, logs or documentation. Commit only a placeholder .env.example if needed.
- Do not create an OpenAI API dependency. ChatGPT access does not imply API credits.
- Do not invent hackathons, live event counts, prizes, eligibility, fees, organizer identities, verification, user ratings, testimonials or match results.
- Demo records must be prominently marked as illustrative demo data and never represented as live verified events.
- Keep unknown facts null / "Not specified". Never fill missing event data with plausible guesses.
- Never claim a build, integration, test, security check or deployment succeeded unless it has actually been run and verified.

## 3. Technical direction

- React + TypeScript + Vite.
- Tailwind CSS using centralized design tokens and reusable components.
- React Router for routes.
- lucide-react for icons.
- Bolt Cloud built-in database and authentication for the first version.
- GitHub is the durable source-control home.
- Bolt Free hosting with a `.bolt.host` subdomain for the MVP.
- Keep data structures and domain logic portable so migration to standard PostgreSQL/Supabase or another host remains possible.
- Use schema/migration files where supported and document manual dashboard-only changes.
- Use runtime validation (for example Zod) at API/form boundaries.
- Prefer small, composable components, clear types and readable file organization.
- Handle loading, empty, error, success and permission-denied states.
- Use server functions for privileged operations. Never expose admin or service-role privileges to the browser.

## 4. Global-ready foundations

- Store instants in UTC and preserve the source/event IANA time zone for display and local deadline interpretation.
- Keep registration deadline, submission deadline, event start and event end as separate fields.
- Use ISO 4217 currency codes; store amounts only when explicitly stated.
- Use ISO 3166-1 alpha-2 country codes when known.
- Model eligibility explicitly: age limits, student status, institution/branch, geography, team size, experience, fees and other organizer-defined constraints.
- Support online, in-person and hybrid events.
- Do not assume India time, USD, or a single country.
- Build mobile-first responsive layouts, keyboard navigation, visible focus, accessible labels and WCAG AA contrast.
- Global-ready data and UI do not imply global-scale hosting capacity. Respect Bolt's free hosting and database limits.

## 5. Product modules and intended routes

Public:
- Home / landing page
- Explore hackathons
- Hackathon detail
- How it works
- About
- Contact
- Report an event / issue
- Privacy, Terms and Accessibility
- Not found / error pages

Member:
- Sign up / sign in / password recovery
- Onboarding and profile
- Interests and skills
- Dashboard
- Saved hackathons and comparisons
- Teammate discovery and teammate posts
- Join requests / invitations
- Teams and project workspaces
- Kanban tasks, milestones, comments and submission checklist
- Notification preferences

Organizer / admin (role protected):
- Organizer profile and submitted events
- Event submission and updates
- Verification queue
- Source and ingestion management
- Duplicate resolution
- Reports and audit trail
- Basic analytics from real persisted records only

Do not attempt to ship every module in one giant generation. Build sequentially, maintain a working application, and keep unfinished modules visibly marked as planned rather than showing fake controls.

## 6. Event integrity and ingestion rules

Every event should be traceable to a canonical official source URL and include source/provenance fields such as discovered_at, last_checked_at, extraction_method, verification_status, confidence, evidence, and change history where available.

- Prefer official organizer pages, documented APIs and permitted RSS/Atom feeds.
- Respect site terms, robots rules, rate limits, and API policies. Never bypass login, CAPTCHA, paywall, anti-bot measures or access restrictions.
- Google search results and public webpages do not provide guaranteed complete global coverage.
- A successful fetch is not the same as fact verification.
- Unknown facts remain null / "Not specified".
- Require human review for uncertain or untrusted sources.
- Separate extraction from publication. Model-generated extraction is advisory; deterministic validation and moderation are authoritative.
- Deduplicate by canonical URL and normalized event fingerprint.
- Expire or archive events based on verified dates; don't leave closed opportunities looking open.
- Do not build automated broad scraping in the first shell phase. It needs a separate bounded design and quota/security review.

## 7. Matching integrity

- Explain why an event fits a profile.
- Distinguish hard eligibility from preference similarity.
- Do not calculate an eligibility pass when required profile/event fields are unknown.
- Exclude unknown profile fields from scoring and re-normalize remaining weights.
- Show the factors used and missing information.
- Teammate suggestions should identify complementary skills and role gaps, not claim guaranteed team success.
- Never present illustrative scores as validated predictive AI.

## 8. Visual direction

Create a polished, calm, premium international student SaaS product:
- Light-first canvas using white/off-white, navy/charcoal text, and restrained blue/indigo/teal accents.
- Strong typography, clear hierarchy, generous spacing and consistent radii.
- Clean cards and compact filters; event deadlines and eligibility must be scannable.
- Responsive desktop, tablet and mobile navigation.
- Subtle motion only; respect prefers-reduced-motion.
- Avoid noisy gradients, neon cyberpunk styling, excessive glassmorphism, heavy 3D, oversized hero sections and decorative clutter.
- Brand should feel trustworthy, focused, modern and student-friendly.
- Use the exact product name and tagline consistently.

## 9. Build workflow

Work in small, reviewable phases. Before changing code:
1. Read the existing repository documentation.
2. Summarize the intended files and changes.
3. State which user-facing flows will work after the phase.
4. State what is deliberately deferred.
5. Identify any action requiring external account permission, OAuth, secret or possible cost.

After each phase:
1. Run the available build/type/lint/tests; report exactly which commands or checks were run.
2. Fix errors introduced by the change.
3. Test the responsive preview at mobile and desktop widths.
4. Test navigation, loading, empty, error and disabled states.
5. Verify no secret or placeholder private key appears in the client bundle or commits.
6. Summarize changed files and actual results.
7. Update CONTEXT.md and docs/BUILD_PLAN.md when project state changes.
8. Stop before the next major phase and wait for owner approval.

If a feature requires a paid plan or a new account connection, do not work around it with an unauthorized integration. Explain the blocker and propose a free alternative.

## 10. First build scope — do not overbuild

The first code-generation phase is only the **application foundation and public discovery shell**:

- Inspect and preserve the current documentation-only GitHub repository.
- Scaffold React + TypeScript + Vite and the agreed styling/routing dependencies.
- Create a reusable layout, header/navigation, footer, buttons, cards, form controls, loading/empty/error states and responsive design tokens.
- Create the landing page with a clear value proposition and calls to action.
- Create an Explore page with search/filter UI and a small, clearly labelled illustrative demo dataset.
- Create an event detail page using the same demo records, showing source/provenance and separate date fields.
- Create About, How it works, Contact, Privacy, Terms, Accessibility and 404 placeholders with useful content or explicit "coming soon" notices.
- Ensure no dead links. If a route is not implemented, mark it visibly as planned and do not pretend it works.
- Do not implement fake login, fake AI, fake analytics, fake event ingestion, fake teammate recommendations or fake user counts.
- Do not provision external services, connect Gmail/Google, configure OAuth, add paid APIs or build payment features in this first phase.
- Do not create the full admin dashboard or collaboration backend yet.

At the end, report:
- Actual route list and implemented flows.
- Exact file changes.
- Build/test results.
- Any incomplete work.
- Token usage if Bolt displays it.
- A browser-only test checklist.
- Whether the repository is synced and the latest commit visible on GitHub.

Wait for the owner's approval before starting database/auth schema, private user data, OAuth, event ingestion or the next major feature phase.

## 11. Acceptance checklist for the first build

- [ ] Existing repository docs remain intact.
- [ ] React + TypeScript + Vite project starts and builds successfully.
- [ ] Landing, Explore, event detail, informational and 404 routes load.
- [ ] Search and visible filters work on the illustrative dataset, or are explicitly marked not yet wired.
- [ ] Every demo event is labelled illustrative / demo, not live verified.
- [ ] Date/time display distinguishes event timezone and separate deadline fields.
- [ ] No fabricated live listings, metrics, reviews, AI scores or verification labels.
- [ ] No dead links or inert buttons presented as functional.
- [ ] Mobile and desktop layouts are usable.
- [ ] Keyboard navigation, focus indicators, labels and contrast are checked.
- [ ] Loading, empty and error states are present where data is loaded.
- [ ] No secrets or service-role credentials in client code or Git history.
- [ ] Build/type checks pass, with actual results recorded.
- [ ] GitHub sync points to Omkar-Biranje/code-nexus and the committed changes are visible.
- [ ] No paid plan, card, paid API or custom domain was activated.

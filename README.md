# CODE NEXUS

**Find Hackathons. Find Teammates. Build Smarter.**

Global hackathon discovery and collaboration for students and builders.

## First working slice

- Responsive, light-first landing page and public routes.
- Explore search and filters with clearly labelled demo content until the live feed is connected.
- Event detail template with registration and submission dates kept separate.
- Automatic discovery source code using Hackalendar JSON + Brabble hackathons RSS.
- Daily Apps Script refresh, source attribution, deduplication and cross-source match labels.
- No authentication, member database, teammate matching or collaboration backend yet.

## Run the frontend

Requires Node.js 22 or later.

1. Install dependencies: npm install
2. Start development: npm run dev
3. Production build: npm run build

GitHub Actions runs the TypeScript/Vite production build and an Apps Script JavaScript syntax check on pushes to main.

## Automatic event discovery

See automation/google-apps-script/README.md and docs/GOOGLE_APPS_SCRIPT_SETUP.md.

One-time owner setup is required to create the Google Sheet, authorize Apps Script, deploy its read-only web app and connect the /exec URL in Explore. After that, the script refreshes daily and no per-event manual entry/review is required.

Enabled sources: Hackalendar public JSON API and Brabble hackathons RSS. Direct crawlers for Devpost, Hack2Skill, Unstop and Reskilll are not enabled as described in the source guide. Cross-source matches are not a guarantee of organizer verification. Source attribution must remain visible.

## Project documentation

- docs/PRODUCT_SPEC.md — product requirements.
- docs/ARCHITECTURE.md — architecture and security.
- docs/BUILD_PLAN.md — phased implementation plan.
- docs/BOLT_MASTER_PROMPT.md — project instructions for Bolt.
- docs/PRESENTATION_MILESTONE.md — presentation walkthrough.
- docs/GOOGLE_APPS_SCRIPT_SETUP.md — one-time integration setup.
- CONTEXT.md — current decisions and verified status.

## Demo disclaimer

The bundled sample events are illustrative only. They are not live listings. Imported index records carry source labels and are not represented as independently verified by CODE NEXUS.

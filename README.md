# CODE NEXUS

**Find Hackathons. Find Teammates. Build Smarter.**

Global hackathon discovery and collaboration for students and builders.

## Current milestone

- Public landing and Explore UI source prototype.
- Search and format/experience filters using clearly labelled illustrative demo events.
- Event detail template with separate registration and submission dates.
- Google Sheets + Apps Script RSS/Atom intake starter with a human review gate.
- No authentication, member database, teammate matching or collaboration backend yet.

## Run the frontend

Requires a current Node.js installation.

1. Install dependencies: npm install
2. Start the development server: npm run dev
3. Create a production build: npm run build

The first build has not yet been run in the imported Bolt workspace. npm install will regenerate the placeholder package-lock.json from package.json.

## Google event intake

See automation/google-apps-script/README.md and docs/GOOGLE_APPS_SCRIPT_SETUP.md.

The script reads only feed URLs an editor adds to the Sources sheet. New entries are candidates requiring human review; public output is restricted to Published + Verified rows. It does not read Gmail or scrape the entire web.

## Project documentation

- docs/PRODUCT_SPEC.md — product requirements.
- docs/ARCHITECTURE.md — architecture and security.
- docs/BUILD_PLAN.md — phased implementation plan.
- docs/BOLT_MASTER_PROMPT.md — project instructions for Bolt.
- CONTEXT.md — current decisions and verified status.

## Important demo disclaimer

The sample hackathon records are illustrative only. They are not live event listings, verified opportunities, or a claim of complete global coverage.

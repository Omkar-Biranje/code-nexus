# CODE NEXUS — Google event-intake setup

This is the presentation-ready implementation note for the optional Google Sheets + Apps Script intake prototype.

## Data flow

Official RSS/Atom feeds → Apps Script → Candidates sheet → Human review → Published sheet → read-only JSONP endpoint → CODE NEXUS Explore.

The process is intentionally review-gated. A successful fetch means only that the feed was reachable. It does not verify that dates, eligibility, fees, prizes or other event details are accurate.

## Files

- automation/google-apps-script/Code.gs — spreadsheet setup, feed fetch, parsing, deduplication, review queue, read-only public output and optional six-hour trigger.
- automation/google-apps-script/README.md — browser-only installation and publishing steps.
- src/lib/googleFeed.ts — browser-side callback loader.
- src/App.tsx — Explore page control for connecting the deployed feed.

## Permissions and account separation

The Apps Script is bound to a Google Sheet and uses the Google account that creates/authorizes the script. It requests spreadsheet access and URL-fetch access; it does not request Gmail access and does not read inbox messages. A second Gmail account is optional; it is not needed to run the event-feed prototype.

Do not paste OAuth tokens, passwords or API keys into chat or source files. The deployed /exec URL is a public read endpoint, not a secret; only public, verified event records belong in its output.

## Operational boundary

The owner must create the Google Sheet, authorize Apps Script, configure feed URLs, review candidates, and deploy the web app. This GitHub commit supplies the code and setup instructions; it does not create or authorize a Google account resource on the owner's behalf.

See the Apps Script README for setup, review and deployment steps.

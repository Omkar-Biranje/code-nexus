# CODE NEXUS — automatic discovery setup

## Architecture

Hackalendar JSON API + Brabble hackathons RSS
→ Google Apps Script daily fetch
→ normalization, de-duplication and cross-index matching
→ AutoEvents sheet (automatic publication with honest source labels)
→ public read-only JSONP endpoint
→ CODE NEXUS Explore.

This mode does not require a person to review each event. Instead, the UI labels single-index imports and cross-index corroboration separately. Neither label means CODE NEXUS independently verified every organizer fact.

## Source coverage

- Hackalendar: public no-key JSON API, attribution appreciated.
- Brabble: public hackathons RSS feed, daily refresh, attribution preserved. Its index includes selected event data from multiple platforms, including Unstop and Devpost.
- Devpost direct crawler: disabled because published Terms prohibit automated crawling.
- Hack2Skill and Reskilll direct crawlers: disabled pending a documented feed/API or written permission.
- Unstop direct endpoint: disabled; use its entries only as provided by the attributed Brabble feed until a documented direct access route is established.

The Sources sheet includes enabled and disabled source rows with their status/reason. Do not activate restricted sources without permission.

## One-time browser setup

1. Create a Google Sheet named **CODE NEXUS — Event Intake**.
2. Open **Extensions → Apps Script** and paste the Code.gs file from the repository into Code.gs.
3. Save and run setupCodeNexus once.
4. Authorize Google Sheets and URL Fetch access on Google's own consent screen.
5. The script seeds Hackalendar and Brabble automatically, creates Sources, SourceRecords, AutoEvents and RunLog, performs the first discovery pass, and installs a daily refresh trigger for approximately 04:00 Asia/Kolkata.
6. Deploy as a web app, executing as the sheet owner. Select the least-public access setting that allows the website to read public events.
7. Copy the /exec URL and connect it once in CODE NEXUS Explore. The browser remembers it and reconnects automatically on later visits.

No Gmail access or Gmail OAuth is used. No per-event manual entry or approval is required after setup.

## Automated status labels

- Auto-discovered: event observed in one index.
- Cross-source corroborated: matching event observed in more than one index.
- A single Hackalendar result is labelled as present in Hackalendar's reviewed index.
- Brabble records carry attribution and are not represented as an original CODE NEXUS data collection.
- Missing facts remain unknown. A known expired registration deadline is filtered out.
- Original organizer links are preferred. If an aggregator only supplies a share page, the UI labels it as a source listing.

## What is still not automatic / limitations

A Google owner must perform the one-time spreadsheet/script authorization, deployment and initial URL connection. Apps Script runs on that owner's quota. The daily trigger and connected public feed have not been created from GitHub; they become live only after the owner completes setup.

This does not crawl every internet page. It consumes approved feeds/APIs. Hack2Skill and Reskilll direct integrations require a public feed/API or permission. Devpost direct scraping is disabled. Event records from aggregators can be incomplete or stale; the organizer's official page is still the final source for date and eligibility decisions.

## Related files

- automation/google-apps-script/Code.gs — crawler, automatic publisher, source attribution and JSONP endpoint.
- automation/google-apps-script/README.md — one-time setup and source terms.
- src/lib/googleFeed.ts — browser feed loader.
- src/App.tsx — Explore feed connection, provenance and refresh display.

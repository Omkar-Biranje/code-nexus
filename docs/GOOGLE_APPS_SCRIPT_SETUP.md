# CODE NEXUS — automatic discovery setup

## Architecture

Hackalendar JSON API + Brabble public hackathons RSS -> daily Apps Script fetch -> normalize and deduplicate -> AutoEvents + EventHistory -> read-only feed -> CODE NEXUS Explore.

Organizer suggestion form -> OrganizerIntake review queue. Submitted URLs are stored for review and are not automatically fetched or published.

## Source policy

- Hackalendar: public no-key JSON API with organizer links and attribution.
- Brabble: public RSS feed, refreshed daily with attribution and original organizer links. The current JSON listing API requires a key; this build uses RSS.
- Devpost direct crawler: disabled because published terms prohibit automated crawling without permission.
- Hack2Skill and Reskilll direct crawlers: disabled until an approved public API/feed or written permission is confirmed.
- Unstop: some records may be present in Brabble's attributed feed; no direct crawler is enabled.

## What setup creates

Six sheet tabs: Sources, SourceRecords, AutoEvents, EventHistory, OrganizerIntake and RunLog. It also creates an organizer suggestion Google Form and a form-submit trigger. Feed-sourced opportunities are imported automatically; organizer suggestions enter the review queue with REVIEW_REQUIRED.

## Browser setup

1. Create a Google Sheet named CODE NEXUS — Event Intake.
2. Open Extensions -> Apps Script and paste automation/google-apps-script/Code.gs.
3. Save and run setupCodeNexus once.
4. Authorize Google Sheets, Google Forms and URL Fetch through Google's consent screen.
5. Confirm six tabs, organizer form, daily 04:00 Asia/Kolkata trigger, form-submit trigger, source result and RunLog.
6. Deploy -> New deployment -> Web app. Execute as Me; choose the least-public access that allows website visitors to read public event listings.
7. Copy the deployed /exec URL and connect it once in CODE NEXUS Explore.

## Data quality

- Auto-discovered: observed in one enabled index.
- Cross-source corroborated: matching record observed in multiple indexes.
- Source conflict: tracked fields differ between records.
- These are provenance labels, not independent organizer verification. Check the official event page before registration.
- Missing fields remain unknown. Registration, submission and event dates are stored separately.
- Cancelled records and known-expired opportunities are excluded from the public feed.
- Material changes and new records are written to EventHistory.

## Limitations and safety

The code fetches only the exact approved Hackalendar and Brabble feed endpoints. It does not scrape login-only pages, bypass CAPTCHAs/paywalls, fetch organizer-submitted URLs, read Gmail or invoke undocumented endpoints. A GitHub commit does not create the Google Sheet, authorize the script, install triggers or deploy a live feed. The owner must complete and verify those steps.

Until the Google setup is completed, Explore uses illustrative demo records. This is a permitted-source aggregator, not a universal web crawler.
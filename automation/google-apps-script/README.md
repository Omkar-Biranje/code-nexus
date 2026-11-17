# CODE NEXUS — automatic hackathon discovery

This free-first Apps Script pipeline discovers listings from permitted public feeds/APIs. After the owner's one-time setup, feed-sourced events are fetched, normalized, deduplicated and refreshed automatically. No per-event manual entry or approval is needed for these configured feeds.

A separate organizer/community suggestion form accepts event URLs. Those suggestions enter a review queue and are not automatically fetched or published.

## Enabled sources

1. **Hackalendar JSON API** — public structured event index; no API key.
   - Endpoint: https://hackalendar.com/api/events
   - Docs: https://hackalendar.com/api
2. **Brabble hackathons RSS** — public bot/newsletter feed, daily refresh.
   - Feed: https://brabble.ai/rss/hackathons.xml
   - Developer / fair-use terms: https://brabble.ai/developers

Brabble's current JSON listing API requires a key. CODE NEXUS uses the public RSS route instead. Brabble reuse requires attribution, original organizer links and daily caching; do not present its full index as CODE NEXUS's own catalogue.

## Platform coverage policy

- **Unstop and Devpost:** some listings may arrive through Brabble's attributed feed. They are not direct CODE NEXUS integrations.
- **Devpost direct crawler:** disabled because its published terms prohibit automated scraping/crawling without permission.
- **Hack2Skill and Reskilll:** direct ingestion remains disabled until a documented public feed/API or written permission is confirmed.
- The Sources sheet documents inactive platforms and the reason. Do not activate direct crawlers without a permitted access route.

## What setup creates

Six Google Sheet tabs:

- `Sources` — configured sources, enablement, last-check time and fetch result.
- `SourceRecords` — latest fetched record from each enabled source.
- `AutoEvents` — normalized, de-duplicated event index exposed to Explore.
- `EventHistory` — new listings and material changes to tracked event facts.
- `OrganizerIntake` — community/organizer suggestions waiting for review.
- `RunLog` — setup, source fetch, trigger and intake activity.

Setup also creates one Google Form named **CODE NEXUS — Submit a hackathon**. It asks for the official event URL, organizer/host and optional context. It is not event registration. Valid HTTPS submissions enter `OrganizerIntake` with status `REVIEW_REQUIRED`; submitted URLs are not automatically fetched.

## Automatic feed pipeline

1. Fetch Hackalendar JSON and Brabble RSS using exact HTTPS endpoint allowlists; redirects are blocked.
2. Normalize title, organizer, dates, mode, location, skills, team size, fees, prizes, eligibility, official/source URLs and platform provenance.
3. Deduplicate using canonical event URL or title + organizer.
4. Cross-match records from different indexes, retain source names and flag disagreements.
5. Write the current event index to `AutoEvents`, preserve discovery time, and append material changes to `EventHistory`.
6. Expose non-cancelled, not-known-expired opportunities through the read-only JSON/JSONP endpoint.
7. Refresh daily at approximately 04:00 Asia/Kolkata.

The fetch is bounded to five Hackalendar pages of up to 200 rows each and a 2 MB Brabble RSS response. A failed source fetch does not erase that source's previous records.

## Trust and data quality

- **Auto-discovered:** observed in one configured index.
- **Cross-source corroborated:** matching record observed in more than one index.
- **Source conflict:** tracked facts differ between source records.
- These are discovery/provenance labels, not independent organizer verification. The original organizer page remains the source of truth.
- Unknown dates, timezones, eligibility, fees, prizes and team sizes remain unknown.
- Registration deadline, submission deadline, event start and event end are separate.
- Cancelled events and known-expired opportunities are excluded from the public feed. When registration deadline is missing, event start is used as the expiry boundary if provided.

## One-time browser setup

1. Create a Google Sheet named **CODE NEXUS — Event Intake**.
2. Open **Extensions → Apps Script**.
3. Replace starter `Code.gs` with this repository's `automation/google-apps-script/Code.gs`; save.
4. Select `setupCodeNexus` and click **Run** once.
5. Authorize Google Sheets, Google Forms and external URL Fetch using Google's consent screen.
6. The script creates the tabs and organizer form, installs daily and form-submit triggers, and performs the first fetch.
7. The setup alert displays the organizer form URL. The read-only feed also exposes this URL after deployment.
8. Deploy → New deployment → Web app. Choose **Execute as: Me** and the least-public access setting that allows website visitors to read public listings.
9. Copy the URL ending in `/exec`; in CODE NEXUS → Explore → **Connect discovery feed**, paste it once.

If an earlier workbook exists, setup appends missing columns and creates new tabs without clearing existing event rows. Unexpected header mismatches stop the script instead of overwriting data.

The owner must authorize Apps Script, verify the first fetch, deploy the endpoint and connect the URL. No Google Sheet, form, trigger or live feed is created by a GitHub commit alone. No Gmail access is used. Never put passwords, OTPs or secrets in chat or source control.

## Safety and operating limits

- Only two exact approved feed endpoints are fetched. Organizer-submitted links are stored for review and are not fetched.
- The script uses a lock, bounded pagination, response-size caps and daily caching.
- No logged-in page scraping, CAPTCHA bypass, paywall bypass or undocumented private API use.
- Google Apps Script quotas vary and can change: https://developers.google.com/apps-script/guides/services/quotas
- The public feed contains public event details only; do not store student profiles, private emails or credentials in this workbook.
- This is a permitted-source aggregator, not a universal internet crawler.

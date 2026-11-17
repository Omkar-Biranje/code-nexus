# CODE NEXUS — automatic hackathon discovery

This free-first Google Apps Script crawler performs daily discovery from configured public indexes. After the one-time Google Sheet authorization and web-app deployment, there is **no manual per-event entry or approval workflow**.

## Enabled automatic sources

1. **Hackalendar JSON API** — public structured event data, no API key. Its API page describes the index as verified; CODE NEXUS still preserves the original organiser URL and does not claim that our app independently rechecked organizer facts.
   - API: https://hackalendar.com/api/events
   - API details: https://hackalendar.com/api
2. **Brabble hackathons RSS** — daily-refreshed feed that aggregates listings from several platforms including Unstop, Devpost, Devfolio, MLH, DoraHacks, HackerEarth, Hack Club and others.
   - Feed: https://brabble.ai/rss/hackathons.xml
   - Developer / fair-use terms: https://brabble.ai/developers

Brabble's published fair-use terms allow reuse with attribution, require links back to organisers, recommend daily caching, and prohibit presenting its full index as our own. CODE NEXUS refreshes it daily and labels Brabble as a source.

## Platform coverage and restrictions

- **Unstop and Devpost:** some listings are available indirectly through Brabble's source-attributed feed. We do not directly crawl these sites from CODE NEXUS.
- **Devpost direct crawler:** disabled because Devpost's published Terms of Service prohibit automated scraping/crawling.
- **Hack2Skill:** shown as a known platform, but no documented public feed/API or general automated-access permission was established during this review. Direct source remains disabled. We will add it after Hack2Skill supplies a public feed/API or written permission.
- **Reskilll:** no documented public feed/API or automated-access permission was established during this review. Direct source remains disabled.
- The Sources tab includes these inactive platforms with the reason. Do not change them to Enabled without documenting an approved data-access route.

## What happens automatically

1. The first setup creates four tabs: Sources, SourceRecords, AutoEvents, and RunLog.
2. The Sources tab is seeded with Hackalendar and Brabble enabled. Restricted / unconfirmed direct crawlers are listed as disabled.
3. Apps Script fetches the two enabled sources, parses their records, normalizes fields, and deduplicates records by official URL or title/organizer.
4. When both indexes contain the same event, the record is labelled **Cross-source corroborated** and keeps both source names.
5. Every discovered record is automatically written to AutoEvents and exposed by the read-only web app if its known registration deadline has not passed.
6. A daily trigger runs at approximately 04:00 Asia/Kolkata and refreshes the indexes. Brabble is not polled hourly because its published fair-use guidance says daily data refresh is sufficient.

There is no manual event review queue in this automatic mode. Instead, event cards state whether the listing is auto-discovered or appears in multiple indexes. A cross-index match is **not** a guarantee that every organizer fact has been independently verified. The original organizer registration page remains the final source of truth.

## One-time setup in your browser

1. Create a Google Sheet named **CODE NEXUS — Event Intake**.
2. In that sheet, open **Extensions → Apps Script**.
3. Replace the starter Code.gs with the Code.gs file in this folder and save.
4. Select setupCodeNexus and click **Run** once. Review Google's permission screen and authorize spreadsheet access and external URL fetching.
5. The script creates and seeds the tabs, installs the daily trigger, and runs the initial discovery pass. No source URLs need to be added manually.
6. In Apps Script choose **Deploy → New deployment → Web app**.
7. Choose **Execute as: Me**. Choose the least-public access that lets your website visitors read the public index. If anonymous access is unavailable, do not weaken account security; keep the site in demo mode.
8. Deploy and copy the web app URL ending in /exec.
9. Open CODE NEXUS → Explore → **Connect discovery feed**, paste the /exec URL once, and connect. The browser remembers it and reconnects on later visits.

The Google Sheet and Apps Script must be created under an account controlled by the project owner. Do not paste passwords, OAuth tokens or API keys into ChatGPT or the repository. This integration does not request Gmail access and does not read inbox messages.

## Data quality and publication semantics

- **Auto-discovered:** one configured index supplied this record.
- **Cross-source corroborated:** two configured indexes supplied a matching record.
- A single Hackalendar source result is labelled as present in Hackalendar's reviewed index; it is not a claim that CODE NEXUS independently checked the organizer's latest rules.
- Brabble records carry attribution and are not represented as an original CODE NEXUS data collection.
- Unknown dates, timezones, eligibility, fees, prizes and team sizes stay blank / Not specified.
- Registration deadline, submission deadline, event start and event end are separate.
- A known registration deadline in the past is excluded by the public read endpoint. A missing deadline is not guessed.
- A successful fetch means only that a source was reachable. It does not guarantee that every event is current, open, complete or eligible for every student.

## Safety, quota and operating limits

- Only HTTPS public source endpoints are fetched.
- Devpost, Hack2Skill, Unstop and Reskilll direct-crawler rows are disabled by default.
- The script uses a lock, bounded pagination (maximum five pages of 200 Hackalendar records), a 2 MB RSS response cap and a once-daily schedule.
- Google Apps Script consumer accounts currently list 20,000 URL Fetch calls/day, 90 minutes/day total trigger runtime and a six-minute maximum per execution. Quotas can change: https://developers.google.com/apps-script/guides/services/quotas
- Public /exec output contains only public event data. Do not store student profiles, private emails or credentials in this spreadsheet.
- This is an automated source index, not a universal web crawler. Its coverage depends on sources whose feeds or APIs are permitted and available.
- Live Google execution, authorization, daily trigger and source responses still require owner-side setup and testing.

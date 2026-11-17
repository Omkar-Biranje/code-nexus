# CODE NEXUS — Google Sheets event intake

This is a free-first, bounded event-intake prototype. Google Sheets is the review console, Google Apps Script fetches explicitly configured RSS/Atom feeds, and the CODE NEXUS Explore page can read only approved public rows.

## What it does

1. An editor adds an official, permitted RSS/Atom feed URL to the Sources sheet.
2. ingestApprovedFeeds() fetches that feed and extracts its title, URL, source date and summary.
3. New entries are added to Candidates with **Pending review** status.
4. A human checks each candidate against the official organizer page and copies approved facts into Published.
5. Only rows marked **Published** and **Verified**, with valid HTTPS source and official URLs, are returned by the public endpoint.
6. The Explore page can connect to the deployed endpoint using its **Connect Google Sheet** control.

The automation does not perform a broad Google search, does not read Gmail, does not bypass access controls and does not automatically publish unreviewed records.

## Setup in your browser

1. Create a new Google Sheet named **CODE NEXUS — Event Intake**.
2. In that sheet, open **Extensions → Apps Script**.
3. Replace the starter contents of Code.gs with the contents of this folder's Code.gs, then save.
4. In Apps Script, select setupCodeNexus and click **Run**. Review Google's permission screen and authorize the requested spreadsheet and URL-fetch access.
5. Return to the Sheet. Four tabs should exist: Sources, Candidates, Published, and RunLog.
6. In Sources, add one feed per row:
   - Enabled: TRUE
   - Source name: a recognizable organizer/platform name
   - Feed URL: the official HTTPS RSS/Atom feed URL
   - Region: optional
   - Notes: why this source is permitted / useful
7. Run ingestApprovedFeeds from the Apps Script editor or the CODE NEXUS menu. Inspect Candidates; all new items should be marked Pending review.

Do not add login-only, CAPTCHA-protected, paywalled, or disallowed endpoints. Use official feeds or feeds whose terms permit automated access. This prototype does not discover feed URLs for you; an administrator must choose and document each source.

## Human review and publishing

For each candidate, open the official event page and independently confirm:
- organizer and event title;
- eligibility and team-size rules;
- registration deadline and submission deadline as separate fields;
- event start and end;
- event-local IANA timezone;
- online / in-person / hybrid mode and location;
- entry fee, currency, prize and official registration URL.

Unknown values must remain blank / Not specified; do not infer them. Copy approved records into Published using its header row. Set:
- Public status = Published
- Verification status = Verified only after checking the organizer's source
- Official URL = organizer's official event page
- Source URL = feed or original source used to discover the record

The public endpoint excludes every row that is not both Published and Verified.

## Publish the read-only feed

1. In Apps Script, choose **Deploy → New deployment → Web app**.
2. Choose **Execute as: Me**.
3. Choose the least-public access setting that still allows your website visitors to read public event listings. If anonymous/public access is unavailable on your account, do not weaken account security; use the Sheet review workflow and keep the site in demo mode.
4. Deploy and copy the web app URL ending in /exec.
5. Open the CODE NEXUS Explore page, select **Connect Google Sheet**, paste the /exec URL and connect.

The browser uses a callback-only JSONP request because Apps Script Content Service redirects its output to a different Google URL. The callback name is strictly validated in Code.gs. The endpoint is read-only and exposes only rows explicitly marked Published and Verified. Do not put private student or organizer information in the Published tab.

## Optional scheduled refresh

Run installSixHourlyRefresh once from Apps Script to install a six-hour trigger. It runs under the Google account that created it. You can keep manual refresh for the presentation and install the trigger later.

## Limits and safety

- Apps Script has per-user quotas and a six-minute execution limit per run; this script processes only the configured feeds and uses one bounded request per feed.
- The script rejects non-HTTPS and common private/local host patterns, rejects redirects, and caps each feed response at 2 MB.
- Editors of the Sheet control which feeds are fetched. Restrict edit access to trusted project maintainers.
- Public endpoint output is public. Store only public event fields in Published.
- This is an intake prototype, not a comprehensive or real-time global event crawler. Feed coverage depends on configured sources, their update frequency and provider rules.
- The script has not been deployed or run against live sources from this repository commit. Test it with one permitted feed before adding more.

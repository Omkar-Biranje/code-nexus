# CODE NEXUS — Presentation milestone

**Date:** 17 November 2026  
**Milestone:** public UI prototype + automatic hackathon discovery source

## What is committed

1. Responsive landing page, public navigation and value proposition.
2. Explore page with search, mode/experience filters and event cards.
3. Event detail template with separate registration and submission dates.
4. About, How it works, Contact, Privacy, Terms, Accessibility and 404 routes.
5. Google Apps Script automatic discovery from Hackalendar JSON API and Brabble hackathons RSS.
6. Daily refresh, automatic normalization/deduplication, cross-source matching and source-attributed AutoEvents records.
7. Explore connector that remembers the public Apps Script URL and reconnects on later visits.
8. Source count/status/attribution shown on imported event cards.

## How to present the crawler

Show this data flow:

Hackalendar + Brabble public indexes → daily Apps Script fetch → normalized/deduplicated records → source matching → AutoEvents → CODE NEXUS Explore.

Explain that:
- there is no per-event manual review step after the one-time Google setup;
- single-index and cross-index records are labelled differently;
- a cross-source match is not the same as direct organizer verification;
- original organizer links are retained when the source provides them;
- Hack2Skill and Reskilll direct feeds await permission or a documented feed/API;
- Devpost direct crawling is disabled by its published terms; some Devpost listings can still arrive through Brabble's attributed feed;
- Unstop listings are consumed indirectly via Brabble for now.

## Accurate presentation wording

"CODE NEXUS has a responsive public discovery prototype and an automatic event-intake pipeline in source. Once the owner completes the one-time Google authorization and deployment, Apps Script will refresh public indexes daily, deduplicate and cross-match records, and expose source-attributed listings on Explore. Cross-source matching improves confidence, but the original organizer page remains the final authority for dates and eligibility."

Do not say the crawler is live, the Google Sheet is deployed, or global listings are comprehensive until the first live run is confirmed. Do not call every imported record fully verified.

## Build status

- GitHub Actions baseline TypeScript/Vite build passed on commit 2e23405e9b4214951234fc9a652db876736e3bf0.
- Latest UI and automatic crawler changes are committed after that baseline and require another CI run.
- No Google Sheet, Apps Script authorization, daily trigger, live endpoint or deployed site has yet been created by the owner.
- Browser preview and visual QA remain outstanding.

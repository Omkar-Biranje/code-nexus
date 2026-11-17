# CODE NEXUS — Presentation milestone

**Date:** 17 November 2026  
**Milestone:** first public UI source + Google event-intake starter

## What is in the repository

1. Landing page with product positioning and a visual discovery concept.
2. Explore page with keyword search, format and experience filters.
3. Event cards and a detail template with separate registration, submission and event dates.
4. About, How it works, Contact, Privacy, Terms, Accessibility and 404 routes.
5. Google Apps Script starter that fetches specifically configured RSS/Atom feeds into a review queue.
6. Public event-feed loader in Explore that can connect to a deployed Apps Script web app.

## What to demonstrate

1. Open the CODE NEXUS landing page and explain the product promise.
2. Select Find a hackathon / Explore.
3. Search for a skill or theme and change the format filter.
4. Open one sample event and point out that registration and submission dates are separate.
5. Explain the Google automation flow: official feed → candidate queue → human verification → public listing.
6. Show the Google Sheet tab design from the setup guide if the spreadsheet has been created.

## Accurate wording for the presentation

"CODE NEXUS has an initial responsive UI prototype and a Google Sheets + Apps Script ingestion workflow under development. The workflow collects items from configured public RSS/Atom feeds into a review queue. An administrator verifies each event before it can be published to the website."

Do not say the website is fully deployed, Google automation is live, all global hackathons are collected automatically, or event records are already verified unless those steps have actually been completed.

## Current verification

- GitHub source commit for frontend: d6637a40939263dc75b5ba6bc8619c2153619400.
- GitHub source commit for Google intake: 9e888603d98cbdc4f47db352261c6a34900a8bfd.
- Files were committed to the private repository's main branch.
- No npm install, build, TypeScript check, browser QA, Google Sheet authorization, feed fetch, web app deployment or live-feed connection has yet been performed.

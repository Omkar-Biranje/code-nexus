# CODE NEXUS — AI Builder and Free-Plan Decision

Decision date: 2026-11-17  
Status: Selected for the first build; account connection and project creation still require the owner's action.

## Decision

Use **Bolt.new Free** as the browser-based AI builder, **Bolt Cloud** for the initial database, authentication, storage, server functions and hosting, and the existing private **GitHub** repository as the code source of truth.

Do not select Base44 for this build. Do not make the first release depend on the native Bolt-to-Supabase integration because Bolt's current help-center index says that integration is available on Pro and Teams plans.

This is a free-first MVP decision, not a claim that free hosting can support unlimited traffic or permanent production-scale operations.

## Verified comparison

### Bolt.new Free

The official Bolt pricing page currently lists:
- $0 Free plan.
- Public and private projects.
- 300,000 tokens per day and 1,000,000 tokens per month.
- Website hosting, with Bolt branding.
- Up to 333,000 web requests.
- 10 MB file upload limit.
- Unlimited databases listed on the plan page; this must not be interpreted as unlimited storage, compute, bandwidth or capacity.
- Custom domains and expanded database capacity are paid-plan features.

Bolt's official product documentation says Bolt Cloud supplies the built-in database, authentication, file storage, server functions and hosting. All Bolt users, including Free users, can publish to a free `.bolt.host` subdomain. Custom domains are paid.

Bolt's official GitHub announcement says the two-way GitHub integration is available to all users. It supports importing existing repositories, creating private repositories, pushing changes and pulling changes made in GitHub.

### Base44 Free

The current official Base44 pricing page lists:
- $0 Free plan.
- 25 message credits per month.
- 100 integration credits per month.
- Up to five apps.
- Core authentication, database functionality and analytics.
- GitHub integration is listed on Builder and higher plans, not Free.

The official Base44 GitHub integration article (last updated 2026-11-01) also states that GitHub integration requires Builder or higher. This conflicts with the requirement to maintain the existing repository with free two-way sync.

### Supabase Free (reference only; not selected as the initial Bolt backend)

Supabase's official pricing page currently lists:
- 500 MB database per project.
- 1 GB file storage.
- 50,000 monthly active users.
- 5 GB egress.
- Free projects pause after one week of inactivity.
- Automatic backups are not included on Free.

Bolt's current help-center documentation index lists the native Supabase integration as available on Pro and Teams. Therefore, the initial build must use Bolt Cloud's built-in database instead of assuming a free native Supabase connector. A future migration or manually configured external connection would require a separate feasibility and security review before use.

## Product implications and limits

1. CODE NEXUS may be designed for an international audience from day one: IANA time zones, ISO country and currency codes, international eligibility fields, responsive layouts and locale-aware formatting.
2. "Global-ready" describes product design and data handling. It does not mean global-scale infrastructure, guaranteed uptime or unlimited traffic.
3. Bolt's Free hosting limit is listed as up to 333,000 web requests. Bolt's current guidance says free sites stop serving content after reaching the monthly limit. Traffic can therefore exceed the free plan.
4. The free public site uses a `.bolt.host` address and carries Bolt branding. A custom domain is not included.
5. Keep event records portable: use explicit schema/migration files, standard timestamps and ISO codes, and exportable data. Do not put business rules exclusively in a visual builder configuration.
6. Preserve a documented path to migrate the application to another host/database if limits or product needs change.
7. Do not enable paid billing, purchase a domain, add a credit card, or add paid APIs. Stop and ask the owner if the interface offers only a paid route for a required feature.

## Repository workflow

Repository: https://github.com/Omkar-Biranje/code-nexus  
Default branch: `main`  
Visibility: private

Import this existing repository into Bolt using the GitHub option on Bolt's start page. Preserve all existing Markdown documentation. The repository currently contains project documentation rather than a complete application scaffold; ask Bolt to create the frontend scaffold in the imported project without deleting or rewriting the docs.

Connect only the repository `Omkar-Biranje/code-nexus`. Review the GitHub permission screen and avoid granting access to unrelated repositories where the provider offers a selected-repository option. Verify that Bolt reports the correct repository and branch and that a test commit appears on GitHub before relying on sync.

Do not edit the same files simultaneously in Bolt and directly on GitHub. After connecting sync, make code changes in Bolt and verify the resulting commits in GitHub.

## Initial toolchain

- AI builder: Bolt.new Free.
- App: React + TypeScript + Vite.
- Styling: Tailwind CSS with reusable accessible components.
- Routing: React Router.
- Icons: lucide-react.
- Database/auth/files/server logic: Bolt Cloud built-in services for the first release.
- Source control: existing private GitHub repo.
- Hosting: Bolt Free `.bolt.host` URL.
- Event discovery: later, bounded permitted public feeds/APIs and organizer submissions; optional Google Apps Script only after separate setup and quota review.
- No OpenAI API dependency for the MVP.

## Sources checked on 2026-11-17

- Bolt pricing: https://bolt.new/pricing
- Bolt GitHub two-way sync announcement: https://bolt.new/blog/github-hackathon
- Bolt help-center documentation index (Supabase integration is listed as Pro/Teams): https://support.bolt.new/llms.txt
- Bolt introduction and Bolt Cloud / free hosting overview: https://support.bolt.new/building/intro-bolt
- Bolt QuickStart and free token allowance: https://support.bolt.new/building/quickstart
- Bolt article on free-tier and scaling limits (2026-11-04): https://bolt.new/blog/how-to-build-a-startup-without-a-technical-co-founder
- Base44 pricing: https://base44.com/pricing
- Base44 GitHub integration (updated 2026-11-01): https://base44.com/blog/news/base44-github-integration
- Supabase pricing: https://supabase.com/pricing

Provider plans and terms can change. Re-check before account authorization, publishing or any action that could incur cost.

# CODE NEXUS — Architecture and Security

## Proposed architecture (not yet provisioned)
- Frontend: React + TypeScript + Tailwind CSS.
- Backend: Supabase Auth, Postgres, Storage, subject to current free-tier limits.
- Source control: GitHub.
- Builder/hosting: choose only after checking current official free-plan limits, export, and GitHub sync.
- Ingestion: Google Apps Script, permitted feeds/APIs, organizer submissions, and bounded public-source fetches.
- Optional model extraction may create candidate records only; deterministic validation and moderation remain authoritative.

## Candidate data domains
profiles, roles, skills, interests, organizers, hackathons, hackathon_sources, event_change_history, source_integrations, ingestion_jobs, ingestion_logs, bookmarks, comparisons, submissions, teams, team_members, teammate_posts, invitations, join_requests, projects, tasks, milestones, comments, files, notifications, notification_preferences, reports, audit_logs.

Use UUID keys, foreign keys, check constraints, unique canonical URL/fingerprint constraints, indexes, and explicit timestamps. Database migrations are the source of truth.

## Event data rules
- Store exact instants in UTC plus source/event IANA timezone for display and local interpretation.
- Separate registration_deadline, submission_deadline, event_start, event_end.
- Currency as ISO 4217; amounts numeric only when explicitly stated.
- Country as ISO 3166-1 alpha-2 when known.
- Unknown values are NULL, not invented defaults.
- Store canonical/source URLs, discovered_at, last_checked_at, verification_status, extraction_method, confidence, evidence, and source attribution.
- Record material changes.

## Access control
- Enable RLS on every table exposed to the client.
- Public users read only explicitly public event/organizer fields.
- Members update only their own profile and private records.
- Team resources require active membership and appropriate team role.
- Organizer writes require verified ownership/authorization.
- Privileged roles checked using trusted server-side claims/protected records, never client-supplied role fields.
- No self-promotion.
- Use private storage buckets and scoped signed URLs where appropriate.

## Secrets and OAuth
- Never expose service-role keys, model keys, OAuth refresh tokens, or admin secrets to client code.
- Use provider secret stores or Apps Script Script Properties.
- Request minimum OAuth scopes; Gmail ingestion should use a dedicated label and avoid broad inbox access.
- Never request passwords, OTPs, recovery codes, or API keys in chat.
- Never commit .env; provide placeholder-only .env.example.

## Ingestion safety
- HTTPS only; allowlist domains where practical.
- Prevent SSRF: reject localhost/private/loopback/link-local/metadata IPs; validate DNS and every redirect.
- Apply redirect limits, timeouts, response-size/content-type checks, per-domain rate limits.
- Use ETag/Last-Modified, idempotent jobs, checkpoints, bounded batches, exponential backoff.
- Respect robots, terms, rate limits, and API policies.
- Fetch success does not mean facts are verified.
- Preserve evidence snippets for review.

## Operations
Free tiers have quotas, pauses, and changing policies; never promise unlimited uptime or global-scale capacity. Apps Script has execution/daily quotas; use locks, small batches, checkpoints, and logs. Document data export and recovery because free database plans may lack automated backups. Add rate limits, sanitized rich text, safe redirects, secure headers, and appropriate CSRF protections.

## Tests
Test RLS isolation, role escalation, input validation, duplicate detection, timezone behavior, URL safety, signup/onboarding, Explore/filter, event detail, bookmarks, teammate requests, invitations, and project tasks. Check keyboard navigation, focus, labels, contrast, and reduced motion.

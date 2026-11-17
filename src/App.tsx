import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, CircleHelp,
  Compass, ExternalLink, Filter, Globe2, Layers3, Menu, Network, Search,
  ShieldCheck, Sparkles, Users, X, Zap
} from "lucide-react";
import {
  BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams
} from "react-router-dom";
import { demoEvents, type Hackathon } from "./data/demoEvents";
import { loadGoogleFeed, type PublishedFeedEvent } from "./lib/googleFeed";

function Logo() {
  return (
    <Link to="/" className="brand" aria-label="CODE NEXUS home">
      <span className="brand-mark"><Network size={19} strokeWidth={2.2} /></span>
      <span>CODE<span className="brand-light">NEXUS</span></span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/explore", label: "Explore" },
    { to: "/how-it-works", label: "How it works" },
    { to: "/about", label: "About" },
  ];
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Logo />
        <nav className={open ? "main-nav open" : "main-nav"} aria-label="Main navigation">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/explore" className="button button-dark nav-cta" onClick={() => setOpen(false)}>
            Find a hackathon <ArrowUpRight size={16} />
          </Link>
        </nav>
        <button className="icon-button mobile-menu" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Logo />
          <p>Find the hackathon. Find your people. Build something that matters.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-label">Explore</span><Link to="/explore">Hackathons</Link><Link to="/how-it-works">How it works</Link></div>
          <div><span className="footer-label">Company</span><Link to="/about">About</Link><Link to="/contact">Contact</Link></div>
          <div><span className="footer-label">Legal</span><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/accessibility">Accessibility</Link></div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 CODE NEXUS</span>
        <span>Built for the people who build.</span>
      </div>
    </footer>
  );
}

function EventCard({ event, live = false }: { event: Hackathon; live?: boolean }) {
  return (
    <article className="event-card">
      <div className="event-card-top">
        <span className={live ? "status-pill status-live" : "status-pill status-demo"}>
          <span className="status-dot" />{live ? (event.sourceConflicts ? "Source conflict" : event.sourceCount && event.sourceCount > 1 ? "Cross-source match" : "Auto-discovered") : "Illustrative demo"}
        </span>
        <span className="event-mode">{event.mode || "Mode not specified"}</span>
      </div>
      <div className="event-card-body">
        <p className="event-organizer">{event.organizer || "Organizer not specified"}</p>
        <h3>{event.title}</h3>
        <p className="event-summary">{event.summary}</p>
        {live && <p className="event-provenance">{event.sourceCount && event.sourceCount > 1 ? "Found in " + event.sourceCount + " indexes" : "Auto-discovered"}{event.sourceNames ? " · " + event.sourceNames : ""}</p>}
        {live && event.sourceConflicts && <p className="event-conflict">Sources disagree on: {event.sourceConflicts}. Check the organizer page before relying on these details.</p>}
        <div className="tag-row">{event.skills.slice(0, 3).map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div>
      </div>
      <div className="event-card-bottom">
        <div className="event-meta">
          <CalendarDays size={15} />
          <span>{event.registrationDeadline ? "Register by " + formatDate(event.registrationDeadline, event.timezone) : "Registration deadline not specified"}</span>
        </div>
        {event.isDemo ? (
          <Link className="text-link" to={"/hackathons/" + event.slug}>View details <ArrowRight size={15} /></Link>
        ) : (event.officialUrl || event.sourceUrl) ? (
          <a className="text-link" href={event.officialUrl || event.sourceUrl || undefined} target="_blank" rel="noreferrer">{event.officialUrl ? "Official event page" : "View source listing"} <ExternalLink size={14} /></a>
        ) : <span className="muted-small">Source link not supplied</span>}
      </div>
    </article>
  );
}

function normalizeMode(value: string) {
  const mode = value.trim().toLowerCase();
  if (mode === "online") return "Online";
  if (mode === "hybrid") return "Hybrid";
  if (mode === "offline" || mode === "in person" || mode === "in-person") return "In person";
  return value;
}

function formatDate(value: string, timezone: string | null) {
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    const monthName = new Intl.DateTimeFormat(undefined, { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 15)));
    return Number(day) + " " + monthName + " " + year;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not specified";
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric", month: "short", year: "numeric",
      timeZone: timezone || undefined,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(date);
  }
}

function mapPublishedEvent(item: PublishedFeedEvent, index: number): Hackathon {
  return {
    id: "sheet-" + index,
    slug: item.slug || "published-event-" + index,
    title: item.title || "Untitled event",
    organizer: item.organizer || "Organizer not specified",
    summary: item.summary || "Summary not supplied by the organizer.",
    mode: normalizeMode(item.mode || "Not specified"),
    location: [item.city, item.country].filter(Boolean).join(", ") || "Not specified",
    country: item.country || null,
    city: item.city || null,
    level: (item.eligibility || "").toLowerCase().includes("beginner") ? "Beginner friendly" : "Not specified",
    skills: (item.skills || "").split(",").map((value) => value.trim()).filter(Boolean),
    registrationDeadline: item.registrationDeadline || null,
    submissionDeadline: item.submissionDeadline || null,
    eventStart: item.eventStart || null,
    eventEnd: item.eventEnd || null,
    timezone: item.eventTimezone || null,
    teamSize: item.teamSize || null,
    prize: item.prizeAmount ? item.prizeAmount + " " + (item.prizeCurrency || "") : "Not specified",
    entryFee: item.entryFee || null,
    eligibility: item.eligibility || null,
    sourcePlatforms: item.sourcePlatforms || "",
    lastCheckedAt: item.lastCheckedAt || null,
    sourceUrl: item.sourceUrl || null,
    officialUrl: item.officialUrl || null,
    verificationStatus: item.verificationStatus || "Auto-discovered",
    sourceNames: item.sourceNames || "",
    sourceCount: Number(item.sourceCount) || 1,
    attribution: item.attribution || "",
    sourceConflicts: item.sourceConflicts || "",
    isDemo: false,
  };
}

function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    navigate("/explore?q=" + encodeURIComponent(query));
  }
  return (
    <>
      <section className="hero-section">
        <div className="hero-grid" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-spark"><Sparkles size={13} /></span> THE BUILDER NETWORK</div>
            <h1>Find the hackathon.<br /><em>Find your people.</em></h1>
            <p className="hero-lede">A clearer way to discover opportunities, meet people who complement your skills, and turn ideas into something real.</p>
            <form className="hero-search" onSubmit={submit}>
              <Search size={19} />
              <input aria-label="Search hackathons, skills or themes" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “AI”, “climate”, or “beginner friendly”" />
              <button type="submit" className="button button-primary">Explore <ArrowRight size={16} /></button>
            </form>
            <div className="hero-trust"><span><Check size={14} /> Opportunities with context</span><span><Check size={14} /> Built for global teams</span></div>
          </div>
          <div className="hero-art" aria-label="Illustration of a hackathon opportunity card">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="art-spark spark-a">✳</div><div className="art-spark spark-b">✦</div>
            <div className="art-float float-top"><span className="float-icon"><Globe2 size={16} /></span><span><b>Think beyond borders</b><small>Find opportunities worldwide</small></span></div>
            <div className="opportunity-card">
              <div className="opportunity-head"><span className="mini-kicker">YOUR NEXT BUILD</span><span className="live-indicator"><i /> DEMO PREVIEW</span></div>
              <div className="opportunity-visual"><div className="visual-symbol"><Layers3 size={34} /></div><div className="visual-lines"><i /><i /><i /></div></div>
              <div className="opportunity-content"><span className="tiny-label">SAMPLE OPPORTUNITY</span><h3>Build something<br />that moves people.</h3><p>Discover a challenge that fits your curiosity.</p></div>
              <div className="opportunity-foot"><span><Users size={14} /> Find your team</span><ArrowUpRight size={17} /></div>
            </div>
            <div className="art-float float-bottom"><span className="avatar-stack"><i>O</i><i>T</i><i>+</i></span><span><b>Better together</b><small>Complementary skills, shared goals</small></span></div>
          </div>
        </div>
        <div className="container hero-bottom">
          <span>DISCOVER</span><i /><span>UNDERSTAND</span><i /><span>MATCH</span><i /><span>BUILD</span><i /><span>SUBMIT</span>
        </div>
      </section>

      <section className="section section-intro">
        <div className="container intro-grid">
          <div><p className="section-kicker">LESS SCROLLING. MORE BUILDING.</p><h2>Great ideas start with<br /><span>the right opportunity.</span></h2></div>
          <p className="section-intro-copy">Hackathon details are scattered across platforms, posts and group chats. CODE NEXUS brings discovery, context and collaboration into one focused experience.</p>
        </div>
        <div className="container feature-grid">
          <div className="feature-card feature-blue"><span className="feature-icon"><Compass size={21} /></span><span className="feature-index">01 / DISCOVER</span><h3>Find what fits.</h3><p>Explore opportunities by skills, interests, format and deadlines — not endless tabs.</p><Link to="/explore" className="feature-link">Explore events <ArrowUpRight size={15} /></Link></div>
          <div className="feature-card feature-cream"><span className="feature-icon"><Users size={21} /></span><span className="feature-index">02 / CONNECT</span><h3>Meet your people.</h3><p>Find future teammates with complementary skills and a shared reason to build.</p><span className="coming-note">TEAM MATCHING · PLANNED</span></div>
          <div className="feature-card feature-mint"><span className="feature-icon"><Zap size={21} /></span><span className="feature-index">03 / BUILD</span><h3>Make it happen.</h3><p>Keep projects, milestones and submissions moving in one place.</p><span className="coming-note">TEAM WORKSPACE · PLANNED</span></div>
        </div>
      </section>

      <section className="section section-featured">
        <div className="container section-heading">
          <div><p className="section-kicker">A FIRST LOOK</p><h2>Explore the possibilities.</h2><p>These clearly labelled sample records demonstrate the discovery experience.</p></div>
          <Link to="/explore" className="button button-outline">Explore all <ArrowRight size={16} /></Link>
        </div>
        <div className="container event-grid">
          {demoEvents.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)}
        </div>
        <div className="container demo-note"><ShieldCheck size={16} /><span>Sample content only — not live or verified hackathon listings.</span></div>
      </section>

      <section className="section journey-section">
        <div className="container journey-layout">
          <div><p className="section-kicker">FROM FIRST CLICK TO FINAL SUBMISSION</p><h2>One journey.<br /><span>Every next step.</span></h2><p className="journey-copy">The vision is bigger than a listing page. CODE NEXUS is designed to support the full build journey, one useful step at a time.</p><Link to="/how-it-works" className="button button-dark">See how it works <ArrowRight size={16} /></Link></div>
          <div className="journey-list">
            {[
              ["01", "Discover", "Find opportunities that spark your interest."],
              ["02", "Understand", "Know the rules, dates and eligibility."],
              ["03", "Match", "Connect with people who bring different strengths."],
              ["04", "Build", "Plan, track and submit your work together."],
            ].map(([number, title, copy]) => <div className="journey-row" key={number}><span>{number}</span><div><b>{title}</b><small>{copy}</small></div><ArrowUpRight size={17} /></div>)}
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container cta-panel"><div className="cta-orb" /><div><p className="section-kicker">YOUR NEXT IDEA IS OUT THERE</p><h2>Ready to find your<br />next build?</h2><p>Start with the opportunity. The rest begins with a connection.</p></div><Link to="/explore" className="button button-light">Explore hackathons <ArrowRight size={16} /></Link></div>
      </section>
    </>
  );
}

function ExplorePage() {
  const params = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(params.get("q") || "");
  const [mode, setMode] = useState("All formats");
  const [skill, setSkill] = useState("All levels");
  const [feedUrl, setFeedUrl] = useState(() => window.localStorage.getItem("code-nexus-public-feed") || "");
  const [connectOpen, setConnectOpen] = useState(false);
  const [liveEvents, setLiveEvents] = useState<Hackathon[] | null>(null);
  const [feedStatus, setFeedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [feedUpdatedAt, setFeedUpdatedAt] = useState("");
  const [organizerSubmissionUrl, setOrganizerSubmissionUrl] = useState("");
  const [sourceHealth, setSourceHealth] = useState<Array<{ name: string; enabled: boolean; status: string; lastCheckedAt?: string }>>([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [feeFilter, setFeeFilter] = useState("Any cost");
  const [deadlineFilter, setDeadlineFilter] = useState("Any deadline");
  const [sortOrder, setSortOrder] = useState("Closing soon");

  useEffect(() => {
    const savedFeedUrl = window.localStorage.getItem("code-nexus-public-feed");
    if (!savedFeedUrl) return;
    let cancelled = false;
    setLoading(true);
    loadGoogleFeed(savedFeedUrl)
      .then((payload) => {
        if (cancelled) return;
        setLiveEvents(payload.events.map(mapPublishedEvent));
        setFeedUpdatedAt(payload.generatedAt || "");
        setOrganizerSubmissionUrl(payload.organizerSubmissionUrl || "");
        setSourceHealth(payload.sources || []);
        setFeedStatus(payload.events.length + " automatically discovered event(s) loaded.");
      })
      .catch((error) => {
        if (!cancelled) setFeedStatus(error instanceof Error ? error.message : "Automatic feed could not be loaded.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function connectFeed(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setFeedStatus("Connecting to the CODE NEXUS automatic discovery feed…");
    try {
      const payload = await loadGoogleFeed(feedUrl.trim());
      const mapped = payload.events.map(mapPublishedEvent);
      setLiveEvents(mapped);
      setFeedUpdatedAt(payload.generatedAt || "");
      setOrganizerSubmissionUrl(payload.organizerSubmissionUrl || "");
      setSourceHealth(payload.sources || []);
      window.localStorage.setItem("code-nexus-public-feed", feedUrl.trim());
      setFeedStatus(mapped.length + " automatically discovered event(s) loaded. Individual records retain their source and verification status.");
      setConnectOpen(false);
    } catch (error) {
      setFeedStatus(error instanceof Error ? error.message : "Could not connect to the Google feed.");
    } finally {
      setLoading(false);
    }
  }

  const allEvents = liveEvents ?? demoEvents;
  const filtered = useMemo(() => allEvents.filter((event) => {
    const haystack = [event.title, event.organizer, event.summary, event.location, event.entryFee, event.sourcePlatforms, ...(event.eligibility ? [event.eligibility] : []), ...event.skills].join(" ").toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase().trim());
    const matchesMode = mode === "All formats" || normalizeMode(event.mode) === mode;
    const matchesSkill = skill === "All levels" || event.level.toLowerCase() === skill.toLowerCase();
    const matchesLocation = !locationQuery.trim() || event.location.toLowerCase().includes(locationQuery.trim().toLowerCase());
    const fee = (event.entryFee || "").trim().toLowerCase();
    const isFree = fee === "free" || fee === "no fee" || fee === "0" || fee.startsWith("free ");
    const matchesFee = feeFilter === "Any cost" || (feeFilter === "Free" && isFree) || (feeFilter === "Paid" && !!fee && !isFree && fee !== "not specified");
    const deadline = event.registrationDeadline || event.eventStart;
    const deadlineTime = deadline ? new Date(/^\d{4}-\d{2}-\d{2}$/.test(deadline) ? deadline + "T23:59:59" : deadline).getTime() : NaN;
    const matchesDeadline = deadlineFilter === "Any deadline" || (Number.isFinite(deadlineTime) && deadlineTime >= Date.now() && deadlineTime <= Date.now() + 7 * 86400000);
    return matchesQuery && matchesMode && matchesSkill && matchesLocation && matchesFee && matchesDeadline;
  }).sort((left, right) => {
    if (sortOrder === "A–Z") return left.title.localeCompare(right.title);
    const leftDate = Date.parse(left.registrationDeadline || left.eventStart || "") || Number.MAX_SAFE_INTEGER;
    const rightDate = Date.parse(right.registrationDeadline || right.eventStart || "") || Number.MAX_SAFE_INTEGER;
    return leftDate - rightDate;
  }), [allEvents, query, mode, skill, locationQuery, feeFilter, deadlineFilter, sortOrder]);

  return (
    <main className="page-main">
      <section className="explore-hero"><div className="container"><p className="section-kicker">THE OPPORTUNITY BOARD</p><h1>Find your next <em>challenge.</em></h1><p>Search opportunities by what you want to learn, build and explore.</p><div className="explore-search"><Search size={19} /><input aria-label="Search events" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hackathons, skills, themes…" /><button className="button button-dark" type="button" onClick={() => setShowFilters(!showFilters)}><Filter size={15} /> Filters <ChevronDown size={14} /></button></div></div></section>
      <section className="section explore-content container">
        <div className="explore-toolbar">
          <div><span className="result-count">{filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"}</span><span className="result-context">{liveEvents === null ? "Illustrative demo records" : "Auto-refreshed snapshot" + (feedUpdatedAt ? " · " + new Date(feedUpdatedAt).toLocaleString() : "")}</span></div>
          <button className="button button-outline button-small" type="button" onClick={() => setConnectOpen(!connectOpen)}><Globe2 size={15} /> {liveEvents === null ? "Connect discovery feed" : "Discovery feed connected"}</button>
        </div>
        {connectOpen && <form className="connect-panel" onSubmit={connectFeed}><div><b>Connect automatic discovery</b><p>Paste your deployed Google Apps Script web app URL once. The feed refreshes automatically each day after setup.</p></div><label className="sr-only" htmlFor="feed-url">Google Apps Script web app URL</label><input id="feed-url" type="url" value={feedUrl} onChange={(event) => setFeedUrl(event.target.value)} placeholder="https://script.google.com/macros/s/…/exec" required /><button className="button button-primary" disabled={loading}>{loading ? "Connecting…" : "Connect feed"}</button></form>}
        {feedStatus && <div className="feed-status" role="status">{feedStatus}</div>}
        {liveEvents !== null && <div className="source-health">
          <div className="source-health-heading"><b>Discovery sources</b><span>Last successful source checks</span></div>
          <div className="source-health-list">{sourceHealth.filter((source) => source.enabled).map((source) => <span key={source.name} className="source-health-item"><i className={source.status.startsWith("OK") ? "source-health-dot good" : "source-health-dot"} />{source.name}<small>{source.lastCheckedAt ? new Date(source.lastCheckedAt).toLocaleDateString() : "Awaiting first check"}</small></span>)}</div>
          {organizerSubmissionUrl && <a className="source-submit-link" href={organizerSubmissionUrl} target="_blank" rel="noreferrer">Submit an event for review <ExternalLink size={13} /></a>}
        </div>}
        <div className="filter-row" data-open={showFilters}>
          <label><span>Format</span><select value={mode} onChange={(event) => setMode(event.target.value)}><option>All formats</option><option>Online</option><option>Hybrid</option><option>In person</option></select></label>
          <label><span>Experience</span><select value={skill} onChange={(event) => setSkill(event.target.value)}><option>All levels</option><option>Beginner friendly</option><option>Intermediate</option><option>Advanced</option></select></label>
          <label><span>Location</span><input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} placeholder="Country or city" /></label>
          <label><span>Entry fee</span><select value={feeFilter} onChange={(event) => setFeeFilter(event.target.value)}><option>Any cost</option><option>Free</option><option>Paid</option></select></label>
          <label><span>Deadline</span><select value={deadlineFilter} onChange={(event) => setDeadlineFilter(event.target.value)}><option>Any deadline</option><option>Closing in 7 days</option></select></label>
          <label><span>Sort by</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option>Closing soon</option><option>A–Z</option></select></label>
          <button type="button" className="clear-filters" onClick={() => { setQuery(""); setMode("All formats"); setSkill("All levels"); setLocationQuery(""); setFeeFilter("Any cost"); setDeadlineFilter("Any deadline"); setSortOrder("Closing soon"); }}>Clear filters</button>
        </div>
        {liveEvents === null && <div className="demo-banner"><ShieldCheck size={17} /><span>Demo mode: sample records only. Connect the automatic source feed to load current discovered listings.</span></div>}
        {filtered.length > 0 ? <div className="event-grid">{filtered.map((event) => <EventCard key={event.id} event={event} live={liveEvents !== null} />)}</div> : <div className="empty-state"><span><Search size={24} /></span><h3>No opportunities match those filters.</h3><p>Try a broader search or clear the selected filters.</p><button className="button button-outline" type="button" onClick={() => { setQuery(""); setMode("All formats"); setSkill("All levels"); setLocationQuery(""); setFeeFilter("Any cost"); setDeadlineFilter("Any deadline"); setSortOrder("Closing soon"); }}>Clear all filters</button></div>}
      </section>
    </main>
  );
}

function EventDetailPage() {
  const { slug } = useParams();
  const event = demoEvents.find((item) => item.slug === slug);
  if (!event) return <InfoPage title="Event details" kicker="NOT FOUND" description="This sample event is not available. Return to Explore to browse the current demo records." />;
  const details = [
    ["Registration deadline", event.registrationDeadline ? formatDate(event.registrationDeadline, event.timezone) : "Not specified"],
    ["Submission deadline", event.submissionDeadline ? formatDate(event.submissionDeadline, event.timezone) : "Not specified"],
    ["Event start", event.eventStart ? formatDate(event.eventStart, event.timezone) : "Not specified"],
    ["Event end", event.eventEnd ? formatDate(event.eventEnd, event.timezone) : "Not specified"],
  ];
  return <main className="page-main"><section className="detail-hero"><div className="container"><Link to="/explore" className="back-link">← Back to Explore</Link><span className="status-pill status-demo"><i className="status-dot" /> Illustrative demo — not verified</span><p className="event-organizer">{event.organizer}</p><h1>{event.title}</h1><p className="detail-lede">{event.summary}</p><div className="detail-tags">{event.skills.map((tag) => <span className="skill-tag" key={tag}>{tag}</span>)}</div></div></section><section className="container detail-layout"><div className="detail-main"><h2>About this opportunity</h2><p>{event.summary} This record is included only to demonstrate how a verified event will be presented. Replace it with organizer-sourced information before publishing real listings.</p><h2>Important dates</h2><div className="date-grid">{details.map(([label, value]) => <div className="date-tile" key={label}><span>{label}</span><b>{value}</b></div>)}</div><p className="timezone-note">Event timezone: {event.timezone || "Not specified"} · Times are not inferred when source data is missing.</p></div><aside className="detail-side"><div className="detail-facts"><span className="section-kicker">AT A GLANCE</span><div><span>Format</span><b>{event.mode}</b></div><div><span>Location</span><b>{event.location}</b></div><div><span>Team size</span><b>{event.teamSize || "Not specified"}</b></div><div><span>Prize</span><b>{event.prize || "Not specified"}</b></div><div><span>Eligibility</span><b>Not specified</b></div><button className="button button-dark button-full" disabled>Registration link unavailable in demo</button><small>Real listings will link directly to the official organizer page.</small></div></aside></section></main>;
}

function InfoPage({ title, kicker = "CODE NEXUS", description }: { title: string; kicker?: string; description: string }) {
  return <main className="page-main"><section className="info-hero container"><p className="section-kicker">{kicker}</p><h1>{title}</h1><p>{description}</p><Link to="/explore" className="button button-dark">Explore opportunities <ArrowRight size={16} /></Link></section></main>;
}

function NotFoundPage() {
  return <InfoPage kicker="404 / PAGE NOT FOUND" title="This page went off the grid." description="The page may have moved, or the link may be incorrect. Let's get you back to the opportunities." />;
}

function AppRoutes() {
  return <><Header /><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/hackathons/:slug" element={<EventDetailPage />} />
    <Route path="/how-it-works" element={<InfoPage kicker="THE JOURNEY" title="From discovery to demo day." description="Discover an opportunity, understand its rules and deadlines, connect with teammates, then organize the work through submission. Matching and workspace tools are planned for later phases." />} />
    <Route path="/about" element={<InfoPage title="A better starting point for builders." description="CODE NEXUS is being built to make hackathon discovery clearer and collaboration easier for students and builders around the world." />} />
    <Route path="/contact" element={<InfoPage title="We are building in the open." description="Contact and feedback workflows are planned. For now, explore the prototype and share feedback with the project team." />} />
    <Route path="/privacy" element={<InfoPage title="Privacy" kicker="POLICY DRAFT" description="This prototype does not have member accounts or collect profile information. A complete privacy notice will be published before any personal-data features are enabled." />} />
    <Route path="/terms" element={<InfoPage title="Terms of use" kicker="POLICY DRAFT" description="These terms are a placeholder for the prototype. Production terms will be reviewed and published before public launch." />} />
    <Route path="/accessibility" element={<InfoPage title="Accessibility matters." description="The prototype is being built with responsive layouts, keyboard navigation and readable contrast in mind. Accessibility testing is still required before launch." />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes><Footer /></>;
}

export default function App() {
  return <BrowserRouter><div className="app-shell"><AppRoutes /></div></BrowserRouter>;
}
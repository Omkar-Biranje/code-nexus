const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const sourcePath = path.join(__dirname, "..", "Code.gs");
const source = fs.readFileSync(sourcePath, "utf8");

const sandbox = {
  Utilities: {
    formatDate(date, timezone) {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone || "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(date);
      const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
      return values.year + "-" + values.month + "-" + values.day;
    },
  },
  Session: { getScriptTimeZone: () => "UTC" },
};

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: "Code.gs" });

test("only the two exact, approved feed endpoints are fetchable", () => {
  assert.equal(sandbox.isAllowedSourceEndpoint_("https://hackalendar.com/api/events", "HACKALENDAR_JSON"), true);
  assert.equal(sandbox.isAllowedSourceEndpoint_("https://brabble.ai/rss/hackathons.xml", "RSS"), true);
  assert.equal(sandbox.isAllowedSourceEndpoint_("https://hackalendar.com/private", "HACKALENDAR_JSON"), false);
  assert.equal(sandbox.isAllowedSourceEndpoint_("https://sub.brabble.ai/rss/hackathons.xml", "RSS"), false);
  assert.equal(sandbox.isAllowedSourceEndpoint_("http://brabble.ai/rss/hackathons.xml", "RSS"), false);
});

test("canonical URL strips tracking parameters but preserves event identifiers", () => {
  const value = "https://Example.com/events/ai/?utm_source=news&id=42&ref=feed#dates";
  assert.equal(sandbox.canonicalUrl_(value), "https://example.com/events/ai?id=42");
});

test("URL canonicalization returns an empty value for non-HTTPS and unsafe URLs", () => {
  assert.equal(sandbox.canonicalUrl_("http://example.com/event"), "");
  assert.equal(sandbox.canonicalUrl_("https://localhost/event"), "");
  assert.equal(sandbox.canonicalUrl_("https://127.0.0.1/event"), "");
});

test("event identity prefers canonical organizer URL", () => {
  const event = {
    title: "AI Build",
    organizer: "Example Org",
    officialUrl: "https://example.com/event?utm_campaign=mail&id=8",
  };
  assert.equal(sandbox.eventKey_(event), "url:https://example.com/event?id=8");
});

test("normalization preserves unknown facts instead of guessing", () => {
  const event = sandbox.normalizeJsonEvent_({
    title: "Open Innovation Sprint",
    officialUrl: "https://organizer.example/events/sprint",
    skills: ["AI", "Web"],
  }, "TestSource", "https://hackalendar.com/api/events");

  assert.equal(event.title, "Open Innovation Sprint");
  assert.equal(event.organizer, "");
  assert.equal(event.registrationDeadline, "");
  assert.equal(event.eventStart, "");
  assert.equal(event.country, "");
  assert.equal(event.officialUrl, "https://organizer.example/events/sprint");
  assert.equal(event.skills, "AI, Web");
});

test("date-only registration deadlines remain open for that local calendar day", () => {
  const now = new Date("2026-11-17T19:00:00Z");
  assert.equal(sandbox.isEventExpired_("2026-11-17", "", now, "UTC"), false);
  assert.equal(sandbox.isEventExpired_("2026-11-16", "", now, "UTC"), true);
});

test("event start is the fallback expiry boundary when registration deadline is absent", () => {
  const now = new Date("2026-11-17T12:00:00Z");
  assert.equal(sandbox.isEventExpired_("", "2026-11-16", now, "UTC"), true);
  assert.equal(sandbox.isEventExpired_("", "2026-11-18", now, "UTC"), false);
  assert.equal(sandbox.isEventExpired_("", "", now, "UTC"), false);
});

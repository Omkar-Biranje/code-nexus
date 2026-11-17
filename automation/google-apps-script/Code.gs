/**
 * CODE NEXUS — Automatic hackathon discovery.
 *
 * Feed discovery runs automatically after one-time owner setup. No per-event
 * manual entry is needed for feed-sourced records. Public organizer submissions
 * enter a separate review queue and are never auto-published as verified.
 * Sources are fetched daily, normalized, deduplicated and cross-matched.
 * Public records retain source attribution and honest verification labels.
 *
 * Sources enabled by default:
 *  - Hackalendar structured JSON API (no key; attribution appreciated).
 *  - Brabble hackathons RSS (daily refresh; preserve attribution; do not claim
 *    its data as our own or strip links back to the source / organizer).
 *
 * Direct crawling of Devpost is deliberately disabled because its Terms of
 * Service prohibit automated scraping/crawling. Hack2Skill and Reskilll remain
 * disabled until an official feed/API or written permission is available.
 * Unstop is consumed through the permitted, source-attributed Brabble index
 * rather than an undocumented direct endpoint.
 */

const CN = {
  SHEETS: {
    SOURCES: "Sources",
    SOURCE_RECORDS: "SourceRecords",
    AUTO_EVENTS: "AutoEvents",
    EVENT_HISTORY: "EventHistory",
    INTAKE_QUEUE: "OrganizerIntake",
    RUN_LOG: "RunLog",
  },
  HEADERS: {
    Sources: [
      "Enabled", "Source name", "Source type", "Feed/API URL", "Attribution / usage note",
      "Refresh hours", "Last checked at", "Last result",
    ],
    SourceRecords: [
      "Source name", "Event key", "Event JSON", "Source URL", "Last fetched at",
    ],
    AutoEvents: [
      "Event key", "Public status", "Title", "Organizer", "Summary", "Mode",
      "Country", "City", "Registration deadline", "Submission deadline",
      "Event start", "Event end", "Event timezone", "Skills", "Team size",
      "Entry fee", "Currency", "Prize amount", "Prize currency", "Official URL",
      "Source URL", "Source names", "Source count", "Conflicting fields", "Attribution",
      "Discovery / verification status", "Discovered at", "Last checked at",
      "Source platforms", "Eligibility", "Cancelled",
    ],
    EventHistory: [
      "Timestamp", "Change type", "Event key", "Event title", "Field",
      "Previous value", "New value", "Source platforms",
    ],
    OrganizerIntake: [
      "Received at", "Official event URL", "Organizer / host",
      "Additional context", "Review status", "Reviewer note",
    ],
    RunLog: [
      "Timestamp", "Action", "Source name", "Result", "Records fetched",
      "Records written", "Details",
    ],
  },
  DEFAULT_SOURCES: [
    [
      true,
      "Hackalendar",
      "HACKALENDAR_JSON",
      "https://hackalendar.com/api/events",
      "Public structured API. Link to the original organiser registration page; attribution to Hackalendar is appreciated.",
      24,
      "",
      "Pending first successful fetch",
    ],
    [
      true,
      "Brabble",
      "RSS",
      "https://brabble.ai/rss/hackathons.xml",
      "Source: Brabble. Refresh daily, preserve attribution and original source links; do not present its complete index as our own.",
      24,
      "",
      "Pending first successful fetch",
    ],
    [
      false,
      "Hack2Skill",
      "DIRECT_DISABLED",
      "https://hack2skill.com/",
      "Not automatically fetched: no documented public feed/API or general automated-access permission was verified. Enable only after permission or a documented feed is available.",
      24,
      "",
      "Disabled — permission/feed required",
    ],
    [
      false,
      "Devpost",
      "DIRECT_DISABLED",
      "https://devpost.com/hackathons",
      "Direct crawling disabled because Devpost Terms of Service prohibit automated scraping/crawling. Some event coverage may arrive through Brabble's source-attributed feed.",
      24,
      "",
      "Disabled — direct crawler prohibited by published terms",
    ],
    [
      false,
      "Unstop",
      "DIRECT_DISABLED",
      "https://unstop.com/hackathons",
      "Not directly fetched. Some listings may arrive through Brabble's source-attributed feed. Direct endpoint use requires a documented permission basis.",
      24,
      "",
      "Disabled — use permitted aggregator feed",
    ],
    [
      false,
      "Reskilll",
      "DIRECT_DISABLED",
      "https://reskilll.com/",
      "Not automatically fetched until an official public feed/API or automated-access permission is established.",
      24,
      "",
      "Disabled — permission/feed required",
    ],
  ],
  MAX_HACKALENDAR_PAGES: 5,
  PAGE_SIZE: 200,
  MAX_FEED_BYTES: 2 * 1024 * 1024,
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("CODE NEXUS")
    .addItem("Set up automatic discovery", "setupCodeNexus")
    .addItem("Run discovery now", "runDailyDiscovery")
    .addItem("Install / repair daily refresh", "installDailyRefresh")
    .addToUi();
}

/**
 * One-time setup. Creates the workbook, seeds permitted sources, installs a
 * daily trigger and runs the first import. The user does not have to approve
 * individual events or manually maintain event rows.
 */
function setupCodeNexus() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Open this script from the CODE NEXUS Google Sheet.");

  PropertiesService.getScriptProperties().setProperty("CN_SPREADSHEET_ID", ss.getId());
  ensureSheets_(ss);
  seedDefaultSources_(ss.getSheetByName(CN.SHEETS.SOURCES));
  const organizerFormUrl = ensureOrganizerIntakeForm_(ss);
  installDailyRefresh();
  const summary = runDailyDiscovery();

  SpreadsheetApp.getUi().alert(
    "CODE NEXUS automatic discovery is configured.\n\n" +
    "Sources successful: " + summary.sourcesSucceeded + "\n" +
    "Events in index: " + summary.eventsPublished + "\n" +
    "Cross-source matches: " + summary.crossSourceMatches + "\n\n" +
    "Daily refresh is installed. New feed events will be discovered automatically.\n\n" +
    "Optional organizer submission form:\n" + organizerFormUrl +
    "\n\nSubmissions enter a review queue; they are not auto-published."
  );
}


/**
 * Create one optional organizer intake form. This is a proposal channel, not
 * event registration; every submission waits in OrganizerIntake for review.
 */
function ensureOrganizerIntakeForm_(ss) {
  const properties = PropertiesService.getScriptProperties();
  let form = null;
  const existingId = properties.getProperty("CN_ORGANIZER_FORM_ID");

  if (existingId) {
    try {
      form = FormApp.openById(existingId);
    } catch (error) {
      properties.deleteProperty("CN_ORGANIZER_FORM_ID");
    }
  }

  if (!form) {
    form = FormApp.create("CODE NEXUS — Submit a hackathon", true);
    properties.setProperty("CN_ORGANIZER_FORM_ID", form.getId());
    form.setDescription(
      "Suggest a public hackathon or builder opportunity for CODE NEXUS. " +
      "This is not event registration. We link participants to the original organiser page. " +
      "Submissions are checked before they can appear in discovery."
    );
    form.setConfirmationMessage(
      "Thank you. Your event suggestion has been received for review. " +
      "Please continue to use the organiser's official page for registrations."
    );
    form.addTextItem()
      .setTitle("Official event or registration page URL")
      .setHelpText("Use the organiser's original HTTPS event page, not a shortened link.")
      .setRequired(true)
      .setValidation(FormApp.createTextValidation().requireTextIsUrl().build());
    form.addTextItem()
      .setTitle("Organizer / host")
      .setHelpText("Company, university, community or individual running the event.")
      .setRequired(false);
    form.addParagraphTextItem()
      .setTitle("Additional context")
      .setHelpText("Optional: event dates, eligibility, or a note about the opportunity.")
      .setRequired(false);
  }

  // Form-submit trigger writes directly into OrganizerIntake. Do not attach
  // the form to the workbook as a response destination, which would create an
  // extra unneeded response tab.
  form.setAcceptingResponses(true);

  const hasTrigger = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === "onOrganizerIntakeSubmit";
  });
  if (!hasTrigger) {
    ScriptApp.newTrigger("onOrganizerIntakeSubmit").forForm(form).onFormSubmit().create();
  }

  const publishedUrl = form.getPublishedUrl();
  properties.setProperty("CN_ORGANIZER_FORM_URL", publishedUrl);
  return publishedUrl;
}

/** Queue organizer-submitted URLs for review; never fetch or publish them here. */
function onOrganizerIntakeSubmit(event) {
  if (!event || !event.response) return;
  const answers = {};
  event.response.getItemResponses().forEach(function (itemResponse) {
    answers[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
  });

  const eventUrl = String(answers["Official event or registration page URL"] || "").trim();
  const organizer = cleanText_(answers["Organizer / host"], 180);
  const context = cleanText_(answers["Additional context"], 1000);
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(CN.SHEETS.INTAKE_QUEUE);
  const acceptedUrl = validHttpsUrl_(eventUrl) ? eventUrl : "";
  sheet.appendRow([
    event.response.getTimestamp(),
    acceptedUrl,
    organizer,
    context,
    acceptedUrl ? "REVIEW_REQUIRED" : "REJECTED_INVALID_URL",
    acceptedUrl ? "" : "A public HTTPS URL is required.",
  ]);
  logRun_(
    "ORGANIZER_SUBMISSION",
    organizer || "Unknown organizer",
    acceptedUrl ? "REVIEW_REQUIRED" : "REJECTED",
    1,
    0,
    acceptedUrl ? "A suggested official URL was added to OrganizerIntake; it was not auto-published." : "Invalid URL submitted."
  );
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("CN_SPREADSHEET_ID");
  if (!id) {
    throw new Error("Run setupCodeNexus once from the bound Google Sheet before using the feed.");
  }
  return SpreadsheetApp.openById(id);
}

function ensureSheets_(ss) {
  Object.keys(CN.HEADERS).forEach(function (name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    const headers = CN.HEADERS[name];

    if (sheet.getMaxColumns() < headers.length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
    }

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      const existingLength = Math.max(sheet.getLastColumn(), 1);
      const existing = sheet.getRange(1, 1, 1, existingLength).getDisplayValues()[0];
      const sharedLength = Math.min(existing.length, headers.length);
      const matchesExisting = headers.slice(0, sharedLength).every(function (header, index) {
        return existing[index] === header;
      });
      if (!matchesExisting || existing.length > headers.length) {
        throw new Error(
          "Header mismatch in " + name + ". Existing columns were not overwritten; use a fresh CODE NEXUS workbook or migrate this sheet manually."
        );
      }
      if (existing.length < headers.length) {
        sheet.getRange(1, existing.length + 1, 1, headers.length - existing.length)
          .setValues([headers.slice(existing.length)]);
      }
    }

    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#1d3151")
      .setFontColor("#ffffff")
      .setWrap(true);
  });
}

function seedDefaultSources_(sheet) {
  if (sheet.getLastRow() > 1) return;
  sheet.getRange(2, 1, CN.DEFAULT_SOURCES.length, CN.HEADERS.Sources.length)
    .setValues(CN.DEFAULT_SOURCES);
  sheet.autoResizeColumns(1, CN.HEADERS.Sources.length);
}

function installDailyRefresh() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (trigger) {
    if (trigger.getHandlerFunction() === "runDailyDiscovery") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger("runDailyDiscovery")
    .timeBased()
    .everyDays(1)
    .atHour(4)
    .inTimezone("Asia/Kolkata")
    .create();

  logRun_("TRIGGER_INSTALL", "", "OK", 0, 0, "Daily automatic refresh at approximately 04:00 Asia/Kolkata.");
  return true;
}

function runDailyDiscovery() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    return {
      ok: false,
      message: "Another discovery run is active.",
      sourcesSucceeded: 0,
      eventsPublished: 0,
      crossSourceMatches: 0,
    };
  }

  try {
    const ss = getSpreadsheet_();
    ensureSheets_(ss);

    const sourceSheet = ss.getSheetByName(CN.SHEETS.SOURCES);
    const recordsSheet = ss.getSheetByName(CN.SHEETS.SOURCE_RECORDS);
    const sourceRows = sourceSheet.getDataRange().getValues();

    let sourcesSucceeded = 0;
    let sourcesFailed = 0;
    let totalFetched = 0;

    for (let rowIndex = 1; rowIndex < sourceRows.length; rowIndex++) {
      const row = sourceRows[rowIndex];
      const enabled = row[0] === true || String(row[0]).toUpperCase() === "TRUE";
      const sourceName = cleanText_(row[1], 100);
      const sourceType = String(row[2] || "").trim().toUpperCase();
      const endpoint = String(row[3] || "").trim();

      if (!enabled || !endpoint) continue;
      if (sourceType !== "RSS" && sourceType !== "HACKALENDAR_JSON") continue;

      const checkedAt = new Date();
      try {
        const items = fetchSource_(sourceName, sourceType, endpoint);
        replaceSourceRecords_(recordsSheet, sourceName, items, checkedAt);
        updateSourceStatus_(sourceSheet, rowIndex + 1, checkedAt, "OK — " + items.length + " records fetched");
        logRun_("SOURCE_FETCH", sourceName, "OK", items.length, items.length, "Source records refreshed; daily cache policy respected.");
        sourcesSucceeded++;
        totalFetched += items.length;
      } catch (error) {
        const message = cleanText_(error && error.message ? error.message : String(error), 400);
        updateSourceStatus_(sourceSheet, rowIndex + 1, checkedAt, "ERROR — " + message);
        logRun_("SOURCE_FETCH", sourceName, "ERROR", 0, 0, message);
        sourcesFailed++;
        // Existing records for a failed source are retained; a temporary outage
        // must not erase its previously discovered events.
      }
    }

    const merged = rebuildAutoEvents_(recordsSheet, ss.getSheetByName(CN.SHEETS.AUTO_EVENTS), new Date());
    const crossSourceMatches = merged.filter(function (event) {
      return event.sourceCount > 1;
    }).length;

    logRun_(
      "DISCOVERY_COMPLETE",
      "",
      sourcesFailed ? "PARTIAL" : "OK",
      totalFetched,
      merged.length,
      sourcesSucceeded + " source(s) succeeded; " + sourcesFailed + " failed; " +
        crossSourceMatches + " cross-source matches."
    );

    return {
      ok: sourcesSucceeded > 0,
      sourcesSucceeded: sourcesSucceeded,
      sourcesFailed: sourcesFailed,
      recordsFetched: totalFetched,
      eventsPublished: merged.length,
      crossSourceMatches: crossSourceMatches,
    };
  } finally {
    lock.releaseLock();
  }
}

function fetchSource_(sourceName, sourceType, endpoint) {
  if (!isSafeHttpsUrl_(endpoint) || !isAllowedSourceEndpoint_(endpoint, sourceType)) {
    throw new Error("Source endpoint is not on the approved HTTPS source allowlist.");
  }

  if (sourceType === "HACKALENDAR_JSON") {
    return fetchHackalendar_(sourceName, endpoint);
  }

  if (sourceType === "RSS") {
    return fetchRss_(sourceName, endpoint);
  }

  throw new Error("Unsupported source type: " + sourceType);
}

function fetchHackalendar_(sourceName, endpoint) {
  const output = [];
  let offset = 0;

  // Current public API supports up to 200 rows per page and returns
  // meta.hasMore + meta.nextOffset. Cap the import at five pages per run.
  for (let page = 0; page < CN.MAX_HACKALENDAR_PAGES; page++) {
    const url = endpoint +
      (endpoint.indexOf("?") >= 0 ? "&" : "?") +
      "limit=" + CN.PAGE_SIZE +
      "&offset=" + offset;

    const response = UrlFetchApp.fetch(url, {
      method: "get",
      muteHttpExceptions: true,
      followRedirects: false,
      headers: { Accept: "application/json" },
    });

    const code = response.getResponseCode();
    if (code >= 300 && code < 400) {
      throw new Error("Hackalendar redirected; the crawler blocks redirects. Update the source to its final approved URL.");
    }
    if (code < 200 || code >= 300) {
      throw new Error("Hackalendar returned HTTP " + code + ".");
    }

    const responseText = response.getContentText();
    if (!responseText || responseText.length > 5 * 1024 * 1024) {
      throw new Error("Hackalendar response was empty or larger than 5 MB.");
    }

    const payload = JSON.parse(responseText);
    const rows = Array.isArray(payload.data) ? payload.data :
      (Array.isArray(payload.events) ? payload.events :
        (Array.isArray(payload.results) ? payload.results : []));

    rows.forEach(function (item) {
      const normalized = normalizeJsonEvent_(item, sourceName, endpoint);
      if (normalized && normalized.title) output.push(normalized);
    });

    const meta = payload.meta || {};
    const nextOffset = Number(meta.nextOffset);
    if (
      meta.hasMore !== true ||
      !rows.length ||
      !Number.isFinite(nextOffset) ||
      nextOffset <= offset
    ) {
      break;
    }
    offset = nextOffset;
  }

  return dedupeWithinSource_(output);
}

function fetchRss_(sourceName, endpoint) {
  const response = UrlFetchApp.fetch(endpoint, {
    method: "get",
    muteHttpExceptions: true,
    followRedirects: false,
    headers: {
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
    },
  });

  const code = response.getResponseCode();
  if (code >= 300 && code < 400) {
    throw new Error("RSS source redirected; the crawler blocks redirects. Update the source to its final approved URL.");
  }
  if (code < 200 || code >= 300) {
    throw new Error("RSS source returned HTTP " + code + ".");
  }

  const xmlText = response.getContentText();
  if (!xmlText || xmlText.length > CN.MAX_FEED_BYTES) {
    throw new Error("RSS response was empty or exceeds the 2 MB feed limit.");
  }

  const document = XmlService.parse(xmlText);
  const root = document.getRootElement();
  const rootName = root.getName().toLowerCase();
  let nodes = [];

  if (rootName === "rss") {
    const channel = directChild_(root, "channel") || root;
    nodes = channel.getChildren().filter(function (node) {
      return node.getName().toLowerCase() === "item";
    });
  } else if (rootName === "feed") {
    nodes = root.getChildren().filter(function (node) {
      return node.getName().toLowerCase() === "entry";
    });
  } else {
    nodes = root.getChildren().filter(function (node) {
      const name = node.getName().toLowerCase();
      return name === "item" || name === "entry";
    });
  }

  const output = [];
  nodes.forEach(function (node) {
    const link = getRssLink_(node);
    const title = getChildText_(node, ["title"]);
    if (!title) return;

    const description = getChildText_(node, [
      "description", "summary", "content", "encoded",
    ]);
    const officialUrl = extractOfficialUrl_(node, description, sourceName);
    const raw = {
      title: title,
      organizer: getChildText_(node, ["organizer", "organiser", "creator", "author"]),
      summary: description,
      platform: getChildText_(node, ["platform", "source_platform"]),
      eligibility: getChildText_(node, ["eligibility", "audience"]),
      cancelled: getChildText_(node, ["cancelled", "canceled"]),
      mode: getChildText_(node, ["mode", "event_mode"]),
      country: getChildText_(node, ["country"]),
      city: getChildText_(node, ["city", "location"]),
      registrationDeadline: getChildText_(node, ["registrationDeadline", "registration_deadline"]),
      submissionDeadline: getChildText_(node, ["submissionDeadline", "submission_deadline"]),
      eventStart: getChildText_(node, ["startAt", "start_at", "startDate", "start_date"]),
      eventEnd: getChildText_(node, ["endAt", "end_at", "endDate", "end_date"]),
      timezone: getChildText_(node, ["timezone", "eventTimezone"]),
      skills: getChildText_(node, ["skills", "themes", "tags"]),
      teamSize: getChildText_(node, ["teamSize", "team_size"]),
      fee: getChildText_(node, ["entryFee", "fee"]),
      currency: getChildText_(node, ["currency"]),
      prizeAmount: getChildText_(node, ["prizeAmount", "prize_amount"]),
      prizeCurrency: getChildText_(node, ["prizeCurrency", "prize_currency"]),
      officialUrl: officialUrl,
      sourceUrl: link || endpoint,
    };

    const normalized = normalizeJsonEvent_(raw, sourceName, endpoint);
    if (normalized) output.push(normalized);
  });

  return dedupeWithinSource_(output);
}

function normalizeJsonEvent_(item, sourceName, sourceEndpoint) {
  if (!item || typeof item !== "object") return null;

  const title = cleanText_(firstValue_(item, [
    "title", "name", "eventName", "event_name",
  ]), 300);
  if (!title) return null;

  const sourceUrlCandidate = firstValue_(item, [
    "sourceUrl", "source_url", "canonicalUrl", "canonical_url",
    "link", "shareUrl", "share_url",
  ]);
  const urlCandidate = firstValue_(item, [
    "officialUrl", "official_url", "registrationUrl", "registration_url",
    "eventUrl", "event_url", "url", "website", "permalink",
  ]);

  let sourceUrl = validHttpsUrl_(sourceUrlCandidate) ? sourceUrlCandidate : "";
  let officialUrl = validHttpsUrl_(urlCandidate) ? urlCandidate : "";

  if (!sourceUrl && officialUrl) sourceUrl = officialUrl;
  if (!sourceUrl) sourceUrl = sourceEndpoint;

  // Brabble RSS links lead to its own event summary page; keep that link as
  // sourceUrl and never pretend that it is the organiser's registration URL.
  if (sourceName.toLowerCase() === "brabble" && isBrabbleUrl_(officialUrl)) {
    officialUrl = "";
  }

  const skillsValue = firstValue_(item, ["skills", "themes", "tracks", "tags"]);
  const skills = Array.isArray(skillsValue) ?
    skillsValue.map(function (value) { return cleanText_(value, 80); }).filter(Boolean).join(", ") :
    cleanText_(skillsValue, 300);

  return {
    title: title,
    organizer: cleanText_(firstValue_(item, ["organizer", "organiser", "host", "organization"]), 180),
    summary: cleanText_(firstValue_(item, ["summary", "description", "excerpt"]), 1200),
    platform: cleanText_(firstValue_(item, ["platform", "sourcePlatform", "source_platform"]), 100),
    eligibility: cleanText_(firstValue_(item, ["eligibility", "audience"]), 500),
    cancelled: String(firstValue_(item, ["cancelled", "canceled"]) || "").toLowerCase() === "true",
    mode: cleanText_(firstValue_(item, ["mode", "format", "eventMode"]), 60),
    country: cleanText_(firstValue_(item, ["country", "countryCode"]), 80),
    city: cleanText_(firstValue_(item, ["city", "location"]), 100),
    registrationDeadline: cleanText_(firstValue_(item, ["registrationDeadline", "registration_deadline", "registrationClosesAt"]), 100),
    submissionDeadline: cleanText_(firstValue_(item, ["submissionDeadline", "submission_deadline"]), 100),
    eventStart: cleanText_(firstValue_(item, ["startAt", "startsAt", "start_at", "eventStart", "event_start", "startDate"]), 100),
    eventEnd: cleanText_(firstValue_(item, ["endAt", "endsAt", "end_at", "eventEnd", "event_end", "endDate"]), 100),
    timezone: cleanText_(firstValue_(item, ["timezone", "eventTimezone", "event_timezone"]), 80),
    skills: skills,
    teamSize: cleanText_(firstValue_(item, ["teamSize", "team_size", "team"]), 80),
    fee: cleanText_(firstValue_(item, ["entryFee", "entry_fee", "fee"]), 80),
    currency: cleanText_(firstValue_(item, ["currency", "feeCurrency"]), 10),
    prizeAmount: cleanText_(firstValue_(item, ["prizeAmount", "prize_amount"]), 80),
    prizeCurrency: cleanText_(firstValue_(item, ["prizeCurrency", "prize_currency"]), 10),
    officialUrl: officialUrl,
    sourceUrl: sourceUrl,
    sourceName: sourceName,
    sourceEndpoint: sourceEndpoint,
    fetchedAt: new Date().toISOString(),
  };
}

function firstValue_(object, keys) {
  if (!object) return "";
  for (let i = 0; i < keys.length; i++) {
    const value = object[keys[i]];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
}

function directChild_(node, targetName) {
  const children = node.getChildren();
  for (let i = 0; i < children.length; i++) {
    if (children[i].getName().toLowerCase() === targetName.toLowerCase()) return children[i];
  }
  return null;
}

function getChildText_(node, names) {
  const wanted = names.map(function (name) { return String(name).toLowerCase(); });
  const children = node.getChildren();
  for (let i = 0; i < children.length; i++) {
    if (wanted.indexOf(children[i].getName().toLowerCase()) !== -1) {
      return children[i].getText();
    }
  }
  return "";
}

function getRssLink_(node) {
  const link = directChild_(node, "link");
  if (link) {
    const href = link.getAttribute("href");
    const value = href ? href.getValue() : link.getText();
    if (validHttpsUrl_(value)) return value;
  }
  const guid = getChildText_(node, ["guid", "id"]);
  return validHttpsUrl_(guid) ? guid : "";
}

function extractOfficialUrl_(node, description, sourceName) {
  const named = getChildText_(node, [
    "officialUrl", "official_url", "registrationUrl", "registration_url", "eventUrl",
  ]);
  if (validHttpsUrl_(named) && !isAggregatorUrl_(named)) return named;

  const html = String(description || "");
  const matches = [];
  const regex = /href\s*=\s*["'](https:\/\/[^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (validHttpsUrl_(match[1]) && !isAggregatorUrl_(match[1])) matches.push(match[1]);
  }

  if (matches.length) return matches[0];
  return "";
}

function isAggregatorUrl_(value) {
  const host = getHost_(value);
  return host === "brabble.ai" || host.endsWith(".brabble.ai") ||
    host === "hackalendar.com" || host.endsWith(".hackalendar.com");
}

function isBrabbleUrl_(value) {
  const host = getHost_(value);
  return host === "brabble.ai" || host.endsWith(".brabble.ai");
}

function getHost_(value) {
  const match = String(value || "").match(/^https:\/\/([^/:?#]+)/i);
  return match ? match[1].toLowerCase() : "";
}

function isAllowedSourceEndpoint_(value, sourceType) {
  const host = getHost_(value);
  const path = String(value || "").replace(/^https:\/\/[^/]+/i, "").split(/[?#]/)[0];
  if (!host) return false;

  if (sourceType === "HACKALENDAR_JSON") {
    return host === "hackalendar.com" && path === "/api/events";
  }
  if (sourceType === "RSS") {
    return host === "brabble.ai" && path === "/rss/hackathons.xml";
  }
  return false;
}

function comparableFieldValue_(field, value) {
  const text = cleanText_(value, 160);
  if (!text) return "";

  const dateFields = [
    "registrationDeadline", "submissionDeadline", "eventStart", "eventEnd",
  ];
  if (dateFields.indexOf(field) !== -1) {
    const timestamp = Date.parse(text);
    if (!isNaN(timestamp)) return String(timestamp);
  }
  return text.toLowerCase().replace(/\\s+/g, " ").trim();
}

function validHttpsUrl_(value) {
  const url = String(value || "").trim();
  if (!/^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/|$)/i.test(url)) return false;
  const host = getHost_(url);
  if (!host || host === "localhost" || host.endsWith(".localhost")) return false;
  if (
    /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    host === "metadata.google.internal"
  ) return false;
  return true;
}

function isSafeHttpsUrl_(value) {
  return validHttpsUrl_(value);
}

function cleanText_(value, maxLength) {
  let text = String(value || "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<[^>]*>/g, " ");
  text = text.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&");
  text = text.replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
  text = text.replace(/&#39;/gi, "'").replace(/&quot;/gi, '"');
  text = text.replace(/[\u0000-\u001f\u007f]/g, " ");
  return text.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function canonicalUrl_(value) {
  if (!validHttpsUrl_(value)) return "";
  let url = String(value).trim().replace(/#.*$/, "");
  const urlParts = url.split("?");
  if (urlParts.length > 1) {
    const query = urlParts.slice(1).join("?").split("&").filter(function (parameter) {
      const name = String(parameter.split("=")[0] || "").toLowerCase();
      return !/^utm_/.test(name) &&
        ["fbclid", "gclid", "mc_cid", "mc_eid", "ref", "referrer"].indexOf(name) === -1;
    }).join("&");
    url = urlParts[0] + (query ? "?" + query : "");
  }
  url = url.replace(/^https:\/\/([^/]+)/i, function (_, host) { return "https://" + host.toLowerCase(); });
  return url.replace(/\/$/, "");
}

function eventKey_(event) {
  const official = canonicalUrl_(event.officialUrl);
  if (official) return "url:" + official.toLowerCase();

  const title = String(event.title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const organizer = String(event.organizer || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return "name:" + title + "|" + organizer;
}

function dedupeWithinSource_(events) {
  const map = {};
  events.forEach(function (event) {
    const key = eventKey_(event);
    if (key && key !== "name:|") map[key] = event;
  });
  return Object.keys(map).map(function (key) { return map[key]; });
}

function replaceSourceRecords_(sheet, sourceName, events, fetchedAt) {
  const values = sheet.getDataRange().getValues();
  const keep = [];
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) !== sourceName) keep.push(values[i]);
  }

  const rows = keep.concat(events.map(function (event) {
    return [
      sourceName,
      eventKey_(event),
      JSON.stringify(event),
      event.sourceUrl || "",
      fetchedAt,
    ];
  }));

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, CN.HEADERS.SourceRecords.length).clearContent();
  }
  if (rows.length) {
    sheet.getRange(2, 1, rows.length, CN.HEADERS.SourceRecords.length).setValues(rows);
  }
}

function rebuildAutoEvents_(recordsSheet, eventsSheet, now) {
  const values = recordsSheet.getDataRange().getDisplayValues();
  const oldValues = eventsSheet.getDataRange().getDisplayValues();
  const oldDiscovered = {};

  if (oldValues.length > 1) {
    for (let i = 1; i < oldValues.length; i++) {
      oldDiscovered[oldValues[i][0]] = oldValues[i][26] || now.toISOString();
    }
  }

  const merged = {};
  for (let i = 1; i < values.length; i++) {
    let item;
    try {
      item = JSON.parse(values[i][2]);
    } catch (error) {
      continue;
    }
    if (!item || !item.title) continue;

    const key = values[i][1] || eventKey_(item);
    if (!merged[key]) {
      merged[key] = Object.assign({}, item, {
        eventKey: key,
        sourceNames: [],
        sourceUrls: [],
        fieldValues: {},
        conflictFields: [],
      });
    }

    const event = merged[key];
    const fieldsToCompare = [
      "organizer", "registrationDeadline", "submissionDeadline",
      "eventStart", "eventEnd", "timezone", "mode", "country", "city",
      "teamSize", "fee", "currency", "prizeAmount", "prizeCurrency", "cancelled",
    ];
    fieldsToCompare.forEach(function (field) {
      const rawValue = cleanText_(item[field], 160);
      if (!rawValue) return;
      const normalizedValue = comparableFieldValue_(field, rawValue);
      if (!event.fieldValues[field]) event.fieldValues[field] = [];
      if (event.fieldValues[field].indexOf(normalizedValue) === -1) {
        event.fieldValues[field].push(normalizedValue);
      }
      if (
        event.fieldValues[field].length > 1 &&
        event.conflictFields.indexOf(field) === -1
      ) {
        event.conflictFields.push(field);
      }
    });
    if (values[i][0] && event.sourceNames.indexOf(values[i][0]) === -1) {
      event.sourceNames.push(values[i][0]);
    }
    if (!event.platforms) event.platforms = [];
    if (item.platform && event.platforms.indexOf(item.platform) === -1) {
      event.platforms.push(item.platform);
    }
    const sourceUrl = item.sourceUrl || values[i][3];
    if (sourceUrl && event.sourceUrls.indexOf(sourceUrl) === -1) {
      event.sourceUrls.push(sourceUrl);
    }

    // Prefer fields from the strongest source while preserving already-known
    // values. Missing fields remain blank instead of being guessed.
    Object.keys(item).forEach(function (field) {
      if (!event[field] && item[field]) event[field] = item[field];
    });
  }

  const output = Object.keys(merged).map(function (key) {
    const event = merged[key];
    const sourceNames = event.sourceNames.sort();
    const sourceCount = sourceNames.length;
    const hasHackalendar = sourceNames.indexOf("Hackalendar") !== -1;
    const hasBrabble = sourceNames.indexOf("Brabble") !== -1;

    let status;
    if (sourceCount > 1 && event.conflictFields.length) {
      status = "Cross-source match — conflicts: " + event.conflictFields.join(", ");
    } else if (sourceCount > 1) {
      status = "Cross-source corroborated — organizer facts not independently rechecked";
    } else if (hasHackalendar) {
      status = "Listed in Hackalendar's reviewed index — check organiser for final details";
    } else if (hasBrabble) {
      status = "Auto-discovered through Brabble — check organiser for final details";
    } else {
      status = "Auto-discovered — source details supplied";
    }

    const attributionParts = [];
    if (hasBrabble) attributionParts.push("Includes data from Brabble; refreshed daily. Not a complete Brabble catalogue mirror.");
    if (hasHackalendar) attributionParts.push("Includes data from Hackalendar; original organiser page remains the source of truth.");
    if (!attributionParts.length) attributionParts.push("See linked source and organiser page.");

    return {
      eventKey: key,
      publicStatus: "AUTO_DISCOVERED",
      title: event.title || "",
      organizer: event.organizer || "",
      summary: event.summary || "",
      mode: event.mode || "",
      country: event.country || "",
      city: event.city || "",
      registrationDeadline: event.registrationDeadline || "",
      submissionDeadline: event.submissionDeadline || "",
      eventStart: event.eventStart || "",
      eventEnd: event.eventEnd || "",
      timezone: event.timezone || "",
      skills: event.skills || "",
      teamSize: event.teamSize || "",
      fee: event.fee || "",
      currency: event.currency || "",
      prizeAmount: event.prizeAmount || "",
      prizeCurrency: event.prizeCurrency || "",
      officialUrl: canonicalUrl_(event.officialUrl),
      sourceUrl: canonicalUrl_(event.sourceUrl) || (event.sourceUrls[0] || ""),
      sourceNames: sourceNames.join(", "),
      sourceCount: sourceCount,
      conflictingFields: event.conflictFields.join(", "),
      attribution: attributionParts.join(" "),
      discoveryStatus: status,
      discoveredAt: oldDiscovered[key] || now.toISOString(),
      lastCheckedAt: now.toISOString(),
      platforms: event.platforms || [],
      eligibility: event.eligibility || "",
      cancelled: !!event.cancelled,
    };
  });

  output.sort(function (a, b) {
    const aDate = Date.parse(a.registrationDeadline || a.eventStart || "") || Number.MAX_SAFE_INTEGER;
    const bDate = Date.parse(b.registrationDeadline || b.eventStart || "") || Number.MAX_SAFE_INTEGER;
    return aDate - bDate;
  });

  const rows = output.map(function (event) {
    return [
      event.eventKey, event.publicStatus, event.title, event.organizer, event.summary,
      event.mode, event.country, event.city, event.registrationDeadline,
      event.submissionDeadline, event.eventStart, event.eventEnd, event.timezone,
      event.skills, event.teamSize, event.fee, event.currency, event.prizeAmount,
      event.prizeCurrency, event.officialUrl, event.sourceUrl, event.sourceNames,
      event.sourceCount, event.conflictingFields, event.attribution,
      event.discoveryStatus, event.discoveredAt, event.lastCheckedAt,
      (event.platforms || []).join(", "), event.eligibility || "", !!event.cancelled,
    ];
  });

  logEventChanges_(oldValues, output, eventsSheet.getParent().getSheetByName(CN.SHEETS.EVENT_HISTORY), now);

  if (eventsSheet.getLastRow() > 1) {
    eventsSheet.getRange(2, 1, eventsSheet.getLastRow() - 1, CN.HEADERS.AutoEvents.length).clearContent();
  }
  if (rows.length) {
    eventsSheet.getRange(2, 1, rows.length, CN.HEADERS.AutoEvents.length).setValues(rows);
  }
  return output;
}


function logEventChanges_(oldValues, newEvents, historySheet, now) {
  const oldEvents = {};
  if (oldValues.length > 1) {
    const headers = oldValues[0];
    const index = {};
    headers.forEach(function (name, i) { index[name] = i; });
    oldValues.slice(1).forEach(function (row) {
      const key = row[index["Event key"]];
      if (!key) return;
      oldEvents[key] = {
        organizer: row[index["Organizer"]] || "",
        registrationDeadline: row[index["Registration deadline"]] || "",
        eventStart: row[index["Event start"]] || "",
        eventEnd: row[index["Event end"]] || "",
        mode: row[index["Mode"]] || "",
        officialUrl: row[index["Official URL"]] || "",
        cancelled: row[index["Cancelled"]] || "",
      };
    });
  }

  const fields = [
    ["organizer", "Organizer"],
    ["registrationDeadline", "Registration deadline"],
    ["eventStart", "Event start"],
    ["eventEnd", "Event end"],
    ["mode", "Mode"],
    ["officialUrl", "Official URL"],
    ["cancelled", "Cancelled"],
  ];
  const changes = [];

  newEvents.forEach(function (event) {
    const previous = oldEvents[event.eventKey];
    if (!previous) {
      changes.push([
        now, "NEW_EVENT", event.eventKey, event.title, "New listing",
        "", event.title, (event.platforms || []).join(", "),
      ]);
      return;
    }
    fields.forEach(function (field) {
      const oldValue = String(previous[field[0]] || "");
      const newValue = String(event[field[0]] || "");
      if (comparableFieldValue_(field[0], oldValue) !== comparableFieldValue_(field[0], newValue)) {
        changes.push([
          now, "MATERIAL_UPDATE", event.eventKey, event.title, field[1],
          oldValue, newValue, (event.platforms || []).join(", "),
        ]);
      }
    });
  });

  if (changes.length) {
    historySheet.getRange(historySheet.getLastRow() + 1, 1, changes.length, CN.HEADERS.EventHistory.length)
      .setValues(changes);
  }
}

function getPublicEvents_() {
  const sheet = getSpreadsheet_().getSheetByName(CN.SHEETS.AUTO_EVENTS);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0];
  const col = {};
  headers.forEach(function (name, index) { col[name] = index; });

  const read = function (row, field) {
    return col[field] === undefined ? "" : String(row[col[field]] || "").trim();
  };

  const now = Date.now();
  const events = [];

  values.slice(1).forEach(function (row) {
    if (read(row, "Public status") !== "AUTO_DISCOVERED") return;

    const registrationDeadline = read(row, "Registration deadline");
    const eventStart = read(row, "Event start");
    if (read(row, "Cancelled").toLowerCase() === "true") return;
    if (isEventExpired_(registrationDeadline, eventStart, new Date(now), read(row, "Event timezone"))) return;

    events.push({
      title: read(row, "Title"),
      slug: "",
      organizer: read(row, "Organizer"),
      summary: read(row, "Summary"),
      mode: read(row, "Mode"),
      country: read(row, "Country"),
      city: read(row, "City"),
      registrationDeadline: registrationDeadline,
      submissionDeadline: read(row, "Submission deadline"),
      eventStart: read(row, "Event start"),
      eventEnd: read(row, "Event end"),
      eventTimezone: read(row, "Event timezone"),
      skills: read(row, "Skills"),
      teamSize: read(row, "Team size"),
      entryFee: read(row, "Entry fee"),
      currency: read(row, "Currency"),
      prizeAmount: read(row, "Prize amount"),
      prizeCurrency: read(row, "Prize currency"),
      sourcePlatforms: read(row, "Source platforms"),
      eligibility: read(row, "Eligibility"),
      cancelled: read(row, "Cancelled").toLowerCase() === "true",
      officialUrl: read(row, "Official URL"),
      sourceUrl: read(row, "Source URL"),
      sourceNames: read(row, "Source names"),
      sourceCount: Number(read(row, "Source count")) || 1,
      sourceConflicts: read(row, "Conflicting fields"),
      attribution: read(row, "Attribution"),
      verificationStatus: read(row, "Discovery / verification status"),
      lastCheckedAt: read(row, "Last checked at"),
    });
  });

  return events;
}

function isEventExpired_(registrationDeadline, eventStart, now, timezone) {
  const boundary = String(registrationDeadline || eventStart || "").trim();
  if (!boundary) return false;

  // Date-only deadlines remain open for their full local calendar day.
  const dateOnly = boundary.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (dateOnly) {
    let today;
    try {
      today = Utilities.formatDate(now, timezone || Session.getScriptTimeZone() || "UTC", "yyyy-MM-dd");
    } catch (error) {
      today = Utilities.formatDate(now, "UTC", "yyyy-MM-dd");
    }
    return dateOnly[1] < today;
  }

  const timestamp = Date.parse(boundary);
  return !isNaN(timestamp) && timestamp < now.getTime();
}

function getSourceSummary_() {
  const sheet = getSpreadsheet_().getSheetByName(CN.SHEETS.SOURCES);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const values = sheet.getDataRange().getDisplayValues();
  return values.slice(1).map(function (row) {
    return {
      name: row[1] || "",
      enabled: String(row[0]).toLowerCase() === "true",
      status: row[7] || "",
      lastCheckedAt: row[6] || "",
      refreshHours: Number(row[5]) || 24,
    };
  });
}

/**
 * Public read-only endpoint. JSONP is used by the frontend because Apps Script
 * Content Service may redirect its browser response; no write operation exists.
 */
function doGet(request) {
  let events = [];
  let sources = [];
  let message = "";

  try {
    events = getPublicEvents_();
    sources = getSourceSummary_();
  } catch (error) {
    message = cleanText_(error && error.message ? error.message : String(error), 300);
  }

  const payload = {
    ok: !message,
    generatedAt: new Date().toISOString(),
    events: events,
    sources: sources,
    organizerSubmissionUrl: PropertiesService.getScriptProperties().getProperty("CN_ORGANIZER_FORM_URL") || "",
    message: message,
    disclaimer: "Auto-discovered index data. Cross-source matches are not a guarantee of organiser verification; check the original event page before registering.",
  };

  const callback = request && request.parameter ? String(request.parameter.callback || "") : "";
  const json = JSON.stringify(payload);

  if (callback) {
    if (!/^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*){0,3}$/.test(callback)) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, events: [], message: "Invalid callback name." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function updateSourceStatus_(sheet, rowNumber, checkedAt, result) {
  sheet.getRange(rowNumber, 7, 1, 2).setValues([[checkedAt, result]]);
}

function logRun_(action, sourceName, result, fetched, written, details) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(CN.SHEETS.RUN_LOG);
  if (!sheet) return;
  sheet.appendRow([
    new Date(), action, sourceName, result, fetched, written,
    cleanText_(details, 500),
  ]);
}

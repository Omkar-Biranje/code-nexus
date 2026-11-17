/**
 * CODE NEXUS — Google Sheets event intake
 *
 * Reads only RSS/Atom feed URLs that a spreadsheet editor explicitly adds
 * to the Sources sheet. New items go to Candidates with Pending review.
 * They are never automatically published.
 *
 * Create this as a spreadsheet-bound Apps Script project:
 * Google Sheet > Extensions > Apps Script.
 */

const CN_SHEETS = {
  SOURCES: "Sources",
  CANDIDATES: "Candidates",
  PUBLISHED: "Published",
  RUN_LOG: "RunLog",
};

const CN_HEADERS = {
  Sources: [
    "Enabled", "Source name", "Feed URL", "Region", "Notes",
    "Last checked at", "Last result",
  ],
  Candidates: [
    "Candidate ID", "Title", "Canonical URL", "Source name", "Feed URL",
    "Published at (source)", "Summary", "Discovered at",
    "Review status", "Last checked at", "Region",
  ],
  Published: [
    "Public status", "Title", "Slug", "Organizer", "Summary", "Mode",
    "Country", "City", "Registration deadline", "Submission deadline",
    "Event start", "Event end", "Event timezone", "Skills", "Team size",
    "Entry fee", "Currency", "Prize amount", "Prize currency",
    "Official URL", "Source URL", "Verification status", "Last checked at",
  ],
  RunLog: [
    "Timestamp", "Action", "Source name", "Result", "Items found",
    "Items added", "Details",
  ],
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("CODE NEXUS")
    .addItem("Set up workbook", "setupCodeNexus")
    .addItem("Fetch configured feeds now", "ingestApprovedFeeds")
    .addItem("Install six-hour refresh", "installSixHourlyRefresh")
    .addToUi();
}

function setupCodeNexus() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(CN_HEADERS).forEach(function (name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    const headers = CN_HEADERS[name];
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      const current = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
      if (current.join("|") !== headers.join("|")) {
        throw new Error(
          "The header row in " + name + " does not match the expected template. " +
          "Do not overwrite existing records; review the sheet manually."
        );
      }
    }
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#1d3151")
      .setFontColor("#ffffff")
      .setWrap(true);
    sheet.autoResizeColumns(1, Math.min(headers.length, 8));
  });
  logRun_("SETUP", "", "OK", 0, 0, "Workbook sheets and headers checked.");
  SpreadsheetApp.getUi().alert(
    "CODE NEXUS intake workbook is ready. Add permitted RSS/Atom feeds to the Sources sheet."
  );
}

function ingestApprovedFeeds() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) {
    throw new Error("Another intake run is active. Try again in a moment.");
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureWorkbook_();
    const sourceSheet = ss.getSheetByName(CN_SHEETS.SOURCES);
    const candidateSheet = ss.getSheetByName(CN_SHEETS.CANDIDATES);
    const sourceValues = sourceSheet.getDataRange().getValues();
    const existingUrls = getExistingCandidateUrls_(candidateSheet);
    let totalFound = 0;
    let totalAdded = 0;

    for (let rowIndex = 1; rowIndex < sourceValues.length; rowIndex++) {
      const row = sourceValues[rowIndex];
      const enabled = row[0] === true || String(row[0]).toUpperCase() === "TRUE";
      const sourceName = cleanCell_(row[1], 160);
      const feedUrl = String(row[2] || "").trim();
      const region = cleanCell_(row[3], 80);
      if (!enabled || !feedUrl) continue;

      const checkedAt = new Date();
      try {
        if (!isSafeHttpsUrl_(feedUrl)) {
          throw new Error("Feed URL must be a public HTTPS URL. Private/local hosts are not allowed.");
        }

        const response = UrlFetchApp.fetch(feedUrl, {
          method: "get",
          muteHttpExceptions: true,
          followRedirects: false,
          headers: {
            Accept: "application/atom+xml, application/rss+xml, application/xml, text/xml",
          },
        });

        const statusCode = response.getResponseCode();
        if (statusCode >= 300 && statusCode < 400) {
          throw new Error("Feed redirected. Update the Sources sheet with its final HTTPS feed URL.");
        }
        if (statusCode < 200 || statusCode >= 300) {
          throw new Error("Feed returned HTTP " + statusCode + ".");
        }

        const xmlText = response.getContentText();
        if (!xmlText || xmlText.length > 2 * 1024 * 1024) {
          throw new Error("Feed is empty or exceeds the 2 MB intake limit.");
        }

        const items = parseFeedItems_(xmlText);
        totalFound += items.length;
        const rowsToAdd = [];

        items.forEach(function (item) {
          const title = cleanCell_(item.title, 300);
          const url = canonicalizeUrl_(item.url);
          if (!title || !url || existingUrls.has(url)) return;

          const candidateId = sha256Hex_(url);
          rowsToAdd.push([
            candidateId,
            title,
            url,
            sourceName || "Source name not supplied",
            feedUrl,
            cleanCell_(item.publishedAt, 120),
            cleanCell_(item.summary, 1200),
            checkedAt,
            "Pending review",
            checkedAt,
            region || "Not specified",
          ]);
          existingUrls.add(url);
        });

        if (rowsToAdd.length) {
          const startRow = candidateSheet.getLastRow() + 1;
          candidateSheet.getRange(startRow, 1, rowsToAdd.length, CN_HEADERS.Candidates.length)
            .setValues(rowsToAdd);
          totalAdded += rowsToAdd.length;
        }

        updateSourceStatus_(sourceSheet, rowIndex + 1, checkedAt, "OK — " + items.length + " found; " + rowsToAdd.length + " new");
        logRun_("FEED_FETCH", sourceName, "OK", items.length, rowsToAdd.length, "New records marked Pending review.");
      } catch (error) {
        const message = cleanCell_(error && error.message ? error.message : String(error), 400);
        updateSourceStatus_(sourceSheet, rowIndex + 1, checkedAt, "ERROR — " + message);
        logRun_("FEED_FETCH", sourceName, "ERROR", 0, 0, message);
      }
    }

    logRun_("INGEST_COMPLETE", "", "OK", totalFound, totalAdded, "No candidate was auto-published.");
    SpreadsheetApp.getActiveSpreadsheet().toast(
      totalAdded + " new candidate(s) added. All require human review.",
      "CODE NEXUS intake",
      8
    );
  } finally {
    lock.releaseLock();
  }
}

function installSixHourlyRefresh() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (trigger) {
    if (trigger.getHandlerFunction() === "ingestApprovedFeeds") {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger("ingestApprovedFeeds").timeBased().everyHours(6).create();
  logRun_("TRIGGER_INSTALL", "", "OK", 0, 0, "Six-hour trigger installed; runs as the account that created it.");
  SpreadsheetApp.getUi().alert("Six-hour feed refresh installed.");
}

/**
 * Public, read-only feed for the CODE NEXUS Explore page.
 * It exposes only rows explicitly marked Published AND Verified.
 * Browser JSONP callback example:
 * ?callback=CODE_NEXUS_CALLBACKS.feed_123
 */
function doGet(request) {
  const result = {
    ok: true,
    generatedAt: new Date().toISOString(),
    events: getPublicEvents_(),
  };
  const json = JSON.stringify(result);
  const callback = request && request.parameter ? String(request.parameter.callback || "") : "";

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

function getPublicEvents_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CN_SHEETS.PUBLISHED);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0];
  const index = {};
  headers.forEach(function (heading, i) { index[heading] = i; });

  const read = function (row, heading) {
    const position = index[heading];
    return position === undefined ? "" : String(row[position] || "").trim();
  };

  return values.slice(1).filter(function (row) {
    const status = read(row, "Public status").toLowerCase();
    const verification = read(row, "Verification status").toLowerCase();
    const officialUrl = read(row, "Official URL");
    const sourceUrl = read(row, "Source URL");
    return status === "published" &&
      verification === "verified" &&
      isSafeHttpsUrl_(officialUrl) &&
      isSafeHttpsUrl_(sourceUrl);
  }).map(function (row) {
    return {
      title: read(row, "Title"),
      slug: read(row, "Slug"),
      organizer: read(row, "Organizer"),
      summary: read(row, "Summary"),
      mode: read(row, "Mode"),
      country: read(row, "Country"),
      city: read(row, "City"),
      registrationDeadline: read(row, "Registration deadline"),
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
      officialUrl: read(row, "Official URL"),
      sourceUrl: read(row, "Source URL"),
      verificationStatus: read(row, "Verification status"),
      lastCheckedAt: read(row, "Last checked at"),
    };
  });
}

function parseFeedItems_(xmlText) {
  const document = XmlService.parse(xmlText);
  const root = document.getRootElement();
  const rootName = root.getName().toLowerCase();
  let nodes = [];

  if (rootName === "rss") {
    const channel = getDirectChild_(root, "channel") || root;
    nodes = channel.getChildren().filter(function (node) {
      return node.getName().toLowerCase() === "item";
    });
  } else if (rootName === "feed") {
    nodes = root.getChildren().filter(function (node) {
      return node.getName().toLowerCase() === "entry";
    });
  } else {
    nodes = root.getChildren().filter(function (node) {
      return node.getName().toLowerCase() === "item" ||
        node.getName().toLowerCase() === "entry";
    });
  }

  return nodes.map(function (node) {
    return {
      title: getChildText_(node, ["title"]),
      url: getFeedItemUrl_(node),
      publishedAt: getChildText_(node, ["pubDate", "published", "updated", "date"]),
      summary: getChildText_(node, ["description", "summary", "content"]),
    };
  }).filter(function (item) { return item.title && item.url; });
}

function getDirectChild_(node, name) {
  const children = node.getChildren();
  for (let i = 0; i < children.length; i++) {
    if (children[i].getName().toLowerCase() === name.toLowerCase()) return children[i];
  }
  return null;
}

function getChildText_(node, names) {
  const children = node.getChildren();
  for (let i = 0; i < children.length; i++) {
    if (names.indexOf(children[i].getName()) !== -1) {
      return children[i].getText();
    }
  }
  return "";
}

function getFeedItemUrl_(node) {
  const link = getDirectChild_(node, "link");
  if (!link) return "";
  const href = link.getAttribute("href");
  return href ? href.getValue() : link.getText();
}

function getExistingCandidateUrls_(sheet) {
  const result = new Set();
  if (sheet.getLastRow() < 2) return result;
  sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getDisplayValues()
    .forEach(function (row) {
      const url = String(row[0] || "").trim();
      if (url) result.add(url);
    });
  return result;
}

function updateSourceStatus_(sheet, rowNumber, checkedAt, result) {
  sheet.getRange(rowNumber, 6, 1, 2).setValues([[checkedAt, result]]);
}

function ensureWorkbook_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(CN_HEADERS).forEach(function (name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, CN_HEADERS[name].length).setValues([CN_HEADERS[name]]);
      sheet.setFrozenRows(1);
    }
  });
}

function isSafeHttpsUrl_(value) {
  const url = String(value || "").trim();
  if (!/^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/|$)/i.test(url)) return false;
  const host = url.replace(/^https:\/\//i, "").split(/[/:?#]/)[0].toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "metadata.google.internal" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) return false;
  return true;
}

function canonicalizeUrl_(value) {
  const url = String(value || "").trim();
  if (!isSafeHttpsUrl_(url)) return "";
  return url.replace(/#.*$/, "").replace(/^https:\/\/([^/]+)/i, function (_, host) {
    return "https://" + host.toLowerCase();
  });
}

function cleanCell_(value, maxLength) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sha256Hex_(value) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function (byte) {
    const positive = (byte + 256) % 256;
    return ("0" + positive.toString(16)).slice(-2);
  }).join("");
}

function logRun_(action, sourceName, result, found, added, details) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CN_SHEETS.RUN_LOG);
  if (!sheet) return;
  sheet.appendRow([
    new Date(),
    action,
    sourceName,
    result,
    found,
    added,
    cleanCell_(details, 500),
  ]);
}
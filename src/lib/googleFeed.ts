export type PublishedFeedEvent = {
  title?: string;
  slug?: string;
  organizer?: string;
  summary?: string;
  mode?: string;
  country?: string;
  city?: string;
  registrationDeadline?: string;
  submissionDeadline?: string;
  eventStart?: string;
  eventEnd?: string;
  eventTimezone?: string;
  skills?: string;
  teamSize?: string;
  entryFee?: string;
  currency?: string;
  platform?: string;
  eligibility?: string;
  sourcePlatforms?: string;
  cancelled?: boolean;
  prizeAmount?: string;
  prizeCurrency?: string;
  officialUrl?: string;
  sourceUrl?: string;
  verificationStatus?: string;
  sourceNames?: string;
  sourceCount?: number;
  sourceConflicts?: string;
  attribution?: string;
  lastCheckedAt?: string;
};

export type GoogleFeedResponse = {
  ok: boolean;
  generatedAt?: string;
  events: PublishedFeedEvent[];
  sources?: Array<{ name: string; enabled: boolean; status: string; lastCheckedAt?: string; refreshHours?: number }>;
  organizerSubmissionUrl?: string;
  disclaimer?: string;
  message?: string;
};

declare global {
  interface Window {
    CODE_NEXUS_CALLBACKS?: Record<string, (payload: GoogleFeedResponse) => void>;
  }
}

export function loadGoogleFeed(endpoint: string): Promise<GoogleFeedResponse> {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return Promise.reject(new Error("Enter a valid Google Apps Script web app URL."));
  }

  if (url.protocol !== "https:") {
    return Promise.reject(new Error("The Google feed URL must use HTTPS."));
  }

  const callbackKey = "feed_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
  const callbackName = "CODE_NEXUS_CALLBACKS." + callbackKey;
  url.searchParams.set("callback", callbackName);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    let finished = false;

    const cleanup = () => {
      if (window.CODE_NEXUS_CALLBACKS) {
        delete window.CODE_NEXUS_CALLBACKS[callbackKey];
      }
      script.remove();
    };

    const timer = window.setTimeout(() => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(new Error("The Google feed did not respond. Check that the web app is deployed for public read access."));
    }, 12000);

    window.CODE_NEXUS_CALLBACKS = window.CODE_NEXUS_CALLBACKS || {};
    window.CODE_NEXUS_CALLBACKS[callbackKey] = (payload) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      cleanup();
      if (!payload || payload.ok !== true || !Array.isArray(payload.events)) {
        reject(new Error(payload?.message || "The Google feed returned an unexpected response."));
        return;
      }
      resolve(payload);
    };

    script.async = true;
    script.src = url.toString();
    script.onerror = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      cleanup();
      reject(new Error("Could not load the Google feed. Recheck the deployed web app URL and access setting."));
    };

    document.head.appendChild(script);
  });
}
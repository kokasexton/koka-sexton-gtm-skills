// Benchmark engine — evaluate a LinkedIn post against the 2026 Algorithm Report data.
// Turns the report from prose into something an agent can compute with.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DATA = JSON.parse(
  readFileSync(join(HERE, "..", "skills", "linkedin-algorithm", "data", "benchmarks.json"), "utf8"),
);

const FORMAT_ALIASES = {
  image: "image", photo: "image", carousel: "image",
  document: "document", doc: "document", pdf: "document", slides: "document",
  text: "text", video: "video", article: "article", link: "article", url: "article",
};

function detectFormat(format, text) {
  if (format) return FORMAT_ALIASES[String(format).toLowerCase()] || "text";
  if (/https?:\/\//i.test(text)) return "article";
  return "text";
}

function countHashtags(text, hashtags) {
  if (typeof hashtags === "number") return hashtags;
  if (Array.isArray(hashtags)) return hashtags.length;
  return (text.match(/(^|\s)#[\w-]+/g) || []).length;
}

/** Evaluate a draft. Returns detected traits, per-trait benchmark checks, and fixes. */
export function benchmarkPost({ text = "", format, hashtags, dayOfWeek, hourUtc } = {}) {
  const c = DATA.craft;
  const chars = text.length;
  const tags = countHashtags(text, hashtags);
  const fmt = detectFormat(format, text);
  const asksQuestion = /\?/.test(text);
  const leadsWithNumber = /^\s*\d/.test(text);
  const hasLinebreaks = /\n/.test(text);

  const checks = [];
  const add = (trait, value, benchmark, status) => checks.push({ trait, value, benchmark, status });

  add("length", chars,
    `1,500+ chars ≈ ${c.length_multiple}× median (${c.length_median_long} vs ${c.length_median_short})`,
    chars >= c.length_threshold_chars ? "good" : chars >= 800 ? "borderline" : "off");

  add("hashtags", tags,
    `1–2 best (median ${c.hashtag_optimal_median}); ${c.hashtag_overload}+ → ${c.hashtag_overload_median} (−${c.hashtag_overload_drop_pct}%)`,
    tags >= 1 && tags <= 2 ? "good" : tags === 0 || tags <= 5 ? "borderline" : "off");

  const fmtMedian = DATA.format_median_engagements[fmt] ?? DATA.format_median_engagements.overall;
  add("format", fmt,
    `image median ${DATA.format_median_engagements.image} vs link ${DATA.format_median_engagements.link_or_article} (${DATA.format_median_engagements.image_vs_link_multiple}×)`,
    fmt === "image" || fmt === "document" ? "good" : fmt === "article" ? "off" : "borderline");

  add("linebreaks", hasLinebreaks, `whitespace beats a wall of text (+${c.linebreaks_gain_pct}%: ${c.linebreaks_median} vs ${c.wall_of_text_median})`,
    hasLinebreaks ? "good" : "off");

  add("question", asksQuestion, `questions median ${c.question_median}`, asksQuestion ? "good" : "borderline");
  add("number_lead", leadsWithNumber, `leading with a number median ${c.number_lead_median}`, leadsWithNumber ? "good" : "borderline");

  if (dayOfWeek || hourUtc !== undefined) {
    const dayOk = !dayOfWeek || DATA.timing.peak_days.includes(dayOfWeek);
    const hourOk = hourUtc === undefined || (hourUtc >= DATA.timing.peak_window_utc[0] && hourUtc <= DATA.timing.peak_window_utc[1]);
    add("timing", `${dayOfWeek || "?"} ${hourUtc ?? "?"}Z`, `peak ${DATA.timing.peak_days.join("/")} ${DATA.timing.peak_window_utc[0]}:00–${DATA.timing.peak_window_utc[1]}:00 UTC`,
      dayOk && hourOk ? "good" : "off");
  }

  const fixes = checks.filter((c2) => c2.status !== "good")
    .map((c2) => `${c2.trait}: ${c2.status} — target ${c2.benchmark}`);

  const good = checks.filter((c2) => c2.status === "good").length;
  return {
    traits: { chars, hashtags: tags, format: fmt, asksQuestion, leadsWithNumber, hasLinebreaks },
    checks,
    good,
    total: checks.length,
    fixes,
    reference: DATA.source,
  };
}

/** Return a benchmark metric (or the whole dataset). */
export function benchmarkData(metric) {
  if (!metric) return DATA;
  const key = String(metric).toLowerCase().replace(/\s+/g, "_");
  for (const k of Object.keys(DATA)) {
    if (k.toLowerCase().includes(key)) return { [k]: DATA[k] };
  }
  return { error: `no benchmark matching "${metric}"`, available: Object.keys(DATA) };
}

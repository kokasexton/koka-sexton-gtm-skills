#!/usr/bin/env node
/**
 * lint-post — the evaluation gate for a LinkedIn draft.
 *
 * Every rule cites where it comes from: either the LinkedIn Algorithm Report
 * 2026 (the canonical numbers live in skills/linkedin-algorithm) or the voice
 * rules in KOKA.md. No rule invents a number.
 *
 * Usage:
 *   node lint-post.mjs draft.md                 # human-readable report
 *   node lint-post.mjs draft.md --format image  # tell it the post format
 *   cat draft.md | node lint-post.mjs -         # read stdin
 *   node lint-post.mjs draft.md --json          # machine-readable
 *
 * Exit code: 0 = ship-ready (no FAIL), 1 = at least one FAIL, 2 = usage error.
 * Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Single threshold source: skills/linkedin-algorithm/data/benchmarks.json.
// lint_post and linkedin_benchmark both read it, so the numbers cannot drift.
const HERE = dirname(fileURLToPath(import.meta.url));
export const BENCH = JSON.parse(
  readFileSync(join(HERE, "..", "..", "linkedin-algorithm", "data", "benchmarks.json"), "utf8"),
);
const C = BENCH.craft;
const FM = BENCH.format_median_engagements;
const FC = BENCH.format_comment_share_pct;
const [HT_LO, HT_HI] = C.hashtag_optimal;

const REPORT = "LinkedIn Algorithm Report 2026";
const VOICE = "KOKA.md voice rules";

// Format medians from the canonical skill (median engagements).
const LINK_NOTE = `Link/article posts have a median of ${FM.link_or_article} vs ${FM.image} for image (${FM.image_vs_link_multiple}× gap). Move the link out of the post.`;
const FORMAT_NOTES = {
  image: `Image is the strongest format (median ${FM.image}; ${BENCH.viral_top1pct.image_share_pct}% of top-1% posts are image-based).`,
  document: `Document posts earn a high comment share (${FC.document}%) — good for conversation.`,
  text: `Text posts hold a solid comment share (${FC.text}%). Consider an image or document to lift reach.`,
  video: `Video has a lower comment share (${FC.video}%). Lead with an image or document if conversation is the goal.`,
  link: LINK_NOTE,
  article: LINK_NOTE,
};

const HOT_TAKE = /\b(unpopular opinion|hot take|controversial take|nobody wants to hear this|i'?ll probably get (hate|flak) for this)\b/i;

const ENGAGEMENT_BAIT = [
  /\bcomment ["'“]?[a-z0-9]+["'”]? (below|and i'?ll|to get)\b/i,
  /\b(like|repost|share) (this )?if you agree\b/i,
  /\bdrop an? (emoji|🔥|👇|"yes")/i,
  /\btype ["'“]?(yes|me|interested)["'”]? (below|in the comments)\b/i,
  /\bagree\?\s*$/im,
  /\bfollow me for more\b/i,
  /\bsmash (that|the) like\b/i,
];

const SLOP = [
  "in today's fast-paced",
  "in today's digital landscape",
  "ever-evolving landscape",
  "game-changer",
  "game changer",
  "unlock the power",
  "unleash",
  "revolutionize",
  "delve",
  "elevate your",
  "supercharge",
  "synergy",
  "it's not just about",
  "let that sink in",
  "here's the kicker",
  "buckle up",
];

/**
 * Lint one post. Returns { stats, findings } where each finding is
 * { id, level: "fail" | "warn" | "info" | "pass", message, source }.
 */
export function lintPost(text, opts = {}) {
  const body = text.replace(/\r\n/g, "\n").trim();
  const chars = body.length;
  const lines = body.split("\n");
  const firstLine = (lines.find((l) => l.trim()) || "").trim();
  const hashtags = body.match(/(^|\s)#[\p{L}\p{N}_]+/gu) || [];
  const links = body.match(/\bhttps?:\/\/\S+|\bwww\.\S+\.\S+/gi) || [];
  const paragraphs = body.split(/\n\s*\n/).filter((p) => p.trim());
  const longestParagraph = Math.max(0, ...paragraphs.map((p) => p.length));
  const findings = [];
  const add = (id, level, message, source) => findings.push({ id, level, message, source });

  // Length — 1,500+ chars ≈ 2× short (74 vs ~40).
  if (chars >= C.length_threshold_chars) add("length", "pass", `${chars} chars — in the long-form band (${C.length_threshold_chars.toLocaleString("en-US")}+).`, REPORT);
  else if (chars >= 900)
    add("length", "warn", `${chars} chars. Long posts (${C.length_threshold_chars.toLocaleString("en-US")}+) earn ~${C.length_multiple}× the median of short ones (${C.length_median_long} vs ~${C.length_median_short}).`, REPORT);
  else
    add("length", "warn", `${chars} chars — short. ${C.length_threshold_chars.toLocaleString("en-US")}+ char posts earn ~${C.length_multiple}× the median of short ones. Add the lesson, not filler.`, REPORT);

  // Hashtags — 1–2 best (median 91); 6+ → 33 (−63%); top 1% ≈ 0.
  const h = hashtags.length;
  if (h >= C.hashtag_overload) add("hashtags", "fail", `${h} hashtags. ${C.hashtag_overload}+ drops median engagement to ${C.hashtag_overload_median} (−${C.hashtag_overload_drop_pct}%). Use ${HT_LO}–${HT_HI}.`, REPORT);
  else if (h > HT_HI) add("hashtags", "warn", `${h} hashtags. ${HT_LO}–${HT_HI} is the best band (median ${C.hashtag_optimal_median}). Cut to two.`, REPORT);
  else if (h >= HT_LO) add("hashtags", "pass", `${h} hashtag${h > 1 ? "s" : ""} — in the ${HT_LO}–${HT_HI} band.`, REPORT);
  else add("hashtags", "pass", "No hashtags — fine; top-1% posts use ~0.", REPORT);

  // Links in body get buried.
  if (links.length)
    add("link-in-body", "fail", `Link in the post body (${links[0]}). Links get buried — put it in the first comment or a document.`, REPORT);
  else add("link-in-body", "pass", "No links in the body.", REPORT);

  // Whitespace — line breaks +72% (62 vs 36).
  if (paragraphs.length <= 1 && chars > 300)
    add("whitespace", "warn", `One wall of text. Posts with line breaks earn +${C.linebreaks_gain_pct}% (${C.linebreaks_median} vs ${C.wall_of_text_median}). Break it up.`, REPORT);
  else if (longestParagraph > 600)
    add("whitespace", "warn", `Longest paragraph is ${longestParagraph} chars. Break it — whitespace is +${C.linebreaks_gain_pct}%.`, REPORT);
  else add("whitespace", "pass", `${paragraphs.length} paragraphs, longest ${longestParagraph} chars.`, REPORT);

  // Hot takes underperform (54, −29%).
  if (HOT_TAKE.test(body))
    add("hot-take", "warn", `Reads as a hot take. Hot takes underperform (median ${BENCH.topics_median_engagements.hot_take_contrarian}, ${BENCH.topics_median_engagements.hot_take_vs_ai_pct}%). Teach the shift, don't provoke.`, REPORT);

  // Engagement bait / formulaic CTAs are penalised.
  const bait = ENGAGEMENT_BAIT.map((re) => body.match(re)).find(Boolean);
  if (bait)
    add("engagement-bait", "fail", `Engagement bait: "${bait[0].trim()}". Formulaic CTAs and pod tactics are penalised. Ask a real question instead.`, REPORT);

  // Hook — first line does the work in the small-cohort test.
  if (firstLine.length > 210)
    add("hook", "warn", `First line is ${firstLine.length} chars. The first cohort decides whether a post expands — make line one land before "…see more".`, REPORT);
  else if (/^(i('m| am) (excited|thrilled|humbled|honou?red)|excited to (share|announce))/i.test(firstLine))
    add("hook", "warn", `Generic opener ("${firstLine.slice(0, 40)}…"). Templated writing is penalised; lead with the lesson or the number.`, REPORT);
  else add("hook", "pass", `Hook: "${firstLine.slice(0, 80)}${firstLine.length > 80 ? "…" : ""}"`, REPORT);

  // Conversation is the signal — invite a substantive comment.
  if (!/\?\s*$/m.test(body))
    add("conversation", "info", `No question in the post. Comments are the strongest signal (commenters are ${BENCH.comments.seniority_lift_pct}% more senior) — invite a real reply.`, REPORT);

  // Voice: slop phrases.
  const lower = body.toLowerCase();
  const slop = SLOP.filter((s) => lower.includes(s));
  if (slop.length) add("slop", "fail", `Slop phrases: ${slop.map((s) => `"${s}"`).join(", ")}. Cut them.`, VOICE);

  // Format guidance (optional).
  if (opts.format) {
    const note = FORMAT_NOTES[String(opts.format).toLowerCase()];
    if (note) add("format", opts.format.match(/link|article/i) ? "warn" : "info", note, REPORT);
  }

  const counts = { fail: 0, warn: 0, info: 0, pass: 0 };
  for (const f of findings) counts[f.level]++;
  const verdict = counts.fail ? "BLOCK" : counts.warn ? "SHIP WITH EDITS" : "SHIP";

  return {
    verdict,
    counts,
    stats: { chars, hashtags: h, links: links.length, paragraphs: paragraphs.length, longestParagraph },
    findings,
  };
}

const ICON = { fail: "✗ FAIL", warn: "! WARN", info: "· INFO", pass: "✓ PASS" };

export function formatReport(result) {
  const order = { fail: 0, warn: 1, info: 2, pass: 3 };
  const rows = [...result.findings].sort((a, b) => order[a.level] - order[b.level]);
  const out = [`Verdict: ${result.verdict}  (${result.counts.fail} fail, ${result.counts.warn} warn)`, ""];
  for (const f of rows) out.push(`${ICON[f.level].padEnd(7)} [${f.id}] ${f.message}  — ${f.source}`);
  return out.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  const fmtIdx = args.indexOf("--format");
  const format = fmtIdx >= 0 ? args[fmtIdx + 1] : undefined;
  if (!file || args.includes("--help")) {
    console.error("usage: lint-post.mjs <draft.md | -> [--format image|document|text|video|link] [--json]");
    process.exit(2);
  }
  const text = readFileSync(file === "-" ? 0 : file, "utf8");
  const result = lintPost(text, { format });
  console.log(args.includes("--json") ? JSON.stringify(result, null, 2) : formatReport(result));
  process.exit(result.counts.fail ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

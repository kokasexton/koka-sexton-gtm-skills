#!/usr/bin/env node
/**
 * warm-list — turn raw post engagement into a ranked, tiered warm list.
 *
 * Input: a CSV export of engagement events (one row per reaction/comment/repost).
 * Output: people ranked P0–P3 with the evidence for each, account clusters, the
 * repeating "regulars", and a read of the room vs the LinkedIn Algorithm Report
 * baseline (1 in 3 engagers is Director+).
 *
 * Usage:
 *   node warm-list.mjs engagement.csv --icp icp.json            # markdown report
 *   node warm-list.mjs engagement.csv --icp icp.json --json     # machine-readable
 *   node warm-list.mjs engagement.csv --icp icp.json --csv      # for your CRM
 *   node warm-list.mjs --classify "VP Marketing at Acme | Helping founders scale"
 *
 * CSV columns (header row required; case-insensitive; extras ignored):
 *   name, headline, type (comment|reaction|like|repost|share),
 *   post (id or url), date (YYYY-MM-DD)            ← required
 *   company, profile_url, comment (text)            ← optional
 *
 * ICP file (JSON), every key optional:
 *   { "min_seniority": "director",
 *     "functions": ["marketing", "sales"],
 *     "keywords": ["b2b", "saas"],                  // matched against the headline
 *     "exclude_companies": ["Your Own Co"],
 *     "exclude_keywords": ["student", "recruiter"] }
 *
 * Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const TAXONOMY = JSON.parse(readFileSync(join(HERE, "taxonomy.json"), "utf8"));
const re = (s) => new RegExp(s, "i");
const SENIORITY = TAXONOMY.seniority.map((s) => ({ ...s, res: s.patterns.map(re) }));
const FUNCTIONS = TAXONOMY.function.map((f) => ({ ...f, res: f.patterns.map(re) }));
const IGNORE = TAXONOMY.ignore_segment_patterns.map(re);
const DEMOTE = TAXONOMY.demote_patterns.map(re);
const FLAGS = Object.entries(TAXONOMY.flags).map(([k, v]) => [k, re(v)]);
const RANK = Object.fromEntries([TAXONOMY.default_seniority, ...TAXONOMY.seniority].map((s) => [s.level, s.rank]));

// Report baseline (canonical: skills/linkedin-algorithm): 1 in 3 engagers is Director+.
const BASELINE_DIRECTOR_PLUS = 1 / 3;
// Canonical: 78% of comments are substantive (40+ chars).
const SUBSTANTIVE_CHARS = 40;

/* ------------------------------------------------------------------ classify */

/** Classify a headline off the person's own role, not who they say they help. */
export function classifyHeadline(headline = "") {
  const segments = String(headline)
    .split(/\s*(?:\||•|·|;|—|–|\s\/\s|,)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  let best = { ...TAXONOMY.default_seniority, segment: "" };
  const kept = [];
  for (const seg of segments) {
    if (IGNORE.some((r) => r.test(seg))) continue;
    if (DEMOTE.some((r) => r.test(seg))) continue; // e.g. "Assistant to the CEO" is not the CEO
    kept.push(seg);
    for (const s of SENIORITY) {
      const beats = s.rank > best.rank || (best.level === TAXONOMY.default_seniority.level && s.rank >= best.rank);
      if (beats && s.res.some((r) => r.test(seg))) best = { level: s.level, rank: s.rank, segment: seg };
    }
  }
  const fnSource = [best.segment, ...kept].filter(Boolean);
  let fn = "other";
  outer: for (const seg of fnSource) {
    for (const f of FUNCTIONS) {
      if (f.res.some((r) => r.test(seg))) {
        fn = f.name;
        break outer;
      }
    }
  }
  const flags = FLAGS.filter(([, r]) => r.test(headline)).map(([k]) => k);
  const at = String(headline).match(/(?:\bat\b|@)\s+([^|•·,;]+)/i);
  return {
    seniority: best.level,
    rank: best.rank,
    function: fn,
    company: at ? at[1].trim() : "",
    flags,
  };
}

/* ----------------------------------------------------------------------- csv */

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") row.push(field), (field = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field), rows.push(row), (row = []), (field = "");
    } else field += c;
  }
  if (field || row.length) row.push(field), rows.push(row);
  const nonEmpty = rows.filter((r) => r.some((v) => v.trim()));
  const [header, ...body] = nonEmpty;
  const keys = header.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

/* --------------------------------------------------------------------- score */

const DEPTH = { comment: 3, repost: 2, share: 2, reaction: 1, like: 1 };

function normType(t) {
  const s = String(t || "").toLowerCase();
  if (s.startsWith("comment") || s === "reply") return "comment";
  if (s.startsWith("repost") || s.startsWith("share")) return "repost";
  return "reaction";
}

function recencyWeight(days) {
  if (days <= 14) return 1;
  if (days <= 30) return 0.8;
  if (days <= 60) return 0.6;
  if (days <= 90) return 0.4;
  return 0.2;
}

function icpFit(person, icp) {
  const parts = [];
  const why = [];
  if (icp.min_seniority) {
    const ok = person.rank >= (RANK[icp.min_seniority] ?? 0);
    parts.push([0.5, ok]);
    if (ok) why.push(`${person.seniority} ≥ ${icp.min_seniority}`);
  }
  if (icp.functions?.length) {
    const ok = icp.functions.includes(person.function) || (person.function === "executive" && person.rank >= 4);
    parts.push([0.3, ok]);
    if (ok) why.push(`function: ${person.function}`);
  }
  if (icp.keywords?.length) {
    const hit = icp.keywords.find((k) => person.headline.toLowerCase().includes(k.toLowerCase()));
    parts.push([0.2, Boolean(hit)]);
    if (hit) why.push(`keyword: ${hit}`);
  }
  const excludedCo = (icp.exclude_companies || []).some((c) => person.company.toLowerCase() === c.toLowerCase());
  const excludedKw = (icp.exclude_keywords || []).find((k) => person.headline.toLowerCase().includes(k.toLowerCase()));
  if (excludedCo || excludedKw) return { fit: 0, why: [excludedCo ? "excluded company" : `excluded: ${excludedKw}`] };
  if (!parts.length) return { fit: 1, why: ["no ICP given"] };
  const total = parts.reduce((s, [w]) => s + w, 0);
  const got = parts.reduce((s, [w, ok]) => s + (ok ? w : 0), 0);
  return { fit: Math.round((got / total) * 100) / 100, why };
}

/**
 * Build the warm list. `events` are parsed CSV rows; `icp` is the ICP object.
 * Returns { asOf, people, clusters, room }.
 */
export function buildWarmList(events, icp = {}, opts = {}) {
  const dates = events.map((e) => Date.parse(e.date)).filter((d) => !Number.isNaN(d));
  const asOf = opts.asOf ? Date.parse(opts.asOf) : Math.max(...dates);
  const byPerson = new Map();
  for (const e of events) {
    if (!e.name) continue;
    const key = (e.profile_url || e.name).toLowerCase();
    if (!byPerson.has(key)) {
      const c = classifyHeadline(e.headline);
      byPerson.set(key, {
        name: e.name,
        headline: e.headline || "",
        profile_url: e.profile_url || "",
        company: e.company || c.company,
        seniority: c.seniority,
        rank: c.rank,
        function: c.function,
        flags: c.flags,
        comments: 0,
        substantive: 0,
        reposts: 0,
        reactions: 0,
        posts: new Set(),
        last: 0,
        bestComment: "",
      });
    }
    const p = byPerson.get(key);
    const t = normType(e.type);
    if (t === "comment") {
      p.comments++;
      const len = (e.comment || "").length;
      if (len >= SUBSTANTIVE_CHARS) p.substantive++;
      if (len > p.bestComment.length) p.bestComment = e.comment;
    } else if (t === "repost") p.reposts++;
    else p.reactions++;
    if (e.post) p.posts.add(e.post);
    const d = Date.parse(e.date);
    if (!Number.isNaN(d) && d > p.last) p.last = d;
  }

  // Account clusters: 3+ distinct engagers from the same company.
  const byCompany = new Map();
  for (const p of byPerson.values()) {
    if (!p.company) continue;
    const k = p.company.toLowerCase();
    if (!byCompany.has(k)) byCompany.set(k, { company: p.company, people: [] });
    byCompany.get(k).people.push(p.name);
  }
  const clusterSet = new Set([...byCompany.entries()].filter(([, v]) => v.people.length >= 3).map(([k]) => k));

  const people = [...byPerson.values()].map((p) => {
    const days = p.last ? Math.floor((asOf - p.last) / 86400000) : 999;
    const depth = p.comments * DEPTH.comment + p.substantive + p.reposts * DEPTH.repost + p.reactions * DEPTH.reaction;
    const signal = Math.round(depth * recencyWeight(days) * 10) / 10;
    const regular = p.posts.size >= 3;
    const cluster = clusterSet.has(p.company.toLowerCase());
    const { fit, why } = icpFit(p, icp);

    let tier = "P3";
    if (fit >= 0.8 && ((p.substantive > 0 && days <= 30) || regular)) tier = "P0";
    else if (fit >= 0.5 && (p.comments > 0 || regular || cluster)) tier = "P1";
    else if (fit >= 0.5) tier = "P2";

    const evidence = [
      p.comments ? `${p.comments} comment${p.comments > 1 ? "s" : ""}${p.substantive ? ` (${p.substantive} substantive)` : ""}` : null,
      p.reposts ? `${p.reposts} repost${p.reposts > 1 ? "s" : ""}` : null,
      p.reactions ? `${p.reactions} reaction${p.reactions > 1 ? "s" : ""}` : null,
      `${p.posts.size} post${p.posts.size === 1 ? "" : "s"}`,
      `last ${days}d ago`,
      regular ? "REGULAR" : null,
      cluster ? `ACCOUNT CLUSTER (${p.company})` : null,
      ...p.flags.map((f) => f.toUpperCase().replace(/_/g, " ")),
    ].filter(Boolean);

    return {
      tier,
      name: p.name,
      headline: p.headline,
      company: p.company,
      seniority: p.seniority,
      function: p.function,
      flags: p.flags,
      fit,
      fit_reasons: why,
      signal,
      regular,
      cluster,
      days_since: days,
      evidence: evidence.join(" · "),
      best_comment: p.bestComment,
      profile_url: p.profile_url,
      play: PLAY[tier](p, regular, cluster),
    };
  });

  const order = { P0: 0, P1: 1, P2: 2, P3: 3 };
  people.sort((a, b) => order[a.tier] - order[b.tier] || b.fit - a.fit || b.signal - a.signal || a.name.localeCompare(b.name));

  const clusters = [...byCompany.values()]
    .filter((v) => v.people.length >= 3)
    .sort((a, b) => b.people.length - a.people.length);

  const n = people.length || 1;
  const directorPlus = people.filter((p) => RANK[p.seniority] >= RANK.director).length / n;
  const icpShare = people.filter((p) => p.fit >= 0.5).length / n;
  const commenters = people.filter((p) => p.evidence.includes("comment"));
  const likersOnly = people.filter((p) => !p.evidence.includes("comment"));
  const dp = (arr) => (arr.length ? arr.filter((p) => RANK[p.seniority] >= RANK.director).length / arr.length : null);
  const room = {
    engagers: people.length,
    director_plus: round(directorPlus),
    baseline_director_plus: round(BASELINE_DIRECTOR_PLUS),
    vs_baseline: directorPlus >= BASELINE_DIRECTOR_PLUS ? "above" : "below",
    icp_share: round(icpShare),
    commenters_director_plus: dp(commenters) === null ? null : round(dp(commenters)),
    non_commenters_director_plus: dp(likersOnly) === null ? null : round(dp(likersOnly)),
    regulars: people.filter((p) => p.regular).length,
    tiers: Object.fromEntries(["P0", "P1", "P2", "P3"].map((t) => [t, people.filter((p) => p.tier === t).length])),
  };

  return { asOf: new Date(asOf).toISOString().slice(0, 10), people, clusters, room };
}

const PLAY = {
  P0: (p, regular) =>
    regular ? "Regular-engager DM: name the pattern, invite the conversation" : "Warm-signal DM: reference their exact comment, one idea, small ask",
  P1: (p, regular, cluster) =>
    cluster ? "Account-cluster ABM: multi-thread with the others at this company" : "Warm-signal DM after one more genuine reply to their comment",
  P2: () => "Nurture: reply to their next comment; no sequence yet",
  P3: () => "Do not sequence",
};

const round = (x) => Math.round(x * 1000) / 1000;
const pct = (x) => `${Math.round(x * 100)}%`;

/* -------------------------------------------------------------------- output */

export function toMarkdown(result, { limit = 50 } = {}) {
  const { room, people, clusters, asOf } = result;
  const out = [];
  out.push(`# Warm list — as of ${asOf}`, "");
  out.push("## Read the room", "");
  out.push(`- **${room.engagers}** unique engagers · **${pct(room.director_plus)}** Director+ (report baseline: ${pct(room.baseline_director_plus)} — you are **${room.vs_baseline}**)`);
  out.push(`- **${pct(room.icp_share)}** fit your ICP · **${room.regulars}** regulars (3+ posts)`);
  if (room.commenters_director_plus !== null && room.non_commenters_director_plus !== null)
    out.push(`- Director+ among commenters **${pct(room.commenters_director_plus)}** vs non-commenters **${pct(room.non_commenters_director_plus)}** (report: commenters skew 26% more senior)`);
  out.push(`- Tiers: P0 **${room.tiers.P0}** · P1 **${room.tiers.P1}** · P2 **${room.tiers.P2}** · P3 **${room.tiers.P3}**`, "");
  if (clusters.length) {
    out.push("## Account clusters (3+ engagers, one company)", "");
    for (const c of clusters) out.push(`- **${c.company}** — ${c.people.length}: ${c.people.join(", ")}`);
    out.push("");
  }
  out.push("## Ranked list", "");
  out.push("| Tier | Name | Seniority · Function | Company | Fit | Evidence | Play |", "|---|---|---|---|---|---|---|");
  for (const p of people.filter((p) => p.tier !== "P3").slice(0, limit)) {
    out.push(`| ${p.tier} | ${esc(p.name)} | ${p.seniority} · ${p.function} | ${esc(p.company)} | ${p.fit} | ${esc(p.evidence)} | ${p.play} |`);
  }
  const p3 = people.filter((p) => p.tier === "P3").length;
  if (p3) out.push("", `_${p3} P3 engager${p3 > 1 ? "s" : ""} omitted — no sequence._`);
  out.push("", "_Human gate: nothing here is sent automatically. Read their comment before you write._");
  return out.join("\n");
}

const esc = (s) => String(s || "").replace(/\|/g, "\\|");

export function toCsv(result) {
  const cols = ["tier", "name", "company", "seniority", "function", "fit", "signal", "regular", "cluster", "days_since", "evidence", "play", "profile_url"];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...result.people.map((p) => cols.map((c) => q(p[c])).join(","))].join("\n");
}

/* ---------------------------------------------------------------------- main */

function main(argv) {
  const args = argv.slice(2);
  const val = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined);
  if (args.includes("--classify")) {
    console.log(JSON.stringify(classifyHeadline(val("--classify")), null, 2));
    return;
  }
  const file = args.find((a, i) => !a.startsWith("--") && !["--icp", "--as-of", "--limit"].includes(args[i - 1]));
  if (!file || args.includes("--help")) {
    console.error("usage: warm-list.mjs <engagement.csv> [--icp icp.json] [--as-of YYYY-MM-DD] [--json | --csv] [--limit N]\n       warm-list.mjs --classify \"<headline>\"");
    process.exit(2);
  }
  const events = parseCsv(readFileSync(file, "utf8"));
  const icp = val("--icp") ? JSON.parse(readFileSync(val("--icp"), "utf8")) : {};
  const result = buildWarmList(events, icp, { asOf: val("--as-of") });
  if (args.includes("--json")) console.log(JSON.stringify(result, null, 2));
  else if (args.includes("--csv")) console.log(toCsv(result));
  else console.log(toMarkdown(result, { limit: Number(val("--limit")) || 50 }));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

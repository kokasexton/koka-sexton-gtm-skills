#!/usr/bin/env node
/**
 * social-selling-routine — turn the five daily surfaces into one prioritized digest.
 *
 * Input: one CSV of the people seen across the routine's surfaces (profile views,
 * your posts' engagers last 24h, company-page engagers, new followers), plus the
 * key-account post checks. Output: a single markdown digest — who to connect with,
 * comment on, and DM, each with the evidence — plus a "skipped" line so the ICP
 * filter is visible. Draft-only: this tool never sends and never writes to LinkedIn.
 *
 * Usage:
 *   node social-selling-routine.mjs pool.csv --icp icp.json --as-of 2026-11-15
 *   node social-selling-routine.mjs pool.csv --icp icp.json --json
 *   node social-selling-routine.mjs pool.csv --icp icp.json --csv
 *
 * CSV columns (header row required; case-insensitive; extras ignored):
 *   name, headline, source, type, date            ← required
 *     source: profile_view | own_post | company_page | follower
 *     type:   comment | reaction | like | repost | share | view | follow
 *   company, profile_url, comment, post           ← optional
 *   key_account, last_post_topic, last_post_date  ← optional (for the watch list)
 *
 * ICP file: same shape as warm-list (JSON, every key optional).
 * Zero dependencies. Node 18+. Reuses the warm-list engine.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv, buildWarmList } from "../../warm-list/scripts/warm-list.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

const SURFACES = new Set(["profile_view", "own_post", "company_page", "follower"]);
const MOVE = {
  profile_view: "Connect + note",
  own_post: "Reply / DM",
  company_page: "Connect + note",
  follower: "Warm DM",
};

function normSource(s) {
  const v = String(s || "").toLowerCase().replace(/[\s-]+/g, "_");
  if (SURFACES.has(v)) return v;
  if (v === "profileview" || v === "views") return "profile_view";
  if (v === "ownpost" || v === "post" || v === "my_post") return "own_post";
  if (v === "companypage" || v === "company") return "company_page";
  if (v === "followers" || v === "new_follower") return "follower";
  return "own_post";
}

/**
 * Build the routine digest. `events` are parsed CSV rows; `icp` is the ICP object.
 * Returns { asOf, digest, ranked, keyAccounts, skipped }.
 */
export function buildRoutine(events, icp = {}, opts = {}) {
  // Surface 5 (key-account members who posted) is a watch list, not a ranked person.
  const rows = events.filter((e) => e.name && !e.key_account);
  const watchRows = events.filter((e) => e.key_account && e.last_post_topic);

  // Rank the combined pool (surfaces 1–4) with the warm-list engine.
  const pool = rows.map((e) => ({
    name: e.name,
    headline: e.headline,
    type: normSource(e.source) === "own_post" ? e.type : (normSource(e.source) === "follower" ? "follow" : "view"),
    post: e.post || "",
    date: e.date,
    company: e.company,
    profile_url: e.profile_url,
    comment: e.comment,
  }));
  const result = buildWarmList(pool, icp, opts);

  // Which surface(s) each person appeared on, and their lead source.
  const seen = new Map();
  for (const e of rows) {
    const key = (e.profile_url || e.name).toLowerCase();
    if (!seen.has(key)) seen.set(key, { name: e.name, sources: new Set(), comment: "" });
    const s = seen.get(key);
    s.sources.add(normSource(e.source));
    if ((e.comment || "").length > s.comment.length) s.comment = e.comment;
  }

  const ranked = result.people
    .filter((p) => p.fit >= 0.5) // ICP filter is mandatory — no fit, no queue
    .map((p) => {
      const key = (p.profile_url || p.name).toLowerCase();
      const s = seen.get(key) || { sources: new Set(["own_post"]), comment: "" };
      const lead = [...s.sources].sort((a, b) => (a === "own_post" ? -1 : 0))[0];
      return { ...p, sources: [...s.sources], lead, move: MOVE[lead] || "Warm DM", draft: p.best_comment || s.comment || "" };
    });

  const skipped = rows.length - ranked.length;

  // Key-account watch: members who posted recently (surface 5).
  const keyAccounts = watchRows.map((e) => ({
    account: e.key_account, name: e.name, topic: e.last_post_topic, date: e.last_post_date || e.date,
  }));

  return { asOf: result.asOf, room: result.room, ranked, keyAccounts, skipped, seen: rows.length };
}

export function toMarkdown(d, { limit = 12 } = {}) {
  const date = new Date(d.asOf).toISOString().slice(0, 10);
  const L = [];
  L.push(`# Social selling routine — ${date}`, "");
  const r = d.room;
  if (r && typeof r === "object") {
    const dp = Math.round((r.director_plus || 0) * 100);
    const base = Math.round((r.baseline_director_plus || 0) * 100);
    const t = r.tiers || {};
    L.push(
      `## Read the room`,
      "",
      `- ${r.engagers} in the room · ${dp}% Director+ (report baseline ${base}% — you are ${r.vs_baseline}) · ${Math.round((r.icp_share || 0) * 100)}% fit the ICP · ${r.regulars} regulars`,
      `- Tiers: P0 ${t.P0 || 0} · P1 ${t.P1 || 0} · P2 ${t.P2 || 0} · P3 ${t.P3 || 0}`,
      ""
    );
  } else if (d.room) {
    L.push(`## Read the room`, "", `- ${d.room}`, "");
  }
  L.push(`## Do these today (ranked)`, "");
  if (!d.ranked.length) {
    L.push(`_No one in this pass fits the ICP. That is a result, not a failure._`, "");
  } else {
    L.push(`| # | Person | Why (evidence) | Move | Draft |`, `|---|---|---|---|---|`);
    d.ranked.slice(0, limit).forEach((p, i) => {
      const co = p.company ? ` @ ${p.company}` : "";
      const why = `${p.tier} · ${p.evidence}`;
      const draft = (p.draft && !/^https?:/.test(p.draft) ? p.draft : "").replace(/\|/g, "\\|").slice(0, 90);
      L.push(`| ${i + 1} | ${p.name}, ${p.seniority}${co} | ${why} | ${p.move} | ${draft} |`);
    });
    L.push("");
  }
  L.push(`## Key-account watch`, "");
  if (!d.keyAccounts.length) L.push(`- Nothing to engage this pass.`, "");
  else for (const k of d.keyAccounts) L.push(`- **${k.account}** — ${k.name} posted about ${k.topic} (${k.date}) → comment drafted`);
  L.push("");
  L.push(`## Skipped (and why)`, "", `- ${d.seen} seen across the pass · ${d.skipped} outside ICP or too stale.`, "");
  if (d.keyAccounts?.length) L.push("");
  L.push(`_Draft-only. The human posts every item above._`);
  return L.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  const icpPath = args.includes("--icp") ? args[args.indexOf("--icp") + 1] : null;
  const asOf = args.includes("--as-of") ? args[args.indexOf("--as-of") + 1] : undefined;
  const json = args.includes("--json");
  const csv = args.includes("--csv");
  if (!file) {
    console.error("usage: social-selling-routine.mjs pool.csv [--icp icp.json] [--as-of YYYY-MM-DD] [--json|--csv]");
    process.exit(2);
  }
  const events = parseCsv(readFileSync(file, "utf8"));
  const icp = icpPath ? JSON.parse(readFileSync(icpPath, "utf8")) : {};
  const digest = buildRoutine(events, icp, { asOf });
  if (json) console.log(JSON.stringify(digest, null, 2));
  else if (csv) {
    const rows = [["tier", "name", "seniority", "function", "company", "move", "evidence"]];
    for (const p of digest.ranked) rows.push([p.tier, p.name, p.seniority, p.function, p.company, p.move, p.evidence]);
    console.log(rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n"));
  } else console.log(toMarkdown(digest));
}

if (import.meta.url === `file://${process.argv[1]}`) main(process.argv);

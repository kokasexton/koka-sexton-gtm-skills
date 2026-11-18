#!/usr/bin/env node
/**
 * signal-model — score people by compound social signal, then tier them.
 *
 *   Signal Score = follow x 1.5 + reaction diversity x 2 + recency + coverage + density
 *
 * One row per engagement event. Events are grouped per person. Tiers:
 *   0-3 COLD, 4-7 WARMING, 8-12 HOT, 13+ URGENT.
 *
 * Two gates sit on top of the score (Koka defaults, not benchmark data):
 *   - Second-signal gate: without a comment, repost, or a `second_signal` flag,
 *     a person is capped at WARMING. A follow or a like alone never earns outreach.
 *   - Fit gate: if a `fit` column (0-100) is present and below --min-fit
 *     (default 40), the person is held out of outreach.
 *
 * Usage:
 *   node signal-model.mjs events.csv [--as-of YYYY-MM-DD] [--min-fit N] [--company-page NAME] [--json | --csv]
 *
 * CSV columns: name, company, type, owner, date  (required)
 *              title, fit, second_signal, profile_url (optional)
 * type: like, insight, love, celebrate, support, funny, comment, repost, follow
 * owner: whose content or profile it was. A follow whose owner equals
 *        --company-page (default "company") counts as a company-page follow.
 *
 * Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { classifyHeadline, parseCsv } from "../../warm-list/scripts/warm-list.mjs";

export const REACTIONS = ["like", "insight", "love", "celebrate", "support", "funny"];
export const TIERS = [
  { min: 13, tier: "URGENT", play: "Same day. Reference the exact engagement. Multiple signals from several people mean organizational intent." },
  { min: 8, tier: "HOT", play: "Reach out within 72 hours. Reference the specific engagement. No pitch on the first touch." },
  { min: 4, tier: "WARMING", play: "Engage with their content. Do not pitch. Wait for a second signal." },
  { min: 0, tier: "COLD", play: "Track only. No outreach." },
];

const day = 86400000;
const toDate = (s) => new Date(`${String(s).slice(0, 10)}T00:00:00Z`);

export function followPoints(count, companyPage) {
  if (companyPage && count >= 1) return 5;
  if (count >= 2) return 3;
  if (count === 1) return 1;
  return 0;
}
export function diversityPoints(types) {
  const r = new Set(types.filter((t) => REACTIONS.includes(t)));
  if (r.has("insight")) return 5;
  if (r.size >= 2) return 3;
  if (r.size === 1) return 1;
  return 0;
}
export function recencyPoints(ageDays) {
  if (ageDays <= 7) return 3;
  if (ageDays <= 14) return 2;
  if (ageDays <= 30) return 1;
  return 0;
}
export function coveragePoints(owners) {
  return owners >= 2 ? 3 : owners === 1 ? 1 : 0;
}
export function densityPoints(people, hasSenior) {
  if (people >= 3 && hasSenior) return 5;
  if (people >= 2) return 3;
  return 1;
}
export function tierFor(score) {
  return TIERS.find((t) => score >= t.min);
}

export function scoreEvents(events, opts = {}) {
  const asOf = toDate(opts.asOf || new Date().toISOString().slice(0, 10));
  const minFit = opts.minFit ?? 40;
  const companyPageName = (opts.companyPage || "company").toLowerCase();

  const byPerson = new Map();
  for (const e of events) {
    const name = (e.name || "").trim();
    if (!name || !e.type || !e.date) continue;
    const key = (e.profile_url || "").trim() || `${name.toLowerCase()}|${(e.company || "").toLowerCase()}`;
    if (!byPerson.has(key)) byPerson.set(key, { name, company: (e.company || "").trim(), title: e.title || "", fit: null, secondFlag: false, profile_url: e.profile_url || "", rows: [] });
    const p = byPerson.get(key);
    if (e.title && !p.title) p.title = e.title;
    if (e.fit !== undefined && e.fit !== "") p.fit = Number(e.fit);
    if (/^(yes|true|1)$/i.test(e.second_signal || "")) p.secondFlag = true;
    p.rows.push({ type: e.type.toLowerCase().trim(), owner: (e.owner || "").trim(), date: toDate(e.date) });
  }

  const people = [...byPerson.values()];
  for (const p of people) {
    const follows = p.rows.filter((r) => r.type === "follow");
    const companyPage = follows.some((r) => r.owner.toLowerCase() === companyPageName);
    const execFollows = new Set(follows.filter((r) => r.owner.toLowerCase() !== companyPageName).map((r) => r.owner.toLowerCase())).size;
    p.followPts = followPoints(execFollows, companyPage);
    p.diversityPts = diversityPoints(p.rows.map((r) => r.type));
    const latest = Math.max(...p.rows.map((r) => r.date.getTime()));
    p.last = new Date(latest).toISOString().slice(0, 10);
    p.age_days = Math.max(0, Math.round((asOf.getTime() - latest) / day));
    p.recencyPts = recencyPoints(p.age_days);
    const owners = new Set(p.rows.filter((r) => r.type !== "follow" && r.owner).map((r) => r.owner.toLowerCase()));
    p.coveragePts = coveragePoints(owners.size);
    p.seniority = classifyHeadline(p.title).seniority;
    p.senior = classifyHeadline(p.title).rank >= 3;
    p.second = p.secondFlag || p.rows.some((r) => r.type === "comment" || r.type === "repost");
  }
  const byCompany = new Map();
  for (const p of people) {
    if (!p.company) continue;
    const k = p.company.toLowerCase();
    byCompany.set(k, [...(byCompany.get(k) || []), p]);
  }
  for (const p of people) {
    const group = p.company ? byCompany.get(p.company.toLowerCase()) : [p];
    p.densityPts = densityPoints(group.length, group.some((g) => g.senior));
    p.score = round(p.followPts * 1.5 + p.diversityPts * 2 + p.recencyPts + p.coveragePts + p.densityPts);
    const raw = tierFor(p.score);
    let tier = raw.tier;
    const notes = [];
    if (!p.second && (tier === "HOT" || tier === "URGENT")) {
      tier = "WARMING";
      notes.push("capped: no second signal (comment, repost, or flag)");
    }
    let action = TIERS.find((t) => t.tier === tier).play;
    if (p.fit !== null && p.fit < minFit) {
      action = "Hold. Below the fit gate, so no outreach however strong the signal.";
      notes.push(`fit ${p.fit} < ${minFit}`);
      p.held = true;
    }
    p.tier = tier;
    p.play = action;
    p.notes = notes;
    p.strongest = strongest(p);
  }
  const order = { URGENT: 0, HOT: 1, WARMING: 2, COLD: 3 };
  people.sort((a, b) => Number(a.held || 0) - Number(b.held || 0) || order[a.tier] - order[b.tier] || b.score - a.score || (b.fit ?? 0) - (a.fit ?? 0));
  const counts = { URGENT: 0, HOT: 0, WARMING: 0, COLD: 0, held: 0 };
  for (const p of people) { counts[p.tier]++; if (p.held) counts.held++; }
  return { as_of: asOf.toISOString().slice(0, 10), counts, people: people.map(clean) };
}

const round = (n) => Math.round(n * 10) / 10;

function strongest(p) {
  if (p.rows.some((r) => r.type === "comment")) return "commented";
  if (p.rows.some((r) => r.type === "repost")) return "reposted";
  if (p.rows.some((r) => r.type === "insight")) return "Insight reaction";
  if (p.followPts >= 3) return "follows several of your people";
  if (p.followPts) return "follows";
  return "reacted";
}
function clean(p) {
  return {
    name: p.name, title: p.title, company: p.company, tier: p.tier, score: p.score,
    breakdown: { follow: p.followPts, diversity: p.diversityPts, recency: p.recencyPts, coverage: p.coveragePts, density: p.densityPts },
    fit: p.fit, last_signal: p.last, age_days: p.age_days, strongest: p.strongest,
    second_signal: p.second, held: Boolean(p.held), notes: p.notes, play: p.play, profile_url: p.profile_url,
  };
}

export function toMarkdown(r) {
  const c = r.counts;
  const lines = [
    `# Signal model, as of ${r.as_of}`,
    `${r.people.length} people. URGENT ${c.URGENT}, HOT ${c.HOT}, WARMING ${c.WARMING}, COLD ${c.COLD}. Held by fit gate: ${c.held}.`,
    "",
    "| # | Name | Company | Tier | Score | Fit | Strongest signal | Last | Notes |",
    "|---|---|---|---|---|---|---|---|---|",
  ];
  r.people.forEach((p, i) => lines.push(`| ${i + 1} | ${p.name} | ${p.company || "-"} | ${p.held ? "HOLD" : p.tier} | ${p.score} | ${p.fit ?? "-"} | ${p.strongest} | ${p.last_signal} | ${p.notes.join("; ") || "-"} |`));
  lines.push("", "Weights, tiers and gates are Koka defaults, not benchmark data. Re-weight them from which signals became meetings. Nothing is auto-sent.");
  return lines.join("\n");
}
export function toCsv(r) {
  const cols = ["name", "title", "company", "tier", "score", "fit", "strongest", "last_signal", "held", "profile_url"];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...r.people.map((p) => cols.map((c) => q(p[c])).join(","))].join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const val = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : undefined);
  const file = args.find((a, i) => !a.startsWith("--") && !["--as-of", "--min-fit", "--company-page"].includes(args[i - 1]));
  if (!file || args.includes("--help")) {
    console.error("usage: signal-model.mjs <events.csv> [--as-of YYYY-MM-DD] [--min-fit N] [--company-page NAME] [--json | --csv]");
    process.exit(2);
  }
  const r = scoreEvents(parseCsv(readFileSync(file, "utf8")), { asOf: val("--as-of"), minFit: val("--min-fit") ? Number(val("--min-fit")) : undefined, companyPage: val("--company-page") });
  if (args.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else if (args.includes("--csv")) console.log(toCsv(r));
  else console.log(toMarkdown(r));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

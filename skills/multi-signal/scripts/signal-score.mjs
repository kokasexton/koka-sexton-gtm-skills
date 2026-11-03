#!/usr/bin/env node
/**
 * signal-score — stack account-level buying signals into one priority.
 *
 * Every signal decays with age (default half-life 30 days). Distinct signal
 * types stack, and three or more different kinds earn a bonus. The timing score
 * is combined with ICP fit to give an action tier:
 *   ACT NOW   timing ≥ 50 and fit ≥ 60
 *   WARM UP   timing ≥ 20 and fit ≥ 40
 *   WATCH     any signal and fit ≥ 40
 *   IGNORE    otherwise
 *
 * Weights and thresholds are Koka's defaults — not benchmark data. Override
 * with --weights weights.json ({ "funding": 30, ... }).
 *
 * Usage:
 *   node signal-score.mjs signals.csv [--as-of YYYY-MM-DD] [--weights w.json] [--json]
 *
 * CSV columns: account, signal, date, detail (optional), fit (0–100, optional),
 *              domain (optional)
 * Signal types: job-change, funding, hiring, website-pricing, website-visit,
 *   company-event, tech-change, competitor, content-comment, content-repeat,
 *   content-reaction, ad-engagement, event-attended
 *
 * Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const DEFAULT_WEIGHTS = {
  "job-change": 25,
  funding: 20,
  hiring: 20,
  "website-pricing": 25,
  "website-visit": 8,
  "company-event": 15,
  "tech-change": 20,
  competitor: 25,
  "content-comment": 25,
  "content-repeat": 30,
  "content-reaction": 6,
  "ad-engagement": 10,
  "event-attended": 15,
};

const PLAY = {
  "job-change": "New-leader play: something useful for their first-90-day plan (skills/job-changes)",
  funding: "Funding play: write to the leader the money is for (skills/funding-signals)",
  hiring: "Hiring play: write to the outcome the role is for (skills/hiring-signals)",
  "website-pricing": "Intent play: write about the topic they researched, never the visit (skills/website-visitors)",
  "website-visit": "Warm with content; wait for a stronger signal",
  "company-event": "Event play: the work the event creates (skills/company-events)",
  "tech-change": "Switch-moment play (skills/tech-changes)",
  competitor: "Honest comparison play (skills/competitor-signals)",
  "content-comment": "Warm DM on the exact exchange (skills/content-engagement)",
  "content-repeat": "Regular-engager play: name the pattern (skills/warm-list)",
  "content-reaction": "Reply to their next comment; no sequence yet",
  "ad-engagement": "Continue the ad's story in outreach (skills/ads-outbound-sync)",
  "event-attended": "Follow up on the session's topic with one useful asset",
};

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
  const [header, ...body] = rows.filter((r) => r.some((v) => v.trim()));
  const keys = header.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

const DAY = 86400000;

export function scoreSignals(rows, opts = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...(opts.weights || {}) };
  const halfLife = opts.halfLife || 30;
  const dates = rows.map((r) => Date.parse(r.date)).filter((d) => !Number.isNaN(d));
  const asOf = opts.asOf ? Date.parse(opts.asOf) : Math.max(...dates);
  const unknown = new Set();

  const accounts = new Map();
  for (const r of rows) {
    if (!r.account) continue;
    const key = r.account.toLowerCase();
    if (!accounts.has(key)) accounts.set(key, { account: r.account, fit: null, signals: [] });
    const a = accounts.get(key);
    if (r.fit !== undefined && r.fit !== "") a.fit = Number(r.fit);
    const type = String(r.signal || "").toLowerCase();
    if (!(type in weights)) {
      unknown.add(type);
      continue;
    }
    const days = Math.max(0, Math.floor((asOf - Date.parse(r.date)) / DAY));
    const points = weights[type] * Math.pow(0.5, days / halfLife);
    a.signals.push({ type, date: r.date, days, detail: r.detail || "", points: Math.round(points * 10) / 10 });
  }

  const out = [...accounts.values()].map((a) => {
    // Per type, keep the strongest instance in full and add half of each repeat.
    const byType = new Map();
    for (const s of a.signals) {
      if (!byType.has(s.type)) byType.set(s.type, []);
      byType.get(s.type).push(s.points);
    }
    let timing = 0;
    for (const pts of byType.values()) {
      pts.sort((x, y) => y - x);
      timing += pts[0] + pts.slice(1).reduce((s, p) => s + p * 0.5, 0);
    }
    const kinds = byType.size;
    if (kinds >= 3) timing *= 1.25;
    timing = Math.min(100, Math.round(timing));
    const fit = a.fit ?? 50;

    let action = "IGNORE";
    if (timing >= 50 && fit >= 60) action = "ACT NOW";
    else if (timing >= 20 && fit >= 40) action = "WARM UP";
    else if (a.signals.length && fit >= 40) action = "WATCH";

    const top = [...a.signals].sort((x, y) => y.points - x.points)[0];
    return {
      action,
      account: a.account,
      fit,
      fit_known: a.fit !== null,
      timing,
      kinds,
      stacked: kinds >= 3,
      signals: a.signals.sort((x, y) => y.points - x.points),
      lead_signal: top ? top.type : null,
      play: top ? PLAY[top.type] : "No signal",
    };
  });

  const order = { "ACT NOW": 0, "WARM UP": 1, WATCH: 2, IGNORE: 3 };
  out.sort((x, y) => order[x.action] - order[y.action] || y.timing * y.fit - x.timing * x.fit || x.account.localeCompare(y.account));
  const counts = Object.fromEntries(Object.keys(order).map((k) => [k, out.filter((a) => a.action === k).length]));
  return { asOf: new Date(asOf).toISOString().slice(0, 10), counts, accounts: out, unknown_signals: [...unknown] };
}

export function toMarkdown(r) {
  const out = [`# Signal priorities — as of ${r.asOf}`, ""];
  out.push(`ACT NOW **${r.counts["ACT NOW"]}** · WARM UP **${r.counts["WARM UP"]}** · WATCH **${r.counts.WATCH}** · IGNORE **${r.counts.IGNORE}**`, "");
  out.push("| Action | Account | Fit | Timing | Signals (strongest first) | Play |", "|---|---|---|---|---|---|");
  for (const a of r.accounts) {
    const sig = a.signals.map((s) => `${s.type} (${s.days}d${s.detail ? `: ${s.detail}` : ""})`).join("; ") || "—";
    out.push(`| ${a.action} | ${a.account} | ${a.fit}${a.fit_known ? "" : "?"} | ${a.timing}${a.stacked ? " ⧉" : ""} | ${sig} | ${a.play} |`);
  }
  out.push("", "⧉ = 3+ different kinds of signal (stacked bonus). `?` = fit not given; assumed 50.");
  if (r.unknown_signals.length) out.push("", `Ignored unknown signal types: ${r.unknown_signals.join(", ")}`);
  out.push("", "_Weights are Koka's defaults, not benchmark data. Re-weight from which signals actually became meetings._");
  return out.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const val = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : undefined);
  const file = args.find((a, i) => !a.startsWith("--") && !["--as-of", "--weights"].includes(args[i - 1]));
  if (!file || args.includes("--help")) {
    console.error("usage: signal-score.mjs <signals.csv> [--as-of YYYY-MM-DD] [--weights w.json] [--json]");
    process.exit(2);
  }
  const weights = val("--weights") ? JSON.parse(readFileSync(val("--weights"), "utf8")) : undefined;
  const r = scoreSignals(parseCsv(readFileSync(file, "utf8")), { asOf: val("--as-of"), weights });
  console.log(args.includes("--json") ? JSON.stringify(r, null, 2) : toMarkdown(r));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

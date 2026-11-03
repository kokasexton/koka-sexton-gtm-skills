#!/usr/bin/env node
/**
 * pipeline-math — outbound funnel arithmetic on YOUR numbers.
 *
 *   rates   counts → conversion rates (your baseline)
 *   plan    target + your rates → the activity and reps it takes, plus which
 *           rates are most sensitive (+1 point each)
 *
 * There are deliberately NO default conversion rates: industry "benchmarks"
 * vary too much to plan on. Measure your own with `rates`, then plan with them.
 *
 * Usage:
 *   node pipeline-math.mjs rates counts.json
 *   node pipeline-math.mjs plan plan.json
 *   (add --json for machine-readable output)
 *
 * counts.json: { "sent", "bounced", "replied", "positive", "meetings_booked",
 *                "meetings_held", "opportunities", "won"? }
 * plan.json:   { "target": { "opportunities" } | { "pipeline", "avg_opportunity" },
 *                "rates": { "deliverable", "reply", "positive", "booked", "held", "opportunity" },
 *                "touches_per_person"?, "capacity"?: { "sends_per_rep_per_day", "working_days" } }
 *
 * Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const STAGES = [
  ["deliverable", "sent → delivered"],
  ["reply", "delivered → replied"],
  ["positive", "replied → positive reply"],
  ["booked", "positive → meeting booked"],
  ["held", "booked → meeting held"],
  ["opportunity", "held → opportunity"],
];

const r3 = (x) => Math.round(x * 1000) / 1000;
const pct = (x) => `${(x * 100).toFixed(1)}%`;

/** Counts → stage rates. */
export function ratesFromCounts(c) {
  const need = ["sent", "bounced", "replied", "positive", "meetings_booked", "meetings_held", "opportunities"];
  const missing = need.filter((k) => typeof c[k] !== "number");
  if (missing.length) throw new Error(`counts missing: ${missing.join(", ")}`);
  const delivered = c.sent - c.bounced;
  const div = (a, b) => (b > 0 ? r3(a / b) : 0);
  const rates = {
    deliverable: div(delivered, c.sent),
    reply: div(c.replied, delivered),
    positive: div(c.positive, c.replied),
    booked: div(c.meetings_booked, c.positive),
    held: div(c.meetings_held, c.meetings_booked),
    opportunity: div(c.opportunities, c.meetings_held),
  };
  const health = [];
  if (c.sent > 0 && c.bounced / c.sent > 0.02) health.push(`Bounce rate ${pct(c.bounced / c.sent)}. Stop and re-verify the list before the next send (skills/clean-validate).`);
  if (rates.reply > 0 && rates.positive < 0.3) health.push("Most replies aren't positive. Check targeting and whether the message is written to a real signal.");
  if (rates.held && rates.held < 0.75) health.push("Many booked meetings don't happen. Confirm the day before; use the no-show script (skills/cold-call-scripts).");
  return {
    rates,
    end_to_end: r3(Object.values(rates).reduce((a, b) => a * b, 1)),
    sends_per_opportunity: c.opportunities ? Math.round(c.sent / c.opportunities) : null,
    win_rate: typeof c.won === "number" && c.opportunities ? r3(c.won / c.opportunities) : null,
    health,
  };
}

/** Target + rates → required activity. */
export function plan(p) {
  const rates = p.rates || {};
  const missing = STAGES.map(([k]) => k).filter((k) => !(typeof rates[k] === "number" && rates[k] > 0 && rates[k] <= 1));
  if (missing.length) throw new Error(`plan needs your own rates (0–1) for: ${missing.join(", ")}. Measure them with: pipeline-math.mjs rates counts.json`);
  const t = p.target || {};
  let opps = t.opportunities;
  if (!opps && t.pipeline && t.avg_opportunity) opps = Math.ceil(t.pipeline / t.avg_opportunity);
  if (!opps) throw new Error('target needs "opportunities", or "pipeline" + "avg_opportunity"');

  const chain = (rs) => {
    const out = { opportunities: opps };
    out.meetings_held = opps / rs.opportunity;
    out.meetings_booked = out.meetings_held / rs.held;
    out.positive_replies = out.meetings_booked / rs.booked;
    out.replies = out.positive_replies / rs.positive;
    out.delivered = out.replies / rs.reply;
    out.sends = out.delivered / rs.deliverable;
    return out;
  };
  const base = chain(rates);
  const touches = p.touches_per_person || 3;
  const people = base.sends / touches;

  const result = {
    target_opportunities: opps,
    funnel: Object.fromEntries(Object.entries(base).map(([k, v]) => [k, Math.ceil(v)])),
    people_to_contact: Math.ceil(people),
    touches_per_person: touches,
  };
  if (p.capacity?.sends_per_rep_per_day && p.capacity?.working_days) {
    const perRep = p.capacity.sends_per_rep_per_day * p.capacity.working_days;
    result.reps_needed = Math.round((base.sends / perRep) * 10) / 10;
    result.sends_per_rep_period = perRep;
  }
  // Lever analysis: +1 percentage point on each rate → sends saved. Low rates are the most sensitive.
  result.levers = STAGES.map(([k, label]) => {
    const better = { ...rates, [k]: Math.min(1, rates[k] + 0.01) };
    const saved = base.sends - chain(better).sends;
    return { rate: k, label, current: rates[k], sends_saved_per_point: Math.round(saved) };
  }).sort((a, b) => b.sends_saved_per_point - a.sends_saved_per_point);
  return result;
}

export function formatRates(r) {
  const out = ["# Your outbound baseline", "", "| Stage | Rate |", "|---|---|"];
  for (const [k, label] of STAGES) out.push(`| ${label} | ${pct(r.rates[k])} |`);
  out.push("", `End to end (send → opportunity): **${pct(r.end_to_end)}**${r.sends_per_opportunity ? ` · about **${r.sends_per_opportunity}** sends per opportunity` : ""}`);
  if (r.win_rate !== null) out.push(`Win rate: **${pct(r.win_rate)}**`);
  if (r.health.length) out.push("", "## Watch", "", ...r.health.map((h) => `- ${h}`));
  out.push("", "_Use these as the `rates` in a plan. Re-measure monthly; compare to your own history, not internet benchmarks._");
  return out.join("\n");
}

export function formatPlan(r) {
  const f = r.funnel;
  const out = [
    `# Plan: ${r.target_opportunities} opportunities`,
    "",
    "| Stage | Needed |",
    "|---|---|",
    `| Sends | ${f.sends} |`,
    `| Delivered | ${f.delivered} |`,
    `| Replies | ${f.replies} |`,
    `| Positive replies | ${f.positive_replies} |`,
    `| Meetings booked | ${f.meetings_booked} |`,
    `| Meetings held | ${f.meetings_held} |`,
    `| Opportunities | ${f.opportunities} |`,
    "",
    `People to contact: **${r.people_to_contact}** (at ${r.touches_per_person} touches each)`,
  ];
  if (r.reps_needed !== undefined) out.push(`Reps needed at current capacity: **${r.reps_needed}** (${r.sends_per_rep_period} sends per rep per period)`);
  out.push("", "## Where one point matters most (sends saved by +1 percentage point)", "");
  for (const l of r.levers) out.push(`- ${l.label} (now ${pct(l.current)}): **${l.sends_saved_per_point}** fewer sends`);
  out.push("", "_The lowest rates are the most sensitive. Better signals and messages move reply and positive-reply rates, so fix those before adding volume or reps._");
  return out.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const [cmd, file] = args.filter((a) => !a.startsWith("--"));
  if (!["rates", "plan"].includes(cmd) || !file || args.includes("--help")) {
    console.error("usage: pipeline-math.mjs rates counts.json [--json]\n       pipeline-math.mjs plan plan.json [--json]");
    process.exit(2);
  }
  try {
    const input = JSON.parse(readFileSync(file, "utf8"));
    const r = cmd === "rates" ? ratesFromCounts(input) : plan(input);
    console.log(args.includes("--json") ? JSON.stringify(r, null, 2) : cmd === "rates" ? formatRates(r) : formatPlan(r));
  } catch (e) {
    console.error(`pipeline-math: ${e.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

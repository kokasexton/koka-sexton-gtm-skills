#!/usr/bin/env node
// Render the cadence / format / hashtag / timing lookup tables from data/benchmarks.json.
// The tables are generated, never hand-typed, so they cannot drift from the dataset.
// Usage: node build-tables.mjs [--write]   (prints to stdout; --write updates references/benchmark-tables.md)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = join(HERE, "..");
const D = JSON.parse(readFileSync(join(SKILL, "data", "benchmarks.json"), "utf8"));

export function renderTables(d = D) {
  const c = d.craft, cad = d.cadence, f = d.format_median_engagements, t = d.timing;
  const shares = Object.entries(d.format_comment_share_pct).map(([k, v]) => `| ${k} | ${v}% |`).join("\n");
  return `# Benchmark lookup tables

Generated from \`data/benchmarks.json\` by \`scripts/build-tables.mjs\`. Do not edit by hand; edit the data and re-run.
Source: ${d.source}. Medians are engagements per post. Overall median: ${d.overall_median_engagements}.

## Cadence (posts per week)

| Band | Median engagements | Read |
|---|---|---|
| ${cad.optimal_per_week[0]}-${cad.optimal_per_week[1]} per week | ${cad.optimal_median} | Sweet spot, ${cad.vs_daily_multiple}× the daily cohort |
| ${cad.overload_per_week}+ per week | ${cad.overload_median} | Overload: each post competes with your last |

## Format

| Format | Median engagements | Share of comments |
|---|---|---|
| image | ${f.image} | ${d.format_comment_share_pct.image}% |
| link or article | ${f.link_or_article} | ${d.format_comment_share_pct.article}% |
| all posts | ${f.overall} | n/a |

Image beats link or article by ${f.image_vs_link_multiple}×. Comment share by format:

| Format | Share of comments |
|---|---|
${shares}

## Hashtags

| Count | Median engagements | Read |
|---|---|---|
| ${c.hashtag_optimal[0]}-${c.hashtag_optimal[1]} | ${c.hashtag_optimal_median} | Best band |
| ${c.hashtag_overload}+ | ${c.hashtag_overload_median} | ${c.hashtag_overload_drop_pct}% drop |
| 0 (top 1% of posts) | n/a | Viral posts typically carry ${d.viral_top1pct.typical_hashtags} |

## Length and layout

| Trait | Median engagements | Compare |
|---|---|---|
| ${c.length_threshold_chars}+ characters | ${c.length_median_long} | vs ${c.length_median_short} for short posts (${c.length_multiple}×) |
| Line breaks | ${c.linebreaks_median} | vs ${c.wall_of_text_median} for a wall of text (+${c.linebreaks_gain_pct}%) |
| Asks a question | ${c.question_median} | |
| Leads with a number | ${c.number_lead_median} | |

## Timing

| Window | Value |
|---|---|
| Peak days | ${t.peak_days.join(", ")} |
| Peak window (UTC) | ${t.peak_window_utc[0]}:00-${t.peak_window_utc[1]}:00 |
| Worst slot | ${t.worst} |

## Topics

| Topic | Median engagements |
|---|---|
${Object.entries(d.topics_median_engagements).filter(([k]) => !k.includes("pct")).map(([k, v]) => `| ${k.replace(/_/g, " ")} | ${v} |`).join("\n")}

Hot takes sit ${Math.abs(d.topics_median_engagements.hot_take_vs_ai_pct)}% below AI and automation. Teach the shift, don't provoke.

For a verdict on a specific draft, run the \`linkedin_benchmark\` tool instead of reading these tables.
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = renderTables();
  if (process.argv.includes("--write")) writeFileSync(join(SKILL, "references", "benchmark-tables.md"), out);
  else process.stdout.write(out);
}

#!/usr/bin/env node
/**
 * panel-score — score a prompt panel: how often do answer engines mention and
 * cite you, versus competitors, by engine and by buying stage?
 *
 * You run the panel (the same buyer prompts across engines, on a schedule) and
 * log one row per prompt × engine × run. This turns the log into the numbers.
 *
 * Usage:
 *   node panel-score.mjs panel.csv --brand "Acme"            # markdown report
 *   node panel-score.mjs panel.csv --brand "Acme" --json
 *
 * CSV columns (header row required):
 *   prompt, stage (problem|solution|vendor), engine, date,
 *   mentioned (y/n), cited (y/n), competitors (semicolon-separated names),
 *   cited_urls (semicolon-separated)
 *
 * Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

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

const yes = (v) => /^(y|yes|true|1)$/i.test(String(v).trim());
const list = (v) => String(v || "").split(";").map((s) => s.trim()).filter(Boolean);
const rate = (n, d) => (d ? Math.round((n / d) * 1000) / 1000 : 0);
const pct = (x) => `${Math.round(x * 100)}%`;

function group(rows, key) {
  const m = new Map();
  for (const r of rows) {
    const k = r[key] || "(none)";
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r);
  }
  return m;
}

function summarise(rows) {
  return {
    answers: rows.length,
    mention_rate: rate(rows.filter((r) => yes(r.mentioned)).length, rows.length),
    citation_rate: rate(rows.filter((r) => yes(r.cited)).length, rows.length),
  };
}

export function scorePanel(rows, brand = "you") {
  const overall = summarise(rows);
  const byEngine = Object.fromEntries([...group(rows, "engine")].map(([k, v]) => [k, summarise(v)]));
  const byStage = Object.fromEntries([...group(rows, "stage")].map(([k, v]) => [k, summarise(v)]));

  // Share of voice: answers that mention each name, brand included.
  const mentions = new Map([[brand, rows.filter((r) => yes(r.mentioned)).length]]);
  for (const r of rows) for (const c of list(r.competitors)) mentions.set(c, (mentions.get(c) || 0) + 1);
  const totalMentions = [...mentions.values()].reduce((a, b) => a + b, 0);
  const shareOfVoice = [...mentions.entries()]
    .map(([name, n]) => ({ name, mentions: n, share: rate(n, totalMentions) }))
    .sort((a, b) => b.mentions - a.mentions);

  // Domains engines lean on — the third-party places to earn a mention.
  const domains = new Map();
  for (const r of rows)
    for (const u of list(r.cited_urls)) {
      const d = (u.match(/^(?:https?:\/\/)?(?:www\.)?([^/]+)/i) || [])[1];
      if (d) domains.set(d.toLowerCase(), (domains.get(d.toLowerCase()) || 0) + 1);
    }
  const topDomains = [...domains.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([domain, n]) => ({ domain, n }));

  // Gaps: prompts where you are never mentioned but a competitor is.
  const gaps = [...group(rows, "prompt")]
    .filter(([, v]) => !v.some((r) => yes(r.mentioned)) && v.some((r) => list(r.competitors).length))
    .map(([prompt, v]) => ({ prompt, stage: v[0].stage, competitors: [...new Set(v.flatMap((r) => list(r.competitors)))] }));

  return { brand, overall, byEngine, byStage, shareOfVoice, topDomains, gaps };
}

export function toMarkdown(r) {
  const out = [`# Prompt panel — ${r.brand}`, ""];
  out.push(`**${r.overall.answers}** answers · mentioned in **${pct(r.overall.mention_rate)}** · cited (linked) in **${pct(r.overall.citation_rate)}**`, "");
  out.push("## By engine", "", "| Engine | Answers | Mentioned | Cited |", "|---|---|---|---|");
  for (const [k, v] of Object.entries(r.byEngine)) out.push(`| ${k} | ${v.answers} | ${pct(v.mention_rate)} | ${pct(v.citation_rate)} |`);
  out.push("", "## By buying stage", "", "| Stage | Answers | Mentioned | Cited |", "|---|---|---|---|");
  for (const [k, v] of Object.entries(r.byStage)) out.push(`| ${k} | ${v.answers} | ${pct(v.mention_rate)} | ${pct(v.citation_rate)} |`);
  out.push("", "## Share of voice", "");
  for (const s of r.shareOfVoice) out.push(`- ${s.name === r.brand ? `**${s.name}**` : s.name}: ${s.mentions} (${pct(s.share)})`);
  if (r.topDomains.length) {
    out.push("", "## Sources the engines cite", "");
    for (const d of r.topDomains) out.push(`- ${d.domain} — ${d.n}`);
  }
  if (r.gaps.length) {
    out.push("", "## Gaps — competitors appear, you don't", "");
    for (const g of r.gaps) out.push(`- [${g.stage}] "${g.prompt}" → ${g.competitors.join(", ")}`);
  }
  out.push("", "_One panel is a snapshot. Answers vary run to run — compare the same panel over time, not one answer._");
  return out.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const val = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : undefined);
  const file = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--brand");
  if (!file || args.includes("--help")) {
    console.error('usage: panel-score.mjs <panel.csv> --brand "Name" [--json]');
    process.exit(2);
  }
  const r = scorePanel(parseCsv(readFileSync(file, "utf8")), val("--brand") || "you");
  console.log(args.includes("--json") ? JSON.stringify(r, null, 2) : toMarkdown(r));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

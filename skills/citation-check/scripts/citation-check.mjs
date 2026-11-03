#!/usr/bin/env node
/**
 * citation-check — a structural readiness check for pages you want answer
 * engines (ChatGPT, Perplexity, Gemini, Google AI Overviews, Claude) to cite.
 *
 * HONEST LABEL: this is a heuristic checklist of structure that makes a page
 * easy to extract and quote. It does not predict citations. Whether you are
 * actually cited is measured with a prompt panel (see the prompt-panel skill).
 *
 * Usage:
 *   node citation-check.mjs page.md            # markdown or html
 *   node citation-check.mjs page.html --json
 *
 * Exit code: 0 always for a successful run (it is advisory); 2 on usage error.
 * Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { extname } from "node:path";
import { fileURLToPath } from "node:url";

const QUESTION_HEAD = /^(what|how|why|when|which|who|where|is|are|can|does|do|should|will)\b|\?\s*$/i;

/** Normalise markdown or html into { headings, paragraphs, text, raw, isHtml }. */
export function parsePage(raw, hint = "") {
  const isHtml = /\.html?$/i.test(hint) || /<\s*(html|body|h1|p)\b/i.test(raw);
  if (!isHtml) {
    const lines = raw.replace(/\r\n/g, "\n").split("\n");
    const headings = [];
    for (const l of lines) {
      const m = l.match(/^(#{1,6})\s+(.*)$/);
      if (m) headings.push({ level: m[1].length, text: m[2].trim() });
    }
    const paragraphs = raw
      .replace(/^---\n[\s\S]*?\n---\n/, "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p && !/^#{1,6}\s/.test(p) && !/^(```|<!--)/.test(p));
    return {
      isHtml,
      headings,
      paragraphs,
      lists: (raw.match(/^\s*([-*+]|\d+\.)\s+/gm) || []).length,
      tables: (raw.match(/^\|.*\|\s*\n\|[\s:|-]+\|/gm) || []).length,
      links: raw.match(/\]\((https?:\/\/[^)]+)\)/g) || [],
      text: raw,
      raw,
    };
  }
  const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  const headings = [...raw.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ level: Number(m[1]), text: strip(m[2]) }));
  const paragraphs = [...raw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => ({ html: m[1], text: strip(m[1]) }));
  return {
    isHtml,
    headings,
    paragraphs: paragraphs.map((p) => p.text).filter(Boolean),
    paragraphHtml: paragraphs.map((p) => p.html),
    lists: (raw.match(/<(ul|ol)\b/gi) || []).length,
    tables: (raw.match(/<table\b/gi) || []).length,
    links: raw.match(/<a\s[^>]*href=["']https?:/gi) || [],
    text: strip(raw),
    raw,
  };
}

const words = (s) => (s.match(/\S+/g) || []).length;

export function citationCheck(raw, hint = "") {
  const page = parsePage(raw, hint);
  const checks = [];
  const add = (id, ok, message, fix) => checks.push({ id, status: ok ? "pass" : "warn", message, fix: ok ? undefined : fix });

  const h1 = page.headings.find((h) => h.level === 1);
  add("h1", Boolean(h1), h1 ? `H1: "${h1.text}"` : "No H1.", "Give the page one H1 that names the question or entity it answers.");

  const lead = page.paragraphs[0] || "";
  const leadWords = words(lead);
  add(
    "answer-first",
    lead && leadWords <= 60,
    lead ? `Opening paragraph is ${leadWords} words.` : "No opening paragraph.",
    "Open with a 40–60 word direct answer an engine can lift whole. Context comes after."
  );

  const firstChunk = page.paragraphs.slice(0, 3).join(" ");
  const definitional = /\b[A-Z][\w-]*(?:\s+[\w-]+){0,5}\s+(is|are|means|refers to)\s+(a|an|the)\b/.test(firstChunk);
  add("definition", definitional, definitional ? "Has a definitional sentence near the top." : "No 'X is a …' sentence near the top.", "State plainly what the thing is: 'X is a … that …'. Engines quote definitions.");

  const subs = page.headings.filter((h) => h.level >= 2);
  const qHeads = subs.filter((h) => QUESTION_HEAD.test(h.text));
  add(
    "question-headings",
    qHeads.length >= 2,
    `${qHeads.length} of ${subs.length} subheadings are phrased as questions.`,
    "Phrase 2+ subheadings as the questions buyers actually ask, and answer each in the first sentence below it."
  );

  add("structure", page.lists + page.tables > 0, `${page.lists} list item(s)/lists, ${page.tables} table(s).`, "Add a comparison table or a numbered list — structured blocks are the easiest thing to extract.");

  const faq = page.headings.some((h) => /\b(faq|frequently asked|common questions)\b/i.test(h.text));
  add("faq", faq, faq ? "Has an FAQ section." : "No FAQ section.", "Add a short FAQ with the 3–5 follow-up questions from your prompt panel.");

  // Numbers without a source in the same paragraph.
  const paras = page.isHtml ? page.paragraphHtml : page.paragraphs;
  const unsourced = paras.filter((p) => /\d+(\.\d+)?\s?(%|×|x\b)/.test(p) && !/(https?:\/\/|\]\(|href=|source:|according to|\bper\b)/i.test(p));
  add(
    "sourced-stats",
    unsourced.length === 0,
    unsourced.length ? `${unsourced.length} paragraph(s) quote a number with no source.` : "Every quoted number carries a source.",
    "Cite the source next to each number. Unsourced stats are less quotable and erode trust."
  );

  const original = /\b(we (analy[sz]ed|surveyed|studied|measured|tracked)|our (data|analysis|study|research)|n\s?=\s?\d|dataset)\b/i.test(page.text);
  add("original-data", original, original ? "Signals original data/research." : "No original data signalled.", "Publish something only you have — a dataset, a benchmark, a teardown. Original data is what gets cited instead of summarised.");

  const fresh = /\b(updated|last reviewed|published)\b[^.\n]{0,40}\b(20\d\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(page.text) || /"dateModified"/.test(raw);
  add("freshness", fresh, fresh ? "Shows an updated/published date." : "No visible date.", "Show 'Updated <month year>' and keep it true.");

  const byline = /(?:^|[^A-Za-z])(?:[Bb]y|[Aa]uthor:|[Ww]ritten by)\s+[A-Z][a-z]+/.test(page.text) || /"author"/.test(raw);
  add("byline", byline, byline ? "Has an author byline." : "No author byline.", "Name a real author with credentials. Entity clarity helps engines attribute the claim.");

  if (page.isHtml) {
    const ld = /<script[^>]+application\/ld\+json/i.test(raw);
    const types = [...raw.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
    add("schema", ld, ld ? `JSON-LD present (${[...new Set(types)].join(", ") || "untyped"}).` : "No JSON-LD.", "Add Article (+ FAQPage if you have an FAQ, Organization/Person for the author) JSON-LD.");
  }

  const passed = checks.filter((c) => c.status === "pass").length;
  return {
    label: "heuristic citation-readiness — not a citation prediction",
    score: `${passed}/${checks.length}`,
    readiness: Math.round((passed / checks.length) * 100),
    checks,
  };
}

export function formatReport(r) {
  const out = [`Citation readiness: ${r.score} (${r.readiness}%) — ${r.label}`, ""];
  for (const c of r.checks) {
    out.push(`${c.status === "pass" ? "✓" : "!"} [${c.id}] ${c.message}`);
    if (c.fix) out.push(`    fix: ${c.fix}`);
  }
  out.push("", "Next: measure real citations with the prompt-panel skill. Structure is necessary, not sufficient.");
  return out.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  if (!file || args.includes("--help")) {
    console.error("usage: citation-check.mjs <page.md|page.html> [--json]");
    process.exit(2);
  }
  const r = citationCheck(readFileSync(file, "utf8"), extname(file));
  console.log(args.includes("--json") ? JSON.stringify(r, null, 2) : formatReport(r));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

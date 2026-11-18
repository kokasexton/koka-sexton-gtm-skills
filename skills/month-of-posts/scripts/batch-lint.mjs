#!/usr/bin/env node
/**
 * batch-lint — check a folder of drafted LinkedIn posts and track approval.
 *
 * Each post is a markdown file with a small frontmatter block:
 *
 *   ---
 *   date: 2026-12-07
 *   pillar: Founder finance, plainly
 *   format: document
 *   status: draft        # draft | approved
 *   ---
 *   (the post)
 *
 * Every post goes through the same gate as skills/content-evaluation
 * (lint-post). A post is READY only when all three hold:
 *   - status is approved (a person said so)
 *   - the lint verdict is not BLOCK
 *   - it has no unfilled [[FILL: ...]] placeholder
 * Nothing is posted. The tool never changes a file.
 *
 * Usage:
 *   node batch-lint.mjs posts/ [--json]
 * Exit code: 0 = no approved post is blocked, 1 = an approved post is BLOCKED
 * or has an unfilled placeholder, 2 = usage error.
 *
 * Zero dependencies. Node 18+.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { lintPost } from "../../content-evaluation/scripts/lint-post.mjs";

export function parsePost(text) {
  const m = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta = {};
  let body = text;
  if (m) {
    body = m[2];
    for (const line of m[1].split("\n")) {
      const k = line.match(/^([A-Za-z_]+):\s*(.*?)\s*(?:#.*)?$/);
      if (k) meta[k[1].toLowerCase()] = k[2];
    }
  }
  return { meta, body: body.trim() };
}

const PLACEHOLDER = /\[\[FILL:[^\]]*\]\]/g;

export function checkPosts(posts) {
  const rows = posts.map(({ file, text }) => {
    const { meta, body } = parsePost(text);
    const format = meta.format || undefined;
    const lint = lintPost(body, { format });
    const placeholders = body.match(PLACEHOLDER) || [];
    const status = (meta.status || "draft").toLowerCase();
    const fails = lint.findings.filter((f) => f.level === "fail").map((f) => f.id);
    const warns = lint.findings.filter((f) => f.level === "warn").map((f) => f.id);
    const reasons = [];
    if (status !== "approved") reasons.push("not approved yet");
    if (lint.verdict === "BLOCK") reasons.push(`blocked: ${fails.join(", ")}`);
    if (placeholders.length) reasons.push(`${placeholders.length} unfilled placeholder${placeholders.length > 1 ? "s" : ""}`);
    return {
      file, date: meta.date || "", pillar: meta.pillar || "", format: format || "",
      status, verdict: lint.verdict, chars: lint.stats?.chars ?? body.length,
      fails, warns, placeholders: placeholders.length,
      ready: reasons.length === 0, reasons,
    };
  });
  rows.sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999") || a.file.localeCompare(b.file));
  const dates = rows.map((r) => r.date).filter(Boolean);
  const dupes = [...new Set(dates.filter((d, i) => dates.indexOf(d) !== i))];
  const byPillar = {};
  for (const r of rows) if (r.pillar) byPillar[r.pillar] = (byPillar[r.pillar] || 0) + 1;
  const counts = {
    total: rows.length,
    approved: rows.filter((r) => r.status === "approved").length,
    ready: rows.filter((r) => r.ready).length,
    blocked: rows.filter((r) => r.verdict === "BLOCK").length,
    needs_input: rows.filter((r) => r.placeholders > 0).length,
  };
  const problems = rows.filter((r) => r.status === "approved" && (r.verdict === "BLOCK" || r.placeholders > 0));
  return { counts, rows, duplicate_dates: dupes, by_pillar: byPillar, approved_but_not_ready: problems.map((r) => r.file) };
}

export function toMarkdown(r) {
  const c = r.counts;
  const lines = [
    `# Month of posts: ${c.total} drafts`,
    `Approved ${c.approved}. Ready to post ${c.ready}. Blocked by the gate ${c.blocked}. Waiting on your input ${c.needs_input}.`,
    "",
    "| File | Date | Pillar | Format | Chars | Verdict | Status | Ready | Why not |",
    "|---|---|---|---|---|---|---|---|---|",
    ...r.rows.map((x) => `| ${x.file} | ${x.date || "-"} | ${x.pillar || "-"} | ${x.format || "-"} | ${x.chars} | ${x.verdict} | ${x.status} | ${x.ready ? "yes" : "no"} | ${x.reasons.join("; ") || "-"} |`),
    "",
  ];
  if (r.duplicate_dates.length) lines.push(`Two posts share a date: ${r.duplicate_dates.join(", ")}.`);
  if (r.approved_but_not_ready.length) lines.push(`Approved but not ready: ${r.approved_but_not_ready.join(", ")}. Fix these before they go anywhere.`);
  lines.push("A post is ready only when you approved it, the gate does not block it, and no placeholder is left. Nothing is posted for you.");
  return lines.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const dir = args.find((a) => !a.startsWith("--"));
  if (!dir || args.includes("--help")) {
    console.error("usage: batch-lint.mjs <posts-folder> [--json]");
    process.exit(2);
  }
  let files;
  try {
    if (!statSync(dir).isDirectory()) throw new Error("not a folder");
    files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  } catch (e) {
    console.error(`batch-lint: cannot read folder "${dir}" (${e.message})`);
    process.exit(2);
  }
  if (!files.length) {
    console.error(`batch-lint: no .md posts in "${dir}"`);
    process.exit(2);
  }
  const r = checkPosts(files.map((f) => ({ file: basename(f), text: readFileSync(join(dir, f), "utf8") })));
  console.log(args.includes("--json") ? JSON.stringify(r, null, 2) : toMarkdown(r));
  process.exit(r.approved_but_not_ready.length ? 1 : 0);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

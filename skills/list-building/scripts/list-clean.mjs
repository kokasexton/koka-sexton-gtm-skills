#!/usr/bin/env node
/**
 * list-clean — normalise, flag, and de-duplicate a contact list before it
 * touches a sending domain. It does NOT verify mailboxes; run a verification
 * service on the output.
 *
 * Usage:
 *   node list-clean.mjs contacts.csv            # markdown report
 *   node list-clean.mjs contacts.csv --csv      # cleaned, merged rows with a status column
 *   node list-clean.mjs contacts.csv --json
 *
 * Columns (header row required; case-insensitive; any subset):
 *   first_name, last_name | name, email, company, domain, linkedin_url, title, source
 *
 * Status per merged person:
 *   ready                 → verify mailbox, then OK to sequence
 *   hold-free-mail        → personal address; find a work email
 *   review-domain         → email domain ≠ company domain (stale job?)
 *   drop-role             → info@/sales@-style address
 *   drop-invalid          → email syntax invalid or missing
 *
 * Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const FREE_MAIL = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "hotmail.com", "outlook.com", "live.com", "msn.com",
  "aol.com", "icloud.com", "me.com", "mac.com", "proton.me", "protonmail.com", "gmx.com", "gmx.de", "web.de",
  "mail.com", "yandex.com", "zoho.com", "fastmail.com", "hey.com",
]);
const ROLE = /^(info|sales|support|hello|contact|admin|office|team|marketing|hr|jobs|careers|billing|noreply|no-reply|help|enquiries|inquiries)@/;
const EMAIL = /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

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

export const normEmail = (e) => String(e || "").trim().toLowerCase().replace(/^mailto:/, "");
export const normDomain = (d) =>
  String(d || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[/?#].*$/, "");
export function normLinkedIn(u) {
  const m = String(u || "").toLowerCase().match(/linkedin\.com\/in\/([^/?#\s]+)/);
  return m ? `linkedin.com/in/${decodeURIComponent(m[1]).replace(/\/$/, "")}` : "";
}
export const normName = (s) =>
  String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

function person(r, i) {
  const email = normEmail(r.email);
  const emailDomain = email.includes("@") ? email.split("@")[1] : "";
  const name = r.name || [r.first_name, r.last_name].filter(Boolean).join(" ");
  const domain = normDomain(r.domain) || (emailDomain && !FREE_MAIL.has(emailDomain) ? emailDomain : "");
  return {
    row: i + 2, // 1-based, after header
    name: name.replace(/\s+/g, " ").trim(),
    email,
    emailDomain,
    domain,
    company: (r.company || "").trim(),
    title: (r.title || "").trim(),
    linkedin: normLinkedIn(r.linkedin_url),
    sources: r.source ? [r.source.trim()] : [],
  };
}

function statusOf(p) {
  if (!p.email || !EMAIL.test(p.email)) return "drop-invalid";
  if (ROLE.test(p.email)) return "drop-role";
  if (FREE_MAIL.has(p.emailDomain)) return "hold-free-mail";
  if (p.domain && p.emailDomain && p.emailDomain !== p.domain && !p.emailDomain.endsWith("." + p.domain)) return "review-domain";
  return "ready";
}

/** Clean + de-dupe. Returns { input, people, duplicates, counts }. */
export function cleanList(rows) {
  const people = rows.map(person);
  // Union-find over match keys: email, LinkedIn URL, name + domain.
  const parent = people.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a, b) => (parent[find(a)] = find(b));
  const seen = new Map();
  people.forEach((p, i) => {
    const keys = [];
    if (p.email && EMAIL.test(p.email)) keys.push(`e:${p.email}`);
    if (p.linkedin) keys.push(`l:${p.linkedin}`);
    if (p.name && p.domain) keys.push(`n:${normName(p.name)}|${p.domain}`);
    for (const k of keys) (seen.has(k) ? union(i, seen.get(k)) : seen.set(k, i));
  });

  const groups = new Map();
  people.forEach((p, i) => {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(p);
  });

  const filled = (p) => ["name", "email", "domain", "company", "title", "linkedin"].filter((k) => p[k]).length;
  const merged = [];
  const duplicates = [];
  for (const g of groups.values()) {
    const sorted = [...g].sort((a, b) => filled(b) - filled(a) || b.row - a.row);
    const m = { ...sorted[0], sources: [], rows: g.map((p) => p.row).sort((a, b) => a - b) };
    for (const p of sorted) {
      for (const k of ["name", "email", "emailDomain", "domain", "company", "title", "linkedin"]) if (!m[k] && p[k]) m[k] = p[k];
      for (const s of p.sources) if (!m.sources.includes(s)) m.sources.push(s);
    }
    m.status = statusOf(m);
    merged.push(m);
    if (g.length > 1) duplicates.push({ name: m.name, rows: m.rows, sources: m.sources });
  }
  merged.sort((a, b) => a.rows[0] - b.rows[0]);
  const counts = { input: rows.length, unique: merged.length, duplicates_removed: rows.length - merged.length };
  for (const s of ["ready", "hold-free-mail", "review-domain", "drop-role", "drop-invalid"]) counts[s] = merged.filter((m) => m.status === s).length;
  return { people: merged, duplicates, counts };
}

export function toMarkdown(r) {
  const c = r.counts;
  const out = [
    "# List clean",
    "",
    `**${c.input}** rows in → **${c.unique}** unique people (**${c.duplicates_removed}** duplicate rows merged)`,
    "",
    `- ready (verify mailbox next): **${c.ready}**`,
    `- hold, free-mail address: **${c["hold-free-mail"]}**`,
    `- review, email domain ≠ company domain: **${c["review-domain"]}**`,
    `- drop, role address: **${c["drop-role"]}**`,
    `- drop, invalid email: **${c["drop-invalid"]}**`,
    "",
  ];
  if (r.duplicates.length) {
    out.push("## Merged duplicates", "");
    for (const d of r.duplicates) out.push(`- ${d.name || "(no name)"} — rows ${d.rows.join(", ")}${d.sources.length ? ` · sources: ${d.sources.join(", ")}` : ""}`);
    out.push("");
  }
  out.push("## People", "", "| Status | Name | Email | Company domain | Sources |", "|---|---|---|---|---|");
  for (const p of r.people) out.push(`| ${p.status} | ${p.name} | ${p.email || "—"} | ${p.domain || "—"} | ${p.sources.join(", ")} |`);
  out.push("", "_Next: run a mailbox verification service on the `ready` rows before anything sends._");
  return out.join("\n");
}

export function toCsv(r) {
  const cols = ["status", "name", "email", "domain", "company", "title", "linkedin", "sources", "rows"];
  const q = (v) => `"${String(Array.isArray(v) ? v.join(";") : v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...r.people.map((p) => cols.map((c) => q(p[c])).join(","))].join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  if (!file || args.includes("--help")) {
    console.error("usage: list-clean.mjs <contacts.csv> [--csv | --json]");
    process.exit(2);
  }
  const r = cleanList(parseCsv(readFileSync(file, "utf8")));
  console.log(args.includes("--json") ? JSON.stringify(r, null, 2) : args.includes("--csv") ? toCsv(r) : toMarkdown(r));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

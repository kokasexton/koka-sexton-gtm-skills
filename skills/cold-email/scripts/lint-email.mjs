#!/usr/bin/env node
/**
 * lint-email — catch the template tells in a cold email before it sends.
 *
 * Rules come from KOKA.md / KOKA-FIRST.md and the cold-email skill. Word
 * limits are Koka's defaults (not benchmark data) and are flagged as such.
 *
 * Usage:
 *   node lint-email.mjs email.txt                 # first line may be "Subject: …"
 *   node lint-email.mjs email.txt --touch 2       # follow-up rules
 *   cat email.txt | node lint-email.mjs - --json
 *
 * Exit code: 0 = ready to send (no FAIL), 1 = at least one FAIL, 2 = usage error.
 * Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const RULES = "cold-email skill";
const VOICE = "KOKA.md voice rules";
const DEFAULT = "Koka default (not benchmark data)";

const TEMPLATE_OPENERS = [
  /^i hope (this|you)/i,
  /^hope (this|you)/i,
  /^my name is/i,
  /^i('m| am) reaching out/i,
  /^i wanted to reach out/i,
  /^just (following|checking|circling)/i,
  /^(i )?(came across|stumbled upon) your (profile|company)/i,
  /^as an? (leading|top|innovative)/i,
];

const FAKE_FAMILIARITY = [
  /\b(love|loved|big fan of|huge fan of) (your|what you)/i,
  /\bi('ve| have) been following (you|your)/i,
  /\bas (we|i) (discussed|spoke)\b/i,
  /\bhope you remember me\b/i,
  /\bfellow [a-z]+ (enthusiast|lover)\b/i,
];

const GUILT = [
  /\bi haven'?t heard back\b/i,
  /\bdid you (get|see) my (last|previous) (email|note)\b/i,
  /\bbumping this\b/i,
  /\bjust following up\b/i,
  /\bfloat(ing)? this to the top\b/i,
];

const SPAM_SUBJECT = /(\bfree\b|\bguarantee|act now|limited time|\$\$|!{2,}|% off|\burgent\b|^(re|fwd?):)/i;
const MERGE_FIELD = /\{\{[^}]*\}\}|\[(first ?name|name|company|company name|title|industry)\]|<(first_?name|company)>/i;
const CALENDAR = /\b(calendly\.com|cal\.com|hubspot\.com\/meetings|chili ?piper|savvycal|book a (time|slot|call|meeting)|grab (some )?time on my calendar)\b/i;
const LINK = /\bhttps?:\/\/\S+|\bwww\.\S+/gi;
const SLOP = ["in today's fast-paced", "game-changer", "game changer", "unlock", "revolutionize", "synergy", "cutting-edge", "best-in-class", "world-class", "leverage our", "touch base", "circle back"];

/** Split an email into { subject, body }. */
export function parseEmail(text) {
  const t = text.replace(/\r\n/g, "\n").trim();
  const m = t.match(/^subject:\s*(.*)\n+/i);
  return m ? { subject: m[1].trim(), body: t.slice(m[0].length).trim() } : { subject: "", body: t };
}

export function lintEmail(text, opts = {}) {
  const touch = Number(opts.touch || 1);
  const { subject, body } = parseEmail(text);
  const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
  // Skip a greeting line ("Hi Maria," / "Maria,") to find the real opener.
  const isGreeting = (l) => l.length <= 32 && (/^(hi|hey|hello|dear)\b/i.test(l) || /^[A-Z][\w'-]*,$/.test(l));
  const opener = (lines.find((l) => !isGreeting(l)) || "").replace(/^(hi|hey|hello|dear)\s+\S+,\s*/i, "");
  const words = (body.match(/\S+/g) || []).length;
  const questions = (body.match(/\?/g) || []).length;
  const links = body.match(LINK) || [];
  const findings = [];
  const add = (id, level, message, source) => findings.push({ id, level, message, source });

  // Length — Koka defaults: first touch < ~120 words, follow-ups shorter.
  const limit = touch === 1 ? 120 : 90;
  if (words > limit * 1.5) add("length", "fail", `${words} words. Touch ${touch} should be under ~${limit}. Cut to one observation, one idea, one ask.`, DEFAULT);
  else if (words > limit) add("length", "warn", `${words} words. Aim for under ~${limit} on touch ${touch}.`, DEFAULT);
  else add("length", "pass", `${words} words.`, DEFAULT);

  // Merge fields left unfilled.
  const merge = text.match(MERGE_FIELD);
  if (merge) add("merge-field", "fail", `Unfilled merge field "${merge[0]}". This is the most common template tell.`, RULES);

  // Opener — first sentence is about them, not you.
  if (TEMPLATE_OPENERS.some((r) => r.test(opener)))
    add("opener", "fail", `Template opener: "${opener.slice(0, 60)}". Lead with a specific observation about them.`, RULES);
  else if (/^(i|we|our|my)\b/i.test(opener))
    add("opener", "warn", `Opens with "${opener.split(/\s+/)[0]}". The first sentence should be about them.`, RULES);
  else add("opener", "pass", `Opener: "${opener.slice(0, 70)}${opener.length > 70 ? "…" : ""}"`, RULES);

  // Fake familiarity.
  const fake = FAKE_FAMILIARITY.map((r) => body.match(r)).find(Boolean);
  if (fake) add("fake-familiarity", "fail", `"${fake[0]}" implies familiarity you may not have. If you didn't read it, don't imply you did.`, VOICE);

  // One ask.
  if (questions > 2) add("asks", "fail", `${questions} questions. One email, one ask.`, RULES);
  else if (questions === 2) add("asks", "warn", "Two questions. Keep one ask.", RULES);
  else if (questions === 0) add("asks", "warn", "No question. End with one small, specific ask.", RULES);
  else add("asks", "pass", "One ask.", RULES);

  // Calendar links and links on touch one.
  if (CALENDAR.test(body) && touch === 1) add("calendar", "fail", "Calendar link or 'book a time' in touch one. Earn the reply first.", RULES);
  if (links.length && touch === 1) add("links", "warn", `${links.length} link(s) in touch one. Links hurt deliverability and read as marketing. Offer to send it instead.`, RULES);

  // Guilt follow-ups.
  const guilt = GUILT.map((r) => body.match(r)).find(Boolean);
  if (guilt) add("guilt", touch === 1 ? "warn" : "fail", `"${guilt[0]}". Each touch adds something new; it doesn't remind them they ignored you.`, RULES);

  // Subject.
  if (subject) {
    const sw = (subject.match(/\S+/g) || []).length;
    if (SPAM_SUBJECT.test(subject)) add("subject", "fail", `Subject "${subject}" uses spam or fake-thread patterns.`, RULES);
    else if (sw > 7) add("subject", "warn", `Subject is ${sw} words. 2–5 words reads like a colleague.`, DEFAULT);
    else if (subject === subject.toUpperCase() && /[A-Z]/.test(subject)) add("subject", "fail", "ALL-CAPS subject.", RULES);
    else add("subject", "pass", `Subject: "${subject}"`, RULES);
  } else add("subject", "info", 'No subject line found. Put "Subject: …" on the first line to check it.', RULES);

  // Slop.
  const lower = body.toLowerCase();
  const slop = SLOP.filter((s) => lower.includes(s));
  if (slop.length) add("slop", "fail", `Slop phrases: ${slop.map((s) => `"${s}"`).join(", ")}.`, VOICE);

  const counts = { fail: 0, warn: 0, info: 0, pass: 0 };
  for (const f of findings) counts[f.level]++;
  return {
    verdict: counts.fail ? "DO NOT SEND" : counts.warn ? "SEND WITH EDITS" : "READY",
    counts,
    stats: { words, questions, links: links.length, touch, subject },
    findings,
  };
}

const ICON = { fail: "✗ FAIL", warn: "! WARN", info: "· INFO", pass: "✓ PASS" };

export function formatReport(r) {
  const order = { fail: 0, warn: 1, info: 2, pass: 3 };
  const out = [`Verdict: ${r.verdict}  (${r.counts.fail} fail, ${r.counts.warn} warn)`, ""];
  for (const f of [...r.findings].sort((a, b) => order[a.level] - order[b.level]))
    out.push(`${ICON[f.level].padEnd(7)} [${f.id}] ${f.message}  — ${f.source}`);
  out.push("", "Human gate: a person reads every email before it sends.");
  return out.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const file = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--touch");
  if (!file || args.includes("--help")) {
    console.error("usage: lint-email.mjs <email.txt | -> [--touch 1|2|3] [--json]");
    process.exit(2);
  }
  const touch = args.includes("--touch") ? args[args.indexOf("--touch") + 1] : 1;
  const r = lintEmail(readFileSync(file === "-" ? 0 : file, "utf8"), { touch });
  console.log(args.includes("--json") ? JSON.stringify(r, null, 2) : formatReport(r));
  process.exit(r.counts.fail ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

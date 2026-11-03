#!/usr/bin/env node
/**
 * Secret scanner. Blocks any credential, key, token, or sensitive file from
 * entering this repo — and therefore from ever reaching a public push.
 *
 * Run: node scripts/scan-secrets.mjs   (exit 1 = a secret was found)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

const PATTERNS = [
  ["github-pat", /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
  ["github-fine-grained", /\bgithub_pat_[A-Za-z0-9_]{20,}\b/],
  ["openai-key", /\bsk-[A-Za-z0-9]{20,}\b/],
  ["aws-key", /\bAKIA[0-9A-Z]{16}\b/],
  ["google-key", /\bAIza[0-9A-Za-z_\-]{30,}\b/],
  ["slack-token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
  ["private-key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["bearer-literal", /\bBearer\s+[A-Za-z0-9._\-]{20,}\b/],
  ["assigned-secret", /\b(api[_-]?key|secret|password|passwd|token)\s*[:=]\s*["'][^"']{12,}["']/i],
];

const SENSITIVE_FILES = [
  /(^|\/)\.env(\..*)?$/,
  /(^|\/)\.netrc$/,
  /\.(pem|key|p12|pfx|keystore)$/i,
  /(^|\/)credentials?(\.|$)/i,
  /(^|\/)id_(rsa|ed25519|ecdsa)(\.|$)/,
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const fails = [];
const files = walk(ROOT);
for (const f of files) {
  const rel = relative(ROOT, f);
  if (rel.startsWith("scripts/scan-secrets")) continue; // don't flag our own patterns

  for (const re of SENSITIVE_FILES) {
    if (re.test(rel)) fails.push(`[file] sensitive filename: ${rel}`);
  }

  // only scan text-ish files
  if (/\.(png|jpg|jpeg|gif|webp|ico|pdf|zip|tgz|gz|woff2?|ttf)$/i.test(rel)) continue;
  let body;
  try {
    body = readFileSync(f, "utf8");
  } catch {
    continue;
  }
  for (const [label, re] of PATTERNS) {
    const m = body.match(re);
    if (m) fails.push(`[secret:${label}] ${rel}`);
  }
}

console.log(`scan-secrets: checked ${files.length} files`);
if (fails.length) {
  console.error("\nSECRETS/L leaks found — DO NOT PUSH:");
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("scan-secrets: clean");

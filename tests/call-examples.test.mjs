// Cold-call worked examples must follow the skill: honest opener, signal first, short voicemail.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/cold-call-scripts/examples/${f}.txt`, import.meta.url), "utf8");
  const words = (s) => s.trim().split(/\s+/).length;
  const b = rd("before"), a = rd("after"), v = rd("voicemail");
  t("after says it is a cold call", /cold call/i.test(a));
  t("after asks permission for 30 seconds", /30 seconds/i.test(a));
  t("after leads with a signal (hiring)", /hiring/i.test(a));
  t("after ends with a question", /\?\s*$/.test(a.trim()));
  t("before is blocked: no cold-call honesty", !/cold call/i.test(b));
  t("before asks for a 30-minute meeting", /30 minutes/i.test(b));
  t("before has jargon", /best-in-class|leverage|streamline/i.test(b));
  t("after has no jargon", !/best-in-class|leverage|streamline|synergy/i.test(a));
  t("voicemail fits ~20 seconds (<=50 words)", words(v) <= 50);
  t("voicemail names the paired email subject", /subject line/i.test(v));
  return fails;
}

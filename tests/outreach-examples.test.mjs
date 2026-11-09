// LinkedIn outreach worked examples must follow the skill: short reasoned request, value-first DM, no pitch.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/linkedin-outreach-campaign/examples/${f}.txt`, import.meta.url), "utf8").trim();
  const b = rd("before"), c = rd("connect"), d = rd("dm");
  t("connect is under 200 characters", c.length < 200);
  t("connect gives a reason (references a public interaction)", /thread|post|comment/i.test(c));
  t("connect has no pitch or meeting ask", !/demo|calendar|\d+ minutes|book|pipeline/i.test(c));
  t("dm has no meeting ask", !/demo|calendar|\d+ minutes|book a/i.test(d));
  t("dm says it is not a pitch", /no pitch/i.test(d));
  t("dm ends with a question", /\?$/.test(d));
  t("before is blocked: demo ask", /demo/i.test(b));
  t("before asks for 30 minutes", /30 minutes/i.test(b));
  t("before has jargon", /best-in-class|10x|leverage/i.test(b));
  t("after has no jargon", !/best-in-class|10x|leverage|synergy/i.test(c + d));
  return fails;
}

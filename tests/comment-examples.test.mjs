// LinkedIn comment warmer worked example must follow the skill: adds something specific,
// stays on the author's topic, makes no ask, and the skill carries the quality check.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/linkedin-comment-warmer/examples/${f}.txt`, import.meta.url), "utf8").trim();
  const skill = readFileSync(new URL("../skills/linkedin-comment-warmer/SKILL.md", import.meta.url), "utf8");
  const post = rd("post"), b = rd("before"), a = rd("after");
  const sentences = (x) => x.split(/(?<=[.!?])\s+/).filter(Boolean).length;
  const PITCH = /dm me|connect|demo|calendar|book a|we help|our (platform|solution|product)|check out|link in/i;
  const OPENER = /^(great|love|awesome|amazing|so true|totally agree|well said|this!)/i;

  t("after is 2 to 4 sentences", sentences(a) >= 2 && sentences(a) <= 4);
  t("after is substantive (40+ characters)", a.length >= 40);
  t("after does not open with affirmation", !OPENER.test(a));
  t("after has no pitch or connection ask", !PITCH.test(a));
  t("after has no link, hashtag, tag or emoji", !/https?:|#\w|@\w|\p{Extended_Pictographic}/u.test(a));
  t("after contains something specific (a number or named detail)", /\d|thirteen|ten minutes/i.test(a));
  t("after stays on the author's topic", /forecast/i.test(a) && /forecast|contract|renewal|invoice/i.test(post));
  t("after ends on a question", /\?$/.test(a));
  t("before is blocked: affirmation opener", OPENER.test(b));
  t("before is blocked: pitch or connection ask", PITCH.test(b));
  t("before has jargon", /best-in-class|10x|leverage/i.test(b));
  t("after has no jargon", !/best-in-class|10x|leverage|synergy/i.test(a));
  t("skill has the five-question quality check", /## Quality check/.test(skill) && /Specific\?/.test(skill) && /True\?/.test(skill));
  t("skill points to the worked example", /examples\//.test(skill));
  t("skill says to draft nothing when there is no honest angle", /draft nothing/i.test(skill));
  return fails;
}

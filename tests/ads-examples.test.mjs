// Ads-copy worked examples must follow the skill: customer-voice hook, one specific offer, no slop, variants change one element.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/ads-copy/examples/${f}.txt`, import.meta.url), "utf8").trim();
  const b = rd("before"), a = rd("after"), v = rd("variants");
  const slop = /revolutionary|best-in-class|10x|leverage|unlock|transform|synergy/i;
  t("before has slop", slop.test(b));
  t("before has vague CTA", /learn more/i.test(b));
  t("after has no slop", !slop.test(a));
  t("after opens with a quoted customer phrase", /^"/.test(a));
  t("after has a specific offer", /get the 1-page teardown/i.test(a));
  t("after has no vague CTA", !/learn more/i.test(a));
  t("after contains no digits beyond the quoted phrase", !/\d/.test(a.replace(/^".*?"/s, "").replace(/1-page/g, "")));
  const lines = v.split("\n").filter((l) => /^[A-Z] \(/.test(l));
  t("variants has two hook variants", lines.length === 2 && lines.every((l) => /\(hook\)/.test(l)));
  t("variants state the other elements are unchanged", /same turn.*same proof.*same offer/i.test(v));
  return fails;
}

// Ads-creative worked examples must follow the skill: organic winner sponsored, teach one thing, 2-4 live creatives, warm-only message ads, fatigue trigger.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/ads-creative/examples/${f}.txt`, import.meta.url), "utf8");
  const b = rd("before"), a = rd("after");
  t("before uses stock photo", /stock/i.test(b));
  t("before has no refresh plan", !/refresh|rotate|fatigue/i.test(b));
  t("after has a Thought Leader Ad from an organic winner", /Thought Leader Ad/.test(a) && /organic post/i.test(a));
  t("after has a document ad that teaches", /document ad/i.test(a) && /teach/i.test(a));
  t("after names 2-4 live creatives", /\b(2|3|4) live creatives/.test(a));
  t("after holds message ads for warm audiences", /message ads wait/i.test(a) && /never cold/i.test(a));
  t("after sets a fatigue trigger", /frequency climbs/i.test(a) && /new angle, not a new colour/i.test(a));
  t("after has no stock photo", !/stock/i.test(a.replace(/no logo handshake/i, "")));
  return fails;
}

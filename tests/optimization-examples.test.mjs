// Ads-optimization worked examples must follow the skill: ladder order, one change, own baseline.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/ads-optimization/examples/${f}.txt`, import.meta.url), "utf8");
  const b = rd("before"), a = rd("after");
  t("before changes many levers at once", /headline, the image, the audience and the landing page/i.test(b));
  t("before judges in a day on an internet benchmark", /tomorrow/i.test(b) && /industry benchmark/i.test(b));
  t("before cuts the bid first", /cut the bid/i.test(b));
  t("after walks the ladder in order", ["tracking", "delivery", "audience", "creative", "offer", "quality", "bid"].map((w) => a.toLowerCase().indexOf(w)).every((v, i, arr) => v >= 0 && (i === 0 || v > arr[i - 1])));
  t("after makes one change with logged hypothesis", /one change/i.test(a) && /hypothesis/i.test(a) && /date/i.test(a));
  t("after judges against own baseline", /own last quarter/i.test(a) && /not internet benchmarks/i.test(a));
  t("after kills fast, scales slow", /kill/i.test(a) && /scale the winner slowly/i.test(a));
  return fails;
}

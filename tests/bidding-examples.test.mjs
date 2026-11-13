// Ads-bidding worked examples must follow the skill: strategy by goal, budget by layer/tier, no thin spread, diagnose before bid change.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/ads-bidding/examples/${f}.txt`, import.meta.url), "utf8");
  const b = rd("before"), a = rd("after");
  t("before inflates a manual bid on a new campaign", /manual bid/i.test(b) && /brand-new/i.test(b));
  t("before spreads budget evenly", /split the budget evenly/i.test(b));
  t("after starts on automated maximum delivery", /automated maximum delivery/i.test(a));
  t("after moves to cost cap only with a baseline", /cost cap/i.test(a) && /acceptable cost per result/i.test(a));
  t("after uses manual bid for narrow tier-1", /manual bid/i.test(a) && /narrow, high-value/i.test(a));
  t("after budgets by layer and tier", /by layer/i.test(a) && /tier-1/i.test(a));
  t("after avoids thin spread", /do not spread thin/i.test(a));
  t("after diagnoses before changing bid", /audience size and frequency/i.test(a) && /creative fatigue/i.test(a) && /Only then change the bid/.test(a));
  t("after confirms in Campaign Manager", /Campaign Manager/.test(a));
  return fails;
}

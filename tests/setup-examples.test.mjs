// Ads-campaign-setup worked examples must follow the skill: groups by layer/tier, one objective, retargeting wired, naming, checklist.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/ads-campaign-setup/examples/${f}.txt`, import.meta.url), "utf8");
  const b = rd("before"), a = rd("after");
  t("before mixes objectives on one audience", /mixed objectives/i.test(b) && /same job-title audience/i.test(b));
  t("before uses generic names", /Campaign 1/.test(b));
  t("before skips exclusions", /no Insight Tag check, no exclusions/i.test(b));
  t("after groups by layer and tier", /by funnel layer and account tier/i.test(a) && /L1 Attention/.test(a));
  t("after has one objective per campaign", /one objective/i.test(a));
  t("after wires retargeting between layers", /L2 Consideration retargets L1 engagers/.test(a) && /L2 engagers plus site visitors/.test(a));
  t("after excludes converted leads", /excludes converted leads/i.test(a));
  t("after has naming convention", /layer_tier_format_angle_yyyymm/.test(a) && /L1_T1_TLA_sdr-hiring_202611/.test(a));
  t("after has pre-launch checklist", /Insight Tag/.test(a) && /exclusions applied/i.test(a) && /UTMs/.test(a) && /2-4 creatives/.test(a));
  return fails;
}

// Ads-measurement worked examples must follow the skill: full tracking, KPI order, honest attribution.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/ads-measurement/examples/${f}.txt`, import.meta.url), "utf8");
  const b = rd("before"), a = rd("after");
  t("before leads with vanity metrics", /impressions, clicks and CTR/i.test(b));
  t("before has thin tracking", /landing page only/i.test(b) && /no UTMs/i.test(b));
  t("before trusts view-through", /view-through number/i.test(b));
  t("after sets up tag, CAPI, UTMs, form sync", /Insight Tag on every page/.test(a) && /Conversions API/.test(a) && /UTMs/.test(a) && /hidden field/.test(a));
  t("after orders KPIs outcome to input", a.search(/outcome first/i) >= 0 && a.indexOf("outcome") < a.indexOf("account") && a.indexOf("account") < a.indexOf("efficiency") && /diagnostics only/i.test(a));
  t("after reports both attribution views", /view-through/i.test(a) && /last-click/i.test(a) && /overstates/i.test(a) && /understates/i.test(a));
  t("after runs a holdout", /holdout/i.test(a) && /tier-2/.test(a));
  t("after asks self-reported attribution", /what made them take it/i.test(a));
  return fails;
}

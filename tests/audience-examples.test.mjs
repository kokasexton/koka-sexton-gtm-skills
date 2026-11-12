// Ads-audiences worked examples must follow the skill: accounts first, functions over titles, exclusions, expansion off, demographics check.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/ads-audiences/examples/${f}.txt`, import.meta.url), "utf8");
  const b = rd("before"), a = rd("after");
  t("before targets job titles", /job titles/i.test(b));
  t("before leaves expansion on", /expansion on/i.test(b));
  t("after starts with a company list", /company list/i.test(a) && /Accounts first/.test(a));
  t("after uses function plus seniority", /job function plus seniority/i.test(a));
  t("after has exclusions", /Exclusions:.*customers.*competitors/i.test(a));
  t("after has retargeting pools", /Retargeting pools/.test(a) && /document openers/i.test(a));
  t("after turns expansion off", /expansion off/i.test(a));
  t("after widens by accounts", /adding accounts, not by loosening the persona/i.test(a));
  t("after checks demographics", /demographics report/i.test(a));
  return fails;
}

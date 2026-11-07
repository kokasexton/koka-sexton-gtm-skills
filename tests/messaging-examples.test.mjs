// Prose-only messaging skills ship before/after examples; the linter must agree with them.
import { readFileSync } from "node:fs";
import { lintEmail } from "../skills/cold-email/scripts/lint-email.mjs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (s, f) => readFileSync(new URL(`../skills/${s}/examples/${f}.txt`, import.meta.url), "utf8");
  for (const s of ["atl-messaging", "btl-messaging"]) {
    const b = lintEmail(rd(s, "before")), a = lintEmail(rd(s, "after"));
    t(`${s} before is blocked`, b.counts.fail > 0);
    t(`${s} after is READY`, a.verdict === "READY");
    t(`${s} after is no longer than before`, a.stats.words < b.stats.words + 40);
  }
  const atl = lintEmail(rd("atl-messaging", "after"));
  t("atl after under ~80 words", atl.stats.words <= 80);
  const btl = lintEmail(rd("btl-messaging", "after"));
  t("btl after under ~120 words", btl.stats.words <= 120);
  t("atl 26% figure traces to canonical skill",
    readFileSync(new URL("../skills/linkedin-algorithm/SKILL.md", import.meta.url), "utf8").includes("+26% seniority"));
  return fails;
}

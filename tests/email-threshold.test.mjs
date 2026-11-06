// lint-email must read its house-rule thresholds from skills/cold-email/data/thresholds.json.
import { lintEmail, THRESHOLDS } from "../skills/cold-email/scripts/lint-email.mjs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const find = (r, id) => r.findings.find((f) => f.id === id);
  const body = (n) => "Maria,\n\nSaw your note on pipeline reviews. " + "word ".repeat(n) + "\n\nWorth a look?";
  const L = THRESHOLDS.first_touch_words;
  t("under limit passes", find(lintEmail(body(L - 20)), "length").level === "pass");
  t("over limit warns", find(lintEmail(body(L + 5)), "length").level === "warn");
  t("far over fails", find(lintEmail(body(Math.ceil(L * THRESHOLDS.fail_multiplier) + 5)), "length").level === "fail");
  const F = THRESHOLDS.followup_words;
  t("followup limit is stricter", find(lintEmail(body(F + 5), { touch: 2 }), "length").level !== "pass");
  const long = "Subject: " + "a ".repeat(THRESHOLDS.subject_max_words + 1) + "\n\n" + body(30);
  t("subject over max warns", find(lintEmail(long), "subject").level === "warn");
  const slop = lintEmail(body(20) + " " + THRESHOLDS.slop_phrases[0]);
  t("slop from data file fails", find(slop, "slop")?.level === "fail");
  t("labelled as house rule, not benchmark", /not benchmark/.test(THRESHOLDS.source));
  return fails;
}

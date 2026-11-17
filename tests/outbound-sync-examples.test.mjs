// Ads-outbound-sync worked examples must follow the skill: real signals, second signal, context, no tracking talk.
import { readFileSync } from "node:fs";

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const rd = (f) => readFileSync(new URL(`../skills/ads-outbound-sync/examples/${f}.txt`, import.meta.url), "utf8");
  const b = rd("before"), a = rd("after");
  t("before messages everyone served the ad", /served the ad/i.test(b) && /one impression is enough/i.test(b));
  t("before announces the tracking", /i saw you clicked our ad/i.test(b));
  t("before gives the SDR no context", /just a name and an email/i.test(b));
  t("after names strong signals", /lead-form/i.test(a) && /thought leader ad/i.test(a));
  t("after rejects lone impression or click", /single impression or a lone click is not a signal/i.test(a));
  t("after scores with a second signal", /one more signal/i.test(a) && /ads alone rarely justify/i.test(a));
  t("after routes with context", /which ad they engaged with/i.test(a) && /teardown/i.test(a));
  t("after never mentions tracking in the message", /never "i saw you clicked our ad/i.test(a));
  t("after keeps a human gate", /human approves every outbound/i.test(a));
  return fails;
}

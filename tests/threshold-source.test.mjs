// lint_post and linkedin_benchmark must share one threshold source
// (skills/linkedin-algorithm/data/benchmarks.json). The lint messages must quote
// the JSON values, and the lint verdict must agree with the benchmark engine.
import { lintPost, BENCH } from "../skills/content-evaluation/scripts/lint-post.mjs";
import { DATA, benchmarkPost } from "../lib/benchmark.mjs";

export function run() {
  const fails = [];
  const t = (name, cond) => { if (!cond) fails.push(name); };
  const find = (r, id) => r.findings.find((f) => f.id === id);

  t("same data object contents", JSON.stringify(BENCH) === JSON.stringify(DATA));

  const c = DATA.craft;
  const over = lintPost("Lesson learned.\n\n" + "#t ".repeat(c.hashtag_overload));
  t("hashtag overload fails at JSON threshold", find(over, "hashtags").level === "fail");
  t("hashtag message quotes JSON median", find(over, "hashtags").message.includes(String(c.hashtag_overload_median)));
  const under = lintPost("Lesson learned.\n\n" + "#t ".repeat(c.hashtag_overload - 1));
  t("one below overload does not fail", find(under, "hashtags").level !== "fail");

  const long = lintPost("a\n\n" + "x".repeat(c.length_threshold_chars));
  t("length passes at JSON threshold", find(long, "length").level === "pass");
  const short = lintPost("a\n\n" + "x".repeat(c.length_threshold_chars - 10));
  t("length warns below JSON threshold", find(short, "length").level === "warn");

  // Agreement with the benchmark engine on a weak post.
  const text = "check this out https://x.co #a #b #c #d #e #f #g #h";
  t("lint and benchmark both flag hashtag overload",
    find(lintPost(text), "hashtags").level === "fail" &&
    benchmarkPost({ text, format: "link" }).checks.find((x) => x.trait === "hashtags").status !== "good");

  const img = lintPost("hi", { format: "image" });
  t("format note quotes JSON image median", find(img, "format").message.includes(String(DATA.format_median_engagements.image)));
  return fails;
}

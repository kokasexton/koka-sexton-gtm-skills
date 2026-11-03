// Benchmark engine test — the report data must drive real verdicts.
import { benchmarkPost, benchmarkData } from "../lib/benchmark.mjs";

export function run() {
  const fails = [];
  const t = (name, cond) => { if (!cond) fails.push(name); };

  // A strong post: long, image, 2 hashtags, has line breaks, asks a question, leads with a number.
  const strong = benchmarkPost({
    text: "3 things I learned about LinkedIn reach.\n\n" + "x".repeat(1600) + "\n\nWhat would you add?",
    format: "image", hashtags: 2, dayOfWeek: "Tue", hourUtc: 14,
  });
  t("strong post: length good", strong.checks.find((c) => c.trait === "length").status === "good");
  t("strong post: hashtags good", strong.checks.find((c) => c.trait === "hashtags").status === "good");
  t("strong post: format good", strong.checks.find((c) => c.trait === "format").status === "good");
  t("strong post: question good", strong.checks.find((c) => c.trait === "question").status === "good");
  t("strong post: few fixes", strong.fixes.length <= 2);

  // A weak post: short, link, 8 hashtags, no line breaks.
  const weak = benchmarkPost({ text: "check this out https://x.co " + "#a #b #c #d #e #f #g #h", format: "link" });
  t("weak post: hashtags off", weak.checks.find((c) => c.trait === "hashtags").status === "off");
  t("weak post: format off (link/article)", weak.checks.find((c) => c.trait === "format").status === "off");
  t("weak post: length off", weak.checks.find((c) => c.trait === "length").status === "off");
  t("weak post: has fixes", weak.fixes.length >= 3);
  t("weak post detects hashtags from text", weak.traits.hashtags === 8);

  // Non-peak timing flagged.
  const offTime = benchmarkPost({ text: "hello world " + "y".repeat(1600), dayOfWeek: "Fri", hourUtc: 21 });
  t("off-peak timing flagged", offTime.checks.find((c) => c.trait === "timing").status === "off");

  // Data access.
  const data = benchmarkData("cadence");
  t("benchmarkData('cadence') returns cadence", Boolean(data.cadence || data.error) && JSON.stringify(data).includes("3"));
  t("benchmarkData(no arg) returns source", typeof benchmarkData().source === "string");
  t("benchmarkData(unknown) explains", Boolean(benchmarkData("nope").error));

  return fails;
}

// Content test: numbers quoted from the LinkedIn Algorithm Report must match the
// canonical copy in master-skills/linkedin-content/.claude/skills/linkedin-algorithm/SKILL.md.
//
// Two assertions:
//   1. The canonical skill carries each benchmark value (source-of-truth integrity).
//   2. Every other skill that restates a benchmark uses the matching number
//      (no drift, no fabrication). Restatements are registered explicitly so a
//      new number in a derived skill is caught rather than silently trusted.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";

const CANONICAL =
  "master-skills/linkedin-content/.claude/skills/linkedin-algorithm/SKILL.md";

// Benchmark values as they appear in the canonical skill.
const CANONICAL_MUSTS = [
  { value: "2.8×", re: /2\.8×/ },
  { value: "63%", re: /63%/ },
  { value: "+26%", re: /26% seniority/ },
  { value: "12×", re: /12× collapse/ },
  { value: "3–5 posts/week", re: /3–5 posts\/week/ },
  { value: "78%", re: /78% of comments are substantive/ },
  { value: "40+ chars", re: /substantive \(40\+ chars\)/ },
  { value: "6+ hashtags → 33", re: /6\+ → 33/ },
  { value: "+72%", re: /\+72% \(62 vs 36\)/ },
  { value: "−29%", re: /hot takes underperform \(54, −29%\)/i },
  { value: "1,500+ chars", re: /1,500\+ chars ≈ 2× short/ },
  { value: "1 in 3 Director+", re: /1 in 3 engagers is Director\+/ },
];

// Every restatement of a benchmark elsewhere in the library, with the number it must carry.
const RESTATEMENTS = [
  {
    file: "master-skills/content-engineer/SKILL.md",
    re: /Image formats outperform link posts ~([\d.]+)×/,
    expect: ["2.8"],
    label: "image vs link multiplier",
  },
  {
    file: "master-skills/content-engineer/SKILL.md",
    re: /6\+ costs ~(\d+)%/,
    expect: ["63"],
    label: "hashtag penalty",
  },
  {
    file: "master-skills/content-engineer/SKILL.md",
    re: /~(\d+)% more senior than likers/,
    expect: ["26"],
    label: "commenter seniority lift",
  },
  {
    file: "master-skills/content-engineer/SKILL.md",
    re: /Cadence (\d)–(\d) posts\/week/,
    expect: ["3", "5"],
    label: "cadence sweet spot",
  },
  {
    file: "master-skills/engagement-intelligence/SKILL.md",
    re: /~(\d+)% more senior than likers/,
    expect: ["26"],
    label: "commenter seniority lift",
  },
  {
    file: "master-skills/engagement-intelligence/SKILL.md",
    re: /reach ~(\d+)× more per follower/,
    expect: ["12"],
    label: "follower-efficiency collapse",
  },
  {
    file: "master-skills/signal-outbound/.claude/skills/buying-signals/SKILL.md",
    re: /skew ~(\d+)% more senior than likers/,
    expect: ["26"],
    label: "commenter seniority lift",
  },
  {
    file: "master-skills/signal-outbound/.claude/skills/buying-signals/SKILL.md",
    re: /(\d+)% write substantive replies/,
    expect: ["78"],
    label: "substantive comments",
  },
  {
    file: "master-skills/linkedin-content/SKILL.md",
    re: /3–5 posts\/week \(~(\d+) median\); 7\+\/week collapses to ~(\d+)/,
    expect: ["195", "80"],
    label: "linkedin-content cadence medians",
  },
  {
    file: "master-skills/linkedin-content/SKILL.md",
    re: /Image median (\d+) vs link\/article (\d+) \(([\d.]+)×\)/,
    expect: ["70", "25", "2.8"],
    label: "linkedin-content image vs link",
  },
  {
    file: "master-skills/linkedin-content/.claude/skills/post-engagement/SKILL.md",
    re: /\*\*([\d.]+)% Director\+ vs ([\d.]+)% of likers\*\*/,
    expect: ["44.2", "35.1"],
    label: "post-engagement commenter vs liker seniority",
  },
  {
    file: "master-skills/linkedin-content/.claude/skills/post-scheduling/SKILL.md",
    re: /about (\d+) median engagements, ([\d.]+)× the daily cohort/,
    expect: ["195", "2.4"],
    label: "post-scheduling cadence",
  },
  {
    file: "master-skills/linkedin-content/.claude/skills/post-storytelling/SKILL.md",
    re: /\+(\d+)% \((\d+) vs (\d+)\)/,
    expect: ["72", "62", "36"],
    label: "post-storytelling whitespace lift",
  },
  // Thresholds baked into the runnable tools — code drifts too.
  {
    file: "master-skills/content-engineer/.claude/skills/content-evaluation/scripts/lint-post.mjs",
    re: /6\+ drops median engagement to (\d+) \(−(\d+)%\)/,
    expect: ["33", "63"],
    label: "lint-post hashtag penalty",
  },
  {
    file: "master-skills/content-engineer/.claude/skills/content-evaluation/scripts/lint-post.mjs",
    re: /if \(h >= (\d+)\) add\("hashtags", "fail"/,
    expect: ["6"],
    label: "lint-post hashtag fail threshold",
  },
  {
    file: "master-skills/content-engineer/.claude/skills/content-evaluation/scripts/lint-post.mjs",
    re: /if \(chars >= (\d+)\) add\("length", "pass"/,
    expect: ["1500"],
    label: "lint-post long-form threshold",
  },
  {
    file: "master-skills/content-engineer/.claude/skills/content-evaluation/scripts/lint-post.mjs",
    re: /earn \+(\d+)% \(62 vs 36\)/,
    expect: ["72"],
    label: "lint-post whitespace lift",
  },
  {
    file: "master-skills/content-engineer/.claude/skills/content-evaluation/scripts/lint-post.mjs",
    re: /\(median 54, −(\d+)%\)/,
    expect: ["29"],
    label: "lint-post hot-take penalty",
  },
  {
    file: "master-skills/content-engineer/.claude/skills/content-evaluation/scripts/lint-post.mjs",
    re: /median of 25 vs 70 for image \(([\d.]+)× gap\)/,
    expect: ["2.8"],
    label: "lint-post image vs link",
  },
  {
    file: "master-skills/content-engineer/.claude/skills/content-evaluation/scripts/lint-post.mjs",
    re: /commenters are (\d+)% more senior/,
    expect: ["26"],
    label: "lint-post commenter seniority",
  },
  {
    file: "master-skills/content-engineer/.claude/skills/content-evaluation/SKILL.md",
    re: /6\+ → (\d+) \(−(\d+)%\)/,
    expect: ["33", "63"],
    label: "content-evaluation hashtag penalty",
  },
  {
    file: "master-skills/engagement-intelligence/.claude/skills/warm-list/scripts/warm-list.mjs",
    re: /SUBSTANTIVE_CHARS = (\d+);/,
    expect: ["40"],
    label: "warm-list substantive comment length",
  },
  {
    file: "master-skills/engagement-intelligence/.claude/skills/warm-list/scripts/warm-list.mjs",
    re: /BASELINE_DIRECTOR_PLUS = (\d+) \/ (\d+);/,
    expect: ["1", "3"],
    label: "warm-list Director+ baseline",
  },
  {
    file: "master-skills/engagement-intelligence/.claude/skills/warm-list/SKILL.md",
    re: /commenters skew (\d+)% more senior/,
    expect: ["26"],
    label: "warm-list commenter seniority",
  },
];

function read(relPath) {
  return readFileSync(join(ROOT, relPath), "utf8");
}

export function run() {
  const fails = [];

  const canonical = read(CANONICAL);
  for (const { value, re } of CANONICAL_MUSTS) {
    if (!re.test(canonical)) {
      fails.push(`[canonical] ${CANONICAL}: benchmark "${value}" not found in the source of truth`);
    }
  }

  for (const { file, re, expect, label } of RESTATEMENTS) {
    const body = read(file);
    const m = body.match(re);
    if (!m) {
      fails.push(`[restatement] ${file}: no longer states the "${label}" benchmark`);
      continue;
    }
    const got = m.slice(1);
    if (got.join("|") !== expect.join("|")) {
      fails.push(
        `[restatement] ${file}: "${label}" is ${got.join("–")} but canonical is ${expect.join("–")}`
      );
    }
  }

  return fails;
}

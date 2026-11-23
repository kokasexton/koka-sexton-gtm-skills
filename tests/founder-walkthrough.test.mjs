// Content test: docs/founder-pack.md quotes real engine output. If the example data or
// engine changes, the walkthrough must be updated, not left to drift.
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";
import { packSkills } from "../scripts/install.mjs";

// lint exits non-zero on BLOCK, so capture stdout either way.
const node = (args) => {
  try { return execFileSync(process.execPath, args, { cwd: ROOT, encoding: "utf8" }); }
  catch (e) { return String(e.stdout || ""); }
};

export function run() {
  const fails = [];
  const doc = readFileSync(join(ROOT, "docs/founder-pack.md"), "utf8");
  const need = (label, out, ...pieces) => { for (const p of pieces) if (!out.includes(p)) fails.push(`${label}: engine output lacks "${p}"`); };
  const quoted = (...pieces) => { for (const p of pieces) if (!doc.includes(p)) fails.push(`docs/founder-pack.md does not quote "${p}"`); };

  const n = packSkills("founder").length;
  quoted(`installed ${n} new`);

  const cal = node(["skills/content-calendar/scripts/content-calendar.mjs", "skills/content-calendar/examples/pillars.json"]);
  need("calendar", cal, "2026-12-07 to 2027-01-05", "18 posts, 4 a week", "Founder finance, plainly 9, Fundraising without theatre 5, Fractional work, behind the scenes 4", "Fridays: no post");
  quoted("2026-12-07 to 2027-01-05", "18 posts, 4 a week", "Founder finance, plainly 9, Fundraising without theatre 5, Fractional work, behind the scenes 4");

  const before = node(["skills/content-evaluation/scripts/lint-post.mjs", "skills/content-evaluation/examples/before.md"]);
  need("before", before, "Verdict: BLOCK  (4 fail, 3 warn)", "7 hashtags");
  const after = node(["skills/content-evaluation/scripts/lint-post.mjs", "skills/content-evaluation/examples/after.md"]);
  need("after", after, "Verdict: SHIP  (0 fail, 0 warn)", "1511 chars", "1 hashtag");
  quoted("**BLOCK** with 4 fails and 3 warnings", "7 hashtags", "**SHIP** with 0 fails", "1,511 characters");

  const batch = node(["skills/month-of-posts/scripts/batch-lint.mjs", "skills/month-of-posts/examples/posts"]);
  need("batch", batch, "Approved 2. Ready to post 1. Blocked by the gate 1. Waiting on your input 1.", "blocked: hashtags, link-in-body");
  quoted("2 approved, 1 ready to post, 1 blocked by the gate, 1 waiting on your input");

  for (const s of ["content-calendar", "content-evaluation", "month-of-posts", "post-hooks", "post-formats", "post-scheduling", "linkedin-launch", "linkedin-safety", "dm-scripts"]) if (!packSkills("founder").includes(s)) fails.push(`founder pack no longer includes ${s}, which the walkthrough names`);
  return fails;
}

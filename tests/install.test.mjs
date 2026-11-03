// Install test: a real install into a temp dir. Every skill must land one level
// deep (<dir>/<name>/SKILL.md) so agents discover it, nested .claude/ dirs must
// not be copied, tools must travel with their skill, and the persona must travel
// with `koka`.
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { skillFiles } from "./_util.mjs";
import { install } from "../scripts/install.mjs";

export function run() {
  const fails = [];
  const target = mkdtempSync(join(tmpdir(), "koka-install-"));
  try {
    const { installed } = install({ target, log: () => {} });
    const expected = skillFiles().map((f) => basename(dirname(f))).sort();
    if (JSON.stringify([...installed].sort()) !== JSON.stringify(expected)) {
      fails.push(`installed ${installed.length} skills, expected ${expected.length}`);
    }
    for (const n of expected) {
      if (!existsSync(join(target, n, "SKILL.md"))) fails.push(`install: ${n}/SKILL.md not discoverable`);
      if (existsSync(join(target, n, ".claude"))) fails.push(`install: ${n}/.claude was copied (sub-skills must be siblings)`);
    }
    for (const f of ["KOKA.md", "KOKA-FIRST.md"]) {
      if (!existsSync(join(target, "koka", f))) fails.push(`install: persona file ${f} missing from koka/`);
    }
    for (const [skill, tool] of [
      ["content-evaluation", "lint-post.mjs"],
      ["warm-list", "warm-list.mjs"],
      ["warm-list", "taxonomy.json"],
      ["citation-check", "citation-check.mjs"],
      ["prompt-panel", "panel-score.mjs"],
      ["cold-email", "lint-email.mjs"],
      ["list-building", "list-clean.mjs"],
      ["multi-signal", "signal-score.mjs"],
      ["outbound-metrics", "pipeline-math.mjs"],
    ]) {
      if (!existsSync(join(target, skill, "scripts", tool))) fails.push(`install: ${skill}/scripts/${tool} missing`);
    }
    const again = install({ target, log: () => {} });
    if (again.installed.length !== 0) fails.push("install: second run without --force overwrote existing skills");
    if (readdirSync(target).length !== expected.length) fails.push("install: unexpected extra entries in target");
  } catch (e) {
    fails.push(`install threw: ${e.message}`);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
  return fails;
}

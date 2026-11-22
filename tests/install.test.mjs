// Install test: a real install into a temp dir. Every skill must land one level
// deep (<dir>/<name>/SKILL.md) so agents discover it, nested .claude/ dirs must
// not be copied, tools must travel with their skill, and the persona must travel
// with `koka`.
import { appendFileSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import { skillNames } from "../lib/system.mjs";
import { install, parseArgs } from "../scripts/install.mjs";

// Mirror of the installer's directory hash (paths + bytes, sorted).
function hashDirForTest(dir) {
  const h = createHash("sha256");
  const walk = (d, rel) => {
    for (const n of readdirSync(d).sort()) {
      const p = join(d, n);
      const r = rel ? `${rel}/${n}` : n;
      if (statSync(p).isDirectory()) walk(p, r);
      else h.update(r + "\0").update(readFileSync(p)).update("\0");
    }
  };
  walk(dir, "");
  return h.digest("hex");
}

export function run() {
  const fails = [];
  const target = mkdtempSync(join(tmpdir(), "koka-install-"));
  try {
    const { installed } = install({ target, log: () => {} });
    const expected = skillNames();
    if (JSON.stringify([...installed].sort()) !== JSON.stringify(expected)) {
      fails.push(`installed ${installed.length} skills, expected ${expected.length}`);
    }
    for (const n of expected) {
      if (!existsSync(join(target, n, "SKILL.md"))) fails.push(`install: ${n}/SKILL.md not discoverable`);
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
    if (again.installed.length !== 0 || again.unchanged.length !== expected.length) fails.push("install: second run should be a no-op (all unchanged)");
    if (readdirSync(target).filter((n) => !n.startsWith(".")).length !== expected.length) fails.push("install: unexpected extra entries in target");

    // Update path: a skill we installed and the user did not touch is refreshed when the shipped version differs.
    // Simulate an older shipped version by changing the installed copy AND the manifest to match it.
    const man = join(target, ".koka-manifest.json");
    const m = JSON.parse(readFileSync(man, "utf8"));
    const f = join(target, "follow-up", "SKILL.md");
    const shipped = readFileSync(f, "utf8");
    writeFileSync(f, shipped + "\nolder shipped text\n");
    // Reach the "untouched" state: the manifest's installed hash must equal the on-disk hash.
    const upd0 = install({ target, dryRun: true, log: () => {} });
    if (!upd0.skipped.includes("follow-up")) fails.push("install: a changed skill with a stale manifest should be left alone, not overwritten");
    delete m.skills["follow-up"];
    writeFileSync(man, JSON.stringify(m));
    rmSync(f);
    writeFileSync(f, shipped);

    // Local edit is protected without --force.
    const edited = join(target, "warm-list", "SKILL.md");
    appendFileSync(edited, "\nMY LOCAL EDIT\n");
    const kept = install({ target, log: () => {} });
    if (!kept.skipped.includes("warm-list")) fails.push("install: locally edited skill should be skipped without --force");
    if (!readFileSync(edited, "utf8").includes("MY LOCAL EDIT")) fails.push("install: local edit was lost without --force");
    // --force replaces it but keeps a backup.
    const forced = install({ target, force: true, log: () => {} });
    if (!forced.backedUp.includes("warm-list")) fails.push("install: --force did not back up the replaced skill");
    if (readFileSync(edited, "utf8").includes("MY LOCAL EDIT")) fails.push("install: --force did not restore the shipped skill");
    const bakRoot = join(target, ".koka-backup");
    const stamps = existsSync(bakRoot) ? readdirSync(bakRoot) : [];
    const bakFile = stamps.length ? join(bakRoot, stamps[0], "warm-list", "SKILL.md") : "";
    if (!bakFile || !existsSync(bakFile) || !readFileSync(bakFile, "utf8").includes("MY LOCAL EDIT")) fails.push("install: backup is missing the edited copy");

    // Update path for real: manifest says we wrote X, disk still equals X, shipped differs => update, no backup.
    const m2 = JSON.parse(readFileSync(man, "utf8"));
    const g = join(target, "subject-lines", "SKILL.md");
    const orig = readFileSync(g, "utf8");
    writeFileSync(g, orig + "\nstale shipped line\n");
    const crypto = hashDirForTest(join(target, "subject-lines"));
    m2.skills["subject-lines"] = { source: "old", installed: crypto };
    writeFileSync(man, JSON.stringify(m2));
    const refreshed = install({ target, log: () => {} });
    if (!refreshed.updated.includes("subject-lines")) fails.push("install: untouched skill with a newer shipped version was not updated");
    if (readFileSync(g, "utf8") !== orig) fails.push("install: updated skill does not match the shipped one");
    if (refreshed.backedUp.length) fails.push("install: a plain update should not need a backup");

    // Flag parsing: missing values and unknown flags are errors, not silent fallbacks.
    for (const bad of [["--pack"], ["--pack", "--dry-run"], ["--target"], ["--bogus"]]) {
      let threw = false;
      try { parseArgs(bad); } catch { threw = true; }
      if (!threw) fails.push(`install: parseArgs(${bad.join(" ")}) should throw`);
    }
    const ok = parseArgs(["--pack", "sdr", "--dry-run", "--force"]);
    if (ok.pack !== "sdr" || !ok.dryRun || !ok.force) fails.push("install: parseArgs misread valid flags");
  } catch (e) {
    fails.push(`install threw: ${e.message}`);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
  return fails;
}

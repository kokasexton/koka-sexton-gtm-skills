// Role packs: every listed skill exists, packs install a closed set (each skill's
// orchestrator and `koka` come along), and a real pack install lands only that set.
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";
import { parentOf, skillNames } from "../lib/system.mjs";
import { install, packSkills } from "../scripts/install.mjs";

export function run() {
  const fails = [];
  const packs = JSON.parse(readFileSync(join(ROOT, "packs.json"), "utf8"));
  const names = Object.keys(packs).filter((k) => !k.startsWith("_"));
  const all = new Set(skillNames());
  const parents = parentOf();
  for (const role of ["sdr", "founder", "investor"]) if (!names.includes(role)) fails.push(`packs: missing role "${role}"`);
  for (const p of names) {
    const { skills, title, for: who } = packs[p];
    if (!title || !who) fails.push(`packs: ${p} needs title and for`);
    if (!packs[p].guide || !existsSync(join(ROOT, packs[p].guide))) fails.push(`packs: ${p} needs a guide that exists`);
    else if (!readFileSync(join(ROOT, packs[p].guide), "utf8").includes(`--pack ${p}`)) fails.push(`packs: ${p} guide never shows its install command`);
    const fpr = packs[p].first_prompts || [];
    if (fpr.length < 3) fails.push(`packs: ${p} needs at least 3 first_prompts`);
    for (const fp of fpr) {
      if (!fp.say || /\d/.test(fp.say)) fails.push(`packs: ${p} first prompt must be a plain sentence with no figures: "${fp.say}"`);
      if (!skills.includes(fp.skill)) fails.push(`packs: ${p} first prompt points at "${fp.skill}", which is not in the pack`);
    }
    if (new Set(skills).size !== skills.length) fails.push(`packs: ${p} lists a skill twice`);
    for (const s of skills) if (!all.has(s)) fails.push(`packs: ${p} lists unknown skill "${s}"`);
    const set = new Set(packSkills(p));
    if (!set.has("koka")) fails.push(`packs: ${p} closure lacks koka`);
    for (const s of set) if (parents.get(s) && !set.has(parents.get(s))) fails.push(`packs: ${p} has ${s} without its orchestrator`);
    if (set.size >= all.size) fails.push(`packs: ${p} is the whole library, not a pack`);
    const target = mkdtempSync(join(tmpdir(), "koka-pack-"));
    try {
      install({ target, pack: p, log: () => {} });
      const got = readdirSync(target).filter((n) => !n.startsWith(".")).sort();
      if (JSON.stringify(got) !== JSON.stringify([...set].sort())) fails.push(`packs: ${p} installed ${got.length}, expected ${set.size}`);
      if (!existsSync(join(target, "koka", "KOKA.md"))) fails.push(`packs: ${p} lacks persona`);
      // The installed router must say exactly which skills exist, so it never routes to one that does not.
      const koka = readFileSync(join(target, "koka", "SKILL.md"), "utf8");
      const note = koka.split("<!-- koka-pack -->")[1] || "";
      if (!note) fails.push(`packs: ${p} koka has no installed-pack note`);
      const listed = [...(note.match(/Installed \(\d+\): (.*)/) || [])[1]?.matchAll(/`([^`]+)`/g) || []].map((m) => m[1]).sort();
      if (JSON.stringify(listed) !== JSON.stringify(got)) fails.push(`packs: ${p} koka note lists ${listed.length} skills, ${got.length} are installed`);
      for (const n of listed) if (!existsSync(join(target, n, "SKILL.md"))) fails.push(`packs: ${p} koka note lists ${n}, which is not installed`);
    } finally {
      rmSync(target, { recursive: true, force: true });
    }
  }
  // A full install must not carry the pack note, and installing a pack then the full set removes it.
  const full = mkdtempSync(join(tmpdir(), "koka-pack-"));
  try {
    install({ target: full, pack: "sdr", log: () => {} });
    install({ target: full, log: () => {} });
    if (readFileSync(join(full, "koka", "SKILL.md"), "utf8").includes("<!-- koka-pack -->")) fails.push("packs: full install after a pack left the pack note behind");
  } finally {
    rmSync(full, { recursive: true, force: true });
  }
  let threw = false;
  try { packSkills("nope"); } catch { threw = true; }
  if (!threw) fails.push("packs: unknown pack should throw");
  return fails;
}

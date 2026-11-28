// Onboarding: the guided setup, MCP config merge, doctor, and the places that
// describe the install (llms.txt, README, koka router) stay in step with the code.
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";
import { doctor, probeMcp } from "../scripts/doctor.mjs";
import { parseSetupArgs, setup } from "../scripts/setup.mjs";
import { parseArgs } from "../scripts/install.mjs";
import { SERVER_KEY, SERVER_PATH, clientConfigPath, mcpSnippet, mergeMcpConfig, readPacks, starterPrompts } from "../lib/onboarding.mjs";

export function run() {
  const fails = [];
  const tmp = mkdtempSync(join(tmpdir(), "koka-onboard-"));
  const quiet = { log: () => {}, home: join(tmp, "home"), cwd: join(tmp, "proj") };
  try {
    // Snippet carries the real absolute path, never a placeholder.
    const snip = JSON.parse(mcpSnippet());
    if (snip.mcpServers[SERVER_KEY].args[0] !== SERVER_PATH || /absolute\/path/.test(mcpSnippet())) fails.push("onboarding: snippet must contain this checkout's real server path");
    if (!existsSync(SERVER_PATH)) fails.push("onboarding: server path does not exist");

    // Client config locations.
    if (!clientConfigPath("claude-code", { cwd: "/p" }).endsWith("/p/.mcp.json")) fails.push("onboarding: claude-code config should be ./.mcp.json");
    if (!clientConfigPath("cursor", { home: "/h" }).endsWith("/h/.cursor/mcp.json")) fails.push("onboarding: cursor config path");
    for (const [platform, frag] of [["darwin", "Application Support"], ["win32", "Claude"], ["linux", ".config"]]) {
      if (!clientConfigPath("claude-desktop", { home: "/h", platform, env: { APPDATA: "/a" } }).includes(frag)) fails.push(`onboarding: claude-desktop path on ${platform}`);
    }
    try { clientConfigPath("nope"); fails.push("onboarding: unknown client should throw"); } catch {}

    // Merge keeps other servers, backs up, is idempotent, refuses broken JSON.
    const cfg = join(tmp, "cfg", "mcp.json");
    if (mergeMcpConfig(cfg).status !== "added") fails.push("onboarding: merge into a missing file should add");
    writeFileSync(cfg, JSON.stringify({ theme: "dark", mcpServers: { other: { command: "x" } } }));
    const m1 = mergeMcpConfig(cfg);
    const after = JSON.parse(readFileSync(cfg, "utf8"));
    if (m1.status !== "added" || !after.mcpServers.other || after.theme !== "dark" || !after.mcpServers[SERVER_KEY]) fails.push("onboarding: merge must keep existing settings and servers");
    if (!existsSync(`${cfg}.koka-backup`)) fails.push("onboarding: merge must back up an existing config");
    if (mergeMcpConfig(cfg).status !== "unchanged") fails.push("onboarding: second merge should be a no-op");
    if (mergeMcpConfig(cfg, { serverPath: "/elsewhere/mcp/server.mjs", dryRun: true }).status !== "would be updated") fails.push("onboarding: dry run should report an update");
    writeFileSync(cfg, "{ not json");
    if (mergeMcpConfig(cfg).status !== "unreadable" || readFileSync(cfg, "utf8") !== "{ not json") fails.push("onboarding: invalid JSON config must be left untouched");

    // Arg parsing.
    try { parseSetupArgs(["--role", "wizard"]); fails.push("setup: unknown role should throw"); } catch {}
    try { parseSetupArgs(["--client", "emacs"]); fails.push("setup: unknown client should throw"); } catch {}
    try { parseSetupArgs(["--bogus"]); fails.push("setup: unknown flag should throw"); } catch {}
    const pi = parseArgs(["--guided", "--update"]);
    if (!pi.guided || !pi.update) fails.push("install: --guided and --update should parse");

    // Full setup: pack install, MCP written, health green, prompts match the pack.
    const target = join(tmp, "skills");
    const mcpFile = join(tmp, "proj", ".mcp.json");
    const r = setup({ role: "sdr", client: "claude-code", target, dryRun: false }, quiet);
    if (!existsSync(join(target, "koka", "SKILL.md"))) fails.push("setup: koka skill not installed");
    if (!existsSync(mcpFile) || !JSON.parse(readFileSync(mcpFile, "utf8")).mcpServers?.[SERVER_KEY]) fails.push("setup: --client claude-code should write ./.mcp.json");
    if (!r.health?.ok) fails.push("setup: doctor should be green right after setup: " + JSON.stringify(r.health?.checks.filter((c) => c.status === "fail")));
    if (JSON.stringify(r.prompts) !== JSON.stringify(starterPrompts("sdr"))) fails.push("setup: prompts should be the sdr pack's first prompts");
    const dry = setup({ role: "founder", target: join(tmp, "dry"), dryRun: true, client: "cursor" }, quiet);
    if (existsSync(join(tmp, "dry")) || existsSync(clientConfigPath("cursor", { home: quiet.home }))) fails.push("setup: --dry-run must write nothing");
    if (dry.health) fails.push("setup: dry run should skip the health check");

    // Doctor.
    const ok = doctor({ target, home: quiet.home, cwd: quiet.cwd });
    if (!ok.ok) fails.push("doctor: should pass on a fresh setup");
    const bad = doctor({ target: join(tmp, "nowhere"), home: quiet.home, cwd: join(tmp, "empty"), probe: false });
    if (bad.ok || !bad.checks.some((c) => c.id === "skills" && c.status === "fail" && c.fix)) fails.push("doctor: a missing target should fail with a fix");
    writeFileSync(mcpFile, JSON.stringify({ mcpServers: { [SERVER_KEY]: { command: "node", args: ["/gone/mcp/server.mjs"] } } }));
    const stale = doctor({ target, home: quiet.home, cwd: quiet.cwd, probe: false });
    if (!stale.checks.some((c) => c.id === "mcp-config" && c.status === "fail" && /does not exist/.test(c.message))) fails.push("doctor: a config pointing at a missing server should fail");

    // The MCP tool list, as served, is what llms.txt and the README tell agents about.
    const probe = probeMcp();
    if (!probe.ok) fails.push("doctor: probeMcp failed: " + probe.error);
    else {
      const llms = readFileSync(join(ROOT, "llms.txt"), "utf8");
      const readme = readFileSync(join(ROOT, "README.md"), "utf8");
      for (const t of probe.tools) {
        if (!llms.includes(`\`${t}\``)) fails.push(`llms.txt: MCP tool ${t} is not listed`);
        if (!readme.includes(`\`${t}\``)) fails.push(`README.md: MCP tool ${t} is not listed`);
      }
    }

    // The koka router offers every pack's starter prompts, so a plugin user gets them too.
    const router = readFileSync(join(ROOT, "skills", "koka", "SKILL.md"), "utf8");
    for (const [name, p] of Object.entries(readPacks())) for (const fp of p.first_prompts) if (!router.includes(fp.say)) fails.push(`koka SKILL.md: first run omits the ${name} prompt "${fp.say}"`);

    // Package bins resolve to real files.
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    for (const [bin, f] of Object.entries(pkg.bin || {})) if (!existsSync(join(ROOT, f))) fails.push(`package.json: bin ${bin} -> ${f} does not exist`);
    if (!pkg.bin?.[pkg.name]) fails.push("package.json: a bin named like the package is needed for `npx <package>`");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  return fails;
}

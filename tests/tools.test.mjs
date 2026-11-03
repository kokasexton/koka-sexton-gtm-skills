// Behaviour tests for the runnable tools, pinned to their worked examples.
// If a tool's output on its own example changes, the SKILL.md that describes
// that example is now wrong too — so this test fails.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";
import { lintPost } from "../master-skills/content-engineer/.claude/skills/content-evaluation/scripts/lint-post.mjs";
import { buildWarmList, classifyHeadline, parseCsv } from "../master-skills/engagement-intelligence/.claude/skills/warm-list/scripts/warm-list.mjs";
import { citationCheck } from "../master-skills/ai-search-visibility/.claude/skills/citation-check/scripts/citation-check.mjs";
import { scorePanel, parseCsv as parsePanel } from "../master-skills/ai-search-visibility/.claude/skills/prompt-panel/scripts/panel-score.mjs";
import { lintEmail } from "../master-skills/cold-email/scripts/lint-email.mjs";
import { cleanList, parseCsv as parseContacts, normLinkedIn } from "../master-skills/list-building/scripts/list-clean.mjs";
import { scoreSignals, parseCsv as parseSignals } from "../master-skills/signal-sourcer/.claude/skills/multi-signal/scripts/signal-score.mjs";
import { ratesFromCounts, plan } from "../master-skills/sdr-tools/.claude/skills/outbound-metrics/scripts/pipeline-math.mjs";

const CE = "master-skills/content-engineer/.claude/skills/content-evaluation";
const WL = "master-skills/engagement-intelligence/.claude/skills/warm-list";
const CC = "master-skills/ai-search-visibility/.claude/skills/citation-check";
const PP = "master-skills/ai-search-visibility/.claude/skills/prompt-panel";
const CEM = "master-skills/cold-email";
const LB = "master-skills/list-building";
const MS = "master-skills/signal-sourcer/.claude/skills/multi-signal";
const OM = "master-skills/sdr-tools/.claude/skills/outbound-metrics";
const read = (p) => readFileSync(join(ROOT, p), "utf8");

export function run() {
  const fails = [];
  const expect = (cond, msg) => cond || fails.push(msg);
  const eq = (got, want, msg) => expect(JSON.stringify(got) === JSON.stringify(want), `${msg}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

  /* ---------------------------------------------------------- lint-post */
  const bad = lintPost(read(`${CE}/examples/before.md`), { format: "link" });
  eq(bad.verdict, "BLOCK", "lint-post before.md verdict");
  const badFails = bad.findings.filter((f) => f.level === "fail").map((f) => f.id).sort();
  eq(badFails, ["engagement-bait", "hashtags", "link-in-body", "slop"], "lint-post before.md fails");
  expect(bad.findings.some((f) => f.id === "hot-take"), "lint-post before.md should flag the hot take");

  const good = lintPost(read(`${CE}/examples/after.md`), { format: "image" });
  eq(good.verdict, "SHIP", "lint-post after.md verdict");
  expect(good.stats.chars >= 1500, "lint-post after.md should be in the 1,500+ band");

  eq(lintPost("a\n\n#one #two #three").findings.find((f) => f.id === "hashtags").level, "warn", "3 hashtags → warn");
  eq(lintPost("a\n\n#1a #2b #3c #4d #5e #6f").findings.find((f) => f.id === "hashtags").level, "fail", "6 hashtags → fail");
  eq(lintPost("x".repeat(1500)).findings.find((f) => f.id === "length").level, "pass", "1,500 chars → pass");
  for (const f of good.findings.concat(bad.findings)) expect(Boolean(f.source), `lint-post finding "${f.id}" has no source`);

  /* ---------------------------------------------------------- warm-list */
  const cases = [
    ["VP Marketing at Northwind Analytics | B2B SaaS", "vp", "marketing"],
    ["I help founders scale to $10M ARR | Fractional CMO | Ex-VP Sales", "c-suite", "marketing"],
    ["Executive Assistant to the CEO at Bluepeak", "ic", "other"],
    ["Marketing Student | Aspiring CMO", "ic", "other"],
    ["Founder & CEO @ Fernway | Helping CMOs build pipeline", "founder", "executive"],
    ["Head of Demand Gen · Northwind Analytics", "director", "marketing"],
    ["Lead Generation Specialist", "ic", "other"],
    ["Chief Revenue Officer at Quillstack", "c-suite", "sales"],
    ["Ex-CMO | Now: Board Advisor", "ic", "other"],
  ];
  for (const [h, sen, fn] of cases) {
    const c = classifyHeadline(h);
    eq([c.seniority, c.function], [sen, fn], `classify "${h}"`);
  }
  expect(classifyHeadline("I help founders | Fractional CMO").flags.includes("fractional"), "fractional flag");
  eq(classifyHeadline("Director of RevOps at Bluepeak").company, "Bluepeak", "company parsed from headline");

  const wl = buildWarmList(parseCsv(read(`${WL}/examples/engagement.csv`)), JSON.parse(read(`${WL}/examples/icp.json`)), { asOf: "2026-10-31" });
  eq(wl.room.engagers, 10, "warm-list engagers");
  eq(wl.room.tiers, { P0: 3, P1: 4, P2: 0, P3: 3 }, "warm-list tiers");
  eq(wl.room.director_plus, 0.6, "warm-list director_plus");
  eq(wl.clusters.map((c) => c.company), ["Northwind Analytics"], "warm-list clusters");
  const tierOf = (n) => wl.people.find((p) => p.name === n)?.tier;
  eq(tierOf("Dana Okafor"), "P0", "Dana (regular, substantive commenter) tier");
  eq(tierOf("Lena Vogel"), "P1", "Lena ('Great post!' is not substantive) tier");
  eq(tierOf("Priya Nair"), "P3", "Priya (excluded: student) tier");
  eq(tierOf("Sara Lindqvist"), "P3", "Sara (EA to the CEO) tier");
  eq(wl.people[0].name, "Dana Okafor", "warm-list ranks Dana first");
  expect(wl.people.every((p) => p.evidence), "every person carries evidence");
  const quoted = parseCsv('name,comment\n"Doe, Jane","said ""hi"", twice"\n');
  eq([quoted[0].name, quoted[0].comment], ["Doe, Jane", 'said "hi", twice'], "csv quoting");

  /* ------------------------------------------------------ citation-check */
  const before = citationCheck(read(`${CC}/examples/before.md`), ".md");
  const after = citationCheck(read(`${CC}/examples/after.md`), ".md");
  eq(before.score, "2/10", "citation-check before.md score");
  eq(after.score, "10/10", "citation-check after.md score");
  const html = citationCheck(
    '<html><h1>What is X?</h1><p>X is a tool that does Y.</p><script type="application/ld+json">{"@type":"Article"}</script></html>',
    ".html"
  );
  eq(html.checks.find((c) => c.id === "schema").status, "pass", "citation-check finds JSON-LD in html");
  expect(/not a citation prediction/.test(after.label), "citation-check keeps its honest label");

  /* --------------------------------------------------------- prompt-panel */
  const panel = scorePanel(parsePanel(read(`${PP}/examples/panel.csv`)), "Northwind");
  eq(panel.overall, { answers: 9, mention_rate: 0.556, citation_rate: 0.333 }, "panel overall");
  eq(panel.byStage.solution.mention_rate, 0, "panel solution-stage mention rate");
  eq(panel.shareOfVoice[0].name, "Rivalscope", "panel share-of-voice leader");
  eq(panel.topDomains[0].domain, "g2.example", "panel top cited domain");
  eq(panel.gaps.map((g) => g.stage), ["solution"], "panel gaps");

  /* ---------------------------------------------------------- lint-email */
  const eb = lintEmail(read(`${CEM}/examples/before.txt`));
  eq(eb.verdict, "DO NOT SEND", "lint-email before.txt verdict");
  for (const id of ["merge-field", "opener", "fake-familiarity", "asks", "calendar", "subject", "slop"]) {
    expect(eb.findings.some((f) => f.id === id && f.level === "fail"), `lint-email before.txt should FAIL "${id}"`);
  }
  const ea = lintEmail(read(`${CEM}/examples/after.txt`));
  eq(ea.verdict, "READY", "lint-email after.txt verdict");
  eq(lintEmail("Subject: hi\n\nMaria,\n\nJust following up on my last note. Any thoughts?", { touch: 2 }).findings.find((f) => f.id === "guilt")?.level, "fail", "guilt follow-up fails on touch 2");
  eq(lintEmail("Hi Sam,\n\nI wanted to reach out about X. Open to it?").findings.find((f) => f.id === "opener").level, "fail", "template opener after greeting");

  /* ---------------------------------------------------------- list-clean */
  const lc = cleanList(parseContacts(read(`${LB}/examples/contacts.csv`)));
  eq([lc.counts.input, lc.counts.unique, lc.counts.duplicates_removed], [12, 8, 4], "list-clean counts");
  eq([lc.counts.ready, lc.counts["hold-free-mail"], lc.counts["review-domain"], lc.counts["drop-role"], lc.counts["drop-invalid"]], [4, 1, 1, 1, 1], "list-clean statuses");
  const dana = lc.people.find((p) => p.name === "Dana Okafor");
  eq(dana?.rows, [2, 3, 4], "list-clean merges Dana across email, LinkedIn URL, and name+domain");
  eq(dana?.sources.sort(), ["database", "event-list", "sales-nav"], "list-clean keeps provenance");
  expect(lc.people.some((p) => p.rows.join() === "8,9"), "list-clean merges accented and unaccented names on the same domain");
  eq(normLinkedIn("https://www.LinkedIn.com/in/DanaOkafor/?trk=x"), "linkedin.com/in/danaokafor", "LinkedIn URL normalisation");

  /* -------------------------------------------------------- signal-score */
  const ss = scoreSignals(parseSignals(read(`${MS}/examples/signals.csv`)), { asOf: "2026-10-31" });
  eq(ss.counts, { "ACT NOW": 1, "WARM UP": 2, WATCH: 2, IGNORE: 1 }, "signal-score counts");
  const act = (n) => ss.accounts.find((a) => a.account === n)?.action;
  eq(act("Northwind Analytics"), "ACT NOW", "Northwind (3 stacked signals) action");
  expect(ss.accounts.find((a) => a.account === "Northwind Analytics").stacked, "Northwind is stacked");
  eq(act("Quillstack"), "WATCH", "Quillstack (old signals decay) action");
  eq(act("Kestrel Labs"), "IGNORE", "Kestrel (low fit) action");
  eq(ss.accounts[0].account, "Northwind Analytics", "signal-score ranks Northwind first");

  /* -------------------------------------------------------- pipeline-math */
  const rt = ratesFromCounts(JSON.parse(read(`${OM}/examples/counts.json`)));
  eq([rt.rates.deliverable, rt.rates.reply, rt.rates.positive], [0.985, 0.051, 0.4], "pipeline-math rates");
  eq(rt.sends_per_opportunity, 250, "pipeline-math sends per opportunity");
  const pl = plan(JSON.parse(read(`${OM}/examples/plan.json`)));
  eq([pl.target_opportunities, pl.funnel.sends, pl.people_to_contact, pl.reps_needed], [30, 7465, 2489, 2.5], "pipeline-math plan");
  eq(pl.levers[0].rate, "reply", "pipeline-math: reply rate is the most sensitive lever");
  let threw = false;
  try { plan({ target: { opportunities: 5 }, rates: {} }); } catch { threw = true; }
  expect(threw, "pipeline-math refuses to plan without the user's own rates");

  return fails;
}

/**
 * MCP tool bridge — exposes the zero-dependency skill tools (lint, clean,
 * score, plan) to MCP clients. Inputs are plain strings/objects (no file
 * paths), so a client can pass a draft or CSV straight in.
 */
import { lintPost } from "../skills/content-evaluation/scripts/lint-post.mjs";
import { lintEmail } from "../skills/cold-email/scripts/lint-email.mjs";
import { citationCheck } from "../skills/citation-check/scripts/citation-check.mjs";
import { ratesFromCounts, plan } from "../skills/outbound-metrics/scripts/pipeline-math.mjs";
import { cleanList, parseCsv as parseListCsv, toMarkdown as listMd } from "../skills/list-building/scripts/list-clean.mjs";
import { scoreSignals, parseCsv as parseSigCsv } from "../skills/multi-signal/scripts/signal-score.mjs";
import { buildWarmList, parseCsv as parseWarmCsv } from "../skills/warm-list/scripts/warm-list.mjs";
import { scorePanel, parseCsv as parsePanelCsv } from "../skills/prompt-panel/scripts/panel-score.mjs";

const str = (d) => ({ type: "string", description: d });
const need = (args, k) => {
  if (typeof args[k] !== "string" || !args[k].trim()) throw new Error(`'${k}' is required (non-empty string)`);
  return args[k];
};
const obj = (args, k) => {
  const v = args[k];
  if (v && typeof v === "object") return v;
  if (typeof v === "string") { try { return JSON.parse(v); } catch { /* fall through */ } }
  throw new Error(`'${k}' must be a JSON object`);
};

export const TOOL_DEFS = [
  { name: "lint_post", description: "Lint a LinkedIn draft against the Algorithm Report + KOKA.md voice rules. Verdict: SHIP / SHIP WITH EDITS / BLOCK, with a cited source per finding.",
    inputSchema: { type: "object", properties: { text: str("the draft"), format: str("image | document | text | video | link") }, required: ["text"] },
    run: (a) => lintPost(need(a, "text"), { format: a.format }) },
  { name: "lint_email", description: "Lint a cold email for template tells (first line may be 'Subject: ...'). touch=2|3 applies follow-up rules.",
    inputSchema: { type: "object", properties: { text: str("the email"), touch: { type: "integer" } }, required: ["text"] },
    run: (a) => lintEmail(need(a, "text"), { touch: a.touch || 1 }) },
  { name: "citation_check", description: "Structural readiness check for a page (markdown or HTML) you want answer engines to cite. Advisory heuristic, not a citation predictor.",
    inputSchema: { type: "object", properties: { page: str("page markdown or HTML") }, required: ["page"] },
    run: (a) => citationCheck(need(a, "page"), "") },
  { name: "pipeline_rates", description: "Outbound counts -> your own conversion rates. No default benchmarks.",
    inputSchema: { type: "object", properties: { counts: { type: "object", description: "{sent,bounced,replied,positive,meetings_booked,meetings_held,opportunities,won?}" } }, required: ["counts"] },
    run: (a) => ratesFromCounts(obj(a, "counts")) },
  { name: "pipeline_plan", description: "Target + your rates -> activity, reps, and the most sensitive rates.",
    inputSchema: { type: "object", properties: { plan: { type: "object", description: "{target,rates,touches_per_person?,capacity?}" } }, required: ["plan"] },
    run: (a) => plan(obj(a, "plan")) },
  { name: "clean_list", description: "Normalise, flag, and de-duplicate a contact CSV (does not verify mailboxes).",
    inputSchema: { type: "object", properties: { csv: str("CSV text with header row") }, required: ["csv"] },
    run: (a) => cleanList(parseListCsv(need(a, "csv"))) },
  { name: "score_signals", description: "Stack account-level buying signals (CSV: account,signal,date,detail,fit,domain) into ACT NOW / WARM UP / WATCH / IGNORE.",
    inputSchema: { type: "object", properties: { csv: str("signals CSV"), as_of: str("YYYY-MM-DD"), weights: { type: "object" } }, required: ["csv"] },
    run: (a) => scoreSignals(parseSigCsv(need(a, "csv")), { asOf: a.as_of, weights: a.weights }) },
  { name: "warm_list", description: "Turn a post-engagement CSV into a ranked P0-P3 warm list with clusters and a read of the room.",
    inputSchema: { type: "object", properties: { csv: str("engagement CSV"), icp: { type: "object" }, as_of: str("YYYY-MM-DD") }, required: ["csv"] },
    run: (a) => buildWarmList(parseWarmCsv(need(a, "csv")), a.icp || {}, { asOf: a.as_of }) },
  { name: "panel_score", description: "Score a prompt-panel log: mention/citation rate by engine and buying stage, share of voice, gaps.",
    inputSchema: { type: "object", properties: { csv: str("panel CSV"), brand: str("your brand name") }, required: ["csv", "brand"] },
    run: (a) => scorePanel(parsePanelCsv(need(a, "csv")), need(a, "brand")) },
];

export const SKILL_TOOLS = TOOL_DEFS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }));

/** Returns the tool result, or { error } — never throws. */
export function runSkillTool(name, args = {}) {
  const t = TOOL_DEFS.find((x) => x.name === name);
  if (!t) return null;
  try { return t.run(args || {}); } catch (e) { return { error: `${name}: ${e.message}` }; }
}

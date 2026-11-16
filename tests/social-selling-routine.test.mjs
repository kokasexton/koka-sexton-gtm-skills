// The social-selling-routine engine must run the five surfaces end to end and
// produce a single digest: room read, ranked ICP-filtered list with evidence,
// key-account watch, and a visible skip count. Draft-only — it never sends.
import { readFileSync } from "node:fs";
import { buildRoutine, toMarkdown } from "../skills/social-selling-routine/scripts/social-selling-routine.mjs";
import { parseCsv } from "../skills/warm-list/scripts/warm-list.mjs";

const HERE = new URL("../skills/social-selling-routine/examples/", import.meta.url);
const pool = parseCsv(readFileSync(new URL("pool.csv", HERE), "utf8"));
const icp = JSON.parse(readFileSync(new URL("icp.json", HERE), "utf8"));

export function run() {
  const fails = [];
  const t = (n, c) => { if (!c) fails.push(n); };
  const d = buildRoutine(pool, icp, { asOf: "2026-11-15" });
  const md = toMarkdown(d);

  t("returns a room read object with engagers + tiers", d.room && typeof d.room === "object" && d.room.engagers > 0 && d.room.tiers);
  t("filters the pool to ICP fit (fewer ranked than seen)", d.ranked.length < d.seen && d.skipped > 0);
  t("every ranked person has evidence", d.ranked.every((p) => p.evidence && p.evidence.length > 0));
  t("every ranked person has a move", d.ranked.every((p) => p.move && p.move.length > 0));
  t("every ranked person fits the ICP", d.ranked.every((p) => p.fit >= 0.5));
  t("key-account watch fires for a recent poster", d.keyAccounts.length >= 1 && d.keyAccounts.some((k) => /outbound/i.test(k.topic)));
  t("drafts never leak a raw URL", d.ranked.every((p) => !/^https?:/.test(p.draft || "")));

  t("markdown has the four sections", /## Read the room/.test(md) && /## Do these today/.test(md) && /## Key-account watch/.test(md) && /## Skipped/.test(md));
  t("markdown states the human gate", /human posts/i.test(md));
  t("markdown does not render an object", !/\[object Object\]/.test(md));
  t("markdown skip line is visible", /outside ICP or too stale/.test(md));
  return fails;
}

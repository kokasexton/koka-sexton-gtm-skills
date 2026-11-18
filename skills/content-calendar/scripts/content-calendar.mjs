#!/usr/bin/env node
/**
 * content-calendar — build a 30-day LinkedIn posting calendar from content pillars.
 *
 * Cadence and timing come from skills/post-scheduling (3-5 posts a week, Monday
 * to Wednesday strongest, 12:00-16:00 UTC). This tool never schedules past 5 a
 * week. Pillars are rotated by weight so the same pillar never posts twice in a
 * row when there is a choice. Link posts are never scheduled.
 *
 * Usage:
 *   node content-calendar.mjs pillars.json [--start YYYY-MM-DD] [--per-week N]
 *        [--days N] [--tz IANA/Zone] [--json | --csv]
 *
 * pillars.json: { "pillars": [ { "name": "...", "weight": 2, "formats": ["document"],
 *                 "angles": ["angle one", "angle two"] } ],
 *                 "start": "2026-12-07", "per_week": 4, "tz": "America/New_York" }
 * Flags override the file.
 *
 * Weights, the default format rotation and the default slot are Koka defaults,
 * not benchmark data. Zero dependencies. Node 18+.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const DAYS_BY_RATE = {
  1: [1],
  2: [1, 3],
  3: [1, 2, 3],
  4: [1, 2, 3, 4],
  5: [1, 2, 3, 4, 5],
};
export const MAX_PER_WEEK = 5;
export const DEFAULT_FORMATS = ["image", "document", "text"];
export const SHAPE = {
  image: "one idea, one chart or before/after",
  document: "framework, steps or teardown",
  text: "story or lesson ending in a question",
  video: "a face explaining one idea, subtitled",
};
const SLOT_UTC_HOUR = 14; // midpoint of the 12:00-16:00 UTC window

const ymd = (d) => d.toISOString().slice(0, 10);
const parseDay = (s) => new Date(`${s}T00:00:00Z`);

function nextMonday(d) {
  const out = new Date(d);
  const dow = out.getUTCDay();
  const add = dow === 1 ? 0 : (8 - dow) % 7;
  out.setUTCDate(out.getUTCDate() + add);
  return out;
}

function localParts(utcMs, tz) {
  const f = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short" });
  const p = Object.fromEntries(f.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}`, weekday: p.weekday };
}

export function windowLocal(tz, dateStr) {
  const base = parseDay(dateStr).getTime();
  const at = (h) => localParts(base + h * 3600000, tz).time;
  return `${at(12)}-${at(16)}`;
}

export function buildCalendar(config = {}, opts = {}) {
  const pillars = (config.pillars || []).map((p) => ({
    name: String(p.name || "").trim(),
    weight: Math.max(1, Math.round(Number(p.weight) || 1)),
    formats: Array.isArray(p.formats) && p.formats.length ? p.formats.filter((f) => f !== "link" && f !== "article") : DEFAULT_FORMATS,
    angles: Array.isArray(p.angles) ? p.angles : [],
  })).filter((p) => p.name);
  if (pillars.length < 1) throw new Error("pillars.json needs at least one pillar with a name");
  if (pillars.length > 5) throw new Error("more than 5 pillars is too many to build authority; cut to 3-5 (skills/content-pillars)");

  const perWeek = Number(opts.perWeek ?? config.per_week ?? 4);
  if (!Number.isInteger(perWeek) || perWeek < 1) throw new Error("per_week must be a whole number from 1 to 5");
  if (perWeek > MAX_PER_WEEK) throw new Error(`per_week ${perWeek} is past the 3-5 posts a week sweet spot; this tool will not schedule more than ${MAX_PER_WEEK} (skills/post-scheduling)`);
  const days = Number(opts.days ?? config.days ?? 30);
  const tz = opts.tz || config.tz || "UTC";
  try { new Intl.DateTimeFormat("en", { timeZone: tz }); } catch { throw new Error(`unknown time zone "${tz}" (use an IANA name like America/New_York)`); }

  const requested = opts.start || config.start;
  const start = requested ? parseDay(requested) : nextMonday(new Date());
  if (Number.isNaN(start.getTime())) throw new Error("start must be YYYY-MM-DD");
  const startNote = start.getUTCDay() === 1 ? null : `start ${ymd(start)} is not a Monday; weeks begin the next Monday`;
  const first = nextMonday(start);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + days - 1);

  // smooth weighted round-robin, never the same pillar twice running when avoidable
  const total = pillars.reduce((s, p) => s + p.weight, 0);
  const cur = new Map(pillars.map((p) => [p.name, 0]));
  let last = null;
  const nextPillar = () => {
    for (const p of pillars) cur.set(p.name, cur.get(p.name) + p.weight);
    const ranked = [...pillars].sort((a, b) => cur.get(b.name) - cur.get(a.name));
    let pick = ranked[0];
    if (pick.name === last && ranked.length > 1) pick = ranked[1];
    cur.set(pick.name, cur.get(pick.name) - total);
    last = pick.name;
    return pick;
  };
  const used = new Map();
  const fmtIdx = new Map();

  const slots = [];
  const posting = DAYS_BY_RATE[perWeek];
  for (let w = 0; ; w++) {
    const weekStart = new Date(first);
    weekStart.setUTCDate(weekStart.getUTCDate() + w * 7);
    if (weekStart > end) break;
    for (const dow of posting) {
      const d = new Date(weekStart);
      d.setUTCDate(d.getUTCDate() + (dow - 1));
      if (d < start || d > end) continue;
      const p = nextPillar();
      const i = fmtIdx.get(p.name) || 0;
      fmtIdx.set(p.name, i + 1);
      const format = p.formats[i % p.formats.length];
      const a = used.get(p.name) || 0;
      used.set(p.name, a + 1);
      const utcMs = d.getTime() + SLOT_UTC_HOUR * 3600000;
      const loc = localParts(utcMs, tz);
      const notes = [];
      if (dow === 5) notes.push("Friday is the weakest slot: post in the morning or move it");
      slots.push({
        n: slots.length + 1,
        week: w + 1,
        utc_date: ymd(d),
        utc_weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()],
        local_date: loc.date,
        local_time: loc.time,
        local_weekday: loc.weekday,
        pillar: p.name,
        format,
        shape: SHAPE[format] || "one idea",
        angle: p.angles[a] || "angle needed: write one from the pillar's editorial direction",
        notes,
      });
    }
  }
  const byPillar = {};
  for (const s of slots) byPillar[s.pillar] = (byPillar[s.pillar] || 0) + 1;
  const weeks = [...new Set(slots.map((s) => s.week))].map((w) => ({ week: w, posts: slots.filter((s) => s.week === w).length }));
  const warnings = [];
  if (startNote) warnings.push(startNote);
  if (perWeek === 5) warnings.push("5 posts a week is the top of the 3-5 range. Fewer, better posts usually beat more.");
  if (perWeek < 3) warnings.push("Under 3 posts a week sits below the 3-5 sweet spot.");
  for (const s of slots) if (s.angle.startsWith("angle needed")) { warnings.push("some slots have no angle yet; write them before drafting"); break; }
  return {
    tz,
    window_local: windowLocal(tz, ymd(first)),
    slot_utc: `${String(SLOT_UTC_HOUR).padStart(2, "0")}:00`,
    per_week: perWeek,
    from: ymd(start),
    to: ymd(end),
    total: slots.length,
    by_pillar: byPillar,
    weeks,
    slots,
    friday_note: perWeek < 5 ? "Fridays: no post. Reply to comments and build the warm list." : null,
    warnings,
  };
}

export function toMarkdown(c) {
  const lines = [
    `# Content calendar: ${c.from} to ${c.to}`,
    `${c.total} posts, ${c.per_week} a week. Slot ${c.slot_utc} UTC (the middle of the 12:00-16:00 UTC window) shown in ${c.tz}. That window is ${c.window_local} in ${c.tz}: test the edges against when your audience is online.`,
    "",
    "| # | Date (local) | Time | Pillar | Format | Shape | Angle |",
    "|---|---|---|---|---|---|---|",
    ...c.slots.map((s) => `| ${s.n} | ${s.local_weekday} ${s.local_date} | ${s.local_time} | ${s.pillar} | ${s.format} | ${s.shape} | ${s.angle}${s.notes.length ? ` (${s.notes.join("; ")})` : ""} |`),
    "",
    `By pillar: ${Object.entries(c.by_pillar).map(([k, v]) => `${k} ${v}`).join(", ")}.`,
  ];
  if (c.friday_note) lines.push(c.friday_note);
  for (const w of c.warnings) lines.push(`Note: ${w}.`);
  lines.push("Cadence, slot and rotation are Koka defaults, not benchmark data. Nothing is posted for you.");
  return lines.join("\n");
}

export function toCsv(c) {
  const cols = ["n", "local_date", "local_time", "utc_date", "pillar", "format", "shape", "angle"];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...c.slots.map((s) => cols.map((k) => q(s[k])).join(","))].join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const val = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : undefined);
  const file = args.find((a, i) => !a.startsWith("--") && !["--start", "--per-week", "--days", "--tz"].includes(args[i - 1]));
  if (!file || args.includes("--help")) {
    console.error("usage: content-calendar.mjs <pillars.json> [--start YYYY-MM-DD] [--per-week N] [--days N] [--tz Zone] [--json | --csv]");
    process.exit(2);
  }
  try {
    const c = buildCalendar(JSON.parse(readFileSync(file, "utf8")), { start: val("--start"), perWeek: val("--per-week") ? Number(val("--per-week")) : undefined, days: val("--days") ? Number(val("--days")) : undefined, tz: val("--tz") });
    if (args.includes("--json")) console.log(JSON.stringify(c, null, 2));
    else if (args.includes("--csv")) console.log(toCsv(c));
    else console.log(toMarkdown(c));
  } catch (e) {
    console.error(`content-calendar: ${e.message}`);
    process.exit(2);
  }
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);

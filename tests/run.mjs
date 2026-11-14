#!/usr/bin/env node
// Test runner — frontmatter, internal links, data accuracy, no unsourced stats,
// the benchmark engine, tool behaviour, system structure, a real install, and
// README catalog sync. (The MCP server has its own runner: tests/mcp.test.mjs.)
// Run: node tests/run.mjs   (exit 1 on any failure)
import { run as frontmatter } from "./frontmatter.test.mjs";
import { run as internalLinks } from "./internal-links.test.mjs";
import { run as dataAccuracy } from "./data-accuracy.test.mjs";
import { run as noUnsourcedStats } from "./no-unsourced-stats.test.mjs";
import { run as benchmark } from "./benchmark.test.mjs";
import { run as tools } from "./tools.test.mjs";
import { run as structure } from "./structure.test.mjs";
import { run as install } from "./install.test.mjs";
import { run as catalog } from "./catalog.test.mjs";
import { run as thresholdSource } from "./threshold-source.test.mjs";
import { run as emailThreshold } from "./email-threshold.test.mjs";
import { run as messagingExamples } from "./messaging-examples.test.mjs";
import { run as callExamples } from "./call-examples.test.mjs";
import { run as outreachExamples } from "./outreach-examples.test.mjs";
import { run as adsExamples } from "./ads-examples.test.mjs";
import { run as creativeExamples } from "./creative-examples.test.mjs";
import { run as audienceExamples } from "./audience-examples.test.mjs";
import { run as biddingExamples } from "./bidding-examples.test.mjs";
import { run as setupExamples } from "./setup-examples.test.mjs";

const suites = [
  ["frontmatter", frontmatter],
  ["internal-links", internalLinks],
  ["data-accuracy", dataAccuracy],
  ["no-unsourced-stats", noUnsourcedStats],
  ["benchmark", benchmark],
  ["tools", tools],
  ["structure", structure],
  ["install", install],
  ["catalog", catalog],
  ["threshold-source", thresholdSource],
  ["email-threshold", emailThreshold],
  ["messaging-examples", messagingExamples],
  ["call-examples", callExamples],
  ["outreach-examples", outreachExamples],
  ["ads-examples", adsExamples],
  ["creative-examples", creativeExamples],
  ["audience-examples", audienceExamples],
  ["bidding-examples", biddingExamples],
  ["setup-examples", setupExamples],
];

let failed = false;
for (const [name, fn] of suites) {
  const fails = fn();
  if (fails.length) {
    failed = true;
    console.error(`FAIL ${name}`);
    for (const f of fails) console.error("  - " + f);
  } else {
    console.log(`ok   ${name}`);
  }
}

if (failed) {
  console.error("\ncontent tests: FAIL");
  process.exit(1);
}
console.log("content tests: OK");

#!/usr/bin/env node
// Content test runner — frontmatter, koka-first block, internal links, data accuracy.
// Run: node tests/run.mjs   (exit 1 on any failure)
import { run as frontmatter } from "./frontmatter.test.mjs";
import { run as internalLinks } from "./internal-links.test.mjs";
import { run as dataAccuracy } from "./data-accuracy.test.mjs";

const suites = [
  ["frontmatter", frontmatter],
  ["internal-links", internalLinks],
  ["data-accuracy", dataAccuracy],
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

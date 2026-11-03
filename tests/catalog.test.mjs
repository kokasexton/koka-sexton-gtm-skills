// Catalog test: README's skill catalog matches the skills that actually ship.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";
import { renderReadme } from "../scripts/build-catalog.mjs";

export function run() {
  const current = readFileSync(join(ROOT, "README.md"), "utf8");
  return renderReadme(current) === current ? [] : ["README.md catalog is stale — run: node scripts/build-catalog.mjs"];
}

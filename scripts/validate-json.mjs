#!/usr/bin/env node
// Validates that every JSON file in the repo (outside node_modules/dist) parses.
// Used by `npm run validate:json` and CI. Exits non-zero on the first bad file.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "coverage"]);

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      out.push(...walk(full));
    } else if (entry.endsWith(".json")) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(ROOT).sort();
let failures = 0;

for (const file of files) {
  const rel = relative(ROOT, file).replaceAll("\\", "/");
  try {
    JSON.parse(readFileSync(file, "utf8"));
    console.log(`ok    ${rel}`);
  } catch (err) {
    failures++;
    console.error(`FAIL  ${rel}: ${err.message}`);
  }
}

console.log(`\n${files.length} JSON file(s) checked, ${failures} invalid.`);
process.exit(failures === 0 ? 0 : 1);

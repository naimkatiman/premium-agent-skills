#!/usr/bin/env node
// Lightweight SVG sanity check for the asset pack.
// Catches the classic "fill='gradientId'" bug (a paint server referenced
// without url(#...)), unbalanced <svg> roots, and empty files.
// Not a full XML parser, a fast guard for the verify chain.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ICON_DIR = join(process.cwd(), "assets", "icons");

let failures = 0;
let checked = 0;

for (const file of readdirSync(ICON_DIR).filter((f) => f.endsWith(".svg"))) {
  const full = join(ICON_DIR, file);
  const svg = readFileSync(full, "utf8");
  checked++;

  if (!svg.includes("<svg") || !svg.includes("</svg>")) {
    console.error(`FAIL  ${file}: missing <svg> root`);
    failures++;
    continue;
  }

  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  /** @type {string[]} */
  const bareRefs = [];
  for (const id of ids) {
    // A paint server id must only be referenced as url(#id), never as a bare
    // attribute value like fill="id". Flag any bare reference.
    const bare = new RegExp(`(fill|stroke)="${id}"`);
    if (bare.test(svg)) bareRefs.push(id);
  }

  if (bareRefs.length > 0) {
    console.error(
      `FAIL  ${file}: paint id(s) referenced without url(#...): ${bareRefs.join(", ")}`
    );
    failures++;
  } else {
    console.log(`ok    ${file}`);
  }
}

console.log(`\n${checked} SVG file(s) checked, ${failures} invalid.`);
process.exit(failures === 0 ? 0 : 1);

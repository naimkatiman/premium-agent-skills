#!/usr/bin/env node
// Emit an ORIGINAL parametric "aperture" mascot SVG starter.
// Usage:
//   node build-svg.mjs                       # print to stdout
//   node build-svg.mjs --hue 270 --size 128  # tune hue/size
//   node build-svg.mjs --out avatar.svg      # write to a file
// This is a clean, original starting point, adapt the geometry, do not ship
// it as-is if it must be distinctive per brand.
import { writeFileSync } from "node:fs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const size = Number(arg("size", "128"));
const hue = Number(arg("hue", "262")); // violet by default
const out = arg("out", "");

const accent = `hsl(${hue} 83% 58%)`;
const accent2 = `hsl(${(hue + 70) % 360} 80% 52%)`;
const ink = "#0B1020";
const light = "#EEF2FF";

// A hexagonal-aperture silhouette with wide-set lens eyes, deliberately not a
// rounded chat badge.
const svg = `<svg width="${size}" height="${size}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="Agent avatar">
  <defs>
    <linearGradient id="shell" x1="20" y1="14" x2="108" y2="114" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="${accent2}"/>
    </linearGradient>
  </defs>
  <path d="M64 8l48 28v56L64 120 16 92V36z" fill="${ink}"/>
  <path d="M64 22l36 21v42L64 106 28 85V43z" fill="url(#shell)"/>
  <circle cx="50" cy="62" r="9" fill="${light}"/>
  <circle cx="78" cy="62" r="9" fill="${light}"/>
  <circle cx="50" cy="62" r="3.4" fill="${ink}"/>
  <circle cx="78" cy="62" r="3.4" fill="${ink}"/>
  <path d="M52 80c4 4 8 6 12 6s8-2 12-6" stroke="${light}" stroke-width="4" stroke-linecap="round"/>
</svg>
`;

if (out) {
  writeFileSync(out, svg);
  console.error(`Wrote ${out} (${size}px, hue ${hue}).`);
} else {
  process.stdout.write(svg);
}

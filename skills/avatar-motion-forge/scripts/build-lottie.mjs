#!/usr/bin/env node
// Emit a minimal pulse-ring Lottie JSON, the idle/active accent layer for a
// mascot wrapper. Standard Lottie shape/layer structure.
// Usage:
//   node build-lottie.mjs                 # print to stdout
//   node build-lottie.mjs --out ring.json # write to a file
//   node build-lottie.mjs --color 124,58,237
import { writeFileSync } from "node:fs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const out = arg("out", "");
const [r, g, b] = arg("color", "124,58,237")
  .split(",")
  .map((n) => Number(n) / 255);

const lottie = {
  v: "5.12.2",
  fr: 30,
  ip: 0,
  op: 60,
  w: 128,
  h: 128,
  nm: "pulse_ring_idle",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "pulse_ring",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [64, 64, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [90, 90, 100] },
            { t: 30, s: [104, 104, 100] },
            { t: 60, s: [90, 90, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [72, 72] }, nm: "Ellipse Path 1" },
            {
              ty: "st",
              c: { a: 0, k: [r, g, b, 1] },
              o: { a: 1, k: [{ t: 0, s: [55] }, { t: 30, s: [25] }, { t: 60, s: [55] }] },
              w: { a: 0, k: 8 },
              lc: 2,
              lj: 2,
              nm: "Stroke 1"
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ],
          nm: "Ring Group"
        }
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0
    }
  ]
};

const json = JSON.stringify(lottie, null, 2);
if (out) {
  writeFileSync(out, json);
  console.error(`Wrote ${out}.`);
} else {
  process.stdout.write(json + "\n");
}

// Genera le icone PNG della PWA dall'SVG sorgente: `node scripts/make-icons.mjs`
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const svg = await readFile("public/icons/icon.svg");
const out = (name, size, opts = {}) =>
  sharp(svg, { density: 384 }).resize(size, size).flatten(opts.flatten ? { background: opts.flatten } : false).png().toFile(`public/icons/${name}`);

await out("icon-192.png", 192);
await out("icon-512.png", 512);
await out("apple-touch-icon.png", 180, { flatten: "#5B4BDB" });
await out("favicon-32.png", 32);
// Maskable: il disegno sta nell'80% centrale, lo sfondo riempie tutto.
const inner = await sharp(svg, { density: 384 }).resize(400, 400).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#5B4BDB" } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile("public/icons/maskable-512.png");
console.log("icone generate");

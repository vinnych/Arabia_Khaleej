/**
 * Generates public/logo.png — a 200×60 Qatar Portal logo banner.
 * Design: white serrated left strip (Qatar-flag-inspired) on maroon background.
 * Pure Node.js, no external dependencies.
 */
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const W = 200;
const H = 60;
const MAROON = [0x7c, 0x1c, 0x2e];
const WHITE = [0xff, 0xff, 0xff];

// ── CRC-32 ──────────────────────────────────────────────────────────────────
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  CRC_TABLE[i] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = (CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)) >>> 0;
  return (c ^ 0xffffffff) >>> 0;
}

// ── PNG chunk builder ────────────────────────────────────────────────────────
function pngChunk(type, data) {
  const typeB = Buffer.from(type, "ascii");
  const lenB = Buffer.alloc(4);
  lenB.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeB, data]);
  const crcB = Buffer.alloc(4);
  crcB.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenB, typeB, data, crcB]);
}

// ── Pixel generator ──────────────────────────────────────────────────────────
// Serrated edge design (matches app/icon.svg scaled to 200×60):
//   - y period: 12px → 5 full teeth across 60px height
//   - white base band: x = 0..29
//   - serration peak: x = 43 (extends 14px into maroon)
//   - triangle wave: peaks at every 6px, valleys at every 12px
function pixelColor(x, y) {
  const t = (y % 12) / 12; // 0→1 within each tooth
  const wave = 1 - 2 * Math.abs(t - 0.5); // triangle: 0 at start/end, 1 at mid
  const edgeX = Math.round(29 + 14 * wave);
  return x <= edgeX ? WHITE : MAROON;
}

// ── Build raw scanlines (filter byte 0 = None per row) ──────────────────────
const scanlines = [];
for (let y = 0; y < H; y++) {
  const row = Buffer.alloc(1 + W * 3, 0);
  row[0] = 0; // filter = None
  for (let x = 0; x < W; x++) {
    const [r, g, b] = pixelColor(x, y);
    row[1 + x * 3] = r;
    row[2 + x * 3] = g;
    row[3 + x * 3] = b;
  }
  scanlines.push(row);
}
const rawData = Buffer.concat(scanlines);

// ── Compress ─────────────────────────────────────────────────────────────────
const compressed = zlib.deflateSync(rawData, { level: 9 });

// ── IHDR ─────────────────────────────────────────────────────────────────────
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type: RGB
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

// ── Assemble PNG ─────────────────────────────────────────────────────────────
const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const png = Buffer.concat([
  PNG_SIG,
  pngChunk("IHDR", ihdr),
  pngChunk("IDAT", compressed),
  pngChunk("IEND", Buffer.alloc(0)),
]);

const outPath = path.join(__dirname, "..", "public", "logo.png");
fs.writeFileSync(outPath, png);
console.log(`✓ logo.png written to ${outPath} (${png.length} bytes, ${W}×${H}px)`);

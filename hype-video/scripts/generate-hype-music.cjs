#!/usr/bin/env node
/**
 * Writes public/hype-music.wav — original procedural bed (no external samples).
 * Regenerate: node scripts/generate-hype-music.cjs
 */
const fs = require("fs");
const path = require("path");

const sampleRate = 44100;
const durationSec = 31;
const numSamples = Math.floor(sampleRate * durationSec);
const numChannels = 1;
const bitsPerSample = 16;

const outDir = path.join(__dirname, "..", "public");
const outPath = path.join(outDir, "hype-music.wav");

function writeWav(int16Mono) {
  const dataSize = int16Mono.length * 2;
  const buf = Buffer.alloc(44 + dataSize);

  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(numChannels, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buf.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buf.writeUInt16LE(bitsPerSample, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataSize, 40);

  let o = 44;
  for (let i = 0; i < int16Mono.length; i++) {
    buf.writeInt16LE(int16Mono[i], o);
    o += 2;
  }
  return buf;
}

const bpm = 128;
const beatSec = 60 / bpm;
const int16 = new Int16Array(numSamples);

for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  const beat = t / beatSec;
  const beatFrac = beat - Math.floor(beat);

  const pump = 0.32 + 0.68 * Math.pow(Math.sin(Math.PI * 2 * 0.25 * t), 2);
  const f1 = 82.41;
  const f2 = 123.47;
  const f3 = 164.81;
  let s =
    pump *
    (0.42 * Math.sin(2 * Math.PI * f1 * t) +
      0.33 * Math.sin(2 * Math.PI * f2 * t + 0.6) +
      0.28 * Math.sin(2 * Math.PI * f3 * t + 1.1) +
      0.1 * Math.sin(2 * Math.PI * f3 * 2 * t));

  const kickEnv = Math.pow(Math.max(0, 1 - beatFrac / 0.12), 3.5);
  s += kickEnv * 0.55 * Math.sin(2 * Math.PI * 55 * beatFrac * 0.12 * (1 / 0.12));

  const hat = Math.pow(Math.max(0, 1 - (beatFrac - 0.5) / 0.04), 2);
  s += hat * 0.06 * Math.sin(2 * Math.PI * 8000 * t);

  let v = Math.tanh(s * 1.35) * 0.82;
  const fadeIn = Math.min(1, t / 0.6);
  const fadeOut = t > durationSec - 1.2 ? Math.max(0, (durationSec - t) / 1.2) : 1;
  v *= fadeIn * fadeOut;
  int16[i] = Math.max(-32767, Math.min(32767, Math.round(v * 30000)));
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, writeWav(int16));
console.log(`Wrote ${outPath} (${durationSec}s mono ${sampleRate}Hz)`);

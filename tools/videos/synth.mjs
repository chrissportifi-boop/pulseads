// Sintetizador sencillo: genera música y efectos a medida para cada anuncio.
import fs from "fs";
const SR = 44100;
let seed = 1;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 * 2 - 1; };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const NOTES = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const n = s => { const m = s.match(/^([A-G][b#]?)(-?\d)$/); return 12 * (+m[2] + 1) + NOTES[m[1]]; };

class Bus { constructor(len) { this.L = new Float32Array(len); this.R = new Float32Array(len); } add(i, v, pan = 0) { if (i < 0 || i >= this.L.length) return; this.L[i] += v * (1 - Math.max(0, pan)); this.R[i] += v * (1 + Math.min(0, pan)); } }

// ---------- instrumentos ----------
function kick(b, t0, amp = 1, { f0 = 150, f1 = 45, decay = 7, len = .5 } = {}) {
  let ph = 0; const s0 = Math.round(t0 * SR);
  for (let i = 0; i < len * SR; i++) { const t = i / SR; const f = f1 + (f0 - f1) * Math.exp(-t * 32); ph += 2 * Math.PI * f / SR;
    let v = Math.sin(ph) * Math.exp(-t * decay); if (i < 120) v += rnd() * .5 * (1 - i / 120); b.add(s0 + i, Math.tanh(v * 1.6) * amp * .9); }
}
function e808(b, t0, note, dur, amp = 1) {
  let ph = 0; const s0 = Math.round(t0 * SR), f = mtof(note);
  for (let i = 0; i < (dur + .2) * SR; i++) { const t = i / SR; const fr = f * (1 + .9 * Math.exp(-t * 40)); ph += 2 * Math.PI * fr / SR;
    const env = Math.min(1, t / .004) * (t < dur ? Math.exp(-t * .9) : Math.exp(-dur * .9) * Math.exp(-(t - dur) * 25));
    b.add(s0 + i, Math.tanh(Math.sin(ph) * 2.2) * env * amp * .55); }
}
function noiseHit(b, t0, amp, decay, hp, lp, len, pan = 0) {
  const s0 = Math.round(t0 * SR); let y = 0, x1 = 0, h = 0;
  const a = Math.exp(-2 * Math.PI * lp / SR), c = Math.exp(-2 * Math.PI * hp / SR);
  for (let i = 0; i < len * SR; i++) { const t = i / SR; const x = rnd();
    h = c * (h + x - x1); x1 = x; y = (1 - a) * h + a * y;
    b.add(s0 + i, y * Math.exp(-t * decay) * amp, pan); }
}
const snare = (b, t0, amp = 1) => { noiseHit(b, t0, amp * .7, 16, 900, 7000, .35); tone(b, t0, 190, .15, amp * .35, 28); };
const clap = (b, t0, amp = 1) => { [0, .011, .022].forEach(d => noiseHit(b, t0 + d, amp * .45, 90, 1100, 5000, .03)); noiseHit(b, t0 + .033, amp * .55, 14, 1000, 6000, .4); };
const hat = (b, t0, amp = 1, open = false, pan = .2) => noiseHit(b, t0, amp * .32, open ? 9 : 55, 7000, 16000, open ? .45 : .08, pan);
const rim = (b, t0, amp = 1) => { tone(b, t0, 1700, .04, amp * .25, 90); noiseHit(b, t0, amp * .25, 80, 2000, 8000, .05); };
function tone(b, t0, f, len, amp, decay, pan = 0) {
  const s0 = Math.round(t0 * SR);
  for (let i = 0; i < len * SR; i++) { const t = i / SR; b.add(s0 + i, Math.sin(2 * Math.PI * f * t) * Math.exp(-t * decay) * amp, pan); }
}
function bass(b, t0, note, dur, amp = 1, bright = .3) {
  const s0 = Math.round(t0 * SR), f = mtof(note); let ph = 0;
  for (let i = 0; i < (dur + .05) * SR; i++) { const t = i / SR; ph += 2 * Math.PI * f / SR;
    const env = Math.min(1, t / .006) * (t < dur ? 1 : Math.exp(-(t - dur) * 60));
    const v = Math.sin(ph) + bright * Math.sin(2 * ph) * .5 + bright * .25 * Math.sin(3 * ph);
    b.add(s0 + i, Math.tanh(v * 1.3) * env * amp * .38); }
}
function pad(b, t0, notes, dur, amp = 1, cutoff = 1400, att = .25) {
  const s0 = Math.round(t0 * SR);
  notes.forEach((m, k) => { [-.12, 0, .11].forEach((det, j) => {
    const f = mtof(m + det); let ph = Math.random(), y = 0; const a = Math.exp(-2 * Math.PI * cutoff / SR); const pan = (j - 1) * .5;
    for (let i = 0; i < (dur + .6) * SR; i++) { const t = i / SR; ph += f / SR; ph -= Math.floor(ph);
      const env = Math.min(1, t / att) * (t < dur ? 1 : Math.exp(-(t - dur) * 6));
      y = (1 - a) * (2 * ph - 1) + a * y; b.add(s0 + i, y * env * amp * .06, pan); } }); });
}
function keys(b, t0, notes, dur, amp = 1, wob = 0) {
  const s0 = Math.round(t0 * SR);
  notes.forEach((m, k) => { const f = mtof(m); const pan = (k / Math.max(1, notes.length - 1) - .5) * .5;
    for (let i = 0; i < (dur + .8) * SR; i++) { const t = i / SR; const vib = 1 + wob * Math.sin(2 * Math.PI * .7 * t) * .004;
      const env = Math.min(1, t / .005) * Math.exp(-t * 1.6) * (t < dur ? 1 : Math.exp(-(t - dur) * 8));
      const p = 2 * Math.PI * f * vib * t;
      const v = Math.sin(p) + .35 * Math.sin(2 * p) * Math.exp(-t * 4) + .12 * Math.sin(3 * p) * Math.exp(-t * 6);
      b.add(s0 + i, v * env * amp * .09, pan); } });
}
function pluck(b, t0, note, amp = 1, pan = 0, cut = 3000) {
  const s0 = Math.round(t0 * SR), f = mtof(note); let ph = 0, y = 0;
  for (let i = 0; i < .35 * SR; i++) { const t = i / SR; ph += f / SR; ph -= Math.floor(ph);
    const c = 300 + cut * Math.exp(-t * 18); const a = Math.exp(-2 * Math.PI * c / SR);
    y = (1 - a) * ((2 * ph - 1) + (ph < .5 ? .6 : -.6)) + a * y; b.add(s0 + i, y * Math.exp(-t * 9) * amp * .16, pan); }
}
function whoosh(b, tPeak, amp = 1, len = .55, up = true) {
  // ruido filtrado con barrido, su pico cae en el corte
  const s0 = Math.round((tPeak - len * .75) * SR); let lp = 0, bp = 0;
  for (let i = 0; i < len * SR; i++) { const t = i / len / SR;
    const fc = up ? 300 + 5200 * Math.pow(t, 1.6) : 5000 - 4500 * t; const f = 2 * Math.sin(Math.PI * Math.min(fc, 8000) / SR), q = .35;
    const x = rnd(); const hp = x - lp - q * bp; bp += f * hp; lp += f * bp;
    const env = t < .75 ? Math.pow(t / .75, 2) : Math.pow(1 - (t - .75) / .25, 1.5);
    b.add(s0 + i, bp * env * amp * .55, Math.sin(t * 6) * .6); }
}
function riser(b, tEnd, len, amp = 1) {
  const s0 = Math.round((tEnd - len) * SR); let lp = 0, bp = 0;
  for (let i = 0; i < len * SR; i++) { const t = i / len / SR; const fc = 200 + 7000 * t * t; const f = 2 * Math.sin(Math.PI * fc / SR);
    const x = rnd(); const hp = x - lp - .3 * bp; bp += f * hp; lp += f * bp; b.add(s0 + i, bp * t * t * amp * .4); }
}
function impact(b, t0, amp = 1) {
  kick(b, t0, amp * 1.1, { f0: 120, f1: 32, decay: 2.2, len: 1.8 });
  noiseHit(b, t0, amp * .6, 6, 40, 1800, 1.2);
  noiseHit(b, t0, amp * .25, 3, 2000, 12000, 1.5);
}
function vinyl(b, t0, len, amp = 1) {
  const s0 = Math.round(t0 * SR); let y = 0;
  for (let i = 0; i < len * SR; i++) { const x = rnd(); y = .02 * x + .98 * y; let v = y * .5; if (Math.random() < .00025) v += rnd() * .6; b.add(s0 + i, v * amp * .25); }
}
function reverb(src, mix = .25, size = 1) {
  const out = new Bus(src.L.length);
  const combs = [1116, 1188, 1277, 1356].map(d => Math.round(d * size));
  for (const [ch, o, off] of [[src.L, out.L, 0], [src.R, out.R, 23]]) {
    const acc = new Float32Array(ch.length);
    for (const d0 of combs) { const d = d0 + off; const buf = new Float32Array(d); let idx = 0, f = 0;
      for (let i = 0; i < ch.length; i++) { const y = buf[idx]; f = y * .6 + f * .4; buf[idx] = ch[i] + f * .78; idx = (idx + 1) % d; acc[i] += y * .25; } }
    for (const d of [556 + off, 341 + off]) { const buf = new Float32Array(d); let idx = 0;
      for (let i = 0; i < acc.length; i++) { const bo = buf[idx]; const y = -acc[i] + bo; buf[idx] = acc[i] + bo * .5; idx = (idx + 1) % d; acc[i] = y; } }
    for (let i = 0; i < ch.length; i++) o[i] = ch[i] + acc[i] * mix;
  }
  return out;
}

// ---------- estilos ----------
const chord = (root, kind) => { const r = n(root); const iv = { m: [0, 3, 7], M: [0, 4, 7], m7: [0, 3, 7, 10], M7: [0, 4, 7, 11], d7: [0, 4, 7, 10], sus: [0, 5, 7] }[kind]; return iv.map(x => r + x); };

export function makeMusic({ style, bpm, total, cuts, endAt, out }) {
  seed = 7; const B = 60 / bpm, len = Math.ceil((total + 1) * SR);
  const drums = new Bus(len), music = new Bus(len), fx = new Bus(len);
  const beats = Math.ceil(total / B) + 1;
  const duck = new Float32Array(len).fill(1);
  const kickD = (t, a = 1, o) => { kick(drums, t, a, o); const s = Math.round(t * SR); for (let i = 0; i < .25 * SR && s + i < len; i++) duck[s + i] = Math.min(duck[s + i], 1 - .6 * Math.exp(-i / SR * 14)); };
  const endB = Math.round(endAt / B);

  if (style === 'trap') { // hamburguesería: 808, palmas, hats rápidos
    const prog = [['F2', 'm'], ['Db2', 'M'], ['Ab1', 'M'], ['Eb2', 'M']];
    for (let bar = 0; bar * 4 < beats; bar++) {
      const t = bar * 4 * B, [r, k] = prog[bar % 4], c = chord(r, k);
      pad(music, t, c.map(x => x + 24), 4 * B - .05, .9, 1600, .05);
      [0, 1.5, 2.5].forEach((p, j) => { if (bar * 4 + p < beats) e808(music, t + p * B, c[0] - 12 + 12, (j == 0 ? 1.4 : .9) * B, .95); kickD(t + p * B, .95); });
      clap(drums, t + 1 * B); clap(drums, t + 3 * B);
      for (let s = 0; s < 8; s++) hat(drums, t + s * B / 2, s % 2 ? .6 : 1);
      if (bar % 2 == 1) for (let s = 0; s < 6; s++) hat(drums, t + 3.5 * B + s * B / 12, .55, false, -.2);
      [0, 2, 3].forEach((p, j) => pluck(music, t + (p + .5) * B, c[j % 3] + 36, .55, j % 2 ? .4 : -.4, 2200));
    }
  } else if (style === 'lofi') { // cafetería: piano suave, swing, vinilo
    const prog = [['C3', 'M7'], ['A2', 'm7'], ['D3', 'm7'], ['G2', 'd7']];
    vinyl(music, 0, total + 1, 1);
    for (let bar = 0; bar * 4 < beats; bar++) {
      const t = bar * 4 * B, [r, k] = prog[bar % 4], c = chord(r, k);
      keys(music, t, c.map(x => x + 12), 2 * B, 1.1, 1); keys(music, t + 2.5 * B, c.map(x => x + 12), 1.4 * B, .7, 1);
      keys(music, t + 1.5 * B, [c[3] + 24], .4 * B, .6, 1); keys(music, t + 3.5 * B, [c[2] + 24], .4 * B, .5, 1);
      bass(music, t, c[0] - 12, 1.8 * B, .9, .15); bass(music, t + 2.5 * B, c[0] - 12, 1.2 * B, .8, .15);
      kickD(t, .75, { decay: 9 }); kickD(t + 2.5 * B, .6, { decay: 9 }); snare(drums, t + B, .55); snare(drums, t + 3 * B, .55);
      for (let s = 0; s < 8; s++) hat(drums, t + s * B / 2 + (s % 2 ? B * .08 : 0), s % 2 ? .35 : .55);
    }
  } else if (style === 'boombap') { // barbería: hip hop clásico
    const prog = [['A2', 'm7'], ['F2', 'M7'], ['D2', 'm7'], ['E2', 'd7']];
    for (let bar = 0; bar * 4 < beats; bar++) {
      const t = bar * 4 * B, [r, k] = prog[bar % 4], c = chord(r, k);
      keys(music, t, c.map(x => x + 12), 3.5 * B, .9, 1); pad(music, t, c.map(x => x + 12), 4 * B - .1, .6, 900, .4);
      [[0, 1.4], [1.75, .7], [2.5, 1.2]].forEach(([p, d]) => bass(music, t + p * B, c[0], d * B, 1, .4));
      kickD(t, 1); kickD(t + 1.75 * B, .8); kickD(t + 2.5 * B, .95);
      snare(drums, t + B, .9); snare(drums, t + 3 * B, .9); rim(drums, t + 3.75 * B, .6);
      for (let s = 0; s < 8; s++) hat(drums, t + s * B / 2 + (s % 2 ? B * .06 : 0), s % 2 ? .5 : .8);
    }
  } else if (style === 'edm') { // gimnasio: four on the floor, arpegios, sidechain
    const prog = [['A2', 'm'], ['F2', 'M'], ['C3', 'M'], ['G2', 'M']];
    for (let bar = 0; bar * 4 < beats; bar++) {
      const t = bar * 4 * B, [r, k] = prog[bar % 4], c = chord(r, k);
      pad(music, t, c.map(x => x + 12), 4 * B - .02, 1.1, 2200, .02);
      for (let s = 0; s < 16; s++) pluck(music, t + s * B / 4, c[[0, 1, 2, 1][s % 4]] + 24 + (s % 8 >= 6 ? 12 : 0), .7, s % 2 ? .35 : -.35, 3500);
      for (let s = 0; s < 8; s++) bass(music, t + (s + .5) * B / 2, c[0] - 12, B * .4, .9, .6);
      for (let q = 0; q < 4; q++) { kickD(t + q * B, 1.05); hat(drums, t + (q + .5) * B, .8, true); }
      clap(drums, t + B, .9); clap(drums, t + 3 * B, .9);
      for (let s = 0; s < 16; s++) hat(drums, t + s * B / 4, .3);
    }
  }
  // efectos en cada corte
  cuts.slice(1).forEach((c, i) => { if (Math.abs(c - endAt) > .01) whoosh(fx, c, style === "lofi" ? .45 : .9); });
  riser(fx, endAt, Math.min(2.2, endAt * .3), .9); impact(fx, endAt, 1.1);
  // mezcla
  const m2 = reverb(music, style === 'lofi' ? .35 : .22, style === 'boombap' ? 1.1 : 1);
  const fxr = reverb(fx, .25, 1.2);
  const L = new Float32Array(len), R = new Float32Array(len);
  for (let i = 0; i < len; i++) { const d = style === 'edm' || style === 'trap' ? duck[i] : 1;
    L[i] = drums.L[i] * .95 + m2.L[i] * d * .9 + fxr.L[i] * .8; R[i] = drums.R[i] * .95 + m2.R[i] * d * .9 + fxr.R[i] * .8; }
  let pk = 0; for (let i = 0; i < len; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
  const g = 1.25 / pk, fadeS = Math.round((total - .8) * SR), endS = Math.round(total * SR);
  const buf = Buffer.alloc(44 + endS * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + endS * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(endS * 4, 40);
  for (let i = 0; i < endS; i++) { const f = i > fadeS ? 1 - (i - fadeS) / (endS - fadeS) : 1;
    const l = Math.tanh(L[i] * g) * .89 * f, r = Math.tanh(R[i] * g) * .89 * f;
    buf.writeInt16LE(Math.round(l * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(r * 32767), 46 + i * 4); }
  fs.writeFileSync(out, buf);
}

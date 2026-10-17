#!/usr/bin/env node
/* EYES: render SOUNDS' own nightInsects buffer (engine/bohemia_horror_sounds.js, the one copy the VOTE page
   plays) to a raw float32 file so a checker can measure it. The engine wants an AudioContext only for
   createBuffer and sampleRate; a stub gives it both. Also renders a hiss of the same band and length as
   the control the card's own claim ("many insects, never a hiss") is measured against.
     node tools/bohemia_eyes_the_insects_render_10_17_26.js -> records/eyes_eight_red_cards/insects.f32, hiss.f32, insects.json */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'records', 'eyes_eight_red_cards');
fs.mkdirSync(OUT, { recursive: true });
global.window = global;
require(path.join(ROOT, 'engine', 'bohemia_horror_sounds.js'));
const H = global.BOH_HORROR_SOUNDS || global.HORROR_SOUNDS || global.H || Object.values(global).find(v => v && typeof v === 'object' && typeof v.nightInsects === 'function');
if (!H) { console.error('no horror sounds export found: ' + Object.keys(global).filter(k => /SOUND|HORROR/i.test(k))); process.exit(1); }
const SR = 44100;
const ctx = { sampleRate: SR, createBuffer: (ch, n, sr) => { const d = new Float32Array(n); return { getChannelData: () => d, length: n, sampleRate: sr, numberOfChannels: ch }; } };
const ins = H.nightInsects(ctx, { secs: 8, ratePerSec: 90 });        /* the VOTE page's own call: secs 8, ratePerSec 90 */
const d = ins.buffer.getChannelData(0);
fs.writeFileSync(path.join(OUT, 'insects.f32'), Buffer.from(d.buffer));
/* the control: white noise through the SAME band filter and normalisation the insects go through */
const n = d.length, hiss = new Float32Array(n); let s = 7;
for (let i = 0; i < n; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; hiss[i] = (s / 0x7fffffff) * 2 - 1; }
H.bandTo(hiss, n, 3000, 6000, SR, 8);
let mx = 0; for (let i = 0; i < n; i++) mx = Math.max(mx, Math.abs(hiss[i])); for (let i = 0; i < n; i++) hiss[i] *= 0.8 / (mx || 1);
fs.writeFileSync(path.join(OUT, 'hiss.f32'), Buffer.from(hiss.buffer));
fs.writeFileSync(path.join(OUT, 'insects.json'), JSON.stringify({ sr: SR, seconds: ins.seconds, clicks: ins.clicks, lo: ins.lo, hi: ins.hi, noiseSources: ins.noiseSources, why: ins.why }, null, 2));
console.log(JSON.stringify({ sr: SR, seconds: ins.seconds, clicks: ins.clicks, lo: ins.lo, hi: ins.hi, noiseSources: ins.noiseSources }));

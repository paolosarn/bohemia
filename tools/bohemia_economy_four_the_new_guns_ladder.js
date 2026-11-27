#!/usr/bin/env node
/* THE NEW GUNS PRICED, THE VOTE CARD'S PICTURE (ECONOMY FOUR 11/27, rule 489(b)): each of ARMORY 3's pieces, its price here over its real
   price (records/target/bb/gun_street.json; weapons.json value at ten to one), one series, the band ceilings as lines, every row labelled.
   Writes records/target/ECONOMY_FOUR_THE_NEW_GUNS_PRICED.jpg.  node tools/bohemia_economy_four_the_new_guns_ladder.js [scratch_dir] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const J = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const G = J('records/target/bb/gun_street.json'), W = J('records/target/bb/weapons.json'), A = J('records/target/bb/armory.json');
const rows = {}; W.rows.forEach(r => rows[r.id] = r); const name = {}; A.weapons.forEach(w => name[w.id] = w.name);
const real = (u) => u / G.day_usd.value * G.aa_a_day.value, P = G.pieces.value, held = G.held.value, B = G.bands.value;
const data = Object.keys(P).map(id => { const g = Math.max(1, Math.round(rows[id].value / 10)), r = real(P[id].usd); return { id, n: name[id], g, r, x: g / r, band: P[id].band, held: !!held[id] }; }).sort((a, b) => b.x - a.x);
const max = 16, W0 = 1150, L = 210, R = 360, bw = W0 - L - R, rh = 30, top = 70;
const xs = (v) => L + Math.min(v, max) / max * bw;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W0}" height="${top + data.length * rh + 60}" font-family="Georgia,serif">`;
svg += `<rect width="100%" height="100%" fill="#ffffff"/>`;
svg += `<text x="16" y="28" font-size="20" fill="#191919">ARMORY 3's new guns: how many times its real price each costs here</text>`;
svg += `<text x="16" y="50" font-size="13" fill="#666666">real price = what it cost before the crash, in US working days ($243) at four AA a day. Bands: a common gun up to x4, army kit up to x8, the burned drone up to x2.</text>`;
[[1,'x1'],[2,'x2 drone'],[4,'x4 common'],[8,'x8 army kit']].forEach(([v,t]) => { svg += `<line x1="${xs(v)}" x2="${xs(v)}" y1="${top-6}" y2="${top + data.length*rh}" stroke="#cfcfcf" stroke-width="1" stroke-dasharray="${v===1?'0':'4 3'}"/><text x="${xs(v)+3}" y="${top + data.length*rh + 16}" font-size="11" fill="#666666">${t}</text>`; });
data.forEach((d, i) => { const y = top + i * rh;
  svg += `<text x="${L-8}" y="${y+18}" font-size="14" fill="#191919" text-anchor="end">${d.n}</text>`;
  const w = Math.max(3, xs(d.x) - L); svg += `<path d="M${L},${y+6} h${w-4} a4,4 0 0 1 4,4 v8 a4,4 0 0 1 -4,4 h-${w-4} z" fill="#257de0"/>`;
  const lab = `${d.g} here, ${d.r.toFixed(0)} real, x${d.x.toFixed(1)}` + (d.held ? (d.id === 'rocket_launcher' ? "  HELD (the handgonne's price)" : '  HELD (the shotgun family)') : '') + (d.id === 'charge_drone' ? '  (was 90, x3.0)' : '') + (d.x > max ? '' : '');
  svg += `<text x="${xs(d.x) + 6}" y="${y+18}" font-size="12" fill="#191919">${lab}</text>`; });
svg += `<text x="16" y="${top + data.length*rh + 42}" font-size="12" fill="#666666">Rounds stay scarce: six rounds 1 AA, about 25 times what they cost. A rocket refills at 30 rounds, 5 AA, about 1.5 times a real one.</text>`;
svg += `</svg>`;
const OUTD = process.argv[2] || require('os').tmpdir(); fs.writeFileSync(path.join(OUTD, 'ladder.svg'), svg);
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
(async () => { const b = await chromium.launch(), p = await b.newPage({ viewport: { width: W0, height: 700 } }); await p.goto('file://' + path.join(OUTD, 'ladder.svg')); const el = await p.$('svg'); await el.screenshot({ path: path.join(ROOT, 'records/target/ECONOMY_FOUR_THE_NEW_GUNS_PRICED.jpg'), type: 'jpeg', quality: 88 }); await b.close(); console.log('wrote records/target/ECONOMY_FOUR_THE_NEW_GUNS_PRICED.jpg'); })();
console.log(data.map(d => d.id + ' ' + d.x.toFixed(1)).join(', '));

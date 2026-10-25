#!/usr/bin/env node
/* ============================================================================
   SIGHT DOWN THE STREET GATE (RUN 10/25, rule 151(g), row [sight down the street]).

   PAOLO 10/24: 'research how far people can realistically see, because it's a city; you should only be able to see things
   straight down a street you're near.' TUNING's distances (b2c89a81): 4 blocks down your street by day, nothing past a
   corner, your own block round you, 1 block at night in the dark, a lit stretch as day.

   THE STRANGER'S GAME (fog: true), his phone, the demo's own valley:
     V1 standing on a street with six blocks of it ahead: 1 to 4 blocks down it are seen by day, 5 is not
     V2 a block off the street's line (a corner) is not seen, nor a block past a building on the line
     V3 the ring round him is always seen
     V4 at night in the dark only the ring; a powered stretch reads as day
     V5 the map draws a roaming party only where he can see it (every one drawn passes, none it skips does)
     V6 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nSIGHT DOWN THE STREET GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  const d = await open({ profile: 'phone_portrait', fog: true });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await page.waitForTimeout(5000);
  const r = await fr.evaluate(() => {
    const N = om.n, out = {};
    /* a street with six blocks of street ahead along +x, and a building block beside its third */
    let at = null;
    for (let y = 3; y < N - 3 && !at; y++) for (let x = 3; x < N - 9 && !at; x++) {
      let run = true; for (let k = 0; k <= 6; k++) if (!sightRoad(x + k, y)) { run = false; break; }
      if (run && !sightRoad(x + 2, y + 2) && cityWalkable(x, y)) at = [x, y];
    }
    if (!at) return { none: true };
    const keep = [city.x, city.y], keepMin = DAY.min;
    city.x = at[0]; city.y = at[1]; DAY.min = 12 * 60; daySync();
    out.at = at;
    out.down = [1, 2, 3, 4, 5].map(k => mapSees(at[0] + k, at[1]));
    out.corner = mapSees(at[0] + 2, at[1] + 2);
    out.ring = [[1, 1], [-1, 0], [0, -1], [1, -1]].map(o => mapSees(at[0] + o[0], at[1] + o[1]));
    /* a building on the line: find one along +y from a street block */
    let past = null;
    for (let y = 3; y < N - 6 && !past; y++) for (let x = 3; x < N - 3 && !past; x++) {
      if (sightRoad(x, y) && sightRoad(x, y + 1) && !sightRoad(x, y + 2) && cityWalkable(x, y)) past = [x, y];
    }
    if (past) { city.x = past[0]; city.y = past[1]; out.past = { at: past, beyond: mapSees(past[0], past[1] + 3), before: mapSees(past[0], past[1] + 1) }; }
    /* night, in the dark and lit */
    city.x = at[0]; city.y = at[1]; DAY.min = 23 * 60; daySync();
    out.night = [1, 2, 3].map(k => ({ k, lit: sightLit(at[0] + k, at[1]), seen: mapSees(at[0] + k, at[1]) }));
    /* what the map draws */
    DAY.min = 12 * 60; daySync();
    for (let k = 0; k < 6; k++) partiesAdvance(60);
    MAP_DREW = {}; render();
    const drawnIds = Object.keys(MAP_DREW.partyAt || {});
    const all = (partiesAll() || []).filter(p => p && p.at);
    out.drawn = drawnIds.length; out.unseen = MAP_DREW.unseen | 0;
    out.bad = drawnIds.filter(id => { const p = all.find(q => String(q.id) === id); return p && !mapSees(p.at.x | 0, p.at.y | 0); });
    city.x = keep[0]; city.y = keep[1]; DAY.min = keepMin; daySync();
    return out;
  });
  if (r.none) { ok('a street with six blocks ahead exists on the valley', false); return done(); }
  ok('V1 down his street by day: 1 to 4 blocks seen, 5 not', r.down.slice(0, 4).every(Boolean) && !r.down[4], r.at.join(',') + ': ' + r.down.map(v => v ? 'Y' : 'n').join(''));
  ok('V2 a corner is not seen, nor a block past a building on the line', !r.corner && (!r.past || (!r.past.beyond && r.past.before)), 'corner ' + r.corner + (r.past ? ', past a building ' + r.past.beyond + ' (before it ' + r.past.before + ')' : ''));
  ok('V3 the ring round him is always seen', r.ring.every(Boolean), r.ring.join(','));
  ok('V4 at night, the dark is the ring and a lit stretch reads as day', r.night.every(n => n.k === 1 ? n.seen : (n.seen === (n.lit && r.night.slice(0, n.k).every(m => m.lit)))) || r.night.filter(n => n.k > 1).every(n => !n.lit && !n.seen),
     r.night.map(n => n.k + (n.lit ? 'L' : 'd') + (n.seen ? 'Y' : 'n')).join(' '));
  ok('V5 the map draws a party only where he can see it', r.bad.length === 0 && (r.drawn + r.unseen) > 0, r.drawn + ' drawn, ' + r.unseen + ' out of sight, ' + r.bad.length + ' drawn unseen');
  ok('V6 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });

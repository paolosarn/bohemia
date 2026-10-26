// THE FIGHT CARRIES A LITTLE FROM ONE FIGHT TO THE NEXT (WORLD, 10/26/26, found by rule 254's gate; COMBAT's to find, NOTEd).
// Fifteen fights the job reader played in the demo's worker (A New Crew on day 3), each with its exact hand-over and dice
// (tools/bohemia_world_the_fight_carries_over.json: the page's own PLAYED entries, kept with window.__JOB_DANGER_KEEP). Each is
// played here on the fight's own rules out of slices/BOHEMIA_FIGHT.html with the fight's own count (oddsRunValue): fresh, then
// again after the others. The same fight on the same dice should give the same number every time; it does not always.
// MEASURED 10/26: in node, 1 of 15 moved after the others were played on the same copy (direwolf, hyena, hyena, rail: play 7);
// and 5 of 15 came out different from the page's worker on the same hand-over and dice (the machines, the kids, the heavies:
// 57 against 60, 82.67 against 86 of 96), while the worker's tables equal the files byte for byte and the hand-overs carry no
// value a copy would change. So something in the rules' closures carries over, and the worker had played many fights first.
//   node tools/bohemia_world_the_fight_carries_over.js
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), L = JSON.parse(fs.readFileSync(path.join(__dirname, 'bohemia_world_the_fight_carries_over.json'), 'utf8'));
async function engine() {
  const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const grab = id => html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>'))[1];
  const orv = html.match(/function oddsRunValue\(E\) \{[\s\S]*?\n\}/)[0];
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Error, Promise, Set, Map, LSV: {},
    localStorage: { getItem: k => (ctx.LSV[k] === undefined ? null : ctx.LSV[k]), setItem: () => {}, removeItem: () => {} },
    fetch: u => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', u.split('?')[0]), 'utf8'))) }) };
  vm.createContext(ctx);
  vm.runInContext(grab('fight-data') + '\n' + grab('fight-rules') + '\n' + orv + '\nthis.FIGHT = FIGHT; this.loadAll = loadAll; this.run = oddsRunValue; this.seed = function (v) { SEED = v >>> 0; };', ctx);
  await ctx.loadAll(); return ctx;
}
function one(E, x, n) {
  E.LSV = { 'bohemia.fight.formation.v1': x.formation }; E.seed((x.seed + n * 7919) >>> 0); E.FIGHT.setup(JSON.parse(JSON.stringify(x.opts)));
  let g = 0; while (!E.FIGHT.S.over && g <= x.steps) { const v = E.FIGHT.current(); if (!v) break; E.FIGHT.aiStep(v); E.FIGHT.S.events = []; g++; }
  return E.FIGHT.S.over ? E.run(E.FIGHT) : 0;
}
(async () => {
  let moved = 0, apart = 0;
  for (const x of L) {
    const A = await engine(), fresh = []; for (let n = 0; n < x.runs; n++) fresh.push(one(A, x, n));
    const B = await engine(); L.forEach(y => { if (y !== x) for (let n = 0; n < Math.min(12, y.runs); n++) one(B, y, n); });
    const after = []; for (let n = 0; n < x.runs; n++) after.push(one(B, x, n));
    const sf = fresh.reduce((t, v) => t + v, 0), sa = after.reduce((t, v) => t + v, 0), runs = fresh.map((v, n) => v !== after[n] ? n : -1).filter(n => n >= 0);
    if (runs.length) moved++; if (Math.abs(sf - x.sum) > 1e-9) apart++;
    console.log((runs.length ? 'MOVED ' : 'same  ') + x.fk.split('|').slice(1).join('|').padEnd(70) + ' ' + x.runs + ' plays: the page ' + x.sum.toFixed(2) + ', fresh ' + sf.toFixed(2) + ', after the others ' + sa.toFixed(2) + (runs.length ? ' (plays ' + runs.slice(0, 6).join(', ') + ' changed)' : ''));
  }
  console.log('\n' + moved + ' of ' + L.length + ' fights came out different on the same dice after other fights were played on the same copy;');
  console.log(apart + ' of ' + L.length + ' came out different here from the page\'s worker, which had played many fights first.');
})();

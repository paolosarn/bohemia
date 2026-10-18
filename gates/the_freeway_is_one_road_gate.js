#!/usr/bin/env node
/* ============================================================================
   THE FREEWAY IS ONE ROAD  (WORLD, 10/18/26; row [the freeway as one road in
   the data], the coordinator, from Paolo 10/18: 'the freeway as it runs
   through the city should be unified, it doesn't look unified, it looks
   really bad'; for RUN's [one freeway, and nobody is an icon]).
   Record: records/BOHEMIA_WORLD_THE_FREEWAY_IS_ONE_ROAD_10_18_26.md

   engine/bohemia_freeways.js names every valley freeway cell by its real
   highway and joins each real freeway into ONE ordered road, valley pairs two
   abreast, from the region's rim through the valley to the rim; the region's
   own blocks come from engine/BOHEMIA_REGION_LAND.json freewayPaths.

   IT REFUSES:
   A. THE DATA: a class-1 road without its path; a path with a hole; a path
      that enters the valley's box; a path that does not start at its portal.
   B. THE GAME'S SEED (read out of the CITY frame): a valley freeway cell with
      no name; a pair with one half; I-15 with a hole or an end short of the
      rim, or not through the Spaghetti Bowl; CC-215 not a closed loop; US-95's
      north-west leg broken; a class-1 highway joined at the rim to an exit one
      cell wide; a step with no district; ANY break (10/18, the coordinator's
      first: the roll now lays THE HENDERSON LEG, I-515 / US-93 out of the
      ring's east side, so the 14-block gap toward Henderson is closed); the
      roll's leg row out of step with the region's I-515 portal; I-515 / US-93
      not joined to the leg.
   C. TWENTY SEEDS: the same, every seed; no break on any seed; the leg on every
      seed with I-515 / US-93 joined to it.
   D. RUN'S SWAP: the joins by name land in the loader's own connector table
      (the clock and the pass grid see them).
   AND IT PRINTS, NEVER REDS: what today's stitch() joins each valley exit to.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const P = p => path.join(ROOT, p);
const read = p => fs.readFileSync(P(p), 'utf8');
const OM = require('../engine/bohemia_overmap.js');
const RL = require('../engine/bohemia_region_land.js');
const FW = require('../engine/bohemia_freeways.js');
const JSON_ = JSON.parse(read('engine/BOHEMIA_REGION_LAND.json'));

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const say = (n, note) => console.log('  NOTE ' + n + (note ? '  (' + note + ')' : ''));
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };

/* THE KNOWN BREAKS: none since 10/18. Before, the roll laid no freeway toward I-515 / US-93 (Henderson): 14 blocks
   on the game's seed, 16 of 20 seeds, up to 20 blocks. The Henderson leg (engine/bohemia_overmap.js) closed it. */
const KNOWN = { seedBreaks: 0, seedGap: 0, toward: 'I-515 / US-93', seedsWithBreaks: 0, worstGap: 0 };
/* the leg's join to the real road: blocks of made rim between the leg and the portal (measured 10/18: 3 on the game's
   seed; over 200 seeds median 3, worst 21, where the water cluster holds the real south-east corner) */
const LEG_MADE = { seed: 3, worst: 32 };   /* 10/18: worst 31 over 210 seeds, on valleys whose solar field holds the real-east border */
const SIX = ['I-15 S', 'I-15 N', 'US-95 NW', 'I-515 / US-93', 'I-11 / US-93', 'US-95 S'];

console.log('THE FREEWAY IS ONE ROAD: every real freeway, one road from rim to rim');

/* the game's seed, out of the CITY frame (as THE ONE RULER reads it) */
const frame = read('slices/BOHEMIA_CITY_WORLD.html');
let seed = null;
{
  const st = frame.match(/const BOH_SEED_TEXT='([^']+)'/);
  const hs = frame.indexOf('function BOH_HASH_SEED(');
  if (st && hs >= 0) seed = new Function(frame.slice(hs, frame.indexOf('return (h^(h>>>16))>>>0; }', hs) + 27) + '\nreturn BOH_HASH_SEED;')()(st[1]);
}

function pathHoles(p) { let h = 0; for (let i = 1; i < p.length; i++) if (Math.abs(p[i][0] - p[i - 1][0]) + Math.abs(p[i][1] - p[i - 1][1]) !== 1) h++; return h; }

function audit(F) {
  const f = n => F.freeways.find(x => x.name === n) || { steps: [], holes: [{}], breaks: [], interchanges: [], ramps: [], ends: [] };
  const N = 96, K = JSON_.K, onRim = e => e && (e[0] <= -K || e[1] <= -K || e[0] >= N + K - 1 || e[1] >= N + K - 1);
  const i15 = f('I-15'), us95 = f('US-95'), ring = f('CC-215');
  const throughBowl = fw => fw.interchanges.some(i => i.name === 'THE SPAGHETTI BOWL');
  const bowlAt = us95.steps.findIndex(s => s.node && fw_isBowl(F, s.node));
  const nwHoles = us95.holes.filter(h => bowlAt < 0 || h.i <= bowlAt).length;
  const badJoin = F.joins.filter(j => j.cls === 1 && F.exits.find(e => e.edge === j.edge && e.c === j.c && e.w < 2));
  const noDistrict = F.freeways.reduce((n, fw) => n + fw.steps.filter(s => s.where !== 'valley' && !s.district).length, 0);
  const pairs = Object.keys(F.cells).filter(k => F.cells[k].seg && F.cells[k].axis && !F.cells[k].junction);
  const noMedian = pairs.filter(k => { const c = F.cells[k]; const seg = F.segments.find(s => s.id === c.seg); return seg && seg.w === 2 && !c.median; }).length;
  return { i15, us95, ring, onRim, throughBowl, nwHoles, badJoin, noDistrict, noMedian,
           breaks: F.breaks, offToward: F.breaks.filter(b => b.at !== KNOWN.toward) };
}
function fw_isBowl(F, id) { const j = F.junctions.find(x => x.id === id); return !!(j && j.bowl); }

section('A. the region\'s freeways as data', () => {
  const fp = JSON_.freewayPaths || {};
  ok('A1 the region file carries every class-1 road\'s path', SIX.every(n => fp[n] && fp[n].path.length > 10), SIX.map(n => n + ' ' + (fp[n] ? fp[n].path.length : 0)).join(', '));
  ok('A2 every path is one block to the next, no hole', SIX.every(n => fp[n] && pathHoles(fp[n].path) === 0), SIX.map(n => n + ' ' + (fp[n] ? pathHoles(fp[n].path) : '-')).join(', '));
  ok('A3 no path enters the valley\'s box (the roll\'s streets are the valley\'s)', SIX.every(n => fp[n] && fp[n].path.every(c => !(c[0] >= 0 && c[1] >= 0 && c[0] < 96 && c[1] < 96))));
  const portal = n => (JSON_.portals || []).find(p => p.road === n);
  ok('A4 a path that starts in the valley starts at its own portal', SIX.filter(n => fp[n] && fp[n].startsInValley).every(n => { const p = portal(n); return p && fp[n].path[0][0] === p.x && fp[n].path[0][1] === p.y; }),
     SIX.filter(n => fp[n] && fp[n].startsInValley).join(', '));
  ok('A5 every path\'s district runs add up to its blocks', SIX.every(n => fp[n] && fp[n].districts.reduce((s, r) => s + r[1], 0) === fp[n].path.length));
});

const land = RL.load(JSON_);
let F = null, A = null;
section('B. the game\'s seed', () => {
  ok('B0 the seed reads out of the CITY frame', typeof seed === 'number', String(seed));
  const om = OM.buildOvermap(typeof seed === 'number' ? seed : 2691674296);
  F = FW.of(om, land); A = audit(F);
  ok('B1 every valley freeway cell carries a name', F.counts.orphans === 0 && F.counts.cells >= F.counts.freewayCells, F.counts.freewayCells + ' cells, ' + F.counts.orphans + ' unnamed');
  ok('B2 every pair has both halves, and every half knows which side its sibling is on', F.counts.lonely === 0 && A.noMedian === 0, F.counts.lonely + ' lone halves, ' + A.noMedian + ' without a median side');
  ok('B3 I-15 is one road, rim to rim, through the Spaghetti Bowl', A.i15.holes.length === 0 && A.onRim(A.i15.ends[0]) && A.onRim(A.i15.ends[1]) && A.throughBowl(A.i15),
     A.i15.steps.length + ' steps: ' + A.i15.districts.map(r => r[0] + ' ' + r[1]).join(', '));
  ok('B4 CC-215 is one closed loop inside the valley', A.ring.loop === true && A.ring.steps.every(s => s.where === 'valley'), A.ring.steps.length + ' steps, ' + A.ring.interchanges.length + ' interchanges, ' + A.ring.ramps.length + ' ramps');
  ok('B5 US-95 from the north-west reaches the bowl unbroken', A.us95.holes.length >= 0 && A.nwHoles === 0 && A.throughBowl(A.us95), A.us95.steps.length + ' steps');
  ok('B6 no class-1 highway is joined at the rim to an exit one cell wide (a pass is a state route)', A.badJoin.length === 0,
     F.joins.map(j => j.road + ' <- ' + j.piece + ' (' + j.made + ' made)').join('; '));
  ok('B7 every step past the valley carries its real district', A.noDistrict === 0);
  ok('B8 the valley\'s I-15 has its lanes and its ramps (an exit at every mile street it crosses)', A.i15.steps.filter(s => s.where === 'valley' && !s.junction).every(s => s.lanes === 5) && A.i15.ramps.length >= 10,
     A.i15.ramps.length + ' ramps, ' + A.i15.interchanges.length + ' interchanges, 5 lanes each way');
  ok('B9 no break: every real freeway reaches its portal (the Henderson leg closed the 14 blocks toward ' + KNOWN.toward + ')', A.offToward.length === 0 && A.breaks.length <= KNOWN.seedBreaks && A.breaks.every(b => (b.gap || 0) <= KNOWN.seedGap),
     A.breaks.map(b => b.name + ' toward ' + b.at + ', ' + b.gap + ' blocks').join('; ') || 'none');
  for (const b of A.breaks) say('BREAK, the roll\'s (row [the roll])', b.name + ': ' + b.why + '; the nearest valley freeway is ' + b.gap + ' blocks from it, at ' + JSON.stringify(b.from));
  const legY = +((read('engine/bohemia_overmap.js').match(/const HENDERSON_Y=(\d+);/) || [])[1]), p515 = (JSON_.portals || []).find(p => p.road === KNOWN.toward);
  ok('B10 the roll aims the Henderson leg at the real I-515\'s row (the region file\'s portal)', !!p515 && legY === p515.y, 'roll ' + legY + ', region ' + (p515 && p515.y));
  const j515 = F.joins.find(j => j.road === KNOWN.toward), H = om.layout.henderson;
  ok('B11 I-515 / US-93 joins the Henderson leg at the rim, ' + LEG_MADE.seed + ' made blocks at most', !!H && !!j515 && j515.piece === 'henderson' && j515.made <= LEG_MADE.seed,
     H ? 'leg rows ' + H.y + '-' + (H.y + 1) + ' (' + H.kind + '), ' + (j515 ? j515.made + ' made' : 'not joined') : 'no leg');
  say('made road at the rim (blocks the real map does not have, the seam)', F.joins.map(j => j.road + ' ' + j.made).join(', '));
  /* today's stitch, for RUN: what the nearest-portal-on-the-same-side join gives this valley */
  const N = om.n, L = om.layout, road = new Uint8Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const t = om.at(x, y); road[y * N + x] = /^(freeway|beltway|interchange)$/.test(t && t.district || '') ? 1 : 0; }
  const ex = [];
  ['x0', 'x1', 'y0', 'y1'].forEach(en => { let run = []; const flush = () => { if (!run.length) return; ex.push({ edge: en, c: (run[0] + run[run.length - 1]) / 2 + 0.5 }); run = []; };
    for (let k = 0; k <= N; k++) { const isR = k < N && road[en === 'x0' ? k * N : en === 'x1' ? k * N + N - 1 : en === 'y0' ? k : (N - 1) * N + k]; if (isR) run.push(k); else flush(); } });
  const today = RL.load(JSON_).stitch(ex, F.compass).filter(o => o.stitched || o.unstitched);
  const named = {}; F.exits.forEach(e => named[e.edge + ':' + Math.round(e.c - 0.5)] = e.road);
  say('today\'s stitch() (nearest portal on the same side) joins', today.map(o => o.edge + ':' + o.c + ' -> ' + (o.to || 'nothing') + (named[o.edge + ':' + o.c] && named[o.edge + ':' + o.c] !== o.to ? ' (by name: ' + named[o.edge + ':' + o.c] + ')' : '')).join('; '));
});

section('C. twenty seeds', () => {
  const seeds = [typeof seed === 'number' ? seed : 2691674296]; for (let i = 1; i < 20; i++) seeds.push(i * 7919);
  let orph = 0, lone = 0, i15bad = [], ringBad = [], nwBad = [], off = [], withBreaks = 0, worst = 0, joinBad = 0, legBad = [], legWorst = 0, noLegSeeds = [];
  for (const sd of seeds) {
    const G = FW.of(OM.buildOvermap(sd), land), B = audit(G);
    orph += G.counts.orphans; lone += G.counts.lonely + B.noMedian; joinBad += B.badJoin.length;
    if (B.i15.holes.length || !B.onRim(B.i15.ends[0]) || !B.onRim(B.i15.ends[1]) || !B.throughBowl(B.i15)) i15bad.push(sd);
    if (B.ring.loop !== true) ringBad.push(sd);
    if (B.nwHoles) nwBad.push(sd);
    if (B.offToward.length) off.push(sd + ' ' + B.offToward.map(b => b.at).join('/'));
    if (G.breaks.length) withBreaks++;
    G.breaks.forEach(b => worst = Math.max(worst, b.gap || 0));
    const jl = G.joins.find(j => j.road === KNOWN.toward), hasLeg = !!OM.buildOvermap(sd).layout.henderson;
    /* the leg where the roll could lay it; where the solar field holds the real-east border it lays none, and I-515
       takes the exit stub already there (C6 holds it to no break) */
    if (!jl || (hasLeg && jl.piece !== 'henderson')) legBad.push(sd); else legWorst = Math.max(legWorst, jl.made);
    if (!hasLeg) noLegSeeds.push(sd);
  }
  ok('C1 every seed: every valley freeway cell named, every pair whole', orph === 0 && lone === 0, orph + ' unnamed, ' + lone + ' halves wrong');
  ok('C2 every seed: I-15 one road rim to rim through the bowl', i15bad.length === 0, i15bad.join(', ') || '20 of 20');
  ok('C3 every seed: CC-215 closes', ringBad.length === 0, ringBad.join(', ') || '20 of 20');
  ok('C4 every seed: US-95 from the north-west reaches the bowl', nwBad.length === 0, nwBad.join(', ') || '20 of 20');
  ok('C5 every seed: no class-1 highway joined to a one-cell exit', joinBad === 0);
  ok('C6 no break on any seed (was 16 of 20, up to 20 blocks toward ' + KNOWN.toward + ')', off.length === 0 && withBreaks <= KNOWN.seedsWithBreaks && worst <= KNOWN.worstGap,
     withBreaks + ' of 20 seeds, worst ' + worst + ' blocks' + (off.length ? '; elsewhere: ' + off.join(', ') : ''));
  ok('C7 every seed: I-515 / US-93 joins the Henderson leg (or, where the solar field holds that border, the stub there), ' + LEG_MADE.worst + ' made blocks at most', legBad.length === 0 && legWorst <= LEG_MADE.worst,
     (legBad.length ? 'not joined on ' + legBad.join(', ') : '20 of 20') + ', worst ' + legWorst + ' made' + (noLegSeeds.length ? '; no leg (solar) on ' + noLegSeeds.join(', ') : ''));
});

section('D. RUN\'s swap: the joins by name are the loader\'s own connectors', () => {
  const L2 = RL.load(JSON_), st = FW.stitch(F, L2, F.compass), pg = L2.passGrid(F.compass);
  const j = F.joins.find(x => x.road === 'I-15 N'), mid = j && j.cells[Math.floor(j.cells.length / 2)];
  const at = mid ? L2.at(mid[0], mid[1], F.compass) : null;
  ok('D1 stitch() by name returns a line for every join, in stitch()\'s shape', st.filter(o => o.stitched).length === F.joins.length && st.some(o => o.cls), F.joins.length + ' joins');
  ok('D2 the clock and the pass grid see the I-15 north join as a road', !!at && at.road === 1 && at.speed === 'paved',
     mid ? 'block ' + mid.join(',') + ': ' + (at && at.speed) : 'no I-15 N join');
  ok('D3 the pass grid is still the whole region', pg.length === JSON_.D * JSON_.D);
});

section('M. mutations, each must go red (and the module stays pure)', () => {
  const sd = typeof seed === 'number' ? seed : 2691674296, om = OM.buildOvermap(sd), L = om.layout;
  const wrap = (over) => ({ n: om.n, seed: om.seed, layout: om.layout, tiles: om.tiles, at: (x, y) => over[x + ',' + y] ? Object.assign({}, om.at(x, y), { district: over[x + ',' + y] }) : om.at(x, y) });
  /* cut where no other freeway can carry it round: the spine between the ring and the valley's south edge (a cut
     inside the ring is not a break, the route goes round by the 215, as real traffic would) */
  const y0 = L.beltRect.bot + 3;
  let G = FW.of(wrap({ [L.fwyX + ',' + y0]: 'desert', [(L.fwyX + 1) + ',' + y0]: 'desert' }), land);
  ok('M1 the spine cut across below the ring: I-15 breaks, and says so', G.breaks.some(b => b.name === 'I-15'), G.breaks.filter(b => b.name === 'I-15').map(b => b.why).join('; ') || 'holes ' + audit(G).i15.holes.length);
  G = FW.of(wrap({ [L.fwyX + ',' + 60]: 'desert', [(L.fwyX + 1) + ',' + 60]: 'desert' }), land);
  ok('M1b the spine cut inside the ring: I-15 still one road, round by the 215', audit(G).i15.holes.length === 0 && !G.breaks.some(b => b.name === 'I-15'), audit(G).i15.steps.length + ' steps (' + F.freeways[0].steps.length + ' uncut)');
  G = FW.of(wrap({ [L.fwyX + ',' + y0]: 'desert' }), land);
  ok('M2 one half of a pair gone: a lone half', G.counts.lonely > 0, G.counts.lonely + ' lone');
  const bowlOver = {}; for (let y = L.bowl.y; y < L.bowl.y + L.bowl.h; y++) for (let x = L.bowl.x; x < L.bowl.x + L.bowl.w; x++) bowlOver[x + ',' + y] = 'freeway';
  G = FW.of(wrap(bowlOver), land);
  ok('M3 the Spaghetti Bowl gone: I-15 is not through it', !audit(G).throughBowl(audit(G).i15));
  const bad = JSON.parse(JSON.stringify(JSON_)); bad.freewayPaths['I-15 N'].path.splice(40, 1);
  ok('M4 a hole in a region path', pathHoles(bad.freewayPaths['I-15 N'].path) > 0);
  const moved = JSON.parse(JSON.stringify(JSON_)); moved.portals = moved.portals.filter(p => p.road !== 'I-15 S');
  G = FW.of(om, RL.load(moved));
  ok('M5 the I-15 S portal gone: I-15 breaks toward it, never silently', G.breaks.some(b => b.name === 'I-15'), G.breaks.filter(b => b.name === 'I-15').map(b => b.why).join('; '));
  const H = om.layout.henderson, noLeg = {};
  if (H) for (let x = H.x0; x <= H.x1; x++) { noLeg[x + ',' + H.y] = 'desert'; noLeg[x + ',' + (H.y + 1)] = 'desert'; }
  const wl = wrap(noLeg); wl.layout = Object.assign({}, om.layout, { henderson: null });
  G = FW.of(wl, land);
  ok('M7 the Henderson leg gone: the break toward ' + KNOWN.toward + ' comes back, said', G.breaks.some(b => b.at === KNOWN.toward), G.breaks.filter(b => b.at === KNOWN.toward).map(b => b.name + ', ' + b.gap + ' blocks').join('; '));
  const again = FW.of(om, land);
  ok('M6 pure: the same valley gives the same answer', JSON.stringify(again.counts) === JSON.stringify(F.counts) && again.freeways.map(f => f.steps.length).join() === F.freeways.map(f => f.steps.length).join());
});

console.log('\n' + (fail ? 'THE FREEWAY IS ONE ROAD: RED' : 'THE FREEWAY IS ONE ROAD: GREEN') + '  ' + pass + '/' + fail);
process.exit(fail ? 1 : 0);

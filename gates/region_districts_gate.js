#!/usr/bin/env node
/* ============================================================================
   THE DISTRICTS JOIN  (WORLD, 10/18/26, row [the districts as data, joined])

   Paolo 10/18 on the map: 'the districts are looking like shit, the streets
   looking like shit, doesn't look like shit's connected that smart like it
   should.' RUN can only join the streets if the data says where every district
   ends and which road crosses each edge. engine/BOHEMIA_REGION_LAND.json now
   carries the real districts of the Las Vegas region (written by
   tools/bohemia_world_region.py through tools/bohemia_world_region_districts.py)
   and engine/bohemia_region_land.js reads them in RUN's compass.

   IT REFUSES:
   A. A BLOCK WITH NO DISTRICT, or the valley's box not wholly the Las Vegas Valley.
   B. A DISTRICT IN TWO PIECES. A line is a line; an island is a mistake.
   C. A SEAT OUTSIDE ITS DISTRICT (Boulder City in the Eldorado Valley, Primm in
      the Ivanpah Valley, Pahrump in its own valley...).
   D. A LINE THAT IS NOT ON THE GROUND. The lines must sit on rough ground (a
      ridge, a wash, the water) far more than the region does; the California
      line is the real survey line, block for block.
   E. A ONE-SIDED CROSSING. Every crossing is two neighbouring blocks, the near
      one in the district it leaves and the far one in the district it enters,
      both road, each with the road's name on its side.
   F. A ROAD THAT ZIGZAGS ALONG A LINE (A to B and straight back to A).
   G. A ROAD THAT DEAD-ENDS AT NOTHING. Every end is a real end, checked against
      the land itself, not the data's own label: the rim, the valley's box, a
      junction, a place, the water, or a named gate. Zero breaks; an end on a
      district line is never a break.
   H. A SEAT THE ROADS CANNOT REACH. Every district with a seat is reached from
      the Las Vegas Valley across the lines by road.
   I. THE REAL NAMES LOST: NV-160 becomes the Pahrump Valley Highway at the
      Pahrump line, NV-159 is Red Rock Canyon Road in Red Rock, NV-147 becomes
      Northshore Road, old US-93 is Nevada Way in Boulder City.
   J. A LOADER THAT READS ANOTHER MAP ON THE MIRRORED COMPASS.
   M. ITS OWN BLINDNESS: three mutations, each must go red.
   AND IT PRINTS: the districts, their roads, the roadless ones.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const P = p => path.join(ROOT, p);
const RL = require('../engine/bohemia_region_land.js');
const JSONTEXT = fs.readFileSync(P('engine/BOHEMIA_REGION_LAND.json'), 'utf8');
const C1 = { e: 'x1' }, C0 = { e: 'x0' };

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };
const SIDE = [[0, -1], [1, 0], [0, 1], [-1, 0]];

/* ---- the checks, as functions, so the mutations can run them on a broken copy ---- */
function grid(L) {
  const { N, K } = L, out = {};
  for (let y = -K; y < N + K; y++) for (let x = -K; x < N + K; x++) { const d = L.districtAt(x, y, C1); out[x + ',' + y] = d ? d.id : null; }
  return out;
}
function pieces(L, G) {
  const { N, K } = L, seen = new Set(), count = {};
  for (let y = -K; y < N + K; y++) for (let x = -K; x < N + K; x++) {
    const k = x + ',' + y; if (seen.has(k) || !G[k]) continue;
    const id = G[k]; count[id] = (count[id] || 0) + 1; const st = [[x, y]]; seen.add(k);
    while (st.length) {
      const [cx, cy] = st.pop();
      for (const [dx, dy] of SIDE) { const nk = (cx + dx) + ',' + (cy + dy); if (!seen.has(nk) && G[nk] === id) { seen.add(nk); st.push([cx + dx, cy + dy]); } }
    }
  }
  return count;
}
function crossingFaults(L) {
  const bad = [];
  for (const c of L.lineCrossings(C1)) {
    const a = L.districtAt(c.fromX, c.fromY, C1), b = L.districtAt(c.x, c.y, C1);
    const near = Math.abs(c.x - c.fromX) + Math.abs(c.y - c.fromY) === 1;
    const roadA = L.inValley(c.fromX, c.fromY) || (L.at(c.fromX, c.fromY, C1) || {}).road > 0;
    const roadB = L.inValley(c.x, c.y) || (L.at(c.x, c.y, C1) || {}).road > 0;
    if (!a || !b || a.name !== c.from || b.name !== c.to || !near || !roadA || !roadB || !c.nameFrom || !c.nameTo) bad.push(c.road + ' ' + c.from + '>' + c.to);
  }
  return bad;
}
function endFaults(L) {
  const { N, K } = L, bad = [];
  const roadAt = (x, y) => L.inValley(x, y) || ((L.at(x, y, C1) || {}).road > 0);
  for (const e of L.roadEnds(C1)) {
    const { x, y } = e; let real = false;
    if (e.kind === 'rim') real = x === -K || y === -K || x === N + K - 1 || y === N + K - 1;
    else if (e.kind === 'valley') real = x >= -1 && y >= -1 && x <= N && y <= N;
    else if (e.kind === 'place') real = !!L.placeAt(x, y, 2, C1);
    else if (e.kind === 'water') { for (const [dx, dy] of [[0, 0], ...SIDE, [1, 1], [-1, -1], [1, -1], [-1, 1]]) if ((L.at(x + dx, y + dy, C1) || {}).water) real = true; }
    else if (e.kind === 'junction') { let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && roadAt(x + dx, y + dy)) n++; real = n >= 2; }
    else if (e.kind === 'gate') real = typeof e.what === 'string' && e.what.length > 12;
    if (!real) bad.push(e.road + ' end ' + e.end + ' (' + e.kind + ')');
  }
  return bad;
}

/* ---- the run ---- */
const L = RL.load(JSON.parse(JSONTEXT));
const J = L.json;
const DS = L.districts();
const G = grid(L);
console.log('THE DISTRICTS JOIN: ' + DS.length + ' real districts of the Las Vegas region, ' + J.lineCrossings.length + ' road crossings');

section('A. every block has its district', () => {
  const ids = new Set(DS.map(d => d.id));
  let none = 0, unknown = 0, valleyOff = 0;
  for (const k in G) { if (!G[k]) none++; else if (!ids.has(G[k])) unknown++; }
  for (let y = 0; y < L.N; y++) for (let x = 0; x < L.N; x++) if ((L.districtAt(x, y, C1) || {}).name !== 'LAS VEGAS VALLEY') valleyOff++;
  ok('A1 every one of the ' + (L.D * L.D) + ' blocks is in a district', none === 0 && unknown === 0, none + ' none, ' + unknown + ' unknown');
  ok('A2 the valley\'s box is the Las Vegas Valley, whole', valleyOff === 0, valleyOff + ' off');
  ok('A3 the legend, the rows and the list agree (' + DS.length + ')', Object.keys(J.districtLegend).length === DS.length && DS.length >= 20 && DS.every(d => J.districtLegend[d.id] === d.name));
  ok('A4 the blocks counted per district add up', DS.reduce((a, d) => a + d.blocks, 0) === L.D * L.D);
});

section('B. a district is one piece', () => {
  const c = pieces(L, G), two = Object.keys(c).filter(k => c[k] > 1);
  ok('B1 every district is one connected piece', two.length === 0, two.length ? two.join(',') : DS.length + ' pieces for ' + DS.length + ' districts');
});

section('C. the seats sit in their districts', () => {
  const pl = L.places(C1), off = [];
  for (const d of DS) {
    if (!d.seat) continue;
    const p = pl.find(q => q.name === d.seat);
    const at = p && L.districtAt(p.x, p.y, C1);
    if (!at || at.id !== d.id) off.push(d.seat + ' (' + (at ? at.name : 'nowhere') + ')');
  }
  ok('C1 every seat in its own district', off.length === 0, off.length ? off.join(', ') : DS.filter(d => d.seat).length + ' seats');
  const where = n => { const p = pl.find(q => q.name === n); return p ? L.districtAt(p.x, p.y, C1).name : null; };
  ok('C2 the real geography: Jean and Primm share the Ivanpah Valley, Boulder City the Eldorado Valley, Pahrump its own',
     where('JEAN') === 'THE IVANPAH VALLEY' && where('PRIMM') === 'THE IVANPAH VALLEY' && where('BOULDER CITY') === 'THE ELDORADO VALLEY' && where('PAHRUMP') === 'PAHRUMP VALLEY');
});

section('D. the lines are on the ground', () => {
  /* a line between two districts OF THE GROUND (city, basin, range, lake); a 'beyond' district is cut by law (the
     California survey line) or by the region's reach, never by the ground, so its lines are printed, not counted */
  const { N, K } = L; let line = 0, lineRough = 0, all = 0, allRough = 0; const kindOf = {}, table = {};
  DS.forEach(d => { kindOf[d.id] = d.kind; });
  const rough = (x, y) => { const a = L.at(x, y, C1); return a && /^(h|\^|s|~)$/.test(a.code); };
  for (let y = -K; y < N + K - 1; y++) for (let x = -K; x < N + K - 1; x++) {
    if (L.inValley(x, y)) continue;
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      const nx = x + dx, ny = y + dy; if (L.inValley(nx, ny)) continue;
      const r = rough(x, y) || rough(nx, ny); all++; if (r) allRough++;
      const a = G[x + ',' + y], b = G[nx + ',' + ny];
      if (a === b) continue;
      const t = [kindOf[a], kindOf[b]].sort().join('|'); table[t] = table[t] || [0, 0]; table[t][0]++; if (r) table[t][1]++;
      if (kindOf[a] !== 'beyond' && kindOf[b] !== 'beyond') { line++; if (r) lineRough++; }
    }
  }
  console.log('  NOTE line edges on rough ground, by the kinds either side: ' + Object.keys(table).sort().map(t => t + ' ' + table[t][0] + ' at ' + Math.round(100 * table[t][1] / table[t][0]) + '%').join('; '));
  /* the California line: the real survey line, block for block (the same projection as the generator) */
  const o = J.origin, m = J.metresPerCell / 1000, kmLon = 111 * Math.cos(o.lat * Math.PI / 180);
  const latlon = (x, y) => [o.lat - (y + 0.5 - (N - 1) / 2) * m / 111, o.lon + (x + 0.5 - (N - 1) / 2) * m / kmLon];
  const inCA = (la, lo) => lo < -120 + ((39 - la) / (39 - 35.0019)) * (120 - 114.6333);
  let caWrong = 0, caBlocks = 0;
  for (let y = -K; y < N + K; y++) for (let x = -K; x < N + K; x++) {
    const [la, lo] = latlon(x, y), isCA = G[x + ',' + y] === DS.find(d => d.name === 'CALIFORNIA').id;
    if (isCA) caBlocks++;
    if (isCA !== inCA(la, lo)) caWrong++;
  }
  const share = lineRough / line, base = allRough / all;
  ok('D1 the ground\'s lines sit on rough ground (ridge, wash, water) ' + (100 * share).toFixed(0) + '% of their length, the region ' + (100 * base).toFixed(0) + '% (at least half again)', share >= 1.5 * base, line + ' line edges between districts of the ground');
  ok('D2 California is the real survey line through Primm, block for block', caWrong === 0 && caBlocks > 1000, caBlocks + ' blocks, ' + caWrong + ' wrong');
});

section('E. every crossing is two-sided and named', () => {
  const bad = crossingFaults(L);
  ok('E1 the near block in the district it leaves, the far one in the one it enters, both road, both named', bad.length === 0 && J.lineCrossings.length >= 20,
     bad.length ? bad.slice(0, 4).join('; ') : J.lineCrossings.length + ' crossings');
});

section('F. no road zigzags along a line', () => {
  const by = {}; for (const c of J.lineCrossings) (by[c.road] = by[c.road] || []).push(c);
  const zig = [];
  for (const r in by) { const a = by[r]; for (let i = 1; i < a.length; i++) if (a[i].from === a[i - 1].to && a[i].to === a[i - 1].from) zig.push(r); }
  ok('F1 no road crosses a line and straight back', zig.length === 0, zig.length ? zig.join(', ') : Object.keys(by).length + ' roads cross lines');
});

section('G. every road end is a real end', () => {
  const ends = L.roadEnds(C1), bad = endFaults(L), kinds = {};
  for (const e of ends) kinds[e.kind] = (kinds[e.kind] || 0) + 1;
  ok('G1 no road end is a break', !kinds.break, JSON.stringify(kinds));
  ok('G2 every end is what it says, read off the land', bad.length === 0, bad.length ? bad.join('; ') : ends.length + ' ends');
  ok('G3 an end on a district line is never a break', ends.filter(e => e.atLine && e.kind === 'break').length === 0,
     ends.filter(e => e.atLine).length + ' ends touch a line: ' + ends.filter(e => e.atLine).map(e => e.road + ' ' + e.kind).join(', '));
  ok('G4 every road has its two ends', new Set(ends.map(e => e.road)).size === ends.length / 2);
  ok('G5 the gates stay few and named (8)', (kinds.gate || 0) <= 8);
});

section('H. the roads reach every seat', () => {
  const adj = {}; for (const c of J.lineCrossings) { (adj[c.from] = adj[c.from] || new Set()).add(c.to); (adj[c.to] = adj[c.to] || new Set()).add(c.from); }
  const seen = new Set(['LAS VEGAS VALLEY']), st = ['LAS VEGAS VALLEY'];
  while (st.length) { const d = st.pop(); for (const n of (adj[d] || [])) if (!seen.has(n)) { seen.add(n); st.push(n); } }
  const off = DS.filter(d => d.seat && !seen.has(d.name)).map(d => d.name);
  ok('H1 every district with a seat is reached by road from the Las Vegas Valley', off.length === 0, off.length ? off.join(', ') : seen.size + ' reached');
  const roadless = DS.filter(d => !d.roads.length).map(d => d.name + ' (' + d.kind + ')');
  console.log('  NOTE roadless, crossed on foot: ' + roadless.join(', '));
  ok('H2 a roadless district is never one with a seat', DS.every(d => d.roads.length || !d.seat));
});

section('I. the real names on each side', () => {
  const has = (road, side, re) => J.lineCrossings.some(c => c.road === road && re.test(side === 'to' ? c.nameTo : c.nameFrom));
  ok('I1 NV-160 is the Pahrump Valley Highway into Pahrump, Blue Diamond Road before', J.lineCrossings.some(c => c.road === 'NV-160' && c.to === 'PAHRUMP VALLEY' && /PAHRUMP VALLEY HWY/.test(c.nameTo) && /BLUE DIAMOND/.test(c.nameFrom)));
  ok('I2 NV-159 is Charleston Boulevard leaving the valley and Red Rock Canyon Road in Red Rock', J.lineCrossings.some(c => c.road === 'NV-159' && /CHARLESTON/.test(c.nameFrom) && /RED ROCK CANYON/.test(c.nameTo)));
  ok('I3 NV-147 Lake Mead Boulevard becomes Northshore Road (NV-167)', has('NV-147 LAKE MEAD BLVD', 'from', /LAKE MEAD BLVD/) && has('NV-147 LAKE MEAD BLVD', 'to', /NORTHSHORE/));
  ok('I4 old US-93 is Nevada Way in Boulder City', has('US-93 OLD', 'from', /NEVADA WAY/));
  ok('I5 I-11 becomes US-93 into Arizona', J.lineCrossings.some(c => c.road === 'I-11 / US-93' && c.to === 'ARIZONA' && c.nameTo === 'US-93'));
});

section('J. the loader on both compasses', () => {
  let diff = 0, sides = 0;
  for (let y = -L.K; y < L.N + L.K; y += 7) for (let x = -L.K; x < L.N + L.K; x += 7) {
    const a = L.districtAt(x, y, C1), b = L.districtAt(L.N - 1 - x, y, C0);
    if (!a || !b || a.id !== b.id) diff++;
    const s = L.districtSides(x, y, C1), e = L.districtSides(x + 1, y, C1);
    if (s && e && L.inGrid(x + 1, y) && ((s[1] === null) !== (e[3] === null))) sides++;
  }
  ok('J1 the same block reads the same district through both compasses', diff === 0, diff + ' differ');
  ok('J2 a line reads from both sides (A\'s east is B\'s west)', sides === 0, sides + ' one-sided');
  const c1 = L.lineCrossings(C1), c0 = L.lineCrossings(C0);
  ok('J3 the crossings mirror with the land', c1.every((c, i) => c0[i].x === L.N - 1 - c.x && c0[i].y === c.y && c0[i].to === c.to));
});

section('M. the gate is not blind', () => {
  /* 1: a stray block of the valley inside Pahrump */
  const j1 = JSON.parse(JSONTEXT);
  const pa = j1.places.find(p => p.name === 'PAHRUMP');
  const row = pa.y + j1.K, decode = s => { const o = []; let n = 0; for (let i = 0; i < s.length;) { let r = 0; while (/[0-9]/.test(s[i])) r = r * 10 + +s[i++]; o.push(...Array(r || 1).fill(s[i++])); } return o; };
  const enc = a => { let s = '', i = 0; while (i < a.length) { let j = i; while (j < a.length && a[j] === a[i]) j++; s += (j - i > 1 ? (j - i) : '') + a[i]; i = j; } return s; };
  const cells = decode(j1.districtRows[row]); cells[pa.x + 6 + j1.K] = 'A'; j1.districtRows[row] = enc(cells);
  const L1 = RL.load(j1), c1 = pieces(L1, grid(L1));
  ok('M1 a stray block goes red (B)', c1.A > 1);
  /* 2: a crossing whose far block is not the district it names */
  const j2 = JSON.parse(JSONTEXT); j2.lineCrossings[0].to = 'SANDY VALLEY';
  ok('M2 a one-sided crossing goes red (E)', crossingFaults(RL.load(j2)).length === 1);
  /* 3: a road end moved into open desert, still called a junction */
  const j3 = JSON.parse(JSONTEXT); const e = j3.roadEnds.find(r => r.kind === 'junction'); e.x = -150; e.y = 250;
  ok('M3 a road end at nothing goes red (G), whatever its label', endFaults(RL.load(j3)).length === 1);
});

console.log('\n  the districts:');
for (const d of DS) console.log('   ' + d.id + ' ' + d.name.padEnd(24) + d.kind.padEnd(7) + String(d.km2).padStart(6) + ' km2  ' + (d.seat || '-').padEnd(20) + ' roads ' + d.roads.length);
console.log('\n' + (fail ? 'THE DISTRICTS JOIN: RED' : 'THE DISTRICTS JOIN: GREEN') + '  ' + pass + '/' + fail);
process.exit(fail ? 1 : 0);

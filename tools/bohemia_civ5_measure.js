#!/usr/bin/env node
/* BOHEMIA — CIV 5 TECH TREE MEASURER (LAB lane, 8/13/26)
 *
 * Paolo 8/13: "do big brain research into civilization five and all of the technologies
 * in the tech tree. This may help you with your goals."
 *
 * This is the GENERATOR half of the research. It does not have opinions. It opens the
 * vendored Civ 5 BNW tech tree and MEASURES it, then measures OUR OWN boss ladder the
 * same way, so the comparison in the research record is a computed number rather than a
 * thing I once said. Re-running it must change nothing (FACTORY LAW).
 *
 * REUSE CHECK: cooks no graphic pixels, so the reuse-first shopping law does not bind
 * here. It reads records/BOHEMIA_REF_CIV5_TECHTREE_BNW.json (the vendored reference
 * dataset) and records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md (the live ladder). It
 * invents no data of its own -- every number it prints comes out of one of those two
 * files. Nothing in banks/ was relevant.
 *
 * PROVENANCE OF THE DATASET: neoddish/Civ-TechTree (dataset/civtechtree.json), which
 * transcribes the Civ 5 BRAVE NEW WORLD tree from the Civilization Fandom wiki and the
 * CivFanatics tech-tree image. 81 nodes.
 *
 * ★ AND ONE THING WAS WRONG WITH IT, WHICH IS WHY THE COLUMN IS GONE. The source
 * dataset's `buildings_enabled` field is a VERBATIM COPY of `units_enabled` in 81 of 81
 * nodes -- the building data was lost by whoever transcribed it. Read naively it says
 * "units are 43% of unlocks and buildings are 43% of unlocks" in every single era, and a
 * perfect 1:1 match across eight independent eras is not a design fact, it is a tell.
 * The column is dropped from the vendored copy instead of carried, because a lie you
 * store is a lie you will eventually quote. So: unit counts, mechanic notes, costs, eras
 * and the whole prerequisite GRAPH are trustworthy here. BUILDING counts are NOT
 * available at all and this tool never reports one.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const REF = 'records/BOHEMIA_REF_CIV5_TECHTREE_BNW.json';
const LADDER = 'records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md';

const ERAS = ['Ancient', 'Classical', 'Medieval', 'Renaissance',
              'Industrial', 'Modern', 'Atomic', 'Information'];

function measureCiv() {
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, REF), 'utf8'));
  const by = new Map(d.map(t => [t.tech_name, t]));
  /* prereq names are capitalised inconsistently in the source ("Animal husbandry" vs
     "Animal Husbandry"), so resolve case-insensitively or the graph silently loses edges */
  const norm = new Map([...by.keys()].map(k => [k.toLowerCase(), k]));
  const req = t => (t.required_techs || [])
    .map(r => norm.get(r.toLowerCase())).filter(Boolean);

  /* DEPTH is the LONGEST path from the root, not the shortest: a tech is unreachable
     until EVERY prereq is done, so the longest chain is the true tier. */
  const depth = new Map();
  const D = n => {
    if (depth.has(n)) return depth.get(n);
    depth.set(n, 0);
    const ps = req(by.get(n));
    const v = ps.length ? 1 + Math.max(...ps.map(D)) : 0;
    depth.set(n, v);
    return v;
  };
  [...by.keys()].forEach(D);

  /* THE CHOICE FAN: walk the whole tree taking the cheapest legal tech each step and
     record how many were legal at that moment. This is the number that says how big the
     player's live menu is, and it is the single most transferable thing in the tree. */
  const done = new Set();
  const fan = [];
  while (done.size < by.size) {
    const avail = [...by.keys()].filter(n => !done.has(n) &&
      req(by.get(n)).every(p => done.has(p)));
    if (!avail.length) break;
    fan.push(avail.length);
    avail.sort((a, b) => by.get(a).cost - by.get(b).cost);
    done.add(avail[0]);
  }
  const sorted = [...fan].sort((a, b) => a - b);

  const kids = new Map([...by.keys()].map(k => [k, []]));
  d.forEach(t => req(t).forEach(p => kids.get(p).push(t.tech_name)));
  const descOf = n => {
    const seen = new Set(); const q = [...kids.get(n)];
    while (q.length) { const x = q.pop(); if (seen.has(x)) continue; seen.add(x); q.push(...kids.get(x)); }
    return seen;
  };

  /* the MINIMUM set you must research to legally reach a target -- the beeline */
  const closure = target => {
    const need = new Set(); const st = [target];
    while (st.length) { const n = st.pop(); if (need.has(n)) continue; need.add(n); st.push(...req(by.get(n))); }
    return need;
  };

  const eraSpans = ERAS.map(e => {
    const ds = d.filter(t => t.era === e).map(t => depth.get(t.tech_name));
    return { era: e, n: ds.length, lo: Math.min(...ds), hi: Math.max(...ds),
             span: Math.max(...ds) - Math.min(...ds) + 1 };
  });
  const eraCost = ERAS.map(e => {
    const ts = d.filter(t => t.era === e);
    return { era: e, n: ts.length, mean: ts.reduce((a, t) => a + t.cost, 0) / ts.length };
  });

  return {
    nodes: d.length,
    /* ★ this is HERE because I hand-typed "236 edges" into the research record from nothing
       at all and it is 130. Any number that appears in the record must come out of this
       function, or it is a number I made up. */
    edges: d.reduce((a, t) => a + req(t).length, 0),
    eras: ERAS.length,
    perEraMin: Math.min(...eraCost.map(x => x.n)),
    perEraMax: Math.max(...eraCost.map(x => x.n)),
    tiers: Math.max(...depth.values()) + 1,
    eraSpans,
    eraSpanMin: Math.min(...eraSpans.map(s => s.span)),
    eraSpanMax: Math.max(...eraSpans.map(s => s.span)),
    eraSpansOfTwo: eraSpans.filter(s => s.span === 2).length,
    fanMin: Math.min(...fan),
    fanMax: Math.max(...fan),
    fanMedian: sorted[Math.floor(sorted.length / 2)],
    terminals: [...by.keys()].filter(n => descOf(n).size === 0),
    rootGates: descOf('Agriculture').size,
    costLo: Math.min(...d.map(t => t.cost)),
    costHi: Math.max(...d.map(t => t.cost)),
    eraStepFirst: eraCost[1].mean / eraCost[0].mean,
    eraStepLast: eraCost[7].mean / eraCost[6].mean,
    beelineGunpowder: closure('Gunpowder').size,
    beelineFuture: closure('Future Tech').size,
    unlocksPerTechEarly: d.filter(t => t.era === 'Ancient')
      .reduce((a, t) => a + (t.units_enabled || []).length + (t.notes || []).length, 0) / 12,
    unlocksPerTechLate: d.filter(t => t.era === 'Information')
      .reduce((a, t) => a + (t.units_enabled || []).length + (t.notes || []).length, 0) / 13,
  };
}

function measureLadder() {
  const lad = fs.readFileSync(path.join(ROOT, LADDER), 'utf8');
  const rows = []; let act = 0;
  lad.split('\n').forEach(line => {
    const h = line.match(/^##\s*ACT\s*([123])\b/);
    if (h) act = +h[1];
    const m = line.match(/^\|\s*(\d+)\s*\|\s*\*\*([^*]+)\*\*\s*\|/);
    if (m) rows.push({ n: +m[1], boss: m[2].trim(), act });
  });
  const per = [1, 2, 3].map(a => rows.filter(r => r.act === a).length);

  /* ★ 8/13: he ruled "Sure" and a prerequisite graph now exists beside the ladder. Before
     that, this function hardcoded `prereqEdges: 0` and `fan: 1` -- true at the time, and a
     LIE the moment the graph landed. Reporting a stale zero here would have made the gate's
     own summary line contradict the graph gate running twenty seconds later. So it reads the
     graph when there is one, and only falls back to line-geometry when there is not. */
  const GRAPH = path.join(ROOT, 'records/BOHEMIA_LADDER_GRAPH_8_13_26.json');
  if (fs.existsSync(GRAPH)) {
    const g = JSON.parse(fs.readFileSync(GRAPH, 'utf8'));
    const pre = new Map(rows.map(r => [r.boss, []]));
    g.edges.forEach(e => { if (pre.has(e.to)) pre.get(e.to).push(e.from); });
    const depth = new Map();
    const D = n => {
      if (depth.has(n)) return depth.get(n);
      depth.set(n, 0);
      const ps = pre.get(n) || [];
      depth.set(n, ps.length ? 1 + Math.max(...ps.map(D)) : 0);
      return depth.get(n);
    };
    rows.forEach(r => D(r.boss));
    const done = new Set(); const fan = [];
    while (done.size < rows.length) {
      const av = rows.filter(r => !done.has(r.boss) && (pre.get(r.boss) || []).every(p => done.has(p)));
      if (!av.length) break;
      fan.push(av.length); av.sort((a, b) => a.n - b.n); done.add(av[0].boss);
    }
    const sorted = [...fan].sort((a, b) => a - b);
    return {
      nodes: rows.length, acts: 3, perAct: per,
      tiers: Math.max(...depth.values()) + 1,
      fan: sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0,
      openingFan: fan.length ? fan[0] : 0,
      terminals: rows.filter(r => !g.edges.some(e => e.from === r.boss)).length,
      prereqEdges: g.edges.length,
      isGraph: true,
    };
  }
  /* a numbered 1..N list with no prereq column IS a line: N tiers, and exactly one
     legal next move at every point in the game. */
  return {
    nodes: rows.length, acts: 3, perAct: per,
    tiers: rows.length, fan: 1, terminals: rows.length,
    prereqEdges: 0, openingFan: 1, isGraph: false,
  };
}

const civ = measureCiv();
const boh = measureLadder();

if (require.main === module) {
  const J = process.argv.includes('--json');
  if (J) { console.log(JSON.stringify({ civ, boh }, null, 1)); process.exit(0); }
  console.log('CIV 5 BNW, MEASURED OFF THE VENDORED TREE');
  console.log(`  ${civ.nodes} techs across ${civ.eras} eras (${civ.perEraMin}-${civ.perEraMax} per era), ${civ.edges} prereq edges`);
  console.log(`  ${civ.tiers} tiers deep; each era spans ${civ.eraSpanMin}-${civ.eraSpanMax} tiers, ${civ.eraSpansOfTwo} of ${civ.eras} span exactly 2`);
  console.log(`  CHOICE FAN ${civ.fanMin}-${civ.fanMax}, median ${civ.fanMedian} -- the live menu never leaves that band`);
  console.log(`  ${civ.terminals.length} terminal techs of ${civ.nodes}: ${civ.terminals.join(', ')}`);
  console.log(`  Agriculture gates ${civ.rootGates} of ${civ.nodes - 1} downstream`);
  console.log(`  cost ${civ.costLo} -> ${civ.costHi}; era step decays ${civ.eraStepFirst.toFixed(2)}x -> ${civ.eraStepLast.toFixed(2)}x`);
  console.log(`  beeline: Gunpowder needs ${civ.beelineGunpowder}/${civ.nodes}; Future Tech needs ${civ.beelineFuture}/${civ.nodes}`);
  console.log(`  unlocks per tech ${civ.unlocksPerTechEarly.toFixed(1)} (Ancient) -> ${civ.unlocksPerTechLate.toFixed(1)} (Information)`);
  console.log('\nBOHEMIA BOSS LADDER v7, MEASURED THE SAME WAY');
  console.log(`  ${boh.nodes} bosses across ${boh.acts} acts (${boh.perAct.join('/')})`);
  console.log(`  ${boh.tiers} tiers deep -- it is a LINE`);
  console.log(`  CHOICE FAN ${boh.fan}, always`);
  console.log(`  ${boh.terminals} terminal bosses of ${boh.nodes}`);
  console.log(`  ${boh.prereqEdges} declared prerequisite edges`);
}

module.exports = { measureCiv, measureLadder };

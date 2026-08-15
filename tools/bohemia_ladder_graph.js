#!/usr/bin/env node
/* BOHEMIA — THE LADDER GRAPH (LAB lane, 8/13/26)
 *
 * Paolo 8/13, answering "DO I BUILD THE PREREQ COLUMN?": "Sure with the technologies and bosses
 * that we have in mind like maybe a lot of them could be available at the start but then like you
 * know like maybe like 5 or 6 of them or four of them and then you do have to take out certain
 * bosses or do certain quests and shit."
 *
 * So: the ladder stops being a numbered line and becomes a graph, and the LIVE MENU should hold
 * 4 to 6 nodes. He arrived at 4-6 without being shown the Civ 5 measurement, which came out at
 * 3-7 median 4. Independent convergence on the same constant.
 *
 * THIS TOOL DOES NOT DECIDE ANYTHING. It loads the derived edge set, checks it is a legal DAG
 * against the live ladder, and MEASURES the resulting fan so the gap between what physics gives
 * us and what he asked for is a number instead of an opinion.
 *
 * REUSE CHECK: cooks no graphic pixels, so the shopping law does not bind. It reads
 * records/BOHEMIA_LADDER_GRAPH_8_13_26.json (the edges) and
 * records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md (the live 53 rows). It invents no nodes and no
 * edges of its own -- if a name is not in the ladder, that is an ERROR, not something to add.
 * Nothing in banks/ was relevant.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LADDER = 'records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md';
const GRAPH = 'records/BOHEMIA_LADDER_GRAPH_8_13_26.json';

/* HIS NUMBER. Not a guess and not a range I picked. */
const FAN_LO = 4, FAN_HI = 6;

function loadLadder() {
  const lad = fs.readFileSync(path.join(ROOT, LADDER), 'utf8');
  const rows = []; let act = 0;
  lad.split('\n').forEach(line => {
    const h = line.match(/^##\s*ACT\s*([123])\b/);
    if (h) act = +h[1];
    const m = line.match(/^\|\s*(\d+)\s*\|\s*\*\*([^*]+)\*\*\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/);
    if (m) rows.push({ n: +m[1], boss: m[2].trim(), holds: m[3].trim(), lock: m[4].trim(),
                       key: m[5].replace(/\*+/g, '').trim(), kind: m[6].trim(), act });
  });
  return rows;
}

function build() {
  const rows = loadLadder();
  const g = JSON.parse(fs.readFileSync(path.join(ROOT, GRAPH), 'utf8'));
  const names = new Set(rows.map(r => r.boss));

  /* ---- every endpoint must be a real ladder row --------------------------- */
  const unknown = [];
  g.edges.forEach(e => {
    if (!names.has(e.to)) unknown.push('to:' + e.to);
    if (!names.has(e.from)) unknown.push('from:' + e.from);
  });
  Object.keys(g.routes).filter(k => !k.startsWith('_'))
    .forEach(k => { if (!names.has(k)) unknown.push('route:' + k); });

  /* ---- prereq map, and a cycle check ------------------------------------- */
  const pre = new Map(rows.map(r => [r.boss, []]));
  g.edges.forEach(e => { if (pre.has(e.to)) pre.get(e.to).push(e.from); });

  const state = new Map();  /* 0 unvisited, 1 in-stack, 2 done */
  const cycles = [];
  const visit = (n, trail) => {
    if (state.get(n) === 1) { cycles.push([...trail, n].join(' -> ')); return; }
    if (state.get(n) === 2) return;
    state.set(n, 1);
    (pre.get(n) || []).forEach(p => visit(p, [...trail, n]));
    state.set(n, 2);
  };
  rows.forEach(r => visit(r.boss, []));

  /* ---- DEPTH: longest chain, because a node waits for ALL its prereqs ----- */
  const depth = new Map();
  const D = n => {
    if (depth.has(n)) return depth.get(n);
    depth.set(n, 0);
    const ps = pre.get(n) || [];
    const v = ps.length ? 1 + Math.max(...ps.map(D)) : 0;
    depth.set(n, v);
    return v;
  };
  rows.forEach(r => D(r.boss));

  /* ---- THE FAN: walk the graph and record the live menu at every step -----
     Measured exactly the way civ5_gate measures Civ 5, so the two numbers are
     comparable. Take the lowest-numbered legal node each step (the ladder's own
     order is the only tiebreak we have, and the tiebreak does not move the fan). */
  const done = new Set();
  const fan = [];
  const byName = new Map(rows.map(r => [r.boss, r]));
  while (done.size < rows.length) {
    const avail = rows.filter(r => !done.has(r.boss) &&
      (pre.get(r.boss) || []).every(p => done.has(p)));
    if (!avail.length) break;   /* a cycle stranded the rest */
    fan.push(avail.length);
    avail.sort((a, b) => a.n - b.n);
    done.add(avail[0].boss);
  }
  const sorted = [...fan].sort((a, b) => a - b);

  const roots = rows.filter(r => !(pre.get(r.boss) || []).length).map(r => r.boss);
  const inBand = fan.filter(f => f >= FAN_LO && f <= FAN_HI).length;

  return {
    nodes: rows.length,
    edges: g.edges.length,
    edgesMissingReason: g.edges.filter(e => !e.why || e.why.trim().length < 25).length,
    unknownEndpoints: unknown,
    cycles,
    tiers: Math.max(...depth.values()) + 1,
    roots,
    openingFan: fan.length ? fan[0] : 0,
    fanMin: fan.length ? Math.min(...fan) : 0,
    fanMax: fan.length ? Math.max(...fan) : 0,
    fanMedian: sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0,
    fanInBandPct: fan.length ? Math.round(100 * inBand / fan.length) : 0,
    fan,
    routesDeclared: Object.keys(g.routes).filter(k => !k.startsWith('_')).length,
    questGates: Object.keys(g.quest_gates).length,
    /* HIS TARGET vs WHAT PHYSICS GIVES. The whole point of the tool. */
    fanTarget: [FAN_LO, FAN_HI],
    gatesNeededToHitTarget: Math.max(0, roots.length - FAN_HI),
    depth,
  };
}

if (require.main === module) {
  const r = build();
  if (process.argv.includes('--json')) {
    const { depth, ...rest } = r;
    console.log(JSON.stringify(rest, null, 1)); process.exit(0);
  }
  console.log('THE LADDER AS A GRAPH');
  console.log(`  ${r.nodes} nodes · ${r.edges} physically-necessary edges · ${r.tiers} tiers deep`);
  if (r.unknownEndpoints.length) console.log('  !! UNKNOWN ENDPOINTS: ' + r.unknownEndpoints.join(', '));
  if (r.cycles.length) console.log('  !! CYCLES: ' + r.cycles.join(' | '));
  console.log(`  fan ${r.fanMin}-${r.fanMax} (median ${r.fanMedian}), opening fan ${r.openingFan}`);
  console.log(`  in his 4-6 band for ${r.fanInBandPct}% of the run`);
  console.log(`  ${r.roots.length} ROOTS (open with nothing done):`);
  console.log('    ' + r.roots.join(', '));
  console.log(`\nHIS TARGET IS ${r.fanTarget[0]}-${r.fanTarget[1]} AND PHYSICS ALONE OPENS ${r.openingFan}.`);
  console.log(`  ${r.gatesNeededToHitTarget} of those roots need a NON-PHYSICAL gate to close,`);
  console.log('  and R-GATE already names the tool: a quest. Which ones is HIS call.');
  console.log(`  quest gates declared so far: ${r.questGates}`);
  console.log(`  routes declared so far: ${r.routesDeclared} of ${r.nodes} (empty except his rulings)`);
  console.log('\n  fan curve: ' + r.fan.join(' '));
}

module.exports = { build, loadLadder, FAN_LO, FAN_HI };

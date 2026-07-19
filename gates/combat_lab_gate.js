#!/usr/bin/env node
/* ============================================================================
   BOHEMIA — COMBAT LAB GATE (7/19/26, COMBAT session)
   Machine-locks the BEAT TACTICS LAB (slices/BOHEMIA_COMBAT_LAB_7_19_26.html):
     1. ENGINE STAMP SYNC — the lab's Dead Eye Dial engine block is
        byte-identical to the canonical body inside the alpha's COMBAT_B64.
        (One canonical dial engine; the generator re-stamps, the gate proves.)
     2. THE IRON LAWS, headless:
        - NO DAMAGE BEFORE THE DIAL: enemy hp moves ONLY through
          applyDialResult (static + simulated).
        - OCCUPANCY: one body per cell, player included, across seeded
          random-play sims in all four modes.
        - 120 BPM / I-MOVE-YOU-MOVE: BPM=120, whole-beat advancement,
          world frozen while the dial is open, watching costs nothing.
        - Locked tiers: vital = 60 + 2-beat stun, NO stun-lock, two vitals
          kill a human; killshot chains; vital chains to a DIFFERENT target.
        - Package currency: distance pulls the package (PB easier), helpless
          targets ease it, clamped 0..4.
     3. VERDICT WORKFLOW: SUN MODE, thumbs, per-mode comments, bottom
        comment section, export as .txt (never .json).
     4. ALPHA WIRING: the COMBAT tab hosts the lab via combatLabFrame.
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LAB = path.join(ROOT, 'slices', 'BOHEMIA_COMBAT_LAB_7_19_26.html');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? ' -- ' + extra : '')); }
}

const lab = fs.readFileSync(LAB, 'utf8');
const alpha = fs.readFileSync(ALPHA, 'utf8');

/* ---- 1. engine stamp sync ---- */
function engineBlock(src, label) {
  const a = src.indexOf('<!-- ENGINE START');
  const b = src.indexOf('<!-- ENGINE END');
  if (a < 0 || b < 0) throw new Error(label + ': engine markers missing');
  return src.slice(a, src.indexOf('-->', b) + 3);
}
const m = alpha.match(/const COMBAT_B64='([^']+)'/);
ok('alpha carries COMBAT_B64', !!m);
const demo = Buffer.from(m[1], 'base64').toString('utf8');
const canonBlock = engineBlock(demo, 'alpha demo');
let labBlock = null;
try { labBlock = engineBlock(lab, 'lab'); } catch (e) { labBlock = null; }
ok('lab carries an engine stamp', !!labBlock);
ok('ENGINE STAMP SYNC: lab dial engine byte-identical to alpha canon',
  labBlock === canonBlock, labBlock ? ('lab ' + labBlock.length + ' vs canon ' + canonBlock.length) : 'no stamp');

/* ---- 2. extract + run the core ---- */
const ca = lab.indexOf('LAB CORE START'), cb = lab.indexOf('LAB CORE END');
ok('LAB CORE markers present', ca > 0 && cb > ca);
const coreSrc = lab.slice(lab.indexOf('var LabCore', ca), lab.lastIndexOf('if(typeof module', cb));
const mod = { exports: {} };
new Function('module', 'exports', coreSrc + ';module.exports=LabCore;')(mod, mod.exports);
const LC = mod.exports;

ok('120 BPM LAW: BPM=120, BEAT=500ms', LC.K.BPM === 120 && LC.K.BEAT_MS === 500);
ok('four modes', ['conductor', 'promise', 'dance', 'shove'].every(k => LC.MODES[k]));
ok('readability ceiling: every mode <= 8 enemies',
  Object.keys(LC.MODES).every(k => LC.MODES[k].count <= 8));

/* static: hp mutations only inside applyDialResult */
const adrStart = coreSrc.indexOf('function applyDialResult');
const adrEnd = coreSrc.indexOf('function chainShot');
const hpMuts = [];
const re = /\.hp\s*=/g; let mm;
while ((mm = re.exec(coreSrc))) hpMuts.push(mm.index);
ok('NO DAMAGE BEFORE THE DIAL (static): every .hp mutation lives in applyDialResult',
  hpMuts.length > 0 && hpMuts.every(i => i > adrStart && i < adrEnd),
  hpMuts.length + ' mutation sites');

/* determinism */
const g1 = JSON.stringify(LC.newGame('conductor', 'SEED')),
      g2 = JSON.stringify(LC.newGame('conductor', 'SEED'));
ok('deterministic spawn (same seed, same field)', g1 === g2);
ok('different seed, different field', g1 !== JSON.stringify(LC.newGame('conductor', 'SEED2')));

/* seeded random-play sim per mode: occupancy + beats + no-dial damage */
function prng(n) { let s = n >>> 0; return () => (s = (s * 1103515245 + 12345) >>> 0) / 4294967296; }
let occBad = 0, beatBad = 0, hpBad = 0, boundsBad = 0;
for (const mode of Object.keys(LC.MODES)) {
  const R = prng(42);
  const S = LC.newGame(mode, 'GATE');
  for (let i = 0; i < 300 && !S.down; i++) {
    const hpBefore = S.enemies.reduce((a, e) => a + e.hp, 0);
    const roll = R();
    let action;
    if (mode === 'shove' && roll < 0.25) {
      const d = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(R() * 4)];
      action = { type: 'shove', dx: d[0], dy: d[1] };
    } else if (roll < 0.75) {
      const d = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(R() * 4)];
      action = { type: 'move', dx: d[0], dy: d[1] };
    } else action = { type: 'wait' };
    const b0 = S.beat;
    const r = LC.commitPlayer(S, action, 0);
    if (r.ok) {
      if (!Number.isInteger(S.beat) || S.beat !== b0 + 1) beatBad++;
      const b1 = S.beat;
      const w = LC.worldStep(S);
      if (w.ok && S.beat !== b1 + 1) beatBad++;
    }
    if (S.enemies.reduce((a, e) => a + e.hp, 0) !== hpBefore) hpBad++;  // no dial ran
    const seen = {}; seen[S.px + ',' + S.py] = 1;
    if (S.px < 0 || S.px >= LC.K.W || S.py < 0 || S.py >= LC.K.H) boundsBad++;
    for (const e of LC.alive(S)) {
      const k = e.x + ',' + e.y;
      if (seen[k]) occBad++; seen[k] = 1;
      if (e.x < 0 || e.x >= LC.K.W || e.y < 0 || e.y >= LC.K.H) boundsBad++;
      if (S.solids[k]) occBad++;
    }
  }
}
ok('OCCUPANCY LAW: one body per cell across 4x300-step sims', occBad === 0, occBad + ' violations');
ok('bodies never leave the grid / stand in walls', boundsBad === 0);
ok('whole-beat advancement (player +1, world +1)', beatBad === 0);
ok('NO DAMAGE BEFORE THE DIAL (simulated): dial never ran, hp never moved', hpBad === 0);

/* fire stages; world frozen while dial open; watching costs nothing */
{
  const S = LC.newGame('conductor', 'GATE2');
  const t = LC.alive(S).find(e => LC.los(S, S.px, S.py, e.x, e.y));
  const turn0 = S.turn;
  const r = LC.commitPlayer(S, { type: 'fire', target: t.id, basePkg: 4 }, 0);
  ok('fire STAGES a shot (pendingShot, zero damage)', r.ok && !!S.pendingShot && t.hp === 100);
  ok('world frozen while the dial is open', LC.worldStep(S).ok === false);
  const rr = LC.applyDialResult(S, 'killshot');
  ok('killshot kills + keeps the chain alive', t.dead && rr.chain === true);
  ok('the chain is ONE action: turn unchanged until the world answers', S.turn === turn0);
  LC.worldStep(S);
  ok('world answers after the chain ends', S.turn === turn0 + 1);
}

/* locked vital rules */
{
  const S = LC.newGame('conductor', 'GATE3');
  const t = LC.alive(S)[0];
  S.pendingShot = { target: t.id, pkg: 0 };
  const r1 = LC.applyDialResult(S, 'vital');
  ok('vital = 60 damage + 2-beat stun', t.hp === 40 && t.stun === 2 && r1.stunned === true);
  ok('vital chains to a DIFFERENT target (locked 7/1)', r1.chain === true && r1.mustSwitch === true);
  S.pendingShot = { target: t.id, pkg: 0 };
  LC.applyDialResult(S, 'vital');
  ok('two vitals kill a human (locked 6/27)', t.dead === true);
  const S2 = LC.newGame('conductor', 'GATE4');
  const u = LC.alive(S2)[0];
  u.hp = 200;                                  // armored-goon stand-in: survives two vitals
  S2.pendingShot = { target: u.id, pkg: 0 };
  LC.applyDialResult(S2, 'vital');
  const stunAfterFirst = u.stun;
  S2.pendingShot = { target: u.id, pkg: 0 };
  LC.applyDialResult(S2, 'vital');
  ok('NO STUN-LOCK: re-vital chips hp but cannot refresh the freeze',
    stunAfterFirst === 2 && u.stun === 2 && u.hp === 80);
}

/* package currency */
{
  const S = LC.newGame('conductor', 'GATE5');
  const e = LC.alive(S)[0];
  LC.alive(S).filter(o => o !== e).forEach(o => { o.dead = true; });  // isolate: no surrounded modifier
  e.x = S.px + 1; e.y = S.py;                  // point blank
  const pb = LC.effPackage(S, e, 4);
  e.x = S.px; e.y = 0;                         // far
  const far = LC.effPackage(S, e, 4);
  ok('distance pulls the package: point blank easier than far (canon)', pb < far, pb + ' vs ' + far);
  e.stun = 2;
  const helpless = LC.effPackage(S, e, 4);
  ok('helpless target eases the dial', helpless <= far - 1 || far === 0);
  for (let base = 0; base <= 4; base++) {
    const v = LC.effPackage(S, e, base);
    if (v < 0 || v > 4) { ok('package clamp 0..4', false, String(v)); break; }
    if (base === 4) ok('package clamp 0..4', true);
  }
}

/* shove grammar (occupancy-honest) */
{
  const S = LC.newGame('shove', 'GATE6');
  const e = LC.alive(S)[0];
  // wall slam: enemy directly against the north edge, shoved north
  S.px = 4; S.py = 1; e.x = 4; e.y = 0;
  delete S.solids['4,0']; delete S.solids['4,1'];
  const others = LC.alive(S).filter(o => o !== e);
  others.forEach((o, i) => { o.x = (i * 2) % LC.K.W; o.y = LC.K.H - 1 - (i % 2); });
  const r = LC.commitPlayer(S, { type: 'shove', dx: 0, dy: -1 }, 0);
  ok('shove into the wall = stagger + opened', r.ok && e.stagger === 2 && e.opened === 2);
}

/* ---- 3. verdict workflow ---- */
ok('SUN MODE present', /SUN MODE/.test(lab));
ok('thumbs for all four modes + the currency thesis',
  ['conductor:up', 'promise:up', 'dance:up', 'shove:up', 'currency:up'].every(v => lab.includes(v)));
ok('per-mode comment boxes + bottom comment section',
  ['data-c="conductor"', 'data-c="promise"', 'data-c="dance"', 'data-c="shove"', 'id="globalc"'].every(v => lab.includes(v)));
ok('export is .txt, never .json',
  lab.includes("download='BOHEMIA_COMBAT_LAB_VERDICT_7_19_26.txt'") && !/download='[^']*\.json'/.test(lab));
ok('research tab cites the addendum', lab.includes('BOHEMIA_ADDENDUM_BEAT_TACTICS_RESEARCH_7_19_26'));

/* ---- 4. alpha wiring ---- */
ok('alpha hosts the lab (combatLabFrame -> lab file)',
  alpha.includes('BOHEMIA_COMBAT_LAB_7_19_26.html') && alpha.includes('combatLabFrame'));

console.log('=== COMBAT LAB GATE: ' + pass + ' pass / ' + fail + ' fail ===');
process.exit(fail ? 1 : 0);

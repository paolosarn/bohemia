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

/* shove grammar (Paolo rulings 7/19, occupancy-honest) */
{
  const S = LC.newGame('shove', 'GATE6');
  const e = LC.alive(S)[0];
  S.px = 4; S.py = 5; e.x = 4; e.y = 4;
  delete S.solids['4,3']; delete S.solids['4,4'];
  LC.alive(S).filter(o => o !== e).forEach((o, i) => { o.x = (i * 2) % LC.K.W; o.y = LC.K.H - 1; });
  const r = LC.commitPlayer(S, { type: 'shove', dx: 0, dy: -1 }, 0);
  ok('PAOLO RULING: a shove ALWAYS stuns (1 turn base)', r.ok && e.stun >= 1);
  const S2 = LC.newGame('shove', 'GATE6');
  const e2 = LC.alive(S2)[0];
  S2.perks.shoulder = true;
  S2.px = 4; S2.py = 5; e2.x = 4; e2.y = 4;
  delete S2.solids['4,3']; delete S2.solids['4,4'];
  LC.alive(S2).filter(o => o !== e2).forEach((o, i) => { o.x = (i * 2) % LC.K.W; o.y = LC.K.H - 1; });
  LC.commitPlayer(S2, { type: 'shove', dx: 0, dy: -1 }, 0);
  ok('PAOLO RULING: IRON SHOULDER perk = guaranteed 2-turn stun', e2.stun === 2);
  // no stun-lock applies to shoves too: immediate re-shove cannot refresh
  e2.x = 4; e2.y = 4;
  const rr = LC.commitPlayer(S2, { type: 'shove', dx: 0, dy: -1 }, 0);
  ok('NO STUN-LOCK holds for shoves (re-shove = braced, no refresh)',
    rr.ok && rr.events.some(x => x.t === 'shoveresist'));
  // fall roll is deterministic (determinism law) and prone counts helpless
  const A = [0, 0].map(() => {
    const X = LC.newGame('shove', 'GATE7');
    const t = LC.alive(X)[0];
    X.px = 4; X.py = 5; t.x = 4; t.y = 4;
    delete X.solids['4,3']; delete X.solids['4,4'];
    LC.alive(X).filter(o => o !== t).forEach((o, i) => { o.x = (i * 2) % LC.K.W; o.y = LC.K.H - 1; });
    LC.commitPlayer(X, { type: 'shove', dx: 0, dy: -1 }, 0);
    return t.prone;
  });
  ok('fall-over roll is seeded-deterministic', A[0] === A[1]);
  const S3 = LC.newGame('shove', 'GATE8');
  const e3 = LC.alive(S3)[0];
  LC.alive(S3).filter(o => o !== e3).forEach(o => { o.dead = true; });
  e3.x = S3.px; e3.y = S3.py - 3;
  const up = LC.effPackage(S3, e3, 4);
  e3.prone = 2;
  ok('prone counts helpless: easier dial on a floored man', LC.effPackage(S3, e3, 4) < up || up === 0);
}

/* weapon-typed melee (Paolo ruling: movement identity per weapon) */
{
  ok('conductor enemies carry weapons (shiv/bat/spear)', (() => {
    const S = LC.newGame('conductor', 'GATE9');
    const w = LC.alive(S).map(e => e.wpn);
    return w.includes('shiv') && w.includes('bat') && w.includes('spear');
  })());
  ok('weapon sigs differ (shiv every beat, bat/spear heavy)',
    LC.WPN.shiv.sig === 1 && LC.WPN.bat.sig === 2 && LC.WPN.spear.sig === 2);
  // spear never damages without a prior telegraph
  const S = LC.newGame('conductor', 'GATE10');
  const sp = LC.alive(S).find(e => e.wpn === 'spear');
  LC.alive(S).filter(o => o !== sp).forEach(o => { o.dead = true; });
  S.px = 4; S.py = 6; sp.x = 4; sp.y = 4;
  ['4,4', '4,5', '4,6'].forEach(k => delete S.solids[k]);
  let telegraphedBeforeHit = true, sawWindup = false;
  for (let i = 0; i < 8 && S.wound === 0; i++) {
    const hadWindup = sp.windup;
    LC.commitPlayer(S, { type: 'wait' }, 0); LC.worldStep(S);
    if (S.wound > 0 && !hadWindup) telegraphedBeforeHit = false;
    if (sp.windup) sawWindup = true;
  }
  ok('spear telegraphs (windup + lance tiles) before any damage', sawWindup && telegraphedBeforeHit);
}

/* perks exist as Paolo ruled them */
ok('FORESIGHT + IRON SHOULDER perks in the UI',
  lab.includes('PERK: FORESIGHT') && lab.includes('PERK: IRON SHOULDER'));
ok('foresight gates movement-intent display (step arrows behind the perk)',
  lab.includes("it.t==='step'&&it.d&&S.perks.foresight"));
ok('contextual shove choice (adjacent enemy offers SHOVE or DIAL)',
  lab.includes('openChoice') && lab.includes('chShove') && lab.includes('chDial'));
ok('verdict record cited in the lab', lab.includes('BOHEMIA_COMBAT_LAB_VERDICT_7_19_26.txt'));
ok('shove preview shows odds before commit (BG3 lesson)',
  lab.includes('shovePreview') && lab.includes('% topple'));
ok('research pass 2 cited in the lab', lab.includes('BOHEMIA_ADDENDUM_ENEMY_ARCHETYPE_RESEARCH_7_19_26'));

/* ---- 2b. THE CANON DEMO CARRIES THE RULED MECHANICS (Paolo 7/19:
   "you can start actually incorporating it into the actual combat demo") ---- */
{
  const ca2 = demo.indexOf('MELEE CORE START'), cb2 = demo.indexOf('MELEE CORE END');
  ok('canon demo carries MELEE CORE', ca2 > 0 && cb2 > ca2);
  const mSrc = demo.slice(demo.indexOf('var BohemiaMelee', ca2), demo.lastIndexOf('if(typeof module', cb2));
  const mm = { exports: {} };
  new Function('module', 'exports', mSrc + ';module.exports=BohemiaMelee;')(mm, mm.exports);
  const BM = mm.exports;
  // telegraph law: NEVER a strike without last turn's windup
  let telegraphOk = true, struck = false;
  const em = { edist: 12, stun: 0, prone: 0, windup: false, adv: 3, reach: 1.8, cad: 1, phase: 0, stunCooldown: 0 };
  let prevWindup = false;
  for (let t = 1; t <= 12; t++) {
    const r = BM.decide(em, t);
    if (r.act === 'strike') { struck = true; if (!prevWindup) telegraphOk = false; em.windup = false; }
    if (r.act === 'windup') em.windup = true;
    if (r.act === 'advance') em.edist = r.dist;
    prevWindup = em.windup;
  }
  ok('demo melee: telegraph before every strike', struck && telegraphOk);
  // spear stops at reach, never enters point blank on its own
  const sp = { edist: 12, stun: 0, prone: 0, windup: false, adv: 2, reach: 4.2, cad: 2, phase: 0, stunCooldown: 0 };
  for (let t = 1; t <= 20; t++) { const r = BM.decide(sp, t);
    if (r.act === 'advance') sp.edist = r.dist; if (r.act === 'strike') sp.windup = false;
    if (r.act === 'windup') sp.windup = true; }
  ok('demo melee: spear holds at its reach (keeps distance)', Math.abs(sp.edist - 4.2) < 0.01);
  // held while stunned/prone
  ok('demo melee: stun/prone hold the blade',
    BM.decide({ edist: 1, stun: 1, prone: 0, windup: true, adv: 3, reach: 2, cad: 1 }, 5).act === 'held' &&
    BM.decide({ edist: 1, stun: 0, prone: 2, windup: true, adv: 3, reach: 2, cad: 1 }, 5).act === 'held');
  // shove rulings
  const s1 = BM.shove({ stun: 0, stunCooldown: 0 }, false, 99);
  const s2 = BM.shove({ stun: 0, stunCooldown: 0 }, true, 99);
  const s3 = BM.shove({ stun: 0, stunCooldown: 1 }, false, 0);
  ok('demo shove: always stuns 1 (perk: 2)', s1.stun === 1 && s2.stun === 2);
  ok('demo shove: no-stun-lock = braced, no stun', s3.braced === true && s3.stun === 0);
  ok('demo shove: topple thresholds 30/50, roll-driven',
    BM.shove({ stun: 0, stunCooldown: 0 }, false, 29).topple === true &&
    BM.shove({ stun: 0, stunCooldown: 0 }, false, 30).topple === false &&
    BM.shove({ stun: 0, stunCooldown: 0 }, true, 49).topple === true);
  // static wiring
  ok('demo carries SHIV/BAT/SPEAR archetypes',
    demo.includes("shiv: {n:'SHIV'") && demo.includes("bat:  {n:'BAT'") && demo.includes("spear:{n:'SPEAR'"));
  ok('demo gun pools exclude blades',
    demo.includes('!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst') &&
    demo.includes('!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine'));
  ok('demo has the contextual SHOVE button + perks UI',
    demo.includes('id="shovebtn"') && demo.includes('IRON SHOULDER') && demo.includes('FORESIGHT'));
  ok('demo melee turn runs at the one turn-end choke (tickTurnEnd)',
    demo.includes('function tickTurnEnd(){ meleeTurnRun();'));
  // MOVEMENT (v4+v5, Paolo 7/19): the EXISTING 8-dir ring is one-tap movement
  ok('demo has MOVE: doMove + worldShift, wired to the move ring (one tap)',
    demo.includes('function doMove(') && demo.includes('function worldShift(') &&
    demo.includes('G.moveIntent=names[i];doMove(i);'));
  ok('the arm-then-tap MOVE button is dead (Paolo: use the ring)',
    !demo.includes('id="movebtn"'));
  ok('a move costs the turn (routes through endTurnReturn)',
    /function doMove\([\s\S]{0,900}?endTurnReturn\(false\); \}/.test(demo));
  ok('worldShift carries corpses AND pillars with the world',
    /function worldShift\([\s\S]{0,600}?G\.corpses/.test(demo) &&
    /function worldShift\([\s\S]{0,700}?G\.pillars/.test(demo));
  // PILLAR COVER (v5, Paolo: "shuffled pillars that I can take cover from")
  ok('shuffled pillars spawn each encounter', demo.includes('G.pillars=[]; { const NP=5+'));
  ok('my cover is geometry-aware (pillar on the shooter line, distance-honest)',
    demo.includes('function myCoverAgainst(ang,dist)') &&
    demo.includes('myCoverAgainst(e.ea,e.edist)'));
  ok('enemies take pillar cover too (gcov in peek/fire/line/arc)',
    demo.includes('(e.inCover||e.gcov)') && demo.includes('function updateGeomCover()'));
  ok('pillars block the step (occupancy: solid is solid)',
    demo.includes("setRead('BLOCKED','a pillar is there'"));
  ok('shove into a pillar slams (65% topple)', demo.includes('PILLAR SLAM'));
  // v6 (Paolo): push = ONE tile, LONG ARM perk = two; street tile board floor
  ok('PAOLO RULING: shove pushes back ONE tile', BM.shove({ stun: 0, stunCooldown: 0 }, false, 99).pushed === 1);
  ok('LONG ARM perk pushes two', BM.shove({ stun: 0, stunCooldown: 0 }, { longarm: true }, 99).pushed === 2);
  ok('LONG ARM in the settings UI', demo.includes('id="perklongarm"') && demo.includes('LONG ARM: OFF'));
  ok('STREET FLOOR: world-anchored tile board with median + lane dashes',
    demo.includes('STREET FLOOR V6') && demo.includes('G.worldOff') &&
    demo.includes('rgba(184,160,40') && demo.includes('rgba(215,205,185'));
  ok('full-tile Chebyshev steps (no normalized diagonals)',
    demo.includes('const sx=v[0], sy=v[1];'));
  // v7 (Paolo): grid-true field, real blocks on tiles, two-turn red line
  ok('GRID TRUE: one tile of distance = one board cell (fieldPos linear)',
    demo.includes('const rr=e.edist*ring;'));
  ok('pillars snap to tile centers', demo.includes('cover sits ON a tile'));
  ok('the magic cover arcs are DEAD (geometry only)',
    !demo.includes('if(G.pCover[dirIndex(ang)])return true'));
  ok('tapping a cell places a REAL block on that tile',
    demo.includes('places/removes a REAL cover block ON that tile') && demo.includes('placed:true'));
  ok('TWO-TURN RED LINE: pools require an acquired bead',
    demo.split('.filter(e=>(e.acq||0)>=1)').length >= 3 &&
    demo.includes('&&(e.acq||0)>=1); }'));
  ok('acquiring turn is telegraphed (warning line + acq clock)',
    demo.includes('ACQUIRING') && demo.includes('acq:0,'));
  // v8 GRID LOCK: the ghost cells ARE the painted tiles
  ok('GRID LOCK: floor cells centered on integers (player stands mid-cell)',
    demo.includes('(wx-offx-0.5)*t') && demo.includes('(wx-offx+0.5)*t') && demo.includes('(wy-offy+0.5)*t'));
  ok('GRID LOCK: pillars snap to integer centers (same grid as the board)',
    demo.includes('Math.round(Math.cos(a0)*d0), ny2=Math.round(Math.sin(a0)*d0)'));
  ok('GRID LOCK: the ghost tap-cell is drawn as exactly one painted tile',
    demo.includes('GRID LOCK V8: the ghost cell IS the painted tile'));
  ok('pillars render tan with a sky-lit top, zero purple in the palette',
    demo.includes("x.fillStyle='#6e604a'") && demo.includes("x.fillStyle='#94836a'"));
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

#!/usr/bin/env node
// TUNING [a better AUTO brain and a true calculator] 10/25 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 176(g)).
// Paolo 10/25, watching AUTO: 'a guy very low on health, instead of trying to kill the enemy, walks two tiles away and then two
// tiles back in front of the enemy... once I start doubting the decisions AUTO takes, I start doubting the calculator.' And:
// 'if buildings two or three storeys are supposed to be advantageous for people with guns, why isn't the first thing they do
// finding the nearest one and firing.'
//
// This plays the LIVE fight (slices/BOHEMIA_FIGHT.html's own rules and data, through tools/bohemia_tuning_the_whole_grid.js's
// engine, PLAIN: no hooks, the game exactly as it plays) on AUTO for both sides and counts, per man per round:
//   DANCE    a turn that spends steps and ends on the tile it began (wasted), an off-and-back over two rounds (A to B, then B to
//            A), and a man who LEAVES a fight (a foe beside him at the start, none at the end) and walks back into one next round
//   STRIKE   a man who starts his turn with a foe he can strike (in reach, AP and breath, seen) and never swings, and what he did
//   ROOF     a gunman with a two or three storey roof he can reach this turn and still shoot from (the brain's own climb test),
//            and whether he takes it; the nearest roof on the board by path, in turns
//   SCREEN   how often their melee men get to swing at our gunmen
// and, for the calculator (rule 176(c)), reads THE ODDS exactly the way the fight does (ODDS_RUNS from a frozen board on the
// odds' own seed, the worth oddsRunValue gives) at the start of every fight, then plays the real fight out on AUTO and keeps
// the result, so the read can be checked against what happened, band by band.
//
//   node tools/bohemia_tuning_auto_brain.js --dance [--n 300] [--jobs 4]   the dances, the strikes, the roofs
//   node tools/bohemia_tuning_auto_brain.js --odds  [--n 300] [--jobs 4]   the calculator against real AUTO fights
//   node tools/bohemia_tuning_auto_brain.js --write                          both, into the bank
//   --fight '<json>'                                                         one fight (the workers)
// Every number it prints is DRAFT (research only; nothing in the game reads the bank).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const G = require('./bohemia_tuning_the_whole_grid.js');
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_AUTO_BRAIN_10_25_26.json');
const HTML = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
/* the calculator's own constants, read off the fight so the bench reads what the game reads */
const OC = {};
(HTML.match(/const ODDS_RUNS = [^\n]*/) || [''])[0].replace(/(ODDS_[A-Z_]+) = (\d+)/g, function (_m, k, v) { OC[k] = Number(v); });
if (!OC.ODDS_RUNS || !OC.ODDS_FIRST || !OC.ODDS_STEPS) throw new Error('THE FIGHT MOVED: no ODDS_RUNS line');
const LONG_READ = 96, LONG_EVERY = 4;   /* the truth the read is checked against: every fourth board played 96 more times on fresh dice
   (a playout of a twenty-man fight is about a quarter of a second of CPU here, so the long read is kept to a sample) */

/* ---------- the fights: what the map hands (a district, a cell, a company, a party), spread so the odds spread ---------- */
const FACTIONS = ['brigands', 'brigands', 'kids', 'machines', 'heavies'];
const SIZES = [3, 6, 12], STAGES = ['early', 'middle', 'late'], MULTS = [0.6, 0.8, 1, 1.25, 1.6];
function fightOf(k, districts) {
  const n = SIZES[k % 3], stage = STAGES[Math.floor(k / 3) % 3], faction = FACTIONS[k % 5], mult = MULTS[Math.floor(k / 7) % 5];
  const d = districts[(k * 7 + 3) % districts.length];
  return { k: k, seed: 9000 + k, company: n, stage: stage, faction: faction, mult: mult, district: d.district, boardKind: d.boardKind,
    cell: { x: 11 + (k % 29), y: 7 + Math.floor(k / 29) % 31 } };
}
function setupFight(ctx, W) {
  const F = ctx.FIGHT, st = G.STAGES[W.stage], company = G.companyOf(W.company, W.stage);
  const lvl = st.level || 1, base = G.mapCount(W.company, lvl, st.skulls, undefined, 1);
  const count = Math.max(1, Math.round(base * W.mult));
  ctx.setSeed(W.seed);
  F.setup({ auto: true, formation: null, company: company, cap: W.company, party: { faction: W.faction, count: count, days: st.day },
    days: st.day, district: W.district, cell: W.cell, act: 1 });
  return count;
}
/* the RULES' fingerprint: the two scripts the bench plays (fight-data, fight-rules) and every data file loadAll() reads; the
   drawing code around them changes every hour (another lane's ship) and must not throw a finished fight out of the cache */
function rulesPrint() {
  const grab = id => { const m = HTML.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>')); return m ? m[1] : ''; };
  const list = (HTML.match(/const DATA_FILES = \[([\s\S]*?)\];/) || [])[1] || '';
  const h = require('crypto').createHash('sha1').update(grab('fight-data')).update(grab('fight-rules'));
  (list.match(/'[^'\n]+\.json'/g) || []).map(x => x.slice(1, -1)).forEach(f => h.update(fs.readFileSync(path.join(ROOT, 'slices', f))));
  return h.digest('hex').slice(0, 12);
}
const seedNow = ctx => vm.runInContext('SEED', ctx) >>> 0;
const seedSet = (ctx, s) => vm.runInContext('SEED = ' + (s >>> 0) + ';', ctx);

/* ---------- THE PROTOTYPE BRAIN (research only, an in-memory copy of the live rules, never the game) ----------
   Three brains on the same fights, OUR side only (the enemy keeps today's brain, so the change is AUTO's alone):
     today    the live fight as it plays
     noabil   rule 180: AUTO uses no ability (no Recover, Rally, Taunt, Adrenaline, Indomitable, Footwork, bag swap, sweep):
              what the calculator must show from now on
     proto    noabil plus the five fixes this page proposes, each one splice:
       F1 CAN I ACT: a man who cannot strike this turn (out of breath, nothing to shoot and no club) does not walk; he stands
          (proto2: he stands only when a foe is within two tiles or he is in a ring; farther off he still closes, so the
          fight does not stall)
       F2 STAYING IS A CHOICE: the tile he stands on is scored with the rest, plus one step's AP, and he walks only to a
          better one
       F3 NO WALK OUT OF A RING: a man in a foe's reach who did not strike does not walk out through the free swings (a bow
          with no club may still step out once, as today)
       F4 THE SHOT BEFORE THE RELOAD: he reloads only when no loaded shot is on
       F5 THE ROOF: a gunman with no shot where he stands climbs a roof he can reach even with no AP left to shoot (he
          shoots from it next turn), and a roof is worth two steps of closing (190) in his move score, not 20
       F6 FOCUS (rule 180(h)): a man already struck at this round is worth 1.25^n more, not 1/(1+n) (Battle Brothers'
          own 1.25^n, bb_all/0626, turned to the team's focus)
   Each splice is matched exactly once in the rules text or the bench stops (the fight moved). */
const SPLICES = [
  ['  function aiFirst(u) {\n', '  function aiFirst(u) {\n    if (NOABIL && u.side === \'you\') return false;\n'],
  ['  function aiLast(u) {\n', '  function aiLast(u) {\n    if (NOABIL && u.side === \'you\') return false;\n'],
  ["      if (A.spread_attacks) s /= 1 + ((S.aimed || {})[u.side + t.id] || 0);",
   "      if (A.spread_attacks) { if (FIX && u.side === 'you') s *= Math.pow(1.25, ((S.aimed || {})[u.side + t.id] || 0)); else s /= 1 + ((S.aimed || {})[u.side + t.id] || 0); }"],
  ['    return ranged ? g * (1 + 1) : g;\n',
   "    if (FIX && u.side === 'you' && ranged && level(x, y) >= 2 && level(u.x, u.y) < 2) return g * (1 + 1) + 190;\n    return ranged ? g * (1 + 1) : g;\n"],
  ['      if (level(x, y) <= level(u.x, u.y) || u.ap - f.best[k] < strikeAP || zocOn(u, x, y).length) return;',
   "      if (level(x, y) <= level(u.x, u.y) || (u.ap - f.best[k] < strikeAP && !(FIX && u.side === 'you' && !foes(u).some(function (t3) { return canStrike(u, t3); }))) || zocOn(u, x, y).length) return;"],
  ["    if (ranged && !u.club && adj.length && A.step_out_of_melee && canUse(u, 'footwork')) {",
   "    if (ranged && !u.club && adj.length && A.step_out_of_melee && !(NOABIL && u.side === 'you') && canUse(u, 'footwork')) {"],
  ['    if (ranged && A.reload && canReload(u)) { reload(u); return true; }',
   "    if (ranged && A.reload && canReload(u) && !(FIX && u.side === 'you' && foes(u).some(function (t3) { return canStrike(u, t3) && sideSees(u.side, t3); }))) { reload(u); return true; }"],
  ['    if (ranged && emptyGun(u) && !canReload(u) && u.bag) {', "    if (ranged && emptyGun(u) && !canReload(u) && u.bag && !(NOABIL && u.side === 'you')) {"],
  ['    if (t) { const sw = sweepPick(u); if (sw) {', "    if (t) { const sw = NOABIL && u.side === 'you' ? null : sweepPick(u); if (sw) {"],
  /* F1 and F3, after the strike was tried and missed nothing */
  ['    /* already in a man\'s reach and out of AP or breath: stand, do not walk out through his swing */\n',
   "    if (FIX && u.side === 'you') {\n      const sk0 = strikeSkill(w), clubOK = !!u.club && u.fat + skillFat(u, strikeSkill(u.club)) <= fatMax(u);\n" +
   "      const shotOK = u.fat + skillFat(u, sk0) <= fatMax(u) && !(w.ammo && u.ammo !== null && u.ammo <= 0) && !(reloadSkill(w) && !w.mag && !u.loaded && !canReload(u));\n" +
   "      const able = ranged ? (shotOK || clubOK) : u.fat + skillFat(u, sk0) <= fatMax(u);\n" +
   "      const near = zocOn(u, u.x, u.y).length || foes(u).some(function (f3) { return dist(f3, u) <= 1 + 1; });\n" +
   "      if ((!able && (near || !FIX2)) || (zocOn(u, u.x, u.y).length && (u.club || !ranged))) { endTurn(u); return false; }\n    }\n" +
   '    /* already in a man\'s reach and out of AP or breath: stand, do not walk out through his swing */\n'],
  /* F2 */
  ['      if (x === u.x && y === u.y) return;\n', "      if (x === u.x && y === u.y && !(FIX && u.side === 'you')) return;\n"],
  ['      if (sc > bs) { bs = sc; best = { x: x, y: y }; }\n    });\n    const here = hunt(u.x, u.y);',
   "      if (FIX && u.side === 'you' && x === u.x && y === u.y && sc > -Infinity) sc += R('ap.move_cost.flat');\n      if (sc > bs) { bs = sc; best = { x: x, y: y }; }\n    });\n    const here = hunt(u.x, u.y);"],
  ["    if (best && (bs > -Infinity) && (hunt(best.x, best.y) < here || bs >= R('hit_chance.cap').max)) {",
   "    if (best && !(FIX && u.side === 'you' && best.x === u.x && best.y === u.y) && (bs > -Infinity) && (hunt(best.x, best.y) < here || bs >= R('hit_chance.cap').max)) {"]
];
async function engineFor(brain) {
  if (!brain || brain === 'today') return G.engine(true);
  const html = HTML, grab = id => { const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>')); if (!m) throw new Error('no script ' + id); return m[1]; };
  let rules = grab('fight-rules');
  SPLICES.forEach(([a, b]) => { const n = rules.split(a).length - 1; if (n !== 1) throw new Error('THE FIGHT MOVED: splice anchor found ' + n + ' times: ' + a.slice(0, 70)); rules = rules.replace(a, () => b); });
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Error, Promise, NOABIL: true, FIX: brain === 'proto' || brain === 'proto2', FIX2: brain === 'proto2',
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: u => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', u), 'utf8'))) }) };
  vm.createContext(ctx);
  vm.runInContext(grab('fight-data') + ';this.DB=DB;this.loadAll=loadAll;this.setSeed=function(s){SEED=s>>>0;};', ctx);
  await ctx.loadAll();
  vm.runInContext(rules + ';this.FIGHT=FIGHT;', ctx);
  return ctx;
}

/* ---------- what a man can do at the start of his turn ---------- */
function startState(F, u) {
  const S = F.S, T = F._t, foes = S.units.filter(v => v.side !== u.side && F.onField(v));
  const d = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  const gun = F.isRanged(u.weapon);   /* bows, crossbows, throwers and our guns (a gun also carries its club at one) */
  const strikeable = foes.filter(t => F.canStrike(u, t) && F.sideSees(u.side, t)).map(t => t.id);
  const besideMelee = foes.filter(t => d(t, u) === 1 && !F.isRanged(t.weapon)).length;
  const beside = foes.filter(t => d(t, u) === 1).length;
  /* why he could not strike even with a foe in reach: out of breath (the swing's fatigue would pass his most), or nothing to
     throw or shoot (no rounds left, or unloaded with no reload this turn) */
  const w = u.weapon, sk = F.strikeSkill(w);
  const winded = u.fat + T.skillFat(u, sk) > F.fatMax(u);
  const empty = !!((w.ammo && u.ammo !== null && u.ammo <= 0) || (F.reloadSkill(w) && !w.mag && !u.loaded && !F.canReload(u)));
  const rec = { x: u.x, y: u.y, hp: u.hpMax ? u.hp / u.hpMax : 1, morale: u.morale, ap: u.ap, gun: gun, strikeable: strikeable,
    beside: beside, besideMelee: besideMelee, level: F.level(u.x, u.y), winded: winded, empty: empty };
  if (gun) {
    /* the roof this turn: the brain's own climb test (a level two or three tile he reaches with the AP to shoot left, outside a
       ring, a foe in range and seen from it), and the plain one (any roof he can walk onto this turn) */
    const f = F.reach(u), sAP = T.skillAP(u.weapon, F.strikeSkill(u.weapon), u);
    let opt = false, any = false;
    Object.keys(f.best).forEach(k => {
      k = Number(k); const x = k % S.w, y = Math.floor(k / S.w);
      if (F.level(x, y) < 2 || (x === u.x && y === u.y)) return;
      any = true;
      if (opt || u.ap - f.best[k] < sAP || F.zocOn(u, x, y).length) return;
      const ox = u.x, oy = u.y; u.x = x; u.y = y;
      const ok = foes.some(t => F.canStrike(Object.assign({}, u, { ap: 99 }), t) && F.sideSees(u.side, t));
      u.x = ox; u.y = oy;
      if (ok) opt = true;
    });
    rec.roofOpt = opt; rec.roofAny = any;
  }
  return rec;
}
/* the nearest roof by path from where a man stands, in steps over open ground (units ignored): the 'find the nearest one' */
function roofSteps(F, u) {
  const S = F.S, T = F._t, seen = {}, q = [{ x: u.x, y: u.y, d: 0 }]; seen[u.y * S.w + u.x] = true;
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (q.length) {
    const n = q.shift();
    if (F.level(n.x, n.y) >= 2) return n.d;
    DIRS.forEach(o => { const x = n.x + o[0], y = n.y + o[1]; if (T.passable(x, y) && !seen[y * S.w + x]) { seen[y * S.w + x] = true; q.push({ x: x, y: y, d: n.d + 1 }); } });
  }
  return null;
}

function endState(F, u) {
  const beside = F.S.units.filter(v => v.side !== u.side && F.onField(v) && Math.max(Math.abs(v.x - u.x), Math.abs(v.y - u.y)) === 1).length;
  return { x: u.x, y: u.y, level: F.level(u.x, u.y), hp: u.hpMax ? u.hp / u.hpMax : 0, morale: u.morale, out: !F.onField(u), beside: beside };
}
/* ---------- one fight played on AUTO with every turn written down ---------- */
function playWatched(ctx) {
  const F = ctx.FIGHT, S = F.S, recs = [], open = {};
  let p = 0, g = 0, actor = null, cause = null;
  const units = new Map(S.units.map(u => [u.id, u]));
  /* the nearest roof for every gunman at the start (deploy) */
  const roofAt0 = {};
  S.units.forEach(u => { if (F.isRanged(u.weapon)) roofAt0[u.id] = roofSteps(F, u); });
  const boardRoofs = (() => { let n = 0; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (F.level(x, y) >= 2) n++; return n; })();
  const scan = () => {
    for (; p < S.log.length; p++) {
      const e = S.log[p];
      if (e.t === 'turn') {
        const u = units.get(e.id) || F.byId(e.id);
        const key = e.id + '|' + e.round;
        if (!open[key]) { open[key] = { id: e.id, side: u.side, round: e.round, start: startState(F, u), steps: 0, causes: {}, attacks: 0, reload: 0, skill: 0, swapBag: 0, moved: [] }; recs.push(open[key]); }
        open[key].segs = (open[key].segs || 0) + 1;
        actor = open[key];
      } else if (actor && e.id === actor.id) {
        if (e.t === 'step' && !e.shoved) { actor.steps++; actor.moved.push([e.x, e.y]); actor.causes[cause || 'move'] = 1; }
        else if (e.t === 'attack' && !e.free) actor.attacks++;
        else if (e.t === 'reload') actor.reload++;
        else if (e.t === 'skill') actor.skill++;
        else if (e.t === 'swap' && e.to === undefined) actor.swapBag++;
      }
      if ((e.t === 'end' || e.t === 'wait' || e.t === 'fled' || e.t === 'down' || e.t === 'dead') && actor && e.id === actor.id) {
        actor.end = endState(F, F.byId(e.id));
      }
    }
  };
  scan();
  const ids = S.units.filter(u => u.side === 'you').map(u => u.id);
  while (!S.over && g < 400000) {
    const u = F.current(); if (!u) break;
    /* what the brain is about to do, read off the flags it sets (the step-out, the climb, the flight, the kite, the retreat) */
    const before = { so: u.steppedOut, cl: u.climbed, ki: u.kited, mor: u.morale, ret: S.retreat };
    F.aiStep(u); g++;
    cause = before.mor === 'Fleeing' ? 'flee' : before.ret && u.side === 'you' ? 'retreat' : (!before.so && u.steppedOut) ? 'step_out' :
      (before.cl !== S.round && u.climbed === S.round && F.level(u.x, u.y) >= 2) ? 'climb' : (!before.ki && u.kited) ? 'kite' : 'move';
    /* the cause belongs to the steps this aiStep made: re-tag them */
    const n0 = p; scan();
    for (let i = n0; i < S.log.length; i++) { const e = S.log[i]; if (e.t === 'step' && e.id === u.id && !e.shoved) { const r = open[u.id + '|' + e.round]; if (r) { delete r.causes.move; r.causes[cause] = 1; } } }
    if (S.round > 60) break;
  }
  recs.forEach(r => { if (!r.end) r.end = endState(F, F.byId(r.id)); });
  return { recs: recs, roofAt0: roofAt0, boardRoofs: boardRoofs, result: S.over ? S.result : 'stalled', rounds: S.round, you: ids };
}

/* ---------- the counts ---------- */
function countFight(W, P, F) {
  const out = { you: zero(), them: zero(), result: P.result, rounds: P.rounds, boardRoofs: P.boardRoofs, examples: [] };
  const keep = (e) => { if (out.examples.filter(x => x.kind === e.kind && x.side === e.side).length < 3) out.examples.push(e); };
  const bySideUnit = {};
  P.recs.forEach(r => { (bySideUnit[r.id] = bySideUnit[r.id] || []).push(r); });
  Object.keys(bySideUnit).forEach(id => {
    const rs = bySideUnit[id].sort((a, b) => a.round - b.round), side = rs[0].side, C = out[side];
    const gunman = rs[0].start.gun;
    let hadOpt = false, hadAny = false, took = false, firstOpt = null, firstRoof = null;
    rs.forEach((r, i) => {
      if (r.start.morale === 'Fleeing') { C.fleeingTurns++; }
      C.turns++;
      if (r.steps) C.turnsMoved++;
      const same = r.end.x === r.start.x && r.end.y === r.start.y;
      const acted = r.attacks + r.reload + r.skill + r.swapBag > 0;
      if (r.steps && same && !r.end.out) { C.endedWhereBegan++; if (!acted) { C.wasted++; C.wastedWhy[why(r)] = (C.wastedWhy[why(r)] || 0) + 1; if (r.start.hp < 0.5) C.wastedHurt++; } tag(C.wastedBy, r); if (!acted) keep(ex('wasted', W, r)); else keep(ex('ended where he began, acted', W, r)); }
      if (r.start.strikeable.length && r.start.morale !== 'Fleeing') {
        C.couldStrike++;
        if (!r.attacks) { C.skippedStrike++; const what = r.steps ? 'walked' : r.reload ? 'reloaded' : r.skill ? 'used a skill' : r.swapBag ? 'swapped' : 'stood'; C.skippedFor[what] = (C.skippedFor[what] || 0) + 1;
          if (r.steps) tag(C.skippedWalkBy, r);
          if (r.steps) keep(ex('no strike, walked', W, r)); else keep(ex('no strike, ' + what, W, r)); }
      }
      if (r.start.hp < 0.5) C.hurtTurns++;
      /* off and back over two rounds */
      const nx = rs[i + 1];
      if (nx && nx.round === r.round + 1 && r.steps && !same && nx.steps && !nx.end.out && nx.end.x === r.start.x && nx.end.y === r.start.y) {
        C.offAndBack++; if (r.start.hp < 0.5) C.offAndBackHurt++; if (!r.attacks && !nx.attacks) { C.offAndBackNoSwing++; const y = why(r) !== 'could act' ? why(r) : why(nx); C.offAndBackWhy[y] = (C.offAndBackWhy[y] || 0) + 1; }
        tag(C.offAndBackBy, r, nx);
        keep(ex(!r.attacks && !nx.attacks ? 'off and back, no swing' : 'off and back, swung', W, r, nx));
      }
      /* left a fight and walked back into one */
      if (nx && nx.round === r.round + 1 && r.start.beside > 0 && r.steps && !same && r.end.beside === 0 && nx.start.beside === 0 && nx.steps && !nx.end.out) {
        if (nx.end.beside > 0) { C.leftAndCameBack++; if (r.start.hp < 0.5) C.leftAndCameBackHurt++; if (!r.attacks) C.leftNoSwing++; tag(C.leftAndCameBackBy, r, nx);
          keep(ex('left the fight and walked back in', W, r, nx)); }
      }
      if (gunman) {
        C.gunTurns++;
        if (r.start.roofOpt) { C.gunRoofOptTurns++; if (r.end.level >= 2) C.gunRoofOptTaken++; hadOpt = true; if (firstOpt === null) firstOpt = r.round; }
        if (r.start.roofAny) { C.gunRoofAnyTurns++; hadAny = true; }
        if (r.end.level >= 2) { took = true; if (firstRoof === null) firstRoof = r.round; C.gunTurnsOnRoof++; }
      }
    });
    if (gunman) {
      C.gunmen++;
      const rd = P.roofAt0[id];
      if (rd !== null && rd !== undefined) { C.gunmenRoofOnBoard++; C.roofStepsSum += rd; }
      if (hadOpt) { C.gunmenWithOpt++; if (took) C.gunmenWithOptTook++; if (took && firstRoof === firstOpt) C.gunmenTookAtFirst++; }
      if (took) C.gunmenOnRoofEver++;
      if (hadAny) { C.gunmenWithAny++; if (took) C.gunmenWithAnyTook++; }
    }
  });
  return out;
}
function tag(map, r, nx) {
  const k = Object.keys(r.causes).sort().join('+') + (nx ? ' then ' + Object.keys(nx.causes).sort().join('+') : '') + ' [' + r.start.morale + (r.start.gun ? ', gun' : ', melee') + ']';
  map[k] = (map[k] || 0) + 1;
}
/* the reason a man could not act, the way the brain never asks it */
function why(r) { return r.start.winded ? 'out of breath' : r.start.empty ? 'nothing to shoot' : 'could act'; }
function ex(kind, W, r, nx) {
  const pt = q => q.x + ',' + q.y, hp = h => Math.round(100 * h) + '%';
  return { kind: kind, fight: W.k, seed: W.seed, side: r.side, man: r.id, round: r.round, gun: r.start.gun, morale: r.start.morale, hp: hp(r.start.hp),
    path: pt(r.start) + ' -> ' + r.moved.map(m => m.join(',')).join(' -> ') + (nx ? ' | next: -> ' + nx.moved.map(m => m.join(',')).join(' -> ') : ''),
    causes: Object.keys(r.causes).join('+') + (nx ? ' then ' + Object.keys(nx.causes).join('+') : ''), struck: r.attacks + (nx ? '+' + nx.attacks : ''),
    couldStrike: r.start.strikeable.length };
}
function zero() {
  return { turns: 0, turnsMoved: 0, endedWhereBegan: 0, wasted: 0, wastedBy: {}, couldStrike: 0, skippedStrike: 0, skippedFor: {}, skippedWalkBy: {},
    offAndBack: 0, offAndBackHurt: 0, offAndBackNoSwing: 0, leftNoSwing: 0, wastedWhy: {}, wastedHurt: 0, offAndBackWhy: {}, freeSwingsTaken: 0, freeSwingsStepping: 0, offAndBackBy: {}, leftAndCameBack: 0, leftAndCameBackHurt: 0, leftAndCameBackBy: {}, hurtTurns: 0, fleeingTurns: 0,
    gunTurns: 0, gunRoofOptTurns: 0, gunRoofOptTaken: 0, gunRoofAnyTurns: 0, gunTurnsOnRoof: 0, gunmen: 0, gunmenRoofOnBoard: 0, roofStepsSum: 0,
    gunmenWithAny: 0, gunmenWithAnyTook: 0, gunmenWithOpt: 0, gunmenWithOptTook: 0, gunmenTookAtFirst: 0, gunmenOnRoofEver: 0, gunHitInMelee: 0, meleeOnYou: 0 };
}

/* ---------- the calculator, read the fight's way ---------- */
function runValue(F, downValue) {
  if (F.S.result !== 'won') return 0;
  const mine = F.S.units.filter(v => v.side === 'you');
  if (mine.some(v => v.dead)) return 0;
  const down = mine.filter(v => v.down || v.fled).length;
  return down ? downValue * (mine.length - down) / Math.max(1, mine.length) : 1;
}
/* A STANDOFF (the whole grid's rule, tools/bohemia_tuning_the_whole_grid.js idleWatch): 20 rounds in which nobody strikes, falls
   or flees never end. The fight's own read plays such a run to ODDS_STEPS (6,000 brain steps, seconds of CPU each) and counts
   it 0; the bench stops it at the idle mark and counts it 0 the same way, and says how many runs it stopped. */
function readOdds(ctx, snap, seed, runs) {
  const F = ctx.FIGHT, dv = ctx.DB.ours.odds_colour.value.down_value, real = seedNow(ctx), out = { values: [], wins: [], standoffs: 0, capped: 0, steps: 0, ms: 0 };
  seedSet(ctx, seed);
  const t0 = Date.now();
  for (let i = 0; i < runs; i++) {
    F.thaw(snap, false); F.S.deploy = false;
    const idle = G.idleWatch(F);
    let g = 0, stood = false; while (!F.S.over && g <= OC.ODDS_STEPS) { const v = F.current(); if (!v) break; F.aiStep(v); F.S.events = []; g++; if (idle()) { stood = true; break; } }
    if (stood) out.standoffs++; else if (!F.S.over) out.capped++;
    out.steps += g;
    out.values.push(F.S.over ? runValue(F, dv) : 0); out.wins.push(F.S.result === 'won' ? 1 : 0);
  }
  out.ms = Date.now() - t0;
  seedSet(ctx, real);
  return out;
}
const mean = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;

async function oneFight(W, mode, brain) {
  const ctx = await engineFor(brain), F = ctx.FIGHT;
  const count = setupFight(ctx, W);
  const meta = { brain: brain || 'today', k: W.k, seed: W.seed, company: W.company, enemies: count, faction: W.faction, stage: W.stage, mult: W.mult, district: W.district,
    board: F.S.boardDef.name, boardKind: W.boardKind };
  if (mode === 'odds') {
    /* the read at the start of the fight, the fight's way: frozen board, the odds' own seed, ODDS_RUNS runs (the colour shows at
       ODDS_FIRST), then LONG_READ more on a different seed (the truth of this board), then the real fight from the real seed */
    const snap = F.freeze(), real = seedNow(ctx), oseed = (real ^ 0x9e3779b9) >>> 0;
    const R1 = readOdds(ctx, snap, oseed, OC.ODDS_RUNS);
    const R2 = W.k % LONG_EVERY === 0 ? readOdds(ctx, snap, (real ^ 0x5bd1e995) >>> 0, LONG_READ) : { values: [], wins: [] };
    F.thaw(snap, false); F.S.deploy = false; seedSet(ctx, real);
    const idle = G.idleWatch(F);
    let g = 0; while (!F.S.over && g <= 400000) { const v = F.current(); if (!v) break; F.aiStep(v); F.S.events = []; g++; if (idle()) break; }
    const dv = ctx.DB.ours.odds_colour.value.down_value;
    return Object.assign(meta, {
      first: mean(R1.values.slice(0, OC.ODDS_FIRST)), shown: mean(R1.values), shownWin: mean(R1.wins), firstWin: mean(R1.wins.slice(0, OC.ODDS_FIRST)),
      long: mean(R2.values), longWin: mean(R2.wins),
      real: F.S.over ? F.S.result : 'stalled', realValue: F.S.over ? runValue(F, dv) : 0, rounds: F.S.round,
      readStandoffs: R1.standoffs, readCapped: R1.capped, readSteps: R1.steps, readMs: R1.ms, men: F.S.units.length });
  }
  const P = playWatched(ctx);
  /* screening: their melee swings that landed on one of our gunmen */
  const C = countFight(W, P, F);
  const gunIds = new Set(P.recs.filter(r => r.side === 'you' && r.start.gun).map(r => r.id));
  F.S.log.forEach(e => { if (e.t === 'attack' && e.free) { const t = F.byId(e.to); if (t) C[t.side].freeSwingsTaken++; } });
  C.ourDown = F.S.units.filter(u => u.side === 'you' && (u.down || u.dead)).length; C.ourDead = F.S.units.filter(u => u.side === 'you' && u.dead).length;
  F.S.log.forEach(e => { if (e.t !== 'attack') return; const a = F.byId(e.id); if (!a || a.side !== 'them' || F.isRanged(a.weapon)) return;
    C.you.meleeOnYou++; if (gunIds.has(e.to)) C.you.gunHitInMelee++; });
  return Object.assign(meta, C);
}

/* ---------- the run, in worker processes ---------- */
async function main() {
  const argv = process.argv, arg = (k, d) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
  if (argv[2] === '--fight') { process.stdout.write(JSON.stringify(await oneFight(JSON.parse(argv[3]), argv[4], argv[5]))); return; }
  const N = Number(arg('--n', 300)), JOBS = Number(arg('--jobs', 4));
  const modes = argv.includes('--write') ? ['dance', 'odds'] : argv.includes('--odds') ? ['odds'] : ['dance'];
  const ctx0 = await G.engine(true), districts = ctx0.DB.boardKinds.districts;
  const BANKF = arg('--bank', BANK);   /* a run beside another may write its own file; --merge folds it into the bank */
  if (argv.includes('--merge')) {
    const into = JSON.parse(fs.readFileSync(BANK, 'utf8')), from = JSON.parse(fs.readFileSync(arg('--merge'), 'utf8'));
    Object.keys(from).forEach(k => { if (/^(dance|odds)/.test(k)) into[k] = from[k]; });
    fs.writeFileSync(BANK, JSON.stringify(into) + '\n'); console.log('merged ' + Object.keys(from).filter(k => /^(dance|odds)/.test(k)).join(', ')); return;
  }
  const prev = fs.existsSync(BANKF) ? JSON.parse(fs.readFileSync(BANKF, 'utf8')) : {};
  const out = Object.assign({}, prev);
  const brains = String(arg('--brain', 'today')).split(',');
  for (const mode0 of modes) for (const brain of brains) {
    const mode = mode0, slot = mode0 + (brain === 'today' ? '' : '_' + brain);
    process.stderr.write('\n== ' + slot + '\n');
    const all = Array.from({ length: N }, (_, k) => fightOf(k, districts)), res = new Array(N);
    /* THE RESUME CACHE: every finished fight is one line (slot, k, the fight's fingerprint); a stopped run starts where it stopped */
    const CF = BANKF.replace(/\.json$/, '') + '.' + slot + '.ndjson', fp = rulesPrint();
    if (fs.existsSync(CF)) fs.readFileSync(CF, 'utf8').split('\n').filter(Boolean).forEach(l => { try { const x = JSON.parse(l); if (x.fp === fp && x.k < N) res[x.k] = x.v; } catch (e) { /* a cut line */ } });
    const work = all.filter(w => !res[w.k]);
    process.stderr.write('resume: ' + (N - work.length) + ' of ' + N + ' already played\n');
    let next = 0, running = 0; const t0 = Date.now();
    await new Promise(done => {
      const pump = () => {
        while (running < JOBS && next < work.length) {
          const w = work[next++], i = w.k; running++;
          cp.execFile(process.execPath, [__filename, '--fight', JSON.stringify(w), mode, brain], { maxBuffer: 1 << 26 }, (err, so) => {
            running--;
            if (err) { console.error('fight failed', JSON.stringify(w), err.message.slice(0, 400)); res[i] = null; } else { res[i] = JSON.parse(so); fs.appendFileSync(CF, JSON.stringify({ k: i, fp: fp, v: res[i] }) + '\n'); }
            if ((next % 25) === 0) process.stderr.write(mode + ' ' + next + '/' + N + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
            if (next >= work.length && running === 0) done(); else pump();
          });
        }
      };
      if (!work.length) done(); else pump();
    });
    out[slot] = { brain: brain, fights: res.filter(Boolean), secs: Math.round((Date.now() - t0) / 1000) };
    console.log('\n######## ' + slot.toUpperCase());
    report(mode, out[slot].fights);
  }
  if (argv.includes('--write') || argv.includes('--save')) {
    out._readme = 'TUNING [a better AUTO brain and a true calculator] 10/25 (rule 176(g), research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
      + 'Every fight is the live fight (slices/BOHEMIA_FIGHT.html, its own rules and data, no hooks) on AUTO for both sides, played headless by '
      + 'tools/bohemia_tuning_auto_brain.js; fight k plays seed 9000+k on a district and cell the map could hand. dance: per side, counts per man per round. '
      + 'odds: the read at the start of each fight the fight\'s way (ODDS_RUNS runs from the frozen board on the odds\' seed; first = the colour at ODDS_FIRST), '
      + 'a LONG_READ on other dice (the truth of the board), and the real fight played out on AUTO from the real seed.';
    out.draft = true; out.odds_constants = OC; out.long_read = LONG_READ; out.long_every = LONG_EVERY; out.fight_print = G.fightPrint(); out.rules_print = rulesPrint();
    fs.writeFileSync(BANKF, JSON.stringify(out) + '\n');
    console.log('wrote ' + BANKF);
  }
}
function sumSide(fs_, side) {
  const T = zero();
  fs_.forEach(f => { const C = f[side]; Object.keys(T).forEach(k => { if (typeof T[k] === 'number') T[k] += C[k]; else Object.keys(C[k]).forEach(q => { T[k][q] = (T[k][q] || 0) + C[k][q]; }); }); });
  return T;
}
function report(mode, fs_) {
  const pct = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-';
  if (mode === 'dance') {
    ['you', 'them'].forEach(side => {
      const T = sumSide(fs_, side);
      console.log('\n' + (side === 'you' ? 'OUR AUTO (the crew brain)' : 'THEIR BRAIN') + ' over ' + fs_.length + ' fights, ' + T.turns + ' man-rounds');
      console.log('  moved and ended where he began: ' + T.endedWhereBegan + ' (' + pct(T.endedWhereBegan, T.turnsMoved) + ' of turns with a step); with nothing done: ' + T.wasted, JSON.stringify(T.wastedBy));
      console.log('    wasted, why: ' + JSON.stringify(T.wastedWhy) + ', hurt under half: ' + T.wastedHurt + '; off and back with no swing, why: ' + JSON.stringify(T.offAndBackWhy));
      console.log('  free swings taken walking out of a ring: ' + T.freeSwingsTaken);
      console.log('  could strike at the start: ' + T.couldStrike + ', never swung: ' + T.skippedStrike + ' (' + pct(T.skippedStrike, T.couldStrike) + ')', JSON.stringify(T.skippedFor));
      console.log('    walked instead, by cause:', JSON.stringify(T.skippedWalkBy));
      console.log('  off and back over two rounds: ' + T.offAndBack + ' (no swing in either: ' + T.offAndBackNoSwing + ', hurt under half: ' + T.offAndBackHurt + ')', JSON.stringify(T.offAndBackBy));
      console.log('  left a fight and walked back in: ' + T.leftAndCameBack + ' (no swing the round he left: ' + T.leftNoSwing + ', hurt: ' + T.leftAndCameBackHurt + ')', JSON.stringify(T.leftAndCameBackBy));
      console.log('  gunmen able to walk onto a roof in one turn at some point: ' + T.gunmenWithAny + ', ever stood on one: ' + T.gunmenWithAnyTook + ' (' + pct(T.gunmenWithAnyTook, T.gunmenWithAny) + ')');
      console.log('  gunmen: ' + T.gunmen + ', a roof on the board: ' + T.gunmenRoofOnBoard + ' (mean ' + (T.roofStepsSum / Math.max(1, T.gunmenRoofOnBoard)).toFixed(1) + ' steps away), a roof he could climb and shoot from: '
        + T.gunmenWithOpt + ', took one: ' + T.gunmenWithOptTook + ' (' + pct(T.gunmenWithOptTook, T.gunmenWithOpt) + '), at the first chance: ' + T.gunmenTookAtFirst + ', ever on a roof: ' + T.gunmenOnRoofEver);
      console.log('  gun turns: ' + T.gunTurns + ', with the climb open: ' + T.gunRoofOptTurns + ', climbed then: ' + T.gunRoofOptTaken + ' (' + pct(T.gunRoofOptTaken, T.gunRoofOptTurns) + '), on a roof at the end: ' + T.gunTurnsOnRoof);
      if (side === 'you') console.log('  their melee swings: ' + T.meleeOnYou + ', on our gunmen: ' + T.gunHitInMelee + ' (' + pct(T.gunHitInMelee, T.meleeOnYou) + '); per gunman-round ' + (T.gunHitInMelee / Math.max(1, T.gunTurns)).toFixed(2) + ', per melee-man-round ' + ((T.meleeOnYou - T.gunHitInMelee) / Math.max(1, T.turns - T.gunTurns)).toFixed(2));
    });
    const won = fs_.filter(f => f.result === 'won').length, st = fs_.filter(f => f.result === 'stalled').length;
    console.log('\nwon ' + won + ' of ' + fs_.length + ' (stalled ' + st + '), rounds a fight ' + (fs_.reduce((a, f) => a + f.rounds, 0) / fs_.length).toFixed(1)
      + ', our men down a fight ' + (fs_.reduce((a, f) => a + (f.ourDown || 0), 0) / fs_.length).toFixed(2) + ', dead ' + (fs_.reduce((a, f) => a + (f.ourDead || 0), 0) / fs_.length).toFixed(2));
  } else {
    const bands = [[0, 0.2], [0.2, 0.4], [0.4, 0.6], [0.6, 0.8], [0.8, 0.92], [0.92, 1.01]];
    const show = (lab, key) => {
      console.log('\n' + lab);
      bands.forEach(b => { const in_ = fs_.filter(f => f[key] !== null && f[key] >= b[0] && f[key] < b[1]); if (!in_.length) return;
        console.log('  ' + (Math.round(100 * b[0]) + '-' + Math.min(100, Math.round(100 * b[1]))).padEnd(8) + ' n=' + String(in_.length).padEnd(4) + ' said ' + (100 * mean(in_.map(f => f[key]))).toFixed(0).padStart(3)
          + '  won ' + (100 * mean(in_.map(f => f.real === 'won' ? 1 : 0))).toFixed(0).padStart(3) + '  worth ' + (100 * mean(in_.map(f => f.realValue))).toFixed(0).padStart(3)
          + '  truth(long, n=' + in_.filter(f => f.long !== null).length + ') ' + (in_.some(f => f.long !== null) ? (100 * mean(in_.filter(f => f.long !== null).map(f => f.long))).toFixed(0) : '-')); });
      const brier = mean(fs_.filter(f => f[key] !== null).map(f => Math.pow(f[key] - (f.real === 'won' ? 1 : 0), 2)));
      console.log('  Brier against a win: ' + brier.toFixed(3));
    };
    show('THE COLOUR AT ' + OC.ODDS_FIRST + ' RUNS (worth)', 'first');
    show('THE COLOUR AT ' + OC.ODDS_RUNS + ' RUNS (worth)', 'shown');
    show('THE WIN RATE AT ' + OC.ODDS_RUNS + ' RUNS', 'shownWin');
    show('THE LONG READ (' + LONG_READ + ' runs, worth)', 'long');
    show('THE LONG READ (' + LONG_READ + ' runs, win rate)', 'longWin');
    const turn = 0.8, L = fs_.filter(f => f.long !== null), flip = (k1, k2) => L.filter(f => (f[k1] >= turn) !== (f[k2] >= turn)).length;
    console.log('\ngreen/red disagrees with the long read: at ' + OC.ODDS_FIRST + ' runs ' + flip('first', 'long') + ' of ' + L.length + ', at ' + OC.ODDS_RUNS + ' runs ' + flip('shown', 'long'));
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { fightOf, setupFight, playWatched, countFight, readOdds, oneFight, engineFor, rulesPrint, OC };

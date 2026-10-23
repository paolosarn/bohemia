#!/usr/bin/env node
/* GHOSTS AND APPARITIONS (COMBAT [ghosts and apparitions], rule 134, Paolo 10/23: 'like in Battle Brothers, one of the enemies are
   ghosts and apparitions; I think we can put that in, it fits our world too good; maybe they're way more around for the first act
   than the third act'). Battle Brothers' Geist in our fight, from the library: enemies.json geist, records/target/bb/racial_skills.json
   (each skill its wiki page), beast_attacks.json's Ghastly Touch; in act one the Amalgamation's haunting (rule 134(e)).

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. THE GEIST IS BATTLE BROTHERS': 1 hitpoint, resolve 130, a ranged defence of 999, 9 AP, Ghastly Touch 15-25 through any armour;
      its three skills each quote their page, the page is in the library, and the numbers are the page's words;
   2. INCORPOREAL: +10 melee and ranged defence a tile from two tiles out (none beside it); a shot at it lands at the floor of the
      cap ('ranged weapons are almost useless');
   3. THE SCREAM: inside three tiles, 6 AP, four morale checks with no modifier; not from four; never at a man already fleeing; a
      Geist never checks its own nerve;
   4. THROUGH WALLS: a Geist walks through a house to the street beyond, never stands in one; a man does not;
   5. THE BRAINS: it screams at the weakest nerve in reach; with nobody in reach it drifts into reach, out of arm's length; with
      everybody in reach fleeing it touches;
   6. FRAGILE UP CLOSE: one blow that lands ends it;
   7. THE ACTS: every kind the fight can field carries a weight for each act; a party that could hold a Geist holds it three times
      as often in act one and a quarter as often in act three;
   8. THE FIGHTS END: twenty fights against four Geists, every one to its end, the company winning (rule 117);
   and on his phone, the real page:
   9. THE TAPE: every Geist on the board is drawn through the tape (its picture washed, lined and torn), its face in the strip too;
      its scream is heard (his approved tape_pull); nothing threw.
   Run: node gates/ghosts_and_apparitions_gate.js */
'use strict';
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('GHOSTS AND APPARITIONS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB, T = F._t;
const RS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/racial_skills.json'), 'utf8'));
let tar = ''; try { tar = execSync('tar -tzf ' + JSON.stringify(path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz')), { maxBuffer: 1 << 26 }).toString(); } catch (_e) {}
const page = src => { const m = String(src).split(':')[1]; if (!m || tar.indexOf(m) < 0) return ''; try { return execSync('tar -xzOf ' + JSON.stringify(path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz')) + ' ' + JSON.stringify(m), { maxBuffer: 1 << 24 }).toString().replace(/<[^>]*>|\[\[File:[^\]]*\]\]|\[\[|\]\]/g, ''); } catch (_e) { return ''; } };

const setup = (o, seed) => { ctx.setSeed(seed || 5); F.setup(Object.assign({ kind: 'ruin', deploy: false, formation: null, flat: true }, o)); return F.S; };
const S = setup({ party: { count: 4, days: 1, difficulty: 0, faction: 'ghosts' } });
const ghosts = S.units.filter(u => u.side === 'them'), g = ghosts[0], mine = S.units.filter(u => u.side === 'you');

/* 1 */
const sc = RS.rows.horrific_scream, ic = RS.rows.incorporeal, cr = RS.rows.crosses_any_ground;
const pSc = page(sc.source), pGeist = page(sc.checks_source), pIc = page(ic.source);
const pIcRaw = (() => { try { return execSync('tar -xzOf ' + JSON.stringify(path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz')) + ' ' + JSON.stringify(String(ic.source).split(':')[1])).toString(); } catch (_e) { return ''; } })();
const cells = pSc.split('\n').map(l => l.replace(/^\|\s*(align="[^"]*"\s*\|)?/, '').trim());
const words = /range of 3 tiles/.test(pSc) && sc.range_tiles === 3 && cells.indexOf(String(sc.ap)) >= 0 && cells.indexOf(String(sc.fatigue)) >= 0
  && pGeist.indexOf(sc.checks_say) >= 0 && sc.checks === 4 && sc.modifier === 0
  && /grants \+10 and \+10 for each tile range away from a Geist \(active at range 2\+\)/.test(pIc.replace(/\s+/g, ' ')) && ic.per_tile_melee_defense === 10 && ic.per_tile_ranged_defense === 10 && ic.from_range === 2
  && /Melee_defense[\s\S]*Ranged_defense/.test(pIcRaw) && /traverse steep cliffs/.test(pGeist) && cr.walls === true;
leg(ghosts.length === 4 && ghosts.every(u => u.kind === 'geist' && u.hpMax === 1 && u.resolve === 130 && u.rdef === 999 && u.apTurn === 9 && u.weapon.name === 'Ghastly Touch' && u.weapon.damage_min === 15 && u.weapon.damage_max === 25 && u.weapon.armor_ignore_pct === 100 && u.ghost) && words,
  '*** THE GEIST IS BATTLE BROTHERS\' ***: 1 hitpoint, resolve 130, ranged defence 999, 9 AP, Ghastly Touch 15-25 through armour; the scream, Incorporeal and the walls in their pages\' own words',
  'hp ' + g.hpMax + ', resolve ' + g.resolve + ', rdef ' + g.rdef + ', AP ' + g.apTurn + ', ' + g.weapon.name + ' ' + g.weapon.damage_min + '-' + g.weapon.damage_max + '; the pages: ' + (words ? 'every number is theirs' : 'a number is not the page\'s'));

/* field helpers */
function field(keep) { S.units.forEach(u => { u.fled = keep.indexOf(u) < 0; u.dead = false; u.down = false; u.morale = 'Steady'; }); S.events = []; S.over = false; }
function turn(u) { S.order = [u.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true; u.drifted = false; }
const m0 = mine.filter(u => !u.main && !F.isRanged(u.weapon) && !F.isGun(u.weapon))[0], gun = mine.filter(u => F.isGun(u.weapon) && F.isRanged(u.weapon))[0] || mine[0];

/* 2 */
field([g, m0]); m0.x = 5; m0.y = 5;
const at = d => { g.x = 5 + d; g.y = 5; return F.hitChance(m0, g).chance; };
const near = at(1), two = at(2), four = at(4);
field([g, gun]); gun.x = 5; gun.y = 5; g.x = 9; g.y = 5; gun.loaded = true;
const shotCh = F.hitChance(gun, g).chance, floor = DB.rules.hit_chance ? (DB.rules.hit_chance.cap ? DB.rules.hit_chance.cap.value.min : null) : null;
leg(two < near && (four < two || four === floor) && shotCh <= (floor || 5),
  '*** INCORPOREAL ***: the farther it is the harder to hit (none beside it), and a shot at it lands at the cap\'s floor',
  'a blow on it at 1 tile ' + near + '%, at 2 ' + two + '%, at 4 ' + four + '%; a shot from 4 tiles ' + shotCh + '% (the floor ' + floor + ')');

/* 3 */
const m1 = mine.filter(u => !u.main && u !== m0)[0];
field([g, m0, m1]); turn(g); g.x = 8; g.y = 5; m0.x = 5; m0.y = 5; m1.x = 4; m1.y = 9;
const can3 = F.canScream(g, m0), can4 = (() => { m0.x = 4; const c = F.canScream(g, m0); m0.x = 5; return c; })();
const ap0 = g.ap;
F.scream(g, m0);
const spent = ap0 - g.ap, ev = S.events.filter(e => e.t === 'skill' && e.skill === 'horrific_scream');
field([g, m0]); turn(g); g.x = 8; g.y = 5; m0.x = 5; m0.y = 5; m0.morale = 'Fleeing';
const atFleeing = F.screamTarget(g);
field([g, m0]); m0.x = 5; m0.y = 5; turn(g); const gMorale = g.morale; for (let i = 0; i < 40; i++) T.check ? T.check(g, 'neg', -999) : null;
leg(can3 && !can4 && spent === 6 && ev.length === 1 && !atFleeing && g.morale === gMorale,
  '*** THE SCREAM ***: inside three tiles for 6 AP, not from four, never at a man already fleeing; a Geist never wavers',
  'from 3 tiles ' + can3 + ', from 4 ' + can4 + '; it cost ' + spent + ' AP; at a fleeing man: ' + (atFleeing ? atFleeing.name : 'no one') + '; the Geist after forty bad checks: ' + g.morale);
/* the four checks with no modifier: a man of resolve 0 against four checks loses four steps or flees (each failed check is a step) */
{ field([g, m0]); turn(g); g.x = 8; g.y = 5; m0.x = 5; m0.y = 5; const keepR = m0.resolve; m0.resolve = -999; m0.morale = 'Confident';
  F.scream(g, m0); const moves = S.events.filter(e => e.t === 'morale' && e.id === m0.id).map(e => e.to); m0.resolve = keepR;
  leg(moves.length === 4 || moves[moves.length - 1] === 'Fleeing', '*** FOUR CHECKS ***: a man with no nerve takes four steps down the morale ladder from one scream, or runs', moves.join(' -> ')); }

/* 4: through a wall (a real board, a house between) */
{ let spot = null, S2 = null;
  for (let tr = 0; tr < 40 && !spot; tr++) { ctx.setSeed(11 + tr); F.setup({ kind: ['suburb', 'strip', 'ruin', 'culdesac'][tr % 4], deploy: false, formation: null, party: { count: 1, days: 1, difficulty: 0, faction: 'ghosts' } }); S2 = F.S;
  for (let y = 1; y < S2.h - 1 && !spot; y++) for (let x = 1; x < S2.w - 3 && !spot; x++)
    if (T.passable(x, y) && !T.passable(x + 1, y - 1) && !T.passable(x + 1, y) && !T.passable(x + 1, y + 1) && T.passable(x + 2, y)) spot = { x, y }; }
  const gg = S2.units.filter(u => u.side === 'them')[0], man = S2.units.filter(u => u.side === 'you')[0];
  S2.units.forEach(u => { if (u !== gg && u !== man) u.fled = true; });
  gg.x = spot.x; gg.y = spot.y; man.x = 0; man.y = 0;
  const two = T.stepCost(gg, spot.x, spot.y, spot.x + 1, spot.y) + T.stepCost(gg, spot.x + 1, spot.y, spot.x + 2, spot.y);
  const thru = F.reach(gg, two, false).best, key = (spot.y) * S2.w + spot.x + 2, wallKey = spot.y * S2.w + spot.x + 1;
  const man2 = S2.units.filter(u => u.side === 'you')[1]; man2.fled = false; man2.x = spot.x; man2.y = spot.y; gg.x = 0; gg.y = S2.h - 1;
  const manReach = F.reach(man2, two, false).best;
  const viaWall = thru[key] !== undefined && thru[wallKey] === undefined;
  /* a man can only get there round the house, never in one step through it */
  leg(viaWall && manReach[wallKey] === undefined && manReach[key] === undefined,
    '*** THROUGH WALLS ***: a Geist walks through a house to the street beyond and never stands in it; a man must go round',
    'a house three tiles tall: for the AP of two steps the Geist is on the far side (' + thru[key] + ' AP), stands in the wall: ' + (thru[wallKey] !== undefined) + '; the man for the same AP: ' + (manReach[key] === undefined ? 'cannot get there' : manReach[key] + ' AP'));
}

/* 5 */
{ setup({ party: { count: 1, days: 1, difficulty: 0, faction: 'ghosts' } });
  const S3 = F.S, gg = S3.units.filter(u => u.side === 'them')[0], ms = S3.units.filter(u => u.side === 'you' && !u.main);
  const keep = [gg, ms[0], ms[1]];
  S3.units.forEach(u => { u.fled = keep.indexOf(u) < 0; u.morale = 'Steady'; });
  ms[0].x = 5; ms[0].y = 5; ms[0].resolve = 60; ms[1].x = 5; ms[1].y = 7; ms[1].resolve = 30;
  gg.x = 8; gg.y = 6; S3.order = [gg.id]; S3.idx = 0; gg.ap = gg.apTurn; gg.begun = true; gg.drifted = false; S3.events = [];
  F.aiStep(gg); const a1 = S3.events.filter(e => e.t === 'skill')[0];
  gg.x = 10; gg.y = 6; S3.order = [gg.id]; S3.idx = 0; gg.ap = gg.apTurn; gg.drifted = false; S3.events = [];
  F.aiStep(gg); const moved = S3.events.filter(e => e.t === 'step').length, dNow = (Math.min.apply(null, [ms[0], ms[1]].map(m => Math.max(Math.abs(m.x - gg.x), Math.abs(m.y - gg.y)))));
  ms.forEach(m => { m.morale = 'Fleeing'; }); gg.x = 6; gg.y = 6; S3.order = [gg.id]; S3.idx = 0; gg.ap = gg.apTurn; gg.drifted = false; S3.events = [];
  F.aiStep(gg); const touch = S3.events.filter(e => e.t === 'attack')[0];
  leg(!!a1 && a1.skill === 'horrific_scream' && a1.to === ms[1].id && moved > 0 && dNow >= 2 && dNow <= 3 && !!touch,
    '*** THE BRAINS ***: it screams at the weakest nerve in reach; out of reach it drifts in, out of arm\'s length; with everyone in reach fleeing it touches',
    'screamed at ' + (a1 ? (a1.to === ms[1].id ? 'the weaker man' : 'the stronger man') : 'nobody') + '; from far it moved ' + moved + ' steps to ' + dNow + ' tiles; with both fleeing: ' + (touch ? 'a touch' : 'no touch'));
}

/* 6 */
{ setup({ party: { count: 1, days: 1, difficulty: 0, faction: 'ghosts' } }); const S4 = F.S, gg = S4.units.filter(u => u.side === 'them')[0], m = S4.units.filter(u => u.side === 'you' && !u.main && !F.isRanged(u.weapon))[0] || S4.units.filter(u => u.side === 'you')[1];
  S4.units.forEach(u => { u.fled = [gg, m].indexOf(u) < 0; }); m.x = 5; m.y = 5; gg.x = 6; gg.y = 5; S4.order = [m.id, gg.id]; S4.idx = 0; m.ap = m.apTurn; m.fat = 0; m.begun = true; S4.events = [];
  F.strike(m, gg, { roll: 1, head: false });
  leg(gg.dead || !F.onField(gg), '*** FRAGILE UP CLOSE ***: one blow that lands ends it', gg.dead ? 'dead to one blow' : 'still standing at ' + gg.hp); }

/* 7 */
{ const AW = DB.ours.act_weights.value, mix = DB.ours.enemy_tiers.value.mix, kinds = new Set();
  Object.keys(mix).forEach(f => Object.keys(mix[f]).forEach(ph => Object.keys(mix[f][ph]).forEach(k => kinds.add(k))));
  const missing = [...kinds].filter(k => !AW.by_kind[k] || AW.by_kind[k].length !== AW.acts);
  mix.__gate = { first: { geist: 1, brigand_thug: 1 }, early: { geist: 1, brigand_thug: 1 }, middle: { geist: 1, brigand_thug: 1 }, late: { geist: 1, brigand_thug: 1 } };
  const share = act => { let gh = 0, n = 0; for (let s = 1; s <= 60; s++) { ctx.setSeed(s); F.setup({ kind: 'ruin', deploy: false, formation: null, flat: true, act, party: { count: 6, days: 1, difficulty: 0, faction: '__gate' } }); F.S.units.filter(u => u.side === 'them').forEach(u => { n++; if (u.kind === 'geist') gh++; }); } return gh / n; };
  const a1 = share(1), a3 = share(3); delete mix.__gate;
  leg(missing.length === 0 && AW.by_kind.geist[0] > AW.by_kind.geist[2] && a1 > 0.65 && a3 < 0.3,
    '*** THE ACTS ***: every kind the fight fields has a weight for each act; Geists three times as often in act one, a quarter in act three',
    kinds.size + ' kinds, missing ' + (missing.join(',') || 'none') + '; a party that may hold a Geist: ' + Math.round(a1 * 100) + '% Geists in act one, ' + Math.round(a3 * 100) + '% in act three'); }

/* 8 */
{ const r = { won: 0, lost: 0, stuck: 0, screams: 0, broke: 0 };
  for (let s = 1; s <= 20; s++) { ctx.setSeed(s * 31); F.setup({ kind: 'ruin', deploy: false, formation: null, auto: true, party: { count: 4, days: 1, difficulty: 0, faction: 'ghosts' } });
    let n = 0; while (!F.S.over && n < 4000) { const u = F.current(); if (!u) break; F.aiStep(u); F.S.events.forEach(e => { if (e.t === 'skill' && e.skill === 'horrific_scream') r.screams++; if (e.t === 'morale' && e.to === 'Fleeing') r.broke++; }); F.S.events = []; n++; }
    if (!F.S.over) r.stuck++; else if (F.S.result === 'won') r.won++; else r.lost++; }
  leg(r.stuck === 0 && r.won >= 15 && r.screams > 0, '*** THE FIGHTS END ***: twenty fights against four Geists end, the company wins (rule 117), the screams land', JSON.stringify(r)); }

/* 9: the phone */
(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:7,speed:4,auto:true,kind:"ruin",deploy:false,formation:null,party:{count:4,days:1,difficulty:0,faction:"ghosts"}}' });
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
    await p.waitForTimeout(600);
    const look = await p.evaluate(() => ({ ghosts: FIGHT.S.units.filter(v => v.ghost).length, taped: FIGHT.S.units.filter(v => v.ghost && v._gout).length, drawn: FIGHT_UI.ghostDrawn || 0 }));
    let heard = false;
    for (let i = 0; i < 120 && !heard; i++) { await p.waitForTimeout(250); heard = await p.evaluate(() => (FIGHT_UI.heard || []).indexOf('tape_pull') >= 0 || FIGHT.S.over); }
    const h = await p.evaluate(() => ({ tape: (FIGHT_UI.heard || []).indexOf('tape_pull') >= 0, screams: FIGHT.S.log ? FIGHT.S.log.filter(e => e.t === 'skill' && e.skill === 'horrific_scream').length : null }));
    leg(look.ghosts === 4 && look.taped === 4 && look.drawn > 0 && h.tape,
      '*** THE TAPE ***: every Geist on the board drawn through the tape, and its scream heard as his approved tape_pull',
      look.taped + ' of ' + look.ghosts + ' Geists taped, ' + look.drawn + ' draws; the scream heard: ' + h.tape);
    leg(d.errs.length === 0, 'nothing threw', d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 160) : ''));
  } catch (e) { leg(false, 'the phone legs ran', String(e.message).slice(0, 200)); }
  await d.close();
  done();
})();

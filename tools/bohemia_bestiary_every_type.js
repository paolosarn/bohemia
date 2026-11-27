#!/usr/bin/env node
/* EVERY TYPE THROUGH A FIGHT, ON THE LIVE RULES (BESTIARY 2, 11/26, VAMILY rule 480(b): 'improve on what we already have', the
   round BESTIARY wrote: 'put each of the enemy types already built through a fight: its look reads, its moves work, its drops
   land, no bug'). The headless half of the sweep; the page half is gates/the_bestiary_every_type_fight.js.
   EVERY KIND THE BANDS DEAL (records/target/bb/bohemia_enemies.json mix and heads, ours.json enemy_tiers mix and heads: the wiki's
   rows COMBAT and FACTIONS fielded as well as BESTIARY's), on the fight's own rules (tools/bohemia_fight_headless.js):
     LOOK    fielded, its picture is its own (a man: his look on the fight's rig, the file on disk; a beast: its own entry in
             beast_rig_looks, never the dire wolf the drawing falls back to), named, armed (a man: a weapon the bag knows, so the
             end screen can hand it over; a beast: its bite)
     MOVES   six fights of its own faction's band at the first phase that deals it, AUTO on both sides against a crew of six, and
             three of it alone against the six: every act of his counted (blows near and far, every skill by name); its brain's
             own skill (bohemia_enemies.json brains) seen; no fight throws, every fight ends
     DROPS   a man: the fight's own spoilsOf() (the page's function, read out of the page) through the spoils screen's own
             engine/bohemia_spoils.js found() on records/target/bb/loot.json, ten rolls: what of his can drop. A beast carries
             nothing to the end screen (loot.json drop.nothing_from): its drop is the kill on the map, the page half's
   Prints one line: RESULT {...}. ONLY=<ids> runs some. */
'use strict';
const path = require('path'), fs = require('fs'), vm = require('vm');
const ROOT = path.dirname(__dirname);
const { engine, FIGHT_FILE } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const SP = require(path.join(ROOT, 'engine/bohemia_spoils.js'));
const NE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/bohemia_enemies.json'), 'utf8'));
const LOOT = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/loot.json'), 'utf8'));
try { LOOT.tape_income = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/tape_income.json'), 'utf8')); } catch (e) {}
const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB;
/* the page's own spoilsOf() and isGunW(), read out of the page and run here (theirFaction and THEY_ARE are the page's drawing half) */
const html = fs.readFileSync(FIGHT_FILE, 'utf8');
const grabFn = (name) => { const i = html.indexOf('function ' + name + '('); if (i < 0) throw new Error('THE PAGE MOVED: no ' + name); const j = html.indexOf('\n}\n', i); return html.slice(i, j + 2); };
vm.runInContext('var __FAC = null; function theirFaction() { return __FAC; } var THEY_ARE = {}; function recapOf() { return null; }\n' + grabFn('spoilsOf') + '\n' + grabFn('isGunW') + '\nthis.spoilsOf = spoilsOf;', ctx);
const setup = (o, seed) => { ctx.setSeed(seed || 5); F.setup(Object.assign({ kind: 'ruin', deploy: false, formation: null, flat: true }, o)); return F.S; };
const crew = n => { const c = []; for (let i = 0; i < n; i++) c.push({ background: 'farmhand', level: 1 }); return c; };
setup({ party: [{ kind: 'watch_neighbor', count: 1 }] });   /* the fold runs once: the tiers below are the folded ones */
const T = DB.ours.enemy_tiers.value, phases = T.phases;
const FIGHTS = +(process.env.FIGHTS || 6), ALONE = +(process.env.ALONE || 3), ROLLS = +(process.env.ROLLS || 10);
/* PLANT (the gate's, gates/every_type_through_a_fight_gate.js): each must turn its kind's line red */
const PLANT = process.env.PLANT || '';
if (PLANT === 'no_beast_picture') delete DB.ours.beast_rig_looks.value.coyote;   /* the coyote drawn as the dire wolf the drawing falls back to */
if (PLANT === 'man_off_rig') DB.rig.looks = Object.assign({}, DB.rig.looks, { enemy_watch_neighbor_4: undefined, enemy_watch_neighbor_5: undefined });   /* the bowman's sheets gone from the rig */
if (PLANT === 'move_gone') { const b = rowOfBrain('watch_siren'); if (b) delete b.sirens; }   /* the siren's brain without its siren */
if (PLANT === 'bag_forgets') DB.weapons.rows = DB.weapons.rows.filter(w => w.id !== 'short_bow');   /* the bowman's bow unknown to the bag */
function rowOfBrain(id) { const r = NE.rows.filter(x => x.id === id)[0]; const a = r && DB.ai.archetypes[r.brain]; return a && (a.value || a); }
/* every kind a band deals, with the faction and the first phase that deals it */
const KINDS = {};
Object.keys(T.mix).forEach(f => phases.forEach(ph => Object.keys(T.mix[f][ph.name] || {}).forEach(k => { if (T.mix[f][ph.name][k] > 0 && !KINDS[k]) KINDS[k] = { faction: f, phase: ph.name, from: ph.from_day }; })));
Object.keys(T.heads || {}).forEach(f => { const k = T.heads[f]; if (!KINDS[k]) KINDS[k] = { faction: f, phase: phases[0].name, from: phases[0].from_day, head: true }; });
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const rowOf = id => NE.rows.filter(r => r.id === id)[0] || null;
const BRAIN_SKILLS = { ripostes: ['on_guard', 'riposte'], turns: ['turn', 'turned'], calls: ['call', 'call_lands'], smokes: ['smoke_pot'], firebombs: ['fire_pot'], darts: ['dart'], binds: ['bond', 'bond_hurt'], doors: ['back_door'], sirens: ['siren'], acid: ['acid'], tramples: ['trample'], flings: ['flings'], screams: ['horrific_scream'], martyrs: ['martyr'], drones: ['drone_launch'] };   /* BESTIARY 3 11/27: the drone operator (rule 490) */
const out = { kinds: {}, n: 0, of: Object.keys(KINDS).length };
function play(o, seed, kind, tally) {
  ctx.setSeed(seed); F.setup(Object.assign({ auto: true, formation: null, deploy: false, company: crew(6) }, o));
  let g = 0;
  while (!F.S.over && g < 200000) {
    const c = F.current(); if (!c) break; F.aiStep(c);
    (F.S.events || []).forEach(e => {
      const a = F.byId(e.id), by = e.by && F.byId(e.by);
      if (e.t === 'attack') { const t = F.byId(e.to); if (a && a.kind === kind && t) { if (Math.max(Math.abs(a.x - t.x), Math.abs(a.y - t.y)) > 1) tally.far++; else tally.near++; } }
      else if (e.t === 'skill') { const who = (e.skill === 'turned' || e.skill === 'acid_tick') ? by : a; if (who && who.kind === kind && !(e.skill === 'turn' && e.held) && !(e.skill === 'dart' && !e.hit)) tally.skills[e.skill] = (tally.skills[e.skill] || 0) + 1; }
    });
    F.S.events = []; g++;
  }
  return { over: !!F.S.over, result: F.S.result || null, steps: g };
}
for (const id of Object.keys(KINDS)) {
  if (ONLY && ONLY.indexOf(id) < 0) continue;
  const K = KINDS[id], r = rowOf(id), o = { faction: K.faction, phase: K.phase, by: r ? (r.added_by || 'bohemia_enemies') : 'the wiki (COMBAT)', bugs: [] };
  try {
    /* LOOK */
    const us = setup({ party: [{ kind: id, count: 2 }] }).units.filter(v => v.side === 'them' && v.kind === id);
    if (!us.length) { o.bugs.push('not fielded'); out.kinds[id] = o; continue; }
    const u = us[0]; o.name = u.name; o.beast = !!u.beast; o.machine = !!u.machine;
    if (u.beast) {
      const key = DB.ours.beast_rig_looks && DB.ours.beast_rig_looks.value[id], L = key && DB.rig.looks[key];
      o.look = key || null; o.own = !!L; o.file = L ? L.file : null;
      if (!L) o.bugs.push('no picture of its own: the fight draws it as the dire wolf');
    } else {
      const L = DB.rig.looks[u.look]; o.look = u.look; o.own = !!L; o.file = L ? L.file : null;
      if (!L) o.bugs.push('his look ' + u.look + ' is not on the fight rig');
      o.looks = Array.from(new Set(setup({ party: [{ kind: id, count: 8 }] }, 9).units.filter(v => v.side === 'them' && v.kind === id).map(v => v.look)));
    }
    if (o.file && !fs.existsSync(path.join(ROOT, 'slices/fight_rig', o.file))) o.bugs.push('the picture file is missing: ' + o.file);
    if (!o.name) o.bugs.push('no name');
    o.weapon = u.weapon ? u.weapon.name : null; o.weaponId = u.weapon ? u.weapon.id : null;
    if (!u.weapon) o.bugs.push('unarmed');
    else if (!u.beast && !u.weapon.fists && !DB.weapons.rows.some(w => w.id === u.weapon.id) && !(u.weapon.natural)) o.weaponKnown = false;
    /* MOVES */
    const bv = r && NE.brains[r.brain] ? NE.brains[r.brain].value || {} : {};
    o.own_move = Object.keys(BRAIN_SKILLS).filter(k => bv[k]).reduce((a, k) => a.concat(BRAIN_SKILLS[k]), []);
    const tally = { near: 0, far: 0, skills: {} }, fights = [];
    for (let s = 1; s <= FIGHTS; s++) fights.push(play({ kind: ['ruin', 'suburb', 'strip'][s % 3], party: { faction: K.faction, count: 6, days: K.from + 1, difficulty: 0 } }, s, id, tally));
    const alone = u.beast && /mammoth|bison|longhorn|bear|sloth|bull|camelops|shrub|sabre|lion|jaguar|cheetah/.test(id) ? 1 : 3;
    for (let s = 11; s < 11 + ALONE; s++) fights.push(play({ kind: ['ruin', 'suburb', 'strip'][s % 3], party: [{ kind: id, count: alone }] }, s, id, tally));
    o.acts = tally; o.fights = fights.length; o.ended = fights.filter(f => f.over).length; o.won_by_six = fights.filter(f => f.result === 'won').length;
    if (o.ended < fights.length) o.bugs.push((fights.length - o.ended) + ' of ' + fights.length + ' fights never ended');
    if (!(tally.near + tally.far) && !Object.keys(tally.skills).length) o.bugs.push('never acted in ' + fights.length + ' fights');
    const missing = o.own_move.filter((sk, i) => i === 0 && !tally.skills[sk]);
    if (missing.length) o.bugs.push('his own move never seen: ' + missing.join(', '));
    /* DROPS (a man): the page's spoilsOf through the spoils screen's found(), ten fights' worth */
    if (!u.beast) {
      const items = {}; let rolls = 0;
      for (let s = 1; s <= ROLLS; s++) {
        const S = setup({ party: [{ kind: id, count: 2 }] }, 20 + s); S.units.forEach(v => { if (v.side === 'them') { v.dead = true; v.hp = 0; } });
        ctx.__FAC = K.faction; vm.runInContext('__FAC = ' + JSON.stringify(K.faction), ctx);
        const sp = ctx.spoilsOf(); let seed = 77 + s; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
        const fo = SP.found(sp, LOOT, rnd); rolls++;
        fo.items.forEach(it => { items[it.kind + ':' + it.id] = (items[it.kind + ':' + it.id] || 0) + 1; });
        if (s === 1) o.body = sp.bodies.filter(b => b.kind === id)[0];
      }
      o.drops = items; o.dropRolls = rolls;
      const b = o.body || {};
      if (!b.weapon && u.weapon && !u.weapon.fists && !u.ghost) o.bugs.push('his weapon (' + u.weapon.name + ') never reaches the end screen: the bag does not know ' + u.weapon.id);
      /* a man who leaves nothing: the cause named (a thrown weapon or a sling is read as spent or wrecked by the spoils' rules) */
      if (!Object.keys(items).length && !u.machine && !u.ghost) { const w = b.weapon || {}; o.noDrop = w.cls === 'throwing' ? (w.durability == null ? 'thrown, no wear: wrecked' : 'thrown, no count: spent') : 'other';
        o.bugs.push('drops nothing in ' + ROLLS + ' fights (' + o.noDrop + ')'); }
    }
  } catch (e) { o.bugs.push('THREW: ' + String(e && e.stack || e).slice(0, 300)); }
  out.kinds[id] = o; out.n++;
}
out.bugs = Object.keys(out.kinds).filter(k => out.kinds[k].bugs.length).map(k => k + ': ' + out.kinds[k].bugs.join('; '));
console.log('RESULT ' + JSON.stringify(out));

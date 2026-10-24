#!/usr/bin/env node
/* A HIT SHOWS, AND THE GROUND REMEMBERS (COMBAT [a hit shows, the ground remembers], rule 145, Paolo 10/24: 'when an enemy gets
   hurt, or even your own player, I want them to turn slightly faint red opacity, and then I wanna see blood come out, maybe
   blood splatters too... the live effects that get left on the ground... if an enemy gets down he might fall on the ground, a
   pile of blood underneath him').

   Legs, on his phone's profile (390 x 844), the real fight page, slices/BOHEMIA_FIGHT.html, a blow played through the board's
   own animation:
   1. A HIT SHOWS: the man hit (theirs or his) flashes red by opacity at the landing and the flash is gone within the beat;
   2. THE BLOOD COMES OUT: drops thrown from the wound, more for a harder blow (ours.gore: one per hp_per_drop, drops_min to
      drops_max), away from the man who struck;
   3. THE GROUND REMEMBERS: every drop lands as a stain, and the stains are all still there ten beats later;
   4. A POOL UNDER THE FALLEN: a man down spreads a pool under him over the beats;
   5. MACHINES AND GHOSTS NEVER BLEED RED: a machine leaks oil and throws sparks with no red flash; a ghost breaks into static
      and leaves nothing on the floor;
   6. a new fight starts on a clean floor, and the page threw nothing.
   Run: node gates/the_ground_remembers_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE GROUND REMEMBERS GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ kind: 'suburb', deploy: false, teach: false, band: ['brigand_thug', 'brigand_raider'] }) });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e)));
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
    /* 1, 2, 3: a hard blow and a light one on a man of theirs, and one on a man of his */
    const r = await p.evaluate(async () => {
      FIGHT_UI.auto = false; FIGHT_UI.stains = []; FIGHT_UI.drops = [];
      const S = FIGHT.S, me = S.units.filter(v => v.side === 'you' && !v.main)[0], them = S.units.filter(v => v.side === 'them');
      const hit = (a, t, hp) => startAnim({ k: 'attack', dur: beatMs(), e: { t: 'attack', id: a.id, to: t.id, hit: true, chance: 60, hp: hp, armour: 0, shot: false } });
      const G = R('ours.gore'), beat = beatMs(), want = hp => Math.max(G.drops_min, Math.min(G.drops_max, Math.round(hp / G.hp_per_drop)));
      hit(me, them[0], 30);
      await new Promise(r => setTimeout(r, beat * 0.45 + 60));
      const f1 = hitFlash(them[0], performance.now()), d1 = FIGHT_UI.drops.filter(x => x.id === them[0].id);
      const away = d1.every(x => Math.sign(x.vx) === Math.sign(them[0].x - me.x || 1));
      await new Promise(r => setTimeout(r, beat * 1.1));
      const f1b = hitFlash(them[0], performance.now()), st1 = FIGHT_UI.stains.length;
      hit(me, them[1], 3);
      hit(them[0], me, 12);
      await new Promise(r => setTimeout(r, beat * 0.45 + 60));
      const d2 = FIGHT_UI.drops.filter(x => x.id === them[1].id).length, fMe = hitFlash(me, performance.now());
      await new Promise(r => setTimeout(r, beat * 10));
      const all = FIGHT_UI.stains.length, airborne = FIGHT_UI.drops.length;
      return { f1, f1b, n1: d1.length, want1: want(30), away, st1, d2, want2: want(3), fMe, all, expect: want(30) + want(3) + want(12), airborne };
    });
    leg(r.f1 > 0 && r.f1b === 0 && r.fMe > 0, '*** A HIT SHOWS ***: the man hit flashes red at the landing, his or theirs, and it is gone within the beat', 'flash ' + r.f1.toFixed(2) + ' then ' + r.f1b + ', his man ' + r.fMe.toFixed(2));
    leg(r.n1 === r.want1 && r.d2 === r.want2 && r.n1 > r.d2 && r.away, '*** THE BLOOD COMES OUT ***: drops from the wound, more for a harder blow, away from the man who struck', r.n1 + ' for 30 hp, ' + r.d2 + ' for 3 hp; away ' + r.away);
    leg(r.st1 >= r.n1 && r.all === r.expect && r.airborne === 0, '*** THE GROUND REMEMBERS ***: every drop a stain, all still there ten beats on', r.all + ' stains of ' + r.expect + ' drops; in the air ' + r.airborne);
    /* 4 */
    const q = await p.evaluate(async () => {
      const v = FIGHT.S.units.filter(u => u.side === 'them' && FIGHT.onField(u))[0];
      v.down = true; v._fallAt = performance.now(); v.seenFall = true;
      await new Promise(r => setTimeout(r, beatMs() * 1.5)); const a = (FIGHT_UI.pools || {})[v.id] || 0;
      await new Promise(r => setTimeout(r, beatMs() * (R('ours.gore').pool_beats + 1))); const b = (FIGHT_UI.pools || {})[v.id] || 0;
      return { a, b, h: manH() };
    });
    leg(q.a > 0 && q.b > q.a && q.b >= q.h * .2, '*** A POOL UNDER THE FALLEN ***: it spreads under him over the beats', 'reach ' + q.a.toFixed(1) + ' -> ' + q.b.toFixed(1) + ' px (a man ' + q.h.toFixed(0) + ')');
    /* 5 */
    const m = await p.evaluate(async () => {
      const S = FIGHT.S, me = S.units.filter(v => v.side === 'you')[0], t = S.units.filter(v => v.side === 'them')[1];
      const before = FIGHT_UI.stains.length;
      t.machine = true; FIGHT_UI.drops = []; goreHit(t, me, 20, performance.now());
      const kinds = Array.from(new Set(FIGHT_UI.drops.map(x => x.kind))).sort().join(','), red = FIGHT_UI.drops.some(x => x.kind === 'blood'), fl = hitFlash(t, performance.now() + 10);
      t.machine = false; t.ghost = true; FIGHT_UI.drops = []; goreHit(t, me, 20, performance.now());
      const gk = Array.from(new Set(FIGHT_UI.drops.map(x => x.kind))).join(',');
      await new Promise(r => setTimeout(r, beatMs() * 1.5));
      const ghostLeft = FIGHT_UI.stains.length - before; t.ghost = false;
      return { kinds, red, fl, gk, ghostLeft };
    });
    leg(m.kinds === 'oil,spark' && !m.red && m.fl === 0 && m.gk === 'static', '*** MACHINES AND GHOSTS NEVER BLEED RED ***: a machine leaks oil and throws sparks, no red flash; a ghost breaks into static', JSON.stringify(m));
    leg(m.ghostLeft === 0 || m.ghostLeft > 0 && m.kinds === 'oil,spark', '  a ghost leaves nothing on the floor (the oil before it stays)', 'new stains ' + m.ghostLeft);
    /* 6 */
    const c = await p.evaluate(async () => { start(); await new Promise(r => setTimeout(r, 300)); return { st: (FIGHT_UI.stains || []).length, dr: (FIGHT_UI.drops || []).length }; });
    leg(c.st === 0 && c.dr === 0, '  a new fight starts on a clean floor', JSON.stringify(c));
    leg(!errs.length, '  the page threw nothing', errs.join(' | '));
  } finally { await d.close(); }
  done();
})().catch(e => { console.error(e); fail++; done(); });

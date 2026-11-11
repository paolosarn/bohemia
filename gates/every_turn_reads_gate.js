#!/usr/bin/env node
/* EVERY TURN READS (COMBAT THREE 11/11/26, ask row 555, FOUND BY EYES 11/10; rules 435(d), 441(a): 'THE BOSS FIGHT'S QUIET TURNS SAY
   NOTHING: THE POT at 4x, 8 of 24 turns of his quiet (YOU, DESI, the pistol) with no idle in the fight's log').
   MEASURED BEFORE (main a87a1a3f): on AUTO every quiet turn of his already said its word (THE POT's fight on the alpha at 4x, three
   fights: 7 of 7; headless, pistol crews with and without the boss, 432 turns: 5 of 5). The silent ones were the turns HE CLOSED
   HIMSELF: the word's one switch was AUTO (S.byHand), so END TURN with nothing done, or a reload and then END TURN, passed with the
   strip jumping over the man and nothing on the glass. EYES plays by hand; so does he.
   THE LAW NOW: a turn of his that closes with no walk and no blow says what it was, whoever closed it. By hand the word is what he
   did (RELOADS, SWAPS, else HOLDS), marked hand: the page holds it a sixteenth, never AUTO's three quarters of a beat, and never a
   reason only AUTO's brain has (winded, pinned, no shot).
   THE LEGS (the live fight's own rules, headless):
     R1  BY HAND, NOTHING DONE: END TURN on a fresh turn leaves an 'idle' event for him, why 'holds', marked hand
     R2  BY HAND, A RELOAD: an empty gun reloaded and the turn closed: 'idle', why 'reload', marked hand
     R3  BY HAND, A WALK OR A BLOW: a turn he walked or struck in says no 'idle' (it was seen on its own)
     R4  ON AUTO, AS BEFORE: every quiet turn of his says its word with the brain's own reason, never marked hand; a whole fight of
         his turns: none passes with nothing (no walk, no blow, no word)
     R5  BY HAND, A WHOLE FIGHT: his men's turns closed by hand each round (a reload first when the gun is empty), theirs on AUTO:
         every such turn of his leaves its word
     planted: the hand's word taken out again (the old switch): R5's turns are caught silent
     R6  A MARKER LEFT BEHIND (ask row 605, FOUND BY EYES 11/11): a turn whose marker is still his last turn's (a step of his after
         it) and that closes with nothing done says its word all the same; read the old way the marker calls it a walk
   Run: node gates/every_turn_reads_gate.js      (about ten seconds) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js']) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx); } catch (e) {} }
const F = ctx.FIGHT;
const guns = ['snub_revolver', 'zip_gun', 'handgonne'];
const deal = (i, extra) => { ctx.setSeed(5550 + i);
  F.setup(Object.assign({ kind: 'strip', district: 'strip', cell: { gx: (i * 37 + 11) % 90, gy: (i * 53 + 7) % 90 }, night: false, auto: true, formation: null, deploy: false, cap: 12,
    company: [{ background: 'militia', level: 2, gear: { main: guns[i % 3], off: null } }, { background: 'militia', level: 2, gear: { main: 'shortsword', off: null } }, { background: 'militia', level: 2, gear: { main: guns[(i + 1) % 3], off: null } }] }, extra || {}));
  F.S.deploy = false; return F.S; };
const mine = e => e.t === 'idle';
/* run theirs on AUTO until a man of his is up */
const toHis = (S, want) => { let g = 0; while (!S.over && g < 4000) { const u = F.current(); if (!u) return null; if (u.side === 'you' && (!want || want(u))) return u; S.byHand = false; let k = 0; while (!S.over && F.current() === u && k < 60) { F.aiStep(u); k++; } g++; } return null; };
(async () => {
  const t0 = Date.now();
  /* R1 */
  { const S = deal(0), u = toHis(S), n0 = S.log.length; S.byHand = true; F.endTurn(u); S.byHand = false;
    const ev = S.log.slice(n0).filter(e => e.id === u.id), id = ev.filter(mine)[0];
    check(!!id && id.why === 'holds' && id.hand === true && ev.some(e => e.t === 'end'), 'R1', 'BY HAND, NOTHING DONE: ' + u.name + '\'s turn closed by hand left [' + ev.map(e => e.t).join('/') + ']' + (id ? ', why ' + id.why + ', hand ' + id.hand : ', NO WORD')); }
  /* R2 */
  { let got = null, tries = 0;
    for (let i = 0; i < 12 && !got; i++) { const S = deal(i), u = toHis(S, v => !!F.reloadSkill(v.weapon)); if (!u) continue; tries++;
      if (u.weapon.mag) u.ammo = 0; else u.loaded = false;
      if (!F.canReload(u)) continue; const n0 = S.log.length; S.byHand = true; const ok = F.reload(u); if (F.current() === u) F.endTurn(u); S.byHand = false;
      const ev = S.log.slice(n0).filter(e => e.id === u.id); got = { ok, ev: ev.map(e => e.t), id: ev.filter(mine)[0] || null, name: u.name, w: u.weapon.name }; }
    check(!!got && got.ok && !!got.id && got.id.why === 'reload' && got.id.hand === true, 'R2', 'BY HAND, A RELOAD: ' + (got ? got.name + ' (' + got.w + ') reloaded and the turn closed by hand left [' + got.ev.join('/') + ']' + (got.id ? ', why ' + got.id.why + ', hand ' + got.id.hand : ', NO WORD') : 'no man with a gun to reload in ' + tries + ' deals')); }
  /* R3 */
  { let seen = 0, said = 0;
    for (let i = 0; i < 6; i++) { const S = deal(i), u = toHis(S); if (!u) continue; const f = F.reach(u); let to = null;
      for (let y = 0; y < S.h && !to; y++) for (let x = 0; x < S.w && !to; x++) { const c = f.best[f.key(x, y)]; if (c > 0 && c <= u.ap && !S.units.some(v => F.onField(v) && v.x === x && v.y === y)) to = { x, y }; }
      if (!to) continue; const n0 = S.log.length; S.byHand = true; const ok = F.moveTo(u, to.x, to.y);
      if (F.current() === u) F.endTurn(u); S.byHand = false; if (!(u.x === to.x && u.y === to.y) && !S.log.slice(n0).some(e => e.id === u.id && /^(step|move)$/.test(e.t))) continue;
      seen++; if (S.log.slice(n0).some(e => e.id === u.id && mine(e))) said++; }
    check(seen >= 3 && said === 0, 'R3', 'BY HAND, A WALK: ' + seen + ' turns he walked in and closed by hand; ' + said + ' of them said a quiet turn\'s word'); }
  /* R4: AUTO */
  { let turns = 0, quiet = 0, said = 0, hand = 0, noWhy = 0;
    for (let i = 0; i < 40; i++) { const gun = n => ({ background: 'militia', level: 2, gear: { main: guns[(i + n) % 3], off: null } }); const S = deal(i, Object.assign({ company: [gun(0), gun(1), gun(2)] }, i % 3 === 0 ? { night: true } : {})); let g = 0;   /* gun crews: a reload, a pin, no shot are the quiet turns AUTO has */
      while (!S.over && S.round <= 30 && g < 6000) { const u = F.current(); if (!u) break; const n0 = S.log.length, id = u.id, side = u.side, x0 = u.x, y0 = u.y; S.byHand = false;
        let k = 0; while (!S.over && F.current() === u && k < 60) { F.aiStep(u); k++; } g++; if (side !== 'you') continue;
        const L = S.log.slice(n0).filter(e => e.id === id); if (!L.length) continue; turns++;
        if ((u.x !== x0 || u.y !== y0) || L.some(e => /^(attack|step|move|sweep|throw|net|hook|shot|skill)$/.test(e.t)) || L.some(e => /^(down|dead|flee|fled)$/.test(e.t)) || u.dead || u.down || u.fled || u.morale === 'Fleeing') continue;
        quiet++; const w = L.filter(mine)[0]; if (w) { said++; if (w.hand) hand++; if (!w.why) noWhy++; } } }
    check(turns > 300 && quiet >= 3 && said === quiet && hand === 0 && noWhy === 0, 'R4', 'ON AUTO, AS BEFORE: ' + turns + ' turns of his in 40 fights of gun crews, ' + quiet + ' quiet, ' + said + ' said their word, ' + hand + ' marked hand, ' + noWhy + ' with no reason'); }
  /* R5 and its plant: a whole fight with his turns closed by hand */
  const byHandFight = (mute) => { let turns = 0, said = 0, whys = {};
    for (let i = 0; i < 6; i++) { const S = deal(i); let g = 0;
      while (!S.over && S.round <= 6 && g < 3000) { const u = F.current(); if (!u) break; g++;
        if (u.side !== 'you') { S.byHand = false; let k = 0; while (!S.over && F.current() === u && k < 60) { F.aiStep(u); k++; } continue; }
        if (u.morale === 'Fleeing' || !F.onField(u)) { S.byHand = false; F.aiStep(u); continue; }
        const n0 = S.log.length; S.byHand = true; if (F.canReload(u)) F.reload(u); if (F.current() === u) F.endTurn(u); S.byHand = false;
        if (mute) for (let j = S.log.length - 1; j >= n0; j--) if (S.log[j].t === 'idle' && S.log[j].hand) S.log.splice(j, 1);
        turns++; const w = S.log.slice(n0).filter(e => e.id === u.id && mine(e))[0]; if (w) { said++; whys[w.why] = (whys[w.why] || 0) + 1; } } }
    return { turns, said, whys }; };
  { const A = byHandFight(false);
    check(A.turns > 40 && A.said === A.turns, 'R5', 'BY HAND, WHOLE FIGHTS: ' + A.turns + ' turns of his closed by hand in six fights; ' + A.said + ' left their word (' + Object.keys(A.whys).map(k => k + ' ' + A.whys[k]).join(', ') + ')');
    const P = byHandFight(true);
    check(P.said < P.turns, 'R5p', 'planted: the hand\'s word taken out again, ' + (P.turns - P.said) + ' of ' + P.turns + ' turns pass with nothing'); }
  /* R6 (ask row 605, FOUND BY EYES 11/11): a turn's marker left behind (his last turn's, a step of his after it) */
  { let got = null;
    for (let i = 0; i < 12 && !got; i++) { const S = deal(i), u = toHis(S); if (!u) continue; const m0 = u.turnLog, f0 = { x: u.x, y: u.y };
      S.byHand = false; let k = 0; while (!S.over && F.current() === u && k < 60) { F.aiStep(u); k++; }
      if (S.over || !S.log.slice(m0).some(e => e.id === u.id && e.t === 'step')) continue;
      const again = toHis(S, v => v === u); if (!again || u.x !== again.x) continue;
      u.turnLog = m0; u.turnFrom = f0;   /* the marker as EYES read it: the same number as the turn before */
      const old = S.log.slice(u.turnLog).some(e => e.id === u.id && /^(attack|step|move)$/.test(e.t)), n0 = S.log.length; S.byHand = false; F.endTurn(u);
      const ev = S.log.slice(n0).filter(e => e.id === u.id); got = { name: u.name, ev: ev.map(e => e.t), id: ev.filter(mine)[0] || null, old }; }
    check(!!got && !!got.id && !got.id.hand && got.old === true, 'R6', 'A MARKER LEFT BEHIND: ' + (got ? got.name + '\'s turn, its marker still his last turn\'s (a step of his after it), closed with nothing done left [' + got.ev.join('/') + ']; read from the marker as before it was a turn he walked in: ' + got.old : 'no such turn in 12 deals')); }
  console.log('\nEVERY TURN READS: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

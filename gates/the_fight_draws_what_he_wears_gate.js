#!/usr/bin/env node
/* THE FIGHT DRAWS WHAT HE WEARS (COMBAT [the fight draws what he wears], rule 177(a)(d), Paolo 10/25: 'I'm not seeing all the
   weapons, armour and off-hand items in the actual combat; I gave everyone car door shields and I don't see that';
   records/BOHEMIA_PAOLO_WHAT_YOU_EQUIP_IS_WHAT_YOU_SEE_IN_THE_FIGHT_10_25_26.md). COMBAT's half: each man is drawn from HIS
   equipped main hand and off hand, both sides; a bag swap shows at once; nobody holds what he does not have. The pictures
   themselves (every look's keys with each thing, the armour and head gear as layers) are ANIMATION's [gear as layers on the rig]
   and COOK's [a model for every item]: this gate counts that debt against a frozen floor, so it can only shrink.

   Measured 10/25 before the fixes this gate came with:
   - a man handed a two-hander (the crossbow, the sledge) and a car door went into the fight with the door ON HIS ARM: its
     defence counted while both his hands held the two-hander (Battle Brothers will not equip the two together; our own swap
     already slung it on his back);
   - a man who swapped a pistol out of his bag stood bare-handed for good: the fight fetched a gun picture only for a man holding
     a gun when it opened (180 of 180 frames bare after the swap).

   Legs:
   H1 (headless, the shipped rules) a two-hander and a shield: the door rides on his back, no shield defence, a one-hander keeps it
      on his arm, a one-hander out of the bag brings it back to the arm; no man of theirs in any band holds a shield with a two-hander.
   P1 (the real fight, the shipped file, a computer) nobody holds what he does not have: over every drawn frame of every man of
      both sides, a gun drawn only of HIS gun's kind, no gun on a man without one, a shield only the one on HIS arm, his weapon's
      thing only (a man whose own model carries his thing, the thug's pipe and the poacher's hatchet, is counted apart as debt).
   P2 he is drawn with what he holds, in all eight facings: YOU with a pistol and a car door, a pipe and a car door, a machete and a
      crash bar, a crossbow (the door on his back, never on his arm).
   P3 a bag swap shows at once (the real swap on his turn): a pistol out of the bag is in his hand within 3 frames, then the car
      door out of the bag is on his arm within 3 frames; a gun the fight's start never loaded lands within 60 frames.
   P4 THE DEBT (ANIMATION's and COOK's, ratcheted): of every human look the fight deals, how many are drawn with a car door on the
      arm and a pistol in all eight facings, with a pipe and a car door, with a sledge in both hands; never fewer than the floor.
      The armour and head gear drawn as layers: counted, 0 until the layers come.
      Measured 10/25: the car door in all eight facings on 5 of 96 looks (YOU and four town men; the cast and the rolled men draw
      the pistol or the pipe in every facing and no door), the sledge in two hands on 0 (its keys are in on five looks, the
      sledge's layer on them is not).
   Run: node gates/the_fight_draws_what_he_wears_gate.js [--quick: H1 only] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE FIGHT DRAWS WHAT HE WEARS GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
/* the floor of P4, measured 10/25 (the looks drawn with each kit in all eight facings, of the human looks the fight deals) */
const FLOOR = { door_pistol: 5, door_pipe: 5, sledge: 0 };

(async () => {
  /* H1: the rules */
  {
    const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
    const ctx = engine(), F = ctx.FIGHT, D = ctx.DB;
    const g = (main, off, bag) => ({ main, off, body: null, head: null, bag: bag || [] });
    const crew = [{ background: 'companion_ranged', name: 'DANTE', gear: g('light_crossbow', 'wooden_shield') },
      { background: 'companion_2hand', name: 'TINA', gear: g('two_handed_mallet', 'kite_shield', ['bludgeon']) },
      { background: 'companion_1hand', name: 'RAUL', gear: g('bludgeon', 'wooden_shield') }];
    ctx.setSeed(9); F.setup({ company: crew, cap: 12, deploy: false, formation: null, flat: true, band: ['brigand_thug'] });
    const by = n => F.S.units.filter(u => u.name === n)[0], Da = by('YOU'), Ti = by('TINA'), Ra = by('RAUL');
    const backOk = [Da, Ti].every(u => !u.shield && u.shieldBack && u.shieldBack.id);
    const def = u => (u.shield ? u.shield.melee_defense || 0 : 0);
    leg(backOk && def(Da) === 0 && def(Ti) === 0 && Ra.shield && Ra.shield.id === 'wooden_shield' && !Ra.shieldBack,
      '*** H1 A TWO-HANDER AND A CAR DOOR: the door on his back, never on his arm *** (Battle Brothers will not equip them together)',
      'crossbow: arm ' + (Da.shield && Da.shield.id) + ', back ' + (Da.shieldBack && Da.shieldBack.id) + '; sledge: arm ' + (Ti.shield && Ti.shield.id) + ', back ' + (Ti.shieldBack && Ti.shieldBack.id) + '; the pipe man: arm ' + (Ra.shield && Ra.shield.id));
    /* the one-hander out of his bag brings the door to his arm (the swap's own rule, on his turn) */
    let guard = 0; while (F.current() !== Ti && !F.S.over && guard++ < 400) { const c = F.current(); if (!c) break; F.aiStep(c); }
    const sw = F.current() === Ti && (Ti.ap = Math.max(Ti.ap, 9), F.swap(Ti, 0));
    leg(sw && Ti.shield && Ti.shield.id === 'kite_shield' && !Ti.shieldBack, '  the pipe out of his bag: the door comes off his back onto his arm',
      'swap ' + sw + ', arm ' + (Ti.shield && Ti.shield.id) + ', back ' + (Ti.shieldBack && Ti.shieldBack.id));
    /* theirs, every band the bestiary deals */
    let both = 0, men = 0;
    const bands = Object.keys(D.bestiary && D.bestiary.rows ? D.bestiary.rows : {}).slice(0, 400);
    const ids = bands.length ? bands : (D.enemies && D.enemies.rows ? D.enemies.rows.map(r => r.id) : []);
    ids.forEach((id, k) => { try { ctx.setSeed(100 + k); F.setup({ company: crew.slice(2), cap: 12, deploy: false, formation: null, flat: true, band: [id, id, id] });
      F.S.units.filter(u => u.side === 'them').forEach(u => { men++; if (u.shield && u.weapon && F._t.bothHands(u.weapon)) both++; }); } catch (e) { /* a band the board cannot field */ } });
    leg(both === 0 && men > 0, '  no man of theirs holds a shield with a two-hander', both + ' of ' + men + ' men over ' + ids.length + ' bands');
  }
  if (process.argv.indexOf('--quick') >= 0) return done();

  /* the real fight */
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const g = (main, off, bag) => ({ main, off, body: null, head: null, bag: bag || [] });
  const crew = [{ background: 'companion_2hand', name: 'YOU', main: true, stats: { initiative: 400 }, gear: g('bludgeon', null, ['dagger', 'wooden_shield']) },
    { background: 'companion_1hand', name: 'RAUL', gear: g('bludgeon', 'wooden_shield') },
    { background: 'messenger', name: 'JAMAL', gear: g('shortsword', 'heavy_metal_shield') },
    { background: 'companion_ranged', name: 'DANTE', gear: g('light_crossbow', 'wooden_shield') },
    { background: 'companion_1hand', name: 'TINA', gear: g('two_handed_mallet', 'kite_shield') },
    { background: 'companion_1hand', name: 'LUZ', gear: g('dagger', 'buckler') }];
  for (let i = 0; i < 6; i++) crew.push({ background: 'companion_1hand', name: 'M' + i, gear: g('bludgeon', null) });
  const o = { seed: 7, kind: 'desert', company: crew, cap: 12, formation: null, party: { count: 6, days: 2, difficulty: 1, faction: 'brigands' }, teach: false, deploy: false };
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'computer', arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
  const errs = []; d.page.on('pageerror', e => errs.push(String(e)));
  await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
  /* what each man was drawn with, frame by frame: the draw's own counters, attributed to the man drawn */
  await d.page.evaluate(() => {
    const W = window.__WEAR = { men: {}, bad: [], debt: [] };
    const M = () => typeof MELEE !== 'undefined' && MELEE.meta;
    const propOf = v => { const m = M(), w = v.weapon && (v.weapon.of || v.weapon); if (!m || !w) return null;
      if (FIGHT.isGun(v.weapon)) return 'pistol';
      if (FIGHT._t.bothHands(v.weapon)) return (m.two_by_row || {})[w.id] || (m.two_by_class || {})[w.class] || null;
      return m.by_row[w.id] || m.by_class[w.class] || null; };
    const shOf = v => { const m = M(); return m && v.shield ? m.shield_by_row[(v.shield.of || v.shield).id] || null : null; };
    W.propOf = propOf; W.shOf = shOf;
    const rec = (v, k) => { const r = W.men[v.id] = W.men[v.id] || {}; r[k] = (r[k] || 0) + 1; };
    const md = window.meleeDraw; window.meleeDraw = function (v) {
      const b = Object.assign({}, FIGHT_UI.clipSeen), out = md.apply(this, arguments);
      Object.keys(FIGHT_UI.clipSeen).forEach(k => { if ((FIGHT_UI.clipSeen[k] || 0) <= (b[k] || 0)) return;
        const L = lookOf(v), e = L && MELEE.looks[L._key] && MELEE.looks[L._key].d;
        if (/^shield:/.test(k)) { rec(v, k + '@' + v._face); if (k.slice(7) !== shOf(v)) W.bad.push(v.id + ' ' + k + ' with ' + shOf(v)); }
        if (/^prop:/.test(k)) { rec(v, k + '@' + v._face); if (k.slice(5) !== propOf(v)) W.bad.push(v.id + ' ' + k + ' with ' + propOf(v));
          else if (e && e.held) W.debt.push(v.id + ' ' + L._key + ' holds his model\'s ' + e.held.join('/') + ' for ' + k.slice(5)); } });
      return out; };
    const gs = window.gunSheet; window.gunSheet = function (v, L) { const o = gs.apply(this, arguments);
      if (o) { const kd = DB.rig.guns.order[o.row]; rec(v, 'gun:' + kd + '@' + v._face);
        const want = v.weapon && FIGHT.isGun(v.weapon) ? DB.rig.guns.by_class[(v.weapon.of && v.weapon.of.class) || v.weapon.class] : null;
        if (kd !== want) W.bad.push(v.id + ' gun ' + kd + ' with ' + want); }
      return o; };
    const bm = window.blitMan; window.blitMan = function (v) { rec(v, 'frames'); return bm.apply(this, arguments); };
  });
  const wait = ms => d.page.waitForTimeout(ms);
  await wait(4000);
  /* P1 */
  const p1 = await d.page.evaluate(() => { const W = window.__WEAR;
    const drawn = Object.keys(W.men).length, withShield = FIGHT.S.units.filter(v => FIGHT.onField(v) && v.shield).length;
    const twoDoor = FIGHT.S.units.filter(v => v.shield && v.weapon && FIGHT._t.bothHands(v.weapon)).length;
    return { drawn, withShield, twoDoor, bad: W.bad.length, ex: W.bad.slice(0, 3), debt: Array.from(new Set(W.debt.map(s => s.split(' ').slice(1).join(' ')))).slice(0, 4) }; });
  leg(p1.bad === 0 && p1.twoDoor === 0 && p1.drawn >= 12, '*** P1 NOBODY HOLDS WHAT HE DOES NOT HAVE *** (both sides, every drawn frame: a gun only of his gun\'s kind, a shield only his own, his weapon\'s thing only)',
    p1.bad + ' wrong of ' + p1.drawn + ' men drawn' + (p1.ex.length ? ' (' + p1.ex.join('; ') + ')' : '') + ', ' + p1.twoDoor + ' two-handers with a door on the arm; debt apart: ' + (p1.debt.join('; ') || 'none'));
  /* P2: four kits on the looks that have their keys, all eight facings */
  const p2 = await d.page.evaluate(async () => {
    const W = window.__WEAR, U = n => FIGHT.S.units.filter(v => v.name === n)[0], out = {};
    const men = [U('LUZ'), U('RAUL'), U('JAMAL'), U('DANTE')];
    men[0].look = 'you';   /* the pistol and the door on YOU's look */
    const pause = ms => new Promise(r => setTimeout(r, ms));
    for (let f = 0; f < 8; f++) { men.forEach(v => { v._face = f; v._turnAt = Infinity; }); await pause(260); }
    men.forEach(v => { const r = W.men[v.id] || {}, sh = W.shOf(v), pr = W.propOf(v), gun = v.weapon && FIGHT.isGun(v.weapon);
      const faces = k => [0, 1, 2, 3, 4, 5, 6, 7].filter(f => r[k + '@' + f]).length;
      out[v.name] = { look: lookOf(v)._key, shield: sh ? faces('shield:' + sh) : null, prop: pr && !gun ? faces('prop:' + pr) : null,
        gun: gun ? faces('gun:' + DB.rig.guns.by_class[(v.weapon.of || v.weapon).class]) : null, arm: v.shield ? v.shield.id : null, back: v.shieldBack ? v.shieldBack.id : null }; });
    men.forEach(v => { v._turnAt = 0; });
    return out; });
  const L2 = p2.LUZ, R2 = p2.RAUL, J2 = p2.JAMAL, D2 = p2.DANTE;
  leg(L2.gun === 8 && L2.shield === 8, '  P2 a pistol and a car door (YOU\'s look): both drawn in all eight facings', 'gun ' + L2.gun + '/8, door ' + L2.shield + '/8');
  leg(R2.prop === 8 && R2.shield === 8, '  P2 a pipe and a car door (' + R2.look + '): both in all eight facings', 'pipe ' + R2.prop + '/8, door ' + R2.shield + '/8');
  leg(J2.prop === 8 && J2.shield === 8, '  P2 a machete and the crash bar (' + J2.look + '): both in all eight facings', 'machete ' + J2.prop + '/8, crash bar ' + J2.shield + '/8');
  leg(D2.gun === 8 && !D2.arm && D2.back === 'wooden_shield' && !D2.shield, '  P2 a crossbow and a car door: the long gun drawn in all eight facings, the door on his back, never on his arm',
    'gun ' + D2.gun + '/8, arm ' + D2.arm + ', back ' + D2.back);
  /* P3: the real swap on his turn */
  const p3 = await d.page.evaluate(async () => {
    const W = window.__WEAR, Y = FIGHT.S.units.filter(v => v.name === 'YOU')[0], out = { turn: FIGHT.current() === Y };
    const pause = ms => new Promise(r => setTimeout(r, ms));
    const frames = () => (W.men[Y.id] || {}).frames || 0, seen = k => Object.keys(W.men[Y.id] || {}).filter(x => x.indexOf(k) === 0).reduce((a, x) => a + W.men[Y.id][x], 0);
    const until = async (k, cap) => { const f0 = frames(), s0 = seen(k); for (let i = 0; i < 400; i++) { if (seen(k) > s0) return frames() - f0; if (frames() - f0 > cap) return null; await pause(16); } return null; };
    out.pistol = FIGHT.swap(Y, 0); out.pistolIn = await until('gun:pistol', 30);
    out.door = FIGHT.swap(Y, 1); out.doorIn = await until('shield:car_door', 30);
    /* a gun the start never loaded: a shotgun put in the hands of a man whose look's guns no one in this fight holds */
    const M = FIGHT.S.units.filter(v => v.name === 'M0')[0], row = DB.weapons.rows.filter(r => r.id === 'handgonne')[0];
    M.look = 'cast_poncho'; rigLater('fight_rig/' + lookOf(M).file);
    out.unloaded = !FIGHT_UI.imgs['fight_rig/' + lookOf(M).guns];
    await pause(1500); const was = M.weapon; M.weapon = row;
    const f0 = (W.men[M.id] || {}).frames || 0; let got = null;
    for (let i = 0; i < 300 && got === null; i++) { await pause(16); const r = W.men[M.id] || {};
      if (Object.keys(r).some(x => x.indexOf('gun:shotgun') === 0)) got = (r.frames || 0) - f0; }
    M.weapon = was; out.later = got;
    return out; });
  leg(p3.turn && p3.pistol && p3.pistolIn !== null && p3.pistolIn <= 3, '*** P3 A BAG SWAP SHOWS AT ONCE *** a pistol out of his bag is in his hand',
    'his turn ' + p3.turn + ', swapped ' + p3.pistol + ', drawn after ' + p3.pistolIn + ' frames');
  leg(p3.door && p3.doorIn !== null && p3.doorIn <= 3, '  P3 then the car door out of his bag is on his arm', 'swapped ' + p3.door + ', drawn after ' + p3.doorIn + ' frames');
  leg(p3.unloaded && p3.later !== null && p3.later <= 60, '  P3 a gun the fight\'s start never loaded lands in his hands', 'not loaded at the start ' + p3.unloaded + ', drawn after ' + p3.later + ' frames');
  /* P4: the debt over every human look */
  const p4 = await d.page.evaluate(async () => {
    const W = window.__WEAR, pause = ms => new Promise(r => setTimeout(r, ms));
    const looks = Object.keys(DB.rig.looks).filter(k => DB.rig.looks[k].kind !== 'beast');
    const mine = FIGHT.S.units.filter(v => v.side === 'you' && FIGHT.onField(v) && v.name !== 'YOU');
    const Y = FIGHT.S.units.filter(v => v.name === 'YOU')[0], pistol = Y.weapon;
    const row = id => DB.weapons.rows.filter(r => r.id === id)[0], door = DB.armor.shields.filter(r => r.id === 'wooden_shield')[0];
    const kits = { door_pistol: [pistol, door], door_pipe: [row('bludgeon'), door], sledge: [row('two_handed_mallet'), null] };
    const res = {}, missing = {};
    for (const kit of Object.keys(kits)) {
      res[kit] = 0; missing[kit] = [];
      for (let b = 0; b < looks.length; b += mine.length) {
        const batch = looks.slice(b, b + mine.length);
        mine.forEach((v, i) => { v._wl = batch[i] || null; if (!v._wl) return; v.look = v._wl; v.weapon = kits[kit][0]; v.shield = kits[kit][1]; v.shieldBack = null;
          const L = lookOf(v); rigLater('fight_rig/' + L.file); if (L.guns) rigLater('fight_rig/' + L.guns); delete W.men[v.id]; });
        await pause(900);
        for (let f = 0; f < 8; f++) { mine.forEach(v => { v._face = f; v._turnAt = Infinity; }); await pause(180); }
        mine.forEach(v => { if (!v._wl) return; const r = W.men[v.id] || {}, all = k => [0, 1, 2, 3, 4, 5, 6, 7].every(f => r[k + '@' + f]);
          const sh = W.shOf(v), pr = W.propOf(v), gun = FIGHT.isGun(v.weapon);
          const ok = (gun ? all('gun:pistol') : all('prop:' + pr)) && (!sh || all('shield:' + sh));
          const n = k => [0, 1, 2, 3, 4, 5, 6, 7].filter(f => r[k + '@' + f]).length;
          if (ok) res[kit]++; else missing[kit].push(v._wl + ' ' + (gun ? n('gun:pistol') : n('prop:' + pr)) + (sh ? '+' + n('shield:' + sh) : '') + '/8'); });
      }
    }
    mine.forEach(v => { v._turnAt = 0; });
    const armour = FIGHT.S.units.filter(v => v.bodyRow || v.headRow).length;
    return { looks: looks.length, res, missing, armour }; });
  Object.keys(FLOOR).forEach(k => leg(p4.res[k] >= FLOOR[k], '  P4 THE DEBT (ANIMATION [gear as layers on the rig], COOK [a model for every item]): looks drawn with ' + k.replace('_', ' and ') + ' in all eight facings, never fewer than ' + FLOOR[k],
    p4.res[k] + ' of ' + p4.looks + ' human looks; not yet: ' + p4.missing[k].slice(0, 6).join(' ') + (p4.missing[k].length > 6 ? ' and ' + (p4.missing[k].length - 6) + ' more' : '')));
  console.log('  info THE ARMOUR AND HEAD GEAR AS LAYERS: 0 drawn (no layer yet; the look is his body; ' + p4.armour + ' men in this fight wear a body or head row)');
  leg(errs.length === 0, 'no page error', errs.slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + (e && e.stack || e).toString().slice(0, 400)); fail++; done(); });

#!/usr/bin/env node
/* FATIGUE COMES BACK EVERY TURN, AND RUNNING OUT NEVER ENDS A FIGHT (COMBAT [fatigue comes back every turn], rules 283 and 285,
   Paolo 10/26: 'with a shield and a one hand weapon fatigue doesn't get restored, if I chill out it doesn't go down... it creeps all
   the way up and after that I can't attack anymore for the whole fight'; 'there's no calculations for stamina regeneration,
   especially if I'm ending my turn not taking any action... if I run out of stamina in a match it's over';
   records/BOHEMIA_PAOLO_FATIGUE_COMES_BACK_EVERY_TURN_10_26_26.md, records/BOHEMIA_PAOLO_FATIGUE_SAID_AGAIN_RUNNING_OUT_NEVER_ENDS_A_FIGHT_10_26_26.md).
   MEASURED BEFORE (the live rules, headless): one man of his with a car door and a spear among three brigands, swinging when his
   breath allowed and ending his turn to rest when it did not: 70 of 296 of his turns winded, the longest run 13 turns; resting,
   his fatigue went 81 -> 83 -> 83 of 83 (the hits and blocks put back more than Battle Brothers' 15 took off). In the worst kit
   (the heaviest body and helmet) 220 of 295, the longest run 15: he never swung again.
   Legs:
   F1 THE RULES, BY HAND (headless, the live rules): his man in the worst kit (a car door, the heaviest body and helmet, a full
      bag) and in his own light kit, ringed by three, 40 rolled fights each: whenever he is winded he ENDS HIS TURN (a rest), and
      the turn after a rest he can swing, every time; never more than one winded turn running while unhurt;
   F2 THE NUMBERS: every turn of his that follows a turn that spent, 15 came back (or all he had); after a rest, 30 (or all), the
      hits and blocks of the rest owed, never off the 30;
   F3 AUTO: 60 rolled AUTO fights of his crew of three in that kit: no man of his winded more than two turns running while unhurt;
   F4 RECOVER: a winded man by hand may RECOVER (no perk): it halves his fatigue; a man not winded and without the perk may not;
   F5 THE SCREEN (the real fight page, his phone and his computer): at each turn of his the breath tag over him reads what came
      back (+15, +30 after a rest), his card's bar is the engine's fatigue over his maximum, and his card shows the faint +N to come;
      a winded man by hand has RECOVER lit;
   F6 A KIT THAT LEAVES NO SWING says TOO HEAVY TO SWING on his card at the lineup;
   F7 nothing threw.
   Run: node gates/fatigue_comes_back_every_turn_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== FATIGUE COMES BACK EVERY TURN GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const HEAVY = { body: 'heavy_lamellar_armor', head: 'decayed_great_helm', bag: ['militia_spear', 'wooden_shield'] };
const LIGHT = { body: null, head: null, bag: [] };

(async () => {
  const errs = [];
  const B = require(path.join(ROOT, 'tools/bohemia_tuning_auto_brain.js'));
  const ctx = await B.engineFor('today'), F = ctx.FIGHT, T = F._t, districts = ctx.DB.boardKinds.districts;
  const R = k => require('vm').runInContext("R('" + k + "')", ctx);
  const BACK = R('fatigue.recovery_per_turn'), REST = R('ours.rest_recovery');
  const kitOf = k => ({ main: 'militia_spear', off: 'wooden_shield', body: k.body, head: k.head, bag: k.bag.slice() });
  /* F1, F2: one man ringed by three, by hand: swing when he can, rest when he cannot */
  const F1 = { fights: 0, turns: 0, winded: 0, longest: 0, afterRest: 0, swungAfterRest: 0, back: 0, backBad: [], rest: 0, restBad: [] };
  for (const kit of [HEAVY, LIGHT]) for (let k = 0; k < 40; k++) {
    try {
      const W = B.fightOf(k, districts); ctx.setSeed(W.seed);
      F.setup({ auto: true, formation: null, company: [{ background: 'companion_1hand', name: 'YOU', main: true, gear: kitOf(kit) }], cap: 1,
        party: { faction: 'brigands', count: 3, days: 30 }, days: 30, district: 'suburb', cell: W.cell, act: 1, flat: true });
      const S = F.S; S.deploy = false; F1.fights++;
      const me = S.units.find(v => v.side === 'you'), them = S.units.filter(v => v.side === 'them');
      me.x = 10; me.y = 7; [[11, 7], [9, 7], [10, 8]].forEach((p, i) => { if (them[i]) { them[i].x = p[0]; them[i].y = p[1]; } });
      me.hp = me.hpMax = 99999;
      let cur = null, run = 0, end = null;
      for (let g = 0; g < 100000 && !S.over && S.round <= 20; g++) {
        const v = F.current(); if (!v) break;
        if (v === me && v !== cur) {
          const winded = F.winded(v);
          F1.turns++; if (winded) { F1.winded++; run++; F1.longest = Math.max(F1.longest, run); } else run = 0;
          if (end && end.rest && S.round > end.round) {   /* after a rest (his next turn, a new round): exactly the rest came back, the hits of the rest kept apart (owed) */
            F1.afterRest++; if (!winded) F1.swungAfterRest++;
            F1.rest++; if (Math.abs(v.fat - Math.max(0, end.fat - REST)) > 0.5 || v.fatBack !== Math.round(Math.min(end.fat, REST))) F1.restBad.push(Math.round(end.fat) + '->' + Math.round(v.fat) + ' back ' + v.fatBack + ' (round ' + end.round + '->' + S.round + ', owed ' + (v.restOwed || 0) + ')');
          } else if (end && S.round > end.round) { F1.back++; if (v.fatBack > BACK || v.fatBack < Math.round(Math.min(end.fat, BACK))) F1.backBad.push(Math.round(end.fat) + ' back ' + v.fatBack); }   /* hits only add, so what came back is the 15 or all he had at the round */
        }
        cur = v;
        if (v === me) {
          const foe = S.units.find(t => t.side === 'them' && F.onField(t) && Math.max(Math.abs(t.x - v.x), Math.abs(t.y - v.y)) === 1);
          const swing = foe && !F.winded(v) && v.ap >= 4;
          if (swing) { try { F.aiStep(v); } catch (e) { errs.push('F1 ' + e.message); } }
          /* read before END TURN: the last man's END TURN opens the next round, and its recovery, at once; a rest is END TURN with
             no AP spent (the rules' own test) */
          const eFat = v.fat, eRound = S.round;
          if (F.current() === v) F.endTurn(v);
          end = { fat: eFat, rest: !!v.lastRest, round: eRound };
        } else F.aiStep(v);
        S.events = [];
      }
    } catch (e) { errs.push('F1 ' + String(e.message).slice(0, 120)); }
  }
  leg(F1.afterRest > 20 && F1.swungAfterRest === F1.afterRest && F1.longest <= 1,
    '*** F1 ONE REST, THEN A SWING, EVERY KIT *** (rules 283(c), 285(a)): ringed by three, winded, he rests a turn and swings the next, every time',
    F1.fights + ' fights, ' + F1.turns + ' turns of his, winded ' + F1.winded + ', the longest run ' + F1.longest + '; after a rest he could swing ' + F1.swungAfterRest + ' of ' + F1.afterRest);
  leg(F1.back > 20 && F1.rest > 20 && !F1.backBad.length && !F1.restBad.length,
    '*** F2 THE NUMBERS: ' + BACK + ' BACK EVERY TURN, ' + REST + ' AFTER A REST, THE HITS OF A REST OWED *** (rules 283(a)(b), 285(b))',
    F1.back + ' turns after a turn that spent' + (F1.backBad.length ? ' (' + F1.backBad.slice(0, 2).join('; ') + ')' : ' all right') + ', ' + F1.rest + ' after a rest' + (F1.restBad.length ? ' (' + F1.restBad.slice(0, 2).join('; ') + ')' : ' all right'));
  /* F3: AUTO, his crew of three in the heavy kit */
  {
    let worst = 0, turns = 0, winded = 0; const heavyMen = new Set();   /* a kit that leaves no swing at all is F6's, his card says so */
    for (let k = 0; k < 60; k++) {
      try {
        const W = B.fightOf(k, districts); ctx.setSeed(W.seed);
        const HIS = ['YOU', 'RAUL', 'JAMAL'].map((n, i) => ({ background: 'companion_1hand', name: n, main: !i, gear: kitOf(HEAVY) }));
        F.setup({ auto: true, formation: null, company: HIS, cap: 3, party: { faction: W.faction, count: 3 + (k % 3), days: 30 }, days: 30, district: W.district, cell: W.cell, act: 1 });
        const S = F.S; S.deploy = false; S.units.filter(v => v.side === 'you').forEach(v => { v.hp = v.hpMax = 99999; });
        const run = {}; let cur = null;
        for (let g = 0; g < 200000 && !S.over && S.round <= 30; g++) {
          const v = F.current(); if (!v) break;
          if (v !== cur && v.side === 'you' && F.onField(v) && v.morale !== 'Fleeing' && !S.retreat) { if (F.tooHeavy(v)) { heavyMen.add(k + ':' + v.id); } else {   /* a man in a rout runs, he is not ordered */ turns++; if (F.winded(v)) { winded++; run[v.id] = (run[v.id] || 0) + 1; worst = Math.max(worst, run[v.id]); } else run[v.id] = 0; } }
          cur = v; F.aiStep(v); S.events = [];
        }
      } catch (e) { errs.push('F3 ' + String(e.message).slice(0, 120)); }
    }
    leg(turns > 200 && worst <= 2, '*** F3 AUTO TOO: NO MAN OF HIS WINDED MORE THAN TWO TURNS RUNNING *** (rule 283(d))', turns + ' turns of his men in the heaviest kit, ' + winded + ' winded, the longest run ' + worst + (heavyMen.size ? '; ' + heavyMen.size + ' men whose kit leaves no swing left to F6' : ''));
  }
  /* F4: RECOVER for a winded man without the perk */
  {
    let ok = false, why = '';
    try {
      ctx.setSeed(5);
      F.setup({ auto: false, formation: null, company: [{ background: 'companion_1hand', name: 'YOU', main: true, gear: kitOf(LIGHT), perks: [] }], cap: 1, party: { faction: 'brigands', count: 2, days: 10 }, days: 10, district: 'suburb', act: 1, flat: true });
      const S = F.S; S.deploy = false;
      for (let g = 0; g < 200 && F.current() && F.current().side !== 'you'; g++) { F.aiStep(F.current()); S.events = []; }
      const me = F.current(); me.perks = []; me.fat = 0; me.ap = me.apTurn;
      const fresh = F.canUse(me, 'recover');
      me.fat = F.fatMax(me) - 1; const tired = F.winded(me) && F.canUse(me, 'recover'), f0 = me.fat;
      const used = F.useSkill(me, 'recover');
      ok = !fresh && tired && used && me.fat <= Math.ceil(f0 / 2);
      why = 'fresh may ' + fresh + ', winded may ' + tired + ', pressed ' + used + ', ' + f0 + ' -> ' + me.fat;
    } catch (e) { why = 'ran: ' + e.message; }
    leg(ok, '*** F4 RECOVER FOR ANY WINDED MAN *** (rule 283(b)): it halves his fatigue; a man not winded without the perk may not', why);
  }
  /* F5, F6: the real page */
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const ARM = "window.__fe=[];addEventListener('error',function(e){try{window.__fe.push(String(e.message||e).slice(0,160))}catch(_){}});";
  for (const profile of ['phone_portrait', 'computer']) {
    const tag = profile === 'computer' ? 'COMPUTER' : 'PHONE';
    let d = null;
    try {
      const o = { seed: 61, speed: 1, hand: 4, formation: null, teach: false, odds: false, deploy: false, cap: 1, company: [{ background: 'companion_1hand', gear: kitOf(LIGHT) }], band: ['brigand_thug', 'brigand_thug', 'brigand_thug'], kind: 'suburb', flat: true };
      d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: ARM + 'window.FIGHT_OPTS=' + JSON.stringify(o) + ';' });
      const p = d.page;
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
      await p.evaluate(() => { const S = FIGHT.S, me = S.units.find(v => v.side === 'you'), th = S.units.filter(v => v.side === 'them');
        me.x = 8; me.y = 6; [[9, 6], [7, 6], [8, 7]].forEach((q, i) => { if (th[i]) { th[i].x = q[0]; th[i].y = q[1]; } }); me.hp = me.hpMax = 99999; FIGHT_UI.breaths = []; });
      /* by hand: each of his turns, read the screen, then swing if he can, else END TURN (a rest) */
      const seen = [], bad = [];
      for (let i = 0; i < 400 && seen.length < 8; i++) {
        const st = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(); if (S.over) return { over: true };
          if (!u || !crewControlled(u) || FIGHT_UI.anim.length) return null;
          hud(); const fb = document.getElementById('bfat'), w = parseFloat(fb.style.width), want = 100 * Math.max(0, Math.min(1, u.fat / FIGHT.fatMax(u)));
          const sk = [...document.querySelectorAll('#skills [data-skill="recover"], #skills [data-id="recover"]')].some(b => !b.disabled && b.offsetParent);
          return { round: S.round, fat: Math.round(u.fat), back: u.fatBack, rest: u.restedBack, bar: w, want: want, br: (FIGHT_UI.breath && FIGHT_UI.breath.id === u.id) ? FIGHT_UI.breath.n : null,
            faint: (document.querySelector('#apn .back') || {}).textContent || '', winded: FIGHT.winded(u), recover: sk }; });
        if (st && st.over) break;
        if (!st) { await p.waitForTimeout(120); continue; }
        if (!seen.length || seen[seen.length - 1].round !== st.round) {
          seen.push(st);
          if (Math.abs(st.bar - st.want) > 0.6) bad.push('r' + st.round + ' bar ' + st.bar.toFixed(1) + '% vs ' + st.want.toFixed(1) + '%');
          if (st.round > 1 && st.back > 0 && st.br !== st.back) bad.push('r' + st.round + ' tag ' + st.br + ' vs back ' + st.back);
          if (!/^\+\d+$/.test(st.faint)) bad.push('r' + st.round + ' no faint +N (' + st.faint + ')');
          if (st.winded && !st.recover) bad.push('r' + st.round + ' winded, RECOVER dark');
        }
        await p.evaluate(() => { const u = FIGHT.current(); const foe = FIGHT.S.units.find(t => t.side === 'them' && FIGHT.onField(t) && Math.max(Math.abs(t.x - u.x), Math.abs(t.y - u.y)) === 1);
          if (foe && !FIGHT.winded(u) && FIGHT.canStrike(u, foe)) { FIGHT.strike(u, foe); take(); } if (FIGHT.current() === u) { FIGHT.endTurn(u); take(); } hud(); });
        await p.waitForTimeout(80);
      }
      const rests = seen.filter(s => s.rest).length;
      leg(seen.length >= 5 && !bad.length, '*** F5 ' + tag + ': HE SEES IT COME BACK: THE BREATH TAG, THE BAR THE ENGINE\'S, THE FAINT +N *** (rule 285(c))',
        seen.length + ' turns of his read (' + rests + ' after a rest): ' + seen.map(s => 'r' + s.round + ' ' + s.fat + (s.back ? ' +' + s.back + (s.rest ? 'R' : '') : '')).join(', ') + (bad.length ? ' | ' + bad.slice(0, 3).join('; ') : ''));
      errs.push.apply(errs, (await p.evaluate(() => window.__fe || [])).map(e => tag + ': ' + e));
    } catch (e) { leg(false, 'F5 ' + tag + ' ran', String(e.message).slice(0, 200)); }
    finally { if (d) await d.close().catch(() => {}); }
  }
  /* F6: a kit that leaves no swing, at the lineup */
  {
    let d = null;
    try {
      const o = { seed: 62, speed: 1, formation: null, teach: false, odds: false, deploy: true, cap: 1, company: [{ background: 'companion_1hand', gear: kitOf(LIGHT) }], band: ['brigand_thug'], kind: 'suburb', flat: true };
      d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: ARM + 'window.FIGHT_OPTS=' + JSON.stringify(o) + ';' });
      const p = d.page;
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.deploy && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
      const r = await p.evaluate(() => { const me = FIGHT.S.units.find(v => v.side === 'you'), light = document.getElementById('apn').textContent;
        me.fatigue = 3; hud(); return { light: light, heavy: document.getElementById('apn').textContent, too: FIGHT.tooHeavy(me) }; });
      leg(r.too && /TOO HEAVY TO SWING/.test(r.heavy) && !/TOO HEAVY/.test(r.light), '*** F6 A KIT THAT LEAVES NO SWING SAYS SO ON HIS CARD, AT THE LINEUP *** (rule 283(c))', '"' + r.light + '" -> "' + r.heavy + '"');
    } catch (e) { leg(false, 'F6 ran', String(e.message).slice(0, 200)); }
    finally { if (d) await d.close().catch(() => {}); }
  }
  leg(errs.length === 0, 'F7 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });

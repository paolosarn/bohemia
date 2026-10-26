#!/usr/bin/env node
/* RETREAT AND THE ROUT ARE A CHASE, NEVER A SWITCH (COMBAT [retreat and the rout, a chase], rule 198, Paolo 10/25: 'I still cannot
   retreat, and when the enemy wants to retreat it's not guaranteed, it's not just one thing that ends; they have to try to run
   away from us and we're getting free hits on them if they're in our melee range of control or range of fire... it's not
   finished'; records/BOHEMIA_PAOLO_RETREAT_THE_ROUT_WALK_THROUGH_YOUR_MEN_AND_EVERY_CURRENCY_ON_TOP_10_25_26.md).
   Measured before (main a3c87279): the fight was won the moment the last man of theirs on his feet broke, so every runner vanished
   with it (70 rolled AUTO fights: 102 broke, 51 ever caught); no free shot existed; RETREAT was dark on AUTO and through every
   turn of theirs, so on AUTO it could never be pressed.
   Legs, headless (rolled AUTO fights, both sides the one brain):
   R1 THE BROKEN STAY: a man of theirs who breaks is still on the board after the blow that broke him, and on his own turns he
      runs: nearer the edge, off it, or caught or held on the way; some rally (Battle Brothers' stop-fleeing check);
   R2 NOTHING ENDS AT THE BREAK: every fight ends with every man of theirs down or off the board, or by END THE FIGHT while all
      of them left are running, or with his side gone; never with a man of theirs standing and fighting;
   R3 FREE HITS ON A RUNNER: leaving a melee man's zone draws his free swing; stepping into a ready gun's reach draws one free
      shot, once a runner a turn, once a gunman a round, a round spent; both land and are counted;
   R4 END THE FIGHT only while every one of theirs left is running (refused otherwise); AUTO ends a chase it cannot catch and
      runs down one it can;
   on the real page, his phone (390 x 844 at 3x) and his computer (1440 x 900):
   R5 RETREAT ON AUTO, IN THEIR TURN: the button is lit while AUTO plays and a man of theirs is up; two taps order it; his men run
      for the edge and the fight ends YOU PULLED OUT;
   R6 END THE FIGHT: every one of theirs left running, the button reads END THE FIGHT; two taps win it, the runners counted as ran;
   R7 nothing threw.
   Run: node gates/retreat_and_the_rout_a_chase_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== RETREAT AND THE ROUT, A CHASE GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const edgeOf = (S, v) => Math.min(v.x, v.y, S.w - 1 - v.x, S.h - 1 - v.y);

(async () => {
  const errs = [];
  const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
  const ctx = engine(), F = ctx.FIGHT;
  const M = { fights: 0, broke: 0, brokeGone: 0, turns: 0, toward: 0, off: 0, caught: 0, held: 0, stuck: 0, rallied: 0, overs: 0, badOver: [], freeSw: 0, freeSh: 0, shTwice: 0, gunTwice: 0, flagOff: 0, endRefused: 0, endTried: 0, ended: 0, chaseCaught: 0, chases: 0, longChase: 0 };
  /* one AUTO fight to its end, counting; force: every man of theirs breaks at the start of round 2 (the standoff's own way) */
  const play = (kind, seed, count, days, force) => {
    ctx.setSeed(seed); F.setup({ seed, kind, auto: true, formation: null, deploy: false, party: { faction: 'brigands', count, days } });
    const S = F.S; S.deploy = false; M.fights++;
    const shotOn = {}, gunOn = {}, turnFrom = {}, turnLog = {}; let forced = false, forcedAt = 0;
    for (let g = 0; g < 4000 && !S.over && F.current(); g++) {
      if (S.round > 80) { M.badOver.push(kind + seed + ' ran 80 rounds'); break; }
      if (force && !forced && S.round >= 2) { forced = true; forcedAt = S.round; M.chases++; F.alive('them').forEach(v => { v.morale = 'Fleeing'; v.roundsFleeing = 0; v.givesUp = true; }); }
      const u = F.current(), n0 = S.log.length, runner = u.side === 'them' && u.morale === 'Fleeing' && F.onField(u), tk = u.id + '@' + S.round;
      if (runner && !(tk in turnFrom)) { turnFrom[tk] = edgeOf(S, u); turnLog[tk] = n0; }
      const e0 = runner ? turnFrom[tk] : 0;
      /* R4: END THE FIGHT is refused while one of theirs still fights */
      if (!F.allFleeing() && F.alive('them').length && g % 17 === 0) { M.endTried++; const snap = F.freeze(); if (F.endFight()) M.endRefused++; F.thaw(snap, true); }
      F.aiStep(u);
      const lg = S.log.slice(n0);
      if (runner && F.current() !== u) {   /* his turn as a runner is over: read from where it began */
        M.turns++;
        const all = S.log.slice(turnLog[tk]);
        if (all.some(e => e.t === 'rally' && e.id === u.id)) M.rallied++;
        else if (u.fled) M.off++;
        else if (!F.onField(u)) M.caught++;
        else if (all.some(e => e.t === 'held' && e.id === u.id)) M.held++;
        else if (edgeOf(S, u) < e0) M.toward++;
        else M.stuck++;
      }
      lg.forEach(e => {
        const v = F.byId(e.id), t = F.byId(e.to);
        if (e.t === 'morale' && e.to === 'Fleeing' && v && v.side === 'them') { M.broke++; if (!F.onField(v) && !v.dead && !v.down) M.brokeGone++; }
        if (e.t === 'rally' && v && v.side === 'them' && !(runner && v === u)) M.rallied++;
        if (e.t === 'attack' && e.free && t && F.runs(t)) {
          if (e.shot) { M.freeSh++; const k = t.id + '@' + e.round, kg = e.id + '@' + e.round; if (shotOn[k]) M.shTwice++; if (gunOn[kg]) M.gunTwice++; shotOn[k] = gunOn[kg] = true; }
          else M.freeSw++;
        }
        if ((e.t === 'dead' || e.t === 'down') && v && v.side === 'them' && forced) M.chaseCaught++;
        if (e.t === 'over') {
          M.overs++; if (e.ended) M.ended++;
          const up = F.alive('them').filter(x => x.morale !== 'Fleeing');
          if (!e.ended && F.alive('them').length && F.alive('you').length) M.badOver.push(kind + seed + ' over with ' + F.alive('them').length + ' of theirs on the board');
          if (up.length && F.alive('you').length) M.badOver.push(kind + seed + ' over with ' + up.length + ' of theirs fighting');
        }
      });
      if (!S.over && F.allFleeing() !== (F.alive('them').length > 0 && F.alive('them').every(x => x.morale === 'Fleeing'))) M.flagOff++;
    }
    if (force && S.round - forcedAt > 12) M.longChase++;
  };
  try {
    for (const kind of ['strip', 'suburb', 'culdesac', 'ruin', 'scrub', 'shore', 'landfill']) for (const seed of [1, 2, 3, 4, 5]) {
      play(kind, seed, 6, 1, false); play(kind, seed + 40, 12, 60, false); play(kind, seed + 80, 8, 20, true);
    }
  } catch (e) { errs.push('headless: ' + e.message.slice(0, 160)); }
  /* the chase none of his can catch: every one of theirs runs, every man of his is rooted (a net) for the round: AUTO ends it */
  let rooted = 0, rootedEnded = 0;
  try {
    for (const seed of [7, 8, 9, 10, 11, 12]) {
      ctx.setSeed(seed); F.setup({ seed, kind: 'scrub', auto: true, formation: null, deploy: false, party: { faction: 'brigands', count: 6, days: 1 } });
      const S = F.S; S.deploy = false;
      let g = 0; while (F.current() && F.current().side !== 'you' && g++ < 200) F.aiStep(F.current());
      const u = F.current(); if (!u || S.over) continue;
      F.alive('them').forEach(v => { v.morale = 'Fleeing'; v.givesUp = true; v.x = v.x; });
      F.alive('you').forEach(m => { m.netted = { fails: 0 }; });
      rooted++; F.aiStep(u); if (S.over && S.result === 'won' && S.log.some(e => e.t === 'over' && e.ended)) rootedEnded++;
    }
  } catch (e) { errs.push('rooted: ' + e.message.slice(0, 160)); }
  leg(M.broke >= 50 && M.brokeGone === 0 && M.turns >= 10 && M.toward + M.off + M.caught + M.held >= 0.8 * (M.turns - M.rallied),
    '*** R1 THE BROKEN STAY ON THE BOARD AND RUN *** (rule 198(b)): every man of theirs who breaks is still there after the blow, and on his own turns he runs: nearer the edge, off it, caught or held',
    M.fights + ' fights; ' + M.broke + ' broke, ' + M.brokeGone + ' gone with the blow; ' + M.turns + ' runner turns: ' + M.toward + ' nearer the edge, ' + M.off + ' off the board, ' + M.caught + ' caught, ' + M.held + ' held by a swing, ' + M.rallied + ' rallied, ' + M.stuck + ' boxed in');
  leg(M.overs >= M.fights - 2 && M.badOver.length === 0,
    '*** R2 NOTHING ENDS AT THE BREAK *** (rule 198(b)(d)): every fight ends with every man of theirs down or off the board, by END THE FIGHT while all of them run, or with his side gone',
    M.overs + ' ended of ' + M.fights + ', ' + M.ended + ' by END THE FIGHT; wrong ends ' + M.badOver.length + (M.badOver.length ? ': ' + M.badOver.slice(0, 3).join('; ') : ''));
  leg(M.freeSw > 0 && M.freeSh > 0 && M.shTwice === 0 && M.gunTwice === 0,
    '*** R3 FREE HITS ON A RUNNER *** (rule 198(c)): the free swing on leaving a melee man\'s zone, one free shot crossing a ready gun\'s reach, once a runner a turn and once a gunman a round',
    M.freeSw + ' free swings, ' + M.freeSh + ' free shots on runners; a runner shot twice in a turn ' + M.shTwice + ', a gunman twice in a round ' + M.gunTwice);
  leg(M.endTried > 20 && M.endRefused === 0 && M.flagOff === 0 && M.chases >= 30 && M.chaseCaught > 0 && M.longChase === 0,
    '*** R4 END THE FIGHT ONLY WHILE THEY ALL RUN; AUTO RUNS DOWN WHAT IT CAN CATCH *** (rule 198(d)(e))',
    'refused while one fights ' + (M.endTried - M.endRefused) + ' of ' + M.endTried + '; the read wrong ' + M.flagOff + '; ' + M.chases + ' chases: ' + M.chaseCaught + ' runners run down, ' + M.ended + ' ended by AUTO or the button, ' + M.longChase + ' over twelve rounds');

  leg(rooted >= 4 && rootedEnded === rooted, '  and AUTO ends a chase none of his men can catch (every man of his rooted in a net): won, the runners gone',
    rootedEnded + ' of ' + rooted + ' ended by AUTO');

  /* R5, R6: the page */
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const CREW3 = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI' }, { background: 'companion_ranged', name: 'TINA' }];
  for (const profile of ['phone_portrait', 'computer']) {
    /* R5: AUTO on, a man of theirs up, RETREAT pressed twice */
    {
      const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 41, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: CREW3, cap: 12, band: ['brigand_thug', 'brigand_thug', 'brigand_thug'], teach: false, odds: false, auto: true }) });
      const p = d.page; p.on('pageerror', e => errs.push(profile + ' R5: ' + e.message));
      try {
        await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
        let theirs = false; for (let i = 0; i < 200 && !theirs; i++) { theirs = await p.evaluate(() => { const u = FIGHT.current(); return !FIGHT.S.over && !!u && u.side === 'them' && FIGHT_UI.auto; }); if (!theirs) await p.waitForTimeout(40); }
        const lit = await p.evaluate(() => !document.getElementById('bflee').disabled);
        const at = await p.evaluate(() => { const r = document.getElementById('bflee').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, txt: document.getElementById('bflee').textContent }; });
        if (profile === 'computer') await p.mouse.click(at.x, at.y); else await p.touchscreen.tap(at.x, at.y);
        await p.waitForTimeout(500);
        const asked = await p.evaluate(() => document.getElementById('say').innerText);
        if (profile === 'computer') await p.mouse.click(at.x, at.y); else await p.touchscreen.tap(at.x, at.y);
        await p.waitForTimeout(200);
        const ordered = await p.evaluate(() => !!FIGHT.S.retreat);
        await p.waitForFunction(() => FIGHT.S.over && !FIGHT_UI.anim.length && document.getElementById('over').style.display === 'flex', null, { timeout: 90000 }).catch(() => {});
        const r = await p.evaluate(() => ({ head: document.getElementById('oh').innerText, out: FIGHT.S.units.filter(v => v.side === 'you' && v.escaped).length, over: FIGHT.S.over }));
        leg(theirs && lit && /Retreat\?/.test(asked) && ordered && r.over && /YOU PULLED OUT/.test(r.head) && r.out > 0,
          '*** R5 ' + (profile === 'computer' ? 'COMPUTER' : 'PHONE') + ': RETREAT ON AUTO, IN THEIR TURN *** (rule 198(a)): the button is lit while AUTO plays a man of theirs; two taps order it; his men get out',
          'their turn ' + theirs + ', lit ' + lit + ' (' + at.txt + '), asked "' + asked.replace(/\n/g, ' ').slice(0, 60) + '", ordered ' + ordered + ' | ' + r.head + ', ' + r.out + ' got out');
      } catch (e) { errs.push(profile + ' R5: ' + e.message.slice(0, 160)); }
      finally { await d.close(); }
    }
    /* R6: by hand, every one of theirs left running */
    {
      const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 42, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: CREW3, cap: 12, band: ['brigand_thug', 'brigand_thug'], teach: false, odds: false }) });
      const p = d.page; p.on('pageerror', e => errs.push(profile + ' R6: ' + e.message));
      try {
        await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
        let mine = false; for (let i = 0; i < 300 && !mine; i++) { mine = await p.evaluate(() => { const u = FIGHT.current(); return !FIGHT.S.over && crewControlled(u) && !FIGHT_UI.anim.length; }); if (!mine) await p.waitForTimeout(100); }
        const before = await p.evaluate(() => { hud(); return { txt: document.getElementById('bflee').textContent, all: FIGHT.allFleeing() }; });
        const set = await p.evaluate(() => { const th = FIGHT.S.units.filter(v => v.side === 'them' && FIGHT.onField(v)); th.forEach(v => { v.morale = 'Fleeing'; v.givesUp = true; }); hud(); return { n: th.length, txt: document.getElementById('bflee').textContent, lit: !document.getElementById('bflee').disabled }; });
        const at = await p.evaluate(() => { const r = document.getElementById('bflee').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
        if (profile === 'computer') await p.mouse.click(at.x, at.y); else await p.touchscreen.tap(at.x, at.y);
        await p.waitForTimeout(400);
        const asked = await p.evaluate(() => document.getElementById('say').innerText);
        if (profile === 'computer') await p.mouse.click(at.x, at.y); else await p.touchscreen.tap(at.x, at.y);
        await p.waitForFunction(() => FIGHT.S.over && !FIGHT_UI.anim.length && document.getElementById('over').style.display === 'flex', null, { timeout: 30000 }).catch(() => {});
        const r = await p.evaluate(() => ({ over: FIGHT.S.over, result: FIGHT.S.result, ran: FIGHT.S.units.filter(v => v.side === 'them' && v.fled).length, body: document.getElementById('ob').innerText, head: document.getElementById('oh').innerText }));
        leg(!/END THE FIGHT/.test(before.txt) && !before.all && /END THE FIGHT/.test(set.txt) && set.lit && /End the fight\?/.test(asked) && r.over && r.result === 'won' && r.ran === set.n,
          '*** R6 ' + (profile === 'computer' ? 'COMPUTER' : 'PHONE') + ': END THE FIGHT *** (rule 198(d)): RETREAT while they fight; END THE FIGHT once every one of theirs left runs; two taps win it, the runners ran',
          'before "' + before.txt + '", all running "' + set.txt + '" lit ' + set.lit + ', asked "' + asked.replace(/\n/g, ' ').slice(0, 50) + '" | ' + r.head + ' ' + r.result + ', ' + r.ran + ' of ' + set.n + ' ran');
      } catch (e) { errs.push(profile + ' R6: ' + e.message.slice(0, 160)); }
      finally { await d.close(); }
    }
  }
  leg(errs.length === 0, 'R7 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });

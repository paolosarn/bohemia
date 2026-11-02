/* THE FIGHT SAVES AT ITS START GATE (FINISHER 11/2/26; rule 233, ask lines 155 and 165).
   PAOLO 10/26: 'The fight saves only at its start, like Battle Brothers: a reload or crash puts me at the start of the same fight;
   nothing is saved until I'm back on the map.' And: 'If I lose a fight badly I can close the browser, reopen it and restart the
   fight, any time before the map; the loot screen counts as the fight.'
   On the demo he plays (phone by default; --profile computer), a fight opened through the map's one door, the tab KILLED the way a
   phone kills it (chrome://crash: no pagehide, no last word), the game opened again on the same phone:
     S1 AT THE BELL: one start record holds the game's keys and the hand-over; the fight's own per-turn keep is off in the game
     S2 *** A CRASH MID-FIGHT *** (a man of his dead, round 3, the wounds and a new key written): the same fight opens again by
        itself after CONTINUE: round 1, the same band, the same men at the hit points they walked in with, the same ground; every
        key as it was at the bell (the wounds gone, the new key gone)
     S3 *** THE LOOT SCREEN COUNTS AS THE FIGHT ***: won, a crash on the spoils: the same fight again, round 1
     S4 HOME: won, the spoils left, the map back: the record is gone; a crash then is the map (no fight), the results standing
     S5 nothing threw (the fight's known drawImage red, line 229, COMBAT's, is named apart)
   node gates/the_fight_saves_at_its_start_gate.js [--profile phone_portrait|computer] */
'use strict';
const path = require('path');
const D = require(path.join(__dirname, '..', 'tools/bohemia_drive_the_demo.js'));
const ai = process.argv.indexOf('--profile'), profile = ai > 0 ? process.argv[ai + 1] : 'phone_portrait';
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await new Promise(r => setTimeout(r, 300)); } return null; }
async function ff(d) { const h = await d.page.$('#fightFrame'); return h ? await h.contentFrame() : null; }
async function fightRead(d) { const f = await ff(d); if (!f) return null; return f.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units.length) ? { round: FIGHT.S.round, them: FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind || u.arch || u.name).join(','), you: FIGHT.S.units.filter(u => u.side === 'you').map(u => u.name + ':' + u.hp + (u.dead ? 'X' : '')).join(','), board: FIGHT.S.board, ground: JSON.stringify(FIGHT.S.terrain || null), keep: (window.FIGHT_OPTS || {}).keep, over: !!FIGHT.S.over } : null).catch(() => null); }
const rec = (d) => d.page.evaluate(() => { const R = JSON.parse(localStorage.getItem('bohemia.fight.start.v1') || 'null'); return R ? { n: R.n, size: R.size, why: R.d && R.d.why, deal: R.d && R.d.__deal } : null; });
async function win(d) { const f = await ff(d); await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} }); }
async function reopen(d) { try { await d.page.goto('chrome://crash'); } catch (e) {} await new Promise(r => setTimeout(r, 1500)); return D.open({ again: d, profile, keepCards: true, engage: true }); }
(async () => {
  console.log('--- ' + profile + ' ---');
  let d = await D.open({ profile, keepCards: true, engage: true });
  const errs = [];
  try {
    await d.page.waitForTimeout(2500);
    const cond0 = await d.page.evaluate(() => localStorage.getItem('bohemia.condition.v1'));
    await d.fr.evaluate(() => { const pm = partyMath('job', { skulls: 1 }); const roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
      cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'the gate', faction: null, draft: true, roster, party: pm, street: true, why: 'gate:fight-start', at: { gx: city.x, gy: city.y } }); });
    await d.page.waitForTimeout(600);
    await d.fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="go"]'); if (b) b.click(); });
    await waitFor(() => fightRead(d), 60000);
    const f1 = await fightRead(d), r1 = await rec(d);
    ok('S1 AT THE BELL: one start record (the game\'s keys and the hand-over, its deal), the fight\'s own keep off in the game', !!f1 && !!r1 && r1.n > 5 && r1.why === 'gate:fight-start' && r1.deal != null && f1.keep === false, JSON.stringify(r1) + ' keep ' + (f1 && f1.keep));
    const f = await ff(d); await f.evaluate(() => { const y = FIGHT.S.units.filter(u => u.side === 'you'); if (y[1]) { y[1].dead = true; y[1].hp = 0; } y[0].hp = Math.max(1, y[0].hp - 5); FIGHT.S.round = 3; });
    await d.page.evaluate(() => { localStorage.setItem('bohemia.gate.after.v1', '1'); localStorage.setItem('bohemia.condition.v1', '{"men":{},"dead":["THE GATE"]}'); });
    errs.push(...d.errs);
    d = await reopen(d);
    await waitFor(() => fightRead(d), 90000);
    const f2 = await fightRead(d), back = await d.page.evaluate(() => ({ cond: localStorage.getItem('bohemia.condition.v1'), extra: localStorage.getItem('bohemia.gate.after.v1'), r: window.__FIGHT_START_RESTORED || null }));
    ok('S2 *** A CRASH MID-FIGHT: THE SAME FIGHT AT ITS START *** (round 1, the same band, the same men as they walked in, the same ground; every key as at the bell)',
      !!f2 && f2.round === 1 && f2.them === f1.them && f2.you === f1.you && f2.board === f1.board && f2.ground === f1.ground && back.cond === cond0 && back.extra === null,
      f2 ? 'round ' + f2.round + '; ' + f2.them + '; ' + f2.you + '; ' + f2.board + (f2.ground === f1.ground ? ', the same blocks' : ', OTHER BLOCKS') + '; the wounds ' + (back.cond === cond0 ? 'as at the bell' : 'KEPT') + '; the new key ' + (back.extra === null ? 'gone' : 'KEPT') : 'no fight');
    await win(d);
    await waitFor(() => d.page.evaluate(() => !!(window.SPOILS && SPOILS.d)), 20000);
    const onSpoils = await d.page.evaluate(() => !!(window.SPOILS && SPOILS.d));
    errs.push(...d.errs);
    d = await reopen(d);
    await waitFor(() => fightRead(d), 90000);
    const f3 = await fightRead(d);
    ok('S3 *** THE LOOT SCREEN COUNTS AS THE FIGHT ***: won, a crash on the spoils, the same fight at round 1', onSpoils && !!f3 && f3.round === 1 && f3.them === f1.them && f3.board === f1.board, 'spoils ' + onSpoils + ' -> ' + (f3 ? 'round ' + f3.round + ', ' + f3.them : 'no fight'));
    await win(d);
    await waitFor(() => d.page.evaluate(() => !!(window.SPOILS && SPOILS.d)), 20000);
    await d.page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    await waitFor(() => d.page.evaluate(() => !window.CITYFIGHT), 30000); await d.page.waitForTimeout(4500);
    const r4 = await rec(d), cond4 = await d.page.evaluate(() => localStorage.getItem('bohemia.condition.v1'));
    errs.push(...d.errs);
    d = await reopen(d); await d.page.waitForTimeout(12000);
    const f5 = await fightRead(d), cf = await d.page.evaluate(() => !!window.CITYFIGHT), cond5 = await d.page.evaluate(() => localStorage.getItem('bohemia.condition.v1'));
    ok('S4 HOME: the record goes once the map is back; a crash then is the map, no fight, the results standing', r4 === null && !f5 && !cf && cond5 === cond4, 'record ' + JSON.stringify(r4) + ', fight after the crash ' + !!f5 + ', the condition ' + (cond5 === cond4 ? 'kept' : 'CHANGED'));
    errs.push(...d.errs);
    /* the fight's own known red, line 229 (COMBAT [eyes: the packed sheet throws]: blitMan hands the canvas a packed sheet it cannot
       draw), is counted and named, never this gate's; anything else that throws is */
    const known = errs.filter(e => /Failed to execute 'drawImage'/.test(e)), mine = errs.filter(e => known.indexOf(e) < 0);
    ok('S5 nothing threw (the fight\'s known drawImage red, line 229, named apart)', mine.length === 0, mine.length ? mine[0] : 'no errors' + (known.length ? '; the fight\'s drawImage red ' + known.length + ' times (line 229, COMBAT)' : ''));
  } catch (e) { ok('the gate ran [' + String(e.message).slice(0, 200) + ']', false); }
  try { await d.close(); } catch (e) {}
  console.log('THE FIGHT SAVES AT ITS START: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

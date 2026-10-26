#!/usr/bin/env node
/* RETREAT FROM THE LINEUP, ALWAYS (COMBAT [retreat from the lineup], rule 253, Paolo 10/26: 'in the lineup menu, that's super
   important, I should be able to retreat from the lineup, before the enemy, no matter what, end of story... if I'm seeing the AUTO
   odds and it's looking red, or even without the AUTO menu, I should be able to retreat immediately... not like I take the first
   turn if I press retreat'; records/BOHEMIA_PAOLO_RETREAT_FROM_THE_LINEUP_ALWAYS_10_26_26.md).
   MEASURED BEFORE: retreat() returned false while the lineup stood (S.deploy), and the RETREAT button was dark there, so he had to
   press FIGHT and run for the edge through their turns and their free hits.
   Legs, on his phone (390 x 844 at 3x, touch) and his computer (1440 x 900):
   L1 THE LINEUP, EVERY KIND (the real fight page, the five road factions, AUTO off; one of them a fight the odds read red): RETREAT
      is lit on the lineup and ONE real press ends the fight at once, WITHDREW: no man of either side took a turn, moved or was
      struck; every man where he stood, his hit points and armour as he came in; the end card says so; the message home says
      withdrew, its crew rows as they came in, no spoils;
   L2 THE DEMO, THE ONE DOOR, A JOB HELD: a road fight through the game's own door with a job held; RETREAT on the lineup by a real
      press: back on the map, no spoils screen, never 'back to your last save', the job still held, the company, the condition, the
      supplies and the stash exactly as before;
   L3 nothing threw.
   Run: node gates/retreat_from_the_lineup_gate.js [--profile phone_portrait|computer] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== RETREAT FROM THE LINEUP GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const argv = process.argv, ONLY = argv.indexOf('--profile') > 0 ? argv[argv.indexOf('--profile') + 1] : null;
const ARM = "window.__fe=[];addEventListener('error',function(e){try{window.__fe.push(String(e.message||e).slice(0,160))}catch(_){}});";
const FACTIONS = ['brigands', 'beasts', 'kids', 'machines', 'heavies'];
async function waitFor(page, fn, ms) { const s = Date.now(); while (Date.now() - s < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(150); } return false; }
async function press(page, profile, p) { if (profile === 'computer') await page.mouse.click(p.x, p.y); else await page.touchscreen.tap(p.x, p.y); }
const boxOf = (f, sel) => f.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, lit: !e.disabled, txt: e.textContent }; }, sel);
const snapOf = f => f.evaluate(() => FIGHT.S.units.map(v => v.id + '@' + v.x + ',' + v.y + ' ' + Math.round(v.hp) + '/' + Math.round(v.armH) + '/' + Math.round(v.armB) + (v.dead ? 'X' : '') + (v.down ? 'D' : '')).join(' '));

(async () => {
  const errs = [];
  for (const profile of ['phone_portrait', 'computer']) {
    if (ONLY && ONLY !== profile) continue;
    const tag = profile === 'computer' ? 'COMPUTER' : 'PHONE';
    /* L1: the real fight page, every road faction, AUTO off, the lineup up; the last one a fight he cannot win (the odds red) */
    {
      const rows = [], bad = [];
      for (let k = 0; k < FACTIONS.length + 1; k++) {
        const red = k === FACTIONS.length, fac = red ? 'heavies' : FACTIONS[k];
        const o = { seed: 300 + k, company: [{}, {}, {}], cap: 3, party: { count: red ? 9 : 3 + (k % 3), faction: fac, days: red ? 80 : 10 }, deploy: true, teach: false };
        let d = null;
        try {
          d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: ARM + 'window.FIGHT_OPTS=' + JSON.stringify(o) + ';' });
          const p = d.page;
          await p.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.deploy && window.FIGHT_UI && FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
          if (red) await waitFor(p, () => p.evaluate(() => typeof oddsValue === 'function' && oddsValue() !== null), 8000);
          const odds = await p.evaluate(() => (typeof oddsValue === 'function' ? oddsValue() : null));
          await p.evaluate(() => { window.__home = null; const pm = window.parent.postMessage.bind(window.parent); hud(); });
          const before = await snapOf(p), log0 = await p.evaluate(() => FIGHT.S.log.length), b = await boxOf(p, '#bflee');
          const t0 = Date.now();
          if (b) await press(p, profile, b);
          await waitFor(p, () => p.evaluate(() => FIGHT.S.over && document.getElementById('over').style.display === 'flex'), 5000);
          const r = await p.evaluate((l0) => ({ over: FIGHT.S.over, res: FIGHT.S.result, acts: FIGHT.S.log.slice(l0).filter(e => ['step', 'attack', 'turn', 'end', 'reload', 'skill'].indexOf(e.t) >= 0).length,
            head: document.getElementById('oh').innerText, home: homeMessage(FIGHT.S.result) }), log0);
          const after = await snapOf(p), secs = (Date.now() - t0) / 1000;
          const home = r.home, rowsOk = home && home.result === 'withdrew' && home.withdrew === true && home.spoils === null && home.crew.every(c => !c.dead && !c.down && c.xpGained === 0);
          const ok = b && b.lit && /RETREAT/.test(b.txt) && r.over && r.res === 'withdrew' && r.acts === 0 && after === before && /PULLED BACK/.test(r.head) && rowsOk && secs < 3;
          rows.push(fac + (red ? '(red ' + (odds === null ? '?' : odds.toFixed(2)) + ')' : '') + ':' + (ok ? 'withdrew' : 'BAD') + ' ' + secs.toFixed(1) + 's');
          if (!ok) bad.push(fac + ' lit ' + (b && b.lit) + ' "' + (b && b.txt) + '" over ' + r.over + ' ' + r.res + ' acts ' + r.acts + ' same ' + (after === before) + ' head "' + r.head + '" home ' + JSON.stringify(home && { result: home.result, withdrew: home.withdrew, spoils: home.spoils }));
          if (red && !(odds !== null && odds < 0.5)) bad.push('the red fight read ' + odds);
          errs.push.apply(errs, (await p.evaluate(() => window.__fe || [])).map(e => tag + ' L1 ' + fac + ': ' + e));
        } catch (e) { bad.push(fac + ' ran: ' + String(e.message).slice(0, 120)); }
        finally { if (d) await d.close().catch(() => {}); }
      }
      leg(bad.length === 0, '*** L1 ' + tag + ': RETREAT ON THE LINEUP, EVERY KIND, ONE PRESS: WITHDREW BEFORE ANYONE MOVES *** (rule 253(a)(b))', rows.join(' ') + (bad.length ? ' | ' + bad.slice(0, 2).join('; ') : ''));
    }
    /* L2: the demo, the one door, a job held */
    {
      let d = null;
      try {
        d = await D.open({ file: 'BOHEMIA_DEMO.html', profile, engage: true, arm: ARM });
        const page = d.page, fr = d.fr;
        await page.waitForTimeout(2500);
        const keys = ['bohemia.company.v1', 'bohemia.condition.v1', 'bohemia.supplies.v1', 'bohemia.bag.v1'];
        const store = () => page.evaluate(k => k.map(x => { try { return localStorage.getItem(x); } catch (e) { return null; } }), keys);
        await fr.evaluate(() => { try { contactClear(); } catch (e) {} LOOP.held.push({ id: 'lineup-gate-job', title: 'the lineup gate\'s job', pay: 3 }); LOOP.fighting = 'lineup-gate-job';
          try { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); } catch (e) {} });
        let f = null;
        await waitFor(page, async () => { const h = await page.$('#fightFrame'); const c = h && await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && FIGHT.S.deploy && !!window.FIGHT_UI && FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil)) { f = c; return true; } return false; }, 90000);
        if (!f) throw new Error('the fight never stood on its lineup');
        const before = await store(), fb = await (await f.frameElement()).boundingBox(), b = await boxOf(f, '#bflee');
        await press(page, profile, { x: fb.x + b.x, y: fb.y + b.y });
        await waitFor(page, () => page.evaluate(() => !CITYFIGHT), 20000);
        await page.waitForTimeout(1500);
        const res = await f.evaluate(() => FIGHT.S.result).catch(() => 'gone');
        const map = await fr.evaluate(() => ({ held: LOOP.held.some(h => h.id === 'lineup-gate-job'), wentDown: !!window.__WENT_DOWN, home: window.__FIGHT_CAME_HOME || null }));
        const spoils = await page.evaluate(() => !!(window.SPOILS && SPOILS.frame)), after = await store(), back = await page.evaluate(() => !CITYFIGHT);
        const same = keys.filter((k, i) => before[i] !== after[i]);
        leg(back && !spoils && map.held && !map.wentDown && !!map.home && map.home.withdrew === true && same.length === 0,
          '*** L2 ' + tag + ': THE DEMO, A JOB HELD: RETREAT ON THE LINEUP TAKES HIM BACK TO THE MAP, NOTHING CHANGED, THE JOB STILL HIS *** (rule 253(b)(d))',
          'lit ' + b.lit + ', result ' + res + ', on the map ' + back + ', spoils ' + spoils + ', job held ' + map.held + ', last save asked ' + map.wentDown + ', home ' + JSON.stringify(map.home) + ', changed ' + (same.join(',') || 'nothing'));
        errs.push.apply(errs, (d.errs || []).map(e => tag + ' L2: ' + e));
      } catch (e) { leg(false, '  ' + tag + ' L2 ran', String(e.message).slice(0, 200)); }
      finally { if (d) await d.close().catch(() => {}); }
    }
  }
  leg(errs.length === 0, 'L3 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });

/* EVERY LEVEL WAITS GATE (RUN FOUR [every level waits for him], VAMILY rule 281, 10/26/26).
   PAOLO 10/26: 'is there a bug with levelling up, my character is level five and I was only able to level them up one time... if I sit
   on it and they keep levelling up and I haven't put stats in, I still have that many rounds to upgrade.'
   MEASURED, the live demo, before any change (the record has the runs): no level is lost on any path walked: two fights without the
   crew screen, a reload (the tab closed, the game reopened by CONTINUE) between them, the crew screen opened and closed between them,
   the crew screen opened from the loot screen: every time each level's rolls and perk point were waiting, and three raises spent them.
   What reads as a lost level is the ORIGIN: an origin's door hands its men their levels already spent (the Lone Wolf starts at level
   four with levels 2 to 4 taken for him, engine/bohemia_origin_start.js), so one level earned on top is 'level five, one level-up'.
   Nothing said so, and nothing on the loot screen said how many levels were waiting.
     W1 a fight that gives YOU two levels, LEAVE, the crew screen never opened: the loot screen says LEVEL UP and a plus with 2 waiting
     W2 the tab dies and the game comes back by CONTINUE: nothing kept is lost
     W3 a second fight, one level more: the loot screen says +3 waiting, and its button says SPEND YOUR 3 LEVELS
     W4 the crew screen from the map: level 5, three levels waiting, three more perk points than before
     W5 three raises through real taps (four stats each, RAISE THEM): the waiting count goes 3, 2, 1, 0 and only the picked stats rise
     phone and computer
   node gates/every_level_waits_gate.js */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== EVERY LEVEL WAITS GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  for (const prof of ['phone_portrait', 'computer']) {
    const name = prof === 'computer' ? 'COMPUTER' : 'PHONE', mob = prof !== 'computer';
    let d;
    try { d = await drive.open({ profile: prof, keepCards: true, engage: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
    catch (e) { ok(name + ' the demo boots [' + String(e.message).slice(0, 160) + ']', false); continue; }
    let p = d.page, fr = d.fr; const errs = []; p.on('pageerror', e => errs.push(e.message + ' @ ' + String(e.stack || '').split('\n').slice(1, 4).map(x => x.trim()).join(' < ')));
    const press = (loc) => mob ? loc.tap() : loc.click();
    try {
      await p.waitForTimeout(2500);
      /* YOU's level and xp as the game holds him before the first fight (the origin's door: newcrew, level 2) */
      const fight = async (seq, xp) => {
        await fr.evaluate((seq) => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: seq }); }, seq);
        let f = null;
        for (let i = 0; i < 200 && !f; i++) { const hh = await p.$('#fightFrame'); if (hh) { const c = await hh.contentFrame();
          if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
        if (!f) return null;
        const lv0 = await f.evaluate((xp) => { const S = FIGHT.S, m = S.units.find(u => u.side === 'you' && u.main); m.xpGained = (m.xpGained || 0) + xp;
          S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; }); S.over = true; S.result = 'won'; showOver('won'); return m.level; }, xp);
        const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
        for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await p.waitForTimeout(200);
        await p.waitForTimeout(400);
        const sp = await SF().evaluate(() => { const m = BohemiaSpoilsScreen.state.men.find(x => x.main), row = document.querySelector('#crew .man[data-man="' + m.name + '"]');
          return { from: m.from, to: m.to, up: m.up, waiting: m.waiting, plus: row && row.querySelector('.wait') ? row.querySelector('.wait').textContent : '', btn: row && row.querySelector('button.perk') ? row.querySelector('button.perk').textContent : '' }; });
        await press(p.frameLocator('#spoilsdoor iframe').locator('#leave'));
        for (let i = 0; i < 40; i++) { if (await p.evaluate(() => !CITYFIGHT && !document.getElementById('spoilsdoor'))) break; await p.waitForTimeout(200); }
        await p.waitForTimeout(2500);
        return { lv0, sp };
      };
      const kept = () => p.evaluate(() => ({ climb: localStorage.getItem('bohemia.climb.v1'), q: localStorage.getItem('bohemia.fight.after.v1') }));
      /* W1 */
      const a = await fight(301, 1300);
      ok('W1 ' + name + ': a fight gives YOU two levels and he leaves without the crew screen: the loot screen says LEVEL UP and +2 waiting',
        !!a && a.sp.up && a.sp.to - a.sp.from === 2 && a.sp.waiting === 2 && a.sp.plus === '+2' && /SPEND YOUR 2 LEVELS/.test(a.sp.btn), a ? JSON.stringify(a.sp) : 'no fight');
      /* W2 the tab dies, the game comes back by CONTINUE */
      const k0 = await kept();
      await p.goto('about:blank'); await p.waitForTimeout(400);
      d = await drive.open({ again: d, profile: prof, keepCards: true, engage: true }); p = d.page; fr = d.fr; p.on('pageerror', e => errs.push(e.message + ' @ ' + String(e.stack || '').split('\n').slice(1, 4).map(x => x.trim()).join(' < ')));
      await p.waitForTimeout(3000);
      const k1 = await kept();
      ok('W2 ' + name + ': the tab dies and the game comes back by CONTINUE: everything kept about his levels is still there', (d.title && d.title.via === 'continue') && k1.climb === k0.climb && k1.q === k0.q,
        'via ' + (d.title && d.title.via) + ', the queue ' + (JSON.parse(k1.q || '[]') || []).length + ' fights');
      /* W3 */
      const b = await fight(302, 600);
      ok('W3 ' + name + ': a second fight, one level more: the loot screen says +3 waiting and SPEND YOUR 3 LEVELS', !!b && b.sp.to === a.sp.to + 1 && b.sp.waiting === 3 && b.sp.plus === '+3' && /SPEND YOUR 3 LEVELS/.test(b.sp.btn),
        b ? JSON.stringify(b.sp) : 'no fight');
      /* W4 the crew screen from the map */
      for (const fx of p.frames()) { const hit = await fx.evaluate(() => { const c = document.querySelector('.crew[role=button]'); if (c && c.getBoundingClientRect().width > 0) { c.click(); return true; } return false; }).catch(() => false); if (hit) break; }
      let R = null; for (let i = 0; i < 80 && !R; i++) { R = p.frames().find(x => /ROSTER_SCREEN/.test(x.url())); if (R && !(await R.evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false))) R = null; if (!R) await p.waitForTimeout(250); }
      await p.waitForTimeout(800);
      if (!R) { ok('W4 ' + name + ': the crew screen from the map', false); }
      else {
        await R.evaluate(() => { const S = BohemiaRosterScreen.state; BohemiaRosterScreen.choose(S.crew.findIndex(m => m.main)); }); await p.waitForTimeout(400);
        const r0 = await R.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew.find(x => x.main); return { level: m.level, rolls: (m.rolls || []).length, points: m.points | 0, perks: (m.perks || []).length, head: (document.querySelector('#levelup b') || {}).textContent || '' }; });
        const pts0 = a.lv0 - 1;   /* the door's points for his door levels, before any perk was taken */
        ok('W4 ' + name + ': the crew screen from the map: level ' + r0.level + ', three levels waiting, three more perk points than the door gave',
          r0.level === b.sp.to && r0.rolls === 3 && r0.points + r0.perks === pts0 + 3 && /3 LEVELS WAITING/.test(r0.head), JSON.stringify(r0));
        /* W5 three raises through real taps */
        const left = [];
        let rose = true;
        for (let k = 0; k < 3; k++) {
          const before = await R.evaluate(() => Object.assign({}, BohemiaRosterScreen.state.crew.find(x => x.main).stats));
          const keys = await R.evaluate(() => [].map.call(document.querySelectorAll('#levelup [data-raise]'), x => x.dataset.raise));
          const pick = keys.slice(0, 4);
          for (const key of pick) { await press(R.locator('#levelup [data-raise="' + key + '"]').first()); await p.waitForTimeout(80); }
          await press(R.locator('#raise')); await p.waitForTimeout(350);
          const after = await R.evaluate(() => { const m = BohemiaRosterScreen.state.crew.find(x => x.main); return { st: Object.assign({}, m.stats), rolls: (m.rolls || []).length }; });
          left.push(after.rolls);
          const up = Object.keys(after.st).filter(s => after.st[s] > before[s]);
          if (!(up.length <= 4 && up.every(s => pick.indexOf(s) >= 0) && up.length >= 1)) rose = false;
          await R.evaluate(() => { try { BohemiaRosterScreen.choose(BohemiaRosterScreen.state.crew.findIndex(m => m.main)); } catch (_e) {} });   /* back to his levels, past the perk tab */
          await p.waitForTimeout(250);
        }
        ok('W5 ' + name + ': three raises through real taps: the waiting count goes 3, ' + left.join(', ') + ' and only the picked stats rise', left.join() === '2,1,0' && rose, left.join(' > '));
      }
      ok('    ' + name + ': nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
    } catch (e) { ok(name + ' ran to the end [' + String(e && e.message).slice(0, 200) + ']', false); }
    try { await d.close(); } catch (_e) {}
  }
  done();
})();

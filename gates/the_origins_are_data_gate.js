/* ==========================================================================
   THE ORIGINS ARE DATA  (RUN, 10/9/26, VAMILY [origins fallback], MODS rule 22)

   MODS 10/9 (records/BOHEMIA_MODS_WHAT_IS_DATA_AND_WHAT_IS_NOT_10_9_26.md): the start screen kept a fixed list of
   the same 15 origin ids and filled them from records/target/bb/origins.json by id, skipping any id not in the list,
   so an origin a modder adds was dropped.
   NOW: the file is the list; the fixed fifteen are only the offline fallback.

   LEGS, on the demo, a modder's origin added to the file before the page loads:
     A1 *** A MODDER'S ORIGIN IS ON THE DOOR *** (its own card, its men, its cap)
     A2 picking it builds its company and its start
     A3 the fight fields its men
     A4 Battle Brothers' fifteen are all still there
     A5 offline (the file unreadable) the door still offers the fallback fifteen
     A6 nothing threw
   node gates/the_origins_are_data_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE ORIGINS ARE DATA: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const MOD = { id: 'mod_test', bb: '', name: 'THE MODDERS', line: 'A crew a modder wrote in.', draft: true, difficulty: 'Medium', d: 2,
  men: [{ background: 'thief', level: 2 }, { background: 'monk', level: null }], crowns: { high: 500, medium: 400, low: 300 },
  batteries: { full: 50, thin: 40, bare: 30 }, roster_cap: 20, field_cap: 12, pay: 0, rules: [], source: 'a mod' };
/* every frame: the game's own fetch of the origins file gets the modder's row appended (A1-A4), or fails (A5) */
const ARM = (mode) => `(function(){ var F = window.fetch; window.fetch = function(u){ var s = String(u && u.url || u);
  if (/origins\\.json/.test(s)) { ${mode === 'fail' ? "return Promise.reject(new Error('offline'));" : "return F.apply(this, arguments).then(function(r){ return r.json(); }).then(function(j){ j.origins.push(" + JSON.stringify(MOD) + "); return new Response(JSON.stringify(j), { headers: { 'Content-Type': 'application/json' } }); });"} }
  return F.apply(this, arguments); }; })();`;

(async () => {
  let d, pre = {};
  try {
    d = await drive.open({ keepCards: true, arm: ARM('mod'), beforeTap: async (page) => {
      await throughTheTitle(page);
      for (let i = 0; i < 60; i++) { if (await page.evaluate(() => !!(window.BOH_START && BOH_START.data && BOH_START.data()))) break; await page.waitForTimeout(250); }
      await page.waitForTimeout(400);
      pre.cards = await page.evaluate(() => [...document.querySelectorAll('#newco .org')].map(b => ({ id: b.dataset.v, text: b.textContent.replace(/\s+/g, ' ') })));
      const r = await page.evaluate(() => { const e = document.querySelector('#newco [data-k=origin][data-v=mod_test]'); if (!e) return null; e.scrollIntoView({ block: 'center', inline: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
      if (r) { await page.touchscreen.tap(r.x, r.y); await page.waitForTimeout(400); }
      pre.picks = await page.evaluate(() => BOH_START.picks());
    } });
  } catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  try {
    const card = pre.cards.find(c => c.id === 'mod_test');
    ok('*** A1 A MODDER\'S ORIGIN IS ON THE DOOR *** (' + (card ? '"' + card.text.slice(0, 90) + '"' : 'not there') + ')', !!card && /THE MODDERS/.test(card.text) && /2 MEN/.test(card.text) && /12 IN A FIGHT/.test(card.text));
    const p = pre.picks;
    ok('A2 picking it builds its company and its start (' + p.originName + ': ' + (p.company ? p.company.map(m => m.background + ':' + (m.level || '')).join(',') : 'none') + ', start ' + p.start + ', cap ' + p.cap + ')',
      p.origin === 'mod_test' && !!p.company && p.company.length === 2 && p.company[0].background === 'thief' && p.company[0].level === 2 && p.start === MOD.batteries.thin && p.cap === 12);
    await d.page.waitForTimeout(2500);
    await d.fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 3 }); });
    let f = null; for (let i = 0; i < 150 && !f; i++) { const h = await d.page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await d.page.waitForTimeout(200); }
    const you = f ? await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => u.kind + ':' + u.level)) : null;
    ok('A3 the fight fields its men (' + (you ? you.join(' ') : 'no fight') + ')', !!you && you.length === 2 && you[0] === 'thief:2' && /^monk:/.test(you[1]));
    const ids = pre.cards.map(c => c.id);
    const fifteen = ['rebuild', 'newcrew', 'south', 'truck', 'watch', 'scav', 'promise', 'desert', 'raid', 'lab', 'faith', 'debt', 'hunt', 'pit', 'wolf'];
    ok('A4 Battle Brothers\' fifteen are all still there (' + fifteen.filter(x => ids.indexOf(x) >= 0).length + ' of 15, ' + ids.length + ' cards)', fifteen.every(x => ids.indexOf(x) >= 0) && ids.length === 16);
    ok('A6 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) { ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();

  /* A5: offline */
  let d2, off = null;
  try {
    d2 = await drive.open({ keepCards: true, arm: ARM('fail'), beforeTap: async (page) => {
      await throughTheTitle(page); await page.waitForTimeout(2500);
      off = await page.evaluate(() => ({ cards: document.querySelectorAll('#newco .org').length, data: !!(BOH_START.data && BOH_START.data()), start: BOH_START.picks().start }));
    } });
    ok('A5 offline the door still offers the fallback fifteen (' + JSON.stringify(off) + ')', !!off && off.cards === 15 && !off.data && off.start > 0);
  } catch (e) { ok('A5 the offline door boots [' + String(e.message).slice(0, 160) + ']', false); }
  if (d2) await d2.close();
  done();
})();

/* TAKE THE NEXT PART — the gate for [take the next part] (10/10/26, LIFE + CITY; the ledger is FACTIONS')
 * Rule 43 (what you hold grows by taking). On THE ALPHA through the shared driver, real touches in the settlement frame:
 *   A  at a place you do not hold, BUILD says it is not your ground and offers ONE thing: Take it.
 *   B  pressing it closes the screen and opens the fight at their gate, and the fight builds its ground.
 *   C  a win makes the place yours in FACTIONS' ledger, and you can build there.
 *   D  the next time you open it, the screen is handed `held` and shows the build list, not Take it.
 *   E  a loss is a reload (Paolo 7/26): nothing written, and Take it again goes back to the same raid.
 * Run:  node gates/take_the_next_part_gate.js
 */
'use strict';
const path = require('path');
const D = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0, ON_HOLD = null;
const ok = (n, c, d) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (d ? '  [' + d + ']' : '')); };
async function openPlace(d, pick) {
  const name = await d.fr.evaluate((pick) => { const bs = ctBases();
    const n = pick || Object.keys(bs).find(k => !lotIsMine(k) && turfSeats().some(s => s.faction === k));
    const t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; }, pick || null);
  let f = null, w = null, box = null;
  for (let k = 0; k < 40 && !(w && box); k++) { await d.page.waitForTimeout(500);
    for (const fr of d.page.frames().filter(fr => /SETTLEMENT/.test(fr.url()))) {
      const ww = await fr.evaluate(() => { try { return BohemiaSettlement.where('build'); } catch (e) { return null; } }).catch(() => null);
      const bb = ww && await (await fr.frameElement()).boundingBox();
      if (ww && bb && bb.width > 0) { f = fr; w = ww; box = bb; break; } } }
  if (!w) throw new Error('the settlement screen never showed BUILD for ' + name);
  const held = await f.evaluate(() => window.BUILD_TAKE_ON);
  if (!pick) { ON_HOLD = held === false; await f.evaluate(() => { window.BUILD_TAKE_ON = true; }); }   /* rule 88: off in the game, on for the gate */
  await d.page.touchscreen.tap(box.x + w.x, box.y + w.y); await d.page.waitForTimeout(800);
  const sheet = await f.evaluate(() => ({ say: (document.querySelector('#sbody .say p') || {}).textContent || '', acts: [...document.querySelectorAll('#sbody .act')].map(a => a.querySelector('span').textContent) }));
  return { name, f, sheet };
}
async function pressTake(d, f) { const b = (await f.$$('#sbody .act'))[0]; const bb = await b.boundingBox(); await d.page.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); }
async function fightReady(d) { let sh = {}; for (let k = 0; k < 60; k++) { await d.page.waitForTimeout(500);
  sh = await d.pageEval(() => { try { const l = NF.frame.contentDocument.getElementById('load'); return { open: true, ready: l.style.display === 'none', load: l.textContent }; } catch (e) { return { open: false }; } }); if (sh.ready) break; } return sh; }
(async () => {
  for (const win of [true, false]) {
    const d = await D.open({ alpha: true });
    try {
      await d.toMap();
      const p = await openPlace(d);
      if (win) ok('HOLD while rule 88 stands, Take it is off in the game (the gate switches it on)', ON_HOLD === true);
      if (win) ok('A at a place you do not hold, BUILD offers one thing: Take it', /not our ground/i.test(p.sheet.say) && p.sheet.acts.join() === 'Take it', p.name + ': ' + p.sheet.acts.join());
      await pressTake(d, p.f);
      const sh = await fightReady(d);
      ok('B *** the fight opens at their gate and builds its ground *** (' + (win ? 'win' : 'loss') + ' run)', sh.open && sh.ready, sh.ready ? 'ready' : sh.load);
      /* the fight ends the way the game ends it: the shell takes him home to the map and tells the map */
      await d.pageEval((win) => cityFightHome(win ? { victory: true, result: 'win', alive: 0 } : { victory: false, result: 'loss', alive: 3 }), win);
      const e = await d.fr.evaluate((win) => new Promise(r => {
        setTimeout(() => { const H = BohemiaHomeBases, rec = hbRec(), n = RAID_TAKING || (rec.raids || []).slice(-1)[0].base;
          const P = purseGet(); BohemiaPurse.credit(P, 'electricity', 1, 'gate', 'gate', DAY.day);
          const name = (rec.raids || []).slice(-1)[0].base;
          const st = BohemiaLotBuild.start(lotBookFor(name), P, { x: 3, y: 0 }, 'wall', DAY.day, lotHoldFor(name));
          r({ name: name, mine: lotIsMine(name), build: st.ok, why: st.why, open: H.raidsOpen(rec).filter(x => x.base === name && x.by === H.YOU).length }); }, 600); }), win);
      if (win) {
        ok('C *** a win makes it yours, and you can build there ***', e.mine && e.build, e.name + ' mine=' + e.mine + ' build=' + (e.build || e.why));
        await d.fr.evaluate(() => { try { loopClose(); } catch (_e) {} }); await d.page.waitForTimeout(1500);
        const again = await openPlace(d, e.name);
        ok('D the next time, the screen shows the build list, not Take it', again.sheet.acts.length > 1 && again.sheet.acts.indexOf('Take it') < 0, again.sheet.acts.slice(0, 3).join(', '));
      } else {
        ok('E a loss is a reload: not yours, nothing written, our raid still at their gate', !e.mine && e.open === 1, 'open ' + e.open);
        await d.fr.evaluate(() => new Promise(r => { const t0 = Date.now(); (function w(){ if (!FZOOMING || Date.now() - t0 > 8000) r(); else setTimeout(w, 200); })(); })); await d.page.waitForTimeout(1500);
        const re = await d.fr.evaluate((n) => raidTake(n), e.name);
        ok('E Take it again goes back to the same raid', re.applied === true, JSON.stringify(re));
      }
      ok('nothing threw (' + (win ? 'win' : 'loss') + ' run)', d.errs.length === 0, d.errs.join(' | ').slice(0, 200));
    } finally { await d.close(); }
  }
  console.log('\nTAKE THE NEXT PART GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

/* ==========================================================================
   DROP A JOB RIGHT IN THE TOWN  (RUN TWO, 10/25/26, VAMILY [drop a job right in the town], rule 197)

   PAOLO 10/25: "to cancel a quest I have to go into the world map, click on the phone, and then go back into the city to pick
   up another quest... this is dog shit." MEASURED: the only drop was the phone, and the phone lives on the map.
   NOW (__DROP_A_JOB_RIGHT_IN_THE_TOWN__): the town's board lists every job he is on at the top with DROP and its cost; a full
   board's new job asks once and swaps in the same tap; both are the phone's own drop (slices/bohemia_job_kinds.js).

   LEGS, on the demo, through Church's own door, real taps, the settlement screen never closing:
     D1 the board shows the jobs he is on at the top, each with DROP and its cost in plain words (the phone's dropCost)
     D2 *** THE DROP IN TWO TAPS FROM THE BOARD *** (DROP, then yes): the job is gone from the map, the town's standing takes the
        phone's cost once, the board says the phone's own line; no map screen between
     D3 *** THE SWAP *** with the board full: a person (1), 'Drop it and take this one' (2): one job out, the new one in, the cost
        once, the question said first
     D4 the computer: the drop in two taps from the board
     D5 nothing threw
   node gates/drop_a_job_in_the_town_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('DROP A JOB RIGHT IN THE TOWN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function run(profile, legs) {
  const d = await drive.open({ profile, keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const P = d.page, fr = d.fr, mouse = profile === 'computer';
  const tapAt = async (x, y) => { if (mouse) await P.mouse.click(x, y); else await P.touchscreen.tap(x, y); };
  try {
    await P.waitForTimeout(3000);
    await fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 400), 'the gate'); const bs = ctBases(), names = Object.keys(bs), t0 = names.find(k => /church/i.test(k)) || names[0], t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
      for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    if (!sf) { ok(profile + ': a town through the map\'s door', false); return d; }
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
    const box = await (await sf.frameElement()).boundingBox();
    const tapSel = async (sel) => { const r = await sf.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel); if (!r) return false; await tapAt(box.x + r.x, box.y + r.y); await P.waitForTimeout(600); return true; };
    const openBoard = async () => { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(300);
      for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board' && !!document.querySelector('#sbody .acts'))) return true; const w = await sf.evaluate(() => BohemiaSettlement.where('board')); if (w) await tapAt(box.x + w.x, box.y + w.y); await P.waitForTimeout(800); } return false; };
    const held = () => fr.evaluate(() => LOOP.held.map(h => h.id));
    const mapShown = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block'));
    /* take jobs until the board is full, by real taps (a person, Take it) */
    const fill = async () => { for (let n = 0; n < 4; n++) { const h = await held(), slots = await sf.evaluate(() => 2); if (h.length >= slots) break; await openBoard(); if (!(await tapSel('#sbody .act.client:not([disabled])'))) break; await tapSel('#sbody .acts .act:not([disabled])'); await P.waitForTimeout(500); } return held(); };
    const h0 = await fill();
    await openBoard();
    const d1 = await sf.evaluate(() => [...document.querySelectorAll('#sbody .act.held')].map(b => ({ id: b.dataset.held, text: b.textContent })));
    const costs = await fr.evaluate((ids) => ids.map(id => BohemiaJobKinds.dropCost(id)), h0);
    if (legs.indexOf('D1') >= 0) ok('D1 ' + profile + ': the board shows the ' + h0.length + ' jobs he is on at the top, each with DROP and its cost (' + (d1[0] ? d1[0].text.replace(/\s+/g, ' ').slice(0, 110) : 'none') + ')',
      h0.length >= 1 && d1.length === h0.length && d1.every((x, i) => /DROP/.test(x.text) && x.text.indexOf(String(costs[i].place).toUpperCase() + ' thinks less of you: ' + Math.round(costs[i].before) + ' to ' + Math.round(costs[i].after)) >= 0));
    /* D2: DROP, then yes */
    const q0 = await fr.evaluate(() => BohemiaJobKinds.settledPeek().length), target = d1[0] && d1[0].id, c0 = costs[0];
    let taps = 0, mapBetween = false;
    if (await tapSel('#sbody .act.held')) taps++; mapBetween = mapBetween || !(await mapShown());
    if (await tapSel('#sbody .acts .act[data-drop=yes]')) taps++; mapBetween = mapBetween || !(await mapShown());
    const after = await held(), q1 = await fr.evaluate(() => BohemiaJobKinds.settledPeek()), said = await sf.evaluate(() => document.getElementById('sbody').innerText);
    const added = q1.slice(q0);
    ok('*** D2 ' + profile.toUpperCase() + ': THE DROP IN TWO TAPS FROM THE BOARD *** (' + taps + ' taps; ' + h0.length + ' -> ' + after.length + ' jobs; the town takes ' + (c0 && c0.delta) + ' once; "' + said.replace(/\s+/g, ' ').slice(0, 120) + '")',
      taps === 2 && after.length === h0.length - 1 && after.indexOf(target) < 0 && added.length === 1 && added[0].act === 'cancel_contract' && added[0].place === c0.place && /Dropped: /.test(said) && !mapBetween);
    if (legs.indexOf('D3') >= 0) {
      const h2 = await fill();
      await openBoard();
      const q2 = await fr.evaluate(() => BohemiaJobKinds.settledPeek().length);
      let t3 = 0; if (await tapSel('#sbody .act.client')) t3++;
      const ask = await sf.evaluate(() => ({ q: (document.querySelector('#sbody .swap') || {}).textContent || '', id: (document.querySelector('#sbody [data-swap]') || {}).dataset ? document.querySelector('#sbody [data-swap]').dataset.swap : null, title: (document.querySelector('#sbody .say .nm') || {}).textContent }));
      if (await tapSel('#sbody [data-swap]')) t3++;
      const h3 = await held(), q3 = await fr.evaluate(() => BohemiaJobKinds.settledPeek());
      ok('*** D3 ' + profile.toUpperCase() + ': THE SWAP *** (a full board of ' + h2.length + '; ' + t3 + ' taps; asked: "' + ask.q.slice(0, 120) + '")',
        h2.length >= 2 && t3 === 2 && /Drop it and take this one\?/.test(ask.q) && h3.length === h2.length && h3.indexOf(ask.id) < 0 && h3.filter(x => h2.indexOf(x) < 0).length === 1 && q3.length - q2 === 1 && !!(await mapShown()), JSON.stringify({ before: h2, after: h3 }));
    }
    if (process.env.BOHEMIA_SHOT_DIR) { await openBoard(); await P.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'drop_in_town_' + profile + '.png') }); }
  } catch (e) { ok(profile + ' legs ran [' + String(e.message).slice(0, 200) + ']', false); }
  return d;
}

(async () => {
  let d = await run('phone_portrait', ['D1', 'D2', 'D3']);
  ok('D5a nothing threw on the phone', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  d = await run('computer', ['D2']);
  ok('D5b nothing threw on the computer', d.errs.length === 0, d.errs.slice(0, 2).join(' | ')); await d.close();
  done();
})();

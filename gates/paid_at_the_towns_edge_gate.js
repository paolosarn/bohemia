/* ==========================================================================
   PAID AT THE TOWN'S EDGE  (WORLD [paid at the town's edge], 10/26/26, rule 275(a)(d))

   PAOLO 10/26: 'I have to double click to enter the town for a go-back-and-get-paid... as long as I get in the territory of the
   town I should get paid, I don't wanna have to enter the settlement mode.'

   THE DEMO, his phone (JOB_PROFILE=computer for his computer), the board's own 'Take it', the map's own travel:
     E1  a recover job picked up; walking PAST the client's town (a walk whose road crosses a tile of its edge and ends beyond
         it): paid on that step, the batteries on the bar with their sound (the bar's count-up, SOUNDS' counter and drop,
         BOHEMIA_COUNT_UP), and the town's screen never opened
     E2  another, walked to the town's edge: paid on the step that reaches it, before any screen
     E3  nothing paid twice, nothing threw
   node gates/paid_at_the_towns_edge_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const PROFILE = process.env.JOB_PROFILE || 'phone_portrait';

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nPAID AT THE TOWN\'S EDGE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE, engage: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(250); } return false; };
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
  const leave = async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(600); };
  const unpause = () => fr.evaluate(() => { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); } catch (e) {} });
  const go = async (x, y) => { await unpause(); await fr.evaluate(([x, y]) => { travelStop(); travelTo(0, 0, [x, y]); }, [x, y]); };
  const toTown = async () => {
    const t = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; }
      return best ? Object.assign(best, { g: townDoor(best.x, best.y) }) : null; });
    if (!t) return null;
    for (let k = 0; k < 3 && !(await settleOpen()); k++) { await go(t.g[0], t.g[1]); await waitFor(settleOpen, 60000); }
    await page.waitForTimeout(800);
    return (await settleOpen()) ? t : null;
  };
  const take = async (id) => {
    const h = await fr.$('#settleFrame'); const sf = h ? await h.contentFrame() : null; if (!sf) return null;
    await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 15000 }).catch(() => {});
    const t = await sf.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; if (!o) return null;
      const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
      window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); return o.title; }, id);
    await page.waitForTimeout(900);
    return t;
  };
  const job = (id) => fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; return j ? JSON.parse(JSON.stringify(j)) : null; }, id);
  const paidOf = (id) => fr.evaluate((id) => (window.__JOB_PAID || []).filter(p => p.id === id), id);
  /* the checker stands him beside the thing (its own setting, rule 192(c)); the pickup walk that follows is his */
  const pickUp = async (id) => {
    const j = await job(id); if (!j) return false;
    await fr.evaluate(([x, y]) => { for (let k = 2; k <= 5; k++) for (const [a, b] of [[k, 0], [-k, 0], [0, k], [0, -k]]) { const cx = x + a, cy = y + b;
      if (cityWalkable(cx, cy) && cityRoute(cx, cy, x, y)) { travelStop(); city.x = cx; city.y = cy; try { camHold(); } catch (e) {} render(); return; } } }, [j.spot.x, j.spot.y]);
    await go(j.spot.x, j.spot.y); await waitFor(() => fr.evaluate(() => !TRAVEL), 40000); await page.waitForTimeout(500);
    const j2 = await job(id); return !!j2 && j2.stage === 'back';
  };
  /* watch the town's screen from now: did it open at any moment? */
  const watchOpen = () => fr.evaluate(() => { window.__EDGE_OPENED = false; clearInterval(window.__EDGE_T); window.__EDGE_T = setInterval(() => { if (LOOP.frame && LOOP.frame.style.display === 'block') window.__EDGE_OPENED = true; }, 50); });

  try {
    await page.waitForTimeout(2500);
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 40000 }).catch(() => {});
    await fr.evaluate(() => { localStorage.setItem('bohemia.fight.met.v1', '3'); });
    const t0 = await toTown();
    if (!t0) { ok('a town opens', false); await d.close(); return done(); }
    await take('qd-ap09'); await take('qd-s08'); await leave();

    /* E1: past the town */
    const up1 = await pickUp('qd-ap09');
    const plan = await fr.evaluate(() => {
      const j = LOOP.held.filter(h => h.id === 'qd-ap09')[0]; if (!j) return null;
      const C = j.fromAt, client = j.from, mine = (x, y) => { const t = loopTownAt(x, y, 1) || (typeof townAtDoor === 'function' ? townAtDoor(x, y) : null); return !!(t && t.name === client); };
      let best = null;
      for (let r = 4; r <= 9 && !best; r++) for (let a = -r; a <= r && !best; a++) for (const [x, y] of [[C.x + a, C.y - r], [C.x + a, C.y + r], [C.x - r, C.y + a], [C.x + r, C.y + a]]) {
        if (!cityWalkable(x, y) || mine(x, y)) continue; const R = cityRoute(city.x, city.y, x, y); if (!R) continue;
        const hit = R.findIndex(c => mine(c[0], c[1])); if (hit > 0 && hit < R.length - 2) { best = { to: [x, y], edge: R[hit], steps: R.length }; break; } }
      return best; });
    let e1 = null;
    if (up1 && plan) {
      const b0 = await fr.evaluate(() => loopBats());
      const m0 = await fr.evaluate(() => performance.now());
      await watchOpen(); await go(plan.to[0], plan.to[1]);
      await waitFor(() => fr.evaluate(() => !TRAVEL), 90000); await page.waitForTimeout(1200);
      const P = await paidOf('qd-ap09');
      e1 = await fr.evaluate(() => ({ opened: !!window.__EDGE_OPENED, edge: window.__JOB_EDGE_PAY || null, at: [city.x, city.y], bats: loopBats() }));
      e1.b0 = b0; e1.paid = P.map(p => p.paid); e1.held = !!(await job('qd-ap09'));
      await page.waitForTimeout(3500);
      e1.sound = await fr.evaluate((m0) => (window.__MOMENTS || []).filter(m => m.at >= m0 && !m.down && (m.kind === 'count_tick' || m.kind === 'count_land')).length, m0);
    }
    ok('E1 walked past the client\'s town: paid on the step over its edge, the batteries on the bar with their sound, the town\'s screen never opened',
      !!e1 && e1.paid.length === 1 && e1.paid[0] > 0 && !e1.held && !e1.opened && !!e1.edge && e1.edge.id === 'qd-ap09' && e1.bats >= e1.b0 + e1.paid[0] - 40 && e1.sound > 0,
      e1 ? JSON.stringify(Object.assign({ plan: plan }, e1)) : 'picked up ' + up1 + ', plan ' + JSON.stringify(plan));

    /* E2: to the town's edge */
    const up2 = await pickUp('qd-s08');
    let e2 = null;
    if (up2) {
      await fr.evaluate(() => { window.__JOB_EDGE_PAY = null; window.__PAID_T = null; window.addEventListener('bohemia-job-paid', () => { window.__PAID_T = Date.now(); }, { once: true }); });
      const tg = await fr.evaluate(() => { const j = LOOP.held.filter(h => h.id === 'qd-s08')[0]; return j ? [j.target.x, j.target.y] : null; });
      await watchOpen();
      await fr.evaluate(() => { window.__OPEN_T = null; clearInterval(window.__EDGE_T2); window.__EDGE_T2 = setInterval(() => { if (!window.__OPEN_T && LOOP.frame && LOOP.frame.style.display === 'block') window.__OPEN_T = Date.now(); }, 20); });
      await go(tg[0], tg[1]);
      await waitFor(() => fr.evaluate(() => !TRAVEL), 90000); await page.waitForTimeout(1500);
      e2 = await fr.evaluate(() => ({ edge: window.__JOB_EDGE_PAY || null, paidT: window.__PAID_T, openT: window.__OPEN_T }));
      e2.paid = (await paidOf('qd-s08')).map(p => p.paid);
      if (await settleOpen()) await leave();
    }
    ok('E2 walked to the client\'s town: paid on the step that reaches its edge, before any screen', !!e2 && e2.paid.length === 1 && !!e2.edge && e2.edge.id === 'qd-s08' && !!e2.paidT && (!e2.openT || e2.paidT <= e2.openT),
      e2 ? JSON.stringify(e2) : 'picked up ' + up2);
    const all = await fr.evaluate(() => (window.__JOB_PAID || []).map(p => p.id));
    ok('E3 nothing paid twice, nothing threw', all.filter(x => x === 'qd-ap09').length <= 1 && all.filter(x => x === 'qd-s08').length <= 1 && errs.length === 0, all.join(',') + ' ' + errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the gate ran [' + String(e && e.stack || e).slice(0, 300) + ']', false); }
  await d.close();
  done();
})();

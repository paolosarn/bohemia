/* ==========================================================================
   A JOB'S TIME COUNTS THE WAY BACK  (WORLD [a job's time counts the way back], 10/26/26, rule 222)

   PAOLO 10/26: 'for the timing of quests and how long they take, you have to include the time it takes to get back, if you need to
   get back; if you don't need to get back it doesn't count, but if you need to go back to the town to get paid or finish the
   results, then yes... when you make the calculator for the jobs.'
   THE LIVE DEMO (WAYBACK_PROFILE=phone_portrait for the phone), his computer's screen:
     B1  100 rolled jobs (the valley's boards, each read standing at its town): a job paid in its town shows there AND back, a job
         paid where it ends shows only there; the shown time equals the map's own road and clock for those legs (counted here step
         by step on cityRoute and cityStepMins at the job's pace, never through the job file's own sums), within the clock's rounding
     B2  the words say which, his way: 'there and back' or 'paid there', on the offer and on the phone's card
     B3  the town's board row's time is the same total, and says ROUND TRIP when he comes back
     B4  the danger counts the road both ways: a back-paid job's road fight is read on the whole trip's hours
     B5  one job walked on the map's own clock, out to its place and back to the town: the clock moved what the card said
     B6  nothing threw
   node gates/a_jobs_time_counts_the_way_back_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const PROFILE = process.env.WAYBACK_PROFILE || 'computer';
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nA JOB\'S TIME COUNTS THE WAY BACK: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE, engage: false }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 40000 }).catch(() => {});
    await page.waitForTimeout(1500);
    /* B1, B2: standing at each town in turn (a checker puts him at the gate and back; nothing walks), every job its board offers */
    const R = await fr.evaluate(() => {
      const BACK = { 'find-place': 1, 'find-person': 1, 'hunt-kind': 1, 'recover-return': 1, 'patrol': 1 };
      const at0 = [city.x, city.y], bs = ctBases() || {}, names = Object.keys(bs).sort(), out = [];
      /* the map's own road and clock, counted here step by step */
      const road = (ax, ay, bx, by, mult) => { if (ax === bx && ay === by) return 0; const p = cityRoute(ax, ay, bx, by); if (!p) return null; let m = 0; for (let i = 1; i < p.length; i++) m += cityStepMins(p[i][0], p[i][1]); return m / (BohemiaJobKinds.pace() || 1) * (mult || 1); };
      for (let w = 0; w < 8 && out.length < 100; w++) for (let i = 0; i < names.length && out.length < 100; i++) {
        const n = names[(i + w * 3) % names.length], b = bs[n], door = townDoor(b.x, b.y) || [b.x, b.y];
        let tier = 'camp'; try { tier = mapTierOf(n) || 'camp'; } catch (e) {}
        const list = BohemiaBoardShelf.pick({ name: n, tier: tier }, 1 + 3 * w, { traits: [], held: [], places: null }) || [];
        city.x = door[0]; city.y = door[1];
        list.forEach(o => {
          if (out.length >= 100 || out.some(x => x.id === o.id && x.place === n)) return;
          const T = BohemiaJobKinds.trip(o, n); if (!T || !T.job || T.job.plays === 'hold-defend') return;
          const J = T.job, kind = BohemiaJobKinds.kindOf(o), K = (BohemiaJobKinds.data().kinds || {})[kind] || {}, mult = kind === 'haul-caravan' && K.pace ? K.pace : 1;
          let mine = null;
          if (J.exact && J.at && J.at.length) {   /* the legs out, at the job's pace on the first, and home to this town's gate when back */
            let sx = city.x, sy = city.y, m = 0, okr = true;
            J.at.forEach((p, k) => { const r = road(sx, sy, p[0], p[1], k === 0 ? mult : 1); if (r == null) okr = false; else m += r; sx = p[0]; sy = p[1]; });
            if (J.back) { const r = road(sx, sy, door[0], door[1], 1); if (r == null) okr = false; else m += r; }
            mine = okr ? m : null;
          }
          out.push({ id: o.id, place: n, kind: kind, back: !!J.back, should: !!BACK[kind], exact: !!J.exact, shown: J.exact ? J.total : J.totalHi, out: J.exact ? J.mins : J.minsHi, mine: mine,
            words: T.words, short: T.short });
        });
      }
      city.x = at0[0]; city.y = at0[1];
      return out;
    });
    const exact = R.filter(r => r.exact && r.mine != null);
    const timeOk = exact.every(r => Math.abs(r.shown - r.mine) <= 1);
    const backOk = R.every(r => r.back === r.should) && R.filter(r => r.back).every(r => r.shown > r.out) && R.filter(r => !r.back).every(r => Math.abs(r.shown - r.out) < 0.01);
    ok('B1 ' + R.length + ' rolled jobs: paid in town = there and back, paid away = there; the time is the map\'s own road and clock for those legs', R.length >= 90 && backOk && timeOk && exact.length >= 60,
      R.filter(r => r.back).length + ' back, ' + R.filter(r => !r.back).length + ' paid there; ' + exact.length + ' exact, worst gap ' + (exact.length ? Math.max.apply(null, exact.map(r => Math.abs(r.shown - r.mine))).toFixed(2) : '-') + ' min; e.g. ' +
      R.filter(r => r.back).slice(0, 1).map(r => r.id + ' out ' + Math.round(r.out) + ' + back = ' + Math.round(r.shown) + ' min').join(''));
    const wordsOk = R.every(r => r.back ? /there and back/.test(r.words) && /THERE AND BACK/.test(r.short) : /paid there/.test(r.words) && /PAID THERE/.test(r.short));
    ok('B2 the words say which, his way: \'there and back\' or \'paid there\', on the offer and the phone\'s card', wordsOk,
      [R.filter(r => r.back)[0], R.filter(r => !r.back)[0]].filter(Boolean).map(r => '"' + r.words + '" / "' + r.short + '"').join('  |  '));
    /* B3: the town's board row */
    const t = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
    for (let k = 0; k < 4 && !(await settleOpen()); k++) { await fr.evaluate((t) => { travelStop(); townTap({ name: t.n, x: t.x, y: t.y }); }, t); await waitFor(settleOpen, 60000);
      if (await fr.evaluate(() => !!MEET.up)) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); }); }
    let rows = [];
    if (await settleOpen()) {
      const sf = await (await fr.$('#settleFrame')).contentFrame(), TOUCH = PROFILE !== 'computer';
      for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')); const hb = await (await fr.$('#settleFrame')).boundingBox();
        if (xy) { if (TOUCH) await page.touchscreen.tap(hb.x + xy.x, hb.y + xy.y); else await page.mouse.click(hb.x + xy.x, hb.y + xy.y); }
        if (await waitFor(() => sf.evaluate(() => document.getElementById('sheet').classList.contains('on') && document.querySelectorAll('#sheet button.act.client').length > 0), 6000)) break; }
      rows = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => { const em = b.querySelector('em'); return { id: b.dataset.id, em: em ? em.textContent.replace(/\s+/g, ' ') : '', trip: em ? +em.dataset.trip : null, back: em ? em.dataset.back === '1' : null }; }));
      const want = await fr.evaluate(([rows, n]) => rows.map(r => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === r.id)[0]; const T = o ? BohemiaJobKinds.trip(o, n) : null; return T && T.job ? { total: T.job.exact ? T.job.total : T.job.totalHi, back: !!T.job.back } : null; }), [rows, t.n]);
      rows.forEach((r, i) => { r.want = want[i]; });
    }
    ok('B3 the town\'s board row says the same total, and ROUND TRIP when he comes back', rows.length > 0 && rows.every(r => !r.want || (Math.abs(r.trip - r.want.total) < 0.01 && r.back === r.want.back && (/ROUND TRIP/.test(r.em) === r.back))),
      t.n + ': ' + rows.map(r => r.id + ' "' + r.em.trim() + '"').join(' | '));
    /* B4: the danger reads the road on the whole trip */
    const b4 = await fr.evaluate(() => { const bs = ctBases() || {}; for (const n of Object.keys(bs)) { const list = BohemiaBoardShelf.pick({ name: n, tier: 'town' }, 1, { traits: [], held: [] }) || [];
        for (const o of list) { const T = BohemiaJobKinds.trip(o, n); if (!T || !T.job || !T.job.back || !T.job.exact) continue;
          const t0 = BohemiaJobKinds.realPlace(n), job = BohemiaJobKinds.plan(o, { name: t0.name, x: t0.x, y: t0.y }), F = BohemiaJobKinds.fightsOf(job, { offer: o, place: n }) || [], road = F.filter(f => f.road)[0];
          const hrs = ((T.toTown ? T.toTown.mins : 0) + T.job.total) / 60;
          return { id: o.id, place: n, hours: road ? road.hours : null, want: hrs, out: ((T.toTown ? T.toTown.mins : 0) + T.job.mins) / 60 }; } } return null; });
    ok('B4 the danger counts the road both ways when he must come back', !!b4 && b4.hours != null && Math.abs(b4.hours - b4.want) < 0.01 && b4.want > b4.out,
      b4 ? b4.id + ' at ' + b4.place + ': the road read on ' + (b4.hours || 0).toFixed(1) + ' h (out only ' + b4.out.toFixed(1) + ' h)' : 'no back-paid job found');
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
    /* B5: walk one back-paid job's place and back on the map's own clock */
    const plan = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { n, x: b.x, y: b.y, d: dd }; }
      const door = townDoor(best.x, best.y); city.x = door[0]; city.y = door[1]; try { render(); } catch (e) {}
      for (let w = 0; w < 8; w++) { const list = BohemiaBoardShelf.pick({ name: best.n, tier: mapTierOf(best.n) || 'camp' }, 1 + 3 * w, { traits: [], held: [] }) || [];
        for (const o of list) { const T = BohemiaJobKinds.trip(o, best.n); if (T && T.job && T.job.exact && T.job.back && T.job.at && T.job.at.length === 1 && T.job.total < 600) return { town: best.n, door: door, at: T.job.at[0], total: T.job.total, out: T.job.mins, id: o.id }; } }
      return null; });
    let walked = null;
    if (plan) {
      /* a walk the road interrupted (a crew met, FALL BACK steps him two blocks away) is not the trip: it is walked again, and said */
      const clock = () => fr.evaluate(() => T.day * 1440 + T.min);
      let met = 0;
      const go = async (to) => { await fr.evaluate((to) => { travelStop(); travelTo(0, 0, to); travelGoes(); }, to);
        await waitFor(async () => { const r = await fr.evaluate((to) => { let m = 0; if (MEET.up) { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) { b.click(); m = 1; } } return { m: m, there: !TRAVEL && city.x === to[0] && city.y === to[1] }; }, to); met += r.m; return r.there; }, 180000); };
      /* and a step the road's own moments ate time on (the road director's events cost minutes even when no fight comes) is not the
         road's time either: each step's clock is logged against the map's own cost of the cell, and such a walk is walked again */
      await fr.evaluate(() => { if (window.__WB_HOOK) return; window.__WB_HOOK = 1; const f = travelStepped; window.travelStepped = travelStepped = function (m) { const r = f(m); try { const now = T.day * 1440 + T.min, last = window.__WB_LAST; window.__WB_LAST = now; const want = cityStepMins(city.x, city.y); if (m && last != null && now - last - want > 1.5) window.__WB_EATEN = (window.__WB_EATEN || 0) + (now - last - want); } catch (e) {} return r; }; });
      for (let tries = 0; tries < 4; tries++) {
        met = 0;
        /* arriving home opens the town: it is shut before the next walk */
        await page.waitForTimeout(600); await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(400);
        await fr.evaluate((d) => { city.x = d[0]; city.y = d[1]; try { render(); } catch (e) {} }, plan.door);
        await fr.evaluate(() => { window.__WB_EATEN = 0; window.__WB_LAST = T.day * 1440 + T.min; });
        const c0 = await clock(); await go(plan.at); const c1 = await clock(); await fr.evaluate(() => { try { loopClose(); } catch (e) {} window.__WB_LAST = T.day * 1440 + T.min; }); await go(plan.door); const c2 = await clock();
        const eaten = await fr.evaluate(() => window.__WB_EATEN || 0);
        walked = { out: c1 - c0, all: c2 - c0, tries: tries + 1, met: met, eaten: Math.round(eaten) };
        if (!met && !walked.eaten) break;
      }
    }
    ok('B5 one back-paid job walked out and home on the map\'s own clock: the clock moved what the card said', !!walked && !walked.met && !walked.eaten && Math.abs(walked.all - plan.total) <= Math.max(11, plan.total * 0.06),
      plan ? plan.id + ' at ' + plan.town + ': shown ' + Math.round(plan.total) + ' min (out ' + Math.round(plan.out) + '), the clock ' + (walked ? walked.all + ' (out ' + walked.out + ')' + (walked.tries > 1 ? ', walked ' + walked.tries + ' times (the road met him or its moments ate time)' : '') + (walked.eaten ? ', ' + walked.eaten + ' min eaten by the road\'s moments' : '') : '-') : 'no job to walk');
    ok('B6 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) { ok('the gate ran [' + String(e && e.stack || e).slice(0, 300) + ']', false); }
  await d.close(); done();
})();

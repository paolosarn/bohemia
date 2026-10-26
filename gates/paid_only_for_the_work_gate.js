/* ==========================================================================
   PAID ONLY FOR THE WORK  (WORLD [eyes: paid without the fight], 10/26/26; EYES round three, line 138; rule 198(g))

   EYES, THE LIVE BUILD 10/26d, phone, THE BLOCK WATCH: Trades' 'Bring medicine down from the lodge'; at the lodge the meet said
   'AN AMBUSH WHERE THE LODGE'S PHARMACY WAS · 7 MEN'; FALL BACK; one tap on the job's place again and the map read 'GET PAID ·
   TRADES'; Sister Agustina paid 60 batteries. Rule 198(g): FALL BACK is the way out BEFORE a fight, never a way to finish a job.
   MEASURED: three kinds spent their twist when the card showed (find-place's ambush, find-person's guards, the caravan's gate).

   THE DEMO, his phone (JOB_PROFILE=computer for his computer), the board's own 'Take it', the meet card met as a stranger meets it
   (no engage option), a finger on its buttons, a touch on the place (off the glass, the map's own travelTo):
     A1  FIND, THE AMBUSH WHERE THE PLACE WAS: walking onto the place stops on the card; no fight has gone to the shell
     A2  FALL BACK: nothing paid, the job still held and still looking, the band still standing at the place and drawn on the map
         with its people and a plate ('THEY HOLD IT'), a touch on it is the job's
     A3  a touch on the place again: the card again (never 'GET PAID'); walking home to the client after falling back: not paid
     A4  ENGAGE and the fight won: found; back at the client: paid
     G1-G3  FIND A PERSON, THE ONES HOLDING THEM: the same three (fall back, not paid, still held; won, home, paid)
     C1-C3  ESCORT, THE CREW AT THE GATE: the same three (fall back at the gate, not delivered, not paid; won, delivered, paid)
     Z   nothing threw
   node gates/paid_only_for_the_work_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const PROFILE = process.env.JOB_PROFILE || 'phone_portrait', TOUCH = PROFILE !== 'computer';

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nPAID ONLY FOR THE WORK: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const shellFight = () => page.evaluate(() => !!window.CITYFIGHT);
  const cityBox = async () => (await page.$('#cityFrame')).boundingBox();
  const tapAt = async (x, y) => { if (TOUCH) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y); };
  /* a touch on a block where it is on the glass; off the glass, the map's own travelTo (what the touch calls) */
  const goCell = async (x, y) => {
    const p = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(x, y);
      return { x: r.left + q.sx, y: r.top + q.sy + TH / 2, on: mapOnGlass(x, y) }; }, [x, y]);
    if (p.on) { const fb = await cityBox(); await tapAt(fb.x + p.x, fb.y + p.y); await page.waitForTimeout(200);
      const set = await fr.evaluate(([x, y]) => (TRAVEL && TRAVEL.to && Math.max(Math.abs(TRAVEL.to[0] - x), Math.abs(TRAVEL.to[1] - y)) <= 2) || Math.max(Math.abs(city.x - x), Math.abs(city.y - y)) <= 1 || !!document.getElementById('meetcard'), [x, y]);
      if (set) return 'touch'; }
    await fr.evaluate(([x, y]) => { travelStop(); travelTo(0, 0, [x, y]); }, [x, y]); return p.on ? 'touch, then travelTo' : 'travelTo';
  };
  const unpause = () => fr.evaluate(() => { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); } catch (e) {} });
  const card = () => fr.evaluate(() => { const e = document.getElementById('meetcard'); return e ? { text: e.textContent.replace(/\s+/g, ' ').trim().slice(0, 140), why: window.__MEET_UP && window.__MEET_UP.why } : null; });
  const cardBtn = async (k) => { const b = await fr.evaluate((k) => { const e = document.querySelector('#meetcard [data-meet="' + k + '"]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, k);
    if (!b) return false; const fb = await cityBox(); await tapAt(fb.x + b.x, fb.y + b.y); await page.waitForTimeout(700); return true; };
  /* walk to the place and wait for the card (or for the walk to end without one) */
  const walkInto = async (x, y) => { await unpause(); const how = await goCell(x, y);
    await waitFor(async () => !!(await card()) || await shellFight() || await fr.evaluate(() => !TRAVEL), 60000); return how; };
  const fightFrame = async () => { for (let i = 0; i < 120; i++) { const h = await page.$('#fightFrame');
      if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) return f; }
      await page.waitForTimeout(250); } return null; };
  /* the fight ended by the gate as won (every one of theirs down), the end screen left, home on the map */
  const forceWin = async () => {
    const f = await fightFrame(); if (!f) return false;
    await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} });
    await waitFor(() => page.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !window.CITYFIGHT), 20000);
    await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    await waitFor(async () => !(await shellFight()), 30000);
    await page.waitForTimeout(1500);
    await fr.evaluate(async () => { for (let i = 0; i < 40 && typeof FZOOMING !== 'undefined' && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); });
    await unpause(); return true;
  };
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
  const leave = async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(600); };
  const toTown = async () => {
    const t = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; }
      if (!best) return null; return Object.assign(best, { g: townDoor(best.x, best.y) }); });
    if (!t) return null;
    for (let k = 0; k < 3 && !(await settleOpen()); k++) { await unpause(); await goCell(t.g[0], t.g[1]); await waitFor(settleOpen, 60000);
      if (await card()) await cardBtn('back'); }
    await page.waitForTimeout(1000);
    return (await settleOpen()) ? t : null;
  };
  /* the board's own 'Take it': the message the settlement posts, from its own window */
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
  const paidOf = (id) => fr.evaluate((id) => (window.__JOB_PAID || []).filter(p => p.id === id).length, id);
  const drewHolders = (id) => fr.evaluate((id) => { MAP_DREW.holders = 0; render(); return { drawn: MAP_DREW.holders | 0, hit: BohemiaJobKinds.hits().some(h => h.job === id) }; }, id);
  /* the checker stands him a few blocks off a place (a checker's own setting, rule 192(c)); the touch that follows is his */
  const standNear = (x, y, r) => fr.evaluate(([x, y, r]) => { for (let k = r; k <= r + 4; k++) for (const [a, b] of [[k, 0], [-k, 0], [0, k], [0, -k], [k, k], [-k, -k], [k, -k], [-k, k]]) {
      const cx = x + a, cy = y + b; if (cityWalkable(cx, cy) && route(cx, cy, x, y)) { travelStop(); city.x = cx; city.y = cy; try { camHold(); } catch (e) {} render(); return [cx, cy]; } } return null; }, [x, y, r]);
  /* one kind's legs: take, set the twist, walk in, FALL BACK, touch again, FALL BACK, walk home, then ENGAGE and win, home, paid */
  /* home: a find is paid at the client's town (its door), an escort where it goes */
  const homeCell = (id, mode) => fr.evaluate(([id, mode]) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return null;
    if (mode === 'dest') return [j.target.x, j.target.y]; const g = townDoor(j.fromAt.x, j.fromAt.y); return g ? [g[0], g[1]] : [j.fromAt.x, j.fromAt.y]; }, [id, mode]);
  const leg = async (L, id, set, spotOf, mode) => {
    const t = await toTown(); if (!t) { ok(L + '1 a town opens to take ' + id, false); return; }
    const title = await take(id); await leave();
    await fr.evaluate(([id, set]) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (j) { new Function('j', set)(j); render(); } }, [id, set]);
    let j = await job(id);
    if (!j) { ok(L + '1 "' + title + '" taken at ' + t.n, false, 'no job'); return; }
    const sp = spotOf(j); await standNear(sp[0], sp[1], 4);
    const how = await walkInto(sp[0], sp[1]);
    const c1 = await card(), f1 = await shellFight();
    ok(L + '1 "' + title + '" (' + j.plays + '): walking onto the place stops on the card, no fight sent (' + how + ')', !!c1 && !f1, c1 ? c1.text : 'no card');
    if (!c1) return;
    const before = await fr.evaluate(() => loopBats());
    await cardBtn('back');
    j = await job(id);
    const dh = await drewHolders(id), pd = await paidOf(id);
    ok(L + '2 FALL BACK: nothing paid, the job still held, the band still standing where it stood and drawn on the map',
      pd === 0 && !!j && !!j.holders && Math.max(Math.abs(j.holders.x - sp[0]), Math.abs(j.holders.y - sp[1])) <= 1 && dh.drawn >= 1 && dh.hit && !(await card()),
      j ? 'stage ' + j.stage + ', holders ' + JSON.stringify(j.holders) + ', drawn ' + dh.drawn + ', paid ' + pd : 'job gone, paid ' + pd);
    await page.waitForTimeout(2500);
    const quiet = !(await card());
    await walkInto(sp[0], sp[1]);
    const c2 = await card();
    if (c2) await cardBtn('back');
    const hm = await homeCell(id, mode); if (hm) await walkInto(hm[0], hm[1]);
    if (await card()) await cardBtn('back');
    if (await settleOpen()) await leave();
    const j3 = await job(id), pd3 = await paidOf(id), after = await fr.evaluate(() => loopBats());
    ok(L + '3 the card holds after FALL BACK, comes back only on a touch on the place, and walking home is not paid', quiet && !!c2 && pd3 === 0 && !!j3 && !!j3.holders && after === before,
      'quiet ' + quiet + ', card again ' + (c2 ? c2.text.slice(0, 60) : 'none') + ', paid ' + pd3 + ', batteries ' + before + ' -> ' + after + ', ' + (j3 ? j3.stage : 'job gone'));
    /* ENGAGE and win */
    const sp2 = spotOf(j3 || j); await walkInto(sp2[0], sp2[1]);
    const c4 = await card(); if (c4) await cardBtn('go');
    const won = await forceWin();
    let j4 = await job(id);
    for (let k = 0; k < 3 && j4; k++) {   /* home: a find walks back to the client; an escort walks into the town it goes to */
      const hm2 = await homeCell(id, mode); if (!hm2) break; await walkInto(hm2[0], hm2[1]);
      if (await card()) await cardBtn('back');
      await waitFor(async () => (await paidOf(id)) > 0, 8000);
      if (await settleOpen()) await leave();
      j4 = await job(id);
    }
    const pd4 = await paidOf(id);
    ok(L + '4 ENGAGE and the fight won: the band is gone, the work done, and paid', won && pd4 === 1 && !j4, 'won ' + won + ', paid ' + pd4 + (j4 ? ', still held at ' + j4.stage + (j4.holders ? ' with holders' : '') : ''));
  };

  try {
    await page.waitForTimeout(2500);
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 40000 }).catch(() => {});
    await fr.evaluate(() => { localStorage.setItem('bohemia.fight.met.v1', '3'); });
    await leg('A', 'qd-ap11', "j.twist = 'T22'; j.twistDone = false;", j => [j.spot.x, j.spot.y], 'client');
    await leg('G', 'qd-ap05', "j.guarded = true; j.guardsDone = false; j.twist = null;", j => [j.spot.x, j.spot.y], 'client');
    await leg('C', 'qd-ae09', "j.twist = 'T18'; j.twistDone = false; j.ambush = []; j.raid = null;", j => [j.target.x, j.target.y], 'dest');
    ok('Z nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) { ok('the gate ran [' + String(e && e.stack || e).slice(0, 300) + ']', false); }
  await d.close();
  done();
})();

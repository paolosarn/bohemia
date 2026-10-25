/* ==========================================================================
   THE TRIP BEFORE THE YES  (WORLD [a job says how far], 10/25/26, rule 186(c))

   PAOLO 10/25: 'every time a job is presented it should show how long it's going to take to get there... it sends me to the
   other side of the map without me knowing.'
   Every job offered shows the trip before he takes it, from the map's own road and clock on the job the yes would make
   (slices/bohemia_job_kinds.js trip()); taking it never starts a walk; and the trip shown IS the trip walked.

   ON HIS COMPUTER (TRIP_PROFILE=phone_portrait for the phone), the demo, fingers on the town's own buttons:
     T1  at a town's board every offer on the list says how long beside its pay
     T2  each offer, opened (the person says it), says the trip under the words: blocks, where to, hours or days
     T3  'Take it': the job the map makes goes where the trip said (the same first place), and nothing walks
     T4  his GO (a touch on the job's mark, or the map's own travel to it): the map's 'Setting out: N blocks, about H h' is the
         trip's blocks and time
     T5  a job whose words name a real place far out (the carts to PRIMM, the dam, the pass) says it with its real distance,
         as many days as it is
     T6  the phone's lit card says the walk to its town, and the walk he then makes to that town is that long
     T7  nothing threw
   node gates/the_trip_before_the_yes_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const SHOTS = process.env.TRIP_SHOTS || null;
const PROFILE = process.env.TRIP_PROFILE || 'computer';

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE TRIP BEFORE THE YES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE, engage: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  const TOUCH = PROFILE !== 'computer';
  const tapAt = async (x, y) => { if (TOUCH) return d.tapAt(x, y); const h = await page.$('#cityFrame'), fb = h ? await h.boundingBox() : null; if (!fb) return null; return page.mouse.click(fb.x + x, fb.y + y); };
  const shot = async (n) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, PROFILE + '_' + n + '.png') }); };
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
  const settleFrame = async () => { const fh = await fr.$('#settleFrame'); return fh ? fh.contentFrame() : null; };
  const leave = async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(600); };
  /* a road party ended by the checker as a cleared fight (said), so the walk measured is the walk to the place */
  const roadFight = async () => {
    for (let i = 0; i < 120; i++) { const h = await page.$('#fightFrame'); const f = h ? await h.contentFrame() : null;
      if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) {
        await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }); break; }
      await page.waitForTimeout(250); }
    await waitFor(() => page.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !CITYFIGHT), 15000);
    await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    await waitFor(() => page.evaluate(() => !CITYFIGHT), 20000); await page.waitForTimeout(1500);
    await fr.evaluate(() => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); });
  };
  const toTown = async (name) => {
    const t = await fr.evaluate((name) => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (name ? n === name : (dd >= 2 && (!best || dd < best.d))) best = { n, x: b.x, y: b.y, d: dd }; }
      if (!best) return null; return Object.assign(best, { g: townDoor(best.x, best.y) }); }, name || null);
    if (!t) return null;
    for (let k = 0; k < 5 && !(await settleOpen()); k++) {
      if (await page.evaluate(() => !!CITYFIGHT)) { await roadFight(); continue; }
      await fr.evaluate((t) => { travelStop(); townTap({ name: t.n, x: t.x, y: t.y }); }, t);
      await waitFor(async () => await settleOpen() || await page.evaluate(() => !!CITYFIGHT), 120000);
    }
    await page.waitForTimeout(1200);
    return (await settleOpen()) ? t : null;
  };
  const sfClick = async (sf, sel, re) => {
    const hb = await (await fr.$('#settleFrame')).boundingBox();
    const b = await sf.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => !re || new RegExp(re).test(x.textContent))[0]; if (!e) return null;
      e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, [sel, re || null]);
    if (!b) return false;
    /* the settle frame's box is already in the page's own pixels */
    if (TOUCH) await page.touchscreen.tap(hb.x + b[0], hb.y + b[1]); else await page.mouse.click(hb.x + b[0], hb.y + b[1]);
    await page.waitForTimeout(500); return true;
  };
  const openBoard = async (sf) => {
    if (await sf.evaluate(() => document.getElementById('sheet').classList.contains('on'))) await sfClick(sf, '#close');
    /* a hand on the board's door; the town's greeting can swallow the first touch, so a hand touches again */
    for (let k = 0; k < 4; k++) {
      const xy = await sf.evaluate(() => BohemiaSettlement.where('board'));
      const hb = await (await fr.$('#settleFrame')).boundingBox();
      if (xy) { if (TOUCH) await page.touchscreen.tap(hb.x + xy.x, hb.y + xy.y); else await page.mouse.click(hb.x + xy.x, hb.y + xy.y); }
      if (await waitFor(() => sf.evaluate(() => document.getElementById('sheet').classList.contains('on') && document.querySelectorAll('#sheet button.act.client').length > 0), 6000)) return true;   /* the walk-up first (rule 138) */
    }
    return false;
  };
  /* the job's first place, as the map made it */
  const madeAt = (id) => fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return null;
    const T = window.__JOB_TRIPS || {}; let pts = null;
    try { const P = BohemiaJobKinds.plan; } catch (e) {}
    const at = (q) => q && q.x != null ? [q.x | 0, q.y | 0] : null;
    const p = j.plays === 'haul-caravan' || j.plays === 'carry' ? at(j.target) : j.plays === 'find-place' || j.plays === 'find-person' ? at(j.ring) : j.plays === 'hunt-kind' ? at((j.packs || [])[0])
      : j.plays === 'clear-camp' ? at(j.camp) : j.plays === 'hold-defend' ? at(j.fromAt) : j.plays === 'recover-return' ? at(j.spot) : j.plays === 'patrol' ? at((j.posts || [])[0]) : at(j.target);
    return { plays: j.plays || 'clear-crew', at: p, travel: TRAVEL ? TRAVEL.to : null }; }, id);

  try {
    await page.waitForTimeout(2500);
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && !!(window.BOH_REGION && BOH_REGION.ready), null, { timeout: 30000 }).catch(() => {});
    const t0 = await toTown(null);
    const sf = t0 ? await settleFrame() : null;
    let listed = [], spoken = [], taken = null, walked = null;
    if (sf) {
      await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 15000 }).catch(() => {});
      await openBoard(sf);
      /* T1: the list */
      listed = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => ({ id: b.dataset.id, em: (b.querySelector('em') || {}).textContent || '', mins: +((b.querySelector('em') || {}).dataset || {}).trip || null })));
      await shot('t1_the_board');
      ok('T1 at ' + (t0 && t0.n) + '\'s board every offer says how long beside its pay', listed.length >= 1 && listed.every(l => /· (UP TO )?(UNDER 1 H|\d+(\.5)? (H|DAY|DAYS))/.test(l.em) || /HOLD|stay/i.test(l.em)),
        listed.map(l => l.id + ': ' + l.em.replace(/\s+/g, ' ').trim()).join(' | '));
      /* T2, T3: each offer opened, the trip said; the first one taken */
      for (const l of listed) {
        await openBoard(sf);
        const opened = await sfClick(sf, '#sheet button.act.client[data-id="' + l.id + '"]');
        const s = opened ? await sf.evaluate(() => { const t = document.querySelector('#sheet .say .trip'); return { words: t ? t.textContent : null, shown: !!(t && t.getBoundingClientRect().height > 0), trip: BohemiaSettlement.state.trip ? JSON.parse(JSON.stringify(BohemiaSettlement.state.trip)) : null }; }) : null;
        spoken.push(Object.assign({ id: l.id }, s || {}));
        if (!taken && s && s.trip && s.trip.job && s.trip.job.exact && s.trip.job.plays !== 'hold-defend') {
          await shot('t2_the_trip_said');
          const held0 = await fr.evaluate(() => LOOP.held.length);
          await sfClick(sf, '#sheet .acts button.act', '^Take it');
          await waitFor(() => fr.evaluate((n) => LOOP.held.length > n, held0), 5000);
          taken = { id: l.id, trip: s.trip, made: await madeAt(l.id) };
        }
      }
      ok('T2 each offer, opened, says the trip under the person\'s words', spoken.length >= 1 && spoken.every(s => s.shown && /block|stay/.test(s.words || '') && /hour|day/.test(s.words || '') || /stay/.test(s.words || '')),
        spoken.map(s => s.id + ': "' + s.words + '"').join(' | '));
      const tj = taken && taken.trip.job;
      ok('T3 \'Take it\': the job goes where the trip said, and nothing walks', !!taken && !!taken.made && !!taken.made.at && !!tj && !!tj.at && tj.at[0][0] === taken.made.at[0] && tj.at[0][1] === taken.made.at[1] && !taken.made.travel,
        taken ? taken.id + ' (' + taken.made.plays + '): the trip said ' + JSON.stringify(tj && tj.at && tj.at[0]) + ', the job is at ' + JSON.stringify(taken.made.at) + ', walking: ' + JSON.stringify(taken.made.travel) : 'no exact offer taken');
      /* T4: his GO, and the map's own 'Setting out' */
      if (taken && taken.made.at) {
        await leave();
        const go = await fr.evaluate((a) => { const said = []; const was = travelSay; travelSay = function (s) { said.push(s); return was.apply(this, arguments); };
          travelStop(); const r = travelTo(0, 0, a); travelSay = was; return { r, said, path: TRAVEL && TRAVEL.path ? TRAVEL.path.length - 1 : null, from: [city.x, city.y] }; }, taken.made.at);
        await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
        const m = /Setting out: (\d+) blocks?, about ([\d.]+) h/.exec((go.said || []).join(' '));
        /* the first leg is the walk his GO starts (a patrol's next post is its next GO) */
        const L0 = (tj.legs && tj.legs[0]) || tj, hShown = L0.mins / 60, hWalk = m ? +m[2] : null;
        walked = { blocks: m ? +m[1] : null, h: hWalk };
        ok('T4 his GO: the map\'s own Setting out is the trip\'s blocks and time', !!m && +m[1] === L0.blocks && Math.abs(hWalk - Math.round(hShown * 10) / 10) <= 0.11,
          'the trip: ' + (tj.legs && tj.legs.length > 1 ? 'the first of ' + tj.legs.length + ' legs ' : '') + L0.blocks + ' blocks, ' + hShown.toFixed(2) + ' h ("' + taken.trip.words + '") | the map: "' + (go.said || []).join(' / ') + '"');
      }
      /* T5: a real place far out, its trip said in days (the board's own words for that job, wherever it is offered) */
      const far = await fr.evaluate(() => { const out = []; ['qd-ar05', 'qd-ar02', 'qd-ar08', 'qd-s01', 'qd-ar06'].forEach(id => {
          const bs = ctBases() || {}, here = LOOP.open && LOOP.open.name ? LOOP.open.name : Object.keys(bs)[0];
          const T = BohemiaJobKinds.trip({ id, title: id, pay: 100, skulls: 2 }, here); if (T) out.push({ id, words: T.words, job: T.job }); }); return out; });
      const real = far.filter(f => f.job && f.job.exact && f.job.name);
      ok('T5 a job naming a real place says its real distance, as many days as it is', real.length >= 1 && real.every(f => new RegExp(String(f.job.name), 'i').test(f.words) && (f.job.mins < 22 * 60 || /day/.test(f.words))),
        real.map(f => f.id + ': ' + f.words).join(' | '));
    }
    /* T6: the phone's lit card and the walk to its town */
    await leave();
    /* a card from a town he is not standing at, when the phone has one (the walk to the town is the part the phone adds) */
    const card = await fr.evaluate(() => { const bs = ctBases() || {}, all = [...document.querySelectorAll('#bmboard .job')];
      const far = all.filter(x => { const b = bs[x.dataset.place]; return b && Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)) > 2; });
      const e = far[0] || all[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + Math.min(18, r.height / 2), place: e.dataset.place, id: e.dataset.job }; });
    let ph = null;
    if (card) {
      await tapAt(card.x, card.y); await page.waitForTimeout(800);
      ph = await fr.evaluate((c) => { const e = document.querySelector('#bmboard .job.picked'); const T = (window.__JOB_TRIPS || {})[c.id + '@' + c.place] || null;
        const sh = T && T.toTown ? (T.toTown.mins / 60 < 1 ? 'UNDER 1 H' : T.toTown.mins / 60 < 22 ? Math.round(T.toTown.mins / 60) + ' H' : '') + ' TO ' + String(T.place).toUpperCase() : null;
        return { words: e ? (e.dataset.trip || null) : null, toTown: T && T.toTown ? T.toTown : null, toTownShort: sh, here: T ? T.here : null }; }, card);
      await shot('t6_the_phone_card');
      if (ph && ph.toTown) {
        const w = await fr.evaluate((c) => { const said = []; const was = travelSay; travelSay = function (s) { said.push(s); return was.apply(this, arguments); };
          const bs = ctBases(), b = bs[c.place]; travelStop(); const dr = townDoor(b.x, b.y); travelTo(0, 0, dr); travelSay = was; travelStop(); return said.join(' / '); }, card);
        const m = /Setting out: (\d+) blocks?/.exec(w);
        ok('T6 the phone\'s lit card says the walk to its town, and that walk is that long', !!ph.words && !!m && +m[1] === ph.toTown.blocks && new RegExp(String(card.place), 'i').test(ph.words)
          && ph.words.indexOf(ph.toTownShort) === 0,
          '"' + ph.words + '" | the map: "' + w + '"');
      } else ok('T6 the phone\'s lit card says the trip (he stands at its town)', !!(ph && ph.words), ph ? '"' + ph.words + '"' : 'no card');
    } else ok('T6 the phone has a card to light', false, 'no card on the phone');
    ok('T7 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the gate ran', false, e.message); }
  await d.close();
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });

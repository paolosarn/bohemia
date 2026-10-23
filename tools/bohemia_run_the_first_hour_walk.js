#!/usr/bin/env node
/* ============================================================================
   THE FIRST HOUR, WALKED (RUN 10/23/26, VAMILY [the first hour, quicker], rule 133)

   TUNING's page (records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md)
   walked a stranger through the demo BY HAND: four wrong taps and one unplanned fight before the
   first town, a phone job that does nothing when touched, PAUSE after every fight, nothing
   charged in five game hours. A walk by hand cannot be run again, so the row's "before and after"
   would be two different people's walks. THIS IS THE SAME WALK AS A TOOL, through the one driver
   (rule 14g), real touches on the phone profile, so before and after are the same stranger:

     W1  THE DOOR: what BEGIN plays when nobody picks (the fights, the shelves, the start batteries)
     W2  THE PHONE: the first job touched; did the map answer (a road drawn, the town lit, travel)?
     W3  TO THE FIRST TOWN: the stranger taps the town's NAME on the map (the word he can read),
         again if nothing happened, 1x if the pad sits on PAUSE; every tap that does not open the
         town is a wrong tap, every fight he did not ask for is an unplanned fight
     W4  THE FIRST JOB: the board, Take it, LEAVE, a touch on the JOB; play seconds from BEGIN to
         its fight; the fight is cleared (its own end, as THE LOOP's gate clears it)
     W5  AFTER THE FIGHT: the speed pad (PAUSE or the speed he had), a touch on a place moves him or not
     W6  THE PHONE AFTER THE PAY: is the finished job still listed
     W7  A PARTY ON THE MAP: the first touch on a party; a fight, a plate (how many, skulls), or nothing
     W8  THE FIGHT'S SIZE: a hand-over that carries only a roster (the street's), and a three-skull
         job on day one against a crew of three
     W9  NIGHTFALL: the clock moved to 22:00 by script (marked); what the purse paid, the days left

   node tools/bohemia_run_the_first_hour_walk.js [--file BOHEMIA_DEMO.html] [--out path.json]
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

const argv = process.argv.slice(2);
const arg = (k, dflt) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : dflt; };
const FILE = arg('--file', 'BOHEMIA_DEMO.html');
const OUT = arg('--out', null);

async function walk(FILE, OUT) {
  const W = { file: FILE, when: new Date().toISOString(), box: 'Playwright Chromium, phone 390x844 touch, full CPU', steps: [] };
  const say = (k, v) => { W[k] = v; console.log('  ' + k + ': ' + JSON.stringify(v)); };
  const d = await drive.open({ file: FILE, keepCards: true });
  const fr = d.fr, page = d.page;
  const t0 = Date.now();
  const playS = () => Math.round((Date.now() - t0) / 100) / 10;
  const shellFight = () => page.evaluate(() => !!CITYFIGHT);
  const waitFor = async (fn, ms) => { const s = Date.now(); while (Date.now() - s < ms) { if (await fn()) return true; await page.waitForTimeout(250); } return false; };
  const cvBox = async () => { const h = await page.$('#cityFrame'); return h ? h.boundingBox() : null; };
  const touchCv = async (sx, sy) => { const fb = await cvBox(); if (!fb) return false; const r = await fr.evaluate(() => { const b = document.getElementById('cv').getBoundingClientRect(); return { x: b.left, y: b.top }; }); await page.touchscreen.tap(fb.x + r.x + sx, fb.y + r.y + sy); };
  const touchCell = async (x, y) => { const q = await fr.evaluate(([x, y]) => { const p = __CITY.isoAt(x, y); return { sx: p.sx, sy: p.sy + TH / 2 }; }, [x, y]); await touchCv(q.sx, q.sy); };
  const touchFrameEl = async (sel, idx) => { const fb = await cvBox(); const p = await fr.evaluate(([s, i]) => { const e = document.querySelectorAll(s)[i || 0]; if (!e) return null; const r = e.getBoundingClientRect(); if (r.width < 4) return null; return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, idx]); if (!p) return false; await page.touchscreen.tap(fb.x + p.x, fb.y + p.y); return true; };
  const map = () => fr.evaluate(() => ({ speed: TRAVEL_SPEED, travel: !!TRAVEL, at: [city.x, city.y], open: !!(LOOP.frame && LOOP.frame.style.display === 'block'), bats: loopBats(),
    min: (typeof DAY !== 'undefined') ? DAY.min : null, day: loopDay() }));
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block'));
  /* the fight he did not plan for is cleared the way THE LOOP's gate clears one: the fight's own end */
  const clearFight = async () => {
    let f = null;
    for (let i = 0; i < 120 && !f; i++) { const h = await page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await page.waitForTimeout(250); }
    let size = null;
    if (f) { size = await f.evaluate(() => { const u = FIGHT.S.units || []; return { ours: u.filter(x => x.side !== 'them').length, theirs: u.filter(x => x.side === 'them').length }; }).catch(() => null);
      await f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
    await waitFor(async () => !(await shellFight()), 20000);
    await page.waitForTimeout(1800);
    return size;
  };
  try {
    await page.waitForTimeout(2500);
    /* ---- W1 THE DOOR ---- */
    say('W1_door', await fr.evaluate(() => { const s = LOOP.start || {}; return { combat: s.combat, econ: s.econ, origin: s.origin, start: s.start, company: (s.company || []).length, bats: loopBats() }; }));
    say('stamp', await page.evaluate(() => ((document.getElementById('buildstamp') || {}).textContent || '').trim()));

    /* ---- W2 THE PHONE ---- */
    await waitFor(() => fr.evaluate(() => !!document.querySelector('#bmboard .fp.job')), 15000);
    const job0 = await fr.evaluate(() => { const e = document.querySelector('#bmboard .fp.job'); return e ? { place: e.dataset.place, id: e.dataset.job, who: (e.querySelector('.who') || {}).textContent } : null; });
    const m0 = await map();
    const drew0 = await fr.evaluate(() => JSON.stringify({ r: (MAP_DREW && MAP_DREW.phoneRoute) | 0, l: (MAP_DREW && MAP_DREW.townLit) | 0 }));
    const tapped = job0 ? await touchFrameEl('#bmboard .fp.job', 0) : false;
    await page.waitForTimeout(1500);
    const m1 = await map();
    const w2 = await fr.evaluate(() => ({ route: window.BOH_PHONE_ROUTE ? window.BOH_PHONE_ROUTE.place : null, roadDrawn: (MAP_DREW && MAP_DREW.phoneRoute) | 0, townLit: (MAP_DREW && MAP_DREW.townLit) | 0 }));
    const answered = m1.travel || w2.roadDrawn > 0 || w2.townLit > 0 || m1.at.join() !== m0.at.join();
    let wrong = 0, fights = 0;
    if (!answered) wrong++;
    say('W2_phone', { job: job0, tapped, mapAnswered: answered, roadDrawn: w2.roadDrawn, townLit: w2.townLit, deadTaps: answered ? 0 : 1, before: drew0 });

    /* ---- W3 TO THE FIRST TOWN ---- */
    const town = await fr.evaluate((place) => { const bs = ctBases() || {}; let n = place && bs[place] ? place : null;
      if (!n) { let best = 1e9; for (const k in bs) { const b = bs[k], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd < best && dd > 1) { best = dd; n = k; } } }
      const b = bs[n]; return n ? { name: n, x: b.x, y: b.y, dist: Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)) } : null; }, job0 && job0.place);
    const plateOf = async () => fr.evaluate((t) => {
      /* the town's NAME PLATE, where the stranger reads it: the published boxes, named when the build names them */
      const boxes = window.__GROUNDLABELS || []; const p = __CITY.isoAt(t.x, t.y); let best = null, bd = 1e9;
      for (const b of boxes) { if (b.t && String(b.t).toUpperCase() === String(t.name).toUpperCase()) return { sx: b.x + b.w / 2, sy: b.y + b.h / 2 }; if (b.t) continue;
        const cx = b.x + b.w / 2, cy = b.y + b.h / 2, dd = Math.abs(cx - p.sx) + (cy > p.sy + 20 ? 999 : 0) + Math.abs(cy - (p.sy - 40)) * 0.2; if (dd < bd) { bd = dd; best = { sx: cx, sy: cy }; } }
      return best; }, town);
    const w3 = { town: town && town.name, townBlocks: town && town.dist, taps: [], opened: false };
    for (let i = 0; i < 6 && town; i++) {
      if (await settleOpen()) { w3.opened = true; break; }
      const before = await map();
      let what = 'the name';
      if (i > 0 && before.speed === 0 && w3.taps.length && w3.taps[w3.taps.length - 1].moved === false) {
        /* a tap that moved nothing with the pad on PAUSE: the stranger finds 1x */
        what = '1x'; await touchFrameEl('#speedpad [data-speed="1"], .spd[data-v="1"]', 0) || await (async () => { const fb = await cvBox(); const p = await fr.evaluate(() => { const e = [...document.querySelectorAll('button,div')].filter(x => /^1X$/i.test((x.textContent || '').trim()) && x.getBoundingClientRect().width > 10).pop(); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); if (p) await page.touchscreen.tap(fb.x + p.x, fb.y + p.y); return !!p; })();
      } else {
        const pl = await plateOf();
        if (pl) await touchCv(pl.sx, pl.sy); else { what = 'the town'; await touchCell(town.x, town.y); }
      }
      const s = Date.now(); let fight = false, opened = false, moved = false, stillFor = 0, last = before.at.join();
      while (Date.now() - s < 30000) {
        await page.waitForTimeout(400);
        if (await shellFight()) { fight = true; break; }
        if (await settleOpen()) { opened = true; break; }
        const m = await map(); if (m.at.join() !== before.at.join()) moved = true;
        if (m.at.join() === last && !m.travel) { stillFor += 400; if (stillFor > 3200) break; } else stillFor = 0;
        last = m.at.join();
      }
      const tap = { n: i + 1, what, moved, fight, opened, s: playS() };
      if (fight) { fights++; tap.fightSize = await clearFight(); tap.speedAfterFight = (await map()).speed; }
      if (!opened) wrong++;
      w3.taps.push(tap);
      if (opened) { w3.opened = true; break; }
    }
    w3.wrongTaps = wrong; w3.unplannedFights = fights; w3.toTownS = playS();
    say('W3_to_the_town', w3);

    /* ---- W4 THE FIRST JOB ---- */
    let w4 = { took: null };
    if (await settleOpen()) {
      const fh = await fr.$('#settleFrame'), sf = fh ? await fh.contentFrame() : null, fb = fh ? await fh.boundingBox() : null;
      const cvb = await cvBox();
      const tapText = async (re) => { const p = await sf.evaluate((src) => { const re = new RegExp(src, 'i');
          const els = [...document.querySelectorAll('button,.pl,.hot,a,div')].filter(e => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return r.width > 20 && r.height > 20 && st.display !== 'none' && re.test((e.textContent || '').trim()); });
          els.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
          const e = els[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, t: e.textContent.trim() }; }, re.source);
        if (p) await page.touchscreen.tap(cvb.x + fb.x + p.x, cvb.y + fb.y + p.y); return p; };
      if (sf) {
        await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 6000 }).catch(() => {});
        let bp = null; for (let i = 0; i < 20 && !bp; i++) { bp = await sf.evaluate(() => (window.BohemiaSettlement && BohemiaSettlement.where) ? BohemiaSettlement.where('board') : null); if (!bp) await page.waitForTimeout(250); }
        if (bp) await page.touchscreen.tap(cvb.x + fb.x + bp.x, cvb.y + fb.y + bp.y); else await tapText(/^BOARD/);
        await page.waitForTimeout(1000);
        const offer = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button, #sheet .act, #sheet div')].filter(e => /\d+ batt(ery)?$/i.test((e.textContent || '').trim()) && e.classList.contains('client') && e.getBoundingClientRect().height > 20)
            .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0];
          return b ? ((b.querySelector('.cl > span') || b.querySelector('span') || b).textContent.trim()) : null; });
        if (offer) { await tapText(new RegExp('^' + offer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); await page.waitForTimeout(800); await tapText(/^Take it/); await page.waitForTimeout(800); }
        w4.took = offer;
        await tapText(/^LEAVE$/); await page.waitForTimeout(900);
      }
      const job = await fr.evaluate(() => LOOP.held[0] ? { id: LOOP.held[0].id, x: LOOP.held[0].target.x, y: LOOP.held[0].target.y, pay: LOOP.held[0].pay, skulls: LOOP.held[0].skulls } : null);
      w4.job = job;
      if (job) {
        const bats0 = (await map()).bats;
        await touchCell(job.x, job.y);
        const s = Date.now(); let fight = false, extraTaps = 0;
        while (Date.now() - s < 30000) { await page.waitForTimeout(400); if (await shellFight()) { fight = true; break; }
          const m = await map(); const zoom = await fr.evaluate(() => FZOOMING).catch(() => false); if (!zoom && !(await shellFight()) && !m.travel && m.speed === 0 && extraTaps < 1) { extraTaps++; await touchCell(job.x, job.y); } }
        w4.extraTapsToGo = extraTaps;
        w4.fightAtS = fight ? playS() : null;
        const why = await fr.evaluate(() => LOOP.fighting);
        w4.fightWasTheJob = why === job.id; w4.handover = await fr.evaluate(() => window.__LAST_HANDOVER || null);
        if (fight) { w4.fightSize = await clearFight();
          /* ---- W5 AFTER THE FIGHT ---- */
          const m = await map(); W.W5_after_fight = { speedPad: m.speed, paid: m.bats - bats0 };
          /* a touch on the town he came from: does it go */
          const before = m.at.join(); const far = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null, bd = 0; for (const k in bs) { const b = bs[k], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd > 3 && dd < 14 && dd > bd) { bd = dd; best = [b.x, b.y]; } } return best; });
          if (far) await touchCell(far[0], far[1]); await page.waitForTimeout(2500);
          const m2 = await map(); W.W5_after_fight.tapWent = m2.travel || m2.at.join() !== before || m2.open; W.W5_after_fight.handover = await fr.evaluate(() => window.__LAST_HANDOVER || null);
          try { await fr.evaluate(() => { if (TRAVEL) travelStop(); }); } catch (_e) {}
          console.log('  W5_after_fight: ' + JSON.stringify(W.W5_after_fight));
        }
      }
    }
    say('W4_first_job', w4);
    /* ---- W6 THE PHONE AFTER THE PAY ---- */
    if (w4.job) { await page.waitForTimeout(1500);
      say('W6_phone_after_pay', await fr.evaluate((id) => { try { BohemiaPhoneBoard.paint(); } catch (_e) {} const s = (window.__PHONE_BOARD || {}).shown || []; return { finishedJobStillListed: s.some(a => a.id === id), shown: s.map(a => a.place + ':' + a.id) }; }, w4.job.id)); }
    /* close anything open so the map takes the next touch */
    await fr.evaluate(() => { try { if (LOOP.frame && LOOP.frame.style.display === 'block') loopClose(); } catch (_e) {} });

    /* ---- W7 A PARTY ON THE MAP ---- */
    if (await shellFight()) await clearFight();
    await waitFor(async () => !!(await cvBox()), 10000);
    const pty = await fr.evaluate(() => { render(); const pa = (MAP_DREW && MAP_DREW.partyAt) || {}; let best = null, bd = 1e9;
      for (const id in pa) { const g = pa[id]; const p = __CITY.isoAt(g[0], g[1]); if (p.sx < 30 || p.sx > CVW - 30 || p.sy < 80 || p.sy > CVH - 140) continue; const dd = Math.abs(g[0] - city.x) + Math.abs(g[1] - city.y); if (dd < bd && dd >= 2) { bd = dd; best = { id, sx: p.sx, sy: p.sy + TH / 2 - 8, blocks: Math.max(Math.abs(Math.round(g[0]) - city.x), Math.abs(Math.round(g[1]) - city.y)) }; } }
      return best; });
    let w7 = { party: pty };
    if (pty) {
      const b = await map();
      await touchCv(pty.sx, pty.sy); await page.waitForTimeout(1500);
      const a = await map();
      w7.fight = await shellFight(); w7.travelled = a.travel || a.at.join() !== b.at.join();
      w7.plate = await fr.evaluate(() => window.__PARTY_PLATE ? { count: window.__PARTY_PLATE.count, skulls: window.__PARTY_PLATE.skulls, going: window.__PARTY_PLATE.going, numbers: 2 } : null);
      w7.numbersShown = w7.plate ? 2 : 0;
      if (w7.fight) await clearFight();
      try { await fr.evaluate(() => { if (TRAVEL) travelStop(); }); } catch (_e) {}
    }
    say('W7_party', w7);

    /* ---- W8 THE FIGHT'S SIZE ---- */
    say('W8_fight_size', {
      streetHandOver: await page.evaluate(() => { const ro = [{ arch: 'human' }, { arch: 'human' }, { arch: 'human' }, { arch: 'bot' }, { arch: 'human' }, { arch: 'human' }];
        const o = nfOpts({ roster: ro, district: 'suburb', world: { day: 1 }, firstDay: true, crewCount: 3 }), o2 = nfOpts({ roster: ro, district: 'suburb', world: { day: 2 }, firstDay: false, crewCount: 3 });
        return { dayOne: o.party ? o.party.count : null, dayTwo: o2.party ? o2.party.count : null, company: o.company ? o.company.length : null, note: 'a roster of 6 and no party (the street hands over like this), as the map stamps it' }; }),
      threeSkullJobDayOne: await fr.evaluate(() => { const p = partyMath('job', { skulls: 3 }); return { count: p.count, company: ((LOOP.start || {}).company || []).length, day: loopDay() }; }),
      roamingDayOne: await fr.evaluate(() => partyMath('roaming', { x: city.x + 20, y: city.y }).count)
    });

    /* ---- W10 A PARTY COMING FOR HIM (by script: a forced road event, the sixty-second guard set behind him) ---- */
    try {
      if (await shellFight()) await clearFight();
      const h0 = await fr.evaluate(() => { try { if (TRAVEL) travelStop(); } catch (_e) {} HUNT = null; HUNT_T0 = performance.now() - 61000;
        huntSpawn({ id: 'bounty_squad', name: 'Bounty squad', seq: 7, kind: 'forced' }); render();
        return HUNT ? { at: HUNT.at.slice(), count: HUNT.count, blocks: huntDist(), drawn: (MAP_DREW && MAP_DREW.hunt) | 0, flee: (MAP_DREW && MAP_DREW.fleeRoad) | 0, plate: (MAP_DREW && MAP_DREW.partyPlate) | 0, looks: window.__PARTY_PLATE } : null; });
      const w10 = { spawned: h0 };
      if (h0) {
        /* he takes the lit road away (a finger on its last block) */
        const fl = await fr.evaluate(() => HUNT_FLEE ? HUNT_FLEE[HUNT_FLEE.length - 1] : null);
        if (fl) await touchCell(fl[0], fl[1]);
        w10.fleeTap = await fr.evaluate(() => ({ tap: window.__MAP_TAP || null, to: TRAVEL ? TRAVEL.to : null, me: [city.x, city.y], hunt: HUNT ? HUNT.at : null, flee: HUNT_FLEE }));
        await page.waitForTimeout(4500);
        w10.afterFleeing = await fr.evaluate(() => ({ hunt: !!HUNT, blocks: HUNT ? huntDist() : null, steps: HUNT ? HUNT.steps : null }));
        w10.fight = await shellFight();
        if (w10.fight) await clearFight();
        /* and walks into them: a finger on them twice (look, then go) */
        const into = await fr.evaluate(() => { if (!HUNT) { HUNT_T0 = performance.now() - 61000; huntSpawn({ id: 'toll_crew', name: 'Toll crew', seq: 3, kind: 'forced' }); render(); }
          if (!HUNT || !HUNT.box) return null; return { sx: HUNT.box.x + HUNT.box.w / 2, sy: HUNT.box.y + HUNT.box.h * 0.6 }; });
        if (into) { await touchCv(into.sx, into.sy); await page.waitForTimeout(600); const t1 = await fr.evaluate(() => window.__MAP_TAP || null); await touchCv(into.sx, into.sy);
          await page.waitForTimeout(400);
          /* a finger that could not reach them (under the phone, past the edge): the same two taps, by script, marked */
          const chasing = await fr.evaluate(() => !!PARTY_CHASE); if (!chasing && !(await shellFight())) { w10.intoByScript = true; await fr.evaluate(() => { if (HUNT) { PARTY_SEL = null; partyTap({ id: HUNT.id, hunt: true }); partyTap({ id: HUNT.id, hunt: true }); } }); }
          w10.intoTaps = [t1, await fr.evaluate(() => ({ tap: window.__MAP_TAP || null, chase: PARTY_CHASE, to: TRAVEL ? TRAVEL.to : null, speed: TRAVEL_SPEED }))];
          const s0 = Date.now(); let caught = false; while (Date.now() - s0 < 20000) { await page.waitForTimeout(400); if (await shellFight()) { caught = true; break; } }
          w10.walkedIntoThem = { caught, handover: await fr.evaluate(() => window.__LAST_HANDOVER || null) };
          if (caught) await clearFight(); }
      }
      say('W10_hunters', w10);
    } catch (e) { say('W10_hunters', { crash: String(e).slice(0, 200) }); }

    /* ---- W9 NIGHTFALL (by script: the clock moved to 21:50, then ten minutes walked past 22:00) ---- */
    const w9 = await fr.evaluate(async () => {
      const r = { scripted: 'advance() to 21:50, then one 20-minute advance across 22:00' };
      const bats = () => loopBats();
      try { const need = ((DAY.NIGHT_MIN | 0) - 10) - (DAY.min | 0); if (need > 0) advance(need); } catch (e) { r.err = String(e); }
      r.at = DAY.min; r.before = bats(); r.daysLeftBefore = window.__BILL ? window.__BILL.daysLeft : null;
      try { advance(20); } catch (e) { r.err2 = String(e); }
      await new Promise(res => setTimeout(res, 600));
      r.after = bats(); r.paid = r.before - r.after; r.bill = window.__BILL || null; r.night = DAY.min;
      r.dayAfter = DAY.day; r.minAfter = DAY.min; r.dayTurned = DAY.day > 1;
      /* a second night with the purse down to 3 (scripted): can the crew eat, and if not, who walks */
      try { const have = bats(); if (have > 3) BohemiaPurse.debit(purseGet(), 'electricity', have - 3, 'walk: scripted', null, loopDay());
        const need2 = ((DAY.NIGHT_MIN | 0) - 10) - (DAY.min | 0); if (need2 > 0) advance(need2); advance(20); } catch (e) { r.err3 = String(e); }
      await new Promise(res => setTimeout(res, 2500));
      r.night2 = { bats: bats(), bill: window.__BILL || null, spoke: window.__BILL_SPOKE || null, walked: JSON.parse(localStorage.getItem('bohemia.walked.v1') || '[]'), day: DAY.day,
        talkShown: !!(document.getElementById('billtalk') && document.getElementById('billtalk').style.display !== 'none') };
      return r; });
    say('W9_nightfall', w9);
    W.errors = d.errs.slice(0, 5);
  } catch (e) { W.crash = String(e && e.stack || e).slice(0, 600); console.log('  CRASH ' + W.crash); }
  await d.close();
  if (OUT) { fs.writeFileSync(OUT, JSON.stringify(W, null, 1)); console.log('  wrote ' + OUT); }
  return W;
}
module.exports = { walk };
if (require.main === module) walk(FILE, OUT);

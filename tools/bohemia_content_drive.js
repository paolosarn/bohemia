/* THE CONTENT DRIVE (CONTENT [twenty-five things on the road], 11/2/26): THREE IN-GAME DAYS ON THE REAL DEMO AT PHONE SIZE.
   What it proves: the road's events fire on their own while the party walks (no forcing: the real director, its real gap and
   chance), each one is a face and two or three choices and a real tap picks one; two of the new job kinds are taken from the
   board's own door (loopTakeContract, what the settlement's 'contract' message calls) and walked to their places by the map's
   own travel (travelTo, what a tap on the place calls); their talks and fights are met as a player meets them; a side quest
   met on the road is followed to its second person. Nothing thrown, in the page or the map's frame.
   Fights are closed the way the first-hour walk closes them (the fight's own end, won), because this measures the content,
   not the fight.  Run: node tools/bohemia_content_drive.js [--out file.json] [--days 3] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const argv = process.argv.slice(2), arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const OUT = arg('--out', null), DAYS = +arg('--days', 3), JOBS = ['jk-scout-wells', 'jk-collect-beto'];

(async () => {
  const R = { file: 'BOHEMIA_DEMO.html', box: 'Playwright Chromium, phone 390x844 touch', when: new Date().toISOString(), events: [], jobs: [], quests: [], taps: 0, fights: 0, errors: [] };
  const d = await drive.open({ keepCards: true });
  const fr = d.fr, page = d.page;
  page.on('pageerror', e => R.errors.push('page: ' + String(e && e.message || e).slice(0, 200)));
  const waitFor = async (fn, ms) => { const s = Date.now(); while (Date.now() - s < ms) { if (await fn()) return true; await page.waitForTimeout(250); } return false; };
  const box = async () => { const h = await page.$('#cityFrame'); return h ? h.boundingBox() : null; };
  const tapIn = async (sel, i) => { const fb = await box(); const p = await fr.evaluate(([s, k]) => { const e = document.querySelectorAll(s)[k || 0]; if (!e) return null; const r = e.getBoundingClientRect(); return r.width < 4 ? null : { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, [sel, i]); if (!fb || !p) return false; await page.touchscreen.tap(fb.x + p.x, fb.y + p.y); R.taps++; return true; };
  const shellFight = () => page.evaluate(() => typeof CITYFIGHT !== 'undefined' && !!CITYFIGHT).catch(() => false);
  const clearFight = async () => {
    let f = null;
    for (let i = 0; i < 80 && !f; i++) { const h = await page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await page.waitForTimeout(250); }
    if (f) { await f.evaluate(() => { (FIGHT.S.units || []).forEach(u => { if (u.side === 'them') { u.dead = true; u.hp = 0; } }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {});   /* theirs down: a won fight, never a walk-away (fightEnd reads the ones still alive as 'ran') */ R.fights++; }
    /* the spoils wait for LEAVE (rule 164 item 28) and the recap card reads for a while: LEAVE is pressed (the spoils' own
       spoilsLeave, what its button calls) and after six seconds the card goes home (nfHome, what its own timer calls) */
    const t1 = Date.now();
    await waitFor(async () => { if (!(await shellFight())) return true; await page.evaluate((late) => { try { if (typeof SPOILS !== 'undefined' && SPOILS.d && !SPOILS.left) spoilsLeave(); else if (late) nfHome(); } catch (e) {} }, Date.now() - t1 > 6000).catch(() => {}); return false; }, 30000);
    await page.waitForTimeout(1500);
  };
  const st = () => fr.evaluate(() => ({ day: loopDay(), min: T.min, at: [city.x, city.y], travel: !!TRAVEL, speed: TRAVEL_SPEED, bats: loopBats(), food: (wagonGet() || {}).food | 0, men: crewCount(),
    open: !!(LOOP.frame && LOOP.frame.style.display === 'block'), card: !!document.getElementById('roadcard'), meet: !!document.getElementById('meetcard'),
    held: LOOP.held.map(j => ({ id: j.id, plays: j.plays, li: j.li, legs: j.legs ? j.legs.length : 0, next: (window.BohemiaJobKinds && BohemiaJobKinds.nextOf(j)) || null })),
    rq: window.BohemiaRoadEvents ? BohemiaRoadEvents.places() : [], err: window.__ROADEV_ERR || window.__JOB_ERR || null }));
  /* whatever stands over the map: a person on the road (tap a choice he can afford, the first one), the meet card (ENGAGE), a fight, a town */
  const handle = async () => {
    for (let k = 0; k < 6; k++) {
      if (await shellFight()) { await clearFight(); continue; }
      const s = await st();
      if (s.card) {
        const c = await fr.evaluate(() => { const el = document.getElementById('roadcard'); const b = [...el.querySelectorAll('button[data-road]')]; return { name: (el.querySelector('.rc div[style*="15px"]') || {}).textContent || '', text: (el.querySelector('.rctext') || {}).textContent || '', opts: b.map(x => ({ t: x.textContent, off: x.disabled })), face: (el.querySelector('.rcface') || {}).dataset || {} }; });
        const pickI = Math.max(0, c.opts.findIndex(o => !o.off));
        console.log('    EVENT ' + c.name + ' :: ' + c.opts.map(o => o.t + (o.off ? '(x)' : '')).join(' / '));
        if (R.lastSig !== c.name + '|' + c.text.slice(0, 60)) R.events.push({ day: s.day, min: s.min, who: c.name, said: c.text.slice(0, 90), opts: c.opts.map(o => o.t), tapped: (c.opts[pickI] || {}).t, mouth: c.face.mouth || null });
        /* CONTENT 2: a tap that did not take (the same card, the same words, still up) is MEASURED, never hidden: what stands on
           the button's middle is written down (in the map's frame and on the shell), then the button's own press is sent so the
           drive goes on; R.covered counts them and names the cover */
        const sig = c.name + '|' + c.text.slice(0, 60);
        if (R.lastSig === sig) {
          const cov = await fr.evaluate((k) => { const b = document.querySelectorAll('#roadcard button[data-road]')[k]; if (!b) return null; const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, e = document.elementFromPoint(x, y);
            return { x, y, frameHit: e ? (e.tagName + '#' + (e.id || '') + '.' + String(e.className || '').slice(0, 30) + ' ' + String(e.textContent || '').slice(0, 24)) : null, town: !!(LOOP.frame && LOOP.frame.style.display === 'block'), meet: !!document.getElementById('meetcard') }; }, pickI).catch(() => null);
          const topHit = cov ? await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.tagName + '#' + (e.id || '') + '.' + String(e.className || '').slice(0, 30)) : null; }, [cov.x, cov.y]).catch(() => null) : null;
          R.covered = (R.covered || []).concat([{ who: c.name, day: s.day, min: s.min, cov, topHit }]).slice(-30);
          await fr.evaluate((k) => { const b = document.querySelectorAll('#roadcard button[data-road]')[k]; if (b) b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true })); }, pickI).catch(() => {});
          R.lastSig = null; await page.waitForTimeout(900); continue;
        }
        R.lastSig = sig;
        await tapIn('#roadcard button[data-road]', pickI); await page.waitForTimeout(900); continue;
      }
      if (s.meet) { await tapIn('#meetcard [data-meet="go"]', 0); await page.waitForTimeout(1500); continue; }
      if (s.open) {
        /* CONTENT 2: THE SCAVENGE ACTION IN A TOWN, once: the lot's own button in the settlement screen (what his tap calls), then out */
        if (!R.scav) { const r = await fr.evaluate(() => { try { const w = LOOP.frame && LOOP.frame.contentWindow; if (!w || typeof w.openB !== 'function') return 'no lot';
            w.openB('lot'); const b = [...w.document.querySelectorAll('button')].find(x => /Search the lot/i.test(x.textContent || '')); if (!b || b.disabled) return 'no button'; b.click(); return 'searched'; } catch (e) { return String(e && e.message || e); } }).catch(e => String(e));
          if (r === 'searched') { R.scav = { day: s.day, min: s.min, at: s.at }; console.log('    SCAVENGED the lot at ' + s.at); await page.waitForTimeout(800); } else R.scavTry = r; }
        await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(500); continue; }
      break;
    }
  };
  const go = (x, y) => fr.evaluate(([x, y]) => { try { travelStop(); } catch (e) {} try { return !!travelTo(0, 0, [x, y]); } catch (e) { return String(e); } }, [x, y]);
  const travelTill = async (ms) => { const s0 = Date.now(); while (Date.now() - s0 < ms) { await handle(); const s = await st(); if (!s.travel && !s.card && !s.meet && !(await shellFight())) return s; if (s.travel && s.speed === 0 && !s.card && !s.meet) await fr.evaluate(() => { try { travelGoes(); } catch (e) {} }); await page.waitForTimeout(400); } return st(); };
  try {
    await fr.evaluate(() => { window.__ROADEV_ON = true; }).catch(() => {});   /* a scripted browser meets the road only when it asks (bohemia_road_events.js) */
    await page.waitForTimeout(3000);
    await fr.evaluate(() => { window.__ROADEV_ON = true; }).catch(() => {});
    if (await shellFight()) await clearFight();
    await handle();
    await waitFor(() => fr.evaluate(() => !!(window.BohemiaRoadEvents && BohemiaRoadEvents.ready() && window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready())).catch(() => false), 20000);
    R.stamp = await page.evaluate(() => ((document.getElementById('buildstamp') || {}).textContent || '').trim());
    const s0 = await st(); R.start = s0;
    /* 1. to the nearest town, and the two new jobs from its board's door */
    const town = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null, bd = 1e9; for (const k in bs) { const b = bs[k]; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd < bd) { bd = dd; best = { name: k, x: b.x, y: b.y, g: townDoor(b.x, b.y) }; } } return best; });
    R.town = town.name;
    if (Math.max(Math.abs(town.x - s0.at[0]), Math.abs(town.y - s0.at[1])) > 2) { await go(town.g[0], town.g[1]); await travelTill(90000); }
    await handle();
    for (const id of JOBS) {
      const r = await fr.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; if (!o) return 'no row'; const ok = loopTakeContract({ id: o.id, title: o.title, pay: o.pay, skulls: o.skulls }); const j = LOOP.held.filter(h => h.id === id)[0]; return { ok, plays: j && j.plays, kind: j && j.kind, legs: j && j.legs ? j.legs.map(L => L.act + '@' + (L.name || '') ) : null, said: j && j.sayTake }; }, id);
      R.jobs.push({ id, took: r });
    }
    /* 2. three in-game days: the jobs' places, then wherever the valley is; whatever the road brings is met */
    const endDay = s0.day + DAYS, t0 = Date.now(); let wander = 0;
    while (Date.now() - t0 < (+arg('--mins', 14)) * 60000) {
      await handle();
      const s = await st(); if (s.day >= endDay) { R.end = s; break; }
      console.log('  t+' + Math.round((Date.now() - t0) / 1000) + 's day ' + s.day + ' ' + Math.floor(s.min / 60) + ':' + String(s.min % 60 | 0).padStart(2, '0') + ' at ' + s.at + ' bats ' + s.bats + ' food ' + s.food + ' men ' + s.men + ' events ' + R.events.length + ' held ' + s.held.map(j => j.id + ':' + (j.li | 0) + '/' + j.legs).join(',') + (s.err ? ' ERR ' + s.err : ''));
      if (OUT) try { fs.writeFileSync(OUT, JSON.stringify(R, null, 1)); } catch (e) {}
      let tgt = null;
      for (const j of s.held) if (j.next && j.next.x != null) { tgt = [j.next.x, j.next.y, j.id]; break; }
      if (!tgt && s.rq.length) tgt = [s.rq[0].x, s.rq[0].y, s.rq[0].id];
      /* CONTENT 2: once, from the third day, over a mountain pass road (the region's joins: a block with passRoad) */
      if (!tgt && !R.passWalk && s.day >= s0.day + 2) { R.passWalk = await fr.evaluate(() => { let best = null, bd = 1e9; for (let y = -20; y < om.n + 20; y++) for (let x = -20; x < om.n + 20; x++) { let c = null; try { c = om.at(x, y); } catch (e) {} if (c && c.passRoad) { const d = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)); if (d < bd && d > 4) { bd = d; best = [x, y, 'pass:' + c.passRoad]; } } } return best || 'none'; }); if (Array.isArray(R.passWalk)) tgt = R.passWalk; }
      if (!tgt) { tgt = await fr.evaluate((w) => { const bs = ctBases() || {}, ks = Object.keys(bs).sort(); const k = ks[(w * 7 + 3) % ks.length]; const b = bs[k]; const g = townDoor(b.x, b.y) || [b.x, b.y]; return [g[0], g[1], 'wander:' + k]; }, wander++); }
      const ok = await go(tgt[0], tgt[1]);
      if (ok !== true) { R.errors.push('route ' + JSON.stringify(tgt) + ' ' + ok); wander++; await page.waitForTimeout(300); if (wander > 40) break; continue; }
      await travelTill(60000);
      await fr.evaluate(() => { try { if (window.BohemiaJobKinds) BohemiaJobKinds.arrived(city.x, city.y); } catch (e) {} });   /* a touch where he stands is the arrival */
      await page.waitForTimeout(600);
    }
    R.end = R.end || await st();
    R.road = await fr.evaluate(() => BohemiaRoadEvents.status());
    R.chose = await fr.evaluate(() => window.__ROADEV_CHOSE || []);
    R.paid = await fr.evaluate(() => window.__JOB_PAID || []);
    R.legsDone = await fr.evaluate(() => window.__JOB_LEGS || []);
    R.talks = await fr.evaluate(() => window.__JOB_TALKS || []);
    R.qdone = await fr.evaluate(() => window.__ROADEV_QDONE || []);
    R.qmet = await fr.evaluate(() => window.__ROADEV_QUESTS || []);
    R.met = await fr.evaluate(() => window.__ROADEV_MET || []);
    R.fought = await fr.evaluate(() => window.__ROADEV_FOUGHT || []);
    R.joined = await fr.evaluate(() => window.__ROADEV_JOINED || []);
    R.gear = await fr.evaluate(() => window.__ROADEV_GEAR || []);
    R.frameErr = await fr.evaluate(() => [window.__ROADEV_ERR || null, window.__JOB_ERR || null, window.__JOB_DRAW_ERR || null]);
    R.driverErrs = (d.errs || []).slice(0, 10);
  } catch (e) { R.errors.push('drive: ' + String(e && e.stack || e).slice(0, 400)); }
  finally { await d.close(); }
  const newEv = R.events.length, jobsTaken = R.jobs.filter(j => j.took && j.took.ok && j.took.legs).length;
  R.verdict = { days: (R.end && R.start) ? R.end.day - R.start.day : null, events_met: newEv, distinct: [...new Set(R.events.map(e => e.who))].length, new_jobs_taken: jobsTaken,
    jobs_paid: R.paid.length, quests_met: (R.qmet || []).length, quests_finished: (R.qdone || []).length, scavenged: !!R.scav, thrown: R.errors.length + (R.driverErrs || []).length };
  console.log(JSON.stringify(R.verdict));
  console.log('events:', R.events.map(e => 'day ' + e.day + ' ' + e.who + ' -> ' + e.tapped).join(' | '));
  console.log('jobs:', JSON.stringify(R.jobs.map(j => [j.id, j.took && j.took.plays, j.took && j.took.legs])), 'paid:', JSON.stringify(R.paid), 'talks:', JSON.stringify(R.talks));
  if (R.errors.length) console.log('errors:', R.errors.slice(0, 8));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
})();

#!/usr/bin/env node
/* CHARACTER [the hires dressed] (11/11, rule 427(b)'s 'then the hires', ask 238): THE HIRES ON HIS PHONE, BOTH WAYS. The demo started
   the way he starts it (tools/bohemia_drive_the_demo.js, unedited), upright and on its side, on THE BLOCK WATCH with the valley's own
   code (SEED, default HRS2DR), so the BEFORE and the AFTER walk into the same town when they run on one base (the town a code starts
   in moves when the valley's places move: HRS2DR started in MOB on 2658f42e0 and in REDS on 578669a2a, measured 11/11): the hall as he arrives; the same hall in the week the most of the six stand at its
   post (the post's week is the map's day, set on the town's own state and put back after: the one thing here he would have to play
   weeks to see); the first of the six at the post as he arrives HIRED with the card's own HIRE (else the first in that week's hall);
   that man on the crew screen (picked: his whole body in the camp), the map, and a road fight off the town (the driver's own
   roadFightOffTheTown), the camera on him. One full-screen shot each, the looks each screen drew, and the page errors.
     SEED=HRS2DR node tools/bohemia_character_the_hires_dressed_shots.js <out dir> [phone_portrait,phone_landscape]
   -> <out>/<profile>_<hall|hallweek|crew|map|fight>.jpg and shots.json */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { open, roadFightOffTheTown } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records/target/character/the_hires_dressed/phone'));
const WANT = (process.argv[3] || 'phone_portrait,phone_landscape').split(',');
const SEED = process.env.SEED || 'HRS2DR';
const SIX = ['anarchists_2', 'colorful_0', 'homeless_0', 'reds_0', 'reds_1', 'remnants_0'].map(x => 'person_' + x);
const frameOf = (P, re) => P.frames().find(f => re.test(f.url()));
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function shot(P, name) {
  const png = path.join(OUT, name + '.png');
  await P.screenshot({ path: png });
  try { const { execFileSync } = require('child_process');
    execFileSync('python3', ['-c', 'import sys; from PIL import Image; Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], quality=82, optimize=True)', png, png.replace(/\.png$/, '.jpg')]);
    fs.unlinkSync(png); } catch (e) {}
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const report = [];
  for (const profile of WANT) {
    const g = { profile }; let d = null;
    try {
      const ARM = "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = '" + (process.env.ORIGIN || 'watch') + "'; s.reveal = 0; " +
        "localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.removeItem('bohemia.fog.off'); localStorage.removeItem('bohemia.laststart.v1'); " +
        /* the valley's own code (the share-a-game code a player types: the same code and origin start in the same corner), so the
           BEFORE and the AFTER walk into the same town */
        "localStorage.setItem('bohemia.world.next.v1', '" + SEED + "'); } catch (e) {}";
      d = await open({ profile, door: 60000, world: 8000, arm: ARM });
      const P = d.page;
      const tap = async (x, y) => { await P.touchscreen.tap(x, y); };
      let fr = frameOf(P, /BOHEMIA_CITY_WORLD/);
      /* the tape, then the town (a tap skips the tape once it is armed), the way he starts */
      for (let i = 0; i < 160; i++) { const up = await fr.evaluate(() => !!(window.__SQUAD_UP && window.__SQUAD_UP.armedAt)).catch(() => false); if (up) break; await sleep(250); }
      { const r = await P.evaluate(() => ({ w: innerWidth, h: innerHeight })); await sleep(400); await tap(r.w / 2, r.h * .7); }
      for (let i = 0; i < 80; i++) { if (await fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)).catch(() => false)) break; await sleep(250); }
      await sleep(2500);
      const rosterUp = async () => {
        const r = frameOf(P, /ROSTER_SCREEN/); if (!r) return null;
        if (!(await r.evaluate(() => !!(window.BohemiaRosterScreen && BohemiaRosterScreen.state.crew.length)).catch(() => false))) return null;
        const el = await r.frameElement().catch(() => null), bb = el && await el.boundingBox().catch(() => null);
        return bb && bb.width > 4 && bb.height > 4 ? r : null; };
      /* upright, the start lands with the crew screen up over the town (the tape's end opens it): closed with its own DONE */
      { const r0 = await rosterUp(); g.crewAtStart = !!r0; if (r0) { await r0.evaluate(() => { const c = document.getElementById('done'); if (c) c.click(); }).catch(() => {}); await sleep(1500); } }
      const sf = frameOf(P, /SETTLEMENT_SCREEN/); g.town = !!sf;
      if (!sf) throw new Error('no town');
      await sf.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 20000 }).catch(() => {});
      await sleep(2500);
      g.place = await sf.evaluate(() => BohemiaSettlement.state.place.name).catch(() => null);
      for (let i = 0; i < 3; i++) { const o = await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) { c.click(); return true; } return false; }).catch(() => false); if (!o) break; await sleep(700); }
      const fb = await (await sf.frameElement()).boundingBox();
      const openHall = async () => {
        const hx = await sf.evaluate(() => BohemiaSettlement.where('hall')).catch(() => null); if (!hx || !fb) return false;
        for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'hall').catch(() => false)) break; await tap(fb.x + hx.x, fb.y + hx.y); await sleep(700); }
        await sf.waitForFunction(() => { const f = [].slice.call(document.querySelectorAll('#sheet.on .hire canvas.hfig')); return f.length && f.every(c => c.dataset.drawn === '1'); }, null, { timeout: 15000 }).catch(() => {});
        await sleep(1500);
        return sf.evaluate(() => BohemiaSettlement.state.open === 'hall').catch(() => false); };
      /* his card in view (the hall lists the best first; a hire of the six may stand lower) */
      const cardInView = async (look) => sf.evaluate((look) => { const r = BohemiaSettlement.recruits().find(x => x.look === look); if (!r) return null;
        const c = document.querySelector('#sheet.on .hire[data-id="' + r.id + '"]'); if (!c) return null; c.scrollIntoView({ block: 'center' }); return r.id; }, look).catch(() => null);
      /* THE HALL, AS HE ARRIVES */
      if (await openHall()) {
        g.hall = await sf.evaluate(() => BohemiaSettlement.recruits().map(r => r.look)).catch(() => null);
        g.hallSix = (g.hall || []).filter(l => SIX.includes(l));
        if (g.hallSix.length) await cardInView(g.hallSix[0]);
        await sleep(800); await shot(P, profile + '_hall');
        /* THE SAME HALL IN THE WEEK THE MOST OF THE SIX STAND AT ITS POST (the town's own state; put back after the hire) */
        g.week = await sf.evaluate((SIX) => { const S = BohemiaSettlement.state, keep = { mapDay: S.mapDay, postKey: S.postKey, recruits: S.recruits, taken: S.taken };
          window.__keepPost = keep; let best = null;
          for (let w = 1; w < 30; w++) { S.mapDay = w * 7 + 1; S.postKey = null; const L = BohemiaSettlement.recruits().map(r => r.look), k = L.filter(l => SIX.includes(l)).length; if (!best || k > best.k) best = { w, k, L }; }
          S.mapDay = best.w * 7 + 1; S.postKey = null; return { week: best.w, n: best.k, looks: BohemiaSettlement.recruits().map(r => r.look) }; }, SIX).catch(e => 'ERR ' + e);
        await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }).catch(() => {}); await sleep(800);
        if (await openHall()) {
          const firstOf = (g.week && g.week.looks || []).find(l => SIX.includes(l)) || null;
          if (firstOf) await cardInView(firstOf);
          await sleep(800); await shot(P, profile + '_hallweek');
          /* HIRED, with the hall's own HIRE on his card: here only when none of the six stood at the post as he arrived */
          if (!g.hallSix.length) g.hire = firstOf;
          const id = !g.hallSix.length && g.hire && await cardInView(g.hire);
          if (id) { const b = await sf.$('#sheet.on .hire[data-id="' + id + '"] .act'); if (b) { await b.scrollIntoViewIfNeeded().catch(() => {}); await b.click().catch(e => { g.hireErr = String(e); }); } }
          await sleep(1500);
          g.hired = await P.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').map(m => m && (m.look || m.name)); } catch (e) { return 'ERR'; } }).catch(() => null);
        }
        await sf.evaluate(() => { const S = BohemiaSettlement.state, k = window.__keepPost; if (k) { S.mapDay = k.mapDay; S.postKey = k.postKey; S.recruits = k.recruits; S.taken = k.taken; } const c = document.getElementById('close'); if (c) c.click(); }).catch(() => {});
        await sleep(800);        /* HIRED AS HE ARRIVES, with the hall's own HIRE on his card (the week put back), when one of the six stood there */
        if (g.hallSix.length && await openHall()) {
          g.hire = g.hallSix[0];
          const id = await cardInView(g.hire);
          if (id) { const b = await sf.$('#sheet.on .hire[data-id="' + id + '"] .act'); if (b) { await b.scrollIntoViewIfNeeded().catch(() => {}); await b.click().catch(e => { g.hireErr = String(e); }); } }
          await sleep(1500);
          g.hired = await P.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').map(m => m && (m.look || m.name)); } catch (e) { return 'ERR'; } }).catch(() => null);
          await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }).catch(() => {}); await sleep(800);
        }
      }
      /* THE CREW SCREEN: CREW on his phone, else the town's CREW button; the hired man picked, his whole body in the middle */
      const ph = await P.evaluate(() => { const a = document.querySelector('#bohphone .app[data-app="crew"]'); if (!a) return null; const r = a.getBoundingClientRect(); return r.width > 4 && r.height > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }).catch(() => null);
      if (ph) await tap(ph.x, ph.y);
      else { const cb = await sf.$('#crew'), bx = cb && await cb.boundingBox(); if (bx && bx.width > 4) await tap(bx.x + bx.width / 2, bx.y + bx.height / 2); }
      let rf = null;
      for (let i = 0; i < 60 && !rf; i++) { rf = await rosterUp(); if (!rf) await sleep(250); }
      g.crewScreen = !!rf;
      if (rf) {
        await sleep(2000);
        g.crew = await rf.evaluate(() => BohemiaRosterScreen.state.crew.map(m => m && (m.look || m.name) || null)).catch(e => 'ERR ' + e);
        g.crewWhy = await rf.evaluate(() => { const j = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'ERR'; } };
          return { hired: (j('bohemia.hired.v1') || []).map(m => m && [m.name, m.look]), walked: j('bohemia.walked.v1'), names: BohemiaRosterScreen.state.crew.map(m => m && m.name), cap: BohemiaRosterScreen.state.cap }; }).catch(e => 'ERR ' + e);
        g.crewPicked = await rf.evaluate((look) => { const i = BohemiaRosterScreen.state.crew.findIndex(m => m && m.look === look); if (i >= 0) BohemiaRosterScreen.choose(i); return i; }, g.hire).catch(() => -1);
        await sleep(2500); await shot(P, profile + '_crew');
        await rf.evaluate(() => { const c = document.getElementById('done'); if (c) c.click(); }).catch(() => {});
        await sleep(1500);
      }
      /* THE MAP: the town left the way he leaves it (the phone's LEAVE, else the town's own #leave) */
      fr = frameOf(P, /BOHEMIA_CITY_WORLD/);
      let left = false;
      for (const x of P.frames()) {
        const sel = '#bohphone .app[data-app=leave]';
        if (await x.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.classList.contains('off'); }, sel).catch(() => false)) {
          const loc = x.locator(sel).first(); if (profile === 'phone_portrait') await loc.tap(); else await loc.click(); left = true; break; }
      }
      if (!left) { const tf = frameOf(P, /SETTLEMENT_SCREEN/); if (tf) left = await tf.evaluate(() => { const b = document.getElementById('leave'); if (b) b.click(); return !!b; }).catch(() => false); }
      await sleep(3500);
      g.mapLeft = left;
      g.mapParty = await fr.evaluate(() => { try { return (LOOP.start.company || []).map(m => m.look || m.name || null); } catch (e) { return null; } }).catch(() => null);
      await shot(P, profile + '_map');
      /* THE FIGHT: a road fight off the town, his company dealt, the camera on the man he hired (else on his side) */
      const ff = await roadFightOffTheTown(d);
      g.fight = !!ff;
      if (ff) {
        await ff.evaluate(() => { window.__shown = FIGHT.shown; FIGHT.shown = function () { return true; }; }).catch(() => {});
        await sleep(3000);
        g.fightYou = await ff.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => u.look)).catch(() => null);
        g.fightThem = await ff.evaluate(() => FIGHT.S.units.filter(u => u.side !== 'you').map(u => u.look)).catch(() => null);
        g.fightCam = await ff.evaluate((look) => { try {
          const M = FIGHT.S.units.filter(u => u.side === 'you'), h = M.find(u => u.look === look), A = h ? [h] : M; if (!A.length) return null;
          const x = A.reduce((s, u) => s + u.x, 0) / A.length, y = A.reduce((s, u) => s + u.y, 0) / A.length;
          FIGHT_UI.glide = null; FIGHT_UI.pinched = true; FIGHT_UI.openUntil = 1e12;
          FIGHT_UI.zoom = (FIGHT_UI.near || FIGHT_UI.zoom) * (h ? 1 : 0.85); FIGHT_UI.cx = (x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (y + .5) * FIGHT_UI.th;
          if (typeof clampCam === 'function') clampCam(); if (typeof hud === 'function') hud();
          return { on: h ? look : 'his side', x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, zoom: FIGHT_UI.zoom };
        } catch (e) { return String(e); } }, g.hire).catch(e => String(e));
        await sleep(6000);
        await shot(P, profile + '_fight');
      }
      g.errors = d.errs.map(String).slice(0, 8); g.nErrors = d.errs.length;
    } catch (e) { g.failed = String(e && e.message || e); }
    if (d) await d.close().catch(() => {});
    report.push(g);
    console.log(profile, JSON.stringify({ seed: SEED, place: g.place, hallSix: g.hallSix, hire: g.hire, week: g.week && g.week.week, weekN: g.week && g.week.n, hired: g.hired, crewPicked: g.crewPicked, fightYouHasHire: !!(g.fightYou && g.fightYou.includes(g.hire)), them: g.fightThem, errors: g.nErrors, failed: g.failed }));
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(report, null, 1));
})();

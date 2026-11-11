#!/usr/bin/env node
/* CHARACTER [the company dressed] (11/10, rule 427(b), ask 238): THE COMPANY ON HIS PHONE, BOTH WAYS. The demo started the way he
   starts it (tools/bohemia_drive_the_demo.js, unedited), upright and on its side: the town it starts him in with his company in it,
   the hall (the hires), the crew screen off his phone, the map with his party, and a road fight off the town (the driver's own
   roadFightOffTheTown). One full-screen shot each, the company men's looks each screen drew, and the page errors.
     node tools/bohemia_character_the_company_dressed_shots.js <out dir> [phone_portrait,phone_landscape]
   -> <out>/<profile>_<town|hall|crew|map|fight>.jpg and shots.json */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const { open, roadFightOffTheTown } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records/target/character/the_company_dressed/phone'));
const WANT = (process.argv[3] || 'phone_portrait,phone_landscape').split(',');
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
        "localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.removeItem('bohemia.fog.off'); localStorage.removeItem('bohemia.laststart.v1'); } catch (e) {}";
      d = await open({ profile, door: 60000, world: 8000, arm: ARM });
      const P = d.page;
      const tap = async (x, y) => { await P.touchscreen.tap(x, y); };
      let fr = frameOf(P, /BOHEMIA_CITY_WORLD/);
      /* THE WHOLE COMPANY: THE BLOCK WATCH origin starts him with twelve men, the crew list's every look (CREW_DEFS.looks:
         YOU and person_town_0..11 but 9), the way he would start it (armed before the door, as make_your_main_guy_gate does) */
      /* the tape, then the town (a tap skips the tape once it is armed), the way he starts */
      for (let i = 0; i < 160; i++) { const up = await fr.evaluate(() => !!(window.__SQUAD_UP && window.__SQUAD_UP.armedAt)).catch(() => false); if (up) break; await sleep(250); }
      { const r = await P.evaluate(() => ({ w: innerWidth, h: innerHeight })); await sleep(400); await tap(r.w / 2, r.h * .7); }
      for (let i = 0; i < 80; i++) { if (await fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)).catch(() => false)) break; await sleep(250); }
      await sleep(2500);
      /* upright, the start lands with the crew screen up over the town (measured 11/11: the tape's end opens it); it is the crew
         screen with his company in it, so it is shot as the crew screen and closed with its own DONE before the town */
      const rosterUp = async () => {
        const r = frameOf(P, /ROSTER_SCREEN/); if (!r) return null;
        if (!(await r.evaluate(() => !!(window.BohemiaRosterScreen && BohemiaRosterScreen.state.crew.length)).catch(() => false))) return null;
        const el = await r.frameElement().catch(() => null), bb = el && await el.boundingBox().catch(() => null);
        return bb && bb.width > 4 && bb.height > 4 ? r : null; };
      const crewShot = async (r) => {
        await sleep(2500);
        g.crew = await r.evaluate(() => BohemiaRosterScreen.state.crew.map(m => m && (m.look || m.name) || null)).catch(e => 'ERR ' + e);
        await shot(P, profile + '_crew');
        await r.evaluate(() => { const c = document.getElementById('done'); if (c) c.click(); }).catch(() => {});
        await sleep(1500); };
      { const r0 = await rosterUp(); g.crewAtStart = !!r0; if (r0) { g.crewScreen = true; await crewShot(r0); } }
      /* THE TOWN: his company in it */
      const sf = frameOf(P, /SETTLEMENT_SCREEN/); g.town = !!sf;
      if (sf) {
        await sf.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 20000 }).catch(() => {});
        await sleep(2500);
        /* on its side the town opens with a building's sheet up (the smith, measured): closed first, so the town and the hall's tap are the glass's */
        g.openAtStart = await sf.evaluate(() => BohemiaSettlement.state.open || null).catch(() => null);
        for (let i = 0; i < 3; i++) { const o = await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) { c.click(); return true; } return false; }).catch(() => false); if (!o) break; await sleep(700); }
        g.townCrew = await sf.evaluate(() => BohemiaSettlement.crewHere().map(q => q.look || q.name)).catch(() => null);
        await shot(P, profile + '_town');
        /* THE HALL: the hires (a real tap on the hall) */
        const fb = await (await sf.frameElement()).boundingBox();
        const hx = await sf.evaluate(() => BohemiaSettlement.where('hall')).catch(() => null);
        if (hx && fb) {
          for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'hall').catch(() => false)) break; await tap(fb.x + hx.x, fb.y + hx.y); await sleep(700); }
          await sleep(1800);
          g.hall = await sf.evaluate(() => BohemiaSettlement.state.open === 'hall' ? BohemiaSettlement.recruits().map(r => r.look) : null).catch(() => null);
          await shot(P, profile + '_hall');
          await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }).catch(() => {});
          await sleep(800);
        }
      }
      /* THE CREW SCREEN: CREW on his phone, else the CREW button (unless the start already showed it) */
      if (!g.crewAtStart) {
      const ph = await P.evaluate(() => { const a = document.querySelector('#bohphone .app[data-app="crew"]'); if (!a) return null; const r = a.getBoundingClientRect(); return r.width > 4 && r.height > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }).catch(() => null);
      if (ph) await tap(ph.x, ph.y);
      else if (sf) { const cb = await sf.$('#crew'), bx = cb && await cb.boundingBox(); if (bx && bx.width > 4) await tap(bx.x + bx.width / 2, bx.y + bx.height / 2); }
      let rf = null;
      for (let i = 0; i < 60 && !rf; i++) { rf = await rosterUp(); if (!rf) await sleep(250); }
      g.crewScreen = !!rf;
      if (rf) await crewShot(rf);
      }
      /* THE MAP: his party on the map, the town left the way he leaves it (the phone's LEAVE, else the town's own #leave: the
         way gates/a_town_is_safe_gate.js T3 does), then one step off the door so the party stands on the road */
      fr = frameOf(P, /BOHEMIA_CITY_WORLD/);
      let left = false;
      for (const x of P.frames()) {
        const sel = '#bohphone .app[data-app=leave]';
        if (await x.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.classList.contains('off'); }, sel).catch(() => false)) {
          const loc = x.locator(sel).first(); if (profile === 'phone_portrait') await loc.tap(); else await loc.click(); left = true; break; }
      }
      if (!left) { const tf = frameOf(P, /SETTLEMENT_SCREEN/); if (tf) left = await tf.evaluate(() => { const b = document.getElementById('leave'); if (b) b.click(); return !!b; }).catch(() => false); }
      await sleep(1500);
      g.mapLeft = left;
      g.mapOpen = await fr.evaluate(() => { try { return { open: LOOP.open ? LOOP.open.name : null, frame: LOOP.frame ? LOOP.frame.style.display : null }; } catch (e) { return null; } }).catch(() => null);
      await sleep(2000);
      g.mapParty = await fr.evaluate(() => { try { return (LOOP.start.company || []).map(m => m.look || m.name || null); } catch (e) { return null; } }).catch(() => null);
      await shot(P, profile + '_map');
      /* THE FIGHT: a road fight off the town, his company dealt */
      const ff = await roadFightOffTheTown(d);
      g.fight = !!ff;
      if (ff) {
        await ff.evaluate(() => { window.__shown = FIGHT.shown; FIGHT.shown = function () { return true; }; }).catch(() => {});
        await sleep(3000);
        g.fightYou = await ff.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => u.look)).catch(() => null);
        /* the camera on his men, the way his pinch puts it there (the fight's own camera, as gates/heights_you_can_read_gate.js
           and nobody_on_anybody set it): centred on his side at the near zoom, then held */
        g.fightCam = await ff.evaluate(() => { try {
          const M = FIGHT.S.units.filter(u => u.side === 'you'); if (!M.length) return null;
          const x = M.reduce((s, u) => s + u.x, 0) / M.length, y = M.reduce((s, u) => s + u.y, 0) / M.length;
          FIGHT_UI.glide = null; FIGHT_UI.pinched = true; FIGHT_UI.openUntil = 1e12;
          FIGHT_UI.zoom = (FIGHT_UI.near || FIGHT_UI.zoom) * 0.85; FIGHT_UI.cx = (x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (y + .5) * FIGHT_UI.th;
          if (typeof clampCam === 'function') clampCam(); if (typeof hud === 'function') hud();
          return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, zoom: FIGHT_UI.zoom };
        } catch (e) { return String(e); } }).catch(e => String(e));
        await sleep(6000);
        await shot(P, profile + '_fight');
      }
      g.errors = d.errs.map(String).slice(0, 8); g.nErrors = d.errs.length;
    } catch (e) { g.failed = String(e && e.message || e); }
    if (d) await d.close().catch(() => {});
    report.push(g);
    console.log(profile, JSON.stringify({ town: g.town, hall: g.hall && g.hall.length, crew: g.crew && g.crew.length, fight: g.fight, fightYou: g.fightYou, errors: g.nErrors, failed: g.failed }));
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(report, null, 1));
})();

#!/usr/bin/env node
/* HIS PLACE: ONE CAMERA, AND IT BUILDS, its VOTE card's pictures (11/28/26, ask row 788; Paolo: 'one camera angle from that angle from
   now on... I clicked, but I couldn't build anything... the plots aren't even on the correct part of the land').
   The demo as he plays it, a phone upright and sideways: a fresh place planted on day 2, his place opened; every step by a real tap:
   PLOTS (the twelve plots painted on their ground), DESK (a tap on a middle plot: the desk for that plot, the plot lit), TAPED (the water
   tank bought there and the training yard on a front plot: each taped off for the night on the plot he tapped), MORNING (the next day,
   both standing where he put them). Writes records/target/home_base/one_camera_<profile>_<shot>.jpg and their facts (one_camera_facts.json).
   Run: node tools/bohemia_home_base_one_camera_card_11_28_26.js [--only phone_portrait] */
'use strict';
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/home_base'), TMP = path.join(require('os').tmpdir(), 'hb_one_camera');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TMP, { recursive: true });
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !arg('--only') || p === arg('--only'));
const factsPath = path.join(OUT, 'one_camera_facts.json');
const facts = fs.existsSync(factsPath) ? JSON.parse(fs.readFileSync(factsPath, 'utf8')) : {};
/* a png shot to a half-size jpg (the card's own weight) */
function jpg(png, name) {
  const out = path.join(OUT, name + '.jpg');
  const r = spawnSync('python3', ['-c', 'import sys\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert("RGB")\nim=im.resize((im.width//2,im.height//2))\nim.save(sys.argv[2],quality=82)', png, out]);
  if (r.status) throw new Error(String(r.stderr)); return path.relative(ROOT, out);
}
(async () => {
  for (const prof of PROFS) {
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr, F2 = facts[prof] = {};
    for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data())).catch(() => false)) break; await P.waitForTimeout(250); }
    const openHis = async () => {
      await F.evaluate(() => { try { loopClose(); } catch (e) {} const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
      let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on) && !!window.__HOME_PLOTS_DRAWN(); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
      if (fr) { for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => { const a = document.getElementById('arrive'); return !(a && a.classList.contains('on')); }).catch(() => false)) break; await P.waitForTimeout(250); } await P.waitForTimeout(3500); }
      return fr; };
    await F.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = 2; const x0 = city.x, y0 = city.y; let at = null;
      for (let r = 2; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && ch.g.ok) { at = [ch.x, ch.y]; break; } }
      BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = Math.max(w.tape | 0, 30); wagonPut(w); try { localStorage.setItem('bohemia.hints.said', JSON.stringify({ map: 1, town: 1, camp: 1 })); } catch (e) {} });
    let fr = await openHis(); let fb = await (await fr.frameElement()).boundingBox();
    const shot = async (name) => { const f = path.join(TMP, prof + '_' + name + '.png'); await P.screenshot({ path: f }); F2[name] = jpg(f, 'one_camera_' + prof + '_' + name); };
    const closeS = async () => { const c = await fr.evaluate(() => { const x = document.getElementById('close'); if (!x || !document.getElementById('sheet').classList.contains('on')) return null; const r = x.getBoundingClientRect(); return r.width > 1 ? [r.left + r.width / 2, r.top + r.height / 2] : null; }); if (c) { await P.touchscreen.tap(fb.x + c[0], fb.y + c[1]); await P.waitForTimeout(900); } };
    const tapPlot = async n => { const p = await fr.evaluate(n => window.__HOME_PLOT_AT(n), n); await P.touchscreen.tap(fb.x + p.x, fb.y + p.y); await P.waitForTimeout(1600); };
    const press = async q => { const w = await fr.evaluate(q => { const e = document.querySelector(q); if (!e || e.disabled) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, q); if (w) { await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]); await P.waitForTimeout(1600); } return !!w; };
    await shot('plots'); F2.plots_drawn = await fr.evaluate(() => window.__HOME_PLOTS_DRAWN());
    await tapPlot(7); await P.waitForTimeout(600); await shot('desk');
    F2.desk = await fr.evaluate(() => ({ lot: window.__HOME_PLOTS_DRAWN().lot, greyed: [...document.querySelectorAll('#sbody .act[data-build], #sbody .act[data-place]')].filter(e => e.disabled).map(e => (e.dataset.build || e.dataset.place) + ': ' + ((e.querySelector('em') || {}).textContent || '')) }));
    await press('#sbody .act[data-build="tank"]'); F2.tank = await fr.evaluate(() => window.__HOME_LANDED); await closeS();
    await tapPlot(2); await press('#sbody .act[data-place="yard"]'); F2.yard = await fr.evaluate(() => window.__HOME_LANDED); await closeS();
    await P.waitForTimeout(1200); await shot('taped'); F2.taped = await fr.evaluate(() => window.__HOME_PLOTS_DRAWN().slots);
    await F.evaluate(() => { const bk = lotBookFor(BohemiaBetween.mine()); for (const k in bk.lots) bk.lots[k].done = true; DAY.day = DAY.day + 1; try { lotWake(); } catch (e) {} try { BohemiaHomeMap.morning(); } catch (e) {} });
    fr = await openHis(); fb = await (await fr.frameElement()).boundingBox();
    await shot('morning'); F2.morning = await fr.evaluate(() => window.__HOME_PLOTS_DRAWN().slots);
    console.log(prof, JSON.stringify(F2));
    await d.close();
  }
  fs.writeFileSync(factsPath, JSON.stringify(facts, null, 1));
})().catch(e => { console.error(e); process.exit(1); });

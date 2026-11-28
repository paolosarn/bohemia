#!/usr/bin/env node
/* HOME BASE 6, 11/27/26: YOUR PLACE IS EASY: its VOTE card, a clip that PLAYS THE FLOW (VAMILY rule 492(a); the coordinator's routine:
   'each build with a VOTE card that plays the flow'). A new game on the demo, once upright and once sideways, the whole walk a stranger
   makes by real taps on the glass: day 2 on the map (his best man says it), LOOK FOR GROUND, bad ground and WALK THERE, the walk, 'This
   is it. Plant it.', PLANT HERE, 'Are you sure?', PLANT HERE, GO IN, 'Tap an empty lot to build.', the lot, a build, the desk closed,
   'It goes up tonight.' The glass is filmed four times a second as it is; each tap is marked with a ring where the finger went.
   Writes records/target/home_base/your_place_is_easy.mp4 (upright, then sideways) and records/target/vote_first/home-base-your-place-is-easy-11-27.webp.
   Run: node tools/bohemia_home_base_your_place_is_easy_card_11_27_26.js --only phone_portrait, then --only phone_landscape (one way fits
   a short clock; the clip is made when both are in). --clip makes it from the frames already taken.
   BUILD 11/28b (plan A, the spots on the map): --card the-best-spot films the marks too (a tap on another mark, then on his pick) into
   records/target/home_base/your_place_the_best_spot.mp4 and records/target/vote_first/home-base-the-best-spot-on-the-map-11-28.webp.
   BUILD 11/28d (plan H, the way back): --card the-way-back plants a place with his training yard up, walks him away by the map's own
   travel, then films the YOUR PLACE button, the tap, the walk home and his place opening: your_place_the_way_back.mp4. */
'use strict';
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/home_base');
fs.mkdirSync(OUT, { recursive: true });
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !arg('--only') || p === arg('--only'));
const SPOTS = arg('--card') === 'the-best-spot', BACK = arg('--card') === 'the-way-back';
const CLIP = BACK ? { mp4: 'your_place_the_way_back.mp4', first: 'home-base-the-way-back-11-28.webp', tmp: 'hb6-back-frames' }
  : SPOTS ? { mp4: 'your_place_the_best_spot.mp4', first: 'home-base-the-best-spot-on-the-map-11-28.webp', tmp: 'hb6-spot-frames' } : { mp4: 'your_place_is_easy.mp4', first: 'home-base-your-place-is-easy-11-27.webp', tmp: 'hb6-easy-frames' };
const FR = path.join(require('os').tmpdir(), CLIP.tmp); fs.mkdirSync(FR, { recursive: true });

async function film(prof) {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  const GL = require(path.join(ROOT, 'tools/bohemia_your_place_glass.js'));
  const dir = path.join(FR, prof); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
    for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
    await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
  const P = d.page, F = d.fr;
  for (let i = 0; i < 60; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.__YOUR_PLACE)).catch(() => false)) break; await P.waitForTimeout(250); }
  await F.evaluate(() => { try { loopClose(); } catch (e) {} }); await P.waitForTimeout(1500);
  /* the same start the gate takes: ground that cannot be planted, better ground nearest */
  await F.evaluate(() => { const x0 = city.x, y0 = city.y, c = [];
    for (let r = 0; r < 16 && c.length < 30; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && !ch.g.ok) c.push([x, y]); }
    let best = null; c.forEach(p => { city.x = p[0]; city.y = p[1]; const b = BohemiaHomeMap.state().better; if (b && (!best || b.d < best.d)) best = { at: p, d: b.d }; });
    if (best) { city.x = best.at[0]; city.y = best.at[1]; } else { city.x = x0; city.y = y0; } window.HUNT_T0 = performance.now() - 120000; try { render(); } catch (e) {} });
  if (BACK) await F.evaluate(() => { DAY.day = 2; const ch = BohemiaHomeMap.choose(city.x, city.y); let at = null, x0 = city.x, y0 = city.y;
      for (let r = 0; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const c = BohemiaHomeMap.choose(x, y); if (c && c.g && c.g.ok) { at = [c.x, c.y]; break; } }
      BohemiaHomeMap.plantAt(at[0], at[1]); BohemiaHomeMap.placeBuild('yard');
      for (let d = 6; d < 12; d++) for (let dy = -d; dy <= d; dy++) for (let dx = -d; dx <= d; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue; const x = at[0] + dx, y = at[1] + dy;
        if (cityWalkable(x, y) && !loopTownAt(x, y, 0)) { travelStop(); city.x = x; city.y = y; try { render(); } catch (e) {} return; } } });
  const frames = [], taps = [], t0 = Date.now(); let on = true, n = 0;
  const rec = (async () => { while (on) { const t = Date.now() - t0, f = path.join(dir, String(n++).padStart(4, '0') + '.jpg');
    try { await P.screenshot({ path: f, type: 'jpeg', quality: 80, scale: 'css' }); frames.push({ f, t }); } catch (e) {} await P.waitForTimeout(120); } })();
  const step = async (s, ms) => { const r = await GL.until(F, s, ms || 40000); return r; };
  const tap = async (id, settle) => { await GL.until(F, [], 20000); const b = await GL.button(P, F, id); if (!b) return null; taps.push({ t: Date.now() - t0, x: b.x, y: b.y }); await P.touchscreen.tap(b.x, b.y); await P.waitForTimeout(settle || 900); return b; };
  const hold = ms => P.waitForTimeout(ms);
  await hold(1500);
  if (BACK) { await step('home', 30000); await hold(3000); await tap('home', 1200);
    for (let i = 0; i < 100; i++) { await P.waitForTimeout(400); await F.evaluate(() => { try { if (window.BohemiaRoadEvents && BohemiaRoadEvents.up()) BohemiaRoadEvents.close(); } catch (e) {} }); if (await F.evaluate(() => BohemiaHomeMap.flowFacts().inside)) break; }
    await hold(5000); on = false; await rec; await d.close();
    fs.writeFileSync(path.join(dir, 'film.json'), JSON.stringify({ prof, frames, taps }, null, 1)); console.log(prof, frames.length, 'frames', taps.length, 'taps'); return; }
  await F.evaluate(() => { DAY.day = 2; try { render(); } catch (e) {} });
  await step('offer'); await hold(3000); await tap('look');
  await step(['bad', 'good']); await hold(3200);
  if (SPOTS) {   /* the marks: a tap on another, what it gives; a tap on his pick, 'That one.' */
    const fb = await (await F.frameElement()).boundingBox();
    const mk = () => F.evaluate(() => [...document.querySelectorAll('#ypmarks.on button')].filter(b => b.style.visibility !== 'hidden').map(b => { const r = b.getBoundingClientRect(); return { best: b.classList.contains('best'), x: r.left + r.width / 2, y: r.top + r.height / 2 }; }));
    await GL.until(F, [], 20000); const o = (await mk()).filter(m => !m.best)[0];   /* the marks hide with the panel while another face speaks */
    if (o) { taps.push({ t: Date.now() - t0, x: fb.x + o.x, y: fb.y + o.y }); await P.touchscreen.tap(fb.x + o.x, fb.y + o.y); await step('spot', 15000); await hold(3200); }
    await GL.until(F, [], 20000); const b = (await mk()).filter(m => m.best)[0];
    if (b) { taps.push({ t: Date.now() - t0, x: fb.x + b.x, y: fb.y + b.y }); await P.touchscreen.tap(fb.x + b.x, fb.y + b.y); await step('pick', 15000); await hold(3200); }
  }
  if (['bad', 'spot', 'pick'].indexOf((await GL.state(F)).step) >= 0) { await tap('walk', 600);
    for (let i = 0; i < 120; i++) { await P.waitForTimeout(500); await F.evaluate(() => { try { if (window.BohemiaRoadEvents && BohemiaRoadEvents.up()) BohemiaRoadEvents.close(); } catch (e) {} }); const s = await GL.state(F); if (s && s.step === 'arrived' && s.shown) break; }
    await hold(2600); }
  await tap('plant'); await step('sure'); await hold(2800); await tap('plant', 1500);
  await step('planted'); await hold(3000); await tap('in', 1200);
  let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
  await step('inside'); await hold(3000);
  if (fr) { const sfb = await (await fr.frameElement()).boundingBox(), lot = await fr.evaluate(() => { const w = BohemiaSettlement.where('build'); return w ? [w.x, w.y] : null; });
    if (lot) { for (let i = 0; i < 3; i++) { const w = await fr.evaluate(() => { const w = BohemiaSettlement.where('build'); return w ? [w.x, w.y] : null; }) || lot;   /* the camera may be pushing in: tap again */
        taps.push({ t: Date.now() - t0, x: sfb.x + w[0], y: sfb.y + w[1] }); await P.touchscreen.tap(sfb.x + w[0], sfb.y + w[1]); await hold(1500); if (await fr.evaluate(() => !!BohemiaSettlement.state.open)) break; }
      await hold(1100);
      const b = await fr.evaluate(() => { const e = [...document.querySelectorAll('#sbody .act[data-build]')].filter(x => !x.disabled)[0]; if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
      if (b) { taps.push({ t: Date.now() - t0, x: sfb.x + b[0], y: sfb.y + b[1] }); await P.touchscreen.tap(sfb.x + b[0], sfb.y + b[1]); await hold(2200); }
      const cx = await fr.evaluate(() => { const x = document.getElementById('close'); if (!x) return null; const r = x.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
      if (cx) { taps.push({ t: Date.now() - t0, x: sfb.x + cx[0], y: sfb.y + cx[1] }); await P.touchscreen.tap(sfb.x + cx[0], sfb.y + cx[1]); } } }
  await step('built', 15000); await hold(4500);
  on = false; await rec;
  const said = await GL.state(F);
  await d.close();
  fs.writeFileSync(path.join(dir, 'film.json'), JSON.stringify({ prof, frames, taps, said: said && said.said }, null, 1));
  console.log(prof, frames.length, 'frames', taps.length, 'taps', ((Date.now() - t0) / 1000).toFixed(0) + ' s', JSON.stringify(said && said.said.map(x => x.step)));
}
(async () => {
  if (!process.argv.includes('--clip')) for (const p of PROFS) await film(p);
  const have = ['phone_portrait', 'phone_landscape'].filter(p => fs.existsSync(path.join(FR, p, 'film.json')));
  if (have.length < 2) { console.log('frames for', have.join(','), '- run the other way, then the clip is made'); process.exit(0); }
  const py = fs.readFileSync(path.join(ROOT, 'tools/bohemia_home_base_your_place_is_easy_card_11_27_26.py'), 'utf8');
  const r = spawnSync('python3', ['-c', py, JSON.stringify({ films: have.map(p => path.join(FR, p, 'film.json')), out: path.join(OUT, CLIP.mp4),
    first: path.join(ROOT, 'records/target/vote_first/' + CLIP.first), tmp: FR })], { encoding: 'utf8' });
  console.log(r.stdout.trim(), r.stderr.trim().slice(-800));
  process.exit(r.status || 0);
})().catch(e => { console.error(e); process.exit(1); });

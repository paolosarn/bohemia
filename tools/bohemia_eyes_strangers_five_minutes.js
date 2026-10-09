#!/usr/bin/env node
/* BOHEMIA -- [a stranger's five minutes judged] ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17, rule 78. 10/9/26.
 *
 * Walks the real demo as a stranger would, with real taps, reusing proven reach patterns:
 * tools/bohemia_through_the_title.js (the title -> NEW GAME), and
 * gates/the_loop_plays_on_the_map_gate.js's own L2-L7 touch logic (map -> settlement -> board ->
 * contract -> job -> fight), REUSED not reinvented, since that gate already proves this exact path
 * works end to end. What this tool adds: a real screenshot saved at each stage, for this lane's
 * own visual judgment against the horror bible, the vibe-coded/AI-slop tells, and Nielsen's
 * heuristics -- none of which that gate's own pass/fail checks make.
 *
 * Honest about reach: if a named screen (market, bag) is not reliably reachable within this
 * round's effort, it is reported as not reached, not faked.
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const OUTDIR = path.join(ROOT, 'records', 'eyes_strangers_five_minutes');

const shots = [];
async function shot(d, name) {
  const p = path.join(OUTDIR, name + '.png');
  await d.page.screenshot({ path: p });
  shots.push(name);
  console.log('  [shot] ' + name);
  return p;
}

(async () => {
  try { fs.mkdirSync(OUTDIR, { recursive: true }); } catch (e) {}
  const d = await D.open({ arm: "try{localStorage.clear();sessionStorage.clear();}catch(e){}", keepCards: true });
  const p = d.page;
  try {
    await p.waitForTimeout(1500);
    // 1. TITLE
    await shot(d, '1_title');
    const pressed = await throughTheTitle(p, 60000);
    console.log('  pressed NEW GAME: ' + pressed);
    await p.waitForTimeout(800);
    // 2. PICKS (the loading screen's own terminal picks, before BEGIN)
    await shot(d, '2_picks');
    // wait for BEGIN then press it
    const beginAt = Date.now() + 90000;
    let began = false;
    while (Date.now() < beginAt) {
      const r = await p.evaluate(() => { const e = document.getElementById('fronttap') || document.getElementById('front');
        if (!e) return null; const t = (e.textContent || '').trim(); if (t !== 'BEGIN') return { waiting: t }; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
      if (r && r.x !== undefined) { await p.touchscreen.tap(r.x, r.y).catch(() => p.mouse.click(r.x, r.y)); began = true; break; }
      await p.waitForTimeout(400);
    }
    console.log('  pressed BEGIN: ' + began);
    await p.waitForTimeout(2500);
    // 3. MAP
    await shot(d, '3_map');
    const fr = d.fr || (await (async () => { for (const f of p.frames()) { if (await f.evaluate(() => typeof MODE !== 'undefined').catch(() => false)) return f; } return null; })());
    const onMap = fr ? await fr.evaluate(() => MODE === 'city').catch(() => false) : false;
    console.log('  on map (MODE==city): ' + onMap);
    if (!fr || !onMap) { console.log('  COULD NOT CONFIRM THE MAP -- stopping the scripted walk here, what was shot stands.'); await d.close(); return finish(); }
    // reuse the loop gate's own touch/contract pattern
    const touchCell = async (x, y) => { const q = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const i = __CITY.isoAt(x, y); return { x: r.left + i.sx, y: r.top + i.sy + TH / 2 }; }, [x, y]); await p.touchscreen.tap(q.x, q.y).catch(() => p.mouse.click(q.x, q.y)); };
    const waitFor = async (fn, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await fn()) return true; await p.waitForTimeout(300); } return false; };
    const town = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    console.log('  nearest town: ' + JSON.stringify(town));
    if (!town) { console.log('  NO TOWN TO WALK TO -- stopping here.'); await d.close(); return finish(); }
    await touchCell(town.x, town.y);
    const opened = await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)).catch(() => false), 25000);
    await p.waitForTimeout(1500);
    console.log('  settlement opened: ' + opened);
    // 4. SETTLEMENT
    await shot(d, '4_settlement');
    const fh = await p.$('#settleFrame') || (fr ? await fr.$('#settleFrame') : null);
    const sf = fh ? await fh.contentFrame() : null;
    const fb = fh ? await fh.boundingBox() : null;
    if (sf && fb) {
      // 5. MARKET: try the smith building directly
      let smith = null;
      for (let i = 0; i < 10 && !smith; i++) { smith = await sf.evaluate(() => (window.BohemiaSettlement && BohemiaSettlement.where) ? BohemiaSettlement.where('smith') : null).catch(() => null); if (!smith) await p.waitForTimeout(250); }
      if (smith) { await p.touchscreen.tap(fb.x + smith.x, fb.y + smith.y).catch(() => {}); await p.waitForTimeout(900); await shot(d, '5_market'); }
      else console.log('  MARKET (smith) not found this round, skipped.');
      // close whatever opened
      await sf.evaluate(() => { const c = document.querySelector('#sheet .close, #sheet button.x, [data-k=close]'); if (c) c.click(); }).catch(() => {});
      await p.waitForTimeout(500);
      // 6. BAG: look for an inventory/bag affordance
      const bagKey = await sf.evaluate(() => (window.BohemiaSettlement && BohemiaSettlement.order) ? BohemiaSettlement.order().find(k => /bag|inv/i.test(k)) : null).catch(() => null);
      console.log('  bag key found: ' + bagKey);
      if (bagKey) { const xy = await sf.evaluate(k => BohemiaSettlement.where(k), bagKey); await p.touchscreen.tap(fb.x + xy.x, fb.y + xy.y).catch(() => {}); await p.waitForTimeout(900); await shot(d, '6_bag'); }
      else console.log('  BAG not found by a building key this round, skipped (named, not faked).');
    } else console.log('  settlement iframe not reached, market/bag skipped.');

    // 7. FIGHT: take the board contract, go to the job
    const tapText = async (re) => { if (!sf) return null; const re2 = new RegExp(re.source, 'i'); const el = await sf.evaluate((src) => { const re = new RegExp(src, 'i'); const els = [...document.querySelectorAll('button,.pl,.hot,a,div')].filter(e => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return r.width > 20 && r.height > 20 && st.display !== 'none' && re.test((e.textContent || '').trim()); }); els.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height); const e = els[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, re2.source); if (el) await p.touchscreen.tap(fb.x + el.x, fb.y + el.y).catch(() => {}); return el; };
    let bp = null; for (let i = 0; i < 20 && sf && !bp; i++) { bp = await sf.evaluate(() => (window.BohemiaSettlement && BohemiaSettlement.where) ? BohemiaSettlement.where('board') : null).catch(() => null); if (!bp) await p.waitForTimeout(250); }
    if (bp) await p.touchscreen.tap(fb.x + bp.x, fb.y + bp.y).catch(() => {});
    await p.waitForTimeout(900);
    const offer = sf ? await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button, #sheet .act, #sheet div')].filter(e => /battery$/i.test((e.textContent || '').trim()) && e.getBoundingClientRect().height > 20).sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0]; return b ? b.textContent.trim().replace(/\d+ battery$/i, '').trim() : null; }).catch(() => null) : null;
    console.log('  board offer: ' + offer);
    if (offer) { await tapText(new RegExp('^' + offer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); await p.waitForTimeout(800); await tapText(/^Take it/); await p.waitForTimeout(800); }
    await tapText(/^LEAVE$/); await p.waitForTimeout(900);
    const held = await fr.evaluate(() => LOOP.held.map(h => ({ id: h.id, t: h.target }))).catch(() => []);
    console.log('  held contracts: ' + JSON.stringify(held));
    if (held.length) {
      const job = held[0];
      await touchCell(job.t.x, job.t.y);
      const shell = () => p.evaluate(() => ({ fight: !!CITYFIGHT })).catch(() => ({ fight: false }));
      const reached = await waitFor(() => shell().then(s => s.fight), 25000);
      console.log('  reached the fight: ' + reached);
      if (reached) {
        await p.waitForTimeout(1500);
        await shot(d, '7_fight');
        // let it play to a result via AUTO
        let cf = null, box = null;
        for (let i = 0; i < 60 && !cf; i++) { const h = await p.$('#fightFrame'); if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board).catch(() => false)) { cf = f; box = await h.boundingBox(); } } if (!cf) await p.waitForTimeout(250); }
        if (cf) {
          await cf.evaluate(() => { FIGHT_UI.speed = 6; }).catch(() => {});
          const b = await cf.evaluate(() => { const r = document.getElementById('bauto').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }).catch(() => null);
          if (b) await p.touchscreen.tap(box.x + b[0], box.y + b[1]).catch(() => {});
          const t0 = Date.now();
          while (Date.now() - t0 < 120000) { if (await cf.evaluate(() => FIGHT.S.over).catch(() => true)) break; await p.waitForTimeout(500); }
          await p.waitForTimeout(1200);
          // 8. RECAP (the fight's own result card, before it hands back to the map)
          await shot(d, '8_recap');
          await waitFor(() => shell().then(s => !s.fight), 15000);
          await p.waitForTimeout(1500);
          // 9. HOME (back on the map, the phone with the news)
          await shot(d, '9_home');
        } else console.log('  fight iframe not confirmed, recap/home skipped.');
      }
    } else console.log('  no contract held, fight/recap/home skipped.');
  } catch (e) { console.log('  WALK STOPPED: ' + e.message); }
  try { await d.close(); } catch (e) {}
  finish();
  function finish() {
    fs.writeFileSync(path.join(OUTDIR, 'shots_taken.json'), JSON.stringify(shots, null, 2));
    console.log('  shots taken: ' + shots.join(', '));
  }
})().catch(e => { console.log('  FAIL: ' + e.stack); process.exit(1); });

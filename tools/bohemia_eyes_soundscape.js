#!/usr/bin/env node
/* BOHEMIA -- [the soundscape judged] ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17, rule 80a. 10/10/26.
 *
 * Counts distinct sounds and their level under the song on the three real screens (map,
 * settlement, fight), armed by round one's school
 * (records/BOHEMIA_EYES_SOUNDSCAPE_ROUND_1_SCHOOL_THE_HOOK_ALREADY_EXISTS_MASKING_IS_THE_REAL_REASON_10_9_26.md):
 *
 * THE HOOK is tools/bohemia_eyes_ears_live.js's own (E4, 9/5) wrap-not-replace pattern on
 * window.playSFX, extended with the one field round one found missing -- the vector `v` that
 * playSFX already builds and hands to BOH_SFX.render(v, AC, dest, at) carries v.gain, discarded
 * by the old wrap; this tool keeps it, alongside MUS.MAST.gain.value at the same instant, so
 * every logged event carries its own level against the song's, not just a count.
 *
 * THE REACH is this session's own proven patterns (never re-derived): toMap() for the map,
 * the loop gate's settlement/board/contract/job reach for the settlement and the fight, the same
 * steps used today in tools/bohemia_eyes_strangers_five_minutes.js and
 * tools/bohemia_eyes_far_stop_pixels.js.
 *
 * Per screen: the hook resets, sixty real seconds pass (or until the fight ends, whichever is
 * first -- reported honestly, never padded), then the counts and levels are read back.
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const OUTDIR = path.join(ROOT, 'records', 'eyes_soundscape');

const SECONDS = 60;

/* THE HOOK, ADAPTED FROM tools/bohemia_eyes_ears_live.js (E4): wrap, never replace, so the
   real sound still plays; a positive control at the end proves the counters are not blind. */
async function installHook(page) {
  return page.evaluate(() => {
    window.__SS_ASKED = {};       /* event name -> count, this screen only */
    window.__SS_LEVELS = [];      /* {ev, gain, musGain, t}, this screen only */
    window.__SS_RENDERS = 0;
    const musGain = () => { try { return MUS.MAST ? +MUS.MAST.gain.value.toFixed(4) : null; } catch (e) { return null; } };
    if (typeof BOH_SFX !== 'undefined' && BOH_SFX.render && !BOH_SFX.render.__ssWrapped) {
      const real = BOH_SFX.render;
      const w = function (v, AC, dest, at) {
        window.__SS_RENDERS++;
        try {
          const ev = window.__SS_LAST_EV || '?';
          window.__SS_LEVELS.push({ ev, gain: (v && typeof v.gain === 'number') ? +v.gain.toFixed(4) : null,
            musGain: musGain(), t: +Date.now() });
        } catch (e) {}
        return real.apply(this, arguments);
      };
      w.__ssWrapped = true; BOH_SFX.render = w;
    }
    if (typeof window.playSFX === 'function' && !window.playSFX.__ssWrapped) {
      const real = window.playSFX;
      const w = function (ev, when, mul) {
        try { window.__SS_ASKED[ev] = (window.__SS_ASKED[ev] || 0) + 1; window.__SS_LAST_EV = ev; } catch (e) {}
        return real.apply(this, arguments);
      };
      w.__ssWrapped = true; window.playSFX = w;
    }
    return { sfxWrapped: !!(window.playSFX && window.playSFX.__ssWrapped),
      renderWrapped: !!(typeof BOH_SFX !== 'undefined' && BOH_SFX.render && BOH_SFX.render.__ssWrapped) };
  });
}

async function resetHook(page) {
  await page.evaluate(() => { window.__SS_ASKED = {}; window.__SS_LEVELS = []; window.__SS_RENDERS = 0; });
}

async function readHook(page) {
  return page.evaluate(() => ({ asked: window.__SS_ASKED || {}, levels: window.__SS_LEVELS || [],
    renders: window.__SS_RENDERS || 0 }));
}

/* THE POSITIVE CONTROL: fire one sound by hand after all three screens, and refuse to trust
   any zero above if the counters never moved for it. */
async function control(page) {
  return page.evaluate(async () => {
    const before = window.__SS_RENDERS || 0;
    try { if (typeof playSFX === 'function') playSFX('door_open'); } catch (e) {}
    await new Promise(r => setTimeout(r, 500));
    return { before, after: window.__SS_RENDERS || 0, moved: (window.__SS_RENDERS || 0) > before };
  });
}

(async () => {
  try { fs.mkdirSync(OUTDIR, { recursive: true }); } catch (e) {}
  const d = await D.open({ keepCards: true });
  const p = d.page;
  const report = { at: new Date().toISOString(), screens: {} };
  try {
    await p.waitForTimeout(1200);
    await throughTheTitle(p, 60000).catch(() => false);
    await p.waitForTimeout(600);

    const hookInfo = await installHook(p);
    report.hookInfo = hookInfo;
    console.log('  [hook] playSFX wrapped: ' + hookInfo.sfxWrapped + ', BOH_SFX.render wrapped: ' + hookInfo.renderWrapped);

    // 1. MAP
    const s0 = await d.toMap();
    console.log('  [driver] the map is up: czoom ' + s0.czoom);
    await p.waitForTimeout(1000);
    await resetHook(p);
    const mapT0 = Date.now();
    await p.waitForTimeout(SECONDS * 1000);
    const mapRead = await readHook(p);
    report.screens.map = { seconds: +((Date.now() - mapT0) / 1000).toFixed(1), ...mapRead };
    console.log('  [map] ' + Object.keys(mapRead.asked).length + ' distinct sounds, ' + mapRead.renders + ' rendered');

    // 2. SETTLEMENT: tap the nearest town, the loop gate's own proven pattern
    const fr = d.fr;
    const touchCell = async (x, y) => { const q = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const i = __CITY.isoAt(x, y); return { x: r.left + i.sx, y: r.top + i.sy + TH / 2 }; }, [x, y]); await p.touchscreen.tap(q.x, q.y).catch(() => p.mouse.click(q.x, q.y)); };
    const waitFor = async (fn, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await fn()) return true; await p.waitForTimeout(300); } return false; };
    const town = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd >= 2 && (!best || dd < best.d)) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    let settlementOpened = false;
    if (town) {
      await touchCell(town.x, town.y);
      settlementOpened = await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)).catch(() => false), 25000);
      await p.waitForTimeout(1500);
    }
    console.log('  [driver] settlement opened: ' + settlementOpened + ' (' + (town ? town.n : 'no town found') + ')');
    if (settlementOpened) {
      await resetHook(p);
      const setT0 = Date.now();
      await p.waitForTimeout(SECONDS * 1000);
      const setRead = await readHook(p);
      report.screens.settlement = { seconds: +((Date.now() - setT0) / 1000).toFixed(1), town: town.n, ...setRead };
      console.log('  [settlement] ' + Object.keys(setRead.asked).length + ' distinct sounds, ' + setRead.renders + ' rendered');
    } else {
      report.screens.settlement = { error: 'settlement not reached this run' };
    }

    // 3. FIGHT: take the board contract, go to the job, same reach as [a stranger's five minutes judged]
    const fh = await p.$('#settleFrame') || (fr ? await fr.$('#settleFrame') : null);
    const sf = fh ? await fh.contentFrame() : null;
    const fb = fh ? await fh.boundingBox() : null;
    let reachedFight = false;
    if (sf && fb && settlementOpened) {
      let bp = null; for (let i = 0; i < 20 && !bp; i++) { bp = await sf.evaluate(() => (window.BohemiaSettlement && BohemiaSettlement.where) ? BohemiaSettlement.where('board') : null).catch(() => null); if (!bp) await p.waitForTimeout(250); }
      if (bp) await p.touchscreen.tap(fb.x + bp.x, fb.y + bp.y).catch(() => {});
      await p.waitForTimeout(900);
      const offer = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button, #sheet .act, #sheet div')].filter(e => /battery$/i.test((e.textContent || '').trim()) && e.getBoundingClientRect().height > 20).sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height)[0]; return b ? b.textContent.trim().replace(/\d+ battery$/i, '').trim() : null; }).catch(() => null);
      const tapText = async (re) => { const el = await sf.evaluate((src) => { const re2 = new RegExp(src, 'i'); const els = [...document.querySelectorAll('button,.pl,.hot,a,div')].filter(e => { const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return r.width > 20 && r.height > 20 && st.display !== 'none' && re2.test((e.textContent || '').trim()); }); els.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height); const e = els[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, re.source); if (el) await p.touchscreen.tap(fb.x + el.x, fb.y + el.y).catch(() => {}); return el; };
      console.log('  [driver] board offer: ' + offer);
      if (offer) { await tapText(new RegExp('^' + offer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); await p.waitForTimeout(800); await tapText(/^Take it/); await p.waitForTimeout(800); }
      await tapText(/^LEAVE$/); await p.waitForTimeout(900);
      const held = await fr.evaluate(() => LOOP.held.map(h => ({ id: h.id, t: h.target }))).catch(() => []);
      console.log('  [driver] held contracts: ' + JSON.stringify(held));
      if (held.length) {
        await touchCell(held[0].t.x, held[0].t.y);
        reachedFight = await waitFor(() => p.evaluate(() => !!CITYFIGHT).catch(() => false), 25000);
      }
    }
    console.log('  [driver] reached the fight: ' + reachedFight);
    if (reachedFight) {
      await p.waitForTimeout(1500);
      let cf = null, box = null;
      for (let i = 0; i < 60 && !cf; i++) { const h = await p.$('#fightFrame'); if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board).catch(() => false)) { cf = f; box = await h.boundingBox(); } } if (!cf) await p.waitForTimeout(250); }
      if (cf) {
        await resetHook(p);
        const fightT0 = Date.now();
        const b = await cf.evaluate(() => { const r = document.getElementById('bauto').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }).catch(() => null);
        if (b) await p.touchscreen.tap(box.x + b[0], box.y + b[1]).catch(() => {});
        const deadline = fightT0 + SECONDS * 1000;
        while (Date.now() < deadline) {
          const over = await cf.evaluate(() => FIGHT.S.over).catch(() => true);
          if (over) break;
          await p.waitForTimeout(500);
        }
        const fightRead = await readHook(p);
        report.screens.fight = { seconds: +((Date.now() - fightT0) / 1000).toFixed(1),
          endedEarly: (Date.now() - fightT0) < SECONDS * 1000 - 1000, ...fightRead };
        console.log('  [fight] ' + Object.keys(fightRead.asked).length + ' distinct sounds, ' + fightRead.renders + ' rendered, '
          + report.screens.fight.seconds + 's (cap ' + SECONDS + 's)');
      } else report.screens.fight = { error: 'fight iframe not confirmed this run' };
    } else report.screens.fight = { error: 'fight not reached this run' };

    report.control = await control(p);
    console.log('  [control] firing one sound by hand moved the render counter: ' + report.control.moved);
  } catch (e) {
    report.error = e.message;
    console.log('  MEASURE STOPPED: ' + e.message);
  }
  try { await d.close(); } catch (e) {}
  fs.writeFileSync(path.join(OUTDIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log('  report written: ' + path.join(OUTDIR, 'report.json'));
})().catch(e => { console.log('  FAIL: ' + e.stack); process.exit(1); });

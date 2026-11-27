#!/usr/bin/env node
/* THE STALL'S STRIP, MEASURED (FIXES 4 11/27, ask row 777 FOUND BY EYES: 'after a buy at the stall upright, "Bought. You have 22 nights
   of food." shows its top half only, the price line's box drawn over its foot'). The demo (or --alpha), a phone upright or on its side,
   Caravans' stall at ten in the morning opened by a finger, one food bought with two taps, then every line in the strip's facts box:
   its own box, the height its words need (scrollHeight) against the height it was given (clientHeight), and whether the next line's
   box starts above its foot. Writes a picture of the strip when --shot <png> is given.
     node tools/bohemia_fixes_four_the_stall_strip.js [phone_portrait|phone_landscape] [--alpha] [--shot out.png]
   Prints one JSON line; changes nothing in the game. */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const Dr = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const SHAPE = process.argv.find(a => /^phone_/.test(a)) || 'phone_portrait', ALPHA = process.argv.includes('--alpha');
const si = process.argv.indexOf('--shot'), SHOT = si >= 0 ? process.argv[si + 1] : null;
/* --plant: the box the way it was (58 px fixed, its lines free to shrink, the price line always shown), for a gate's red */
const PLANT = process.argv.includes('--plant');

(async () => {
  const d = await Dr.open({ profile: SHAPE, alpha: ALPHA || undefined, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, P = d.page, errs = []; P.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const out = { shape: SHAPE, surface: ALPHA ? 'alpha' : 'demo' };
  try {
    await fr.waitForFunction(() => window.LOOP && LOOP.start && typeof townTap === 'function', null, { timeout: 300000 }); await P.waitForTimeout(4000);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} T.min = 600; const n = 'Caravans', b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); });
    for (let i = 0; i < 180; i++) { if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready))) break; await P.waitForTimeout(500); }
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    for (let i = 0; i < 60; i++) { if (await sf.evaluate(() => !!(window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === 'Caravans')).catch(() => false)) break; await P.waitForTimeout(500); }
    await P.waitForTimeout(1500);
    for (let t = 0; t < 4; t++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('stall')); if (xy) { const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await P.touchscreen.tap(hb.x + xy.x * hb.width / iw[0], hb.y + xy.y * hb.height / iw[1]); }
      await P.waitForTimeout(2500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'stall')) break; }
    if (PLANT) await sf.evaluate(() => { const st = document.createElement('style'); st.textContent = '.stallstrip .ss-facts{height:58px!important}.stallstrip .ss-facts>*{flex-shrink:1!important}.stallstrip .ss-facts>.st-what{display:block!important}'; document.head.appendChild(st); });
    /* one food, bought by two real taps on its BUY (the stall's 'tap it twice') */
    const tapBuy = async () => { await sf.evaluate(() => { const b = document.querySelector('#sbody .stline[data-good="food"][data-n="1"] .sb.buy'); if (b) b.scrollIntoView({ block: 'center' }); });
      await P.waitForTimeout(300);
      const r = await sf.evaluate(() => { const b = document.querySelector('#sbody .stline[data-good="food"][data-n="1"] .sb.buy'); if (!b) return null; const q = b.getBoundingClientRect(); return [q.x + q.width / 2, q.y + q.height / 2, innerWidth, innerHeight]; });
      if (!r) return false; const hb = await sfH.boundingBox(); await P.touchscreen.tap(hb.x + r[0] * hb.width / r[2], hb.y + r[1] * hb.height / r[3]); return true; };   /* one tap */
    out.tapped = await tapBuy();   /* the first tap selects; the second, 150 ms after it, buys (the stall's 450 ms window) */
    if (out.tapped) { const r = await sf.evaluate(() => { const b = document.querySelector('#sbody .stline[data-good="food"][data-n="1"] .sb.buy'); const q = b.getBoundingClientRect(); return [q.x + q.width / 2, q.y + q.height / 2, innerWidth, innerHeight]; });
      const hb = await sfH.boundingBox(); await P.waitForTimeout(150); await P.touchscreen.tap(hb.x + r[0] * hb.width / r[2], hb.y + r[1] * hb.height / r[3]); }
    await P.waitForTimeout(900);
    out.strip = await sf.evaluate(() => {
      const st = document.getElementById('stallstrip'), f = st && st.querySelector('.ss-facts'); if (!f) return null;
      const fr2 = f.getBoundingClientRect(), kids = Array.from(f.children).filter(e => getComputedStyle(e).display !== 'none').map(e => { const r = e.getBoundingClientRect(); return { cls: e.className, text: e.textContent.slice(0, 60), top: Math.round(r.top), bottom: Math.round(r.bottom), need: e.scrollHeight, given: e.clientHeight }; });
      const squeezed = kids.filter(k => k.need > k.given + 1).map(k => k.cls), over = [];
      for (let i = 1; i < kids.length; i++) if (kids[i].top < kids[i - 1].bottom - 1 || kids[i].top < kids[i - 1].top + kids[i - 1].need - 1) over.push(kids[i].cls + ' over ' + kids[i - 1].cls);
      const cut = kids.filter(k => k.top + k.need > fr2.bottom + 1).map(k => k.cls);
      return { box: [Math.round(fr2.top), Math.round(fr2.bottom), f.clientHeight, f.scrollHeight], kids, squeezed, over, cutAtTheFoot: cut, stalling: !!document.querySelector('.stalling'), said: (BohemiaSettlement.state && BohemiaSettlement.state.stallSaid) || null };
    });
    if (SHOT) { const st = await sf.$('#stallstrip'); if (st) await st.screenshot({ path: SHOT }); }
  } catch (e) { out.error = String(e.message).slice(0, 200); }
  out.errors = errs.slice(0, 2);
  console.log(JSON.stringify(out));
  await d.close();
})();

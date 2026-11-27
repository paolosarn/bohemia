#!/usr/bin/env node
/* THE VALLEY AT THE STALL, THE VOTE CARD'S PICTURE (ECONOMY FOUR 11/27, rule 485(b)). From the game's own camera (the second votes:
   'show it from the game's camera'): the demo on a phone upright, a new crew, the valley eleven map days on (its food gone), two stalls
   with the food's BUY tapped so the strip says what is left today:
     LEFT  Caravans at first light, OFF the caravan roads: the night dearer, the shelf thin, the stall reads SHORT
     RIGHT a road town in the afternoon (the first with a caravan in and no card of its own): the strip names the caravan and the hour
   Writes records/target/ECONOMY_FOUR_THE_VALLEY_AT_THE_STALL.jpg (and the two halves beside it as .png in the scratch dir given).
   node tools/bohemia_economy_four_the_valley_shot.js [scratch_dir] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const Dr = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/ECONOMY_FOUR_THE_VALLEY_AT_THE_STALL.jpg');
const TMP = process.argv[2] || require('os').tmpdir();
(async () => {
  const d = await Dr.open({ profile: 'phone_portrait', fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, P = d.page;
  await fr.waitForFunction(() => window.LOOP && LOOP.start && typeof townTap === 'function', null, { timeout: 300000 }); await P.waitForTimeout(4000);
  const toHour = (min) => fr.evaluate((m) => { try { loopClose(); } catch (e) {} let k = 0; while (((T.min - m + 1440) % 1440) > 10 && k++ < 300) advance(10); return T.min; }, min);
  const shoot = async (n, file) => {
    await fr.evaluate((nm) => { const b = ctBases()[nm]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: nm, x: b.x, y: b.y }); }, n);
    for (let i = 0; i < 180; i++) { if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready))) break; await P.waitForTimeout(500); }
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    for (let i = 0; i < 60; i++) { if (await sf.evaluate((nm) => !!(window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === nm), n).catch(() => false)) break; await P.waitForTimeout(500); }
    await P.waitForTimeout(1500);
    for (let t = 0; t < 4; t++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('stall')); if (xy) { const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await P.touchscreen.tap(hb.x + xy.x * hb.width / iw[0], hb.y + xy.y * hb.height / iw[1]); }
      await P.waitForTimeout(2500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'stall')) break; }
    const info = await sf.evaluate(() => { const b = document.querySelector('#sbody .stline[data-good="food"][data-n="1"] .sb.buy'); if (b) b.click(); const st = document.getElementById('stallstrip'); return { strip: st ? st.textContent : '', v: BohemiaSettlement._valley('food') }; });
    await P.waitForTimeout(900);
    await P.screenshot({ path: file });
    await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await P.waitForTimeout(800);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await P.waitForTimeout(1200);
    return info;
  };
  await fr.evaluate(() => { const d0 = DAY.day; let k = 0; while (DAY.day < d0 + 11 && k++ < 2000) advance(60); });
  await toHour(400); const a = await shoot('Caravans', path.join(TMP, 'valley_off.png'));
  /* the road town: the first on a caravan road with a caravan in today and no card of its own on the food (a Sickness card doubles it
     whatever the road does, and the picture is about the road) */
  let b = null, bn = null;
  for (const n of ['Network', 'Reds', 'Blues', 'Volunteers', 'Trades', 'Colorful', 'Mob']) {
    await toHour(15 * 60); const r = await shoot(n, path.join(TMP, 'valley_on.png'));
    if (r.v && r.v.day && r.v.day.restocked && r.v.buy <= a.v.buy) { b = r; bn = n; break; }
    if (!b) { b = r; bn = n; }
  }
  await d.close();
  console.log('OFF', JSON.stringify(a)); console.log('ON', bn, JSON.stringify(b));
  /* the two halves side by side, each with one plain line under it */
  const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1 });
  const im = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  await pg.setContent('<body style="margin:0;background:#111;color:#e8dcc4;font:15px/1.35 Georgia,serif"><div style="display:flex;gap:16px;padding:16px">' +
    [[im(path.join(TMP, 'valley_off.png')), 'OFF THE CARAVAN ROADS: Caravans at first light, the valley out of food. ' + (a.v && a.v.card ? 'Half the shelf, the night dearer, SHORT.' : '')],
     [im(path.join(TMP, 'valley_on.png')), 'ON A CARAVAN ROAD: ' + bn + ', the same day. ' + esc((/The \w+ caravan got in at \d\d:\d\d/.exec(b.strip) || [''])[0]) + '. The shelf is full again and the night is back near its calm price.']]
      .map(x => '<figure style="margin:0;flex:1"><img src="' + x[0] + '" style="width:100%;display:block;border:1px solid #333"><figcaption style="padding:8px 2px">' + esc(x[1]) + '</figcaption></figure>').join('') + '</div></body>');
  const h = await pg.evaluate(() => document.body.scrollHeight); await pg.setViewportSize({ width: 1000, height: h });
  await pg.screenshot({ path: OUT, type: 'jpeg', quality: 82, fullPage: true });
  await br.close();
  console.log('wrote ' + path.relative(ROOT, OUT) + ' ' + fs.statSync(OUT).size + ' bytes');
})().catch(e => { console.error(e); process.exit(1); });

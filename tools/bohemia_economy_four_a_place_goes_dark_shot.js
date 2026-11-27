#!/usr/bin/env node
/* A PLACE EARNS OR GOES DARK, THE VOTE CARD'S PICTURE (ECONOMY FOUR 11/27, rule 485(b)). From the game's own camera: the demo on a
   phone upright, a new crew; the map at night on the Anarchists' one live street, then the night they cannot feed their men (their
   pocket emptied by this tool's own hand, the way a long bad run empties it), the same street dark, and the valley's post on the
   phone's feed. Writes records/target/ECONOMY_FOUR_A_PLACE_GOES_DARK.jpg.
   node tools/bohemia_economy_four_a_place_goes_dark_shot.js [scratch_dir] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const Dr = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/ECONOMY_FOUR_A_PLACE_GOES_DARK.jpg');
const TMP = process.argv[2] || require('os').tmpdir();
(async () => {
  const d = await Dr.open({ profile: 'phone_portrait', fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, P = d.page;
  await fr.waitForFunction(() => window.LOOP && LOOP.start && typeof townTap === 'function' && PLACE_BOOK && PLACE_BOOK.file, null, { timeout: 300000 }); await P.waitForTimeout(3000);
  /* the street: the Anarchists' one live wire; the party stands beside it so the camera frames it */
  const w = await fr.evaluate(() => { const ws = placeWires(turfSeats()).Anarchists || []; return ws[0] || null; });
  if (!w) throw new Error('no Anarchists wire on this valley');
  const home = await fr.evaluate(() => ({ x: city.x, y: city.y }));
  /* the clock runs with the party where it stands; only for the picture does it step beside the street, and back before the night */
  const Z0 = await fr.evaluate(() => CZOOM);
  const toNight = () => fr.evaluate((a) => { let k = 0; while (!(T.min >= 21 * 60 && T.min < 23 * 60) && k++ < 400) advance(10); travelStop(); city.x = a.cell.x; city.y = a.cell.y;
    try { render(); const c = mapFocus(); setZoomAt(a.z * 3.2, c.x, c.y); render(); } catch (e) {} return T.min; }, { cell: w, z: Z0 });
  const goHome = () => fr.evaluate((h) => { travelStop(); city.x = h.x; city.y = h.y; try { render(); } catch (e) {} }, home);
  await toNight(); await P.waitForTimeout(2500);
  await P.screenshot({ path: path.join(TMP, 'dark_before.png') });
  await goHome();
  const said = await fr.evaluate(() => { const cur = BohemiaCells.money(), pp = BohemiaPockets.of('Anarchists'); BohemiaPurse.debit(pp, cur, BohemiaPurse.balance(pp, cur), 'a long bad run, for the picture', 'shot', DAY.day);
    PLACE_BOOK.st.Anarchists = PLACE_BOOK.st.Anarchists || {}; PLACE_BOOK.st.Anarchists.after = 0;
    const d0 = DAY.day; let k = 0; while (DAY.day < d0 + 1 && k++ < 300) advance(30); return (PLACE_BOOK.tonight || {}).said || ''; });
  const dark = await fr.evaluate((id) => POWER.isDark(id), w.id);
  await toNight(); await P.waitForTimeout(2500);
  await P.screenshot({ path: path.join(TMP, 'dark_after.png') });
  await d.close();
  console.log('wire', JSON.stringify(w), 'dark', dark, 'said', said);
  const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1 });
  const im = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  await pg.setContent('<body style="margin:0;background:#111;color:#e8dcc4;font:15px/1.35 Georgia,serif"><div style="display:flex;gap:16px;padding:16px">' +
    [[im(path.join(TMP, 'dark_before.png')), 'BEFORE: the Anarchists\' one live street at night, the night they can still feed their men.'],
     [im(path.join(TMP, 'dark_after.png')), 'THE NEXT NIGHT, their pocket empty: the same street dark. The valley says: "' + esc(said) + '"']]
      .map(x => '<figure style="margin:0;flex:1"><img src="' + x[0] + '" style="width:100%;display:block;border:1px solid #333"><figcaption style="padding:8px 2px">' + esc(x[1]) + '</figcaption></figure>').join('') + '</div></body>');
  const h = await pg.evaluate(() => document.body.scrollHeight); await pg.setViewportSize({ width: 1000, height: h });
  await pg.screenshot({ path: OUT, type: 'jpeg', quality: 82, fullPage: true });
  await br.close();
  console.log('wrote ' + path.relative(ROOT, OUT) + ' ' + fs.statSync(OUT).size + ' bytes');
})().catch(e => { console.error(e); process.exit(1); });

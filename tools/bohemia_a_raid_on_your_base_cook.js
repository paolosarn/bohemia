/* BOHEMIA — A RAID ON YOUR BASE, THE VOTE PICTURE (10/9/26, LIFE + CITY, [a raid on your base]).
 * THE ALPHA on a phone, the game's own clock and SLEEP: a wall and a tank at your base; the next morning a crew
 * leaves home walking at it (shot 1, the map, he is home and they are coming); he waits; the crew reaches
 * the gate and the fight opens there with what he built on the board (shot 2, the whole phone); a win, and the
 * phone says the base held (shot 3). The win is fed back the way the fight reports it (BOHEMIA_CITY_COMBAT_END),
 * so the third shot is the map's own answer to it. Nothing is drawn by this tool.
 * REFERENCE CHECK:
 *   AH-01    the game's own frames, nothing composed.
 *   BLDG-03  the map's and the board's own light.
 *   BLDG-05  the crew walks the map, the wall and tank stand on the board.
 * REUSE CHECK: every pixel is the alpha as the phone shows it.
 * Run:  node tools/bohemia_a_raid_on_your_base_cook.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'records', 'lifecity_pictures', 'a_raid_on_your_base');
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await D.open({ alpha: true });
  try {
    await d.toMap();
    for (let i = 0; i < 3; i++) { await d.pinchIn(); await d.page.waitForTimeout(1500); if (await d.fr.evaluate(() => CZOOM) > 0.5) break; }
    await d.fr.evaluate(async () => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      window.__night = async () => { document.getElementById('sleepbtn').click(); await sleep(300); const go = document.querySelector('#daycardIn .dcgo'); if (go) go.click(); else DAY.wake(); await sleep(300); };
      const bs = ctBases(), mine = Object.keys(bs).find(n => lotIsMine(n)), seat = turfSeats().find(s => s.faction === mine);
      window.__mine = mine; window.__seat = seat;
      const P = purseGet(); BohemiaPurse.credit(P, 'electricity', 2, 'cook', 'cook', DAY.day);
      BohemiaLotBuild.start(lotBookFor(mine), P, { x: 0, y: 0 }, 'wall', DAY.day, lotHoldFor(mine));
      BohemiaLotBuild.start(lotBookFor(mine), P, { x: 1, y: 0 }, 'tank', DAY.day, lotHoldFor(mine));
      await __night(); city.x = seat.x; city.y = seat.y;   /* he stays home to meet them */
      render();
    });
    await d.page.waitForTimeout(3500);
    await d.fr.evaluate(() => { city.x = __seat.x; city.y = __seat.y; render(); });
    await d.page.waitForTimeout(800);
    await d.page.screenshot({ path: path.join(OUT, '1_coming.png') });
    await d.fr.evaluate(async () => {
      city.x = __seat.x; city.y = __seat.y;
      for (let k = 0; k < 60 && !RAID_FIGHTING; k++) { advance(60); if (DAY.phase !== 'awake') { await __night(); city.x = __seat.x; city.y = __seat.y; } }
    });
    /* the clouds roll in at the door and part when the fight's ground is built: shoot after they part */
    for (let k = 0; k < 60; k++) { await d.page.waitForTimeout(500);
      const st = await d.pageEval(() => { try { return { nfc: NFC.state, ready: !!(NF.frame && nfReady(NF.frame)) }; } catch (e) { return {}; } });
      if (st.ready && st.nfc !== 'in') break; }
    await d.page.waitForTimeout(2500);
    await d.page.screenshot({ path: path.join(OUT, '2_the_gate.png') });
    await d.pageEval(() => { try { if (window.NF && NF.frame) { NF.over = { result: 'win', victory: true, alive: 0 }; nfHome(); } } catch (e) {} });
    await d.page.waitForTimeout(1500);
    await d.fr.evaluate(() => new Promise(r => { window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: { victory: true, result: 'win', alive: 0 }, at: null }, '*'); setTimeout(() => { city.x = __seat.x; city.y = __seat.y; render(); r(); }, 600); }));
    await d.page.waitForTimeout(3000);
    await d.page.screenshot({ path: path.join(OUT, '3_held.png') });
    console.log('said', JSON.stringify(await d.fr.evaluate(() => window.__RAID_SAID)));
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });

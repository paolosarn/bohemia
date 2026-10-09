/* BOHEMIA — A DAY ON THE MAP IN TWENTY SECONDS (10/9/26, LIFE + CITY, row [the living map]).
 *
 * THE ROUND'S COOK (rule 22), FROM THE GAME'S OWN CAMERA (second votes: SHOW IT FROM THE GAME'S CAMERA).
 * Opens THE ALPHA on a phone, gets to the map by the pinch (the driver refuses to hand back the street),
 * squeezes back in one stop to where the parties are drawn, then lets the game's own clock run half an
 * hour a frame from 06:00 and photographs the canvas each time: the parties walking with nobody on
 * anybody, their prints fading behind them, the crowds at the gates. Nothing is drawn by this tool;
 * tools/bohemia_a_day_on_the_map_reel.py stitches the frames and stamps the clock the game shows.
 *
 * Run:  node tools/bohemia_a_day_on_the_map_reel.js   (writes frames to records/lifecity_pictures/reel/)
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records', 'lifecity_pictures', 'reel');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, f));
  const d = await D.open({ alpha: true });
  try {
    await d.toMap();
    let s = null;
    for (let i = 0; i < 3; i++) {
      await d.pinchIn(); await d.page.waitForTimeout(1500);
      s = await d.fr.evaluate(() => ({ mode: MODE, czoom: CZOOM }));
      if (s.mode === 'city' && s.czoom > 0.5) break;
    }
    if (!s || s.mode !== 'city' || !(s.czoom > 0.5)) throw new Error('REFUSING: not on the near map: ' + JSON.stringify(s));
    const log = [];
    for (let k = 0; k < 32; k++) {
      const st = await d.fr.evaluate(() => {
        if (window.__reelStarted) advance(30); window.__reelStarted = true; render();
        const ps = partiesAll() || [];
        return { min: DAY.min, day: DAY.day, stacks: BohemiaLivingMap.stacks(ps, turfSeats()).length,
                 prints: LIVING_MAP.st ? LIVING_MAP.st.prints.length : 0, drawn: window.__PRINTS_DRAWN || 0,
                 crowd: (MAP_DREW && MAP_DREW.gateCrowd) ? Object.keys(MAP_DREW.gateCrowd).map(n => [n, MAP_DREW.gateCrowd[n].count, MAP_DREW.gateCrowd[n].market]) : [] };
      });
      await d.shot(path.join(OUT, 'f' + String(k).padStart(2, '0') + '.png'));
      log.push(st);
      if (st.stacks) throw new Error('REFUSING: two parties on one cell at ' + st.min);
    }
    fs.writeFileSync(path.join(OUT, 'log.json'), JSON.stringify(log));
    console.log('frames', log.length, 'from', log[0].min, 'to', log[log.length - 1].min, 'prints drawn', log.map(l => l.drawn).join(','));
    console.log('errors', d.errs.length);
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });

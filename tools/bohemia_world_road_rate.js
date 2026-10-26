#!/usr/bin/env node
// WORLD [the job tells the truth, in blood] 10/26 -- THE ROAD'S RATE, MEASURED (rule 208(a): 'the chance of every other fight on
// the trip'). A job's stars count the road's fights at a rate per hour of travel (records/target/bb/job_danger.json road_per_hour);
// this is where that number comes from, never a guess: the live demo, his computer's screen, the map walked town to town at the top
// speed for as many game hours as asked, and every crew that comes for him (the map's forced road events, huntSpawn) counted when
// it SPAWNS and when it REACHES him (the meet card for a 'road:' why, answered FALL BACK so the walk goes on). The party plates he
// taps himself are his choice and are not counted. Prints the rates; --write puts the reach rate into job_danger.json.
//   node tools/bohemia_world_road_rate.js [--hours 60] [--write]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const HOURS = +arg('--hours', 60), WRITE = process.argv.indexOf('--write') > 0;

(async () => {
  const d = await drive.open({ keepCards: true, profile: 'computer', engage: true });
  const fr = d.fr, page = d.page;
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(250); } return false; };
  await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready(), null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(62000);   /* the map sends nobody in the first sixty seconds (the second votes): the clock starts after */
  await fr.evaluate(() => {
    window.__RR = { spawned: 0, reached: 0, mins: 0, legs: 0, cards: [] };
    const hs = huntSpawn; window.huntSpawn = huntSpawn = function (got) { const had = !!HUNT; const r = hs(got); if (!had && HUNT) window.__RR.spawned++; return r; };
    const ms = meetShow; window.meetShow = meetShow = function (msg, skin) { const r = ms(msg, skin); window.__RR.cards.push(String(msg && msg.why || '')); if (/^road:/.test(String(msg && msg.why || ''))) window.__RR.reached++; return r; };
  });
  let lastMin = await fr.evaluate(() => T.day * 1440 + T.min), moving = 0, t0 = Date.now();
  const towns = await fr.evaluate(() => { const bs = ctBases() || {}; return Object.keys(bs).map(n => ({ n, x: bs[n].x, y: bs[n].y })); });
  let k = 0;
  while (true) {
    const st = await fr.evaluate(() => ({ mins: window.__RR.mins, moving: !!(TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length), meet: !!MEET.up, town: !!(LOOP.frame && LOOP.frame.style.display === 'block'), fight: false, now: T.day * 1440 + T.min }));
    if (st.mins / 60 >= HOURS || Date.now() - t0 > (+arg('--minutes', 20)) * 60000) break;
    if (st.meet) { await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); }); await page.waitForTimeout(300); }
    if (await page.evaluate(() => !!window.CITYFIGHT)) { await page.evaluate(() => { try { nfClose && nfClose(); } catch (e) {} }); }
    if (st.town) { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(300); }
    if (st.moving) { const dm = st.now - lastMin; if (dm > 0 && dm < 600) await fr.evaluate((dm) => { window.__RR.mins += dm; }, dm); }
    lastMin = st.now;
    if (!st.moving && !st.meet) {
      /* the farthest town in the next few, so most of the clock is road */
      const tw = towns[(k = (k * 7 + 5) % towns.length)];
      await fr.evaluate((t) => { try { travelStop(); townTap({ name: t.n, x: t.x, y: t.y }); travelSpeedSet(TRAVEL_SPEEDS[TRAVEL_SPEEDS.length - 1]); } catch (e) {} window.__RR.legs++; }, tw);
    }
    await page.waitForTimeout(400);
  }
  const R = await fr.evaluate(() => window.__RR);
  /* why: the director's own account (how often it was asked, what it answered), so a zero is explained, never assumed */
  R.director = await fr.evaluate(() => { const D = (typeof ROAD_DIR !== 'undefined' && ROAD_DIR) ? ROAD_DIR : null; let st = null;
    try { st = D && D.state ? D.state() : null; } catch (e) {} return { has: !!D, log: (typeof ROAD_LOG !== 'undefined' ? ROAD_LOG.length : null), hunts: window.__HUNTS | 0,
      state: st ? JSON.stringify(st).slice(0, 400) : null, keys: D ? Object.keys(D).join(',') : null }; });
  const hours = R.mins / 60, out = { hours: +hours.toFixed(1), legs: R.legs, spawned: R.spawned, reached: R.reached,
    spawn_per_hour: +(R.spawned / Math.max(1e-6, hours)).toFixed(4), reach_per_hour: +(R.reached / Math.max(1e-6, hours)).toFixed(4), cards: R.cards.slice(0, 40), director: R.director };
  console.log(JSON.stringify(out, null, 1));
  if (WRITE) {
    const p = path.join(ROOT, 'records/target/bb/job_danger.json'), J = JSON.parse(fs.readFileSync(p, 'utf8'));
    J.road_per_hour.value = Math.max(out.reach_per_hour, 0.0001);
    J.road_per_hour.measured = { at: new Date().toISOString().slice(0, 10), hours: out.hours, spawned: out.spawned, reached: out.reached, tool: 'tools/bohemia_world_road_rate.js' };
    fs.writeFileSync(p, JSON.stringify(J, null, 1) + '\n');
  }
  await d.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

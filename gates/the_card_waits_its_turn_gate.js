#!/usr/bin/env node
/* ============================================================================
   THE CARD WAITS ITS TURN (BOSSES lane, 11/14/26, ask row 611 FOUND BY EYES 11/11, rule 441; the coordinator's round 'BOSSES turn up').
   EYES: 'A BOSS ASKER'S CARD OPENS OVER A TOWN JUST AFTER HE WALKS IN AND TAKES THE TAP MEANT FOR A BUILDING (Tia Carmen over Network)
   ... A card should not take a press in its first beat.' Code: slices/bohemia_bosses.js townTurn() and talk().
   On the real page (the demo upright and the alpha on its side), the boss cards' own door:
     W1 a walk going into a town: no card; W2 the gap after it arrives (6 s): no card; W3 the town's screen up: no card; W4 the 4 s after
     it closes: no card; W5 after that, on the open map: a card may open; F1 a card opened takes no press in its first beat (its layer lets
     the tap through for 500 ms), then takes presses. Planted: P1 a card that opens on arrival, P2 a card that takes the first press.
     node gates/the_card_waits_its_turn_gate.js [profile[:alpha]]
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const W = (q) => !!q && q.walking === false && q.gap === false && q.town === false && q.closed === false && q.open === true;
const F = (q) => !!q && q.first === 'none' && q.after === '';
async function run(prof, alpha) {
  console.log('\n-- ' + (alpha ? 'the alpha' : 'the demo') + ', ' + prof + ' --');
  const d = await open({ profile: prof, fog: true, alpha: !!alpha });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  for (let i = 0; i < 100; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!window.BohemiaBosses && !!BohemiaBosses.data() && typeof city !== 'undefined' && !!window.BohemiaRoadEvents).catch(() => false)) break; }
  await fr.evaluate(() => { window.__BOSSES_TALK = true; });
  /* out of the first town the way a stranger is (its screen shut), then wait out the town's turn */
  for (let i = 0; i < 40; i++) { const up = await fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false); if (!up && i > 6) break;
    if (up) await fr.evaluate(() => { try { document.getElementById('settleFrame').style.display = 'none'; } catch (e) {} }); await page.waitForTimeout(500); }
  await page.waitForTimeout(6500);
  const can = () => fr.evaluate(() => { try { if (BohemiaRoadEvents.up && BohemiaRoadEvents.up()) BohemiaRoadEvents.close(false); } catch (e) {} try { MEET.up = null; } catch (e) {} return BohemiaBosses.canTalk(); });
  const q = {};
  await fr.evaluate(() => { window.__GATE_TRAVEL_WAS = TRAVEL; TRAVEL = { path: [[city.x, city.y], [city.x + 1, city.y]], i: 0, cells: 0, mins: 0, to: [city.x + 1, city.y], town: 'Network' }; });
  q.walking = await can();
  await fr.evaluate(() => { TRAVEL = null; });
  q.gap = await can();
  await page.waitForTimeout(6500);
  await fr.evaluate(() => { const sf = document.getElementById('settleFrame'); if (sf) sf.style.display = 'block'; });
  q.town = await can();
  await fr.evaluate(() => { const sf = document.getElementById('settleFrame'); if (sf) sf.style.display = 'none'; });
  q.closed = await can();
  await page.waitForTimeout(4500);
  q.open = await can();
  ok('W1-W5 a boss card waits its turn: not walking into a town, not in the gap after, not over the town, not in the 4 s after; on the open map it may', W(q), JSON.stringify(q));
  ok('P1 planted: a card that opens on arrival turns W red', !W(Object.assign({}, q, { gap: true })), 'opens in the gap');
  /* a card through this file's door: its layer lets taps through in its first beat */
  const f = {};
  await fr.evaluate(() => BohemiaBosses.talkTest({ name: 'TÍA CARMEN', look: 'cast_skirt', text: 'Mijo.', opts: [{ t: 'OK', fn: function () {} }] }));
  f.first = await fr.evaluate(() => { const el = document.getElementById('roadcard'); return el ? el.style.pointerEvents : 'no card'; });
  await page.waitForTimeout(700);
  f.after = await fr.evaluate(() => { const el = document.getElementById('roadcard'); return el ? el.style.pointerEvents : 'no card'; });
  await fr.evaluate(() => { try { BohemiaRoadEvents.close(false); } catch (e) {} });
  ok('F1 a card takes no press in its first beat (the tap goes through to what was under it), then takes presses', F(f), JSON.stringify(f));
  ok('P2 planted: a card that takes the first press turns F1 red', !F(Object.assign({}, f, { first: 'auto' })), 'auto');
  ok('C0 nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  await d.close().catch(() => {});
}
(async () => {
  const want = process.argv[2];
  const runs = want ? [[want.split(':')[0], /:alpha$/.test(want)]] : [['phone_portrait', false], ['phone_landscape', true]];
  for (const [p, a] of runs) { try { await run(p, a); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTHE CARD WAITS ITS TURN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

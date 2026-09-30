/* THE BAR SAYS THREE THINGS  (UI lane 11, [bb interface] round eight, 9/29/26)

   RULE 39(a), PAOLO 9/28: "not every atom needs my input... you kind of know what I want,
   so just start making it." RULE 40(f): the hold is lifted for the map. So the default
   of his waiting vote item WHAT THE BAR SAYS (B: three readings) is BUILT, not asked.

   WHY THE BAR: the demo opens on the map now (RUN e4c66f2). On the Battle Brothers map
   the top bar is the feedback of travel -- you tap, the party moves, the day ticks in the
   bar (library vol 10). Ours was 50 px of black with one NOTES button while the hour moved
   only on the phone's few-pixel status clock.

   WHAT THIS HOLDS, on the DEMO (what a friend gets), through the one driver, and it
   REFUSES TO REPORT if the driver never got past the door:
     - on the map the bar carries three readings: batteries, the hour, where you are
     - every reading is the GAME'S OWN FACT, asked the same moment: the purse, clockStr,
       the district under the party -- never a number this bar keeps
     - it is the feedback of travel: tap the map and the hour in the bar moves, and still
       equals the game's clock
     - readouts, not buttons: nothing in it takes a finger
     - it fits: ends left of NOTES with room to spare at 390 and at 320 wide
     - no page error while doing any of it

   node gates/the_bar_says_three_things_gate.js */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); }
  else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); }
};
const done = () => { console.log('\nTHE BAR SAYS THREE THINGS: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  console.log('\nTHE BAR SAYS THREE THINGS  (UI [bb interface] round eight)\n');
  ok('the bar carries a readings strip, built in the bar itself',
     /RD\.id='barread'/.test(CITY) && /L\.appendChild\(RD\)/.test(CITY));
  ok('  and it takes no finger (pointer-events:none on the strip)',
     /#barread\{[^}]*pointer-events:none!important/.test(CITY));
  ok('  and it is the map\'s only (MODE===\'city\')', /onMap=\(typeof MODE!=='undefined' && MODE==='city'\)/.test(CITY));

  let d;
  try { d = await open({ door: 120000 }); }
  catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return done(); }
  if (!d.doorIsBehindUs()) {
    ok('REFUSING TO REPORT: the driver is still at the door after ' + d.doorMs() + ' ms', false);
    await d.close(); return done();
  }
  await d.page.waitForTimeout(1500);
  const read = () => d.fr.evaluate(() => {
    const RD = document.getElementById('barread');
    const chips = RD ? Array.from(RD.querySelectorAll('.rd')).map(e => { const b = e.getBoundingClientRect();
      return { k: e.dataset.k, t: e.textContent.trim(), x: b.x, y: b.y, w: b.width, h: b.height }; }) : [];
    const shown = !!(RD && getComputedStyle(RD).display !== 'none' && RD.getBoundingClientRect().width > 0);
    let truth = {};
    try { truth.batteries = purseBalances().electricity; } catch (e) {}
    try { const f = clockStr(); const b = f.split('·'); truth.hour = b[b.length - 1].trim(); } catch (e) {}
    try { const t = om.at(city.x, city.y); truth.where = t && t.district ? String(t.district).toUpperCase() : null; } catch (e) {}
    const n = document.getElementById('notebtn').getBoundingClientRect();
    /* a finger at each reading's centre: what does it land on? */
    const under = chips.map(c => { const el = document.elementFromPoint(c.x + c.w / 2, c.y + c.h / 2);
      return el ? (el.id || el.className || el.tagName) : ''; });
    return { mode: typeof MODE !== 'undefined' ? MODE : '?', shown, chips, truth, notesX: n.x, under, w: innerWidth };
  });

  const a = await read();
  const by = (r, k) => (r.chips.find(c => c.k === k) || {}).t;
  ok('the door opens onto the map', a.mode === 'city', a.mode);
  ok('ON THE MAP THE BAR SAYS THREE THINGS', a.shown && a.chips.length === 3, a.chips.map(c => c.k + '=' + c.t).join(', '));
  ok('  batteries are the purse\'s own count', String(by(a, 'batteries')) === String(a.truth.batteries), by(a, 'batteries') + ' vs ' + a.truth.batteries);
  ok('  the hour is the game\'s own clock', by(a, 'hour') === a.truth.hour, by(a, 'hour') + ' vs ' + a.truth.hour);
  ok('  where you are is the district under the party', by(a, 'where') === a.truth.where, by(a, 'where') + ' vs ' + a.truth.where);
  const right = Math.max(...a.chips.map(c => c.x + c.w));
  ok('it fits left of NOTES with room to spare at ' + a.w + ' wide', a.chips.length === 3 && right + 8 <= a.notesX, Math.round(right) + ' vs NOTES at ' + Math.round(a.notesX));
  ok('no reading takes a finger (the finger lands on the bar, not a reading)', a.under.every(u => !/\brd\b/.test(u)), a.under.join(' | '));

  /* THE FEEDBACK OF TRAVEL: the player's own route, a tap on the map */
  await d.tapAt(200, 500); await d.page.waitForTimeout(3000);
  const b = await read();
  ok('TAP TO TRAVEL AND THE HOUR IN THE BAR MOVES', by(b, 'hour') && by(b, 'hour') !== by(a, 'hour'), by(a, 'hour') + ' -> ' + by(b, 'hour'));
  ok('  and it still equals the game\'s clock', by(b, 'hour') === b.truth.hour, by(b, 'hour') + ' vs ' + b.truth.hour);
  ok('  and the place follows the party', by(b, 'where') === b.truth.where, by(b, 'where') + ' vs ' + b.truth.where);

  await d.page.setViewportSize({ width: 320, height: 700 }); await d.page.waitForTimeout(900);
  const c = await read();
  const right3 = Math.max(...c.chips.map(x => x.x + x.w));
  ok('and it still fits at 320 wide, the narrowest phone anybody holds', c.shown && c.chips.length === 3 && right3 + 8 <= c.notesX, Math.round(right3) + ' vs NOTES at ' + Math.round(c.notesX));

  ok('no page error while doing any of it', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });

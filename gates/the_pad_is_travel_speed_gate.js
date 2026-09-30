/* THE PAD IS TRAVEL SPEED  (UI lane 11, VAMILY [speed pad], 9/30/26)

   RULE 44(a), PAOLO 9/29: "bring the trackpad back but instead of controlling your directions...
   how Battle Brothers does it when you travel on the map, you control how fast: 1x, 2x, 3x, 4x,
   maybe 5x." The board's default: PAUSE 1x 2x 3x 5x; a road event drops it to PAUSE.

   WHAT THIS HOLDS, on the DEMO (what a friend gets), through the one driver, each speed on a FRESH
   game because a road party can start a fight inside a few seconds of travel and a fight ends the
   journey (measured: the fourth run on one page could not set a journey at all). It REFUSES TO
   REPORT a speed it could not measure, and says which.
     - on the map: five plates PAUSE 1x 2x 3x 5x, each a thumb (44 x 44), bottom right, 1x lit
     - a tap on a plate sets the speed and lights it, and does NOT set a journey
     - PAUSE holds a journey: over 2 s, 0 blocks and 0 game minutes, and the journey is still set
     - 3x crosses at least 2.5 times the blocks of 1x in the same 2 s, and every block still pays
       its own clock (game minutes go up with the blocks, never a skip)
     - 5x is REPORTED, not asserted: it is bound by how heavy one map step is on the machine
       running this (measured 55 ms a step on the gate box; one beat in four dropped at 5x)
     - the one door every fight comes through drops it to PAUSE (source), and the hook lights II
     - no text is under the pad (clipping ancestors respected: a post clipped inside the phone is
       not "under" anything)
     - no page error

   node gates/the_pad_is_travel_speed_gate.js */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

let pass = 0, fail = 0, errs = [];
const ok = (m, g, extra) => {
  if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); }
  else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); }
};
const done = () => { console.log('\nTHE PAD IS TRAVEL SPEED: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function fresh() {
  const d = await open({ door: 120000 });
  if (!d.doorIsBehindUs()) { await d.close(); return null; }
  await d.page.waitForTimeout(1200);
  d.off = await d.page.evaluate(() => { const r = document.getElementById('cityFrame').getBoundingClientRect(); return { x: r.x, y: r.y }; });
  d.st = () => d.fr.evaluate(() => ({ x: city.x, y: city.y, t: T.day * 1440 + T.min, speed: TRAVEL_SPEED, trav: !!TRAVEL,
    left: TRAVEL ? TRAVEL.path.length - TRAVEL.i : 0, lit: (document.querySelector('#speedpad .sp.now') || {}).textContent || null }));
  d.plate = async (label) => { const c = await d.fr.evaluate((l) => { const b = Array.from(document.querySelectorAll('#speedpad .sp')).find(x => x.textContent === l);
    if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, label);
    if (!c) return false; await d.tapAt(c[0] + d.off.x, c[1] + d.off.y); await d.page.waitForTimeout(250); return true; };
  d.setOut = async () => {
    for (const [x, y] of [[60, 650], [60, 700], [195, 650], [330, 700], [60, 180]]) {
      await d.tapAt(x, y); await d.page.waitForTimeout(350);
      const s = await d.st(); if (s.trav && s.left >= 14) return s;
      if (s.trav) await d.fr.evaluate(() => travelStop());
    }
    return null;
  };
  return d;
}
async function measure(label) {
  const d = await fresh(); if (!d) return { label, refused: 'the door never opened' };
  try {
    await d.plate('1x');
    if (!(await d.setOut())) return { label, refused: 'no long journey could be set by a tap' };
    await d.plate(label);
    const a = await d.st(); await d.page.waitForTimeout(2000); const b = await d.st();
    errs = errs.concat(d.errs || []);
    return { label, speed: a.speed, lit: a.lit, blocks: a.left - b.left, minutes: b.t - a.t, stillSet: b.trav };
  } finally { await d.close(); }
}

(async () => {
  console.log('\nTHE PAD IS TRAVEL SPEED  (UI [speed pad], rule 44a)\n');
  ok('the speeds are PAUSE 1x 2x 3x 5x', /var TRAVEL_SPEEDS = \[0, 1, 2, 3, 5\];/.test(CITY));
  ok('PAUSE holds the journey without ending it (the route is not consulted)', /!\(TRAVEL && TRAVEL_SPEED===0\)\) \? travelNext\(\)/.test(CITY));
  ok('every extra block is a real stepOnce that pays its own clock', /const m2=stepOnce\(d2\); travelStepped\(m2\);/.test(CITY));
  ok('  and the extra blocks are spread one every BEAT/N, never burst in one tick (the map glide snaps past 2.5 blocks)',
     /setTimeout\(function\(\)\{\s*if\(!TRAVEL \|\| TRAVEL_SPEED!==N\) return;[\s\S]{0,300}const m2=stepOnce\(d2\)[\s\S]{0,1200}Math\.round\(k\*BEAT\/N\)/.test(CITY));
  ok('the one door every fight comes through drops it to PAUSE', /travelStop\(\); \}catch\(_e\)\{\}\n[\s\S]{0,300}travelInterrupt\('fight'\)/.test(CITY));

  /* THE OBJECT, on a fresh demo */
  const d = await fresh();
  if (!d) { ok('REFUSING TO REPORT: the driver never got past the door', false); return done(); }
  const pad = await d.fr.evaluate(() => {
    const p = document.getElementById('speedpad'); if (!p) return null;
    const btns = Array.from(p.querySelectorAll('.sp')).map(b => { const r = b.getBoundingClientRect(); return { t: b.textContent, w: r.width, h: r.height, x: r.x, y: r.y, lit: b.classList.contains('now') }; });
    const R = p.getBoundingClientRect();
    /* text boxes that are really painted under the pad: intersect each with every clipping ancestor */
    const under = [];
    for (const el of Array.from(document.querySelectorAll('body *'))) {
      if (el.closest('#speedpad')) continue;
      if (!Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())) continue;
      const st = getComputedStyle(el); if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity < .05) continue;
      let r = el.getBoundingClientRect(); let L = r.left, T0 = r.top, Rt = r.right, B = r.bottom;
      for (let a = el.parentElement; a; a = a.parentElement) { const s = getComputedStyle(a);
        if (s.overflow !== 'visible' || s.overflowX !== 'visible' || s.overflowY !== 'visible') { const q = a.getBoundingClientRect();
          L = Math.max(L, q.left); T0 = Math.max(T0, q.top); Rt = Math.min(Rt, q.right); B = Math.min(B, q.bottom); } }
      if (Rt - L < 1 || B - T0 < 1) continue;
      if (Rt > R.left && L < R.right && B > R.top && T0 < R.bottom) under.push((el.id || el.className) + ':' + el.textContent.trim().slice(0, 24));
    }
    return { shown: getComputedStyle(p).display !== 'none', btns, R: [R.x, R.y, R.right, R.bottom], vw: innerWidth, vh: innerHeight, under, mode: MODE };
  });
  ok('the demo opens on the map with the pad on it', pad && pad.shown && pad.mode === 'city', pad && (pad.mode + ' shown=' + pad.shown));
  ok('five plates, PAUSE 1x 2x 3x 5x', pad && pad.btns.map(b => b.t).join(' ') === 'II 1x 2x 3x 5x', pad && pad.btns.map(b => b.t).join(' '));
  ok('  every plate is a thumb, 44 x 44 or more', pad && pad.btns.every(b => b.w >= 44 && b.h >= 44), pad && pad.btns.map(b => Math.round(b.w) + 'x' + Math.round(b.h)).join(' '));
  ok('  bottom right, on the glass', pad && pad.R[2] <= pad.vw && pad.R[3] <= pad.vh && pad.R[0] > pad.vw * 0.25, pad && pad.R.map(Math.round).join(','));
  ok('  1x is lit at the start', pad && (pad.btns.find(b => b.lit) || {}).t === '1x');
  ok('no text is painted under the pad', pad && pad.under.length === 0, pad && pad.under.join(' | '));
  const s0 = await d.st(); await d.plate('3x'); const s1 = await d.st();
  ok('a tap on a plate sets the speed and lights it', s1.speed === 3 && s1.lit === '3x', s1.speed + ' lit ' + s1.lit);
  ok('  and it does not set a journey or move him', !s1.trav && s1.x === s0.x && s1.y === s0.y);
  const hk = await d.fr.evaluate(() => { travelInterrupt('gate'); return { speed: TRAVEL_SPEED, lit: document.querySelector('#speedpad .sp.now').textContent }; });
  await d.page.waitForTimeout(600);
  const hk2 = await d.st();
  ok('an interrupt drops it to PAUSE and lights II', hk.speed === 0 && hk2.lit === 'II', JSON.stringify(hk) + ' then lit ' + hk2.lit);
  errs = errs.concat(d.errs || []);
  await d.close();

  /* THE SPEEDS, each on a fresh game */
  const r = {};
  for (const label of ['1x', '3x', 'II', '5x']) {
    r[label] = await measure(label);
    const m = r[label];
    console.log('       ' + label.padEnd(3) + (m.refused ? 'NOT MEASURED: ' + m.refused : ('crossed ' + m.blocks + ' blocks, +' + m.minutes + ' game minutes in 2 s, journey still set ' + m.stillSet)));
  }
  const measured = (l) => r[l] && !r[l].refused;
  ok('PAUSE HOLDS: 0 blocks and 0 game minutes, and the journey is still set', measured('II') && r.II.blocks === 0 && r.II.minutes === 0 && r.II.stillSet, measured('II') ? JSON.stringify(r.II) : 'not measured');
  ok('1x TRAVELS', measured('1x') && r['1x'].blocks >= 2, measured('1x') ? r['1x'].blocks + ' blocks' : 'not measured');
  ok('3x CROSSES AT LEAST 2.5 TIMES THE BLOCKS OF 1x', measured('1x') && measured('3x') && r['3x'].blocks >= 2.5 * r['1x'].blocks,
     measured('1x') && measured('3x') ? r['1x'].blocks + ' -> ' + r['3x'].blocks : 'not measured');
  ok('  and every block paid its own clock (minutes grow with blocks)', measured('3x') && r['3x'].minutes >= r['3x'].blocks * 3,
     measured('3x') ? r['3x'].minutes + ' min for ' + r['3x'].blocks + ' blocks' : 'not measured');
  if (measured('5x') && measured('1x')) console.log('       REPORTED, NOT ASSERTED: 5x crossed ' + r['5x'].blocks + ' blocks against 1x\'s ' + r['1x'].blocks
    + ' (ideal ' + 5 * r['1x'].blocks + '); the gap is the cost of a map step on this machine, not the pad.');
  ok('no page error while doing any of it', errs.length === 0, errs.slice(0, 2).join(' | '));
  done();
})().catch(e => { console.error(e); process.exit(1); });

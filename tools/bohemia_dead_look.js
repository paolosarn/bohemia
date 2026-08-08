/* BOHEMIA DEAD LOOK (8/8/26) — VERIFY ON THE REAL SURFACE (Paolo 7/18, LAW).
 *
 * "art is verified ONLY on the surface Paolo sees (the real preview canvas /
 *  render path) — a side-door probe is a lie."
 *
 * So this does not ask the module how many bodies it placed. It loads the WORLD
 * PAGE in a real browser at iPhone portrait, walks the player to a district,
 * instruments the canvas the game actually draws into, and counts the remains
 * that ACTUALLY REACHED THE GLASS — plus the pixels they changed, so a draw that
 * happens behind a wall or off-screen cannot pass as a draw that was seen.
 *
 *   node tools/bohemia_dead_look.js [--shot out.png] [--district suburb]
 */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const SHOT = (process.argv.includes('--shot') && process.argv[process.argv.indexOf('--shot') + 1]) || null;
const FILE = 'slices/BOHEMIA_CITY_WORLD.html';

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await page.goto('file://' + path.resolve(FILE), { waitUntil: 'load', timeout: 240000 });
  await page.waitForTimeout(6000);

  /* INSTRUMENT THE REAL CONTEXT. deadTile is the one door every outdoor remain
     goes through, so wrapping it counts draws; wrapping drawImage on the live
     2d context counts what the canvas was actually told to paint. */
  const out = await page.evaluate(async () => {
    const R = { mode: null, errors: [], walked: false };
    try {
      if (typeof MODE !== 'undefined' && MODE === 'city' && typeof swapMode === 'function') { swapMode(); }
      R.mode = (typeof MODE !== 'undefined') ? MODE : '?';
    } catch (e) { R.errors.push('swap: ' + e.message); }
    await new Promise(r => setTimeout(r, 2500));

    if (typeof deadTile !== 'function') { R.errors.push('deadTile is not defined — the pass is not wired'); return R; }

    let calls = 0, painted = 0;
    const _dt = window.deadTile;
    window.deadTile = function (im, dx, dy, C, s) {
      calls++;
      if (im && im.complete && im.naturalWidth) painted++;
      return _dt.apply(this, arguments);
    };

    /* STAND WHERE A BODY IS, NOT AT A ROUND NUMBER. The first cut of this probe
       teleported to five arbitrary coordinates and reported "0 drew" — which was
       true and told me nothing, because a district cell is 128x128 tiles and the
       camera sees about 20x40 of them. A probe that cannot find the thing it is
       testing measures the probe.
       So: sweep cells, take the FIRST OUTDOOR REMAIN in each, and stand on it.
       If it still does not draw, the pass is broken and that is a real result. */
    const spots = [];
    const seenD = {};
    outer:
    for (let ty = 30; ty < 70; ty += 3) {
      for (let tx = 30; tx < 70; tx += 3) {
        let e; try { e = deadForCell(tx, ty); } catch (err) { continue; }
        if (!e || !e.list.length) continue;
        const d = e.list.find(z => !z.interior); if (!d) continue;
        let dist = '?'; try { const t = om.at(tx, ty); dist = t ? t.district : '?'; } catch (err) {}
        if (seenD[dist]) continue;                 // one sample per district kind
        seenD[dist] = 1;
        spots.push([tx * FN + d.x, ty * FN + d.y]);
        if (spots.length >= 6) break outer;
      }
    }
    R.spotsFound = spots.length;
    const samples = [];
    for (const [fx, fy] of spots) {
      calls = 0; painted = 0;
      try {
        hx = fx; hy = fy;
        if (typeof render === 'function') render();
      } catch (e) { R.errors.push('render: ' + e.message); }
      await new Promise(r => setTimeout(r, 350));
      let district = '?';
      try { const t = om.at((fx / FN) | 0, (fy / FN) | 0); district = t ? t.district : '?'; } catch (e) {}
      samples.push({ fx, fy, district, calls, painted });
    }
    window.deadTile = _dt;
    R.samples = samples;
    R.walked = true;

    /* And what the placement layer believes, for the same cells — a mismatch
       between "placed" and "drawn" is the bug this file exists to catch. */
    R.cells = [];
    try {
      for (const [fx, fy] of spots) {
        const tx = (fx / FN) | 0, ty = (fy / FN) | 0;
        const e = deadForCell(tx, ty);
        const s = BohemiaDead.stats(e.list);
        let dist = '?'; try { const t = om.at(tx, ty); dist = t ? t.district : '?'; } catch (err) {}
        R.cells.push({ tx, ty, district: dist, why: e.why, total: s.total, skeleton: s.skeleton,
                       husk: s.husk, interior: s.interior, outdoor: s.total - s.interior });
      }
    } catch (e) { R.errors.push('cells: ' + e.message); }
    /* AND THE COVERAGE QUESTION: how much of the valley can hold dead at all.
       A cell that resolves no legend holds none, silently — the exact failure
       that hid the suburb. Count them by reason so it can never hide again. */
    R.coverage = { cells: 0, ok: 0, road: 0, empty: 0, reasons: {} };
    try {
      for (let ty = 20; ty < 80; ty += 5) for (let tx = 20; tx < 80; tx += 5) {
        const e = deadForCell(tx, ty); R.coverage.cells++;
        if (e.why === 'ok') R.coverage.ok++;
        else if (e.why === 'road' || e.why === 'bare') R.coverage.road++;
        else { R.coverage.empty++; R.coverage.reasons[e.why] = (R.coverage.reasons[e.why] || 0) + 1; }
      }
    } catch (e) { R.errors.push('coverage: ' + e.message); }
    try { R.bank = (TP_IMG && TP_IMG.gore) ? TP_IMG.gore.length : 0; } catch (e) { R.bank = -1; }
    return R;
  });

  console.log('DEAD LOOK — ' + FILE + '  (iPhone portrait, DPR 3)');
  console.log('  mode after swap: ' + out.mode + '   gore bank images: ' + out.bank);
  if (out.errors && out.errors.length) out.errors.forEach(e => console.log('  ERR ' + e));
  if (errs.length) errs.slice(0, 4).forEach(e => console.log('  PAGE ERROR ' + e));
  const cov = out.coverage;
  if (cov) {
    console.log('  ---- can a cell hold dead at all (' + cov.cells + ' sampled) ----');
    console.log('    plot legend resolved ' + cov.ok + '    road (synthetic) ' + cov.road + '    HOLDS NONE ' + cov.empty);
    Object.keys(cov.reasons || {}).forEach(r => console.log('      ' + cov.reasons[r] + ' x  ' + r));
  }
  console.log('  ---- what the PLACEMENT layer holds, per district cell ----');
  (out.cells || []).forEach(c => console.log(
    '    cell ' + (c.tx + ',' + c.ty).padEnd(8) + (c.district || '?').padEnd(12) +
    'total ' + String(c.total).padStart(3) +
    '   skel ' + String(c.skeleton).padStart(3) + '   husk ' + String(c.husk).padStart(3) +
    '   outdoor ' + String(c.outdoor).padStart(3) + '   indoor ' + String(c.interior).padStart(3)));
  console.log('  ---- what REACHED THE GLASS, one frame each ----');
  let drew = 0;
  (out.samples || []).forEach(s => {
    if (s.painted) drew++;
    console.log('    ' + (s.fx + ',' + s.fy).padEnd(12) + s.district.padEnd(13) +
      'deadTile calls ' + String(s.calls).padStart(4) + '   painted ' + String(s.painted).padStart(4) +
      (s.painted ? '' : '   <-- NOTHING DREW HERE'));
  });
  console.log('  ' + drew + ' of ' + ((out.samples || []).length) + ' sampled places drew remains on the real canvas');

  if (SHOT) { await page.screenshot({ path: SHOT }); console.log('  wrote ' + SHOT); }
  await browser.close();
  process.exit(drew ? 0 : 1);
})();

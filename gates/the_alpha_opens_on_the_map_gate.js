/* ==========================================================================
   THE ALPHA OPENS ON THE MAP  (FIXES 3, 11/21/26; found by ECONOMY THREE 11/20o, sent by the coordinator; rules 38(b), 236, 441)

   MEASURED BEFORE (a phone, 390 x 844, a fresh game on the alpha, the link he plays): the first town (Caravans, Cartel) stood over
   MODE 'human', the dead walk, where the demo's stood over MODE 'city', the map; a tap on LEAVE dropped him onto the walked street
   (the eight-way pad, HOLD TO WALK, BUILD HERE / SCAVENGE / BIKE / SLEEP) with no phone, where the demo's left him on the map with
   its phone. A save written on the walk brought the walk back on every reload; a pinch in at the map's closest stop walked.
   NOW the city framed by the game's own shell (the alpha's RUN or the demo) opens on the map, comes back to it from a save, and
   stops at its closest zoom (slices/BOHEMIA_CITY_WORLD.html __THE_ALPHA_OPENS_ON_THE_MAP__).

   LEGS (the alpha, a stranger's new game, the dark on):
     M1 THE FIRST TOWN STANDS ON THE MAP (upright and on its side): the new game's first town is up, the map under it
        (MODE 'city', the map's opener done)
     M2 LEAVE IS THE MAP (both shapes): a real tap on the phone's LEAVE: no town, the map, the phone on the glass, no walk pad
     M3 A SAVE FROM THE WALK COMES BACK ON THE MAP (upright): the game's own restore of a save written on the walk lands on the map
     M4 THE CLOSEST ZOOM STOPS (upright): a pinch in past the map's closest stop does not walk
     M5 nothing threw
     B1 THE BENCH IS UNTOUCHED: the city opened on its own (the 237 checkers that do) still boots on the walk, as before
     P  PLANT (upright): the city served with the shell's frame not counted as the game: LEAVE lands on the walk, and the leg sees it
   node gates/the_alpha_opens_on_the_map_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const { leaveTown } = require(path.join(ROOT, 'tools', 'bohemia_leave_the_town.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + String(x).slice(0, 500) + ']' : '')); return g; };
const settleFrame = (P) => P.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
const CITY = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');
const MARK = 'var CT_IN_SHELL = (function(){';

async function newGame(profile, serve) {
  const d = await open(Object.assign({ alpha: true, profile, fog: true }, serve ? { serve } : {}));
  const P = d.page, fr = d.fr;
  for (let i = 0; i < 80; i++) { if (await fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)).catch(() => false)) break; await P.waitForTimeout(250); }
  await P.waitForTimeout(1500);
  return d;
}
const READ = () => ({ mode: typeof MODE !== 'undefined' ? MODE : null, onMap: typeof DEMO_ON_MAP !== 'undefined' ? DEMO_ON_MAP : null,
  open: (window.LOOP && LOOP.open) ? (LOOP.open.name || 'camp') : null, shown: !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block'),
  pads: [].filter.call(document.querySelectorAll('.pb'), e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && getComputedStyle(e).visibility !== 'hidden'; }).length,
  czoom: typeof CZOOM !== 'undefined' ? +CZOOM.toFixed(3) : null });
const PHONE = () => { const b = document.querySelector('#bohphone.on'); if (!b) return false; const r = b.getBoundingClientRect(); return r.width > 40 && r.bottom > 0 && r.top < innerHeight; };

async function leaveAndRead(d, profile) {
  const P = d.page, fr = d.fr, sf = settleFrame(P);
  const before = await fr.evaluate(READ);
  const who = sf ? await leaveTown(P, sf, { ms: 6000 }) : null;
  await P.waitForTimeout(2500);
  const after = await fr.evaluate(READ), phone = await P.evaluate(PHONE);
  return { before, who, after, phone };
}

(async () => {
  const errs = [];
  for (const profile of ['phone_portrait', 'phone_landscape']) {
    let d = null;
    try {
      d = await newGame(profile);
      const r = await leaveAndRead(d, profile);
      ok('M1 THE FIRST TOWN STANDS ON THE MAP (' + profile + '): ' + (r.before.open || 'no town') + ' is up over MODE ' + r.before.mode,
        !!r.before.open && r.before.mode === 'city' && r.before.onMap === true, JSON.stringify(r.before));
      ok('M2 LEAVE IS THE MAP (' + profile + '): a real tap on ' + (r.who || 'no') + ' LEAVE: MODE ' + r.after.mode + ', the phone ' + (r.phone ? 'on' : 'OFF') + ', walk pads on the glass ' + r.after.pads,
        r.who === 'phone' && !r.after.open && !r.after.shown && r.after.mode === 'city' && r.phone && r.after.pads === 0, JSON.stringify(r));
      if (profile === 'phone_portrait') {
        const s = await d.fr.evaluate(() => { const snap = citySnapshot(), p = window.__proof.getPos(); snap.mode = 'human'; snap.hx = p.hx; snap.hy = p.hy;
          const n0 = window.__WALK_SAVE_TO_MAP | 0, okr = applyRestore(snap); return { ok: okr, mode: MODE, moved: (window.__WALK_SAVE_TO_MAP | 0) - n0 }; });
        await d.page.waitForTimeout(800);
        const s2 = await d.fr.evaluate(READ), ph = await d.page.evaluate(PHONE);
        ok('M3 A SAVE FROM THE WALK COMES BACK ON THE MAP: the restore of a walk save lands on MODE ' + s.mode + ', the phone ' + (ph ? 'on' : 'OFF'),
          s.ok === true && s.mode === 'city' && s.moved === 1 && s2.mode === 'city' && ph && s2.pads === 0, JSON.stringify([s, s2]));
        /* the map's own closest stop: zoomBounds' near stop, or the houses' street stop when they stand up close (setZoomAt's own) */
        const z = await d.fr.evaluate(() => { let zmax = zoomBounds()[1];
          try { if (window.BohemiaMapHouses && BohemiaMapHouses.on()) zmax = Math.max(zmax, BohemiaMapHouses.streetTW() / TW0); } catch (e) {}
          setZoomAt(zmax); const at = CZOOM;
          for (let i = 0; i < 6; i++) setZoomAt(zmax * 1.6); return { zmax: +zmax.toFixed(3), at: +at.toFixed(3), now: +CZOOM.toFixed(3), mode: MODE }; });
        await d.page.waitForTimeout(600);
        const z2 = await d.fr.evaluate(READ);
        ok('M4 THE CLOSEST ZOOM STOPS: six pinches in past the closest stop (' + z.zmax + '): MODE ' + z2.mode + ', the camera at ' + z.now,
          z.mode === 'city' && z2.mode === 'city' && Math.abs(z.now - z.zmax) < 1e-3 && z2.pads === 0, JSON.stringify([z, z2]));
      }
      errs.push.apply(errs, d.errs.map(e => profile + ': ' + e));
    } catch (e) { ok('the alpha\'s new game ran (' + profile + ')', false, String(e && e.stack || e).slice(0, 400)); }
    if (d) await d.close();
  }
  ok('M5 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));

  /* B1: the city on its own, as the checkers that open it alone see it */
  try {
    const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
    const http = require('http');
    const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
      rs.setHeader('content-type', /\.html$/.test(f) ? 'text/html' : /\.js$/.test(f) ? 'text/javascript' : /\.json$/.test(f) ? 'application/json' : 'application/octet-stream');
      fs.createReadStream(f).pipe(rs); });
    await new Promise(r => srv.listen(0, '127.0.0.1', r));
    const br = await chromium.launch(), ctx = await br.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' }), p = await ctx.newPage();
    await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_CITY_WORLD.html', { waitUntil: 'load', timeout: 180000 });
    await p.waitForFunction(() => typeof MODE !== 'undefined' && typeof om !== 'undefined' && om && om.n > 0, null, { timeout: 120000 });
    await p.waitForTimeout(1500);
    const b = await p.evaluate(() => ({ mode: MODE, inShell: CT_IN_SHELL, game: ctTheMapIsTheGame(), onMap: DEMO_ON_MAP }));
    ok('B1 THE BENCH IS UNTOUCHED: the city opened on its own boots on MODE ' + b.mode + ' (the shell\'s game: ' + b.game + ')', b.mode === 'human' && b.inShell === false && b.game === false && b.onMap === false, JSON.stringify(b));
    await br.close(); srv.close();
  } catch (e) { ok('B1 the bench opened', false, String(e).slice(0, 300)); }

  /* P: the plant: the shell's frame not counted as the game, as before the fix */
  const src = fs.readFileSync(CITY, 'utf8');
  if (src.indexOf(MARK) < 0) ok('P the plant found its line', false, MARK);
  else {
    const tmp = path.join(os.tmpdir(), 'alpha_map_plant_' + process.pid + '.html');
    fs.writeFileSync(tmp, src.replace(MARK, 'var CT_IN_SHELL = false && (function(){'));
    let d = null;
    try {
      d = await newGame('phone_portrait', { '/slices/BOHEMIA_CITY_WORLD.html': tmp });
      const r = await leaveAndRead(d, 'phone_portrait');
      ok('P PLANTED (the shell\'s frame is not the game): the leg sees the first town over MODE ' + r.before.mode + ' and LEAVE on MODE ' + r.after.mode + ' (walk pads ' + r.after.pads + ')',
        r.before.mode === 'human' && r.after.mode === 'human' && r.after.pads > 0, JSON.stringify(r));
    } catch (e) { ok('P the plant ran', false, String(e).slice(0, 300)); }
    if (d) await d.close();
    try { fs.unlinkSync(tmp); } catch (e) {}
  }
  console.log('THE ALPHA OPENS ON THE MAP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

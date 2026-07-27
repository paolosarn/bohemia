/* BOHEMIA RUN ART SOURCE AUDIT (7/28/26) — what is the game actually MADE of?
 *
 * > "walls are there now doing good im happy it still looks like shit so much of
 * >  the game but whatever"
 *
 * You cannot answer that by looking. This patches drawImage before the run
 * boots, tags every image object by the BANK it came from, draws real frames
 * inside the house and out on the block, and counts who drew what.
 *
 * The 7/28 result, which is the answer to his sentence:
 *   OUT ON THE BLOCK   83% of draws are the CBB target tileset (his own verdict
 *                      on it was "could be better"), 17% his approved border walls
 *   INSIDE             63% the Great-Sweep interior pool, 35% the CBB tileset
 *   AND: ROOF_IMG / WALL_IMG / YARD_IMG — his 30 house skins, all thumbed UP on
 *   7/21 — are decoded on load and NEVER DRAWN. Present and unused passed every
 *   gate in the repo, exactly like his 13 border walls did until that same day.
 *
 * Write-up: records/BOHEMIA_RUN_ART_SOURCE_AUDIT_7_28_26.md
 *
 *   node tools/bohemia_run_art_source_audit.js slices/BOHEMIA_RUN_CURRENT.html
 */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const PROBE = `(() => {
  const P = CanvasRenderingContext2D.prototype, orig = P.drawImage;
  const rec = { on:false, by:{} };
  window.__ART = rec;
  P.drawImage = function (img, ...a) {
    if (rec.on) { try {
      const t = (img && img.__srcTag) || 'untagged';
      rec.by[t] = (rec.by[t] || 0) + 1;
    } catch(e){} }
    return orig.apply(this, [img, ...a]);
  };
})();`;

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(PROBE);
  await page.goto('file://' + path.resolve(process.argv[2]), { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(8000);
  const out = await page.evaluate(() => {
    // tag every image object we can reach, by the bank it came from
    const tag = (arr, name) => { try { (arr || []).forEach(o => {
      if (o && o.tagName === 'IMG') o.__srcTag = name;
      else if (o && typeof o === 'object') Object.values(o).forEach(v => { if (v && v.tagName === 'IMG') v.__srcTag = name; });
    }); } catch (e) {} };
    const named = {};
    if (typeof TT !== 'undefined') tag(Object.values(TT), 'THE CBB TARGET TILESET (42 tiles, verdict was could-be-better)');
    
    if (typeof ROOF_IMG !== 'undefined') tag(ROOF_IMG, 'house roof skins (7/21 UP)');
    if (typeof WALL_IMG !== 'undefined') tag(WALL_IMG, 'house wall skins (7/21 UP)');
    if (typeof YARD_IMG !== 'undefined') tag(YARD_IMG, 'yard skins (7/21 UP)');
    if (typeof PERIM_IMG !== 'undefined') tag(PERIM_IMG, 'SUBURB BORDER WALLS (his 13, approved 7/28)');
    if (typeof IP !== 'undefined') Object.keys(IP).forEach(k => tag(IP[k], 'interior pool (Great Sweep UP)'));
    // what globals hold images at all?
    for (const k of Object.keys(window)) {
      try { const v = window[k];
        if (Array.isArray(v) && v.length && v[0] && v[0].tagName === 'IMG' && !v[0].__srcTag) { tag(v, 'UNTAGGED: ' + k); named[k] = v.length; }
      } catch (e) {}
    }
    // walk out and around so the block draws
    const rec = window.__ART; rec.on = true; rec.by = {};
    try { if (typeof mode !== 'undefined' && mode === 'int') { /* stay inside first */ } } catch (e) {}
    for (let i = 0; i < 3; i++) { try { draw(); } catch (e) {} }
    const inside = JSON.parse(JSON.stringify(rec.by));
    // step outside
    try { mode = 'ext'; buildSim && buildSim(0); } catch (e) {}
    rec.by = {};
    for (let i = 0; i < 3; i++) { try { draw(); } catch (e) {} }
    rec.on = false;
    return { inside, outside: rec.by, extraImageArrays: named };
  });
  const show = (t, o) => {
    const tot = Object.values(o).reduce((a, c) => a + c, 0) || 1;
    console.log('  ' + t + ' (' + tot + ' draws)');
    Object.entries(o).sort((a, c) => c[1] - a[1]).forEach(([k, v]) =>
      console.log('     ' + String(Math.round(100 * v / tot)).padStart(3) + '%  ' + String(v).padStart(5) + '  ' + k));
  };
  show('INSIDE YOUR HOUSE', out.inside);
  show('OUT ON THE BLOCK', out.outside);
  console.log('  other image arrays found:', JSON.stringify(out.extraImageArrays));
  await b.close();
})();

#!/usr/bin/env node
// JOBS [a name fades] 11/20 -- ON HIS PHONE (VAMILY rules 461, 441). The game on a phone (upright and sideways), the demo or the alpha
// (--alpha), A NEW CREW, the valley K7QM9X.
//   THE FADE: the company at 260 CLOUT (the game's own renown record, the one shortcut, said); one step on the map; five days on the
//   map's own clock (advance, the function every passing hour goes through); one step: CLOUT 245; Caravans' board opened with a finger
//   says MORE WORK HERE AT 250 CLOUT again.
//   A NEW COMPANY IS A STRANGER: the old company's town bar, a client it pushed away, a finished job still on its way to its town and the
//   fade's day are in the records, a save is made; the page is opened again and NEW GAME is tapped twice on the title (the second tap
//   confirms over a save); after the game's own forget and reload, the four records are gone (and CLOUT with them, as before).
// Writes <out>/name_fades_<tag>.json.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, CODE = arg('--code', 'K7QM9X');
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.resolve(ROOT, arg('--out', 'records/target/jobs_11_20')), TAG = arg('--tag', ALPHA ? 'alpha' : 'demo');
fs.mkdirSync(OUTD, { recursive: true });
const KEYS = ['bohemia.relations.v1', 'bohemia.haggle.v1', 'bohemia.job.settled.v1', 'bohemia.clout.fade.v1', 'bohemia.renown.v1'];

async function walk(shape) {
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], row = { shape, alpha: ALPHA };
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const shot = async (name) => { const p = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_' + name + '.png')); await page.screenshot({ path: path.join(ROOT, p) }); return p; };
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && BohemiaBoardShelf.shelf().clout_fade > 0 && window.BohemiaRenown && typeof advance === 'function' && window.LOOP && LOOP.start, null, { timeout: 180000 });
    await page.waitForTimeout(2500);
    /* THE FADE */
    row.fade = await fr.evaluate(() => { const out = {};
      try { loopClose(); } catch (e) {} LOOP.held = [];
      localStorage.setItem('bohemia.renown.v1', JSON.stringify({ score: 260, keys: [], log: [] })); localStorage.removeItem('bohemia.clout.fade.v1');
      BohemiaJobKinds.step(); out.day0 = loopDay(); out.c0 = BohemiaRenown.score();
      for (let k = 0; k < 5; k++) advance(24 * 60); out.day1 = loopDay();   /* five days on the clock, a day at a time */ out.c1before = BohemiaRenown.score();   /* the clock alone moves nothing until he moves */
      BohemiaJobKinds.step(); out.c1 = BohemiaRenown.score(); out.faded = window.__NAME_FADED | 0;
      BohemiaJobKinds.step(); out.c1again = BohemiaRenown.score();   /* a second step the same day takes nothing more */
      return out; });
    /* Caravans' board, with a finger */
    const tn = 'Caravans', dd = row.fade.day1;
    await fr.evaluate(([n, x]) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, [tn, dd]);
    await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 60000);
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    await waitFor(() => sf.evaluate((n) => !!(BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), tn), 20000);
    for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]);
      if (xy) await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height));
      if (await waitFor(() => sf.evaluate(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet button.act.client').length > 0), 8000)) break; }
    await page.waitForTimeout(800);
    row.fade.label = await sf.evaluate(() => { const e = document.querySelector('#sheet .waits'); return e ? e.textContent : null; });
    row.fade.png = await shot('fade_board');
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
    /* A NEW COMPANY IS A STRANGER. The workshop (the alpha) has no title: it opens on VOTE after its loading screen (rule 18, the vote
       tab law), so NEW GAME and its forget list are the demo's alone (BOH_TITLE.skipped 'workshop'); the alpha says so and stops here */
    const ws = await page.evaluate(() => window.BOH_TITLE ? (BOH_TITLE.skipped || null) : 'none').catch(() => null);
    if (ALPHA && ws === 'workshop') { row.forget = { workshop: true }; throw null; }
    row.forget = { before: await fr.evaluate((keys) => {
      const r = JSON.parse(localStorage.getItem('bohemia.relations.v1') || 'null') || { bars: {}, seen: {} }; r.bars = r.bars || {}; r.bars.Caravans = 10; localStorage.setItem('bohemia.relations.v1', JSON.stringify(r));
      localStorage.setItem('bohemia.haggle.v1', JSON.stringify({ 'jb-ring-trucks@Caravans': { asks: 3, walked: true, win: 0 } }));
      localStorage.setItem('bohemia.job.settled.v1', JSON.stringify([{ place: 'Caravans', act: 'fail_civilian_contract', id: 'jb-old-job' }]));
      try { if (typeof saveNow === 'function') saveNow('jobs: the old company'); } catch (e) {}
      const o = {}; keys.forEach(k => { o[k] = localStorage.getItem(k) != null; }); return o; }, KEYS) };
    await page.waitForTimeout(2500);
    await page.reload({ waitUntil: 'load', timeout: 300000 });
    const titleUp = () => page.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false);
    if (!await waitFor(titleUp, 120000)) throw new Error('the title never stood after the reload');
    row.forget.saved = await page.evaluate(() => { try { return !!BOH_TITLE.saved(); } catch (e) { return null; } });
    const tapNew = async () => { const b = await page.evaluate(() => { const t = document.getElementById('title'); const e = t && (t.querySelector('.bm-start [data-k=new]') || t.querySelector('[data-k=new]')); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
      if (!b) return false; await page.touchscreen.tap(b[0], b[1]); return true; };
    row.forget.png = await shot('title');
    if (!await tapNew()) throw new Error('no NEW GAME on the title');
    await page.waitForTimeout(900);
    const reloaded = page.waitForNavigation({ timeout: 60000 }).catch(() => null);
    if (row.forget.saved) { if (!await tapNew()) throw new Error('no NEW GAME to confirm'); }
    await reloaded; await page.waitForTimeout(3000);
    row.forget.after = await page.evaluate((keys) => { const o = {}; keys.forEach(k => { o[k] = localStorage.getItem(k) != null; }); return o; }, KEYS);
  } catch (e) { if (e !== null) row.err = String(e && e.message || e).slice(0, 300); }
  row.errs = errs.slice(0, 5);
  console.log('  ' + TAG + ' ' + shape + ': ' + (row.err ? 'ERR ' + row.err + ' ' : '') + (row.fade ? 'CLOUT ' + row.fade.c0 + ' on day ' + row.fade.day0 + ', five days on the clock (' + row.fade.c1before + ' until he moves), a step: ' + row.fade.c1 + ' (faded ' + row.fade.faded + '), again ' + row.fade.c1again + '; Caravans [' + row.fade.label + ']' : '') +
    (row.forget && row.forget.workshop ? ' | the workshop has no title (NEW GAME is the demo\'s)' : '') + (row.forget && row.forget.after ? ' | a new game over a save (' + row.forget.saved + '): before ' + JSON.stringify(row.forget.before) + ' after ' + JSON.stringify(row.forget.after) : ''));
  await d.close().catch(() => {});
  return row;
}
(async () => {
  const res = [];
  for (const s of SHAPES) res.push(await walk(s));
  const f = path.join(OUTD, 'name_fades_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_a_name_fades_on_the_phone.js', tag: TAG, alpha: ALPHA, walks: res }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f));
})();

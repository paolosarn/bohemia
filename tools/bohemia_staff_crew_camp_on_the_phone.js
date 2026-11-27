#!/usr/bin/env node
// STAFF 3 [the crew screen] 11/27 -- VAMILY rule 471(b) ('these characters can only use one-handed weapons, so either a pistol or like
// a one-handed melee'), STAFF 2's next (3): the crew screen shows the camp and lets him hand a camp person a one-handed weapon.
// The page he plays, his phone upright and on its side: the camp book holds the cook, the surgeon, the scout and the blacksmith; the
// stash is given a snub revolver, a hatchet, a hunting bow and a two-handed axe (the roster's own itemOf, the screen's own stash);
// the crew screen is opened with his phone's CREW, and every step is a real tap on the glass.
//   K1 the CAMP row shows every camp person (four cells), each with the weapon in his hand in its corner
//   K2 a tap on the cook: her card (her name, THE COOK, her cart, what is in her hand) and the stash ONE HAND ONLY: the revolver and
//      the hatchet lit, the bow and the two-handed axe not there
//   K3 a tap on the revolver: the camp book has it in her hand, the stash lost it, the fight's hand-over (BohemiaCamp.staff) carries it
//   K4 HAND IT BACK: the revolver is in the stash again and her box cutter is in her hand
//   K5 a tap on a man of the company: his card again
//   P  no page error
//   node tools/bohemia_staff_crew_camp_on_the_phone.js [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const A = process.argv.slice(2), arg = (k, d) => { const i = A.indexOf(k); return i >= 0 ? A[i + 1] : d; };
const ALPHA = A.includes('--alpha'), CODE = arg('--code', 'K7QM9X'), SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(',');
const OUTD = path.resolve(ROOT, arg('--out', 'records/target/staff_cart')), TAG = ALPHA ? 'alpha' : 'demo';
const CAMP = ['cook', 'surgeon', 'scout', 'blacksmith'];
const GIVE = ['snub_revolver', 'hatchet', 'hunting_bow', 'woodcutter_s_axe'];
fs.mkdirSync(OUTD, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function walk(shape) {
  const arm = "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "');" +
    " var c = JSON.parse(localStorage.getItem('bohemia.camp.v1') || 'null') || { cart: 0, retinue: [] }; if (!c.__crewProof) { c.retinue = " + JSON.stringify(CAMP) + "; c.carts = { surgeon: 1, blacksmith: 2 }; c.arms = {}; c.__crewProof = 1; localStorage.setItem('bohemia.camp.v1', JSON.stringify(c)); } } catch (e) {}";
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, arm });
  const page = d.page, errs = [], row = { shape, surface: TAG };
  page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const short = shape === 'phone_portrait' ? 'upright' : 'sideways';
  const shot = async name => { const p = path.relative(ROOT, path.join(OUTD, TAG + '_' + short + '_crew_camp_' + name + '.png')); await page.screenshot({ path: path.join(ROOT, p) }); (row.png = row.png || []).push(p); };
  const rosterF = () => page.frames().find(x => /ROSTER_SCREEN/.test(x.url())) || null;
  const tapEl = async (fr, sel) => { const h = await fr.$(sel); const b = h && await h.boundingBox(); if (!b || b.width < 2) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  try {
    await page.waitForTimeout(2500);
    await page.evaluate(() => { window.__PLAY_BEGAN = true; });
    /* the crew screen from his camp (the camp under the screen, rule 369): off the town he makes camp with the map's own MAKE CAMP,
       then the camp's own CREW button, a real tap */
    await d.fr.evaluate(() => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} });
    await d.fr.evaluate(drive.offTheTown).catch(() => null);
    row.campMade = await d.fr.evaluate(() => { try { CITY_CONTACT_POSTED = true; return !!BohemiaMapCamp.make(); } catch (e) { return String(e); } });
    let cf = null; for (let k = 0; k < 120 && !cf; k++) { for (const x of page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url())))
        if (await x.evaluate(() => { try { return BohemiaSettlement.camp().camp && BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) cf = x;
      if (!cf) await page.waitForTimeout(300); }
    if (!cf) throw new Error('no camp frame');
    await page.waitForTimeout(1500);
    let rf = null;
    for (let k = 0; k < 3 && !rf; k++) {
      if (!(await tapEl(cf, '#crew'))) await cf.evaluate(() => document.getElementById('crew').click()).catch(() => {});
      for (let i = 0; i < 40 && !rf; i++) { const f = rosterF(); if (f && await f.evaluate(() => !!(window.BohemiaRosterScreen && BohemiaRosterScreen.state.crew.length && window.BohemiaCrewCamp)).catch(() => false)) rf = f; else await sleep(250); }
    }
    if (!rf) { row.dbg = { frames: page.frames().map(x => x.url().split('/').pop().slice(0, 40)) }; const f = rosterF(); if (f) row.dbg.r = await f.evaluate(() => ({ rs: !!window.BohemiaRosterScreen, n: window.BohemiaRosterScreen && BohemiaRosterScreen.state.crew.length, cc: typeof CREW_CAMP, bc: typeof BohemiaCrewCamp })).catch(e => String(e)); }
    row.crewScreen = !!rf; if (!rf) throw new Error('no crew screen ' + JSON.stringify(row.dbg));
    /* the stash given four pieces, the roster's own items, through the screen's own stash */
    row.seeded = await rf.evaluate((ids) => { const S = BohemiaRosterScreen.state, out = []; ids.forEach(id => { const it = BohemiaRoster.itemOf('weapon', id); if (it) { S.bag.push(it); out.push(id + ':' + it.hands + ':' + it.cls); } });
      BohemiaCrewCamp.redraw(true); return out; }, GIVE);
    await sleep(900);
    row.row = await rf.evaluate(() => [].map.call(document.querySelectorAll('#camp .cell.camp'), c => ({ id: c.dataset.camp, hand: !!c.querySelector('.hand'), name: (c.querySelector('b') || {}).textContent })));
    row.rowOn = await rf.evaluate(() => { const r = document.getElementById('camprow'); return !!r && r.classList.contains('on') && r.getBoundingClientRect().height > 8; });
    await shot('1_the_row');
    /* K2: a tap on the cook */
    row.tapCook = await tapEl(rf, '#camp .cell.camp[data-camp="cook"]'); await sleep(700);
    row.card = await rf.evaluate(() => ({ camp: (document.getElementById('card') || {}).dataset && document.getElementById('card').dataset.camp, nm: (document.querySelector('#card .nm') || {}).textContent, sub: (document.querySelector('#card .sub') || {}).textContent,
      lines: [].map.call(document.querySelectorAll('#card .ccl'), x => x.textContent.trim()), said: (document.getElementById('said') || {}).textContent,
      stash: [].map.call(document.querySelectorAll('#bag [data-campbag]'), b => BohemiaRosterScreen.state.bag[+b.dataset.campbag].id), head: (document.getElementById('bagh') || {}).textContent }));
    await shot('2_the_cook_picked');
    /* K3: a tap on the revolver */
    const bi = await rf.evaluate(() => { const b = [].find.call(document.querySelectorAll('#bag [data-campbag]'), x => BohemiaRosterScreen.state.bag[+x.dataset.campbag].id === 'snub_revolver'); return b ? b.dataset.campbag : null; });
    row.tapGive = bi != null && await tapEl(rf, '#bag [data-campbag="' + bi + '"]'); await sleep(700);
    row.given = await rf.evaluate(() => ({ book: (BohemiaCamp.armsItem('cook') || {}).id || null, inStash: BohemiaRosterScreen.state.bag.filter(i => i.id === 'snub_revolver').length, said: document.getElementById('said').textContent,
      saved: JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').filter(i => i && i.id === 'snub_revolver').length, corner: (document.querySelector('#camp .cell.camp[data-camp="cook"] .hand') || {}).dataset }));
    /* the fight's hand-over: the camp book as the shell's map frame reads it when it hands the fight its staff */
    const ho = () => { try { const s = BohemiaCamp.staff().filter(p => p.id === 'cook')[0]; return s ? s.weapon : null; } catch (e) { return 'ERR ' + e; } };
    row.handOver = await d.fr.evaluate(ho).catch(() => null); if (!row.handOver || /^ERR/.test(row.handOver)) row.handOver = await cf.evaluate(ho).catch(e => 'ERR ' + e);
    await shot('3_the_cook_holds_the_revolver');
    /* K4: HAND IT BACK */
    row.tapBack = await tapEl(rf, '#campback'); await sleep(700);
    row.back = await rf.evaluate(() => ({ book: (BohemiaCamp.armsItem('cook') || {}).id || null, arms: BohemiaCamp.armsOf('cook'), inStash: BohemiaRosterScreen.state.bag.filter(i => i.id === 'snub_revolver').length, said: document.getElementById('said').textContent }));
    /* K5: a man of the company */
    row.tapMan = await tapEl(rf, '#front .cell.full, #back .cell.full'); await sleep(800);
    row.man = await rf.evaluate(() => ({ camp: document.getElementById('card').dataset.camp || null, nm: (document.querySelector('#card .nm') || {}).textContent, sel: BohemiaCrewCamp.selected() }));
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); }
  row.errs = errs.slice(0, 5);
  const R = row, c = R.card || {}, g = R.given || {}, b = R.back || {}, m = R.man || {};
  R.K1 = !!R.rowOn && (R.row || []).length === CAMP.length && (R.row || []).every(x => x.hand);
  R.K2 = c.camp === 'cook' && /GRACIELA/.test(c.nm || '') && /COOK/.test(c.sub || '') && (c.lines || []).some(l => /cart/i.test(l)) && (c.lines || []).some(l => /^In her hand/.test(l)) &&
    (c.stash || []).includes('snub_revolver') && (c.stash || []).includes('hatchet') && !(c.stash || []).includes('hunting_bow') && !(c.stash || []).includes('woodcutter_s_axe');
  R.K3 = g.book === 'snub_revolver' && g.inStash === 0 && g.saved === 0 && R.handOver === 'snub_revolver';
  R.K4 = b.book === null && b.arms === 'box_cutter' && b.inStash === 1;
  R.K5 = !m.camp && !m.sel && !!m.nm;
  R.P = !R.err && !errs.length;
  await d.browser.close().catch(() => {});
  return R;
}

(async () => {
  const out = [];
  for (const s of SHAPES) { const r = await walk(s); out.push(r); console.log(TAG + ' ' + s + ' ' + JSON.stringify({ K1: r.K1, K2: r.K2, K3: r.K3, K4: r.K4, K5: r.K5, P: r.P }));
    console.log('  ' + JSON.stringify({ seeded: r.seeded, row: r.row, card: r.card, given: r.given, handOver: r.handOver, back: r.back, man: r.man, err: r.err, errs: r.errs }).slice(0, 1600)); }
  fs.writeFileSync(path.join(OUTD, 'crew_camp_' + TAG + '.json'), JSON.stringify(out, null, 1));
  process.exit(out.every(r => r.K1 && r.K2 && r.K3 && r.K4 && r.K5 && r.P) ? 0 : 1);
})();

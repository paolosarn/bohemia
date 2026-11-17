#!/usr/bin/env node
/* THE SCRAP MILL (WORLD 14, 11/17; the coordinator's round under rule 453: 'the next building kinds the map lacks from the checklist,
   each with its settlement screen and what it DOES for him, the fewest words'; the checklist's item 13, 'the scrap mill (their steel
   mill; our junkyard has no mill)'; rule 441: on the real page, alpha and demo, a phone both ways; rule 454(a): no person talks).
   What it DOES needs no words: Battle Brothers' attached location (a workshop puts its goods on the market). Its stall holds twice the
   tape and sells copper wire at the maker's price, a batch a week, to carry where it is not made (rule 266(a)).
     S1 the row: a valley place of kind industrial, its real spot, its finds, no visit and no feed post (no person talks this week)
     S2 the stall's own file: THE SCRAP MILL makes copper wire; the wire costs less at the mill than at any faction town that does not
        make it, and sells back for little there (Battle Brothers' 15 in 100); the tape shelf is twice a camp's elsewhere
     S3 MUTATION: the mill taken out of the made_by lists, S2 goes red
     On the page (demo and alpha, upright and sideways):
     S4 on the map: the mill's block is seated, of its own kind, with its name
     S5 arriving opens its settlement screen under its own name, never a visit card
     S6 in that screen's stall: copper wire is on the shelf, MADE HERE, and the tape shelf is twice a camp's
     S7 nothing threw
   Run: node gates/the_scrap_mill_gate.js [node|demo|alpha|demo-up|demo-side|alpha-up|alpha-side] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 400) + ']' : '')); };
const J = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const NAME = 'THE SCRAP MILL', ID = 'the_scrap_mill';
const SP = require(path.join(ROOT, 'engine', 'bohemia_stall_prices.js'));
const FACTIONS = ['Anarchists', 'Blues', 'Caravans', 'Cartel', 'Church', 'Colorful', 'Homeless', 'Mob', 'Network', 'Reds', 'Remnants', 'Volunteers'];

function stallBad(file) {
  const why = [];
  if ((SP.makes(file, NAME) || []).indexOf('copper_wire') < 0) why.push('the mill makes no copper wire');
  const at = SP.tradeBuy(file, 'copper_wire', { place: NAME, tier: 'camp' });
  const away = FACTIONS.filter(f => !SP.madeHere(file, 'copper_wire', f)).map(f => SP.tradeBuy(file, 'copper_wire', { place: f, tier: 'camp' }));
  if (!(at < Math.min.apply(null, away))) why.push('the wire is not cheaper at the mill (' + at + ' against ' + Math.min.apply(null, away) + ')');
  const sell = SP.tradeSell(file, 'copper_wire', { place: NAME, tier: 'camp' });
  if (!(sell <= Math.ceil(0.2 * at))) why.push('the mill buys its own wire back dear (' + sell + ')');
  const tm = SP.tapeShelf(file, { place: NAME, tier: 'camp' }), tv = SP.tapeShelf(file, { place: 'Volunteers', tier: 'camp' });
  if (!(tm >= 2 * tv)) why.push('the tape shelf ' + tm + ' is not twice a camp\'s ' + tv);
  return why;
}

function nodeChecks() {
  const RP = J('records/target/bb/real_places.json').places, p = RP.find(q => q.id === ID);
  const w1 = [];
  if (!p) w1.push('no row');
  else {
    if (p.kind !== 'industrial' || p.where !== 'valley' || p.name !== NAME) w1.push('kind/where/name');
    if (!(p.lat > 36.1 && p.lat < 36.3 && p.lon > -115.25 && p.lon < -115.05)) w1.push('no real spot');
    if (!(p.finds || []).length) w1.push('no finds');
    if (p.visit || p.feed) w1.push('a person talks (visit or feed) this week');
  }
  ok('S1 the row: ' + NAME + ', a valley place of kind industrial at its real spot, its finds, no person talking', !w1.length, w1.join(', ') || (p.latlon_from));
  const file = J('records/target/bb/stall_prices.json'), b = stallBad(file);
  ok('S2 its stall: copper wire made at the mill (cheaper there than anywhere it is not made, bought back for little), twice the tape', !b.length,
     b.join('; ') || ('wire ' + SP.tradeBuy(file, 'copper_wire', { place: NAME, tier: 'camp' }) + ' at the mill, tape ' + SP.tapeShelf(file, { place: NAME, tier: 'camp' })));
  const m = JSON.parse(JSON.stringify(file));
  m.trade.goods.forEach(g => { g.made_by = (g.made_by || []).filter(x => x !== NAME); }); m.tape_shelf.made_by.value = m.tape_shelf.made_by.value.filter(x => x !== NAME);
  ok('S3 MUTATION: the mill out of the made_by lists, S2 is red', stallBad(m).length >= 2, stallBad(m).length + ' faults');
}

async function page(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile, fog: true }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 180; i++) {
      if (await fr.evaluate(() => !!(window.BOH_REAL_PLACES && BOH_REAL_PLACES.loaded && typeof om !== 'undefined' && om.n && typeof MODE !== 'undefined' && MODE === 'city'))) break;
      await pg.waitForTimeout(500);
    }
    try { await d.toMap(); } catch (e) {}
    const r = await fr.evaluate(async (NAME) => {
      const o = {}; const wait = (ms) => new Promise(z => setTimeout(z, ms));
      try { if (window.BohemiaRoadEvents) BohemiaRoadEvents.close(false); } catch (e) {} try { loopClose(); } catch (e) {}
      const c = (BOH_REAL_PLACES.cellsNow() || []).find(q => q.name === NAME || q.id === 'the_scrap_mill');
      if (!c) return o;
      o.cell = { x: c.x, y: c.y, kind: (om.at(c.x, c.y) || {}).district };
      city.x = c.x; city.y = c.y;
      const t = loopTownAt(c.x, c.y, 1); o.town = t && t.name; loopOpenTown(t);
      o.card = !!document.getElementById('roadcard');
      for (let i = 0; i < 60 && !(LOOP.ready && LOOP.frame); i++) await wait(250);
      try { loopPostOpen(); } catch (e) {}
      const W2 = LOOP.frame && LOOP.frame.contentWindow;
      o.shown = LOOP.frame.style.display !== 'none'; o.open = LOOP.open && LOOP.open.name;
      return o; }, NAME);
    /* the screen's own page, through its own handle (BohemiaSettlement, as ECONOMY's trade gate reads it); the stall opened by a tap */
    let sf = null;
    for (let k = 0; k < 60 && !sf; k++) { await pg.waitForTimeout(400);
      for (const x of pg.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url())))
        if (await x.evaluate((N) => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === N; } catch (e) { return false; } }, NAME).catch(() => false)) { sf = x; break; } }
    if (sf) {
      await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await pg.waitForTimeout(1200);
      r.screen = await sf.evaluate(() => BohemiaSettlement.state.place.name);
      const w = await sf.evaluate(() => BohemiaSettlement.where('stall')).catch(() => null);
      if (w) { const fb = await (await sf.frameElement()).boundingBox(); await pg.touchscreen.tap(fb.x + w.x, fb.y + w.y); await pg.waitForTimeout(1300);
        await sf.waitForFunction(() => BohemiaSettlement.state.open === 'stall' && !!document.querySelector('#stallstrip'), null, { timeout: 8000 }).catch(() => {}); }
      Object.assign(r, await sf.evaluate(() => { const o = {};
        try { o.stallOpen = BohemiaSettlement.state.open;
          const ln = document.querySelector('#stallgoods .tgline[data-good=copper_wire]'); o.line = ln ? ln.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : null;
          o.made = (BohemiaSettlement.trade() || []).filter(q => q.made).map(q => q.id);
          const F = window.BohemiaStallPrices, file = BohemiaSettlement.tradeFile(), pl = BohemiaSettlement.state.place;
          o.tape = F.tapeShelf(file, { place: pl.name, tier: pl.tier }); o.tapeElse = F.tapeShelf(file, { place: 'Volunteers', tier: pl.tier }); } catch (e) { o.err = String(e && e.message || e); }
        return o; }).catch(e => ({ err: String(e).slice(0, 120) })));
    } else r.err = 'no settlement screen for the mill';
    ok(W + ' S4 on the map: the mill is seated, its own kind', !!r.cell && r.cell.kind === 'industrial', JSON.stringify(r.cell));
    ok(W + ' S5 arriving opens its settlement screen under its own name, no visit card', r.screen === NAME && r.shown && !r.card, JSON.stringify({ town: r.town, open: r.open, screen: r.screen, shown: r.shown, card: r.card, err: r.err }));
    ok(W + ' S6 its stall, opened by a tap: copper wire on the shelf MADE HERE, the tape shelf twice a camp\'s', (r.made || []).indexOf('copper_wire') >= 0 && /MADE HERE/i.test(r.line || '') && r.tape >= 2 * r.tapeElse, JSON.stringify({ open: r.stallOpen, line: r.line, made: r.made, tape: r.tape, else: r.tapeElse, err: r.err }));
    if (process.env.MILL_SHOT) { try { await pg.waitForTimeout(800); await pg.screenshot({ path: process.env.MILL_SHOT + '_' + (alpha ? 'alpha' : 'demo') + '_' + profile + '.png' }); } catch (e) {} }
    ok(W + ' S7 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  try { nodeChecks(); } catch (e) { ok('the node checks ran', false, String(e.stack || e.message).slice(0, 300)); }
  const only = process.argv[2];
  if (only !== 'node') for (const [alpha, prof] of [[false, 'phone_portrait'], [false, 'phone_landscape'], [true, 'phone_portrait'], [true, 'phone_landscape']]) {
    if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
    const tag = (alpha ? 'alpha' : 'demo') + '-' + (prof === 'phone_landscape' ? 'side' : 'up');
    if (only && /-(up|side)$/.test(only) && only !== tag) continue;
    try { await page(alpha, prof); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
  }
  console.log('\nTHE SCRAP MILL: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();

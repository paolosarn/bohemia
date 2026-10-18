/* THE CREW SCREEN READS THE STASH (RUN TWO, row [the crew screen reads the stash], 10/18/26).
   His twelfth vote: 'still not a button for me to view my crew, equip them with items from my storage'. [equip from the
   stash] built the half where an item moves; this is the half where he SEES who is wearing what. Played on his phone's
   profile (390x844 at 3x) with real taps: the company screen opens with every living man in one row, his face and his
   four slots FILLED with his gear (a weapon shows the pack's own tile); the stash's items are in the bag; tap a man's
   HEAD slot and the bag opens inside his row cut to what fits a head (the rifle is not offered); tap the hat and he
   wears it, the bag lost it; tap his MAIN slot, pick the rifle, they swap and his old gun is back in the bag; TAKE OFF
   empties a slot into the bag; every slot is thumb-sized and the rows fit the glass; the company the fight reads
   carries the ids. Then the same rows through the one door from the settlement screen (engine/bohemia_crew_door.js).
   Shot (with --shoot) in slices/vote/.  Run: node gates/the_crew_screen_reads_the_stash_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8873;
const { proofShot } = require(path.join(__dirname, '..', 'tools', 'bohemia_proof_shot.js'));
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const SHOT = proofShot(path.join(ROOT, 'slices/vote/RUN2_WHO_IS_WEARING_WHAT_10_18.png'));
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
/* the stash the market leaves: a rifle, a hard hat, a vest (the shapes the settlement's bag posts) */
const STASH = [
  { id: 'light_crossbow', kind: 'weapon', cls: 'crossbow', name: 'solid rifle', was: 'Light Crossbow', price: 30, nums: 'dmg 30-50  reach 6' },
  { id: 'kettle_hat', kind: 'head', name: 'a hard hat', was: 'Kettle Hat', price: 9, nums: 'holds 90  weight 2' },
  { id: 'padded_vest', kind: 'body', name: 'a padded vest', was: 'Padded Vest', price: 10, nums: 'holds 55  weight 4' }];
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript(st => { try { if (!sessionStorage.getItem('__w')) { sessionStorage.setItem('__w', 1);
    ['bohemia.climb.v1', 'bohemia.company.v1', 'bohemia.hired.v1'].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('bohemia.formation.v1', 'null'); localStorage.setItem('bohemia.bag.v1', JSON.stringify(st)); } } catch (e) {} }, STASH);
  const p = await ctx.newPage(); const errs = [], missing = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await p.waitForTimeout(900);
  ok('every file the screen loads is there', missing.length === 0, missing.slice(0, 2).join(' '));
  /* 1. every living man is a row with four slots, his gear filled in */
  const rows = await p.evaluate(() => { const S = BohemiaRosterScreen.state, live = S.crew.filter(m => !m.dead);
    const rs = [].slice.call(document.querySelectorAll('#wear .wrow'));
    return { live: live.length, rows: rs.length, slots: rs.map(r => r.querySelectorAll('.wslot').length),
      filled: rs.map(r => { const m = S.crew[+r.dataset.man]; return ['main', 'off', 'body', 'head'].every(s => { const d = r.querySelector('.wslot[data-wslot="' + s + '"]');
        return !!m.gear[s] === d.classList.contains('full') && (!m.gear[s] || d.textContent.indexOf(m.gear[s].name.replace(/^(a|an) /, '').split(' ').slice(-1)[0]) >= 0); }); }),
      faces: rs.map(r => { const c = r.querySelector('canvas.wface'); if (!c) return 0; const d = c.getContext('2d').getImageData(0, 0, 64, 64).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; }),
      tiles: rs.filter(r => r.querySelector('.wslot[data-wslot="main"] img.pk')).length,
      worn: live.filter(m => m.gear.main).length }; });
  ok('every living man is one row on the company screen', rows.rows === rows.live && rows.live >= 3, rows.rows + ' rows for ' + rows.live + ' men');
  ok('  each row has his four slots (main, off, body, head)', rows.slots.every(n => n === 4), rows.slots.join(','));
  ok('  and every slot reads what he wears: full where he has it, empty where he does not, the name on it', rows.filled.every(Boolean), rows.filled.filter(Boolean).length + ' of ' + rows.filled.length);
  ok('  his face on every row, drawn from his own sheet', rows.faces.every(n => n > 400), rows.faces.join(','));
  ok('  a worn weapon shows the pack\'s own tile, not a glyph', rows.tiles === rows.worn && rows.worn >= 1, rows.tiles + ' of ' + rows.worn);
  /* 2. thumb-sized and on the glass */
  const fit = await p.evaluate(() => { const ss = [].slice.call(document.querySelectorAll('#wear .wslot')).map(e => e.getBoundingClientRect());
    return { small: ss.filter(r => r.height < 44 || r.width < 44).length, over: Math.max.apply(null, ss.map(r => r.right)) <= window.innerWidth, w: Math.round(Math.min.apply(null, ss.map(r => r.width))), h: Math.round(Math.min.apply(null, ss.map(r => r.height))) }; });
  ok('every slot is thumb-sized (44 or more) and no row runs off the glass', fit.small === 0 && fit.over, 'smallest ' + fit.w + 'x' + fit.h);
  /* 3. the stash is the bag */
  const inBag = await p.evaluate(ids => ids.every(id => BohemiaRosterScreen.state.bag.some(i => i.id === id)), STASH.map(i => i.id));
  ok('the stash\'s three items are in the bag under the rows', inBag);
  /* 4. tap the second man's HEAD slot: the picker opens inside his row with ONLY what fits a head */
  const who = await p.evaluate(() => { const S = BohemiaRosterScreen.state; const i = S.crew.findIndex((m, k) => !m.dead && k !== S.sel); return { i, name: S.crew[i].name, oldHead: S.crew[i].gear.head && S.crew[i].gear.head.id }; });
  await p.click('#wear .wrow[data-man="' + who.i + '"] .wslot[data-wslot="head"]'); await p.waitForTimeout(300);
  const pk = await p.evaluate(i => { const r = document.querySelector('#wear .wrow[data-man="' + i + '"]'), pkr = r && r.querySelector('#picker');
    return { inRow: !!pkr, offered: pkr ? [].slice.call(pkr.querySelectorAll('.slot.full')).map(e => e.getAttribute('aria-label')) : [], off: !!(pkr && pkr.querySelector('.slot.off')),
      sel: BohemiaRosterScreen.state.sel, said: document.getElementById('said').textContent, lit: !!r.querySelector('.wslot.pick[data-wslot="head"]') }; }, who.i);
  ok('tap his HEAD slot and the bag opens inside his row, the slot lit, his card below', pk.inRow && pk.lit && pk.sel === who.i, who.name + ': ' + pk.said);
  ok('  it offers only what fits a head: the hard hat, never the rifle or the vest', pk.offered.length === 1 && /hard hat/.test(pk.offered[0]), pk.offered.join(' | '));
  ok('  and TAKE OFF, since he wears something there', pk.off === !!who.oldHead, 'wore ' + who.oldHead);
  /* 5. tap the hat: he wears it, what he wore goes back in the bag */
  await p.click('#wear .wrow[data-man="' + who.i + '"] #picker .slot.full'); await p.waitForTimeout(300);
  const h = await p.evaluate(i => { const S = BohemiaRosterScreen.state, m = S.crew[i]; return { head: m.gear.head && m.gear.head.id, bagHas: S.bag.some(x => x.id === 'kettle_hat'), bagOld: S.bag.map(x => x.id),
    rowText: document.querySelector('#wear .wrow[data-man="' + i + '"] .wslot[data-wslot="head"]').textContent, picker: !!document.getElementById('picker'),
    post: (window.__rosterLog || []).filter(x => x.act === 'equip' && x.who === m.idx && x.slot === 'head' && x.item && x.item.id === 'kettle_hat').length }; }, who.i);
  ok('tap the hat and he wears it: his row reads hat, the bag lost it, the picker closed', h.head === 'kettle_hat' && !h.bagHas && /hat/.test(h.rowText) && !h.picker, who.name + ' head -> ' + h.head);
  ok('  what he wore went back in the bag', !who.oldHead || h.bagOld.indexOf(who.oldHead) >= 0, 'bag: ' + h.bagOld.join(', '));
  ok('  and the game was told who put on what', h.post === 1);
  /* 6. swap his main hand for the rifle: the old gun is back in the bag, the bag's count unchanged */
  const bagN = await p.evaluate(() => BohemiaRosterScreen.state.bag.length);
  const oldMain = await p.evaluate(i => BohemiaRosterScreen.state.crew[i].gear.main && BohemiaRosterScreen.state.crew[i].gear.main.id, who.i);
  await p.click('#wear .wrow[data-man="' + who.i + '"] .wslot[data-wslot="main"]'); await p.waitForTimeout(250);
  const offered = await p.evaluate(() => [].slice.call(document.querySelectorAll('#picker .slot.full')).map(e => e.getAttribute('aria-label')));
  ok('tap his MAIN slot: the rifle is offered, the hat and the vest are not', offered.length === 1 && /rifle/.test(offered[0]), offered.join(' | '));
  await p.screenshot({ path: SHOT });
  await p.click('#picker .slot.full'); await p.waitForTimeout(300);
  const sw = await p.evaluate(a => { const S = BohemiaRosterScreen.state, m = S.crew[a.i]; return { main: m.gear.main && m.gear.main.id, bagN: S.bag.length, same: S.bag.length === a.n, ids: S.bag.map(x => x.id) }; }, { i: who.i, n: bagN });
  ok('tap the rifle and they swap: he holds the rifle, his old gun is in the bag, the bag\'s count unchanged', sw.main === 'light_crossbow' && (!oldMain || sw.ids.indexOf(oldMain) >= 0) && sw.same, oldMain + ' -> ' + sw.main + ', bag ' + sw.bagN);
  /* 7. TAKE OFF empties a slot into the bag */
  await p.click('#wear .wrow[data-man="' + who.i + '"] .wslot[data-wslot="head"]'); await p.waitForTimeout(250);
  await p.click('#picker .slot.off'); await p.waitForTimeout(300);
  const off = await p.evaluate(i => { const S = BohemiaRosterScreen.state; return { head: S.crew[i].gear.head, inBag: S.bag.some(x => x.id === 'kettle_hat'), row: document.querySelector('#wear .wrow[data-man="' + i + '"] .wslot[data-wslot="head"]').classList.contains('full') }; }, who.i);
  ok('TAKE OFF empties the slot into the bag and the row reads empty', !off.head && off.inBag && !off.row);
  /* 8. the company the fight reads carries what the rows show */
  const co = await p.evaluate(i => { const S = BohemiaRosterScreen.state, c = BohemiaRosterScreen.company().find(m => m.name === S.crew[i].name); return c && c.gear; }, who.i);
  ok('the company handed to the fight carries the rifle in his main hand and nothing on his head', co && co.main === 'light_crossbow' && co.head === null, JSON.stringify(co));
  ok('nothing threw on the company screen', errs.length === 0, errs.slice(0, 2).join(' | '));
  /* 9. the same rows through the one door from the settlement screen (the CREW button in its bar) */
  const s = await ctx.newPage(); const errs2 = []; s.on('pageerror', e => errs2.push(String(e.message)));
  await s.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await s.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await s.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], batteries: 300 })); await s.waitForTimeout(700);
  await s.click('#crew'); await s.waitForTimeout(400);
  const F = () => s.frames().find(f => /ROSTER_SCREEN/.test(f.url()));
  for (let i = 0; i < 60 && !(F() && await F().evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false)); i++) await s.waitForTimeout(250);
  const R = F(); await s.waitForTimeout(600);
  const door = R ? await R.evaluate(() => { const S = BohemiaRosterScreen.state; return { rows: document.querySelectorAll('#wear .wrow').length, live: S.crew.filter(m => !m.dead).length,
    rifle: document.querySelector('#wear .wslot[data-wslot="main"] img.pk[src*="w_rifle"]') ? 1 : 0, kept: S.crew.some(m => m.gear.main && m.gear.main.id === 'light_crossbow') }; }) : null;
  ok('CREW in the settlement\'s bar opens the same rows over the place, and the rifle he put on is still in his hand', door && door.rows === door.live && door.live >= 3 && door.kept && door.rifle === 1, door && (door.rows + ' rows, rifle tile ' + door.rifle));
  ok('nothing threw through the door', errs2.length === 0, errs2.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE CREW SCREEN READS THE STASH: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

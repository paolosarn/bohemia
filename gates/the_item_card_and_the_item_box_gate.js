/* THE ITEM CARD IS PICTURES, THE ITEM BOX IS A LIT WELL  (UI THREE, rows [the weapon card] and [the item box], 11/7/26;
   VAMILY rules 251(b)(c), 249(d)(e), 250, 224, 425(a); ask lines 146, 175, 178)

   PAOLO 10/26: 'there's so many numbers, we don't need this many numbers, it should just be an icon, a green arrow up, a red
   arrow down and a number... the way the weapon stats are displayed is dog shit, it's so ugly.' And: 'the interior of the
   boxes kinda looks like dog shit.'

   STATIC
   I1  THE PICTURES: the card's twelve (slices/stat_icons/: armour, vs_armour, through_armour, weight, two_hands, head, round,
       pip, pip_off, tile, tile_lit, tile_you) are the tool's byte for byte, and no big one is alike with the nine stat pictures
       or each other at 72, 54 or 18 px, and a stranger names each (UI's own look-alike measure; tools/bohemia_ui_three_item_icons.py --check)
   I2  *** EVERY ROW *** (weapons.json 145, armor.json's body, head and shields): the card's cells equal the numbers worked
       here from the files alone (a pistol's shot from ours.pistol_shot): damage low and high, vs armour, through armour, the
       main blow's AP and breath, the weight, to hit, the head; armour holds, its weight; a shield's two defences
       I3  EVERY BAR'S MOST POSSIBLE is the top of its own column in the rows (damage 120, vs armour 225, ...)
       I4  THE QUALITY of every piece is its rank in its own class and hands by value (the shop's qualityWord), the valley's
       own pieces their own; armour, helmets and shields by value in their kind
   ON THE GLASS, his phone (390 x 844, touch) and a computer (1440 x 900, mouse), with real taps:
   W   THE SHOP'S STRIP (the smith, a weapon tapped): W1 every cell a picture (a stat_icons picture, the pips, the slabs, the
       rounds) and no word on the glass (the words a screen reader's, in the cell's title on a held finger); W2 every bar's fill
       is its number over its most possible within a pixel (damage: its low-to-high stretch lit, within a pixel at both ends);
       W3 the pips are the main blow's AP, the slabs his own plus every tile he reaches, the lit ones his reach; W4 the six
       first cells (damage, vs armour, through armour, reach, action, breath) whole on the glass in one row; W5 NOTHING MOVES
       (rule 250): a second weapon tapped leaves the strip and every shelf box where they were, within a pixel
   A   THE ARMOURER: a body piece's ARMOUR bar filled to what it holds over the most any of its kind holds, within a pixel;
       its weight and initiative each a red arrow and the amount; a shield's two defences green arrows and the amount
   C   THE WEAPON'S CARD (UI 8's pawn ticket, a tap on the shelf): the big card under its title; the damage bar within a
       pixel; nine pips with the main blow's AP lit; every blow's row its pips (its AP), its breath and its slabs, its words
       kept for the reader; TWO HANDS its picture on a two-hander
   B   *** THE BOXES *** (the shop's shelf and bag, the crew screen's stash and gear, the end of a fight's loot): every box
       dressed; every full box's frame its piece's quality (I4's oracle; a shop tile named 'beat-up' is rust, 'solid' bone,
       'good' brass); a frame drawn (a border image), the pocket's walls gone (the black bracket) and the kit's own floor kept
       (rule 430: the Crashbox art stays and is improved); NO BOX CHANGED SIZE (every
       rectangle the same with the dress taken off, within a pixel); the lit box's outline inside its own rectangle
   R   RULE 433, NOTHING SHOWS UNTIL HE TAPS IT (Paolo 11/7, ask line 518): R1 walking into the smith, no upgrade mark, no face
       and no line about his men on the glass; R2 one tap: each man's arrow and amount, only that piece's own mark; R3 a tap on
       the keeper's words puts it away; R4 walking back in starts at rest
   M   --plant (the phone): a bar's most possible halved, a frame that grows the box, a quality turned round, a word put back
       on the strip, the comparison shown at rest, a pip short: each turns its leg red
   Z   nothing thrown
   node gates/the_item_card_and_the_item_box_gate.js [--plant] [--only phone|computer] [--plants-only] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname);
const T = require(path.join(ROOT, 'tools', 'bohemia_ui_company_screen_count.js'));
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const W = J('records/target/bb/weapons.json').rows, A = J('records/target/bb/armor.json'), OURS = J('records/target/bb/ours.json');
const PX = 1.01;
let pass = 0, fail = 0, QUIET = false;
const ok = (m, g, x) => { if (QUIET) return g; g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 420) + ']' : '')); return g; };
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1] : null; })();
const PLANT = process.argv.indexOf('--plant') > 0, ONLY_PLANTS = process.argv.indexOf('--plants-only') > 0;

/* ---------------- the oracle, from the files alone ---------------- */
const top = (rows, k) => rows.reduce((m, r) => Math.max(m, +r[k] || 0), 0);
const MAX = { damage: top(W, 'damage_max'), vs_armour: top(W, 'armor_damage_pct'), through_armour: top(W, 'armor_ignore_pct'),
  body: top(A.body, 'durability'), head: top(A.head, 'durability'), shield: top(A.shields, 'durability'), ap: 9 };
const by = {}; W.forEach(r => { by[r.id] = r; });
const P = OURS.pistol_shot.value;
const fightRow = id => { const w = by[id], r = w && w['class'] === P['class'] && P.by_row[w.id] ? by[P.by_row[w.id]] : null; return r ? Object.assign({}, r, { id: w.id, fatigue: w.fatigue }) : w; };
const hands = x => x.hands ? x.hands | 0 : (/^(bow|crossbow|firearm)$/.test(x['class']) ? 2 : 1);
const word = (rank, n) => { const q = rank / Math.max(1, n - 1); return q < 0.34 ? 'worn' : q < 0.67 ? 'solid' : 'good'; };
const QUAL = {};
W.forEach(r => { if (r.armory) { QUAL['weapon:' + r.id] = 'own'; return; }
  const same = W.filter(x => !x.armory && x['class'] === r['class'] && hands(x) === hands(r)).sort((a, b) => a.value - b.value); QUAL['weapon:' + r.id] = word(same.indexOf(r), same.length); });
[['body', 'body'], ['head', 'head'], ['shields', 'shield']].forEach(([k, kk]) => { const rows = A[k].slice().sort((a, b) => (a.value || 0) - (b.value || 0)); rows.forEach((r, i) => { QUAL[kk + ':' + r.id] = r.armory ? 'own' : word(i, rows.length); }); });
function want(kind, id) {   /* what every cell must say */
  if (kind === 'weapon') {
    const r = fightRow(id), m = (r.skills || []).filter(s => !/^Reload/.test(s.name))[0] || {}, o = {};
    if (r.damage_min != null && r.damage_max != null) o.damage = [r.damage_min, r.damage_max]; if (r.armor_damage_pct != null) o.vs_armour = r.armor_damage_pct; if (r.armor_ignore_pct) o.through_armour = r.armor_ignore_pct;
    if (m.ap != null) o.ap = m.ap; if (m.fatigue) o.breath = m.fatigue; if (typeof r.fatigue === 'number' && r.fatigue) o.weight = r.fatigue;
    if (m.hit_bonus) o.to_hit = m.hit_bonus; if (r.head_hit_chance) o.head = r.head_hit_chance; return o;
  }
  const row = (kind === 'shield' ? A.shields : A[kind]).find(r => r.id === id), f = typeof row.fatigue === 'number' ? row.fatigue : 0;
  if (kind === 'shield') { const o = { melee_defense: row.melee_defense, ranged_defense: row.ranged_defense, holds: row.durability, weight: f }; if (f) o.initiative = f; return o; }
  return { armour: row.durability, weight: f, initiative: f };
}

/* ---------------- the server, which can plant a defect ---------------- */
const HOST = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;background:#120e0a}</style></head><body>'
  + '<script>window.BOH_START={picks:function(){return window.__PICKS;}};window.__PICKS=null;</script><script src="engine/bohemia_crew_door.js"></script></body></html>';
const BLANK = '<!doctype html><html><head><meta charset="utf-8"></head><body><script src="slices/bohemia_ui_three_items.js"></script></body></html>';
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
function serve(plant) {
  const srv = http.createServer((rq, rs) => {
    const u = decodeURIComponent(rq.url.split('?')[0]);
    if (u === '/__host.html') { rs.setHeader('content-type', 'text/html'); return rs.end(HOST); }
    if (u === '/__blank.html') { rs.setHeader('content-type', 'text/html'); return rs.end(BLANK); }
    const f = path.join(ROOT, u.replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
    if (plant && plant[u]) { let t = fs.readFileSync(f, 'utf8'); plant[u].forEach(([a, b]) => { if (t.indexOf(a) < 0) console.log('  (plant did not find: ' + a.slice(0, 60) + ')'); t = t.split(a).join(b); }); return rs.end(t); }
    fs.createReadStream(f).pipe(rs);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}
const PROFS = { phone: { name: 'phone', ctx: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
  computer: { name: 'computer', ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false } } };

/* every cell under a selector, read off the glass */
const READ = sel => [...document.querySelectorAll(sel)].map(c => {
  const r = c.getBoundingClientRect(), bar = c.querySelector('i.bic-bar'), o = { k: c.dataset.cell, stat: c.dataset.stat || null, x: r.left, y: r.top, w: r.width, h: r.height, right: r.right, bottom: r.bottom, delta: c.dataset.delta != null ? +c.dataset.delta : null };
  const ic = c.querySelector('img.bic-ic'); o.icon = ic ? { ok: ic.complete && ic.naturalWidth > 0, src: ic.getAttribute('src') } : null;
  const shown = c.cloneNode(true); shown.querySelectorAll('.bic-sr').forEach(x => x.remove()); o.shown = shown.textContent.replace(/\s+/g, ' ').trim();
  o.sr = [...c.querySelectorAll('.bic-sr')].map(x => { const s = getComputedStyle(x); return x.getBoundingClientRect().width <= 1.5 || s.clip !== 'auto'; }).every(Boolean);
  if (bar) { const br = bar.getBoundingClientRect(), f = bar.querySelector('.bic-fill').getBoundingClientRect(), L = br.left + bar.clientLeft; o.bar = { inner: bar.clientWidth, l: f.left - L, fw: f.width, max: +bar.dataset.max, lo: +bar.dataset.lo, hi: +bar.dataset.hi }; }
  /* a row of pips, slabs or rounds is one picture of layers: its count and its lit ones are what it draws (one layer a picture) */
  const layers = e => (getComputedStyle(e).backgroundImage.match(/url\(/g) || []).length;
  const pips = c.querySelector('i.bic-pips'); if (pips) { o.pips = layers(pips); o.lit = (getComputedStyle(pips).backgroundImage.match(/pip\.png/g) || []).length; }
  const tiles = c.querySelector('i.bic-tiles'); if (tiles) { const bi = getComputedStyle(tiles).backgroundImage; o.tiles = layers(tiles); o.tlit = (bi.match(/tile_lit\.png/g) || []).length; o.you = /^url\([^)]*tile_you\.png/.test(bi); }
  const rds = c.querySelector('i.bic-rds'); if (rds) o.rounds = layers(rds);
  const arw = c.querySelector('i.bic-arw'); if (arw) o.arrow = arw.classList.contains('up') ? 'up' : 'dn';
  o.text = c.textContent.replace(/\s+/g, ' ').trim(); o.title = c.title;
  return o; });
function barBad(c, lo, hi, max) {
  if (!c.bar) return [c.k + ' no bar'];
  const b = c.bar, bad = [], wl = b.inner * lo / max, ww = b.inner * (hi - lo) / max;
  if (b.max !== max) bad.push(c.k + ' most ' + b.max + ' want ' + max);
  if (Math.abs(b.l - wl) > PX || Math.abs(b.fw - ww) > PX) bad.push(c.k + ' fill ' + b.l.toFixed(1) + '+' + b.fw.toFixed(1) + ' want ' + wl.toFixed(1) + '+' + ww.toFixed(1));
  return bad;
}
function cellsBad(cs, kind, id) {
  const w = want(kind, id), bad = [], got = {}; cs.forEach(c => { got[c.k] = c; });
  Object.keys(w).forEach(k => {
    const c = got[k]; if (!c) { bad.push(k + ' missing'); return; }
    if (k === 'damage') bad.push(...barBad(c, w.damage[0], w.damage[1], MAX.damage));
    else if (k === 'vs_armour' || k === 'through_armour') bad.push(...barBad(c, 0, w[k], MAX[k]));
    else if (k === 'armour') bad.push(...barBad(c, 0, w[k], MAX[kind]));
    else if (k === 'holds') bad.push(...barBad(c, 0, w[k], MAX.shield));
    else if (k === 'ap') { if (c.lit !== w.ap) bad.push('ap ' + c.lit + ' pips lit want ' + w.ap); }
    else if (k === 'breath') { if (c.shown !== String(w.breath)) bad.push('breath shows ' + c.shown + ' want ' + w.breath); }
    else { const d = w[k]; if (c.delta !== d || (d && c.arrow !== (d > 0 ? 'up' : 'dn'))) bad.push(k + ' ' + c.arrow + ' ' + c.delta + ' want ' + d); }
  });
  return bad;
}

/* ---------------- I2, I3, I4: every row, in a page that has only the module ---------------- */
async function everyRow(b, plant, legs) {
  const srv = await serve(plant), port = srv.address().port, ctx = await b.newContext(), p = await ctx.newPage();
  await p.goto('http://127.0.0.1:' + port + '/__blank.html'); await p.waitForFunction(() => window.BohemiaItemCard, null, { timeout: 20000 });
  const R = await p.evaluate(async (rows) => { await BohemiaItemCard.ready(); const out = [];
    rows.forEach(([kind, id]) => out.push({ kind, id, q: BohemiaItemCard.quality(kind, id), cells: BohemiaItemCard.cells({ kind, id }).map(c => ({ k: c.k, bar: c.bar, change: c.change, pips: c.pips, text: c.text })) }));
    return { out, max: Object.assign({}, BohemiaItemCard.MAX) }; },
  W.map(r => ['weapon', r.id]).concat(A.body.map(r => ['body', r.id]), A.head.map(r => ['head', r.id]), A.shields.map(r => ['shield', r.id])));
  const bad = [], qbad = [];
  R.out.forEach(x => { const w = want(x.kind, x.id), got = {}; x.cells.forEach(c => { got[c.k] = c; });
    Object.keys(w).forEach(k => { const c = got[k]; if (!c) { bad.push(x.id + ' ' + k + ' missing'); return; }
      const v = k === 'damage' ? (c.bar && [c.bar.lo, c.bar.hi].join('-')) : /^(vs_armour|through_armour|armour|holds)$/.test(k) ? c.bar && c.bar.v : k === 'ap' ? c.pips && c.pips.n : k === 'breath' ? +c.text : c.change;
      const wv = k === 'damage' ? w.damage.join('-') : w[k]; if (v !== wv) bad.push(x.id + ' ' + k + ' ' + v + ' want ' + wv); });
    if (x.q !== QUAL[x.kind + ':' + x.id]) qbad.push(x.kind + ':' + x.id + ' ' + x.q + ' want ' + QUAL[x.kind + ':' + x.id]); });
  const mbad = Object.keys(MAX).filter(k => R.max[k] !== MAX[k]).map(k => k + ' ' + R.max[k] + ' want ' + MAX[k]);
  legs.I2 = ok('I2 *** EVERY ROW *** (' + R.out.length + ' pieces, ' + R.out.reduce((a, x) => a + x.cells.length, 0) + ' cells): every number from the files alone', !bad.length, bad.slice(0, 4).join('; '));
  legs.I3 = ok('I3 every bar\'s most possible is the top of its own column (' + Object.keys(MAX).map(k => k + ' ' + MAX[k]).join(', ') + ')', !mbad.length, mbad.join('; '));
  const qs = {}; R.out.forEach(x => { qs[x.q] = (qs[x.q] || 0) + 1; });
  legs.I4 = ok('I4 every piece\'s quality its rank in its own class and hands by value, the valley\'s own their own (' + Object.keys(qs).map(k => k + ' ' + qs[k]).join(', ') + ')', !qbad.length, qbad.slice(0, 4).join('; '));
  await ctx.close(); srv.close();
}

/* ---------------- W, A, C, B in the shop ---------------- */
async function shop(b, prof, plant, legs) {
  const srv = await serve(plant), port = srv.address().port;
  const ctx = await b.newContext(prof.ctx), p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const CO = [{ name: 'YOU', main: true, look: 'you', level: 1, stats: { hp: 57, fatigue: 95, resolve: 36, initiative: 106, melee_skill: 64, ranged_skill: 50, melee_defense: 7, ranged_defense: 7 }, stars: {}, perks: [], gear: { main: null, off: null, body: null, head: null } },
    { name: 'RAUL', look: 'you', level: 2, stats: { hp: 60, fatigue: 100, resolve: 40, initiative: 105, melee_skill: 55, ranged_skill: 40, melee_defense: 3, ranged_defense: 2 }, stars: {}, perks: [], gear: { main: null, off: null, body: null, head: null } }];
  const tap = async s => { if (prof.ctx.hasTouch) await p.tap(s); else await p.click(s); };
  try {
    await p.addInitScript(co => { try { localStorage.setItem('bohemia.company.v1', JSON.stringify(co)); localStorage.removeItem('bohemia.uisize.v1'); } catch (e) {} }, CO);
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaRoster && window.BohemiaItemCard, null, { timeout: 30000 });
    /* as the demo has them: UI's kit, UI 9's fit and UI 8's card, planted the way the shell plants them */
    await p.addScriptTag({ url: 'bohemia_ui_no_scroll.js' }); await p.addScriptTag({ url: 'bohemia_ui_weapon_card.js' });
    await p.evaluate(() => Promise.all([BohemiaItemCard.ready(), window.BohemiaWeaponCard ? BohemiaWeaponCard.ready() : null]));
    const go = async bld => { await p.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click();
        BohemiaSettlement.open({ place: { name: 'BLUE DIAMOND', tier: 'town' }, traits: [], day: 1, batteries: 3000 }); }); await p.waitForTimeout(400);
      const hx = await p.evaluate(k => BohemiaSettlement.where(k), bld);
      if (hx) { if (prof.ctx.hasTouch) await p.touchscreen.tap(hx.x, hx.y); else await p.mouse.click(hx.x, hx.y); }
      await p.waitForTimeout(1300); };
    await go('smith');
    /* R rule 433: what shows about his men, read off the glass (a mark is shown when it is rendered, visible and has a size) */
    const REST = () => p.evaluate(() => { const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let x = e; x && x.nodeType === 1; x = x.parentElement) { const c = getComputedStyle(x); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) return false; } return true; };
      const tiles = [...document.querySelectorAll('#shelfgrid .slot')];
      return { marks: tiles.filter(t => vis(t.querySelector('.upm'))).map(t => t.dataset.id), ups: tiles.filter(t => t.classList.contains('up')).length, sel: tiles.filter(t => t.classList.contains('sel')).map(t => t.dataset.id),
        faces: [...document.querySelectorAll('#shopstrip .fstrip button')].filter(vis).map(b => ({ man: b.dataset.man, dv: (b.querySelector('.dv') || {}).textContent || null })),
        lines: [...document.querySelectorAll('#shopstrip .onman .ln')].filter(vis).length, crew: BohemiaSettlement.shopCrew().length }; });
    const q1 = await REST();
    legs.R1 = ok(prof.name + ' R1 RULE 433 AT REST: walking into the smith, nothing about his men shows (' + q1.marks.length + ' upgrade marks of ' + q1.ups + ' the shelf knows, ' + q1.faces.length + ' faces, ' + q1.lines + ' lines on the glass)',
      q1.marks.length === 0 && q1.faces.length === 0 && q1.lines === 0 && q1.sel.length === 0, JSON.stringify(q1));
    const stock = await p.evaluate(() => (BohemiaSettlement.state.stock.smith || []).map((i, n) => ({ n, id: i.id, kind: i.kind, name: i.name, hands: i.hands })));
    const wpn = stock.filter(i => i.kind === 'weapon');
    const pick = wpn.find(i => want('weapon', i.id).through_armour) || wpn[0], second = wpn.find(i => i !== pick);
    const boxRects = () => p.evaluate(() => [...document.querySelectorAll('#shelfgrid .slot, #baggrid .slot')].map(e => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(v => Math.round(v * 10) / 10); }));
    const stripRect = () => p.evaluate(() => { const e = document.getElementById('shopstrip'); const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(v => Math.round(v * 10) / 10); });
    await tap('#shelfgrid .slot[data-id="' + pick.id + '"]'); await p.waitForTimeout(700);
    const q2 = await REST(), upPick = await p.evaluate(id => { const t = document.querySelector('#shelfgrid .slot[data-id="' + id + '"]'); return !!t && t.classList.contains('up'); }, pick.id);
    legs.R2 = ok(prof.name + ' R2 RULE 433 ONE TAP: the piece tapped shows how it compares with each of his men (' + q2.faces.map(f => f.man + ' ' + f.dv).join(', ') + '), and only its own upgrade mark (' + q2.marks.join(',') + ')',
      q2.faces.length === q2.crew && q2.crew > 0 && q2.faces.every(f => f.dv) && q2.marks.length === (upPick ? 1 : 0) && (!upPick || q2.marks[0] === pick.id), JSON.stringify(q2));
    const S = await p.evaluate(rd => { const read = new Function('return (' + rd + ')')(); const inums = document.querySelector('#shopstrip .inums'), st = document.getElementById('shopstrip').getBoundingClientRect();
      return { strip: !!(inums && inums.classList.contains('bic-strip')), cells: read('#shopstrip .inums .bic'), box: inums ? (() => { const r = inums.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; })() : null, W: innerWidth, H: innerHeight,
        card: (() => { const c = document.getElementById('bwcard'); return c && c.style.display !== 'none' ? { id: c.dataset.weapon, dressed: c.dataset.dressed, cells: read('#bwcard .bic-card .bic'), two: !!c.querySelector('.bwc-t i.bic-two'),
          blows: [...c.querySelectorAll('.bwc-r')].map(r => ({ word: r.querySelector('b').firstChild.textContent.trim(), n: r.querySelector('.bwc-n').textContent, pips: (() => { const x = r.querySelector('i.bic-pips'); return x ? (getComputedStyle(x).backgroundImage.match(/pip\.png/g) || []).length : 0; })(), breath: (() => { const x = r.querySelector('.bic-breath'); if (!x) return null; const k = x.cloneNode(true); k.querySelectorAll('.bic-sr').forEach(y => y.remove()); return k.textContent.trim(); })(), tiles: (() => { const x = r.querySelector('i.bic-tiles'); return x ? (getComputedStyle(x).backgroundImage.match(/url\(/g) || []).length : 0; })() })) } : null; })() }; }, READ.toString());
    /* W1 pictures, no words on the glass */
    const w1 = [];
    if (!S.strip) w1.push('the strip is not the card\'s');
    S.cells.forEach(c => { if (!(c.icon && c.icon.ok && /stat_icons\//.test(c.icon.src)) && !c.pips && !c.tiles && !c.rounds) w1.push(c.k + ' has no picture');
      if (/[A-Za-z]{2}/.test(c.shown)) w1.push(c.k + ' shows words: ' + c.shown); if (!c.sr) w1.push(c.k + ' its words on the glass'); if (!c.title) w1.push(c.k + ' no word on a held finger'); });
    legs.W1 = ok(prof.name + ' W1 THE SHOP\'S STRIP: every cell a picture, no word on the glass (' + S.cells.map(c => c.k + (c.shown ? ' ' + c.shown : '')).join(' | ') + ')', S.cells.length >= 5 && !w1.length, w1.slice(0, 4).join('; '));
    const wb = cellsBad(S.cells, 'weapon', pick.id);
    legs.W2 = ok(prof.name + ' W2 every bar\'s fill its number over its most possible within a pixel, every arrow and amount the row\'s (' + pick.id + ')', !wb.length, wb.slice(0, 4).join('; '));
    const arm = await p.evaluate(id => { const a = BohemiaRoster.armOf({ kind: 'weapon', id }); return a && { lo: a.lo, hi: Math.min(a.hi, 7), rounds: a.rounds }; }, pick.id);
    const reach = S.cells.find(c => c.k === 'reach'), apc = S.cells.find(c => c.k === 'ap'), w3 = [];
    if (!reach || reach.tiles !== arm.hi + 1 || reach.tlit !== arm.hi - arm.lo + 1 || !reach.you) w3.push('reach ' + JSON.stringify(reach && { t: reach.tiles, lit: reach.tlit, you: reach.you }) + ' want ' + JSON.stringify(arm));
    if (!apc || apc.pips !== want('weapon', pick.id).ap) w3.push('pips ' + (apc && apc.pips));
    if (arm.rounds) { const rc = S.cells.find(c => c.k === 'rounds'); if (!rc || rc.rounds !== Math.min(6, arm.rounds)) w3.push('rounds ' + (rc && rc.rounds) + ' want ' + arm.rounds); }
    legs.W3 = ok(prof.name + ' W3 the pips the blow\'s AP, the slabs his own and every tile he reaches, the reach lit, the rounds', !w3.length, w3.join('; '));
    const first = ['damage', 'vs_armour', 'through_armour', 'reach', 'ap', 'breath'].map(k => S.cells.find(c => c.k === k)).filter(Boolean);
    const out = first.filter(c => c.x < S.box.l - 0.5 || c.right > S.box.r + 0.5 || c.y < S.box.t - 0.5 || c.bottom > S.box.b + 0.5 || c.right > S.W);
    const rowY = new Set(first.map(c => Math.round(c.y + c.h / 2)));
    legs.W4 = ok(prof.name + ' W4 the six first cells whole on the glass in one row (' + first.length + ' of 6, ' + rowY.size + ' row)', first.length === 6 && !out.length && rowY.size === 1, out.map(c => c.k).join(', '));
    /* C the weapon's card, the same tap */
    const C = S.card, cb = [];
    if (!C || C.id !== pick.id || C.dressed !== 'bic') cb.push('no dressed card (' + JSON.stringify(C && { id: C.id, d: C.dressed }) + ')');
    else {
      const cw = want('weapon', pick.id), d = C.cells.find(c => c.k === 'damage'), ap = C.cells.find(c => c.k === 'ap');
      if (!d) cb.push('no damage bar'); else cb.push(...barBad(d, cw.damage[0], cw.damage[1], MAX.damage));
      if (!ap || ap.pips !== 9 || ap.lit !== cw.ap) cb.push('pips ' + (ap && ap.pips + '/' + ap.lit) + ' want 9/' + cw.ap);
      /* every blow: its pips, its breath, its slabs, the words kept */
      C.blows.forEach(bw => { const m = bw.n.match(/(\d+) AP/), f = bw.n.match(/(\d+) BREATH/);
        if (!m) cb.push(bw.word + ' lost its words'); else if (bw.pips !== +m[1]) cb.push(bw.word + ' ' + bw.pips + ' pips want ' + m[1]);
        if (f && bw.breath !== f[1]) cb.push(bw.word + ' breath ' + bw.breath + ' want ' + f[1]);
        if (/TILE/.test(bw.n) && !bw.tiles) cb.push(bw.word + ' no slabs'); });
      if (hands(by[pick.id]) === 2 && !C.two) cb.push('a two-hander without its picture');
    }
    legs.C1 = ok(prof.name + ' C1 THE WEAPON\'S CARD: the big card, the damage bar within a pixel, nine pips with the AP lit, every blow\'s pips, breath and slabs, the words kept' + (C ? ' (' + C.blows.map(x => x.word).join(', ') + ')' : ''), !cb.length, cb.slice(0, 4).join('; '));
    /* W5 nothing moves */
    await p.evaluate(() => { const c = document.getElementById('bwcard'); if (c) c.style.display = 'none'; });
    const r0 = await boxRects(), s0 = await stripRect();
    if (second) { await tap('#shelfgrid .slot[data-id="' + second.id + '"]'); await p.waitForTimeout(600); }
    const r1 = await boxRects(), s1 = await stripRect();
    const moved = r0.map((r, i) => r1[i] && r.some((v, j) => Math.abs(v - r1[i][j]) > PX) ? i : -1).filter(i => i >= 0);
    legs.W5 = ok(prof.name + ' W5 NOTHING MOVES: a second weapon tapped (' + (second && second.id) + ') leaves the strip and all ' + r0.length + ' boxes where they were', !!second && r0.length === r1.length && !moved.length && s0.every((v, j) => Math.abs(v - s1[j]) <= PX), moved.length + ' moved; strip ' + s0 + ' -> ' + s1);
    /* R3 a tap that is not a piece puts it away; R4 walking back in starts at rest */
    const sayAt = await p.evaluate(() => { const e = document.querySelector('#sheet .say p') || document.querySelector('#sheet .gridh'); const r = e.getBoundingClientRect(); return { x: r.left + Math.min(20, r.width / 2), y: r.top + r.height / 2 }; });
    if (prof.ctx.hasTouch) await p.touchscreen.tap(sayAt.x, sayAt.y); else await p.mouse.click(sayAt.x, sayAt.y);
    await p.waitForTimeout(500);
    const q3 = await REST();
    legs.R3 = ok(prof.name + ' R3 RULE 433 A TAP ELSEWHERE (the keeper\'s words) PUTS IT AWAY: back to rest (' + q3.faces.length + ' faces, ' + q3.marks.length + ' marks, ' + q3.sel.length + ' lit)', q3.faces.length === 0 && q3.marks.length === 0 && q3.sel.length === 0, JSON.stringify(q3));
    await tap('#shelfgrid .slot[data-id="' + pick.id + '"]'); await p.waitForTimeout(500);
    await p.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await p.waitForTimeout(500);
    const hx2 = await p.evaluate(() => BohemiaSettlement.where('smith')); if (hx2) { if (prof.ctx.hasTouch) await p.touchscreen.tap(hx2.x, hx2.y); else await p.mouse.click(hx2.x, hx2.y); }
    await p.waitForTimeout(1200);
    const q4 = await REST();
    legs.R4 = ok(prof.name + ' R4 RULE 433 WALKING BACK IN: a piece lit before he left is not lit again by itself (' + q4.faces.length + ' faces, ' + q4.sel.length + ' lit)', q4.faces.length === 0 && q4.sel.length === 0 && q4.marks.length === 0, JSON.stringify(q4));
    /* B in the shop: the shelf's boxes */
    const B = await p.evaluate(() => [...document.querySelectorAll('#shelfgrid .slot')].map(e => ({ id: e.dataset.id, name: e.__it ? e.__it.name : null, kind: e.__it ? e.__it.kind : null, bib: e.classList.contains('bib'), bq: e.dataset.bq || null,
      img: getComputedStyle(e).borderImageSource, bg: getComputedStyle(e).backgroundImage, sel: e.classList.contains('sel'), out: getComputedStyle(e).outlineOffset, ow: getComputedStyle(e).outlineWidth })));
    const bb = [];
    B.forEach(x => { if (!x.bib) bb.push(x.id + ' not dressed'); if (!x.id) return;
      const q = QUAL[x.kind + ':' + x.id]; if (x.bq !== q) bb.push(x.id + ' frame ' + x.bq + ' want ' + q);
      const nw = /^(beat-up)/.test(x.name) ? 'worn' : /^solid/.test(x.name) ? 'solid' : /^good/.test(x.name) ? 'good' : null; if (nw && nw !== x.bq) bb.push(x.name + ' wears ' + x.bq);
      /* the frame drawn; the pocket's walls (the black bracket: the well's t, l, tl pieces) gone; the kit's own floor kept (rule 430) */
      if (!/^url\(/.test(x.img)) bb.push(x.id + ' no frame'); if (/ui_kit\/well(_full)?\/(tl|tr|bl|br|t|b|l|r)\.png/.test(x.bg)) bb.push(x.id + ' still the kit\'s pocket walls');
      if (!/ui_kit\/well_full\/c\.png/.test(x.bg)) bb.push(x.id + ' not on the kit\'s own floor');
      if (x.sel && !(parseFloat(x.out) <= -parseFloat(x.ow) + 0.01)) bb.push(x.id + ' lit outline outside its box (' + x.out + ')'); });
    /* the dress taken off: no box changed size */
    const on = await boxRects(); await p.evaluate(() => document.documentElement.classList.remove('bib-on')); await p.waitForTimeout(80); const off = await boxRects(); await p.evaluate(() => document.documentElement.classList.add('bib-on'));
    const grew = on.map((r, i) => off[i] && r.some((v, j) => Math.abs(v - off[i][j]) > PX) ? i : -1).filter(i => i >= 0);
    legs.B1 = ok(prof.name + ' B1 THE SHOP\'S BOXES: every box dressed, its frame its quality (' + B.map(x => x.bq).join(',') + '), the name and the frame agree, a frame and a floor, the lit outline inside', B.length > 3 && !bb.length, bb.slice(0, 4).join('; '));
    legs.B2 = ok(prof.name + ' B2 NO BOX CHANGED SIZE: every shelf and bag box the same with the dress taken off (' + on.length + ')', on.length > 3 && !grew.length, grew.length + ' grew: ' + JSON.stringify(on[grew[0]]) + ' vs ' + JSON.stringify(off[grew[0]]));
    /* A the armourer: a body piece and a shield */
    await go('armourer');
    const ast = await p.evaluate(() => (BohemiaSettlement.state.stock.armourer || []).map(i => ({ id: i.id, kind: i.kind })));
    const body = ast.find(i => i.kind === 'body' || i.kind === 'head'), sh = ast.find(i => i.kind === 'shield'), ab = [];
    for (const it of [body, sh].filter(Boolean)) { await tap('#shelfgrid .slot[data-id="' + it.id + '"]'); await p.waitForTimeout(600);
      const cs = await p.evaluate(rd => new Function('return (' + rd + ')')()('#shopstrip .inums .bic'), READ.toString());
      cellsBad(cs, it.kind, it.id).forEach(x => ab.push(it.id + ' ' + x)); }
    legs.A1 = ok(prof.name + ' A1 THE ARMOURER: ARMOUR a bar to the most its kind holds, its weight and initiative red arrows, a shield\'s defences green arrows, each the row\'s (' + [body, sh].filter(Boolean).map(i => i.id).join(', ') + ')', !!body && !!sh && !ab.length, ab.slice(0, 4).join('; '));
  } catch (e) { ok(prof.name + ' the shop ran', false, e && e.stack); }
  legs.errs = (legs.errs || []).concat(errs.filter(e => !/ResizeObserver/.test(e)));
  await ctx.close(); srv.close();
}

/* ---------------- B in the crew screen and the end of a fight ---------------- */
async function crewAndLoot(b, prof, plant, legs) {
  const srv = await serve(plant), port = srv.address().port;
  const ctx = await b.newContext(prof.ctx), p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const look = (fr, sel) => fr.evaluate(sel => [...document.querySelectorAll(sel)].map(e => { const ic = e.querySelector('[data-id]'), r = e.getBoundingClientRect();
    return { id: ic ? ic.getAttribute('data-id') : null, bib: e.classList.contains('bib'), bq: e.dataset.bq || null, img: getComputedStyle(e).borderImageSource, bg: getComputedStyle(e).backgroundImage, rect: [r.left, r.top, r.width, r.height].map(v => Math.round(v * 10) / 10) }; }), sel);
  const kindOf = id => by[id] ? 'weapon' : A.body.some(r => r.id === id) ? 'body' : A.head.some(r => r.id === id) ? 'head' : A.shields.some(r => r.id === id) ? 'shield' : null;
  const judge = (rows, where) => { const bad = []; rows.forEach(x => { if (!x.bib) bad.push(where + ' a box not dressed'); if (x.id) { const q = QUAL[kindOf(x.id) + ':' + x.id]; if (q && x.bq !== q) bad.push(where + ' ' + x.id + ' ' + x.bq + ' want ' + q); }
    if (!/^url\(/.test(x.img)) bad.push(where + ' no frame'); }); return bad; };
  try {
    const fr = await T.openCrew(p, port);
    await fr.waitForFunction(() => window.BohemiaItemCard && document.querySelectorAll('#bag .slot.bib').length > 0, null, { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(500);
    const bag = await look(fr, '#bag .slot'), gear = await look(fr, '.gslot');
    await fr.evaluate(() => document.documentElement.classList.remove('bib-on')); await p.waitForTimeout(80);
    const bag0 = await look(fr, '#bag .slot'), gear0 = await look(fr, '.gslot');
    await fr.evaluate(() => document.documentElement.classList.add('bib-on'));
    const cb = judge(bag, 'stash').concat(judge(gear, 'gear'));
    const grew = bag.concat(gear).map((x, i) => { const y = bag0.concat(gear0)[i]; return y && x.rect.some((v, j) => Math.abs(v - y.rect[j]) > PX) ? i : -1; }).filter(i => i >= 0);
    const full = bag.filter(x => x.id).length;
    legs.B3 = ok(prof.name + ' B3 THE CREW SCREEN: the stash (' + bag.length + ', ' + full + ' full) and his gear (' + gear.length + ') dressed, every frame its piece\'s quality, none changed size', bag.length > 0 && full >= 5 && !cb.length && !grew.length, cb.concat(grew.length ? [grew.length + ' grew'] : []).slice(0, 4).join('; '));
    /* the end of a fight, its sample spoils */
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SPOILS_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaItemCard && document.querySelectorAll('.slot.bib[data-bq]').length > 0, null, { timeout: 20000 }).catch(() => {});
    const loot = await look(p.mainFrame(), '.slot');
    await p.evaluate(() => document.documentElement.classList.remove('bib-on')); await p.waitForTimeout(80);
    const loot0 = await look(p.mainFrame(), '.slot'); await p.evaluate(() => document.documentElement.classList.add('bib-on'));
    const lb = judge(loot, 'loot'), lg = loot.map((x, i) => loot0[i] && x.rect.some((v, j) => Math.abs(v - loot0[i].rect[j]) > PX) ? i : -1).filter(i => i >= 0);
    legs.B4 = ok(prof.name + ' B4 THE END OF A FIGHT: the loot and his stash (' + loot.length + ', ' + loot.filter(x => x.bq).length + ' full) dressed, every frame its piece\'s quality, none changed size', loot.length > 0 && loot.some(x => x.bq) && !lb.length && !lg.length, lb.concat(lg.length ? [lg.length + ' grew'] : []).slice(0, 4).join('; '));
  } catch (e) { ok(prof.name + ' the crew screen and the loot ran', false, e && e.stack); }
  legs.errs = (legs.errs || []).concat(errs.filter(e => !/ResizeObserver/.test(e)));
  await ctx.close(); srv.close();
}

const PLANTS = [
  { name: 'a bar\'s most possible halved', want: ['W2'], plant: { '/slices/bohemia_ui_three_items.js': [["b.dataset.max = B.max;", "b.dataset.max = B.max; B = Object.assign({}, B, { max: B.max / 2 });"]] } },
  /* a frame laid as a real border inside a fixed box only shrinks the inside (the boxes are border-box at UI 9's 44): the defect
     that grows a box is a frame given its own room */
  { name: 'a frame that grows the box', want: ['B2'], plant: { '/slices/bohemia_ui_three_items.js': [["border-image-outset:0!important;", "border-image-outset:0!important;min-height:58px!important;min-width:58px!important;"]] } },
  { name: 'a quality turned round', want: ['B1'], plant: { '/slices/bohemia_ui_three_items.js': [["return q < 0.34 ? 'worn' : q < 0.67 ? 'solid' : 'good';", "return q < 0.34 ? 'good' : q < 0.67 ? 'solid' : 'worn';"]] } },
  { name: 'a word put back on the strip', want: ['W1'], plant: { '/slices/bohemia_ui_three_items.js': [["s.appendChild(el('i', 'bic-sr', word + ' '));", "s.appendChild(el('i', 'bic-word', word + ' '));"]] } },
  { name: 'the comparison shown at rest (rule 433)', want: ['R1'], plant: { '/slices/BOHEMIA_SETTLEMENT_SCREEN.html': [["#sheet .slot .upm{visibility:hidden}#sheet .slot.sel .upm{visibility:visible}", ""], ["'#shopstrip .onman.ss-empty{visibility:hidden}'", "''"]] } },
  { name: 'a pip short', want: ['W3', 'C1'], plant: { '/slices/bohemia_ui_three_items.js': [["var lit = Math.max(0, Math.min(c.pips.of, c.pips.n | 0))", "var lit = Math.max(0, Math.min(c.pips.of, (c.pips.n | 0) - 1))"]] } }
];

(async () => {
  /* I1 the pictures */
  let i1 = '', g1 = false;
  try { i1 = cp.execFileSync('python3', [path.join(ROOT, 'tools/bohemia_ui_three_item_icons.py'), '--check'], { encoding: 'utf8' }); g1 = true; } catch (e) { i1 = String(e.stdout || e.message); }
  ok('I1 THE PICTURES: the card\'s twelve the tool\'s, none alike with the nine or each other, each named at a glance', g1, i1.trim().split('\n').map(s => s.trim().replace(/^ok\s+/, '')).join(' | '));
  const b = await chromium.launch();
  const legs = {};
  if (!ONLY_PLANTS) await everyRow(b, null, legs);
  for (const k of Object.keys(PROFS).filter(k => !ONLY_PLANTS && (!ONLY || k === ONLY))) {
    console.log('-- ' + k);
    const L = {}; await shop(b, PROFS[k], null, L); await crewAndLoot(b, PROFS[k], null, L);
    ok(k + ' Z nothing thrown', !L.errs.length, L.errs.slice(0, 2).join(' | ') || 'none');
  }
  if (PLANT || ONLY_PLANTS) {
    console.log('-- the plants (the phone)');
    for (const pl of PLANTS) {
      const L = {}; QUIET = true; await shop(b, PROFS.phone, pl.plant, L); QUIET = false;
      const red = pl.want.filter(w => L[w] === false);
      ok('M ' + pl.name + ' turns ' + pl.want.join(' and ') + ' red', red.length === pl.want.length, 'red: ' + red.join(',') + ' of ' + pl.want.join(','));
    }
  }
  await b.close();
  console.log('THE ITEM CARD AND THE ITEM BOX: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

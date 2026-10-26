/* STATS ARE BARS AND ARROWS, IN HIS ORDER (UI THREE, rows [the stat order] and [stats are bars and arrows], 10/26/26;
   VAMILY rules 223(e) and 247(e)).
   PAOLO 10/26: 'the order I want to display the stats: HP, fatigue, ranged attack, melee attack, ranged defence, melee
   defence, morale and initiative, across the board, because I'm trying to scan the stars quickly... behind the numbers, like
   a progress bar, how far it is from the maximum that's even possible... remember, I asked that.' And: 'an up green icon or a
   down red icon plus the number... I don't even want to see it would go from 63 to 68.'

   STATIC
   S1  THE ONE LIST: engine/bohemia_stats.js ORDER is his eight in his order; the dice's own order (bohemia_roster.js and
       bohemia_origin_start.js STATS) is untouched, so no saved man re-rolls.
   S2  THE MOST POSSIBLE is one number a stat, TUNING's (the one table's section Q: HP 133 ... INITIATIVE 195), the formula's
       (engine compute() over backgrounds.json, traits.json and rules.json), the file's and the engine fallback's, all equal.
   S4  TUNING's six worked ticks (bar.tick.own_ceiling) come out of the engine and the gate's oracle alike.
   S3  EVERY SCREEN THAT SHOWS THE EIGHT READS THE ONE LIST: the crew screen and the settlement screen load the engine file and
       lay their rows from BohemiaStats.ORDER.
   ON THE GLASS, his phone (390 x 844, touch) and a computer (1440 x 900, mouse), with real taps:
   C   THE CREW SCREEN (opened the way the game opens it, engine/bohemia_crew_door.js, the stranger's six):
       C1 his order; C2 the stars in ONE column (every star cell at the same x, within a pixel), each stat his own stars;
       C3 every bar's fill is his number (with what he wears, bohemia_roster.js worn()) over the most possible, within a
       pixel, translucent; C4 the faint tick at his own ceiling (his number plus every level left to 11 at the middle of his
       star column, TUNING's bar.tick.own_ceiling), within a pixel; C5 THE LEVEL-UP: the eight picks in his order, each the rolled amount as a green arrow, a pick
       lights its rise on the bar within a pixel; C6 THE PIECE COMPARED (one tap on the phone, the mouse over it on a computer):
       every stat it moves is an arrow and the amount worn() says, its part of the bar lit within a pixel; no 'X to Y' in any
       stat row; C7 NOTHING MOVES (rule 250): every bar keeps its place and size when the comparison shows.
   H   THE HALL (the settlement screen, a tap on the hall): every card's eight in his order, one star column, the fill and the
       tick within a pixel (his trait on the number, his level and stars on the tick), a stat his trait moved an arrow and the
       amount.
   P   THE SHOP'S 'ON A MAN' (a tap on a shield at the armourer): the eight's lines in his order, each the arrow and the amount
       wearing() says, the fill at the new number within a pixel and the moved part lit; no 'X to Y' anywhere on the card.
   E   nothing thrown.
   --plant (the phone): the order swapped, the fill off the maximum, the tick at the top roll, the change column let grow, the 'X to Y' words put back
       in the shop: each must turn a leg red.
   Run: node gates/stats_are_bars_in_his_order_gate.js [--plant] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const T = require(path.join(ROOT, 'tools', 'bohemia_ui_company_screen_count.js'));
const ORDER = ['hp', 'fatigue', 'ranged_skill', 'melee_skill', 'ranged_defense', 'melee_defense', 'resolve', 'initiative'];
const BB_ORDER = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const FILE = J('records/target/bb/stat_max.json');
const PX = 1.01;   /* within a pixel */
const XTOY = /\b\d+\s*(?:to|TO|→|->)\s*\d+\b/;
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 400) + ']' : '')); return g; };

/* the oracle, worked here from the game's own files (never the component's own numbers) */
function maxOf(k) { return FILE.max[k]; }
function share(k, n) { return Math.max(0, Math.min(1, n / maxOf(k))); }

const HOST = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<style>html,body{margin:0;height:100%;background:#120e0a}</style></head><body>'
  + '<script>window.BOH_START={picks:function(){return window.__PICKS;}};window.__PICKS=null;</script>'
  + '<script src="engine/bohemia_crew_door.js"></script></body></html>';
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
/* a server that can plant a defect: {'/engine/bohemia_stats.js': [[from, to]], ...} */
function serve(plant) {
  const srv = http.createServer((rq, rs) => {
    const u = decodeURIComponent(rq.url.split('?')[0]);
    if (u === '/__host.html') { rs.setHeader('content-type', 'text/html'); return rs.end(HOST); }
    const f = path.join(ROOT, u.replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
    if (plant && plant[u]) { let t = fs.readFileSync(f, 'utf8'); plant[u].forEach(([a, b]) => { t = t.split(a).join(b); }); return rs.end(t); }
    fs.createReadStream(f).pipe(rs);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

/* every stat row under a selector, read off the glass */
const READ = sel => [...document.querySelectorAll(sel)].map(r => {
  const bar = r.querySelector('.bst-bar'); if (!bar) return { k: r.dataset.stat, bar: false, text: r.textContent };
  const fill = bar.querySelector('.bst-fill'), tick = bar.querySelector('.bst-tick'), lit = bar.querySelector('.bst-lit'), st = r.querySelector('.bst-st'), ch = r.querySelector('b.bst-chg');
  const br = bar.getBoundingClientRect(), left = br.left + bar.clientLeft, num = bar.querySelector('.bst-n');
  const bg = fill ? getComputedStyle(fill).backgroundColor : '', a = (bg.match(/rgba\([^)]*,\s*([\d.]+)\)/) || [])[1];
  const arw = ch && ch.querySelector('.bst-arw');
  return { k: r.dataset.stat, bar: true, n: num ? +num.textContent : NaN, max: +bar.dataset.max, inner: bar.clientWidth,
    fillW: fill ? fill.getBoundingClientRect().width : -1, alpha: a != null ? +a : 1,
    tickX: tick ? tick.getBoundingClientRect().left - left : null, litW: lit ? lit.getBoundingClientRect().width : 0, litUp: lit ? /\bup\b/.test(lit.className) : null,
    starsX: st ? Math.round(st.getBoundingClientRect().left * 10) / 10 : null, stars: st ? st.querySelectorAll('.bmstar').length : -1,
    chg: ch ? ch.textContent.trim() : null, chgUp: ch ? /\bup\b/.test(ch.className) : null, chgDn: ch ? /\bdn\b/.test(ch.className) : null,
    arrow: !!(arw && /url\(/.test(getComputedStyle(arw).backgroundImage)), text: r.textContent };
});

/* fill, lit and tick against the oracle: n the number now, from the number before (a change), c the ceiling */
function barOk(r, n, from, c) {
  const bad = [];
  if (r.n !== n) bad.push(r.k + ' shows ' + r.n + ' not ' + n);
  if (r.max !== maxOf(r.k)) bad.push(r.k + ' max ' + r.max);
  const fN = r.inner * share(r.k, n);
  if (from == null || from === n) { if (Math.abs(r.fillW - fN) > PX) bad.push(r.k + ' fill ' + r.fillW.toFixed(1) + ' want ' + fN.toFixed(1)); }
  else {
    const fF = r.inner * share(r.k, from), lo = Math.min(fN, fF);
    if (Math.abs(r.fillW - lo) > PX || Math.abs(r.litW - Math.abs(fN - fF)) > PX || r.litUp !== (n > from)) bad.push(r.k + ' fill ' + r.fillW.toFixed(1) + '+' + r.litW.toFixed(1) + ' want ' + lo.toFixed(1) + '+' + Math.abs(fN - fF).toFixed(1));
  }
  if (!(r.alpha < 1)) bad.push(r.k + ' fill not translucent');
  if (c != null) { const tX = r.inner * share(r.k, c); if (r.tickX == null || Math.abs(r.tickX - tX) > PX) bad.push(r.k + ' tick ' + (r.tickX == null ? 'none' : r.tickX.toFixed(1)) + ' want ' + tX.toFixed(1) + ' (ceiling ' + c + ')'); }
  return bad;
}
/* TUNING's bar.tick.own_ceiling: his number + the levels left to 11 x the middle of his star column, worked from rules.json here */
const RULES = J('records/target/bb/rules.json').experience.stat_gains_by_stars.value, RK = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill', ranged_skill: 'Ranged Skill', melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
const mid = (k, st) => { const m = String(RULES[RK[k]][Math.max(0, Math.min(3, st | 0))]).split('-').map(Number); return (m[0] + m[m.length - 1]) / 2; };
function ceilK(k, n, level, stars) { return n + Math.max(0, 11 - Math.max(1, level || 1)) * mid(k, stars); }
const orderOf = rows => rows.map(r => r.k).join(',');
const oneColumn = rows => { const xs = rows.map(r => r.starsX).filter(x => x != null); return xs.length === rows.length && Math.max.apply(null, xs) - Math.min.apply(null, xs) <= 1; };

async function crew(b, prof, plant, legs) {
  const srv = await serve(plant), port = srv.address().port;
  const ctx = await b.newContext(prof.ctx), page = await ctx.newPage(), errs = [];
  page.on('pageerror', e => errs.push(e.message));
  const R = {};
  try {
    const fr = await T.openCrew(page, port);
    const man = n => fr.evaluate(n => { const S = BohemiaRosterScreen.state, i = S.crew.findIndex(m => m.name === n); return '.cell[data-man="' + i + '"]'; }, n);
    const truth = () => fr.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel], W = BohemiaRoster.worn(m), o = {};
      Object.keys(m.stats).forEach(k => { o[k] = typeof W[k] === 'number' ? W[k] : m.stats[k]; }); return { name: m.name, level: m.level, stars: m.stars || {}, shown: o, stats: Object.assign({}, m.stats), rolls: m.rolls }; });
    /* C1 to C4 on YOU (the screen opens on him) and on a second man */
    const bad = [], ord = [], col = [], st = [], xt = [];
    for (const who of ['YOU', 'RAUL']) {
      await fr.click(await man(who)); await page.waitForTimeout(400);
      const t = await truth(), rows = await fr.evaluate(READ, '#card .stats [data-stat]');
      ord.push(who + ':' + orderOf(rows)); if (orderOf(rows) !== ORDER.join(',')) bad.push('order');
      if (!oneColumn(rows)) col.push(who + ' stars x ' + rows.map(r => r.starsX).join('/'));
      rows.forEach(r => { if (r.stars !== (t.stars[r.k] | 0)) st.push(who + ' ' + r.k + ' ' + r.stars + ' stars, his ' + (t.stars[r.k] | 0));
        if (XTOY.test(r.text)) xt.push(r.text);
        barOk(r, t.shown[r.k], null, ceilK(r.k, t.shown[r.k], t.level, t.stars[r.k])).forEach(x => bad.push(who + ' ' + x)); });
    }
    legs.C1 = ok(prof.name + ' C1 the crew screen: his eight in HIS order, from the one list', ord.every(o => o.endsWith(ORDER.join(','))), ord.join(' | '));
    legs.C2 = ok(prof.name + ' C2 the stars in ONE column, each stat his own stars', !col.length && !st.length, col.concat(st).join('; '));
    const fills = bad.filter(x => / fill| shows| max| translucent/.test(x)), ticks = bad.filter(x => / tick/.test(x));
    legs.C3 = ok(prof.name + ' C3 every bar filled to his number (with what he wears) over the most possible, within a pixel, translucent', !fills.length, fills.slice(0, 4).join('; '));
    legs.C4 = ok(prof.name + ' C4 the faint tick at his own ceiling, within a pixel', !ticks.length, ticks.slice(0, 4).join('; '));
    /* C5 the level-up on BOOKIE */
    await fr.click(await man(T.THIRD)); await page.waitForTimeout(500);
    const tb = await truth(), g = tb.rolls && tb.rolls[0] && tb.rolls[0].gains;
    let picks = await fr.evaluate(READ, '#levelup [data-raise]');
    const b5 = [];
    if (orderOf(picks) !== ORDER.join(',')) b5.push('order ' + orderOf(picks));
    if (!oneColumn(picks)) b5.push('stars not one column');
    picks.forEach(r => { if (!g || r.chg !== '+' + g[r.k] || !r.chgUp || !r.arrow) b5.push(r.k + ' shows ' + r.chg + ' want +' + (g && g[r.k]));
      barOk(r, tb.stats[r.k], null, ceilK(r.k, tb.stats[r.k], tb.level, tb.stars[r.k])).forEach(x => b5.push('before pick ' + x)); });
    const pk = ['hp', 'ranged_skill', 'melee_defense'];
    for (const k of pk) { await fr.click('#levelup [data-raise="' + k + '"]'); await page.waitForTimeout(150); }
    picks = await fr.evaluate(READ, '#levelup [data-raise]');
    picks.filter(r => pk.indexOf(r.k) >= 0).forEach(r => barOk(r, tb.stats[r.k] + g[r.k], tb.stats[r.k], null).forEach(x => b5.push('picked ' + x)));
    legs.C5 = ok(prof.name + ' C5 THE LEVEL-UP: the eight in his order, each roll a green arrow and its amount, a pick lights its rise within a pixel', !b5.length, b5.slice(0, 5).join('; '));
    /* C6 the piece compared, on RAUL (no level waiting): the best armour in the stash */
    await fr.click(await man('RAUL')); await page.waitForTimeout(400);
    const sel = await fr.evaluate(id => { const S = BohemiaRosterScreen.state, i = S.bag.findIndex(x => x.id === id); return '#bag .slot[data-bag="' + i + '"]'; }, T.BEST_ARMOUR);
    const boxes = () => fr.evaluate(() => [...document.querySelectorAll('#card .stats [data-stat] .bst-bar')].map(b => { const r = b.getBoundingClientRect(); return [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.width * 10) / 10]; }));
    const still0 = await boxes();
    if (prof.name === 'computer') await fr.hover(sel); else await fr.click(sel);
    await page.waitForTimeout(350);
    const still1 = await boxes();
    legs.C7 = ok(prof.name + ' C7 NOTHING MOVES (rule 250): every bar keeps its place and size when the comparison shows', still0.length === 8 && JSON.stringify(still0) === JSON.stringify(still1), JSON.stringify(still0[0]) + ' -> ' + JSON.stringify(still1[0]));
    const w = await fr.evaluate(id => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel], it = S.bag.find(x => x.id === id), w = BohemiaRoster.wearing(m, it); return { before: w.before, after: w.after, stops: !!w.stops }; }, T.BEST_ARMOUR);
    const t6 = await truth(), r6 = await fr.evaluate(READ, '#card .stats [data-stat]'), b6 = [];
    let moved = 0;
    r6.forEach(r => { const a = w.after[r.k], bf = w.before[r.k];
      if (typeof a === 'number' && a !== bf) { moved++; const d = a - bf;
        if (r.chg !== (d > 0 ? '+' : '') + d || (d > 0 ? !r.chgUp : !r.chgDn) || !r.arrow) b6.push(r.k + ' says ' + r.chg + ' want ' + d);
        barOk(r, a, bf, null).forEach(x => b6.push(x)); }
      else if (r.chg) b6.push(r.k + ' shows a change ' + r.chg + ' it does not make');
      if (XTOY.test(r.text)) b6.push('X to Y: ' + r.text); });
    const said = await fr.evaluate(() => document.getElementById('said') ? document.getElementById('said').innerText : '');
    legs.C6 = ok(prof.name + ' C6 THE PIECE COMPARED (' + (prof.name === 'computer' ? 'the mouse over it' : 'one tap') + '): every stat it moves an arrow and the amount, its part of the bar lit, never X to Y', moved > 0 && !b6.length && !XTOY.test(said), (moved + ' moved; ') + b6.slice(0, 4).join('; '));
  } catch (e) { ok(prof.name + ' the crew screen ran', false, e && e.message); }
  legs.errsC = errs.filter(e => !/ResizeObserver/.test(e));
  await ctx.close(); srv.close();
}

async function town(b, prof, plant, legs) {
  const srv = await serve(plant), port = srv.address().port;
  const ctx = await b.newContext(prof.ctx), p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const CO = [{ name: 'YOU', main: true, look: 'you', level: 1, stats: { hp: 57, fatigue: 95, resolve: 36, initiative: 106, melee_skill: 64, ranged_skill: 50, melee_defense: 7, ranged_defense: 7 }, stars: { resolve: 1, initiative: 2, ranged_defense: 1 }, perks: [], gear: { main: null, off: null, body: null, head: null } },
    { name: 'RAUL', look: 'you', level: 2, stats: { hp: 60, fatigue: 100, resolve: 40, initiative: 105, melee_skill: 55, ranged_skill: 40, melee_defense: 3, ranged_defense: 2 }, stars: { hp: 3, melee_defense: 2, fatigue: 1 }, perks: [], gear: { main: null, off: null, body: null, head: null } }];
  try {
    await p.addInitScript(co => { try { localStorage.setItem('bohemia.company.v1', JSON.stringify(co)); } catch (e) {} }, CO);
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaRoster, null, { timeout: 30000 });
    const go = async bld => { await p.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click();
        BohemiaSettlement.open({ place: { name: 'BLUE DIAMOND', tier: 'town' }, traits: [], day: 1, batteries: 3000 }); }); await p.waitForTimeout(400);
      const hx = await p.evaluate(k => BohemiaSettlement.where(k), bld);
      if (hx) { if (prof.ctx.hasTouch) await p.touchscreen.tap(hx.x, hx.y); else await p.mouse.click(hx.x, hx.y); }
      await p.waitForTimeout(1200); };
    /* H the hall */
    await go('hall');
    await p.waitForFunction(() => document.querySelectorAll('#sheet.on .hire .hstats .bst-row').length >= 8, null, { timeout: 20000 }).catch(() => {});
    const H = await p.evaluate(rd => { const read = new Function('return (' + rd + ')')(), S = BohemiaSettlement, R = S.recruits();
      return [...document.querySelectorAll('#sheet.on .hire')].slice(0, 4).map(h => { const r = R.find(x => x.id === h.dataset.id) || {}, tr = S.traitOf(r), tal = S.talentsOf(r) || [];
        const st = Object.assign({}, r.stats), mv = {}; (tr && tr.effects || []).forEach(e => { if (e.flat_eight && st[e.stat] != null) { st[e.stat] += e.n; mv[e.stat] = (mv[e.stat] || 0) + e.n; } });
        const stars = {}; tal.forEach(x => { if (x && x.k) stars[x.k] = x.n; });
        const id = 'h' + Math.random().toString(36).slice(2); h.querySelector('.hstats').id = id;
        const em = h.querySelector('.htrait em'), marks = em ? [...em.querySelectorAll('i.bst-mark')].map(x => { const ic = x.querySelector('i.bst-ic'), ch = x.querySelector('b.bst-chg'), a = ch && ch.querySelector('.bst-arw');
          return { k: x.dataset.stat, icon: !!(ic && /stat_icons\/[a-z_]+\.png/.test(ic.style.backgroundImage) && ic.style.backgroundImage.indexOf(x.dataset.stat + '.png') >= 0), chg: ch ? ch.textContent.trim() : null, arrow: !!(a && /url\(/.test(getComputedStyle(a).backgroundImage)) }; }) : [];
        return { name: r.name, level: r.level || 1, st, mv, stars, rows: read('#' + id + ' [data-stat]'), spans: h.querySelectorAll('.hstats span').length, text: h.querySelector('.hstats').textContent,
          trait: tr ? (tr.effects || []).filter(e => e.flat_eight).map(e => ({ k: e.stat, n: e.n })) : [], marks, line: em ? em.textContent : null, lineShown: em ? (() => { const k = em.cloneNode(true); k.querySelectorAll('.bst-sr').forEach(x => x.remove()); return k.textContent; })() : null }; }); }, READ.toString());
    const hb = [], ho = [];
    H.forEach(c => { if (orderOf(c.rows) !== ORDER.join(',')) ho.push(c.name + ' ' + orderOf(c.rows)); if (!oneColumn(c.rows)) ho.push(c.name + ' stars not one column'); if (c.spans !== 8) ho.push(c.name + ' ' + c.spans + ' spans');
      c.rows.forEach(r => { if (r.stars !== (c.stars[r.k] | 0)) hb.push(c.name + ' ' + r.k + ' stars ' + r.stars);
        const n = c.st[r.k], m = c.mv[r.k] || 0;
        barOk(r, n, m ? n - m : null, ceilK(r.k, n, c.level, c.stars[r.k])).forEach(x => hb.push(c.name + ' ' + x));
        if (r.chg) hb.push(c.name + ' ' + r.k + ' an amount on the bar (' + r.chg + '): the trait line says it once'); });
      /* the trait's numbers: each the stat's icon, the arrow and the amount, never the stat's word on the glass */
      c.trait.forEach((t, i) => { const mk = c.marks[i];
        if (!mk || mk.k !== t.k || !mk.icon || !mk.arrow || mk.chg !== (t.n > 0 ? '+' : '') + t.n) hb.push(c.name + ' trait ' + t.k + ' ' + t.n + ' shows ' + JSON.stringify(mk || null)); });
      if (c.trait.length && /[A-Z]{3}/.test(c.lineShown || '')) hb.push(c.name + ' trait line shows words: ' + c.lineShown);
      if (XTOY.test(c.text)) hb.push('X to Y: ' + c.text); });
    legs.H1 = ok(prof.name + ' H1 THE HALL: every card\'s eight in his order, stars in one column (' + H.length + ' cards)', H.length > 0 && !ho.length, ho.slice(0, 3).join('; '));
    legs.H2 = ok(prof.name + ' H2 THE HALL: fill and tick within a pixel, his trait\'s part lit on the bar and said once on its line as the icon, the arrow and the amount, no X to Y', H.length > 0 && !hb.length, hb.slice(0, 4).join('; '));
    /* P the shop */
    await go('armourer');
    const n = await p.evaluate(() => (BohemiaSettlement.state.stock.armourer || []).findIndex(i => i.kind === 'shield'));
    if (n >= 0) { const s = '#shelfgrid .slot:nth-child(' + (n + 1) + ')'; if (prof.ctx.hasTouch) await p.tap(s); else await p.click(s); await p.waitForTimeout(700); }
    const P = await p.evaluate(rd => { const read = new Function('return (' + rd + ')')(), om = document.querySelector('#sbody .onman'); if (!om) return null;
      const C = BohemiaRoster, it = (BohemiaSettlement.state.stock.armourer || []).find(i => i.kind === 'shield'), man = BohemiaSettlement.shopCrew().find(m => m.name === om.dataset.man), w = C.wearing(man, it);
      return { lines: read('#sbody .onman .ln'), ks: [...om.querySelectorAll('.ln')].map(l => l.dataset.k), ab: om.querySelectorAll('.ab').length, card: (document.getElementById('sbody') || om).innerText, before: w.before, after: w.after, stars: man.stars || {} }; }, READ.toString());
    const pb = [];
    if (!P) pb.push('no ON A MAN box');
    else {
      const eight = P.ks.filter(k => ORDER.indexOf(k) >= 0), want = ORDER.filter(k => eight.indexOf(k) >= 0);
      if (eight.join(',') !== want.join(',')) pb.push('order ' + eight.join(','));
      if (P.ab) pb.push(P.ab + ' X-to-Y spans');
      if (XTOY.test(P.card)) pb.push('X to Y on the card: ' + (P.card.match(XTOY) || [])[0]);
      P.lines.filter(r => r.bar).forEach(r => { const a = P.after[r.k], bf = P.before[r.k], d = a - bf;
        if (r.chg !== (d > 0 ? '+' : '') + d || (d && !r.arrow)) pb.push(r.k + ' says ' + r.chg + ' want ' + d);
        if (r.stars !== (P.stars[r.k] | 0)) pb.push(r.k + ' stars ' + r.stars);
        barOk(r, a, bf, null).forEach(x => pb.push(x)); });
      if (!P.lines.some(r => r.bar)) pb.push('no stat line shown');
    }
    legs.P1 = ok(prof.name + ' P1 THE SHOP ON A MAN: his order, each an arrow and the amount, the new fill and the moved part lit within a pixel, no X to Y', !pb.length, pb.slice(0, 4).join('; '));
  } catch (e) { ok(prof.name + ' the town ran', false, e && e.message); }
  legs.errsT = errs.filter(e => !/ResizeObserver/.test(e));
  await ctx.close(); srv.close();
}

const PROFILES = [{ name: 'phone', ctx: T.PROFILES.phone }, { name: 'computer', ctx: T.PROFILES.computer }];
const PLANTS = [
  { name: 'the order swapped', want: ['C1', 'C5', 'H1'], plant: { '/engine/bohemia_stats.js': [["var ORDER = ['hp', 'fatigue', 'ranged_skill', 'melee_skill',", "var ORDER = ['hp', 'fatigue', 'melee_skill', 'ranged_skill',"]] } },
  { name: 'the fill off the maximum', want: ['C3', 'H2'], plant: { '/engine/bohemia_stats.js': [["return Math.max(0, Math.min(1, (+n || 0) / maxOf(k)));", "return Math.max(0, Math.min(1, (+n || 0) / (maxOf(k) * 0.8)));"]] } },
  { name: 'the tick at the top roll, not the middle', want: ['C4', 'H2'], plant: { '/engine/bohemia_stats.js': [["DATA.mid_roll[k][Math.max(0, Math.min(3, st))]", "DATA.best_roll[k][Math.max(0, Math.min(3, st))]"]] } },
  { name: 'the change column grows when a change shows', want: ['C7'], plant: { '/engine/bohemia_stats.js': [['minmax(0,1fr) 40px;align-items', 'minmax(0,1fr) auto;align-items']] } },
  { name: 'X to Y put back in the shop', want: ['P1'], plant: { '/slices/BOHEMIA_SETTLEMENT_SCREEN.html': [["try{ if(box && window.BohemiaStats) shopArrows(box); }catch(e){}", ""]] } }
];

(async () => {
  const plantMode = process.argv.includes('--plant');
  console.log('=== STATS ARE BARS AND ARROWS, IN HIS ORDER (rules 223(e), 247(e)) ===');
  /* S1 to S3 */
  const S = require(path.join(ROOT, 'engine/bohemia_stats.js')).BohemiaStats;
  const rosterSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_roster.js'), 'utf8'), originSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_origin_start.js'), 'utf8');
  const bbOrder = src => (src.match(/var STATS = \[([^\]]*)\]/) || [])[1];
  const bbStr = BB_ORDER.map(k => "'" + k + "'").join(', ');
  ok('S1 THE ONE LIST is his eight in his order; the dice\'s order untouched (no saved man re-rolls)', S.ORDER.join(',') === ORDER.join(',') && bbOrder(rosterSrc) === bbStr && bbOrder(originSrc) === bbStr, S.ORDER.join(','));
  const c = S.compute(J('records/target/bb/backgrounds.json'), J('records/target/bb/rules.json'), J('records/target/bb/traits.json'));
  const TUNED = { hp: 133, fatigue: 183, ranged_skill: 109, melee_skill: 122, ranged_defense: 68, melee_defense: 65, resolve: 120, initiative: 195 };   /* TUNING's section Q, by hand */
  ok('S2 THE MOST POSSIBLE: one number a stat, TUNING\'s (best background + best trait at the post + ten levels at the 3-star best roll), the formula, the file and the engine agree',
    ORDER.every(k => c.max[k] === TUNED[k] && FILE.max[k] === TUNED[k] && S.DATA.max[k] === TUNED[k] && JSON.stringify(c.mid_roll[k]) === JSON.stringify(FILE.mid_roll[k]) && JSON.stringify(S.DATA.mid_roll[k]) === JSON.stringify(FILE.mid_roll[k])), JSON.stringify(FILE.max));
  /* TUNING's six worked ticks (records/BOHEMIA_TUNING_STRUCK_DOWN_HE_STILL_FIGHTS_THE_DEBUFF_AND_THE_CLINIC_10_26_26.md s6) */
  const SIX = [[1, 'hp', 55, 0, 85], [1, 'hp', 55, 3, 100], [1, 'melee_skill', 50, 2, 80], [6, 'ranged_skill', 60, 1, 77.5], [3, 'initiative', 110, 3, 154], [11, 'melee_defense', 30, 2, 30]];
  const six = SIX.map(([lv, k, n, st, t]) => ({ k, want: t, got: S.ceilingOf({ level: lv, stars: { [k]: st } }, k, n), oracle: ceilK(k, n, lv, st) }));
  ok('S4 TUNING\'s six worked ticks come out of the engine and the gate\'s own oracle alike', six.every(x => x.got === x.want && x.oracle === x.want), six.map(x => x.k + ' ' + x.got + '/' + x.want).join(', '));
  const scr = ['slices/BOHEMIA_ROSTER_SCREEN.html', 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'].map(f => [f, fs.readFileSync(path.join(ROOT, f), 'utf8')]);
  ok('S3 every screen that shows the eight loads the one list and lays its rows from it', scr.every(([f, t]) => /<script src="\.\.\/engine\/bohemia_stats\.js"><\/script>/.test(t) && /BohemiaStats\.ORDER|B\.ORDER/.test(t)), scr.map(([f, t]) => f.replace(/^.*\//, '') + ' ' + (t.match(/BohemiaStats\.ORDER|B\.ORDER/g) || []).length).join(', '));
  const { chromium } = require('playwright'); const b = await chromium.launch();
  const errs = [];
  for (const prof of PROFILES) {
    const legs = {}; await crew(b, prof, null, legs); await town(b, prof, null, legs);
    errs.push(...legs.errsC, ...legs.errsT);
  }
  ok('E nothing thrown', !errs.length, errs.slice(0, 3).join(' | '));
  if (plantMode) {
    for (const pl of PLANTS) {
      const legs = {}, saved = { p: pass, f: fail };
      const log = console.log; console.log = () => {};
      try { await crew(b, PROFILES[0], pl.plant, legs); await town(b, PROFILES[0], pl.plant, legs); } finally { console.log = log; }
      pass = saved.p; fail = saved.f;
      const red = pl.want.filter(k => legs[k] === false);
      ok('PLANT ' + pl.name + ': caught (' + (red.join(', ') || 'nothing went red') + ')', red.length > 0);
    }
  }
  await b.close();
  console.log('=== STATS ARE BARS AND ARROWS, IN HIS ORDER: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate threw: ' + (e && e.stack || e)); process.exit(1); });

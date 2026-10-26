/* OPTIMIZE LOOT GATE (RUN FOUR [optimize loot] and [one tap selects, two taps take], VAMILY rules 244 and 249, 10/26/26).
   PAOLO 10/26: 'there should be an optimize loot button at the end of battle screen... if my inventory is full but there are ten
   more things that could be taken... it takes the things in your inventory that are sellable at the lowest price and replaces
   them with the more expensive loot.' And: 'when I click something once in a shop or an inventory it should be highlighted...
   I just double click it.'
   MEASURED BEFORE: LOOT ALL filled what room there was in the ground's order and stopped; with a full stash the only way to a
   better one was a tap to put a piece back and a tap to take one, piece by piece, with no price shown anywhere on the screen.
   A single tap on a piece moved it at once.
     P1 THE SWAP IS THE BEST STASH: 600 rolled stashes and grounds, every one checked against every possible stash (all subsets):
        the stash optimize makes sells for the most any stash that fits could, at the plain price AND at every town's price
     P2 ONE ORDER AT EVERY TOWN: the pieces it takes and leaves do not change with the town's standing or trait
     P3 NOTHING PROTECTED MOVES: KEEP, bought, worn, held, bagged, a job's piece stay in their own slot; nothing lost, nothing twice,
        never over the cap; a tie never swaps
     P4 THE PRICE IS THE SHOP'S: the settlement screen's own sellBack and isJunk, cut out of its file and run beside ours on the
        same pieces at the same towns, give the same batteries and the same junk
     S1-S6 THE SCREEN, phone (a finger) and computer (a mouse): a full stash of 36 and ten pieces on the ground;
        S1 OPTIMIZE LOOT stands beside LOOT ALL, both whole on screen, a thumb's size, and says its gain before the tap
        S2 one real tap: the stash's sell value is the most it can be (the gate's own count), 36 still, every protected piece in
           its own slot, the saved bag is the stash, the strip shows down what it left and up what it took and the battery gain
        S3 UNDO (a real tap): the stash and the ground exactly as before, piece by piece, and the saved bag too
        S4 it is not there when it has nothing to do: room for everything, nothing on the ground, a lost fight
        S5 ONE TAP SELECTS (rule 249(a), 250(a)): the piece lights, its facts in the strip, no box moves a pixel, nothing taken
        S6 TWO TAPS TAKE (249(b)): a double tap takes it (a finger), a double click and a right click (a mouse) take it or put it back
     D1 THE DEMO: a full stash, a real road fight won through the map's own door; OPTIMIZE stands on the spoils screen the game
        opens, and a real tap there makes the best stash
   node gates/optimize_loot_gate.js [--no-demo] */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..');
const SP = require(path.join(ROOT, 'engine/bohemia_spoils.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== OPTIMIZE LOOT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2' };

/* ---------- the rolled cases ---------- */
function rng(seed) { let x = seed >>> 0 || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }
function piece(r, k) {
  const it = { id: 'p' + k, price: 1 + Math.floor(r() * 400), looted: r() < 0.8 };
  if (r() < 0.7) { it.condMax = 20 + Math.floor(r() * 200); it.cond = Math.floor(r() * (it.condMax + 1)); }
  const z = r();
  if (z < 0.08) it.keep = true; else if (z < 0.12) it.keep = false; else if (z < 0.14) it.job = true; else if (z < 0.16) it.worn = true;
  return it;
}
function brute(stash, ground, cap, at) {
  const fixed = stash.filter(SP.fixed), pool = stash.filter(it => !SP.fixed(it)).concat(ground), room = Math.max(0, cap - fixed.length);
  const v = pool.map(it => SP.sellBack(it, at)), n = pool.length, base = fixed.reduce((s, it) => s + SP.sellBack(it, at), 0);
  let best = -1;
  for (let m = 0; m < (1 << n); m++) { let c = 0, s = 0; for (let i = 0; i < n; i++) if (m & (1 << i)) { c++; s += v[i]; } if (c <= room && s > best) best = s; }
  return base + best;
}
const sum = (a, at) => a.reduce((s, it) => s + SP.sellBack(it, at), 0);
const TOWNS = [{}, { add: 0.02 }, { mult: 0.6 }, { mult: 1.45, add: 0.01 }, { mult: 1.12 }, { mult: 2.3 }];

/* ---------- the shop's own price, cut out of its file ---------- */
function cutFn(src, name) {
  const i = src.indexOf('function ' + name + '('); if (i < 0) return null;
  let d = 0, j = src.indexOf('{', i);
  for (let k = j; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  return null;
}

(async () => {
  /* ---- P1 P2 P3 ---- */
  let best = 0, cases = 0, worse = [], moved = 0, lost = 0, over = 0, towns = 0, tie = 0;
  for (let c = 0; c < 600; c++) {
    const r = rng(9001 + c * 7919), cap = 3 + Math.floor(r() * 6), full = r() < 0.75 ? cap : Math.floor(r() * cap);
    const stash = Array.from({ length: full }, (_, k) => piece(r, k)), ground = Array.from({ length: 1 + Math.floor(r() * 6) }, (_, k) => piece(r, 100 + k));
    ground.forEach(it => { delete it.keep; delete it.job; delete it.worn; it.looted = true; });
    if (stash.length + ground.length > 14) continue;
    cases++;
    let pick0 = null;
    TOWNS.forEach((at, t) => {
      const o = SP.optimize(stash.slice(), ground.slice(), cap, at), b = brute(stash, ground, cap, at);
      if (o.after === b && sum(o.stash, at) === b) best++; else worse.push(c + '@' + t + ': ' + o.after + ' vs ' + b);
      const key = o.took.map(i => i.id).join() + '|' + o.left.map(i => i.id).join();
      if (pick0 === null) pick0 = key; else if (key === pick0) towns++;
      stash.forEach((it, i) => { if (SP.fixed(it) && o.stash[i] !== it) moved++; });
      const all = stash.concat(ground).map(i => i.id).sort().join(), now = o.stash.concat(o.ground).map(i => i.id).sort().join();
      if (all !== now) lost++;
      if (o.stash.length > Math.max(cap, stash.filter(SP.fixed).length)) over++;
    });
  }
  ok('P1 THE SWAP IS THE BEST STASH: every rolled case against every stash that could be made, at the plain price and five towns', worse.length === 0 && best === cases * TOWNS.length,
    best + ' of ' + cases * TOWNS.length + ' best' + (worse.length ? '; ' + worse.slice(0, 3).join(', ') : ''));
  ok('P2 ONE ORDER AT EVERY TOWN: what it takes and what it leaves is the same whatever the standing or the trait', towns === cases * (TOWNS.length - 1), towns + ' of ' + cases * (TOWNS.length - 1));
  ok('P3 NOTHING PROTECTED MOVES: KEEP, bought, worn, a job\'s piece in its own slot; nothing lost or twice; never over the cap', moved === 0 && lost === 0 && over === 0, 'moved ' + moved + ', lost ' + lost + ', over ' + over);
  {
    const a = { id: 'a', price: 70, looted: true }, b = { id: 'b', price: 70, looted: true }, k = { id: 'k', price: 1, keep: true };
    const o = SP.optimize([k, a], [b], 2);
    tie = o.took.length === 0 && o.stash[1] === a && o.ground[0] === b;
    const o2 = SP.optimize([{ id: 'x', price: 1, looted: true }, { id: 'y', price: 999 }], [{ id: 'z', price: 5, looted: true }], 2);
    ok('    a tie never swaps; a bought piece (no KEEP mark, never looted) is his and stays; a cheaper looted one goes', tie && o2.took[0].id === 'z' && o2.left[0].id === 'x' && o2.stash[1].id === 'y', JSON.stringify({ tie, took: o2.took.map(i => i.id), left: o2.left.map(i => i.id) }));
  }
  /* ---- P4 the shop's price ---- */
  {
    const src = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
    const cut = (src.match(/var SELL_CUT = ([^;]+);/) || [])[1], sb = cutFn(src, 'sellBack'), ij = cutFn(src, 'isJunk');
    let same = 0, n = 0, bad = [];
    if (cut && sb && ij) {
      TOWNS.forEach(at => {
        const shop = new Function('SELL_CUT', 'relPrice', 'traitMult', sb + '\n' + ij + '\nreturn {sellBack:sellBack, isJunk:isJunk};')(eval(cut), () => ({ sellAdd: at.add || 0 }), () => ({ sell: at.mult != null ? at.mult : 1 }));
        for (let c = 0; c < 400; c++) { const r = rng(77 + c), it = piece(r, c); if (r() < 0.3) it.base = 1 + Math.floor(r() * 300); n++;
          if (shop.sellBack(it) === SP.sellBack(it, at) && shop.isJunk(it) === SP.junk(it)) same++; else if (bad.length < 3) bad.push(it.id + ' ' + shop.sellBack(it) + '/' + SP.sellBack(it, at)); }
      });
    }
    ok('P4 THE PRICE IS THE SHOP\'S: its own sellBack and isJunk, cut out of the settlement screen, agree with ours on every piece at every town',
      !!(cut && sb && ij) && same === n && n > 0, (cut ? 'cut ' + cut + ', ' : 'no SELL_CUT, ') + same + ' of ' + n + (bad.length ? '; ' + bad.join(', ') : ''));
  }

  /* ---- THE SCREEN ---- */
  const srv = http.createServer((rq, rs) => {
    const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const URL = 'http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SPOILS_SCREEN.html';
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const b = await chromium.launch();
  const serrs = [];
  /* a full stash: 30 pieces looted off earlier fights (worn, cheap), 3 marked KEEP, 3 he bought; ten on the ground, mixed */
  const FULL = () => {
    const I = (k, id, x) => Object.assign(BohemiaRoster.itemOf(k, id), x || {});
    const cheap = [['weapon', 'knife'], ['weapon', 'wooden_stick'], ['weapon', 'wooden_flail'], ['body', 'sackcloth'], ['head', 'mouthpiece'], ['head', 'cultist_hood'], ['body', 'cloth_sash'], ['shield', 'buckler']];
    const st = [];
    for (let i = 0; i < 30; i++) { const c = cheap[i % cheap.length]; st.push(I(c[0], c[1], { looted: true, cond: 5 + (i % 7), condMax: 12 })); }
    st.splice(4, 0, I('weapon', 'knife', { keep: true })); st.splice(11, 0, I('body', 'sackcloth', { keep: true })); st.splice(20, 0, I('weapon', 'bludgeon'));
    st.splice(27, 0, I('head', 'mouthpiece')); st.push(I('shield', 'buckler', { keep: true }), I('weapon', 'claw_club'));
    localStorage.setItem('bohemia.bag.v1', JSON.stringify(st));
    BohemiaSpoilsScreen.open({ fight: BohemiaSpoilsScreen.SAMPLE, seed: 7 });
    const S = BohemiaSpoilsScreen.state;
    const gr = [['weapon', 'shamshir'], ['weapon', 'throwing_net'], ['body', 'coat_of_scales'], ['head', 'full_helm'], ['shield', 'kraken_shield'], ['weapon', 'bludgeon'], ['body', 'leather_wraps'], ['head', 'headscarf'], ['weapon', 'pollaxe'], ['shield', 'old_wooden_shield']];
    S.ground = gr.map((g, i) => I(g[0], g[1], { looted: true, cond: 1 + i, condMax: 14, from: ['THUG', 'RAIDER'][i % 2] }));
    BohemiaSpoilsScreen.draw();
    return { cap: S.cap, stash: S.stash.length, ground: S.ground.length };
  };
  const snap = () => { const S = BohemiaSpoilsScreen.state, f = it => [it.id, it.cond, it.condMax, it.keep, !!it.looted, !!it.fresh].join(':');
    return { stash: S.stash.map(f), ground: S.ground.map(f), bag: JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').map(it => [it.id, it.cond, it.condMax, it.keep, !!it.looted].join(':')) }; };
  for (const [w, h, mob, name] of [[390, 844, true, 'PHONE'], [1280, 800, false, 'COMPUTER']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage(); p.on('pageerror', e => serrs.push(name + ': ' + e.message));
    const press = async (sel) => mob ? p.tap(sel) : p.click(sel);
    await p.goto(URL);
    await p.waitForFunction(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened, null, { timeout: 30000 });
    const n0 = await p.evaluate(FULL); await p.waitForTimeout(300);
    /* S1 beside LOOT ALL, whole, a thumb's size, its gain said */
    const lay = await p.evaluate(() => { const r = id => { const e = document.getElementById(id), q = e.getBoundingClientRect(); return { x: q.left, y: q.top, w: q.width, h: q.height, shown: !e.hidden && getComputedStyle(e).display !== 'none', t: e.textContent }; };
      const S = BohemiaSpoilsScreen.state, o = BohemiaSpoils.optimize(S.stash, S.ground, S.cap, S.at); return { opt: r('optimize'), all: r('lootall'), leave: r('leave'), vw: innerWidth, vh: innerHeight, gain: o.gain, took: o.took.length }; });
    const whole = q => q.x >= 0 && q.y >= 0 && q.x + q.w <= lay.vw + 0.5 && q.y + q.h <= lay.vh + 0.5;
    const apart = (a, c) => a.x + a.w <= c.x + 0.5 || c.x + c.w <= a.x + 0.5 || a.y + a.h <= c.y + 0.5 || c.y + c.h <= a.y + 0.5;
    ok('S1 ' + name + ': a full stash (' + n0.stash + ' of ' + n0.cap + ') and ' + n0.ground + ' on the ground: OPTIMIZE LOOT stands beside LOOT ALL, both whole, a thumb\'s size, and says its gain before the tap',
      lay.opt.shown && /OPTIMIZE/.test(lay.opt.t) && Math.abs((lay.opt.y + lay.opt.h / 2) - (lay.all.y + lay.all.h / 2)) < 4 && lay.opt.x > lay.all.x && whole(lay.opt) && whole(lay.all) && whole(lay.leave)
        && lay.opt.h >= 44 && lay.opt.w >= 88 && apart(lay.opt, lay.all) && apart(lay.opt, lay.leave) && lay.opt.t.indexOf('▲' + lay.gain) >= 0 && lay.took > 0,
      Math.round(lay.opt.w) + 'x' + Math.round(lay.opt.h) + ' at ' + Math.round(lay.opt.x) + ',' + Math.round(lay.opt.y) + ' beside ' + Math.round(lay.all.w) + 'x' + Math.round(lay.all.h) + '; "' + lay.opt.t + '"');
    const before = await p.evaluate(snap);
    const fixedAt = await p.evaluate(() => BohemiaSpoilsScreen.state.stash.map((it, i) => BohemiaSpoils.fixed(it) ? i + ':' + it.id : null).filter(Boolean));
    /* S2 one real tap */
    await press('#optimize'); await p.waitForTimeout(300);
    const s2 = await p.evaluate(() => { const S = BohemiaSpoilsScreen.state, SPx = BohemiaSpoils, all = S.stash.concat(S.ground);
      const fixed = S.stash.filter(SPx.fixed), free = all.filter(it => !SPx.fixed(it)).map(it => SPx.sellBack(it, S.at)).sort((a, b) => b - a);
      const most = fixed.reduce((s, it) => s + SPx.sellBack(it, S.at), 0) + free.slice(0, S.cap - fixed.length).reduce((s, v) => s + v, 0);
      const has = S.stash.reduce((s, it) => s + SPx.sellBack(it, S.at), 0), said = document.getElementById('said'), rep = said.querySelector('.rep');
      const down = rep ? [].indexOf.call(rep.children, rep.querySelector('.gdn')) : -1, upAt = rep ? [].indexOf.call(rep.children, rep.querySelectorAll('.gup')[0]) : -1;
      const kids = rep ? [].filter.call(rep.children, e => !e.classList.contains('gup') && !e.classList.contains('gdn')).length : 0, bat = !!said.querySelector('.sell img.bat');
      return { most, has, n: S.stash.length, cap: S.cap, kids, bat, fixedNow: S.stash.map((it, i) => SPx.fixed(it) ? i + ':' + it.id : null).filter(Boolean), saved: JSON.parse(localStorage.getItem('bohemia.bag.v1')).map(it => it.id).join() === S.stash.map(it => it.id).join(),
        rep: S.lastReport, pics: rep ? rep.querySelectorAll('img,canvas').length : 0, down, upAt, strip: said.textContent, btn: document.getElementById('optimize').textContent,
        fresh: S.stash.filter(it => it.fresh).length, out: document.querySelectorAll('#ground .slot.out').length }; });
    ok('S2 ' + name + ' one real tap: the stash sells for the most it can (the gate\'s own count), still ' + s2.cap + ', every protected piece in its own slot, the saved bag is the stash',
      s2.has === s2.most && s2.n === s2.cap && JSON.stringify(s2.fixedNow) === JSON.stringify(fixedAt) && s2.saved && s2.rep && s2.rep.took.length > 0,
      'worth ' + s2.has + ' of ' + s2.most + '; kept in place ' + fixedAt.join(' ') + '; took ' + (s2.rep ? s2.rep.took.length : 0) + ', left ' + (s2.rep ? s2.rep.left.length : 0));
    ok('    the strip says it in pictures: down, what it left; up, what it took; a battery, up by the gain; the new pieces lit, the left ones marked; the button is UNDO',
      s2.down === 0 && s2.upAt > 0 && s2.kids === Math.min(4, s2.rep.left.length) + Math.min(4, s2.rep.took.length) && s2.pics === s2.kids && s2.bat && s2.strip.indexOf('▲' + s2.rep.gain) >= 0 && s2.fresh === s2.rep.took.length && s2.out === s2.rep.left.length && /UNDO/.test(s2.btn),
      s2.pics + ' pictures, "' + s2.strip.replace(/\s+/g, ' ') + '", ' + s2.fresh + ' lit, ' + s2.out + ' marked, button "' + s2.btn + '"');
    /* S3 UNDO */
    await press('#optimize'); await p.waitForTimeout(300);
    const after = await p.evaluate(snap), btn3 = await p.evaluate(() => document.getElementById('optimize').textContent);
    ok('S3 ' + name + ' UNDO (a real tap): the stash and the ground exactly as before, piece by piece, the saved bag too, and OPTIMIZE again',
      JSON.stringify(after) === JSON.stringify(before) && /OPTIMIZE/.test(btn3), after.stash.length + ' in the stash, ' + after.ground.length + ' on the ground');
    /* S5 one tap selects: nothing moves */
    const rects = () => p.evaluate(() => [].map.call(document.querySelectorAll('.slot,#lootall,#optimize,#leave,#said,#counts .count'), e => { const q = e.getBoundingClientRect(); return [q.left, q.top, q.width, q.height].map(v => Math.round(v)).join(','); }).join('|'));
    await p.evaluate(() => document.querySelectorAll('#ground .slot.full')[2].scrollIntoView({ block: 'center' })); await p.waitForTimeout(250);   /* clear of the bar, so the tap needs no scroll */
    const r0 = await rects(), g0 = await p.evaluate(() => [BohemiaSpoilsScreen.state.ground.length, BohemiaSpoilsScreen.state.stash.length].join());
    await press('#ground .slot.full >> nth=2'); await p.waitForTimeout(600);
    const s5 = await p.evaluate(() => { const S = BohemiaSpoilsScreen.state, el = document.querySelector('#ground .slot.sel'), st = el && getComputedStyle(el);
      return { sel: S.sel && S.sel.id, lit: !!el && el.dataset.id === (S.sel && S.sel.id) && parseFloat(st.outlineWidth) >= 2, strip: document.getElementById('said').textContent, name: S.sel && S.sel.name.replace(/^(a|an) /, '').toUpperCase(), n: [S.ground.length, S.stash.length].join() }; });
    const r1 = await rects();
    ok('S5 ' + name + ' ONE TAP SELECTS: the piece lights, its facts are in the strip, nothing was taken and no box moved a pixel', s5.lit && s5.strip.indexOf(s5.name) >= 0 && s5.n === g0 && r1 === r0,
      s5.sel + ': "' + s5.strip.replace(/\s+/g, ' ').slice(0, 70) + '"' + (r1 === r0 ? '' : ' MOVED'));
    /* S6 two taps take: room for one first */
    await p.evaluate(() => { const S = BohemiaSpoilsScreen.state; S.stash.splice(5, 1); BohemiaSpoilsScreen.draw(); });
    const id6 = await p.evaluate(() => BohemiaSpoilsScreen.state.ground[0].id);
    if (mob) { await p.tap('#ground .slot.full >> nth=0'); await p.tap('#ground .slot.full >> nth=0'); }
    else await p.dblclick('#ground .slot.full >> nth=0');
    await p.waitForTimeout(300);
    const s6 = await p.evaluate((id) => { const S = BohemiaSpoilsScreen.state; return { inStash: S.stash.some(it => it.id === id && it.fresh), n: S.stash.length, cap: S.cap }; }, id6);
    let s6b = { ok: true, t: '' };
    if (!mob) {   /* a right click puts it back, and a right click takes it again (Battle Brothers') */
      const k = await p.evaluate((id) => BohemiaSpoilsScreen.state.stash.findIndex(it => it.id === id), id6);
      await p.click('#stash .slot[data-i="' + k + '"]', { button: 'right' }); await p.waitForTimeout(200);
      const back = await p.evaluate((id) => BohemiaSpoilsScreen.state.ground.some(it => it.id === id), id6);
      const g = await p.evaluate((id) => BohemiaSpoilsScreen.state.ground.findIndex(it => it.id === id), id6);
      await p.click('#ground .slot[data-i="' + g + '"]', { button: 'right' }); await p.waitForTimeout(200);
      const again = await p.evaluate((id) => BohemiaSpoilsScreen.state.stash.some(it => it.id === id), id6);
      s6b = { ok: back && again, t: '; a right click put it back and took it again: ' + back + '/' + again };
    }
    ok('S6 ' + name + (mob ? ' TWO TAPS TAKE: a double tap' : ' A DOUBLE CLICK TAKES') + ' moves the piece into the stash, lit' + (mob ? '' : ', and a right click does the same'),
      s6.inStash && s6.n === s6.cap && s6b.ok, id6 + ' in the stash ' + s6.n + '/' + s6.cap + s6b.t);
    /* S4 not there when it has nothing to do */
    const s4 = await p.evaluate(() => { const SS = BohemiaSpoilsScreen, S = SS.state, vis = () => !document.getElementById('optimize').hidden;
      localStorage.setItem('bohemia.bag.v1', '[]'); SS.open({ fight: SS.SAMPLE, seed: 7 }); const room = vis();
      S.ground = []; SS.draw(); const empty = vis();
      const lost = JSON.parse(JSON.stringify(SS.SAMPLE)); lost.result = 'lost'; SS.open({ fight: lost, seed: 7 }); const l = vis();
      return { room, empty, lost: l }; });
    ok('S4 ' + name + ' it is not there with room for everything, with nothing on the ground, or after a lost fight', !s4.room && !s4.empty && !s4.lost, JSON.stringify(s4));
    await ctx.close();
  }
  await b.close(); srv.close();
  ok('S7 nothing threw on the screen', serrs.length === 0, serrs.slice(0, 3).join(' | '));

  /* ---- D1 THE DEMO ---- */
  if (process.argv.indexOf('--no-demo') < 0) {
    const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
    let d;
    try { d = await drive.open({ keepCards: true, engage: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
    catch (e) { ok('D1 the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
    const p = d.page, fr = d.fr, errs = [];
    p.on('pageerror', e => errs.push(e.message));
    try {
      await p.waitForTimeout(2500);
      /* his stash is full of cheap loot off earlier fights (the market's own pieces, looted, worn) */
      await p.evaluate(() => { const st = []; for (let i = 0; i < 36; i++) st.push({ id: 'knife', kind: 'weapon', cls: 'dagger', name: 'a beat-up pistol', price: 3, looted: true, cond: 3, condMax: 32 });
        localStorage.setItem('bohemia.bag.v1', JSON.stringify(st)); });
      await fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 21 }); });
      let f = null;
      for (let i = 0; i < 200 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
        if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
      if (!f) { ok('D1 THE DEMO: a road fight through the map\'s own door', false); }
      else {
        await f.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = Math.round(u.armBMax * 0.9); u.armH = u.armHMax; }); S.over = true; S.result = 'won'; showOver('won'); });
        const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
        for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await p.waitForTimeout(200);
        const sf = SF(), SFL = p.frameLocator('#spoilsdoor iframe');
        const d0 = sf ? await sf.evaluate(() => { const S = BohemiaSpoilsScreen.state, b = document.getElementById('optimize'); return { shown: !b.hidden && !b.disabled, stash: S.stash.length, cap: S.cap, ground: S.ground.length, t: b.textContent }; }) : null;
        if (d0 && d0.shown) { await SFL.locator('#optimize').tap(); await p.waitForTimeout(400); }
        const d1 = sf ? await sf.evaluate(() => { const S = BohemiaSpoilsScreen.state, SPx = BohemiaSpoils, all = S.stash.concat(S.ground), fixed = S.stash.filter(SPx.fixed);
          const most = fixed.reduce((s, it) => s + SPx.sellBack(it, S.at), 0) + all.filter(it => !SPx.fixed(it)).map(it => SPx.sellBack(it, S.at)).sort((a, b) => b - a).slice(0, S.cap - fixed.length).reduce((s, v) => s + v, 0);
          return { has: S.stash.reduce((s, it) => s + SPx.sellBack(it, S.at), 0), most, took: (S.lastReport || {}).took || [], n: S.stash.length }; }) : null;
        ok('D1 *** THE DEMO *** a full stash, a road fight won through the map\'s own door: OPTIMIZE stands on the spoils screen the game opened, and a real tap makes the best stash',
          !!d0 && d0.shown && d0.stash === d0.cap && d0.ground > 0 && !!d1 && d1.has === d1.most && d1.took.length > 0 && d1.n === d0.cap,
          d0 ? d0.stash + '/' + d0.cap + ' in the stash, ' + d0.ground + ' on the ground, "' + d0.t + '"; ' + (d1 ? 'worth ' + d1.has + ' of ' + d1.most + ', took ' + d1.took.join(', ') : '') : 'no spoils screen');
      }
      ok('D2 nothing threw on the demo', errs.length === 0, errs.slice(0, 3).join(' | '));
    } catch (e) { ok('the demo walk ran to the end [' + String(e && e.message).slice(0, 200) + ']', false); }
    try { await d.close(); } catch (_e) {}
  }
  done();
})();

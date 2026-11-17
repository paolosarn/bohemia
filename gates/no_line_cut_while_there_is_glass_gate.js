/* NO LINE CUT WHILE THERE IS GLASS (UI THREE 11/14, ask row 612; EYES 11/11: 'CUT WORDS LEFT: the Elder's line on the board upright;
   a retinue line sideways'; rule 447(b)).
   The town's sheets as the game lays them (UI 9's fit planted the way the shell plants it: bohemia_ui_materials.js, then
   bohemia_ui_no_scroll.js), BLUE DIAMOND, the phone upright (390 x 844) and sideways (844 x 390):
   L1 every line of words UI 9's density cut (a line clamp) on the board, the hall and the smith is WHOLE, unless the sheet is full:
      for each line still cut the gate lets it go whole itself and the sheet then runs past its box (proved full, the cut kept);
   L2 every sheet a line went whole in still fits by UI 9's own measure (nothing runs past #sheet or #sbody) and stands on the
      glass (a sheet UI 9 itself could not fit, the smith sideways on main, is named);
   L3 a hall with more men (BLUE DIAMOND's crowd raised to the fair's) keeps only the lines that cannot fit, each proved as in L1.
   L4 THE FULLEST HALL (UI FOUR 11/17, row 612's last spot; the scrolling gate's own: a fortress on a fair day with the recruiter in camp,
      ten men and three who would travel): upright and sideways every man and every follower stands whole on the glass, the sheet
      runs past nothing, no line is cut (the speaker's too), every follower's own line is a held finger away (data-tip carries it
      letter for letter), his button keeps 44 px, no word under 11 px; a tap on a follower keeps it all on the glass;
   --plant: the pass that lets the lines go whole never runs (L1 red); the hall's one more step never runs (L4 red).
   Run: node gates/no_line_cut_while_there_is_glass_gate.js [--plant] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
let pass = 0, fail = 0, QUIET = false;
const ok = (m, g, x) => { if (QUIET) return g; g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + String(x).slice(0, 400) + ']' : '')); return g; };
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg' };
function serve(plant) {
  const srv = http.createServer((rq, rs) => { const u = decodeURIComponent(rq.url.split('?')[0]); const f = path.join(ROOT, u.replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
    if (plant && plant[u]) { let t = fs.readFileSync(f, 'utf8'); plant[u].forEach(([a, b]) => { if (t.indexOf(a) < 0) console.log('  (plant did not find: ' + a.slice(0, 60) + ')'); t = t.split(a).join(b); }); return rs.end(t); }
    fs.createReadStream(f).pipe(rs); });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}
/* in the page: every line still cut, each proved full by letting it go whole (the gate's own unclamp, not the page's) */
const READ = () => {
  const sh = document.getElementById('sheet'), sb = document.getElementById('sbody');
  const over = e => !!e && e.scrollHeight > e.clientHeight + 1 && /(auto|scroll|hidden)/.test(getComputedStyle(e).overflowY);
  const fits = () => !over(sh) && !over(sb);
  const cut = [], proved = [], whole = [];
  sh.querySelectorAll('#sbody p, #sbody .rdoes').forEach(e => { const cs = getComputedStyle(e); if (e.getBoundingClientRect().width < 2 || cs.visibility === 'hidden') return;
    if (e.classList.contains('ui3-whole')) { whole.push(e.textContent.trim().slice(0, 30)); return; }
    if (!cs.webkitLineClamp || cs.webkitLineClamp === 'none' || e.scrollHeight <= e.clientHeight + 1) return;
    const was = e.getAttribute('style') || ''; e.style.setProperty('-webkit-line-clamp', 'unset', 'important'); e.style.setProperty('display', 'block', 'important'); e.style.setProperty('overflow', 'visible', 'important');
    const full = !fits(); e.setAttribute('style', was); (full ? proved : cut).push(e.textContent.trim().slice(0, 50)); });
  const r = sh.getBoundingClientRect();
  return { cls: sh.className, cut, proved, whole, fits: fits(), onGlass: r.top >= -0.5 && r.bottom <= innerHeight + 0.5, top: Math.round(r.top) };
};
async function walk(b, prof, plant, legs, crowd) {
  const srv = await serve(plant), port = srv.address().port;
  const ctx = await b.newContext({ viewport: prof.vp, deviceScaleFactor: 2, hasTouch: true, isMobile: true }), p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const out = {};
  try {
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
    await p.addScriptTag({ url: 'bohemia_ui_materials.js' }); await p.addScriptTag({ url: 'bohemia_ui_no_scroll.js' });
    for (const bld of (crowd ? ['hall'] : ['board', 'hall', 'smith'])) {
      await p.evaluate(t => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); BohemiaSettlement.open({ place: { name: 'BLUE DIAMOND', tier: t }, traits: [], day: 1, batteries: 3000 }); }, crowd ? 'fortress' : 'town');
      await p.waitForTimeout(600);
      const hx = await p.evaluate(k => BohemiaSettlement.where(k), bld); if (hx) await p.touchscreen.tap(hx.x, hx.y);
      await p.waitForTimeout(2600);   /* the sheet slid in, UI 9 measured, the pass ran */
      out[bld] = await p.evaluate(READ);
    }
  } catch (e) { out.err = e && e.message; }
  legs.errs = errs.filter(e => !/ResizeObserver/.test(e)); await ctx.close(); srv.close(); return out;
}
/* L4: the fullest hall, laid as the scrolling gate lays it */
const FULL = () => { const sh = document.getElementById('sheet'), sb = document.getElementById('sbody');
  const rows = [...sh.querySelectorAll('.hire, .retf')].map(e => { const q = e.getBoundingClientRect(), bt = e.querySelector(':scope > .act'), br = bt ? bt.getBoundingClientRect() : null, d = e.querySelector('.rdoes');
    let small = 99; e.querySelectorAll('*').forEach(x => { if (!x.children.length && x.textContent.trim() && x.getBoundingClientRect().width > 1) { const f = parseFloat(getComputedStyle(x).fontSize); if (f > 0.5 && f < small) small = f; } });
    return { k: e.classList.contains('hire') ? 'man' : 'follower', on: q.width > 2 && q.top >= -0.5 && q.bottom <= innerHeight + 0.5 && q.bottom <= sh.getBoundingClientRect().bottom + 0.5, tap: br ? Math.round(Math.min(br.width, br.height)) : 0, small, tip: e.dataset.tip || '', does: d ? d.textContent.trim() : '', doesShown: !!d && d.getBoundingClientRect().height > 1 }; });
  const cut = [...sh.querySelectorAll('#sbody p, #sbody .rdoes, #sbody .nm, #sbody .rname')].filter(e => e.getBoundingClientRect().width > 2 && (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1)).map(e => e.textContent.trim().slice(0, 30));
  return { cls: sh.className, over: Math.max(sh.scrollHeight - sh.clientHeight, sb.scrollHeight - sb.clientHeight), rows, cut }; };
async function fullest(b, prof, plant) {
  const srv = await serve(plant), port = srv.address().port;
  const ctx = await b.newContext({ viewport: prof.vp, deviceScaleFactor: 2, hasTouch: true, isMobile: true }), p = await ctx.newPage(), errs = []; p.on('pageerror', e => errs.push(e.message));
  let o = {}; try {
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
    await p.addScriptTag({ url: 'bohemia_ui_materials.js' }); await p.addScriptTag({ url: 'bohemia_ui_no_scroll.js' });
    await p.evaluate(() => { const c = JSON.parse(localStorage.getItem('bohemia.camp.v1') || '{}'); c.retinue = ['recruiter']; c.cart = c.cart || 0; localStorage.setItem('bohemia.camp.v1', JSON.stringify(c)); });
    const traits = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8')).traits.filter(t => t && t.recruits_mult > 1);
    await p.evaluate(tr => BohemiaSettlement.open({ place: { name: 'NELLIS GATE', tier: 'fortress' }, traits: tr, day: 9, batteries: 400 }), traits);
    await p.waitForTimeout(1500);
    const xy = await p.evaluate(() => BohemiaSettlement.where('hall')); await p.touchscreen.tap(xy.x, xy.y); await p.waitForTimeout(2800);
    o.rest = await p.evaluate(FULL);
    const f = await p.evaluate(() => { const e = document.querySelector('#sheet .retf .rface'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    if (f) { await p.touchscreen.tap(f[0], f[1]); await p.waitForTimeout(1600); o.tapped = await p.evaluate(FULL); o.heard = await p.evaluate(() => (document.getElementById('heard') || {}).textContent || ''); }
  } catch (e) { o.err = e && e.message; }
  o.errs = errs.filter(e => !/ResizeObserver/.test(e)); await ctx.close(); srv.close(); return o;
}
function judgeFull(o) {
  if (o.err || !o.rest) return { good: false, said: o.err || 'no hall' };
  const R = o.rest, T = o.tapped || { rows: [], over: 0, cut: [] }, men = R.rows.filter(r => r.k === 'man'), fol = R.rows.filter(r => r.k === 'follower'), bad = [];
  if (men.length < 10 || fol.length < 3) bad.push('only ' + men.length + ' men and ' + fol.length + ' followers stand in it');
  if (R.over > 1) bad.push('the sheet runs ' + R.over + ' px past its box');
  const off = R.rows.filter(r => !r.on); if (off.length) bad.push(off.length + ' off the glass (' + off.map(r => r.k).join(', ') + ')');
  if (R.cut.length) bad.push('cut: ' + R.cut.slice(0, 2).join(' | '));
  fol.forEach(r => { if (!r.doesShown && !(r.does && r.tip.indexOf(r.does) >= 0)) bad.push('a follower\'s line is neither on the glass nor on a held finger'); });
  R.rows.forEach(r => { if (r.tap < 44) bad.push('a ' + r.k + '\'s button is ' + r.tap + ' px'); if (r.small < 10.9) bad.push('a ' + r.k + '\'s word is ' + r.small + ' px'); });
  if (!o.tapped) bad.push('no follower to tap'); else { if (T.over > 1) bad.push('a tap on a follower runs the sheet ' + T.over + ' px past'); const o2 = T.rows.filter(r => !r.on).length; if (o2) bad.push('a tap on a follower puts ' + o2 + ' off the glass'); if (!/\S: \S/.test(o.heard || '')) bad.push('the follower tapped says nothing'); }
  return { good: !bad.length, said: men.length + ' men, ' + fol.length + ' followers, the sheet ' + R.cls.replace(/^on /, '') + '; a tap: "' + String(o.heard || '').slice(0, 40) + '"', bad: [...new Set(bad)] };
}
const PLANT4 = { '/slices/BOHEMIA_SETTLEMENT_SCREEN.html': [["if (!sh.classList.contains(TIGHT)) { sh.classList.add(TIGHT);", "if (false) { sh.classList.add(TIGHT);"]] };
const PROFS = [{ name: 'upright', vp: { width: 390, height: 844 } }, { name: 'sideways', vp: { width: 844, height: 390 } }];
const PLANT = { '/slices/BOHEMIA_SETTLEMENT_SCREEN.html': [["T = 0; var sh = sheet(); if (!sh || !sh.classList.contains('on')", "T = 0; return; var sh = sheet(); if (!sh || !sh.classList.contains('on')"]] };
function judge(name, o, legs) {
  const keys = Object.keys(o).filter(k => k !== 'err'), cut = [], bad = [];
  /* a sheet this pass let a line go whole in must still fit and stand on the glass; one UI 9 itself could not fit (the smith
     sideways, the scrolling gate's N3 on main) is named, never laid on this */
  const named = [];
  keys.forEach(k => { const x = o[k]; x.cut.forEach(t => cut.push(k + ': "' + t + '"'));
    const why = k + ' ' + (x.fits ? '' : 'runs past its box ') + (x.onGlass ? '' : 'off the glass at ' + x.top);
    if (!x.fits || !x.onGlass) (x.whole.length ? bad : named).push(why); });
  const said = keys.map(k => k + ' ' + o[k].whole.length + ' whole, ' + o[k].proved.length + ' kept (full)').join('; ') + (named.length ? '; UI 9\'s own, not this: ' + named.join(', ') : '');
  return { cut, bad, said };
}
(async () => {
  console.log('NO LINE CUT WHILE THERE IS GLASS (ask row 612)');
  const b = await chromium.launch(), errs = [];
  for (const prof of PROFS) {
    const legs = {}, o = await walk(b, prof, null, legs, false), j = judge(prof.name, o, legs); errs.push(...legs.errs);
    ok(prof.name + ' L1 the board, the hall and the smith: no line cut while the sheet has room (' + j.said + ')', !o.err && !j.cut.length, o.err || j.cut.slice(0, 3).join('; '));
    ok(prof.name + ' L2 every sheet a line went whole in still fits by UI 9\'s own measure and stands on the glass (' + j.said + ')', !o.err && !j.bad.length, j.bad.join('; '));
    const L = {}, c = await walk(b, prof, null, L, true), jc = judge(prof.name, c, L); errs.push(...L.errs);
    ok(prof.name + ' L3 a fortress\'s hall: only the lines that cannot fit stay cut, each proved full (' + jc.said + ')', !c.err && !jc.cut.length && !jc.bad.length, c.err || jc.cut.concat(jc.bad).slice(0, 3).join('; '));
  }
  for (const prof of PROFS) { const o = await fullest(b, prof, null), j = judgeFull(o); errs.push(...(o.errs || []));
    ok(prof.name + ' L4 THE FULLEST HALL: every man and every follower whole on the glass, no line cut, a follower\'s line a held finger away, 44 px buttons, 11 px words, a tap keeps it so (' + j.said + ')', j.good, (j.bad || []).slice(0, 4).join('; ')); }
  ok('E nothing thrown', !errs.length, errs.slice(0, 2).join(' | '));
  if (process.argv.includes('--plant')) {
    QUIET = true; const legs = {}, o = await walk(b, PROFS[0], PLANT, legs, false), j = judge('upright', o, legs); QUIET = false;
    ok('PLANT the pass never runs: L1 goes red (' + j.cut.length + ' cut)', j.cut.length > 0, j.cut.slice(0, 2).join('; '));
    const o4 = await fullest(b, PROFS[1], PLANT4), j4 = judgeFull(o4);
    ok('PLANT the hall\'s one more step never runs: L4 goes red sideways (' + (j4.bad || []).slice(0, 2).join('; ') + ')', !j4.good);
  }
  await b.close();
  console.log('NO LINE CUT WHILE THERE IS GLASS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

/* EVERY COUNT A PICTURE (UI FOUR 11/17, asks 145 and 146 round five; VAMILY rules 223, 224, 441, 453; the coordinator's 'the icons and
   bars on every screen that still shows bare numbers or words: the shop, the camp, the job board, the build sheet at his place, one
   look, upright and sideways').
   PAOLO 10/26 (rule 224): 'I'm tired of it just being numbers numbers numbers... more icons, more green up arrow, down red arrow, and
   the only number that matters is by how much.'
   The town screen as the game lays it (bohemia_ui_materials.js, then bohemia_ui_no_scroll.js, the way the shell plants them), the phone
   upright (390 x 844) and sideways (844 x 390), each sheet opened by a real tap on its building, twice: with the piece on, and with a
   checker's switch that keeps it off (window.__UC_OFF, the page as it was):
   B  THE BUILD SHEET AT HIS PLACE (his place handed over as the map hands it, the builds read from records/target/bb/home_base.json):
      every build's cost is the battery's own picture and a tape's with the file's numbers, every gain a green arrow up, the supply's
      picture and the file's number; the night's bill a red arrow down and the battery; nobody living there one dim head;
   J  THE JOB BOARD: every job's pay is the battery's picture and the number the row was written with; the jobs held are slabs, as many
      lit as he holds of as many as he can;
   S  THE STALL: what he has of every good is a sack and the row's own count; the shelf's count wears the tape;
   P  A PRICE OR A TIME IN A BUTTON (the barber's chair, the lot's search): the battery, the clock;
   N  NO COUNT LEFT IN WORDS: no shown text on those sheets still reads 'N batteries', 'N tape', 'YOU HAVE N', 'Held: N of M';
   T  THE WORDS ARE STILL IN THE PAGE: every line's text is letter for letter what the page wrote with the piece off;
   H  NOTHING GREW: no sheet is taller with it on (the speaker's own line left out: it changes with the visit), none runs past its box, every picture's file is in the tree and drawn at 11 px or more;
   E  nothing thrown.
   --plant: the piece switched off and judged as if on (B, J, S, P and N all turn red).
   Run: node gates/every_count_a_picture_gate.js [--plant] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
let pass = 0, fail = 0, QUIET = false;
const ok = (m, g, x) => { if (QUIET) return g; g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + String(x).slice(0, 420) + ']' : '')); return g; };
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg' };
const HB = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/home_base.json'), 'utf8'));
const HOME = { planted: true, at: [10, 10], day: 3, name: 'YOUR PLACE', offer: false, here: null, better: null, bill: { keep: 1, power: 1, people: 0, per: 2, waterMult: 1.5, eat: 0, back: 0, due: 2 }, prizes: [], residents: [], act: 1,
  story: [], builds: HB.builds, supplies: { food: 21, tape: 40, rounds: 80, meds: 30 }, workers: {}, morning: null, things: [], waiting: [], standing: 0, lotsOpen: 4, words: HB.words || {}, grade: { water: 1, power: 0, road: 2, danger: 2, district: 'suburb' }, opens: HB.opens };
function serve() {
  const srv = http.createServer((rq, rs) => { const u = decodeURIComponent(rq.url.split('?')[0]); const f = path.join(ROOT, u.replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}
/* in the page: what one sheet shows */
const READ = () => {
  const sh = document.getElementById('sheet'), sb = document.getElementById('sbody');
  const shown = el => { const r = el.getBoundingClientRect(); if (!(r.width > 1 && r.height > 1)) return false; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return true; };
  /* the shown words outside a mouth: a count still said in words */
  const bare = [], w = document.createTreeWalker(sh, NodeFilter.SHOW_TEXT); let t;
  while ((t = w.nextNode())) { const p = t.parentElement; if (!p || p.closest('#sbody p, .say, .who') || p.matches('.stl') || !shown(p) || parseFloat(getComputedStyle(p).fontSize) < 1) continue;   /* never a mouth's line; never a good's own name ('a stack of tape, 20 rolls') */
    const m = t.nodeValue.match(/[+\-]?\d+ (batter(y|ies)|tape|rolls|food|meds|rounds|water)\b|YOU HAVE \d+|Held: \d+ of \d+|\d+ OF \d+ PLACES?|Lots: \d+ of \d+/i); if (m) bare.push(m[0]); }
  const chip = c => { const pics = [...c.querySelectorAll(':scope > i.uc-i')].map(i => { const cs = getComputedStyle(i), r = i.getBoundingClientRect(); return { cls: i.className.replace('uc-i ', ''), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, bg: (cs.backgroundImage.match(/url\("?([^")]+)/) || [])[1] || '', mask: /url/.test(cs.webkitMaskImage || cs.maskImage || ''), dim: +cs.opacity < 0.6 }; });
    const b = c.querySelector(':scope > b'); return { k: c.dataset.uc, n: c.dataset.n, of: c.dataset.of, up: c.classList.contains('up'), dn: c.classList.contains('dn'), num: b ? b.textContent : null, numPx: b ? parseFloat(getComputedStyle(b).fontSize) : null, pics, row: Math.round(c.getBoundingClientRect().height) }; };
  const lines = [...sh.querySelectorAll('.act > em, .hcost > span, .hdesk > div, .slots, .stl > small, .acts > .gridh')].filter(shown).map(e => ({ sel: e.matches('.hcost > span') ? 'hcost' : e.matches('.hdesk > div') ? 'desk' : e.matches('.stl > small') ? 'have' : e.matches('.slots') ? 'slots' : e.matches('.gridh') ? 'gridh' : 'em',
    text: e.textContent, build: (e.closest('[data-build]') || {}).dataset ? e.closest('[data-build]').dataset.build : null, good: e.closest('.stline') ? e.closest('.stline').dataset.have : null, chips: [...e.querySelectorAll('.uc')].map(chip) }));
  const r = sh.getBoundingClientRect();
  const who = sb.querySelector(':scope > .who'), wr = who ? who.getBoundingClientRect().height : 0;   /* the mouth's own line is not this piece's (it says a different thing on a different visit) */
  return { open: BohemiaSettlement.state.open, cls: sh.className, h: Math.round(r.height - wr), over: Math.max(sh.scrollHeight - sh.clientHeight, sb.scrollHeight - sb.clientHeight), bare, lines, held: (BohemiaSettlement.state.held || []).length };
};
const SHEETS = [['board', false], ['stall', false], ['barber', false], ['lot', false], ['build', true]];   /* his place last: once the map has said a place is his, this page keeps it his */
async function walk(b, vp, off) {
  const srv = await serve(), port = srv.address().port;
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: true, isMobile: true }), p = await ctx.newPage(), errs = [], out = { errs };
  p.on('pageerror', e => errs.push(e.message));
  if (off) await ctx.addInitScript({ content: 'window.__UC_OFF = true;' });
  try {
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
    await p.addScriptTag({ url: 'bohemia_ui_materials.js' }); await p.addScriptTag({ url: 'bohemia_ui_no_scroll.js' });
    for (const [bld, home] of SHEETS) {
      await p.evaluate(t => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); BohemiaSettlement.open({ place: { name: 'BLUE DIAMOND', tier: t }, traits: [], day: 3, batteries: 3000 }); }, home ? 'camp' : 'town');
      await p.waitForTimeout(700);
      if (home) { await p.evaluate(h => window.postMessage({ type: 'BOHEMIA_HOME', home: h, plan: null }, '*'), HOME); await p.waitForTimeout(500); }
      let hx = await p.evaluate(k => BohemiaSettlement.where(k), bld); if (!hx) { out[bld] = { err: 'no ' + bld + ' on this town' }; continue; }
      /* RE-AIMED (UI FOUR 11/18): his place is seen through its cameras since HOME BASE's 11/17zr, and a building can stand outside the
         camera it opens on (upright, BUILD is off CAM 1's frame). The cameras are pressed one at a time, as he would, until it is on the glass */
      let cam = null; const onGlass = h => !!h && h.x >= 0 && h.y >= 0 && h.x <= vp.width && h.y <= vp.height;
      if (home && !onGlass(hx)) { const cams = await p.evaluate(() => [...document.querySelectorAll('button, [role=button]')].filter(x => /^CAM \d/.test(x.textContent.trim()) && x.getBoundingClientRect().width > 2).map(x => { const r = x.getBoundingClientRect(); return { t: x.textContent.trim(), x: r.left + r.width / 2, y: r.top + r.height / 2 }; }));
        for (const c of cams) { await p.touchscreen.tap(c.x, c.y); await p.waitForTimeout(1200); hx = await p.evaluate(k => BohemiaSettlement.where(k), bld); if (onGlass(hx)) { cam = c.t; break; } }
        if (!onGlass(hx)) { out[bld] = { err: 'no camera of his place shows its ' + bld }; continue; } }
      await p.touchscreen.tap(hx.x, hx.y); await p.waitForTimeout(2600);
      out[bld] = await p.evaluate(READ); out[bld].cam = cam;
      if (out[bld].open !== bld) out[bld].err = 'the tap opened ' + out[bld].open;
    }
  } catch (e) { out.err = e && e.message; }
  await ctx.close(); srv.close(); return out;
}
const fileOf = u => { const m = String(u).match(/\/slices\/(.+)$/); return m ? path.join(ROOT, 'slices', m[1]) : null; };
function judge(name, on, off) {
  const L = (o, k, sel) => ((o[k] || {}).lines || []).filter(l => l.sel === sel), bad = [];
  /* B the build sheet */
  const builds = HB.builds, rows = L(on, 'build', 'hcost'), ids = Object.keys(builds).filter(k => k[0] !== '_' && builds[k] && typeof builds[k] === 'object');
  let nB = 0; const wrongB = [];
  ids.forEach(id => { const r = builds[id], mine = rows.filter(l => l.build === id); if (!mine.length) return; nB++;
    const chips = mine.reduce((a, l) => a.concat(l.chips), []), need = [['batteries', 1, false]];
    Object.keys(r.cost || {}).forEach(g => need.push([g === 'medicine' ? 'meds' : g, r.cost[g] | 0, false])); Object.keys(r.gives || {}).forEach(g => need.push([g === 'medicine' ? 'meds' : g, r.gives[g] | 0, true]));
    need.forEach(n => { if (!chips.some(c => c.k === n[0] && +c.n === n[1] && c.up === n[2] && c.num === String(n[1]) && c.pics.some(x => /supply_icons\/small\//.test(x.bg)) && (!n[2] || c.pics.some(x => /uc-a/.test(x.cls))))) wrongB.push(id + ' ' + (n[2] ? '+' : '') + n[1] + ' ' + n[0]); }); });
  const desk = L(on, 'build', 'desk'), night = desk.reduce((a, l) => a.concat(l.chips), []).filter(c => c.k === 'batteries' && c.dn && +c.n === HOME.bill.due), heads = desk.reduce((a, l) => a.concat(l.chips), []).filter(c => c.k === 'heads');
  ok(name + ' B THE BUILD SHEET AT HIS PLACE' + ((on.build || {}).cam ? ' (BUILD is off the camera his place opens on: reached on ' + on.build.cam + ')' : '') + ': ' + nB + ' builds, every cost the battery and the goods with the file\'s numbers, every gain a green arrow up; the night a red arrow down and ' + HOME.bill.due + '; nobody living there one dim head',
    !(on.build || {}).err && nB >= 6 && !wrongB.length && night.length === 1 && heads.length === 1 && heads[0].pics.length === 1 && heads[0].pics[0].dim, (on.build || {}).err || wrongB.slice(0, 4).join('; ') || ('night ' + night.length + ' heads ' + heads.length));
  /* J the board */
  const jobs = L(on, 'board', 'em'), jobsOff = L(off, 'board', 'em'), payOf = t => (String(t).match(/(\d+) batter/) || [])[1];
  const jbad = jobs.filter((l, i) => { const want = payOf(jobsOff[i] ? jobsOff[i].text : l.text); return !l.chips.some(c => c.k === 'batteries' && c.n === want && c.num === want && c.pics.some(x => /batteries\.png/.test(x.bg))); });
  const pips = L(on, 'board', 'slots').reduce((a, l) => a.concat(l.chips), []).filter(c => c.k === 'pips'), pp = pips[0];
  ok(name + ' J THE JOB BOARD: ' + jobs.length + ' jobs, each pay the battery and its number (' + jobs.map(l => (l.chips[0] || {}).n).join(', ') + '); the jobs held ' + (pp ? pp.pics.filter(x => !x.dim).length + ' lit of ' + pp.pics.length + ' slabs' : 'no slabs'),
    !(on.board || {}).err && jobs.length >= 1 && !jbad.length && !!pp && pp.pics.length === +pp.of && pp.pics.filter(x => !x.dim).length === +pp.n && +pp.n === on.board.held, (on.board || {}).err || jbad.map(l => l.text).join('; '));
  /* S the stall */
  const have = L(on, 'stall', 'have'), hbad = have.filter(l => !l.chips.some(c => c.k === 'have' && c.n === String(l.good) && c.num === String(l.good) && c.pics.some(x => x.mask)));
  const shelf = L(on, 'stall', 'slots').reduce((a, l) => a.concat(l.chips), []).filter(c => c.k === 'tape');
  ok(name + ' S THE STALL: ' + have.length + ' goods, what he has of each a sack and the row\'s own count; the shelf\'s count wears the tape (' + (shelf[0] ? shelf[0].n : 'none') + ')', !(on.stall || {}).err && have.length >= 4 && !hbad.length && shelf.length === 1, (on.stall || {}).err || hbad.map(l => l.text).join('; '));
  /* P a price, a time */
  const chair = L(on, 'barber', 'em').reduce((a, l) => a.concat(l.chips), []), lot = L(on, 'lot', 'em').reduce((a, l) => a.concat(l.chips), []);
  ok(name + ' P A PRICE OR A TIME IN A BUTTON: the barber\'s chair the battery and ' + (chair[0] ? chair[0].n : '?') + ', the lot\'s search the clock', chair.some(c => c.k === 'batteries' && c.n === '1') && lot.some(c => c.k === 'time' && c.pics.some(x => x.mask)), JSON.stringify([(on.barber || {}).err, (on.lot || {}).err]));
  /* N nothing left in words */
  const left = [], was = []; SHEETS.forEach(([k]) => { ((on[k] || {}).bare || []).forEach(x => left.push(k + ': ' + x)); ((off[k] || {}).bare || []).forEach(x => was.push(k + ': ' + x)); });
  ok(name + ' N NO COUNT LEFT IN WORDS on the five sheets (' + was.length + ' with the piece off, ' + left.length + ' with it on)', !left.length && was.length >= 12, left.slice(0, 4).join('; ') || ('only ' + was.length + ' with it off'));
  /* T the words stay */
  const diff = []; SHEETS.forEach(([k]) => { const a = ((on[k] || {}).lines || []).map(l => l.text), z = ((off[k] || {}).lines || []).map(l => l.text); if (a.length !== z.length) diff.push(k + ': ' + a.length + ' lines, ' + z.length + ' off'); else a.forEach((t, i) => { if (t !== z[i]) diff.push(k + ': "' + t.slice(0, 40) + '" was "' + z[i].slice(0, 40) + '"'); }); });
  ok(name + ' T THE WORDS ARE STILL IN THE PAGE: every line\'s text is letter for letter what the page wrote', !diff.length, diff.slice(0, 3).join('; '));
  /* H nothing grew, every picture real and big enough */
  const grew = [], small = [], gone = []; let nPic = 0;
  SHEETS.forEach(([k]) => { const a = on[k] || {}, z = off[k] || {}; if (a.h > z.h + 1) grew.push(k + ' ' + z.h + ' -> ' + a.h); if (a.over > 1 && a.over > (z.over || 0)) grew.push(k + ' runs ' + a.over + ' past its box');
    (a.lines || []).forEach(l => l.chips.forEach(c => { c.pics.forEach(x => { nPic++; if (Math.min(x.w, x.h) < (/uc-a|uc-pip/.test(x.cls) ? 7.5 : 10.5)) small.push(k + ' ' + c.k + ' ' + x.w + 'x' + x.h); const f = fileOf(x.bg); if (f && !fs.existsSync(f)) gone.push(x.bg); if (!x.bg && !x.mask && !/uc-a/.test(x.cls)) gone.push(k + ' ' + c.k + ' no picture'); });
      if (c.numPx != null && c.numPx < 9.5) small.push(k + ' ' + c.k + ' number ' + c.numPx + ' px'); })); });
  ok(name + ' H NOTHING GREW: no sheet taller or past its box with it on (' + SHEETS.map(([k]) => k + ' ' + (off[k] || {}).h + '>' + (on[k] || {}).h).join(', ') + '); ' + nPic + ' pictures, each in the tree and 11 px or more (an arrow, a slab 8)', !grew.length && !small.length && !gone.length && nPic >= 30, grew.concat(small, gone).slice(0, 4).join('; '));
}
(async () => {
  console.log('EVERY COUNT A PICTURE (asks 145, 146; rules 223, 224, 441)');
  const b = await chromium.launch(), errs = [];
  for (const [name, vp] of [['upright', { width: 390, height: 844 }], ['sideways', { width: 844, height: 390 }]]) {
    const on = await walk(b, vp, false), off = await walk(b, vp, true); errs.push(...on.errs, ...off.errs);
    if (on.err || off.err) { ok(name + ' the town screen opened', false, on.err || off.err); continue; }
    judge(name, on, off);
    if (process.argv.includes('--plant') && name === 'upright') { const p0 = pass, f0 = fail; QUIET = false; console.log('  -- PLANT: the piece switched off, judged as if on'); const before = fail; judge('PLANT', off, off); const reds = fail - before; pass = p0; fail = f0; ok('PLANT the piece off turns B, J, S, P and N red (' + reds + ' of 5)', reds >= 5); }
  }
  ok('E nothing thrown', !errs.filter(e => !/ResizeObserver/.test(e)).length, errs.slice(0, 2).join(' | '));
  await b.close();
  console.log('EVERY COUNT A PICTURE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

/* THE CREW SCREEN AT FOURTEEN (RUN TWO [the crew screen at fourteen], 10/18/26).
   His 10/18: 'when you got one person... three... six... up to 14 people'; rule 117 minimalist. END STATE: the crew screen
   with 1, 6 and 14 men, each with his fresh portrait (rule 115(h)), his hurt and his gear readable without scrolling
   sideways, on a phone upright and on a laptop. No browser defaults; fresh portraits only.
     THE PHONE   390 x 844 at 3x: nothing on the page is wider than the glass at 1, 6 and 14 men (the line stands up: nine
                 44-point cells cannot sit across 390); every man in the line and the laid-up strip is a fresh face fully on
                 the glass with his whole name beside it; a laid-up man shows his name AND his days; every man's four gear
                 slots are on the glass and thumb-sized; a man dragged from FRONT to BACK still moves
     THE LAPTOP  1440 x 900: the same, and it reads in one look: two columns, the man's card at the top beside the men, the
                 bag's slots a person's size (44 to 64), all fourteen rows and the card and the bag inside 1.3 screens
     CONTROL     the screen as it stood before this row (BEFORE_SHA, from git) runs off the phone's glass at six men
   RE-AIMED UI 10/25 ([the company screen, Battle Brothers simple], rule 172: 'you're over complicating it'): the line no longer
   stands up; it is the roster strip, nine places a row, every man a 44-point face and an EMPTY place narrower, so it sits
   across 390 with nothing off the glass; a laid-up man's days sit on his face; his slots are Battle Brothers' six around
   him and his two bag slots; on the laptop Battle Brothers' shape (him at the top left, the stash beside him, the line along
   the bottom, one screen). THE CONTROL was a git object a shallow clone does not hold (red on main for that alone); it is
   now a PLANTED line of nine fixed 46-point places, which must run off the phone's glass.
   Run: node gates/the_crew_screen_at_fourteen_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname), PORT = 8899, BEFORE_SHA = '2c89a244';
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const OLD = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ROSTER_SCREEN.html'), 'utf8').replace('.cell.full{flex:0 1 var(--cw)', '.cell.full{flex:0 0 var(--cw)').replace('.cell:not(.full){flex:1 1 14px', '.cell:not(.full){flex:0 0 var(--cw)');   /* PLANTED: nine fixed places a row */
let old = false;
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (old && u === '/slices/BOHEMIA_ROSTER_SCREEN.html') { rs.setHeader('content-type', 'text/html'); return rs.end(OLD); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
/* a company of n: the starting crew's men and gear, named, two of them laid up (12 of 30 days) once there are four */
const COMPANY = n => {
  const C = window.BohemiaRoster, base = C.startingCrew();
  const names = ['YOU', 'Reyna', 'Tavo', 'Lupe', 'Raul', 'Nene', 'Coco', 'Teo', 'Marisol', 'Pancho', 'Inez', 'Beto', 'Chuy', 'Dora'];
  const crew = [];
  for (let i = 0; i < n; i++) { const d = base[i % base.length]; const m = C.manOf({ name: names[i], background: d.bgId, main: i === 0, jobs: [] }, i);
    m.gear = JSON.parse(JSON.stringify(d.gear)); if (i === 3 || i === 9) { m.hurt = { days: 12, of: 30 }; m.mark = { id: 'x', name: 'Broken Hand' }; } crew.push(m); }
  ['bohemia.formation.v1', 'bohemia.climb.v1', 'bohemia.hired.v1'].forEach(k => localStorage.removeItem(k));
  BohemiaRosterScreen.open({ crew, bag: [] });
  return crew.length;
};
const READ = () => {
  const W = document.documentElement.clientWidth, H = window.innerHeight, on = r => r.left >= -1 && r.right <= W + 1;
  const men = [...document.querySelectorAll('#front .cell.full, #back .cell.full, #hurt .cell')].map(c => {
    const f = c.querySelector('canvas'), b = c.querySelector('b'), d = c.querySelector('i.days'), r = f.getBoundingClientRect();
    return { face: f.dataset.face, on: on(r) && on(c.getBoundingClientRect()), w: Math.round(r.width), text: (b ? b.textContent : '') + (d ? ' ' + d.textContent : ''), whole: b ? b.scrollWidth <= b.clientWidth + 1 : false, hurt: c.classList.contains('laid') || c.classList.contains('wounded') };
  });
  /* ONE CREW SCREEN (rule 147(b), 10/24): the rows are gone; the slots are the picked man's four, on his page */
  const slots = [...document.querySelectorAll('#card .gslot')].map(e => e.getBoundingClientRect());
  const card = document.getElementById('card').getBoundingClientRect(), bag = [...document.querySelectorAll('#bag .slot')].map(e => e.getBoundingClientRect());
  const rows = [...document.querySelectorAll('#lines')].map(e => e.getBoundingClientRect()), st = document.getElementById('stash').getBoundingClientRect();
  return { W, H, docW: document.documentElement.scrollWidth, men, crew: BohemiaRosterScreen.state.crew.map(m => ({ name: m.name, laid: !!(m.hurt && m.hurt.days > 0) })),
    slotsOn: slots.every(r => on(r)), slotsBig: slots.every(r => r.width >= 44 && r.height >= 44), nSlots: slots.length,
    cardTop: Math.round(card.top + window.scrollY), cardLeft: Math.round(card.left), wearLeft: Math.round((rows[0] || card).left), cardRight: Math.round(card.right), stashLeft: Math.round(st.left), stashTop: Math.round(st.top + window.scrollY), lineTop: Math.round(((rows[0] || card).top) + window.scrollY),
    bagMin: Math.round(Math.min(...bag.map(r => r.width))), bagMax: Math.round(Math.max(...bag.map(r => r.width))),
    bottom: Math.round(Math.max(card.bottom, ...bag.map(r => r.bottom), ...rows.map(r => r.bottom)) + window.scrollY) };
};
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const errs = [];
  const page = async (vw, vh, phone) => {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: phone ? 3 : 1, isMobile: phone, hasTouch: phone });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
    await p.waitForTimeout(300); return { p, ctx };
  };
  /* THE PHONE */
  const { p, ctx } = await page(390, 844, true);
  for (const n of [1, 6, 14]) {
    await p.evaluate(COMPANY, n); await p.waitForTimeout(400);
    const r = await p.evaluate(READ);
    const living = r.crew.length, laidN = r.crew.filter(m => m.laid).length;
    ok('PHONE, ' + n + ' men: nothing on the page is wider than the glass', r.docW <= r.W, r.docW + ' of ' + r.W);
    ok('  every man in the line and the laid-up strip is a fresh face on the glass, 44 wide, his whole name beside it', r.men.length === living && r.men.every(m => m.face === 'fresh' && m.on && m.w >= 44 && m.whole)
       && r.crew.every(c => r.men.some(m => m.text.indexOf(c.name) >= 0)), r.men.length + ' of ' + living + (r.men.filter(m => !m.whole || !m.on).map(m => ' cut:' + m.text).join('')));
    /* RE-AIMED 10/26 (CAMP [struck down, he still fights], rule 234): nobody is laid up; a struck-down man stands in the line
       with his wound's days on his cell */
    ok('  a struck-down man shows his name and his wound\'s days, in the line', r.men.filter(m => m.hurt).length === laidN && r.men.filter(m => m.hurt).every(m => /\d+d$/.test(m.text) && /[A-Za-z]{3}/.test(m.text)), r.men.filter(m => m.hurt).map(m => m.text).join(', ') || 'none struck down');
    ok('  the picked man\'s six slots around him and his two bag slots are on the glass and thumb-sized', r.nSlots === 8 && r.slotsOn && r.slotsBig, r.nSlots + ' slots');
  }
  /* a man dragged from FRONT to BACK still moves, the line standing up */
  const mv = await p.evaluate(() => { const s = BohemiaRosterScreen.state; const i = s.front.findIndex(x => x != null), j = s.back.findIndex(x => x == null); return { i, j, man: s.front[i] }; });
  const box = async sel => p.evaluate(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  await p.evaluate(() => window.scrollTo(0, 0));
  const a = await box('#front .cell:nth-child(' + (mv.i + 1) + ')'), z = await box('#back .cell:nth-child(' + (mv.j + 1) + ')');
  await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(a.x + 12, a.y + 12, { steps: 3 }); await p.mouse.move(z.x, z.y, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(200);
  const moved = await p.evaluate(m => BohemiaRosterScreen.state.back.indexOf(m.man) === m.j, mv);
  ok('  a man dragged from FRONT to BACK still moves', moved, JSON.stringify(mv));
  await ctx.close();
  /* THE LAPTOP */
  const L = await page(1440, 900, false);
  for (const n of [1, 6, 14]) {
    await L.p.evaluate(COMPANY, n); await L.p.waitForTimeout(400);
    const r = await L.p.evaluate(READ);
    ok('LAPTOP, ' + n + ' men: nothing wider than the window, every face fresh and whole, every slot on screen', r.docW <= r.W && r.men.every(m => m.face === 'fresh' && m.on) && r.slotsOn && r.slotsBig, r.docW + ' of ' + r.W);
    ok('  Battle Brothers\' shape: him at the top, the stash beside him, the line along the bottom, the stash a person\'s size, all of it inside one screen', r.cardTop < 200 && r.stashLeft >= r.cardRight && Math.abs(r.stashTop - r.cardTop) < 60 && r.lineTop > r.cardTop + 300 && (r.bagMin >= 44 || !isFinite(r.bagMin)) && (r.bagMax <= 72 || !isFinite(r.bagMax)) && r.bottom <= r.H * 1.02,
       'card at ' + r.cardLeft + ',' + r.cardTop + ', stash at ' + r.stashLeft + ', line at ' + r.lineTop + ', bag ' + r.bagMin + '-' + r.bagMax + ', bottom ' + r.bottom + ' of ' + r.H);
  }
  await L.ctx.close();
  /* CONTROL */
  old = true;
  const O = await page(390, 844, true);
  await O.p.evaluate(COMPANY, 6); await O.p.waitForTimeout(400);
  const ro = await O.p.evaluate(READ);
  ok('CONTROL: a PLANTED line of nine fixed places runs off the phone\'s glass at six men', ro.docW > ro.W, ro.docW + ' of ' + ro.W);
  await O.ctx.close(); old = false;
  ok('no page errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE CREW SCREEN AT FOURTEEN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

/* THE TOWN AND THE HIRE GATE (RUN TWO, row [the ten changes: the town and the hire], 10/23/26; rule 133, TUNING's ten
   changes, records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md).
   Change 7, measured on the demo: '12 aimed taps found the barber, the doc, the stall, the smith... never the hiring post
   or the bar.' Change 9: 'CREW opens YOUR COMPANY 12 / 20 with twelve named men while the crew is 3.'
     H1  THE CREW SCREEN SHOWS YOUR CREW: opened through the one crew door under a shell whose origin built 3 men (and 1,
         a lone wolf), the screen shows exactly those men and his roster cap; with no shell it is the twelve as before
     H2  THE THREE DOORS THAT MATTER ARE LIT: on arrival the board, the post and the bar brighten on the beat from their own
         pixels (no words on the picture); a door he has opened in this place is lit no more, and stays so on his next visit
     (the first town's line, the elder saying where the work, the hands and a drink are, once: THE ARRIVAL gate measures it)
   Run: node gates/the_town_and_the_hire_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8874;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const HOST = (men, roster) => '<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="margin:0;background:#000">' +
  '<script>window.BOH_START = { picks: function () { return ' + JSON.stringify({ company: men, roster: roster, cap: 12 }) + '; } };</script>' +
  '<script src="/engine/bohemia_crew_door.js"></script><script>addEventListener("load", function () { BohemiaCrewDoor.open({ base: "/slices/" }); });</script>';
let host = '';
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (u === '/host.html') { rs.setHeader('content-type', 'text/html'); return rs.end(host); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const errs = [], missing = [];
  /* H1 */
  const crewOf = async (men) => {
    host = HOST(men, 20);
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:' + PORT + '/host.html', { waitUntil: 'load' });
    const fr = await (await p.waitForSelector('#crewdoor iframe')).contentFrame();
    await fr.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.crew.length > 0, null, { timeout: 30000 });
    await p.waitForTimeout(800);
    const r = await fr.evaluate(() => ({ n: BohemiaRosterScreen.state.crew.length, title: document.getElementById('title').textContent,
      bgs: BohemiaRosterScreen.state.crew.map(m => m.background) }));
    await ctx.close(); return r;
  };
  const three = await crewOf([{ background: 'companion_2hand', level: null }, { background: 'companion_1hand', level: null }, { background: 'companion_ranged', level: null }]);
  ok('H1 THE CREW SCREEN SHOWS YOUR CREW: an origin of three opens three, with his roster cap', three.n === 3 && /YOUR COMPANY\s+3 \/ 20/.test(three.title), three.title + ' (' + three.bgs.join(', ') + ')');
  const one = await crewOf([{ background: 'companion_2hand', level: 1 }]);
  ok('  a lone wolf opens one', one.n === 1, one.title);
  ok('  the men are the origin\'s backgrounds, as the fight fields them', three.bgs.map(b => String(b).toLowerCase().replace(/[^a-z0-9]/g, '')).join() === 'companion2hand,companion1hand,companionranged', three.bgs.join(', '));
  /* H2, H3 */
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  /* how much a door's own pixels change over a second, with the walkers held; minus the same with the glow held, so a keeper
     turning in front of his door is not counted as light */
  const glow = async (k) => (await varOf(k, true)) - (await varOf(k, false));
  const varOf = async (k, on) => p.evaluate(async ({ k, on }) => {
    BohemiaSettlement.walkers(false); BohemiaSettlement.still(true); BohemiaSettlement.glow(on); BohemiaSettlement.where(k);   /* the walkers and the idles held (10/24: the post's men idle since ANIMATION's round, and their breathing read as light): only the door's own light is read */ await new Promise(r => setTimeout(r, 150));
    const c = document.getElementById('cv'), x = c.getContext('2d'), cr = c.getBoundingClientRect(), dpr = c.width / c.clientWidth, pt = BohemiaSettlement.where(k);
    const grab = () => { const d = x.getImageData(Math.round((pt.x - cr.left - 20) * dpr), Math.round((pt.y - cr.top - 20) * dpr), Math.round(40 * dpr), Math.round(40 * dpr)).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; return s / (d.length / 4); };
    const a = []; for (let t = 0; t < 10; t++) { a.push(grab()); await new Promise(r => setTimeout(r, 100)); }
    BohemiaSettlement.walkers(true); BohemiaSettlement.glow(true);
    return Math.max(...a) - Math.min(...a);
  }, { k, on });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'LIT TOWN' }, traits: [], night: false })); await p.waitForTimeout(1200);
  const before = {}; for (const k of ['board', 'hall', 'bar', 'barber']) before[k] = await glow(k);
  ok('H2 THE THREE DOORS THAT MATTER ARE LIT: the board, the post and the bar brighten on the beat, the barber does not', before.board > 2 && before.hall > 2 && before.bar > 2 && before.barber < 1.5,
    Object.keys(before).map(k => k + ' ' + before[k].toFixed(1)).join(', '));
  /* open the post the way a tap does, then close it */
  const pt = await p.evaluate(() => BohemiaSettlement.where('hall'));   /* page points, the view panned to it */
  await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(600);
  const opened = await p.evaluate(() => BohemiaSettlement.state.open);
  await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); }); await p.waitForTimeout(300);
  const after = await glow('hall'), stillBoard = await glow('board');
  ok('  a door he opened is lit no more, the others still are', opened === 'hall' && after < 1.5 && stillBoard > 2, 'opened ' + opened + ', the post ' + after.toFixed(1) + ', the board ' + stillBoard.toFixed(1));
  await p.reload({ waitUntil: 'load' }); await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'LIT TOWN' }, traits: [], night: false })); await p.waitForTimeout(1200);
  const back = await glow('hall');
  ok('  and on his next visit it stays out (the place remembers)', back < 1.5, back.toFixed(1));
  ok('every file loads', missing.length === 0, missing.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE TOWN AND THE HIRE GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

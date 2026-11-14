// COOK FIVE 11/14/26, VAMILY rule 451(a), ask row 623: THE CEILINGS ON THE PAGE. The proof of
// records/BOHEMIA_COOK_FIVE_THE_CEILINGS_11_14_26.md. It changes nothing in the game: it opens the real fight page on a phone
// (390 x 844 and 844 x 390 at 2), asks for the real inside board by name, and shoots the GAME'S OWN ceiling draw (COMBAT
// THREE's __AN_INSIDE_SHOWS_ITS_CEILING__) three ways: off (UI.noCeiling, the page test's own switch), as the data file says
// (10%), and at 20% to compare (the board's alpha turned in memory for the shot; the game itself stops at 14%).
//   node tools/bohemia_the_ceilings_on_the_page_harness_11_14_26.js <outdir> garage|casino|tunnels [upright,sideways]
// writes <kit>_<upright|sideways>_a0.png, _a01.png, _a02.png, and prints what the board carries and whether the picture drew.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.woff2': 'font/woff2' };
const OPTS = { garage: { district: 'casino', cell: [40, 40], seed: 21, speed: 1, inside: 'garage', casinoPower: true },
  casino: { district: 'casino', cell: [40, 40], seed: 21, speed: 1, inside: 'casino', casinoPower: true },
  tunnels: { district: 'wash', cell: [40, 40], seed: 21, speed: 1, inside: 'tunnels', tunnelsAsk: { layout: 'the_main_and_its_drains', flip: [false, false] } } };
(async () => {
  const out = process.argv[2], kit = process.argv[3], shapes = (process.argv[4] || 'upright,sideways').split(',');
  fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);
  const { chromium } = require('playwright'); const br = await chromium.launch(); const errs = [];
  for (const shape of [['upright', 390, 844], ['sideways', 844, 390]].filter(s => shapes.indexOf(s[0]) >= 0)) {
    const ctx = await br.newContext({ viewport: { width: shape[1], height: shape[2] }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e && e.message || e)));
    await p.addInitScript(o => { window.FIGHT_OPTS = o; try { localStorage.clear(); } catch (e) {} }, OPTS[kit]);
    await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
    await p.waitForFunction(() => { try { return !!eval('FIGHT').S.boardDef && document.getElementById('load').style.display === 'none'; } catch (e) { return false; } }, null, { timeout: 180000 });
    await p.waitForTimeout(3000);
    const info = await p.evaluate(() => { const S = eval('FIGHT').S, B = S.boardDef, U = eval('UI'); return { board: B.name, ceiling: B.ceiling, drew: U.ceilOn, tilePoints: Math.round(U.tw * U.zoom) }; });
    console.log(shape[0], JSON.stringify(info));
    const shot = async (tag, set) => { await p.evaluate(set); await p.waitForTimeout(600); await p.screenshot({ path: path.join(out, kit + '_' + shape[0] + '_' + tag + '.png') }); };
    await shot('a0', () => { eval('UI').noCeiling = true; });
    await shot('a01', () => { eval('UI').noCeiling = false; });
    await shot('a02', () => { eval('FIGHT').S.boardDef.ceiling.alpha = 0.2; });
    await ctx.close();
  }
  await br.close(); srv.close(); console.log('errors', errs.length, errs.slice(0, 3));
})();

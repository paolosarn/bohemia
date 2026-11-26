#!/usr/bin/env node
/* BOHEMIA -- COMBAT FOUR [every board holds its frames] (11/26/26), COOK SIX's frame walk (tools/bohemia_cook6_the_insides_hold_their_frames_11_26_26.js)
   widened to EVERY board this lane lays: all forty big insides (the district and the first layout read from each inside's own data) and four plain
   grounds, and AUTO played to the fight's own end (S.over, at most C4_AUTO_MS, default 12 s) with the brain's own think times (UI.thinks).
   node tools/bohemia_combat_four_every_board_frames_11_26_26.js <outdir> [inside,inside,...] [--rate 4]
   ---- COOK SIX's header, as it was: ----
   COOK SIX [the insides hold their frames] (11/26/26; VAMILY rule 480(c): 'no art costs frames: images sized to what the phone
   draws, packed, decoded before they are needed, nothing that stalls a screen when it first appears'; 480(d)'s numbers: a hitch is a frame
   past 50 ms, a screen fails under 55 frames a second, on 390 x 844 with the CPU slowed four times).

   Plays every big inside this lane drew (COOK FIVE's and COOK SIX's art) on the real fight page (slices/BOHEMIA_FIGHT.html, the one the
   demo and the alpha open), a phone upright, the CPU slowed four times, and times every frame from the page's first to:
     LOAD   the loading screen up to the board's first drawn frame
     OPEN   the first three seconds of the board as he meets it (the lineup)
     PAN    the camera swept close in across the board and back out (a pinch and a drag: every picture comes on screen at its biggest)
     AUTO   six seconds of the fight on AUTO
   and names every frame past 50 ms with what the page was fetching or decoding when it came.

   node tools/bohemia_cook6_the_insides_hold_their_frames_11_26_26.js <outdir> [inside,inside,...] [--rate 4]
*/
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.css': 'text/css', '.mp3': 'audio/mpeg', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };
const INSIDES = (function () { const o = {}, ix = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/insides.json'), 'utf8')).insides;
  ix.forEach(id => { const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground', id, id + '.json'), 'utf8')); o[id] = [(d.districts || [])[0], Object.keys((d.board && d.board.templates) || {})[0] || null]; });
  ['downtown', 'suburb', 'desert', 'industrial'].forEach(g => { o['street_' + g] = [g, null]; }); return o; })();

(async () => {
  const out = process.argv[2]; const which = (process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3].split(',') : Object.keys(INSIDES));
  const rate = process.argv.indexOf('--rate') > 0 ? +process.argv[process.argv.indexOf('--rate') + 1] : 4;
  const night = process.argv.indexOf('--day') > 0 ? false : (process.argv.indexOf('--night') > 0 ? true : undefined);   // (--day / --night: the fight's own hour otherwise)
  fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);
  const { chromium } = require('playwright'); const br = await chromium.launch(); const all = {};
  for (const inside of which) {
    const [district, layout] = INSIDES[inside];
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e && e.message || e)));
    const fetched = []; p.on('requestfinished', rq => { const u = rq.url(); if (/fight_ground/.test(u)) fetched.push([Date.now(), u.split('/slices/')[1]]); });
    await p.addInitScript(o => {
      window.FIGHT_OPTS = o; try { localStorage.clear(); } catch (e) {} if (o.__before) { window.__GROUND_ON_GLASS = true; window.__SHEET_ON_GLASS = true; }   /* C4_BEFORE=1: the ground and the sheets decoded on the glass, as before 11/26 */
      window.__F = []; window.__PH = 'LOAD'; const tick = t => { window.__F.push([t, window.__PH]); requestAnimationFrame(tick); }; requestAnimationFrame(tick);
    }, Object.assign(layout ? { district, cell: [40, 40], seed: 21, speed: 1, inside, insideAsk: { layout, flip: [false, false] } } : { district, cell: [40, 40], seed: 21, speed: 1 }, night === undefined ? {} : { night }, process.env.C4_BEFORE ? { __before: true } : {}));
    const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    const t0 = Date.now();
    await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
    await p.waitForFunction(() => { try { return !!eval('FIGHT').S.boardDef && document.getElementById('load').style.display === 'none'; } catch (e) { return false; } }, null, { timeout: 300000, polling: 200 });
    await p.evaluate(() => { window.__PH = 'OPEN'; }); await p.waitForTimeout(3000);
    await p.evaluate(() => { window.__PH = 'PAN'; });
    await p.evaluate(async () => {                                       // close in, then across the board in steps, then back out
      const U = eval('UI'), S = eval('FIGHT').S, B = S.boardDef; const W = (B.w || B.W || 20), H = (B.h || B.H || 15); eval('camMine')();
      const wait = ms => new Promise(r => setTimeout(r, ms)); U.zoom = U.near;
      for (let k = 0; k <= 16; k++) { const f = k / 16; U.cx = (1 + f * (W - 2)) * U.tw; U.cy = (1 + (k % 4) / 3 * (H - 2)) * U.th; eval('clampCam')(); await wait(120); }
      for (let k = 0; k <= 8; k++) { U.zoom = U.near + (U.far - U.near) * k / 8; eval('clampCam')(); await wait(80); }
    });
    await p.evaluate(() => { window.__PH = 'AUTO'; try { const F = eval('FIGHT'), U = eval('UI'); U.auto = true; if (F.S.deploy && F.startFight) F.startFight(); else F.S.deploy = false; } catch (e) {} });   /* COMBAT FOUR: AUTO on and the bell rung (the lineup over), so AUTO really fights */
    { const T0 = Date.now(), cap = +(process.env.C4_AUTO_MS || 12000); while (Date.now() - T0 < cap) { if (await p.evaluate(() => { try { return !!eval('FIGHT').S.over; } catch (e) { return false; } })) break; await p.waitForTimeout(500); } }
    const thinks = await p.evaluate(() => { try { const t = (eval('UI').thinks || []).slice().sort((a, b) => a - b); return { n: t.length, p50: Math.round(t[t.length >> 1] || 0), max: Math.round(t[t.length - 1] || 0), over50: t.filter(x => x > 50).length }; } catch (e) { return null; } });
    const F = await p.evaluate(() => window.__F);
    const res = {}; let prev = null;
    for (const [t, ph] of F) { if (prev !== null) { const d = t - prev; const r = res[ph] || (res[ph] = { frames: 0, ms: 0, worst: 0, hitches: 0, list: [] }); r.frames++; r.ms += d; r.worst = Math.max(r.worst, d); if (d > 50) { r.hitches++; if (r.list.length < 6) r.list.push(Math.round(d)); } } prev = t; }
    for (const ph in res) { const r = res[ph]; r.fps = Math.round(1000 * r.frames / r.ms * 10) / 10; r.worst = Math.round(r.worst); r.ms = Math.round(r.ms); }
    const imgs = await p.evaluate(() => { const o = {}; try { (performance.getEntriesByType('resource') || []).forEach(e => { if (/fight_ground\/[a-z]+\//.test(e.name)) o[e.name.split('/slices/')[1]] = Math.round(e.duration); }); } catch (e) {} return o; });
    all[inside] = { layout, thinks, night: await p.evaluate(() => !!eval('FIGHT').S.night), phases: res, errors: errs.slice(0, 3), images: Object.keys(imgs).length };
    const line = Object.entries(res).map(([ph, r]) => ph + ' ' + r.fps + ' fps, worst ' + r.worst + ' ms, ' + r.hitches + ' past 50' + (r.list.length ? ' [' + r.list.join(' ') + ']' : '')).join(' | ');
    console.log(inside.padEnd(17), (all[inside].night ? 'NIGHT ' : 'DAY   ') + line, thinks ? '| thinks ' + thinks.n + ', p50 ' + thinks.p50 + ', max ' + thinks.max + ' ms, ' + thinks.over50 + ' past 50' : '', errs.length ? ' ERR ' + errs[0].slice(0, 80) : '');
    await ctx.close();
  }
  fs.writeFileSync(path.join(out, 'frames.json'), JSON.stringify({ rate, viewport: [390, 844], insides: all }, null, 1));
  await br.close(); srv.close();
})();

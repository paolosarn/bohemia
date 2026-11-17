#!/usr/bin/env node
/* A SHEET IS READ ONCE (PLUMBER 8, 11/17/26; rule 441(c), ask rows 613 and 620: the freezes entering a fight).
   MEASURED (the demo, phone upright, CPU 4x, the canvas on a GPU process, a CPU profile of a fight's start after 30 s on the map, same
   probe before and after): the map dives in and draws his company close, and the head under each new frame was found by reading that
   frame off its sheet, each read unpacking the WHOLE sheet again (map_town.webp 2048 x 1502, a fight sheet 3600 x 1288): 10 to 21 reads
   from 5 sheets, getImageData 2.5 s and createImageBitmap 2.0 s of a 13 s start. __A_SHEET_IS_READ_ONCE__ (engine/bohemia_wear.js):
   a sheet's see-through pixels are read once into a one-bit mask kept on the top page for the session, and every frame is found on it.
   After: 9 of the map's reads came from 2 sheets read once in 0.3 s; getImageData 0.37 s and createImageBitmap 0.56 s of the start.
     M1 THE SAME ANSWER: on five of the game's sheets (the map's idles, the town mix, two fight sheets, a walk), 250 boxes each, the
        head found on the mask is the head found by reading the box off the sheet, every one
     M2 ONCE A SHEET: forty frames asked of one sheet read it once (one mask made, the rest found on it)
     M3 A CANVAS IS READ AS BEFORE: a frame drawn on a canvas (no file) is read off the canvas, no mask made
     P1 PLANTED: the old way (BohemiaWear.cellReads) makes no mask: forty frames are forty reads of the sheet (M2 red)
   node gates/a_sheet_is_read_once_gate.js   (about 30 s) */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };
let chromium = null; try { ({ chromium } = require('playwright')); } catch (e) {}
const SHEETS = ['/slices/rig_idles/map_town.webp', '/slices/rig_mix/town.png', '/slices/fight_rig/you.webp', '/slices/fight_rig/person_town_0.webp', '/slices/rig_walk/person_town_0.png'];

(async () => {
  console.log('\nA SHEET IS READ ONCE (ask rows 613, 620)\n');
  if (!chromium) { ok('a browser on this box', false); return done(); }
  const srv = http.createServer((q, r) => { const rel = decodeURIComponent(q.url.split('?')[0]);
    if (rel === '/t.html') { r.writeHead(200, { 'Content-Type': 'text/html' }); return r.end('<!doctype html><script>window.BOHEMIA_WEAR_BASE="/slices/wear/";window.BOHEMIA_WEAR_DATA="/records/target/bb/armour_looks.json";</script><script src="/engine/bohemia_wear.js"></script>'); }
    const f = path.join(ROOT, rel); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': /webp$/.test(f) ? 'image/webp' : /png$/.test(f) ? 'image/png' : /json$/.test(f) ? 'application/json' : 'text/javascript' }); r.end(fs.readFileSync(f)); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const port = srv.address().port;
  const b = await chromium.launch();
  try {
    const p = await b.newPage(); await p.goto('http://127.0.0.1:' + port + '/t.html');
    const R = await p.evaluate(async (sheets) => {
      const W = window.BohemiaWear, M = window.top.__WEAR_SHEET_MASKS; W.keepOff = true; W.syncAnchor = true; W.BUDGET = 1e9;
      const load = (u) => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = u + '?' + Math.random(); });
      const wait = () => new Promise(r => setTimeout(r, 20));   /* one new sheet a frame: the next is a frame later */
      let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const m1 = [];
      for (const u of sheets) {
        const a = await load(u), b2 = await load(u); if (!a || !b2) { m1.push({ u, err: 'did not load' }); continue; }
        let same = 0, diff = 0, found = 0;
        for (let n = 0; n < 250; n++) {
          const w = 64 + Math.floor(rnd() * 64), h = 80 + Math.floor(rnd() * 60), x = Math.floor(rnd() * (a.naturalWidth - w)), y = Math.floor(rnd() * (a.naturalHeight - h));
          W.cellReads = true; const r1 = W.anchor(a, x, y, w, h, 25);
          W.cellReads = false; let r2 = W.anchor(b2, x, y, w, h, 25); if (r2 === undefined) { await wait(); r2 = W.anchor(b2, x, y, w, h, 25); }
          if (JSON.stringify(r1) === JSON.stringify(r2)) same++; else diff++; if (r2) found++;
        }
        m1.push({ u: u.split('/').slice(-2).join('/'), same, diff, found });
      }
      /* M2: forty frames of one fresh sheet */
      await wait(); const made0 = M.made, c = await load(sheets[3]); let got = 0;
      for (let n = 0; n < 40; n++) { let r = W.anchor(c, 112 * (n % 30), 161 * (n % 8), 112, 161, 25); if (r === undefined) { await wait(); r = W.anchor(c, 112 * (n % 30), 161 * (n % 8), 112, 161, 25); } if (r !== undefined) got++; }
      const m2 = { masks: M.made - made0, answered: got };
      /* M3: a canvas */
      await wait(); const cv = document.createElement('canvas'); cv.width = 120; cv.height = 160; const g = cv.getContext('2d'); g.fillStyle = '#000'; g.fillRect(40, 10, 40, 140);
      const made1 = M.made, r3 = W.anchor(cv, 0, 0, 120, 160, 25), m3 = { masks: M.made - made1, found: !!r3 };
      /* P1: the old way */
      await wait(); W.cellReads = true; const made2 = M.made, d = await load(sheets[4]); for (let n = 0; n < 40; n++) W.anchor(d, 8 * n, 0, 112, 127, 25);
      const p1 = { masks: M.made - made2 }; W.cellReads = false;
      return { m1, m2, m3, p1 };
    }, SHEETS);
    const tot = R.m1.reduce((s, x) => s + (x.same || 0), 0), bad = R.m1.reduce((s, x) => s + (x.diff || 0) + (x.err ? 250 : 0), 0);
    ok('M1 THE SAME ANSWER: 250 boxes on each of five sheets, the mask\'s head the head read off the sheet, every one', tot === 1250 && bad === 0, R.m1.map(x => x.u + ' ' + (x.err || (x.same + '/' + (x.same + x.diff) + ', found ' + x.found))).join('; '));
    ok('M2 ONCE A SHEET: forty frames of one sheet, one mask made, all forty answered', R.m2.masks === 1 && R.m2.answered === 40, JSON.stringify(R.m2));
    ok('M3 A CANVAS IS READ AS BEFORE: no mask, the head found', R.m3.masks === 0 && R.m3.found, JSON.stringify(R.m3));
    ok('P1 PLANTED: the old way (BohemiaWear.cellReads) makes no mask, forty frames forty reads (M2 red)', R.p1.masks === 0, JSON.stringify(R.p1));
  } catch (e) { ok('the page ran', false, String(e && e.message || e).slice(0, 200)); }
  await b.close(); srv.close();
  return done();
  function done() { console.log('\nA SHEET IS READ ONCE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }
})();

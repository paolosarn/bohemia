#!/usr/bin/env node
/* THE FACE SHOWS UNDER THE HELMET (FIGHT SCREEN TWO 11/17/26; ask row 630, VAMILY rules 450(a), 441; the law EVERYBODY HAS A FACE).
   EYES, walking the builds on a phone: 'the man's sheet, the why line's face and the phone's fight panel draw the crew's portrait so the
   helmet fills two thirds of the frame: YOU and DESI show a nose and a mouth and no eyes; RAUL shows the helmet and nothing else.'
   MEASURED: PORTRAIT's cell is cut close to the head (his crown on the cell's first row) and the gear is stood on the middle of his
   head, so its dome is cut off by the frame and the rest lies over his eyes.
   THE LAW NOW: a face drawn with head gear shows his eyes, and the whole of the gear is inside the frame; a bare head is drawn as before.
   THE LEGS (the fight's own page; the three of the crew, every piece of head gear the wear file can draw):
     H1  HIS EYES READ: in the band his eyes are in, the picture with the gear on is the picture without it, to the pixel
     H2  THE GEAR IS STILL ON HIM: over the band the picture is not the bare one (the dome is drawn)
     H3  THE WHOLE OF IT IS IN THE FRAME: the gear does not touch the frame's first row (it was cut off by it)
     H4  A BARE HEAD IS AS IT WAS: with nothing on his head the portrait is the cell at the frame's full size
     H5  WHERE HE SEES IT: the fight's own face (the phone's card reads it), his sheet's face and the why line's face are that picture
     planted: this lane's file left out: the gear lies over his eyes again (H1 red)
   Run: node gates/the_face_shows_under_the_helmet_gate.js      (about thirty seconds) */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const done = () => { console.log('\nTHE FACE SHOWS UNDER THE HELMET: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
(async () => {
  let chromium = null; try { chromium = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })().chromium; } catch (e) {}
  if (!chromium) { check(false, 'H1', 'no browser on this box'); return done(); }
  const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
  let planted = false;
  const srv = http.createServer((q, r) => { const rel = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, rel);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    let body = fs.readFileSync(f); if (planted && /bohemia_fight_face\.js$/.test(rel)) body = Buffer.from('/* planted: left out */');
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }); r.end(body); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const port = srv.address().port;
  const b = await chromium.launch(), errs = [];
  const CO = [{ background: 'militia', level: 2, gear: { main: 'shortsword' } }, { name: 'DESI', background: 'militia', level: 3, gear: { main: 'shortsword' } }, { name: 'RAUL', background: 'militia', level: 2, gear: { main: 'shortsword' } }];
  const run = async () => { const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }), p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    await p.addInitScript(o => { window.FIGHT_OPTS = o; try { localStorage.clear(); } catch (e) {} }, { why: 'road:1', district: 'suburb', cell: { gx: 40, gy: 40 }, met: 5, company: CO, deploy: false, teach: false });
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_FIGHT.html');
    await p.waitForFunction(() => typeof UI !== 'undefined' && !!UI.board && !!UI.t0, null, { timeout: 45000 }); await p.waitForTimeout(2500);
    const out = await p.evaluate(async () => {
      const S = 156, mine = FIGHT.S.units.filter(u => u.side === 'you'), F = DB.rig.faces, img = UI.imgs['fight_rig/' + F.file];
      const heads = (DB.armor.head || []).filter(r => { try { const w = BohemiaWear.of({ headRow: r, bodyRow: null }); return !!(w && w.head); } catch (e) { return false; } });
      const C = () => { const c = document.createElement('canvas'); c.width = c.height = S; return c; }, px = c => c.getContext('2d').getImageData(0, 0, S, S).data;
      const diff = (a, b, y0, y1, x0, x1) => { let n = 0; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = (y * S + x) * 4; if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 24) n++; } return n; };
      const R = { faces: 0, pieces: heads.length, eyesHidden: [], noGear: [], cutByFrame: [], bare: [], framed: !!window.BohemiaFightFace, drew: 0 };
      /* the wear file's pictures are in before anything is judged */
      { const t = C(), v = mine[0], keep = v.headRow; v.headRow = heads[0]; for (let i = 0; i < 40; i++) { drawPortrait(t.getContext('2d'), v, S, true); await new Promise(r => setTimeout(r, 80)); const w = BohemiaWear.of(v); if (window.BohemiaFightFace ? BohemiaFightFace.n > 0 : i > 12) break; } v.headRow = keep; }
      const face0 = BohemiaWear.face;
      for (const v of mine) { const keep = v.headRow, fi = F.order.indexOf(v.look);
        /* H4: a bare head */
        v.headRow = null; const tb = C(); drawPortrait(tb.getContext('2d'), v, S, true); const ref = C(), rg = ref.getContext('2d'); rg.fillStyle = '#2b2620'; rg.fillRect(0, 0, S, S); rg.imageSmoothingEnabled = S < F.size; rg.drawImage(img, fi * F.size, 0, F.size, F.size, 0, 0, S, S);
        const band = Math.round(S * .13) + 2, fw = Math.round(S * .07) + 2; if (diff(px(tb), px(ref), fw, S - band, fw, S - fw) > 0) R.bare.push(v.name);
        for (const h of heads) { v.headRow = h; R.faces++;
          const A = C(); drawPortrait(A.getContext('2d'), v, S, true); const said = window.BohemiaFightFace ? BohemiaFightFace.said : null;
          /* the same frame with the gear's picture held back */
          BohemiaWear.face = function () { return true; }; const B = C(); drawPortrait(B.getContext('2d'), v, S, true); BohemiaWear.face = face0;
          const a = px(A), bb = px(B), e = said ? said.eyes : [S * .30, S * .52], x0 = said ? said.face[0] + 2 : fw, x1 = said ? said.face[0] + said.face[2] - 2 : S - fw;
          const y0 = Math.ceil(e[0]) + 1, y1 = Math.floor(e[1]) - 1;
          if (said) R.drew++;
          if (diff(a, bb, y0, y1, Math.round(x0), Math.round(x1)) > 0) R.eyesHidden.push(v.name + ' in ' + (h.name || h.id));
          if (diff(a, bb, fw, y0 - 2, fw, S - fw) < 20 && diff(a, bb, y1 + 2, S - band, fw, S - fw) < 20) R.noGear.push(v.name + ' in ' + (h.name || h.id));
          if (diff(a, bb, fw, fw + 1, fw, S - fw) > 0) R.cutByFrame.push(v.name + ' in ' + (h.name || h.id)); }
        v.headRow = keep; }
      /* H5: where he sees it */
      const v = mine[1] || mine[0], keep = v.headRow; v.headRow = heads[Math.min(1, heads.length - 1)]; UI.faceKey = null; UI.pend = null; try { hud(); } catch (e) {}
      const n0 = window.BohemiaFightFace ? BohemiaFightFace.n : 0; UI.sheetSig = null; UI.drawer = false; try { drawer(v); } catch (e) {} const n1 = window.BohemiaFightFace ? BohemiaFightFace.n : 0;
      R.sheet = n1 > n0 && !!document.querySelector('#drawer .sh-face'); const n2 = n1; UI.faceKey = null; try { drawPortrait(document.getElementById('face').getContext('2d'), v, document.getElementById('face').width); } catch (e) {} R.card = (window.BohemiaFightFace ? BohemiaFightFace.n : 0) > n2;
      const n3 = window.BohemiaFightFace ? BohemiaFightFace.n : 0; try { const cv = document.getElementById('whyface'); drawPortrait(cv.getContext('2d'), v, cv.width, true); } catch (e) {} R.why = (window.BohemiaFightFace ? BohemiaFightFace.n : 0) > n3; v.headRow = keep;
      return R; });
    await ctx.close(); return out; };
  try {
    const R = await run();
    check(R.framed && R.faces >= 30 && R.drew === R.faces && R.eyesHidden.length === 0, 'H1', 'his eyes read: ' + R.faces + ' faces (3 of the crew x ' + R.pieces + ' pieces of head gear), ' + R.eyesHidden.length + ' with anything over the band his eyes are in' + (R.eyesHidden.length ? ': ' + R.eyesHidden.slice(0, 4).join(', ') : ''));
    check(R.noGear.length === 0, 'H2', 'the gear is still on him: ' + R.noGear.length + ' of ' + R.faces + ' drawn with no gear at all' + (R.noGear.length ? ': ' + R.noGear.slice(0, 4).join(', ') : ''));
    check(R.cutByFrame.length <= Math.floor(R.faces * 0.1), 'H3', 'the whole of it is in the frame: ' + R.cutByFrame.length + ' of ' + R.faces + ' touch the frame\'s first row' + (R.cutByFrame.length ? ' (' + [...new Set(R.cutByFrame.map(x => x.split(' in ')[1]))].slice(0, 5).join(', ') + ')' : ''));
    check(R.bare.length === 0, 'H4', 'a bare head is as it was: ' + R.bare.length + ' of 3 differ from the cell at full size');
    check(R.sheet && R.card && R.why, 'H5', 'where he sees it: his sheet\'s face ' + (R.sheet ? 'is' : 'IS NOT') + ' that picture, the fight\'s card face (the phone reads it) ' + (R.card ? 'is' : 'IS NOT') + ', the why line\'s face ' + (R.why ? 'is' : 'IS NOT'));
    planted = true; const P = await run();
    check(!P.framed && P.eyesHidden.length > P.faces * 0.5, 'planted', 'this lane\'s file left out: ' + P.eyesHidden.length + ' of ' + P.faces + ' faces have the gear over his eyes again (H1 is red on it)');
    check(!errs.length, 'errors', errs.length + ' page errors' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
  } catch (e) { check(false, 'ran', String(e && e.stack || e).slice(0, 400)); }
  await b.close(); srv.close(); done();
})();

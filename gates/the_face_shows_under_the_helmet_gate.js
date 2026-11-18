#!/usr/bin/env node
/* THE FACE SHOWS UNDER THE HELMET (FIGHT SCREEN TWO 11/17/26, REBUILT 11/18/26; ask rows 630 and 648, VAMILY rules 450(a), 441; the
   law EVERYBODY HAS A FACE).
   ROW 630, EYES: 'the crew's portrait is all helmet: YOU and DESI show a nose and a mouth and no eyes; RAUL the helmet only.'
   ROW 648, EYES, on the first answer (a band opened in the gear over his eyes): 'THE FACE HAS A SEAM: the helmet is cut straight
   across above the eyes and its brim floats across the nose and mouth; RAUL is still a dome with a slit.'
   MEASURED: CHARACTER's portrait pieces are whole and right, drawn for a head taller than it is wide; PORTRAIT's cell is a head
   about as tall as it is wide, so a brim made for a tall head's brow lands on his eyes.
   THE LAW NOW: ONE HONEST HEAD. Nothing of the gear is ever cut. A hat (a piece that covers his eyes and ends above his mouth) is
   FITTED whole: its brim's lower edge on his brow, its crown a little over his own. A mask that begins at his eyes is moved down to
   begin under them. A closed helm or a full mask is a face of its own and an open piece (a coif, a visor) is as the wear file
   lays it. The picture stands back so the whole piece is in the frame; a bare head is drawn as before.
   THE LEGS (the fight's own page; the three of the crew, every piece of head gear the wear file can draw):
     H1  HIS EYES READ UNDER A HAT OR OVER A MASK: across his eye line the picture with the gear on is the bare picture
     H2  NO SEAM: the gear as it is drawn has no cleared row its own picture does not have (nothing was cut out of it); this lane's
         file clears nothing
     H3  THE WHOLE OF IT IS IN THE FRAME: the gear does not touch the frame's first row
     H4  A BARE HEAD IS AS IT WAS: with nothing on his head the portrait is the cell at the frame's full size
     H5  WHERE HE SEES IT: the fight's own face (the phone's card reads it), his sheet's face and the why line's face are that picture
     H6  A BRIM SITS ON HIS BROW: a fitted hat's lower edge, down the middle of his face, is over his eye line and no more than a
         tenth of his head over his brow (it is on him, not floating); the crew's own hard hat is such a hat
     H7  THE GEAR IS STILL ON HIM: every face drawn with its gear
     planted: this lane's file left out (the gear lies over his eyes again, H1 red); a band cut out of the gear again (H2 red)
   Run: node gates/the_face_shows_under_the_helmet_gate.js      (about a minute) */
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
  let planted = null;
  const srv = http.createServer((q, r) => { const rel = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, rel);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    let body = fs.readFileSync(f);
    if (planted === 'out' && /bohemia_fight_face\.js$/.test(rel)) body = Buffer.from('/* planted: left out */');
    if (planted === 'cut' && /bohemia_fight_face\.js$/.test(rel)) { const s = String(body), t = s.replace("try { ok = !!W.face(g, img, S, look || null, wear || null, redo, crop); } catch (e) { ok = false; }\n    g.restore();", "try { ok = !!W.face(g, img, S, look || null, wear || null, redo, crop); } catch (e) { ok = false; }\n    g.restore(); if (!plain) { g.save(); g.translate(fx, fy); g.scale(z, z); g.clearRect(-9999, (a.ey - 0.07 * a.w) * m, 99999, 0.2 * a.w * m); g.restore(); }"); if (t === s) throw new Error('the plant did not take'); body = Buffer.from(t); }
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
      const R = { faces: 0, pieces: heads.length, eyesHidden: [], noGear: [], cutByFrame: [], bare: [], seam: [], brim: [], kinds: {}, byKey: {}, notRead: 0, framed: !!window.BohemiaFightFace, drew: 0, smallest: 1 };
      /* the wear file's pictures are in before anything is judged */
      { const t = C(), v = mine[0], keep = v.headRow; v.headRow = heads[0]; for (let i = 0; i < 40; i++) { drawPortrait(t.getContext('2d'), v, S, true); await new Promise(r => setTimeout(r, 80)); const w = BohemiaWear.of(v); if (window.BohemiaFightFace ? BohemiaFightFace.n > 0 : i > 12) break; } v.headRow = keep; }
      const face0 = BohemiaWear.face;
      /* the cleared rows inside a piece: runs of rows with nothing on them between its first row and its last */
      const gaps = (cv) => { const d = cv.getContext('2d').getImageData(0, 0, S, S).data, on = []; for (let y = 0; y < S; y++) { let o = false; for (let x = 0; x < S && !o; x++) if (d[(y * S + x) * 4 + 3] >= 64) o = true; on.push(o); } const f = on.indexOf(true), l = on.lastIndexOf(true); let n = 0; for (let y = f + 1; y < l; y++) if (!on[y] && on[y - 1]) n++; return f < 0 ? -1 : n; };
      for (const v of mine) { const keep = v.headRow, fi = F.order.indexOf(v.look), crop = [fi * F.size, 0, F.size, F.size];
        /* H4: a bare head */
        v.headRow = null; const tb = C(); drawPortrait(tb.getContext('2d'), v, S, true); const ref = C(), rg = ref.getContext('2d'); rg.fillStyle = '#2b2620'; rg.fillRect(0, 0, S, S); rg.imageSmoothingEnabled = S < F.size; rg.drawImage(img, fi * F.size, 0, F.size, F.size, 0, 0, S, S);
        const band = Math.round(S * .13) + 2, fw = Math.round(S * .07) + 2; if (diff(px(tb), px(ref), fw, S - band, fw, S - fw) > 0) R.bare.push(v.name);
        for (const h of heads) { v.headRow = h; R.faces++; const nm = v.name + ' in ' + (h.name || h.id);
          if (window.BohemiaFightFace) BohemiaFightFace.said = null;
          const A = C(); drawPortrait(A.getContext('2d'), v, S, true); const said = window.BohemiaFightFace ? BohemiaFightFace.said : null;
          /* the same frame with the gear's picture held back */
          BohemiaWear.face = function () { return true; }; const B = C(); drawPortrait(B.getContext('2d'), v, S, true); BohemiaWear.face = face0;
          const a = px(A), bb = px(B), kind = said ? said.kind : 'hat'; R.kinds[kind] = (R.kinds[kind] | 0) + 1; if (said) { R.drew++; R.smallest = Math.min(R.smallest, said.z); if (!said.read) R.notRead++; }
          /* H1: across his eye line, the middle half of his head */
          const ac = said ? said.across : S * .8, ex0 = Math.round((said ? said.mid : S / 2) - 0.25 * ac), ex1 = Math.round((said ? said.mid : S / 2) + 0.25 * ac), ey0 = Math.round((said ? said.eye : S * .49) - 0.04 * ac), ey1 = Math.round((said ? said.eye : S * .49) + 0.04 * ac);
          const hid = diff(a, bb, ey0, ey1 + 1, ex0, ex1 + 1) / Math.max(1, (ey1 + 1 - ey0) * (ex1 + 1 - ex0));
          if (!said && hid > 0.05) R.eyesHidden.push(nm);   /* this lane's file is not in: the picture itself is read */
          if (diff(a, bb, fw, S - band, fw, S - fw) < 40) R.noGear.push(nm);
          if (diff(a, bb, fw, fw + 1, fw, S - fw) > 0) R.cutByFrame.push(nm);
          if (said) { const w = BohemiaWear.of(v), L1 = BohemiaFightFace.layer(img, crop, S, w, null, false), L0 = BohemiaFightFace.layer(img, crop, S, w, null, true);
            /* H2: nothing cut out of it */
            if (!L1 || !L0 || gaps(L1.canvas) !== gaps(L0.canvas)) R.seam.push(nm + (L1 && L0 ? ' (' + gaps(L1.canvas) + ' cleared, its own picture ' + gaps(L0.canvas) + ')' : ''));
            /* H1: gear he cannot be seen through, across his eye line (a visor he is seen through is not over his eyes) */
            if (L1 && (kind === 'hat' || kind === 'mask')) { const d = L1.canvas.getContext('2d').getImageData(0, 0, S, S).data; let n = 0, tot = 0; for (let y = ey0; y <= ey1; y++) for (let x = ex0; x <= ex1; x++) { tot++; if (x >= 0 && x < S && y >= 0 && y < S && d[(y * S + x) * 4 + 3] >= 200) n++; } if (n / Math.max(1, tot) > 0.15) R.eyesHidden.push(nm + ' (' + Math.round(n / tot * 100) + ' in 100)'); }   /* a brim on his eyes is 100 in 100; the bars of a cage he is seen through are under 15 */
            R.byKey[String(w.head)] = (R.byKey[String(w.head)] || []).concat([kind]);
            /* H6: a hat's lower edge down the middle of his face */
            if (L1 && kind === 'hat') { const d = L1.canvas.getContext('2d').getImageData(0, 0, S, S).data, c0 = Math.round(L1.mid - 0.17 * L1.across), c1 = Math.round(L1.mid + 0.17 * L1.across); let low = -1;
              /* the lowest row of it over his eye line, down the middle of his face: its brim's lower edge (a visor's frame under his eyes is the piece's own, and is not the brim) */
              for (let y = 0; y < Math.round(L1.eye - 0.02 * L1.across); y++) { let n = 0; for (let x = c0; x <= c1; x++) if (x >= 0 && x < S && d[(y * S + x) * 4 + 3] >= 200) n++; if (n / (c1 - c0 + 1) >= 0.5) low = y; }
              if (!(low > L1.brow - 0.10 * L1.across)) R.brim.push(nm + ' (its edge ' + Math.round((L1.eye - low) / L1.across * 100) / 100 + ' of his head over his eyes)'); } } }
        v.headRow = keep; }
      /* H5: where he sees it */
      const v = mine[1] || mine[0], keep = v.headRow; v.headRow = heads[Math.min(1, heads.length - 1)]; UI.faceKey = null; UI.pend = null; try { hud(); } catch (e) {}
      const n0 = window.BohemiaFightFace ? BohemiaFightFace.n : 0; UI.sheetSig = null; UI.drawer = false; try { drawer(v); } catch (e) {} const n1 = window.BohemiaFightFace ? BohemiaFightFace.n : 0;
      R.sheet = n1 > n0 && !!document.querySelector('#drawer .sh-face'); const n2 = n1; UI.faceKey = null; try { drawPortrait(document.getElementById('face').getContext('2d'), v, document.getElementById('face').width); } catch (e) {} R.card = (window.BohemiaFightFace ? BohemiaFightFace.n : 0) > n2;
      const n3 = window.BohemiaFightFace ? BohemiaFightFace.n : 0; try { const cv = document.getElementById('whyface'); drawPortrait(cv.getContext('2d'), v, cv.width, true); } catch (e) {} R.why = (window.BohemiaFightFace ? BohemiaFightFace.n : 0) > n3; v.headRow = keep;
      return R; });
    await ctx.close(); return out; };
  try {
    const R = await run(), K = R.kinds, crew = R.byKey.newcrew_surplus_hard_hat || [];
    check(R.framed && R.faces >= 30 && R.drew === R.faces && R.eyesHidden.length === 0 && (K.hat | 0) > R.faces * 0.3, 'H1', 'his eyes read under a hat or over a mask: ' + R.faces + ' faces (3 of the crew x ' + R.pieces + ' pieces of head gear): ' + (K.hat | 0) + ' hats fitted, ' + (K.mask | 0) + ' masks moved under his eyes, ' + (K.open | 0) + ' open pieces, ' + (K.face | 0) + ' faces of their own (closed helms, full masks); ' + R.eyesHidden.length + ' hats or masks with anything across his eye line' + (R.eyesHidden.length ? ': ' + R.eyesHidden.slice(0, 4).join(', ') : '') + '; his eye line read off his own picture on ' + (R.faces - R.notRead) + ' of ' + R.faces);
    { const SRC = fs.readFileSync(path.join(ROOT, 'slices/bohemia_fight_face.js'), 'utf8').split('(function (root) {')[1] || '';
      check(R.seam.length === 0 && !/clearRect|destination-out|globalCompositeOperation/.test(SRC), 'H2', 'no seam: ' + R.seam.length + ' of ' + R.faces + ' pieces are drawn with a cleared row their own picture does not have' + (R.seam.length ? ': ' + R.seam.slice(0, 3).join(', ') : '') + '; this lane\'s file clears nothing'); }
    check(R.cutByFrame.length <= Math.floor(R.faces * 0.1), 'H3', 'the whole of it is in the frame: ' + R.cutByFrame.length + ' of ' + R.faces + ' touch the frame\'s first row' + (R.cutByFrame.length ? ' (' + [...new Set(R.cutByFrame.map(x => x.split(' in ')[1]))].slice(0, 5).join(', ') + ')' : '') + '; the smallest a face stands is ' + R.smallest + ' of the frame');
    check(R.bare.length === 0, 'H4', 'a bare head is as it was: ' + R.bare.length + ' of 3 differ from the cell at full size');
    check(R.sheet && R.card && R.why, 'H5', 'where he sees it: his sheet\'s face ' + (R.sheet ? 'is' : 'IS NOT') + ' that picture, the fight\'s card face (the phone reads it) ' + (R.card ? 'is' : 'IS NOT') + ', the why line\'s face ' + (R.why ? 'is' : 'IS NOT'));
    check(R.brim.length === 0 && crew.length === 3 && crew.every(k => k === 'hat'), 'H6', 'a brim sits on his brow: ' + R.brim.length + ' of ' + (K.hat | 0) + ' fitted hats float over his brow' + (R.brim.length ? ': ' + R.brim.slice(0, 3).join(', ') : '') + '; the hard hat the crew wears in the game is fitted as a hat on ' + crew.filter(k => k === 'hat').length + ' of the 3');
    check(R.noGear.length === 0, 'H7', 'the gear is still on him: ' + R.noGear.length + ' of ' + R.faces + ' drawn with no gear at all' + (R.noGear.length ? ': ' + R.noGear.slice(0, 4).join(', ') : ''));
    planted = 'out'; const P = await run();
    check(!P.framed && P.eyesHidden.length > P.faces * 0.5, 'planted', 'this lane\'s file left out: ' + P.eyesHidden.length + ' of ' + P.faces + ' faces have the gear across his eye line again (H1 is red on it)');
    planted = 'cut'; const Q = await run();
    check(Q.seam.length > Q.faces * 0.5, 'planted cut', 'a band cut out of the gear again: ' + Q.seam.length + ' of ' + Q.faces + ' pieces have a cleared row their own picture does not have (H2 is red on it)');
    check(!errs.length, 'errors', errs.length + ' page errors' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
  } catch (e) { check(false, 'ran', String(e && e.stack || e).slice(0, 400)); }
  await b.close(); srv.close(); done();
})();

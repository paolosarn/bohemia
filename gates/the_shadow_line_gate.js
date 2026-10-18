#!/usr/bin/env node
/* THE SHADOW LINE (ANIMATION [the shadow line and the choppy fall], 10/18; his thirteenth votes, NO on
   animation-the-party-walks-as-one-10-11: 'there's a shadow line behind the main character bro, like what's wrong with
   you?'). The cause, looked at on the card: three ground shadows drawn as three people (his 22 px at 0.6, theirs 16 px
   at 0.45) with the two walking 13 and 22 px behind him, so the ovals overlapped into one dark streak off his heels and
   the nearer companion's landed on his boots. __THE_SHADOW_LINE__ (slices/BOHEMIA_CITY_WORLD.html) lays the party's
   shadows once, as one fill, each the width of the feet. Asked of the real map in the alpha, the clock driven, a trip
   in every direction, the candidate ON, each frame drawn twice at the same instant, once with the shade clear:
     the pixels the shade changed fall into SEPARATE pieces, one per person (no streak), none darker than one shade;
     no two shadows touch (the geometry the map reports);
     and the old drawing (the candidate OFF) FAILS the same pieces test on some trip, so the test bites. */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n + (why ? '  [' + why + ']' : ''))); };
const done = () => { console.log('\nTHE SHADOW LINE GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const src = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
ok('the candidate stays OFF in the file (rule 100)', /var MAP_PARTY_AS_ONE = \{ on: false,/.test(src));
ok('the party\'s shadows are one fill (__THE_SHADOW_LINE__, mapPartyShadow)', /function mapPartyShadow\(/.test(src) && /g\.fill\('nonzero'\)/.test(src));

(async () => {
  const d = await open({ alpha: true }); const p = d.page;
  let f = null; for (let i = 0; i < 60 && !(f = p.frames().find(x => /CITY_WORLD/.test(x.url()))); i++) await p.waitForTimeout(500);
  if (!f) { ok('the map loads inside the alpha', false); await d.browser.close(); return done(); }
  for (let i = 0; i < 160; i++) { const n = await f.evaluate(() => typeof CAST_WALK === 'undefined' ? -1 : Object.keys(CAST_WALK).length).catch(() => -1); if (n >= 12) break; await p.waitForTimeout(500); }
  const r = await f.evaluate(() => {
    const out = []; let T = performance.now() + 5000; const real = performance.now; performance.now = () => T;
    const P = MAP_PARTY_AS_ONE, shade0 = P.shade, cv = document.querySelector('canvas'), cx = cv.getContext('2d');
    const P2 = CanvasRenderingContext2D.prototype, fill0 = P2.fill, img0 = P2.drawImage, ell0 = P2.ellipse, bp0 = P2.beginPath;
    /* only a PERSON's shadow is cleared (an oval under 14 px across its half): a town's base throws a big one in the same colour */
    let rxMax = 0; P2.beginPath = function () { rxMax = 0; return bp0.apply(this, arguments); }; P2.ellipse = function (x, y, rx) { rxMax = Math.max(rxMax, rx); return ell0.apply(this, arguments); };
    /* the people hidden (every small picture on the glass), so a leg never splits a shadow and only the ground's shade is counted */
    const hide = () => { P2.drawImage = function (im) { if (this.canvas === cv && im && im.width <= 256 && im.height <= 256) return; return img0.apply(this, arguments); }; };
    try { if (typeof setMode === 'function') setMode('city'); MODE = 'city'; try { HC = HZOOM; } catch (e) {}
      const runs = []; for (let dd = 0; dd < 8; dd++) { let hit = null;
        outer: for (let y = 3; y < om.n - 3; y++) for (let x = 3; x < om.n - 3; x++) { const [dx, dy] = DIRS[dd]; let okk = true;
          for (let k = 0; k <= 6; k++) if (!cityWalkable(x + k * dx, y + k * dy)) { okk = false; break; } if (okk) { hit = { x, y, d: dd }; break outer; } }
        if (hit) runs.push(hit); }
      const grab = (you) => { const q = devicePixelRatio || 1, x0 = Math.round((you.x - 40) * q), y0 = Math.round((you.y - 22) * q);
        return { x0, y0, w: Math.round(80 * q), h: Math.round(36 * q), px: Array.from(cx.getImageData(x0, y0, Math.round(80 * q), Math.round(36 * q)).data) }; };
      for (const on of [true, false]) { P.on = on;
        for (const run of runs) { city.x = run.x; city.y = run.y; T += 5000; MAP_DREW = null; render(); render(); stepOnce(run.d);
          for (let i = 0; i < 10; i++) { T += 1000 / 60; MAP_DREW = null; render(); }
          MAP_DREW = null; render(); const you = MAP_DREW.you, shadows = MAP_DREW.shadows || null, feet = [[you.x, you.y]].concat((MAP_DREW.companyAt || []).map(c => [c[0], c[1]]));
          /* THE ORDER: every person-sized shade on the ground near him is laid before the first of the three bodies */
          let seq = []; const q0 = devicePixelRatio || 1, near = (m, x, y) => { const X = (m.a * x + m.c * y + m.e) / q0, Y = (m.b * x + m.d * y + m.f) / q0; return feet.some(f => Math.abs(X - f[0]) <= 3 && Math.abs(Y - f[1]) <= 3); };   /* one of HIS THREE, by the feet the map reported */
          let lastE = null; P2.ellipse = function (x, y, rx) { rxMax = Math.max(rxMax, rx); lastE = [x, y]; return ell0.apply(this, arguments); };
          const f1 = P2.fill; P2.fill = function () { if (this.canvas === cv && rxMax > 0 && rxMax < 14 && lastE && /^rgba\((14|10), ?(11|8), ?(8|6)/.test(String(this.fillStyle)) && near(this.getTransform(), lastE[0], lastE[1])) seq.push('shade'); return fill0.apply(this, arguments); };
          P2.drawImage = function (im) { if (this.canvas === cv && im && im.width <= 256 && im.height <= 256 && arguments.length >= 5) { const a5 = Array.from(arguments).slice(-4); if (near(this.getTransform(), a5[0] + a5[2] / 2, a5[1] + a5[3] * 0.93)) seq.push('body'); } return img0.apply(this, arguments); };
          MAP_DREW = null; render(); P2.fill = f1; P2.drawImage = img0; P2.ellipse = function (x, y, rx) { rxMax = Math.max(rxMax, rx); return ell0.apply(this, arguments); };
          const order = seq.join(',');
          hide(); MAP_DREW = null; render(); const a = grab(you);
          /* the same instant with every ground shadow clear: ON clears the party's shade, OFF clears the old ellipses */
          P.shade = 'rgba(0,0,0,0)';
          P2.fill = function () { const fs_ = String(this.fillStyle); if (/^rgba\((14|10), ?(11|8), ?(8|6)/.test(fs_) && this.canvas === cv && rxMax > 0 && rxMax < 14) return; return fill0.apply(this, arguments); };
          MAP_DREW = null; render(); const b = grab(you); P2.fill = fill0; P2.drawImage = img0; P.shade = shade0;
          out.push({ on, d: run.d, a, b, shadows, order, feet: feet.map(c => [(c[0] - you.x + 40) * (devicePixelRatio || 1), (c[1] - you.y + 22) * (devicePixelRatio || 1)]), q: devicePixelRatio || 1 }); } }
    } finally { P.on = false; P.shade = shade0; P2.fill = fill0; P2.drawImage = img0; P2.ellipse = ell0; P2.beginPath = bp0; performance.now = real; }
    return out; });
  /* the pieces: pixels the shade changed, 4-connected */
  const pieces = (t) => { const { w, h } = t.a, m = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) { const j = i * 4; if (Math.abs(t.a.px[j] - t.b.px[j]) + Math.abs(t.a.px[j + 1] - t.b.px[j + 1]) + Math.abs(t.a.px[j + 2] - t.b.px[j + 2]) > 12) m[i] = 1; }
    const lab = new Int32Array(w * h); let n = 0, big = 0, joined = 0, under = 0;
    /* a foot belongs to the piece under it (within 2 device px, a boot's own outline) */
    const at = (fx, fy) => { for (let ay = -2; ay <= 2; ay++) for (let ax = -2; ax <= 2; ax++) { const X = Math.round(fx) + ax, Y = Math.round(fy) + ay; if (X >= 0 && Y >= 0 && X < w && Y < h && lab[Y * w + X]) return lab[Y * w + X]; } return 0; };
    for (let i = 0; i < w * h; i++) if (m[i] && !lab[i]) { n++; let c = 0; const st = [i]; lab[i] = n;
      while (st.length) { const k = st.pop(); c++; const x = k % w, y = (k / w) | 0;
        for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + ax, Y = y + ay; if (X < 0 || Y < 0 || X >= w || Y >= h) continue; const kk = Y * w + X; if (m[kk] && !lab[kk]) { lab[kk] = n; st.push(kk); } } }
      if (c >= 12 * t.q * t.q) big++; }   /* a person's shadow is ~30 CSS px of ground; the ground's own re-slid edges are specks under 12 */
    const ids = t.feet.map(f => at(f[0], f[1])); under = ids.filter(Boolean).length;
    joined = ids.filter(Boolean).some((v, i, a) => a.indexOf(v) !== i) ? 1 : 0;
    return { big, joined, under }; };
  const on = r.filter(t => t.on), off = r.filter(t => !t.on);
  console.log('         ' + on.length + ' trips, the candidate on and off, each frame drawn with and without the shade');
  const onP = on.map(t => Object.assign({ d: t.d }, pieces(t)));
  console.log('         ON,  shade pieces / feet on a shade / one piece under two people: ' + onP.map(x => 'dir ' + x.d + ' ' + x.big + '/' + x.under + '/' + x.joined).join('  '));
  const offP = off.map(t => Object.assign({ d: t.d }, pieces(t)));
  console.log('         OFF, the same:                                              ' + offP.map(x => 'dir ' + x.d + ' ' + x.big + '/' + x.under + '/' + x.joined).join('  '));
  ok('ON: the map reports three shadows on every trip, his and his two', on.length > 0 && on.every(t => t.shadows && t.shadows.length === 3), on.filter(t => !t.shadows || t.shadows.length !== 3).map(t => 'dir ' + t.d).join(','));
  /* two ellipses touch if any point of one lies inside the other: 64 rim points each way */
  const inside = (e, x, y) => ((x - e[0]) / e[2]) ** 2 + ((y - e[1]) / e[3]) ** 2 <= 1;
  const touch = (a, b) => { for (let i = 0; i < 64; i++) { const t = i / 64 * 2 * Math.PI; if (inside(b, a[0] + a[2] * Math.cos(t), a[1] + a[3] * Math.sin(t)) || inside(a, b[0] + b[2] * Math.cos(t), b[1] + b[3] * Math.sin(t))) return true; } return false; };
  const touching = on.filter(t => t.shadows && t.shadows.some((s, i) => t.shadows.some((u, j) => j > i && touch(s, u))));
  ok('ON: NO TWO SHADOWS TOUCH, at any facing (so none can join into a line behind him)', !touching.length, touching.map(t => 'dir ' + t.d + ' ' + JSON.stringify(t.shadows.map(s => s.map(v => Math.round(v))))).join(' | '));
  const streak = onP.filter(x => x.joined || x.under !== 3);
  ok('ON: on the glass (the people hidden) each of the three stands on his OWN piece of shade, and no piece runs under two of them, on every trip', !streak.length, streak.map(x => 'dir ' + x.d + ' ' + x.under + '/' + x.joined).join(','));
  const late = on.filter(t => t.order.indexOf('body') >= 0 && t.order.lastIndexOf('shade') > t.order.indexOf('body'));
  ok('ON: NOBODY\'S SHADOW IS PAINTED OVER A BODY: every shade near him is laid before the first of the three is drawn', on.every(t => t.order.indexOf('shade') >= 0) && !late.length, late.map(t => 'dir ' + t.d + ' ' + t.order).join(' | '));
  ok('THE TEST BITES: on the old drawing (OFF) one piece of shade runs under two of them on some trip (the line he saw)', offP.some(x => x.joined), offP.map(x => x.joined).join(','));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });

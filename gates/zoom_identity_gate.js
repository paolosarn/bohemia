/* THE ZOOM IDENTITY GATE (8/19/26, CHARACTER lane)
 * THE GAME MUST OPEN AT A ZOOM WHERE PEOPLE ARE STILL PEOPLE.
 *
 * VERIFY ON THE REAL SURFACE (7/18). I shipped thirteen faction outfits and six city
 * residents and proved every one distinguishable by OUTLINE -- at 112 pixels, on the
 * CHARACTER tab. That is ONE of the four sizes this game draws a person at, and I had
 * never measured the others.
 *
 * The city blits a body at exactly one rung, 1:1, never a fractional scale:
 *     const lad = C >= 64 ? 224 : (C >= 32 ? 112 : (C < 17 ? 28 : 56));
 *
 * MEASURED (tools/bohemia_zoom_identity.js), thirteen outfits, closest pair:
 *     112px rung   0.036     the pin faction_outfit_gate holds is 0.035
 *      56px rung   0.0150    the gap that ACTUALLY FAILED once was 0.014
 *      28px rung   0.0144
 * So identity survives the walk zoom and DOES NOT survive either rung below it. At 28
 * the body is twenty-five pixels tall; that is not a wardrobe problem and no coat can
 * fix it. It is a limit.
 *
 * *** SO THIS GATE DOES NOT FAIL ON THE LIMIT -- IT FAILS ON LOSING THE GOOD RUNG. ***
 * A gate that went red on the 28px number would be red on physics, and a gate that is
 * red on something nobody can fix gets switched off, which is how the real checks in
 * the same file get switched off with it. What CAN regress, silently and in one
 * character, is the zoom the game OPENS at: `let HC=44` maps to the 112 rung, and any
 * edit that drops it under 32 quietly turns the whole cast back into crowd. Nothing
 * would go red, nothing would look broken, and thirteen outfits measured to four
 * decimal places would stop meaning anything on the surface he plays.
 *
 * IT READS THE LADDER OUT OF THE CITY SOURCE rather than restating it here, so the
 * check cannot pass by agreeing with a copy of the rule that has drifted from the one
 * the renderer uses.
 *
 * MUTATION-TESTED: set the default zoom to 20 and this goes red naming the rung it
 * lands on. Confirmed in place, then put back.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads source and measures rendered frames.
 *   Writes nothing, sets no globals, authors no pixel.
 *   built on: buildFrameCached, BOH_BODYVAR
 *   joints: none named
 *   parts: none named
 *
 *   node gates/zoom_identity_gate.js
 */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const CITY = path.join(REPO, 'slices/BOHEMIA_CITY_WORLD.html');

/* the pin the 112 rung already holds, from gates/faction_outfit_gate.js */
const PIN = 0.035;

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const src = fs.readFileSync(CITY, 'utf8');

/* ---- the ladder and the default zoom, read out of the renderer, not restated ---- */
const ladM = src.match(/C\s*>=\s*64\s*\?\s*224\s*:\s*\(\s*C\s*>=\s*32\s*\?\s*112\s*:\s*\(\s*C\s*<\s*17\s*\?\s*28\s*:\s*56\s*\)\s*\)/);
ok('the zoom ladder is where this gate thinks it is (read from the city, not restated here)', !!ladM);
const hcM = src.match(/\blet\s+HC\s*=\s*(\d+)\s*;/);
ok('the city declares the zoom it opens at', !!hcM);
const HC = hcM ? parseInt(hcM[1], 10) : -1;
const rungOf = (C) => C >= 64 ? 224 : (C >= 32 ? 112 : (C < 17 ? 28 : 56));
const rung = rungOf(HC);
ok('the game OPENS on a rung where a person is still somebody (HC=' + HC +
   ' -> ' + rung + 'px' + (rung >= 112 ? '' : ', and below 112 the cast measures as crowd') + ')',
   rung >= 112);

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await SETTLE(page, 2500);
  await page.click('#front').catch(() => {});
  await SETTLE(page, 4500);

  const R = await page.evaluate(() => {
    const looks = (window.FACTION_LOOKS || []);
    if (!looks.length) return { err: 'no FACTION_LOOKS' };
    const half2 = (px, W, H) => {              /* the city's half2: every other pixel */
      const w = W >> 1, h = H >> 1, out = new Array(w * h).fill(null);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[y * w + x] = px[(y * 2) * W + (x * 2)];
      return { px: out, W: w, H: h };
    };
    const profileOf = (px, W, H) => {
      const rows = [];
      for (let y = 0; y < H; y++) { let lo = -1, hi = -1;
        for (let x = 0; x < W; x++) if (px[y * W + x]) { if (lo < 0) lo = x; hi = x; }
        rows.push(hi < 0 ? 0 : hi - lo + 1); }
      let t = 0; while (t < rows.length && !rows[t]) t++;
      let b = rows.length - 1; while (b > t && !rows[b]) b--;
      const span = Math.max(1, b - t), wide = Math.max.apply(null, rows) || 1, N = 16, p = [];
      for (let k = 0; k < N; k++) { const y = t + Math.round(span * k / (N - 1));
        p.push(rows[Math.min(rows.length - 1, y)] / wide); }
      return { p: p, tall: b - t + 1 };
    };
    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age, keepEq = {};
    const PD = ['shirt', 'jacket', 'pants', 'shoes', 'hat', 'glasses', 'hair'];
    PD.forEach(s => { if (s in G.equipped) { keepEq[s] = G.equipped[s]; G.equipped[s] = ''; } });
    const out = { err: null };
    try {
      const a56 = [], a28 = [];
      for (const f of looks) {
        window.G_WORN = f.worn; G.bodyVar = f.dials; G.age = f.age || 'adult';
        rebuildFromRig();
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); POSEHOLD_CACHE.clear(); } catch (e) {}
        const fr = buildFrameCached('S', 'idle', 0, false);
        a56.push(profileOf(fr.px, fr.CW, fr.CH));
        const h = half2(fr.px, fr.CW, fr.CH);
        a28.push(profileOf(h.px, h.W, h.H));
      }
      const dist = (x, y) => { let s = 0; for (let k = 0; k < x.length; k++) s += Math.abs(x[k] - y[k]); return s / x.length; };
      const closest = (arr) => { let m = Infinity;
        for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++)
          m = Math.min(m, dist(arr[i].p, arr[j].p));
        return m; };
      out.n = looks.length;
      out.c56 = closest(a56); out.t56 = a56[0].tall;
      out.c28 = closest(a28); out.t28 = a28[0].tall;
    } catch (e) { out.err = e.message; }
    finally {
      window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA;
      for (const s in keepEq) G.equipped[s] = keepEq[s];
      try { rebuildFromRig(); } catch (e) {}
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); POSEHOLD_CACHE.clear(); } catch (e) {}
    }
    return out;
  });

  if (R.err) { console.log('  THREW: ' + R.err); process.exit(1); }

  ok('there is a cast to measure (' + R.n + ' outfits)', R.n >= 6);
  /* THE MEASUREMENT IS REAL, not a ruler that collapsed. If the lower rungs came back
     at zero for everybody the "limit" would be an artefact of a broken profile, so the
     bodies are asserted to still exist at each rung. */
  ok('the bodies survive the downscale enough to be measured at all (' +
     R.t56 + 'px at 56, ' + R.t28 + 'px at 28)', R.t56 > 30 && R.t28 > 15);
  /* AND THE LIMIT IS RECORDED, not asserted away. These two lines are the finding:
     they are printed every run so it can never quietly become untrue in either
     direction, and they are NOT failures, because nothing can widen a 25px body. */
  /* THIS IS A REAL CLAIM, and the third time this session I have caught myself
     writing ok(..., true) to "report" something. A line that cannot fail is not a
     check, it is a print statement wearing a check's clothes. What is actually
     assertable here is that THE RULER DID NOT COLLAPSE: if the downscaled profiles
     all came back identical the closest pair would be 0.0000 and the "limit" this
     gate reports would be an artefact of a broken measurement rather than a fact
     about small sprites. */
  ok('the lower-rung measurement is a real number and not a collapsed ruler (56px ' +
     R.c56.toFixed(4) + ', 28px ' + R.c28.toFixed(4) +
     (R.c56 < PIN ? ' -- both BELOW the 112 pin: crowd, not characters' : '') + ')',
     isFinite(R.c56) && isFinite(R.c28) && R.c56 > 0.0005 && R.c28 > 0.0005);
  console.log('  MEASURED LIMIT, not a failure: closest pair is ' + R.c56.toFixed(4) +
    ' at the 56px rung and ' + R.c28.toFixed(4) + ' at 28px, against a pin of ' +
    PIN.toFixed(3) + ' at 112. Zoomed out, the cast is crowd.');

  ok('the page booted clean' + (errs.length ? ' (' + errs[0] + ')' : ''), errs.length === 0);
  console.log('ZOOM IDENTITY GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();

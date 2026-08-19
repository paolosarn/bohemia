/* BOHEMIA AT WHAT ZOOM DOES A PERSON STOP BEING SOMEBODY? (8/19/26, CHARACTER lane)
 *
 * VERIFY ON THE REAL SURFACE (7/18). I shipped thirteen faction outfits and six city
 * residents, and proved every one of them distinguishable by OUTLINE -- on the
 * CHARACTER tab, at 112 pixels, on a bright preview canvas. That is one of the sizes
 * the game draws a person at. It is not the only one.
 *
 * THE CITY DRAWS PEOPLE ON A FOUR-RUNG LADDER and nothing in between (CITY_WORLD, the
 * ZOOM LEVEL LAW -- never a fractional scale):
 *
 *     const lad = C >= 64 ? 224 : (C >= 32 ? 112 : (C < 17 ? 28 : 56));
 *
 * and it blits at exactly `lad` screen pixels, 1:1. So at the default walk zoom a
 * person really is 112px -- my measurements were at the right size for that rung, by
 * luck rather than by design. TWO RUNGS BELOW IT HAVE NEVER BEEN MEASURED. Zoom out
 * and the same body is 56px, then 28px, and a silhouette difference that reads at 112
 * has no obligation to survive being quartered.
 *
 * THE QUESTION THIS ANSWERS is not "does the wardrobe work" -- it does at 112 -- but
 * WHERE THE CLAIM STOPS BEING TRUE, because I have been making it without a limit
 * attached and he is entitled to know when he is looking at people and when he is
 * looking at pixels.
 *
 * HOW THE RUNGS ARE MADE, and it matters that these are the game's own transforms:
 *   56   the composition itself, outline applied at 56 -- what the city bakes
 *   28   half2(56). The city's half2 is NEAREST-NEIGHBOUR SUBSAMPLING, ten lines,
 *        "take every other pixel" -- replicated here exactly rather than approximated,
 *        because a box filter or a canvas downscale would BLUR, and blurring invents
 *        a smoothness the game never draws. The replication is the algorithm, not a
 *        guess at its result.
 *   112  measured separately by gates/faction_outfit_gate.js on the real board.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): renders and measures, writes nothing. It
 *   borrows G_WORN / G.bodyVar / G.age around each render and restores them in a
 *   finally, the borrow-and-restore famPaintBody proved. No painted pixel, joint or
 *   bone is touched and no garment is authored.
 *   built on: BAKED, BOH_BODYVAR, buildFrameCached, applyCharOutline
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every body is an existing st:'canon' fit on
 * the one painted rig; the whole output is a table of numbers.
 *
 *   node tools/bohemia_zoom_identity.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_WHEN_A_PERSON_STOPS_BEING_SOMEBODY_8_19_26.txt');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', e => console.log('PAGEERR ' + e.message.slice(0, 110)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(4500);

  const R = await page.evaluate(() => {
    const looks = (window.FACTION_LOOKS || []).slice();
    if (!looks.length) return { err: 'no FACTION_LOOKS' };

    /* the city's half2, verbatim in behaviour: take every other pixel. */
    const half2 = (px, W, H) => {
      const w = W >> 1, h = H >> 1, out = new Array(w * h).fill(null);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
        out[y * w + x] = px[(y * 2) * W + (x * 2)];
      return { px: out, W: w, H: h };
    };
    const profileOf = (px, W, H) => {
      const rows = [];
      for (let y = 0; y < H; y++) {
        let lo = -1, hi = -1;
        for (let x = 0; x < W; x++) if (px[y * W + x]) { if (lo < 0) lo = x; hi = x; }
        rows.push(hi < 0 ? 0 : hi - lo + 1);
      }
      let t = 0; while (t < rows.length && !rows[t]) t++;
      let b = rows.length - 1; while (b > t && !rows[b]) b--;
      const span = Math.max(1, b - t), wide = Math.max.apply(null, rows) || 1, N = 16, p = [];
      for (let k = 0; k < N; k++) {
        const y = t + Math.round(span * k / (N - 1));
        p.push(rows[Math.min(rows.length - 1, y)] / wide);
      }
      let ink = 0; for (const r of rows) ink += r;
      return { p: p, ink: ink, tall: b - t + 1 };
    };

    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age, keepEq = {};
    const PD = ['shirt', 'jacket', 'pants', 'shoes', 'hat', 'glasses', 'hair'];
    PD.forEach(s => { if (s in G.equipped) { keepEq[s] = G.equipped[s]; G.equipped[s] = ''; } });

    const out = { rungs: {}, err: null };
    try {
      const at56 = [], at28 = [];
      for (const f of looks) {
        window.G_WORN = f.worn; G.bodyVar = f.dials; G.age = f.age || 'adult';
        rebuildFromRig();
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); POSEHOLD_CACHE.clear(); } catch (e) {}
        /* the 56 composition WITH the outline in it -- what the city bakes */
        const fr = buildFrameCached('S', 'idle', 0, false);
        const p56 = profileOf(fr.px, fr.CW, fr.CH);
        const h = half2(fr.px, fr.CW, fr.CH);
        const p28 = profileOf(h.px, h.W, h.H);
        at56.push({ n: f.faction, ...p56 });
        at28.push({ n: f.faction, ...p28 });
      }
      const dist = (a, b) => { let s = 0; for (let k = 0; k < a.length; k++) s += Math.abs(a[k] - b[k]); return s / a.length; };
      const score = (arr) => {
        const pairs = [];
        for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++)
          pairs.push({ d: dist(arr[i].p, arr[j].p), a: arr[i].n, b: arr[j].n });
        pairs.sort((x, y) => x.d - y.d);
        return { closest: pairs[0], mean: pairs.reduce((s, q) => s + q.d, 0) / pairs.length,
                 worst3: pairs.slice(0, 3), tall: Math.round(arr.reduce((s, q) => s + q.tall, 0) / arr.length),
                 ink: Math.round(arr.reduce((s, q) => s + q.ink, 0) / arr.length) };
      };
      out.rungs['56'] = score(at56);
      out.rungs['28'] = score(at28);
      out.n = looks.length;
    } catch (e) { out.err = e.message; }
    finally {
      window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA;
      for (const s in keepEq) G.equipped[s] = keepEq[s];
      try { rebuildFromRig(); } catch (e) {}
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); POSEHOLD_CACHE.clear(); } catch (e) {}
    }
    return out;
  });

  if (R.err) { console.log('THREW: ' + R.err); process.exit(1); }

  const L = [];
  const say = s => { L.push(s); console.log(s); };
  say('BOHEMIA -- WHEN DOES A PERSON STOP BEING SOMEBODY?');
  say('CHARACTER lane, 8/19/26. Measured on the rungs the city actually draws.\n');
  say('  The city blits a person at exactly one of four sizes, 1:1, never in between:');
  say('      C >= 64 -> 224     C >= 32 -> 112     C < 17 -> 28     otherwise 56');
  say('  Default walk zoom is the 112 rung, which is where every claim I have made');
  say('  about telling people apart was measured. These are the two rungs below it.\n');
  say('  ' + 'rung'.padStart(5) + '  ' + 'body'.padStart(5) + '  ' + 'closest pair'.padStart(13) +
      '  ' + 'mean'.padStart(6) + '   who is closest');
  for (const k of ['56', '28']) {
    const r = R.rungs[k];
    say('  ' + (k + 'px').padStart(5) + '  ' + (r.tall + 'px').padStart(5) + '  ' +
        r.closest.d.toFixed(4).padStart(13) + '  ' + r.mean.toFixed(3).padStart(6) +
        '   ' + r.worst3.map(q => q.a + '/' + q.b).join(', '));
  }
  say('');
  say('  FOR SCALE: the gap that actually failed -- two city residents reading as one');
  say('  person -- was 0.014, and gates/faction_outfit_gate.js holds 0.035 at 112.');
  const bad = ['56', '28'].filter(k => R.rungs[k].closest.d < 0.035);
  if (bad.length) {
    say('');
    say('  *** IDENTITY DOES NOT SURVIVE THE ' + bad.join(' AND ') + ' RUNG' +
        (bad.length > 1 ? 'S' : '') + '. ***');
    say('  At that size two factions are closer together than the pin the build holds');
    say('  at 112, which means zoomed out they are not thirteen people any more.');
    say('  THAT IS NOT A BUG TO FIX BY WIDENING COATS: the body is only ' +
        R.rungs[bad[bad.length - 1]].tall + 'px tall there.');
    say('  It is a LIMIT to know and to say out loud -- at the wide zooms the cast is');
    say('  crowd, not characters, and anything that needs to be recognised (a faction');
    say('  holding a street, somebody you are looking for) needs a channel that is not');
    say('  the silhouette: a marker, a name, a colour, or the camera being closer.');
  } else {
    say('  Identity survives every rung the city draws.');
  }
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log('\nwrote ' + path.relative(REPO, OUT));
  await browser.close();
})();

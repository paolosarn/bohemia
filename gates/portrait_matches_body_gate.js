/* THE PORTRAIT MATCHES THE BODY GATE (9/20/26, PORTRAIT lane, row [matches body])
 *
 * Paolo, 9/20, opening this chat: "remember it has to be connected to the hairs and eye
 * color and shit."   Paolo, 9/14: the eye colour, the hair colour and the hairstyle
 * "damn near the same" on the small overworld sprite and the HD portrait.
 *
 * MEASURED OVER 200 DRESSED CITIZENS BEFORE ANY OF THIS WAS BUILT:
 *     the haircut     200 of 200 agreed          (8/28 fixed it and it held)
 *     the eye colour  135 of 200 exactly right, 0 wrong, 65 with no eye visible at all
 *     THE HAIR COLOUR 23 of 200 WERE DIFFERENT PEOPLE, worst 15.4x apart in brightness:
 *                     a NEAR-WHITE portrait over a NEAR-BLACK head.
 * All 23 carried the ART DEFAULT hair colour (NPCFactory entry 4, null). The cause was
 * ONE WRONG READ: faceFor reached for the painted hair LAYER while the body draws the
 * worn CUT in the ramp that cut was authored with. 92.4% of citizens wear that cut, and
 * that number was measured on 9/11 eight lines above the code that got it wrong.
 *
 * *** THE RULER IS THE COLOUR LAW'S OWN, NOT A NEW ONE. *** Circular hue distance with
 * NEAR = 30 degrees, lifted from faction_colour_gate.js:426, INCLUDING ITS DRAB GUARD --
 * a colour under 15% saturation has no hue to lose, and without that guard two greys
 * 4% saturated read 75 and 137 degrees apart and two innocent citizens get blamed.
 *
 * *** THE BRIGHTNESS BUDGET IS MEASURED, NOT PICKED. *** A 64px portrait and a 26px head
 * never shade the same, so some gap is honest. The 175 citizens on the path that already
 * worked gave median 1.24x, 99th 1.98x, MAX 2.01x. The budget is 2.20 -- ten percent over
 * a measured ceiling. The 25 on the broken path ran 1.04x to 15.40x, so the two
 * populations do not overlap and this number is a wall between them, not a preference.
 *
 * *** IT FINDS THE PIXELS BY WHAT THEY RESPOND TO. *** The eyes are the pixels that change
 * when you change that person's iris; the hair is the pixels that change when you hand
 * them another colour OUT OF THE GAME'S OWN PALETTE. Three rulers in this lane's history
 * read a field that did not exist, matched on size, or checked their own copy of a sum
 * while the game kept the bug, and every one reported perfect agreement. An off-palette
 * probe is the same mistake in a new place: hairWear() only answers to a colour the
 * palette knows, so a made-up probe falls through to the cut's own ramp and perfect
 * agreement renders as "ignores it" -- it mis-blamed 26 of 200 before it was fixed.
 *
 *   node gates/portrait_matches_body_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

const NEAR       = 30;    /* degrees. faction_colour_gate.js:426, the colour law's ruler. */
const DRAB       = 0.15;  /* under this saturation a colour has no hue to lose.           */
const LUM_BUDGET = 2.20;  /* measured ceiling 2.01 on the working path, +10%.             */
const N          = 120;

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof buildFrame === 'function',
    { timeout: 60000 });

  console.log('\nTHE PORTRAIT MATCHES THE BODY GATE');

  const r = await p.evaluate(({ N, NEAR, DRAB, LUM_BUDGET }) => {
    const canon = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const keep = { eq: G.equipped, bv: G.bodyVar, worn: window.G_WORN, fa: G.faceAs, sk: skinTone, hc: hairColor };
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const hue = (c) => { const r0 = c[0] / 255, g0 = c[1] / 255, b0 = c[2] / 255;
      const mx = Math.max(r0, g0, b0), mn = Math.min(r0, g0, b0), d = mx - mn;
      if (d < 1e-6) return null; let h;
      if (mx === r0) h = ((g0 - b0) / d) % 6; else if (mx === g0) h = (b0 - r0) / d + 2; else h = (r0 - g0) / d + 4;
      h *= 60; return h < 0 ? h + 360 : h; };
    const dH = (a, b2) => { const d = Math.abs(((a - b2) % 360 + 360) % 360); return d > 180 ? 360 - d : d; };
    const sat = (c) => { const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]); return mx ? (mx - mn) / mx : 0; };
    const lum = (c) => 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];

    function renderBody(np, lk, sp, worn) {
      G.equipped = np.equipped; G.bodyVar = lk.body; window.G_WORN = worn;
      const tn = SKIN_TONES.find(z => z[0] === np.skinToneName); if (tn) skinTone = tn;
      hairColor = np.hairColor; G.faceAs = sp; clear();
      const fr = buildFrame('S', 'idle', 0);
      const px = new Array(fr.CW * fr.CH);
      for (let i = 0; i < px.length; i++) { const c = fr.px[i]; px[i] = c ? [c[0], c[1], c[2]] : null; }
      return px;
    }
    function renderPortrait(sp) {
      const buf = renderFace(sp, { ramp: faceRampFor(sp) });
      const px = new Array(64 * 64);
      for (let i = 0; i < 64 * 64; i++) { const o = i * 4; px[i] = buf[o + 3] ? [buf[o], buf[o + 1], buf[o + 2]] : null; }
      return px;
    }
    const diff = (a, c) => { const o = [];
      for (let k = 0; k < a.length; k++) { const x = a[k], y = c[k];
        if (!x && !y) continue;
        if (!x || !y || x[0] !== y[0] || x[1] !== y[1] || x[2] !== y[2]) o.push(k); }
      return o; };
    const mean = (idx, px) => { let r0 = 0, g0 = 0, b0 = 0, n = 0;
      for (const k of idx) { const a = px[k]; if (!a) continue; r0 += a[0]; g0 += a[1]; b0 += a[2]; n++; }
      return n ? [Math.round(r0 / n), Math.round(g0 / n), Math.round(b0 / n)] : null; };
    const dom = (idx, px) => { const t = {}; let best = null, bn = 0;
      for (const k of idx) { const a = px[k]; if (!a) continue; const key = a.join(',');
        t[key] = (t[key] || 0) + 1; if (t[key] > bn) { bn = t[key]; best = a; } }
      return best; };

    const F = NPC_FACTORY;
    const iOf = (n) => F.hairColorNames.indexOf(n);
    const MAG = F.hairColors[iOf('MAGENTA')], ACID = F.hairColors[iOf('ACID')];

    const out = { n: N, cutBad: [], hairHueBad: [], hairLumBad: [], eyeBad: [],
      eyeExact: 0, eyeInvisible: 0, artDefault: 0, artDefaultBad: 0,
      worstLum: 0, worstLumId: null, hairLocated: 0, eyeLocatedBoth: 0, portraitCuts: {} };

    for (let i = 0; i < N; i++) {
      const id = 'gate:match:' + i;
      const np = NPC_FACTORY.npcFrom(id), sp = faceFor(id), lk = BOH_PERSONLOOK.lookFor(id, canon);
      const worn = lk.worn;
      const realB = renderBody(np, lk, sp, worn);
      const realP = renderPortrait(sp);
      const isArt = !np.hairColor;
      if (isArt) out.artDefault++;
      if (sp.hair.name) out.portraitCuts[sp.hair.name] = 1;

      /* ---- the haircut ---- */
      if ((sp.hair.name || null) !== ((worn && worn.hair) || null))
        out.cutBad.push([id, sp.hair.name, worn && worn.hair]);

      /* ---- the eyes: the pixels that answer to this person's iris ---- */
      const spI = JSON.parse(JSON.stringify(sp)); spI.eyes.iris = [255, 0, 255];
      const bEye = diff(realB, renderBody(np, lk, spI, worn));
      if (bEye.length === 0) out.eyeInvisible++;
      else {
        out.eyeLocatedBoth++;
        const got = dom(bEye, realB), want = sp.eyes.iris.map(v => v * 0.55 | 0);
        if (got && got[0] === want[0] && got[1] === want[1] && got[2] === want[2]) out.eyeExact++;
        else out.eyeBad.push([id, sp.eyes.iris.join(','), got ? got.join(',') : 'null']);
      }

      /* ---- the hair: the pixels that answer to a colour THE PALETTE KNOWS ---- */
      const probe = (np.hairColor && np.hairColor.join(',') === MAG.join(',')) ? ACID : MAG;
      const npH = JSON.parse(JSON.stringify(np)); npH.hairColor = probe.slice();
      const spH = JSON.parse(JSON.stringify(sp)); spH.hair.color = probe.slice();
      spH.hair.roots = probe.map(v => v * 0.4 | 0);
      const bHair = diff(realB, renderBody(npH, lk, spH, worn));
      const pHair = diff(realP, renderPortrait(spH));
      const bM = mean(bHair, realB), pM = mean(pHair, realP);
      if (!bM || !pM) continue;
      out.hairLocated++;
      const ha = hue(pM), hb = hue(bM);
      let bad = false;
      if (ha != null && hb != null && sat(pM) >= DRAB && sat(bM) >= DRAB && dH(ha, hb) > NEAR) {
        out.hairHueBad.push([id, pM.join(','), bM.join(','), Math.round(dH(ha, hb))]); bad = true; }
      const la = lum(pM), lb = lum(bM);
      const ratio = Math.max(la, lb) / Math.max(1, Math.min(la, lb));
      if (ratio > out.worstLum) { out.worstLum = ratio; out.worstLumId = id; }
      if (ratio > LUM_BUDGET) {
        out.hairLumBad.push([id, sp.hair.name, pM.join(','), bM.join(','), +ratio.toFixed(2)]); bad = true; }
      if (bad && isArt) out.artDefaultBad++;
    }
    out.portraitCutCount = Object.keys(out.portraitCuts).length;
    delete out.portraitCuts;

    /* ---- THE ONE-SOURCE CLAIM, ASKED OF THE GAME AND NOT OF A COMMENT ----
       every canon cut must be able to say what ramp it was authored in, or the art
       default has nothing to read and this whole fix is a coin flip again. */
    out.cuts = 0; out.cutsWithRamp = 0;
    for (const g of canon) { if (g.layer !== 'hair' || typeof g.gen !== 'function') continue;
      out.cuts++;
      const ramp = window.hairAuthoredRamp ? window.hairAuthoredRamp(g.n) : null;
      if (ramp && ramp.mid && ramp.dk) out.cutsWithRamp++; }

    G.equipped = keep.eq; G.bodyVar = keep.bv; window.G_WORN = keep.worn;
    G.faceAs = keep.fa; skinTone = keep.sk; hairColor = keep.hc; clear();
    return out;
  }, { N, NEAR, DRAB, LUM_BUDGET });

  const shown = r.eyeLocatedBoth;

  ok('the page threw nothing while it was measured', errs.length === 0,
     errs.length ? '(' + errs[0].slice(0, 120) + ')' : '');

  ok('*** THE PORTRAIT WEARS THE HAIR COLOUR THE BODY IS WEARING ***',
     r.hairHueBad.length === 0 && r.hairLumBad.length === 0,
     '(' + (r.hairHueBad.length + r.hairLumBad.length) + ' of ' + r.hairLocated +
     ' differ; worst brightness gap ' + r.worstLum.toFixed(2) + 'x against a budget of ' +
     LUM_BUDGET + ' measured off the path that already worked' +
     (r.hairLumBad.length ? ' -- ' + r.hairLumBad.slice(0, 3).map(x => x.join(' ')).join(' | ') : '') +
     (r.hairHueBad.length ? ' -- hue ' + r.hairHueBad.slice(0, 3).map(x => x.join(' ')).join(' | ') : '') + ')');

  ok('and the people on the ART DEFAULT are not a separate population any more',
     r.artDefault > 0 && r.artDefaultBad === 0,
     '(' + r.artDefaultBad + ' of ' + r.artDefault + ' art-default citizens differ; it was 23 of 25)');

  ok('every canon cut can say what colour it was authored in',
     r.cuts >= 8 && r.cutsWithRamp === r.cuts,
     '(' + r.cutsWithRamp + ' of ' + r.cuts + ' -- without this the art default has nothing to read)');

  ok('*** THE BODY DRAWS THAT PERSON\'S OWN EYES ***',
     shown > 0 && r.eyeBad.length === 0,
     '(' + r.eyeExact + ' of ' + shown + ' visible eyes are exactly 0.55 of the portrait\'s iris' +
     (r.eyeBad.length ? ' -- ' + r.eyeBad.slice(0, 3).map(x => x.join(' ')).join(' | ') : '') + ')');

  ok('eyes reach most of the crowd at all', shown >= r.n * 0.55,
     '(' + shown + ' of ' + r.n + ' show eyes on the body; the rest are behind shades or a hat' +
     ' -- ROUTED, the portrait does not wear the shades)');

  ok('*** THE PORTRAIT WEARS THE HAIRCUT THE BODY IS WEARING ***',
     r.cutBad.length === 0,
     '(' + r.cutBad.length + ' of ' + r.n + ' differ' +
     (r.cutBad.length ? ' -- ' + r.cutBad.slice(0, 3).map(x => x.join(' ')).join(' | ') : '') + ')');

  ok('and it is not passing because everybody is bald',
     r.portraitCutCount >= 6 && r.hairLocated >= r.n * 0.9,
     '(' + r.portraitCutCount + ' distinct cuts across the sample, hair located on ' +
     r.hairLocated + ' of ' + r.n + ' bodies)');

  const alpha = fs.readFileSync(ALPHA, 'utf8');
  ok('the one resolver exists and the portrait reads it',
     /window\.hairAuthoredRamp\s*=/.test(alpha) && /window\.hairAuthoredRamp\(_bodyHair\)/.test(alpha),
     '(faceFor asks the cut, it does not keep a copy)');
  ok('and the cut records its own ramp instead of a table being kept by hand',
     /HAIR_AUTHORED\[opt\.name\]\s*=\s*opt\.ramp/.test(alpha),
     '(genHair writes it down on its first line)');
  ok('the number it was is written down beside the number it is',
     /15\.4/.test(alpha) && /23 of those 25/.test(alpha));

  console.log('\nTHE PORTRAIT MATCHES THE BODY GATE: ' + pass + ' passed, ' + fail + ' failed');
  await b.close();
  process.exit(fail ? 1 : 0);
})();

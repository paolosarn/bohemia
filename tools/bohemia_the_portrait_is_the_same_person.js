/* THE PORTRAIT IS THE SAME PERSON AS THE SPRITE  (9/20/26, PORTRAIT lane, row [matches body])
 *
 * Paolo, 9/20, on opening this chat: "remember it has to be connected to the hairs
 * and eye color and shit."   Paolo, 9/14: the eye colour, the hair colour and the
 * hairstyle "damn near the same" on the small overworld sprite and the HD portrait.
 *
 * THIS MEASURES, IT DOES NOT DECIDE. It renders every citizen TWICE -- the HD portrait
 * that pops up when they talk, and the body that is standing in front of you, DRESSED
 * exactly as the crowd dresses it -- and asks whether the two are the same person.
 *
 * *** IT FINDS THE PIXELS BY WHAT THEY RESPOND TO, NEVER BY A COLOUR IT GUESSED. ***
 * Three rulers in this lane's own history read a field that did not exist, or matched
 * on size, or checked their own copy of a sum while the game kept the bug, and every
 * one of them reported perfect agreement. So:
 *   THE EYES  are the pixels that CHANGE when you change that person's iris and nothing
 *             else. If none change, the eyes are not on the body at all.
 *   THE HAIR  is the pixels that CHANGE when you hand that person a different hair
 *             colour OUT OF THE GAME'S OWN PALETTE. An off-palette probe is useless
 *             here and the first cut of this tool was wrong for exactly that reason:
 *             hairWear() only answers to a colour the palette knows, so a made-up
 *             probe falls through to the cut's authored ramp -- and when the person's
 *             real colour IS that ramp, perfect agreement renders as "ignores it".
 *             26 of 200 people were mis-blamed that way before the probe was fixed.
 *
 * THE RULER IS THE COLOUR LAW'S OWN, not a new one: circular hue distance, NEAR = 30
 * degrees, lifted from faction_colour_gate.js:426 so two lanes cannot disagree about
 * what "the same colour" means. Brightness is reported beside it and is NOT counted as
 * a mismatch on its own -- the body deliberately draws the iris at 0.55 of the
 * portrait's, and a shaded 26px head will never average the same as a 64px one.
 * A RATIO OVER 3x IS counted: white hair over a black head is nobody's shading.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and reads. Writes no pixel, no joint, no bone.
 * Sets G.faceAs / G.bodyVar / G_WORN the way every other surface does and puts them
 * back. REUSE CHECK: cooks ZERO graphics -- every body is buildFrame and every face is
 * renderFace, both already approved.
 *
 *   node tools/bohemia_the_portrait_is_the_same_person.js [N]
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const N = parseInt(process.argv[2] || '200', 10);
const OUT = path.join(REPO, 'records/target/BOHEMIA_PORTRAIT_MATCHES_BODY.json');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 900, height: 700 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof buildFrame === 'function',
    { timeout: 60000 });

  const out = await p.evaluate((N) => {
    const canon = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const keep = { eq: G.equipped, bv: G.bodyVar, worn: window.G_WORN, fa: G.faceAs, sk: skinTone, hc: hairColor };
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };

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
    const mean = (idx, px) => { let r = 0, g = 0, bl = 0, n = 0;
      for (const k of idx) { const a = px[k]; if (!a) continue; r += a[0]; g += a[1]; bl += a[2]; n++; }
      return n ? [Math.round(r / n), Math.round(g / n), Math.round(bl / n)] : null; };
    const dom = (idx, px) => { const t = {}; let best = null, bn = 0;
      for (const k of idx) { const a = px[k]; if (!a) continue; const key = a.join(',');
        t[key] = (t[key] || 0) + 1; if (t[key] > bn) { bn = t[key]; best = a; } }
      return best; };

    /* a probe colour the PALETTE KNOWS, and never the person's own */
    const F = NPC_FACTORY;
    const nameOf = (rgb) => { if (!rgb) return 'ART';
      for (let i = 0; i < F.hairColors.length; i++)
        if (F.hairColors[i] && F.hairColors[i].join(',') === rgb.join(',')) return F.hairColorNames[i];
      return 'UNKNOWN'; };
    const iOf = (n) => F.hairColorNames.indexOf(n);
    const MAG = F.hairColors[iOf('MAGENTA')], ACID = F.hairColors[iOf('ACID')];

    const rows = [];
    for (let i = 0; i < N; i++) {
      const id = 'match:' + i;
      const np = NPC_FACTORY.npcFrom(id), sp = faceFor(id), lk = BOH_PERSONLOOK.lookFor(id, canon);
      const worn = lk.worn;
      const realB = renderBody(np, lk, sp, worn);
      const realP = renderPortrait(sp);

      /* ---------- THE EYES ---------- */
      const spI = JSON.parse(JSON.stringify(sp)); spI.eyes.iris = [255, 0, 255];
      const bEye = diff(realB, renderBody(np, lk, spI, worn));
      const pEye = diff(realP, renderPortrait(spI));
      const bEyeC = dom(bEye, realB), pEyeC = dom(pEye, realP);

      /* ---------- THE HAIR ---------- */
      const probe = (np.hairColor && np.hairColor.join(',') === MAG.join(',')) ? ACID : MAG;
      const npH = JSON.parse(JSON.stringify(np)); npH.hairColor = probe.slice();
      const spH = JSON.parse(JSON.stringify(sp)); spH.hair.color = probe.slice();
      spH.hair.roots = probe.map(v => v * 0.4 | 0);
      const bHair = diff(realB, renderBody(npH, lk, spH, worn));
      const pHair = diff(realP, renderPortrait(spH));

      rows.push({ id: id,
        irisSpec: sp.eyes.iris.slice(),
        eyePixBody: bEye.length, eyePixPortrait: pEye.length,
        eyeBody: bEyeC, eyePortrait: pEyeC,
        hairSpec: sp.hair.color ? sp.hair.color.slice() : null,
        factoryHair: np.hairColor ? np.hairColor.slice() : null,
        factoryHairName: nameOf(np.hairColor),
        hairFromArt: !!sp._hairFromArt,
        hairPixBody: bHair.length, hairPixPortrait: pHair.length,
        hairBodyMean: mean(bHair, realB), hairPortraitMean: mean(pHair, realP),
        hairBodyDom: dom(bHair, realB), hairPortraitDom: dom(pHair, realP),
        cutPortrait: sp.hair.name || null, cutBody: (worn && worn.hair) || null,
        pdHairLayer: np.equipped.hair || null,
        wearsGlasses: !!np.equipped.glasses, wearsHat: !!np.equipped.hat
      });
    }
    G.equipped = keep.eq; G.bodyVar = keep.bv; window.G_WORN = keep.worn;
    G.faceAs = keep.fa; skinTone = keep.sk; hairColor = keep.hc; clear();
    return { rows: rows, playerIris: pface.eyes.iris.slice(), n: N };
  }, N);

  out.pageErrors = errs;
  out.when = new Date().toISOString();
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out));
  console.log('wrote ' + OUT + '  rows ' + out.rows.length + (errs.length ? '  PAGE ERRORS ' + errs.length : ''));
  await b.close();
})();

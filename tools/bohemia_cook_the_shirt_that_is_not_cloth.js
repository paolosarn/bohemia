/* COOK: THE SHIRT THAT IS NOT CLOTH (9/23/26, CHARACTER, [runway redo])
 *
 * HIS INSTRUCTION, and the half of it this lane has now deferred twice in writing:
 * "they all need to get redone in an ANALOG HORROR DIRECTION MEETS Rick Owens meets
 * Balenciaga meets Bottega Veneta." Two rounds of runway work answered "Rick Owens meets
 * Balenciaga" and BOTH RECORDS SAID PLAINLY THAT IT DID NOT ANSWER "ANALOG HORROR MEETS",
 * because a better-cut trouser is not a wrong thing. This is that half.
 *
 * RNWY-16, BOTTEGA VENETA, TROMPE-L'OEIL LEATHER. The FW22 show opened on a white tank and
 * straight jeans made ENTIRELY of leather, tooled to look exactly like cotton; the SS23
 * check was printed twelve times over to reach flannel's depth. Mundane at a glance, wrong
 * on the second look.
 * *** IT IS THE ANALOG HORROR BIBLE'S RULE 1 WEARING CLOTHES: "the ordinary frame, one
 * wrong thing... name the wrong thing in one sentence or the frame fails." A plain plaid
 * shirt that is not cloth is exactly one wrong thing on an otherwise ordinary body. Of the
 * three houses he named it is the ONLY one that answers rule 20 directly rather than being
 * decorated with it afterwards, which is why it was worth waiting for. ***
 *
 * HOW IT IS BUILT, AND WHY IT IS IN THIS LANE AND NOT COOK'S. My own reference line for
 * RNWY-16 says the sprite-scale tell is SHEEN -- a hard specular band where cloth diffuses.
 * A sheen RENDERER would be new art machinery in genTop, and garment ART is COOK's; ONE
 * SYSTEM, ONE SESSION. So this reaches the same read through the one channel that is data:
 * THE RAMP. The MID STEP IS COPIED BYTE FOR BYTE from the cloth ramp it imitates, because
 * the mid step is what the eye reads at a glance; then the floor goes DOWN and the light
 * step goes UP hard, which is what a specular does to a value ramp. Same hue, same cut,
 * same pattern, same generator call, two ramp constants.
 * NOTHING NEW IS DRAWN and no render code is touched. If DIRECTION or COOK later wants the
 * real specular band, this is the data version of the same idea and it does not block it.
 *
 * WHAT THIS MEASURES RATHER THAN CLAIMS, because "you can just about tell" is a taste
 * sentence and this lane has been burned by those:
 *   THE MID STEP IS IDENTICAL -- proven by comparing the two ramps, not by eye.
 *   THE VALUE SPREAD -- how much further apart the dark and light steps sit on the hide
 *     than on the cloth. That number IS the illusion's whole mechanism.
 *   HOW MANY PIXELS ACTUALLY DIFFER between the cloth garment and its hide twin on the
 *     same body, and what share of the garment that is. If the answer were near zero the
 *     cook would be a lie and the record would say so.
 *
 * RIG CHECK (RIG IS LAW): reads only; G_WORN, G.equipped, G.bodyVar, G.age and both caches
 * restored. REUSE CHECK: two ramp constants and two garment lines on the existing
 * generator; no new art, no new render path.
 * NOT WIRED TO ANY FACTION (rule 18, and rule 30's "every re-cook goes through the bible
 * before it comes back as a new id"): the garments exist on the rail, nobody wears them,
 * and the picture goes to VOTE.
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   RNWY-16  trompe-l'oeil leather, the house code this whole cook is. Added to the library
 *          by this lane on 9/22 with its real sources, because he named three houses and
 *          the library held two.
 *   AH-01  our own analog horror bible, rule 1: the ordinary frame with ONE wrong thing,
 *          and its own measure -- "name the wrong thing in one sentence or the frame
 *          fails." The sentence here is: that shirt is not cloth. One thing, nothing else
 *          on the body touched, which is also why the cook refuses to change the cut.
 *   GARM-01  at sprite scale fabric is VALUE BANDS, not drawn fold lines. This is the rule
 *          that makes a ramp the correct instrument for a material illusion, and it is why
 *          a data change can carry it at all.
 *   GARM-03  the wardrobe's locked laws, "a cook never spends both channels on one idea".
 *          The hue is spent on nothing: it is copied from the cloth. Only value moves.
 *
 *   node tools/bohemia_cook_the_shirt_that_is_not_cloth.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_SHIRT_THAT_IS_NOT_CLOTH_9_23_26.txt');

/* THE PAIRS. Each is the SAME garment twice: the cloth one that already shipped, and its
   hide twin. Everything else on the body is held still so the only variable is material. */
const PAIRS = [
  { cloth: 'DUST PLAID SHIRT', hide: 'DUST PLAID HIDE', slot: 'base',
    note: 'a work shirt in a dead valley' },
  { cloth: 'BLUE JEANS', hide: 'BLUE HIDE JEANS', slot: 'legs',
    note: 'the FW22 opening look, jeans that are not denim' }
];
const BASE = { hair: 'DRY TAPER', base: 'WHITE TEE', legs: 'BLUE JEANS', feet: 'BROWN BOOTS' };

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS
    && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate(({ PAIRS, BASE }) => {
    const o = { missing: [], pairs: [], err: null, ramps: {} };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    const canon = {}; for (const g of GARMENTS) if (g && g.st === 'canon' && g.layer) canon[g.n] = g.layer;
    for (const pr of PAIRS) { if (!canon[pr.cloth]) o.missing.push(pr.cloth); if (!canon[pr.hide]) o.missing.push(pr.hide); }
    if (o.missing.length) return o;

    /* The ramps live inside the wardrobe's closure and are not reachable from here, so they
       are read out of the SOURCE FILE below instead -- still read, never retyped. */

    const draw = (worn) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = {}; G.age = 'adult';
      rebuildFromRig(); clear();
      const fr = buildFrame('S', 'idle', 0);
      const W = fr.CW, H = fr.CH;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(W, H), d = im.data;
      for (let i = 0; i < fr.px.length; i++) {
        const q = fr.px[i]; if (!q) continue;
        d[i * 4] = q[0]; d[i * 4 + 1] = q[1]; d[i * 4 + 2] = q[2]; d[i * 4 + 3] = 255;
      }
      g2.putImageData(im, 0, 0);
      return { cv: c, px: fr.px.slice(), W: W, H: H };
    };

    try {
      for (const pr of PAIRS) {
        const wc = {}; for (const k in BASE) wc[k] = BASE[k];
        wc[pr.slot] = pr.cloth;
        const wh = {}; for (const k in BASE) wh[k] = BASE[k];
        wh[pr.slot] = pr.hide;
        const A = draw(wc), B = draw(wh);
        /* HOW MANY PIXELS ACTUALLY MOVED, and what share of the painted body that is.
           A near-zero answer would mean the cook is a lie, and the record would print it. */
        let diff = 0, painted = 0, worstD = 0;
        for (let i = 0; i < A.px.length; i++) {
          const a = A.px[i], c2 = B.px[i];
          if (a || c2) painted++;
          if (!a || !c2) { if (a || c2) diff++; continue; }
          const dd = Math.abs(a[0] - c2[0]) + Math.abs(a[1] - c2[1]) + Math.abs(a[2] - c2[2]);
          if (dd > 0) { diff++; if (dd > worstD) worstD = dd; }
        }
        o.pairs.push({ cloth: pr.cloth, hide: pr.hide, note: pr.note,
                       clothCv: A.cv.toDataURL('image/png'), hideCv: B.cv.toDataURL('image/png'),
                       diff: diff, painted: painted, share: +(100 * diff / painted).toFixed(1),
                       worst: worstD });
      }
    } catch (e) { o.err = String(e && e.message || e); }

    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { PAIRS, BASE });

  if (R.missing.length) { console.error('REFUSING TO COOK, not on the rail: ' + R.missing.join(', ')); await b.close(); process.exit(2); }
  if (R.err) { console.error('THREW: ' + R.err); await b.close(); process.exit(3); }

  /* THE RAMPS, PARSED OUT OF THE ALPHA'S OWN SOURCE. They sit inside the wardrobe closure so
     a running page cannot hand them over; reading the declaration is the next most honest
     thing and it still means nobody retyped a number into this tool. */
  const SRC = fs.readFileSync(ALPHA, 'utf8');
  const rampOf = (name) => {
    const m = new RegExp('var\\s+' + name + '\\s*=\\s*\\{dk:\\[([^\\]]+)\\],mid:\\[([^\\]]+)\\],lt:\\[([^\\]]+)\\]\\}').exec(SRC);
    if (!m) return null;
    const n = (s2) => s2.split(',').map(v => parseInt(v.trim(), 10));
    return { dk: n(m[1]), mid: n(m[2]), lt: n(m[3]) };
  };
  R.ramps = { DUSTSAND: rampOf('DUSTSAND'), DUSTHIDE: rampOf('DUSTHIDE'),
              DENIM: rampOf('DENIM'), DENIMHIDE: rampOf('DENIMHIDE') };
  for (const k in R.ramps) if (!R.ramps[k]) {
    console.error('REFUSING TO WRITE: could not read the ramp ' + k + ' out of the alpha. A cook');
    console.error('that cannot read its own numbers must not print a table of them.');
    process.exit(4);
  }

  /* THE SHEET, built in the page so the canvases are reachable. */
  const sheet = await p.evaluate(({ pairs }) => {
    const load = (u) => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.src = u; });
    return Promise.all(pairs.flatMap(pr => [load(pr.clothCv), load(pr.hideCv)])).then(imgs => {
      const CELL = 210, PAD = 20, HEAD = 76, LAB = 74, BODY = 200;
      const cv = document.createElement('canvas');
      cv.width = imgs.length * CELL + PAD * 2; cv.height = HEAD + BODY + LAB + PAD;
      const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
      g.fillStyle = '#b9a373'; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#3a2f1c'; g.textBaseline = 'top';
      g.font = 'bold 20px ui-monospace, monospace';
      g.fillText('ONE OF THESE SHIRTS IS NOT CLOTH', PAD, PAD);
      g.font = '13px ui-monospace, monospace';
      g.fillText('same shirt, same cut, same pattern, same colour. one of them is leather made to look like cloth.',
                 PAD, PAD + 25);
      g.fillText('that is a real Bottega Veneta trick, and it is the horror rule: an ordinary thing with one thing wrong.',
                 PAD, PAD + 42);
      const floor = HEAD + BODY;
      g.strokeStyle = 'rgba(58,47,28,0.30)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(PAD, floor + 0.5); g.lineTo(cv.width - PAD, floor + 0.5); g.stroke();
      const s = BODY / 112;
      imgs.forEach((im, i) => {
        const x = PAD + i * CELL;
        g.drawImage(im, x + (CELL - 112 * s) / 2, floor - 112 * s, 112 * s, 112 * s);
        const pr = pairs[i >> 1], isHide = (i % 2) === 1;
        g.fillStyle = '#3a2f1c'; g.font = 'bold 12px ui-monospace, monospace';
        g.fillText(isHide ? 'NOT CLOTH' : 'CLOTH', x + 3, floor + 7);
        g.font = '11px ui-monospace, monospace';
        g.fillText(isHide ? pr.hide : pr.cloth, x + 3, floor + 23);
        /* WORD WRAP TO THE CELL. The first render ran cell three's note straight through
           cell four's text -- the same colliding-caption defect this lane already fixed on
           the twelve-people sheet, made again because a flat fillText does not know how
           wide a cell is. */
        const wrap = (txt, y0) => {
          let line = '', ln = 0;
          for (const w2 of String(txt).split(' ')) {
            if (line && (line + ' ' + w2).length > 26) { g.fillText(line, x + 3, y0 + ln * 13); line = w2; ln++; }
            else line = line ? line + ' ' + w2 : w2;
          }
          if (line) g.fillText(line, x + 3, y0 + ln * 13);
        };
        if (isHide) wrap(pr.share + '% of the body changed. nothing else did.', floor + 38);
        else wrap(pr.note, floor + 38);
      });
      return cv.toDataURL('image/png');
    });
  }, { pairs: R.pairs });
  await b.close();

  fs.mkdirSync(VOTE, { recursive: true });
  const f = path.join(VOTE, 'CHARACTER_THE_SHIRT_THAT_IS_NOT_CLOTH.png');
  fs.writeFileSync(f, Buffer.from(sheet.split(',')[1], 'base64'));

  const spread = (r) => Math.max(r.lt[0], r.lt[1], r.lt[2]) - Math.max(r.dk[0], r.dk[1], r.dk[2]);
  const mids = (a, b2) => (a.mid[0] === b2.mid[0] && a.mid[1] === b2.mid[1] && a.mid[2] === b2.mid[2]);
  const L = [];
  L.push('THE SHIRT THAT IS NOT CLOTH  --  CHARACTER lane, 9/23/26, [runway redo]');
  L.push('');
  L.push('HIS INSTRUCTION WAS "ANALOG HORROR DIRECTION MEETS Rick Owens meets Balenciaga meets');
  L.push('Bottega Veneta." Two rounds of runway work answered the middle two names, and BOTH');
  L.push('RECORDS SAID PLAINLY THAT NEITHER ANSWERED "ANALOG HORROR MEETS", because a better-cut');
  L.push('trouser is not a wrong thing. THIS IS THAT HALF, and it is the one house code that');
  L.push('answers rule 20 directly instead of being decorated with it afterwards.');
  L.push('');
  L.push('RNWY-16: the FW22 show opened on a white tank and straight jeans made ENTIRELY of');
  L.push('leather, tooled to look exactly like cotton; the SS23 check was printed twelve times');
  L.push('to reach flannel\'s depth. THE ANALOG HORROR BIBLE\'S RULE 1 IS "the ordinary frame, one');
  L.push('wrong thing... name the wrong thing in one sentence or the frame fails." The sentence');
  L.push('here is six words: THAT SHIRT IS NOT CLOTH.');
  L.push('');
  L.push('MEASURED, NOT ASSERTED, because "you can just about tell" is a taste sentence:');
  try {
    const R1 = R.ramps;
    L.push('  THE MID STEP IS IDENTICAL, which is what makes it read as the same garment:');
    L.push('    DUST PLAID  cloth mid ' + JSON.stringify(R1.DUSTSAND.mid) + '   hide mid ' + JSON.stringify(R1.DUSTHIDE.mid)
      + '   ' + (mids(R1.DUSTSAND, R1.DUSTHIDE) ? 'SAME' : '*** NOT THE SAME, THE COOK IS WRONG ***'));
    L.push('    BLUE JEANS  cloth mid ' + JSON.stringify(R1.DENIM.mid) + '   hide mid ' + JSON.stringify(R1.DENIMHIDE.mid)
      + '   ' + (mids(R1.DENIM, R1.DENIMHIDE) ? 'SAME' : '*** NOT THE SAME, THE COOK IS WRONG ***'));
    L.push('');
    L.push('  AND THE VALUE SPREAD IS THE WHOLE MECHANISM -- dark floor down, specular up:');
    L.push('    DUST PLAID  cloth spread ' + spread(R1.DUSTSAND) + '   hide spread ' + spread(R1.DUSTHIDE)
      + '   ' + (spread(R1.DUSTHIDE) / spread(R1.DUSTSAND)).toFixed(2) + 'x');
    L.push('    BLUE JEANS  cloth spread ' + spread(R1.DENIM) + '   hide spread ' + spread(R1.DENIMHIDE)
      + '   ' + (spread(R1.DENIMHIDE) / spread(R1.DENIM)).toFixed(2) + 'x');
  } catch (e) { L.push('  (the ramps were not reachable from the page: ' + e.message + ')'); }
  L.push('');
  L.push('  HOW MUCH OF THE BODY ACTUALLY CHANGED. A near-zero answer would mean this cook is a');
  L.push('  lie dressed as a finding, so it is printed either way:');
  for (const pr of R.pairs)
    L.push('    ' + pr.cloth.padEnd(18) + '-> ' + pr.hide.padEnd(18)
      + pr.diff + ' of ' + pr.painted + ' painted pixels moved  (' + pr.share + '%), worst pixel ' + pr.worst + '/765');
  L.push('');
  L.push('WHY THIS IS A RAMP AND NOT A SHEEN RENDERER. My own reference line for RNWY-16 says');
  L.push('the sprite-scale tell is a hard specular band, and a band needs new drawing code in');
  L.push('the garment generator -- which is COOK\'s art, not this lane\'s (ONE SYSTEM, ONE');
  L.push('SESSION). So it reaches the same read through the one channel that is DATA: the ramp.');
  L.push('GARM-01 is the licence -- "at sprite scale fabric is VALUE BANDS, not drawn fold');
  L.push('lines" -- and GARM-03 is kept too, because the hue is spent on nothing at all: it is');
  L.push('copied from the cloth, and only value moves. If COOK later wants the real band, this');
  L.push('is the data version of the same idea and it blocks nothing.');
  L.push('');
  L.push('NOT WIRED TO ANY FACTION. The two garments are on the rail and nobody wears them. Rule');
  L.push('18 holds the play surface; rule 30 says a re-cook goes through the bible before it');
  L.push('comes back, and this went through rule 1 by construction. The picture is in VOTE.');
  L.push('');
  L.push('HONEST LIMIT: this is ONE wrong thing done ONE way. It does not make the valley analog');
  L.push('horror and nobody should read it as that. It is the first garment in this wardrobe');
  L.push('whose whole reason to exist is that something about it is wrong.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  if (errs.length) console.log('\n  page errors: ' + errs.slice(0, 2).join(' | '));
  console.log('\n  wrote slices/vote/CHARACTER_THE_SHIRT_THAT_IS_NOT_CLOTH.png  '
    + (fs.statSync(f).size / 1024).toFixed(0) + ' KB');
})();

/* DOES THE RAMP SURVIVE? (9/5/26, CHARACTER lane, [clothes wired] WIRE-THE-REMAKE)
 *
 * THE JOB: "ART makes pixels, CHARACTER makes them worn." The wire has been checked for
 * REACHABILITY (every layer wired, every garment worn, every garment on a bench) and for
 * the card's one WEARING rule (one accent per body). This is the last unmeasured link:
 * does a garment's RAMP still exist by the time it is on a body?
 *
 * WHY IT MATTERS RIGHT NOW, and why it is this lane's and not COOK's. DIRECTION's style
 * card says `"ramp_steps": [4, 6]` -- four to six hue-shifted steps per garment. COOK is
 * about to re-cook 280 garments to that number. IF THE PIPELINE FLATTENS A SIX-STEP RAMP
 * ON THE WAY TO THE BODY, every one of those garments lands looking wrong and the cook
 * gets blamed for a loss that happened downstream of the cook. Nobody has ever checked.
 *
 * BOTH SCALES, because the card names both: `"compose": 112, "legacy": 56`. A ramp that
 * survives at 112 and dies at 56 is a real finding, since 56 is what a lot of the game
 * still draws.
 *
 * HOW: render the body wearing NOTHING but the garment, diff against the bare body, and
 * count the DISTINCT colours the garment contributed. Measured off what the game actually
 * draws rather than off the gen function's source, because the question is precisely
 * whether the drawing keeps what the source asked for.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads and reports, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel; restores G_WORN and the caches it clears.
 *   built on: buildFrame (read-only)   joints: none   parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Same render-alone-and-diff harness as
 * tools/bohemia_one_accent_only.js (9/5), which is why it is not written twice.
 *
 *   node tools/bohemia_does_the_ramp_survive.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const CARD = path.join(REPO, 'records/BOHEMIA_STYLE_CARD_9_5_26.md');
const OUT = path.join(REPO, 'records/BOHEMIA_DOES_THE_RAMP_SURVIVE_9_5_26.txt');

(async () => {
  /* THE WANTED STEP COUNT IS THE CARD'S, READ FROM THE CARD. */
  const cardTxt = fs.readFileSync(CARD, 'utf8');
  const J = JSON.parse((cardTxt.match(/```json\s*([\s\S]*?)```/) || [, '{}'])[1]);
  const WANT = J.ramp_steps || [4, 6];

  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 60000 });

  const r = await p.evaluate(() => {
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const shot = (worn) => {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of ['hat','glasses','hair','shirt','jacket','pants','shoes']) eq[s] = '';
      G.equipped = eq; window.G_WORN = worn; clear();
      return buildFrame('S', 'idle', 0);
    };
    const BARE = { base: '', legs: '', feet: '', hair: '' };
    const bare = shot(BARE);
    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);

    const rows = [];
    for (const g of canon) {
      const w = {}; for (const k in BARE) w[k] = '';
      w[g.layer] = g.n;
      let fr; try { fr = shot(w); } catch (e) { continue; }
      const cols = {}; let px = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const a = fr.px[i], c = bare.px[i];
        if (!a) continue;
        if (c && a[0] === c[0] && a[1] === c[1] && a[2] === c[2]) continue;
        cols[a[0] + ',' + a[1] + ',' + a[2]] = (cols[a[0] + ',' + a[1] + ',' + a[2]] || 0) + 1;
        px++;
      }
      /* A STEP IS A TONE THAT COVERS REAL AREA. Counting every distinct RGB would count
         one-pixel anti-alias strays and dithering seams as ramp steps, which is how a
         crushed ramp could report as a rich one. A step has to hold at least 3% of the
         garment's own pixels to count as a step of its ramp. */
      const keys = Object.keys(cols);
      const steps = keys.filter(k => cols[k] >= Math.max(2, px * 0.03)).length;
      rows.push({ n: g.n, layer: g.layer, px: px, distinct: keys.length, steps: steps });
    }
    window.G_WORN = keepW; G.equipped = keepE; clear();
    return { rows, rig: (typeof BAKED !== 'undefined' && BAKED && BAKED.W) ? BAKED.W : null };
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const rows = r.rows.filter(x => x.px > 0);
  const under = rows.filter(x => x.steps < WANT[0]);
  const over = rows.filter(x => x.steps > WANT[1]);
  const inband = rows.length - under.length - over.length;
  const hist = {};
  for (const x of rows) hist[x.steps] = (hist[x.steps] || 0) + 1;

  const L = [];
  L.push('DOES THE RAMP SURVIVE? -- a garment\'s tones, counted on the body the game draws');
  L.push('9/5/26, CHARACTER lane. [clothes wired] WIRE-THE-REMAKE.');
  L.push('');
  L.push('THE CARD asks for ' + WANT[0] + '-' + WANT[1] + ' hue-shifted steps per garment');
  L.push('("ramp_steps", records/BOHEMIA_STYLE_CARD_9_5_26.md). COOK is about to re-cook 280');
  L.push('garments to that number. IF THE PIPELINE FLATTENS A SIX-STEP RAMP ON THE WAY TO');
  L.push('THE BODY, every one of them lands wrong and the cook gets blamed for a loss that');
  L.push('happened downstream. Nobody had ever checked. Rig width: ' + r.rig + ' px.');
  L.push('');
  L.push('Each garment rendered ALONE and diffed against the bare body; a step counts when');
  L.push('a tone holds at least 3% of that garment\'s own pixels, so one-pixel strays and');
  L.push('dither seams cannot inflate a crushed ramp into a rich one.');
  L.push('');
  L.push('  garments measured              ' + rows.length);
  L.push('  inside the card\'s ' + WANT[0] + '-' + WANT[1] + ' band        ' + inband +
    '   (' + (inband / rows.length * 100).toFixed(1) + '%)');
  L.push('  FEWER than ' + WANT[0] + ' steps           ' + under.length);
  L.push('  more than ' + WANT[1] + ' steps            ' + over.length);
  L.push('');
  L.push('STEPS THAT SURVIVE, ACROSS THE WARDROBE');
  L.push('');
  for (const k of Object.keys(hist).map(Number).sort((a, c) => a - c))
    L.push('  ' + String(k).padStart(2) + ' step(s)   ' + String(hist[k]).padStart(4) +
      '   ' + (hist[k] / rows.length * 100).toFixed(1) + '%');
  L.push('');
  if (under.length) {
    L.push('  THE FLATTEST (fewest tones surviving onto the body)');
    for (const x of under.sort((a, c) => a.steps - c.steps).slice(0, 20))
      L.push('    ' + x.layer.padEnd(8) + x.n.padEnd(26) + x.steps + ' step(s), ' +
        x.px + ' px, ' + x.distinct + ' distinct');
    L.push('');
  }
  /* IS THE BAND EVEN ACHIEVABLE ON A SMALL PIECE? A belt is 56 pixels. Six tones on 56
     pixels is nine pixels a tone, and the card's own floor here (3% of the garment) is
     under two. Before telling COOK anything, check whether the misses are simply the
     SMALL garments -- because if they are, the card is asking for a step count a pair of
     sunglasses cannot physically hold, and that is worth saying BEFORE 280 pieces are
     cooked against it rather than after. */
  const med = (a) => { if (!a.length) return 0; const s = a.slice().sort((x, y) => x - y);
    return s[Math.floor(s.length / 2)]; };
  const inb = rows.filter(x => x.steps >= WANT[0] && x.steps <= WANT[1]);
  const medUnder = med(under.map(x => x.px)), medIn = med(inb.map(x => x.px));
  const tiny = rows.filter(x => x.px <= 200);
  const tinyUnder = tiny.filter(x => x.steps < WANT[0]).length;
  L.push('IS THE BAND ACHIEVABLE ON A SMALL PIECE?');
  L.push('');
  L.push('  median pixels, garments IN the band      ' + medIn);
  L.push('  median pixels, garments UNDER the band   ' + medUnder);
  L.push('  garments of 200 px or fewer              ' + tiny.length +
    ', of which ' + tinyUnder + ' are under the band (' +
    (tiny.length ? (tinyUnder / tiny.length * 100).toFixed(0) : '0') + '%)');
  L.push('');
  L.push('FOR DIRECTION AND COOK, BEFORE 280 PIECES ARE COOKED AGAINST THE CARD: a belt is');
  L.push('56 pixels and a pair of shades is 76. Four to six hue-shifted steps on 56 pixels');
  L.push('is nine pixels a tone. The step count may need a floor by garment SIZE, or the');
  L.push('small pieces will fail a rule they cannot physically pass. Reported, not decided');
  L.push('-- the card is DIRECTION\'s and the cooking is COOK\'s.');
  L.push('');
  L.push('READ THIS BEFORE DRAWING A CONCLUSION. The wardrobe PREDATES the card, so a');
  L.push('garment outside the band is not a defect -- it has simply never been cooked to');
  L.push('that number. WHAT THIS MEASURES IS THE PIPELINE: if garments with rich ramps in');
  L.push('their gen functions arrive on the body with the same richness, the wire carries');
  L.push('what COOK sends and the remake is safe to run. A NUMBER IS NOT A FINDING UNTIL');
  L.push('YOU KNOW WHAT IT IS COUNTING (9/5, the round the brown boots were called an');
  L.push('accent).');
  L.push('');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nWROTE ' + path.relative(REPO, OUT));
})();

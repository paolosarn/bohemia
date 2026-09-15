#!/usr/bin/env node
/* THE NAME MATCHES THE RAMP GATE (9/15/26, CHARACTER lane, VAMILY [names lie])
 *
 * THE ROW: "COPPER WORK SHIRT is #506e60, GREEN, and that one lie is the whole reason
 * Trades measured 121 degrees off his chosen orange... gate it so a new garment cannot
 * ship with a colour word its ramp contradicts."
 *
 * WHY THIS IS NOT A COSMETIC CHECK. COLOUR IS TERRITORY (8/26): a faction's colour states
 * who would defend you, and this lane dresses factions BY NAME off FACTION_LOOKS. A garment
 * that lies in its name puts the wrong faction's statement on a body, and nobody finds out
 * until somebody measures the STREET -- which is how Trades was found 121 degrees off the
 * orange he chose, three weeks after it shipped.
 *
 * FOUR QUESTIONS, NOT ONE, because a colour word does not always name a hue:
 *   CHROMATIC (copper, rust, oxblood, olive, teal, cobalt, patina...) -> HUE, within 40 deg
 *   EARTH     (dust, sand, khaki)   -> an earth hue AND a chroma ceiling, both
 *   NEUTRAL   (ash, slate, steel, storm, grey, bone) -> SATURATION, because these name a
 *             greyness and demanding a hue of "ash" would invent a rule nobody wrote
 *   DARK      (charcoal, soot, coal, black) -> VALUE
 *
 * *** THE FIRST CUT OF THIS INSTRUMENT FILED DUST, SAND AND KHAKI AS GREYS AND REPORTED 27
 * LIARS. 23 OF THE 27 WERE CORRECT GARMENTS. *** They were tans at hue 45 sitting a few
 * hundredths over a saturation ceiling I had invented; khaki is #C3B091, saturation 0.26,
 * and sand is #C2B280, saturation 0.34 -- neither is a grey. Acting on that would have
 * re-ramped two dozen correct garments. THE TELL WAS THE SHAPE OF THE RESULT: 23 failures
 * clustered within 0.09 of one dial, and a real defect does not queue up politely against
 * your own threshold. The real count was 4, and they were all the one the row named.
 *
 * AND A COMPOUND NOUN IS NOT A COLOUR CLAIM: a DUST MASK is a mask FOR dust. The first cut
 * called RUST DUST MASK a liar for being rust-coloured while passing the word RUST in the
 * same name. When one garment makes a tool contradict itself, the tool is wrong.
 *
 * THE RULER: each garment is rendered on the body and diffed against the same body naked,
 * so the pixels measured are the GARMENT'S OWN and never the skin under it. Dominant hue is
 * taken by AREA in 30-degree buckets -- the same buckets the faction colour file and its
 * gate use, so board, record and gate stay one ruler.
 *
 *   node gates/the_name_matches_the_ramp_gate.js
 */
'use strict';
const path = require('path');
const fs = require('fs');
const REPO = path.dirname(__dirname);
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== THE NAME MATCHES THE RAMP: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

/* ONE DICTIONARY, SHARED WITH THE TOOL BY BEING READ OUT OF IT rather than retyped. A
   second copy of this table is the bug the whole row is about: two places that can disagree
   about what copper means. The tool is the source; this parses its WORDS block. */
function dictionaryFromTool() {
  const src = fs.readFileSync(path.join(REPO, 'tools/bohemia_does_the_name_match_the_ramp.js'), 'utf8');
  const a = src.indexOf('const WORDS = {');
  const b = src.indexOf('\n    };', a);
  if (a < 0 || b < 0) return null;
  return src.slice(a, b + 6);
}

(async () => {
  const dict = dictionaryFromTool();
  ok('the dictionary is READ out of the tool, never retyped here -- two tables that can '
     + 'disagree about what copper means is the bug this row is about', !!dict);
  if (!dict) done();

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 90000 });

  const R = await p.evaluate((dictSrc) => {
    const WORDS = eval('(' + dictSrc.replace('const WORDS = ', '') .replace(/;\s*$/, '') + ')');
    const TOL = 40, SAT_MAX = 0.34, VAL_MAX = 0.42;
    const o = { liars: [], checked: 0, named: 0, canon: 0, err: [], words: Object.keys(WORDS).length };
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    G.equipped = bare(); window.G_WORN = {}; clear();
    let base = null; try { base = buildFrame('S', 'idle', 0); } catch (e) { o.err.push('bare'); }
    if (!base) { window.G_WORN = keepW; G.equipped = keepE; clear(); return o; }
    const hsv = (r, g2, bl) => {
      r /= 255; g2 /= 255; bl /= 255;
      const mx = Math.max(r, g2, bl), mn = Math.min(r, g2, bl), d = mx - mn;
      let h = 0;
      if (d) { if (mx === r) h = 60 * (((g2 - bl) / d) % 6);
               else if (mx === g2) h = 60 * ((bl - r) / d + 2);
               else h = 60 * ((r - g2) / d + 4); }
      if (h < 0) h += 360;
      return [h, mx ? d / mx : 0, mx];
    };
    const COMPOUND = /DUST MASK/;
    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);
    o.canon = canon.length;
    for (const gm of canon) {
      const found = Object.keys(WORDS).filter(w => {
        if (w === 'DUST' && COMPOUND.test(gm.n)) return false;
        return new RegExp('(^|[^A-Z])' + w + '([^A-Z]|$)').test(gm.n);
      });
      if (!found.length) continue;
      o.named++;
      G.equipped = bare(); window.G_WORN = {}; window.G_WORN[gm.layer] = gm.n; clear();
      let fr; try { fr = buildFrame('S', 'idle', 0); } catch (e) { o.err.push(gm.n); continue; }
      const bucket = new Array(12).fill(0);
      let n = 0, satSum = 0, valSum = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const a = fr.px[i], c = base.px[i];
        if (!a) continue;
        if (c && a[0] === c[0] && a[1] === c[1] && a[2] === c[2]) continue;
        const v = hsv(a[0], a[1], a[2]);
        n++; satSum += v[1]; valSum += v[2] / 255;
        if (v[1] >= 0.15) bucket[Math.floor(v[0] / 30) % 12]++;
      }
      if (!n) { o.err.push(gm.n + ' painted nothing'); continue; }
      let bi = 0; for (let k = 1; k < 12; k++) if (bucket[k] > bucket[bi]) bi = k;
      const voted = bucket.reduce((x, y) => x + y, 0);
      const domHue = voted ? bi * 30 + 15 : null;
      const sat = satSum / n, val = valSum / n;
      for (const w of found) {
        const spec = WORDS[w]; o.checked++;
        let why = null;
        const hueGap = () => { let d = Math.abs(domHue - spec.hue) % 360; return d > 180 ? 360 - d : d; };
        if (spec.kind === 'hue' || spec.kind === 'earth') {
          if (domHue == null) why = 'names a colour and renders with no colour in it';
          else {
            const d = hueGap();
            if (d > (spec.tol || TOL)) why = 'hue ' + Math.round(domHue) + ' against ' + spec.hue + ', ' + Math.round(d) + ' out';
            else if (spec.kind === 'earth' && sat > spec.satMax)
              why = 'the right hue but saturation ' + sat.toFixed(2) + ', past ' + spec.satMax;
          }
        } else if (spec.kind === 'neutral') {
          if (sat > SAT_MAX) why = 'names a grey and renders at saturation ' + sat.toFixed(2);
        } else if (val > VAL_MAX) why = 'names a dark and renders at value ' + val.toFixed(2);
        if (why) o.liars.push(gm.n + ' [' + w + '] ' + why);
      }
    }
    window.G_WORN = keepW; G.equipped = keepE; clear();
    return o;
  }, dict);
  await b.close();

  ok('*** THE WARDROBE RENDERED AT ALL *** -- every number below is meaningless over an '
     + 'empty rail (' + R.canon + ' canon garments, ' + R.named + ' name a colour)',
     R.canon > 250 && R.named > 100);
  ok('the dictionary covers the words the rail actually uses, not the seven the row named ('
     + R.words + ' words)', R.words >= 20);
  ok('*** NO CANON GARMENT WEARS A COLOUR WORD ITS RAMP CONTRADICTS *** (' + R.liars.length
     + ' of ' + R.checked + ' claims lie'
     + (R.liars.length ? ': ' + R.liars.slice(0, 6).join(' | ') : '') + ')',
     R.liars.length === 0);
  ok('and enough claims were actually checked for that green to mean something ('
     + R.checked + ')', R.checked > 150);
  /* *** FOUND BY MUTATION, AND IT WAS A REAL HOLE. *** Adding a garment with a lying name
     and a ramp that does not exist made it paint NOTHING, so it was skipped with a note and
     THE GATE STAYED GREEN. A garment that names a colour and cannot be measured is not a
     pass; it is a garment nobody is checking, which is the state this whole row exists to
     end. Silence is not a green. */
  ok('*** AND EVERY GARMENT THAT NAMES A COLOUR WAS ACTUALLY MEASURED *** -- one that '
     + 'paints nothing is not a pass, it is a garment nobody is checking ('
     + R.err.length + ' unmeasured'
     + (R.err.length ? ': ' + R.err.slice(0, 4).join(', ') : '') + ')',
     R.err.length === 0);
  ok('and PATINA is in the dictionary, so the four garments the row was opened about stay '
     + 'held to green instead of quietly drifting back', /PATINA:/.test(dict));
  ok('and COPPER is still held to orange, so a real copper garment cannot ship green later',
     /COPPER:\s*\{\s*kind:\s*'hue',\s*hue:\s*29/.test(dict));

  if (R.err.length) console.log('  note: ' + R.err.length + ' did not measure -- ' + R.err.slice(0, 3).join(', '));
  if (errs.length) console.log('  note: page errors -- ' + errs.slice(0, 2).join(' | '));
  console.log('\n  ' + R.named + ' garments name a colour, ' + R.checked + ' claims checked, ' + R.liars.length + ' lie');
  done();
})();

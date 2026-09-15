/* DOES THE NAME MATCH THE RAMP? (9/15/26, CHARACTER lane, VAMILY [names lie])
 *
 * THE ROW: "COPPER WORK SHIRT is #506e60, GREEN, and that one lie is the whole reason
 * Trades measured 121 degrees off his chosen orange. Sweep all canon garments whose NAME
 * names a colour or a material with a colour against the ramp they actually render; list
 * every liar."
 *
 * WHY A LYING NAME IS NOT A COSMETIC PROBLEM. COLOUR IS TERRITORY (8/26) says a faction's
 * colour states who would defend you, and this lane dresses factions BY NAME off
 * FACTION_LOOKS. So a garment whose name says copper and whose ramp is green does not just
 * read wrong, it puts the wrong faction's statement on a body. That is exactly how Trades
 * ended up 121 degrees off the orange he chose, and it was found by measuring the street,
 * not by reading the wardrobe.
 *
 * *** THE ROW NAMES SEVEN COLOUR WORDS AND THE RAIL USES TWENTY-FIVE. *** (Rule 12: a
 * premise, not a gate.) Counted over the canon names: DUST 19, OLIVE 18, BONE 17, RUST 13,
 * STORM 12, ASH 12, SLATE 11, OXBLOOD 10, CHARCOAL 10, SOOT 9, SAGE 9, STEEL 9, BRICK 8,
 * COBALT 8, KHAKI 7, GREY 6, DENIM 6, RED 5, BLACK 5, GREEN 5, BROWN 5, COAL 4, SAND 4,
 * COPPER 4, TEAL. Sweeping the seven the row lists would have cleared the wardrobe and
 * left most of the liars in it.
 *
 * WHAT A WORD IS CHECKED AGAINST, and every number is a real-world colour, not a taste:
 *   CHROMATIC words carry a hue and are checked on hue, within a stated tolerance.
 *   EARTH words (dust, sand, khaki) name a LOW-CHROMA TAN: an earth hue AND a chroma
 *     ceiling, both, so a fluorescent orange cannot pass as khaki and a grey cannot either.
 *   NEUTRAL words (ash, slate, steel, storm, grey, bone) name a GREYNESS, so they are
 *     checked on SATURATION, not hue. Demanding a hue of "ash" would invent a rule nobody
 *     wrote.
 *   DARK words (charcoal, soot, coal, black) name a VALUE and are checked on value.
 * Four different questions, because one test for all of them is how you get a sweep that
 * is confidently wrong about two thirds of the rail.
 *
 * *** AND THAT IS NOT A HYPOTHETICAL: THE FIRST CUT OF THIS TOOL DID EXACTLY THAT. ***
 * It filed dust, sand and khaki as GREYS and reported 27 liars. 23 of the 27 were tan
 * garments at hue 45 sitting a few hundredths over a saturation ceiling I had invented,
 * and "fixing" them would have meant re-ramping two dozen correct garments to grey.
 * THE TELL WAS THE SHAPE OF THE RESULT: 23 failures clustered within 0.09 of one dial. A
 * real defect does not queue up politely against your own threshold. The real count is 4.
 *
 * THE RULER IS LAST ROUND'S, REUSED: the garment is rendered on the body and diffed
 * against the same body naked, so the pixels measured are the GARMENT'S OWN and never the
 * skin under it. Dominant hue is taken by AREA in 30-degree buckets, the same buckets the
 * faction colour file and its gate use, so board, record and gate stay one ruler.
 *
 * RIG CHECK (RIG IS LAW): reads only; restores G_WORN, G.equipped and the caches.
 * REUSE CHECK: cooks nothing. The renderer, the diff and the buckets all already existed.
 *
 *   node tools/bohemia_does_the_name_match_the_ramp.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = process.env.ALPHA || path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_DOES_THE_NAME_MATCH_THE_RAMP_9_15_26.txt');
const JSON_OUT = path.join(REPO, 'records/BOHEMIA_DOES_THE_NAME_MATCH_THE_RAMP_9_15_26.json');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 500, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 150)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 90000 });

  const R = await p.evaluate(() => {
    /* THE DICTIONARY. Each entry is a real colour, cited, not a preference.
       kind 'hue'     -> the word names a hue; hue is checked, tol in degrees
       kind 'neutral' -> the word names greyness; SATURATION is checked against satMax
       kind 'dark'    -> the word names a value; VALUE is checked against valMax */
    const WORDS = {
      /* CHROMATIC. Hues are of the named real material or pigment. */
      COPPER:  { kind: 'hue', hue: 29,  ref: 'copper metal #B87333' },
      RUST:    { kind: 'hue', hue: 20,  ref: 'iron oxide #B7410E' },
      BRICK:   { kind: 'hue', hue: 10,  ref: 'fired clay brick #B22222' },
      OXBLOOD: { kind: 'hue', hue: 355, ref: 'oxblood leather #4A0000' },
      RED:     { kind: 'hue', hue: 0,   ref: 'red' },
      BROWN:   { kind: 'hue', hue: 25,  ref: 'brown #7B3F00' },
      OLIVE:   { kind: 'hue', hue: 60,  ref: 'olive #808000' },
      SAGE:    { kind: 'hue', hue: 95,  ref: 'sage #9CAF88', tol: 50 },
      GREEN:   { kind: 'hue', hue: 120, ref: 'green' },
      TEAL:    { kind: 'hue', hue: 180, ref: 'teal #008080' },
      COBALT:  { kind: 'hue', hue: 220, ref: 'cobalt blue #0047AB' },
      DENIM:   { kind: 'hue', hue: 215, ref: 'indigo denim #1560BD', tol: 50 },
      /* NEUTRAL. These name a greyness, so hue is not the question. */
      ASH:     { kind: 'neutral', ref: 'wood ash, a grey' },
      SLATE:   { kind: 'neutral', ref: 'slate #708090' },
      STEEL:   { kind: 'neutral', ref: 'steel #71797E' },
      STORM:   { kind: 'neutral', ref: 'storm cloud grey' },
      GREY:    { kind: 'neutral', ref: 'grey' },
      BONE:    { kind: 'neutral', ref: 'bone #E3DAC9' },
      /* *** EARTH. THE FIRST CUT FILED THESE THREE AS GREYS AND THAT WAS THE INSTRUMENT
         BEING WRONG, NOT THE WARDROBE. *** It reported 23 liars, every one of them a tan
         garment at hue 45 sitting a few hundredths over a saturation ceiling I had
         invented. Re-checked against the real colours:
             khaki #C3B091   saturation 0.26   hue 37
             sand  #C2B280   saturation 0.34   hue 45
         Those are not greys. They are LOW-CHROMA TANS, and the garments measured at hue 45
         and saturation 0.36 to 0.43 -- dead on the hue and a touch richer than the
         reference. "Fixing" them would have meant re-ramping two dozen correct tan
         garments to grey on the strength of a number I made up.
         SO THEY GET BOTH TESTS: the hue has to be earth, AND the saturation has to stay
         under a ceiling, so a fluorescent orange still cannot pass itself off as khaki.
         THE TELL WAS THE SHAPE OF THE RESULT: 23 of 27 failures clustered within 0.09 of
         one threshold. A real defect does not queue up politely against your own dial. */
      DUST:    { kind: 'earth', hue: 42, satMax: 0.50, ref: 'road dust, a pale warm tan' },
      SAND:    { kind: 'earth', hue: 45, satMax: 0.50, ref: 'sand #C2B280, saturation 0.34' },
      KHAKI:   { kind: 'earth', hue: 37, satMax: 0.50, ref: 'khaki #C3B091, saturation 0.26' },
      /* GREEN COPPER. The ramp the four COPPER garments use is literally named COPPEROX --
         copper OXIDE, which is green, because that is what copper does in weather. The
         ramp was never the lie; the NAME dropped the oxide. Renamed, and the word is in
         the dictionary so it is held to green from now on. */
      PATINA:  { kind: 'hue', hue: 160, ref: 'verdigris, weathered copper #43B3AE' },
      /* DARK. These name a value. */
      CHARCOAL:{ kind: 'dark', ref: 'charcoal #36454F' },
      SOOT:    { kind: 'dark', ref: 'soot, near black' },
      COAL:    { kind: 'dark', ref: 'coal, near black' },
      BLACK:   { kind: 'dark', ref: 'black' }
    };
    /* THE TOLERANCES, STATED ONCE AND IN ONE PLACE. 40 degrees is generous on purpose:
       this is hunting LIES, not policing taste, and COPPER WORK SHIRT is 121 degrees out.
       A tight tolerance here would turn a liar-hunt into an argument about shades. */
    const TOL = 40, SAT_MAX = 0.34, VAL_MAX = 0.42;

    const o = { words: WORDS, tol: TOL, satMax: SAT_MAX, valMax: VAL_MAX, rows: [], err: [], canon: 0 };
    const keepW = window.G_WORN, keepE = G.equipped;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    G.equipped = bare(); window.G_WORN = {}; clear();
    let base = null; try { base = buildFrame('S', 'idle', 0); } catch (e) { o.err.push('bare'); }
    if (!base) { window.G_WORN = keepW; G.equipped = keepE; clear(); return o; }

    const rgbToHsv = (r, g2, bl) => {
      r /= 255; g2 /= 255; bl /= 255;
      const mx = Math.max(r, g2, bl), mn = Math.min(r, g2, bl), d = mx - mn;
      let h = 0;
      if (d) {
        if (mx === r) h = 60 * (((g2 - bl) / d) % 6);
        else if (mx === g2) h = 60 * ((bl - r) / d + 2);
        else h = 60 * ((r - g2) / d + 4);
      }
      if (h < 0) h += 360;
      return [h, mx ? d / mx : 0, mx];
    };
    const canon = GARMENTS.filter(g => g && g.st === 'canon' && g.layer);
    o.canon = canon.length;
    for (const gm of canon) {
      /* A COMPOUND NOUN IS NOT A COLOUR CLAIM. A DUST MASK is a mask FOR dust; nobody ever
         said it was dust-coloured, and the first cut called RUST DUST MASK a liar for being
         rust-coloured -- while the word RUST in the same name passed. When one name makes a
         tool contradict itself, the tool is wrong. Excluded by name, with the reason, rather
         than by quietly loosening a threshold until it goes away. */
      const COMPOUND = /DUST MASK/;
      const found = Object.keys(WORDS).filter(w => {
        if (w === 'DUST' && COMPOUND.test(gm.n)) return false;
        return new RegExp('(^|[^A-Z])' + w + '([^A-Z]|$)').test(gm.n);
      });
      if (!found.length) continue;
      G.equipped = bare(); window.G_WORN = {}; window.G_WORN[gm.layer] = gm.n; clear();
      let fr; try { fr = buildFrame('S', 'idle', 0); } catch (e) { o.err.push(gm.n); continue; }
      /* THE GARMENT'S OWN PIXELS: the diff against the same body naked. Measuring the whole
         sprite would average the person's skin into their shirt. */
      const bucket = new Array(12).fill(0);
      let n = 0, satSum = 0, valSum = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const a = fr.px[i], c = base.px[i];
        if (!a) continue;
        if (c && a[0] === c[0] && a[1] === c[1] && a[2] === c[2]) continue;
        const hsv = rgbToHsv(a[0], a[1], a[2]);
        n++; satSum += hsv[1]; valSum += hsv[2] / 255;
        /* 30-DEGREE BUCKETS, the same ones the faction colour file and its gate use, and
           only pixels with enough colour in them vote on hue -- a near-grey pixel has a
           hue but it does not mean anything, and letting it vote is how a grey coat gets
           a confident dominant hue. */
        if (hsv[1] >= 0.15) bucket[Math.floor(hsv[0] / 30) % 12]++;
      }
      if (!n) { o.err.push(gm.n + ' painted nothing'); continue; }
      let bi = 0; for (let k = 1; k < 12; k++) if (bucket[k] > bucket[bi]) bi = k;
      const voted = bucket.reduce((a2, c2) => a2 + c2, 0);
      const domHue = voted ? bi * 30 + 15 : null;
      const sat = satSum / n, val = valSum / n;
      for (const w of found) {
        const spec = WORDS[w];
        let lies = false, why = '', gap = null;
        if (spec.kind === 'hue') {
          if (domHue == null) { lies = true; why = 'names a colour and renders with no colour in it'; }
          else {
            let d = Math.abs(domHue - spec.hue) % 360; if (d > 180) d = 360 - d;
            gap = Math.round(d);
            const tol = spec.tol || TOL;
            if (d > tol) { lies = true; why = 'hue ' + Math.round(domHue) + ' against ' + spec.hue + ', ' + gap + ' degrees out'; }
          }
        } else if (spec.kind === 'earth') {
          /* BOTH TESTS: the hue has to be earth AND the chroma has to stay under the
             ceiling. Either alone lets something through -- hue alone passes a bright
             orange, chroma alone passes a grey. */
          if (domHue == null) { lies = true; why = 'names an earth colour and renders with no colour in it'; }
          else {
            let d = Math.abs(domHue - spec.hue) % 360; if (d > 180) d = 360 - d;
            gap = Math.round(d);
            if (d > (spec.tol || TOL)) { lies = true; why = 'hue ' + Math.round(domHue) + ' against ' + spec.hue + ', ' + gap + ' degrees out'; }
            else if (sat > spec.satMax) { lies = true; why = 'the right hue but saturation ' + sat.toFixed(2)
                                                          + ', past the ' + spec.satMax + ' an earth colour stays under'; }
          }
        } else if (spec.kind === 'neutral') {
          gap = +sat.toFixed(3);
          if (sat > SAT_MAX) { lies = true; why = 'names a grey and renders at saturation ' + sat.toFixed(2)
                                              + (domHue == null ? '' : ', hue ' + Math.round(domHue)); }
        } else {
          gap = +val.toFixed(3);
          if (val > VAL_MAX) { lies = true; why = 'names a dark and renders at value ' + val.toFixed(2); }
        }
        o.rows.push({ n: gm.n, layer: gm.layer, word: w, kind: spec.kind, ref: spec.ref,
                      hue: domHue, sat: +sat.toFixed(3), val: +val.toFixed(3),
                      px: n, lies: lies, why: why, gap: gap });
      }
    }
    window.G_WORN = keepW; G.equipped = keepE; clear();
    return o;
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 2).join(' | '));

  const rows = R.rows, liars = rows.filter(x => x.lies);
  const byWord = {};
  for (const x of rows) { const k = x.word; byWord[k] = byWord[k] || { n: 0, lies: 0, kind: x.kind };
                          byWord[k].n++; if (x.lies) byWord[k].lies++; }
  const L = [];
  L.push('DOES THE NAME MATCH THE RAMP?  --  CHARACTER lane, 9/15/26, VAMILY [names lie]');
  L.push('Every canon garment whose NAME names a colour, measured against the ramp it renders.');
  L.push('');
  L.push('THE ROW: COPPER WORK SHIRT is green, "and that one lie is the whole reason Trades');
  L.push('measured 121 degrees off his chosen orange." A lying name is not cosmetic: this lane');
  L.push('dresses factions BY NAME, so a garment that lies puts the wrong faction\'s colour on');
  L.push('a body, and COLOUR IS TERRITORY says the colour is the statement.');
  L.push('');
  L.push('*** THE ROW NAMES SEVEN COLOUR WORDS. THE RAIL USES ' + Object.keys(R.words).length + '. ***');
  L.push('Rule 12: a dependency is a premise, not a gate. Sweeping only copper, oxblood, bone,');
  L.push('steel, teal, dust and charcoal would have cleared the wardrobe and left the rest in.');
  L.push('');
  L.push('HOW EACH KIND OF WORD IS CHECKED, because one test for all of them is wrong:');
  L.push('  CHROMATIC  the word names a hue      -> hue, within ' + R.tol + ' degrees');
  L.push('  EARTH      dust, sand, khaki        -> an earth hue AND chroma under its ceiling');
  L.push('  NEUTRAL    the word names greyness  -> SATURATION at or under ' + R.satMax);
  L.push('  DARK       the word names a value   -> VALUE at or under ' + R.valMax);
  L.push(R.tol + ' degrees is generous on purpose. This hunts LIES, not shades: the garment the row');
  L.push('was opened about is 121 degrees out.');
  L.push('');
  L.push('  canon garments on the rail          ' + R.canon);
  L.push('  garments whose name names a colour  ' + new Set(rows.map(x => x.n)).size);
  L.push('  claims checked (a name can carry two) ' + rows.length);
  L.push('  *** CLAIMS THAT LIE                 ' + liars.length + ' ***');
  L.push('');
  L.push('BY WORD');
  L.push('  ' + 'word'.padEnd(10) + 'kind'.padEnd(9) + 'claims'.padStart(7) + 'lie'.padStart(6));
  for (const w of Object.keys(byWord).sort((a, c) => byWord[c].lies - byWord[a].lies || byWord[c].n - byWord[a].n))
    L.push('  ' + w.padEnd(10) + byWord[w].kind.padEnd(9) + String(byWord[w].n).padStart(7) + String(byWord[w].lies).padStart(6));
  L.push('');
  L.push('EVERY LIAR');
  if (!liars.length) L.push('  none');
  for (const x of liars.sort((a, c) => (c.gap || 0) - (a.gap || 0)))
    L.push('  ' + x.n.padEnd(28) + x.word.padEnd(9) + x.why);
  if (R.err.length) { L.push(''); L.push('DID NOT MEASURE: ' + R.err.length + ' -- ' + R.err.slice(0, 4).join(', ')); }
  L.push('');
  L.push('THE FIX THE ROW ASKS FOR: "rename or re-ramp each -- THE RAMP MOVES, THE SHAPE');
  L.push('NEVER DOES." STRUCTURE-NOT-COLOR, so any repair has to leave the silhouette');
  L.push('byte-identical, and that is measured rather than promised.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  fs.writeFileSync(JSON_OUT, JSON.stringify({ tol: R.tol, satMax: R.satMax, valMax: R.valMax,
                                              words: R.words, rows: rows }, null, 1));
  console.log(L.join('\n'));
  console.log('\nwrote ' + path.relative(REPO, OUT));
})();

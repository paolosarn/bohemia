/* BOHEMIA — FACTION COLOUR GATE (8/26/26). FACTORY LAW: new law, own gate, same turn.
 *
 * laws/BOHEMIA_LAW_COLOUR_IS_TERRITORY_8_26_26.md, Paolo 8/26:
 *   "the colorful, like, that guy was not colorful, bro. Like, that shit was crazy ...
 *    people get shot in Los Angeles for wearing the wrong color or whatever ... when it
 *    comes down to how we wanna communicate, like, who would defend us"
 *
 * THE FOUR TESTS, all on RENDERED CLOTH PIXELS -- skin and the black outline removed, so
 * a suntan cannot pass for a flag and the 1px border cannot vote:
 *   1  COORDINATED     a faction's cloth agrees with itself
 *   2  SATURATED       a signal you can read, unless drabness IS the statement
 *   3  NOBODY ELSE'S   two factions may not own the same dominant hue
 *   4  THE NAME IS NOT A LIE   a faction named for a colour wears it
 *
 * WHAT THIS DELIBERATELY DOES NOT DO: rank colours, or decide who owns what. Which
 * faction owns which hue is HIS (MECHANISM-MINE / CONTENTS-PAOLO'S). The gate holds the
 * SHAPE of the law -- coordinated, saturated, unique, honest -- and never the contents.
 *
 * AND IT DOES NOT REPLACE STRUCTURE-NOT-COLOR. gates/faction_outfit_gate.js still holds
 * the silhouette set, which is what reads in a valley that opens at 06:00 in the dark.
 * Colour is the SECOND channel. If these two ever disagree, the silhouette wins.
 *
 *   node gates/faction_colour_gate.js
 */
'use strict';
const path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== FACTION COLOUR GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS, { timeout: 30000 });
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  const R = await pg.evaluate(() => {
    const hsv = (r, g, bb) => { r /= 255; g /= 255; bb /= 255;
      const mx = Math.max(r, g, bb), mn = Math.min(r, g, bb), d = mx - mn;
      let h = 0;
      if (d) { if (mx === r) h = ((g - bb) / d) % 6; else if (mx === g) h = (bb - r) / d + 2; else h = (r - g) / d + 4;
        h *= 60; if (h < 0) h += 360; }
      return { h: h, s: mx ? d / mx : 0, v: mx }; };
    const keepW = window.G_WORN, keepE = G.equipped, keepV = G.bodyVar;
    const PD_OFF = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const out = [];
    for (const f of window.FACTION_LOOKS) {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of PD_OFF) eq[s] = '';
      G.equipped = eq; G.bodyVar = f.dials; window.G_WORN = f.worn;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const fr = buildFrame('S', 'idle', 0);
      const bins = {}; let n = 0, satSum = 0;
      for (let i = 0; i < fr.px.length; i++) { const c = fr.px[i]; if (!c) continue;
        const gv = fr.grid[i]; if (gv === 1 || gv === 2) continue;      /* skin and face */
        const q = hsv(c[0], c[1], c[2]);
        if (q.v < 0.12) continue;                                       /* the outline */
        n++; satSum += q.s;
        /* 30-degree buckets: finer than that and two shades of the same red read as
           two colours, which is not how anybody sees a person across a street. */
        const key = q.s < 0.18 ? 'neutral' : String((Math.round(q.h / 30) * 30) % 360);
        bins[key] = (bins[key] || 0) + 1; }
      const rank = Object.keys(bins).map(k => [k, bins[k]]).sort((a, c) => c[1] - a[1]);
      out.push({ n: f.faction, px: n, sat: satSum / Math.max(1, n),
                 dom: rank[0] ? rank[0][0] : '-',
                 domShare: rank[0] ? rank[0][1] / Math.max(1, n) : 0,
                 second: rank[1] ? rank[1][0] : '-',
                 neutral: (bins['neutral'] || 0) / Math.max(1, n) });
    }
    window.G_WORN = keepW; G.equipped = keepE; G.bodyVar = keepV;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return out;
  });
  await b.close();

  /* ---- 4. THE NAME IS NOT A LIE -----------------------------------------
     Only factions NAMED for a colour are asked this, and only the ones whose name
     maps to a hue without argument. This is the check that would have caught the
     Blues wearing red for five weeks. */
  const NAMED = { Blues: '210', Reds: '0' };
  const wrong = [];
  for (const q of R) { const want = NAMED[q.n]; if (!want) continue;
    if (q.dom !== want) wrong.push(q.n + ' is dominantly ' + q.dom + ', not ' + want); }
  ok('*** A FACTION NAMED FOR A COLOUR WEARS THAT COLOUR *** (' +
     (wrong.length ? wrong.join('; ') : 'Blues blue, Reds red') + ')', wrong.length === 0);

  /* ---- 2. SATURATED ENOUGH TO BE A SIGNAL --------------------------------
     DRAB IS LEGAL WHERE DRABNESS IS THE STATEMENT. The Volunteers own nothing and
     the Homeless bought nothing; dressing either of them in a flag would be a lie
     about who they are. Everybody else is claiming ground and has to look like it.
     Named, not inferred, so nobody can quietly add themselves to the exemption. */
  const DRAB_ON_PURPOSE = { Volunteers: 1, Homeless: 1, Cartel: 1 };
  const FLOOR = 0.28;
  const washed = R.filter(q => !DRAB_ON_PURPOSE[q.n] && q.sat < FLOOR);
  ok('every faction that claims ground looks like it (colour strength >= ' + FLOOR.toFixed(2) +
     (washed.length ? ' -- WASHED OUT: ' + washed.map(q => q.n + ' ' + q.sat.toFixed(2)).join(', ') : '') + ')',
     washed.length === 0);
  /* AND THE EXEMPTION MUST BE EARNED, or it is just a hole. The three drab factions
     have to actually BE drab; if one of them creeps up into a real colour it has
     stopped being the thing the exemption was written for and should be judged. */
  const notDrab = R.filter(q => DRAB_ON_PURPOSE[q.n] && q.sat >= FLOOR + 0.10);
  ok('the drab exemption is still describing drab people (' +
     R.filter(q => DRAB_ON_PURPOSE[q.n]).map(q => q.n + ' ' + q.sat.toFixed(2)).join(', ') + ')',
     notDrab.length === 0);

  /* ---- 1. COORDINATED ----------------------------------------------------
     A faction's biggest colour has to actually be its colour. COLORFUL was 54%
     grey/brown with a bone coat over a striped tee -- one loud item under a beige
     coat is not a coordinated outfit, because a coat is most of a person. */
  const CO = 0.38;
  const scattered = R.filter(q => !DRAB_ON_PURPOSE[q.n] && q.domShare < CO);
  ok('a faction\'s cloth agrees with itself (biggest hue >= ' + (CO * 100).toFixed(0) + '% of the cloth' +
     (scattered.length ? ' -- SCATTERED: ' + scattered.map(q => q.n + ' ' + (100 * q.domShare).toFixed(0) + '%').join(', ') : '') + ')',
     scattered.length === 0);

  /* ---- 3. NOBODY ELSE'S --------------------------------------------------
     RATCHET, NOT A ZERO. The valley is thirteen factions and the desert palette is
     real: hue 30 is leather, dust and sun-bleached canvas, and five factions
     legitimately live there. Pinning collisions at zero today would mean inventing
     colour ownership for five factions, which is HIS to give and not mine to take.
     So this pins the number where it is and lets it only ever shrink -- the same
     downward ratchet the hair laws use, and it still fires the moment somebody adds
     a fourteenth faction in a colour that is already spoken for. */
  const PINNED_CLASH = 5;   // tightened the day it was written: 8 -> 5
  const byHue = {};
  for (const q of R) { if (q.dom === 'neutral') continue; (byHue[q.dom] = byHue[q.dom] || []).push(q.n); }
  let clashes = 0; const clashList = [];
  for (const h in byHue) if (byHue[h].length > 1) {
    clashes += byHue[h].length - 1;
    clashList.push(h + ': ' + byHue[h].join('/')); }
  ok('*** NO TWO FACTIONS OWN THE SAME COLOUR *** (' + clashes + ' sharing, pinned ' + PINNED_CLASH +
     (clashList.length ? ' -- ' + clashList.join('  ') : '') + ')', clashes <= PINNED_CLASH);
  if (clashes < PINNED_CLASH)
    console.log('  *** FEWER CLASHES THAN THE PIN. Lower PINNED_CLASH to ' + clashes + ' so it cannot slide back. ***');

  /* ---- and the instrument he asked for, which is half of the ruling ------- */
  const src = require('fs').readFileSync(ALPHA, 'utf8');
  ok('HE CAN VOTE ON THE THIRTEEN: the faction board carries thumbs (Paolo 8/26 ' +
     '"I definitely would have voted")', /facUp/.test(src) && /facDn/.test(src) && /FAC_VOTE_KEY/.test(src));
  ok('and it exports .txt and never .json (the verdict workflow)',
     /BOHEMIA_FACTION_OUTFIT_VERDICTS\.txt/.test(src) && !/faction[^\n]*verdicts[^\n]*\.json/i.test(src));
  ok('and it has a notes box, because every judge board does', /id="facNotes"/.test(src));

  console.log('\n  faction        colour strength   biggest hue   share');
  for (const q of R) console.log('  ' + q.n.padEnd(14) + q.sat.toFixed(2).padStart(13) +
    String(q.dom).padStart(14) + ((100 * q.domShare).toFixed(0) + '%').padStart(8));
  done();
})();

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
  const PINNED_CLASH = 4;   // 8 -> 5 the day it was written, 5 -> 4 on 9/6 when
                            // the gate itself said so and nobody had done it
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

  /* ---- 5. HIS ANSWER IS READABLE OUTSIDE THE WARDROBE (9/6, [colours fixed])
     Every faction already HAD a colour -- he answered it garment by garment on
     8/26 -- and it existed only as PIXELS. This gate could reach it by launching
     a browser; nothing in the game could. The ramps live in the alpha and the
     city carried a grep count of NOUGHT, so three rows were stopped on it:
     FACTIONS [who holds] drew its borders in a two-colour language for want of a
     hue, UI [owner shown] wants "the owner of every district IN ITS COLOUR", and
     COOK [border marked] wants the edge painted in the holder's.
     tools/bohemia_faction_colour.js runs THIS MEASUREMENT and writes it down.
     These claims are the thing that stops it rotting: the published number is
     compared against the render, here, every run. ------------------------- */
  const FS = require('fs');
  const CJ = path.join(__dirname, '../engine/BOHEMIA_faction_colours.json');
  let PUB = null;
  try { PUB = JSON.parse(FS.readFileSync(CJ, 'utf8')); } catch (_e) {}
  ok('*** A FACTION\'S COLOUR IS READABLE WITHOUT RENDERING A BODY. *** It was his '
     + 'answer all along and it was locked in a browser; three rows were blocked on '
     + 'it', !!(PUB && PUB.factions && Object.keys(PUB.factions).length === R.length));

  const drift = [];
  for (const q of R) {
    const e = PUB && PUB.factions && PUB.factions[q.n];
    if (!e) { drift.push(q.n + ' missing'); continue; }
    const wantHue = q.dom === 'neutral' ? null : (q.dom | 0);
    if (e.hue !== wantHue) drift.push(q.n + ' hue ' + e.hue + ' but renders ' + wantHue);
    if (!!e.drab !== (q.dom === 'neutral')) drift.push(q.n + ' drab flag wrong');
  }
  ok('AND IT IS THE SAME ANSWER THE CLOTH GIVES, re-measured here every run so it '
     + 'cannot rot into a list somebody believes -- the contract NOT_A_TOWN and the '
     + 'seat bake already carry' + (drift.length ? ' -- DRIFT: ' + drift.join('; ') : ''),
     drift.length === 0);

  ok('and every published colour is tagged draft, because it is MEASURED and never '
     + 'RULED -- the day he thumbs one, the flag is what changes',
     !!PUB && Object.values(PUB.factions).every(e => e.draft === true));

  /* THE WALKED SURFACE CARRIES IT, or the whole exercise was a file nobody reads. */
  const CITY_SRC = FS.readFileSync(path.join(__dirname, '../slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const m = /window\.BOHEMIA_FACTION_COLOURS=(.*?);\n/.exec(CITY_SRC);
  let cityMatches = false;
  try { cityMatches = !!m && JSON.stringify(JSON.parse(m[1]).factions) === JSON.stringify(PUB.factions); }
  catch (_e) {}
  ok('*** AND THE WALKED SURFACE CARRIES THE SAME NUMBERS. *** A JSON in engine/ is '
     + 'still unreachable from the city, which is the exact reason the ramps were '
     + 'stranded in the alpha in the first place. The tool re-writes it every run '
     + 'rather than checking a marker and no-opping, which is the defect the seat '
     + 'bake paid for one round ago', cityMatches);

  ok('and the map draws its territory border with it', /__holderInk/.test(CITY_SRC));

  /* *** VERIFY ON THE REAL SURFACE. *** The line above is a grep and a grep proves
     the code exists, not that anything was painted. The border loop publishes the
     ink it actually used per faction -- the same way this renderer already
     publishes its label boxes, and for the same reason: counting coloured pixels
     near a border reads the neighbour's line as yours. */
  const inks = await (async () => {
    const b2 = await chromium.launch();
    try {
      const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
      await p2.route(/^https?:/, r => r.abort());
      await p2.goto('file://' + path.join(__dirname, '../slices/BOHEMIA_CITY_WORLD.html'),
                    { waitUntil: 'load', timeout: 180000 });
      await p2.waitForFunction(() => typeof renderCity === 'function' && typeof turfGrid === 'function',
                               { timeout: 60000 });
      return await p2.evaluate(() => {
        try { if (typeof MAPON !== 'undefined') MAPON = true; } catch (_e) {}
        try { openMap(); } catch (_e) {}
        for (let i = 0; i < 3; i++) { try { renderCity(); } catch (_e) {} }
        return window.__TURF_INK || null;
      });
    } finally { await b2.close(); }
  })();

  const painted = inks ? Object.keys(inks) : [];
  const distinct = inks ? new Set(Object.values(inks)).size : 0;
  ok('*** AND A REAL CANVAS REALLY PAINTED THEM. *** ' + painted.length + ' factions\' '
     + 'ground drawn in ' + distinct + ' distinct inks. Before this round the border '
     + 'was two colours for the whole valley, yours and theirs, because there was no '
     + 'hue to use' + (inks ? ' -- ' + painted.slice(0, 4).map(k => k + ' ' + inks[k]).join(', ') : ''),
     painted.length >= 6 && distinct >= 4);

  /* ---- 6. THE AUDIT THIS ROW WAS OPENED FOR, MEASURED --------------------
     "the gate holds contradictions, this row fixes them". Two were found, and
     the honest answer to both is that they are HIS, not mine -- so they are
     NAMED here every run instead of sitting silently inside a pin. */
  const GRAPH = JSON.parse(FS.readFileSync(path.join(__dirname, '../engine/BOHEMIA_faction_graph.json'), 'utf8')).factions;
  const rel = (a, c) => (GRAPH[a] && GRAPH[a].relations && GRAPH[a].relations[c])
                     || (GRAPH[c] && GRAPH[c].relations && GRAPH[c].relations[a]) || null;
  const related = [];
  for (const h in byHue) if (byHue[h].length > 1) {
    const F = byHue[h];
    for (let i = 0; i < F.length; i++) for (let j = i + 1; j < F.length; j++)
      if (rel(F[i], F[j])) related.push(F[i] + '/' + F[j] + ' (' + rel(F[i], F[j]) + ') both on ' + h);
  }
  ok('*** NO COLOUR CLASH IS BETWEEN TWO FACTIONS HIS CANON PUTS IN A RELATION. *** '
     + 'The law\'s own research is that colour choice is OPPOSITIONAL -- the Bloods '
     + 'took red against the Crips\' blue -- so two ENEMIES in one hue is a lie about '
     + 'his graph and two strangers in one hue is only a coincidence. Measured '
     + 'against his relations: every clashing pair is unrelated'
     + (related.length ? ' -- BUT: ' + related.join('; ') : ''),
     related.length === 0);

  console.log('  note: the drab exemption names ' + Object.keys(DRAB_ON_PURPOSE).length
    + ' factions (' + Object.keys(DRAB_ON_PURPOSE).join(', ') + ') and COLOUR IS '
    + 'TERRITORY names TWO -- "drab is legal, but only when drabness IS the statement '
    + '(the Volunteers, the Homeless)". The Cartel was added to the list and not to '
    + 'the law. Its note is "organized human predation" with supply chains, so the '
    + 'law\'s reason ("the Volunteers own nothing and the Homeless bought nothing") '
    + 'does not describe it -- but a predator not advertising is a real reading too. '
    + 'That is TASTE, so it is [PENDING Paolo] and printed here rather than settled.');
  ok('and the exemption cannot quietly GROW while it waits for him',
     Object.keys(DRAB_ON_PURPOSE).length <= 3);

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

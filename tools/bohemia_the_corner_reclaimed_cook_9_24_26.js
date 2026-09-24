/* ============================================================================
   THE CORNER RECLAIMED  (WORLD, 9/24/26)

   *** THE RE-COOK OF A KILLED ITEM, QUOTING THE WORDS THAT KILLED IT. ***
   world-the-same-corner-9-23 went DOWN, and he said why (9/23, in the tab):

     "Bro the future gets better holy shit actually the right side is kinda what
      the beginning of the game is supposed to look like and it gets better how
      better is up to you and by better i mean when civilization reclaims parts
      of cities for economic purposes it will get more techy and modern and yeah
      man cmon"

   That became rule 32(b): THE GAME STARTS IN THE RUIN AND THE FUTURE GETS
   BETTER. The ruin is act 1's FLOOR, never a fall; act 2 and 3 are the ruin plus
   what was RECLAIMED; nothing decays below the start.

   *** SO THE DRAWING WAS NOT WRONG. THE ARROW WAS. *** The killed item ran act 1
   -> act 3 as subtraction: a lived-in corner losing its house and its road over
   a century. He read the ruined panel as the BEGINNING and he is right -- the
   game opens thirty years after a crash, so a ruin is where the player starts,
   and there is nothing above it to fall from.

   THE SAME CORNER, THE OTHER WAY ROUND. Left is act 1, which is the old right
   panel: the ruin, unchanged, because his floor has to be somewhere and this is
   it. Right is act 3: THE SAME RUIN WITH THINGS ADDED. Every pixel that was
   there in act 1 is still there in act 3; the only operation this file runs is
   ADD. That is not a style choice, it is rule 32(b) made mechanical -- if
   anything could be removed the future could get worse, and he ruled it cannot.

   REUSE-FIRST: the corner itself is not redrawn. It is imported from
   bohemia_the_same_corner_cook_9_23_26.js -- same function, same geometry, same
   wall, kerb and slab -- so "it is the same corner" is true by construction and
   not by my promise.

   WHAT RECLAIM MEANS HERE, IN HIS WORDS' ORDER: "for economic purposes",
   "techy and modern". Not nicer, not greener, not tidier. A block comes back
   because somebody can make something on it:
     * THE SLAB CARRIES A MACHINE, NOT A HOME. The house is not rebuilt. A
       workshop goes up on the foundation that was already there, and it wears
       the panel array this lane already cooked and he already approved (THE RIG
       ON THE ROOF, up 9/23). Reclaim reuses what is standing.
     * THE ROAD IS PATCHED WHERE IT IS DRIVEN AND NOWHERE ELSE. The near street
       gets a new surface; the cross street keeps its act-1 breaks. That is the
       same planned-shrinkage logic this lane measured in the light: you fix the
       corridor that pays.
     * THE POWER COMES BACK ON THIS CORNER AND THE LAMP IS NEW. Which is the
       whole of this lane's last round: the reclaim IS the lit core, and a core
       is what the valley's scattered light cannot make today.
     * AND IT IS STILL ANALOG HORROR, because better is not kind. The block wall
       still stands, the gap in it still has no gate, and what came back to the
       corner is a machine with a fence around it, not a family.

   REFERENCE CHECK
   COMPARED TO: TG-05 (the lot tile -- how a flat ground surface reads from
   above), CB-03 (a Vegas block from the air -- the real grain of a residential
   corner), BLDG-05 (the structural sanity list, the 9/4 law's own words),
   PROP-02 (real object typology: a kerb, a block wall, a panel array and a
   street lamp are specific shapes) and AH-01 (the analog horror bible, ours).

   STRUCTURAL RULES TAKEN:
     * CB-03 -- the corner's grain is untouched from the approved drawing: two
       streets meeting, the walk carried round the inside of the turn, the wall
       running the lot line and turning.
     * BLDG-05 -- the workshop stands on the slab that was already there, and
       the array stands on the workshop. Nothing floats and nothing is founded
       on nothing.
     * PROP-02 -- a panel array from above is a dark rectangle with a bright
       edge where the glass catches the sky, sitting on legs that cast a gap of
       shadow. A street lamp is a small point and a long pool.
     * TG-05 -- the new road surface is one flat value and reads by the seam
       where it meets the old, which is the only line the patch adds.
     * AH-01 -- ordinary frame, one thing wrong. The ordinary part is a block
       coming back. The wrong thing is unchanged from act 1 and that is the
       point: the doorway-shaped gap in the wall still has no gate hung in it,
       and now there is a light on so you can see it.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_the_corner_reclaimed_cook_9_24_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const SAME = require(path.join(REPO, 'tools/bohemia_the_same_corner_cook_9_23_26.js'));

const S = SAME.S;
const W = S * 2 + 2;
const GEO = SAME.GEO;

/* the approved corner's palette, plus what reclaim brings and nothing else */
const PALETTE = Object.assign({}, SAME.PALETTE, {
  23: '#2b2f33',   /* the panel array, dark glass */
  24: '#767f86',   /* the edge of a panel where it catches the sky */
  25: '#3b3a33',   /* the workshop roof, sheet metal */
  26: '#565248',   /* the workshop's lit ridge */
  27: '#2f2c25',   /* the gap of shadow under the array and the eaves */
  28: '#4a4741',   /* new asphalt, laid where the road is driven */
  29: '#6d685c',   /* the seam where the new surface meets the old */
  30: '#d8cb96',   /* THE LAMP HEAD, new glass catching the sun. The only
                      bright thing on the corner. */
  31: '#8f8768',   /* the lamp's bracket and hood */
  32: '#3f4a42',   /* the conduit up the pole, and the line on it */
  33: '#cfc6a4',   /* a FRESHLY painted lane line. *** ITS OWN VALUE, AND MY OWN
                      REFUSAL IS WHY. *** The first cut repainted the line in act
                      1's faded white, which overwrote desert with an act-1 index
                      and tripped the nothing-decays check -- correctly, because a
                      pixel that goes from one act-1 value to another is a change
                      this drawing is not allowed to make. A line repainted on new
                      asphalt IS brighter than a thirty-year-old one, so the fix
                      the rule forced is also the truer drawing. */
});

const LEGEND = Object.assign({}, SAME.LEGEND, {
  23: { name: 'panel array',            kind: 'reclaim' },
  24: { name: 'panel edge, sky-caught', kind: 'reclaim' },
  25: { name: 'workshop roof',          kind: 'reclaim' },
  26: { name: 'workshop ridge',         kind: 'reclaim' },
  27: { name: 'shadow under the array', kind: 'reclaim' },
  28: { name: 'new asphalt',            kind: 'reclaim' },
  29: { name: 'the seam, new to old',   kind: 'reclaim' },
  30: { name: 'a lit lamp',             kind: 'reclaim' },
  31: { name: 'lamp bracket and hood',  kind: 'reclaim' },
  32: { name: 'conduit and line',       kind: 'reclaim' },
  33: { name: 'fresh lane line',        kind: 'reclaim' },
});

const RECLAIM = new Set([23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]);

/* ---------------------------------------------------------------------------
   THE ONLY OPERATION IN THIS FILE IS ADD. Rule 32(b) says nothing decays below
   the start, so act 3 is act 1 with reclaim laid on top and the gate checks that
   every act-1 pixel that is not overwritten by a reclaim index is untouched.
   --------------------------------------------------------------------------- */
function reclaim(base, seed) {
  const g = base.map(row => row.slice());
  const r = SAME.rnd(seed);
  const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < S && y < S) g[y][x] = c; };
  const rect = (x0, y0, x1, y1, c) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, c); };
  const R2 = GEO.roof;

  /* 1. THE ROAD IS PATCHED WHERE IT IS DRIVEN. The near street only: the corridor
        that pays gets a surface and the cross street keeps its act-1 breaks. */
  for (let x = 0; x < GEO.kerbX; x++) {
    for (let y = GEO.kerbY + 3; y < S; y++) set(x, y, 28);
  }
  for (let x = 0; x < GEO.kerbX; x++) set(x, GEO.kerbY + 3, 29);   /* the seam */
  for (let y = GEO.kerbY + 3; y < S; y++) set(GEO.kerbX - 1, y, 29);
  /* the lane line comes back with the surface, because a line is what a road is for */
  for (let x = 0; x < GEO.kerbX - 2; x++) if ((x % 9) < 5) set(x, S - 5, 33);

  /* 2. THE SLAB CARRIES A MACHINE, NOT A HOME. The workshop stands on the
        foundation that was already there (BLDG-05), smaller than the house was,
        because reclaim builds what it needs and not what was lost. */
  const wx0 = R2.x0 + 4, wy0 = R2.y0 + 3, wx1 = R2.x1 - 6, wy1 = R2.y1 - 2;
  rect(wx0, wy0, wx1, wy1, 25);
  for (let x = wx0; x <= wx1; x++) set(x, wy0, 26);                /* the lit ridge */
  for (let x = wx0 + 1; x <= wx1 + 2; x++) set(x, wy1 + 1, 27);    /* the eaves shadow */
  for (let y = wy0 + 1; y <= wy1 + 1; y++) { set(wx1 + 1, y, 27); set(wx1 + 2, y, 27); }

  /* 3. THE ARRAY ON IT, which is the cook he already approved (THE RIG ON THE
        ROOF, up 9/23) standing on this roof. PROP-02: a dark rectangle with a
        bright edge where the glass catches the sky, and a gap of shadow under. */
  const ax0 = wx0 + 2, ay0 = wy0 + 2, ax1 = wx1 - 3, ay1 = wy0 + 7;
  rect(ax0, ay0, ax1, ay1, 23);
  for (let x = ax0; x <= ax1; x++) set(x, ay0, 24);
  for (let x = ax0; x <= ax1; x++) set(x, ay1 + 1, 27);
  /* the rows between panels, which is what makes it an ARRAY and not a slab */
  for (let x = ax0 + 4; x < ax1; x += 5) for (let y = ay0; y <= ay1; y++) set(x, y, 27);

  /* 4. THE POWER IS BACK ON THIS CORNER. The pole was already standing in act 1
        (it is concrete-footed and it survived); what is new is the line on it,
        the conduit, and a LIT lamp. This is the lit core this lane measured the
        valley cannot make today, drawn on one corner. */
  const px = GEO.poleX;
  for (let y = GEO.walkY - 6; y <= GEO.walkY - 1; y++) set(px + 1, y, 32);
  for (let x = px + 2; x < GEO.kerbX; x++) set(x, GEO.walkY - 6, 32);  /* the line out */
  /* *** THE LAMP IS A NEW FIXTURE, NOT A GLOW, AND THE FIRST CUT GOT THAT WRONG.
     *** I drew a lit lamp throwing a pool onto the walk -- in a frame where the
     wall has a sun side and a shade side and the roof casts an eave shadow. That
     is a DAYLIGHT drawing, and a glowing lamp in it reads as a puddle, not as
     power. What says the power is back in daylight is the hardware: a new head
     on the old pole, the conduit run up it, and the line going out to the
     street. The pole itself is act 1's, because it is concrete-footed and it
     survived; only what hangs on it is new. */
  set(px, GEO.walkY - 5, 30); set(px + 1, GEO.walkY - 5, 30);
  set(px - 1, GEO.walkY - 5, 31); set(px + 2, GEO.walkY - 5, 31);   /* the bracket */
  set(px, GEO.walkY - 4, 31); set(px + 1, GEO.walkY - 4, 31);

  /* 5. AND NOTHING IS TIDIED. The block wall keeps its cracks, the sand keeps
        its bank against the foot, and the gap with no gate is still a gap. The
        absence of a step here is the drawing's argument: better is not kind. */
  void r;
  return g;
}

function main() {
  const seed = 9242026;
  /* ACT 1 IS THE RUIN, which is the approved drawing's act-3 panel, unchanged.
     His floor has to be somewhere and this is it. */
  const act1 = SAME.corner(3, 9232026);
  const act3 = reclaim(act1, seed);

  /* --- THE TOOL REFUSES ITSELF, and the first refusal IS rule 32(b) --------- */

  /* *** NOTHING DECAYS BELOW THE START. Every act-1 pixel is either untouched or
     covered by something reclaim ADDED. If one act-1 pixel turned into another
     act-1 value, this drawing has taken something away and the rule is broken. */
  let changed = 0, removed = [];
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (act1[y][x] === act3[y][x]) continue;
    changed++;
    if (!RECLAIM.has(act3[y][x])) removed.push(x + ',' + y + ': ' + act1[y][x] + ' -> ' + act3[y][x]);
  }
  if (removed.length) {
    console.log('REFUSED: ' + removed.length + ' act-1 pixels were changed into something that is'
      + ' not reclaim, so the future got worse somewhere. Rule 32(b) says it cannot. '
      + removed.slice(0, 3).join('; '));
    process.exit(1);
  }
  /* and reclaim has to actually do something, or the panels are the same picture */
  const share = 100 * changed / (S * S);
  if (share < 8) { console.log('REFUSED: reclaim touched ' + share.toFixed(1) + '% of the corner; nothing came back'); process.exit(1); }
  if (share > 45) { console.log('REFUSED: reclaim touched ' + share.toFixed(1) + '% of the corner; that is a new block, not a reclaimed one'); process.exit(1); }

  /* AH-01: the one wrong thing survives into the better future, on purpose */
  let gap1 = 0, gap3 = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    if (act1[y][x] === 15) gap1++;
    if (act3[y][x] === 15) gap3++;
  }
  if (!(gap1 > 0 && gap3 === gap1)) {
    console.log('REFUSED: the gap with no gate is ' + gap1 + ' in act 1 and ' + gap3
      + ' in act 3. Better is not kind, and tidying it away is the cheap version.');
    process.exit(1);
  }

  /* THE LAMP IS THE ONLY BRIGHT THING, or the corner stops being after-collapse */
  let lamp = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (act3[y][x] === 30) lamp++;
  if (!(lamp > 0 && lamp <= 6)) {
    console.log('REFUSED: ' + lamp + ' lamp pixels; one lamp is one lamp'); process.exit(1);
  }

  const g = SAME.blank(W, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) g[y][x] = act1[y][x];
    for (let x = 0; x < S; x++) g[y][x + S + 2] = act3[y][x];
  }

  const used = {}; let total = 0;
  for (let y = 0; y < S; y++) for (let x = 0; x < W; x++) { used[g[y][x]] = (used[g[y][x]] || 0) + 1; total++; }

  const doc = {
    version: 'BOHEMIA_THE_CORNER_RECLAIMED_v1', built: '2026-09-24',
    lane: 'WORLD, rule 32(b)',
    redo_of: 'world-the-same-corner-9-23',
    his_words: 'Bro the future gets better holy shit actually the right side is kinda what the beginning of the game is supposed to look like and it gets better how better is up to you and by better i mean when civilization reclaims parts of cities for economic purposes it will get more techy and modern and yeah man cmon',
    what_was_wrong: 'not the drawing, the ARROW. The killed item ran act 1 -> act 3 as subtraction. He read the ruined panel as the BEGINNING and he is right: the game opens thirty years after a crash, so the ruin is the floor and there is nothing above it to fall from.',
    the_rule_made_mechanical: 'the only operation in this file is ADD. Every act-1 pixel is either untouched or covered by something reclaim brought, and the tool refuses itself if one act-1 value turned into another. If anything could be removed the future could get worse, and rule 32(b) says it cannot.',
    reclaim_means: 'his words in his order: "for economic purposes", "techy and modern". The slab carries a MACHINE and not a rebuilt home; the road is patched where it is driven and nowhere else; the power comes back and the lamp is lit. Not nicer, not tidier.',
    reuse: 'the corner is imported from bohemia_the_same_corner_cook_9_23_26.js, not redrawn, so "the same corner" is true by construction.',
    still_horror: 'the block wall still stands, the gap in it still has no gate, and what came back is a machine behind a wall. Better is not kind.',
    size: { panel: S, image: W + 'x' + S },
    palette: PALETTE, legend: LEGEND,
    reclaimShare: +share.toFixed(2),
    wrongThingKept: gap1,
    lampPixels: lamp,
    coverage: Object.fromEntries(Object.keys(used).filter(k => LEGEND[k])
      .map(k => [LEGEND[k].name, +(100 * used[k] / total).toFixed(2)])),
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: reclaim.toString()
  };

  const out = path.join(REPO, 'banks/BOHEMIA_THE_CORNER_RECLAIMED_9_24_26.txt');
  fs.writeFileSync(out, JSON.stringify(doc));
  const back = JSON.parse(fs.readFileSync(out, 'utf8'));
  if (!back.build_source) { console.log('REFUSED: read-back failed'); process.exit(1); }
  fs.writeFileSync(path.join(REPO, 'banks/_reclaimed_grid.json'),
    JSON.stringify({ g, pal: PALETTE, leg: LEGEND, w: W, h: S }));

  console.log('wrote banks/BOHEMIA_THE_CORNER_RECLAIMED_9_24_26.txt ('
    + (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
  console.log('  *** RECLAIM ADDED ' + share.toFixed(1) + '% OF THE CORNER AND TOOK AWAY NOTHING ***');
  console.log('  the gap with no gate is still ' + gap1 + ' pixels, in both acts');
}

main();

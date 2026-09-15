/* ============================================================================
   NO CELL GOES UNTEXTURED (9/15/26, LIFE + CITY lane)
   VAMILY row [no pool cells] SIXTEEN-PERCENT-OF-THE-SCREEN-HAS-NO-TILE-AT-ALL.

   THE ROW'S PREMISE IS FALSE, AND TWO LANES REACHED IT THE SAME WRONG WAY.

   The row says: "138 cells, SIXTEEN PERCENT, flat colour with no pool and no tile art
   at all. Name the kinds those cells are, give each a pool from the approved bank."
   My own first probe agreed and got 20.2%. We were both reading c.gArtPool and taking
   its absence for "no art".

   THE ROADWAY DOES NOT USE gArtPool. It gets its tile through a SECOND, OLDER ROUTE:
   texFor(colour, isStruct, variant) looks the cell's COLOUR up in SA_MAP, and SA_MAP
   already maps every roadway colour to an approved pool --
       #8a8a86 #7a7a76 #5e5e5a #4a4a48 #d8d4c4 -> street     #c8c4b8 -> side
       #e8e0d0 -> cross_ns   #e6ded2 -> cross_ew   #a89a80 -> shoulder
       #e4decb -> pocket_v   #e2dcc9 -> pocket_h
   MEASURED WITH saTex, WHICH IS THE ONLY HONEST INSTRUMENT HERE, AND THE MUTATION TEST
   IS WHAT FORCED THAT. The first cut of this gate asked texFor() and reported 903 of 903
   -- and then BOTH mutations passed, because TEXFOR ALWAYS RETURNS SOMETHING: when the
   pool lookup misses it generates a texture with TEXKIND and caches it. "texFor returned
   a tile" is trivially true and measures nothing. I had written the exact gate this lane
   keeps filing notes about, and only the mutation run caught it.
   saTex() returns NULL when the approved bank has no tile. Asked that way:
       903 cells of 903 draw BANK ART, 0 procedural
       pool:hyard 618   colour:street 168   pool:side 52   pool:street 51   face:perimeter 14
   The 168 the row called bare are pulling real street-bank art through the colour route,
   and the 14 solids through their face pool. THE HOLE IS NOT THERE.

   AND THE FLAT PAINT THAT IS REAL IS NOT THE GROUND. 19.8% of painted pixels do come
   from fillRect, which is what made the wrong answer feel confirmed. Grouped by style
   and size it is almost entirely dangerMark(), the danger overlay, working as designed:
       #140a06 44x44  x2139   the value pull, 0.30a+0.14
       #c2401c 44x44  x2139   the ember cast, 0.22a  ("the grain still shows through")
       #e8702c 4x44 / 44x4    the edge of the hot block, only where the neighbour is cold
       #20303e 378x815 x3     the sky behind the valley
   A STATE PAINTED OVER ART AT LOW ALPHA IS NOT A MISSING TILE.

   SO THIS GATE PINS THE THING THE ROW WAS TRYING TO PROTECT -- every cell the player
   can see resolves to a real texture -- rather than the field one of the two routes
   happens to use. If the roadway ever stops resolving, this goes red at the cell.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('NO CELL GOES UNTEXTURED — and gArtPool is not the only way a cell gets a tile');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. THE SECOND ROUTE EXISTS AND IS NAMED. This is the leg that would have saved two
   lanes a wrong diagnosis: a cell with no gArtPool can still be fully textured. */
ok('A1 a cell gets its tile by gArtPool OR by its colour through SA_MAP, and both routes '
   + 'are live — reading only the first is what made 16% and 20% look like a hole',
   /const SA_MAP=\{/.test(CITY)
   && /function texFor\(col,isStruct,variant\)\{[\s\S]{0,120}SA_MAP\[col\]/.test(CITY));

/* A2. AND THE ROADWAY IS ON THE SECOND ROUTE. */
ok('A2 every roadway colour the ground pass writes is a key in SA_MAP, so the roadway is '
   + 'carried by the colour route and never needed a gArtPool at all',
   /'#8a8a86':'street'/.test(CITY) && /'#c8c4b8':'side'/.test(CITY)
   && /'#e8e0d0':'cross_ns'/.test(CITY));

(async () => {
  let d = null;
  try {
    d = await D.open();
    const m = await d.fr.evaluate(() => {
      const out = {};
      out.saLeft = typeof SA_LEFT !== 'undefined' ? SA_LEFT : -1;
      /* every colour SA_MAP claims, asked for a real texture rather than trusted */
      /* *** saTex, NOT texFor, AND THE MUTATION TEST IS WHAT FORCED THIS. *** The first
         cut of this gate asked texFor() and reported 903 of 903 -- and then BOTH
         mutations passed, because texFor ALWAYS returns something: when the pool lookup
         misses it generates a texture with TEXKIND and caches it. So "texFor returned a
         tile" is trivially true and measures nothing, and I had written the exact gate
         this lane keeps filing notes about. saTex() returns NULL when the approved bank
         has no tile for that pool, which is the only question worth asking. */
      out.colours = {};
      let claimed = 0, answered = 0;
      for (const col of Object.keys(SA_MAP)) {
        let got = 0;
        for (let v = 0; v < 6; v++) { try { if (saTex(SA_MAP[col], v)) got++; } catch (e) {} }
        out.colours[col] = SA_MAP[col] + ' ' + got + '/6';
        claimed++; if (got === 6) answered++;
      }
      out.claimed = claimed; out.answered = answered;
      /* AND THE REAL SCREEN: what the ground pass would choose for every visible cell */
      const C = Math.round(HZOOM), gx = Math.floor(hx), gy = Math.floor(hy);
      const hw = Math.ceil(innerWidth / C) + 1, hh = Math.ceil(innerHeight / C) + 1;
      let total = 0, art = 0, road = 0, roadArt = 0;
      const bare = {};
      for (let y = gy - hh; y <= gy + hh; y++) for (let x = gx - hw; x <= gx + hw; x++) {
        const c = cellAt(x, y); if (!c) continue;
        total++;
        /* every route to a BANK tile, and none to the procedural fallback */
        let t = null; const v = c.gArtVariant || 0;
        try {
          if (c.gArtPool) t = saTex(c.gArtPool, v);
          if (!t && !c.s && SA_MAP[c.g]) t = saTex(SA_MAP[c.g], v);
          if (!t && c.s && typeof WALL_MAP !== 'undefined' && WALL_MAP[c.g]) t = saTex(WALL_MAP[c.g], v);
          if (!t && c.s && c.artPool_face) t = saTex(c.artPool_face, v);
        } catch (e) {}
        if (t) art++; else { const k = (c.s ? 'solid ' : 'ground ') + (c.g || '?');
          bare[k] = (bare[k] || 0) + 1; }
        if (!c.s && SA_MAP[c.g]) { road++; if (t) roadArt++; }
      }
      out.total = total; out.art = art; out.road = road; out.roadArt = roadArt;
      out.bare = Object.keys(bare).sort((a, b) => bare[b] - bare[a]).slice(0, 6)
        .map(k => k + ' ' + bare[k]);
      return out;
    });

    /* B1. *** THE ROW'S OWN QUESTION, ANSWERED ON THE REAL SCREEN. *** */
    ok('B1 *** EVERY CELL THE PLAYER CAN SEE RESOLVES TO A REAL TILE *** — ' + m.art
       + ' of ' + m.total + '. The row said 16% of them had no tile art at all and my own '
       + 'first probe said 20.2%; both were reading gArtPool, which the roadway does not use. '
       + 'Measured with saTex, which returns null when the approved bank has nothing -- NOT '
       + 'texFor, which always answers because it generates one'
       + (m.bare.length ? '   -- BARE: ' + m.bare.join(', ') : ''),
       m.total > 200 && m.art === m.total);

    /* B2. AND THE ROADWAY SPECIFICALLY, which is where the reported hole was. */
    ok('B2 and the roadway carries its own art — ' + m.roadArt + ' of ' + m.road
       + ' roadway cells resolve to a tile through the colour route',
       m.road >= 50 && m.roadArt === m.road);

    /* B3. EVERY COLOUR THE MAP CLAIMS ANSWERS. A map with a dead key is the real version
       of the bug the row was reaching for, and it would not show up in B1 until a cell
       of that kind happened to be on screen. */
    ok('B3 every colour SA_MAP claims returns a real texture at all six variants — '
       + m.answered + ' of ' + m.claimed + ' keys answer, so the map has no dead entry '
       + 'waiting for the day a cell of that kind comes on screen',
       m.claimed >= 10 && m.answered === m.claimed);

    /* B4. AND THE BANK FINISHED LOADING, because a half-loaded bank makes B1 a lie that
       only shows up as a slow start. */
    ok('B4 the street bank finished loading before any of this was measured (SA_LEFT='
       + m.saLeft + ')', m.saLeft === 0);

    ok('B5 nothing threw' + (d.errs.length ? ' -> ' + d.errs[0] : ''), d.errs.length === 0);

    console.log('  MEASURED ON THE DEMO, DRIVEN LIKE A PLAYER:');
    console.log('    cells on screen resolving to a tile : ' + m.art + ' of ' + m.total);
    console.log('    roadway cells doing it by colour    : ' + m.roadArt + ' of ' + m.road);
    console.log('    SA_MAP keys that answer 6/6         : ' + m.answered + ' of ' + m.claimed);
  } catch (e) {
    ok('harness ran: ' + e.message, false);
  }
  if (d) await d.close();

  console.log('='.repeat(74));
  console.log('  NO CELL GOES UNTEXTURED: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();

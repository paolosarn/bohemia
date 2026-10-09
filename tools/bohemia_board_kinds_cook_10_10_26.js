/* ============================================================================
   THE CELLS THAT ALL OPEN THE SAME FIGHT  (WORLD, 10/10/26)
   row [the cells with no board]

   THE VALLEY WITH EVERY CELL COLOURED BY THE BOARD IT FIGHTS ON. Nine real board
   kinds in nine quiet tones, and the tenth -- the catch-all -- lit.

   THE ROW'S PREMISE WAS WRONG AND THE PICTURE SHOWS THE CORRECTED ONE. The row
   (mine, last round) said 28 districts have no kit so a fight cut from them has
   nothing to build a board out of. The fight never cuts a board from a district
   kit. What is really true is that TWENTY-FOUR OF THE SEVENTY-EIGHT DISTRICTS
   FALL THROUGH TO THE SAME CATCH-ALL BOARD -- more than any real kind gets -- and
   the lit cells are the airfield, every civic building, the speedway, the
   stadium, and three of the six legendary gear places.

   REFERENCE CHECK
   COMPARED TO: DIST-03 (Las Vegas aerial -- where the airfield and the civic core
   really sit), CB-06 (the valley's own grain, ours, measured and gated), CB-03 (a
   Vegas block from the air), TG-05 (how a big dark surface reads) and AH-01 (the
   analog horror bible).

   STRUCTURAL RULES TAKEN:
     * DIST-03 -- the lit cells are where the real valley puts them: the airfield
       as one big block out past the edge of town, the civic core small and
       central. Nothing is arranged; the generator placed all of it.
     * CB-06 / CB-03 -- one flat tone a cell, the city's own grain, no outlines.
     * TG-05 -- the nine real kinds sit in a narrow dark band so the catch-all is
       the only lit thing and its shape reads at a glance.
     * AH-01 -- ordinary frame, ONE THING WRONG. A map colour-coded by which level
       loads is the ordinary part, the thing a level editor prints. THE WRONG
       THING IS WHAT IS LIT: the jail, the courthouse, the city hall, the police
       station, the hospital and the armoury are all the same place. Every
       building the old world used to keep order in has collapsed into one room.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_board_kinds_cook_10_10_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
let BK = require(path.join(REPO, 'engine/bohemia_boardkinds.js')); BK = BK.BOH_BOARDKINDS || BK;
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));

const N = 96, SEED = 1337, SEEDS = 20;

const PALETTE = {
  0: '#0a0a0c',                                  /* off the valley */
  1: '#17161a', 2: '#1d1c21', 3: '#232128',      /* the nine real board kinds, three steps */
  4: '#f2e4a8',                                  /* the catch-all: infrastructure */
  5: '#e8a63a',                                  /* the catch-all: civic */
  6: '#c96a3a'                                   /* the catch-all: a guarded compound */
};
const LEGEND = {
  0: 'off the valley',
  1: 'a board of its own', 2: 'a board of its own', 3: 'a board of its own',
  4: 'the same board: the airfield, the speedway, the stadium',
  5: 'the same board: the city hall, the courts, the jail, the hospital',
  6: 'the same board: the arsenal, the data fortress, the granary'
};
const FAM_TONE = { infrastructure: 4, civic: 5, plant: 6 };
/* the nine real kinds get a quiet step each, assigned by name so the picture is
   stable between runs and nothing is chosen to look good */
const QUIET = ['strip', 'freeway', 'shore', 'landfill', 'wash', 'scrub', 'culdesac', 'suburb_stem', 'suburb'];

function blank(w, h, f) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(f)); return g; }

function main() {
  /* ---- REFUSALS, before a pixel ---------------------------------------- */
  const ft = BK.fallThrough();
  if (!ft.length) {
    console.log('REFUSED: nothing falls through to the catch-all any more, so this picture is '
      + 'about a problem that is fixed. Retire it rather than draw an empty frame.');
    process.exit(1);
  }
  const orphan = ft.filter(r => !r.family);
  if (orphan.length) {
    console.log('REFUSED: ' + orphan.length + ' fall-through district(s) are in no family: '
      + orphan.map(r => r.district).join(', ') + '. A list of names is not a finding; the picture '
      + 'is coloured by family and would have to invent a colour.');
    process.exit(1);
  }
  const guessed = ft.filter(r => BK.standInFor(r.district).known === true);
  if (guessed.length) {
    console.log('REFUSED: ' + guessed.length + ' fall-through(s) now carry a guessed stand-in. '
      + 'A courthouse matched to a cul-de-sac is worse than the ruin it replaces.');
    process.exit(1);
  }

  /* ---- THE SWEEP: is this one seed or the valley? ------------------------ */
  let tot = 0, cat = 0;
  const famCells = { civic: 0, infrastructure: 0, plant: 0 };
  const seenFam = { civic: 0, infrastructure: 0, plant: 0 };
  for (let s = 1; s <= SEEDS; s++) {
    const m = OM.buildOvermap((s * 7919) % 1000003);
    const here = { civic: 0, infrastructure: 0, plant: 0 };
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const c = m.at ? m.at(x, y) : null; if (!c || !c.district) continue;
      tot++;
      if (BK.kindOf(c.district).catchAll) {
        cat++; const f = BK.familyOf(c.district); if (f) { famCells[f]++; here[f]++; }
      }
    }
    Object.keys(here).forEach(f => { if (here[f]) seenFam[f]++; });
  }
  const perValley = cat / SEEDS;
  if (perValley < 50) {
    console.log('REFUSED: only ' + perValley.toFixed(1) + ' cells a valley land on the catch-all '
      + 'over ' + SEEDS + ' rolled valleys. Under fifty this is a rounding error and the picture '
      + 'would be overstating it.');
    process.exit(1);
  }
  /* ONE SEED IS NOT THE VALLEY -- this lane has been bitten three times */
  const thin = Object.keys(seenFam).filter(f => seenFam[f] < SEEDS * 0.8);
  if (thin.length) {
    console.log('REFUSED: ' + thin.map(f => f + ' appears in only ' + seenFam[f] + ' of ' + SEEDS
      + ' valleys').join('; ') + '. The picture is drawn on one seed and must not show a family '
      + 'that most valleys do not have.');
    process.exit(1);
  }

  /* ---- THE FRAME -------------------------------------------------------- */
  const m = OM.buildOvermap(SEED);
  const img = blank(N, N, 0);
  let lit = 0, drawn = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const c = m.at ? m.at(x, y) : null;
    if (!c || !c.district) { img[y][x] = 0; continue; }
    drawn++;
    const k = BK.kindOf(c.district);
    if (k.catchAll) {
      const f = BK.familyOf(c.district);
      img[y][x] = FAM_TONE[f] || 4; lit++;
    } else {
      const i = QUIET.indexOf(k.kind);
      img[y][x] = 1 + ((i < 0 ? 0 : i) % 3);
    }
  }
  const litPct = lit / drawn * 100;
  if (litPct < 0.5 || litPct > 25) {
    console.log('REFUSED: the catch-all is ' + litPct.toFixed(2) + '% of the drawn frame. Under half '
      + 'a per cent nothing reads, over twenty-five and the lit cells stop being the exception.');
    process.exit(1);
  }

  /* ---- WRITE ------------------------------------------------------------ */
  const doc = {
    id: 'WORLD_THE_SAME_FIGHT', made: '10/10/26', lane: 'world', row: '[the cells with no board]',
    draft: true,
    measured: {
      districts: Object.keys(BK.districts()).length,
      fallThrough: ft.length,
      seedsSwept: SEEDS,
      cellsAValley: +perValley.toFixed(1),
      pctOfValley: +(cat / tot * 100).toFixed(2),
      byFamilyAValley: {
        civic: +(famCells.civic / SEEDS).toFixed(1),
        infrastructure: +(famCells.infrastructure / SEEDS).toFixed(1),
        plant: +(famCells.plant / SEEDS).toFixed(1)
      },
      litPctOfFrame: +litPct.toFixed(2),
      ghosts: BK.ghosts()
    }
  };
  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_THE_SAME_FIGHT_10_10_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_boardkinds_grid.json'),
    JSON.stringify({ g: img, pal: PALETTE, leg: LEGEND, w: N, h: N }));

  fs.writeFileSync(path.join(REPO, 'records/target/BOHEMIA_BOARD_KINDS.json'), JSON.stringify({
    _readme: 'WORLD [the cells with no board] 10/10: which board kind every district in the valley '
      + 'fights on. Written by tools/bohemia_board_kinds_cook_10_10_26.js from '
      + 'engine/bohemia_boardkinds.js -- do not hand edit. THE ROW\'S PREMISE WAS WRONG: a district '
      + 'with no kit is NOT a fight with no floor, because the fight never cuts a board from a '
      + 'district kit -- it asks nfKind() for one of nine board kinds and COMBAT deals from its '
      + 'block library. WHAT IS REALLY WRONG: 24 of the 78 districts fall through to the catch-all '
      + '`ruin`, more than any real kind gets, including the airport, every civic building and '
      + 'three of the six legendary gear places. NO STAND-IN IS GUESSED: matching a courthouse to a '
      + 'cul-de-sac because both are ~30% blocked is the 9/25 [bb places] defect. What is given '
      + 'instead is which BLOCK the library is missing, and the grouping into three families is '
      + 'stated as WORLD\'s reading with tuned:false.',
    version: 'BOHEMIA_BOARD_KINDS_v1', built: '2026-10-10',
    catchAll: BK.CATCH_ALL,
    districts: Object.keys(BK.districts()).sort().map(d => {
      const k = BK.kindOf(d);
      return { district: d, ground: BK.districts()[d], boardKind: k.kind,
               isCatchAll: k.catchAll, family: BK.familyOf(d) };
    }),
    familiesWithNoBlock: Object.keys(BK.FAMILIES).map(f => ({
      family: f, is: BK.FAMILIES[f].is, districts: BK.FAMILIES[f].districts,
      wantsABlock: BK.FAMILIES[f].wantsABlock, mine: true, tuned: false
    })),
    standInIsNotMine: BK.standInFor('courthouse'),
    namesTheFightKnowsThatNoGroundUses: BK.ghosts(),
    measured: doc.measured
  }, null, 1));

  console.log('wrote banks/BOHEMIA_THE_SAME_FIGHT_10_10_26.txt and records/target/BOHEMIA_BOARD_KINDS.json');
  console.log('  *** ' + ft.length + ' OF ' + Object.keys(BK.districts()).length
    + ' DISTRICTS OPEN THE SAME BOARD, MORE THAN ANY REAL KIND GETS ***');
  console.log('  ' + perValley.toFixed(1) + ' cells a valley over ' + SEEDS + ' rolled valleys ('
    + (cat / tot * 100).toFixed(2) + '%); lit is ' + litPct.toFixed(2) + '% of the frame');
  Object.keys(BK.FAMILIES).forEach(f => console.log('    ' + f.padEnd(15)
    + String(BK.FAMILIES[f].districts.length).padStart(2) + ' districts  '
    + (famCells[f] / SEEDS).toFixed(1).padStart(6) + ' cells a valley   ' + BK.FAMILIES[f].wantsABlock));
  console.log('  names the fight knows that no live ground uses: ' + (BK.ghosts().join(', ') || 'none'));
}

main();

/* ============================================================================
   THE FIFTEEN GROUNDS  (WORLD, 9/30/26)  --  row [board terrains], rule 46

   TWO THINGS COME OUT OF THIS TOOL:
     1. records/target/BOHEMIA_BOARD_TERRAINS.json -- ONE DATA FILE (MODS' line),
        the district-to-kind table plus the measured census, for COMBAT's board
        generator and COOK's asset list to read instead of re-deriving it.
     2. slices/vote/WORLD_FIFTEEN_GROUNDS.png -- the whole valley painted by the
        kind of ground a fight would start on.

   WHY THE PICTURE IS THE VALLEY AND NOT A SWATCH SHEET. His ruling is a
   PROPORTION -- "most cells are CITY kinds; nature kinds are the edge" -- and a
   proportion is the one thing a row of labelled squares cannot show. Painted onto
   the real map it is a single glance: the city is the middle and the nature kinds
   really are a rim around it. Rule 32(f), from the game's own camera, which for
   the overworld is this map (rule 33).

   AND IT IS THE SAME 96x96 GRID THE GAME USES, one pixel per cell, so what he is
   looking at is the assignment itself and not a drawing of it. The tool refuses if
   its own count and the module's disagree.

   REFERENCE CHECK
   COMPARED TO: DIST-03 (Las Vegas aerial -- the valley's real shape), CB-06 (the
   valley's own grain, ours, measured and gated), CB-03 (a Vegas block from the
   air), TG-05 (how a big dark surface reads) and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * DIST-03 / CB-06 -- the composition is the generator's. The mountains ring
       it, the freeways cut it, and nothing here is arranged for the picture.
     * CB-03 -- a block reads by its ground, so each kind gets ONE flat tone and
       no texture; this is a map of what a thing IS, not what it looks like.
     * TG-05 -- the tones sit in a narrow dark band so the map reads as one
       surface broken by boundaries, never as fifteen bright stickers.
     * AH-01 -- ordinary frame, one thing wrong. A land-use map of Las Vegas is
       the ordinary part; it is what a city planner would print. THE WRONG THING
       IS WHAT IT IS FOR. Every colour on it is a kind of ground a gunfight starts
       on, and the biggest one by a mile is the parking lot.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab, and a data
   file nothing reads yet.

     node tools/bohemia_board_terrains_cook_9_30_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));
const BT = require(path.join(REPO, 'engine/bohemia_boardterrain.js'));

const N = 96;
const SEEDS = 100;

/* ONE FLAT TONE PER KIND. This is a map of what a thing IS, so each kind gets one
   flat tone and no texture (CB-03).

   *** AND THE FIRST PALETTE HAD SEVEN PAIRS THE EYE READS AS ONE COLOUR, WHICH ON
   A MAP OF A PROPORTION IS THE WHOLE DEFECT. *** The two biggest kinds -- 61% of
   the valley between them -- came out at hue 36 against 42 with a lightness gap of
   0.027, and the check below found a worse pair I could not see at all because
   they are rarely adjacent: suburb_block against open_desert, hue gap 4, lightness
   gap 0.002. The 9/24 sand correction is the precedent and this is its lesson
   generalised: a hue check alone passes the version the eye rejects, so the rule
   is a gap in LIGHTNESS or a gap in HUE, held for every pair that really gets
   drawn. open_desert keeps #6e6045 because that is the walked city's own desert
   and this lane already fixed it once; everything else moved around it. */
const TONE = {
  suburb_block:    '#8c7f63',
  the_strip:       '#d8c79a',
  industrial:      '#4a3f52',
  open_desert:     '#6e6045',   /* the walked city's own desert, 9/24 -- LOCKED */
  wash_and_shore:  '#2d7f9c',
  hills:           '#463a2e',
  freeway:         '#1d1d20',
  lot_and_bigbox:  '#5e6470',
  trailer_park:    '#b08a4e',
  golf_and_park:   '#3f6b3c',
  ruin:            '#000000',   /* never drawn: a condition, not a kind */
  airport:         '#9aa3ad',
  casino_floor:    '#000000',   /* never drawn: an interior, not a kind */
  solar_and_pumps: '#334a78',
  landfill:        '#8d9c2a'
};

function main() {
  /* ---- 1. THE VOCABULARY, ACROSS MANY ROLLS ----------------------------- */
  const districts = {};
  let unmapped = {}, cityAll = 0, natureAll = 0;
  for (let s = 1; s <= SEEDS; s++) {
    const m = OM.buildOvermap((s * 7919) % 1000003);
    const c = BT.census(m);
    cityAll += c.city; natureAll += c.nature;
    for (const d in c.byDistrict) districts[d] = (districts[d] || 0) + c.byDistrict[d];
    for (const d in c.unmappedDistricts) unmapped[d] = (unmapped[d] || 0) + c.unmappedDistricts[d];
  }
  const distinct = Object.keys(districts).length;

  /* *** THE REFUSAL THIS ROW EXISTS FOR. *** A cell whose district no kind claims
     is a fight with no board under it, and it will not announce itself -- it will
     just be the one seed in twenty where a player falls through. */
  if (Object.keys(unmapped).length) {
    console.log('REFUSED: ' + Object.keys(unmapped).length + ' district(s) the generator makes '
      + 'have no terrain kind: ' + Object.keys(unmapped).join(', ')
      + '. A fight there would have no board.');
    process.exit(1);
  }
  /* AND THE OTHER DIRECTION: a kind claiming ground the generator never makes is
     an invented district, which is the thing this lane's own gate caught it doing
     on 9/27. */
  const invented = [];
  for (const k in BT.FROM) BT.FROM[k].forEach(d => { if (!districts[d]) invented.push(d); });
  if (invented.length) {
    console.log('REFUSED: this file claims ' + invented.length + ' district(s) the generator '
      + 'never makes: ' + invented.join(', '));
    process.exit(1);
  }

  /* ---- 2. HIS RULING, MEASURED ------------------------------------------ */
  const cityShare = 100 * cityAll / (cityAll + natureAll);
  if (cityShare < 60) {
    console.log('REFUSED: city is ' + cityShare.toFixed(1) + '% of the valley. '
      + 'He ruled MOST cells are CITY kinds and nature is the EDGE.');
    process.exit(1);
  }

  /* ---- 3. THE TWO THAT ARE NOT MAP KINDS -------------------------------- */
  const shown = BT.census(OM.buildOvermap(1337));
  for (const k in BT.NOT_ON_THE_MAP) {
    if (shown.byKind[k] !== 0) {
      console.log('REFUSED: ' + k + ' is declared ' + BT.NOT_ON_THE_MAP[k]
        + ' and the map assigned it ' + shown.byKind[k] + ' cells');
      process.exit(1);
    }
  }

  /* ---- 4. THE PICTURE: the valley painted by kind ------------------------ */
  const m = OM.buildOvermap(1337);
  const pal = { 0: '#0c0c0e' };
  const idx = {};
  BT.KINDS.forEach((k, i) => { idx[k] = i + 1; pal[i + 1] = TONE[k]; });
  const g = [];
  let painted = 0;
  for (let y = 0; y < N; y++) {
    const row = new Array(N).fill(0);
    for (let x = 0; x < N; x++) {
      const a = BT.at(m, x, y);
      if (!a.known) continue;
      row[x] = idx[a.kind];
      painted++;
    }
    g.push(row);
  }
  /* the picture must agree with the module, not illustrate it */
  if (painted !== shown.mapped) {
    console.log('REFUSED: the picture painted ' + painted + ' cells and the module counts '
      + shown.mapped + '. The drawing must agree with the engine.');
    process.exit(1);
  }

  /* *** ANY TWO KINDS ON THIS MAP MUST BE TELLABLE APART, AND THE FIRST CUT'S
     TWO BIGGEST WERE NOT. *** suburb_block and lot_and_bigbox came out at hue 36
     against 42 with a lightness gap of 0.027 -- between them 61% of the valley,
     painted in what the eye reads as one colour, on a picture whose entire job is
     showing a proportion. This is the 9/24 sand correction's lesson generalised:
     a hue check alone would have passed it, so the rule is a gap in LIGHTNESS or
     a gap in HUE, and it is held for every pair of kinds that really gets drawn. */
  const lum = (h) => {
    const n = parseInt(h.slice(1), 16);
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(n >> 16 & 255) + 0.7152 * f(n >> 8 & 255) + 0.0722 * f(n & 255);
  };
  const hue = (h) => {
    const n = parseInt(h.slice(1), 16);
    const r = (n >> 16 & 255) / 255, gg = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), d = mx - mn;
    if (!d) return 0;
    let H = mx === r ? ((gg - b) / d) % 6 : (mx === gg ? (b - r) / d + 2 : (r - gg) / d + 4);
    return (H * 60 + 360) % 360;
  };
  const drawn = BT.KINDS.filter(k => (shown.byKind[k] || 0) > 0);
  let closest = { pair: null, lum: 9, hue: 999 };
  for (let a = 0; a < drawn.length; a++) for (let b = a + 1; b < drawn.length; b++) {
    const ta = TONE[drawn[a]], tb = TONE[drawn[b]];
    const dl = Math.abs(lum(ta) - lum(tb));
    let dh = Math.abs(hue(ta) - hue(tb)); if (dh > 180) dh = 360 - dh;
    if (dl < 0.04 && dh < 25) {
      console.log('REFUSED: ' + drawn[a] + ' and ' + drawn[b] + ' are the same colour to the eye '
        + '(lightness gap ' + dl.toFixed(3) + ', hue gap ' + dh.toFixed(0) + '). '
        + 'A map of a proportion has to let you tell its parts apart.');
      process.exit(1);
    }
    if (dl < closest.lum && dh < closest.hue) closest = { pair: drawn[a] + '/' + drawn[b], lum: dl, hue: dh };
  }

  const legend = {};
  legend[0] = 'off the valley';
  BT.KINDS.forEach((k, i) => {
    legend[i + 1] = k + (BT.NOT_ON_THE_MAP[k] ? ' (' + BT.NOT_ON_THE_MAP[k] + ', never on the map)' : '')
      + ' -- ' + (shown.byKind[k] || 0) + ' cells';
  });

  /* ---- 5. THE DATA FILE (MODS' line: one file, a _readme, no code) ------- */
  const data = {
    _readme: 'WORLD [board terrains] 9/30, rule 46: the terrain kind every map cell carries, '
      + 'which COMBAT\'s board generator reads and COOK cooks assets for. Written by '
      + 'tools/bohemia_board_terrains_cook_9_30_26.js from engine/bohemia_boardterrain.js -- '
      + 'do not hand edit, change the module and re-run. TWO OF THE FIFTEEN ARE NOT MAP KINDS: '
      + 'ruin is a CONDITION (act one IS the ruin, so a burnt block is a state a suburb or strip '
      + 'cell is in) and casino_floor is an INTERIOR (reached by going in from a strip cell). '
      + 'Thirteen kinds come off the map. WHAT A BOARD LOOKS LIKE IS NOT HERE and is not this '
      + 'lane\'s: the assets, blockers, mounds, roofs and spawns are COMBAT\'s and COOK\'s.',
    version: 'BOHEMIA_BOARD_TERRAINS_v1',
    built: '2026-09-30',
    kinds: BT.KINDS,
    notOnTheMap: BT.NOT_ON_THE_MAP,
    nature: BT.NATURE,
    fromDistrict: BT.FROM,
    measured: {
      seedsSwept: SEEDS,
      distinctDistricts: distinct,
      unmappedDistricts: 0,
      cityPct: +cityShare.toFixed(1),
      naturePct: +(100 - cityShare).toFixed(1),
      onSeed1337: { cells: shown.cells, mapped: shown.mapped, byKind: shown.byKind }
    },
    oneSeedIsNotTheValley: 'built against seed 1337 alone this table read 75 districts and mapped '
      + '9,216 of 9,216 cells -- clean, and wrong. Rule 40(g) rolls the valley per new game; a '
      + 'hundred seeds make 78 districts, and the three seed 1337 never places (drivein, library, '
      + 'fort) would each have been a cell a fight could start on with no board under it.'
  };
  fs.writeFileSync(path.join(REPO, 'records/target/BOHEMIA_BOARD_TERRAINS.json'),
    JSON.stringify(data, null, 1));

  const doc = {
    version: 'BOHEMIA_FIFTEEN_GROUNDS_v1', built: '2026-09-30',
    lane: 'WORLD, row [board terrains], rule 46',
    draft: true,
    his_words: 'no single combat map in Battle Brothers is exactly the same... different terrains, nature zones, tile blockers... let us just recreate Battle Brothers with our whole swag. AND: most fights are block wars, most cells are CITY kinds, nature kinds are the edge.',
    what_the_picture_says: 'the whole valley painted by the kind of ground a fight would start on. His ruling is a PROPORTION and a proportion is the one thing a row of labelled squares cannot show: painted on the real map, the city is the middle and the nature kinds really are a rim around it.',
    two_are_not_map_kinds: 'RUIN is a CONDITION (act one IS the ruin, so a burnt block is a state a suburb or strip cell is in, never a kind of ground the map makes) and CASINO FLOOR is an INTERIOR (you arrive at a strip cell and go in). Naming them beats quietly assigning them cells that are never coming: COOK cooks scorched VARIANTS of T1 and T2 rather than a tileset nothing would ever select.',
    one_seed_is_not_the_valley: data.oneSeedIsNotTheValley,
    measured: data.measured,
    tonesSeparable: { closestPair: closest.pair, lightnessGap: +closest.lum.toFixed(3), hueGap: +closest.hue.toFixed(0) },
    the_wrong_thing: 'AH-01: a land-use map of Las Vegas is the ordinary part, the thing a city planner would print. THE WRONG THING IS WHAT IT IS FOR. Every colour on it is a kind of ground a gunfight starts on, and the biggest one by a mile is the parking lot.',
    size: { grid: N + 'x' + N, oneCellOnePixel: true },
    palette: pal, legend: legend,
    not_shipped: 'rule 18: a picture for the VOTE tab, and a data file nothing reads yet.',
    build_source: main.toString().slice(0, 4000)
  };
  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_FIFTEEN_GROUNDS_9_30_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_fifteengrounds_grid.json'),
    JSON.stringify({ g: g, pal: pal, leg: legend, w: N, h: N }));

  console.log('wrote records/target/BOHEMIA_BOARD_TERRAINS.json  and  banks/BOHEMIA_FIFTEEN_GROUNDS_9_30_26.txt');
  console.log('  *** ' + SEEDS + ' SEEDS SWEPT, ' + distinct + ' DISTINCT DISTRICTS, 0 UNMAPPED ***');
  console.log('  city ' + cityShare.toFixed(1) + '%   nature ' + (100 - cityShare).toFixed(1) + '%   (his ruling: city is most, nature is the edge)');
  console.log('  on seed 1337: ' + shown.mapped + ' of ' + shown.cells + ' cells painted');
  Object.entries(shown.byKind).sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
    console.log('    ' + String(v).padStart(5) + '  ' + k + (BT.NOT_ON_THE_MAP[k] ? '   <- ' + BT.NOT_ON_THE_MAP[k] + ', never on the map' : '')));
}

main();

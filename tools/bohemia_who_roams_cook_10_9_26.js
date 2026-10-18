/* ============================================================================
   HOW FAST, AND WHO  (WORLD, 10/9/26)  --  row [the valley's grounds], rule 75b

   HIS ROW: which crews roam which part of the valley, and what each ground costs
   to cross. THE GROUND PICKS WHO SHOWS UP.

   THE SAME VALLEY, TWICE, ONE PIXEL PER CELL on the grid the game really uses.
   LEFT: HOW FAST YOU CROSS IT. RIGHT: HOW TIGHTLY ONE OUTFIT HOLDS IT.
   Both are read out of the live map at the moment the tool runs; neither is a
   drawing of a table.

   *** WHY THE RIGHT PANEL IS NOT COLOURED BY FACTION. *** COLOUR IS TERRITORY
   (8/26) and its gate says in its own head that WHICH FACTION OWNS WHICH HUE IS
   HIS. So painting fourteen outfits in fourteen colours of mine would be this
   lane deciding content it does not own, in a picture, where it is hardest to
   notice. It paints GRIP instead: pale where one outfit owns nearly every cell
   of that ground, dark where the ground is split. That needs no faction colour,
   it cannot leak a ruling, and it is the better read anyway -- the question a
   player asks before crossing is not "whose is this" but "is this one outfit's".

   WHAT THE TWO PANELS SAY TOGETHER, and it is the row's own sentence: the fast
   ground and the owned ground are NOT the same ground. The freeway is the
   quickest way across the valley and it runs through the most tightly held
   ground in it. The ranges are the slowest and the emptiest.

   REFERENCE CHECK
   COMPARED TO: DIST-03 (Las Vegas aerial -- the valley's real shape), CB-06 (the
   valley's own grain, ours, measured and gated), CB-03 (a Vegas block from the
   air), TG-05 (how a big dark surface reads) and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * DIST-03 / CB-06 -- the composition is the generator's. The mountains ring
       it and the freeways cut it; nothing is arranged for the picture.
     * CB-03 -- one flat tone per cell, no texture: this is a map of a fact.
     * TG-05 -- both panels are one ramp inside a narrow band, so the map reads as
       a single surface broken by its own boundaries rather than as a chart.
     * AH-01 -- ordinary frame, one thing wrong. Two travel maps of a valley is
       the ordinary part, the thing a haulage company would print. THE WRONG
       THING IS THE SECOND ONE: it is the same roads, shaded by how completely
       one outfit owns the ground under them, and the brightest thing on it is
       the Strip.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_who_roams_cook_10_9_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));
const T = require(path.join(REPO, 'engine/bohemia_towns.js'));
const CE = require(path.join(REPO, 'engine/bohemia_cityedit.js'));
const BT = require(path.join(REPO, 'engine/bohemia_boardterrain.js'));
const VG = require(path.join(REPO, 'engine/bohemia_valleyground.js'));

const N = 96;
const GAP = 8;

/* ONE RAMP PER PANEL, five steps, in a narrow band (TG-05). The left ramp is
   warm because it is about ground; the right is cold because it is about people.
   NEITHER RAMP NAMES A FACTION. */
const PALETTE = {
  0: '#0b0b0d',                                   /* the gap */
  1: '#2a2520', 2: '#473d30', 3: '#6b5c45', 4: '#96835e', 5: '#c8b183',  /* slow -> fast */
  6: '#1b2026', 7: '#2c3a46', 8: '#415a69', 9: '#5d82a0', 10: '#8fb6d4' /* split -> one outfit's */
};
const LEGEND = {
  0: 'the gap between the panels',
  1: 'slowest ground', 2: 'slow', 3: 'middling', 4: 'quick', 5: 'the road, full speed',
  6: 'nobody owns it', 7: 'split many ways', 8: 'a few outfits', 9: 'mostly one outfit',
  10: 'one outfit owns it'
};

function blank(w, h, f) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(f)); return g; }
function band(v, lo, hi, base) {
  const t = (v - lo) / (hi - lo || 1);
  return base + Math.max(0, Math.min(4, Math.round(t * 4)));
}

function main() {
  const seed = 1337;
  const m = OM.buildOvermap(seed);
  const G = JSON.parse(fs.readFileSync(path.join(REPO, 'engine/BOHEMIA_faction_graph.json'), 'utf8'));
  const seats = T.derive(G, T.districtsOf(m, CE.cat), 1) || [];
  const turf = T.turf(m, CE.cat, seats);

  if (!seats.length || !turf || typeof turf.at !== 'function') {
    console.log('REFUSED: no live turf, so who roams where cannot be read off the map');
    process.exit(1);
  }

  /* ---- the grip of every ground, derived -------------------------------- */
  const grip = {}, speed = {};
  const live = VG.grounds().filter(g => VG.speedOf(g).known);
  live.forEach(g => {
    const p = VG.poolOf({ map: m, turf: turf, ground: g });
    grip[g] = (p.known && p.pool.length) ? p.pool[0].share : 0;
    speed[g] = VG.speedOf(g).speed;
  });

  /* ---- the two panels --------------------------------------------------- */
  const L = blank(N, N, 0), R = blank(N, N, 0);
  let painted = 0, unheld = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const a = BT.at(m, x, y);
    if (!a.known) continue;
    const s = VG.speedOf(a.kind);
    if (!s.known) continue;
    painted++;
    L[y][x] = band(s.speed, 0.25, 1.00, 1);
    const t = turf.at(x, y);
    if (!t || !t.faction) unheld++;
    R[y][x] = band(grip[a.kind], 0.10, 0.95, 6);
  }

  /* ---- THE REFUSALS ----------------------------------------------------- */

  /* 1. EVERY CELL A PARTY COULD STAND ON HAS A GROUND AND A SPEED. The row's own
     gate line. A cell with no speed is a party that cannot be told how long it
     takes to get anywhere. */
  const c = VG.census(m, turf);
  if (c.withSpeed !== c.cells) {
    console.log('REFUSED: ' + (c.cells - c.withSpeed) + ' of ' + c.cells
      + ' cells have no travel speed. Every map cell has a ground.');
    process.exit(1);
  }
  if (c.unheld) {
    console.log('REFUSED: ' + c.unheld + ' cells are held by nobody, so the pool there is empty');
    process.exit(1);
  }

  /* 2. *** THE TWO PANELS MUST SAY DIFFERENT THINGS. *** If fast ground were
     simply owned ground the second panel would be the first one tinted, and the
     row's finding would be an artefact of my own ramp. */
  let same = 0;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (!L[y][x]) continue;
    if ((L[y][x] - 1) === (R[y][x] - 6)) same++;
  }
  const agree = same / painted;
  if (agree > 0.75) {
    console.log('REFUSED: the two panels agree on ' + (100 * agree).toFixed(0)
      + '% of the valley, so the second one is the first one tinted');
    process.exit(1);
  }

  /* 3. NO FACTION IS NAMED BY A COLOUR. COLOUR IS TERRITORY: which faction owns
     which hue is HIS, so this tool may not hand one out, even by accident. */
  const names = seats.map(s => s.faction);
  const src = main.toString();
  const leaked = names.filter(n => new RegExp(n + '\\s*:\\s*[\'"]#', 'i').test(src));
  if (leaked.length) {
    console.log('REFUSED: this tool gives ' + leaked.join(', ') + ' a colour, and whose hue is whose is his');
    process.exit(1);
  }

  /* 4. THE SPREAD HAS TO BE REAL on both panels, or a ramp is doing the talking */
  const used = (p) => { const s = new Set(); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (p[y][x]) s.add(p[y][x]); return s.size; };
  if (used(L) < 4 || used(R) < 4) {
    console.log('REFUSED: a panel uses only ' + Math.min(used(L), used(R)) + ' of its five steps');
    process.exit(1);
  }

  /* ---- the image -------------------------------------------------------- */
  const IW = N * 2 + GAP, IH = N;
  const img = blank(IW, IH, 0);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) img[y][x] = L[y][x];
    for (let x = 0; x < N; x++) img[y][x + N + GAP] = R[y][x];
  }

  const rows = live.map(g => ({
    ground: g, speed: speed[g], from: VG.speedOf(g).from,
    cells: c.byGround[g] || 0,
    topShare: +grip[g].toFixed(3),
    topHolder: 'derived, not named here'
  })).sort((a, b) => b.speed - a.speed);

  const fastest = rows[0], slowest = rows[rows.length - 1];
  const tightest = rows.slice().sort((a, b) => b.topShare - a.topShare)[0];
  const loosest = rows.slice().sort((a, b) => a.topShare - b.topShare)[0];

  const doc = {
    version: 'BOHEMIA_HOW_FAST_AND_WHO_v1', built: '2026-10-09',
    lane: 'WORLD, row [the valley\'s grounds], rule 75b',
    draft: true,
    his_words: 'which crews roam which part of the valley; the ground picks who shows up; the travel costs translated off the Battle Brothers wiki map speeds.',
    rule_12: 'THE GROUNDS WERE ALREADY BUILT. [board terrains] 9/30 gave every cell one of thirteen kinds, 0 unmapped across a hundred rolled valleys, so this writes NO second list of grounds -- a ground IS a terrain kind and the gate refuses if the two stop agreeing. What was missing was the cost and the pool.',
    the_two_speed_world: 'MEASURED on the walked surface: PAVED = {asphalt, concrete} and PAVED_SPEED.factor = 0.5, so a paved cell costs half and EVERY OTHER CELL IN LAS VEGAS COSTS THE SAME -- the mountains cost exactly what a parking lot costs. His translated numbers are a five-speed world where the road beats a dirt track by less (1 against 0.75, not 2 against 1) and the ranges are four times worse than a road. The shipped number is not wrong, it is COARSE: it was a street rule and this is a map rule. Nothing here touches the street.',
    ruled_and_measured: 'Four grounds have a speed from his own row. The other nine do not, and inventing nine numbers is what rule 36 forbids, so they are MEASURED off the city\'s own kits -- how much of a ground is open rather than built or blocked is a fact about the city. AND THE DERIVED SCALE IS ANCHORED ON A RULED POINT: open desert measures 0.50 open and he ruled it 0.75, so the scale is openShare x 1.5 and his number sets it. Retune the desert and every derived ground moves.',
    the_pool_is_not_a_table: 'who roams a ground is WHICH FACTIONS HOLD CELLS OF IT, counted off the live turf, which already answers for all 9,216 cells with 14 factions and nothing unheld. Nothing is authored, so taking a faction\'s ground stops its crews showing up with nothing to edit.',
    why_not_coloured_by_faction: 'COLOUR IS TERRITORY (8/26) and its gate says in its own head that which faction owns which hue is HIS. Painting fourteen outfits in fourteen colours of mine would be this lane deciding content it does not own, in a picture, where it is hardest to notice. The right panel paints GRIP instead -- pale where one outfit owns nearly every cell of that ground, dark where it is split -- which needs no faction colour and is the better read anyway.',
    the_finding: 'THE FAST GROUND AND THE OWNED GROUND ARE NOT THE SAME GROUND. The quickest way across the valley runs through the most tightly held ground in it, and the slowest ground is the emptiest.',
    measured: {
      seed: seed, cells: c.cells, withGround: c.withGround, withSpeed: c.withSpeed,
      held: c.held, unheld: c.unheld, factions: Object.keys(turf.byFaction).length,
      grounds: live.length, notGrounds: Object.keys(VG.NOT_A_GROUND).length,
      panelsAgreePct: +(100 * agree).toFixed(1),
      fastest: { ground: fastest.ground, speed: fastest.speed, from: fastest.from },
      slowest: { ground: slowest.ground, speed: slowest.speed, from: slowest.from },
      tightestHeld: { ground: tightest.ground, topShare: tightest.topShare },
      loosestHeld: { ground: loosest.ground, topShare: loosest.topShare },
      rows: rows
    },
    the_wrong_thing: 'AH-01: two travel maps of a valley is the ordinary part, the thing a haulage company would print. THE WRONG THING IS THE SECOND ONE -- the same roads, shaded by how completely one outfit owns the ground under them, and the brightest thing on it is the Strip.',
    size: { image: IW + 'x' + IH, oneCellOnePixel: true },
    palette: PALETTE, legend: LEGEND,
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: main.toString().slice(0, 4000)
  };

  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_HOW_FAST_AND_WHO_10_9_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_howfastandwho_grid.json'),
    JSON.stringify({ g: img, pal: PALETTE, leg: LEGEND, w: IW, h: IH }));

  /* the data file the row asked for, MODS' line */
  fs.writeFileSync(path.join(REPO, 'records/target/BOHEMIA_VALLEY_GROUNDS.json'), JSON.stringify({
    _readme: 'WORLD [the valley\'s grounds] 10/9, rule 75b: every ground of the valley with its '
      + 'travel speed and its faction pool. Written by tools/bohemia_who_roams_cook_10_9_26.js from '
      + 'engine/bohemia_valleyground.js -- do not hand edit, change the module and re-run. '
      + 'A GROUND IS A TERRAIN KIND ([board terrains], 9/30): there is no second list. '
      + 'SPEEDS ARE RULED WHERE HE RULED ONE (road 1, dirt 0.75, wash 0.5, the ranges 0.25, off the '
      + 'Battle Brothers wiki, translated in his row) AND MEASURED WHERE HE DID NOT, off the city\'s '
      + 'own kits, on a scale anchored to his ruled dirt speed. Every value carries tuned:false and '
      + 'its source; every felt number is TUNING\'s (rule 36). '
      + 'THE POOL IS NOT STORED: who roams a ground is who holds its cells, counted off the live '
      + 'turf at read time, so taking ground changes it with nothing to edit. '
      + 'THREE THINGS IN HIS LIST ARE NOT GROUNDS and say so by name: rubble is the RUIN, which is a '
      + 'CONDITION; the casino floor is an INTERIOR; a RIDGE is a feature inside the hills and '
      + 'nothing in this valley marks one.',
    version: 'BOHEMIA_VALLEY_GROUNDS_v1', built: '2026-10-09',
    grounds: live.map(g => {
      const s = VG.speedOf(g), si = VG.sightOf(g);
      return { ground: g, speed: s.speed, speedFrom: s.from, as: s.as || null,
               openShare: s.openShare === undefined ? null : s.openShare,
               sight: si.sight, tuned: false, ruling: s.ruling };
    }),
    anchor: VG.ANCHOR,
    notGrounds: VG.NOT_A_GROUND,
    poolIsDerived: 'bohemia_valleyground.poolOf({map, turf, ground}) counts the live turf; no pool is stored here',
    measured: doc.measured
  }, null, 1));

  console.log('wrote banks/BOHEMIA_HOW_FAST_AND_WHO_10_9_26.txt and records/target/BOHEMIA_VALLEY_GROUNDS.json');
  console.log('  ' + c.cells + ' cells, ' + c.withSpeed + ' with a speed, ' + c.unheld + ' unheld, '
    + Object.keys(turf.byFaction).length + ' factions');
  console.log('  fastest ' + fastest.ground + ' ' + fastest.speed + ' (' + fastest.from + ')'
    + '   slowest ' + slowest.ground + ' ' + slowest.speed + ' (' + slowest.from + ')');
  console.log('  *** TIGHTEST HELD ' + tightest.ground + ' at ' + Math.round(100 * tightest.topShare)
    + '% one outfit;  LOOSEST ' + loosest.ground + ' at ' + Math.round(100 * loosest.topShare) + '% ***');
  console.log('  the two panels agree on ' + (100 * agree).toFixed(0) + '% of the valley');
}

main();

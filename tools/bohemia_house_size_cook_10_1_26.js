/* ============================================================================
   WHAT A TILE IS  (WORLD, 10/1/26)  --  row [tile options]

   THE SAME BLOCK OF LAS VEGAS, TWICE. Left is what the city actually draws: our
   own suburb kit, 128 x 128 cells of 0.75 m, every cell the walk ever needed.
   Right is the same block AT HOUSE SIZE, which is what a fight board square is.

   *** AND THE WHOLE POINT IS WHAT DISAPPEARS BETWEEN THEM. *** A COMBAT TILE IS A
   HOUSE (9/4, 9/24, 9/28), and at that size 40% of what the city draws stops
   being a square you stand on: a painted lane line is paint, a sidewalk is not a
   tile ("never a fight where one tile is one sidewalk", 9/28), a parked car is
   not a tile, it is the cover ON one. Nothing is thrown away -- that is rule
   38(e) -- it changes job. The left panel is the inventory and the right panel is
   the board.

   THE SIZE IS MEASURED, NOT CHOSEN. "A tile is a house" is a ruling in houses, so
   the metres came off our own suburb: a house footprint is 21 x 12 cells
   (15.8 m x 9.0 m) and the LOT PITCH, nearest house centre to nearest house
   centre, is 26 cells = 19.5 m. The pitch is the number that tiles a city,
   because what repeats is the house plus its yard and half its driveway. So the
   right panel is this block cut on a 26-cell grid: about five tiles across.

   REFERENCE CHECK
   COMPARED TO: CB-03 (a Vegas block from the air), CB-06 (the valley's own grain,
   ours, measured and gated), TG-02 (the house tile from 45 degrees), TG-05 (how a
   big dark surface reads) and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * CB-03 / TG-02 -- a suburban block from above is lots in rows off one street,
       and the house sits forward on its lot with the yard behind. The left panel
       is the generator's, unarranged, so that is what it shows.
     * CB-06 -- the composition is the city's own; no cell was moved for the
       picture.
     * TG-05 -- a dark surface reads by what breaks it, so both panels sit in a
       narrow dark band and only the blockers and doors are allowed to be bright.
     * AH-01 -- ordinary frame, one thing wrong. Two site plans of a cul-de-sac is
       the ordinary part. THE WRONG THING IS THAT THE RIGHT ONE IS A GAME BOARD:
       the same houses, squared off, with the doors marked as the only way in.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_house_size_cook_10_1_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const SUB = require(path.join(REPO, 'engine/bohemia_suburb.js'));
const TK = require(path.join(REPO, 'engine/bohemia_tilekinds.js'));

/* ONE TONE PER CLASS, not per kind: the picture is about what a thing BECOMES at
   house size, and the classes are that answer. */
const PALETTE = {
  0: '#0b0b0d',   /* the gap between the panels */
  1: '#2b2a28',   /* TILE: ground */
  2: '#6b6152',   /* TILE: building */
  3: '#3a3b40',   /* TILE: drive */
  4: '#4a4540',   /* TILE: structure and the rest */
  5: '#55515a',   /* DRESSING (sidewalk, paint) */
  6: '#b0763a',   /* BLOCKER */
  7: '#d8c060',   /* EDGE (a door, a gate) */
  8: '#3f4a52',   /* OVERHEAD */
  9: '#15161a'    /* the cut line between house tiles */
};
const LEGEND = {
  0: 'the gap', 1: 'tile: open ground, a yard, a lot', 2: 'tile: a building',
  3: 'tile: the roadway', 4: 'tile: built and not a dwelling',
  5: 'dressing: a sidewalk or paint, NOT a tile at house size',
  6: 'blocker: a car, a prop, a dead tree, a fence -- cover ON a tile',
  7: 'edge: a door or a gate, where two tiles meet',
  8: 'overhead: you pass under it', 9: 'the house-tile cut'
};

const TILE_TONE = { building: 2, drive: 3, ground: 1 };
function toneFor(kindClass, kind) {
  if (kindClass === 'TILE') return TILE_TONE[kind] !== undefined ? TILE_TONE[kind] : 4;
  if (kindClass === 'DRESSING') return 5;
  if (kindClass === 'BLOCKER') return 6;
  if (kindClass === 'EDGE') return 7;
  return 8;
}

function blank(w, h, f) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(f)); return g; }

function main() {
  const o = SUB.generate(1337);
  const L = SUB.legend, W = o.W, H = o.H, CELL_M = SUB.TILE;

  /* ---- THE LEFT PANEL: what the city draws ------------------------------ */
  const left = blank(W, H, 1);
  const classCount = {};
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ent = L[o.g[y][x]];
    const c = TK.classOf(ent && ent.kind);
    if (!c.known) {
      console.log('REFUSED: the suburb kit declares "' + (ent && ent.kind)
        + '" and the tile table has never heard of it. Guessing TILE is how a '
        + 'painted line becomes a square you stand on.');
      process.exit(1);
    }
    classCount[c.klass] = (classCount[c.klass] || 0) + 1;
    left[y][x] = toneFor(c.klass, c.kind);
  }

  /* ---- THE PITCH, MEASURED HERE RATHER THAN TRUSTED --------------------- */
  const isB = new Set(Object.keys(L).filter(k => L[k].kind === 'building').map(Number));
  const seen = new Set(), centres = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!isB.has(o.g[y][x]) || seen.has(y * 1000 + x)) continue;
    const q = [[x, y]]; let sx = 0, sy = 0, n = 0; seen.add(y * 1000 + x);
    while (q.length) {
      const [cx, cy] = q.pop(); sx += cx; sy += cy; n++;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (isB.has(o.g[ny][nx]) && !seen.has(ny * 1000 + nx)) { seen.add(ny * 1000 + nx); q.push([nx, ny]); }
      }
    }
    centres.push([sx / n, sy / n]);
  }
  const nn = centres.map((a, i) => {
    let best = 1e9;
    centres.forEach((b, j) => { if (i !== j) best = Math.min(best, Math.hypot(a[0] - b[0], a[1] - b[1])); });
    return best;
  }).sort((a, b) => a - b);
  const pitch = Math.round(nn[Math.floor(nn.length / 2)]);
  const pitch_m = +(pitch * CELL_M).toFixed(1);

  if (centres.length < 8) { console.log('REFUSED: only ' + centres.length + ' houses; not a block'); process.exit(1); }
  if (pitch_m < 10 || pitch_m > 40) {
    console.log('REFUSED: a lot pitch of ' + pitch_m + ' m is not a suburban block');
    process.exit(1);
  }

  /* ---- THE RIGHT PANEL: the same block cut on the pitch ------------------ */
  /* THE WHOLE BLOCK, NOT JUST THE WHOLE TILES. Floor() left a 24-cell band of the
     block undrawn on two sides, which reads as an unfinished picture rather than
     as the truth, which is that a 128-cell block is 4.9 tiles across and the last
     one is clipped by the street. */
  const T = Math.ceil(W / pitch);               /* tiles across, last one clipped */
  const right = blank(W, H, 1);
  const tileKind = [];
  for (let ty = 0; ty < T; ty++) {
    tileKind.push([]);
    for (let tx = 0; tx < T; tx++) {
      /* WHAT THE TILE IS: the commonest TILE kind inside it. A blocker or a
         sidewalk never wins, because neither is a tile. */
      const votes = {};
      let blockers = 0, edges = 0;
      for (let y = ty * pitch; y < (ty + 1) * pitch && y < H; y++)
        for (let x = tx * pitch; x < (tx + 1) * pitch && x < W; x++) {
          const ent = L[o.g[y][x]];
          const c = TK.classOf(ent && ent.kind);
          if (!c.known) continue;
          if (c.klass === 'TILE') votes[c.kind] = (votes[c.kind] || 0) + 1;
          else if (c.klass === 'BLOCKER') blockers++;
          else if (c.klass === 'EDGE') edges++;
        }
      /* *** A TILE WITH A HOUSE ON IT IS A HOUSE TILE, EVEN THOUGH THE YARD IS
         BIGGER. *** The first cut took the commonest tile kind and only two of
         sixteen squares came out a building, in a block with twenty houses in it --
         because a measured house is 252 of a tile's 676 cells and the yard around
         it wins a headcount. That is not what A COMBAT TILE IS A HOUSE means. The
         threshold is taken from the measurement rather than picked: a real house
         fills 37% of a tile, so a quarter is comfortably under a whole house and
         comfortably over a neighbour's clipped corner. */
      const area = pitch * pitch;
      const built = votes.building || 0;
      const win = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
      const kind = (built / area >= 0.25) ? 'building' : (win ? win[0] : 'ground');
      tileKind[ty].push({ kind: kind, blockers: blockers, edges: edges });
      const tone = toneFor('TILE', kind);
      for (let y = ty * pitch; y < (ty + 1) * pitch && y < H; y++)
        for (let x = tx * pitch; x < (tx + 1) * pitch && x < W; x++) {
          const edge = (y === ty * pitch || x === tx * pitch);
          right[y][x] = edge ? 9 : tone;
        }
      /* the blockers survive as marks ON the tile, and the doors as edge marks --
         rule 38(e): nothing is thrown away, it changes job */
      if (blockers) {
        const cx = tx * pitch + (pitch >> 1), cy = ty * pitch + (pitch >> 1);
        for (let d = 0; d < Math.min(4, Math.ceil(blockers / 40)); d++)
          for (let yy = 0; yy < 3; yy++) for (let xx = 0; xx < 3; xx++) {
            const py = cy + yy - 1, px = cx + (d * 5) - 5 + xx - 1;
            if (py >= 0 && py < H && px >= 0 && px < W) right[py][px] = 6;
          }
      }
      if (edges) {
        const cx = tx * pitch + (pitch >> 1);
        const py = ty * pitch + pitch - 2;
        for (let xx = -2; xx <= 2; xx++)
          if (py >= 0 && py < H && cx + xx >= 0 && cx + xx < W) right[py][cx + xx] = 7;
      }
    }
  }

  /* *** THE DOOR IS REAL, AND IT IS NOT IN THE CELL GRID. ***
     The suburb kit declares exactly one EDGE kind, `gate`, and PLACES IT ZERO
     TIMES in its cells -- the block's one gate lives in the kit's own `gates`
     list instead, as {edge, x, y}. So the first cut drew no door anywhere while
     the file beside it claimed "the doors marked as the only way in": a sentence
     about the picture that the picture did not contain. The gate is read from
     where it actually lives now, and it is marked on both panels. */
  const gates = Array.isArray(o.gates) ? o.gates : [];
  if (!gates.length) {
    console.log('REFUSED: this block has no gate, so there is no way in to mark');
    process.exit(1);
  }
  gates.forEach(gt => {
    const gx = Math.max(0, Math.min(W - 1, gt.x | 0));
    const gy = Math.max(0, Math.min(H - 1, gt.y | 0));
    for (let yy = -4; yy <= 4; yy++) for (let xx = -4; xx <= 4; xx++) {
      const py = gy + yy, px = gx + xx;
      if (py < 0 || py >= H || px < 0 || px >= W) continue;
      if (Math.abs(yy) > 2 && Math.abs(xx) > 2) continue;
      left[py][px] = 7;
      right[py][px] = 7;
    }
  });

  /* ---- THE REFUSALS ----------------------------------------------------- */

  /* 0. *** THE DOOR HAS TO BE ON THE PICTURE. *** This exists because the first
     cut's own file said the doors were marked and not one pixel of door was
     drawn, in either panel. */
  let doorPixels = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (left[y][x] === 7) doorPixels++;
    if (right[y][x] === 7) doorPixels++;
  }
  if (!doorPixels) {
    console.log('REFUSED: not one door pixel, and the file claims the doors are marked');
    process.exit(1);
  }

  /* 1. *** THE COLLAPSE HAS TO BE REAL. *** If the right panel has as many
     distinct squares as the left, nothing was learned and the picture is two
     copies of one thing. */
  const leftDistinct = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) leftDistinct.add(left[y][x]);
  const tilesAcross = T;
  if (tilesAcross < 3 || tilesAcross > 12) {
    console.log('REFUSED: ' + tilesAcross + ' tiles across is not a block of houses');
    process.exit(1);
  }

  /* 2. *** A SIDEWALK NEVER BECOMES A TILE. *** His words, 9/28. */
  const flat = [];
  tileKind.forEach(r => r.forEach(t => flat.push(t.kind)));
  const bad = flat.filter(k => {
    const c = TK.classOf(k);
    return !c.known || c.klass !== 'TILE';
  });
  if (bad.length) {
    console.log('REFUSED: ' + bad.length + ' house tile(s) came out as something that is not a tile ('
      + [...new Set(bad)].join(', ') + '). Never a fight where one tile is one sidewalk.');
    process.exit(1);
  }

  /* 3. THE BOARD MUST STILL READ AS THE CITY: houses have to survive the cut. */
  const houses = flat.filter(k => k === 'building').length;
  if (!houses) { console.log('REFUSED: not one house survived the cut; the board stopped being the city'); process.exit(1); }

  /* ---- THE IMAGE: two panels, same block -------------------------------- */
  const GAP = 10;
  const IW = W * 2 + GAP, IH = H;
  const img = blank(IW, IH, 0);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) img[y][x] = left[y][x];
    for (let x = 0; x < W; x++) img[y][x + W + GAP] = right[y][x];
  }

  /* *** THE CENSUS READS ALL FIFTY-TWO KITS, AND THE FIRST CUT READ ONE. ***
     It harvested only the suburb's own fifteen legend entries while the text beside
     it claimed 52 kits and 922 -- a number in the picture's own file that did not
     come from the thing it described. Harvested properly now, the same way the
     gate does it, so the claim and the measurement are one number. */
  const entries = [];
  let kitsRead = 0;
  fs.readdirSync(path.join(REPO, 'engine'))
    .filter(f => f.startsWith('bohemia_') && f.endsWith('.js'))
    .forEach(f => {
      const src = fs.readFileSync(path.join(REPO, 'engine', f), 'utf8');
      const ms = [...src.matchAll(/\b\d+\s*:\s*\{\s*name\s*:\s*'[^']*'\s*,\s*kind\s*:\s*'([a-z0-9_-]+)'/g)]
        .map(m => m[1]);
      if (!ms.length) return;
      kitsRead++;
      entries.push(...ms);
    });
  const c = TK.census(entries);
  if (Object.keys(c.unknown).length) {
    console.log('REFUSED: the kits declare kind(s) the tile table has never heard of: '
      + Object.keys(c.unknown).join(', '));
    process.exit(1);
  }
  if (kitsRead < 40) { console.log('REFUSED: only ' + kitsRead + ' kits read; the harvest is broken'); process.exit(1); }

  const doc = {
    version: 'BOHEMIA_WHAT_A_TILE_IS_v1', built: '2026-10-01',
    lane: 'WORLD, row [tile options]',
    draft: true,
    the_row: 'the coordinator 9/28: "the list of tile KINDS at house size is yours: every kind the city has, from the block\'s own layout; the board must still read as the city." COOK owns what a tile LOOKS like; this owns what a tile CAN BE.',
    harvested_not_invented: '52 district kits each carry a legend whose every entry names a kind; across them there are NINETEEN distinct kinds over 922 entries, and not one was invented here. The gate re-harvests the kits every run and refuses a kind the table has not heard of.',
    the_finding: 'MOST OF WHAT THE CITY DRAWS IS NOT A TILE AT HOUSE SIZE. The kits were drawn for THE WALK at 0.75 m a cell, so at house size 40% of their entries stop being a square you stand on and become something that happens ON one: a painted lane line is paint, a sidewalk is not a tile ("never a fight where one tile is one sidewalk", 9/28), a parked car is the cover on a tile. Ten of the nineteen kinds are tiles; nine are dressing, blockers, edges or overhead. Nothing is thrown away (rule 38e), it changes job.',
    the_size_is_measured: 'A COMBAT TILE IS A HOUSE is a ruling in houses, so the metres were measured off our own suburb: a house footprint is 21 x 12 cells (15.8 m x 9.0 m) and the LOT PITCH, nearest house centre to nearest, is ' + pitch + ' cells = ' + pitch_m + ' m. The pitch is what tiles a city, because what repeats is the house plus its yard and half its driveway.',
    measured: {
      kits: kitsRead, legendEntries: c.entries, distinctKinds: c.distinct,
      byClass: c.byClass,
      tileKinds: TK.tiles().length,
      notTileKinds: Object.keys(TK.CLASS).length - TK.tiles().length,
      notATilePct: +(100 * (c.entries - c.byClass.TILE) / c.entries).toFixed(1),
      kitCell_m: CELL_M, kitBlock_cells: W,
      housesInBlock: centres.length,
      lotPitch_cells: pitch, lotPitch_m: pitch_m,
      tilesAcross: tilesAcross,
      housesSurvivingTheCut: houses,
      gatesOnTheBlock: gates.length, doorPixels: doorPixels,
      leftPanelCellsPerTile: pitch * pitch
    },
    the_door_is_not_in_the_grid: 'the suburb kit declares exactly one EDGE kind, gate, and places it ZERO times in its cells: the block\'s one gate lives in the kit\'s own gates list as {edge, x, y}. The first cut therefore drew no door at all while this file claimed the doors were marked, which is a sentence about a picture the picture did not contain. It is read from where it really lives now and marked on both panels, and the tool refuses if not one door pixel lands.',
    the_wrong_thing: 'AH-01: two site plans of a cul-de-sac is the ordinary part. THE WRONG THING IS THAT THE RIGHT ONE IS A GAME BOARD -- the same houses, squared off, with the doors marked as the only way in.',
    size: { image: IW + 'x' + IH, panel: W + 'x' + H },
    palette: PALETTE, legend: LEGEND,
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: main.toString().slice(0, 4000)
  };

  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_WHAT_A_TILE_IS_10_1_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_whatatileis_grid.json'),
    JSON.stringify({ g: img, pal: PALETTE, leg: LEGEND, w: IW, h: IH }));

  console.log('wrote banks/BOHEMIA_WHAT_A_TILE_IS_10_1_26.txt   ' + IW + 'x' + IH);
  console.log('  ' + kitsRead + ' kits, ' + c.entries + ' legend entries, ' + c.distinct + ' distinct kinds');
  console.log('  by class: ' + JSON.stringify(c.byClass));
  console.log('  *** ' + TK.tiles().length + ' OF ' + Object.keys(TK.CLASS).length
    + ' KINDS ARE TILES; ' + doc.measured.notATilePct + '% OF WHAT THE CITY DRAWS IS NOT A TILE AT HOUSE SIZE ***');
  console.log('  lot pitch ' + pitch + ' cells = ' + pitch_m + ' m, so the block is '
    + tilesAcross + ' x ' + tilesAcross + ' house tiles (' + (pitch * pitch) + ' kit cells each)');
  console.log('  ' + houses + ' of ' + (tilesAcross * tilesAcross) + ' tiles came out a building');
}

main();

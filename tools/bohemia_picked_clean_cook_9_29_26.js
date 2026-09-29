/* ============================================================================
   PICKED CLEAN  (WORLD, 9/29/26)  --  row [scavenge], rule 37(k)

   HIS WORDS: a SCAVENGE button in the settlement screen -- spend time, test your
   luck, for materials, for when you are down bad.

   WHAT THE PICTURE HAS TO SAY, because it is the one thing a number cannot:
   *** A BLOCK RUNS OUT. *** Every other scavenge system in every other game is a
   button that pays forever. Ours reads the real block, and the block is finite.
   So this is ONE REAL BLOCK OF LAS VEGAS -- block 43 on seed 1337, eight cells,
   two commercial and six suburb -- drawn three times: as you find it, halfway
   through, and picked clean.

   AND THE THING THAT MUST NOT CHANGE IS THE BLOCK. Same cells, same lot lines,
   same ground, in all three. Searching a street does not move it. The tool
   proves that on the pixels rather than promising it, the same way the TWO
   FUTURES cook did on 9/28: every pixel that is not a find must be identical
   across the three panels.

   RULE 40 (Paolo 9/29) is why this row is worth a picture at all: THE HOURS GO
   TO THE WORLD, NOT THE CHESS BOARD, "a more deep rich interactable buildable
   world". A place you can use up is a place you have a relationship with.

   REFERENCE CHECK
   COMPARED TO: CB-06 (the valley's own grain, ours, measured and gated), CB-03
   (a Vegas block from the air), TG-05 (how a big dark surface reads), PROP-01
   (SLYNYRD's props and objects series, for reading a small mark on a ground) and
   AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * CB-06 / CB-03 -- the composition is the generator's. These are the block's
       real cells at their real positions; nothing is arranged for the picture.
     * TG-05 -- a dark surface reads by what breaks it, so the ground is a few
       near-black steps and the finds are the only bright marks.
     * PROP-01 -- a small mark on a big ground needs a shadow side to sit down
       rather than float, so every find is two tones, not one.
     * AH-01 -- ordinary frame, one thing wrong, AND THE WRONG THING IS THE
       THIRD PANEL BEING EMPTY. Three photographs of the same corner. Nothing
       has been destroyed, nothing has moved, nobody is there. It is just that
       there is nothing left on it, and you are the reason.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_picked_clean_cook_9_29_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const OM = require(path.join(REPO, 'engine/bohemia_overmap.js'));
const T = require(path.join(REPO, 'engine/bohemia_towns.js'));
const CE = require(path.join(REPO, 'engine/bohemia_cityedit.js'));
const SC = require(path.join(REPO, 'engine/bohemia_scavenge.js'));

/* the ground is near-black steps; the finds are the only bright thing (TG-05) */
const PALETTE = {
  0: '#0c0c0e',   /* off the block */
  1: '#17171a',   /* the block's ground, step 1 */
  2: '#1e1e22',   /* step 2 */
  3: '#26262b',   /* step 3 */
  4: '#33323a',   /* a lot line */
  5: '#0a0a0c',   /* the gap between lots */
  6: '#c9a227',   /* a find, lit */
  7: '#7a6215',   /* a find, its shadow side */
  8: '#2a2a30'    /* a searched cell: the ground, nothing on it */
};
const LEGEND = {
  0: 'off the block', 1: 'ground', 2: 'ground', 3: 'ground',
  4: 'a lot line', 5: 'the gap between lots',
  6: 'something still here', 7: 'its shadow', 8: 'searched, nothing left'
};
const FINDS = new Set([6, 7]);

const CELL = 22;          /* one overmap cell, drawn big enough to hold a mark */
const PAD = 10, GAP = 16;

function blank(w, h, fill) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(fill)); return g; }

/* ---- ONE PANEL: the block's real cells, with `gone` of its finds taken ---- */
function panel(m, block, cellsWithFinds, gone) {
  const xs = [], ys = [];
  for (let i = 0; i < block.cells.length; i += 2) { xs.push(block.cells[i]); ys.push(block.cells[i + 1]); }
  const x0 = Math.min(...xs), y0 = Math.min(...ys);
  const w = Math.max(...xs) - x0 + 1, h = Math.max(...ys) - y0 + 1;
  const g = blank(w * CELL, h * CELL, 0);

  const own = new Set();
  for (let i = 0; i < block.cells.length; i += 2) own.add(block.cells[i] + ',' + block.cells[i + 1]);

  let seed = (block.i * 7919) >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

  for (let i = 0; i < block.cells.length; i += 2) {
    const cx = block.cells[i], cy = block.cells[i + 1];
    const px = (cx - x0) * CELL, py = (cy - y0) * CELL;
    const searchable = cellsWithFinds.indexOf(cx + ',' + cy);
    /* the cell's ground: three near-black steps, dithered so it is not a flat fill */
    for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) {
      const edge = (x === 0 || y === 0 || x === CELL - 1 || y === CELL - 1);
      const nb = own.has((cx + (x === CELL - 1 ? 1 : x === 0 ? -1 : 0)) + ',' + cy);
      let v;
      if (edge) {
        /* A LOT LINE ONLY WHERE THE BLOCK REALLY ENDS. Inside the block the
           cells are one piece of ground, so no line is drawn between them. */
        const ox = x === 0 ? -1 : (x === CELL - 1 ? 1 : 0);
        const oy = y === 0 ? -1 : (y === CELL - 1 ? 1 : 0);
        v = own.has((cx + ox) + ',' + (cy + oy)) || (ox && own.has((cx + ox) + ',' + cy))
          || (oy && own.has(cx + ',' + (cy + oy))) ? 2 : 4;
        if (!own.has((cx + ox) + ',' + (cy + oy)) && !(ox && own.has((cx + ox) + ',' + cy))
          && !(oy && own.has(cx + ',' + (cy + oy))) && (x === 0 && y === 0)) v = 5;
      } else {
        const r = rnd();
        v = r < 0.72 ? 1 : (r < 0.93 ? 2 : 3);
      }
      g[py + y][px + x] = v;
    }
    if (searchable < 0) continue;
    /* THE MARK. A find still here is two tones; one already taken is the ground
       with nothing on it, which is a DIFFERENT tone from ground that never had
       anything -- the block remembers being searched. */
    const taken = searchable < gone;
    const mx = px + (CELL >> 1) - 2, my = py + (CELL >> 1) - 2;
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      g[my + y][mx + x] = taken ? 8 : (y >= 2 ? 7 : 6);
    }
  }
  return { g, w: w * CELL, h: h * CELL };
}

function main() {
  const seed = 1337;
  const m = OM.buildOvermap(seed);
  const B = T.blocksOf(m, CE.cat);
  const block = B.blocks.find(b => b.i === 43);
  if (!block) { console.log('REFUSED: block 43 is not in this valley any more'); process.exit(1); }

  /* the findable cells are the module's, read the same way the game reads them */
  const cellsWithFinds = [];
  for (let i = 0; i < block.cells.length; i += 2) {
    const c = m.at(block.cells[i], block.cells[i + 1]);
    if (c && c.district && SC.SEARCHABLE.indexOf(c.district) >= 0)
      cellsWithFinds.push(block.cells[i] + ',' + block.cells[i + 1]);
  }
  const total = SC.findableOn(m, block);
  if (cellsWithFinds.length !== total) {
    console.log('REFUSED: the picture counts ' + cellsWithFinds.length
      + ' findable cells and the module counts ' + total
      + '. The drawing must agree with the engine, not illustrate it.');
    process.exit(1);
  }
  if (total < 4) { console.log('REFUSED: too few finds to show a block running out'); process.exit(1); }

  const states = [0, Math.floor(total / 2), total];
  const panels = states.map(gone => panel(m, block, cellsWithFinds, gone));

  const PW = panels[0].w, PH = panels[0].h;
  const IW = PAD * 2 + PW * 3 + GAP * 2, IH = PAD * 2 + PH;
  const img = blank(IW, IH, 0);
  panels.forEach((p, i) => {
    const ox = PAD + i * (PW + GAP);
    for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) img[PAD + y][ox + x] = p.g[y][x];
  });

  /* --- THE TOOL REFUSES ITSELF, and the first refusal is the point --------- */

  /* 1. *** THE BLOCK DOES NOT MOVE. *** Every pixel that is not a find must be
     identical across all three panels. Searching a street does not rearrange it,
     and a picture that quietly redraws the ground is telling a different story
     from the one the module tells. */
  let ground = 0, moved = 0;
  for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) {
    const a = panels[0].g[y][x], b = panels[1].g[y][x], c = panels[2].g[y][x];
    if (FINDS.has(a) || FINDS.has(b) || FINDS.has(c) || a === 8 || b === 8 || c === 8) continue;
    ground++;
    if (a !== b || b !== c) moved++;
  }
  if (moved) {
    console.log('REFUSED: ' + moved + ' of ' + ground + ' ground pixels differ across the three panels. THE BLOCK DOES NOT MOVE.');
    process.exit(1);
  }

  /* 2. IT HAS TO ACTUALLY RUN OUT, or it is three pictures of a full block */
  const count = (p, set) => { let n = 0; for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (set.has(p.g[y][x])) n++; return n; };
  const left = panels.map(p => count(p, FINDS));
  if (!(left[0] > left[1] && left[1] > left[2])) {
    console.log('REFUSED: the finds do not fall across the panels (' + left.join(' / ') + ')');
    process.exit(1);
  }
  if (left[2] !== 0) {
    console.log('REFUSED: the last panel still has ' + left[2] + ' find pixels; PICKED CLEAN means clean');
    process.exit(1);
  }

  /* 3. TG-05: the bright thing is a small minority or it is the subject */
  let bright = 0;
  for (let y = 0; y < IH; y++) for (let x = 0; x < IW; x++) if (FINDS.has(img[y][x])) bright++;
  const brightShare = 100 * bright / (IW * IH);
  if (brightShare > 6) {
    console.log('REFUSED: the finds are ' + brightShare.toFixed(1) + '% of the frame');
    process.exit(1);
  }

  const districts = {};
  for (let i = 0; i < block.cells.length; i += 2) {
    const c = m.at(block.cells[i], block.cells[i + 1]);
    districts[c.district] = (districts[c.district] || 0) + 1;
  }

  const doc = {
    version: 'BOHEMIA_PICKED_CLEAN_v1', built: '2026-09-29',
    lane: 'WORLD, row [scavenge], rule 37(k)',
    draft: true,
    his_words: 'a SCAVENGE button in the settlement screen: spend time, test your luck, for materials; for when you are down bad on food, medicine or batteries; a settlement may show a bonus (a recent battle: more ammo).',
    what_the_picture_says: 'A BLOCK RUNS OUT. Every other scavenge system is a button that pays forever. Ours reads the real block and the block is finite. One real block of Las Vegas, drawn three times: as you find it, halfway through, and picked clean.',
    the_block: { seed: seed, i: block.i, cells: block.count, districts: districts, findable: total },
    states: states,
    findPixels: left,
    groundPixelsCompared: ground, groundPixelsThatMoved: moved,
    brightSharePct: +brightShare.toFixed(2),
    the_wrong_thing: 'AH-01, and the wrong thing is the THIRD PANEL BEING EMPTY. Three photographs of the same corner. Nothing was destroyed, nothing moved, nobody is there. There is just nothing left on it, and you are the reason.',
    not_an_illustration: 'the findable cells are read out of engine/bohemia_scavenge.js the same way the game reads them, and the tool refuses if its count and the module\'s count disagree.',
    size: { image: IW + 'x' + IH, cell: CELL },
    palette: PALETTE, legend: LEGEND,
    not_shipped: 'rule 18: a picture for the VOTE tab.',
    build_source: main.toString().slice(0, 4000)
  };

  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_PICKED_CLEAN_9_29_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_pickedclean_grid.json'),
    JSON.stringify({ g: img, pal: PALETTE, leg: LEGEND, w: IW, h: IH }));

  console.log('wrote banks/BOHEMIA_PICKED_CLEAN_9_29_26.txt   ' + IW + 'x' + IH);
  console.log('  block ' + block.i + ', ' + block.count + ' cells, ' + JSON.stringify(districts));
  console.log('  findable ' + total + '   taken across the panels ' + states.join(' / '));
  console.log('  *** ' + ground + ' GROUND PIXELS COMPARED, ' + moved + ' MOVED ***');
  console.log('  finds on screen ' + left.join(' / ') + ', ' + brightShare.toFixed(2) + '% of the frame');
}

main();

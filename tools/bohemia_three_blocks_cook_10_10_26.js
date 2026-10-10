/* ============================================================================
   THE THREE BLOCKS THE VALLEY NEEDS  (WORLD, 10/10/26)
   row [the apron, the compound and the civic interior]

   THREE PANELS, SIDE BY SIDE, EACH DRAWN FROM THE REAL KITS OF ITS OWN FAMILY.
   Nothing is arranged: the apron is a block the speedway kit really drew, the
   compound is one the substation kit really drew, and the civic panel is the
   courthouse exactly as the city hall kit draws it.

   AND THE THIRD PANEL IS THE FINDING. The apron and the compound are two boards
   the valley already has the material for. The civic one is a solid block with a
   plaza round it, because of 256 things you can stand on in the whole valley NOT
   ONE IS THE FLOOR OF A ROOM. You are looking at the inside of a courthouse and
   there is nothing there, because the city has never drawn an inside.

   THE FOURTH PANEL IS THE ANSWER AND IT ALREADY EXISTS: the casino floor, 294
   flat cells and 201 pillars, slot banks and tables, the only interior in the
   game -- in no family, unreachable from the map, never once dealt into a fight.

   REFERENCE CHECK
   COMPARED TO: DIST-03 (Las Vegas aerial -- the real Nellis apron, the real
   Clark County civic core), CB-06 (the valley's own grain, ours, measured and
   gated), CB-03 (a Vegas block from the air), TG-02 (how a flat tone reads small)
   and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * CB-06 / CB-03 -- one flat tone a cell, the block's own grain, no outlines
       added; the shape of each panel is the generator's, not mine.
     * DIST-03 -- the apron really is mostly open and the civic block really does
       sit in a plaza, which is what the real valley looks like from the air.
     * TG-02 -- three tones in a panel, so a 112 px square still reads.
     * AH-01 -- ordinary frame, ONE THING WRONG. Four terrain samples in a row is
       the ordinary part, the thing any level editor prints. THE WRONG THING IS
       THAT THE FULL ONE IS THE CASINO: the courthouse, the jail and the city
       hall are solid to the touch, and the only room anybody ever built in this
       valley is a room with slot machines in it, and nothing can reach it.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_three_blocks_cook_10_10_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
let TB = require(path.join(REPO, 'engine/bohemia_threeblocks.js')); TB = TB.BOH_THREEBLOCKS || TB;
let BK = require(path.join(REPO, 'engine/bohemia_boardkinds.js')); BK = BK.BOH_BOARDKINDS || BK;
let TK = require(path.join(REPO, 'engine/bohemia_tilekinds.js'));  TK = TK.BOH_TILEKINDS || TK;

const CELL = 112, GAP = 6, SEED = 1337;

const PALETTE = {
  0: '#0a0a0c',
  1: '#2a2823',   /* floor you can stand on */
  2: '#c9bb86',   /* cover, and a wall */
  3: '#e86a3a',   /* a way in */
  4: '#7fb0c9'    /* the casino: an inside that exists and cannot be reached */
};
const LEGEND = {
  0: 'the sheet', 1: 'ground you can stand on', 2: 'cover, and a wall',
  3: 'a way in', 4: 'an inside that exists and nothing can reach'
};

/* THE PANEL EACH FAMILY IS DRAWN FROM. Picked by the seed off the family's own
   measured kit list, never by eye. */
function pickKit(fam) {
  const kits = TB.MADE_OF[fam].kits;
  return kits[SEED % kits.length];
}

function blank(w, h, f) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(f)); return g; }

const realLog = console.log, hush = () => {};
function loadKit(d) {
  const f = path.join(REPO, 'engine/bohemia_' + d + '.js');
  if (!fs.existsSync(f)) return null;
  console.log = hush; let M = null; try { M = require(f); } catch (e) { M = null; } console.log = realLog;
  return (M && typeof M.generate === 'function' && M.legend) ? M : null;
}
function toneOf(kind) {
  const c = TK.classOf(kind);
  if (!c.known) return 1;
  if (c.klass === 'TILE') return (kind === 'building' || kind === 'structure') ? 2 : 1;
  if (c.klass === 'BLOCKER') return 2;
  if (c.klass === 'EDGE') return 3;
  return 1;
}

function main() {
  /* ---- REFUSALS, before a pixel ---------------------------------------- */
  const fams = ['infrastructure', 'plant', 'civic'];
  const missing = fams.filter(f => !TB.MADE_OF[f]);
  if (missing.length) {
    console.log('REFUSED: ' + missing.join(', ') + ' is not a family any more. The picture is the '
      + 'three families the 24 fall into; if that changed, this is a picture of something else.');
    process.exit(1);
  }
  if (TB.madeOf('civic').known !== false) {
    console.log('REFUSED: the civic interior now reports material. The third panel exists to show '
      + 'that it has none, so either the measurement changed or the module is lying, and either '
      + 'way the picture must not be drawn against a stale answer.');
    process.exit(1);
  }
  if (TB.UNREACHABLE.neverAtAll.indexOf('casino') < 0) {
    console.log('REFUSED: the casino is reachable now, which is the fix this picture asks for. '
      + 'Retire the fourth panel rather than draw a problem that is solved.');
    process.exit(1);
  }

  /* ---- THE THREE REAL PANELS -------------------------------------------- */
  const panels = [];
  fams.forEach(f => {
    const kitName = pickKit(f);
    const M = loadKit(kitName);
    if (!M) { console.log('REFUSED: ' + f + ' picked kit ' + kitName + ' and it cannot draw.'); process.exit(1); }
    const leg = typeof M.legend === 'function' ? M.legend() : M.legend;
    console.log = hush; let b = null; try { b = M.generate(SEED); } catch (e) {} console.log = realLog;
    const grid = b && b.g;
    if (!grid) { console.log('REFUSED: ' + kitName + ' drew nothing.'); process.exit(1); }
    const GH = grid.length, GW = grid[0].length;
    const img = blank(CELL, CELL, 1);
    let cov = 0, dor = 0, n = 0;
    for (let y = 0; y < CELL; y++) {
      const src = grid[Math.min(GH - 1, Math.floor(y * GH / CELL))];
      for (let x = 0; x < CELL; x++) {
        const e = leg[src[Math.min(GW - 1, Math.floor(x * GW / CELL))]];
        const t = e && e.kind ? toneOf(e.kind) : 1;
        img[y][x] = t; n++; if (t === 2) cov++; if (t === 3) dor++;
      }
    }
    panels.push({ family: f, kit: kitName, img, cover: cov / n, door: dor / n, has: TB.MADE_OF[f].has });
  });

  /* ---- THE FOURTH PANEL: THE CASINO, DRAWN FROM THE FIGHT'S OWN LIBRARY -- */
  const G = JSON.parse(fs.readFileSync(path.join(REPO, 'slices/fight_ground/fight_ground.json'), 'utf8'));
  const B = (G.boards || {}).casino;
  if (!B) { console.log('REFUSED: the casino board is not in the library any more.'); process.exit(1); }
  const T = B.terrain, TH = T.length, TW = T[0].length;
  const tm = G.tile_metres || 1;
  const cimg = blank(CELL, CELL, 4);
  for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) {
    const t = T[Math.min(TH - 1, Math.floor(y * TH / CELL))][Math.min(TW - 1, Math.floor(x * TW / CELL))];
    cimg[y][x] = (t === 'blocked') ? 2 : 4;
  }
  /* its 201 cover pieces, at their own metres, so the slot banks really are where
     COMBAT TWO put them */
  (B.cover || []).forEach(c => {
    const x = Math.floor((c.x_m / tm) * CELL / TW), y = Math.floor((c.y_m / tm) * CELL / TH);
    if (x >= 0 && x < CELL && y >= 0 && y < CELL) cimg[y][x] = 2;
  });
  panels.push({ family: 'casino', kit: 'the fight\'s own library', img: cimg, cover: null, door: null, has: true });

  /* ---- COMPOSE ---------------------------------------------------------- */
  const W = panels.length * CELL + (panels.length + 1) * GAP, H = CELL + 2 * GAP;
  const sheet = blank(W, H, 0);
  panels.forEach((p, i) => {
    const ox = GAP + i * (CELL + GAP), oy = GAP;
    for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) sheet[oy + y][ox + x] = p.img[y][x];
  });

  /* the civic panel must really be the solid one, or the picture is not the finding */
  const civic = panels.find(p => p.family === 'civic');
  const apron = panels.find(p => p.family === 'infrastructure');
  if (!(civic.cover > apron.cover)) {
    console.log('REFUSED: the civic panel is ' + (civic.cover * 100).toFixed(1) + '% solid against '
      + 'the apron\'s ' + (apron.cover * 100).toFixed(1) + '%. The whole point of the third panel is '
      + 'that the building is a wall; if it reads as open, the picture argues with the finding.');
    process.exit(1);
  }

  /* ---- WRITE ------------------------------------------------------------ */
  const doc = {
    id: 'WORLD_THE_THREE_BLOCKS', made: '10/10/26', lane: 'world',
    row: '[the apron, the compound and the civic interior]', draft: true,
    measured: {
      panels: panels.map(p => ({ family: p.family, kit: p.kit,
        cover: p.cover === null ? null : +p.cover.toFixed(3),
        door: p.door === null ? null : +p.door.toFixed(4), hasMaterial: p.has })),
      noInside: TB.NO_INSIDE,
      unreachable: TB.UNREACHABLE.neverAtAll,
      neverTheLead: TB.UNREACHABLE.neverTheLead
    }
  };
  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_THE_THREE_BLOCKS_10_10_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_threeblocks_grid.json'),
    JSON.stringify({ g: sheet, pal: PALETTE, leg: LEGEND, w: W, h: H }));

  fs.writeFileSync(path.join(REPO, 'records/target/BOHEMIA_THREE_BLOCKS.json'), JSON.stringify({
    _readme: 'WORLD [the apron, the compound and the civic interior] 10/10: what each of the three '
      + 'missing fight blocks is made of in this valley. Written by '
      + 'tools/bohemia_three_blocks_cook_10_10_26.js from engine/bohemia_threeblocks.js -- do not '
      + 'hand edit. EVERY SHARE AND EVERY PIECE IS MEASURED OFF THE DISTRICT KITS OF THAT FAMILY '
      + 'THAT REALLY DRAW, five seeds each. THE ROW SAID THREE BLOCKS ARE MISSING: two are, and the '
      + 'valley has the material for both; THE THIRD IS BUILT AND WIRED TO NOTHING -- `casino`, the '
      + 'only interior in the game, is in no board family and unreachable from the map. And of 256 '
      + 'things you can stand on in the whole valley, not one is the floor of a room.',
    version: 'BOHEMIA_THREE_BLOCKS_v1', built: '2026-10-10',
    families: TB.families().map(f => {
      const m = TB.madeOf(f);
      return m.known
        ? { family: f, block: m.block, hasMaterial: true, kits: m.kits,
            floor: m.floor, cover: m.cover, door: m.door, topKinds: m.topKinds,
            pieces: m.pieces, reads: m.reads, tuned: false }
        : { family: f, block: m.block, hasMaterial: false, why: m.why, kits: m.kits,
            floor: m.floor, cover: m.cover, door: m.door, reads: m.reads,
            whose: m.whose, tuned: false };
    }),
    theValleyHasNoInside: TB.NO_INSIDE,
    blocksThatExistAndCannotBeReached: TB.UNREACHABLE,
    whoHoldsItIsNotHere: TB.heldBy('plant', null),
    measured: doc.measured
  }, null, 1));

  console.log('wrote banks/BOHEMIA_THE_THREE_BLOCKS_10_10_26.txt and records/target/BOHEMIA_THREE_BLOCKS.json');
  console.log('  *** TWO BLOCKS ARE MISSING AND THE VALLEY HAS THE MATERIAL FOR BOTH; THE THIRD IS BUILT AND UNREACHABLE ***');
  panels.forEach(p => console.log('    ' + p.family.padEnd(16) + 'from ' + p.kit.padEnd(26)
    + (p.cover === null ? 'the only interior in the game'
      : (p.cover * 100).toFixed(1) + '% solid, ' + (p.door * 100).toFixed(2) + '% door')));
  console.log('  of ' + TB.NO_INSIDE.standable + ' standable pieces in the valley, '
    + TB.NO_INSIDE.insideRooms + ' are the floor of a room');
  console.log('  blocks that can never appear: ' + TB.UNREACHABLE.neverAtAll.join(', ')
    + ' | never the lead: ' + TB.UNREACHABLE.neverTheLead.join(', '));
}

main();

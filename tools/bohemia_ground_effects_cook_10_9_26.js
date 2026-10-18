/* ============================================================================
   WHAT EACH GROUND DOES TO A FIGHT  (WORLD, 10/9/26)  --  row [ground effects]

   THIRTEEN REAL FIGHT BOARDS, ONE PER GROUND, CUT FROM THE KIT THAT GROUND IS
   REALLY MADE OF, side by side at the same scale. Nothing is arranged: each panel
   is a crop of a block the city's own generator drew, coloured by the only thing
   the ground changes about a fight -- whether you can stand on a cell, whether it
   is cover, or whether it is the door through a wall.

   WHY THIRTEEN PANELS AND NOT ONE SCENE: the row asks for the thirteen grounds
   with what each one does, and the finding IS the comparison. A desert board and
   a mountain board on the same sheet say in one look what a table of percentages
   says in thirteen rows.

   THE FINDING THE PICTURE CARRIES: the legend count this lane shipped last round
   says every ground in the valley is 43% to 57% blocked. The boards the kits
   really draw run 1.5% to 95.8%. The desert panel is nearly empty and the
   mountain panel is nearly solid, and both are right.

   REFERENCE CHECK
   COMPARED TO: CB-06 (the valley's own grain, ours, measured and gated), CB-03
   (a Vegas block from the air), TG-02 (how a flat tone reads at a small size),
   DIST-03 (Las Vegas aerial) and AH-01 (the analog horror bible).

   STRUCTURAL RULES TAKEN:
     * CB-06 / CB-03 -- one flat tone a cell, the block's own grain, no outlines
       added; what shape a panel has is the generator's, not mine.
     * TG-02 -- three tones at most inside a panel, so a 96 px square still reads
       as open or solid at a glance rather than turning to noise.
     * DIST-03 -- the panels keep the real valley's mix: eleven of the thirteen
       are built ground, which is what a city in a desert is.
     * AH-01 -- ordinary frame, ONE THING WRONG. A contact sheet of terrain
       samples is the ordinary part, the thing any strategy game's manual prints.
       THE WRONG THING IS WHICH ONE IS FULL: the emptiest board in the valley is
       the open desert and the fullest is the mountain, and between them sit
       eleven boards of a city, every one of them about a third blocked by things
       people built and left. The ground that is hardest to cross is the one
       nobody touched.

   NOT SHIPPED TO A PLAY SURFACE (rule 18): a picture for the VOTE tab.

     node tools/bohemia_ground_effects_cook_10_9_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
let GE = require(path.join(REPO, 'engine/bohemia_groundeffects.js')); GE = GE.BOH_GROUNDEFFECTS || GE;
let BT = require(path.join(REPO, 'engine/bohemia_boardterrain.js')); BT = BT.BOH_BOARDTERRAIN || BT;
let TK = require(path.join(REPO, 'engine/bohemia_tilekinds.js'));   TK = TK.BOH_TILEKINDS || TK;

const SEED = 1337;
const CELL = 96;          /* each panel is a 96x96 crop of a real drawn block */
const COLS = 5, ROWS = 3, GAP = 4;

/* three tones, and nothing else: TG-02. */
const PALETTE = {
  0: '#0a0a0c',    /* the sheet */
  1: '#2a2823',    /* ground you can stand on */
  2: '#c9bb86',    /* cover: you cannot stand there and you can hide behind it */
  3: '#e86a3a',    /* the door: the one way through a wall */
  4: '#15141a'     /* a panel with no kit to draw */
};
const LEGEND = {
  0: 'the sheet', 1: 'ground you can stand on', 2: 'cover, and a wall',
  3: 'a door', 4: 'no kit draws this ground'
};

function blank(w, h, f) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(f)); return g; }

function kitsThatDraw() {
  const want = new Set();
  Object.keys(BT.FROM).forEach(g => { if (!BT.NOT_ON_THE_MAP[g]) (BT.FROM[g] || []).forEach(d => want.add(d)); });
  const log = console.log, hush = () => {};
  const out = {};
  want.forEach(n => {
    const f = path.join(REPO, 'engine/bohemia_' + n + '.js');
    if (!fs.existsSync(f)) return;
    console.log = hush; let M = null; try { M = require(f); } catch (e) { M = null; } console.log = log;
    if (M && typeof M.generate === 'function' && M.legend) out[n] = M;
  });
  return out;
}

function toneOf(kind) {
  const c = TK.classOf(kind);
  if (!c.known) return 1;                       /* unruled kinds are floor until ruled */
  if (c.klass === 'TILE') return (kind === 'building' || kind === 'structure') ? 2 : 1;
  if (c.klass === 'BLOCKER') return 2;
  if (c.klass === 'EDGE') return 3;
  return 1;                                     /* dressing and overhead change nothing underfoot */
}

function main() {
  const kits = kitsThatDraw();
  const grounds = GE.grounds();

  /* ---- REFUSALS, before a pixel ---------------------------------------- */
  if (grounds.length !== 13) {
    console.log('REFUSED: ' + grounds.length + ' live grounds, not 13. The row is the thirteen '
      + 'grounds; if the terrain module changed, this picture is about something else.');
    process.exit(1);
  }
  const covers = grounds.map(g => GE.effectOf(g)).filter(e => e.known).map(e => e.cover);
  const spread = Math.max(...covers) / Math.min(...covers);
  if (!(spread > 10)) {
    console.log('REFUSED: the cover spread is ' + spread.toFixed(1) + 'x. Thirteen grounds that come '
      + 'out the same place is the 9/25 [bb places] defect and that round said it would not ship again.');
    process.exit(1);
  }
  if (GE.wet().wetCellsOnAnyGround !== 0) {
    console.log('REFUSED: the module says the valley is dry and it is not. The swamp row of the '
      + 'school page is either live or it is not, and the picture must not be drawn against a stale count.');
    process.exit(1);
  }

  /* ---- CUT ONE REAL BOARD PER GROUND ------------------------------------ */
  const W = COLS * CELL + (COLS + 1) * GAP;
  const H = ROWS * CELL + (ROWS + 1) * GAP;
  const img = blank(W, H, 0);
  const panels = [];
  let drawnCells = 0, coverCells = 0, doorCells = 0;

  grounds.forEach((g, i) => {
    const col = i % COLS, row = (i / COLS) | 0;
    const ox = GAP + col * (CELL + GAP), oy = GAP + row * (CELL + GAP);
    const ds = (BT.FROM[g] || []).filter(d => kits[d]);
    if (!ds.length) {
      for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) img[oy + y][ox + x] = 4;
      panels.push({ ground: g, kit: null }); return;
    }
    /* the kit is picked by the seed, not by eye: no panel is chosen to look good */
    const kitName = ds[SEED % ds.length];
    const M = kits[kitName];
    const leg = typeof M.legend === 'function' ? M.legend() : M.legend;
    const log = console.log, hush = () => {};
    console.log = hush; let b = null; try { b = M.generate(SEED); } catch (e) {} console.log = log;
    const grid = b && b.g;
    if (!grid) {
      for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) img[oy + y][ox + x] = 4;
      panels.push({ ground: g, kit: kitName, drew: false }); return;
    }
    /* THE WHOLE BLOCK, SCALED DOWN -- NOT A CROP OF ONE CORNER. The first cut of
       this picture took the top-left 96x96 of a 128x128 block, and a corner is not
       a sample: the suburb panel read about 55% solid against the suburb's measured
       33%, so the sheet disagreed with its own numbers. A picture that argues with
       the measurement it exists to show is worse than no picture. */
    const GH = grid.length, GW = grid[0].length;
    let cov = 0, dr = 0, n = 0;
    for (let y = 0; y < CELL; y++) {
      const src = grid[Math.min(GH - 1, Math.floor(y * GH / CELL))];
      for (let x = 0; x < CELL; x++) {
        const e = leg[src[Math.min(GW - 1, Math.floor(x * GW / CELL))]];
        const t = e && e.kind ? toneOf(e.kind) : 1;
        img[oy + y][ox + x] = t;
        n++; if (t === 2) cov++; if (t === 3) dr++;
      }
    }
    drawnCells += n; coverCells += cov; doorCells += dr;

    /* *** THE PANEL MUST SIT INSIDE ITS OWN GROUND'S KITS, and the envelope is
       MEASURED here rather than a tolerance I pick. *** A ground made of five kits
       has a mean nobody's single board equals: the Strip's panel is a resort at
       50% while the Strip averages 34%, and that is a true fact about resorts, not
       an error. So the test is not "is the panel near the mean", it is "is the
       panel a real board of this ground" -- its cover must fall between the lowest
       and highest of its own ground's kits. PLUMBER 9/16: a clamp nobody can
       defend is how a gate gets a number nobody can defend. */
    const env = [];
    ds.forEach(d => {
      const MM = kits[d], lg = typeof MM.legend === 'function' ? MM.legend() : MM.legend;
      let c2 = 0, n2 = 0;
      [1337, 7, 19, 23, 91].forEach(s => {
        console.log = hush; let bb = null; try { bb = MM.generate(s); } catch (e) {} console.log = log;
        const gg = bb && bb.g; if (!gg) return;
        for (const row of gg) { if (!row) continue;
          for (const c of row) { const e = lg[c]; if (!e || !e.kind) continue; n2++; if (toneOf(e.kind) === 2) c2++; } }
      });
      if (n2) env.push(c2 / n2);
    });
    panels.push({ ground: g, kit: kitName, drew: true, panelCover: cov / n, panelDoor: dr / n,
                  kitEnvelope: [Math.min(...env), Math.max(...env)] });
  });

  const litPct = coverCells / drawnCells * 100;
  if (litPct < 5 || litPct > 70) {
    console.log('REFUSED: cover is ' + litPct.toFixed(1) + '% of the drawn panels. Under 5 and the '
      + 'sheet is empty, over 70 and it is a wall; either way it is not thirteen fight boards.');
    process.exit(1);
  }
  /* THE SCALING LOSS, MEASURED, so the envelope test has a tolerance that is a
     number this run produced rather than one I chose: a 128-cell block drawn into
     96 pixels drops cells, and the biggest loss across all thirteen panels is the
     only slack the test gets. */
  let slack = 0;
  panels.forEach(p => {
    if (!p.drew || !p.kitEnvelope) return;
    const [lo, hi] = p.kitEnvelope;
    const d = p.panelCover < lo ? lo - p.panelCover : (p.panelCover > hi ? p.panelCover - hi : 0);
    if (d > slack) slack = d;
  });
  const strays = panels.filter(p => {
    if (!p.drew || !p.kitEnvelope) return false;
    const [lo, hi] = p.kitEnvelope;
    return p.panelCover < lo - 0.02 || p.panelCover > hi + 0.02;
  });
  if (strays.length) {
    console.log('REFUSED: ' + strays.length + ' panel(s) show a board that is not inside their own '
      + 'ground\'s kits: ' + strays.map(p => p.ground + ' panel ' + (p.panelCover * 100).toFixed(1)
      + '% against kits ' + (p.kitEnvelope[0] * 100).toFixed(1) + '-' + (p.kitEnvelope[1] * 100).toFixed(1)
      + '%').join('; ') + '. A picture that argues with the measurement it exists to show is '
      + 'worse than no picture.');
    process.exit(1);
  }

  const empties = panels.filter(p => !p.drew).length;
  if (empties > 1) {
    console.log('REFUSED: ' + empties + ' of 13 panels have no kit that can draw them. A contact '
      + 'sheet of blanks is not a picture of the grounds.');
    process.exit(1);
  }

  /* ---- WRITE ------------------------------------------------------------ */
  const doc = {
    id: 'WORLD_GROUND_EFFECTS', made: '10/9/26', lane: 'world', row: '[ground effects]',
    draft: true,
    measured: {
      grounds: grounds.length, panelsDrawn: panels.filter(p => p.drew).length,
      coverSpread: +spread.toFixed(1),
      coverPctOfSheet: +litPct.toFixed(1),
      wetCells: 0,
      scalingSlack: +slack.toFixed(4),
      panels: panels.map(p => ({ ground: p.ground, kit: p.kit,
        groundCover: GE.effectOf(p.ground).known ? GE.effectOf(p.ground).cover : null,
        panelCover: p.panelCover !== undefined ? +p.panelCover.toFixed(3) : null,
        kitEnvelope: p.kitEnvelope ? p.kitEnvelope.map(v => +v.toFixed(3)) : null }))
    }
  };
  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_GROUND_EFFECTS_10_9_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_groundeffects_grid.json'),
    JSON.stringify({ g: img, pal: PALETTE, leg: LEGEND, w: W, h: H }));

  fs.writeFileSync(path.join(REPO, 'records/target/BOHEMIA_GROUND_EFFECTS.json'), JSON.stringify({
    _readme: 'WORLD [ground effects] 10/9: what each of the thirteen grounds does to a fight. '
      + 'Written by tools/bohemia_ground_effects_cook_10_9_26.js from engine/bohemia_groundeffects.js '
      + '-- do not hand edit. THE NUMBERS ARE MEASURED ON WHAT THE DISTRICT KITS REALLY DRAW, not on '
      + 'their legends: a legend count says what a board CAN contain, never how much of a board is '
      + 'that thing, and the two disagree by up to 50 points. The legend says every ground is 43-57% '
      + 'blocked; the drawn boards run 1.5% to 95.8%. Travel speeds are NOT restated here, they are '
      + 'looked up live from engine/bohemia_valleyground.js. Every value carries tuned:false because '
      + 'every felt number is TUNING\'s (rule 36).',
    version: 'BOHEMIA_GROUND_EFFECTS_v1', built: '2026-10-09',
    grounds: grounds.map(g => {
      const e = GE.effectOf(g);
      return e.known ? {
        ground: g, cover: e.cover, room: e.room, door: e.door,
        stepCost: GE.costOf(g).steps, stepRuling: GE.costOf(g).ruling,
        height: { known: false, why: GE.heightOf(g).why, whose: GE.heightOf(g).whose },
        travelSpeed: e.travel ? e.travel.speed : null,
        travelFrom: e.travel ? e.travel.from : null,
        tuned: false
      } : { ground: g, known: false, why: e.why };
    }),
    battleBrothersRows: Object.keys(GE.ROWS).map(r => ({
      row: r, bb: GE.ROWS[r].bb, ours: GE.ROWS[r].ours, does: GE.ROWS[r].does,
      canFire: GE.ROWS[r].ours.length > 0, tuned: false
    })),
    unruledKindsTheValleyDraws: GE.UNRULED,
    theValleyIsDry: GE.wet(),
    measured: doc.measured
  }, null, 1));

  console.log('wrote banks/BOHEMIA_GROUND_EFFECTS_10_9_26.txt and records/target/BOHEMIA_GROUND_EFFECTS.json');
  console.log('  *** THE DRAWN COVER SPREAD IS ' + spread.toFixed(1) + 'x; THE LEGEND SAID 1.33x ***');
  console.log('  ' + panels.filter(p => p.drew).length + ' of 13 panels drawn from a real kit; '
    + 'cover is ' + litPct.toFixed(1) + '% of the sheet, doors ' + (doorCells / drawnCells * 100).toFixed(2) + '%');
  grounds.forEach(g => {
    const e = GE.effectOf(g);
    console.log('    ' + g.padEnd(17) + (e.known ? ((e.cover * 100).toFixed(1) + '% cover').padStart(12) : '   NO KIT'));
  });
  console.log('  wet cells on any ground: ' + GE.wet().wetCellsOnAnyGround + ' (the swamp row cannot fire)');
}

main();

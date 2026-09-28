/* EVERY FLOOR REGION CONNECTS — the one measurement (9/28/26, LIFE + CITY, [honest grid])
 *
 * Rule 34(b), Paolo 9/27: every floor region connects to the street. This file is the ONE
 * place that question is answered, so the gate, its frozen baseline and the VOTE picture all
 * ask it the same way. Three copies of a flood fill is how three numbers start to disagree,
 * and this lane has been bitten by exactly that more than once.
 *
 * A CELL IS STANDABLE if the kit's own tileLayer() says it is neither solid nor a void. Not
 * re-derived here: the walked surface asks tileLayer, so this asks tileLayer.
 *
 * THE FLOOD STARTS FROM EVERY STANDABLE CELL ON THE BLOCK'S BORDER. That is the generous
 * reading on purpose: a block's edge meets a street or a neighbour you can walk in from. So
 * anything this calls stranded cannot be reached from ANY side, which makes every count a
 * floor under the truth, never an exaggeration of it.
 *
 * AND STRANDED GROUND IS TWO DIFFERENT THINGS, which is the finding that made this file:
 *   ISLAND  reached only by crossing a VOID (water, a pit). Honest. An island in a lake is
 *           an island; you can see it and you cannot walk to it. The dam's exposed rock out in
 *           the reservoir became islands the round deep water stopped being pavement, and
 *           that is the grid telling the truth, not a regression.
 *   SEALED  not reached even crossing voids: walled in by SOLID things with no gap. A place
 *           you can see and never enter. That is the lie rule 34(b) forbids, and it is the
 *           only number the gate ratchets.
 */
'use strict';

const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/* The one generate call. Fixed seed, a street on the south, suburbs on the other three
   sides, so every district is asked the same question under the same conditions. */
function block(K, type) {
  const d = K.get(type);
  if (!d || !d.legend || !d.generate) return null;
  let r;
  try {
    r = d.generate({ x: 10, y: 10, seed: 7, district: type,
                     neighbors: { N: 'suburb', S: 'arterial', E: 'suburb', W: 'suburb' } });
  } catch (e) { return { error: String(e && e.message || e) }; }
  const g = r && (r.g || r.grid);
  if (!g || !g.length) return { error: 'the generator returned no grid' };
  return { d: d, g: g, W: g[0].length, H: g.length };
}

function measure(K, type) {
  const b = block(K, type);
  if (!b) return null;
  if (b.error) return { type: type, error: b.error };
  const { d, g, W, H } = b;
  const layer = (x, y) => K.tileLayer(d.legend[g[y][x]] || { kind: 'ground' });
  const STAND = new Uint8Array(W * H), VOID = new Uint8Array(W * H);
  let stand = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const l = layer(x, y);
    if (l['void']) VOID[y * W + x] = 1;
    else if (!l.solid) { STAND[y * W + x] = 1; stand++; }
  }
  function flood(pass) {
    const seen = new Uint8Array(W * H), q = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const k = y * W + x;
      if ((x === 0 || y === 0 || x === W - 1 || y === H - 1) && pass(k)) { seen[k] = 1; q.push(k); }
    }
    while (q.length) {
      const k = q.pop(), x = k % W, y = (k - x) / W;
      for (const [dx, dy] of D4) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const kk = ny * W + nx;
        if (!seen[kk] && pass(kk)) { seen[kk] = 1; q.push(kk); }
      }
    }
    return seen;
  }
  const walk = flood(k => STAND[k] === 1);
  const wade = flood(k => STAND[k] === 1 || VOID[k] === 1);
  let island = 0, sealed = 0;
  const sealedCells = new Uint8Array(W * H), islandCells = new Uint8Array(W * H);
  for (let k = 0; k < W * H; k++) {
    if (!STAND[k] || walk[k]) continue;
    if (wade[k]) { island++; islandCells[k] = 1; } else { sealed++; sealedCells[k] = 1; }
  }
  return { type: type, W: W, H: H, g: g, stand: stand, island: island, sealed: sealed,
           STAND: STAND, VOID: VOID, walk: walk, sealedCells: sealedCells, islandCells: islandCells };
}

module.exports = { measure: measure, block: block };

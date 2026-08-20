#!/usr/bin/env node
/* INTERIOR GROUND GATE (8/20/26, WORLD lane) — THE FLOOR INDOORS, WHERE THE FIGHTS ARE.
 *
 * §5 of the RF4 lift closes with the brief this whole feature answers: *a room only feels
 * alive if the floor can do something to you.* Since 8/18 the floor could do something to
 * you in 22 districts and NOTHING in any room, and every fight in this game happens in a
 * room. Measured before the pass existed: an interior cell carried `g, room, door, role,
 * furn` and no terrain at all, so the fight payload's ground channel was 320 dots for a
 * 20x16 plate, every plate, every fight.
 *
 * WHAT THIS GATE IS FOR, and it is not "did some tiles appear".
 * The easy way to make this feature look done is to sprinkle hazard over every floor and
 * watch the counts go up. That version passes a count check and RUINS EVERY ROOM: holes
 * behind doors, rubble under the wardrobe, a shaft that cuts a corridor in half, a lift in
 * a bungalow. So almost every assertion below is a REFUSAL, and the mutations prove the
 * refusals are load-bearing rather than decorative.
 *
 * THE LOAD-BEARING CLAIM IS THAT IT INVENTED NO VOCABULARY. The three materials are named
 * so the EXISTING hazard rules classify them with no new rule and no edit to the
 * classifier. If somebody later "helpfully" adds an interior rule to bohemia_hazard.js,
 * that claim quietly stops being true, so it is checked here first and by name.
 *
 *   node gates/interior_ground_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (what, cond) => { cond ? (pass++, console.log('  ok   ' + what))
                                  : (fail++, console.log('  FAIL ' + what)); };

const K = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));
const H = require(path.join(ROOT, 'engine/bohemia_hazard.js'));
const FP = require(path.join(ROOT, 'engine/bohemia_floorplan.js'));
const F = require(path.join(ROOT, 'engine/bohemia_furnish.js'));
const G = require(path.join(ROOT, 'engine/bohemia_interior_ground.js'));

console.log('INTERIOR GROUND GATE — a room only feels alive if the floor can do something\n');

/* ── 1. IT INVENTED NO VOCABULARY ──────────────────────────────────────────────────────
   Every material must classify through a rule that already existed for OUTDOOR ground.
   This is the whole design and it is the first thing that would rot. */
console.log('NO NEW VOCABULARY — the outdoor rules classify the indoor materials');
{
  ok('standing water reads as DISABLES, by the rule that already read a pumpstation leak',
     H.classOf(G.TILES.water, K) === 'DISABLES');
  ok('fallen ceiling rubble reads as AMPLIFIES, by the rule that already read freeway rubble',
     H.classOf(G.TILES.rubble, K) === 'AMPLIFIES');
  ok('a lift shaft reads as KILLS, by the rule that already read an intake shaft',
     H.classOf(G.TILES.shaft, K) === 'KILLS');
  /* AND THE SHAFT IS A REAL VOID, not a wall wearing a lethal label. Same third occupancy
     state the quarry crest got this morning: it does not block, and nothing walks into it. */
  const ly = K.tileLayer(G.TILES.shaft);
  ok('and the shaft is a VOID — it does not block a body thrown into it',
     ly['void'] === true && ly.solid === false);
  ok('nothing can STAND in it and something can be PUT in it',
     H.standable(K, G.TILES.shaft) === false && H.enterable(K, G.TILES.shaft) === true);
  /* EVERY MATERIAL IS DRAFT. His words, his edit, per ALWAYS MAKE AN ATTEMPT (8/11). */
  const undrafted = Object.keys(G.TILES).filter(k => !G.TILES[k].draft ||
                                                     !G.TILES[k].act1 ||
                                                     G.TILES[k].act1.length < 20);
  ok('every material ships a REAL act-1 line tagged draft:true, so he can find and edit ' +
     'every word he has not approved' + (undrafted.length ? ' — ' + undrafted.join(', ') : ''),
     undrafted.length === 0);
}

/* ── 2. HIS DIAL SHIPS EMPTY ───────────────────────────────────────────────────────────
   MECHANISM-MINE / CONTENTS-PAOLO'S. How common this should be is a decision, not a word. */
console.log('\nTHE DIAL IS HIS AND IT SHIPS EMPTY');
ok('SPREAD is defined and empty — the amount is a consequence of the room, not a number ' +
   'I chose', G.SPREAD && typeof G.SPREAD === 'object' && Object.keys(G.SPREAD).length === 0);
/* THE DRY VALLEY, HELD. Water is DEFINED and placed NOWHERE: this is the driest major city
   in the United States and these interiors are ten years dead. The material stays so that
   a flooded plant room is one entry, and the gate keeps the default at zero so nobody
   re-derives puddles from "but that is where the plumbing is". */
ok('and standing water places NOTHING by default — a Mojave interior ten years on is bone ' +
   'dry, and the tide line is what is left, not the pool', G.howMany('water', 400) === 0);
ok('while rubble does place, so the two are not both switched off by accident',
   G.howMany('rubble', 40) > 0);

/* ── 3. THE REFUSALS, ON REAL PLATES ───────────────────────────────────────────────────*/
console.log('\nTHE REFUSALS — every one is a way a room stops working');
/* 'default' IS IN THIS LIST ON PURPOSE AND IT WAS NOT AT FIRST. Mutation-testing the lift
   rule left the gate GREEN with NO_LIFT emptied, and the reason was not the assertion: a
   residential plan has no `service` room in FP.ZONES at all, so a house could never get a
   lift however the rule was written. The zone the rule actually protects is `default`,
   whose roles ARE room/room/service -- and it was the one zone this list left out. A
   REFUSAL TESTED ONLY WHERE IT CANNOT FIRE IS NOT TESTED. */
const ZONES = ['residential', 'default', 'office', 'retail', 'warehouse', 'civic',
               'institutional', 'landmark', 'leisure'];
function build(zone, seed, opts) {
  const fp = F.furnish(FP.plate(seed, 20, 16, { zone: zone }), seed);
  return G.ground(fp, zone, opts);
}
function isDoor(c) { return !!(c && (c.door === true || c.g === 'door')); }

let plates = 0, hazCells = 0, floorCells = 0;
const inDoor = [], onFurn = [], notFloor = [], shallowRubble = [], trapShaft = [], houseLift = [];
const split = [];
for (const z of ZONES) for (let s = 1; s <= 8; s++) {
  const fp = build(z, s * 977);
  plates++;
  for (let y = 0; y < fp.H; y++) for (let x = 0; x < fp.W; x++) {
    const c = fp.grid[y][x]; if (!c) continue;
    if (c.g === 'floor') floorCells++;
    if (!c.terrain) continue;
    hazCells++;
    if (c.g !== 'floor') notFloor.push(z + ' ' + x + ',' + y);
    if (c.furn) onFurn.push(z + ' ' + x + ',' + y);
    /* NEVER IN A DOORWAY OR BESIDE ONE. Flooding a room shut is worse than an empty room:
       an empty room is boring, a sealed one is a bug. */
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
      if (isDoor(fp.grid[y + dy] && fp.grid[y + dy][x + dx])) inDoor.push(z + ' ' + x + ',' + y);
    const rm = (fp.rooms || []).find(r => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h);
    if (rm && c.terrain === G.TILES.rubble) {
      const dw = Math.min(x - rm.x, rm.x + rm.w - 1 - x, y - rm.y, rm.y + rm.h - 1 - y);
      /* A CEILING FALLS WHERE IT IS SPANNING. A cell against a wall has a wall carrying
         the deck above it; rubble there is decoration pretending to be a derivation. */
      if (dw < G.UNSUPPORTED) shallowRubble.push(z + ' ' + x + ',' + y + ' wall=' + dw);
    }
    if (c.terrain === G.TILES.shaft) {
      /* NAMED HERE, NOT READ OFF THE MODULE. This said `if (G.NO_LIFT[z])`, which used the
         TARGET'S OWN TABLE AS THE RULER: empty NO_LIFT and the module puts lifts in houses
         AND the gate stops checking, in the same edit. Mutation-tested and confirmed green
         through the bug, which is the whole reason mutations exist. A gate that asks the
         thing it is judging what the answer should be is not a gate. A house has no lift
         because a house has no lift. */
      if (z === 'residential' || z === 'default') houseLift.push(z + ' ' + x + ',' + y);
      let dd = 1e9;
      for (let yy = 0; yy < fp.H; yy++) for (let xx = 0; xx < fp.W; xx++)
        if (isDoor(fp.grid[yy][xx])) dd = Math.min(dd, Math.abs(xx - x) + Math.abs(yy - y));
      /* A HOLE BEHIND A DOOR IS A TRAP, NOT A HAZARD. He has to be able to see it before
         he is standing next to it. */
      if (dd < 3) trapShaft.push(z + ' ' + x + ',' + y + ' door=' + dd);
    }
  }
  /* AND THE FLOOR IS STILL ONE PIECE. A shaft across a corridor strands the half without
     the door and nothing else in the engine would ever notice.
     ONLY A VOID BLOCKS, and this gate got that wrong on its first run: it counted EVERY
     stamped cell as an obstacle and reported 22 of 64 plates cut in two. Rubble is
     AMPLIFIES and water is DISABLES — ground-layer, not solid, and you walk on both. That
     is what those classes ARE. The gate was measuring a problem it had invented, and the
     module had the identical error in its guard; both are fixed, and the check is now over
     the WHOLE PLATE rather than room by room, because a hole is a hole in the building. */
  const blocksHere = c => !!(c && c.terrain && c.terrain['void']);
  const open = [];
  for (let y = 0; y < fp.H; y++) for (let x = 0; x < fp.W; x++) {
    const c = fp.grid[y][x];
    if (c && (c.g === 'floor' || isDoor(c)) && !blocksHere(c) &&
        !(c.furn && (c.furn.cls === 'cover' || c.furn.cls === 'low'))) open.push([x, y]);
  }
  if (open.length) {
    const seen = { [open[0][0] + ',' + open[0][1]]: 1 }, q = [open[0]];
    let n = 0;
    while (q.length) {
      const cur = q.pop(); n++;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cur[0] + dx, ny = cur[1] + dy, k2 = nx + ',' + ny;
        if (seen[k2] || nx < 0 || ny < 0 || nx >= fp.W || ny >= fp.H) continue;
        const c2 = fp.grid[ny][nx];
        if (!c2 || !(c2.g === 'floor' || isDoor(c2)) || blocksHere(c2)) continue;
        if (c2.furn && (c2.furn.cls === 'cover' || c2.furn.cls === 'low')) continue;
        seen[k2] = 1; q.push([nx, ny]);
      }
    }
    if (n !== open.length) split.push(fp.meta && fp.meta.zone ? fp.meta.zone : ('plate ' + s));
  }
}

console.log('       ' + plates + ' plates, ' + floorCells + ' floor cells, ' +
            hazCells + ' with ground (' + (100 * hazCells / floorCells).toFixed(1) + '%)');
ok('the sample actually contains interior ground (' + hazCells + ' cells across ' + plates +
   ' plates), so every refusal below is judging something', hazCells > 200);
ok('nothing is placed off the floor' + (notFloor.length ? ' — ' + notFloor.slice(0, 3).join(', ') : ''),
   notFloor.length === 0);
ok('nothing is placed in a doorway or the cell beside one — a sealed room is a bug' +
   (inDoor.length ? ' — ' + inDoor.slice(0, 3).join(', ') : ''), inDoor.length === 0);
ok('nothing is placed under furniture — a hole under a filing cabinet is silly' +
   (onFurn.length ? ' — ' + onFurn.slice(0, 3).join(', ') : ''), onFurn.length === 0);
ok('rubble only falls where the ceiling was SPANNING (>=' + G.UNSUPPORTED + ' tiles from ' +
   'every wall), so a cupboard never gets a collapsed ceiling' +
   (shallowRubble.length ? ' — ' + shallowRubble.slice(0, 3).join(', ') : ''),
   shallowRubble.length === 0);
ok('no shaft is within 3 tiles of any door — a hole behind a door is a trap he could not ' +
   'have read, not a hazard' + (trapShaft.length ? ' — ' + trapShaft.slice(0, 3).join(', ') : ''),
   trapShaft.length === 0);
ok('no lift shaft in a house — a bungalow does not have a lift' +
   (houseLift.length ? ' — ' + houseLift.slice(0, 3).join(', ') : ''), houseLift.length === 0);
ok('and no plate has its floor cut into two pieces' +
   (split.length ? ' — ' + split.slice(0, 3).join(', ') : ''), split.length === 0);

/* ── 4. IT IS DERIVED, WHICH MEANS THE ROOM DECIDES ────────────────────────────────────
   The claim in the module is that the amount is a consequence of the building rather than
   a rate. That is checkable: a warehouse is one big span and a house is small rooms, so a
   warehouse MUST come out more damaged than a house without anybody typing either number. */
console.log('\nTHE ROOM DECIDES, NOT A RATE');
function share(zone) {
  let h = 0, f = 0;
  for (let s = 1; s <= 8; s++) {
    const fp = build(zone, s * 977);
    for (const row of fp.grid) for (const c of row) {
      if (!c) continue; if (c.g === 'floor') f++; if (c.terrain) h++;
    }
  }
  return h / f;
}
const house = share('residential'), shed = share('warehouse');
console.log('       residential ' + (100 * house).toFixed(1) + '%   warehouse ' +
            (100 * shed).toFixed(1) + '%');
ok('a warehouse ends up more damaged than a house because its ceiling spans further — ' +
   'nobody typed either number (' + (100 * house).toFixed(1) + '% vs ' +
   (100 * shed).toFixed(1) + '%)', shed > house * 1.5);
ok('and neither is absurd: a room is ground, not a minefield', shed < 0.25 && house > 0.002);

/* ── 5. DETERMINISM ────────────────────────────────────────────────────────────────────*/
console.log('\nTHE SAME BUILDING IS THE SAME BUILDING');
{
  const a = build('office', 5150), b = build('office', 5150);
  let same = true;
  for (let y = 0; y < a.H; y++) for (let x = 0; x < a.W; x++)
    if (!!a.grid[y][x].terrain !== !!b.grid[y][x].terrain) same = false;
  ok('the same plate grounds identically twice — he cannot walk out and back in and find ' +
     'a different hole', same);
  const c = build('office', 5150);
  G.ground(c, 'office'); G.ground(c, 'office');
  let n = 0; for (const row of c.grid) for (const cc of row) if (cc && cc.terrain) n++;
  let n1 = 0; for (const row of a.grid) for (const cc of row) if (cc && cc.terrain) n1++;
  ok('and grounding twice does not double it — the pass is idempotent on its own plate',
     n === n1);
}

console.log('\nINTERIOR GROUND GATE: ' + pass + ' passed, ' + fail + ' failed' +
  (fail ? '' : '  (the floor indoors is derived from the building, refuses every way a room ' +
   'stops working, and speaks the vocabulary the outdoor classes already spoke)'));
process.exit(fail ? 1 : 0);

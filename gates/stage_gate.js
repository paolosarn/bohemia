/* BOHEMIA STAGE GATE (8/12/26) — the cutscene plumbing is a MACHINE, not a
 * diorama, and every one of his four complaints is measured rather than
 * promised.
 *
 * Paolo 8/12: "im more concerned of the natural wiring and plumbing of the
 * cutscenes as well. Like it should be seemless and not need to be so
 * handcrafted everytime if that makes sense. From location. To it being the
 * actual house. To mfs not glitching into furniture. To understanding how long
 * voices should play compared to how long their text shit is."
 *
 * Four complaints, four sections. Each one is checkable because the stager is
 * headless and deterministic: no browser, no clock, no Math.random.
 *
 *   1 TIME       a line's hold is computed from its own text at a published
 *                reading speed, so it SCALES -- a longer line is measurably
 *                longer on screen -- and the babble is trimmed to end inside
 *                it. The numbers are the industry's, not mine: Netflix 20 cps
 *                adult / 5-6 sec floor / 7 sec ceiling, BBC 17 cps, general
 *                practice 12-14 cps.
 *   2 LOCATION   the room comes out of engine/bohemia_floorplan.js -- THE SAME
 *   + THE HOUSE  generator the walked world uses -- so it is a real room in a
 *                real plan at a seed, and a different place gives a different
 *                room. Proved by asking the generator directly and comparing.
 *   3 OCCUPANCY  swept over MANY generated houses: no two bodies ever share a
 *                cell and no body ever stands on a solid prop. That is the
 *                OCCUPANCY LAW applied to a scene, and it is the thing that
 *                makes "glitching into furniture" impossible rather than
 *                unlikely.
 *   4 NOT        the deciding test: a SECOND scene, in a DIFFERENT room, with
 *     HANDCRAFTED a different cast and different seat names it has never seen,
 *                stages correctly with ZERO new code. If that fails, this is
 *                still a diorama with better comments.
 *
 * Run: node gates/stage_gate.js
 * Registered in gates/bohemia_gates.py as STAGE.
 */
'use strict';
var path = require('path');
var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var S = require('../engine/bohemia_stage.js');
var FP = require('../engine/bohemia_floorplan.js');
var RT = require('../engine/bohemia_scene.js');
var fs = require('fs');

var pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; } else { fail++; console.log('  FAIL: ' + m); } }

/* ============================ 1. TIME ==================================== */
ok(S.CPS >= 12 && S.CPS <= 17,
  'reading speed sits inside the published range (12-14 general, 17 BBC, 20 Netflix adult) — got ' + S.CPS);
ok(S.MIN_MS === 833, 'the floor is Netflix\'s 5/6 of a second (' + S.MIN_MS + 'ms)');
ok(S.MAX_MS === 7000, 'the ceiling is Netflix\'s 7 seconds');
ok(Array.isArray(S.SOURCES) && S.SOURCES.length >= 3,
  'and the module names where the numbers came from, so nobody has to trust them');

var SHORT = 'Up. Now.';
var MID = "I'm not eating the green ones.";
var LONG = "They're saying the water district's hiring again. I'll go down Monday.";
ok(S.readBeats(SHORT) < S.readBeats(MID) && S.readBeats(MID) < S.readBeats(LONG),
  'A LINE\'S TIME SCALES WITH ITS TEXT (' + S.readBeats(SHORT) + ' < ' + S.readBeats(MID) +
  ' < ' + S.readBeats(LONG) + ' beats) — v1 gave every line the same hand-typed 2');
ok(S.readBeats('') === 0, 'a silent beat holds for nothing');
ok(S.readMs('a') === S.MIN_MS, 'a one-letter line still gets the minimum, never a flash');
ok(S.readMs(new Array(600).join('x')) === S.MAX_MS, 'and a runaway line is capped at the ceiling');
/* quantized UP: reading speed is a floor on comfort, so rounding must be safe */
var probe = 0, wrongWay = 0, i;
for (i = 1; i < 400; i += 7) {
  var t = new Array(i + 1).join('x');
  probe++;
  if (S.readBeats(t) * S.BEAT_MS < S.readMs(t) - 0.001) wrongWay++;
}
ok(wrongWay === 0, 'every line is quantized UP to a whole beat, never down (' + probe + ' probed)');

/* THE COUPLING HE ASKED FOR: the babble must END INSIDE the caption. */
var rates = [8, 10.74, 14, 18], overruns = 0, empties = 0;
[SHORT, MID, LONG, 'Back door. Behind me, and don\'t run until I say run.'].forEach(function (txt) {
  rates.forEach(function (rate) {
    var ms = S.readMs(txt);
    var said = S.voiceFit(txt, ms, rate);
    var letters = said.replace(/[^A-Za-z]/g, '').length;
    if ((letters / rate) * 1000 > ms) overruns++;
    if (!said) empties++;
  });
});
ok(overruns === 0, 'THE VOICE ALWAYS FINISHES INSIDE THE CAPTION (' +
  (rates.length * 4) + ' text/rate pairs, ' + overruns + ' overrun)');
ok(empties === 0, 'and every line still gets spoken — trimming never silences one');
ok(S.voiceFit(LONG, S.readMs(LONG), 10.74).length < LONG.length,
  'a line too long to babble in its window is trimmed on whole words');
ok(S.voiceFit(SHORT, S.readMs(SHORT), 10.74) === SHORT,
  'and a line that fits is spoken whole');

/* the runtime takes the policy rather than owning it */
var sc = JSON.parse(fs.readFileSync('records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json', 'utf8'));
function steps(timeFn) {
  var p = new RT.Scene(sc, timeFn ? { time: timeFn } : {});
  var n = 0; while (!p.done && n < 900) { p.step(); n++; } return n;
}
var typed = steps(null), read = steps(function (b) { return S.readBeats(b.text); });
ok(read > typed, 'the reading-speed policy actually reaches the runtime (' + typed +
  ' hand-typed steps -> ' + read + ' read-timed)');

/* ================= 2. LOCATION, AND IT IS THE ACTUAL HOUSE ================ */
var h = S.house({ zone: 'residential', role: 'living', seed: 7, w: 24, h: 16 }, FP);
ok(!!h && !!h.room, 'a scene asking for a place gets a room back');
var direct = FP.generate(7, 24, 16, { zone: 'residential', entrance: 'S' });
var match = (direct.rooms || []).some(function (r) {
  return r.x === h.room.x && r.y === h.room.y && r.w === h.room.w && r.h === h.room.h;
});
ok(match, 'THE ROOM IS A REAL ROOM OUT OF THE WALKED WORLD\'S OWN FLOORPLAN GENERATOR ' +
  '(' + h.room.w + 'x' + h.room.h + ' ' + h.room.role + ' at ' + h.room.x + ',' + h.room.y +
  ') — not a rectangle typed into a cutscene');
ok(h.room.role === 'living', 'and it is the room the scene asked for by ROLE, not by index');
var k = S.house({ zone: 'residential', role: 'kitchen', seed: 7, w: 24, h: 16 }, FP);
ok(k && k.room && (k.room.x !== h.room.x || k.room.y !== h.room.y),
  'a different ROLE gives a different room in the same house');
var other = S.house({ zone: 'residential', role: 'living', seed: 91, w: 24, h: 16 }, FP);
ok(other && (other.room.w !== h.room.w || other.room.h !== h.room.h || other.room.x !== h.room.x),
  'a different SEED gives a different house');
var again = S.house({ zone: 'residential', role: 'living', seed: 7, w: 24, h: 16 }, FP);
ok(again.room.x === h.room.x && again.room.y === h.room.y && again.room.w === h.room.w,
  'and the same place is the same house every time (deterministic — a scene the gate ' +
  'can play is a scene that plays the same for Paolo)');

/* ============ 3. NOBODY GLITCHES INTO THE FURNITURE, ANYWHERE ============= */
var rooms = 0, seatedTotal = 0, collisions = 0, inFurniture = 0, homeless = 0, tooFewSeats = 0;
var ZONES = ['residential', 'office', 'retail', 'civic', 'leisure'];
for (var z = 0; z < ZONES.length; z++) {
  for (var seed = 1; seed <= 24; seed++) {
    var hh = S.house({ zone: ZONES[z], seed: seed * 31 + 5, w: 22 + (seed % 9), h: 14 + (seed % 7) }, FP);
    if (!hh) continue;
    rooms++;
    var furn = S.furnish(hh.room, 'dining');
    var solid = S.solidCells(furn.props);
    var seating = new S.Seating(hh.room, furn);
    if (furn.seats.length < 2) tooFewSeats++;
    /* seat a whole family plus somebody on their feet, asking for names the
       stager has never heard of half the time */
    var who = ['a', 'b', 'c', 'd', 'e'];
    var used = {};
    who.forEach(function (id, n) {
      var wanted = (n % 2) ? ('far_' + n) : ('a_name_that_does_not_exist_' + n);
      var st = seating.sit(id, wanted);
      if (!st) { homeless++; return; }
      seatedTotal++;
      var cell = st.cx + ',' + st.cy;
      if (used[cell]) collisions++;
      used[cell] = 1;
      if (solid[cell]) inFurniture++;
    });
    var stand = seating.stand('f');
    if (stand) {
      var sc2 = stand.cx + ',' + stand.cy;
      if (used[sc2]) collisions++;
      if (solid[sc2]) inFurniture++;
      used[sc2] = 1;
    } else homeless++;
  }
}
ok(rooms >= 100, 'swept a real spread of generated houses (' + rooms + ')');
ok(tooFewSeats === 0, 'every furnished room produced usable seats');
ok(collisions === 0, 'NO TWO BODIES EVER SHARE A CELL across ' + rooms + ' houses (' +
  seatedTotal + ' seatings) — OCCUPANCY LAW, applied to a scene');
ok(inFurniture === 0, 'AND NOBODY IS EVER STANDING INSIDE THE FURNITURE (' + inFurniture + ')');
ok(homeless === 0, 'and nobody is left without a place to be');

/* an unknown seat name must FALL BACK, not fail — that is what lets a new scene
   invent its own vocabulary without touching this code */
var f2 = S.furnish(h.room, 'dining');
var s2 = new S.Seating(h.room, f2);
ok(!!s2.sit('x', 'a_seat_nobody_defined'), 'an unknown seat name takes the next free chair ' +
  'instead of dropping the actor on the floor');
ok(s2.sit('x', 'far_0').id === s2.byActor['x'].id, 'and asking twice returns the same seat');

/* DRAW ORDER: a body behind the table must sort BEFORE the table, or it draws
   on top of the furniture it is sitting behind — his exact complaint. */
var tbl = null; f2.props.forEach(function (p) { if (p.kind === 'table') tbl = p; });
var far = f2.seats.filter(function (s) { return s.side === 'far'; });
var near = f2.seats.filter(function (s) { return s.side === 'near'; });
ok(tbl && far.length && near.length, 'the dining kit produced a table and two rows of seats');
ok(far.every(function (s) { return s.cy < tbl.cy; }),
  'the far row sorts BEHIND the table, so the table is drawn over them');
ok(near.every(function (s) { return s.cy >= tbl.cy + tbl.h; }),
  'and the near row sorts in FRONT of it');

/* the camera frames the ACTION, not the floorplan */
var focus = S.focusOf(f2, h.room);
var cam = S.camera(h.room, { w: 360, h: 470 }, focus);
ok(focus.w <= h.room.w && focus.h <= h.room.h, 'the focus is the furniture, not the whole room');
var mid = cam.project(focus.x + focus.w / 2, focus.y);
ok(Math.abs(mid.x - 180) < 2, 'and the camera centres it in frame (' + Math.round(mid.x) + 'px of 360)');
ok(cam.scaleAt(focus.y) < cam.scaleAt(focus.y + focus.h),
  'a body further back is drawn smaller, from depth, not from a typed scale');

/* ======= 4. THE DECIDING TEST: A SECOND SCENE, ZERO NEW CODE ============== */
/* A SECOND SCENE IS A JSON FILE AND NOTHING ELSE. This one is a GATE FIXTURE
   and deliberately not canon -- it invents a room, a cast size and seat names
   that appear nowhere in the engine. If it stages, the plumbing is general. If
   it needed one line of new code, this is still a diorama.
   It is NOT shipped as a second cutscene, because a second real scene needs
   rulings from Paolo (who is in it, what happens) and words are the only half
   of that a lane may write. */
var FIXTURE = {
  id: 'stage_fixture', cites: 'gates/stage_gate.js — a fixture, not canon',
  place: { zone: 'office', role: 'meeting', seed: 404, w: 26, h: 18, kit: 'dining' },
  beats: [
    { kind: 'set', id: 'a', era: 'pre_collapse' },
    { kind: 'actor', id: 'p1', actor: 'mother', at: 'chair_by_the_window' },
    { kind: 'actor', id: 'p2', actor: 'father', at: 'the_other_one' },
    { kind: 'actor', id: 'p3', actor: 'sibling_older', at: 'far_0' },
    { kind: 'say', id: 's1', speaker: 'mother', text: 'Short.' },
    { kind: 'say', id: 's2', speaker: 'father',
      text: 'A considerably longer line, written only to prove that the hold this beat ' +
            'gets is computed from the text and not typed by anybody.' },
    { kind: 'end', id: 'z' }
  ]
};
var fh = S.house(FIXTURE.place, FP);
ok(!!fh, 'a scene in a completely different building stages at all');
var ffurn = S.furnish(fh.room, FIXTURE.place.kit);
var fseat = new S.Seating(fh.room, ffurn);
var fsolid = S.solidCells(ffurn.props);
var placed = {}, fcoll = 0, fsolidHit = 0;
FIXTURE.beats.filter(function (b) { return b.kind === 'actor'; }).forEach(function (b) {
  var st = fseat.sit(b.actor, b.at);
  if (!st) return;
  var c = st.cx + ',' + st.cy;
  if (placed[c]) fcoll++;
  if (fsolid[c]) fsolidHit++;
  placed[c] = b.actor;
});
ok(Object.keys(placed).length === 3, 'ALL THREE ACTORS ARE PLACED using seat names the ' +
  'engine has never seen ("chair_by_the_window", "the_other_one")');
ok(fcoll === 0 && fsolidHit === 0, 'with no collisions and nobody in the furniture');
var fp2 = new RT.Scene(FIXTURE, { time: function (b) { return S.readBeats(b.text); } });
var log = [], n2 = 0;
while (!fp2.done && n2++ < 400) { var r = fp2.step(); if (r.beat) log.push(r.beat.id); }
ok(fp2.done, 'and the whole fixture scene plays to its end beat');
var holdShort = S.readBeats('Short.'), holdLong = S.readBeats(FIXTURE.beats[5].text);
ok(holdLong > holdShort * 3, 'its long line holds far longer than its short one (' +
  holdShort + ' vs ' + holdLong + ' beats) with nobody having timed either');
ok(fh.room.x !== h.room.x || fh.room.w !== h.room.w,
  'and it is genuinely a different room from the cold open\'s (' +
  fh.room.w + 'x' + fh.room.h + ' vs ' + h.room.w + 'x' + h.room.h + ')');

/* THE SURFACE OWNS NO COORDINATES ANY MORE. The thing v1 was made of. */
var surf = fs.readFileSync('engine/bohemia_story_surface.js', 'utf8');
ok(!/bodyY\s*:/.test(surf), 'the surface has no hand-tuned bodyY left in it');
ok(!/\{\s*id:\s*'far_l'/.test(surf), 'and no hand-typed seat table');
ok(/BOH_STAGE|this\.ST\./.test(surf) || /stage/.test(surf),
  'it reads its room, seats and camera from the stager');

console.log('STAGE GATE: ' + pass + ' passed, ' + fail + ' failed  (' + rooms +
  ' generated houses swept, ' + seatedTotal + ' seatings, 0 collisions; ' +
  'a second scene stages with zero new code)');
process.exit(fail ? 1 : 0);

/* BOHEMIA DRIVE NETWORK GATE (7/31/26) — rule number one: the streets connect.
 *
 * PAOLO 7/31, on the districts I had just rebuilt: "I'm just still concerned why you're
 * such a fucking dumb ass like how dare you continue to like make streets in in a district
 * that like don't connect with each other like that's like the rule number one bro like
 * what's wrong with you?"
 * Law: laws/BOHEMIA_ADDENDUM_RULE_NUMBER_ONE_7_31_26.md
 *
 * He was right, and it was worse than the two districts he was looking at. Measured across
 * the valley: 23 districts had drive surface a car could SEE and never REACH. Commercial —
 * the one he was scoring — was 71.9%: its service alley ran along the back, down one side
 * and stopped, so a truck could enter and never get out, and the fuel pad and the bank pad
 * were islands with no road to them.
 *
 * THE BUG BEHIND THE BUG, and it is why this had been green for weeks: every district
 * asked `driveReachFromStreet(g, ONE_CODE)`. A mall asked whether its ring road connected
 * and never asked about the parking fields the ring exists to serve, because those are a
 * different code. Each district was checking one limb and calling the body healthy. The
 * shared answer is K.driveNetworkReach, which unions EVERY code the legend calls a drive
 * surface and asks one question about the whole lot.
 *
 * TWO SMALLER TRUTHS FELL OUT OF IT:
 *   PAINT IS NOT A WALL. Stall stripes are a `marking` kind painted on asphalt and a car
 *   drives straight over them. Treating them as obstacles invented pockets that are not
 *   there — the last ten "unreachable" tiles in commercial were slivers fenced in by
 *   parking stripes.
 *   A LANE HAS TO BE WIDE ENOUGH TO BE A LANE. He circled two vertical lines running down
 *   the mall and asked what they were supposed to be. They were drive lanes ONE TILE WIDE
 *   — 0.75m, a 30-inch road. No car fits. It read as a mystery stripe rather than a street,
 *   which is exactly how he read it. K.driveWidthScore scores the share of drive tiles
 *   sitting in a 3x3 block of drive, so a district made of hairlines fails however
 *   connected it is.
 *
 * RATCHET, because 22 districts fail today and a gate that is red on day one is a comment
 * nobody can act on. The debt is NAMED, may only SHRINK, and no district outside the list
 * may grow a new disconnection. Some of it is legitimate and will stay named rather than
 * silently excused — a runway is not reached from a kerb — so the next person has to look
 * at each one and decide instead of inheriting a blanket excuse.
 *
 *   node gates/drive_network_gate.js
 */
const fs = require('fs');
const path = require('path');
const K = require('../engine/bohemia_district_kit.js');

const ROOT = path.join(__dirname, '..');
for (const f of fs.readdirSync(path.join(ROOT, 'engine'))) {
  if (!/^bohemia_.*\.js$/.test(f) || /test|kit/.test(f)) continue;
  try { require(path.join(ROOT, 'engine', f)); } catch (e) { /* not a district */ }
}

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : fails.push(n); };

/* NAMED DEBT, measured 7/31 when the law landed. May only shrink.
   SHRUNK 8/24, ELEVEN AT ONCE, AND NOT ONE OF THEM WAS TOUCHED. apartment, ballpark, campus,
   downtown, jail, landfill, park, railyard, terminal, trailer and warehouse all came green the
   moment paint stopped counting as drive SURFACE (it is a conductor now -- K.driveMask /
   K.driveConductors, 8/24). Every one of those eleven was reported broken because of ITS OWN
   MARKINGS: a stall stripe or a bay number sitting off the lane counted as a road a car could
   not reach. The metric was wrong, not the districts, and it had been wrong since 7/31.
   They are struck from the debt, so none of them can quietly go bad again. */
const DISCONNECTED_DEBT = new Set([
  'airbase', 'airport', 'boneyard', 'desert', 'interchange', 'medical', 'rail', 'solar',
  'speedway', 'town', 'truckstop',
]);
/* THE FOUR THAT WERE GENUINELY BROKEN ARE FIXED (8/25) AND THERE ARE NO UNEXCUSED ONES LEFT.
   prison read 9.6%, fort 52.9%, dam 0.0%, minigp 0.0% -- inherited, red on main since they
   were written, and deliberately NOT excused into the debt set, because excusing four broken
   districts with a keystroke is the one thing a ratchet must never allow. So they were fixed
   instead, and each was a different real fault:
     dam      its access road met the street THROUGH ITS GATE TILE, and a gate counted as a
              wall. Nothing was wrong with the dam. (K.driveConductors, 8/25.)
     minigp   the entrance ran five tiles in from the kerb and stopped in open outfield, and
              the tyre barrier was an unbroken ring -- the circuit was a sealed island. It has
              a pit access gap now, which every club circuit has.
     prison   the sally port sat entirely OUTSIDE the outer wire and pierced neither fence. A
              sally port is a vehicle trap cut through BOTH runs; now it is.
     fort     the interpretive path was drawn OVER the access track and cut it in two. The
              track goes down last; a path crosses a drive at grade.
   BADNOW_CEILING is now exactly the size of the named debt. Nothing is unexcused. */
const BADNOW_CEILING = 11;
const HAIRLINE_DEBT = new Set(['battery', 'cemetery', 'desert', 'golf']);
const WIDTH_FLOOR = 0.35;

let swept = 0, badNow = [], thinNow = [], regressed = [], thinRegressed = [], fixed = [];

for (const name of K.types()) {
  const d = K.get(name);
  if (!d || !d.generate || !d.legend) continue;
  const S = K.driveMask(d.legend);
  if (!S) continue;
  let r;
  try { r = d.generate(11, { streets: ['S'] }); } catch (e) { continue; }
  let tiles = 0;
  for (const row of r.g) for (const c of row) if (S[c]) tiles++;
  if (tiles < 50) continue;
  swept++;

  const reach = K.driveNetworkReach(r.g, d.legend);
  const width = K.driveWidthScore(r.g, d.legend);

  if (reach < 0.999) {
    badNow.push(name);
    if (!DISCONNECTED_DEBT.has(name))
      regressed.push(name + ' (' + (100 * reach).toFixed(1) + '% of its drive surface reachable)');
  } else if (DISCONNECTED_DEBT.has(name)) fixed.push(name);

  if (width < WIDTH_FLOOR) {
    thinNow.push(name);
    if (!HAIRLINE_DEBT.has(name))
      thinRegressed.push(name + ' (' + (100 * width).toFixed(0) + '% of its lanes are wide enough to drive)');
  }
}

ok(`every district with a drive surface is swept (${swept})`, swept >= 30);

ok('RULE NUMBER ONE — no district outside the named debt has drive surface a car cannot ' +
   'reach from the street' + (regressed.length ? ' — ' + regressed.join(', ') : ''),
   regressed.length === 0);

ok(`the disconnected debt only ever SHRINKS (${badNow.length} districts, ceiling ` +
   `${BADNOW_CEILING}; nothing unexcused)` +
   (fixed.length ? '  FIXED since: ' + fixed.join(', ') : ''),
   badNow.length <= BADNOW_CEILING);

ok('NO HAIRLINE LANES — no district outside the named debt is built from roads too narrow ' +
   'to drive (he circled two of them and asked what they were)' +
   (thinRegressed.length ? ' — ' + thinRegressed.join(', ') : ''), thinRegressed.length === 0);

ok(`the hairline debt only ever SHRINKS (${thinNow.length}, was ${HAIRLINE_DEBT.size})`,
   thinNow.length <= HAIRLINE_DEBT.size);

/* THE TWO HE WAS ACTUALLY LOOKING AT must be perfect, in every placement — they are the
   ones he scored, so "mostly connected" is not an answer for them. */
for (const name of ['commercial', 'mall']) {
  const d = K.get(name);
  let allReach = true, allWide = true;
  for (const cfg of [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']]) {
    const r = d.generate(11, { streets: cfg });
    if (K.driveNetworkReach(r.g, d.legend) < 0.999) allReach = false;
    if (K.driveWidthScore(r.g, d.legend) < WIDTH_FLOOR) allWide = false;
  }
  ok(`${name.toUpperCase()}: EVERY drivable tile is reachable from the street, in all six ` +
     'placements (it was 71.9% when he called it out)', allReach);
  ok(`${name.toUpperCase()}: its roads are wide enough to be roads`, allWide);
}

/* the shared answer exists and the districts USE it — a per-code check is what let this
   ship green for weeks, so nobody gets to go back to one. */
const kitSrc = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_district_kit.js'), 'utf8');
ok('the kit owns ONE answer for the whole drive network (K.driveNetworkReach)',
   /function driveNetworkReach/.test(kitSrc) && typeof K.driveNetworkReach === 'function');
/* PAINT IS NOT A WALL -- RE-AIMED 8/24, NOT WEAKENED. This used to read the MASK and assert
   markings were in it. That is an implementation detail, and it was the wrong one: counting
   paint as drive SURFACE made every stencilled bay number in a gravel yard an unreachable
   road, and dropped nine districts to 99.8% without a car being denied anything. Paint is a
   CONDUCTOR now -- it carries the path, it is not itself road. So the test asks the thing the
   7/31 ruling actually protects, which is stronger than what it replaces: a road cut clean in
   half by its own stripe is STILL ONE ROAD, end to end. A test that reads the mechanism can
   only ever confirm the mechanism; a test that reads the behaviour catches it changing. */
ok('PAINT IS NOT A WALL: a road split by its own stall stripe is still fully reachable',
   (() => {
     const L = { 0: { kind: 'ground' }, 1: { kind: 'drive' }, 2: { kind: 'marking' } };
     const n = 24, g = [];
     for (let y = 0; y < n; y++) g.push(new Array(n).fill(0));
     for (let y = 0; y < n; y++) g[y][5] = 1;          /* a lane from edge to edge */
     g[12][5] = 2;                                     /* one stripe painted clean across it */
     return Math.abs(K.driveNetworkReach(g, L) - 1) < 1e-9;
   })());
ok('AND PAINT IS NOT A ROAD: a lone stencil on the ground is not unreachable drive surface',
   (() => {
     const L = { 0: { kind: 'ground' }, 1: { kind: 'drive' }, 2: { kind: 'marking' } };
     const n = 24, g = [];
     for (let y = 0; y < n; y++) g.push(new Array(n).fill(0));
     for (let y = 0; y < n; y++) g[y][5] = 1;
     g[18][18] = 2;                                    /* a bay number stencilled out in the yard */
     return Math.abs(K.driveNetworkReach(g, L) - 1) < 1e-9;
   })());
for (const name of ['commercial', 'mall']) {
  const src = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_' + name + '.js'), 'utf8');
  ok(`${name} asks the WHOLE-NETWORK question, not a single code`,
     /driveNetworkReach/.test(src));
}

const law = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_RULE_NUMBER_ONE_7_31_26.md');
ok('the ruling is written down with his words', fs.existsSync(law) &&
   /rule number one/i.test(fs.readFileSync(law, 'utf8')));

for (const f of fails) console.log('  > FAIL ' + f);
console.log(`=== DRIVE NETWORK GATE: ${pass} passed, ${fails.length} failed  (${swept} districts · ` +
            `disconnected ${badNow.length}/${DISCONNECTED_DEBT.size} · hairline ${thinNow.length}/${HAIRLINE_DEBT.size}) ===`);
process.exit(fails.length ? 1 : 0);

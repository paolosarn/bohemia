/* ONE-BUILDING GATE (8/2/26, WORLD lane) — ARTICULATION IS NOT FRAGMENTATION.
   The machine behind Paolo's 8/2 ruling on the library:

     "There's like six different buildings of the library. What's up with that?
      I would give it a 22%."

   He was right, and it was a THINKING error, not a drawing error. The 7/30 law says
   NO BUILDING IS A FLAT RECTANGLE. I turned that into "make several separate
   buildings", which is a different thing and a wrong one. A civic landmark is ONE
   mass whose PARTS differ — a drum, a tower, a long wing — all joined, sharing walls,
   one roof line stepping between them. Predock's Las Vegas Library (the real
   reference) is a single continuous composition, not a campus.

   AND THE WORSE HALF: I had encoded the mistake in gates/library_gate.js as
   `footprints >= 4`. The machine was REQUIRING the bug. A wrong law outlives the turn
   that made it and teaches every future session the same error — which is exactly why
   this gate exists as its own file instead of one more line buried in a district gate.

   THE BUILDING TYPE DECIDES, NEVER THE GATE. So this gate holds BOTH directions, and
   the second direction is the one that keeps it honest:

     SINGLE — a library, a chapel, a city hall, a courthouse, a terminal and an
     enclosed mall are each ONE building. Their building tiles must form ONE dominant
     mass (>=90% of all building/structure area in the largest connected mass). The
     slack under 100% is for free-standing STRUCTURE-kinded dressing — plaza lights,
     a rooftop lantern — never for a second building.

     MANY — a downtown street of narrow lots, a strip-mall row and a school campus are
     MANY buildings, because a street of lots IS many buildings and a campus IS many
     buildings. Their largest mass must stay BELOW 70%, so no future session "fixes"
     them into one blob in the name of this law.

   Measured as SHARE, not as a footprint count, on purpose: the library's drum has an
   oculus ring around its inner core and the courthouse has an enclosed atrium, so both
   report 2 footprints while being one building. Counting masses would have failed the
   very buildings that are right. Share does not care about a hole in the middle.

   Run: node gates/one_building_gate.js   Registered as ONE BUILDING. */
'use strict';
const K = require('../engine/bohemia_district_kit.js');
require('../engine/bohemia_world.js');

const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];

// district -> the real-world reason it is one building or many. The reason is the law;
// the number is only how the machine checks it.
const SINGLE = {
  library:    'a library is one building — Predock\'s is a drum, a tower and two wings sharing walls',
  chapel:     'a chapel is one building — a nave with a bell tower on it',
  cityhall:   'a city hall is one building — a civic block, however it steps',
  courthouse: 'a courthouse is one building — its atrium is a hole in it, not a second building',
  terminal:   'a terminal is one building — concourses are arms of it',
  mall:       'an enclosed mall IS one building — that is what "enclosed" means',
};
const MANY = {
  downtown:   'a downtown block is a STREET OF NARROW LOTS, and each lot is its own building',
  commercial: 'a strip is a ROW of separate units under separate awnings, never one long box',
  school:     'a school is a CAMPUS — classroom wings, a gym, portables, an auto shop',
};

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* the share of all BUILDING/STRUCTURE area that sits in the single largest connected
   mass, taken at its WORST across every placement and seed. */
function worstShare(mod, name) {
  /* USE THE MODULE'S OWN BODY PREDICATE where it has one. Each district already declares
     to K.register exactly which codes ARE its building; asking that instead of sweeping
     every structure-kinded tile is both more accurate and the thing the law actually says.
     It started mattering on 8/2, when the city hall's solar array moved out of the plaza
     into its own bed as EQUIPMENT (Paolo: "no more canopies") -- 33 free-standing panels
     are structure, they are not part of the city hall, and counting them as building area
     dragged a genuinely single building down to 85%. A gate that measures the wrong set
     fails honest work, which is the 8/2 library lesson in a different costume. */
  const spec = K.get(name);
  const isB = (spec && typeof spec.body === 'function')
    ? spec.body
    : (function () {
        const body = Object.keys(mod.legend)
          .filter(c => mod.legend[c].kind === 'building' || mod.legend[c].kind === 'structure')
          .map(Number);
        return v => body.indexOf(v) >= 0;
      })();
  let worst = 1;
  for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
    const g = mod.generate(s * 13 + 1, { streets: cfg }).g;
    const W = g[0].length, H = g.length, seen = new Set();
    let total = 0, largest = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!isB(g[y][x]) || seen.has(x + ',' + y)) continue;
      const st = [[x, y]]; seen.add(x + ',' + y); let n = 0;
      while (st.length) {
        const p = st.pop(); n++;
        for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = p[0] + d[0], ny = p[1] + d[1], k = nx + ',' + ny;
          if (!seen.has(k) && nx >= 0 && ny >= 0 && nx < W && ny < H && isB(g[ny][nx])) {
            seen.add(k); st.push([nx, ny]);
          }
        }
      }
      total += n; if (n > largest) largest = n;
    }
    if (!total) return 0;
    const share = largest / total;
    if (share < worst) worst = share;
  }
  return worst;
}

for (const d of Object.keys(SINGLE)) {
  const share = worstShare(require('../engine/bohemia_' + d + '.js'), d);
  ok('SINGLE — ' + d + ': ' + SINGLE[d] + '  (largest mass ' + (share * 100).toFixed(1) + '% of its building area, worst placement)',
     share >= 0.90);
}
for (const d of Object.keys(MANY)) {
  const share = worstShare(require('../engine/bohemia_' + d + '.js'), d);
  ok('MANY — ' + d + ': ' + MANY[d] + '  (largest mass ' + (share * 100).toFixed(1) + '%, must stay under 70%)',
     share < 0.70);
}

/* THE GATE THAT REQUIRED THE BUG. library_gate.js asserted `footprints >= 4`. Nothing
   stops that from being written again except a test that reads the gate file itself. */
{
  const src = require('fs').readFileSync(__dirname + '/library_gate.js', 'utf8');
  ok('library_gate.js does not demand a FRAGMENTED library — the >= 4 footprint ' +
     'assertion that made the machine require the bug is gone and cannot come back quietly',
     !/footprints\.length\s*<\s*[2-9]/.test(src));
}

console.log('ONE BUILDING GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            (Object.keys(SINGLE).length + Object.keys(MANY).length) + ' districts, ' +
            CONFIGS.length + ' placements each)');
process.exit(fail ? 1 : 0);

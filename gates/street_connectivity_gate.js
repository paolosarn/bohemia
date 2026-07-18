// STREET CONNECTIVITY GATE (Paolo 7/18/26: NO-STREET-BREAK LAW)
// The surface-street grid must run continuous — no street dead-ends into an
// empty buildable lot. A street may legitimately END at anything real: the
// map edge, water, mountain, wash, the freeway, OR any claimed big-architecture
// landmark (the Strip, casinos, estates, malls, solar, gated communities,
// airport, ...). The ONLY illegitimate end is dead-ending into OPEN desert or
// suburb lots with nothing there — that is the "broken off" street Paolo saw.
const O = require('../engine/bohemia_overmap.js');
let pass = 0, fail = 0;
function ok(n, c) { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); }

const m = O.buildOvermap(12345);
const N = m.n;
const ROAD = new Set(['arterial', 'freeway', 'strip', 'beltway', 'interchange', 'downtown', 'town']);
const OPEN = new Set(['desert', 'suburb']);   // the only empty-lot districts
const d4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

let breaks = 0, sample = [];
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  if (m.at(x, y).district !== 'arterial') continue;
  let roadN = 0, termN = 0, edge = false;
  for (const [dx, dy] of d4) {
    const c = m.at(x + dx, y + dy);
    if (!c) { edge = true; continue; }
    if (ROAD.has(c.district)) roadN++;
    else if (!OPEN.has(c.district)) termN++;      // a real terminator
  }
  // a break: <=1 road neighbor, no real terminator beside it, not the map edge
  // -> the street just stops in an open lot.
  if (roadN <= 1 && termN === 0 && !edge) {
    breaks++;
    if (sample.length < 10) sample.push(x + ',' + y);
  }
}
ok('no surface street dead-ends into an empty lot (NO-STREET-BREAK LAW)', breaks === 0);
if (breaks) console.log('  street breaks: ' + breaks + ' e.g. ' + sample.join(' '));

// sanity: the mile grid is still dense and continuous (the spine survived)
let arts = 0;
for (const t of m.tiles) if (t.district === 'arterial') arts++;
ok('mile grid intact (>= 2000 arterial cells)', arts >= 2000);

console.log('STREET CONNECTIVITY GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  breaks + ' breaks, ' + arts + ' arterials)');
process.exit(fail ? 1 : 0);

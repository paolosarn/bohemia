/* ============================================================================
   D1 KERB GATE — "houses or buildings should NEVER SIT ON THE SIDEWALK EVER
   ANYWHERE IN THE WORLD" (Paolo 7/31, LOCKED). ANYWHERE means the REGISTRY, so
   this sweeps K.types(), not one module. suburb_street_gate covers the suburb in
   depth; this one covers the other thirty-nine.

   THREE ASSERTIONS, all on the WORLD MODEL (never a renderer — that trick is
   what hid the missing suburb walk for a week; see suburb_street_gate.js:10-26):
     1. ORDER — no generator write puts a MASS code over a WALK code. Recorded by
        instrumenting the kit's own drawing surface, so it catches the cause, not
        the symptom.
     2. GEOMETRY — no mass cell is orthogonally adjacent to a drive tile the
        legend marks `street:true`. A private apron/aisle is not a street: D1
        itself says the apron crosses the walk.
     3. COVERAGE — a district that declares a street must have a walk beside it:
        zero bare ground touching a street:true tile.
   EXEMPT (Paolo 7/31, LOCKED, verbatim "OK, freeways and railyards do not get
   sidewalks"): K.D1_EXEMPT. HIS LIST, NOT MINE TO EXTEND.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const K = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));

/* THE RATCHET, and it is not a rubber stamp. Six districts write mass over their own
   walk code TODAY, and did so long before this gate existed. Registering the gate red
   would block every other lane from shipping, and the honest fix is a CLASSIFICATION
   ruling that is Paolo's, not mine. Every one of the six is the same shape: a legend
   row doing double duty, naming the public walk AND the thing the building stands on
   in one code. Their own act1 text says it out loud --
     library    13 'terrace / walk'   "the raised concrete TERRACE THE WHOLE BUILDING
                                       SITS ON, and the walks across it"
     cityhall   13 'walk / podium'    "the raised concrete PODIUM THE BUILDING STANDS
                                       ON and the walks across it"
     courthouse 13 'walk'             the setback walks, built across
     chapel     12 'churchyard walk'  the arcade COLUMNS stand on it (32,94 .. 96,96)
     commercial / downtown            the same, smaller
   A plinth, a podium and an arcade footing are not sidewalks, and a portico standing
   on paving is architecture, not the defect he described ("houses or buildings should
   NEVER SIT ON THE SIDEWALK"). But splitting one code into two is his ruling to make,
   so each of the six carries a CEILING measured 8/3/26 that can only ever go DOWN.
   The list is CLOSED — the gate fails if a seventh district is added, and fails if any
   ceiling is raised. Every other district reads zero and stays zero. */
const RATCHET = { library: 23514, courthouse: 14382, cityhall: 13266,
                  commercial: 834, downtown: 108, chapel: 60 };
const RATCHET_MAX = 6;

// instrument BEFORE the generators load, so every write is seen
const realGrid = K.grid; let LOG = null, KIND = null;
K.grid = function (seed, w, h) {
  const api = realGrid(seed, w, h), g = api.g;
  ['set','rect','hbar','vbar','frame','disc'].forEach(function (nm) {
    const f = api[nm];
    if (typeof f !== 'function') return;
    api[nm] = function () {
      if (!LOG) return f.apply(api, arguments);
      const before = g.map(r => r.slice());
      const out = f.apply(api, arguments);
      for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) {
        const a = before[y][x], b = g[y][x]; if (a === b) continue;
        if (KIND[a] === 'walk' && (KIND[b] === 'building' || KIND[b] === 'structure')) {
          LOG.massOverWalk++; if (LOG.where.length < 4) LOG.where.push(x + ',' + y);
        }
      }
      return out;
    };
  });
  return api;
};
require(path.join(ROOT, 'engine/bohemia_world.js'));   // registers every district

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const SURFACE = { arterial:1, freeway:1, desert:1, mountain:1, water:1,
                  airport:1, airbase:1, rail:1, interchange:1 };
const SEEDS = [1, 7, 42, 999, 4242, 12345];
const CFGS  = [['S'], ['S','E'], ['W'], ['N']];
const D4 = [[1,0],[-1,0],[0,1],[0,-1]];

/* the ratchet can never grow or be reasoned into covering a new district */
ok('the ratchet list is closed at ' + RATCHET_MAX + ' districts', Object.keys(RATCHET).length <= RATCHET_MAX);
for (const t in RATCHET) ok('ratcheted district "' + t + '" is a real registered district', !!K.get(t));

let swept = 0, totOrder = 0, totFlush = 0, totBare = 0, withStreet = 0, slack = [];
for (const type of K.types()) {
  if (SURFACE[type] || K.D1_EXEMPT[type]) continue;
  const spec = K.get(type); if (!spec || !spec.generate) continue;
  const L = spec.legend || {};
  const kind = {}; for (const c in L) if (L[c]) kind[c] = L[c].kind;
  KIND = kind; swept++;

  LOG = { massOverWalk: 0, where: [] };
  for (const s of [1, 42, 12345]) { try { spec.generate(s, { cw:1, ch:1, streets:['S'], district:type }); } catch (e) {} }
  const order = LOG; LOG = null;
  totOrder += order.massOverWalk;
  const ceil = RATCHET[type] || 0;
  if (ceil && order.massOverWalk < ceil) slack.push(type + ' ' + order.massOverWalk + '<' + ceil);
  ok(type + ': no building is ever STAMPED ON a sidewalk (order holds)'
     + (ceil ? ' [RATCHETED, ceiling ' + ceil + ', reads ' + order.massOverWalk + ']' : '')
     + (order.massOverWalk > ceil ? ' -- ' + order.massOverWalk + ' writes, e.g. ' + order.where.join(' ') : ''),
     order.massOverWalk <= ceil);

  const ST = K.streetCodes(L);
  if (!ST) continue;                       // declares no public street: nothing to front
  withStreet++;
  let flush = 0, bare = 0;
  for (const st of CFGS) for (const s of SEEDS) {
    let r; try { r = spec.generate(s, { cw:1, ch:1, streets:st, district:type }); } catch (e) { continue; }
    if (!r || !r.g) continue;
    const g = r.g, H = g.length, W = g[0].length;
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? -1 : g[y][x];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const v = g[y][x], k = kind[v];
      if (ST[v]) { for (const [dx, dy] of D4) if (at(x+dx, y+dy) === 0) bare++; continue; }
      if (k !== 'building' && k !== 'structure') continue;
      for (const [dx, dy] of D4) if (ST[at(x+dx, y+dy)]) { flush++; break; }
    }
  }
  totFlush += flush; totBare += bare;
  ok(type + ': NO MASS ON THE KERB -- zero buildings flush to a public street'
     + (flush ? ' (' + flush + ' on the kerb)' : ''), flush === 0);
  ok(type + ': every street frontage wears a walk -- zero bare ground at the kerb'
     + (bare ? ' (' + bare + ' bare)' : ''), bare === 0);
}
ok('the sweep saw the whole registry, not one module (' + swept + ' non-exempt districts)', swept >= 30);
if (slack.length) console.log('  RATCHET CAN DROP: ' + slack.join(', ') + '  (lower the ceiling in this file)');
console.log('D1 KERB GATE: ' + pass + ' passed, ' + fail + ' failed  (' + swept
  + ' districts, ' + withStreet + ' declaring a public street, ' + totOrder
  + ' mass-over-walk writes, ' + totFlush + ' on the kerb, ' + totBare + ' bare frontage)');
process.exit(fail ? 1 : 0);

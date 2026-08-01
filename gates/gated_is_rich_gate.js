#!/usr/bin/env node
/* ===========================================================================
   GATED IS RICH GATE — the two bank rules that sat unenforced for 18 days.

   THE LAWS, and they are Paolo's own words inside his own APPROVED banks, not
   anything derived. Both live in banks/BOHEMIA_GRAPHICS_VERDICTS_MASTER_7_16_26
   .txt and banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt under `paolo_laws`:

     gated_is_rich       "most Vegas communities are walled but NOT gated;
                          gates = boujee/richer pre-apocalypse (story fuel
                          post-apocalypse)"
     gates_touch_streets "entrances must align with adjacent street network;
                          entrance segment = suburb road type"

   THEY WERE NAMED AS UNGATED IN THE BACKLOG ON 7/28 (item 0N: "STILL UNGATED,
   NAMED: gates_touch_streets and gated_is_rich are generator-level rules with no
   machine") and banklaw_gate.py says so out loud in its own output. This is that
   machine. Written 8/1.

   WHAT WAS ACTUALLY BROKEN: three district types share the suburb generator -
   suburb, gated, estate - and bohemia_world.js called it with only a seed and
   the street edges. It never said WHICH. So the generator stamped a gate through
   every street edge of every one of them, and `gated` was a district type that
   changed nothing. Measured on the canon seed: 2,631 residential cells, of which
   2,582 (98.1%) are ordinary `suburb` - every single one of them built as a
   gated community, which is the exact inversion of the law.

   THE REAL VEGAS BEHIND IT, because everything in Bohemia is grounded in the
   real: Clark County's Unified Development Code 30.64.020 REQUIRES a developer-
   installed decorative perimeter wall on a subdivision. A wall is code, not
   status - practically every tract in the valley has one. The GATE is the thing
   a richer community bought on top. Nationally the American Housing Survey
   (2015, the last year it carried the question) found 5.9% of households behind
   a wall or fence and 3.4% behind controlled access.

   PROVED ABLE TO FAIL before it was believed: reverting the district argument in
   bohemia_world.js, or defaulting the generator to gated, turns this red.
   =========================================================================== */
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

const SUB = require(path.join(ROOT, 'engine/bohemia_suburb.js'));
const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const SEED = 2691674296;                        // hashSeed('bohemia'), the ONE seed

const GATE = 5, ROAD = 1, WALL = 4;
const FAMILY = ['suburb', 'gated', 'estate'];
const RICH = { gated: 1, estate: 1 };

/* ---------------------------------------------------------------------------
   0. THE LAWS ARE STILL IN HIS BANKS, VERBATIM
   Enforcing a rule whose source has drifted is enforcing my memory of it.
   --------------------------------------------------------------------------- */
for (const bank of ['banks/BOHEMIA_GRAPHICS_VERDICTS_MASTER_7_16_26.txt',
                    'banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt']) {
  const src = rd(bank);
  ok('gated_is_rich is still in ' + path.basename(bank),
    src.includes('most Vegas communities are walled but NOT gated'));
  ok('gates_touch_streets is still in ' + path.basename(bank),
    src.includes('entrances must align with adjacent street network'));
}

/* ---------------------------------------------------------------------------
   1. GATED IS RICH — on the generator, per district type
   --------------------------------------------------------------------------- */
function edgeCells(res) {
  const { g, W, H } = res, out = [];
  for (let x = 0; x < W; x++) { out.push(g[0][x]); out.push(g[H - 1][x]); }
  for (let y = 1; y < H - 1; y++) { out.push(g[y][0]); out.push(g[y][W - 1]); }
  return out;
}
const countOf = (cells, code) => cells.filter(c => c === code).length;

for (const d of FAMILY) {
  const res = SUB.generate(4242, { cw: 1, ch: 1, streets: ['S', 'E'], district: d });
  const cells = edgeCells(res);
  const gates = countOf(cells, GATE), open = countOf(cells, ROAD);
  if (RICH[d]) {
    ok(d + ': a rich community HAS a gate assembly', gates > 0);
    ok(d + ': and does not just leave the street open', open === 0);
  } else {
    ok(d + ': an ordinary community has NO gate anywhere on its perimeter', gates === 0);
    ok(d + ': its street runs straight through the wall instead', open > 0);
  }
  ok(d + ': the perimeter wall is there either way (Clark County 30.64.020)',
    countOf(cells, WALL) > 100);
  ok(d + ': the result reports its own gating honestly', res.gated === !!RICH[d]);
}

/* THE DEFAULT IS THE MAJORITY. A caller that says nothing must get the ordinary
   walled subdivision - the expensive thing has to be asked for by name, or the
   next module to call this re-breaks the law by omission exactly as the world
   model did for eighteen days. */
{
  const bare = SUB.generate(4242, { cw: 1, ch: 1, streets: ['S', 'E'] });
  ok('a generator call with NO district defaults to WALLED, NOT GATED',
    bare.gated === false && countOf(edgeCells(bare), GATE) === 0);
}

/* ---------------------------------------------------------------------------
   2. THE VALLEY'S RATIO — the law is about a population, not one plot
   --------------------------------------------------------------------------- */
{
  const om = OM.buildOvermap(SEED), N = OM.OVER_N, count = {};
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const c = om.at(x, y); if (c) count[c.district] = (count[c.district] || 0) + 1;
  }
  const total = FAMILY.reduce((a, k) => a + (count[k] || 0), 0);
  const rich = (count.gated || 0) + (count.estate || 0);
  const share = rich / total;
  ok('the valley has a real residential population to rule on', total > 1000);
  ok(`MOST communities are NOT gated (${(share * 100).toFixed(1)}% gated of ${total})`,
    share < 0.25);
  ok('but gated communities DO exist (they are rare, not absent)', rich > 0);
  console.log('       valley: ' + total + ' residential cells · ' + rich + ' gated/estate ('
    + (share * 100).toFixed(1) + '%) · ' + (count.suburb || 0) + ' walled-not-gated');
}

/* ---------------------------------------------------------------------------
   3. GATES TOUCH STREETS — every entrance, of either kind
   --------------------------------------------------------------------------- */
for (const d of FAMILY) {
  for (const streets of [['S'], ['E'], ['S', 'E'], ['N', 'W'], ['S', 'E', 'N', 'W']]) {
    const res = SUB.generate(99991, { cw: 1, ch: 1, streets: streets, district: d });
    const tag = d + ' [' + streets.join('') + ']';
    const ents = res.gates || [];
    ok(tag + ': one entrance per street edge, and none anywhere else',
      ents.length === streets.length && ents.every(e => streets.indexOf(e.edge) >= 0));
    /* ON the street edge: an entrance cell must sit on the perimeter ring it
       claims, which is what "touch the street" means geometrically. */
    ok(tag + ': every entrance sits on the perimeter of the edge it names',
      ents.every(e => (e.edge === 'S' && e.y === res.H - 1) || (e.edge === 'N' && e.y === 0)
                   || (e.edge === 'E' && e.x === res.W - 1) || (e.edge === 'W' && e.x === 0)));
    /* "entrance segment = suburb road type": the spoke inside the wall must be
       the district's OWN road code, so a car comes off the arterial onto suburb
       street and not onto something else. */
    ok(tag + ': the entrance segment inside the wall is suburb ROAD',
      ents.every(e => {
        const g = res.g;
        const step = e.edge === 'S' ? [0, -1] : e.edge === 'N' ? [0, 1]
                   : e.edge === 'E' ? [-1, 0] : [1, 0];
        for (let k = 1; k <= 6; k++) {
          const x = e.x + step[0] * k, y = e.y + step[1] * k;
          if (y < 0 || x < 0 || y >= res.H || x >= res.W) return false;
          if (g[y][x] === ROAD) return true;      // the spoke is there
        }
        return false;
      }));
    /* and it has to actually GO somewhere: a door onto a disconnected network is
       a painted door, which is the failure the front-door law already names. */
    ok(tag + ': the drivable network reaches the plot from that entrance',
      SUB.roadConnected(res));
  }
}

/* ---------------------------------------------------------------------------
   4. NOTHING ELSE MAY STAMP A GATE
   The generator has a legacy frame() that writes code 5 unconditionally. It is
   uncalled today; if anything ever calls it, the law breaks silently.
   --------------------------------------------------------------------------- */
{
  const src = rd('engine/bohemia_suburb.js');
  const calls = (src.match(/\bframe\s*\(/g) || []).length;
  const defs = (src.match(/function\s+frame\s*\(/g) || []).length;
  ok('the legacy frame() gate-stamper is still uncalled', calls === defs);
  ok('the only entrance writer is punchGate',
    (src.match(/=\s*APERTURE/g) || []).length === 2);
  /* NOT A TEXT MATCH. This assertion started life as a regex for
     `district: cell.district` in bohemia_world.js, and when the argument was
     deliberately deleted the gate stayed GREEN at 84/84 - because that exact
     string occurs five times in that file and the regex found one of the other
     four. A gate that greps for the fix instead of measuring it is the same
     false green this lane already shipped once on 7/31 (a facing check that
     called the helper instead of reading the render).
     So: BUILD THE REAL WORLD, take a real cell of each kind, and look at the
     plot the game would actually hand a renderer. */
  const W = require(path.join(ROOT, 'engine/bohemia_world.js'));
  const w = W.world(SEED);
  const find = want => {
    for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
      const c = w.at(x, y);
      if (c && c.district === want) { const p = w.plot(x, y); if (p && p.block && p.block.grid) return { x, y, b: p.block }; }
    }
    return null;
  };
  const gridEdgeCodes = b => {
    const g = b.grid, H = b.H, Wd = b.W, out = [];
    for (let x = 0; x < Wd; x++) { out.push(g[0][x]); out.push(g[H - 1][x]); }
    for (let y = 1; y < H - 1; y++) { out.push(g[y][0]); out.push(g[y][Wd - 1]); }
    return out;
  };
  const plain = find('suburb'), rich = find('gated') || find('estate');
  ok('the real world yields an ordinary suburb plot to look at', !!plain);
  ok('the real world yields a gated plot to look at', !!rich);
  if (plain) ok('IN THE REAL WORLD an ordinary suburb has NO gate on its perimeter',
    countOf(gridEdgeCodes(plain.b), GATE) === 0);
  if (rich) ok('IN THE REAL WORLD a gated community DOES have one',
    countOf(gridEdgeCodes(rich.b), GATE) > 0);
  ok('the dossier records the rule (DISTRICT DOSSIER LAW)',
    /GATED IS RICH/.test(src) && /30\.64\.020/.test(src));
}

console.log('\n=== GATED IS RICH GATE: ' + pass + ' passed, ' + fail + ' failed ===');
console.log("    Paolo's bank, 7/14: walled is code, gated is money.");
if (fail) process.exit(1);

#!/usr/bin/env node
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* THE STREET CONTRACT GATE (8/26/26, WORLD lane) — STREETS SNAP LIKE LEGO OR THEY DO NOT SHIP.
 *
 * Paolo 8/25, PLAYTEST DISPATCH item 4, LOCKED:
 *   "IM SICK OF PLAYING THIS RUN AND NONE OF THE STREETS CONNECT EVER! YOU NEED A FUCKING
 *    STANDARD AWESOME WAY TO MAKE SURE IF ITS A STREET. IT WILL CONNECT ART WISE AND
 *    PATHWISE TO OTHER STREETS ... LIKE CONSISTENT PUZZLE PIECES AND LEGO BLOCKS"
 * laws/BOHEMIA_ADDENDUM_THE_PLAYTEST_DISPATCH_8_25_26.md turns that into the standard:
 * every street piece declares its connectors on all four edges, a piece may only sit where
 * every touching edge AGREES, and art and walkable path are the SAME contract. It ends
 * "it gets a gate that sweeps every placed street in the valley and fails on a single
 * mismatched edge." This is that gate.
 *
 * ── THE ONE DESIGN DECISION IN HERE, AND IT IS THE WHOLE THING ───────────────────────
 * A DECLARATION THAT IS NOT MEASURED OFF THE ART IS A SECOND SYSTEM, AND TWO SYSTEMS
 * DRIFT. The obvious way to build this is a table: arterial declares lanes:6, offset:0,
 * walk:6. That table would have been GREEN all day on 8/25 while the valley was in the
 * state Paolo played. So the connector is DERIVED FROM THE BUILT GRID, every run: the
 * gate reads the actual row of tiles along the actual edge of the actual generated cell
 * and works out where the road is from the tiles themselves. Art and path cannot drift
 * from the contract because the art IS the contract. That is also why the mutation test
 * below moves PIXELS rather than a number.
 *
 * ── WHAT A CONNECTOR IS ─────────────────────────────────────────────────────────────
 * Along one edge of one cell (FN tiles), classified through the cell's own legend:
 *   CORRIDOR  lo..hi   the outermost drivable tiles — drive, marking, gate — which is the
 *                      kit's own definition (driveMask + driveConductors), not a new one.
 *                      Everything between them is inside the street: medians, gutters,
 *                      dead cars, wrecks. An island in the middle of a road does not
 *                      change where the road IS, and neither does a burnt-out semi.
 *   WALK      present  a body can leave this edge on foot.
 * Two touching edges AGREE when their corridors are the same tiles. Off by one is red.
 *
 * ── WHAT IT FOUND, AND WHAT IT COST TO FIND ─────────────────────────────────────────
 * MEASURED on the valley before any of this turn's fixes: 4,497 road-to-road seams,
 * 1,405 of them broken (31.2%). Three causes, all of them structural, none of them
 * visible from reading any single file:
 *
 *  1. EVERY ARTERIAL IN THE VALLEY WAS BUILT NORTH-SOUTH. The registration forced
 *     `o.links = ['N','S']`, axis included. 921 cells (26% of every road cell) ran across
 *     the way the world connects them; the worst seam had an arterial's SIDEWALK MARGIN
 *     butted against the next arterial's CARRIAGEWAY for 93 of 128 rows.
 *  2. AN ARTERIAL CROSSING AN ARTERIAL WAS NOT A CROSSING. kitRoadLegs threw away any
 *     road neighbour with the same district name — "my own other half is not a cross
 *     street" — which is true of a road that runs the same way I do and false of one that
 *     runs across me. Both are called `arterial`. So the crossing arms were never built:
 *     564 seams where the north-south street ran to the edge of the east-west street's
 *     cell and stopped in bare dirt 15 m short of the roadway.
 *  3. THE CURB RAMP ATE THE CROSSING STREET. The ramp is drawn out from the corner across
 *     the full parkway and walk — twenty tiles — and it was allowed to overwrite asphalt,
 *     so at the far end of that run it landed on the PERPENDICULAR street's carriageway
 *     right at the cell boundary and took two tiles off each side of it. 1,138 seams: the
 *     largest single class, and the last one left standing after the other two were fixed.
 *
 * All three are fixed and this gate holds all three shut. THE LESSON WORTH KEEPING is
 * about the instrument, again: the first metric counted any change in solidity across a
 * seam (which flags every legitimate wall), the second demanded a road continue across
 * its own FLANK (which is nonsense), the third filtered on a "declared connector" flag
 * that turned out to mean "a road neighbour exists" and therefore filtered nothing — it
 * returned exactly the unfiltered count, which is the signature of a filter that is not
 * filtering. A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE
 * INSTRUMENT COULD HAVE SEEN A POSITIVE ONE. Hence the mutation test.
 *
 * ── WHAT IT DELIBERATELY DOES NOT ASSERT ────────────────────────────────────────────
 * That a FREEWAY matches an ARTERIAL. It does not and it should not: a freeway is not an
 * arterial and the place they meet is an interchange, which is its own district type. The
 * seams between different road classes are counted, named and ratcheted (CROSS_CLASS_DEBT
 * below) so nothing hides in them, and they are the next piece of work, not a pass.
 *
 *   node gates/street_contract_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}
function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* THE CROSS-CLASS ALLOWANCE. Two different road classes meeting genuinely do not share a
   cross-section, and the honest answer for most of these is a piece that does not exist
   yet (a frontage road where an arterial dies on a freeway flank; a level crossing where
   a street meets rail). They are counted so the number can only ever go DOWN. Measured
   8/26 after the three fixes above: 270.
   RATCHETED 8/27: 270 -> 166 when the bridge deck started counting as corridor, then
   166 -> 129 when the LEVEL CROSSING stopped inventing its own road width. The rail
   module carried `var PAVE = 21, CURB = 23` under a comment that said, verbatim, "the
   grade crossing borrows the arterial's own cross-section" -- it borrowed nothing, those
   were the arterial's numbers on the day somebody typed them, and the arterial moved to
   17/19 on 8/26. A street 35 tiles wide ran up to the railway, crossed on a 43-tile
   crossing and came off 35 wide again. It reads ART.PAVE_HALF now. 37 seams, and the
   FIFTH time this month a constant moved and its dependent stayed behind. */
const CROSS_CLASS_DEBT = 129;

/* AND THE TWO SAME-CLASS CAUSES STILL STANDING, EACH NAMED AND EACH COUNTED. Paolo's
   wording is "fails on a single mismatched edge", and that is exactly what ARTERIAL --
   3,300 of the valley's 4,234 same-class seams, and the road he actually walks -- is
   held to: zero, no allowance, any family not listed here must be zero. The two below
   are real and structural, they are written down instead of hidden, and the ceiling can
   only ever come down:
     interchange 3 -- a stack is a BLOB drawn in valley coordinates across a cluster of
       cells, and three of its internal seams land one tile out. An off-by-one in a blob's
       coordinate mapping, not in the street contract.
     strip       4 -- Las Vegas Boulevard runs TWO CELLS ABREAST, and a boulevard's
       junction box is wider than a cell, so at a crossing the box reaches the far edge of
       the cell and meets the sibling half's plain margin. The Strip needs a two-cell-wide
       crossing piece; it does not have one. */
const SAME_CLASS_DEBT = {
  interchange: 3,
  strip: 4,
  /* FREEWAY, 40, AND IT IS A MAP FACT RATHER THAN A PIECE FACT (8/27). These are NOT new
     breaks -- they are newly VISIBLE ones. Until today this contract did not count a
     bridge deck as corridor, so an arterial crossing a freeway on an overpass read as a
     street that simply ended, and 196 seams were mis-filed as arterial-to-freeway breaks.
     Counting the deck closed all 196 and revealed what was underneath: 40 seams where one
     freeway carriageway carries a deck 35 tiles wide and the carriageway beside it carries
     none.
     THE CAUSE IS UPSTREAM OF ANY GENERATOR. Sampled: freeway(13,13) has streets N/S with
     cross E+W, and freeway(14,13) beside it has streets E/W with cross S -- two freeway
     cells running PERPENDICULAR TO EACH OTHER and meeting. That is a freeway-on-freeway
     crossing, and this valley has a district for exactly that: `interchange`. Where the
     overmap laid two interstates across each other without marking the junction, no piece
     can make the seam agree, because the two cells are honestly building two different
     roads. MAP LAW (Paolo): Claude never designs map layouts, plumbing only. So it is
     counted, named, and left for a ruling rather than papered over with a special case.
     Two things were fixed on the way here and both stay fixed: the deck was 23 tiles wide
     carrying a 35-tile road (a literal that stopped tracking when the arterial moved), and
     the deck axis was taken from the freeway's FAMILY neighbours instead of the axis it
     runs on, so corner and tied cells chose no axis and built no bridge at all. */
  freeway: 40
};

(async () => {
  console.log('THE STREET CONTRACT — every seam in the valley, measured off the tiles\n');
  let browser;
  try {
    const { chromium } = requirePlaywright();
    browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + path.join(ROOT, PAGE));
    await SETTLE(p, 4000);
    await p.evaluate(() => { try { cardHide(); } catch (e) {} });

    /* THE SWEEP LIVES ON THE PAGE so the mutation test can re-run the identical code
       against a mutated world without a second definition of anything. */
    await p.evaluate(() => {
      window.__CONTRACT = function () {
        const N = om.n;
        function connector(tx, ty, edge) {
          let m; try { m = tileMeta(tx, ty); } catch (e) { return null; }
          const g = m.kit; if (!g) return null;
          const L = deadLegendFor(m); if (!L) return null;
          let lo = -1, hi = -1, walk = false;
          for (let i = 0; i < FN; i++) {
            const lx = edge === 'W' ? 0 : edge === 'E' ? FN - 1 : i;
            const ly = edge === 'N' ? 0 : edge === 'S' ? FN - 1 : i;
            const e = L[g[ly * FN + lx]]; if (!e) continue;
            const k = e.kind;
            /* AND A BRIDGE DECK IS THE STREET CONTINUING (8/27). An arterial crossing a
               freeway does not stop at the freeway -- it rides over on a deck, and a car
               drives along that deck. The deck's tiles are kind `overhead`, which this
               profile did not count, so every one of those crossings read as a street that
               simply ended: 97 seams of ONE_SIDE plus 99 of OFFSET, 196 of the 270 breaks
               left in the valley. The kit already treats an overhead as a drive CONDUCTOR
               for exactly this reason; the contract was the one place that did not. */
            const over = BohemiaDistrictKit.tileLayer(e).layer === 'overhead';
            if (k === 'drive' || k === 'marking' || k === 'gate' || over) { if (lo < 0) lo = i; hi = i; }
            else if (k === 'walk') walk = true;
          }
          return { lo: lo, hi: hi, walk: walk, d: m.d };
        }
        /* WHICH PIECES ARE THE SAME KIND OF BRICK. A run and its own crossing are one
           class -- that is the whole point of them snapping -- and the freeway family
           already has a name in the world model. */
        function fam(d) {
          if (d === 'arterial' || d === 'arterial_x') return 'arterial';
          if (d === 'freeway' || d === 'beltway') return 'freeway';
          return d;
        }
        const out = { seams: 0, sameClass: 0, sameBroken: 0, crossClass: 0, crossBroken: 0,
                      byClass: {}, worst: [], noGrid: 0, famSeams: {}, famBroken: {} };
        for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty); if (!t || !RD[t.district]) continue;
          for (const step of [['S', 0, 1, 'N'], ['E', 1, 0, 'W']]) {
            const edge = step[0], dx = step[1], dy = step[2], opp = step[3];
            const u = om.at(tx + dx, ty + dy); if (!u || !RD[u.district]) continue;
            const A = connector(tx, ty, edge), B = connector(tx + dx, ty + dy, opp);
            if (!A || !B) { out.noGrid++; continue; }
            out.seams++;
            const same = fam(A.d) === fam(B.d);
            let verdict = 'OK';
            if (A.lo < 0 && B.lo < 0) verdict = 'NO_STREET';          // nothing runs here
            else if (A.lo < 0 || B.lo < 0) verdict = 'ONE_SIDE';      // a road stops dead
            else if (A.lo !== B.lo || A.hi !== B.hi) verdict = 'OFFSET';
            const broken = (verdict === 'ONE_SIDE' || verdict === 'OFFSET');
            if (same) {
              out.sameClass++;
              const f = fam(A.d);
              out.famSeams[f] = (out.famSeams[f] || 0) + 1;
              if (broken) { out.sameBroken++; out.famBroken[f] = (out.famBroken[f] || 0) + 1; }
            }
            else { out.crossClass++; if (broken) out.crossBroken++; }
            if (broken) {
              const key = verdict + ' ' + A.d + '|' + edge + '|' + B.d;
              out.byClass[key] = (out.byClass[key] || 0) + 1;
              if (same && out.worst.length < 12)
                out.worst.push(A.d + '(' + tx + ',' + ty + ') -' + edge + '-> ' + B.d +
                               '  ' + A.lo + '..' + A.hi + ' vs ' + B.lo + '..' + B.hi);
            }
          }
        }
        return out;
      };
    });

    const R = await p.evaluate(() => window.__CONTRACT());
    console.log('       ' + R.seams + ' road-to-road seams in the valley: ' +
                R.sameClass + ' between pieces of the same class, ' +
                R.crossClass + ' where two different road classes meet.');
    if (R.worst.length) { console.log('       same-class breaks:'); R.worst.forEach(w => console.log('         ' + w)); }
    const named = Object.keys(R.byClass).sort().map(k => k + ':' + R.byClass[k]).join('  ');
    if (named) console.log('       ' + named);

    ok('the sweep actually reached the valley — thousands of real seams, not a fixture ' +
       '(' + R.seams + ' seams, ' + R.noGrid + ' cells with no grid)',
       R.seams > 3000 && R.noGrid === 0);

    /* THE RULING, IN ONE LINE, PER FAMILY OF BRICK. */
    const fams = Object.keys(R.famSeams).sort();
    console.log('       ' + fams.map(f => f + ' ' + (R.famBroken[f] || 0) + '/' + R.famSeams[f]).join('   '));
    for (const f of fams) {
      const bad = R.famBroken[f] || 0, ceil = SAME_CLASS_DEBT[f] || 0;
      ok((ceil === 0
          ? 'EVERY ' + f.toUpperCase() + ' SEAM AGREES TILE FOR TILE — the corridor starts ' +
            'and ends on the same row on both sides of every ' + f + '-to-' + f + ' join in ' +
            'the valley, and a single mismatched edge fails this'
          : f.toUpperCase() + ' holds at its written-down ceiling and only ever comes down ' +
            '(see SAME_CLASS_DEBT for what the ' + ceil + ' are)') +
         ' (' + bad + ' of ' + R.famSeams[f] + ', ceiling ' + ceil + ')',
         bad <= ceil);
      if (bad < ceil) console.log('       RATCHET: ' + f + ' is down to ' + bad + '; lower SAME_CLASS_DEBT.' + f + '.');
    }
    ok('and no road family appears that nobody has ruled on — a new street type cannot ' +
       'arrive with a silent allowance',
       fams.every(f => SAME_CLASS_DEBT[f] === undefined || SAME_CLASS_DEBT[f] > 0));

    ok('where two DIFFERENT road classes meet the count is written down and only goes ' +
       'down — nothing hides in the gap between a freeway and a street ' +
       '(' + R.crossBroken + ' of ' + R.crossClass + ', ceiling ' + CROSS_CLASS_DEBT + ')',
       R.crossBroken <= CROSS_CLASS_DEBT);

    if (R.crossBroken < CROSS_CLASS_DEBT)
      console.log('       RATCHET: cross-class breaks are down to ' + R.crossBroken +
                  '; lower CROSS_CLASS_DEBT to that number.');

    /* ── WALK A STRAIGHT LINE ACROSS THREE DISTRICTS ────────────────────────────────
       His acceptance criterion in his own words, on the surface he plays. Not the
       connector maths again: the actual tiles under the actual player, from one end of a
       three-cell run of street to the other, through both cell boundaries. */
    const walk = await p.evaluate(() => {
      const N = om.n;
      function ax(tx, ty) { const t = om.at(tx, ty); return t && RD[t.district] ? roadAxis(t.district, tx, ty) : null; }
      // find the longest east-west run of arterial cells, then walk its centreline
      let best = null;
      for (let ty = 0; ty < N; ty++) {
        let run = [];
        for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty);
          if (t && t.district === 'arterial' && ax(tx, ty) === 'ew') run.push(tx);
          else { if (run.length >= 3 && (!best || run.length > best.cells.length)) best = { ty: ty, cells: run.slice() }; run = []; }
        }
        if (run.length >= 3 && (!best || run.length > best.cells.length)) best = { ty: ty, cells: run.slice() };
      }
      if (!best) return { found: false };
      const use = best.cells.slice(0, 3);
      const gy = best.ty * FN + (FN >> 1) - 8;         // one lane off the median, in traffic
      const x0 = use[0] * FN, x1 = (use[2] + 1) * FN - 1;
      let steps = 0, dead = [], nonwalk = 0;
      for (let gx = x0; gx <= x1; gx++) {
        steps++;
        const c = cellAt(gx, gy);
        if (!c || !c.walk) { nonwalk++; if (dead.length < 8) dead.push(gx + ',' + gy); }
      }
      // and the same walk down the sidewalk, out at the edge of the corridor
      const wy = best.ty * FN + 3;
      let wsteps = 0, wdead = [];
      for (let gx = x0; gx <= x1; gx++) {
        wsteps++;
        const c = cellAt(gx, wy);
        if (!c || !c.walk) { if (wdead.length < 8) wdead.push(gx + ',' + wy); }
      }
      return { found: true, ty: best.ty, cells: use, steps: steps, nonwalk: nonwalk,
               dead: dead, wsteps: wsteps, wdead: wdead.length, wsample: wdead };
    });

    ok('there IS a three-cell straight run of street in the valley to walk',
       walk.found && walk.cells.length === 3);
    if (walk.found) {
      console.log('       walking east along row ' + walk.ty + ', cells ' + walk.cells.join(' -> ') +
                  ' = ' + walk.steps + ' tiles (' + Math.round(walk.steps * 0.75) + ' m), crossing two cell boundaries');
      ok('HE CAN WALK A STRAIGHT LINE ACROSS THREE DISTRICTS WITHOUT THE STREET BREAKING ' +
         '— every one of the ' + walk.steps + ' tiles down the traffic lane is ground he ' +
         'can stand on (' + walk.nonwalk + ' broken' +
         (walk.dead.length ? ' at ' + walk.dead.join(' ') : '') + ')',
         walk.nonwalk === 0);
      ok('and the same walk down the SIDEWALK holds too — art and path are one contract, ' +
         'so the pedestrian side cannot pass while the roadway fails or the other way round ' +
         '(' + walk.wdead + ' of ' + walk.wsteps + ' broken' +
         (walk.wsample.length ? ' at ' + walk.wsample.join(' ') : '') + ')',
         walk.wdead === 0);
    }

    /* ── THE SIDEWALK IS ONE SIDEWALK ───────────────────────────────────────────────
       Paolo 8/26, LOCKED: "all the sidewalks should be connected altogether unless
       there's a crazy explosion or something's wrong. Most of the time the streets and
       the sidewalk should be in harmony all the way."
       That is a claim about a WALK, not about a seam, so it is tested as a walk: pick the
       longest straight run of street in the valley and walk BOTH pavements from one end to
       the other, asking the page itself whether each tile is ground he can stand on.
       WHAT IT CAUGHT ON ITS FIRST RUN, over 5,376 tiles / 4 km: the sidewalk broke
       FOURTEEN times. Two causes, both invisible to a per-cell check:
         - THE BUS STOP. Seven tiles of pavement, twice a cell, that a body could not
           cross -- on a tile whose legend says solid:false. The walked surface's
           `structure` branch set walk=false flat and never read the flag, exactly as its
           `prop` and `ground` branches did until 8/18. Six tiles in the whole game declare
           a standable structure and all six were being discarded.
         - THE CROSSING STREET'S FURNITURE. At a corner the band is the MINIMUM over both
           axes, so a tile 20-25 off the north-south centreline is PARKWAY -- and also sits
           on the east-west road's SIDEWALK. Dead palms and dead cars were being planted
           there, sealing a pavement the other road never put anything on. */
    const sw = await p.evaluate(() => {
      const N = om.n;
      let best = null;
      for (let ty = 0; ty < N; ty++) {
        let run = [];
        for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty);
          if (t && t.district === 'arterial' && roadAxis('arterial', tx, ty) === 'ew') run.push(tx);
          else { if (run.length >= 4 && (!best || run.length > best.cells.length)) best = { ty: ty, cells: run.slice() }; run = []; }
        }
        if (run.length >= 4 && (!best || run.length > best.cells.length)) best = { ty: ty, cells: run.slice() };
      }
      if (!best) return { found: false };
      const cells = best.cells;
      const x0 = cells[0] * FN, x1 = (cells[cells.length - 1] + 1) * FN - 1;
      const out = { found: true, cells: cells.length, sides: {} };
      for (const off of [-27, 27]) {
        const gy = best.ty * FN + (FN >> 1) + off;
        let steps = 0, dead = 0, cur = 0, longest = 0, first = [];
        for (let gx = x0; gx <= x1; gx++) {
          steps++;
          const c = cellAt(gx, gy);
          if (c && c.walk) { cur++; if (cur > longest) longest = cur; }
          else {
            dead++; cur = 0;
            if (first.length < 5) {
              const tx = (gx / FN) | 0, ty = (gy / FN) | 0;
              let nm = '?';
              try { const m = tileMeta(tx, ty), L = deadLegendFor(m);
                    const e = L[m.kit[(gy - ty * FN) * FN + (gx - tx * FN)]];
                    nm = (e && e.name) || '?'; } catch (_e) {}
              first.push(nm);
            }
          }
        }
        out.sides[off < 0 ? 'north' : 'south'] = { steps: steps, dead: dead, longest: longest, first: first };
      }
      return out;
    });
    ok('there is a long straight street in the valley to walk the pavement of', sw.found);
    if (sw.found) {
      const n = sw.sides.north, s = sw.sides.south;
      console.log('       ' + sw.cells + ' cells, ' + n.steps + ' tiles (' +
                  Math.round(n.steps * 0.75) + ' m) of pavement each side');
      ok('THE SIDEWALK IS IN HARMONY ALL THE WAY — both pavements of a ' +
         Math.round(n.steps * 0.75) + ' m street are ONE unbroken piece, end to end, ' +
         'measured on the surface he walks (north ' + n.dead + ' blocked, south ' +
         s.dead + ' blocked' +
         (n.first.length || s.first.length ? '; blockers: ' + n.first.concat(s.first).join(', ') : '') + ')',
         n.dead === 0 && s.dead === 0);
      ok('and the walk really was measured, not skipped — the longest unbroken piece is ' +
         'the whole street (' + n.longest + '/' + n.steps + ')',
         n.longest === n.steps && s.longest === s.steps);
    }

    /* ── THE MUTATION TEST ──────────────────────────────────────────────────────────
       "nudge one piece's lane offset by one pixel -> red". Everything above could be
       true of a checker that cannot see. So: shift the arterial generator's whole output
       one tile sideways, throw both caches away so the valley rebuilds, and re-run the
       IDENTICAL sweep. If the same-class count does not go red, this gate proves nothing
       and should be deleted rather than trusted. */
    const mutated = await p.evaluate(() => {
      const spec = BohemiaDistrictKit.get('arterial');
      if (!spec) return { ran: false };
      const orig = spec.generate;
      spec.generate = function (seed, o) {
        const res = orig.call(this, seed, o);
        if (res && res.g) for (let y = 0; y < res.g.length; y++) { res.g[y].unshift(res.g[y][0]); res.g[y].pop(); }
        return res;                                    // one tile east. one.
      };
      try { metaCache.clear(); __kitCache.clear(); } catch (e) {}
      const after = window.__CONTRACT();
      spec.generate = orig;
      try { metaCache.clear(); __kitCache.clear(); } catch (e) {}
      return { ran: true, sameBroken: after.sameBroken, sameClass: after.sameClass };
    });
    ok('THE MUTATION TEST: nudge one street piece one tile sideways and this gate goes ' +
       'red — it is measuring the tiles, not agreeing with itself ' +
       '(' + (mutated.ran ? mutated.sameBroken + ' of ' + mutated.sameClass + ' broken under mutation' : 'did not run') + ')',
       mutated.ran && mutated.sameBroken > 100);

    /* and the world is put back, so nothing downstream inherits a mutated valley */
    const restored = await p.evaluate(() => window.__CONTRACT().sameBroken);
    ok('and the mutation is undone — the page is left exactly as it was found ' +
       '(' + restored + ' broken after restore)', restored === R.sameBroken);

    ok('the page threw nothing while all of this ran', errs.length === 0);
    if (errs.length) errs.slice(0, 3).forEach(e => console.log('       ' + e.slice(0, 160)));
  } catch (e) {
    fail++; console.log('  FAIL harness: ' + (e && e.message ? e.message : String(e)));
  } finally { if (browser) await browser.close(); }

  console.log('\n' + (fail ? 'FAIL' : 'PASS') + '  ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

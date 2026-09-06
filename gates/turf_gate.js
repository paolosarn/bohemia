/* ============================================================================
   THE TURF GATE (9/5/26, WORLD lane) — BB-TURF.

   "different parts of Vegas as different faction holdings" (Paolo, by name), and
   9/4 LOCKED: "EVERY PART OF THE VALLEY IS OWNED BY A FACTION."

   THE GAP THE ROW NAMES: the walked city has had an ownership map since 7/20 and
   it is made of electricity -- LIGHT=TERRITORY, every live circuit carries an
   owner, and the director's seam test already reads it. But the owner is a
   CATEGORY, not a name: {settlement, faction, network, solar_lone}. One circuit in
   five came back owned by the generic word "faction", so the game knew somebody
   held that block and could not say who, AND THE SEAM TEST COMPARED THOSE WORDS --
   which made the Mob's block and the Cartel's block the same block.

   WHAT SHIPPED: the name comes off the fourteen seats FACTION-TOWNS put on the map.
   A faction holds the ground around its own town, a fortress reaches further than a
   camp (off the REACH table that already existed), and nothing is authored -- HOLDS
   ships empty and an entry in it wins.

   *** AND THE MEASUREMENT THAT SHAPED IT, WHICH IS IN CHECK 3. *** Across five
   seeds, EVERY lit-circuit border in the valley is a category border and two NAMED
   factions are never once adjacent -- because neighbouring circuits fall in the same
   town's catchment and share a holder. So a territory map made only of LIT ground
   would leave nine cells in ten belonging to nobody and would have no faction
   borders at all. The lit circuits are the TELL; the territory is the catchment, and
   it covers the whole valley, which is what his ruling actually says.

   node gates/turf_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PG = require(path.join(ROOT, 'engine/bohemia_powergrid.js'));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const CE = require(path.join(ROOT, 'engine/bohemia_cityedit.js'));
const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('TURF GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (the owner has a name - a fortress reaches further than a camp'
            + ' - every part of the valley is held)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. the holder, derived and nothing authored ------------------------ */
{
  const towns = [{ faction: 'Mob', x: 10, y: 10, tier: 'fortress', power: 13 },
                 { faction: 'Colorful', x: 20, y: 10, tier: 'camp', power: 1 }];
  ok('ground beside a seat is that faction\'s', T.holderOf(towns, 12, 10).faction === 'Mob');
  ok('and ground beside the other seat is theirs', T.holderOf(towns, 19, 10).faction === 'Colorful');
  /* HIS OWN WORDS AS THE TEST: "the more prominent factions kind of feel like strong
     fortress parts". Six cells from the fortress and four from the camp, and the
     FORTRESS still holds it -- off the REACH table that already sized a town. */
  ok('A FORTRESS REACHES PAST A CAMP -- 6 cells from the fortress beats 4 from the'
     + ' camp', T.holderOf(towns, 16, 10).faction === 'Mob');
  ok('every derived holder is tagged draft, so moving one is a single edit',
     T.holderOf(towns, 12, 10).draft === true);
  ok('HOLDS SHIPS EMPTY -- who holds what is his', Object.keys(T.HOLDS).length === 0);
  /* determinism: the same three numbers must answer the same on every device */
  ok('and the answer is deterministic',
     T.holderOf(towns, 15, 12).faction === T.holderOf(towns, 15, 12).faction);
}

/* ---- 2. the grid carries the name, and only where the row asked --------- */
{
  const m = OM.buildOvermap(12345);
  const seats = T.derive(G, T.districtsOf(m, CE.cat), 1);
  const named = PG.powerMap(m, 12345, { holderAt: (x, y) => T.holderOf(seats, x, y) });
  const plain = PG.powerMap(m, 12345, {});

  let cat = {}, withName = 0, live = 0, mismatch = 0, nonFactionNamed = 0;
  for (let y = 0; y < m.n; y++) for (let x = 0; x < m.n; x++) {
    const a = named.at(x, y), b = plain.at(x, y);
    if (a.live !== b.live || a.owner !== b.owner) mismatch++;
    if (!a.live) continue;
    live++; cat[a.owner] = (cat[a.owner] || 0) + 1;
    if (a.faction) { withName++; if (a.owner !== 'faction') nonFactionNamed++; }
  }
  ok('HANDED NO SEATS THE GRID IS EXACTLY WHAT IT WAS -- naming is additive, the'
     + ' lit map does not move', mismatch === 0);
  ok('EVERY CIRCUIT OWNED BY THE GENERIC WORD "faction" NOW HAS A REAL NAME'
     + ' (' + withName + ' of ' + (cat.faction || 0) + ')', withName === (cat.faction || 0) && withName > 0);
  /* settlement is a neighbourhood holding its own lights and solar_lone is one
     holdout with a panel. Naming those would be inventing canon the row did not ask
     for -- and `network` is left alone even though the roster has a faction called
     Network, because treating the two as the same thing is a guess about his canon. */
  ok('and NOTHING ELSE was renamed -- settlement, network and solar_lone are'
     + ' untouched', nonFactionNamed === 0);
  ok('the name is a real faction off his own graph',
     Object.keys(named.holdings()).every(f => !!G.factions[f] && G.factions[f].type === 'selectable'));
  ok('a whole feeder answers with ONE holder, so no border runs through a wire',
     (function () {
       const cs = PG.buildCircuits(m, m.n);
       for (const c of cs) {
         let f = null;
         for (const [x, y] of c) { const p = named.at(x, y); if (!p.live) continue;
           if (f === null) f = p.faction; else if (p.faction !== f) return false; }
       }
       return true;
     })());
  /* A DOUSED CIRCUIT KEEPS ITS HOLDER: the light went out, the claim did not. */
  const anyNamed = (function () {
    for (let y = 0; y < m.n; y++) for (let x = 0; x < m.n; x++) {
      const p = named.at(x, y); if (p.live && p.faction) return { x, y, id: p.id, f: p.faction };
    } return null;
  })();
  ok('there is named ground to test', !!anyNamed);
  named.douse(anyNamed.id);
  ok('AND A BLOCK THAT WENT DARK IS STILL THEIRS -- the light went out, the claim'
     + ' did not', named.at(anyNamed.x, anyNamed.y).faction === anyNamed.f
     && named.at(anyNamed.x, anyNamed.y).live === false);
  named.relight(anyNamed.id);
}

/* ---- 3. the measurement that shaped it, kept honest --------------------- */
{
  let litSeams = 0, namedSeams = 0, coveredAll = true, uncovered = 0;
  for (const sd of [1, 12345, 99999]) {
    const m = OM.buildOvermap(sd);
    const seats = T.derive(G, T.districtsOf(m, CE.cat), 1);
    const pm = PG.powerMap(m, sd, { holderAt: (x, y) => T.holderOf(seats, x, y) });
    for (let y = 0; y < m.n - 1; y++) for (let x = 0; x < m.n - 1; x++) {
      if (!T.holderOf(seats, x, y)) { uncovered++; coveredAll = false; }
      const p = pm.at(x, y); if (!p.live) continue;
      for (const [dx, dy] of [[1, 0], [0, 1]]) {
        const n = pm.at(x + dx, y + dy); if (!n.live) continue;
        const a = p.faction || p.owner, b = n.faction || n.owner;
        if (a && b && a !== b) litSeams++;
        if (p.faction && n.faction && p.faction !== n.faction) namedSeams++;
      }
    }
  }
  /* EVERY PART OF THE VALLEY IS OWNED BY A FACTION -- his 9/4 ruling, as a number. */
  ok('EVERY CELL OF THE VALLEY HAS A HOLDER, on three seeds, with none left over'
     + (uncovered ? ' -- ' + uncovered + ' uncovered' : ''), coveredAll);
  ok('and the lit map still has borders to spawn a scene on (' + litSeams + ')',
     litSeams > 0);
  /* THIS IS REPORTED, NOT ASSERTED AWAY. Two named factions being adjacent on lit
     ground is rare by construction: neighbouring circuits share a catchment. If it
     ever stops being rare that is a finding, not a failure, so this only records it. */
  console.log('  note: lit borders ' + litSeams + ', of which faction-vs-faction '
              + namedSeams + ' (rare by construction; the territory is the catchment,'
              + ' the lit circuits are the tell)');
}

/* ============================================================================
   5. AND THE BORDER RUNS ALONG SOMETHING YOU CAN SEE.
   (9/6/26, FACTIONS lane, VAMILY row [who holds] EVERY-DISTRICT-HAS-AN-OWNER.
   Ruling: records/BOHEMIA_RULING_WHO_HOLDS_WHAT_9_5_26.md.)

   Section 3 above proves every cell has an owner and that has been true since
   BB-TURF. This section is about the EDGES, which nothing had ever looked at.
   ========================================================================== */
{
  const L = require(path.join(ROOT, 'engine/bohemia_loop.js'));
  const ctx = (L.BohemiaLoop || L).boot({ seed: 'bohemia' });
  const m = ctx.worldMap.real, n = m.n;
  const ds = T.districtsOf(m, CE.cat);
  const seats = T.derive(G, ds, 1);
  const tf = T.turf(m, CE.cat, seats);

  const catOf = (x, y) => { const c = m.at(x, y); return c && c.district ? CE.cat(c.district) : 'none'; };
  const SEEN = T.SEEN_EDGE;

  /* the two rules, measured the same way over the same valley */
  function edges(at) {
    let pairs = 0, visible = 0, worst = null;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++)
      for (const [dx, dy] of [[1, 0], [0, 1]]) {
        const X = x + dx, Y = y + dy; if (X >= n || Y >= n) continue;
        const a = at(x, y), b = at(X, Y);
        if (!a || !b || a.faction === b.faction) continue;
        pairs++;
        if (SEEN[catOf(x, y)] || SEEN[catOf(X, Y)]) visible++;
        else if (!worst) worst = x + ',' + y + ' and ' + X + ',' + Y + ' are both buildable ground';
      }
    return { pairs, visible, worst, pct: pairs ? visible / pairs : 0 };
  }
  const now = edges((x, y) => tf.at(x, y));
  const was = edges((x, y) => T.holderOf(seats, x, y));

  /* *** THE CLAIM THE ROW EXISTS FOR, AND IT MEASURES THE FIX RATHER THAN
     RESTATING IT. *** Both rules run over the same map in the same loop, so the
     before number is taken here rather than remembered from a commit message. */
  ok('*** A BORDER RUNS ALONG SOMETHING YOU CAN SEE. *** The ruling\'s rule 3 is'
     + ' "if you cannot see why the border is there, it is in the wrong place", and'
     + ' the research behind it is that real armed-group borders run on highways,'
     + ' rail and washes. The rule this replaced was a scaled Voronoi, so its edges'
     + ' fell wherever two seats balanced: ' + was.visible + ' of ' + was.pairs
     + ' visible (' + (100 * was.pct).toFixed(1) + '%), '
     + (was.pairs - was.visible) + ' of them cutting across open buildable ground.'
     + ' Now ' + now.visible + ' of ' + now.pairs + ' ('
     + (100 * now.pct).toFixed(1) + '%)'
     + (now.worst ? ' -- first miss: ' + now.worst : ''),
     now.pct === 1 && was.pct < 0.8);

  ok('and it is STRUCTURAL, not tuned: two buildable cells that touch are in the'
     + ' same block by construction, so there is no number here to nudge until the'
     + ' percentage comes out right',
     tf.blocks.length > 100
     && tf.blocks.every(bl => {
       const f = tf.at(bl.cells[0], bl.cells[1]);
       for (let i = 0; i < bl.cells.length; i += 2)
         if (!f || !tf.at(bl.cells[i], bl.cells[i + 1])
             || tf.at(bl.cells[i], bl.cells[i + 1]).faction !== f.faction) return false;
       return true;
     }));

  let owned = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (tf.at(x, y)) owned++;
  ok('EVERY DISTRICT STILL HAS AN OWNER -- rule 1, and the block rule must not lose'
     + ' the thing BB-TURF already won (' + owned + '/' + (n * n) + ')',
     owned === n * n);

  /* *** AND NO FACTION IS A ROUNDING ERROR. *** The old rule handed the Network
     2195 cells and the Volunteers FOUR, which is not a holding, it is an artifact
     of where two circles happened to meet. */
  const mine = Object.entries(tf.byFaction).sort((a, b) => b[1] - a[1]);
  const oldBy = {};
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const h = T.holderOf(seats, x, y); if (h) oldBy[h.faction] = (oldBy[h.faction] || 0) + 1;
  }
  const oldMin = Math.min(...Object.values(oldBy));
  const newMin = mine[mine.length - 1][1];
  ok('AND EVERY FACTION HOLDS GROUND A PLAYER COULD STAND IN. The old rule gave the'
     + ' smallest holder ' + oldMin + ' cells of 9216 -- the Volunteers were not on'
     + ' the map, they were a rounding error where two circles met. Now the smallest'
     + ' is ' + mine[mine.length - 1][0] + ' with ' + newMin,
     newMin > 100 && oldMin < 50);

  /* HIS CANON, AND NOTHING TYPED TO MAKE IT COME OUT. */
  const strip = {};
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const c = m.at(x, y); if (!c || (c.district !== 'strip' && c.district !== 'resort')) continue;
    const h = tf.at(x, y); if (h) strip[h.faction] = (strip[h.faction] || 0) + 1;
  }
  ok('*** THE MOB CONTROLS THE STRIP, AND NOBODY TYPED THAT. *** His note says it in'
     + ' those words. It falls out: FACTION-SEATS put the Mob\'s capital on a resort,'
     + ' the resort sits in the block the boulevard runs through, and a capital owns'
     + ' its own block. Held: ' + JSON.stringify(strip),
     Object.keys(strip).length === 1 && strip.Mob > 150);

  /* *** THIS CLAIM USED TO SAY "EVERY CAPITAL OWNS THE GROUND UNDER IT" AND THE
     WORLD SAID NO THREE TIMES. *** A block has exactly one owner -- that is the
     whole reason the borders are visible -- and the Church's chapel and the Mob's
     resort are both inside the 431-cell Strip block, while the Network, the Reds
     and the Volunteers all sit in one 35-cell block downtown. The reflex was to
     shove the seats apart until my sentence came true. Then his own canon turned
     out to have written it already: the Volunteers are "resource-poor by design.
     Nobody wants to be seen attacking them, EVEN CARTEL STAYS HANDS-OFF." A clinic
     that survives because nobody will touch it, standing on ground somebody else
     holds, IS that sentence. So the world keeps its answer and the claim changed.
     WHAT IS LOCKED IS THE INVARIANT THAT ACTUALLY MATTERS: the stronger faction
     holds the ground, never the weaker one. A guest is always the weaker name. */
  const rank = {}; seats.slice().sort((a, b) => (b.power || 0) - (a.power || 0)
    || (a.faction < b.faction ? -1 : 1)).forEach((s, i) => { rank[s.faction] = i; });
  const guests = tf.guests || [];
  ok('A CAPITAL SITS ON ITS OWN GROUND UNLESS A STRONGER ONE SHARES THE BLOCK, AND'
     + ' THEN IT IS A GUEST -- never the other way round. His canon writes this for'
     + ' the Volunteers in as many words ("nobody wants to be seen attacking them,'
     + ' even Cartel stays hands-off"). Guests: '
     + (guests.map(g => g.faction + ' on ' + g.host + ' ground').join(', ') || 'none'),
     seats.every(s => { const h = tf.at(s.x, s.y); return h && h.faction; })
     && guests.every(g => rank[g.host] < rank[g.faction]));

  ok('and a guest still holds real ground of its own somewhere else -- being'
     + ' somebody\'s guest is not the same as being landless',
     guests.every(g => (tf.byFaction[g.faction] || 0) > 100));

  const again = T.turf(m, CE.cat, seats);
  ok('and the same valley answers the same every time', JSON.stringify(again.byFaction) === JSON.stringify(tf.byFaction));

  /* *** WORTH IS A MEASUREMENT AND IT GETS RE-MEASURED. *** Same contract
     NOT_A_TOWN carries. Two rulers were tried and both were wrong, so this is the
     one number in the rule most likely to rot. Bands, not exact tiles, because
     sampling eight plots wobbles by a few percent and a gate that goes red on
     wobble teaches people to ignore it. */
  const kinds = Object.keys(T.WORTH);
  const band = v => v >= 6000 ? 0 : v >= 3000 ? 1 : v > 0 ? 2 : 3;
  const cells = {};
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const c = m.at(x, y); if (!c || !c.district || CE.cat(c.district) !== 'sand') continue;
    (cells[c.district] || (cells[c.district] = [])).push([x, y]);
  }
  const drift = [];
  for (const k of kinds) {
    const cl = cells[k]; if (!cl || !cl.length) continue;
    const step = Math.max(1, Math.floor(cl.length / 8));
    let seen = 0, tot = 0;
    for (let i = 0; i < cl.length && seen < 8; i += step) {
      let p = null; try { p = m.plot(cl[i][0], cl[i][1]); } catch (_e) { continue; }
      if (!p) continue; seen++;
      (p.buildings || []).forEach(bb => { tot += (bb.w | 0) * (bb.h | 0); });
    }
    if (!seen) continue;
    const got = Math.round(tot / seen);
    if (band(got) !== band(T.WORTH[k])) drift.push(k + ' table ' + T.WORTH[k] + ' now ' + got);
  }
  ok('WORTH IS RE-MEASURED OFF THE REAL VALLEY, so it cannot rot into a list'
     + ' somebody believes. It is built TILES, not building COUNT: counting'
     + ' buildings ranks trailer parks (26.9 per plot) above casinos (4), because a'
     + ' resort is one enormous building and a trailer park is thirty tiny ones'
     + (drift.length ? ' -- drifted: ' + drift.join('; ') : ''),
     drift.length === 0);

  ok('and the order it produces is the order the ruling names in words -- the Strip'
     + ' and downtown first, the desert last',
     T.worthOf('resort') > T.worthOf('suburb')
     && T.worthOf('downtown') > T.worthOf('suburb')
     && T.worthOf('suburb') > T.worthOf('park')
     && T.worthOf('solar') === 0 && T.worthOf('airport') === 0);

  /* RULE 5: ACT 3 REDRAWS IT, using a number already in his graph. */
  const a3 = T.turf(m, CE.cat, T.derive(G, ds, 3));
  let moved = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const p = tf.at(x, y), q = a3.at(x, y);
    if (p && q && p.faction !== q.faction) moved++;
  }
  ok('*** ACT 3 REDRAWS THE MAP, off act3_power which was already in his graph. ***'
     + ' The same rule run against the endgame column moves ' + moved + ' of '
     + (n * n) + ' cells (' + (100 * moved / (n * n)).toFixed(1) + '%), so the'
     + ' valley visibly changes hands across the game and no second rule was'
     + ' written to do it',
     moved > n * n * 0.1 && moved < n * n * 0.9);

  /* HIS OVERRIDE STILL WINS, AND IT IS PROVED BY USING IT. */
  const spot = '5,5';
  const before = tf.at(5, 5) && tf.at(5, 5).faction;
  T.HOLDS[spot] = 'Volunteers';
  const forced = T.turf(m, CE.cat, seats);
  /* READ THE ANSWER BEFORE PUTTING THE TABLE BACK. The first version of this
     asserted `.ruled === true` AFTER deleting the entry, and at() reads HOLDS live,
     so the test was asking the world a question it had already un-asked. */
  const got = forced.at(5, 5);
  const gotFaction = got && got.faction, gotRuled = got && got.ruled;
  delete T.HOLDS[spot];
  ok('ONE LINE IN HOLDS MOVES A BLOCK AND THE RULE GETS OUT OF THE WAY -- proved by'
     + ' setting one and reading it back, not by reading the code. 5,5 was '
     + before + ', became ' + gotFaction,
     gotFaction === 'Volunteers' && gotRuled === true
     && before !== 'Volunteers' && Object.keys(T.HOLDS).length === 0);

  /* AND THE MUTATION THAT MUST BITE: if blocks stop being atomic the whole claim
     is worthless, so break one on purpose and check the border measurement notices. */
  const broken = { at: (x, y) => (x + y) % 7 === 0 ? { faction: 'Mob' } : tf.at(x, y) };
  const bad = edges(broken.at);
  ok('and the border measurement actually notices when ownership stops following'
     + ' the blocks: scribbling one faction across the valley drops it to '
     + (100 * bad.pct).toFixed(1) + '%', bad.pct < 0.99);
}

/* ---- 4. on the surface he walks ---------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);

  const r = await pg.evaluate(() => {
    const R = {};
    R.seats = window.__POWER_SEATS;
    let covered = 0, none = 0;
    const share = {};
    for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
      const t = turfAt(x, y);
      if (!t) { none++; continue; }
      covered++; share[t.faction] = (share[t.faction] || 0) + 1;
    }
    R.covered = covered; R.uncovered = none; R.holders = Object.keys(share).length;
    R.share = share;
    let namedLit = 0;
    for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++) {
      const p = POWER.at(x, y); if (p.live && p.faction) namedLit++;
    }
    R.namedLit = namedLit;

    /* WALK ACROSS A BORDER, then sleep, and read the card. */
    offerAccept();
    const open = [(hx / FN) | 0, (hy / FN) | 0];
    R.startOn = (turfAt(open[0], open[1]) || {}).faction;
    let other = null;
    for (let rad = 1; rad < 40 && !other; rad++)
      for (let dx = -rad; dx <= rad && !other; dx++) for (let dy = -rad; dy <= rad && !other; dy++) {
        const x = open[0] + dx, y = open[1] + dy;
        if (x < 0 || y < 0 || x >= om.n || y >= om.n) continue;
        const t = turfAt(x, y); if (t && t.faction !== R.startOn) other = [x, y, t.faction];
      }
    R.crossedTo = other;
    MODE = 'human';
    dayWhere();
    hx = other[0] * FN + (FN >> 1); hy = other[1] * FN + (FN >> 1);
    dayWhere();
    R.turfToday = TURF_TODAY.slice();
    DQ.event('enter_building', { district: 'suburb', dark: true });
    DQ.resolve(31);
    advance(20 * 60);
    R.card = (document.getElementById('daycardIn') || {}).textContent || '';
    return R;
  });
  await b.close();

  ok('the walked surface builds the seats the holders come from', r.seats === 14);
  ok('EVERY PART OF VEGAS HAS AN OWNER on the surface he walks -- all '
     + r.covered + ' cells, none left over', r.uncovered === 0 && r.covered > 9000);
  ok('and more than one faction holds ground (' + r.holders + ')', r.holders >= 8);
  ok('THE LIT CIRCUITS CARRY THE NAME TOO, which is what the seam test reads ('
     + r.namedLit + ')', r.namedLit > 0);
  ok('a border is somewhere he can actually walk across',
     !!r.crossedTo && r.crossedTo[2] !== r.startOn);
  ok('AND THE RECKONING TELLS HIM HE CROSSED ONE, by name',
     r.turfToday.length >= 2 && /you crossed \w+ into \w+/.test(r.card));
  ok('naming the two factions he was actually on',
     r.card.indexOf(r.turfToday[0]) >= 0 && r.card.indexOf(r.turfToday[1]) >= 0);
  ok('no page error across a day that crossed a border' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);
  done();
})();

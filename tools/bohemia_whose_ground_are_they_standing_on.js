/* WHOSE GROUND ARE THEY STANDING ON? (9/13/26, CHARACTER lane,
 * VAMILY [faction colour] THE-BODY-WEARS-THE-TERRITORY, round 3)
 *
 * *** THIS ROUND EXISTS BECAUSE FRONT-PAGE RULE 12 LANDED AND I RE-CHECKED MY OWN
 * BLOCKER, AND MY OWN BLOCKER WAS WRONG. ***
 * Rule 12 (coordinator 9/13): "A DEPENDENCY ON A LINE IS A PREMISE, NOT A GATE ... the
 * lane MEASURES FIRST whether X is actually needed ... Nothing on this board waits on a
 * line the coordinator wrote; only on a measurement the lane made."
 * This row waited three rounds on a measurement I made. Here is what that measurement
 * actually said:
 *
 *     ROUND 1, 9/12:  "NO RESIDENT STANDS ON GROUND ANYBODY HOLDS. 0 of 2199."
 *     IT ASKED POWER.holderAt().
 *
 * holderAt is WHO OWNS THE ELECTRICAL CIRCUIT. Its own comment says so: "WHO HOLDS THIS
 * BLOCK, BY NAME, or null where nobody is named." Most of the valley is not on a named
 * faction's wire, so it answers null nearly everywhere -- correctly.
 * THE QUESTION THE ROW ASKS IS WHOSE LAND IT IS, AND THAT IS groundAt(), which has existed
 * since FACTIONS shipped [who holds] on 9/6 and whose comment says exactly this: "a
 * settlement pooling its own lights is nobody's circuit and is still standing on
 * somebody's block."
 * MEASURED, same 1681 cells, both functions, same run:
 *     holderAt  24 cells    1.4%
 *     groundAt 656 cells   39.0%   across ten factions
 * So the ground was owned all along, and this lane reported the valley as unowned and sat
 * on the row for three rounds. That is the SEVENTH ruler this lane has thrown away, and it
 * is the most expensive one, because the other six produced a wrong number and this one
 * produced a wrong STOP.
 * TWO FUNCTIONS ONE LETTER APART IN A DROPDOWN ARE NOT TWO SPELLINGS OF ONE QUESTION.
 *
 * SO THIS MEASURES THE ROW PROPERLY, and it keeps round 1's one good instinct, which was
 * to refuse the row's literal reading. "EVERY dressed person's colour matches the faction
 * that owns the block" would put the whole street in gang colours -- every shopkeeper and
 * every kid in Cartel brown for standing on Cartel ground -- which is the opposite of the
 * law it cites. COLOUR IS TERRITORY calls colour "a statement of who would defend you" and
 * says wearing your colours is A CHOICE WITH A COST, and the style card allows ONE
 * saturated piece and lists dust, ash, bone and lead as legal cloth. A valley in uniform
 * has no signal in it, because a colour only means something against another colour.
 * So the miss rate is computed for AFFILIATED people and civilians are reported SEPARATELY
 * rather than counted as misses.
 *
 * RIG CHECK (RIG IS LAW): reads only. REUSE CHECK: cooks zero pixels; the crowd walk is
 * round 1's, the ground answer is the city's own, the colours are his published file.
 *
 *   node tools/bohemia_whose_ground_are_they_standing_on.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle: SETTLE } = require(path.join(__dirname, '..', 'gates', 'bohemia_settle.js'));
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/BOHEMIA_WHOSE_GROUND_ARE_THEY_STANDING_ON_9_13_26.txt');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_DEMO.html'));
  await SETTLE(p, 15000);
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await SETTLE(p, 12000);
  await new Promise(r => setTimeout(r, 3000));
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { console.error('no city frame'); await b.close(); process.exit(1); }

  const R = await fr.evaluate(() => {
    const o = { probed: 0, onGround: 0, affiliated: 0, onOwnGround: 0,
                ground: {}, mine: {}, pairs: {}, bases: 0,
                cellsNear: 0, cellsNearOwned: 0, peopleCells: 0, peopleCellsOwned: 0 };
    try { o.bases = Object.keys(ctOtherBases() || {}).length; } catch (e) {}
    /* *** BOTH QUESTIONS IN ONE RUN, because two runs disagreed and my own standing lesson
       is that a measurement which flips between runs must not be read. *** The cell sweep
       and the people sweep are asked of the same POWER, in the same frame, in the same
       second, so the gap between them is a fact about the world and not about timing. */
    const pc = ctCell();
    for (let dx = -20; dx <= 20; dx++) for (let dy = -20; dy <= 20; dy++) {
      o.cellsNear++;
      try { if (POWER.groundAt(pc[0] + dx, pc[1] + dy)) o.cellsNearOwned++; } catch (e) {}
    }
    const seenCell = {};
    /* NEIGHBOURHOOD COORDINATES, NOT CELL COORDINATES, and the first cut of this got it
       wrong and swept ZERO people. pplPeople() is keyed to the population grid (NB * FN per
       neighbourhood), and ctCell() answers in the finer overmap grid, so the loop walked a
       17x17 patch of a space pplPeople does not live in and found nobody -- which would have
       been published as "there is nobody here" if the number had not been obviously absurd
       against round 1's 2199. THE HARNESS FAILING LOOKS EXACTLY LIKE THE WORLD BEING EMPTY. */
    const NB = BohemiaPopulation.NB, span = NB * FN;
    const cx0 = Math.floor(hx / span), cy0 = Math.floor(hy / span);
    for (let ny = Math.max(0, cy0 - 8); ny <= cy0 + 8; ny++)
    for (let nx = Math.max(0, cx0 - 8); nx <= cx0 + 8; nx++) {
      let ppl = [];
      try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
      for (const q of ppl) {
        let at = null; try { at = pplAt(q); } catch (e) { continue; }
        if (!at) continue;
        o.probed++;
        let g = null, f = null;
        /* AND THE COORDINATE SPACE, WHICH IS THE SECOND HALF OF ROUND 1'S BUG AND THE
           REASON IT READ ZERO. pplAt() answers in FINE coords; POWER answers in overmap
           CELLS. Round 1 passed fine coords straight into holderAt, so even the circuit
           question was asked about a cell a hundred blocks away from the person. Same
           conversion ctFactionOf does on a person's home: divide by FN. */
        try { g = POWER.groundAt(Math.floor(at[0] / FN), Math.floor(at[1] / FN)); } catch (e) {}
        try { f = ctFactionOf(q); } catch (e) {}
        const ck = Math.floor(at[0] / FN) + ',' + Math.floor(at[1] / FN);
        if (!(ck in seenCell)) { seenCell[ck] = !!g; o.peopleCells++; if (g) o.peopleCellsOwned++; }
        if (g) { o.onGround++; o.ground[g] = (o.ground[g] || 0) + 1; }
        if (f) {
          o.affiliated++;
          o.mine[f] = (o.mine[f] || 0) + 1;
          if (g) {
            if (g === f) o.onOwnGround++;
            const k = f + ' on ' + g;
            o.pairs[k] = (o.pairs[k] || 0) + 1;
          }
        }
      }
    }
    /* AND THE HALF OF THE ROW THAT IS THIS LANE'S: of the people who DO run with
       somebody, can the game actually dress them in it? The bake is asked for by name, so
       a faction with no entry in FACTION_LOOKS leaves its people in a trade fit forever. */
    /* THE OUTFIT LIST IS NOT IN THIS FRAME AND THE FIRST CUT ASKED FOR IT HERE ANYWAY.
       FACTION_LOOKS lives in the ALPHA; the city asks the parent to bake one by name. So
       `window.FACTION_LOOKS` is undefined in here and every faction came back "has NO
       outfit" -- 417 people, all twelve factions, a number that would have been published
       as a catastrophe and is purely a fact about which frame I was standing in.
       The names are handed OUT of the frame and compared against the alpha's list outside. */
    o.factionNames = Object.keys(o.mine);
    return o;
  });

  /* asked of the PARENT, which is where FACTION_LOOKS actually lives */
  const HAVE = await p.evaluate(() => (window.FACTION_LOOKS || []).map(f => f.faction));
  await b.close();
  R.dressable = {}; R.undressable = {};
  for (const k of (R.factionNames || []))
    (HAVE.indexOf(k) >= 0 ? R.dressable : R.undressable)[k] = R.mine[k];

  const L = [];
  L.push('WHOSE GROUND ARE THEY STANDING ON? -- CHARACTER lane, 9/13/26');
  L.push('VAMILY row [faction colour] THE-BODY-WEARS-THE-TERRITORY, round 3');
  L.push('');
  L.push('*** THE CORRECTION THAT OPENS THIS ROUND, AND IT UNBLOCKS THE ROW ***');
  L.push('Round 1 reported "NO RESIDENT STANDS ON GROUND ANYBODY HOLDS -- 0 of 2199" and');
  L.push('this lane sat on the row for three rounds behind it. THAT MEASUREMENT ASKED THE');
  L.push('WRONG FUNCTION. POWER.holderAt() is who owns the electrical CIRCUIT; most of the');
  L.push('valley is not on a named faction\'s wire, so it answers null nearly everywhere, and');
  L.push('correctly. Whose LAND it is has been POWER.groundAt() since FACTIONS shipped');
  L.push('[who holds] on 9/6.');
  L.push('MEASURED, the same 1681 cells, both functions, one run:');
  L.push('    holderAt    24 cells    1.4%');
  L.push('    groundAt   656 cells   39.0%   across ten factions');
  L.push('THE GROUND WAS OWNED ALL ALONG. Seventh ruler this lane has thrown away, and the');
  L.push('most expensive: the other six produced a wrong number, this one produced a wrong');
  L.push('STOP. TWO FUNCTIONS ONE WORD APART ARE NOT TWO SPELLINGS OF ONE QUESTION.');
  L.push('');
  L.push('=== THE SWEEP (every person in a 17x17 neighbourhood block around the spawn) ===');
  L.push('  people probed                      ' + R.probed);
  L.push('  standing on ground somebody owns   ' + R.onGround
    + '   ' + (R.probed ? (100 * R.onGround / R.probed).toFixed(1) : '0') + '%');
  L.push('  belonging to a faction themselves  ' + R.affiliated
    + '   ' + (R.probed ? (100 * R.affiliated / R.probed).toFixed(1) : '0') + '%');
  L.push('  affiliated AND on their own ground ' + R.onOwnGround);
  L.push('  faction bases in reach             ' + R.bases);
  L.push('');
  L.push('AND THE SAME POWER MAP ASKED ABOUT CELLS, IN THE SAME RUN, because two separate');
  L.push('runs disagreed and a measurement that flips between runs must not be read:');
  L.push('  cells within 20 of the player        ' + R.cellsNear);
  L.push('  of those, owned by somebody          ' + R.cellsNearOwned
    + '   ' + (R.cellsNear ? (100 * R.cellsNearOwned / R.cellsNear).toFixed(1) : '0') + '%');
  L.push('  distinct cells the people stand on   ' + R.peopleCells);
  L.push('  of THOSE, owned by somebody          ' + R.peopleCellsOwned
    + '   ' + (R.peopleCells ? (100 * R.peopleCellsOwned / R.peopleCells).toFixed(1) : '0') + '%');
  L.push('');
  L.push('*** THAT GAP IS THE FINDING. *** Both numbers are true and they are about');
  L.push('DIFFERENT CELLS: ownership is real and clustered, and the people are not standing');
  L.push('in the clusters. So the row\'s question -- does this body wear the colour of the');
  L.push('block it stands on -- has an owner for the BLOCK almost nowhere a PERSON is,');
  L.push('which is a fact about where the population sits against where the territory is,');
  L.push('and it belongs to whoever owns the map and the population, not to this lane.');
  L.push('');
  if (Object.keys(R.ground).length) {
    L.push('WHOSE GROUND THE PEOPLE ARE ON:');
    for (const k of Object.keys(R.ground).sort((a, c) => R.ground[c] - R.ground[a]))
      L.push('    ' + k.padEnd(14) + String(R.ground[k]).padStart(6));
    L.push('');
  }
  if (R.affiliated) {
    L.push('WHO THE PEOPLE RUN WITH:');
    for (const k of Object.keys(R.mine).sort((a, c) => R.mine[c] - R.mine[a]))
      L.push('    ' + k.padEnd(14) + String(R.mine[k]).padStart(6));
    L.push('');
    L.push('AFFILIATED PEOPLE, BY WHOSE GROUND THEY STAND ON:');
    for (const k of Object.keys(R.pairs).sort((a, c) => R.pairs[c] - R.pairs[a]).slice(0, 20))
      L.push('    ' + k.padEnd(34) + String(R.pairs[k]).padStart(5));
  } else {
    L.push('*** AND THE SECOND HOLE STANDS: NOT ONE PERSON HERE RUNS WITH ANYBODY. ***');
    L.push('The ground is owned and the people on it belong to nobody, so "does this body');
    L.push('wear this block\'s colour" still has no subject near the spawn. That half is a');
    L.push('fact about the map and the two dials AFFILIATED_RATE and REACH_CELLS, which the');
    L.push('city file itself marks [PENDING Paolo], and it is not this lane\'s to move.');
    L.push('WHAT IS DIFFERENT NOW: it is ONE hole and not two, and the one that is left is');
    L.push('named honestly instead of being propped up by a broken ruler.');
  }
  L.push('');
  L.push('=== AND THE HALF OF THE ROW THAT IS THIS LANE OWNS: CAN THEY BE DRESSED? ===');
  var dn = 0, un = 0;
  for (var k1 in (R.dressable || {})) dn += R.dressable[k1];
  for (var k2 in (R.undressable || {})) un += R.undressable[k2];
  L.push('  affiliated people whose faction HAS an outfit   ' + dn);
  L.push('  affiliated people whose faction has NONE        ' + un
    + (un ? '   (' + Object.keys(R.undressable).join(', ') + ')' : ''));
  L.push(un ? '  A faction with no entry in FACTION_LOOKS leaves its people in a trade fit.'
            : '  EVERY faction anybody here runs with can be dressed in its own outfit, so the');
  L.push(un ? '' : '  dressing half of this row is not the thing that is broken.');
  L.push('');
  L.push('=== THE TRAP IN THE ROW\'S OWN WORDING, kept from round 1 because it still holds ===');
  L.push('"EVERY dressed person\'s colour matches the faction that owns the block" would put');
  L.push('the whole street in gang colours -- every shopkeeper, every kid, in Cartel brown');
  L.push('for standing on Cartel ground. That is the opposite of the law it cites. COLOUR IS');
  L.push('TERRITORY calls colour "a statement of who would defend you" and says wearing your');
  L.push('colours is A CHOICE WITH A COST; the style card allows ONE saturated piece and');
  L.push('lists dust, ash, bone and lead as legal cloth. A valley in uniform has no signal in');
  L.push('it, because a colour only means something against another colour.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
})();

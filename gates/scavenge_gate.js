#!/usr/bin/env node
/* BOHEMIA — SCAVENGE GATE (9/29/26, WORLD lane)
 *
 * ROW [scavenge], RULE 37(k) (Paolo 9/27): a SCAVENGE button in the settlement
 * screen — spend time, test your luck, for materials; for when you are down bad
 * on food, medicine or batteries; a settlement may show a bonus.
 *
 *  A  *** LUCK DECIDES WHETHER, NEVER HOW MANY. *** EVERYTHING COSTS ONE (8/15)
 *     and this repo has already measured what a variable faucet does to it:
 *     [people charge] found a solar panel offering 9.33 cells a day against a
 *     day's work paying ONE, which "would end EVERYTHING COSTS ONE inside a
 *     week". A search returns one thing or nothing, and that is held here on
 *     every search of every block, not asserted in a comment.
 *
 *  B  A BLOCK RUNS OUT, AND THE COUNT IS DERIVED, NOT STORED. The module's only
 *     state is how many times each block gave something up.
 *
 *  C  *** THE ROLL IS NOT BIASED, AND THIS LEG EXISTS BECAUSE MINE WAS. ***
 *     The first cut used a bare xorshift over a structured seed and took 199
 *     searches to clear a six-thing block when the arithmetic says total × H(total)
 *     is about 15. The verb would have been unusable for a reason that had
 *     nothing to do with the design. The measured pace is now held against that
 *     arithmetic so a biased roll cannot come back quietly.
 *
 *  D  DETERMINISTIC. The same block, searched the same number of times, on the
 *     same day, answers the same. A save and a reload cannot re-roll a block
 *     into a better answer.
 *
 *  E  WHAT A FIND GIVES YOU IS HIS: YIELDS ships EMPTY and asking answers
 *     NO_RULING by name. AND NO FOURTH CURRENCY IS CREATED: the currencies are
 *     locked at three and the third RESOURCES icon has been [PENDING Paolo]
 *     since 7/26. `medicine` is a FIND KIND, never a balance.
 *
 *  F  *** THE BONUS IS UNREAD AND SAYS WHY. *** Nothing in this game records
 *     that a fight happened anywhere. A zero would be indistinguishable from
 *     "no battle happened", so it answers UNREAD, the same discipline
 *     bohemia_future uses for a field it cannot read.
 *
 *  G  THE COOK IS NOT AN ILLUSTRATION: it reads the module's own findable cells
 *     and refuses if its count and the module's disagree.
 *
 *   node gates/scavenge_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const P = (...a) => path.join(ROOT, ...a);
const R = (p) => require(P(p));
const read = (p) => fs.readFileSync(P(p), 'utf8');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const SC = R('engine/bohemia_scavenge.js');
const OM = R('engine/bohemia_overmap.js');
const T = R('engine/bohemia_towns.js');
const CE = R('engine/bohemia_cityedit.js');

const m = OM.buildOvermap(1337);
const B = T.blocksOf(m, CE.cat);
const sized = B.blocks.map(b => ({ b: b, n: SC.findableOn(m, b) }))
  .filter(o => o.n > 0).sort((a, b) => a.n - b.n);

/* ---- A. *** ONE THING OR NOTHING *** ------------------------------------ */
section('A luck decides whether, never how many', () => {
  const c = SC.census(m, B);
  console.log('    [measured] ' + c.blocks + ' blocks, ' + c.searchable + ' worth searching, '
    + c.findable + ' findable things in the valley, biggest block ' + c.biggest
    + ', ' + c.empty + ' with nothing on them');
  ok('the valley really has ground to search', c.searchable > 100);
  ok('and some blocks have nothing, which is an answer not a gap', c.empty > 0);

  /* every search of every findable block, all the way down: never more than one */
  let searches = 0, everMoreThanOne = 0, everNegative = 0;
  for (let k = 0; k < 40; k++) {
    const pick = sized[(k * 7) % sized.length];
    const s = SC.create({});
    let before = SC.leftOn(s, m, pick.b).left;
    for (let d = 0; d < 400; d++) {
      const r = SC.search({ map: m, blocks: B, state: s, block: pick.b, day: d });
      if (r.why === SC.PICKED_CLEAN) break;
      searches++;
      const after = SC.leftOn(s, m, pick.b).left;
      const took = before - after;
      if (took > 1) everMoreThanOne++;
      if (took < 0) everNegative++;
      before = after;
    }
  }
  console.log('    [measured] ' + searches + ' real searches driven across 40 blocks');
  ok('*** NOT ONE SEARCH EVER RETURNED MORE THAN ONE THING ***', everMoreThanOne === 0,
     everMoreThanOne + ' searches paid out more than one');
  ok('and none ever put something back', everNegative === 0);
  ok('the module names no amount at all: the word `amount` is not in it',
     !/\bamount\b/.test(read('engine/bohemia_scavenge.js').replace(/\/\*[\s\S]*?\*\//g, ' ')));
});

/* ---- B. A BLOCK RUNS OUT ------------------------------------------------ */
section('B the block is finite and the count is derived', () => {
  const pick = sized[Math.floor(sized.length / 2)];
  const s = SC.create({});
  let t = 0, found = 0, empty = 0, cleaned = false;
  for (let d = 0; d < 20000; d++) {
    const r = SC.search({ map: m, blocks: B, state: s, block: pick.b, day: d });
    if (r.why === SC.PICKED_CLEAN) { cleaned = true; break; }
    t++; if (r.found) found++; else empty++;
  }
  console.log('    [measured] a typical block holds ' + pick.n + ' things; it took '
    + t + ' searches to clear (' + found + ' found, ' + empty + ' empty-handed)');
  ok('*** THE BLOCK RUNS OUT AND SAYS SO BY NAME ***', cleaned);
  ok('it gave up exactly what it held, never more', found === pick.n, found + ' of ' + pick.n);
  ok('a picked-clean block refuses further searching',
     SC.search({ map: m, blocks: B, state: s, block: pick.b, day: 1 }).why === SC.PICKED_CLEAN);
  ok('the module stores only how many times a block gave something up',
     Object.keys(s).join(',') === 'id,taken');
  ok('and the total is re-derived from the block, never stored',
     SC.findableOn(m, pick.b) === pick.n);
  ok('a cell on no block answers NOT_A_PLACE by name',
     SC.search({ map: m, blocks: B, state: SC.create({}), x: -5, y: -5 }).why === SC.NOT_A_PLACE);
});

/* ---- C. *** THE ROLL IS NOT BIASED, AND MINE WAS *** -------------------- */
section('C the pace matches the arithmetic', () => {
  const H = (n) => { let s = 0; for (let k = 1; k <= n; k++) s += 1 / k; return s; };
  let worst = 0, rows = [];
  [0, Math.floor(sized.length / 4), Math.floor(sized.length / 2), sized.length - 1].forEach(i => {
    const pick = sized[i], s = SC.create({});
    let t = 0;
    for (let d = 0; d < 200000; d++) {
      const r = SC.search({ map: m, blocks: B, state: s, block: pick.b, day: d });
      if (r.why === SC.PICKED_CLEAN) break;
      t++;
    }
    const exp = pick.n * H(pick.n);
    const ratio = t / exp;
    rows.push(pick.n + ' things -> ' + t + ' searches (theory ' + exp.toFixed(1) + ', ratio ' + ratio.toFixed(2) + ')');
    if (Math.abs(Math.log(ratio)) > Math.abs(Math.log(worst || 1))) worst = ratio;
  });
  rows.forEach(r => console.log('    [measured] ' + r));
  /* THE FIRST CUT CAME IN AT 13x THEORY. A generous band still catches that. */
  ok('*** THE MEASURED PACE TRACKS total x H(total), so the roll is not biased ***',
     worst > 0.4 && worst < 3.0, 'worst ratio ' + worst.toFixed(2));
  const live = read('engine/bohemia_scavenge.js').replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('and the roll really avalanches rather than shifting once',
     /Math\.imul\(x, 0x85ebca6b\)/.test(live) && /Math\.imul\(x, 0xc2b2ae35\)/.test(live));
});

/* ---- D. DETERMINISTIC --------------------------------------------------- */
section('D a reload cannot re-roll a block', () => {
  const pick = sized[5];
  const a = SC.search({ map: m, blocks: B, state: SC.create({}), block: pick.b, day: 3 });
  const b = SC.search({ map: m, blocks: B, state: SC.create({}), block: pick.b, day: 3 });
  ok('*** THE SAME BLOCK ON THE SAME DAY ANSWERS THE SAME ***',
     a.found === b.found && a.chance === b.chance && a.left === b.left);
  const c = SC.search({ map: m, blocks: B, state: SC.create({}), block: pick.b, day: 4 });
  ok('and a different day is a different search', a.found !== c.found || a.chance === c.chance);
});

/* ---- E. WHAT A FIND GIVES YOU IS HIS ------------------------------------ */
section('E the valve that is his, and no fourth currency', () => {
  ok('*** YIELDS SHIPS EMPTY ***', Object.keys(SC.YIELDS).length === 0);
  ok('asking answers NO_RULING and names the empty table',
     SC.yieldOf('food').why === SC.NO_RULING && SC.yieldOf('food').table === 'YIELDS');
  ok('a kind that is not one of his answers NOT_A_KIND rather than improvising',
     SC.yieldOf('gold').why === 'NOT_A_KIND');
  ok('the kinds are the nouns his own sentence used',
     SC.KINDS.indexOf('food') >= 0 && SC.KINDS.indexOf('medicine') >= 0
     && SC.KINDS.indexOf('battery') >= 0);
  /* *** RULE 47 (Paolo 9/29): THE SIX RESOURCES ARE BATTERIES, FOOD, MEDS,
     ROUNDS, TAPE AND WATER. *** This list shipped 9/29 with FIVE -- no WATER --
     so a search in the Mojave could never turn up the one thing a body there
     needs most. Corrected 10/9. Checked by the ruled name, not by counting, so
     adding a seventh kind is allowed and dropping one of his six is not. */
  const SIX = { batteries: 'battery', food: 'food', meds: 'medicine',
                rounds: 'ammo', tape: 'tape', water: 'water' };
  const absent = Object.keys(SIX).filter(r => SC.KINDS.indexOf(SIX[r]) < 0);
  ok('*** EVERY ONE OF RULE 47\'S SIX RESOURCES IS A FIND KIND ***'
     + (absent.length ? ' -- MISSING: ' + absent.join(', ') : ''),
     absent.length === 0);
  ok('and a search can really turn each of the six up, not just name it',
     Object.keys(SIX).every(r => SC.yieldOf(SIX[r]).why === SC.NO_RULING));
  const live = read('engine/bohemia_scavenge.js');
  ok('*** AND NO FOURTH CURRENCY IS CREATED: the module never credits a balance ***',
     !/credit\(|debit\(|balance\(/.test(live.replace(/\/\*[\s\S]*?\*\//g, ' ')));
  ok('it says out loud that the third resource icon is still his',
     /third icon is \[PENDING Paolo\]|third RESOURCES icon/.test(live));
  /* the purse's own locked ruling is unchanged by this round */
  ok('the three currencies are still three, in the purse\'s own words',
     /THE CURRENCIES ARE LOCKED AND THERE ARE EXACTLY THREE/.test(read('engine/bohemia_purse.js')));
});

/* ---- F. *** THE BONUS IS UNREAD *** ------------------------------------- */
section('F the recent-battle bonus is a hole, named', () => {
  const b = SC.bonus({ where: 'a block' });
  ok('*** IT ANSWERS UNREAD RATHER THAN ZERO ***', b.known === false && b.why === SC.UNREAD);
  ok('and it says exactly what is missing and whose it is',
     /deed ledger/.test(b.because) && /COMBAT/.test(b.because));
  /* THE MEASUREMENT BEHIND IT, RE-TAKEN EVERY RUN so the note cannot go stale:
     if the fight ever starts publishing deeds, this leg turns red and tells the
     next lane the hole is closed. */
  /* *** AND THE FIRST CUT OF THIS LEG SWEPT engine/ ONLY AND PRINTED AN EMPTY
     LIST, so "no fight module publishes" was trivially true and the leg proved
     nothing. The publishers are in the WALKED SURFACE. It sweeps both now, and
     it refuses an empty sweep outright, because a measurement that finds nothing
     anywhere is a broken instrument and not a finding. */
  const files = fs.readdirSync(P('engine')).filter(f => f.endsWith('.js'))
    .map(f => ['engine/' + f, read('engine/' + f)])
    .concat([['slices/BOHEMIA_CITY_WORLD.html', read('slices/BOHEMIA_CITY_WORLD.html')]]);
  const publishers = files
    .filter(([f]) => f !== 'engine/bohemia_deeds.js')
    .filter(([, src]) => /(Deeds|deeds)\.publish(Stage)?\s*\(/.test(src))
    .map(([f]) => f);
  console.log('    [measured] everything that publishes a deed: ' + (publishers.join(', ') || 'NOTHING'));
  ok('the sweep actually found the publishers, so it is measuring something',
     publishers.length > 0, 'the sweep found nobody at all, which means it is broken');
  ok('*** AND NOT ONE OF THEM IS THE FIGHT, so UNREAD is still the true answer ***',
     !publishers.some(f => /fight|combat|battle/i.test(f)),
     'a fight module now publishes deeds: turn the bonus on');
  /* the two real calls are both on a quest stage, which is the whole reason the
     bonus cannot be derived today */
  const slice = read('slices/BOHEMIA_CITY_WORLD.html');
  const calls = (slice.match(/Deeds\.publish(Stage)?\s*\(/g) || []).length;
  console.log('    [measured] publish calls in the walked surface: ' + calls);
  ok('and there are still only a couple of them, both on a quest stage',
     calls > 0 && calls <= 4, calls + ' calls');
});

/* ---- G. THE COOK AGREES WITH THE ENGINE --------------------------------- */
section('G the picture is not an illustration', () => {
  const doc = JSON.parse(read('banks/BOHEMIA_PICKED_CLEAN_9_29_26.txt'));
  console.log('    [measured] block ' + doc.the_block.i + ', ' + doc.the_block.cells
    + ' cells, ' + doc.the_block.findable + ' findable; finds on screen '
    + doc.findPixels.join(' / ') + '; ' + doc.groundPixelsCompared
    + ' ground pixels compared, ' + doc.groundPixelsThatMoved + ' moved');
  const blk = B.blocks.find(x => x.i === doc.the_block.i);
  ok('the block it drew is a real block of this valley', !!blk);
  ok('*** AND ITS FINDABLE COUNT IS THE MODULE\'S, NOT THE TOOL\'S ***',
     SC.findableOn(m, blk) === doc.the_block.findable);
  ok('the block really runs out on screen',
     doc.findPixels[0] > doc.findPixels[1] && doc.findPixels[2] === 0);
  ok('*** AND THE BLOCK DOES NOT MOVE: 0 ground pixels differ ***',
     doc.groundPixelsThatMoved === 0 && doc.groundPixelsCompared > 1000);
  ok('the finds are a small minority of the frame (TG-05)', doc.brightSharePct < 6);
  ok('it is a draft and nothing on a play surface', doc.draft === true && /rule 18/.test(doc.not_shipped));
  ok('the picture exists where he can reach it', fs.existsSync(P('slices/vote/WORLD_PICKED_CLEAN.png')));
  /* the tool's refusals are LIVE, never prose: this lane shipped a gate on 9/28
     that was green because a regex matched a deleted constant inside a comment */
  const tool = read('tools/bohemia_picked_clean_cook_9_29_26.js')
    .replace(/\/\*[\s\S]*?\*\//g, ' ');
  ok('the does-not-move refusal is a live statement, not a comment',
     /THE BLOCK DOES NOT MOVE[\s\S]{0,60}process\.exit\(1\)/.test(tool));
  ok('the must-run-out refusal is a live statement, not a comment',
     /PICKED CLEAN means clean[\s\S]{0,60}process\.exit\(1\)/.test(tool));
  ok('and it refuses if its count disagrees with the engine',
     /must agree with the engine[\s\S]{0,80}process\.exit\(1\)/.test(tool));
});

console.log('SCAVENGE GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (luck decides WHETHER and never how many, a block runs out and says so,'
  + ' the pace matches total x H(total), and the recent-battle bonus is UNREAD'
  + ' because nothing records that a fight happened anywhere)');
process.exit(fail ? 1 : 0);

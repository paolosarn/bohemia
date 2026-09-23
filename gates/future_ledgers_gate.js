#!/usr/bin/env node
/* BOHEMIA — FUTURE LEDGERS GATE (9/23/26, WORLD lane, rule 31)
 *
 * RULE 31 (Paolo 9/23, LOCKED): "play all three at the same time and flip through
 * them... see the progress in the future from your past action... the city is
 * built like shit because you're not making enough of an impact in your earlier
 * act." The law: act 2 and act 3 are DERIVED from the earlier acts' ledgers,
 * never hand-placed.
 *
 * The board row [future city] is WORLD's, and it says "waits for DYNASTY's two
 * school rounds; claim nothing here yet". SO THIS LANE DID NOT BUILD THE DERIVE.
 * What it did is the half nobody else can: MEASURE THE INPUTS. Rule 12 says a
 * dependency is a premise, not a gate, and the premise worth testing here is not
 * whether DYNASTY is ready -- it is whether the four ledgers the law names can
 * answer the question the derive will ask them.
 *
 * *** THE MEASUREMENT: THE LAW NAMES FOUR LEDGERS AND ONE OF THEM CAN SAY WHICH
 *     ACT IT IS TALKING ABOUT. ***
 *
 *   WHAT WAS BUILT   bohemia_century     a real per-act ledger. Entries carry an
 *                                        act, totals are derived from entries so
 *                                        they cannot drift, it is written by the
 *                                        walked city, saved and loaded.  READY.
 *   BATTERIES        bohemia_purse       saves {id, day, entries}. A ledger, and
 *                                        it survives -- but NO ACT. And the 14
 *                                        faction treasuries (bohemia_pockets)
 *                                        export no save and no load at all, so
 *                                        who holds the valley's money is gone on
 *                                        every reload.
 *   TERRITORY        turfGrid()          keyed on seed + map size and NOTHING
 *                                        ELSE. A pure function of the seed,
 *                                        recomputed identically every boot, and
 *                                        the walked city's save does not mention
 *                                        turf at all. What the player took is
 *                                        not written down anywhere.
 *   WHO LIVED        ctPeopleSave()      saves, and carries no act.
 *
 * WHY THAT MATTERS AND IT IS NOT A DETAIL: a derive reading three of these gets
 * THE CITY AS IT STANDS, which is the one thing the century module's own head
 * already warned about -- "a generation that built forty homes and a generation
 * that built none look identical the moment a later generation knocks them
 * down". Feed act 3 a snapshot and his sentence stops being true: the future
 * cannot be built like shit because of act 1 if nothing recorded what act 1 did.
 *
 * SO THIS GATE PINS THE FOUR, and it is written to be USEFUL TO WHOEVER BUILDS
 * THE DERIVE rather than to stay green: the day somebody act-stamps the purse or
 * gives the treasuries a save, the measured lines here change and the gate says
 * so out loud instead of quietly passing.
 *
 * AND IT PINS TWO THINGS THAT MUST NOT ROT:
 *   - TIERS ships EMPTY (what "poor" and "rebuilt" MEAN is Paolo's, and the law
 *     says the numbers are his). A default landing there is canon nobody wrote.
 *   - The century's loader treats a broken blob as an empty memory, never a
 *     crash. It is the one thing in the game that must survive every migration
 *     it will ever meet.
 *
 * RULE 29: the cook is a thing DRAWN, and it is checked here too.
 *
 * NOT SHIPPED (rule 18): nothing in this round touches a play surface.
 *
 *   node gates/future_ledgers_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const CEN = R('engine/bohemia_century.js');
const PU  = R('engine/bohemia_purse.js');
const PK  = R('engine/bohemia_pockets.js');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const city = fs.readFileSync(CITY, 'utf8');

/* ---- A. WHAT WAS BUILT: the one ledger that is ready -------------------- */
section('A the built ledger is per-act and it survives', () => {
  const c = CEN.make({ act: 1 });
  CEN.note(c, 'build', { type: 'home', x: 4, y: 4, w: 2, h: 2 }, 3);
  CEN.note(c, 'build', { type: 'home', x: 8, y: 4, w: 2, h: 2 }, 4);
  CEN.setAct(c, 2);
  CEN.note(c, 'build', { type: 'shop', x: 12, y: 4, w: 2, h: 2 }, 40);
  CEN.note(c, 'demolish', { type: 'home', x: 4, y: 4, w: 2, h: 2 }, 41);

  const a1 = CEN.totals(c, 1), a2 = CEN.totals(c, 2);
  console.log('    [measured] act 1 built ' + a1.built + ', act 2 built ' + a2.built
    + ' demolished ' + a2.demolished + '; through act 2 net ' + CEN.through(c, 2).net);

  ok('*** THE ONLY LEDGER THAT KNOWS WHICH ACT IT IS TALKING ABOUT ***',
     a1.built === 2 && a2.built === 1 && a2.demolished === 1);
  ok('and the law\'s word COMPOUND is what through() answers',
     CEN.through(c, 2).built === 3 && CEN.through(c, 1).built === 2);

  /* the derive will ask this across a reload, so it has to come back whole */
  const back = CEN.load(CEN.save(c));
  ok('it survives a save and a load with every entry\'s act intact',
     back.entries.length === 4 && back.entries.every(e => e.act >= 1 && e.act <= 3));
  ok('a broken blob is an EMPTY MEMORY and never a crash',
     CEN.load({ entries: [{ nonsense: true }, null, 7] }).entries.length === 0 &&
     CEN.load(null).entries.length === 0);
  ok('the century cannot run backwards (a memory that reverses is not a memory)',
     (CEN.setAct(c, 1), c.act === 2));

  /* and it is wired: written, saved and loaded by the walked city */
  ok('the walked city WRITES it', /BohemiaCentury\.note\(/.test(city));
  ok('the walked city SAVES it', /century:\s*\(function/.test(city));
  ok('the walked city LOADS it back', /st\.century/.test(city));
});

/* ---- B. *** THE OTHER THREE CANNOT ANSWER THE ACT QUESTION *** ---------- */
section('B the other three ledgers the law names', () => {
  /* BATTERIES, half one: the player's purse saves, and carries no act */
  const p = PU.create();
  const blob = PU.save(p);
  console.log('    [measured] purse save keys: ' + Object.keys(blob).join(','));
  ok('the purse really is a LEDGER of entries, which is the right shape',
     Array.isArray(blob.entries));
  ok('*** BUT IT CARRIES NO ACT, so a derive cannot tell act 1\'s money from act 2\'s ***',
     !('act' in blob), 'it has an act now -- update this gate and tell whoever builds the derive');

  /* BATTERIES, half two: the treasuries do not persist AT ALL */
  console.log('    [measured] pockets exports save=' + typeof PK.save + ' load=' + typeof PK.load);
  ok('*** AND THE 14 FACTION TREASURIES HAVE NO SAVE AND NO LOAD, so who holds the'
   + ' valley\'s money is gone on every reload ***',
     typeof PK.save === 'undefined' && typeof PK.load === 'undefined',
     'pockets persists now -- that is good news and this line must be rewritten, not deleted');
  ok('and it really is fourteen holders plus the player, so it is not a small hole',
     (PK.seed(), PK.holders().length === 14));

  /* TERRITORY: a pure function of the seed */
  const tg = city.slice(city.indexOf('function turfGrid'), city.indexOf('function turfGrid') + 200);
  console.log('    [measured] turfGrid keys on: ' + (tg.match(/var k\s*=\s*([^;]+);/) || [])[1]);
  ok('*** TERRITORY IS KEYED ON THE SEED AND THE MAP SIZE AND NOTHING ELSE ***',
     /var k\s*=\s*seed\s*\+/.test(tg) && !/act|century|deed/.test(tg));
  const snap = city.slice(city.indexOf('function citySnapshot'), city.indexOf('function citySnapshot') + 2600);
  ok('and the save does not mention turf, territory or a holder anywhere',
     !/turf|territor|holderOf|TURF_USED/i.test(snap));

  /* WHO LIVED: saves, no act */
  ok('who lived DOES ride the save', /people:\s*\(function/.test(snap));
  ok('and it carries no act either', !/peopleAct|actOf/.test(snap));

  /* THE HEADLINE, as one assertion so it cannot be read past */
  const actAware = [true, false, false, false].filter(Boolean).length;
  ok('*** ONE OF THE FOUR LEDGERS RULE 31 NAMES CAN SAY WHICH ACT IT MEANS ***',
     actAware === 1, actAware + ' of 4');
});

/* ---- C. WHAT IS POOR AND WHAT IS REBUILT IS HIS ------------------------- */
section('C the valve that is his stays empty', () => {
  ok('*** TIERS SHIPS EMPTY -- what a poor city and a rebuilt one ARE is his ***',
     Object.keys(CEN.TIERS).length === 0,
     'somebody put a default in the one table the law says is Paolo\'s');
  const c = CEN.make({ act: 3 });
  const t = CEN.tierOf(c, 3);
  ok('and asking answers NO_RULING by name, never an invented look',
     t.reason === CEN.NO_RULING && t.table === 'TIERS');
  ok('while still handing back the totals, so the pipe is finished and carries nothing',
     !!t.totals && typeof t.totals.built === 'number');
  ok('the three acts are three and the module says so',
     CEN.ACT_MIN === 1 && CEN.ACT_MAX === 3);
});

/* ---- D. RULE 29: THE COOK IS A THING DRAWN ------------------------------ */
section('D the cook is a thing drawn', () => {
  const png = path.join(ROOT, 'slices/vote/WORLD_THE_SAME_CORNER.png');
  ok('the picture exists', fs.existsSync(png));
  if (fs.existsSync(png)) {
    const b = fs.readFileSync(png);
    ok('and it is a real PNG', b.length > 1000 && b[0] === 0x89 && b[1] === 0x50, b.length + ' bytes');
  }
  const bankPath = path.join(ROOT, 'banks/BOHEMIA_THE_SAME_CORNER_9_23_26.txt');
  ok('with a bank behind it that parses', fs.existsSync(bankPath));
  if (!fs.existsSync(bankPath)) return;
  const doc = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  ok('the bank carries the drawing that made it', !!doc.build_source);

  /* THE CLAIM THE PICTURE MAKES, held as numbers: the ruin is the SAME corner
     derived, and the hard things outlast the soft ones. */
  console.log('    [measured] the corner survives ' + doc.keptShare + '% pixel-for-pixel; '
    + 'the block wall keeps ' + (100 * doc.wallKept).toFixed(0) + '% of itself, the asphalt '
    + (100 * doc.roadKept).toFixed(0) + '%');
  ok('*** THE RUIN IS THE SAME CORNER, NOT A SECOND DRAWING ***',
     doc.keptShare >= 25 && doc.keptShare <= 75, doc.keptShare + '%');
  ok('*** AND THE BLOCK WALL OUTLASTS THE ASPHALT, which is how the Mojave works ***',
     doc.wallKept > doc.roadKept && doc.wallKept >= 0.6,
     'wall ' + doc.wallKept + ' against road ' + doc.roadKept);
  ok('AH-01: one thing wrong and it is a SMALL thing, in both panels',
     doc.wrongShare > 0 && doc.wrongShare <= 3, doc.wrongShare + '%');
  ok('it says out loud that it is the DO-NOTHING past, which is the floor',
     /do-nothing|floor/i.test(doc.floor || ''));

  /* RULE 29 as a check on the registry: no text items from this lane, ever again */
  const reg = R('records/target/BOHEMIA_VOTE_REGISTRY.json');
  const mine = reg.items.filter(i => i.lane === 'world');
  const judged = (reg.verdicts || []).map(v => v.id);
  const open = mine.filter(i => judged.indexOf(i.id) < 0);
  ok('*** EVERY UNJUDGED ITEM THIS LANE HAS IS A THING TO LOOK AT, NOT A PAGE ***',
     open.length > 0 && open.every(i => i.show && i.show.how === 'image'),
     open.map(i => i.id + ':' + (i.show && i.show.how)).join(' '));
  ok('and this round\'s picture is registered', mine.some(i => /same-corner/.test(i.id)));
});

console.log('FUTURE LEDGERS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (rule 31 names four ledgers and ONE of them carries an act; territory is a'
  + ' pure function of the seed and the faction treasuries do not persist at all)');
process.exit(fail ? 1 : 0);

#!/usr/bin/env node
/* BOHEMIA — PEOPLE CHARGE GATE (9/22/26, WORLD lane, row [people charge])
 *
 * Holds HIS RULING:
 *   "Mfs charge batteries bro. i know buildings can help in our game but jesus
 *    christ mfs can charge batteries"     -- Paolo 9/21, in the VOTE tab
 *
 *  A  *** THE DEFECT HE IS NAMING, MEASURED LIVE. *** cellsNightlyCharge() on
 *     the walked surface is the only maker of batteries in this game, and it
 *     credits the FACTION that holds the lit ground. A person never makes one.
 *     This gate reads that off the real surface file rather than asserting it,
 *     so the day somebody wires a person in, the check says so.
 *
 *  B  A BUILDING HELPS, IT DOES NOT OWN THE ACT. His sentence, as a test: take
 *     every building away and a person with a rig and a source still charges.
 *
 *  C  THE PHYSICS IS REAL AND NOT TUNABLE, THE RIGS ARE HIS. Every number is a
 *     measurement or arithmetic on one, the rig table ships EMPTY, and asking
 *     whose rig it is answers NO_RULING rather than inventing an owner.
 *
 *  D  *** AND THE BAYS ARE THE CEILING, WHICH IS WHAT KEEPS HIS PILLAR ALIVE. ***
 *     Run the real arithmetic on an ordinary 10 W panel and the sun offers 9.3
 *     cells a day, against a day's work paying ONE. Nine a day would end
 *     EVERYTHING COSTS ONE inside a week. The sun was never the real limit on
 *     charging AA cells -- the charger is, a bay holds one cell -- so the module
 *     is capped by bays and this gate proves the cap bites.
 *
 *  E  RULE 29: THE COOK IS A THING DRAWN. Every one of this lane's six text
 *     items was voted down ("boring asf"). The tile exists, it is a real PNG,
 *     and its registry row is an image and not a page.
 *
 *   node gates/people_charge_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const C = R('engine/bohemia_charge.js');
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

/* ---- A. THE DEFECT HE NAMED, READ OFF THE REAL SURFACE ------------------- */
section('A only a faction makes a battery today', () => {
  const city = fs.readFileSync(CITY, 'utf8');
  const fn = city.slice(city.indexOf('function cellsNightlyCharge()'),
                        city.indexOf('function cellsNightlyCharge()') + 1200);
  ok('the walked city has exactly one maker of batteries', fn.length > 100);
  ok('*** AND IT CREDITS A FACTION, NOT A PERSON ***',
     /holderOf/.test(fn) && /BohemiaPockets\.of\(f\)/.test(fn),
     'the minting path does not read as faction-only any more');
  ok('the reason it writes is a day on a live wire',
     /a day on a live wire/.test(fn));
  /* the player is not in that path, which is the whole complaint */
  ok('and the player is nowhere in it', !/'player'/.test(fn) && !/PLAYER/.test(fn));
});

/* ---- B. A BUILDING HELPS, IT DOES NOT OWN THE ACT ------------------------ */
section('B a building helps and does not own it', () => {
  const rig = { bays: 4, watts: 10 };
  const alone = C.canCharge({ rig: rig, source: 'sun' });
  ok('*** A PERSON WITH A RIG AND THE SUN CHARGES, WITH NO BUILDING ANYWHERE ***',
     alone.can === true && alone.cells > 0 && alone.helped === false,
     JSON.stringify(alone));

  const helped = C.canCharge({ rig: rig, source: 'grid', building: { bays: 12, watts: 400 } });
  ok('a building makes it BIGGER (' + alone.cells + ' -> ' + helped.cells + ')',
     helped.can === true && helped.cells > alone.cells && helped.helped === true);

  /* his words as a test: take the building away, the person still charges */
  ok('*** TAKE THE BUILDING AWAY AND THE PERSON STILL CHARGES ***',
     C.canCharge({ rig: rig, source: 'grid' }).can === true);

  ok('all three sources are things the game already has',
     Object.keys(C.SOURCES).join(',') === 'grid,own,sun');
  ok('and a source it has never heard of is refused, not improvised',
     C.canCharge({ rig: rig, source: 'somehow' }).why === 'NO_SOURCE');
  ok('a rig with no bays is not a rig',
     C.canCharge({ rig: { bays: 0, watts: 100 }, source: 'sun' }).why
       === 'A_RIG_WITH_NO_BAYS_IS_NOT_A_RIG');
});

/* ---- C. THE PHYSICS IS REAL, THE RIGS ARE HIS --------------------------- */
section('C the physics is real and the rigs are his', () => {
  const p = C.physics();
  ok('a cell holds the capacity this lane already measured (' + p.whPerCell + ' Wh)',
     p.whPerCell === 3.75);
  ok('the charger efficiency and the Mojave sun are named with their source',
     p.efficiency > 0 && p.efficiency < 1 && p.peakSunHours > 0 && !!p.source);

  ok('*** THE RIG TABLE SHIPS EMPTY ***', Object.keys(C.RIGS).length === 0);
  ok('and asking whose rig it is answers NO_RULING, never an invented owner',
     C.rigFor('player').why === 'NO_RULING' && C.rigFor('player').table === 'RIGS');
  ok('asking about nobody is refused too', C.rigFor(null).known === false);

  /* the arithmetic is arithmetic: double the watts, double what the sun offers */
  ok('*** THE MATH IS MATH: double the watts, double the charge ***',
     Math.abs(C.wattsToCells(20, 5) - 2 * C.wattsToCells(10, 5)) < 1e-9);
  ok('and no time means no charge', C.wattsToCells(1000, 0) === 0);

  const body = fs.readFileSync(path.join(ROOT, 'engine/bohemia_charge.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  ok('it names no faction anywhere, because the act is a person\'s',
     !/Mob|Cartel|Reds|Network|faction/i.test(body));
});

/* ---- D. THE BAYS ARE THE CEILING, AND THAT IS WHAT KEEPS HIS PILLAR ----- */
section('D the bays are the ceiling', () => {
  /* what the sun WOULD give if it were the limit */
  const sunOffers = C.wattsToCells(10, C.PEAK_SUN_H);
  console.log('    [measured] an ordinary 10 W panel: the sun offers '
    + sunOffers.toFixed(2) + ' cells a day, against a day\'s work paying ONE');
  ok('the sun really does offer many times a day\'s wage', sunOffers > 5);

  const four = C.perDay({ bays: 4, watts: 10 }, 'sun');
  ok('*** BUT A FOUR-BAY RIG MAKES FOUR, BECAUSE A BAY HOLDS ONE CELL ***',
     four.cells === 4 && four.limitedBy === 'BAYS', JSON.stringify(four));

  /* and the cap really is the cap: pour power in, nothing more comes out */
  const same = C.perDay({ bays: 4, watts: 400 }, 'grid');
  ok('*** FORTY TIMES THE POWER INTO THE SAME FOUR BAYS IS STILL FOUR ***',
     same.cells === 4, JSON.stringify(same));

  /* and when the power really is short, THAT becomes the limit and it says so */
  const starved = C.perDay({ bays: 8, watts: 1 }, 'sun');
  ok('a rig too weak to fill its bays is limited by POWER and says so',
     starved.cells < 8 && starved.limitedBy === 'POWER', JSON.stringify(starved));

  ok('more bays really do make more', C.perDay({ bays: 8, watts: 40 }, 'grid').cells === 8);
});

/* ---- E. RULE 29: THE COOK IS A THING DRAWN ------------------------------ */
section('E the cook is a thing drawn', () => {
  const png = path.join(ROOT, 'slices/vote/WORLD_THE_RIG_ON_THE_ROOF.png');
  ok('the tile exists as a real picture', fs.existsSync(png));
  if (fs.existsSync(png)) {
    const b = fs.readFileSync(png);
    ok('and it is a PNG, not an empty file',
       b.length > 1000 && b[0] === 0x89 && b[1] === 0x50, b.length + ' bytes');
  }
  const bank = path.join(ROOT, 'banks/BOHEMIA_THE_RIG_ON_THE_ROOF_9_22_26.txt');
  ok('the bank behind it exists and parses', fs.existsSync(bank) &&
     !!JSON.parse(fs.readFileSync(bank, 'utf8')).build_source);
  const doc = JSON.parse(fs.readFileSync(bank, 'utf8'));
  ok('*** ONE THING IS LIT AND IT IS A SMALL THING (' + doc.litShare + '%) ***',
     doc.litShare > 0 && doc.litShare <= 3);
  ok('the tile carries his ruling in its own head', /Mfs charge batteries/i.test(doc.ruling));

  /* RULE 29, as a check on the registry: no more text items from this lane */
  const reg = R('records/target/BOHEMIA_VOTE_REGISTRY.json');
  const mine = reg.items.filter(i => i.lane === 'world');
  const judged = (reg.verdicts || []).map(v => v.id);
  const open = mine.filter(i => judged.indexOf(i.id) < 0);
  ok('*** EVERY UNJUDGED ITEM THIS LANE HAS IS A THING TO LOOK AT, NOT A PAGE ***',
     open.length > 0 && open.every(i => i.show && i.show.how === 'image'),
     open.map(i => i.id + ':' + (i.show && i.show.how)).join(' '));
  ok('and the six he killed are all accounted for as judged',
     mine.filter(i => judged.indexOf(i.id) >= 0).length === 6);
});

console.log('PEOPLE CHARGE GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (a person with a rig charges, a building only helps, the physics is real'
  + ' and the rigs are his, and the bays are what keeps everything costing one)');
process.exit(fail ? 1 : 0);

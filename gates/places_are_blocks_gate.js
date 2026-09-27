#!/usr/bin/env node
/* BOHEMIA — PLACES ARE BLOCKS GATE (9/27/26, WORLD lane)
 *
 * RULE 33h, THE REVAMP LIST's rebuild line: "PLACES (WORLD, LIFE+CITY): a place
 * is a block with its buildings as services; the shop, the shed, the pump, the
 * fortress are the first four."
 *
 * AND THE CUT HALF OF THE SAME RULE, done this round: "THE ASKS AS A TEXT STREAM
 * (QUESTS, WORLD, WORDS): notices... Rebuilt as contracts and events from people
 * in places." engine/bohemia_notice.js is in archive/ with its tool and its gate.
 *
 *  A  A SERVICE IS PRESENT BECAUSE A BUILDING IS STANDING THERE. Not because of
 *     a tier, not from a table. [bb places] measured last round that a shelf is
 *     a function of TIER ALONE -- fourteen places, three shelves, every camp
 *     selling the same four things. This is the answer to that.
 *
 *  B  *** AND THE CENSUS IS THE FINDING. *** 467 blocks in the valley, 252 offer
 *     anything at all, and the spread is 249 shops / 12 sheds / 7 fortresses /
 *     ONE PUMP. 236 blocks have exactly one service and ONE block in the whole
 *     valley has three. Battle Brothers settlements carry three to eight
 *     attached locations each; ours carry one or none.
 *
 *  C  AND THE INVERSION FROM LAST ROUND SURVIVES THE REBUILD: the Homeless block
 *     -- holding 254 of the valley's 308 generating cells -- offers NOTHING when
 *     you stand on it. The place that makes the most power in Las Vegas has no
 *     service on it at all.
 *
 *  D  NEVER A PRICE. EVERYTHING COSTS ONE (8/15), and his 9/15 ruling after this
 *     lane built a stranger surcharge: "the surcharge is DEAD... the spread lives
 *     in ACCESS." BB's hinterland changes what things COST; ours changes WHAT IS
 *     THERE. The module carries no number at all and this gate holds that.
 *
 *  E  WHAT A SERVICE GIVES IS HIS. STOCKS ships EMPTY and asking answers
 *     NO_RULING by name.
 *
 *   node gates/places_are_blocks_gate.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const PL = R('engine/bohemia_place.js');
const T = R('engine/bohemia_towns.js');
const OM = R('engine/bohemia_overmap.js');
const CE = R('engine/bohemia_cityedit.js');
const GRAPH = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'), 'utf8'));

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) pass++;
  else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
const section = (name, fn) => {
  try { return fn(); }
  catch (e) { fail++; console.log('  > FAIL ' + name + ' could not be measured  [' + (e && e.message) + ']'); }
};

const m = OM.buildOvermap(1337);
const BLOCKS = T.blocksOf(m, CE.cat);
const DS = T.districtsOf(m, CE.cat);
const SEATS = T.derive(GRAPH, DS, 1) || [];
const MINES = T.minesOf(m, CE.cat, SEATS);

/* ---- A. A SERVICE NEEDS A BUILDING -------------------------------------- */
section('A a service is present because a building is standing there', () => {
  ok('the first four are the revamp list\'s own four, in its own order',
     PL.SERVICES.join(',') === 'shop,shed,pump,fortress');

  /* every district it reads is one the overmap really generates -- this file
     reads the map, it does not add to it */
  const real = {};
  for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
    const c = m.at(x, y); if (c && c.district) real[c.district] = 1;
  }
  const named = [];
  Object.keys(PL.FROM).forEach(s => PL.FROM[s].forEach(d => named.push(d)));
  const invented = named.filter(d => !real[d]);
  console.log('    [measured] it names ' + named.length + ' districts, '
    + (named.length - invented.length) + ' of which the generator really makes');
  ok('*** IT INVENTS NO BUILDING TYPE: every district it reads is one the map makes ***',
     invented.length === 0, 'invented: ' + invented.join(','));

  /* a block of houses offers nothing, and that is an ANSWER not a gap */
  const houses = BLOCKS.blocks.find(b => PL.servicesOn(m, b).services.length === 0);
  ok('a block with nothing on it answers EMPTY rather than failing',
     !!houses && PL.servicesOn(m, houses).services.length === 0);
  ok('and a district with no service returns null rather than guessing',
     PL.serviceFor('suburb') === null && PL.serviceFor('arterial') === null);
  ok('while a commercial cell really is a shop', PL.serviceFor('commercial') === 'shop');
});

/* ---- B. *** THE CENSUS IS THE FINDING *** ------------------------------- */
section('B what the valley actually offers', () => {
  const c = PL.census(m, BLOCKS);
  console.log('    [measured] ' + c.blocks + ' blocks, ' + c.withAny + ' offer anything ('
    + (100 * c.withAny / c.blocks).toFixed(0) + '%)');
  console.log('    [measured] by service: ' + JSON.stringify(c.byService));
  console.log('    [measured] services per block: ' + JSON.stringify(c.byCount));

  ok('the valley has real blocks to stand on', c.blocks > 100);
  ok('*** AND ALMOST HALF OF THEM OFFER NOTHING AT ALL ***',
     c.blocks - c.withAny > 100, (c.blocks - c.withAny) + ' empty of ' + c.blocks);
  ok('*** THERE IS EXACTLY ONE PUMP IN LAS VEGAS ***',
     c.byService.pump === 1, c.byService.pump + ' pumps');
  ok('*** AND THE VALLEY IS ALMOST ALL SHOPS: ' + c.byService.shop + ' of them ***',
     c.byService.shop > c.byService.shed * 10);
  /* BB settlements carry 3-8 attached locations. Ours carry one or none. */
  const many = Object.keys(c.byCount).filter(k => +k >= 3).reduce((n, k) => n + c.byCount[k], 0);
  console.log('    [measured] blocks with three or more services: ' + many
    + '   (Battle Brothers settlements carry three to eight each)');
  ok('*** ALMOST NO BLOCK CARRIES MORE THAN ONE SERVICE ***', many <= 5, many + ' blocks');
});

/* ---- C. THE INVERSION SURVIVES THE REBUILD ------------------------------ */
section('C the place that makes the power offers nothing', () => {
  const seat = SEATS.find(s => s.faction === 'Homeless');
  const p = PL.at({ map: m, blocks: BLOCKS, x: seat.x, y: seat.y, mines: MINES,
                    holderAt: () => ({ faction: 'Homeless' }) });
  console.log('    [measured] the Homeless seat: block ' + p.block + ', services '
    + (p.services.length ? p.services.join(',') : '(none)')
    + ', and it holds ' + (p.makes ? p.makes.cells + ' generating cells' : 'nothing'));
  ok('standing on it is a real place', p.known === true);
  ok('*** AND IT OFFERS NOTHING WHEN YOU ARRIVE ***', p.empty === true);
  ok('*** WHILE HOLDING THE VALLEY\'S POWER ***', !!p.makes && p.makes.cells > 200);
  ok('the hinterland is HANDED IN, never found again here',
     (() => { const q = PL.at({ map: m, blocks: BLOCKS, x: seat.x, y: seat.y }); return q.makes === null; })());
  ok('a cell off any block says so by name',
     PL.at({ map: m, blocks: BLOCKS, x: -5, y: -5 }).why === PL.NOT_A_PLACE);
});

/* ---- D. NEVER A PRICE --------------------------------------------------- */
section('D never a price', () => {
  const body = fs.readFileSync(path.join(ROOT, 'engine/bohemia_place.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  const nums = (body.match(/\b\d{2,}\b/g) || []);
  console.log('    [measured] numbers of two digits or more in the module body: '
    + (nums.length ? nums.join(',') : '(none)'));
  ok('*** THE MODULE CARRIES NO PRICE AND NO RATE OF ITS OWN ***', nums.length === 0);
  ok('and no currency word either',
     !/price|cost|batter|wage|charge/i.test(body));
});

/* ---- E. WHAT A SERVICE GIVES IS HIS ------------------------------------- */
section('E the valve that is his', () => {
  ok('*** STOCKS SHIPS EMPTY ***', Object.keys(PL.STOCKS).length === 0);
  ok('and asking answers NO_RULING by name',
     PL.offerOf('shop').why === PL.NO_RULING && PL.offerOf('shop').table === 'STOCKS');
  ok('a service that is not one of the four is refused, not improvised',
     PL.offerOf('temple').why === 'NOT_A_SERVICE');
});

/* ---- F. AND THE CUT REALLY HAPPENED ------------------------------------- */
section('F the ask as a text stream is cut', () => {
  ok('*** engine/bohemia_notice.js IS OUT OF engine/ ***',
     !fs.existsSync(path.join(ROOT, 'engine/bohemia_notice.js')));
  ok('and it is in archive/, not deleted (never-lose-files)',
     fs.existsSync(path.join(ROOT, 'archive/bohemia_notice.js')));
  ok('its cook tool and its gate went with it',
     fs.existsSync(path.join(ROOT, 'archive/bohemia_the_first_notice.js')) &&
     fs.existsSync(path.join(ROOT, 'archive/first_notice_gate.js')));
  ok('the suite no longer registers the retired gate',
     !/FIRST NOTICE/.test(fs.readFileSync(path.join(ROOT, 'gates/bohemia_gates.py'), 'utf8')));
  ok('and the registry says what was cut and why',
     /CUT 9\/27\/26 under RULE 33h/.test(
       fs.readFileSync(path.join(ROOT, 'gates/bohemia_superseded.txt'), 'utf8')));
  /* THE THREE GATES THAT IMPORTED IT KEEP THEIR REAL WORK */
  ['suburb_walls', 'full_shelves', 'block_strikes'].forEach(g => {
    const s = fs.readFileSync(path.join(ROOT, 'gates/' + g + '_gate.js'), 'utf8');
    /* NOT "never mentions it" -- the cut note SHOULD name what was cut, and my
       first version of this check failed all three for saying so. What matters
       is that nothing IMPORTS it any more. */
    ok(g + ' no longer imports the cut module',
       !/require\([^)]*bohemia_notice|R\('engine\/bohemia_notice/.test(s));
    ok(g + ' says in its own file that the section was cut and why',
       /CUT 9\/27 UNDER RULE 33h/.test(s));
  });
});

console.log('PLACES ARE BLOCKS GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (a service is present because a building is standing there: 467 blocks,'
  + ' 249 shops and exactly one pump, and the block holding the valley\'s power'
  + ' offers nothing)');
process.exit(fail ? 1 : 0);

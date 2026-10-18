#!/usr/bin/env node
/* ============================================================================
   THE VALLEY'S INSIDES, AS ONE TABLE  (WORLD, row [the valley has no inside])

   THE ROW WAS WRONG AND THIS LANE WROTE IT. "The valley has no inside" is true
   of the district KITS -- the outdoor tilesets, where a building is a footprint
   -- and false of the game: engine/bohemia_floorplan.js has made interiors since
   7/26, under the INTERIOR-MATCHES-EXTERIOR LAW, with a 62-district room-grammar
   table (DISTGEN) and eleven zones.

   WHAT IS REALLY WRONG IS THAT THE TABLE EXISTS TWICE. The engine's DISTGEN and
   the CITY app's IN_ZONE are two hand-kept copies and they disagree on six
   districts, every disagreement collapsing a specific grammar into the generic
   `institutional`. A police station is generated with two hospital wards in it.

   IT REFUSES SIX THINGS, and the first two are the ones that matter because they
   cannot be satisfied by editing this lane's own files:

   A. THE TWO TABLES DRIFTING FURTHER. Both are PARSED LIVE -- DISTGEN out of
      engine/bohemia_world.js, IN_ZONE out of the CITY app -- and every
      disagreement is named. A ratchet: six today, and it may only shrink.
   B. THE INSIDE NOT BEING REAL. Every zone either table names is RUN through the
      generator here, and must come back with real floor, real walls and real
      doors. "The valley has an inside" is a measurement in this file, never a
      claim, because the row it corrects was a claim.
   C. A SECOND COPY OF THE TABLE IN THIS LANE'S OWN MODULE. bohemia_insides.js
      must contain no district-to-zone map at all.
   D. THE SIXTEEN-WITH-NO-GRAMMAR LIST BEING WRONG OR GROWING. Re-derived from
      DISTGEN against the live districts; a ratchet that may only shrink.
   E. THE SEVEN/NINE SPLIT BEING PASSED OFF AS A MEASUREMENT. It is a reading and
      must say so, and the nine must each really be a district with no grammar.
   F. A BLOCKED DISTRICT BEING CALLED A ONE-LINE ADD. The seven named as blocked
      must really have no kit module, and the two named as one-line adds must
      really have one.

   Every refusal ends at the failure count and a process.exit, never at a comment.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const P = p => path.join(__dirname, '..', p);
const read = p => fs.readFileSync(P(p), 'utf8');

let IN = require('../engine/bohemia_insides.js'); IN = IN.BOH_INSIDES || IN;
let BK = require('../engine/bohemia_boardkinds.js'); BK = BK.BOH_BOARDKINDS || BK;
const FP = require('../engine/bohemia_floorplan.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? '  (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  (' + note + ')' : ''))); };
const section = (t, f) => { console.log('\n--- ' + t + ' ---'); f(); };

/* ---- PARSE BOTH LIVE TABLES, the way interiors_gate.js does -------------- */
const worldSrc = read('engine/bohemia_world.js');
let dgBlk = worldSrc.slice(worldSrc.indexOf('var DISTGEN = {'));
dgBlk = dgBlk.slice(0, dgBlk.indexOf('\n  };'));
const DISTGEN = {};
for (const m of dgBlk.matchAll(/^\s*([a-z]+):\s*\{[^\n]*zone:'([a-z]+)'/gm)) DISTGEN[m[1]] = m[2];

let app = null;
try { app = require('./bohemia_city_app.js').read(); } catch (e) { app = null; }
const citySrc = app ? app.src : '';
const INZONE = {};
const zm = citySrc.match(/const IN_ZONE=\{([^}]*)\}/);
if (zm) for (const m of zm[1].matchAll(/([a-z]+):'([a-z]+)'/g)) INZONE[m[1]] = m[2];

const liveDistricts = Object.keys(BK.districts());

console.log('=== THE INSIDES GATE ===');
console.log('    [measured] DISTGEN ' + Object.keys(DISTGEN).length + ' districts, the CITY app '
  + Object.keys(INZONE).length + ', the valley ' + liveDistricts.length);

/* ---- A. THE TWO TABLES ------------------------------------------------- */
section('A the engine\'s table and the app\'s, parsed live and compared', () => {
  ok('*** DISTGEN WAS FOUND AND READ OUT OF engine/bohemia_world.js ***',
     Object.keys(DISTGEN).length > 0, Object.keys(DISTGEN).length + ' districts');
  ok('and the CITY app\'s IN_ZONE was found and read',
     Object.keys(INZONE).length > 0, Object.keys(INZONE).length + ' districts');
  const missing = Object.keys(DISTGEN).filter(k => !(k in INZONE)).sort();
  const extra = Object.keys(INZONE).filter(k => !(k in DISTGEN)).sort();
  const differ = Object.keys(DISTGEN).filter(k => (k in INZONE) && DISTGEN[k] !== INZONE[k]).sort();
  const drift = missing.length + extra.length + differ.length;
  console.log('    [measured] in the engine not the app: ' + (missing.join(', ') || 'none'));
  console.log('    [measured] in the app not the engine: ' + (extra.join(', ') || 'none'));
  differ.forEach(k => console.log('    [measured] ' + k.padEnd(14) + 'engine says '
    + DISTGEN[k].padEnd(14) + 'app says ' + INZONE[k]));
  /* THE RATCHET: six today. It may only shrink. */
  ok('*** THE TWO COPIES OF THE TABLE DISAGREE ON NO MORE THAN THE 6 MEASURED 10/10 ***',
     drift <= 6, drift + ' now, 6 then');
  ok('and the module\'s record of the drift still matches what the tables say',
     missing.join(',') === IN.DRIFT.missingFromTheApp.join(',')
     && differ.join(',') === Object.keys(IN.DRIFT.disagree).sort().join(','),
     'live [' + missing.concat(differ).join(', ') + ']');
  ok('and every disagreement really does collapse into the generic one, which is the finding',
     differ.every(k => INZONE[k] === 'institutional'),
     differ.map(k => k + '->' + INZONE[k]).join(' '));
});

/* ---- B. THE INSIDE IS REAL, PROVED BY RUNNING IT ----------------------- */
section('B every zone either table names makes a real inside', () => {
  const zones = [...new Set(Object.values(DISTGEN).concat(Object.values(INZONE)))].sort();
  console.log('    [measured] zones named by the two tables: ' + zones.join(', '));
  const thin = [];
  zones.forEach(z => {
    const r = IN.proveAnInside(z, 22, 14, 1337);
    if (!r.known || r.floor < 50 || r.door < 1 || !r.rooms.length) thin.push(z + '(' + (r.floor | 0) + ')');
  });
  ok('*** EVERY ZONE RUN FOR REAL COMES BACK WITH FLOOR, WALLS AND A DOOR ***',
     thin.length === 0, thin.join(', '));
  const civic = IN.proveAnInside('civic', 22, 14, 1337);
  console.log('    [measured] a city hall footprint, civic: ' + civic.floor + ' floor, '
    + civic.wall + ' wall, ' + civic.door + ' doors, rooms ' + civic.rooms.join('/'));
  ok('so "the valley has no inside" is false, and this says so with a number',
     civic.floor > 100 && civic.rooms.length >= 3);
  /* AND THE COST OF THE DRIFT, RUN BOTH WAYS */
  const right = IN.proveAnInside('civic', 22, 14, 1337);
  const wrong = IN.proveAnInside('institutional', 22, 14, 1337);
  console.log('    [measured] a police station today: ' + wrong.rooms.join('/')
    + '   |  what the engine says it should be: ' + right.rooms.join('/'));
  ok('*** AND A POLICE STATION REALLY IS GENERATED WITH HOSPITAL WARDS ***',
     wrong.rooms.indexOf('ward') >= 0 && right.rooms.indexOf('ward') < 0,
     'app zone institutional -> ' + wrong.rooms.join('/'));
  const fire = IN.proveAnInside('firehouse', 22, 14, 1337);
  ok('and the firehouse grammar that nothing reaches is a garage and an office',
     fire.rooms.indexOf('garage') >= 0);
});

/* ---- C. NO SECOND COPY IN THIS LANE'S MODULE --------------------------- */
section('C this lane\'s module keeps no table of its own', () => {
  const src = read('engine/bohemia_insides.js');
  /* a map literal of district -> zone would look like `policestation: 'civic'` */
  const mapish = [...src.matchAll(/^\s*[a-z]+:\s*'(residential|retail|warehouse|institutional|office|default|leisure|school|firehouse|civic|transit)'/gm)];
  ok('*** NO DISTRICT-TO-ZONE MAP LITERAL IS IN bohemia_insides.js ***',
     mapish.length === 0, mapish.slice(0, 3).map(m => m[0].trim()).join('; '));
  ok('and asking it for an inside with no table handed in says so rather than guessing',
     IN.insideOf('cityhall', null).why === IN.NO_RULING);
  ok('and with the live table handed in it answers',
     IN.insideOf('cityhall', DISTGEN).known === true
     && IN.insideOf('cityhall', DISTGEN).zone === DISTGEN.cityhall);
  ok('a thing that is not a district is refused by name',
     IN.insideOf('mars', DISTGEN).why === IN.NOT_A_DISTRICT);
});

/* ---- D + E + F. THE DISTRICTS WITH NO GRAMMAR -------------------------- */
section('D the districts with no room grammar, re-derived', () => {
  const none = liveDistricts.filter(d => !(d in DISTGEN)).sort();
  console.log('    [measured] live districts with no room grammar: ' + none.length);
  console.log('      ' + none.join(', '));
  ok('*** NO MORE THAN THE 16 MEASURED ON 10/10 HAVE NO GRAMMAR ***', none.length <= 16,
     none.length + ' now, 16 then');
  const declared = IN.NO_GRAMMAR_YET.correctlyNone.districts
    .concat(IN.NO_GRAMMAR_YET.owesOne.districts).sort();
  ok('and the module accounts for every one of them',
     none.every(d => declared.indexOf(d) >= 0),
     none.filter(d => declared.indexOf(d) < 0).join(', '));
  ok('and claims none that already has a grammar',
     declared.every(d => !(d in DISTGEN)),
     declared.filter(d => d in DISTGEN).join(', '));

  /* E: the split is a reading and must say so */
  ok('*** THE SEVEN-CORRECT / NINE-OWED SPLIT IS STATED AS MINE, not as a measurement ***',
     IN.NO_GRAMMAR_YET.correctlyNone.mine === true && IN.NO_GRAMMAR_YET.owesOne.mine === true
     && IN.NO_GRAMMAR_YET.correctlyNone.tuned === false);
  ok('and the four Strip casinos really are among the ones that owe one',
     ['luxor', 'sphere', 'strat', 'highroller'].every(d =>
       IN.NO_GRAMMAR_YET.owesOne.districts.indexOf(d) >= 0 && !(d in DISTGEN)));

  /* F: blocked means no kit module, and a one-line add means there is one */
  const hasKit = d => fs.existsSync(P('engine/bohemia_' + d + '.js'));
  const wrongBlocked = IN.NO_GRAMMAR_YET.owesOne.blocked.filter(hasKit);
  ok('*** EVERY DISTRICT CALLED BLOCKED REALLY HAS NO KIT MODULE ***',
     wrongBlocked.length === 0, wrongBlocked.join(', '));
  const wrongEasy = IN.NO_GRAMMAR_YET.owesOne.aOneLineAdd.filter(d => !hasKit(d));
  ok('and every district called a one-line add really has a kit',
     wrongEasy.length === 0, wrongEasy.join(', '));
  ok('and the two lists together are the nine that owe one',
     IN.NO_GRAMMAR_YET.owesOne.blocked.length + IN.NO_GRAMMAR_YET.owesOne.aOneLineAdd.length
     === IN.NO_GRAMMAR_YET.owesOne.districts.length);
  /* a district with no grammar answers by name, and says which half it is in */
  ok('asking about one that owes a grammar says so',
     IN.insideOf('luxor', DISTGEN).why === IN.NO_GRAMMAR
     && IN.insideOf('luxor', DISTGEN).owesOne === true);
  ok('and asking about a mountain says a mountain has no inside, correctly',
     IN.insideOf('mountain', DISTGEN).why === IN.NO_GRAMMAR
     && IN.insideOf('mountain', DISTGEN).owesOne === false);
});

console.log('\n' + '='.repeat(74));
console.log('THE INSIDES GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (the valley HAS an inside and has since 7/26; the table that picks the rooms '
  + 'exists twice and the copies disagree on six districts, so a police station is '
  + 'built with hospital wards in it)');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);

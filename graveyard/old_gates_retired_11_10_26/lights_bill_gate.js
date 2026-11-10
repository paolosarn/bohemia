/* ============================================================================
   THE LIGHTS BILL GATE (9/5/26, WORLD lane)
   BB-THE-NIGHT-EATS-POWER. Ship test, in the row's own words:
   "a held circuit debits power at nightfall and an unpaid one goes dark."

   LIGHT=TERRITORY has been live code since 7/20 -- feeder-sized circuits, 12% of
   them lit, an owner on every live one, seams computed, nobody patrolling the
   dark -- AND HOLDING A LIT BLOCK WAS FREE. Territory was a colour.

   WHAT MAKES A CIRCUIT YOURS, AND WHY IT IS NOT A FLAG SOMEBODY MINTED. The row
   says "which circuits are his is still his", so last round refused to stamp one
   and the drain correctly billed nothing. The answer was already in the game:
   THE BUILDINGS HE PUT DOWN HIMSELF. A plot he chose, paid a battery for and can
   demolish is the one piece of ground here that is unambiguously his, and no
   ruling was needed because he did it with his thumb. This gate pins that: the
   held set comes from the placed-buildings delta and from nothing else.

   AND A BUILDING IS ON THE STREET'S CIRCUIT, NOT ITS OWN. The grid only lays
   circuits along STREET cells, so POWER.at() on a building's own cell returns the
   dead default forever. A version that billed the building's cell would have
   found zero on a valley full of his buildings and called it "he holds nothing".
   Check 2c is the one that would have caught it.

   THE DARKENING LIVES IN THE GRID. Ten places on the walked surface ask
   `POWER.at(x,y).live`. `status` is private to powerMap's closure, so at() is the
   ONLY door out of the grid and a reader cannot bypass the doused set even by
   accident. Check 1g holds that door shut.

   node gates/lights_bill_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PG = require(path.join(ROOT, 'engine/bohemia_powergrid.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('LIGHTS BILL GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (a held circuit is billed at nightfall - an unpaid one goes dark'
            + ' - and it stays dark)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. the grid, on a valley made here so the numbers are knowable ------ */
{
  /* a straight arterial run, which is what buildCircuits looks for */
  const m = { at: (x, y) => ({ district: (y === 4 ? 'arterial' : 'desert') }) };
  const pm = PG.powerMap(m, 12345, { N: 24, litFraction: 1 });   /* all lit, so the test is about dousing */
  ok('every cell of a circuit carries the circuit it belongs to', pm.idAt(0, 4) >= 0);
  ok('and ground with no feeder down it carries none', pm.idAt(0, 0) === -1);
  ok('cells on one feeder run share one id', pm.idAt(0, 4) === pm.idAt(1, 4));

  const id = pm.idAt(0, 4);
  ok('the street starts lit', pm.at(0, 4).live === true);
  ok('DOUSE PUTS IT OUT', pm.douse(id) === true && pm.at(0, 4).live === false);
  ok('AND IT KEEPS ITS OWNER -- the light went out, the claim did not',
     pm.at(0, 4).owner !== null && pm.at(0, 4).doused === true);
  ok('and the WHOLE circuit went, not one cell of it', pm.at(1, 4).live === false);
  ok('dousing the same circuit twice is not a second event', pm.douse(id) === false);

  /* A CIRCUIT THAT WAS NEVER LIT CANNOT GO DARK. An unpaid bill on a block with
     no light is not a punishment, it is a bug that would read as one. */
  const dead = PG.powerMap(m, 12345, { N: 24, litFraction: 0 });
  ok('A CIRCUIT THAT WAS NEVER LIT CANNOT BE PUT OUT', dead.douse(dead.idAt(0, 4)) === false);

  /* 1g -- THE DOOR. */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_powergrid.js'), 'utf8');
  const exposed = (src.match(/^\s*(\w+)\s*:/gm) || []).join(' ');
  ok('at() IS THE ONLY DOOR OUT OF THE GRID -- the status table is never returned,'
     + ' so no reader can see round the doused set', !/status\s*[,:}]/.test(exposed.replace(/status\s*=/g, '')));

  /* it rides the save, and only the doused set does */
  const saved = pm.serialize();
  ok('the doused set serialises', saved.length === 1 && saved[0] === id);
  const fresh = PG.powerMap(m, 12345, { N: 24, litFraction: 1 });
  ok('and restores onto a fresh grid', fresh.restore(saved) === 1 && fresh.at(0, 4).live === false);
  ok('restoring nothing clears it, so a new valley is not born in the dark',
     fresh.restore([]) === 0 && fresh.at(0, 4).live === true);
  ok('a circuit id from another valley is dropped rather than darkening a stranger',
     fresh.restore([99999]) === 0);
  ok('and relight exists, so going dark is a state and not a one-way door',
     pm.relight(id) === true && pm.at(0, 4).live === true);
}

/* ---- 2. on the walked surface, driven the way a player drives it --------- */
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
    R.heldWithNothingBuilt = heldCircuits().length;

    /* find a desert plot fronting a lit street, and BUILD on it through the
       game's own verb rather than by writing the delta by hand */
    let spot = null, street = null;
    for (let y = 1; y < om.n - 1 && !spot; y++) for (let x = 1; x < om.n - 1 && !spot; x++) {
      if ((om.at(x, y) || {}).district !== 'desert') continue;
      for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
        const p = POWER.at(nx, ny);
        if (p && p.live) { spot = [x, y]; street = [nx, ny]; break; }
      }
    }
    R.spot = spot; R.street = street;
    R.buildOk = CE.build(EDITS, spot[0], spot[1], 'desert',
                         (CE.buildableTypes(OM.DISTRICT) || [])[0], OM.DISTRICT).ok === true;
    CBpersist();

    /* 2c -- THE BUILDING'S OWN CELL HAS NO CIRCUIT. */
    R.idUnderBuilding = POWER.idAt(spot[0], spot[1]);
    R.idOnStreet = POWER.idAt(street[0], street[1]);

    const held = heldCircuits();
    R.heldAfterBuilding = held.length;
    R.heldId = held[0] && held[0].id;

    /* PAY THE NIGHT */
    BohemiaPurse.credit(purseGet(), 'electricity', held.length, 'gate:seed', null, 1);
    SPENT_TODAY = []; DARK_TONIGHT = [];
    nightPower();
    R.paid = SPENT_TODAY.map(s => s.verb + (s.paid ? ':PAID' : ':SHORT'));
    R.stillLitAfterPaying = POWER.at(street[0], street[1]).live;
    R.darkAfterPaying = DARK_TONIGHT.length;

    /* FAIL TO PAY THE NEXT ONE */
    SPENT_TODAY = []; DARK_TONIGHT = [];
    R.balanceNow = purseBalances().electricity;
    nightPower();
    R.unpaid = SPENT_TODAY.map(s => s.verb + (s.paid ? ':PAID' : ':SHORT'));
    R.wentDark = DARK_TONIGHT.length;
    R.litNow = POWER.at(street[0], street[1]).live;
    R.persisted = JSON.parse(localStorage.getItem('boh.city.dark') || '[]');
    R.heldOnceDark = heldCircuits().length;

    /* AND THE WALKED SURFACE'S OWN DARKNESS TEST SEES IT. This is the exact
       expression the two "is it black in here" branches use. */
    R.interiorReadsDark = !(POWER.at(street[0], street[1]) || {}).live;
    return R;
  });

  ok('with nothing built he holds no circuit', r.heldWithNothingBuilt === 0);
  ok('a plot can be built on ground fronting a lit street', r.buildOk === true);
  /* 2c */
  ok('A BUILDING\'S OWN CELL CARRIES NO CIRCUIT -- billing it would have found zero'
     + ' on a valley full of his buildings', r.idUnderBuilding === -1);
  ok('the street it fronts does carry one', r.idOnStreet >= 0);
  ok('SO PUTTING A BUILDING DOWN IS WHAT MAKES A CIRCUIT HIS, and it is the only'
     + ' thing that does', r.heldAfterBuilding === 1 && r.heldId === r.idOnStreet);

  ok('A HELD CIRCUIT DEBITS POWER AT NIGHTFALL -- the first half of the ship test',
     r.paid.length === 1 && r.paid[0] === 'night:power:PAID');
  ok('and a circuit he PAID for stays lit',
     r.stillLitAfterPaying === true && r.darkAfterPaying === 0);

  ok('with an empty pocket the same night is refused, not skipped',
     r.balanceNow === 0 && r.unpaid[0] === 'night:power:SHORT');
  ok('AND AN UNPAID ONE GOES DARK -- the second half of the ship test',
     r.wentDark === 1 && r.litNow === false);
  ok('the walked surface\'s own "is it black in here" test now says yes',
     r.interiorReadsDark === true);
  ok('IT STAYS DARK: the doused set rides the save', r.persisted.length === 1);
  /* AND THE FAILURE IS STABLE, NOT A SPIRAL. A light he lost is a light he stops
     paying for -- anything else is a debt system, and debt would be canon. */
  ok('AND HE IS NOT BILLED AGAIN FOR A LIGHT HE NO LONGER HAS', r.heldOnceDark === 0);

  /* THE CARD SAYS IT OUT LOUD. A light going off is the only consequence he can
     walk into the next day, so it is not left to be discovered by accident. */
  const card = await pg.evaluate(() => {
    let s2 = null;
    for (let y = 1; y < om.n - 1 && !s2; y++) for (let x = 1; x < om.n - 1 && !s2; x++) {
      if ((om.at(x, y) || {}).district !== 'desert') continue;
      for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]])
        if ((POWER.at(nx, ny) || {}).live) { s2 = [x, y]; break; }
    }
    if (s2) { CE.build(EDITS, s2[0], s2[1], 'desert',
                       (CE.buildableTypes(OM.DISTRICT) || [])[0], OM.DISTRICT); CBpersist(); }
    advance(20 * 60);
    return (document.getElementById('daycardIn') || {}).textContent || '';
  });
  ok('THE RECKONING NAMES THE BLOCK THAT WENT OUT, in the word he navigates by',
     /the lights went out on \w/.test(card));
  ok('and it says what that costs him, without a number',
     /nobody patrols the dark/.test(card));

  await b.close();
  ok('no page error across a night the lights went out' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);
  done();
})();

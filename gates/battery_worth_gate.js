/* ============================================================================
   BATTERY WORTH GATE (9/15/26, WORLD lane) -- board row [battery worth] /
   YOU-ARE-BUYING-THE-CONTAINER.

   WHAT THIS DEFENDS: the valley knows how many batteries exist, says it on the card
   he reads every night, and the number tells the truth about where they came from.

   AND IT DEFENDS THE MEASUREMENT ITSELF. The row asked for a denomination ladder and
   the record it was harvested from refuses one ("EVERYTHING COSTS ONE already removed
   the denominations of price... make them BODY-SCALE, NOT NUMERIC"). What that record
   puts in its place is the question nothing in this game had ever asked: HOW MANY
   BATTERIES EXIST. Measuring it found that a day of work MINTED a cell, without
   bound, and HE RULED IT 9/16 (ruling 9): one battery per head on day one held by the
   treasury of whoever holds that person's ground, plus one a day per lit site, and a
   day's work is PAID from a treasury, never minted. So the checks below assert the
   three halves of that: the opening stock is not minting, being paid moves money
   rather than making it, and a live wire is the one thing that really makes a new
   one.

   node gates/battery_worth_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const CE = require(path.join(ROOT, 'engine/bohemia_cells.js'));
const KO = require(path.join(ROOT, 'engine/bohemia_pockets.js'));
const PU = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const EC = require(path.join(ROOT, 'engine/bohemia_economy.js'));
const PD = require(path.join(ROOT, 'engine/bohemia_payday.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('BATTERY WORTH GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (the valley counts its own batteries, says it on the night card, and'
            + ' the count is honest about the ones it made from nothing)');
  process.exit(fail ? 1 : 0);
};
function code(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
            .replace(/'(\\.|[^'\\])*'/g, "''")
            .replace(/"(\\.|[^"\\])*"/g, '""');
}

/* ---- 1. THE MONEY IS READ OFF HIS RULING, NEVER TYPED -------------------- */
{
  ok('the money is the currency his own price table names (' + CE.money() + ')',
     CE.money() === PU.PRICES.food.currency && CE.money() === 'electricity');
  const was = PU.PRICES.food.currency;
  Object.keys(PU.PRICES).forEach(k => { PU.PRICES[k].currency = 'pesos'; });
  const followed = CE.money() === 'pesos';
  Object.keys(PU.PRICES).forEach(k => { PU.PRICES[k].currency = was; });
  ok('*** RENAME THE MONEY IN HIS TABLE AND THIS FOLLOWS IT ***',
     followed && CE.money() === was);
  const body = code(fs.readFileSync(path.join(ROOT, 'engine/bohemia_cells.js'), 'utf8'));
  ok('no currency is named in this module\'s code', !/electricity|resources|clout/.test(body));
  ok('and it invents no stock number', !/\b\d{2,}\b/.test(body));
}

/* ---- 2. *** THE COUNT, AND IT IS THE WHOLE VALLEY *** -------------------- */
{
  KO.reset(); KO.seed();
  const me = KO.of('player');
  const c0 = CE.count();
  ok('every faction is already a holder before anybody is paid (' + c0.holders + ')',
     c0.total === 0 && c0.holders === 15);
  PU.credit(me, 'electricity', 4, 'stake', 's', 0);
  KO.hand('player', 'Mob', 'electricity', 3, 'rent', 'Mob', 1);
  const c1 = CE.count();
  ok('*** PAYING SOMEBODY MOVES A CELL AND DOES NOT MAKE ONE *** (' + c0.total
     + ' -> ' + c1.total + ' after a stake of 4 and 3 paid away)', c1.total === 4);
  ok('and the count is across every holder, not just him',
     KO.worth('player', 'electricity') === 1 && KO.worth('Mob', 'electricity') === 3
     && c1.total === 4);
  ok('a count that cannot be taken answers null, never zero',
     CE.made(null) === null && CE.made([]) === null);
}

/* ---- 2b. *** THE OPENING STOCK: RULED 9/16, ONE PER HEAD, AND NOT MINTING *** */
{
  KO.reset(); KO.seed();
  ok('nothing is stocked until somebody stocks it', KO.stocked() === false);
  const r = KO.stock({ Mob: 556, Network: 672, Church: 224 }, 'electricity', 0);
  ok('*** THE VALLEY OPENS WITH A CELL PER HEAD, IN THE TREASURIES *** (' + r.put
     + ' across ' + r.holders + ')',
     r.applied && r.put === 1452 && r.holders === 3
     && KO.worth('Mob', 'electricity') === 556);
  ok('*** AND NONE OF IT COUNTS AS MINTED: they were on the shelves already ***',
     CE.count().total === 1452 && CE.made(CE.purses()) === 0);
  const again = KO.stock({ Mob: 9999 }, 'electricity', 0);
  ok('*** IT CANNOT BE RUN TWICE -- an opening stock that re-runs is a mint with a'
     + ' polite name ***',
     again.applied === false && again.reason === 'ALREADY_STOCKED'
     && CE.count().total === 1452);
  ok('the entries name the ruling they came from', /lights went out/.test(KO.OPENING));
}

/* ---- 3. *** A DAY'S WORK IS PAID, NEVER MINTED (ruling 9) *** ----------- */
{
  KO.reset(); KO.seed();
  const me = KO.of('player');
  KO.stock({ Mob: 50 }, 'electricity', 0);
  const before = CE.count().total;
  /* THE RULED WAY: the ground's holder pays you, so the valley's total does not move */
  for (let d = 1; d <= 10; d++) KO.hand('Mob', 'player', 'electricity', 1, 'a day on Mob ground', 'Mob', d);
  const after = CE.count().total;
  ok('*** TEN DAYS PAID FROM A TREASURY AND THE VALLEY HAS THE SAME CELLS *** ('
     + before + ' -> ' + after + ')',
     before === 50 && after === 50
     && KO.worth('player', 'electricity') === 10 && KO.worth('Mob', 'electricity') === 40);
  ok('*** AND NOTHING WAS MINTED BY WORKING ***', CE.made(CE.purses()) === 0);
  /* AND THE OLD WAY STILL MINTS, which is why the surface only falls back to it */
  for (let d = 1; d <= 10; d++) PU.payForWork(me, 'scav', d, 'd' + d);
  ok('the minting path is still there as a fallback and still mints (' + CE.made(CE.purses()) + ')',
     CE.made(CE.purses()) === 10 && CE.count().total === 60);
  /* AND made() MUST IGNORE MONEY THAT ONLY MOVED. Mutation-testing caught this:
     letting made() add transferIn passed, because nothing had moved yet when it was
     asked. So move some first -- the Mob now holds cells it was HANDED, and if those
     counted as minting the number would read 13. A check that cannot tell made from
     moved is the broken one, and this is the whole claim of the row. */
  KO.hand('player', 'Mob', 'electricity', 3, 'rent', 'Mob', 11);
  KO.hand('player', 'Church', 'electricity', 3, 'rent', 'Church', 11);
  ok('*** AND THE PURSE ITSELF CALLS THEM MADE, NOT MOVED *** (' + CE.made(CE.purses())
     + ' after 10 minted and 13 moved)',
     CE.made(CE.purses()) === 10
     && PU.flow(KO.of('Church')).electricity.transferIn === 3
     && PU.flow(KO.of('Church')).electricity.source === 0);
  ok('and moving them did not change the valley\'s count', CE.count().total === 60);
  ok('the drift reads a change in plain words', /10 more exist/.test(CE.driftSay(10)));
  ok('and says nothing when nothing changed',
     CE.driftSay(0) === '' && CE.driftSay(null) === '');
  ok('the line is an attempt and names the count, not a verdict on it',
     CE.draft === true && /BATTERIES IN THE VALLEY: 60/.test(CE.say(CE.count()))
     && !/wrong|bug|should/i.test(CE.say(CE.count())));
}

/* ---- 4. THE 267x UNIT IS REAL AND IS NOT REACHABLE, so nobody hunts it --- */
{
  ok('the power good is still priced in kWh (' + EC.GOODS.power.unit + ')',
     EC.GOODS.power.unit === 'kWh');
  ok('one kWh really is hundreds of cells of energy (' + Math.round(1000 / 3.75) + ')',
     Math.round(1000 / 3.75) === 267);
  const shelves = ['fortress', 'town', 'camp']
    .map(t => (PD.shelf({ id: 'h', kind: 'swapmeet', x: 1, y: 1, tier: t }) || []).map(g => g.good));
  ok('*** BUT POWER IS ON NO SHELF IN THE VALLEY, so the pump is not reachable *** ('
     + shelves.map(s => s.join('/')).join(' | ') + ')',
     shelves.every(s => s.indexOf('power') < 0));
}

/* ---- 5. AND HE READS IT ON THE CARD HE ALREADY READS --------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 400);

  const r = await pg.evaluate(() => {
    const R = { module: typeof window.BohemiaCells };
    if (R.module !== 'object') return R;
    const C = window.BohemiaCells, K = window.BohemiaPockets, p = purseGet();
    R.stocked = K.stocked();
    R.atDoor = C.count(); R.madeAtDoor = C.made(C.purses());
    R.playerAtDoor = K.worth('player', 'electricity');
    R.top = K.ranked('electricity').slice(0, 3);
    /* A DAY THROUGH THE GAME'S OWN WORK BUTTON */
    const before = C.count().total;
    let w = null; try { w = doWork(); } catch (e) { R.workThrew = String(e); }
    R.work = w && { paid: w.paid, what: w.paidWhat };
    R.afterWork = C.count().total;
    R.playerAfterWork = K.worth('player', 'electricity');
    R.movedNotMade = (C.count().total === before);
    R.madeAfterWork = C.made(C.purses());
    /* AND THE NIGHT'S CHARGE */
    const b2 = C.count().total;
    try { R.charged = cellsNightlyCharge(); } catch (e) { R.chargeThrew = String(e); }
    R.chargeDelta = C.count().total - b2;
    R.conserved = true;
    /* THE CARD ITSELF, and it must still be OPEN with the words in it */
    try { DAY.day = 2; } catch (e) {}
    try { showReckoning(); } catch (e) { R.cardThrew = String(e); }
    const el = document.getElementById('daycardIn');
    const txt = el ? el.textContent : '';
    R.cardOpen = !!(el && txt && txt.length > 40);
    R.onCard = /BATTERIES IN THE VALLEY/.test(txt);
    R.cardLine = (txt.match(/BATTERIES IN THE VALLEY[^A-Z]*/) || [''])[0].slice(0, 90);
    return R;
  });
  await b.close();

  ok('the cells book reaches the surface he walks', r.module === 'object');
  ok('*** THE VALLEY OPENS WITH A CELL PER HEAD, IN THE TREASURIES *** ('
     + (r.atDoor || {}).total + ' across ' + (r.atDoor || {}).holders + ': '
     + (r.top || []).map(x => x.who + ' ' + x.held).join(', ') + ')',
     r.stocked === true && r.atDoor && r.atDoor.total > 1000
     && (r.top || []).length === 3 && r.top[0].held > 100);
  ok('*** AND NONE OF IT IS MINTED -- they were on the shelves already ***',
     r.madeAtDoor === 0);
  ok('and the player starts with none of it', r.playerAtDoor === 0);
  ok('a day through the game\'s own work button really pays him ('
     + JSON.stringify((r.work || {}).what) + ')',
     r.work && r.work.paid === true && r.playerAfterWork === 1);
  ok('*** AND THE VALLEY HAS THE SAME CELLS AFTERWARDS: he was PAID, not printed for'
     + ' *** (' + (r.atDoor || {}).total + ' -> ' + r.afterWork + ')',
     r.movedNotMade === true && r.madeAfterWork === 0);
  ok('*** A LIVE WIRE IS THE ONE THING THAT MAKES A NEW ONE *** (' + r.charged
     + ' circuits, ' + r.chargeDelta + ' cells)',
     r.charged > 0 && r.chargeDelta === r.charged);
  ok('the night card is open when it is read (rule 14h)', r.cardOpen === true);
  ok('*** AND THE CARD HE READS EVERY NIGHT SAYS IT *** ("' + r.cardLine + '")',
     r.onCard === true && /BATTERIES IN THE VALLEY: \d{3,}/.test(r.cardLine));
  ok('no page error' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  {
    const raw = fs.readFileSync(CITY, 'utf8');
    const tool = fs.readFileSync(path.join(ROOT, 'tools/bohemia_city_work_patch.py'), 'utf8');
    const riders = (tool.slice(tool.indexOf('RIDERS = ['), tool.indexOf(']', tool.indexOf('RIDERS = [')))
      .match(/bohemia_[a-z_]+\.js/g) || []);
    const bad = riders.filter(f =>
      raw.split('/* ==== engine/' + f + ' ==== */').length !== 2 ||
      raw.split('/* ==== /engine/' + f + ' ==== */').length !== 2);
    ok('every spliced module block is opened once and closed once (' + riders.length
       + ' riders' + (bad.length ? ', broken: ' + bad.join(', ') : '') + ')',
       riders.length >= 13 && bad.length === 0);
  }
  done();
})();

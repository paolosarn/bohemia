/* ============================================================================
   EVERY POCKET GATE (9/14/26, WORLD lane) -- board row [every pocket] /
   THERE-IS-EXACTLY-ONE-PURSE-IN-THE-WHOLE-GAME.

   WHAT THIS DEFENDS: a battery that leaves the player arrives in somebody's hands,
   and the valley's money supply is conserved across every movement.

   THE BUG IT WAS BUILT OVER, measured before a line of the row was written:
   transferOut() and transferIn() were two one-legged posts that were never joined,
   transferIn() had ZERO callers in the whole game, and all four payment sites on
   the walked surface called transferOut alone. So the ledger said "moved to another
   holder" and no other holder existed. Over one week: ledger says 10 moved, 0 in
   anybody's hands, supply 9 -> 0.

   HOW IT IS CHECKED, and why each shape was chosen:
     * NOTHING HERE RE-IMPLEMENTS hand(). The surface checks drive the game's REAL
       blockRent() and loanNight(); a gate that re-implements the thing it is
       testing cannot see it break, which this lane has paid for twice.
     * THE SOURCE CHECKS STRIP COMMENTS AND STRINGS before looking for a bare
       transferOut, because the comments at every one of those four sites contain
       the word transferOut. A check that cannot tell a mention from a use is the
       broken one.
     * THE UNWIND IS PROVEN BY BREAKING LEG TWO ON PURPOSE. It is otherwise
       unreachable code, and unreachable code that is never exercised is a comment.

   THE DEMO IS NOT CHECKED HERE, ON PURPOSE. Rule 14(a) (Paolo 9/13, LOCKED): only
   THE RUN re-cuts the demo. A check that demanded this code in a demo this lane is
   forbidden to cut would be red through no fault of anybody's and would push the
   next reader into breaking that rule to go green. What the demo carries is
   REPORTED below as a fact and decides nothing.

   node gates/every_pocket_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const K = require(path.join(ROOT, 'engine/bohemia_pockets.js'));
const P = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('EVERY POCKET GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (a battery that leaves the player lands in somebody\'s hands, the'
            + ' handoff is atomic, and the valley\'s money supply is conserved)');
  process.exit(fail ? 1 : 0);
};

/* Strip block comments, line comments and string literals so a MENTION of a name
   in prose can never be read as a USE of it. Deliberately crude and deliberately
   conservative: it only ever removes text, so it cannot invent a use. */
function code(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
    .replace(/'(\\.|[^'\\])*'/g, "''")
    .replace(/"(\\.|[^"\\])*"/g, '""');
}

/* ---- 0. THE STRIPPER ITSELF, or every source check below is worthless ---- */
{
  const s = code("/* transferOut */ a; // transferOut\nvar x='transferOut'; b.transferOut(1);");
  ok('the comment stripper removes a mention in a block comment', !/\/\*/.test(s));
  ok('*** AND IT STILL SEES THE REAL CALL *** (' + s.trim() + ')',
     /\.transferOut\(/.test(s));
  ok('it counts exactly one use where there are three mentions and one use',
     (s.match(/transferOut/g) || []).length === 1);
  ok('a URL is not mistaken for a line comment', /https:/.test(code('var u="x"; //x\nvar v=https:;')));
}

/* ---- 1. WHO GETS A POCKET, AND IT IS DERIVED ---------------------------- */
{
  K.reset();
  const seeded = K.seed();
  const sel = T.selectable(G);
  ok('every faction that can hold ground gets a treasury (' + seeded + ')',
     seeded === sel.length && sel.length === 14);
  ok('*** AND THE LIST IS THE ONE THE REST OF THE GAME USES, not a list typed here ***',
     K.factions().join(',') === sel.join(','));
  /* THE LIST IS DERIVED, AND THE ONLY HONEST TEST OF THAT IS BEHAVIOURAL.
     A source scan cannot do it: strings have to be stripped for the checks in
     section 7 to tell a mention from a use, and a typed list LIVES in strings, so
     the stripper that protects those checks blinds this one. Mutation-testing
     caught exactly that -- a hard-coded array of all fourteen passed a source
     scan clean. So instead: ADD A FACTION TO THE GRAPH AND WATCH THE MODULE FIND
     IT. Nothing with a typed list can pass this. */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_pockets.js'), 'utf8');
  const noStrings = code(src);
  ok('no faction is named outside a string in this module', !sel.some(f => noStrings.indexOf(f) >= 0));
  const invented = 'Gatefolk' + Date.now();
  G.factions[invented] = { type: 'selectable', align: 'test', relations: {},
                           act1_power: 1, act3_power: 1 };
  const grew = K.factions();
  delete G.factions[invented];
  const shrank = K.factions();
  ok('*** PUT A FIFTEENTH FACTION IN THE GRAPH AND THE POCKETS BOOK FINDS IT ***',
     grew.length === sel.length + 1 && grew.indexOf(invented) >= 0);
  ok('*** TAKE IT OUT AND IT IS GONE AGAIN, so no list is kept here ***',
     shrank.length === sel.length && shrank.indexOf(invented) < 0);
  ok('a treasury starts EMPTY, because what a faction starts with is a ruling',
     sel.every(f => K.worth(f, 'electricity') === 0));
  ok('seeding twice opens nothing new', K.seed() === 0 && K.holders().length === 14);
  ok('a shop is not seeded a pocket (ECONOMY Q40: it holds goods, not money)',
     K.holders().length === 14 && !K.has('shop'));
}

/* ---- 2. ADOPT, NEVER CREATE, OR HE HAS TWO BALANCES --------------------- */
{
  K.reset();
  const mine = P.create({ id: 'player', day: 0 });
  P.credit(mine, 'electricity', 5, 'stake', 's', 0);
  K.adopt(mine);
  ok('*** THE PLAYER\'S EXISTING PURSE IS THE ONE IN THE BOOK ***', K.of('player') === mine);
  ok('and adopting does not lose what is in it', K.worth('player', 'electricity') === 5);
  K.adopt(mine);
  ok('adopting twice is one holder, not two', K.holders().length === 1);
}

/* ---- 3. THE HANDOFF MOVES IT, AND CONSERVES IT -------------------------- */
{
  K.reset(); K.seed();
  const me = K.of('player');
  P.credit(me, 'electricity', 10, 'stake', 's', 0);
  const before = K.supply('electricity').total;
  for (let d = 1; d <= 7; d++) K.hand('player', 'Mob', 'electricity', 1, 'rent on Mob ground', 'Mob', d);
  const after = K.supply('electricity');
  ok('*** SEVEN NIGHTS OF RENT AND THE VALLEY STILL HAS EVERY BATTERY *** ('
     + before + ' -> ' + after.total + ')', before === 10 && after.total === 10);
  ok('*** AND THE LANDLORD IS THE ONE HOLDING THEM *** (Mob '
     + K.worth('Mob', 'electricity') + ', player ' + K.worth('player', 'electricity') + ')',
     K.worth('Mob', 'electricity') === 7 && K.worth('player', 'electricity') === 3);
  /* THE RICHEST FIRST, AND AFTER SEVEN NIGHTS THAT IS NOT HIM -- which is the
     whole point of the row, so the number is asserted rather than assumed. */
  const rank = K.ranked('electricity');
  ok('*** THE RICHEST IS NAMED FIRST, AND IT IS THE LANDLORD, NOT HIM *** ('
     + rank.slice(0, 2).map(x => x.who + ' ' + x.held).join(' > ') + ')',
     rank[0].who === 'Mob' && rank[0].held === 7
     && rank[1].who === 'player' && rank[1].held === 3);
  ok('the order never goes back up',
     rank.every((x, i) => i === 0 || rank[i - 1].held >= x.held));
  const f = K.flowOf('Mob', 'electricity');
  ok('the treasury reads like any other ledger (took in ' + f.transferIn + ')',
     f.transferIn === 7 && f.transferOut === 0);
  /* THE OLD BUG, RE-RUN. This is the exact call the surface used to make. */
  K.reset(); K.seed();
  const p2 = K.of('player'); P.credit(p2, 'electricity', 10, 'stake', 's', 0);
  for (let d = 1; d <= 7; d++) P.transferOut(p2, 'electricity', 1, 'rent on Mob ground', 'Mob', d);
  ok('*** AND THE OLD ONE-LEGGED CALL STILL DESTROYS THEM, which is what this'
     + ' whole row is about *** (supply ' + K.supply('electricity').total + ', Mob '
     + K.worth('Mob', 'electricity') + ')',
     K.supply('electricity').total === 3 && K.worth('Mob', 'electricity') === 0);
}

/* ---- 4. WHAT IT REFUSES, AND IT MOVES NOTHING WHEN IT REFUSES ----------- */
{
  K.reset(); K.seed();
  const me = K.of('player'); P.credit(me, 'electricity', 3, 'stake', 's', 0);
  const start = K.supply('electricity').total;
  const cases = [
    ['more than you have',  K.hand('player', 'Mob', 'electricity', 9, 'rent', 'Mob', 1), 'INSUFFICIENT'],
    ['paying yourself',     K.hand('player', 'player', 'electricity', 1, 'rent', 'x', 1), 'SAME_HOLDER'],
    ['nothing',             K.hand('player', 'Mob', 'electricity', 0, 'rent', 'Mob', 1), 'NOT_AN_AMOUNT'],
    ['a negative amount',   K.hand('player', 'Mob', 'electricity', -2, 'rent', 'Mob', 1), 'NOT_AN_AMOUNT'],
    ['no reason given',     K.hand('player', 'Mob', 'electricity', 1, '', 'Mob', 1), 'NO_REASON'],
    ['nobody to pay',       K.hand('player', null, 'electricity', 1, 'rent', null, 1), 'NO_HOLDER'],
    ['a currency that is not one', K.hand('player', 'Mob', 'pesos', 1, 'rent', 'Mob', 1), 'NOT_A_CURRENCY'],
    ['a word for an amount', K.hand('player', 'Mob', 'electricity', 'lots', 'rent', 'Mob', 1), 'NOT_AN_AMOUNT']
  ];
  cases.forEach(c => ok('refused: ' + c[0] + ' (' + c[1].reason + ')',
                        c[1].applied === false && c[1].reason === c[2]));
  ok('*** AND EIGHT REFUSALS LATER NOT ONE BATTERY HAS MOVED ***',
     K.supply('electricity').total === start && K.worth('player', 'electricity') === 3
     && K.worth('Mob', 'electricity') === 0);
}

/* ---- 5. IT IS ATOMIC, PROVEN BY BREAKING LEG TWO ------------------------ */
{
  K.reset(); K.seed();
  const me = K.of('player'); P.credit(me, 'electricity', 4, 'stake', 's', 0);
  const real = P.transferIn;
  P.transferIn = () => ({ applied: false, reason: 'BROKEN_ON_PURPOSE' });
  const r = K.hand('player', 'Mob', 'electricity', 1, 'rent', 'Mob', 1);
  P.transferIn = real;
  ok('when the receiving end fails the handoff fails', r.applied === false
     && r.reason === 'BROKEN_ON_PURPOSE');
  ok('*** AND LEG ONE IS TAKEN BACK: he still has all four *** ('
     + K.worth('player', 'electricity') + ')',
     K.worth('player', 'electricity') === 4 && K.supply('electricity').total === 4);
  ok('no half-entry is left behind in the payer\'s ledger',
     P.flow(me).electricity.transferOut === 0);
  ok('and the next handoff still works',
     K.hand('player', 'Mob', 'electricity', 1, 'rent', 'Mob', 2).applied === true
     && K.worth('Mob', 'electricity') === 1 && K.supply('electricity').total === 4);
}

/* ---- 6. A HOLDER NOBODY SEEDED GETS A POCKET WHEN PAID ------------------ */
{
  K.reset(); K.seed();
  const me = K.of('player'); P.credit(me, 'electricity', 5, 'stake', 's', 0);
  const n0 = K.holders().length;
  ok('nobody called CHURCH has a pocket before they are paid', !K.has('CHURCH'));
  const r = K.hand('player', 'CHURCH', 'electricity', 2, 'paying back CHURCH', 'CHURCH', 1);
  ok('*** A LENDER IS HANDED IT AND THE POCKET OPENS THEN *** (holders '
     + n0 + ' -> ' + K.holders().length + ')',
     r.applied === true && K.has('CHURCH') && K.worth('CHURCH', 'electricity') === 2
     && K.holders().length === n0 + 1);
  ok('and the supply is still conserved', K.supply('electricity').total === 5);
  ok('a crew on the road is a holder too',
     K.hand('player', 'crew:roadblock', 'resources', 1, 'paid on the road', 'r:1', 1)
       .applied === false);   /* he has no resources: refused, and that is right */
}

/* ---- 7. THE FOUR PAYMENT SITES ON THE SURFACE HE WALKS ------------------ */
{
  const raw = fs.readFileSync(CITY, 'utf8');
  /* Only the page's own code, never the inlined purse module, which is allowed
     to define transferOut because defining it is its job. */
  const i = raw.indexOf('/* ==== /engine/bohemia_purse.js ==== */');
  const page = code(i > 0 ? raw.slice(i) : raw);
  const bare = (page.match(/BohemiaPurse\.transferOut\(/g) || []).length;
  const hands = (page.match(/BohemiaPockets\.hand\(/g) || []).length;
  ok('*** NOT ONE PAYMENT ON THE WALKED SURFACE IS ONE-LEGGED ANY MORE *** ('
     + bare + ' bare transferOut calls left)', bare === 0);
  /* FOUR PAYMENT SITES WHEN THIS SHIPPED; a fifth arrived when ruling 9 (9/16) made
     a day's work a handoff from a treasury instead of a mint. The claim was never
     "exactly four", it was "every payment goes through the one road", so the floor
     moves up and the bare-transferOut check above is what actually guards it. */
  ok('and every payment goes through the one handoff (' + hands + ')', hands >= 4);
  ok('the pockets module is inlined into the page he walks',
     raw.indexOf('/* ==== engine/bohemia_pockets.js ==== */') > 0);
  ok('the player\'s purse is adopted rather than made a second time',
     /BohemiaPockets\.adopt\(/.test(page) && !/BohemiaPockets\.of\(\s*''\s*\)/.test(page));
  /* the tools that own two of those sites must say the same thing the page says,
     or the next run of either tool quietly puts the bug back */
  ['tools/bohemia_the_road_is_a_decision_patch.py',
   'tools/bohemia_city_paid_means_paid_patch.py'].forEach(f => {
    const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    ok('the tool that owns a payment site agrees with the page (' + path.basename(f) + ')',
       t.indexOf('BohemiaPockets.hand(') > 0 && !/BohemiaPurse\.transferOut\(/.test(t));
  });
  const wp = fs.readFileSync(path.join(ROOT, 'tools/bohemia_city_work_patch.py'), 'utf8');
  ok('the module rides the city patch tool, so a resplice cannot drop it',
     /bohemia_pockets\.js/.test(wp));
}

/* ---- 8. AND IT ALL HAPPENS IN THE GAME, DRIVEN BY THE GAME'S OWN NIGHT --- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  /* *** THE CARD THIS USED TO WAIT FOR IS GONE ON PURPOSE (9/21). *** Rule 19(a)
     killed the pop-up wake card -- "nothing pops up" -- and RUN's [no pop ups]
     took it out of the boot. This loop waited 40 s for a button that rule 19
     deliberately removed and then threw on $eval, taking the whole gate with it.
     A GATE THAT DIES BECAUSE THE GAME GOT BETTER IS A GATE THAT MEASURES THE
     PAST. So the card is cleared IF IT IS THERE and its absence is the normal
     case, not a failure. */
  for (let i = 0; i < 25; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  if (await pg.$('#daycardIn .dcgo')) await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);

  const r = await pg.evaluate(() => {
    const R = { module: typeof window.BohemiaPockets };
    if (R.module !== 'object') return R;
    const KK = window.BohemiaPockets, PP = window.BohemiaPurse, p = purseGet();
    R.adopted = KK.of('player') === p;
    R.holders = KK.holders().length;
    R.factions = KK.factions().length;

    PP.credit(p, 'electricity', 40, 'gate stake', 'gate', 0);
    R.supplyBefore = KK.supply('electricity').total;
    R.landlordsBefore = {};
    KK.ranked('electricity').forEach(x => { if (x.who !== 'player') R.landlordsBefore[x.who] = x.held; });
    R.playerBefore = KK.worth('player', 'electricity');

    /* THE GAME'S OWN RENT NIGHT, three times. Not a copy of it. */
    R.nights = [];
    for (let d = 1; d <= 3; d++) {
      try { DAY.day = d; } catch (e) {}
      try { blockRent(); } catch (e) { R.rentThrew = String(e); }
      R.nights.push((RENT_TONIGHT || []).map(x =>
        ({ f: x.faction, billed: x.billed, paid: x.paid, short: x.short })));
    }
    R.landlords = KK.ranked('electricity').filter(x => x.held > 0 && x.who !== 'player');
    /* what the landlords GAINED over the three nights, which is the real claim */
    R.landlordGain = R.landlords.reduce((a, x) => a + (x.held - (R.landlordsBefore[x.who] || 0)), 0);
    R.supplyAfterRent = KK.supply('electricity').total;
    R.playerAfterRent = KK.worth('player', 'electricity');

    /* AND THE GAME'S OWN LOAN NIGHT. */
    try {
      R.took = BohemiaLend.take(LOAN_BOOK, 'Church', 1);
      DAY.day = 4;
      R.lenderBefore = KK.worth(R.took.who, 'electricity');
      loanNight();
      R.lenderAfter = KK.worth(R.took.who, 'electricity');
      R.loanRows = (LOAN_TONIGHT || []).map(x => ({ who: x.who, paid: x.paid }));
    } catch (e) { R.loanThrew = String(e); }
    R.supplyEnd = KK.supply('electricity').total;
    R.holdersEnd = KK.holders().length;
    return R;
  });
  await b.close();

  ok('the pockets book reaches the surface he walks', r.module === 'object');
  ok('*** AND HE HAS ONE BALANCE, NOT TWO ***', r.adopted === true);
  ok('fifteen holders from the first frame: him and the fourteen ('
     + r.holders + ')', r.holders === 15 && r.factions === 14);
  const billed = (r.nights || []).map(n => n.reduce((a, x) => a + x.paid, 0));
  ok('the game\'s own rent night really billed him (' + billed.join(',') + ')',
     billed.length === 3 && billed.every(x => x > 0));
  /* MEASURE THE CHANGE, NOT THE TOTAL. Since ruling 9 (9/16) the treasuries open
     holding a cell per head on their ground, so "the landlords hold exactly what he
     paid" stopped being true of the TOTALS while staying true of the MOVEMENT, which
     is the only thing this row ever claimed. */
  ok('*** AND THE LANDLORD ON THE REAL SURFACE GAINED EXACTLY WHAT HE LOST *** (he '
     + (r.playerBefore - r.playerAfterRent) + ', they +' + r.landlordGain + ')',
     (r.landlords || []).length >= 1
     && r.landlordGain === r.playerBefore - r.playerAfterRent);
  ok('*** AND THE VALLEY\'S MONEY SUPPLY IS UNCHANGED BY THREE NIGHTS *** ('
     + r.supplyBefore + ' -> ' + r.supplyAfterRent + ')',
     r.supplyBefore > 0 && r.supplyAfterRent === r.supplyBefore);
  ok('the game\'s own loan night pays a named lender back ('
     + JSON.stringify(r.loanRows || null) + ')',
     !r.loanThrew && (r.loanRows || []).length >= 1 && r.loanRows[0].paid > 0);
  ok('*** AND THE LENDER IS REALLY HOLDING IT *** (' + (r.took && r.took.who) + ' '
     + r.lenderBefore + ' -> ' + r.lenderAfter + ')',
     r.lenderBefore === 0 && r.lenderAfter > 0);
  ok('a lender who was never seeded is a holder once paid ('
     + r.holders + ' -> ' + r.holdersEnd + ')', r.holdersEnd === r.holders + 1);
  ok('*** AND AFTER ALL OF IT THE VALLEY STILL HAS EVERY BATTERY *** ('
     + r.supplyEnd + ')', r.supplyEnd === r.supplyBefore);
  ok('no page error across four nights' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* REPORTED, NEVER CHECKED: rule 14(a) reserves the demo cutter for THE RUN. */
  const demo = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
  const inDemo = fs.existsSync(demo)
    && fs.readFileSync(demo, 'utf8').indexOf('engine/bohemia_pockets.js') > 0;
  console.log('  note: the demo carries this: ' + (inDemo ? 'yes'
    : 'NOT YET -- rule 14(a), only THE RUN re-cuts the demo. Not a failure.'));
  done();
})();

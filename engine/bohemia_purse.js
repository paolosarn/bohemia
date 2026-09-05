// BOHEMIA PURSE — the player's three currencies, and the ledger that proves them.
// (7/31/26, WORLD lane. Paolo: "WE HAVE 11 months of forward motion work we need to
// complete. Do what you have to do next and know what comes after.")
//
// WHY THIS, NOW. records/BOHEMIA_THE_BIG_MISSING_7_29_26.md ranks the organs the game
// does not have. #1 is THE GAME DAY (wake -> quest -> travel -> resolve -> GET PAID ->
// spend -> sleep) and it is blocked on #3, THE ECONOMY, which is owned by this lane.
// Nothing in the valley pays anybody. The day loop cannot close until it does, so this
// is the highest-leverage thing WORLD can build: it unblocks another lane's #1.
//
// WHAT WAS ALREADY HERE, so this does not rebuild it:
//   engine/bohemia_economy.js   a SETTLEMENT scarcity sim — stock, decay, hyperbolic
//                               price under scarcity, priced in salvage-kg. That is the
//                               WORLD's economy: what a town has and what it costs.
//   engine/bohemia_loop.js      the clout/follower math (CLOUT_WEIGHTS, ruled 7/21).
//   bohemia_world_resolve.js    advances the settlement a day per spent moment.
// The hole between them is the PLAYER. There is no purse. Nothing credits, nothing
// debits, nothing can be spent. This is that, and only that.
//
// THE CURRENCIES ARE LOCKED AND THERE ARE EXACTLY THREE
// (laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md, Paolo 7/26, LOCKED):
//   RESOURCES    physical goods (apple = food, duct tape = materials; a third icon is
//                [PENDING Paolo])
//   ELECTRICITY  batteries, tech
//   CLOUT        producible by buildings, spendable in many ways
// THE ANTI-REFERENCE IS PART OF THE LAW: "games like that are called spreadsheet
// simulators and I'm not a fan". Civ-5 / Surviving-the-Aftermath multi-currency feel is
// BANNED. So: three balances, one ledger, six verbs. If this file ever needs a fourth
// currency or a second ledger, it has broken his ruling.
//
// RESEARCH — WHY A LEDGER AND NOT THREE COUNTERS. Game-economy practice models an economy
// as FAUCETS (sources, which create value from nothing) and SINKS/DRAINS (which destroy
// it), plus CONVERTERS and TRADERS that only move value around (Daniel Cook, "Value chains
// — a method for creating and balancing faucet-and-drain game economies", lostgarden 2021;
// the same source/drain/converter/trader vocabulary recurs across the live-ops literature).
// The failure mode everybody names is the same one: faucets are effectively infinite, so
// an economy inflates until currency is meaningless, and you cannot fix what you cannot
// measure. The literature also splits SOFT sinks (value moves to another holder — a
// transfer, which does NOT fight inflation) from HARD sinks (value is destroyed, which
// does). A bare counter cannot tell those apart. A ledger can, so:
//
//   1. BALANCES ARE DERIVED, NEVER SET. The entries are the truth and the balance is
//      their sum. There is no setter. A number nobody can explain is a bug you cannot
//      find at month 9 with a save file in your hand.
//   2. EVERY MOVEMENT DECLARES ITS KIND — source / drain / convert / transfer — so the
//      faucet-vs-sink pressure per currency is a measurement (see flow()), not a vibe.
//   3. EVERY MOVEMENT CARRIES A REASON AND A REF. No anonymous money, ever.
//   4. YOU CANNOT SPEND WHAT YOU DO NOT HAVE. A debit past zero is REFUSED and the
//      refusal is recorded. Balances never go negative, so no hidden debt system exists
//      by accident — debt would be canon, and canon is Paolo's.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S, HELD IN CODE AND NOT IN A COMMENT. The machine
// moves money. WHAT ANYTHING IS WORTH IS HIS — AND HE RULED IT, TWICE, AND FOR TWENTY
// DAYS NOBODY WROTE IT DOWN. 8/15: "just make everything cost one. Just start off with
// one and then I'll move from there." 9/4: "i dont want there to be money money maybe
// electronics like batteries are the currency. For one aa battery a bag of rice."
// So PAYOUT and PRICES carry his ONE, denominated in his BATTERY, and every value is
// TAGGED with the ruling behind it and `tuned:false`, which is the 8/15 law's own
// section 5: one generated list holds every number in the game and he tunes from it
// after a full playthrough. An uncovered key is still NO_RULING — never a guessed
// number, never a placeholder that quietly becomes canon by shipping. PRODUCTION is
// still empty and says why. This is the same shape as the faction beat predicate in
// bohemia_world_resolve.js, which is DEFAULT OFF structurally.
//
// ACT ONE ONLY (Paolo 7/28). The CENTURY RULE — dynasty choices compounding across three
// acts — is in the same locked addendum as the currencies, and it is deliberately NOT
// modelled here. Act-2/3 design is parked by his own ruling.
(function (root) {
  'use strict';

  /* the three, in his order. Frozen: a fourth breaks the anti-spreadsheet ruling. */
  var CURRENCIES = ['resources', 'electricity', 'clout'];

  /* the value-chain vocabulary, used as the ledger's own kinds:
       source    created from nothing and injected  (a FAUCET)
       drain     destroyed and gone                 (a HARD SINK — this is what fights inflation)
       convert   one currency became another        (neither; net-zero across the pair)
       transfer  moved to or from another holder    (a SOFT SINK — moves value, destroys none) */
  var KINDS = ['source', 'drain', 'convert', 'transfer'];

  var NO_RULING = 'NO_RULING';

  /* THE GOODS COME FROM THE SIM THAT OWNS THEM. In the browser the economy is
     inlined above this file; under node it is a sibling require. Either way the
     price table's KEYS cannot drift from the goods that exist. */
  var ECON = (typeof module !== 'undefined' && typeof require !== 'undefined')
    ? (function () { try { return require('./bohemia_economy.js'); } catch (e) { return null; } })()
    : (typeof BohemiaEconomy !== 'undefined' ? BohemiaEconomy
       : (root && root.BohemiaEconomy) || null);

  /* ---------------------------------------------------------------------------
     THE TABLES. THEY SHIPPED EMPTY FOR TWENTY DAYS AND HE HAD ALREADY RULED THEM.

     THE OLD COMMENT HERE SAID "ALL THREE SHIP EMPTY ... do not add sensible
     defaults", and it was right on 8/11 and wrong from 8/15 onward. He ruled the
     number on 8/15 -- "just make everything cost one. Just start off with one and
     then I'll move from there" -- and the ruling never reached the tables. For
     twenty days a finished job answered
     {"applied":false,"reason":"NO_RULING","table":"PAYOUT"} while placeholder_
     number_gate printed "the three tables are still EMPTY" INSIDE A GREEN PASS.
     MECHANISM-MINE / CONTENTS-PAOLO'S is not violated by filling these; it was
     violated by leaving a ruling of his unimplemented and calling that caution.

     AND 9/4 SAID WHAT THE ONE IS DENOMINATED IN: "i dont want there to be money
     money maybe electronics like batteries are the currency. For one aa battery a
     bag of rice and so on so forth." There is no abstract money. ELECTRICITY IS
     THE MEDIUM OF EXCHANGE -- food and tape are what you buy, batteries are what
     you buy them with, clout is what you cannot buy. No fourth currency; the three
     stand and one of them changed job.

     EVERY VALUE BELOW CARRIES `ruling` AND `tuned:false`, which is the 8/15 law's
     section 5 in code: one generated list holds every number in the game and he
     tunes from it after a full playthrough. placeholder_number_gate goes RED on an
     untagged number, so a hand-typed 7 with nothing behind it still cannot ship.
     --------------------------------------------------------------------------- */
  var RULED_ONE = '8/15 EVERYTHING COSTS ONE + 9/4 BATTERIES ARE THE MONEY';

  /* THE OWNER, SETTLED IN ONE LINE, because 8/11 and 8/15 handed this to two lanes
     and each could correctly believe it was the other's. 8/11: "whatever currency
     the quest decida to give" -- THE QUEST OWNS ITS OWN REWARD. 8/15: everything
     costs one -- THIS TABLE IS THE FALLBACK FOR A QUEST THAT DECLARES NOTHING.
     They compose and always did: payday.payForQuest prefers the quest's reward and
     falls through to here. Nothing changes in the code; the ownership is written
     down so the next lane does not wait for the other one again. */
  var PAYOUT = {
    /* a day's work pays a battery. FAIL is deliberately absent: what a failed job
       pays is not something he has said, and the honest answer to a question
       nobody asked is still NO_RULING (8/15 law section 4). */
    COMPLETE: { electricity: 1, ruling: RULED_ONE, tuned: false }
  };

  /* PRICES IS BUILT FROM THE GOODS THAT ACTUALLY EXIST, NEVER FROM A LIST TYPED
     HERE. engine/bohemia_economy.js already holds the goods -- water, food,
     salvage, meds, fuel, power and the field-surgery kit -- and a second list in
     this file would be a second system that drifts the day somebody adds a good.
     Same reason the street contract measures its connectors off the built tiles
     instead of a declaration. WHICH GOODS EXIST STAYS HIS; this reads them.
     The scarcity sim is untouched and still quotes: payday.buy() prefers this
     table, so the moment he takes a good out of it the sim prices it again. */
  var PRICES = (function () {
    var out = {}, g = ECON && ECON.GOODS, id;
    if (!g) return out;                       // no economy loaded: honest NO_RULING
    for (id in g) if (Object.prototype.hasOwnProperty.call(g, id))
      out[id] = { currency: 'electricity', amount: 1, ruling: RULED_ONE, tuned: false };
    return out;
  })();

  /* ---------------------------------------------------------------------------
     THE FOUR VERBS, FROZEN THE WAY THE THREE CURRENCIES ARE (9/5)
     BB-FOUR-VERBS-THREE-CURRENCIES, on his direction: "battle brothers has 3-4
     currencies too... how they manage it is superb."

     WHAT IS SUPERB ABOUT IT, IN ONE SENTENCE: YOU NEVER SPEND A RESOURCE, WHAT YOU
     DID SPENDS IT. In the game he named nobody allocates from a menu -- you FIGHT
     and the tools drain to fix what broke, you WALK and the men eat, you SHOOT and
     the quiver empties. Each resource is spent by exactly one verb, so you always
     know what took it, and there is no screen where any of it is managed. That is
     the anti-spreadsheet answer he has asked for since 7/26: THE RESOURCE IS THE
     SHADOW OF WHAT YOU DID.

     MEASURED 9/5, before this existed: the ONLY debit in the whole game was buying
     at a market, one caller. CLOUT had never moved in either direction. So walking
     was free, fighting was free, holding ground was free, asking was free, and the
     only thing that cost anything was shopping.

     IT IS A TABLE AND NOT FOUR CALLS TO debit() ON PURPOSE. A frozen list is the
     mechanism that stops a fifth verb appearing quietly, exactly as CURRENCIES is
     the mechanism that stops a fourth currency -- his law freezes three and the
     anti-spreadsheet ruling dies the day somebody adds one by hand. An undeclared
     verb is REFUSED here, not silently posted.
     AND THE AMOUNT IS 1 AND CANNOT BE PASSED IN. EVERYTHING COSTS ONE (8/15) is
     his ruling, and a caller that could pass 2 would be a place for a number
     nobody ruled to enter the game. When he tunes, he tunes this line.
     --------------------------------------------------------------------------- */
  var VERBS = {
    /* THE DAY EATS FOOD -- the people who depend on you ate. No meter on the
       player's body: he is not hungry, THEY are. */
    'day:ate':     { currency: 'resources',   about: 'the people who depend on you ate' },
    /* THE FIGHT EATS TAPE -- the plate you wore at the bell is spent. COMBAT owns
       what a plate does; this owns what it costs. */
    'fight:plate': { currency: 'resources',   about: 'the plate you wore at the bell is spent' },
    /* THE NIGHT EATS POWER -- every lit circuit you hold burns one, which is what
       turns territory into a bill. */
    'night:power': { currency: 'electricity', about: 'every lit circuit you hold burned one' },
    /* ASKING EATS CLOUT -- you leaned on somebody. */
    'ask:leaned':  { currency: 'clout',       about: 'you leaned on somebody' }
  };

  /* A VERB SPENDS. The only way anything but a purchase leaves the purse.
     Returns the ledger's own answer verbatim, INCLUDING its refusal, because a
     caller has to be able to tell "it cost nothing" from "you could not pay" --
     and "you could not pay" is the whole game: run out of food and your people
     stop showing up, run out of power and the block goes dark. */
  function upkeep(purse, verb, ref, day) {
    var v = Object.prototype.hasOwnProperty.call(VERBS, verb) ? VERBS[verb] : null;
    if (!v) return { applied: false, reason: 'NO_SUCH_VERB', verb: verb,
                     about: 'the four verbs are frozen; a fifth is a design change, ' +
                            'and design changes are Paolo\'s' };
    return debit(purse, v.currency, 1, verb, ref || null, day);
  }

  /* PRODUCTION STAYS EMPTY AND IT IS NOT AN OVERSIGHT. Measured 9/5: `produce()`
     has ZERO callers anywhere in the engine or the walked surface, so there is no
     buildingId vocabulary to key on and every row I could write here would be dead
     data nobody reads. A number with no consumer is not content, it is decoration.
     It fills the day something calls it and the ids are real. */
  var PRODUCTION = {};    // buildingId       -> per-day yield   [no caller yet, 9/5]

  function isCurrency(c) { return CURRENCIES.indexOf(c) >= 0; }

  function create(opts) {
    opts = opts || {};
    return { entries: [], day: opts.day || 0, id: opts.id || 'player' };
  }

  /* BALANCE IS A SUM, NOT A FIELD. This is the whole design in one function. */
  function balance(purse, currency) {
    if (!purse || !isCurrency(currency)) return 0;
    var n = 0;
    for (var i = 0; i < purse.entries.length; i++) {
      var e = purse.entries[i];
      if (e.currency === currency) n += e.amount;
    }
    return n;
  }

  function balances(purse) {
    var out = {};
    for (var i = 0; i < CURRENCIES.length; i++) out[CURRENCIES[i]] = balance(purse, CURRENCIES[i]);
    return out;
  }

  /* the one private writer. Everything public goes through it, so there is exactly one
     place where the ledger can grow and exactly one set of rules to satisfy. */
  function _post(purse, currency, amount, kind, reason, ref, day) {
    if (!purse) return { applied: false, reason: 'NO_PURSE' };
    if (!isCurrency(currency)) return { applied: false, reason: 'NOT_A_CURRENCY', currency: currency };
    if (KINDS.indexOf(kind) < 0) return { applied: false, reason: 'NOT_A_KIND', kind: kind };
    if (typeof amount !== 'number' || !isFinite(amount) || amount === 0)
      return { applied: false, reason: 'NOT_AN_AMOUNT', amount: amount };
    /* NO ANONYMOUS MONEY. A movement with no reason is a movement nobody can debug. */
    if (!reason) return { applied: false, reason: 'NO_REASON' };
    /* YOU CANNOT SPEND WHAT YOU DO NOT HAVE, and the refusal is part of the record. */
    if (amount < 0 && balance(purse, currency) + amount < 0) {
      var short = -(balance(purse, currency) + amount);
      return { applied: false, reason: 'INSUFFICIENT', currency: currency,
               have: balance(purse, currency), wanted: -amount, short: short };
    }
    var entry = { currency: currency, amount: amount, kind: kind, reason: reason,
                  ref: ref == null ? null : ref, day: day == null ? purse.day : day,
                  seq: purse.entries.length };
    purse.entries.push(entry);
    return { applied: true, entry: entry, balance: balance(purse, currency) };
  }

  /* the six verbs. That is the entire surface — the anti-spreadsheet ruling is an API
     constraint here, not a note. */
  function credit(purse, currency, amount, reason, ref, day) {
    return _post(purse, currency, Math.abs(amount), 'source', reason, ref, day);
  }
  function debit(purse, currency, amount, reason, ref, day) {
    return _post(purse, currency, -Math.abs(amount), 'drain', reason, ref, day);
  }
  function transferOut(purse, currency, amount, reason, ref, day) {
    return _post(purse, currency, -Math.abs(amount), 'transfer', reason, ref, day);
  }
  function transferIn(purse, currency, amount, reason, ref, day) {
    return _post(purse, currency, Math.abs(amount), 'transfer', reason, ref, day);
  }

  /* CONVERT is the only two-legged movement, and it is ATOMIC: if the outgoing leg is
     refused, the incoming leg never happens. A half-applied conversion would mint or
     burn currency silently, which is the exact class of bug the ledger exists to make
     impossible. The RATE is not here -- a rate is a price and prices are Paolo's. */
  function convert(purse, fromCur, fromAmt, toCur, toAmt, reason, ref, day) {
    if (!reason) return { applied: false, reason: 'NO_REASON' };
    var out = _post(purse, fromCur, -Math.abs(fromAmt), 'convert', reason, ref, day);
    if (!out.applied) return out;
    var back = _post(purse, toCur, Math.abs(toAmt), 'convert', reason, ref, day);
    if (!back.applied) { purse.entries.pop(); return back; }   // atomic: unwind leg one
    return { applied: true, out: out.entry, in: back.entry, balances: balances(purse) };
  }

  /* ---------------------------------------------------------------------------
     THE RULED EDGES. Each one asks its table and, finding it empty, says so. This is
     the mechanism/contents split executed rather than described: the pipe is finished
     and connected, and it carries nothing until he rules the numbers.
     --------------------------------------------------------------------------- */

  /* A quest was completed. The loop already fires an outcome event carrying the quest's
     own clout tag (#quiet/#notable/#risky/#reckless, ruled 7/21). What that is WORTH is
     not ruled, so nothing is paid and the caller is told exactly why. */
  function payQuest(purse, ev, day) {
    if (!ev) return { applied: false, reason: 'NO_EVENT' };
    var key = ev.outcome || (ev.tags && ev.tags[0]) || null;
    var row = key && Object.prototype.hasOwnProperty.call(PAYOUT, key) ? PAYOUT[key] : null;
    if (!row) return { applied: false, reason: NO_RULING, table: 'PAYOUT', key: key,
                       about: 'what a quest outcome pays is Paolo\'s ruling' };
    /* ONE SHAPE FOR `paid`, WHICHEVER PATH PAID IT. This returned the raw ledger
       entries while payday's quest-declared path returns a {currency: amount} MAP, and
       the reckoning card on the walked surface renders `paid` with a for-in -- so the
       table path would have printed the ledger's guts at the player. It never showed
       because this branch had never once applied: the table was empty for twenty days.
       A branch that has never executed is not code, it is an intention (second one
       found in this pipe today, after payday.price returning a whole row). */
    var done = [], paid = {};
    for (var i = 0; i < CURRENCIES.length; i++) {
      var c = CURRENCIES[i];
      if (row[c]) { done.push(credit(purse, c, row[c], 'quest:' + key, ev.questId || null, day));
                    paid[c] = row[c]; }
    }
    return { applied: done.length > 0, paid: paid, entries: done, balances: balances(purse) };
  }

  /* Buy something. An empty price table means the shop is real and the tag on the shelf
     is blank -- which is honest, and is not the same as free. */
  function spend(purse, goodId, day) {
    var row = Object.prototype.hasOwnProperty.call(PRICES, goodId) ? PRICES[goodId] : null;
    if (!row) return { applied: false, reason: NO_RULING, table: 'PRICES', key: goodId,
                       about: 'what a thing costs is Paolo\'s ruling' };
    return debit(purse, row.currency, row.amount, 'buy:' + goodId, goodId, day);
  }

  /* A building produced its day. Same shape, same silence. */
  function produce(purse, buildingId, day) {
    var row = Object.prototype.hasOwnProperty.call(PRODUCTION, buildingId) ? PRODUCTION[buildingId] : null;
    if (!row) return { applied: false, reason: NO_RULING, table: 'PRODUCTION', key: buildingId,
                       about: 'what a building produces is Paolo\'s ruling' };
    var done = [];
    for (var i = 0; i < CURRENCIES.length; i++) {
      var c = CURRENCIES[i];
      if (row[c]) done.push(credit(purse, c, row[c], 'produce:' + buildingId, buildingId, day));
    }
    return { applied: done.length > 0, made: done, balances: balances(purse) };
  }

  /* ---------------------------------------------------------------------------
     MEASUREMENT. The reason the ledger carries kinds: faucet pressure against hard-sink
     pressure, per currency. When the tables are filled in, THIS is the number that says
     whether the economy inflates -- and it is available on day one instead of being
     reconstructed from a save file at month nine.
     --------------------------------------------------------------------------- */
  function flow(purse) {
    var out = {};
    for (var i = 0; i < CURRENCIES.length; i++) {
      out[CURRENCIES[i]] = { source: 0, drain: 0, convertIn: 0, convertOut: 0,
                             transferIn: 0, transferOut: 0, net: 0 };
    }
    for (var j = 0; j < (purse ? purse.entries.length : 0); j++) {
      var e = purse.entries[j], b = out[e.currency];
      if (!b) continue;
      b.net += e.amount;
      if (e.kind === 'source') b.source += e.amount;
      else if (e.kind === 'drain') b.drain += -e.amount;
      else if (e.kind === 'convert') { if (e.amount > 0) b.convertIn += e.amount; else b.convertOut += -e.amount; }
      else if (e.kind === 'transfer') { if (e.amount > 0) b.transferIn += e.amount; else b.transferOut += -e.amount; }
    }
    return out;
  }

  /* AUDIT: the ledger is the truth, so prove it. Every entry is well-formed, every
     balance equals the sum of its entries, nothing ever went negative at any point in
     history, and no movement is anonymous. This runs over the WHOLE history, not the
     end state, because "it balances now" hides a balance that went negative on day 3. */
  function audit(purse) {
    var problems = [];
    if (!purse || !purse.entries) return { ok: false, problems: ['NO_PURSE'] };
    var running = {}, i;
    for (i = 0; i < CURRENCIES.length; i++) running[CURRENCIES[i]] = 0;
    for (i = 0; i < purse.entries.length; i++) {
      var e = purse.entries[i];
      if (!isCurrency(e.currency)) problems.push('entry ' + i + ': not a currency (' + e.currency + ')');
      if (KINDS.indexOf(e.kind) < 0) problems.push('entry ' + i + ': not a kind (' + e.kind + ')');
      if (!e.reason) problems.push('entry ' + i + ': anonymous movement, no reason');
      if (typeof e.amount !== 'number' || !isFinite(e.amount) || e.amount === 0)
        problems.push('entry ' + i + ': bad amount (' + e.amount + ')');
      if (e.seq !== i) problems.push('entry ' + i + ': sequence broken (seq ' + e.seq + ')');
      if (running[e.currency] !== undefined) {
        running[e.currency] += e.amount;
        if (running[e.currency] < 0)
          problems.push('entry ' + i + ': ' + e.currency + ' went negative in history');
      }
    }
    var b = balances(purse);
    for (i = 0; i < CURRENCIES.length; i++) {
      var c = CURRENCIES[i];
      if (b[c] !== running[c]) problems.push(c + ': balance ' + b[c] + ' != ledger sum ' + running[c]);
    }
    return { ok: problems.length === 0, problems: problems, balances: b };
  }

  /* the whole story of one currency, or of everything, newest last. */
  function history(purse, currency) {
    if (!purse) return [];
    return purse.entries.filter(function (e) { return !currency || e.currency === currency; });
  }

  /* Save/restore is the entries. Nothing else is state, because nothing else is truth. */
  function save(purse) { return { id: purse.id, day: purse.day, entries: purse.entries.slice() }; }
  function load(blob) {
    var p = create({ id: (blob && blob.id) || 'player', day: (blob && blob.day) || 0 });
    p.entries = (blob && blob.entries) ? blob.entries.slice() : [];
    return p;
  }

  var API = {
    CURRENCIES: CURRENCIES, KINDS: KINDS, NO_RULING: NO_RULING,
    PAYOUT: PAYOUT, PRICES: PRICES, PRODUCTION: PRODUCTION,
    create: create, balance: balance, balances: balances,
    credit: credit, debit: debit, transferIn: transferIn, transferOut: transferOut,
    convert: convert,
    payQuest: payQuest, spend: spend, produce: produce,
    VERBS: VERBS, upkeep: upkeep,
    flow: flow, audit: audit, history: history, save: save, load: load
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaPurse = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

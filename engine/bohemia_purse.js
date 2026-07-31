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
// moves money. WHAT ANYTHING IS WORTH IS HIS. So PAYOUT, PRICES and PRODUCTION ship
// EMPTY, and with an empty table the answer is NO_RULING — never a guessed number, never
// a placeholder that quietly becomes canon by shipping. This is the same shape as the
// faction beat predicate in bohemia_world_resolve.js, which is DEFAULT OFF structurally.
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

  /* ---------------------------------------------------------------------------
     THE TABLES. ALL THREE SHIP EMPTY. They are the CONTENTS half of the law and
     they are Paolo's alone. Do not fill these in. Do not add "sensible defaults".
     A placeholder number that ships is canon nobody ruled.
     --------------------------------------------------------------------------- */
  var PAYOUT = {};        // questOutcome/tag -> {resources, electricity, clout}  [PENDING Paolo]
  var PRICES = {};        // goodId           -> {currency, amount}               [PENDING Paolo]
  var PRODUCTION = {};    // buildingId       -> per-day yield                    [PENDING Paolo]

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
    var done = [];
    for (var i = 0; i < CURRENCIES.length; i++) {
      var c = CURRENCIES[i];
      if (row[c]) done.push(credit(purse, c, row[c], 'quest:' + key, ev.questId || null, day));
    }
    return { applied: done.length > 0, paid: done, balances: balances(purse) };
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
    flow: flow, audit: audit, history: history, save: save, load: load
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaPurse = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

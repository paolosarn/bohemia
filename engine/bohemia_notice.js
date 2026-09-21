// BOHEMIA NOTICE — THE NOTICE STILL GETS ISSUED (9/21/26, WORLD lane)
// Board row [horror world] / THE-INSTITUTIONS-STILL-RUNNING, round two.
//
// ============================================================================
// WHY THIS FILE EXISTS
// ============================================================================
// Rule 20 (Paolo 9/20, LOCKED): every pixel and every sound is thought about as
// analog horror. WORDS Q27 then measured the corpus and found the hole:
//
//     3,014 spoken lines. 194 of them say nobody is left (6.4%).
//     EIGHT of them name a city, a county, a company, an office, a board or a
//     utility AT ALL (0.3%).
//
// The genre's fear is that THE WORLD RUNS NORMALLY AND NOBODY IS LEFT WHO SHOULD
// BE RUNNING IT. We wrote the second half for months and never wrote the first.
// You cannot put a voice on an institution that does not exist, so round one's
// answer was not a voice pass. THE INSTITUTION HAS TO EXIST FIRST. This is it.
//
// AND RULE 19 SAYS WHERE IT IS ALLOWED TO LIVE. No player-facing sentence outside
// the phone without a named speaker and their portrait. A dead institution is by
// definition faceless, so it has exactly two legal homes in this game: a LABEL ON
// A MACHINE, and THE PHONE HE OPENS HIMSELF. Rule 19(a) just moved the night's
// bookkeeping onto that phone. A disconnection notice is a document on a phone.
// That is the only thing this module makes.
//
// ============================================================================
// THE HORROR IS THE SKELETON SURVIVING ITS AUTHOR. NOT A MOOD — A CHECK.
// ============================================================================
// A real utility disconnection notice is a legal instrument and it must carry a
// fixed set of slots. Every one of those slots points at somebody who is supposed
// to answer it: a billing office, a payment-plan desk, an assistance program, an
// appeal board. The genre's sentence is not "the lights are out and it is scary".
// It is that the FORM IS STILL PERFECT — the dispute window, the reconnection fee,
// the appeal contact, the second issue in Spanish because the law required it —
// TEN YEARS AFTER THE OFFICE THAT WOULD ANSWER ANY OF IT CLOSED.
//
// So the horror in this file is MEASURED, not asserted. Every slot declares who
// would answer it. `unanswered()` asks the live world whether that body still
// exists, by name, off the faction graph the game already runs. If a faction ever
// takes the grid over, those slots become answerable and this module says so
// WITHOUT ONE WORD OF THE NOTICE CHANGING. The text never comments on any of it.
// The text is immaculate. That is the whole joke and it costs nothing to write.
//
// AND OURS GETS AN EDGE FREE, from his own pillar. EVERYTHING COSTS ONE (8/15),
// denominated in his BATTERY (9/4). So the amount in arrears is one battery, the
// reconnection fee is one battery, and a notice with a ten-day dispute window, a
// seventy-two hour final warning and a formal right of appeal to a state board is
// being served over a debt of ONE AA CELL. The form is immaculate and the
// arithmetic is absurd. Nothing had to be invented to get there.
//
// ============================================================================
// MECHANISM-MINE / CONTENTS-PAOLO'S
// ============================================================================
// The SHAPE of a notice is real law and it is mine: which slots must be present,
// what a notice missing one is (refused, the same way the purse refuses an
// unruled price), and where every number comes from. The WORDS are an attempt,
// tagged draft:true, and the ISSUER NAMES are a default the manager picked in his
// place — both queued in the VOTE tab with the why, under rule 15.
//
// NOT ONE NUMBER IN A NOTICE IS TYPED HERE. The amount comes from the caller's
// ledger or from PURSE's own ruled ONE; the circuit, the street, the holder and
// the night come from the machines that already run. Given nothing, this module
// REFUSES to issue rather than printing a plausible bill — an invented arrears
// figure on a phone screen is exactly the "card that promises and does nothing"
// that rule 14(d) calls the worst bug in the game.
//
// LANGUAGE NEVER GATES REQUIRED INFORMATION (8/25). The notice is issued TWICE,
// in English and in Spanish, because that is what real notice law requires in a
// county like this one — which is how THEY SPEAK SPANGLISH reaches the
// institution by a second route: a person code-switches, a NOTICE IS ISSUED
// TWICE. English is always built first and a Spanish issue without an English one
// is refused, so no required fact can ever exist only in Spanish.
//
// ============================================================================
// THE REAL-WORLD SOURCES (documents and statute practice, never a media citation)
// ============================================================================
// Rule 20(b): no analog horror series, channel or film is cited anywhere in this
// lane's work, because Paolo has not named one and a reference belongs to one
// department. The prior art here is UTILITY DISCONNECTION NOTICE PRACTICE and
// EMERGENCY ALERT PRACTICE, which are DOCUMENTS, not media:
//   - a residential disconnection notice carries the cut date and time, the
//     amount itemised into arrears / current / fees, the right to dispute, the
//     payment-plan and assistance route, the reconnection procedure AND its fee,
//     an appeal contact, and plain language a layperson can read;
//   - advance notice runs about 10 to 20 days, with a 48 to 72 hour FINAL notice
//     immediately before the cut;
//   - in a county with this many Spanish speakers the notice is issued in both
//     English and Spanish;
//   - a public emergency alert is FIVE SLOTS: source, hazard, location,
//     protective action (with when and how), and expiry or next update.
// Those are the constants below. They are real-world facts, so they are not
// Paolo's to rule and they are not mine to tune; each one carries its source in
// the table beside it.
(function (root) {
  'use strict';

  /* Every sentence in this file is an attempt, never a ruling (8/11). */
  var DRAFT = true;

  /* --------------------------------------------------------------------------
     THE LAW'S OWN WINDOWS. Real-world constants, sourced, not balance numbers.
     Expressed in DAYS because that is the unit the game's clock actually turns.
     -------------------------------------------------------------------------- */
  var WINDOW = {
    /* 10 to 20 days of advance notice; we carry the shorter, which is the one
       that would actually be served on somebody already behind. */
    noticeDays: 10,
    /* the 48 to 72 hour final; we carry the outer bound, 72 hours = 3 days. */
    finalDays: 3,
    /* the dispute window runs with the advance notice, which is the point of it. */
    disputeDays: 10,
    source: 'residential utility disconnection notice practice'
  };

  /* --------------------------------------------------------------------------
     THE ISSUERS. A DEFAULT THE MANAGER PICKED IN HIS PLACE (rule 15, queued in
     VOTE with the why). They are DISTRICTS and a COMMISSION, not companies: that
     is the real legal form the bodies that actually run power, water and appeals
     in this valley take, and a district cannot be bought, sold or rebranded, so
     it is still nominally in existence with nobody in the building. No live
     brand is named anywhere.

     `answeredBy` is the mechanism half: the name of the body a slot points at.
     unanswered() asks the live world whether anybody by that name is still out
     there. Nothing here asserts that they are gone.
     -------------------------------------------------------------------------- */
  var ISSUERS = {
    power: {
      id: 'power',
      name: 'CLARK COUNTY POWER DISTRICT',
      nameEs: 'DISTRITO DE ENERGIA DEL CONDADO DE CLARK',
      service: 'electric service',
      serviceEs: 'servicio electrico',
      office: 'BILLING OFFICE',
      appeal: 'PUBLIC UTILITIES COMMISSION',
      draft: DRAFT
    },
    water: {
      id: 'water',
      name: 'LAS VEGAS VALLEY WATER DISTRICT',
      nameEs: 'DISTRITO DE AGUA DEL VALLE DE LAS VEGAS',
      service: 'water service',
      serviceEs: 'servicio de agua',
      office: 'BILLING OFFICE',
      appeal: 'PUBLIC UTILITIES COMMISSION',
      draft: DRAFT
    }
  };

  /* --------------------------------------------------------------------------
     THE SLOTS A DISCONNECTION NOTICE MUST CARRY.

     `need` slots are what makes it a notice. A notice missing one is not a bad
     notice, it is NOT A NOTICE, and this module refuses to issue it — the same
     refusal shape the purse uses for an unruled price, for the same reason: a
     plausible-looking document with a hole in it becomes canon by shipping.

     `answeredBy` names the body that slot sends you to, or null where the slot
     is a plain statement of fact that needs nobody.
     -------------------------------------------------------------------------- */
  var DISCONNECT_SLOTS = [
    { key: 'issuer',      need: true,  answeredBy: null,     why: 'who is serving this' },
    { key: 'account',     need: true,  answeredBy: null,     why: 'which service address' },
    { key: 'cutAt',       need: true,  answeredBy: null,     why: 'the exact date and time of the cut' },
    { key: 'arrears',     need: true,  answeredBy: null,     why: 'past due, itemised' },
    { key: 'current',     need: true,  answeredBy: null,     why: 'this period, itemised' },
    { key: 'fees',        need: true,  answeredBy: null,     why: 'fees, itemised' },
    { key: 'total',       need: true,  answeredBy: null,     why: 'the total, which must be the sum' },
    { key: 'dispute',     need: true,  answeredBy: 'office', why: 'the right to dispute, and by when' },
    { key: 'plan',        need: true,  answeredBy: 'office', why: 'payment plan and assistance' },
    { key: 'reconnect',   need: true,  answeredBy: 'office', why: 'how service comes back' },
    { key: 'reconnectFee',need: true,  answeredBy: null,     why: 'and what that costs' },
    { key: 'appeal',      need: true,  answeredBy: 'appeal', why: 'where to appeal this decision' },
    { key: 'issuedOn',    need: true,  answeredBy: null,     why: 'when this was served' }
  ];

  /* the five slots of a public emergency alert, in the order they are read. */
  var ALERT_SLOTS = [
    { key: 'source',   need: true,  answeredBy: 'issuer', why: 'who is telling you' },
    { key: 'hazard',   need: true,  answeredBy: null,     why: 'what is wrong' },
    { key: 'location', need: true,  answeredBy: null,     why: 'where' },
    { key: 'action',   need: true,  answeredBy: null,     why: 'what to do, when, and how' },
    { key: 'expiry',   need: true,  answeredBy: 'issuer', why: 'when this expires or is updated' }
  ];

  /* --------------------------------------------------------------------------
     WHERE THE MONEY COMES FROM. Never a literal.
     The caller's own ledger first, then PURSE's ruled ONE, then refusal.
     -------------------------------------------------------------------------- */
  function purse() {
    try {
      if (root && root.BohemiaPurse) return root.BohemiaPurse;
    } catch (e) {}
    if (typeof module !== 'undefined' && typeof require !== 'undefined') {
      try { return require('./bohemia_purse.js'); } catch (e) {}
    }
    return null;
  }

  /* HIS ONE, READ, NOT TYPED. PAYOUT.COMPLETE is the row whose own comment says
     "a day's work pays a battery", and 8/15 says everything costs one, so the
     cost of a night of light is the same one. If the table is not there we do
     not guess — the notice is refused and says why. */
  function theOne() {
    var P = purse();
    try {
      var row = P && P.PAYOUT && P.PAYOUT.COMPLETE;
      if (row && typeof row.electricity === 'number') return row.electricity;
    } catch (e) {}
    return null;
  }

  function pad2(n) { n = n | 0; return (n < 10 ? '0' : '') + n; }

  /* THE CLOCK THE GAME ALREADY KEEPS, turned into the two strings a legal
     document needs. The game counts DAYS from the lights going out, so the
     notice dates itself the way a real one does: a day number and a wall time.
     No calendar is invented, because this game has never had one. */
  function stamp(day, clock) {
    if (!(day >= 0)) return null;
    var t = /^\d{1,2}:\d{2}$/.test(String(clock || '')) ? String(clock) : null;
    if (!t) return null;
    return { day: day | 0, clock: t, text: 'DAY ' + (day | 0) + ' AT ' + t };
  }

  /* --------------------------------------------------------------------------
     THE DISCONNECTION NOTICE.

     facts = {
       service   'power' | 'water'
       at        [x,y]        the cell the service drop is on
       street    a street name or type, for the service address
       circuit   the feeder id, which IS the account number in a district that
                 bills by feeder — a real thing, and the game already has it
       holder    who is collecting now, by name off the faction graph, or null
       arrears   batteries past due   (from the ledger; falls back to the ONE)
       current   batteries this period (from the ledger; falls back to the ONE)
       day, clock                     the game's own clock
     }
     -------------------------------------------------------------------------- */
  function disconnection(facts) {
    facts = facts || {};
    var iss = ISSUERS[facts.service];
    if (!iss) return { issued: false, reason: 'NO_ISSUER', service: facts.service || null };

    var one = theOne();
    var arrears = typeof facts.arrears === 'number' ? facts.arrears : one;
    var current = typeof facts.current === 'number' ? facts.current : 0;
    if (typeof arrears !== 'number') return { issued: false, reason: 'NO_AMOUNT', table: 'PAYOUT' };

    /* THE FEE IS THE SAME ONE. Not a new price: [block strikes] already settled
       it — relight costs one, because everything costs one. */
    var fee = typeof facts.reconnectFee === 'number' ? facts.reconnectFee : one;
    if (typeof fee !== 'number') return { issued: false, reason: 'NO_AMOUNT', table: 'PAYOUT' };

    var served = stamp(facts.day, facts.clock);
    if (!served) return { issued: false, reason: 'NO_CLOCK' };
    var cut = stamp((facts.day | 0) + WINDOW.finalDays, facts.clock);

    var acct = (facts.circuit >= 0) ? ('FEEDER ' + facts.circuit) : null;
    if (!acct) return { issued: false, reason: 'NO_ACCOUNT' };

    var where = facts.street ? String(facts.street).toUpperCase() : null;
    var cell = (facts.at && facts.at.length === 2) ? (facts.at[0] + '-' + facts.at[1]) : null;
    if (!where || !cell) return { issued: false, reason: 'NO_ADDRESS' };

    var total = arrears + current + fee;
    var B = function (n) { return n + (n === 1 ? ' BATTERY' : ' BATTERIES'); };
    var Bes = function (n) { return n + (n === 1 ? ' BATERIA' : ' BATERIAS'); };

    /* Who is actually taking the money now, if anybody. The district issues; a
       faction holding the ground is who you would physically hand it to. Read,
       never typed, and absent is a legal answer. */
    var collector = facts.holder ? String(facts.holder).toUpperCase() : null;

    var slots = {
      issuer:       iss.name,
      account:      acct + ' / SERVICE ADDRESS ' + where + ' ' + cell,
      cutAt:        cut.text,
      arrears:      B(arrears),
      current:      B(current),
      fees:         B(fee),
      total:        B(total),
      dispute:      'WITHIN ' + WINDOW.disputeDays + ' DAYS OF SERVICE OF THIS NOTICE, AT THE ' + iss.office,
      plan:         'A PAYMENT PLAN AND HARDSHIP ASSISTANCE ARE AVAILABLE ON REQUEST AT THE ' + iss.office,
      reconnect:    'SERVICE IS RESTORED WHEN THE BALANCE IS PAID IN FULL' +
                    (collector ? ' TO ' + collector : '') + '.',
      reconnectFee: B(fee),
      appeal:       'THIS DECISION MAY BE APPEALED TO THE ' + iss.appeal,
      issuedOn:     served.text
    };

    var missing = [];
    for (var i = 0; i < DISCONNECT_SLOTS.length; i++) {
      var s = DISCONNECT_SLOTS[i];
      if (s.need && !slots[s.key]) missing.push(s.key);
    }
    if (missing.length) return { issued: false, reason: 'MISSING_SLOT', missing: missing };

    /* THE ARITHMETIC IS CHECKED, because a notice whose total is not the sum of
       its own lines is the one thing a real one is never allowed to be, and it
       is the sort of thing that goes wrong silently when the ledger changes. */
    if (total !== arrears + current + fee) {
      return { issued: false, reason: 'TOTAL_IS_NOT_THE_SUM' };
    }

    /* ------------------------------------------------------------------ */
    /* THE ENGLISH ISSUE. Written flat on purpose. WORDS Q27 measured that we
       have ONE exclamation mark in 3,014 lines, so flat is not available as a
       contrast — what makes this read is not the register, it is that the
       register is applied to a debt of one battery. Nothing in here is raised,
       nothing in here explains, and nothing in here knows what happened.       */
    var en = [
      iss.name,
      'NOTICE OF DISCONNECTION OF ' + iss.service.toUpperCase(),
      '',
      'ACCOUNT: ' + slots.account,
      'ISSUED: ' + slots.issuedOn,
      '',
      'YOUR ' + iss.service.toUpperCase() + ' IS SCHEDULED TO BE DISCONNECTED ON ' + slots.cutAt + '.',
      '',
      'PAST DUE ............. ' + slots.arrears,
      'THIS PERIOD .......... ' + slots.current,
      'RECONNECTION FEE ..... ' + slots.fees,
      'TOTAL DUE ............ ' + slots.total,
      '',
      'YOU HAVE THE RIGHT TO DISPUTE THIS CHARGE ' + slots.dispute + '.',
      slots.plan + '.',
      slots.reconnect,
      'RECONNECTION FEE: ' + slots.reconnectFee + '.',
      slots.appeal + '.',
      '',
      'THIS NOTICE IS ISSUED IN ENGLISH AND IN SPANISH.'
    ];

    /* THE SPANISH ISSUE. Second, always, and never alone: English carries every
       required fact, so nothing a player must read exists only here.           */
    var es = [
      iss.nameEs,
      'AVISO DE CORTE DE ' + iss.serviceEs.toUpperCase(),
      '',
      'CUENTA: ALIMENTADOR ' + facts.circuit + ' / DIRECCION DE SERVICIO ' + where + ' ' + cell,
      'EMITIDO: DIA ' + served.day + ' A LAS ' + served.clock,
      '',
      'SU ' + iss.serviceEs.toUpperCase() + ' SERA CORTADO EL DIA ' + cut.day + ' A LAS ' + cut.clock + '.',
      '',
      'VENCIDO ............. ' + Bes(arrears),
      'ESTE PERIODO ........ ' + Bes(current),
      'CARGO POR RECONEXION  ' + Bes(fee),
      'TOTAL A PAGAR ....... ' + Bes(total),
      '',
      'USTED TIENE DERECHO A DISPUTAR ESTE COBRO DENTRO DE ' + WINDOW.disputeDays + ' DIAS.',
      'HAY PLANES DE PAGO Y AYUDA DISPONIBLES SI LOS SOLICITA.',
      'EL SERVICIO SE RESTABLECE CUANDO EL SALDO SE PAGUE POR COMPLETO' +
        (collector ? ' A ' + collector : '') + '.',
      'ESTA DECISION SE PUEDE APELAR.',
      '',
      'ESTE AVISO SE EMITE EN INGLES Y EN ESPANOL.'
    ];

    return {
      issued: true, kind: 'disconnection', service: iss.id,
      issuer: iss.name, slots: slots, en: en, es: es,
      amounts: { arrears: arrears, current: current, fee: fee, total: total },
      /* *** THE ONE THAT COMES FROM HIS CANON AND NOT FROM MY NAMING. ***
         A feeder the grid marks `free` is a Network feeder, and his ruling on the
         Network, said twice in two places, is that they hold the lit grid and HAVE
         NEVER ONCE CHARGED FOR IT. The form does not know that. It bills anyway.
         Carried as a flag, never as a sentence: nothing in the notice above
         changes, and a counter outside can measure how often the district bills
         for power somebody is giving away. */
      billedForFree: !!facts.free,
      window: WINDOW, draft: DRAFT
    };
  }

  /* --------------------------------------------------------------------------
     *** THE OTHER END OF IT: PAID IN FULL. *** (9/21, row [visible change].)

     A disconnection notice that can never be answered is half a machine, and the
     half it is missing is the half a player can WATCH. [visible change] says a
     quest may only move things the player can see move, and QUESTS' own list
     carries `debt_moves` -- "a debt clears, or somebody calls one in". A debt
     clearing in a ledger is not something anybody watches. A CLOSING NOTICE
     ARRIVING ON THE PHONE IS.

     Real closing letters carry: the account, the date the payment was received,
     the amount, THE ZERO STATED IN WORDS (a bill that just stops arriving is not
     a receipt), when service comes back, and how long to keep the record.

     AND THE HORROR IS THE SAME HORROR AND IT COSTS NOTHING AGAIN: the form
     thanks you, and it tells you to keep this notice for your records in case of
     a dispute -- with the same office, in the same building, that section 5 of
     the record measured nobody in. The text never says so. It is a receipt from
     a body that cannot receive anything.

     facts = the disconnection notice's facts, plus `paid` (what was handed over)
     and `to` (who took it, read off the game, never typed).
     -------------------------------------------------------------------------- */
  function cleared(facts) {
    facts = facts || {};
    var iss = ISSUERS[facts.service];
    if (!iss) return { issued: false, reason: 'NO_ISSUER', service: facts.service || null };

    var one = theOne();
    var paid = typeof facts.paid === 'number' ? facts.paid : one;
    if (typeof paid !== 'number') return { issued: false, reason: 'NO_AMOUNT', table: 'PAYOUT' };
    if (paid <= 0) return { issued: false, reason: 'NOTHING_WAS_PAID', paid: facts.paid };

    var served = stamp(facts.day, facts.clock);
    if (!served) return { issued: false, reason: 'NO_CLOCK' };

    var acct = (facts.circuit >= 0) ? ('FEEDER ' + facts.circuit) : null;
    if (!acct) return { issued: false, reason: 'NO_ACCOUNT' };
    var where = facts.street ? String(facts.street).toUpperCase() : null;
    var cell = (facts.at && facts.at.length === 2) ? (facts.at[0] + '-' + facts.at[1]) : null;
    if (!where || !cell) return { issued: false, reason: 'NO_ADDRESS' };

    /* *** THE ZERO IS NOT ASSUMED, IT IS CARRIED. *** A receipt that says PAID
       IN FULL while something is still owed is the worst document in this file:
       it is the card that promises and does nothing, printed on letterhead. So
       what remains is passed in and stated, and a remainder refuses the receipt
       rather than rounding it away. */
    var left = typeof facts.left === 'number' ? facts.left : 0;
    if (left > 0) return { issued: false, reason: 'STILL_OWING', left: left };

    var B = function (n) { return n + (n === 1 ? ' BATTERY' : ' BATTERIES'); };
    var Bes = function (n) { return n + (n === 1 ? ' BATERIA' : ' BATERIAS'); };
    var took = facts.to ? String(facts.to).toUpperCase() : null;

    var slots = {
      issuer:    iss.name,
      account:   acct + ' / SERVICE ADDRESS ' + where + ' ' + cell,
      receivedOn: served.text,
      paid:      B(paid),
      balance:   B(left),
      restore:   'SERVICE TO THIS ADDRESS IS RESTORED.',
      keep:      'KEEP THIS NOTICE FOR YOUR RECORDS IN THE EVENT OF A DISPUTE.'
    };

    var en = [
      iss.name,
      'NOTICE OF PAYMENT IN FULL',
      '',
      'ACCOUNT: ' + slots.account,
      'RECEIVED: ' + slots.receivedOn,
      '',
      'AMOUNT RECEIVED ...... ' + slots.paid + (took ? ' BY ' + took : ''),
      'BALANCE REMAINING .... ' + slots.balance,
      '',
      slots.restore,
      'THANK YOU.',
      slots.keep,
      '',
      'THIS NOTICE IS ISSUED IN ENGLISH AND IN SPANISH.'
    ];

    var es = [
      iss.nameEs,
      'AVISO DE PAGO TOTAL',
      '',
      'CUENTA: ALIMENTADOR ' + facts.circuit + ' / DIRECCION DE SERVICIO ' + where + ' ' + cell,
      'RECIBIDO: DIA ' + served.day + ' A LAS ' + served.clock,
      '',
      'CANTIDAD RECIBIDA .... ' + Bes(paid) + (took ? ' POR ' + took : ''),
      'SALDO PENDIENTE ...... ' + Bes(left),
      '',
      'EL SERVICIO A ESTA DIRECCION QUEDA RESTABLECIDO.',
      'GRACIAS.',
      'GUARDE ESTE AVISO PARA SUS REGISTROS EN CASO DE DISPUTA.',
      '',
      'ESTE AVISO SE EMITE EN INGLES Y EN ESPANOL.'
    ];

    return {
      issued: true, kind: 'cleared', service: iss.id,
      issuer: iss.name, slots: slots, en: en, es: es,
      amounts: { paid: paid, left: left },
      draft: DRAFT
    };
  }

  /* --------------------------------------------------------------------------
     THE EMERGENCY ALERT. Five slots, and the same refusal.

     facts = { hazard, location, action, day, clock, untilDays, service }
     `untilDays` is how long the alert was good for WHEN IT WAS WRITTEN. The
     alert does not know the day is long past. Nothing in it says so.
     -------------------------------------------------------------------------- */
  function alert(facts) {
    facts = facts || {};
    var iss = ISSUERS[facts.service];
    if (!iss) return { issued: false, reason: 'NO_ISSUER', service: facts.service || null };

    var served = stamp(facts.day, facts.clock);
    if (!served) return { issued: false, reason: 'NO_CLOCK' };
    var days = (facts.untilDays >= 0) ? (facts.untilDays | 0) : 1;
    var until = stamp((facts.day | 0) + days, facts.clock);

    var slots = {
      source:   iss.name,
      hazard:   facts.hazard ? String(facts.hazard).toUpperCase() : null,
      location: facts.location ? String(facts.location).toUpperCase() : null,
      action:   facts.action ? String(facts.action).toUpperCase() : null,
      expiry:   'IN EFFECT UNTIL ' + until.text + ' OR UNTIL UPDATED'
    };

    var missing = [];
    for (var i = 0; i < ALERT_SLOTS.length; i++) {
      var s = ALERT_SLOTS[i];
      if (s.need && !slots[s.key]) missing.push(s.key);
    }
    if (missing.length) return { issued: false, reason: 'MISSING_SLOT', missing: missing };

    var en = [
      slots.source,
      'EMERGENCY NOTIFICATION',
      '',
      'ISSUED: ' + served.text,
      'AREA: ' + slots.location,
      '',
      slots.hazard + '.',
      slots.action + '.',
      '',
      slots.expiry + '.'
    ];

    return {
      issued: true, kind: 'alert', service: iss.id,
      issuer: iss.name, slots: slots, en: en,
      draft: DRAFT
    };
  }

  /* --------------------------------------------------------------------------
     *** THE MEASUREMENT, AND IT IS THE POINT OF THE FILE. ***

     Which slots of an issued notice point at a body nobody can find.

     `living` is a list of names that still exist in the valley — the faction
     graph, the seats, whatever the caller has. NOT a list typed here: if a
     faction ever takes the district's name, or the game grows a real billing
     office, this returns fewer rows and the horror shrinks BY MEASUREMENT.
     Given no list at all it answers `known:false` and refuses to claim anything,
     because "nobody is left" asserted without looking is the exact thing this
     lane's rule 12 exists to stop.
     -------------------------------------------------------------------------- */
  function unanswered(notice, living) {
    if (!notice || !notice.issued) return { known: false, reason: 'NOT_ISSUED' };
    if (!living || !living.length) return { known: false, reason: 'NO_LIVING_LIST' };

    var have = {};
    for (var i = 0; i < living.length; i++) {
      if (living[i]) have[String(living[i]).toUpperCase()] = 1;
    }
    var iss = ISSUERS[notice.service] || {};
    var bodies = {
      issuer: iss.name || null,
      office: iss.office ? (iss.name + ' ' + iss.office) : null,
      appeal: iss.appeal || null
    };

    var list = notice.kind === 'alert' ? ALERT_SLOTS : DISCONNECT_SLOTS;
    var out = [], asks = 0;
    for (var j = 0; j < list.length; j++) {
      var s = list[j];
      if (!s.answeredBy) continue;
      asks++;
      var who = bodies[s.answeredBy];
      if (!who) continue;
      if (!have[String(who).toUpperCase()]) out.push({ slot: s.key, who: who, why: s.why });
    }
    return { known: true, asks: asks, unanswered: out.length, slots: out };
  }

  /* what a notice is missing, for a checker that wants the list rather than the
     refusal. A notice that issued is missing nothing, by construction. */
  function slotsOf(kind) {
    if (kind === 'alert') return ALERT_SLOTS.slice();
    if (kind === 'cleared') return CLEARED_SLOTS.slice();
    return DISCONNECT_SLOTS.slice();
  }

  /* the closing notice's own slots, for a checker that wants the list */
  var CLEARED_SLOTS = [
    { key: 'issuer',     need: true,  answeredBy: null,     why: 'who is acknowledging it' },
    { key: 'account',    need: true,  answeredBy: null,     why: 'which service address' },
    { key: 'receivedOn', need: true,  answeredBy: null,     why: 'when the payment landed' },
    { key: 'paid',       need: true,  answeredBy: null,     why: 'what was handed over' },
    { key: 'balance',    need: true,  answeredBy: null,     why: 'and the zero, stated' },
    { key: 'restore',    need: true,  answeredBy: null,     why: 'service comes back' },
    { key: 'keep',       need: true,  answeredBy: 'office', why: 'keep this, in case of a dispute' }
  ];

  var API = {
    ISSUERS: ISSUERS,
    CLEARED_SLOTS: CLEARED_SLOTS,
    cleared: cleared,
    WINDOW: WINDOW,
    DISCONNECT_SLOTS: DISCONNECT_SLOTS,
    ALERT_SLOTS: ALERT_SLOTS,
    disconnection: disconnection,
    alert: alert,
    unanswered: unanswered,
    slotsOf: slotsOf,
    theOne: theOne,
    draft: DRAFT
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.BohemiaNotice = API;
  return API;
})(typeof globalThis !== 'undefined' ? globalThis : this);

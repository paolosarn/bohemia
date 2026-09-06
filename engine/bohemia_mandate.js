// BOHEMIA MANDATE — territory, then the city's backing, then rule. (8/11/26, WORLD lane.)
//
// LOCKED 6/30: laws/BOHEMIA_ADDENDUM_PERSISTENT_CONSEQUENCE_MAYOR_6_30_26.md
//
//   "the shining jewel is customizing the city in your friendly territory, and at some point
//    you become mayor when you've done so much that damn near everyone loves you. The more
//    the city backs you, the easier building becomes, even in areas whose local faction
//    doesn't love you, because the whole city has your back."  -- Paolo
//
// THE LADDER IS THREE RUNGS AND IT MAPS ONTO THE THREE ACTS:
//   1 TERRITORY   build where you are loved. The baseline city-builder surface.
//   2 MANDATE     cross the threshold and the CITY backs you: you can build where the local
//                 faction does NOT love you. Popular support overrides local resistance --
//                 you stop negotiating plot by plot and the city's goodwill is your permit.
//   3 MAYOR       governance. Building gets markedly easier across the map because you are
//                 not negotiating any more, you are governing.
// "Negotiation gives way to mandate gives way to rule."
//
// MAYOR MEANS PSEUDO-MAYOR AND THE ADDENDUM RESOLVES A REAL LORE TENSION TO SAY SO: core
// canon establishes that FORMAL government failed everywhere and is a cautionary tale, not
// an aspiration -- Texas tried to reconstitute one and that failure is told across all three
// acts. The word "mayor" appears NOWHERE in core canon. So this is a CITY-STATE STRONGMAN,
// an affectionate colloquial title for the dynasty at the city's centre of gravity, never a
// restored municipal office. Nothing in this file elects anybody, and there is no office to
// inherit -- which is also why it is `rung`, not `title`.
//
// WHAT IS HIS AND STILL OPEN, straight from the addendum's own [PENDING] line: "exact
// numbers/curves (the 49% is Paolo's starting instinct, not final), what specifically
// 'easier' grants at each rung (cost multipliers? unlock tiers? restriction removal?), and
// how losing faction favor can knock you back down a rung."
//   THE THRESHOLD is his number and is used, flagged as his instinct rather than final.
//   THE GRANTS ship EMPTY. That is the pending, and inventing a cost multiplier here would
//     be canon nobody ruled -- so `grantsAt` answers NO_RULING by name.
//   KNOCK-BACK is not a special case and needs no ruling to work: the rung is DERIVED from
//     current standing every time it is asked, so losing favour drops you by construction.
//     A stored rung would have needed a demotion rule; a computed one cannot get stuck high.
//
// TAXATION: PATROL -> INCOME, LOSE PATROL LOSE INCOME (backlog GM(e), keystone-native, and
// it composes with two laws already standing: LIGHT = TERRITORY, and nobody patrols the
// dark). Holding ground is not a flag you set once -- it is a thing you keep paying for, and
// the moment you stop patrolling a district it stops paying you.
// THE RATE IS 1, RULED 8/15 (laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md): every
// cost, price, payout and yield is 1 until he has played to the end and tuned it by feel,
// and the ruling explicitly reaches "any future resource price anybody is tempted to
// invent". A per-day take is a yield, so it is 1. One is not a guess, it is the absence of
// one -- a plausible number would LOOK tuned and become canon by inertia; a 1 reads as a
// placeholder from across the room. The faucet still runs and the ledger still moves.
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var NO_RULING = 'NO_RULING';

  var TERRITORY = 'TERRITORY', MANDATE = 'MANDATE', MAYOR = 'MAYOR';
  var RUNGS = [TERRITORY, MANDATE, MAYOR];

  /* HIS NUMBER, and the addendum is explicit that it is a starting instinct: "~49% of
     factions FWU". Used as given. The MAYOR threshold is deliberately NOT invented -- he
     ruled a share for the mandate rung and did not rule one for the top, so the top rung
     asks for a ruling instead of guessing a curve. */
  var MANDATE_SHARE = 0.49;      // Paolo's number (starting instinct, not final)
  var MAYOR_SHARE = null;        // [PENDING Paolo: "enough done, enough love" is not a number]

  /* WHAT EACH RUNG ACTUALLY GRANTS.
     THE PENDING WAS ONLY BLOCKING BECAUSE EVERYBODY ASSUMED THE GRANT HAD TO BE A DIAL
     (BB-THE-RUNG-PAYS, day 18). His addendum's own list offers three shapes -- "cost
     multipliers? unlock tiers? restriction removal?" -- and TWO OF THEM ARE NUMBERS he has
     not ruled. THE THIRD IS NOT. Restriction removal is a DOOR, and the door is already
     written in this file's own header, in his words: "you can build in a district whose
     local faction does not love you, because the whole city has your back and the locals do
     not have to."
     So MANDATE ships its grant and it invents nothing: it is this module's own sentence,
     turned into the thing canBuild() has always returned. A place you could not build in
     and now can is not a dial, and NO DAMAGE BEFORE THE DIAL is not violated by opening one.
     MAYOR STAYS EMPTY AND STAYS HIS. What "markedly easier ... because you are governing"
     grants on top of an already-open map is a real design question with no default, and
     MAYOR_SHARE is unruled anyway so the rung cannot be reached. Rung two does not wait on
     rung three. */
  var GRANTS = {                 // rung -> {...}   MAYOR is [PENDING Paolo]
    MANDATE: {
      grant: 'build:anywhere',
      about: 'the city backs you, so you can build on ground whose local faction does not '
           + 'love you',
      source: 'laws/BOHEMIA_ADDENDUM_PERSISTENT_CONSEQUENCE_MAYOR_6_30_26.md, his own words',
      dial: false,               /* a door, not a number: nothing here scales anything */
      tuned: false
    }
  };

  /* WHAT A PATROLLED DISTRICT PAYS. RULED 8/15, and the ruling names this exact case:
     laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md -- "EVERY RESOURCE COST, PRICE,
     PAYOUT AND YIELD IS 1 UNTIL HE HAS PLAYED THE GAME END TO END AND TUNED IT BY FEEL...
     and any future resource price anybody is tempted to invent." A patrolled district's
     per-day take is a YIELD, so it is 1.
     ONE IS NOT A GUESS, IT IS THE ABSENCE OF ONE, which is why this does not break
     mechanism-mine: a plausible-looking number would LOOK TUNED, slip past every future
     reader and become canon by inertia. A 1 announces itself as a placeholder from across
     the room. The faucet still runs, the ledger still moves, and the rate is still his the
     day he plays to the end -- he said so himself: "then I'll move from there."
     THE REFUSAL PATH STAYS (his §4): anything genuinely uncovered by this still answers
     NO_RULING by name rather than defaulting to something. */
  /* AND THE UNIT IS RESOURCES, NOT MONEY. THERE IS NO MONEY IN THIS GAME (Paolo 7/26,
     LOCKED in laws/BOHEMIA_ADDENDUM_THREE_CURRENCIES_CENTURY_7_26_26.md, and he had to
     say it again on 8/15: "read the lore, there's no money in this game. You don't win
     money, you get resources, you get energy, or you get clout"). A patrolled district
     hands you goods that pile into the ONE resource counter -- it does not pay rent. The
     word appears nowhere in this file and must not arrive later. */
  var PAYS_IN = 'resources';     // one of the three ruled balances. Never money.
  var ONE = 1;                   // RULED 8/15 by Paolo. A placeholder, loudly.
  var TAX_RATE = {};             // his overrides, EMPTY: the day he names one it beats ONE
  function taxRateFor(type) {    // districtType -> per-day yield
    if (Object.prototype.hasOwnProperty.call(TAX_RATE, type)) return TAX_RATE[type];
    return type ? ONE : null;    // no type at all is genuinely uncovered -> refuse
  }

  /* FWU = friendly with you. The share is over FACTIONS, which is what he said -- not over
     districts, not over population -- so one big faction warming to you moves the needle
     the way it should. */
  function fwuShare(factions) {
    if (!factions || !factions.length) return 0;
    var n = 0;
    for (var i = 0; i < factions.length; i++) if (factions[i] && factions[i].fwu) n++;
    return n / factions.length;
  }

  /* THE RUNG IS DERIVED, NEVER STORED. This is the whole anti-stuck design and it answers
     his third pending without needing a ruling: ask again after you lose a faction and you
     are simply on a lower rung. A stored rung would need a demotion rule and would sit high
     forever if anybody forgot to write one. */
  function rungOf(factions) {
    var share = fwuShare(factions);
    if (MAYOR_SHARE != null && share >= MAYOR_SHARE) return MAYOR;
    if (share >= MANDATE_SHARE) return MANDATE;
    return TERRITORY;
  }

  /* CAN I BUILD HERE? The rung is the whole answer and it is exactly his escalation:
     at TERRITORY only where the local faction is friendly; at MANDATE anywhere, because
     "popular support overrides local resistance"; at MAYOR anywhere, governing. */
  function canBuild(factions, localFactionFwu) {
    var rung = rungOf(factions);
    if (rung === TERRITORY) {
      return { allowed: !!localFactionFwu, rung: rung,
               why: localFactionFwu ? 'their territory and they like you'
                                    : 'you build where you are loved, and you are not' };
    }
    return { allowed: true, rung: rung,
             why: rung === MANDATE ? 'the city backs you, so the local faction does not have to'
                                   : 'you are not negotiating any more' };
  }

  /* HOW MUCH EASIER. HIS PENDING, refused by name rather than guessed. */
  function grantsAt(rung) {
    if (Object.prototype.hasOwnProperty.call(GRANTS, rung)) return GRANTS[rung];
    return { reason: NO_RULING, table: 'GRANTS', key: rung,
             about: 'what "easier" grants at each rung -- cost multipliers, unlock tiers, '
                  + 'restriction removal -- is Paolo\'s ruling (mayor addendum, PENDING)' };
  }

  /* THE MAYOR IS A SEAT, NOT A CROWN, which is what ties this to the succession system:
     the strongman at the centre of gravity holds a ROLE, so he can be killed and the
     struggle to replace him runs like any other. Returns the role descriptor a host hands
     to bohemia_succession.js; it does not name anybody. */
  function mayorSeat() {
    return { role: 'city:strongman', requires: ['mandate'],
             note: 'a pseudo-mayor: a city-state strongman at the centre of gravity, never '
                 + 'a restored municipal office. Killable like anyone, and the seat contests '
                 + 'like any other when it empties.' };
  }

  /* ---- TAXATION: you keep what you patrol ------------------------------------------- */

  /* A district pays only while it is BOTH yours and patrolled. Losing the patrol closes the
     faucet the same turn -- no decay curve, no grace period, because the whole point is
     that holding ground costs something continuously. LIGHT = TERRITORY and nobody patrols
     the dark, so an unlit district cannot be patrolled and therefore cannot pay. */
  function income(holdings) {
    var out = { paid: [], unpaid: [], total: null, unruled: [], currency: PAYS_IN };
    if (!holdings || !holdings.length) return out;
    for (var i = 0; i < holdings.length; i++) {
      var h = holdings[i] || {};
      if (!h.yours) { out.unpaid.push({ id: h.id, why: 'not yours' }); continue; }
      if (!h.lit) { out.unpaid.push({ id: h.id, why: 'dark, and nobody patrols the dark' }); continue; }
      if (!h.patrolled) { out.unpaid.push({ id: h.id, why: 'you stopped patrolling it' }); continue; }
      var rate = taxRateFor(h.type);
      if (rate == null) { out.unruled.push(h.type); continue; }
      out.paid.push({ id: h.id, amount: rate, currency: PAYS_IN });
    }
    if (out.unruled.length) {
      out.reason = NO_RULING; out.table = 'TAX_RATE';
      out.about = 'a holding with no district type at all is genuinely uncovered; EVERYTHING '
                + 'COSTS ONE (8/15) rules the rate, not what a typeless thing is';
    } else {
      out.total = out.paid.reduce(function (a, b) { return a + b.amount; }, 0);
    }
    return out;
  }

  function pending() {
    return [
      { key: 'MANDATE_SHARE', value: MANDATE_SHARE,
        about: 'his number, and his own addendum calls it a starting instinct rather than '
             + 'final' },
      { key: 'MAYOR_SHARE', value: MAYOR_SHARE,
        about: '"enough done, enough love" is not a number; the top rung stays unreachable '
             + 'until he rules one rather than being guessed off a curve' },
      { key: 'GRANTS', empty: Object.keys(GRANTS).length === 0,
        about: 'what "easier" actually grants at each rung' },
      { key: 'TAX_RATE', value: ONE, ruled: '8/15 EVERYTHING COSTS ONE',
        about: 'what a patrolled district pays per day is 1 until he has played to the end '
             + 'and tuned it by feel. Not open any more, but not final either: "then I\'ll '
             + 'move from there."' }
    ];
  }

  var API = {
    TERRITORY: TERRITORY, MANDATE: MANDATE, MAYOR: MAYOR, RUNGS: RUNGS,
    MANDATE_SHARE: MANDATE_SHARE, MAYOR_SHARE: MAYOR_SHARE,
    GRANTS: GRANTS, TAX_RATE: TAX_RATE, NO_RULING: NO_RULING,
    fwuShare: fwuShare, rungOf: rungOf, canBuild: canBuild, grantsAt: grantsAt,
    mayorSeat: mayorSeat, income: income, pending: pending, PAYS_IN: PAYS_IN
  };
  if (HASREQ) module.exports = API;
  root.BohemiaMandate = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

#!/usr/bin/env python3
"""
THE ROAD LEAVES SOMETHING BEHIND
(8/27/26, RUN lane. Dispatch item 8's other half.)

    Paolo 8/25, the playtest dispatch, item 8: "ENEMIES, LOOT, and Valheim-style
    DANGER BY PLACE."

THE ENEMIES LANDED THIS MORNING and nothing came off them. A road that stops you
twelve times on the way across the valley and hands you nothing is a toll booth.

=== WHAT LOOT IS IN THIS GAME, AND IT IS NOT A NEW SYSTEM ===================

REUSE-FIRST, and the reuse here is enormous. Bohemia ALREADY HAS AN ECONOMY:

    engine/bohemia_economy.js   GOODS -- water (L), food (ration), meds (dose),
                                fuel (L), power (kWh), and SALVAGE (kg), whose
                                note reads "the numeraire until Paolo names the
                                money". Every one carries a researched base value.
    engine/bohemia_purse.js     the ledger, three LOCKED currencies (resources,
                                electricity, clout) and four honest entry kinds.

So loot is NOT a new item table. It is SALVAGE, in the currency the game already
counts, landing in the ledger the game already keeps. Which means the moment
something drops it already means something, instead of being an orphan number
waiting for a system to give it a job. That is the seventeen-invisible-hats
failure prevented in advance rather than discovered in five weeks.

=== WHY MOST OF IT IS NOTHING, AND WHY THAT IS THE FEATURE ==================

TEN YEARS COLD (Paolo 7/31, LOCKED): the crash is ten years in the past.

The research on real collapse looting is unambiguous about the order: food and
water go in the first 24 to 48 hours, then organised crews take the pharmacies
and the gun shops. IN THIS WORLD THAT HAPPENED A DECADE AGO. Anything a
desperate person could carry has been carried. What is left is what nobody
wanted in year one.

And the game-design research lands in the same place from the other side:
scarcity is what makes a find feel like anything, and survival designers
deliberately leave most containers empty for exactly that reason. So realism and
fun agree here, which is rare, and it means nothing has to be traded.

*** FIVE OF THE TWELVE ROAD MOMENTS LEAVE NOTHING AT ALL. ***

=== THE TABLE, DERIVED NOT INVENTED =======================================

The amount tracks ONE question: how much MANUFACTURED STUFF was that thing
carrying? A salvage economy wants metal and parts, not meat.

    feral_dog_pack       0   dogs do not carry cargo
    coyote_shadow        0   neither do coyotes
    rattlesnake          0   it is a snake
    crazed_wanderer      0   the line says he has no shoes
    the_snatcher         0   see below, this one is deliberate
    scavenger_shakedown  1   he is desperate and has almost nothing. That IS him.
    ghost_robotaxi       1   a cab still running its loop has parts on it
    spotter_drone        2   four rotors and a battery
    toll_crew            2   "they want a cut, not a corpse" -- a crew with kit
    patrols_collide      3   the roster's own verb says "join, third-party,
                             LOOT AFTER, or walk on". Two crews' worth.
    casino_security_bot  3   A DEAD MACHINE IS THE BEST SALVAGE IN A DEAD CITY,
                             and this is the one place the fiction and the
                             economy say the same thing out loud.
    bounty_squad         0   it needs a kill count nothing can answer, so it
                             never fires anyway

*** NOTHING IS EVER TAKEN FROM HIM. *** the_snatcher's approved verb is "grabs
an item and RUNS -- a beat-timed chase" and its ends is "loss without death". So
a loss IS the approved design. It is not built here, because THE CHASE IS NOT
BUILT: an unavoidable loss with no way to win it back is not the approved
mechanic, it is a tax wearing its name. When the chase exists the snatcher takes
something. Today he takes nothing and this file says so out loud rather than
quietly shipping half of an approved idea.

=== A TAG IS FINE, A MARKET IS NOT ========================================

TEN YEARS COLD clause 2 bans the CATEGORY of economic gameplay: "exchange rates.
inflation. prices that move on a clock ... any market the player reads or plays."
And it draws the boundary itself: "What is banned is a price that MOVES BY
ITSELF, not a price that exists. A tag is fine. A market is not."

This adds a FAUCET and nothing else. It credits `resources` with kind `source`,
which is the ledger's own word for "created from nothing and injected". No rate,
no drift, no multiplier, no conversion, nothing the player can watch move. The
PRICES and PAYOUT tables stay empty and stay his.

THE NUMBERS 0 TO 3 ARE MINE. EVERYTHING COSTS ONE (8/15) reaches "any future
resource price anybody is tempted to invent", so these are kept as small whole
numbers with a stated derivation instead of a curve, and they print in the gate
every run so he can move any of them with one word.

REUSE CHECK: cooks NO pixels and opens no banks/. It draws nothing: the number
appears as one more row on the road card that already exists, in the card CSS
that already exists.

Idempotent (marker __THE_ROAD_LEAVES_SOMETHING__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_ROAD_LEAVES_SOMETHING__'

TABLE_OLD = """var ROAD_DIR = null, ROAD_LOG = [];"""

TABLE_NEW = """/* """ + MARK + """ (8/27) -- WHAT IS LEFT ON THE ROAD, in kg of salvage,
   which is the economy's own numeraire. Dispatch item 8: "ENEMIES, LOOT, and
   Valheim-style DANGER BY PLACE."
   THE AMOUNT ANSWERS ONE QUESTION: how much MANUFACTURED STUFF was that thing
   carrying? A salvage economy wants metal and parts, not meat. So the animals
   give nothing, the man with no shoes gives nothing, and the dead machine gives
   the most -- which is the one place the fiction and the economy say the same
   thing out loud.
   FIVE OF TWELVE LEAVE NOTHING, and that is the feature. TEN YEARS COLD: the
   food and water went in the first 48 hours of a crash that happened a decade
   ago. What is left is what nobody wanted in year one.
   NOTHING IS EVER TAKEN. the_snatcher's approved ends is "loss without death",
   but the beat-timed chase that makes that fair is not built, and an unavoidable
   loss with no way to win it back is a tax wearing the mechanic's name. */
var ROAD_LEAVINGS = {
  feral_dog_pack: 0, coyote_shadow: 0, rattlesnake: 0, crazed_wanderer: 0,
  the_snatcher: 0, bounty_squad: 0,
  scavenger_shakedown: 1, ghost_robotaxi: 1,
  spotter_drone: 2, toll_crew: 2,
  patrols_collide: 3, casino_security_bot: 3
};

var ROAD_DIR = null, ROAD_LOG = [], ROAD_TAKEN = 0;

/* THE FAUCET, AND IT IS ONLY EVER A FAUCET. TEN YEARS COLD clause 2 bans a price
   that MOVES BY ITSELF and explicitly permits one that exists: "A tag is fine. A
   market is not." So this credits `resources` with the ledger's own kind
   `source` -- created from nothing and injected -- and touches no rate, no
   conversion and neither of the two [PENDING Paolo] tables. */
function roadLeave(ev){
  var kg = ROAD_LEAVINGS[ev.id] || 0;
  if(kg <= 0) return 0;
  try{
    var p = purseGet(); if(!p) return 0;
    var day = (typeof DAY !== 'undefined' && DAY.day) ? DAY.day : 0;
    var r = BohemiaPurse.credit(p, 'resources', kg,
              'left on the road: ' + ev.id, 'road:' + ev.seq, day);
    if(!r || !r.applied) return 0;
    ROAD_TAKEN += kg;
    return kg;
  }catch(_e){ return 0; }
}"""

FIRE_OLD = """    var mins = ROAD_COST[got.kind] || 0;
    if(mins>0){ try{ advance(mins); }catch(_e){} }
    try{ roadCard(got, mins); }catch(_e){}"""

FIRE_NEW = """    var mins = ROAD_COST[got.kind] || 0;
    if(mins>0){ try{ advance(mins); }catch(_e){} }
    /* """ + MARK + """: and what it left behind, if anything. Most of the time
       nothing, on purpose. */
    var kg = 0; try{ kg = roadLeave(got); }catch(_e){}
    try{ roadCard(got, mins, kg); }catch(_e){}"""

CARD_OLD = """function roadCard(ev, mins){"""
CARD_NEW = """function roadCard(ev, mins, kg){"""

ROW_OLD = """  var cost  = mins>0 ? ('<div class="rrow"><span class="rk">THAT COST YOU</span>'
                        + '<span class="rv">' + mins + ' MIN</span></div>') : '';"""

ROW_NEW = """  var cost  = mins>0 ? ('<div class="rrow"><span class="rk">THAT COST YOU</span>'
                        + '<span class="rv">' + mins + ' MIN</span></div>') : '';
  /* """ + MARK + """: no row at all when there is nothing, because an empty
     "LEFT BEHIND: 0" every single time teaches him to stop reading the card. */
  var left  = (kg>0) ? ('<div class="rrow"><span class="rk">LEFT ON THE ROAD</span>'
                        + '<span class="rv">' + kg + ' KG SALVAGE</span></div>') : '';"""

OUT_OLD = """    + cost
    + '<div class="mrow" data-act="close">"""

OUT_NEW = """    + cost + left
    + '<div class="mrow" data-act="close">"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the road already leaves something behind')
        return
    if '__THE_ROAD_INTERRUPTS__' not in s:
        sys.exit('FAIL: there is no road to leave anything on; run the road patch first')
    for old, what in ((TABLE_OLD, 'where the table goes'),
                      (FIRE_OLD, 'the moment an encounter fires'),
                      (CARD_OLD, 'the card signature'),
                      (ROW_OLD, 'the cost row'),
                      (OUT_OLD, 'the card body')):
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
    for old, new in ((TABLE_OLD, TABLE_NEW), (FIRE_OLD, FIRE_NEW),
                     (CARD_OLD, CARD_NEW), (ROW_OLD, ROW_NEW), (OUT_OLD, OUT_NEW)):
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- the road leaves something behind (7 of 12 tokens, 0 to 3 kg)' % CITY)


if __name__ == '__main__':
    main()

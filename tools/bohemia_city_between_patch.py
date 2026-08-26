#!/usr/bin/env python3
"""
BOHEMIA CITY BETWEEN PATCH -- THE OUTFITS HAVE POSITIONS ON EACH OTHER, AND
THE CARD FINALLY SAYS SO.  (8/26/26, FACTIONS lane)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_BETWEEN__.

--------------------------------------------------------------------------
THE RULING (Paolo 8/26, verbatim)
--------------------------------------------------------------------------
  "custom is your own personal faction!!!!!! and you can imagine if you play
   the game with your custom faction the values arent just for you its for how
   your factions treated bro but u prob Already have that. But, yeah, for the
   other factions."

"BUT, YEAH, FOR THE OTHER FACTIONS" IS THE HALF THAT DID NOT EXIST. The other
outfits hold positions on each other -- canon positions, nine of them, written
in engine/BOHEMIA_faction_graph.json since before this lane started -- and the
walked surface has never mentioned one of them, in either direction:

  * ctSideCost() called costs() with three arguments, so every outfit that
    heard about your commitment charged the identical amount. The Remnants are
    at PERMANENT WAR with the Cartel in canon. The Church have no position on
    the Cartel whatsoever. Both took exactly the same off you.
  * No card anywhere said who anybody is at war with. You could walk up to a
    Caravan and never learn that the Cartel tax them, which is the single most
    important thing about being a Caravan.

WHAT CHANGES ON THE SURFACE:
  1. THE COST IS WEIGHTED and the card says by what. Siding with the Cartel in
     earshot of the Remnants costs double, and the row underneath names the war
     rather than leaving him to wonder why the number moved.
  2. EVERY CARD CARRIES THE WORLD FACT. Who these people are at war with, who
     taxes them, who they run close to. It is true whether or not the player is
     involved, which is exactly what makes it worth knowing.
  3. YOUR OUTFIT IS NAMED AS THE THING THAT CARRIES THE STANDING. Half one of
     the ruling. The number was never about you personally; it is what an
     outfit thinks of the outfit you run with.

--------------------------------------------------------------------------
ENGINE SYNC LAW -- WHY THIS RESYNCS A BODY IT DID NOT WRITE
--------------------------------------------------------------------------
costs() grew a fourth argument in engine/bohemia_commitment.js. The city
carries an INLINED COPY of that module, and an inlined copy that has drifted
from canon is the exact bug that cost this lane thirteen days in August
(bohemia_city_commitment_patch.py's own post-mortem: a stale agents snapshot
meant NOBODY in Las Vegas had a faction and nothing went red). So this swaps
the body wholesale, bounded by the module's own head and its own IIFE close --
never a line-number guess -- and REFUSES if what it finds is not what canon
expects. It is measured before it is trusted: the diff against the shipped city
was 4 hunks, all of them this turn's, before a byte was written.

--------------------------------------------------------------------------
VERIFY ON THE REAL SURFACE (Paolo 7/18)
--------------------------------------------------------------------------
The claims here are checked by gates/faction_between_gate.js by LOADING THE
SHIPPED CITY and calling the shipped functions, not by reading this file and
believing it.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_BETWEEN__'
MODULE = 'engine/bohemia_between.js'
COMMITMENT = 'engine/bohemia_commitment.js'

CM_HEAD = '/* ==== engine/bohemia_commitment.js ==== */\n'
IIFE_TAIL = "})(typeof globalThis!=='undefined'?globalThis:this);"


# ------------------------------------------------------------- 1. ENGINE SYNC
def resync_commitment(src):
    """Swap the inlined bohemia_commitment body for canon. ENGINE SYNC LAW.

    Bounded by the module's own head comment and its own IIFE close, both of
    which the canonical file also has. Idempotent by comparison, not by marker:
    if the body already IS canon this returns unchanged."""
    canon = open(COMMITMENT, encoding='utf-8').read().rstrip('\n')
    i = src.find(CM_HEAD)
    if i < 0:
        sys.exit('FAIL: no inlined bohemia_commitment block in the city')
    j = src.find(IIFE_TAIL, i)
    if j < 0:
        sys.exit('FAIL: no IIFE close after the commitment block')
    j += len(IIFE_TAIL)
    old = src[i + len(CM_HEAD):j]
    if old == canon:
        return src, 0
    # REFUSE ON A SURPRISE. If the inlined body is not the one this turn
    # started from, somebody else moved it and stomping it blind is how a lane
    # loses work. The check is cheap and the failure is loud.
    if 'function costs(state, heard, standings' not in old:
        sys.exit('FAIL: the inlined commitment body has no costs() I recognise. '
                 'Somebody else changed it; refusing to overwrite.')
    return src[:i + len(CM_HEAD)] + canon + src[j:], len(canon) - len(old)


# --------------------------------------------------- 2. THE COST IS WEIGHTED
OLD_SIDECOST = """    return BohemiaCommitment.costs(nextState, heard, ctStandings()) || [];"""

NEW_SIDECOST = """    /* """ + MARKER + """ -- WHO IS LISTENING CHANGES WHAT IT COSTS.
       This called costs() with three arguments and every outfit that heard was
       charged the same number. The Remnants are at PERMANENT WAR with the
       Cartel in canon -- written in BOHEMIA_faction_graph.json, priced at -80
       in FactionCanon.REL_SPEC -- and the Church have no canon position on the
       Cartel at all, and they both took exactly the same off you.
       Paolo 8/26: "But, yeah, for the other factions." The fourth argument is
       that: what the OTHERS are to EACH OTHER, which is a fact about the world
       and not about the player.
       `sided` is the outfit whose card is open, because the question the card
       is answering is what happens if you commit to THESE people. */
    return BohemiaCommitment.costs(nextState, heard, ctStandings(),
             { between:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null),
               sided:fid }) || [];"""


# --------------------------------------------- 2b. AND WHO WAS ALREADY LOOKING
# whoHears grew an opts.watching for the same reason costs() grew opts.between,
# and it was MEASURED before it was built: a sweep of the live city -- every
# base, every affiliated person, the real whoHears against the real roster --
# found TWO hearing pairs in the whole valley (Mob<->Network) and neither is a
# pair canon holds a position on. The weighted cost was correct code that could
# not fire, because the acquaintance walk needs a chain of housemates between
# two outfits and a thin population does not have one.
#
# AND THERE ARE TWO whoHears CALLS IN THIS FILE, WHICH IS HOW THE FIRST ROUND
# OF THIS SHIPPED A CARD THAT CONTRADICTED ITSELF IN THREE ADJACENT LINES:
#     WILL HEAR IT AS FACT :: CARAVANS, REMNANTS
#     IT GETS OUT THROUGH  :: NOBODY. THEY WERE ALREADY WATCHING.
#     AND IT COSTS YOU     :: NOTHING. NOBODY WHO COULD CHARGE YOU FOR IT IS
#                             CLOSE ENOUGH TO KNOW.
# ctHearRows walks the graph for the display rows and ctSideCost walks it AGAIN
# for the price, so teaching one about watchers and not the other produced a
# card where the top half knew about the war and the bottom half did not. The
# city's own comment beside the tertius row says it: "two calls are two
# opinions about one graph." Both are taught here, in one patch, on purpose.
OLD_WHOHEARS = """  try { heard = BohemiaCommitment.whoHears(fid, ctValleyRoster(), ctCell(),
                  /* __CITY_VALLEYKEY__ */ {ties:BohemiaTies, keyOf:ctVKey}); }
  catch(_e){ return body; }"""

OLD_COSTHEARS = """    var heard = BohemiaCommitment.whoHears(fid, ctValleyRoster(), ctCell(),
                  {ties:BohemiaTies, keyOf:ctVKey});"""

NEW_COSTHEARS = """    var heard = BohemiaCommitment.whoHears(fid, ctValleyRoster(), ctCell(),
                  /* """ + MARKER + """ -- THE SECOND OPINION, TAUGHT THE SAME THING.
                     ctHearRows walks this graph too, and the round of this
                     change that taught only that one produced a card reading
                     "WILL HEAR IT AS FACT: CARAVANS, REMNANTS" three lines
                     above "NOBODY WHO COULD CHARGE YOU FOR IT IS CLOSE ENOUGH
                     TO KNOW". Both calls or neither. */
                  {ties:BohemiaTies, keyOf:ctVKey,
                   watching:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null)});"""

NEW_WHOHEARS = """  try { heard = BohemiaCommitment.whoHears(fid, ctValleyRoster(), ctCell(),
                  /* __CITY_VALLEYKEY__ */ {ties:BohemiaTies, keyOf:ctVKey,
                  /* """ + MARKER + """ -- AND THE ONES ALREADY LOOKING.
                     A commitment is PUBLIC by this module's own definition
                     ("Said in front of people. That is the whole mechanism and
                     it is enough"), so an outfit canon says is at war with the
                     people you just sided with does not need your housemate to
                     tell them. They have been watching for years. */
                  watching:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null)}); }
  catch(_e){ return body; }"""

OLD_VIA = """  var via = heard[0].via==='home' ? 'SOMEBODY THEY SHARE A ROOF WITH'
                                  : 'SOMEBODY THEY WORK BESIDE';"""

NEW_VIA = """  /* """ + MARKER + """ -- AND A WATCHER DID NOT HEAR IT IN A KITCHEN.
     This was a two-way choice between home and work, so the moment whoHears
     started returning watchers at via:'watch' it would have told him somebody
     overheard it at a job site -- a specific, checkable, false sentence about
     how the news travelled. A binary that grows a third case and keeps its
     else is how a surface starts lying with total confidence. */
  var via = heard[0].via==='watch' ? 'NOBODY. THEY WERE ALREADY WATCHING.'
          : heard[0].via==='home'  ? 'SOMEBODY THEY SHARE A ROOF WITH'
                                   : 'SOMEBODY THEY WORK BESIDE';"""


# ------------------------------------------- 3. THE NUMBERS SAY WHICH IS WHICH
OLD_WORDS = """function ctSideCostWords(list){
  return list.map(function(c){ return c.faction + ' -' + c.lose; }).join(', ');
}"""

NEW_WORDS = """function ctSideCostWords(list){
  /* """ + MARKER + """ -- A DOUBLED PRICE MUST NOT LOOK LIKE A FLAT ONE.
     Once the canon relations weigh the cost, two rows reading 'Remnants -4,
     Church -2' are two different KINDS of fact and the old join flattened them
     into one list of numbers. The mark says which ones the world bent:
       !  they hold something against the people you are siding with
       ~  they run close to them, so it went cheap
     realMoved, never moved -- the never-below-a-stranger clamp can eat an
     entire war, and marking a price that did not actually change would be the
     surface disagreeing with the number printed beside it. */
  return list.map(function(c){
    var m = (c.realMoved|0) > 0 ? '!' : (c.realMoved|0) < 0 ? '~' : '';
    return c.faction + ' -' + c.lose + m;
  }).join(', ');
}
/* """ + MARKER + """ -- AND WHY IT COST THAT MUCH.
   A number that moves without a reason is a bug to the person reading it. This
   names the canon position that moved it, in his own vocabulary, and it names
   only positions that ACTUALLY changed a price on this card -- a war between
   two outfits neither of whom charged you anything is not what this row is
   for. Returns '' when nothing was bent, and the caller prints nothing. */
function ctBentWhy(list){
  var said = {}, out = [];
  for(var i=0;i<list.length;i++){
    var c = list[i];
    if(!c.rel || !(c.realMoved|0)) continue;
    var k = c.faction + '|' + c.rel.label;
    if(said[k]) continue;
    said[k] = 1;
    out.push(c.faction + ': ' + c.rel.word);
  }
  return out.join('  ·  ');
}"""


# ------------------------------------- 4. THE WORLD FACT, ON EVERY OUTFIT CARD
HEAR_ANCHOR = """  var ctCost = (ctNext && ctNext.moved) ? ctSideCost(fid, ctNext.state) : [];
  if(ctCost.length){
    body += ctRow('AND IT COSTS YOU', ctSideCostWords(ctCost));
    body += ctNote('They are not your enemies. They just heard you picked '
      + 'somebody, and it was not them.');  /* __CITY_NOTESFOLD__ */"""

HEAR_NEW = """  var ctCost = (ctNext && ctNext.moved) ? ctSideCost(fid, ctNext.state) : [];
  if(ctCost.length){
    body += ctRow('AND IT COSTS YOU', ctSideCostWords(ctCost));
    /* """ + MARKER + """ -- THE REASON GOES WHERE THE NUMBER IS.
       The flat note below explains a flat cost, and it is still true for the
       outfits with no canon position on these people. When the world DID bend
       a price, the honest sentence is the specific one: it was not indifference
       that charged you extra, it was a war somebody else is fighting. */
    var ctWhy = ctBentWhy(ctCost);
    if(ctWhy) body += ctRow('BECAUSE', ctWhy);
    body += ctNote('They are not your enemies. They just heard you picked '
      + 'somebody, and it was not them.');  /* __CITY_NOTESFOLD__ */"""


# ------------------------------------- 3b. AND THE NOTHING ROW HAD TWO MEANINGS
# "NOTHING. NOBODY WHO COULD CHARGE YOU FOR IT IS CLOSE ENOUGH TO KNOW" was
# written when an empty cost list could only mean one thing: the structural hole
# -- nobody heard. Watchers made a SECOND way to get an empty list, and it is a
# completely different fact: they heard perfectly well, they have simply never
# counted you, so there is nothing on the books to take. costs() has always
# skipped those (`if(have <= 0) return;`) and it was invisible while the only
# hearers were people who reached you through a chain you had to already be part
# of. Printing the structural-hole sentence over a card that says CARAVANS,
# REMNANTS WILL HEAR IT AS FACT is not a rounding error, it is the surface
# telling him the opposite of the row above it.
OLD_NOTHING = """    body += ctRow('AND IT COSTS YOU', 'NOTHING. NOBODY WHO COULD CHARGE YOU FOR '
      + 'IT IS CLOSE ENOUGH TO KNOW.');"""

NEW_NOTHING = """    /* """ + MARKER + """ -- TWO WAYS TO OWE NOTHING, AND THEY ARE NOT THE SAME.
       Nobody heard is Burt's structural hole and it is an ADVANTAGE you are
       holding. They all heard and none of them ever counted you is a fact
       about how little you have, and it stops being true the moment you are
       worth something to somebody. Same empty list, opposite meanings, and
       the player should be told which one he is looking at. draft:true. */
    body += ctRow('AND IT COSTS YOU', heard.length
      ? 'NOTHING. NOT ONE OF THEM EVER COUNTED YOU, SO THERE IS NOTHING TO TAKE.'
      : 'NOTHING. NOBODY WHO COULD CHARGE YOU FOR IT IS CLOSE ENOUGH TO KNOW.');"""


# THE WORLD FACT ROW. It goes on the RUNS WITH row, and WHERE IT GOES WAS
# FOUND BY LOOKING AT THE REAL CARD, not by reading the source and reasoning.
#
# It was first written into ctHearRows, beside the tertius row, which looked
# obviously right. Then the smoke test opened a real card on a real Cartel
# member -- an outfit with THREE hostile canon positions -- and the row was not
# there. ctHearRows is called from exactly one place:
#     if(ctLadder && ctWall && ctWall.atWall && ctWall.blocks){ ... }
# so every one of those rows exists only once you have hit the wall. That is
# correct for the who-will-hear rows (they preview a commitment you are about
# to make, and the wall is where you make it) and WRONG for this one, which is
# true whether or not the player has ever met these people.
#
# THIS IS THE SAME BUG THIS LANE HAS NOW FIXED SEVEN TIMES: a row placed behind
# a guard that excludes the case it is most about. The tertius row was after an
# early return on the exact condition it described. Reading the diff would not
# have caught either one. Opening the card did.
OLD_RUNSWITH = """  if(fid) body += ctRow('RUNS WITH', String(fid).toUpperCase());"""

NEW_RUNSWITH = """  if(fid) body += ctRow('RUNS WITH', String(fid).toUpperCase());
  /* """ + MARKER + """ -- AND WHO THAT MEANS THEY HAVE HISTORY WITH.
     The single most important thing about being a Caravan is that the Cartel
     tax them, and you could walk up to one for thirteen days and never find
     out. Canon has held nine of these positions since before this lane started
     and no surface in the game has ever printed one of them.
     HOSTILE ONLY, and that is a judgement about ATTENTION, not about canon: a
     phone card has room for the thing that gets you killed. Every warm and
     neutral position is still in BohemiaBetween.ripples() for anything that
     wants the full board.
     NOT ABOUT THE PLAYER. This reads the same whether you have met them or
     not, which is what makes it a world instead of a menu. It rides the RUNS
     WITH row because it is the same fact -- who they run with, and what that
     costs them -- and because it must render on EVERY card, not only at the
     wall where the commitment rows live. */
  try {
    if(fid && typeof BohemiaBetween !== 'undefined'){
      var ctRip = BohemiaBetween.ripples(fid).filter(function(r){
        return r.sign === 'hostile'; });
      if(ctRip.length){
        body += ctRow('AND ARE UP AGAINST', ctRip.map(function(r){
          return String(r.to).toUpperCase(); }).join(', '));
        body += ctNote(ctRip[0].note);
      }
    }
  } catch(_e){}"""


# ------------------------------------------- 5. WHOSE STANDING IT ACTUALLY IS
OLD_STANDINGS = """function ctStandings(){
  var out = {};
  if(typeof BohemiaBelonging === 'undefined') return out;
  var sv = ctBelongSave(), rules = BohemiaBelonging.RULES || {};
  for(var k in rules) out[k] = BohemiaBelonging.gaveOf(sv, k);
  return out;
}"""

NEW_STANDINGS = """function ctStandings(){
  var out = {};
  if(typeof BohemiaBelonging === 'undefined') return out;
  var sv = ctBelongSave(), rules = BohemiaBelonging.RULES || {};
  for(var k in rules) out[k] = BohemiaBelonging.gaveOf(sv, k);
  return out;
}
/* """ + MARKER + """ -- WHOSE STANDING THIS IS.
   PAOLO 8/26: "custom is your own personal faction!!!!!! ... the values arent
   just for you its for how your factions treated bro."
   The number an outfit holds is not an opinion about a person. It is what they
   think of THE OUTFIT YOU RUN WITH, and canon agrees -- the graph's note on
   Custom reads "Player faction. No preset philosophy. Identity emerges from
   three generations of action."
   Read from the graph through BohemiaBetween.mine(), never typed here, so the
   day he renames it or hands the player a different one, this follows. Returns
   null if the graph stops saying it, and null is printed as nothing rather
   than as a guess. */
function ctMyOutfit(){
  try {
    if(typeof BohemiaBetween === 'undefined') return null;
    return BohemiaBetween.mine();
  } catch(_e){ return null; }
}"""


# THE ROW THAT NAMES IT, on the rung line where the standing is already shown.
# The anchor is the REAL shipped three-line statement, copied byte for byte out
# of the city rather than approximated -- an anchor that does not match fails
# loudly here, but an anchor that matches the WRONG thing does not, and this
# lane has already shipped two mutations that silently did not apply.
OLD_YOUARE = """        body += ctRow('YOU ARE', bar.rung.word
        + ((bar.next && (!ctWall || !ctWall.atWall))
             ? (' \\u00b7 '+bar.next.more+' MORE TO '+bar.next.rung.word) : ''));"""

NEW_YOUARE = """        /* """ + MARKER + """ -- AND THEY ARE NOT SAYING IT ABOUT YOU ALONE.
           PAOLO 8/26: "the values arent just for you its for how your factions
           treated bro." The rung is what this outfit calls THE OUTFIT YOU RUN
           WITH. Naming it turns a personal score into a fact about something
           that outlives the character, which is the whole ruling.
           FOLDED INTO THE SAME ROW, never added as a new one: this card clips
           off the top of an iPhone and cardfold_gate part A has caught exactly
           that twice this week. One row in, one row out. */
        body += ctRow('YOU ARE', bar.rung.word
        + ((bar.next && (!ctWall || !ctWall.atWall))
             ? (' \\u00b7 '+bar.next.more+' MORE TO '+bar.next.rung.word) : '')
        + (ctMyOutfit() ? ' \\u00b7 AND SO IS THE '
             + String(ctMyOutfit()).toUpperCase() : ''));"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return

    s, delta = resync_commitment(s)
    print('ENGINE SYNC: commitment body %s (%+d bytes)'
          % ('resynced from canon' if delta else 'already current', delta))

    if not os.path.exists(MODULE):
        sys.exit('FAIL: missing ' + MODULE + ' -- run tools/bohemia_between.py')
    body = ('/* ==== engine/bohemia_between.js ==== */\n'
            + open(MODULE, encoding='utf-8').read())
    inject_at = CM_HEAD
    s = s.replace(inject_at, body + '\n' + inject_at, 1)

    for old, new, what in ((OLD_SIDECOST, NEW_SIDECOST, 'the side-cost call'),
                           (OLD_WHOHEARS, NEW_WHOHEARS, 'the whoHears call'),
                           (OLD_COSTHEARS, NEW_COSTHEARS, 'the cost whoHears call'),
                           (OLD_NOTHING, NEW_NOTHING, 'the nothing row'),
                           (OLD_VIA, NEW_VIA, 'the how-it-got-out row'),
                           (OLD_WORDS, NEW_WORDS, 'the cost words'),
                           (HEAR_ANCHOR, HEAR_NEW, 'the because row'),
                           (OLD_RUNSWITH, NEW_RUNSWITH, 'the history row'),
                           (OLD_STANDINGS, NEW_STANDINGS, 'the outfit reader'),
                           (OLD_YOUARE, NEW_YOUARE, 'the you-are row')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY BETWEEN: the outfits have positions on each other, on the card')
    print('  + ' + MODULE)
    print('  + weighted side costs, the BECAUSE row, the HISTORY row, your outfit')


if __name__ == '__main__':
    main()

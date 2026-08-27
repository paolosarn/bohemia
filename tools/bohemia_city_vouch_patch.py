#!/usr/bin/env python3
"""
BOHEMIA CITY VOUCH PATCH -- THE TOP OF THE LADDER DID NOTHING.  (8/28/26,
FACTIONS lane)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_VOUCH__.

==========================================================================
THE FIND
==========================================================================
The belonging ladder is five rungs:
    A STRANGER              at 0
    SOMEBODY WHO SHOWED UP  at 1
    USEFUL                  at 3
    COUNTED                 at 6
    INSIDE                  at 10

MEASURED: bohemia_claim and bohemia_favour BOTH key off COUNTED, by name, at
build time. NOTHING ANYWHERE KEYS OFF INSIDE. Grepped the engine, the tools and
the walked surface: every hit is the word appearing in a ladder literal or in
its own definition.

So you grind from COUNTED to INSIDE -- four more favours, THROUGH A WALL that
costs you a burned bridge, the most expensive thing this system asks for -- and
the only thing that changes is the word on the card.

bohemia_commitment's own docstring is the judgement: "A ladder with no wall is
a progress bar." A ladder whose TOP RUNG BUYS NOTHING is a progress bar with a
wall in the middle of it.

==========================================================================
AND THE RUNG ITSELF SAYS WHAT IT IS FOR
==========================================================================
INSIDE's note, already written, already shipped, shown on the card since 8/12:

    "The newcomer is the old-timer now, and the next newcomer is your problem."

That is not flavour, it is a specification, and nothing implemented it. The
mirror is even half-built: engine/bohemia_ties.vouchFor() finds somebody who
can vouch for a STRANGER TO YOU. The direction the note describes -- YOU
vouching for somebody, to the outfit -- did not exist.

NOTHING IS INVENTED HERE. The feature is that sentence, made true.

==========================================================================
WHAT IT COSTS, AND WHY IT COSTS THAT
==========================================================================
PORTES 1998, the four dark sides of social capital, which this lane already
builds on: EXCESS CLAIMS ON GROUP MEMBERS. Being inside is not a prize you
collect, it is a relationship that can make demands of you. Putting somebody up
spends the thing that let you do it.

So a vouch costs ONE RUNG of your own standing with that outfit, through
BohemiaBelonging.adjust -- THE ONE WRITER, which is where the three-spellings
bug is solved and where every other change to a count goes. You are INSIDE at
10; vouch and you are at 9, which is still INSIDE, and the second vouch drops
you out of it. THE LADDER PAYS FOR ITSELF: the top rung buys exactly two of
these before you have to climb back.

And it is a DECISION rather than a button, because the person is now yours in
that outfit's eyes. That is the "your problem" half of his sentence, and it is
the same collective-reputation mechanism this lane already built for the outfit
(TIROLE 1996), pointed at one person.

==========================================================================
HOW SOMEBODY JOINS AN OUTFIT WITHOUT A SECOND PLACEMENT RULE
==========================================================================
ctFactionOf() computes allegiance deterministically from the bases and a seat
hash -- it is not stored anywhere, so there is nothing to write to. A vouch
records an OVERRIDE in the save and ctFactionOf consults it FIRST:

    save.meta.vouched['P:city:<id>'] = { faction, day }

MEASURED CARE: the override is keyed on the same 'P:city:'+id the met-ledger
uses, so it survives walking away and coming back, which the per-cell roster
does not. And it is checked BEFORE the hash rather than blended with it,
because a vouch is a FACT ABOUT WHAT YOU DID and must never be re-rolled by a
placement rule that has no idea it happened.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_VOUCH__'

# ------------------------------------------------- 1. THE OVERRIDE IS READ FIRST
OLD_FACOF = """function ctFactionOf(p){
  var bases = ctOtherBases();"""
NEW_FACOF = """function ctFactionOf(p){
  /* """ + MARKER + """ -- WHAT YOU DID BEATS WHAT THE HASH SAYS.
     Allegiance here is COMPUTED from the bases and a seat hash, so there is
     nowhere to write "this person joined". A vouch records an override in the
     save and it is consulted FIRST -- never blended with the roll -- because
     it is a fact about something the player did, and a placement rule that has
     no idea it happened must not get to re-decide it. */
  var __v = ctVouchedFaction(p);
  if(__v) return __v;
  var bases = ctOtherBases();"""

# ------------------------------------------------------------- 2. THE MECHANISM
HELPERS = """
/* ==== """ + MARKER + """ -- THE TOP OF THE LADDER BUYS SOMETHING =========
   MEASURED: bohemia_claim and bohemia_favour both key off COUNTED, by name, at
   build time. NOTHING ANYWHERE KEYED OFF INSIDE. You climbed from COUNTED to
   INSIDE -- four more favours THROUGH THE WALL, which costs a burned bridge,
   the most expensive thing this system asks for -- and the only thing that
   changed was the word on the card.
   bohemia_commitment's own docstring: "A ladder with no wall is a progress
   bar." A ladder whose top rung buys nothing is a progress bar with a wall in
   the middle of it.

   AND THE RUNG SAYS WHAT IT IS FOR. Its note has shipped since 8/12:
       "The newcomer is the old-timer now, and the next newcomer is your
        problem."
   That is a specification. Nothing implemented it. bohemia_ties.vouchFor()
   even half-builds the mirror -- somebody vouching for a STRANGER TO YOU --
   and the direction the note describes did not exist. */

var CT_VOUCH_TOP = 'INSIDE';    /* the ladder's own last rung, by name */

function ctVouchBag(){
  var sv = ctBelongSave();
  if(!sv || !sv.meta) return null;
  return sv.meta.vouched || (sv.meta.vouched = {});
}
/* keyed 'P:city:'+id, the same key the met-ledger uses, so it survives walking
   away and coming back -- which the per-cell roster does not. */
function ctVouchKey(p){ return 'P:city:' + (p && p.id); }
function ctVouchedFaction(p){
  try {
    var bag = ctVouchBag(); if(!bag || !p) return null;
    var v = bag[ctVouchKey(p)];
    return (v && v.faction) ? v.faction : null;
  } catch(_e){ return null; }
}
/* CAN YOU PUT THIS PERSON UP, AND FOR WHOM.
   Three things have to be true and each one is a real answer on its own:
     - they run with NOBODY. You cannot hand somebody to an outfit they are
       already in, and you certainly cannot move them between outfits.
     - you are INSIDE somewhere. That is the whole price of the door.
     - you have MET them. Putting up a stranger you have never spoken to is
       not a vouch, it is a guess, and the word means what it means. */
function ctVouchFor(p){
  try {
    if(typeof BohemiaBelonging === 'undefined' || !p) return null;
    if(ctFactionOf(p)) return null;                       /* already somebody's */
    if(typeof CT_MET !== 'undefined' && !CT_MET.get(ctVouchKey(p))) return null;
    var sv = ctBelongSave(), best = null;
    var rules = BohemiaBelonging.RULES || {};
    for(var k in rules){
      var rule = BohemiaBelonging.ruleOf(k); if(!rule) continue;
      var bar = BohemiaBelonging.bargain(rule, BohemiaBelonging.gaveOf(sv, k));
      if(!bar || !bar.rung || String(bar.rung.word) !== CT_VOUCH_TOP) continue;
      /* if you are INSIDE with more than one, the one you have given most to
         is the one whose word carries furthest. Deterministic, never a pick. */
      var have = BohemiaBelonging.gaveOf(sv, k);
      if(!best || have > best.have) best = { fid:k, have:have };
    }
    return best;
  } catch(_e){ return null; }
}
/* THE ACT. One writer for the count (BohemiaBelonging.adjust), one writer for
   the override (the bag), and the cost is taken BEFORE the override is written
   so a failure cannot hand out a free membership. */
function ctVouchDo(p){
  var can = ctVouchFor(p); if(!can) return null;
  var sv = ctBelongSave(), bag = ctVouchBag(); if(!bag) return null;
  /* PORTES 1998, EXCESS CLAIMS ON GROUP MEMBERS: being inside is a
     relationship that can make demands of you, not a prize you collect. The
     vouch spends the standing that allowed it. You are INSIDE at 10; this
     leaves you at 9, still INSIDE, and the second one drops you out. The top
     rung buys exactly two before you climb back. */
  BohemiaBelonging.adjust(sv, can.fid, -1);
  bag[ctVouchKey(p)] = { faction: can.fid, day: (T && T.day) || 1 };
  try { if(typeof ctDeed === 'function')
          ctDeed('commit', (typeof CT_DEED_CLOUT !== 'undefined'
                            ? CT_DEED_CLOUT['commit'] : 1), can.fid); } catch(_e){}
  return { who: p.id, faction: can.fid };
}
"""

# ------------------------------------------------------------ 3. ON THE CARD
OLD_BTN = """    body+='<button id="ctcommit">'+ctWall.passWord+'</button>';"""
NEW_BTN = """    body+='<button id="ctcommit">'+ctWall.passWord+'</button>';"""

# the vouch row + button go on the card of somebody who runs with nobody
OLD_RUNSWITH = """  if(fid) body += ctRow('RUNS WITH', String(fid).toUpperCase());"""
NEW_RUNSWITH = """  if(fid) body += ctRow('RUNS WITH', String(fid).toUpperCase());
  /* """ + MARKER + """ -- AND IF THEY RUN WITH NOBODY, WHETHER YOU CAN CHANGE
     THAT. The rung note says "the next newcomer is your problem", so the offer
     only appears where the sentence applies: somebody with no outfit, whom you
     have actually met, while you are INSIDE somewhere. draft:true. */
  if(!fid){
    /* CT_OPEN, NOT p -- AND MY OWN CATCH HID THAT FOR A ROUND.
       ctIntroRows(body, intro, fid, ctOnwardKey) has no person parameter, so
       the first version referenced a `p` that does not exist here, threw, and
       the try/catch swallowed it. The BUTTON worked the whole time, because it
       is built inside ctDraw where `var p = CT_OPEN` really is in scope, so
       the offer appeared and the sentence explaining it silently did not.
       "A BARE CATCH HERE COST THIS LANE THREE DAYS" is already a comment in
       this file about ctFactionOf. I wrote another one twelve hours later.
       So it says so now, once, instead of going quiet. */
    try {
      var ctCan = ctVouchFor(CT_OPEN);
      if(ctCan){
        body += ctRow('RUNS WITH', 'NOBODY');
        body += ctRow('YOU COULD PUT THEM UP', 'FOR THE '
          + String(ctCan.fid).toUpperCase());
        body += ctNote('You are INSIDE with them, so your word is worth '
          + 'something there. It costs you a rung of your own standing to '
          + 'spend it, and after that what this person does is yours.');
      }
    } catch(_e){
      if(!ctIntroRows.__vwarn){ ctIntroRows.__vwarn = 1;
        console.error('BOHEMIA: the vouch row threw and was swallowed -- '
          + 'the offer may render as a button with no sentence. ' + _e.message); }
    }
  }"""

# the button itself, beside the commit button
OLD_BTNBLOCK = """  if(ctAct && !ctFavIsAct) body+='<button id="ctgive">'+ctAct.label+'</button>';"""
NEW_BTNBLOCK = """  if(ctAct && !ctFavIsAct) body+='<button id="ctgive">'+ctAct.label+'</button>';
  /* """ + MARKER + """ -- the door the top rung buys. */
  try {
    if(!ctFid){
      var ctVCan = ctVouchFor(p);
      if(ctVCan) body += '<button id="ctvouch">PUT THEM UP FOR THE '
        + String(ctVCan.fid).toUpperCase() + '</button>';
    }
  } catch(_e){}"""

OLD_WIRE = """  var commit=document.getElementById('ctcommit');"""
NEW_WIRE = """  /* """ + MARKER + """ -- and it does something when pressed, which is the
     entire point of the finding. */
  var ctvb=document.getElementById('ctvouch');
  if(ctvb) ctvb.addEventListener('click',function(){
    var done = ctVouchDo(p);   /* ctDraw's own `var p = CT_OPEN` */
    if(done){ advance(60); ctClose(); ctOpen(); ctDraw(); render(); }
  });
  var commit=document.getElementById('ctcommit');"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if 'function ctOtherBases' not in s:
        sys.exit('FAIL: run tools/bohemia_city_outfit_patch.py first')

    for old, new, what in ((OLD_FACOF, NEW_FACOF, 'the faction bridge'),
                           (OLD_RUNSWITH, NEW_RUNSWITH, 'the runs-with row'),
                           (OLD_BTNBLOCK, NEW_BTNBLOCK, 'the button block'),
                           (OLD_WIRE, NEW_WIRE, 'the commit wiring')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    at = '/* __CITY_OUTFIT__ -- THE BASES SOMEBODY ELSE COULD RUN WITH.'
    if at not in s:
        sys.exit('FAIL: could not find a home for the vouch helpers')
    s = s.replace(at, HELPERS + '\n' + at, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY VOUCH: the top of the ladder buys something now')
    print('  TAB: RUN. Walk up to somebody who runs with nobody while you are')
    print('  INSIDE with an outfit.')


if __name__ == '__main__':
    main()

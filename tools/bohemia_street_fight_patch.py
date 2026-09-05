#!/usr/bin/env python3
"""
V201 THE FIGHT STARTS WHERE YOU STAND.

VAMILY job: THE-FIGHT-STARTS-WHERE-YOU-STAND [street fight], with RUN
[enemies exist] and PEOPLE [who is hostile].

  PAOLO 9/5, having played it: "Awesome I just played the run.
  WHERE THE ENEMIES AT BRO"

  The row: "walking into a hostile group on the street starts the fight right
  there, on the beat, on the house-sized board, without going through the city
  map door (which is the only entry that exists today, gate 26/0)."

-------------------------------------------------------------------------
THE HONEST SENTENCE IS ALREADY WRITTEN, IN THE RULING THAT MADE THIS ROW
-------------------------------------------------------------------------
    "The game knows who your enemies are. It has never once put one in front
     of you."

Measured there, and re-checked here before writing a line: every "hostile" and
"enemy" string in the alpha, the city and the demo is PROSE. Hostility exists in
`engine/bohemia_between.js` as a SIGN ON A RELATIONSHIP -- they charge you more,
they watch you, the board sorts them first -- and it is a LEDGER, NEVER A BODY.
And the fight is real and reachable, but only through the city map door: never
because somebody walked up to you.

*** SO THE LEDGER ALREADY KNOWS, AND THE STREET HAS NEVER ASKED IT. *** That is
the same shape as the last two rows this lane closed: the material was built, and
nothing consumed it.

-------------------------------------------------------------------------
WHAT IS MINE HERE AND WHAT IS NOT
-------------------------------------------------------------------------
Three lanes are on this ruling and the row names the split, so this patch does
its third and stops:

  RUN     [enemies exist]   hostile bodies stand, walk and close on the street
  PEOPLE  [who is hostile]  the crowd wears the sign the ledger computes
  COMBAT  [street fight]    BUMPING A HOSTILE GROUP STARTS THE FIGHT WHERE YOU
                            STAND  <- this patch, and only this

So NO HOSTILITY IS AUTHORED HERE. The trigger reads, in order:

  1. A REAL HOSTILE BODY, the moment RUN or PEOPLE ship one. `p.hostile` and
     `p.foe` are read before anything else, so their rows land and this entry
     starts using them with no second wire.
  2. THE BETWEEN-LEDGER, which already computes exactly this and never reached
     the street: their outfit against yours, and the edge's own `sign` field.
     Consuming canon is not authoring it.
  3. Nothing. The street stays quiet.

-------------------------------------------------------------------------
AND IT REUSES THE DOOR'S ENTIRE PIPELINE, WHICH IS WHY IT IS SMALL
-------------------------------------------------------------------------
`cityFightOnEnter` already posts BOHEMIA_CITY_ENCOUNTER and the shell already
consumes it, starts the fight, and walks you home afterwards through
BOHEMIA_CITY_COMBAT_END. This posts THE SAME MESSAGE from the street.

*** AND IT SENDS NO ROOM, WHICH IS THE WHOLE DIFFERENCE. *** V200 taught the
fight to build the board out of the building you walked into; with no room it
builds a street, which is correct, because you are standing on one. One field
decides which board you fight on and it is the field the city already fills.

DETERMINISTIC, NEVER A COIN FLIP PER STEP -- the same rule `cityFightRoll` gives
for the door, and for the same reason: he cannot farm an encounter by stepping
back and forth over a kerb, and the same person on the same block behaves the
same way every time. A street is a place, not a slot machine.

  * NOT WHILE HE IS INDOORS, because that is the door's fight.
  * NOT TWICE FROM THE SAME PERSON. Once he has swung at you he is not an
    ambush any more.
  * A COOLDOWN IN STEPS, so one bad block is not a corridor of fights.
  * AND NOT IN THE FIRST MINUTES OF THE DAY, because being jumped before you
    are out of your own street is the __NOT_YOUR_OWN_HOUSE__ lesson from the
    door path, one surface along.

NO DAMAGE BEFORE THE DIAL: this patch contains no damage, accuracy, range or
resource number. It is an ENTRY.

REUSE CHECK: cooks no graphic pixels and opens no bank. ctAdjacent is the shipped
"who am I standing next to". The message is the door's message. The hostility is
the ledger's. The board is V200's.

TASTE CHECK: nothing new on screen. The first thing he sees is the fight.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import re
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__STREET_FIGHT__'
MARK_CREW = 'streetCrewOnYou'

CREW_BLOCK = '''/* *** AND THE REAL ANSWER IS RUN'S CREW, WHICH LANDED IN THE SAME ROUND. ***
   RUN [enemies exist] shipped hostile bodies as a CREW standing at a cell --
   BohemiaHostiles.near(), with stateOf() returning idle / watch / CLOSE ("they
   are coming") -- and it never decorates a ctAdjacent() person, so `p.hostile`
   would never have been set by it. THE TWO HALVES OF ONE RULING WOULD NOT HAVE
   MET, which is the exact defect this whole ruling is about, one layer up.
   HOST_DREW is what their draw already computed: the crews actually on screen,
   each carrying the state their own model decided. Reading it is not a second
   copy of the question -- asking BohemiaHostiles.near() again here would have
   been. And the crew's own COUNT is how many they are, because RUN decided that,
   not this lane. */
function streetCrewOnYou(){
  try{
    if(typeof HOST_DREW==='undefined' || !HOST_DREW || !HOST_DREW.length) return null;
    for(var i=0;i<HOST_DREW.length;i++){
      var cw=HOST_DREW[i];
      if(cw && cw.state==='close') return cw;   /* they have clocked you and they are coming */
    }
  }catch(_e){}
  return null;
}
function streetFightOnStep(){
  if(typeof INSIDE!=='undefined' && INSIDE) return false;   /* indoors is the door's fight */
  if(!(window.parent&&window.parent!==window)) return false;
  SF_STEPS++;
  if(SF_STEPS < SF_GRACE) return false;
  if(SF_STEPS - SF_LAST < SF_COOLDOWN) return false;
  /* A CREW THAT IS COMING FOR YOU IS THE FIGHT, and it is asked first because it
     is the real one. */
  var crew=streetCrewOnYou();
  if(crew){
    var ck='crew:'+crew.at[0]+','+crew.at[1];
    if(!SF_DONE[ck]){
      SF_DONE[ck]=1; SF_LAST=SF_STEPS;
      var cn=Math.max(1,Math.min(8,crew.count|0)), croster=[];
      for(var ci=0;ci<cn;ci++) croster.push({arch:(ci%4===3)?'bot':'human'});
      var cfac=null; try{ cfac=(typeof cityFactionHere==='function')?cityFactionHere():null; }catch(_e){}
      try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',
        label:'out on the block', faction:cfac, draft:true, roster:croster,
        street:true, why:'crew',
        at:{gx:hx|0, gy:hy|0}},'*'); }catch(_e){ return false; }
      return true;
    }
  }'''


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:200]))
    return src.replace(old, new)


def crew_amend(html):
    """THE HALF THAT MEETS RUN. Separate mark, because V201 shipped before RUN's
    bodies landed and this must stay replayable onto a tree that already has it."""
    if MARK_CREW in html:
        return html, False
    return sub(html,
        """function streetFightOnStep(){
  if(typeof INSIDE!=='undefined' && INSIDE) return false;   /* indoors is the door's fight */""",
        CREW_BLOCK, what='the crew half'), True


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        html, did = crew_amend(html)
        if did:
            open(CITY, 'w', encoding='utf-8').write(html)
            print('v201: the crew half wired -- it meets RUN now')
        else:
            print('v201: already applied')
        return

    # ---- 1. THE TRIGGER, beside the door's own ----
    html = sub(html,
        "function cityFightOnEnter(){",
        """/* ===== __STREET_FIGHT__ -- V201 THE FIGHT STARTS WHERE YOU STAND =====
   Paolo 9/5, having played it: "Awesome I just played the run. WHERE THE ENEMIES
   AT BRO." The ruling that came out of it says the honest sentence: "THE GAME
   KNOWS WHO YOUR ENEMIES ARE. IT HAS NEVER ONCE PUT ONE IN FRONT OF YOU."
   Hostility lives in the between-ledger as a SIGN ON A RELATIONSHIP -- they
   charge you more, they watch you -- and it is a ledger, never a body. The fight
   is real and reachable, but ONLY through the city map door.
   THREE LANES ARE ON THAT RULING AND THIS IS THE THIRD OF IT: RUN puts hostile
   bodies on the street, PEOPLE puts the sign on the crowd, and COMBAT makes
   bumping one start the fight where you stand. NO HOSTILITY IS AUTHORED HERE. */
var SF_STEPS=0, SF_LAST=-9999, SF_DONE={};
var SF_COOLDOWN=60;      /* [DIAL] steps of quiet after a street fight, so one bad block is not a corridor of them */
var SF_GRACE=40;         /* [DIAL] steps before the street may jump you at all -- the __NOT_YOUR_OWN_HOUSE__ lesson, one surface along */
var SF_MIN=2, SF_MAX=4;  /* [DIALS, draft:true] how many are with him. The ROOM decided at the door; the BLOCK decides here */
/* WHO WANTS TO HURT YOU, ASKED IN THE ONLY ORDER THAT DOES NOT AUTHOR CANON.
   A real hostile body first, so RUN's and PEOPLE's rows land and this starts
   using them with no second wire. Then the ledger, which already computes this
   and has simply never been asked from the street. Then nothing. */
function streetFoeOf(p){
  if(!p) return null;
  if(p.hostile===true || p.foe===true) return 'body';
  try{
    var w = (typeof ctPerson==='function') ? ctPerson(p) : null;
    var fac = w && (w.faction || w.outfit);
    if(fac && typeof BohemiaBetween!=='undefined'){
      var mine = BohemiaBetween.mine();
      if(mine){
        var e = BohemiaBetween.between(fac, mine, null);
        if(e && e.sign==='hostile') return 'ledger';
      }
    }
  }catch(_e){}
  return null;
}
/* DETERMINISTIC OFF THE PERSON, never a coin flip per step -- the door's own
   rule, for the door's own reason: he cannot farm an encounter by stepping back
   and forth over a kerb, and the same person on the same block behaves the same
   way every time. A street is a place, not a slot machine. */
function streetFightCount(key){
  var h=0, s=String(key||'');
  for(var i=0;i<s.length;i++) h=((h*31)+s.charCodeAt(i))>>>0;
  return SF_MIN + (h % (SF_MAX - SF_MIN + 1));
}
function streetFightOnStep(){
  if(typeof INSIDE!=='undefined' && INSIDE) return false;   /* indoors is the door's fight */
  if(!(window.parent&&window.parent!==window)) return false;
  SF_STEPS++;
  if(SF_STEPS < SF_GRACE) return false;
  if(SF_STEPS - SF_LAST < SF_COOLDOWN) return false;
  var p=null; try{ p=ctAdjacent(); }catch(_e){}
  if(!p) return false;
  var key=null; try{ key=(ctPerson(p)||{}).key || p.id || String(p.home); }catch(_e){ key=String(p&&p.home); }
  if(!key || SF_DONE[key]) return false;                    /* he only ambushes you once */
  var why=streetFoeOf(p);
  if(!why) return false;
  SF_DONE[key]=1; SF_LAST=SF_STEPS;
  var n=streetFightCount(key), roster=[];
  for(var i=0;i<n;i++) roster.push({arch:(i%4===3)?'bot':'human'});
  var fac=null; try{ fac=(typeof cityFactionHere==='function')?cityFactionHere():null; }catch(_e){}
  /* THE SAME MESSAGE THE DOOR SENDS, AND NO ROOM, WHICH IS THE WHOLE
     DIFFERENCE. V200 taught the fight to build its board out of the building you
     walked into; with no room it builds a street, which is correct, because you
     are standing on one. One field decides which board you fight on. */
  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',
    label:'out on the block', faction:fac, draft:true, roster:roster,
    street:true, why:why,
    at:{gx:hx|0, gy:hy|0}},'*'); }catch(_e){ return false; }
  return true;
}
function cityFightOnEnter(){""",
        what='the street fight trigger')

    # ---- 2. HOOKED WHERE THE WALK ALREADY SPENDS ITS TIME ----
    html = sub(html,
        "      try { walkInterrupt(5.04); } catch(_e){}",
        """      try { walkInterrupt(5.04); } catch(_e){}
      /* __STREET_FIGHT__ (V201): and the same step asks whether he just walked
         into somebody who wants to hurt him. This is the only hook needed --
         one step is one place a body arrives, exactly as inEnter is the one
         place a body goes through a door. */
      try { streetFightOnStep(); } catch(_e){}""",
        what='hooked to the walked step')

    open(CITY, 'w', encoding='utf-8').write(html)

    # ---- 3. AND THE OBJECTIVE READS LIKE ENGLISH ----
    # cityEncounterIn builds "inside the <label>", which is right for a room and
    # reads "INSIDE THE OUT ON THE BLOCK" for a street. Caught by looking at what
    # the line would say rather than at whether the fight started.
    alpha = open(ALPHA, encoding='utf-8').read()
    if MARK not in alpha:
        alpha = sub(alpha,
            "      objective:(d&&d.label)?('inside the '+d.label):null,",
            "      objective:(d&&d.label)?((d.street?'':'inside the ')+d.label):null,   /* __STREET_FIGHT__ V201: a room is somewhere you are INSIDE; a street is somewhere you are ON, and the template read \"inside the out on the block\" */",
            what='the objective reads like English')
        open(ALPHA, 'w', encoding='utf-8').write(alpha)

    print('v201: the fight starts where you stand -- city + shell wired')


if __name__ == '__main__':
    main()

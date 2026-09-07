#!/usr/bin/env python3
"""
V203 -- TOUCHING A PARTY STARTS THE GROUP FIGHT  (COMBAT lane, VAMILY [contact fight])

  "contact on the travel map opens the fight we already built, with THAT party's
   real people in it, on the ground you met them on."

THE MATERIAL WAS BUILT AND THE GAME SAID SO OUT LOUD. The road director has put
parties in front of the player since 8/27 -- his approved twelve, on the map and
on the walked street -- and the card printed, in words:

    "Fighting is not in this build yet."

That sentence was TRUE when it was written and the reason is written beside it:
"'drop', 'fight', 'join' and 'third-party' are all kills, and NO DAMAGE BEFORE
THE DIAL." It stopped being true when the fight got a door (V161), a street
(V201) and a first lesson (V202). Handing an encounter to the shipped fight
authors no damage number at all -- the fight already owns every one of them.

WHO IS IN THE PARTY IS HIS. Every count below is read off ROAD_WORDS, which he
approved: "Four of them have the ramp", "Three of them, spread wide", "Six,
maybe eight". Nothing here invents a headcount and nothing here invents a
hostility.

ANIMALS ARE NOT IN THIS ROW. The dog pack, the coyote and the snake are parties
too, and CREATURES is a different open row with nobody on it: what they are and
how they fight is canon this lane does not hold.

Replayable and MARK-idempotent, like every tool in this lane.
"""
import base64
import re
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__CONTACT_FIGHT__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:120]))
    return src.replace(old, new, n)


BLOCK = r"""
/* ===== V203 __CONTACT_FIGHT__ -- TOUCHING A PARTY STARTS THE GROUP FIGHT =====
   The road director has been putting parties in front of him since 8/27 and the
   card said, in words, "Fighting is not in this build yet." That was TRUE when
   it was written -- the reason is three lines up from ROAD_CHOICES: the missing
   arms are kills and NO DAMAGE BEFORE THE DIAL. It stopped being true when the
   fight got a door (V161), a street (V201) and a first lesson (V202). Handing
   the encounter to the shipped fight authors NO damage number: the fight owns
   every one of them already.

   WHO IS IN THE PARTY IS HIS, and every number below is read off ROAD_WORDS:
     "Four of them have the ramp"          -> 4
     "Three of them, spread wide"          -> 3
     "A guy steps out with a length of pipe" -> 1
     "A man comes up the middle of the road" -> 1
     "It rolls out from under the porte cochere" -> 1, and it is a machine
     "Six, maybe eight"                    -> 6 to 8
   Nothing here invents a headcount and nothing here invents a hostility.

   THE ANIMALS ARE NOT IN IT. The dog pack, the coyote and the snake are parties
   too, and CREATURES is an open row with nobody on it: what they are and how
   they fight is canon this lane does not hold. Their tokens fall through
   untouched, exactly as they do today. */
var ROAD_PARTY = {
  scavenger_shakedown: { n:1,          arch:'human', act:'DROP HIM' },
  toll_crew:           { n:4,          arch:'human', act:'TAKE THE RAMP' },
  patrols_collide:     { lo:6, hi:8,   arch:'human', act:'TAKE BOTH CREWS' },
  /* FORCED IS HIS OWN CLASS AND IT ALREADY MEANS THIS HAPPENS TO YOU. These
     three do not get a card and do not get asked: the words say he does not
     slow down, they have done this before, and it keeps coming. */
  crazed_wanderer:     { n:1,          arch:'human', forced:true },
  bounty_squad:        { n:3,          arch:'human', forced:true },
  casino_security_bot: { n:1,          arch:'bot',   forced:true }
};
function roadPartyOf(id){ return (id&&ROAD_PARTY[id])||null; }
/* "SIX, MAYBE EIGHT" IS A RANGE HE WROTE, so it is read as one. Deterministic
   off the encounter's own seq, exactly like the cab's heading, so it rolls no
   seeded stream -- A FEATURE THAT COSTS A SEEDED STREAM ONE DRAW REWRITES THE
   WHOLE MAP (8/27). */
function roadPartySize(P, ev){
  if(!P) return 0;
  if(P.lo!=null) return P.lo + (((ev&&ev.seq)|0) % ((P.hi-P.lo)+1));
  return P.n; }
function roadFightRoster(P, ev){
  var n=Math.max(1,Math.min(8,roadPartySize(P,ev))), r=[], i;
  for(i=0;i<n;i++) r.push({ arch:P.arch });
  return r; }
/* ONE STEP MAKES AT MOST ONE FIGHT. streetFightOnStep (V201) and roadInterrupt
   both run on the walked step, in that order, and neither knows about the other
   -- which is correct and is why they must not be merged, but two entries that
   cannot see each other can post two encounters for one footfall. This flag is
   the only thing they share: not a merge, a fuse. */
var CITY_CONTACT_POSTED = false;
function contactPosted(){ return CITY_CONTACT_POSTED; }
function contactClear(){ CITY_CONTACT_POSTED = false; }
function roadContactFight(ev){
  var P=roadPartyOf(ev&&ev.id); if(!P) return false;
  if(CITY_CONTACT_POSTED) return false;
  if(typeof INSIDE!=='undefined' && INSIDE) return false;   /* indoors is the door's fight */
  if(!(window.parent&&window.parent!==window)) return false;
  var fac=null; try{ fac=(typeof cityFactionHere==='function')?cityFactionHere():null; }catch(_e){}
  var w=[0,0]; try{ w=roadWhere(); }catch(_e){}
  /* THE SAME MESSAGE THE DOOR AND THE STREET BUMP SEND, AND NO ROOM. V200 taught
     the fight to build its board out of the building you walked into; with no
     room it builds a STREET, which is what the ground you met them on is. One
     field decides which board you fight on and this is the field. */
  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',
    label:String((ev&&ev.name)||'on the road'), faction:fac, draft:true,
    roster:roadFightRoster(P,ev), street:true, why:'road:'+(ev&&ev.id),
    at:{gx:w[0]|0, gy:w[1]|0}},'*'); }catch(_e){ return false; }
  CITY_CONTACT_POSTED = true;
  try{ if(typeof SF_LAST!=='undefined' && typeof SF_STEPS!=='undefined') SF_LAST=SF_STEPS; }catch(_e){}
  return true; }
/* AND THE ARM GOES ON HIS CARD, for the three that are a choice. Read off each
   token's own approved `ends` -- 'pay / scare / drop', 'pay / fight / detour',
   'join, third-party, loot after, or walk on' -- never invented here. The words
   on the buttons are draft:true like every other word on this card. */
(function(){
  var A={ scavenger_shakedown:{say:'You put him down. He was never going to be able to make you.'},
          toll_crew:{say:'You take the ramp off them. Nobody is sitting on the cooler now.'},
          patrols_collide:{say:'You walk into the middle of it and neither crew gets to finish.'} };
  for(var id in A){
    var P=ROAD_PARTY[id], C=ROAD_CHOICES[id];
    if(!P||!C||!P.act) continue;
    var dup=false;
    for(var i=0;i<C.opts.length;i++) if(C.opts[i].a==='fight') dup=true;
    if(dup) continue;
    C.opts.push({ a:'fight', t:P.act, fight:true, say:A[id].say });   /* draft:true */
  }
  /* THE WHY LINES DESCRIBED A MISSING ARM. Two of them are now on the card, so
     they go; patrols_collide keeps one, because JOINING A SIDE needs to know
     whose side, and which two crews those are is canon this lane does not hold. */
  if(ROAD_CHOICES.scavenger_shakedown) delete ROAD_CHOICES.scavenger_shakedown.why;
  if(ROAD_CHOICES.toll_crew) delete ROAD_CHOICES.toll_crew.why;
  if(ROAD_CHOICES.patrols_collide)
    ROAD_CHOICES.patrols_collide.why='Joining a side is the other way and it needs to know whose side.';   /* draft:true */
})();
/* ===== /V203 __CONTACT_FIGHT__ ===== */
"""


def main():
    patch_city()
    patch_alpha()


def patch_city():
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('  city slice already patched')
        return

    # 1. the party table and the entry, right after the choices they read from.
    s = sub(s,
            "var ROAD_LASTDIR = null;   /* which way he was going, for the ride */",
            BLOCK.strip() + "\n\nvar ROAD_LASTDIR = null;   /* which way he was going, for the ride */",
            1, 'city/block')

    # 2. THE SENTENCE COMES OUT, because it is no longer true.
    s = sub(s,
            "    if(C.why) acts += '<div class=\"rwhy\" data-draft=\"true\">' + esc(C.why)\n"
            "           + ' Fighting is not in this build yet.</div>';",
            "    /* V203 __CONTACT_FIGHT__: the card used to end this line with \"Fighting is\n"
            "       not in this build yet.\" It is in the build now, and on this card. */\n"
            "    if(C.why) acts += '<div class=\"rwhy\" data-draft=\"true\">' + esc(C.why) + '</div>';",
            1, 'city/not-in-build')

    # 3. a fight arm is priced in what it is, not in salvage or minutes.
    s = sub(s,
            "      var tag = o.pay ? (o.pay+' SALVAGE') : o.min ? (o.min+' MIN')\n"
            "              : o.ride ? 'A LIFT' : 'FREE';",
            "      var tag = o.fight ? 'A FIGHT'                       /* V203 __CONTACT_FIGHT__ */\n"
            "              : o.pay ? (o.pay+' SALVAGE') : o.min ? (o.min+' MIN')\n"
            "              : o.ride ? 'A LIFT' : 'FREE';",
            1, 'city/tag')

    # 4. pressing it starts the fight instead of writing an outcome line: the
    #    fight IS the outcome, and it has its own surface.
    s = sub(s,
            "      var r = roadChoose(ev, act.slice(3));\n"
            "      if(!r) return;",
            "      /* V203 __CONTACT_FIGHT__: the fight arm has no outcome to print, because\n"
            "         the fight is the outcome and it has a surface of its own. */\n"
            "      if(act === 'ch:fight'){\n"
            "        if(roadContactFight(ev)){ try{ cardHide(); }catch(_e){} }\n"
            "        return; }\n"
            "      var r = roadChoose(ev, act.slice(3));\n"
            "      if(!r) return;",
            1, 'city/press')

    # 5. A FORCED PARTY DOES NOT ASK. His own class already says so.
    s = sub(s,
            "    var kg = 0; try{ kg = roadLeave(got); }catch(_e){}\n"
            "    try{ roadCard(got, mins, kg); }catch(_e){}",
            "    var kg = 0; try{ kg = roadLeave(got); }catch(_e){}\n"
            "    /* ===== V203 __CONTACT_FIGHT__: A FORCED PARTY DOES NOT ASK =========\n"
            "       'forced' is his own class out of the approved verdict and it already\n"
            "       means this happens to you: he does not slow down, they have done this\n"
            "       before, it keeps coming. So contact starts the fight and there is no\n"
            "       card to press -- which is also what the row is called. A card with one\n"
            "       button on it is a choice pretending it is not. */\n"
            "    var _fought = false;\n"
            "    if(got.kind === 'forced'){ try{ _fought = roadContactFight(got); }catch(_e){} }\n"
            "    if(!_fought){ try{ roadCard(got, mins, kg); }catch(_e){} }",
            1, 'city/forced')

    # 6. THE FUSE IS ARMED ONCE PER STEP, at the top of the one function every
    #    step in either mode goes through.
    s = sub(s,
            "function stepOnce(di){\n"
            "  const [dx,dy]=DIRS[di];",
            "function stepOnce(di){\n"
            "  try{ contactClear(); }catch(_e){}   /* V203 __CONTACT_FIGHT__: one step, at most one fight */\n"
            "  const [dx,dy]=DIRS[di];",
            1, 'city/fuse')

    # 7. and the street bump blows the same fuse, so the two entries cannot both
    #    land on one footfall. It is the ONLY thing they share.
    s = sub(s,
            "      try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "        label:'out on the block', faction:cfac, draft:true, roster:croster,\n"
            "        street:true, why:'crew',\n"
            "        at:{gx:hx|0, gy:hy|0}},'*'); }catch(_e){ return false; }\n"
            "      return true;",
            "      try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "        label:'out on the block', faction:cfac, draft:true, roster:croster,\n"
            "        street:true, why:'crew',\n"
            "        at:{gx:hx|0, gy:hy|0}},'*'); }catch(_e){ return false; }\n"
            "      try{ CITY_CONTACT_POSTED=true; }catch(_e){}   /* V203 */\n"
            "      return true;",
            1, 'city/fuse-crew')
    s = sub(s,
            "  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "    label:'out on the block', faction:fac, draft:true, roster:roster,\n"
            "    street:true, why:why,\n"
            "    at:{gx:hx|0, gy:hy|0}},'*'); }catch(_e){ return false; }\n"
            "  return true;",
            "  try{ window.parent.postMessage({type:'BOHEMIA_CITY_ENCOUNTER',\n"
            "    label:'out on the block', faction:fac, draft:true, roster:roster,\n"
            "    street:true, why:why,\n"
            "    at:{gx:hx|0, gy:hy|0}},'*'); }catch(_e){ return false; }\n"
            "  try{ CITY_CONTACT_POSTED=true; }catch(_e){}   /* V203 */\n"
            "  return true;",
            1, 'city/fuse-person')

    # and the street bump respects the fuse on the way in, so the ORDER of the two
    # on a walked step stops mattering.
    s = sub(s,
            "function streetFightOnStep(){\n"
            "  if(typeof INSIDE!=='undefined' && INSIDE) return false;   /* indoors is the door's fight */",
            "function streetFightOnStep(){\n"
            "  try{ if(CITY_CONTACT_POSTED) return false; }catch(_e){}   /* V203 __CONTACT_FIGHT__ */\n"
            "  if(typeof INSIDE!=='undefined' && INSIDE) return false;   /* indoors is the door's fight */",
            1, 'city/fuse-street')

    open(CITY, 'w', encoding='utf-8').write(s)
    print('V203 applied to', CITY)


# ---------------------------------------------------------------- THE FIGHT ---
def patch_blob(b):
    """AND THE PARTY THAT ARRIVES IS THE PARTY THAT WAS SENT.

    The row says the fight opens "with THAT party's real people in it", and it
    did not. MEASURED, and it is two separate holes in one wire:

      1. enter() sets numEnemies from the roster and then setupEnemies OVERWRITES
         it with rollEncounterSize(). A four-man toll crew arrived as three to
         six strangers. Recorded as a pre-existing defect on 9/5 and it is this
         row's to close, because a roster nobody honours is not a party.
      2. applyRoster only ever copied name, hp and eid. The ARCHETYPE rode all
         the way in from the city and was thrown away at the door, so the dead
         casino security bot -- a machine, 160 hp, the only bot in the table --
         turned up as a goon with a pistol.

    THE DRAW STILL HAPPENS AND ITS RESULT IS DISCARDED, never skipped: a feature
    that costs a seeded stream one draw rewrites the whole board (V190's rule,
    two rows along), and a bench fight with no roster must land byte-identical.
    """
    if MARK in b:
        print('  blob already patched')
        return b

    b = sub(b,
            "    G.numEnemies=(d.roster&&d.roster.length)?Math.max(1,Math.min(8,d.roster.length)):(G.numEnemies||3);",
            "    G.numEnemies=(d.roster&&d.roster.length)?Math.max(1,Math.min(8,d.roster.length)):(G.numEnemies||3);\n"
            "    /* ===== V203 " + MARK + ": THE PARTY THAT ARRIVES IS THE ONE THAT\n"
            "       WAS SENT. Written here, where the roster is in hand, and read below\n"
            "       in setupEnemies -- which has been quietly rolling its own number over\n"
            "       the top of this line since the day it was written. Cleared to zero on\n"
            "       a fight with no roster, so the bench is untouched. */\n"
            "    G._rosterN=(d.roster&&d.roster.length)?Math.max(1,Math.min(8,d.roster.length)):0;\n"
            "    G._rosterArch=(d.roster&&d.roster.length)?d.roster.map(function(r){return (r&&r.arch)||null;}):null;",
            1, 'blob/roster-n')

    b = sub(b,
            "  if(G._bossOn&&G.encCurve!==false)G.numEnemies=6+Math.floor(Math.random()*3);",
            "  if(G._bossOn&&G.encCurve!==false)G.numEnemies=6+Math.floor(Math.random()*3);\n"
            "  /* ===== V203 " + MARK + ": AND THE ROSTER IS THE LAST WORD =============\n"
            "     THERE ARE THREE WRITERS OF THIS NUMBER, not two, and the first cut of\n"
            "     this row only knew about two: enter() takes it from the roster,\n"
            "     rollEncounterSize() writes over that, and THE BOSS LINE WRITES OVER\n"
            "     THAT. A one-man encounter arrived as seven and the roster looked\n"
            "     honoured everywhere else, because the archetype had already been\n"
            "     applied to the first body. So it is set HERE, after every roll, where\n"
            "     nothing can be added above it without being seen.\n"
            "     BOTH DRAWS STILL HAPPEN and both answers are discarded: skipping one\n"
            "     would shift the seeded stream and rewrite every board behind it, which\n"
            "     is V190's rule two rows along.\n"
            "     AND IT IS A LATCH, CONSUMED AND CLEARED, which the first cut of this\n"
            "     row got wrong and the gates caught: enter() is the only writer, so a\n"
            "     BENCH fight -- which never goes through enter() -- inherited whatever\n"
            "     the last encounter's roster was and every later fight on the bench was\n"
            "     pinned to that count. Measured: main 170/0 three runs, this tree red\n"
            "     two runs in three, on three DIFFERENT arms. A fight built without a\n"
            "     fresh roster is never a rostered fight. */\n"
            "  const _rosterN=G._rosterN|0, _rosterArch=G._rosterArch;\n"
            "  G._rosterN=0; G._rosterArch=null;\n"
            "  if(_rosterN>0)G.numEnemies=_rosterN;",
            1, 'blob/roster-honoured')

    b = sub(b,
            "  const _roster=composeRoster(N);\n",
            "  const _roster=composeRoster(N);\n"
            "  /* V203 " + MARK + ": and WHO they are came with them. The archetype has\n"
            "     ridden in from the city on every roster since the door was built and was\n"
            "     dropped at this line, so the one machine in the table turned up as a man\n"
            "     with a pistol. Only names the table already holds are accepted. */\n"
            "  if(_rosterArch&&_rosterArch.length){ for(let _a=0;_a<N;_a++){\n"
            "    const _k=_rosterArch[_a]; if(_k&&ARCH[_k])_roster[_a]=_k; } }\n",
            1, 'blob/roster-arch')
    return b


def patch_alpha():
    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('COMBAT_B64 not found')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    nb = patch_blob(blob)
    if nb != blob:
        enc = base64.b64encode(nb.encode('utf-8')).decode('ascii')
        s = s[:m.start(1)] + enc + s[m.end(1):]
    # THE TWO HALVES ARE INDEPENDENT. The first cut hung the alpha on the CITY's
    # mark, so replaying onto a rebased tree -- where the city merged cleanly and
    # only the alpha conflicted -- skipped the fight half entirely and said
    # nothing. A replay tool that can silently do half its job is worse than one
    # that refuses.
    # AND A DEFAULT INVENTED AT THE DOOR STOPS OVERWRITING THE TABLE. startEncounter
    # filled hp:60 for every rostered body, and applyRoster then wrote that 60 over
    # whatever the archetype's own table said -- so the one machine in the game, at
    # 160, arrived with a goon's health while correctly wearing the machine's
    # archetype. The city sends no hp because it has none to send; nothing reads
    # this field as a number (its only reader sets it to 0 on death), and
    # applyRoster already guards on it being present.
    s = sub(s,
            "const roster=(spec.roster||[]).map((r,i)=>({eid:i,name:r.name||('hostile_'+i),hp:r.hp||60,arch:r.arch||'human',dead:false}));",
            "const roster=(spec.roster||[]).map((r,i)=>({eid:i,name:r.name||('hostile_'+i),hp:(r.hp!=null?r.hp:null),arch:r.arch||'human',dead:false}));   /* V203 " + MARK + ": no hp invented at the door -- the archetype's table owns it */",
            1, 'shell/no-default-hp')

    s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
               r'\g<1>BUILD 9/6ay - TOUCHING A PARTY STARTS THE FIGHT\g<2>', s, count=1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('V203 applied to', ALPHA)


if __name__ == '__main__':
    main()

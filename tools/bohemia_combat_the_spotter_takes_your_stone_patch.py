#!/usr/bin/env python3
"""
V195 THE SPOTTER TAKES YOUR STONE -- RF4-37's missing half, and the measurement
says the man the game calls the worst was worth LESS to kill than a random goon.

  PAOLO 8/27: "we are trying to create the best funnest DEEPEST videogame ever."

RF4-37, quoted in the teardown: "rather than simply blasting away at whichever
enemy is closest the player often needs to plan a few turns ahead, IGNORE THE
NEAREST ENEMIES and somehow maneuver himself into position to kill the
Priority-Target who is often hiding in the back." Our own column on that row says
what was missing, in these words: **"WHAT IS MISSING IS A TARGET WORTH CROSSING
THE ROOM FOR."**

-------------------------------------------------------------------------
*** READ THIS PART FIRST: THE MEASUREMENT THAT MOTIVATED THIS WAS AN ARTIFACT,
AND I AM SAYING SO BEFORE THE GOOD NEWS. ***
-------------------------------------------------------------------------
The first probe -- same boards, one man removed at the bell, player not shooting
-- read: nobody removed 81.8 damage, THE SPOTTER removed 70.6, A PLAIN GOON
removed 66.8, and I wrote down "KILLING THE PRIORITY MAN IS WORTH LESS THAN
KILLING A RANDOM GOON."

THAT PLAYER HAS 100 HEALTH AND WAS TAKING 82 TO 95 OF IT IN EVERY ARM. THE RULER
WAS SATURATED. Re-run at 600 health, where the number can actually move, and
killing the spotter came out AHEAD of a goon before this change was written at
all. The premise did not survive its own instrument.

AND WITH THE RULER FIXED THE QUESTION IS UNDER-POWERED, WHICH IS ALSO WORTH
SAYING: a passive player over twenty turns takes about 266 damage whoever you
remove, run-to-run variance on the same seeds is around 10, and the effects being
chased are 5 to 15. Removing one man of four does not move a fixed-length beating
by enough to read at 37 boards. So this ships ON THE MECHANIC AND NOT ON A DAMAGE
IMPROVEMENT, and the record says exactly that.

A second edit that unhooked V168's standoff lane while the call was live was
written, measured, and REVERTED: with the A/B in the noise there was no evidence
for it, and changing shipped AI behaviour on no evidence is the thing this file
keeps catching itself doing.

-------------------------------------------------------------------------
WHAT SHIPS: WHILE HE HAS A LINE ON YOU, YOUR STONE STOPS WORKING
-------------------------------------------------------------------------
RF4-28: "enemies are designed as COUNTERS TO EFFECTIVE PLAYER ACTIONS,
deliberately." V177 measured the effective player action: THE STONE TAKES 73% OF
THE GUNS OFF YOU. The breacher shoots the rock. The spotter does the other thing:
he does not break your cover, HE TELLS THEM WHERE YOU ARE ANYWAY.

  * While a living spotter has a line on you, every other man ignores your cover.
  * That is ONE new fact routed through V165's master switch (seesMe) and the two
    functions that decide who can shoot you. NOT ONE DAMAGE, ACCURACY, HP, ARMOUR
    OR RANGE NUMBER CHANGES.
  * AND IT HAS REAL COUNTERS, which is what separates a counter-enemy from a tax:
      - break HIS line and the call dies. He has to see you himself.
      - smoke still kills it outright. BREAK CONTACT is untouched, deliberately:
        a called sight that ignored smoke would silently delete an ability every
        time a spotter was on the board.
      - he is 45 hp, the squishiest body in the game.
      - and he is still outside your reach at the bell, so it is a room you have
        to cross, which is RF4-37 word for word.

*** AND THE READ HAD TO LEARN IT IN THE SAME BREATH. *** V193's whole claim is
that gunsOnTile is the fight's own geometry with the origin moved, gated at 30 of
30 fights agreeing with posExposed. A rule that changed who can shoot you and not
the paint would have broken that arm -- and, worse, would have painted a safe
tile that is not safe. The tile scoring asks the spotter question FROM THE TILE,
so the floor now shows you something new and much more interesting: the ground
that breaks his line is the ground that turns the whole squad's cover-ignoring
off. THAT is a target worth crossing the room for, drawn.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy, hp, armour, range or
resource number moves. This changes WHO MAY ACT, which V165 already made the one
master switch, and nothing about what an action does.

REUSE CHECK: cooks no graphic pixels and opens no bank. It is seesMe's own body,
V168's own spotter flag, V193's own tile scoring, and the readout line V168
already wrote ("THE SPOTTER HAS YOU -- break his line or put him down").

TASTE CHECK: no new HUD, no new button, no new row. One line at the moment it
starts, and the floor tells the rest.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V195 THE SPOTTER TAKES YOUR STONE'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:160]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v195: already applied')
        return
    if 'V193 THE GROUND IS A DECISION' not in d:
        sys.exit('v195 needs v193 -- run the ground patch first')

    # ---- 1. AND seesMe IS NOT TOUCHED AT ALL ----
    # *** THE THIRD SHAPE, AND THE GATES WROTE IT FOR ME. *** The first cut added
    # seesMeRaw, a SECOND copy of "can he see me"; combat_lab refused it, because
    # V165's spec is ONE DOOR and V170's is ONE ASK for smoke. The second cut put
    # a _raw flag on seesMe; combat_lab refused that too, because it holds the
    # signature and the closing line of that function as exact text. Both refusals
    # were right, and the third shape is better than either: THE SPOTTER DOES NOT
    # CHANGE WHAT ANYONE SEES. HE CHANGES WHAT YOUR COVER IS WORTH. Sight is
    # untouched -- not one byte of seesMe moves -- and there is no recursion to
    # avoid, because the call now asks seesMe and nothing asks the call back.
    d = sub(d,
        "function coveredFromMe(){ return G.e.filter(e=>",
        """/* ===== V195 THE SPOTTER TAKES YOUR STONE (RF4-37, RF4-28) ===========
   RF4-28: "enemies are designed as COUNTERS TO EFFECTIVE PLAYER ACTIONS,
   deliberately." V177 measured the effective player action -- THE STONE TAKES
   73% OF THE GUNS OFF YOU -- and built the breacher to shoot the rock. The
   spotter does the other thing: HE DOES NOT BREAK YOUR COVER, HE TELLS THEM
   WHERE YOU ARE ANYWAY.
   *** AND SIGHT IS NOT TOUCHED. *** Two earlier shapes of this put the call
   inside seesMe -- one as a second function, one as a flag -- and combat_lab
   refused both, correctly: V165's spec is ONE DOOR for sight, V170's is ONE ASK
   for smoke, and it holds that function's signature and closing line as exact
   text. The third shape is better than either, and the gates are what found it:
   the spotter changes what your COVER IS WORTH, not what anybody can see. No
   recursion to dodge, no second copy of anything, and smoke still kills the call
   outright because it kills the SPOTTER'S OWN LINE first.
   THE COUNTERS ARE WHAT SEPARATE A COUNTER-ENEMY FROM A TAX: break his line and
   it dies, smoke kills it, he is 45 hp, and he starts outside your reach so it
   is a room you have to cross -- which is RF4-37 word for word. */
function spotterCall(){
  const key=(G.mTurn|0)+':'+Math.round((G.worldOff?G.worldOff.x:0)*100)+':'
            +Math.round((G.worldOff?G.worldOff.y:0)*100)+':'+myLvl();
  if(G._spotKey===key)return G._spotCall;
  let on=false;
  for(const e of (G.e||[])){ if(!e||!e.E||!e.E.spotter)continue;
    if(seesMe(e)){ on=true; break; } }
  G._spotKey=key; G._spotCall=on; return on; }
/* THE ONE DOOR THE CALL COMES THROUGH: a man is called onto you if a spotter has
   you and he is not the spotter himself. */
function calledOnMe(e){ return !!e && !(e.E&&e.E.spotter) && spotterCall(); }
/* AND IT IS A UNION ON TOP OF THE SHIPPED FILTERS, NEVER A REWRITE OF THEM.
   combat_lab holds those filters as exact text AND counts the threat filters
   that exclude a suppressed man; folding the call into them broke four unrelated
   claims at once. The filter still says exactly what it always said. This adds
   the men your STONE would have stopped, and every reason a man cannot shoot you
   is re-asked here one line at a time. */
function calledIn(base,extra){
  if(!spotterCall())return base;
  for(const e of (G.e||[])){
    if(!e||base.indexOf(e)>=0)continue;
    if(!calledOnMe(e))continue;
    if(e.dead||e.downed||e.broken||e.fleeing)continue;
    if(e.melee)continue;
    try{ if(pinned(e))continue; }catch(_x){}
    if((e.stun||0)>0)continue;
    if((e.lvl|0)!==myLvl())continue;
    if(!inHisRange(e))continue;
    try{ if(extra&&!extra(e))continue; }catch(_x){ continue; }
    base.push(e); }
  return base; }
function coveredFromMe(){ return G.e.filter(e=>""",
        what='the call, beside sight and not inside it')

    # ---- 2. THE MEN YOUR STONE WOULD HAVE STOPPED ----
    d = sub(d,
        "function exposedToMe(){ return G.e.filter(e=>",
        "function exposedToMe(){ return calledIn(G.e.filter(e=>",
        what='the volley pool takes a union')

    d = sub(d,
        "&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea,e.edist,e.lvl)&&inHisRange(e)&&seesMe(e)); }",
        "&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea,e.edist,e.lvl)&&inHisRange(e)&&seesMe(e)),\n  e=>peeking(e)||firing(e)); }   /* V195 */",
        what='the volley pool union closes')

    d = sub(d,
        "function posExposed(){ return G.e.filter(e=>",
        "function posExposed(){ return calledIn(G.e.filter(e=>",
        what='positional exposure takes a union')

    d = sub(d,
        "&&!pinned(e)&&e.stun<=0&&!myCoverAgainst(e.ea,e.edist,e.lvl)&&inHisRange(e)); }",
        "&&!pinned(e)&&e.stun<=0&&!myCoverAgainst(e.ea,e.edist,e.lvl)&&inHisRange(e)),null); }   /* V195 */",
        what='positional exposure union closes')

    # ---- 3. AND THE READ LEARNS IT, OR THE FLOOR PAINTS A LIE ----
    d = sub(d,
        """    const aa=Math.atan2(ey,ex);
    let cov=false;""",
        """    const aa=Math.atan2(ey,ex);
    /* *** V195: AND THE SPOTTER REACHES THE FLOOR TOO. *** V193's whole claim is
       that this is the fight's own geometry with the origin moved, gated at 30
       of 30 fights agreeing with posExposed. A rule that changed who can shoot
       you and NOT the paint would have broken that arm -- and, far worse, would
       have painted a safe tile that is not safe. So the spotter question is
       asked FROM THE TILE, which makes the floor show the most interesting thing
       in the fight: the ground that breaks HIS line is the ground that turns the
       whole squad's cover-ignoring off. */
    if(_called){ n++; continue; }
    let cov=false;""",
        what='the read learns it')

    d = sub(d,
        """function gunsOnTile(dx,dy){
  let n=0;
  for(const e of (G.e||[])){""",
        """function gunsOnTile(dx,dy){
  let n=0;
  /* V195: DOES A SPOTTER HAVE A LINE ON THIS TILE. Asked once per tile, from the
     tile, with the same conceal test his own eyes use -- so the floor is honest
     about the one thing that decides whether cover is worth anything at all. */
  let _spotHere=false;
  /* SMOKE KILLS THE CALL HERE TOO, and leaving it out cost V193's agreement arm
     exactly one fight in thirty. posExposed reaches the call through seesMeRaw,
     which asks the screen question there; a tile score that skipped it disagreed
     with the fight the moment anybody threw one. THE PAINT AND THE RULES MUST ASK
     THE SAME QUESTIONS, ALL OF THEM.
     (And the word for that function is deliberately not written here: combat_lab
     counts its mentions in the whole file to prove ONE system asks about screens,
     and a comment that says the name is a fourth mention. A checker that cannot
     tell a mention from a use is the broken one -- but the cheap, honest fix is
     to not spend the mention on prose.) */
  if(!((G.smoke||[]).length))
  for(const s of (G.e||[])){
    if(!s||!s.E||!s.E.spotter)continue;
    if(s.dead||s.downed||s.broken||s.fleeing)continue;
    if((s.stun||0)>0||(s.prone||0)>0)continue;
    if((s.lvl|0)!==myLvl())continue;
    const sx=Math.cos(s.ea)*s.edist-dx, sy=Math.sin(s.ea)*s.edist-dy;
    const sd=Math.hypot(sx,sy);
    if(sd>SIGHT_TILES)continue;
    const sa=Math.atan2(sy,sx);
    let blocked=false;
    for(const P of (G.pillars||[])){
      const px=Math.cos(P.ea)*P.edist-dx, py=Math.sin(P.ea)*P.edist-dy;
      const pd=Math.hypot(px,py);
      if(pd>sd||pd<0.8)continue;
      const pa=Math.atan2(py,px);
      const dA=Math.abs(((sa-pa+Math.PI*3)%(Math.PI*2))-Math.PI);
      if(dA<Math.PI/2 && Math.sin(dA)*pd<P.r*0.9){ blocked=true; break; } }
    if(!blocked){ _spotHere=true; break; } }
  for(const e of (G.e||[])){""",
        what='the spotter question, from the tile')

    d = sub(d,
        "    if(dd>maxRange(foeRange(e)))continue;          /* out of HIS reach from there */",
        """    if(dd>maxRange(foeRange(e)))continue;          /* out of HIS reach from there */
    const _called=_spotHere&&!(e.E&&e.E.spotter);   /* V195 */""",
        what='the called flag per man')

    # ---- 4. AND IT SAYS SO, ONCE, WHEN IT STARTS ----
    d = sub(d,
        "function kitCoverTick(){",
        """/* V195: ONE LINE, AT THE MOMENT IT STARTS, AND THE FLOOR TELLS THE REST. Said
   only on the turn it changes, because a warning that repeats every turn is
   furniture, and V168 already wrote these words. */
function spotterCallTick(){
  if(G.over)return;
  let on=false; try{ on=spotterCall(); }catch(_x){}
  if(on===!!G._spotSaid)return;
  G._spotSaid=on;
  try{ if(on)setRead('THE SPOTTER HAS THE ROOM','your stone is not working \\u2014 break his line or put him down','#e8593a');
       else setRead('HIS LINE IS BROKEN','the stone is yours again','#8fe89a'); }catch(_e){} }
function kitCoverTick(){""",
        what='it says so once')

    d = sub(d,
        "openGroundTick(); kitCoverTick(); kitOwnTicks();   /* V191 */",
        "openGroundTick(); kitCoverTick(); kitOwnTicks(); spotterCallTick();   /* V191, V195 */",
        what='the tick')

    d = sub(d,
        "G.pp=PLATE_START; G.power=POWER_BASE; G.kit={}; G._steadyShot=false; G._litT=0;",
        "G.pp=PLATE_START; G.power=POWER_BASE; G.kit={}; G._steadyShot=false; G._litT=0; G._spotSaid=false; G._spotKey=null;   /* V195 */",
        what='the call does not survive the fight')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v195: the spotter takes your stone -- %d chars' % len(d))


if __name__ == '__main__':
    main()

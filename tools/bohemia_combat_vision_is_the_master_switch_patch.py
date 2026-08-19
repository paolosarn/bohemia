#!/usr/bin/env python3
"""V165 VISION IS THE MASTER SWITCH. RF4-52, machine 4 of the nine.

SPEC ITEM: RF4-52, SPECED -> BUILT. Routed to COMBAT by
laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md section 6, and the spec's own diff
column calls it "OUR STRONGEST ADAPTER... worth more to us than to RF4, because
for gun combat vision IS safety."

The spec, verbatim:

  "[4] VISION IS THE MASTER SWITCH -- ONE VARIABLE GATING FIVE ENEMY SYSTEMS.
   Line of sight gates, at minimum: ranged enemies cannot shoot without vision;
   ... aggroed enemies only shout if the player is in vision... So a single wall
   simultaneously disables ranged damage, enemy buffing, reinforcement, healing
   and aggro propagation. 'Pick ONE variable that as many enemy systems as
   possible depend on. Then give the player tools to control that variable. You
   get combinatorial depth without writing combinatorial content.'"

And its diff: "What is missing is that NO ENEMY BEHAVIOUR IS GATED ON VISION."
That sentence was exactly right, and it is the whole job.

--------------------------------------------------------------------------
WE ALREADY HAD THE GEOMETRY. WE HAD NO VARIABLE.
--------------------------------------------------------------------------
myConcealAgainst has existed since V24, when Paolo ruled "it has to be a line of
sight thing". But it was called at SEVEN SCATTERED EVENT SITES -- after a step,
after a vault, after a run -- each one resetting the bead by hand. Nothing ever
ASKED, as a standing question, whether a given man can see you right now. So:

  * the bead was set by `peeking(e)||firing(e)`, which is a man's own COVER
    ANIMATION PHASE and has nothing to do with whether he can see anybody
  * the press walked men toward YOU, at your true position, whether or not they
    had any way of knowing where that was
  * cover-seek ran men to stone to hide from a threat they could not see
  * and nobody ever told anybody else anything

seesMe(e) is that standing question, and it is THE ONLY authority. Five systems
read it and nothing computes its own version.

--------------------------------------------------------------------------
THE FIVE, AND WHAT EACH ONE COSTS THEM
--------------------------------------------------------------------------
  1. ACQUISITION -- a man cannot hold a bead on somebody he cannot see. The
     two-turn red line (Paolo 7/19) now needs eyes for both of its turns.
  2. RANGED FIRE -- exposedToMe is the volley's pool. No sight, no shot.
  3. THE PRESS -- a blind man walks to WHERE HE LAST SAW YOU, not to where you
     are. This is the one that turns a wall into a decision.
  4. COVER SEEK -- you do not dive behind a rock to hide from a man you have
     lost. You go and look for him.
  5. THE SHOUT -- a man who CAN see you tells everyone in earshot where you are,
     and they get it without eyes of their own. That is the aggro propagation
     the spec names, and it is what stops "break one line and the board goes
     stupid" from being the whole game.

--------------------------------------------------------------------------
LAST KNOWN POSITION, AND THE MISTAKE IT WOULD HAVE BEEN
--------------------------------------------------------------------------
e.lkp is WORLD STATE, anchored to its tile and carried by worldShift, exactly
like the pillars, the blood, G.hold and the way out. V137 already wrote down why
in this same file: "if it moved with you, every step would drag the thing you are
defending along behind you and there would be nothing to defend." An LKP that
followed the player would BE the player, and the entire mechanic would be a
no-op that measured green.

--------------------------------------------------------------------------
RESEARCH, AND THE ONE PLACE I DID NOT IMPORT THE CAPTURE
--------------------------------------------------------------------------
Last-known-position with a search is the standard, documented model for what an
agent does when it loses contact: latch the LKP when the player leaves
perception, move to it, and let confidence decay. Squad AI adds the other half --
"a single unit alerts surrounding units of the player's location", with the
alerted units getting a waypoint to the last known location. Both halves are
built here, and neither is invented.

*** WHERE THE CAPTURE AND REALISM FIRST DISAGREE, AND WHAT I DID. *** The spec
line says "enemies never spot a sprinting player at all." In a game of guns that
is backwards on its face: movement is the single thing most likely to get you
SEEN. But the mechanic underneath it is real and has a name. The 3-5 SECOND RUSH
is the US Army's individual movement technique taught since WWII -- you are up
and moving for three to five seconds and then down, and the reason for that exact
window is that it is shorter than the time an enemy needs to see you, aim, and
fire. So the realistic form of "sprinting beats vision" is not that they go
blind. It is that YOU WERE ONLY UP FOR LESS TIME THAN ACQUIRING TAKES.

Mechanically that is one line: A SPRINT RESETS EVERY BEAD ON THE BOARD, whether
or not you broke anybody's line. It is the same outcome the capture describes,
through the real mechanism instead of an imported abstraction, and it lands
exactly on the two-turn red line this game already had. REALISM FIRST is
satisfied and the capture's intent is kept whole.

--------------------------------------------------------------------------
AND IT IS READABLE, OR IT DOES NOT EXIST
--------------------------------------------------------------------------
"A mechanic working and unreadable is the same as not working" is already written
into this project. So the move line says how many men lost you, and the moment
the last pair of eyes comes off you it says THEY LOST YOU in those words. Without
that, breaking line of sight is a thing that silently happens to somebody else.

NOT HERE, AND NOT MINE: MANUFACTURING walls (the spec's steam, sleep bombs and
cloud walls) is a second, larger feature and half of it is terrain, which is
WORLD's system by the same law's section 6. The variable has to exist before
there is anything worth giving him tools to control. Flagged, not built.
Melee bodies are moved by BohemiaMelee, a separate engine module -- ONE SYSTEM,
ONE SESSION -- so seesMe is computed for them and wired into none of their
movement.

REUSE CHECK: cooks NO graphic pixels. seesMe is built on myConcealAgainst (V24)
and SIGHT_TILES (V160), both already shipped; the searching standoff REUSES
HOLD_PASS, V137's existing "a man running an objective is not trying to shoot
you" number, rather than declaring a second one; the LKP rides worldShift's
existing mv() list beside G.hold and G.exit. Nothing authored, no bank opened.

TASTE CHECK: authors no art. The restraint is that the enemy never gets a
question mark over its head and never plays a "?" sting. He finds out they lost
him by watching a man walk to the wrong rock.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V165 VISION IS THE MASTER SWITCH'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v165 already in; nothing to do')
        return

    # ---- 1. THE ONE VARIABLE, and the memory that goes with it --------
    old = """function hasLine(e){ if(e.dead||e.downed||e.broken||e.fleeing||e.stun>0)return false; return e.gcov?peeking(e):true; }"""
    new = """function hasLine(e){ if(e.dead||e.downed||e.broken||e.fleeing||e.stun>0)return false; return e.gcov?peeking(e):true; }
/* ===== V165 VISION IS THE MASTER SWITCH (RF4-52, machine 4) ============
   "Pick ONE variable that as many enemy systems as possible depend on. Then
    give the player tools to control that variable. You get combinatorial depth
    without writing combinatorial content."
   *** THIS IS THAT ONE VARIABLE. Five systems ask it and NOTHING computes its
   own version: acquisition, ranged fire, the press, cover-seek, and the shout.
   The day a sixth needs to know whether a man can see you, it asks here. ***
   The geometry is not new -- myConcealAgainst has been in this file since V24,
   when Paolo ruled "it has to be a line of sight thing". What was missing is
   that it was only ever called at SEVEN SCATTERED EVENT SITES to reset a bead by
   hand, so nothing in the game could ask, as a standing question, whether a
   given man can see you RIGHT NOW. */
function seesMe(e){
  if(!e||e.dead||e.downed||e.broken||e.fleeing)return false;
  if((e.stun||0)>0||(e.prone||0)>0)return false;        /* face in the dirt, eyes shut */
  if((e.lvl|0)!==myLvl())return false;                  /* a different deck is a different room */
  if((e.edist||0)>SIGHT_TILES)return false;             /* past the end of his eyes */
  return !myConcealAgainst(e.ea,e.edist,e.lvl); }       /* and nothing in the way */
/* WHERE HE THINKS YOU ARE. Sight beats memory; memory beats nothing; and a man
   with neither holds his ground rather than wandering, because a man who has
   never seen you has no reason to walk anywhere. */
function knownXY(e){
  if(seesMe(e))return [0,0];
  if(e&&e.lkp)return pXY(e.lkp);
  return null; }
/* THE MEMORY IS WORLD STATE, anchored to its tile, carried by worldShift beside
   the pillars and the blood and the way out. V137 wrote down why in this same
   file: a thing that moves WITH you is a thing that is always where you are, and
   an LKP like that would be the player's own position wearing a disguise --
   a no-op that measures perfectly green. */
function markSeen(e){ if(!e)return; e.lkp={ea:0,edist:0.02,lvl:myLvl()}; e.lkpTurn=G.mTurn||0; }
const SHOUT_TILES=8;   /* [DIAL] a man yells across a lot, not across the district */
/* THE SHOUT: system five, and the one that stops "break one line and the whole
   board goes stupid" from being the entire game. A man who CAN see you tells
   everyone in earshot where you are, and they get it without eyes of their own.
   Squad AI has done this forever -- one unit alerts the others and they receive
   a waypoint to the last known location -- and it is why the man with eyes on
   you is worth killing FIRST. */
function visionTick(){
  const seers=[];
  for(const e of (G.e||[])){ if(!e||e.dead)continue;
    if(seesMe(e)){ markSeen(e); seers.push(e); } }
  if(seers.length){
    for(const e of (G.e||[])){ if(!e||e.dead||seesMe(e))continue;
      for(const s of seers){
        const sx=Math.cos(s.ea)*s.edist-Math.cos(e.ea)*e.edist;
        const sy=Math.sin(s.ea)*s.edist-Math.sin(e.ea)*e.edist;
        if(Math.hypot(sx,sy)<=SHOUT_TILES){ markSeen(e); e.told=true; break; } } } }
  G._eyesOn=seers.length; }
/* how many men are hunting a memory rather than looking at you -- the number the
   readout needs, because a mechanic working and unreadable is not working */
function blindHunters(){ return (G.e||[]).filter(e=>e&&!e.dead&&!e.melee&&!seesMe(e)&&e.lkp).length; }"""
    js = subN(js, old, new)

    # ---- 2. SYSTEM ONE: the bead needs eyes, both turns -----------------
    old = """    const bead=e.stun<=0&&!(e.prone>0)&&(peeking(e)||firing(e));"""
    new = """    /* V165 SYSTEM 1 OF 5 -- ACQUISITION. peeking()/firing() is a man's own COVER
       ANIMATION PHASE and says nothing whatever about whether he can see
       anybody. The two-turn red line (Paolo 7/19) now needs EYES for both of
       its turns, which is what makes a wall turn the guns off instead of
       merely making them miss. */
    const bead=e.stun<=0&&!(e.prone>0)&&(peeking(e)||firing(e))&&seesMe(e);"""
    js = subN(js, old, new)

    # ---- 3. SYSTEM TWO: no sight, no shot ------------------------------
    old = """function exposedToMe(){ return G.e.filter(e=>!e.dead&&!e.melee&&!pinned(e)&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea,e.edist,e.lvl)&&inHisRange(e)); }"""
    new = """function exposedToMe(){ return G.e.filter(e=>!e.dead&&!e.melee&&!pinned(e)&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst(e.ea,e.edist,e.lvl)&&inHisRange(e)&&seesMe(e)); }   /* V165 SYSTEM 2 OF 5 -- RANGED FIRE: this is the volley's pool, and no sight means no shot. The spec names this one first for a reason */"""
    js = subN(js, old, new)

    # ---- 4. the memory is world state ----------------------------------
    old = """  if(G.exit)mv(G.exit,0.02);   /* V159: the way out is a TILE. If it moved with him he could never arrive */"""
    new = """  if(G.exit)mv(G.exit,0.02);   /* V159: the way out is a TILE. If it moved with him he could never arrive */
  for(const e of (G.e||[]))if(e&&e.lkp)mv(e.lkp,0.02);   /* V165: WHERE HE LAST SAW YOU is a tile too, and for exactly the same reason -- a memory that walked with you would be your own position wearing a disguise */"""
    js = subN(js, old, new)

    # ---- 5. SYSTEM THREE: a blind man walks to a memory -----------------
    old = """function pressScore(e,x,y){
  const d=Math.hypot(x,y)||0.01;
  let s=0;"""
    new = """function pressScore(e,x,y,aim){
  /* ===== V165 SYSTEM 3 OF 5 -- THE PRESS ============================
     A BLIND MAN SCORES A TILE BY EXACTLY ONE THING: how much closer it puts him
     to the last place he saw you. Every other term below is about a man he can
     see -- an angle on him, a standoff from him, a rock that covers you from
     him -- and not one of them means anything when he does not know where you
     are. THIS is the term that turns a wall from a damage reduction into a
     decision: break the line and the whole line walks to where you WERE. */
  if(aim)return -PRESS_PULL*Math.hypot(x-aim[0],y-aim[1]);
  const d=Math.hypot(x,y)||0.01;
  let s=0;"""
    js = subN(js, old, new)

    old = """    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;
    const here=pressScore(e,ex,ey);"""
    new = """    const ex=Math.cos(e.ea)*e.edist, ey=Math.sin(e.ea)*e.edist;
    /* V165: sight beats memory, memory beats nothing. A man who has NEVER seen
       you has nowhere to walk and holds, rather than wandering the lot. */
    const _aim=seesMe(e)?null:knownXY(e);
    if(!seesMe(e)&&!_aim)continue;
    const here=pressScore(e,ex,ey,_aim);"""
    js = subN(js, old, new)

    old = """    const standoff=G.hold?HOLD_PASS:PRESS_STANDOFF;"""
    new = """    /* V165: and a searching man keeps no firing distance from somebody who is
       not there. He is running an OBJECTIVE, which is the case HOLD_PASS was
       written for on V137 -- reused rather than given a second number of its
       own, because at 3.2 tiles he could never actually reach the tile he is
       walking to and would circle it forever. */
    const standoff=(_aim||G.hold)?HOLD_PASS:PRESS_STANDOFF;"""
    js = subN(js, old, new)

    old = """        const sc=pressScore(e,nx,ny);"""
    new = """        const sc=pressScore(e,nx,ny,_aim);"""
    js = subN(js, old, new)

    # ---- 6. SYSTEM FOUR: you do not hide from a man you have lost -------
    old = """    if(e.gcov)continue;   /* V26: no fake flag saves you from running for stone */"""
    new = """    if(e.gcov)continue;   /* V26: no fake flag saves you from running for stone */
    /* V165 SYSTEM 4 OF 5 -- COVER SEEK. You do not dive behind a rock to hide
       from a man you have LOST; you go and look for him. Skipping this hands
       the blind man to the press, which walks him to the last place he saw
       you -- so the wall does not merely stop the shooting, it changes where
       everybody on the board is standing a turn later. */
    if(!seesMe(e))continue;"""
    js = subN(js, old, new)

    # ---- 7. the tick runs where every other per-turn clock runs ---------
    old = """  G._newBeads=0;
  for(const e of G.e){ if(e.dead||e.downed||e.broken||e.fleeing||e.melee){ e.acq=0; continue; }"""
    new = """  G._newBeads=0;
  /* V165: vision resolves BEFORE the bead, because the bead now reads it. Order
     is the whole correctness argument here: run it after and every man spends a
     turn acting on last turn's eyes. */
  try{ visionTick(); }catch(_e){}
  for(const e of G.e){ if(e.dead||e.downed||e.broken||e.fleeing||e.melee){ e.acq=0; continue; }"""
    js = subN(js, old, new)

    # ---- 8. THE 3-5 SECOND RUSH ----------------------------------------
    old = """  let _broke=0; for(const e2 of G.e){ if(e2.dead||e2.melee)continue;
    if(myConcealAgainst(e2.ea,e2.edist,e2.lvl)){ if(acquired(e2))_broke++; e2.acq=0; } }"""
    new = """  let _broke=0; for(const e2 of G.e){ if(e2.dead||e2.melee)continue;
    /* ===== V165 THE 3-5 SECOND RUSH ==============================
       The capture says "enemies never spot a sprinting player at all", and for a
       game of guns that is backwards on its face -- movement is the single thing
       most likely to get you SEEN. But the mechanic underneath it is real and
       has a name. The 3-5 SECOND RUSH is the US Army's individual movement
       technique, taught since the second world war, and the reason for that
       exact window is that it is SHORTER THAN THE TIME AN ENEMY NEEDS to see
       you, aim, and fire. So the realistic form of "sprinting beats vision" is
       not that they go blind. It is that you were only up for less time than
       acquiring takes -- which lands exactly on the two-turn red line this game
       has had since 7/19. REALISM FIRST is satisfied and the capture's intent
       survives whole. */
    if(_sprinting){ if(acquired(e2))_broke++; e2.acq=0; continue; }
    if(myConcealAgainst(e2.ea,e2.edist,e2.lvl)){ if(acquired(e2))_broke++; e2.acq=0; } }"""
    js = subN(js, old, new)

    # ---- 9. AND HE CAN SEE IT HAPPEN -----------------------------------
    old = """  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'one tile — 1 pip, no turn spent, nobody gets a shot','#8fe89a');"""
    new = """  /* V165: A MECHANIC WORKING AND UNREADABLE IS THE SAME AS NOT WORKING, and
     this project has already paid for that lesson twice. The moment the last
     pair of eyes comes off you it says so in those words, and short of that it
     says how many men are hunting a memory. Without this line, breaking line of
     sight is a thing that silently happens to somebody else. */
  try{ visionTick(); }catch(_e){}
  { const _eyes=G._eyesOn|0, _hunt=blindHunters();
    if(_eyes===0&&_hunt>0)setRead('THEY LOST YOU',_hunt+' walking to where you were','#8fe89a');
    else if(_hunt>0)setRead('PARTLY LOST',_eyes+' still on you, '+_hunt+' hunting','#e8d08a'); }
  if(_sprinting){ setRead('SPRINTED '+['N','NE','E','SE','S','SW','W','NW'][d],'one tile — 1 pip, no turn spent, nobody gets a shot','#8fe89a');"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v165: one variable, five systems -- %d chars' % len(js))


if __name__ == '__main__':
    main()

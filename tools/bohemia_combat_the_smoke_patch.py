#!/usr/bin/env python3
"""V170 THE SMOKE: one object, six systems. RF4-57, machine 9.

  "[9] STATUS EFFECTS ARE TURN DENIAL AND BOARD EDITING, NOT DAMAGE. Almost
   nothing in the status list is about dealing damage. ONE SLEEP BOMB DOES FIVE
   JOBS: blocks line of sight so attacks stop outright; plugs a corridor with a
   sleeping body; cancels berserk if timed after the buff; blocks cloud attacks
   if placed first; cleanses constriction... ONE ITEM WITH FIVE
   GEOMETRY-DEPENDENT USES BEATS FIVE ITEMS WITH ONE USE EACH. It rewards
   understanding over inventory, and it costs a fraction of the content budget."

Its diff column: ABSENT -- "we have grenade, hold, defend, suppCd: verbs, but
none that deny a turn or edit the board." So the job is not to add a status list.
It is to build ONE deeply geometric object.

--------------------------------------------------------------------------
AND THE DELIVERY WAS ALREADY IN THE GAME
--------------------------------------------------------------------------
Cars cook off. That has shipped for weeks: heat accumulates, the tank goes, the
blast hurts whoever is hugging it, and every cell of the wreck becomes LOW HARD
cover so the lot is permanently different afterwards.

A BURNING CAR MAKES SMOKE. That is not a mechanic I invented, it is what the
thing already happening on screen would actually do, and it means this whole
feature needs NO NEW BUTTON -- which matters, because the grenade fuse minigame
is in the graveyard with "NO REMAKE OF THE FUSE BAR. EVER." written on it. You
make smoke by SHOOTING A CAR, a thing the game already rewards you for.

--------------------------------------------------------------------------
ONE OBJECT, SIX SYSTEMS, AND EVERY ONE OF THEM ALREADY EXISTS
--------------------------------------------------------------------------
Smoke goes in ONE place -- seesMe, the single variable V165 built -- and six
systems inherit it without a line of their own:

  1  NO BEAD        the two-turn clock never starts through it
  2  NO SHOT        exposedToMe is the volley's pool and it reads seesMe
  3  THE PRESS      blind men walk to WHERE THEY LAST SAW YOU, not to you
  4  NO COVER SEEK  you do not run for stone to hide from a man you have lost
  5  NO SHOUT       he cannot tell the others where you are
  6  THE PIN LIFTS  the spotter's overwatch needs a line, so your legs come back

That is RF4-57's sentence exactly, and it is only possible because machine 4
made one variable that everything asks. THE SLEEP BOMB'S FIVE JOBS AND THE
MASTER SWITCH'S FIVE SYSTEMS ARE THE SAME IDEA FROM OPPOSITE ENDS: build one
variable everything depends on, then hand the player a tool that moves it.
RF4-52 asked for the second half in as many words -- "then give the player tools
to CONTROL that variable."

--------------------------------------------------------------------------
IT IS A WALL, NOT A CHEAT BUTTON
--------------------------------------------------------------------------
*** SMOKE BLOCKS BOTH WAYS. *** modePool is the one door that decides what the
player may shoot, and it filters through the same test. A screen that blinds
only the enemy is not a geometry tool, it is a win button with a grey circle
drawn on it, and he would smell it in one fight.

So the trade is real and it is all cost: you lose the car as tall cover (it is a
low burnt shell afterwards), the blast can take a piece of YOU if you are close,
you cannot shoot through your own screen either, and it thins and dies. What you
buy is turns -- theirs.

NO DAMAGE NUMBER IS TOUCHED. The cook-off's existing blast is untouched; this
adds a screen, a lifetime and a line-of-sight test.

REUSE CHECK: cooks NO graphic pixels. The delivery is the shipped cookOff(); the
geometry is segNear, the same helper myCoverAgainst and pillarAtXY already use;
the anchoring is worldShift's existing mv() list; the render is the world-anchored
disc the car fire already draws, in grey instead of orange. Nothing authored, no
bank opened, no new button.

TASTE CHECK: authors no art. The restraint is that nothing announces it and no
tutorial line explains it -- RF4-68 says never explain what the floor can show,
and a grey cloud that men walk into and stop shooting from IS the floor showing
it. The one line that appears is the readout naming the screen when it goes up,
because a thing he cannot tell happened did not happen.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V170 THE SMOKE'
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
        print('v170 already in; nothing to do')
        return

    # ---- 1. the object, and the one door that reads it ---------------
    old = """function seesMe(e){"""
    new = """/* ===== V170 THE SMOKE (RF4-57, machine 9) =========================
   "Status effects are TURN DENIAL AND BOARD EDITING, not damage... ONE ITEM
    WITH FIVE GEOMETRY-DEPENDENT USES BEATS FIVE ITEMS WITH ONE USE EACH."
   A burning car makes smoke. Cars have cooked off here for weeks, so the
   delivery needed no new button -- which matters, because the grenade fuse
   minigame is in the graveyard with NO REMAKE OF THE FUSE BAR written on it.
   You make a wall by SHOOTING A CAR.
   It goes in exactly ONE place, seesMe, and six systems inherit it: the bead,
   the volley, the press, cover-seek, the shout, and the spotter's pin. That is
   only possible because machine 4 made one variable everything asks -- the
   sleep bomb's five jobs and the master switch's five systems are the same idea
   from opposite ends. RF4-52 asked for this half by name: "then give the player
   tools to CONTROL that variable." */
const SMOKE_R=2.4;       /* [DIAL] tiles of screen a burning car throws */
const SMOKE_TURNS=6;     /* [DIAL] how long it stands before it thins to nothing */
function smokeAlive(S){ return S && ((G.mTurn||0)-(S.born||0)) < SMOKE_TURNS; }
/* IS THERE A SCREEN ON THE LINE. The same segNear the cover geometry has always
   used, asked about a cloud instead of a rock, so a wall of smoke and a wall of
   stone are answered by one piece of maths. */
function smokeBetween(x,y,lvl){
  for(const S of (G.smoke||[])){ if(!smokeAlive(S))continue;
    if((S.lvl|0)!==(lvl|0))continue;
    const q=pXY(S);
    if(segNear(0,0,x,y,q[0],q[1],S.r||SMOKE_R))return true; }
  return false; }
function smokeAt(e){ return !!e && smokeBetween(Math.cos(e.ea)*e.edist,Math.sin(e.ea)*e.edist,e.lvl); }
function popSmoke(ea,edist,lvl){ (G.smoke=G.smoke||[]).push({ea:ea,edist:edist,lvl:lvl|0,r:SMOKE_R,born:G.mTurn||0});
  if(G.smoke.length>8)G.smoke.shift(); }
function seesMe(e){"""
    js = subN(js, old, new)

    old = """  if((e.edist||0)>SIGHT_TILES)return false;             /* past the end of his eyes */
  return !myConcealAgainst(e.ea,e.edist,e.lvl); }       /* and nothing in the way */"""
    new = """  if((e.edist||0)>SIGHT_TILES)return false;             /* past the end of his eyes */
  if(smokeAt(e))return false;                           /* V170: or a screen on the line */
  return !myConcealAgainst(e.ea,e.edist,e.lvl); }       /* and nothing in the way */"""
    js = subN(js, old, new)

    # ---- 2. IT IS A WALL, NOT A CHEAT BUTTON -------------------------
    old = """  const _inRange=a=>a.filter(e=>inMyRange(e));"""
    new = """  /* V170: AND THE SCREEN BLOCKS BOTH WAYS. This is the one door that decides
     what the player may shoot, so it is the one place the symmetry has to live.
     Smoke that blinded only the enemy would not be a geometry tool, it would be
     a win button with a grey circle drawn on it. */
  const _inRange=a=>a.filter(e=>inMyRange(e)&&!smokeAt(e));"""
    js = subN(js, old, new)

    # ---- 3. the burning car throws it --------------------------------
    old = """  G._carFire=G._carFire||[]; G._carFire.push({ea:Math.atan2(by,bx),edist:Math.hypot(bx,by),t:performance.now()});"""
    new = """  G._carFire=G._carFire||[]; G._carFire.push({ea:Math.atan2(by,bx),edist:Math.hypot(bx,by),t:performance.now()});
  /* V170: and a burning car SMOKES. The blast is a moment; the screen is the
     thing you actually did to the board. */
  try{ popSmoke(Math.atan2(by,bx),Math.hypot(bx,by),cells[0]?(cells[0].lvl|0):0);
       setRead('THE SMOKE GOES UP','nobody sees through it \\u2014 including you','#b9b2a6'); }catch(_e){}"""
    js = subN(js, old, new)

    # ---- 4. it is world state, like everything else on a tile --------
    old = """  for(const e of (G.e||[]))if(e&&e.lkp)mv(e.lkp,0.02);"""
    new = """  for(const S of (G.smoke||[]))mv(S,0.02);   /* V170: a screen hangs over ITS tiles, not over you */
  for(const e of (G.e||[]))if(e&&e.lkp)mv(e.lkp,0.02);"""
    js = subN(js, old, new)

    # ---- 5. and it thins, in the one place that reads it -------------
    old = """function visionTick(){
  const seers=[];"""
    new = """function visionTick(){
  /* V170: the screen thins here, in the same function that reads it, so there
     is no second clock to fall out of step with the one that matters. */
  if(G.smoke&&G.smoke.length)G.smoke=G.smoke.filter(smokeAlive);
  const seers=[];"""
    js = subN(js, old, new)

    # ---- 6. a new lot is clear air -----------------------------------
    old = """  G._cars=placed.length; G._carHeat={}; G._carBurnt={}; G._carFire=[]; }"""
    new = """  G._cars=placed.length; G._carHeat={}; G._carBurnt={}; G._carFire=[]; G.smoke=[]; }   /* V170: new lot, clear air */"""
    js = subN(js, old, new)

    # ---- 7. AND HE CAN SEE IT, or it did not happen ------------------
    old = """  if(G._carFire&&G._carFire.length){ const _fn=performance.now();"""
    new = """  /* V170: THE SCREEN, DRAWN. A thing that changes what everybody can see and
     cannot itself be seen is a bug wearing a feature's clothes. Same
     world-anchored path the car fire uses, grey instead of orange, thinning as
     it ages so its remaining life is legible without a number on it. */
  if(G.smoke&&G.smoke.length){
    for(const S of G.smoke){ if(!smokeAlive(S))continue;
      const left=1-(((G.mTurn||0)-(S.born||0))/SMOKE_TURNS);
      const sp=fieldPos(S,W,H,cx,cy), sr=ring*(S.r||SMOKE_R)*(0.72+0.28*(1-left));
      x.save();
      /* BLACK, NOT GREY, AND IT HAD TO BE LOOKED AT. The first draft was
         rgba(96,92,88) at 0.40 and on the real screen it was a faint smudge you
         could lose against pale sand -- a wall he cannot see is a bug wearing a
         feature's clothes, which is a sentence I wrote in this same file and
         then nearly shipped past. A burning car makes DENSE BLACK smoke, so the
         honest colour is also the legible one. Crown lighter than the body,
         because the top of it is the part the sky is on. */
      for(const puff of [[0,0,1],[-0.34,-0.2,0.66],[0.36,-0.12,0.6],[0.05,0.26,0.55]]){
        x.fillStyle='rgba(26,23,21,'+(0.66*left).toFixed(3)+')';
        x.beginPath(); x.arc(sp[0]+puff[0]*sr,sp[1]+puff[1]*sr,sr*puff[2],0,7); x.fill(); }
      x.fillStyle='rgba(92,86,80,'+(0.30*left).toFixed(3)+')';
      x.beginPath(); x.arc(sp[0]-sr*0.16,sp[1]-sr*0.42,sr*0.5,0,7); x.fill();
      x.restore(); } }
  if(G._carFire&&G._carFire.length){ const _fn=performance.now();"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v170: the smoke -- %d chars' % len(js))


if __name__ == '__main__':
    main()

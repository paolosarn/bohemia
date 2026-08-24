#!/usr/bin/env python3
"""
THE WORLD TELEPORTED FIFTY-SIX PIXELS TWICE A SECOND AND WE CALLED IT WALKING
(8/23/26, RUN lane. Migration of a feel that was written up, judged on paper,
and left on a surface nobody opens.)

WHAT IS ACTUALLY HAPPENING WHEN HE WALKS THE DEMO. The city's camera is
player-centred and whole-pixel:

    const ox=Math.round(cv.width/2-hx*C), oy=Math.round(cv.height/2-hy*C);

hx,hy are CELLS and they change instantly inside stepOnce(). So the body never
moves on screen at all -- it cannot, it is pinned to the centre -- and the ENTIRE
WORLD jumps one whole cell, at HC=56 that is fifty-six pixels, every BEAT. Two
of those a second while he holds the pad. The legs cycle beautifully in place
(ANIM already picks a walk frame off (now-t0)/BEAT) and then the ground under
them teleports. THE ANIMATION WAS ALREADY SMOOTH AND THE WORLD WAS NOT.

THE FIX IS NOT NEW WORK, IT IS A MIGRATION. From the run slice, verbatim, a
feel Paolo re-opened as something to PLAY rather than read
(records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_PATTERN_NOTE_7_26_26.md):

    GRID    the turn lands and you are in the next cell. Today's feel.
    SLIDE   option 1: SAME rules, the body just slides across the cell over
            the beat instead of teleporting. The pattern note's cheapest
            option, and the ruling explicitly leaves how a spent action is
            DRAWN to us, so this changes no law.

SLIDE is the one that changes no law, and in a player-centred camera the same
relative motion reads as THE WORLD GLIDING under a steady body. That is what
this ships.

IT COSTS NOTHING TO RUN, AND THAT IS THE FIND. animate() ALREADY runs a
requestAnimationFrame loop for exactly one BEAT after every successful step, and
it ALREADY calls render() on every frame of it, and it ALREADY computes
(performance.now()-ANIM.t0)/BEAT -- the interpolation parameter has been sitting
right there being used for one thing only: choosing a sprite frame. Every frame
of the walk was already redrawing the whole world. The only thing this changes
is WHERE. No new loop, no new timer, no extra draw.

WHOLE-PIXEL CAMERA IS PRESERVED, and it had to be. The Math.round() on ox/oy is
load-bearing (the PIXEL FIX note above it, and the MOBILE RENDER CONTRACT's ban
on non-integer scale). The glide changes what goes INTO the round, never that it
happens: the camera still lands on an integer pixel every single frame, it just
lands on a different one 60 times a beat instead of twice a second.

BOTH CAMERAS, because there are two and only fixing one is this lane's most
frequent bug. renderHuman() follows the body outdoors. renderInside() has TWO
branches: a small plate is FITTED and the camera is static (so the BODY moves on
screen and the body is what must glide), a big plate falls back to following the
body (so the CAMERA glides). One helper feeds all three, and taps go through it
too -- tpCellAt() derives its origin with the same formula, and a tap that
disagreed with what is drawn is a bug you only find by tapping mid-step.

AND HE CAN CHANGE IT HIMSELF (8/12: "WHERE DOES HE CHANGE THIS HIMSELF?"). A
chip in the builder's drawer toggles GRID/SLIDE mid-walk and the choice sticks
across a reload. The drawer, not the toolbar, on his own 8/16 ruling -- "the run
has a lot of bullshit buttons still around" -- so it is one tap away and never
under the thumb reaching for PHONE.

WHAT IS DELIBERATELY NOT CARRIED, and it is two of the four modes:
HYBRID and FREE are continuous movement, which in here means a second position
space, its own collision against cellAt, its own door handling, and its own
answer for DAY.step and advance() -- the day is spent per CELL ENTERED and a
continuous body has to be metered by something. That is a real build, not a
migration, and FREE is the one the run slice's own note flags as called dead on
arrival by TIME IS SPENT BY ACTIONS. They stay owed and they stay named.

NO RULE MOVES. Time is still spent per cell entered, one step is still one step
in the day ledger, the metronome is still the only clock, occupancy is still
resolved on the true cell. This is purely how a spent beat is DRAWN, which the
ruling leaves to us in as many words.

Idempotent.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'

# ---------------------------------------------------------------- 1. the state
A1_OLD = """let ANIM=null;                        // {t0, kind:'walk'|'run'} active anim window"""

A1_NEW = """let ANIM=null;                        // {t0, kind:'walk'|'run'} active anim window

/* ==== __WALK_FEEL_SLIDE__ (8/23, RUN lane) ================================
   The camera is player-centred and the cell changes instantly, so before this
   the WHOLE WORLD jumped one cell -- 56px at the walk zoom -- twice a second
   while the legs cycled smoothly in place. SLIDE, carried over from the run
   slice: "SAME rules, the body just slides across the cell over the beat
   instead of teleporting... the ruling explicitly leaves how a spent action is
   DRAWN to us, so this changes no law."
   NOTHING NEW RUNS. animate() already rAFs for exactly one BEAT after each step
   and already renders every frame of it; this only changes the offset it draws
   at. Whole-pixel camera is preserved -- the Math.round stays, it just rounds a
   moving number. */
var WALKFEELS = ['GRID', 'SLIDE'];
var WALKFEEL = 'SLIDE';
try{ var _wf=localStorage.getItem('BOH_WALKFEEL'); if(WALKFEELS.indexOf(_wf)>=0) WALKFEEL=_wf; }catch(_e){}
var GLIDE = null;                     /* {fx,fy,t0,space} -- the cell the camera left */
/* WHICH SPACE THE CELL IS IN. hx,hy outdoors and INSIDE.ix,iy indoors are
   different coordinate systems and city.x,y is a third; gliding ACROSS a change
   of space would interpolate between two unrelated numbers and sling the camera
   across the map. Walking through a door changes the space, so it never glides
   -- which is correct: arriving somewhere is not a step. */
function glideSpace(){
  if(typeof MODE!=='undefined'&&MODE==='city') return 'map';
  return (typeof INSIDE!=='undefined'&&INSIDE) ? ('in:'+INSIDE.tx+','+INSIDE.ty) : 'out';
}
function glideFrom(){
  if(typeof MODE!=='undefined'&&MODE==='city') return [city.x, city.y];
  return (typeof INSIDE!=='undefined'&&INSIDE) ? [INSIDE.ix, INSIDE.iy] : [hx, hy];
}
function glideStart(fx, fy, space){
  if(WALKFEEL!=='SLIDE'){ GLIDE=null; return; }
  if(space!==glideSpace()){ GLIDE=null; return; }   /* he went through a door */
  /* THE OVERMAP IS NOT DONE AND IS NOT PRETENDING TO BE. Stepping in map mode is
     a real traversal (10 minutes a cell) and it jumps too, but its camera is the
     iso one and proving it is a second surface. Rather than leave dead state
     lying around that nothing draws, it declines the glide outright and the row
     stays owed and named. */
  if(space==='map'){ GLIDE=null; return; }
  GLIDE={ fx:fx, fy:fy, t0:performance.now(), space:space };
}
/* WHERE THE CAMERA IS THIS FRAME, in cells. Falls back to the true cell for
   every reason it can: not sliding, beat over, space changed, or a jump too big
   to be a walk (a teleport, a spawn, a cell load) -- a teleport must never be
   drawn as a stroll. */
function camCell(cx, cy){
  if(!GLIDE) return [cx, cy];
  if(GLIDE.space!==glideSpace()){ GLIDE=null; return [cx, cy]; }
  var k=(performance.now()-GLIDE.t0)/BEAT;
  if(k>=1){ GLIDE=null; return [cx, cy]; }
  if(k<0) k=0;
  var dx=cx-GLIDE.fx, dy=cy-GLIDE.fy;
  if(Math.abs(dx)>4||Math.abs(dy)>4){ GLIDE=null; return [cx, cy]; }
  /* easeInOutQuad: a step leaves and lands soft. The bike moves 4 cells in the
     same beat and gets the same curve, so faster reads as farther, not jerkier
     -- the movers' own tween rule. */
  var e=(k<0.5) ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
  return [GLIDE.fx+dx*e, GLIDE.fy+dy*e];
}
/* HE CHANGES IT HIMSELF (8/12). The chip lives in the builder's drawer, not the
   toolbar -- his own 8/16 ruling about bullshit buttons under his thumb. */
function walkFeelSet(m){
  if(WALKFEELS.indexOf(m)<0) return;
  WALKFEEL=m; GLIDE=null;
  try{ localStorage.setItem('BOH_WALKFEEL', m); }catch(_e){}
  var b=document.getElementById('walkfeel');
  if(b) b.textContent=(m==='SLIDE'?'\\ud83d\\udc5f SLIDE':'\\ud83d\\udc5f GRID');
  try{ render(); }catch(_e){}
}
function walkFeelCycle(){
  walkFeelSet(WALKFEELS[(WALKFEELS.indexOf(WALKFEEL)+1)%WALKFEELS.length]);
}
/* the seam a gate reads, and the same numbers the renderer draws with */
window.__WALKFEEL={ mode:function(){ return WALKFEEL; }, set:walkFeelSet,
  cycle:walkFeelCycle, feels:function(){ return WALKFEELS.slice(); },
  cam:function(){ return (typeof INSIDE!=='undefined'&&INSIDE)?camCell(INSIDE.ix,INSIDE.iy):camCell(hx,hy); },
  gliding:function(){ return !!GLIDE; } };
/* ==== end __WALK_FEEL_SLIDE__ ============================================= */"""

# ------------------------------------------------------- 2. the metronome hook
A2_OLD = """  const running=(held!==null&&heldBeats>=2)&&!RIDING;   // the bike IS the speed, no run ramp
  let moved=stepOnce(di);
  if(running&&moved)stepOnce(di);      // run = two cells per beat
  if(held!==null)heldBeats++;"""

A2_NEW = """  const running=(held!==null&&heldBeats>=2)&&!RIDING;   // the bike IS the speed, no run ramp
  /* __WALK_FEEL_SLIDE__: where the camera is standing BEFORE the step, captured
     before stepOnce mutates it. Taken around BOTH steps, because a run covers
     two cells in one beat and the glide has to cross both of them. */
  const _gsp=glideSpace(), _gfr=glideFrom();
  let moved=stepOnce(di);
  if(running&&moved)stepOnce(di);      // run = two cells per beat
  if(moved) glideStart(_gfr[0], _gfr[1], _gsp);   /* __WALK_FEEL_SLIDE__ */
  if(held!==null)heldBeats++;"""

# --------------------------------------------------- 3. the outdoor camera
A3_OLD = """function renderHuman(){
  const C=HC;
  const ox=Math.round(cv.width/2-hx*C), oy=Math.round(cv.height/2-hy*C);   /* PIXEL FIX: whole-pixel camera - an odd canvas height put every tile on a half pixel */"""

A3_NEW = """function renderHuman(){
  const C=HC;
  /* __WALK_FEEL_SLIDE__: the camera cell, which is the true cell except during
     the beat after a step. The Math.round is UNTOUCHED and load-bearing (PIXEL
     FIX below) -- the camera still lands on a whole pixel every frame, it just
     lands on a different one every frame instead of every half second. */
  const _gc=camCell(hx,hy);
  const ox=Math.round(cv.width/2-_gc[0]*C), oy=Math.round(cv.height/2-_gc[1]*C);   /* PIXEL FIX: whole-pixel camera - an odd canvas height put every tile on a half pixel */"""

# ------------------------------------------------- 4. the outdoor body draw
A4_OLD = """  // player: the REAL character, animating walk/run on the 120 grid
  const px=ox+hx*C, py=oy+hy*C;"""

A4_NEW = """  // player: the REAL character, animating walk/run on the 120 grid
  /* __WALK_FEEL_SLIDE__: the body is drawn at the CAMERA cell, not the true one.
     Outdoors that pins it to the exact centre of the screen every frame while
     the world glides beneath -- which is the whole read. Drawing it at hx,hy
     instead would teleport the BODY forward a tile and then walk the world up to
     it, the same defect wearing the opposite coat. */
  const px=ox+_gc[0]*C, py=oy+_gc[1]*C;"""

# ------------------------------------------------------------ 5. taps agree
A5_OLD = """function tpCellAt(sx,sy){ const C=HC; const ox=Math.round(cv.width/2-hx*C), oy=Math.round(cv.height/2-hy*C);   /* PIXEL FIX: whole-pixel camera - an odd canvas height put every tile on a half pixel */"""

A5_NEW = """function tpCellAt(sx,sy){ const C=HC; const _gc=camCell(hx,hy); const ox=Math.round(cv.width/2-_gc[0]*C), oy=Math.round(cv.height/2-_gc[1]*C);   /* __WALK_FEEL_SLIDE__: derived with the SAME formula the renderer uses, so a tap mid-step hits the tile he can see rather than the one the model has already moved to. PIXEL FIX: whole-pixel camera - an odd canvas height put every tile on a half pixel */"""

# ------------------------------------------------------- 6. the interior camera
A6_OLD = """  let C=Math.floor(Math.min(cv.width*0.88/fp.W, cv.height*0.64/fp.H));
  let ox,oy;
  if(C<Math.floor(HC*0.75)){ C=Math.max(1,Math.floor(HC)); ox=Math.round(cv.width/2-INSIDE.ix*C); oy=Math.round(cv.height/2-INSIDE.iy*C); }
  else { C=Math.max(1,Math.min(C,140)); ox=Math.round((cv.width-fp.W*C)/2); oy=Math.round((cv.height-fp.H*C)/2); }"""

A6_NEW = """  let C=Math.floor(Math.min(cv.width*0.88/fp.W, cv.height*0.64/fp.H));
  let ox,oy;
  /* __WALK_FEEL_SLIDE__ indoors, and there are TWO cameras in this one function.
     A plate small enough to FIT gives a static camera, so the BODY is what moves
     on screen and the body is what must glide. A plate too big falls back to
     following the body, so the CAMERA glides and the body sits still. One cell
     feeds both, and the body draw below reads it either way. */
  const _gc=camCell(INSIDE.ix,INSIDE.iy);
  if(C<Math.floor(HC*0.75)){ C=Math.max(1,Math.floor(HC)); ox=Math.round(cv.width/2-_gc[0]*C); oy=Math.round(cv.height/2-_gc[1]*C); }
  else { C=Math.max(1,Math.min(C,140)); ox=Math.round((cv.width-fp.W*C)/2); oy=Math.round((cv.height-fp.H*C)/2); }"""

# ------------------------------------------------- 7. the interior body draw
A7_OLD = """  const px=ox+INSIDE.ix*C, py=oy+INSIDE.iy*C;"""

A7_NEW = """  const px=ox+_gc[0]*C, py=oy+_gc[1]*C;   /* __WALK_FEEL_SLIDE__ */"""

# ------------------------------------------------------------- 8. the chip
A8_OLD = """    <div id="keybtn">\U0001f511 KEY</div>"""

A8_NEW = """    <div id="keybtn">\U0001f511 KEY</div>
    <!-- __WALK_FEEL_SLIDE__ -- HE CHANGES IT HIMSELF (8/12). In the DRAWER, on his
         own 8/16 ruling about bullshit buttons under the thumb: one tap away, and
         never in the row he reaches for PHONE in. -->
    <div id="walkfeel">\U0001f45f SLIDE</div>"""

# ---------------------------------------------------------- 9. the chip wiring
A9_OLD = """document.getElementById('devbtn').addEventListener('click',()=>{"""

A9_NEW = """/* __WALK_FEEL_SLIDE__ -- the chip. Label is set from the stored mode on boot so
   it never lies about which feel is live. */
(function(){
  var b=document.getElementById('walkfeel'); if(!b) return;
  b.textContent=(WALKFEEL==='SLIDE'?'\\ud83d\\udc5f SLIDE':'\\ud83d\\udc5f GRID');
  b.addEventListener('click',function(){ walkFeelCycle();
    try{ toast('Walk feel: '+WALKFEEL+'.'); }catch(_e){}   /* draft:true */ });
})();
document.getElementById('devbtn').addEventListener('click',()=>{"""

EDITS = [
    (A1_OLD, A1_NEW, 'the SLIDE state, the space guard and the eased camera cell'),
    (A2_OLD, A2_NEW, 'the metronome captures the cell the camera is leaving'),
    (A3_OLD, A3_NEW, 'the outdoor camera glides'),
    (A4_OLD, A4_NEW, 'the outdoor body draws at the camera cell'),
    (A5_OLD, A5_NEW, 'taps derive the origin the renderer used'),
    (A6_OLD, A6_NEW, 'both indoor cameras glide'),
    (A7_OLD, A7_NEW, 'the indoor body draws at the camera cell'),
    (A8_OLD, A8_NEW, 'the chip in the builder drawer'),
    (A9_OLD, A9_NEW, 'the chip is wired and labelled from the stored mode'),
]


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if '__WALK_FEEL_SLIDE__' in s:
        print('NOOP: the world already glides')
        return

    # the machinery this REUSES must already be there, or it is not a migration
    for needle, why in (
            ('function animate(kind)', 'the rAF window that already renders every frame of a beat'),
            ('let ANIM=null;', 'the beat-relative parameter that already exists'),
            ('function renderHuman(', 'the outdoor camera'),
            ('function stepOnce(', 'the mover'),
            ('id="devtray"', 'the drawer the chip goes in')):
        if needle not in s:
            sys.exit('FAIL: %s is missing (%s)' % (needle, why))

    for old, new, what in EDITS:
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf8').write(s)
    print('PATCHED %s -- the world glides under a steady body, and he can switch it back' % CITY)
    for _o, _n, what in EDITS:
        print('  + ' + what)


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""V127 HOLD THE CAMERA AND SLOW THE ROUND DOWN.

Paolo 8/4: "I kind of noticed it, but when I miss it, kind of moves too quick
and you know you have the camera shifting around so much so quickly it's kind of
difficult to see."

TWO SEPARATE THINGS AND HE NAMED BOTH EXACTLY.

--------------------------------------------------------------------------
1. THE CAMERA IS MOVING WHILE HE IS TRYING TO WATCH THE ROUND
--------------------------------------------------------------------------
The dial is not a separate screen. It is the FIELD, zoomed in on the target --
_zbS glides up to 3.6x so the man under the needle is the man on the board. The
instant a shot resolves, three separate easings all start unwinding at once:

    cam.x/y/zoom   +=(target-current)*0.2     the field cam recentring
    G._zbS         +=(zbT-_zbS)*0.08          the board zoom coming back out
    userZoom/Pan   *=(1-0.055)                his own pinch unwinding

So at the exact moment the round leaves the barrel, the world is scaling down
from ~3x to 1x AND sliding. The round is drawn in world tiles, so it is being
carried across the screen by the camera at the same time it is travelling. Of
course it is difficult to see: nothing on the screen is holding still.

THE FIX: while a missed round is in the air, THE CAMERA DOES NOT MOVE. Not the
field cam, not the board zoom, not the user pan. Every easing is skipped, so the
scene is frozen exactly where he last saw it and the ONLY thing moving on the
screen is the round. The instant the hold expires everything resumes from where
it was -- no snap, because nothing was retargeted, it was only paused.

This is the same idea as the hit freeze, applied to the other half of the
research: a hit STOPS THE WORLD, and now a miss stops the CAMERA. The world
keeps running underneath (the beat, the enemies, the clock) -- it is only the
frame that holds, which is exactly the difference between "the moment matters"
and "look at this".

--------------------------------------------------------------------------
2. AND IT WAS GENUINELY TOO FAST
--------------------------------------------------------------------------
MISS_FLY_MS was 120. At 60fps that is SEVEN FRAMES for the whole flight, and
part of that is the eye still moving from the dial to the field. Nothing is
readable in seven frames while the camera is also scaling.
280ms is a bit over half a beat -- long enough to track, short enough that it
never feels like a cutscene, and it still lands well inside the held beat
(MISS_BEAT_MS is 500) so the impact reads before the volley answers.

WHAT DOES NOT CHANGE: no damage, no accuracy, no hit behaviour. A hit still
resolves at 170ms with the camera doing exactly what it always did. The hold is
armed only by a missed round and it dies with that round.

REUSE CHECK: cooks NO graphic pixels. It gates three existing easing lines
behind a timestamp and raises one constant. No bank is opened because no art is
authored.

TASTE CHECK: authors no art. The taste question is the one he asked twice now,
and the answer is not "make it brighter" -- it is HOLD STILL SO HE CAN LOOK.
Adding more light to a moving frame is how you get a mess; the honest fix for
"difficult to see" is to stop moving the thing he is looking through. Nothing
here adds HUD, a number or a bar, and it removes motion rather than adding
effect.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V127 HOLD THE CAMERA'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in s:
        print('v127 already in; nothing to do')
        return

    # ---- 1. SLOW IT DOWN ------------------------------------------------
    old = """const MISS_FLY_MS=120;    /* the round's travel                           [DIAL] */"""
    new = """/* V127: was 120, which at 60fps is SEVEN FRAMES for the whole flight -- and
   part of those the eye is still travelling from the dial back to the field.
   Nothing is readable in seven frames. 280 is a bit over half a beat: long
   enough to track, short enough never to feel like a cutscene, and it still
   lands well inside the held beat (MISS_BEAT_MS 500) so the impact reads
   before the volley answers. */
const MISS_FLY_MS=280;    /* the round's travel                           [DIAL] */"""
    s = subN(s, old, new)

    # ---- 2. THE HOLD ----------------------------------------------------
    old = """function fireMissRound(tgt){"""
    new = """/* ===== V127 HOLD THE CAMERA ======================================
   Paolo: "it kind of moves too quick and you know you have the camera shifting
   around so much so quickly it's kind of difficult to see."
   THE DIAL IS NOT A SEPARATE SCREEN -- it is the FIELD zoomed in on the target,
   up to 3.6x. So the instant a shot resolves, THREE easings unwind at once: the
   field cam recentring at 0.2, the board zoom _zbS coming back out at 0.08, and
   his own pinch unwinding at 0.055. The round is drawn in world tiles, so while
   it travels the camera is ALSO carrying it across the screen and scaling it
   down. Nothing on the screen is holding still.
   SO THE CAMERA DOES NOT MOVE WHILE A MISSED ROUND IS IN THE AIR. Every easing
   is skipped, the scene is frozen exactly where he last saw it, and the only
   moving thing is the round. When the hold expires everything resumes from
   where it was -- no snap, because nothing was retargeted, only paused.
   The same idea as the hit freeze pointed at the other half of the research: a
   hit stops the WORLD, a miss stops the CAMERA. */
function missHolding(){ return (G._missHold||0)>performance.now(); }
function fireMissRound(tgt){"""
    s = subN(s, old, new)

    old = """  G._fx.push({type:'missrd', wx:lp[0], wy:lp[1], surf:missSurfaceAt(lp[0],lp[1]),
    t:0, life:MISS_FLY_MS/1000, _hit:false}); }"""
    new = """  G._fx.push({type:'missrd', wx:lp[0], wy:lp[1], surf:missSurfaceAt(lp[0],lp[1]),
    t:0, life:MISS_FLY_MS/1000, _hit:false});
  /* the frame holds for the flight plus a moment on the impact, and never past
     the beat, so the volley is never waiting on the camera */
  G._missHold=performance.now()+MISS_FLY_MS+140; }"""
    s = subN(s, old, new)

    # ---- 3. GATE EVERY EASING ------------------------------------------
    old = """  if(!G.ks){ cam.x+=(W/2-cam.x)*0.2; cam.y+=(H/2-cam.y)*0.2; cam.zoom+=(1-cam.zoom)*0.2; }"""
    new = """  if(!G.ks&&!missHolding()){ cam.x+=(W/2-cam.x)*0.2; cam.y+=(H/2-cam.y)*0.2; cam.zoom+=(1-cam.zoom)*0.2; }   /* V127: the field cam holds while a missed round is in the air */"""
    s = subN(s, old, new)

    old = """    G._zbS=(G._zbS==null||G.aimCamGlide===false)?zbT:G._zbS+(zbT-G._zbS)*0.08;   /* V20: the zoom glides too */"""
    new = """    G._zbS=(G._zbS==null||G.aimCamGlide===false)?zbT:(missHolding()?G._zbS:G._zbS+(zbT-G._zbS)*0.08);   /* V20: the zoom glides too. V127: and it HOLDS while a missed round is in the air -- this is the 3.6x-to-1x scale-down that was dragging the round across the screen. */"""
    s = subN(s, old, new)

    old = """      else { const k=0.055;   /* AIM CAM GLIDE V14 (V20: actually glides — slower) */
        G.cam.zoom+=(1-G.cam.zoom)*k; G.cam.x+=(tx3-G.cam.x)*k; G.cam.y+=(ty3-G.cam.y)*k;
        G.userZoom+=(1-G.userZoom)*k; G.userPan.x*=(1-k); G.userPan.y*=(1-k); } }"""
    new = """      else if(!missHolding()){ const k=0.055;   /* AIM CAM GLIDE V14 (V20: actually glides — slower). V127: held while a missed round flies, his pinch included, so nothing under the round is moving. */
        G.cam.zoom+=(1-G.cam.zoom)*k; G.cam.x+=(tx3-G.cam.x)*k; G.cam.y+=(ty3-G.cam.y)*k;
        G.userZoom+=(1-G.userZoom)*k; G.userPan.x*=(1-k); G.userPan.y*=(1-k); } }"""
    s = subN(s, old, new)

    # ---- 4. a hold never survives a reset -------------------------------
    old = """  if(G._cookTick){ try{clearInterval(G._cookTick);}catch(_e){} G._cookTick=null; }"""
    new = """  G._missHold=0;   /* V127: a camera hold never survives a reset */
  if(G._cookTick){ try{clearInterval(G._cookTick);}catch(_e){} G._cookTick=null; }"""
    if old in s:
        s = subN(s, old, new)
    else:
        old2 = """  G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;    /* YOURS -- the one he caught */"""
        new2 = old2 + """
  G._missHold=0;   /* V127: a camera hold never survives a reset */"""
        s = subN(s, old2, new2)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v127: the camera holds and the round is slow enough to track (%d chars)' % len(s))


if __name__ == '__main__':
    main()

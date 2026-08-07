#!/usr/bin/env python3
"""
BOHEMIA - YOU CAN HEAR WHERE YOU ARE. THE ROOM TAKES THE SOUND.

Every sound in this game plays IDENTICALLY everywhere. The same footstep, at the
same dryness, in the open desert, in a street between two buildings, in a small
bedroom, and inside a dead parking structure. A world that sounds the same in
every place is a world with one place in it, and that is the flattest thing left
in the audio.

This is not a new sound and it needs no verdict. It is the sounds he already
approved, PLACED IN A SPACE.

=== THE RESEARCH, because the numbers are real and not vibes ==================

Measured RT60 (time for sound to fall 60 dB), from the acoustics literature:
  small furnished rooms   ~0.19-0.21 s  (bedroom 0.192, living room 0.208,
                                         kitchen 0.206 - SoundCam dataset)
  conference room          ~0.58 s
  corridor                 ~2 s
  parking basement         ~3 s
  concert hall / cathedral  2 s and up
Sources: SoundCam (arXiv 2311.03517), commercial-acoustics.com RT60 targets,
NTi Audio, Larson Davis building-acoustics notes.

And outdoors is NOT one thing. Street-canyon acoustics is studied as the OUTDOOR
counterpart of room acoustics: multiple reflections between building facades
amplify the sound relative to open terrain and lengthen its decay, and concrete,
brick and glass are highly reflective so the tail sustains. Open terrain has
almost nothing to reflect off at all.
(Kang, UCL, "Effect of height-to-width ratio on sound propagation in urban
streets"; JASA "Reverberation-based urban street sound level prediction".)

So the Mojave outside town and a street between two blocks are two different
acoustic worlds, and Bohemia currently plays them as one.

=== HOW IT IS DONE WITHOUT BREAKING THE SCREECH LAW ==========================

No convolver. No delay. No feedback. The engine already builds its space out of
FINITE parts, and this only turns those dials:
  refl   early reflections = the same body re-struck at scheduled offsets
  room   the late tail = a filtered noise burst under an exponential decay
  space  how much of that you hear
  dark   the tail's colour
That is the existing, legal, excited-and-decaying machinery. Nothing new rings.

=== THE FOUR SPACES, AND WHAT THE RUN ALREADY KNOWS =========================

The run does not need new state. It already tracks `mode` (ext/int), it already
calls isRoad() to pick a footstep surface, and it already holds the interior
floorplan it draws from.

  OPEN    outdoors, off the road grid: desert, lots, yards. Nothing to reflect
          off. DRIER than the authored sound.
  STREET  outdoors, on or beside the road: the canyon. THIS IS THE BASELINE and
          it is deliberately 1.0 on every dial, so the most common place in the
          game sounds EXACTLY as it does today and nothing he judged moves.
  ROOM    indoors, small floorplan. ~0.2 s, tight, and darker because furniture
          and cloth eat the highs.
  HALL    indoors, large floorplan. The mall, the warehouse, the parking
          structure. 2-3 s, bright and long: the sound of a building with
          nothing left in it.

=== WHY THIS DOES NOT VIOLATE MECHANISM-MINE / CONTENTS-PAOLO'S =============

WHICH sound plays is untouched: the space never changes the candidate, never
reorders his set, never substitutes anything. It changes only the ROOM the sound
is played into, which is the same class of thing as the distance-and-pan already
applied to a neighbour's footstep. And the default outdoor case is 1.0 across
the board, so his approved sound in the commonest place in the game is byte for
byte what it is today. The gate asserts exactly that.

REUSE CHECK (REUSE-FIRST, 7/22): zero graphic pixels, so no banks/ art bank
applies and none was opened. Zero new synthesis: this multiplies four existing
fields of the existing typed spec before the existing renderer runs.

  python3 tools/bohemia_sfx_space_patch.py
"""
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
RUN = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'

# TWO SMALL ANCHORS, NOT ONE BIG ONE. This used to match the whole head of
# playSFX byte for byte, so it died the moment another feature (voice limiting)
# added a line inside that function -- the THIRD time today a whole-line anchor
# broke because somebody else touched the same lines. An anchor should be the
# smallest thing that is actually stable.
DEFS_ANCHOR = "  window.playSFX=function(ev,when){"
DEFS = """  /* === THE ROOM TAKES THE SOUND (8/4) ==================================
     Measured RT60 from the acoustics literature, mapped onto the four places
     this game actually has. STREET is 1.0 on every dial ON PURPOSE: it is the
     commonest place in the run, so his approved sounds are untouched there and
     only LEAVING the street changes anything.
       OPEN    open terrain has almost nothing to reflect off
       STREET  the canyon, and the baseline
       ROOM    ~0.2s, and darker: furniture and cloth eat the highs
       HALL    2-3s (a parking basement measures ~3s), bright and long
     No convolver, no delay, no feedback. These four fields are the engine's
     OWN finite space machinery: re-struck bodies and a filtered noise tail. */
  var SPACES={
    OPEN:   {space:0.30, room:0.45, refl:0.0, dark:1.15},
    STREET: {space:1.00, room:1.00, refl:1.0, dark:1.00},
    ROOM:   {space:0.85, room:0.55, refl:1.6, dark:0.72},
    HALL:   {space:1.70, room:3.00, refl:2.2, dark:1.30}
  };
  var SPACE='STREET';
  window.__sfxSpace=function(){ return SPACE; };
  /* EXPOSED SO IT CAN BE CHECKED EXACTLY. playSFX picks a RANDOM candidate from
     his approved set every call, and the difference between two of his
     candidates is bigger than the difference a room makes -- so measuring the
     room by playing playSFX twice proves nothing, which is exactly what the
     first measurement of this feature "showed". */
  window.__sfxInSpace=function(v,sp){ var k=SPACE; if(sp)SPACE=sp;
    try{ return inSpace(v); } finally { SPACE=k; } };
  function inSpace(v){
    var p=SPACES[SPACE]||SPACES.STREET;
    if(p.space===1&&p.room===1&&p.refl===1&&p.dark===1) return v;   /* baseline: untouched */
    var w={},k; for(k in v) w[k]=v[k];
    w.space=Math.max(0,Math.min(1,(v.space||0)*p.space));
    w.room =Math.max(0,Math.min(3,(v.room ||0)*p.room));
    w.refl =Math.max(0,Math.min(4,Math.round((v.refl||0)*p.refl)));
    w.dark =Math.max(300,Math.min(9000,(v.dark||2600)*p.dark));
    return w;
  }
"""

CALL_ANCHOR = "      var v=vec(ev,i); if(!v)return null;"
CALL_ADD = "\n      v=inSpace(v);"

W_ANCHOR = "AMB.where(d);"
W_ADD = ("\n        if(d.space && SPACES[d.space]) SPACE=d.space;"
         "   /* the run says where you stand */")

R_OLD = """      window.parent.postMessage({type:'BOHEMIA_WHERE',
        inside:(mode!=='ext'), night:night, min:min},'*');"""
R_NEW = """      /* WHICH ACOUSTIC SPACE YOU ARE STANDING IN (8/4). No new state: mode is
         the same flag the footstep classifier uses, isRoad is the same call,
         and the interior floorplan is the one the run already draws from.
           OPEN   outdoors and off the road grid: desert, lots, yards
           STREET outdoors on or beside the road: the canyon
           ROOM   indoors, small floorplan
           HALL   indoors, large floorplan (mall, warehouse, parking structure)
         Small vs large is the interior's own FLOOR CELL COUNT, not a guess at
         its name -- a name can be wrong and a floor cannot. */
      var space='STREET';
      try{
        if(mode!=='ext'){
          var cells=0;
          if(typeof fp!=='undefined' && fp && fp.grid){
            for(var yy=0;yy<fp.grid.length;yy++)
              for(var xx=0;xx<fp.grid[yy].length;xx++)
                if(fp.grid[yy][xx] && fp.grid[yy][xx].g==='floor') cells++;
          }
          space=(cells>=140)?'HALL':'ROOM';    /* ~12x12 of walkable floor and up */
        }else{
          var near=false, dx2, dy2;
          for(dx2=-1;dx2<=1&&!near;dx2++) for(dy2=-1;dy2<=1;dy2++){
            try{ if(typeof isRoad==='function' && isRoad(px+dx2,py+dy2)){ near=true; break; } }catch(_r){}
          }
          space=near?'STREET':'OPEN';
        }
      }catch(_s){}
      window.parent.postMessage({type:'BOHEMIA_WHERE',
        inside:(mode!=='ext'), night:night, min:min, space:space},'*');"""


def main():
    alpha = open(ALPHA, encoding='utf8').read()

    if 'var SPACES={' not in alpha:
        if DEFS_ANCHOR not in alpha:
            print('FAIL: cannot find playSFX to sit above')
            return 1
        alpha = alpha.replace(DEFS_ANCHOR, DEFS + DEFS_ANCHOR, 1)
        print('  the four spaces are defined')
    if 'v=inSpace(v);' not in alpha:
        if CALL_ANCHOR not in alpha:
            print('FAIL: cannot find the vector line inside playSFX')
            return 1
        alpha = alpha.replace(CALL_ANCHOR, CALL_ANCHOR + CALL_ADD, 1)
        print('  playSFX now plays into the space you are standing in')
    if "if(d.space && SPACES[d.space])" not in alpha:
        if W_ANCHOR not in alpha:
            print('FAIL: cannot find the WHERE receiver')
            return 1
        alpha = alpha.replace(W_ANCHOR, W_ANCHOR + W_ADD, 1)
        print('  the parent listens for the space')
    open(ALPHA, 'w', encoding='utf8').write(alpha)

    run = open(RUN, encoding='utf8').read()
    if "space:space" not in run:
        if R_OLD not in run:
            print('FAIL: cannot find the WHERE reporter in the run')
            return 1
        run = run.replace(R_OLD, R_NEW, 1)
        open(RUN, 'w', encoding='utf8').write(run)
        print('  the run reports which space you are standing in')

    r = subprocess.run(['node', 'tools/build_run_slice.js'], capture_output=True, text=True)
    if r.returncode != 0:
        print('FAIL: the run would not rebuild:\n' + (r.stdout + r.stderr)[-700:])
        return 1
    built = open('slices/BOHEMIA_RUN_CURRENT.html', encoding='utf8').read()
    if 'space:space' not in built:
        print('FAIL: the rebuilt run does not report a space')
        return 1
    print('THE ROOM TAKES THE SOUND.')
    print('  OPEN / STREET / ROOM / HALL, and STREET is 1.0 so the baseline is untouched')
    return 0


if __name__ == '__main__':
    sys.exit(main())

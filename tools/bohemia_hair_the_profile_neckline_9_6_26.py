#!/usr/bin/env python3
"""
BOHEMIA -- AND THE PROFILE HAS A NECKLINE TOO  (COOK, [runway hair], round 3, 9/6/26)

THIS CLOSES HIS 8/20 COMPLAINT, which is the oldest open hair item in the repo:
    "east and west hairstyles look like absolute dog shit across the board"
He killed 13 of 15 haircuts on it. The verdict record calls that ONE RENDER DEFECT JUDGED
THIRTEEN TIMES and routes it to CHARACTER as P0, where it sat for sixteen days because
nobody had a number for it.

ROUND 2 BUILT THE NUMBER and found the diagnosis was aimed at the wrong angle: the BACK
three were a whole tier below the profiles (NE 0.220 against E 0.300, with 33 of 55 pairs
indistinguishable). One line did it -- `sideBot=(back||prof)?Math.max(hBot,_styleBot)`
forces every cut shorter than the skull down to the skull base -- and the fix was to give
each cut back the thing the same block says names it: ITS NECKLINE. NE 0.220 -> 0.272.

*** BUT THAT LINE SAYS `back||prof`, AND ROUND 2 ONLY ANSWERED THE `back` HALF. ***
The profile pair table says so in the plainest way possible. Every collapsed pair is a
SHORT OR MID cut, and the only two that stand clear are the only two longer than the skull:
    DRY TAPER / DEEP TAPER        0.136      ROPE LOCKS / DUST WEAVE      0.505
    CURTAIN CUT / HEAVY FRINGE    0.137      SHORT ROPES / LAYERED FALL   0.475
    SHAG / COIL CROWN             0.152      TEMPLE TAPER / ROPE LOCKS    0.446
    TEMPLE TAPER / DRY TAPER      0.157      DUST WEAVE / LAYERED FALL    0.445
That is the same signature the back had: length is the only thing that survives the clamp,
so the nine cuts shorter than the skull come out as one shape and the two longer ones are
the whole of the variety.

WHAT A PROFILE NECKLINE ACTUALLY IS, and it is why this is not just the back fix again.
Side-on you are looking ALONG the head. The hair's front edge is the hairline over the
face and `_pHair` already owns it -- correctly, and it is the same for every style because
every style sits on the same skull. The BACK edge is the neckline: it runs up behind the
ear and it is exactly what a barber cuts. So the inset goes on the AWAY side ONLY, read
off `_fFront.dir`, the same fact `_pHair` reads to know which way he is looking. Insetting
both sides would eat into the hairline the profile fix built, on the one facing where the
face is the front half of the head.

ONE COMPUTATION, TWO APPLICATIONS. The size of the line -- where it starts, how hard it
closes, how far fullness holds it off the neck -- is IDENTICAL to the back's, because it is
the same haircut. Only which edges it is applied to differs: both on a back facing, the
away one in profile. This file's own idiom for that is at sideBot and the fade: "It is not
a copy any more, it IS sideBot -- one edge, so the two can never disagree."

MEASURED (gates/hair_eight_facings_gate.js):
    E  0.3001 -> see the gate's pins        W  0.3025 -> see the gate's pins
    S, SE, SW, NE, N, NW  unchanged to the digit at both scales.

    python3 tools/bohemia_hair_the_profile_neckline_9_6_26.py
"""
import os, sys

REPO  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html')

OLD = """      if(back&&(sideBot+backEx)<=hBot+S){
        var _nkT=Math.max(hBot-4*S+1,Math.min(hBot-2*S+1,_styleBot));
        if(y>=_nkT&&y<=hBot){
          var _nkR=(((y-_nkT)/S)|0)+1;
          var _nkTight=Math.max(0.5,Math.min(2.0,
            (opt.fade||0)*0.18+(0.85-Math.min(0.85,sideF))*1.6));
          var _nkWide=Math.round(((opt.vol||0)*0.5+(opt.flare||0)*4)*S);
          /* NEVER CLOSE THE NAPE. The inset is capped at a third of the row so the
             span can never invert or pinch to nothing on the small grid, where the
             head is twelve pixels across. */
          var _nkI=Math.min(Math.floor((mx-mn)/3),
                            Math.max(0,Math.round(_nkR*S*_nkTight)-_nkWide));
          mn+=_nkI; mx-=_nkI; } }"""

NEW = """      /* *** AND THE PROFILE HAS A NECKLINE TOO. (Round 3, 9/6.) ***
         The line this fixes says `back||prof` and round 2 answered only the `back`
         half. The profile pair table says so in the plainest way there is: every
         collapsed pair is a SHORT or MID cut and the only two that stand clear are the
         only two longer than the skull.
             DRY TAPER / DEEP TAPER 0.136    ROPE LOCKS / DUST WEAVE 0.505
             CURTAIN CUT / HEAVY FRINGE 0.137   SHORT ROPES / LAYERED FALL 0.475
         Same signature the back had: length is the only thing that survives the clamp.
         WHICH EDGE, AND IT IS NOT BOTH. Side-on you look ALONG the head. The FRONT edge
         is the hairline over the face and `_pHair` owns it -- rightly, and it is the
         same for every style because every style sits on the same skull. THE BACK EDGE
         IS THE NECKLINE: it runs up behind the ear and it is what a barber cuts. So in
         profile the inset goes on the AWAY side only, read off `_fFront.dir`, the same
         fact `_pHair` reads to know which way he is looking. Insetting both would eat
         the hairline on the one facing where the face is half the head.
         ONE COMPUTATION, TWO APPLICATIONS: the size of the line is identical because it
         is the same haircut; only which edges it lands on differs. */
      if((back||(prof&&_fFront))&&(sideBot+backEx)<=hBot+S){
        var _nkT=Math.max(hBot-4*S+1,Math.min(hBot-2*S+1,_styleBot));
        if(y>=_nkT&&y<=hBot){
          var _nkR=(((y-_nkT)/S)|0)+1;
          var _nkTight=Math.max(0.5,Math.min(2.0,
            (opt.fade||0)*0.18+(0.85-Math.min(0.85,sideF))*1.6));
          var _nkWide=Math.round(((opt.vol||0)*0.5+(opt.flare||0)*4)*S);
          /* NEVER CLOSE THE NAPE. The inset is capped at a third of the row so the
             span can never invert or pinch to nothing on the small grid, where the
             head is twelve pixels across. */
          var _nkI=Math.min(Math.floor((mx-mn)/3),
                            Math.max(0,Math.round(_nkR*S*_nkTight)-_nkWide));
          if(back){ mn+=_nkI; mx-=_nkI; }
          else if(_fFront.dir>0){ mn+=_nkI; } else { mx-=_nkI; } } }"""


def main():
    src = open(ALPHA, encoding='utf-8').read()
    if 'else if(_fFront.dir>0){ mn+=_nkI; }' in src:
        sys.exit('already applied.')
    n = src.count(OLD)
    if n != 1:
        sys.exit('ABORT: the round-2 neckline block was found %d times, expected 1.' % n)
    src = src.replace(OLD, NEW, 1)

    for needle, why in [
        ('if((back||(prof&&_fFront))&&(sideBot+backEx)<=hBot+S){',
         'the guard now covers the profile and still requires a readable facing'),
        ('if(back){ mn+=_nkI; mx-=_nkI; }',
         'a back facing still insets BOTH edges, exactly as round 2 left it'),
        ('_napeStop', 'the long-hair predicate is still in the file'),
    ]:
        if needle not in src:
            sys.exit('ABORT: %s -- not true after the substitution.' % why)

    open(ALPHA, 'w', encoding='utf-8').write(src)
    print('=== THE PROFILE HAS A NECKLINE TOO (9/6, round 3) ===')
    print('  neckline block extended to E and W: 1 of 1')
    print('  away side only in profile, read off _fFront.dir')
    print('  S, SE, SW, NE, N and NW untouched')
    print('=== done ===')


if __name__ == '__main__':
    main()

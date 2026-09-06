#!/usr/bin/env python3
"""
BOHEMIA -- THE NECKLINE IS WHAT A BARBER NAMES THESE CUTS BY  (COOK, [runway hair], 9/6/26)

MEASURED FIRST, WITH A RULER THAT DID NOT EXIST BEFORE THIS ROUND
(tools/bohemia_hair_eight_facings_9_6_26.js). For every PAIR of the eleven canon cuts,
on every facing, the share of hair pixels where exactly one of the two has hair. That is
what "reads from all eight facings" means in numbers: can you tell the set apart from
this angle. THE CARD ASKS FOR EXACTLY THIS AND NAMES IT AFTER HAIR --
records/BOHEMIA_STYLE_CARD_9_5_26.md section 3: "45 DEGREE ART LAW: every garment reads
on the three-quarter corpus from all eight facings; a pole judged only from the front is
not judged (THE HAIRCUT LESSON, 8/28)."

    facing   legibility   pairs you cannot tell apart
    S          0.459        1 of 55
    SE / SW    0.452         2 of 55
    E / W      0.301        18 / 19 of 55
    NE         0.220        33 of 55
    N          0.224        31 of 55
    NW         0.225        33 of 55

*** AND IT IS NOT EAST AND WEST. IT IS THE BACK. ***
Everyone has been carrying his 8/20 words -- "east and west hairstyles look like absolute
dog shit across the board" -- as the whole diagnosis. The verdict record routes it to
CHARACTER as P0 on that basis and it has sat there since. The profiles ARE poor. THE
BACK THREE ARE WORSE, and by a lot: EVERY ONE of the 55 pairs seen from NE scores below
the WORST pair seen from S. He was judging a turntable and named the angle he could name.

WHY, AND IT IS ONE LINE THAT CONTRADICTS ANOTHER ONE THIRTY LINES BELOW IT.
    var sideBot=(back||prof)?Math.max(hBot,_styleBot):_styleBot;
On any back or profile facing the mass is forced down to hBot, the base of the skull,
whatever the cut's own length says. Nine of the eleven cuts are shorter than that, so
nine of eleven become the same skull-covering blob. And the profile fix's own comment,
thirty lines further down, states the mechanism this destroys:
    "Every style gets the same hairline, because they all sit on the same skull;
     WHAT STILL TELLS THEM APART IS HOW FAR THE HAIR HANGS, WHICH sideBot ALREADY OWNS."
sideBot owns it and then gives it away. TEMPLE TAPER against CURTAIN CUT is 0.322 from
the front and 0.066 from behind -- a taper and a curtain, 93% the same shape once he
turns around.

*** THE FIX IS NOT TO REMOVE THE FLOOR, AND THE GENERATOR ALREADY SAYS WHY. ***
    "`side:0.30` says the hair does not HANG below a third of the head. It does not say
     the scalp stops there -- a buzz cut covers the whole cranium, it just has no fall."
That is right and it stays. The cranium is covered by every cut. What was merged into it
is the NECKLINE, and the generator names that too, in the block being changed here:
    "Every one of those is a cut a barber names BY ITS NECKLINE. A taper with no hair on
     the neck is not a taper."
It then drew the identical two-row inset on all of them. The neckline was the one thing
that could tell nine cuts apart from behind and it was a constant.

SO THE NECKLINE BECOMES THE CUT'S OWN, on two facts the cut already carries:
  WHERE IT STARTS   the style's own bottom (_styleBot), clamped into the last two-to-four
                    cell rows of the skull. A cut that hangs to 62% of the head starts
                    closing in four rows higher than one that hangs to 95%.
  HOW HARD IT CLOSES  the fade dial and the hang together. A deep fade (DEEP TAPER 9)
                    narrows to a point -- that is what the clippers do. No fade and a
                    long hang (DUST WEAVE 0.95) stays blocked and level.
  AND FULLNESS HOLDS IT OFF THE NECK  vol and flare push the line back out, because a
                    full cut does not sit tight to the nape.
Nothing else moves: the guard is unchanged (`back` only, and `_napeStop` so long hair is
never given a nape it should not have), so S, SE, SW, E and W are byte-identical.

AND IT IS S>1 ONLY, which is this generator's own standing pattern for authored detail
(the gear rivets, the bag studs, the hair sub-step all say it in the same words): "S>1
only, so the 56 wardrobe is byte-identical and its 1,744 pinned hashes do not move."
A neckline is two pixel rows at 56 and four at 112 -- it is exactly the mark the
four-times law exists for, and the card says art composes at 112.

*** AND EVERY NAME IT INTRODUCES IS PREFIXED, BECAUSE ONE OF THEM COLLIDED. ***
The first cut called its cell-row counter `_cr`. genHair already has a `_cr`, three times
over, in the shading, and `var` is FUNCTION-scoped -- so a variable written inside a
`back`-only branch silently overwrote a variable read on every facing. city_cast_gate
caught it on the FRONT view within a minute (B6: the neighbour stopped matching any body
in the cast) on a change that cannot touch the front view. A back-only guard is not a
back-only change if the names are shared.

    python3 tools/bohemia_hair_the_neckline_9_6_26.py
"""
import os, sys

REPO  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html')

OLD = """      if(back&&y>hBot-2*S&&y<=hBot&&(sideBot+backEx)<=hBot+S){
        var _nd=((((y-(hBot-2*S+1))/S)|0)+1)*S; mn+=_nd; mx-=_nd; }"""

NEW = """      /* *** AND EVERY CUT HAD THE SAME NECKLINE, WHICH IS THE ONE THING THAT COULD
         TELL THEM APART FROM BEHIND. (COOK, 9/6, and it is measured.) ***
         tools/bohemia_hair_eight_facings_9_6_26.js scores every PAIR of canon cuts on
         every facing by the share of hair pixels only one of the two has. The back is
         the worst part of this generator by a distance, not the profiles everybody has
         been quoting since 8/20:
             S 0.459 (1 twin pair of 55)   E/W 0.301 (18)   NE 0.220 (33)   N 0.224 (31)
         EVERY pair seen from NE scores below the WORST pair seen from S. TEMPLE TAPER
         against CURTAIN CUT: 0.322 from the front, 0.066 from behind.
         The cause is thirty lines up -- sideBot forces every cut down to hBot on a back
         facing -- and the profile fix's own comment states what that costs: "what still
         tells them apart is how far the hair HANGS, which sideBot already owns."
         THE FLOOR STAYS. This block's own comment is right that a buzz cut covers the
         whole cranium; the cranium is not the argument. THE NECKLINE IS, and this block
         says so itself: "every one of those is a cut a barber names BY ITS NECKLINE."
         It then drew the identical inset on all of them.
         So the line is the cut's own now: it STARTS at the style's own bottom (a cut
         hanging to 62% closes in four rows higher than one hanging to 95%), it CLOSES at
         a rate the fade dial and the hang set together (a deep fade narrows to a point,
         which is what clippers do; no fade and a long hang stays blocked and level), and
         FULLNESS holds it off the neck (vol and flare, because a full cut does not sit
         tight to the nape).
         IT DRAWS AT BOTH SCALES, and scoping it to 112 was the first thing tried and the
         first thing wrong: a rivet RECOLOURS a pixel the plate already owns, but A
         NECKLINE IS THE SILHOUETTE, so 112-only put CROP at 82% of its proper coverage
         and LONG at 114% and clothes_4x_gate claim 1 refused it, correctly. Drawn at
         both scales it is 448/448, and the 56 hashes for hair on NE/N/NW move -- logged
         in gates/clothes_56_pin.txt with the numbers.
         EVERY NAME HERE IS PREFIXED _nk. The first cut called the row counter `_cr`,
         which genHair already uses three times in the shading, and `var` is FUNCTION
         scoped -- so a variable written under a `back`-only guard overwrote one read on
         every facing, and city_cast_gate went red on the FRONT view. A back-only guard
         is not a back-only change if the names are shared. */
      if(back&&(sideBot+backEx)<=hBot+S){
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


def main():
    src = open(ALPHA, encoding='utf-8').read()
    if NEW.split('\n')[-1] in src:
        sys.exit('already applied.')
    n = src.count(OLD)
    if n != 1:
        sys.exit('ABORT: the nape block was found %d times, expected exactly 1.' % n)
    src = src.replace(OLD, NEW, 1)

    # GUARDS. Everything this cook promises, asserted before it is written.
    for needle, why in [
        ('if(back&&(sideBot+backEx)<=hBot+S){', 'the back-only guard survived'),
        ('_napeStop', 'the long-hair predicate is still in the file'),
    ]:
        if needle not in src:
            sys.exit('ABORT: %s -- not true after the substitution.' % why)

    open(ALPHA, 'w', encoding='utf-8').write(src)
    print('=== THE NECKLINE IS THE CUT\'S OWN (9/6) ===')
    print('  nape block rewritten: 1 of 1')
    print('  back facings only; S, SE, SW, E and W untouched at either scale')
    print('  drawn at every scale, so 56 and 112 stay one shape (4x law claim 1);')
    print('  the 56 hashes for hair on NE/N/NW move, and only those')
    print('=== done ===')


if __name__ == '__main__':
    main()

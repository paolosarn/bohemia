# [blank faces] ROUND TWO -- THE HAIR GETS THE SAME LIGHT THE FACE DOES
# PORTRAIT (chat 20), 10/1/26. [blank faces] school (9/28) found three real
# defects. THE LIGHT was fixed by [three d look] (9/29). THE BROW SHADOW IS
# AN ACCIDENT is still open, not touched this round. This round answers the
# second finding: THE HAIR HAS NO VOLUME.

## THE FINDING THIS ROUND ANSWERS
Verbatim from the school round: "THE HAIR HAS NO VOLUME, not on the original
list at all -- 84.8% average flat-tone share of every hairstyle's own
pixels, on a mass averaging 14.9% of the whole canvas." The renderer already
computes a highlight tone (`+22` per channel, `hi`) and a shadow tone
(`x0.8`, `hs`) for hair and only ever used them for a three-pixel triangle at
the crown. Everything else -- the main cap, the flare, the fringe -- draws
one flat `hc`.

## THE FIX, SAME FLAG AS [three d look]
`renderFace`'s hair-drawing block (the `if(!bald){...}` body) already runs
inside the same function that declares `const _3d = !!(opts&&opts.threeD)`
for the face mass, so the flag was already in scope at the end of the hair
block -- nothing new to thread through. Added one more step, run LAST, after
the cap, the part, the flare, the fringe, the texture overlay and the braid:

```
if(_3d){
  const _hMid=(htop+jaw)/2;
  for(let yy=0;yy<N;yy++)for(let xx=0;xx<N;xx++){
    const i=(yy*N+xx)*4;
    if(buf[i]!==hc[0]||buf[i+1]!==hc[1]||buf[i+2]!==hc[2])continue;
    if(xx>cx&&yy<_hMid)P(xx,yy,hi);
    else if(xx<cx)P(xx,yy,hs);
  }
}
```

Same direction as the face's own `_3d` shading: lit on the right (a
highlight across the upper-right dome), shadow down the whole left side.
READ OFF THE BUFFER, not guessed from the polys -- the exact lesson the
`tex` overlays a few lines above this one already paid for in an 8/28
comment still in the file: "the mass is three overlapping polys plus a
highlight, and any bounding box around them clips the temples and leaks at
the crown." The same buffer-scan technique the `locs`/`coils` overlays use
(`_over`) is reused here, not reinvented.

Only pixels still carrying the exact flat `hc` tone move. The scan runs
AFTER the texture overlay and the braid, so a loc, a coil or a wave mark a
textured cut already drew is a real tone that is not `hc` any more, and this
step leaves it alone rather than painting over it. On a cut with no `tex`
set (most of the 11 canon cuts), the whole mass is still `hc` at this point,
so the sweep covers it in full.

## MEASURED, THE SCHOOL ROUND'S OWN RULER
Same definition the school round used: the share of a hairstyle's own drawn
pixels (`hc`, `hi`, `hs` or `hr`, the roots/part colour) that are the single
flat base tone `hc`. Same 20 crowd ids (`gate:crowd:0` through `gate:crowd:190`):

    average flat-tone share, flag off (today)    85.1%  (school round read 84.8% on its own sample -- the two agree)
    average flat-tone share, flag on             20.6%
    range across the twenty, flag on             10.5% to 35.6%

And the three named faces from the phone strip, Reyna/Ezekiel/Perla
([three faces]), reused rather than recast:

    REYNA     flat 92.2%  ->  3D 16.8%
    EZEKIEL   flat 92.3%  ->  3D 16.4%
    PERLA     flat 76.7%  ->  3D 32.1%  (she rolled a durag; the cap covers
                                         part of the crown dome, less mass
                                         for the sweep to reach, the same
                                         kind of real coverage cost [three d
                                         look]'s card named for her face)

## PROVED NOTHING SHIPPED MOVED (rule 18)
`opts.threeD` is still never set anywhere the play surface calls
`renderFace`. His own approved face hash is the same two gates already pin
it against: `talking_portrait_gate` (34/0) and `family_gate` (17/0) both
read `8c2cac60`, unmoved -- checked, not assumed.

## GATES
talking_portrait 34/0, portrait_haircut 15/0, family 17/0, face_maker 16/0,
hair 39/0, hairline 12/0, hair_graveyard 13/0, craft_law 39/0, alpha_loads
20/0, character_in_the_vote_tab 9/0, handoff 9/0, speak_along 6/0,
portrait_matches_body 11/0, vote_tab 30/1 (pre-existing, `world-what-a-tile-
is-10-1`'s own missing sha, checked against a clean origin/main worktree
before being called not mine).

## COOKED (rule 22)
`portrait-the-hair-has-volume-10-1`, flat beside 3D for the same three named
people [three d look] already used, plus the 20-crowd before/after. TAB:
VOTE in the alpha. Record of the render: this file; the page itself is
`slices/vote/PORTRAIT_THE_HAIR_HAS_VOLUME.html`.

## NOT DONE
THE BROW SHADOW IS AN ACCIDENT, the school round's third finding, is still
untouched -- named as the next line of [blank faces] if nobody else picks it
up first.

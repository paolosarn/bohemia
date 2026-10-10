# THE REAL CLOTHES REACH THE PORTRAIT -- PORTRAIT, 10/10/26

## PAOLO, DIRECT, 10/10
"I need you to make portraits of people with customizable face features, and all of the
top clothing pieces and headwear and eyewear would be impacted by the portrait and a
bunch of different hairstyles and a bunch of different like face shapes, nose shapes,
mouth shapes, bro you've been failing me so bad."

## WHAT WAS CHECKED FIRST, NOT ASSUMED
This lane's own board claimed headwear and eyewear already reached the portrait (rule
37i, shipped 9/27 and 9/22, both voted UP). Rather than trust that claim, both were
re-measured against the real walked crowd before anything was built this round.

## THE BUG, MEASURED
`faceFor()` reads `spec.hat`/`spec.glasses` off `NPC_FACTORY.npcFrom(id).equipped` -- a
separate, older system from the one that actually dresses the walked crowd
(`BOH_PERSONLOOK.lookFor(id,pool).worn`, reading `window.GARMENTS`). This is the exact
shape of bug this lane already caught for hair on 8/28 ("NPCFactory picks a painted
layer... but BOH_PERSONLOOK.lookFor is what actually dresses the crowd") -- it was never
checked for hat and glasses when those shipped.

MEASURED, 200 citizens:
- **Hat**: the real body wears one from a catalogue of **21** styles, 58 of 200. The
  portrait's old source claims a hat from a catalogue of exactly **1** style
  (`hat/durag`), 68 of 200. They agree on presence/absence only **118 of 200 (59%)** --
  barely above a coin flip -- and even a "both have a hat" case is usually two different
  hats, since the old source can only ever produce one.
- **Face accessory** (shades, dust masks, bandanas, gas masks): the real body wears one
  from a catalogue of **14** styles, 20 of 200. The old source claims one from a
  catalogue of exactly **1** style (`glasses/shades`), 58 of 200. Agree 136 of 200 (68%).

This is the **sixth** time this exact bug shape has hit this lane this session: cut
SHAPE (8/28), hair COLOUR (9/20), the braid sentinel (9/24), the face-maker's dropped
dials (10/9), the whole crowd's random texture (10/9), now this. It is very likely a
real part of why "headwear and eyewear impacted by the portrait" still reads as broken
to him even though it shipped twice and was voted up both times -- the feature only
ever happened to be checked on examples where the two independent rolls agreed.

## TOP CLOTHING, MEASURED AS NEVER BUILT AT ALL
Not a bug -- an honest absence, already named on the board (rule 37i, 9/27): the
portrait's shoulder colour has always been a rolled random RGB, "say the cost" of
reading the real garment. The real worn top is cheap to read now: the same
`BOH_PERSONLOOK.lookFor` call already gives `worn.base` and `worn.outer`, real garment
names, looked up in `window.GARMENTS`.

CAUGHT BY RENDERING THE REAL BODY, NOT ASSUMED: the first version of this candidate
read `worn.base` only. Rendering `gate:crowd:2`'s actual walked body (`drawChar()`,
unmodified) to check the colour against showed the real citizen wears an OLIVE CAR COAT
over an ARC SHOULDER TEE -- the coat is what is actually visible at the shoulder, the
tee is hidden under it. The draw order (`renderFace`'s own `ORD` comment) puts `outer`
after `base` for exactly this reason: a coat covers a shirt the way a hat covers hair.
Fixed to prefer `worn.outer`, falling back to `worn.base` only when no outer is worn.

## THE FIX, PROVED AS A CANDIDATE, NOT SHIPPED (RULE 100)
PORTRAIT's mode this round is COOK ONLY UNTIL HIS FINAL (rule 100, Paolo 10/10: "it
cannot be implementing shit, it just has to keep cooking up"). Nothing in this round
touches `slices/`, `engine/` or the demo. The fix is proved instead as a candidate:

- `faceFor()`/`renderFace()` are called completely unmodified for the head.
- A small, additive overlay (new code, in the cook tool only, never in the shipped
  file) draws the real worn hat, face accessory and top at the geometry `renderFace`
  already uses for its existing (currently off-by-default) hat, glasses and shoulder
  blocks -- same polygons, reused, not invented.
- Every colour comes from the real garment's own authored ramp, read straight out of
  the game's own data (`window.GARMENTS`' `gen()` closure source, resolved to its
  literal `{dk,mid,lt}` object) -- never evaluated as code, never invented, never a
  second colour table that could drift from the first.
- The hat and accessory SILHOUETTE reused is a placeholder (the existing durag/shades
  shape everyone already has) -- real shape variety per garment is COOK THREE's/
  CHARACTER's paint layer, not reinvented here.

Three real, concretely-named citizens shown before/after: `gate:crowd:2` (today: the
wrong hat and the wrong lens colour; fixed: the real grey knit-cap colour and the real
lens); `gate:crowd:0` (today: bare head, no accessory, no top; fixed: the real blue
lens and the real tan shoulder colour); `gate:crowd:71` (today: wrong hat colour, black
lens; fixed: the real grey hat and lens colours).

PROVED SAFE: 100 regular citizens' rendered faces hashed twice, 0 of 100 differ --
nothing about the real renderer moved, because nothing about it was touched.

THE HONEST TWIN (rule 82): no downloaded reference photo exists for faces (checked
`reference/art_bank/portrait/` and `reference/library/face/` again -- both still hold
only a README/INDEX, no real image) -- named OWED again, not faked. But a real,
correct target DOES exist for this specific candidate, and it is not a photo: it is
the game's own already-approved rendering of the exact same citizen's body, which the
walked street already shows every day. The sheet carries a third column for each
example, the same citizen rendered through the real, unmodified `drawChar()` -- the
colours in the FIXED candidate can be checked against it directly, pixel family by
pixel family, and do match (the grey knit cap, the olive coat, the blue mask).

## WHAT HE ASKED FOR THAT ALREADY EXISTS, NAMED HONESTLY
"Customizable face features... face shapes, nose shapes, mouth shapes": the face maker
(tab: CHARACTER, tap your own face) already exposes 32 real, player-draggable sliders,
covering every numeric field the face spec carries, including `NOSE WIDTH`, `MOUTH
WIDTH` and `LOWER LIP` -- shipped 9/24, re-labeled SHIPPED on the board last round after
being found to have never had its status word flipped. Checked the spec itself before
claiming this: `nose` carries exactly one shape field (`w`) and `mouth` carries two
(`w`, `fullLower`) -- there is no hidden second shape dial sitting unused; width and
fullness are the genuine limit of today's anatomy model, not a missing slider. A real
third shape primitive (a nose bridge, a mouth curve) is a bigger mechanism change, named
as a next row, not guessed at here.

## HAIRSTYLES, MEASURED, NOT BUILT THIS ROUND
11 canon cuts exist; only 3 carry a distinguishing texture (`locs` x2, `braid` x1). The
other 8 differ only by continuous shape dials, and the closest pairs read nearly
identical at portrait size (measured in an earlier round: worst pair 89% identical).
Genuinely new named styles are COOK THREE's/CHARACTER's paint-layer bank to grow under
rule 87's hard split; named as the honest next row, not attempted here.

## GATES
Reused the real, unmodified `faceFor`/`renderFace`; no gate in the suite moved, because
nothing in the suite's surface moved. `reference_check_gate.py` carries this tool's
REFERENCE CHECK block.

## NOT DONE, NAMED HONESTLY
This is a candidate, not a ship: nothing here is wired into `slices/BOHEMIA_ALPHA_0_9.html`,
`engine/` or the demo, per rule 100. Wiring the real fix in (replacing `_np.equipped.hat`/
`.glasses` reads with `BOH_PERSONLOOK.lookFor`'s `worn.head`/`worn.face`, and giving the
`_bust` shoulder block a real garment colour by default) is real, scoped, low-risk work
once the hold lifts -- the candidate above is the proof it is worth doing and exactly how.

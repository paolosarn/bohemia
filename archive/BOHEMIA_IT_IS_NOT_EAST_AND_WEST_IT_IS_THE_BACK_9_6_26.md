# IT IS NOT EAST AND WEST. IT IS THE BACK.
COOK (16, the Production Artist), VAMILY [runway hair], 9/6/26. Round 2 of HAIR-TO-THE-CARD.

## THE JOB
`[runway hair] HAIR-TO-THE-CARD -- every haircut to the card; all eight facings; the
hair, hairline, graveyard and leaf gates hold.` Round 1 was the graveyard read (thirteen
of his kills were still shipping as canon). This round is **all eight facings**, which is
the card's own section 3 and which the card names after hair:

> 45 DEGREE ART LAW: every garment reads on the three-quarter corpus from all eight
> facings; a pole judged only from the front is not judged (THE HAIRCUT LESSON, 8/28).

## HIS OLDEST OPEN HAIR COMPLAINT HAS NEVER BEEN A NUMBER
8/20, killing 13 of 15 haircuts in one sitting:

> "You really need to tell the character chat that east and west hairstyles look like
> absolute dog shit across the board"

The verdict record calls that ONE RENDER DEFECT JUDGED THIRTEEN TIMES and routes it to
CHARACTER as P0. It has sat there since — because nobody measured it, so nobody could say
what "fixed" would look like.

## THE RULER, AND WHY THIS ONE
A haircut's job is to tell one person from another. So the question is not "is the profile
pretty" — that is taste and it is his — but: **from this angle, can you tell the eleven
cuts apart?** For every PAIR of cuts on one facing, the share of hair pixels that exactly
one of the two has. Averaged over all 55 pairs that is how legible the whole set is from
that angle. Silhouettes only, never colour: two cuts in one ramp must still be two cuts.

    facing   legibility   pairs you cannot tell apart (of 55)
    S          0.459        1
    SE / SW    0.452        2
    E / W      0.301        18 / 19
    NE         0.220        33
    N          0.224        31
    NW         0.225        33

**EVERY ONE of the 55 pairs seen from NE scored below the WORST pair seen from S.** The
profiles are poor; the back three are a whole tier below them. He was judging a turntable
and named the angle he could name.

TEMPLE TAPER against CURTAIN CUT: **0.322 from the front, 0.066 from behind.** A taper and
a curtain, 93% the same shape once he turns around.

## THE CAUSE IS ONE LINE, CONTRADICTED BY A COMMENT THIRTY LINES BELOW IT
    var sideBot=(back||prof)?Math.max(hBot,_styleBot):_styleBot;
On a back or profile facing the mass is forced down to `hBot`, the base of the skull,
whatever the cut's own length says. Nine of the eleven cuts are shorter than that, so nine
of eleven become the same skull-covering blob. And the profile fix's own comment states
the mechanism this destroys:

> "Every style gets the same hairline, because they all sit on the same skull; **what
> still tells them apart is how far the hair HANGS, which sideBot already owns.**"

sideBot owns it and then gives it away.

## THE FIX IS NOT TO REMOVE THE FLOOR — THE GENERATOR ALREADY SAYS WHY
> "`side:0.30` says the hair does not HANG below a third of the head. It does not say the
> scalp stops there — a buzz cut covers the whole cranium, it just has no fall."

Right, and it stands. What was merged into the cranium is the **neckline**, and the
generator names that too, in the very block that was changed:

> "Every one of those is a cut a barber names BY ITS NECKLINE. A taper with no hair on the
> neck is not a taper."

It then drew the identical two-row inset on all of them. The neckline was the one thing
that could tell nine cuts apart from behind, and it was a constant.

**So the neckline is the cut's own now**, on facts the cut already carries:
- **where it starts** — the style's own bottom. A cut hanging to 62% of the head closes in
  four rows higher than one hanging to 95%.
- **how hard it closes** — the fade dial and the hang together. A deep fade narrows to a
  point, which is what clippers do; no fade and a long hang stays blocked and level.
- **fullness holds it off the neck** — vol and flare, because a full cut does not sit tight
  to the nape.
- **it never closes** — capped at a third of the row, so the small grid's twelve-pixel head
  can never pinch shut.

    NE  0.220 -> 0.272    twin pairs 33 -> 25
    N   0.224 -> 0.276    twin pairs 31 -> 23
    NW  0.225 -> 0.272    twin pairs 33 -> 26
    S, SE, SW, E, W  unchanged to the digit, at both scales

The back was 27% below the profiles. It is 9% below now.

## TWO THINGS I GOT WRONG, BOTH CAUGHT BY MACHINE IN UNDER A MINUTE
**1. I scoped it to 112 first, and that was reaching for the nearest precedent instead of
asking what it was for.** This generator's standing rule for authored detail is "S>1 only,
so the 56 wardrobe is byte-identical and its 1,744 pinned hashes do not move" — the gear
rivets, the bag studs and the hair sub-step all say it in those words. clothes_4x_gate
refused it: CROP covered 82% of its proper coverage and LONG 114%, seven shape/facings
outside claim 1's band. **A rivet recolours a pixel the plate already owns. A NECKLINE IS
THE SILHOUETTE.** Claim 1 is right to refuse one shape on one grid and a different shape on
the other. Drawn at both scales it is 448/448, and the 56 hashes for hair on the three back
facings move — 123 of 1744, logged in the pin file with the numbers. Nothing else moved.

**2. I named a variable `_cr` and genHair already had one, three times over, in the
shading.** `var` is FUNCTION-scoped, so a variable written inside a `back`-only branch
silently overwrote one read on every facing. city_cast_gate went red on the FRONT view for
a change that cannot touch the front view. **A back-only guard is not a back-only change if
the names are shared.** Every name the block introduces is prefixed `_nk` now.

## WHAT IS LEFT, AND IT IS HIS ORIGINAL COMPLAINT
**E and W are now the worst angle: 0.300 against 0.452 head-on, 34% less legible, 18 and 19
same-shape pairs.** Same shared cause (the `prof` branch of the same line). That is
CHARACTER's P0 and it is now a number that can be closed: raise E and W, then raise the
pins in `gates/hair_eight_facings_gate.js`.

## WHERE HE SEES IT
CHARACTER tab, and anywhere a person walks away from him in the city. LOOK tab: the hair
reference sheet and ONE HAIRCUT EIGHT WAYS are retaken on this build.

## PROOF
    node gates/hair_eight_facings_gate.js    19/0  NEW; control: put the flat nape back
                                             and it goes red seven ways
    node gates/hair_gate.js                  39/0
    node gates/hairline_gate.js              12/0
    node gates/hair_graveyard_gate.js        13/0
    node gates/portrait_haircut_gate.js      12/0
    node gates/face_maker_gate.js            13/0
    node gates/craft_law_gate.js             39/0
    node gates/clothes_4x_gate.js            13/0  448/448 shapes scale; 123 hair/back
                                             hashes re-pinned with the reason logged
    node gates/talking_portrait_gate.js      27/0
    node gates/family_gate.js                15/0
    node gates/facing_gate.js                 7/0
    node gates/structure_gate.js            134/0
    node gates/runway_gate.js                82/0
    node gates/look_gate.js                  24/0  9 pictures retaken
    node tools/bohemia_hair_eight_facings_9_6_26.js   the full pair tables

## ROUTED
- **CHARACTER, P0:** east and west. His 8/20 words, now with a number and a pinned floor.
- **THE PLUMBER:** `city_cast_gate` B6 is FLAKY. Four runs on unchanged origin/main: three
  red, one green. Four runs on this build: two red, two green. It compares a freshly
  rendered neighbour against the baked cast canvases and they do not always agree. It cost
  this round twenty minutes of chasing a regression that was not there.

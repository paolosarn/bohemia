# EAST AND WEST, ANSWERED
COOK (16, the Production Artist), VAMILY [runway hair], 9/6/26. Round 3 of HAIR-TO-THE-CARD.

## THE THING THIS CLOSES
8/20/26, killing 13 of 15 haircuts in one sitting:

> "You really need to tell the character chat that east and west hairstyles look like
> absolute dog shit across the board"

The verdict record calls that ONE RENDER DEFECT JUDGED THIRTEEN TIMES, routes it to
CHARACTER as P0, and holds 21 more haircuts off a ballot until it is fixed. It stayed open
for sixteen days because there was no number: nobody could say what "fixed" looked like.

    E  0.300 legibility, 18 of 55 pairs indistinguishable   ->   0.338, 8 of 55
    W  0.302 legibility, 19 of 55 pairs indistinguishable   ->   0.344, 7 of 55

The profiles were 17% less legible than the other six facings. They are 6% now, and they
have gone from the worst angles in the game to better than the back three.

## HOW ROUND 2 GOT HALF OF IT
Round 2 built the ruler (for every PAIR of canon cuts on every facing, the share of hair
pixels exactly one of the two has) and found the diagnosis had been aimed at the wrong
angle: the BACK three were a whole tier below the profiles, 0.220 against 0.300, with 33
of 55 pairs the same shape. One line caused it:

    var sideBot=(back||prof)?Math.max(hBot,_styleBot):_styleBot;

Every cut shorter than the skull is forced down to the skull base, and nine of eleven are
shorter. The fix was to give each cut back the thing the same block of code says names it:
**its neckline.** NE 0.220 -> 0.272.

**That line says `back||prof`, and round 2 answered only the `back` half.**

## THE PROFILE TABLE SAYS IT IN THE PLAINEST WAY THERE IS
Every collapsed pair was a SHORT or MID cut. The only two that stood clear were the only
two longer than the skull.

    DRY TAPER / DEEP TAPER        0.136        ROPE LOCKS / DUST WEAVE      0.505
    CURTAIN CUT / HEAVY FRINGE    0.137        SHORT ROPES / LAYERED FALL   0.475
    SHAG / COIL CROWN             0.152        TEMPLE TAPER / ROPE LOCKS    0.446
    TEMPLE TAPER / DRY TAPER      0.157        DUST WEAVE / LAYERED FALL    0.445

Same signature the back had. Length is the only thing that survives the clamp, so the nine
short cuts come out as one shape and the two long ones are the whole of the variety.

## WHICH EDGE, AND IT IS NOT BOTH
Side-on you are looking ALONG the head. The hair's FRONT edge is the hairline over the
face and `_pHair` already owns it — correctly, and it is the same for every style because
every style sits on the same skull. **The BACK edge is the neckline.** It runs up behind
the ear and it is exactly what a barber cuts.

So in profile the inset lands on the AWAY side only, read off `_fFront.dir` — the same
fact `_pHair` reads to know which way he is looking. Insetting both sides would eat into
the hairline on the one facing where the face is half the head.

**One computation, two applications.** Where the line starts, how hard it closes and how
far fullness holds it off the neck are IDENTICAL to the back's, because it is the same
haircut. Only which edges it lands on differs: both on a back facing, the away one in
profile. This file's own idiom for that is at `sideBot` and the fade: "It is not a copy
any more, it IS sideBot — one edge, so the two can never disagree."

## WHERE THE EIGHT FACINGS STAND NOW

    facing   legibility   same-shape pairs of 55      before this round
    S          0.459        1
    SE / SW    0.452        2
    W          0.344        7                         0.302, 19
    E          0.338        8                         0.300, 18
    N          0.276        23
    NE / NW    0.272        25 / 26

The floor is the back three, and the pair holding all three down is the same one:
**SHORT ROPES against DUST WEAVE at 0.080** — locs against a braid, told apart by texture
from the front and by nothing at all from behind. That is the next thing to raise.

## THE COST, AND IT IS NARROW
50 of 1744 pinned 56px hashes moved: 25 hair shapes on E and the same 25 on W. The other
16 resolve to no inset and did not move. S, SE, SW, NE, N and NW did not move a pixel.
Logged in `gates/clothes_56_pin.txt` with the numbers and the reason, per that file's own
rule. Claim 1 of the 4x law is 448/448 — one shape at both scales.

## PROOF
    node gates/hair_eight_facings_gate.js    19/0   control: remove the profile half and
                                             E and W go red on all four of their pins
    node gates/hair_gate.js                  39/0
    node gates/hairline_gate.js              12/0
    node gates/hair_graveyard_gate.js        13/0
    node gates/portrait_haircut_gate.js      12/0
    node gates/face_maker_gate.js            13/0
    node gates/craft_law_gate.js             39/0
    node gates/clothes_4x_gate.js            13/0   448/448 shapes scale
    node gates/talking_portrait_gate.js      27/0
    node gates/family_gate.js                15/0
    node gates/facing_gate.js                 7/0
    node gates/structure_gate.js            134/0
    node gates/runway_gate.js                82/0
    node gates/look_gate.js                  24/0
    node tools/bohemia_hair_eight_facings_9_6_26.js --facing E    the full pair table

## WHERE HE SEES IT
CHARACTER tab, and any citizen standing side-on to him in the city. LOOK tab: HAIR IN
PROFILE, the hair reference sheet and ONE HAIRCUT EIGHT WAYS are all retaken on this build.

## ROUTED
- **CHARACTER:** the 8/20 P0 is answered as a number and pinned. The 21 haircuts that
  verdict held off a ballot are no longer blocked by east and west. **This does not
  re-open the 13 kills** — GRAVEYARD IS FINAL, and a fresh cook answering those slots is a
  different thing from reviving them.
- **THE PLUMBER:** `look_gate` clocks a picture by FILE MTIME, so 44 pictures the change
  cannot touch went stale and had to be re-shot to get green. Proven on unchanged
  origin/main: move only the timestamps and it calls all 52 stale. Third round in a row
  this has cost real time.

# THE GATE WAS GREEN AND WRONG FOR EIGHT DAYS, AND BOTH HAIR SURFACES WERE THE WORST IN THE GAME

8/6, CHARACTER lane.

---------------------------------------------------------------------------
## THE COMPLAINT, AND HOW I KEPT ANSWERING IT

Paolo, 8/2, in caps:

    "THE HEAIRSTYLES EAST AND WEST ARE STILL DOGSHIT LIKE CMON MAN. LIKE ALL OF
    THEM FR. AND IN THE UI THEY ARE SO FUCKING TINY I CANT TELL SHIT"

Three rounds of hair verdicts said a version of that. I answered all three by
redrawing hair pixels: new side projection, crest handling, fall-behind-the-head,
halved volume. Round after round he said better, not close.

**I never measured the box the hair was being displayed in.**

---------------------------------------------------------------------------
## AND SOMEBODY ALREADY TRIED, AND IT DID NOT TAKE

Paolo, 7/29: *"make those fixes then make those fixes forever please."* A session
sized every character canvas to a tidy multiple of its backing store — `#charCv`
336, `.g8c` 112, `#portraitCv` 128, `.cloBig` 168, `.cloCv` 56 — and wired
`canvas_scale_gate.js` to assert those ratios forever.

**The gate has been green every run since. Every one of those canvases is still
fractional.**

`canvas_scale_gate` asserts on `sx`, and `sx` was
`getBoundingClientRect().width / backing`. **That rect is the BORDER box.** The
alpha sets `*{box-sizing:border-box}` globally and every one of those canvases
carries a 1–2px border, so a declared 336 puts the bitmap in **334**.

Measured 8/6 on the CONTENT box, on a real iPhone-portrait DPR-3 browser:

    #charCv     112 backing -> 334 content   css x2.9821   glass x8.9464
    #portraitCv  64 backing -> 124 content   css x1.9375   glass x5.8125
    .cloBig      56 backing -> 166 content   css x2.9643   glass x8.8929
    .cloCv       56 backing ->  52 content   css x0.9286   glass x2.7857
    .g8c        112 backing -> 110 content   css x0.9821   glass x2.9464

**NEAR-INTEGER IS WORSE THAN OBVIOUSLY WRONG.** A ratio of x2.9821 does not
produce a visibly broken image; it produces ONE anomalous pixel column every N.
It survives being looked at, which is exactly why it survived eight days and a
gate written to catch it.

The sizes chosen on 7/29 were RIGHT. Only the box they were applied to was wrong.
The whole correction is that a declared width must carry its own border: 336
content with a 1px border is declared **338**.

---------------------------------------------------------------------------
## AND THE TWO WORST SURFACES IN THE GAME WERE BOTH HAIR

Neither was in the 7/29 list. Both are mine, both were built for judging hair,
and both were anonymous canvases that reported as `(anon)` — so no gate could
have named them even if one had tried.

    hair PICKER tiles   112 backing ->  64 content   glass x1.7143
    hair SPIN bar       112 backing -> 168 content   glass x4.5000

**x1.7143** means a source pixel is ONE device pixel here and TWO right beside
it — on the tiles used to *choose* a hairstyle. **x4.5000** is a dead half
pixel, so every other source column is doubled — on the bar built specifically to
*judge* hair across 8 facings.

`image-rendering:pixelated` was set on both, so nothing was blurred. It was
UNEVEN. A body absorbs that, because a body is wide flat regions. **HAIR CANNOT
— hair is one- and two-pixel strands, and a strand 1px wide here and 2px there
is a wobbly line.**

The spin bar's cause is worth naming because it will recur: it sized itself
`56 * 3`, assuming the backing store is 56. It is 56 in SD and **112 in HD**,
because `drawChar` Scale2x's. So in HD the real ratio was 168/112 = x1.5. It
sizes off `out.width` now, which is correct in both modes and cannot drift again
when the HD toggle moves.

---------------------------------------------------------------------------
## WHAT THIS MEANS ABOUT THE HAIR VERDICTS

The honest reading of three rounds of rejections: **the hair may well have been
fine and the viewer was lying.**

That does NOT make the verdicts wrong. What he saw WAS bad, and killing it was
correct every time. It makes the FIX wrong. And the 7/29 session and I made the
same mistake in two different directions — it fixed the surface without checking
the measurement, I redrew the art without checking the surface.

VERIFY ON THE REAL SURFACE means the surface the pixels actually land in.

---------------------------------------------------------------------------
## THE RESULT

    CONTENT box = backing store x an INTEGER

    #charCv/#animCv   336 declared -> 338    content 336   glass x9
    .g8c              112 declared -> 114    content 112   glass x3
    #portraitCv       128 declared -> 132    content 128   glass x6
    .cloBig           168 declared -> 170    content 168   glass x9
    .cloCv             56 declared ->  60    content  56   glass x3
    hair picker tile   66 declared -> 114    content 112   glass x3
    hair spin shot    56*3 -> backing*2      content 224   glass x6

    18 of 21 canvases fractional  ->  4, and all four belong to combat and city.

`.cloCv` had a second bug found while measuring: `.cloCv{border:1px}` against
`.cloCv.on{border:2px}`. Under border-box, **selecting a facing shrank its sprite
54 -> 52 and resampled the whole thumbnail at the moment you tapped it.** Now 2px
in both states, colour-only on select.

Both hair surfaces also get bigger, as a consequence of rounding to the nearest
legal size rather than a redesign — but it does answer "SO FUCKING TINY" for free.

---------------------------------------------------------------------------
## THE MACHINE

`tools/bohemia_canvas_scale_audit.js` now reports the CONTENT box (`kw`/`kh`,
border and padding subtracted) and `sx`/`sy` use it. `cw`/`ch` stay the border
box so nothing reading those fields changes meaning.

`gates/canvas_scale_gate.js`: the two hair surfaces adopted, and **two new
assertions per surface** — `not MINIFIED on the glass` (an integer below 1 is
still an integer, and scaling a sprite down deletes rows outright), and
`measured on the CONTENT box, not the border box`, which fails if the audit ever
regresses to dividing by the border box again. **That last one is the assertion
this whole finding exists to install:** without it, every other check silently
starts grading the wrong number, which is precisely how 7/29 stayed green.

**52 passed, 1 failed.** The one failure is NOT mine and I proved it: stashing my
entire change set and running the gate on clean `origin/main` gives `28 passed,
1 failed`, the same failure. The CITY lane set the builder overview to
`pixelated` while their own gate still asserts it must be `auto` (the gate's own
comment says Paolo approved `auto` there and that the direction is locked). That
is a contradiction between the city lane's code and the city lane's gate. **NOT
MINE TO RESOLVE** — flagged, not touched.

`tools/bohemia_pixel_snap_look.js` does what a scale number cannot: screenshots
the three surfaces and asserts no container overflows, because seven elements got
wider inside flex/wrap containers on a 390px phone and an integer scale that pans
the page sideways is not a fix. **No container overflows.** PNGs in
`records/pixelsnap/`.

Its own first run screenshotted the ALL-8 gallery with the gallery toggled OFF —
it clicked `#grid8Btn`, and the gallery is already open on load, so the click
closed the one thing the probe exists to check, and the empty shot looked like a
perfectly normal anim tab. It asserts the state now instead of toggling it.

---------------------------------------------------------------------------
## A CLAIM I MADE AND THEN KILLED

My first draft called `.g8c` and `.cloCv` **MINIFICATIONS** and said the gallery
was "throwing away a quarter of every row and column." **False, and I caught it
in the mutation test rather than by being careful.**

The browser composites backing store straight to device pixels in ONE resample,
and that resample is css x0.9821 × DPR 3 = **x2.9464 — an upscale.** Nothing was
deleted; it was unevenly duplicated. "Deleted pixels" was a scarier story than
the true one, and a scarier story is not a better one. The gate asserts
`glass >= 1` separately so a genuine minification would still be caught.

---------------------------------------------------------------------------
## WHAT THIS DOES NOT CLAIM

**It does not claim the hair is now good.** It claims the hair is finally being
shown to him at the size and sharpness it was drawn at.

**NO NEW HAIR WAS COOKED.** Three fixes from the last round are still sitting
unthumbed, and STOP PRODUCING says a fourth version of anything is the tell that
I already failed. The thing to judge is whether these surfaces read right at the
new sizes — the numbers are the machine's job and they are green.

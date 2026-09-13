# THE RINGING PHONE WENT GREY, AND FOUR MORE CHECKERS WERE LYING (RUN, 9/13/26)

VAMILY `[reds mine]`, round two. The row named FIVE red gates. It was SEVEN, and
the seventh was the only one where the game was actually broken.

    COMBAT RUNS     lying checker   (file:// origin)          fixed
    DEMO CURRENT    lying checker   (44px on an SVG group)    fixed
    CURRENT SLICE   already green                             nothing to do
    ENEMIES EXIST   lying checker   (arrow glyph in text)     fixed
    STRANGER OPENS  lying checker   (both of the above)       fixed
    PAD SAYS        lying checker   (SVG group again)         fixed
    FIRST MORNING   *** A REAL BUG ***                        fixed in the game

## HOW THE COUNT WAS WRONG

The five came from COMBAT re-running a list on a clean main. I only found the
other two because I ran the suite on the MERGED tree before pushing, and it walked
past two more of this lane's gates on the way. A handed-over list is a starting
point, never the boundary.

## THE SIXTH: PAD SAYS, SAME FAMILY AS THE OTHER FOUR

It measured `borderRadius`, `width`, `color` and `textContent` on the walk pad to
prove the pad tells you what a press is about to do. On 9/7 another lane rebuilt
the pad into an SVG ring of eight `<g>` wedges, and **none of those four
properties applies to an SVG group**, so it read `0px` and empty strings and
reported the signifier dead. It was never dead. The rebuild kept the meaning on
purpose and says so in its own comment: *"the shape is drawn twice, one triangle
for walking, two stacked for travelling, and the meaning the other lane built is
kept exactly."*

It asks the pad what it DRAWS now: `.pseg` is the wedge face, `.parr` the single
arrow, `.parr2` the double, and `.mapmove` swaps them.

**One leg of the original three really is gone and it is written in the header
rather than dropped.** "Round thumbstick becomes a square map tile" cannot happen
on a ring of wedges. Dropping to two signals would be the exact sin this round is
about, so the third leg is a DIFFERENT real change: the wedge face cools with the
arrow on it (`#1e1a13` to `#12161b`). **12/0 healthy. Mutation:** delete the three
`.mapmove` rules so the pad stops saying anything, and the four reds are exactly
GLYPH, WEIGHT, FACE and ALL-THREE-AT-ONCE.

## THE SEVENTH: THE GAME REALLY WAS BROKEN, AND IT IS A DEMO BLOCKER

FIRST MORNING guards backlog row P0-MORNING, written 8/24 off this lane's own
demo notes:

> *"tapping ONLY the obvious primary button goes GET UP -> SLEEP -> DAY 2 and
> never plays anything. The day's work is behind the PHONE, and the thing pointing
> at it is one unread badge. A TESTER CAN FINISH THE DEMO WITHOUT EVER MEETING THE
> GAME."*

The 8/25 fix made the ringing phone wear the gold fill the opening's WATCH button
already teaches, and **hid the unread dot on purpose** -- two signifiers for one
fact is how a screen gets noisy, and the lit chip was supposed to be doing the
shouting.

**It stopped going gold, so the phone ended up with no mark at all.** Measured on
the served alpha, the first morning, every control ranked by what its pixels do:

    rungbtn   33  = fill 8.8  border 17  ink 6.2  area 0.6   44x12
    workbtn   33  = fill 8.8  border 17  ink 6.2  area 0.7   54x12
    musbtn    32  = fill 8.8  border 17  ink 6.2  area 0.4   27x12
    savebtn   32  = fill 8.8  border 17  ink 6.2  area 0.3   24x12
    phonebtn  32  = fill 8.8  border 17  ink 6.2  area 0.4   27x12
    sleepbtn  32  = fill 8.8  border 17  ink 6.2  area 0.4   27x12
    bikebtn   32  = fill 8.8  border 17  ink 6.2  area 0.3   24x12

**Seven chips with identical pixels, separated only by how many letters the word
has, and one of them is the game.** SLEEP tied the phone exactly, which is the
8/24 defect word for word. This was WORSE than the state the row was written to
fix, because back then the phone at least had a badge.

### THE CAUSE, AND NOBODY DID ANYTHING WRONG

UI's 9/11 no-slop round gave every chip one body in one rule, which is right, and
it needs `!important` to beat thirteen older per-chip rules, which is also right:

    #musbtn,#savebtn,#phonebtn,...{background:var(--skin-chipface)!important}

`#phonebtn.ring` carried no `!important`, so the skin stamped the gold out. The
lit chip lost, the badge stayed hidden because `.ring` was still applied, and the
one control that starts the game went grey and silent.

### THE FIX IS THREE WORDS AND NOTHING GREW

`#phonebtn.ring` is id+class, so it is **more specific** than the skin's
`#phonebtn`. Adding `!important` to the fill and the ink makes it win on
specificity no matter which stylesheet is appended last. The skin keeps its rim,
base and under-shadow; only the colour comes back. `#outfitbtn.ring` reuses the
same look on purpose and had the same wound, fixed the same way.

**NOTHING WAS MADE BIGGER.** The phone is still 27x12. Paolo's 9/6 ruling -- *"for
the run right now make all the UI 50% smaller, I don't give a fuck"* -- is
untouched, which matters because earlier this same round I caught myself growing
the walk pad to satisfy a different gate and had to take it back out.

MEASURED AFTER:

    phonebtn  74  = fill 71  border 1.7  ink 0.6  area 0.4   27x12  gold
    GET UP    43
    everything else 32 or less

**THE FIRST MORNING: 19 passed, 0 failed.**

## THE LESSON, AND IT IS THE OPPOSITE OF THE OTHER SIX

Six of seven were gates that hardcoded the shape of a thing instead of asking it
what it is. The seventh was a gate that had asked honestly all along, kept asking
after somebody else's correct change, and was right. **A lane that starts assuming
its checkers lie will eventually ignore the one that is telling the truth.** The
only defence is that the question is always the same one and it is always asked
fresh: measure it, then decide.

## RESULT

    PAD SAYS 12/0 (mutation 8/4)   FIRST MORNING 19/0
    one game change: three !important, on two chips, in the walked city and
    therefore in the demo after a re-cut. Nothing resized.

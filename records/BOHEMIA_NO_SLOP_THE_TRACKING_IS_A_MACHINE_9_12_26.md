# NO SLOP, ROUND FOUR: TRACKING IS A PROPERTY OF THE MACHINE
UI lane (11), row [no slop] -- THE-UI-MUST-NOT-LOOK-VIBE-CODED. 9/12/26.
Law: laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md
Sheet: slices/BOHEMIA_HOW_A_LABEL_IS_SPACED_9_12_26.html
Rounds one to three: records/BOHEMIA_NO_SLOP_THE_FIRST_COUNT_9_11_26.md,
records/BOHEMIA_NO_SLOP_THE_REGISTERS_9_12_26.md,
records/BOHEMIA_NO_SLOP_WHERE_THEY_LIVE_9_12_26.md

## WHAT LANDED
Spaced caps on the walked city: **80 -> 0**. Eighty hand-typed tracking values -- 58 of
them the identical `1px` -- are now THREE registers, one per face register, and the number
under each comes from a machine rather than from taste:

    --track-casing:.4px    a cut stencil plate or a struck stamp. Letters sit at the
                           plate's own pitch; nothing tracks them out, so this is glyph
                           fitting. It is the .4px the chips already shipped on in round
                           three, so the registers agree with what is on screen.
    --track-screen:1px     a character-cell readout. The HD44780 cell is five dots wide
                           inside a grid with a one-dot gutter, so the gap is the gutter.
                           REAL, so it STAYS COUNTED -- the ruler is not told to forgive
                           it. No element claims this register yet.
    --track-body:0         writing. A person writing does not space out their letters.

The skin's own `--skin-chiptrack` now READS `--track-casing` instead of holding a second
copy of the number, so there is genuinely one place, not two that agree today.

DIRECTION's rule this implements: *a label is spaced only if the stencil that painted it
was.*

## THE PART THAT MATTERS MORE THAN THE NUMBER
**I could have taken 80 to 0 without changing one pixel, and the ruler would have applauded.**
The spaced-caps row only matched a value starting with a digit. `letter-spacing:2px` counted;
`letter-spacing:var(--track,2px)` did not. One find-and-replace, same screen, and the record
would have claimed the slop was cut. That is the exact move this lane has banned itself from
(never tune the ruler so a number falls), and it was available by accident rather than by
temptation, which is worse.

So the ruler was fixed FIRST, before a single tracking value was touched, and it was fixed
twice, because the first fix had the same hole one level down:

1. **A var is not its name.** `inline()` now resolves what a var would paint before counting.
2. **And a fallback is not the value.** Resolving `var(--track,.4px)` to `.4px` is only right
   while the token is DECLARED `.4px`. Set `--track-casing:2px` and every label on screen goes
   wide while the ruler keeps reading the stale fallback at the call sites. So declarations are
   read first and they win. Where a token is declared more than once with different values --
   the skin does this deliberately, one act per value -- there is no single answer from the
   source, so the fallback is kept and that limit is written into the file rather than guessed.

**PROVED, NOT ASSERTED, BOTH WAYS.** A probe of three labels written `2px`,
`var(--t,2px)` and `var(--t,var(--u,3px))` paints three spaced labels: the old ruler counted
ONE, the new one counts THREE. And on the real surface, setting `--track-casing:2px` brings
all **91** hits straight back, then `.4px` returns them to **0**. The drop is not hiding
anywhere.

## THE COUNT MOVED IN BOTH DIRECTIONS, AND THE RISE IS THE HONEST PART
Seeing through the tokens also revealed real hits that the face registers had been hiding.
Monospace on the walked city went **44 -> 66** and on the alpha shell **160 -> 170** the
moment `var(--face-body)` resolved to what it actually paints. Nothing got worse; the ruler
got less wrong. Any comparison against rounds one to three must use these numbers, not the
old ones.

    tell                walked city   alpha shell    total
    named fonts                   0             3        3
    monospace                    66           170      236      (was 44 / 160, ruler fixed)
    1px borders                  56            86      142
    rounded corners              60            76      136
    gradients                    11            21       32
    glow                          9             3       12
    spaced caps                   0            90       90      (was 80 on the city)
    emoji in controls             2            36       38
    ALL TELLS                   204           485      689

A first draft of the comment in the tool claimed the total had gone up when the var fix
landed, as evidence the hole was real. **It had not**, and that claim is now removed. The
repo's one var-wrapped tracking value today is `.4px`, under the threshold either way. The
hole is real and the probe proves it; a lie sitting in the evidence would have been worse
than the hole.

## AND A REGRESSION OF MY OWN, FOUND BY RUNNING MY OWN GATES
`gates/phone_readable_gate.js` was **17 ok, 2 failed ON MAIN** before this round -- measured
on a clean `origin/main` worktree, so it was not mine this round but it was mine.

**[phone readable] shipped 9/6 and [half size] broke it on 9/7, both this lane's rows.**
The text-size setting raises every word to a floor by writing a plain inline `font-size`,
which beats a normal stylesheet rule and loses to an important one. On 9/6 nothing on the
surface used `!important` on font-size, so it was correct for exactly one round. Then his
halving order shipped as `.uihalf{font-size:5px!important}`, and from that round on the
largest text setting in the game did nothing at all to the walked city while the shell
obeyed it. Measured: shell 19px, city 5px, against a 12px floor.

Fixed: the floor is written with `important`, and the restore puts back the priority as well
as the value (without that, `.style.fontSize` cannot clear a declaration written as important
and every raised word would stick at the floor forever). **19 ok, 0 failed.**

THE LESSON, AND IT IS THE ONE WORTH KEEPING: `records/BOHEMIA_HALF_SIZE_WHAT_IT_COST_9_7_26.md`
wrote down that the 44px TAP floor yielded to his order, by a narrow named exemption. It never
noticed the TEXT floor had yielded too. **A cost you write down is paid. A cost you do not
notice is a regression**, and it sat on main for five rounds with a green half-size gate beside it.

AND THE FIX WAS INVISIBLE UNTIL THE DEMO WAS RE-CUT. The gate loads BOHEMIA_DEMO.html, which
is cut from the alpha, so the first run after the fix still measured 5px and looked like the
fix had failed. It had not; it was not there yet. The board already says a row is not shipped
until it is in the walked surface AND the demo -- this is what that costs when you forget.

## WHAT IS LEFT ON [no slop], WHICH IS WHY THE ROW STAYS CLAIMED
Its ship test is that NONE of the tells survive. On the walked city: monospace 66, rounded
corners 60, 1px borders 56, gradients 11, glow 9, emoji 2. Spaced caps and named fonts are
the two that are done.

Monospace is still blocked on the same thing it was blocked on in round two: **the ruled faces
are not in this repo**. A DIN 1451 stencil cut and an HD44780 ROM cut are what the casing and
screen registers are supposed to resolve to, and all three registers resolve to the game's own
embedded face today. DSEG is free under the OFL and is the easiest real one to land; the
HD44780 cut can be drawn from its published 5x8 grid; the DIN stencil needs a real font file.
That is DIRECTION's and COOK's to land, and it is named in the handoff.

## PROOF
    node tools/bohemia_count_the_tells.js            spaced caps 80 -> 0 on the walked city
    node tools/bohemia_count_the_tells.js --where    whose panel every remaining hit is in
    node gates/phone_readable_gate.js                19 ok, 0 failed (was 17/2 on main)
    node gates/half_size_gate.js                     7 ok, 0 failed
    node gates/city_rail_gate.js                     8 ok, 0 failed
    node gates/pad_ring_gate.js                      19 ok, 0 failed
    node gates/phone_object_gate.js                  18 ok, 0 failed
    node gates/top_bar_gate.js                       12 ok, 0 failed
    node gates/feed_gate.js                          15 ok, 0 failed
    python3 gates/readable_ruler_gate.py             7 ok, 0 failed
    node gates/alpha_loads_gate.js                   20 passed, 0 failed

## AND THE SECOND RED WAS MY GATE BEING OUT OF DATE, NOT THE GAME BEING BROKEN
`gates/thumb_gate.js` was **14 ok, 1 failed on clean origin/main**. The failing leg demanded
that the demo's opening overlay carry at least two buttons -- WATCH and NOT NOW, "the first
two buttons of the whole game". I nearly filed it as RUN's and moved on, because it is their
surface and it provably predated this round. **Measuring it instead of routing it was the
right call.**

The chain, each step measured rather than reasoned: the overlay is never visible (sampled
every 2s for 20s, hidden every time, so not a timing flake) -> `openShould()` is TRUE and
`CITY_BUSY` is false, so the game wants to offer it -> the element's inline style says
`display:block` while its COMPUTED display is `none` -> one rule wins:
`#openInvite{display:none !important}` -> that rule is written by
`tools/bohemia_cut_the_demo.js`, **deliberately, with eleven lines of reasoning**: the
deferred cold-open scene never ends (measured: same pixels for eighty-five seconds, still
mid-flight at 128), so the demo stops offering a door to a scene that hangs. Hidden from the
demo side only; the workshop keeps the invite and the scene.

So the game was right and my gate was stale, and a red that is only the gate being out of
date teaches every reader to ignore the gate.

**IT WAS NOT SOFTENED TO `>= 1`.** The sin the leg was written to catch is real and its own
comment records it: this gate once measured only the city frame while the first buttons
anybody touches sat in the OUTER document, unmeasured, at 57% of the minimum. So the leg now
asks the question it was always really asking -- *does the sweep reach the outer document*,
and *if the invite is on screen, are ITS buttons in what got swept* -- which hiding the invite
cannot pass by accident, and which measures those two buttons again with no edit here the day
the scene is fixed. **16 ok, 0 failed**, and mutation-proved two ways: stop sweeping the outer
document and it fails; force the invite visible while its buttons go unswept and both new legs
fail, reporting the two buttons it can see.

NOTE, and it is the same lesson twice in one round: `#openInvite{display:none !important}`
beating an inline `display:block` is the identical mechanism as `.uihalf{font-size:5px
!important}` beating an inline font-size. One was a deliberate override doing its job and one
was an accident eating a feature, and **nothing about the CSS tells them apart** -- only
opening the file that wrote the rule does.

## THE PICTURES OF THE SURFACE WERE OLDER THAN THE SURFACE
`gates/look_gate.js` went red on 48 of 52 pictures being more than six hours behind the file
they photograph. It clocks each picture's mtime against its surface, and all 52 are clocked
against the two files this round edited.

A clean `origin/main` worktree said GREEN, and **that green was worthless**: a fresh checkout
gives every file the same mtime, so nothing can be six hours behind anything. Touching both
surfaces there still said green. The red is honest -- this session has run longer than six
hours, so pictures taken before it genuinely predate the build -- and the clean-worktree test,
which is this lane's standing way of proving a red is not mine, **does not work on a check
that reads mtimes**. Worth knowing before the next lane trusts it on the wrong kind of gate.

Cleared the way the gate itself prescribes, since the manifest names the exact command for
every shot: all 52 retaken off the live build. **24 ok, 0 failed.** Published surface still
247 MB against the 260 MB cap.

## THE SUITE, BEFORE AND AFTER
    clean origin/main   7 red: DISTRICT FILL, SUITE FINISHES, MANDATE FACE, QUEST PLACEMENT,
                               VOICE, INTERIORS, CANVAS MEMORY
    this tree, first    8 red: the same 7, plus LOOK
    this tree, shipped  7 red: the same 7, none of them this lane's and none of them new

The seven are other lanes' surfaces and are untouched here.

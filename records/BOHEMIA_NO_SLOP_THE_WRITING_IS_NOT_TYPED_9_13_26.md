# NO SLOP, ROUND SIX: PROSE IS NOT A SCREEN, AND THE TEST THAT SAID SO WAS READING THE WRONG FONT
UI lane (11), row [no slop] -- THE-UI-MUST-NOT-LOOK-VIBE-CODED. 9/13/26.
Law: laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md
Ruling: records/BOHEMIA_THE_FONT_RESEARCH_9_11_26.md (DIRECTION 9/11), sec 2-4, ROUTED to this row
Sheet: slices/BOHEMIA_FIVE_WAYS_THE_WRITING_READS_9_13_26.html
Round five (the screen face): records/BOHEMIA_NO_SLOP_THE_SCREEN_HAS_A_FACE_9_13_26.md

## WHAT LANDED
    monospace, the walked city    66 -> 40
    ALL TELLS, the walked city   204 -> 178

**BohemiaBody**: 108 glyphs, 2.2 KB woff2, drawn by the same tool as the screen face. The day
card and the talking card carry it, and everything written on them inherits it.
`gates/rom_face_gate.js` is 14/0, mutation-proved three ways.

DIRECTION's ruling is one sentence -- fixed pitch is legal ONLY where the in-world device is a
character-cell screen -- and prose is the other end of it. The day card and the talking card
are the two surfaces in this game that are pure writing, and they held 30 of the walked city's
66 monospace hits. **Nobody writes on a grid**; that is the tell in five words.

## IT IS THE SAME CUT, AND THAT WAS A REUSE DECISION, NOT A SHORTCUT
REUSE-FIRST is a law here with a gate behind it. The cell glyphs were already drawn on a 7-row
cap and a 5-row x-height, which is the shape a small proportional body wants. What made them
monospace was never the drawing -- it was that every glyph was handed the same five columns. So
the body face **trims each glyph to its own ink and gives it its own advance**, over a table
that already existed, instead of ninety-five new drawings.

**BUT TRIMMING ALONE WOULD HAVE SHIPPED A LIE, AND THE MEASUREMENT CAUGHT IT.** The first build
came out with **77 of 107 glyphs still five columns wide**, because the cell cut fills five
columns by construction -- it has no choice. A face where nearly every letter is the same width
is a grid with a few narrow letters in it, and calling that proportional would have been exactly
the kind of claim-with-nothing-behind-it this row keeps catching in itself. So the round
lowercase was redrawn at four. Now: caps 5, lowercase 4, i 1, l 3.

    width spread, dot columns -> glyphs    {0:1, 1:4, 2:6, 3:12, 4:24, 5:61}

## AND ITS PIXELS TOUCH, WHICH IS NOT A STYLE CHOICE
The screen face leaves a gutter around every lit cell because a character-cell display is made
of LAMPS and the dark between them is real. Body text is not lamps. It is ink on a board or
paint through a stencil, and ink does not leave a gap between the squares of one letter -- it
runs together, which is why a printed letter reads as one stroke. So the body cell is solid and
its neighbours touch. Same drawing, same grid, two faces that end up looking properly unrelated
because the two things they are made of are unrelated.

Measured, on the same sentence at 11px: the body face takes **one line** where the fixed-pitch
face takes **two**.

## THE FIRST ATTEMPT WAS DECORATION, AND ONLY THE REAL SURFACE SAID SO
The obvious move was to point the prose rules at the body register: `#daycardIn .fbnote`,
`.endsay`, the textarea, the teaching line. Done, and the tell count moved, so it looked like
work.

**Then I opened the real card and it was still in the old face.** Asking the live document
which stylesheet rule set its type came back with an **EMPTY LIST**. Those rules are built
inside a JS string that this path never injects, so the prose was inheriting the mono face from
its parent and every one of those edits was decoration over a card that ignored them.

The fix is the one the phone already taught: **the surface carries its own face, and everything
written on it inherits.** `#daycardIn` and `#ctcard` now set `font-family:var(--face-body)`
themselves. That cannot be missed by a rule that did not load.

## THE GATE FOUND A SECOND MISSING GLYPH ON ITS FIRST RUN
Round five's coverage leg -- *does the face cover every character the game actually draws on
that surface* -- was extended to the prose card, and it failed immediately:

    FAIL every character the prose card draws is covered by the prose face (MISSING: ✕ U+2715)

**Every card in this game gets a corner close from `cardShow`, and it is U+2715, not an ASCII
x.** Neither of our faces had it, so that one mark on every panel in the game fell through to
whatever the browser had -- a different typeface on the corner of every card, invisible to the
eye and to any check that reads a stylesheet. Drawn, and green.

That is two glyphs found this way in two rounds (the phone's signal bar was the first). Both
were things a person would not think to put on a list. That is the argument for asking the
renderer what a surface actually draws.

## *** AND THE WORST THING THIS ROUND WAS MY OWN TEST READING THE WRONG FONT ***
The new leg's whole job is to prove the body face is really proportional, measured on the card
rather than believed from a stylesheet. It read:

    cv.font = '64px "' + fam + '", serif';
    const w = ch => cv.measureText(ch).width;
    ... a loop that leaves cv.font on plain serif ...
    return { i: w('i'), m: w('m') }        <- evaluated AFTER the loop

So it measured **serif**, which is proportional, so **it would have passed for every possible
face, including a pure grid**. The leg was green, the numbers looked sensible, and it was
checking nothing.

**It was caught by mutating the body register back to the fixed-pitch face and watching the leg
report the SAME TWO NUMBERS as the healthy run -- 17.78 and 49.78.** Identical numbers under a
mutation are the tell that a check is reading something other than what it names. Fixed by
taking the widths before the loop; healthy now reads 13 and 38 (real numbers, which is its own
proof the old ones were serif's), and the mutant reads 38 and 38 and fails.

A clean answer from the wrong oracle looks exactly like a fact. This lane has now written that
sentence about a ruler, about an attribution heuristic, and about its own gate. **Mutation is
the only thing that has ever caught it.**

## THE GATE, AND ITS THREE MUTATIONS
    1-2. the screen register names a face, and it is NOT the casing face
    3-4. the face loaded and really draws (ten Ms: 240 against 355.67 in the fallback)
    5.   the glass is set in the screen register
    6.   every character the GLASS draws is covered by the glass's face
    7.   a control on the casing is not drawn in the screen face
    8.   a prose card could be opened
    9.   the prose card is NOT in the screen face
    10.  and its face is really PROPORTIONAL: an i is 13 where an m is 38
    11.  every character the PROSE CARD draws is covered by the prose face
    12.  no page error

    collapse the registers to one face      -> 3 legs red
    delete the U+25AE glyph                 -> 1 leg red, and it names the glyph
    body register put on the fixed-pitch    -> 2 legs red (i 38, m 38)
    restored                                -> 14 ok, 0 failed

## WHOSE CALL THE BODY FACE IS, SAID OUT LOUD
DIRECTION's ruling names a POOL to cut the body from: Pixel Operator, m5x7, monogram, LanaPixel
-- OFL/CC0, and **none of them are in this repo**. This face is not one of them. Two OFL pixel
faces do happen to sit on this machine (Silkscreen, Pixelify Sans) and either could have been
embedded, but pulling a face DIRECTION did not name into the game's look is their decision, not
this lane's. Drawing ours asks nobody, carries no licence to honour, and -- this is the entire
point of having built the registers first -- **DIRECTION swaps it for any pool face by changing
one token.**

## WHAT IS LEFT ON [no slop]
    the walked city    monospace 40, rounded corners 60, 1px borders 56, gradients 11, glow 9
    the alpha shell    untouched, 489 -- RUN's surface

The casing register is the last of the three still fixed-pitch; it wants DIN-stencil caps, and
by the same measurement as round five it is not blocked either. After that, rounded corners and
hairlines are the two biggest and neither needs a font at all.

## PROOF
    python3 tools/bohemia_cut_the_rom_face.py   ROM 108 glyphs 2.1 KB; BODY 108 glyphs 2.2 KB
    node tools/bohemia_count_the_tells.js       monospace 66 -> 40, all tells 204 -> 178
    node gates/rom_face_gate.js                 14 ok, 0 failed (mutation-proved three ways)
    node gates/thumb_gate.js                    16 ok, 0 failed
    node gates/feed_gate.js                     15 ok, 0 failed
    node gates/phone_object_gate.js             18 ok, 0 failed
    node gates/half_size_gate.js                 7 ok, 0 failed
    node gates/city_rail_gate.js                 8 ok, 0 failed
    node gates/alpha_loads_gate.js              20 passed, 0 failed
    python3 gates/readable_ruler_gate.py         7 ok, 0 failed

Per board rule 13: that is the PRE-PUSH PASS, green. THE SUITE LINE has not been posted yet
(PLUMBER [suite line] writes the first), so the honest sentence is: **pre-push pass green; full
suite unmeasured since e8226080.**

## NOT MINE, THIRD TIME OF ASKING
`phone_readable_gate` 15 ok 4 FAILED; it was 13 ok 6 on clean origin/main when this lane fixed
the two text-floor legs. The four colour-collision ratchets have not moved in three rounds:
normal 5 against a ratchet of 3, protan 14/13, deutan 12/11, tritan 13/9. Nothing in this round
touches a faction colour. For whoever owns the palette; the row is this lane's OPEN
[colour reaches].

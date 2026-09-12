# NO SLOP, ROUND FIVE: THE BLOCKER WAS NOT A BLOCKER, AND THE SCREEN HAS ITS OWN FACE
UI lane (11), row [no slop] -- THE-UI-MUST-NOT-LOOK-VIBE-CODED. 9/13/26.
Law: laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md
Ruling: records/BOHEMIA_THE_FONT_RESEARCH_9_11_26.md (DIRECTION, 9/11), sections 2-4
Sheet: slices/BOHEMIA_FIVE_WAYS_THE_SCREEN_READS_9_13_26.html
Rounds one to four: BOHEMIA_NO_SLOP_THE_FIRST_COUNT_9_11_26.md, _THE_REGISTERS_9_12_26.md,
_WHERE_THEY_LIVE_9_12_26.md, _THE_TRACKING_IS_A_MACHINE_9_12_26.md

## THE ROUND STARTED BY DISPROVING MY OWN HANDOFF
Four rounds of this row ended with the same sentence: *monospace 66 is the biggest remaining
tell and it cannot fall, because THE RULED FACES ARE NOT IN THIS REPO.* The board grew rule 12
this round -- **a dependency on a line is a premise, not a gate; the lane MEASURES FIRST
whether the blocker is real** -- so I measured it instead of repeating it. It took four checks
and all four said the same thing:

1. **There is already a real face in the repo.** `BohemiaMono` is a 156 KB base64 woff2 in both
   surfaces. Decoded and read: **IBM Plex Mono, OFL, subset to 280 glyphs.** Not a placeholder.
2. **DIRECTION's ruling is not "wait for a font file", it is one testable sentence**:
   *fixed pitch is legal ONLY where the in-world device is a character-cell screen*, and it
   names the phone glass as exactly such a device.
3. **We were in breach of it everywhere.** All three type registers -- casing, screen, body --
   resolved to that one fixed-pitch outline face. A register that resolves to one face
   everywhere is a name, not a system, and nothing in the repo could tell the difference.
4. **The ruling routes this work to THIS row, by name**: "ROUTED -- UI: the vibe-purge row
   builds to section 2-3", and its own licence line says the screen face is
   *"drawn by us from the cell grid"*. It was never waiting on anybody.

So the blocker was a sentence I had written and then kept re-reading. Rule 12 is four rounds
too late for this row and exactly right.

## WHAT LANDED
`tools/bohemia_cut_the_rom_face.py` draws **BohemiaROM**: 106 glyphs on a 5x8 character cell,
built to a real woff2 with fontTools, **2.0 KB** -- smaller than one small PNG. The phone glass
is set in it, and everything on the glass inherits it. `gates/rom_face_gate.js` is 10/0.

**WHAT IT IS, SAID EXACTLY, BECAUSE THE HONEST NAME IS THE POINT.** It is our own cut on the
cell geometry a character-cell display uses. It is **NOT** a copy of the Hitachi HD44780 CGROM
and neither the tool nor the gate nor this record calls it one. The datasheet's pixel data is
not in this repo and could not be fetched (eleif.net is blocked by the egress proxy), so
claiming these were its glyphs would be a claim with nothing behind it -- which is the exact
sentence this lane deleted out of its own evidence one round ago. What IS taken from the
hardware is the part that is a measurement rather than a drawing: five dots by eight, one dot
of gutter, every character the same width because a cell cannot be another width. The lit
cells are drawn as separate squares with the gutter left open, per the ruling's own
"2px dot grid with the dot gaps visible", so at 8px it reads as a thing made of lamps.

## IT ALMOST SHIPPED WRONG TWICE, AND BOTH WERE CAUGHT BY LOOKING
**ONE: A NEW FACE THAT SILENTLY EATS THE TEXT IS A REGRESSION IN A BETTER COAT.** The first cut
used a 1000-unit em, making the advance 0.75em against the 0.6em of the face it replaced.
Measured on the phone's own bar: **96px against 77px for the same sixteen characters, 24.5%
wider**, so the feed's name lost about five characters ("THE VA" where "THE VALLEY" belongs)
and the clock started walking toward the edge. No gate asked about width. A screenshot of the
real phone did. Fixed by sizing the em box, **not** by redrawing: at 1250 units the advance is
0.60em and the cap height 0.70em, which is what was there before. Re-measured: 80px against
77px. The drawing never changed.

**TWO: ONE GLYPH WAS SECRETLY IN THE OLD TYPEFACE.** The phone's signal strength is drawn with
U+25AE, which the first cut of the face did not have, so that one mark fell through to the
outline face and the 8px status bar was **quietly two typefaces wide**. Nobody sees that. Every
gate that reads the stylesheet would call it green, because the stylesheet is correct.

That second one is what the gate is really for, and it is why its key leg asks the question a
person would not think to write. Not *does the face have the characters I remembered* -- that
is a guess, and my guess was already wrong once -- but **does the face cover every character
the game actually draws on that surface**, collected from the live DOM and checked against the
renderer rather than the stylesheet. A rule you can satisfy by remembering harder is not a rule.

## THE GATE, AND WHY EACH LEG IS THE REAL QUESTION
    1. the screen register names a face before any fallback
    2. and it is NOT the casing register's face   <- the whole claim, falsifiable in one line
    3. the face LOADED and DRAWS (ten Ms measure 240 against 355.67 in the fallback), because a
       @font-face that never arrives looks perfectly fine in the fallback
    4. the glass is set in the screen register, so the device carries the face
    5. EVERY character the glass draws is covered by that face (11 distinct drawn, none missing)
    6. a control on the CASING is not drawn in the screen face -- fixed pitch is legal only
       where the device is a screen, so the case must not catch it by sitting next to the glass
    7. no page error

MUTATION-PROVED TWO WAYS, on disk, against the real demo:
    point the screen register back at the casing face  ->  3 legs red
    delete the U+25AE glyph from the face              ->  1 leg red, and it NAMES the glyph
    restored                                           ->  10 ok, 0 failed

## THE TELL COUNT DID NOT MOVE, AND SAYING SO IS THE POINT
    monospace   walked city 66, alpha shell 172   (unchanged)

The screen register keeps its monospace fallback **on purpose** and the ruler keeps counting it,
because a character-cell screen falling back to a fixed-pitch face is the right failure. The
count falls when the CASING and BODY registers stop being fixed-pitch, and that is the next
job, not this one. **What this round bought is not a number, it is that the register system is
now real**: there are two different faces on the surface, a gate fails the moment they collapse
back into one, and the pipeline to draw the next face exists and is proved.

I could have made 66 fall this round by consolidating 66 scattered font stacks onto three
register tokens without changing a pixel. The ruler this row fixed last round resolves
declarations, so it would have counted them anyway -- **the guard written one round ago caught
the shortcut available this round**, which is the best argument for writing guards before you
need them.

## WHAT IS LEFT, AND WHAT IS ACTUALLY NEEDED FOR IT
The casing register wants DIN-stencil caps; the body register wants a proportional pixel body
with real lowercase (DIRECTION's FONT-D pool: Pixel Operator, m5x7, monogram, LanaPixel -- none
in the repo, all OFL/CC0). **Neither is blocked either**, by the same measurement as above: the
tool that drew 106 glyphs on a cell grid draws a proportional face by giving each glyph its own
advance. Body is the bigger win of the two, because "monospace as the default for everything"
is the tell, and prose is where fixed pitch is most obviously wrong -- a person writing does not
write on a grid.

## PROOF
    python3 tools/bohemia_cut_the_rom_face.py            106 glyphs, 2.0 KB woff2, 0.60em advance
    node gates/rom_face_gate.js                          10 ok, 0 failed (mutation-proved twice)
    node gates/thumb_gate.js                             16 ok, 0 failed
    node gates/phone_object_gate.js                      18 ok, 0 failed
    node gates/feed_gate.js                              15 ok, 0 failed
    node gates/half_size_gate.js                          7 ok, 0 failed
    node gates/city_rail_gate.js                          8 ok, 0 failed
    node gates/top_bar_gate.js                           12 ok, 0 failed
    node gates/look_gate.js                              24 ok, 0 failed
    node gates/alpha_loads_gate.js                       20 passed, 0 failed
    node gates/demo_build_gate.js                        25 passed, 0 failed
    python3 gates/readable_ruler_gate.py                  7 ok, 0 failed

## NOT MINE, REPORTED A SECOND TIME
`phone_readable_gate` is 15 ok 4 FAILED here and was 13 ok 6 FAILED on clean origin/main last
round. The two text-floor legs this lane fixed stay green. The four colour-collision ratchets
have not moved and are not this lane's work: normal 5 against a ratchet of 3, protan 14/13,
deutan 12/11, tritan 13/9. Nothing in this round touches a faction colour. For whoever owns the
palette; the row it belongs to is this lane's OPEN [colour reaches].

## AND ONE I CAUSED AND CAUGHT INSIDE THE SAME ROUND
I stamped this build `9/13i` and `9/13i` already belonged to another lane's A CROWD ON YOUR WAY,
which would have put two different builds under one name on his splash -- the one thing the
build stamp exists to prevent. Bumped to `9/13j`. Read the stamp before writing it.

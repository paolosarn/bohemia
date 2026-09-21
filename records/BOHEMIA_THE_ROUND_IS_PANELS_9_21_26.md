# BOHEMIA -- THE ROUND IS PANELS (UI lane 11, 9/21/26, row [cook panels])

Paolo 9/21, rule 22, LOCKED: "I need to be seeing them cooking up more, every time, not
never." Paolo 9/20, LOCKED: "we're gonna be trying to make all the UI look 3-D."
Paolo 9/20, LOCKED: analog horror for every pixel and every sound.
Rule 18 hold: nothing reached the demo or the alpha's play tabs. Everything below is a
sheet, and all five are registered in the VOTE tab.

## 1. WHAT WAS MADE

Five sheets, each panel drawn at 390 px, the real width of his phone, nothing scaled,
each new option shown beside the flat thing it would replace.

| sheet | options | what he is deciding |
|---|---|---|
| `slices/BOHEMIA_FIVE_WAYS_THE_GAME_OPENS_9_21_26.html`   | A now + B,C,D,E | the body of the first screen |
| `slices/BOHEMIA_FOUR_WAYS_THE_FIGHT_READS_9_21_26.html`  | A now + B,C,D   | health, verbs, SHOOT |
| `slices/BOHEMIA_FIVE_WAYS_A_PERSON_TALKS_9_21_26.html`   | A now + B,C,D,E | the only panel allowed to carry prose |
| `slices/BOHEMIA_FIVE_WAYS_THE_VOTE_TAB_SITS_9_21_26.html`| A now + B,C,D,E | the tab itself |
| `slices/BOHEMIA_FOUR_WAYS_A_WORD_IS_STAMPED_9_21_26.html`| A now + B,C,D   | the letters on every button |

Registry: five items appended to `records/target/BOHEMIA_VOTE_REGISTRY.json`, made 9/21,
lane ui, each `show.how: page`.

## 2. THE ARCHITECTURE, WHICH IS THE POINT AND NOT A SIDE EFFECT

`slices/bohemia_ui_3d.css` is the lane's answer to "3-D", written down once so nobody
guesses again. It is not a drop shadow and not a rounded card. It is four things a real
object on a real machine has, and every class in the file is built out of exactly these:

1. a FACE that catches light, from ONE light, always above and left (two lights read as
   a sticker);
2. a LIT RIM on the edge the light hits and a DARK BASE on the edge it misses, a real
   value step, never a grey hairline floating on nothing;
3. a BODY: the line under a panel is the SIDE of the thing, which is why the shadows are
   inset and outset on the same element;
4. a SHORT HARD SHADOW, because the room is small and the light in it is a fixture.

Then it is DELIVERED AS PIXELS, the way the portrait cooks 3-D and eats 2-D: every ramp
in the file is a staircase of hard colour stops, never a blend. Corners are 2px, an
object's corner, never a card's 5. Colours come from the skin's act-one SALVAGE values,
so [skin swap] gets act two by changing values, not by redrawing five private bevels.

Analog horror is at the source, not a filter: the case is a colour an office picked and
never changed, the glass is lit from behind by something still running with nobody left
to read it, the lamp beside the word is ON, and the label was stamped by an authority
that no longer exists. Option D of the talk panel puts a machine between you and a person
standing in front of you, which is the sharpest reading of the law this lane has drawn.

## 3. THE TENSION I DID NOT HIDE, ON THE VOTE TAB SHEET

The game is dark. The judging tools are daylight-readable by standing law, because he
judges on a phone outside. So the prettiest vote-tab option (D, the console, the game's
own case) is the worst one to actually use at noon, and the sheet says so in his words
rather than presenting five equals. B and E keep the paper for reading and make only the
things he presses into objects. My pick, stated on the sheet: E.

## 4. WHAT THE MEASURING FOUND: THE N ON OUR BUTTONS IS AN H

`tools/bohemia_which_letters_are_the_same.js` draws all 26 capitals at the size a surface
really uses and compares EVERY pair. BohemiaCasing, the face on every chip in the game,
at 5 px, dpr 3:

    HN  10.6% of the ink differs   <- the closest pair in the alphabet
    AH  14.0%    NW  15.4%    HM  15.9%    HW  17.3%

The control settles the cause. The SAME 5x8 glyph table is cut three ways:

    ROM    (gutters, no overlap)   HN 21.3%
    BODY   (solid, proportional)   HN 17.3%
    CASING (cells overlap 25%)     HN 10.6%

The table is not at fault. The OVERLAP is: the casing cut draws a 125-unit ink square on
a 100-unit column, so the left stem's ink already reaches into the column where an N's
diagonal lives, and the diagonal fuses to the stem. The letter becomes an H with a fat
shoulder. Same mechanism for W against H and A against H.

The overlap is not a bug, it is what makes the face condensed and heavy, so the answer is
a NUMBER. `tools/bohemia_cut_a_casing_candidate.py` cuts the same face at softer overlaps
WITHOUT touching the shipped file:

    ink 125 (shipped)  HN 10.6%
    ink 115            HN 12.5%
    ink 108            HN 13.4%   <- my pick, on the sheet
    ink 100 (none)     HN off the top ten entirely

Sheet 5 shows all four at real button size. Nothing shipped: rule 18 keeps this lane off
the play surface, and the face is loaded by the walked city and the demo.

## 5. TWO ORACLES LIED TO ME THIS ROUND, AND BOTH ARE WORTH WRITING DOWN

**My own eye, on a squashed picture.** I read "HOTES" and "HAIT" off a screenshot and
decided the face was broken. The screenshot was 860 px wide and the viewer had squashed
it to 156. No five pixel diagonal survives that. The finding turned out to be real, but I
did not know it yet and I nearly reported it on the strength of a picture that could not
have shown it either way.

**A bare number with no population around it.** My first measurement said N and H differ
by 15 to 25 per cent of their ink, and I read that as "fine, the diagonal is there". A
lone number cannot be read: 20 per cent could mean anything. The oracle that works is a
RANKING -- compare every pair and sort -- because then "closest pair in the alphabet" is a
fact about the face instead of a feeling about a screenshot. That is why the tool is
written the way it is, and why it also refuses to report when the face did not load.

This is the fifth time this lane has written down the same lesson in a different costume:
**a clean answer from the wrong oracle looks exactly like a fact.**

## 6. TWO DEFECTS I MADE AND FIXED INSIDE THE ROUND, FOUND ONLY BY LOOKING

- **The compass diagonals drew an envelope.** The four diagonal code points I reached for
  are not arrows. At full resolution the NE key on the fight pad was a small envelope and
  the other three were half-triangles pointing the wrong way. The real fight already names
  its directions with letters, which also survives every font on every phone. Fixed.
- **The big portrait was a passport photo in a slot.** Option C of the talk panel is meant
  to be a face filling the top of the screen, cropped like somebody standing too near you.
  The first cut drew it 150 px wide on a 390 px phone with black gutters down both sides,
  which is the opposite of the option. Fixed to edge to edge.

Neither was visible in the source and neither would have failed a gate. Both came from
cropping the real render at full resolution and looking at it.

## 7. THE GATE

`gates/the_ui_is_built_from_objects_gate.js`, 53 legs, 0 failed, registered in the suite
as UI IS OBJECTS. It binds every sheet to the one shared vocabulary; it checks the object
rule actually declares the four parts; it fails a lit rim on a bottom edge (two lights);
it fails a ramp that is a blend instead of a staircase; it pins the phone at 390 and
refuses a scaled panel; it demands travel on the key rather than a border; it requires
every font family a sheet names to resolve to a file on disk; it proves no sheet touched a
play surface under the rule 18 hold; and it makes rule 22 MEASURED rather than asserted by
requiring the round's panels to be registered in the vote tab.

Six mutations proved, each restored: delete the body from the object rule (1 red), blend a
ramp (1), light a bottom edge (2), unhook a sheet from the shared file (1), break a
registry path (1), take the travel out of the key (1). Tree restores to 53/0.

Two legs of the gate were WRONG WHEN FIRST WRITTEN and are recorded here rather than
quietly fixed: the ramp leg stopped its match at the first closing bracket, which in this
file belongs to `var(--c-face)`, so it judged a stub of every ramp and called the object
rule a blend; and it counted only per-cent stops, so the vent's louvres, cut at 3px/4px/5px
and as much of a staircase as anything in the file, failed it.

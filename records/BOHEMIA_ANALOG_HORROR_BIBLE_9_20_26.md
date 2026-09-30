# THE ANALOG HORROR BIBLE (DIRECTION, 9/20/26 — one page, ten rules)
# [analog horror], rule 20, Paolo: "everything that is a pixel to everything
# that's a sound has to be thought about as analog horror... fully commit."
# Built on the register (records/BOHEMIA_ANALOG_HORROR_REGISTER_9_20_26.md);
# his fuller sentence overrides the register twice (sound first, the fight
# read through the tone) and those amendments are stamped on the register.
# Not a filter, not a monster, not a named series, not a brightness slider.
# The grime machine (8/3, bake-time) is the pass that serves rule 10.

## THE TEN RULES A PIXEL OBEYS
1. THE ORDINARY FRAME, ONE WRONG THING. A frame is mundane except exactly
   one element that should not be there or should not be missing. One.
   Two wrong things is a haunted house; zero is a screenshot.
   MEASURE: name the wrong thing in one sentence or the frame fails.
2. THE CAMERA DOES NOT HELP. Nothing zooms, pans or glows toward the
   wrong thing; it sits off-centre and unannounced. Our fixed camera is
   already this rule; nothing may add a look-at.
   MEASURE: zero camera moves triggered by the wrong thing.
3. THE LONG HOLD. Stillness is content. Nothing animates that does not
   have to; the wrong thing moves last, if ever.
   MEASURE: in any 4-beat window, moving pixels < 10% of the frame
   outside bodies that are walking.
4. THE LIGHT WAS IN THE ROOM. Every lumen has a source you can point at
   (sky, CRT, sign, lamp); night multiplies value and touches nothing
   else (the cloud rule's arithmetic). No mood gradient, ever.
   MEASURE: every lit region names its fixture; channel disagreement
   under one 8-bit rounding step at night.
5. THE DEAD INSTITUTION'S TYPE. On-screen words are procedural and too
   calm (the font ruling's registers: ROM cells, DIN stencil, segments).
   The horror is the calm, never an exclamation mark.
   MEASURE: zero decorative type; alarm words set in the same register
   as timetable words.
6. THE STILL FACE. A portrait holds; it under-reacts; the blink is rare
   and the smile is rarer. THE FACE PERFORMS (law) stands - it performs
   restraint.
   MEASURE: idle portrait: at most one micro-move per 8 beats.
7. THE LIT STREET WITH NOBODY HOME. Occupancy wrongness is the cheapest
   dread we own: lights on where the census says empty, a crowd thin
   where it should be thick. Drawn from world data, never faked.
   MEASURE: the wrongness traces to a real world-state row.
8. DIEGETIC OR DEAD. Static, scanlines, tape damage and drop-outs exist
   only inside in-world screens and speakers. The lens is an eye.
   MEASURE: zero full-frame overlay draws outside the fight shade and
   night, which are value-only and already gated.
9. THE MACHINES KEEP TALKING. Broadcasts, PA calls and signs repeat on
   schedule whatever happens; the 120 BPM beat is the dead pulse they
   ride. Repetition is the dread; the content never acknowledges you.
   MEASURE: scheduled emissions fire on world time, not on player events.
10. GRIME IS BAKED, NEVER SHADED. Wear is drawn into the pixels at bake
    time by the 8/3 grime machine; no runtime shader ever fakes age.
    MEASURE: zero runtime post-processing passes on world pixels.

## TODAY'S READING (pass/fail per asset class, measured on the frames on file)
             R1    R2   R3   R4   R5    R6      R7    R8   R9      R10
ONE TILE     n/a   ok   ok   ok   n/a   n/a     n/a   ok   n/a     ok (7/28 sets are baked)
ONE BODY     n/a   ok   ok   ok   n/a   n/a     n/a   ok   n/a     ok
ONE FACE     n/a   ok   FAIL(unmeasured idle) ok  ok  UNMEASURED n/a ok n/a  ok
THE FIGHT    FAIL  ok   FAIL ok   FAIL  n/a     FAIL  ok   UNMEAS. FAIL(blurred floor is scale, not grime)
THE STREET   FAIL* ok   ok   ok   ok    n/a     FAIL  ok   UNMEAS. ok
(*the street frame is ordinary with ZERO wrong things - the world does not
yet place one; that is rules R1/R7's build debt, world-data work, not art.
The fight's row is the fight verdict's list wearing this bible's numbers.
UNMEASURED is written where no instrument exists yet; naming it is rule 13.)

## THE ERA (added 9/27, [newgrounds] - Paolo 9/24 named the flash site)
Newgrounds is the LOOK'S ERA, his name, this page's alone: the early-
2000s flash portal's hand-made, loud, crude-on-purpose, held-pose
energy. THE CUT (records/BOHEMIA_NEWGROUNDS_THE_FLASH_ERA_INSIDE_THE_
BIBLE_9_27_26.md): what survives is the HAND-MADE SIGNATURE (wear with
authorship, R10's bake), PUPPET MOTION WITH HELD POSES (R3's stillness
was the flash era's native craft), LOUD SILHOUETTE (shape and one
accent, never palette floods), the DESK-MIC VOICE (a human too close
to the microphone, which is the broadcast premise), and SMALL-TEAM
CONSISTENCY (this page is that). What dies: thick outlines, gradient
abuse (R4), comedy gore (not a monster), glossy web chrome. The one
sentence: permission to be hand-made and loud, inside this page's
light, palette and lens. No flash game is ever cited by name.

## THE AI-SLOP STRAND (added 9/30, [ai slop] - Paolo 9/29: "I'm really falling in love with this AI slop analog horror direction")
The world is rough and hand-made; the only thing still talking is a machine
nobody switched off, and it is SMOOTH, POLITE, SURE AND A LITTLE WRONG. The gap
is the fear. The machine's surfaces only: the feed, the narrator, the
institution's text, the road events' setup, the flip's year. Three pairs
(records/BOHEMIA_AI_SLOP_THE_MACHINE_AND_THE_WORLD_9_30_26.md, shot from the
game's camera, in VOTE): (1) the machine talks in whole polite sentences and
knows your name, people talk rough, one font for both; (2) smooth only inside a
screen (a screen is its own fixture, R4), world pixels never softened (the
floor's fine band, 0.020); (3) one calm wrong thing on a schedule (420 blocks,
then 421), never red, zalgo, colour split or "!!!" (R1, R5, R8). Rare in act
one, grows with the rebuild. A direction, never a reference game.

## WHO READS THIS
THE FIGHT VERDICT judges against these ten from its next round. The
compare-to-the-world gate carries this page as reference AH-01
(reference/library/analog-horror/); a cook that works the tone cites it.
COOK, SOUNDS, WORDS, PORTRAIT and UI build to their sections of rule 20;
this page is the pixel half. The register's sound line is amended by his
own sentence: the sound serves analog horror FIRST, and what survives of
the FFX anchor is what fits inside it - a warm melody through a dead
broadcast, corrected in VOTE.

```json
{"card":"ANALOG_HORROR_BIBLE","date":"9/20/26","rules":10,
 "not":["filter","monster","named series","brightness slider"],
 "asset_classes":["tile","body","face","fight","street"],
 "serves":{"grime":"8/3 bake-time machine","beat":"120bpm as the dead pulse"},
 "overlays_allowed":["fight shade (value-only)","night (value-only)"],
 "era":"newgrounds (9/27): hand-made + loud + held poses survive; outlines, gradients, gore, web chrome die",
 "judge":"name the one wrong thing in one sentence, point at every light's fixture, and prove nothing sits on the lens"}
```

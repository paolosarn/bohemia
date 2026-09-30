# NO TWO TEXTS ON TOP OF EACH OTHER (PLUMBER 9/30/26, row [no overlap], rule 44c, round 1)

Paolo 9/29 (records/BOHEMIA_PAOLO_THE_PAD_IS_TRAVEL_SPEED_THE_PORTRAIT_IS_THE_MENU_NO_TEXT_OVERLAPS_9_29_26.md):
"for the demo bro you gotta keep in mind when texts are overlapping each other. I don't know why it's
so fucking difficult for you to understand when text is overlapping each other." His screenshot: the
quest line at the top ran under the phone. KEPT CLAIMED (rule 6): the gate is in the suite and biting;
the fight surface and the settlement screen are not read yet.

## THE ANSWER FIRST

- **NO OVERLAP is in the suite and red on purpose: 20 passed, 2 failed.** The two reds are real, and
  both were seen on the glass:
  1. **The quest line wraps under the settings button** (the demo; RUN's). #qline spans the top of the
     city frame under the shell's settings button and the phone. At the length the game composes
     (objective, next step, address) its second line runs under the settings button: "north-e"
     hidden, "ast" showing. His screenshot was this element, under the phone.
  2. **The danger line runs under BUILD HERE** (the alpha; UI's own [warning clipped]). Through the
     game's own streetSay() with the words UI quoted: "2 OF T" and "ONE AN" are hidden under the button.
- **Every other surface read clean**: the loading screen, the first screen after the door, and the map
  at its opening zoom and far stop, on both the demo and the alpha (10 to 45 texts each). That is a
  measurement, not a reassurance: thirteen planted cases prove the reader finds what it should.
- **Both reds are PLANTED texts, said plainly.** The demo's first 40 seconds never write a quest line,
  and a pack of hostiles has to be near for the danger line. So the gate writes each one: the danger
  line through the game's own call, the quest line at the length the game builds. What is being judged
  is the layout the game would put that text in.

## WHAT IT READS

tools/bohemia_text_overlap.js, through the one driver at phone size (390 x 844 at 3x):
- every visible DOM text in the shell and every visible frame, one box per line, clipped by any
  ancestor that clips;
- every text drawn on an on-page canvas: fillText and strokeText are wrapped before any page script
  runs (the driver's arm), recording the text, position, alignment, baseline, measured width and the
  canvas transform, mapped from canvas pixels to the page;
- at five points along each text's middle, what paints on top of it, asked in the shell and inside
  the frame.
A text is **cut off** when some of its five points are under something that paints and some are not.
A text wholly under a whole-screen cover (the loading screen over the game) is not on screen, so it is
neither cut off nor overlapping. Two texts **cross** when their boxes overlap by at least 2 px each way
and a quarter of the shorter one's height.

## THE FOUR TRAPS THE FIRST CUTS FELL INTO, EACH NOW A PLANTED TEST

The first cut reported 36 overlaps and 24 covered texts. On the glass almost all were false:
1. **An outlined label is drawn nine times.** The map writes "HOME" at eight one-pixel offsets for its
   outline, then the word. Same canvas, same text, within 3 px is now one label (S6).
2. **What is under a loading screen is not "covered", it is not there.** The splash hid the whole game,
   and the first cut called every hidden HUD word "under a panel" (S8). And the hit over the alpha's
   hidden tab strip was the splash's title letters, which have no background of their own; the panel
   holding them does. The check now reads the whole stack between the hit and the text.
3. **Hit tests skip anything that lets taps through** (UI said so on its own row). For the length of
   the question every element takes the finger, so a click-through label or panel is judged by what
   it paints (S4, S5).
4. **The phone's cracks and glass are see-through.** The cracks are an SVG of thin lines; the glass is a
   gradient from fully clear. Counting either as a panel hid all 24 feed lines from the checker (26
   texts read as 2), twice, before it was caught by the count dropping. An SVG now paints only with a
   solid background, a canvas only where its own pixel is opaque, a gradient only if one of its colours
   is at least half opaque (S9, S10, S12, S13).
Plus: a covered question that cannot run fails the gate instead of passing it (S11).

## WHAT IT CANNOT SEE, STATED

The fight (it needs a real tap on a hostile body, and COMBAT is rebuilding the board on house tiles);
the settlement screen (not built yet); the phone opened out; text drawn on a scratch canvas and copied
to the screen as a picture; a crossing inside one canvas where a later drawing paints over an earlier
label. All printed as OWED on every run.

## ROUTED

- RUN [quest line]: the quest line must not reach the settings button or the phone at any length.
- UI [danger line]: NO OVERLAP now holds your [warning clipped] red until the fix lands.

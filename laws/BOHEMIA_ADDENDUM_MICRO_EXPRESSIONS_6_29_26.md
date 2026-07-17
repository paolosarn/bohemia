# BOHEMIA ADDENDUM — MICRO-EXPRESSION SYSTEM (eyebrows + lips)
# 6.29.26
# STATUS: FUTURE / CATALOGED IDEA — not built yet. Captured so it is not lost.

## THE IDEA (Paolo)
Move the lips by ONE or TWO pixels to simulate talking. Move the eyebrows by one or
two pixels to show emotion. Eyebrow shape + lip shape is the whole game for emotion at
this resolution. It is cheap, it is universal, and it rides the parametric face engine
we already built. This is a someday system, but it is a priority someday.

## WHY IT IS CHEAP AND UNIVERSAL
- The portrait/face is already PARAMETRIC (brows, eyes, nose, mouth are driven numbers,
  not redrawn art). So an expression = a small offset on numbers we already have.
- No new art per character. One expression table drives EVERY face, every skin tone,
  every character, because the face is generated, not hand-drawn.
- At sprite + portrait scale, identity and emotion are carried by relationships, not
  detail. A 1-2px brow lift or a 1px mouth change reads as a whole mood.

## TWO LAYERS
1. EMOTION (static pose): a brow offset + a mouth shape = a feeling.
   - Examples to design later: neutral, angry (brows down+in, mouth flat/tight),
     sad (brows up at inner corners, mouth down), surprised (brows up, mouth open),
     smug (one brow up, mouth slight curl), afraid (brows up+together, mouth small).
   - Each = a tiny delta table on (browL_y, browR_y, browAngle, mouth_w, mouth_open,
     mouth_curve). 1-2px moves only.
2. TALKING (animation): cycle the mouth open/closed by 1-2px on a timer while a line
   plays. Optionally a tiny brow bob on emphasis. Layer talking ON TOP of an emotion.

## DESIGN AS PATTERNS (like the Dead Eye Dial patterns)
- Build a CATALOG of eyebrow movements and a CATALOG of mouth movements, then combine.
  Emotions = named combos. Talking = a mouth-cycle pattern. This mirrors how we did the
  52 dial patterns: small reusable motions, combined, named, learnable.
- Keep it deterministic and tiny. Author once at the parametric layer; it propagates.

## WHERE IT PLUGS IN
- The PORTRAIT engine (face_compose / pface) is the home: brows + mouth already params.
- The sprite face (overworld_face) carries brow/eye/lip color + position; a 1px mouth
  move is feasible there too for in-world talking heads later.
- Hooks: dialogue lines (talking), combat/feed reactions (emotion), companion moments.

## NOT NOW
Do not build yet. When we do: start with ~6 emotions + 1 talking cycle, all as delta
tables on the existing face params, preview in the Lab portrait editor, tune by eye.

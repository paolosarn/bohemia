# BOHEMIA ADDENDUM: 120 BPM REQUEST LAW + CITY MOVEMENT — 7/6/26

## 120 BPM REQUEST LAW (LOCKED, Paolo 7/6/26)
"In this world, even with the music, it's 120 BPM everywhere. You REQUEST to
walk on the same timing. You don't just do it."

- Movement input is a REQUEST, never an execution. Pressing a direction queues
  the step; the world metronome (BEAT = 500ms, 120 BPM) executes it on the
  next grid tick.
- This is a WORLD LAW, not a mode rule. It applies in human mode (on foot) AND
  city mode (the overmap marker). Anything that moves by player input anywhere
  in Bohemia answers to the same clock.
- WORLD MOVERS LAW intact: the metronome ticks continuously, but the world
  (time, movers, cars, planes) only advances when a step actually EXECUTES.
  An idle metronome moves nothing.

## HOLD-TO-RUN (IMPLEMENTED 7/6/26, default; Paolo floated hold, verdict open)
- Hold a direction: steps repeat, one per beat (walk).
- Hold sustained 2+ consecutive beats: the body breaks into a RUN.
  - Run = TWO cells per beat (matches the pending grid-design note
    "run = two cells per move").
  - Run uses the real `run` clip frames.
- Release resets to walk on next hold.
- [PENDING, Paolo's call]: hold-to-run is live as the default because Paolo
  leaned that way ("maybe when u hold you run?"). A dedicated RUN button is
  the alternate; one-line swap if he verdicts the other way.

## CITY PLAYER ANIMATION (BUILT 7/6/26)
- The city tab receives from the parent, per direction (8 dirs):
  - idle (1 frame), walk (4 phases: 0/.25/.5/.75), run (4 phases).
  - All baked by the SAME bake112 path combat uses. Same art, same skinner,
    same clothes, same colors (palette decode is 4-byte RGBA, verified
    pixel-exact roundtrip against packIdx).
- During the beat window after an executed step, the sprite animates through
  the 4 walk (or run) frames, then settles to idle. Facing = last step dir.

## PORTRAIT PARITY (BUILT 7/6/26)
- The city's bottom-right mode button (DROP IN / CITY) now shows the player's
  FACE, produced by the EXACT combat mechanism:
  `renderFace(buildSpec(), {ramp: portraitRamp()})` packed at 64x64.
- Rendered round inside the combat-style radial button, arrow label
  (⤓ DROP IN / ⤒ CITY) overlaid at the base. One face across the whole game.

## MESSAGE CONTRACT (city bridge, current)
- Parent -> city: `BOHEMIA_CITY_PLAYER`
  `{w:112, h:112, packed:true, dirs:{D:{idle, walk:[4], run:[4]}}, portrait}`
  where every frame is a packIdx blob ({pal RGBA 4B/entry, rle|idx} or {raw}).
- City -> parent: `BOHEMIA_CITY_NEED_PLAYER` on boot.
- Refresh triggers: rig sync (debounced 1.5s, same as combat), city tab open,
  city iframe load.

## STILL OWED (Paolo's standing list)
- Full-map view: R=26 slot view-radius cap in the city renderer. Not fixed.
- Combat HUD/portrait panel riding along INSIDE city view beyond the mode
  button (the full corner UI): not built.
- Building placement ("when can I start building buildings"): blocked on
  building sprite factory art direction. [PENDING, Paolo's call]

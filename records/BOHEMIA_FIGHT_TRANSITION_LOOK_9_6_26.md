# THE FIGHT TRANSITION LOOK (DIRECTION, 9/6/26 — VAMILY [judge the turn])
# Paolo ruled the move 9/6 (COMBAT [enter zoom], option A): the camera pulls
# back from person-scale to house-scale over the SAME ground, on the beat,
# and "maybe a cloud opacity somewhere" covers the moment the scale changes.
# This card rules what that half second LOOKS like — light, crowd, colour —
# so COMBAT and ANIMATION build to a bar instead of guessing, and DIRECTION
# judges the built thing against it on the real surface when it lands.

## 1. THE BEAT (120 BPM is the clock, both directions)
- The pull-back spans TWO BEATS (one second): beat one the cloud arrives,
  beat two the scale settles. The return uses the same two beats reversed.
  A longer zoom reads as a cutscene; a shorter one as a glitch.
- Nothing else about time changes: the world clock, the music transport
  and the walk beat run through the turn uninterrupted. The transition is
  weather, not a pause.

## 2. THE CLOUD (his detail, drawn honestly)
- It is a CLOUD SHADOW, not fog: a soft-edged VALUE MULTIPLIER (darken to
  0.75-0.85 at its core, feathered wide) sweeping across the ground. No
  white mist, no blur — this is a desert with a sun, and what crosses a
  desert street is shade.
- IT MOVES LIKE WEATHER: one direction of travel, the same direction the
  valley's weather system already uses, at cloud speed — it enters one
  screen edge and leaves the other across the two beats. A shadow that
  blooms in place reads as an effect; one that CROSSES reads as sky.
- The cloud is the ONLY cover. The ground never cuts, tiles never swap in
  view; the zoom happens while the shade is over the player's cell, so
  the scale change is discovered as the shadow passes, not watched.

## 3. THE LIGHT (nothing else is allowed to change)
- Combat gets NO palette of its own. The fight is the street: same sun,
  same tiles, same territory reads. The only light event in the half
  second is the cloud's own shade arriving and leaving.
- BANNED in the turn and in combat: desaturation filters, red vignettes,
  darkened corners, colour grading of any kind. Danger already has its
  channels — the worn accent (hostiles verdict 9/6) and the territory
  marks (territory card 9/6) — and a screen filter would be a second
  saturated channel shouting over both.

## 4. THE CROWD (the board empties like a street, not like a menu)
- Non-combatants WALK OFF during the cloud beats — they clear the board
  the way people clear a street when trouble starts, at walk speed, in
  real directions (into doors, around corners). Nobody pops, nobody
  fades: a vanish is the hard cut the ruling banned, applied to bodies.
- The fighters stay exactly where they stood; the zoom re-frames them.
  Whoever was hostile keeps their facing through the turn.

## 5. THE DOOR (the same move indoors)
- Walking through a door into a fight uses the same two beats and the
  same value-shade cover, but the shade is the DOORWAY'S own shadow
  sweeping the frame as you cross the threshold — interior dark, not a
  cloud. One mechanism, two skins; the skins never mix.

## 6. THE JUDGE'S TEST (what DIRECTION checks when it lands)
Freeze any frame of the half second: it must still look like the walked
street (same palette, same tiles, territory and accent reads intact),
and the whole turn must survive a greyscale check (the shade reads by
value alone). If a frozen frame looks like a different game, the turn
failed, whatever its smoothness.

## THE MACHINE BLOCK (for the future transition gate)
```json
{
  "card": "BOHEMIA_FIGHT_TRANSITION_LOOK_9_6_26",
  "beats": 2,
  "bpm": 120,
  "cloud": {"kind": "value multiplier", "core_darken": [0.75, 0.85],
            "travel": "one direction, enters and exits the frame", "white_fog": false},
  "light": {"combat_palette": "none", "filters_banned":
            ["desaturation", "vignette", "grading", "corner darkening"]},
  "crowd": {"noncombatants": "walk off during the beats", "pop_or_fade": false,
            "fighters": "hold position and facing"},
  "door_skin": {"same_beats": true, "cover": "doorway shadow, not cloud"},
  "judge": {"frozen_frame_is_the_street": true, "greyscale_readable": true}
}
```
ROUTED: COMBAT [enter zoom] and ANIMATION [zoom beat] build to this;
DIRECTION judges the built transition on the real surface against
section 6, and this line ships on that judgment, not on this card.

# ONE SONG (RUN, 10/4/26, [one song], rule 64)

> **PAOLO 10/2:** *"two songs are playing at the same time; I don't know how you fucked that up."*

## MEASURED FIRST
Every AudioContext and every media element in every frame hooked, the demo walked from the map
into a fight and home:
- **There is ONE music engine** (the shell's transport). No frame plays a second one: the rebuilt
  fight makes only its own short hits, the settlement screen and the map make no sound.
- **The folds broke its hand-offs both ways:**
  1. Nobody told the music a fight began (the old fight's door called FIGHTMUS.enter; the rebuilt
     fight's door did not). So the MAP'S song played on under every fight, the fight's hits over it.
     On the rebuilt fight that is the wrong song under the fight, not two (rule 64a).
  2. The way home clicks the RUN tab. The shell's tab rule spared only 'city' while the street's
     song played, so RUN took the "leaving the studio" branch and stopped it. Every fight came
     home to a SILENT map (MUS.playing false, CITYMUS.on false, for good).

## THE OLD FIGHT'S DOOR, FIRST (rule 64a: *"I only heard the double music on the old combat model"*)
- **He was right, and it is measured:** forced through the old door, the shell's song went on (FIGHTMUS
  stands the street down, it does not stop the engine) AND the old fight's own frame played its faction
  loop, about 35 notes every two seconds each. Two songs. The one-engine rule (the old fight owns the
  music while its TAB is the visible one, and the tab click stops the shell) only runs on a tab click,
  and the demo's door opens that panel without one.
- **Can the demo still reach it?** Not on its walk: every fight the map starts goes to the rebuilt fight
  (NEW_FIGHT_ON), and the check counts the old door's calls through the whole walk: zero. It stays
  reachable in code (a failed rebuilt door, the cold open, the old walk's hand-in), so it is fixed anyway:
  when the shell is already playing as an old fight starts, the shell's engine is the one bus, the old
  frame's loop is muted (its own mute message, music only, its shots stay) and FIGHTMUS scores the fight.
  A tab click still stops the shell first, so the workshop's COMBAT tab keeps its own music as before.

## NOW (`__ONE_SONG__`, the shell)
- **The fight takes the music** the way FIGHTMUS always has: the street stands down without a cut
  (SOUNDS shipped that same call on the rebuilt door in the same round, `__ONE_ENGINE_OWNS_THE_ROOM_IN_THE_NEW_FIGHT_TOO__`;
  merged, one call, theirs), and the fight's song is picked ONCE through the one handler every fight pick goes through (the
  latch, never the scratch patch). The map names no faction yet (`cityFactionHere` is never
  defined), so it is the weighted draw over the faction songs: canon 8x, unjudged 4x, buried never.
- **Home hands the street back on a phrase:** the fight's song finishes its phrase (16 s), then the
  street's shuffle takes it with an overworld song. The map's panel, by either tab, never stops it.

## CHECKS
- **THE ONE SONG**, new, 8/0, registered slow. One walk: map, a settlement screen, a fight, home,
  sampled every half second. Never two playing; the street on the map and in the settlement; the
  fight's song within 2 s (measured 0 ms) and once; home never silent; the street back after a phrase.
  Mutations, each red: the fight never takes it (S3, S4, S6); the old tab rule (S5, silent 4 s after
  the card); a second song in the fight's frame (S1, two at once); the old door without the mute (S8,
  two playing in 6 of 6 samples). S8 restores the fresh-boot state first: the way home from the first
  fight clicks RUN, which already mutes the old frame and hid the bug on the first try of the check.
- Music checks against main: eleven the same, none worse; DEMO SOUND 10/3 (main 9/4), its
  "the music takes the fight" leg now sees the fight's director on (still red there: that walk never
  starts the music at all).

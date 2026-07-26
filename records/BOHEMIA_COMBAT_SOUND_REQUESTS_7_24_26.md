# COMBAT sound asks (Paolo 7/24-7/25/26) — BOTH HANDLED IN COMBAT v63

Paolo, 7/25, frustrated these were punted: "stop playing the faction music during the
encounters and play the overworld music... that hero beat. I need that double volume shit."

He was right to be mad. Both live inside combat's OWN self-contained synth (playStep /
drumV / synthV all ship inside COMBAT_B64), so combat owns them — no other session needed.
Done directly in v63.

---

## REQUEST 1 — BEAT-ONE DOUBLE VOLUME (the hero beat) — DONE v63

Beat one of every bar (step 0, the downbeat) now hits DOUBLE, combat-only (playStep IS
the combat loop, so it never touches the MUSIC tab / overworld mix):
- the kick RE-STRIKES on beat one and a sub `boom` layers under it,
- the bass note on beat one plays at 2x gain (0.13 -> 0.26 synth voice, 0.12 -> 0.24 osc).
The "one" wallops so the Dead Shot Dial's downbeat is unmistakable in the body.
Verified live: step 0 fires 3 drumV strikes vs 1 elsewhere; bass g0 = 0.26 vs 0.13.

## REQUEST 2 — OVERWORLD MUSIC IN FIGHTS (retire faction combat music) — DONE v63

Encounters no longer play the 13 faction combat songs. They play the REAL overworld
creepers, round-robined per fight: SLOW CREEP, SATELLITE PRAYER, REPO MAN, GHOST IN THE
GRID, SLOW BLEED, THE PIT BOSS IS GONE. Not approximations — the 8 overworld synth voices
combat lacked (nightpad / rustlead / deadsat / solarhymn / powergrid / signalfade /
rouletteghost / dreadbed) were ported VERBATIM from the canon alpha synthV, so the songs
play TRUE (drum kits were already all present). owSong() sources the overworld pool ONLY in
a shuffle encounter (the real-run default); picking a specific faction in the lab still
auditions that faction. Verified live: all 6 songs render a full bar clean, no errors.

**Night pool per Paolo's own ruling** ("all the music right now that's for the overworld is
really the overworld at night"). Every day-phase currently draws from this night pool.

---

## THE ONE OPEN FOLLOW-UP (fast, when Paolo wants it)

Split the overworld music by TIME OF DAY to match the light (v55 rolls morning/dusk/night):
- DAY -> PYREFLIES RISE ; DUSK/DAWN -> TWO COINS FOR THE FERRYMAN, THE WIND LEARNS WORDS.
- Blocker is only voice coverage: those songs need 8 more voices ported into combat's synthV
  (abyssbass, pyrefly, ferrypluck, obolbell, styxhaze, hullwind, stormlarynx, mesawind) plus
  drum kit `knock` (combat already has it). Same verbatim-port method as the night 8.
Then key `pickOverworldSong()` off `G.dayPhase` pools instead of one flat night list.

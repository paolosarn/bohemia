# BOHEMIA ADDENDUM — 120 BPM GAMEPLAY COMES FIRST, AND A PRESS ASKS PERMISSION
# (Paolo 7/26/26, LOCKED)

Paolo's words: "I need you to remember that 120 BPM gameplay comes first and
every time I press the button it is asking for permission to be on the correct
timing of the game so no it didn't feel like the hero beat. [Not] one of each
song was synced up to the perfect dead[-eye] dial shot at all."

## THE RULING

1. **120 BPM GAMEPLAY COMES FIRST.** The beat is not decoration laid over the
   combat. It is the master clock the combat is built out of. When a mechanic
   and the beat disagree, THE MECHANIC MOVES. Difficulty, pattern speed, cycle
   length, cover windows: all of them bend to the grid, never the other way.

2. **A BUTTON PRESS IS A REQUEST FOR PERMISSION TO ACT ON THE CORRECT BEAT.**
   Not an instant action. You ask; the beat grants. Press just after a beat and
   you were on it. Press before one and the game holds your shot and fires it ON
   the beat. The player is never punished for being human by a few milliseconds,
   and the game is never off the grid.

3. **THE PERFECT DEAD-EYE SHOT IS THE HERO BEAT.** The dial's dead-center kill
   moment must land on BEAT ONE of the bar, the beat the drums hit double
   (the 7/24 hero-beat ruling). Every song, every pattern, every difficulty.

## WHAT WAS ACTUALLY WRONG (measured, not guessed)

The v67 pass fixed the game clock (the dial had been riding a per-frame counter
with no relationship to the audio) and fixed the ENEMY COVER cycle. It missed
the dial's own cycle, which is a different function, and that is why he still
did not feel the hero beat.

- `beatsForCycle()` snapped the dial's cycle to an EVEN number of beats. Even is
  not a bar. A 6-beat or 10-beat cycle puts the perfect shot on beat one, then
  beat three, then beat one, forever. **59 of 135 pattern x difficulty
  combinations (44%) could never land the perfect shot on a downbeat**, and
  holding greed could drop a cycle to 6 beats and knock an aligned pattern off
  the bar mid-fight.
- The per-pattern PHASE table (which shifts each pattern so its kill moment sits
  at the top of the cycle) was correct and baked. The cycle length underneath it
  was not.

Fix: **every dial cycle is a whole number of BARS** (multiple of 4 beats, floor
of 4, and greed halves in bars). The top of the cycle is therefore always beat
one, and PHASE puts the kill moment there.

Plus the permission press, per ruling 2: the dead-eye shot resolves ON the beat.
A press within 0.24 beats after a beat counts as that beat and fires at once;
otherwise the shot is held and granted on the next beat (worst case ~380ms).

## THE POP IS STILL A SKILL PRESS [PENDING Paolo]

The same physical button opens the engagement (POP OUT) and then takes the shot.
The SHOT is now permission-gated. The POP is not, because the shipped ON THE ONE
streak (V57/V58, his own ruling) rewards popping on beat one — quantizing the
pop would hand that reward out for free and kill the mechanic. If he wants the
pop gated too, the streak reward has to be redesigned in the same turn.

## RELATED FINDING, RECORDED SO NOBODY TRUSTS IT BLIND

The dial engine block inside COMBAT_B64 is stamped with the header "generated --
do not edit; edit engine/bohemia_engine.master.js then re-stamp". **That master
file does not exist anywhere in the repo, and no stamping tool exists.** The
stamped copy is the only copy. Edits go through
`tools/bohemia_combat_beatlaw_patch.py` (anchored, idempotent) until a master is
restored. Backlogged.

Gate: `gates/combat_lab_gate.js` section 8 EXECUTES the shipped engine — every
pattern x package cycle is asserted to be a whole bar, the needle is asserted to
be inside the kill window at the top of the cycle, and the permission quantizer
is run over a beat.

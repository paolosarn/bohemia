# BOHEMIA ADDENDUM — THE GROOVE CHAIN (COMBAT, 7/26/26)

Paolo: "think of more ways to make combat more fun, looking into Rogue Fable IV
for big brain research. I need you to take big swings to make combat more fun,
more punchy, more feeling like a rhythm based game."

## THE RESEARCH, AND WHAT IT SAID WE WERE MISSING

**Rogue Fable IV** (its own design pages): "your skill as a player is vastly more
important than your character's raw stats," and movement is the game — "you
should be in a state of near constant motion," dodging, sidestepping, running
circles, diving into the back line. Verbs are a deliberate mix of passive /
active / cooldown / charged.
→ After v73 Bohemia's movement was free and safe, but there was NO REWARD for
moving WELL. Motion was permitted, not encouraged.

**Crypt of the NecroDancer** (the Groove Chain): every kill landed without
missing a beat compounds a multiplier; it resets the moment you miss a beat OR
take damage; the indicator goes red at max.
→ That loop is what makes a rhythm game a rhythm game. Not that the game sits on
a grid — that STAYING on the grid pays and falling off it costs. Bohemia graded
every press (v69) and then did nothing with the grade. **A grade with no stake
is a scoreboard, not a mechanic.**

## THE TWO SWINGS (shipped v74)

### 1. THE GROOVE CHAIN
Every on-beat action compounds: **x1 → x2 at 2 → x3 at 5 → x4 at 9.** It breaks
to zero on an off-beat press OR the moment you take a hit, and the break is
announced (CHAIN BROKEN), never silent.

What it buys is capability, never a badge:
- **THE DIAL WIDENS 10% per level, +30% at x4.** Playing in the pocket makes you
  a better shot.
- **THE SONG CLIMBS ON RHYTHM ALONE.** The ladder's rungs sit at 2 and 4 kills;
  x2 now reads as two and x3 as four, so the track can lift before anybody is
  down. The music answers your PLAYING, not just your body count.
- It reads on the timing strip, hot orange at max.

### 2. ON-BEAT MOVEMENT IS FREE
A stamina move whose press lands PERFECT **refunds its pip.** Move in the pocket
and you can keep moving all turn; move sloppily and the bar drains. The reward
for rhythm is MOBILITY — the currency that actually decides a tactical fight —
and it costs the player nothing but skill. That is RF4's constant motion married
to the beat.

All of it keys off the SAME graded press, so there is exactly one definition of
"on the beat" in the whole fight.

## WHAT IS STILL OPEN (next swings, in order)

1. **RHYTHM AS DIFFICULTY.** The 52 dial patterns are curve shapes, not rhythms.
   A rhythm game gets harder by getting syncopated, not faster. Author patterns
   as note values against the bar.
2. **THE ENEMY TELEGRAPH ON THE BAR.** RF4's fight is dodging things you saw
   coming. The two-turn red line exists; put a beat COUNTDOWN over the man's
   head and have him fire on beat one, so you can dance out of it.
3. **ENVIRONMENT.** RF4 leans hard on terrain, clouds, traps and auras. Bohemia
   has pillars and one grenade. That is the thinnest part of the fight.
4. Small: the strip prints GROOVE x1 while the chain is alive but below the first
   multiplier tier. Honest, slightly misleading; show the raw count at level 1.

Gate: `combat_lab_gate` section 13 EXECUTES the chain (tiers, compounding, break
on off-beat, the dial bonus, the music floor) and the refund (PERFECT refunds,
GOOD and off-beat spend, all three verbs route through the graded spend).
Real-surface proof: `slices/BOHEMIA_GROOVE_PROOF_7_26_26.png` — a PERFECT move at
+19ms refunded its pip and opened the chain; an EARLY move wiped it.

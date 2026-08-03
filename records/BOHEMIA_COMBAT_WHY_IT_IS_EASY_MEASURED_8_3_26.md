# WHY THE FIGHT IS EASY. I MEASURED IT INSTEAD OF GUESSING.

Paolo, 8/3: "I am really concerned how easy this game could be unless I throw
8+ enemies at a player. Like right now I don't know if it's because I'm not
easy difficulty or if it's because of the rule that pretty much you're always
guaranteed to get the first shot always and I don't know if you could do some
research on that or like what's going on with the file that would be really
nice."

He named two suspects. BOTH ARE REAL. And there is a third one he did not
guess that is worse than either of them.

---------------------------------------------------------------------------
## FINDING 1: YOU DO ALWAYS SHOOT FIRST. CONFIRMED.

    startPhase 'cover'      enemiesActedBeforeYou 0      yourHP 100

A fight opens in YOUR phase with the enemy turn counter at zero, every single
time. Nobody has ever fired a round at him before he has had a full turn to
kill somebody. That is not a bug, it is how the fight was built, but he is
right that it is a standing advantage nobody pays for.

NOT CHANGED IN THIS PASS, DELIBERATELY. Who moves first is a design ruling,
not a plumbing bug, and there are at least three honest answers (initiative
roll, ambush-decides, enemy-first when they spot you). That is his call and it
is on the ask list, not invented here.

---------------------------------------------------------------------------
## FINDING 2: THE DIFFICULTY SETTING DID NOT TOUCH THE ENEMY. AT ALL.

This is the one he did not guess and it is the actual answer. Twenty turns of
standing still and letting them shoot, eight foes:

    EASY        6 turns to kill me      16.7 HP lost per turn
    BOHEMIAN    6 turns to kill me      16.7 HP lost per turn

IDENTICAL. Not close. Identical.

The difficulty package sets G.pkgDiff, and G.pkgDiff feeds THE DIAL: the
pattern YOU have to hit. It never once reached distAccuracy, the volley, or
enemy damage. So every difficulty in this game has meant exactly one thing:

    HOW HARD IS IT FOR YOU TO SHOOT.

Nothing has ever made THEM better. "Bohemian" was a harder minigame bolted
onto the same harmless enemies. Which is also the answer to why eight bodies
was the only lever that ever changed anything: more guns was literally the
only thing in the file that could raise the threat.

### THE FIX, AND THE SHAPE OF IT IS THE WHOLE POINT

Difficulty now scales distAccuracy, the one number every enemy shot in the
file runs through (the volley, the deck holders, the opportunity shot, and the
readout that prints THEIRS). One wire, every gun on the board obeys.

    EASY 1.00   NORMAL 1.12   HARD 1.26   V.HARD 1.42   BOHEMIAN 1.60

IT DIVIDES THE MISS, NOT THE HIT, AND I ONLY KNOW THAT BECAUSE I MEASURED THE
FIRST CUT. My first version multiplied the hit chance. Measured:

    EASY .699   NORMAL .783   HARD .881   V.HARD .990   BOHEMIAN .990

V.HARD and BOHEMIAN both ran into the 0.99 ceiling and came out IDENTICAL.
That is the exact bug I was fixing, moved up two notches, and it would have
shipped green. Dividing the MISS instead cannot pass 1, so no clamp can ever
eat a tier.

MEASURED ON THE FIXED VERSION, 300 real spawns per tier:

    tier        avg hit chance    at long range     expected hits per volley
    EASY            0.585            0.379                  3.65
    NORMAL          0.632            0.444                  3.93
    HARD            0.679            0.506                  4.21
    V.HARD          0.708            0.562                  4.43
    BOHEMIAN        0.737            0.611                  4.60

Every tier distinct, every tier monotone. And look at WHERE it moves: point
blank barely shifts (.970 to .981) because a man in your face was always going
to hit you, and that is his 7/27 point-blank ruling. The far column nearly
doubles. THAT is the real answer to "how is this easy with eight men on the
board" -- the far ones were missing. On Bohemian they stop missing.

### WHAT IT DELIBERATELY DOES NOT DO

- NOT a damage multiplier. His no-multipliers ruling stands: a bullet does
  what a bullet does. Difficulty changes how OFTEN one finds you, never how
  much it takes when it does.
- Does NOT touch the dial. The point-blank ruling, the exposure floor and the
  chain allowance resolve exactly as before. v98 says out loud in the file
  that the killshot allowance must never be wired to difficulty, and it is
  not: threatMult is read by distAccuracy and nowhere else, and the gate
  counts the call sites to keep it that way.
- EASY is left exactly where it has always been, so nothing he has already
  judged shifts under him.

THE NUMBERS ARE DIALS. The mechanism is mine, the five numbers are his.

---------------------------------------------------------------------------
## FINDING 3: 4.4% OF EVERY MAN SPAWNED INSIDE SOMETHING SOLID

Paolo: "the Enemies are able to like be inside the cars or like being the same
tiles of the cars and it's not good."

MEASURED across 200 arenas and 1,600 bodies:

    40 standing INSIDE A CAR
    30 standing inside a cover block
    4.4% of every man placed

THE CAUSE: setupEnemies picks a bearing and a distance and writes e.ea and
e.edist straight in. It has never once asked whether anything was already
there. The OCCUPANCY LAW is one body per cell including the player, and enemy
placement was the one place in the whole fight that never enforced it.

THE FIX: every spawned man is spiralled out to the NEAREST free cell, one ring
at a time, so the rolled spawn layout survives instead of him teleporting
across the lot. Never onto the player. If the lot is so packed nothing is free
inside the search, he is pushed OUTWARD rather than left standing in a wreck.
It runs after the deck holders are lifted and skips anyone one storey up, so
it can never quietly evict the roof.

MEASURED AFTER, same 1,600 bodies:

    enemiesInsideCars 0    enemiesInsideCover 0    pctOverlapping 0

---------------------------------------------------------------------------
## THE GATE

Six new checks in gates/combat_lab_gate.js (628 -> 634). Negative-tested: all
six fail on an unpatched alpha and pass on the patched one, so they are gates
and not decoration. gates/combat_runs_smoke.js boots the real alpha, opens the
real combat tab and drives real frames through cover -> AIM -> killshot ->
freeze: 1 passed, 0 failed, zero console errors.

---------------------------------------------------------------------------
## THE METHOD LESSON, WRITTEN DOWN BECAUSE IT KEEPS PAYING

I nearly shipped the multiply version. It was green, it was reasonable, and it
had the identical defect I was fixing. The only reason it did not ship is that
I printed the actual accuracy numbers for all five tiers before committing
instead of after. A wire that exists is not a wire that works, and the gate
that would have caught it is the one that prints the number.

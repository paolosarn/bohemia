# V196 — THE ANSWER TO THE MAN AT THE BACK IS YOUR LEGS
# (COMBAT lane, 8/30/26)

> "we are trying to create the best funnest **deepest** videogame ever" — Paolo

RF4-37 is the priority-target row, and it is the one thing this lane could not
measure all session. **Three instruments failed and each failure is written
down:** a passive player saturating a 100-health bar (which gave a confident
backwards answer), then the same player at 600 health where a one-body difference
is smaller than the run-to-run noise. Yesterday's record named the fix in advance:

> "the honest next step is a **playing A/B** — the same policy clearing the same
> boards, measuring **turns to clear and damage to clear** rather than damage over
> a fixed window."

That race has now been run, and it is in the gate so the answer stays true rather
than being true once in a scratch file.

---

## THE RACE: 90 FIGHTS A POLICY, SAME BOARDS, ONE THING DIFFERENT

| policy | rooms cleared | damage to clear |
|---|---|---|
| never cross the room, shoot what is near | ~33% | ~78 |
| **walk** at him | ~19% | ~135 |
| **maneuver** at him over the safest ground | ~16% | ~145 |
| **sprint** at him and still take the shot | ~31% | ~118 |

**CROSSING THE ROOM IS THE BEST PLAY IN THE GAME AND THE WORST PLAY IN THE GAME,
AND THE ONLY DIFFERENCE IS WHETHER YOU SPEND A STAMINA PIP.**

Walking at the priority target clears barely half as many rooms as ignoring him
and costs nearly twice the blood. Sprinting at him — the *same plan*, one pip —
beats walking on both counts, every run.

The reason is RF4-49, which this fight already ships: *"SP is not movement, it is
a currency that buys **free actions outside the turn economy entirely**."* A walk
costs your whole turn, so every step across the room is a turn where four men
shoot you and you shoot nobody. A sprint costs a pip and leaves the turn intact,
so you close **and** fire.

### WHAT IS ASSERTED AND WHAT IS ONLY REPORTED

Three runs gave nearest **31.1 / 36.7 / 32.2**, walk **18.9 / 15.0 / 18.9**,
sprint **37.8 / 31.7 / 28.9**. **Whether sprinting beats standing off is inside
the noise, and the gate reports it rather than claiming it.** What holds every
single time, and is what the gate stakes: walking is worse than not going,
routing over safe ground does not rescue it, and **sprinting beats walking on both
counts**. Two policies, one pip apart.

*Loosening a threshold until the swing fits underneath it is the mistake this file
has now caught itself making four separate times.*

---

## AND THE SHARPEST LINE IS ABOUT MY OWN FEATURE

Routing the crossing over the tiles **V193's read scores as safest** was the worst
policy measured. **The read optimises for this turn, and crossing a room is a
multi-turn plan**, so the safest next tile is frequently backwards. That is an
honest limit of a shipped feature, found by using it rather than admiring it, and
it is pinned in the gate so nobody meets it as a surprise.

## AND THE BEST FINDING FELL OUT OF STAGING THE TEST: THE DARK IS WHAT CREATES RF4-37 HERE

The gate arm kept reporting the spotter as **inside** my reach no matter how far
back I staged him, and that turned out to be a fact about the game, not the test.

**V151 gives the player a reach floor of the longest foe reach plus an edge — and
the spotter is the longest reach on the board.** So in daylight, the moment he can
see you, **you can already shoot him**: the blind band between your reach and the
end of his eyes is zero.

**After dark, V98 halves your range and does not touch his eyes.** The band opens
to about six tiles.

So *"maneuver into position to kill the priority target"* is a **daytime
non-problem and a night problem** in Bohemia. That is a different answer to RF4-37
than the row expects, and it is worth knowing before anybody builds for the other
one.

---

## WHAT SHIPS

Nothing in this fight had ever told a player any of the above.

- **While he has the room, the man doing it is named ON THE FIELD.** V179's ring
  says *who can see you*; it cannot say which of them is the reason your stone
  stopped working. RF4-48 is a pass/fail on exactly this.
- **The line names the gap in tiles and the move**, and switches between *"put him
  down"* and *"RUN at him: your legs do not cost your turn"* on the real reach
  test rather than assuming either case. Said once when it starts.
- The sprint's own label — *"2 tiles, 1 pip, FREE MOVE"* — only ever appeared
  **after** you armed it, which is the answer to a question you had to have asked
  already.

`NO DAMAGE BEFORE THE DIAL`: `applyDamage` is 40. Not one damage, accuracy, hp,
armour, range, resource or rule changes. **This is the fight explaining itself.**

## GATES AT CLOSE

| gate | |
|---|---|
| `fight_moves_you_gate.js` | **148 pass / 0 fail** (was 144/0), two runs |
| `combat_lab_gate.js` | **931 pass / 1 fail** (the one red is another session's fight-music ladder) |
| `one_engine_gate.js` | 3 / 0 |
| `boss_ladder_gate.js` | 87 / 0 |
| page errors | **0** |

## WHAT COMES AFTER

**The night is the interesting half and nothing is built for it.** The measurement
says the priority-target puzzle only exists after dark, when your reach halves and
his does not — and the one ability that answers a man you cannot reach is the
sprint, which costs a pip from a pool of three that refills every five turns. That
is a real economy nobody has tuned or taught: **how many pips it takes to cross a
room at night is the actual difficulty dial of this fight**, and it has never been
measured.

Still open and still combat's: **"it could be more hardcore if you wanted it to
be"** — permission, not a ruling.

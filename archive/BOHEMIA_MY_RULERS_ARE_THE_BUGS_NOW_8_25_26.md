# MY RULERS ARE THE BUGS NOW (8/25/26, SOUND lane)

Two reds came into this lane from the coordinator sweep. Both were written up as
game defects. Neither was one.

## RED 1 -- "AN EIGHT-HOUR SLEEP REACHES THE WIRE AS TWO CLOCK MOVES"

The claim: no single row carries the 480-minute jump, so nothing strikes eight.

MEASURED, on the real button, in the real run:

    ROWS (jump:strikes) = ['450:8', '0:0']

One row. Eight strikes. The game has been correct the whole time.

The defect was in `time_pass_gate.py`. It demanded a row whose jump equalled
`want` EXACTLY, and it computes `want` from the instant IT read the clock --
while the wire's baseline is the run's last four-second report. The clock keeps
moving between those two instants, so the wire legitimately measures a slightly
smaller move: 450, not 480. No row matched, the matcher returned -1, and -1 was
read downstream as "nothing strikes eight".

Fixed by matching the sleep on BEING THE BIG ONE, plus a new assertion that
carries the half the old exact label was accidentally enforcing: **the wire saw
substantially the whole night, not a fragment of it** (one hour of slack for the
reporting cadence). Loosening the match into a bare range would have accepted
the opposite failure -- a wire that watched two hours of an eight-hour night and
rounded to a plausible number.

## RED 2 -- "OPENING A REAL DOOR IN THE REAL RUN SOUNDS HIS APPROVED DRAG,
## EXACTLY ONCE (0)"

Three defects tangled together, and the gate could not see past the first.

**The ruler.** The counter matched `mat==='ash' && hits===3 && |hz-174| < 1`.
Exact and correct the day it was written. Then NO TWO PLAYBACKS ARE IDENTICAL
landed on 8/18 and put +/-3% pitch jitter on EVERY playback, on purpose, as a
shipped feature. Measured: the door renders at 173.4, 175.8, 176.7 -- never at
174 again through the flat path. The counter read zero while the door sounded
perfectly.

**The door did not exist.** The gate drove `openDoor('gate-probe-door')`. Every
real key is `"x,y"` (or `"i<house>:x,y"` inside), so that parsed to NaN, the
placed post carried NaN, and `placeSound` threw on it. The gate was measuring a
path the player never walks, and the one case that matters -- the door under
your hand -- had never been tested at all.

**And under a working ruler, on a real door, there was a real bug.** The count
is not 1, it is 2: `ash/3/174` (placed) and `ash/3/175.8` (flat). `openDoor`
called `sfxAt()` AND `sfx()`; the `sfx()` was written as the catch's fallback
and then repeated OUTSIDE the catch. Every door the player has opened since 8/14
has played his drag twice at once.

**Fourth, found while in there.** A broken PLACEMENT must never cost him the
SOUND. `placeSound` carried a non-finite distance to `gain.gain.value`, which
throws, and its catch turned a placement bug into SILENCE. The placement is
decoration; the sound is the message. It now falls back to centre, and the run
checks the tile before posting -- both sides, because either one alone leaves
the other caller exposed.

## THE PATTERN, WHICH IS THE ACTUAL FINDING

Ten ruler mistakes this week. They now outnumber the real bugs found by a wide
margin:

| # | the ruler | what it did |
|---|-----------|-------------|
| 1 | baked-bank probe regex | assumed two statements were one |
| 2 | hardcoded BANK in two gates | drifted two sweeps behind the tool |
| 3 | fixed 1400-char window | `sign_alive` sat 2421 chars out |
| 4 | graveyard check matched prose | buried a live voice over a song title |
| 5 | `[^)]*` caller regex | lost every ternary argument |
| 6 | `_angVel = 0.01` | the killshot was unreachable |
| 7 | kill asserted on the freeze | the kill sounds on the shot |
| 8 | demo gate blind to music | called a scored fight "silent" |
| 9 | TIME PASS row label | see RED 1 |
| 10 | door hz `+/- 1` | see RED 2 |

Every one of them has the same shape: **a measurement that was exactly right
against the engine it was written against, left in place while the engine moved
underneath it.** A gate is code, it rots like code, and a red is a claim about
two things -- the game AND the instrument. The instrument is now the FIRST
suspect, not the last.

Three rules that fall out of it and are already applied:

1. **A signature may only contain numbers the game does not deliberately move.**
   If it must contain one, the gate PROVES the band is exclusive against the
   whole approved bank rather than assuming it. (Widen the door band and it
   swallows `boots_go`, `step_gravel`, `went_down`, `sleep_sink` -- they are
   right there.)
2. **Drive the input a player can actually produce.** A synthetic key no door in
   the game has is not the real surface, and it hid two bugs at once.
3. **-1 is not a measurement.** Every "I could not measure this" path now prints
   what it DID see. Both reds were `-1`/`0` read as a fact about the game.

## MUTATIONS (IF YOU ADD A CHECK, MUTATE IT)

TIME PASS, against the shipped alpha, restored after:
- big jumps strike nothing -> "STRIKES EIGHT TIMES FOR IT (0)" red, and it found
  the 450 row to say so rather than falling to -1.
- the wire under-reports the move it saw, strikes untouched -> the strike leg
  stays GREEN and the new leg goes RED. That is exactly the hole matching the
  biggest jump opens, and it is now shut.

FRESH DOORS, same discipline:
- put the double-fire back -> "EXACTLY ONCE (2 at [174, 170.8] Hz)" red
- un-harden `placeSound` -> "refuses to go silent on a non-finite distance (0)"
- drop the unreadable-tile route -> "A DOOR WITH AN UNREADABLE TILE STILL
  SOUNDS (0)"
- widen the band to +/-60% -> exclusivity red, naming the four neighbours

32 passed / 0 failed and 27 passed / 0 failed respectively.

## AND AN ELEVENTH, WHICH IS THE SAME MISTAKE POINTED AT SOMEBODY ELSE

The full suite came back with FIRST NIGHT at 47 passed / 8 failed -- the whole
first-night quest chain, from TAKE IT through the choice card. It had been 55/0
on the clean tree minutes earlier, and the only thing I had done to the run was
rebuild the slice, which pulled in the WORLD lane's households/gate/self-storage
engine work that had been committed without a rebuild. Every arrow pointed the
same way: another lane's unshipped world change, activated by my build, breaking
the quests. The write-up was half drafted.

IT WAS LOAD. The rebuilt slice throws nothing on load (measured: zero
pageerrors, zero console errors over nine seconds) and first_night_gate runs
55/0 against that exact rebuilt slice, twice. The suite's own confirm pass says
the same thing in its own words: `FIRST NIGHT GREEN WHEN RUN ALONE`.

**A red under suite load is a claim about the gate's TIMING as much as about the
code, and the cost of being wrong here is somebody else's day.** Reproduce
standalone before attributing -- especially when the story is tidy.

Applied to the whole run, so this file is not just advice: every confirmed red
this lane could plausibly have caused was re-run against a stashed clean tree
before shipping. TOOL IDEMPOTENT, THE RUN, RUN PEOPLE, RUN BEAT and GRAVEYARD
are byte-identically red without this lane's changes. FIGHT MUSIC is green
alone. None of the 19 confirmed reds belong to this turn.

## ONE THING HANDED OVER, NOT FIXED

`engine/` IS AHEAD OF `slices/BOHEMIA_RUN_CURRENT.html`. The households, the
conducting gate and the parked self-storage cars are committed to engine/ and
are not in the run the player loads. `THE RUN` gate already says so in its own
words -- "regenerating via tools/build_run_slice.js changes nothing (the
committed run is current)" is red, and it is red on the clean tree too, so it
predates this turn.

This lane did not ship that rebuild. The door fix went into the committed run as
a surgical patch instead, identical to the source edit, because an 18 MB blob
carrying another lane's unverified world content is theirs to push, not mine.
`node tools/build_run_slice.js` is the whole job when they want it.

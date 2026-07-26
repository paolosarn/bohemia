# BOHEMIA ADDENDUM — THE SONGS PLAY OUT (Paolo 7/26/26)

> "Wow, I felt that. I really like that. I understand kind of what you were doing
> and it works. It really did. I think we just gotta think about the balance
> between the two kill progression the four kill progression... I hate to hear
> that we're locking great parts of a song, especially in the overworld and maybe
> even when we're not in combat... I was wondering if we can maybe transition the
> old 2 to 4 kills maybe just like when the song plays out and it goes longer,
> cause right now I think each song is like just a 30 or 40 second loop."
> — Paolo, 7/26/26

THE FIGHT PULSE (v75) is APPROVED by ear. This addendum is what he asked for
next, minus the one piece that is his to rule on.

---

## 0. THE CORRECTION FIRST: I SHIPPED HIM A NUMBER THAT WAS WRONG BY 4x

v75 told him his creepers average **0.54 kicks and 0.58 hats per bar**. The real
figures are **2.17 kicks and 2.33 hats per bar**.

The gate divided each pattern by 4, treating a 16-step pattern as four bars. It
is ONE bar: `stepDur()` is `(60/120)/4` = 0.125s, and 16 × 0.125 = 2.0s = four
beats at 120 BPM. The wrong number went into the law, the commit, the gate, and
the description printed in his settings panel where he could read it.

The diagnosis survives — the creepers are still about half the kick density and
a third of the hat density of a lockable track, every one is half-time, and the
pulse demonstrably worked — but the number was wrong and it is corrected
everywhere, including in the panel text.

**THE GATE FIX IS THE REAL FIX.** The bars-per-pattern figure is no longer typed
at all; it is DERIVED from `stepDur()` inside the gate, so the unit can never
drift away from the clock again:

```js
const stepSec = (60 / 120) / 4;
const barsPerPattern = (16 * stepSec) / (4 * (60 / 120));   // === 1
```

**And the corrected count exposed the sharper half of the diagnosis: PLACEMENT.**
It is not only that there are few hits, it is that the ones that exist are
unevenly spaced. **Not one of the six songs kicks on beat 2. Only THE PIT BOSS IS
GONE ever kicks on beat 4. Two of the thirteen kicks in the whole pool land off
the beat entirely** (SLOW CREEP on step 10, the offbeat before beat 4; PIT BOSS
on step 7). A pulse is something EVEN. There was nothing even in there.

## 1. HIS SONGS ARE NOT 30-SECOND LOOPS. HE WAS NEVER HEARING PAST THE FIRST 40 SECONDS.

His own 7/3 TWO MINUTE LAW built every song as a 64-bar arrangement, ~2:08,
sixteen 4-bar sections of 8 seconds each:

```
0:00 A   0:08 B   0:16 B   0:24 A
0:32 C   0:40 B   0:48 D   0:56 B
1:04 A   1:12 B   1:20 C   1:28 A
1:36 D   1:44 D   1:52 B   2:00 A
```

D is the FULL section: everything, plus the high line. **The first D lands at
0:48. The real payoff, the back-to-back double D, lands at 1:36.**

Every NEW ENCOUNTER threw the arrangement back to bar 0. `pickRandomFaction`
re-anchored the step counter, and the song was pulled out of the bag TWICE per
encounter (once by `pickDayPhase`, again by the V71 line). So **a fight shorter
than 48 seconds never reached a single D**, and what played on repeat was
A B B A C — the first forty seconds. His "30 or 40 second loop" was an accurate
measurement of what the game actually played him. The song was never the problem.

## 2. THE FIX IS THE BEHAVIOUR THE OVERWORLD ALREADY HAD

`CITYMUS` waits for `MUS.step >= 1024` (64 bars × 16 steps) and only then
shuffles to the next track. The city has been doing this correctly the whole
time. **Combat was the only place doing it wrong.** Now it matches:

- `songPlayedOut()` — true at a full 1024-step pass, or in silence.
- `rollSongIfDone(force)` — the bag hands over the next song when the current
  one has finished its form. Otherwise the encounter joins the song already in
  progress.
- An **explicit tap on SHUFFLE still forces** a different song. Waiting for the
  form applies to the automatic swap, never to something he asked for.

**THIS DOES NOT REVERSE V71.** V71's real defect was the BAG — a hand-copied
six-song subset was hiding thirteen approved tracks — and that fix stands
untouched. Swapping on *every* encounter was the incidental part, and it was the
thing eating his arrangements. Variety comes from the bag over time; each song
now gets its full front-loaded identity AND its payoff.

**V67 ONE CLOCK SURVIVES INTACT.** A genuine new song still re-anchors beat one.
What stopped is re-anchoring for a faction re-roll that changes no song at all —
in SHUFFLE it never did, because `owSong()` reads `G._owSong`, not the faction.

## 3. THE PULSE YIELDS: A FLOOR FILLS WHAT IS NOT PLAYED

He asked how the pulse and the 2/4 kill rungs work together. Measured, they were
fighting over the same percussion, and three collisions were literal duplicates:

| the floor played | what was already there |
|---|---|
| clap on steps 4 and 12 | the 2-kill rung's clap on steps 4 and 12 |
| kick on 0/4/8/12 | the song's own kick, on 0 and 8 in every creeper |
| hat on every even step | the song's own hat on its own even steps |

Across his six creepers the floor was landing on a kick the song already played
**11 times** and on its own hat **14 times**. The doubled kick on step 0 is the
same bug v70 and v71 each had to kill: two loud hits at one instant slam the
master limiter (−14dB, 6:1) and it ducks the very thing being announced.

So the floor yields. It fires only where his song is silent, and it drops its
backbeat entirely while the 2-kill rung is clapping 2 and 4. **His arrangement
and his 7/3 kill ladder are canon; the floor is the thing that moves.** The
emission also moved BELOW the rung so it can see what the ladder is playing
before it decides.

Yielding did not kill it: it still lays **2.2 kicks and 5.7 hats per bar** into
the gaps, which is the whole job. It also thins exactly the mud he was asking
about at four kills.

## 4. WHAT IS RECORDED BUT DELIBERATELY NOT FIXED

**THE OVERWORLD KILL LADDER IS A DEAD PATH.** The city and the run use a
different player (the parent's `MUS`, shuffled by `CITYMUS`). Its intensity
counter is `MUS.layers`, it initialises to `0`, and the ONLY thing in the entire
build that ever assigns it is the three preview buttons in the music studio
(CALM / 2 KILLS / 4 KILLS). Nothing out in the world touches it.

Four of his six encounter creepers are `klay:'melody'` — SATELLITE PRAYER, REPO
MAN, GHOST IN THE GRID, SLOW BLEED. For those four the 2-kill rung IS the song's
own lead blooming, and the 4-kill rung is that lead an octave up. So in the
overworld **those parts can never play. Not rarely. Never.** He named this
without reading a line of code.

It is not fixed here because **what drives intensity in the overworld is lore and
his call** — heat, being seen, night, distance from safety, whose territory you
are standing in. MECHANISM-MINE / CONTENTS-PAOLO'S. The gate records the dead
path so it cannot be quietly forgotten.

**AND THE TASTE CALL UNDERNEATH IS STILL HIS.** He wants two things that pull
against each other: nothing good hidden behind kills, and the 4-kill payoff he
liked where "the whole song would actually play." The four ways to reconcile that
were put to him (rungs carry energy instead of melody / kills fast-forward the
form instead of unlocking it / un-gate entirely / drive it from the world). **No
rung was moved and no klay layer was un-gated in this addendum.** The 2 and 4
rungs are his 7/3 LOCKED law and they stay exactly where he put them until he
rules.

## 5. THE GATE

`gates/combat_lab_gate.js` section 15 (303 checks total, 0 fail). It EXECUTES
rather than string-matches:

- pulls `SONG_ARR` out of the shipped demo and proves the form is 16 sections /
  128s with D first landing at 0:48 and doubled at 1:36;
- runs the extracted `songPlayedOut` predicate at bar 0, one step short, a full
  pass, and in silence;
- asserts the song is pulled from the bag in exactly ONE place (it was two);
- asserts ONE CLOCK still re-anchors on a real song change;
- counts, against his real song table, how many pulse hits would be duplicates
  and asserts every one is suppressed while the floor still lays ≥2 kicks and
  ≥5 hats per bar into the gaps;
- asserts the yield decision happens BELOW the rung;
- records the overworld dead path with the assertion that `MUS.layers` has
  exactly one assignment in the whole build.

## 6. THE LESSON, WHICH IS THE SAME ONE AS v75

v75's lesson was: when a fix is correct and he still cannot feel it, measure the
thing the fix was supposed to serve. This turn's is the sibling: **when he
reports a symptom, believe the measurement inside it.** He said "30 or 40 second
loop" about a 2:08 song. He was not wrong about the song. He was describing,
precisely, the only part of it the game ever let him hear.

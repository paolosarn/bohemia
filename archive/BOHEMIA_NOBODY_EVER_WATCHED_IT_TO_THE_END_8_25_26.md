# NOBODY EVER WATCHED IT TO THE END (8/25/26, PEOPLE lane)

## FIVE GATES REACH THE COLD OPEN. FOUR OF THEM TAP SKIP AND THE FIFTH TAPS
## NOT NOW. Not one of them has ever seen the scene finish.

Swept 8/25 across `gates/*.js` for anything that touches the opening overlay:

| gate | what it does when the opening comes up |
|---|---|
| `opening_gate.js` | plays 6s, clicks `#openSkip` |
| `demo_gate.js` | plays ~10s, clicks `#openSkip` |
| `one_valley_gate.js` | clicks `#openSkip` immediately |
| `run_gate.js` | clicks `#openSkip`, then force-hides the overlay |
| `the_whole_demo_gate.js` | clicks `#openNot` (declines it) |

Every one of those is individually correct. `run_gate` skips because the overlay
eats its D-pad taps. `the_whole_demo_gate` declines on purpose, to prove that
declining still leaves a playable day. Nobody did anything wrong.

**But add them up and the result is that "the demo's opening works" rested on
five gates proving it STARTS and zero proving it FINISHES.** The demo plan calls
row 7 THE FIRST FIVE MINUTES, not the first five seconds.

---

## WHAT WAS UNCHECKED, AND IT IS NOT SMALL

Six things could have been broken all week with every gate green:

1. whether the caption advances past its first line at all
2. whether the lines he wrote reach the screen, or stop three beats in
3. whether the ten-years-later cut actually lands on screen
4. whether **watching** it counts as seen. If only SKIP marked it, then the one
   person patient enough to sit through the whole opening is the one person it
   ambushes again tomorrow. Exactly backwards.
5. whether it throws halfway through
6. **where a human is standing when it stops**

---

## SO IT WAS PLAYED, ALL THE WAY, ON THE REAL SURFACE

Booted the alpha with a cleared phone, tapped through TAP TO ENTER, tapped RUN,
tapped WATCH, and then **touched nothing for a minute**. Recorded every write to
the caption element with an observer on the element itself, because a poll drops
any beat shorter than its interval and then reports a line as never shown.

```
scene            act1_cold_open, 26 beats, 10 spoken lines, 1 cut, 1 handoff
captions seen    15
lines on screen  10 of 10
time cards       "BEFORE"  ->  "TEN YEARS LATER"
runs for         62 seconds
page errors      0
marks seen       yes, from watching it (no skip involved)
ends on          the COMBAT surface, 390x804, startColdOpen() live
```

**IT ALL WORKS.** That is the headline and it is worth saying plainly: demo plan
row 7 plays end to end, and **row 10 is closed too**. Row 10 is the three-lane
seam - PEOPLE supplies the runtime and the scene, RUN consumes it, COMBAT
supplies the tutorial-tier family-defense encounter. The scene's own handoff beat
names `startColdOpen`, and measured on the real surface **that call fires and the
player lands in the fight.**

The 8/19 note in the runtime says the raid "has never been played from anywhere".
That is now stale, and this is the correction: it plays, from the opening, on a
fresh phone, every time.

## THE ONE THING THAT LOOKED WRONG AND WAS NOT

The first comparison said 9 of 10 lines reached the screen, missing:

```
"{sibling_lost}. Green ones too. We do this every night."
```

That is a template. It renders with the sibling's name substituted in, so the
authored string can never appear verbatim and demanding it would fail on a
**correct** substitution. The check compares the literal halves either side of a
`{token}` instead. Ten of ten.

---

## AND THE SEQUENCE IS FOUR SCENES, NOT ONE

The 7/19 opening vision is explicit that this is one unbroken sequence: night
raid, grief dinner, burial on the ridge. Walked on the page:

```
act1_cold_open   26 beats  10 lines  -> COMBAT (startColdOpen)  -> act1_the_last_room
act1_the_last_room  11 beats  2 lines -> act1_grief_dinner
act1_grief_dinner   16 beats  6 lines -> act1_ridge_burial
act1_ridge_burial   15 beats  5 lines -> (tutorial ends here)

4 scenes, 68 beats, 23 spoken lines. Every link resolves.
```

A gate cannot win the tutorial fight to reach scenes 2 through 4, and should not
pretend to. **What it can do is walk the chain**, and that is precisely where the
8/19 bug lived: a name that resolves to nothing looks identical to a finished
sequence at runtime, because `openContinue` simply returns false and the opening
quietly ends early. Every link is now looked up on the page the game runs in, and
a broken one is named out loud in the failure line.

## THE GATE

`gates/opening_gate.js` goes 24 claims -> 40. The new ones live in one block
whose first rule is that **nothing in it taps SKIP.**

Everything it checks is read out of the scene at runtime through `openScene()` -
the same call the game makes, so it already carries his DIRECT tab edits:

- the line list comes from the scene's say beats
- the time-card claim only applies if the scene has a cut beat in it
- the handoff claim reads the scene's handoff and looks the named function up on
  the page, so **a rename on either lane's side turns it red** instead of quietly
  ending the opening early - which is the exact failure that hid the raid
- where it lands is compared against what the scene says it hands off to, read
  through the alpha's own switcher contract (`.tab.on` by `data-p`), so no panel
  id is typed into the gate at all

That last part matters more than it sounds. **An assertion that pins today's
answer instead of today's rule fails the day the answer legitimately changes**,
and this lane has now paid for that five times. If he rewrites a line in DIRECT,
the spec moves and the gate follows. If he cuts the flashback, the time-card
claim retires itself. If COMBAT renames its entry point, one claim goes red and
names the function.

## THE MUTATION PROOF

**THE GATE HAS TO CREATE THE CASE IT CLAIMS TO TEST.** Fourteen assertions that
have never been red are sixteen assertions nobody has any reason to trust. The
alpha was broken three ways, the real gate run against each, and the file
restored from a byte-for-byte backup afterwards (never `git checkout`, which
throws away uncommitted work - this lane has paid for that one too).

| break | what went red |
|---|---|
| **M1** nothing marks it seen, and COMBAT renames its entry point | watching counts as seen; skipping counts as seen; the handoff names something callable; it took you there |
| **M2** the caption never updates after the first frame | not frozen; every line reaches the screen; every line has a name; the time card changes |
| **M3** the scene ends and the runtime does nothing (a freeze) | plays to the end; over inside two and a half minutes; counts as seen; it took you there |
| **M4** the runtime refuses to start, the page throws, and the second scene is renamed out from under the handoff pointing at it | starts at all; plays to the end **at 0s**; nothing threw; every scene the chain names exists (it printed `act1_cold_open:26 -> !!act1_the_last_room`) |

**Twelve of the fifteen new claims have now been red.** The three that have not:
"the page resolves an opening scene with lines in it", "it leaves you on a live
surface with real area", and the chain-level copy of the callable check (its
scene-level twin went red under M1). Named here rather than left implied.

### M4 CAUGHT A HOLE IN MY OWN HEADLINE CLAIM, WHICH IS THE POINT OF DOING THIS

"The overlay is not showing and the runtime is not running" is **also true of a
scene that never started.** Stub `openStart` and the loudest assertion in the
block - THE OPENING PLAYS ALL THE WAY TO ITS END - would have gone green on an
opening that did absolutely nothing, in 120 milliseconds, with the words "plays
all the way to its end" next to it.

Found by asking what each claim would do under a mutation, not by watching it
pass. The fix is one `&&`: the claim now also requires that the runtime was
observed in play after the tap. Measured proof rather than an argument - under M4
it reports **`(0s)`** and goes red, which is exactly the vacuous case it could not
previously see.

This is the same family as the five earlier misses in this lane, one level up: it
is not enough for an assertion to describe today's rule, **it also has to be
unable to pass for a reason that has nothing to do with the rule.**

## THE COST

The gate goes from about 60 seconds to about 190. The extra two minutes buy the
only proof in the repo that the first minute of the demo plays.

## THE FULL SUITE FINISHED, AND TWO OF THE REDS WERE ACTUALLY MINE

419 gates, 73 minutes, 26 red. Fifteen are on the handoff's documented inherited
list. The runner's own confirm pass re-ran every red ALONE and cleared one as load
(FIGHT MOVES YOU), which is exactly why that pass exists. Two were mine.

### BANNER: FIXING THE OUTPUT DID NOT FIX THE GENERATOR

`engine/bohemia_clout.js` and `engine/bohemia_deeds.js` were inlined into the city
page behind a banner the ENGINE SYNC scanner cannot read - one line naming both
modules, with no `engine/` prefix - so the sweep counted them as zero modules and
both bodies sat outside the law that keeps one canonical copy of each.

**The RUN lane already fixed this on 8/21.** They wrote a tool that repairs the
banners in the city page, and it worked. But **this lane's tool GENERATES that
region**, so the next run of it put the hole straight back. Measured before
touching anything: the combined banner was in the page exactly once, so the
regeneration had already undone their repair.

A generator and its output are not two places to fix a bug. Fixed at the source.
Verified the fix is comments only, which for a sync-law repair is the whole bar:
both module bodies still byte-for-byte verbatim (3,874 and 13,800 bytes), region
grew by 3 lines, BANNER 12/2 -> 14/0. ENGINE SYNC still reports 18 modules and zero
drift, unchanged and correctly so - nothing HAD drifted. What changed is that these
two can now be SEEN to.

### DIALOGUE CATALOGUE: MY OWN REGRESSION, AND THE GATE WAS THE VICTIM

It reported eight reaction keys as INVENTED - `saw:` and `heard:` for quiet,
notable, risky and reckless. **All eight are real tags.** The gate read
`CLOUT_WEIGHTS` out of `bohemia_loop.js` with a regex for an object literal, and
this lane extracted that table into its own module, so loop now holds a
**reference, not a literal**. The regex matched nothing, the tag list came back
empty, and the next claim then called every genuine key invented. Both claims were
lying, and the lane that moved the table did nothing wrong.

The rule is "the clout tags the world produces". Pinning the FILE that holds them
is not that rule, and it failed the first day the file changed - the same family as
the five pinned-answer misses above, one layer out. It now sweeps `engine/` for the
literal and NAMES the module that supplied it in the pass line, so the next move is
visible instead of silent. 60/2 -> 62/0.

## A THIRD FINDING, HANDED TO WHOEVER OWNS THE LOOK TAB

Not mine to fix, and named rather than left as a mystery red.

`gates/look_gate.js` asserts "no picture is more than six hours behind the
surface it photographs". It measures that with **file mtimes**:

```js
if (fs.statSync(shot).mtimeMs < fs.statSync(surface).mtimeMs - 6*3600*1000)
```

A CHECKOUT WRITES FILES WITHOUT CHANGING THEM. Rebasing this lane onto the
newest main turned that claim red with 19 stale pictures. Measured which
surfaces they are clocked against:

```
12 stale  slices/BOHEMIA_CITY_WORLD.html   <- this lane has ZERO diff in it
 7 stale  slices/BOHEMIA_ALPHA_0_9.html
both files mtime 05:36:42 / 05:36:50 -- the second the rebase checked them out
```

Twelve of the nineteen photograph a file nothing in this turn touched. The
pictures are not behind the surface; **the surface was merely rewritten to disk
with identical bytes**, which is what git does on every checkout, stash pop and
branch switch.

This is the same family as everything else in this record, one layer down: the
RULE is "the picture is older than what it shows", and the MEASUREMENT is "the
file was written more recently". Those agree right up until somebody checks the
repo out. The honest fix is to clock against CONTENT (hash the surface and store
it in the manifest) rather than against mtime; then a checkout is free and a real
edit still goes red. Until then, any lane that rebases inherits a red it did not
cause and cannot clear without re-shooting pictures of unchanged pixels.

## THE MACHINE

| file | what |
|---|---|
| `gates/opening_gate.js` | 24 -> 40 claims; the playthrough block and the chain walk |
| `tools/bohemia_opening_patch.py` | the stale 8/19 raid comments corrected at source |
| `slices/BOHEMIA_ALPHA_0_9.html` | same two corrections, plus the build stamp |
| `tools/bohemia_city_deeds_patch.py` | one scanner-readable banner per module, at the generator |
| `slices/BOHEMIA_CITY_WORLD.html` | that region regenerated; banners only, bodies verbatim |
| `gates/dialogue_catalogue_gate.js` | reads the clout table wherever it lives, and names the module |

# E20 [song length] ROUND TWO: I NEARLY PUBLISHED THAT THE MUSIC WAS BROKEN. MY OWN DOOR NEVER OPENED.

EYES AND EARS, lane 17, E20 round two, resumed after nine rounds paused. 9/22/26.
Round one: records/BOHEMIA_EYES_E20_ROUND_1_SCHOOL_THE_PREMISE_ALREADY_MOVED_9_13_26.md.
Measured on the DEPLOYED CUT of BUILD 9/23a and on the alpha, 240 seconds a side.

---

## THE RETRACTION FIRST, BECAUSE IT IS THE ROUND'S REAL FINDING

The first cut of this probe read `CITYMUS.on` as FALSE on both surfaces, saw ZERO rests in four
minutes, and had a finding written and a record drafted: *the shuffle that hands one song to the
next is off when a stranger opens the demo.* All four of its controls were GREEN.

**It is not off. My probe's door never opened.** The probe entered the game with a scripted
`element.click()` on the splash 2.5 seconds after load. The click was lost, the splash stayed up,
the game never started, and a game that never started has no music. Every number under it was a
number about a title screen.

**Nothing was published.** It was caught by asking one more question before posting: *is the
thing I am about to call broken actually running?*

### AND THE FIRST A/B DID NOT ANSWER IT EITHER, BECAUSE IT MOVED THREE THINGS AT ONCE

A real touch tap got in and a scripted click did not, which looks like proof that trusted input
is required. It is not proof of anything: the two arms differed in the KIND of press, in WHICH
element got it (the splash container versus whatever sits at its centre, which is the BEGIN
button), and in WHEN it happened. Five arms, one difference at a time, one cut:

```
  real touch on the splash centre at 2.5 s     door opens     shuffle comes on
  scripted click on the splash at 2.5 s        DOOR STAYS SHUT   nothing
  scripted click on the splash at 35 s         door opens     shuffle comes on
  scripted click on BEGIN itself at 35 s       door opens     shuffle comes on
  real touch on the splash centre at 35 s      door opens     shuffle comes on
```

**It is WHEN, not what kind and not which element.** A press during the boot freeze is lost if it
is scripted and lands if it is a finger, because the browser holds a real input event until the
main thread frees up, while a scripted click fires into a page that has not wired its handler yet
and is gone forever.

**THE LESSON FOR EVERY INSTRUMENT IN THIS LANE: a scripted press inside the first thirty seconds
is not a press.** The five-minute walk taps at 31 s, so it was safe by timing and not by design,
and the horror check clicks at 2.5 s and got in anyway, which makes it a race it happened to win.
A race is not a method. All three tools now tap with a finger and **the door is a control** in
each: the splash must be gone and the game's own HUD must be there, or nothing below is about the
game. All three read the HUD music chip on entry, so the proof is in each result file.

---

## NOW THE ROW'S FOUR NUMBERS, WITH THE DOOR OPEN, FIVE CONTROLS GREEN, BOTH SURFACES

```
                                        DEPLOYED CUT        ALPHA
  the shuffle comes on after the door    3.84 s              3.85 s
  the first handover, after the door     131.39 s            131.40 s
  so the song ran                        127.55 s            127.55 s
  the gap itself, on the clock           16.47 s             16.14 s
  the gap the engine intends             16,000 ms           16,000 ms
  the bed's level inside the gap         0.800               0.800
  rests refused, and counted honestly    13 of 939 samples   13 of 939 samples
  handovers in 240 seconds               1                   1
```

**The row's "every song gets exactly 128 seconds" is TRUE, and it is not a number about buffers.**
The arrangement is 64 bars. At the 120 BPM law a bar is 2.0 seconds, so 64 bars is 128.0 seconds
exactly, and the song measured **127.55 s on both surfaces** before the music rested. The 0.45 s
is my sampling tick and the ramp, not a discrepancy.

**The gap is 16 seconds and it clears round one's floor five times over.** Round one found the
published floor: beat anticipation falls apart past about two to three seconds, so a gap under
that is a stumble rather than a breath. 16 s intended, 16.1 to 16.5 s measured. The part of the
row that said *the next song starts on the very next beat* is the stale part, exactly as round one
said: the rest exists now and it is long.

**The bed really ducks.** Inside the gap the master sits at 0.800, read out of the engine's own
captured level rather than typed by me, and outside a gap the field does not exist at all.

---

## THREE BUGS IN MY OWN PROBE, ALL FOUND BY ITS OWN CONTROLS, ALL WRITTEN INTO IT

**1. Two of the things I was reading are METHODS, and I read them as values.** `restLen` and
`restBlocked` are functions on the music object. Serialised instead of called, they came back
empty every sample, so the rest length printed as "the engine intended undefined" and the refusal
control announced "0 refusals" over a field that had never been asked anything. Called properly:
16,000 ms, and **13 real refusals**. A counter over a field that does not exist is not a zero, it
is a number about nothing. That is E28's lesson from last round, one file later.

**2. The controls ran in the wrong ORDER, and that made two of them fail on a healthy game.**
Forcing a rest twelve seconds after the door asks for a rest while the menu song still owns the
master, and the engine refuses that by design: its own line reads *already silent: nothing to
rest.* So the force ran against silence, the sampler correctly saw nothing, and the control called
itself blind. The force now happens AFTER the watch window, its return value is captured instead
of thrown away, and **a natural rest counts as the positive control** because seeing the real
thing begin and end is better proof than seeing a forced one.

**3. One fixed output file let the second surface eat the first surface's proof.** The deploy run
watched 240 seconds; the alpha run then wrote over it with 20, so the saved file said 20 s while
the number in my draft said 240. Same class as the runner that truncated its own results two rows
ago. The file name carries the surface now and the window length is stored inside it.

---

## THE FORM, COUNTED WITHOUT A BROWSER, AND STATED PRECISELY THIS TIME

Round one claimed every song shares one arrangement. Counted in the 5.5 MB shipped alpha:

- **one** `ARR:[...]` definition, the sixteen four-bar sections
- **one** `RT:[...]` definition, the sixteen root shifts
- **one** read of each, inside `songCtx`, which does `bar = floor(step/16) % 64` and
  `section = floor(bar/4)`
- **one** more read of the arrangement, in a developer readout

**No song row overrides either.** So every song plays the same sixteen sections with the key
moving at the same sixteen moments, and the length is identical because the form is identical.
(My draft said "the string appears three times", which is loose: the string `MUS.ARR` appears
once. What is true is the three places above.)

---

## THE TWO STANDING JOBS, SAME ROUND, BOTH NOW WITH A DOOR CONTROL

**E26, the five minutes, on the deployed cut of BUILD 9/23a, ten of eleven controls green.**
The dead list reproduced independently on a newer cut, and then **one item came off it because my
own new rule threw the evidence out.**

`SCAVENGE 8H` came back DEAD while its own evidence showed eight novel words elsewhere on press
one and the panel under the finger was the top-left stack for press one and the day card for press
two. That reads like the press OPENED THE DAY CARD; press two then measured a different screen,
found nothing new, and the repeatability rule turned one real answer into a dead button. It is
rule 14(h) one step along: **if the panel under the finger is not the same panel both times, the
pair is void and the honest word is UNDECIDED, never dead.** Built, and the re-walk moved that
item out on its own.

```
  dead on the first screen, both presses, panel still open   6
  pairs thrown away because the screen changed underneath    1  (SCAVENGE 8H)
  things pressed in the five minutes                        23
  things the first screen offers                            11
  a stranger's first tappable thing arrives at              30.4 s
  the walk reached a fight                                  never
  real page errors                                          0  (two clipboard warnings, no error)
```

The six: `BUILD HERE` 44x44, `STANDING` 44x44, `RAY` 33x45, `DENISE` 51x45, `MARCO` 48x45,
`Marry` 44x44. Two core verbs on the first screen a stranger sees and the whole family panel. Not
everything is dead, and that is what makes it read badly rather than broken: the gear, MUSIC,
SAVE, SLEEP and BIKE all answer. Already bounced as LIFE + CITY [eyes: half a hud]; no new
bounce-back this round.

**And one number of mine is not stable, so I am saying so rather than picking the flattering
run.** How often the world moves something novel with nobody touching the screen read 51 of 60
windows on this round's first walk, then 1 of 60, then 0 of 59, on the same cut. The ledger's
sensitivity swings with the machine's mood. It does not change any verdict above, because every
verdict needs movement the ledger has NEVER seen, and a noisier ledger only makes that harder.

**E28, the horror check, third cut running, zero findings, all six controls green.** R3 the long
hold: 3.5% of the frame moved in the worst four-beat window against the bible's 10% bar, 0 of 8
windows over. R8 diegetic or dead: 131 full-frame draws on the world canvas, all 131 opaque
clears, **0 see-through overlays**, with 136 more on sprite scratch canvases that an earlier
version of this tool wrongly counted as overlays. R10 grime is baked: 0 filters and 0 composites
on the world. The other seven rules stay UNMEASURED and each says what it waits on.

---

## AND THE SAME METHOD, POINTED AT A CHECKER, FOUND A ONE-CHARACTER HOLE IN THE HANDOFF GATE

Writing the handoff is the last thing a round does, so the handoff gate ran, and its block-head
check went red on a block **main itself had replaced**, not on anything of mine. Checking why
turned up something worse.

That check exists because 93 commits quietly deleted 80 lanes' newest blocks, **19 of them
mine**. It reads the file for lines shaped `LANE (slug): date (x) LATEST` and demands that every
one HEAD carries still be present. **The round marker in that pattern accepts exactly ONE
letter.** Mine is two, because this lane is past its twenty-sixth round: `9/22 (ap)`. So is the
coordinator's: `9/5 (bf)`.

Proved the way this round taught me to, one difference at a time, in a throwaway tree on current
main:

```
  delete PLUMBER's newest block, head "9/23 (b)"                   GATE RED   (7 passed, 1 failed)
  the SAME block, head changed to "9/23 (bb)" and committed first  GATE GREEN (8 passed, 0 failed)
```

One extra character in the round marker and the check goes blind. It sees 230 heads in the file
and 137 more of the same shape are invisible to it: 6 for the two-letter marker (**live heads**,
mine and the coordinator's) and 131 for a slug with no hyphen, which is the older naming of
retired or renamed lanes and therefore history rather than live state.

Today my lane in main carries one block, so the older fleet check still covers me; the moment I
carry two, my current state is unprotected by the check built after I lost nineteen blocks. That
is one line back to PLUMBER, not work I do: gates are that lane's, and a lane fixing another
lane's checker is how a checker stops being trusted. -> PLUMBER `[eyes: head blind]`.

## BLIND SPOTS, STATED

The bed's level is the number the engine set, read from its own gain field, not a microphone. Only
ONE handover fits in a four-minute window, so the 16 s gap is measured once a side and not
averaged over many. No fight was reached, so the fight halves of rule 21 and of the bible stay
somebody else's number. Whether the menu song and the street song sound alike at the seam is a
taste question and belongs to DIRECTION, never to this lane.

## PROOF

- `tools/bohemia_eyes_the_handover.js`, five controls, the retraction written into its head
- `records/BOHEMIA_EYES_E20_THE_HANDOVER_DEPLOYCUT_9_22_26.json` and `..._ALPHA_9_22_26.json`
- `tools/bohemia_eyes_five_minutes.js` and `tools/bohemia_eyes_horror_check.js`, each with a door
  control and a real tap
- the arrangement and root-shift counts taken from the shipped alpha with no browser at all

# BOHEMIA ADDENDUM — THE PULSE JOINS THE LADDER (Paolo 7/26/26)

> "Nice, I'm fucking with pulse starting off on soft so essentially zero kills
> and then the old system we had kicks off at two kills then it upgrades the beat
> at four kills and then maybe it goes to hard on five kills. Does that make
> sense?"
> — Paolo, 7/26/26

LOCKED. Shipped the same turn. It makes sense and it is better than what I built.

---

## 1. THE DESIGN IS HIS AND IT ANSWERS HIS OWN EARLIER QUESTION

Two messages earlier he asked how to "strike the balance with the two kill and
four kill progression and your pulse mode thing." This is his answer to his own
question, and it is the right one: **the pulse was a PARALLEL system competing
with his 7/3 ladder. Now it is the same ladder's floor and its ceiling.**

```
 0 kills   PULSE SOFT      the floor is there, tucked back
 2 kills   his RUNG 1      the hats     (his 7/3 LOCKED law, untouched)
 4 kills   his RUNG 2      the bass     (his 7/3 LOCKED law, untouched)
 5 kills   PULSE HARD      the floor opens up under all of it
```

One progression. Four steps. His numbers. His two rungs sit INSIDE it, unedited,
on their own voices.

This kills the collision v76 was patching around. The pulse and the ladder were
both spending their budget on percussion and arriving at unrelated moments; now
they are one staircase where each step has a different job. The floor is always
present so there is something to lock to from the first shot, his rungs carry the
middle, and the floor only opens all the way when the fight is genuinely going.

## 2. IT KEYS OFF `_sk`, NOT A RAW KILL COUNT

`_sk` is the number the whole music ladder already runs on, which means:

- **V71 still holds without restating it.** Downed, crawling, broken and fleeing
  men all count. ("if I didn't shoot them they typically would be dead... that's
  part of a kill... I hate to see that you're not recognizing them.")
- **V74's GROOVE chain still counts.** A full chain floors the ladder at 6, which
  resolves to HARD **with nobody down** — so a player genuinely in the pocket can
  open the floor on rhythm alone. A broken chain floors at 0 and stays SOFT. The
  top rung is earned by bodies or by playing well, never by nothing.

**There is exactly one definition of intensity in the fight.** That is the point.

## 3. THE BUTTON

`AUTO` (default) → `SOFT` → `HARD` → `OFF` → `AUTO`.

AUTO runs his ladder. The manual modes still win when forced, so he can A/B any
rung against any other, and **OFF is still an honest revert to the bare creeper
exactly as approved.** The verdict stays his ear.

## 4. THE GATE

`gates/combat_lab_gate.js` section 16 (310 checks total, 0 fail). It EXECUTES the
ladder rather than describing it: `resolve('auto', n)` is run at 0, 1, 2, 3, 4, 5
and 9 down; `HARD_AT` is asserted to be a named constant and not a magic number in
a branch; the GROOVE core is pulled out and run to prove a full chain actually
reaches the top rung and a cold one does not; the manual overrides are proven to
still win; and his 7/3 rungs are asserted byte-present and unmoved (with
`song_lock_gate` byte-checking the same thing from the other side).

Real-surface proof (`slices/BOHEMIA_PULSE_LADDER_PROOF_7_26_26.png`): men taken
out one at a time in a live fight, the ladder stepping SOFT → SOFT → SOFT+hats →
SOFT+hats+bass → HARD exactly on his numbers, zero console errors.

---

## 5. HIS SECOND QUESTION, ANSWERED BUT NOT BUILT

> "The only thing is though, when it's not in combat, I still wanna find a way
> that the two and four kill progression like calmly just gets implemented into
> the actual songs. You know what do you think? How do you think that?"

He asked what I think. This is the thinking. **NONE OF IT IS BUILT** — the driver
is lore and it is his to rule.

### THE PROBLEM, PRECISELY

In the overworld the ladder is not gated, it is **unreachable**. `MUS.layers`
initialises to `0` and the ONLY thing in the entire build that ever assigns it is
the three preview buttons in the music studio. Four of his six creepers are
`klay:'melody'`, and for those the rungs ARE the song's own lead blooming and
then doubling an octave up. So out in the city, those parts never play. Ever.

### WHAT SHOULD DRIVE IT — MY RECOMMENDATION: TERRITORY

Not time, not distance, not randomness. **LIGHT = TERRITORY**, which is already
LOCKED canon, and its sibling CLUSTERED POWER (12% lit, owned, the NETWORK's grid
eerily perfect, nobody patrols the dark).

- **Rung 1** when you cross into lit, owned blocks. Somebody's power is on here,
  which means somebody is here.
- **Rung 2** deep inside a grid, where the lights are perfect and that is worse,
  not better.
- **Calm again** back in the dark.

Three reasons this is the right driver and not just a driver:

1. **It needs no new lore.** It is applying canon he already set, so I am not
   inventing content that is his.
2. **It is already on screen.** He can SEE why the music grew, which is the
   difference between a system and a mystery.
3. **It carries the same emotional cargo as two men down without any violence.**
   Two men down means "this is real now." Standing in somebody's light means
   exactly the same thing. That is why the same two rungs fit.

### HOW IT ARRIVES — AND THIS IS THE PART "CALMLY" IS ABOUT

The word he used is the whole design note. In combat a kill is a SNAP, so the
rung snapping in is correct and reads as impact. Outside, a layer popping on
mid-phrase would read as a bug.

**So outside combat the rung enters ON A SECTION BOUNDARY and fades in over one
bar.** His 7/3 form already changes section every 4 bars (8 seconds). A layer that
arrives exactly when the arrangement turns sounds COMPOSED — like the song
decided to open up — instead of triggered. It leaves the same way, one rung at a
time on a boundary, so walking back into the dark decompresses rather than cuts.

That half is mechanism and it is mine to build. **The driver is his to rule.**

### THE SMALL PRINT HE SHOULD KNOW BEFORE RULING

The overworld runs a **different player** (the parent's `MUS`, shuffled by
`CITYMUS`) from the combat demo. They share the song data and the voice banks but
not the sequencer. So this is not a one-line switch: whatever drives it has to be
posted from the world into the parent's player. That is real work, but it is
ordinary work, and it is the last thing standing between his four melody creepers
and ever being heard whole outside a fight.

**[PENDING Paolo]** — the driver. Nothing ships on this until he says.

# A LIT BLOCK HUMS (9/5/26, SOUNDS lane)

VAMILY line for this lane: **[power hums] BB-A-LIT-BLOCK-HUMS**. LIGHT=TERRITORY
through the ear, and the row is explicit that it needs no canon from him at all:
**a hum is not a name.**

Its ship test is one line, and this whole round is built on both halves of it:

> **a live circuit is audible AND A DEAD ONE IS NOT**

## MEASURED FIRST

    the shell's mentions of the power grid       0
    callers of `generator` tied to power         0
    callers of `power_on` (2 of 5, 8/20)         0

The ambience bed picked `generator` on a die roll — 12.5% outdoors, and since
earlier this round weighted by district — and **nothing in that chain had ever
asked whether the block you are standing on has power.** So a machine could hum
on a pitch-black dead street, and a live circuit, which is 12% of the valley and
every one of them **owned**, sounded exactly like the dark.

Meanwhile the grid is finished code on the walked surface. `POWER.at(x,y)`
answers `{live, owner, id}`, circuits are feeder-sized runs of about six cells,
and since BB-THE-NIGHT-EATS-POWER shipped this round a circuit you cannot pay for
**goes dark and stays dark**. Ten readers on that surface already ask it — the
lamp pass, both "is it black in here" checks, the fire barrel. **The sound was
the eleventh reader and it never asked.**

## WHAT IT DOES, AND EVERY NUMBER IS THE GRID'S ANSWER

- The city, on the four-second report it already sends, scans the 7×7 block of
  overmap cells around you and reports the **Chebyshev distance to the nearest
  live circuit**, and which side. `-1` means nothing live within three cells.
- The bed places the hum at that **real distance** instead of the random "6 to 15
  tiles" it used for everything: on the block ~2.5, next street ~11, two streets
  ~20, three ~29. `placeSound`'s inverse law and its distance lowpass do the
  rest, so a generator a block away comes back quiet **and dull**, which is what
  a block of distance actually sounds like.
- **And with no live circuit within three cells, the hum does not play at all.**
  Not less often. Never. That is the half of the ship test everybody skips.

**The lit sign goes with it, and that is not scope creep.** `sign_alive` is a
neon sign that is ON. A sign cannot be alive on a circuit nobody is feeding — it
is the same fact about the same block — so it takes the same gate. Without that,
a dead street would still advertise, which is exactly what LIGHT=TERRITORY says
it cannot do.

**The valley is not silent on a dead block, it is machine-less.** The wind still
comes through and the air still plays. A dead street is a place, not a hole.

## THE GROUNDING IS THE ROW'S OWN

The 2020 lockdowns cut human-generated high-frequency ground noise **by up to
50%**, the largest such drop ever recorded and largest in the *densest* cities,
and signals that had always been there **became clearly audible**. **Dead is not
silent, dead is a different bed:** when the machines stop you do not lose sound,
you lose the layer that was masking everything else. A working generator four
blocks away in a dead valley is loud — which is why the distance had to be the
grid's answer and not a taste dial.

## WHAT IT DOES NOT WIRE, SAID OUT LOUD

`power_on` ("THE BLOCK LIGHTS — the grid takes a block") still has no caller,
because **its moment does not exist.** `POWER.douse()` has one (the night bill);
`POWER.relight()` has **none**, by a decision written into the grid itself:
*"what it costs to get your lights back is a price, and prices are Paolo's."* A
block being taken and lit is not a thing that can happen yet. It stays cooked,
judgeable, and keeps its written waiver rather than getting an invented caller.

**And a report without the field is exactly what it was.** The run slice sends no
`litD`. `null` means "not reported" and `-1` means "looked, and it is dead" —
different facts, and conflating them would have silenced the run slice's bed.

## THE GATE

`gates/lit_block_hums_gate.py`, 19 claims, on the real surface, and it counts the
grid first as a control: if every cell near the player were live or dead, every
claim would pass or fail for a reason that is not about sound.

    A  `_hum` forced true (a dead block hums anyway)   -> RED x3
    B  the distance back to the random taste dial      -> RED
    C  the city stops reporting the distance           -> RED
       restored                                           19 passed, 0 FAILED

**Two broken rulers, both mine, and the second one is written into this repo
already.**

1. **I measured the limiter, not the distance.** On the master bus the hum on
   your block and the hum a block away both read `0.057` — identical to three
   decimals — on a build where `placeSound` was being handed 2.5 and 11. The
   master carries a brickwall limiter (threshold −5, ratio 20, added after the
   7/8 screech) and it was squashing both to the same ceiling. Measured on the
   bed's own bus, upstream of it.
2. **Max of three plays is not a measurement, and the SPACES block in the same
   file says so:** *"the difference between two of his candidates is bigger than
   the difference a room makes."* `placeSound` draws a random candidate every
   call. Three plays gave 0.075 against 0.064 where the inverse law says 0.42
   against 0.14 — candidate variance swamping the thing being measured. Ten plays
   and the mean.

## AND TWO OF MY OWN EARLIER GATES WENT RED THIS ROUND

**BEAT FIRST was red on plain `origin/main`, before I touched anything.** Not a
regression in the game: a **fixed wait rotted**. The gate waited
`waitForTimeout(9000)` after the tap, chosen when the city build took about nine
seconds. Other lanes kept adding to the city, the build now takes over ten, and
the pulse covers **twenty** beats instead of thirteen — so the gate walked up and
looked at the handoff *before it happened* and reported "the song never handed
over" on a build where the pulse ran perfectly. Proved by probing plain
`origin/main`, where the handoff lands at exactly 20.0 beats. **A FIXED WAIT IS
NOT AN EVENT.** It waits for the handoff now.

**BED IS PLACE went red for a real interaction, and the gate was at fault.** This
row's change means the generator and the lit sign do not fire on a dead block —
correctly. That gate rolls `pick()` to test the *district* lever, never set
`litD`, and the run happened to spawn on a dead block, so a second variable it
did not control was doing all the talking. **A measurement of one lever has to
hold the other one still.** It pins `litD = 0` now.

## REUSE CHECK

Cooks nothing. No bank, no candidate, no pixel, no new event. It uses
`generator` (4 of 5, 8/20) and `sign_alive`, both already in the bed's own pick
list, through `placeSound`, which has placed the bed's rare sounds since 8/14.

## WHAT HE WOULD NOTICE

Walk a dead street at night and there is wind and air and nothing mechanical at
all. Come within a block of one of the lit circuits and you hear it before you
see it — a machine running somewhere off to one side, quiet and dull with the
distance. Stand on it and it is right there.

Tab: **RUN** (the walked city). Nothing to judge — no sound was cooked.

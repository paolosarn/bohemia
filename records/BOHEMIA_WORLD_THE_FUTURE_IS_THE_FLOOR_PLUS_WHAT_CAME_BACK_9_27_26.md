# THE FUTURE IS THE FLOOR PLUS WHAT CAME BACK (9/27/26, WORLD lane)

Row `[future city]` ACT-TWO-AND-ACT-THREE-ARE-COMPUTED. Rules 31, 32(b) and 33.
**Nothing shipped to a play surface** — rule 18 holds. The cook went to the VOTE
tab and it is drawn.

---

## 1. THE BLOCKER WAS REAL AND IT IS GONE

The row says *"waits for DYNASTY's two school rounds; claim nothing here yet."*
Rule 12 says measure a named blocker rather than obey it. Measured: **both school
rounds have shipped** — `[three at once]` 9/23 and `[the derive]` 9/24. The clause
was written when zero of two had landed. Claimed and pushed before the work.

## 2. WHAT THE ROW ACTUALLY ASKS FOR, AFTER HIS CORRECTION

The row was re-aimed 9/24 by his DOWN vote on THE SAME CORNER:

> *"the future gets better. The right side is what the **BEGINNING** of the game
> is supposed to look like, and it gets better... reclaims parts of cities for
> economic purposes, more techy and modern."*

**ACT 1 IS THE FLOOR. Act 2 and 3 are the floor plus what was reclaimed. Nothing
decays below the start.** Plus rule 33 and his 9/24 words: the future city **is
the map** at act 2 and act 3 — the same roads, the fill derived.

And DYNASTY's round two named the design and the gate before anything existed,
which is the bar existing before the work rather than after it.

## 3. WHAT WAS BUILT

`engine/bohemia_future.js`, and it is two things.

### THE REPORT CARD — it names what it cannot read

DYNASTY ruled the derive *"ships on seven and NAMES a silent field rather than
zeroing it"*. A field with no source that contributes 0 is indistinguishable from
a field with a source that happens to be 0: **the first is a hole and the second
is a fact.** So `report()` answers `UNREAD` by name, with the reason — the same
three-answer discipline `bohemia_strike` already uses.

What is act-aware today, measured, and it has moved twice since I first counted:

```
built      bohemia_century      per-act from the day it was written
batteries  bohemia_purse        per-act since WORLD [act stamp]        9/24
territory  bohemia_turfledger   per-act since FACTIONS shipped it      9/24
lived      -- nothing carries an act.  UNREAD, by name.
```

**Three of the four now carry an act.** On 9/23 it was one. The gate proves the
fourth is still named rather than quietly zero.

### THE DERIVE — the only operation is ADD, and that is enforced

```
valley(act) = floor + what the ledgers say was reclaimed through that act
```

The floor is **not mine to invent**: it is whatever the seed's valley gives, handed
in by the surface. And rule 32(b) is **checked, not trusted** — if any field comes
out under the floor the derive refuses by name (`WOULD_DECAY_BELOW_THE_FLOOR`),
and if an act ever adds a cell it refuses with `THE_LINES_MOVED`. Writing "nothing
decays" as a comment and trusting it is exactly how that clause would rot.

`LOOKS` — what a poor valley and a rebuilt one *look* like — **ships empty**, the
same way `TIERS` does. The mechanism is mine; the numbers are his.

## 4. THE GATE: SIX OF EIGHT LEGS, AND THE OTHER TWO SAID OUT LOUD

`gates/three_acts_gate.js`, **23/0**, and **the floor is the real valley measured
every run** (seed 1337: 9216 cells, 3538 street cells, 432 lit, 215 people), so
leg 1 is a statement about the game and not about a fixture.

```
1  THE FLOOR IS PLAYABLE     act 3 off an EMPTY act-1 ledger still has
                             9216 cells, 432 lit, 215 people
2  ONE ROW CHANGES IT        two act-1 builds move `standing` 0 -> 2,
                             and NOTHING ELSE MOVES, so it cannot pass on noise
3  THE HANDS SURVIVE         act 3 keeps its own 5 builds when the past changes
4  THE LINES DO NOT MOVE     9216 / 9216 / 9216, and the layout is the SAME
                             OBJECT by reference in all three acts
5  SAME LEDGERS, SAME FUTURE byte for byte across two derives
6  A SILENT FIELD IS NAMED   with all three act-aware ledgers handed in,
                             `lived` is STILL UNREAD and says why
```

**LEGS 7 AND 8 ARE NOT BUILT AND THE GATE SAYS SO ON EVERY RUN.** They are about
a flip — a flip may not rebake the body catalogue, a flip lands inside a beat —
and **nobody has built a flip yet** (DYNASTY `[the flip]` is CLAIMED, not
shipped). A gate that silently carries six of eight legs is how a bar gets
lowered without anybody deciding to.

Red five ways: let the derive subtract → 3; turn a silent field into a quiet zero
→ 1; copy the layout instead of sharing it → 1; put a default in `LOOKS` → 2; let
an act add a cell → 9.

## 5. THE COOK: THE SAME VALLEY, THREE ACTS

`slices/vote/WORLD_THE_VALLEY_THREE_ACTS.png`, from the map camera (rule 32f).

The row's whole claim in one picture: **the lines do not move and the light comes
back.**

```
             lit cells    share of the grid    biggest lit patch    patches
  act 1         432            12.2%                  12              178
  act 2         618            17.5%
  act 3         771            21.8%                 139              163
```

- **Act 1 is what we actually ship**, read off the real grid — not an artist's
  idea of a ruin.
- **Reclaim grows CLUSTERS** from a few owned sources, which is his CLUSTERED
  POWER law (7/14) **arriving as the future rather than as a fix**. The biggest
  lit patch goes from 12 cells to 139.
- **Nothing is ever switched off.** Every cell lit in an earlier act is lit in a
  later one, and the tool refuses itself if not.
- **And the lines were proved on the pixels, not promised: 6,899 ground pixels
  compared across the three panels, 0 moved.** That is leg 4 as a picture.

**AH-01, the one wrong thing: the dark never changes shape.** The unlit valley is
identical in all three, so this is not a city growing — it is a city being
switched back on one block at a time inside a body that never changed. Nobody
says why those blocks and not the others.

**REUSE-FIRST:** the valley is not redrawn. The ground renderer, the palette and
the cluster-growing function come from the 9/24 night tool. One valley, three sets
of lit cells.

**AND MY OWN REFUSAL CAUGHT THE FIRST CUT.** `clustered()` takes an *absolute*
target and I passed "what the base has plus a step", then unioned it with the
base — so each act laid a whole valley's worth of light on the last and **act 3
came out with half the grid lit**. The tool refused in those words: *"this is a
hundred years of clawing back, not a restoration."* The reclaim is the step only.
One cut after that, and it is right; the change between panels is visible but not
dramatic, which is honest — 12% to 22% over a century is what clawing back looks
like, and overstating it would be the lie.

## 6. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** One row, a picture: **THE SAME VALLEY, THREE ACTS**.

## 7. ROUTED

**TO DYNASTY**, for `[the flip]`: the derive is built and pure, so a flip can call
it per act without anything cached. **Legs 7 and 8 of your own gate are still
open** and the gate prints that on every run.

**TO LIFE+CITY**, for the proposed `[the ruin]`: the floor this derive stands on
is the seed's valley, and what it looks like on the glass is yours. The numbers
are in the bank.

**TO WHOEVER LIFTS THE HOLD:** nothing here is wired to a play surface. The
derive takes a layout and ledgers and returns numbers; the caller is the flip,
which does not exist yet.

**STILL OPEN, unchanged and named again:** `lived` has no act-aware source
anywhere in the game, and the light has no core until the `live` roll in
`engine/bohemia_powergrid.js` grows clusters.

# V218 — THE HOUSE BOARD IS THE BOARD (COMBAT lane, `[house board]`)

> **PAOLO 9/15, LOCKED (rule 16, `laws/BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md`):
> "I just entered combat and this is not at the scale that I needed it to be…
> implement it into combat too, right now it's not there."**

He is right, and the reason is one word long.

---

## MEASURED FIRST, IN A REAL CITY FIGHT, BEFORE A LINE WAS WRITTEN

The fight was started the way he starts one: walk up to a crew on the street and tap
one, through the door V217 shipped last round. Then the board was measured with the
fight's **own** functions.

```
WHAT HE MET                      WHAT V198 BUILT AND NOBODY TURNED ON
a tile is 12.2 px                a tile is 65.3 px
a tile is 0.33 sprite widths     a tile is 1.75 sprite widths
35.3 tiles across the screen     6.6 tiles across the screen
a pistol reaches 12 tiles        a pistol reaches 1
a rifle reaches 16               a rifle reaches 2
sight 17 tiles                   sight 6
```

> ### The whole house board is built and the flag that turns it on is `undefined`.

`G.houseTile` is read in exactly one place — `houseOn()` — and it was **assigned
nowhere in the game**, only by a dev button in the bench menu. So the 9/4 ruling A
TILE IS A HOUSE shipped on 9/5 as a **switch**, and the switch has been off for every
fight anybody has ever played. He entered combat and did not find it because it was
never there.

This is the **seventh** time this lane has found the same shape: the material was
built and nothing consumed it — the pull-back, the loot, the city's clock, the
medic's pick-up, the guns' close band, the walked street's twelve moments, the save
at the bell. This one is the purest of them. One undefined flag.

## AND THE BODY IS ALREADY THE RULED SIZE, WHICH IS WHY NOTHING TOUCHES `bodyScale`

The 9/15 law says a person stands *"about half a lot tall at walk zoom"*. Measured on
the fight's own bake, off the **ink**, not off the scale constant:

```
the sprite is 112 x 112 native; the person inside it is 100 px of ink (0.893)
drawn sprite 37.33 px   drawn PERSON 33.34 px   a lot is 65.33 px
SO A PERSON IS 0.51 LOTS TALL
the bodyScale that would put him at exactly half a lot is 0.327
the shipped one is 0.3333 — two percent apart
```

V198 landed the ruled body size a week before the ruling existed. Changing it here
would be inventing a number over a measurement, so it is not changed. What the law
adds beyond V198 — *"bodies are drawn LARGER"* — is delivered **by the tile, not by
the sprite**: the person goes from a third of a tile wide to more than half a tile,
because the tile grew around him. Same thing, seen from the other side.

## WHAT SHIPPED, AND IT IS THE SMALLEST THING THAT MEETS THE RULING

1. **The default flips.** `houseOn()` answers true when nobody has said otherwise, so
   every fight — the street, the door, the teaching fight, the bench — is at house
   scale, with the ranges his 9/4 ruling already named.
2. **The dial survives.** His own V198 row says in his words that the human-scale
   board is not removed. The bench button still flips it, and now flips **what is
   actually on**: it used to toggle a raw `undefined`, so with the default the other
   way the first press would have set it true and read as a no-op.

## AND TURNING IT ON EXPOSED A DEAD FIRST TURN, WHICH IS THE SECOND HALF OF THIS SHIP

Found by running this row's own gate **three times instead of once**. Two runs in
three, the very first fight of the game looked like this:

```
one man, standing at edist 1          which is ADJACENT
a pistol reaching 0.75                which is less than adjacent
steps walked to close the gap         0, and there is nowhere closer to stand
```

> **He could not shoot the only man on the board, and walking could not help,
> because there is no position nearer than adjacent.** A dead first turn, on his
> first fight.

**Why.** The reach floor is `hd(PT_BLANK+2)` — a body-scale number divided by eight —
which lands at **0.75 houses**. V198 divided it for a good reason, stated in its own
comment: an undivided floor would be bigger than every house-scale gun and would
quietly hand a pistol the rifle's reach. But the result is a floor **below adjacent**.
Nights are what drive reach down to it: `rangeMult` halves in the dark, and on a board
whose reaches are 1 and 2, a half is under the floor.

**So on the house board the floor is one house.** You cannot stand closer than
adjacent, so a reach under one tile is not a difficulty, it is a turn you are not
allowed to take — and his 9/4 ruling says a pistol *is* adjacent, with no clause about
the hour. The night penalty still bites everywhere it can: a rifle in the dark comes
down from two houses to one. The body board is not touched.

```
                 at noon    at half light    at a quarter light
pistol              1             1                 1
rifle               2             1                 1
```

This is the shape of the whole row, one layer down: **a dial that was never on hides
whether the thing behind it works.** Three runs found it; one would not have.

## AND THEN IT EXPOSED THE RULING BEING ERASED ALTOGETHER

This one only shows up in a live fight, and it is the most important thing in the
round. Measured with the weapon switched under a real roster:

```
longestFoeReach 3 (a sniper's house reach) + the V151 edge 0.375 = 3.375
a PISTOL's myRange came back max 3.375, clamped by the ceiling to 3
a RIFLE's came back 3.375, clamped to 3
```

> **The same number for both guns.** A pistol reaching three houses is not *"like a
> dagger compared to the range of battle brothers"*, which is what he said when he
> named these numbers.

**V151's granted edge was flattening the whole table.** Its floor lifts you to the
longest gun on the field plus an edge. On a 12-to-16-tile board that is a small bonus.
On a board whose reaches are 1, 2 and 3 it is the table erased.

**Newest date wins, and he typed the numbers.** 9/4 names the house reaches
explicitly, 9/15 re-affirms the scale, and both are after V151. So on the house board
the gun's own number is the answer, and `myRange` returns it untouched. **The body
board keeps V151 exactly**, including its own note that he marked it temporary and
wants earned range instead of granted.

**And V151's purpose survives without it.** Its reason was movement — *"so I want to
see more movement"*, men having to walk to you. On a board six houses across where
reaches are 1 and 2, everybody has to close no matter who is holding what. The scale
manufactures the movement, so the edge does not have to.

The proof is the rout, which is this lane's own row from two rounds ago, and it now
reads the way the design says:

```
a pistol buys you ONE turn of chase
a rifle buys you TWO
```

That is the decision the rout row is about — *take them or let them go* — priced in
ground and turns, at his scale.

## WHAT IS NOT DONE, AND IT IS A MEASUREMENT AND NOT A SKIP

The row says *"entry by camera with the cloud (small or no pull-back now that both
sides share a scale)"*. **The two sides do not share a scale yet.** RUN's
`[step is a house]` is still OPEN on the board, and measured this round the walked
street still moves one **fine** cell a step at C 44. Shrinking V205's pull-back today
would make the entry wrong for the street that exists. Rule 12 says a dependency is a
premise to be measured, and this one measures **false**, so the pull-back stays
exactly as he ruled it on 9/6, and it is routed.

## PROOF

`house_board_gate` — **17 passed, 0 failed, three runs in a row.** It starts a real
fight by tapping a body on the street and measures the board it landed on:

```
house scale, with nobody having touched a dial   true (the flag is still unset)
a tile in sprite widths                          1.75
tiles across the glass                           6.58   (was 35.3)
pistol 1 · rifle 2 · shotgun 1 · smg 1           his 9/4 ruling
a person, measured off the ink                   0.51 lots tall
everybody on the board is inside sight           yes
somebody is reachable                            yes
adjacent is reachable at noon and at night       yes, and a rifle still loses a house
the bench button still reaches the old board     yes, and the label agrees
the damage path knows nothing about scale        yes
the accuracy curve at matching fractions         0.5 against 0.5
```

**Mutation-proved four ways:** put the default back off → **7 red**, including the
tile, the reach, the person and the button label; shrink the person → the *half a lot*
arm goes red; weld the dial on → the two button arms go red; put the reach floor back
under adjacent → the *reachable* and *day or night* arms go red.

**And the lane's own behavioural gates all hold on the new board**, which matters more
than any source check here: the rout gate drives a real eight-man fight, kills half of
it through the shipped death path and watches men break and run at house scale, 11 / 0
three runs running.

### Four instruments were wrong in the old unit, and the board turning on is what said so

1. **The rout gate staged every runner at `edist = 3`** — a distance chosen when a
   pistol reached twelve tiles, so 3 was well inside it. On a board where a pistol
   reaches one house, a runner placed at 3 is gone before the first tick. The runner
   now breaks at the edge of what a pistol reaches, asked of the shipped `maxRange` on
   whatever board is live: `min(3, …)` is still 3 on the body board, so nothing those
   arms were tuned against moved.
2. **That same gate left the time of day rolled**, and `pickDayPhase` is unseeded (a
   known defect on this lane's routed list). At night a rifle's two houses collapse
   onto a pistol's one, so the chase-window arm was a coin flip on the weather. The
   light is pinned to morning for that arm, which is the board the claim is about.
3. **The combat lab slices `maxRange` out of the demo and runs it in Node** with a
   binding list. The house-scale floor made it call `houseOn`, which was not in the
   list, so the slice threw into a catch and three arms read `null` — red on a missing
   binding, not on a broken claim. `houseOn` is bound to `false`, the body-scale
   identity, exactly as V198 bound `hd` and `reachCeil` one line above.
4. **One lab arm regexes `maxRange`'s exact bytes.** Re-pointed, the fourth time in
   that line's history; the night scaling it actually asserts is byte-identical.

Three honest notes on the evidence. One arm was a coin flip before it was a check:
the first cut asked only whether somebody was in reach AT THE BELL, which on a
one-house board is a roll of where a man spawned. It now asks the real question --
reachable at the bell **or** by walking -- and drives the shipped `doMove` to find
out. And one arm failed on a race: the ink cannot be measured before the body bake
exists, so the gate now waits for it. The 929-check combat lab reads the same before and
after (929 / 3, its three reds pre-date this), and that is **not** evidence the fight
still plays: that gate reads source text, so a default flip is invisible to it. The
evidence that it plays is the behavioural gates and this one. And the `personInLots`
arm fails closed — if the ink cannot be measured it reads `undefined` and goes red
rather than passing.

## THE DIAL

Not one damage number is touched. What changes is **reach**, which is his own 9/4
ruling typed into `HOUSE_MAX` on 9/5, and the accuracy curve is carried across by
V198's own `eff/max` ratio so it comes out identical at matching fractions of reach.

## ROUTED

- **RUN `[step is a house]`:** the street is still one fine cell a step at C 44. The
  fight is at house scale now; the walk is not. Until both sides share the scale, the
  entry pull-back stays as ruled.
- **`[PENDING Paolo]`, carried forward from V198 and still open:** where a scoped
  rifle stops on the house board. It is 3 as an attempt, not a decision.

---

**Tool:** `tools/bohemia_house_board_patch.py` (MARK `__THE_HOUSE_BOARD_IS_THE_BOARD__`,
the fight blob only) · **Gate:** `gates/house_board_gate.js` · **Tab:** COMBAT, and
any fight you walk into from CITY.

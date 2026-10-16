# YOU CAN SHOOT THE CAR (v174)

COMBAT lane, 8/21/26. **TAB: COMBAT.** Paolo, 8/20: *"how do i shoot a car?"*

## HE ASKED, AND THE HONEST ANSWER WAS THAT HE COULD NOT

Checked on the real surface rather than answered from memory. `carHeat` had
**exactly two callers in the entire file**:

1. a round of **theirs** that your cover ate (V108)
2. **your grenade** landing inside `CAR_BLAST` (V104)

There was no way to point a gun at a car. The turn before he asked, this lane had
described a burning car as *"something the fight already rewards you for
shooting"* — **and that sentence was false.**

## EVERYTHING ELSE WAS ALREADY BUILT

That is what makes this a missing **verb**, not a missing feature:

- cars are placed with a `tank` part (`tank:(part==='boot')`), so the fuel end is
  already its own cell
- heat already accumulates per car and cooks off at `CAR_COOK`
- **the heat is already drawn** — a rim that brightens and reddens as the metal
  cooks, plus a bloom on the tank end **and nowhere else**
- `cookOff` already does the whole payoff: **46-60 inside a tile and 20-30 out to
  2.6**, to everyone including you, the shell becomes permanent low hard cover,
  and V170 throws the smoke that blinds both sides

A complete mechanic, with its display, its payoff and its geometry — and no door
into it. **He found the missing door by trying to walk through it.**

## WHAT SHIPS: TAP A CAR AND YOU SHOOT IT

No new button. The field tap already places cover on a ring cell, already picks a
man, and already gets eaten by an armed grenade. A car was the one thing on the
board you could see, walk behind, hide from, and not touch. It reuses `tapTile`,
the same tap-to-world conversion the grenade has used since V104, rather than a
second hit test that could disagree with it.

**It goes last in the tap**, so a tap on a man is always a man — it only ever
claims a tap nothing else wanted. It runs in AUTO as well as MANUAL, because it
is not overriding the game's choice of *who* to shoot: V35's auto rule exists so
a curious tap cannot silently re-pick your victim, and this picks nobody.

## AND THE TANK IS THE WHOLE SKILL IN IT

| where the round goes | heat | rounds to cook |
|---|---|---|
| the body | 1 | 10 |
| **the fuel end** | **4** | **3** |

The game has been drawing which end is which since V108. That is **RF4-02
exactly** — *"critical info presented in the world and on the field of battle"* —
not in a menu. **Aim at the glow.**

It costs the turn like every other shot (RF4-49) and **it never rolls to hit**: a
car is a stationary object the size of a car, and the dial is for people. A miss
chance here would be the fight teaching that its own scenery dodges.

**It is symmetric with V170.** Smoke between you and the car refuses the shot for
the same reason it refuses a man: you cannot shoot what you cannot see, and the
screen you made is a screen you are standing behind too.

**NO DAMAGE BEFORE THE DIAL is untouched.** `CAR_SHOT_HEAT` and `CAR_TANK_HEAT`
are heat, in `CAR_COOK`'s existing `[DIAL]` family, and what the explosion does
when it comes is V108's number, unchanged.

## GATED WITH A REAL MOUSE, BECAUSE THE FEATURE IS THE TAP

`gates/fight_moves_you_gate.js` drives `page.mouse.click` on the real canvas:
**11 clicks, heat 1 through 10, the tank goes, and a cloud lands on the board.**

Calling `shootCar()` from a gate would prove the function works and say **nothing
about whether anybody can reach it** — which is the exact bug being fixed.

**Three harness bugs before that number was trustworthy**, each of them reporting
"the tap does nothing" when the tap was fine:

1. **Wrong canvas.** `querySelector('canvas')` found `#logo`, and the click went
   to page 0,40 — off the board entirely.
2. **The car squashed to a point.** Stacking every cell on one tile found
   whichever came first in the array, a body cell, and reported 1 heat a tap for
   a feature whose tank is worth 4. A car squashed into a point is not a car.
3. **The view will not hold still, and it should not.** The auto frame is
   refloored every frame to keep every body on screen, and the aim camera glides
   after a shot. A screen point computed once measured 4 → 4 → 4; recomputed but
   aimed at a single cell, 0 → 0 → 4. **That the view moves is correct — a player
   watches it move — so the harness retries instead of demanding the game hold
   still.**

## AND THE VERB GOES ON THE OPEN BOOK, BUT NOT WHICH END TO HIT

RF4-68: *never explain what the floor could have shown.* The floor shows the
heat, the glowing tank end and the explosion. What it cannot show is **that the
tap exists at all** — an affordance nobody tries is invisible, which is exactly
how this one went missing for as long as it did. The book states the verb and
lets the glow say the rest.

## MUTATION TESTING

Six mutations, all caught — but only after the sixth exposed a hole in the gate
itself. Moving the car check **ahead of** the men left both gates green, because
the ordering claim used `indexOf`, which happily found the surviving later copy
and reported the order correct **while a duplicate sat in front of it deciding
every tap first.** Ordering is only meaningful when there is one of the thing
being ordered, so the claim now also asserts `carAtTile` appears exactly twice in
the file: its definition, and its single use.

## GATES

`fight_moves_you` **63 pass / 0 fail** (5 new V174 claims) · `combat_lab`
**889 pass / 3 fail** (7 new; all three fails already red on clean main).

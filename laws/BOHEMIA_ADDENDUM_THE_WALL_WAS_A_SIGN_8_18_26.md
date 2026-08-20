# BOHEMIA ADDENDUM — THE WALL WAS A SIGN, NOT A FENCE (8/18/26, FACTIONS lane, LOCKED)

## 1. WHAT WAS BROKEN, AND IT HAD SHIPPED THREE DAYS EARLIER

8/15 shipped **THE WALL**: turning up for an outfit runs out of road, and only a
real commitment gets you past it. The organ clamps. The card says so, in words,
on the person you are standing in front of.

**And the button did not go through the organ.**

`BohemiaCommitment.give()` — the clamp, the entire point of the system — was
called **zero times** on the walked surface. The act button called
`BohemiaBelonging.record()` directly, and `record()` increments with no ceiling
of any kind.

Measured on the real card, in a real browser, before the fix:

| press | gave | ceiling | commitment | rung the card showed |
|---|---|---|---|---|
| 9 | **9** | 5 | `none` | COUNTED |

You walk straight through the wall while the card tells you it is there.

## 2. WHY EVERY GATE WAS GREEN, WHICH IS THE PART WORTH KEEPING

This is not "a check was missing." Two checks existed, both real, both passing,
and **both true**:

- `commitment_gate` **part A** proves `give()` clamps. It does. Nothing called it.
- `commitment_gate` **part D** proves the card **displays** the wall, and that the
  commit button **moves the state**. Both true.

**No claim anywhere pressed the act button past the wall on the real surface.**

That is the same shape as the 8/15 stale-agents outage one level down: **the organ
was verified and the wiring was not**, and *"the card shows the right thing"* was
mistaken for *"the thing is enforced."* A displayed rule and an enforced rule are
different facts, and only one of them is the game.

## 3. THE LAW

**A RULE IS NOT SHIPPED UNTIL SOMETHING ON THE WALKED SURFACE CANNOT BREAK IT.**

Concretely, for any limit, ceiling, cost or lock this repo ever adds:

**ONE — THE GATE MUST DRIVE THE PLAYER'S OWN BUTTON, PAST THE LIMIT, ON THE REAL
SURFACE.** Not the organ in isolation, not the card's text. Press the thing he
presses, more times than the rule allows, and read the number afterwards.

**TWO — EVERY WRITER GOES THROUGH ONE CLAMPED HELPER.** There were two ways
through this wall (the act, and the merged favour-act for a debt outfit) and the
second was found only by looking. One helper, both callers, so a future third
caller cannot quietly reopen the hole.

**THREE — A BUTTON THAT CANNOT DO ANYTHING IS NOT OFFERED.** `actFor()` knows what
an outfit wants and nothing about ceilings, so the card was offering an act that
could not move. A dead button is worse than no button: **it tells the player the
wall is soft**, which is the exact lie the wall exists to prevent.

## 4. AND THE FIRST VERSION OF THE NEW CHECK WAS ITSELF A LIE

Belt and braces means the two fixes cover each other — which also means the first
new claim (`Ez1`) **passed with the clamp completely gutted**, because hiding the
button did all the work. A check that cannot distinguish *the clamp holds* from
*the button is hidden* is not checking the clamp.

`Ez6` presses the **writer** directly with no button in the way. Mutation-proven:
gut the clamp and exactly that claim goes red (52/1), restore it and it is 53/0.

**A GATE THAT HAS NEVER BEEN WATCHED TO FAIL IS A GATE NOBODY HAS TESTED.** Every
claim in this lane is now mutated once before it is trusted.

Tool: `tools/bohemia_city_wallfence_patch.py` · Gate: `gates/commitment_gate.js` (part E)
Tab: **CITY** — walk up to somebody who runs with an outfit, press the act row until it stops.

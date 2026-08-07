# NINE GATES HAVE BEEN RED FOR DAYS AND EVERY LANE SAYS "NOT MINE"
## 8/7/26

For five turns running I ended my report with some version of *"9 red, all verified
as other lanes'."* Every lane writes that sentence. **That is how nine failures
became permanent background noise**, and a permanently-red alarm is a broken alarm —
it is exactly how the black screen hid for hours while every gate read green.

Three of the nine are the city/world surface. That is my lane. I stopped stepping
over them.

---

## WALL CLASS: THE GATE WAS STALE, THE GAME WAS FINE

    FAIL: THE RUN carries his border-wall pool at all (0 tiles) — it never did before

That reads like his border wall vanished — the exact thing he swore about on 7/27:
*"i went on the run and the suburb border walls are not changed its still the house
tiles dumbass"*. It looked like a fix of his had silently regressed.

**It had not. The wall is there, cooked, approved, and 306 tiles strong.**

On 8/2 a lane **replaced** the 7/14 pool with a freshly cooked one:
`build_run_slice.js` now substitutes `[]` for the `__PERIM_B64_JSON__` placeholder
**on purpose** (line 71), and the tiles ship as `PERIM_COOK_B64` from
`banks/BOHEMIA_PERIMETER_8_2_26.txt`, verdict in
`records/BOHEMIA_VERDICT_PERIMETER_8_2_26.txt`. Deliberate, and right.

`wallclass_gate` was still asserting `PERIM_B64.length === tan.length` — the retired
variable. **It had been red for days about a wall that never left.**

### and the patch tool could not have told anyone
`bohemia_run_perimeterwall_patch.py` reports **"the run already draws his border
wall. no-op."** while the built pool reads `[]`. Its idempotence guard checks for
its own marker in the *source*; the outcome in the *built* file is never looked at.
**A check that reads the intention instead of the result** — the same shape another
lane named this week when `pages_publish_gate` printed *"the deploy queues, never
cancels"* with eighteen cancellations sitting in the run history.

### the fix
Ask for **the wall**, not for one spelling of it: count tiles from the 7/14 pool
**or** the 8/2 cook, and count decoded images from `PERIM_IMG` **or** `PERIM_COOK`
(the cook decodes to `[faces[], pillar, bases[]]` per design, not to `PERIM_IMG`).

**24 passed, 0 failed.** Mutation-proven: emptying `PERIM_COOK_B64` fails two claims
by name — *"0 tiles: 0 from the 7/14 pool + 0 from the 8/2 cook"*.

---

## WHAT THE OTHER TWO ARE, HONESTLY

Diagnosed, not fixed, because the diagnosis is the part that was missing:

- **CANVAS SCALE** — `OVERVIEW: still composites SMOOTH (pixelated)`. The claim
  wants the overview *smooth* and calls that surface **approved as it is**; the
  measurement now reads `pixelated`. So a lane changed the overview's filter against
  a recorded approval, **or** the approval moved and the gate did not. One of those
  two is true and it needs whoever owns that verdict, not a guess from me.
- **INTERIORS** — `no painted surfaces: solid colours only as load fallbacks (5)`.
  Five painted surfaces where the law allows none.

---

## THE PATTERN, NAMED

Every one of these is the same shape as the CITY-tab deletion, the world leaving
the alpha, the shared resolver that was dead code, and the art-bank split: **an
intentional improvement, and a consumer that never followed it.** The improvement is
never the bug. The bug is always that something else still points at the old shape,
and the report it produces accuses the *game* of being broken.

**A gate that names one variable is a gate that goes red the next time somebody
improves the thing it guards.** Ask for the property. Never for the spelling.

## AND THE "NOT MINE" HABIT
"Verified as another lane's" is a true sentence that does nothing. Said five turns
running by every lane at once, it is how nine gates stay red for a week. **Naming
the owner is only useful if somebody then goes and looks** — and the looking took
one afternoon for a gate that had been screaming about a missing wall that was never
missing.

## THE LIFE LESSON UNDERNEATH (never preached in game)
An alarm nobody turns off stops being an alarm. It becomes the sound of the room.

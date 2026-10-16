# THE BELONGING SYSTEM HAD NO MEMORY (8/21/26, FACTIONS lane)

Everything this lane built in a week — standing, commitment, debt, claims, neglect,
the wall, the whole ladder — **existed only until the tab closed.**

---

## 1. MEASURED, ON THE REAL CITY PAGE

Do real work for the Cartel, commit all the way, take on a debt, reload:

```
                BEFORE      AFTER RELOAD
gave              9      ->     0        LOST
commitment      burned   ->    none      LOST
owed              4      ->     0        LOST
name asked       true    ->    true      survived
localStorage:  ["boh.city.met"]
```

The cause was four lines and no mystery:

```js
function ctBelongSave(){
  if(!window.__CT_BELONG) window.__CT_BELONG = { meta:{} };
  return window.__CT_BELONG;
}
```

**A plain window object. Nothing wrote it, nothing read it back.**

## 2. THE HALF THAT SURVIVED MADE IT WORSE, NOT BETTER

`CT_MET` — who you have met, whose name you asked for — **did** persist. So:

> **The game remembered your name and forgot that you burned a bridge for them.**

You work for the Cartel for twenty days, burn a bridge somewhere else to get
inside, close the tab, walk back up to the same person — and they greet you *by
name* as a stranger with no standing, no commitment, and no debt.

This is **A COUNT IS NOT A MEMORY** (8/20) one level up, and the same lesson: the
game kept the small fact and dropped the large one, and each half was individually
correct.

## 3. WHY EIGHTY-TWO PASSING CHECKS NEVER SAW IT

`grep -c 'reload()' gates/faction_arc_gate.js` → **0**

Eighty-two claims walked the arc — met people, learned names the way sixteen
different outfits hand them over, climbed, hit the wall, committed, owed, got
collected from, decayed — and **not one of them ever closed the game and came
back.** A system with no memory looked perfectly healthy for a week.

> **A GATE THAT NEVER RELOADS CANNOT TELL A SAVED GAME FROM A SESSION.** It is the
> twelfth instance this week of *the organ was verified and the wiring was not*,
> and the largest: here the surface called **everything** correctly, and nothing
> remembered it.

## 4. THE FIX: ONE SEAM, NOT TWENTY

The writers are `BohemiaBelonging.record` / `adjust`, `BohemiaCommitment.setState`,
and the claim and favour ledgers. Hooking each is five chances to miss one.

`ctSave()` is **already** called at every moment the city considers worth saving,
so it now carries both facts, and `ctBelongSave()` hydrates on first read. One
writer, one reader — the same law as `ctGiveCapped`.

It reuses the city's own existing pattern exactly: a second key beside
`boh.city.met`, hydrated at boot, wiped by the same debug `wipe()` — which
**previously removed only the met-ledger**, and would have left a player's standing
behind after they asked for a clean slate. *A wipe that leaves half the save is not
a wipe.*

## 5. AND THE CHECK FOR A CORRUPT SAVE TESTED THE WRONG LAYER, TWICE

The version guard was mutation-tested and **did not bite** — the gate only ever
writes a *valid* blob, so the discard path was a claim in a commit message that
nothing exercised. So Q3 was written to feed it garbage. **Q3 did not bite either**,
one layer further down:

```
'{"v":99,"meta":"not an object"'        <- UNTERMINATED
```

`JSON.parse` threw, the surrounding `try/catch` swallowed the throw and returned a
clean save, and **the guard under test was never reached.** Two protections
stacked, and I proved the outer one twice while believing I had proved the inner
one.

> **WHEN TWO GUARDS STACK, A TEST THAT TRIPS THE OUTER ONE PROVES NOTHING ABOUT
> THE INNER ONE.** Aim the payload at the layer under test.

Valid JSON with a wrong version and a *plausible* standing is the only payload the
guard alone can reject — it parses cleanly, it looks exactly like a real save, and
its numbers are precisely what must not come back:

```
guard deleted    FAIL Q3    87 passed, 1 failed
guard restored              88 passed, 0 failed
```

## 6. WHAT IS STILL TRUE AND IS NOT THIS LANE'S

**The city's ledgers live outside the game's save slots.** `bohemia.save.v1` is the
RUN lane's slot list (auto-saves, sleep saves, `engine.turn`); `boh.city.met` and
now `boh.city.belong` are separate global keys.

So **loading an older save slot does not rewind your faction standing.** Play to
day 20, load a day-3 save, and the Cartel still counts you.

**This is pre-existing architecture, not something introduced here** — the
met-ledger has behaved this way since it shipped, and making faction state
slot-aware while *who you have met* is not would be worse than the inconsistency
it fixes: two different behaviours for facts about the same person. It belongs to
whoever owns the save-slot design, in one pass, for both ledgers.

---

Gate: `gates/faction_arc_gate.js` part Q (Q1 reload, Q2 the name, Q3 corrupt save) — the first claims in this lane that reload the page
Tool: `tools/bohemia_city_belong_persist_patch.py`
Tab: **CITY** — do work for somebody, close the tab, come back. It is still true.

---

## 7. AND A FINDING I DID NOT SHIP, BECAUSE I CHECKED IT ONE STEP FURTHER

Having built a reload harness, the obvious next question was **what else does the
game forget?** The sweep came back looking like a second big finding:

```
DAY          5  ->  1     LOST
playerX  10299  ->  6205  LOST
playerY   2252  ->  6271  LOST
standing / commitments / people met / names asked      kept
```

Measured through the **real alpha**, tapping the splash like a friend — not the
standalone city page, which was the first cut and rightly thrown away. So it
already survived one "verify on the real surface" pass.

**It is still not a finding.** `bohemia.save.v1` was absent entirely, and the
reason is one line:

```
runFrame element in DOM: true   src=(empty)
RUN frame booted?  false
```

**The RUN frame never loaded.** It is lazily sourced, my walk never triggered it,
and the day and the save both live inside it. A page that was never handed a day
cannot be said to have forgotten one — and the auto-save the alpha's own comments
describe (`auto:start`, written on a 2.5s timer) never ran either.

> **A SWEEP THAT FINDS SOMETHING IN ANOTHER LANE'S SYSTEM IS A HYPOTHESIS, NOT A
> BUG.** Three checks deep it was still standing; the fourth killed it. The cost
> of publishing it would have been a lane spending an afternoon on a save system
> that was never running in my test.

**What is honestly known:** the faction ledgers survive a reload (measured, gated,
mutation-proved). Whether DAY and player position survive a *real* session is
**untested here**, because answering it means understanding the RUN frame's
lifecycle, and that is the RUN lane's system. Handed over as a question, not a
defect.

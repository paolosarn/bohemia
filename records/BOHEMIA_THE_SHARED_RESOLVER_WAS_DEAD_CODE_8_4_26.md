# THE SINGLE SOURCE OF TRUTH WAS DEAD CODE IN ALL 13 PLACES IT WAS USED
## 8/4/26

Yesterday the world moved out of the alpha and left two dozen gates reading a
`const CITY_B64` that no longer existed. Two lanes fixed it at once. Theirs was
the better design and I took it: **one** `gates/bohemia_city_app.js` that knows
where the city app lives and what its frame looks like, instead of the same
lookup pasted into every gate.

It was the right idea. **The wiring never landed.**

---

## WHAT THIRTEEN GATES ACTUALLY CONTAIN

```js
/* FIND THE FRAME BY WHAT IT IS, NOT BY HOW IT WAS LOADED (8/4).
   One predicate knows: gates/bohemia_city_app.js. */
f = page.frames().find(fr => require('./bohemia_city_app.js').isFrame(fr, page));
f = page.frames().find(fr => (/srcdoc|CITY_WORLD|CITY_CURRENT/.test(fr.url())) && fr !== page.mainFrame());
```

**The second line overwrites the first before the first result is ever read.**
The shared predicate is called, once per frame, and thrown away. The regex
underneath it is what actually finds the frame — in `city_kit_binding`,
`dooranim`, `doorjamb`, `doorway`, `everydoor`, `ewdoor`, `full_res`,
`interior_wall`, `run_spawn`, `shadow`, `stepinside`, `traffic_signal` and
`zoomseam`.

Every one of them is green. That is the whole problem: **nothing was failing, so
nothing was going to find this.**

---

## PROVED, NOT ARGUED

Sabotage `isFrame` so it returns `false` for every frame in existence, then run
`doorway_gate`:

| shape | result with the resolver fully broken |
|---|---|
| **as it is on main** (resolver + shadow) | `DOORWAY GATE: 5 passed, 0 failed` |
| **shadow removed** (this commit) | `DOORWAY GATE CRASHED: no frame` |

A "single source of truth" that can be replaced with `return false` without one
test noticing is not a source of truth. It is a comment.

---

## WHY IT MATTERS, GIVEN WHAT TODAY ALREADY COST

The whole point of that refactor was: *next time the city app moves, edit one
file.* As shipped, the next move updates `bohemia_city_app.js`, changes nothing,
and thirteen gates fail again on "the world frame booted" — which reads like the
game is broken when it is the test that is. **That is the exact loop this refactor
was written to end**, still fully armed.

---

## THE FIX, IN THE ORDER THAT MATTERS

The shadow regex matched `CITY_CURRENT`; `isFrame` did not. **Deleting the shadow
first would have quietly NARROWED what the fleet can find** — a silent behaviour
change dressed as a cleanup.

1. widen `isFrame` to the exact union the shadow matched (`srcdoc`,
   `BOHEMIA_CITY_WORLD`, `BOHEMIA_CITY_CURRENT`), unit-tested against all four
   URL shapes plus the main frame
2. *then* remove the shadow line from all 13 gates
3. hoist the `require` out of the per-frame predicate while there (it was being
   resolved once per frame per poll)

Verified green standalone: doorway 5/0, zoomseam 7/0, run_spawn 13/0, shadow 7/0,
stepinside 8/0.

**Superset first, then remove the shadow.** Any other order is a narrowing you
cannot see.

---

## THE LIFE LESSON UNDERNEATH (never preached in game)
Two people doing the same job is not twice the work getting done. Usually it means
one of them has quietly stopped counting.

# ONE SCOPE ERROR WEARING THREE FACES

**8/22/26 — WORLD lane. Yesterday I measured three different failures wiring the landlock
relay into the walked surface, could not reconcile them, and stopped rather than guess a
fourth time. They were one bug. It is fixed, and the valley went from 82.6% to 93.1%
reachable on foot without costing a single cell anywhere else.**

---

## WHAT PAOLO ASKED FOR, 8/1

> "make sure I cant be locked in any certain district ever again it's so fucking creepy."

He said it standing inside a sealed subdivision. The valley had 357 stranded pockets —
541 cells you can stand in and never leave, 257 of them housing.

## THE THREE FACES

`engine/bohemia_world.js` has walked sealed districts out to a street since 7/21. On 8/21
that relay moved into `engine/bohemia_overmap.js`, because **the page does not carry
world.js** — the relay was true in the model and absent from the surface a body walks.
Then three attempts to make the page actually call it:

| attempt | reachable | drawn by own module |
|---|---|---|
| baseline | 82.6% | 99.9% |
| 1. merge into both call sites | **0%** (1 cell) | 86.8% |
| 2. kit call site only | 86.0% | 86.8% |
| 3. only when the cell has no street | 84.5% | 94.1% |

Every version bought reachability by dropping cells that stopped being drawn by their own
module. It read as a real trade-off between two invariants. It was not a trade-off at all.

## THE ACTUAL CAUSE, MEASURED IN THE BROWSER

**Every inlined module on that page is an IIFE that publishes exactly one name.** The
overmap's inlined body ends:

```js
global.BohemiaOvermap=API;
})(typeof window!=='undefined'?window:globalThis);
```

Asked in the live page:

```
typeof census            undefined
typeof buildOvermap      undefined
typeof API               undefined
typeof landlockConnect   undefined      <-- the whole bug
typeof OM.landlockConnect   function
```

Yesterday's resolver anchored itself before `function census(overmap){` — which is
**inside** that IIFE — and called a bare `landlockConnect`. So `relayEdges` was defined one
scope in from the two call sites that needed it, and neither could see it:

- `__subBlock` has no try/catch. `ReferenceError: relayEdges is not defined` took the whole
  render down. **That is the 0%.**
- `__kitBlock` wraps its generate in `catch(e){ g=null; }`. It swallowed the identical
  ReferenceError and handed back an empty grid, which downstream reads as "not drawn by its
  own module". **That is the 86.8%** — and 94.1% is the same thing over the smaller set of
  cells attempt 3 touched.

Three numbers. One cause. The relay was never involved in any of them.

(A second, quieter bug rode along: the kit patch called `relayEdges(tx,ty)` inside
`__kitBlock`, where the coordinates are named `gx4`/`gy4`. A ReferenceError inside a
ReferenceError, both eaten by the same catch.)

## PROVING IT BEFORE TOUCHING ANYTHING

The 8/21 record said: *take one landlocked suburb cell, generate it with `['S']` and with
its relay edge, and diff the two grids.* Done in the live page, with the page's own
vocabulary, patching nothing:

```
relay entries                                    4,432
built cells with no street of their own          2,035   all 2,035 get an edge
of those, an edge the ['S'] fallback got wrong   1,566
suburb grid, ['S'] vs relay edge     2.0% - 5.1% of tiles differ,
                                     11 distinct codes BOTH ways
```

A 3% delta with identical code richness is a block whose loop road meets a different edge.
It is not a generator falling over. That measurement is what said the wiring was safe
before a single line of it was written.

Two of the three questions the 8/21 record left open closed on the way:

- **The group-vs-cell coordinate worry was nothing.** `GRP = round(128/FN)` and `FN` is 128,
  so `GRP` is **1** — the group *is* the cell at the current scale, and `gx*GRP` was always
  right.
- **"Drawn by its own module" was measuring real failure, not mere change.** It was right
  every time. The failure was mine.

## WHAT SHIPPED

`relayEdges` now lives **outside every module IIFE**, immediately above the two call sites,
and goes through `OM.landlockConnect`. One lazy BFS over 9,216 cells per page load, cached.
`isBuilt` asks the kit whether a district has a generator *here* rather than copying a list
that would drift; `familyOf` is the four-district suburb family from the LANDLOCKED DISTRICT
LAW, the same four world.js uses.

The kit path merges the relay **only into the legs-less branch**. A district that arrives
with legs already had its street edges decided by whoever built those legs (cluster bounds,
terrain, rail), and overriding somebody else's explicit decision from in here is how two
systems start disagreeing about the same cell.

**On the real surface:**

```
reachable on foot from spawn   82.6%  ->  93.1%   (+970 cells)
drawn by its own module        99.9%  ->  99.9%   (9,207 of 9,216, unmoved)
walked surface gate                        10 / 0
```

## THE LESSON, AND IT IS THE WEEK'S LESSON AGAIN

A `catch` that turns a programming error into a plausible-looking empty result will cost you
days. `__kitBlock`'s `catch(e){ g=null; }` is there to survive one district's generator
throwing on one cell — and it reported my typo as a rendering trade-off, with a number
attached, three times running. STOP PRODUCING is what kept that from shipping: the fourth
attempt would have been a fourth guess at a phantom.

The fix was not to try harder. It was to **ask the page what it actually had** — four lines
of `typeof` in a browser — instead of reasoning about what the source said it should have.
That is VERIFY ON THE REAL SURFACE, applied to scope instead of to pixels.

## WHAT IS LEFT, MEASURED

The valley does not reach 100% and should not: mountain, freeway and water are not walkable
ground. So the honest question is what is left that IS. Of the 633 cells still unreachable:

```
mountain   584  |
freeway     17  |  603 legitimately not walkable
water        2  |

desert       6  |
estate       6  |
farm         6  |
suburb       5  |   30 BUILT CELLS STILL SEALED
railyard     4  |
warehouse    2  |
gypsum       1  |
```

28 pockets in total; the four large ones (214, 120, 93, 91 cells) are the mountain ranges.

**The sealed-ground problem went from 541 cells to 30** -- 0.3% of the valley instead of
5.9%, and the housing share of it from 257 to 11.

The last 30 are the next job, and they come with a warning: the relay's third pass caps a
spur at 16 hops and only carves desert, so the likely story is "behind a range with no road
on the far side". A farm sealed behind a mountain may be **correct**. Check before building.

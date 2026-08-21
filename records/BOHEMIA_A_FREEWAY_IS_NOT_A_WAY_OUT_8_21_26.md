# A FREEWAY IS NOT A WAY OUT

**8/21/26 — WORLD lane. A quarter of the game's housing was sealed off from the valley,
and the law that forbids exactly that had a green gate, because the model counted a
FREEWAY as street access. You cannot walk onto a freeway.**

---

## WHAT I WAS ACTUALLY LOOKING FOR

I set out to ask "is it the *right* thing wired" of every bank the game embeds, after
finding the map drawing three-week-old icons. **That came back negative** — the live
surfaces embed no orphaned art; the only orphans are old judge pages from 7/10–7/14, and
the 69 sprites in `CITY_TILES.js` are my own resampled heroes with recorded provenance.
Worth saying plainly rather than inventing work out of it.

So I went at the thing a player would feel: the walked-surface gate reports **82.6%**
reachable. What is the other 17%?

## 357 POCKETS, 541 CELLS, NEVER TOUCHING A STREET

Flooding the valley cell-to-cell — a pair connects only if a walkable tile lines up
across their shared boundary, which is the same test the gate makes:

```
components                              364
main road-connected component         8,654 cells
STRANDED (never touch a street)         357 pockets, 541 cells
  suburb 257   mountain 217   solar 20   desert 14   farm 11   gated 4   apartment 4
pocket sizes: 1-cell x266   2-cell x54   3-cell x26   ... 10-cell x1
```

Mountain is solid rock and desert is bare land the law exempts. **The violation is the
257 suburb cells** — one in ten of all housing, in 266 one-cell and 54 two-cell pockets.
Two houses' worth of neighbourhood, walled off from the entire valley.

Paolo, 8/1, standing in one of these: *"make sure I can't be locked in any certain
district ever again it's so fucking creepy."*

## AND I GOT THE CAUSE WRONG TWICE BEFORE I GOT IT RIGHT

Worth writing down, because both wrong answers were plausible and one of them I had
already half-published to myself.

**Wrong answer 1: "each suburb gets one gate and they don't line up."** Measured: 49% of
adjacent suburb pairs are sealed from each other — which sounds damning until you
remember that is *Paolo's own 7/21 ruling* ("most stay walled — real Sun Belt subdivision
privacy"). 49% against a designed 25%-per-edge connect chance is the design working.

**Wrong answer 2: "the relay is a 2-cycle."** The model's map said
`47,11 → ["S"]` and `47,12 → ["N"]` — two cells pointing at each other, going nowhere.
That looked like a smoking gun. It is not: the `["N"]` on 47,12 is just the *back edge*
of the hop from 47,11, written by `addEdge` on both endpoints. I nearly wrote this up.

**The actual cause**, found by asking what the chain terminates ON:

```
(47,11)  suburb   rawStreetEdges=[]      relay=["S"]
(47,12)  suburb   rawStreetEdges=["S"]   relay=["N"]     <- its S neighbour is...
(47,13)  freeway
```

The chain **does** reach a street. The street is a **freeway**.

`rawStreetEdges` uses the kit's `ROADSET`, which is
`{freeway, arterial, strip, beltway}`. Freeway and beltway are **limited access** — no
crosswalk, no gate, no sidewalk, nothing a body on foot can step onto. So the relay BFS
happily terminated on one and declared the chain solved.

```
suburb-family cells touching a WALKABLE street (arterial/strip)   1,934
suburb-family cells touching ONLY freeway/interchange/rail          242   <- sealed
suburb-family cells with no street at all, relying on the relay      545
```

Those 242 are **anchors**. Every relay chain that ends on one strands itself and
everything queued behind it.

## THE FIX

One definition, scoped to the relay only. `rawStreetEdges` keeps its meaning everywhere
else, because a freeway edge legitimately matters for street-facing geometry — it just
does not mean *a person can get out this way*.

```js
var WALKABLE_ROAD = {arterial:1, strip:1};
function touches(x,y){ return walkableStreetEdges(x,y).length > 0; }
```

Measured on the canon valley, flooding the real tiles:

```
                          before      after
stranded pockets            357        177
stranded cells              541        255
  of which suburb           257          3
  of which mountain         217        217   (solid rock — correct)
  of which desert            14         13   (bare land — exempt by the law)
```

**257 sealed suburb cells down to 3.** The remainder is terrain that is supposed to be
sealed, plus about twenty cells of farm, warehouse and landmark that the three-pass
relay still cannot route.

## THE GATE THAT WENT RED, AND WHY IT WAS RIGHT TO

Fixing the relay turned `landlocked_gate` red on a knob nobody had touched:

```
seed 42: cosmetic-connect per-edge rate=0.381  (band 15%-35%, target 25%)
```

The gate measures "the cosmetic-connect per-edge rate" off `w.landlockConnect` — which
is the **mandatory relay map UNIONED with the cosmetic one**. Every mandatory edge was
being counted as a cosmetic connector. It read 0.25 only because the two happened to be
in balance; the moment the relay found 285 more cells, the number moved and the gate
complained about `COSMETIC_CONNECT_CHANCE`.

**A number you cannot attribute is not a measurement.** The world publishes both maps
separately now and the gate reads the one it is named after:

```
seed 1337: 0.243     seed 42: 0.252     seed 99: 0.253      (designed: 0.25)
LANDLOCKED DISTRICT GATE: 16 passed, 0 failed
```

Dead on target across all three seeds. The knob was always right. The measurement was
conflated — which is the fifth ruler this week.

## WHAT THIS DOES **NOT** FIX, AND I AM NOT GOING TO PRETEND OTHERWISE

**The walked surface does not consume this.** Measured, not assumed:

- `walked_surface_gate` reports **82.6% before my change and 82.6% after** — it did not
  move by a single cell.
- `slices/BOHEMIA_CITY_WORLD.html` contains no copy of `engine/bohemia_world.js` (no
  banner, and the resync reports 93 modules all fresh without it). Its two mentions of
  `landlockConnect` are both **comments**.

So the city page builds its cells from its own overmap and the district modules, and the
landlock relay never enters that path at all. The MAP tab *does* embed `world.js` and
now carries the fix; the surface you walk does not.

**That is the next piece of work and it is the one that matters to a player**: the
walked surface needs the relay, either by consuming `world.js` or by carrying a
precomputed relay table. Until then this is a correct model sitting behind a surface
that ignores it — which is precisely the disease I have spent the week documenting, and
I would rather name it than let a green gate imply it is solved.

## THE LESSON

**Two definitions of the same word, in two places, and only one of them was the
player's.** The model said "street" and meant `ROADSET`. The player says "street" and
means *somewhere I can stand*. Everything downstream was consistent and everything
downstream was wrong.

That is not a bug you find by reading the relay code — it is correct, it is
well-commented, it has three fallback passes and a written note about Paolo standing in
a sealed district. You find it by asking what the chain terminates on, and then by
noticing the terminator is a road with no sidewalk.

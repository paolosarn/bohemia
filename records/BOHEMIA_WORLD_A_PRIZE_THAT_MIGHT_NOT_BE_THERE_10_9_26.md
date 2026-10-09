# A PRIZE THAT MIGHT NOT BE THERE

WORLD lane (chat 02), 10/9/26. Row `[where the god gear is]`.

---

## 0. THE ROW

Paolo, 10/9: **"finding good bros and good equipment throughout the settlements."**

The valley's special places as Battle Brothers' legendary locations in our skin —
the arsenal off the strip, the dead fuel depots, the granary, the robotics plant,
the data fortress, the library — each a place on the map with a **guard party
sized by the math** and a **reward table** off the best rows of `weapons.json` and
`armor.json`, found by rumour at the bar.

---

## 1. **THE FINDING: THEY ARE NOT GUARANTEED**

All six are real districts the generator already makes, so nothing here invents a
location. But they are **rolled, not placed.** Swept over sixty valleys:

| place | present |
|---|---|
| arsenal | 60/60 |
| data fortress | 60/60 |
| robotics plant | 59/60 |
| fuel depot | 58/60 |
| granary | 55/60 |
| **library** | **48/60** |

**Nine valleys in twenty have no library at all.** Battle Brothers puts its
legendary locations on every map it generates, so a rumour there is never wrong.
Ours would point at a building that is not in this world.

The module does not paper over it: `on()` reports which of the six are **missing
by name** for the valley in front of it, so RUN never prints a rumour about a
place that is not there and FACTIONS never guards an empty square. The gate
re-sweeps every run and proves every absence is reported — hiding them turns it
red.

Whether a missing one should be *forced* onto the map is a generator ruling and it
is not mine. It is written down and routed.

---

## 2. **THE FIRST CUT MADE FIVE OF THE SIX THE SAME PLACE**

I ranked them by how big they are on the map, which sounded like reading a fact
and was not one.

Measured: **the data fortress is six cells and every other one is exactly one.**
So five places came out with the same guard of 10 and the **same three reward
rows**. Identical.

That is `[bb places]`' own 9/25 defect — a shelf that is a function of tier alone,
every camp selling the same four things — and that round said it would never ship
again.

Scarcity across valleys *does* separate them, but it ranks the data fortress near
the **bottom**, which is not what a fortress is.

So the honest reading is that **the map does not encode which of these is the
bigger prize**, and dressing a prestige order up as a measurement would be exactly
the thing this lane keeps catching itself doing.

**So the order is stated as mine.** It has a real-world reason rather than a coin
flip, it carries `tuned:false`, and it is one line to change: an arsenal and a
data fortress were **built to be defended**, a robotics plant and a fuel depot to
be **secured**, a granary and a library to be **walked into**. That is REALISM
FIRST, said out loud instead of smuggled in as arithmetic.

---

## 3. THE CHAIN, AND NOTHING IN IT IS A TABLE

**rank → guard → reward.**

1. **The guard is sized off his own ceiling.** He said it describing the biggest
   fight Battle Brothers ever gives you: **"12 versus 60"** (rule 79). A company
   is about twelve men (rule 39d), so sixty is the top and the most-defended place
   earns it. Not one constant in that is mine.

2. **The reward is a slice of the ranked gear pool, positioned by the guard.** 310
   rows across weapons and armour, every one valued. A place guarded at half the
   ceiling starts half way down the pool, so **better guarded is better gear by
   construction** and there is no reward table to maintain. The gate proves the
   monotonicity rather than trusting it.

On seed 1337:

| place | guard | top reward |
|---|---|---|
| data fortress | 60 | Coat of Plates (7000) |
| arsenal | 50 | Reinforced Mail Hauberk (2000) |
| robotics plant | 40 | Gnarly Staff (1000) |
| fuel depot | 30 | Reinforced Leather Armor (500) |
| granary | 20 | Hatchet (210) |
| library | — | not on this valley |

---

## 4. THE COOK

`tools/bohemia_god_gear_cook_10_9_26.js` →
`slices/vote/WORLD_PLACES_WORTH_GOING_TO.png`. VOTE tab,
`world-places-worth-going-to-10-9`.

The valley with the six marked, **each ring sized by the guard standing on it**,
so the picture's geometry is the number rather than a label beside it. The hollow
red ring on the edge is the library this valley did not roll.

**AH-01, and the wrong thing is what sizes the circles.** A map with six sites
ringed is the ordinary part, the thing any strategy game prints. The rings are
sized by **how many people are standing on them**, so the best thing in the valley
is also the widest circle of men — and one ring is empty because that building
does not exist in this world.

---

## 5. AND MY OWN CHECK REFUSED THE FINDING

The invented-place refusal conflated **"not on this seed"** with **"invented"**,
so it threw out the library — the exact thing the picture exists to show. A place
is invented only if it is on **no** valley; a place absent from *this* valley is
the finding, not a fault. Fixed, and the gate holds the corrected form.

---

## 6. ROUTED

- **FACTIONS** — who guards each place. `GUARDED_BY` ships empty by the row's own
  words, and it is derivable from the live turf the same way the roaming pool is.
- **RUN / QUESTS** — the rumour at the bar must **check the valley it is in**. The
  module answers which places are here and which are not.
- **TUNING** — the guard ceiling and the rank both carry `tuned:false`.
- **The generator** `[the roll]` — whether a legendary place should be forced onto
  every valley, or whether a valley without a library is a feature. My read: it is
  a feature, and it is the one thing Battle Brothers cannot do.

---

`[bb gear]` **Battle Brothers guarantees its legendary locations and ours do not,
and that is the trade worth taking.** BB places every named site on every map, so
a player who has seen one campaign knows exactly what exists; the thrill is
finding *where*, never *whether*. **OUR TWIST** (rule 39b): ours are rolled, so a
rumour is a claim that can be wrong, and a valley without a library is a different
run with a different ceiling on what you can ever own. That only works because the
absence is **reported, not silent** — a bug makes a player feel cheated, a rolled
world makes them feel unlucky, and the difference between the two is entirely
whether the game knows and says so.

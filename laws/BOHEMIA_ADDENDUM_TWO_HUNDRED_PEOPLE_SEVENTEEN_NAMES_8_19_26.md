# BOHEMIA ADDENDUM — 298 PEOPLE, 17 NAMES (8/19/26, FACTIONS lane, LOCKED)

## 1. THE BUG

`ctValleyRoster` walks every neighbourhood in the 96×96 valley and concatenates
the people. `bohemia_population` numbers people **per neighbourhood** — `H1-1`,
`H2-1`, `H6-1` — so those names repeat in every neighbourhood.

Measured on the real page:

| | |
|---|---|
| people in the valley roster | **298** |
| distinct ids | **17** |
| ids used by more than one person | 16 |
| ids used by people **in different outfits** | 11 |

`H1-1` alone covered about **140 people** spanning Cartel, Caravans, Colorful,
Network, Homeless, Reds, Trades, Volunteers and Remnants.

`whoHears` keys everything on that id: `byKey[keyOf(a)] = a` keeps whichever
person came last, `seen[k] = true` marks one *name* as visited and silently skips
the other sixteen real people wearing it, and `tiesOf` buckets them together.

**So the social graph of the valley was largely fiction.**

## 2. HOW IT SURFACED, WHICH IS THE ONLY REASON IT WAS FOUND

Building something else, I saw the card report **TRADES hearing about a Reds
commitment through a `faction` focus at one hop.**

That is impossible. A faction focus cannot bridge two factions — their keys are
`F:REDS` and `F:TRADES` and they do not match. The tie was real; **the person on
the end of it was not the person we looked up.**

Nothing about the feature I was building would have shown me that. It came from
reading one field in one debug dump and asking why it said what it said.

## 3. WHY NO CLAIM CAUGHT IT, AND THIS IS THE PART THAT GENERALISES

Every who-hears assertion in this lane tested **shape**: somebody hears, a rumour
lands further away than a fact, the bridge is cross-cutting, an isolated outfit
never hears. Every one of those is **still true** on a graph built from colliding
keys.

> **COLLISIONS ADD EDGES RATHER THAN REMOVE THEM.** You get *more* people hearing,
> not fewer. Nothing ever looked empty, so nothing ever looked wrong.

**NOBODY EVER ASKED WHETHER TWO PEOPLE WITH THE SAME NAME WERE THE SAME PERSON.**
That is a question about *identity*, and a shape assertion structurally cannot
ask it. The gate now counts distinct keys against distinct people.

## 4. THE FIX

The foci were never wrong. `home.building` and `j.site` are real valley
coordinates (`H:8,65:B4488,10798`, `W:35,81`), unique across the map. **Only the
keys collided.** So it is four lines: stamp each person with a valley-unique key
at roster time (the neighbourhood is already the loop variable) and hand it to
`whoHears` through the `keyOf` it has always accepted. Nothing in `engine/`
changed.

`a.id` is deliberately **not** mutated — `fociOf` falls back to parsing it when a
home seat is missing, and other readers hold these objects. A new field, one
reader.

## 5. WHAT THE FIX REVEALED, AND IT IS NOT COMFORTABLE

With real keys, **nobody in the valley hears anything at all.** Every outfit's
heard-list is empty. The 8/15 word-travels system was producing output *only*
because of the collisions.

Ground truth, measured, and it does not depend on keys:

| | |
|---|---|
| people | 298 |
| affiliated | **32** |
| outfits present | 11 |
| distinct homes among affiliated people | **32** |
| homes shared by two affiliated people | **0** |
| distinct workplaces among affiliated people | 31 |
| workplaces holding two *different* outfits | **0** |

**Thirty-two affiliated people live in thirty-two different buildings.** Not one
pair of them shares a roof — never mind two *different* outfits sharing one.

So this is not "the outfits do not overlap." It is that affiliated people are so
sparse that **no two of them share a setting anywhere**, and a cross-cutting tie
has nothing to be built out of.

## 6. WHAT I DID NOT DO ABOUT IT

**I did not loosen the graph to make my feature look alive.** Widening what counts
as a shared setting, or dropping the requirement, would have manufactured exactly
the fictional ties the fix just deleted — the same bug, chosen on purpose.

The dials that decide this density are already named and already **[PENDING
Paolo]**: `REACH_CELLS` (12) and `AFFILIATED_RATE`. Base placement is **MAP LAW**
and his alone. This lane records the number and stops.

## 7. THE LAW

**ONE — A KEY IS A CLAIM THAT TWO THINGS ARE THE SAME THING, AND IT GETS CHECKED.**
Any graph built over a roster asserts that its key is an identity. Count distinct
keys against distinct members, once, in a gate.

**TWO — A SHAPE ASSERTION CANNOT CATCH AN IDENTITY BUG.** "Somebody hears" is true
of a correct graph and of a graph with 17-to-1 collisions. When a system's output
is a *set of relationships*, at least one claim must be about **who**, not about
**how many** or **what kind**.

**THREE — WHEN A FIX EMPTIES A FEATURE, THE EMPTINESS IS THE FINDING.** Report the
number. Do not restore the output by weakening the rule that produced the truth.

Tool: `tools/bohemia_city_valleykey_patch.py` · Gate: `gates/commitment_gate.js` part H
Tab: **CITY** — the wall card now says "NOBODY. NO OUTFIT IN THIS VALLEY HAS A LINE TO THEM", and that is true where it used to name outfits that never heard.

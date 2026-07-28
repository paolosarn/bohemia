# THE LEGIBILITY BIBLE (7/28/26, WORLD lane — research, term three of three)

Term one: **what** to draw (the apocalypse references).
Term two: **how** to build it (tiles, sorting, pixels).
Term three, this one: **why a place reads as a place at all** — which is the thing
actually failing, because 32 districts came back rejected and the note was not "wrong
details", it was *"nothing here was perfect."*

NOTHING BUILT OFF IT YET.

---

# THE SPINE: KEVIN LYNCH, AND THE FACT THAT WE ONLY BUILT ONE FIFTH OF A CITY

Kevin Lynch, *The Image of the City* (1960) — the founding text on why some cities are
legible and some are mush. He names two qualities:

- **legibility** — *"the ease with which its parts can be recognised and organised into a
  coherent pattern"*
- **imageability** — *"that quality in an object which gives it a high probability of
  evoking a strong image"*

And he says a city is built from exactly **five elements**:

| element | what it is | do we have it? |
|---|---|---|
| **PATHS** | the channels you move along — streets, walks, rail | ✅ yes, this is most of what we built |
| **EDGES** | linear boundaries between areas — a rail line, a wash, a wall | ⚠️ we have them by accident, never on purpose |
| **DISTRICTS** | areas with a shared character you can feel yourself enter | ⚠️ we have 48 *types*, but they do not read as different |
| **NODES** | decision points — junctions, squares, crossings | ❌ **we have none** |
| **LANDMARKS** | the thing you navigate by, seen from outside | ❌ **we have almost none** |

**That table is the whole diagnosis of the bulk rejection.** We have spent every session
building PATHS and DISTRICTS — roads, freeways, rail, and 48 kinds of plot — and we have
built **no nodes and no landmarks at all.** A city made only of paths and districts is
precisely a city that reads as *texture with no places in it*, which is what he was
looking at when he said it was all bad.

It also explains why the town district suddenly worked when I added cross streets and
he passed it: **a cross street is a NODE.** It was the first node in the game.

### What this says to do, concretely
- **NODES:** every district needs at least one place where circulation *decides* — a
  junction, a forecourt, a plaza, a gate, a crossing. Not a corridor. This is the cheapest
  fix on the list and it needs zero art.
- **LANDMARKS:** it pairs exactly with Obsidian's rule from term one — **three real
  landmarks visible from any grid square.** Our skyline is flat, so there is nothing to
  navigate by and every direction looks the same. One tall, distinct thing per district.
- **EDGES on purpose:** the wash, the rail line and the freeway should be felt as
  boundaries between parts of the valley, not as more texture.

---

# THE PARKING FIGHT, AND WHY HE IS RIGHT FOR A REASON HE DID NOT SAY

He hit this twice — commercial *"way to many parking spots"*, ballpark *"the parking is
fucked"* — and the real numbers say something surprising:

> **Las Vegas devotes 32% of its central city to parking. The highest of any major
> American city.** (US city-centre median is ~26%; average ~22%.)

So our districts are not *unrealistic*. They are, if anything, accurate. **The problem is
not the amount of parking, it is that parking is an ABSENCE and absences do not read.**
Realism is not the bar — imageability is. A thing can be perfectly accurate and still
evoke no image at all, which is exactly Lynch's point.

**And the apocalypse hands us the fix for free.** A parking lot in a dead world is not a
parking lot. It is *the largest area of flat, cleared, defensible ground for a hundred
metres*, and that is the single most useful thing in a collapsed city. In act 1 it fills
with **wrecks, salvage rows, tents, water tanks, burn barrels, a market**. The asphalt
stays — the accuracy is preserved, the parking minimums story is preserved — and the
emptiness is gone.

So the rule is not "delete the pavement." It is:

> **PAVEMENT IS NOT CONTENT UNTIL SOMETHING HAPPENS ON IT.**

That also cleanly resolves the tension in our own WALKABLE-LAND law, which currently
counts pavement as filler no matter what. It should count as content when it is *used*.

---

# THE BEST SINGLE REFERENCE I FOUND ACROSS ALL THREE TERMS: THE TOWER OF DAVID

Centro Financiero Confinanzas, Caracas. A 45-storey skyscraper begun in 1990, **abandoned
at ~70% complete in 1994 when the developer died and the national banking system
collapsed.** In 2007 squatters took it. By 2012 **750 families lived inside**, and they
had built a functioning city in the shell:

- bodegas, barbershops, a **church**, an unlicensed dentist, shops and groceries **on
  each floor**, a gym on the roof
- water **hand-rigged and pumped to the 22nd floor**
- **motorcycles carrying residents up the first ten levels**, because there is no lift
- **the old and the unfit lived on the low floors, the young and strong on the high
  ones** — the building's social order was written by its own broken vertical circulation

Why this matters more than any ruin photo:

1. **It is our apocalypse exactly.** Not a bomb. A *banking crisis* stopped the
   construction, and the corpse of the boom became the housing.
2. **It is not decay, it is OCCUPATION.** Every reference in term one was a building
   emptying out. This is a building **filling back up wrong**, and that is far more alive,
   far more human, and far better for a game with factions and an economy.
3. **The infrastructure failure creates the society.** No lift means the strong live
   high. That is a game mechanic written by architecture, and it is the kind of thing
   that makes a world feel real instead of dressed.
4. **It gives us the act structure for free.** Act 1: the shell, empty, arrested.
   Act 2: somebody moves in and adapts it. Act 3: it is a place again, wrong but alive.
   *We already have the act triptych and we have never had a model for what act 2
   physically looks like. This is it.*

**And Bohemia already owns the local version of this:** Las Vegas's half-built 2008
subdivisions. Same story, one storey instead of forty-five.

---

# THE SQUINT TEST, AND OUR TWO-ZOOM PROBLEM

The standard game-art check: black the thing out and squint. If you cannot tell what it
is from the silhouette alone, it does not read. The figure quoted in the field:
**~70% of a design's impact is silhouette, ~30% is detail.** *"The harshest test is the
smallest one."*

**This is a machine-checkable gate and we should have it**, because we have a specific
version of the problem: **every district must read at TWO zooms** —

- the **city-builder icon** (one tile, seen from above, in a grid of 48 others)
- the **walked street** (on foot, inside it)

Our own handoff already records that these two are drifting apart because the CITY tab
does not use the tile set. Lynch's imageability and the squint test give us the standard
that binds them: **the same silhouette must survive both.** The speedway passes this
(a ring reads at any size). The airfield fails it (an aircraft does not survive
shrinking) — and that failure is already documented in our factory after four attempts.
Now it has a name and a test instead of a hunch.

**Proposed gate:** render every district icon at 1 tile, threshold it to pure black,
and require the silhouettes to be mutually distinguishable. Two districts whose black
shapes are the same shape are, at map zoom, the same district.

---

# WHAT THE THREE TERMS ADD UP TO

Three findings, one per term, and they stack:

1. **(Term 1) The building is still trying to sell you something and nobody is buying.**
   Vegas is celebration architecture with nobody left to invite. Draw abandonment, not
   decay. Go dry, not green.
2. **(Term 2) "Meshing" is four bugs, and the dual-grid kills the biggest** — 16 tiles
   per material instead of 47, without touching a single existing generator.
3. **(Term 3) We built paths and districts and no nodes or landmarks**, so the valley is
   texture with no places in it. And pavement is not content until something happens on
   it.

### The build order I would propose, cheapest and highest-impact first
| # | thing | needs new art? | why |
|---|---|---|---|
| 1 | **NODES in every district** — a junction, forecourt, plaza, crossing | no | cheapest legibility win there is; the town proved it |
| 2 | **LANDMARKS — one tall distinct thing per district** | no | fixes the flat skyline; satisfies the 3-visible-landmarks rule |
| 3 | **FILL THE PAVEMENT** — wrecks, salvage, tents, markets | no | answers his loudest note twice over, keeps the 32% real |
| 4 | **DUAL-GRID render layer** | no | unlocks affordable tile art for all 48 |
| 5 | **FOOTPRINT RESERVATION + depth sort on the base** | no | makes this week's four bugs impossible |
| 6 | **SQUINT GATE** on the icons | no | stops two districts sharing one silhouette |

Every one of the six needs **no new art** and all six are in this lane.

---

## THE THINGS I WILL NOT DECIDE (they have piled up across three terms)
1. **How long since the collapse?** Sets the damage level of all 45 districts at once.
2. **Is act 2 occupation?** The Tower of David model says the world gets *re-inhabited*
   rather than just further ruined. That is a canon-level call and it is his.
3. **School: high school or middle school.**
4. **The unfinished never-lived-in subdivision** as a district — Vegas's own true story.
5. **Which district is the revamp test case.**

---

## SOURCES
- Kevin Lynch, *The Image of the City* (1960): [Urbequity — summary + 5 elements](https://urbequity.com/en/kevin-lynch-the-image-of-the-city/) · [ArchitectureCourses](https://www.architecturecourses.org/design/kevin-lynchs-5-elements-city-guide-urban-design) · [Urban Design Lab review](https://urbandesignlab.in/the-image-of-the-city-by-kevin-lynch/) · [computational approach, ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0264275118309776)
- Parking share of US cities / Las Vegas 32%: [Scientific American — 100 cities ranked](https://www.scientificamerican.com/article/parking-lots-cause-more-heat-and-flooding-heres-how-100-u-s-cities-rank/) · [Planetizen](https://www.planetizen.com/news/2023/03/122397-maps-how-much-your-city-parking) · [Next City](https://nextcity.org/urbanist-news/how-much-of-your-city-is-parking-lots) · [The Hill](https://thehill.com/changing-america/resilience/smart-cities/4162455-paved-paradise-maps-show-how-much-of-us-cities-are-parking-lots/)
- Tower of David / Centro Financiero Confinanzas: [Works That Work — urban survival creativity](https://worksthatwork.com/4/tower-of-david-urban-survival-creativity) · [The Daily Beast](https://www.thedailybeast.com/inside-the-tower-of-david-venezuelas-vertical-slum/) · [NPR — the eviction](https://www.npr.org/sections/thetwo-way/2014/07/23/334613896/fall-of-the-tower-of-david-squatters-leave-venezuelas-vertical-slum) · [Bored Panda — Iwan Baan photos](https://www.boredpanda.com/tower-of-david-caracas-abandoned-skyscraper/)
- Squatting / informal settlement / adaptive reuse: [Squatting](https://en.wikipedia.org/wiki/Squatting) · [Squatter settlements overview](https://www.sciencedirect.com/topics/earth-and-planetary-sciences/squatter-settlement)
- Silhouette / squint test / 70-30: [Importance of silhouettes in game design](https://salivity.github.io/game-development/article/importance-of-character-silhouettes-in-game-design) · [80 Level — shape language and readability](https://medium.com/@EightyLevel/character-design-shape-language-and-readability-6ee4bb6f98a6) · [the squint test](https://graphics-pro.com/education/checking-the-readability-of-a-sign-with-the-squint-test/)

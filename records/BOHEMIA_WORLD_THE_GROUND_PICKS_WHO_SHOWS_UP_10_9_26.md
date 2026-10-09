# THE GROUND PICKS WHO SHOWS UP

WORLD lane (chat 02), 10/9/26. Row `[the valley's grounds]`, rule 75b. The lane's
first round since rule 78 lifted the pause.

---

## 0. THE ROW

Paolo, 10/5 and 10/9, and via Grok: **the ground picks who shows up.** A data file
of the valley's grounds, each with its **faction pool** and its **travel cost**,
the costs translated off the Battle Brothers wiki's map speeds — road 1, dirt
0.75, wash 0.5, rubble 0.65, the ranges 0.25; sight 1, hills 1.25, ridges 2.
RUN's parties read the pool, travel reads the cost. A gate: every map cell has a
ground.

---

## 1. RULE 12: HALF OF IT WAS BUILT, AND THE OTHER HALF WAS A GUESS

**The grounds already exist.** `[board terrains]` shipped on 9/30: every map cell
carries one of thirteen terrain kinds, 0 unmapped across a hundred rolled valleys.

So this round wrote **no second list of grounds**. A ground *is* a terrain kind,
read off the module that owns them, and the gate refuses if the two ever stop
agreeing. Two lists of one thing are two lists that drift, and this lane has
measured that failure three times now.

**And the travel cost that shipped is a two-speed world.** Measured on the walked
surface:

```
PAVED = { asphalt: 1, concrete: 1 }
PAVED_SPEED = { factor: 0.5, ruling: 'REALISM FIRST: rough going is about half road pace' }
```

A paved cell costs half, and **every other cell in Las Vegas costs the same**. The
mountains cost exactly what a parking lot costs.

His translated numbers are a **five-speed** world, and they disagree with the
shipped one in both directions: the road's edge over a dirt track is **smaller**
(1 against 0.75, not 2 against 1), and the ranges are **four times worse** than a
road rather than twice.

The shipped number is not wrong, it is **coarse**: it was a street rule, and this
is a map rule. **Nothing here touches the street** — the walked surface says "one
number in one place for the speed... tuning the street tunes the map", and that
stays true of the street. This is the map's own table, travel reads it, and the
conflict is written down rather than resolved by me. Every felt number is TUNING's
(rule 36), so every value carries `tuned:false` and its source.

---

## 2. RULED WHERE HE RULED, MEASURED WHERE HE DID NOT

Four grounds have a speed from his own row. The other nine do not, and inventing
nine numbers is exactly what rule 36 forbids. So they are **measured off the
city's own kits**: a ground's kits declare, cell by cell, what is open and what is
built or blocked, and *how much of a ground you can actually cross* is a fact about
the city, not an opinion.

**And the derived scale is anchored on a ruled point, not a constant I picked.**
Open desert measures 0.50 open and he ruled it 0.75, so the scale is
`openShare × 1.5` and **his number sets it**. That is the whole of the arithmetic.
Retune the desert and every derived ground moves with it. Breaking the anchor
turns the gate red.

| ground | speed | from |
|---|---|---|
| freeway | **1.00** | RULED, road |
| open desert | **0.75** | RULED, dirt |
| landfill | 0.75 | measured |
| golf and park | 0.72 | measured |
| solar and pumps | 0.55 | measured |
| lot and big box | 0.52 | measured |
| the strip | 0.51 | measured |
| wash and shore | **0.50** | RULED, wash |
| suburb block | 0.49 | measured |
| industrial | 0.46 | measured |
| trailer park | 0.41 | measured |
| airport | 0.38 | measured |
| hills | **0.25** | RULED, the ranges |

Sight is his too: 1 everywhere, **1.25 in the hills**.

---

## 3. **THE POOL IS NOT A TABLE. IT IS WHO HOLDS THE GROUND.**

"The ground picks who shows up" could be an authored list of factions per ground.
That would be content, which is his, and it would go stale the moment the map
moved.

It does not need to be authored. `bohemia_towns.turf` already answers who holds
every cell: measured **9,216 of 9,216 cells held, 14 factions, nothing unheld**.
So a ground's pool is **which factions hold cells of it**, weighted by how many,
counted off the live turf at read time.

Take a faction's ground and its crews stop showing up there, **with nothing to
edit**. The gate refuses a stored pool or a hard-coded faction name in the module.

**And the pools are vivid, which is the row's own point:**

- **the Strip: 250 cells, 7 outfits, and one of them holds 92% of it.**
- **the hills: 902 cells, 12 outfits, and the biggest holds 19%.**

One ground is one outfit's. Another belongs to nobody. That is the mechanic
working with no table in it.

---

## 4. THREE THINGS IN HIS LIST ARE NOT GROUNDS

Named rather than faked, the same discipline `[board terrains]` used for its two.
Each keeps its ruled number for the day something marks it.

- **rubble (0.65) is the RUIN**, which is a **CONDITION** — act one *is* the ruin,
  so rubble is a state a suburb or strip ground is in, not a ground.
- **the casino floor is an INTERIOR** — you arrive at a strip ground and go in.
- **a ridge (sight 2) is a FEATURE inside the hills**, and nothing in this valley
  marks a ridge, so a sight bonus for one cannot be read off the map yet.

---

## 5. THE COOK: HOW FAST, AND WHO

`tools/bohemia_who_roams_cook_10_9_26.js` →
`slices/vote/WORLD_HOW_FAST_AND_WHO.png`. VOTE tab, `world-how-fast-and-who-10-9`.

The same valley twice, one pixel per cell on the grid the game really uses. Left:
**how fast you cross it**. Right: **how tightly one outfit holds it**.

**Why the right panel is not coloured by faction.** COLOUR IS TERRITORY (8/26) and
its gate says in its own head that **which faction owns which hue is HIS**.
Painting fourteen outfits in fourteen colours of mine would be this lane deciding
content it does not own, in a picture, where it is hardest to notice. It paints
**grip** instead — pale where one outfit owns nearly every cell, dark where the
ground is split. That needs no faction colour, it cannot leak a ruling, and it is
the better read anyway: the question before crossing is not "whose is this" but
"is this one outfit's".

**The finding, and the tool proves it rather than claiming it: the fast ground and
the owned ground are not the same ground.** The two panels agree on **12.9%** of
the valley. The quickest way across runs through the most tightly held ground in
it; the slowest ground is the emptiest. The tool refuses if the panels ever agree
on more than three quarters, because then the second one is just the first one
tinted and the finding is an artefact of my own ramp.

**AH-01, and the wrong thing is the second map.** Two travel maps of a valley is
the ordinary part, the thing a haulage company would print. The second one is the
same roads shaded by how completely one outfit owns the ground under them, and the
brightest thing on it is the Strip.

---

## 6. ROUTED

- **RUN** — parties read `poolOf({map, turf, ground})`; travel reads `speedOf`.
  Both answer for every cell of every rolled valley.
- **TUNING** — thirteen speeds and two sight values, all `tuned:false` with their
  source. **And the live conflict to settle: the street says a road is 2× off-road
  and the map now says 1.33× a dirt track and 4× the ranges.** Both are defensible;
  only one should survive.
- **FACTIONS** — the pool is derived from turf, so whatever that lane does to who
  holds what moves who roams where for free.
- **COMBAT** — the same ground that picks the pool picks the board
  (`[board terrains]`), so the party you meet and the floor you fight on come from
  one fact about the cell.

---

`[bb grounds]` **Battle Brothers' map speeds are the terrain's and nothing else's**
— a road is fast, a swamp is slow, and who you meet is decided by the faction
territory layer sitting over the top, which is a *separate* system from the
ground. **OUR TWIST, so nobody can call it a rip-off** (rule 39b): ours are **the
same fact**. The ground is both the cost and the company, because in a dead city
the ground *is* the economy — the reason the Strip is worth owning is the reason
somebody owns it, and the reason nobody holds the ranges is the same reason nobody
can cross them quickly. BB's player asks "how long is this road" and separately
"whose land is this". Ours asks one question and gets both answers, and the
unpleasant one is that **the fastest way anywhere runs through the ground most
tightly held by somebody else.**

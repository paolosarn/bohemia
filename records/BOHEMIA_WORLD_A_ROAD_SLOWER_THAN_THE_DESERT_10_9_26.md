# A ROAD SLOWER THAN THE DESERT

WORLD lane (chat 02), 10/9/26. Row `[the roads]`.

---

## 0. THE ROW

The map's road network as data -- the freeway corridor, the boulevards, the surface
streets, the dirt and the washes -- each with its travel speed, which stretches are
blocked, and who patrols them. LIFE+CITY's parties and caravans follow them. **A
gate: every settlement reaches every other by road or dirt.**

---

## 1. RULE 12: THE GATE THE ROW ASKS FOR ALREADY PASSES

Measured before a line was written, over **thirty rolled valleys**, on **paved road
alone with no dirt allowed**: the network runs 3,384 to 3,559 cells and **every
settlement reaches every other in every one. Zero failures.**

The valley's roads were already whole. Nobody had ever checked, so nobody knew.

Worth saying plainly rather than quietly shipping a gate that was always going to
be green: **this file does not connect the valley, it makes the connection
readable.** The gate re-proves it every run, so the day a generator change cuts a
town off, the machine says so instead of a player.

---

## 2. **THE FINDING: THE GAME THOUGHT A VEGAS BOULEVARD WAS SLOWER THAN OPEN DESERT**

`[board terrains]` (9/30, mine) folds `arterial` into the terrain kind
`lot_and_bigbox`. That is **right** for what it is for: a fight on a six-lane
arterial is a fight in a wide road with parking lots either side, so the board is a
lot board.

It is **wrong** for roads. Measured:

| | open share | speed |
|---|---|---|
| the arterial's own kit | 0.60 | **0.90** |
| commercial | 0.25 | 0.38 |
| apartment | 0.31 | 0.46 |
| **the group `lot_and_bigbox`** | 0.35 | **0.52** |

The dirt's ruled speed is **0.75**. So grouped, **a Las Vegas boulevard crossed
slower than driving across open desert.**

**This is not a new dial and it is not mine to invent.** The *method* is already
ruled -- open share × the anchor, from `[the valley's grounds]` -- and this only
corrects **which cells the measurement is taken over**. A ruled ground keeps its
ruled number untouched; only a class whose ground is a mixed bag measures on its own
kit, and it says so in `from`. The conflict is reported, not silently resolved.

| class | speed | from |
|---|---|---|
| freeway | 1.00 | RULED |
| **boulevards** | **0.90** | measured on its own kit *(grouped: 0.52)* |
| dirt | 0.75 | RULED |
| washes | 0.50 | RULED |

**And anything reading "roads" off the terrain kind was driving 469 cells of shops,
flats and a mall.** That is why this is **not a second list**: it reads the *same*
district vocabulary the terrain module reads, so the two cannot drift, but *"what
does a fight here look like"* and *"can you drive it"* are two questions about one
cell and must not share an answer.

**The speeds are not restated either.** A road takes its ground's ruled speed,
looked up live. A second copy of a number is a second number, and this lane has
written that sentence three times now.

---

## 3. **AND I OVERGENERALISED FROM ONE SEED AGAIN. THE GATE CAUGHT IT.**

I wrote that the paved network is **a single component**. True on seed 1337. True
in **six valleys out of ten**.

The truth is tighter and better: what sits outside the main network is **one orphan
paved cell**, in four valleys of ten. The main network carries every settlement and
essentially every paved cell, always.

That false sentence was already in the cook's header and on its way into this
record. It is the third time this lane has been bitten by measuring one roll of a
procedural world, and the only reason it did not ship is that the gate swept ten.

---

## 4. TWO HOLES, NAMED RATHER THAN FAKED

**Which stretches are blocked** -- his "a dead overpass" -- answers **UNREAD**.
Nothing in the valley marks a road cell as impassable; the overmap gives a district
and nothing else. A zero here would be **indistinguishable from "no road is
blocked"**, which is the one thing a traveller most needs to be true.

**Who patrols** is FACTIONS', by the row's own words, and is already derivable off
the live turf the way `[the valley's grounds]` derives who roams a ground. `PATROLS`
ships empty.

---

## 5. THE COOK: THE ROADS

`tools/bohemia_roads_cook_10_9_26.js` → `slices/vote/WORLD_THE_ROADS.png`.
VOTE tab, `world-the-roads-10-9`.

The valley with its roads lit, one pixel per cell: the freeway brightest, the
boulevards just under it, the dirt and the washes dimmer. 3,453 paved cells, 44.7%
of the frame.

**AH-01, and the wrong thing is that it is complete.** A road map with the fast
roads brightest is the ordinary part, the thing a petrol station sells. Every road
in a dead city still joins every other, perfectly maintained by nobody, and the only
thing missing from it is the traffic.

---

## 6. ALSO THIS ROUND: A SEARCH IN THE MOJAVE COULD NOT TURN UP WATER

`engine/bohemia_scavenge.js` (9/29, mine) listed five find kinds: food, medicine,
battery, tape, ammo. **Rule 47 (Paolo 9/29) rules six: BATTERIES, FOOD, MEDS,
ROUNDS, TAPE and WATER.** I wrote the list off his scavenge sentence alone and it
came out five, so **the one thing a body in a desert needs most was the one thing a
search in the Mojave could never find.**

Carried in my own handoff for several rounds as a one-line fix and then not done,
which is the worse half of it. `water` is a kind now, and the gate checks all six
**by his ruled name rather than by counting**, so a seventh kind is allowed and
dropping one of his six is not. Rule 47 also settles the hedge this file carried:
MEDS is one of the six, so `medicine` is no longer a pending fourth icon.

The rename onto his exact six words (`battery` to BATTERIES, `ammo` to ROUNDS) is
**ECONOMY's ledger and MODS' file by rule 47's own words**, not mine, and the
mapping is written in the module one line each.

---

## 7. ROUTED

- **LIFE+CITY** -- parties and caravans follow `network()` and `reaches()`; both
  answer for every rolled valley.
- **FACTIONS** -- who patrols each class.
- **TUNING** -- the boulevard's 0.90 and its grouped 0.52 are both in the data file
  with their sources. Also still live from last round: the street says a road is 2×
  off-road, the map says 1.33× a dirt track.
- **Whoever owns the day card** -- `ROADS ARE FAST` is red on main looking for
  `#daycardIn .dcgo`, a card that was deleted. Same dead-selector root cause as the
  rice clock. I touched no slice.

---

`[bb roads]` **Battle Brothers' roads are a speed bonus drawn on a fixed painting.**
Its world map is authored once, so its roads are a hand-placed convenience: you
follow them because they are faster, and that is the whole of it. **OUR TWIST**
(rule 39b): ours are **generated and then proven**. The network is rolled fresh
every game and a machine checks that every settlement can still reach every other
before a player ever travels -- which BB never has to do, because its map cannot be
wrong. The cost of a rolled world is that it *can* be broken; the answer is not to
hand-place the roads, it is to **know**.

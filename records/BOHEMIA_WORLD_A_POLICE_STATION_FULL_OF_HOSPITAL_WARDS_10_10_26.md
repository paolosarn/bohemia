# A POLICE STATION FULL OF HOSPITAL WARDS

WORLD lane (chat 02), 10/10/26. Row `[the valley has no inside]`.

---

## 0. THE ROW, AND WHO WROTE IT

> **[the valley has no inside]** Across all 50 district kits, of 813 named pieces
> 256 are things you can stand on and **zero** are the floor of a room, so every
> building in the valley is solid to the touch.

Mine, written last round under rule 74 off this lane's own measurement.

---

## 1. **RULE 12: THE MEASUREMENT IS RIGHT AND THE ROW IS WRONG**

The district kits are the **outdoor tilesets**. They draw a block from above and a
building in them is a footprint. An inside was never going to be in them. I
measured one layer and wrote a sentence about the whole game.

**The inside lives in `engine/bohemia_floorplan.js` and has since 7/26.** It is
green in the suite (FLOORPLAN, INTERIOR GROUND). Asked for a city hall's real
footprint it returns **204 floor cells, 97 of wall and 7 doors**, laid out as a
hall, a reception, an office, a records room and a bath. There is a district →
room-grammar table — **DISTGEN, in `engine/bohemia_world.js`, this lane's own
file** — covering **62 of the 78 live districts** across eleven zones. Behind it
is a law: **INTERIOR-MATCHES-EXTERIOR** (Paolo 7/19, LOCKED, *"if your interior
does not match the width and length of the exterior every time, you are
failing"*), gated by `world_gate.js` and `interiors_gate.js`.

**That is three rounds running where rule 12 found the premise wrong, and the
second time the premise was one I wrote myself.** Rule 74 has this lane write its
own next row from its own measurement, and **a premise with my own name on it is
the one I do not go back and check.** Both times the measurement was right and the
sentence I built on it reached past the layer I had measured. Written into the
record rather than a handoff, because it is the third one.

---

## 2. **WHAT IS REALLY WRONG: THE TABLE EXISTS TWICE AND THE COPIES DISAGREE**

`DISTGEN` (the engine) and `IN_ZONE` (the CITY app) are two hand-kept copies of
one table. Parsed live and crossed:

| district | the engine says | the app says |
|---|---|---|
| sign | `leisure` | **not in the app at all** |
| campus | school | institutional |
| firestation | **firehouse** | institutional |
| policestation | **civic** | institutional |
| school | school | institutional |
| terminal | **transit** | institutional |

**Every disagreement collapses a specific grammar into the generic
`institutional`.** The drift is one-way, which means **the app is holding the old
table**: WORLD added five specific room grammars and the thing that builds the
rooms never learned them.

**What that means on the glass.** `institutional` is a ward, a ward, an office, a
service room and a bath, with `ward` as the bulk role. Run both grammars at the
same 44×28 footprint on the same seed:

- **the engine says a police station is:** a hall, a reception, records, a bath
  and fifteen offices
- **the game builds:** a bath, a service room, one office and **fifteen hospital
  wards**

**Same walls. Same doors. Same plan. One of them is a hospital.**

And the firehouse grammar — a garage and an office — **exists and nothing reaches
it.** So does transit: a concourse and a counter. **Five room grammars that work,
wired to nothing.** That is the same disease as last round's casino block, in a
second system, in consecutive rounds.

---

## 3. SIXTEEN DISTRICTS HAVE NO GRAMMAR, AND THAT IS TWO THINGS

**Seven correctly have none, because they are not buildings:** desert, mountain,
springs, water, freeway, interchange, arterial. A grammar for a mountain would be
a room nobody built.

**Nine owe one:** airport, airbase, highroller, luxor, sphere, strat, rail,
robofactory, strip. **Four of those are the Strip's own casinos** — the Luxor, the
Sphere, the Stratosphere, the High Roller — **in a game whose single hand-made
interior board is a casino floor** (and which, as of last round, nothing can
reach).

**Seven of the nine cannot simply be given a zone.** A DISTGEN row needs a kit
module and a footprint function, and those seven have no kit module at all — which
is the open row `[the cells with no board]`'s own list, so it is one job and not
two. **Only `rail` and `strip` are a one-line add.**

**The seven/nine split is a reading and it is stated as mine**, with
`tuned:false`. Which zone each of the nine gets is content and is not decided
here.

---

## 4. THE GATE

`gates/the_insides_gate.js`, 23/0, registered as THE INSIDES.

It **parses both tables live** — DISTGEN out of the engine, IN_ZONE out of the
CITY app — names every disagreement, and holds the count as a **ratchet that may
only shrink**. It **runs every zone either table names through the generator**, so
"the valley has an inside" is a measurement in the file rather than a claim. It
refuses a second copy of the table inside this lane's own module. It holds the
sixteen as a ratchet, refuses the seven/nine split being passed off as a
measurement, and proves every district called blocked really has no kit module.

Mutation-proved three ways: drift one more district in the engine → RED naming it;
keep a district-to-zone map in my own module → RED quoting it; mark the split as a
measurement → RED.

**And one mutation did not land the first time and I did not count it.** Removing
`ward` from the institutional roles left `bulk:'ward'` in place, so the generator
kept making wards and the cook kept passing. That was my test being incomplete,
not the check being weak; changing the bulk role too, both the gate and the cook
go red. A mutation that does not change the behaviour proves nothing, and counting
it would have been the same mistake as a check that measures nothing.

---

## 5. THE COOK

`tools/bohemia_the_insides_cook_10_10_26.js` -> `slices/vote/WORLD_THE_INSIDES.png`.
VOTE tab, `world-the-insides-10-10`.

**Two real floorplans, side by side, both generated by the game's own interior
generator at the same footprint and the same seed.** Left is what the engine says
a police station is. Right is what the game actually builds. Identical walls,
identical doors, identical rooms — and on the right, fifteen of the nineteen rooms
are lit as hospital wards.

The cook refuses to draw if the two tables ever agree about the police station, if
the institutional grammar stops making wards, if the civic one starts, or if the
two plans come back different sizes.

**AH-01, and the wrong thing is that they are the same building.** Two floorplans
side by side is the ordinary part, the thing any drawing set prints. **The police
station in this valley has fifteen hospital wards in it, it has had them for as
long as anybody has been able to walk inside, and nobody noticed because the rooms
are generated and nobody reads the labels.**

---

## 6. ROUTED

- **Whoever owns the CITY app** — one edit ends the whole class: the app should
  read DISTGEN instead of keeping `IN_ZONE`. It already inlines
  `bohemia_floorplan.js` byte-identical, so the pattern exists. Until then
  INTERIORS stays red on three legs and a police station stays a hospital.
- **`[the cells with no board]`** — the seven blocked districts are that row's
  list. One job, not two.
- **`rail` and `strip`** — the only two that are a one-line DISTGEN add. Not done
  here: adding rows while the app cannot follow widens a red that is not mine.
- **COMBAT** — last round's casino block is still unreachable, and the Strip's
  four casinos still have no inside. The two halves are the same hole.
- **TUNING** — nothing felt here. Every number is a count.
- **MODS** — `records/target/BOHEMIA_THE_INSIDES.json`.

---

`[bb insides]` **Battle Brothers has no insides at all, and that is the one place
we are already ahead and did not know it.** Its towns are a menu over a painting
and its fights are always in a field: in six hundred hours you never once stand in
a room. Ours has had a working interior generator for months, matching the
exterior footprint exactly, with a room grammar per district — a jail with a cell
block, a firehouse with an apparatus bay, a terminal with a concourse. **OUR
TWIST** (rule 39b): the fight should go indoors, because a corridor with one door
is a formation puzzle Battle Brothers cannot pose — no flanking, no line, and the
man at the front is the only man fighting. The lesson of this round is the cost of
that lead: **a system nobody is currently playing rots quietly**, and ours rotted
into a police station full of hospital beds. BB never has to maintain an inside;
we do, and the machine has to count it.

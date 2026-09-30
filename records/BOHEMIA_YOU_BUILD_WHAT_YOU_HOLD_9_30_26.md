# YOU BUILD WHAT YOU HOLD, AND WHAT YOU HOLD GROWS
# LIFE + CITY, 9/30/26, row [build a lot] round 2 (rule 43, the invasive round, rule 47)

---

## 1. WHAT THE BOARD ADDED TO MY ROW SINCE ROUND 1

- **Rule 43 (Paolo 9/29, default A):** you build on the lots of the parts you HOLD; taking the next
  part makes it yours, losing it takes it back; a base is every block you hold and can be half the city
  by act 3; the rungs unlock KINDS of building, never places. Who holds what is FACTIONS' ledger.
- **The invasive round (9/29):** the first two things a held part builds are a WALL and a LIDDED WATER
  TANK, because the beasts eat the margins (hogs the gardens, pigeons the water).
- **Rule 47 (Paolo 9/29):** the six: batteries, food, meds, rounds, tape, water.

## 2. HOW BATTLE BROTHERS DOES IT (the meta-rule, 46c: the library first)

Battle Brothers has no holding at all: the company owns nothing on the map. Towns are raided and
their attached locations burned in the late-game crises, and a town you helped reads "well supplied"
while one that was hit reads "raided" and recovers by itself (reference/library/battle_brothers,
01_WORLDMAP and 07_ECONOMY). **Ours keeps that half** (FACTIONS' ledger has two outcomes, TAKEN and
RUINED) **and adds the half they never had**: the part is yours, what
stands on it was put there by you, and when it burns you lose things you built with your own batteries.

## 3. WHAT CHANGED IN `engine/bohemia_lotbuild.js`

**The hold is read, never copied.** Every `start()` and every `tick()` is handed the hold
(`{rec, act}`, FACTIONS' `engine/bohemia_homebases.js` ledger) and asks it who holds the part:

| the ledger says | start() | tick() |
|---|---|---|
| no ledger handed | refused `NO_HOLD` | nothing happens |
| somebody else's people | refused `NOT_HELD`, names who, costs nothing | nothing |
| yours | builds | finishes and pays |
| TAKEN from you | refused `NOT_HELD` | **it stands, pays them, nothing finishes; take it back and it pays you again** |
| RUINED | refused `RUIN` | **everything you built there falls, once:** each one a `demolish` in the century ledger, half-built lots lost with their battery, the lots bare |

**What you hold grows:** `holdings(book, hold, seats)` opens a site for every part the ledger says is
yours, so taking a part IS how the base grows. A ruin is moved into a generation later (FACTIONS'
rule, `RUIN_THIS_ACT`), and you build there from nothing.

**The rungs lock kinds, not places:** every entry carries a `kind` (wall, water, stores, food, light,
market, shelter); a caller may hand the open kinds and a closed one refuses `KIND_LOCKED`. With none
handed every kind is open, because WORLD's kinds table is not cut yet and a list that refuses
everything is a dead screen.

**The first two:** the list now leads with the **WALL** and the **WATER TANK** (the town kit's water
tower, code 11, a real piece). The wall stops being "nothing": it **guards the gardens from hogs**,
the tank's lid **guards the water from pigeons**. `exposed()` names which margins are open (a garden
with no wall, a pump with no tank); the beasts read it when they land (rule 42); until then it is
said, never charged.

**The six:** every entry names which of the six it feeds: tank and pump water, garden food, shed
tape, solar batteries; the stall (a name), the roof (a family) and the wall feed none. **Nothing
you build makes meds or rounds:** you buy those, Battle Brothers' way, and you do not grow bullets in
a garden. The purse still pays in its three locked currencies until ECONOMY [six resources] cuts the
ledger; the six-name is the translation, carried so that cut is a lookup.

## 4. THE GATE: `gates/build_a_lot_gate.js`, 26 -> 56 ok, 0 failed

New legs I-N: no hold no build; somebody else's part refuses and names them, free; taking a part
opens a site there; closed kinds refuse by name; TAKEN stands, pays nobody you know, finishes
nothing, and pays again when retaken; RUINED falls once and **the real derive's act 3 goes
standing 2 -> 0, people 217.2 -> 215**; no build on a ruin the act it fell; a generation later you
move in and build from nothing; the fall survives a save; wall and tank lead the list; hogs and
pigeons open and close; the six are his six; MUTATION: erase the taking from the ledger and the same
part refuses. **Mutations run by hand this round:** make the hold always say "yours" -> 7 red; turn
the ruin rule off -> 5 red.

## 5. THE COOK: `slices/vote/LIFECITY_WHAT_YOU_HOLD_9_30.png`, VOTE tab

On **the street he approved**, the module and FACTIONS' ledger run exactly as the settlement screen
will run them:

    day 0   the Mob holds it: build a wall? REFUSED     batteries 3  water 0  act 3 keeps 0
    day 2   you took it: a wall, a lidded tank          batteries 1  water 1  act 3 keeps 2
    day 3   raided and ruined: what you built fell      batteries 1  water 1  act 3 keeps 0

The wall and the tank were added to the approved street's own drawing as `LOT_ITEMS`, drawn only when
a panel names them, so the approved pictures are **byte-identical** (md5 checked on all four). One
catch on the way: the first wall sat under the lamp's pool and the light washed it into a rail; it
now draws after the light, the swap stand's own lesson one file up.

## 6. OWED BY OTHERS (unchanged, plus one)

RUN's settlement screen calls `holdings / list / start / tick` with FACTIONS' ledger; COMBAT reads
`fightTile()`; COOK draws the shed, pump house, garden bed and roof from the approved street (the wall
and the tank are drawn now); **WORLD [rung unlocks] hands the open kinds**; ECONOMY [six resources]
turns the six-name into the ledger's row; the beasts (rule 42) read `exposed()`.

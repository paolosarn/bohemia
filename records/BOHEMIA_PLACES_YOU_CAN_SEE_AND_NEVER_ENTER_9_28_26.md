# PLACES YOU CAN SEE AND NEVER ENTER
# LIFE + CITY, 9/28/26, row [honest grid] round 2 — rule 34(b), second leg: every floor region connects
# 25,544 CELLS OF FLOOR WERE WALLED IN WITH NO WAY IN. 4,052 OF THEM WERE A KERB AND A BERM.

---

## 1. THE QUESTION, AND HOW IT WAS ASKED

Rule 34(b), Paolo 9/27: **every floor region connects to the street.** The first leg (every cell
has a class) shipped last round. This is the second.

Every one of the 72 registered districts, generated with one fixed seed, every cell classed by the
kit's own `tileLayer()` (the call the walked surface makes), flooded from **every** standable cell
on the block's border. That is the generous reading on purpose: anything still unreached cannot be
entered from any side, so every count below is a floor under the truth, never an exaggeration.

    DISTRICTS 72 · STANDABLE FLOOR 872,345 cells
    STRANDED 26,908 cells (3.08%) in 978 pockets, across 41 districts

## 2. STRANDED GROUND IS TWO DIFFERENT THINGS

The first sweep put the dam near the top of the list, and **the dam was mine**: 0 stranded before
last round's water fix, 889 after. Mapped it before touching anything. The 889 are five blocks of
exposed rock sitting **out in the reservoir**. Before, you walked to them across water that was
pavement. After, they are islands.

**That is not a regression. It is the grid telling the truth.** So stranded ground splits in two:

- **ISLAND** — reached only by crossing a void (water, a pit). An island in a lake is an island.
  You can see it and you cannot walk to it. **Honest.**
- **SEALED** — not reached even crossing voids: walled in by solid things with no gap. A place you
  can see and never enter. **The lie rule 34(b) forbids.**

        ISLANDS          1,364 cells
        SEALED          25,544 cells in 40 districts

Punishing islands would push somebody to make the water walkable again, so the gate counts them and
never ratchets them.

## 3. MOST OF THE SEAL WAS NOT A MISSING DOOR

Asked what walls each of the worst districts in. The answer was mostly **a thing you step over,
classed as a wall**. Swept every district for solid entries whose name is something a body steps
over: 20 hits, triaged one by one.

**The line I drew: a value somebody wrote on purpose is a decision and it stays; a value that fell
out of a kind default is an accident and it gets fixed.**

| district | cell | solid because | verdict |
|---|---|---|---|
| sign | **kerb** | kind default | **ACCIDENT** — its own act-1 line says "the low kerb". Sealed the whole parking lot, 1,394 cells |
| reclaim | **pond berm** | kind default | **ACCIDENT** — its own legend says code 1 is "the service road along the berm tops" and code 4 is "the graded top of a berm". Sealed 2,658 cells, 24% of the district |
| landfill | cell berm | **declared** | a decision — stays, listed |
| apartment | exterior stair | **declared** | a decision — stays |
| mountain | ridge crest | **declared** | a decision — stays |
| chapel / commercial / school / storage | roof ridge | kind default | correct — it is on a roof |
| freeway / interchange | median barrier | kind default | left — seals nothing, and a barrier is ambiguous |
| truckstop, medical, basin, wash, desert, water, fueldepot, granary | props, dikes, sheds | mixed | correct or ambiguous — left |

Both fixes keep the cell a `structure` so it still **draws** as a raised edge; only what it does to a
body changes (`solid:false`). The kit's own 8/20 void note names "a knee-high wall as
structure + solid:false" as the legitimate case, and it is **not** a void: a void is declared.

    sign      1,394 -> 0
    reclaim   2,658 -> 0
    VALLEY   25,544 -> 21,492 sealed, 40 -> 38 districts

## 4. WHAT IS LEFT IS REAL MISSING GATES, AND IT IS FROZEN

The rest are places that genuinely need a way in: the **stadium** field and concourse inside the
stands (3,506), the **landfill** behind declared berms (3,428), the **chapel** memorial court and
orchard (2,296), **water treatment** basins (1,790), the **fuel depot** containment floors (1,420),
the **library** courtyard behind its roof edge (1,009), the **airport** service road airside of its
fence (868), the **solar** field's gravel access road inside the switchgear fence (240), a
**terminal** doorway that opens onto nothing (75). All 38 frozen by name in
`gates/every_floor_region_connects_baseline.json`.

## 5. THE GATE IS A RATCHET, NOT A PASS MARK

`gates/every_floor_region_connects_gate.js`, suite name **FLOOR CONNECTS**, 4 seconds.

A gate that demanded zero today would be red for reasons that are other people's generators, and a
red gate everybody learns to ignore is worse than no gate. So:

- a district whose sealed count **rises** fails, by name;
- a district at **zero** must stay at zero (34 of them now);
- a district that **improved** passes and says "lower the baseline";
- a district **new since the freeze** must be zero. New ground is born honest.

**ONE MEASUREMENT, THREE READERS.** The flood lives once, in
`gates/every_floor_region_connects_lib.js`, and the gate, its baseline and the VOTE picture all call
it. Three copies of a flood fill is how three numbers start to disagree. Cross-checked: the lib and
the scratch sweep agree to the cell (21,492 in 38).

    with the fix                               10 ok, 0 failed
    MUTATION: the kerb put back as a wall       7 ok, 3 FAILED  ("sign 0 -> 1394", by name)
    MUTATION: a walled 4x4 yard with no gate    caught as 16 SEALED
    MUTATION: a dry rock in a pond              caught as 1 ISLAND, not a seal

Nothing else moved: OCCUPANCY 16/0 · DISTRICT KIT 24/0 · LANDLOCKED 16/0 · INTERIOR GROUND 21/0 ·
HAZARD 74/0 · EVERY CELL CLASS 12/0. The derived city slice was resynced (duty 8). Both my gates now
mute the engine's own self-test chatter while loading, so their output is their findings.

## 6. THE COOK (rule 22)

`slices/vote/LIFECITY_PLACES_YOU_CAN_SEE_AND_NEVER_ENTER_9_28.png`, **VOTE tab**. Six real blocks off
their own generators, each cell coloured by one answer from the same measurement the gate ratchets:
green walk, grey solid, blue water or pit, pale island, **RED sealed**.

    SIGN LOT     before 1,394 sealed  ->  after 0
    POND FIELD   before 2,658 sealed  ->  after 0
    STADIUM      3,506 sealed (the field inside the stands)
    CHAPEL       2,296 sealed (the memorial court and orchard)

The two BEFORE panels are the **same generator and seed with the one declaration flipped back in
memory**, so the only difference between a before and its after is the change. The factory refuses to
write if a before shows no seal or an after still shows one, and it measures its labels (last round's
titles collided and then ran off the edge because they were sized by eye).

**THE ANALOG HORROR LINE** (rule 30): a place that looks entered and cannot be. A painted parking lot
nobody can walk onto. A field inside a stadium nothing in the valley can reach. One wrong thing in an
ordinary frame, and the wrong thing is a door that was never drawn.

## 7. NEXT ON THIS ROW

1. **The real missing gates**, biggest first: the stadium needs its tunnels, the solar compound and
   the airport need a gate in the fence, the terminal's doorway needs to open onto something. Each is
   a generator edit, and the ratchet lowers as each lands.
2. **The dead-pad leg** of 34(b): a press into a wall is never a dead pad.
3. The `water:0` (solid) vs `intake:8` (floor) contradiction from last round is still named and still
   not mine to rule.

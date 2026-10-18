# COOK FOUR, round 11 (10/18): THE CHURCH UNDER THE STRAIGHT ROOF, IN THE VALLEY'S TANS

Lane: cook 4. Rows: [one at a time], [the six buildings from the packs]. Rule 101d: one asset a round.
Opened by the coordinator (rule 112), run to the end, no question asked.

## Why this asset
Round 10's NEXT line: "his word; then the church, one round (the casino last)." Of the six building types
(church, school, gas station, motel, warehouse, casino) the family had drawn the motel, the gas station, the
warehouse and the school; the church is the fifth. Church versions: one (rule 95). First this round: the
school round's board row, card and handoff block were checked on main (05dff4a9, 493153b2) before any work.

## What it is
The valley's stucco parish church of 1940-1965, at 57 px a metre, 29 m:
- the nave: 18 m of his flat tan render (Wall tiles 1 #7) to a 5 m plate, five bays, each with his one
  round-topped window (5. #15, the arched one with its fanlight) at a 1.4 m sill; two of them mirrored so the
  breaks differ, the middle one boarded with the planks of his boarded window (#18) over its glass; the bays'
  seams in shade; 1.8 m of plain render above the windows (the rest area, see below); under one measured tan roof;
- the bell tower: 4.2 m square of his light stone panels (Wall tiles 1 #5), 12 m to its plate, standing 1 m
  proud of the nave at the entry end; in its foot two of his plank doors (4. #7, the right leaf mirrored) under a
  transom of his glass; over them his arched window; at 7 m his bronze-framed cross niche, cut from the dark stone
  of Wall tiles 1 #4 and set once; under the cap the belfry, two of his louvred windows (#17) side by side; the cap
  is the measured roof at the tower's own depth (a 4.2 m tower is not a 10 m house deep) with a 0.6 m eave;
- the parish hall: 7 m of his cracked tan plaster at one storey on the far end, a door (4. #8) and two windows,
  its own measured tan roof, the motel's swamp cooler (15. #29) on it;
- his iron railing (15. #18) past the hall, three panels; the man at the tower doors.

## The one wrong thing (analog horror)
The pews are out. Six of his benches (17. #1) stand on the forecourt in three rows with an aisle, empty, and
they face the road, not the doors. Nothing is painted for it; it is where things were put.

## Two fixes on the family's way
- THE LOWER ROOF TUCKS UNDER: the hall is drawn before the nave, so its roof's near eave sits under the taller
  nave's end and the nave's eave laps over it. The school drew its lower wing last, so the wing's roof crossed
  the gym's corner; the church does not repeat it (the school is a placeholder, never edited, rule 101c).
- THE CELL CHECK: the tool runs the not-vibe-coded gate's own ruler on every 96 px cell of the building before it
  saves (the ground packs' band, D2 and D5, exactly as N3 reads a tile card) and refuses to write on a red cell.
  Its first run found one: the middle of the hall roof (no_rest 0.839 past the packs' 0.834). The fix was the
  part, never the ruler: a swamp cooler on the hall roof, as every flat and pitched roof in the valley carries and
  as the motel already has. Then 0 red.

## The checker mismatch the school round flagged, measured again
PLUMBER's ground ruler (5d50863) now judges a tile card a pack tile at a time and does not hold D3 on it, so my
three cards' D2 and D3 reds are gone. What is left is D5 only, and it is real. Located cell by cell:
- the school's 16 red cells are one band: the covered walk's flat roof, his grey-tan slate laid 27 m with the
  same shingle in every cell and no rest;
- the warehouse's 3 red cells are the three roll-up curtains, his shutter's slats run edge to edge;
- the gas station's 1 red cell is a lift bay's roll-up curtain, the same.
So the tell is not the whole building: it is two parts, the slate walk roof and the slat curtain, each the same
detail across many cells. The three are placeholders (rule 101c, never edited), so N3 stays red on them, named
here, not hidden. The church carries neither part. When a redo of any of the three is asked, the walk roof gets a
rest area (weather on it, the shade of what stands on it) and the curtain breaks its run (a dent, a door up a
hand's width, a plate), each checked by the same cell check before it saves.

## Gates
- REFERENCE CHECK 492/0 (283 cook tools, 198 carry checks).
- THE TWIN GATE: the church's card is scored against his pack #30 and is not RED; the one red is COOK TWO's
  street joins (col_kpx), not this lane's.
- NOT VIBE CODED: N3 reads the church and passes it; its reds are my three older cards (D5, above).
- VOTE TAB GATE 38/1: my card clean after one fix (its why was three sentences, now two); the one red is
  DYNASTY's two whys with no 'where', on main before this round.
- Full suite unmeasured (rule 13).

## WEAK
- His arched window is 1.7 m tall, short for a nave; a real one runs 2.5 to 3.5 m. No taller round-topped window
  exists in the packs, and two stacked would be a part that exists once laid twice.
- The cross is his niche at 1:1, 0.5 by 0.7 m: honest, but small; no free-standing cross in the packs for the
  tower's top, and scaling one would mix pixel sizes (rule 114).
- The pews are his park benches, 1.7 m; a real pew runs 3 to 5 m.
- The swamp cooler is his grey utility box with a warning sign, the motel's same stand-in.

## Caption (rule 114c)
Native pixel size: his 96 px pieces at 1:1, 57 px a metre. Palette file:
reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json. Light: from above.

## Files
- tool: tools/bohemia_cook4_the_church.py (imports the family, the measured roof, the tans and the motel's
  straight roof; new code is the cross cut, the boards, the pews' shadow, the cell check and the layout)
- asset: reference/art_bank/settlement/COOK4_CHURCH_STRAIGHT_ROOF.png (2015 x 1084)
- sheet: records/target/COOK4_THE_CHURCH.png (his pack #30, the man, the tan ranch and the gas station at 1:1)
- VOTE: cook4-the-church-10-18, a PLACEHOLDER (ROUND THIRTEEN). Nothing to slices/ or engine/.

## [bb research]
In Battle Brothers the temple is one of the buildings a town can carry, and it is where you pay to have a
wounded brother's injuries treated: a place with a job, not a backdrop. The church here is drawn as that kind of
place: the one tower in a valley of single storeys, the building a party finds a town by.

## Next
His word; then the casino, the last of the six, one round. After it, on his ask: the walk roof and the curtain
with a rest area (above).

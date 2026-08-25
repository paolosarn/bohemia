# FOUR DISTRICTS A CAR COULD NOT DRIVE INTO
## RULE NUMBER ONE was red on main and stayed red because nobody could tell which half was broken
### 8/25/26, WORLD lane

Paolo, 7/31: *"how dare you continue to make streets in a district that don't connect with each
other, that's rule number one bro."*
Law: `laws/BOHEMIA_ADDENDUM_RULE_NUMBER_ONE_7_31_26.md`

`gates/drive_network_gate.js` has been RED on main ever since, and yesterday's pass is why it
could finally be fixed: once paint stopped counting as pavement, eleven districts came green and
**four were left standing there, unmistakably broken, with nothing to hide behind**.

    prison   9.6% of 1,826 drive tiles reachable from the street
    fort    52.9% of 187
    dam      0.0% of 239
    minigp   0.0% of 4,929

They were never in the 7/31 debt list, because they were written after it. Adding them to it
would have turned four broken districts green with one keystroke. That is the one thing a
ratchet must never let anybody do, so they got fixed instead.

**Every one was a different fault, and only one of the four was the metric.**

---

## dam — A GATE IS THE HOLE YOU DRIVE THROUGH

Zero percent. 239 tiles of road across the crest of Hoover Dam that a car could supposedly
never touch.

Nothing was wrong with the dam. Its access road meets the street **through its gate tile**, and
`K.driveMask` counted a `gate` kind as a wall. The road stopped one tile short of the street on
the only tile that exists to let you through.

A gate now CONDUCTS, exactly like paint and exactly like an overhead — it carries the path
without being road itself. Measured across every registered district before changing it:
**exactly two move.** It is not a loosening; it is the single case a gate exists for. The
STREET-AWARE / DRIVABLE ACCESS LAW says one car entrance on the primary street. This is that
entrance.

    dam  0.0% -> 100.0%, in all four street placements

### and its road was 1.5 metres wide

The other half of the same district. The crest carried this:

```js
a.set(vx, crest - bow, 1);
a.set(vx, crest - bow + 1, 1);
```

**Two tiles. At TILE=0.75 m that is 1.5 metres** — a footpath, not the highway that ran over
Hoover Dam for seventy years. The hairline check said 0% of this district's lanes were wide
enough to drive, and it was right. It is the exact defect Paolo circled on the mall: *"he
circled two of them and asked what they were supposed to be."*

Seven tiles now — 5.25 m, two lanes a bit over 2.5 m each, which is what a crest road genuinely
is: narrow, parapet either side, no shoulder. The three tiles of wall left on each side ARE that
parapet. Seen from above a dam crest is mostly road; the mass you read as the dam is the
downstream face, and a top-down view foreshortens it.

## minigp — THE KARTS WOULD HAVE HAD TO BE BUILT INSIDE THE BARRIER

Zero percent of 4,929 tiles. This district's own circulation note says:

> "The circuit and the pit lane are one connected DRIVE surface (codes 1 and 6) entering off
> the street at the paddock gate, so a vehicle can get onto the track."

**It did not.** The entrance ran five tiles in from the kerb and stopped in open outfield. The
tyre barrier was an unbroken ring around the entire circuit. The track and the pit lane were a
sealed island. A NOTE IS NOT A FACT UNTIL A GENERATOR WRITES IT.

Every club circuit has an ACCESS GAP in the barrier at the paddock end, where karts are wheeled
out onto the circuit. The entrance now runs from the kerb, up the clear strip beside the
paddock, and through that gap onto the main straight — which the pit lane already joins.

## prison — A SALLY PORT THAT PIERCED NEITHER FENCE

9.6%. The sally port ran from fy(0.80) to fy(0.88), which is **entirely outside the outer wire**.
It touched neither perimeter run and never reached the compound road. A transport could drive up
to the prison and then had nowhere to go; the approach road led to a box.

What a sally port IS: a vehicle trap with a gate at each end, cut through the double perimeter,
so a transport enters, both gates never open at once, and it comes out on the compound road. It
now spans from just inside the road ring down to the approach road, cutting the inner run and
the outer run on the way — which is the only reason either run has a gap in it.

## fort — A FOOTPATH PAINTED OVER THE ROAD

52.9%. The interpretive path is a loop around the fort, and its bottom run crosses the access
track. It was drawn SECOND, so it painted straight over the track and **cut it clean in two**.

Where a path meets a drive on a real site, the path crosses at grade and the drive runs through.
You do not lift the road out and put gravel in the gap. The track is drawn last now.

---

## THE RESULT

    DRIVE NETWORK GATE: 15 passed, 0 failed  (69 districts · disconnected 11/11 · hairline 4/4)

Green for the first time since the law landed on 7/31. `BADNOW_CEILING` is 11, exactly the size
of the named debt: **nothing is unexcused any more.**

## WHAT THIS SAYS ABOUT RATCHETS

The four were visible for a full day before they were fixed, and the temptation each of those
times was one line: add them to the debt set. It would have been green in ten seconds and it
would have buried a dam with no road, a race track nobody can reach, a prison gate that opens
onto nothing, and a fort road cut in half by a footpath.

**A named-debt ratchet only works if naming something is expensive.** The moment it becomes the
cheap way out, the list becomes the place broken things go to be forgotten. The rule that held
here: EXCUSE NOTHING YOU HAVE NOT DIAGNOSED. Once each one was diagnosed, three of the four were
half an hour of work, and the fourth was a two-line change to what a gate means.

LAWS SERVED: RULE NUMBER ONE (7/31), STREET-AWARE / DRIVABLE ACCESS (7/19), WALKABLE-LAND
(7/20), A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, VERIFY ON THE REAL SURFACE.

---

# AND WHILE I WAS IN THERE: 41 DEAD CODES DOWN TO 10

## THE FREEWAY JUNCTIONS HAD NO LANE MARKINGS, OFF BY HALF A TILE

`interchange:2 white lane line` was in the dead list. The code that draws it has been there
since the module was written and it is right in every way except one: **it compares a DISTANCE
to whole numbers.**

```js
if (offV === EDGE || offH === EDGE) return 2;
if (offV >= 0 && LANE_LINES.indexOf(offV) >= 0 && dashV) return 2;
```

The mainline centre of a 128-tile cell is **63.5** — an even span has no middle tile — so every
offset it produces is 3.5, 8.5, 13.5, 22.5. Measured as a histogram, entirely half-integers.
`offV === 23` and `indexOf(8.5)` can never be true. Not once. On any cell. Since the day it was
written. **2,255 travel-lane tiles per junction and zero paint on any of them.**

The offset is a tile INDEX now (`Math.floor`), which is a no-op when a centre is a whole number
and the right answer when it is a half — so it works whatever parity a junction happens to get,
and nobody has to know which. And the edge line is DERIVED (`bandOf(off + 1) !== 1` — the last
lane before the shoulder) instead of hard-coded for one parity. **401 lane lines per cell.**

`interchange:14 sign gantry` was the other dead row there. Gantries every 210 tiles across the
carriageway, overhead so you drive under them, only where a mainline runs at grade — you do not
hang a gantry under a bridge.

## THE REST

    warehouse:10   dead cars in the reserved stalls -- the stall paint is the whole reason the
                   code exists: a RESERVED stall is reserved for somebody, and the tell that the
                   tenant never came back is that their car is still in it.
    arsenal:13,14  the cable trench beside the service lane; lightning masts in the aisles
                   between the ranks (a magazine field is the one place a strike is a mass
                   casualty event).
    basin:13,14    the box storm drain leaving the outlet -- a basin is half a structure without
                   the pipe that takes the flow away; the stage gauge on the crest.
    reclaim:14     the vent stack on the blower house, the only vertical on a site of flat
                   rectangles.
    radio:6        the guy anchor blocks. These were being DRAWN AS CODE 7, which the legend
                   calls the 'anchor / base plate' -- a different object. So code 6, the lump of
                   concrete out in the open, was never placed anywhere in the valley.
    radio:7        AND FIXING THAT KILLED CODE 7, because nothing else drew it. Caught before
                   shipping the trade: code 7 is now the concrete pier and base plate the mast
                   is pinned to, which is what it was always for. A mast this size does not sit
                   on dirt.

    DEAD CODE GATE: 5 passed, 0 failed  (10 dead / 1054 codes in 67 built districts)

Was 41 two days ago.

## A DECORATION THAT CHANGES THE LAYOUT IS NOT A DECORATION

The warehouse cars went in as `if (r() < 0.34)`. That consumes a draw per unit and **shifts
every later draw in the whole district**: three more bays came up burned-out, the code-2
footprint count fell 12 to 9, and `warehouse_gate` went red on a check about tenant units that
had nothing to do with cars.

Derived from the unit index and the seed instead. Same per-unit answer, same determinism, and
the sequence `r()` hands out is byte-for-byte what it was. Footprints back to exactly 12.

## AND THE PICTURE TOLD ME SOMETHING I DID NOT ASK IT

The LOOK shot of the new dam crest road came back showing **the dam wall rendered as
brickwork**. It is an arch-gravity concrete wall.

`texKindFor(col, isStruct)` has three families for anything standing up: canopy, rock, and
otherwise **roof**. `rock` is reached only through `__terrainRockCols()`, which sweeps the
TERRAIN districts. The dam is infrastructure, so its wall falls through to the roof pattern and
gets shingles. So does every other concrete mass in the game that is not in a terrain district.

This is the same class as "the mountain shipped as brickwork" that `occupancy_gate` still warns
about. It is NOT fixed here — it is a rendering change with a blast radius across many
districts and it deserves its own pass with pictures. It is named in the handoff as the next
item, and the picture's caption says it in plain words rather than pretending the shot is
clean. VERIFY ON THE REAL SURFACE cuts both ways: looking at the picture is how you find the
thing you were not looking for.


---

# CORRECTION, SAME DAY: THE CAUSE ABOVE IS WRONG

The section above says the dam falls through `texKindFor` to the procedural `roof` painter.
**It does not, and it never reaches texKindFor at all.**

`realizeCell` hands every structure tile in every non-terrain district the APPROVED HOUSE-ROOF
ART POOL:

```js
if(!KIT_TERRAIN[d]){ c.artPool='hroof'; c.tint=pal; }
```

and `texFor` returns that art before any procedural kind is asked for. So the dam was not
wearing a generated shingle pattern -- it was wearing Paolo's actual approved house roof tiles,
tinted grey. Measured on the running page at the exact camera position of the photograph:
`artPool='hroof'` on every wall tile.

**HOW I FOUND OUT I WAS WRONG: I built the fix for the cause I had written down, ran it, and the
retaken picture was PIXEL-IDENTICAL.** A fix that changes no pixels is not a fix. The procedural
concrete painter was necessary and is what draws now, but on its own it was unreachable, and
only the photograph said so. Reading the code once more would not have found it, because the
code I was reading was correct and irrelevant.

The full fix and the reasoning are in
`records/BOHEMIA_A_COLOUR_IS_NOT_AN_IDENTITY_8_25_26.md`.

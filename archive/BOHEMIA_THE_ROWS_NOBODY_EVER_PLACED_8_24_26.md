# THE ROWS NOBODY EVER PLACED
## Fifteen legend codes that were written down and never once put in the game
### 8/24/26, WORLD lane

`gates/dead_code_gate.js` shipped yesterday with a debt of 41: forty-one tile codes that a
district author had written into a legend, described in act-1 prose, gated by tilespec_gate,
printed into a dossier, and that no generator anywhere ever wrote onto a grid. This turn took
that number to **19**.

None of it was new design. Every single one of these was already authored. The work was finding
out why the authoring never reached the screen, and in three cases the answer was a genuine bug
that had been eating content silently for weeks.

---

## 1. NINE DISTRICTS AUTHORED A `marking` AND NONE OF THEM PLACED IT

    arsenal   "the magazine number stencilled on the headwall"
    basin     "the elevation marks on the outlet box, the record of every flood that filled this basin"
    quarry    gypsum    radio ("call letters stencilled on a hut door")
    reclaim   reservoir  substation  watertreat

A whole authoring pass of small human detail -- the number somebody painted on a thing so that
somebody else could find it -- written into nine legends and never written into a generator.

THE FIX IS A MECHANISM, NOT NINE PATCHES. `K.stencil(grid, {on, near, mark, count, seed})` in
the district kit: it collects every cell of code `on` that touches a cell of code `near`, then
spaces `count` marks evenly through them. Seven of the nine are in the utility factory and
declare their mark as one line of data in SPECS (`mark:{on:6, near:4, count:5}`), consumed by
the shared `buildCanonical`. The mark is a FACT about the district; the placing is a MECHANISM.
`substation` and `watertreat` are their own modules and call it directly.

Placed, per plot: arsenal 4, basin 3, quarry 4, gypsum 4, radio 2, reclaim 3, reservoir 5,
substation 5, watertreat 5.

## 2. TWO DISTRICTS' POLE LIGHTS WERE PLACED AND THEN PAVED OVER

This is the one that matters, because it is a BUG and not an omission, and it is the same bug
in two unrelated files.

    boneyard   four yard lights at [9,14] [106,14] [9,100] [70,100]
    reservoir  four pad lights at [10,16] [W-11,16] [10,H-20] [W-11,H-20]

Both generators set their lights and then, further down, cut the drive network on top of them.
The boneyard draws its west spine across x 7-9, its east spine across x 106-108 and its cross
lane across y 100-103 -- which is all four lights. The reservoir uses the shared `tanks` layout,
and `buildCanonical` cuts a full perimeter ring at x 8-10 and x W-11..W-9 after every layout
returns -- which is all four lights. **Both yards have been pitch dark since the day they were
written, every seed, and nothing said a word**, because a light that was overwritten looks
exactly like a light that was never authored.

The other eight utility layouts light at x=12 / x=W-13 and were never touched. `tanks` was two
tiles out. A POLE LIGHT STANDS BESIDE A LANE, NOT IN IT.

The boneyard's four now go down LAST, after the lanes and after the gate, on the clear strip
between the fence and the first row of wrecks and on the landside apron past the cross lane --
so nothing left in that generator can take them away again.

This lands directly on top of the 8/21 streetlight pass, which taught the renderer to stand the
approved lamp body on any tile whose legend NAMES it a light. Both of these districts declare
'pole light'. They now get a real lamp on them, and at night `POWER.at().live` decides whether
it burns. Two more yards join the grid.

## 3. FOUR DISTRICTS AUTHORED "DEAD BRUSH CAUGHT IN THE FENCE" AND NEVER GREW IT

    jail        "dead brush caught in the wall + wire"
    railyard    "dead brush in the ballast + fence"
    substation  "dead brush caught in the double perimeter fence"
    watertreat  "dead brush caught in the perimeter fence"

Every district in the utility factory places its brush; these four wrote the row and never wrote
the tile. Same machine as the markings: `K.stencil({on:0, near:12, mark:3, count:22})` -- on the
setback where it meets the fence, which is where the wind actually puts it. 495 candidate cells
in every one of the four, measured before placing anything.

It is not decoration. A live switchyard is sprayed and graded, because brush against a grounded
fence is how a fence stops being a fence. Brush in it says the last person with a licence left a
decade ago.

### AND TWO OF THEM WERE PAINTING IT GREEN

`jail:3` was `#3a4526` and `watertreat:3` was `#3a4020`. Olive. The rest of the family paints
dead brush `#3f382c`, and so does every district in the utility factory. **A dead code hides a
dead colour**: the wrong tone was never once on screen, so nobody ever saw it to catch it. Both
are `#3f382c` now, and the jail's exercise yard went with them -- its legend calls it "dead dirt
+ a ghosted court line" and it was painted `#55603a`, which is lawn. ACT ONE HAS NO VEGETATION;
what it has is what died.

## 4. THE RESERVOIR'S STANDPIPE

`reservoir:14`, "the standpipe beside the tanks", authored and never drawn. A standpipe is how a
gravity system takes a surge without splitting a main: a tall open column whose water level IS
the pressure in the pipe. It stands on the pad between the two tanks, above the manifold it
protects, with its own line down into it, its top hatch and its gauge. It starts at y=15
because the perimeter ring is cut across y 9-11 -- the exact thing that had been eating this
district's lights.

## 5. SIX FALSE ENTRIES CAME OFF THE WORKLIST

`bohemia_airfield.js` registers `airport` and `airbase` against ONE shared LEGEND object and
then branches on kind: the landside band is `kind==='airport' ? 8 : 9`, and the apron is a jet
bridge and an airliner on one, a fighter in revetments on the other. So each district carries
six of the other's rows and each of those rows is dead by design.

v1 of the gate named all six with reasons and v2 dropped them, which put six false entries in a
worklist somebody is supposed to be able to trust. They are back in CONDITIONAL, read out of the
source at lines 102 and 158-174 rather than inferred.

---

## THE RATCHET

    41  ->  32   the nine markings
        ->  26   the six airfield kind-variants, correctly excused
        ->  19   the four brush, the two yards' lights, the standpipe

`gates/dead_code_gate.js` DEBT is 19 and may only ever come down.

## WHAT IS STILL DEAD (19)

    interchange:2  white lane line       interchange:14  sign gantry
    arsenal:13 cable trench              arsenal:14  lightning mast
    basin:13 storm drain                 basin:14  gauge mast
    radio:6 anchor block                 reclaim:14  vent stack
    mountain:8 alluvial fan              warehouse:10  abandoned car
    casino:7 entry apron                 convention:5  drive entrance
    resort:9 colonnade pier
    arterial:0 dirt shoulder             downtown:0  desert dead-ground
    industrial:0 dead-ground             freeway:0  dirt frontage
    freeway:16 rail ballast              freeway:17  rail under bridge

The biggest of these is **the interchange having no lane markings at all**, which is a job for
the harmonized street pool (STREETS ARE THE HARMONIZED POOL, Paolo 7/31) and not for a stencil.
The `code 0` entries are the fill-through margin that a dense district never leaves; the two
`freeway:16/17` are rare co-occurrences that a 160-cell sample may simply be missing, which the
gate says out loud rather than pretending otherwise.

## THE LESSON, WHICH IS THE SAME ONE ALL WEEK

A thing can be authored, described, gated, documented and completely absent, and NOTHING makes a
sound. The streetlights were silent. The cars were silent. The stale inlined modules were silent.
Two whole yards have been unlit since the day they were written. The only cure is a machine that
reads the world that actually got built and reports what is not in it, and the only reason this
turn found the paved-over lights is that such a machine now exists and told on them.

LAWS SERVED: FACTORY LAW (one mechanism, thirteen consumers), A LAW WITHOUT A MACHINE GATE IS
NOT ENFORCED, ACT ONE ONLY, MECHANISM-MINE / CONTENTS-PAOLO'S (every word placed here was
already written by the district's own author), VERIFY ON THE REAL SURFACE.

---

# THE SECOND HALF: PLACING THEM BROKE THREE GATES, AND EVERY ONE WAS RIGHT TO BREAK

Putting fifteen authored codes into the world set off three gates. Not one of them was noise,
and not one of them was fixed by moving a number.

## PAINT IS NOT A WALL -- AND IT IS NOT A ROAD EITHER

DRIVE NETWORK went from 25 broken districts to 34 the moment the nine markings landed. Every
one of the nine read 99.8% instead of 100%.

`K.driveMask` counted `kind:'marking'` as DRIVE SURFACE. The 7/31 rule behind that is right and
is untouched: a stall stripe is paint on asphalt, a car drives over it, and treating it as an
obstacle invents pockets that are not there -- that is what stranded ten tiles of the commercial
lot behind its own parking stripes. But a stencilled bay number on a gravel yard is not a road,
and counting it as one made it an unreachable road. A car was never denied anything. THE METRIC
WAS COUNTING PAINT AS PAVEMENT.

The kit already drew exactly the distinction paint needed, for overheads: a skybridge CONDUCTS
a path without being counted as drive surface. Paint is a conductor now.

**ELEVEN DISTRICTS CAME GREEN THAT NOBODY TOUCHED**: apartment, ballpark, campus, downtown,
jail, landfill, park, railyard, terminal, trailer, warehouse. Every one had been reported broken
since 7/31 because of its own markings. They are struck from the debt. 25 -> 15.

`driveWidthScore` needed the other half of the same thought: a lane line does not make a lane
narrower. Paint is unioned back in for the neighbourhood test, never for the denominator.

FOUR ARE GENUINELY BROKEN AND ARE DELIBERATELY NOT EXCUSED: prison (9.6% of its drive surface
reachable), fort (52.9%), dam (0.0%), minigp (0.0%). Verified red on origin/main before touching
anything, so they are inherited. dam and minigp have ZERO drive tiles touching the plot edge --
their whole network is sealed off from the street. Putting them in the debt set would turn four
broken districts green with a keystroke, which is the one thing a ratchet must never allow.

## THE SAMPLE ONLY EVER SAW THE TOP OF THE VALLEY

DEAD CODE reported `solar:2 control building` and `solar:6 substation switchgear` as newly dead
after another lane's ONE SOLAR FARM change merged. Censused across all 301 solar cells: **378
tiles of control building and 960 of switchgear, both alive.** The gate took cells in raster
order and stopped at 160, so for any district bigger than 160 cells it read the top of the map
and called the rest absent. I came within one keystroke of raising a ratchet to cover two deaths
that had not happened.

The sample now spans every cell a district occupies. (And the first correction was wrong too:
`i += floor(len/CAP)` at len=301, CAP=160 gives a step of 1, which is the original bug again.
`k*len/CAP` is the one that actually spreads.)

## IF I CANNOT WRITE WHAT A PIXEL IS, IT DOES NOT SHIP

ANSWERED FOR went 75 -> 86 stub write-ups. Diffed against the baseline: exactly eleven, exactly
mine. Placing a code puts its legend entry on screen, and eleven of them had act-1 lines a
character or two under the bar -- "a yard pole light, head dark", "dead brush in the ballast +
fence". They had never been measured because the tile had never been drawn. All eleven are
written now. 86 -> 75.

## AND THE PICTURES

LOOK went red: nineteen of the twenty-three stale pictures photograph the CITY WORLD, and the
gate said "NO SHOOTER RECORDED -- add one" for every one of them. Another lane read that as
unfixable and handed it over twice.

IT WAS NEVER UNFIXABLE. `tools/bohemia_look_shots.js` has taken those seventeen since 8/8, it
already supports `--only`, and the manifest it writes ITSELF simply never recorded that. A
capability nobody can find is the same as one that does not exist. The tool now records its own
shooter line, the-spawn-sidewalk is a subject at last (title and caption kept word for word from
8/20 -- it is being given a way to be retaken, not rewritten), and all 34 pictures are current.
LOOK: 24 passed, 0 failed.

New picture: **THE YARDS LIT** -- a pole light standing in the wrecking yard, which is a picture
of something that has never once been on screen.

## THE PATTERN, THREE MORE TIMES

Every one of these was THE INSTRUMENT, not the thing measured. Paint counted as pavement. A
sample that only read the top of the map. A picture that could not be retaken because the tool
never said it could take it. That is now roughly a dozen times in two sessions, and the rule
holds: A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE INSTRUMENT
COULD HAVE SEEN A POSITIVE ONE.

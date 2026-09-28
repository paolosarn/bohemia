# THE MAP PAINTS ONE PIXEL IN THIRTEEN (PLUMBER 9/28/26, row [density leg], rule 38a)

Paolo 9/28: "how many pixels the Battle Brothers map is and we need to have that exact same number
at the bare minimum... that has to happen like now." DIRECTION [bb density] wrote THE MAP FLOOR
(records/BOHEMIA_BB_DENSITY_THE_MAP_FLOOR_9_28_26.md): the map canvas at the phone's own pixels, no
flat-colour cells, and one painted unit per 1.5 device pixels or finer. This row is the gate that
reads it on the glass, per push.

## THE ANSWER FIRST

| surface | view | map canvas | shown on the phone | one painted unit covers | share of the phone's pixels |
|---|---|---|---|---|---|
| demo | opening zoom (czoom 1) | 378 x 830 | 1134 x 2490 | **3.62 x 3.54 device px** | 7.8% |
| demo | far stop (czoom 0.208) | 378 x 830 | 1134 x 2490 | **7.95 x 7.32 device px** | 1.7% |
| alpha | opening zoom (czoom 1) | 378 x 773 | 1134 x 2319 | **3.46 x 3.38 device px** | 8.6% |
| alpha | far stop (czoom 0.208) | 378 x 773 | 1134 x 2319 | **7.97 x 7.26 device px** | 1.7% |

Battle Brothers paints one unit per screen pixel. Ours paints about one in thirteen when the map
opens and one in fifty-eight at the far stop. Measured twice on both surfaces through the one driver
on a phone profile (390 x 844 at 3x); the two readings were identical to the hundredth.

**The first cause is one line of setup, not the art:** the map canvas is created at the page's CSS
size (378 wide) on a 3x screen, so every pixel it paints is shown as a 3 x 3 block before a single
tile is drawn. Floor item 1 fails by construction. The second cause is DIRECTION's: map cells drawn
as one flat colour (floor item 2), which is why the far stop is twice as coarse as the opening view.

## THE FLOOR'S OWN MEASURE CAN BE PASSED BY BLUR

Floor item 3 reads the mean flat-colour run off the screen. Read that way, the demo's opening view
scores **1.15 x 1.11: under the floor, a pass**, on a map painting a third of the pixels each way.

The browser smooths the 3x stretch. Every device pixel then differs from its neighbour by a shade,
and a shade counts as a new run. Proven both ways: the canvas's own pixels read 1.21 x 1.18 runs, each
shown 3 device px wide (3.6 x 3.5); and self-test S3 draws random detail at 126 x 100, stretches it 3x
with smoothing, and the glass reading gives 1.01 x 1.01 where the truth is 3.0.

So the gate's verdict reads **the canvas's own pixels, times the device pixels each one covers**.
The glass reading is still printed beside it, labelled, because it is DIRECTION's measure and it keeps
their 9/24 frame comparable: read the same way, their filed frame gives 3.79 x 3.51 (their record:
3.8 x 3.5). Their 9/24 number was the blurred reading of a far-stop view whose honest figure today is
about 8 x 7.3. One line on DIRECTION's board asks them to say which reading the floor means. The gate
takes the honest one until they say otherwise.

What the own-pixel reading still cannot see, stated: a canvas at FULL resolution that draws small
textures blown up with smoothing has the same blur inside its own pixels. Floor item 2 (no flat
cells) is the rule against that. A measure that proves it would read detail by frequency, not by
runs. OWED, and printed on every run.

## WHAT WAS BUILT

- **tools/bohemia_map_density.js**: the pure measure (mean exact-colour run, the same reading as
  DIRECTION's), a PNG reader that decodes in the browser (this repo has no image library for node),
  and a reading of whatever the map shows now. It finds the map canvas as the biggest visible canvas
  in the city frame instead of assuming its name, so a renamed canvas cannot silently measure nothing.
  `node tools/bohemia_map_density.js` prints the table above.
- **gates/map_density_gate.js, in the suite as MAP DENSITY** (600 s budget, about 210 s):
  - S1 the measure on known answers: full detail 1.00, a 3x stretch 3.00, a flat block its width.
  - S2 DIRECTION's filed frame reads 3.79 x 3.51.
  - S3 a blurred 3x stretch fools the glass reading (the reason for the own-pixel verdict).
  - S4 the verdict passes a full-resolution, full-detail map and fails a third-resolution one.
  - per surface: G0 the canvas is found and readable; G1 it draws at the phone's own pixels;
    G2 one painted unit at most 1.5 device px at the opening zoom; R NEVER WORSE at the opening zoom
    and the far stop (today's reading plus 5%; the ceilings may only fall).
  - V every VOTE item that declares floor:'map' and shows a picture: own-pixel run at most 1.5 and at
    least Battle Brothers' 2,073,600 pixels. No item declares it yet, and the gate says so as a NOTE
    ("judged nothing, not a pass") instead of counting a pass.
  - OWED, printed: marker size (Battle Brothers' icon and banner sizes need their screenshots, behind
    the blocked hosts), and detail by frequency.

**IT LANDS RED ON PURPOSE: 8 passed, 4 failed**, the four being G1 and G2 on both surfaces. A green
gate here would be the lie. The climb is RUN's [bb map] (the canvas at device pixels is theirs to
change) and COOK's map art (no flat cells); the NEVER WORSE leg keeps the map from getting coarser
while they climb.

**Mutation:** with the ceilings halved (BOHEMIA_DENSITY_CEILING_SCALE=0.5), NEVER WORSE goes red on
both surfaces. The first cut of S1 also caught a fault in my own test data: the generator's low byte
repeats every 256 steps, so "full detail" read 1.29. It uses the high bits now and reads 1.00.
The first cut also booted the whole game just to decode two test pictures (344 s); the self-tests use
a bare browser page now (207 s).

## THE MOVE LIST LOST ONE FILE

The calibration picture DIRECTION filed (records/target/DIRECTION_THE_MAP_TODAY_9_24.png) was one of
the 146 files [excavate] proved safe to move. This gate now reads it, so it fails that list's second
test and came off: 145 files, 32.3 MB (gates/excavate_move_list.txt says why, in its header).

## ROUTED

- RUN: MAP DENSITY is red on purpose; G1 is the canvas setup, one change in the map's drawing.
- COOK: register a map picture with floor:'map' and the vote leg holds it to the floor.
- DIRECTION: the floor's item 3 read off the glass is passed by blur; say which reading the floor
  means (the gate uses the canvas's own pixels until then).

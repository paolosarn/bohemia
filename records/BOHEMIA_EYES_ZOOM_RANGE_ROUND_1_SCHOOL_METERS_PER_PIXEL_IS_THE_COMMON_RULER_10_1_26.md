# EYES AND EARS -- [zoom range measured] -- ROUND ONE OF TWO: SCHOOL
## NO MEASURING THIS ROUND. This is desk research, armed for round two.
### 10/1/26 -- session eyes-5vql33

Row (rule 50, coordinator 9/30; records/BOHEMIA_PAOLO_POCKET_CITY_2_THE_ZOOM_RANGE_9_30_26.md):
measure Pocket City 2's own zoom range exactly off his six reference screenshots (a bench's width
at the near end, the city's width at the far end, the person's height at each stop, the HUD's size
at each) and the same on our own demo and alpha at the same phone profile; report the RATIO and
where our own ladder lies or jumps. Rule 50b: both orientations, his sixth shot is the landscape
near end. This stays in scope under rule 54a (Paolo 10/1): it is a picture compared to a picture,
nothing read from a page.

---

## THE PREMISE CHECK RULE 12 ASKS FOR

The six reference screenshots are real files, present and readable (reference/pocket_city_2/,
1170x2532 for five, 2532x1170 for the landscape sixth, matching his own phone exactly). This
lane's own [bb reads]/map-density work already established a working pattern for reading a
canvas's own pixels honestly (tools/bohemia_eyes_map_reads.js; PLUMBER's bohemia_map_density.js)
-- the premise holds, and round two reuses that proven pattern rather than inventing a sixth one.

---

## WHAT THE CRAFT USES TO COMPARE TWO DIFFERENT ZOOM SYSTEMS ON ONE RULER

Two screenshots from two different games, at two different pixel counts, cannot be compared by
eye or by raw pixel size alone -- "the bench is 40% of the screen" means nothing next to "our man
is 112 px" unless both are converted to the SAME unit first. Cartography solved exactly this
problem decades ago, and the solution is a standard every web map still uses today:

**GROUND RESOLUTION, in real metres per pixel, is the common ruler.** Every major map tile system
(Web Mercator -- Google, Bing, OpenStreetMap, HERE) defines each of its zoom levels by exactly this
number, not by a vague "how far zoomed in": at zoom 0 the whole 40,000 km of the Earth's equator
fits in 256 pixels (about 156,543 m/px); each level after that HALVES the metres a pixel covers
(doubles the resolution), a clean, named, geometric progression, not an arbitrary one. [Bing Maps:
Understanding Scale and Resolution](https://learn.microsoft.com/en-us/bingmaps/articles/understanding-scale-and-resolution),
[OpenStreetMap Wiki: Zoom levels](https://wiki.openstreetmap.org/wiki/Zoom_levels). The formula
used everywhere: metres/pixel = C / 2^zoom (C a constant for the system's zoom-0 resolution).

**This is exactly the tool this row needs, and it already matches Paolo's own number.** Convert
every one of his six screenshots to metres-per-pixel using a KNOWN REAL OBJECT already visible in
each shot (a park bench is about 1.5 m long; an adult is about 1.7 m tall), and do the same for
our own matching screenshots using OUR OWN known anchor (the person is LOCKED at a 112 px box on
every surface, rule 21/34 -- an unusually convenient, already-fixed calibration object nobody has
to estimate). Once both sides are in metres-per-pixel, "the ratio between the two ends" is just
near m/px divided by far m/px -- the same division the map-tile standard already performs, and
Paolo's own "roughly three orders of magnitude" is almost exactly 2^10 (1024x) on this same scale,
i.e. about ten cartographic zoom-levels' worth of range end to end -- a real, checkable number,
not a figure of speech.

**The standard also gives round two its second question for free: is our own ladder SMOOTH or
does it JUMP.** Because every real zoom-level system steps by a fixed, even ratio (a clean halving
or doubling each stop), an uneven jump between two adjacent stops -- one stop barely zooming, the
next jumping four levels at once -- is a measurable defect by this same ruler, not just a feeling.
The row's own words ("report... where our ladder lies or jumps") is asking for exactly the gap a
cartographer would flag: two consecutive stops whose metres-per-pixel ratio is far from the
system's own typical step.

---

## WHAT ROUND TWO IS ARMED TO BUILD, NAMED SPECIFICALLY

1. **Calibrate each of his six screenshots to metres-per-pixel**, using the bench (shot 01, ~1.5 m)
   and a person's height (shots 02/06, ~1.7 m) as the known real-world anchors, and report each
   shot's own ground resolution plus the overall ratio (shot 01 vs shot 05, portrait; shot 06 is
   the landscape near end, rule 50b).
2. **Reach the same stops on our own demo and alpha**, at his exact phone profile (1170x2532 @3x
   portrait, 2532x1170 @3x landscape), through the one driver, and calibrate the same way using
   the LOCKED 112 px person box as the anchor where a person is visible, and the HUD's own known
   on-screen size elsewhere.
3. **Report both sides on the one ruler (m/px) and the one ratio (near/far)**, so "do we match
   Pocket City 2's range" becomes a number, not an impression -- and name which of our own zoom
   stops jumps furthest from a clean geometric step, the same way a cartographer would flag an
   uneven tile pyramid.
4. **Both orientations**, per rule 50b, since the sixth reference shot and the ruling both ask
   for it explicitly.

This lane does not decide whether our ladder SHOULD match Pocket City 2's exactly, or by how
much a jump is forgivable -- that is the coordinator's and RUN's call, per the ruling's own
"continuous pinch" requirement. Round two's job is the same as every round in this lane: put a
number beside what a stranger's eye would see, on the real surface, once.

---

## ROUTED

Nothing. Nothing was measured this round; there is nothing yet to bounce back.

## SHIP TEST FOR THIS ROUND

School asked how a real craft compares two different camera systems' zoom ranges on one ruler
and found the exact tool already in daily use across every map website: ground resolution in
metres per pixel, a known real anchor to calibrate it, and a clean geometric step between levels
as the standard against which an uneven jump is a real, measurable defect. Round two calibrates
his six screenshots and ours the same way and reports the ratio. **Round one SHIPPED. Round two
measures.**

Sources: [Bing Maps -- Understanding Scale and Resolution](https://learn.microsoft.com/en-us/bingmaps/articles/understanding-scale-and-resolution),
[OpenStreetMap Wiki -- Zoom levels](https://wiki.openstreetmap.org/wiki/Zoom_levels).

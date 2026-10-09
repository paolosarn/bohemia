# UI [six icons] + [the map's bar] (10/5/26, ui-kmqmrf)

His fifth votes on THE SIX IN THE BAR: A, 'the icons could use work'. Rule 67a: ONE UI across map, settlement and
fight. Rule 73: the sun test.

BUILT in slices/bohemia_ui_materials.js (the city now includes it; my bar and pad code there reads it):
- supplyIcon(kind): the six as small OBJECTS on a 10x10 grid at 3x (30 px = the 10 pt the bar already gives them,
  so the bar still fits 320): an AA cell with its copper cap, a tin with its label, a first-aid box, three
  cartridges, a roll of tape, a water bottle; lit top-left, hard outline, the item icons' family. The six plate
  draws them (size pinned inline), the old flat marks stay as the fallback.
- dressMapBar(), automatic where #menubar or #speedpad exists: the bar a strip of the cut cardboard with its
  flutes along the foot; the hour, the place and NOTES on receipt tags in ink; the six counted on a glass pane;
  the speed pad glass panes on a taped card, square corners, the current speed lit amber (brighter amber, darker
  ink: the old amber read 3.6:1 in the sun, now 5.3; the front door's picked card took the same fix).

MEASURED: gates/the_maps_bar_gate.js 7/0 on the demo's map. FOUND: with the bar undressed (a mutation) the OLD
bar's words fail the sun test (the hour 3.9:1, the counts 2.5:1), so the dress is a readability fix, not only a
look; and the icons were sized only by the dress's CSS (30 pt if it never loaded), now pinned in the image. Five
mutations caught. Neighbours: the bar says three things 23/0, the bar fits his glass 22/0, no two texts overlap
on the demo 14/0, the start screen's look 17/0.

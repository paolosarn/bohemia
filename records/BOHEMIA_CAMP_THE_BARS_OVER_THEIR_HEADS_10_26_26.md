# CAMP: THE BARS OVER THEIR HEADS (rule 261, and 278(c) said again), 10/26/26

Session camp-session_01FfxbakbC. Row [the bars over their heads] SEE-HOW-EVERYONE-HEALS, first after [struck down, he still fights]
(rule 261(d), his 'immediately'; the coordinator 07:09: 'he has asked three times').

PAOLO 10/26: 'I need the HP and the armour displaying on top of my characters, right now, any time... if they're at full health it
never has to display... above 87 percent it doesn't display anymore... I need that immediately, I need to see how everyone's
healing'; and again (278(c)): 'in any settlement it should show above each person, walking or chilling, a health bar and an armour
bar'.

## 1. WHAT HE SEES
Over YOU and every man of his company, outside the fight: two small bars, Battle Brothers' fight bars small. Red on top his hit
points, grey under it his armour (helmet and body together), the dark part what is missing, a hard one-pixel dark edge (the border
law). When a man is at 87 percent or more of BOTH, nothing is drawn: a whole company shows nothing at all. As he heals the red and
the grey fill, and at 87 they go. Drawn after everybody in the picture, so no man of his covers another's bars.
- THE MAP: over YOU and the two of his men who walk with him, at every zoom the party is drawn at his size (rule 261(a) said the
  close end; the far end draws the party too, so the bars come with it).
- A TOWN (any settlement through the map's door): over RUN THREE's crew who stand in the town's picture and the ones who walk
  between the stalls, and over YOU the lead.
- THE CAMP: over the camp's men round the fire and YOU.
- THE FIGHT (261(c)): untouched; the fight draws its own.

## 2. WHERE THE NUMBERS COME FROM
engine/bohemia_condition.js (CAMP's): bars(o) reads the company's own condition (bohemia.condition.v1, what a fight leaves and the
camp heals): hit points over his maximum, armour over helmet plus body maximum. A man is found by his name, else by his look (the map
and the camp know some men only by their look), YOU by his key; a dead man has none. The line is records/target/bb/condition.json
bars_hide_at 0.87, his number, one row for TUNING's table. drawHeadBars(g, x, bottom, bars, {w, h}) draws them and says what it
drew (window.__MAP_BARS on the map, window.__HEADBARS in the town and the camp; the gate reads those).

## 3. THE HOOKS, MARKED __THE_BARS_OVER_THEIR_HEADS__
- slices/BOHEMIA_CITY_WORLD.html (RUN's): queued as each of his men is drawn (both party paths) and after YOU, drawn once after the
  whole party. The map paints only when something moves, so a heal is something moving: a condition change (in the map's window,
  or from the town's or the camp's frame through the browser's storage event) asks for a paint. YOU's bars sit just over the top of
  his ink (the rig's box leaves air over his head: the first look on the phone had his bars a head higher than his men's; the ink's
  first row is read small, once a second at most).
- slices/BOHEMIA_SETTLEMENT_SCREEN.html (RUN TWO's and RUN THREE's): headBarsDraw at the end of drawPeople, every frame.

## 4. THE GATE (rule 261(e)), gates/the_bars_over_their_heads_gate.js, on the cut he plays
Phone and computer, 10/0:
B1 THE MAP: YOU at 40 percent hit points, his man with armour at 60, his man at 95 of both: bars over the first two only, each fill
his number over his maximum within a pixel (phone: YOU 6 of 16, the man 16/10 of 16). B2 AT 87 THEY GO: the third man at 86 carries
bars, at 87 nothing. B3 IN A TOWN (through the map's door): the same over his men in the town's picture, none over YOU at 95.
B4 AT CAMP: the camp heals an hour every half second at TUNING's x5 rates (rule 264(f)), so each man is read in the very frame the
picture was drawn and the fill is judged against what he is that moment (the first try judged against the numbers seeded a second
before, and the camp had already healed them past the line). B5 nothing threw. Registered in the suite as THE BARS OVER THEIR HEADS.
Screens looked at on the phone: the map (two bars over YOU and the hurt man, none over the whole one), the camp (two bars over the
two hurt men round the fire, none over YOU); the VOTE picture is those two side by side.

## 5. NOT DONE, SAID
- A man drawn far from the camera at the map's widest zoom gets bars sixteen pixels wide like the close end; if they read too big
  out there, the width is one number in the map's block.
- 278(a) (healing stops itself at 99 percent and pauses) is the next row after [camp holds until he ends it].

[bb Battle Brothers: in its fights every man carries a red hit point bar and a grey armour bar over his head, hidden on the world
map; we carry the same two bars onto the map, the town and the camp, and hide them at 87 percent so a whole company is clean.]
[analog horror: the bars are flat hard pixels with a black edge, no glow and no soft shadow, a dried-blood red and a dull steel
grey; a bar that empties as you watch is a gauge on old equipment, not a game's health number.]

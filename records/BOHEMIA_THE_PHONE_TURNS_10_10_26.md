# UI [landscape]: THE SAME HUD WHEN THE PHONE TURNS (10/10/26, ui-kmqmrf)

The row (rule 50b, Paolo 9/30, his sixth Pocket City 2 shot, reference/pocket_city_2/06): portrait is the default; in
landscape the HUD re-lays to the corners the Pocket City 2 way, the same buttons, the same stops of the pinch, the phone
city-view-only rule unchanged; measured on both profiles through the one driver; a screen that breaks when it turns is red.

MEASURED BEFORE (the demo's map at 844x390, the driver's phone_landscape): the phone kept its portrait place (right,
69 down, 156x338), so it ran 17 points off the foot of the glass and the speed pad (582..834, 320..378) sat on top of
it, hiding the family's face card. Everything else held.

BUILT in slices/bohemia_ui_materials.js (one media rule, a phone on its side: landscape and under 500 tall; portrait
untouched; no lane's file edited). Pocket City's corners, translated: the bar across the top (it already was); the
speed pad keeps the bottom right (the big action's corner); the PHONE, which carries the family's faces, goes to the
LEFT, where Pocket City keeps its face, from the bar's foot (its box starts there, so top 4) to 11 points above the glass's
foot: 150 wide at 19.5 by 9 = 325 tall. The face row's gaps tighten (2 pt) so three faces stay 44 points on 142 of glass.

MEASURED AFTER: gates/the_phone_turns_gate.js 14/0, both profiles through the one driver: every HUD piece whole on the
glass (the gear, the bar and its readouts, NOTES, the speed pad, the phone); no two pieces cover each other; every pressed
thing 44 points (gear, NOTES, the five speeds, the phone, the faces); the same buttons both ways (3 readouts, II 1x 2x 3x
5x, NOTES, the gear, the phone, 3 faces); the phone 19.5 by 9 both ways (156x338, 150x325); with all three of the family
unlocked, every face 44 (45 on its side) inside the glass; on its side the bar on top, the phone left, the speed pad
bottom right; no page error.
FOUR MUTATIONS, each restored: no landscape rule -> 3 red; the phone stays right -> 2; the phone not narrowed (338 tall
on 390) -> 1; the face row not tightened (the third face pushed off the glass) -> 1.

NOT DONE / NOT MINE: on its side the map itself is a 640-wide column with dark bands either side (the city's frame,
RUN's [screen fit], rule 62); Pocket City runs its map edge to edge. The pinch's stops are the map's, unchanged by this.
Tablet and computer classes are not part of this row.
VOTE: ui-the-phone-turns-10-10, sheet slices/vote/UI_THE_PHONE_TURNS_10_10.png (before, after, 844x390).

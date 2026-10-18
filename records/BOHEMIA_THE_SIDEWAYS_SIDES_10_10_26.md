# UI [the sideways sides]: NO BROWN-GREY BANDS WHEN THE PHONE LIES ON ITS SIDE (10/10/26, ui-kmqmrf)

PAOLO 10/10, his NO on ui-the-phone-turns-10-10: 'Looks like shit, what's up with the brown-grey sides, man.' The row: the
sides are the world (the map stretches to the glass), measured on the flipped phone: zero pixels of flat band at either
edge. [bb the Battle Brothers screen has no bands at any width: the map fills the glass, the panels sit on the map.]

MEASURED BEFORE (the demo's map, 844x390 through the one driver): the city's column (.wrap) is capped at 640 with 6 points
of padding, so the map was 628 wide at 108..736 and the outer strips were the page's flat brown-grey rgb(28,26,21):
luminance spread 0.9 left and 2.0 right, 99% and 89% page colour. Upright the same column left a 6-point strip each side
(spread 0.6 and 1.4). The bar was 628 wide too.

BUILT in slices/bohemia_ui_materials.js (dressPhone's sheet; the city file not edited): at EVERY width the city's column has
no cap and no padding and the bar no pull-out margin, so the map's canvas is the glass and the bar the whole top; on its
side the phone moves to x 58, right of the shell's gear (8..52). The city sizes its map from its column at boot, before the
sheet lands, so the dresser asks the page to measure again (a resize, now and at 1.5 s); without it the map drew its old
628 and left a black band (mutation 4).

AFTER: gates/the_sideways_sides_gate.js 10/0, on its side and upright: the outer 6 points vary like the map (spread 34.5 /
33.9 on its side, 44.4 / 41.5 upright) and 1 to 2% of it is the page colour; the canvas 0..844 and 0..390; the bar the whole
width; the phone clear of the gear and nothing of the HUD on anything else. FIVE MUTATIONS, each restored: no edge rule ->
6 red; the padding kept -> 6; the phone under the gear -> 1; no resize nudge -> 4; the bar still pulled out -> 2.
NEIGHBOURS: when the phone turns 14/0, the bar fits his glass 22/0, the map's bar 7/0, the phone's look 15/0, no two texts
overlap 14/0, the feed is a phone 22/0, the phone's board 15/0; HUD overlap 9/6 as before (none of its six reds are this).

THE PICTURE (rule 89): slices/vote/UI_THE_SIDEWAYS_SIDES_10_10.png, the same screen before and after, at his phone's pixels
(2532x1170 each, one art pixel to one phone pixel). Per rules 88 and 89, EYES checks it and DIRECTION judges before VOTE; UI
does not register it.
NOT DONE, NOT UI'S FILE: the SETTLEMENT on its side has the same band inside RUN TWO's canvas (the picture 580 of 844, the
rest the darkened backdrop); cause and the one-line fix in records/BOHEMIA_UI_REVIEW_FOR_RUN_TWO_THE_SETTLEMENT_BAND_SIDEWAYS_10_10_26.md.
The fight and the company screen already fill the glass on their side.

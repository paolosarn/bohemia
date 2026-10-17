# EYES [the map's four numbers]: OURS BESIDE BATTLE BROTHERS', MET OR SHORT (10/17/26, rule 109(c), rule 110's big swing)

> **PAOLO 10/16:** *"our map has to be as big as fucking Battle Brothers and that's still not the case ... I'm choosing Battle Brothers."*
> Rule 109(c): the four numbers are MEASURED (tiles across, days to cross at walking speed, settlements and locations, the zoom's
> near and far stops), ours meets or beats each as the bare minimum.

## THE INSTRUMENT (this lane's own, never RUN's self-report)
`tools/bohemia_eyes_the_maps_four_numbers_10_17_26.js` opens the committed demo on his phone's profile (390 x 844 at 3x, the
driver's default), gets to the map with REAL SQUEEZES (the driver's pinch gesture, never by setting the zoom), squeezes until the
zoom stops moving, photographs the canvas, spreads until the zoom stops moving, photographs again, and costs the real routes to the
four farthest places the way a step is costed (cityRoute + cityStepMins). `tools/bohemia_eyes_the_far_stop_steps_10_17_26.js`
then steps the camera from the valley's old stop to the region's stop with the pan at zero, sky on and sky off, and photographs
each step. Everything is in `records/eyes_map_four_numbers/` (numbers.json, steps.json, steps_skyoff.json, the pictures).

## THE FINDING FIRST: THE FAR STOP BY FINGER IS THE MOON
The driver's own toMap landed at zoom 0.167. ONE more squeeze took the camera to the region's far bound (0.1076, the bound is
0.1072) AND THROUGH IT: the valley page's seam guard (`BOHEMIA_CITY_WORLD.html` line 44040, `if(z<zmin&&CZOOM<=zmin+1e-3){
SEAM_GUARD=true; skyEnter(); }`) fires on the same gesture that reaches the bound, so the canvas he gets at "all the way out" is
the MOON band of the 8/15 moon zoom: black sky, the moon, a sliver of planet (`far_stop.png`; 88.8% of the canvas near-black on
every step while SKY was true). With the sky switched off and the zoom set to the same 0.1072, the region draws as RUN says: 202
blocks across the glass, the valley a small square in the middle, Mesquite, Jean, Primm, Henderson, Mead Marina around it
(`step_0.1072_skyoff.png`, 0.7% near-black). So the region's far stop EXISTS and is right, and a finger does not stop on it:
Battle Brothers' camera never leaves its map; ours leaves it for the moon one squeeze later. Under rule 109(a) the map's zoom range
is Battle Brothers'. Whether the moon stays a door off the map is DIRECTION's and RUN's call; this lane's job was to show it.

## THE FOUR NUMBERS

| | OURS (measured on the phone profile) | BATTLE BROTHERS (source) | VERDICT |
|---|---|---|---|
| tiles across (in all) | **496 (246,016)** blocks; the valley alone 96 (9,216) | about **140 x 140 (19,600)** hex tiles. Modders' world generation `SizeX/SizeY`: "changing them to 140x140 brings them back to vanilla size" (Nexus, World Parameters mod 732); the Map Data Tool (Nexus 126) "counts exactly how many of the 19400 map tiles are of each terrain type"; the engine renders badly past 140 (Big World mod 27). | **MET** |
| days to cross at walking speed | **1.9 days rim to rim on a road, 3.7 on open ground** (RUN's own function, read live); the four farthest towns by the real route: Mesquite 1.95 days, Searchlight 1.16, Pahrump 0.93, Primm 0.83; one open block costs 10.75 minutes | **2 to 4 days**, players' reports, no official figure: "most of my games I can cross the map in less than 3 in game days, sometimes less than 2" and "three or four days to cross the continent" (Steam forum threads, recall via search snippets; the pages themselves are egress-blocked); a day is 1 min 45 s real time (fandom wiki, Game Mechanics) | **MET on open ground, SHORT on a road** (1.9 is under the low end) |
| settlements | **26** (14 in the valley, 12 towns on the region) | about **17**: 2 city halls, 3 town halls, 6 village halls, 2 strongholds, 2 castles, 2 fortified manors (fandom wiki, Global Map); a 2020 bug report calls 19 "smaller than the usual 22" | **MET** |
| locations (camps, ruins, legendary places) | **0** on the region: the twelve towns are the only destinations; nothing hostile or legendary to walk to out there | no published count; dozens per map, every one of which "buys" and sends parties (the library's 01_WORLDMAP); seven-plus legendary locations by name (Goblin City, Kraken, Sunken Library, Ijirok, Black Monolith, Witch Hut, Rachegeist) | **SHORT** |
| zoom, near stop | **4.6 blocks across the glass**, one block 85 pt, the man at his own pixels (by spreading: 6 spreads to the bound 4.74) | not published; the data does not say. Grok ask 26 (reference/BOHEMIA_GROK_ASKS.md) carries the question and has no answer yet | **NO NUMBER TO MEET** |
| zoom, far stop | **202 blocks across the glass** at zoom 0.1072 (1.44 times BB's whole width; the old valley stop 97), the camera pans over all 496; THEN ONE MORE SQUEEZE LEAVES THE MAP FOR THE MOON | part of the map on screen and you pan (the library; the Steam suggestion that "many locations are near the border of the map, which makes it hard to zoom in on them after zooming out fully"); the exact tiles-on-screen count is not published | **MET on width; the moon is past it** |

Rule 109(c)'s "meets or beats each": three MET, one half, one SHORT, one with no number anywhere to meet.

## READ THE TILE COUNT PLAINLY
By the count our region is 3.5 times Battle Brothers' width. But a block is crossed in 10.75 minutes and a Battle Brothers tile in
about 20 to 40 (140 tiles in 2 to 4 days at 1,440 minutes a day), so IN WALKING TIME our 496 blocks are worth about 125 to 250 of
their tiles: about their map, not three and a half of it. The number a player feels is days, and days are the half-met row.

## WHAT GROK ASK 26 STILL OWES
The near and far zoom stops in tiles on a 1080p screen, the party marker's size in pixels, a stopwatch crossing at 2x, the count
of hostile locations per map. Every Battle Brothers page that would carry them (fandom, nexusmods, steamcommunity,
battlebrothersgame.com, namu.wiki, wikipedia's image host) is egress-blocked from this container (CONNECT 403 on each, probed
10/17); the numbers above came through search snippets and are labelled recall where they are recall.

## THE PICTURE
`slices/vote/EYES_THE_MAPS_FOUR_NUMBERS.png`: the four screens at phone size (the valley stop, the region's stop, the moon one
squeeze later, the near stop), the to-scale drawing (his glass, the valley, the region and Battle Brothers' 140 x 140 at the same
pixels per tile), the table, the one thing to fix. Registered as `eyes-the-maps-four-numbers-10-17`.

## ROUTED
- RUN [the map at Battle Brothers' size] and DIRECTION: the seam into the moon fires on the squeeze that reaches the far bound
  (`BOHEMIA_CITY_WORLD.html` 44040); under rule 109(a) the finger should stop on the region. Not fixed here (this lane's SOUND line).
- WORLD [the region] / FACTIONS: the locations row is the one SHORT: nothing but towns exists to walk to on the region.
- The coordinator: Grok ask 26 is the only road to the two zoom numbers and the location count.

## PROOF
`node tools/bohemia_eyes_the_maps_four_numbers_10_17_26.js`, `node tools/bohemia_eyes_the_far_stop_steps_10_17_26.js`
(sky on, then sky off), `python3 tools/bohemia_eyes_the_two_strips_10_17_26.py`. THE REGION IS BATTLE BROTHERS' SIZE (RUN's gate)
not re-run here; its R2 reads the far stop by setting the zoom, which is exactly why it cannot see the moon.

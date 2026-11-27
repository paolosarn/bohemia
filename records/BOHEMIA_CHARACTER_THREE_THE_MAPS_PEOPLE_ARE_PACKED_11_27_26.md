# THE MAP'S PEOPLE ARE PACKED (CHARACTER 3, 11/27/26; BUILD 11/27zh)

Ask row 769 (FOUND BY PLUMBER 8), VAMILY rule 484(a) amended (Paolo 11/27: 'combat keeps crashing, like when I get into combat and
then when I finish it, it's insane'; his A: the page goes white or reloads, Safari on an iPhone killing the tab for memory), rules
480(c) and 482(c). The routine's order: PLUMBER 8 takes 769's release under the fight; CHARACTER makes the sheets themselves smaller
without any look changing.

## WHAT WAS MEASURED FIRST

The demo upright, the map after the town, nothing collected, every live ImageBitmap by the line that made it:

| | bitmaps | in |
|---|---:|---|
| the map's people sheets (BOHEMIA_CITY_WORLD.html rigSheetLoad) | 166 MB | 11 |
| the map's idle sheets (engine/bohemia_idles.js) | 93 MB | 14 |

Each people sheet is one cell a person a facing a key (68 to 98 x 113 to 143 pixels) and a man fills 23 percent of his cell; the
town's people on town_2, town_3 and town_4 stand (no walk), so those sheets are 5 to 7 percent full. A man's box (the rectangle his
pixels fill) is 51 percent of his cell. The idle sheets are already packed atlases (55 to 66 percent full): not the waste.

## THE CUT: __THE_MAPS_PEOPLE_ARE_PACKED__

- tools/bohemia_character_three_the_map_sheets_packed.py (the fight's own packer's way, tools/bohemia_run_the_sheets_packed.py):
  every cell of the 18 rig_mix sheets, BOHEMIA_RIG_CAST and BOHEMIA_RIG_PEOPLE cut to its box and laid edge to edge, two empty
  pixels between, in one atlas (slices/rig_mix_packed/), a table of where each went. 20 sheets, 9,856 cells: 314 MB decoded as
  whole sheets, 147 MB as atlases. BOHEMIA_RIG_YOU stays whole (3 MB; THE MAIN GUY LEADS THE WALK reads its every frame).
- THE SAME FILE KIND: an atlas is a palette PNG on the sheet's own palette, the same indices. Measured: a lossless WebP atlas came
  back from the browser one level off on 5 to 11 percent of the half-clear edge pixels (the two decoders round them differently);
  the palette PNG is exact. 10.1 MB on the wire against the sheets' 10.0.
- slices/BOHEMIA_CITY_WORLD.html: the map asks for a sheet's atlas, and uses it only when the sheet's bytes on the server equal the
  table's (a HEAD request, nothing downloaded): a sheet another lane re-renders is drawn whole until it is packed again, never old
  art. A frame is the cell's rectangle on the atlas with its offset moved by the trim (RigFrame already was a rectangle and an
  offset), and it keeps where its whole cell sat (rigFrameCell: cx, cy, cw, ch), so the two readers of a cell's place read the same:
  the depth's box (rigBlit's MAP_DEPTH_CORE, which decides when his outline shows behind a building) and the march's acts
  (mapMarchFrame lays the act's cell at the walk cell's origin). BohemiaWear's head finder reads the trimmed cell and adds its
  offset: the same head. The atlas answers to its own address, so the mask worker fetches the atlas itself.
- rigSheetCellCanvas(S, row, col): a sheet's cell at its whole size, packed or whole, for a reader that reads cells by row and column
  (THE MAIN GUY LEADS THE WALK's read of the old body is re-aimed to it).
- The demo's cut runs the packer beside the fight's (tools/bohemia_cut_the_demo.js).
- window.__MAP_SHEETS_WHOLE = true is the way before; MAP_PACKED counts what came which way.

## AFTER

| | before | now |
|---|---:|---:|
| the map's people, the same 16 sheets held (the gate's boot) | 253 MB | 114 MB |
| bitmaps held back on the map after a fight (IN AND OUT THE IPHONE'S WAY, CPU 4x) | 395 MB | 256 MB |
| everything alive back on the map after a fight | 617 MB | 455 MB |
| the most alive at any step of the fight walk | 725 MB | 711 MB |
| the renderer back on the map | 1,845 MB | 1,688 MB |
| pixels changed on the glass (783 draws of the map's own mapPersonDraw, three zooms, standing and walking, his men in armour) | | 0 |

The fight walk's peak barely moves with this build alone: at the most of a fight the bitmaps are the fight's own (ask row 768,
COMBAT FIVE), and the map's people are only part of what it holds. What this build moves is the whole session on the map.

WITH PLUMBER 8's RELEASE UNDER THE FIGHT (__THE_MAP_LETS_ITS_SHEETS_GO_UNDER_THE_FIGHT__, landed on main in the same hour; this build
rebased on it, one line added so a packed frame takes only an atlas again when its sheet comes back): the same walk reads the most
alive at any step 522 MB (canvases 218, bitmaps 234, pictures 70) against THE IPHONE BUDGET's 768, back on the map 456 MB, the renderer
1,531 MB (IN AND OUT THE IPHONE'S WAY 7/0). The sheets that come back after the fight come back packed.

## PROOF

- THE MAP'S PEOPLE ARE PACKED (gates/the_maps_people_are_packed_gate.js) 9/0 (K7 below): K1 every atlas fresh and every cell its sheet's cell
  (the tool's --prove, 9,856 cells, 0 differ); K2 16 sheets packed, 0 whole, 114 MB where the whole sheets are 253; K3 2,544 frames
  of 72 men as canvases, 0 differ; K4 783 draws of the map's own mapPersonDraw from the atlas and from the whole sheet at three zooms
  (54 in his men's armour), 0 differ; K5 the depth's box and the march's place the same for 2,544 frames; K6 no page error; P1 the
  way before every sheet whole; P2 a stale table (town's bytes off by one) draws that sheet whole, the rest packed.
- IN AND OUT THE IPHONE'S WAY 6/0 (the numbers above), DEMO BUILD 25/0, FIRST PLAY IS LIGHT 7/0, THE MAP NEVER WAITS ON THE GLASS 7/0.
- THE SAME REDS WITH THIS BUILD SWITCHED OFF (the packed index moved away, the same tree): YOUR MAIN GUY LEADS THE WALK 6/8 (Y2, Y3,
  Y5, Y6 both profiles; quarantined STALE, RUN), NO TWO PEOPLE ALIKE 18/5 (quarantined STALE, RUN TWO), EVERYBODY IDLES 37/4 (P1, C3,
  R5, W4): none of them this build's.
- PAGES PUBLISH 30/0 at 897 MB of 900 (main read 899.8): the atlases added 10 MB to the site, so the site now leaves out what no page
  loads (tools/bohemia_publish_list.js, rule 6's list, each with its tell): (a) a map people sheet whose atlas is fresh (the index's
  bytes equal the sheet's): the map asks its size, a 404 says the deploy found the atlas fresh (K7), and a sheet re-rendered since its
  pack ships whole as before; (b) the walk renders a look was baked from (rig_Anim_*, 5.5 MB in the gangs' and the barber's folders,
  read by no page: the walks are drawn from the baked sheets). Rule 7 (a data file's mention does not publish a dead kind) now holds for
  a bare name too. NAMED FOR PLUMBER 8 / RUN: the fight's whole sheets could leave the site the same way beside their fresh atlases.
- K7 ON THE SITE (the whole sheets answering 404): 16 packed, 0 whole, 48 people drawn. THE MAP'S PEOPLE ARE PACKED 9/0.

## WHAT IS LEFT (named, in order)

1. DECODED ONLY WHEN SHOWN ON THE MAP ITSELF: under the fight it is PLUMBER 8's release (built). On the map, the warm under the town
   decodes every gang whose party is within 24 blocks of him, and in one boot four of seven gangs' sheets were never drawn in 30 s
   (4 x 8.6 MB packed, and their idle sheets 4 x 8.8 MB). A sheet could sleep (its bitmap closed, as the release does) once no party
   of its gang has been within reach of the glass for a minute, and wake when one comes near. Not built this round: a wake that lands
   late shows a stand-in man for a few frames, and 'never the wrong man for a second' stands; the reach test has to be the glass's own
   box first.
2. The idle sheets (ANIMATION's, already packed) are now the larger share of the map's people memory (93 to 123 MB).

[bb Battle Brothers' world map carries every party in sight at once; ours has to carry the same crowd inside a phone's memory.]
[analog horror: nothing changes on the glass, and that is the frightening part: the same men, standing exactly where they stood.]

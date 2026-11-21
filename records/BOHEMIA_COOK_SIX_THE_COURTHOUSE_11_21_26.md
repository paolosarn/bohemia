# COOK SIX: THE COURTHOUSE, FINISHED, AND ITS COFFERED CEILING (11/21/26)

COMBAT FOUR's BUILD 11/21y asked 'FOR COOK (SIX)'; COOK SIX carries COOK FIVE's lane (VAMILY rule 461, 461(c) as amended 11/21; rules
453, 441, 416, 451(a), 455). BUILD 11/21zd - THE COURTHOUSE.

## WHAT THIS IS
COMBAT FOUR's courthouse (THE COURTHOUSE: a fight at the Mob Museum, the 1933 federal courthouse downtown, in its old courtroom or on
the museum floor). Every one of its 14 pieces was a stand-in (the casino's seats, bar, stage, cage and screens, the street board's
barrier, corral and drums, the garage's booth and walls, the casino's walls) and its ceiling was drawn by the page. They are in the
folder now under its names, and the courthouse lays them with no code changed:
- THE FLOOR (courthouse_floor_0.webp): THE 1933 TERRAZZO on all 25 tiles (the dam's terrazzo ground, the same decade's floor, a step
  darker under the dust): its brass strips every 1.5 m both ways, so a tile's edge is always a strip (any tile meets any tile); the
  polish worn dull where people walked; on some tiles a fan of broken glass where a case went over, a scorched patch where somebody
  burned papers, a long scrape where something heavy was dragged; heel scuffs. ONE FLOOR FOR BOTH ROOMS, because COMBAT FOUR's file
  has one kind: no carpet runs (they would scatter over the museum floor). Asked in the handoff: a 'carpet' kind for the aisle.
- THE PIECES (courthouse_art.json's kit, COMBAT FOUR's 14 names): PEWS (ct_pews: a tile of the gallery, seven rows of dark oak facing
  the bench, so the map's eye sees their backs, two pews a row with their carved ends; one gone with its bolt marks, one knocked over,
  a blanket on a seat, a coat over a back, papers under them). THE BAR'S RAIL (ct_bar: the oak rail a tile long on its turned
  balusters, newels every three metres, some balusters kicked out, one length broken and hanging). THE JUDGE'S BENCH (ct_bench: a tile
  of it: the raised dais and its dark carpet, the paneled oak front the tile's width so two tiles are one bench, the bench top, the
  high-backed chair pushed back as if he just stood up, the gavel's block, a dead lamp with its green shade). THE JURY BOX (ct_jury: two
  rows of six chairs, the back row raised, behind a paneled rail; one turned, one gone). THE WITNESS STAND (ct_witness: raised a step,
  boxed in oak, its chair, the microphone on its gooseneck, a book on the ledge). A COUNSEL TABLE (ct_counsel: on its side, its legs
  out, two chairs, the papers spilled, the water pitcher). PILED CHAIRS (ct_chairs: oak armchairs with leather seats thrown on two
  standing). AN EXHIBIT CASE (ct_case: the cabinet, the glass gone but one pane, the mounts empty, the labels, the glass on the floor).
  AN EXHIBIT STAND (ct_stand: a post and its reading panel, an audio guide dropped on its cord beside it, its light still on). A DEAD
  KIOSK (ct_kiosk: the screen cracked, the cable pulled). THE COURTHOUSE'S STONE (ct_wall_ew, _ns: cut limestone in courses on a dark
  marble base, a dead brass sconce, a rain stain). AN EXHIBIT WALL (ct_exhibit_ew, _ns: COMBAT FOUR's 'W' air wall: a free-standing
  wall a tile long, four graphic panels faded, the photographs gone sepia and grey, one panel peeling).
- THE CEILING (courthouse_ceiling.webp, rule 451(a), over the fight at his 10%): five bays by five that repeat: the courtroom's
  coffered plaster (a square grid of deep coffers, an inner molding and a rosette in each), its pendant lamps dead, a patch fallen to
  the lath in some bays with a chunk hanging, the stains where the roof leaked, cracks. courthouse.json's ceiling entry: "have": true,
  "tile": [10, 10] (the one agreed edit in COMBAT FOUR's file).

## PROOF (rule 441: on the real surface, a phone both ways)
tools/bohemia_a_big_inside_on_the_page_11_17_26.js (now taking 'courthouse', through district 'mobmuseum'):
- BEFORE (this tree before the cut), the_courtroom upright: THE COURTHOUSE, 150 pieces, 150 of them stand-ins, the ceiling drawn by
  the page, a tile 43.9 points, 0 page errors; the_museum_floor 134 pieces, 134 stand-ins.
- NOW, the_courtroom: 150 pieces, 0 stand-ins, the ceiling's picture drawn, 0 page errors, upright (a tile 43.9 points) and on its side
  (31.8). the_museum_floor: 134 pieces, 0 stand-ins, both ways, 0 page errors. Every picture the page asked for was there.
FOUND BY EYE AND BY THE GATE on the way: the judge's dais first came out a pale pink slab the size of the tile (its carpet dusted
light: dark now, its seams drawn); the ceiling's fallen coffers and cracks reached its bays' edges, and its beams, drawn bay by bay,
were missing on the last bay's east and south edges, so the bays did not meet (THE GATE's C2, 14.6 then 11.9 against 8): the damage
kept inside each bay and the beams drawn across the whole ceiling (0.9).
Gate THE INSIDES WEAR FINISHED ART 112/0 with all sixteen kits (the courthouse's pews, bar, bench and walls held to a tile's width;
its ceiling C2 0.9 over itself against 8.0, C3 119 steps of tone, 16% lines). COMBAT FOUR's gates: THE BIG INSIDES 208/0 (its I9: the
courthouse's ceiling the picture, in), AN INSIDE SHOWS ITS CEILING 6/0.

PAGES PUBLISH was red on main before this ship (908 MB of its 900 MB cap: STAFF's town people's walk frames, about 12 MB, BUILD
11/21zb); this ship adds 0.55 MB (909) and went out with main's own red, said in the handoff for PLUMBER and the coordinator.

## REFERENCE CHECK (compared to the world before calling it done)
A 1930s American federal courtroom (dark oak throughout: the gallery's pews with carved ends behind a turned-baluster bar, counsel
tables in the well, the judge's raised bench with its paneled front, the witness box beside it, the jury box of two tiered rows; a
coffered plaster ceiling with pendant lamps); the period's terrazzo with brass divider strips; a museum floor of vitrines on cabinets,
interpretive stands, touchscreen kiosks and free-standing graphic walls. The twins: this lane's school kit (the same rig and cut) and
the powerhouse's terrazzo ground.

[analog horror: a museum's audio guide dropped on its cord by a stand, its light still on (COMBAT FOUR's line: the 1950 hearing played
to an empty room); the judge's chair pushed back as if he just stood up; the photographs on the walls gone grey]
[bb Battle Brothers' brush and palisade: the pews slow you, the bar is waist-high cover with gaps]

## THE TOOLS
tools/bohemia_cook6_the_courthouse_finished_11_21_26.py   plan; render ct_floor | ct_pieces | ceil_courthouse; cut; sheet
  (ON the school tool and the chain under it: fourteen deep)

## NOT DONE, SAID PLAINLY
1. One floor for the courtroom and the museum floor (COMBAT FOUR's file has one kind): no carpet in the aisle; asked for a kind.
2. The bullet-marked brick wall COMBAT FOUR named ('one the bullet-marked brick wall'): one exhibit picture serves every 'W', so it
   would stand on all eleven; a name of its own (a 'ct_brick' letter on one W) and this lane cuts it alone.
3. Two B rows draw two bench fronts (one picture): the south row reads as the clerk's desk before the bench.
4. No night versions.

VOTE: cook6-the-courthouse-11-21 (MADE FROM arena2-the-pit-is-a-pit-11-7).

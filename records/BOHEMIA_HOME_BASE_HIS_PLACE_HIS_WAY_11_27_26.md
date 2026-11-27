# HOME BASE 5 -- BUILD 11/27za HIS PLACE, HIS WAY (11/27/26)

VAMILY rule 347(c) (PAOLO 11/3, LOCKED): "literally every thing in our custom settlement can be customized... super easy to
customize... that pseudo mayor vibe... a Stardew Valley vibe". Rules 343(d), 480(c), 441, 481(b). Ask row 356. Research first:
records/BOHEMIA_HOME_BASE_HIS_PLACE_HIS_WAY_THE_RESEARCH_11_27_26.md (Stardew: tap the building, then the paint or the spot, free and
undoable; Battle Brothers: tap the name). VOTE card home-base-his-place-his-way-11-27. Gate HIS PLACE, HIS WAY (new).

## MEASURED BEFORE (main 08d726092, the demo, his place planted with four buildings of his, five builds, two people living there)
- One thing could be changed: NAME IT on the BUILD desk. Where each thing stood was the first free lot of its row by build order
  (homeFeedSlots); who worked what was the order people moved in (the map's homeWorkers); no paint, no sign.
- On his cameras everyone who lives there stood along the front row, whatever build they worked.
- The roof, the shed and the vendor stall are shops' doors at his place (HEAL, MEND, TRADE): a tap opened the shop, nothing else.

## NOW, all by tapping his place on its cameras (slices/BOHEMIA_SETTLEMENT_SCREEN.html __HIS_PLACE_HIS_WAY__)
1. MOVE: a thing's station sheet has MOVE, PAINT, SIGN. MOVE: the camera pulls back, the lots it can stand on are bracketed and
   breathe on the beat (Stardew's green tiles, in the camera's white); a tap on one moves it there; a thing standing there swaps if it
   can stand where this one stood; everything else stays exactly where it stood (all are pinned at the first move). BACK or a tap on
   the thing itself puts it down. Free, instant. Measured: the tank had 5 lots it could go to (6, 7, 8, 11, 12).
2. PAINT: five paints (records/target/bb/home_base.json look.paints): BARE, LIME, PRIMER, DRAB, TAR. The swatch is the colour by day;
   his night cameras read a paint as its infrared value (whitewash and red-oxide primer glow, carbon-black tar goes black), each picture
   re-graded once per paint and kept. Measured on the tank's own pixels: 21 to 23 bare, 50 to 55 LIME; the roof 34 bare, 14 TAR.
3. SIGN: his words (12 letters, A-Z 0-9 . , ! ? ' & # -) on a plate at the lot's foot, painted in a 3 by 5 letter at the footage's own
   pixel (M, N, W wider so WATER never reads HATER), white on a dark board, its posts and its shadow.
4. ITS NAME: a tap on the name in the camera's own text (or on the plate at his gate) opens it: type it, or ANOTHER (the next of
   twelve, draft) and OK. The name stands on a plate on the walk in front of the gate, out of the way of anyone on his lots.
5. WHO WORKS WHAT: a tap on someone who lives there: WORKS AT, every standing build that takes a hand (who works it now, or what it
   gives), and REST. The map keeps it (look.jobs) and decides the rest as before; whoever works a build now stands at it on the
   footage, facing it, at work.
6. THE SHOPS' DOORS: the clinic, the bench and the stall sheets at his place carry MOVE, PAINT, SIGN too; each goes to the thing's own
   station.
7. Every sheet is a station laid for the way the phone is held (481(b)): sideways a column beside the footage, upright under it; the
   name's sheet frames the gate's plate, a person's frames the person. Upright, a sheet that grows after it was laid lays the camera
   again (a ResizeObserver; measured: the tank's sheet grew 206 to 250 px after it was laid and lay 44 px over the footage).
8. KEPT: the engine (engine/bohemia_home.js lookOf, setLook, signText) keeps it on his home record; the map
   (slices/BOHEMIA_CITY_WORLD.html homeSetLook, BOHEMIA_HOME_SET) saves it; a page shut and opened again (CONTINUE) brings it all back.

## NOT BUILT, SAID PLAINLY
- WHAT IT IS MADE OF (tin, block, wood): a material is shape and texture; a value cannot fake it at 180 x 320. It needs the 11/3
  pipeline to render each piece in each material, and roof, walls and trim as regions so the paint can go on each like Stardew's
  (tools/bohemia_home_settlement_pipeline_11_3_26.py; Blender is not on this box, `pip install bpy` is the way). The next job.
- Renaming a person who lives there (Battle Brothers renames a man by tapping his name): their name keys the place's story and their
  job; left for a round that carries the story across.

## GATES (pre-push pass; full suite unmeasured by this lane, rule 13)
- HIS PLACE, HIS WAY (new, gates/his_place_his_way_gate.js): 24/0 upright, 24/0 sideways (W1-W4 engine; H0-H8 on the demo, every
  choice by a real tap, H8 after the page is shut and opened again; each planted with his look off at the map, red).
  H7 at 4x: his look adds no held frame (1 against 6 with it off upright; 1 against 1 sideways): the frames held past 50 ms at his
  place are the town page under the footage (PLUMBER 8's frame walk, rule 480(d)).
- YOUR PLACE, PLANTED: 150/0 upright, 147/0 sideways. ONCE, EVERYWHERE: 6/0 each way.

## WORDS (draft:true, home_base.json look): MOVE, PAINT, SIGN, 'Where does it go?', BACK, OK, ANOTHER, 'What do we call it?',
WORKS AT, REST, HERE; the paints' names; twelve names (LAST STOP, LA COLONIA, DRY CREEK, CASA NADA, THE HOLDOUT, GOOD WATER, EL REFUGIO,
TWO PALMS, LOW TIDE, THE KEEP, SUNRISE BLOCK, BUENA SUERTE).

[bb Battle Brothers: a name is changed by tapping it; ours: everything at his place is changed by tapping it on his cameras]
[analog horror: his own words, his own paint, read back to him in grey-green by a security camera at 3 am]

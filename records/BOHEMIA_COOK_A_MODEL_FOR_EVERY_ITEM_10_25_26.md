# [a model for every item] A MODEL FOR EVERY THING THE STASH CAN HOLD (COOK, rule 177(c), 10/25/26)

PAOLO 10/25 (rule 177): "I'm not seeing all the weapons, armour and off-hand items in the actual combat; I gave everyone car
door shields and I don't see that; can you just stop fucking with me?" The coordinator's why: every man in the fight is a
sheet baked with his gang's guns, and no car door is modelled. This row is the models; ANIMATION renders them as layers on
the rig ([gear as layers on the rig]), COMBAT draws them from each man's gear ([the fight draws what he wears]).

## MEASURED FIRST (`list`)
The stash holds the rows of records/target/bb/weapons.json (126) and armor.json (78 body, 87 head, 19 shields): 310 rows.
A player meets them as the market names them (RUN TWO's armourName and weapon classes, mirrored word for word by UI's
OBJ_CLASS in slices/bohemia_ui_materials.js): 13 weapon things, 4 body tiers, 4 head tiers, 2 shields. Add the Heavy's
crash bar (the fight draws his Heavy Metal Shield as it) and ANIMATION's three by-row shapes (the wooden stick is a club,
the morning star a nail bat, the hatchet and the handaxe a hatchet): 27 things.

BEFORE THIS ROUND: 3 of 27 had a model a renderer can import (COOK's pistol, shotgun and rifle, 10/18). 8 more (the car
door, the crash bar, the pipe, club, nail bat, cleaver, machete, hatchet) lived only as inline sketches inside ANIMATION's
melee tool, no file. The armour tiers and the head gear had nothing at all.

The table, every row and the thing it is: records/target/cook_every_item/BOHEMIA_EVERY_ITEM_AND_ITS_MODEL.json.
The manifest a renderer reads (frame, size, rows, sha1, where its check is): reference/models/bohemia/items.json.

## THE RIG'S FORMAT (read off the tools that already import a held thing, never invented)
- HELD: reference/models/bohemia/item_<name>.glb at real size in metres, COMBAT's guns tool's and ANIMATION's place()
  frame: the origin the middle of the right hand's grip, the haft or barrel along +X, the edge or striking face toward +Z;
  hafts 1.35 x their girth (ANIMATION's FAT). A two-hand thing names its left hand's place (left_x).
- SHIELD: the same, ANIMATION's build_shield/place_shield frame: the face +X, the width +Y, up +Z, the forearm at x = 0
  behind it, its middle at the origin; the elbow loop's and the grip's heights in the manifest.
- WORN: the glb carries the rig's man's own skeleton (CesiumMan's 19 bones; MEASURED identical, every bone's rest head to
  the millimetre, in CesiumMan.glb, PORTRAIT's thug and COOK THREE's raider) and its meshes skinned to those bones by
  name, in the model's own units (the man about 1.5 tall; the master rig scales him to 1.72 m), built over PORTRAIT's thug
  in his clothes so it clears a coat. A renderer calls wear(bpy, name) in the tool with a look loaded: the model's meshes
  move onto HIS armature and fit() runs: a head piece is scaled as one rigid shell about his head's centre until it clears
  his head and whatever his look wears on it; cloth and plates are pushed out past his body, each vertex taking the largest
  push of its neighbours within 3 cm so a padded layer keeps its thickness. Measured on COOK THREE's raider (his own helmet
  and coif on): the plate carrier moved 416 of 1,825 vertices, the hard hat scaled whole.

## THE PALETTE
Act one (rule 159: faded, dirty, rare colour; fenced by 167(b): never drained toward grey): every base colour a step of
records/target/BOHEMIA_STYLE_PALETTE.json through COOK's props modeller's mat(), at most five a model (the style guide's
prop cap), the detail modelled as geometry (a glb carries no procedural texture). One colour per thing where colour
belongs: the car door's sun-killed teal, the fire axe's faded red head, the hard hat's yellow, the pike pole's mustard
fibreglass, the Molotov's green bottle, the padlock's brass, the riot helmet's pale unit stripe; the rest steel, rust,
rubber, wood and canvas. THE GATE CAUGHT TWO: the riot helmet and the full riot armour came out all black and grey; the
helmet took a pale unit stripe and number, the armour's suit went faded coyote.

## THE LOOP (the compare law, every model, before it ships)
`man <name>`: the thing on PORTRAIT's thug (COMBAT's own poses tool laid Stand on him, unedited): a shield on his left
forearm, a weapon in his right fist at ANIMATION's rest hold, armour and head gear on his bones; one glb, then DIRECTION's
master rig (imported, unedited) in eight facings at the man's 1.72 m; the shields and weapons also alone. `sheet <name>`:
the man with it beside YOU's own fight-sheet cell, over a crop of a real fight floor (slices/fight_ground/block_subs_0),
at 1:1 and x3: records/target/cook_every_item/check_<name>.webp. A model joins the manifest only once its sheet is made.

What the loop caught:
- THE CHECK SCENE: the first car door hung below his hand like a briefcase to the floor (the parenting dropped the
  armature's turn), then the man lay on his back (the cleanup deleted the importer's Z_UP root that stands him up): both
  fixed in the scene, never in the model.
- THE CRASH BAR in the bar's own dark olive was one black block on the asphalt at the fight's pixels: the plate is bare
  tread steel now, the dark bars on a light ground.
- THE HARD HAT sat like a mushroom over his whole face from the 45 degree camera and its mustard came out of the sun tan, a
  pith helmet: snug, the rim high over the brow, the peak short and level, the lighter yellow step. The riot helmets too
  were a bucket over the face: snug.
- A PART IN THE MAN'S SCENE: an add operator dropped its object at the origin whatever place it was given (the hard hat's
  sticker landed under his feet, then over his head): every part is now made at the origin, turned in its mesh, then placed.
- THE PADDED VEST: its stuffing took the weights of a vertex of his that the right arm also carried, and in the walk a pale
  sliver stretched from his side to his swinging hand and on to the floor: a torso piece keeps only the torso bones' share
  of the weights now (the plate carrier rendered again with it).
- THE MACHETE: a 6 cm blade was a hairline at 57 px a metre; it is a bolo's belly now, 8 cm at its widest (a real one's).

## THE GATE
gates/every_item_has_a_model_gate.py, EVERY ITEM HAS A MODEL, in the suite: M1 every row lands on a modelled thing by the
market's OWN naming (OBJ_CLASS and armourName read out of slices/bohemia_ui_materials.js); M2 every file is there and is
the file the manifest measured; M3 the rig's format (a grip at the origin and the haft out along +X; a shield's forearm
behind its face and its own width and height; a worn thing skinned to the 19 bones and nothing else); M4 every colour a
palette step, at most five, never all grey (167(b)); M5 the sheet on the man over a fight floor; four mutations bite (a
class the market cannot name, the car door's file gone, a stray bone, a shield named as a thing with no model).

## REFERENCE CHECK
The compare law: every model on a man, on a real fight floor, beside a man already in the game, at the fight's pixels.
Real things at real sizes: a sedan's front door cut at the beltline 0.92 x 0.62 m; a pickup push bar 0.48 x 0.62 m in
1.25 in tube; a ballistic shield 0.52 x 0.9 m; an eight-pound sledge on a 0.9 m haft; a pick-head fire axe 0.92 m; a
firefighter's pike pole 2.1 m; a 0.75 l bottle; a compound bow 1.12 m axle to axle. Analog horror AH-01: scavenged, shot,
rusted, taped, strapped on with a seatbelt. Battle Brothers draws a man from layers (body, armour, helmet, weapon,
shield): the study, no other reference game.

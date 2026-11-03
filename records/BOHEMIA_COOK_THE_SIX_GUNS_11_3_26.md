# COOK GUNS: THE SIX GUNS, EACH ITS OWN MODEL IN EVERY MAN'S HANDS (rule 337, ask line 344; Paolo 11/3)

Paolo 11/3: "we don't have enough assets... weapons, armor, the vibe." COOK WEAPONS gave thirteen melee their own models and left
THE SIX GUNS owed (records/BOHEMIA_COOK_EVERY_WEAPON_ITS_OWN_MODEL_11_3_26.md, OWED): the zip gun, the snub revolver, the lever
rifle, the scoped deer rifle, the sawed-off and the pump shotgun were drawn as the class's pistol, rifle and shotgun (COOK's 10/19
'A' guns: gun_pistol_a, gun_rifle_a, gun_shotgun_a).

## THE MODELS (reference/models/bohemia/, COOK's gun kit: tools/bohemia_cook_model_guns.py helpers and build(), five materials)
| row | before: drawn in his hand as | after: its own model | size |
|---|---|---|---|
| zip gun | the 1911 pistol | gun_zip (NEW): half-inch galvanised pipe on a pine 2x4 offcut, two hose clamps, a coupling and cap at the breech, a nail striker pulled back on a rubber band, a bent screw-eye trigger, grey tape twice round the grip | 0.25 m |
| snub revolver | the 1911 pistol | gun_snub (NEW): blued two-inch revolver, five chambers, bobbed hammer, black rubber finger-groove grip, white paint on the front sight | 0.14 m |
| lever rifle | the bolt deer rifle | gun_rifle_b (COOK 10/19): the lever carbine, the receiver bare steel, the forend wired to the barrel | 0.98 m |
| scoped deer rifle | the bolt deer rifle (open sights) | gun_rifle_scoped (NEW): the bolt rifle with a 3-9x40 scope (one-inch tube, 40 mm objective, turrets) on two rings, the slipped front ring taped, the seatbelt sling | 1.09 m |
| sawed-off | the class shotgun (a sawn-off double, short stock) | gun_shotgun_sawn (NEW): the side-by-side cut to the forend, the stock sawn to a pistol grip wound in black tape, the saw's face raw, the cut barrel ends filed bright | 0.46 m |
| pump shotgun | the class shotgun | gun_shotgun_b (COOK 10/19): the pump, the ribbed wood slide, the cracked wrist held with two hose clamps | 1.01 m |

The sawed-off: the class shotgun every handgonne row is drawn as was already a sawn-off double with a short stock, so the sawed-off
row's own gun is cut further (no stock at all, the forend-length barrels), or it would read as the gun it was drawn as.

## THE WAY (one renderer, the master rig; nothing drawn by hand)
1. FOUR PICTURE SYSTEMS, EACH RENDERED BY ITS OWN TOOL'S RENDER: the fight's grid (Carry, CarryWalk, Aim, Hit, Swing) and the
   held clips (the pistol's low ready, its walk, the one-hand aim, the knee in cover, the reload; the long gun's knee, its aim over
   cover, the reload) and the carry idles (19 poses): COMBAT's guns tool patched in memory the way ANIMATION's hold and idles tools
   already patch it (this gun, '_KIND' its class's hold, the clip list, the folder, the hold tool's own PLACE). The shield arm's
   pistol (s1): ANIMATION's melee render_props with its source given the gun's model in memory. Nothing of COMBAT's or
   ANIMATION's edited. tools/bohemia_cook_the_six_guns_11_3_26.py (model, alone, icon, render, pack, manifest, shelf, sheet, vote).
2. YOU's BODIES rebuilt in this container by each tool's own commands (COMBAT `bodies you`, the melee and idles `pose`, a Stand
   render for the frame: 93 s in all) and CHECKED FIRST: the class pistol re-rendered in the grid lands on the shipped
   you_guns.webp, 1 pixel of 4,504 different over all 120 cells.
3. EVERY MAN: one set of renders, YOU's. A man holds YOU's picture of the gun moved by HIS SHIFT: his feet against YOU's, plus
   where his own class gun sits against YOU's in the same picture, the median over the keys per (system, clip, facing), read off
   his own shipped class-gun sheets in the grid, the held clips and the idles; so a 1.60 m woman, a 1.86 m Heavy and the thug's
   stoop hold it where their own class gun was, not where YOU's hands are. MEASURED first with one shift a man: the thug and the
   poacher missed by 11 to 17 px at the 90th percentile, 45 looks by over 4 px; per (system, clip, facing) every picture of every
   man's class gun sits 0.45 px from its group's shift at the median, 1.56 px at the 90th (122,302 pictures; 92 distinct tables
   for 103 looks x 3 classes, records/target/cook_six_guns/shift_fit.json). The shield arm's pistol moves
   by the feet only, exactly as the class pistol it replaces is borrowed from YOU's sheet (props_ref); a look that draws its own
   shield-arm pistol (the thug, the poacher, the caravans, the wide brim) keeps the class pistol there.
4. THE FIGHT (slices/BOHEMIA_FIGHT.html, block __THE_SIX_GUNS__ and one marked line at each of the five places a gun is laid:
   blitMan, chipBlit, holdDraw, idleDraw, meleeDraw's shield arm): slices/fight_rig/own_guns.json (row -> model, the cells per
   system, every look's shift) and one sheet a gun (slices/fight_rig/own_guns/<row>.webp). Until a gun's sheet is in, or where it
   has no picture, the class gun exactly as before. The punch's white flash leaves the own gun out (it tinted the class gun's shape).
5. THE SHELF: each gun's render on the bag's diagonal, slices/market_icons/own_<row>.png; the settlement screen's own-model block
   (COOK WEAPONS' shelf(), run again) now lists 19 rows.
6. THE MANIFEST: reference/models/bohemia/items.json gives each gun its own entry ('was' its class), its row moved off the class.

## NUMBERS
- Renders: 3,672 frames in YOU's hands (grid 720, held clips 1,056, idles 912, shield arm 288), four workers, 8 minutes.
- Sheets (slices/fight_rig/own_guns/, each one 1024 wide, rule 173's 2048 x 1024 kept): zip gun 602 cells 1024 x 63, snub 509
  1024 x 21, lever rifle 392 1024 x 348, scoped deer rifle 392 1024 x 429, sawed-off 367 1024 x 87, pump 392 1024 x 366; 371 KB in
  all. The index slices/fight_rig/own_guns.json 147 KB (the cells and the 92 shift tables), fetched only when a man with one of the
  six is drawn.
- The six models: gun_zip 0.25 m, gun_snub 0.14 m, gun_rifle_scoped 1.09 m, gun_shotgun_sawn 0.46 m (new); gun_rifle_b 0.98 m and
  gun_shotgun_b 1.01 m (COOK 10/19, untouched).

## PROOF (tools/bohemia_cook_the_six_guns_proof_11_3_26.js, the shipped fight at 390 x 844 at 3x through the one driver)
Each gun in YOU's hands in reach of a brigand who is handed the same gun (another look: his shift), YOU turned through the eight
facings, then the fight's own shot held at six points of its beat; twice, BEFORE (the own guns switched off in the page only) and
AFTER. The fight's own count of what it drew (records/target/cook_six_guns/proof.json): BEFORE 'gun:<row>' 0 for all six; AFTER
759 to 776 own-gun draws a run (zip gun 764, snub 774, lever rifle 760, scoped deer rifle 776, sawed-off 759, pump 776), through the
held clips (PIdle, CoverPistol, CoverPistolAim, PHit; CoverLong, CoverLongAim), the idles and the grid's aim; 0 page errors in
all twelve runs. The VOTE card is those frames: records/target/cook_six_guns/sheet.webp (WAS left, NOW right), first frame
first.webp.

## CHECKS RUN (only the ones this change touches)
every item has a model 282/0 (the six own entries, their rows off the class entries); the full suite once at the end (below).

## OWED (honest)
- The 107 Battle Brothers rows still drawn as their class's model (by_class): a sword is the machete, a mace the pipe. Next, the
  most-carried first (ANIMATION's 10/25 count): the bludgeon, the two-handed mallet, the woodcutter's axe.
- The bag's 22-cell icon for the guns is the hand-cut one (ARMORY 11/2), as COOK WEAPONS found for the melee: a model cut into 22
  cells reads worse than the hand-cut icon.
- The shot itself (the muzzle flash, the tracer) is the fight's 2D drawing; SOUNDS owns each gun's report.

[bb Battle Brothers draws every weapon its own sprite in the man's hand, layered over his body in every pose; ours now does for the six guns too.]
[analog horror: a pipe with a nail in it, a hunting scope taped where it slipped, a shotgun sawed down to a grip: every one of them made by somebody who had stopped expecting help.]

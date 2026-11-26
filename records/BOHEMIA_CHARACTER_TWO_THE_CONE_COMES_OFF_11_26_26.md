# CHARACTER 2, 11/26: THE CONE COMES OFF EVERY WEARER, AND A PEOPLE SHEET NO LONGER COSTS A FRAME

Rule 470(f) (Paolo on homework card hw04-06: 'why are people wearing chinese rice farmer hats btw wtf???'), the plan in
records/BOHEMIA_CHARACTER_THE_CONE_HAT_IS_DEAD_11_22_26.md; rule 480 (Paolo 11/26: 'Lets turn up full sweep. But improve on
what we already have. And make sure fps is never choppy for nothing lets go'), (b) improve what is in the game, (c) never choppy.

## 1. WHO REALLY WORE IT (measured on the pictures, not the labels)
The 11/22 plan listed five wearers. Looking at every sheet first changed the job:
| who | what the 11/22 list said | what the pictures show |
|---|---|---|
| the 8 Caravans hall men (person_caravans_0..7) | the cone, through the gang default | NO HAT AT ALL on every sheet (rig_mix, map, fight, idles): a person's build drops his gang look's hat (the barber's PM.PEOPLE drop) and puts on only the hat he rolled; none of the 8 rolled one. Only their LABEL said rice farmer hat |
| faction_caravans (the Caravans' one-piece look) | the cone | THE CONE, on the fight sheet, idles, holds, melee, the gang stills, and the HD face of every Caravans speaker: MANNY (the trucker with no truck), MARISOL, Mamá Ruth Okafor, Teo Abernathy |
| cast_widebrim | the cone | THE CONE: Old Tavo (the lot's client) and NUMBER 212 at the real place's line, who can be HIRED (records/target/bb/real_places.json), so it reaches the fight |
| the 2D wardrobe hat 'CHINESE RICE FARMER HAT' | the cone | a WIDE BRIM (genHat kind 'brim', renamed from DESERT WIDE-BRIM on 7/18); only the name was the cone |

## 2. THE DUST RANCHER HAT (decided 11/22, built here)
One shape, tools/bohemia_character_dust_rancher_hat.py, called by three builders so the map, the fight and the face wear one hat:
an oval felt crown pinched at the two front sides with a wide shallow crease, a leather band two rows deep, a brim flat at the
front and the back and rolled up at the sides, the Caravans' dust felt (128, 110, 80), an oiled saddle-leather band (66, 48, 34).
- the gang look: tools/bohemia_character_the_thirteen_through_the_rig.py LOOKS['Caravans'] hat kind 'rancher' (was 'cone')
- the faces: tools/bohemia_portrait_the_head_from_the_model.py gear 'rancher hat' on FACTION['Caravans'] and CREW['CAST_WIDEBRIM']
  (the 'cone hat' builder deleted); the hair inside the crown is not built
- the barber's book: tools/bohemia_character_hats_one.py 'DUST RANCHER HAT', shape 'rancher' (the cone row deleted); kept out of the
  random mix (the Caravans' own mark): tools/bohemia_character_the_barbers_book.py NOT_RANDOM_HATS
THE LOOPS, looking at the game's camera each time (a fast preview: the head and one portrait into scratch):
1. a brim of 0.33 x the head read as a bowler from 45 degrees; a black dot on the crown's top -> the brim 0.40, the band two rows
2. the dot stayed: the crease (0.26 deep, 0.42 wide) was a narrow valley the rig's sun left in shadow -> 0.15 deep, 0.62 wide
3. the dot stayed: it was the Caravans trader's coil crown poking up through the crown's middle -> the hair inside the crown is
   not built. Then it read as a felt western hat from every facing and on the face, the band and the rolled sides visible.

## 3. WHAT WAS RE-MADE
- the faces: PORTRAIT's own recipe (tools/bohemia_portrait_the_face_is_the_bodys_face.py --render) for FACTION_CARAVANS and
  CAST_WIDEBRIM: the body, the head, 8 facings, the portrait and its 7 expressions, the mask; the hand-off files (64 and 128 of
  the rest face, the four mouths, the three moods, the mask) cut by PORTRAIT's own window
  (tools/bohemia_character_two_pack_only_these_looks.py faces); the wound faces through PORTRAIT's wound tool
- the gang stills: records/target/character/rig/caravans (the thirteen's build, the master rig as recorded in its rig.json)
- the fight: COMBAT's bodies, render, carry and guns for both looks; ANIMATION's idles, holds and melee for both looks
- THE PACKS, A TRAP NAMED: two owners' packs rebuild their whole output from the renders on disk (COMBAT's fight pack rebuilds
  fight_rig.json and faces.webp; ANIMATION's idles pack first deletes every file in slices/rig_idles), and a fresh box holds only the
  renders it made (they are .gitignore'd), so either pack as written would drop every other look. tools/
  bohemia_character_two_pack_only_these_looks.py runs each owner's pack UNEDITED, imported, into a scratch folder, and merges only
  the named looks' files and index entries back; the holds, melee and guns packs already update in place and are called as written.

## 4. THE LABELS (rule 480(b): the data says what he wears)
- the 8 Caravans hall men's 'head' label, and 40 more hall men in 6 gangs (Anarchists, Cartel, Church, Colorful, Remnants, Trades)
  labelled with their gang's default hat they do not wear (person_anarchists_2: CHARCOAL WATCH CAP, wears the BRICK one he rolled):
  tools/bohemia_run2_no_two_people_alike.py who() now labels the hat he rolled or none; 59 rows of engine/bohemia_people_mix.js and
  52 rows of nine slices/rig_mix/*.json patched (head only: a full re-index would also have carried other lanes' drift, 13 men
  newly hireable, so it was not run). Nothing on screen reads the label today; it is the one place a screen would.
- the alpha's wardrobe: 'CHINESE RICE FARMER HAT' renamed 'DUST RANCHER HAT' (the same wide brim) with a leather band row
  (genHat brim, opt.band); FACTION_LOOKS' Caravans and the widebrim cast look wear it; the demo re-cut; tombstone in
  gates/bohemia_graveyard.txt. A saved outfit that named the old hat draws no hat.
- slices/fight_people/fight_people.json, tools/bohemia_faction_outfits.py, tools/bohemia_faction_fits.js, the roll call, the barber's
  book, HATS 1's record, slices/BOHEMIA_LOOK_CURRENT.html's caption.

## 5. THE GATE: NONE AT ALL
gates/the_cone_hat_is_dead_gate.py: C1 none at all (and it now reads engine/, where the people index carried 8 labels it never
saw), C2 no builder makes it (no gang hat kind, portrait gear or HATS 1 shape), C3 nobody rolls it, C4 every person's label is the
hat he wears. Green here 4/0; run against main's files it is 1/3 (C1 42 mentions in 10 files, C2 all three builders, C4 48 labels).

## 6. RULE 480(c): A CHARACTER SHEET NO LONGER COSTS A FRAME
MEASURED at 390 x 844 on a CPU slowed four times (rule 480(d)'s phone), a canvas drawing one 68 x 129 cell, first time:
| sheet | first draw | after img.decode() | bitmap from the file's bytes: first draw |
|---|---|---|---|
| rig_mix/caravans.png (476 x 8,256) | 62 to 98 ms | 65 to 73 | 2.8 |
| rig_mix/town.png (490 x 12,288) | 103 to 115 | 141 to 173 | 1.0 |
| rig_idles/map_caravans.webp (2048 x 1080) | 175 to 251 | 145 to 178 | 1.2 |
| fight_rig/packed/faction_caravans.webp | 49 to 52 | 55 to 58 | 1.5 |
| rig_hold/faction_caravans.webp (2048 x 815) | 86 to 88 | 75 to 83 | 3.6 |
The worst frame while a sheet lands, a frame clock running: the picture path 67 to 117 ms; createImageBitmap(img) 33 to 133
(still on the thread); fetch, blob, createImageBitmap 16.8 ms for every sheet (one frame at sixty: the unpacking is off the thread).
img.decode() does not reach a canvas (PLUMBER 7 measured the same on 11/7).
THE FIX, marked __A_SHEET_DECODES_OFF_THE_FRAME__: engine/bohemia_idles.js (every idle, town-activity and map-idle sheet the
map, the towns and the fight draw: beside PLUMBER 7's warm, which stays for a browser without the bitmap) and the map's people
sheets (slices/BOHEMIA_CITY_WORLD.html rigSheetLoad). The bitmap answers naturalWidth and complete like the picture it replaces;
window.__SHEETS_NO_BITMAP = true turns it off. PROVED on the engine at 4x, six seconds of six men's sheets landing and drawn:
picture path 4 frames over 50 ms (worst 100); bitmap path 0 over 50 (worst 49.9, the probe's own pixel reads); the same pixels
(one cell's hash 1939205029 both ways).
ON PLUMBER'S OWN LEG (gates/every_change_at_sixty_gate.js C5, the first way out of a town), the same busy box (Blender on all four
cores), main's engine against this one: the longest frame of the leave 316.7 ms against 200 ms; 14 sheets warmed on the page's
thread against 15 unpacked off it (the longest 0 ms); the planted old way 616 to 650 ms. C5's 150 ms is red either way on a loaded
box; the planted fail (P1) still bites (__IDLES_NO_WARM turns the bitmap path off too, so the old way is the old way).
NOT MINE, ROUTED: the fight's own sheet loader (slices/BOHEMIA_FIGHT.html, the packed atlases, 49 to 52 ms a sheet's first draw
at 4x) to FIGHT SCREEN / COMBAT with this table; the same three lines move it.

## 7. PROOF (pre-push pass, on the rebased tree)
THE CONE HAT IS DEAD 4/0 (1/3 on main's files); DEMO BUILD 25/0; THE SHEETS ARE PACKED 4/0; A SHEET IS READ ONCE 4/0; FIRST PLAY IS
LIGHT 7/0 (16.64 MB before first play); THE ROLL CALL 8/0 (it was stale on main: 287 lines of verdicts re-derived); THE LOOK GATE
24/0; THE HAIR GRAVEYARD 13/0; THE TOWN'S ACTIVITIES 22/0; THE PACKERS MERGE 4/0; THE FACE IS HIS OWN FACE 18/0. Main's reds, the
same on main's files (none names these two looks or these files): FACTION OUTFIT 17/1 (the spread 0.081), the GRAVEYARD's 14 live
references, NO TWO PEOPLE ALIKE 18/5, EVERYBODY IDLES 37/4 (P1, C3 beasts, R5, W4), THE FACE IS THE BODY'S FACE 134/18, ONE SKIN
ONE PERSON 14/1, EVERY CHANGE AT SIXTY C2, C3 (the board's reads) and C5 (above). Full suite unmeasured since main's last SUITE LINE.
THE WOUND FACES (wince, blink) of both looks: a second build (the first run called Blender through an unset BOHEMIA_BPY and wrote
nothing; re-run with it set).

## [bb] Battle Brothers dresses its caravan hands in what a road needs: a wide hat and a cloak; ours wear the valley's own.
## [analog horror] a felt hat with a sweat line at the band, on a man who has not taken it off since the trucks stopped.

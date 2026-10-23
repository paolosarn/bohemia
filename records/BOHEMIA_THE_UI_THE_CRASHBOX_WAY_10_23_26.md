# THE UI THE CRASHBOX WAY (UI, 10/23/26)

Row: UI [the UI the Crashbox way] THE-UI-BELONGS-TO-THE-WORLD. Rule 130(b), Paolo 10/23: "the UI kind of still sucks, it
doesn't look as elevated as the Crashbox style that we're going for"; 121(g): his biggest concern; the 9/20 rule ALL THE UI
LOOKS 3-D (built with light and form, delivered as pixels). No card (rules 123, 127): he meets it in the game.

## MEASURED FIRST

Every panel, button, bar and slot on the five screens he touches (the fight's bar, the map's top bar and speed pad, the
settlement's header and sheet, the crew screen, the settings) was dressed from FOUR PICTURES DRAWN IN CANVAS CODE at boot
(slices/bohemia_ui_materials.js: cardboard(), receipt(), glass(), tape(): linear gradients and sprinkled random dots,
stretched to each box at 100% 100%). They were the only things on the glass not made the rig's way: the people, the ground,
the buildings, the guns and the icons all come out of Blender through DIRECTION's master rig since rule 115, and the UI sat
on top of them as flat gradient boxes. The settlement's header (THE PLACE, CREW, LEAVE) and its sheet were not dressed at
all: browser-default dark boxes in a system monospace.

## WHAT WAS BUILT

THE KIT: tools/bohemia_ui_crashbox_kit.py models each material as a THING in Blender, at its real thickness, and renders
it under the world's one sun the rig's way, then cuts it into nine pictures (slices/ui_kit/<piece>/, four corners, four
edges, the middle; slices/ui_kit/kit.json holds every number).

| piece | what it is | where it is worn |
|---|---|---|
| tin | a pressed tin plate painted bone, a stamped panel struck up 1.2 points on a soft slope, a rivet in each corner, the paint chipped through to rust on the worn edges | every press: END TURN/FIGHT, WAIT, AUTO, the round; the map's DAY, crew, gear and NOTES; CREW and LEAVE; DONE; the settings' buttons and slider handles; the close X |
| tin_dark | the same plate in a dead olive | what is not picked: the speed pad, the settings' bars |
| tin_amber | the same plate in signal amber | what IS picked: the speed you run at, a lit bar, AUTO on, NOTES open |
| board | corrugated board, the top liner torn back along a wandering line so the flutes show | the fight's bar |
| board_plain | the same board cut clean | the map's top bar, the speed pad, the settlement's header and sheet, the crew screen's bar and his page, the settings sheet |
| receipt | thermal paper with a soft curl at its long edges | the fight's hint, the drawer, the end box; the shops' rows; the stats; the settings title |
| glass | a pane of cracked phone glass on a bevel in a dark frame | the glass presses off the front screen |
| well | a pocket pressed into a dark tin tray, cracked glass at its floor; each slot's floor cut from another part of the glass | every empty slot: the fight's skills, the shelves, the bag, his gear |
| well_full | the same pocket lined with board | a slot with something in it |
| tray | the same pocket long (its floor four times the period) | what you carry on the map, the fight's turn faces, the line's empty places |
| tape | a strip of yellowed packing tape, see-through, torn at both ends | everything taped on |

THE LIGHT AND THE CAMERA: one sun at the guide's calibrated screen angle (155.4 degrees, up and to the left) and 40 degrees
over the glass, the guide's cool sky fill (0.55, 0.55, 0.6 at 0.35), Cycles on the CPU at the guide's 128 samples, no
denoise, Standard view, film transparent. The camera is square to the glass and tipped 25 degrees toward the top, so a
slab's bottom edge shows its thickness (two points on a 4.7 point plate), the height stretched back by 1/cos(25) the way the
rig stretches a man. Two texels a point (crisp on his 3x phone).

THE SOURCE PASS, MADE TO TILE: the rig's recipe key for key (matte, the paint old, crevice grime from the model's own
occlusion, dust broken by a mask, a slow colour drift, value grain weighted by the wear, the edges chipped through to a dark
undercoat, rust under tin), every mask a PERIODIC picture (filtered noise on a torus) with exactly one period across the
middle piece, so the middle and the edges repeat at any size without a seam. Two deliberate changes from the prop recipe,
both measured on the first contact sheet: the dust is the top of its mask only and light (every face of a UI piece faces
the glass, so at the rig's strength the dark pieces read as camouflage), and the drift sits on 0.5 the way Blender's noise
does (a full-range drift read as pink and green camouflage on bone tin).

THE POST: the rig's own: the alpha cut at the guide's threshold, the ring one step darker on the silhouette, the population
snap toward his PROP family's colours at 0.3.

THE WEAR: kit(piece, scale) in the materials lays the nine pictures as nine background layers (corners on top, the edges,
the middle under), the box's own radius rounding the corners; KIT_RULES dresses 49 selectors in 42 rules on every screen
the materials file is on (all under html[data-kit] body, so they outrank the rules they dress); the four material
variables point at the rendered pictures, so anything not named still wears a rendered surface. NOTHING CHANGES A BOX'S
SIZE: only the background, the corner, a hard shadow down and to the right from the same sun, and the press (the slab goes
down one point into its shadow). One file, no other lane's file touched: RUN's demo, RUN TWO's settlement and crew screens,
COMBAT's fight load the materials live, no re-cut.

THE FRONT SCREEN HE LOVED IS LEFT ALONE (rules 127(b), 130(b)): the start screen and the door's picks in the just-the-font
look (#front[data-look=just-the-font], .bm-start.jtf) wear nothing from the kit; the first wiring did dress them and the
NEW GAME words went dark on dark board: caught on the real surface, scoped out, and now held by the gate pixel for pixel.

## LEGIBILITY (rule 73)

Words on each piece's middle, the 20th percentile ground for dark ink, plain and with a quarter of white over both (the
sun): tin 10.3 / 5.3, amber 9.4 / 4.9, paper 11.6 / 5.7; light ink on olive 10.4 / 5.0, board 9.5 / 4.6, glass 11.3 / 5.3,
a pocket 11.4 / 5.4. On the real surface: END TURN 10.6 / 5.4, AUTO 10.6 / 5.4, CREW 10.6 / 5.4, LEAVE 10.3 / 5.3, DONE
10.7 / 5.4, the day 10.6 / 5.4, NOTES 10.4 / 5.3.

## GATES (rule 13: my own runs, by name)

THE UI BELONGS TO THE WORLD (new, in the suite): the kit on disk (numbers, nine pictures a piece, no seam, the rig's way)
and on the real surface (each screen wears its pieces, nothing grows, every picture loads, every word 4.5 to 1 in the sun,
the front screen untouched), four planted defects caught.

Re-aimed, all UI's own: SETTINGS IN OUR MATERIALS (a rendered board counts as a picture from the materials), THE FIGHT'S
BAR IS STUDIO MADE (the slab's shadow is hard, no blur, at most two points off: the sun's), THE MAP'S BAR and THE FLIP OFF
THE FACE (a tag is a slab lit from the left with its right bevel in shade, so a word is read against the ground right beside
the word, not against the bevel; the lit speed may be the amber plate as well as the old gradient).

## NEXT

The phone's casing on the map is still the city's CSS rail (three act skins, BOHEMIA_SKIN in the city file): a rendered
rail needs the act's skin to choose the piece, so it is its own row. The fight's thin health and fatigue bars and the AP
pips are still flat fills (five points tall: a trough at that size is a line). Act two and three of every piece are a
re-render of the same scene with other paint (rule 128): the kit's PIECES table takes a paint per act.

[bb Battle Brothers' whole interface is made of the setting's own materials, wood, iron, parchment and ink (its dev blog
on the UI); ours are the valley's: tin, board, thermal paper, phone glass, tape, rendered the way the world is.]
[analog horror: every button is a plate somebody riveted onto something else; the paint is worn off where thumbs went, the
rust starts at the rivets, and the glass at the bottom of every empty pocket is already cracked.]

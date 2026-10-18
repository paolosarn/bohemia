# THE LINE ON A GROUND: THE COMPANY STANDS ON SOMETHING (UI, 10/18/26, ui-opus-f)

Row: UI [the line on a ground] THE-COMPANY-STANDS-ON-SOMETHING (rule 88 and the twin's difference 2 of
records/BOHEMIA_THE_ROSTER_AND_THE_POSTS_LOOK_10_10_26.md). A CANDIDATE (rule 100): nothing is in slices/, engine/ or
the demo; laid in the browser only.

## The row's words

'the company screen sits on flat near-black where the opening screen he called awesome sits on the painted night
valley. Give the roster and the hall a ground from the approved packs (rule 82a), a camp at night behind the two
lines, never a gradient; the words keep the sun test. Sheet with its twin.'

## Study first

records/BOHEMIA_UI_HOW_THE_PACK_DID_IT_THE_NIGHT_GROUND_10_18_26.md: his ground tiles are 96 px framed islands, HD
painted (3,000 to 6,000 colours a tile), lit flat by day, with a hue-shifted ramp (dirt: redder richer darks, yellower
paler lights); THE PACK HAS NO NIGHT; its camp pieces are fantasy props and props are the rig's (rule 115a).

## Measured first, on RUN TWO's company screen as it is (his phone, 390 x 844 and 844 x 390)

- The screen's ground is #120e0a, flat, from the bar's foot to the bottom. The two lines (FRONT, BACK) are 18 cells of
  48 x 64 at y 116 and 200; every man sits on a cardboard backing, every empty place is a cracked glass pane.
- Upright the line runs past the glass (nine cells, 468 px in 390); on its side the line ends at x 476 and the right
  368 px of the band are empty near-black.
- Every word over the band passes today (12.94 plain, 6.55 in the sun) because it sits on near-black. That is the bar
  the ground has to keep.
- The hall: the hire cards (taped cardboard) on a sheet of rgba(22,17,12,.97); the speaker's name in amber (#d9a85a)
  passes at 8.41 plain, 4.60 in the sun: the thinnest margin on either screen.

## What was made (tools/bohemia_ui_the_line_on_a_ground_cook.py, the painter; pure PIL and numpy)

1. THE GROUND IS HIS: '2. Soil and dirt tiles' #0, 1, 20, 21, 22 (his plain dirt), cut 8 px in from every side and laid
   in a brick bond, never the same tile beside or above itself, a left-right flip only (the pack's light is from the
   top), each tile brought to the set's middle value first so the bond does not read as patches. 24 tiles upright, 48
   on its side, every one named in the manifest with the sha1 of the bank's bytes.
2. RE-LIT, NEVER DARKENED: each pixel's luminance read through the MOON's ramp (5,7,13 to 44,40,38; hues 225, 228,
   240, 264, 20) or the LAMP's (30,15,11 to 226,182,116; hues 13, 21, 27, 32, 36); the material's own colour survives
   15 percent in moonlight and 80 under the lamp. The darkest step is not black.
3. ONE LIGHT: COOK's rig lamp, its pool on the ground in five stepped rings with a 4 x 4 ordered dither where two meet,
   no gradient. Its glass is the only thing at the ramp's top step. The block still has power and nobody built the camp
   under it on purpose (the title's own wrong thing, bible R1).
4. THE CAMP'S THINGS ARE THE RIG'S, at one pixel to one pixel, re-lit by the same ramps at the light their foot stands
   in, the side toward the lamp one step brighter: DIRECTION's truck (round 2, facing SE, half off the right edge: the
   company's truck, parked), COOK's sandbags and tyres; each throws the rig's own contact shadow two light steps down.
   Upright: the lamp at the end of the back row and the tyres under it. On its side: the truck, the sandbags against
   the lamp, the tyres behind the line's end, all in the 368 px that were empty.
5. THE BAND ENDS in sixteen ordered steps into the screen's own #120e0a at 330 css px (the title's own band), so the gear
   list below stays the quiet rest area.
6. THE HALL: his '1. Cracked contrete tiles' #0, 1, 2, 6, 7, laid slab to slab as the pack draws them (a sidewalk),
   under the hall's roof: the moon's ramp only, read low (75th percentile 17 in the brightest channel). The first lay
   lit a band under the speaker and his amber name fell to 2.81 in the sun; the band is gone.

## The candidates (tools/bohemia_ui_the_line_on_a_ground_sheet.js lays them; the gate calls the same lay)

- A, THEY STAND IN THE CAMP: the cells become a 1 px line on the ground (an empty place is that line alone); a man stands
  on the camp with a contact line under his face; nothing else of RUN TWO's changes.
- B, THE CAMP BEHIND THEM: the same camp; a man keeps his cardboard backing; an empty place is a line on the ground.
- C, THE GROUND ONLY: A's cells on the bare ground, no props, the lamp's pool alone.
- The hall is the same under all three.

## Proof

- Gate: gates/the_line_on_a_ground_gate.js, in the suite as THE LINE ON A GROUND: 68/0 in 46 s. G1 every tile laid is the bank's own bytes (209 placements) and the painting follows each tile's light (median correlation 0.997; a flat painted ground reads -0.007); G2 the ramps shift 155 and 23 degrees; G3 one pixel size; G4 no gradient, glow, blur or round corner (the first run caught the old 2 px corner on the cells and the candidate squares them); G5 every word on the ground 4.5 to 1 plain and in the sun, worst 5.42 (YOUR COMPANY on the bar, unchanged) and on the ground 5.59; G6 18 cells where they were, 18 of 18 hit by the finger, 12 faces unchanged; G7 the contact line (A, C) or the cardboard (B); G8 one light; G9 the hall. Six planted defects caught every run on one page, and a control read after them proves the undo was clean.
- Sheet: records/target/ui_line_on_a_ground/UI_THE_LINE_ON_A_GROUND.png (now and A, B, C upright and on its side, the
  hall now and after, the twin, his tiles as they are and at night, the rig's props as rendered).
- Measures: records/target/ui_line_on_a_ground/measures.json; manifest: manifest.json in the same folder.
- VOTE: ui-the-line-on-a-ground-10-18 (A / B / C / NO).

## [bb interface]

Battle Brothers' character screen is where the men are lined up for the next fight (the translation table, row 'The
character screen', maps it to this company screen). How it is drawn is not in our library, so nothing here copies it;
ours puts the line on the ground the company camps on.

## Analog horror line

One street lamp in a dead city still has power and a company has camped under it. Nobody asks why it is on.

## Did not decide

Nothing. A, B or C is his pick; RUN TWO folds the picked one into its screen after his YES (rule 100b).

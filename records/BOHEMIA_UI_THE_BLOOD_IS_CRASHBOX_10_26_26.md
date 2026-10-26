# UI [the blood is CRASHBOX] + [the job tells the truth, in blood], the UI's half (10/26/26, BUILD 10/26c - THE JOB BLEEDS)

Rule 208(c), Paolo 10/25: 'make sure on the job the stars are red, and the button itself looks bloody depending on how
difficult the job is, especially if it's gonna be super overpowered like wolves... the button looking like some crashbox
blood filter.' The same night: 'not Crash Bandicoot, Crashbox' (the HBO Family stop-motion show, rule 115(d)).
The coordinator's NOTEs: red clay or paint smeared and dripped on the tin button, dried dark at the edges, a thumbprint in
it, stop-motion holds; one continuous layer a button can wear from clean to soaked, made the rig's way like the kit,
never canvas code, never a glossy gradient or a filter. WORLD passes only the danger number.

## MEASURED FIRST
No button in the game could bleed. A job's danger had nowhere to go but its stars. The job's buttons on the demo at
85ff5bb7 (390 x 844): the town's board row (366 x 111, a receipt, a face at its left end), the offer's Take it (366 x 48,
a receipt), the phone's card (138 x 44, the phone's dark glass; rule 212(d) killed the phone's jobs the same round, so
the phone is no longer a place for it).

## WHAT WAS MADE
THE CLAY (tools/bohemia_ui_blood.py, bpy 4.2, about 45 s for all forty pictures). Every stage is red clay modelled as a
height field at its real thickness (half a point for a print's ridges, a point and a half where a drip has beaded), lit
by the kit's one sun (155.4 degrees, 40 up, the guide's fill, Cycles, the guide's matte: roughness 1, no specular), seen
by the kit's camera (square to the glass, tipped 25, two texels a point), casting its own shadow on the tin under it (a
shadow catcher, kept at the kit's one shadow value), then the kit's post (the hard alpha edge, the ring, the prop
family's colours at 0.3). The kit's light_camera(), post() and lin() are imported, never copied. Where the clay thins at
its edge it is dried dark (the outer three texels). The colours were set from a measurement: under the guide's sun a
matte surface lands at about 0.88 of its colour, so the first cut (0.60 red) rendered at 31/5/4, near-black; now fresh
lands about 165/25/20, deep 120/15/12, dried 60/12/8.

EIGHT HELD STAGES OF ONE CLAY, each holding what the stage before held and more of it, darker:
1. a thumbprint at the button's left end (past a face if the button starts with one), patchy
2. the whole print, a spatter, the first pools at the bottom edge
3. the first drips off the top edge with blood run over the edge above them; four fingers dragged from the top right
4. more drips, longer, a bead of clay at each tip and a lump where it held last stage
5. the print's valleys fill, a bead runs off its foot; the pools join
6. a palm's swipe across the button's middle, four fingers wide, breaking into finger streaks where the palm lifted
7. two more swipes
8. soaked: what the swipes missed fills in
Five pictures a stage (slices/ui_kit/blood/<stage>/: thumb 34x40, hand 56x44, top 96x40 repeating along, foot 112x16
repeating along, field 128x128 repeating both ways from the button's middle). The repeating pieces are rendered from
clay that wraps past their ends, so a tile meets itself with its light and its shadow continuous. 372 KB for all forty.
The record's picture: records/target/UI_THE_BLOOD_IS_CRASHBOX_10_26_26.png (every stage on the kit's tin, the receipt
and the phone's dark glass).

THE ONE NUMBER (slices/bohemia_ui_materials.js, THE BLOOD IS CRASHBOX). bloodStage(danger) is WORLD's own scale
(records/target/bb/job_danger.json blood_from 0.04 and blood_full 0.65, read from WORLD's reader when it is on the page):
clean to 4 percent, seven stages between, soaked from 65 (a one-star job by TUNING's cut-offs, danger 5 or under, is clean
or a thumbprint; a three-star job, over 50, is stage 6 to 8). (The first cut ran its own 2 and 70; one scale now.) A button gets it by data-danger="0.37" (watched by
one MutationObserver, so WORLD only sets the number) or by BohemiaMaterials.bleed(el, danger). It is worn as the
button's ::after: under its words and its face (isolation on the button, the clay at z -1), over its own tin or paper,
pointer-events none. When the danger changes the clay steps through every stage between, one held frame an eighth note
(250 ms at 120 BPM), never a fade: stop-motion. A job seen before starts from the stage it last showed; a job seen for
the first time bleeds in from clean. From stage five the words get a one-pixel halo the colour of what the clay sits on
(bone under dark ink, soot under light).

ONE BLOOD (the same round). WORLD shipped its own clay for the same buttons in parallel (effa8af7: slices/job_blood, six
stages crossfaded under a brightness filter, laid as two child layers by slices/bohemia_job_danger.js) and its NOTE on this
board offered the move ('yours if you want the clay as a kit piece; a move is one line'). Both drew on the town's board,
two bloods on one button. Now ONE: a marked line in WORLD's paintBlood (__ONE_BLOOD__) hands the read's number to the kit
layer wherever the page carries it and draws nothing of its own; WORLD's data-blood stays its 0..1 number, the kit's stage
is data-bm-blood (and data-bm-blood-to); WORLD's gate J4 reads the kit's stage (a marked line). The kit's clay was kept
because it is the brief to the letter (a thumbprint, dried dark edges, stop-motion holds, no filter); WORLD's reader, its
stars and its number are untouched. The phone's job cards and the meet card's ENGAGE, which WORLD bleeds, wear the kit's
clay the same way. Where WORLD's reader is not on a page, a row's stars stand in (marked PROVISIONAL in the file).

ALSO: [eyes: the camp's clock] (EYES 10/25 q27, 'DAY 1 12…'): measured on today's demo, the camp already wears the one
bar (the one HUD, a0de7409), so the clip is gone; but the bar's place read the camp's clock ('DAY 1 / 15:00', the day
twice, and an hour behind the camp's own label). The place at camp is CAMP now; the day and the hour are on the bar's
dial.

## SEEN ON THE DEMO (phone 390 x 844 and computer 1440 x 900, Custom's board, real taps)
The row at danger 0.05, 0.2, 0.35, 0.5, 0.62, 0.9 (scratch pictures, read by eye): a thumbprint beside the face; a
spatter and pools; drips and the hand; the swipe through the middle with the words haloed; soaked with every word
readable. On the glass a soaked row is 60 to 63 percent red clay, a one-star row 0.7 to 1.1 percent. The offer's Take it
wears the same stage as the person who offered it.

## GATES (rule 13)
THE BLOOD IS CRASHBOX (new, in the suite) 23/0 with two plants (a gradient in place of the clay, the holds taken out):
P1 forty pictures; P2 0 soft pixels of 140,984, 100 percent of clay pixels red; P3 every stage holds the one before
(worst 96.9 percent, the clay thickening moves its edge a texel under the tipped camera; the first cut held 14 percent on
the spatter, which re-rolled its specks every stage: caught and fixed), cover on a 366 x 48 button 2 4 6 10 15 47 72 98
percent, luminance 42 -> 34; P4 the kit's sun, camera and post; S1 the scale; D1 to D7 on phone and computer.
ALSO GREEN on this change: ONE HUD EVERYWHERE 62/0, SETTLEMENT SCREEN 74/0, DEMO BUILD 25/0 and the cut --check exact,
DROP A JOB RIGHT IN THE TOWN 6/0, THE TRIP BEFORE THE YES 7/0, THE BOARD'S QUESTS ARE PEOPLE 16/0; after ONE BLOOD:
THE BLOOD IS CRASHBOX 23/0 again (D1 waits for WORLD's read on every row; S1 reads job_danger.json; D6 the offer at the
job's read) and WORLD's THE JOB TELLS THE TRUTH, IN BLOOD 7/0 (J4 rho 0.94, the board painted the read, one layer). THE UI BELONGS TO THE
WORLD 35/1, the one red the known one on main (AUTO on tin). RED, NOT MINE, the same on a clean checkout of main:
THE JOB'S STARS S4 (the town's board read empty at Church).

## WEAK
The danger is still the stars' until WORLD's AUTO-played number lands; the blood is only as true as that number. The
soak at stage 8 is mostly one red with finger lines, flatter than the drips. The thumb sits under a long title's words at
stage one on the board (it is under them, they read). The phone's card had a first placement in mind and the phone's
jobs died the same round (212(d)); the map's job markers (212(d): 'jobs live on the town's board and the map's markers')
do not bleed yet.

## NEXT
WORLD sets data-danger on the board row and the offer when its number lands (NOTE on its board). Then the map's job
markers, if WORLD wants them to bleed.

[bb Battle Brothers draws a contract's danger as one to three skulls and Paolo called it the weak point because the
skulls lie; ours draws it as the button itself, one continuous scale from one number, and the number is meant to be the
fight played out.]
[analog horror: the job button is a tin plate somebody pressed with a bloody thumb; the worse the job, the more hands
have been on it, until the plate is red clay to the rivets and the words have been wiped clear to be read.]

# ALSO THIS ROUND: EYES' CREW SCREEN NOTES (q11, k02, q27)

THE FIGURE HOLDS HIS GUN (slices/BOHEMIA_ROSTER_SCREEN.html, __HE_WEARS_WHAT_HE_WEARS__). Measured first on the demo:
every man on the crew screen stood in the idles' bare set, whatever his main hand held; the fight lays a pistol man's
one-hand hold (slices/rig_hold, PIdle, with its pistol layer) and a long gun's carry set with its gun layer
(slices/rig_idles). Now the crew card draws the same: the fight's own class table (fight_rig.json guns.by_class: dagger a
pistol, crossbow a rifle, firearm a shotgun) names the gun his main hand holds, and the card plays the same sheets the
fight plays, on the fight's own two-bar slots; a swap redraws him at once (the card is rebuilt). Seen on the computer:
YOU and Desi hold their pistols low in the right hand, Raul his crossbow-rifle. What the fight does not draw yet (a
shield, armour, a helmet as layers: COOK's models and ANIMATION's layers, rule 177(b)(c)) the card does not draw either.

THE FATIGUE IS ONE NUMBER. Measured on the demo after RUN TWO's 154cd8c0: the crew screen's FATIGUE equals the fight's
fatMax for every man (78/78, 77/77, 83/83 on one run; 80/80, 75/75, 85/85 on another): EYES' 118 against 55 was the old
screen before RUN TWO's worn(); now a gate holds it.

THE CAMP'S CLOCK: the camp wears the one bar since a0de7409, so 'DAY 1 12…' is gone; its place read the camp's clock (the
day twice, an hour behind); it reads CAMP now.

GATE: THE CREW FIGURE HOLDS HIS GUN (new, in the suite) 6/0 (phone and computer, one plant). ALSO GREEN: THE COMPANY
SCREEN, BATTLE BROTHERS SIMPLE 48/0, THE ROSTER SCREEN 15/0, THE SHOP SAYS WHAT IT DOES TO YOUR MAN 10/0; EVERYBODY IDLES
40/1, the one red the same as main (the fight's enemies without idles).

# ALSO THIS ROUND: [eyes: the blood on the words] (EYES 10/26 round three, k17, q17, k18)

EYES on BUILD 10/26d: a round clay blot on the first letters of a title and the giver's name ('B●ing medicine...'), the
offer's 'Take it' reading '●e it', and the row's stars over the price's first digit. MEASURED on this tree first: with one
blood the thumbprint landed under a long title's last word (the face pushes it to the title's column). NOW
(__THE_WORDS_ARE_WIPED_CLEAN__ in the materials): the clay is cut away under every line of words, every star and every
small picture on a bled button, a point and a half round each, as one exclusive mask on the clay (holes merged first),
worked out again when the button's words, size or fonts change (a ResizeObserver, a MutationObserver on the button, the
fonts' ready). At stage 8 the words sit on strips of the button's own clean paper inside the soaked clay, the way a thumb
wipes a label to read it. The halo stays from stage 1 for anything the mask cannot see. The stars over the digit were not
reproduced on this tree (W2 reads star boxes against word boxes at every stage).
GATE: THE BLOOD IS CRASHBOX 30/0: W1 at all eight stages, on the glass, 0 red clay pixels inside any word on a board row,
and the offer's Take it soaked (65 to 67 percent of the button red) with 0 red in its words; W2 no star over a letter; the
clay left uncut under the words planted and caught (832 red pixels in the first word).

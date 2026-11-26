# HOME BASE 4 -- 11/26 -- THE GRINDER, ON PURPOSE, BOTH WAYS; HIS PLACE NEVER CHOPPY; ONCE, EVERYWHERE

The routine: VAMILY. HOME BASE 4 took over from HOME BASE 3 (HANDOFF READY). Rules 480, 481, 482. Ask rows 733, 729, 721.

## 1. RULE 481(b), HIS NO ON THE GRINDER'S SCREEN (ask row 733)

HIS WORDS (the VOTE tab 11/25, home-base-the-grinder-11-22, NO): 'Bro, this has to be made for horizontal and vertical phone wielding
when it's when the phone is vertical. It looks like dog shit... sideways like you didn't even try that you didn't even try bro you
literally didn't even'.

MEASURED BEFORE, on the demo (records/target/home_base/vote_the_grinder.webp, re-shot this round):
- SIDEWAYS (844 x 390): the footage stood in the left 553 px; the right 291 px were black (the phone's column, and the phone steps aside
  when a sheet opens); the grinder's sheet, the whole glass wide, lay over the bottom 40 percent of the footage, right on the lot where
  the grinder stands; GRIND was a 900 px bar with its label at one end and '1 BODY -> 26' at the other.
- UPRIGHT (390 x 844): the grinder was a dark smudge 46 px wide in the middle of a 693 px frame; the sheet covered the street below it.
- BOTH: nothing on the footage showed the dead waiting; the piece pictures carried a speck each (below).

NOW, THE STATION (slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_STATION__): a tap on anything of his is a station.
- THE CAMERA ZOOMS ONTO THE LOT: a digital zoom of its own footage (the security camera's own move), the lot and what stands on it about
  two thirds of the view, never past three times the plain picture; tracking brackets round it with its name ('GRINDER', 'FORGE',
  'TRAINING YARD', 'LOOKOUT'), 'ZOOM 2.5X' under the camera's name; it glides in and glides back out when the sheet shuts. Measured:
  upright 2.5x on the grinder's lot, sideways 2.3x to 3x.
- SIDEWAYS: the sheet is a COLUMN in the black where the phone stood (36 percent of the glass, 280 to 380 px), the whole glass tall; the
  footage zoomed into everything left of it; his line at the top; GRIND and BUILD MORE at the bottom of the column, under the right thumb;
  GRIND is one big centred press (the word, then '1 BODY -> 26' under a dashed rule); the yard's men and the carts two across.
- UPRIGHT: the sheet under the footage (never over half the glass), the footage zoomed into what is left above it; GRIND the gold-edged
  press; the yard's men two across.
- THE DEAD WAITING LIE ON THE GRINDER'S LOT: tarp bundles tied twice, as many as are waiting (three on the ground, two on them, one on
  top, six at most), each with its shadow, in the footage's own light; ground, they are gone from the footage.
- The footage and the sheet never overlap, either way (gate F9).

THE SPECKS (rule 479(a), the art): every one of the 2,232 piece pictures carried a speck of 9 to 48 px well under the piece's foot (the
pipeline's shadow subtraction, al - E0, leaving residue against the empty block), and each picture's cut ran down to it: the grinder's
picture was 72 x 105 for a piece of 39 x 24. On the footage each speck sat on the street in front of his place. The pipeline now cleans
and cuts every piece it makes (tools/bohemia_home_settlement_pipeline_11_3_26.py _no_specks, in post and post_add; the command `specks`
cleaned the 2,232 already made: 46,944 px gone, every picture cut to its piece, xy unchanged). The dark puddles that stay in the street
are the fan palm's shadow under CAM 1's street light: the 11/3 near layer, his yes.

## 2. RULE 480(c), HIS PLACE NEVER CHOPPY (ask row 729: the door in froze 1,317 / 1,100 ms, CAM 2 1,033 ms)

FOUND (a CPU profile on the demo, the CPU slowed four times): (a) the footage, a picture that changes six times a second, was painted whole
every frame, every person through a canvas colour filter; (b) THE TOWN'S OWN PICTURE kept drawing every frame UNDER the footage, which
covers the whole glass: its draw and its people were about 1 s of every 3 (drawPeople 951 ms, fill 861 ms) while the footage took
215 ms; (c) a camera cut loaded and decoded the next camera's pictures in the middle of the cut.

FIXED: the footage is painted when its frame turns or something on it changed, and laid on the glass then or while the camera moves;
each person's graded picture is made once per size; the town rests under the footage (keeping who stands there and what is heard four
times a second, the way it already rests under the scavenge game); every camera's plates, lens layers and his pieces are fetched and
decoded a few at a time while the phone is idle, so a cut only lays down what is ready.

MEASURED (tools/bohemia_home_base_his_place_on_a_slow_phone_11_26_26.js, the demo, CPU 4x; this box draws with a software GPU, so the
frames a second compare, they are not his phone's):

| step | upright before | upright now | sideways before | sideways now |
|---|---|---|---|---|
| the door in | 3.2 fps, worst 750 ms | 5.4 fps, worst 650 | 2.9 fps, worst 817 | 7.0 fps, worst 533 |
| standing | 4.7 fps, worst 667 | 15.6 fps, worst 367 | 5.7 fps, worst 717 | 16.9 fps, worst 417 |
| a camera cut | 5.5 fps, worst 283 | 30.2 fps, worst 83 | 4.8 fps, worst 2,367 (a task 2,278) | 37.1 fps, worst 100 |
| a second cut | 7.7 fps, worst 200 | 29.8 fps, worst 67 | 9.0 fps, worst 150 | 36.5 fps, worst 50 |
| the grinder's station opens | 5.7 fps, worst 300 | 23.6 fps, worst 183 | 6.9 fps, worst 350 | 31.0 fps, worst 133 |
| it shuts | 8.2 fps, worst 150 | 25.1 fps, worst 83 | 10.6 fps, worst 133 | 35.1 fps, worst 50 |

WHAT STILL STALLS AT HIS PLACE IS NOT HIS PLACE'S (the same profile): the job planner (engine/bohemia_job_danger.js planSlice / fightsFor,
about 1.2 to 2.2 s of every 3 at 4x, with the street board's setup / dealBoard / housesIn), and the phone's job board app (slices/
bohemia_phone_board.js paint -> asks -> bohemia_board_shelf.js pick -> job_danger read/fits/fightsFor: one task of 2,843 ms upright, 2,400
sideways, a freeze on whatever screen is up); the idle sheets' warm-up (bohemia_idles.js warmOne, getImageData 421 ms); nothing_pops'
checkVisibility (190 ms). ROUTED: JOBS 2 (the planner and the phone's board, rows 730 and 731), PLUMBER 8 (the idles' warm-up), UI FIVE
(nothing_pops). The door's own first paint still loads his place's pictures at the door (a task about 220 to 460 ms).

## 3. RULE 479(c), COUNTED EVERYWHERE (ask row 721: 'the cook... repeat like 20 times')

COUNTED on the demo, upright and sideways, his place planted with four buildings, the cook, the blacksmith and the surgeon hired (the cook
pushes his cart behind him on the map, rule 471: a cart's wire sides and the cook are 'these walls and then an actual cook guy'):
- THE MAP, eight zooms from the farthest (0.107 upright, 0.181 sideways) to the closest (4.741), walking and camped: he once at every
  zoom; camped, his two men twice and the three staff three times (each once); walking, standing still, neither drawn (MAP_DREW youCount,
  company, campAt). Looked at by eye at every zoom: one of each.
- EVERY SETTLEMENT, the fourteen and his place: each person once (by who they are and by name) and each door once; 13 to 24 people a
  town, 8 to 10 doors; his place's footage each thing and each person once.
- THE CAMP: each of his people once (five: two of his men and the three staff).
- HIS THREE CAMERAS, both ways: each thing once, each person once (gate F8 since 11/22) and one bundle per body (gate F9 this round).
NO REPEAT WAS FOUND. Two things on the map could stack by design and were read: THE POT's COOK verb leaves its fire on the block every time
it is used (slices/bohemia_bosses.js S.marks, every mark painted for good: twenty days of cooking, twenty fires; the fire prop has no
person in it) and the camp's staff on the map (MAP_CAMP.most 4, one per hire). ROUTED to BOSSES: the cook's marks pile up for good, one
per use; one fire per block at most, or only the last few, is theirs to decide.
THE CHECK STANDS: gates/once_everywhere_gate.js (ONCE, EVERYWHERE), in the registry; planted repeats (a person handed twice in a town, him
drawn twice on the map) read red.

## GATES (pre-push pass, the gates that read the files in this diff)
- YOUR PLACE, PLANTED (gates/home_base_gate.js) 238/0 both ways (was 226): F9 THE STATION (the zoom onto the lot, the sheet laid for the
  way the phone is held, no overlap, the presses 44 px on the glass; planted: the station off reads red), the bundles one per body, the
  camera back out on shut, the footage painted 12 times in 2 s standing still (planted: every frame, 95 to 110, red).
- HOME SETTLEMENT (gates/home_settlement_gate.py) 15/0 (was 13): S8 no speck in the street on 2,232 pictures; planted speck red.
- ONCE, EVERYWHERE (gates/once_everywhere_gate.js), new.
- Full suite unmeasured by this lane (rule 13).

## THE VOTE CARD
home-base-the-grinder-on-purpose-11-26 (records/target/home_base/vote_the_grinder_on_purpose.webp, by
tools/bohemia_home_base_the_grinder_on_purpose_card_11_26_26.js): BEFORE, the 11/22 screen he said NO to, upright and sideways; NOW, his
place, the tap on the grinder, GRIND, both ways, and the camera back out. Its first picture is the sideways one he named.

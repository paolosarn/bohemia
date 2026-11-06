# THE BAR ON THE WALL (DIRECTION, 11/6/26; rule 408(a), rule 411; ask line 455)

His words, 11/4 (rule 408): 'every time I see you make art a lot of times it's just placeholder shit... I just want the
first time you make art to be the final... you have to know how to help yourself.' Rule 408(a): his starred pieces are the
look bible every new piece is put beside before he ever sees it.

THE SHEET: records/target/direction_bar/THE_BAR_ON_THE_WALL.webp (2072 x 2516, lossless, 1.1 MB). Every piece on it is cut
from a committed render at one art pixel to one sheet pixel (a few also at 2x, like his phone). Nothing was drawn for it.
THE LIST: records/target/direction_bar/THE_BAR.json (every piece's key, source file, crop box, scale and his words). A lane
uses a piece by its key; the source path is the twin it hands the look tool.

This page is the look bible's front page. The long rules stay where they are (the analog horror bible, the style guide,
the card of numbers); this page is the short answer to "what does good look like here", in his own marks.

## HOW TO USE IT (every making lane, every piece, before VOTE)

1. Find your kind in the table at the bottom. Open the bar piece's file.
2. Put your piece beside it at one pixel to one pixel, on the ground it will stand on, with the look tool:
   `python3 skills/bohemia-pixel-art/scripts/look.py <yours.png> <family> --twin <the bar piece's src> --saw "..." --fix "..."`
3. Write ONE line on your card: "beside the bar: BETTER / SAME / WORSE, because ...". WORSE does not go to the VOTE tab.
   SAME goes only if it does something the bar piece does not.
4. Your kind has no bar piece yet (a weapon, a beast, a landmark, a house through the rig)? Then your first piece IS the
   golden piece of its kind (records/BOHEMIA_DIRECTION_THE_FIRST_TIME_IS_THE_FINAL_TIME_11_6_26.md, part 3). Hold it to
   the nearest bar piece's reasons (below), and make ONE, not a batch.

## THE STARS (his highest mark; two ever, in 769 verdicts)

### STAR 1, 10/18: THE POACHER'S FACE (PORTRAIT, e99ecba; VOTE portrait-the-poachers-face-from-the-same-model-10-18)
His words: 'You might change the game with this one big star event... this is the first star I've handed out.'
File: records/target/portrait/rig/poacher/rig_portrait_S.png (and the sheet PORTRAIT_THE_POACHERS_FACE_FROM_THE_SAME_MODEL.png).

WHY IT WORKS, in plain words:
- It is a real head with a real shape. A brow over deep eye sockets, a nose, cheekbones, a chin. The sun falls across it
  from one side, so it has form. The face it replaced was a flat 64 px drawing; this one is 128 px from chin to crown.
- It is HIS head. It sits on the same 3D model as his body, so the face and the body are one person (ONE ID, ONE WHOLE
  PERSON). His black curls come out from under his field hat. The hat is pushed back so you can see his eyes.
- It is a little wrong, on purpose. Clay skin, a lopsided mouth, eyes that do not quite look at you. That is the
  Crashbox look he named (rule 115(d)): faces simple and a little wrong, clay that still looks like clay.
- It talks. Four mouth shapes and three moods from the same head.

THE NUMBERS (EYES measured them, records/BOHEMIA_EYES_THE_STAR_IS_THE_BAR_10_18_26.md): eyes 35.2 px apart, 44.0 px from
the eyes to the jaw, lit from 123 degrees, 16,007 colours over eight shots, both pupils readable (29 and 28 levels darker
than the ring around them). The tool tools/bohemia_eyes_the_star_is_the_bar_10_18_26.py holds every new face to these.

WHAT IT TEACHES: make the face from the same source as the body, with one light and real form, and let it be a little
wrong. And what it does NOT teach: its moods move only the mouth (EYES' finding), so the star was not for the moods.
His later rule: a fresh portrait with its own camera, never a zoom on the body's model (rule 115(h) amended).

### STAR 2, 11/2: THE LOADING SCREEN'S THREE CAMERA FEEDS (UI, e11c0ca8; VOTE ui-the-loading-screen-three-feeds-11-3)
His words: 'Why not all 3? The view of the city could be better but I'm really impressed. This is one of the few things
you did on your own. That is extremely impressive. This is getting a star.'
Files: slices/crashbox/feed_a.webp, feed_b.webp, feed_c.webp (the camp on tape, the pawn lot on CCTV, the road in on the
truck's dash camera); now ten feeds, tall and wide, records/BOHEMIA_UI_THE_CAMERA_FEEDS_11_3_26.md.

WHY IT WORKS, in plain words:
- An ordinary place, at night, seen through a camera nobody is watching. A fire in a barrel. A parking lot. A dead
  freeway. Nothing jumps out at you. That is the bible's first rule: the ordinary frame with ONE wrong thing (a coyote
  standing in the dying lamp light; one block lit in a city of dark towers).
- The camera is part of the picture, not a filter on top. CCTV grey, interlaced, six pictures a second. Warm VHS that
  drifts in a hand. It was baked into every frame from the start (bible rules 8 and 10: diegetic or dead, grime is baked).
- It is built from the game's own models, so it looks like the game and not like a stock photo.
- It has a job. The loading bar is gone: the camera's own battery charges, its signal comes in, the miles to Vegas count
  down. You wait inside the story.
- It has its own real sound (fire, wind, crickets, a far siren), quiet (-33 dB).
- It was one whole idea, finished: picture, motion, sound and purpose, the first time he saw it. 'One of the few things you
  did on your own.' Nobody patched it from his notes.

WHAT IT TEACHES: start from a reason (who is filming, why nobody is watching, what one thing is wrong), then make every
part of it serve that reason. THE WARNING NEXT TO IT: the same idea on the settlement screen one round later (home's three
cameras, 11/3) came back 'Looks like shit' and 'these camera angles aren't intimate'. It copied the trick (a camera) and
lost the reasons (close, ordinary, one wrong thing, a camera that belongs there). A recipe carries the reasons, not the trick.

## THE METHOD HE FELL FOR, 10/17: THE CLAY ROBOT AND THE TRUCK (DIRECTION's master rig, 5efc414 and 2c4c148a)
His words: 'you made a truck and a robot and I fell in love, this analog 3-D, HBO early kids show kind of vibe, I love that
art direction'; 'Holy shit you're making like 3-D looking 2-D sprites. I think we have to do that for the rest of the game.'
Not a star (the button did not exist yet), but it became rule 115: every character, beast, vehicle and prop is made this way.
Files: records/target/master_rig/robot/rig_<facing>.png; records/target/direction_the_truck_turned_up/truck/rig_S.png.

WHY IT WORKS, in plain words:
- It is one real object, modelled in 3D, then drawn down to pixels by one camera (45 degrees, never turned) under one
  sun. So it looks the same from all eight sides, because it IS the same thing from all eight sides.
- It is the right size. 57 pixels a metre, beside a 1.72 m man who is 98 px tall.
- It looks handmade. Matte clay, dirt baked into the creases from the model itself, dust on the top surfaces, a bit of
  tape. Nothing shiny, nothing glows.
- It moves like stop motion. A walk is 6 drawn poses (two beats at 120), an idle is 12 (four beats); nothing between two
  poses is drawn, so it holds and snaps like clay.
- Everything else can come from the same table: the same camera, sun and dirt made a man, a fox and an oil drum look like
  they live in the same world (the everything-the-same sheet, 077f30f).

THE NUMBERS: robot 5,871 colours, 149 px long side, value span 119, saturation 0.43; one row out of eight on the card
(grain 2.25 px a run against a bar of 2.22). About 7 percent of its pixels were touched by hand after the render.

WHAT IT TEACHES: one source for everything. AND ITS WARNING: the first truck read as 'a plate toy'. Its shape was a toy's
(1.87 long to wide on big wheels); the fix was a real pickup's proportions (2.72). Before the clay, get the real shape.

## HIS LOVE WORDS (a YES with "love" or "amazing" in it; the second row of the wall)

| piece | his words | file | what it teaches |
|---|---|---|---|
| the thug through the rig (COOK THREE, 021822b) | 'it's so bad. I actually kinda like it... analog horror AI slop and I love it' (10/18) | records/target/cook3/rig/thug/rig_S.png | a padded coat as a real shape that catches the sun, colours from the one palette: the robot's way works on a man |
| the thug's face (PORTRAIT, fe97919) | 'i love this direction ai slop gore horror analog amazing vibes' (10/18) | records/target/portrait/rig/thug/rig_portrait_S.png | the poacher's recipe was not luck: it worked twice |
| his BOHEMIA letters, no card (UI, 90bd03cc) | 'Not final but fucking amazing direction' (10/18); his brother: 'the start screen is the best part' (rule 400) | records/target/ui_front_screen/after_upright_title.png | less: his own letters on a cold dark ground, one lit block, only the next press in gold |
| the town is alive (ANIMATION, 235e6d9) | 'This is perfect I love it' (10/9) | slices/vote/ANIMATION_THE_TOWN_IS_ALIVE.html (a page; NOT on the sheet) | people doing small ordinary things (smoke, wait, haggle) who look up and wave when your finger comes near |
| one real street (COOK TWO; became the floor bar 852c4cf8) | his YES, no words (10/18) | records/target/COOK2_ONE_REAL_STREET.webp | the ground is his packs at 1:1, laid like a real street; six numbers in the style guide hold every floor to it |
| the plain ranch in the valley tans (COOK FOUR) | "That's way better holy shit" (10/18) | records/target/COOK4_THE_FAMILY_IN_THE_VALLEY_TANS.png | his pack house, the roofs moved into the valley's tans (never bright orange or metal blue) |

And for motion as a whole, rule 246(e): 'I'm proud of the way you've been animating things so far... this Bohemian Crashbox
HBO style, I love it.'

## THE OTHER WALL (what he hated, and the one reason each; a look bible carries its don'ts)

| piece | his words | the reason, in one line |
|---|---|---|
| DIRECTION's wrongness, 15 elements and 20 pictures at once (11/2) | 'Bro wtf is this horseshit' | a batch with no golden piece first; this lane broke 408(b) one round before it was written |
| home's three cameras (11/3) | 'Looks like shit'; 'these camera angles aren't intimate' | the starred trick without its reasons |
| the Strip as a fight place (11/3) | 'this is breaking my heart the most... This does not look like a strip' | it did not look like the real place it names |
| fifteen fight grounds (11/2) | 'Dogshit' on 8, 'Work in progress' on 14 | 'straight lines at grid borders, colours that end abruptly, roads that don't connect' |
| armour you can see (10/9) | 'incredible dog shit, good idea, but terrible implementation' | the idea passed, the pixels did not |
| the grey dire wolf (10/17) | the ugliest; 'the fox looks way better' | a beast needs its own real body, not a grey dog |
| four legs (10/9) | 'it looks like a seventh grader coded it' | drawn in code, not modelled |
| the first truck (10/18) | 'too much like a plate toy' | a toy's proportions |

## THE BAR, KIND BY KIND (the twin to hand the look tool)

| kind | the bar piece (key in THE_BAR.json) | status |
|---|---|---|
| a screen (its picture) | screen_feed_a, _b, _c (STAR 2) | HAS A BAR |
| a screen (its type and layout) | ui_front_screen | HAS A BAR (love words, not a star) |
| a man's face | face_poacher (STAR 1), face_thug | HAS A BAR |
| a man's body | body_thug_S, and the robot's method | HAS A BAR (love words, not a star) |
| a vehicle | truck_S | HAS A BAR |
| the ground | ground_one_real_street (the floor bar) | HAS A BAR |
| a house on the map (his packs) | house_plain_ranch | HAS A BAR (pack way only) |
| a house through the rig | none | NO BAR YET: the first one is the golden piece |
| a weapon | none | NO BAR YET (nearest: the robot's clay and the thug's coat) |
| a beast | none | NO BAR YET (nearest: the robot's method; his fox over the grey wolf) |
| a landmark (Seven Magic Mountains first, rule 410(f)) | none | NO BAR YET (COOK FOUR's golden piece) |
| motion | the town is alive (a page) | HAS A BAR (not on the sheet: it moves) |

## REFERENCE CHECK (the 9/4 duty)

Compared to the world: every piece on the sheet is his own starred, loved or YES'd art, on file. No reference game is
cited; Crashbox is the look bible's named reference (art only, rule 115(d)), Battle Brothers is not used for the look. No
pixel was drawn or changed for the sheet; the crops and scales are in THE_BAR.json. Purple: measured 0 px (and 0 lava, strict
and suspect) by gates/bohemia_purity_gate.py check_png on the whole sheet.

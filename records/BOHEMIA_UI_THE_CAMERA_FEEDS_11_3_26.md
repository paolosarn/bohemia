# UI 6: THE CAMERA FEEDS, ALL OF THEM, TALL AND WIDE, FOUR THINGS ON THE START SCREEN (11/3/26; rules 342 and 348; ask lines 351, 358)

His words. 11/2 in the VOTE tab, THE SECOND STAR EVER, on UI 5's three loading screens: 'Why not all 3? The view of the city could be
better but I'm really impressed. This is one of the few things you did on your own. That is extremely impressive. This is getting a
star. Why don't we just have as much of these as possible to really build that lore ambience?' (rule 342). 11/3, while this round
ran (rule 348, the coordinator re-briefed this chat mid-round): 'I want two versions one vertical one horizontal 16 equals nine or
nine equals 16... first person view vibe... the word Bohemia underneath that just only have post economic apocalypse new game and
continue... not super loud... full screen... I don't even want settings... you close the game open it back up and then it's a
random roll... that analog horror crash box HBO series feeling'. The 9/20 law: analog horror at the source. Rule 337: assets first.
Rule 297: tokens. Everything measured on the cut demo, his phone upright (390 x 844) and sideways (844 x 390).

## WHAT HE SEES NOW (THE DEMO'S FIRST SCREEN)
- THE WHOLE GLASS IS A CAMERA'S FEED, first person: you are looking at the camera's own monitor, its readout in its corners (the
  camera and the place, REC on two beats of four, the clock or the tape counter, and the camera's own reading of the load: a
  battery charging, a signal coming in, the miles to Vegas).
- FOUR THINGS ON IT (rule 348 (b)): his letters BOHEMIA, POST-ECONOMIC APOCALYPSE under them, NEW GAME, CONTINUE. Gone: SETTINGS
  (the settings live on the phone once he is playing), the line under each choice (PICK YOUR CREW, NO GAME SAVED, the day and
  hour), '- LAS VEGAS', the build text. His NOTES button stays (his, not the game's). The build stamp is still in the page and on
  the picks screen after NEW GAME, never on the start screen.
- A RANDOM ROLL (rule 348 (e)): a different feed every time the game opens, never the one he saw last (the last one is kept on the
  phone). Sit on the screen and after 40 seconds the monitor cuts to the next camera: the picture loses sync and rolls up over a
  black bar for two holds, one picture of the switcher's snow, the next place; its own sound comes up with it.
- TWO WAYS (rule 348 (a)): every feed is made twice, TALL 432 x 768 (9:16) and WIDE 768 x 432 (16:9), each its own composition
  (its own lens and aim), the subject kept inside the middle so the cover-fit's bleed can cut any edge: no bars, no stretch, on an
  upright phone, a phone on its side, a laptop. Turn the phone and the picture made for the new shape comes up through the old one
  over four holds on the music's grid (rule 324, never a jump).
- QUIET (rule 348 (d)): every feed's sound at -33 dB rms (UI 5's three were -27 to -29; brought down 6 dB so all ten sit together).

## THE FEEDS (tools/bohemia_ui_the_camera_feeds.py; the way is UI 5's and the master rig's)
Each a real place of the valley filmed by a camera nobody is watching, built from the game's own models (reference/models/bohemia,
COOK PROPS' fight_props, the beasts with their own clips), lit at night in Cycles on the CPU, every material through the rig's
SOURCE PASS, the rig's POPULATION SNAP, then THE MEDIUM baked into every frame: no noise layer, no filter on the page.
| | the place | the camera (the medium baked in) | the one wrong thing | the camera's corner | reading the load |
|---|---|---|---|---|---|
| a THE CAMP ON TAPE (UI 5's, re-shot) | the crew's camp: the fire in a barrel, the truck, the tyres, the sandbags, the shed | a camcorder held by one of the crew: VHS, warm, the hand drifting | | REC, the tape counter | the battery charging |
| b THE NIGHT CAMERA (UI 5's, re-shot) | the pawn shop's lot, the gas station behind, a stop sign | a security camera on a pole: CCTV grey, interlaced, six pictures a second | the sodium lamp dying twice a bar, a coyote standing in the light | CAM 03, PAWN · LOT, the clock | the signal, the tear |
| c THE ROAD IN (RE-SHOT) | the dead I-15 into the Strip | our truck's dash camera: VHS, cold | one block lit, pane by pane, in a city of dark towers | REC, the tape counter | the miles to Las Vegas |
| d THE INTAKE | Lake Mead low: the intake towers standing in the water, the moon on the lake | the dam's own camera: CCTV | one red light still blinking on a tower | CAM 07, INTAKE · LAKE | the signal, the tear |
| e THE PENS | the lab yard: cage three burst from inside, the decon shower, the gurneys, the fence and its gate | a trail camera's infrared: white-hot, the flash falling off into black | the cold-store truck's panel still lit; a dire wolf standing in the yard | TRAIL 2, LAB · PENS, the clock | the battery |
| f THE APRON | the airport: the plane on its belly, the jet bridge to nothing, the fuel truck, the baggage carts, the hangars | the tower's colour camera: crushed black, the highlights bleeding along the line | the one mast light failing; a mountain lion on the painted lines | CAM 22, APRON · GATE C, the clock | the signal, the tear |
| g THE FLARE | the landfill: the methane flare over the trash mounds, the wells, the dead dozer, the fence | a camcorder left on its tripod: VHS, warm | the flare still burning (the dogs only heard) | REC, the tape counter | the battery |
| h THE MARKET | a town's market after closing: the stalls under their tarps, the carts, the drums, the trailer | a colour camera over the stall | one bulb of the string still lit; a dog asleep by a table | CAM 01, MARKET, the clock | the signal, the tear |
| i THE PYLON | the open desert: a power pylon down across the sand, Joshua trees, boulders | a camcorder dropped in the sand, still recording, tilted 9 degrees, its lens at the ground | the buried car's headlights on | REC, the tape counter | the battery |
| j THE FOUNTAIN | the Strip at a casino's porte-cochere: the dry fountain, the fallen sign, the limo, the bridge over the boulevard, the towers | a security camera: CCTV | one bulb of the fallen sign's hundred lit, on a bad contact | CAM 12, FOUNTAIN, the clock | the signal, the tear |
Each feed's picture is cut from the game's models only (REUSE-FIRST): no new model was made for a feed. A CCTV or trail camera takes
six pictures a bar held on twos (six frames a sheet); a tape twelve. Sheets 54 to 115 KB each; a phone asks for one (the shape it is
held in) when the title is built, and the next camera's 8 s before the cut.

## THE CITY, RE-SHOT (rule 342 (c), his 'the view of the city could be better')
| | UI 5's (390 x 520, a box under the letters) | now (tall and wide, the whole glass) |
|---|---|---|
| the towers | five, 1.1 to 1.4 km off, a thin row on the horizon | twelve towers and four casinos 180 to 640 m off, filling the middle third, every one dark |
| the one lit block | 35% of one tower's window objects, a few dots | one tower's glass lit in whole bays floor by floor (pane by pane, never a triangle: a pane is one island of the mesh), amber |
| the skyline | none to read | the needle with its pod and a red beacon blinking on the beat, the black pyramid to the south |
| the freeway | two lanes, the posts | three lanes and the far carriageway, the jersey wall down the middle, the freeway's lights dead every 48 m (the loop never jumps) |
| the sky | a faint glow | the dead city's sodium on the cloud floor behind the towers, so they stand dark against it |
The tower model is 886 pieces; it is imported once, joined to one mesh and copied (ten thousand objects became sixteen).

## SOUNDS (tools/bohemia_ui_the_camera_feeds_sounds.py; CC0 recordings, nothing synthesised)
| | sound (all at -33 dB rms) | sources (CC0) |
|---|---|---|
| a, b, c | UI 5's three, brought down 6 dB | the fire, the wind; crickets, the ballast, the siren; the diesel, the wind |
| d | the lake slapping the towers (two splashes slowed to a lake's weight), the wind over the dam, one rifle shot far across the water | Adam_N x2, toiletrolltube; the Free Firearm Sound Library's far shot X_31 |
| e | something breathing and sniffing at the trail camera, close; the reefer's compressor far; the flies | kd_jack 'Werewolf breathing and sniffing'; MrAuralization; the flying insects |
| f | the wind across the concrete, a helicopter over the valley that never comes closer | toiletrolltube; kerouac21 |
| g | the flare's roar (a fire slowed to a gas flame), the dogs fighting once far off, the wind | kingsrow x2; polipa; klangfabrik |
| h | the moths at the one lit bulb, a stall's board creaking, a cat far down the street, the wind | the flying insects; Ryding; Zabuhailo; toiletrolltube |
| i | the wind on a dropped camcorder's mic, its low rumble, the buried car's horn once, weak | klangfabrik; toiletrolltube |
| j | the freight line behind the Strip, a train's metal far off, the wind down the boulevard | felix.blume x2; toiletrolltube |
Every source line is in slices/crashbox/feed_sounds.json, copied from the bank's own licence table.

## NOT SLOWER (the brief's step 4)
Measured on the cut demo, his phone upright (390 x 844, 3x, touch), the CPU slowed four times like a phone, a local server, three
runs each, main's files against mine served side by side (tools in the scratchpad: the same page, only the three UI files swapped):
| | main (UI 5: one 390 x 520 sheet, under the letters) | now (one tall or wide sheet, the whole glass) |
|---|---|---|
| the start screen's two choices on the glass | 4235 / 4785 / 4872 ms, median 4.8 s | 4166 / 4905 / 5016 ms, median 4.9 s |
| the first camera picture painted | 599 / 703 / 744 ms, median 0.70 s | 597 / 690 / 802 ms, median 0.69 s |
| the picture asked for | feed_b.webp at 383 to 574 ms | the one feed's tall sheet at 409 to 685 ms (after the first paint at 120 ms) |
No change outside the run-to-run spread (0.8 s). A phone asks for ONE sheet (54 to 115 KB, the shape it is held in); the other
shape only if it turns, the next camera's 8 s before the cut. All twenty sheets together are 1.67 MB on the site; a phone never
loads more than two of them in the first 40 seconds.

## CHECKS
- LAST PIECE (the coordinator's queued notes): THE LOADING MENU IS FROZEN 10/0 with F5 SILENCE (rule 361: on the demo's start screen,
  after a real tap, only the camera feed's own ten-second loop starts; a planted sound is caught); the bar's two checkers that still
  read the NOTES button (THE BAR FITS HIS GLASS, THE BAR SAYS THREE THINGS) re-aimed to the bar's rightmost piece and to a bar with
  no NOTES. Seen at 430 x 932 (a tall phone) and 1440 x 900 (a laptop): the picture fills the glass, no bars, no stretch, the words
  readable (the laptop draws his letters at twice the pixels, the placement carried from 844 x 390).
- ROUND TWO (rules 357, 358), on the rebased tree: THE CAMERA FEEDS 25/0 (C10 nothing behind, C11 all twenty screens worst 4.7 to 1 in the
  sun, C12 NOTES gone, every plant caught), THE FRONT SCREEN 42/0 (twice, two random feeds), THE START SCREEN 12/0, THE PHONE (main's,
  the coordinator's re-aim), THE DAYS ONCE 59/0, THE LOADING MENU IS FROZEN 8/0, THE MENU HEARS ONLY ITS FEED 4/0, DEMO BUILD 25/0, HANDOFF
  10/0. Reds the same on main, run on main's files this round: THE CUT IS THE FOUR THINGS (the fight still starts), NO TOP BAR IN THE
  FIGHT (its bar plant), ONE HUD EVERYWHERE (the town's board covers four presses, and its plant), THE PHONE TURNS (reads the old phone).
ROUND ONE (the feeds):
- THE CAMERA FEEDS (gates/the_camera_feeds_gate.js, new, in the suite): 19 passed, 0 failed (rolls on one phone: i a h b j d; the
  cut d -> h with feed_h.mp3; sideways the wide picture; the first paint 120 ms, the feed's sheet at 595 ms). Its plants all caught:
  a feed missing its wide sheet, a 4:3 sheet called tall, a loud sound, SETTINGS back on the title, the same feed twice running.
- THE FRONT SCREEN, JUST THE FONT: 42 ok, 0 failed (moved to two choices: J4's 11 px plant on the choice's word, J5 three words,
  J6's second-gold plant on CONTINUE, J7 two thumbs).
- THE SCREEN HOLDS THE LOADING: 27 passed, 0 failed. DEMO BUILD: 25 passed, 0 failed.
- REDS ON MAIN, NOT MINE, each run on main with the same result: THE START SCREEN'S LOOK (throws at its first leg, in the picks, before
  the title; its title legs moved to two choices anyway), VOTE TAB 48/4 (two dynasty whys, the alpha's landing, the gear's VOTE),
  PAGES PUBLISH 16/2 (the published surface over its cap, the handoffs/skills/tickets folders).
- The full suite unmeasured since PLUMBER's last line (rule 13).

## RULE 357, THE SAME ROUND: THE TEXT BELONGS TO THE PICTURE, AND NOTES IS GONE (asks 377, 378, 379)
His words (11/3, after the feeds landed): 'I am so in love with the loading screens. It's literally changing my life... remove the
Notes button from everywhere... the text on the screen, post economic apocalypse, new game, continue: I don't want an effect behind
them, a shadow box, a contrast box... wherever you place all the text moving forward it feels like it was meant to be placed there
by what's going on in the background behind it'; amended: 'the text is still obviously a menu overlay... I don't want you to make
graffiti of the text... very visible... not everything has to be at night time'.
- NOTHING BEHIND THE FOUR WORDS: no black ground under the line, no plate under NEW GAME (it was a gold plate), no box under CONTINUE,
  no marks beside the choices. The words are the game's type flat on the footage: his gold letters, the line and CONTINUE in the bone
  of his letters, the one next thing (NEW GAME, or CONTINUE with a game kept) in his gold at 20 points.
- THE PICTURE GIVES THEM THEIR PLACE: tools/bohemia_ui_the_camera_feeds.py --place reads every feed's own frames, cover-fit onto his
  phone upright (390 x 844) and sideways (844 x 390), and puts the title block and the two choices where EVERY frame keeps them
  readable by the front screen's own test (J5: 4.5 to 1 against the worse side of what is under the word, plain and in the sun; his
  letters 3 to 1), as near the usual place as that allows (the title high, the choices under the thumb); sideways each block takes the
  left or the right column. Stored per feed in crashbox.json (feed.options[k].words). Through a cut the words are off the glass with
  the snow and come back in the next camera's place; on the first load they wait for their place (never drawn in one and moved).
- NOT ALL NIGHT: the feeds run through the day: the camp and the flare at dusk, the market, the pylon and the fountain at dawn, the dam
  at a white noon, the airport apron in the afternoon's dust; the pawn lot, the road into the Strip and the lab pens stay at night
  (their identity is the dark). Each hour composed with a quiet place for the words: the dam's dark water at noon, the terminal's long
  shadow across the apron, the porte-cochere's dark underside over the fountain.
- NOTES IS GONE: off the title, off every bar the game draws (the map, the fight, the spoils: still built off the glass so nothing
  that held it breaks), and the phone has no NOTES app. Its two gates are in graveyard/the_notes_button_11_3_26/ with a post-mortem;
  eight gates that tested NOTES now hold that it is gone (the cut is the four things, no top bar in the fight, the days once, the
  phone, the phone turns, one HUD everywhere, the one screen, the top bar).

- WHAT IT TOOK TO MAKE THE DAY READ: the front screen's sun test (rule 73: the word against the worse side of what is under it, the
  picture whitened 25%) needs a place darker than about 52 out of 255 for bone and 32 for gold in every frame. The night feeds have it
  everywhere; the day feeds did not, so (1) the choices take bone where gold would not read, NEW GAME marked by its size (20 points
  against 13), (2) the dark ink is there for a light place (the finder never needed it in the end), (3) the day feeds' film sits under
  the night's: the camera's own exposure baked into the frames (the camp 0.74, the apron 0.68, the flare and the fountain 0.8, the
  pylon 0.42: a dark dawn). Measured on all twenty: every word 4.5 to 1 or better in the sun, his letters 3 to 1 or better.
- The two front-screen gates moved with it: J1's card is what the letters' own block adds to the glass (shown less hidden: footage has
  greys of its own), J6's one next thing is the gold word or the 20-point word (no plate), its plant gilds CONTINUE's word; J7 holds NOTES at 0; RUN's start-screen gate holds NO SETTINGS (T5) and NO NOTES (T6) and a CONTINUE that says only
  CONTINUE (T8).
- KNOWN, NOT DONE: the feel of (g) (MW2's Washington DC radio) was not re-made into these sounds this round; the feeds keep their
  own recorded sounds at -33 dB. The bar's NOTES is hidden, not deleted from the city's own file (other lanes' code calls it).

## RULE 358: THE LOADING MENU IS NEAR FINAL, AND NOW FROZEN (ask line 380)
His words (11/3): 'I'm in love with the loading menu, I can already see a lot of this being final final final.' What he asked is built
(348 and 357), and the menu is held: gates/the_loading_menu_is_frozen_gate.js (in the suite) fingerprints the four words, the start
screen's type and overlay (the 21 rules of its look) and how the feeds roll (the key, the 40 s cut, the preload, the roll, the snow,
the fade, the two shapes) against records/target/ui_the_loading_menu_frozen.json; a change fails unless a commit since the baseline
says NEW RULING (then --freeze re-records it in that commit); no feed may leave the roll; new feeds are welcome. 8 passed, 0 failed,
four plants caught (NEW GAME renamed, the cut at 30 s, a size in the look, a feed taken away).

## PROOF (records/target/ui_the_camera_feeds/)
A still of every feed, tall and wide (feed_<x>_<tall|wide>_still.png). The VOTE picture slices/vote/UI_THE_WORDS_BELONG_TO_THE_PICTURE_11_3.webp:
the real start screen on all ten feeds, upright and sideways, as the demo draws it (card ui-the-words-belong-to-the-picture-11-3).
The VOTE page: slices/BOHEMIA_UI_THE_CAMERA_FEEDS_11_3_26.html (every feed moving, tall or wide, tap to hear; the monitor at the top
cycles them every 8 s so the cut can be seen).

[bb Battle Brothers' loading screen is one painted scene with a line under it; ours is the valley through a different camera every
time, and the start screen is only the name and the two ways in, as Battle Brothers' own main menu keeps to its few words.]
[analog horror: the medium is the horror: the monitor cycling cameras nobody is watching, the sync rolling, one picture of snow; a
trail camera's infrared lighting a wolf's eyes; a camcorder lying in the sand still recording; every place carrying its one wrong
thing (the reefer still running, the flare still burning, the buried car's headlights on, one bulb of a hundred lit).]

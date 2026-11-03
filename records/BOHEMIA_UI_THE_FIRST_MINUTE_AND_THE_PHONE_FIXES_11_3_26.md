# UI 5: THE FIRST MINUTE (THE LOADING SCREEN, THE START SCREEN) AND THE PHONE'S SMALL FIXES (11/3/26, BUILD 11/3zzo)

The coordinator's brief (VAMILY, UI 5): rows 338 and 340 first, then 154, 133, 129, 161, 282 of
records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md, in the order of records/BOHEMIA_FINISHER_THE_OPEN_ASKS_11_3_26.md sections 1 and 3.
His words: 11/2 in the VOTE tab, NO on the loading screen (the Crashbox box with the tin robot), no words; YES on the start screen,
'Work in progress not final'; 11/3 'The start menu for demo is not final' / 'I don't like what you did to the menu'. Rule 66a (10/5):
'the loading shown as the camera's own feed, never a bar'. The 9/20 law: analog horror at the source. Rule 337: assets first.
Rule 297: tokens, nothing he did not ask for. Everything measured on the cut demo, his phone upright (390 x 844, 3x, touch) and
sideways (844 x 390).

## PUSH 1: THE FIRST MINUTE

### THE LOADING SCREEN (ask 338): THREE CAMERA FEEDS, MADE THROUGH THE MASTER RIG
The machine is gone (his NO). The loading screen is now a camera's own feed under his letters, and the camera's own readout says how
far the load is (the load's real count, #loadpct, never a number of ours, never a bar).
| | A THE CAMP ON TAPE | B THE NIGHT CAMERA (in the game) | C THE ROAD IN |
|---|---|---|---|
| what it films | the crew's camp: a fire in a barrel, the truck, tyres, a dead lamp, the ridge | a security camera on a pole over the pawn shop's lot: one sodium lamp dying (drops out twice a bar), a wrecked car, a dumpster, a coyote standing in the light looking round | the camera on our truck's dash on the dead highway into Vegas: the lines coming under the headlights, the posts going by, the Strip dark with one tower lit |
| the medium, baked into every frame | VHS, warm: soft luma, colour smeared right, the head-switch tear at the foot, dropouts | CCTV, mono green-grey, interlaced, six pictures a second (each held two keys), the tear at the foot | VHS, cold, the same tape |
| the load, read by the camera | the battery: four cells, CHARGING, the next cell blinking on the beat, CHARGED at READY | the signal: four bars, NO SIGNAL to SIGNAL, and a band of the picture slips sideways until the stages land (the tear shrinks with the load) | LAS VEGAS 6 MI down to 0 MI, the miles left are the stages left |
| the corner | REC on two beats of four, the tape counter | CAM 03, PAWN · LOT, REC, the wall clock | REC, the tape counter |
| its sound (CC0, Freesound via ESC-50) | the fire (kingsrow x2) over the desert wind (toiletrolltube), a camcorder's mic | crickets (rayjensen), the lamp's ballast ticking on its two drop-outs (a real click, davidkyoku, slowed), the old civil-defence siren a mile off once (guitarguy1985), a security camera's mic | a diesel truck driving (fastson x2), wind on the glass (klangfabrik), from inside the cab |
| sheet | slices/crashbox/feed_a.webp 74 KB | feed_b.webp 129 KB | feed_c.webp 90 KB |
| sound | feed_a.mp3, 10 s, -27 dB rms | feed_b.mp3, -28.9 | feed_c.mp3, -27 |
- MADE THROUGH THE RIG (rule 337, the master rig): tools/bohemia_ui_the_first_minute_feeds.py builds each diorama from the game's
  own models (reference/models/bohemia: oil_drum, truck, tyres, cover_jersey, lamp, drums; bld_pawn_shop, streetlight, wreck,
  dumpster, tyres, coyote with its Survey clip; bld_tower_casino x5), lit at night in Cycles on the CPU, every material through the
  rig's own SOURCE PASS (source_pass, 0.6 wear: matte, crevice grime, dust up, worn edges; the planes' scale baked in first so the
  masks are in metres), twelve keys a bar at 120 BPM (a key every 167 ms; B six keys held on twos), then the rig's POPULATION SNAP
  (0.3 toward the 20,564 colours of his 784 prop tiles), then the tape. 390 x 520 a frame, drawn 1:1 upright. No noise layer
  (AH-01 R10): the softness, the colour bleed, the tear and the dropouts are what a tape does, baked at the source.
- THE PICK, B: the one that reads as analog horror with nothing added, and the only one whose reading of the load IS the picture
  coming in. D.feed.pick in slices/crashbox/crashbox.json; all three on one VOTE card.
- WHERE: under his letters and their line (they stay alone on the cold ground: his 10/18 JUST THE FONT, the door checker's J1), the
  whole width down to the choices upright (390 x 282); the left column under the letters sideways. Nothing happens in the first
  second (the feed is the screen's own ground, no choice is forced); the sound starts on his first touch, as the title's wind did
  (the title's own player plays the feed's file in place of the bare wind; SETTINGS' AMBIENCE scales it).
- THE WRONGNESS on the tube went with the machine (his 11/2 vote on the sheet: 'Bro wtf is this horseshit').

### THE START SCREEN (ask 340): ONE LOOK WITH THE LOADING SCREEN, THE CAMERA'S OWN BUTTONS
| | before (BUILD 11/3k, his 'not final') | after |
|---|---|---|
| the plates | rusty tin with a rivet in each corner, the picked one gold paint on tin | the camera's own black plastic, lit from above (a pixel of light on top, two of shadow under: built with light and form, the 9/20 votes), the picked one lit gold edge to edge |
| the name | written on masking tape | the camera's title screen, sunk into the plastic, his letters at 20 |
| the origin card | tin and rivets, the facts on tape | the same plastic, the facts on the camera's little sunk screen, the picked one a gold edge |
| by the load's row | the tin robot's head in a tube, four bulbs | the same camera's small window (40 x 30), still rolling, REC on the beat |
| the receipt | two lines | the newest line only (the camera reads the load) |
- MEASURED AND FIXED ON THE WAY: (1) THE ORIGIN CARD READ EMPTY. The strip was dressed while the title hid it, and a hidden strip
  cannot scroll, so the picked origin (2 OF 15) sat off the glass and the card was a blank plate (strip at 0, the card at 362). Now
  the first time the strip is on the glass it goes to the picked origin (strip at 362, the card's words visible). (2) BEGIN SAT ON
  THE LOAD'S ROW upright (RUN's newer row, THE VALLEY · ITS CODE, took 58 px): the headings tightened, the card 96, the receipt one
  line: the row ends at 746, BEGIN starts at 756.
- The before and after card on the VOTE tab: slices/vote/UI_THE_START_SCREEN_BEFORE_AFTER_11_3.webp.

## PUSH 2: THE PHONE'S SMALL FIXES
- 154 THE THIRD JOB AND THE CUT NAMES. MEASURED: three held (two rescues past the two contracts, RUN's LOOP_MAX + 1, and a find),
  two shown (js.slice(0, 2)); every name cut mid-word at 48 of 189 px ('Get your mer'). NOW: every job he holds is a card (up to
  three; with three the job column takes the feed's top 26 and the feed shows its one post in the 20 left); the what wraps on whole
  words over two lines, the place keeps its own word and its dot, a rescue reads 'Get your men back' (its full title stays the
  card's label). Measured: 3 held, 3 shown, no word cut. Proof 4.
- 133(a) THE LEFT PHONE UNDER THE SETTINGS CARD'S WORDS. The settings card is see-through paper and the ghost phone (35 percent)
  lay under CREW, RELATIONS, NOTES and SETTINGS. NOW behind the card the phone is gone; a flip of the corner shows it where it now
  stands for three beats (1.5 s), then it goes again. Proof 5.
- 129 THE BLOOD ON THE WORDS. MEASURED on the town's board upright: the clay was wiped one hole per line of words, so a drip lay
  BETWEEN two lines of one title (across 'come tell me'). NOW a block of words is wiped as one label, the box round all its lines.
  The phone half: no blood is painted on the phone any more (its job cards carry none; the old phone's board is under the new
  phone), so the 'dark letters on blood on the phone's lit card' cannot happen. Proof 6.
- 161 THE END SCREEN'S LOOT ALL, MAKE CAMP AND LEAVE ON THE PHONE: WALKED, NOT DONE, NOT BUILT. The end screen's four buttons are
  still its own (THE PHONE's own leg presses LEAVE on the end screen), and seven other lanes' checkers tap them where they stand
  (the spoils, the aftermath, the fight opens the fight, scrap is tape, the wagon and the six, his map, bosses act one). Moving them
  is a phone face plus those seven re-aimed: medium, not small. Handed back to the coordinator.
- 282 THE RELOAD LEG TAKES A SHOOTER'S TURN. gates/the_phone_gate.js: before the fight's legs, the man up keeps his turn if he
  carries a gun that reloads, else the turn goes to the first of his men who does, else a gun from the fight's own table goes in
  the hands of the man up (climb_or_attack's way). Measured: 'his own turn, Light Crossbow' and 'the turn handed to YOU, Dagger'
  (the first man with a gun), RELOAD 50 x 50 both times.

## CHECKS (rule 13: the pre-push pass, the gates that read the files in this diff)
- THE PHONE (upright): 91 passed, 0 failed.
- THE FRONT SCREEN, JUST THE FONT: 42 ok, 0 failed (it caught three things on the way, all fixed: his subtitle and the authority's
  line on the picture (J5, now on their own ground), the gold plate's dark lower edge in the sun (J5, now lit edge to edge), the
  feed's grey behind his letters read as the old card (J1, the feed now starts under them)).
- THE SCREEN HOLDS THE LOADING: 27 passed, 0 failed.
- THE BLOOD IS CRASHBOX: 29 passed, 1 failed (PLANTED W1, red on main too). It caught one of mine on the way: a 3-point wipe left a
  soaked row 32.8 percent red against its one-third floor; the wipe is a point and a half again, soaked 37.0 percent.
- VOTE TAB: my two cards pass rule 22f (two sentences, the second says where you see it); its four reds are the same on main.
- REDS ON MAIN, NOT MINE, each run on main this round with the same result: THE START SCREEN'S LOOK (throws before its first leg), VOTE TAB (other
  lanes' whys; the alpha's landing), A FRESH PHONE SEES THE DOOR F0/F1 (7/2 on both), THE BLOOD IS CRASHBOX's PLANTED W1 (29/1 on both).

## PROOF (records/target/ui_the_first_minute_feeds/)
1 the three loading screens upright (A, B in the game, C) · 2 the title and the start screen, before and after · 3 sideways ·
4 the phone's three jobs, before and after · 5 the settings card with the phone left, before and after · 6 the board's blood,
before and after. The VOTE page: slices/BOHEMIA_UI_THE_LOADING_SCREEN_THREE_FEEDS_11_3_26.html (all three moving, tap to hear).

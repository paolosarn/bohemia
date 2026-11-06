# THE FIRST TIME IS THE FINAL TIME (DIRECTION research round, 11/6/26; rule 408(e), opened by rule 411; ask line 455)

His words, 11/4 (rule 408): 'let's make this quicker and never fuck up, everything at a higher intelligence level of logic
and design... every time I see you make art a lot of times it's just placeholder shit... the way we get things done
quickly is being token efficient too... I just want the first time you make art to be the final... you have to know how
to help yourself.'

MODE: RESEARCH. Nothing drawn, nothing on the play surface, no lane's code touched. What this round made: this page, the
bar page (records/BOHEMIA_DIRECTION_THE_BAR_ON_THE_WALL_11_6_26.md) and its sheet cut from his own starred and loved
renders (records/target/direction_bar/THE_BAR_ON_THE_WALL.webp, THE_BAR.json).

## THE ANSWER IN FIVE LINES (for him, eighth grade)

1. Good studios never show the boss fifty rough pieces. They make ONE piece of each kind at full quality first, check it
   hard, and only then make the rest the same way.
2. They keep the best pieces on the wall, and every new piece is held up beside them before anyone important sees it.
3. Rough stand-in art is fine inside the studio, but it is marked so loudly nobody can mistake it for the real thing.
4. Our VOTE tab did the opposite: 58 of his 125 art YES votes since 11/1 said "work in progress" or "dogshit". We were
   asking him to judge rough work.
5. From now on: one golden piece per kind, held to his stars, checked by machine and by DIRECTION, then the rest.

## PART 1: HOW THE BEST STUDIOS DO IT

(IN FLIGHT: the sourced studio research lands in this section in the next commit of this same round. Parts 1B to 4
stand on the repo's own numbers and do not wait on it.)

## PART 1B: ONE FINDING THAT PROVES US WRONG, MEASURED AGAINST OUR REPO

All counted from records/target/BOHEMIA_VOTE_REGISTRY.json on main at 61b4002a (937 cards, 769 verdicts). An "art card"
is kind tile, ui, animation, outfit, face, haircut or redo: 587 art verdicts.

| what | number | what it means |
|---|---|---|
| stars, ever | 2 in 769 verdicts (1 carries star:true; the poacher's came before the button) | the bar exists and is high |
| art YES whose own words say "not final", "work in progress", "wip", "keep going", "good progress" or "dogshit" | 135 of 448 art YES (30%) | a YES has not meant "this is good" |
| the same, 11/1 to now | 58 of 125 art YES (46%) | it is getting worse, not better |
| art cards he got in two rounds, 11/2 and 11/3, of four kinds (fight grounds 15, fight places 33, prop sets 16, beasts 5) | 69 cards, none made after a golden piece of its kind; 14 of the 15 grounds came back "work in progress", 8 "dogshit", 3 more "like shit" or "the worst" | this is 408(b)'s "fifty placeholders first", by the number |
| cards whose title starts "PLACEHOLDER:" | 68, including his FIRST STAR (the poacher's face) and the robot he fell in love with | the word meant nothing; the tab even strips it from the YES list (plainTitle, BOHEMIA_VOTE_TAB.html) |
| cards carrying a placeholder field the tab reads | 0 (four carry placeholder:true; the tab never reads it) | 408(c) has no machine today |
| art cards waiting in the tab now | 137 (COMBAT 31, COMBAT TWO 20, TUNING 15, RUN 9, MODS 9, ECONOMY 9 ...) | the queue he walks into is mostly old rough work |
| entries in the reference library (records/BOHEMIA_REFERENCE_LIBRARY_INDEX.json) for a weapon, a beast, a vehicle or a landmark | 0 of 98 | the reference check gate cannot hold those kinds to anything |
| this lane's own last round (the wrongness, 11/2): 15 elements, 20 pictures, one card | his NO: 'Bro wtf is this horseshit' | DIRECTION broke 408(b) one round before it was written. Owned. |

TWO MORE, NOT COUNTS BUT PROOFS:
- THE SAME IDEA TWICE. The loading screen's camera feeds got STAR 2 (11/2). One round later the settlement's three cameras
  came back 'Looks like shit' and 'these camera angles aren't intimate'. The second copied the trick (a camera) and lost
  the reasons (close, ordinary, one wrong thing, a camera that belongs in that place). A recipe must carry its reasons.
- JUDGED OFF ITS SURFACE IS NOT JUDGED. The weapons got YES on shelf sheets (cook-every-weapon-its-own-batch1 and 2, the
  six guns, 11/3, no words). Then in the fight the shields vanished and a man's two weapons drew wrong (rule 408's NOW
  bugs, ask line 456). A weapon's golden piece is judged in the hand, on the man, in the fight, eight ways.

## PART 2: THE BAR ON THE WALL (408(a))

The page: records/BOHEMIA_DIRECTION_THE_BAR_ON_THE_WALL_11_6_26.md. The sheet: records/target/direction_bar/
THE_BAR_ON_THE_WALL.webp. The list (every piece's file, crop and his words): records/target/direction_bar/THE_BAR.json.
On it: STAR 1 the poacher's face, STAR 2 the three camera feeds, the clay robot and the truck (rule 115's method), then his
love words (the thug's body and face, his BOHEMIA letters, the town is alive, one real street, the plain ranch in the
valley tans), then THE OTHER WALL (what he hated, one reason each). Registered on the DIRECTION line of VAMILY.md.

## PART 3: ONE GOLDEN-PIECE RECIPE PER KIND (408(b))

### THE COMMON RECIPE (every kind, in this order; a step skipped is a placeholder)

1. ONE AT A TIME. A kind with no golden piece gets ONE piece, not a batch. Nothing else of that kind is made until he
   passes it.
2. THE BAR BESIDE YOU. Open the bar piece of your kind (the bar page's last table). No bar piece? Hold the golden piece
   to the nearest one's REASONS (written on the bar page), not its look.
3. THE REAL THING FIRST. Find the real object (a photo, its real size and shape: PROP-02, BLDG-01 to 05, TG-01 to 07,
   RNWY-01 to 16 in the reference library). Get the real proportions before any clay (the truck that read as a toy).
4. ONE SOURCE. Model it and render it through the master rig (tools/bohemia_direction_master_rig.py, --class from the
   style guide, materials from records/target/BOHEMIA_STYLE_PALETTE.json, two wear seeds) the way the robot was made
   (rule 115(a)); the ground and the pack buildings stay on his packs (rule 115(b)) with the toolchain of rule 108
   (generated against his pack tiles with the pack palette locked, cleaned in Aseprite), never drawn rectangle by
   rectangle in code. Rule 337: the art ships in the same round as the thing it dresses, or the thing is not added.
5. THE LOOP. Twenty or more cycles of skills/bohemia-pixel-art/scripts/look.py with the bar piece as --twin, the five
   stages (silhouette, shapes and light, ramps, detail, edge), what you saw in words every cycle; the hand-finish
   (tools/bohemia_direction_hand_finish.py) only where the guide says (hero only, about a tenth of the look).
6. THE MACHINE CHECKS, all green before DIRECTION sees it:
   - the style guide card for the class (gates/style_guide_gate.py; records/target/BOHEMIA_STYLE_GUIDE.json classes)
   - NOT VIBE CODED, D1 to D9 against his pack band, and its N3 cull (the card names its sprites and look)
     (gates/not_vibe_coded_gate.py)
   - the REFERENCE CHECK block in the making tool, naming real REF-IDs, the bar piece among them
     (gates/reference_check_gate.py)
   - the analog horror bible (records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md): R1 the ordinary frame with one wrong
     thing, R4 every light has a source, R8 diegetic or dead, R10 grime baked; R3, R8 and R10 by EYES' horror tool
   - purity: 0 purple, 0 lava (gates/bohemia_purity_gate.py check_png)
   - the VOTE gate (gates/vote_tab_gate.js), with rule 89's before and after of the same thing at one pixel to one pixel
7. ON ITS REAL SURFACE. A picture from the game's own camera where he will meet it (the fight, the map at its stop, the
   town screen), on his phone's size upright and sideways (the second votes: SHOW IT FROM THE GAME'S CAMERA). A sheet on a
   black page is not the surface.
8. DIRECTION'S EYE. PASS or BACK against the bar, two lines on the card: "beside the bar: better / same / worse, because".
   Only a PASS goes to VOTE, marked GOLDEN (part 4).
9. HIS PASS FREEZES THE RECIPE. A YES with no "not final / work in progress" words, or a star, freezes the recipe (rig
   flags, class, palette roles, seeds, camera, the checks it passed) into the card's recipe line; everything else of the
   kind is made from it and names it (MADE FROM). A YES that says "work in progress" is not a pass: the golden piece goes
   round again, still alone.

### THE KINDS, IN THE ORDER THE DEMO SHOWS THEM

The demo's road (rule 408(d)'s smoke loop): the start screen, the picks after NEW GAME, the map, a town, a fight, the camp,
a level up.

| # | where he meets it | kind | golden piece today | the real reference | made with | its own checks (on top of the common ones) | who makes it |
|---|---|---|---|---|---|---|---|
| 1 | the start screen | A SCREEN, its picture | YES: the camera feeds (STAR 2) | AH-02 real dead broadcast; the real camera types (CCTV, VHS, trail cam, dash cam) | the game's own models, lit at night, the rig's source pass, the medium baked in (tools/bohemia_ui_the_camera_feeds.py) | one wrong thing; the camera's own corner text; tall 9:16 AND wide 16:9; its own real sound at -33 dB; it reads the load inside the fiction | UI (UI 8 now) |
| 2 | the start screen | A SCREEN, its type and layout | YES, by love words: his BOHEMIA letters with no card | UI-03 the phone itself (touch targets) | his own letters; slices/bohemia_ui_materials.js; style guide field 14 | four things on the start screen (rule 348); no scrolling (rule 402); no gradients, no glow, the pixel font | UI |
| 3 | the picks, then every screen with a face | A MAN'S FACE | YES: the poacher's face (STAR 1) | FACE-02 the vertical thirds; the man's own body model | the rig's portrait camera (head at least 96 px, tilt 80), its own framing and light; four mouths, three moods; never a zoom on the body (115(h) amended) | EYES' star bar: eyes 35.2 px apart within an eighth, lit from 123 degrees within 30, both pupils readable, at least 800 colours; a brim never cut by the frame; R6 the still face | PORTRAIT |
| 4 | the picks, the fight | A MAN'S BODY | PARTIAL: love words on the thug through the rig; no star; the poacher's, raider's and marauder's bodies were NO | RNWY-01 to 16 (the runway shapes); real clothes; 1.72 m at 98 px | modelled on the rig with the clothes modelled ON the body (115(c)); the palette's skin and cloth roles; --class person | the person card (at least 800 colours, at most 8 materials); one silhouette feature per class you can read at 1x among five men; a trenchcoat reads as a trenchcoat; the weapon held, not swinging loose with the hand (his 10/19) | CHARACTER (you and the thirteen), COOK THREE (the enemy tiers) |
| 5 | the map | THE PARTY MARKER (a vehicle) | YES, by love words: the truck turned up | a real pickup's proportions (2.72 long to wide, 2.86 long to tall) | the rig with --real-dims, --class vehicle | the toy test (proportions); vehicle grain 1.6 to 3.6 px a run (style guide decision 4) | DIRECTION built it; RUN places it |
| 6 | the map | A HOUSE ON THE MAP | PARTIAL: his pack house in the valley tans ('That's way better holy shit'); no house through the rig has words (the ranches and the Strip through the rig: YES, no words; on COOK FOUR's motel sign and chapel: '3d remodel otw') | BLDG-01 to 05; TG-02 the house from 45 degrees; a real Vegas ranch | until DIRECTION rules 115(b) from the two research pages: his packs and house skins with paint on weather, wear and light only (82a); after: the rig with reference/models/bohemia/bld_*.glb | you see the top of the roof from 45 degrees (his 10/10); roofs tan, never bright orange or metal blue (his 10/17); it sits in the map's own ground with no box around it; drawn at the map's pixel count (65a); art_45_gate.py | COOK FOUR |
| 7 | the map | A LANDMARK (Seven Magic Mountains first) | NO | the real piece: 7 stacks, 33 painted limestone boulders, 3 to 6 a stack, 25 to 35 feet, beside Las Vegas Boulevard (rule 410); photos of it | the 33 stones modelled at real size from records/target/bb/landmarks.json, through the rig; the day-glo paint a third of the way to the playa's dust, grey stone where it wore off | it reads as itself from 16 blocks through the fog (its silhouette at the far stop); one wrong thing at the close stop; a living artist's work: its look goes on the stage-4 licence list (410(g)) | COOK FOUR (rule 410(f)) |
| 8 | a town | A SCREEN, the settlement | NO (the town screen's history: 'looking real dogshit' 10/2; home's cameras 'not intimate' 11/3) | FTC-04 Main Street; BBM-02 a place is a kit, not an icon | his pack houses (row 6) placed as one street; the keepers from ANIMATION | the town drawn whole with the phone floating over it (rule 383); close and ordinary like STAR 2, not wide and empty | RUN FIVE now (the town drawn whole), COOK FOUR (its pictures) |
| 9 | a town | MOTION | YES: the town is alive ('This is perfect I love it') | WALK-03 The Animator's Survival Kit | the rig's clips on the beat (12 keys a bar, nothing between keys drawn) | the envelope gate (no joint reverses more than 120 degrees between drawn keys); nobody on a wall or a roof (his 10/9) | ANIMATION |
| 10 | the fight | THE GROUND | YES: one real street, now the floor bar (six numbers) | TG-01 to 07; CGRD-03 a Vegas block from the air | his packs at 1:1 (115(b)), laid as a real street | the floor bar (tools/bohemia_direction_floor_bar.py, classes.ground.floor_bar); no straight line at a grid border, no colour that ends abruptly, every road connects (his 11/2 words); the place looks like the real place it names (his Strip) | COOK TWO (the kit), COMBAT TWO and the board makers (the layout) |
| 11 | the fight | A WEAPON | NO (shelf sheets got YES with no words; then the NOW bugs: shields not showing, two weapons drawn wrong) | PROP-02 the real object, its real length and weight | the rig with the origin at the firing or holding hand's grip (COOK [the gun in the hand]); --class prop | judged IN THE HAND, on the man, in the fight, all eight ways, beside the thug: it reads at 1x, the body never hides a shield, two weapons in two hands draw right; the bug's check stays (408(d)) | COOK (the weapons, rule 337), CHARACTER (in the hand), COMBAT (the fight's draw) |
| 12 | the fight | A BEAST | NO (his fox over the grey wolf 10/17; 'four legs... a seventh grader coded it' 10/9; the feral bull 'They look wayyy to similar to the og coyote the wolf' 11/3) | the real animal's body (the lab-made beasts law: real DNA, Ice Age and after, the valley's own fossils) | the rig, --class beast (at most 5 materials); its own body, never a re-skinned dog | set against every other beast (D6, not a box, across the set) and at true size beside the 1.72 m man; a big beast reads big (his 11/3: 'these big ass animals better fuck you up') | ANIMATION (the model and clips), FACTIONS (which beasts) |
| 13 | the camp | A SCREEN and its pieces | NO ('Bro this ui is do ugly cluttered dogshit try again', 10/26) | the real camp's materials (FTC-09) | the rig's camp pieces (tent, fire, cart) on the fight board (rule 406) | the camp pitched on the board, not a menu over it | CAMP, COMBAT 8 holds the board |
| 14 | a level up | A SCREEN | NO | UI-02 game UI principles | slices/bohemia_ui_materials.js | one clear next thing (rule 117(b)); no scrolling | UI |

SO, IN DEMO ORDER: golden pieces exist for the start screen's picture and type, a man's face, the party marker, motion
and the ground (6). Half there: a man's body and a house on the map (2). None: a landmark, the town screen, a weapon, a
beast, the camp, the level up (6). The first ones with no golden piece that he meets are the landmark (on the map) and
the town screen; the most urgent is the weapon, because its bugs are on the NOW pile.

## PART 4: A PLACEHOLDER IS MARKED OR NOT SHOWN (408(c))

### THE RULE, IN PLAIN WORDS

Every art card in the VOTE tab says what it is, with one of three marks the tab draws:
- GOLDEN: the first piece of its kind, made to the bar, held to the bar by DIRECTION. It asks him one thing: is this
  the look?
- MADE FROM: made by a golden piece's recipe after he passed it. It names that golden piece.
- STAND-IN: not the look. It is there to show a mechanic, a layout or a size. The tab draws it grey under the words
  STAND-IN, NOT THE LOOK, and asks him nothing about how it looks.
A card with no mark is not shown. The word PLACEHOLDER in a title means nothing any more (68 cards wore it, his first
star among them); only the mark counts.

### THE GATE LEG (PLUMBER builds it; DIRECTION wrote what it checks)

A leg of gates/vote_tab_gate.js, named FIRST TIME FINAL. It reads records/target/BOHEMIA_VOTE_REGISTRY.json and
records/target/direction_bar/THE_BAR.json. Every check is planted wrong once and must go red before it is trusted.

| leg | what it checks | red when |
|---|---|---|
| F1 THE MARK | every art card (kind tile, ui with an image or page, animation, outfit, face, haircut, or a redo of one) made after the leg lands carries "stage": "golden", "made_from" or "stand_in" | the field is missing or another word |
| F2 THE WORD IS NOT THE MARK | a title that starts PLACEHOLDER, CANDIDATE or STAND-IN agrees with its stage | "PLACEHOLDER:" on a golden or made_from card, or on a card with no stage |
| F3 GOLDEN CARRIES ITS PROOF | a golden card carries "art_kind" (screen, face, body, vehicle, house, landmark, ground, motion, weapon, beast, prop, icon), "bar" (a key of THE_BAR.json, or "none:<art_kind>" with "nearest": a key), "real" (a REF-ID that resolves in the reference index, or a real-thing file that exists), "surface" (a picture from the game's own camera on its real surface, the file exists) and "direction": {"verdict": "PASS", "line": "beside the bar: ..."} | any one missing, a key that does not resolve, a file that is not there, a verdict that is not PASS |
| F4 ONE GOLDEN AT A TIME | per art_kind, at most ONE golden card waiting (no verdict yet) | two golden cards of one kind waiting at once |
| F5 NO VOLUME BEFORE THE PASS | a made_from card names "golden": an id whose verdict is up with star, or up with no words matching not final, work in progress, wip, keep going, good progress, more work, dogshit, like shit | it names a card he has not passed, or no card |
| F6 THE STAND-IN ASKS NOTHING ABOUT THE LOOK | a stand_in card carries no "options" and no "twin", and the tab draws the STAND-IN band: the leg plants one stand_in card, renders the tab and finds the words STAND-IN, NOT THE LOOK on that card | the band is missing, or the card asks a look question |
| F7 NO MARK, NOT SHOWN | the tab skips an art card with no stage (made after the leg lands): the leg plants one and proves it is not drawn | an unmarked art card renders |
| F8 THE RATCHET | the 137 art cards waiting today are not grandfathered silently: each gets a stage once, from a list DIRECTION writes in its next round (most will be stand_in); the list can only shrink | a waiting art card with no stage once the list lands |

Who does what: PLUMBER builds F1 to F8 (gates are PLUMBER's); RUN TWO draws the three marks and the STAND-IN band in
slices/BOHEMIA_VOTE_TAB.html (the tab is RUN TWO's); DIRECTION writes the F8 list and holds the golden PASS line; every
making lane sets the stage on its own card.

## ROUTED (one line each; the coordinator hands out the rows)

- EVERY MAKING LANE: from the next round, the common recipe; one golden piece per kind with no golden piece; the
  stage on every art card; the bar page's "beside the bar" line on every card.
- PLUMBER: the FIRST TIME FINAL leg, F1 to F8, in gates/vote_tab_gate.js (408(c)); the smoke loop of 408(d) stays yours.
- RUN TWO: the three marks and the STAND-IN band on the cards; skip an unmarked art card.
- COOK (weapons) with CHARACTER and COMBAT: the weapon is the first golden piece to make, judged in the hand in the fight
  (the NOW bugs ride it).
- COOK FOUR: Seven Magic Mountains is the landmark's golden piece (410(f)); a house through the rig after DIRECTION
  rules 115(b).
- ANIMATION: one beast as the beast's golden piece, its own body, before any more beasts.
- DIRECTION (next round): add reference/library/bar/ (the bar pieces as REF-IDs, so a REFERENCE CHECK can name them)
  and the missing kinds (a weapon, a beast, a vehicle, a landmark) to the reference library; the F8 list for the 137
  waiting art cards; rule 115(b), the buildings' method, from the two research pages.

## REFERENCE CHECK (the 9/4 duty)

No reference game is added. Battle Brothers appears only as the floor for team size (408(e) names it); every other studio
in part 1 is a source on HOW a studio works, never a look to copy (rule: a reference game belongs to one department, and
these are not reference games). The look references stay his stars, Crashbox (art only, rule 115(d)) and his packs.

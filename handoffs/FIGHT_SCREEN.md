# FIGHT SCREEN -- the handoff block (written only by FIGHT SCREEN, newest first)
# A fresh lane opened by the coordinator 11/14 on Paolo's words (VAMILY rule 449; ask rows 616, 617). On VAMILY: pull main, re-read
# CLAUDE.md and the VAMILY front page (rules 449, 448, 447, 441, 442(b), 435), then continue from the newest block below.
# WHAT THIS LANE OWNS: what sits on the glass over the fight (the buttons, the bars, the man's card, the turn order, the end screen,
# the speaking cards) and the fight's opening line. NEVER EDITED BY THIS LANE: the boards, the hand-over from the map and AUTO (COMBAT
# THREE's). UI THREE was told the fight's unit card; by rule 449 it is this lane's now.

FIGHT SCREEN (fight-screen-three-01gkdyuu): 11/20 LATEST -- [one mouth] SHIPPED 07f40d8e, BUILD 11/20e - ONE MOUTH AT A TIME, BUILT, NOT YET SEEN (rule 461's walk; rules 449(b), 450(a), 441, 454(a); ask row 616). VOTE fight-screen-one-mouth-at-a-time-11-20 (stand_in; before and after).
THIS CHAT IS FIGHT SCREEN THREE (FIGHT SCREEN TWO stopped at its model's weekly limit; it left no pushed branch). Record: records/BOHEMIA_FIGHT_SCREEN_ONE_MOUTH_AT_A_TIME_11_20_26.md.
THE WALK, THE LANE'S NEW EYE: tools/bohemia_fight_screen_the_walk.js <alpha|demo> <upright|sideways> <outdir> [road|beasts] (SCALE=2 for stills he sees; BEFORE=1 serves this
lane's files as HEAD has them). The whole fight by a finger, first second to end screen to the map; at every still it READS the glass: every card up, its box, off the
glass, words cut, every pair of cards on each other, whose man on the phone's card. Run it on every build of this lane, all four surfaces, before calling it done.
FOUND ON MAIN 64ab8c77 AND FIXED (slices/BOHEMIA_FIGHT.html):
 - __ONE_MOUTH_AT_A_TIME__ (teach()): the lesson and a crew's shout were up at once (the shout waited for the lesson, the lesson never waited for the shout); a lesson
   takes the floor now and cuts the shout. ANY NEW SPEAKING CARD ASKS FOR THE FLOOR THE SAME WAY (UI.why, UI.vet, UI.call: one at a time).
 - __THE_STRIP_KEEPS_ITS_TURN__ (sayForTurn): a tile's line, the far walk's and the spent line had no turn and stood the whole fight and under the end screen; they carry
   their turn now (UI.sayTurn, the director takes them down); AUTO pressed and the fight's end clear the strip; OUT OF ACTION POINTS goes off his turn.
   ANY NEW LINE SAID ON HIS TURN THAT IS ABOUT THAT TURN CALLS sayForTurn(u) AFTER say().
 - __HIS_MAN_IN_THE_LINEUP__ (hud()): before FIGHT the card wore their first man; now the man he is placing (UI.dsel) or his lead.
 - __ONE_BOARD_FOR_EVERY_MOUTH__ (css + mouthLook()): A MOUTH IS BOARD, A PRINT IS PAPER. #why, #call, #vet: the house's dark board (UI's kit 'board' at 0.6), a pinned
   face in the sheet's paper frame, a ::before edge gold his / red theirs (#why.them, #call.hot). #say, #drawer (but the sheet), #over stay UI's receipt on purpose.
 - slices/bohemia_fight_opener.js: 'THE FREEWAY · FREEWAY' says the place once.
 - tools/bohemia_fight_screen_the_phone_card.js puts a man of theirs on the card by UI.pend.target (it had read the lineup's wrong card as 'theirs').
ON THE PAGE: four walks on the rebased build (demo upright road, demo sideways beasts, alpha upright beasts, alpha sideways road): two cards on each other 0 (was 3 of 4),
a stale line 0 (was 4 of 4), his own man in the lineup 4 of 4 (was 0), nothing cut, home 4 of 4, 0 page errors.
GATES: THE WHY LINE 20/0, THE CREW'S COMMENTARY 10/0, NOTHING POPS VOICES CLEAR 38/0, THE MAN'S CARD ON THE PHONE 9/0, THE MAN'S SHEET 7/0, THE CARD THAT OPENS A FIGHT 8/0,
EVERY SHOT IS FELT 11/0, THE FACE SHOWS UNDER THE HELMET 10/0, EVERY PANEL CLOSES 14/0, ICONS 8/0, LANGUAGE 107/0, DEMO BUILD 25/0, NOTHING POPS UP 23/0, PAGES PUBLISH 30/0.
NAMED, NOT MINE (the same legs red with this lane's files as HEAD had them): THE FIRST FIGHT TEACHES 7/3, THE FIGHT BY HAND QUICKER 18/2, THE LOSS IS UNDERSTOOD 14/1.
DONE FROM THE OLD LIST: (1) one material for the speaking cards; (2) the Rogue Fable 4 library page: reference/library/rogue_fable_4/01_THE_FIGHT_SCREEN_AND_THE_CARD.md
(sourced from search results; the store pages were refused by this box's network, NO screenshot opened; say so whenever it is cited).
ROUTED IN THE RECORD: WEAPONS (the weak ring's bare '-7'); RUN FIVE (the end screen's receipt shows only its dashed rule from behind the header).
NEXT, in order:
 (1) THE LAST HIT ON THE BAR (the library page's rule 3: Rogue Fable IV draws last turn's damage in red on the HP bar): the bars over the men on the board and the phone's
     card's bars show what is left, never what was just lost.
 (2) THE END SCREEN (rule 449(b)): the spoils page is RUN's (BOHEMIA_SPOILS_SCREEN.html, rule 404 'at final'); this lane's part is the fight's own end (#over, the wipe).
 (3) The opening card's men as BODIES (the fight's own sheets of the dealt looks, slices/fight_rig).
 (4) The turn order: NOT owed unless he asks (his note 9 of 11/2).
[bb Battle Brothers puts one man's words in one place at a time; ours put two at once, and now says one]
[analog horror: a security monitor's caption box that only ever holds one speaker, the last one cut mid-word when the next one keys in]

FIGHT SCREEN (fight-screen-two-01gkdyuss): 11/18 LATEST -- [cap on the glass, one honest head] SHIPPED 947ec28f2, BUILD 11/18q - THE CAP IS ON THE GLASS, ONE HONEST HEAD, BUILT, NOT YET SEEN (ask rows 650 and 648, FOUND BY EYES, the NOTE below; rules 450(c), 450(a), 441). VOTE fight-screen-the-cap-is-on-the-glass-and-one-honest-head-11-18 (stand_in; before and after).
THIS CHAT IS FIGHT SCREEN TWO. Record: records/BOHEMIA_FIGHT_SCREEN_THE_CAP_IS_ON_THE_GLASS_AND_ONE_HONEST_HEAD_11_18_26.md.
ROW 650, THE FLASH. REPRODUCED FIRST: the cap counted the moments the shots were SCHEDULED for; the glass draws on its own frames; four shots a third of a second
apart are legal by the schedule and one frame 90 ms late made all four begin inside 933 ms on the glass with 'held' 0. Not the speed: the fight's clock is real time.
 - slices/BOHEMIA_FIGHT.html __THE_CAP_IS_ON_THE_GLASS__ (inside __EVERY_SHOT_IS_FELT__): glassMayBegin(now) is THE ONE CAP, asked where the white is drawn
   (tickShot) on the drawn frame's clock: no more than max_per_second begin inside any glass_second_ms (1100). shotFelt holds NO cap now (only the volley join).
   A white the glass will not take is never drawn (q.off); its barrel flash and sound stay. UI.shotSeen.white / .held are counted at the glass. UI.glass = the cap's
   own state (began, n, held). The drawer reads every scheduled white (it read the last four: a fifth scheduled ahead dropped one).
 - THE VEST'S WHITE (drawSmoke's whole-board fill, a cell vest going off) asks the same cap through glassSpark(now), ONE MARKED LINE, and is the soft share when
   FLASH is soft. ANY NEW WHOLE-BOARD OR WHOLE-GLASS WHITE MUST ASK glassMayBegin: the gate's S2 fails a whole-board fill it does not know.
 - records/target/bb/fight_shot.json: glass_second_ms 1100, rise 0.02, glass_why.
ROW 648, THE FACE. EYES was right: the 11/17 band was a cut and a cut is a seam. NOTHING OF THE GEAR IS CLEARED NOW.
 - THE REAL CAUSE: CHARACTER's portrait pieces (slices/wear/wear_face.webp) are whole and right, drawn for a head taller than it is wide; PORTRAIT's cell is a round
   head; a brim made for a tall brow lands on his eyes. Measured: hats end 0.20 to 0.47 of his head under his eye line, closed helms and masks past 0.59.
 - slices/bohemia_fight_face.js, REBUILT: head() reads his eye line off his own picture; shape() reads the piece off the wear file's own drawing and names it
   hat / mask / face / open; a hat is FITTED WHOLE (lift + a press no flatter than SQUASH 0.6) so its brim is on his brow; a mask that began at his eyes begins under
   them; the rest are left whole. The picture stands back so the fitted piece is in the frame. draw() has the same signature; layer() hands the gear alone for gates.
 - SAID PLAINLY: RAUL is a man in a hard hat now but still the smallest (68 in 100; his hair is as wide as the cell so his hat is the widest and pressed the most).
   A sheet of pieces drawn on PORTRAIT's own head is CHARACTER's and PORTRAIT's (routed in the record, with the wear file's widest-row anchor).
GATES: EVERY SHOT IS FELT amended 11/0: S6 the glass itself at 1x, 2x, 4x on AUTO side by side (the gate's own eye on every drawn frame: the white's real opacity and
the TRUE MEAN of the board's pixels: a 64-point eye called a hit's camera kick a flash, twice; never sample a few points), S7 a late frame never makes a fourth, S8 the vest's white; plant: the cap out of the glass. THE FACE SHOWS UNDER THE HELMET rebuilt 10/0
(H2 NO SEAM, H6 the brim on his brow; plants: the file out, a band cut again).
ON THE PAGE (tools/bohemia_fight_screen_the_why_is_true.js with GLASS=<1|2|4>: a finger on AUTO and the speed button, the tool's eye on the glass): alpha 4x 19
flashes begun, most in a second 3; alpha sideways 2x 18, 3; demo 4x 17, 3; demo sideways 2x 15, 3; the cap held one in three of the four; the crew's hard hat fitted
as a hat on all three; 0 page errors.
NEXT, in order (unchanged):
 (1) ONE MATERIAL FOR THE SPEAKING CARDS: #vet is still pale paper beside the three (five gates read it). #why and #call are dark glass. Make all three the family's board.
 (2) THE LIBRARY PAGE on Rogue Fable 4's screen and card (the library has none): owed before any card is called final against it.
 (3) THE END SCREEN and THE STRIP #say, in the family's look (rule 449(b)).
 (4) The opening card's men as BODIES (the fight's own sheets of the dealt looks, slices/fight_rig).
 (5) The turn order: NOT owed unless he asks (his note 9 of 11/2).
[bb Battle Brothers has no gun and no flash; its helmets are drawn on the face they were made for. Ours fits a hat to a head it was not drawn for]
[analog horror: three camera flashes and then the fourth man fires in the dark; you hear him and see only his barrel]

NOTE 11/18 FROM EYES TO FIGHT SCREEN 2 (rule 441; the routine 'EYES walk 11/17') -- ASK ROWS 648, 650. Record: records/BOHEMIA_EYES_WALK_THE_11_17_BUILDS_11_18_26.md (pictures records/eyes_walk_11_18/).
SEEN: the three cards as one family upright and sideways (the opening card, the man's card on the phone, the sheet inside the glass both
ways); the why line true on a haul (road.brigands) and a collect job (job.brigands); the eyes read under the helmet now.
648: a seam is left: the helmet is cut straight across above the eyes and its brim floats across the nose and mouth (e04).
650 (PLAUSIBLE, three browsers running): two alpha AUTO fights showed 4 flashes begin inside one second on the glass (sampled every
  frame, the closest 233 ms apart) with UI.shotSeen.held 0. EYES' AUTO tool now keeps UI.shotLog and counts its starts; the next run
  settles it. If your limiter reads the shot's scheduled moment and the glass draws it later, the two can disagree.

FIGHT SCREEN (fight-screen-two-01gkdyuss): 11/17 LATEST -- [why is true, face shows] SHIPPED 64b4ee0e0, BUILD 11/17o - THE WHY IS TRUE, THE FACE SHOWS, BUILT, NOT YET SEEN (ask rows 631 and 630, FOUND BY EYES; rules 449(a), 450(a), 441, 454(a)). VOTE fight-screen-the-why-is-true-and-the-face-shows-11-17 (stand_in; before and after).
THIS CHAT IS FIGHT SCREEN TWO. Record: records/BOHEMIA_FIGHT_SCREEN_THE_WHY_IS_TRUE_AND_THE_FACE_SHOWS_11_17_26.md. EYES' two finds, in one build, ahead of the lane's list.
ROW 631, THE WHY LINE. THE CAUSE WAS NOT THE HAND-OVER (rule 12, measured): the fight was told THAT a job began it (contract:<id>:<who>), never WHICH job, and the
table read every job as a road to clear; nobody asked if the board had a sky; one rule per start meant the same three sentences for ever.
 - records/target/bb/fight_reasons.json: a block 'truths' (facts: outside, job_clears, job_hunts, job_pump; which job kinds clear, which hunt) and an 'if' on 22 rules:
   { "them" | "ours": { "<the sentence's place in its list>": [facts] } }. A sentence with no 'if' is true whenever its rule fits. how.robbed and how.job fall_to road.
   NO SENTENCE WAS WRITTEN OR REWRITTEN (454(a)). The file keeps its hand layout: edit it as text, never json.dump it.
 - slices/bohemia_fight_why.js pick(): only sentences whose needs are so; pools true sentences across fitting rules until two; remembers the last per start and per
   mouth; returns null when nothing is true. Exports trueAt, lineIf, jobFacts, asked.
 - slices/BOHEMIA_FIGHT.html: whyJob (reads the job's kind off the MAP'S OWN held jobs, parent #cityFrame LOOP.held, by the id in the word; READ ONLY, the hand-over is
   not edited), whyInside (the board's own ceiling), whyFacts carries outside/job_clears/job_hunts/plays; UI.whySaid carries i, needs, truth; UI.whySaid.none when
   nothing true could be said.
 - slices/bohemia_fight_opener.js truths(): the card asks the same two things (the ground the map's card names, the held job), so the card and the bell agree.
ROW 630, THE FACES. THE CAUSE: PORTRAIT's cell is cut close to the head (the crown on row 0) and the head piece (engine/bohemia_wear.js face(), CHARACTER's) is stood
on the head's middle, so the frame cut the dome and the rest lay over his eyes. Neither file is wrong alone and neither was edited.
 - NEW slices/bohemia_fight_face.js (BohemiaFightFace.draw / .said / .n): the picture stands back as far as this gear needs (never past 64 in 100), stood on the
   frame's foot, and a band is opened over his eyes. Called by the fight's drawPortrait (the strip, the phone's card, his sheet, the speaking cards) and by the
   opening card's rows and its speaking face. Loaded by the fight's page and by my marked line in the map (the three tags stay on ONE line: gate C1 reads it).
 - SAID PLAINLY: under a tall dome his face is small (0.686 for the crew's hard hat; on the phone's 26 point frame his eyes are two dots). The real cure is a head
   piece drawn for the portrait cell: PORTRAIT and CHARACTER, routed in the record.
GATES: THE WHY LINE 20/0 (W6 redefined, W10 only a true sentence + the two EYES heard + a planted table with the needs stripped, W11 the list for WORDS, W12 the
page). THE FACE SHOWS UNDER THE HELMET 7/0, new, registered (3 crew x 105 head pieces = 315 faces; plant: my file served empty).
ON THE PAGE (tools/bohemia_fight_screen_the_why_is_true.js <alpha|demo> <upright|sideways> <outdir> <job|ceiling>; BEFORE=1 for the old files): demo upright and
alpha sideways the job case: card and bell 'You took a job on us, so come and try to finish it.', plays recover-return; demo sideways and alpha upright the ceiling
case: the card reads INSIDE THE CASINO and names no road. 12 faces framed a fight, 0 page errors on all four.
NOT PROVEN THROUGH THE SHELL: a bell under a real ceiling (the map will not start a road stop on a casino's own cell; the town's door holds it). W12 proves it on
the fight's own page.
FOR WORDS TWO (rule 454(a); nothing written here): NO start is silent. 68 starts have ONE true sentence and say it every time (the gate's W11 prints them): a job
that is not a clearing and not a hunt (get a thing back, carry, guard, escort) against the machines, the water crews, the pit fighters, the bosses' crews and the new
crews, and under a ceiling also the watch and the scavengers; a hunt handed against those same men; robbed by scavengers under a ceiling. Any road stop under a
ceiling is down to the road's sentences that name no road. A sentence per JOB KIND would need the job's thing and who sent him in the table (the fight can read
both off the held job); that is WORDS TWO's call.
BESTIARY'S FOUR NEW FACTIONS (11/17i: flock, hired, takers, casino) were in no group of the why table and turned the gate's W3 and W7 red on main: they are groups
of men now under BESTIARY's own names and say the sentences every crew of men says; none of their own yet (WORDS TWO). A NEW FACTION ALWAYS NEEDS A LINE IN 'who'.
THE MAMMOTH (BESTIARY, on main while this shipped) is one of the ones that charge, never one of the lab's giants: the giants' sentence says it needs meat, and a mammoth eats grass.
NEXT, in order (unchanged but for item 0, done):
 (1) ONE MATERIAL FOR THE SPEAKING CARDS: #vet is still pale paper beside the three (five gates read it). #why and #call are dark glass. Make all three the family's board.
 (2) THE LIBRARY PAGE on Rogue Fable 4's screen and card (the library has none): owed before any card is called final against it.
 (3) THE END SCREEN and THE STRIP #say, in the family's look (rule 449(b)).
 (4) The opening card's men as BODIES (the fight's own sheets of the dealt looks, slices/fight_rig).
 (5) The turn order: NOT owed unless he asks (his note 9 of 11/2).
[bb Battle Brothers never says why a band is on you; ours says it, and now only says what is so]
[analog horror: an ID photograph of a man in a helmet where somebody cut a slot in the print so you could see his eyes]

FIGHT SCREEN (fight-screen-two-01gkdyuss): 11/17 LATEST -- [phone card] SHIPPED 775b3f26a, BUILD 11/17g - THE MAN'S CARD ON THE PHONE, BUILT, NOT YET SEEN (rule 450(a); ask row 621 DONE: all three cards are on the page). VOTE fight-screen-the-mans-card-on-the-phone-11-17 (stand_in; before and after, upright and sideways).
THIS CHAT IS FIGHT SCREEN TWO. Record: records/BOHEMIA_FIGHT_SCREEN_THE_MANS_CARD_ON_THE_PHONE_11_17_26.md.
STRUCK, AND WHY: the block below planned to GROW THE PHONE in a fight. Rule 238 (PAOLO 10/26, LOCKED): 'a solution to any of your UI problems will not be to make the
phone longer... don't ever do that'; 'tinier, and that's OK'. FIXES gave every press its finger's reach on 11/9. The buttons are settled by his word; the teardown's
'44 points' is not the phone's rule. READ slices/bohemia_phone.js's own comments before planning anything on the phone.
WHAT: the card he sees every turn, rebuilt inside the phone's own size: his face a photograph in a paper frame pinned on the house's dark board, a strip down the
card's side gold when he is his and red when he is theirs, his name never cut (thirteen letters a line, a longer one two lines; the fight hands the phone his whole
name), three lit bars the width of the card, his AP as pips. THE NUMBERS LEAVE THE CARD (rule 224; his sheet holds them; they stay in the page unshown for the
readers). A MAN OF THEIRS WEARS LV AND MARKS, never cut words: three red chevrons (outclasses, the board's own mark), the sidestep (dodges), a plate (armour); his
sheet reads each mark beside its word on the level line (a tight sheet grows by nothing; at its last step the words fold and a finger on a mark reads its word on
the reading line) and says the level his plate says. One height for every man (37 of the phone's points), so nothing under the card moves.
THE FAMILY PASS: the edge the sheet and the opening card were written to wear NEVER SHOWED (the kit's board clears every border colour); one ::before strip on all
three now, gold rgb(217, 168, 90) his, red rgb(255, 90, 64) theirs. A man of theirs had two levels (sheet LEVEL 1, plate LV 5): one now (lvOf).
WHERE: slices/bohemia_phone.js __THE_MANS_CARD_ON_THE_PHONE__ (UI's file, a marked block by the coordinator's word: css after FIXES' reach; a marked line in P.man
(full, plate, says); a marked block at the foot of manPaint; window.__PHONE_CARD_SAYS); slices/BOHEMIA_FIGHT.html (hud: #cls dataset.plate and .says, #cnm
dataset.full; sheetPlate, .sh-plate, .pmk, #drawer.sheet::before); slices/bohemia_fight_opener.js (.mc::before).
GATE THE MAN'S CARD ON THE PHONE 9/0 (P1 to P7, one plant; the demo's page both ways through tools/bohemia_fight_screen_the_phone_card.js), registered.
PRE-PUSH PASS: THE PHONE 268/0 (UI's own gate on its file, run alone; a first run beside three other browsers showed three reds in one walk whose fight did not open, gone when run alone); THE CARD THAT OPENS A FIGHT 8/0; THE MAN'S SHEET 7/0; THE WHY LINE 15/0; ICONS, NOT NUMBERS, IN THE FIGHT 8/0; EVERY PANEL CLOSES 14/0; DEMO BUILD 25/0; HANDOFF 10/0; PAGES PUBLISH 30/0. NAMED, NOT MINE: THE FOURTEEN EYES FOUND 151/5 (F531 81 of 85 boards, F553 YOUR PLACE on a road, F606 a question stops the clock: the same three red with this ship's change stashed; its reach legs on the phone's fight page pass); STATS ARE BARS AND ARROWS 45/2 (THE SHOP ON A MAN, the shop's arrows); the VOTE tab's landing legs and other lanes' sheets; the registry's orphans.
ON THE PAGE: RESULT, four surfaces (the demo and the alpha, upright and on its side), a crew met through the map's card and ENGAGED with a finger: the phone 124 x 276 upright and 112 x 248 on its side on all four; the card 37 tall (33.3 on its side) for his man, a man of theirs and a two-line name, the FIGHT button and the skills' box unmoved; no name cut, nothing off the card, no digit showing for his man, his level the only digits for a man of theirs; 24 men of theirs put on the card across the four, every level and mark the fight's own read of him (LEADER LV 10 with the chevrons and the plate, RAIDER LV 6, MARKSMAN LV 5 with the chevrons and the sidestep, THUG LV 3 with none); a 26 letter name on two lines; a finger on the face: his sheet says the level his plate says and reads the marks in words under a red edge; the card that opens the fight wears the same red edge. 0 page errors.
FOR THE TOOL: tools/bohemia_fight_screen_the_phone_card.js <alpha|demo> <upright|sideways> <outdir>; BEFORE=1 serves the two files as HEAD has them; PLANT=1 takes the two-line fit out.
THE SEAMS: UI THREE: your markup, your reach and your sizes are as they were; my block is css and two marked places in your file. COMBAT: CLASS_SAYS and classOf are
read through #cls's dataset, never copied; the plate's FIGURES ('DODGES 82%', 'ARMOUR 120') are nowhere he can read them now (the marks say that, not by how much):
yours to place, the sheet's own rule caps its numbers at 14.

NEXT, in order (the three cards are done; rule 449(b) is the rest of the glass):
 (0) EYES' TWO FINDS, FIRST (the NOTE below, ask rows 630, 631; rule 441(b)): 630 THE CREW'S PORTRAIT IS ALL HELMET (YOU and DESI a nose and a mouth, RAUL the
     helmet only; it leads the sheet, the why line, the phone's card and the opening card's rows): the helmet is engine/bohemia_wear.js face() (CHARACTER's, rule 272)
     over PORTRAIT's head; measure which of the two frames it wrong before touching either. 631 THE WHY LINE IS TRUE TO HOW THE FIGHT BEGAN, NOT TO THE JOB OR THE
     PLACE (a cold box job's THUG says 'They paid you to clear this road'; every road stop a THUG with one of three road lines, in the casino and the garage too):
     the table's hows and facts are this lane's (records/target/bb/fight_reasons.json, slices/bohemia_fight_why.js); rule 454(a): no line is rewritten this week, so
     the fix is which rule fires and what the fight is told (the job's kind, the place), never new sentences.
 (1) ONE MATERIAL FOR THE SPEAKING CARDS: #vet is still pale paper beside the three (five gates read it: nothing pops, the crew's commentary, the fight by hand,
     the first fight teaches, the loss is understood). #why and #call are dark glass. Make all three the family's board.
 (2) THE LIBRARY PAGE on Rogue Fable 4's screen and card (the library has none): owed before any card is called final against it.
 (3) THE END SCREEN and THE STRIP #say, in the family's look (rule 449(b) lists the end screen).
 (4) The opening card's men as BODIES (the fight's own sheets of the dealt looks, slices/fight_rig), which the fight needs a moment later anyway.
 (5) The turn order: his own note 9 of 11/2 took it off the phone and the glass ('I don't think anyone gives a fuck about which character is next'): NOT owed
     unless he asks; the teardown's line on it was this lane measuring against Battle Brothers, not against him.
[bb Battle Brothers prints a man's numbers on a bar across a monitor's foot; ours is a phone in the corner of a phone, so the card keeps a face, three bars and pips and the numbers live on his sheet]
[analog horror: an ID photograph in a paper frame, and for the man who can kill you three red marks where his name tag would be]

FIGHT SCREEN (fight-screen-two-01gkdyuss): 11/14 -- [opening card] SHIPPED 2f8ca51fc, BUILD 11/14z - THE CARD THAT OPENS A FIGHT, BUILT, NOT YET SEEN (rule 450(a); ask row 621, two of three cards). VOTE fight-screen-the-card-that-opens-a-fight-11-14 (stand_in; before and after, upright and sideways).
NOTE 11/17 FROM EYES TO FIGHT SCREEN 2 (rule 441; the routine 'EYES walk the 11/14 builds') -- ASK ROWS 630, 631. Record: records/BOHEMIA_EYES_WALK_THE_11_14_BUILDS_11_17_26.md (pictures records/eyes_walk_11_17/).
SEEN: the why line in 13 of 13 fights; the white hit never past 3 starts in a second over 12 AUTO fights (5 v 5 at 4x, closest 233 ms,
peak 0.58); the man's sheet inside the glass upright; the card's face, name, sentence, faces of THEM and YOU, three buttons.
630: the crew's portrait is framed so the helmet fills two thirds (drawPortrait at 156 px: YOU and DESI a nose and mouth, no eyes; RAUL
  the helmet only); it leads the sheet, the why line and the phone's panel.
631: the why line is true to how the fight began, not to the job or the place: the cold box job's THUG says 'They paid you to clear this
  road'; every road stop a THUG with one of three road lines, in the casino floor and the garage too.

FIGHT SCREEN (fight-screen-two-01gkdyuss): 11/14 LATEST -- [opening card] SHIPPED 2f8ca51fc, BUILD 11/14z - THE CARD THAT OPENS A FIGHT, BUILT, NOT YET SEEN (rule 450(a); ask row 621, two of three cards). VOTE fight-screen-the-card-that-opens-a-fight-11-14 (stand_in; before and after, upright and sideways).
THIS CHAT IS FIGHT SCREEN TWO (the first chat is archived at a full context; its blocks are below and are this lane's).
Record: records/BOHEMIA_FIGHT_SCREEN_THE_CARD_THAT_OPENS_A_FIGHT_11_14_26.md.
THE BLOCKER BELOW WAS A PREMISE (rule 12, measured on the demo's page): the map already carries the fight's own engine (slices/bohemia_job_danger.js fresh(), doorOpts())
and the fight deals a band's looks by place, not by dice (but for the two looks whose model carries a weapon). So the card ASKS THE FIGHT: six deals, one a tick,
and it shows clearly only a face that stood on the board in every deal; a face that moved is a photograph not yet developed (dark). Nothing is handed over.
WHAT: the card where he chooses ENGAGE or FALL BACK is rebuilt whole, one look with the man's sheet: their leader's face pinned on the dark board, the crew's name,
the ONE why sentence from his mouth (for beasts one of HIS men says it, gold edge), their men against his as two rows of faces of one size (beasts as the fight's
beast head), the ground in a well, the map's own two buttons 48 points tall; nothing under 11 points; upright 374 wide, on its side 640 in two columns, three
tightening steps. The shell's lesson (#cbxsay) is asked to wait while the card stands. AT THE BELL the man wearing the card's face says the card's sentence once
more, small (#why.said: a 40 point face, 12 point words, four beats).
WHERE: slices/bohemia_fight_opener.js (read: the fight asked; dress: the card; photo, style, fit; BohemiaFightOpener.last for gates and EYES); ONE MARKED LINE in
meetShow and two script tags in slices/BOHEMIA_CITY_WORLD.html (RUN's file; the map's own nodes are moved, never rebuilt); slices/BOHEMIA_FIGHT.html __THE_WHY_LINE__
(whyNote, the kept face and line in whyOpen, WHY_SAID_BEATS, #why.said; UI.whySaid.card = { line, face, look } or null); slices/bohemia_fight_why.js exports fits.
THE NOTE: localStorage bohemia.fight.opener.v1 { at, why, band, rule, key, i, side, line, how, who, reason, look, name }, read once, ten minutes at most, only for
the same word and the same band in the same order.
GATE THE CARD THAT OPENS A FIGHT 8/0 (C1 to C6, one plant; a browser; 240 real deals, 0 broken promises), registered. THE WHY LINE 15/0, THE MAN'S SHEET 7/0,
NOTHING POPS, VOICES CLEAR 38/0, DEMO BUILD 25/0.
ON THE PAGE: RESULT, four surfaces on the final build line: twelve cards of twelve dressed, each inside the glass with nothing off it or cut, no type under 11 points, both buttons a thumb (169 x 48 upright, 302 x 48 on its side) with nothing lying on them, their row and his row drawn, the speaker's face a drawn portrait: the demo upright 374 x 343; the demo on its side 640 x 242 to 257; the alpha upright 374 x 343 to 361; the alpha on its side 640 x 257. A led crew of six shows 5 faces and 1 not yet developed; four thugs 3 and 1; a pack of three is three beast heads and DESI says why. FOUR BELLS OF FOUR KEPT THE CARD'S WORD (the leader twice, a thug once, DESI once): the same face, the same sentence, small. 0 page errors. The fight answered in about half a second with the page still busy, one deal a tick.
NAMED, NOT MINE (each run once WITHOUT this lane's file, the same reds): MEET BEFORE YOU FIGHT 9/6 (M6, M9, M11, M13, M14, M15); THE MOMENTS BETWEEN 2/2 (B3, 'the run':
no card comes at the camp). Still named from before: HUD OVERLAP's phonebtn, SETTINGS' two legs, THE FIGHT BY HAND, QUICKER 18/2, the VOTE tab's landing legs, the
registry's orphans, PAGES PUBLISH's cap.
THE SEAMS: RUN: one marked line in meetShow and two script tags, nothing of yours rebuilt; the old row of bodies (.mcmen) is hidden once the fight has answered and
stands if it cannot be asked. WORLD: your engine reader is asked through fresh() and doorOpts(), on this lane's own copy, never your read in flight; the two ends
of a carried look are dealt on a shallow copy of ours on that copy only. UI THREE / FIXES: #cbxsay is asked to wait from the map's frame (visibility, data-mco);
its cleaner home is your covered(). COMBAT THREE: nothing of the hand-over, the boards or AUTO is edited; the map's party men are still not the fight's men (yours and RUN's).
FOR THE TOOL: tools/bohemia_fight_screen_the_opening_card.js <alpha|demo> <upright|sideways> <outdir> [led|thugs|beasts]; BEFORE=1 leaves this lane's file out.
On the alpha the tool opens the map with the game's own swap (its RUN tab leaves a town onto the old street, where there is no card).

NEXT, in order (rule 450(a), ask row 621): ONE CARD LEFT.
 (1) [STRUCK 11/17: BUILT, and the plan in this item to grow the phone was wrong against rule 238; read the newest block] THE MAN'S CARD ON THE PHONE (the one he sees every turn: 5 point numbers, a cut status line, buttons of 25 by 27 points). NOT BUILT, AND MEASURED (rule 12; the
     teardown's own boxes, records/fight_screen_teardown_11_14/measured_upright.json): the phone's fight page is 108 x 235 points upright (97 x 212 on its side). A
     finished page needs 278: his card 48 (a 36 point pinned face, his name at 11 points, three bars with no numbers, his AP as pips), FIGHT 44, WAIT / AUTO / speed /
     RETREAT as two rows of two thumbs 92, STRIKE 50, the two apps 44, before one row of skills. IT DOES NOT FIT, SO THE PHONE GROWS IN A FIGHT (about 124 x 330 of
     page upright, out of its own spot, rule 448(a)) or rows leave it. That is the phone's size and place, UI THREE's layout (slices/bohemia_phone.js: BW, BH, .fight,
     .reach) and it changes how much of the board he sees, so it is one whole build of its own, never a patch of the header alone (a readable card over buttons no
     thumb can press is half a card, rule 441). THE DESIGN TO BUILD: the sheet's board and pinned face (gold his, red theirs); the name at 11 points, wrapping, never
     cut; three lit bars, the numbers left to the sheet a tap on his face opens (rule 224(c)); a man of theirs' plate as marks, never 5 point words (his level as the
     board's own chevrons, OUTCLASSES YOU as one red mark); every control 44 points; RETREAT alone at the foot, away from WAIT and AUTO. The fight's side of it
     (BohemiaPhone.P.man, the plate's words: classLine) is this lane's; the phone's side is UI's file, a marked block by the coordinator's word.
 (2) THE LIBRARY PAGE on Rogue Fable 4's screen and card (the library has none): owed before any card is called final.
 (3) THE TURN ORDER back on the glass in the game; one material for the speaking cards (#vet is still pale paper).
 (4) The card's men as BODIES: the fight's own sheets of the dealt looks (slices/fight_rig), which the fight needs a moment later anyway.
[bb Battle Brothers tells you who is on you in words before a fight and never why; ours shows their faces against yours and has their leader say why]
[analog horror: a wall of ID photographs, one of them not yet developed, and the one that is talking is looking at you]

FIGHT SCREEN (fight-screen-01gkdyus): 11/14 -- [man's sheet] SHIPPED 49ac82edf, BUILD 11/14r - THE MAN'S SHEET, BUILT, NOT YET SEEN (rule 450(a); ask row 621, one of three cards). VOTE fight-screen-the-mans-sheet-11-14 (stand_in; before and after, upright and sideways).
Record: records/BOHEMIA_FIGHT_SCREEN_THE_MANS_SHEET_11_14_26.md. The teardown it answers: records/BOHEMIA_FIGHT_SCREEN_THE_TEARDOWN_OF_THE_CARDS_11_14_26.md (one line of it corrected
against rule 224: the meet card's count as drawn men is his ruling).
WHAT: the sheet a finger on a man's face opens is rebuilt whole: his face pinned on the house's dark board (gold his, red theirs), name, level, trade, a man of theirs' one thing to
know; UI THREE's eight bars each with its word; armour, nerve; the weapon and its line in a well, damage a bar; every skill, a finger on one reads it; nothing under 11 points; it
always fits both ways (steps t1 t2 t3).
WHERE: slices/BOHEMIA_FIGHT.html __THE_MANS_SHEET__ (sheetTell, sheetDamage, drawer, sheetLook, sheetRead, sheetLayout; the wrapper after __UI_THREE_STATS__ redraws only on a
changed signature and gives the weapon's hold card its paper back); css #drawer.sheet; UI.sheetFit is its own account. The kit dresses #drawer as a receipt under html[data-kit]
body: sheetLook's injected rule outranks it by the class.
GATE THE MAN'S SHEET 7/0 (M1 to M6, one plant; a browser), registered. STATS ARE BARS 38/0, ICONS NOT NUMBERS 8/0, EVERY PANEL CLOSES 14/0, THE WHY LINE 15/0, EVERY SHOT IS FELT 7/0.
ON THE PAGE: RESULT, four surfaces, each inside the glass with nothing off it, no type under 11 points, a face, eight bars with words, a finger on a skill read and the sheet stayed: the demo upright 374 x 491 of 542 points of room (a MARKSMAN, 5 skills); the demo on its side 708 x 218 of 372 (a RAIDER, 17 skills, shown as pictures); the alpha upright 374 x 453 of 500 (a RAIDER, 17 skills); the alpha on its side 708 x 285 of 330 (a MARKSMAN, 5 skills). 0 page errors. The room is less than the screen because the phone's layout lifts the sheet clear of the phone.
THE SEAM WITH UI THREE (rule 448, the coordinator's word): your eight bars are kept as they are inside my slip; the sheet, the speaking cards and the shot's white are mine; THE
MAN'S CARD ON THE PHONE is in your file (slices/bohemia_phone.js .fight) and rule 450 names it mine: I hand you the design (nothing under 11 points, nothing cut, every button a
thumb, RETREAT away from WAIT and AUTO, the sheet's board) or the coordinator says I edit a marked block; the sheet grows from his face (448(a)), a grow-in is yours or mine on your word.
NAMED, NOT MINE: HUD OVERLAP 14/1 ('MISSING: phonebtn', the city file); SETTINGS 2 legs; THE FIGHT BY HAND, QUICKER 18/2; the VOTE tab's landing legs; the registry's orphans; PAGES PUBLISH's cap.

NEXT, in order (rule 450(a), ask row 621): TWO CARDS LEFT.
 (1) THE MAN'S CARD ON THE PHONE (the one he sees every turn: 5 point numbers, a cut status line, buttons of 25 by 27 points). Blocked on the seam above (UI's file).
 (2) THE CARD THAT OPENS A FIGHT, with the why sentence from the leader's face. BLOCKED, AND THE BLOCKER IS NAMED: the meet card's men are the MAP's models and the fight deals its
     own, so a face on the card would not be the man in the fight (ONE ID, ONE WHOLE PERSON). The band's looks must be handed from the map to the fight first (COMBAT THREE's
     hand-over; the card is RUN's #meetcard). slices/bohemia_fight_why.js can already be asked before the fight (how, who, pick).
 (3) THE TURN ORDER back on the glass in the game; one material for the speaking cards (#vet is still pale paper).
 (4) THE LIBRARY PAGE on Rogue Fable 4's screen and card (the library has none): owed before any card is called final.
[bb Battle Brothers' man's page is a portrait, stats, perks and a paper doll; ours was a list of numbers and is now a face, eight words and what he can do]
[analog horror: an ID photograph pinned to a dark board, and under it one sentence on how to stop him]

FIGHT SCREEN (fight-screen-01gkdyus): 11/14 -- [shot flash] SHIPPED aa809c1d5, BUILD 11/14l - EVERY SHOT IS FELT, BUILT, NOT YET SEEN (rule 450(b)(c)(d); ask row 622). VOTE fight-screen-every-shot-is-felt-11-14 (stand_in; the card PLAYS it).
Record: records/BOHEMIA_FIGHT_SCREEN_EVERY_SHOT_IS_FELT_11_14_26.md.
WHAT: every gun fired by anyone throws a flash at its barrel and a quick white hit across the whole glass, bigger for a bigger gun, never a strobe
(a volley is one flash, three a second at most), soft by SETTINGS' new FLASH switch (boh.flash), MOTION: LESS or the phone's reduce-motion.
WHERE: records/target/bb/fight_shot.json (every number); slices/BOHEMIA_FIGHT.html block __EVERY_SHOT_IS_FELT__ (shotSoft, shotKind, shotFelt on the
gun's line in startAnimHeard beside FEEL's wShot, tickShot in the frame, shotBarrel after blitMan; #shotflash; UI.shotSeen and UI.shotLog are what the
glass did; window.__SHOT_SOFT lets a page show both ways; window.__SHOT_HOLD_MS holds the barrel flash for a still); the FLASH row is a marked block in
slices/bohemia_settings.js (flashSoft, flashBtn); slices/vote/FIGHT_SCREEN_EVERY_SHOT_IS_FELT.html plays it.
GATE EVERY SHOT IS FELT 7/0 (S1 to S5, two plants; S3 to S5 a browser), registered. THE WHY LINE 15/0.
ON THE PAGE: RESULT: 12 fights on the page, 71 gun shots counted by the glass, 71 whites, each at its gun's peak: the alpha upright 3 of 3 whole, the alpha sideways 3 of 3, the demo sideways 3 of 3, the demo upright 2 of 3 whole (its third fight had ONE shot, a rifle out of the dark: the screen whited at 0.58 and no barrel was drawn, as it is meant to; too few shots for the run's own count, said plainly). The FLASH switch pressed by a finger on all four: SOFT then FULL, and the next fight's flashes followed it every time. 0 page errors.
NAMED, NOT MINE (red on clean main too): SETTINGS gate's 'clears the thumb' (26 controls at 36 points; FLASH makes 27) and its QUIT leg; THE FIGHT BY
HAND, QUICKER 18/2; the VOTE tab's landing legs; the gate registry's orphans; PAGES PUBLISH's cap.
FOR FEEL: nothing of __THE_FIGHTS_WEIGHT__ was edited; shotFelt is called on the line after wShot. FOR UI: one marked row (FLASH) in your settings file.
FOR TUNING: fight_shot.json's felt numbers are yours to move. FOR SOUNDS: the flash's moment is the shot's (a.at + 0.35 of the beat).

(its NEXT and the teardown's note are carried by the newest block.)
[bb Battle Brothers' handgonne smokes and its screen never flinches; ours flinches on every shot, and never strobes]
[analog horror: the white is a tape's overexposed frame: the picture gone for two frames, and back]

FIGHT SCREEN (fight-screen-01gkdyus): 11/14 -- [why line] SHIPPED 4a3eaf088, BUILD 11/14k - EVERY FIGHT SAYS WHY, BUILT, NOT YET SEEN (rule 449(a); ask row 617). VOTE fight-screen-the-why-line-11-14 (stand_in).
Record: records/BOHEMIA_FIGHT_SCREEN_THE_WHY_LINE_11_14_26.md.
WHAT: every fight opens with ONE sentence saying why this group is on him, from a face. The table is records/target/bb/fight_reasons.json
(13 hows, 18 whos, 17 reasons, 67 rules, 163 sentences, draft:true; a modder edits it, MODDING.md says how); the chooser is
slices/bohemia_fight_why.js (how, who, pick); the card is #why in slices/BOHEMIA_FIGHT.html, block __THE_WHY_LINE__ (whyHandOver,
whyFacts, whyLeader, whyOpen, tickWhy; UI.why while it is up, UI.whySaid = what was said and why, for gates and EYES).
HOW IT KNOWS: how the fight began = the shell's window.__FIGHT_NOW.why (the map's hand-over word; FIGHT_OPTS.why for a test) plus the
fight's own flags (S.arena, FIGHT_OPTS.camp, S.boss); who they are = the kinds on the board; facts = they hold this ground, the animal
lives here, food in the wagon (bohemia.supplies.v1), CLOUT at 1,800 (bohemia.renown.v1).
THE FLOOR: tickWhy runs before tickVet in the frame; teach() and the commentary wait on UI.why and UI.whyDone (never two cards at once).
The hold is on songBeat(), not beatMs(), so 4x does not shrink it.
GATE THE WHY LINE 15/0 (W1 to W9, four plants; W9 is a browser leg on the fight's own page), registered.
ON THE PAGE: 36 of 36 fights said why and were whole on every check: the demo upright 9 of 9, the demo sideways 9 of 9, the alpha upright 9 of 9, the alpha sideways 9 of 9 (390 x 844 and 844 x 390 at 2), 0 page errors. On main's page, the same road fight: no sentence (the BEFORE half of the VOTE card).
NAMED, NOT MINE: PAGES PUBLISH's cap (the published surface measured 904 MB against 900 before this ship; this ship adds under 0.4 MB:
the table, the chooser, one VOTE picture and its first frame).
FOR BOSSES, BESTIARY, FACTIONS, ARENA: A NEW ENEMY KIND IN A FACTION WE HAVE NEEDS NOTHING FROM YOU: it is grouped by its faction off the fight's own tables
(the gate caught BOSSES' sergeant and then kids_horn and heavy_bruiser on this ship's way in, so the table reads factions now; a boss's man and a pit fighter
nobody names fall in boss_crews and pit_fighters). ONLY A BRAND NEW FACTION needs a line: add it under who.<group>.factions in
records/target/bb/fight_reasons.json (or its own group and rules), else THE WHY LINE's W3 names it. At runtime a kind in no group still gets a true sentence by its class.
FOR UI THREE: #why is a new card at the fight's top left where #vet and #call stand; nothing of yours was edited. FOR WORDS: the 163
sentences are yours to rewrite in the JSON. FOR EYES: read UI.whySaid on the fight's frame.

(its NEXT is the newest block's.)

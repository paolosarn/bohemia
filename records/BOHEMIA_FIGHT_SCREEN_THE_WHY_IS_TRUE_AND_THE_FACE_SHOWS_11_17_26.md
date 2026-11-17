# FIGHT SCREEN TWO: THE WHY IS TRUE, THE FACE SHOWS (11/17/26) -- BUILD 11/17o - THE WHY IS TRUE, THE FACE SHOWS

Ask rows 631 and 630, both FOUND BY EYES walking this lane's builds on a phone (records/BOHEMIA_EYES_WALK_THE_11_14_BUILDS_11_17_26.md),
both on things he asked for by name (rule 449(a): 'I want there to be a sentence, just one sentence... why the enemies are attacking
you'; rule 450(a): the combat cards). One build. VAMILY rules 449(a), 450(a), 441, 454(a), 12; the law EVERYBODY HAS A FACE.

## ROW 631: THE WHY LINE SAID THE ROAD'S WORDS WHATEVER STARTED IT AND WHEREVER IT WAS
EYES: on the job to get a doctor's cold box back, the THUG said 'They paid you to clear this road, and we still need it.'; 12 of 12
road stops a THUG with one of three road lines, on the casino floor and in the garage too.

THE CAUSE, MEASURED (rule 12: the coordinator's guess was the hand-over; it was not the hand-over):
1. THE FIGHT WAS TOLD THAT A JOB BEGAN IT, NEVER WHICH JOB. The word the map hands the fight is contract:<the job's id>:<who>. The
   table read every job as one job (the first job the game had: clear a crew off a road), so its sentences for a job named a road
   to clear whatever the job was. The job's kind (its plays: recover-return, clear-crew, hunt-kind, ...) was on the map's own held
   jobs the whole time; nobody asked.
2. NOBODY ASKED IF THERE WAS A SKY. The road's sentences ('This road is ours...') fit any road stop; a road stop dealt on a casino's
   floor or a garage's deck said them under a ceiling.
3. ONE MOUTH, THREE LINES: the chooser kept one rule per start, so a start with three sentences turned the same three for ever.

THE FIX (no sentence written or rewritten: rule 454(a)):
- THE TABLE SAYS WHEN A SENTENCE MAY BE SAID (records/target/bb/fight_reasons.json, a new block 'truths' and an 'if' on 22 rules):
  a sentence that names a road, the open sky, a job to clear or a job to hunt carries what must be so (outside, job_clears,
  job_hunts, job_pump). A sentence with no 'if' is true whenever its rule fits. how.robbed and how.job fall to the road's rules when
  nothing of their own is true.
- THE FIGHT ASKS THE MAP WHICH JOB (slices/BOHEMIA_FIGHT.html whyJob): it reads the job's kind off the map's own held jobs by the id
  in the word it was handed. READ ONLY: the hand-over is not edited and nothing new is handed (COMBAT THREE's stays as it is).
- THE FIGHT ASKS ITS OWN BOARD IF THERE IS A SKY (whyInside: a casino, a garage, the tunnels, an inside, a board with a ceiling).
- THE CARD ASKS THE SAME TWO THINGS BEFORE THE FIGHT (slices/bohemia_fight_opener.js truths: the ground the map's own card names and
  the held job), so the card and the bell say the same true sentence.
- THE CHOOSER (slices/bohemia_fight_why.js pick): only sentences whose needs are so; it pools true sentences across the rules that
  fit until there are at least two, so the wording turns; it remembers the last sentence per start and per mouth; IF NOTHING IS TRUE
  IT SAYS NOTHING (the fight keeps what it knew on UI.whySaid.none) rather than say something false.

WHAT A PLAYER HEARS NOW: the cold box job's holders say 'You took a job on us, so come and try to finish it.' or 'Somebody paid you
to come here, and that was their mistake.'; never a road. A crew met under a ceiling never names a road or a sky. A job to clear a
road still says the road's words, because there they are true.

## ROW 630: THE CREW'S FACES WERE UNDER THEIR HELMETS
EYES: on the man's sheet, the why line's face and the phone's fight panel the helmet filled two thirds of the frame; YOU and DESI
showed a nose and a mouth and no eyes; RAUL the helmet and nothing else.

THE CAUSE, MEASURED on the fight's own page (the three of the crew, every head piece): PORTRAIT's cell is cut close to the head
(his crown on the cell's first row), and the head piece is stood on the middle of his head and sized to his head across
(engine/bohemia_wear.js face(), CHARACTER's: right for the body it was made for). On a cell with no room over the crown the dome is
cut off by the frame and what is left of it lies over his eyes. Neither file is wrong alone; the frame this lane put round them was.

THE FIX, in this lane's own drawing only (a new file slices/bohemia_fight_face.js; the fight's drawPortrait and the opening card
call it; the wear file, the gear's pictures and PORTRAIT's cells are not edited):
1. THE PICTURE STANDS BACK AS FAR AS THIS GEAR NEEDS: how far the gear reaches over the cell and past its sides is measured once
   off the wear file's own drawing; the face is drawn that much smaller, stood on the frame's foot, so the gear is whole inside the
   frame (a mask needs nothing; a tall hat stands him back the most, never past 64 parts in 100).
2. HIS EYES READ: the gear is drawn whole and then opened in one band across his eyes (brow to under the eyes, measured off his own
   picture), the way a helmet is cut for the man inside it. The dome over the band and the mask, cheek plate or strap under it stay.
A man with nothing on his head is drawn exactly as before.

SAID PLAINLY: under a tall dome his face is SMALL. With the crew's hard hat the picture stands back to 69 parts in 100, so on the
phone's card (a 26 point frame) his eyes are two dots under a brim. He has eyes on every surface now and the whole helmet is in the
frame, but a face that truly leads needs a head piece DRAWN FOR THE PORTRAIT (brim over the brow, crown inside the cell). That is
PORTRAIT's and CHARACTER's, routed below.

## THE GATES
THE WHY LINE (gates/the_why_line_gate.js, registered, amended) 20/0 (87 kinds of 87 in a named group): W6 never the same wording twice in a row, across skies and job
kinds (a repeat only where ONE sentence is true, listed); W10 ONLY A TRUE SENTENCE IS SAID, every start x group x sky x job kind, and
the two EYES heard by name; planted: the table with its needs stripped (the gate fails it); W11 no start is left silent, and the
list for WORDS; W12 on the fight's own page a job to get a thing back names no road and a board under a ceiling names no road or sky.
THE FACE SHOWS UNDER THE HELMET (gates/the_face_shows_under_the_helmet_gate.js, registered, new) 7/0: the three of the crew x the
105 head pieces in the wear table = 315 faces on the fight's own page: the band over his eyes is his own face (H2), the gear inside
the frame and clear of its rim (H3), never past 64 in 100 and a bare head drawn as before (H4), nothing of CHARACTER's or PORTRAIT's
edited (H5). Planted: this lane's file served empty.

## ON THE PAGE HE PLAYS (rule 441(a); tools/bohemia_fight_screen_the_why_is_true.js)
The real page opened the way a stranger opens it, a phone upright (390 x 844) and on its side (844 x 390), a band met through the
map's own card, ENGAGED with a finger, the bell read, FIGHT pressed, his man's card on the phone and his sheet opened with a finger.
- THE DEMO UPRIGHT and THE ALPHA ON ITS SIDE, the job case (a held job to get the cold box back, its holders met): the card and the
  bell both 'You took a job on us, so come and try to finish it.' from the RAIDER whose face the card showed; the fight's own account
  (UI.whySaid.truth): plays recover-return, job_clears false. No road.
- THE DEMO ON ITS SIDE and THE ALPHA UPRIGHT, the ceiling case (a road crew named on a casino's cell): the card read the ground as
  INSIDE THE CASINO and said 'A cart that full does not get past us.' (no road, no sky); the bell said the same.
  NOT PROVEN THROUGH THE SHELL: a bell under a real ceiling. The map will not start a road stop on a casino's own cell (the town's
  door holds what comes for him off a town's ground), so the fight the shell dealt was on the road beside it. The bell under a
  ceiling is proven on the fight's own page (W12), not through the map.
- THE FACES, all four runs: the three of the crew in the hard hat, 12 faces framed in each fight (BohemiaFightFace.n), the picture
  standing at 0.686, the band over the eyes clear. 0 page errors on all four.
BEFORE, the same tool on the files as main had them: the helmet over the whole frame on his sheet and on the phone's card.

## STARTS WITH NO TRUE LINE YET, FOR WORDS TWO (rule 454(a): nothing was written here)
NO START IS SILENT: every start x group x sky x job kind has at least one true sentence (W11: 0 silent).
THIN, ONE TRUE SENTENCE, SAID EVERY TIME (68 starts; ALL=1 node gates/the_why_line_gate.js prints every one at W11). Each needs two or
three sentences of its own. Counted by start x group (a start is also a sky and a job kind):
- A JOB THAT IS NOT A CLEARING (a hunt, get a thing back, carry, guard, escort, a job with no kind named), 6 each, both skies:
  the machines, the Water People, the pit's fighters, a boss's crew, the new crews, and BESTIARY's four new factions (the Flock,
  the hired guns, the head takers, the eye in the sky). Under a ceiling only, 3 each: the Block Watch, the scavengers.
  Today each says its one line that names no road ('Somebody paid you to come here, so come and earn it.').
- ROBBED BY SCAVENGERS UNDER A CEILING (4, every job kind); and scavengers met on a road, a street or by chance under a ceiling (3).
- GUARD x the dead (1).
BESTIARY'S FOUR NEW FACTIONS (11/17i, on main while this was built: flock, hired, takers, casino) were in NO group of the why table,
so the gate's W3 and W7 went red on main. They are groups of men now, under BESTIARY's own names, and say the sentences every
crew of men says (job.men, road.men, hunted.men ...). No sentence of their own yet: the Flock does not talk like a road crew, and a
head taker comes for one man. Those are WORDS TWO's.
THE MAMMOTH (BESTIARY, on main while this shipped) is one of the ones that charge, never one of the lab's giants: the giants' sentence says it needs meat, and a mammoth eats grass.
- ANY ROAD STOP UNDER A CEILING is down to the road's sentences that name no road (the cart, the toll): true, but few.
THE WORDS THAT WOULD MAKE THESE RICH: a sentence per JOB KIND (the cold box: 'that box is ours now'), which needs the job's THING
and WHO SENT HIM in the sentence. The fight can already read both off the held job (item, from); the table has no slot for them
yet. That is a WORDS TWO decision, not this lane's.

## ROUTED (proposals; the coordinator adds jobs)
- WORDS TWO: the list above; and the table can now carry 'if' on any sentence, so a new sentence can say when it is true.
- PORTRAIT and CHARACTER: a head piece drawn for the portrait cell (above). Until then the frame stands back.
- COMBAT THREE: nothing asked. The job's kind is read off the map's held jobs; if the hand-over ever carries the job's kind and the
  board's ceiling itself, the fight's two reads (whyJob, whyInside) become one line each.
- EYES: UI.whySaid on the fight's frame now carries needs (what the sentence needed) and truth (outside, job_clears, job_hunts,
  plays); BohemiaFightFace.said and .n say how the last face was framed.

[bb Battle Brothers never says why a band is on you; ours says it, and now only says what is so]
[analog horror: an ID photograph of a man in a helmet where somebody cut a slot in the print so you could see his eyes]

*FIGHT SCREEN TWO, 11/17/26.*

# FIGHT SCREEN -- the handoff block (written only by FIGHT SCREEN, newest first)
# A fresh lane opened by the coordinator 11/14 on Paolo's words (VAMILY rule 449; ask rows 616, 617). On VAMILY: pull main, re-read
# CLAUDE.md and the VAMILY front page (rules 449, 448, 447, 441, 442(b), 435), then continue from the newest block below.
# WHAT THIS LANE OWNS: what sits on the glass over the fight (the buttons, the bars, the man's card, the turn order, the end screen,
# the speaking cards) and the fight's opening line. NEVER EDITED BY THIS LANE: the boards, the hand-over from the map and AUTO (COMBAT
# THREE's). UI THREE was told the fight's unit card; by rule 449 it is this lane's now.

FIGHT SCREEN (fight-screen-01gkdyus): 11/14 LATEST -- [shot flash] SHIPPED @@SHA@@, BUILD 11/14l - EVERY SHOT IS FELT, BUILT, NOT YET SEEN (rule 450(b)(c)(d); ask row 622). VOTE fight-screen-every-shot-is-felt-11-14 (stand_in; the card PLAYS it).
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

NEXT, in order (rule 450(a), ask row 621; rule 449(b), ask row 616): THE CARD, his answer to 'which part do you hate most'. NOT STARTED.
 (1) THE TEARDOWN, a record: stills of the fight on a phone both ways (the two proofs' shots are a start), every piece on the glass named and measured
     against the laws (light and form; analog horror at the source; the same HUD as the map; rule 448's phone spot; 442(b)) and the world's best
     (Battle Brothers' and Rogue Fable 4's own cards, from reference/library). In the game the glass is: the speaking cards (#why #vet #call, top
     left), the paper strip #say, the bars over the men, the chalk line, and THE PHONE (slices/bohemia_phone.js .fight: the man's card with three bars
     and AP pips, FIGHT / END TURN, wait, back, auto, speed, RELOAD, STRIKE, two app buttons). The fight page alone also has #top (round, turn
     order) and #bot. FIRST FINDING TO MEASURE: in the game the turn order is not on the glass at all.
 (2) THE OPENING CARD FIRST (it carries the why line): who is on him, how many, and the one WHY sentence from a face, as a FINISHED piece opening out
     of the phone's spot (448); today the why line is the fight's present speaking card and the map's MEET card is RUN's.
 (3) THE MAN'S CARD inside the fight, finished, one look with the rest of the glass, readable in one glance upright and sideways.
 Each compared to the world's best before it is called done; each proven on the real page both ways; its VOTE card the before and the after.
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

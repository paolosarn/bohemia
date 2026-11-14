# FIGHT SCREEN -- the handoff block (written only by FIGHT SCREEN, newest first)
# A fresh lane opened by the coordinator 11/14 on Paolo's words (VAMILY rule 449; ask rows 616, 617). On VAMILY: pull main, re-read
# CLAUDE.md and the VAMILY front page (rules 449, 448, 447, 441, 442(b), 435), then continue from the newest block below.
# WHAT THIS LANE OWNS: what sits on the glass over the fight (the buttons, the bars, the man's card, the turn order, the end screen,
# the speaking cards) and the fight's opening line. NEVER EDITED BY THIS LANE: the boards, the hand-over from the map and AUTO (COMBAT
# THREE's). UI THREE was told the fight's unit card; by rule 449 it is this lane's now.

FIGHT SCREEN (fight-screen-01gkdyus): 11/14 LATEST -- [why line] SHIPPED 4a3eaf088, BUILD 11/14k - EVERY FIGHT SAYS WHY, BUILT, NOT YET SEEN (rule 449(a); ask row 617). VOTE fight-screen-the-why-line-11-14 (stand_in).
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

NEXT, JOB TWO [fight rework] (ask row 616, rule 449(b)(c)(d)): NOT STARTED beyond the stills this ship took. In order:
 (1) THE TEARDOWN, a record: stills of the fight on a phone upright and sideways on the demo and the alpha (the proof run's shots are a
     start), EVERY piece on the glass named and measured (the phone's fight page in slices/bohemia_phone.js: the card, three bars, the
     AP pips, FIGHT / END TURN, wait, back, auto, speed, RELOAD, STRIKE, the two app buttons; in the fight's frame: the paper strip
     #say, the speaking cards #why #vet #call, the bars over the men, the chalk line, the tags; the fight page alone also has #top's
     round and turn order and #bot) against the laws (all UI built with light and form; analog horror at the source; the same HUD as
     the map; nothing floats over the world to name it; rule 448's phone spot) and the references (Rogue Fable 4 first, Battle Brothers
     second, from reference/library).
     FIRST FINDING, from this ship's stills: IN THE GAME THE TURN ORDER IS NOT ON THE GLASS AT ALL (the fight page's own #top carries
     it; the shell's phone shows R1 and one man). Measure it before believing it.
 (2) ONE rebuilt look, in the game, the whole screen at once, never a patch; its VOTE card the before and the after side by side.
 (3) He was asked which part he hates most (the glass, the ground, the layout); until he answers it is the glass. Watch
     records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md row 616 for his answer.
[bb Battle Brothers' tactical screen opens silent; the contract told you why an hour ago. Ours says it at the bell, in one line.]
[analog horror: a neighbor with a pitchfork who says 'we live here']

STAFF (staff-01gkdyus): the camp's people in the fight, a new lane opened by the coordinator for VAMILY rule 468, ask row 667; written only by
this lane. 11/21 LATEST -- BUILD 11/21zb - THE STAFF FIGHT TOO (SHIPSHA), BUILT, NOT YET SEEN (rules 468, 461 as amended 11/21, 441, 454(a), 465, 467; ask row 667).
Record: records/BOHEMIA_STAFF_THE_STAFF_FIGHT_TOO_11_21_26.md. VOTE staff-the-staff-fight-too-11-21 (stand_in). The research: records/BOHEMIA_RESEARCH_THE_STAFF_FIGHT_TOO_11_21_26.md.
This lane schedules nothing and calls nothing that waits for a person (461(c) amended). No line rewritten (465): the words added are
the fewest, draft (the hall's 'Stands in your fights. One of your 12.' and 'No room: your company is N of 20.', the crew title's 'N CAMP').

WHAT IS LIVE (the demo and the alpha):
- Every follower hired at a town's hall (RETINUE's eighteen) stands in every fight but the pit, behind his back row (the third column and
  behind, filled from the middle out), with a small tent drawn right of his bars. Battle Brothers' Indebted at level one: 40 to 50 health,
  resolve 25 to 40, initiative 95 to 105, one of the five bad traits (Clumsy, Craven, Fainthearted, Fragile, Hesitant) rolled once from
  his id and kept, a box cutter (the game's knife row is its PISTOL), no armour, nothing can be put on him, level one forever, no share of the fight's XP.
- He starts Wavering and never climbs past Steady: two failed nerve checks and he runs; his fall or flight shakes the line and the
  camp. Struck down means dead, every time.
- He moves himself, never by his hand: out of their reach when a tile is out of it, toward his nearest fighter; the blade only when cornered.
- Raiders, desert crews, the lab's keepers and the kids go for him (x1.5: their blows, their walk, their hunt counts him two steps
  nearer); beasts x0.6 and soldiers x0.5 on top of what the fight already does (a blow goes where it hurts, a cook is soft). One fight in
  five against raiders (not on day one) up to two of their melee men start on his back edge, more than a turn's run from the camp.
- AUTO guards the camp: a blow on a man next to the staff x1.3, and a turn that ends beside a threatened staff member is worth 15 more.
- At a camp fight (a crew found him camped) the camp stands by its own fire, within three tiles, behind his front column.
- Each one takes a place in the fight's cap first (12, 16 for THE BLOCK WATCH and THE DEBT COLLECTORS): five staff, seven fighters.
  The enemy is sized to his fighters only. The hall's Hire and TAKE ON shut at the origin's company cap (20, 25, 18, 12), the camp
  counted; the crew screen's title counts the camp.
- After the fight, the dead and the taken (on the board when his side lost or left) leave the camp for good: his help with him, his face
  on the dead list, never dealt again; the kind goes back in the town deal as a NEW person of the valley (a face nobody of his wears, a
  rolled name, the same job and price, none of the dead one's words).
- CHANGED FROM THE RESEARCH, MEASURED (the record's list): the knife row is the game's PISTOL, so they carry a box cutter; the pull is
  raiders x1.5, beasts x0.6, everyone else x0.5 (at the draft a third to a half of the camp died every fight); the raid starts more than
  ONE turn's run away (two is never there on a 20 by 15 board), melee men only; the camp's fall SHAKES the line (D7 turned: with no shake
  three staff made the fight easier, 73% won against 65%; with it 69%); at a camp fight the camp stands by its own fire.

HOOKS I TOUCHED IN COMBAT FOUR'S FIGHT (slices/BOHEMIA_FIGHT.html, every one marked __THE_STAFF_FIGHT_TOO__; COMBAT FOUR owns the file):
  deployment: setup() (the cap: staff take places first; staff units; the board's room counts them), deployStaff(), deployMove() (staff
    only in the back column and behind, no swap puts one in front), formationNow() (fighters only);
  targeting: bestTarget() and the blow planner (campPull x guardsCamp), the walk's score (a tile reaching the camp), huntField() (the camp
    nearer to raiders and beasts), planTurn's add() (campBeside), raidFromBehind();
  morale: check() (Steady the top rung, no origin way on staff), ripple() (a staff fall shakes fighters only if the file says so);
  and, because the design needed them: fall()/deathChance() (dead), experience() (no share), aiStepAuto() (staffStep), afterAction()/
    closedOut() (staff alone never hold the board), the first-round initiative (fighters only), crewControlled() (never his hand),
    homeMessage()/spoils looks/recap (staff ride home in their own list, never in crew), drawMan() (the tent mark), FIGHT exports.

FILES: records/target/bb/retinue.json (staff block, a modder's); records/target/bb/ai.json (camp_pull, raid, guards_the_camp,
archetypes.staff); engine/bohemia_camp.js (__THE_STAFF_FIGHT_TOO__: staffRules, person, staff, lose, dead, deadLooks; row() is the
person now; the __STAFF_RULES__ copy); tools/bohemia_retinue_bake.js (bakes the staff copy too); slices/BOHEMIA_FIGHT.html (above);
slices/BOHEMIA_ALPHA_0_9.html (the door's o.staff, nfCamp, the after-fight lose); slices/BOHEMIA_SETTLEMENT_SCREEN.html (companyNow,
staffWords, companyFull; Hire and TAKE ON shut at the cap; the post never deals a camp face); slices/BOHEMIA_ROSTER_SCREEN.html (the
title); slices/fight_rig (the thirteen camp people's fight sheets and faces: tools/bohemia_staff_the_camp_bodies.py over RUN TWO's own
tool); gates/the_staff_fight_too_gate.js (THE STAFF FIGHT TOO); tools/bohemia_staff_on_the_phone.js (the phone proof);
tools/bohemia_staff_the_card_picture.py (the VOTE card's picture). Record: records/BOHEMIA_STAFF_THE_STAFF_FIGHT_TOO_11_21_26.md.

NUMBERS (100 fights a row, headless, AUTO both sides): routine 8 v 6: 90% won with no camp, 92% with 3 staff, 12.0% of the camp dead a
fight; tough 8 v 9: 65% / 69%, 25.7% dead; a full company 12 v the same 12: 68.3% -> 25.8% with 5 staff (7 fighters), 48.7% dead.
ON THE PHONE: the demo and the alpha, upright and on its side, all green (behind the line, own body and face, the tent, no sideways
scroll, the cook's death kept by the camp's book, nothing threw); the camp costs no frame against a no-camp control on one valley.
GATES: THE STAFF FIGHT TOO 32/0 (--plant red: S1a, S4a); NO CAP ON HOW MANY FIGHT 7/0; EVERY MAN ACTS ON AUTO 22/0; THE RETINUE 29/0, THE HIRE PRICE IS THE FORMULA 10/0, THE ORIGIN SETS THE COMPANY 7/0, EACH ORIGIN ITS OWN 19/0;
SETTLEMENT SCREEN 74/1 and VOTE TAB 61/5: every red the same on main without this build (the shop's relation price; the alpha's landing
and other lanes' cards), none mine.

NOT DONE, NEXT, IN ORDER: (1) EYES' walk (441(b)); (2) the crew screen's line-up draws the camp in the back; (3) a feed post when one dies (FEED/UI,
words WORDS THREE's after his voice, 465); (4) TUNING's table takes the drafts; (5) if he wants AUTO to keep the camp, a man held back beside
it (the guard's numbers change nothing, measured); (6) RUN TWO: the thirteen have fight sheets now, an index re-run would put them at the
post; (7) other doors that add a man (joiners, rescues) against the cap.
[bb Battle Brothers: five followers by renown who never fight, a fight of 12 (16 for two origins), the Indebted who die when they fall.]
[analog horror: when the cook dies her pot stays on the fire; the next cook the hall deals never asks whose pot it was.]

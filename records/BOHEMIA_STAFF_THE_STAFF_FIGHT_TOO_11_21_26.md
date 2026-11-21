# THE STAFF FIGHT TOO: BUILT (STAFF, VAMILY rule 468)

Paolo 11/21, his words: 'it's just a little too easy... maybe they are forced to being in combat, they're roaming around with you, and
the game becomes more about protecting your staff... if your staff permanently dies you gotta get new people at different
settlements... they're not gonna have the best traits and that's OK... they try to run away way quicker... the better you want your camp
to be, that means less people you can run around with, because there's a limit'. The research and the design:
records/BOHEMIA_RESEARCH_THE_STAFF_FIGHT_TOO_11_21_26.md (section C). This page is the build of section C and what was measured doing it.

## FOR PAOLO

Your camp people now come into every fight. The cook, the scout, the surgeon: whoever you hired at a town's hall stands behind your
back row with a work blade and no armour. They are weak (40 to 50 health, one bad trait each), they start scared, and they run after two
bad nerve checks. Raiders and animals go for them. If one goes down, they are dead for good: their help is gone and you hire a new person
for that job in a town. Every camp person takes one of your 12 places, so a full camp means fewer fighters.

## WHAT IS BUILT

Section C of the research page, as written, except where the next section says (each one measured):
- C1 WHO COMES: every follower with him (engine/bohemia_camp.js staff()) to every fight but the pit (the alpha's door hands o.staff beside
  o.company, never in it; an arena hand-over gets none).
- C2 WHERE: behind his back row (the fight's deployStaff(): the third column and behind, from the middle out, never the front column, never
  beside a man of theirs at the bell); in the line-up he may move one only inside his back column and behind it (deployMove), and no swap
  stands one in front. A small tent is drawn right of each one's bars (drawMan, CAMP_MARK), so he reads 'camp', never 'a fighter'.
- C3 WHAT: Battle Brothers' Indebted at level one (records/target/bb/retinue.json staff, a modder's block): 40 to 50 health, resolve 25
  to 40, the Daytaler's skills and defences, initiative 95 to 105, one of the five bad traits a recruit can carry (Clumsy, Craven,
  Fainthearted, Fragile, Hesitant) rolled once from his id and which person he is and kept, a work blade, no armour, nothing can be put on
  him, level one forever and no share of the fight's XP.
- C4 NERVE: he starts Wavering and never climbs past Steady (two failed checks and he runs, a fighter needs three); his fall or his flight
  shakes his line like any man's (Battle Brothers' ally-dies check at his level one's small worth; retinue.json staff.shakes_fighters
  true, measured, below) and the other staff; the origin's own way (the faithful never flee, the whip, the deserters first) is his
  fighters', never the camp's.
- C5 THE ENEMY: ai.json camp_pull multiplies a staff member's worth on their blows (bestTarget and the blow planner), on their walk (a
  tile that reaches him) and in their hunt (he stands nearer to them than he is); the raid from behind (ai.json raid).
- C6 THE LIMIT: the fight's setup() takes the staff's places out of the cap first (fighters = cap - staff, YOU always; the rest in the
  reserve as before; staff never in the reserve); the enemy is sized to his fighters (the map's party and the fight's fallback band read the
  company, never the camp). The hall's Hire and TAKE ON shut at the origin's company cap with the camp counted (companyNow, companyFull, the
  words why, draft); the crew screen's title counts the camp ('YOUR COMPANY 12 / 20   12 IN A FIGHT, 3 CAMP').
- C7 DEATH AND RE-HIRING: struck down is dead (fall(), deathChance() 1); after the fight the alpha calls BohemiaCamp.lose(id, why) for each
  one dead or taken: out of the retinue (has/mult/plus drop by themselves: no cook, the food bill back to x1), his face on the dead list
  for good (the post never deals it, nor a camp face); his kind goes back in the town deal (three of eleven a week a town, about one town
  in four) as a NEW person (BohemiaCamp.person(id): a valley person whose body is on the fight's board and whose face is drawn, nobody of
  his wears and nobody dead wore, the hall's own pool, the place's people first; a name rolled by the one names engine; the same job,
  numbers and price; none of the dead one's words: the card shows his job and its effect, his joining line is the game's plain one).
- C8 THE END: the fight is lost when no fighter of his stands (staff alone never hold it); staff ride home in their own list (homeMessage
  staff: id, name, look, dead, taken, cowering, escaped, hp, kills), never in crew, looks or the recap's men; a retreat takes them with it.
- C9 THEIR TURN AND AUTO: ai.json archetypes.staff (staffStep): never by his hand (crewControlled); he holds the camp until a man of theirs
  can reach him by their next turn, then steps where the fewest can, beside a fighter if he can; the blade only when cornered. AUTO guards
  (ai.json guards_the_camp): a blow on a man beside his camp x1.3, a turn that ends beside a threatened staff member +15.
- THE BODIES: the thirteen followers whose looks had no fight sheet (B7) now have them, each his own model's walk and the six fight clips
  on DIRECTION's master rig, packed into YOU's cell with YOU's guns, his face on the fight's face strip (tools/bohemia_staff_the_camp_bodies.py,
  RUN TWO's own tool imported and called, nothing of it edited). ONE ID, ONE WHOLE PERSON: the cook on the board wears the cook's body.

## WHAT WAS MEASURED

THE FIGHT (the live fight's own rules headless, tools/bohemia_fight_headless.js; AUTO both sides; 100 fights a row on the same seeds;
four families in turn: roaming crews, the water people, the house, beasts; day 8):

| | won | rounds | his men down a fight | the camp dead a fight (each) | their blows on the camp |
|---|---|---|---|---|---|
| a routine fight, 8 of his against 6, no camp | 90% | 6.8 | 1.88 | | |
| the same with 3 staff | 92% | 6.8 | 1.71 | 12.0% | 7.3% |
| a tough fight, 8 against 9, no camp | 65% | 8.2 | 4.02 | | |
| the same with 3 staff, their fall shaking no fighter (the research's draft) | 73% | 8.4 | 3.52 | 22.3% | 7.8% |
| the same with 3 staff, their fall shaking the line (the build) | 69% | 8.3 | 3.76 | 25.7% | 7.8% |
| a full company, 12 against the same 12 (the gate's S10, 120 fights) | 68.3% | 8.3 | 5.45 | | |
| the same company carrying 5 staff: 7 fighters stand | 25.8% | 8.8 | 5.67 | 48.7% | |

WHAT IT SAYS, PLAINLY. Under his cap the camp costs no fighter, so the fight is about as winnable as before (inside the noise: 100 fights
is about five points either way), and what it costs is the camp itself: one in eight of them dies in a routine fight, one in four in a
tough one, each death his help gone and his price to pay again. With a full company the camp costs fighters, and that is where the fight
gets harder: five staff stand where five fighters stood, and against the band the map sizes for his twelve he wins a quarter of what he
won (the map's party reads the strength of his company's twelve strongest fighters, the reserve included; the camp never counts in it,
gate leg S6). The rounds stay inside a routine fight's length (6.7 to 8.8).

THE PHONE (rule 441; tools/bohemia_staff_on_the_phone.js, the one driver, a finger on the glass; A NEW CREW in the valley K7QM9X; his three
camp people written to the camp's book before the page's scripts, the one shortcut, said; a road crew off the town): the demo and the
alpha, upright (390 x 844) and on its side (844 x 390): 3 fighters and 3 camp of 12; every camp person behind his back row (column 3,
his front 5), in his own body and face, his tent drawn; no page scroll sideways; the cook struck down died, and after the fight the camp's
own book had her gone (has('cook') false, her face on the dead list) and kept the scout and the surgeon; nothing threw. All four green
(records/target/staff_11_21/staff_demo.json, staff_alpha.json).
THE FRAMES in the fight's first ten seconds on this box (its canvas is drawn in software): the demo 42.9 upright and 43.2 on its side with
the camp, 44.3 and 46.0 with no camp (a control, the same walk); the alpha on its side, one valley, 32.9 and 28.8 with the camp against
31.7 and 29.2 without. The camp costs no frame here. This box does not reach PLUMBER's 60 in a fight's first ten seconds with or without
it; said, not hidden. (Three earlier alpha runs on random valleys read 23 against 40: the board differed between them, not the camp; one
valley settled it.)

THE GATE: THE STAFF FIGHT TOO 32/0 (about 8 minutes), --plant red where it must (S1a 12 fighters and 3 staff stood; S4a 38 of 100 dead).
THE NEIGHBOURS: NO CAP ON HOW MANY FIGHT 7/0, EVERY MAN ACTS ON AUTO 22/0, THE RETINUE 29/0 (R9 on the baked demo), THE HIRE PRICE IS
THE FORMULA 10/0, THE ORIGIN SETS THE COMPANY 7/0, EACH ORIGIN ITS OWN 19/0. SETTLEMENT SCREEN 74/1 (the shop's relation price) is the same
red on main without this build (run in a worktree of 4523d2a4's successor); VOTE TAB's 5 reds are other lanes' cards and the alpha's landing
(quarantined), the new card passes its own legs.

## WHAT THE BUILD CHANGED FROM THE RESEARCH PAGE, AND WHY (each measured)

1. THE KNIFE IS THE PISTOL. The research gave them 'a knife (records/target/bb/weapons.json knife)'. In this game that row IS the PISTOL
   (weapon_lines.json dagger = PISTOL; ours.pistol_shot.by_row.knife rides a thrown row): the first build put a gun in every cook's hand,
   and three staff RAISED his win rate (79% to 90%, 120 fights against brigands). They carry the valley's work blade, the box cutter
   (cleaver class, 25 to 35, one hand), and the fight refuses any gun or thrown row for a camp follower.
2. THE PULL, MEASURED. At the research's draft (raiders x1.5, beasts x1.25, everyone else x1) a third to a half of the camp died every fight
   (8 of his and 3 staff against 9: 53% of the staff a fight; the house's crossbows 15 of 64 deaths, beasts 29). The fight already sends a
   blow where it hurts most and its marksman to the soft, and a cook is both. So soldiers (every other family) fight the company first
   (x0.5) and beasts are x0.6 (54% of the camp dead a beast fight at x1, 30% at x0.6: still the family that kills the most of it).
3. THE RAID'S DISTANCE. 'At least two turns' run from the nearest staff member' is never there: on the 20 by 15 board his camp stands 3
   tiles from the west edge and 5 to 9 from the others (0 raids in 360 fights). The raiders start on his back edge (the west side and the
   north and south sides behind his line), more than ONE turn's run from the camp, so no blow lands on it in their first turn, and only
   melee men (a crossbowman placed there shot a cook in round one).
4. THE CAMP HOLDS, THEN MOVES. The first staff turn stepped toward his nearest fighter every turn, so the camp walked into the fight behind
   the line; now it holds until threatened and then steps where the fewest of theirs can reach it (dangerAt), and uses the blade only when
   cornered.
5. AUTO'S GUARD. x1.3 and x2 lost the same camp in the same 40 fights: the guard fires (165 blows and 119 turns in 8 fights) but the man
   hitting the cook is already AUTO's best blow. The camp is kept by where it stands and how it moves; the numbers stay at x1.3 and +15.
6. THE CAMP'S FALL SHAKES THE LINE (D7 turned). The research's default was the Indebted's rule (a debtor's fall shakes no fighter): in
   Battle Brothers the debtors are the company's fodder; ours are the cook and the doctor. MEASURED (100 fights a row, 8 of his against 9):
   with no shake three staff made the fight EASIER (73% won against 65% with no camp: their blows spent on the camp, his men down 3.52
   against 4.02); with the shake 69%, and the line wavers when the cook dies, so keeping her alive is part of the fight.
7. AT CAMP (C2): when a crew finds him camped (CAMP THREE's opts.camp), the camp stands by its own fire, on the open tiles within three of
   it behind his front column, nearest first; whoever the fire has no room for takes the third column (S.campFire says where).

## FILES

records/target/bb/retinue.json (staff block); records/target/bb/ai.json (camp_pull, raid, guards_the_camp, archetypes.staff);
engine/bohemia_camp.js (__THE_STAFF_FIGHT_TOO__; the __STAFF_RULES__ copy; row() is the person now); tools/bohemia_retinue_bake.js (bakes
the staff copy); slices/BOHEMIA_FIGHT.html (every hook marked __THE_STAFF_FIGHT_TOO__; the list in handoffs/STAFF.md); slices/BOHEMIA_ALPHA_0_9.html
(the door's o.staff, nfCamp, the after-fight lose); slices/BOHEMIA_SETTLEMENT_SCREEN.html (companyNow, staffWords, companyFull; the post
never deals a camp face); slices/BOHEMIA_ROSTER_SCREEN.html (the title); slices/fight_rig (thirteen sheets, the face strip, fight_rig.json);
records/run2/people/person_town_<n> (their walks); tools/bohemia_staff_the_camp_bodies.py; gates/the_staff_fight_too_gate.js (THE STAFF
FIGHT TOO, in the suite); tools/bohemia_staff_on_the_phone.js (the phone); tools/bohemia_staff_the_card_picture.py (the card's picture);
the demo re-cut; the stamp.

## NOT DONE, NEXT

1. EYES walks it on the phone (rule 441(b)).
2. The crew screen's line-up shows the camp in the back (C10): the title counts them; the line-up does not draw them yet.
3. A post on the phone's feed when one dies (C7): the alpha keeps who was lost (window.__NF_STAFF_LOST); FEED's or UI's hook, the words
   WORDS THREE's when his voice is written (rule 465: no line written here).
4. TUNING owns every number: retinue.json staff, ai.json camp_pull, raid, guards_the_camp (all drafts).
5. AUTO's guard does not change who lives (measured): if he wants AUTO to keep the camp alive, the lever is a man held back beside it,
   not a bigger number.
6. RUN TWO: the thirteen camp people now have fight sheets; if the people mix is indexed again (tools/bohemia_run2_no_two_people_alike.py
   index), its 'fight' flag would put them at the post. The post already skips the camp's faces (recruitLooks reads BohemiaCamp.looks);
   a man not hired yet is not covered.
7. Other doors that add a man to the company (a joiner, a rescue) are not checked against the cap; the hall's Hire and TAKE ON are.

[bb Battle Brothers: five followers by renown who never fight, a fight of 12 (16 for the Militia and the Manhunters), and the
Manhunters' Indebted who die when they fall; ours puts the followers on the board as the Indebted, and takes their places from the 12.]
[analog horror: when the cook dies her pot stays on the fire; the next cook the hall deals never asks whose pot it was.]

STAFF 2 (staff2-01gkdyus, took over from STAFF at a full context): rule 471, THE STAFF PUSH A CART, ask row 709. Written only by this lane.
*** 11/27 HANDOFF READY (context near full) -- FOR THE NEXT STAFF: the coordinator's order 11/27 21:51 is 'your handoff's order (the
brigand's body, his fist on the handle, the crew screen), inside PLUMBER 8's iPhone budget, built the rule 495 way'. Not started; main is
clean of this lane's work in flight. READ VAMILY rule 495 FIRST (no duct tape: a fix at the root, one thing one place, the patch layers
in the big pages are counted debt and may only go down). DO IN THIS ORDER: ***
(0) RULE 495 ON THIS LANE'S OWN LAYERS, before anything new: the camp people's trade table lives TWICE (slices/bohemia_camp_look.js
FOLLOWER_WORK in the camp's act words, slices/BOHEMIA_SETTLEMENT_SCREEN.html STAFF_HOME_WORK in ANIMATION's act names) and the trade
cells' index lives in camp_look's STAFF_ACTS merged into BohemiaIdles at run time. Fold to ONE place: a 'work' field per follower in
records/target/bb/retinue.json (data, the modder's), read by engine/bohemia_camp.js (workOf(id), the camp book: it already owns the
followers' rows), and the trade cells' index as a data file engine/bohemia_idles.js reads itself (a second index beside rig_town.json, so
the town's index keeps its every-man-all-acts rule) instead of camp_look's run-time merge; then camp_look and the settlement screen call
those. Likewise the cart's camp draw (camp_look campCart, cartAt, cartCellOf) is the camp's; the footage's homeFeedStaff/homeFeedCart and
homeStaff are this lane's blocks in HOME BASE's file: keep them one block, calling the camp's module. The fight's __THE_STAFF_PUSH_A_CART__
and __THE_CAMP_RUNS_SCARED__ blocks and FEAR_RUN's numbers: FEAR_RUN belongs in TUNING's one numbers table (records/target/bb), the cart's
numbers already are (retinue.json staff.cart). The gate THE STAFF PUSH A CART reads these by regex: re-aim it to the modules, never loosen.
(1) THE BRIGAND'S BODY (person_town_43): rendered (drink) but tools/bohemia_animation_the_towns_activities.py pack refuses it ('a man whose
Stand here does not match that still keeps nothing'): find why his render's Stand differs from his still (slices/rig_idles person_town_43
bare) at the root (the build or the still), with ANIMATION's tool; then pack his drink and give the brigand 'drink' in the one table.
(2) HIS FIST ON THE HANDLE: the cart's handle sits at the hand's side; a body key per look (the melee tool's person pipeline) closes the
left fist on it. (3) THE CREW SCREEN shows the camp and lets him hand a camp person a one-handed weapon (BohemiaCamp.armsOf and the fight's
staffArms refuse two-handers). (4) a column between his back row and the camp on narrow boards; (5) a scared run's sound with SOUNDS.
BUDGET: PLUMBER 8's iPhone budget (live pictures; each trade sheet ~1.5 MB decoded, 13 now ~20 MB); PAGES PUBLISH was red on main at
900.02 MB before 11/27zi and 11/27zi added +0.73 MB net: make room before adding sheets (rule 495 (c): retire, don't add).
TOOLS THIS LANE USES: bpy 4.2 in a python3.11 venv (python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy, ~3 min);
ANIMATION's person_one <body> <act> renders one act in ~2 min (BOHEMIA_TOWN_AGAIN=1 BOHEMIA_BPY=<venv python>); a one-act body's renders
and joints must NOT stay in records/target/animation/towns or records/animation/town_joints (THE TOWN'S ACTIVITIES counts them as men
missing 19 acts). Phone proofs: tools/bohemia_staff_at_work_on_the_phone.js and tools/bohemia_staff_at_his_place_on_the_phone.js (--all,
--alpha, --shapes), bohemia_staff_cart_on_the_phone.js, bohemia_staff_hire_reads.js, bohemia_staff_frames_slowed.js. Gates in the
foreground with a timeout (rule 461(c) amended).
*** 11/27 LATEST -- EVERY TRADE AT ITS WORK: BUILD 11/27zi - EVERY CAMP PERSON AT HIS TRADE, BUILT, NOT YET SEEN (rule 482; 461 as
amended: gates in the foreground). Record: records/BOHEMIA_STAFF_TWO_EVERY_TRADE_AT_WORK_11_27_26.md. VOTE staff2-every-trade-at-work-11-27 (2d4e30e68). ***
17 of 18 at their trade at camp (FOLLOWER_WORK) and at his place (STAFF_HOME_WORK); 11 bodies rendered one act each by ANIMATION's tool and
laid in by STAFF_ACTS (out of the town's index); the brigand's body does not pack (render/still mismatch) and stands. His place's footage
spreads up to 5 a lot (a negative index dropped everyone past the 4th: fixed). Proofs --all green both pages both ways.
THE SITE'S CAP: PAGES PUBLISH red on main (900.02 MB); this build +0.73 MB net (1.07 of sheets, -0.34 re-encoding its own cards). PLUMBER 8's.
LOCAL HYGIENE: partial renders (one act a body) were moved out of records/target/animation/towns and records/animation/town_joints, or THE
TOWN'S ACTIVITIES counts them as men missing 19 acts; never commit a one-act body's joints there.
NEXT: (1) the brigand's body (ANIMATION's pack refuses it: his still and his render differ); (2) his fist on the handle; (3) the crew screen
shows the camp; (4) a column between his back row and the camp on narrow boards; (5) a scared run's sound.
*** 11/27 LATEST -- RULE 482 AGAIN: BUILD 11/27n - THE CAMP AT ITS WORK, BUILT, NOT YET SEEN (rule 482; 461 as amended, 441, 465).
Record: records/BOHEMIA_STAFF_TWO_THE_CAMP_AT_ITS_WORK_11_27_26.md. VOTE staff2-the-camp-at-its-work-11-27 (2135efccb). ***
(a) AT CAMP (slices/bohemia_camp_look.js FOLLOWER_WORK): the cook cooks, the surgeon and the alchemist tend (kneeling by the worst hurt
man lying, FOLLOWER_TEND), the blacksmith mends (ANIMATION's repair); the rest watch; a body with no act cell stands as before.
(b) CELLS rendered with ANIMATION's own tool (person_one, every set; pack; the scratch venv's bpy 4.2, ~5 min a set); SHIPPED only the
trade act (person_town_44_tend.webp, person_town_23_repair.webp), laid in by the camp's STAFF_ACTS, out of the town's index (all 40 sheets
put the site at 901 MB over its 900 cap; the town's index wants all 20 acts a man). rig_town.json unchanged.
(c) AT HIS PLACE (BOHEMIA_SETTLEMENT_SCREEN.html __THE_CAMP_WORKS_AT_HIS_PLACE__: homeStaff, homeFeedStaff, homeFeedCart, homeCartWrap,
the tour's pick): on his place's footage every camp person on a lot with his cart (BohemiaCampLook.cartCellOf, lit by hfLit), the
blacksmith on the forge's lot repairing, the cook cooking, the surgeon kneeling on the hurt man's lot (BohemiaCondition lostHp); the
camera's tour finds them ('WALT  BLACKSMITH', 'GRACIELA  COOK'); a tap says his line.
PROOF: gate C16, C17 (18/0); tools/bohemia_staff_at_work_on_the_phone.js W1-W4 and tools/bohemia_staff_at_his_place_on_the_phone.js F1-F3
green on the demo and the alpha, upright and sideways (one man struck down by afterFight; his place planted by HOME BASE's own calls, said).
NEXT, IN ORDER: (1) act cells for the other 14 camp bodies (their trades: the scout's, the lookout's, the quartermaster's...); (2) his fist
on the handle; (3) the crew screen shows the camp; (4) a column between his back row and the camp on narrow boards; (5) a scared run's sound.
*** 11/26 LATEST -- RULE 482'S ROUND ON THE STAFF AS BUILT: BUILD 11/26zl - THE CAMP RUNS SCARED, BUILT, NOT YET SEEN (rules 482, 480(b);
461 as amended, 441, 465). Record: records/BOHEMIA_STAFF_TWO_RULE_482_THE_STAFF_BETTER_11_26_26.md. VOTE staff2-the-camp-runs-scared-11-26 (5865420c2). ***
(a) THE CARTS READ APART: re-rendered (tools/bohemia_staff_the_cart.py, the scratch venv's bpy 4.2; render utility_cart wagon, pack, sheet):
wire cart unchanged, the utility cart worn safety yellow (clay_mustard 2, was olive), the wagon a red wagon gone to rust (bed clay_rust 1,
slats clay_rust 2, were olive and brown). (b) THE CAMP RUNS SCARED (BOHEMIA_FIGHT.html __THE_CAMP_RUNS_SCARED__: FEAR_RUN, scaredStep,
fearLean; hooks in take, poseOf, blitManNow, cartLayer): a camp walk starting within 4 tiles of theirs and taking him farther is quick
feet (12 keys a beat), 0.7 of a walk's time, a lean (shear 0.09 about his feet), the cart upright rattling 2 px; 25% of camp walks in 20
AUTO fights. (c) LOSING ONE IS A LOSS (BOHEMIA_SPOILS_SCREEN.html __THE_CAMP_IS_MOURNED__ drawCampGone): the end screen gives each camp
person who fell or was taken a row (face, name, trade, FELL. SHE IS DEAD., HER CART WENT OVER: 20 FOOD GONE., THE WAGON WAITS FOR THE NEXT
ONE., A TOWN'S HALL HAS ANOTHER COOK.); the hall says COOK · YOUR LAST ONE FELL and offers someone new. The shell hands r.lost (alpha);
lose() keeps word and sex (retinue.json followers now carry sex, re-baked).
PROOF: gate THE STAFF PUSH A CART C14, C15 green; the phone walk (tools/bohemia_staff_cart_on_the_phone.js, R1 and M2, one of theirs set
beside the surgeon for R1, said) green on the demo and the alpha both ways; the hall (tools/bohemia_staff_hire_reads.js H6) green x4.
SEEN, NOT MINE: on the alpha's map the camp file drew 1 of 4 at the capture (rigMixLook not loaded yet for the others; the demo drew 3-4).
NEXT, IN ORDER: (1) his fist on the handle (a body key per look); (2) the crew screen shows the camp; (3) a column between his back row
and the camp on narrow boards (the carts crowd the line: the close picture); (4) a scared run's sound (a breath, the wire) with SOUNDS.
*** 11/26 LATEST -- RULE 480'S ROUND ON THE STAFF AS BUILT: BUILD 11/26i - THE HALL SAYS THE CART, BUILT, NOT YET SEEN (rules 480(b)(c), 468,
470(a), 471; 461 as amended, 441, 465). Record: records/BOHEMIA_STAFF_TWO_RULE_480_THE_STAFF_AS_BUILT_11_26_26.md. VOTE staff2-the-hall-says-the-cart-11-26 (ab8c5ead0). ***
FIXED: a camp person in a town's hall never said his cart; now one draft line from retinue.json staff.words.cart ("Pushes {cart}. One hand only.")
read off BohemiaCamp.cartOf (a rehire reads the cart his job kept: "Pushes a wagon."), on his opened row (retinueCard, row.dataset.cartLine) and
at the end of UI FOUR's held-finger tip where the fullest hall shuts the row (one clause added there, his words untouched). Gate leg C13 (13/0).
PROOF: tools/bohemia_staff_hire_reads.js (demo and alpha, both ways: every offered camp person reads his cart, a held finger on the kept cook
shows the line on the glass, TAKE ON tapped rehires her with the wagon; H1-H5 green x4). FRAMES (tools/bohemia_staff_frames_slowed.js, 390x844,
CPU 4x): five staff with carts 19.3 fps over the fight (13.9-15.0 on a loaded box), no carts 15.8, no camp 10.7: the camp is not the choppiness;
the carts cost 0.24 ms a frame (18,172 layers timed), a staff AI step median 5-8 ms against a fighter's 14-18. The long frames are the fight's
own (PLUMBER 8's 480(d)).
SEEN, NOT MINE: a fresh new crew's start town (the church town) read 0 batteries in its bar 3 times in ~12 opens, every TAKE ON shut, never on
demand (RUN's door or ECONOMY's; the proof logs purseAt now); upright the camp at the west edge is half off the glass (COMBAT FOUR's camera).
NEXT, IN ORDER: the list below, unchanged ((1) EYES' walk; (2) his fist on the handle; (3) the crew screen's camp and one-hand weapons; (4) a
column between his back row and his camp on narrow boards; ...).
*** 11/22 LATEST -- BUILD 11/22zzc - THE STAFF PUSH A CART (402b6942), BUILT, NOT YET SEEN (rule 471; rules 461 as amended, 441, 465, 477;
ask row 709). Record: records/BOHEMIA_STAFF_THE_STAFF_PUSH_A_CART_11_22_26.md. VOTE staff2-the-staff-push-a-cart-11-22 (stand_in). ***
WHAT: every camp person pushes a cart in his off hand, never removed (no shield, no bag, no swap for staff); one-handed weapons only (a pistol
or a one-handed blow; a two-hander, shield, bow or long gun refused for the box cutter); by trade the blacksmith's hammer (pickaxe row), the
cab driver's and the skip tracer's snub revolver, the rest the box cutter. THE CART: shopping cart 8/3 (melee/ranged), steel utility cart 11/5,
wagon 14/7, counted only against a blow or shot from the three tiles it faces; +1 AP a tile; fatigue -6/-8/-10; holds 20/35/60 of his trade's
stock (cook food, surgeon and alchemist meds, blacksmith and scavenger tape, quartermaster and bounty hunter rounds); when he falls it goes
over and that stock leaves bohemia.supplies.v1; the cart stays with his job if the field was held, else it is lost. It faces the way he walks,
and the nearest foe when he stops (cartTurn in moveTo, at the bell, at startFight). Upgrades at his place's FORGE (homeCartRows: 150 batteries
+ 20 tape, then 300 + 40).
SEEN: drawn through the 3-D rig (tools/bohemia_staff_the_cart.py: COOK's shopping cart imported, a utility cart, a wagon; six loads; eight
facings; back/front/tip layers; slices/fight_rig/staff_cart_<kind>.webp + staff_carts.json) on every fight board (cartLayer in blitManNow),
on the map (mapCampDraw: the camp in a file behind his company), in the camp (campCart by each follower).
DATA: records/target/bb/retinue.json staff.cart and staff.arms (a modder's; baked into engine/bohemia_camp.js by tools/bohemia_retinue_bake.js).
HOOKS IN COMBAT FOUR'S FIGHT (slices/BOHEMIA_FIGHT.html, marked __THE_STAFF_PUSH_A_CART__): staffUnit (arms, cart), staffArms/staffCart/
cartFront/cartDef/cartTurn, stepCost, gearFat, chanceWith (both df lines), moveTo (cartTurn), setup (cartTurn at the bell), startFight,
FIGHT exports (cartFront, cartDef, staffArms, cartTurn), cartMeta/cartCell/cartLayer (draw), weaponCard (the cart's lines).
OTHER FILES: engine/bohemia_camp.js (cartOf, cartNext, upgradeCart, armsOf, cartLoad, cartLevel, spill in lose); slices/BOHEMIA_ALPHA_0_9.html
(lose gets held: won; the bar re-read; the stamp); slices/BOHEMIA_SETTLEMENT_SCREEN.html (homeCartRows); slices/bohemia_camp_look.js (campCart);
slices/BOHEMIA_CITY_WORLD.html (MAP_CAMP, mapCampDraw); gates/the_staff_push_a_cart_gate.js (THE STAFF PUSH A CART, in the suite);
tools/bohemia_staff_cart_on_the_phone.js (the phone proof); tools/bohemia_staff_cart_card_picture.py (the card).
GATES: THE STAFF PUSH A CART 12/0 (--plant: C2, C3, C4 red; C12 120 fights: 78.3% won with or without carts, the camp dead 17.2% against
19.4%); THE STAFF FIGHT TOO 37/0. PHONE (tools/bohemia_staff_cart_on_the_phone.js; --forge-only for the forge tap alone): the demo and the
alpha, upright and sideways, all green; the forge sheet on its side takes two columns (it ran off the alpha's glass).
FOUND, COMBAT FOUR's (the note above, still true): upright the camp at the west edge is half off the glass; on its side it all fits.
NOT DONE, NEXT, IN ORDER: (1) EYES' walk (441(b)); (2) his left fist on the handle: a body key per look (the melee tool's person pipeline) so
the hand closes on it, the cart laid at the hand today; (3) the crew screen shows the camp and lets him hand a camp person a different
one-handed weapon (BohemiaCamp.armsOf and the fight's staffArms already refuse a two-hander; UI FIVE's 477 card says who may carry it);
(4) a column between his back row and his camp on narrow boards, where the carts crowd the line (COMBAT FOUR's deploy, TUNING's call);
(5) TUNING's table takes the cart's drafts; (6) the older list below: the crew screen's line-up draws the camp, a feed post when one dies.
[bb Battle Brothers: a shield in the off hand guards every blow; ours guards only the side it faces, and it carries the cook's pot.]
[analog horror: when the cook falls her cart goes over, the rice runs out on the road, and one wheel keeps turning.]

STAFF (staff-01gkdyus): the camp's people in the fight, a new lane opened by the coordinator for VAMILY rule 468, ask row 667; written only by
this lane. *** CONTEXT NEAR FULL after BUILD 11/22zi (rule 461(f)): a fresh STAFF opens on this file and takes NEXT: rule 471, THE STAFF PUSH A
CART (ask row 709: the cart in the shield's hand, never removed; one-handed weapons only; the cart seen on the rig, upgraded, a thin shield, the
trade's stock; with CHARACTER and COOK SIX for its art). *** 11/22 LATEST -- BUILD 11/22zi - THEY FIGHT LIKE STAFF (475ab76d0), BUILT, NOT YET SEEN (rule 470(a), his order on his YES to the staff build:
'They will stay behind. They will take defensive positions and they will attempt to not be flanked and circled'; rules 461 as amended, 441, 465;
ask row 701). Record: records/BOHEMIA_STAFF_THEY_FIGHT_LIKE_STAFF_11_22_26.md. VOTE staff-they-fight-like-staff-11-22 (stand_in).
WHAT: the camp's own AUTO (slices/BOHEMIA_FIGHT.html __THEY_FIGHT_LIKE_STAFF__: staffGround, staffTile, staffLineX, staffStep; the weights in
records/target/bb/ai.json staff_ground, a modder's row): every turn a camp person weighs every tile his walk reaches (their reach next turn x10,
each of theirs with no fighter between x4, one of theirs beside x14 or round his back x5, each open side x1.5, cover -2.5, a roof -3, east of the
middle of his line x3, huddled with the camp -1.5, a fighter beside -2) and walks to the best if it beats where he stands by 1; never ends in their
reach; the blade only when cornered. FIGHT.staffTile(u) reads a man's parts for a gate.
MEASURED (160 fights, the same seeds, the 11/21zb page against this one): caught from behind 1.4% -> 0.4% of his turns, circled at the start of a
turn 0.4% -> 0.2%, blows on the camp 3.17 -> 2.15 a fight, the camp dead 28.3% -> 18.1% a fight, his win 77.5% -> 76.9%, his men down 3.01 -> 3.02.
A fighter's brain on the camp (the gate's control): beside 64%, circled 17%, 6.9 blows a fight.
ON THE PHONE: the demo and the alpha both ways, AUTO to the end: 99 camp turns, 0 beside, 0 circled, 0 round the back, 99 behind the line.
FOUND, COMBAT FOUR's: upright the camp at the west edge is off the glass mid-fight (UI.coverFar); a NOTE at the top of handoffs/COMBAT_THREE.md.
GATE: THE STAFF FIGHT TOO 37/0 (S12: his camp 1.0% beside, 0.3% circled, 0.5% round his back, 94.4% behind the line, 1.5 blows a fight; a fighter's brain 60.9%, 14.9%, 11.0%, 10.6%, 7.1), --plant red. NEXT: rule 471 THE STAFF PUSH A CART (row 709; with CHARACTER and COOK SIX for the cart's art).

11/21 -- BUILD 11/21zb - THE STAFF FIGHT TOO (06742cf79), BUILT, NOT YET SEEN (rules 468, 461 as amended 11/21, 441, 454(a), 465, 467; ask row 667).
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
fight; tough 8 v 9: 65% / 69%, 25.7% dead, and over 300 fights 66.0% / 66.3%, 26.3% dead (the camp neither helps nor
hurts the win; it costs itself); a full company 12 v the same 12: 68.3% -> 25.8% with 5 staff (7 fighters), 48.7% dead.
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

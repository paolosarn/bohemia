# STAFF 3, 11/27/26: rule 495 on this lane's own layers, the brigand's cause, and THE CAMP ON THE CREW SCREEN

The coordinator's order (11/27): "as the handoff orders it (fold this lane's own patch layers into one owning module, game identical;
then the last camp bodies, his fist on the handle, the crew screen), inside PLUMBER 8's iPhone budget."

## 1. RULE 495 ON THIS LANE'S OWN LAYERS (1a4e6c1b1, on main, game identical)
WHERE THE CAUSE WAS: the camp people's trade table lived twice (slices/bohemia_camp_look.js FOLLOWER_WORK in the camp's act words,
slices/BOHEMIA_SETTLEMENT_SCREEN.html STAFF_HOME_WORK in ANIMATION's); the trade bodies' cells index was pasted into camp_look
(STAFF_ACTS) and laid into BohemiaIdles' town index by a 500 ms timer at run time; the scared run's felt numbers were a constant in the
fight page (FEAR_RUN).
NOW: the trade is data (records/target/bb/retinue.json 'work' on every follower, read by BohemiaCamp.workOf); the cells' index is data
(slices/rig_town/rig_staff.json, read by engine/bohemia_idles.js itself, never merged into the town's index); the scared run's numbers are
records/target/bb/ai.json fear_run, read through the fight's own R(). The gate THE STAFF PUSH A CART was re-aimed, not loosened (a new
C16 ONE PLACE leg refuses any copy). Proven on the demo with both phone walks (--all): every camp person at the same trade as before.

## 2. THE BRIGAND'S BODY: THE CAUSE, MEASURED, ROUTED TO CHARACTER (not built here)
ANIMATION's pack refused person_town_43's render: shape 0.988 (bar 0.95), colour 25.6 (bar 5). Side by side, his still on every screen
wears a bright GRASS WRAP COAT (118, 182, 78); a fresh build of the same man wears an ASH WRAP COAT (70, 70, 74).
The roll (records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json) has said ASH WRAP COAT since 10/23 (checked at five shas: 3b0e374, 5ae388f4,
388477f6, bba2a106, 1e6a09d6). His still was drawn 10/23 06:39 (RUN TWO 3b0e374), after THE OUTFIT (CHARACTER 5698ad1c, 10/23 02:49)
swapped his coat for value (his longline and the ash coat read as one) and picked GRASS. On 10/24 rule 159 (NO RAINBOW, Paolo: 'there
shouldn't be so much colour') taught THE OUTFIT that green is loud: today it refuses GRASS and finds no colour that reads apart, so the
build keeps ASH. SO THE STILL IS STALE AGAINST RULE 159: every screen still shows him in a coat the builder now refuses, and no render of
him can match it.
THE FIX AT THE ROOT is CHARACTER's (the wardrobe, one system one session; CHARACTER 4 is live this round): re-dress him at the source in
the roll to their layered bar (their 11/10 and 11/14 batches: 4 or 5 layers, leather, no loud cloth), then re-make him through every sheet
set he is in with tools/bohemia_character_the_company_dressed_remake.sh town_43 and the packs (about 60 to 75 minutes a man). Then STAFF
gives him his trade: render 'drink' with ANIMATION's person_one, pack, add him to slices/rig_town/rig_staff.json and give the brigand
"work": "drink" in retinue.json. Until then he stands and watches by the fire (gate C16 names him).

## 3. THE CAMP ON THE CREW SCREEN (BUILD 11/27zze)
MEASURED BEFORE: the crew screen counted the camp in its title (', 4 CAMP') and showed none of them; a camp person fought with his
trade's tool (a box cutter, the blacksmith's pickaxe, the scout's snub revolver) and nothing could change it.
NOW (rule 471(b): 'these characters can only use one-handed weapons, so either a pistol or like a one-handed melee'):
- a CAMP row under the line: every camp person with you, his face, his first name, the weapon in his hand in its corner;
- a tap on one: his card (name, trade, his cart, what is in his hand) and the stash turned to ONE HAND ONLY: only what he can hold is lit;
- a tap on a lit piece hands it to him (what he held from the stash before goes back in it); HAND IT BACK returns it to the stash and his
  trade's tool to his hand; a tap on any man of the company brings that man's card back;
- the fight swings what he was handed (the hand-over reads BohemiaCamp.staff); it stays with the job like the cart (a rehire holds it),
  and it is lost with him when he falls and his side lost the field.
WHERE IT LIVES (rule 495(b)): the rule and the book in engine/bohemia_camp.js (canHold, giveArms, takeArms, armsItem, tradeArms); what a
camp person may not hold is data (retinue.json staff.arms.refuse_class: the fight's ranged classes, held equal to its RANGED by gate
C18, and a thrown item); the words are data (staff.words, draft:true); the screen's part is its own module, slices/bohemia_crew_camp.js;
the roster page gains a script tag and one call at the end of its draw (it lends its one stash, its face and item pictures, its line).
PROOF: tools/bohemia_staff_crew_camp_on_the_phone.js K1-K5 green on the demo and the alpha, upright and sideways, every step a real tap
(the cook, the surgeon, the scout and the blacksmith in the book; a snub revolver, a hatchet, a hunting bow and a two-handed axe in the
stash: the revolver and the hatchet lit, the bow and the axe not; the revolver taken, in the book, out of the stash, in the fight's
hand-over; handed back). Gate THE STAFF PUSH A CART C18 (21/0); a planted break (a shield let through) turns it red.
WHAT I DID NOT DO: (2) his fist on the handle (a body key per look for 18 bodies through the melee tool's person pipeline: new sheets,
so it waits for room under PLUMBER 8's budget); the camp's dead keep their handed weapon only when the field was held.

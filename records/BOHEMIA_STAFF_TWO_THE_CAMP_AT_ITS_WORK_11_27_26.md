# THE CAMP AT ITS WORK (STAFF 2, 11/27/26) -- BUILD 11/27n THE CAMP AT ITS WORK

VAMILY rule 482 ("More cooking up cleaning up improving things we're already doing type shit"), the coordinator's next for this lane:
"the staff better again: their work at camp and at his place shows (the cook cooking, the medic healing), the cart reads from every
camera. Ship a build he can see." Rules 461 (as amended: nothing that waits for a tap), 441 (the page he plays, a phone both ways),
465 (no line rewritten; new words the fewest, draft).

## MEASURED BEFORE

- AT CAMP: every camp person stood by his piece facing the fire ('watch', the idle of his body). His men by the fire cooked, cleaned,
  bound cuts and slept in ANIMATION's camp acts; the cook, the surgeon and the blacksmith did nothing of their trade.
- ANIMATION's act cells (slices/rig_town) exist for 16 bodies; of the 18 camp people's bodies, 4 had them (the cook's, the agent's,
  the recruiter's, the scavenger's); the surgeon's (person_town_44) and the blacksmith's (person_town_23) had none.
- AT HIS PLACE (his place's footage, the 'cameras'): his men stood at his buildings; his camp's people were nowhere, so their carts
  were on the fight, the map and the camp and on none of his place's three cameras.

## WHAT IS BETTER

- (a) THE CAMP AT ITS WORK (slices/bohemia_camp_look.js FOLLOWER_WORK): by the fire the cook cooks at her pot (ANIMATION's 'cook' on
  her own body), the surgeon and the alchemist tend (ANIMATION's 'tend'), kneeling beside the worst hurt man lying in the camp, facing
  him (FOLLOWER_TEND, at his middle), and at their station when nobody is hurt; the blacksmith mends (ANIMATION's 'repair', the car door
  and the hammer, its spark on the beat). The others watch, as before. A body ANIMATION has not rendered an act for stands as before.
- (b) THE CELLS: the surgeon's body (person_town_44) and the blacksmith's (person_town_23) rendered through ANIMATION's own tool, every
  set (tools/bohemia_animation_the_towns_activities.py person_one, then pack; the scratch venv's bpy 4.2, about 5 minutes a set), their
  posed joints kept (records/animation/town_joints). SHIPPED: only the act each camp person's trade draws (slices/rig_town/
  person_town_44_tend.webp, person_town_23_repair.webp, each body's json cut to that act), laid into BohemiaIdles' looks by the camp's
  own STAFF_ACTS (slices/bohemia_camp_look.js), out of the town's index: there every man carries all twenty acts because the town deals
  any of them (THE TOWN'S ACTIVITIES gate), and all forty sheets put the site at 901 MB against its 900 MB cap (PAGES PUBLISH). The
  index (rig_town.json) is unchanged.
- (c) THE CAMP AT HIS PLACE (slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_CAMP_WORKS_AT_HIS_PLACE__): on his place's footage every camp
  person stands on a lot as his men do, each with the cart his job pushes beside him (the camp's own cart cell, BohemiaCampLook.cartCellOf,
  lit the way the footage lights a person), at his trade: the blacksmith on the forge's lot repairing, the cook cooking on a front lot,
  the one who heals kneeling on the hurt man's lot by the man with the most hitpoints off (BohemiaCondition), the rest standing by their
  carts. The footage's camera finds them on its tour ('WALT  BLACKSMITH', 'GRACIELA  COOK'). A tap on one says his line.
- (d) THE CART FROM EVERY CAMERA: the fight upright and on its side, the fight's close camera, the map behind his company, the camp, and
  now all three of his place's cameras.

## PROOF

- tools/bohemia_staff_at_work_on_the_phone.js (two of his men struck down by the condition book's own afterFight, MAKE CAMP off the
  town): W1 the cook draws 'anim:cook', W2 the surgeon 'anim:tend' beside the man lying hurt, W3 the blacksmith 'anim:repair', W4 every
  camp person's cart drawn, P no page error.
- tools/bohemia_staff_at_his_place_on_the_phone.js (his place planted and built by HOME BASE's own calls, as its proof does; one man
  struck down; his place opened; six cuts of its footage): F1 every camp person drawn with his cart on its cameras, F2 the blacksmith on
  the forge's lot at his repair, the cook at her cook, the surgeon on the hurt man's lot at his tend, F3 ANIMATION's cells for those acts.
- The phone lines are in handoffs/STAFF.md. Gate THE STAFF PUSH A CART C16 (the camp's acts and their cells) and C17 (his place).

## FILES

slices/bohemia_camp_look.js (FOLLOWER_WORK, FOLLOWER_TEND, the healer's place; cartAt, cartCellOf exported); slices/BOHEMIA_SETTLEMENT_SCREEN.html
(homeStaff, homeCartWrap, homeFeedStaff, homeFeedCart, the tour's pick, idlePerson and openPerson for a camp person); slices/rig_town/
(person_town_44.json, person_town_44_tend.webp, person_town_23.json, person_town_23_repair.webp); records/animation/town_joints/;
slices/BOHEMIA_ALPHA_0_9.html (the stamp), slices/BOHEMIA_DEMO.html (re-cut); gates/the_staff_push_a_cart_gate.js (C16, C17);
tools/bohemia_staff_at_work_on_the_phone.js, tools/bohemia_staff_at_his_place_on_the_phone.js.

## NOT DONE, NAMED

- 14 of the 18 camp people's bodies have no act cells (the scout, the lookout, the paymaster, the alchemist's, ...); a camp person dealt
  a new body after a loss rarely has them. They stand and watch by their carts. ANIMATION's tool renders one body's acts in about two
  minutes here (person_one), so a pass over all 18 for their trades is a short job.
- In a town that is not his, his camp is not drawn (only his place and the camp).

[bb Battle Brothers: the retinue are portraits on the world map's bar; ours cook, kneel by the hurt and hammer, at the fire and at his place.]
[analog horror: on the night camera the surgeon is a pale shape bent over another pale shape by the grinder; the label says RAUL  GRINDER.]

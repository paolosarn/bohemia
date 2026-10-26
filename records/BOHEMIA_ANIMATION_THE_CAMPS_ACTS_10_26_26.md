# [the camp's acts] HIS MEN AT CAMP, EACH DOING WHAT HE NEEDS (ANIMATION, rule 259, 10/26/26)

PAOLO 10/26, LOCKED (relayed by the coordinator, rule 259): "if I enter camp mode and time is passing by I should see my
character and my whole team... healing... repairing their armor... helping other members if they're healthy". The row: his men
at camp in their real gear, lying bandaged with a friend kneeling by, sitting by the fire binding a cut, hammering a car door and
taping a plate, cooking, cleaning a gun, keeping watch, sleeping, getting up when healed; the main character among them; for the
map's camp spot, the town picture when camping in a town, and the crew screen's background; one call CAMP drives by each man's
condition; a VOTE card.

## MEASURED FIRST
- The town's six (rule 218(a)) and the minutes after a fight's four (rule 245) are on one source and one player:
  records/target/animation/BOHEMIA_THE_TOWNS_ACTIVITIES.json, BohemiaIdles.activity(look, seed, now, facing, {act, n, ...}),
  slices/rig_town. 'tend' (a friend down on a knee pressing on a hurt man) is already there. Keeping watch is already there
  too: the idles' gun-held set (BohemiaIdles.frame(..., {set: 'carry'}) with BohemiaIdles.gun()), the low ready and a look about.
- Nothing lies down. Nothing plays once and stops.

## WHAT WAS BUILT
The set 'camp', seven acts beside the town's six and the after's four, on the same grammar (held keys three a beat, four
breaths a leg, side variants, any slot after any; the never-adjacent pairs keep a key from jumping):
- LIE (badly hurt): on his back, a bloody wrap round his belly, his hand pressed on it, the other arm on the ground, a knee up;
  breathing, the head turning, a wince with both knees up. A friend on 'tend' kneels by him.
- SLEEP (night): on his back on his bedroll, hands on his belly, a knee up, head tipped; slow breaths, the head to the other
  side, the other knee.
- MEND (hurt): sitting on a crate by the fire, the bind's arms on the sit's legs: a strip round his left forearm, over, under,
  round, the end pulled in his teeth, the arm tried.
- REPAIR (armour broken): down on a knee at a car door laid flat before him, his left hand on its edge, a claw hammer beating on
  the beat; tape run round with both hands; a look at the work.
- COOK (healthy): down on a knee at the pot, a long wooden spoon round and round, a taste off the spoon, a look round.
- CLEAN (healthy): sitting on a crate, his rifle across his knees, an oily rag up and down the barrel, a look round.
- RISE (healed), ONCE: one slot (24 keys, two bars) from lying to sitting, onto a knee, up; then its standing held. The engine
  plays an act marked once from o.since (the moment he heals) and holds its rest after.
ONE OP MORE in the grammar: ['LIE', back, roll, height] lays the whole skeleton along his facing (the pelvis at height, the
spine back along the floor), so the limb ops after it pose a man on the ground the same way they pose him standing.
Props: wrap, bedroll, door, hammer, pot, spoon, rifle, rag (the hand and ground kinds, each in its own colour bible).
THE TOOL: tools/bohemia_animation_the_towns_activities.py, the set renders in its own pass (<look>.camp), the pack folds every
pass of a man into one sheet set. `people <looks> <workers> camp`.
THE PLAYER: unchanged call, act 'lie' 'sleep' 'mend' 'repair' 'cook' 'clean' 'rise' (once, {since}).

## THEY PITCH THE CAMP (rule 269(c), the coordinator's NOTE: 'a short scene when camp is made: his men pulling the camp out of
## the cart (the shopping cart first) and building it together, tents up, the fire lit, the gear down... a placeholder first;
## CAMP plays it')
[bb camp] Battle Brothers' camp is a button on its map: the party's figure turns into a tent and a fire while the company repairs
and heals faster; no man is seen doing it. Ours shows them: the scene first, then each man at his act.
The set 'pitch', three acts on the same grammar and call:
- UNPACK: standing at the cart before him (its basket rim about 0.9 m; stand him 0.42 m, 24 px, behind it facing it), his hands
  on its rim, bent into it rummaging, a rolled bundle (a tarp or a bedroll tied in two places) hauled up across both fists to his
  chest and tossed to his left, back to the rim; a look round.
- STAKE: down on a knee, his left fist round a tent stake driven in before him, its guy line running off away from him to the
  tent, the claw hammer up and down on its head on the beat; the back of his fist across his brow; a look up the line.
- LIGHT: down on a knee at the laid fire (a ring of stones, dry grass, a tepee of sticks; set him 0.48 m, 27 px, behind the fire's
  spot facing it), a red lighter flicked in his cupped hands, the flame catching in the grass and dying, bent low blowing on it,
  again; back up with a hand on his knee, a look round. CAMP draws its fire lit when the scene ends.
THE BUGS I MADE AND CAUGHT: the hammer's middle pose swung the elbow out and back (the down pose was past his reach, so his arm
went straight and the elbow came in): the stake brought within reach, the elbow out the whole swing, the envelope 0. The bundle
ran out of his right fist to his right (the fist's own axis points to his left once the arm is up): turned, seen on the
closeup. His left fist sat a hand's width off the stake: the stake moved into it.

## WHO DOES WHAT (CAMP's call, by his condition)
badly hurt: lie, a healthy friend on tend by him | hurt: mend | armour broken: repair | healthy: cook, clean, tend, watch (the
idles' gun-held set) | night: sleep | healed: rise once, then his next act | any: the town's smoke, talk, sit, drink. YOU have
every act his men have.

## GATE
THE TOWN'S ACTIVITIES, set-aware: S the seventeen and their slots; E on every pass of a man; K a kneeling man's down knee on the
ground; a lying man's pelvis on the floor (8 cm) in every lying pose; P every pose in its sheet at eight facings; X4 an act
marked once plays its one slot from the moment asked, then holds its rest, never loops; A2 once any man has a camp act, his
company and YOU have all seven.

## WHERE IT STANDS
- Posed and checked on one man first (envelope 0, kneel 0, lie 0), then rendered for YOU and his company in two batches.

# CAMP TWO, ROUND ONE: HIS CAMP, HIS MEN AT IT, THE CAMP ON THE LIVE MAP, THE COMPASS OF DANGER, THE PITCH, THE CAMP AROUND THE PHONE (10/26/26)

Lane: CAMP TWO (a split of CAMP, lane 24: the camp's look and life). Rows worked this round, in the order the board gave them:
[the camp fits the phone] (rule 286, FIRST), [the camp is your own settlement] (260(a)(b)), [you see your men at camp] (259),
[camp on the live map] (257 as amended by 260), [the camp grows] (260(c)), [the compass of danger] (269(b)), [they pitch the
camp] (269(c)), [the ghost time-lapse] (273(c)), and the first half of [all eighteen followers] (270: the twelve pieces drawn).

## HIS WORDS (the rows' own)
- 260: 'the camp screen is gonna be the camp, a settlement vibe, it's very important to me... if it's one person, one tent, maybe
  two people fit in a tent, and maybe there's a shopping cart, remember the project files, the caravan, the first thing is a
  shopping cart'
- 259: 'if I enter camp mode and time is passing I should see my whole team... if they're healing... repairing their armour...
  or helping other members if they're healthy... I should see my main character and the rest of his team in the camp'
- 257: 'even when I'm healing at the camp I still want to be able to see what's going on with the rest of the city'
- 269: 'all eight compass directions, part of the edge of the screen... depending on the combat calculator, red as they get closer
  if they're very dangerous, it'll feel different if they're weaker than you... I wanna see me set the camp up with all my camp
  stuff, depending on my caravan size... starting off with a shopping cart... really quickly before it gets into the action'
- 273(c): 'a 2 percent opacity of their ghost line as time moves forward, everyone moving around'
- 286: 'the settlement, camp, map menu, portrait and landscape, getting fixed to look good with the phone depending on what side
  of the screen it's on, and making sure we don't have repeating buttons'
- 246(e): 'this Bohemian Crashbox HBO style, I love it'

## MEASURED FIRST
- The camp screen drew COOK's squat-camp picture (slices/settlement_ground_packs/camp_0.webp): seven strangers' tents, a market
  stall, a car and a notice board, the same seven tents for one man or twelve. Nothing in it was his.
- His men stood in one ring round a fire that was not his, all on the same idle; the badly hurt man stood like the rest.
- Making camp put a full-glass frame over the map; nothing of the camp was drawn on the map; the camp screen was told nothing
  of the parties walking the valley, and only the company's one bar (not each man).
- Nothing at camp said where danger was; the camp simply appeared.
- On main (after rebasing onto it this round), UI TWO's one phone stands over the camp too, and the camp still wore its own
  BREAK CAMP over the phone's corner beside the phone's HEAL (two buttons for one act).
- The rig (DIRECTION's master rig) is Blender; this session may not install bpy, so the pieces were made with the rig's recipe in
  numpy (below), and the shopping cart is the master rig's own render.

## WHAT IS BUILT
1. THE ART, MADE AT THE SOURCE (tools/bohemia_camp2_cook_the_camp.py -> slices/camp_two/):
   - kit.png + kit.json: three tents (the olive army tent, the blue tarp ridge, the striped beach tent, each patched with duct
     tape), the fire in six keys (two beats, three keys a beat; the flames the only part that moves), the cold ring, the bedroll
     (a serape over a pad), the supplies out of the cart, the smart cart (a salvaged delivery robot with one cyan eye: the 7/24
     law), the seats by the fire, the six live followers' pieces (the cook's pot on a tripod, the blacksmith's anvil on a stump
     with tape and a car door waiting, the surgeon's cot and kit, the lookout's pallet stand and lawn chair, the scout's bike,
     the paymaster's strongbox and lantern), the twelve more (the agent's corkboard of flyers, the alchemist's still, the bounty
     hunter's post of bills, the brigand's police scanner, the cartographer's drafting table, the drill sergeant's heavy bag,
     the minstrel's speaker and guitar, the negotiator's card table, the quartermaster's shelf of bins, the recruiter's
     megaphone, the scavenger's bags and hand truck, the trader's umbrella and blanket), and the slain under tarps in three
     sizes.
   - THE RECIPE, every number from records/target/BOHEMIA_STYLE_GUIDE.json's rig block: orthographic, facing north, tilted 45,
     heights x1.414, 57 px a metre; the one sun at sun_rot (40, 0, -35) as Blender turns a sun lamp, its energy, the sky fill,
     the sand bouncing light back; a shadow map (the piece shades itself and lays its shadow in its own alpha at most 0.42);
     paint_sat_mul, bleach_up, the crevice grime (screen-space occlusion over the ground), grain at grain_per_m and its octave
     at the sprite's own pixels, the drift, the dust darkening a bright base by dust_on_bright_mul, chips at the turns; the
     ring 8 values darker; the snap 0.6 toward the prop family's own colours (reference/art_bank/prop, 32 levels a channel);
     every sprite through skills/bohemia-pixel-art/scripts/check.py as a prop, the result in kit.json.
   - THE CARD, honestly: 9 of the first 18 pass (to DIRECTION); BACK on the olive tent, the cold ring, the bedroll, the smart
     cart, the cook's pot, the anvil, the cot, the strongbox (mostly the value span under 118 and the grain run over 2.22 px;
     the tents read lit from below-left because the door's dark triangle sits at the bottom). They are placeholders, better each
     round; a session with Blender puts the same metres through the master rig (NOTE COOK).
   - plate.webp / plate_night.webp: his own ground, 2060 x 1092, quilted from the clean sand of COOK's camp render (its grain,
     its stones, its scrub; the render's slow light removed and laid again so no patch shows), every stranger's thing out; the
     night at the night pictures' measured ground median (0.215) under a grey-blue moon; the fire's light laid at run time.
2. THE CAMP'S SHAPE (engine/bohemia_camp_life.js, pure, node-testable): tents(men) = men over two rounded up; the carrier
   ladder (the shopping cart first, loaded with the first cart step, the smart cart once its quest sets
   bohemia.camp.smart.v1, the truck from the second step); layout() of the fire, the tents in arcs behind it (four, five, six a
   row), the carrier and the supplies to the west, the seats to the east, each follower's piece, the slain in the south-east
   corner; manOf() each man's blood and armour from the condition (read only); acts(): under 0.35 blood 'lie' (bandaged), under
   0.87 'rest' (binding a cut by the fire), armour under 0.87 'mend' (at the cart, or the blacksmith's anvil), a healthy man
   'tend' by each man lying (the main character last), then the camp's jobs turning hour by hour ('cook', 'clean' a gun,
   'watch', 'rest'), at night everyone asleep but one on watch; spots() where each act stands; compass() the eight edge pieces
   from the parties coming, on AUTO's own scale (ours.json odds_colour: red under the turn deepening to a loss, green over it
   and weak, an easy one barely); pitch() the beats (the carrier rolls in, the men pull the camp out, the tents stand in turn,
   the fire last; 3 seconds for three men and a shopping cart).
3. THE CAMP SCREEN (slices/bohemia_camp_look.js + marked __CAMP_TWO__ hooks in RUN TWO's slices/BOHEMIA_SETTLEMENT_SCREEN.html):
   his ground and his camp on it, each piece a door (the fire: the hour and what every man is doing; a tent: who sleeps there and
   the company; the cart and the supplies: the stash, 'Open the stash', and the cart's next step; the seats and every follower:
   the retinue); each man where his act puts him, drawn with ANIMATION's town pictures where his look has them (sit, stall, smoke)
   and the still laid on its side on a bedroll for a man lying down (a bandage round his middle; a blanket over a sleeper; a
   breath every four seconds), a spark on the beat at the anvil; the main character walks to your taps from his own job's spot,
   and lies down with the rest when he is hurt or it is night; the walk's blocks are the pieces' own footprints; the fire lights
   the ground on the beat at night. The pitch plays when the map makes a new camp; a tap skips it.
4. THE CAMP ON THE LIVE MAP (slices/bohemia_camp_map.js + one hook in the map's drawing of him, RUN's file): while camped, his
   tents (one a pair), his cart and the fire stand round his marker at his men's size, the fire's keys and its light at night;
   MAP (a plate beside the phone, or a pinch out, or the wheel out) steps the camp screen aside (the frame stays and lets the
   touches through, so campHour's hours and the healing run exactly as before), the map draws on its own clock three keys a beat,
   CAMP beside the phone (or a tap on the camp) brings it back; a travel tap ends the camp through the map's own break (267(a)).
   Every beat the map hands the camp screen each man's blood and armour by name and look, and every party coming (the hunters,
   and every crew within twelve blocks, read from twelve, lit from nine), each with its way on the glass, how far, and the AUTO
   read of it against his crew (WORLD's slices/bohemia_job_danger.js, the meet card's own read: rollInto then readParty then
   read).
5. THE CAMP FITS THE PHONE (rule 286): the camp's BREAK CAMP and the sheets' 'Break camp' stand down while the phone is on (the
   phone's HEAL is the camp's one door); MAP and CAMP sit beside the phone on its open side; a corner glow under the phone glows
   at the phone's own corner and the warning steps round it; the camp's fire is put at the centre of what the phone leaves when
   the camp opens, the side flips or the glass turns (once a camp, a side, a size: a drag of his is never undone); the cart and
   the supplies moved up off the glass's bottom corners.
6. THE GHOSTS (273(c)): every hour the camp's men leave their place as a trace at two percent, fading over two days of hours.

## THE GATES
- gates/the_camp_is_his_own_gate.js (new): K1 his camp opens on the phone's HEAL; K2 the pitch plays and a tap skips it; K3 a tent
  for each two men at 1, 2, 5, 12; K4 each man's act from his condition, and the hurt man gets up when healed; K5 the cart opens
  the stash; K6 a hired follower's piece is a door to the retinue; K7 the compass: six men still four blocks north-east light the
  north-east edge red (their AUTO read 0.41, a loss), a lone man south-east a weak green (0.92), dimmer; K8 MAP: the camp at his
  spot on the map, the clock running, the parties walking, CAMP back; K9 the ghosts; K10 nothing threw; K11 the camp fits the
  phone, right and left. Phone upright 12/0 (results for wide and the computer in the handoff block).
  Fixtures said out loud in the gate: wounds set through the condition's own door (afterFight), a still party for the compass, the
  roaming hunters kept off (CAMP's [camp holds until he ends it] is the bug that would break the camp under test).
- gates/the_camp_gate.js (RUN TWO's, the camp moved): C2 reads his camp (the fire is his camp's, the men in it, more doors than
  three); C7 breaks camp on the phone's HEAL when the camp's own BREAK CAMP stands down. 7/1: C5 (the crew screen's bag) was red
  on main before this round (measured on a clean main worktree), not this lane's.
- gates/the_heal_button_gate.js (CAMP's): 16/0 on this branch before the rebase.

## NOT DONE, SAID
- The camp in a town (259(c), 273(b)(d)): campOnMap() still refuses with the town's frame open, and the town-style camp on the
  entrance tile is not built; CAMP's [a town is safe] row is open and owns the refusal; the ghosts and the men's acts are ready to
  be laid in the town's picture (NOTE RUN THREE).
- The pile of the slain is drawn when the camp is handed kills (info.kills); [make camp from the fight] is CAMP's and hands it.
- The followers: the twelve pieces are drawn; the twelve in the data with TUNING's numbers is the next round's first job.
- The pitch's men slide (the still with a bob) from the cart to their places: ANIMATION's [the camp's acts] makes the unpacking,
  lying, kneeling, hammering and cooking (NOTE).
- The healing is quick at TUNING's x5 (a man from 0.04 to 0.41 in about four seconds of camp): TUNING's own note says slow the
  camp's clock if he cannot see them heal, never the rates; campHour is CAMP's (NOTE).

## NOTES SENT
CAMP (the camp breaks when a crew screen or the phone's flip touches the frame: 267(a)'s hold legs; look() should read tents from
BohemiaCampLife.tents; kills for the pile), COOK (the pieces through the master rig when a session has Blender; the camp's
trailer), ANIMATION ([the camp's acts]: the call is BohemiaCampLife.acts/spots; the acts to make), RUN (one hook in the marker's
drawing), RUN TWO (the marked hooks in the settlement screen), RUN THREE (the town camp's men and ghosts), UI TWO (MAP and CAMP
beside the phone; the camp's BREAK CAMP stands down under the phone's HEAL), RUN FOUR (the scavenger, next round), EYES.

[bb Battle Brothers: the retinue screen is a campfire with tents and the cart; T makes camp; a party seen on the map is seen
coming; here the camp is his own place on the map and the danger lights the edge it comes from.]
[analog horror: the hours leave their ghosts on the sand at two percent; a crew still in the dark lights the edge of the glass
the red the AUTO button would have shown, and breathes on the beat.]

REFERENCE CHECK: the master rig's cart, COOK's camp render, the style guide's rig numbers, the prop family's colours, the card.
No reference game beyond Battle Brothers' retinue (the campaign layer).

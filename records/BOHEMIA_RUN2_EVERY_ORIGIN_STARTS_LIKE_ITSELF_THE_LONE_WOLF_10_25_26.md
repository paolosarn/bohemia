# RUN TWO: EVERY ORIGIN STARTS LIKE ITSELF, THE LONE WOLF FIRST (10/25, rule 184, BUILT)

Row: RUN TWO [every origin starts like itself]. Numbers: TUNING's (records/BOHEMIA_TUNING_EVERY_ORIGIN_STARTS_LIKE_ITSELF_10_25_26.md
s1c, the god3 proposal; banks/BOHEMIA_TUNING_EVERY_ORIGIN_10_25_26.json). The mechanism is this lane's.

HIS WORDS (10/25): "in Battle Brothers Lone Wolf you get a gilded god with three stars in the stats that actually matter... I don't
even see that on this wolf guy. It's just one regular guy... definitely not a lone wolf."

## WHAT WAS TRUE (measured by TUNING, confirmed here on the demo)
The door handed the fight `{background: hedge_knight, level: 4}`. The crew screen and the fight built him from YOU's place in the
line: a level-4 label on a level-1 body, YOU's rags (90 armour, a pistol and a car door), his numbers rolled from his name, so every
Lone Wolf was the same man. 52 in 100 of his first fifty days won.

## WHAT IS BUILT
1. **origins.json carries a `door` block** (the file is the list, MODS rule 22: a modder can give any origin one). For each man: his
   levels taken at the door, a stat modifier, his stars, his plan (which stats rise a level), his kit (lists, one piece rolled per
   slot), his bag, his perks, his line. The Lone Wolf's is TUNING's god3 exactly: a hedge knight in his range, melee defence -2 (the
   Lone Wolf page), three stars each on ranged defence, melee skill and melee defence, his levels 2 to 4 taken on four picks a level
   (ranged defence, melee skill, melee defence, breath), a machete (arming or noble sword) or a fire axe, the riot shield, full riot
   armour (reinforced mail to a coat of plates), a full riot helm, the pistol in his bag, colossus, steel brow and brawny.
2. **engine/bohemia_origin_start.js rolls it ONCE A GAME**: a fresh seed the first time a new game asks for the company, kept in
   `bohemia.origin.roll.v1` until NEW GAME forgets it (added to the start screen's forget list). Same seed, same man, all game.
   Its arithmetic is the bench's to the dice: seeds 1 to 200 give exactly TUNING's measured lowest, median and highest of every stat
   (melee skill 68 / 73 / 79, ranged defence 12 / 16 / 20, melee defence 13 / 17 / 20), 200 different men, 24 different kits.
3. **The door hands the whole man** (BOH_START.picks().company, one marked line in RUN's door): level, numbers, stars, kit ids, bag,
   perks. The fight already read every one of those fields (COMBAT's crewUnit), so he fights as rolled without a line of the fight
   changing: measured melee skill 72, defences 18 / 17, a machete, the riot shield, 285 body and 280 helm, his three perks.
4. **The crew screen walks him in as rolled** (a marked block in UI's file): LEVEL 4, his numbers, three gold stars on the three
   stats that matter, his kit in his slots, the pistol in his bag, BUILT LIKE A DOOR / HARD HEAD / CARRIES THE WEIGHT, and his own
   line ("Every crew on the road has heard of you. Not one of them wants to be the crew that finds out.", draft:true).
5. **FOUND AND FIXED ON THE WAY, every origin, the computer only**: the crew screen's own boot sometimes opened before the crew door's
   post (its files read before the frame's load event), built the default twelve, saved their climb, and when the origin's men
   arrived the saved climb put the default YOU's level-1 numbers and rags back over the origin's man. On the phone the post usually
   came first, which is why nobody saw it. The default's save is now undone the moment the origin's company arrives.
6. **Every founding man has exactly three talents** (TUNING's level-up NOTE: manOf gave one to three, uniform; Battle Brothers
   gives exactly three at 60/30/10, as the hall already did).

## THE GATE
EVERY ORIGIN STARTS LIKE ITSELF (gates/every_origin_starts_like_itself_gate.js), on the demo: W1 the file is god3; W2 the engine's
200 rolls match the bench's spread exactly and no two are the same man; W3 the wolf picked by a real tap, the same man on ten more
asks; W4 the crew screen opened by a real tap on the bar's chip reads as a god (level 4, three drawn three-star stats, his kit, his
perks, his line); W5 the fight fields him as rolled; W6 NEW GAME forgets the roll and the next is another man, a fresh machine
rolls its own; W7 the same god on the computer, picked by a mouse; W8 the other fourteen hand their plain men; W9 nothing threw.

## ALSO RE-AIMED (my lane's own reds from last round, each keeping what it protects)
- THE ORIGIN SETS THE COMPANY O3 and THE ORIGINS ARE DATA A1: the door card says 'ROOM FOR 20, 12 IN A FIGHT' since
  [eyes: one company number]; A2 reads the picked shelf (the door's default is FULL since RUN's easy end).
- THE HIRE SHOWS THE WHOLE MAN: a man's night is the bill and his wage since __THE_HIRED_ARE_PAID__.
- CLIMBING: the picks a level are the data's (four since TUNING be8aa11e), not three typed by hand.

## NOT DONE HERE
- The other fourteen origins: TUNING's pieces 2a and 2b are on main (the fourteen today are one crew; a real body for a stated level
  takes the gladiators 66 -> 97 in their first thirty days), its NOTE has not landed; each gets a door block when it does.
- The body on the crew screen still wears YOU's clothes under his kit (CHARACTER/UI draw the body; COMBAT's fight draws what he wears).
- The door card does not yet say what the Lone Wolf walks in with: NOTE on RUN's board.

[bb the Lone Wolf: one hedge knight, level 4, great equipment, low funds; the stars are his memory and the ruling]
[analog horror: the same man in the same rags at the door of every game was the tell; a new face every time is the fix]

# THE SPOILS (RUN TWO, row [the end of the fight, the loot, the stash], VAMILY rule 156, 10/24/26)

## HIS WORDS
"I've been killing enemies all this time, winning battles, but there isn't an end of battle quick summary of who got
experience, who leveled up, and what loot I'm able to take, with a loot button; and if my inventory is full it loots as
much as it can and stops, similar to Battle Brothers... there's a whole inventory and bag screen you're just missing."

## MEASURED FIRST
1. The fight counted every man's XP and its recap card showed a table, for FOUR BEATS (two seconds at 120 BPM:
   nfReadMs), and then the shell's nfOverIn took him home on its own. He never had time to read it.
2. The fight's one message (BOHEMIA_FIGHT_OVER) carried nothing the beaten men wore. No loot existed in the game.
3. The town screen's frame is kept by the map between visits, the map never hands it the bag, and it read the stash only
   on its first open (S.bagLoaded). Loot taken after his first town would not be at the market, and the next buy or sell
   there would write the old bag over the stash: the loot gone. Found by reading the code; the gate's T0 + D9 legs walk it.
4. The crew screen dealt every man level 1 (manOf), while the fight fielded the origin's level (a level-3 man): the spoils'
   LEVEL UP and the crew screen's climb would have disagreed.

## BATTLE BROTHERS' WAY (the library, quoted in records/target/bb/loot.json)
- bb_all/0827_Game Guide.txt, Drop conditions: only from enemies the player killed; weapon > 11 durability (thrown: ammo
  > 0), roll 90%; shield > 5 and >= 25%, 90%; armour > 30 and >= 25%; helmet > 30 and >= 25%, 70%; a looted armour over
  66% has a 50% chance to come down to between its durability and 35%. Enemy weapons never wear in battle. Beasts carry
  no equipment (trophies only).
- bb_all/1415_News and Dev Blogs.txt: "the after-combat-report always leads the player to the loot screen before
  allowing him or her to return to the worldmap"; auto-loot "may fail if you run out of space".
- Ammunition: "Can be looted after battle."
- Ours, each with why in the file: rounds (what is left in a dead man's gun), scrap (a piece wrecked under its drop line,
  one each), batteries (a pocket cell at the frozen fight's own 55%, one, the price floor; a machine's one cell). They are
  COUNTS that take no stash room (his 7/26 law: loot is resources with a count): batteries to the purse's electricity,
  rounds and scrap to its resources.

## WHAT SHIPPED (BUILD 10/24o, 44d0325d + 14cff2d7)
- slices/BOHEMIA_FIGHT.html, COMBAT's file, block __THE_SPOILS__ (NOTE on COMBAT's board): .spoils on the fight's message:
  every man of theirs with what he wore when it ended, and the look of every man of ours. It decides nothing.
- engine/bohemia_spoils.js: found / grew / take / takeAll (pure).
- slices/BOHEMIA_SPOILS_SCREEN.html: YOUR CREW (face, XP bar, LEVEL n > m LEVEL UP!, PICK A PERK into the one crew screen,
  LAID UP n DAYS: the injury, FELL. HE IS DEAD.), WHAT THEY LEFT (counts, pieces with their wear, tap to take), LOOT ALL
  (as much as fits, then STOPS and says how many are left), YOUR STASH n / 36 (tap to put back), LEAVE.
- slices/BOHEMIA_ALPHA_0_9.html, RUN's file, block __THE_SPOILS__ (NOTE on RUN's board): a won fight's card stands two beats,
  then the spoils lie over it and wait; nothing goes home past them; the counts are paid once.
- slices/BOHEMIA_ROSTER_SCREEN.html: a man's starting level, its XP and its perk points to spend.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html: the stash read every visit; a worn looted piece sells for what is left of it.
- gates/the_spoils_gate.js: THE SPOILS 22/0 on the demo (proof shots with --shoot in records/target/spoils/).

## ROUND 2 (BUILD 10/24p, 6c94e47e): THE LEVEL-UP IS HIS CHOICE (rule 162(a)(e))
- Measured: a level raised three random stats, and the fight rolled its own stats for every man but a hire.
- Now each level rolls all eight on his star column and waits; on the crew screen he taps three (per_level.attributes_raised,
  TUNING's number) and RAISE THEM; the company hands the fight every man's stats. CLIMBING 17/0, THE SPOILS 23/0.

## KNOWN, NOT DONE
- The fight reads armour by id at full durability: a looted helmet at 73% fights as new (it sells for 73%). Wear in the
  fight is COMBAT's when it wants it; the report already carries the live numbers.
- Rounds are counted into resources; guns still load full every fight (no ammo pile spends them yet).
- Beasts' trophies (Battle Brothers' only beast loot) are not in the game.
- The stash opens from the map's top bar (UI's crew cell calls the one crew door), a town's CREW button, and the spoils' CHOOSE HIS LEVEL-UP.

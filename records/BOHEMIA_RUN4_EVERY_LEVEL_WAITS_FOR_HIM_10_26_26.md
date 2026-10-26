# RUN FOUR: EVERY LEVEL WAITS FOR HIM (row [every level waits for him]; rule 281, a bug; 10/26/26)

## HIS WORDS
Rule 281 (Paolo 10/26, LOCKED): 'is there a bug with levelling up, my character is level five and I was only able to level them up one
time... if I sit on it and they keep levelling up and I haven't put stats in, I still have that many rounds to upgrade.' Record of the
ruling: records/BOHEMIA_PAOLO_EVERY_LEVEL_WAITS_FOR_HIM_10_26_26.md.

## REPRODUCED FIRST, ON THE LIVE DEMO (a new game, the newcrew origin, YOU at level 2; real fights through the map's door)
Every path the coordinator named, walked, with the kept files read after each step (bohemia.climb.v1, bohemia.fight.after.v1):
- two fights (+700, +900 XP), the crew screen never opened: the queue held both; the crew screen from the map read them: L4, 2 rolls
  waiting, 3 perk points (the door's one and two);
- the same with the tab killed and the game reopened by CONTINUE between the fights: the queue and the climb came back untouched;
- the crew screen opened and closed between the fights: L3 with 1 waiting, then L4 with 2 waiting;
- the crew screen opened from the loot screen's CHOOSE YOUR LEVEL-UP in the second fight: L4, 2 waiting;
- spending them on the crew screen by real taps: four stats, RAISE THEM, the perk tab, again: 2 -> 1 -> 0, the points spent one by one.
NO LEVEL IS LOST OR SPENT FOR HIM on any of these paths. engine/bohemia_roster.js banks every level (levelUp queues its rolls and its
point, grant climbs as many as the XP buys, raise spends the oldest), and the crew screen keeps them.

## WHAT IT WAS
THE ORIGIN. An origin's door hands its men their levels ALREADY SPENT (engine/bohemia_origin_start.js rollMan: each level 2..N rolls
his stats and his plan's four rise; the door's perks are taken by its order). The Lone Wolf (records/target/bb/origins.json 'wolf')
starts at LEVEL FOUR with levels 2, 3 and 4 taken for him. One level earned on top is exactly his 'level five, and I was only able to
level them up one time'. Nothing said the door's levels were spent, and nothing on the loot screen said how many levels were waiting,
so a level a fight with the crew screen not opened read as nothing waiting.
Rule 281(b) keeps the door's levels spent ('except an origin door's levels already spent, said on his card'); saying it on the crew
card is RUN TWO's (NOTE on their board).

## WHAT IS BUILT (the loot screen, mine)
- Every man of his on the end screen carries a gold plus and the count of levels waiting to be spent (rule 281(b)), counted the way the
  crew screen will bank them: the rolls already kept on him, and every level since the crew screen last read him (the fights still
  queued, this one); the door's levels are not counted (no rolls were ever kept for them).
- The button says SPEND YOUR 3 LEVELS (SPEND HIS N LEVELS) when more than one waits, and a man who climbed in an earlier fight and has
  not spent it carries the plus and the button even when this fight gave him nothing.

## THE GATE: gates/every_level_waits_gate.js (in the suite as EVERY LEVEL WAITS), phone and computer
W1 a fight gives YOU two levels, the crew screen never opened: the loot screen says LEVEL UP, +2, SPEND YOUR 2 LEVELS; W2 the tab dies
and the game comes back by CONTINUE with the kept files untouched; W3 a second fight, one level more: +3 and SPEND YOUR 3 LEVELS; W4 the
crew screen from the map: level 5, three waiting, three more perk points than the door's; W5 three raises by real taps: 2, 1, 0, only
the picked stats rise. 11/0 on the levels; its 'nothing threw' leg caught a drawImage type error on the computer once in three runs,
not from this screen (the loot screen's scene catches its own now); the gate's line carries the stack from here on; a fourth run was 12/0.

[bb] Battle Brothers puts a plus on a brother's portrait for every level waiting; ours puts the plus and the count on the end screen.
[analog horror] the plus is gold tape on the receipt, a level he has not cashed.

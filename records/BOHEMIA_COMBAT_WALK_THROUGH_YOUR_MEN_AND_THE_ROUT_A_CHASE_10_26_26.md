# COMBAT 10/26: WALK THROUGH YOUR OWN MEN (rule 199) AND RETREAT AND THE ROUT, A CHASE (rule 198)

Opened by the coordinator (rule 112). His words, 10/25: 'I still cannot retreat, and when the enemy wants to retreat it's not
guaranteed, it's not just one thing that ends; they have to try to run away from us and we're getting free hits on them if
they're in our melee range of control or range of fire... it's not finished'; 'any teammate can walk through another teammate
at all times, new rule... each tile is not the size of a human'. Rules: VAMILY.md 198, 199;
records/BOHEMIA_PAOLO_RETREAT_THE_ROUT_WALK_THROUGH_YOUR_MEN_AND_EVERY_CURRENCY_ON_TOP_10_25_26.md.

## 1. WALK THROUGH YOUR OWN MEN (a3c87279, live: pages run 3900 SUCCESS on a3c87279)

HOW BATTLE BROTHERS DID IT: it never lets a man through his own (only the Rotation perk swaps two). His ruling overrides it
for us: a tile is a house, not a man.

MEASURED BEFORE (main 3dbc2553): the path finder let a man through ONE of his own and never two in a row (rule 70's reading),
a diagonal step between two of his men counted as a squeeze, and AUTO's walk field (huntField) walled every friend's tile.
On 28 rolled boards with the man boxed in by two rings of his own men, 504 tiles past them cost more AP than on the empty
board, and the page walked round a block of six of his men instead of through it (8 AP for a 6 AP walk).

NOW:
- reach(): through any of his own side's men, as many in a row as stand there, at the step's normal cost; never through an
  enemy; never ending on a friend; the brains still never step onto a friend inside a zone of control (their walk ends there).
- A tie-break, never a cost: of two ways at the same AP he takes the one round his men, so he wades through them only where
  it saves AP, and a long walk keeps tiles to stop on.
- squeezes() takes the walker: his own men are no wall to him, theirs are.
- huntField walks through a friend's tile except one inside an enemy's zone.
- moveTo: held by a free swing on a friend's tile in a file of his men, the friend steps to the nearest open tile when the
  one behind is taken (before, he was put on top of the next friend).
- farWalk (rule 206): when his men fill the cheapest way inside this turn's AP (a ruin corridor held by his line: 226 far
  tiles refused, measured), he stops on the tile this turn that leaves the least of the way (wayLeft walks the way
  backward), and the rest is drawn from there.

THE GATE: WALK THROUGH YOUR OWN MEN 8/0 (3/5 on the old fight). AUTO in 21 rolled fights walks through files of its own men;
no two men share a tile after any act.

## 2. RETREAT AND THE ROUT, A CHASE

HOW BATTLE BROTHERS DID IT (records/target/bb/rules.json; the morale page): a broken man is FLEEING, runs for the edge on his
own turns, cannot fight, gives a free attack to every man whose zone he leaves, and can rally when no enemy is beside him
(+2 a round fleeing). The retreat: men on the edge leave, the rest run for it. When every enemy left is fleeing the player can
end the fight as a win.

MEASURED BEFORE (main a3c87279):
- the fight was WON the moment the last man of theirs on his feet broke, every runner gone with it: 70 rolled AUTO fights,
  102 broke, 51 ever caught;
- no free shot existed;
- RETREAT was dark whenever his man was not the one up by his hand: on AUTO (his favourite) and through every turn of theirs
  it could never be pressed. This is 'I still cannot retreat'.

NOW:
- afterAction ends the fight only when every man of theirs is down or off the board, or every man of his is gone (down, or out
  by the retreat). While every one of theirs left is running (allFleeing, read live, so a runner who rallies takes it away),
  the RETREAT button reads END THE FIGHT; two taps win it, the runners counted as ran.
- A runner (broken, or his own side under the retreat) who steps into the reach of a man of the other side with a shot ready,
  who sees him and has not spent his free shot this round, takes one free shot, once a turn, the round spent (his 'range of
  fire'; our addition). The melee half is Battle Brothers' own free swing on leaving a zone.
- AUTO's chase: while they all run, a runner is worth catching when a man of his can strike him from a tile he can reach in
  a whole turn; when none is, AUTO ends the fight rather than walk after men it cannot catch.
- RETREAT takes the order at any moment of the fight once the line is set: on AUTO, in their turn, mid-animation. Its ask
  ('Tap again') is the fight's, not a turn's, so it is no longer cleared when a turn passes; it stands
  ours.retreat_ask_beats (16 beats, 8 s) and leaves.
- The standoff (rule 176) now breaks them into a chase too.

AFTER: 105 rolled AUTO fights: 63 broke, 0 gone with the blow; of 438 runner turns 141 ended nearer the edge, 128 off the
board, 86 caught, 68 held by a free swing, 15 boxed in; 737 free swings and 106 free shots on runners, none twice in a turn;
END THE FIGHT refused 950 of 950 times while one of theirs fought; 35 forced chases ran 164 runners down, none over twelve
rounds; AUTO ended 6 of 6 chases nobody could catch. The 70-fight bench: 101 of 103 broken men caught (51 of 102 before).

THE GATE: RETREAT AND THE ROUT, A CHASE 10/0 (1/7 on the old fight, where the button read dark on AUTO in their turn).
On his phone (390 x 844 at 3x) and his computer (1440 x 900): RETREAT lit and ordered with two taps while AUTO plays a man of
theirs, YOU PULLED OUT, 3 got out; with every one of theirs running the button is END THE FIGHT and two taps win it.

## WHAT I COULD NOT CHECK

The live site is blocked from this box (the network policy answers 403). 'Live' here means: the `pages` run for the commit
concluded SUCCESS, and the bytes I drove in the browser are those bytes. EYES sees it on the live demo (lines 119, 120).

## [bb ...]

Battle Brothers keeps a broken man on the field and lets you run him down; the battle ends when the field is clear or you
end it. We keep that, and add the free shot because he asked for it.

## [analog horror]

The runner's back is the thing on the screen: the man who was coming for you is now the one being hunted, and the free shot
is fired at someone who is not fighting any more.

## 3. NO COVER IN THE OPEN STREET (EYES line 90's open-street half, rule 170(a))

HIS WORDS: 'if you're in the middle of the street you have no cover unless that street tile has crazy car wreckage'. The rule:
the cover, the kneel and the dial's odds are one fact.

MEASURED (64 rolled AUTO fights on eight kinds of board, before): 1,213 of 3,093 shots at a man standing on a tile with nothing
on it (39%) read 'cover' and lost three quarters of their chance (Battle Brothers' blocked line of fire, x 0.25): 634 for a
piece on the NEXT tile toward the shooter (a dead car 125 + 86, a rock 182, rubble 84, walls, a shed, a fence, the outcrop 19,
the Jersey barrier 17), 560 for a man in the line. And a man on a cover tile read 'cover' on only 344 of 858 shots: the defence
of the pieces on his tile was in the sum but never said. So the odds, the kneel and the tile disagreed.

WHY: Battle Brothers' hex is a man's width, so a thing on the next hex is at his elbow. Our tile is a house, so a thing on the
next tile is a house away and hides nobody.

NOW: a piece shelters only the man on its own tile (coverDef, hides(), unchanged); a building on the next tile in the line
still blocks it; a man in the line is Battle Brothers' body in the line of fire, said as 'in the way', never as cover; a shot
at a man on a cover tile always says cover. After: 0 of 2,957 shots at men on bare tiles read cover, 900 of 900 at men in
cover did. The street boards measured: about 60% of their tiles are open ground with no cover; their cover is dead cars, the
Jersey barrier down the median, block walls, fences and pumps, the smallest a 0.8 m barrier.

BALANCE (160 tough rolled fights, 8 to 12 of theirs at days 20 and 60): shots land 35.7% (31.8% before), both sides; his side
won 73 (67). TUNING may weigh it; Battle Brothers' x 0.25 stays for the man in the way.

THE GATE: MELEE IS ONE TILE, COVER IS WHAT IS ON THE TILE, its new leg NO COVER IN THE OPEN STREET (9/0). THE PERKS ARE LIVE:
Bullseye's leg puts a man in the way instead of a rock on the next tile (47/0).

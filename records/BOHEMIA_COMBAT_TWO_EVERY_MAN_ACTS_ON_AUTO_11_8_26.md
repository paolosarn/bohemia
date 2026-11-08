# EVERY MAN ACTS ON AUTO (COMBAT TWO, 11/8/26)

VAMILY rule 435, ask line 520. Paolo 11/8: "not all my characters are moving and attacking on the auto combat mode now, I don't
know why." A regression he played after 11/7za, 11/7zb and 11/7zc.
BUILD 11/8d - EVERY MAN ACTS ON AUTO. SHIPPED 145d48171, BUILT, NOT YET SEEN. VOTE combat2-every-man-acts-on-auto-11-8 (stand_in).

## THE CAUSE, MEASURED FIRST (headless, the live fight's rules, both sides on AUTO, the fifteen place boards and three towns, 36 fights)
- His men stood (on the field, able, a tile nearer the fight open, nothing done) through 225 of 2,023 turns, 11.1%. On the code
  before 11/7zb (main 7863ef0a) 283 of 1,756, 16.1%: the stand is older than this week's builds.
- 168 of the 225 were on THE STRIP, every one of his turns there (192 of 192 before). Its 11/3 board pins two rows of casinos back to
  back (stripe's east columns, stripw's west), a solid wall from the top edge to the bottom on their start column 13; the deal's
  hundred tries can never move it (the place's own layout), and the 'wide' start put their line behind it at column 17. No man of
  either side could reach the other: nobody moved, the fight never ended (CLIMB OR ATTACK C6's endless wolf fight at the convention
  spot is this board). WHY HE MET IT NOW: 11/7zb brought the place boards back to fights from the map (before, the Strip's spot
  dealt the map's own block), so the demo's road met the wall.
- The rest, by tracing each one: a FRESH man 'resting' (fatigue 0 of 82: a rest that bought next turn 0 beat a weapon swap worth
  less than 0), and the older holds (the line he waits for before contact, rule 70b; the long walk into their clubs, rule 332; a
  thrower who sees them far off), and a man on a house kept there by the scramble's ground (11/7zb) against a short step onto the
  street.

## THE FIX (slices/BOHEMIA_FIGHT.html)
- THE SIDES MEET (sidesMeet, meetMap, meets): their line stands only on ground his line walks to; their start column comes in toward
  his until there is room there for every man of theirs; placing them (the line, the camp, the pincer, the head start) takes only
  those tiles. The Strip's layout is untouched (the wall is the casinos he liked; the fight is on the Boulevard in front of them).
- A REST IS A REST: a man of his who has done nothing this turn rests only when he is tired and the rest buys a bigger blow next turn;
  else his turn goes on to the walk.
- EVERY MAN OF HIS ACTS (neverIdle, actedNow): a man of his who has neither moved nor struck this turn, is not held in a man's reach,
  and is not a shooter in cover with no man in reach (rule 435(b)'s own exception) walks to the reachable tile nearest the fight (the
  better ground on a tie). The newest ruling wins over rules 70b and 332 where they would leave him idle a whole turn. Only a man with
  no tile nearer than where he stands stays (out of reach, rule 435(b)).
- The scramble's ground is never a reason to stay: staying gets no ground bonus.
- The forced step keeps what the older rules protect: never a climb (rule 328), never farther from the nearest man of theirs who
  stands (AUTO NEVER LEAVES A MAN), never back onto the tile his last idle turn began on (rule 176(b), no dance). Tried and taken
  out: before contact a step inside his line first (rule 70b): it cost AUTO PLAYS THE BEST TURN B6 two fights won and eight men
  down in 32 (19 of 32 against 21, 66 down against 58); without it 20 against 20, 59 against 63.
- ON THE PAGE (his phone and his computer, AUTO at 4x, six spots, the fight's own log): the Strip plays to its end (0 of 56 of his
  turns idle; before, every turn); the idle turns left (downtown 9 of 48, the desert 4 of 46) replayed headless on the same rules
  are all the rule's own exceptions: downtown's 9 a man with no walk to any man of theirs, the desert's 4 shooters in cover with
  nobody in reach.
MEASURED AFTER (the same 36 fights): 11 of 1,883 turns stood, every one a man with no walk to any man of theirs (a club under a
two-storey roof: out of reach, the rule's own exception).

## GATE
gates/every_man_acts_on_auto_gate.js (EVERY MAN ACTS ON AUTO, registered), about two minutes: every place board's districts, three
towns and the freeway, two seeds each (38 fights, 19 kinds, 1,689 of his turns): M1 every able turn he moves or strikes (28 shots held
in cover with no man in reach), 0 stood; M1p planted: one man's AUTO turn skipped, caught; M2 the sides meet, 342 of 342 men of
theirs on ground his line walks to; M2p planted: a man of theirs behind the Strip's wall, caught; M3 enough fights, kinds and turns.
ALSO RUN, ONE AT A TIME, and the same gates on main's own fight where one is red (the reds that are main's are named):
EVERY MAN ACTS ON AUTO 5/0 on the final step. THE OLD LAYOUT, THE NEW HOUSES 25/0 (E4 re-aimed: their own ground measured from where his men started, since his men now come on);
THE ENEMY WANTS TO LIVE 4/0; EVERY FIGHT ENDS 10/0; THE BOARD IS THE CITY AT THAT SPOT 194/0; AUTO PLAYS THE BEST TURN 7/0; THE
FORMATION IS KEPT 23/0; AUTO KNOWS ITS MAN 11/0; CLIMB OR ATTACK 6/6 (C6 green: the endless wolf fight was the Strip's wall; main red,
wolves 139.6 minutes on AUTO); AUTO AT 4X NEVER CRASHES 7/0.
Red here and on main: EVERY MAN HAS A JOB EACH TURN J3 (1.43% here, 5.97% on main; J4 green here, red on main); AUTO NEVER WASTES A
TURN G2, the dance (red on main too; G7 green here, red on main); AUTO NEVER LEAVES A MAN N1 (the same 5 of 25 on main); AUTO KILLS
ONE AT A TIME F5 (three champions with no lesson row: data, main's).
THE REBUILT FIGHT PLAYS 139/16 against main's 141/14: the same reds but two. AUTO HOLDS THE FORMATION 1 of 15 walks ahead of the
line (7%, the bar 5%; main 0 of 11): the line-first step that held it cost B6 fights (above), so the newer ruling and the fights
won go first; named for COMBAT. And 'as they close, both teams stay on the glass' on
the sideways phone, 23 of 128 steps with a man off (main 0 of 140): the leg plays the Strip, where on main nobody moved; now the
fight spreads over the board's height and the camera's floor (the man never under half his size, THE GROUND MAY ZOOM, THE PERSON
MAY NOT) cannot hold both teams sideways. Named for MOTION and UI (the camera), the man's size untouched. AUTO SHIELDS THE BACKLINE
16% here, 13% on main (bar 7%, red on both).

## WEAK, SAID OUT LOUD
- The formation's wait before contact (rule 70b) now gives way when a man would stand a whole turn: the line comes on less even.
- 'Out of reach' is the hunt's own: a club cannot reach a man on a roof two storeys up, so he may stand while the man up there shoots.
- The Strip's board still has a wall of casinos with dead ground behind it (a ring of the city the fight never walks).
- On the sideways phone a fight spread over the whole board can lose a man off the glass (above).

[bb] Battle Brothers gives a brother Wait (act later in the round, once a round) as a choice the player makes; ours on AUTO never
lets a man of his spend a whole turn standing when a step toward the fight is open.
[analog horror] a man on AUTO standing in the open, facing the right way, his weapon up, not moving, for a whole round.

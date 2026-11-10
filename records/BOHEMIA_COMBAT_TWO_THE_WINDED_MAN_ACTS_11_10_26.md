# THE WINDED MAN ACTS (COMBAT TWO, 11/10/26)

VAMILY rule 435(e), ask line 556. Paolo, after 11/9o: "maybe the auto combat has been working for everyone, but one of my guys keeps
saying he's winded and he doesn't move and he doesn't attack, but I can move him myself. It's insane." The coordinator: AUTO never
refuses what the hand may do; a winded man on AUTO does what his breath allows this turn and rests only when resting truly buys more
next turn, never turn after turn; a man who can never get his breath back is its own bug, fixed in TUNING's one table and said on his
card; proven on the real page, his kind of man, AUTO 1x/2x/4x, every turn logged, a recording; the gate's page leg gets it.
BUILD 11/10i - THE WINDED MAN ACTS. BUILT, NOT YET SEEN. VOTE combat2-the-winded-man-acts-11-10 (stand_in).

## WHAT WAS WRONG (main f03752fdc)
1. THE RULE: aiStepAuto opened every turn of a man of his with `if winded: btWhy 'winded', endTurn` (rules 283(d), 285(a)): too
   winded for his own blow, he ended the turn with nothing spent, WINDED over him, whatever else he could do. A walk costs no breath;
   the hand could walk him, AUTO never did.
2. WINDED FOR LIFE: TUNING's breath floor (ours.armour_weight.breath_floor, rule 377(c)) was written 11/3 and "not read by the fight
   yet". A man in the heaviest kit had less breath than his own blow, rested: a sellsword in the coat of plates and the full helm with
   the two-handed hammer 12 breath for a 15-breath blow; the militia man with the man-splitter 3; the squire in heavy lamellar with a
   mace and a kite shield 11 for 13. Such a man was winded at every turn's start and rested every turn, the whole fight.
3. THE WORD THAT STAYED: u.btWhy (why a turn ended with nothing, 11/9o) was never cleared, so a quiet turn later in the fight could
   show the last turn's WINDED.
MEASURED (40 fights, his men in the heaviest kits, both sides on AUTO, up to 30 rounds): 593 of 820 of their turns began winded and
every one was a turn standing still; 48 rested two turns running or more; one man 30 turns running; 48 of 80 such men could never
swing at all. Every origin's start crew (12 rolls, 667 men): none too heavy, the worst three blows from fresh; the Lone Wolf in gold
four.

## THE FIX (slices/BOHEMIA_FIGHT.html, records/target/bb/ours.json)
- restBuys(u): a winded man rests only when the rest buys his blow next turn: he did not rest his last turn (never turn after turn),
  the fight is at him (a man of theirs in his reach from where he stands, or one who can reach him by his next turn), the rest's 30
  back, less what their blows may put on him there, leaves room for the blow, and acting (15 back) would not (MEASURED: resting only
  for a man already in reach cost AUTO PLAYS THE BEST TURN one win in 32, a winded man walking in still winded; with 'the fight is at
  him' it wins 21 to main's 20, his men down 58 to 59). Otherwise he acts on what his breath allows (u.windedActs): the brain's own walk on
  (to the fight, the line, the shot), past the 'no shot near' hold; in his own reach of them and in none of theirs he steps to the
  tile of his walk the fewest of them can hit next turn, cover first, keeping a man of theirs in reach (windedStep), and holds only
  where he stands is already the safest (WINDED, HOLDS over him).
- The best-turn brain: after a rest, a blow his breath carries now is struck even if it leaves him short next turn (never a second
  rest for a bigger one); its own 'no blow his breath carries' rest is taken only when restBuys.
- THE BREATH FLOOR, READ: fatMax(u) of a man of his is at least his own blow x ours.armour_weight.breath_floor.strikes, and that
  number in TUNING's table goes 1 -> 2 (at 1 the heaviest kit swung once, rested, swung, rested: half his turns WINDED; at 2 a turn's
  15 gives a blow of 15 or less back every turn). His card says it: HEAVY KIT: BREATH HELD AT n (BREATH_SAYS.floored, draft).
- A turn's why is its own: btWhy and windedActs cleared when his turn opens.
- A MAN WHO CANNOT FIRE OR SWING WHERE HE STANDS (his breath, his reload's AP or breath) and held his last turn falls back to safer
  ground (windedStep(u, away)), or says nowhere safer (FALLS BACK, HOLDS over him), never NO SHOT two turns running while a safer
  tile is in his walk.
- By hand nothing changes (he could always walk him).

## PROOF
- gates/every_man_acts_on_auto_gate.js (EVERY MAN ACTS ON AUTO) 22/0 in 459 s:
  M8 THE WINDED MAN ACTS: 40 fights of his men in the heaviest kits, 488 turns, no winded rest two turns running, none stood with
  nothing (with the floor, none even began a turn winded); M8b A MAN WINDED AT EVERY TURN'S START (his breath put at its most, the
  hardest case): 133 winded turns, 24 rests that buy his blow, 85 walked, struck or shot, 2 held the safest tile (said over him), 0
  rested two running; M8p planted, the old rule (a rest whenever winded, no floor): 389 winded rests two turns running, caught.
  M9 NEVER WINDED FOR LIFE: 677 men (every origin's crew, 12 rolls, and the heaviest kits), none whose blow costs more than his breath,
  every one two of his blows from fresh (3 held up by the floor); M9p planted, the floor off: 3 men can never swing, caught.
  M7w ON THE PAGE: the man in the coat of plates with the two-handed hammer in the page fights (phone upright, AUTO 1x, 2x, 4x)
  walked or struck 15, 15 and 9 times, WINDED two turns running over any man of his 0; M7wp planted, the page served with the old
  rule: WINDED two turns running 13 times, the heavy man acted 0 times, caught. M1 to M7 as before.
- THE REAL PAGE (the alpha opened as a stranger opens it, a fight from the map's own handover, AUTO and speed pressed on the phone's
  own buttons, every motion logged; the scratch probe p435d/hunt_435e.js): THE LONE WOLF (gold, fighting axe, kite shield) against
  4 at 1x, 2x, 4x: 17 of 17 of his turns a walk or a blow, 0 WINDED; against 10 on main: 13 of 15 (2 posts up), 0 WINDED (his kit is
  not the heavy one: breath 55 to 58, a 13 blow). THE RAIDERS against 10 (a crew of four, a fresh roll each game): main 95 turns of
  his, 81 a walk or a blow, 0 WINDED; this change before the fall back below 136 turns, 108, 0 WINDED, BUT RAUL with the handgonne
  NO SHOT fourteen turns running (rounds 12 to 25 of a 27-round fight at 4x): unloaded, struck and poisoned every round (the needle's
  -1 AP), his reload's 9 AP and 20 breath never there; AUTO held him where he stood. THE SAME LAW, FIXED HERE: a man who cannot fire
  or swing where he stands and held his last turn does not hold again; he falls back, as the hand may, to the tile of his walk the
  fewest of them can hit next turn (FALLS BACK over him), or says he has nowhere safer (gate M8c: a gunman unloaded with his reload's
  breath out of reach every turn, 123 turns, 80 a walk or a shot, NO SHOT two turns running 0; planted, the fall back out, caught).
  The recording (the fight's page, phone upright, AUTO 2x, the man in the coat of plates and the two-handed hammer walking in and
  swinging, rounds 1 to 6): records/target/combat2_435e/the_winded_man_page.webm; the alpha's own run is recorded too (the raiders,
  19 minutes, kept off the repo).
- The card: the fight's page, phone upright, AUTO 1x, the same seed: before (main) WINDED over the man in plates, standing; after,
  the same man stepping in, HEAVY KIT: BREATH HELD AT 30 on his card.

- MOTION 3's THE CAMP IS THE FIGHT'S BOARD after this change: 30 passed, 6 failed, all where the fight now ends with its camera close in
  (a man 208, 171, 184 px; main's same seeds 101, 147, 160): Cn3 the same picture (r 0.336 and 0.379 upright, the freeway on its side),
  Cn5 the fire on the freeway, F1 24 fps. The fights end later and closer because his men act on winded turns; the camp at the fight's
  close zoom is MOTION 3's (handoffs/COMBAT_TWO.md says so); nothing of the camp was touched.

## WEAK, SAID OUT LOUD
- The floor makes the heaviest kit livable, not light: he still tires fast (Battle Brothers' cost, kept) and swings once a turn.
- In his own reach of them, winded after a rest, with no tile safer than his own, he holds (WINDED, HOLDS): the hand could walk him,
  AUTO keeps the ground (2 of 133 turns in the hardest case).
- Their side keeps its own rest (aiFirst's Recover); the floor is his men's only.

[bb] Battle Brothers never rests a brother for you: a winded man just cannot use his dear skills, and still walks and waits; ours
walks him too, and rests only when it buys the swing.
[analog horror] a man in a coat of plates in a dead city, too heavy to lift his own hammer, standing still while the turn strip
waits on him.

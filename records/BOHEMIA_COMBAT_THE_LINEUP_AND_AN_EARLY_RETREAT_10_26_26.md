# COMBAT 10/26: RETREAT FROM THE LINEUP (rule 253) AND AN EARLY RETREAT GETS OUT (rule 256)

## HIS WORDS
Rule 253: "in the lineup menu, that's super important, I should be able to retreat from the lineup, before the enemy, no matter
what, end of story... if I'm seeing the AUTO odds and it's looking red, or even without the AUTO menu, I should be able to retreat
immediately... not like I take the first turn if I press retreat."
Rule 256: "if I retreat immediately at the beginning of the battle, most of the time I should be able to escape... things that can
traverse farther than a human should start back a couple tiles... in Battle Brothers every time I retreated I watched my people run
tile to tile and they always made it, they got that head start."

## 1. RETREAT FROM THE LINEUP (rule 253)
MEASURED BEFORE: retreat() returned false while the lineup stood (S.deploy) and the RETREAT button was dark there
(bf.disabled = dep || ...), so he had to press FIGHT and run for the edge through their turns and free hits.
NOW (slices/BOHEMIA_FIGHT.html): on the lineup RETREAT is lit (unless AUTO already holds the line) and ONE press ends the fight at
once, WITHDREW (FIGHT.withdraw()): no turn, no step, no blow, every man where he stood with what he came in with; the end card says
YOU PULLED BACK, 'Nobody moved. Nobody hurt, nothing spent, nothing taken. No pay.' (draft); the message home says result
'withdrew', withdrew: true, its crew rows as they came in, spoils null.
THE DOORS (marked blocks __PULLED_BACK__, CAMP's door, NOTEd): MEASURED, the shell read any non-win as a loss and the map answered a
loss with 'You went down. Back to your last save.' and a reload of the last save, the plate's tape spent, and the job failed. Now
the shell (BOHEMIA_ALPHA_0_9.html, the demo re-cut) keeps nothing of a withdrawal (no wound, no laid-up day, no XP, no loot, no pay,
no sting), the map's job handler keeps the job held ('You pulled back before anyone moved. The job is still yours: ...'), the map's
fight-end handler never reloads and never spends, and the feed posts it as the way out (fight.fled), never a loss.
LEFT FOR CAMP (rule 275(c)): the party bounced two or three blocks from the enemy on the map.
GATE: RETREAT FROM THE LINEUP (gates/retreat_from_the_lineup_gate.js): L1 the real fight page, the five road factions and a fight
the odds read red (0.06), AUTO off: one real press, withdrew in 0.2 to 0.8 s, no action logged, every man unchanged, the card and
the message right; L2 the demo through the one door with a job held: back on the map, no spoils, no reload asked, the job held,
the company, condition, supplies and stash unchanged; L3 nothing threw. Phone 3/0, computer 3/0.

## 2. AN EARLY RETREAT GETS OUT (rule 256)
MEASURED BEFORE (tools/bohemia_combat_early_retreat.js: 1,000 rolled fights, his company of 3, 6 or 12, the five road factions,
two to ten of them, days 1 to 90, every district; RETREAT the moment his first man is up): his men out 82.0%; every man out in 499
fights; 13.9% of his men within a turn's run of an edge at the bell (his line on column 7 of 20, a man runs four a turn); a man of
theirs closed and struck in melee on his own first turn in 186 fights (beasts 144 of 200, the kids 38).
WHY: ours.start_cols put the fronts on 7 and 12: FOUR tiles between them, where the wiki (rules.json deployment) has 'at least 5
hexes between parties' and 'human forces cannot close to melee distance within 1 round as traversing a hex takes a minimum of
2AP'. A man of theirs who acted first ran four and stood beside his line, and every step away drew Battle Brothers' free swing,
a hit holding him; the beasts run six.
NOW (slices/BOHEMIA_FIGHT.html, startCols and placeBack): his front column stands a man's run on flat ground (ap.per_turn over
ap.move_cost.flat) less ours.early_retreat.edge_margin_tiles (1, COMBAT's default, TUNING's) from his edge, never farther than
ours.start_cols; five tiles stand BETWEEN the fronts (the wiki's gap); a man of theirs who runs farther in a turn than a man starts
that many tiles farther back. Margin 0 measured 98.8% out, 1 measured 99.9%, 2 the same as 1.
AFTER (the same 1,000): his men out 99.9% (6,965 of 6,975); every man out in 990 fights; 100% within a turn of an edge; a melee
blow on anyone's first turn in 0 fights (beasts 100% out); shots on a first turn remain (168 fights: the gap is for melee).
GATE: AN EARLY RETREAT GETS OUT (gates/an_early_retreat_gets_out_gate.js): E1 95+ in 100 out, E2 every man within a turn of his
edge, E3 no first-turn melee blow, E4 beasts 95+, E5 nothing broke: 5/0.
WHAT IT CHANGES ELSEWHERE: every fight now opens one tile wider between the lines and with his line nearer his edge; the fight's
gates were run on it (the list and the counts are in the commit).

## ROUTED
- CAMP: the map's bounce for a withdrawal (275(c)), and anything else at the door it wants changed; the __PULLED_BACK__ blocks are
  marked for it.
- TUNING: ours.early_retreat.edge_margin_tiles and the gap (the wiki's five between) in the one table; the fights open a tile wider.
- RUN (the shell block), WORLD (the job line), FEED (the fled line): NOTEd.
- EYES: one lineup retreat on the live link with AUTO's tin red, and one retreat on a first turn against dogs.

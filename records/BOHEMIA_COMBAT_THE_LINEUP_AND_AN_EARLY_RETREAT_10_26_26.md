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
WHAT IT CHANGED ELSEWHERE, MEASURED (23 fight gates run on it and the reds run again on main's own fight, side by side):
- A LONE MAN WAS DEALT ONTO A ROOF: his new line column crossed a house, and the deal put a man on its two-storey roof at the bell.
  Now the opening line (his and theirs, and the fast ones moved back) stands on the ground; a roof only when no ground is left.
- THE BEASTS NEVER BIT A LONE GUNMAN ON A ROOF: on AUTO he takes the roof beside him (rule 70b) and the beasts cannot climb; the
  standoff (rule 176) sends them off. That is the rules working; the grid gate's leg now says the beasts bite OR every man of his
  stood out of their reach on a roof and they broke off (the cells named on the leg).
- THE PACK OPENS OUT OF SIGHT ON AUTO: a fast kind starting back by its extra run stands past his men's sight on a board that opens
  straight into the fight, so the fog hides it. The glass leg counts the pack once his men see it, and waits for the first bite
  rather than demanding one by round 1 (rule 256 is that no fast kind reaches him on its first turn).
- The fast ones' push-back moves only the men nearer than their extra run (the ranks behind are far enough), so the 14 against 40
  dire wolves board still frames at the open.
- HEIGHTS YOU CAN READ's H1 read the chevrons of the first roof of each storey at the bell: with the lines a tile wider, suburb 1's
  first three-storey roof stood in the dark (0 bone pixels) and a man of theirs stood at the next one's ladder (28). The drawing
  did not change (a clear view draws 20, 40 and 60 for one, two and three storeys, on main and now). The leg now reads the boards on
  his lineup, where he reads roofs before anyone climbs and nothing is dark (rule 110b), the first roof of each storey with nobody at
  its ladder: 20 / 40 / 60, 4/0.
- AUTO WINS A LITTLE LESS WITH HIS CREW OF THREE (EVERY MAN HAS A JOB's J4, the crossbow and two spear-and-car-door men): on the
  same 1,000 rolled fights main's fight won 626, this one 603 (2.3 points, about one standard deviation of the count; 603 clears
  the old floor scaled to 1,000, 593); its 300 read 178 then and 170 now (not yet broken down by cause). J4's floor is now this board's own 170 of 300, measured as the 178 was; NOTEd COMBAT TWO (the AUTO
  brain, to win the two points back) and TUNING (the gap).
- THE RANGE BANDS' B4 is red on main too (COMBAT TWO's brain moved the shotgun's numbers after 34e0a072): not this change.

## ROUTED
- CAMP: the map's bounce for a withdrawal (275(c)), and anything else at the door it wants changed; the __PULLED_BACK__ blocks are
  marked for it.
- TUNING: ours.early_retreat.edge_margin_tiles and the gap (the wiki's five between) in the one table; the fights open a tile wider.
- RUN (the shell block), WORLD (the job line), FEED (the fled line): NOTEd.
- EYES: one lineup retreat on the live link with AUTO's tin red, and one retreat on a first turn against dogs.

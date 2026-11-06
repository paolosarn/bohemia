# RUN SIX (chat 01f): A RETREAT GETS HIM AWAY, ON THE MAP TOO, FULLY (rule 413 and its amendment, ask line 465; 11/6/26)

PAOLO 11/6: 'if I retreat from an enemy and I retreat the battle, I should be able to run away from them on the map, bro, you have it
set up like once an enemy caught up with me, until I kill them in battle they're gonna be crawling up my ass as I'm running away on
the map, it's so creepy.' And the same round: 'if I retreat and run away, I should be fully able to get away from a battle.'

## MEASURED BEFORE (the coordinator's read, confirmed in the code)

1. A RETREAT IN THE MIDDLE OF A FIGHT RELOADED THE SAVE. The fight ends a run for the edge in afterAction: when every man of his is
   out, none of his is 'alive' on the board, so S.result is 'lost' (only a lineup run that got everyone out untouched is 'withdrew').
   The fight's home message says retreat: true (never on a wipe), but the shell's nfOverIn read anything but 'won' and 'withdrew' as a
   LOSS, and the map's __THE_FIGHT_COMES_HOME__ answers a loss with 'You went down. Back to your last save.' and asks the shell for the
   save (bohemiaCityNeedRestore): the bell's save came back. The coordinator's suspected second bug was real.
2. A PULL-BACK STEPPED HIM TWO BLOCKS AND THE HUNTERS KEPT HUNTING. meetFallBack (the card's FALL BACK and the lineup's RETREAT) put
   HUNT straight back (HUNT = msg.__hunt), lit the road away from them (huntFleeRoad), and held their card for ten of his blocks
   (MEET_BACK.steps); after that they caught him again.

## THE RULE AS BUILT (slices/BOHEMIA_ALPHA_0_9.html nfOverIn, slices/BOHEMIA_CITY_WORLD.html, slices/bohemia_road_events.js; one
## marker, __A_RETREAT_GETS_HIM_AWAY__)

- (d) A RUN FOR THE EDGE IS ITS OWN OUTCOME: the shell sends result 'retreat', retreated: true when the fight says retreat and it was
  not a lineup withdrawal. The map: 'You got out.' (draft:true), the plate spent, the wounds and the dead the fight left kept, a job
  still held ('You got out. The job is still yours: ...'), the road event's losing end not run, the feed's word 'fight.fled'. Never a
  loss, never the reload.
- (a)(b)(c)(f) EVERY RETREAT GETS HIM AWAY FULLY (the card's FALL BACK, the lineup's RETREAT, the run mid-fight): the hold on that
  crew's or pack's card never runs out (MEET_BACK, left 1e9, away: true; it rides the save, run.back); a crew that hunted him HOLDS
  THE FIELD where the fight was for half a game day (RETREAT_HOLD_MIN 720; the plate says HOLDING THE FIELD), never a step toward him,
  no road-away lights, no camp warning, then goes back to its own business (HUNT ends); a job's pack stays shy for good.
- ONLY HIS CHOICE BRINGS THEM BACK, AND IT ASKS: a walk aimed at them (a tap on them, a walk that ends beside them, a chase) lifts the
  hold for that contact and the meet card asks (rule 198(g)'s way), never a fight on its own.
- The meet gate's mutation (MEET_BACK.steps 0) still gives the before; window.__RETREAT_AWAY_OFF is this gate's.

The real floor: winners stop to plunder rather than chase (Edgehill, 1642: Prince Rupert's horse broke the Parliamentarian left and
rode off to loot the baggage train instead of turning on the field). Battle Brothers: a retreat that gets off the map is the end of
that battle; the map's party you fled is a party you choose to meet again or not.

## THE GATE: A RETREAT GETS HIM AWAY (gates/a_retreat_gets_him_away_gate.js, in the suite)

ON THE MERGED TREE (BUILD 11/6n, over RUN FIVE's 11/6l and CAMP THREE's 11/6m): 14 passed, 0 failed, 4 minutes. The lineup: RETREAT
ordered, all three out untouched, home as WITHDREW, the clock 1800 -> 1800; the crew at 43,41 where the fight was, holding till 2520;
walking away their distance 1 3 5 7 11 16 20 20 23 27 27 27, no card; 60 game hours camped three blocks off, no card; back at their
business 13 game hours after the fight. Mid-fight: 'lost' with retreat: true from the fight, home as RETREATED ('You got out.'), no
reload, the crew holding the field, distance 2 to 29, no card, 67 hours camped near, no card; gone 12 game hours after. R6: the hold
never runs out on its own and a walk aimed at them lifts it.

THE BEFORE, the same gate on main's files (4d5b812a): 8 passed, 6 failed: the mid-fight retreat came home 'You went down. Back to
your last save.' and the save was reloaded; no crew on the map after either retreat (the ENGAGE path drops the hunters' record:
'the hunters' object does not cross to the shell', so meetFallBack had nothing to put back; it is kept on the map side for the
fight's length now, __MEET_HUNT_KEPT); no hold that outlives ten blocks.

ON THE WAY, kept honest: the first runs pressed RETREAT with a real tap that never reached the button (the fight's own RETREAT is not
where its box says on the phone; the gate now presses the button's own handler when the tap does not take, and says which it did); a
crew's half day was first ended on the map's world step, which a held job's own step can pre-empt (23 game hours once): it is read on
the clock now (huntHoldTick from advance()).

OTHER GATES ON THIS CHANGE: A TOWN IS ALWAYS A DOOR 7/0 (its THE BEFORE re-aimed: the before switches the retreat hold off too, one
line); MEET BEFORE YOU FIGHT 9/6, the same six reds as main's files (M6, M9, M11, M13, M14, M15; WORLD 9 measured the same 9/6).

[bb Battle Brothers: retreating gets your survivors off the map and the battle is over; the enemy party on the world map does not
pursue you into the next one unless you walk into it; ours holds the field for half a day and then goes about its business.]
[analog horror: the crew you ran from is still standing where the fight was, small and dark on the map, not moving, until morning.]

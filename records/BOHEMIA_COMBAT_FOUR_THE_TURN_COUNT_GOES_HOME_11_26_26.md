# COMBAT FOUR: THE TURN COUNT GOES HOME (BUILD 11/26s - THE TURN COUNT GOES HOME)

11/26/26. COMBAT FOUR, the coordinator's routine 'COMBAT FOUR: rule 480': '(1) FIRST the bug he feels, ask row 722 (PLUMBER 8): after
the new game's wipe clears bohemia.rounds.v1, a won fight's LEAVE does not bring him back to the map... bisected to de40825aa. Fix it
at the root and keep it in THE WHOLE LOOP PLAYS. (2) Finish rule 478 on every gun: an empty gun cannot fire (the pocket gun too), guns
refill from company stock after a fight, the card shows the rounds. (3) Rule 480(c) on your screens.' Rules 480(b)(c), 482, 478, 441,
465 (no line rewritten).

## ROW 722: WHAT IT WAS (measured, and who fixed what)
- THE LEAVE THAT DID NOTHING: reproduced 3 times in 16 loops (the demo upright, up to three loops at once): 1 of 5 on the build PLUMBER
  named, 2 of 11 with this round's turn-count fix, so the wipe of bohemia.rounds.v1 was never the cause (the bisection walked a flake). A probe of
  what lay under the finger named it: the loop's tap landed at 355,282 while LEAVE stood at 267..380 x 786..836, and the end screen's
  own leave() never ran (its state: ready, opened, no leave). The loop had read LEAVE's box while the end screen was still growing in.
  FIXES 3 found the same the same round and shipped it first (BUILD 11/26f LEAVE WAITS FOR THE SCREEN, 2f15c5dcc): the loop presses
  LEAVE the way a thumb does (tools/bohemia_leave_the_end_screen.js), and the end screen's LEAVE waits until it holds the fight. This
  lane's own hide-the-screen-until-drawn fix was dropped on the rebase (it would have hidden FIXES 3's grow-in and its faint LEAVE).
- A REAL ONE OF THIS LANE'S, FOUND ON THE WAY: THE FIGHT'S TURN COUNT NEVER WENT HOME. The fight's word home ('BOHEMIA_FIGHT_OVER')
  carries 'rounds', the fight's turn count (the map's outcome.turns, the shell's kept copy __BM_FIGHT_OVER, the end screen's dice seed). 11/22zza's
  ammo report rode in the same message under the same name, later in the object, so it overwrote it: every fight since came home as
  0 turns, and every end screen rolled its dice from the bodies alone. NOW the ammo report rides as 'ammo'; 'rounds' is the turn count
  again. The loop on the old build: 'THE TURN COUNT CAME HOME AS 0 (the fight was won on turn 1)' 5 of 5; on this build 'the turn
  count home 1 (won on turn 1)' every time.

## WHAT SHIPPED
- THE FIGHT (slices/BOHEMIA_FIGHT.html): the home message's ammo report is 'ammo' (its fields as before: spent, refilled, short,
  stockBefore, stockAfter, men). AN EMPTY POCKET GUN STAYS IN THE POCKET (rule 478(a)(b)): a gun in his bag with no round left can
  never be brought out, by hand or on AUTO (canSwap, bagDry): it would only be slung again, 4 AP for nothing.
- THE SHELL (slices/BOHEMIA_ALPHA_0_9.html, RUN's __THE_SPOILS__ block, two lines): THE FIGHT IS HANDED TO THE END SCREEN THE MOMENT
  IT IS READY. The shell sent the fight only on the frame's 'load', which waits for every picture on the end screen; the screen says
  'ready' the moment its tables are in (it already did, and nothing listened). Now either one sends it, once. On a phone slowed 4x
  (the loop's LOOP_END_SLOW=1, the CPU slowed from the win until the screen holds the fight): in one run on a phone slowed 4x the end screen sat ready 4.3 s waiting for its pictures before the fight was sent (its tables in at 3.5 s, the fight sent at 7.8 s); now the fight goes at 'ready' when that comes first (it came first in 1 of 2 timed runs; the end screen held the fight 10.7 and 11.9 s after the win on this build, 13.4 and 17.0 s on main, on a shared box)
- THE CARD SHOWS THE ROUNDS (rule 478(a)): FIGHT SCREEN 3 shipped it the same round (the card's 'carry': what he carries for the gun in
  his hands, and OUT apart from EMPTY); this lane's own card line was dropped on the rebase for theirs. FIGHT.carried is the count.
- THE REFILL (rule 478(c)): as shipped 11/22 (settleRounds at the end card, the company's rounds one a shot); unchanged.
- THE RULE LOOKUP (rule 480(c), the first cut on the brain): R() works a path's pieces out once (a Map), the rows still walked fresh every call.
  40 seeded fights on five grounds (three bands, a third at night), every event fingerprinted: 9ed5dc483c62d3c4 before and after (not one decision
  changed); the brain's time 14.1-14.5 s -> 12.8-13.5 s, moves over 12.5 ms 148-160 -> 122-135.

## THE GATES
- NO AMMO, NO SHOT (gates/no_ammo_no_shot_gate.js) 12/0, three new legs and two plants: N6 AN EMPTY POCKET GUN STAYS IN THE POCKET (16
  fights on AUTO: a swap that brought out a gun with no round 0; by hand, a rifle in his bag with 0 rounds is refused; planted: allowed
  by hand, caught), N7 THE CARD SHOWS WHAT HE CARRIES (a rifle walked in with 2 reads 2 of 10 carried, the gun's own load 1 of 1; the
  card's writer puts FIGHT.carried on the card), N8 THE FIGHT'S TURN COUNT STILL GOES HOME (one 'rounds' key in the home message, the
  turn count; planted: the ammo report back under 'rounds', 2 keys, caught).
- THE WHOLE LOOP PLAYS (gates/the_whole_loop_plays_gate.js) 11/0: step 8 now also holds THE TURN COUNT CAME HOME (the map's
  outcome.turns is the turn the fight was won on; red 5 of 5 on the old build), and a LEAVE that does not go home names its cause (what
  lay under the finger, the end screen's own state, what threw). LOOP_END_SLOW=1 times the end on a phone slowed 4x; LOOP_THROTTLE=n
  slows the whole run.
- LEAVE WAITS FOR THE SCREEN (FIXES 3's) 5/0. THE RELOAD IS LOUD 17/0 alone (15/2 only while two browsers ran beside it, as on 11/22).

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js now reads home after LEAVE: the map's turn count and SPOILS.sent)
THE WHOLE LOOP PLAYS on the demo upright (11/0, the turn count home 1, won on turn 1); through the map's own door (district suburb), AUTO to
the end, the end screen's LEAVE: the alpha upright 2 fights (turns home 4 and 5, the fights ended on rounds 4 and 5), the demo sideways 2
(5 and 4 of 5 and 4), the alpha sideways 2 (4 and 6 of 4 and 6); the end screen handed the fight on 'load' at 154 to 352 ms unslowed (the
pictures are in first on this box; 'ready' leads only on a slow phone); 0 page errors.

## RULE 480(c), THE FIGHT ON A SLOWED PHONE: WHAT WAS MEASURED, NOT YET CUT
- THE BRAIN'S LONG MOVES: headless, the fight's AUTO brain over 20 fights on five grounds: a move thinks 2 to 3 ms at the middle, but
  about one move in fifteen takes 12.5 to 91 ms (50 to 360 ms on a phone 4x slower: a frozen frame each). They are his gunmen's first
  turns on a full board (a rifle 65 ms, a crossbow 23 ms, round one, twelve men standing): bestTurn plans the whole turn at once, every
  tile he can reach times every man he could hit from it. The profile: the rules lookup R() 10.5 percent of all the thinking (a path
  split and walked on every call), onField 5.9, chanceWith 5.7, dist 4.8. NEXT for this lane: cut the planner's long move without
  changing one decision (the gates that replay fights by seed hold it).

## SAID PLAINLY
No VOTE card: nothing on the glass looks different (the turn count is a number the map keeps; the end screen comes up sooner on a slow
phone; an empty gun stays in the bag). The words in the feed and on the card are other lanes'; no line rewritten (465).
[bb Battle Brothers: the after-battle report shows the battle's own numbers, and its loot screen opens when it is ready, never half-drawn]
[analog horror: a count that read zero on every tape, a recorder that never knew how long the fight ran]

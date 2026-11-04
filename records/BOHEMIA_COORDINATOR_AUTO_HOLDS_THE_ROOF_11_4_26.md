# AUTO HOLDS THE ROOF (the coordinator 11/4, by his leave in the quiet days; VAMILY rule 385 and its amendment; ask lines 416, 417)

## HIS WORDS (verbatim, transcription kept)
"when it comes to climbing on top of a roof why am I like watching my people like climb on top of a roof and then climb off to get a
shot like I'm just so fucking confused like just stick on the fucking roof, you're gonna get a better defense bonus and the whole
enchilada... I'm losing battles because the auto run keeps wanting my motherfuckers to like get off the roof"
"I'm seeing them have other Enemies in range of a shot and like they're still getting off the roof... why can't they just post up for
just one fucking turn to see if Enemies start getting closer or something, especially when it's a tight battle"
"I give you permission to only fix this roof bug right now with the auto combat... the auto combat doesn't see the positives of
staying on a defensive position" (the one build allowed in the quiet days, rule 382)

## THE CAUSE (read in slices/BOHEMIA_FIGHT.html, then measured)
Three of AUTO's moves could take his shooter down off a roof, and none of them gave his side's storeys any worth:
1. THE BEST TURN (planTurn's walk-then-strike): a lower tile with a shot a few points likelier (closer) outscored the shot from the roof;
   every 'left with a shot' in the probe was this ('strike').
2. AUTO FINDS A SHOT (vantage) and THE WALK ON (the move section): with no shot from up there, the shortest walk to a tile with one, down
   on the street, the very next turn.
3. THE CLIMB scored a storey for THEIR men only (rule 366's storey_weight, 'u.side !== you').

## THE FIX
- keepsRoof(u): AUTO's shooter of his a storey or more up keeps his storey this step when he can shoot from where he stands, or when he
  is still POSTING UP: hold_turns turns from the first turn he opened up there (hold_turns_tight in a tight fight: his standing men no
  more than theirs, or one of his down). ours.auto_holds_the_roof { on, hold_turns 1, hold_turns_tight 2 }.
- The best turn's walks, the vantage tiles and the walk on skip every lower tile while keepsRoof holds; moveTo refuses a lower tile to
  any AUTO move (AI_DEPTH, set by aiStep) as the backstop; his own taps, a retreat, a man who runs, his clubs and their men untouched.
- His climb scores the storeys the way theirs does.

## MEASURED (tools/bohemia_combat_auto_holds_the_roof_probe_11_4_26.js, 120 fights: wolves, raiders, robots, the act-one bosses)
| | before | after |
|---|---|---|
| turns his shooter opened up there | 692 | 769 |
| ended the turn still up there | 628 | 729 |
| left the roof with a shot from it | 24 | 0 |
| came down before posting up | 16 | 0 |
| climbed and came straight back down | 24 | 0 |
| fights won (wolves, raiders, robots, bosses) | 6, 29, 22, 17 | 6, 29, 22, 18 |
| his men down (the same four) | 110, 13, 42, 67 | 111, 16, 46, 63 |
Honest read: the roof behaviour is fixed outright; the wins barely move in the bench (one more boss won) and his men down are within the
bench's noise (232 before, 236 after). The bench's wolves are lost 23 of 30 either way: that is the big beasts' tuning (rule 370(9)),
not the roof.

## GATES
- NEW gates/auto_holds_the_roof_gate.js 3/0 (R1 the rule is data; R2 a shot from up there keeps him up there on AUTO, his own tap still
  walks him down; R3 the probe's fights: 0, 0, 0).
- Re-run on this tree: CLIMB OR ATTACK 6/6, AUTO PLAYS THE BEST TURN 7/0, AUTO NEVER LEAVES A MAN 8/0 (and the rest in the commit).
- AUTO PLAYS SMART: its probe now counts a shooter posting up on his roof apart (posted_up), as it counts a rest for breath; its one red
  leg (2 idle boss turns) is red with the roof rule switched off too: it was red before this change and is not this change's.

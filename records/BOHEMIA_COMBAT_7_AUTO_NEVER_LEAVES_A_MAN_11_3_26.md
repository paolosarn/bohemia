# COMBAT 7: AUTO NEVER LEAVES A MAN (11/3/26)

Brief (the coordinator, 11/3, check-in 10): EYES' broken items 1 and 2 (records/BOHEMIA_EYES_THE_SEVENTY_ROWS_WALKED_11_3_26.md),
then the open asks page's section 5 smalls 139, 152, 229 (records/BOHEMIA_FINISHER_THE_OPEN_ASKS_11_3_26.md). Rows 96, 109, 319,
331, 332, 139, 152, 229 of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md. Rules 297 (tokens), 322, 328, 332, 333.
Pushes: 0de54ccb (item 1 alone, BUILD 11/3zzzc), then items 2 and 3 (BUILD 11/3zzze). VOTE: combat-7-auto-never-leaves-a-man-11-3.
VOTE TAB GATE: this card's why was four sentences, now two with where; its other reds (two DYNASTY cards' where, the alpha's landing) are on main.

## 1. AUTO WALKED AWAY FROM THE ONLY ENEMY (rows 96, 109, 319, 331)
EYES, fight three: a RUNNER beside RAUL's roof stabbing him rounds 5 to 7; YOU (splitting maul, AUTO, 'Wavering') walked east
2,4 -> 6,3, then 6,6 and climbed an empty roof, then back to 2,6, and swung on round 8 after RAUL fell.

WHY (measured, headless on the live rules, tools/bohemia_combat_auto_never_leaves_a_man_probe_11_3_26.js and the gate's N1
set-up): 'Wavering' was not the path. With only the runner on the field, 24 of 25 set-ups were fine. Add a second man of theirs
who has BROKEN and is running (Fleeing, still on the board on his way to the edge) and 22 to 23 of 25 go wrong exactly as EYES saw:
to AUTO a man who runs was a full target. Three places:
- huntField (the old brain's walk when nothing is hit this turn): the walk's distance field grew from EVERY man of theirs, so his
  man walked to the nearest, the runner.
- bestTurn's climb: a roof next to the runner was worth 'next turn's blow' on him (0.6 x his blow from the roof, rule 332 amended),
  so he climbed it; the runner was gone by then (the empty roof).
- the walk-then-blow and the old brain's tile targets took a runner like any man.
When the runner left the board he walked back. Three turns.

THE FIX (slices/BOHEMIA_FIGHT.html, AUTO only; no board code):
- huntField: his men hunt the men of theirs who STAND; a runner is hunted only when no standing man can be reached (or every one of
  them runs: the rout, rule 198, unchanged). The field carries keepOffRunners for the two below.
- bestTurn: no walk for a blow on a runner while a standing man is in the walk's reach, UNLESS the blow is a kill on offer
  (pk >= ours.auto_best_turn.kill_on_offer, rule 332's own 'a kill on offer always wins'). Measured why the exception: without it
  wolves fight 7 (the probe's seeds) was lost, a hurt running wolf left alive to rally.
- next turn, from a tile he WALKS OR CLIMBS to, counts no runner (he will be gone from there). From where he stands it is as
  before: measured, excluding runners there too moved a weapon swap and lost raiders fight 3.
- the old brain's tiles: no runner as a tile's target while a standing man is in reach.

MEASURED:
| | before | after |
|---|---|---|
| the fight-three set-up (25 boards, a runner beating his friend, another running, his maul 4 to 6 tiles off) | 23 of 25 wrong | 0 of 25 |
| COMBAT 6's planner test, 120 fights (wolves, raiders, robots, the act-one bosses), his wins | 79 | 79 |
| his men down in those 120 | 197 | 196 |
| the same 32 fights the best-turn gate's B6 plays: wins, men down | 21, 59 | 21, 59 |
| turns of a melee man of his, a standing man of theirs beside a friend and reachable, no blow and farther away (577 such turns) | 1 | 3 |
COMBAT 6 measured 81 of 120 before the boards were rebuilt (COMBAT MAPS 2 and 3); on today's boards the planner test gives 79 with
and without this round. The 3 walk-away turns were each read: a roof climbed for a STANDING man's blow next turn, a walk to the
nearest standing man round a house, and the old swap quirk (best turn picks a swap that cannot be made; the old brain steps once).
None is a runner chase.

## 2. THE ROUND SWING'S HINT LIED (row 332)
The swing hits the three in front (rule 333, ours.round_swing) but the hint read SWEEP_SAYS.ring, 'It hits every man of theirs around
you.' sweepTap now reads 'front' when FIGHT.frontSwing(sk): 'It hits the three in front of you: him and the man on each side of him.'
(draft:true). The square's picture already drew the three (shapeTiles). Seen on the upright phone by touch (the gate's N5).

## 3. SECTION 5's SMALLS
139 WHEN THE ENEMY BREAKS (EYES R6: on AUTO the fight decided by itself; WAIT never read RUN THEM DOWN). By hand it already asked.
Now on AUTO too: the moment every man of theirs runs, the line says 'They are breaking. SPARE THEM, or RUN THEM DOWN.', WAIT reads
RUN THEM DOWN and RETREAT reads SPARE THEM, and the fight holds ours.chase_calc.ask_beats (8 beats, four seconds at 120 BPM) for his
tap: SPARE THEM ends it as before; RUN THEM DOWN sets S.runDown and AUTO chases (it never ends the fight as spared while it holds);
no tap and the rules choose as before (the calculator, rule 198(h)). A rally clears it and the next break asks again.
152 THE CAMERA HOLE (EYES R6: 1.8 s after the board, full size, 15 or 16 of 16 off the glass, computer). NOT MET on today's build:
a demo road fight on the computer, 5 of 5 on the glass at 1.8 s (and every sample of the first 3 s); the camera gate on the
computer, 0 fighters off the glass in 2,355 frames of two fights of 20 and 21. That gate's legs 1, 3 and 6 are red on main and here
for another reason: the frame sits 6 points high because the page frames clear of the bar at its TALLEST this glass has seen
(BAR_TALL, on purpose so the frame holds still while the bar's lines change turn to turn: 732 to 764 px on the computer, measured),
and the gate's own tallest starts later. Not a man off the glass; left for the camera's owner to rule which tallest counts.
229 A LONG AUTO FIGHT ON THE COMPUTER: three, 22 to 26 fighters, 5 to 9 rounds, the break answered SPARE THEM: 0 page errors,
0 drawImage throws.
Left for later, as briefed: 90, 103, 108.

## GATES
New: gates/auto_never_leaves_a_man_gate.js, 8 of 8: N1 the repro (0 of 25; the brain before 23 of 25, so it bites), N2 the kill on
offer, N3 the break asked on AUTO (upright, touch, nothing moves while asked) and N3b RUN THEM DOWN holds, N4 sideways, N5 the swing's
words, nothing threw on either.
Run on this tree: AUTO PLAYS THE BEST TURN 7/7 (B6: won 21 against 20 for the brain before, down 59 against 61), CLIMB OR ATTACK 6/6, AUTO KILLS ONE AT
A TIME, WEAPON SHAPES, EVERY MAN HAS A JOB, WALK THROUGH YOUR OWN MEN, THE CELL VEST, RETREAT AND THE ROUT 13/0.
Red and not this round's: THE FORMATION IS KEPT 19/4 (the lineup's drag and the kept line, before anyone runs; this round changes
nothing until a man of theirs runs), DERIVED FRESHNESS (the canon index), INLINED FRESH (an engine module's banner), THE FIGHT AS
CLOSE AS IT CAN BE on the computer (the 6-point centring above).

[bb] Battle Brothers lets the player choose the rout once they all run (Paolo 10/26: 'spare them or run them down'); its brothers are
never on AUTO, so the rule for AUTO is ours: stay on the man who is hurting your friend.
[analog horror] nothing new drawn: the ask sits on the same receipt paper as every line; the fight goes still for four seconds while
it waits, the music under it.

## 4. RULE 365, RETREAT IS A RUN FOR THE EDGE (ask line 389; the coordinator's carry-on list, piece 3)
MEASURED FIRST, the real button: on the bare fight page a mid-fight RETREAT already ran Battle Brothers' way (11 of 12 men out one
by one in round 1). The 'it just auto ends the fight' was the LINEUP: every demo fight opens on it, and there RETREAT ended the fight
at once (rule 253's WITHDREW, no run seen). On the upright phone the bar's RETREAT sits under the phone; he presses the phone's own
retreat (its arrows), which presses the same button.
NOW (slices/BOHEMIA_FIGHT.html retreatFromLine, the button's lineup branch): from the lineup one press starts the fight with the order
given and his men take round one FIRST (rule 253's 'not like I take the first turn'); each runs for the nearest edge and is out on it;
every man out with his hit points as he came in ends WITHDREW exactly as rule 253 kept it (nothing kept, no pay, the map's bounce);
a man caught is fought and the run ends as any retreat (LOST, no pay). Mid-fight: unchanged rules, now gated by the real button.
Broken enemies: flee() already runs them to the nearest edge and off it (gated E3: 12 of 12 left, none walked back).
GATES: RETREAT IS A RUN FOR THE EDGE (new) 5/0: E1 by hand upright by touch (the fight goes on at the press, 4 of 4 out, LOST),
E2 on AUTO sideways (2 out, 2 caught and down, LOST), E3 broken enemies. RETREAT FROM THE LINEUP (amended to rule 365) phone 3/0:
six factions, 7 to 12 steps of his men, 4.7 to 5.7 s, WITHDREW, none of theirs moved; the demo with a job held through the phone's
own retreat: back on the map, nothing changed, the job his, two blocks away.
VOTE: combat-7-retreat-is-a-run-11-3 (the lineup press and a mid-fight press on AUTO, filmed from the fight's camera on his phone).

## 5. RULE 366, THE ENEMY WANTS TO LIVE AND TAKES THE HIGH GROUND (ask line 390; piece 4)
MEASURED FIRST (tools/bohemia_combat_the_enemy_wants_to_live_probe_11_3_26.js, 60 fights, the best-turn probe's kinds and seeds):
- target choice: of their blows with a choice, 91% already on the most hurt man of ours or a shooter (Battle Brothers' AI picks).
- abilities: they already carry Battle Brothers' perks (enemies.json, 144 of 160 rows) and use the active ones: 37 uses in 60 fights
  (Rally, Rotation, Footwork, Recover, Round Swing, Shatter, raise); aiLast's Indomitable and Taunt. A losing side breaks by the
  morale rules (Battle Brothers').
- the gaps: 124 of 930 walks of theirs ended ALONE where 3 or more of ours could hit him next turn, having struck nobody; their
  shooters (backline, kid, mechanic) had no climbing brain, so a roof came only from the turn's score.
THE FIX: (a) the old walk (theirs, nothing to hit): a tile where alone_into (3) or more of ours can hit him next turn, with no man of
his beside it, counts alone_penalty_tiles (1) step farther from the fight (ours.enemy_wants_to_live; Battle Brothers'
PotentialDanger). Counting swords only was tried and measured: in these fights a lone man almost never stands in three swords'
reach, it is the guns that catch him, so every man who can hit him counts. (b) ai.json backline, kid and mechanic take the high
ground (the climb brain, rule 328 kept: never while a tile gives the shot this turn); climb() weighs each storey as storey_weight
steps, so theirs take the highest roof with a man of ours in range.
THE PRICE, MEASURED: two steps cut the alone walk-ins 124 -> 63 but cost his AUTO against them (the best-turn gate's B6: his brain 20
wins, the one before 23); ONE step cuts them 124 -> 84 (of about 910) and his AUTO holds (B6 21 against 19). A hurt-only or a
walk-in-only price was tried and left his men idler. SHIPPED: one step, every man of theirs.
MEASURED AFTER (the same 60 fights): alone walk-ins 124 -> 84; their hits on the hurt or a shooter about 91%; a shooter with no shot
anywhere this turn and a roof that gives one is rare (7 to 8 turns in 45 to 60 fights) and now takes the highest. His wins (the
120-fight planner test) 79 -> 81 (wolves 8, raiders 30, robots 23, bosses 20).
EVERY MAN HAS A JOB (COMBAT's gate): RED ON MAIN before this round's enemy (J3 his idle turns 2.24%, limit 1%); with it J3 1.19%;
J4 his crew's wins 157 of 300 against the gate's fixed 158 (one fight, now against a smarter enemy; the fixed number was measured
against their old brain). AUTO PLAYS THE BEST TURN 7/0.
GATE: THE ENEMY WANTS TO LIVE (new) 4/0: W1 the rule is data; W2 a lone man of theirs, four of ours ahead: 0 of 10 walk into three
(the brain before 10 of 10); W3 two roofs, he takes the higher (3 storeys over 2); W4 their Rally on two breaking men.
VOTE: combat-7-the-enemy-wants-to-live-11-3 (the lone man before and now, their shooter's climb; the fight's camera on his phone).

## 6. RULE 351(f), THE KILL CAMS (ask line 365; piece 5)
THE FIRST MODULE'S CAMERA: this clone is shallow (124 commits), so its June code is not here; its styles and rules are in the laws:
SHARP, HAMMER, CINE-FOLLOW, ORBIT, X-RAY, and for a stake HELD BREATH, CHAIN, LAST STAND, SHUFFLE the default
(laws/BOHEMIA_ADDENDUM_COMBAT_DNA_RF4_6_30_26.md; laws/BOHEMIA_ADDENDUM_COMBAT_6_27_26.md, whose open TODO was 'quantize killshot camera
lengths to beats'); the research's 'the kill cam earns its length' (records/BOHEMIA_COMBAT_RESEARCH_THE_ADDICTIVE_SAUCE_7_27_26.md s6).
NOW (slices/BOHEMIA_FIGHT.html killCut/cutStep/cutAfter/cutSkip; ours.kill_cams): a kill of theirs he sees holds its fall's note for
whole beats: short_beats (2) with a shuffled style; long_beats (4) only for a stake: the last of theirs, a boss or a champion (HELD
BREATH), his last man standing (LAST STAND); a second kill by one man in his turn is a CHAIN (short, the gap waived); never two cuts
within gap_beats (2); AUTO halves each; a tap skips it. Sound: real recordings from the approved bank (vital_deep under HAMMER, the
heartbeat under HELD BREATH), on top of the kill's own death sound.
FRAMES, MEASURED on the upright phone (390 x 844 at 3x; this container draws in software, about 35 to 44 frames a second either way, so
the measure is each frame's own draw against the same kills with the cams off): first build eased the fight's zoom every frame and
redrew the ground every frame: 37 to 55 ms a kill frame against 17 with no cam. Stills at a closer zoom still drew every man and the
ground at twice the pixels: 37 to 52 ms. SHIPPED: the camera never moves for a cut; the punch-in is the camcorder's digital zoom, the
finished picture scaled toward the man who fell by the browser's compositor (CSS keyframes per style: HAMMER's jolts, ORBIT's turn,
HELD BREATH's push), the tags over the men step aside for the beat, X-RAY one full-glass negative fill on a frame drawn anyway:
kill frames 16.7 ms with the cams against 18.9 ms without (the gate's K6). On his phone the compositor's scale is the graphics chip's.
GATE: THE KILL CAMS (new) 7/0: K1 data; K2 earned and on the beat (sharp 1b, follow/chain 1b, held/last 2b, xray 1b, hammer 1b on AUTO);
K3 every style on a real kill; K4 the camera never moves, the tags aside and back; K5 a tap skips it, the bars go, the fight goes on;
K6 no frame lost; nothing threw.
VOTE: combat-7-the-kill-cams-11-3 (each style stepped through on a real kill from the fight's camera on his phone; PLAY WITH SOUND plays
the game's own death and blow recordings under each).

## 7. RULE 367, THE DECOY (ask line 391; piece 6, the last)
A PERK, HIS NAME AND HIS LINE: perks.json row decoy ('Decoy', tier 3, its description his words: 'Did you seriously just walk around
with a cardboard cutout?', 4 AP and 10 breath, marked ours, not Battle Brothers'); its numbers in TUNING's table, ours.decoy (30 hit
points, a tile up to 2 away, once a fight, AUTO's share and floor, the enemy's archetypes).
THE CUTOUT (slices/BOHEMIA_FIGHT.html setDecoy, the skill 'decoy'): a copy of the man who set it (his look, his weapon's threat, its own
30 hit points) stands on the tile; the other side's brains see a man of his there and go for it. It takes no turn (newRound), holds no
zone (zocOn), never swings or shoots (threatReach, freeShot), is no friend (friends) and no man of his alive (alive); knocked down it is
cardboard (fall: no death roll, no morale, no XP, an event of its own, 'knocked'); at the fight's end it is a prop (emit 'over'), never
listed among his men on the end card or in the message home. AUTO and the enemy set it when half the hurt he expects where he stands
is worth more than the floor, on the free tile nearest them (planTurn 5b). The enemy's kids and riders carry the perk.
By hand: the DECOY square (a cutout on its stand), then a tile; the line asks 'Tap a tile to set the cutout down.'; set down and
knocked over are said on the board (draft:true), with the approved set_down and body_land sounds.
GATE: THE DECOY (new) 6/0: D1 the perk is data; D2 his cutout between him and three of theirs struck in 6 of 6, no turn, no swing, no
zone, cardboard, never his man; D3 a kid of theirs sets his own (8 of 8); D4 by his finger on the upright phone (the square, a tile, the
cutout there); never among his men at the end; nothing threw.
VOTE: combat-7-the-decoy-11-3 (set down, struck four times, knocked over; the fight's camera on his phone).

## 8. RULE 377, HEAVY ARMOUR COSTS A TILE OF WALKING, NEVER A SWING (ask line 406; the coordinator's item after the decoy)
TUNING'S KEYS WERE NOT ON MAIN when this was built (826053be), so the fight reads a DEFAULT behind the key ours.armour_weight, marked
tuned:false and TUNING's (TUNING 2 owns every number in it, rule 377(7)): the classes LIGHT under 15, MEDIUM under 30, HEAVY under 45,
HEAVIEST above; walk_ap 0, 0, 1, 2.
MEASURED FIRST (the coordinator's record said no armour weighs anything in the fight; it does): armor.json carries Battle Brothers' own
weight on 71 of 83 body rows and 73 of 91 head rows (Max. Fatigue; the cloth rows are the wiki's blanks), and the fight already takes it
off his breath and initiative (gearFat). That weight is the class's measure: the body piece and the helmet added, Brawny's share off.
A coat of plates (42) and a full helm (20) is 62, HEAVIEST; the middle crew's mail hauberk and padded flat top (27) MEDIUM. An enemy wears
the pieces of his wiki gear nearest his rolled armour (a fallen hero 45, HEAVIEST; a brigand leader 24 less Brawny, MEDIUM; a thug 0).
THE CAP (slices/BOHEMIA_FIGHT.html wornWeight, weightClass, walkCap, walkLeft): walk_ap comes off what he may spend WALKING this turn,
never off AP: reach() never lights or plans past it (a turn's cap, or what is left of this one), moveTo() stops a step that would pass it
and counts u.walked, farWalk() stops there too, newRound() starts it again. Strikes, shots, reloads and every ability spend u.ap as
before. A man who has not moved has all 9 for anything he owns (recover at 9); walk one tile (2) then strike (4, or 6 two-handed) still
fits under 9 and under the cap. The brains read the same cap: their next-turn walks (stepsOf, deathWorth, dangerAt, threatReach) and
the stand-ins AUTO plans with (standIn, shotFrom: a full turn walks fresh, the rest of this one counts what the walk there spent).
THE WORDS: the out-of-AP card says THE ARMOUR WEIGHS ('His HEAVIEST armour: no walking left this turn. Turn over.') when the cap, not the
AP, stopped him. engine/bohemia_roster.js weightClass (the same row, the same weight) gives the shop and the crew card their words:
the shop's card for a body piece or a helmet (ARMOUR CLASS MEDIUM to HEAVIEST, ONE LESS TILE; labels only, FIXES' stock code untouched),
the crew screen's card under his stats (ARMOUR: HEAVIEST, ONE LESS TILE).
NOT THIS RULE'S, MEASURED FOR TUNING: the armour's older Battle Brothers cost, its weight off his BREATH, already blocks some swings: on
a sellsword's own breath (93) in a coat of plates and a full helm, 5 of 23 kinds of weapon swing in light and not in the heaviest
(two_handed_spiked_mace, woodcutter_s_axe, two_handed_wooden_flail, two_handed_mallet, pitchfork: their swing costs more breath than he
has with the bag's weight on top). Paolo's 'never impossible to do any sort of attack' may want that looked at; it is TUNING's number.
GATE: HEAVY ARMOUR COSTS A TILE (new) 8/0: A1 the rule is data; A2 standing still in the heaviest he strikes with all 23 kinds of weapon
he can in light, every ability (adrenaline, recover, rotation, rally, taunt, footwork, indomitable, decoy) used as in light, walk one
then strike (one- and two-handed); A3 walking reach 4 light, 4 heavy, 3 heaviest; A4 8 AUTO fights, heaviest men on both sides, no turn
walks past its class (the fight before: 35 did); A5 the lit reach on the upright phone's own canvas: 4 off lit in light, dark in the
heaviest, 3 off lit in both; A6 at a fortress armourer by his finger every armour piece names its class and walk, the crew card its class.
Re-run on this tree: AUTO PLAYS THE BEST TURN 7/0, AUTO NEVER LEAVES A MAN 8/0, THE ENEMY WANTS TO LIVE 4/0, RETREAT IS A RUN FOR THE
EDGE 5/0, THE DECOY 6/0.
VOTE: combat-7-heavy-armour-costs-a-tile-11-3 (the same man on his phone in light armour, then the heaviest: the lit ground 4 houses,
then 3; he walks one and still strikes; the shop's card).
[bb] Battle Brothers puts armour's weight on maximum fatigue and initiative only; a plate man walks as far as anyone and tires sooner.
Ours keeps that and adds one clear tile, the cost a phone player sees on the ground before he buys.
[analog horror] the lit ground is the lamp's lift on the tiles, never a new colour; the shorter walk is read off the same chalk line.

## 9. RULE 379, THE KILL CAMS SWITCH, OFF FOR NOW (ask line 408; the coordinator's first item after the armour)
His words: 'Kill cams came in like ugly dogshit, they are far from final, let's have a kill cam setting while you still work on it,
it's fucking with the visuals they are that bad. Toggle kill cams on or off.'
THE ROW (slices/bohemia_killcams.js, built the way slices/bohemia_difficulty.js builds FIGHTS): KILL CAMS, ON / OFF, on the game's one
settings card behind the gear, under FIGHTS; its own line under it (draft:true); hidden on the start screen (body.setatstart) as FIGHTS
is. ONE TRUTH: localStorage 'bohemia.killcams.v1' holds 'on' or nothing; NOTHING IS OFF, the default (rule 379(b)). The alpha loads it
beside the difficulty row; the demo carries it from the cut.
THE FIGHT (slices/BOHEMIA_FIGHT.html killCamsOn): read at every kill; off, killCut returns before anything (no cut, no bars, no
camcorder zoom, the tags never hidden, no sound): nothing on the board changes. A tap holds from the next kill.
GATE: THE KILL CAMS 8 legs now: K7 THE SWITCH, OFF BY DEFAULT: the game's default fight (nothing set) plays seed 23 on AUTO, 3 kills,
0 cuts, the board never cut; on the demo on his upright phone the gear's card carries KILL CAMS (ON / OFF) under FIGHTS, OFF lit, his tap
on ON keeps 'on', on OFF clears it. K2 to K6 run with the switch ON, as he would turn it on.
NEXT, behind the switch (rule 379, the rest): what made them ugly, from this lane's own clips: the punch-in is a CSS scale of the whole
composited glass, so every pixel of the 112 px art is blown up and smeared by the browser's filter, and the tags stepping aside leave
the man bare for a beat; the rework draws the close-up at the art's own pixel size like the starred loading-screen camera feeds, with
a before and after card; OFF until he says they are good.

## 10. RULE 378, NO CAP ON HOW MANY FIGHT (ask line 407; the coordinator's second item)
His words: 'make sure there's not a cap on the amount of players on screen, enemy and my company... it feels like there's a cap...
make sure there's no coded cap'.
MEASURED (headless, the live fight): rowsOf put his men in two rows of nine (ours.formation.slots_per_row) and centred() wrote the
spill at negative slots: 19 of his left 1 with no tile, 24 left 3, 30 left 6 (x and y undefined). ON HIS PHONE that was worse than a
missing man: 30 against 40 opened on a BLACK SCREEN, because the first man to act had no tile and the camera took his NaN (the card's
before frame). A company handed with no cap was also cut to twelve (ours.field_size).
NOW (slices/BOHEMIA_FIGHT.html):
- rowsOf: up to eighteen the rows are exactly what they were (measured: the same boards and the same tiles as main for 6, 12, 16 and
  18 men on three grounds); past them the rest go to rows.more, never a negative slot; a roster's handed line with both rows full
  sends the men it left out to more.
- deployCrew: rows.more takes a third column behind the back row and more, each filled from the middle out on open ground; anybody
  with no tile there takes the nearest open one (nearest, then anyOpen); nobody stays off the board.
- place (their side): a man with no column left takes the open tile nearest their line (anyOpen).
- setup: the deal is dealBoard(); when the open ground on his side (columns 0 to his front) or theirs (their front to the edge) cannot
  hold the men, the board is dealt again a block taller, the same deal and seed, until both fit (S.grown); every block dealt, never a
  black margin; a named board is what it is.
- the crew: a company handed with no cap fights whole (opts.cap || the company); a cap the caller hands still picks.
GATE: NO CAP ON HOW MANY FIGHT (new) 6/0: N1 30 against 40 on three grounds and three seeds, all 70 on the board, nobody off or
stacked, each on his side (the rows before: 6 of his off); N2 60 against 100, the board grew to 20 x 20 and 20 x 25, every block dealt;
N3 a handed line of eighteen and six more, all 24 stand; N4 14 handed with no cap, 14 fight; N5 on the upright phone, 30 against 40,
all 70 on the board, nothing threw. THE FRAMES, MEASURED HONESTLY: in this container's software renderer (no graphics card) the page's
own draw is 40 ms a frame at twelve a side and 61 ms at 30 against 40 on the same board and seed, 1.5 times for nearly three times the
men; the leg holds it under 1.6 times. On a phone's graphics chip both are lower; the ratio is the claim.
NOT THIS LANE'S, FLAGGED: (1) the road's cap of 8 is WORLD 8's (BOHEMIA_CITY_WORLD.html roadFightRoster). (2) THE ORIGIN'S FIELD CAP:
the start screen hands the fight cap = origins.json field_cap (12, or 16 for two origins; rule 63b: 'twelve on the field in a normal
fight, the roster twenty'), so a company of more than twelve still fights twelve at the game's door. Rule 378(a) says no code caps how
many stand; that number is RUN's and the coordinator's to rule on (drop the cap at the door, or keep twelve as Battle Brothers does).
VOTE: combat-7-no-cap-on-how-many-fight-11-3 (30 against 40 on his phone: before, the black screen; now, all 70).

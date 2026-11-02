# COMBAT 6: AUTO PLAYS THE BEST TURN (THIS TURN AND THE NEXT); THE ROUND SWING HITS THE THREE IN FRONT (11/2, BUILD 11/3zv)

Paolo 11/2 (rules 332 and 333; ask lines 331 and 332): "are we going to let auto combat use abilities... two offhand items you can
bring... a rifle and a melee weapon... I don't want AI to prioritize finding the mechanic, then the melee guy has to go straight for
the mechanic and dodge through all the robots... I don't need you to be the world's best chess simulator... the best course of action
in that turn, to do the most damage and take the least damage within that turn... round swing right now hits eight people around
you, I don't think that should be the case, I think it could hit three tiles... what decides whether the round swing happens... what
happens if the character is out of stamina... maybe that puts it in perspective for you to tweak it yourself."

## MEASURED BEFORE

The probe (tools/bohemia_combat_auto_best_turn_probe_11_2_26.js, new) plays the live fight headless on AUTO for both sides: 30 fights
each of wolves (direwolves and hyenas, 1.5 a man), raiders (brigands), the mechanic and his robots, and the three act-one bosses with
their crews, companies of 3 and 6, early and middle kit, the same seeds and boards as COMBAT 4's probe. `--old` turns this round's two
changes off in the memory copy (the crew's best_turn, ours.round_swing.on): the brain and the swing before, on the same seeds.

Before (main at eb3d809f; the table below re-measures OLD on main a8c884fa's boards, after COMBAT MAPS' new blocks: 84 won, 16 long
chases, 28 free swings, 2 swings striking 4):
- AUTO used NO ability in 120 fights: 0 sweeps, 0 perks, 0 swaps (rule 180(g): 'abilities are his button').
- Long chases (a walk of 3+ tiles in his turn ending inside the reach of 2+ of their clubs): 17. The melee man walked to the named man
  (rule 201's joinFocus) wherever he stood, the robots between them or not.
- His men took 41 free swings walking out of rings.
- Their axes' Round Swing struck everything round them: 7 swings, 16 men, 2.3 a swing.

## WHAT SHIPPED

**1. AUTO PLAYS THE BEST TURN (rule 332).** slices/BOHEMIA_FIGHT.html `bestTurn` (the crew's switch `best_turn` in ai.json; every
weight in ours.auto_best_turn, drafts for TUNING). Every time a man of his on AUTO acts, everything he can do THIS turn is listed:
- a blow on each man in reach; every sweep of his weapon on each man it can be aimed at (Shatter, Round Swing, Split; the whip's Disarm became a luck roll on a landed lash on main this round, ARMORY's VOTE FIXES);
- a walk, then a blow or a sweep (a whip's lash from the second tile is a blow from that tile; a tile his walk climbs a roof to gives
  none, rule 328);
- a swap to a weapon in his bag (the library's 4 AP, Quick Hands' first one free, Battle Brothers' way), then that weapon's best blow;
  and the weapon he ends the turn holding counts like the tile: what it can do next turn from there (a sledge swapped for a pistol
  cannot swap back and swing on one turn's 9 AP; the trace showed that trap before the rule);
- a reload (then the shot when the AP is left, else half of next turn's shot);
- his perks: Rally (the breaking come back), Rotation (a friend in trouble trades places), Footwork (out of a ring with no free
  swing, then a blow), Recover (in place of a rest when it gives more back), and at the turn's end Indomitable (half of what is
  coming), Taunt (what it takes off a friend), Adrenaline (the kill it could make next round on a man who would otherwise hit first);
- the cell vest's squeeze, only when the risk shown would be taken: THE RULE: the preview burns none of his own men AND it drops two
  of theirs or more, or he is going down before his next turn anyway;
- holding (a turn with nothing spent is the rest COMBAT 3 made work: 30 back, not 15).

Each is scored in one coin, the hurt in health and armour: what it deals (his chance x the blow at the weapon's middle, every man it
strikes, each his own roll) plus the road to each man's kill (the share of him it takes and what it adds to the chance he drops, with
the team's blows still to come on the named man, x what his death is worth a round, x 2: rule 201's Lanchester coin, so a blow on the
mechanic is worth his machines), MINUS what he takes before his next turn on the tile he ends on (every man of theirs who can swing at
that tile or shoot it next turn, his chance there with the storeys and the cover in it, his blows, shared among the men of ours he
could reach, less the chance this action drops or disarms him: Battle Brothers' PotentialDanger, priced). The best is taken; the next
call lists again from where it left him.
- A SWEEP happens when its sum beats the best single blow (B2: three in Shatter's arc, Shatter; one, a plain blow).
- NO MULTI-TURN PLANS: with nothing to hit this turn he closes as before (the line, the shooter's tile, the roof), and a walk of 3+
  tiles in his turn that ends where 2+ of their clubs can swing at him is never taken, to close or to strike, unless the blow at its
  end drops a man at even odds or better. The walk to the named man (joinFocus) is off for his side: the mechanic is struck when he is
  in reach this turn, and then he scores highest of his own accord.
- A man in a ring of theirs does not walk out of it through the free swings (Battle Brothers' own); Footwork is how he leaves.
- OUT OF STAMINA: an action that would leave him unable to swing next turn (his breath after it, less the 15 back, plus the breath
  their blows are expected to put on him there, rule 313's, plus his blow, over his most) is dropped unless it drops a man at even
  odds or better (a kill on offer always wins); with nothing useful left he holds: the rest. So the round swing (35 breath in Battle
  Brothers, Shatter 30 here) happens when its sum beats the best blow AND his breath carries it, or it kills (B4).
- His gambits first: taunted he swings at the man who called him. Rule 201 kept: when the team is all but sure to drop the named man
  this round, a man who can strike him from where he stands does; every blow keeps its reason (u.pick); rule 191(a)'s shot floor and
  margin kept for shooters. COMBAT 4's tile picks for shooters stand: with no shot this turn, `vantage` and the roof as before; with
  a shot, the walk to it is scored in the same coin (the danger at the tile carries the storeys and the cover).

**1b. THIS TURN PLUS ONE DISCOUNTED NEXT TURN (rule 332 amended, ask line 334; the coordinator's routine, Paolo 11/2: "how does the
auto turn know that climbing a roof is what's best this turn if they are a ranged character... and that should apply to enemies with
guns as well... how do they know the best place to climb, even if it doesn't benefit them the most this turn, that investment of a
higher roof... compared to maybe taking a breath so you can make a triple swing next turn").** A score of this turn alone never climbs
(a climb ends his attacks, rule 328) and never rests for a bigger swing. So every option is worth this turn PLUS next_turn (0.6) x the
best ONE action his next turn can be from the tile and the state it leaves him in (the weapon in his hands, the gun loaded or not, the
breath he will have: after the action, less the 15 back or the rest's 30, plus what their blows put on him), against their men where
they stand now. One step, never deeper. WHY 0.6: next turn counts for a bit over half of this one because they move before it comes
(a man of theirs walks out of the shot, another walks in, the named man may already be down); at 1 a promise would weigh as much as a
blow landed now, at 0 nothing ever climbs or rests.
- WHERE TO CLIMB: every roof his walk climbs onto this turn is an option (no blow now), worth its next turn (the storeys' hit and
  range are in the shot from it) less what he takes up there (a wolf cannot climb, rule 321; a club swings up from beside it at -10 a
  storey); a roof is taken only when it beats shooting now from the ground and holding.
- REST FOR THE SWING: holding is scored the same way (nothing now, 30 breath back, then the best next turn) against striking now.
- THE SAME BRAIN FOR THEIR SHOOTERS AND SWINGERS (ours.auto_best_turn.theirs): after their own lessons (the hook, the net, the scream,
  Battle Brothers' climb for a shooter with no shot), with Battle Brothers' spread on their blows (rule 201(e)); with nothing to hit,
  or holding beating every option for anything but a rest for a bigger swing, they walk their own way (their rush, their line); no
  long-chase veto for them (Battle Brothers' men charge).
- Every pick is logged with its reason (u.btSay; the probe keeps the counts, three reasons a kind and two worked examples a kind).

THE THREE WORKED EXAMPLES (the probe's own fights and the gate's B7; the coin is hurt in health and armour, value = now + 0.6 x next
- what he takes before his next turn):
1. A RIFLEMAN CLIMBS (wolves, fight 'a shooter climbs', round 1, RAUL, light crossbow, no wolf in his reach from the ground): "climbs:
   next turn 39 from the roof x0.6 = 23, less 14 taken up there, beats nothing now and holding -16". Weighed: climb 9, rest -16. The
   wolves cannot climb, so the roof costs him 14 against 16 standing in the street, and gives the shot next turn.
2. A RIFLEMAN SHOOTS NOW INSTEAD (wolves, round 2, YOU, the pistol): "strike: 58 now + next turn 58 x0.6 (92) beats holding 0". Weighed:
   the shot from the next tile 92, the roof two tiles off 43 (0 now + 0.6 x 72 from up there). The roof's better shot next turn is
   worth 43; the shot now plus the same shot next turn is worth 92: he shoots.
3. AN AXEMAN AND THE ROUND SWING (the gate's B7, constructed: Battle Brothers' greataxe, three of theirs lined up in front, his breath
   one short of Round Swing; struck now he is still short next turn, rested he swings on all three): "strike: 96 now + next turn 96 x0.6
   (49) beats holding 4". The blow now plus a blow next turn: 96 + 0.6 x 96 = 154, less the 105 he takes = 49. The rest: 0 + 0.6 x 181
   (the swing on three) = 109, less the same 105 = 4. He SWINGS NOW. A rest needs next turn worth more than 1 + 1/0.6 = 2.67 plain
   blows; with the axe's numbers and rule 333's three tiles, the swing on three is worth 1.9 (Round Swing lands less often than a plain
   blow). At next_turn 3 (the gate's memory copy) the same man rests: "rests: next turn 181 x3 (442) beats strike 96 now (281)". In the
   fights, 9 rests in 120 were for a bigger next turn (most a mace man's breath for his next blow); the honest answer to "taking a
   breath for a triple swing" is that two blows beat one swing on three with these numbers, and the brain knows it.

**2. THE ROUND SWING HITS THE THREE IN FRONT (rule 333).** ours.round_swing (on, the skills Round Swing and Thresh, 3 tiles, Battle
Brothers' 6, was 8): the man aimed at, front-left and front-right of him as the striker faces him, never the five beside and behind.
Realism: a two-handed swing covers an arc in front of the man; eight on a square grid was more than Battle Brothers' own six round a
hex. Thresh rides it (the flail's, the same row and the same swing). Every side. The preview: aimed, the three tiles lit and a tag over
each man of theirs on them; armed before the aim, lit like an arc (every tile one of its aims reaches, the tags faint until he aims).

THE GATE: gates/auto_plays_the_best_turn_gate.js (new), 7 legs: B1 the rule is data; B2 a sweep when its sum beats the best blow; B3
the bag both ways (a club man swaps to his pistol for a man out of his reach and in its range, and shoots); B4 out of stamina (the
sweep his breath cannot carry is not swung, the one that kills is); B5 no long chase (the brain before walked in); B6 in the fights
(the probe's four kinds, his brain against the one before on the same seeds, both against their new brain: wins no fewer, his men
down no more, long chases no more, abilities or swaps used, under 4 minutes, nothing threw); B7 the rest is scored (the axeman above,
at 0.6 and at 3).
The three gates that judge his AUTO against a bank played on their OLD brain (auto_kills_one_at_a_time F7, every_man_has_a_job J4,
auto_never_wastes G8) play their side on that same old brain (BOHEMIA_THEIR_BRAIN=bank, tools/bohemia_tuning_auto_brain.js), so both
arms meet the same enemy; the new enemy brain's own effect is in the table below.
Amended to his rulings (newest wins): weapon_shapes_gate legs 2, 3, 6 (the three in front, straight and at a corner; never behind; the
brains sweep two in front); see_every_hit_gate P1, P2 (seven tiles lit armed, two tags aimed east); auto_never_wastes_a_turn G6 (it was
'AUTO uses no ability'; now abilities are used, still no reload with a shot on) and G3 (a blow left for a swap, Footwork, Rotation, Rally
or a rest for his breath is counted apart); the_cell_vest_gate V10 (it was 'AUTO never squeezes'; now every squeeze AUTO makes meets
the rule); the_pistol_is_never_a_club_gate (a swap to the bag's club and a blow with it is the bag doing its job; the gun never swings);
auto_plays_smart's probe and H4 (a turn held for his breath is counted apart, like a winded man's rest).

## MEASURED AFTER (the same probe, the same 120 fights; before in brackets)

Three arms on the same 120 fights (30 a kind: wolves | raiders | robots | bosses = total). OLD: both sides' brains before this round,
the eight-tile swing. HIS OLD: his brain before, THEIR side on this round's brain (the same enemy as NOW). NOW: this round, both sides.

| | OLD | HIS OLD vs their new | NOW |
|---|---|---|---|
| won | 6 28 29 21 = **84** | 4 27 26 22 = **79** | 7 29 23 22 = **81** |
| his men down | 120 25 15 42 = 202 | 125 33 31 41 = 230 | 110 16 35 40 = **201** |
| rounds a fight | 8.0 8.3 5.9 8.1 | 7.0 8.8 8.2 8.3 | 8.5 7.8 9.1 8.8 |
| minutes on AUTO | 1.0 0.9 0.9 0.8 | 0.9 0.9 1.2 0.8 | 1.0 0.9 1.3 0.8 (all under 4) |
| abilities (sweeps, perks) | 0 | 0 | 27 8 9 6 = **50** (Shatter 36, Rally 8, Recover 4, Rotation 2) |
| swaps from the bag | 0 | 0 | 121 109 109 100 = **439** |
| climbs for next turn's shot | 0 | 0 | 15 42 21 17 = **95** (theirs: 70 more) |
| rests: winded at the start / held for his breath / for a bigger next turn | 5 / 0 / 0 | 6 / 0 / 0 | 5 / 156 / 9 |
| idle turns (nothing spent, no reason) | 36 | 36 | **27** |
| long chases (3+ tiles, ending in 2+ clubs' reach) | 16 | 15 | **11** |
| the same, their shooters counted | 43 | 40 | 48 |
| free swings his men took walking | 28 | 46 | **11** |
| their Round Swing: swings / men struck | 2 / 4 | 5 / 10 | 6 / 13 (2.2 a swing, all in front) |

Read: against the same enemy (their new brain), his new brain wins 81 where his old won 79, loses 29 fewer men down, takes a quarter of
the free swings, chases less and is idle less. Their side on the new brain costs the old pair 5 wins of 120 (84 -> 79): a smarter
enemy, priced. Fights stay 0.8 to 1.3 minutes on AUTO. Robots are the one kind where NOW is behind (23 won, 35 down): the robots rest
less than his men, and his men's breath rests (58 against robots) are the price of rule 332's out-of-stamina rule; TUNING's to weigh.
The first measure of this round (this turn only, before the next-turn term, their old brain, before the rebase onto main's new
boards) read 89 won of 120 (old 80), 171 down (208), the same direction.

## GATES RUN (the ones this change touches)

Green: auto_plays_the_best_turn (new, 7/7); weapon_shapes 9/9; see_every_hit 10/10 (the phone legs on the real page); auto_plays_smart
7/7 (shooters held for their breath 70, chose another option 7, none for no reason); auto_kills_one_at_a_time 7/7 (F1 the named man
64%; F7 won 30 clean 24 of 40 against 31 and 24; F2, a WATCH with TUNING's draft bar, 1.70 hurt-but-standing a round, the old 1.21);
every_man_has_a_job_each_turn 5/5; auto_never_wastes_a_turn 9/9 (G3 0.05% with no reason; rested for his breath 126, a better
action 30; G8 77 of 100 won, the old brain 71); climb_or_attack 6/6 (C5: 0 climbs past a shot that the score did not choose);
the_whip_reaches_two_tiles 13/13; the_cell_vest 10/10 (V10: 2 squeezes by AUTO, both inside the rule; fights 0.5 minutes);
the_pc_playtest_the_fight 27/27.
Red, the same as on main before this round (not this change): the_fight_reads_only_sourced_numbers 8/10 (the 11 typed hash
constants, main reads 11 too, and the drawing's '.fat ='); the_pistol_is_never_a_club 6/10 (the whip's 'ours.whip' strings, ARMORY 2,
and the two phone legs 'card no reach' COMBAT 4's record lists red before; its AUTO leg, amended here, is green).
FOUND AND FIXED on the way: a fight never ended when the burning ground (rule 305) or the whip's bleeding (ARMORY 2) put his last man
down as a turn closed (the cell vest gate's fights 2 and 5 ran 6,600 rounds with all of his men down): endTurn and advance now end the
fight the way a blow does (closedOut). The gates above ran before that fix except the three it touches (the cell vest, climb or
attack, auto never wastes a turn), re-run after it.

## WHAT IS LEFT
- EYES on his phone (ask lines 331, 332, 334: NOT YET SEEN). AUTO's choices are not said on the screen yet (u.btLast keeps what it weighed,
  for the probe and the gate; a line over the man saying why he swapped or rested is UI's and WORDS').
- TUNING: every weight in ours.auto_best_turn (next_turn 0.6, kill_rounds 2, kill_on_offer 0.5, kit_next_turn 0.5, reload_next_turn 0.5,
  adrenaline_share 0.25, chase 3 tiles / 2 clubs, rotation_margin 10, end_spend_floor 5). Measured: priced as a quarter of any blow
  next turn, Adrenaline was spent nearly every turn and lost 3 more of 30 robot fights; now it is priced as the kill it buys first and
  AUTO almost never takes it. The pistol from the bag outshoots most clubs at the next tile with this table's numbers, so AUTO swaps to
  it a lot (the swap is the coin working; the pistol's numbers are TUNING's).
- The fight has no gambit list per man; when one comes, 'go for the mechanic' is a gambit he sets, and `best_turn` is the switch.
- The dial does not exist in the fight yet; AUTO uses the plain blow and the sweeps.

[bb] Battle Brothers' AI decides one behaviour at a time, each scored for this turn (its ranged behaviour also weighs the tile it ends on for the next: ours makes that next turn one discounted step) (ai_engage_ranged, ai_engage_melee, the
PotentialDanger list of the men who can reach a tile), swaps to a bag weapon for 4 AP (Quick Hands free), never walks out of a zone of
control for nothing, and its Round Swing hits the six hexes round the man; ours hits the three in front (his ruling) and scores every
action in the hurt it deals against the hurt it walks into.

[analog horror] Nothing new is drawn. The round swing's three tiles light on the same worn receipt paper as every other shape, an arc
in front of the axe, the man behind it untouched; a man of his who rests for his breath stands with the weapon down while the thing in
front of him waits, the way the tape holds a frame too long.

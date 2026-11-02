# COMBAT 3: SEE EVERY HIT, FAIR STAMINA, ZONE OF CONTROL (11/2, BUILD 11/3x)

Paolo 11/2, his playtest (rules 312 to 314; ask lines 305, 306, 307, and 223, 225 under them):
- "when I click the round swing and I have a two-handed [axe], I should see where the other swings will take damage... this is for everything, you need to double check everything"
- "double check how the stamina system is working... when I was fighting the wolves, they had an attack that took stamina away from me... I'm just trying to run my men and I'm out of stamina, then I do the stamina thing and it still didn't work... check out how Battle Brothers does it... I didn't like that"
- "when you're trying to walk through an enemy's melee range of control, if they hit you but it does zero damage, then it's a mess... anything where it says zero damage, that's a mess... they hit me so little it didn't affect me, and I'm still able to move to the tile that I want"

Battle Brothers first (its wiki, records/target/bb/rules.json): a skill's tiles light as it is aimed; "Every character recovers 15 fatigue at the start of his turn"; being struck builds 5 (one- and two-handed maces 10 and 20), a dodge or a block 2; leaving a zone of control draws a free attack from each enemy holding it, and if any hits, the move fails.

## MEASURED BEFORE

The probe (tools/bohemia_combat_see_every_hit_probe_11_2_26.js) plays the live fight headless on AUTO for both sides, 30 fights per kind (companies of 3 and 6, early and middle kit), and logs every change to his men's fatigue and its cause.

| 30 fights each | wolves (direwolves, hyenas) | brigands | heavies (maces) |
|---|---|---|---|
| his turns started winded | 50 of 598 (8%) | 26 of 839 (3%) | 42 of 1,303 (3%) |
| most the other side put on one man in one round | 50 (99th of 100 rounds: 36) | 38 (24) | 50 (29) |
| fatigue from their blows (struck + dodged) | 5,063 | 2,076 | 3,394 |
| held back by a rest and dropped after his next swing ("owed") | 639 | 107 | 391 |
| hits that took 0 health and said -0 | 278 of 1,126 (25%) | 39 of 690 | 339 of 1,008 (34%) |
| a free swing that landed and he walked on anyway | 0 of 9 | 0 | 0 |
| fatigue changes said on the screen | 0 | 0 | 0 |
| rounds a fight / minutes on AUTO | 7.6 / 0.9 | 8.0 / 0.8 | 12.0 / 1.0 |

What it was:
1. **The wolves had no special stamina attack.** Nothing in the bestiary drains breath. It was Battle Brothers' 5 per bite and 2 per dodge, from direwolves at initiative 150 that bite twice a turn, four or five at once on one man: up to 50 in a round against the 15 that come back.
2. **The rest "did not work" because of where the breath came back.** The 15 (30 after a rest) came back at the START OF THE ROUND, for everybody. The wolves act before him, so their bites landed after the rest's 30 and before his turn. To still guarantee a swing after a rest, the fight held a resting man's hits back in a hidden "owed" sum and dropped them on him when his next spending turn closed: the bar jumped up after his swing, unseen, and he was winded again. The rest looked like it did nothing.
3. **Zero.** A blow that armour swallowed whole took 0 health and the tag said -0, a quarter of all hits against wolves and a third against the heavies. The zone-of-control stop itself already held (0 walk-ons in every probe), but the free swing that held him said -0 and nothing on the screen said HELD, so a held man read as a man who was barely touched and could try again.
4. **The round swing lit nothing until he aimed at a man,** and no blow anywhere showed the hurt on each man it would catch.

## WHAT SHIPPED

**1. EVERY ABILITY SHOWS WHERE IT LANDS (rule 312).**
- A blow picked on a man (the strike, a sweep, the shotgun's cone): a hurt tag over every man it will catch, his chance and the health one blow takes (the hit's own sums: FIGHT.preview and hitChance), on the receipt paper the landed number uses.
- A sweep armed and not yet aimed: a ring (Round Swing, Thresh) is the same eight tiles whoever he aims at, so the moment its square is armed the eight tiles light and every man of theirs in them carries his tag. An arc or a line lights every tile one of its aims could reach (dimmer outline), corners every man he can aim at, and its men's tags are faint until he picks one; then the exact tiles and tags.
- A skill with no target (ADRENALINE, RECOVER, INDOMITABLE, RALLY): two taps now. The first lights who it touches in teal and the line says what it does (RECOVER says the breath it gives back); the second tap on its square (or a tap on a lit man) does it; a tap anywhere else puts it away.
- Shapes are foe only (rule 117): a friend standing in one gets dim chalk corners (passed over) and no tag, because nothing lands on him.

**The audit, every skill in the fight's data** (records/target/bb/weapons.json, weapon_shapes.json, the perk skills, the factions' own):

| skill | shape | who presses it | previewed before | previewed after |
|---|---|---|---|---|
| the strike, 35 skills (Slash, Cleave, Bash, Thrust, Stab, Chop, Split Man, Quick Shot, Shoot Bolt, the throws...) and Knock Out, Smite where they are a weapon's first | one man | him (tap a man) | the line: chance and one blow's damage | + a hurt tag over the man |
| Fire Handgonne (the shotgun's blow) | cone: the man and 4 behind | him | tiles lit after he aimed, the line said how many | + a hurt tag over every man in the cone |
| Round Swing, Thresh | ring of 8 | him (sweep square) | nothing until aimed; then tiles, no hurt | lit and tagged the moment the square is armed |
| Swing, Shatter, Reap | arc of 3 | him (sweep square) | after aiming: tiles, no hurt | armed: every reachable tile dim, faint tags; aimed: exact tiles, a tag per man |
| Split | line of 2 | him (sweep square) | after aiming: tiles, no hurt | as the arc |
| ADRENALINE, RECOVER, INDOMITABLE | himself | him (perk square; RECOVER for any winded man) | fired on the first tap, nothing shown | first tap lights him and says what it does; second tap does it |
| RALLY THE TROOPS | his men in range who can be steadied | him | fired on the first tap | first tap lights each man it reaches and says how many |
| ROTATION, TAUNT, FOOTWORK | a friend, one of theirs, a tile | him | targets lit teal on arm | unchanged (already shown) |
| Reload, Reload Handgonne, the bag swap | nobody | him | nothing to land | nothing to land |
| the walk | the path | him | path, free swings counted | + every free-swing tile ringed in rust, the line says one that lands holds him there |
| shieldwall, hook, Line Breaker + the crash-bar, Horrific Scream, Raise Undead, Throw Net | theirs | the brains only | n/a | what they take off his men's breath is said over him (HOOK, SHOVE, BASH) |
| 21 weapon skills with no button in the fight (Aimed Shot, Deathblow, Decapitate, Demolish Armor, Destroy Armor, Disarm, Gash, Hail, Hook, Ignite, Knock Over, Lash, Lunge, Perforate, Puncture, Repel, Riposte, Skewer, Spearwall, Split Shield, Strike Down) | | nobody yet | n/a | n/a: not in the fight |

**2. STAMINA FAIR AND SEEN (rule 313).**
- The breath comes back at the START OF HIS TURN (Battle Brothers' own words), once a round, after whatever their blows put on him. A rest (END TURN with no AP spent) still brings 30. So after a rest he always opens his turn at least 30 under his most, and every strike skill costs 30 or less: the swing after a rest is guaranteed without hiding anything.
- The hidden "owed" sum is gone. What their blows put on him lands the moment it is done.
- Every bit the other side takes off his men's breath is said over the man as it lands: the breath glyph, how much and why, on the breath tag's plate turned rust (-5 HIT, -5 BITE, -2 DODGE, -2 BLOCK, -10 MACE, HOOK, SHOVE, BASH). The recap keeps the words.
- **A pack can never lock him out**: Battle Brothers' numbers per blow stay (5, 2, 10, 20, a hook's or a shove's page), but what the other side puts on one man between two of his turns stops at 10 (`ours.fatigue_from_them_between_turns`, PROPOSED, TUNING's to tune), two struck blows, under the 15 that come back. Standing among wolves his breath still comes back; only his own swings spend it, and his kit sets how many he gets (a man in the heaviest kit has a pool of 13 and a 10-breath thrust: one swing a turn, every turn, never zero).

**3. ZONE OF CONTROL MATTERS, NO HIT IS ZERO (rule 314).**
- A blow that lands takes at least 1 health (`ours.hit_floor_hp`, the 9/22 law: "a hit... costs ONE"), in the hit, in every preview, in the brains' sums. A miss or a full block stays a miss and shows the dodge or block mark, never -0.
- A free swing that lands holds him on his tile (it always did): now HELD goes over him on a strip of hazard tape, the line says "THUG's free swing lands. DEUCE is held here.", and the blow's number is at least -1.
- Before the walk: the zone is the rust hatch (already), and the walk's line now says "1 free swing on the way: if it lands, he is held there." with the tile of every free swing ringed in rust on the path.
- Found on the way: the preview's "blows to drop him" ignored that Battle Forged weakens as the armour wears; with no blow at 0 it said 21 where the real blows took 20. The count now wears his armour blow by blow as the real blows do.

## MEASURED AFTER (the same probe, the same 30 fights per kind)

| 30 fights each | wolves | brigands | heavies |
|---|---|---|---|
| his turns started winded | **0 of 585** (was 50 of 598) | **0 of 807** (26) | **2 of 1,250** (42) |
| most the other side put on one man between two of his turns | **10** (was 50 in a round) | **10** (38) | **10** (50) |
| "owed" breath dropped on him unseen | **0** (639) | **0** (107) | **0** (391) |
| hits that took 0 health | **0 of 1,098** (278 of 1,126) | **0 of 673** (39) | **0 of 1,001** (339) |
| a free swing that landed and he walked on | 0 of 6 | 0 | 0 of 1 |
| breath changes said over the man | **733** | 393 | 412 |
| rounds a fight / minutes on AUTO | 7.3 / 0.9 | 7.5 / 0.8 | 11.5 / 1.0 |
| won | 10 of 30 (was 9) | 27 (28) | 26 (25) |

Fight length is unchanged on AUTO (the bench's own sum: 2 beats a turn that acts, half a beat one that passes; rounds a fight within half a round either way). By hand was not timed this round.

**The pictures (his phone, 390 x 844, the real page, real taps)**, records/combat_see_every_hit_11_2/:
- round_swing_armed_before.png / _after.png: the greataxe's ROUND SWING square armed, nobody aimed at yet. Before: nothing but the zone hatch. After: the eight tiles lit with a rust edge, 42% -29, 27% -49, 27% -79 over the three of theirs, nothing over his own man in the ring.
- round_swing_aimed_before.png / _after.png: one of them tapped.
- zone_walk_warned_before.png / _after.png: the walk out of a thug's reach. Before: "1 free swing on the way." After: "1 free swing on the way: if it lands, he is held there." and the tile ringed.
- zone_stop_before.png / _after.png: the free swing lands. Before: his health still 999/999 (the blow took 0), nothing said. After: HELD and -10 MACE over him, 998/999, and the line names who held him.

The gate: gates/see_every_hit_gate.js, 10 legs (the audit; no hit is zero in 30 rolled fights, 1,100 hits; the cap and every bit said, 1,186 breath events, 0 over, 0 unsaid; zone of control 19 landed and held, 21 missed and walked; the five phone legs). The old file served under it fails all five phone legs (`--before`). fatigue_comes_back_every_turn_gate.js F2 amended to the new rule (8/8). Also green: weapon_shapes, the_fight_says_what_is_weak, a_far_tile_walks_as_far_as_he_can, walk_through_your_own_men, icons_not_numbers_in_the_fight, auto_kills_one_at_a_time.

## WHAT IS LEFT
- EYES to see all three on a real phone (ask lines 305 to 307, 223, 225: NOT YET SEEN).
- TUNING owns the two new numbers (`hit_floor_hp` 1, `fatigue_from_them_between_turns` 10, drafts with their reasons in ours.json).
- Rule 319 (A WEAPON THAT HITS FROM TWO TILES) landed on main this round: when a pole reaches two tiles, its blow is a strike and gets the same tag (the tag reads canStrike's man), but its own phone leg is owed.
- The 21 weapon skills with no button in the fight (Spearwall, Riposte, Decapitate...) preview nothing because they are not in the fight; each that gets a button gets its preview the same way.
- TUNING's research tool bohemia_tuning_stupid_move_watch.js has an 'owedoff' splice on the old tire(); that variant now throws THE FIGHT MOVED (research only, not a gate).
- By-hand fight minutes on the phone were not measured this round (the bench is AUTO).

[bb] Battle Brothers lights every tile a skill will hit as it is aimed; "every character recovers 15 fatigue at the start of his turn"; struck 5 (maces 10 and 20), dodged or blocked 2; a zone-of-control free attack that hits cancels the move. Ours keeps every one of those, and adds the cap of 10 between two of his turns because our fights are a tenth as long.

[analog horror] The breath they take is the blue breath tag's plate turned rust, with a red misprint edge like a badly registered receipt; HELD is a strip of hazard tape, crooked; the hurt tags are the same torn receipt paper the landed number is printed on. Nothing clean, nothing glowing.

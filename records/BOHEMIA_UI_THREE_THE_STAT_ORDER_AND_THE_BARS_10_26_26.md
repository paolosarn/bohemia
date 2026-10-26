# UI THREE 10/26: HIS EIGHT IN HIS ORDER, EACH A BAR TO THE MOST POSSIBLE, EVERY CHANGE AN ARROW (rules 223, 224, 247)

Rows: [the stat order] (rule 247), [stats are bars and arrows] (rule 223), [icons not numbers, everywhere] (rule 224, round one).
Session ui-three-session_018MTLRcHi. IN THE GAME, NO CARD (rule 127): he meets it on the crew screen, the level-up, the hall and the
shop. Tabs: the demo and the alpha's RUN tab, through CREW and through a town's hall and armourer.

## HIS WORDS (verbatim)
- 10/26 (rule 247): 'the order I want to display the stats: HP, fatigue, ranged attack, melee attack, ranged defence, melee defence,
  morale and initiative, across the board, because I'm trying to scan the stars quickly... HP first just feels right... I wanna see,
  behind the numbers, like a progress bar, how far it is from the maximum that's even possible... remember, I asked that.'
- 10/26 (rule 223): 'the maximum possible point distribution... where that number is on that bar visually, with an opacity behind the
  number... in the store when I'm upgrading weapons and armor and seeing who it fits best, it's just a bunch of ugly numbers and I hate
  that... the trait and its logo and an up green icon or a down red icon plus the number; I don't even want to see it would go from 63
  to 68... we gotta have awesome UI.'
- 10/26 (rule 224): 'I'm tired of it just being numbers numbers numbers... more icons, more green up arrow, down red arrow, and the
  only number that matters is by how much.'

## MEASURED BEFORE (main 49a01f99)
- Every screen showed the eight in Battle Brothers' order (hp, fatigue, resolve, initiative, melee skill, ranged skill, melee defence,
  ranged defence): engine/bohemia_roster.js STATS, the crew screen's 4 x 2 grid, the level-up's 4 x 2 grid, the hall's
  BohemiaGoodBros.STAT_KEYS spans in an auto-fill grid (two columns on his phone, four on a computer).
- No bar anywhere; a number and, on the crew screen, the gear's part printed beside it ('22 +15', '79 -16').
- The shop's ON A MAN lines printed '7 to 22' and '+15' (the exact 'X to Y' he named).
- The hall's trait printed '-5 RES' in words and a bare triangle on the stat.
- The numerals on screen (tools/bohemia_ui_three_numeral_count.js --at 49a01f99, phone and computer the same): crew screen 37,
  the level-up 42, the hall's first card 16, the shop's ON A MAN 12.

## WHAT IS BUILT
1. ONE ENGINE LIST, engine/bohemia_stats.js (window.BohemiaStats): ORDER = HP, FATIGUE, RANGED SKILL, MELEE SKILL, RANGED DEFENCE,
   MELEE DEFENCE, RESOLVE, INITIATIVE. Every screen that shows the eight lays its rows from it. THE DICE'S ORDER IS KEPT
   (bohemia_roster.js and bohemia_origin_start.js STATS stay Battle Brothers'): a seeded man is rolled stat by stat in that order, so
   changing it would re-roll every saved man; the list is what is DISPLAYED (the brief's own instruction).
2. THE MOST POSSIBLE, ONE NUMBER A STAT, TUNING'S (the one table's section Q, records/BOHEMIA_TUNING_THE_BARS_MAXIMA_10_26_26.md,
   which landed during this round): the best background's top roll + the best flat trait a man can roll at the post + ten levels at
   the 3-star column's best roll: HP 133, FATIGUE 183, RANGED SKILL 109, MELEE SKILL 122, RANGED DEFENCE 68, MELEE DEFENCE 65,
   RESOLVE 120, INITIATIVE 195. Worked from the game's own three files (backgrounds.json, traits.json at_the_post, rules.json) by
   compute(); written to records/target/bb/stat_max.json by tools/bohemia_ui_three_stat_max.js (a modder's file; --check holds it to
   the formula). The formula reproduces TUNING's hand-worked eight exactly. Past the end (a veteran, a shield, Colossus) the bar is
   full: TUNING's clip rule.
3. THE TICK, his own ceiling [COORDINATOR'S DEFAULT, rule 205, his to kill]: his number now + the levels left to 11 x the MIDDLE of
   his star column (TUNING's bar.tick.own_ceiling, the same middle RUN THREE's hall ceiling uses); past 11 his number. Two men with
   the same number read apart by their stars.
4. THE COMPONENT (the DOM half of the same file): row(k) is the stat's icon (UI's 24-point icons, rule 189), his stars in their own
   column beside it (the kit's drawn star), the bar filled to his number over the most possible in a translucent tint of the stat's own
   colour with the number on it, the faint tick; change(d) is a green up or red down arrow (a 7 x 7 pixel arrow with a bone edge,
   the kit's star's own construction) and the amount; a change lights its part of the bar (green, or red hatched for what is lost);
   mark(k, d) is the icon, the arrow and the amount inline in a line of words. Built of i and b elements only, so a screen that counts
   its own spans keeps its count; the stat's word is kept for a screen reader, never shown.
5. THE CREW SCREEN (UI's file, two marked __UI_THREE_STATS__ blocks): his eight as ONE column of bars on the receipt, so his stars scan
   straight down; the number is WITH what he wears (rule 202(c), his: 'when you wear the shield it reflects in your stats'), the gear's
   part said on a tap, no longer printed. A level just taken is the green arrow and the amount, its rise lit. A stash piece compared
   (one tap on the phone, the mouse over it on a computer) shows on his bars: every stat it moves an arrow and the amount
   (bohemia_roster.js wearing(), the shop's and the fight's one source), its part lit.
6. THE LEVEL-UP (the same file): the eight picks in his order, one column on glass, each the bar and the roll as a green arrow; a pick
   lights its rise on the bar. RAISE THEM stands beside the column (a tall amber tag) so the moment is the same height as before:
   one column of eight at 44 points a row would have pushed the stash 115 points off his phone, and the stranger's path (rule 172(d))
   must stay on one screen. Measured: the screen is 1.00 screens tall on the phone and the computer, open and with BOOKIE's level up.
7. THE HALL (RUN THREE's code, a marked block over hireCard, nothing of theirs rewritten): each card's eight spans keep their data-stat,
   their star / up / down classes and their text ('HP 57', a hidden word), laid in his order, one column, each the bar with the tick
   at THIS man's ceiling (his trait on the number, his level and stars on the tick). His trait's numbers ('-5 RES') are now the stat's
   icon, the arrow and the amount, said once there; the bar lights the part the trait took.
8. THE SHOP'S ON A MAN (RUN TWO's code, a marked block over onMan): the 'X to Y' words are gone; each line of the eight is the row
   (icon, his stars, the bar at the new number with the moved part lit, the arrow and the amount), in his order; armour and damage keep
   their word with the arrow and the amount. Every data-before / data-after / data-delta and the .d's up / dn are kept for RUN TWO's gate.

## THE NUMERALS AFTER (row [icons not numbers, everywhere], round one; phone and computer the same)
crew screen 37 -> 33; the level-up 42 -> 42; the hall's first card 16 -> 16; the shop's ON A MAN 12 -> 8.
The hall holds 16: its numbers are the man's own eight, the ceiling, the price and the gun's reach, all kept by rule 224(b) for now;
the trait's '-5 RES' lost its word (the icon says RES) and kept its amount once, and the bar lights the part the trait took. The level-up keeps
42: each roll is now an arrow and an amount instead of '+3' beside the number, the same count. The other main screens (map, town, fight,
phone, end screen, meet card, job card) are NOT COUNTED YET: the row stays CLAIMED, round two counts them with the same tool's shape.

## THE GATE
gates/stats_are_bars_in_his_order_gate.js (in the suite as STATS ARE BARS IN HIS ORDER, with --plant): 30 passed, 0 failed.
S1 the one list, the dice's order untouched; S2 TUNING's eight = the formula = the file = the engine; S3 both screens read the list;
S4 TUNING's six worked ticks (records/BOHEMIA_TUNING_STRUCK_DOWN_HE_STILL_FIGHTS_THE_DEBUFF_AND_THE_CLINIC_10_26_26.md s6) exact;
phone (390 x 844, touch) and computer (1440 x 900, mouse), real taps: C1 to C7 the crew screen (order, one star column with his own
stars, every fill his number over the most possible within a pixel and translucent, the tick at his ceiling within a pixel, the
level-up's arrows and a pick's lit rise, a stash piece compared, and NOTHING MOVES when it shows, rule 250), H1 H2 the hall (order,
column, fill, tick, the trait's part lit and its line the icon, the arrow and the amount, no X to Y), P1 the shop (order, arrows and
amounts as wearing() says, fill and lit part, no X to Y on the card), E nothing thrown. Five planted defects each caught: the order
swapped (C1, C5, H1), the fill off the maximum (C3, H2), the tick at the top roll instead of the middle (C4, H2), the change column let
grow so the bars move (C7), the shop's X to Y put back (P1).
PRE-PUSH PASS (rule 13(a), the gates that read my files), on the tree rebased onto main: STATS ARE BARS IN HIS ORDER 30/0, THE STARS SIT
WITH THE WORDS 8/0, THE ROSTER AND THE POSTS LOOK 28/0, ROSTER SCREEN 15/0, CLIMBING 17/0, THE COMPANY SCREEN BATTLE BROTHERS SIMPLE
48/0, THE TRAIT BEFORE YOU HIRE 12/0, THE HIRE SHOWS THE WHOLE MAN 10/0, THE SHOP SAYS WHAT IT DOES 10/0, THE STAT ICONS 5/0, THE BEST
RECRUIT AT THE TOP 12/0, EVERY ORIGIN STARTS LIKE ITSELF 14/0, SETTLEMENT SCREEN 74/0, THE CREW FIGURE HOLDS HIS GUN 6/0, THE RARE MAN AT
THE POST 10/0, HANDOFF 10/0, the demo cut --check exact. RED AND NOT MINE (the same on main, naming other files): ENGINE CENSUS 9/1
(camp, renown, spoils, wages unread), BANNER 11/3 (ground, kept, origins hidden), PAGES PUBLISH 16/2 (handoffs, skills, tickets not
copied; the size), THE UI BELONGS TO THE WORLD 35/1 (the fight's AUTO button on tin, 3.13 in the sun: the fight file, untouched).
Full suite unmeasured (rule 13(b)).
DESIGN FIXES THE GATES FORCED, NAMED: (1) the numbers on the bare tint measured 3.3 to 1 in the sun (rule 73); each number now sits
on a see-through tag of the paper (0.7) the fill shows through and runs past, 5.0 or better in the sun on every stat, 5.8 on glass;
(2) rule 250 (newer than my first cut): the change column is always held so a comparison never moves a bar; (3) rule 114's tell: the
red 'lost' hatch is a drawn 4-pixel tile, not a CSS gradient.
RE-AIMED, not weakened: RUN TWO's THE STARS SIT WITH THE WORDS S2 and S3 measured stars on a number's baseline; rule 247(c) (newer)
puts them in their own column beside the icon, so a column star is held centred on its row within a point and a point after the
icon's column; S1 and S4 untouched; 8/0.

## DECIDED, AND WHY (no question to anyone)
- The number on the crew screen is with what he wears (TUNING's page suggests the bar show his OWN number and the gear as an arrow).
  His 10/25 words (rule 202(c)) make the crew screen's number the shop's and the fight's; a permanent red arrow on every armoured man's
  fatigue would add numbers rule 224 wants gone. The gear's part is one tap away (the said line). A stash piece being COMPARED is the
  arrow and the lit part, as both rules ask.
- One column on every screen, the level-up included, by moving RAISE THEM beside the column rather than splitting the eight in two.
- Stars are drawn by the kit (BohemiaMaterials' star, ink on paper, gold on glass): one star everywhere (rule 146(e)).
- The fight's card is NOT touched (the COMBAT emergency): a NOTE on COMBAT's board carries the call.
- The origin door and the loot show no man's eight today (measured: no stat display in BOHEMIA_ALPHA_0_9.html or
  BOHEMIA_SPOILS_SCREEN.html); NOTEs to RUN and RUN FOUR carry the call for when they do.

## OWED (rows stay CLAIMED until these land)
- [the stat order] and [stats are bars and arrows]: THE FIGHT'S CARD (slices/BOHEMIA_FIGHT.html drawer(), COMBAT's, after the
  emergency); EYES sees it (lines 145, 172).
- [icons not numbers, everywhere]: the before and after on the seven screens not counted yet; the shop's item numbers (.inums chips)
  as icons with [the weapon card] (rule 251(b)); a lone number a picture first, screen by screen.
- [the item box] (rule 249(d)), [the weapon card] (251(b)), [an icon for every perk] (252): not started; next in that order.

## ROUTED (NOTEs on the boards)
RUN TWO (the shop: the block over onMan, the calls for 249/251), RUN THREE (the hall: the block over hireCard, the trait line), RUN FOUR
(the loot's 'who it fits': the calls), RUN (the door: the call when an origin's men show), COMBAT (the fight's card: the calls, after the
emergency), TUNING (section Q is live in stat_max.json; the one difference named), UI (the crew screen's two blocks).

[bb Battle Brothers' character screen draws every attribute as a bar with its number on it and its stars beside it; comparing gear
moves the bar; ours is his order and the most a man can ever reach.]
[analog horror: the stats print on the same thermal receipt as everything else in the valley, the bars in the faded inks of a
machine that still keeps count of people.]

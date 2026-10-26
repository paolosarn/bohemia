UI THREE (ui-three-stats): the stat component, session ui-three-session_018MTLRcHi -- 10/26 LATEST (round two) -- [the stat order] and
[stats are bars and arrows] SHIPPED, BUILT, NOT YET SEEN (rule 179): the fight's card is in, the last screen with stats; [a damage icon]
SHIPPED, BUILT, NOT YET SEEN (rule 275(b)). Record records/BOHEMIA_UI_THREE_THE_FIGHTS_CARD_AND_A_DAMAGE_ICON_10_26_26.md.
- THE FIGHT'S CARD: a block over COMBAT's drawer() in slices/BOHEMIA_FIGHT.html (fightBars, fightStars): his eight in his order, what he
  has now on the bar, the wound and the spent fatigue hatched, his stars from bohemia.company.v1 by name, the shield in his defences
  (shieldDef's own sum), the tick. FATIGUE READS WHAT IS LEFT (Battle Brothers counts it up).
- THE DAMAGE ICON: slices/stat_icons/damage.png (tools/bohemia_ui_three_damage_icon.py, UI's renderer imported, --check runs UI's
  look-alike measure over the nine): the shop's DAMAGE chip (a block over itemNums), the ON A MAN damage line, the stash's weapon
  numbers (b[data-dmg]), 'dmg' in the said line, the fight's weapon card (the kit's STAT_WORDS, one entry).
- GATE: STATS ARE BARS IN HIS ORDER 41/0 with seven plants (D, C8, P2, F1, F2 new). UI's THE STAT ICONS I4 re-aimed to the card's
  eight rows (5/0).
NEXT: [icons not numbers] round two (count the seven screens), then [the item box] (249(d)), [the weapon card] (251(b)), [an icon for
every perk] (252).
[bb Battle Brothers puts a small picture beside a weapon's damage on its tooltip; ours is the wound itself.]
[analog horror: a hole and what came out of it, printed small on the receipt beside the number, the way a ledger keeps it.]

ROUND ONE (10/26, 01ddcb92):
[the stat order] and [stats are bars and arrows]
ROUND ONE SHIPPED, BUILT, NOT YET SEEN (rule 179); [icons not numbers, everywhere] round one (the count's shape and four screens).
Record records/BOHEMIA_UI_THREE_THE_STAT_ORDER_AND_THE_BARS_10_26_26.md.

WHAT IS LIVE (the demo: CREW, and any town's hall and armourer):
- ONE LIST: engine/bohemia_stats.js BohemiaStats.ORDER = HP, FATIGUE, RANGED SKILL, MELEE SKILL, RANGED DEFENCE, MELEE DEFENCE,
  RESOLVE, INITIATIVE. Display only: the dice's order (bohemia_roster.js / bohemia_origin_start.js STATS) is Battle Brothers' and
  must stay, or every saved man re-rolls.
- THE MOST POSSIBLE: TUNING's section Q, worked by compute() from backgrounds.json + traits.json (at_the_post) + rules.json:
  133 / 183 / 109 / 122 / 68 / 65 / 120 / 195 in his order; records/target/bb/stat_max.json (tools/bohemia_ui_three_stat_max.js,
  --check). THE TICK: his number + levels left to 11 x the middle of his star column (TUNING's bar.tick.own_ceiling).
- THE COMPONENT: BohemiaStats.row(k, {n, stars, ceil, from, delta, arrow, icon:'span'|'i'|'none', into, glass, label}),
  .block(man, {shown, from}), .change(d), .mark(k, d, {say}), .ceilingOf(man, k, shown), .fill(k, n), .load(base). i and b only.
- THE CREW SCREEN (two __UI_THREE_STATS__ blocks in slices/BOHEMIA_ROSTER_SCREEN.html): one column of bars on the receipt, the
  number with what he wears, a level just taken and a stash piece compared as arrows with the part lit (statsPreview, statRow,
  paintStats); THE LEVEL-UP one column on glass, RAISE THEM beside it (the screen 1.00 tall on both, measured).
- THE HALL (block over hireCard, hallBars) and THE SHOP'S ON A MAN (block over onMan, shopArrows) in
  slices/BOHEMIA_SETTLEMENT_SCREEN.html: his order, bars, ticks, arrows; the trait line '-5 RES' as the icon, the arrow and 5.

GATES: STATS ARE BARS IN HIS ORDER 30/0 with --plant (new, in the suite; five planted defects caught; NOTHING MOVES, rule 250). Re-aimed for rule 247(c):
THE STARS SIT WITH THE WORDS S2/S3 (a column star centred on its row) 8/0. Green, read my files: ROSTER SCREEN 15/0, CLIMBING 17/0,
THE SHOP SAYS WHAT IT DOES 10/0, THE STAT ICONS 5/0, THE HIRE SHOWS THE WHOLE MAN 10/0, THE TRAIT BEFORE YOU HIRE 12/0; THE ROSTER AND THE POSTS LOOK 28/0 (re-aimed: a
stat's words read on the number's own tag), the rest of the pre-push list in the record. Full suite unmeasured (rule 13).

NUMERALS (tools/bohemia_ui_three_numeral_count.js, before = --at 49a01f99): crew 37 -> 33, level-up 42 -> 42, hall card 16 -> 16,
shop ON A MAN 12 -> 8, phone and computer alike.

NEXT for this lane, in order: (1) the fight's card when COMBAT's emergency closes (COMBAT's file: a NOTE carries the calls; then
EYES lines 145, 172 and the two rows SHIPPED); (2) [icons not numbers] round two: count the seven screens not counted (map, town,
fight, phone, end screen, meet card, job card) with the counter's shape, then a lone number a picture screen by screen, starting with
the shop's item chips (.inums) together with [the weapon card] (251(b)); (3) [the item box] (249(d)); (4) [an icon for every perk] (252).
FOR OTHER LANES: a screen that shows a man's eight loads ../engine/bohemia_stats.js and calls BohemiaStats.row/block; a change is
BohemiaStats.change(d); never print 'X to Y'. My gate's S3 lists the screens it holds; a new one joins it when it shows a stat.
[bb Battle Brothers draws every attribute as a bar with the number on it and the stars beside it; ours runs in his order to the most
a man can ever reach.]
[analog horror: the eight print on the valley's thermal receipt in faded inks, a machine still keeping count of the people it serves.]

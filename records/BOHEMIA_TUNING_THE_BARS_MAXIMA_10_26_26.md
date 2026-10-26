# TUNING 10/26: THE BARS' MAXIMA, ONE MAXIMUM PER STAT (rule 223(c); research only; for UI)

Paolo 10/26 (rule 223): "even Battle Brothers displays the stats everywhere... the maximum possible point distribution... where that
number is on that bar visually, with an opacity behind the number." 223(c): "One maximum per stat from the game's own numbers (base
plus ten best rolls with three stars; TUNING checks), the same on every screen." The rows are the one table's section Q.

## 1. HOW THE MAXIMUM IS BUILT (every part from the game's own files)
MAX = the highest base roll any background can have (records/target/bb/backgrounds.json, the wiki's attribute ranges, all 77; the
roster names the top ones in our words, the road knight and the blade master, engine/bohemia_roster.js) + the best rollable trait for that stat (traits.json; the cult's marks and
Impatient's +1000 first-round initiative left out) + ten level-ups (levels 2 to 11) at the top of the three-star roll
(rules.json stat_gains_by_stars: hitpoints, fatigue, resolve, ranged skill and ranged defence 4-5, initiative 5-6, melee skill and
melee defence 3-4).

| stat | highest base (who) | + trait | + ten levels | MAXIMUM | a fresh recruit | level 11, raised every level (no star / three stars) |
|---|---|---|---|---|---|---|
| hitpoints | 73 (hedge knight) | +10 (Tough, Fat) | +50 | 133 | 41% | 64% / 75% |
| fatigue | 123 (wildman) | +10 (Strong) | +50 | 183 | 52% | 69% / 77% |
| resolve | 60 (adventurous noble, crusader, orc slayer) | +10 (Fearless, Old, a hatred) | +50 | 120 | 33% | 58% / 71% |
| initiative | 125 (assassins, ratcatcher) | +10 (Quick) | +60 | 195 | 54% | 74% / 82% |
| melee skill | 77 (swordmaster) | +5 (Dexterous) | +40 | 122 | 44% | 61% / 73% |
| ranged skill | 59 (hunter) | none | +50 | 109 | 34% | 61% / 75% |
| melee defence | 20 (swordmaster) | +5 (Sure Footing, Paranoid, Tiny) | +40 | 65 | 4% | 35% / 58% |
| ranged defence | 13 (six backgrounds) | +5 (Swift, Paranoid, Tiny) | +50 | 68 | 4% | 48% / 70% |
('a fresh recruit' is the median background's middle roll; 'level 11' raises that stat every level, the no-star and three-star means.)
Without the trait the maxima are 123, 173, 110, 185, 117, 109, 60, 63: then a level-11 man with the top roll and the trait would
overflow, so the trait is in.

## 2. WHAT THE BAR SHOWS, AND WHAT GOES PAST IT
The bar shows the man's OWN number (his rolls, his levels, his trait). Gear and perks are the arrows of 223(b): a shield's +15
melee defence is the lit part and a green arrow with 15, and the light stops at the bar's end. Past the maximum, clipped: a veteran
(levels 12 to 33, +1 on four stats a level) by up to 22; Colossus x1.25 hitpoints (166); Fortified Mind x1.25 resolve (150); the best
shield +24 defence (+30 with Shield Expert); Dodge, 15 percent of initiative to both defences. Armour keeps each piece's own
durability as its whole (armor.json); the HEAL bar (226(c)) sums them.

## 3. WHAT PROVES US WRONG
The defence bars are the ones that move: a fresh man fills 4 percent of his melee and ranged defence and a killer at level 11 fills
half to two thirds, while his hitpoints only climb from 41 to 75. A lower maximum (a typical
level-11 man's) would overflow on every big man; the trait-and-three-star maximum never overflows on a man's own numbers, and leaves
the min-maxer something to fill.

## ROUTED
- UI: NOTE [the bars' maxima] on UI's board: the eight maxima, the clip rule, the armour bar's whole.
- RUN TWO and RUN THREE (the crew screen, the hall, the shop): the same eight, one source (the one table section Q until a data
  file carries them; a mod-friendly home would be records/target/bb/ours.json beside the level-up rows).

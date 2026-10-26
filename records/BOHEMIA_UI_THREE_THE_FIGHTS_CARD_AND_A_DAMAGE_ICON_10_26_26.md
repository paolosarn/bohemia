# UI THREE 10/26, ROUND TWO: THE FIGHT'S CARD IN HIS ORDER, AND A DAMAGE ICON (rules 247, 223, 275(b))

Rows: [the stat order] and [stats are bars and arrows] (the owed part: the fight's card), [a damage icon] (rule 275(b), added by
the coordinator with [the weapon card]). Session ui-three-session_018MTLRcHi. IN THE GAME, NO CARD (rule 127). Round one:
records/BOHEMIA_UI_THREE_THE_STAT_ORDER_AND_THE_BARS_10_26_26.md.

## HIS WORDS (verbatim)
- 10/26 (rule 275(b)): 'damage doesn't have its own icon, you should make that too, in the shop and everywhere.'
- 10/26 (rule 247): 'the order I want to display the stats: HP, fatigue, ranged attack, melee attack, ranged defence, melee defence,
  morale and initiative, across the board.'

## MEASURED BEFORE (main dc57b92c)
- The fight's card (slices/BOHEMIA_FIGHT.html drawer(), COMBAT's) printed six word rows in Battle Brothers' order: 'Health 51 / 63',
  'Fatigue 20 / 75', 'Melee skill / defence 57 / 2', 'Ranged skill / defence 34 / 4', 'Initiative 97', 'Resolve 44'. Its defences
  left out the shield in his hand (2 and 4) while the crew screen showed them with it (17 and 19): two screens disagreeing, against
  rule 202(c).
- Damage had no picture anywhere: the shop's 'DAMAGE 30-50' chip, its ON A MAN 'DAMAGE' line, the weapon numbers on the stash's
  tiles (bare '30-50'), 'dmg 30-50' in the crew screen's said line, and the fight's weapon card 'Damage 30 to 45'.
- The COMBAT emergency is closed (COMBAT's NOTE on CAMP's board: 'LANDED'), so the fight's file takes a marked block again.

## WHAT IS BUILT
1. THE DAMAGE ICON, slices/stat_icons/damage.png: a bullet hole and the blood flung out of it, most of the spray where the round went
   on, dark and wet. Drawn by UI's own renderer (tools/bohemia_ui_stat_icons.py render(): a solid lit by the kit's one sun, ink
   outline, hard shadow), through tools/bohemia_ui_three_damage_icon.py, which imports it and adds the ninth without touching UI's
   tool or its eight files. The only spiky one of the nine; old-blood red, not the heart's enamel. UI's own look-alike measure
   (gates/the_stat_icons_read_at_a_glance_gate.py measure(), run over the nine) finds no pair alike at 72, 54 or 18 px and no glance
   mistaken; the nearest pair of the nine is still hp ~ melee defence (0.689 outline, colours 50 apart), not damage.
   Sheet: records/target/UI_THREE_THE_DAMAGE_ICON_10_26_26.png (the nine at 1:1 and 3x).
2. DAMAGE WEARS IT EVERYWHERE IT SHOWS: the shop's DAMAGE chip (a block over RUN TWO's itemNums); the shop's ON A MAN damage line
   (the icon, the word kept for a screen reader, the arrow and the amount); every weapon's number on the stash's tiles (14 points);
   'dmg' in the crew screen's said line (the icon, the word for a screen reader); the fight's weapon card Damage row (one entry in the
   kit's STAT_WORDS, which already lays the stat icons on that card). The level-up shows no damage (measured: the eight and the perk
   names), so there is nothing to mark there.
3. THE FIGHT'S CARD, a UI THREE block over COMBAT's drawer() (a wrapper; nothing of COMBAT's rewritten; ../engine/bohemia_stats.js
   added to the fight's scripts): his eight in HIS order as the one stat row in place of the six word rows: what he has NOW on the bar,
   what this fight has taken hatched (the wound between his hitpoints and his whole; the fatigue spent between what is left and his
   whole), his stars (the crew screen's own, read by name from the company the crew screen keeps), the tick at his ceiling. The shield
   in his hand counts in his defences the way the fight's own shieldDef counts it (the Shield Expert's number from perks.json), so
   the card and the crew screen say the same number (rule 202(c)). Armour, nerve, rounds, loaded, hurt and the perks stay COMBAT's rows.
   Fatigue reads what he has LEFT (Battle Brothers counts it up); one row, one way: the hatched part is what he spent.
4. A comparison on his slot on the crew screen ('+80' on the body when a plate carrier is tapped) now carries the arrow too.

## THE GATE
gates/stats_are_bars_in_his_order_gate.js (STATS ARE BARS IN HIS ORDER, in the suite with --plant): 41 passed, 0 failed.
New: D (the damage icon is the renderer's, byte for byte, no pair of the nine alike), S3 now holds the fight's file too, C8 (the stash's
weapon numbers and the said line wear the icon, no 'dmg' word shown), P2 (the smith's weapon card: the DAMAGE chip and the ON A MAN
damage line wear it, the line an arrow and the amount), F1 (the fight's card: his eight in his order, his stars in one column, what he
has now on the bar, the wound and the spent fatigue hatched, the shield in his defences, the tick, all within a pixel; the six old word
rows gone), F2 (the fight's weapon card Damage row wears the icon); phone and computer. Seven planted defects each caught: the order
swapped, the fill off the maximum, the tick at the top roll, the change column let grow, the fight's card left in Battle Brothers'
words (F1), the damage icon taken off the shop and the fight's weapon card (P2, F2), the shop's X to Y put back.
RE-AIMED: UI's THE STAT ICONS I4 read the fight card's six word rows; it now reads the eight rows, each its own icon in his order (5/0).
PRE-PUSH PASS (rule 13(a)), on the tree rebased onto main: STATS ARE BARS IN HIS ORDER 41/0 (with plants), THE STAT ICONS 5/0, THE
COMPANY SCREEN BATTLE BROTHERS SIMPLE 48/0, THE ROSTER AND THE POSTS LOOK 28/0, ROSTER SCREEN 15/0, THE STARS SIT WITH THE WORDS 8/0,
ONE TAP TO SEE ONE TAP TO DO 16/0, THE FIGHT READS ONLY SOURCED NUMBERS 10/0, THE FIGHT BAR IS STUDIO MADE 15/0, THE LITTLE THINGS IN
THE FIGHT 7/0, THE FIGHT'S BARS AND THE END SCREEN 6/0, THE PC PLAYTEST: THE FIGHT 27/0, THE TRAIT BEFORE YOU HIRE 12/0, THE HIRE SHOWS
THE WHOLE MAN 10/0, DEMO BUILD 25/0, HANDOFF 10/0, the demo cut --check exact, the damage icon --check, stat_max --check.
RED AND NOT MINE, MEASURED: THE REBUILT FIGHT PLAYS 151/4: the night frame rate and the night contrast legs fail the same with main's own
fight file swapped in (that run then crashed at 75, so its two 'the board blits the bank's frames' legs were not reached on main; they
measure the board's man sprites, which my card block never draws); THE SHOP SAYS WHAT IT DOES 0/1 'the armourer opens': the same with
main's town, crew and kit files swapped in (the town's arrival card stays up and takes the tap); LANGUAGE 103/1 'the fight loads the
dial and the veteran speaks through it': its pattern is gone from main's fight file (COMBAT's say call changed); THE UI BELONGS TO THE
WORLD 35/1 (the fight's AUTO button on tin, as last round). Full suite unmeasured (rule 13(b)).
ON THE NEWEST MAIN (main moved four times while the gates ran: RUN FOUR's aftermath, COMBAT's retreat and ANIMATION's bow in the fight's file, UI's
camp behind the crew; four rebases, my blocks untouched, the stamp taken from main and moved one letter, now BUILD 10/26zs):
STATS ARE BARS IN HIS ORDER 41/0 with plants after COMBAT's fight change and 34/0 after UI's crew screen change, THE STAT ICONS 5/0,
DEMO BUILD 25/0, HANDOFF 10/0, the cut --check exact, RUN FOUR's THE AFTERMATH 20/0 and MAKE CAMP FROM THE FIGHT 11/0 (each 1 red
only when two browser gates ran at once; alone, green), UI's THE CREW SCREEN SHOWS THEIR CAMP 32/0 (two earlier runs on my tree
went 17/1, the browser closing mid-run, and 31/1, the computer's open time 353 ms against its 352.6 ms ceiling; main's own files
32/0 and my tree's third run 32/0, so the open time is the machine's spread: with and without the camp both carry my bars).

## DECIDED, AND WHY
- The damage icon is a wound, not a weapon: the machete already says melee skill and the rounds say ranged defence; a hole with the
  blood out of it says what damage IS in a gun world, and its spikes keep it apart from the round heart at 18 pixels.
- Its word stays on the shop chip beside the icon (as the defence chips keep theirs) until [the weapon card] (rule 251(b)) turns the
  whole card to icons; on the ON A MAN line the word is hidden, as the eight's are.
- The fight's card shows what he has now and hatches what the fight took, so the wound reads at a glance without a second number.

## OWED
- [icons not numbers, everywhere]: the seven screens not counted; the item chips as pictures with [the weapon card].
- [the item box] (249(d)), [the weapon card] (251(b)), [an icon for every perk] (252), in that order.

## ROUTED
COMBAT (the block over drawer, the fatigue shown as left, the shield in the defences; the weapon card's 'Damage 30 to 45' reads like
'X to Y': a range, said as one, is COMBAT's words), UI (the kit's STAT_WORDS line; the icon gate's I4 re-aimed; the ninth icon beside
your eight, drawn by your renderer), RUN TWO (the DAMAGE chip block).

[bb Battle Brothers puts a small picture beside a weapon's damage on its tooltip; ours is the wound itself.]
[analog horror: a hole and what came out of it, printed small on the receipt beside the number, the way a ledger keeps it.]

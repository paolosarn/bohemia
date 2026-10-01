# MODS [read count] ROUND TWO AND [keep list into defaults] KEEP 2 OF 11 (10/1/26)

Lane 22 MODS, session mods-59jyd6. MODE: RESEARCH. Nothing in the game changed, no gate added.
Follows records/BOHEMIA_MODS_READ_COUNT_AND_FIRST_KEEP_9_30_26.md.

## 1. THE READ COUNT, ROUND TWO (main at 7ad4472)

Re-run of `node tools/bohemia_mods_read_count.js --write` on a fresh checkout of main:

| change | files to touch, round one | round two | hidden in a blob | target |
|---|---|---|---|---|
| one weapon's damage | 4 | **4** | 2 | 1 |
| one background | 3 | **3** | 0 | 1 |
| one sound | 4 | **4** | 0 | 1 |

Unchanged, which is the honest result: nothing moved the data line, because it is research only (rule 38g).
A number that holds still across rounds also says the instrument is stable. It only moves when somebody
moves content into a data file.

## 2. KEEP 2 OF 11: ONE HONEST NUMBER BESIDE THE ARMOUR (Effective Hitpoints)

From records/BOHEMIA_MODS_SCHOOL_WHAT_BATTLE_BROTHERS_MODS_FIX_9_29_26.md row 7. Battle Brothers players
install a mod to see one number: how much damage a brother can take once armour, helmet and perks are added.
The default, in one sentence: **the gear screen shows one number beside the armour, the damage it takes to
drop him, and next to it what the gear costs in stamina, so the player sees the trade and not just the sum.**

The owning lane is UI (the gear and face card; the HUD's numbers, rule 47a's "UI [bb interface]"); CHARACTER's
[attachments] trade (cloak, padding, aketon, spiked pauldron, "armour vs fatigue vs a special") supplies the
pieces. The row is written on UI as [honest number].

What WE do differently (rule 39b): Battle Brothers' mod adds the number and leaves the stamina cost to a
separate screen. Ours prints both together, because the lesson of the trade is that the sum alone misleads:
the draft page shows plate and greathelm beating mail and sallet by 45 and costing 14 more stamina, then a
cheap swap that ties on stamina and gives up only 5. The number is also the one the game can TELL the player
because they cannot add it in their head (RF4-68's register A).

Every number on the draft page is a placeholder for TUNING (21) and says so on its face; the page is not a
claim about the real armour values. The item names (road cape, vest, aketon, spiked pauldron) are the ones
CHARACTER shipped in records/BOHEMIA_THE_ATTACHMENTS_TRADE_9_28_26.txt.

The thing he can see, VOTE tab, item ONE HONEST NUMBER: two brothers side by side, each dressed from the same
slots (body, helmet, extra). The numbers and a one-line verdict update on every tap. Checked with real
clicks at phone width: 135 against 180, 14 stamina apart, then 135 against 130 at equal stamina.

## 3. KEEPS LEFT: 9 OF 11

Plan Your Perks (a build preview at the training ground), Settlement Tooltips (as a person or a thing, never
a popup), Backgrounds and Attribute Ranges, Named Item Stat Viewer, Numbers, Autopilot (already COMBAT's
gambits; needs a row check only), End's Inventory Management (sell-all and repair-all on the settlement
screen), plus the two pause rows already folded into KEEP 1. Next round: Backgrounds and Attribute Ranges.

## 4. ROUTED

- **UI**: [honest number] is a new row on you.
- **TUNING**: the placeholder numbers on the page are yours to replace.
- **Coordinator**: [one weapon file] is still open; the data-line research it depends on is in the 9/28 pages.

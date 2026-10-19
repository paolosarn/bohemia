# THE HIT CHANCE LOOK (UI, 10/19/26, ui-opus-g)

Row: UI [the hit chance look] THE-NUMBER-UNDER-THE-FINGER-AND-THE-WEAK-LINE, from the coordinator's opening line to this chat
(rule 120(b): "COMBAT builds it; the look of those numbers on the fight's bar is yours to hand COMBAT, in the materials,
sun-readable"). COMBAT's row is [the fight says your weapon is weak]; this is its look, nothing else.

## His words (10/18, to the coordinator)

"the combat is still so fucking ass... the game doesn't explain to you at all that your weapon sucks."
(records/BOHEMIA_PAOLO_THE_COMBAT_IS_STILL_ASS_GUNS_FIRST_THE_AURA_AND_THE_FACE_IS_THE_BODYS_10_18_26.md)

## Measured first, on the fight as it is (slices/BOHEMIA_FIGHT.html, his phone, 390 x 844 at 3x)

- THE CHANCE: when he taps a man in reach, the chance is a 10 px number in the corner of the STRIKE square (`.sq b`,
  right 3, bottom 2, system monospace, gold with a soft text shadow). It is the only number about the shot on the glass.
- WHAT THE HIT DOES: nowhere. The fight computes it (resolveAttack: the weapon's roll, its share against armour, its share
  straight through, the armour left reducing what gets through), but the player only learns it by losing. A held finger on
  the square opens the weapon's card ('Against armour 60%'), which is a percentage about the weapon, not about this man.
- THE CASE HE MEANT, measured in the fight's own functions: his pistol (Bookie, the Battle Brothers dagger) on the raider
  in plate beside him: 32% to hit; at the mean roll the hit takes 15 of the raider's 103 armour and 0 of his 75 health. It
  needs seven of those to strip the plate, and every one of them does nothing to the man. Nothing on the screen says so.
- THE OTHER CASE: the same man with a rifle on a thug in a jacket (10 armour): 31% to hit (he is no shooter, and the fight
  says so honestly); the hit takes all 10 armour and 29 of 55 health. A strong shot that looks the same as the weak one today.

## How Battle Brothers did it (the first answer, rule 41)

Battle Brothers shows the chance when the cursor rests on a man with a skill picked: a tooltip with his name, his armour
and health bars, "XX% chance to hit" and the reasons under it (height, surrounded, shield, cover) in green and red. What
the hit DOES lives in the weapon's own tooltip (damage, "% effective against armor", "% of damage ignores armor") and the
player does the arithmetic in his head; it is the one thing a new player is never told, which is his complaint word for
word. Rule 80 ('better than Battle Brothers': read under the finger and in the sun, never hovered) and rule 120(b) ('Battle
Brothers hides this in a tooltip; we show it') say the same: we print the result of that arithmetic, not its inputs.

## How the pack did it (rule 100c; the study is records/BOHEMIA_UI_HOW_THE_PACK_DID_IT_THE_HUD_10_17_26.md)

The bar is a board that holds paper. His packs' paper (pack 19 #27, a paper sign; the cafe menu board #9) is lit from
above, rimmed hard, grain under 2 px, the paper 3.4 to 3.9 times the board's light. So the read is a PAPER: one slip of
two-colour thermal stock, the kind a till prints black and red on, which is the bar's own receipt and needs no new material.

## What changed (slices/bohemia_ui_materials.js, the THE HIT READ block; inert until COMBAT calls it)

1. ONE SLIP, THREE THINGS, rule 117's few numbers: THE CHANCE in the casing at 30 px (three css pixels a dot) with 'TO HIT'
   under it; TWO METERS of ten printed cells, a plate mark for his armour and a drop for his body: the cells he keeps in
   ink, the cells THIS hit takes in the paper's red, the number beside them in red at 20 px (or '0' in ink when nothing gets
   through); ONE LINE in red, only when the weapon is bad for him ('Your pistol barely dents his plate.').
2. AFTER THE SWING the same slip says what it did for one beat: HIT (or MISS) where the chance was, 'IT TOOK', the taken
   cells printed hollow. COMBAT times it; the slip is the same paper so the eye never moves.
3. THE PAPER is flat stock lit from the top: three values hue-shifted (the lit top row yellower at 55 degrees, the stock at
   43, the foot redder at 33), never darkened; a torn foot (teeth every 4 css px, 2 deep) with the hard one-pixel contact
   edge drawn into the picture; no gradient, glow, blur, shadow or round corner (rule 114 D10). One css pixel a pixel for
   the paper, the cells and the marks; the type in the game's two faces at 10, 20 and 30 px, where their ten dots land on
   whole phone pixels.
4. THE INK #2a221a AND THE RED #6e140c both read on the paper: 11.89 and 9.02 to 1 plain, 5.61 and 4.99 to 1 under a flat
   25% white (the sun, rule 73), measured on every word of every laid slip against the paper really under it. (A brighter
   red, #a3271b, the colour a till really prints, reads 5.57 plain and 3.59 in the sun: it fails, so the red is the dark one.)
5. THE CALL COMBAT MAKES: `BohemiaMaterials.hitRead({ chance, armour: {now, max, take}, body: {now, max, take}, weak, line,
   after: {hit} }, { mode })` returns the slip; `BohemiaMaterials.hitReadPlace(slip, { man: {x, head, feet}, bar, stats,
   top })` puts it on whole pixels inside the glass; `BohemiaMaterials.hitChanceOnButton(strikeSquare, read)` is C's half.
   The numbers are COMBAT's: the chance is hitChance(), the dent is resolveAttack() at the weapon's mean roll with the roll
   forced to a hit and the head off (the sheet used exactly that). WEAK IS COMBAT'S AND TUNING'S TO SET: the sheet's draft is
   'the mean hit puts under a tenth of his health through, and his armour needs three or more of these hits to strip'.
   The line's words are WORDS' (draft: the weapon's name from weapon_lines.json; 'plate' at 90 armour and up, 'vest' at
   40, 'jacket' under).

## The three places (the card: A / B / C / NO)

- A, ON THE MAN: the slip hangs over the head of the man he picked (184 x 78 upright), under it when there is no room; the
  finger comes from below, so it never covers what it is about. It covers the heads behind him while it is up.
- B, OUT OF THE BAR: the slip is printed out of the bar's top edge above his thumb (226 x 82), the place the hint receipt
  already uses (the hint is empty while a man is picked); nothing on the board is covered.
- C, IN THE BAR: the chance moves onto the STRIKE square at 20 px (the square 96 wide); the meters and the line replace the
  picked man's three thin bars in the bar's readout (226 x 72 upright, growing up over the board's foot by a few pixels when
  the line wraps on its side).

Each upright and on its side, the weak case, one beat after, and the rifle's strong shot: the sheet
records/target/ui_hit_chance_look/UI_THE_HIT_CHANCE_LOOK.png (888 x 2650, one css pixel a pixel, crops of the real fight's
glass, nothing scaled), his pack's paper twin at its foot.

## The twin's three differences (rule 82)

1. His pack's sign is painted wood with snow on it; ours is the till's thermal paper with a torn foot, the bar's own receipt.
2. His menu board writes light on dark; ours prints dark ink and red on light paper, because every word has to read in the
   sun (worst 4.99 to 1).
3. His pack's letters are hand-lettered at 5 to 7 pixels; ours are the game's casing and ROM, the chance at three times
   their size so it is the first thing the eye lands on.

## Proof

- Gate: gates/the_hit_chance_look_gate.js, in the suite as THE HIT CHANCE LOOK (see the handoff block for its count).
- Shots: tools/bohemia_ui_the_hit_chance_look_shots.js (the fight on his profile, the two cases set in the browser only,
  the numbers from the fight's own functions); sheet: tools/bohemia_ui_the_hit_chance_look_sheet.py; measures and
  manifest in records/target/ui_hit_chance_look/.
- VOTE: ui-the-hit-chance-look-10-19 (A / B / C / NO).

## [bb interface]

Battle Brothers' hit tooltip is the chance and its reasons, with the damage left in the weapon's tooltip for the player to
work out; ours prints the answer on the paper under his thumb: the chance, what this hit takes off this man, and a plain
line when it is the wrong tool.

## [better than bb] (rule 80, UI's line 18)

Read under the finger and in the sun, never hovered: the dent is shown before he commits, in cells he can count at a glance.

## Analog horror line

A till receipt in a dead world still prints the bill in red: the one colour on the paper is the cost.

## Did not decide

The weak threshold (COMBAT and TUNING), the line's words (WORDS), when the slip comes and goes (COMBAT's beat), and the
head shot (one in four hits go to the head and its armour; the slip reads the body, the likely case, and COMBAT may add a
third meter if it wants one).

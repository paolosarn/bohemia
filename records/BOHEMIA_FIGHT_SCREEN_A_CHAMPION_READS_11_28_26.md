# FIGHT SCREEN 4: A CHAMPION READS (BUILD 11/28c)

VAMILY rules 493(c), 482, 495; the coordinator's order of 11/27 to FIGHT SCREEN 4: "a champion reads on the fight screen (his name,
his face, why he is dangerous, the prize on him) without a pop-up, with BESTIARY 4; built the rule 495 way". Ask row 774 (FIGHT
SCREEN's part). draft:true words, STAND-IN until he votes.

## MEASURED BEFORE (main 1caf2cd64, tools/bohemia_fight_screen_the_champion.js BEFORE=1, the demo upright, a road crew led by a champion)

- THE BELL: "EL TUERTO: We have followed your cart since morning, and this is where it stops." Nothing said he was a champion.
- THE PHONE'S CARD: "EL TUERTO, LV 16" and his marks, like any man of theirs.
- HIS SHEET: "the road crew's champion" in small lowercase under his level; nothing on why he is dangerous; no prize.
- THE PRIZE: none existed on that main (his weapon dropped on the same roll as a thug's). BESTIARY 4 built it in the same hour
  (BUILD 11/27zzb THE ENEMY GROWS: a dead champion's weapon and armour found whole, his pockets' batteries, `u.prize`), and a gold
  skull on his token on the board. This build reads THEIR prize; it adds no second one.
- Battle Brothers (bb_all/0363_Champions.txt via ARMORY 3's and BESTIARY 4's records): a champion is a named man with better numbers,
  and his named item always drops. The game says who he is by his name and a mark; the player learns what he carries by looking.

## WHAT WAS BUILT, WHERE THE CAUSE WAS (rule 495(e))

The cause: nothing in the game said what a champion IS to the player; the fight had his name and title and the spoils had his prize,
but no one place turned them into words. So ONE MODULE owns it:

- `engine/bohemia_champion.js` (new, pure, no screen): `read(u, band, C, opt)` once per champion when the band is dealt (the fight's
  champion deal calls it; `u.champRead`). WHY HE IS DANGEROUS is MEASURED, never written: his numbers against the middle of his own men
  on that board (blood, armour, the skill his weapon uses, nerve, who moves first); an edge clears its bar ("at"), the biggest two are
  said in plain words ("FIVE TIMES THE ARMOUR OF HIS MEN. THREE TIMES THE BLOOD OF HIS MEN."). THE PRIZE is exactly what the spoils'
  champion rule gives: his weapon (our name, e.g. HATCHET) and the batteries in his pockets ("ON HIM: HIS HATCHET AND 7 BATTERIES.
  YOURS IF HE FALLS."). HIS OR HER follows the person: the fight's own sex for him, else the first word of the name (MAMA LOCA, LA
  NAVAJA read SHE), else he.
- `records/target/bb/bohemia_enemies.json` champions.read: every word and every bar (at, shown, times, she_first), a modder's file.
- `slices/BOHEMIA_FIGHT.html`: the read called at the deal; the bell (whyOpen): his title rides his name and, once his sentence has
  typed, why and the prize stamp in under it on the beat, full eight beats; his sheet (sheetChamp, champPic): his title in the board's
  champion gold, why, the prize with its picture (the kit's own item icon); the weapon card's title line folded onto the read (one
  hook line retired: the fight page 428 -> 427, the ratchet tightened). hud() keeps `UI.cardId` (the man on the card) so the phone
  reads the fight, not the fight's HTML.
- `slices/bohemia_phone.js`: P.man reads the champion off the fight (champOn: strings only, nothing of the fight's window kept); the
  card's painter: his name and level in gold, the BOARD'S OWN SKULL (the fight's CHAMP_MARK and CHAMP_GOLD, drawn by champSkull: one
  mark on the board and on the card) where 'LV' was, the prize pinned on his photo's corner as a still (no canvas lives on the card).

## FOUND AND FIXED ON THE WAY

- THE ROW OVERLAPPED (rule 482, measured both ways, not the champion's alone): a man of theirs wearing all three marks with a gun in
  his hands drew his cases over his armour mark (5 points on its side). The painter's cause: six cases after a full plate in a 65 point
  row. Now a man of theirs shows at most four cases (each a share past four, the rule a long magazine already kept) and the plate's
  gap is 2 points: the worst row fits with room on both a champion and a plain man.
- THE DAMAGE BAR SPILLED out of the weapon's well on a tight sheet on its side (a man with many skills: 50 points into the stats): the
  value's box now gives way (flex 0 1 130px, the bar 100% of it).
- THE TOOL'S TITLE TAP: one tap on NEW GAME the moment it appeared was dropped on a slow box; the tool taps until the title is gone.

## GATE

`gates/a_champion_reads_gate.js` A CHAMPION READS (registered): C1 the read (edges, words, prize, her words), C2 the prize is true in
the spoils (his weapon whole on 60 of 60 dice and his batteries paid; a fled champion leaves nothing), C3 the bell, C4 the card (gold
name, the skull, the prize; a plain man none), C5 the worst row, C6 his sheet (no spill), C7 the prize rides home, errors, planted (the
skull taken out of the painter: C4 red). 9/0, the demo upright and on its side, on the rebased tree.
Also: THE MAN'S CARD ON THE PHONE 21/1 (P8 the last hit: the put-back read while a marksman of theirs was mid-turn; the card had moved
on; timing, this build does not touch the bars), THE WHY IS A TAPE 5/0, THE MAN'S SHEET 7/0, THE PHONE 268/0, THE LOOT READS 6/0,
THE SPOILS 18/1 (quarantined tap, as main), DEMO BUILD 25/0, THE PATCH LAYERS ONLY GO DOWN R1 R2 green with the fight's hooks 427
(R5 pasted copies 42 of 41 on main: `hz` and `rngOf` pasted into four board files by another lane; not this build's).

## FOR OTHERS

- CHARACTER 4 / BESTIARY 4: ONE ID, ONE WHOLE PERSON: champions named MAMA LOCA, LA NAVAJA, DONA CONCRETO are drawn with a man's body
  (person_remnants_2 in every run). The words now say HER; the body should agree (or the names should).
- BESTIARY 4: the spoils' champion rule reads the weapon in his hands when the fight ends; a champion killed while holding his
  waistband pistol leaves his first weapon unreported (it is in his bag). The read names the weapon he was dealt.
- BOSSES: the boss's name rides over his head on the board (bohemia_boss_entrance.js); a champion's is the skull only. If he asks for
  the champion's name on the board, the boss's plate is the pattern.

[bb Battle Brothers marks a champion with a skull and his name, and his named item always drops; ours says why he is dangerous, measured, and names the prize the spoils keep]
[analog horror: his name on the tape comes with a title, and the words under his face say what it will cost to put him down]

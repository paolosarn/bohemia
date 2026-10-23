# COMBAT 10/23: WEAPON SHAPES, THE SWEEPS (row [weapon shapes], rules 33i and 46d)

## HIS WORDS (9/24)
"In Battle Brothers some weapons hit multiple tiles at the same time, six or three; a machine gun is comparable to a greatsword or a battle axe."

## MEASURED FIRST
- records/target/bb/weapons.json carries seven Battle Brothers skills that strike more than one tile: Split (2 in a straight line), Swing, Shatter and Reap (up to 3, counterclockwise), Round Swing and Thresh (up to 6: all around), Fire Handgonne (the target and 5 tiles behind it: the cone). Twenty-two weapon rows carry them.
- The fight used only a weapon's first skill: the shotgun (it rides the handgonne) fired its blast at one man; the sledge (the two-handed mallet) only ever Smote; the raiders' axes and flails (enemies.json: Woodcutter's Axe, Two-Handed Mallet, Two-Handed Wooden Flail, Longsword, Greatsword) never swept.
- The fight's rules may not type a number (THE FIGHT READS ONLY SOURCED NUMBERS), so every count, the cone's depth and its wedge live in the data file.

## WHAT SHIPPED
1. records/target/bb/weapon_shapes.json: the seven, each with its wiki page, its own words, its kind (line / arc / ring / cone), its count and our square translation. A modder edits a row and the fight sweeps that way.
2. THE SQUARES: Battle Brothers fights on hexes (six around a man), we on squares (eight). A shape keeps its meaning: Split is the man struck and the one straight behind; Swing, Shatter and Reap the man struck and the next two of the striker's ring, counterclockwise as he sees it on the glass; Round Swing and Thresh our whole ring of eight; the cone the same 60 degree wedge behind the man shot, two ranks deep: on squares it holds the man and four behind on every one of the eight headings (five behind on hexes).
3. FOE ONLY (rule 117, 'easier than Battle Brothers'): Battle Brothers' pages say "targets" and never whose; ours strike only the other side. A friend in the shape is passed over and the lit tiles show him in dim chalk.
4. EACH HIS OWN BLOW: every man in the shape is his own attack: his own hit chance with the skill's own modifier, his own armour, his own damage. One AP cost, one round.
5. THE SHOTGUN'S BLAST IS ITS BLOW: every shotgun shot sprays its cone. "The blast strikes 3 of theirs." under the finger.
6. A WEAPON'S OTHER SWEEPS ARE HIS TO PICK: a square in the skills row for each (the sledge's SHATTER, the axe's ROUND SWING, the greatsword's SPLIT and SWING), the shape drawn on it from the table's own tiles, its AP under it; a tap arms it, the first tap on a man lights the shape, the big button names it, the second tap swings.
7. LIT BEFORE THE SWING: the man picked and every tile of the shape lifted like a lamp lifts a tile, ringed in rust paint, rust corners on every man of theirs it strikes.
8. THE SWING PLAYS ONCE: one motion, every man it caught a sixteenth apart, each his own hit or miss sound (rule 126(c): none silent), his own mark, the line counts them: "The shatter caught 2 of 3 more."
9. THE BRAINS SWEEP WHEN IT PAYS: an enemy (or his own man on AUTO) with a sweep picks it when its shape strikes two or more of the other side, else a plain blow.
10. THE MACHINE GUN: a new gun is his vote (rule 47b), so none was added. The day it is named and rides the greatsword's row (his words: "comparable to a greatsword or a battle axe"), it sweeps with Split and Swing with no code change.

## THE NUMBERS (gate WEAPON SHAPES 9/0)
- The table: 7 sweeps, every row its own words, its page in the library, its count.
- The shapes: Split 11,6 12,6; Swing 11,6 11,5 10,5; Round Swing 8; the cone 5 on all eight headings.
- Round Swing ringed by three of ours and one of its own: 3 blows, its own man untouched. The shotgun: 3 blows from one shot, one round, AP 9 -> 6. Smite 1, Shatter 3. The brains: Round Swing beside two, a plain blow beside one.
- On the phone: the cone lit (5 tiles, 3 struck), the shot heard on all 3; the SHATTER square 46 points, 6 AP, the arc lit (3 struck), the big button SHATTER, the swing heard on all 3.
- Rule 117 holds: a new crew's first fight 98 in 100 against two, 93 against three (it was 97 and 87); the guns 54 to 59% of the kills (GUNS FROM THE FIRST FIGHT 12/0).

## [bb sweeps]
Battle Brothers made the two-handers worth their slowness with these shapes: a greatsword's Swing, an axe's Round Swing, a flail's Thresh punish a man who lets himself be surrounded, and the handgonne punishes a tight line. The lesson stays: don't bunch up in front of a sledge or a shotgun.

## THE ANALOG HORROR LINE
The cone is lit before the shot like a tape's tracking lines crossing the screen: you see exactly who is in it, and then it happens to all of them at once.

## NOT BUILT
- The skills' riders: Shatter's stagger and knockback, Thresh's stun, Reap's penalty on a man beside you. The shape and the blows are in; the riders are a row for the next round.
- Whether Battle Brothers' sweeps fall on friends too, the library's pages do not say; ours never do, by rule 117.

# COMBAT 10/26: THE SHIELD COVERS THE MAN BEHIND IT (rule 230(b)(c))

## HIS WORDS
"there's obviously a defensive bonus when you are at the rear of your teammate that has a shield against enemy ranged attacks"
(records/BOHEMIA_PAOLO_THE_FIGHT_CAMERA_FOLLOWS_THE_FIGHT_AND_THE_SHIELD_COVERS_THE_MAN_BEHIND_10_26_26.md)

## BEFORE
The fight had Battle Brothers' blocked target since rule 63: a man on the tile before the target along the line of fire takes 75%
off the shot ('in the way'). Missing: the shot that misses went nowhere (Battle Brothers sends it astray into the man in the way),
nothing on the board showed which man was covered, and the shot square said only the chance.

## BATTLE BROTHERS (records/target/bb/rules.json, the wiki copy)
hit_chance.ranged.cover_hit_chance_page: 'The base hit chance penalty to reach a blocked target is 75%... If this fails the shot
goes astray. One among the intended target obstacles is randomly chosen and targeted instead. If the shot goes astray a -15% penalty
to hit chance is applied. Attacks made over allies at a range of 2 tiles are not blocked.' hit_chance.ranged.astray_damage_multiplier:
'Shot goes astray 0.75'. The handgonne (our shotgun): 'chance is unaffected by objects or characters in the line of fire'.

## NOW (slices/BOHEMIA_FIGHT.html)
- THE SHOT GOES ASTRAY (230(b)): strike() reads the man in the way as he aims (inTheWay); a blocked shot that misses flies on into
  him: his own defence (a shield man's car door against shots) and his own tile's cover, the chance -15 (resolveAttack's astray),
  three quarters of the damage. The astray chance never reads the line again (the shot has already flown it: no second 'in the way',
  no wall on it). One motion: the astray shot rides the one shot on the board (like a sweep's other men). The shotgun ignores the
  line, so nothing of it goes astray.
- [COMBAT'S DEFAULT] ONLY A MAN OF THE TARGET'S SIDE TAKES THE ASTRAY SHOT. Battle Brothers sends it into a friend in the way too.
  Measured with friendly astray on: AUTO's shooters, who do not yet read their own line before they shoot, put misses into their own
  men, and two fight gates went red on clean wins (THE PC PLAYTEST's first-frame odds glow on a three against one and its AUTO tap
  that plays out to the recap; AUTO KILLS ONE AT A TIME counted the astray shots as picks). A friend in the way still blocks the
  line (-75); the miss flies past him. One condition flips it (way.side !== a.side in strike) once COMBAT TWO's brain reads its
  own line before it shoots (NOTEd).
- THE MARK AND THE CUT (230(c)): while his shooter aims (his turn, by hand), a man of theirs that shooter reaches only through a man
  in the way wears a small steel shield right of his bars (coverOn, SHIELD_MARK); picked, the shot square shows the chance and a red
  down arrow with the cut: what the man in the way takes off this shot (coverCut: the chance without him less the chance with him).
- FIGHT.coverCut, FIGHT.inTheWay, FIGHT.shotLine exported for AUTO's brain and the gates.

## THE GATE: THE SHIELD COVERS THE MAN BEHIND (gates/the_shield_covers_the_man_behind_gate.js, in the suite, slow) 6/0
S1 1,500 shots through the man in the way (a light crossbow, the cut 34 points): 238 hit, 1,262 missed, every one of the 1,262 flew
on, astray hits 490 against 479.6 expected (3 sd 51.7), every astray chance the shot's -15, no hit went astray. S2 base 40: straight
38, astray 27 (= the shot of base 30). S3 the shotgun: no cut, 200 shots, 0 astray. S4 his phone and computer: the covered man wears
the mark, the man in the clear none; the shot square '15%▼28' on the covered, '46%' on the clear. S5 nothing threw.

## THE OTHER FIGHT GATES ON IT (the gates that count a shooter's picks skip the astray shot: it is the miss flying on, never a pick)
AUTO KILLS ONE AT A TIME 7/0 (was 6/1 with friendly astray: 2 shots under the floor, both astray), MELEE IS ONE TILE, COVER IS WHAT
IS ON THE TILE 9/0 (was 8/1: 13 astray shots read 'cover' off the line to the man in the way; the astray chance no longer reads the
line), THE PISTOL IS NEVER A CLUB 10/0, THE PC PLAYTEST: THE FIGHT 27/0 (was 25/2 with friendly astray), AUTO NEVER WASTES A TURN 9/0,
EVERY FIGHT ENDS 10/0, GUNS FROM THE FIRST FIGHT 13/0, ONE TAP 16/0, THE LITTLE THINGS 7/0, SOURCED NUMBERS 10/0, THE PERKS ARE LIVE
47/0, RETREAT AND THE ROUT 13/0, EVERY MAN HAS A JOB 5/0, BY HAND QUICKER 20/0. THE REBUILT FIGHT PLAYS 151/4, run side by side with
main's fight under the same load (main 153/2): the two reds of both are red on main (both teams on the glass, a tile's edges); the two
more of mine are frame-rate legs (the night's 60 frames, the scrub's bank frames), and measured head to head after on the same
night board, idle, main ran 42 and 46 frames a second, mine 47 and 44: the machine, not the change (the cover mark computes once a
man and a place, cached; nothing of it draws on AUTO). One run of it hung in the page sweep for 50 minutes under four browsers at
once; a copy with a hang detector passed the same sweep (landfill ended round 5, as alone).

## ROUTED
- COMBAT TWO (230(d)): AUTO puts the hurt and the shooters behind the shield men against guns, and its shooters read the cover
  (FIGHT.coverCut); the astray shot is in the rules, so the calculator and the brain already pay it. When the brain reads its own
  line before it shoots (a friend in the way), the friendly astray of Battle Brothers is one condition away.
- UI: the shield mark and the red cut are COMBAT's placeholders in the kit's colours; dress them in the kit (rule 224).
- TUNING: no new number (the wiki's -75, -15 and 0.75); the friendly astray is COMBAT's default, not a number.
- EYES: his crossbowman picks a man behind a shield man: the mark, the red cut; a miss flies into the shield man.
- [the fight's camera follows the fight] (230(a)) is COMBAT TWO's now (rule 288).

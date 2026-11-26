# COMBAT FOUR: EVERY BEAST ITS OWN WORD (BUILD 11/26zb - EVERY BEAST ITS OWN WORD)

11/26/26. COMBAT FOUR, the routine 'COMBAT FOUR: rule 482 next': 'row 743 (every beast bites)'. Ask row 743, FOUND BY BESTIARY 2: 'A HELD
FINGER ON ANY BEAST SAYS TEETH ... IT BITES, AND IT BITES AGAIN ... the card's class word and line for a racial attack follow what it is (a
bite, a horn, a kick, a sweep, a touch)'. Rules 480(b), 441, 465 (no line rewritten: the new attacks' lines are WORDS THREE's).

## WHAT IT WAS
The fight's held-finger card (weaponCard), the man's sheet and objName read the weapon's CLASS row in records/target/bb/weapon_lines.json;
every racial attack is class 'natural', whose row is TEETH, 'No gear to take off it. It bites, and it bites again.', so 34 attack rows
read as a bite (the camel's and the goat's headbutt, the bull's and the longhorn's gore, the bison's and the horse's sweep, the sloth's
uproot, the ghost's touch; and from 11/22 his own men's fists).

## WHAT SHIPPED
- THE DATA (weapon_lines.json natural.by_attack, a modder's table, draft): the first entry whose pattern is in the attack's id or name gives
  its card word and its Hands: bite or gorge TEETH (the class's line kept, 'none, it bites'), gore HORNS, headbutt HEAD, spike SPIKES, tail
  slam TAIL, sweep BULK, uproot or claws CLAWS, touch TOUCH, fists or clout or flurry FISTS (Hands 'empty'), hurl or throw THROW, explode,
  mortar or lightning BLAST. Only the bites keep a line; the others show none until WORDS THREE writes theirs (no line rewritten, 465).
- THE FIGHT (slices/BOHEMIA_FIGHT.html __EVERY_BEAST_ITS_OWN_WORD__): FIGHT.wlineOf(w), the class row with the attack's own word; the
  card, the sheet and objName read it. Any other class reads its own row as before.

## THE GATE (gates/every_beast_its_own_word_gate.js, EVERY BEAST ITS OWN WORD in the suite) 6/0
W1 10 biting attacks read TEETH with the line; W2 24 others read FISTS, THROW, BLAST, TOUCH, HORNS, CLAWS, HEAD, SPIKES, BULK, TAIL, none
bites; W3 45 enemies with racial attacks, every attack a word; W4 his fists read FISTS; W5 a pistol PISTOL, a club PIPE as before; plant: the
table taken off, 24 non-biting attacks read TEETH and 'it bites' again, caught.

## ON THE PAGE (rule 441; BESTIARY 2's own page check, gates/the_bestiary_every_type_fight.js, which holds a finger and reads the card)
The demo upright and sideways: the camel HEAD, the bull HORNS, the sloth CLAWS, the ancient bison BULK, the ice-age horse BULK, Harrington's
goat HEAD, the long-horned bison HORNS, the ghost TOUCH (16 fights, 0 bugs). The alpha upright and sideways: the bull HORNS, the ghost
TOUCH; the coyote still TEETH with 'It bites, and it bites again.'

## SAID PLAINLY
No VOTE card (a word on a card; the fight's held finger shows it). FOR WORDS THREE: the attacks that are not bites have no line on the card
now; one each is yours when rule 465 lets go (the table's entry takes 'line').
[bb Battle Brothers names a beast's attack by what it is: Bite, Gore, Headbutt, Sweep, Uproot, Ghastly Touch]
[analog horror: the label on the tape finally matches what is on it]

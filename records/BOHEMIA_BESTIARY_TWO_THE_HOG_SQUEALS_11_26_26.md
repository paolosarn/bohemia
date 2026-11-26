# BESTIARY 2: THE HOG SQUEALS, THE HIDE FOLLOWS THE ANIMAL -- 11/26/26
BUILD 11/26zn - THE HOG SQUEALS, THE HIDE FOLLOWS THE ANIMAL. VOTE card bestiary2-the-hog-squeals-11-26 (a page: tap to hear the game's
own death takes, before and now; the hides a kill gives). VAMILY rules 482 (Paolo 11/26: 'More cooking up cleaning up improving things
we're already doing'), 480(b), 461(c) as amended, 441, 465. The routine's job: the beasts he meets first, better: each moves and sounds
like the animal it is, its attack has its own name and look (row 743 with COMBAT FOUR), its body after the fight reads, its drops make
sense.

## THE BEASTS HE MEETS FIRST (measured, not picked)
The road in act one (ours.json road_factions and bohemia_enemies.json road, act one): of the beast parties, the coyotes are 5.6% of
all road encounters, the bull 4.2%, the hogs 2.8%, the camels 2.8%, the Ice Age horses 1.7%, the teratorns 1.7%, the mountain lion
1.4%; the coyote lives in the suburb, where the demo starts.

## WHAT CHANGED
1. IT DIES LIKE THE ANIMAL IT IS (engine/bohemia_death_sounds.js animalOf, inlined byte for byte in the alpha, the demo cut from it):
   the game has three animal death voices cut from real CC0 recordings (ESC-50: animal_canine from the dog, animal_big from the cow
   and the pig's squeal, animal_cat from the cat). The feral hog matched none of the names and died with the dog's voice; it now dies
   with the big beast's (the pig's squeal under it); the shrub-ox and the llama with it. The cheetah, the jaguar and the sabre-tooth
   matched no cat name and died as dogs; they now die as cats.
2. THE HIDE FOLLOWS THE ANIMAL (slices/bohemia_carcass.js goodsOf, records/target/bb/carcass.json hide.kg_a_roll and hide.most, draft,
   ECONOMY and TUNING move them): every kill was one roll of hides, a 65 kg mountain lion and a 700 kg bull alike. NOW one roll for
   every 250 kg of animal in the kill, one at least, three at most: a coyote pack, a lion or a hog sounder one; a horse two; a bull, a
   camel herd, a bison herd three; a mammoth three, not thirty. The meat already followed the animal (its kilos, as much as the crew
   eats before it turns). The hunters' extra hide (origins) still rides on top. ON THE PAGE (the demo upright): a bull through the one
   door, the win, LEAVE, its kill tapped on the map: 3 rolls of hides in the bag; the page's own goodsOf: coyotes 8 -> 1, a lion 1,
   hogs 3 -> 1, a horse 2, a bull 3, camels 2 -> 3, a mammoth 3; 0 page errors.

## ROW 743 (ITS ATTACK'S OWN NAME): COMBAT FOUR'S, SHIPPED WHILE THIS ROUND RAN
COMBAT FOUR shipped BUILD 11/26zb EVERY BEAST ITS OWN WORD (725b01f24): the card's word follows the attack page (a bite TEETH, a gore
HORNS, a headbutt HEAD, a sweep BULK, claws CLAWS, the ghost TOUCH), lines only for bites until WORDS THREE writes the rest (rule 465).
This round had built the same on the card from a per-animal table and dropped it before shipping: one card, one owner, one system.
For COMBAT FOUR's next pass and WORDS THREE's lines (the attack page is a Battle Brothers stand-in, so the word follows the page, not
the animal): the hog's page is a hyena's bite (TEETH; its own weapon is its tusks), the camel's a headbutt (HEAD; a camel kicks and
bites), the ancient bison's and the Ice Age horse's a sweep (BULK; horns and hooves), the mountain lion's and the jaguar's a serpent's
bite (TEETH; claws and jaws). A per-kind word would read the animal. This round's draft words, per animal, for whoever takes it
(words only, no lines, rule 465): coyote, dogs, wolves, hyena, jaguar JAWS; hog TUSKS; bull, long-horned and ancient bison, goat,
shrub-ox HORNS; camel, Ice Age horse, llama HOOVES; mountain lion, American lion, cheetah, bear, sloth CLAWS; sabre-tooth FANGS;
teratorn BEAK; mammoth TUSKS; stilt-legged horse TEETH; the ghost TOUCH.

## NOT THIS ROUND, ASKED
- Ask row 749, SOUNDS: a beast's blow lands as a pipe (the punch player's 'blunt'); the coyote's bite, the bull's horns and the hog's
  tusks should carry the animal's own voice under the hit, from the CC0 animals already in the bank (reference/library/sound_bank/
  esc50_cc0: the pig 5 clips, the cow 2, the cat 4, the dog 1). And DEATH SOUNDS THAT TERRIFY's ON THE BEAT leg is red on main (one death
  in seven booked about 52 ms off the sixteenth), on no list, the same with and without this change.
- How it moves: each beast walks on its own sheet's walk (the 3D rigs); the bull and the bison charge in a line, the camel and the horse
  kick, the bear and the sloth fling (EVERY TYPE THROUGH A FIGHT E2). Not changed this round.

## GATES
DEATH SOUNDS THAT TERRIFY 20/0 (its player byte for byte in the alpha and the demo; its ON THE BEAT leg read 19/1 on two earlier runs,
the same on main without this change, a timing leg on this box); ENGINE SYNC 19 modules, zero drift; THE KILL GOES IN THE STASH 14/0 (one
real tap on a lion: one roll); EACH ORIGIN ITS OWN 19/0 (the hunters' extra hide still read); DEMO BUILD 25/0; THE TERATORN IS ONE MORE
BEAST 6/1, its T4 red on main before this change (slices/bohemia_place_visits.js names the beast factions in a regex: WORLD 15's file,
ask row 750); EVERY TYPE THROUGH A FIGHT: its drop debt struck by FIGHT SCREEN 3 (11/26zd), the five re-checked here (17 pieces in 10
fights each).

[bb Battle Brothers' beasts drop trophies by what they are: a wolf's pelt, an Unhold's hide; ours drop leather by the weight of the animal]
[analog horror: in the dark the thing you killed squeals like a pig, because it was one]

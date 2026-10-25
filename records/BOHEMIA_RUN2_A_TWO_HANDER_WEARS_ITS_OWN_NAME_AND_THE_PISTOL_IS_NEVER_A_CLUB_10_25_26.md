# RUN TWO: A TWO-HANDER WEARS ITS OWN NAME, AND THE PISTOL IS NEVER A CLUB (10/25, rules 194 and 195, BUILT)

HIS WORDS (10/25): "I can't make a spear shield wall anymore... I tried to put the spear in the shield and it kept saying this shield
was like both hands." And: "the game still says the pistol is a club at one tile I never asked for that shit."

## WHAT WAS TRUE (the coordinator measured; confirmed here)
- Nobody made the shield two-handed. The NAME did it: every spear row was a 'rebar spear', and the class holds the two-handed Warfork
  and Spetum, so a 'solid rebar spear' was a one-hander or a two-hander. Nine classes mixed hands under one name (axe, cleaver,
  dagger, flail, hammer, mace, spear, sword, throwing). The crew screen then said 'A shield puts the solid rebar spear in the stash',
  which reads as if the shield took both hands.
- The crew screen and the hall said every pistol 'REACH 2 TO 4 TILES, A CLUB AT 1' (armOf floored the shot at its javelin row's own
  range_min, 2, while the fight shoots from 1 since rule 185, and called every gun a club); the shop said 'a club up close'.

## WHAT IS BUILT
1. **A two-hander wears its own name, Battle Brothers' way (their Two-Handed Hammer, Two-Handed Mace):** in a class that holds both,
   a two-handed row is a 'two-hand' one ('beat-up two-hand rebar spear' is the Warfork; the Boar Spear stays 'solid rebar spear'),
   and its quality word ranks it among its own kind. One rule, the roster engine's classWord/weaponName (the crew screen, the loot,
   the hall) and the shop's weaponItem (the same rule on its own copy of the rows), and UI's icon mirror names every row the same
   (126 of 126). A class all of one kind (the rifle, the shotgun, the bow, the pole hook) keeps its word. draft:true, WORDS may better them.
2. **TWO HANDS in big letters** on a two-hander's card at the smith and the arms dealer before he buys it, and its line says
   'Takes both hands, no shield with it.'
3. **The words blame the weapon** on the crew screen: 'The two-hand rebar spear takes both hands. Give him a one-hand weapon to carry
   a shield.' and 'You take the car door; the beat-up two-hand rebar spear takes both hands, so it goes in the stash.'
4. **The shield stays one hand, the off hand**: a one-handed spear and a car door put on one man by real taps are both in his hands
   on the crew screen and in the next fight (the shield on his arm, not his back).
5. **No gun is a club**: armOf reads the fight's own rangeLo (a gun from ours.gun_min_range, 1), its club field is always false, and
   armLine has no club words: a pistol reads '1-4 TILES' and 'REACH 1 TO 4 TILES'; the shop's pistol line is 'A few houses off or
   right beside him, spends rounds.'

## THE GATE
A TWO-HANDER WEARS ITS OWN NAME (gates/a_two_hander_wears_its_own_name_gate.js) 8/0: T1 no name shared across hands (126 rows, the
shop's and the crew screen's naming; UI's mirror equal); T2 TWO HANDS on a two-hander's card by a real tap, not on a one-hander's;
T3 the spear and the car door on one man in the fight (the demo, the phone, real taps); T4 the words blame the weapon; T5 every gun's
reach from the fight's 1, no club anywhere; T6 nothing threw.
RE-AIMED: THE GUNS ON THE CREW SCREEN (a pistol reads 1-4 TILES, never a club; the oracle holds the fight's rangeLo) 7/0.

## NOT DONE HERE
- The fight's own words (a held finger's weapon card, its butt and WHIP button) are COMBAT's: rule 195(a) kills them there; NOTE on its
  board. The names in the fight's card come from its own rows; the same 'two-hand' rule is one line for it.
- Items already in a stash from before keep the name they were bought with until they are sold or looted again.

[bb Battle Brothers: Two-Handed Hammer, Two-Handed Mace, Warfork; the tooltip says Two-Handed before you equip]

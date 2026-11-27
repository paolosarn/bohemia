# BOSSES, 11/27/26: THE HARD PLACES (rule 493(c); the routine 'BOSSES: hard places for a strong crew'; ask row 774)

Paolo 11/27: 'I have five combat people [that] were absolute killers and there's no more challenges, nothing else to do.' Rule 493(c),
this lane's part: 'the bosses and their lairs as the hard places a strong company goes looking for (found by a sign, rule 243; bosses 7
and up built for a strong crew, with what each guards); a prize only the hard thing gives (gear no stall sells, a battery haul, a man
who joins) so it is worth the blood.' The routine: 'bosses 10 and up sized for five killers at their best... Battle Brothers' legendary
places as the model (research cited).'

## HOW BATTLE BROTHERS DID IT (the studio's library, reference/library/grok/wiki/PAGES_ALL.tar.gz)
- bb_all/1161_Legendary locations.txt: 'unique locations scattered over the world... While less remote locations are usually safe, the
  ones further away from civilization are more dangerous and can involve challenging battles.' Nineteen of them (the Black Monolith,
  the Sunken Library, the Abandoned Village, the Icy Cave and the Hunting Ground, the Ancient Spire...).
- bb_all/0584_Dev Blog 106: Legendary Locations.txt: 'giant overgrown statues and hidden temples... Places that people think only exist
  in myth'; the Black Monolith and the Goblin City 'both offering a very challenging battle'.
- bb_all/0243_Black Monolith.txt: you choose 'Go in' or 'Fall back' (nothing happens); the fight is FIXED: 8 Ancient Legionaries, 7 with
  polearms, 6 Necrosavants, 14 Honor Guards, 8 with polearms, 3 Priests and The Conqueror (47); after it, The Emperor's Armor.
- bb_all/1896_Sunken Library.txt: The Lorekeeper, 10 Phylacteries, 3 Lost Treasure Hunters, 12 Honor Guards (26); The Black Book.
- bb_all/0006_Abandoned Village.txt: 6 Flesh Golems, 5 unarmed, 3 Fault Finders (14), 'suitable in difficulty for mid-game companies'
  (Update 1.5.1); Bloodletter's Reach.
- bb_all/1057_Icy Cave.txt, 1045_Hunting Ground.txt: a chain: the cave's duel (your best man against the Barbarian Madman) opens the
  Hunting Ground and the Ijirok; the broken ritual armour becomes the Armor of the Ijirok.
THE LESSONS WE TAKE: the place is found, then chosen (enter or fall back); its fight is fixed, never scaled to the day, so a strong
company can measure itself against it; it is far bigger than an ordinary fight (14 for mid-game, 26 to 47 at the top); its prize is one
no shop sells.

## OURS (BUILD 11/27zu, slices/bohemia_bosses.js (28) __THE_HARD_PLACES__, records/target/bb/boss_act_one.json 'lair')
- Bosses ten to eighteen (THE PLATE to THE SMITH; THE MIDWIFE, the 19th, is met, never fought) each have a LAIR: seven of his own
  people a tier up, one of them a champion (the bestiary's champion rows: brigand_leader_champion, blade_dancer_champion,
  master_archer_champion, nomad_executioner_champion, barbarian_chosen_champion, officer_champion, nomad_leader_champion,
  knight_champion), standing with the three or four men he had: about ELEVEN round him. Battle Brothers' late hard fights run about two
  of theirs to one of yours; a company of five killers meets eleven. FIXED, whatever the day, as the legendary places are.
- Found by his sign (rule 243), as every boss is; his card before the fight shows the eleven faces; ENGAGE or FALL BACK, as the
  Monolith's 'Go in' or 'Fall back'.
- HIS HOARD, the prize this round: a battery haul paid once on his fall through the purse's own credit, growing up the ladder (THE PLATE's
  wagon's strongbox 300 ... THE SMITH's forge's take 540; a top gun in a stall is 140 to 295), said on his card ('HIS WAGON'S STRONGBOX:
  +300 BATTERIES').
- NOT YET, AND WHOSE: GEAR NO STALL SELLS (a named piece, Battle Brothers' named weapons, bb_all/1403_Named Weapons.txt) needs a place
  for gear to land (the crew's stash holds only counts: engine/bohemia_stash.js), ARMORY's; A MAN WHO JOINS needs the hiring path
  (engine/bohemia_company.js computes the company from the world's records), HIRES'. Both written for those lanes in the handoff.
- MEASURED: THE PLATE played for real (the nine before him fallen the quick way): his fight stood 11 against the game's starting three;
  AUTO lost it (the walk's checker ended it); his hoard paid 300 once and his card said it. Whether five killers at their best win it
  is EYES' measure (rule 493(d)): this lane sized it by Battle Brothers' ratio, not by a strong company's run.

## THE GATE
gates/the_hard_places_gate.js, THE HARD PLACES (registered; foreground, under ten minutes): D1 every lair (seven guards, a champion, real
rows, about eleven, the hoard growing), F1 THE PLATE's fight stands 11, H1 his hoard paid once and on his card. 6 passed, 0 failed.
Planted: a lair with no champion, his old four, an unpaid hoard.

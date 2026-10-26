# CHARACTER (05) -- the lane's own handoff block (newest first)

CHARACTER (character-armour, session_0184h2KYCB, opened by the coordinator 10/26): 10/26 (aa) LATEST -- *** [the armour he wears shows] SHIPPED 7035d1c7: NOTHING HE WEARS IS INVISIBLE. ***
TAB: the fight, the crew screen (CREW on the bar), camp (CAMP on the map) and the map, in the demo; and VOTE.
RULING: rule 272 (Paolo 10/26: 'the weapons and the shield show, but the good armour I have on me doesn't show, like a police
helmet... it's a lot of placeholder... it's not visually shown'). Record: records/BOHEMIA_CHARACTER_THE_ARMOUR_HE_WEARS_SHOWS_10_26_26.md.
WHAT: every one of armor.json's 87 helmets and 78 body armours sorted by the object its own name says it is into 17 classes
(records/target/bb/armour_looks.json, draft:true, modder-editable) and drawn ON HIM as a placeholder made in the rig's look:
the police riot helmet (clear shield down over his face), the motorcycle helmet, the welder's mask, the hard hat, the army
steel pot, the chain hood, the gas mask, the hood, the straw hat, the bandana, the dust mask; the police vest, full riot
armour, the car door strapped on, the plated jacket, the padded vest, the work jacket; extras spike, horns, chain. 27 pieces x
8 facings + lying + portrait in slices/wear (243 KB + the face sheet).
HOW: tools/bohemia_character_the_armour_shows.py (classes | render | screens): each piece a small signed-distance model at the
rig man's proportions, run through the master rig's recipe (ortho, tilt 45, the 1/cos stretch, ppm 57, the guide's sun and fill,
roughness 1, chalky paint, grain, the ring, the hard alpha; the portrait at tilt 80), his head and trunk holdouts. NO BLENDER ON
THE BOX AND NO INSTALLS: a numpy ray marcher, so these are PLACEHOLDERS (his word); COOK [the armour's art] makes the real ones
through the master rig and drops the cells into wear.json. engine/bohemia_wear.js is the one player: his head found on the cell's
own pixels once a cell (24 new cells a frame at most), the body piece then the helmet, over his body and under his gun and
shield; lying, the helmet beside him; the night's moon and the town's dusk on the piece.
WIRED (marked __THE_ARMOUR_HE_WEARS_SHOWS__): slices/BOHEMIA_FIGHT.html (idleDraw, holdDraw, meleeDraw, blitMan, drawPortrait),
slices/BOHEMIA_ROSTER_SCREEN.html (the still, the idle tick, draw()), engine/bohemia_crew_faces.js (paint), slices/
BOHEMIA_SETTLEMENT_SCREEN.html (camp and town: the men, their stills, the lead), slices/BOHEMIA_CITY_WORLD.html (him and his two).
GATE: THE ARMOUR HE WEARS SHOWS (gates/the_armour_he_wears_shows_gate.js, in the suite) 18 legs green: D1 the data, C1 C2 the crew card and
portrait, F1 F2 the fight and its face, K1 camp, M1 the demo's map through its own door, M2 its close end, E1 every class, the
plant; phone and computer. --shoot refreshes the screens card. COST: none the fight's clock can see (42.5/41.9 fps on, 42.5/38.3 off, twelve men).
VOTE: character-the-armour-he-wears-shows-10-26 (every class, bare beside wearing, eight turns, portrait),
character-the-armour-on-every-screen-10-26 (five screens on his phone, the map's close end too, bare above, wearing below);
tools/bohemia_character_the_armour_shows_cards.js remakes the first.
NAMED, NOT DONE: a man on the ground (helmet beside him, no vest); forearms in front of the chest go under the vest; enemies get
no armour rows from the fight (NOTE COMBAT); a modelled hat under a helmet (cast_widebrim); on the portrait his marks sit over
the helmet (rule 234(c)). The map's lead wears what RUN's mapMainLook says he is (rule 263). NOTES left: COOK, PORTRAIT, UI, COMBAT, RUN, RUN TWO, ANIMATION.
GATES (rule 13): green THE ARMOUR HE WEARS SHOWS (18 legs), and the pre-push pass named in the commit. NEXT FOR THIS LANE: the top OPEN
row ([eyes: her body], a woman's body for the post) unless the coordinator says otherwise; the armour's real art is COOK's.
[bb Battle Brothers draws a brother as layers, body then armour then helmet, so a bought helmet changes him everywhere at once.]
[analog horror: a riot helmet's clear shield over a clay face, a car door strapped on with belts: what is left of order, worn.]


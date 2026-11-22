# CHARACTER 11/22: THE CONE HAT IS DEAD (rule 470(f); Paolo on a homework card: 'why are people wearing chinese rice farmer hats btw wtf???')

The coordinator's routine 11/22 ('CHARACTER: no rice-farmer hats'): find every person, outfit and enemy type that wears the conical
straw hat and take it off, a hat that fits Las Vegas after the collapse and the faction (the runway) or no hat; graveyard it; prove on a
phone that none is left on the map, in the towns or in a fight; ship with a VOTE card.

## WHAT THIS ROUND DID (and what it did not)
- FOUND every wearer (below), every file that draws it, and why it is there: ONE source, the Caravans' gang default head.
- GRAVEYARDED it (records/BOHEMIA_CLOTHING_GRAVEYARD.txt, with its post-mortem) and put a machine on it: gates/the_cone_hat_is_dead_gate.py
  (C1 no new wearer in any served or person-making file, C2 what is left only shrinks, C3 the barber never rolls it), green on main
  f695f2b1a with 35 mentions left in 9 files. It bit on its first run (a ninth page, slices/BOHEMIA_LOOK_CURRENT.html, nobody had listed).
- NOT DONE THIS ROUND, SAID PLAINLY: the hat is still on every wearer below. Taking it off is five picture pipelines (about a day of
  renders), and this session's context was near full (its handoff said so on 11/21, rule 461(f)): a fresh CHARACTER lane takes the
  plan below as its first job. Nothing he sees changed this round; no VOTE card, because there is nothing new to show yet.

## WHO WEARS IT (main f695f2b1a)
| where he meets it | who | what draws it |
|---|---|---|
| the hall, the map, the towns, the road gangs, the fight | the 8 Caravans hall men, person_caravans_0 to 7 (none rolled a hat; the gang default filled the slot) | RUN TWO's make through tools/bohemia_faction_outfits.py FACTION_LOOKS 'Caravans' head; slices/rig_mix/caravans.json lists all 8 |
| the road gangs' first slot, the bosses' crews, the town, the feed | faction_caravans, the old one-piece Caravans look | tools/bohemia_character_the_thirteen_through_the_rig.py LOOKS 'Caravans' (its own 'cone' builder) |
| the settlement screen's client 'Old Tavo', the crew faces | cast_widebrim | slices/fight_people/fight_people.json (the 8/2 cast figures) |
| a Caravans HD face | the Caravans' portrait | tools/bohemia_portrait_the_head_from_the_model.py FACTION['Caravans'] gear 'cone hat' |
| the alpha's and the demo's wardrobe and looks | the 2D wardrobe's hat, the thirteen's worn lines | slices/BOHEMIA_ALPHA_0_9.html (5), slices/BOHEMIA_DEMO.html (5), slices/BOHEMIA_LOOK_CURRENT.html (1) |
No enemy type of the nine-enemies tool and none of BESTIARY's men wears it (person_caravans_2 is the grenadier's stand-in and wears it
through the gang default until he is re-made).

## THE REPLACEMENT (decided, for the fresh lane to build)
THE DUST RANCHER HAT: a wide-brim felt cattleman's hat, the Caravans' own dust felt (128, 110, 80) with a leather band; a crown about
10 cm with a cattleman's crease; a brim about 7 cm, flat at the front and back and rolled up at the sides. It keeps the Caravans' shape
('broad / mantle / wide brim': a brim against the sun, STRUCTURE NOT COLOR) and is what a Nevada trader really wears: the valley's ranch
country, the Strip's own western money (Binion's Horseshoe, the Golden Nugget), the runway's western years. Its geometry starts from the
gambler's hat (tools/bohemia_character_the_nine_enemies.py head_pieces, GAMBLER; he voted YES on it with the hired guns 11/21), a wider
brim rolled at the sides; its felt's material named 'hair' so the master rig's wear_by_material spares the dark up faces (the gambler's
loop 3). Not in the barber's random mix (it is the Caravans' mark).

## THE PLAN, IN ORDER (one ship, rule 441)
1. HATS 1 (tools/bohemia_character_hats_one.py): the table's cone line becomes ('DUST RANCHER HAT', 'rancher', (128, 110, 80)); a 'rancher'
   builder; SHAPE_NAME and LINES; the barber's book keeps 'rancher' out of the random mix (and the cone stays out: C3).
2. THE GANG: tools/bohemia_faction_outfits.py Caravans head 'HAT DUST RANCHER HAT' (the same in tools/bohemia_faction_fits.js 'brim');
   gates/faction_outfit_gate.js stays green (the Caravans' shape is a brim).
3. THE 8 MEN: tools/bohemia_character_the_company_dressed_remake.sh per man (person_caravans_0 to 7), then the packs, the traps in its
   header (11/11 and 11/14 records): clear every cache named for each man first; touch renders before packing after a git checkout.
4. faction_caravans: the thirteen's LOOKS 'Caravans' head and its hat builder; COMBAT's bodies and render for its fight sheet, the map's
   and the town's sets.
5. cast_widebrim (Old Tavo) and the Caravans' portrait face: a rancher, through their own tools.
6. The alpha's and the demo's wardrobe lines and slices/BOHEMIA_LOOK_CURRENT.html; the demo re-cut.
7. PROOF on a phone, upright and on its side, the alpha and the demo: the hall (the Caravans' men), the map (a Caravans party, the road
   gangs), a town, a fight with Caravans men in it: no cone; the gate's LEFT at zero and C1 turned to 'none at all'; the VOTE card shows
   each wearer before and after.

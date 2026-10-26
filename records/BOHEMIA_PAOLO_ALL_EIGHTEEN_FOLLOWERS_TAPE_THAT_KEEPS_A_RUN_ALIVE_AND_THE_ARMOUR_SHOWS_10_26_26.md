# PAOLO 10/26: ALL EIGHTEEN FOLLOWERS, TAPE THAT KEEPS A RUN ALIVE, AND THE ARMOUR HE WEARS SHOWS (LOCKED, rules 270, 271, 272)

## HIS WORDS (verbatim, voice to text, two messages)
"But yeah, I hope you've done this already but I'd like you need to do research on all the new in battle Brothers like the people I
can join your camp and like what they do to help you and shit while you just like like just your basic camp support and also like
reversal support you know like type shit so yeah and then I just feel like there's not enough duct tape repaired tool shit like to be
able to be bought or like loot in the world so like it feels like when my armor runs out like it's my runs over right now so I don't
know if we need to make it like I know selling it. You should make that more available, but yeah keep that in mind."
"Oh, and I don't have to you should already know this, but yeah, like the armor that I'm equipped with the web like the weapons and
and shield show I thought of the offhand ship, but like the good armor that I have on me, bro it doesn't show like if I have a police
whatever type of helmet like you already have so many I know it's all a bunch of a lot of placeholder cause we're gonna have to cook
up so much art for a lot of this shit but yeah keep that in mind like I know that I see it bro like this shit is not equipped or at
least visually shown"
('the new in Battle Brothers... people who join your camp' is the RETINUE, the followers; 'reversal support' reads as 'retinue
support'.)

## THE RESEARCH: BATTLE BROTHERS' RETINUE, ALL EIGHTEEN (the wiki copy, reference/library/grok/wiki, bb_all/*(Follower).txt)
| follower | what he does (the wiki) |
|---|---|
| The Agent | reveals the contracts and the events in towns before you get there |
| The Alchemist | turns beast parts into potions and bombs |
| The Blacksmith | repairs 20 percent faster, uses 20 percent fewer tools |
| The Bounty Hunter | more champions (+3 percent), and pays for their heads |
| The Brigand | shows some caravans on the map at all times, beyond sight |
| The Cartographer | pays 100 to 400 crowns for every place you find yourself, double for legendary ones |
| The Cook | provisions last 3 days longer (and on our side, +HP an hour, rule 226) |
| The Drill Sergeant | 20 percent more experience at level 1, 2 percent less each level after |
| The Lookout | sight radius +25 percent, more about footprints |
| The Minstrel | 15 percent more renown for everything, better tavern rumours |
| The Negotiator | more rounds of haggling on contracts, relations decay slower and mend faster |
| The Paymaster | wages 15 percent lower, desertion half as likely |
| The Quartermaster | carry 100 more ammunition, 50 more medicine and 50 more tools |
| The Recruiter | 10 percent less to hire, half-price tryouts, 2 to 4 more men in every town |
| The Scavenger | gathers bits from every battlefield: part of the ammo, tools and medicine used comes back |
| The Scout | travel 15 percent faster on any ground |
| The Surgeon | every injury heals a day sooner, and men struck down are likelier to live |
| The Trader | more trade goods to buy in every town |
Ours now (engine/bohemia_camp.js, RUN TWO's [the camp and the retinue]): six of them (scout, lookout, cook, paymaster, blacksmith,
surgeon). Twelve missing.

## WHY THE RUN DIES WITHOUT TAPE (coordinator, measured)
Tape is the repair tools (rule 209); armour is mended only with it (15 durability a roll, Battle Brothers'). The stall does not sell
tape (rule 265 fixes it), the loot carries none, and nothing brings any back from a fight. Once his armour is gone and his tape is gone,
the next fight is a wipe: the run is over.

## THE RULINGS
270. ALL EIGHTEEN FOLLOWERS JOIN THE CAMP, IN OUR SKIN
(a) Every one of Battle Brothers' eighteen followers exists in Bohemia, a person in the valley's own skin (the Blacksmith a man who
    welds car doors, the Scavenger a woman with a shopping bag who walks the battlefield, the Cartographer a man with a dead city's
    transit maps, the Brigand a man who still has a scanner on the old police band...: draft:true, WORDS may better them), doing what
    his does, with Battle Brothers' numbers through TUNING's table and the pace of rule 264.
(b) Each sits in the camp's picture at his spot doing his work (the cook at the grill, the blacksmith at the anvil...), hired the way
    the retinue is now, his place by the fire limited as Battle Brothers' is (rule 151's slots).
(c) THE GATE: all eighteen in the data file with their effects; hiring each changes the number it names (measured); each draws in the
    camp.
(d) CAMP TWO [all eighteen followers] (the camp's life; the six already built stay); TUNING NOTE (the numbers); WORDS NOTE (the
    names and the people); line 206.

271. TAPE THAT KEEPS A RUN ALIVE
(a) Tape comes from four places: every stall always (rule 265), the loot (the men he beats carry tape in their kit, and a fight drops
    some, scaled to the kills), the Scavenger (part of the tape used comes back after every fight), and his own salvage (scrap armour
    he loots can be broken down into tape at camp).
(b) THE NUMBER THAT MATTERS: on a typical run, the tape he can get (bought at a fair price plus looted) covers the armour a typical
    fight breaks, with some to spare; a run never ends because there is no tape to be had. ECONOMY and TUNING measure it on rolled
    runs.
(c) THE GATE: 30 rolled days of play, phone and computer: tape is buyable in every town every visit, the loot screen shows tape after
    most fights, the tape had equals or beats the tape his armour needed; scrap breaks down into tape at camp.
(d) RUN FOUR [tape in the loot] (the loot screen and the spoils); ECONOMY [tape income against armour wear] (the balance); CAMP NOTE
    (the scrap broken down at camp); line 207.

272. THE ARMOUR HE WEARS SHOWS ON HIM
(a) Everything a man wears is drawn on him, not only his weapon and shield: his helmet (a police riot helmet, a hard hat, a motorcycle
    helmet, a welder's mask...) and his body armour (a police vest, a car door strapped on, a plated jacket...), on the crew card, in
    the fight, at the map's close end and at camp, from the piece he has on (ONE ID, ONE WHOLE PERSON).
(b) PLACEHOLDERS FIRST, ART AFTER (his words: 'a lot of placeholder, we're gonna have to cook up so much art'): each armour and helmet
    CLASS gets a drawn piece in the rig's look now, so nothing he wears is invisible; each named piece gets its own art over the
    rounds (COOK). Headgear also follows the portrait rule (the third votes: portraits head only with head gear).
(c) THE GATE: put a police helmet and a vest on a man: both show on the crew card, in the fight and at camp, phone and computer; every
    armour and helmet in the shop draws on the man who wears it (no invisible class).
(d) CHARACTER [the armour he wears shows] (opened for it: the body and the clothes on the rig); COOK [the armour's art]; UI NOTE (the
    crew card's figure, rule 177); PORTRAIT NOTE (headgear on the face); line 208.

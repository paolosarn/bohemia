# 01 THE WORLD MAP (recall unless a source is cited)
GENERATION: a new map per campaign from a seed; a coastline, rivers, roads, forests, hills, swamps, snow
in the north, steppe/desert to the south (with Blazing Deserts). Settlements: villages (fishing, farming,
mining, lumber, hunting), towns, cities; each has a type, a set of buildings (market, tavern, temple,
armourer, weaponsmith, fletcher, taxidermist, kennels, barber, training grounds, harbour) and an ATTACHED
LOCATION or two that shapes its economy (a wheat farm, a fishing hut, a copper mine, a vineyard, an
orchard, a peat pit, a silk farm). Three noble houses each hold a third of the settlements; strongholds,
castles and manors are their seats. Enemy locations spawn in the wild: brigand hideouts, orc camps,
goblin camps, undead crypts, beast lairs, ruins with legendary loot; some grow and send raiding parties.
TRAVEL: one marker for the company. Click a point or a settlement and the company walks in real time
(pausable, 2x speed exists). Speed by terrain: roads fastest, plains, then forest and hills slower,
swamp slowest, snow slow; mountains impassable. Sight radius shrinks in forest and at night. NIGHT:
travel is slower, sight shorter, enemy parties harder to see, ambushes more likely; some enemies (undead)
are stronger at night. CAMPING: the company can camp anywhere to rest, heal and repair; a camp can be
attacked. TRACKS: every party leaves footprints (a different print per kind: human boots, orc feet, goblin,
beast paws, undead drag), fading with time, visible when close; following tracks is how you find or avoid.
SCOUTING: parties within sight are named by size ("a small band", "a large host") and strength badges;
you can see their banner and destination line. PATROLS: noble houses send patrols on roads; caravans move
between settlements and can be escorted or watched die.
TIME AND COST: a day passes as you travel; every day WAGES are paid (sum of the men's daily wage), FOOD is
eaten (each man eats; food spoils by type: bread days, cheese, dried fruit, salted meat weeks), TOOLS are
spent repairing damaged armour and weapons, MEDICINE is spent healing wounds. Running out: no food ->
morale drops and men starve; no crowns -> wages unpaid -> morale drops and men desert. Ambition: an
optional goal you choose (hire 12 men, reach 2,000 crowns, win a contract of difficulty X, defeat a
champion) with a small renown reward.
RENOWN AND RELATIONS: renown grows with fights won and contracts done; higher renown -> better contract
pay and harder contracts offered, and better recruits appear. Relations per noble house (and per
settlement) rise with contracts done for them and fall with failed or refused contracts and with attacking
their caravans; hostile houses hunt you, allied ones give discounts.
SETTLEMENT SITUATIONS (temporary modifiers): "well supplied", "trade route ambushed", "raided", "plague",
"famine", "festival", "high demand for X", "greenskins nearby", "well protected". Your actions change them:
clear the camp, the ambush situation ends and prices fall.
CRISES (late-game arcs): THE WAR OF THE NOBLE HOUSES (houses fight; contracts to sabotage, assault, hold;
settlements change hands), THE GREENSKIN INVASION (orc and goblin hosts sweep in; settlements burn),
THE UNDEAD SCOURGE (undead spread from the south; ancient dead legions), later HOLY WAR (Blazing Deserts)
and others. A crisis changes what every town needs and what contracts appear.
LEGENDARY LOCATIONS: the Goblin City, the Kraken, the Sunken Library, the Ijirok, the Black Monolith,
the Witch Hut, the Rachegeist; each a named fight with a named reward.
RENDERING (sourced 9/28, DIRECTION [bb density]; records/BOHEMIA_BB_DENSITY_THE_MAP_FLOOR_9_28_26.md): the
world map is HEXAGONAL TILES, each with its own painted texture and decals/entities on top (locations,
roads, mountains, forests); hand-painted raster, not pixel art; sprites packed at their own pixel size by
the mod kit's brusher; rendered at the screen's native resolution with separate UI-scale and scene-scale
sliders. So: one painted pixel per screen pixel (2,073,600 on a 1080p screen). Icon, banner, road and hex
sizes in pixels are NOT yet measured (the sources were egress-blocked).
PARTIES AT ONCE (sourced 9/28, FACTIONS [home bases]; records/BOHEMIA_HOME_BASES_ROUND_TWO_THE_MARKER_LIST_9_28_26.md;
search snippets only, the dev blog, wiki and Steam pages are egress-blocked so none was read in full): THERE IS NO
PUBLISHED FIXED COUNT of roaming parties at once. It is emergent. EVERY LOCATION, settlements and hostile camps alike,
"buys" parties out of its own resources (each with an agenda, AI, strength and troop mix) and sends them out;
smaller locations send fewer and less often; a camp is weaker until its party returns; players report a camp
sending a group every one to two days. A typical map is about 17 settlements split among three houses (6/6/5 up to
10/5/2), plus the hostile locations, each of which also sends parties. A mod's "24 and 40" is a warband's SIZE
(men in a roaming party versus in a camp), not a count of parties. SO: do not size our parties against a BB number;
there is none. Size them by what each home base can pay for and send.

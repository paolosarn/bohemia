# PAOLO 10/26: YOU SEE YOUR MEN AT CAMP, EACH DOING WHAT HE NEEDS, AND YOU CAN CAMP IN A TOWN (LOCKED, rule 259; sharpens 257)

## HIS WORDS (verbatim, voice to text)
"Bro cat mode is so important like if I enter camp mode and time is passing by I should see my character on all my my whole team
honestly, like if they're healing like depending on how much health they have left like depending on their stats brother repairing
their armor or they're healing up type shit I should be seeing that depending on their stats and what's happening or maybe they're
helping other members if they're healthy you know, but like I should see my main character and the rest of his team in the camp as
time passes on like camping it out type shit like that's super important bro and I don't know if you have it set up so like if I'm
in a settlement, I can't camp. I think that's so stupid bro so just keep that in mind yeah"
('cat mode' is 'camp mode'.)

## WHAT IS THERE NOW (coordinator, measured on main)
- slices/BOHEMIA_CITY_WORLD.html campOnMap(): camp is refused while the settlement screen is open, so he CANNOT camp in a town.
- campMake() opens the settlement screen's frame in 'camp mode' ('YOUR CAMP'): a screen over the map, not the live map of rule 257.
- Nothing draws his men at the camp doing anything.

## HOW BATTLE BROTHERS DOES IT (rule 33; recall, marked)
Camping is a toggle on the world map: the party icon becomes a tent, time runs, the men heal and repair. You see none of them; you
cannot camp inside a town. Both are where we go past it, his words.

## THE RULING (rule 259)
(a) HE SEES HIS MEN AT CAMP: while camp runs, his main character and every man of his company are at the camp, each doing what his
    state says, changing as the hours pass:
    - badly hurt (low hit points, a fresh injury): lying down, bandaged, a friend kneeling by him;
    - hurt: sitting by the fire, binding his own cut, resting;
    - armour broken: working on it (a hammer on the car door, tape round the plate), faster with more tape;
    - healthy: helping the hurt, cooking, cleaning a gun, keeping watch, sleeping at night;
    a man who heals gets up and joins the others; his main character is always there. In the Crashbox HBO look (rule 246(e)).
(b) WHERE HE SEES IT: on the map at the camp's spot, the camera easing in to the close end when camp is made (rule 258), pinch out to
    watch the city (rule 257); and behind the crew screen (rule 239). Never a screen that hides the map.
(c) HE CAN CAMP IN A TOWN: the HEAL/CAMP button works in a settlement too: the company rests in the town (a lot, a yard, a room),
    the town screen stays, his men are shown resting in the town's own picture doing the same camp acts (rule 218's crew in town),
    time runs at camp speed and they heal at the camp's rates; the town's life and his jobs' clocks go on. The clinic stays the faster
    way to heal (rule 241).
(d) THE GATE: make camp on the map and in a town, phone and computer, with a crew of a hurt man, a man with broken armour and a
    healthy man: each plays his act; the hurt one gets up when healed; the main character is in the picture; camp works in the town;
    the map is never covered by a camp screen.
(e) CAMP [you see your men at camp] (who does what from his condition, camping in a town, campOnMap's town refusal gone, the camp
    screen off the map); ANIMATION [the camp's acts]; NOTEs RUN (the camp drawn at the spot, the camera eases in), RUN THREE (the camp
    acts in the town's picture), UI (239's background uses the same acts); line 186; EYES checks.

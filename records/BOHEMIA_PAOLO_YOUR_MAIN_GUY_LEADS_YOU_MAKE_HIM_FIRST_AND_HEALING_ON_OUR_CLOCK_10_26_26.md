# PAOLO 10/26: YOUR MAIN GUY LEADS THE WALK, YOU MAKE HIM BEFORE YOU START, AND HEALING RUNS ON OUR CLOCK (LOCKED, rules 263, 264)

## HIS WORDS (verbatim, voice to text)
"Also main thing bro, like the character that's walking through Bohemia is not the highest level or the main character of the of the
origin you know so that's not what I'm saying bro so keep that in mind and also before you start Bohemia should always be able to
customize your main guy type shit like yeah so that and it's probably gonna use a lot of the same UI stuff as when you go to the
barber or whatever so yeah keep that in mind"
"Also, please do research on how long it takes battle Brothers how long it takes to make sure you get healed and your equipment gets
repaired because keep in mind the timing that's natural in battle. Brothers is not the same natural as it is in Bohemia. I feel like
for one day's worth of action bro. I felt like because the quest are so close kind of to the settlements and there's like by the
time you're walking and getting shit done, bro I feel like one day was equal to like three or four days in battle Brothers you know
so we gotta keep that in mind like that sort of timing means some of the things have to be a lot quicker for us or we gotta be able
to like quickly care about healing more often like having a camp set up on whatever tile you're on type shit so keep that in mind"

## WHAT IS THERE NOW (coordinator, measured on main)
- The map's party (slices/BOHEMIA_CITY_WORLD.html mapCrewLooks, __THE_MARKER_IS_YOUR_CREW__) draws the company behind a lead figure
  that is the default 'you' body: every man flagged main is skipped, so the origin's own main character never walks at the front.
- engine/bohemia_barber.js (the town's barber) and the face maker (HE CAN BUILD HIS OWN FACE, 8/28) exist; a new game has no step to
  make the main character.
- Healing (CAMP 72835dfb, engine/bohemia_condition.js): 1 hit point an hour marching, 2 camped; armour 3 an hour, twice camped.

## HOW BATTLE BROTHERS DOES IT (rule 33; recall, marked; TUNING verifies against the wiki copy)
No character creation: you pick an origin, a company name and a banner. Hit points come back over hours on the world map; armour is
mended with Tools over time; camping speeds both; injuries take their days. A fight is usually a day or more of travel from the last.

## THE RULINGS
263. YOUR MAIN GUY LEADS THE WALK, AND YOU MAKE HIM BEFORE YOU START
(a) The figure walking at the front of his party on the map (and at the close end, rule 258) is HIS MAIN CHARACTER: the origin's own
    main man as he is, his face, his body, his gear; never a default body, never the highest-level man.
(b) BEFORE THE GAME STARTS HE MAKES HIS MAIN GUY: after the origin is picked and before the intro (rule 236), a screen to customise
    the main character, built from the barber's and the face maker's own parts (the face, the hair, the skin, the build, the name),
    the same look and taps (rule 249: one tap selects, two taps take). Every origin's main man is the default, so a tap on GO skips
    it. The made man is the one in the intro, the crew screen, the map and the fight (ONE ID, ONE WHOLE PERSON).
(c) THE GATE: a new game for three origins, phone and computer: the maker screen comes before the intro; what he picks is the man in
    the intro, the crew screen, at the front of the map's party and in the fight; skipping keeps the origin's main man; the map's
    lead figure is the main man in every case.
(d) RUN THREE [make your main guy] (it owns the start, rule 236) with the barber's parts; RUN [your main guy leads the walk] (the
    map's party); NOTEs PORTRAIT and CHARACTER (the face and the body he picks are the ones drawn everywhere).

264. HEALING RUNS ON OUR CLOCK, NOT BATTLE BROTHERS'
(a) Research first (TUNING): how long Battle Brothers takes to heal a company's hit points, mend its armour and heal its injuries
    after a typical fight, in world-map hours, and how long a typical gap between its fights is; cited.
(b) OUR DAY IS DENSER: his read is that one of our days holds three to four of Battle Brothers' days of action (the jobs sit close to
    the towns). So our healing and mending per map hour are scaled so that the RATIO of 'time to heal from a typical fight' to 'time
    between fights' matches Battle Brothers', measured on our real trips (WORLD's job distances), not copied hour for hour.
(c) Camp is always at hand to care for it more often: on any tile, in a town (rule 259(c)), quick to make and break.
(d) THE GATE: on rolled trips, a typical fight's wounds and broken armour heal in our map hours at the same share of the gap to the
    next job as Battle Brothers'; the numbers in TUNING's one table, read by CAMP's condition; the bars of rule 261 show it.
(e) TUNING [healing on our clock] (research and the numbers); CAMP applies them (a NOTE); WORLD NOTE (the trips' lengths); lines 191
    to 193; EYES checks.

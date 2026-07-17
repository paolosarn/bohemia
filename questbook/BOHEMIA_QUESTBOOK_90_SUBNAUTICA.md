# BOHEMIA QUESTBOOK — DEEP DIVE 90: WE ACCIDENTALLY MADE A HORROR GAME / THE ENEMY IS A FEELING (Subnautica)
Full teardown, the whole enchilada: the no-weapons rule they refused to break, the horror they built by
accident and then engineered on purpose, the hand-crafted world in a procedural genre, OXYGEN as the clock
that turns exploration into dread, the radio distress calls that deliver a story to a storyless game, no map
(landmarks + positional audio only), the six catalogued fears, the honest flaws, and Bohemia ports. Six
million copies, five years, multiple near-bankruptcies. STARTLINGLY relevant to our PACIFIST LAW, our ART
PHILOSOPHY, our tile/biome pipeline, + our despair-with-a-thread-of-hope tone. Unknown Worlds Entertainment.
Reference only; Paolo does not read it. No Bohemia quest written here.

Game: Subnautica (Unknown Worlds, 2014 EA → 2018). Your starship explodes; you run for an escape pod; you
crash on planet 4546B, which is 99% ocean. No map. No real weapons. Just you, an oxygen meter, and the
water. A running joke among players: "IF YOU DON'T ALREADY HAVE THALASSOPHOBIA, OR AN INTENSE FEAR OF DEEP
WATER, THE GAME WILL GIVE IT TO YOU."

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- THEY SET OUT TO MAKE A GAME WHERE YOU DON'T KILL THINGS, AND ACCIDENTALLY MADE THE SCARIEST GAME OF THE
  DECADE (the origin, and it's our PACIFIST LAW's best case study): Unknown Worlds, in their own words —
  "**WE DIDN'T SET OUT TO MAKE A SCARY GAME** when we started developing Subnautica five years ago. **WE
  WANTED TO MAKE AN OPEN-WORLD UNDERWATER GAME WHERE YOU DIDN'T KILL CREATURES.** Yet, some of our biggest
  fans tell us we **'ACCIDENTALLY MADE A HORROR GAME.'** How did this happen? It turns out, THERE ARE A LOT
  OF PRIMAL PSYCHOLOGICAL FEARS AT PLAY... **WE DIDN'T HAVE TO WORK TOO HARD TO TRIGGER A LOT OF ADRENALINE
  AND CHILLS.** Some of it happens UNINTENTIONALLY due to innate fears that many of us have. **ONCE WE SAW
  THESE PSYCHOLOGICAL FACTORS AT WORK, WE FOCUSED ON THEM TO CREATE THRILLS.**"
  - Removing the gun didn't remove the threat. It CREATED one. When you can't kill it, the thing in the
    dark is infinite (cf. our PACIFIST LAW + combat dial; the fear that comes from the missing weapon).
- THEY HELD THE LINE WHEN PLAYERS DEMANDED GUNS (the creative-direction lesson — direct for Paolo): "When
  some players on the interwebs started clamouring for actual weapons, **UNKNOWN WORLDS STUCK TO THEIR 'NO
  KILLING THE KILLER FISH KILLING PLAYERS' RULE**, and instead **IDENTIFIED THAT FAUNA BEHAVIOUR HAD TO BE
  TWEAKED TO BE LESS IRRITATING.** As someone interested in game development, I think **THAT'S A NEAT WAY
  TO BALANCE PLAYER FEEDBACK WITH CREATIVE VISION.**"
  - They took the FEEDBACK ("this is frustrating") and rejected the SOLUTION ("give me a gun"), then fixed
    the actual problem underneath. That's the whole craft of hearing players without obeying them (cf. our
    verdict workflow + Paolo-decides law; feedback is data, not instructions).
- THE ENEMY IS A FEELING, AND THEY CATALOGUED IT (the design method): they wrote up the SIX FEARS the game
  exploits, including thalassophobia ("an intense and persistent fear of the sea or of sea travel... fear of
  being in LARGE BODIES OF WATER AND BEING FAR FROM LAND, both of which are a mainstay of the game").
  - And the biggest one: "**POSSIBLY THE BIGGEST OR MOST FUNDAMENTAL FEAR IS THE FEAR OF THE UNKNOWN**,
    which Subnautica strives to portray AT ALL TIMES. Creating the feeling of unknown and discovery is so
    important to our company that **IT'S IN OUR COMPANY NAME ('UNKNOWN WORLDS'). WE STRIVE TO PRESERVE THE
    FEELING THAT YOU NEVER KNOW WHEN YOU'VE SEEN EVERYTHING, BEEN EVERYWHERE OR HAVE TRULY 'COMPLETED' THE
    GAME. DOING SO WOULD BREAK THAT INTOXICATING SHIVER OF THE UNKNOWN.**"
  - They named the emotion, then built the systems to produce it (cf. our ART PHILOSOPHY + FACTORY LAW;
    design the FEELING, not the feature).

===============================================================================
## 1. THE ARCHITECTURE (dread, engineered)
===============================================================================

### OXYGEN IS THE CLOCK THAT MAKES EXPLORATION TERRIFYING (the single best mechanic here)
- "In addition to health, hunger and thirst, exploring the depths introduces a new parameter to keep track
  of: **OXYGEN. MAKING SURE TO HAVE ENOUGH AIR TO VENTURE BELOW BUT ALSO TO MAKE IT BACK TO THE SURFACE
  BECOMES CRUCIAL.**"
- Every other survival game's clock (hunger, thirst) is a chore. Oxygen is a HALFWAY RULE: every meter down
  costs you two — one to descend, one to return. Curiosity is directly, mathematically taxed. The deeper the
  find, the smaller the margin (cf. our survival accounting + THREE CURRENCIES; the resource that makes
  going further a math problem).
### NO MAP. LANDMARKS AND POSITIONAL AUDIO (the navigation stance)
- "Even more so **IN A GAME WITHOUT A MAP, WHICH LEAVES THE PLAYER TO USE LANDMARKS AND POSITIONAL AUDIO TO
  NAVIGATE** their alien surroundings."
- And they built the landmark IN: "The wreck of the spaceship **AURORA SERVES AS A FAMILIAR LANDMARK** in
  Subnautica 1 that helps you from getting lost." A burning, irradiated ship on the horizon is both the
  plot and the compass (cf. Morrowind Q37, Outward Q87, our HD tile repo + MAP LAW; the landmark discipline
  that no-map design REQUIRES).
### HAND-CRAFTED, IN A GENRE THAT PROCEDURALLY GENERATES (the production decision — direct for us)
- "**RARE FOR A SURVIVAL GAME, UNKNOWN WORLDS CHOSE TO FOCUS ON ATMOSPHERE AND NARRATIVE, DECIDING TO GO
  WITH A BRILLIANTLY HAND-CRAFTED LANDSCAPE INSTEAD OF THE GENRE'S USUAL, TIRED PROCEDURAL GENERATION.**"
- "Survival games tend to go with procedural generation in order to (lazily) create 'new' content, but **YOU
  CAN'T TEACH AN ALGORITHM ART DIRECTION.**"
- The compromise they DID make: "the overall environment of the game is HARDCODED, but **THE RESOURCE NODES
  AND ITEMS YOU FIND AREN'T.**" Hand-built world, procedural contents. Forbes: "Subnautica's atmosphere is
  right up there with **SILENT HILL 2 and BIOSHOCK**" (cf. our HD tile repo + prefab factory + MAP LAW;
  hand-authored space, generated stuff).
### THE STORY ARRIVES BY RADIO, LATE, AND IT PULLS YOU FORWARD
- "Contrary to survival storylines like Frostpunk, here **THE NARRATIVE IS INTRODUCED A WHILE AFTER THE
  INITIAL STAGE OF THE GAME VIA DISTRESS CALLS.** Investigating these signals will lead to acquiring **DATA
  ENTRIES**, which both shed light on the events and **REINTRODUCE THE HUMAN ELEMENT INTO AN OTHERWISE
  LONELY GAME EXPERIENCE. BY LEARNING ABOUT THE FATE OF THOSE WHO CAME BEFORE, THE PLAYER WILL UNCOVER THE
  PLANET'S MANY MYSTERIES.**"
- GamesRadar: "your escape pod's radio is **A CONSTANT SOURCE OF SIDE-QUESTS** that piece together a
  narrative throughline, maintaining the game's forward momentum by **DRIP FEEDING** contextual information...
  **JUST WHEN YOU MIGHT BE LOST FOR THINGS TO DO, IT'LL START PINGING OFF WITH ANOTHER MESSAGE** from a
  potential survivor of the crash, and you'll jet off towards uncharted waters WITH RENEWED PURPOSE."
- A quest system that is one object, and it never breaks the world (STARTLINGLY our [READ] +
  recorded-vs-unrecorded + AMALGAMATION + quest factory; the dead talking to you through a radio).
### PROGRESSION IS ACCESS, NOT POWER (the structural inversion)
- "**POSSIBLY THE BIGGEST DESIGN DIFFERENCE** in Subnautica compared to other survival games is in the form
  of progression. In most survival games, there really isn't a sense of true progression... **HERE, THE
  GAME WANTS YOU TO BECOME SUSTAINABLE, SO THAT YOU CAN BETTER EXPLORE THE BEAUTIFULLY DESIGNED WORLD.
  PROGRESSION IS ALL ABOUT FINDING THE RESOURCES YOU NEED TO BUILD AN EVER EXPANDING NUMBER OF OPTIONS.**"
- You never get strong. You get DEEPER. Every upgrade is a depth rating (cf. Outward Q87, Arcanum's XP flaw
  Q86, our standing + city-builder; progression as reach).
### SILENCE IS THE SOUNDTRACK
- "Another triumph of Subnautica is its sound design – **OR RATHER THE LACK OF SOUND – WHERE THE ENDLESS
  SILENCE OF THE DEPTHS HITS HARDER THAN ANY SOUNDTRACK COULD. EVEN WHEN THE MUSIC DOES PRESENT ITSELF
  IN-GAME, IT SERVES NOTHING MORE THAN TO MAKE THOSE SILENT MOMENTS MORE DREAD-INDUCING.**"
- And the scan-the-terrain moment: "as the faint outline extends into the abyss **YOU GET A TRUE SENSE OF
  HOW ENORMOUS THIS WORLD IS AND HOW TINY YOU ARE. WATCHING THE EMPTY VOID REVEAL ITSELF WAS HAUNTING**"
  (cf. our music repo + master volume-balance pass; music as the thing that makes silence louder).
### IT CURED PEOPLE'S PHOBIAS (the payoff nobody expects)
- "We've received **MANY MESSAGES FROM PLAYERS THAT STARTED OFF WITH ONE OR MORE OF THESE PHOBIAS BUT WHO
  THEN CONQUERED THEM AFTER 5-10 HOURS OF PLAYING. SOME OF THEM HAVE EVEN GONE ON TO GET THEIR SCUBA
  CERTIFICATION AND HAVE FALLEN IN LOVE WITH THE UNDERWATER WORLD**, which is quite gratifying for the dev
  team."
- A player's account: "When I finally reached the end of Subnautica, and my escape rocket was ready for
  departure, **IT FELT SOLEMN. I DIDN'T WANT TO LEAVE this astonishing world, despite all the terrors
  lurking within. IT WAS STARTING TO FEEL LIKE HOME.** I grew to know its inhabitants."
- The game's arc is the PLAYER'S arc: terror → competence → affection → grief at leaving (STARTLINGLY our
  ART PHILOSOPHY + despair-with-a-thread-of-hope; the dread that resolves into love).

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- THE BACK HALF IS A GRIND: "for the first half of the game, I was really enjoying my time... **UNFORTUNATELY,
  ENTERING THE BACK HALF OF THE GAME WAS WHEN THINGS BEGAN TO GO SOUTH. Your mission to get off the planet
  will lead you into deeper waters WHICH REQUIRE A LOT OF CONSTRUCTION AND GRINDING. NO MATTER HOW ADVANCED
  YOU GET AT THE GAME, YOU CANNOT ESCAPE THE NEED FOR BASIC RESOURCES, NOR IS THERE AN EASY WAY TO MITIGATE
  IT.**" A user: "can be a bit material grindy at the very very end." LESSON (ours): a progression built on
  ACCESS still needs its late game to stop taxing you with early-game chores.
- THE PART OF THE GAME THAT ISN'T THE CORE IDEA IS EMBARRASSING: "swimming... is a **SMOOTH AND BREEZY
  JOY, BUT THINGS IMMEDIATELY REGRESS ABOVE WATER**, which controls more like a **SLUGGISH AND SUBSTANDARD**
  first-person exploration game. Subnautica's terra firma **LOOKS A LOT WORSE** than its pelagic
  counterpart, too, where the **FLAT, UNGAINLY TEXTURES SUDDENLY BRING THE GAME'S PRODUCTION VALUES DOWN
  ALMOST TO STEAM SHOVELWARE QUALITY.**" LESSON (direct): whatever isn't your core loop will show its seams
  brutally — either polish it or CUT it.
- FIVE YEARS, $10M, AND MULTIPLE NEAR-DEATHS: "the final product **TOOK ALMOST FIVE YEARS TO COMPLETE – AT
  THE COST OF 10 MILLION DOLLARS AND MULTIPLE BANKRUPTCY RISKS.** To counter the high production expenses,
  the studio resolved to **SELL THE GAME IN EARLY ACCESS.**" LESSON: hand-crafting instead of generating is
  a REAL cost, and it nearly killed them; it also made the game (our HD tile repo is the same bet, and our
  FACTORY LAW is how we afford it).
- THE SEQUEL PROVED THE FORMULA DOESN'T TRAVEL: on Subnautica 2 — "as far as the (single player) survival
  experience goes, **SN2 IS JUST MORE OF SN1, JUST ON ANOTHER PLANET, WITH ANOTHER PLOT.** So I ask that
  question again: '**WHAT'S THE POINT OF THIS SEQUEL?' IF THE ANSWER IS 'MORE OF THE SAME,' IS THAT ENOUGH
  TO JUSTIFY A NEW WORK OF ART?**" LESSON: the magic was the FIRST TIME you didn't know what was down
  there — a fear-of-the-unknown design has a fundamental replay problem (relevant to our roguelite fold).
- IT'S A ONE-NOTE WORLD BY DEFINITION: a (joking but real) user review — "**TOO MUCH WATER.** Nearly every
  objective requires swimming... At times, I found myself asking, '**COULD THERE PERHAPS BE LESS WATER?**'
  The game responded by adding a deeper ocean biome." LESSON: total commitment to one idea is why it works
  AND why it's not for everyone (the Outward lesson Q87, repeated).

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. THEY REMOVED THE GUN AND ACCIDENTALLY BUILT HORROR: "we wanted to make an open-world underwater game
    **WHERE YOU DIDN'T KILL CREATURES**"; fans told them they'd "accidentally made a horror game" — because
    what you can't kill is infinite (cf. our PACIFIST LAW).
W2. THEY HELD THE LINE WHEN PLAYERS DEMANDED WEAPONS: kept the "no killing the killer fish" rule and
    **tweaked fauna behaviour instead** — took the feedback, rejected the requested solution (cf. our
    verdict workflow + Paolo-decides law).
W3. THEY NAMED THE FEELING, THEN ENGINEERED IT: catalogued the six fears, found they'd triggered them by
    accident, and "**ONCE WE SAW THESE PSYCHOLOGICAL FACTORS AT WORK, WE FOCUSED ON THEM**" (cf. our ART
    PHILOSOPHY).
W4. OXYGEN TAXES CURIOSITY, MATHEMATICALLY: every meter down costs two — one to go, one to get back; the
    clock makes wanting to see more a calculation (cf. our survival accounting).
W5. NO MAP, AND A BURNING SHIP FOR A COMPASS: landmarks and positional audio only, with the wrecked Aurora
    on the horizon as both plot and navigation (cf. Morrowind Q37, our HD tile repo).
W6. HAND-CRAFTED WORLD, PROCEDURAL CONTENTS: "you can't teach an algorithm art direction" — the geometry is
    authored, the resource nodes aren't (cf. our tile repo + prefab factory).
W7. THE STORY ARRIVES BY RADIO, JUST WHEN YOU'RE LOST: distress calls drip-feed a plot into a storyless
    game — "just when you might be lost for things to do, it'll start pinging off" (cf. our quest factory +
    [READ]).
W8. PROGRESSION IS DEPTH, NOT POWER: every upgrade is ACCESS — "the game wants you to become sustainable,
    **so that you can better explore**" (cf. Outward Q87, our standing).
W9. THE MUSIC EXISTS TO MAKE THE SILENCE WORSE: "the endless silence of the depths hits harder than any
    soundtrack could... **the music serves nothing more than to make those silent moments more
    dread-inducing**" (cf. our music repo).
W10. THE ARC IS TERROR → COMPETENCE → LOVE: players cured their real phobias and got scuba certified; one
     finished the game and "**didn't want to leave... it was starting to feel like home**" (cf. our ART
     PHILOSOPHY + despair-with-hope).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — the missing weapon + the feeling you engineer
===============================================================================
Subnautica is our PACIFIST LAW's best real-world case study (they removed the gun and the world got
SCARIER), our HD-tile-repo bet validated by a studio that nearly went bankrupt making the same call, and a
masterclass in naming an emotion and then building machinery to produce it.
- W1/W2 (they removed the gun and accidentally built horror + they held the line when players demanded
  weapons — our PACIFIST LAW + Paolo-decides law): the top port, and the most reassuring thing in this
  teardown. Unknown Worlds set out to make "an open-world underwater game WHERE YOU DIDN'T KILL CREATURES"
  and produced one of the scariest games ever made BY ACCIDENT — because a threat you cannot kill has no
  ceiling. Our Pacifist Law isn't a limitation, it's a horror engine: the AMALGAMATION, the NETWORK, the
  factions are all scarier if the dynasty's answer can't be "shoot it." And W2 is the craft lesson for
  Paolo directly: when players demanded guns, Unknown Worlds KEPT THE RULE and fixed the real problem
  (fauna behaviour was irritating, not under-lethal). Feedback is DATA, not instructions — that's our
  verdict workflow's whole spine (ties our PACIFIST LAW + AMALGAMATION + faction web + combat dial +
  verdict workflow + Paolo-decides law + ART PHILOSOPHY, Undertale Q28, Death Stranding Q89; a top-tier port).
- W3/W9/W10 (name the feeling then engineer it + music makes silence worse + terror → competence → love —
  our ART PHILOSOPHY + music repo): bank all three as a tonal package. (a) Unknown Worlds wrote down the SIX
  FEARS and built systems to produce them; our ART PHILOSOPHY should be that explicit about what emotion
  each system exists to make. (b) Their sound thesis is directly usable for our 103-song repo and our
  master volume-balance pass: "THE MUSIC SERVES NOTHING MORE THAN TO MAKE THOSE SILENT MOMENTS MORE
  DREAD-INDUCING." Music as the thing that makes silence LOUDER. (c) And the arc is our
  despair-with-a-thread-of-hope stated as a player journey: terror, then competence, then AFFECTION — a
  player finished it and "didn't want to leave... IT WAS STARTING TO FEEL LIKE HOME." Our Vegas should end
  up feeling like home (ties our ART PHILOSOPHY + music repo + master volume-balance pass + district +
  despair-with-a-thread-of-hope + fold).
- W4/W8 (oxygen taxes curiosity + progression is DEPTH, not power — our survival accounting + standing):
  STEAL the oxygen structure. It's the best survival clock in the genre because it's a HALFWAY RULE: every
  meter down costs two, so curiosity is mathematically taxed and every discovery shrinks your margin. Our
  MEDICINE/ELECTRICITY/RESOURCES should have at least one clock with that shape — a run into the valley
  that costs you double, so going further is always a calculation you can lose. And pair it with W8: our
  progression should be ACCESS, not power — every upgrade unlocks a DEPTH (a district, a tier, a distance),
  which fits our standing-as-spine, our city-builder, and answers Arcanum's XP-curve flaw (Q86) the same way
  Outward (Q87) does (ties our THREE CURRENCIES + survival accounting + standing + city-builder + district +
  logistics + fold + Pacifist Law).
- W6 (hand-crafted world, procedural CONTENTS — our HD tile repo, validated): the production port. In a
  genre that procedurally generates everything, Unknown Worlds hand-built the entire seabed because "YOU
  CAN'T TEACH AN ALGORITHM ART DIRECTION" — and shipped the best-looking survival game ever made, at the
  cost of five years, $10M, and multiple near-bankruptcies. But note the SPLIT they used: the WORLD is
  hardcoded, the RESOURCE NODES AND ITEMS AREN'T. That's exactly our architecture — Paolo authors the map
  (MAP LAW), the FACTORY generates the contents (tiles, props, prefabs, events). Our 8,674-tile HD repo IS
  this bet, and our FACTORY LAW is how we afford what nearly killed them (ties our HD tile repo + prefab
  factory + street generation + district + MAP LAW + FACTORY LAW + ART PHILOSOPHY).
- W5 (no map, and a burning ship for a compass — our tile repo + landmark discipline): bank it, with the
  warning attached. Subnautica has NO MAP: you navigate by landmarks and positional audio, and the wrecked
  AURORA burns on the horizon as both the plot and the compass. That's the third teardown in a row (Outward
  Q87, Ultima VII Q83) saying the same thing: NO-MARKER NAVIGATION REQUIRES LANDMARK DISCIPLINE. If we ever
  go Morrowind-style directions (Q37), our tile repo + variation pipeline has to produce places that look
  like THEMSELVES — and our Vegas has real landmarks built in (ties our HD tile repo + variation + district +
  VEGAS GEOGRAPHY + MAP LAW + Morrowind Q37).
- W7 (the story arrives by radio, exactly when you're lost — our quest factory + [READ]): STEAL the device.
  Subnautica's entire quest system is ONE OBJECT: a radio in your escape pod that pings with distress calls
  from people who crashed before you, drip-feeding a story into a game that has none, and "JUST WHEN YOU
  MIGHT BE LOST FOR THINGS TO DO, IT'LL START PINGING OFF." Investigating them yields DATA ENTRIES that
  "REINTRODUCE THE HUMAN ELEMENT INTO AN OTHERWISE LONELY GAME" by "LEARNING ABOUT THE FATE OF THOSE WHO
  CAME BEFORE." Punk — that is our AMALGAMATION and our [READ] with the serial numbers filed off: the dead
  talking to you through infrastructure, and the mystery IS their fate. And mechanically it's a pacing valve
  for our quest factory: an idle-detector that pushes a thread when the player stalls (ties our AMALGAMATION
  + [READ] + recorded-vs-unrecorded + quest factory + electricity currency + district + Network, Project
  Zomboid's dying broadcasts Q88).
- FLAWS (bank HARD): (a) a progression built on ACCESS still needs its late game to stop taxing you with
  early-game chores — SN's back half "requires a lot of construction and GRINDING... NO MATTER HOW ADVANCED
  YOU GET, YOU CANNOT ESCAPE THE NEED FOR BASIC RESOURCES" (our survival accounting + act pacing); (b)
  WHATEVER ISN'T YOUR CORE LOOP WILL SHOW ITS SEAMS BRUTALLY — SN's land sections drop "almost to Steam
  shovelware quality"; polish it or cut it (our frame-locked building set + scope discipline); (c)
  hand-crafting is a REAL cost that nearly killed a studio — and it's still the right call, which is why
  FACTORY LAW exists; (d) a fear-of-the-unknown design has a REPLAY PROBLEM ("SN2 is just more of SN1... is
  that enough to justify a new work of art?") — directly relevant to our roguelite fold: our second run
  can't rely on mystery, it has to rely on the WORLD REMEMBERING (Nemesis Q48, our persistent consequence);
  and (e) total commitment to one idea is why it works AND why it's not for everyone ("could there perhaps
  be less water?") — the Outward lesson (Q87) again, and Paolo's already made that call.

## SOURCES
PlayStation Blog (Unknown Worlds) "The 6 fears you'll need to conquer in survival adventure Subnautica" —
the developers in their own words ("**WE DIDN'T SET OUT TO MAKE A SCARY GAME** when we started developing
Subnautica five years ago. **WE WANTED TO MAKE AN OPEN-WORLD UNDERWATER GAME WHERE YOU DIDN'T KILL
CREATURES.** Yet, some of our biggest fans tell us we '**ACCIDENTALLY MADE A HORROR GAME**.' How did this
happen? It turns out, there are a lot of PRIMAL PSYCHOLOGICAL FEARS at play in the game. **WE DIDN'T HAVE TO
WORK TOO HARD TO TRIGGER A LOT OF ADRENALINE AND CHILLS.** Some of it happens UNINTENTIONALLY due to innate
fears that many of us have. **ONCE WE SAW THESE PSYCHOLOGICAL FACTORS AT WORK, WE FOCUSED ON THEM TO CREATE
THRILLS**," thalassophobia — "an INTENSE AND PERSISTENT FEAR OF THE SEA or of sea travel... includes fear of
being in LARGE BODIES OF WATER AND BEING FAR FROM LAND, both of which are a mainstay of the game," "**POSSIBLY
THE BIGGEST OR MOST FUNDAMENTAL FEAR IS THE FEAR OF THE UNKNOWN**, which Subnautica strives to portray AT ALL
TIMES. Creating the feeling of unknown and discovery is so important to our company that **IT'S IN OUR
COMPANY NAME ('UNKNOWN WORLDS'). WE STRIVE TO PRESERVE THE FEELING THAT YOU NEVER KNOW WHEN YOU'VE SEEN
EVERYTHING, BEEN EVERYWHERE OR HAVE TRULY 'COMPLETED' THE GAME. DOING SO WOULD BREAK THAT INTOXICATING
SHIVER OF THE UNKNOWN**," "so why would anyone want to play a game that could trigger all these fears? IT'S
THE SAME REASON PEOPLE RIDE ROLLER-COASTERS, GO SKY-DIVING AND WATCH HORROR MOVIES," and "we've received
**MANY MESSAGES FROM PLAYERS THAT STARTED OFF WITH ONE OR MORE OF THESE PHOBIAS BUT WHO THEN CONQUERED THEM
AFTER 5-10 HOURS OF PLAYING. SOME OF THEM HAVE EVEN GONE ON TO GET THEIR SCUBA CERTIFICATION**"); Game
Studies (Evans) "Too Afraid to Go Deeper: Creating Pervasive Dread Through Blended Design Structures in
Subnautica and Subnautica: Below Zero" (the peer-reviewed read — "among Subnautica players, there is a
running joke that **IF YOU DON'T ALREADY HAVE THALASSOPHOBIA, OR AN INTENSE FEAR OF DEEP WATER, THE GAME
WILL GIVE IT TO YOU**," "the Subnautica games successfully create PERVASIVE DREAD BY BLENDING ASPECTS OF
THREE DESIGN STRUCTURES: the UNSETTLING ATMOSPHERE AND ENVIRONMENTAL DESIGN of traditional horror games, the
EXPLORATORY FREEDOM of open world games and the EXTREME VULNERABILITY AND WEIGHTED CHOICE of survival games.
By merging the emotional impacts of [these], **THEY MAKE PLAYERS FEAR DEATH IN A MEDIUM IN WHICH DEATH IS
BOTH IMPERMANENT AND EXPECTED**," "as a potential interactive environment, THE OCEAN EVOKES TWO OF HUMANITY'S
MOST PRIMAL FEARS: THE UNKNOWN AND THE DARK," Melody Jue on ocean environments testing "THE LIMITATIONS OF A
HUMAN POINT OF VIEW," "their overarching plots involve civilization-destroying plagues, telepathic sea
monsters, alien AI and a missing sister, but **THE PLAYER'S STORY IS FOCUSED ON THE HORRIFYING UNSCRIPTED
EVENTS THAT OCCUR EVERY DAY AND THE SLOWLY BUILDING SENSE OF DREAD THOSE EVENTS CREATE**," and The Long
Dark designer Raphael van Lierop — survival developers must learn "**HOW TO WRAP INTERESTING NARRATIVES
AROUND THESE VULNERABILITY SIMULATORS**"); The Star "Subnautica: A fun justification for fearing the ocean"
("when some players on the interwebs started clamouring for actual weapons, **UNKNOWN WORLDS STUCK TO THEIR
'NO KILLING THE KILLER FISH KILLING PLAYERS' RULE, and instead IDENTIFIED THAT FAUNA BEHAVIOUR HAD TO BE
TWEAKED TO BE LESS IRRITATING.** As someone interested in game development, I think **THAT'S A NEAT WAY TO
BALANCE PLAYER FEEDBACK WITH CREATIVE VISION**," the mid-2010s survival gold rush context alongside Terraria
and Don't Starve, "the wreck of the spaceship **AURORA SERVES AS A FAMILIAR LANDMARK** in Subnautica 1 that
helps you from getting lost," and on the sequel — "**SN2 IS JUST MORE OF SN1, JUST ON ANOTHER PLANET, WITH
ANOTHER PLOT. So I ask that question again: 'WHAT'S THE POINT OF THIS SEQUEL?' IF THE ANSWER IS 'MORE OF THE
SAME', IS THAT ENOUGH TO JUSTIFY A NEW WORK OF ART? I DUNNO**"); Hypercritic "Subnautica: Dive into a new
survival experience" ("Subnautica was first announced... in 2013, as a small project born in the wake of
Minecraft's success... However, **THE FINAL PRODUCT TOOK ALMOST FIVE YEARS TO COMPLETE – AT THE COST OF 10
MILLION DOLLARS AND MULTIPLE BANKRUPTCY RISKS.** To counter the high production expenses, the studio resolved
to **SELL THE GAME IN EARLY ACCESS**... with over **6 MILLION COPIES SOLD**," "contrary to survival
storylines like FROSTPUNK, here **THE NARRATIVE IS INTRODUCED A WHILE AFTER THE INITIAL STAGE OF THE GAME VIA
DISTRESS CALLS.** Investigating these signals will lead to acquiring **DATA ENTRIES**, which both shed light
on the events and **REINTRODUCE THE HUMAN ELEMENT INTO AN OTHERWISE LONELY GAME EXPERIENCE. BY LEARNING ABOUT
THE FATE OF THOSE WHO CAME BEFORE, THE PLAYER WILL UNCOVER THE PLANET'S MANY MYSTERIES**," "in addition to
health, hunger and thirst, exploring the depths introduces a new parameter to keep track of: **OXYGEN.
MAKING SURE TO HAVE ENOUGH AIR TO VENTURE BELOW BUT ALSO TO MAKE IT BACK TO THE SURFACE BECOMES CRUCIAL. EVEN
MORE SO IN A GAME WITHOUT A MAP, WHICH LEAVES THE PLAYER TO USE LANDMARKS AND POSITIONAL AUDIO TO NAVIGATE**,"
"it does not feature the quest structure that is common in many video games... instead, it lends itself to
**CYCLES OF EXPLORING, GATHERING RESOURCES AND RETURNING TO THE BASE FOR CRAFTING**," "while Subnautica does
not present itself as a horror game, **IT STILL MANAGES TO CRAFT MOMENTS OF TENSION SEEPED IN THALASSOPHOBIA.
Such as SWIMMING ALONE IN THE OPEN SEA, WHILE THE BELLOWING CRIES OF GIANT UNSEEN CREATURES ECHO FROM THE
DARKNESS. It manages to convey the feeling of BEING SMALL AND DEFENSELESS IN A WORLD OF LEVIATHANS**");
GamesRadar+ review ("I haven't felt this petrified in a video game since Resident Evil 7" — "while Unknown
Worlds has done a fabulous job capturing the BIOLUMINESCENT BEAUTY of life under the sea, **THAT SENSE OF
MARVEL AND CURIOSITY WILL EVENTUALLY DEVOLVE INTO ABJECT FEAR**," "all of us have A TOUCH OF THALASSOPHOBIA
INGRAINED INTO OUR PSYCHE, and Unknown Worlds HEARTILY PLAYS INTO THAT UNIVERSAL FEAR OF NOT KNOWING WHAT
LURKS," "it's true that you can craft A HANDFUL OF WEAPONS to defend yourself, but **YOU'RE VERY MUCH ON THE
LOWER RUNGS OF THE FOOD CHAIN in this extraterrestrial ecosystem, AND THAT VULNERABILITY FEEDS INTO THE
GAME'S SCARIEST MOMENTS**," "your escape pod's radio is **A CONSTANT SOURCE OF SIDE-QUESTS** that piece
together a narrative throughline, maintaining the game's forward momentum by **DRIP FEEDING** contextual
information... **JUST WHEN YOU MIGHT BE LOST FOR THINGS TO DO, IT'LL START PINGING OFF WITH ANOTHER MESSAGE**
from a potential survivor of the crash, and you'll jet off towards uncharted waters WITH RENEWED PURPOSE,"
and the flaw — "swimming... is A SMOOTH AND BREEZY JOY, but **THINGS IMMEDIATELY REGRESS ABOVE WATER**, which
controls more like A SLUGGISH AND SUBSTANDARD first-person exploration game. Subnautica's terra firma **LOOKS
A LOT WORSE**... where the **FLAT, UNGAINLY TEXTURES SUDDENLY BRING THE GAME'S PRODUCTION VALUES DOWN ALMOST
TO STEAM SHOVELWARE QUALITY**"); Forbes (Plafke) "Why 'Subnautica' Is Already One Of The Best Survival Games
Ever Made" ("**RARE FOR A SURVIVAL GAME, UNKNOWN WORLDS CHOSE TO FOCUS ON ATMOSPHERE AND NARRATIVE, DECIDING
TO GO WITH A BRILLIANTLY HAND-CRAFTED LANDSCAPE INSTEAD OF THE GENRE'S USUAL, TIRED PROCEDURAL GENERATION**,"
"survival games tend to go with procedural generation in order to (LAZILY) create 'new' content, but **YOU
CAN'T TEACH AN ALGORITHM ART DIRECTION.** Subnautica's atmosphere is right up there with **SILENT HILL 2 AND
BIOSHOCK**," "there hasn't been a game that LEVERAGES AND PLAYS WITH DRAW DISTANCE better than Subnautica.
**IT'S NOT EVEN A HORROR GAME IN THE SLIGHTEST, BUT YOU'LL HAVE A TINGLE IN YOUR SPINE FOR THE MAJORITY OF
THE TIME YOU PLAY, EVEN WHEN YOU KNOW YOU'RE SAFE**," and the studio history — Natural Selection (2002) as a
free Half-Life mod, NS2, and Subnautica as their third game); Game Wisdom "Subnautica's Deep Design Mostly
Pays Off" ("**POSSIBLY THE BIGGEST DESIGN DIFFERENCE** in Subnautica compared to other survival games is IN
THE FORM OF PROGRESSION. In most survival games, there really isn't a sense of true progression... **HERE,
THE GAME WANTS YOU TO BECOME SUSTAINABLE, SO THAT YOU CAN BETTER EXPLORE THE BEAUTIFULLY DESIGNED WORLD.
PROGRESSION IS ALL ABOUT FINDING THE RESOURCES YOU NEED TO BUILD AN EVER EXPANDING NUMBER OF OPTIONS**," "the
overall environment of the game is **HARDCODED, BUT THE RESOURCE NODES AND ITEMS YOU FIND AREN'T**," and the
back-half flaw — "**ENTERING THE BACK HALF OF THE GAME WAS WHEN THINGS BEGAN TO GO SOUTH. Your mission to get
off the planet will lead you into deeper waters WHICH REQUIRE A LOT OF CONSTRUCTION AND GRINDING. NO MATTER
HOW ADVANCED YOU GET AT THE GAME, YOU CANNOT ESCAPE THE NEED FOR BASIC RESOURCES, NOR IS THERE AN EASY WAY TO
MITIGATE IT**"); New Game+ "How Subnautica helped overcome my fear of the sea" ("as the faint outline extends
into the abyss **YOU GET A TRUE SENSE OF HOW ENORMOUS THIS WORLD IS AND HOW TINY YOU ARE. WATCHING THE EMPTY
VOID REVEAL ITSELF WAS HAUNTING**," "another triumph of Subnautica is its sound design – **OR RATHER THE LACK
OF SOUND – WHERE THE ENDLESS SILENCE OF THE DEPTHS HITS HARDER THAN ANY SOUNDTRACK COULD. EVEN WHEN THE MUSIC
DOES PRESENT ITSELF IN-GAME, IT SERVES NOTHING MORE THAN TO MAKE THOSE SILENT MOMENTS MORE DREAD-INDUCING**,"
and the ending — "when I finally reached the end of Subnautica, and my escape rocket was ready for departure,
**IT FELT SOLEMN. I DIDN'T WANT TO LEAVE this astonishing world, despite all the terrors lurking within. IT
WAS STARTING TO FEEL LIKE HOME. I GREW TO KNOW ITS INHABITANTS**"); Metacritic user reviews ("the
exploration—and the fear evoked by the depths of this alien world—is executed phenomenally; the game's
setting, atmosphere, soundtrack, and incredible sound design create a **DEEPLY UNSETTLING,
THALASSOPHOBIA-INDUCING EXPERIENCE**," "**EL TERROR NO ES EXPLÍCITO, ES AMBIENTAL Y SISTÉMICO; SURGE DE LO
DESCONOCIDO Y DE TU VULNERABILIDAD REAL DENTRO DEL MUNDO**" [the terror is not explicit, it is ambient and
systemic; it arises from the unknown and from your real vulnerability within the world], "**LA EXPLORACIÓN NO
ES CHECKLIST NI TURISMO: ES SUPERVIVENCIA COGNITIVA**" [exploration is not a checklist or tourism: it is
cognitive survival], and the joke review — "**TOO MUCH WATER**... At times, I found myself asking, '**COULD
THERE PERHAPS BE LESS WATER?**' The game responded by adding a deeper ocean biome"). Cross-ref Questbook 87
(Outward — the sibling stance: no markers, no fast travel, preparation over power; both refuse the power
fantasy), 88 (Project Zomboid — the other survival landmark; PZ's dying broadcasts vs SN's distress calls),
89 (Death Stranding — the other "we took the gun out" design; the rope not the stick), 28 (Undertale — the
game that questions the violence verb), 86 (Arcanum — the XP-curve flaw both SN and Outward solve
structurally), 37 (Morrowind — landmarks over markers), 83 (Ultima VII — the density/landmark warning), 29
(Frostpunk — explicitly contrasted by Hypercritic as the OTHER way to do survival narrative), 34/35
(SOMA/Silent Hill 2 — the atmosphere lineage Forbes places SN beside), 48 (Nemesis — the fix for SN's replay
problem), our PACIFIST LAW + AMALGAMATION + Network + [READ] + recorded-vs-unrecorded + quest factory + THREE
CURRENCIES (medicine/electricity/resources) + survival accounting + logistics + standing + city-builder +
district + fold + persistent consequence + HD tile repo + variation pipeline + prefab factory + street
generation + VEGAS GEOGRAPHY + combat dial + music repo + master volume-balance pass + ART PHILOSOPHY +
despair-with-a-thread-of-hope + verdict workflow + Paolo-decides law + FACTORY LAW + MAP LAW +
frame-locked building set. FUTURE: an Unknown Worlds postmortem on the no-weapons decision and the fauna-
behaviour retune (the definitive "hear the feedback, reject the solution" case study — directly useful for
our verdict workflow); a Below Zero study (what happened when they added a talking protagonist and a
scripted story to a game whose power was loneliness) or a Don't Starve deep-dive (the other hand-crafted-
aesthetic survival landmark, and the best art-direction-as-mechanic case in the genre).

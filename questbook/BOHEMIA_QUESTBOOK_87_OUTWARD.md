# BOHEMIA QUESTBOOK — DEEP DIVE 87: YOU CANNOT DIE AND THAT IS THE PUNISHMENT / THE DEBT IS THE PLOT (Outward)
Full teardown, the whole enchilada: DEFEAT SCENARIOS (a game with no death and no reload, where losing
triggers a story instead), the constant autosave as a design weapon, the Blood Price (a DEBT as the opening
quest), time as the real currency, the no-fast-travel/no-markers/no-XP stance, the backpack you drop to
fight, an "adventurer simulator" where you're a nobody, the honest flaws, and Bohemia ports. A 10-person
studio that sold 3 million copies by refusing the power fantasy. STARTLINGLY relevant to our DEATH-MATH,
our roguelite fold, our survival accounting, + our hardcore stance. Nine Dots Studio (Guillaume
Boucher-Vidal). Reference only; Paolo does not read it. No Bohemia quest written here.

Game: Outward (Nine Dots Studio, 2019). You survive a shipwreck, wash up in your hometown, and learn you owe
a BLOOD PRICE — a debt — payable in five days or your house is repossessed. No chosen one. No prophecy. No
levels. No fast travel. No map markers. And no death: when you lose, the game does something to you and
KEEPS GOING. Sold 3M+ copies. Outward 2 is in early access as of July 2026.

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- DEFEAT SCENARIOS: YOU CANNOT DIE, AND THAT IS WORSE (the landmark mechanic — and it's our roguelite's
  missing piece): "There's no death in Outward as we look at character death in RPGs usually. What happens
  is that THE GAME TRIGGERS A 'DEFEAT SCENARIO' AND IT CREATES A DEEPLY PERSONAL NARRATIVE."
  - Lose a fight and you wake up somewhere: dragged to a bandit fort and put to work in their MINE; rescued
    by a passing stranger and deposited on the far side of the map; healed by a wandering faction who then
    GIVE YOU A QUEST LEAD. "The player's defeat triggers a scenario, SOMETIMES NEGATIVE (losing time,
    status effects, gear stolen), OCCASIONALLY POSITIVE (BEING RESCUED, A QUEST ADVANCING UNEXPECTEDLY)."
  - PC Gamer's thesis, and it's the whole port: "A game where you can never die sounds like it'd make you
    fearless... IT TURNS OUT THE OPPOSITE IS TRUE. FAILURE COSTS YOU SOMETHING MORE PRECIOUS THAN A
    VIDEOGAME LIFE: IT COSTS YOU TIME... IMMORTALITY IS FAR MORE TERRIFYING THAN DEATH."
  - Boucher-Vidal's design reasoning: "When playing RPGs one of those things that REMIND ME IT'S A GAME is
    that I ALWAYS KNEW I COULD GO BACK [and reload]. And so the story that kind of emerged from that is:
    YOU NEVER FAIL." So they took the button away (cf. our DEATH-MATH + fold + roguelite structure; the
    loss that continues the story).
- THE AUTOSAVE IS THE ENFORCER (the system that makes it work): "The RPG AUTO-SAVES YOUR GAME CONSTANTLY so
  you CAN NEVER REWIND TIME and reload an earlier save." Nine Dots' own copy: "There is NO SAFETY NET here!
  No turning back! BUCKING THE TREND OF 'FREELY SAVED GAMES' TO RELY UPON, OUTWARD ENCOURAGES YOU TO LIVE
  WITH YOUR ACTIONS, implementing a constantly saving world as you progress, [so] CHARACTER DECISIONS
  BECOME MORE SIGNIFICANT & MEANINGFUL."
  - Defeat scenarios only have teeth because reloading is impossible. The two systems are ONE system (cf.
    our persistence-v1 + fold; the save model as a design statement).
- "WE WEAR OUR DEFEATS WITH PRIDE" (the emotional result): Boucher-Vidal — "We kind of WEAR OUR DEFEATS
  WITH PRIDE. There's a story, like, THIS HAPPENED TO ME AND THIS HAPPENED TO ME AND THIS HAPPENED TO ME...
  BUT I AM STILL HERE! THAT FEELING IS NOT SOMETHING WE SEE IN A LOT OF GAMES."
  - PC Gamer's actual playthrough is the proof: he wandered into a castle by mistake, the bandit chief
    MOCKED HIM WITH SARCASM, stripped his gear, and threw him in a forced-labor mine. He escaped by leaping
    into a pit and washed up on a beach "bruised, confused, freezing... AND WITH A HEALTHY GRUDGE." Hours
    later a quest appeared to kill that chief: "I WAS THRILLED TO ACCEPT IT CONSIDERING MY TREATMENT AT HIS
    HANDS EARLIER."
  - The game generated a personal nemesis out of a LOSS, with no Nemesis system (cf. Nemesis Q48, our fold
    + persistent consequence; grudges as emergent content).

===============================================================================
## 1. THE ARCHITECTURE (an adventurer simulator)
===============================================================================

### THE OPENING QUEST IS A DEBT (the best cold open for us in the canon)
- No prophecy. You wake up from a failed expedition and learn "you owe a (seemingly) large sum of money in
  order to pay off your accrued BLOOD PRICE, essentially A DEBT INCURRED BY THE PLAYER for their excursion
  BEFORE THE OUTSET OF THE GAME." Five in-game days, or the town repossesses your house.
- Your first goal in an epic fantasy RPG is MAKING RENT. And PC Gamer FAILED IT: he went for a mushroom to
  sell, lost to two bandits, got dragged to their fort, escaped, hit a spike trap, woke up across the map,
  walked home through a fort of ghosts — "by the time I made it home... IT WAS DAYS LATER, AND THE
  TIME-SENSITIVE QUEST TO BUY MY HOUSE HAD EXPIRED" (STARTLINGLY our post-economic-collapse premise + Vegas
  + survival accounting; debt as the inciting incident).
### NO LEVELS, NO XP, NO MARKERS, NO FAST TRAVEL (the subtractions)
- "There are NO EXPERIENCE POINTS to earn and NO LEVELS to gain. There's NO MINI-MAP and NO FAST TRAVEL.
  Even the provided questlines are essentially given as just A SORT OF ANCILLARY COMPONENT rather than a
  primary thrust of the game."
- Navigation is Morrowind's (Q37): "Remember back in the days of Morrowind when quest givers didn't mark
  things on your map and they just gave you GENERAL DIRECTIONS? Outward uses a very similar method."
- Progression is horizontal: "no one zone is strictly more difficult than the others, THE WAY A PLAYER MUST
  PREPARE FOR EACH IS DIFFERENT." You don't get stronger. You get READIER (cf. our fold + standing + MAP
  LAW; power as preparation).
### THE BACKPACK IS A DECISION (the single best small mechanic here)
- "The backpack is THE CENTRAL SURVIVAL TOOL; players must deliberately pack provisions, potions, weapons,
  and camping gear, and IN COMBAT, THEY SHOULD DROP THE BACKPACK to move and evade freely, THEN RETRIEVE
  IT AFTERWARD."
- Which produces the funniest, most human failure in the canon: PC Gamer "took off my bulky backpack to
  allow myself greater mobility in a fight ONLY TO REALIZE I'D LEFT MY MAGIC BOOK INSIDE IT, and thus
  COULDN'T CAST ANY OF THE RUNE SPELLS I'd just learned."
- And if you lose the fight, your backpack is still lying wherever you dropped it. On the other side of a
  map with no fast travel (cf. our inventory macro/micro + combat; the object that forces a real choice).
### THE REAL CURRENCY IS TIME, AND EVERY QUEST HAS A CLOCK
- "Failure costs you... TIME TO HEAL, TO REST, TO REPAIR YOUR GEAR AND RESTOCK YOUR SUPPLIES, to fill your
  belly with food and cure your ailments with potions, TO TRAVEL ALL THE WAY BACK TO THE SITE OF YOUR
  DEFEAT to try again — AND POSSIBLY TO FAIL AGAIN."
- Nine Dots on the sequel: "most quests come with a TIME LIMIT, and the fail state is that YOU DIDN'T
  COMPLETE THE QUEST IN TIME. THAT'S WHAT MAKES DEFEAT SCENARIOS FEEL HIGH-STAKES, BECAUSE THEY USUALLY
  COME WITH A TIME SKIP THAT EATS INTO YOUR DEADLINE."
- And the world executes on it: "if villagers told you your home was going to be attacked AND YOU IGNORED
  IT, YOU'D COME BACK TO FIND IT SACKED, ALL THE NPCs GONE, AND EVEN TRAINERS LOST" (STARTLINGLY our
  120-BPM tick + fold + city-builder; the clock as the antagonist).
### MAGIC COSTS YOU PERMANENTLY, AND UP FRONT
- "In order to unlock magic, YOU WILL NEED TO SACRIFICE A PORTION OF YOUR HEALTH AND STAMINA METERS." Not a
  cooldown. A permanent amputation of your other options.
- "A simple Spark spell isn't going to do much damage UNLESS YOU FIRST LAY DOWN A FIRE SIGIL." Two-step
  casting, prepared in advance (cf. our combat dial + perks; the power that costs a permanent piece).
### THE DEFEAT SCENARIOS ARE TEXT, ON PURPOSE (the production lesson — direct for us)
- Boucher-Vidal on how many the sequel needs: "Hey, it's a tough question. Like A LOT, really? A LOT. WE
  NEED THEM BECAUSE WE DIE OFTEN AND SO IF YOU KEEP SEEING THE SAME THINGS IT EVENTUALLY GETS FRUSTRATING.
  And we need DIFFERENT DEFEAT SCENARIOS FOR EVERY DUNGEON as well. SO LIKE, THAT'S WHY IT'S NOT A CUTSCENE
  OR SOMETHING. IT'S JUST A LITTLE BIT OF TEXT."
- The most valuable production note in this teardown: the feature is affordable BECAUSE it's text. A
  cutscene budget would have killed it (cf. our FACTORY LAW + quest factory; cheap format = high volume).
### THE STUDIO REFUSED TO GROW (the solo-dev lesson)
- "The core vision that emerged was INTENTIONALLY POLARIZING: a fantasy RPG centered on IMMERSION RATHER
  THAN POWER, where THE PLAYER IS A NORMAL HUMAN rather than a chosen hero. OUTWARD 1 SOLD 3 MILLION COPIES
  to date and VALIDATED THAT VISION."
- "The studio has since grown from 10 to 30 people; THEY EXPLICITLY DID NOT WANT TO SCALE UP TO 100–150
  EMPLOYEES, WHICH WOULD HAVE FORCED THEM TO CHASE A BROADER AUDIENCE AND COMPROMISE THE GAME'S UNIQUE
  IDENTITY." Ten people. Three million copies. By being polarizing on purpose (cf. our whole project; the
  counter-example to Troika Q86).

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- THE SURVIVAL SYSTEMS TRIVIALIZE THEMSELVES: "making all of these survival mechanics even more forgettable
  are CHEAP PASSIVE ABILITIES YOU CAN BUY FROM TRAINERS THAT INCREASE YOUR NATURAL RESISTANCE TO WEATHER
  AND HUNGER, making them even less impactful. All of these components are very manageable beforehand, and
  BECOME ALL-BUT-TRIVIAL once you train against their effects. IT WAS DISAPPOINTING TO SEE A MAJOR THRUST
  OF THE GAME BECOME SO UNIMPORTANT BEFORE THE END." LESSON (direct, ours): DO NOT SELL PASSIVE IMMUNITY TO
  YOUR OWN CORE SYSTEM — our survival accounting (medicine/electricity/resources) must never become
  purchasable-away.
- THE DEATH SYSTEM CAN BE GAMED: "the death system CAN BE GAMED at times. IF YOU HAVE AN IRRITATING
  CONDITION LIKE A DISEASE YOU CAN'T READILY CURE, THROW YOURSELF DOWN A MOUNTAINSIDE OR GET TORN APART BY
  HYENAS." Defeat becomes a CURE. LESSON: any "failure has consequences" system must check that failure
  isn't the cheapest solution to something (our death-math + roguelite fold).
- THE WORLD IS SPARSE AND SAMEY: two of the biggest criticisms were "COMBAT BEING STIFF and THE WORLD ITSELF
  BEING RELATIVELY SPARSE LEADING TO PROLONGED SECTIONS OF NOTHING HAPPENING." Nine Dots agreed and made
  density a sequel pillar — "THE EMPTINESS IS ONE OF THOSE FOUR PILLARS." And a playtester on the sequel:
  "EVERYTHING LOOKED THE SAME, the textures were similar, and I SPENT 40 MINUTES LOOKING FOR MY ROOM."
  LESSON (third confirmation — Ultima VII Q83, Dragon's Dogma Q84): no-markers navigation REQUIRES visual
  landmark discipline, or "hardcore" just means lost.
- THE EARLY QUESTS ARE FETCH QUESTS: "most of the early quests are A LOT OF FETCH QUESTS and the like which
  ISN'T HELPED BY THE GAME'S POOR MAP SYSTEM." LESSON: sixth straight confirmation of the fetch-chain law
  (Q71, Q74, Q79, Q83, Q84, here).
- GREAT IDEAS, ROUGH IMPLEMENTATION: "Outward is A SERIES OF GOOD OR EVEN GREAT IDEAS, BUT MANY JUST SEEM TO
  BE ROUGHLY IMPLEMENTED... build-crafting ends up being MORE INTERESTING THAN THE COMBAT ITSELF, and the
  story acts only as A SERVICEABLE DISTRACTION... The best case scenario is that Outward serves as A
  SUCCESSFUL PROOF-OF-CONCEPT that leads to an experience down the road THAT HITS A BULLSEYE WHERE OUTWARD
  JUST NARROWLY MISSED." LESSON: a great IDEA is not a shipped FEATURE — the tuning is the work.
- THE HARDCORE MODE IS A COIN FLIP: Outward 2's hardcore mode gives "A 20% CHANCE OF YOUR SAVE BEING
  PERMANENTLY DELETED" on defeat. LESSON: randomized permadeath punishes the unlucky, not the careless (our
  fold must make loss LEGIBLE, not arbitrary).

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. DEFEAT SCENARIOS INSTEAD OF DEATH: losing triggers a STORY — captured and put to work in a mine,
    rescued by strangers, robbed, or occasionally HELPED with "a quest advancing unexpectedly" (cf. our
    death-math + fold).
W2. IMMORTALITY IS SCARIER THAN DEATH: "failure costs you something MORE PRECIOUS than a videogame life: IT
    COSTS YOU TIME" — heal, restock, repair, walk all the way back, and maybe fail again (cf. our 120-BPM
    tick + survival accounting).
W3. THE AUTOSAVE IS THE ENFORCER: constant saving removes the reload button, which is the ONLY reason
    defeat scenarios have teeth — "you never fail [in other RPGs]" (cf. our persistence-v1).
W4. "WE WEAR OUR DEFEATS WITH PRIDE": the loss-log becomes the character — "this happened to me and this
    happened to me... BUT I AM STILL HERE" (cf. our fold + roguelite structure).
W5. LOSING GENERATES YOUR NEMESIS FOR FREE: the chief who mocked you, robbed you, and enslaved you becomes
    a kill-quest you accept with a grudge — with no Nemesis system (cf. Nemesis Q48, our persistent
    consequence).
W6. THE OPENING QUEST IS A DEBT: pay your BLOOD PRICE in five days or lose your house — an economic
    inciting incident in a fantasy RPG (cf. our post-economic-collapse premise + Vegas).
W7. YOU DON'T GET STRONGER, YOU GET READIER: no XP, no levels, no scaling — "the way a player must PREPARE
    for each [zone] is different" (cf. our standing + inventory).
W8. THE BACKPACK IS A REAL DECISION: drop it to fight well, and lose access to everything in it — including
    the spellbook you forgot you left inside (cf. our inventory macro/micro).
W9. EVERY QUEST HAS A CLOCK, AND THE WORLD EXECUTES ON IT: ignore the warning that your town will be
    attacked and "you'd come back to find it SACKED, ALL THE NPCs GONE, AND EVEN TRAINERS LOST" (cf. our
    120-BPM tick + city-builder + scheduler).
W10. THE FEATURE IS TEXT ON PURPOSE: they need "A LOT" of defeat scenarios, one set per dungeon — "THAT'S
     WHY IT'S NOT A CUTSCENE OR SOMETHING. IT'S JUST A LITTLE BIT OF TEXT" (cf. our FACTORY LAW).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — the loss that continues + the debt that starts it
===============================================================================
Outward is the closest thing in the canon to OUR game's stance: hardcore, anti-power-fantasy, survival-
accounted, and built by a tiny team that refused to grow. Its DEFEAT SCENARIO system is the single most
directly stealable mechanic we've found for our roguelite death-math, and its BLOOD PRICE opening is our
premise in one quest.
- W1/W2/W3/W4 (defeat scenarios + immortality is scarier + the autosave enforcer + wearing defeats with
  pride — our DEATH-MATH + fold): the top port, four ports fused. Our roguelite currently thinks about
  death as a RUN ENDING. Outward's answer is better and more on-theme for a dynasty: LOSING DOESN'T STOP
  THE STORY, IT BENDS IT. A dynast who loses a fight wakes up: stripped of goods, conscripted into a
  faction's labor, dumped across the valley, in medical debt, hostage, or occasionally RESCUED by someone
  who now wants something. The cost is TIME (our 120-BPM tick, our supply clocks, our quest deadlines) —
  and time is exactly what a three-generation game has to spend. And it only works if reloading is
  impossible, so our persistence-v1 constant-save IS the mechanic, not the plumbing. "Immortality is far
  more terrifying than death" is our hardcore stance stated better than we've stated it (ties our
  DEATH-MATH + fold + roguelite structure + persistence-v1 + 120-BPM tick + survival accounting + medicine
  currency + faction web; a top-tier mechanical port).
- W6 (the opening quest is a DEBT — our premise, in one quest): STEAL the Blood Price outright. Outward's
  first quest in an epic fantasy RPG is MAKING RENT: pay a debt in five days or the town takes your house.
  Our post-ECONOMIC apocalypse should open exactly there — a dynasty's founding quest is a DEBT with a
  clock, owed to a faction, payable in medicine/electricity/resources, and failing it costs you the
  building. That's our whole premise expressed as a tutorial (ties our post-economic-collapse premise +
  survival accounting + city-builder + faction web + VEGAS GEOGRAPHY + fold, Arcanum Q86, FFT Q81).
- W5 (losing generates your nemesis for free — our persistent consequence): bank it. The bandit chief who
  mocked you, took your gear, and worked you in his mine becomes a personal grudge the moment a quest to
  kill him appears — and Nine Dots BUILT NO NEMESIS SYSTEM. The defeat scenario did it. Our fold + faction
  web could get Nemesis-grade attachment (Q48) for the cost of writing WHO captured you and WHAT they did
  (ties our persistent consequence + faction web + fold + death-math, Nemesis Q48).
- W9 (every quest has a clock and the world EXECUTES on it — our 120-BPM tick + city-builder): STEAL the
  hard version. "If villagers told you your home was going to be attacked and you ignored it, you'd come
  back to find it SACKED, ALL THE NPCs GONE, AND EVEN TRAINERS LOST." Not a fail message — the town is
  GONE, and the people you needed are dead. In a city-builder with a dynasty clock that's not cruelty,
  that's the genre. And it's what makes defeat scenarios bite: the time skip EATS YOUR DEADLINE (ties our
  120-BPM tick + city-builder + district + scheduler + entities/spawning + fold + persistent consequence).
- W7/W8 (you get READIER, not stronger + the backpack is a decision — our standing + inventory): bank both.
  (a) No XP, no levels, no scaling: zones aren't harder, they're DIFFERENT, and power = preparation. That
  fits our standing-as-spine and our survival accounting better than a level curve, and it directly answers
  Arcanum's XP-curve-is-your-thesis flaw (Q86) — if there's no XP, you can't reward violence with it. (b)
  And our macro/micro inventory should have Outward's backpack tension: carrying it makes you slow, dropping
  it makes you fast and STRIPS YOU of everything inside — a real decision made under pressure, with a
  brutal comic failure mode built in (ties our standing + inventory macro/micro + combat dial + survival
  accounting + Pacifist Law, Morrowind Q37, Arcanum Q86).
- W10 (the feature is TEXT on purpose — our FACTORY LAW): the production lesson of the teardown. Nine Dots
  needs "A LOT" of defeat scenarios — a distinct set PER DUNGEON — and the ONLY reason they can afford it
  is that each one is "JUST A LITTLE BIT OF TEXT," not a cutscene. That's FACTORY LAW stated by a shipping
  studio: pick the cheapest format that carries the feeling, then produce VOLUME. Our defeat scenarios,
  our district events, our faction reactions: text-first, generated at scale, gated (ties our FACTORY LAW +
  quest factory + district + single-file-carry).
- THE STUDIO NOTE (bank it): 10 people, "INTENTIONALLY POLARIZING," "a fantasy RPG centered on IMMERSION
  RATHER THAN POWER, where the player is a NORMAL HUMAN rather than a chosen hero" — 3 MILLION COPIES. And
  they refused to grow to 150 because it "WOULD HAVE FORCED THEM TO CHASE A BROADER AUDIENCE AND COMPROMISE
  THE GAME'S UNIQUE IDENTITY." That's the counter-example to Troika (Q86): same anti-mainstream conviction,
  opposite outcome, because they SHIPPED SOMETHING THAT WORKED AND STAYED SMALL.
- FLAWS (bank HARD): (a) NEVER SELL PASSIVE IMMUNITY TO YOUR OWN CORE SYSTEM — Outward lets you buy
  resistance to weather and hunger, and "a major thrust of the game BECAME SO UNIMPORTANT BEFORE THE END";
  our medicine/electricity/resources accounting must never be purchasable-away; (b) check that FAILURE
  ISN'T THE CHEAPEST CURE — players intentionally got killed by hyenas to clear a disease (our death-math
  needs an audit for this exact exploit); (c) no-markers navigation REQUIRES landmark discipline — "everything
  looked the same... I spent 40 minutes looking for my room" (third confirmation; our HD tile repo +
  variation + MAP LAW are load-bearing for our Morrowind-style direction-giving); (d) sixth confirmation of
  the FETCH-CHAIN LAW; (e) a great IDEA is not a shipped FEATURE — "a series of good or even great ideas,
  but many just seem to be ROUGHLY IMPLEMENTED... a successful PROOF-OF-CONCEPT" is the polite way to say
  the tuning is the work (our regression gates + verdict workflow); and (f) randomized permadeath (a "20%
  chance of your save being deleted") punishes the UNLUCKY, not the careless — our fold's losses must be
  LEGIBLE and earned.

## SOURCES
PC Gamer "You never die in RPG Outward, and that makes your character's story stronger" (GDC interview with
Guillaume Boucher-Vidal, creative lead + CEO of Nine Dots — "the RPG AUTO-SAVES YOUR GAME CONSTANTLY so you
can never rewind time and reload an earlier save. And when you're defeated in combat, YOU'RE NOT KILLED but
instead YOU WAKE UP SOMEWHERE ELSE ON THE MAP," "these defeat scenarios CONTRIBUTE A BIT MORE TO THE STORY OF
MY CHARACTER than simply reloading a save and trying something different would," the bandit-chief anecdote —
"the bandit chief MOCKED ME (USING SARCASM, THE BASTARD), captured me, and THREW ME IN THE DUNGEON WHERE HE
WAS RUNNING A FORCED LABOR MINING OPERATION. It took a lot of work but I eventually managed to reacquire my
loot and escape by LEAPING INTO A PIT, eventually washing up on shore, BRUISED, CONFUSED, FREEZING... AND
WITH A HEALTHY GRUDGE. Later in the game A QUEST CAME UP TO KILL THIS VERY BANDIT LEADER, AND I WAS THRILLED
TO ACCEPT IT," Guillaume — "WE KIND OF WEAR OUR DEFEATS WITH PRIDE. There's a story, like, this happened to
me and this happened to me and this happened to me... BUT I AM STILL HERE! THAT FEELING IS NOT SOMETHING WE
SEE IN A LOT OF GAMES," and his reasoning — "when playing RPGs one of those things that REMIND ME IT'S A GAME
is that I ALWAYS KNEW I COULD GO BACK [and reload a save]. And so the story that kind of emerged from that
is: YOU NEVER FAIL," plus "YOU FAIL YOUR WAY TO SUCCESS"); PC Gamer Outward review ("a game where you can
never die SOUNDS LIKE IT'D MAKE YOU FEARLESS... IT TURNS OUT THE OPPOSITE IS TRUE. FAILURE COSTS YOU
SOMETHING MORE PRECIOUS THAN A VIDEOGAME LIFE: IT COSTS YOU TIME. Time to heal, to rest, to repair your gear
and restock your supplies, to fill your belly with food and cure your ailments with potions, TO TRAVEL ALL
THE WAY BACK TO THE SITE OF YOUR DEFEAT to try again — and POSSIBLY TO FAIL AGAIN. IMMORTALITY IS FAR MORE
TERRIFYING THAN DEATH," "it's an RPG where TRADITIONALLY MUNDANE TASKS BECOME COMPLICATED, where NORMALLY
SIMPLE DECISIONS BECOME WEIGHTY, and where IT FEELS LIKE EVERY SINGLE CHOICE YOU MAKE REALLY MATTERS. I LOVE
THIS GAME. I ALSO, SOMETIMES, HATE THIS GAME," the backpack failure — "the time I took off my bulky backpack
to allow myself greater mobility in a fight ONLY TO REALIZE I'D LEFT MY MAGIC BOOK INSIDE IT, and thus
COULDN'T CAST ANY OF THE RUNE SPELLS I'd just learned," and the failed first quest — "earn 150 silver coins
to buy back my house (a lighthouse, in fact), WHICH HAD BEEN REPOSSESSED BY MY TOWN'S LEADERS TO REPAY A DEBT
I OWED... I lost a fight to two bandits, WHO DRAGGED MY BODY BACK TO THEIR FORT. I managed to find my gear,
escape, and heal myself, but I STEPPED INTO A SPIKE TRAP AND LOST CONSCIOUSNESS AGAIN. This time I was
DRAGGED TO SAFETY BY A MYSTERIOUS BENEFACTOR, but I WOKE UP ON THE FAR SIDE OF THE MAP. By the time I made it
back home... IT WAS DAYS LATER, AND THE TIME-SENSITIVE QUEST TO BUY MY HOUSE HAD EXPIRED"); RPG Site review +
30-hours feature ("Outward opens up with the player surviving a failed expedition and a near-fatal ship wreck
and waking up in their coastal hometown of Cierzo. Upon coming to, they'll quickly learn that THEY OWE A
(SEEMINGLY) LARGE SUM OF MONEY in order to pay off their accrued BLOOD PRICE, essentially A DEBT INCURRED BY
THE PLAYER for their excursion BEFORE THE OUTSET OF THE GAME," the three factions — Blue Chamber Collective /
Heroic Kingdom / (Holy Mission of Elatt), "there are NO EXPERIENCE POINTS to earn and NO LEVELS to gain.
There's NO MINI-MAP and NO FAST TRAVEL. Even the provided questlines are essentially given as just A SORT OF
ANCILLARY COMPONENT," "while some open-world RPGs might SCALE the environments and enemies to the player's
level... Outward instead focuses on challenging the player in different ways... NO ONE ZONE IS STRICTLY MORE
DIFFICULT THAN THE OTHERS, THE WAY A PLAYER MUST PREPARE FOR EACH IS DIFFERENT," "the game instead REMOVES A
LAYER OF CONVENIENCE from the player and then asks them to FIGURE OUT THE BEST WAY TO MANAGE THE SYSTEMS in a
way that fits their playstyle. And I think this is OUTWARD'S GREATEST STRENGTH," and the criticisms —
"MAKING ALL OF THESE SURVIVAL MECHANICS EVEN MORE FORGETTABLE ARE CHEAP PASSIVE ABILITIES YOU CAN BUY FROM
TRAINERS THAT INCREASE YOUR NATURAL RESISTANCE TO WEATHER AND HUNGER... ALL OF THESE COMPONENTS... BECOME
ALL-BUT-TRIVIAL once you train against their effects. IT WAS DISAPPOINTING TO SEE A MAJOR THRUST OF THE GAME
BECOME SO UNIMPORTANT BEFORE THE END," "Outward is A SERIES OF GOOD OR EVEN GREAT IDEAS, BUT MANY JUST SEEM
TO BE ROUGHLY IMPLEMENTED... the story acts only as A SERVICEABLE DISTRACTION... The best case scenario is
that Outward serves as A SUCCESSFUL PROOF-OF-CONCEPT that leads to an experience down the road THAT HITS A
BULLSEYE WHERE OUTWARD JUST NARROWLY MISSED THE MARK"); Games Xtreme review ("there's NO DEATH in Outward as
we look at character death in RPGs usually. What happens is that THE GAME TRIGGERS A 'DEFEAT SCENARIO' and it
creates A DEEPLY PERSONAL NARRATIVE," "what I haven't really seen up until now is a game where YOU JUST PLAY
AN ORDINARY PERSON WHO DOES AMAZING THINGS, BUT REMAINS FOR THE MOST PART: ORDINARY. NOT THE CHILD OF SOME
GREAT PROPHESY or the daughter of a famous bloodline, JUST A REGULAR PERSON," "Outward is best described as
an 'ADVENTURER SIMULATOR' which simulates the lifestyle of a NORMAL PERSON... WHERE THE SILVER THEY EARN
MEANS SOMETHING AND THE FOOD THEY COOK KEEPS THEM ALIVE," "made by a team of 10 folks from Nine Dots," the
Gothic comparison); Gamereactor review ("your character NEVER REALLY *DIES* per se, but is instead delivered
from death in different, OFTEN RANDOMLY SELECTED WAYS that are anything from being healed and respawned
nearby, to BEING THROWN TO THE OTHER SIDE OF THE MAP, INJURED AND WITHOUT YOUR BACKPACK," "to balance your
character's inevitable survival, THERE IS NO RELOAD FUNCTION," and the exploit — "the death system CAN BE
GAMED at times. IF YOU HAVE AN IRRITATING CONDITION LIKE A DISEASE YOU CAN'T READILY CURE, THROW YOURSELF
DOWN A MOUNTAINSIDE OR GET TORN APART BY HYENAS"); Nine Dots Studio official site ("There is NO SAFETY NET
here! No turning back! BUCKING THE TREND OF 'FREELY SAVED GAMES' TO RELY UPON, OUTWARD ENCOURAGES YOU TO LIVE
WITH YOUR ACTIONS, implementing a constantly saving world as you progress, character decisions become MORE
SIGNIFICANT & MEANINGFUL and the gameplay more challenging. YOUR LIFE, YOUR ADVENTURE, YOUR ACTIONS AND
CONSEQUENCES!"); Geeks Under Grace review ("you don't play as the typical 'chosen hero'... NO, YOU'RE JUST
SOME RANDOM GUY," "you have to PAY A BLOOD DEBT WITHIN FIVE IN-GAME DAYS TO KEEP YOUR HOUSE," "in order to
unlock magic, YOU WILL NEED TO SACRIFICE A PORTION OF YOUR HEALTH AND STAMINA METERS... a simple Spark spell
isn't going to do much damage UNLESS YOU FIRST LAY DOWN A FIRE SIGIL," "most of the early quests are A LOT OF
FETCH QUESTS... Remember back in the days of MORROWIND when quest givers didn't mark things on your map and
they just gave you GENERAL DIRECTIONS? Outward uses a very similar method"); WCCFTech "Outward 2 Hits Steam
Early Access in July 2026" (the Exercise system replacing XP, "enemies are NOT LEVEL-SCALED," "THERE ARE NO
TRADITIONAL DEATHS OR SAVE RELOADS... The player's defeat TRIGGERS A SCENARIO, sometimes NEGATIVE (LOSING
TIME, STATUS EFFECTS, GEAR STOLEN), occasionally POSITIVE (BEING RESCUED, A QUEST ADVANCING UNEXPECTEDLY).
Outward 2 expands this with A WOUND SYSTEM," "our design philosophy is to make sure there are ENOUGH IMPLICIT
GOALS that we don't need to bombard players with side quests... MOST QUESTS COME WITH A TIME LIMIT, and the
fail state is that you didn't complete the quest in time. THAT'S WHAT MAKES DEFEAT SCENARIOS FEEL
HIGH-STAKES, BECAUSE THEY USUALLY COME WITH A TIME SKIP THAT EATS INTO YOUR DEADLINE," "Outward 1 had this
too: IF VILLAGERS TOLD YOU YOUR HOME WAS GOING TO BE ATTACKED AND YOU IGNORED IT, YOU'D COME BACK TO FIND IT
SACKED, ALL THE NPCs GONE, AND EVEN TRAINERS LOST," the playtester complaint — "my concern in the playtest was
NAVIGATION. EVERYTHING LOOKED THE SAME, the textures were similar, and I SPENT 40 MINUTES LOOKING FOR MY
ROOM," "there is NO FAST TRAVEL OR GPS MARKERS. Players must READ THE MAP AND OBSERVE THEIR SURROUNDINGS,"
the Intentional Inventory Management pillar — "THE BACKPACK IS THE CENTRAL SURVIVAL TOOL; players must
deliberately pack provisions, potions, weapons, and camping gear, and IN COMBAT, THEY SHOULD DROP THE
BACKPACK to move and evade freely, THEN RETRIEVE IT AFTERWARD," and the studio's stance — "the core vision
that emerged was INTENTIONALLY POLARIZING: a fantasy RPG centered on IMMERSION RATHER THAN POWER, where THE
PLAYER IS A NORMAL HUMAN rather than a chosen hero. OUTWARD 1 SOLD 3 MILLION COPIES to date and VALIDATED
THAT VISION. The studio has since grown from 10 to 30 people; THEY EXPLICITLY DID NOT WANT TO SCALE UP TO
100–150 EMPLOYEES, WHICH WOULD HAVE FORCED THEM TO CHASE A BROADER AUDIENCE AND COMPROMISE THE GAME'S UNIQUE
IDENTITY"); TheSixthAxis Outward 2 preview (Boucher-Vidal on defeat-scenario volume — "Hey, it's a tough
question. Like A LOT, really? A LOT. WE NEED THEM BECAUSE WE DIE OFTEN AND SO IF YOU KEEP SEEING THE SAME
THINGS IT EVENTUALLY GETS FRUSTRATING. And we need DIFFERENT DEFEAT SCENARIOS FOR EVERY DUNGEON as well. SO
LIKE, THAT'S WHY IT'S NOT A CUTSCENE OR SOMETHING. IT'S JUST A LITTLE BIT OF TEXT," the Menders defeat
scenario that healed the reviewer and handed him a quest lead — "this was actually THE FIRST TIME GUILLAUME
AND REBECCA HAD SEEN THIS SCENARIO PLAY OUT," hardcore mode's "20% CHANCE OF YOUR SAVE BEING PERMANENTLY
DELETED," "the EMPTINESS is one of those four pillars... you need to have a bit more RANDOM EVENTS, to have
ENCOUNTERS THAT ARE NOT HOSTILE," and Nine Dots self-publishing to fund other studios). Cross-ref Questbook
37 (Morrowind — directions not markers; Outward's navigation model), 51/55 (Gothic/Kenshi — the ordinary
person in a world that doesn't care), 30 (This War of Mine — survival accounting), 48 (Nemesis — the grudge
system Outward gets for free), 86 (Arcanum — the XP-curve flaw Outward solves by having no XP; and Troika as
the studio counter-example), 83/84 (Ultima VII/Dragon's Dogma — the density + landmark warnings), 47/49
(Hades/Rogue Legacy — the loop that keeps the story going), 29 (Frostpunk — the clock as antagonist), 65
(Citizen Sleeper — the body as an economy), our DEATH-MATH + fold + roguelite structure + persistence-v1 +
120-BPM tick + survival accounting (medicine/electricity/resources) + inventory macro/micro + city-builder +
district + scheduler + entities/spawning + standing + faction web (13 factions) + persistent consequence +
quest factory + combat dial + Pacifist Law + Megaton law + HD tile repo + VEGAS GEOGRAPHY +
post-economic-collapse premise + FACTORY LAW + MAP LAW + regression gates + verdict workflow +
single-file-carry. FUTURE: a Guillaume Boucher-Vidal GDC talk pull on the defeat-scenario system's authoring
model (how many, how written, how gated — the definitive blueprint for our death-math); an Outward 2
post-launch study once it's out of early access (the wound system + the Exercise progression are both
directly relevant to our perks gap) or a Project Zomboid deep-dive (the other great "your death is a story"
survival sim, and the best-in-class version of a world that keeps running after you lose).

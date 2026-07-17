# BOHEMIA QUESTBOOK — DEEP DIVE 110: LOSING IS A LOCATION / YOU WAKE UP IN THE CAGE (The Cannibal Cage, Kenshi)
Full teardown, the whole enchilada: the quest nobody wrote, in a game with no quests, where you lose a fight
and instead of a game-over screen you wake up in a wicker cage on the wrong side of the continent with a
missing leg, watching the queue for the cooking pit, and the story is whatever you do next. Complete event
flow, the trail of loot, the cage, the pit rotation, the prosthetics, the Cannibal Hunters, the honest
flaws, and Bohemia ports. STARTLINGLY relevant to our DEATH-MATH, our fold, our combat dial, our district,
our survival accounting, + our PACIFIST LAW. Lo-Fi Games — **Chris Hunt, twelve years, largely alone**.
Reference only; Paolo does not read it. No Bohemia quest written here.

Location: the Cannibal Plains, Kenshi (2018). "**KENSHI'S DEVELOPMENT WAS PRIMARILY LED BY A SINGLE PERSON
OVER THE COURSE OF TWELVE YEARS.**" The playable area is "**870 SQUARE KILOMETRES (340 SQ MI), WHICH WAS DONE
TO PLACE DANGEROUS AND CHALLENGING AREAS IN BETWEEN REWARDS THAT PLAYERS MIGHT SEEK OUT.**" There is no main
quest. There is no plot. There is a map and a body.

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- DEFEAT IS NOT DEATH, IT'S A TRANSFER (the thesis — STARTLINGLY our death-math + fold): "**CANNIBALS WILL
  ATTACK OTHER FACTIONS AND CARRY UNCONSCIOUS ORGANIC MEMBERS OF OTHER FACTIONS TO THEIR CAMP OR VILLAGE.**"
  - You don't die. **You get carried.** You wake up somewhere else, as inventory. The loss screen is a
    location.
  - And the world runs on it: "**SLAVERY IS VERY COMMON IN THE WORLD AND IT'S SHOCKINGLY EASY TO GET
    ENSLAVED. **DEFEAT IN BATTLE? SLAVERY. NOT BEING A MALE HUMAN IN THE HOLY NATION OR ACCOMPANIED BY ONE?
    SLAVERY. COMMIT A CRIME? SLAVERY. GETTING DOWNED NEAR SLAVERS EVEN IF YOU HAVEN'T DONE ANYTHING?
    SLAVERY!**" (STARTLINGLY our death-math + PACIFIST LAW + combat dial; the failure state that is a
    starting position).
- THE CAGE HAS A QUEUE AND YOU CAN SEE IT (the horror — direct for our survival accounting): "**WHEN THE
  CAGES START TO GET FULL, THEY WILL PERIODICALLY START BEATING THEIR PRISONERS TO DEATH AND THROWING THEM
  INTO THE COOKING PITS.**"
  - **It's a capacity problem.** You aren't eaten because you're special or because a cutscene fired. You're
    eaten because **the cages filled up** and they're managing throughput. Your death is inventory
    management (STARTLINGLY our survival accounting + logistics + AMALGAMATION; being processed).
- AND THE WHOLE THING WAS BUILT BY ONE MAN OVER TWELVE YEARS (the fact that matters most to us): a
  developer, writing about giving up on his own project: "**I'VE BEEN WRITING FOR LITERALLY FIFTEEN YEARS
  ABOUT THE GAME I'D LIKE TO BUILD, BUT ASSUMED I COULDN'T BECAUSE ONE PERSON CAN'T POSSIBLY BUILD ALL THE
  SYSTEMS AND ASSETS REQUIRED FOR A FULL SCALE OPEN WORLD GAME. AND WHILE I HAVE BEEN MESSING ABOUT AND
  PRODUCING LITERALLY ONLY TINY SCRAPS OF CODE, ONE PERSON — CHRIS HUNT — HAS ACTUALLY DONE IT... **THE
  DIFFERENCE IS, HIS IS FINISHED, IT WORKS, AND IT'S BEING PLAYED.**"
  - "**IT'S AN EXTRAORDINARY ACHIEVEMENT BY ONE MAN, WITHOUT FINANCIAL BACKING, BUT WITH A VISION AND
    OBSESSIVE PERSISTENCE. IT LACKS THE POLISH OF A MULTI-MILLION DOLLAR STUDIO PRODUCTION, TRUE... BUT IT
    IS STILL EXTRAORDINARY**" (cf. our FACTORY LAW + ART PHILOSOPHY).

===============================================================================
## 1. THE FULL EVENT FLOW (stage by stage)
===============================================================================

### STAGE 0 — THE BAIT (the best environmental trap in the medium)
- From TV Tropes' nightmare list, and it is perfect design: "**OUT IN THE APPROPRIATELY-TITLED CANNIBAL
  PLAINS, YOU COME ACROSS A LARGE, DOMED STRUCTURE NOT UNLIKE THE ONES SOUGHT OUT BY THE TECH HUNTERS FOR
  ANCIENT KNOWLEDGE. THE WHOLE PLACE IS EMPTY...EXCEPT FOR **A SUSPICIOUS TRAIL OF FOOD, MEDICINE AND OTHER
  EXPENSIVE ITEMS LEADING UP TO THE SECOND FLOOR.** AND WHAT HAPPENS TO BE ON THE SECOND FLOOR, YOU ASK? WHY,
  A NEST PACKED WITH CANNIBALS, OF COURSE! HOPE YOU DIDN'T MAKE TOO MUCH NOISE!**"
- **The loot IS the trap.** Nobody placed a sign. Nobody scripted an ambush trigger. Someone put good items
  on a staircase, and your own greed walks you up it (STARTLINGLY our district + HD tile repo + prefab
  factory + [READ]; the room that baits with inventory).
### STAGE 1 — THE FIGHT YOU LOSE (and the medical system that decides everything)
- Kenshi's combat has no health bar in the normal sense. You take limb damage, you go unconscious, you
  **bleed**. And: "**IF YOUR CHARACTER SUFFERS QUITE MINOR INJURIES IN A FIGHT AND BECOMES UNCONSCIOUS, THEY
  ARE LIKELY TO BLEED OUT AND DIE BEFORE REGAINING CONSCIOUSNESS UNLESS THERE IS SOMEONE TO PROVIDE FIRST
  AID — **WHICH IS WHY IT IS WISE TO ACQUIRE A COMPANION.**"
- **The companion system exists because of the bleeding system.** You don't recruit friends for banter or
  DPS. You recruit them because an unconscious man alone is a dead man, and the game never says so
  (STARTLINGLY our companions + MEDICINE currency + death-math; friendship as a medical necessity).
### STAGE 2 — THE DISMEMBERMENT (your body is a set of parts and they come off)
- "**AS PART OF THE DAMAGE SYSTEM, LIMBS CAN BE SEVERED OR DAMAGED INDIVIDUALLY, WITH THE OPTION TO REPLACE
  THEM WITH PROSTHETIC LIMBS IF AVAILABLE.**"
- And the severed limb is **an item on the ground**: "**SEVERED LIMBS ARE ITEMS WHICH ARE CREATED WHEN A
  CHARACTER LOSES A LIMB... SEVERED LIMBS MAY BE GRABBED BY BONEDOGS OR BONEYARD WOLVES WHO WILL EVENTUALLY
  EAT THEM.**"
- **Your arm has an inventory icon.** A dog can pick it up and run off with it. There is no ceremony, no
  cutscene, no music sting — the game treats your leg exactly like a rock or a piece of dried meat (cf. our
  inventory + death-math + entities; the body as loot).
- The physicality: "**ALTHOUGH IT TYPICALLY TAKES A LOT OF ATTACKS... TO REMOVE LIMBS, EVEN THE 'RARE'
  DISMEMBERMENT OPTION... STILL ALLOWS YOU TO TEAR OFF LIMBS WITH BLUNT WEAPONS OR EVEN ONE'S BARE HANDS.**"
### STAGE 3 — THE CARRY (you are cargo now)
- Cannibals "**CARRY UNCONSCIOUS ORGANIC MEMBERS OF OTHER FACTIONS TO THEIR CAMP OR VILLAGE.**"
- You are unconscious for the journey. When you open your eyes, **you are somewhere you have never been**, and
  the game does not tell you where or how far. Your squad is elsewhere, if you have one. Your gear is gone.
- Their speed: "**THEIR RUN SPEED RANGES ANYWHERE FROM 14-20MPH.**" You cannot outrun them on foot. If you
  broke a leg, that number is your death sentence and it's on a wiki page (cf. our district + logistics +
  survival accounting).
### STAGE 4 — THE CAGE (and the arithmetic of when you die)
- "**WHEN THE CAGES START TO GET FULL, THEY WILL PERIODICALLY START BEATING THEIR PRISONERS TO DEATH AND
  THROWING THEM INTO THE COOKING PITS.**"
- Sit in the cage and watch. Other prisoners are in there with you. Some of them get taken. **Your survival
  is a function of the population count**, which means new arrivals are both your company and your clock.
- The stated worst-case: "**CRUEL AND UNUSUAL DEATH: BEING CAPTURED BY FOGMEN OR CANNIBALS AND UNABLE TO
  ESCAPE BEFORE YOU'RE EATEN ALIVE BY THEM. BEAK THINGS MAY ALSO START FEASTING ON A CHARACTER THEY MANAGE
  TO KNOCK OUT**" (STARTLINGLY our death-math + survival accounting + district; the queue you can see).
### STAGE 5 — WHY THEY'RE LIKE THIS (the lore is a book you find)
- "**ACCORDING TO THE MACHINISTS' BOOK, THE 'THE CANNIBAL PLAINS: DE-EVOLUTION OF MAN?', THE 'PAINTED TRIBE'
  HAS EXISTED FOR THOUSANDS OF YEARS, AND THEY ARE SUSPECTED TO ACTUALLY BE A RACE OF 'DEVOLVED' HUMANS.**"
- The explanation is **a book with a question mark in the title**, written by a faction with an agenda,
  found in a shop. Nobody knows. The game refuses to confirm it (cf. our [READ] + recorded-vs-unrecorded +
  AMALGAMATION; the lore that is somebody's hypothesis).
- And the detail that makes them a people rather than a monster: "**THE CANNIBALS ARE KNOWN TO FEED ON ONE
  ANOTHER AS WELL, SINCE MOST OUTSIDERS AVOID THE CANNIBAL PLAINS.**" **They eat each other when you don't
  come.** Also: "**THIS FACTION HAS A VERY CLEAR HIERARCHY.**" There's a Cannibal Grand Chief. It's a
  society (cf. our faction web + entities).
- And they have their own rivals: "**CANNIBALS COULD HAVE A VAST MAJORITY OF THEIR FOOD SOURCE COMING FROM
  SHRIEKING BANDITS AS THEY OFTEN CLASH WITH ONE ANOTHER IN CANNIBAL PLAINS.**"
### STAGE 6 — THE ESCAPE (nobody wrote it)
- There is no escape quest. There is a cage with a lock, a lockpicking skill that goes up when you fail, and
  a **stealth stat**, and a body that may be missing a leg, and 870 square kilometers.
- The systemic mercy: skeletons are immune — "**THEY WILL NOT EAT SKELETONS OR ANIMALS, BUT THEY ARE STILL
  HOSTILE TO THEM.**" A robot character in the cage next to you is in a different game than you are.
### STAGE 7 — THE RESCUE THAT ISN'T ABOUT YOU
- "**CREATURE-HUNTER ORGANIZATION: THE CANNIBAL HUNTERS. THEY ARE RESPONSIBLE FOR CONTAINING THE NORTHERN
  CANNIBALS AND **HELPING STRANDED PEOPLE.** IT CAN BE SAID THAT THEY ARE ONE OF THE FEW UNAMBIGUOUSLY GOOD
  FACTIONS IN THE ENTIRE GAME.**"
- There is a faction whose entire job is coming to get people like you. They are not a quest-giver. They
  don't know your name. **They patrol.** If they happen to be nearby, you live (STARTLINGLY our faction web +
  scheduler + despair-with-a-thread-of-hope; rescue as a patrol route).
### STAGE 8 — AND THEN YOU BUY A BETTER LEG
- "**CHARACTERS WITH LOST LIMBS CAN REPLACE SAID LIMBS WITH ROBOT LIMBS.**" And: "**OBVIOUSLY, A SEVERED LIMB
  DOES NOT RECOVER AND DOES NOT GROW BACK; HOWEVER, THE WORLD OF KENSHI HAS CYBERPUNK-STYLE PROSTHETIC
  LIMBS, **SOME OF WHICH ARE VERY MUCH BETTER THAN ORGANIC LIMBS** (ALTHOUGH THE GOOD ONES ARE VERY
  EXPENSIVE). SO LOSING A LIMB IN THIS WORLD IS NOT NECESSARILY A PERMANENT HANDICAP.**"
- **The worst thing that ever happened to you becomes an upgrade path**, if you can afford it. And if you
  can't, you limp forever.
- And the world punishes you for the fix: in Holy Nation territory, "**DISABLED PEOPLE ARE BARELY TOLERATED;
  **DISABLED PEOPLE WHO USE PROSTHETICS MAY BE KILLED ON SIGHT.**"
- Punk, follow that chain: **you got eaten, you lost a leg, you bought a robot leg to keep working, and now
  a religion wants you dead for having it.** Nobody wrote that story. Three systems collided (STARTLINGLY our
  faction web + standing + district + fold + persistent consequence; the emergent tragedy with no author).
### STAGE 9 — AND THE WORLD MOVES WITHOUT YOU
- "**THE GAME INCLUDES A WORLD STATES SYSTEM WHICH CREATES REACTIONS TO DEATHS OF NOTABLE PEOPLE. THESE
  REACTIONS TO POWER VACUUMS CAN RESULT IN NEW LOCATIONS SPAWNING OR IN TOWNS BEING TAKEN OVER BY NEW
  FACTIONS.**"
- While you were in the cage, a leader died somewhere and a city changed hands. Nobody tells you (cf. our
  city-builder + faction web + generational persistence).

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- IT'S GRINDY AND THE UI FIGHTS YOU: PC Gamer "**PRAISED THE GAME'S GIANT SIZE AND SCOPE, BUT NOTED THAT THE
  GAME COULD GET 'GRINDY' AND THAT THE GAME'S UI 'CAN GET CUMBERSOME AS YOUR GROUP'S NUMBERS GROW.'**"
  LESSON (ours, direct): our single-file iPhone build lives or dies on the UI at squad scale — the cost of
  emergence is that the player has to MANAGE it.
- THE DEV ADMITS THE TOOLS AGED OUT UNDER HIM: "**BECAUSE IT TAKES ONE PERSON A LONG TIME TO BUILD A GAME, IT
  IS BUILT WITH TOOLS WHICH ARE NOW QUITE OLD, AND, ESPECIALLY IN VISUALS AND ANIMATION, THE STATE OF THE
  ART HAS MOVED ON.** LESSON (hard, ours): a twelve-year solo build ships into a world that moved; our
  single-file HTML/JS constraint is a FEATURE for exactly this reason — it doesn't rot.
- THE CHARACTERS DON'T TALK: the same admirer's honest list — "**IT IS NOT THE GAME I WOULD BUILD. YES, I
  WOULD LIKE MORE CHARACTER INTERACTION, MORE REPERTOIRE, MORE RICHLY MODELLED REPUTATION SYSTEMS, LESS
  EMPHASIS ON COMBAT.**" LESSON: total emergence buys you infinite stories and zero scenes; our quest
  factory has to supply the scenes emergence can't.
- SLAVERY IS EVERYWHERE AND THE GAME DECLINES TO JUDGE IT: "**NOTE THAT IN KENSHI SLAVERY IS NOT A SPECIAL
  KIND OF EVIL, SO THEY'RE MOSTLY CONSIDERED PROPER FELLOWS EARNING AN HONEST LIVING - **WITH THE
  ANTISLAVERS CARRYING THE MANTLE OF 'TERRORISTS' INSTEAD.**" Brilliant worldbuilding; also, "**LIKEWISE,
  YOUR CHARACTERS CAN ALSO SELL OFF DEFEATED HUMANS TO THE SLAVERS**" with no mechanical friction. LESSON
  (ours, careful): a world with no moral system lets the player do anything and MEANS nothing by it — our
  conscience system exists to be the thing Kenshi doesn't have.
- THE LORE IS A SHRUG: the cannibals' origin is "**SUSPECTED**," from a book titled with a **question
  mark**, and there's a competing theory. LESSON (double-edged): unresolved lore is honest and it also means
  a decade of forum arguments instead of a fact.
- DISMEMBERMENT IS TOO EASY IN A GAME ABOUT PERMANENCE: "**EVEN THE 'RARE' DISMEMBERMENT OPTION... STILL
  ALLOWS YOU TO TEAR OFF LIMBS WITH BLUNT WEAPONS OR EVEN ONE'S BARE HANDS.**" LESSON: if the permanent
  consequence is common, it stops being a consequence and becomes a tax.

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. DEFEAT IS A TRANSFER, NOT A DEATH: cannibals "**CARRY UNCONSCIOUS ORGANIC MEMBERS OF OTHER FACTIONS TO
    THEIR CAMP OR VILLAGE**" (cf. our death-math + fold).
W2. THE FAILURE STATE IS A STARTING POSITION: "**DEFEAT IN BATTLE? SLAVERY... GETTING DOWNED NEAR SLAVERS
    EVEN IF YOU HAVEN'T DONE ANYTHING? SLAVERY!**" (cf. our death-math + PACIFIST LAW).
W3. THE LOOT IS THE TRAP: "**A SUSPICIOUS TRAIL OF FOOD, MEDICINE AND OTHER EXPENSIVE ITEMS LEADING UP TO THE
    SECOND FLOOR**" (cf. our district + prefab factory).
W4. YOUR SEVERED ARM IS AN ITEM AND A DOG CAN EAT IT: "**SEVERED LIMBS MAY BE GRABBED BY BONEDOGS OR BONEYARD
    WOLVES WHO WILL EVENTUALLY EAT THEM**" (cf. our inventory + death-math).
W5. COMPANIONS EXIST BECAUSE OF THE BLEEDING SYSTEM: "**THEY ARE LIKELY TO BLEED OUT AND DIE BEFORE REGAINING
    CONSCIOUSNESS UNLESS THERE IS SOMEONE TO PROVIDE FIRST AID — WHICH IS WHY IT IS WISE TO ACQUIRE A
    COMPANION**" (cf. our companions + MEDICINE currency).
W6. YOUR DEATH IS A CAPACITY PROBLEM: "**WHEN THE CAGES START TO GET FULL, THEY WILL PERIODICALLY START
    BEATING THEIR PRISONERS TO DEATH AND THROWING THEM INTO THE COOKING PITS**" (cf. our survival accounting
    + logistics).
W7. THEY EAT EACH OTHER WHEN YOU DON'T COME: "**THE CANNIBALS ARE KNOWN TO FEED ON ONE ANOTHER AS WELL, SINCE
    MOST OUTSIDERS AVOID THE CANNIBAL PLAINS**" — and "**THIS FACTION HAS A VERY CLEAR HIERARCHY**" (cf. our
    faction web + entities).
W8. RESCUE IS A PATROL ROUTE, NOT A QUEST: the Cannibal Hunters are "**RESPONSIBLE FOR CONTAINING THE
    NORTHERN CANNIBALS AND HELPING STRANDED PEOPLE**" (cf. our scheduler + faction web).
W9. THE WORST THING THAT HAPPENED TO YOU BECOMES AN UPGRADE: prosthetics "**SOME OF WHICH ARE VERY MUCH
    BETTER THAN ORGANIC LIMBS (ALTHOUGH THE GOOD ONES ARE VERY EXPENSIVE)**" (cf. our fold + MEDICINE
    currency).
W10. AND THE FIX MAKES A NEW ENEMY: "**DISABLED PEOPLE WHO USE PROSTHETICS MAY BE KILLED ON SIGHT**" (cf. our
     faction web + standing).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — losing is a place + the tragedy nobody wrote
===============================================================================
Punk, **one man. Twelve years. Alone.** And what he built is the argument for our whole approach: systems
that collide into stories no writer could afford to script.
- W1/W2 (defeat is a transfer + the failure state is a starting position — our DEATH-MATH + fold + combat
  dial + PACIFIST LAW): the top port, and it's aimed straight at our roguelite spine. In Kenshi you don't
  get a game-over. **You get carried.** "**CANNIBALS WILL ATTACK OTHER FACTIONS AND CARRY UNCONSCIOUS ORGANIC
  MEMBERS OF OTHER FACTIONS TO THEIR CAMP OR VILLAGE.**" And it's the world's default: "**DEFEAT IN BATTLE?
  SLAVERY. COMMIT A CRIME? SLAVERY. GETTING DOWNED NEAR SLAVERS EVEN IF YOU HAVEN'T DONE ANYTHING?
  SLAVERY!**" Our Dead Eye Dial already has a rule — no damage before the dial — and our death-math already
  distinguishes down from dead. This is the next question: **when a dynast loses, where do they WAKE UP?**
  A faction's cage, a debt, a work crew, a hospital with a bill. Losing should relocate the story, not end
  it (ties our death-math + fold + generational persistence + combat dial + PACIFIST LAW + faction web (13
  factions) + standing + district + city-builder + persistent consequence; a top-tier port).
- W9/W10 + THE CHAIN (the worst thing becomes an upgrade + and the fix makes a new enemy — our fold +
  MEDICINE currency + faction web + standing): STEAL the whole chain, it's the best emergent tragedy in the
  book. **You get eaten. You lose a leg.** "**A SEVERED LIMB DOES NOT RECOVER AND DOES NOT GROW BACK;
  HOWEVER... CYBERPUNK-STYLE PROSTHETIC LIMBS, SOME OF WHICH ARE VERY MUCH BETTER THAN ORGANIC LIMBS
  (ALTHOUGH THE GOOD ONES ARE VERY EXPENSIVE).**" So you buy a robot leg to keep working — **and now the
  Holy Nation kills you on sight**, because "**DISABLED PEOPLE WHO USE PROSTHETICS MAY BE KILLED ON SIGHT.**"
  Nobody wrote that story. **Three systems collided.** Our MEDICINE currency + faction web + standing can do
  exactly this: the treatment that saves the dynast makes them illegal somewhere (ties our fold + MEDICINE
  currency + THREE CURRENCIES + faction web + standing + district + persistent consequence + death-math +
  conscience system + survival accounting + generational persistence).
- W5/W6 (companions exist because of the bleeding system + your death is a capacity problem — our companions
  + survival accounting + logistics): bank both. (a) **The friendship system is a medical system.** "**THEY
  ARE LIKELY TO BLEED OUT AND DIE BEFORE REGAINING CONSCIOUSNESS UNLESS THERE IS SOMEONE TO PROVIDE FIRST
  AID — WHICH IS WHY IT IS WISE TO ACQUIRE A COMPANION.**" You don't recruit people for banter. You recruit
  them because an unconscious man alone is a dead man, and the game never says it out loud. Our companions +
  MEDICINE currency should make loyalty a survival mechanic rather than a dialogue tree. (b) And you're
  eaten because **the cages filled up**: "**WHEN THE CAGES START TO GET FULL, THEY WILL PERIODICALLY START
  BEATING THEIR PRISONERS TO DEATH AND THROWING THEM INTO THE COOKING PITS.**" Not fate. **Throughput.**
  Our survival accounting should let the dynast be killed by somebody else's inventory management (ties our
  companions + MEDICINE currency + survival accounting + logistics + death-math + district + entities/
  spawning + scheduler + AMALGAMATION).
- W3/W4 (the loot is the trap + your severed arm is an item — our district + prefab factory + inventory):
  bank both, they're free. (a) A domed ruin, empty, with "**A SUSPICIOUS TRAIL OF FOOD, MEDICINE AND OTHER
  EXPENSIVE ITEMS LEADING UP TO THE SECOND FLOOR**" — and a nest at the top. **No trigger, no script: your
  greed is the trap mechanism.** Our prefab factory can bait rooms with real inventory. (b) And your arm
  comes off as **an item on the ground** that "**MAY BE GRABBED BY BONEDOGS OR BONEYARD WOLVES WHO WILL
  EVENTUALLY EAT THEM.**" No music sting. The game treats your leg like a rock (ties our district + HD tile
  repo + prefab factory + inventory macro/micro + entities/spawning + death-math + [READ] + survival
  accounting).
- W7/W8 (they eat each other when you don't come + rescue is a patrol route — our faction web + scheduler +
  despair-with-a-thread-of-hope): bank both. (a) The cannibals aren't a monster spawner — "**THE CANNIBALS
  ARE KNOWN TO FEED ON ONE ANOTHER AS WELL, SINCE MOST OUTSIDERS AVOID THE CANNIBAL PLAINS**," and "**THIS
  FACTION HAS A VERY CLEAR HIERARCHY.**" They're a society with a chief and a food shortage. Our 13 factions
  should include one that is genuinely monstrous **and internally consistent**, that eats itself when the
  dynasty stays away. (b) And the thread of hope is a **PATROL**: the Cannibal Hunters are "**RESPONSIBLE FOR
  CONTAINING THE NORTHERN CANNIBALS AND HELPING STRANDED PEOPLE... ONE OF THE FEW UNAMBIGUOUSLY GOOD
  FACTIONS.**" They don't know your name. They're on a route. If they're nearby, you live. That's our
  scheduler doing mercy (ties our faction web + entities/spawning + scheduler + district + logistics +
  despair-with-a-thread-of-hope + standing + survival accounting).
- METHOD (one man, twelve years — our FACTORY LAW + ART PHILOSOPHY): bank the whole thing. "**KENSHI'S
  DEVELOPMENT WAS PRIMARILY LED BY A SINGLE PERSON OVER THE COURSE OF TWELVE YEARS.**" And the developer who
  gave up on his own dream game watching it: "**I'VE BEEN WRITING FOR LITERALLY FIFTEEN YEARS ABOUT THE GAME
  I'D LIKE TO BUILD, BUT ASSUMED I COULDN'T BECAUSE ONE PERSON CAN'T POSSIBLY BUILD ALL THE SYSTEMS AND
  ASSETS REQUIRED FOR A FULL SCALE OPEN WORLD GAME... **THE DIFFERENCE IS, HIS IS FINISHED, IT WORKS, AND
  IT'S BEING PLAYED**... IT'S AN EXTRAORDINARY ACHIEVEMENT BY ONE MAN, WITHOUT FINANCIAL BACKING, BUT WITH A
  VISION AND OBSESSIVE PERSISTENCE.**" And note the map logic: **870 square kilometers** built "**TO PLACE
  DANGEROUS AND CHALLENGING AREAS IN BETWEEN REWARDS THAT PLAYERS MIGHT SEEK OUT**" — danger as the distance
  between prizes (ties our FACTORY LAW + ART PHILOSOPHY + VEGAS GEOGRAPHY + district + MAP LAW +
  city-builder).
- FLAWS (bank HARD): (a) OURS, DIRECT — the UI "**CAN GET CUMBERSOME AS YOUR GROUP'S NUMBERS GROW**"; our
  single-file iPhone build lives or dies at squad scale, because the cost of emergence is that the player
  must manage it; (b) OURS, HARD — "**BECAUSE IT TAKES ONE PERSON A LONG TIME TO BUILD A GAME, IT IS BUILT
  WITH TOOLS WHICH ARE NOW QUITE OLD, AND... THE STATE OF THE ART HAS MOVED ON**"; our single-file HTML/JS
  constraint is a FEATURE — it doesn't rot; (c) total emergence buys infinite stories and ZERO scenes —
  "**I WOULD LIKE MORE CHARACTER INTERACTION, MORE REPERTOIRE, MORE RICHLY MODELLED REPUTATION SYSTEMS**";
  our quest factory supplies what emergence can't; (d) OURS, CAREFUL — a world with no moral system lets the
  player do anything and MEANS nothing by it ("**YOUR CHARACTERS CAN ALSO SELL OFF DEFEATED HUMANS TO THE
  SLAVERS**"); our conscience system is the thing Kenshi doesn't have; (e) unresolved lore is honest and it
  buys a decade of forum arguments instead of a fact; and (f) if the permanent consequence is COMMON, it
  stops being a consequence and becomes a tax.

---
# V2 PAYLOAD — BACKFILLED 7/16/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**THE CANNIBALS** — want calories; you are a schedule, not an enemy. Will trade: nothing; you are not a party to anything. FUNCTION: the antagonist as PANTRY MANAGEMENT — their patrols, carry-routes, and pit rotation are logistics, and your survival window is a line in THEIR ledger.

**THE PLAYER** — wants the leg back (gone), the gear back (a trail on the ground behind the carry), and out. FUNCTION: cargo with a will.

**THE OTHER CAGED** — want out too; some are meals sooner than you. FUNCTION: the queue — the cage's real clock is WHO IS AHEAD OF YOU.

**THE CANNIBAL HUNTERS** — want cannibals dead; do not know you exist. FUNCTION: the rescue that isn't about you (stage 7) — salvation as a side effect of someone else's quest.

## V2-B THE CONVERSATIONS (node trees)

NODE: (none — Kenshi has no dialogue-quest layer here; the v2 payload documents the SYSTEM-verbs that replace it)
  The "conversation" is conducted in mechanics:
  @ the fight you lose (medical system decides limb fates, not script)
  @ the carry (you are inventory in another creature's hands — the interface itself demotes you to cargo)
  @ the cage (lockpick skill trains on the cage that holds you: IMPRISONMENT AS TRAINING MONTAGE — the questbook's blackest joke and a real mechanic)
  @ the crawl (missing a leg, you MOVE like it; the body is the dialogue)
  NOVERB: (beg / bargain / surrender) — the cannibals have no parley interface AT ALL. Cross-ref Q99/Q104 (zero-dialogue horror register, 3rd confirmation): systems-horror lives where speech is structurally impossible, not merely refused.
  THE ESCAPE (stage 6): NOBODY WROTE IT. It emerges from lockpick + patrol gaps + the hunters' raid timing. THE LAW, stated for the compile: A QUEST CAN BE AN INTERSECTION OF SYSTEMS WITH NO AUTHOR — Bohemia's factions, schedules, and death-math should be capable of producing at least one Cannibal-Cage-grade story per run that no .bq file contains. The .bq format's job is to NOT be needed for these; the engine's job is to make them possible. FACTORY LAW's inverse: the best story in the corpus was manufactured by zero content.

## V2-C THE BRANCH MAP

COUNT: unbounded (systemic); canonical exits: self-rescue via lockpick window / hunter-raid chaos exit / the pit.
STRUCTURAL FINDING FOR DEATH-MATH: LOSING IS A LOCATION (the file's title phrase). Bohemia's roguelite death should sometimes route through CAPTURE STATES instead of run-end: the dynast wakes somewhere worse, minus something (gear, a companion, [PENDING, Paolo's call: never body parts unless he rules it), and the run continues from inside the consequence. The game-over screen is the least interesting thing defeat can be.

## SOURCES
Wikipedia "Kenshi (video game)" (the build — "**KENSHI'S DEVELOPMENT WAS PRIMARILY LED BY A SINGLE PERSON OVER
THE COURSE OF TWELVE YEARS, AND IT WAS RELEASED ON DECEMBER 6, 2018... KENSHI WAS PRIMARILY DEVELOPED BY A
SINGLE PERSON, CHRIS HUNT, WHO BEGAN DEVELOPMENT AROUND 2006–2008 IN OGRE ENGINE**"; the design — "**THE GAME
FOCUSES ON SANDBOX GAMEPLAY FEATURES THAT GIVE THE PLAYER FREEDOM TO DO WHAT THEY WANT IN ITS WORLD INSTEAD OF
FOCUSING ON A LINEAR STORY**"; the damage system — "**AS PART OF THE DAMAGE SYSTEM, LIMBS CAN BE SEVERED OR
DAMAGED INDIVIDUALLY, WITH THE OPTION TO REPLACE THEM WITH PROSTHETIC LIMBS IF AVAILABLE**"; the world states —
"**THE GAME INCLUDES A WORLD STATES SYSTEM WHICH CREATES REACTIONS TO DEATHS OF NOTABLE PEOPLE. THESE REACTIONS
TO POWER VACUUMS CAN RESULT IN NEW LOCATIONS SPAWNING OR IN TOWNS BEING TAKEN OVER BY NEW FACTIONS**"; the
zones — "**ZONES IN KENSHI ARE NOT JUST AESTHETIC, AS THEY HAVE SPECIFIC QUALITIES, SUCH AS SOIL TYPES,
TERRAIN, AND RESOURCE AVAILABILITY. THESE FACTORS COME INTO PLAY WHEN PLAYERS ARE CONSTRUCTING OUTPOSTS.
WEATHER IS A CONSTANT CONCERN... WITH SOME TYPES (SUCH AS ACID RAIN) CAUSING ILL EFFECTS**"; the map — "**THE
GAME'S PLAYABLE AREA IS 870 SQUARE KILOMETRES (340 SQ MI), WHICH WAS DONE TO PLACE DANGEROUS AND CHALLENGING
AREAS IN BETWEEN REWARDS THAT PLAYERS MIGHT SEEK OUT. HUNT WANTED DIFFERENT AREAS OF THE MAP TO HAVE DIFFERENT
THEMES OR FACTIONS THAT WOULD MAKE THEM FEEL UNIQUE, SUCH AS ONE THAT TREATS FEMALE CHARACTERS DIFFERENTLY THAN
MALES**"; and the reception — "**PC GAMER'S ROBERT ZAK PRAISED THE GAME'S GIANT SIZE AND SCOPE, BUT NOTED THAT
THE GAME COULD GET 'GRINDY' AND THAT THE GAME'S UI 'CAN GET CUMBERSOME AS YOUR GROUP'S NUMBERS GROW.' ROCK,
PAPER, SHOTGUN NOTED THE GAME'S DEPTH AND COMPARED KENSHI POSITIVELY TO DWARF FORTRESS**"); Kenshi Wiki
(Fandom) "Cannibals" (the behavior — "**THE CANNIBALS (AKA THE 'PAINTED TRIBE') ARE A GROUP OF TRIBAL HUMANOIDS
NATIVE TO THE CANNIBAL PLAINS, DARKFINGER AND OTHER SURROUNDING ZONES... CANNIBALS WILL ATTACK OTHER FACTIONS
AND CARRY UNCONSCIOUS ORGANIC MEMBERS OF OTHER FACTIONS TO THEIR CAMP OR VILLAGE. WHEN THE CAGES START TO GET
FULL, THEY WILL PERIODICALLY START BEATING THEIR PRISONERS TO DEATH AND THROWING THEM INTO THE COOKING PITS.
THEY WILL NOT EAT SKELETONS OR ANIMALS, BUT THEY ARE STILL HOSTILE TO THEM. STRANGELY, SIMILAR TO SKELETONS AND
HIVERS, ALL CANNIBALS ARE IMMUNE TO ACID**"; the lore — "**ACCORDING TO THE MACHINISTS' BOOK, THE 'THE CANNIBAL
PLAINS: DE-EVOLUTION OF MAN?', THE 'PAINTED TRIBE' HAS EXISTED FOR THOUSANDS OF YEARS, AND THEY ARE SUSPECTED
TO ACTUALLY BE A RACE OF 'DEVOLVED' HUMANS. ANOTHER THEORY SUGGESTS THAT THE CANNIBALS EXISTED IN THE SAME TIME
FRAME AS THE ANCIENT LAB INHABITANTS, WITH THE LATTER BEING KILLED OFF BY MIGRATING CANNIBALS. THE CANNIBALS
ARE KNOWN TO FEED ON ONE ANOTHER AS WELL, SINCE MOST OUTSIDERS AVOID THE CANNIBAL PLAINS. THIS FACTION HAS A
VERY CLEAR HIERARCHY**"; and "**THEIR RUN SPEED RANGES ANYWHERE FROM 14-20MPH. CANNIBALS COULD HAVE A VAST
MAJORITY OF THEIR FOOD SOURCE COMING FROM SHRIEKING BANDITS AS THEY OFTEN CLASH WITH ONE ANOTHER IN CANNIBAL
PLAINS**"); Kenshi Wiki "Severed Limbs" ("**SEVERED LIMBS ARE ITEMS WHICH ARE CREATED WHEN A CHARACTER LOSES A
LIMB. CHARACTERS MUST BE OF A HUMAN, SHEK, HIVE, OR CANNIBAL/CANNIBAL SKAV RACE IN ORDER FOR A LIMB ITEM TO BE
DROPPED FOR THE CORRESPONDING LIMB. SEVERED LIMBS MAY BE GRABBED BY BONEDOGS OR BONEYARD WOLVES WHO WILL
EVENTUALLY EAT THEM. ANIMALS NEVER LOSE LIMBS. CHARACTERS WITH LOST LIMBS CAN REPLACE SAID LIMBS WITH ROBOT
LIMBS**"); TV Tropes "Kenshi" (the slavery list — "**MADE A SLAVE: SLAVERY IS VERY COMMON IN THE WORLD AND IT'S
SHOCKINGLY EASY TO GET ENSLAVED. DEFEAT IN BATTLE? SLAVERY. NOT BEING A MALE HUMAN IN THE HOLY NATION OR
ACCOMPANIED BY ONE? SLAVERY. COMMIT A CRIME? SLAVERY. GETTING DOWNED NEAR SLAVERS EVEN IF YOU HAVEN'T DONE
ANYTHING? SLAVERY! NO WONDER WHY THERE ARE SO MANY EX-SLAVE OUTLAWS ALL OVER THE WASTELAND. LIKEWISE, YOUR
CHARACTERS CAN ALSO SELL OFF DEFEATED HUMANS TO THE SLAVERS**"; the traffickers — "**HUMAN TRAFFICKERS: THE
SLAVE TRADERS, MANHUNTERS AND SLAVE HUNTERS. NOTE THAT IN KENSHI SLAVERY IS NOT A SPECIAL KIND OF EVIL, SO
THEY'RE MOSTLY CONSIDERED PROPER FELLOWS EARNING AN HONEST LIVING - WITH THE ANTISLAVERS CARRYING THE MANTLE OF
'TERRORISTS' INSTEAD**"; the dismemberment — "**MADE OF PLASTICINE: ALTHOUGH IT TYPICALLY TAKES A LOT OF
ATTACKS (OR EXTREMELY POWERFUL WEAPONS AND HIGH STATS) TO REMOVE LIMBS, EVEN THE 'RARE' DISMEMBERMENT OPTION
(WHICH ALLOWS DISMEMBERMENT ONLY ON A HIT) STILL ALLOWS YOU TO TEAR OFF LIMBS WITH BLUNT WEAPONS OR EVEN ONE'S
BARE HANDS**"; the Cannibal Hunters — "**CREATURE-HUNTER ORGANIZATION: THE CANNIBAL HUNTERS. THEY ARE
RESPONSIBLE FOR CONTAINING THE NORTHERN CANNIBALS AND HELPING STRANDED PEOPLE. IT CAN BE SAID THAT THEY ARE ONE
OF THE FEW UNAMBIGUOUSLY GOOD FACTIONS IN THE ENTIRE GAME**"; the region names — "**I DON'T LIKE THE SOUND OF
THAT PLACE: SOME REGIONS SPORT WELCOMING NAMES SUCH AS 'DEADLANDS', 'CANNIBAL PLAINS', 'THE FORBIDDEN ISLE' OR
'THE UNWANTED ZONE'. THEY ARE ALL APTLY NAMED**"; the eaters — "**I'M A HUMANITARIAN: THE CANNIBALS, THE FOGMEN
AND THE GURGLERS. THE SOUTHERN HIVE ARE ALSO IMPLIED TO BE THIS. INTERESTINGLY, THE SOUTHERN HIVE SOLDIER
PATROLS WILL SCREAM ABOUT GETTING 'MEAT FOR KING' WHEN THEY ATTACK YOU, BUT WILL NEVER CAPTURE OR BUTCHER YOU.
THEY DO ALWAYS CARRY SOME MEAT ON THEM, THOUGH**"; and the death — "**CRUEL AND UNUSUAL DEATH: BEING CAPTURED BY
FOGMEN OR CANNIBALS AND UNABLE TO ESCAPE BEFORE YOU'RE EATEN ALIVE BY THEM. BEAK THINGS MAY ALSO START FEASTING
ON A CHARACTER THEY MANAGE TO KNOCK OUT. FALLING INTO THE HANDS OF THE SKIN BANDITS MAY BE EVEN WORSE**"); TV
Tropes "NightmareFuel/Kenshi" (the world — "**YOU ARE DROPPED INTO A HOT, LARGELY BARREN WORLD LITTERED WITH THE
RUSTING REMAINS OF WHAT WAS CLEARLY A HIGHLY ADVANCED, SPACEFARING CIVILIZATION. WHAT LITTLE CIVILIZATION THAT
EXISTS TAKES THE FORM OF ISOLATED VILLAGES AND PETTY EMPIRES BUILT FROM BRICK, MUD AND SCRAP METAL. THERE IS NO
JUSTICE, DEMOCRACY OR PROGRESS OF ANY KIND TO BE FOUND... SLAVES ARE CASUALLY CAUGHT, BOUGHT AND SOLD LIKE
CATTLE AND ROAMING BANDITS WILL GLADLY BEAT YOU TO DEATH FOR A BOWL OF RICE OR A PIECE OF DRIED MEAT. OR IN SOME
CASES, YOUR OWN FLESH. SIMPLY SURVIVING IS GOING TO BE A FULL-TIME JOB OF YOURS**"; the bait — "**OUT IN THE
APPROPRIATELY-TITLED CANNIBAL PLAINS, YOU COME ACROSS A LARGE, DOMED STRUCTURE NOT UNLIKE THE ONES SOUGHT OUT BY
THE TECH HUNTERS FOR ANCIENT KNOWLEDGE. THE WHOLE PLACE IS EMPTY...EXCEPT FOR A SUSPICIOUS TRAIL OF FOOD,
MEDICINE AND OTHER EXPENSIVE ITEMS LEADING UP TO THE SECOND FLOOR. AND WHAT HAPPENS TO BE ON THE SECOND FLOOR,
YOU ASK? WHY, A NEST PACKED WITH CANNIBALS, OF COURSE! HOPE YOU DIDN'T MAKE TOO MUCH NOISE!**"; the Skin Bandits
— "**A GROUP OF SKELETONS LED BY A HUMAN NAMED SAVANT, WHO HAS CONVINCED THEM ALL TO 'BECOME HUMAN' IN A VERY
SPECIAL WAY... BY WEARING THE SHREDDED SKINS OF ANY POOR, UNFORTUNATE HUMANS THEY COME ACROSS. THEY GATHER THEIR
HUMAN SKIN ARMOR/'DISGUISES' BY PLACING VICTIMS... INTO THE APTLY NAMED 'PEELER MACHINE'**"; and the slavery
account — "**IMAGINE GOING ABOUT YOUR BUSINESS, VENTURING TO THE NEXT CITY TO GET SUPPLIES OR SIMPLY ROAMING
AROUND IN SEARCH OF FOOD. YOU GET KNOCKED OUT BY A BUNCH OF STARVING BANDITS. PAINFUL AND HUMILIATING, BUT THEY
JUST WANT YOUR FOOD. SOON, A GROUP OF ARMED MEN SWARM YOU AND START PATCHING YOUR WOUNDS. IT SEEMS LIKE A
MIRACLE FOR A FEW SECONDS UNTIL THEY SLAP THE SHACKLES ON YOU AND CARRY YOU BACK HOME TO BE WORKED TO DEATH,
WITH ONLY A TINY RUSTY CELL TO CALL A HOME. AND IT'S SO COMMONPLACE THAT MOST PEOPLE WILL JUST ACCEPT IT AS A
PART OF THEIR SOCIETY**"); journeyman.cc "What's so good about Kenshi?" (the developer's confession — "**I'VE
BEEN WRITING FOR LITERALLY FIFTEEN YEARS ABOUT THE GAME I'D LIKE TO BUILD, BUT ASSUMED I COULDN'T BECAUSE ONE
PERSON CAN'T POSSIBLY BUILD ALL THE SYSTEMS AND ASSETS REQUIRED FOR A FULL SCALE OPEN WORLD GAME. AND WHILE I
HAVE BEEN MESSING ABOUT AND PRODUCING LITERALLY ONLY TINY SCRAPS OF CODE, ONE PERSON — CHRIS HUNT — HAS ACTUALLY
DONE IT. THE GAME HE HAS CREATED — LARGELY WORKING ALONE — HAS MANY OF THE FEATURES, AND MUCH OF THE RICHNESS, OF
THE GAME I'VE BEEN WRITING ABOUT. THE DIFFERENCE IS, HIS IS FINISHED, IT WORKS, AND IT'S BEING PLAYED**"; the
definition — "**KENSHI IS A LARGE AND VISUALLY BEAUTIFUL OPEN WORLD WITH A VARIED ENVIRONMENT, DEEP LORE, A
VARIETY OF RACES AND CULTURES, AN ADEQUATELY MODELLED ECOSYSTEM AND ECONOMY, WHERE THERE IS EXTREMELY LIMITED
SCRIPTED PLOT, AND THUS WHERE MOST OF THE GAMEPLAY EMERGES ORGANICALLY FROM THE WORLD ITSELF AND FROM THE GAME
MECHANICS**"; the prosthetics — "**OBVIOUSLY, A SEVERED LIMB DOES NOT RECOVER AND DOES NOT GROW BACK; HOWEVER,
THE WORLD OF KENSHI HAS CYBERPUNK-STYLE PROSTHETIC LIMBS, SOME OF WHICH ARE VERY MUCH BETTER THAN ORGANIC LIMBS
(ALTHOUGH THE GOOD ONES ARE VERY EXPENSIVE). SO LOSING A LIMB IN THIS WORLD IS NOT NECESSARILY A PERMANENT
HANDICAP**"; the bleeding — "**THE CONSEQUENCE OF ALL THESE MECHANISMS TOGETHER IS THAT, IF YOUR CHARACTER
SUFFERS QUITE MINOR INJURIES IN A FIGHT AND BECOMES UNCONSCIOUS, THEY ARE LIKELY TO BLEED OUT AND DIE BEFORE
REGAINING CONSCIOUSNESS UNLESS THERE IS SOMEONE TO PROVIDE FIRST AID — WHICH IS WHY IT IS WISE TO ACQUIRE A
COMPANION**"; the Holy Nation — "**IN PRINCIPLE SCORCHLANDER (BLACK) MALES ARE ACCEPTABLE, BUT IN PRACTICE, THE
HOLY NATION IS OVERWHELMINGLY WHITE. DISABLED PEOPLE ARE BARELY TOLERATED; DISABLED PEOPLE WHO USE PROSTHETICS
MAY BE KILLED ON SIGHT**"; the United Cities — "**THE UNITED CITIES ARE AN EXTREME CAPITALIST OLIGARCHY. SLAVERY
IS EVERYWHERE; ORDINARY CITIZENS CAN OWN SLAVES; KIDNAPPING AND ENSLAVING PEOPLE IS A RECOGNISED AND LEGAL
TRADE; POVERTY IS A CRIME FOR WHICH YOU CAN BE IMPRISONED**"; and the verdict — "**KENSHI IS EXTRAORDINARY; AND,
AS SUCH, KENSHI IS AN EXTRAORDINARY ACHIEVEMENT. IT'S AN EXTRAORDINARY ACHIEVEMENT BY ONE MAN, WITHOUT FINANCIAL
BACKING, BUT WITH A VISION AND OBSESSIVE PERSISTENCE. IT LACKS THE POLISH OF A MULTI-MILLION DOLLAR STUDIO
PRODUCTION, TRUE. ALSO, BECAUSE IT TAKES ONE PERSON A LONG TIME TO BUILD A GAME, IT IS BUILT WITH TOOLS WHICH ARE
NOW QUITE OLD, AND, ESPECIALLY IN VISUALS AND ANIMATION, THE STATE OF THE ART HAS MOVED ON. BUT IT IS STILL
EXTRAORDINARY. IT IS NOT MY GAME. IT IS NOT THE GAME I WOULD BUILD. YES, I WOULD LIKE MORE CHARACTER INTERACTION,
MORE REPERTOIRE, MORE RICHLY MODELLED REPUTATION SYSTEMS, LESS EMPHASIS ON COMBAT. BUT THE DIFFERENCE IS, CHRIS
HUNT HAS ACTUALLY BUILT HIS**"). Cross-ref Questbook 55 (Kenshi — the whole-game teardown this was pulled from),
45 (Dwarf Fortress — the other emergent-story machine), 93 (Rust — no moral system, real dilemmas), 44 (RimWorld
— the colony as story generator), 107 (The Londoners — survival math eating mercy), 109 (Ethan's Tab — the body
you don't own), 87 (Outward — preparation over power, and the other game where losing relocates you), 88
(Project Zomboid), 100 (Vault City — the utopia built on slavery it won't name; Kenshi's Holy Nation is the
same species), 30 (This War of Mine), our death-math + fold + generational persistence + combat dial +
difficulty packages + PACIFIST LAW + faction web (13 factions) + standing + conscience system + companions +
MEDICINE currency + THREE CURRENCIES + survival accounting + logistics + inventory macro/micro + district + HD
tile repo + prefab factory + entities/spawning + scheduler + city-builder + persistent consequence + [READ] +
recorded-vs-unrecorded + AMALGAMATION + quest factory + VEGAS GEOGRAPHY + MAP LAW + FACTORY LAW + ART
PHILOSOPHY + despair-with-a-thread-of-hope + post-economic-collapse premise. FUTURE: a Chris Hunt interview
pull (twelve years, one man, no funding — the definitive solo-dev process document, and the single most
directly applicable craft text in this book to how Paolo works); a Holy Nation study (the theocracy that kills
you for a prosthetic leg — the best "the faction's doctrine is a body check" design available, directly our
faction web + standing); or a Skin Bandits / Peeler Machine pull (skeletons led by a human named **Savant** who
convinced them to "**BECOME HUMAN**" by wearing human skin — the purest AMALGAMATION-adjacent horror in the
game, and nobody wrote a quest about it either).

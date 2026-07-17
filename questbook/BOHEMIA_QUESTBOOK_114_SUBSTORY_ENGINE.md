# BOHEMIA QUESTBOOK — DEEP DIVE 114: A HUNDRED SIDE STORIES AND NOT ONE OF THEM CAN BE MISSED (The Substory Engine, Yakuza 0)
Full teardown, the whole enchilada: the game that ships **100 individual quests**, refuses to put a single
one on your map, makes them impossible to permanently miss, and turns the most feared enemy in the game into
a bank you can rob while he naps. Complete event flow of the substory system, the taxonomy, the Trouble
Finder, Mr. Shakedown, the failure-without-loss rule, the honest flaws, and Bohemia ports. STARTLINGLY
relevant to our QUEST FACTORY, our district, our standing, our survival accounting, our combat dial, + our
despair-with-a-thread-of-hope. Ryu Ga Gotoku Studio / SEGA. Reference only; Paolo does not read it. No
Bohemia quest written here.

Quest system: Substories, Yakuza 0 (2015/2017). "**A LONG-STANDING TRADITION IN THE YAKUZA SERIES ARE
SUBSTORIES. THESE ARE **MINI-DRAMAS** THAT YOU CAN ENGAGE IN IN ORDER TO HELP THE POPULACE OF JAPAN IN THEIR
LIVES.**" 100 of them. Two protagonists, two cities, 1988.

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- ONE HUNDRED INDIVIDUAL QUESTS, SHIPPED, IN ONE GAME (the volume — STARTLINGLY our QUEST FACTORY + FACTORY
  LAW): "**SUBSTORIES ARE A HUGE PART OF THE YAKUZA SERIES, AND THE PREQUEL YAKUZA 0 DIRECTOR'S CUT HAS 100
  SUBSTORIES DIVIDED BETWEEN ITS DUAL PROTAGONISTS. **KIRYU HAS MORE SUBSTORIES WITH A TOTAL OF 60, BUT
  MAJIMA STILL HAS 40 RESERVED EXCLUSIVELY FOR HIM.**"
  - Punk — that's the number. **A hundred.** Not a hundred fetch tasks: a hundred **written mini-dramas**
    with characters, turns, and endings. Our quest factory's whole thesis is that this is producible at
    volume, and Yakuza 0 is the proof it ships (STARTLINGLY our quest factory + FACTORY LAW).
- AND THEY'RE NOT ON YOUR MAP (the design — STARTLINGLY our district + [READ]): "**GIVEN THE FACT THAT THIS
  GAME **BREAKS A TRADITION OF MARKING SUBSTORIES ON THE MAP**...**"
  - "**MOST SUBSTORIES ARE STANDALONE AND CAN BE ENCOUNTERED **JUST BY WALKING AROUND THE STREETS** OF
    KAMUROCHO AND SOTENBORI.**"
  - The content finds you because you were walking. The city is the quest log (cf. our district +
    city-builder + VEGAS GEOGRAPHY + entities/spawning).
- AND YOU CANNOT MISS THEM (the mercy — direct for our quest factory): "**ALSO, WHILE YOU CAN MESS UP ON
  SUBSTORIES IN THAT YOU WON'T NECESSARILY GET THE BEST ITEMS FROM THEM, **YOU CANNOT 'MISS' SUBSTORIES IN
  TERMS OF COMPLETION OR PART OF THE STORY.**"
  - "**ALL SUBSTORIES CAN BE ACCESSED AT THE VERY END OF THE GAME RIGHT UP UNTIL YOU ENGAGE THE FINAL BOSS,
    SO DON'T FEEL LIKE YOU NECESSARILY HAVE TO GET THEM ALL DONE AS THEY APPEAR.**"
  - **Botching a substory costs you the good reward, not the story.** The distinction is everything: the
    game punishes carelessness with a worse item and never with a locked door (STARTLINGLY our quest factory
    + Megaton law + conscience system; failure that costs quality, not access).

===============================================================================
## 1. THE FULL EVENT FLOW (how the engine actually works)
===============================================================================

### STAGE 0 — THE TAXONOMY (the guide had to invent one, which tells you the system is real)
- A guide writer, doing our job for us: "**I FEEL I SHOULD PROVIDE AN EASILY REFERABLE OVERVIEW ON HOW THE
  SUBSTORIES ARE BROKEN APART.**" His categories:
  - "**NORMAL - THESE SUBSTORIES ARE TYPICAL OF THE SERIES. YOU'LL COME ACROSS SOMEONE ON THE STREET WHO
    NEEDS HELP, AND YOU CAN HELP THEM TO SOLVE THE STORY. IT MAY INVOLVE MOVING TO NEW AREAS.**"
  - "**BUSINESS - THESE ARE MORE OR LESS NORMAL SUBSTORIES, EXCEPT THEY'RE INTRICATELY TIED TO YOUR
    BUSINESS.**"
  - "**MINIGAME - SUBSTORIES TIED TO A PARTICULAR MINIGAME: POCKET CIRCUIT, TELEPHONE CLUB, OR DISCO.**"
  - "**TRAINING - ALL MASTERS HAVE THEIR OWN SUBSTORY, WHICH IS QUITE SIMPLY BEGINNING THEIR TRAINING. ONCE
    YOU START THE TRAINING, THE SUBSTORY COMPLETES.**"
  - "**SHAKEDOWN - BETWEEN THE TWO CHARACTERS, THERE ARE FOUR MEMBERS OF THE MR. SHAKEDOWN TRIBE. BEATING
    EACH OF THESE GUYS ONCE STARTS AND COMPLETES THEIR SUBSTORY.**"
- **Five types.** A quest is a mini-drama, a business hook, a minigame on-ramp, a master unlock, or a boss.
  That's a spec sheet (STARTLINGLY our FACTORY LAW + quest factory; the typed spec, which is our law).
- And the honest admission: "**MANY OTHER DISTRACTIONS IN THIS GAME ARE ALSO PUT INTO THE SUBSTORY MENU, SUCH
  AS MAKING FRIENDS WITH PEOPLE IN TOWN AND GETTING INVOLVED IN TRAINING. **THOSE TEND TO BE REALLY QUICK
  SUBSTORIES THAT JUST SET UP SOMETHING ELSE FOR LATER.**" The 100 is padded, and they say so.
### STAGE 1 — THE ON-RAMP IS A GLANCE
- "**OUTSIDE THE DON QUIJOTE IS A CONSPICUOUS LINE OF PEOPLE. SPEAK TO THE YOUNG LAD AT THE END AND HE'LL LET
  YOU KNOW IT'S A LINE-UP FOR A HOT NEW VIDEO GAME AND HE'LL BE GETTING THE LAST COPY AVAILABLE. **WHAT A
  TROOPER. LEAVE THE AREA AND COME BACK AND YOU'LL SEE THE KID BEING ACCOSTED BY A NO-GOODNIK WHO WILL TAKE
  HIS GAME.**"
- Then the chase: "**RUN DOWN THE ALLEY TOWARDS PINK ST. AND YOU'LL SEE THAT GUY GET COUNTER-ACCOSTED. NOW,
  HURRY UP PINK ST. TOWARDS TAIHEI BLVD. AND... **I THINK WE'RE GETTING THE PATTERN HERE.** BEAT THIS GUY
  DOWN (MIND HIS KNIFE) AND THEN HEAD WEST ALONG TAIHEI TO FIND THE YAKUZA GUY NEAR THE SAVE POINT. RUIN HIM
  (MIND HIS GUN?) AND YOU'LL FINALLY GET THE GAME BACK FOR THE SPROUT.**"
- **A stolen video game escalates up an entire food chain of muggers until you're taking a gun off a yakuza
  for a kid's Christmas present.** That's the shape: a tiny want, escalated through the city's actual power
  structure (STARTLINGLY our quest factory + district + faction web + city-builder).
### STAGE 2 — THE RE-ENTRY MECHANIC (leave and come back)
- Over and over in every guide: "**LEAVE THE AREA AND COME BACK.**" "**LEAVE AND COME BACK LATER ONCE THE
  MARKER APPEARS ON THE MAP.**" "**RELOAD AREAS TO RESPAWN NPCS.**"
- The quest advances **because you walked away and returned.** Time passes in footsteps. It's crude, it's
  cheap, and it means the city always has something new in it the second time (cf. our district + scheduler
  + entities/spawning; the world that restocks on re-entry).
### STAGE 3 — THE OPTIONAL SIGNPOST YOU EARN FROM A QUEST
- "**THERE IS AN ACCESSORY CALLED THE 'TROUBLE FINDER' THAT WILL PUT EXCLAMATION MARKS '!' IN SPOTS WHERE
  THEY CAN BE FOUND.**"
- "**GEAR UP: GET TROUBLE FINDER FROM KOMIAN CHEF (#79, MAJIMA CH3)—MARKS ? ICONS ON MAP.**"
- **The quest-marker system is itself a reward from a quest.** You get the map by playing the game. And the
  partial mercy: "**ALSO, ONCE YOU BEGIN A SUBSTORY, IF IT HAS A SECOND PART THAT OCCURS ELSEWHERE, YOU CAN
  FIND A '!' MARK ON YOUR MAP TO KNOW WHERE THAT SPOT IS, **EVEN IF YOU DON'T HAVE THE TROUBLE FINDER**"
  (STARTLINGLY our quest factory + district; discovery is opt-in, continuation is guaranteed).
### STAGE 4 — MR. SHAKEDOWN (the best enemy design in the genre)
- "**NEW TO YAKUZA 0 IS A SPECIAL ENEMY TYPE KNOWN AS MR. SHAKEDOWN... **HE IS ALWAYS ON THE MAP SOMEWHERE,
  SO KEEP YOUR EYES OPEN. IF THE GIANT STATURE WASN'T A GIVEAWAY, HE'LL ALSO HAVE A YEN COUNT HOVERING ABOVE
  HIS HEAD SHOWING HOW MUCH HE'S CARRYING.**"
- **The enemy has his net worth floating over his head.** He is a walking, visible, roaming bank.
- The stakes: "**IF YOU LOSE THE FIGHT, **YOU WON'T GET GAME OVER, BUT YOU WILL LOSE ALL THE MONEY YOU'RE
  CARRYING, WHICH WILL THEN BE ADDED TO HIS OWN TOTAL.** AT HIGHER AMOUNTS, THIS CAN SEEM DEVASTATING. IF ON
  THE OTHER HAND YOU DEFEAT HIM, YOU GET ALL THE YEN HE WAS LISTED AS CARRYING.**"
- **Losing is not death — it's a transfer.** (Same law as Kenshi Q110.) He takes your wallet and **the number
  over his head goes up**, which means the next fight is worth more. Your defeat is the jackpot's fuel
  (STARTLINGLY our death-math + combat dial + survival accounting; the loss that becomes the prize).
- He escalates from your wins too: "**MR. SD GETS MORE DIFFICULT THE MORE YOU DEFEAT HIM. EACH VICTORY WILL
  CAUSE HIM TO IMPROVE HIS MAXIMUM HEALTH. THIS IMPROVEMENT STOPS AFTER THE THIRD TIME YOU BEAT EACH MR. SD,
  BUT WILL BASICALLY CAP WITH THEM HAVING 4.5 BARS OF HEALTH.**"
- **And you can decline.** "**THE GOOD NEWS IS THAT IF YOU DON'T WANT TO FIGHT MR. SHAKEDOWN, YOU WON'T HAVE
  ANY TROUBLE AVOIDING HIM AS LONG AS YOU DON'T BLINDLY COLLIDE WITH HIM. **HE CAN'T RUN LIKE THE OTHER
  ENEMIES IN THE GAME, SO HE'LL JUST NOTICE YOU AND START WALKING SLOWLY TOWARDS YOU WITH MURDEROUS
  INTENT.**"
- The scariest thing in the game **cannot run.** You are never trapped; you only ever walk into him (cf. our
  PACIFIST LAW + combat dial + difficulty packages).
### STAGE 5 — AND YOU CAN ROB HIM IN HIS SLEEP
- "**THERE'S ANOTHER AWARD CALLED 'SWEET DREAMS, MR. SHAKEDOWN'. IN THIS CASE, **YOU'LL SOMETIMES FIND MR. SD
  SNOOZING IN ONE OF THE PARKS AROUND KAMUROCHO. GO UP NEXT TO HIM AND HOLD THE EXAMINE BUTTON TO START
  DRAINING HIS FUNDS. AFTER SOME TIME OF DOING THIS, YOU'LL GET A MARKER THAT HE'S WAKING UP.** EITHER
  RELEASE THE BUTTON AND WAIT FOR HIM TO SETTLE, OR SIMPLY CONTINUE AND HE'LL WAKE UP.**"
- **The hardest enemy in the game takes naps in the park, and you can pickpocket him by holding a button
  until he stirs.** It is a full stealth minigame with a tell, built for one enemy type.
- And the honest cost: "**THIS METHOD IS A VERY SLOW DRAIN, THOUGH... FURTHERMORE, **ONCE YOU BOTTOM HIM OUT,
  HE WILL NOT REPLENISH THAT MONEY, SO YOU'LL HAVE TO FIGHT HIM FOR NO RETURN TO RESUME THE PROCESS**"
  (STARTLINGLY our PACIFIST LAW + combat dial + survival accounting; the boss you can beat by not fighting,
  at a price).
### STAGE 6 — THE SUBSTORIES THEMSELVES (the range is the point)
- The titles, which are the pitch: "**#3 - PASSPORT TO PIZZA. #5 - THE HUMAN TRAFFICKING RING. #7 - HOW TO
  TRAIN YOUR DOMINATRIX. #11 - THE SHRINK-WRAPPED DREAM. #12 - MIRACLE ON TENKAICHI STREET. #19 - HEIR TO
  THE FAMILY. #55 - CALLING THE FUTURE. #64 - TOILET TALK. #69 - PATERNAL INSTINCTS. #71 - OF LOVE AND
  RAMEN. #74 - DREAM CHASER. #78 - THE DOLL GIRL.**"
- **"The Human Trafficking Ring" and "Toilet Talk" are the same content category.** That range is deliberate
  and it's the series' whole identity (cf. our quest factory + ART PHILOSOPHY + despair-with-a-thread-of-hope).
- The pizza one, in full: "**GO TO THE CHAMPION DISTRICT AND YOU'LL FIND A WOMAN ON THE GROUND AT THE BOTTOM
  RIGHT OF THE AREA. INTERACT WITH HER AND HAND OVER A HEALTH ITEM. **KIRYU WILL HAVE A HARD TIME
  UNDERSTANDING HER AND HE BELIEVES SHE WANTS HIM TO GET HER A PIZZA.** ACCEPT THE REQUEST AND HEAD OVER TO
  SMILE BURGER... **ONCE INSIDE, ASK FOR A PIZZA TO WHICH THE CLERK EXPLAINS THEY DON'T SELL PIZZAS, BUT SHE
  OFFERS TO CALL THE PIZZA PLACE FOR HIM.** AT THE ENTRANCE, THE DELIVERY GUY WILL HAND YOU THE PIZZA, THEN
  [YOU] NEED TO RETURN TO THE WOMAN BEFORE IT GETS COLD (THIS TAKES 1 MINUTE AND 30 SECONDS).**"
- A dying woman on the ground, a misheard request, a burger clerk who **phones a competitor for you**, and a
  90-second timer on a pizza. That's a complete short story with a fail state (cf. our quest factory +
  district + scheduler + entities).
### STAGE 7 — THE BRIDGE (the escort quest that's about dignity)
- Suda's substory: "**SPEAK TO HIM AND YOU'LL HAVE TO HAND OVER A HEALING ITEM TO HELP HIM RECOVER. **HE
  TELLS YOU THAT HIS DREAM IS TO CROSS THE BRIDGE WITHOUT GETTING BEATEN UP, AND HE WANTS YOU TO HELP MAKE
  THIS A REALITY.**"
- "**ACCEPT HIS REQUEST, AND AFTER THE CONVERSATION, YOU'LL HAVE TO ESCORT HIM ACROSS THE BRIDGE. **THIS CAN
  BE RATHER TRICKY ON THE HARDER DIFFICULTIES.**"
- **A man's life ambition is to walk across a bridge unharmed.** That's it. That's the quest. And his reward
  to you is the **Encounter Finder**: "**WHEN EQUIPPED, THIS ACCESSORY WILL MARK ENEMIES ON THE MAP.**" The
  man who gets beaten up every day gives you the ability to see danger coming (STARTLINGLY our district +
  standing + despair-with-a-thread-of-hope + ART PHILOSOPHY).
### STAGE 8 — AND THE ECONOMY OF FRIENDSHIP
- "**FRIENDSHIPS: 20+ FROM SUBSTORIES—MAX VIA 1-ITEM BUYS (E.G., MIHO POPPO).**" And: "**THE SUBSTORY ENDS
  AFTER AND UNLOCKS THE ABILITY TO BEFRIEND HIM THROUGHOUT THE GAME.**"
- Completing a mini-drama doesn't end the person. **It turns them into a recurring relationship** with its
  own meter, its own escalating scenes, and its own reward (cf. our standing + companions + faction web).
- And the XP: "**FARMING: SUBSTORIES = 200K+ EXP EARLY.**" The side content is the fastest progression in the
  game. **The game pays you to care about strangers.**

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- THE 100 IS PADDED AND THE GUIDES SAY SO: "**MANY OTHER DISTRACTIONS IN THIS GAME ARE ALSO PUT INTO THE
  SUBSTORY MENU, SUCH AS MAKING FRIENDS WITH PEOPLE IN TOWN AND GETTING INVOLVED IN TRAINING. **THOSE TEND TO
  BE REALLY QUICK SUBSTORIES THAT JUST SET UP SOMETHING ELSE FOR LATER.**" Four of the hundred are literally
  "punch Mr. Shakedown once." LESSON (ours, sharp): our quest factory can hit volume, but if the count
  includes tutorials and unlocks, the number is marketing — count what's actually a story.
- THE NUMBERING IS BROKEN AND SHIPPED: "**SOME OF THE SUBSTORY NUMBERS ARE DOUBLED UP (BOTH KIRYU AND MAJIMA
  HAVE A SUBSTORY #49, FOR EXAMPLE), BUT THERE ARE STILL 100 SUBSTORIES IN TOTAL. **BECAUSE OF THIS DOUBLING,
  THERE ARE NO SUBSTORIES FOR 83-88.**" LESSON: our verdict workflow + repo files exist so our own IDs never
  do this (we already have two #102s — fix at compile).
- NO MARKERS MEANS GUIDES ARE MANDATORY: the game "**BREAKS A TRADITION OF MARKING SUBSTORIES ON THE MAP,**"
  so every player uses a checklist. LESSON (double-edged): unmarked content feels alive AND converts your
  audience into guide-readers, which means they experience your writing **in a list**.
- THE BEST-OUTCOME CHOICES ARE UNSIGNPOSTED SCRIPTS: "**CHOICES: FOLLOW GUIDES FOR BEST ENDINGS.**" The
  dominatrix substory's optimal answers are a memorized sequence. LESSON (~2nd confirmation, with Q106): if
  the scene has one correct script, it's a memory quiz, not a performance.
- THE TONE WHIPLASH IS REAL: "**#5 - THE HUMAN TRAFFICKING RING**" sits next to "**#64 - TOILET TALK.**" And
  a guide notes a roleplay scene happens "**IN THE PARK (IN VIEW OF CHILDREN, BECAUSE WHATEVER).**" LESSON
  (ours, careful): our despair-with-a-thread-of-hope needs the comedy, and tonal range without tonal
  JUDGMENT reads as not caring about either mode.
- MR. SHAKEDOWN IS EXPLOITABLE INTO IRRELEVANCE: "**FARM ¥1M+ RUNS.**" Once you know the loop, the game's
  economy dies. LESSON: our survival accounting must survive the player's discovery of the optimal loop.

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. ONE HUNDRED WRITTEN MINI-DRAMAS SHIPPED IN ONE GAME: "**KIRYU HAS MORE SUBSTORIES WITH A TOTAL OF 60, BUT
    MAJIMA STILL HAS 40**" (cf. our quest factory + FACTORY LAW).
W2. THEY'RE NOT ON THE MAP: the game "**BREAKS A TRADITION OF MARKING SUBSTORIES ON THE MAP**"; they're found
    "**JUST BY WALKING AROUND THE STREETS**" (cf. our district + city-builder).
W3. YOU CANNOT MISS THEM: "**YOU CANNOT 'MISS' SUBSTORIES IN TERMS OF COMPLETION**"; failure costs the good
    item, not the story (cf. our quest factory + Megaton law).
W4. THE SYSTEM HAS A TYPED SPEC: **Normal / Business / Minigame / Training / Shakedown** (cf. our FACTORY LAW
    + quest factory).
W5. THE MARKER SYSTEM IS ITSELF A QUEST REWARD: the **Trouble Finder** "**WILL PUT EXCLAMATION MARKS '!' IN
    SPOTS WHERE THEY CAN BE FOUND**" (cf. our quest factory + district).
W6. THE ENEMY WEARS HIS NET WORTH: "**HE'LL ALSO HAVE A YEN COUNT HOVERING ABOVE HIS HEAD SHOWING HOW MUCH
    HE'S CARRYING**" (cf. our combat dial + survival accounting).
W7. LOSING IS A TRANSFER, AND IT RAISES THE POT: "**YOU WON'T GET GAME OVER, BUT YOU WILL LOSE ALL THE MONEY
    YOU'RE CARRYING, WHICH WILL THEN BE ADDED TO HIS OWN TOTAL**" (cf. our death-math + combat dial).
W8. THE SCARIEST THING IN THE GAME CANNOT RUN: "**HE CAN'T RUN LIKE THE OTHER ENEMIES IN THE GAME, SO HE'LL
    JUST NOTICE YOU AND START WALKING SLOWLY TOWARDS YOU WITH MURDEROUS INTENT**" (cf. our PACIFIST LAW +
    difficulty packages).
W9. YOU CAN ROB THE BOSS WHILE HE NAPS: "**GO UP NEXT TO HIM AND HOLD THE EXAMINE BUTTON TO START DRAINING
    HIS FUNDS... YOU'LL GET A MARKER THAT HE'S WAKING UP**" (cf. our PACIFIST LAW + combat dial).
W10. A MAN'S LIFE AMBITION IS TO CROSS A BRIDGE: "**HIS DREAM IS TO CROSS THE BRIDGE WITHOUT GETTING BEATEN
     UP**" — and he pays you in the ability to see danger (cf. our district + despair-with-a-thread-of-hope).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — a hundred quests, none on the map, none missable
===============================================================================
Punk, this is the only entry in the book that's here for **PRODUCTION**, not craft. It's proof that our
quest factory's target number is achievable, and it hands us the spec.
- W1/W4 (a hundred written mini-dramas + the system has a typed spec — our QUEST FACTORY + FACTORY LAW): the
  top port. **60 + 40 = 100 individual quests**, shipped, in one game, each with characters and an ending.
  And the taxonomy a guide writer had to reverse-engineer is a **spec sheet**: "**NORMAL... BUSINESS...
  MINIGAME... TRAINING... SHAKEDOWN.**" Five types: the street drama, the one wired to your business, the
  one that on-ramps a minigame, the one that unlocks a teacher, the one that's a boss. Our FACTORY LAW says
  every system is a factory with a typed spec, a generator, batch volume, metadata tagging, a kill/approve
  pipeline, and a regression gate. **Yakuza 0 is that law with a shipping date.** Our quest factory should
  steal these five types verbatim as its first typed spec (ties our quest factory + FACTORY LAW + district +
  city-builder + faction web + standing + companions + Liberate/Respect/Become; a top-tier port).
- W2/W3/W5 (they're not on the map + you cannot miss them + the marker system is itself a quest reward — our
  district + quest factory + Megaton law): STEAL all three, and W3 is the one that matters most. **"You
  cannot 'miss' substories in terms of completion."** Botch one and you get a worse item — **never a locked
  door.** And: "**ALL SUBSTORIES CAN BE ACCESSED AT THE VERY END OF THE GAME RIGHT UP UNTIL YOU ENGAGE THE
  FINAL BOSS.**" Compare Q112's Legendary Perception check that hides the murder's answer forever, and every
  THEME-IN-OPTIONAL-IS-MISSED finding in this book — Yakuza's answer is: **hide the content in the city,
  never behind a lock.** And the **Trouble Finder** — the marker system — is itself a reward from substory
  #79. You earn your map by playing. Our district + quest factory: content found by walking, continuation
  always signposted, discovery opt-in (ties our district + city-builder + VEGAS GEOGRAPHY + quest factory +
  Megaton law + conscience system + entities/spawning + scheduler + [READ]).
- W6/W7/W8/W9 (the enemy wears his net worth + losing is a transfer that raises the pot + the scariest thing
  can't run + you can rob him while he naps — our COMBAT DIAL + death-math + survival accounting + PACIFIST
  LAW): STEAL the whole Mr. Shakedown design, it's four laws in one enemy. (a) **He has a yen count floating
  over his head.** The threat is legible and priced. (b) **Losing isn't death — "YOU WON'T GET GAME OVER, BUT
  YOU WILL LOSE ALL THE MONEY YOU'RE CARRYING, WHICH WILL THEN BE ADDED TO HIS OWN TOTAL."** Your defeat
  **raises the jackpot**, so the loss creates the next opportunity (same law as Kenshi Q110: losing is a
  transfer). (c) **He cannot run.** "**HE'LL JUST NOTICE YOU AND START WALKING SLOWLY TOWARDS YOU WITH
  MURDEROUS INTENT.**" You are never trapped — you only ever walk into him, which makes every fight consent.
  (d) And **you can drain him in his sleep** by holding a button until he stirs — with a real cost: "**ONCE
  YOU BOTTOM HIM OUT, HE WILL NOT REPLENISH THAT MONEY, SO YOU'LL HAVE TO FIGHT HIM FOR NO RETURN.**" Our
  combat dial + death-math + PACIFIST LAW want all four (ties our combat dial + difficulty packages +
  death-math + survival accounting + THREE CURRENCIES + PACIFIST LAW + entities/spawning + district +
  city-builder + persistent consequence).
- W10 + THE PIZZA (a man's life ambition is to cross a bridge + the misheard request — our district +
  despair-with-a-thread-of-hope + ART PHILOSOPHY): bank both, they're the tone. (a) **Suda's dream is to
  walk across a bridge without getting beaten up.** You escort him. And he pays you with the **Encounter
  Finder** — "**THIS ACCESSORY WILL MARK ENEMIES ON THE MAP**" — **the man who gets beaten up every day gives
  you the power to see danger coming.** (b) And a dying woman on the ground, whose request Kiryu mishears as
  "pizza," so he goes to a burger place, and **the clerk phones a competitor for him**, and there's a
  90-second timer before it gets cold. Our quest factory needs both registers: the tiny dignified want and
  the absurd errand, treated with the same seriousness (ties our district + entities/spawning + scheduler +
  standing + companions + quest factory + ART PHILOSOPHY + despair-with-a-thread-of-hope + city-builder).
- THE FRIENDSHIP ECONOMY (our standing + companions): bank it. "**THE SUBSTORY ENDS AFTER AND UNLOCKS THE
  ABILITY TO BEFRIEND HIM THROUGHOUT THE GAME**"; "**FRIENDSHIPS: 20+ FROM SUBSTORIES.**" Finishing a
  mini-drama doesn't close the person — **it opens a relationship with a meter.** And "**SUBSTORIES = 200K+
  EXP EARLY**": the side content is the fastest progression in the game. **The game pays you to care about
  strangers**, and that's a design position, not an accident (ties our standing + companions + faction web +
  quest factory + city-builder + district + survival accounting).
- FLAWS (bank HARD): (a) OURS, SHARP — IF THE COUNT INCLUDES TUTORIALS AND UNLOCKS, THE NUMBER IS MARKETING:
  "**THOSE TEND TO BE REALLY QUICK SUBSTORIES THAT JUST SET UP SOMETHING ELSE FOR LATER**," and four of the
  hundred are "punch Mr. Shakedown once"; count what's actually a story; (b) OURS, IMMEDIATE — THE NUMBERING
  IS BROKEN AND SHIPPED: "**SOME OF THE SUBSTORY NUMBERS ARE DOUBLED UP... BECAUSE OF THIS DOUBLING, THERE
  ARE NO SUBSTORIES FOR 83-88**"; **we already have two #102s — fix at compile**; (c) unmarked content feels
  alive AND converts your audience into guide-readers who meet your writing in a list; (d) ~2ND CONFIRMATION
  (with Q106) — "**CHOICES: FOLLOW GUIDES FOR BEST ENDINGS**"; a scene with one correct script is a memory
  quiz; (e) OURS, CAREFUL — tonal range without tonal JUDGMENT reads as not caring about either mode ("**THE
  HUMAN TRAFFICKING RING**" next to "**TOILET TALK**"; a roleplay scene "**IN VIEW OF CHILDREN, BECAUSE
  WHATEVER**"); and (f) our survival accounting must survive the player's discovery of the optimal loop
  ("**FARM ¥1M+ RUNS**").

---
# V2 PAYLOAD — BACKFILLED 7/16/26 (FORMAT LAW v2). Original content above untouched.
# (#114 is the substory ENGINE file — the v2 payload documents the SYSTEM's cast/conversations/branches.)

## V2-A CAST + WHAT EACH ONE WANTS (the system's cast)

**THE 100 SUBSTORIES** — want to be tripped over, not tracked. FUNCTION: density without markers — the on-ramp is a GLANCE (stage 1), the map stays clean, and nothing can be permanently missed (stage 2's re-entry rule).

**MR. SHAKEDOWN** — wants your money; is the best enemy design in the genre (stage 4) because losing to him is a TRANSACTION, not a death — he takes your cash and leaves you your life, and you can rob it all back while he naps (stage 5). FUNCTION: the walking bank / the fear that has a refund policy.

**THE TROUBLE FINDER (earned signpost, stage 3)** — wants to be earned. FUNCTION: the compromise between markers and none: you BUY the map layer with play, so guidance is a REWARD, not a default.

**THE BRIDGE ESCORT (stage 7)** — the escort quest about dignity. FUNCTION: proof the engine's range covers farce to grief on the same street grid.

## V2-B THE CONVERSATIONS (the engine's grammar, as node law)

NODE-LAW 1: THE GLANCE ON-RAMP — every substory entry is a VISIBLE ODDITY in the world (a posture, a crowd, a sound), never a UI element. .bq conversion: quest entry conditions should include SEEN: gates (the dynast walked within sightline), not journal pings.
NODE-LAW 2: RE-ENTRY — walking away mid-substory pauses, never fails. FAILURE-WITHOUT-LOSS (the file's rule): a botched beat re-offers later. Bohemia's 120 BPM world: substory states persist across days; the district remembers where you left the joke.
NODE-LAW 3: MR. SHAKEDOWN AS CONVERSATION — the "dialogue" is economic: he speaks in deductions. The loss-transaction teaches more about the money system than any tutorial. Bohemia port: one recurring figure per act whose combat is a LEDGER EVENT (losing costs currency, never the run) — the combat dial's stakes dial, demonstrated.
  NOVERB: (report him / remove him) — the district cannot be rid of him; he is weather with a wallet.
NODE-LAW 4: RANGE IS THE POINT (stage 6) — the same engine hosts toilet farce and quiet grief. The .bq tag vocabulary should enforce RANGE AT THE BATCH LEVEL: any 10-quest cook must span at least 3 tonal tags, validator-checked. FACTORY LAW addition, proposed. [PENDING, Paolo's call.]

## V2-C THE BRANCH MAP (the engine's)

COUNT: 100 stories × (found / not-yet) × re-entry states; ZERO permanently missable.
STRUCTURAL FINDING, THE BIG ONE FOR THE QUEST FACTORY: this file is the production spec the factory should be audited against — no map markers, glance on-ramps, re-entry everywhere, failure-without-loss, guidance as earned reward, range enforced. Convert these six into `bohemia_tests.js` assertions when the quest engine lands. CONSEQUENCE BEFORE CONTENT (Q123): the six rules exist BEFORE the 100 quests do.

## SOURCES
GameFAQs "Yakuza 0 Walkthrough & Guide" (CyricZ — the definition — "**A LONG-STANDING TRADITION IN THE YAKUZA
SERIES ARE SUBSTORIES. THESE ARE MINI-DRAMAS THAT YOU CAN ENGAGE IN IN ORDER TO HELP THE POPULACE OF JAPAN IN
THEIR LIVES. THESE SUBSTORIES ARE ALMOST ALL ENTIRELY OPTIONAL, AND YOU'LL HAVE TO SEEK THEM OUT IN ORDER TO GET
INVOLVED. IN ADDITION TO GIVING YOU FIGHTS TO BUILD YOURSELF UP, MANY SUBSTORIES WILL ALSO LEAD TO ITEMS THAT
YOU COULD NOT OTHERWISE GET NORMALLY. STILL OTHERS TIE INTO MINIGAMES OR YOUR BUSINESS. THERE ARE 100
SUBSTORIES IN THIS GAME... MANY OTHER DISTRACTIONS IN THIS GAME ARE ALSO PUT INTO THE SUBSTORY MENU, SUCH AS
MAKING FRIENDS WITH PEOPLE IN TOWN AND GETTING INVOLVED IN TRAINING. THOSE TEND TO BE REALLY QUICK SUBSTORIES
THAT JUST SET UP SOMETHING ELSE FOR LATER. ALSO, WHILE YOU CAN MESS UP ON SUBSTORIES IN THAT YOU WON'T
NECESSARILY GET THE BEST ITEMS FROM THEM, YOU CANNOT 'MISS' SUBSTORIES IN TERMS OF COMPLETION OR PART OF THE
STORY. ALL SUBSTORIES CAN BE ACCESSED AT THE VERY END OF THE GAME RIGHT UP UNTIL YOU ENGAGE THE FINAL BOSS, SO
DON'T FEEL LIKE YOU NECESSARILY HAVE TO GET THEM ALL DONE AS THEY APPEAR. SOME GAMES IN THE SERIES HAVE OFFERED
MARKERS NOTING WHERE SUBSTORIES ARE. WHILE THAT'S UNAVAILABLE AT THE OUTSET OF THIS GAME, THERE IS AN ACCESSORY
CALLED THE 'TROUBLE FINDER' THAT WILL PUT EXCLAMATION MARKS '!' IN SPOTS WHERE THEY CAN BE FOUND. ALSO, ONCE
YOU BEGIN A SUBSTORY, IF IT HAS A SECOND PART THAT OCCURS ELSEWHERE, YOU CAN FIND A '!' MARK ON YOUR MAP TO KNOW
WHERE THAT SPOT IS, EVEN IF YOU DON'T HAVE THE TROUBLE FINDER**"; the taxonomy — "**GIVEN THE FACT THAT THIS
GAME BREAKS A TRADITION OF MARKING SUBSTORIES ON THE MAP, I FEEL I SHOULD PROVIDE AN EASILY REFERABLE OVERVIEW
ON HOW THE SUBSTORIES ARE BROKEN APART... NORMAL - THESE SUBSTORIES ARE TYPICAL OF THE SERIES. YOU'LL COME
ACROSS SOMEONE ON THE STREET WHO NEEDS HELP, AND YOU CAN HELP THEM TO SOLVE THE STORY. IT MAY INVOLVE MOVING TO
NEW AREAS TO CONTINUE OR COMPLETE THE STORY. BUSINESS - THESE ARE MORE OR LESS NORMAL SUBSTORIES, EXCEPT THEY'RE
INTRICATELY TIED TO YOUR BUSINESS. THIS IS MORE OBVIOUS IN THE CABARET CLUB CZAR SET BUT THERE ARE ALSO A FEW
THAT ARE SPECIFIC TO REAL ESTATE ROYALE. MINIGAME - SUBSTORIES TIED TO A PARTICULAR MINIGAME: POCKET CIRCUIT,
TELEPHONE CLUB, OR DISCO. TRAINING - ALL MASTERS HAVE THEIR OWN SUBSTORY, WHICH IS QUITE SIMPLY BEGINNING THEIR
TRAINING. ONCE YOU START THE TRAINING, THE SUBSTORY COMPLETES. SHAKEDOWN - BETWEEN THE TWO CHARACTERS, THERE ARE
FOUR MEMBERS OF THE MR. SHAKEDOWN TRIBE. BEATING EACH OF THESE GUYS ONCE STARTS AND COMPLETES THEIR SUBSTORY**";
the substory titles — "**#3 - PASSPORT TO PIZZA #4 - KAMUROCHO UNDERCOVER #5 - THE HUMAN TRAFFICKING RING #6 -
DAMNED YANKI #7 - HOW TO TRAIN YOUR DOMINATRIX #11 - THE SHRINK-WRAPPED DREAM #12 - MIRACLE ON TENKAICHI STREET
#19 - HEIR TO THE FAMILY #49 - FROM THE HEART #50 - THE ENTERTAINER'S THRONE #55 - CALLING THE FUTURE #64 -
TOILET TALK #69 - PATERNAL INSTINCTS #71 - OF LOVE AND RAMEN #74 - DREAM CHASER #78 - THE DOLL GIRL**"; the
video-game chase — "**OUTSIDE THE DON QUIJOTE IS A CONSPICUOUS LINE OF PEOPLE. SPEAK TO THE YOUNG LAD AT THE END
AND HE'LL LET YOU KNOW IT'S A LINE-UP FOR A HOT NEW VIDEO GAME AND HE'LL BE GETTING THE LAST COPY AVAILABLE.
WHAT A TROOPER. LEAVE THE AREA AND COME BACK AND YOU'LL SEE THE KID BEING ACCOSTED BY A NO-GOODNIK WHO WILL TAKE
HIS GAME. RUN DOWN THE ALLEY TOWARDS PINK ST. AND YOU'LL SEE THAT GUY GET COUNTER-ACCOSTED. NOW, HURRY UP PINK
ST. TOWARDS TAIHEI BLVD. AND... I THINK WE'RE GETTING THE PATTERN HERE. BEAT THIS GUY DOWN (MIND HIS KNIFE) AND
THEN HEAD WEST ALONG TAIHEI TO FIND THE YAKUZA GUY NEAR THE SAVE POINT. RUIN HIM (MIND HIS GUN?) AND YOU'LL
FINALLY GET THE GAME BACK FOR THE SPROUT**"; and the dominatrix script — "**HERE ARE THE OPTIONS FOR THE
RESPONSES: THIS FIRST OPTION IS FOR BEING A SUCCESSFUL DOMINATRIX. FIRST IS 'WHO GAVE YOU PERMISSION TO SPEAK,
PIG!?'... NOW, THE KIDS SHOW UP**" and "**YOU'LL HEAD TO THE PARK (IN VIEW OF CHILDREN, BECAUSE WHATEVER)**");
GameFAQs "Mr. Shakedown" (CyricZ — "**NEW TO YAKUZA 0 IS A SPECIAL ENEMY TYPE KNOWN AS MR. SHAKEDOWN. HE GETS A
FOCUS, SO I FELT IT IMPORTANT TO GIVE HIM HIS OWN SECTION. MR. SHAKEDOWN IS ACTUALLY A SERIES OF SEVERAL LARGE
AND MUSCULAR GENTLEMEN WHO OCCUPY BOTH KAMUROCHO AND SOTENBORI. AFTER YOU GET INTRODUCED TO THE FIRST ONE IN
CHAPTER 2, HE'LL BE FOUND ROAMING THE STREETS. HE IS ALWAYS ON THE MAP SOMEWHERE, SO KEEP YOUR EYES OPEN. IF THE
GIANT STATURE WASN'T A GIVEAWAY, HE'LL ALSO HAVE A YEN COUNT HOVERING ABOVE HIS HEAD SHOWING HOW MUCH HE'S
CARRYING. THE MAIN IDEA BEHIND THIS GUY IS THAT HE'S LOOKING TO SHAKE YOU DOWN, AS IN STEAL ALL YOUR MONEY, AND
HE'S A DIFFICULT FIGHT THAT HITS HARD. IF YOU LOSE THE FIGHT, YOU WON'T GET GAME OVER, BUT YOU WILL LOSE ALL THE
MONEY YOU'RE CARRYING, WHICH WILL THEN BE ADDED TO HIS OWN TOTAL. AT HIGHER AMOUNTS, THIS CAN SEEM DEVASTATING.
IF ON THE OTHER HAND YOU DEFEAT HIM, YOU GET ALL THE YEN HE WAS LISTED AS CARRYING, AS WELL AS ANY YEN YOU
'SHOOK' OFF HIM DURING THE FIGHT**"; the escalation — "**MR. SD GETS MORE DIFFICULT THE MORE YOU DEFEAT HIM.
EACH VICTORY WILL CAUSE HIM TO IMPROVE HIS MAXIMUM HEALTH, THIS IMPROVEMENT STOPS AFTER THE THIRD TIME YOU BEAT
EACH MR. SD, BUT WILL BASICALLY CAP WITH THEM HAVING 4.5 BARS OF HEALTH, WHICH IS NO SMALL FEAT**"; the
avoidance — "**THE GOOD NEWS IS THAT IF YOU DON'T WANT TO FIGHT MR. SHAKEDOWN, YOU WON'T HAVE ANY TROUBLE
AVOIDING HIM AS LONG AS YOU DON'T BLINDLY COLLIDE WITH HIM. HE CAN'T RUN LIKE THE OTHER ENEMIES IN THE GAME, SO
HE'LL JUST NOTICE YOU AND START WALKING SLOWLY TOWARDS YOU WITH MURDEROUS INTENT. FURTHERMORE, IF YOU HAVE THE
'ENCOUNTER FINDER' ITEM EQUIPPED (WHICH YOU CAN GET FROM SUBSTORIES #23 AND #58) THEN HE'LL SHOW UP ON THE MAP AS
A PURPLE ARROW**"; and the nap — "**THERE'S ANOTHER AWARD CALLED 'SWEET DREAMS, MR. SHAKEDOWN'. IN THIS CASE,
YOU'LL SOMETIMES FIND MR. SD SNOOZING IN ONE OF THE PARKS AROUND KAMUROCHO. GO UP NEXT TO HIM AND HOLD THE
EXAMINE BUTTON TO START DRAINING HIS FUNDS. AFTER SOME TIME OF DOING THIS, YOU'LL GET A MARKER THAT HE'S WAKING
UP. EITHER RELEASE THE BUTTON AND WAIT FOR HIM TO SETTLE, OR SIMPLY CONTINUE AND HE'LL WAKE UP. THIS METHOD IS A
VERY SLOW DRAIN, THOUGH, SO I'D ONLY USE IT IF YOU NEED SOME QUICK CASH. FURTHERMORE, ONCE YOU BOTTOM HIM OUT, HE
WILL NOT REPLENISH THAT MONEY, SO YOU'LL HAVE TO FIGHT HIM FOR NO RETURN TO RESUME THE PROCESS**"); PSNProfiles
"Yakuza 0 - Substory and Friendship Guide" (Suda's bridge — "**SPEAK TO HIM AND YOU'LL HAVE TO HAND OVER A
HEALING ITEM TO HELP HIM RECOVER. HE TELLS YOU THAT HIS DREAM IS TO CROSS THE BRIDGE WITHOUT GETTING BEATEN UP,
AND HE WANTS YOU TO HELP MAKE THIS A REALITY. ACCEPT HIS REQUEST, AND AFTER THE CONVERSATION, YOU'LL HAVE TO
ESCORT HIM ACROSS THE BRIDGE. THIS CAN BE RATHER TRICKY ON THE HARDER DIFFICULTIES... AFTER DEFEATING THEM, SUDA
WILL THANK YOU AND HANDS OVER THE ENCOUNTER FINDER ACCESSORY AS A REWARD. WHEN EQUIPPED, THIS ACCESSORY WILL MARK
ENEMIES ON THE MAP INCLUDING THE MR. SHAKEDOWN'S**"; the pizza — "**GO TO THE CHAMPION DISTRICT AND YOU'LL FIND A
WOMAN ON THE GROUND AT THE BOTTOM RIGHT OF THE AREA. INTERACT WITH HER AND HAND OVER A HEALTH ITEM. KIRYU WILL
HAVE A HARD TIME UNDERSTANDING HER AND HE BELIEVES SHE WANTS HIM TO GET HER A PIZZA. ACCEPT THE REQUEST AND HEAD
OVER TO SMILE BURGER ON NAKAMICHI STREET. ONCE INSIDE, ASK FOR A PIZZA TO WHICH THE CLERK EXPLAINS THEY DON'T
SELL PIZZAS, BUT SHE OFFERS TO CALL THE PIZZA PLACE FOR HIM. AT THE ENTRANCE, THE DELIVERY GUY WILL HAND YOU THE
PIZZA, THEN NEED TO RETURN TO THE WOMAN BEFORE IT GETS COLD (THIS TAKES 1 MINUTE AND 30 SECONDS)**"; and Bacchus
— "**AS YOU EXIT PUBLIC PARK 3 AFTER GIVING THE HOMELESS PEOPLE SOME ALCOHOL, BACCHUS WILL CALL OUT TO YOU.
SIMPLY FOLLOW HIM TO THE ALLEY AND HE ASKS KIRYU TO BE HIS BODYGUARD IN EXCHANGE FOR SOME TECHNIQUES**");
GameRant "All 100 Substory Locations in Yakuza 0 Director's Cut" (the split — "**SUBSTORIES ARE A HUGE PART OF
THE YAKUZA SERIES, AND THE PREQUEL YAKUZA 0 DIRECTOR'S CUT HAS 100 SUBSTORIES DIVIDED BETWEEN ITS DUAL
PROTAGONISTS. KIRYU HAS MORE SUBSTORIES WITH A TOTAL OF 60, BUT MAJIMA STILL HAS 40 RESERVED EXCLUSIVELY FOR HIM.
NEW SUBSTORIES ARE UNLOCKED AS YOU PROGRESS THROUGH THE MAIN STORYLINE OF YAKUZA 0, BUT QUITE A FEW OF THEM ARE
AVAILABLE RIGHT FROM THE START OF THE GAME. MOST SUBSTORIES ARE STANDALONE AND CAN BE ENCOUNTERED JUST BY WALKING
AROUND THE STREETS OF KAMUROCHO AND SOTENBORI. SOME OF THEM ARE QUEST CHAINS, HOWEVER, SO YOU'LL HAVE TO COMPLETE
THOSE ONE BY ONE SO YOU DON'T MISS ANY STORY BEATS**"; and the numbering bug — "**SOME OF THE SUBSTORY NUMBERS
ARE DOUBLED UP (BOTH KIRYU AND MAJIMA HAVE A SUBSTORY #49, FOR EXAMPLE), BUT THERE ARE STILL 100 SUBSTORIES IN
TOTAL. BECAUSE OF THIS DOUBLING, THERE ARE NO SUBSTORIES FOR 83-88. DON'T WORRY IF YOU SEE THOSE NUMBERS MISSING;
YOU'RE STILL ON TRACK FOR 100% COMPLETION WITHOUT THEM**"); md-eksperiment.org "Yakuza 0 100 Substories Full
Guide" (the meta — "**GEAR UP: GET TROUBLE FINDER FROM KOMIAN CHEF (#79, MAJIMA CH3)—MARKS ? ICONS ON MAP. ORDER:
CLEAR BY CHAPTER FOR PREREQS. RELOAD AREAS TO RESPAWN NPCS. CHOICES: FOLLOW GUIDES FOR BEST ENDINGS. FARMING:
SUBSTORIES = 200K+ EXP EARLY; PAIR WITH REAL ESTATE ROYALE... MR. SHAKEDOWN: POST-FINDER, FARM ¥1M+ RUNS (BEAST
STYLE). FRIENDSHIPS: 20+ FROM SUBSTORIES—MAX VIA 1-ITEM BUYS**"); TheGamer "Yakuza 0: The 10 Best Majima
Substories, Ranked" (the drug trial — "**MAJIMA IS GIVEN THREE EXPERIMENTAL DRUGS, HOWEVER, THEY ALL HAVE
NEGATIVE EFFECTS ON HIM. YOU'RE TASKED WITH BEATING A GROUP OF ENEMIES IN A TIME LIMIT WHILE UNDER THE INFLUENCE
OF SAID DRUGS. YOU'RE HANDSOMELY REWARDED, AS YOU ARE ACTUALLY GIVEN THE TEN MILLION YEN. MAJIMA DOESN'T WANT TO
STICK AROUND THOUGH AND RUNS AWAY VOWING TO NEVER TRY SOMETHING LIKE IT AGAIN**"; Mr. Libido — "**THE SUBSTORY
ITSELF IS NOT PARTICULARLY LONG, IN FACT, IT IS ONLY THE MEETING WITH MR. LIBIDO. THE SUBSTORY ENDS AFTER AND
UNLOCKS THE ABILITY TO BEFRIEND HIM THROUGHOUT THE GAME**"; and the tax lady — "**TURNS OUT, THE MAN WAS A
POLITICIAN AND ASKS MAJIMA ABOUT HOW HE FEELS ABOUT SOME OF THE THINGS HE'S TRYING TO PROPOSE. MUCH OF IT
INVOLVES RAISING TAXES, AND MAJIMA GIVES THE MAN CONFIDENCE IN HIS CHOICE. AFTER THE SUBSTORY ENDS, MAJIMA
REALIZES THAT HE MIGHT BE THE REASON THAT TAXES ARE ABOUT [TO] RISE**"). Cross-ref Questbook 13 (Yakuza
Substories — the earlier teardown; this file is the ENGINE, that one was the writing), 110 (Kenshi — losing is
a transfer, same law as Mr. Shakedown), 112 (The Hanged Man — the Legendary check that hides the answer
forever; Yakuza's answer is you cannot miss it), 106 (Mysterious Ways — the one-correct-script flaw), 97
(Doomed Commercial Area), 01 (Bloody Baron), our quest factory + FACTORY LAW + district + city-builder + VEGAS
GEOGRAPHY + standing + companions + faction web (13 factions) + entities/spawning + scheduler + combat dial +
difficulty packages + death-math + PACIFIST LAW + survival accounting + THREE CURRENCIES + Megaton law +
conscience system + persistent consequence + [READ] + verdict workflow + ART PHILOSOPHY +
despair-with-a-thread-of-hope + Liberate/Respect/Become. FUTURE: a RGG Studio production pull (how a studio
writes, records, and ships 100 substories per game **on an annual cycle** — the single most useful production
document available for our quest factory's throughput); a "Miracle on Tenkaichi Street" / "Heir to the Family"
full teardown (Yakuza 0's two best-written individual substories, at enchilada depth — the con artist and the
inheritance, both directly our fold) or a Kamurocho-as-a-map study (one square kilometer reused across two
decades of games, denser every entry — directly our district + MAP LAW + VEGAS GEOGRAPHY, and the best
argument in the medium for a SMALL map made deep).

# BOHEMIA QUESTBOOK — DEEP DIVE 101: THE ONLY WAY UP IS A FALLEN RADIO TOWER / FOUR PEOPLE ON A ROOF (Reilly's Rangers, Fallout 3)
Full teardown, the whole enchilada: the rescue quest where four mercenaries are stranded on a hotel roof
surrounded by super mutants, the building has no ground-floor entrance, the only route in is a collapsed
radio antenna bridging from the hospital next door, and the exit is a broken elevator that needs a battery
from a dead robot. Complete event flow, Reilly's coma, Theo's ammo box, the fission battery, the descent, the
mutually-exclusive reward, the honest flaws, and Bohemia ports. STARTLINGLY relevant to our LOGISTICS, our
district, our companions, our HD tile repo, + our survival accounting. Bethesda (quest designer: **ALAN
NANES**). Reference only; Paolo does not read it. No Bohemia quest written here.

Quest: "Reilly's Rangers," a side quest in Fallout 3 (2008), Vernon Square. Reilly's Rangers are "**A
MERCENARY GROUP OPERATING IN THE CAPITAL WASTELAND. THEIR CURRENT MISSIONS ARE THE ONGOING ERADICATION OF
SUPER MUTANTS AND MAPPING THE WASTELAND.**" Five members: Reilly (leader), Donovan (engineer), Brick (heavy
weapons), Butcher (medic), Theo (quartermaster). When the quest starts, one of them is already dead and
doesn't know it.

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- THE OBJECTIVE IS A BUILDING YOU CANNOT ENTER (the design problem, and the whole quest — STARTLINGLY our
  district + MAP LAW): the Rangers are on the roof of the Statesman Hotel. "**THAT AREA IS INACCESSIBLE FROM
  THE GROUND.**" No door. No street entrance. The lobby elevator is dead.
  - The solution isn't given to you. You have to look at the skyline and figure it out: "**LOCATE THE OUR
    LADY OF HOPE HOSPITAL IN VERNON SQUARE. ON THE SECOND FLOOR OF THE HOSPITAL IS A DOOR LEADING OUTSIDE TO
    WHERE A RADIO TOWER HAS FALLEN INTO THE BUILDING. THIS CREATES A MAKESHIFT BRIDGE TO THE STATESMAN
    HOTEL, WHICH IS OTHERWISE INACCESSIBLE.**"
  - You get into a sealed skyscraper by walking across a collapsed antenna from the hospital next door. The
    route is a piece of ruined infrastructure that happened to fall the right way (cf. our district + HD
    tile repo + logistics + VEGAS GEOGRAPHY; the path that is a disaster).
- THE QUEST IS A LOGISTICS PROBLEM WEARING A FIREFIGHT (the structure — direct for us): every single beat is
  supply. **A radio signal.** A wounded leader who needs waking. **A code** to open a dead man's ammo box.
  **Ammunition** you hand out by hand — "**BRICK TAKES 150 5MM ROUNDS, BUTCHER TAKES 50 10MM ROUNDS, DONOVAN
  TAKES 50 5.56 ROUNDS.**" **A fission battery** from a broken robot. **An elevator.**
  - Nobody in this quest needs a hero. They need a battery and some bullets (STARTLINGLY our LOGISTICS +
    survival accounting + THREE CURRENCIES; the rescue that's a resupply).
- AND YOU CAN GET THERE BY ACCIDENT, BECAUSE THEY'RE BROADCASTING (the hook): "**PICKING UP THE RANGER
  EMERGENCY FREQUENCY, AN AUTOMATED DISTRESS CALL FROM RANGERS STRANDED ON THE ROOF OF THE STATESMAN
  HOTEL.**"
  - "**THE SIGNAL CAN BE PICKED UP WHILE EXPLORING NEAR THE NATIONAL ARCHIVES BUILDING... BUT ALSO ON
    PENNSYLVANIA AVENUE AND VERNON SQUARE NEAR THE STATESMAN HOTEL.**"
  - Three entry points, all valid: hear the signal, find Reilly in a coma, or **just walk onto the roof and
    talk to Butcher.** The quest doesn't care how you found out (cf. our quest factory + [READ] +
    electricity; the quest delivered by infrastructure, Subnautica Q90's radio).

===============================================================================
## 1. THE FULL EVENT FLOW (stage by stage)
===============================================================================

### STAGE 0 — THE CLIENT IS UNCONSCIOUS IN A GHOUL HOSPITAL
- "**FIND REILLY IN UNDERWORLD, THE GHOUL CITY SITUATED IN THE MUSEUM OF HISTORY... SHE IS LYING UNCONSCIOUS
  IN THE UNDERWORLD HOSPITAL, THE CHOP SHOP.**"
- "**ONE MUST EITHER CONVINCE DOCTOR BARROWS TO WAKE HER (SPEECH 78), OR DO SO ONESELF (MEDICINE 60).**"
- The quest-giver cannot give the quest. You have to perform medicine on her, or talk a ghoul doctor into
  it, before anyone will tell you what's wrong (cf. our MEDICINE currency + standing + [READ]).
- What she tells you: "**REILLY EXPLAINS THAT SHE WAS WOUNDED BY SUPER MUTANTS WHILE TRYING TO EX-FILTRATE
  AND GET HELP FOR HER TEAM, WHO ARE STRANDED ON THE ROOF OF THE STATESMAN HOTEL.**"
- She got out to get help and nearly died doing it. You are the help she went to get, and she's been in a
  coma the whole time (cf. our companions + district; the rescue that's already overdue).
- And the detail that pays off later: "**SPEAKING TO REILLY IS THE ONLY WAY TO LEARN ABOUT THE OPTIONAL QUEST
  INVOLVING THEO'S AMMUNITION CACHE SINCE SHE IS THE ONLY ONE WHO KNOWS THE CODE.**"
### STAGE 1 — THE COMMUTE IS THE HARDEST PART OF THE JOB
- "**GETTING TO THAT AREA WON'T BE EASY. OBVIOUSLY YOU WILL HAVE TO USE SUBWAY TUNNELS, BECAUSE A LOT OF MAIN
  STREETS ARE BLOCKED WITH DEBRIS. START YOUR TRIP NEAR METRO CENTRAL AND END IT NEAR SEWARD SQUARE -
  NORTH.**"
- The DC ruins are a maze where the streets don't work, so you travel through the METRO. The city's
  above-ground is impassable and its underground is the road network (STARTLINGLY our district + logistics +
  VEGAS GEOGRAPHY + MAP LAW; the ruined city whose real map is underneath it).
### STAGE 2 — THE ANTENNA (the best environmental solution in the game)
- Through Our Lady of Hope Hospital, up to the second floor, out a door, and there it is: "**A RADIO TOWER
  HAS FALLEN INTO THE BUILDING.**"
- "**NOW YOU MUST USE THE LARGE ANTENNA TO CROSS THE GAP BETWEEN TWO BUILDINGS.**" And: "**YOU'LL HAVE TO
  DROP DOWN ONCE ACROSS TO ACCESS THE DOOR TO STATESMAN HOTEL MID LEVEL.**"
- You walk a fallen broadcast tower between two skyscrapers, two hundred feet up, and drop through a hole
  into a hotel. Nobody built that bridge. The apocalypse did (cf. our HD tile repo + prefab factory +
  district).
### STAGE 3 — THE HOTEL IS TRAPPED AND THE STAIRS ARE THE PUZZLE
- "**WATCH OUT FOR A ROPE IN THE FIRST CORRIDOR, BECAUSE IF YOU MOVE IT YOU'LL TRIGGER A NASTY TRAP. THERE
  ARE ALSO A LOT OF OTHER TRAPS INSIDE THE HOTEL, SO YOU SHOULD BE MOVING SLOWLY.**"
- "**REMEMBER THAT YOUR OBJECTIVE IS TO GET TO THE ROOF OF THE HOTEL, SO YOU MUST BE ON A LOOK OUT FOR
  STAIRCASES TO GET TO UPPER FLOORS.**"
- The entire level design is one verb: **UP.** Find the stairs. The building is a vertical maze and the goal
  is altitude (cf. our district + prefab factory + MAP LAW).
- And the restaurant level has a real alternative: "**YOU'LL NEED TO PICK AN AVERAGE LOCK OR (TO AVOID IT)
  YOU CAN DETOUR AROUND THE LOUNGE, DOWN A COLLAPSED FLOOR INTO A LOWER LEVEL, UP ANOTHER COLLAPSED FLOOR,
  THROUGH THE KITCHEN, AND INTO THE LOUNGE PROPER.**" A skill check with a physical bypass through the
  building's own damage (cf. our district + standing; the lockpick you can walk around).
### STAGE 4 — THEO (the fifth Ranger, and he's furniture)
- "**IN THE FIRST STAIRWELL YOU WILL FIND THE BODY OF THE RANGERS' QUARTERMASTER, THEO, AND A LOCKED
  AMMUNITION BOX WHICH CAN ONLY BE OPENED WITH A CODE RECEIVED FROM REILLY.**"
- "**HE'S REALLY EASY TO SPOT SINCE YOU JUST ABOUT HAVE TO WALK OVER HIM.**" He's on the stairs, next to a
  dead super mutant. He took one with him.
- The team's QUARTERMASTER died holding the ammo, on the stairwell, trying to get it up to them. His friends
  on the roof are out of bullets. **The supplies are twenty floors below them behind a code only their
  unconscious leader knows.**
- Punk: that's a logistics failure written as a corpse, and you can walk past it. Nothing marks it (cf. our
  logistics + [READ] + death-math + survival accounting; the body that IS the supply chain).
### STAGE 5 — THE ROOF (they're glad to see you and you're now trapped too)
- "**AS YOU ARRIVE ON THE ROOF, A FINAL ROUND OF EXPLOSIONS WILL TAKE OUT THE LATEST WAVE OF SUPER MUTANTS.
  BUTCHER WILL THEN WAVE YOU IN, BUT ADMITS YOU'RE STUCK THERE WITH THEM UNLESS THE ELEVATOR CAN BE
  REPAIRED.**"
- You fought your way up to rescue four people and the rescue's outcome is that there are now **five people
  trapped on the roof.** Butcher's first act is to tell you that you have made the problem worse (cf. our
  companions + district; the rescue that becomes a co-imprisonment).
- And then you hand out bullets, by hand, per person: "**BRICK TAKES 150 5MM ROUNDS, BUTCHER TAKES 50 10MM
  ROUNDS, DONOVAN TAKES 50 5.56 ROUNDS.**" A guide: "**BEFORE YOU GIVE THE BATTERY TO DONOVAN, TALK TO EACH
  OF THEM AND GIVE THEM SOME AMMO. IT'LL HELP IN THE NEXT FIGHT TO KEEP THEM SUPPLIED.**"
- Optional. Nothing tells you to. And it changes whether they live (STARTLINGLY our logistics + companions +
  survival accounting; the prep that isn't a quest step).
### STAGE 6 — THE FISSION BATTERY (the whole quest is a AA battery)
- "**ASK DONOVAN ABOUT THE ELEVATOR AND HE WILL TELL THE PLAYER THAT HE NEEDS A FISSION BATTERY AND WILL
  MENTION THE BROKEN PROTECTRON IN THE RESTAURANT BELOW IF ONE DOESN'T HAVE ONE.**"
- Two solutions: give it to Donovan, or "**IF THE PLAYER HAS A REPAIR SKILL OF 75 OR HIGHER ONE CAN FIX THE
  ELEVATOR ONESELF BY ACCESSING ITS CONTROL PANEL WITH THE FISSION BATTERY IN THE PLAYER'S INVENTORY. (THIS
  WILL NOT USE IT UP.)**"
- And the sentence that makes this quest legendary in a bad way: "**WARNING: IF THE FISSION BATTERY IS
  SOMEHOW LOST, THE ELEVATOR BECOMES IRREPARABLE AND THE PC WILL BE UNABLE TO EXIT THE HOTEL.**"
- **You can permanently strand yourself on a roof by dropping a battery.** The most important object in the
  quest is generic junk you may have already sold (cf. our inventory + survival accounting + electricity).
### STAGE 7 — THE DESCENT (the fight you don't fight)
- "**AFTER THE ELEVATOR HAS BEEN FIXED, THE MERCENARIES WILL DESCEND. FOLLOWING THIS, A BATTLE BETWEEN MERCS
  AND SUPER MUTANTS TAKES PLACE THROUGHOUT THE HOTEL.**"
- "**IT'S NOT GOING TO BE EASY, BECAUSE YOU MUST PREVENT THE SUPERMUTANTS FROM KILLING YOUR FRIENDS.**"
- The climax inverts the entire quest: you spent an hour going UP alone and now you go DOWN with four people
  whose survival is the objective. Your job stops being killing and starts being **keeping four other people
  alive** (cf. our companions + combat dial + Pacifist Law).
### STAGE 8 — THE REWARD IS A CHOICE THE COMMUNITY IMMEDIATELY BROKE
- "**THE OFFICIAL QUEST REWARD IS EITHER A SUIT OF RANGER BATTLE ARMOR OR THE UNIQUE MINIGUN, EUGENE, AND THE
  LONE WANDERER ALSO BECOMES A MEMBER OF REILLY'S RANGERS.**"
- And the community's answer, from the wiki, stated flatly: "**ONE CAN LET BRICK GET KILLED AND PICK UP
  EUGENE AND THE RANGER BATTLE ARMOR SO ONE DOES NOT HAVE TO CHOOSE ONLY ONE OF THEM AS THE REWARD.**"
- The exclusive-choice reward has a solution: **let one of the people you rescued die.** The game offers you
  a moral dilemma and the optimizers found the exploit in a week (cf. our conscience system + Megaton law).
- The real reward: "**AFTER RESCUING REILLY'S RANGERS, IF ONE OFFERS TO HELP REILLY WITH THE RANGERS' MAPPING
  DUTIES, SHE WILL GIVE THE PLAYER A GEOMAPPER MODULE**" — and it's **retroactive**: "**IF YOU'VE EXPLORED
  THE CITY A BIT, THEN YOU MIGHT GET A TON OF CAPS IMMEDIATELY.**" They pay you for the map you already
  made.
- And the failure state: "**IF ALL THE RANGERS DIE DURING THIS QUEST, ONE WILL NOT BE ABLE TO START
  GEOMAPPING WITH REILLY. ATTEMPTING TO INITIATE DIALOGUE WITH HER WILL FAIL.**" She just won't talk to you.

===============================================================================
## 2. THE HONEST FLAWS (banked)
===============================================================================
- YOU CAN SOFT-LOCK YOURSELF ON A ROOF BY LOSING A COMMON ITEM: "**IF THE FISSION BATTERY IS SOMEHOW LOST,
  THE ELEVATOR BECOMES IRREPARABLE AND THE PC WILL BE UNABLE TO EXIT THE HOTEL.**" The wiki links to an
  ESCAPE METHOD. LESSON (hard, ours): if a quest's exit depends on a consumable, the quest must GUARANTEE a
  replacement — our regression gates must test the failure path, not the happy one.
- THE RANGERS TURN HOSTILE FOR REASONS THAT AREN'T YOUR FAULT: "**THE RANGERS BECOME HOSTILE IF ANY OF THEM
  ARE HURT WHILE ON THE ROOFTOP, REGARDLESS OF WHETHER OR NOT THE PLAYER HAD ANYTHING TO DO WITH IT.**"
  There's a **generator on the roof that fails the quest if shot.** And a list of absurd triggers: having
  **Colonel Autumn's laser pistol** in your inventory, or **Tenpenny's suit**, or bringing **Fawkes, Charon,
  or Dogmeat** can make them attack you on sight. A real player: "**I HAD DOGMEAT WITH ME AND IT FAILED ME AS
  I APPROACHED THEM ON THE ROOF.**" LESSON: faction-hostility checks that fire on INVENTORY CONTENTS are a
  landmine; our standing system must never fail a quest for what's in a pocket.
- THE COMPANION AI FAILS ITS OWN CLIMAX: "**REILLY'S RANGERS MAY RANDOMLY BECOME HOSTILE TO THE PC UPON
  RETURN TO THEIR HQ. IF THIS HAPPENS JUST RELOAD THE SAVE.**" "Just reload" is the wiki's advice for the
  quest's ending. LESSON (ours): if your escort finale's failure mode is "reload," the system isn't shipped.
- THE MORAL CHOICE HAS A LOOTING EXPLOIT: "**ONE CAN LET BRICK GET KILLED AND PICK UP EUGENE AND THE RANGER
  BATTLE ARMOR.**" And the full exploit is worse — reverse-pickpocket armor onto Brick, leave the area, come
  back, steal her Ranger armor with a **Stealth Boy while she's sleeping.** LESSON (Megaton law): if your
  either/or reward can be defeated by patience, it isn't a choice, it's a speed bump.
- THEO IS THE BEST BEAT AND HE'S OPTIONAL AND UNMARKED: the quartermaster's body on the stairs is the
  quest's whole thesis, and "**THIS IS OPTIONAL**," and the code comes from a conversation you can skip
  entirely by walking onto the roof. LESSON (~11th confirmation): the thesis cannot be optional.
- ONE ROUTE, HARD-GATED: no antenna, no quest. There is exactly one way into the Statesman. LESSON
  (double-edged): a single spectacular route is memorable and it's also a single point of failure — and
  Bethesda's own guide admits the elevator is a shortcut you may not have the Repair for.

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. THE OBJECTIVE IS A BUILDING WITH NO ENTRANCE: the roof is "**INACCESSIBLE FROM THE GROUND**" and the
    lobby elevator is dead (cf. our district + MAP LAW).
W2. THE ROUTE IS A DISASTER THAT FELL THE RIGHT WAY: "**A RADIO TOWER HAS FALLEN INTO THE BUILDING. THIS
    CREATES A MAKESHIFT BRIDGE TO THE STATESMAN HOTEL**" (cf. our HD tile repo + prefab factory).
W3. THE QUEST ARRIVES BY BROADCAST, FROM A DEAD MACHINE: "**AN AUTOMATED DISTRESS CALL FROM RANGERS STRANDED
    ON THE ROOF**," pickable up from three different districts (cf. our electricity + quest factory,
    Subnautica Q90).
W4. THE QUEST-GIVER IS IN A COMA AND YOU HAVE TO TREAT HER: "**CONVINCE DOCTOR BARROWS TO WAKE HER (SPEECH
    78), OR DO SO ONESELF (MEDICINE 60)**" (cf. our MEDICINE currency).
W5. THE CITY'S REAL ROAD NETWORK IS UNDERGROUND: "**YOU WILL HAVE TO USE SUBWAY TUNNELS, BECAUSE A LOT OF
    MAIN STREETS ARE BLOCKED WITH DEBRIS**" (cf. our district + logistics + VEGAS GEOGRAPHY).
W6. THE DEAD QUARTERMASTER IS THE SUPPLY CHAIN: Theo's body is on the stairwell with the team's ammo, locked,
    twenty floors below the people who need it (cf. our logistics + death-math).
W7. THE RESCUE MAKES THE PROBLEM WORSE: Butcher "**ADMITS YOU'RE STUCK THERE WITH THEM UNLESS THE ELEVATOR
    CAN BE REPAIRED**" (cf. our companions + district).
W8. YOU HAND OUT AMMUNITION BY THE ROUND, AND IT'S OPTIONAL: "**BRICK TAKES 150 5MM ROUNDS, BUTCHER TAKES 50
    10MM ROUNDS, DONOVAN TAKES 50 5.56 ROUNDS**" (cf. our logistics + survival accounting).
W9. THE WHOLE SIEGE RESOLVES ON A BATTERY FROM A BROKEN ROBOT: a **FISSION BATTERY** out of a dead protectron
    in the restaurant downstairs (cf. our electricity currency + inventory).
W10. THE CLIMAX INVERTS THE VERB: you go up alone killing, and come down with four people whose survival is
     the objective — "**YOU MUST PREVENT THE SUPERMUTANTS FROM KILLING YOUR FRIENDS**" (cf. our companions +
     combat dial).

===============================================================================
## 4. BOHEMIA PORTS (directions, not built) — the building with no door + the rescue that is a resupply
===============================================================================
This is the best LOGISTICS quest ever written, and it's dressed as a firefight. Every beat is supply: a
signal, a code, a battery, and bullets you hand out one person at a time. For a survival city-builder in a
ruined city, it's a blueprint.
- W1/W2/W5 (the building has no entrance + the route is a disaster that fell the right way + the real road
  network is underground — our district + HD tile repo + logistics + VEGAS GEOGRAPHY): the top port, and
  it's aimed at our tile pipeline. The Statesman Hotel is **inaccessible from the ground.** The only way in
  is to enter the HOSPITAL NEXT DOOR, climb to the second floor, and walk across **a collapsed radio tower**
  that fell between the buildings — then drop through a hole. Nobody built that bridge; the apocalypse did.
  And the whole DC map works this way: "**A LOT OF MAIN STREETS ARE BLOCKED WITH DEBRIS**," so the real road
  network is the METRO. Punk, our Vegas is a ruined city with a real geography, and this is the lesson: the
  RUIN should generate the routes. Collapsed structures as bridges, blocked streets forcing underground
  paths, buildings enterable only from their neighbors. That's our HD tile repo + prefab factory doing
  navigation work, and MAP LAW holds — you place them, we build the plumbing that makes debris a road (ties
  our district + HD tile repo + prefab factory + street generation + logistics + VEGAS GEOGRAPHY +
  city-builder + MAP LAW; a top-tier port).
- W6/W8/W9 (the dead quartermaster is the supply chain + you hand out ammo by the round + the siege resolves
  on a battery — our LOGISTICS + survival accounting + electricity): STEAL all three. (a) **THEO.** The
  team's QUARTERMASTER is dead on the stairwell, next to a super mutant he killed, holding **all their
  ammo** in a locked box. His friends are twenty floors up, out of bullets, and **only their unconscious
  leader knows the code.** That is a logistics failure written as a corpse, and you can walk over him without
  noticing. Our [READ] + logistics should produce those constantly. (b) You resupply the Rangers **by hand,
  per person, in specific calibers** — 150 5mm for Brick, 50 10mm for Butcher, 50 5.56 for Donovan — and
  it's OPTIONAL, unmarked, and it changes who lives. That's our survival accounting as an act of care. (c)
  And the entire siege ends with **a fission battery out of a broken robot in the restaurant.** Our
  ELECTRICITY currency should have exactly that texture: the war is over when someone finds the part (ties
  our LOGISTICS + survival accounting + THREE CURRENCIES + electricity + inventory + [READ] + death-math +
  companions + district + city-builder).
- W3/W4 (the quest arrives by broadcast from a dead machine + the quest-giver is in a coma — our electricity
  + MEDICINE + quest factory): bank both. (a) An **automated distress call** playing on a loop, receivable
  from three different districts, from people who may already be dead. That's Subnautica's radio (Q90) in a
  ruined city, and it's our AMALGAMATION + electricity native: infrastructure delivering quests. (b) And the
  quest-giver **CANNOT GIVE THE QUEST** — she's in a coma, and you have to pass **Medicine 60** or talk a
  ghoul doctor into waking her. Our MEDICINE currency should gate information, not just health: the person
  who knows the thing is dying, and treating them IS the investigation (ties our electricity + MEDICINE
  currency + quest factory + [READ] + district + standing + AMALGAMATION).
- W7/W10 (the rescue makes it worse + the climax inverts the verb — our companions + combat dial + Pacifist
  Law): bank the structure, it's the best escort design in the medium. You fight your way UP a trapped
  skyscraper alone. You reach the roof. And Butcher's first line is that **you're now trapped too** — five
  people instead of four. Then, once the elevator works, the entire descent inverts: "**YOU MUST PREVENT THE
  SUPERMUTANTS FROM KILLING YOUR FRIENDS.**" Your verb changes from KILL to KEEP ALIVE, mid-quest, without a
  tutorial. For our Dead Eye Dial and our Pacifist Law, that's the shape of a fight worth having: the
  objective isn't the enemies, it's the four people behind you (ties our companions + combat dial +
  difficulty packages + PACIFIST LAW + district + death-math + fold).
- REWARD (the geomapper — our district + persistent consequence): bank the retroactive payoff. Reilly pays
  you for **map locations you already discovered**: "**IMMEDIATELY AFTER INITIATING THE QUEST, YOU CAN TALK
  TO HER AGAIN AND SHE'LL PAY YOU FOR ALL DISCOVERED MAP LOCATIONS.**" The reward for a rescue is that your
  EXISTING exploration retroactively becomes income, and the Rangers' actual mission is "**MAPPING THE
  WASTELAND.**" Our district + city-builder + fold: knowledge of the city IS a tradeable resource, and a
  faction should buy it (ties our district + city-builder + logistics + survival accounting + faction web +
  standing + persistent consequence + fold + VEGAS GEOGRAPHY).
- FLAWS (bank HARD): (a) IF A QUEST'S EXIT DEPENDS ON A CONSUMABLE, GUARANTEE A REPLACEMENT — "**IF THE
  FISSION BATTERY IS SOMEHOW LOST, THE ELEVATOR BECOMES IRREPARABLE AND THE PC WILL BE UNABLE TO EXIT THE
  HOTEL**"; our regression gates must test the FAILURE path; (b) NEVER FAIL A QUEST FOR WHAT'S IN A POCKET —
  the Rangers turn hostile over Colonel Autumn's pistol, Tenpenny's suit, or **Dogmeat**, and "**THE RANGERS
  BECOME HOSTILE IF ANY OF THEM ARE HURT... REGARDLESS OF WHETHER OR NOT THE PLAYER HAD ANYTHING TO DO WITH
  IT**"; (c) if your escort finale's failure mode is "**JUST RELOAD THE SAVE**," the system isn't shipped;
  (d) if your either/or reward can be defeated by patience (let Brick die, or reverse-pickpocket her armor
  and steal it with a Stealth Boy), it isn't a choice — Megaton law; (e) ~11th confirmation: THEO IS THE
  THESIS AND HE'S OPTIONAL AND UNMARKED; and (f) a single spectacular route is memorable AND a single point
  of failure.

---
# V2 PAYLOAD — BACKFILLED 7/16/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**REILLY** — wants her squad back; is unconscious for the hiring. The quest begins with the CLIENT UNABLE TO ASK (medical terminal / her waking is the ask). FUNCTION: the contract signed by circumstance.

**BUTCHER, BRICK, DONOVAN** — want off the roof, in three temperaments: the medic counts wounds, Brick loves her minigun louder than fear, Donovan reads the elevator like scripture. Each will trade: covering fire, tactics, gratitude rationed by personality. FUNCTION: the payload with opinions — an escort quest where the escorted are competent.

**THEO** — the fifth Ranger. Dead beside an ammo box on the way up. FUNCTION: furniture with a name (the file's phrase). His box is supplies; taking it in front of nobody is the quest's quiet ethics beat — the squad will reference his loss on the roof.

**THE SUPER MUTANTS** — want the building; patient about it. FUNCTION: pressure, not conversation. No parley layer exists.

## V2-B THE CONVERSATIONS (node trees)

NODE: TERMINAL_HIRE — the ghoul hospital, entry: found Reilly comatose
  The ask arrives via her medical state + terminal/log context; if she wakes (medicine route), she asks properly.
  > (take the job from the terminal/logs)  [gate: none] -> the commute begins with an employer who has never spoken to you.
  > [Medicine] (revive her first)          [gate: skill-in-source; DEED-convert for Bohemia: has:stimpak_spent] -> R_ASKS: the same job with a face on it. WRITES: reilly_awake_first.
  THE FINDING: the quest runs identically either way, but the ROOF SCENE reads differently if the client asked you herself. Emotional variance with zero branch cost. Bank: CHEAPEST REACTIVITY IS WHO-KNEW-WHAT-WHEN.

NODE: THE_ROOF — entry: reached the Rangers
  Relief, then arithmetic: you are now trapped WITH them.
  > "What do you need?"          [gate: none] -> D_ELEVATOR (Donovan names the fission battery; the quest's whole object is a AA cell for a building)
  > "Who's Theo?"                [gate: flag:took_ammo_box or seen] -> the squad's grief, brief and unperformed.
  NOVERB: "Leave the gear, we run now." — THE QUEST HAS NO ABANDON-THE-EQUIPMENT SPRINT OPTION. Descent requires the fix. The removed verb is PANIC. A rescue that refuses to let you rescue sloppily.

NODE: THE_REWARD_FORK — Reilly, after, entry: everyone down
  > (take Ranger armor)     [gate: none] -> the gear
  > (take the minigun)      [gate: none] -> Brick's church, offered anyway
  MUTUALLY EXCLUSIVE, stated plainly, no buyback. THE MECHANIC: a reward that forces a small identity choice at the end of a logistics quest — who were you in this, armor or gun.

## V2-C THE BRANCH MAP

COUNT: 1 spine × (client-awake variance) × (reward fork) × the grim off-branch: the Rangers can DIE en route if the player fights carelessly — escort mortality writes permanent squad-roster states (survivor dialogue thins honestly).
STRUCTURAL FINDING: THE QUEST IS A SUPPLY-CHAIN PROBLEM WEARING A RESCUE'S CLOTHES: entrance (antenna), payload (four humans), power (battery), exit (elevator). Bohemia's LOGISTICS addendum should cite it as the template for district-rescue content: every rescue is a route + a power budget + a payload with opinions. HD tile note: the collapsed-antenna bridge is the single best environmental-solution reference in the corpus for our ruin kit.

## SOURCES
Fallout Wiki (Fandom / fallout.wiki / fallout-archive) "Reilly's Rangers (quest)" (the three hooks —
"**PICKING UP THE RANGER EMERGENCY FREQUENCY, AN AUTOMATED DISTRESS CALL FROM RANGERS STRANDED ON THE ROOF OF
THE STATESMAN HOTEL. THE SIGNAL CAN BE PICKED UP WHILE EXPLORING NEAR THE NATIONAL ARCHIVES BUILDING AT THE
MALL NORTHEAST MAP MARKER, BUT ALSO ON PENNSYLVANIA AVENUE AND VERNON SQUARE NEAR THE STATESMAN HOTEL.
TRAVELING TO THE TOP OF THE STATESMAN HOTEL AND TALKING TO BUTCHER THERE. VISITING THE RANGERS' HIDEOUT AND
READING IN REILLY'S COMPUTER THAT THEY ALL WENT TO THE STATESMAN HOTEL**"; the team — "**REILLY'S RANGERS ARE
A MERCENARY GROUP OPERATING IN THE CAPITAL WASTELAND. THEIR CURRENT MISSIONS ARE THE ONGOING ERADICATION OF
SUPER MUTANTS AND MAPPING THE WASTELAND**"; the coma — "**SHE IS LYING UNCONSCIOUS IN THE UNDERWORLD HOSPITAL,
THE CHOP SHOP. ONE MUST EITHER CONVINCE DOCTOR BARROWS TO WAKE HER (SPEECH 78), OR DO SO ONESELF (MEDICINE
60). REILLY EXPLAINS THAT SHE WAS WOUNDED BY SUPER MUTANTS WHILE TRYING TO EX-FILTRATE AND GET HELP FOR HER
TEAM**"; "**SPEAKING TO REILLY IS THE ONLY WAY TO LEARN ABOUT THE OPTIONAL QUEST INVOLVING THEO'S AMMUNITION
CACHE SINCE SHE IS THE ONLY ONE WHO KNOWS THE CODE TO UNLOCK IT**"; the route — "**LOCATE THE OUR LADY OF HOPE
HOSPITAL IN VERNON SQUARE. ON THE SECOND FLOOR OF THE HOSPITAL IS A DOOR LEADING OUTSIDE TO WHERE A RADIO
TOWER HAS FALLEN INTO THE BUILDING. THIS CREATES A MAKESHIFT BRIDGE TO THE STATESMAN HOTEL, WHICH IS OTHERWISE
INACCESSIBLE**"; Theo — "**IN THE FIRST STAIRWELL YOU WILL FIND THE BODY OF THE RANGERS' QUARTERMASTER, THEO,
AND A LOCKED AMMUNITION BOX WHICH CAN ONLY BE OPENED WITH A CODE RECEIVED FROM REILLY**"; the restaurant
detour — "**ON THE RESTAURANT LEVEL, YOU'LL NEED TO PICK AN AVERAGE LOCK OR (TO AVOID IT) YOU CAN DETOUR
AROUND THE LOUNGE, DOWN A COLLAPSED FLOOR INTO A LOWER LEVEL, UP ANOTHER COLLAPSED FLOOR, THROUGH THE KITCHEN,
AND INTO THE LOUNGE PROPER**"; the roof — "**AS YOU ARRIVE ON THE ROOF, A FINAL ROUND OF EXPLOSIONS WILL TAKE
OUT THE LATEST WAVE OF SUPER MUTANTS. BUTCHER WILL THEN WAVE YOU IN, BUT ADMITS YOU'RE STUCK THERE WITH THEM
UNLESS THE ELEVATOR CAN BE REPAIRED BY DONOVAN**"; the resupply — "**ONE MAY SPEAK TO EACH TEAM MEMBER AND, IF
ONE WISHES, OFFER THEM AMMUNITION (BRICK TAKES 150 5MM ROUNDS, BUTCHER TAKES 50 10MM ROUNDS, DONOVAN TAKES 50
5.56 ROUNDS)**"; the battery — "**ASK DONOVAN ABOUT THE ELEVATOR AND HE WILL TELL THE PLAYER THAT HE NEEDS A
FISSION BATTERY AND WILL MENTION THE BROKEN PROTECTRON IN THE RESTAURANT BELOW... IF THE PLAYER HAS A REPAIR
SKILL OF 75 OR HIGHER ONE CAN FIX THE ELEVATOR ONESELF... (THIS WILL NOT USE IT UP.) WARNING: IF THE FISSION
BATTERY IS SOMEHOW LOST, THE ELEVATOR BECOMES IRREPARABLE AND THE PC WILL BE UNABLE TO EXIT THE HOTEL... THE
FISSION BATTERY CAN BE VERY DIFFICULT FOR SOME TO FIND**"; the descent — "**AFTER THE ELEVATOR HAS BEEN FIXED,
THE MERCENARIES WILL DESCEND. FOLLOWING THIS, A BATTLE BETWEEN MERCS AND SUPER MUTANTS TAKES PLACE THROUGHOUT
THE HOTEL**"; the reward — "**THE OFFICIAL QUEST REWARD IS EITHER A SUIT OF RANGER BATTLE ARMOR OR THE UNIQUE
MINIGUN, EUGENE, AND THE LONE WANDERER ALSO BECOMES A MEMBER OF REILLY'S RANGERS**"; the exploit — "**ONE CAN
LET BRICK GET KILLED AND PICK UP EUGENE AND THE RANGER BATTLE ARMOR SO ONE DOES NOT HAVE TO CHOOSE ONLY ONE OF
THEM AS THE REWARD**" and the reverse-pickpocket/Stealth Boy method; the failure states — "**WARNING: IF ALL
THE STRANDED RANGERS DIE FOR ANY REASON, IT WILL HAVE SERIOUS CONSEQUENCES ON THE OUTCOME OF THE QUEST**,"
"**IF ALL THE RANGERS DIE DURING THIS QUEST, ONE WILL NOT BE ABLE TO START GEOMAPPING WITH REILLY. ATTEMPTING
TO INITIATE DIALOGUE WITH HER WILL FAIL**," "**WHEN ONE ARRIVES AT THE ROOF OF THE STATESMAN HOTEL, THERE IS A
GENERATOR TO THE LEFT THAT, WHEN SHOT, WILL TURN THE RANGERS HOSTILE AND THE QUEST WILL FAIL**," "**THE
RANGERS BECOME HOSTILE IF ANY OF THEM ARE HURT WHILE ON THE ROOFTOP, REGARDLESS OF WHETHER OR NOT THE PLAYER
HAD ANYTHING TO DO WITH IT**," "**IF THE PLAYER HAS COLONEL AUTUMN'S LASER PISTOL, OR ALLISTAIR TENPENNY'S
SUIT IN THEIR INVENTORY OR IF THE PLAYER HAS FAWKES, CHARON, OR DOGMEAT IN THEIR PARTY... REILLY'S RANGERS MAY
BECOME HOSTILE**," "**REILLY'S RANGERS MAY RANDOMLY BECOME HOSTILE TO THE PC UPON RETURN TO THEIR HQ. IF THIS
HAPPENS JUST RELOAD THE SAVE**"; Reilly's terminal — "**THERE IS A CONTRACT NOTE ABOUT BEING PAID FOR EACH
SUPER MUTANT KILLED AND NEEDING BODY PARTS AS PROOF**"; the geomapper — "**AFTER RESCUING REILLY'S RANGERS, IF
ONE OFFERS TO HELP REILLY WITH THE RANGERS' MAPPING DUTIES, SHE WILL GIVE THE PLAYER A GEOMAPPER MODULE**";
and the credit — "**QUEST DESIGNER ALAN NANES WORKED ON THE DESIGN OF THE REILLY'S RANGERS QUEST**");
Gamepressure "Fallout 3: Museum of History: Reilly's Rangers" ("**GETTING TO THAT AREA WON'T BE EASY.
OBVIOUSLY YOU WILL HAVE TO USE SUBWAY TUNNELS, BECAUSE A LOT OF MAIN STREETS ARE BLOCKED WITH DEBRIS. START
YOUR TRIP NEAR METRO CENTRAL AND END IT NEAR SEWARD SQUARE - NORTH**"; "**NOW YOU MUST USE THE LARGE ANTENNA
TO CROSS THE GAP BETWEEN TWO BUILDINGS**"; "**WATCH OUT FOR A ROPE IN THE FIRST CORRIDOR, BECAUSE IF YOU MOVE
IT YOU'LL TRIGGER A NASTY TRAP. THERE ARE ALSO A LOT OF OTHER TRAPS INSIDE THE HOTEL, SO YOU SHOULD BE MOVING
SLOWLY IN ORDER TO AVOID ACTIVATING THEM. REMEMBER THAT YOUR OBJECTIVE IS TO GET TO THE ROOF OF THE HOTEL, SO
YOU MUST BE ON A LOOK OUT FOR STAIRCASES**"; "**IT'S NOT GOING TO BE EASY, BECAUSE YOU MUST PREVENT THE
SUPERMUTANTS FROM KILLING YOUR FRIENDS**"; and "**FIND UNCONSCIOUS REILLY AND FORCE ONE OF THE DOCTORS TO WAKE
HER UP. YOU CAN ALSO HEAL HER YOURSELF, BUT OBVIOUSLY YOU MUST HAVE A HIGH MEDICINE SKILL**"); Altered Gamer
"Fallout 3 Walkthrough - Reilly's Rangers" ("**YOU'LL RUN INTO THEO'S BODY ON THE STAIRS NEXT TO A DEAD SUPER
MUTANT. HE'S REALLY EASY TO SPOT SINCE YOU JUST ABOUT HAVE TO WALK OVER HIM**"; "**BEFORE YOU GIVE THE BATTERY
TO DONOVAN, TALK TO EACH OF THEM AND GIVE THEM SOME AMMO. IT'LL HELP IN THE NEXT FIGHT TO KEEP THEM
SUPPLIED**"; and the reward analysis — "**YOU SHOULD ALWAYS PICK THE ARMOR THOUGH, SINCE YOU CAN JUST
PICKPOCKET EUGENE OFF OF BRICK IF YOU REALLY WANT IT**"); Carl's Guides "Fallout 3 Reilly's Rangers
Walkthrough" ("**THAT AREA IS INACCESSIBLE FROM THE GROUND. INSTEAD, YOU'LL HAVE TO GO THROUGH THE
HOSPITAL**"; "**THERE'S A METAL PLATFORM TO WALK ACROSS THAT LEADS TO THE STATESMAN HOTEL. YOU'LL HAVE TO DROP
DOWN ONCE ACROSS**"; the Little Moonbeam's Father holotape under a skeleton on a hotel bed; and the geomapper
— "**IMMEDIATELY AFTER INITIATING THE QUEST, YOU CAN TALK TO HER AGAIN AND SHE'LL PAY YOU FOR ALL DISCOVERED
MAP LOCATIONS**"); PlayStationTrophies.org "Reilly's Rangers Trophy" (the walkthrough and the player report —
"**I HAD DOGMEAT WITH ME AND IT FAILED ME AS I APPROACHED THEM ON THE ROOF**"). Cross-ref Questbook 38
(Fallout 1/2 — the series' whole-game teardown), 100 (Vault City — the other Fallout faction-membership
quest; both end with you joining), 90 (Subnautica — the radio distress call as a quest system; the same
device, ten years earlier here), 87 (Outward — preparation over power; the resupply mindset), 88 (Project
Zomboid — infrastructure as a clock), 06 (ME2 Suicide Mission — the other great "keep your people alive"
climax, and the one that does it better), 99 (Ocean House Hotel — the building as antagonist), 30 (This War
of Mine — the logistics of survival), 89 (Death Stranding — the ladder someone else left; Theo's ammo box is
the dark version), our LOGISTICS + survival accounting + THREE CURRENCIES + electricity + MEDICINE currency +
inventory macro/micro + district + HD tile repo + prefab factory + street generation + VEGAS GEOGRAPHY +
city-builder + companions + entities/spawning + combat dial + difficulty packages + PACIFIST LAW + [READ] +
recorded-vs-unrecorded + death-math + standing + faction web + conscience system + Megaton law + persistent
consequence + fold + quest factory + regression gates + MAP LAW. FUTURE: an Alan Nanes interview pull on the
Statesman's construction (the definitive account of designing a quest around a building with no entrance —
directly useful for our district + tile pipeline); a "Little Moonbeam's Father" study (the holotape under a
skeleton on a hotel bed, unrelated to the quest, that most players find while doing it — the best
environmental-story-inside-another-story case in the game, and directly our [READ]) or a Sydney / National
Archives pull (Fallout 3's other great "escort a competent person" design, and the one where the NPC is
better at fighting than you are).

# BOHEMIA — THE BATTLE BROTHERS LANE DISPATCH

**LAB lane, 8/18/26.** Paolo: *"I NEED YOU TO DO ROUNDS OF BIG BRAIN RESEARCH FOR ALL THESE CHATS
PLEASE AND THANK YOU. WHAT WE CAN IMPLEMENT AND WHAT WONT WORK. BUT THIS ONLINE PEOPLE SAY IS THE BEST
ROGUELITE OPEN WORLD RPG AND WE ARE GOING TO STEAL EVERYTHING WE NEED AND SHIT ON MY COMPETITION"*

Companion to `records/BOHEMIA_BATTLE_BROTHERS_REFERENCE_STUDY_8_18_26.md` (the study). **This file is
the routing:** one section per lane he listed, each with **STEAL THIS** and **WON'T WORK HERE**.

**LAB WRITES NO CODE. Nothing here is canon.** Each lane owns its own build and its own gate.
**NOT IN A TAB** — this is a records file.

**SOURCING, stated so nobody over-trusts it:** `battlebrothersgame.com`, `battlebrothers.fandom.com`
and `steamcommunity.com` are **blocked by this environment's egress proxy as organization policy**, so
everything came through the search channel and is quoted rather than paraphrased. **He owns the game.**
One evening of him playing it beats this whole file, and where a lane's material is thin below **I say
so instead of padding it.**

---

## ★ FIRST, THE ONE THING THAT REFRAMES ALL TWELVE LANES

**BATTLE BROTHERS IS OUR CAMPAIGN REFERENCE. ROGUE FABLE IV IS OUR FIGHT REFERENCE. THEY DO NOT
COMPETE — THEY COVER DIFFERENT HALVES OF BOHEMIA, AND UNTIL TODAY THE CAMPAIGN HALF HAD NO REFERENCE
AT ALL.**

RF4 is a one-hour run with a fresh character. Battle Brothers is one continuous campaign, a company you
keep forever, the dead staying dead, and **a wage bill that arrives whether or not you fought.** That
is Bohemia's shape: no runs, a persistent city, a dynasty across three generations inheriting
everything including the unhealed wounds.

**AND THE HARD LIMIT, ONCE, SO EVERY LANE HAS IT:** Battle Brothers is **pure d100 dice, hit chance
floored at 5%.** *"Perfect play = zero damage at any enemy count"* is LOCKED. **A 5% floor makes that
arithmetically impossible.** So across every lane: **steal the structure, refuse the dice.**

---

## 04. COMBAT

**STEAL THIS**

1. **THE DESTRUCTIBLE ARMOUR LAYER — and this is now a two-reference convergence.** *"Armor points are
   reduced instead of hitpoints... once the armor points reach 0, the armor is destroyed and useless
   until the end of the battle."* RF4 reached the same answer (Protection Points, a second bar above
   HP). **Two studios, different audiences, same mechanic.** And we measured `armor` on **all bodies in
   our own fight with a 0 in every one of them** — the field is already there, doing nothing. Take
   **RF4's absolute version** (nothing gets through while a point stands), not BB's leaky one.
2. **TWO HIT ZONES, head and body, degrading separately.** Aiming at the weaker zone becomes a decision
   every turn, with **no new UI and no new numbers.**
3. **FATIGUE'S FLOOR.** *"Actions are designed so any character can perform at least one slash a turn,
   no matter how fatigued they are."* The resource takes your **options**, never your **turn**. Same
   instinct as our own *"the game never punishes taking your time."* We already carry `stam`.
4. **INITIATIVE RECOMPUTED EVERY ROUND from action points + accumulated fatigue + armour weight**, so
   *"slower, more fatigued or heavily armored"* bodies act later. **That is the whole armour trade-off
   in one line:** heavier armour = a bigger destructible layer, a lower fatigue ceiling, and a worse
   place in the order. One decision, three systems, zero stat sheet.
5. **MORALE — the cheapest aliveness in either reference.** Triggers: *"slaying an enemy, seeing an
   enemy be slain by an ally, seeing an ally fall, seeing an ally flee, being wounded and being
   outnumbered."* **Every one of those is an event our combat already detects.** A failed check makes a
   body **wavering**. And it is enemies reading each other **with no AI coordination at all**, which is
   the RF4 teardown's largest remaining gap answered from a different direction and for one number per
   person.

**WON'T WORK HERE**

- **THE d100 TO-HIT.** *"toHit = skill − defense"*, floored 5%, capped 95%, *"pure RNG."* Refused — see
  the hard limit above. It is also the loudest complaint in that game's own community, and RF4 removed
  random mitigation on purpose so *"randomness lives in layout and drops, not in whether your plan
  works."*
- **Damage that always leaks** (*"at least 10% of damage will penetrate armor"*). Take the layer, not
  the leak.
- **Fatigue as a punishment clock.** Keep the floor and the trade-off; do not let it tax normal play —
  that is the 8/17 law's SP ruling (upside-only) applied here.

---

## 09. PEOPLE

**STEAL THIS — and this is the strongest single mechanism in the whole game for this lane.**

**A BACKGROUND IS ONE WORD THAT DRIVES FOUR SYSTEMS AT ONCE.** *"Character backgrounds define a
character's story, starting attributes and equipment, and also determine **what kind of traits a
character can get** and **open up specific events and dialog choices.**"*

Look at the actual numbers:

| BACKGROUND | STATS | **DAILY WAGE** | THE HOOK |
|---|---|---|---|
| **Ratcatcher** | +15 Initiative, −5 Hitpoints | **4 crowns** | *"has bad events and can get other brothers sick"* |
| **Witch Hunter** | +5 Ranged, +12 Resolve, **+20 Resolve vs fear/panic/mind-control** | **13 crowns** | often rolls **brave** or **fearless** |

**THE WAGE IS PART OF THE IDENTITY.** A witch hunter costs **three times** a ratcatcher, every single
day, forever. That is a character sheet, a price tag, a personality and a quest hook from **one word** —
and it is exactly the shape our own laws already want: MECHANISM-MINE / CONTENTS-PAOLO'S, plus
DIALOGUE ALWAYS REFERS TO THE CATALOGUE.

Also steal: **a background BIASES traits rather than fixing them** (witch hunters *often* brave), so
people stay individuals. And *"differences in stats help building personalities — you start thinking of
a Brother with high hitpoints as 'the tough guy'."* **A named body with one flaw and one number that
sticks out is a character**, and that is cheap.

**WON'T WORK HERE**

- **A recruit's background must not gate required information** — our Spanglish law already locks that,
  and BB's *"opens up specific events and dialog choices"* is one step from a locked door.
- **The ratcatcher's "can get other brothers sick" is a griefing mechanic** on a roster you can fire.
  In a **dynasty**, a family member you cannot fire who infects the others is not tension, it is a
  save-scum. Take the *flaw with a cost*, not the contagion.
- **WHO ANYBODY IS STAYS HIS.** The table above is the mechanism. The cast is Paolo's.

---

## 10. FACTIONS

**STEAL THIS — three separate standing measures, not one reputation bar.**

*"There are 3 measures — **Renown, Reputation & Relations** — that denote your standing and fame with
Settlements and Noble Houses."*

- **RENOWN = professional competence.** *"Your repute as a professional mercenary company... The higher
  your Renown, the higher the reward from Contracts and **the more difficult Contracts people will
  entrust you with.**"* **That last clause is the good part: renown is a difficulty dial the player
  earns rather than picks.**
- **RELATIONS = per-faction, and PER-SETTLEMENT.** *"The player will have a relation value to each and
  every faction, **including independent settlements**."* It **drops** if you hit a village's caravan,
  **rises** when you complete their contracts. *"In order for the world to feel reactive to the
  player's behavior and to introduce more consequences to your actions."*
- **THE BEST BEAT IN THE SYSTEM:** a noble house that likes you enough *"may ask you to **attack a
  neutral settlement** to help induce said settlement to join their faction."* **Your standing with one
  power becomes a weapon it points at a third party** — and doing it costs you standing there. That is
  a faction system that makes you complicit, and it needs no new tech beyond a relations number.

**Bohemia already has the hard part:** 13 factions and COLOUR IS TERRITORY — *"a faction's colour is a
statement of who would defend you."* **A relations number is the mechanical spine under that sentence.**

**WON'T WORK HERE**

- *"Only settlements and noble houses can be friendly"* — everyone else is permanently hostile. In a
  city where **light is territory** and the Amalgamation owns purple, a permanently-hostile majority
  flattens the map into us-and-them. **Bohemia should let more factions be reachable**, because the
  interesting question is *who would defend you*, and that only has weight if the answer can change.
- Do not import their **noble-house war** wholesale; that is a three-power medieval frame and ours is a
  post-crash valley with its own named powers.

---

## 01. THE RUN

**STEAL THIS — COMPANY ORIGINS, and one of them answers a question that has been open in this repo.**

*"The DLC adds a number of company origins... each with a flavor introduction, different starting
characters, equipment, resources, and **special rules for the campaign**."* Built explicitly for
replayability and *"to accommodate different play styles."*

- **Rebuilding a Company** — the default; you start *"having lost a battle to some Brigands."*
  **You start already beaten.** That is a cold open with stakes, for free.
- **Northern Raiders** — start well-equipped but *"as outlaws, meaning 2 out of 3 noble houses are
  outright hostile."* **A start that trades power for standing.**
- **Cultists** — *"your god will demand sacrifices in bloody rituals that may grant permanent boons."*
- **★ HEDGE KNIGHT — READ THIS ONE TWICE:** *"a single well-equipped and experienced hedge knight who
  is your player character, **can't be fired, and if he dies, your campaign ends**."*

**WHY THE HEDGE KNIGHT MATTERS TO US SPECIFICALLY.** CLAUDE.md records a real scare: the phrase "ONE
CHARACTER" sat at the top of the truth hierarchy for days and nobody had said it, and read literally it
would have deleted the gen-3 Angel ending. Battle Brothers **ships both shapes in one game** — a roster
campaign *and* a mode where one irreplaceable named character dying ends everything. **They are not
opposed. The dynasty is the roster; the gen-3 Angel heir going one-way is a Hedge Knight ending.**
The structure Bohemia already committed to is a structure this game validates.

**WON'T WORK HERE**

- **Origins as a MENU on a new-game screen.** THERE ARE NO RUNS — Bohemia is one ~100-hour game, so
  there is no new-game screen to hang twelve variants on, and no replay to serve. **What transfers is
  the SHAPE of one origin: start already beaten, with a debt and a hostile neighbour.** That is Act 1,
  not a difficulty selector.
- Demo caution: the demo board's row 7 (the first five minutes) is open and **owned by RUN**. *"Start
  already beaten"* is a framing for that opening, not a new system, and it must not displace the actual
  fix (defaulting the tab to the game).

---

## 03. LIFE + CITY

**STEAL THIS — the daily bill. It is the strongest realistic-crash engine in either reference.**

- **A per-man daily wage**, *"increased by 2 crowns per level up"*, and the **greedy** trait adds 2 more
  immediately. *"If you fail to pay them their mood will decrease and they may decide to desert."*
- **FOOD IS A SECOND, SEPARATE DAILY DRAIN** — 2 units per man per day, modified by traits.
- Players report *"brothers cost about 450 per day, with savings quickly getting eaten up during dry
  spells."*
- **SETTLEMENTS ARE SERVICE PROVIDERS, and the services are priced in TIME and MONEY:** a **temple**
  speeds injury healing; a **Surgeon** follower unlocks *"only after you have treated 5 injuries at a
  temple"* and then costs **3,500 crowns.** A service you have to *qualify* for is better than one you
  can simply buy.

**WHY THIS IS THE MOST BOHEMIA-SHAPED SECTION IN THE FILE.** Bohemia is *"the most realistic economic
crash simulator, but fun."* **YOUR PEOPLE COST MONEY TO KEEP ALIVE** generates an entire campaign of
tension by itself: you take the bad contract because payroll is due. It makes **every hire a permanent
liability instead of a free upgrade**, and it couples straight into the other lanes — unpaid people
waver (COMBAT's morale), injured people still eat (CHARACTER's injuries), and a long recovery is money
leaving with no work coming back.

**AND LEVELLING RAISES THE WAGE.** A veteran is better *and* more expensive. **That is the
anti-snowball valve the perk tree will eventually need**, and it comes free with the wage.

**WON'T WORK HERE**

- **Desertion as the failure state.** Employees quit; **family does not.** In a dynasty the equivalent
  is not walking out, it is **resentment that persists into the next generation** — which is the
  "unhealed wounds" clause already in CLAUDE.md, and a better mechanic than losing a body.
- **Do not import their consumable economy** without its known defect: *"every single consumable is
  pretty much a guaranteed free fight win"* and the most common death is **dying with a full hotbar.**
  His 8/15 rewind ruling already dodged this — an income stream gets spent, a precious item gets
  hoarded.
- Three currencies are the world economy, **not** a combat bar. Unchanged.

---

## 02. WORLD MODEL

**STEAL THIS**

1. **CONTRACTS CHANGE THE WORLD STATE, permanently and visibly.** *"Depending on your actions and
   success in fulfilling contracts, settlements can find themselves in new situations, such as your
   action of escorting an important caravan resulting in a castle being **freshly supplied**."* The map
   remembers what you did. **That is the cheapest possible "the world feels alive"** — a state flag per
   settlement, no simulation.
2. **CONTRACTS PRICED BY INHERENT DIFFICULTY, as fixed per-type values** (*return an item = 400, find
   an artifact = 2,000*). A readable, tunable economy with no formula screen.
3. **EVERY SETTLEMENT CARRIES ITS OWN RELATIONS BAR, all starting Neutral.** Standing is *local*. The
   next town over does not know you yet.

**WON'T WORK HERE**

- **★ THEIR OWN WORST WORLD BUG, and it lands right on our laws:** players complain that *"heavily
  armed troupes of mercenaries materialize out of nowhere **in opposition to every rule that the game
  has established about the worldmap**."* Bohemia has LIGHT=TERRITORY, CLUSTERED POWER, and *nobody
  patrols the dark.* **If the map has rules, the spawner obeys them** — this is the exact failure to
  gate against.
- Their strategic layer is **travel-time-over-terrain**; ours is a 65-mile drivable valley with streets
  that connect like Lego. Take the *reactivity*, not the map model.

---

## 05. CHARACTER

**STEAL THIS**

- **INJURIES PERSIST IN DAYS, NOT HIT POINTS.** *"Light injuries will take a day whereas some more
  serious injuries can take up to 7 days."* Difficulty applied to **the calendar**.
- **A WOUND CAN GET WORSE WHILE HEALING:** *"just as he is about to heal the wound gets infected,
  putting him out for another 2-4 days."*
- **★ THE SHARP ONE: A PERMANENT INJURY DOES NOT DELETE A PERSON, IT RE-ROLES THEM.** Players note a
  permanently injured brother *"can become a backliner."* A body that can no longer hold the front line
  still holds the back. **That is precisely how a family absorbs a hundred years of damage**, and it is
  the dynasty's inherit-the-unhealed-wounds clause as a working mechanic.
- The counter-play is roster depth: *"have a fairly wide bench to swap people who are injured."*

**WON'T WORK HERE**

- **Injury LENGTH is their loudest balance complaint** (*"the length of some of these wounds is out of
  hand"*, and mods exist purely to shorten them). A 7-day bench plus an infection re-roll is a
  **frustration engine** at their scale. Ours must be shorter or the recovery must be *playable* — a
  wounded person doing lighter work beats a wounded person doing nothing.
- **One legendary item being the only cure for a permanent injury** is a lottery pretending to be a
  system. Skip it.

---

## 06. ART DIRECTION

**STEAL THIS — and it is a real, usable finding, not a vibe.**

1. **★ "THE SMALLER A FIGURE GETS THE MORE ICONIC AND READABLE IT HAS TO BE."** They support *"seamless
   zooming on the tactical map while keeping characters' faces clearly readable even when zoomed out."*
   **This is our 8/27 law reached from the other direction:** identity at 64×64 is **size and spacing,
   not detail.** Same conclusion, tone side instead of pixel side.
2. **★ THEY BREAK REAL PROPORTIONS ON PURPOSE.** *"Weapon icons don't use real proportions for similar
   reasons, with **exaggerated iconic features** to make them easily readable, resulting in a **stubby
   but tight** look."* A grounded game deliberately lying about proportion **for legibility**.
3. **THE FACES ARE CARICATURED TO CARRY THE GRIMNESS.** *"Almost caricature style with large heads and
   prominent facial features, in fact **borderline cute looking**"* — deliberate, because *"bloodshed
   and injuries occur at every turn and the death of Battle Brothers is common."* **A grim game
   exaggerated its faces so constant death would be bearable.**

**WON'T WORK HERE**

- **Borderline cute is not Bohemia.** Take the *principle* (exaggerate for legibility at size; let the
  silhouette carry identity) and **refuse the register.** Our valley opens at 06:00 in the dark and the
  tone is post-crash Vegas, not folk-tale grim.
- **A recolour is still never progress** (7/19). This is a shape-and-proportion finding, not a palette
  one.

---

## 11. UI

**STEAL THIS**

- **READABILITY IS ARCHITECTURAL, NOT DECORATIVE.** Their whole art direction (above) is downstream of
  *"must stay readable when zoomed out."* That is the playtest dispatch's item 6 — **zoom is the way in
  and out** — as an *art constraint* rather than a control question.
- **They shipped a full UI rework mid-development** (update 0.6.1.6, dev blog #74). Worth knowing: a
  dense tactical UI **is expected to be rebuilt once**, so the first one does not have to be final.

**WON'T WORK HERE / AND AN HONEST GAP**

- **BB is a desktop game with a dense, tooltip-heavy interface.** Bohemia is **iPhone portrait.** Their
  information density does not survive the format, and neither does hover — **there is no hover on a
  phone**, and a large share of their readouts are tooltips.
- **THE MATERIAL FOR THIS LANE IS THIN and I am not padding it.** I could not reach the UI dev blogs
  (`battlebrothersgame.com` is policy-blocked) and the search channel returned mostly the fact that a
  rework happened. **UI should not plan off this section.** A real UI round needs screenshots, which
  Paolo can produce in one minute and I cannot produce at all.

---

## 12. WORDS

**STEAL THIS**

- **EVENTS ARE ATTACHED TO IDENTITY.** A background *"opens up specific events and dialog choices"*,
  and the ratcatcher *"has bad events."* **The writing hangs off one identity word** — which is exactly
  what our QUEST STUDY and catalogue laws want, and it means text scales with the roster instead of
  being written per-quest.
- **CHARACTER IN ONE PHRASE:** *"a stuttering ratcatcher, a greedy witch hunter or a drunkard disowned
  noble."* **Noun plus one flaw.** That is the whole trick, and our VOICE CARD's "nobody in Bohemia is
  wise" is the same instinct: a person is a specific defect, not a summary.

**WON'T WORK HERE**

- **Their register is folk-grim medieval.** Ours is post-crash Vegas at 15% Spanish-speaking with three
  registers and a hard cap. Take the **structure** (identity → events → lines), refuse the voice.
- **Do not let an event become a wall.** LANGUAGE NEVER GATES REQUIRED INFORMATION already binds this;
  background-gated dialogue is the same trap wearing different clothes.

---

## 08. SOUNDS

**HONEST ANSWER: I HAVE ALMOST NOTHING, AND I AM NOT GOING TO INVENT IT.**

The only sound-related material the search channel returned is that *"the soundscape is described as
good and relaxing"* — which is a review adjective, not a mechanic, and **"relaxing" is not even what
this lane wants.** Their audio dev material is behind the blocked domain.

**WHAT I CAN SAY THAT IS ACTUALLY LOAD-BEARING, from the mechanics rather than the audio:** morale
(COMBAT above) is a **state change with no visual** — a body wavering is exactly the kind of event that
needs a *sound* to be legible, and that is a real hook for this lane if morale ships. Everything else
here would be me guessing.

**A REAL SOUNDS ROUND NEEDS HIM TO PLAY IT WITH THE VOLUME UP FOR TEN MINUTES.** That is a genuine
request, not a deflection: it is the one input I cannot get and he can get instantly.

---

## 07. REFERENCE LAB (this lane, for the next session)

- **The two references now cover different halves and MUST NOT be merged.** RF4 = the fight.
  Battle Brothers = the campaign. Where they overlap they **agree** (destructible armour layer; action
  economy with a floor; difficulty from scarcity not stat inflation) and where they disagree the newer,
  tighter design won (**RF4 removed the dice; BB is criticised exactly where its dice are**).
- **THREE INDEPENDENT SOURCES NOW SAY THE SAME THING about difficulty:** BB's developers
  (*"rather than inflating enemy stats... resource limitations, more enemies, late game enemies
  appearing earlier, slower healing"*), RF4 (*"movement asymmetry is a cleaner difficulty lever than
  stat inflation"*), and our own **NO DAMAGE BEFORE THE DIAL.** That is no longer a preference. It is a
  finding.
- **THE PROCESS LESSON FROM TODAY, WRITTEN DOWN BECAUSE IT COST A PASS:** I researched RF4 online before
  reading the 8/17 law that said *"LAB does not re-search RF4"* — Paolo had already captured 83 screens
  himself. **READ THE LAWS FOR YOUR LANE BEFORE YOU DO THE WORK.** And **he owns these games**: when a
  reference is a game he has, his own capture beats any search, and asking him for ten minutes of play
  is cheaper and better than a research round.

---

## 00 MASTER COORDINATOR

- **Two references are now live on one system, and that is the collision risk to watch.** COMBAT builds
  from the RF4 teardown spec; several Battle Brothers items above (armour layer, fatigue, morale) land
  in **the same combat code**. **They agree on the armour layer**, which is why it is the safest first
  build — but the routing should be explicit so COMBAT is not handed two shopping lists.
- **The items above that touch NO combat code, and can proceed in parallel today:** the daily wage
  (LIFE + CITY), relations per settlement (FACTIONS / WORLD), background-drives-wage-and-traits
  (PEOPLE), injuries re-role (CHARACTER), exaggerate-for-legibility (ART).
- **Two lanes should NOT plan off this file:** **UI** (material too thin, and BB is desktop while we are
  iPhone portrait) and **SOUNDS** (I have essentially nothing). Both are named as such above rather
  than filled with plausible-sounding guesses.
- **DEMO IMPACT: NONE OF THIS IS DEMO-BLOCKING.** Row 7 (the first five minutes) is still open and still
  the cheapest big win on the board, owned by RUN. Nothing in this dispatch displaces it, and the one
  demo-adjacent idea — *start already beaten* — is a framing for that opening, not a new system.

---

## THE SHORT LIST, IF ONLY THREE THINGS EVER GET BUILT FROM THIS FILE

1. **THE DESTRUCTIBLE ARMOUR LAYER (COMBAT).** Two independent references converged on it, and we are
   already carrying the field with a zero in it on every body.
2. **THE DAILY PER-HEAD WAGE (LIFE + CITY).** The strongest realistic-crash engine in either game, and
   it makes every person a liability rather than a free upgrade.
3. **BACKGROUND DRIVES STATS, WAGE, TRAITS AND EVENTS (PEOPLE).** Four systems off one word, and it is
   the shape our catalogue and attempt laws already ask for.

**All three are [PENDING, Paolo's call]** — they are structural, not mechanical, and EVERYTHING IS A
THUMB reserves genuine forks for him. **The refusal is not pending:** the d100 to-hit model is out,
because a locked law forbids it arithmetically.

---

## SOURCES

Reached through the search channel only — the developers' own blog, the wiki and the Steam community
are all blocked by this environment's egress proxy as organization policy, which the proxy README says
to report rather than route around. Overhype Studios' dev blogs (tactical combat mechanics, character
stats, concept art, company origins I & II, the reworked UI), the Battle Brothers wiki (Combat
Mechanics, Hit Chance, Damage, Attributes, Perks, Temporary Injuries, Character Backgrounds, Factions
and Relations, Origins), Metacritic user reviews, the RPG Codex review, and Steam community threads on
wages, damage calculation, injury duration and starting scenarios.

Companion files: `records/BOHEMIA_BATTLE_BROTHERS_REFERENCE_STUDY_8_18_26.md` (the study this routes),
`records/BOHEMIA_RF4_TEARDOWN_SPEC.md` (the fight reference), and
`records/rf4/BOHEMIA_RF4_DANGER_SCHOOL_MASTER.md` (his own capture — the model for how a reference
should be gathered).

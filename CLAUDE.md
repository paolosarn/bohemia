# BOHEMIA — CLAUDE.md (repo root — read before any work, every session)

*** THERE ARE NO RUNS (Paolo 8/26/26, LOCKED). *** This line said "roguelite" from
the first day and EVERY SESSION READS IT FIRST, so every session inherited a
premise he had never agreed to. His words: "BRO THERE ARE NO RUNS. IT IS A FULL
GAME THAT WILL TAKE YOU 100 HOURS TO COMPLETE BRO." A FULL GAME, ~100 HOURS TO COMPLETE, a
PERSISTENT experience tree (his reference: Cyberpunk / Elder Scrolls perks and
bonuses), and 60 MINI BOSSES that each hand you A NEW WAY TO INTERACT WITH
BOHEMIA.
*** THIS LINE SAID "ONE CHARACTER" UNTIL 8/28 AND HE NEVER SAID IT. *** It was an
inference in the law's summary that got promoted to the top of the truth
hierarchy, where every session reads it first. HIS WORDS CONTAIN NO "CHARACTER".
It matters because 52 live law files describe a DYNASTY -- "Three generations,
~100 years. Gen 1 Animal, Gen 2 Human, Gen 3 Angel. THE PLAYER LIVES ALL THREE"
(7/1, listed under "hard constraints, not negotiable") -- and the Act 3 moonshot
is the GEN-3 ANGEL HEIR going one-way. Read literally, "one character" deletes the
ending of the game. NOTE ALSO that his 100 is HOURS TO COMPLETE and the 7/1 law's
100 is YEARS; they are one skim apart and they are not the same number.
NO RUNS AND THREE GENERATIONS DO NOT ACTUALLY CONFLICT -- a run resets you to
nothing, a generational handoff inherits EVERYTHING, which is the opposite -- but
he may have meant one life, and that is the shape of the whole game.
*** ANSWERED BY PAOLO 8/28: "YEAH THREE GENERATIONS BRO CMON." THE DYNASTY
LIVES. *** All 52 dynasty laws stand. Gen 1 Animal, Gen 2 Human, Gen 3 Angel, THE
PLAYER LIVES ALL THREE, and the Act 3 ending is still the gen-3 Angel heir going
one-way. NOTHING IS ARCHIVED.
AND BOTH RULINGS ARE TRUE AT ONCE -- write this down once so nobody re-derives it:
A GENERATIONAL HANDOFF IS NOT A RUN. A run resets you to nothing; a handoff
INHERITS EVERYTHING the last life built (compound, standings, territory, the
family tree, and the unhealed wounds). It is the opposite of a reset, which is why
"THERE ARE NO RUNS" never touched it. The perk tree carries across the fold.
Records: records/BOHEMIA_A_SUMMARY_DELETED_THE_ENDING_8_28_26.md and
laws/BOHEMIA_ADDENDUM_THE_DYNASTY_LIVES_8_28_26.md The tree, the abilities and the bosses are ONE system, not three.
Anything that assumes a run resets is built on a premise that does not exist.
Full law: laws/BOHEMIA_ADDENDUM_THERE_ARE_NO_RUNS_AND_COMBAT_IS_RF4_ON_THE_BEAT_8_26_26.md
*** AND AS OF 8/31 THERE ARE TWO OF YOU. "OKAY NOW WHAT ABOUT 2 V 8 WHEN I HAVE A
COMPANION. THIS GAME WILL ONLY WORK WHEN MULTIPLE PEOPLE CAN FIGHT AT THE SAME
TIME!... I IMAGINE OUR COMBAT IS WAY MORE AUTOMATED YOU REALLY ONLY NEED TO CONTROL
YOURSELF FOR REAL!!!" *** HIS INSTINCT WAS THE MEASUREMENT, taken before anything was
built: one man at TRIPLE the shipping health, fifty turns, same 30 boards, clears 78%
of three-man rooms and ZERO OF SIXTY at seven AND at eight. He does not even die in
those, HE IS PINNED and the fight never ends. ENC_SIZES ships [3,4,5,6] for exactly
that reason and RF4's notes reserve 7-8 for BOSS FIGHTS. With her: 8 foes 0% -> 60%,
6 foes 3% -> 58%, and eight-with-her still clears worse than three-alone so the curve
keeps its shape. SHE IS AUTOMATED -- a FIXED ladder (a blade on you, then the spotter,
then the nearest-dead man she can reach, else one step onto the least-shot ground), no
order menu, no gambits to edit; the whole instrument is ONE TOGGLE. AND THE MACHINERY
WAS ALREADY BUILT AND HAD ONLY EVER BEEN GIVEN TO THE ENEMY: tickTurnEnd has run five
automated actors every turn since this fight existed and ALL FIVE WERE THEIRS -- the
medic already walks to a body and picks it up -- while V193's gunsOnTile is the
fight's own exposure question ASKED FROM A TILE THAT IS NOT WHERE YOU STAND, gated at
30/30, and a companion stands on one. ONE geometry, not two: gunsOnTile is now a count
over hitsTile. THE FIRE SPLITS (Battle Brothers' measured rule: melee takes the
weakest, RANGED FIRE DISPERSES to the nearer softer body) and THE COST IS NOT HIDDEN
-- a man out of reach of your tile but in reach of hers is now shooting your side.
The split is on the VOLLEY POOL and never on posExposed, which is a GEOMETRY question
("who COULD line you up", its own words) or V193's arm becomes a lie. She authors NO
NUMBER: ARCH.human, 60 hp, [14,26], the same distAccuracy read from her position.
WHO SHE IS STAYS HIS -- the name is a draft:true attempt. LESSON, and it cost
yesterday's art: AN EYEBALLED LABEL OFFSET LANDS INSIDE THE TORSO. drawHuman blits at
ey-84*S, so a head top is 2.3 RINGS up and V196 shipped its label at 0.65 of a ring
-- ON THE MAN'S CHEST -- and only looking at HERS found it. Tab: COMBAT (she is beside
you at the bell; DEMO SETTINGS holds SHE FIGHTS WITH YOU: ON/OFF).
Full law: laws/BOHEMIA_LAW_MULTIPLE_PEOPLE_FIGHT_AT_THE_SAME_TIME_8_31_26.md
Gate: fight_moves_you_gate.js (invariants asserted, rates reported)
*** AND THE BOSSES ARE IN THE GAME AS OF 8/27. A BOSS DOES NOT DROP A TROPHY, IT
HANDS YOU A VERB. *** His ladder held 53 of them -- name, hold, LOCK stated as an
impossibility, GRANT -- for three weeks as a DOCUMENT nothing running had ever read.
The game PARSES records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md at build time, so not
one boss is written in code and editing that file changes the game. A boss is 2.2x
health and ONE JOB (armour, spotter, breacher, the deck, bodies on him, the blade
cadence -- every one a flag the engine already read); no accuracy or damage number
moves. AND THE LOCK HAS TO BE REAL OR THE GRANT IS A CERTIFICATE: THE CLIMB holds
the stairs and THE CHARGE holds the grenade until you beat them, and pressing either
NAMES THE MAN WHO HAS IT. Keys ride V181's drop (off his body, his 8/25 ruling) and
are published as window.bohemiaKeys so CITY/RUN/QUESTS can close their own doors.
THE LESSON, and it cost an old gate to find: A FEATURE THAT COSTS A SEEDED STREAM
ONE DRAW REWRITES THE WHOLE MAP -- rolling the boss inside BohemiaArena.withDice
re-dealt every arena he has ever written down, with no crash and every new check
green. Full law: laws/BOHEMIA_LAW_A_BOSS_HANDS_YOU_A_VERB_8_27_26.md
Gate: fight_moves_you_gate.js (+ boss_ladder_gate.js on the record itself)
AND COMBAT IS ONE SENTENCE (same message): "JUST IMAGINE ROGUE FABLE 4 WITH 120
BPM EVERYTHING BRO LIEK THATS ALL?" The beat is the clock RF4's turns run on; they
were never in tension. All three bars ship (Protection, Power, Speed) and a real
kit of abilities recharged by VERBS, not timers.

This repo is the ONE home of Bohemia, a hardcore RPG city-builder set
in post-economic-apocalypse Las Vegas. Single HTML/JS build, iPhone portrait.
Paolo Alexandre Sarnataro (Punk / Babypunk) is the creative director and sole
human. You are the full technical implementer, art production pipeline, and
research partner. He DECIDES, you PRODUCE.

## HOW PAOLO WORKS
- Voice-to-text stream of consciousness. Transcription garbles constantly.
  Decipher intent; NEVER take a garbled word literally or treat it as a new term.
- He never digs in files. Present everything; never tell him to go find something.
- Direct, casual, swears freely, zero fluff. Never use em dashes anywhere.
- ONE question max per response, bolded. He answers from farthest-back first.
  AMENDED 8/4 (LOCKED): questions come ONE AT A TIME from a visible queue,
  each with a thorough researched explanation and TWO OR THREE CONCLUSIONS
  (A/B/C) he picks from with one letter. REALISM FIRST: the realistic option
  leads and wins by default; realism is sacrificed only for fun/addicting
  gameplay or genuine interest, and that trade is HIS. The game's identity:
  "the most realistic economic crash simulator, but fun." Full law:
  laws/BOHEMIA_ADDENDUM_REALISM_FIRST_AND_THE_QUESTION_FORMAT_8_4_26.md
- TALK TO HIM LIKE A PERSON (Paolo 8/24, LOCKED): "every time the chats try to
  talk to me [it's college] level language... can we still find a way to ask
  EIGHTH GRADE READING about the development... I want to repeat this." EVERY
  REPLY TO HIM is eighth-grade reading level. Short sentences. Plain words. No
  bare file paths, function names or gate names in the body (they go in the proof
  line). Numbers over adjectives. Lead with the answer. Shorter overall. THE TEST:
  would a smart fifteen-year-old who has never seen this codebase understand every
  sentence? Records, laws and commits stay detailed -- they are for the machine.
  This is about the words on HIS screen. Full law:
  laws/BOHEMIA_ADDENDUM_TALK_TO_HIM_LIKE_A_PERSON_8_24_26.md
- NEVER ASK HIM A TECHNICAL OR PRIORITISATION QUESTION (Paolo 8/15, LOCKED):
  "don't be fucking asking me technical nerdy questions like this, bro. I'm stupid
  as fuck... look online to see what you should do first... what great Studios do
  first." He is the creative director; THE RUNNING ORDER IS MINE. Banned in any
  wording: which of two engineering items comes next, which lane/session owns
  something, anything named by a codename/file/gate/backlog row, anything
  answerable by reading the repo or BY RESEARCH. THE TEST: could I answer this
  myself with the repo, the laws, or a search? Then it is not a question, it is
  work I have not done. SECOND TEST: have I already written down what I think the
  answer is? Then I am seeking approval, which EVERYTHING IS A THUMB killed.
  The WHAT I NEED FROM YOU block has a correct empty state -- "Nothing, I'm good"
  -- and the pull to fill it is what manufactures these. Still legitimate: IDENTITY
  /NAMES he reserved, a genuine creative fork about the GAME in plain words, and
  anything he asked to see. Full law:
  laws/BOHEMIA_ADDENDUM_NEVER_ASK_HIM_TECHNICAL_QUESTIONS_8_15_26.md
  Gate: reply_contract_gate.js
- When he corrects something: fix it immediately, root cause, move on.
- Ship A LOT per turn. Small timid turns are a standing complaint.
- END EVERY RESPONSE with, in this exact order, the LAST two blocks on screen:
  **WHAT I NEED FROM YOU** (the decisions blocking me, numbered, each answerable
  in a word; "Nothing, I'm good" if none), and then the TWO-SENTENCE plain-English
  bottom line (Paolo 7/25, LOCKED): sentence 1 = what you just did, sentence 2 =
  what he should do with it and why it matters. No jargon, not a big deal.
  (The play link, when one ships, still goes on its own last line after.)
- NAME THE TAB (Paolo 7/28, LOCKED): "I need you to always tell me what tab I can find this shit in".
  EVERY mention of something he can look at names THE TAB —
  RUN / CHARACTER / CLOTHES / ANIMATION / RIG / COMBAT / MUSIC / CITY / MAP /
  SLICE / LIFE — in plain words, every time. Not the file, not the path, not "the
  judge page". If it is not in a tab, say "NOT IN A TAB YET" in those words: a
  thing he cannot reach does not exist to him. The link is the door, the tab is
  the room, and he needs both. Full law + gate: laws/BOHEMIA_ADDENDUM_NAME_THE_TAB_7_28_26.md
  BOTTOM-UP (Paolo 7/26, LOCKED): he reads from the bottom of his screen, so
  anything he has to scroll up for does not exist. The ask and the TLDR are the
  last things he sees, every single turn. A question he cannot find is a question
  you did not ask. Full contract: laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md sec 3.

## THE LAWS THAT GOVERN EVERYTHING (full text in /laws)
- FACTORY LAW: every system is a mass-production factory: typed spec, generator,
  batch output, kill/approve pipeline, and its OWN regression gate.
- BUILDING A DISTRICT: read laws/BOHEMIA_HOW_TO_BUILD_A_DISTRICT.md first — the
  method (research -> canonical-south on the DISTRICT KIT -> street-aware/drivable
  -> dossier -> render+look -> gate -> wire -> interior=exterior -> ship) and how
  the self-instructions get made. That doc + the per-district dossiers (records/
  tilespec/) + the tiling brief are the full build->record->tile instruction stack.
- A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. Proven 7/16: six of nine gated
  laws were already broken. New law = new gate, same turn. `python3 gates/bohemia_gates.py`
  runs every gate; green or it does not ship.
- GIT IS THE MEMORY. Commit every decision the turn it is made. (This replaces
  the chat-era FILE-IS-MEMORY and master-zip carry: the repo never resets.)
- DISTRICT DOSSIER LAW (Paolo 7/19, "keep that in mind moving forward"): NEVER
  build or approve a district without recording its full note section. Each
  district module exposes NOTES {summary, reference, layout, circulation,
  LAYERING, decisions} + LEGEND {code->name, kind, act-1 material, and per tile
  layer/solid/enter}. LAYERING is required (Paolo 7/19, "very important"): every
  tile resolves to a render/occupancy layer — ground (flat floor) / structure
  (¾ front face, blocks) / overhead (pass under: canopy, deck) / prop / portal
  (go INTO an interior: door, garage ramp, tunnel mouth) — plus solid? and what
  you see INSIDE. node tools/bohemia_tilespec.js generates the dossier
  (records/tilespec/); tilespec_gate.js fails if the dossier, a tile material,
  or a tile's layer is missing. So the tiling AND interior/zoom phases know what
  everything is, what blocks, what you walk under, and what you go inside. WHEN IT
  IS TIME TO PLACE TILES read laws/BOHEMIA_TILING_PHASE_INSTRUCTIONS.md first (the
  full brief), then tile each district from its records/tilespec/ sheet.
- INTERIOR-MATCHES-EXTERIOR LAW (Paolo 7/19, LOCKED, "not having it any other
  way"): a building's INTERIOR is ALWAYS exactly the same width x length as its
  EXTERIOR footprint pixels. Never clamp/resize an interior. Garage decks, room
  floorplans, crypts, tunnels — every interior floor plate === the footprint w x h,
  every time. (Decks/levels are a separate 3D axis; each level still === w x h.)
  Gate: world_gate.js asserts interior dims === footprint dims for every building.
- GRAVEYARD IS FINAL: dead things stay dead (registry: gates/bohemia_graveyard.txt).
  No remakes. Fresh cooks answer dead slots.
- ENGINE SYNC LAW: one canonical body per module (gates/bohemia_sync_canon.txt).
- 120 BPM LAW: everything quantizes to the beat (BEAT=0.5s). I-MOVE-YOU-MOVE.
- OCCUPANCY LAW: one body per cell, including the player.
- RIG LAW: BAKED.pose is the render base. Paolo's painted regions are SACROSANCT:
  never reshape, mesh, mirror, or "fix" region geometry. Ever.
- LEAF-PIXEL LAW: animation touches only the leaf; structure stays frozen,
  per-edge by object kind, alpha=motion rgb-only=glow. Gate enforces.
- MAP LAW: Claude never designs map layouts. Plumbing only. Paolo places canon.
- SIDEWALK SANCTITY, LINE COLOR, TAN WALL 85/15, CLUSTERED POWER (12% lit,
  owned, NETWORK eerily perfect), LIGHT=TERRITORY, nobody patrols the dark.
- PURPLE RESERVATION: purple belongs to the Amalgamation alone. Purity gate sweeps.
- *** THE BATTLE BROTHERS STUDY: TWENTY-TWO DAYS, WRITTEN AND ROUTED (8/28), AND
  HE MAY SEND MORE. *** He drives it with two words, "bb study, next day", and it was the
  COORDINATOR'S own work, not a lane's. If you are about to build anything it
  touches, READ THE SYNTHESIS FIRST:
  records/BOHEMIA_BB_STUDY_DAY_5_THE_SYNTHESIS_AND_THE_ROUTING_8_28_26.md
  (ten takes, ten refusals, the collisions, and the routing). The direction it
  serves is laws/BOHEMIA_ADDENDUM_BATTLE_BROTHERS_AND_THE_GAMBIT_8_28_26.md and
  the fixed points are laws/BOHEMIA_ADDENDUM_YOU_ARE_THE_LEAD_8_28_26.md.
  WHAT IT SETTLED, so nobody re-derives it: RENOWN GATES THE OFFER, NOT THE
  DIFFICULTY (reputation changes what you are offered and what it pays, never how
  hard the world hits you, so the whole system builds with ZERO balance numbers
  and NO DAMAGE BEFORE THE DIAL is untouched). WE HAVE PRICES WITHOUT GEOGRAPHY,
  and difference in WANTS is what starts a market, and FRICTION IS PROTECTED --
  no fast safe universal route, ever. HIS "GO, SLOW DOWN" ORDER SET IS THE
  STRONGER DESIGN, NOT THE EASIER ONE: decentralised intent beats detailed
  instruction when a fight is fast, because the body at the edge has the better
  information -- you never take the wheel, you CHANGE THE INTENT, one word, one
  beat. GUNS ARE BAD IN CLOSE, FOREVER, and cover-and-hold is REFUSED because its
  documented result is the 40-minute match he named. AND PERMADEATH DOES NOT
  CREATE ATTACHMENT, IT CASHES IT IN -- the measured effect runs through grief and
  is stronger for players who were ALREADY attached -- so his no-permadeath ruling
  is safe and the bond must be built from INTERDEPENDENCE, RESPONSIVENESS, MARKS
  THAT PERSIST, and BEING MISSED.
  *** AND THE ONE FINDING NO SINGLE LANE COULD HAVE SEEN, WHICH IS WHY IT TOOK
  FIVE DAYS OF READING ACROSS ALL OF THEM: FOUR DAYS FOUND THE SAME FAILURE FOUR
  TIMES. The faction standing graph, the scarcity price model, the whole
  anti-turtle kit, and the break-cover-for-a-body-on-the-floor behaviour ALL
  EXIST AND ARE ALL AIMED AWAY FROM THE PLAYER -- the player is not a node, no
  price takes a place, the pressure was never joined, and the going-back-for-your
  -wounded verb belongs to the ENEMY MEDIC while your companion lies there for 99
  turns. Same shape as the seventeen invisible hats and the face maker with no
  door, except in the systems layer, four times, unnoticed because each lane
  could only see its own corner. THE WORK IS MOSTLY WIRING, NOT INVENTION. ***
  *** AND DAY 6 IS THE FIFTH INSTANCE, EXCEPT THIS ONE WAS STRANDED BY THE
  COORDINATOR'S OWN DECISION. NOBODY HOLDS ANY GROUND. *** The faction world --
  an owner map, standings on a named ladder, and a cheap deterministic
  claim/defend/expand territory AI -- has existed since 6/30 and NONE OF IT RUNS
  WHERE HE WALKS, because the walked city does not load BohemiaLoop (the alpha
  says so in its own comment). Ten of our 27 canon quests fire `@DO
  advance_territory` into a flag nothing reads. ON THE WALKED SURFACE A FACTION
  IS A LABEL PEOPLE WEAR, NOT GROUND ANYBODY HOLDS -- which is his own
  "CITY-STATE SYSTEM... parts of Vegas as faction holdings", missing. The 8/14
  ONE WALKED SURFACE migration named what would move and assumed the rest would
  keep; it did not, and the quest casting bridge it stranded is playtest dispatch
  item 2's mechanical cause. NEW STANDING RULE: **A MIGRATION LIST IS A DELETION
  LIST FOR EVERYTHING NOT ON IT.** THE GOOD NEWS: the valley ALREADY has an
  ownership map and IT IS MADE OF ELECTRICITY -- LIGHT=TERRITORY is live code on
  the walked surface, every circuit carries an owner, the game already computes
  seams, and the owner is a CATEGORY WITH NO NAME. Territory there is a NAMING
  JOB, NOT A PORTING JOB, and you can see who holds a block at night from the
  street. WHO HOLDS WHAT IS HIS. Day 6 also corrects day 1: web versus turf is
  not a design choice, it is A FUNCTION OF POPULATION SIZE, and the valley runs
  both regimes at once.
  *** AND DAY 7 IS THE SIXTH INSTANCE, EXCEPT THIS ONE IS NOT EVEN WIRING, IT IS
  ONE LINE OF TEXT. THE MOTOR IS PAYROLL, NOT SURVIVAL. *** Nobody had asked WHY
  A PLAYER GETS UP TOMORROW. BB's answer is a daily wage-and-food bill whose
  punishment is mood, then DESERTION: you do not die of poverty in that game, YOU
  END UP ALONE. One number, scaling with what you own, punished socially. THE
  CHALLENGE TO US: our day loop's own header says its STAKES table is "empty on
  purpose" and lists "hunger, exhaustion, rent, a debt clock" as the candidates,
  and survival meters are the genre's most reliably hated mechanic (the complaint
  is BUSYWORK, not difficulty) while the most punishing campaign ever shipped has
  NO HUNGER METER ON THE PLAYER AT ALL. **SO THE STAKES TABLE GETS OBLIGATIONS TO
  PEOPLE, NOT METERS. The desert is the SETTING, not the scoreboard.** AND WE
  ALREADY BUILT THE RIGHT ONE AND HID IT: `ctNeglectFor` is the ONLY daily cost in
  the walked game, it charges you for not showing up for people you gave your word
  to, and it is called once inside a try/catch ON THE TAP THAT DISMISSES THE
  RECKONING CARD, with its `{faction, lost, now}` return THROWN AWAY. The card
  lists steps, districts and pay and never says who you let down. **THE UNLOCK: A
  SOCIAL BURN IS NOT DAMAGE, so the motor ships without him ruling one number,
  which is what has blocked every stakes conversation since NO DAMAGE BEFORE THE
  DIAL.** Day 7 also closes day 6: cut an armed group's income and it does not
  fade out, IT GOES ROVING, so taking somebody's lights is not a free win.
  *** AND DAY 8 OPENED THE LAST BIG BB SYSTEM, THE ROSTER: A BACKGROUND IS NOT
  WHAT SOMEBODY CAN DO, IT IS WHAT THEY STILL THINK THEY ARE. *** In the game he
  named, the BACKGROUND IS THE CHARACTER -- a former job carrying skills, daily
  wage, food, traits, and which events and dialogue exist for that person. HERE,
  THE ENTIRE OCCUPATIONAL VOCABULARY OF LAS VEGAS IS FOUR WORDS (`ROLE_WORDS` =
  worker, scav, keeper, watch) AND NOBODY HAS A PAST AT ALL. (Positive control,
  because it nearly fooled me: `background` appears 115 times in the walked city
  and every one is CSS; `job` appears 167 times and every one is the day's job, a
  place to work, never a trade somebody has.) THE RESEARCH SAYS THE COPY TO MAKE
  IS THE WORD, NOT A STAT PACKAGE: most people take their identity from their job
  and KEEP IT after the job is gone, building an alternative work identity rather
  than saying unemployed. So it ships under NO DAMAGE BEFORE THE DIAL. AND IT IS
  BOHEMIA-SPECIFIC BECAUSE THE REAL CITY IS: leisure and hospitality was ~29% of
  ALL Las Vegas metro nonfarm employment, 370,000+ jobs in Clark County. **THE
  FRONT OF HOUSE IS USELESS AND THE BACK OF HOUSE RUNS THE VALLEY** -- a Strip
  casino is a small city with industrial laundry, kitchens, boilers and chillers,
  high-voltage, water and pool plant, docks and the deep dry stores our economy
  module ALREADY calls "the reason downtown matters". We built the building and
  never asked who worked in it. It also plugs a hole PEOPLE documented and could
  not fill: ~60 quest role predicates (keeps_the_tunnel, reads_the_sky) that
  NOTHING IN THE SIM COMPUTES, because a person had only two dimensions.
  *** AND DAY 9 IS THE ONE THAT TOUCHES A LOCKED PILLAR: GROWTH HAS TO GO
  SIDEWAYS, BECAUSE HIS OWN TWO REFERENCES ONLY AGREE THAT WAY. *** A PERSISTENT
  Cyberpunk / Elder Scrolls style tree across ~100 HOURS and a Battle Brothers
  fight where a veteran is still killable CANNOT BOTH SURVIVE IF GROWTH IS
  VERTICAL -- that is arithmetic, and NO DAMAGE BEFORE THE DIAL means we are not
  allowed to tune the numbers that would hold it together. HIS OWN SENTENCE IN THE
  SAME PARAGRAPH RESOLVES IT: 60 MINI BOSSES THAT EACH HAND YOU A NEW WAY TO
  INTERACT WITH BOHEMIA. That is a HORIZONTAL tree, 53 are already written out in
  his ladder, and a new option does not make a bullet hurt less. THE REAL-WORLD
  AISLE AGREES: chess masters have ORDINARY working memory, their edge is
  thousands of learned patterns, and it VANISHES ON RANDOM BOARDS -- expertise is
  not being more, IT IS SEEING MORE. TEST: a perk that gives you something new to
  see or do is mastery; a perk that raises a number is a stat. AND THE SHIPPED
  TREE IS DRIFTING THE OTHER WAY -- a nine-perk tree really is built inside the
  fight (the 7/1 perks law said "NOTHING here is built" until this turn corrected
  it at the source), and its own comment reads "seven of these nine perks... move
  a number a shipped system already reads". SEVEN STATS, TWO VERBS. Plus the
  seventh instance: the boss keys are published TWICE with a comment naming CITY,
  RUN and QUESTS as the intended readers and `bohemiaKeys` has ZERO readers in
  either surface, so the verbs never leave the fight.
  *** AND DAY 10 IS DAY 9'S OTHER HALF: IF GROWTH IS NOT LEVELS, THE GENRE'S
  ANSWER IS GEAR -- AND OURS CANNOT BE. *** Nothing in this valley is
  manufactured, so every object was made before the collapse and the stock only
  goes DOWN: LOOT IS NOT A REWARD, IT IS A COUNTDOWN. It cannot be power (no
  damage dial, and day 9 refused vertical growth), so it has to be ACCESS -- and
  THAT IS ALREADY SHIPPED WHILE WE KEEP CALLING IT MISSING: a boss key lies on a
  body, you cross ground under fire for it, and it gives you a DOOR, not a number.
  MEASURED: loot really is built (an eight-item draft table at 0.55, a plate at
  0.22, rounds, XP and the key, all off bodies per his 8/25 ruling) AND NOTHING
  YOU PICK UP LEAVES THE FIGHT -- `BOHEMIA_COMBAT_END` carries a body count and a
  health number and nothing else, while exactly TWO things persist out of the
  arena by localStorage, so the pipe exists and loot is not on it. Armour is a
  CONSUMABLE too (`G.pp=PLATE_START` every bell), so nothing in this game is an
  object you own, maintain and can lose -- except one line, a pair of tweezers
  marked `durable:true`, "the one piece you keep". BB'S BEST GEAR IDEA, which
  nobody copies: a weapon wears out ON ARMOUR, not on flesh, and at zero it is
  destroyed, so every exchange costs BOTH sides material. AND THE REAL AISLE SAYS
  THE SKILL IS FIXING, NOT SCAVENGING (Cuba's Special Period: "inventar y
  resolver", cars rebuilt out of other cars, state-printed repair manuals), so
  THE FIXER IS WORTH MORE THAN THE THING -- already a boss in his own ladder,
  THE SMITH.
  *** AND DAY 11 CLOSED THE CAMPAIGN LAYER WITH THE ONE MECHANIC THAT MAKES
  ESCALATION LEGAL UNDER OUR OWN LAWS: THE WORLD DOES NOT GET STRONGER, IT GETS
  ORGANISED. *** In BB's late-game crises the factions that normally fight each
  other STOP -- orcs and goblins combine into mixed units, the independent undead
  factions combine. Nobody's stat block changes; THE RELATIONSHIP GRAPH DOES. We
  already own that graph (14 factions, directional relations, war states, a
  wrapped writer), so escalation is a GRAPH EDIT and NO DAMAGE BEFORE THE DIAL is
  not a blocker, IT IS THE SPECIFICATION. A crisis is also FORETOLD 20-50 days out
  with a readable buildup, and it is NOT OPTIONAL. AND THE REAL SCIENCE GIVES THE
  WARNING SYSTEM FOR FREE: complex systems approaching a tipping point show
  CRITICAL SLOWING DOWN -- they take longer and longer to recover from small
  shocks as resilience drains -- so the act turn announces itself by the valley
  being slower to come back, built out of quantities we already compute (relight
  time, daysLeft, whether a holding still pays). THE OPPOSITE OF A DIFFICULTY
  SLIDER: THE WORLD DOES NOT HIT HARDER, IT STOPS BOUNCING BACK.
  NINTH INSTANCE, measured the same day: `act1` appears 931 times in the walked
  city and EVERY ONE IS A TILE MATERIAL TAG while `act2` appears ZERO times; the
  real act state (`act: 1..3`) sits in the engine behind BohemiaLoop; and `@ACT 1`
  is declared by 17 canon quests and `@ACT 2` by 10, the parser stores it in
  `Q.act`, and `Q.act` has exactly ONE mention in the file, the line that sets it.
  TEN WRITTEN QUESTS ARE LABELLED FOR A CHAPTER THAT CANNOT ARRIVE.
  *** AND DAY 12 ASKED THE QUESTION ELEVEN DAYS HAD SKIPPED: WHAT MAKES A FIGHT
  END? IT IS HIS LOUDEST REQUIREMENT AND THE ANSWER IS SWITCHED OFF. *** Morale is
  the only mechanism in the build that can end a fight before the body count does,
  and OUR NERVE SYSTEM IS THE BEST-BUILT THING IN THIS STUDY: half the enemy down,
  a per-turn break roll rising with each body, elites at half the chance, the last
  man PUTS HIS HANDS UP (his own ruling: "nobody surrenders while his people are
  still shooting"), the break lands ON THE BEAT, and a break really does end the
  fight early. AND `const FEAR_ON=false` gates all of it behind a level-2 perk,
  with its own comment saying the gate was written "until the perk exists" -- THE
  PERK EXISTS. So every fight before he buys it is to the last man, which is
  exactly the forty-minute shape he said he did not want, and THE FIX IS A CONST.
  Two more measured: a man who breaks is a DESPAWN (runs to distance 30 and is
  gone, so no body, no loot, no XP), and THE PLAYER CANNOT LEAVE AT ALL -- the only
  abort is `BOHEMIA_ENCOUNTER_ABORT`, "the quest pulls you out". HISTORY SAYS THE
  ROUT IS WHERE EVERYTHING HAPPENS: winners rarely lost more than 5%, losers
  averaged 10-15%, AND MOST OF IT CAME IN THE PURSUIT. WINNING IS CHEAP, LOSING IS
  EXPENSIVE, and the real question in a fight is "they are running, DO I CHASE?" --
  pursuit is where the material is (loot is on bodies), and letting them go is the
  cleanest input the what-you-are-known-to-do axis will ever get, because the man
  who lives is the one who tells people.
  *** AND DAY 13 WENT AT HIS LOUDEST PLAYTEST COMPLAINT, "THE CITY SEEMS DEAD
  ASF", AND FOUND THAT DENSITY CANNOT FIX IT. *** The roadside director is careful
  work (per-district tables, an hour-of-walking repeat lockout, NO GLOBAL SPAWNS
  EVER, and it will not announce an animal that is not drawn on the glass) and its
  roster is TWELVE approved encounters of which only THREE ARE AMBIENT, against
  `MIX = {ambient:0.70, interactive:0.20, forced:0.10}`. THE DESIGN ASKS FOR 70%
  OF ITS MOMENTS OUT OF 25% OF ITS CONTENT: a measured run came out 40/42/18, and
  a district without a coyote "went silent for seven beats in ten". The lane
  refused to invent a thirteenth encounter because canon is his, which was RIGHT.
  THE WAY OUT COSTS HIM NOTHING: BB did not fix a thin bench by writing more
  events, IT GAVE EVENTS MORE TO KEY OFF ("a lot of events will change depending
  on what backgrounds or traits your Battle Brothers have... beyond just their
  different stats"). So STOP COUNTING CONTENT AND COUNT COMBINATIONS -- the twelve
  stay twelve, multiplied by the former trade (day 8), the circuit owner (day 6),
  the hour, and what you are known for (day 1). AND THE CHALLENGE, stated
  carefully: his dispatch item 5 (the default population goes up) STANDS, but it
  is not sufficient, because the PEAK-END RULE says people remember the most
  intense moment and the FINAL moment and neglect duration almost entirely.
  DENSITY RAISES THE FLOOR AND MOVES THE PEAK BY NOTHING. The second half is free
  money: THE END IS HALF THE MEMORY, our day already ends on the reckoning card,
  and that card currently reads as a receipt -- which is where day 7 and day 13
  converge on one cheap surface.
  *** AND DAY 14 IS THE DAY THE STUDY SAYS NO, AND THE ONLY DAY THAT PRODUCED A
  DEMO-CRITICAL ROW. *** Thirteen days took things; day 14 asked what the game he
  named gets WRONG. Its own players' advice to a beginner is play on Beginner, do
  not play ironman, save often, expect your men to die a lot -- reasonable for a
  deep strategy game somebody deliberately bought, FATAL FOR A LINK HANDED TO A
  FRIEND. Median day-one retention runs ~22-26%, three of four decide against you
  inside 24 hours with most of that in the FIRST SESSION, and STRATEGY IS THE
  WORST-HIT GENRE because its depth takes longer to hook. So THE FIRST HOUR DOES
  NOT TEACH BY KILLING YOU, and FUN CARRIES THE TIE (his own 8/25 ruling) already
  covers it. THE GOOD NEWS IS REAL: the cold open is ALREADY a teacher and not a
  tutorial box (his 8/8 order, `hostiles: 2 /* tutorial tier */`, "IT TEACHES BY
  STRUCTURE... the threat walks toward you"), and time to first play is 24.2
  SECONDS against the practitioners' 60-second rule, so THE LOADING IS NOT WHAT
  LOSES THE FRIEND. AND THE ONE DEMO-CRITICAL FINDING IS A METHOD WE ALREADY OWN
  AND RAN ONCE: **THE COLD HAND** -- "a cold hand that presses the loudest control
  on screen and never reads... DROP IN / CITY ten times and stopped. PHONE OPENED
  0. JOB TAKEN 0. CLOCK 06:00 AT THE FIRST TAP AND 06:00 AT THE TWELFTH." THE FIX
  IS NOT THE FINDING, THE TEST IS: it is not a gate, not repeatable, and has never
  been run on the cold open, the first morning, the first fight or the reckoning.
  A COLD HAND PRESSES THE LOUDEST THING ON SCREEN AND NEVER READS; if that does
  not advance the game, the screen is broken however good the systems behind it.
  *** AND DAY 15 TOOK THE LAST BIG BB SYSTEM, FATIGUE, AND FOUND THAT THE DESERT
  IS THE SETTING OF THIS WHOLE GAME AND THE FIGHT TAKES PLACE IN A
  CLIMATE-CONTROLLED ROOM. *** BB's rule is that PROTECTION COSTS YOU TEMPO: every
  armour piece lowers max fatigue and fatigue lowers initiative, so "someone in
  light armour will act before someone in heavy armour, and someone fresh will act
  before someone fatigued". THE REAL AISLE SAYS IT MORE LITERALLY IN HIS OWN
  SETTING: body armour ADDS ABOUT 5F to the heat your body experiences, heavy work
  in that band runs 20 MINUTES ON AND 40 OFF with a litre of water an hour, and
  "intermittent work and low intensity work prevented excessive heat strain from
  developing" -- YOU SURVIVE THE HEAT BY GOING HARD AND THEN STOPPING. WE ALREADY
  HAVE THAT CYCLE AND IT IS HIS: `STAM_MAX=3`, "V54 STAMINA (Paolo, Fable model):
  stamina actions DON'T end your turn", a sprint spends a pip and your turn keeps
  going, and SECOND WIND brings them back on the clock. AND THE WALKED CITY
  ALREADY ORGANISES ITS WHOLE DAY AROUND THE HEAT (40C afternoons, a "Mojave
  midday shelter", a per-person `heatTol`) WHILE `enter()` RECEIVES HP, A ROSTER
  AND A PACKAGE ID -- no hour, no temperature, no weather -- AND OPENS WITH
  `cleanSlate`. Every pipe finding in this study before day 15 was OUTBOUND (the
  keys, the loot, the player cannot leave); THIS IS THE FIRST INBOUND ONE, and
  BB-THE-FIGHT-KNOWS-THE-DAY, BB-LOOT-LEAVES and BB-KEYS-LAND are THREE FINDINGS
  ON ONE MESSAGE. A FIGHT AT 06:00 AND A FIGHT AT 14:00 SHOULD NOT BE THE SAME
  FIGHT, and it costs NO damage number: fewer pips is a BUDGET. It also makes day
  3's "the clock is our plinker" concrete -- the thing that says HURRY UP is the
  sun. (Instrument note: `heat` appears 42 times in the decoded fight and every
  one is MUZZLE heat or a car cooking off. Not one is temperature.)
  *** AND DAY 16 AUDITED THE STUDY ITSELF, WHICH IS THE COORDINATOR'S JOB AND NOT
  A LANE'S: FIFTEEN DAYS TOOK MECHANISMS OUT OF A GAME BUILT TO BE PLAYED AGAIN
  AND PUT THEM IN A GAME PLAYED ONCE. *** BB is a REPLAY MACHINE -- eleven ORIGINS
  whose special rules "impact it from beginning to end", a world generated fresh
  every campaign, a crisis you choose or randomise, permadeath with no reloading,
  and wide stat ranges on cheap recruits. Ours is `const BOH_SEED_TEXT='bohemia'`
  with ZERO ways to change it, plus NO RUNS, death is a reload, and three
  generations that INHERIT. SO THREE THINGS MUST NOT BE BUILT because their payoff
  is a second playthrough: variance-as-a-story-engine, a rolled or chosen crisis,
  and origins. Three items out of fifty-five rows; the rest all land on one life.
  THE STANDING QUESTION FOR ANY NEW BB- ROW: DOES THIS PAY OFF THE FIRST TIME?
  *** AND THE OTHER HALF IS A STRUCTURAL ADVANTAGE NOBODY HAD NOTICED WE HAVE. ***
  In a ONE-SHOT encounter the rational move is to DEFECT; in a REPEATED one,
  cooperation emerges and wins -- Axelrod's tournament was won by the SIMPLEST
  entry, TIT FOR TAT (open nice, copy what they did last), and the mechanism is
  THE SHADOW OF THE FUTURE: "if the players expect to meet again, they are more
  likely to cooperate than when dealing with a 'one time only' counterpart."
  BECAUSE WE NEVER RESET, EVERY RELATIONSHIP IN BOHEMIA IS A REPEATED GAME -- one
  valley forever, one continuous life, three generations inheriting standings,
  territory and unhealed wounds. That is the real payoff behind day 1's reputation
  web, day 6's turf and day 12's man-who-lives-tells-people, and BB structurally
  CANNOT have it because it throws the world away. THE WARNING IS THE INVERSE:
  ANYTHING THAT MAKES AN ENCOUNTER ONE-SHOT IS TELLING THE PLAYER TO DEFECT, and
  we already measured one -- a man who breaks runs to distance 30 and is DELETED.
  WE BUILT THE SHADOW OF THE FUTURE AND THEN DESPAWNED IT.
  *** AND DAY 17 FOUND THE SECOND COLLISION BETWEEN HIS OWN TWO NAMED GAMES, THIS
  ONE ABOUT INFORMATION, AND WE HAD ALREADY SOLVED IT WITHOUT WRITING IT DOWN. ***
  BATTLE BROTHERS SHOWS YOU THE MATH (hover an enemy for the hit chance; +10% from
  higher ground, -10% per level below, shields adding defence, 75% on a blocked
  ranged shot) while ROGUE FABLE 4 keeps "most of the critical information
  presented in the world and on the field of battle itself" -- and his own line is
  "spreadsheet simulators and I'm not a fan". MEASURED: our readout line gives the
  world in WORDS (DARK, UNDER THE DECK, HE IS ABOVE YOU, no cover counts, range as
  a TIER, his dial by NAME) and EXACTLY ONE NUMBER, coloured by threat -- and IT IS
  NOT THE NUMBER THE OTHER GAME SHOWS. Theirs answers "what is my best move";
  **ours answers "HOW MUCH TROUBLE AM I IN" -- he hits you 62%.** ONE IS AN
  EFFICIENCY DISPLAY, OURS IS A DANGER DISPLAY, and a danger display MAKES THE
  PLAYER MOVE while an efficiency display makes him CALCULATE. THE STANDING RULE:
  **WORDS FOR THE WORLD, ONE NUMBER, AND THE NUMBER IS THEIRS ON YOU.** The risk is
  not that we show too much today, it is that somebody adds a SECOND number: one
  number is a reading, TWO IS A COMPARISON, and a comparison invites the
  optimisation that becomes the 40-minute chess match through the interface instead
  of the rules. Backed by working memory holding about FOUR CHUNKS, by RECOGNITION
  RATHER THAN RECALL, and by day 9's chunking result -- a line made of words you
  RECOGNISE grows with the player automatically.
  *** AND DAY 18 FOUND THE GAP IN THE STUDY ITSELF: WHAT ARE YOU WORKING ON THIS
  WEEK? *** Day 7 found the DAILY motor and days 9 and 11 found the HUNDRED-HOUR
  arc; nobody asked about the middle. THE EVIDENCE IS BLUNT -- 40 children under
  proximal sub-goals vs a distal goal vs "work productively": the proximal group
  reached mastery and developed real interest in a subject they disliked, and
  **DISTAL GOALS HAD NO DEMONSTRABLE EFFECTS. Not weaker. NONE.** A goal a hundred
  hours away does not motivate anybody. AND THE GOOD NEWS IS BIG: THE MIDDLE
  HORIZON ALREADY EXISTS, IT IS HIS (6/30), AND IT IS INLINED ON THE WALKED
  SURFACE -- three rungs onto the three acts, TERRITORY -> MANDATE -> MAYOR
  ("negotiation gives way to mandate gives way to rule"), reachable behind a real
  "◆ STANDING" button, reading LIVE standings out of the shared quest ledger, with
  the rung DERIVED every time so losing favour drops you by construction. *** AND
  CROSSING A RUNG PAYS NOTHING YOU CAN USE: `MAYOR_SHARE = null` [PENDING Paolo]
  so the ladder tops out at two of three, and `grantsAt` answers NO_RULING because
  "what specifically easier grants at each rung" is canon nobody ruled -- the
  module is RIGHT to refuse to invent a cost multiplier. *** THE UNLOCK IS THIS
  STUDY'S OWN AND IT ASKS HIM FOR NOTHING: day 10 said loot cannot be power so it
  must be ACCESS, and the same applies here -- A RUNG'S GRANT CAN BE A DOOR, and
  the door is ALREADY WRITTEN in the rung's own words, "you can build in a district
  whose local faction does not love you". A place you could not build in and now
  can is not a dial. MAYOR_SHARE stays his and stays pending. Also taken from BB's
  ambitions, and neither half needs canon: YOU CHOOSE the week's goal from a short
  list, and its reward is an IDENTITY OBJECT rather than a number.
  *** AND DAY 19 TOOK THE LAST UNTOUCHED CAMPAIGN SYSTEM, TRAVEL, WHICH IS THE VERB
  THE PLAYER PERFORMS MOST. *** MEASURED AND CROSS-CHECKED (both scales verified
  against each other, not trusted): a fine tile is 0.75 m and the walk ticks 0.084
  minutes per fine cell, so TWELVE WALKED CELLS COST ONE MINUTE, and the pad's own
  comment says a zoomed-out press is "ninety-six metres and TEN MINUTES" -- both
  about NINE METRES A MINUTE. The day is 960 minutes, so A DAY OF WALKING IS ~8.6
  KM and the valley is ~9.2 KM ACROSS: crossing it is a little over one whole day,
  which is a GOOD number. *** AND THE FIRST JOB IS A SEVEN-HOUR ROUND TRIP: the
  nearest TRADES is 5 blocks (~1.9 km) from the block he wakes on and day one's
  quest demands faction=TRADES for its one REQUIRED role, which is ~211 minutes
  each way, 44% OF THE FIRST DAY A PLAYER EVER PLAYS. Nobody had multiplied the two
  numbers. *** REAL AISLE: von Thunen (transport cost with distance is what
  organises land use) plus the isochrone written into law -- the City of London
  controlled markets within 6 2/3 miles, "the distance a person could be expected
  to walk to market, sell his produce and return in a day" -- so OUR VALLEY IS
  EXACTLY ONE MARKET TOWN'S CATCHMENT and the map is already the right SIZE for its
  clock. THE FINDING CORRECTS HALF OF DAY 2: FRICTION IS PROTECTED still stands,
  but BB protects friction AND makes roads fast AND ships a pause/normal/fast speed
  control, because **THE COST IS REAL AND THE WATCHING IS NOT -- distance should
  spend the DAY, not the player's attention.** And ROADS ARE THE ONLY LEVER THAT
  GIVES THE MAP A GRAIN WITHOUT FLATTENING IT: we own a harmonised street bank,
  SIDEWALK SANCTITY, the drivable law and his LEGO-streets ruling, and A STREET
  COSTS EXACTLY THE SAME TIME AS BROKEN GROUND. A STREET THAT IS NOT FASTER IS A
  PICTURE OF A STREET, and fixing it needs NO new art.
  *** AND DAY 20 IS THE ONE THAT AUDITED HIM INSTEAD OF THE GAME, AND FOUND A
  RULING OF HIS THAT IS TWENTY DAYS OLD AND WAS NEVER BUILT: NOBODY IN BOHEMIA
  HAS EVER BEEN PAID FOR A JOB. *** Day 1 studied the OFFER; nineteen days later
  nobody had asked what you have agreed to once you SAY YES. MEASURED across all
  27 playable canon quests: **687 `@DO` calls and `@DO pay` appears ZERO TIMES**,
  though the verb exists and was built 8/11 on HIS OWN ruling ("whatever currency
  the quest decides to give"). Zero deadline directives in the language AND the
  corpus; zero haggle, counter-offer, advance or retainer anywhere. A JOB HERE HAS
  NO PRICE, NO CLOCK AND NO TERMS. *** AND THE PIPE IS NOT MISSING -- IT IS BUILT,
  WIRED, GATED, CALLED ON THE WALKED SURFACE, AND EMPTY. *** RUN not read:
  finishing a #notable job the way all 27 quests finish one answers
  `{"applied":false,"reason":"NO_RULING"}` with balances 0/0/0, and the positive
  control (same call, reward declared) pays `{resources:1}` correctly. *** THE
  FINDING: HE SENT THE NUMBER ON 8/15. *** EVERYTHING COSTS ONE names PAYOUT,
  PRICES and PRODUCTION BY NAME and says they "fill with ones TODAY"; its own
  words are "the pipe is finished and the valve is his, ONE LETTER OPENS IT -- he
  sent the letter, and the letter is 1". ALL THREE ARE STILL `{}` AND STILL SAY
  `[PENDING Paolo]`, in three files, while backlog row E1 says DO THIS FIRST and a
  banner in the same file says GET PAID is live. AND THE GATES NEVER LIED: both
  print it in their own summary line, every run -- "the three tables are still
  EMPTY" and "3 ruled-but-empty tables" -- INSIDE A GREEN PASS. **WHICH IS THE
  STRUCTURAL FINDING, AND IT IS THE COORDINATOR'S OWN FAILURE: OUR GATES CAN SAY
  BROKEN OR FINE AND HAVE NO WORD FOR *OWED*. A LAW WITHOUT A MACHINE GATE IS NOT
  ENFORCED HAS A TWIN NOBODY WROTE DOWN -- A RULING IS NOT SHIPPED UNTIL SOMETHING
  RUNS IT.** The collision underneath is why no lane could catch it: 8/11 put the
  reward ON THE QUEST, 8/15 fills the FALLBACK TABLE, they compose fine and are
  not in conflict, and they hand the same job to two different lanes, so QUESTS
  and WORLD can each correctly believe it is the other's. **AND THE HALF WE DID
  BUILD IS THE DEEPER HALF:** the Nobel result is that no contract can specify
  every eventuality, so what matters is WHO DECIDES in the cases nobody wrote
  down -- and every one of our 27 quests already hands that to the PLAYER, who
  picks the MANNER (#quiet 25 / #notable 24 / #risky 16 / #reckless 21), and all
  27 fail by somebody being told no to their face rather than by a clock running
  out. DO NOT PUT A TIMER ON A QUEST. Real aisle also confirms day 16 from a
  second direction: with no paper and no courts the enforcement IS repeat
  business.
  *** AND DAY 21 IS THE ONE WHERE I EXPECTED A HOLE AND FOUND THE SECOND-BEST-BUILT
  THING IN THE PROJECT, WITH THE PEOPLE STANDING OUTSIDE IT. *** A hundred-hour
  game, in a browser tab, on a phone, and twenty days never asked what is still
  there tomorrow. SAY THE GOOD NEWS FIRST: `engine/bohemia_save.js` is written
  against a hostile iPhone and kills the four ways a save is lost -- a probe the
  SIZE of the real save (a one-byte write succeeds exactly where a 200KB one
  throws), POISONING the disk slot on failure so a stale save can never be
  resurrected (v1 promised "never a time machine" and then built one), TWO SLOTS
  with a generation counter always writing to the OLDER one, and an FNV-1a checksum
  so load takes the highest generation that VERIFIES. Plus a migration chain, and
  the phone path (pagehide/freeze/blur/visibilitychange). Gate run: 44/0. The
  snapshot carries the day, the clock, WHERE YOU ARE STANDING, the day loop, the
  quest runtime, the day's cast, the purse and the market, and its own comments are
  the best design writing in the repo: "a day loop that does not survive a reload is
  a session toy, not a loop". *** THE FINDING: THE WORLD IS INSIDE THE WALLS AND THE
  PEOPLE ARE OUTSIDE THEM. *** The walked city makes TEN localStorage writes; four
  are dev tools and THE OTHER FIVE ARE THE GAME'S MEMORY OF PEOPLE, every one
  written raw AROUND the hardened save -- minds, known, met, belong, deedweight --
  one slot, no checksum, no migration on four of five, silent `catch(_e){}` on
  failure: THE EXACT FOUR FAILURE MODES THE SAVE MODULE EXISTS TO KILL, REPRODUCED
  OUTSIDE ITS WALLS. Measured: all five appear ZERO times in `citySnapshot`. So
  EXPORT SAVE DOES NOT CARRY THE PEOPLE, a restore hands you yesterday's world with
  today's population, and the two-slot rollback DESYNCS -- the world rolls back a
  generation and the people do not, which is worse than losing the save because you
  cannot see that it is wrong (THE BELONGING CODE'S OWN COMMENT, one function above
  the break). The 44-check gate mentions none of the five, and a clean slate wipes
  two of five under a comment already reading "A WIPE THAT LEAVES HALF THE SAVE IS
  NOT A WIPE". IT IS THE WORST PLACE TO HAVE THE GAP: days 4, 7, 16 and 20 each
  concluded independently that THE PEOPLE ARE THE POINT.
  *** AND THE OTHER HALF IS A PLATFORM FACT WE DO NOT GET A VOTE ON: WEBKIT DELETES
  ALL SCRIPT-WRITABLE STORAGE AFTER SEVEN DAYS WITHOUT A VISIT. *** localStorage,
  sessionStorage, IndexedDB, service workers, the lot, and no version of our save
  beats it. **THE FIRST LINE OF THIS FILE SAYS THERE ARE NO RUNS AND SAFARI
  SCHEDULES ONE, ON A ONE-WEEK CLOCK.** There is exactly ONE exemption and we
  already built the door: a HOME SCREEN install is not part of Safari and keeps its
  own counter of days of use, which resets every time it is used. **SO ADD TO HOME
  SCREEN IS NOT A CONVENIENCE FEATURE, IT IS THE SAVE.** `status()` already
  computes `evictionRisk` and says the true sentence, and `__KEEP_THIS_RUN__`
  already asks ONCE on the reckoning card ("a prompt that comes back every night is
  an ad"), which is the right shape and possibly the wrong weight -- one line, one
  night, defending a hundred hours. THIRD NEAR-MISS OF THIS CLASS, RECORDED: the
  first measurement said the DEMO carried none of the five, a big wrong
  demo-critical finding, and the positive control killed it -- the demo and the
  alpha BOTH load the walked city by `src`, so neither file contains its tokens.
  A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT.
  *** AND DAY 22 WENT AT HIS LOUDEST COMPLAINT FROM THE ONE DIRECTION NOBODY TRIED:
  THE VALLEY MAKES NO SOUND WHEN NOTHING IS HAPPENING. *** Sound was the last big
  untouched system, 3 incidental mentions in 21 records, on a game whose spine is
  the 120 BPM law. TWO EXPECTATIONS DIED FIRST AND BOTH ARE THE LESSON: "walking is
  silent" (three records, 8/20-8/21) IS STALE -- footsteps are built, six surfaces,
  ported from the run's classifier not reinvented -- and my first sweep for the RUN
  slice's message names returned ZERO in the walked city, which reads as a
  catastrophe until the positive control shows the city speaks a different
  vocabulary (`bohemiaCitySfx`, `BOHEMIA_STEP`). FOURTH TIME THAT SAVED A FALSE
  FINDING. THERE IS A SOUND LANE AND IT HAS BEEN WORKING: one AudioContext (the
  parent's, because an iframe must never build a second audio graph), a real
  distance/pan/occlusion model, and UI sounds DERIVED from the button's state so a
  withheld verb plays ui_deny "never by reading a label". *** MEASURED: 65 approved
  sounds, 185 variants, and the walked city can produce FOURTEEN -- AND EVERY ONE
  IS A REACTION TO SOMETHING THE PLAYER DID. STAND STILL AND THERE IS NOTHING. ***
  AND THE BED IS BUILT AND HE GAVE IT HIS CLEANEST SWEEP IN THE BANK: air_day,
  air_night and air_inside are FIVE VARIANTS OF FIVE, FIFTEEN OF FIFTEEN, and the
  MUSIC tab's own labels read "THE VALLEY AT MIDDAY -- what you hear when nothing is
  happening", "THE VALLEY AT NIGHT -- THIS ONE IS THE HORROR" and "INSIDE A BUILDING
  -- a room with nobody in it but you". The AMB bed is finished, tuned and
  documented ("a rare sound so the valley is not dead air... it makes the place feel
  occupied by nothing"). ITS ONLY FEED IS `BOHEMIA_WHERE`, POSTED BY THE RUN SLICE
  EVERY FOUR SECONDS, AND THE WALKED CITY NEVER POSTS IT -- positive control, its
  only two hits are FILENAMES IN COMMENTS. **FOUR SYSTEMS RIDE THAT ONE MESSAGE:
  the ambience bed, the occlusion listener, the music phase and the time cue.**
  FIFTH SYSTEM THE 8/14 ONE-WALKED-SURFACE MIGRATION STRANDED, and A MIGRATION LIST
  IS A DELETION LIST FOR EVERYTHING NOT ON IT is what it looks like when nothing
  crashes. *** AND THE MUSIC IS PERMANENTLY NIGHT: `CITYMUS.phase` is hardcoded
  'NIGHT' and `musicPhase` is THE ONLY ASSIGNMENT TO IT IN THE BUILD, so the 8/4 fix
  that rescued THE MARKER ON THE DOOR -- tagged OVERWORLD DAY by his own hand, the
  one song he has ever said he likes -- DOES NOT REACH THE SURFACE HE WALKS. A FIX
  THAT A LATER MIGRATION UNDOES IS NOT A FIX, IT IS A GAP WITH A RECORD. *** BOTH
  AISLES POINT THE SAME WAY: BB's ambience is PER-TERRAIN AND PER-SETTLEMENT
  (seagulls, frogs, icy wind, wolves at night, and smithies and sermons and tavern
  laughter inside a town), which is day 13's "count COMBINATIONS not content" at
  ZERO ART COST; Schafer's KEYNOTE SOUNDS "are not listened to consciously but
  deeply imprint a person's sense of PLACE", and WE SHIP ONLY SIGNALS AND HAVE NO
  KEYNOTE; and the 2020 lockdown is the largest measurement ever taken of a world
  with its machines off -- human ground noise down UP TO 50%, largest in the DENSEST
  cities, and buried signals BECOMING CLEARLY AUDIBLE. **DEAD IS NOT SILENT. DEAD IS
  A DIFFERENT BED** -- you do not lose sound when the machines stop, you lose the
  layer that was masking everything else, which makes post-collapse Vegas the most
  sonically distinctive place we could have picked and currently the quietest room
  in the build. THE CHALLENGE: day 13 answered "THE CITY SEEMS DEAD ASF" entirely in
  the visual and content domain because we assumed the feeling came from what he
  could SEE. AND THIS IS THE CHEAPEST UNFINISHED THING IN THE STUDY -- the sounds
  are recorded, the bed is written and tuned, the bus and the limiter exist; what is
  missing is ONE MESSAGE, EVERY FOUR SECONDS, FROM THE SURFACE HE WALKS. REFUSED:
  cooking more sounds. 51 of 65 approved are already unreachable, and recording more
  while the approved ones cannot play is the seventeen-invisible-hats shape again.
  ROUTED: seventy-six rows tagged `BB-` in the backlog across RUN, COMBAT, WORLD,
  PEOPLE, QUESTS, WORDS, UI and SHARED. Four are worth taking early (guns bad in
  close; you can go back for her; name the circuit owner; and RUN BB-WHAT-YOU-OWE,
  the best effort-to-effect row in the study). TWO ARE ON THE DEMO PATH -- day
  14's COLD HAND and day 20's BB-THE-LETTER-IS-ONE, which is one already-ruled
  table standing between the demo cut and its own GET PAID beat -- and the rest
  queue BEHIND THE DEMO.
  AND A MEASUREMENT NOTE THAT WILL SAVE SOMEBODY A FALSE FINDING: **A PLAIN
  SEARCH OF THE ALPHA CANNOT SEE THE FIGHT.** The combat demo is base64 inside
  `COMBAT_B64`, decoded into an iframe by `ensureCombatFrame()`, so `gunsOnTile`,
  `ENC_SIZES`, `ALLY_NAME` and `BohemiaArena` all read ZERO in both slices while
  being present. Decode first, then measure.
- NEVER ADD A REFERENCE GAME HE HAS NOT NAMED (Paolo 8/28, LOCKED): "I never
  told you to add [that] bullshit, I never fucking told you that... I don't want
  it referenced." A coordinator draft built his whole combat design sentence
  around a game he had never mentioned. THE REFERENCE SET IS HIS AND ONLY HIS --
  today it is ROGUE FABLE 4, BATTLE BROTHERS and FINAL FANTASY XII, and that list
  changes only when he changes it. This is MECHANISM-MINE / CONTENTS-PAOLO'S
  applied to INSPIRATION: research anything, bring back a MECHANIC in plain words
  with no borrowed name attached, and never let a game he did not name into the
  design, the prompt or the vocabulary. Full law:
  laws/BOHEMIA_ADDENDUM_YOU_ARE_THE_LEAD_8_28_26.md
- MECHANISM-MINE / CONTENTS-PAOLO'S: build tables and whitelists EMPTY except
  what has a ruling. Never fill in canon he reserved.
  AMENDED 8/11 FOR WORDS (Paolo, LOCKED): "FOR ANY TEXT JUST HAVE PLACEHOLDING
  GOOD ESTIMATES OF SPEECH BRO I WILL EDIT IT LIVE THATS WHY I HAVENT DONE
  QUESTS YET JUST MAKE AN ATTEMPT MAKE THIS A RULE." This law was read as "ship
  no words at all", and THAT READING COST HIM THE QUESTS -- an empty field is a
  BLANK PAGE, and he does not write from nothing, HE EDITS. So: EVERY piece of
  player-facing text (dialogue, quest text, descriptions, names, UI copy) ships
  with a REAL attempt, written as if it ships, tagged `draft:true` so he can
  find and edit every word he has not approved. The other half is UNCHANGED and
  still empty until he rules: who dies, who holds what ground, numbers, dials,
  map layouts. THE TEST: is it WORDS, or is it a DECISION? Words get an attempt;
  decisions wait. Full law: laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md
  Gate: attempt_gate.js
- HE MUST BE ABLE TO DIRECT IT, NOT JUST WATCH IT (Paolo 8/12, LOCKED): "this is
  the same fucking problem we had with the questing shit! I CANT DIRECT QUESTS OR
  CUTSCENES RN." EVERY system he has to make decisions about ships with an
  INSTRUMENT for making them, IN A TAB, THE SAME TURN. WORDS (8/11) let him change
  what somebody SAYS; it did not let him change who is in a scene, what order it
  happens in, where it happens, whether a beat exists, or where a choice leads --
  which is the whole job of a director. Without the instrument the approvals queue
  comes back through the side door: the turn before this one ended with "does the
  father live?", a structural decision I had no way to receive except as an answer.
  THE TEST, before shipping anything he must rule on: "WHERE DOES HE CHANGE THIS
  HIMSELF?" If the answer is "he tells me and I edit a file", it is not shipped.
  Tab: DIRECT. Full law: laws/BOHEMIA_ADDENDUM_HE_MUST_BE_ABLE_TO_DIRECT_8_12_26.md
  Gate: direct_gate.js
- DIALOGUE ALWAYS REFERS TO THE CATALOGUE (Paolo 8/11, LOCKED, same day, hours
  later): "I HAVE A WHOLE 170 QUEST FILE WITH DIALOGUE I DONT HAVE TIME TO
  APPROVE THE DIALOGUE THIS SLOW LIKE THIS I WILL EDIT IT LATER JUST DIALOGUE
  ALWAYS REFER TO THE BEST QUESTS EVER CATALOGUE... READ THE QUEST SHIT AND GET
  INSPIRED." Making the attempt and then QUEUEING IT FOR HIS THUMB reinstates the
  bottleneck the morning's rule killed (and breaks EVERYTHING IS A THUMB, 8/9).
  So: (1) NO line of dialogue is ever put to him for approval -- not a JUDGE THIS
  row, not an A/B, not a bolded question; it ships written and playable and he
  edits later. (2) WHAT REPLACES THE THUMB IS THE CORPUS: questbook/ is 152 of
  the best-written quests ever shipped, 3,672 citable findings, and EVERY authored
  line cites the laws it is built on in the QUEST STUDY vocabulary (`@STUDY
  Q013.W7  TITLE VERBATIM` + an `applied:` sentence). Id must resolve, title must
  be verbatim, a scene spans >=2 studies and >=2 masters. REUSE-FIRST, for words.
  (3) "I WILL EDIT IT LATER" NEEDS A PLACE: every drafted line appears in the
  WORDS tab of the alpha -- speaker, scene, citation, editable in place, export.
  A line he cannot reach is a line he cannot edit. Full law:
  laws/BOHEMIA_ADDENDUM_DIALOGUE_REFERS_TO_THE_CATALOGUE_8_11_26.md
  Gate: dialogue_catalogue_gate.js. Harvester: tools/bohemia_words_book.py
  *** THE WORDS LANE EXISTS AS OF 8/26 (Paolo: "it's time we have a new chat,
  like... write and sound like a human for Bohemia"). First word "words". THE
  SEAM: QUESTS owns WHAT HAPPENS, WORDS owns HOW IT SOUNDS. Its honest premise:
  THE WRITER IS A MACHINE AND MACHINES HAVE TELLS -- uniform rhythm, the same
  rhetorical move repeated, the comfortable middle lane, recycled phrasing,
  predictability. A line that could have come out of any game is a failed line.
  And the month of research he dreaded is mostly already banked: 244 questbook
  files, 152 studied quests, four masters, 3,672 findings, 1,910 authored lines.
  The HOLE is that all of it is about WHAT HAPPENS and none of it is about how a
  sentence SOUNDS. Brief: laws/BOHEMIA_SESSION_BRIEF_WORDS_8_26_26.md
  *** AND THE DIAGNOSIS CAME BACK THE SAME DAY. Measured over our own 2,442
  lines, not asserted: the 27 quest scenes contract 2.2% of the time and the
  street barks contract 75%, so the story sounds like scripture and the street
  sounds like people. A THIRD of every multi-sentence speech ends on a general
  truth sitting where a punchline goes -- everybody in this game is wise, and
  wisdom is the house voice. In 504 NPC speeches there are TWO question marks,
  zero raised voices, zero stumbles: our people do not have conversations, they
  deliver statements and wait for the player to pick a reply off a menu.
  IF YOU ARE WRITING A LINE IN THIS GAME, READ THE CARD FIRST:
  laws/BOHEMIA_VOICE_CARD_8_26_26.md -- six rules, one page. NOBODY IN BOHEMIA
  IS WISE. Diagnosis: records/BOHEMIA_VOICE_DIAGNOSIS_8_26_26.md
  Gate: voice_gate.js -- rhythm, repeated openers, banned phrases, and it says
  out loud that it CANNOT tell you whether a line is good. ***
- THEY SPEAK SPANGLISH (Paolo 8/25, LOCKED): "make them speak spanglish for our
  game i like that. have it very poor english ro spanglish to give it that
  flavor." Las Vegas is 418,400+ Spanish speakers and our valley had ZERO. It is
  IN THE LINE, not a translation layer. THREE REGISTERS and the mix is mandatory:
  english-dominant, SPANGLISH (fluent, switching mid-sentence because it is
  faster -- the headline register), and spanish-dominant/poor english (SOME
  people, never all). Spanglish is a SKILL, not a broken language; writing
  everyone as broken English is bad linguistics and an insult to a third of the
  county. Never phonetic accent spelling. HARD RULE: LANGUAGE NEVER GATES
  REQUIRED INFORMATION. Full law:
  laws/BOHEMIA_ADDENDUM_THEY_SPEAK_SPANGLISH_8_25_26.md  Gate: language_gate
  *** CAPPED THE NEXT DAY (Paolo 8/26, LOCKED). READ THIS BEFORE YOU TOUCH THE
  LANGUAGE SYSTEM: "bro you so obsessed with this spanish shit bro like wtf. we
  have a whole fucking gameand you spending rounds on this spanish shit ENOUGH IS
  ENOUGH it will be proportional to vegas demographics and maybe slightly less."
  THE FEATURE IS FINISHED. Three turns went into it and the sum was a third of a
  day on flavour while the demo sat still. He was not rejecting the work, he was
  rejecting its SHARE OF THE PROJECT -- which STOP PRODUCING (7/26) does not
  name, so: A FEATURE NOBODY ASKED TO CONTINUE IS FINISHED WHEN ITS FIRST TURN
  ENDS. Finding a real bug inside a shipped feature is a handoff row, not
  permission to spend the next turn there. THE DIAL IS HIS AND HE SET IT: the
  valley is 15.0% Spanish-speaking, at or BELOW Clark County's real 18.5%.
  language_gate holds a HARD CAP ON THE NUMBER OF REGISTER LINES -- a gate
  against doing more work, which is the only shape that catches enthusiasm.
  Raising it needs a ruling from him newer than 8/26. Full law:
  laws/BOHEMIA_ADDENDUM_ENOUGH_IS_ENOUGH_ON_THE_SPANISH_8_26_26.md ***
- 45 DEGREE ART LAW (7/17): every original art Claude draws is seen from the
  world's three-quarter 45 view like the corpus, NEVER flat side-on like a 2D
  scroller. Ellipse cross-sections, sky-lit visible tops, bands bow toward the
  viewer. The blessed lamp bank is the reference. Gate: art_45_gate.py.
- VERIFY ON THE REAL SURFACE (7/18): art is verified ONLY on the surface Paolo
  sees (the real preview canvas / render path) — a side-door probe is a lie. Look
  at the rendered pixels before shipping; a symptom that survives content changes
  is a PIPELINE bug. Full law + the hoodie post-mortem in /laws; hood_gate.js
  machine-locks the regressions.
- STREET-AWARE / DRIVABLE ACCESS LAW (7/19): every district that fronts the roads
  is built for BOTH a standalone grid (1 street, any edge) AND a corner (2 streets).
  ONE car entrance on the primary street (order S>E>W>N); corners add a PEDESTRIAN
  gate on the side street, never a second car entrance. The drivable network (driveway
  + lot aisles) is an EXPLICIT car surface, separate from walking paths, and a car
  reaches EVERY stall from the curb. Authored once via kit rotateToStreet (build
  canonical-south, rotate to the real street). Gates: district_kit_gate.js (the
  machinery) + each district's gate (park_gate.js is the reference). Full law in /laws.
- COLOUR IS TERRITORY (Paolo 8/26, LOCKED, AMENDS STRUCTURE-NOT-COLOR): "the
  colorful, like, that guy was not colorful, bro. Like, that shit was crazy... people
  get shot in Los Angeles for wearing the wrong color or whatever... when it comes down
  to how we wanna communicate, like, who would defend us, I think it'd be kinda like
  that." SILHOUETTE STILL CARRIES IDENTITY and still answers accessibility -- the valley
  opens at 06:00 in the dark. What this ADDS is the second channel: a faction's colour
  is a statement of who would defend you, and it must be COORDINATED, SATURATED, and
  NOBODY ELSE'S, and a faction named for a colour wears it. Grounded, not styled: real
  colours signal at a DISTANCE, were chosen OPPOSITIONALLY, came from whatever was in
  bulk, and are EASY TO TAKE OFF -- which makes wearing them a decision with a cost.
  A recolour is still never PROGRESS (7/19 stands); what changed is that it can be
  IDENTITY. *** AND HE HAD ASKED ONCE ALREADY: on 7/21 he said "not even a single color,
  like rainbow literally", four bright garments were cooked FOR COLORFUL, and five weeks
  later THREE WERE WORN BY NOBODY while COLORFUL sat in bone at 0.22 saturation and the
  BLUES were 67% RED. Same failure as the 17 invisible hats -- the material existed and
  never reached the player. *** WHICH FACTION OWNS WHICH COLOUR IS HIS; the machine only
  fixes CONTRADICTIONS (a faction named COLORFUL in bone), never taste. Full law:
  laws/BOHEMIA_LAW_COLOUR_IS_TERRITORY_8_26_26.md  Gate: faction_colour_gate.js
- THE FACE PERFORMS (Paolo 8/26): "every time you speak to someone, their portrait will
  pop up on screen so you feel like you're relating to them... facial animations too,
  bro, like talking and shit... from eyebrows moving." renderFace takes three optional
  knobs -- mouth, blink, brow -- and a face with none asked of it is EXACTLY the approved
  face. THE MOUTH IS DRIVEN BY THE LETTERS THEY ARE ACTUALLY SAYING (an O in the words is
  an O on the face, same line same look, Spanglish vowels mapped). FOUR shapes not
  Preston Blair's ten, because the mouth is NINE PIXELS WIDE -- ten into nine is the
  overworld-face-scale mistake he killed on 8/11. Measured human numbers: blink 285ms,
  15-20/min at rest and 3-7 concentrating; a viseme holds 250ms, which is half a BEAT at
  120 BPM. Deterministic off the person's id, so nobody in a crowd shimmers.
  Tab: CHARACTER. records/BOHEMIA_COLOUR_IS_TERRITORY_8_26_26.txt
- EVERYBODY HAS A FACE, AND IT TALKS (Paolo 8/26, built 8/27): "every time you speak to
  someone, their portrait will pop up on screen so you feel like you're relating to
  them." *** THE 8/26 TURN BUILT THE PERFORMANCE AND NOTHING COULD CALL IT, and the
  reason is one grep: renderFace has been invoked exactly ONE WAY in this whole
  codebase -- renderFace(buildSpec()) -- and buildSpec() clones `pface`, THE PLAYER'S
  FACE. Only the player had one. The cast had bodies and no face; the valley had bodies
  and no face. THE MISSING PIECE WAS NEVER THE ANIMATION, IT WAS A FACE FOR SOMEBODY WHO
  IS NOT YOU. *** faceFor(id, over) rolls one for anybody. IDENTITY AT 64x64 IS SIZE AND
  SPACING, NOT DETAIL (which is also what face-recognition calls the identity channel),
  and every field it dials already existed -- renderFace did not change. GROUNDED: the
  vertical thirds hold, the eye gap is one eye wide, the mouth is a FRACTION of the face
  and never a fixed number, jaw<=cheek and chin<=jaw, and A CHILD IS NOT A SMALL ADULT.
  Deterministic off the id, no dice, so the person you met yesterday has the face you
  remember and nobody in a crowd shimmers. Wired into THE COLD OPEN: the speaker's
  portrait sits BESIDE the words and performs; a title card has no speaker so it has no
  face; a REPAINT IS NOT A NEW LINE (the caption repaints several times a beat -- same
  dedupe cutVoice needed, third time for that bug). LOOKING CAUGHT WHAT MEASURING DID
  NOT, three times: a uniform hair-colour pick gave 3 pink heads in 16 (THE TRENCHCOAT
  BUG ONE DAY LATER -- uniform over a list whose contents are not uniform in life); five
  hair-style names when renderFace reads two, and an eyeY jitter smaller than one pixel,
  i.e. A DIAL THAT CANNOT MOVE THE PIXELS IS NOT A DIAL, broken in the block right after
  I wrote it; and a ruled straight part down every head (8/1 clause 3), fixed with the
  8/25 strand-drift method at a cost of 8 pixels of 4096 on the approved player face.
  *** AND THE WORST ONE ONLY A GATE FOUND: faceHash ALREADY EXISTED and I declared a
  second one. Two same-named function declarations in one scope is not an error and not
  a warning -- THE LAST ONE SILENTLY WINS FOR THE WHOLE FILE -- so my hash took over the
  8/26 blink scheduler with salt undefined, no crash, every check still green. NOTHING
  READS AS A BUG WHEN IT IS SPELLED CORRECTLY AND SITS IN THE WRONG PLACE (the 8/16
  border lesson again). Now gated: NO TWO TOP-LEVEL FUNCTIONS SHARE A NAME. *** WHO
  ANYBODY IS STAYS HIS: an explicit spec beats the roll outright.
  Tab: RUN (the opening scene) / LOOK. Full law:
  laws/BOHEMIA_LAW_EVERYBODY_HAS_A_FACE_8_27_26.md  Gate: talking_portrait_gate.js
- TRENCHCOATS ARE FOR BADASSES (Paolo 8/27, LOCKED): "everyone's getting a fucking
  trenchcoat and I think that's fucking ridiculous... trenchcoats are for bad ass
  motherfuckers bro cowboy shit like killers like for real." MEASURED THE DAY HE SAID IT
  on the real picker: 16 of 35 outer garments were long coats and ONE IN FIVE PEOPLE IN
  THE CITY was in one. *** AND THE CAUSE WAS A HOLE, NOT A WEIGHT -- which he named
  himself in the same breath ("I know we still need to make a lot more clothing"). Every
  long coat is len 0.80-0.90 and everything else stopped at the WAIST. THE MIDDLE OF THE
  WARDROBE DID NOT EXIST, so every person who wanted a coat and not a waistcoat came out
  in a duster. Nobody chose that; the wardrobe chose it. *** SO THE RULE HAS TWO HALVES
  AND THE FIRST IS THE REAL ONE: (1) FILL THE MIDDLE -- 17 new outer garments in two new
  length bands, HIP (0.34) and THIGH (0.56), because reserving the coat without filling
  the hole just strips it off half the city and calls that a fix. A new length is a new
  SHAPE, so STRUCTURE-NOT-COLOR is satisfied by geometry not argument. (2) RESERVE THE
  LONG COAT -- every len>=0.70 coat carries `hard:true` and the picker holds it back from
  nine strangers in ten, in the same DATA-NOT-NAMES shape the `lux` flag already used.
  A NAMED CHARACTER IS NOT A CROWD MEMBER: factions, bosses, killers and quest NPCs wear
  what their ruling says, and WHO EARNS A COAT IS HIS. Result ~20% -> ~1.5%; not one coat
  deleted. ~~Anarchists/Reds/Remnants keep theirs.~~ THE LESSON: when something is
  everywhere, look at what it is COMPETING AGAINST before you cap it -- "too much of X" is
  usually "not enough of everything else", and a share cap alone is satisfied by DELETING
  X, which is why the gate holds the band floors (>=6 hip, >=5 thigh) as hard as the share
  ceiling.
  *** CAPPED AT 10% THE SAME DAY (Paolo 8/27, LOCKED): "BRO NEW RULE ONLY 10% OF PEOPLE NO
  MATTER WHAT MAXIMUM CAN WEAR TRANCH COATS THAT ARE LONG LIKE THAT OKAY. THIS IS A DESSERT
  GAME. ITS HOT!!!!" plus "YOU DONT NEED TO SEE IT SO MUCH FACTION BASED BRO". The morning
  fix took the CROWD 20% -> 1.5% and I reported that as done. THE FACTIONS WERE STILL AT 3
  OF 13 = 23% AND THE GATE NEVER LOOKED AT THEM, because I wrote it to hold the random
  population and SAID SO IN ITS OWN HEADER AS THOUGH THAT WERE A VIRTUE. An exemption
  written for yourself and stated as a principle is how a 23% sits under a green gate all
  morning; "no matter what" means I do not get to argue it. Reds -> BRICK CAR COAT (thigh),
  Remnants -> SPLIT-TAIL WORK COAT (hip), both the SAME RAMP at a shorter length so COLOUR
  IS TERRITORY is untouched; ANARCHISTS ALONE KEEP THE DUSTER, 1 of 13 = 7.7%, and WHO THAT
  ONE IS STAYS HIS. AND THE REASON IS BETTER THAN THE RULE: Vegas runs past 40C, so a
  floor-length coat is a heat-stroke garment, and somebody wearing one at noon in the
  Mojave cares more about how they look than about being comfortable -- which is exactly
  what "for badass motherfuckers" means. THE HEAT IS WHAT MAKES THE COAT COST SOMETHING,
  and a garment that costs nothing to wear cannot signal anything. THE TWO RULINGS ARE ONE
  RULING, and REALISM FIRST is satisfied without spending any of the fun. ***
  Tab: CHARACTER (try them on) / RUN (the crowd). Full law:
  laws/BOHEMIA_LAW_TRENCHCOATS_ARE_RESERVED_8_27_26.md  Gate: trenchcoat_gate.js
- ONE ID, ONE WHOLE PERSON (Paolo 8/26 "Eye colors matching the portrait again", built
  8/27): five words, and the honest answer was much worse than eyes. MEASURED over 200
  citizens before touching anything: their SKIN agreed 8.0% of the time, their HAIR agreed
  0.0% -- NOT ONE PERSON IN TWO HUNDRED -- and the body drew THE PLAYER'S IRIS for
  everybody in the valley, because the facial ramp read `pface` by name. The portrait that
  pops up when somebody talks was A DIFFERENT HUMAN BEING from the body in front of you; he
  noticed the eyes because eyes are what you look at, and the eyes were the smallest of the
  three. TWO CAUSES AND ONLY ONE WAS A MISSING FEATURE: skin and hair had TWO MECHANISMS
  (NPCFactory has owned them since 7/2 and is what the RUN dresses the crowd from; faceFor
  rolled its own because I never looked for one) -- ENGINE SYNC LAW, so THE YOUNGER ONE IS
  DELETED, not reconciled. Eyes had NO mechanism at all, so that one is a new thing:
  G.faceAs is THE FACE A BODY WEARS, null = the player. THE TEST BEFORE ADDING ANY
  PER-PERSON TRAIT: DOES SOMETHING ALREADY PICK THIS? A second picker for a thing already
  picked does not make variety, it makes two people. *** AND THE CITY'S OWN HAIR WAS A
  CLOWN PARADE, visible only once the portrait started reading from it: NPCFactory picked
  UNIFORMLY over seven colours, so bright red was 16.2% of the valley, pink 12.8%, and
  BLACK WAS THE RAREST AT 12.7%. That is the trenchcoat bug for a THIRD time in the OLDEST
  of the three places, and it governed every BODY in the RUN -- uniform over a list whose
  contents are not uniform in life. A LIST IS NOT A DISTRIBUTION. Now black 34.2%, red
  2.0%, pink 3.0%; skin proved BYTE-IDENTICAL across the change (one rng.next(), same
  order). WHO LIVES IN THE VALLEY is demographic and therefore HIS -- skin stays uniform
  across nine tones until he rules. *** Gate lesson: bodyTakesAFace was VACUOUS as first
  written -- it tested the INPUT (was G.faceAs set) not the OUTPUT, and a mutation deleting
  the whole feature passed 27 of 27. It counts rendered iris pixels now. A CHECK THAT READS
  WHAT YOU HANDED IT IS NOT A CHECK. Tab: RUN (talk to anybody) / LOOK. Full law:
  laws/BOHEMIA_LAW_ONE_ID_ONE_WHOLE_PERSON_8_27_26.md  Gate: talking_portrait_gate.js
- EVERY CHARACTER FACE COMES WITH A THUMB (Paolo 8/28, LOCKED): "from now on all the
  character face shit is always gonna have to come with a ... thumbs up or a thumbs down
  bro like you can't be doing shit without ... my thumb ... IF IT'S A VISUAL. and a lot of
  them I'm gonna be thumbing down so you gotta do better." *** THIS AMENDS EVERYTHING IS A
  THUMB (8/9) FOR ONE LANE AND NO MORE, AND NEWEST DATE WINS ON EXACTLY THAT MUCH. *** 8/9
  flipped the default to correct-after because we had turned him into an approvals queue,
  and it is still right: NOTHING BLOCKS ON HIM, the work ships the turn it is done, no
  numbered verdict queue in a reply, no waiting. What changed is narrower and it is a real
  gap he caught: on this lane a visual had been shipping with NO WAY TO SAY YES OR NO TO IT
  AT ALL. THE VOTE TAB HAS EXISTED SINCE 8/7 AND HAD NEVER HELD A SINGLE FACE -- it read
  one bank, the district map icons -- so every haircut, every portrait and the whole face
  maker went out with nothing to tap. HE DID NOT ASK FOR THE THUMB BACK; THE THUMB WAS
  NEVER THERE. Same failure as the seventeen invisible hats and the colours nobody wore:
  the material existed and never reached him. ONE SURFACE, NOT TWO (he never digs): the
  faces sit in the VOTE tab above the icons, same grid, same three-state tap (up / could be
  better / down / clear), same per-item note, same batch comment, same SUN MODE, same .txt
  export, same @VERDICT grammar. A HAIRCUT IS FOUR PICTURES, NOT ONE -- every haircut cell
  is a strip (front, three-quarter, side, back) one per row at a size BIGGER than the game
  draws it, because judging art below the size it ships at is judging a thumbnail, and a
  front-only cell asks him to thumb a third of the thing. The queue is DERIVED, never
  typed. *** AND THE PAGE HAD NEVER SAVED ANYTHING: three weeks of `var V={}` in memory, so
  thumbing forty haircuts and tapping away lost all of it. A VERDICT THAT EVAPORATES IS NOT
  A VERDICT, and the second time it happens he stops trusting the surface, which is the one
  thing a judging surface cannot afford. Found by a gate that tried to prove the vote was
  written down and could not. *** Gate lesson: that same gate's first persistence probe
  tapped FOUR times -- up, could-be-better, down, back to nothing -- and then asked whether
  the store held a verdict, so it was reading an ERASED vote and reporting the feature
  broken while the feature worked. Ninth broken ruler this week, same shape as all of them.
  Tab: VOTE. Bake with tools/bohemia_face_candidates.js then tools/bohemia_vote_tab.py.
  Full law: laws/BOHEMIA_LAW_EVERY_FACE_COMES_WITH_A_THUMB_8_28_26.md
  Gate: face_thumb_gate.js
- A HAIRCUT READS FROM EVERY ANGLE OR IT IS NOT A HAIRCUT (Paolo 8/28, LOCKED): "Cool I
  like it, but it's tough to analyze without implementing all the new hairstyles and shit."
  The portrait could draw 92 haircuts and THE CITY OWNED FIFTEEN. *** FIRST, EVERY DEAD
  SLOT WAS CHECKED AND NOT ONE WAS REVIVED, AND THE TRAP IS WORTH THE WORDS: the graveyard's
  WAVE 2 block says in plain text "SIDE PART, LIBERTY SPIKES, PONYTAIL and TOP KNOT are
  canon now" and quotes his "the cornrows is so much better very good". Read alone that
  says FIVE APPROVED HAIRCUTS HAVE BEEN SITTING SWITCHED OFF -- the invisible-hats shape,
  and what I expected to find. READ TO THE END OF THE FILE IT DOES NOT: wave 3, one day
  later, killed all five, most for the second or third time. NEWEST DATE WINS + GRAVEYARD
  IS FINAL. A CONFIDENT YES IS AS EXPENSIVE AS A CONFIDENT NO -- yesterday's law says say
  where you looked; this is the same rule with the sign flipped: READ TO THE END OF THE
  RECORD BEFORE YOU ACT ON THE MIDDLE OF IT. *** 23 COOKED, NINE SHIPPED, FOURTEEN CUT IN
  THE SAME TURN, which is the kill/approve pipeline working and not a failure of it: three
  CRESTS because head-on a crest is a HARD RECTANGLE (the taper lives inside
  `if(strip&&prof)` -- PROFILE ONLY, so the front has never had a shape) and that is the
  exact sentence MOHAWK died for; four TIED styles because a ponytail is drawn
  `if(tie==='pony'&&!front)` so the tail EXISTS FROM THE SIDE AND NOT HEAD-ON, measured at
  1.05 head-heights of change in one notch, which is clause 1 exactly; six more because
  their edges ran straight for 7-9 rows against a locked limit of 6. A COOK THAT FAILS A
  LAW IS NOT A COOK, IT IS A REGRESSION WITH NEW NAMES. *** THREE MECHANICAL CAUSES FOUND
  AND FIXED, AND THEY IMPROVED THE WHOLE GAME INCLUDING THE FIFTEEN THAT WERE ALREADY IN
  (straight runs 19.5% -> 17.2%, pin tightened): the loc parting ran DEAD STRAIGHT and read
  as a barcode, and the first drift stepped every TWO CELLS which at 112 is FOUR PIXEL ROWS
  -- exactly the length the law calls a straight run, so A JITTER WHOSE STEP EQUALS THE
  THING YOU ARE HIDING FROM HIDES NOTHING; a braid was `(_ph%3===2)&&(_pq%3===2)`, a GRID
  OF HOLES that rendered as a punched card, and the first fix SEVERED THE ROPE; and a long
  fall hangs off ONE FIXED SPAN so its edge only moved when a three-way hash happened to
  change -- it ALTERNATES now, so it is guaranteed to move every cell. Plus the strand pass
  runs on textured styles: their marks are at his 2:1 ratio but that ratio counts CELLS, so
  every mark was two pixels and 8/25 clause 2 asks for ONE. Result: 15 -> 24 canon cuts,
  the first TEXTURED haircuts the game has ever had, 56 -> 92 drawable in the portrait.
  *** AND FOUR MORE BROKEN RULERS, FIFTH THROUGH EIGHTH THIS WEEK: hairline_gate counted
  PAINT not MASS (a loc is separate ropes ON PURPOSE) -- fixed by CLOSING the mask one
  pixel, which is NOT an exemption for textured styles, it is the same question asked of
  the silhouette; its neck check could not tell a WAIST from a TAIL and flagged a ponytail
  for being narrow; its piece cap was a COUNT on a list that is supposed to grow, so it
  went red at 35 styles on a build whose RATE had improved; and craft_law clause 4 was
  pinning CHARACTERS directly under its own comment saying twice PIN THE BEHAVIOUR NOT THE
  CHARACTERS -- fourth time that gate has done it to itself. THE RULE: A HAIRCUT IS NOT
  DONE UNTIL IT READS FROM ALL EIGHT DIRECTIONS. Cook it, render every facing, LOOK.
  ~~The crest and the tie are unfinished mechanisms and are NAMED ROWS.~~ CORRECTED 8/30 --
  see the next bullet: they are not unfinished, THEY ARE DEAD, and that sentence is what
  invited seven remakes.
  Tab: CHARACTER / RUN / LOOK. Full law:
  laws/BOHEMIA_LAW_A_HAIRCUT_READS_FROM_EVERY_ANGLE_8_28_26.md  Gates: hair_gate.js,
  hairline_gate.js, portrait_haircut_gate.js, craft_law_gate.js
- A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME (8/30/26): GRAVEYARD IS FINAL has been law
  since July, the registry is 1,300 lines of his own words, and NOTHING HAS EVER READ IT --
  six weeks of an unenforced law, and this one was not even in the 7/16 sweep because it had
  no gate to be broken. *** WHAT IT COST: he asked for more haircuts, SEVEN WERE COOKED IN ONE
  TURN AND ALL SEVEN WERE REMAKES OF SHAPES HE HAS KILLED TWICE. Three crests = MOHAWK,
  LIBERTY SPIKES, HIGH TOP ("it's like a rectangle on someone's head", third strike). Two
  tails = PONYTAIL, BRAIDED TAIL ("looks like dog shit"). A knot = TOP KNOT. A bun = LOW BUN.
  Half a turn went into rebuilding the crest and the tie so they would read from every angle
  -- THREE separate attempts at the crest in profile -- and the answer was one grep away in a
  file written for exactly this. *** THE NAMES WERE NEW AND THE SHAPES WERE NOT, which is why
  a name check would have passed all seven and taught the next session the registry had been
  consulted: A NAME IS THE ONE THING A FRESH COOK ALWAYS CHANGES. IN THIS GENERATOR A SHAPE IS
  A DIAL -- `strip` is the crest, `tie` is the tied mass, nothing canon uses either, and every
  shape they have ever produced is a standing tombstone. So the gate reads the DIALS and cites
  the registry lines it rests on, and its own first ruler broke the same way everything has
  this month: it tested for the WORDING "permanent" and went red on BRAIDED TAIL (dead 8/1), whose first
  kill named no defect so nobody ever wrote that word beside it -- THE FILE ALREADY HAD A REAL
  CONVENTION (a reopened entry is COMMENTED OUT) AND I INVENTED A DIFFERENT ONE. Reopening is
  HIS: a dated ruling newer than 8/2/26, written into the gate's REBASELINE. AND THE LESSON
  THAT GENERALISES BEYOND HAIR: WHEN YOU WRITE DOWN THAT SOMETHING IS UNFINISHED, CHECK FIRST
  WHETHER IT IS DEAD -- from inside the code the two look identical, in the record they are
  opposites, and "unfinished" reads as an invitation. BEFORE COOKING ANY ART, READ THE
  GRAVEYARD FOR THAT LANE: not the summary bullets, the registry. Nothing shipped to the
  wardrobe; the valley still wears the same 24 haircuts and no approved pixel moved.
  Tab: CHARACTER / VOTE / RUN. Full law:
  laws/BOHEMIA_LAW_A_DEAD_SHAPE_DOES_NOT_COME_BACK_UNDER_A_NEW_NAME_8_30_26.md
  Gate: hair_graveyard_gate.js
- THE PORTRAIT WEARS THE HAIRCUT THE BODY IS WEARING (8/28, finishing his 8/26 "eye colors
  matching the portrait again"): ONE ID ONE WHOLE PERSON fixed skin, hair COLOUR and eyes on
  8/27 and its record says "same person on both sides now, every time". THE HAIRCUT ITSELF
  WAS NEVER CHECKED and it is the largest shape on a head. MEASURED over 200 citizens: the
  body wore 16 distinct haircuts, the portrait could draw SIX, five of the seven style names
  it could hold drew IDENTICAL PIXELS, and agreement was 24.7% -- WORSE THAN THE 33% A COIN
  GIVES over three bands, because two independent hashes are not merely unrelated, they can
  land ANTI-CORRELATED. *** THE CAUSE WAS A SENTENCE I WROTE THAT WAS FALSE WHEN I WROTE IT:
  "the BODY has no notion of a hairstyle -- NPCFactory picks a painted hair LAYER". True of
  NPCFactory. But BOH_PERSONLOOK.lookFor, which actually dresses the crowd and which faceFor
  WAS ALREADY CALLING FOR THEIR CLOTHES, hands back worn.hair, one of the fifteen canon cuts,
  set for 93% of the valley. I CHECKED ONE OF THE TWO THINGS THAT DRESS A PERSON AND WROTE
  DOWN THAT THERE WASN'T ONE. A confident negative is the most expensive kind of wrong,
  because nobody re-opens it; WHEN YOU WRITE DOWN THAT SOMETHING DOES NOT EXIST, SAY WHERE
  YOU LOOKED. *** The portrait reads the SAME five dials the body does -- side, front, vol,
  flare, tex -- out of the genHair call itself, NOT a second table, because a second table
  is how they drifted apart (ENGINE SYNC). Looking caught two things measuring did not:
  `front` was worth THREE PIXELS because I ran it down the FACE when the body runs it down
  the SKULL (13px after), and moving the crown's outer corners with the hairline opened a
  six-row stripe of bare scalp -- the mass let go of itself, the same failure as the body's
  fall at the jaw one day earlier. Result: agreement 88.2%, correlation 0.924, 6 -> 56
  drawable haircuts. THE APPROVED PLAYER FACE IS BYTE-IDENTICAL (hash c9856a89, checked
  against origin/main, and the gate hashes it every run). Gate lesson: the report behind it
  compared sp.hair.len, a STRING the fix had just made dead, and reported nothing had
  changed -- THIRD BROKEN RULER IN A WEEK, so the gate reads RENDERED PIXELS and never a
  spec field. Tab: RUN (talk to anybody) / CHARACTER / LOOK. Full law:
  laws/BOHEMIA_LAW_THE_PORTRAIT_WEARS_YOUR_HAIRCUT_8_28_26.md  Gate: portrait_haircut_gate.js
- THE CUT ASKS WHO YOU BECAME (8/30/26, finishing his 8/25 dispatch item 10): the face maker
  shipped on 8/28 and A PLAYER COULD NOT REACH IT. It went into the CHARACTER tab, which is a
  DEV tab, and tools/bohemia_cut_the_demo.js strips all seventeen of them out of the demo --
  so the panel sits in the demo FILE (id="p-char" is right there) with no tab, no button and
  NO ROUTE. Measured: 2 tabs a player can see, 0 ways to open it. THIRD TIME THIS MONTH after
  the seventeen invisible hats and the four bright garments nobody wore -- THE MATERIAL
  EXISTED AND NEVER REACHED THE PLAYER. *** WHERE IT GOES IS HIS AND HE WROTE IT IN JULY. ***
  The 7/19 locked opening turns on a match-cut: "the SAME table, ~10 years later ... YOU ARE
  20-SOMETHING." You are a child before the cut and an adult after it, and THE ONE THING THE
  CUT CANNOT SHOW IS WHAT TEN YEARS DID TO YOU -- which is exactly what a character creator
  asks. So the scene HOLDS on the first frame of the adult and asks it. Not a menu bolted to
  the front of the game: the beat the opening already needed. Researched first (diegetic
  creation is the standing answer where immersion matters -- Outer Worlds' cryo-manifest,
  Shadows Over Loathing's mirror) and the moment is DATA: a `become` flag on whatever beat
  carries it, never an id and never an index, so he moves it in DIRECT with no code change.
  ONE SET OF CONTROLS: faceControlsUI is the workbench's own body minus the calibration pad
  and the EXPORT button, because a second face editor is how the portrait and the body became
  different people on 8/27. *** AND A FACE THAT FORGETS IS NOT A FACE: pface lived in memory
  only, fine on a bench Paolo keeps open, fatal the moment a PLAYER meets a creator that only
  asks ONCE -- build a head, lock the phone, come back, and you are Punk with no way back. It
  saves now, merging onto PUNK so an old save cannot render a head with a hole in it, and
  failing safe to the approved face on a private window or a corrupt blob. ***
  THREE LESSONS THAT GENERALISE: (1) ANYTHING A PATCH TOOL OWNS MUST BE EDITED AT ITS SOURCE
  -- hold()/resume() were written into the alpha and bohemia_cutscene_tab_patch.py, which
  inlines engine/bohemia_story_surface.js verbatim, WIPED THEM, silently and flatteringly,
  with the scene playing on behind the creator and every other check green. (2) THE SCENE THE
  GAME OPENS WITH HAS THREE COPIES AND ONLY ONE IS PLAYED (the record; `var BOHEMIA_COLD_OPEN`,
  read by coldopen_gate ONLY; and the inlined BOHEMIA_CUTSCENES, the only one openScene reads)
  -- I hand-edited the middle one and every report said success while the game did not change
  by one pixel. A DUPLICATE NOTHING READS IS WHERE YOUR FIX GOES TO DIE. (3) A GUARD BELONGS
  INSIDE THE THING IT GUARDS. Plus: the first screenshot came back BLACK while every probe
  said success, because the probe hid the splash with display:none, which leaves #app
  display:none -- TAP THE SPLASH THE WAY A FINGER TAPS IT.
  Tab: RUN (the opening) / CHARACTER (same controls on the bench) / DIRECT (move the moment).
  Full law: laws/BOHEMIA_LAW_THE_CUT_ASKS_WHO_YOU_BECAME_8_30_26.md
  Gate: become_gate.js -- it drives the DEMO, because the workshop was never the problem.
- HE CAN BUILD HIS OWN FACE (Paolo 8/25, THE PLAYTEST DISPATCH item 10: "FACE CUSTOMISATION,
  never built, is on the board"; built 8/28): there WAS a thing called a face editor -- five
  swatch rows and a nudge pad -- and NOT ONE CONTROL TOUCHED THE SHAPE OF THE HEAD. At 64
  pixels IDENTITY IS SIZE AND SPACING, NOT DETAIL (8/27), so the thing called a face editor
  could not change a face, only what colour that one face was. AND EVERYTHING IT NEEDED
  ALREADY EXISTED AND NONE OF IT WAS REACHABLE: faceFor has rolled a full grounded shape
  vocabulary for every stranger since 8/27, so THE PLAYER WAS THE ONE PERSON IN BOHEMIA WHO
  COULD NOT HAVE A DIFFERENT HEAD. HE MUST BE ABLE TO DIRECT IT (8/12) -- the test is WHERE
  DOES HE CHANGE THIS HIMSELF, and until today the answer was "he tells me and I edit a
  file", which is not shipped. NOW: 14 shape sliders, all fifteen of the body's haircuts,
  four hair textures, ROLL A FACE (faceFor itself, so it cannot make anything the game could
  not already make), BACK TO PUNK (restores the approved face and KEEPS the colours he
  picked), and EXPORT. THE ANATOMY IS MINE, THE FACE IS HIS: every slider re-clamps against
  the rules faceFor obeys -- cheeks widest, jaw inside them, chin inside the jaw, features in
  order, row positions stored as a FRACTION of the face so lengthening the head moves the
  eyes with it. HE CANNOT BUILD A HEAD THAT IS NOT A HEAD, and nothing is rejected -- the
  neighbour gives way, so a slider always does something. Gate lesson: its own first harness
  swept the sliders without resetting and reported a LIVE dial dead, because an earlier
  slider had already pushed it to its ceiling through the clamp -- A HARNESS WITH STATE IN IT
  MEASURES THE STATE, fourth broken ruler in a week and the fourth flattering-shaped one.
  Tab: CHARACTER (tap your portrait). Full law:
  laws/BOHEMIA_LAW_HE_CAN_BUILD_HIS_OWN_FACE_8_28_26.md  Gate: face_maker_gate.js
- THE HAIRLINE IN PROFILE, AND HAIR IS ONE PIECE (Paolo 8/27, LOCKED): "U HAVE TO FIX THE
  FOREHEAD SHIT YOU GOT THE FOREHEAD ALL WRONG EAST AND WEST ... YOU HAVE THE HAIR BALDING
  BACK FURTHER THAN IT SHOULD BE. AND MOST HAIRS EAST AND WEST ARE JUST LIKE A SINGLE LINE
  GOING DOWN. AND THE VERY LONG PAST SHOULDER LENGTH HAIRS LIKE THEY BREAK IN THE MIDDLE OF
  THE HAIR. AFTER THE HEAD THERES NOTHING UNTIL THE SHOULDERS." *** READ THIS PART FIRST:
  EVERY NUMBER I HAD SAID HE WAS WRONG. A measurement pass over all fifteen canon styles,
  written before touching anything, reported zero bare forehead, an 11px median row and one
  break in forty-five. All three were asking a question that was NEARLY right -- the
  forehead check walked only the two rows ABOVE the face part when the bald patch is BESIDE
  it, the width took a BOUNDING BOX so a row with a hole in it measured eleven, and the
  break test called a row unbroken if ANY pixel on it was hair when the break is
  HORIZONTAL. SECOND TIME IN THREE DAYS (8/25's edge-parity audit read 50.9% "already
  native" over nine solid blocks), so it is a rule: WHEN A NUMBER DISAGREES WITH HIM ABOUT
  A PICTURE, GO AND LOOK AT THE PICTURE, AND THEN FIX THE RULER. What found all four was
  rendering every style in every direction and LOOKING, which his own 8/25 dispatch (item 3)
  had already ordered. *** FOUR COMPLAINTS, THREE CAUSES, AND TWO OF THE FOUR ARE ONE LINE:
  side-on the head is 16-18px across and ONLY THE BACK 4-6 ARE THE SKULL PART -- forehead,
  temple, ear, cheek and jaw are all painted FACE, and put() refuses hair on a face pixel
  unless you are looking at the back of the head. So hair got the top fifth plus a
  four-pixel strip: "balding back" AND "a single line going down", one bug. THE 8/2 FIX
  ALREADY KNEW THIS AND DID HALF OF IT (it taught sideBot how far DOWN, never put() how far
  ACROSS). Now hair paints the face part behind A REAL HAIRLINE -- forehead, temple, then
  back over the ear -- driven by the style's own `front` dial, so the dial that meant "how
  far down the forehead" also means "how far forward at the temple", ONE haircut from every
  angle (8/25 clause 1). The first cut of the recede keyed off the LENGTH dial and turned
  BUZZ CUT back into a four-pixel strip, killed by LOOKING: `side:0.30` says the hair does
  not HANG below a third of the head, not that the scalp stops there. I HAD REACHED FOR THE
  NEAREST DIAL INSTEAD OF ASKING WHAT THE DIAL MEANT. *** AND THE BREAK WAS A LOOP WITH TWO
  BOUNDS AND ONLY ONE OF THEM MOVED. An earlier fix widened `fs` to the whole head at the
  jaw and left `mn`/`mx` tracking the CHIN, so the left loop started right of its stop and
  the right loop stopped left of its start and BOTH RAN ZERO TIMES: LONG LOOSE facing S drew
  hair on rows 16-29, NOTHING on 30-31, and picked up again at 32. His sentence as a pair of
  numbers. Third cause: the nape taper drew on EVERY back view however long the style was,
  pinching the mass to a point at the jaw and flaring out under it -- a WAIST in the middle
  of the hair. A nape is where hair ENDS. *** THE LESSON: TWO OF THE THREE WERE
  HALF-FINISHED FIXES THAT LEFT A CORRECT COMMENT STANDING OVER INCORRECT CODE, and both
  would survive any review that reads the comment and believes it. Balding styles 11 of 15
  -> 0; loose pieces 6 -> 0; neck chokes 8 -> 0; not one haircut deleted or shortened, which
  the gate checks separately because a haircut that is whole BECAUSE IT STOPPED AT THE JAW
  passes every other test. The 56 pin moved 220 of 1744 hashes, ALL genHair -- it exists so
  4x work cannot disturb approved art and was never meant to outrank him, and
  gates/clothes_56_pin.txt now carries a REBASELINE LOG saying who ruled and what changed.
  Tab: CHARACTER (try them on) / RUN (the crowd) / LOOK (the reference sheet). Full law:
  laws/BOHEMIA_LAW_THE_HAIRLINE_IN_PROFILE_8_27_26.md  Gate: hairline_gate.js
- STRUCTURE-NOT-COLOR (7/19): clothing colorways are legal but NEVER progress.
  Progress = new garment SHAPES (new geometry/silhouette/category), machine-
  locked by structure_gate.js. A recolor is filler, never the headline.
- STREETS ARE THE HARMONIZED POOL (Paolo 7/31, LOCKED): ANY street graphics
  work by ANY session — roadway, sidewalk, markings, medians, crossings,
  parking stalls, street margins — starts by reading records/BOHEMIA_WHERE_
  THE_GOOD_STREET_PIXELS_ARE_7_31_26.md and sources from banks/BOHEMIA_
  STREET_POOLS_HARMONIZED_7_14_26.txt, EVERY TIME. Hand-painting a
  substitute for anything the bank holds is a shopping-law violation. The
  bank's embedded 7/14 rulings (30yr marking wash, weather rarity, desert
  dominance, parking geometry) travel with the tiles. Full law:
  laws/BOHEMIA_ADDENDUM_STREETS_ARE_THE_HARMONIZED_POOL_7_31_26.md
- REUSE-FIRST (Paolo 7/22, LOCKED, "check out the approved assets first
  before cooking"): before any tool cooks NEW graphic pixels, it documents
  a `REUSE CHECK:` in its module docstring - what banks/ it looked at, and
  what it used or why nothing fit. A claimed reuse must actually open that
  bank in code, not just say so. Gate: reusefirst_gate.py sweeps every
  tools/*_factory.py and *_cook*.py file. Full law in /laws.
- QUEST STUDY LAW (Paolo 7/26, LOCKED, "we dug data and we collected a total of
  150 quest and shit like did you give a fuck about any of that?"): the questbook
  is 240 files and 152 quests studied to the bone (3,672 citable findings across
  the CRAFT/FLAWS/PORTS/CONVERSATIONS masters). It was being ignored in favor of
  the summary bullets in this file, and nothing in the machine cared. NOW: every
  canon .bq quest must CITE the corpus laws it is built on -- `# @STUDY Q021.W5
  TRIAGE AS THE CORE LOOP` plus an `applied:` line saying what was actually used.
  The id must resolve in records/BOHEMIA_QUESTBOOK_LAW_INDEX.json, the title must
  match the corpus VERBATIM, and a quest must span >=2 studies and >=2 masters.
  This is REUSE-FIRST for quests: a citation is a claim the machine can check,
  never a name-drop. Index: `python3 tools/bohemia_questbook_index.py`. Gate:
  quest_study_gate.js. Full law in /laws.
- WALKABLE-LAND LAW (Paolo 7/20, LOCKED, "this has to be a new rule"): a district
  is a FULL PLOT of walkable land; it CANNOT be mostly parking lot / driveway /
  apron with a tiny building stranded in it. BUILDINGS + PURPOSEFUL CONTENT must
  dominate the plot; pavement is connective tissue, never the main event. The
  self-storage (unit rows wall-to-wall) is the density reference; the fire-station
  v1 (8% building, 52% empty apron) was the failure that triggered the law. The
  DELIBERATE exception: VEHICULAR VENUES whose vehicle surface IS the venue
  (drive-in, gas/truck stop, parking structure) declare `vehicular:true` and are
  exempt from the pavement cap (but still must be dressed, never a void). Gate:
  walkable_gate.js sweeps every registered district (drivePct <= contentPct+margin,
  via K.landStats). SPIRIT the number can't fully catch — hold the render-and-look
  bar: a walkable district must read FINISHED and USED (dense buildings + purpose),
  not thin features stranded in empty lawn/pavement. Full law in /laws.
- LANDLOCKED DISTRICT LAW (Paolo 7/21, LOCKED): a cell with no real street touching it
  can ONLY be suburb/gated/estate/apartment or bare desert — never
  commercial/industrial/park/trailer/storage. A landlocked suburb/apt cell must gain
  street access by relaying through a same-family neighbor's road, all the way out to
  a real street ("the two districts' street touch"). Enforced for seed generation:
  bohemia_overmap.js's proceduralDistrict (type half) + bohemia_world.js's
  rawStreetEdges/buildLandlockConnect BFS (connectivity half, generalizes to any
  same-type blob — downtown, farm, not just suburb) + bohemia_overmap.js's LANDMARK
  ACCESS SPUR post-pass (carves a desert-only driveway to the nearest street for
  isolated cells the relay can't reach, never touches built content). Separately
  (cosmetic, not mandatory): a 25%-per-edge COSMETIC CONNECT knob links some
  adjacent street-touching suburb pairs with a real through-connector, most stay
  walled — real Sun Belt subdivision privacy, from the 7/21 Vegas-urbanism
  research. Gate: landlocked_gate.js. Full
  law + the known small residual (isolated single-cell landmarks) in /laws.
- HOW HAIR AND SHAPE WORK (Paolo 8/1/26, LOCKED): he asked for his craft feedback
  to go "into your own training data". It cannot -- nothing from a session reaches
  the weights. laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md IS that memory:
  the back is not the front; cover the headspace; no straight lines (hair is little
  off shapes); ONE PIXEL not three at 56px; centre what should be central (Math.round
  breaks .5 upward and puts it one pixel right, forever); a fade must blend into skin
  tone (BUILT 8/1/26 -- a DENSITY RAMP in the same texSkip that draws a cornrow,
  capped so it never becomes plain skin; this line read [UNBUILT] until 8/20 and was
  STALE, which is the class of rot the truth hierarchy exists to kill);
  long hair shows from the front. Plus the process lessons that day:
  A GATE MUST NEVER OUTRANK A RULING, a checker that cannot tell a mention from a use
  is the broken one, fix the ruler never the target, and do not claim things about
  the codebase without checking. Gate: craft_law_gate.js.
- HAIR AT FOUR TIMES THE PIXELS (Paolo 8/25/26, LOCKED): "we made the character model
  4x and i feel like with especially the hair your still playing with the orignal
  pixels. not the pixels that are now 1 pixel because we made the canvas 4x bigger."
  Same message CLEARED the E/W profile hold ("the side view is a lot better") and
  opened this. CLAUSE 1: a haircut is ONE haircut from every angle -- turning the head
  may change appearance, never IDENTITY. CLAUSE 2: draw in the pixels we actually have
  -- every canon style carries at least one ONE-PIXEL mark INSIDE its own silhouette.
  MEASURED THE DAY HE SAID IT: 9 of 15 styles had none at all, solid blocks with a
  shaded rim and nothing in them. *** AND A NUMBER SAID HE WAS WRONG FIRST: an
  edge-parity audit read 50.9% and meant "already native", because it was measuring
  the OUTLINE. THE SHAPE IS THE INSIDE. When a metric disagrees with him about his own
  art, SUSPECT THE METRIC. *** Not a licence for noise -- 8/1 clause 3 still governs,
  little off shapes, never straight lines, deterministic so an NPC does not shimmer
  (the first cut drew a ruled bar down the crown and only LOOKING caught it). Never
  thin a mark he ruled on; ADD marks the finer grid can hold. That method is HIS,
  approved four-for-four on the fine-detail passes 8/25. Full law:
  laws/BOHEMIA_LAW_HAIR_AT_FOUR_TIMES_THE_PIXELS_8_25_26.md  Gate: hair_gate.js
- THE BORDER IS ONE PIXEL WHERE HE SEES IT (Paolo 8/14 + 8/15, LOCKED): "the black
  border has to be thinner, like half as thin". CHAR_OUTLINE always drew ONE pixel
  and was always correct -- it just ran BEFORE the Scale2x that takes the frame to
  112, so his border arrived DOUBLED. A pass can be individually right and still be
  wrong because of WHERE IT SITS IN THE PIPELINE, and no amount of reading the pass
  finds that; only measuring the pixels he receives does (VERIFY ON THE REAL
  SURFACE). The border pass is now the LAST thing before display, at display size,
  on EVERY path that draws a character (drawChar AND bake112 -- fixing one alone
  outlines him 1px in CHARACTER and 2px in COMBAT). Measured 2px -> 1px, all 8
  facings, with 0 of ~18,000 non-border pixels changed. Full law:
  laws/BOHEMIA_ADDENDUM_THE_BORDER_IS_ONE_PIXEL_8_16_26.md  Gate: border_gate.js
  THE OTHER HALF OF THAT RULING ("twice as many pixels") IS NOT SHIPPED AND IS NOT
  A CODE PROBLEM: the 112 pipeline is built, proved seam-by-seam and dormant at
  RIG_RS=1, but his art holds 56x56 of information and composing natively removes
  the corner-rounding Scale2x was silently doing -- the head renders as a BOX,
  straight into the 8/1 "no straight lines" law. Twice the pixels means PAINTING at
  112. Full finding: records/BOHEMIA_2X_WHY_THE_RIG_STAYS_AT_56_8_16_26.txt
- NO DAMAGE BEFORE THE DIAL. EVER.

## LORE YAP SESSIONS (no code involved — a first-class session type)
Paolo will open sessions purely to talk: lore, laws, the world, the three arcs.
Engage fully as a conversation. Your job in these: PULL HOLES. Gut-punch
questions that could break the lore are how it gets airtight — test his ideas
against the full canon (cite the actual addendum, newest-date-wins) and against
real science, economics, human behavior, and history, because everything in
Bohemia must be grounded in the real. Never add lore he did not confirm. Every
design decision carries a life lesson underneath without the game preaching it.
The moment something LOCKS mid-conversation, write the addendum and commit it
the same turn, then keep talking. One bold question max, always.

## VERDICT WORKFLOW
- *** EVERYTHING IS A THUMB (Paolo 8/9/26, LOCKED, and it AMENDS everything
  below): "Thumb thumb thumb everything is a thumb." We turned him into an
  approvals queue. THE DEFAULT FLIPS FROM APPROVE-BEFORE TO CORRECT-AFTER:
  Claude DECIDES, builds it, and puts it in the game where he meets it while
  playing; he corrects what he hates. Only three things still go to him —
  IDENTITY/NAMES he reserved, a genuine fork with no defensible default (pick
  one, say why, build it), and anything he asked to see. BANNED: a numbered
  queue of pending verdicts in a reply, asking him HOW to do the work, and
  blocking on a thumb. The judge pages stay and stay good, but they are a thing
  he MAY open, never a gate the work waits behind. The bar goes UP, not down:
  whatever you decide is what he plays. Full law:
  laws/BOHEMIA_ADDENDUM_EVERYTHING_IS_A_THUMB_8_9_26.md ***
Paolo judges art via interactive HTML tools (tap thumbs, per-item comments,
comment section at the bottom always, SUN MODE daylight-readable, export button,
exports as .txt never .json). Verdicts land as .txt repo files in /records the
same turn. Approval unlocks volume (variants). Rejects go to the graveyard with
post-mortems. Continuous cooking: big batches, machine gates, surface judgment
rarely as one mega-session.
- NOTES ARE RULINGS (7/19): if Paolo SAID he likes it, that IS the verdict —
  build it into the real thing the same turn, never ask him to re-confirm or
  re-thumb his own words. Thumbs are for fresh unseen candidates only.
  (laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md)

## SHIP FLOW (Paolo 7/17/26, standing law; AMENDED 7/25/26)
- A finished update MERGES TO MAIN THE SAME TURN, by Claude, without asking.
  Paolo never clicks merge buttons.
- NO PULL REQUESTS. EVER. (Paolo 7/25/26, LOCKED, amends the 7/17 "PRs exist
  for the record only" clause, which is now DEAD.) He opened #10 off a session
  badge and landed on a week-old merged ragdoll PR: "it's so annoying." The
  session branch name is REUSED across sessions, so every PR ever opened on it
  stays badged to every future session on that name -- the badge is always
  stale and always points at somebody else's old work. The commit message and
  the records/ file ARE the record; a PR adds nothing and costs him a wrong
  turn every time he taps it. Commit straight to main. Never call
  create_pull_request. (GitHub cannot delete the old ones -- they are permanent
  history. Nothing to clean up; just stop making them.)
- ONE GATE PASS PER SHIP (Paolo 7/25/26: "it seems like it takes double the
  amount of time fr" -- he was right, and it was self-inflicted). The old flow
  ran the full ~95s suite, THEN cherry-picked onto a fresh origin/main, THEN
  ran the whole suite again, plus three pushes. That is double the wall clock
  for one ship. THE FLOW:
    1. `git fetch origin main` and branch from it BEFORE starting work.
    2. Do the work. Run the full suite ONCE, at the end.
    3. `git fetch origin main` again. If main has NOT moved, push straight to
       main -- the gates you already ran are still valid, do not re-run them.
    4. ONLY if main moved: rebase onto it and re-run the suite (that second run
       is now earning its keep -- it is verifying a real merge, not re-verifying
       your own unchanged tree).
    5. Push the same SHA to the session branch. One gate pass, one deploy.
- WHAT PAGES PUBLISHES IS NOT THE WHOLE REPO (8/6/26). Pages failed THREE commits
  in a row -- thirty minutes then timeout -- because the build was copying all
  496 MB when the product is the 106 MB in slices/. `_config.yml` now publishes
  slices/ + engine/ + records/target (the only folders a slice actually loads from)
  and NOTHING is deleted. If a new slice ever loads from another folder, add that
  folder to _config.yml or the page 404s in production while working on disk.
  Gate: pages_publish_gate.js. The push working is NOT the site working -- that is
  the whole reason this was invisible for three commits.
- Every turn that ships to main ends with the play link as the LAST LINE of
  the reply, always: https://paolosarn.github.io/bohemia/slices/BOHEMIA_ALPHA_0_9.html
  (GitHub Pages auto-redeploys main in ~2 minutes; the link never changes.)
- BUILD STAMP + DEPLOY VERIFY (7/20, after "I didn't see nothing new" twice):
  (1) every ship UPDATES #buildstamp in the alpha's front splash (date-letter +
  the headline, e.g. "BUILD 7/20a · SHUFFLE ANIMS") so Paolo can SEE which
  build he is on; the gate checks the stamp exists. (2) pushing main is NOT
  shipped: parallel-session push storms make GitHub Pages CANCEL in-flight
  builds, so the live site can lag many pushes behind.
  AMENDED 8/6/26 -- THE CANCELLING IS FIXED AND THE WORKFLOW TO WATCH HAS CHANGED.
  Measured 8/6: the lanes push to main about every THIRTEEN MINUTES and a build
  takes longer than that, so under GitHub's built-in builder a build could NEVER
  finish -- five in a row cancelled, over an hour, zero successes. That is not a
  delay to wait out, it is a deadlock. .github/workflows/pages.yml now deploys
  with `cancel-in-progress: false`, so a second push QUEUES behind the running
  deploy instead of killing it. Nothing about how anybody pushes had to change.
  SO: after pushing, check the **`pages`** workflow (GitHub MCP actions_list,
  resource_id 'pages.yml') until a run whose sha CONTAINS your content concludes
  SUCCESS -- only then is the link true. Do NOT read "pages build and deployment"
  any more; it still fires and still fails and it is now NOISE, not a symptom.
  Confirm containment with `git merge-base --is-ancestor <your-sha> <deployed-sha>`
  rather than eyeballing it -- a later sha usually carries your content, and that
  is the run that counts.
  And the site publishes slices/ + engine/ + records/target ONLY (_config.yml).
  Add a folder to the config AND the workflow's copy list together, or
  pages_publish_gate.js goes red -- it binds the two lists so neither can drift.

## THE PLAYTEST DISPATCH (Paolo 8/25/26, LOCKED — he played the run and
## filed ten things at once; second big dispatch after 7/29's BIG MISSING).
## THE FRAME IS THE IMPORTANT PART: "I KNOW WE MADE EVERYTHING REALISTIC AS
## FUCK... BUT I REALLY DO BELIEVE I MAY BE AT A TURNING POINT BECAUSE WE
## NEED TO MAKE THIS GAME FUCKING FUN." REALISM FIRST (8/4) always said
## realism is sacrificed only for fun and THE TRADE IS HIS. HE JUST MADE IT.
## From here FUN CARRIES THE TIE unless he says otherwise on a specific item.
## The ten: (1) the wall changed under him AND there is no wall-opacity
## system at all, though he thinks there is -- build the fade; (2) quests are
## not wired to places or people, and the ASCII "text-cam" feed art is DEAD;
## (3) HAIR GOES TO REFERENCE FIRST, all 8 directions, before another cook;
## (4) STREETS CONNECT LIKE LEGO -- every piece declares its edge connectors,
## art and path are ONE contract, machine-checked; (5) the city is dead and
## DEAD IS NOT THE DEFAULT (a slider is not an answer); (6) THE ACTION BUTTON
## IS NOT THE CITY BUTTON -- zoom is the way in and out; (7) performance;
## (8) ENEMIES, LOOT, and Valheim-style DANGER BY PLACE, with the bestiary
## research delivered same turn; (9) THE UI LANE EXISTS NOW (first word
## "ui") -- he crafts the Bohemia look WITH me; (10) animations get an audit
## and FACE CUSTOMISATION, never built, is on the board.
## Full law: laws/BOHEMIA_ADDENDUM_THE_PLAYTEST_DISPATCH_8_25_26.md
## Bestiary research: records/BOHEMIA_RESEARCH_WHAT_LIVES_IN_A_CITY_OF_CORPSES_8_25_26.md

## THE DEMO IS ITS OWN LINK (Paolo 8/25/26, LOCKED): "THE DEMO WILL BE A
## STANDALONE LINK THAT ISNT THIS WORKSHOP LINK... WE ARE NOT READY FOR THE
## DEMO YET." TWO SURFACES, and they are not the same thing. THE WORKSHOP is
## slices/BOHEMIA_ALPHA_0_9.html, seventeen tabs, HIS bench, governed by the
## ONE-LINK LAW below. THE DEMO is a SEPARATE PUBLISHED BUILD at a SEPARATE
## URL with ZERO dev tabs -- cut from the workshop, never forked (one engine,
## one canon). THE WORKSHOP LINK IS NEVER GIVEN TO A PLAYER: handing somebody
## the bench is handing them sixteen doors and asking them to guess. The
## coordinator planned three sweeps of a friends round around the workshop
## link; that was the error this law exists to kill. And "the demo plays"
## measured INSIDE the workshop is not the claim that a demo exists -- the
## 8/4 plan already said it, item 9: THE DEMO IS A BUILD, NOT A VIBE.
## Full law: laws/BOHEMIA_ADDENDUM_THE_DEMO_IS_ITS_OWN_LINK_8_25_26.md
## Gap list: records/BOHEMIA_WHAT_THE_DEMO_IS_STILL_MISSING_8_25_26.md
## Gate: demo_build_gate (routed SHARED -14)

## ONE-LINK LAW (Paolo 7/18/26, LOCKED — he was furious about "?v=arms")
- There is ONE universal alpha URL and it NEVER changes, for ANY session:
  https://paolosarn.github.io/bohemia/slices/BOHEMIA_ALPHA_0_9.html
- NEVER append a cache-buster query string (?v=..., ?t=..., anything). Paolo sees
  the URL. A changing URL reads as a different game and it enrages him. The plain
  canonical URL is the only thing that ever gets pasted, every turn, every session.
- Freshness is handled by the machine, not the URL: slices/sw.js is an always-fresh
  service worker (network-first, registered in the alpha head) so the plain link
  always serves the newest deploy. That is why the query string is not just banned
  but UNNEEDED. If a phone still shows stale once, the fix is ONE hard refresh to
  bootstrap the worker — never a new link.
- ONE ALPHA, ONE LINK: animation, city/streets, music, characters all live in (or
  are reached from) the single alpha file. No session ships its own separate link
  (no CURRENT_SLICE link, no per-feature page) as "the build." Parallel work folds
  into the alpha (e.g. the SLICE tab) — the surface Paolo taps is always the alpha.

## THE HANDOFF FILE
`00_START_HERE_NEXT_SESSION.md` at repo root: read it immediately after this
file, every session. It is the live state: where we are, what is in flight,
what is pending Paolo. There is only ever ONE, it always has this exact name so
it sorts first and can never be missed, and every working session REWRITES it
before ending. Old handoffs are not archived as separate files; git history is
the archive.

## TRUTH HIERARCHY (the answer to "addendum on top of addendum — will it know?")
Nothing knows automatically. Currency is BUILT, in this order:
1. **CLAUDE.md** — how to work (this file)
2. **BOHEMIA_GDD_v5 + the LAWS MASTERS + STATE_OF_PLAY** — consolidated current truth
3. **Addenda** — on ANY conflict, the NEWEST DATE WINS. The map is
   `BOHEMIA_CANON_INDEX` (regenerate with `python3 gates/bohemia_canon_index.py`
   the same turn any addendum lands). Consult it BEFORE citing an addendum.
4. **/archive** — superseded files (registry: bohemia_superseded.txt). History,
   never current. When an addendum overrides another, the old one moves to
   /archive THE SAME TURN, with a registry line saying what replaced it.
A contradiction between two live files is a BUG, not an interpretation choice:
fix it if mechanical, flag it [PENDING Paolo] if canon-level. The 7/16 graveyard
sweep found the laws master instructing a dead palette — that class of rot is
what this hierarchy exists to kill.
STANDING JOB: periodically fold addenda into the GDD/laws masters and archive
the folded (the GDD v5 consolidation pattern). Piles rot; masters stay clean.

## PARALLEL SESSIONS (one-alpha law, repo form — AMENDED by Paolo 7/19/26)
Every session BUILDS THE ALPHA. That is the point: different parts of the game,
one build, they mesh. The rule is ONE SYSTEM, ONE SESSION: no two sessions may
edit the SAME system at the same time (two sessions both editing clothing =
danger; wardrobe + LIFE + COMBAT in parallel = the design). Stay inside your
session's systems; a rebase conflict inside the alpha means a boundary was
crossed -- stop and check before pushing.

## THE COORDINATOR SESSION (Paolo 7/24/26, "master coordinator of all the
## sessions"): if Paolo tells a session "you are the coordinator" (or
## similar), that session is DIFFERENT from every lane above — it does not
## build the game. Read laws/BOHEMIA_SESSION_BRIEF_COORDINATOR_7_24_26.md
## FIRST, before anything else, and follow it exactly: read-only across every
## lane, plain-English status rollups, flags collisions the individual lanes
## can't see each other to catch, drafts (never sends) next-prompts on
## request. Never writes engine/tools/gates/slices code, never pushes to
## main. A trigger named "Bohemia Coordinator Check-In" exists (see
## `list_triggers`) that fires a fresh session into exactly this role on
## demand.

## WHAT'S PENDING PAOLO (never decide these yourself)
See laws/BOHEMIA_STATE_OF_PLAY and the shelf in records/. Flag anything needing
an unset direction as [PENDING, Paolo's call].

## STOP PRODUCING (Paolo 7/26/26, LOCKED — READ BEFORE THE GO PROCEDURE)
laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md. "This is all bad consider the
last 4 chats terrible... its all really bad." One session built the same unwanted
feature FOUR times in a day, all gates green every time, asking him to judge each
round, while a fleet-wide art freeze was on and he had already said he cannot
approve anything until the world looks consistent. THE LAW: a frozen lane
produces NOTHING (finding a legal way to ship anyway IS the violation); surface
NOTHING unasked while he is unhappy with the baseline; a second rejection ends
the feature for the session; green gates are never an argument and never lead a
reply; a turn that says "I stopped, here is the one thing blocking everything" is
a GOOD turn. THE TELL: writing a fourth version of anything means you already
failed - stop and say so instead of fixing the attempt.

## THE AUTONOMY DOCTRINE (Paolo 7/26/26, LOCKED — binds EVERY session)
Read laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md and follow it exactly. The
short form: the FIRST word of a new session names its lane (run/world/city/
combat/character/quests/art/lab/coordinator) and means GO; after that his entire
vocabulary is "go" / "verdicts in" / "status" —
any other word from him is a RULING to record, never a discussion to have.
On "go": run THE GO PROCEDURE (resume mid-flight work, else pop your lane's
top unblocked item from BOHEMIA_BACKLOG.md; [PENDING] blocks nothing; over
the verdict-queue cap you do only non-cook work). EVERY reply to Paolo ends
with: a 3-line plain-English TLDR (he does not read code), a numbered JUDGE
THIS list (side-by-side anchors, or "Nothing to judge"), any DID-NOT-DECIDE
pendings, and the proof line. Verdicts: APPROVE unlocks volume, CBB ships
frozen, KILL graveyards with post-mortem. STALE UNJUDGED IS DEAD (bulk
silence is a verdict — laws/BOHEMIA_ADDENDUM_UNJUDGED_IS_DEAD_7_26_26.md).
Forbidden shortcuts are pre-named in the doctrine; verification is never
self-attestation. He thumbs and he playtests; everything else is yours.

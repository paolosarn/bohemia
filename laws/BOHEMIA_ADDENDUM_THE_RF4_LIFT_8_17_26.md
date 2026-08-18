# BOHEMIA ADDENDUM — THE RF4 LIFT IS AUTHORISED (Paolo 8/17/26, LOCKED,
# direction-class: "I sucked all the strategy and all the tutorial and
# movement and combat shit from rogue four and it's here for you right
# now. I need you to implement this immediately. There's a couple things
# that might contradict with the combat of our game. At the end of the
# day we really need MORE MOVEMENT in the combat, THE WORLD HAS TO FEEL
# MORE ALIVE. You have to understand a lot of these mechanics and
# implement them between the chats. Most likely the combat chat.")

## 0. THE GATE HE BUILT IS NOW OPEN
records/rf4/BOHEMIA_RF4_DANGER_SCHOOL_MASTER.md — his own verbatim
capture of 83 RF4 tutorial screens — carries a LIFT NOTES section reading
"[EMPTY. Nothing lifted yet. Nothing enters this section without Paolo's
ruling.]" HE HAS NOW RULED: implement immediately. The lift is
authorised. Both his documents are in the repo so every lane can read
them (the synthesis PDF plus a text extraction beside it).
AND HIS RESEARCH REPLACES OURS. The 8/16 coordinator dossier listed five
gaps the network could not reach; his capture CLOSES most of them,
including the damage math (50-100% of listed value, so a 20-damage weapon
deals 10-20) and the SP economy. LAB does not need to go looking any
more — the corpus is closed by his own declaration, 8/17.

## 1. THE ONE SENTENCE, AND IT IS HIS DOCUMENT'S, NOT MINE
"Rogue Fable IV is not a damage game. It is a POSITION game with a damage
readout, and almost every system in it exists to make geometry more
powerful than statistics."
That is the lift. Not a feature list — a change of what combat is ABOUT.

## 2. THE FORKS ARE DECIDED. HE ASKED FOR IMPLEMENTATION, NOT A BALLOT
His synthesis marks seven [PENDING, Paolo's call] forks. Handing seven
questions back would be the approvals queue EVERYTHING IS A THUMB (8/9)
killed, and NEVER ASK HIM A TECHNICAL QUESTION (8/15) forbids it outright
where the repo or the laws already answer. So they are decided here,
correct-after, each with the reason it went that way:
1. **A FREE-MOVEMENT BUDGET (the SP equivalent): YES.** This is the
   single highest-value item in the whole corpus and it is the direct
   answer to his standing law THE FIGHT HAS TO MOVE YOU (8/15) and to
   today's "we really need more movement." Sprinting moves you WITHOUT
   ending your turn, so movement stops competing with acting.
2. **VISION GATES ENEMY SUPPORT BEHAVIOUR: YES.** One variable, five
   systems (see §4). Cheapest depth in the document, and we already have
   line of sight and cover.
3. **PUBLISHED DETERMINISTIC AI: YES — ALREADY OUR LAW.** The combat
   addendum locked determinism in June ("no random-per-frame jitter;
   patterns are deterministic and learnable"). This is not a fork, it is
   an extension of settled canon. Cost acknowledged, from his own
   document: determinism "buys depth on first contact and spends it over
   time," so new deterministic rules must keep arriving.
4. **A KILL CHANNEL THAT BYPASSES THE DAMAGE STAT: YES, ENVIRONMENTAL
   ONLY.** Pits, falls, hazards kill outright; no WEAPON ever does. NO
   DAMAGE BEFORE THE DIAL is untouched, because an environmental kill is
   not damage — it is a positional payoff on a separate channel. His
   document's argument is the deciding one: it keeps a bad-item run
   solvable, which is the property a roguelite cannot do without.
5. **THREE-LAYER AWARENESS (detection radius / awareness state / alert
   propagation): YES, PHASE TWO.** It is the other half of "the world
   has to feel more alive" — enemies with states BEFORE the fight — but
   it is a bigger system than 1 and 2, so it lands after them.
6. **TEACHING REGISTER POLICY (A/B/C by derivability): YES, FLEET-WIDE.**
   Tell them what they could not derive, hint at what they could, SHOW
   them what the room can demonstrate. "Never explain something the floor
   could have shown." This binds every lane that writes player-facing
   text, not just combat.
7. **THE MULTI-ENEMY DIAL / PUBLISHED RESOLUTION ORDER: YES, PUBLISHED.**
   Same reason as 3 — determinism is already law, and a published order
   means the player always knows who acts next and can choose whom to
   dial. This is the fourth option his synthesis put on the table for the
   long-open multi-enemy question, and it is the one consistent with our
   existing locks. HE CAN FLIP THIS ONE ON FEEL when he plays it; it is
   the only decision here that is purely about pressure rather than
   architecture.

## 3. THE CONTRADICTIONS HE FLAGGED — NAMED AND RESOLVED
He said "a couple things might contradict." There are six. Five resolve;
one is a real translation problem the build must respect.
**C1. SPEED POINTS vs OUR "NO RESOURCE TAX" BOAST.** The 6/30 combat-DNA
doc claims we out-elegance RF4 by having no resource clock forcing haste.
SP is a resource clock. RESOLVED, TAKE IT: SP is UPSIDE-ONLY. It never
taxes normal play, it grants free actions on top of it, and it refills on
a WORLD clock, not a punish timer. Nothing forces haste; the reward is
for spending it well. Our rule survives intact.
**C2. TURN-BASED vs 120 BPM.** RF4's "wait a turn" and "kite until
cooldowns recharge" assume unlimited think time. RESOLVED: I-MOVE-YOU-MOVE
already means the world advances only when you do, and our own law says
"the game never punishes taking your time... you can read the dial
forever for free." Waiting is already legal here. THE ENGINEERING CALL IS
COMBAT'S: the SP tick maps onto a beat multiple (RF4 refills on every
5th global turn, NOT five turns after use — his corpus corrects its own
tutorial on exactly this point, and the global-clock version is the one
to build; a per-use timer tests patience, a global clock tests timing).
**C3. PITS vs NO DAMAGE BEFORE THE DIAL.** Resolved in §2.4 — separate
channel, environmental only.
**C4. THE BIG ONE — RF4 IS MELEE-AND-SPELL, WE ARE GUNS.** DO NOT COPY
THE KITE LOOP LITERALLY. RF4's kiting works because most enemies must
CLOSE to hurt you; distance is safety. With guns on both sides, distance
is not safety — LINE OF SIGHT IS. So the gun-native translation is:
BREAKING LOS is our kite verb, cover is our corridor, and a corner is
still a spacing tool. Everything in his corpus about vision (§4) transfers
DIRECTLY and is worth more to us than it is to RF4. Everything about
outrunning transfers only where an enemy is melee.
**C5. 83 TIP SCREENS vs NORMIE-EASY AND NEVER MAKE HIM HUNT.** His own
synthesis pushes back on this: "83 screens of instruction is a lot of
reading placed between the player and the game," and a tip that says the
graphics are broken "has become a bug report with a border around it." WE
DO NOT SHIP 83 TIP BOXES. The A/B/C register policy (§2.6) is the answer,
and the corpus is a SOURCE, never a UI model.
**C6. MANA.** We have no MP and are not adding one — the three currencies
are the world economy, not a combat bar. His 8/15 AMMO ruling is our
ability-cost currency, alongside cooldowns.

## 4. THE NINE MACHINES (his compression, kept because it is the build order)
1. A free-movement currency on a global clock — timing becomes the skill.
2. A retreat-and-recharge loop — which makes LEVEL SHAPE a combat system.
3. Movement asymmetry — geometry generates distance for free.
4. Vision as ONE variable gating FIVE enemy systems, plus tools to
   manufacture it (steam, smoke, a body in a doorway).
5. Three-layer awareness — stealth becomes a fight-START trigger.
6. Terrain kills that ignore your damage stat — bad runs stay solvable.
7. Published deterministic AI — mastery is knowledge, not execution.
8. Bounded damage variance (50-100%) — breakpoints are plannable.
9. Status effects as TURN DENIAL and board editing — one item, five jobs.

## 5. "THE WORLD HAS TO FEEL MORE ALIVE" IS A SEPARATE ORDER, AND IT
## LANDS ON WORLD, NOT COMBAT
Machine 6 is the bridge: terrain that KILLS, terrain that AMPLIFIES
(unstable ground, +50% physical damage taken), terrain that DISABLES
(liquids switch off sprinting), terrain that FAVOURS THEM (cursed floor
healing undead), and terrain that DENIES (standing on a body to stop a
resurrection). None of that is combat code — it is TILE TYPES with
combat-readable properties, which is WORLD's system and ART's pixels.
A room only feels alive if the floor can do something to you.
This is also why his two demands are one demand: movement only matters
when the geometry means something.

## 6. ROUTING
- **COMBAT** owns machines 1, 3, 4, 7, 8, 9 and the fight half of 6. It
  is the only lane touching combat code. START WITH THE FREE-MOVEMENT
  BUDGET; it is the one he will feel first.
- **WORLD** owns the terrain-property half of machine 6 and machine 2's
  obligation: if the combat loop requires retreat, THE LEVEL GENERATOR
  HAS A HARD OBLIGATION TO GUARANTEE RETREAT IS POSSIBLE. His synthesis
  says it exactly: "combat design and map generation are the same system
  wearing two hats." A cramped room deletes the core verb.
- **LAB** — its teardown job SHRANK. He did the research. LAB does not
  re-search RF4; it turns his corpus into the numbered spec with the diff
  column and marks the contradictions in §3 as DIFFERS-ON-PURPOSE.
- **ART** — hazard tiles (pit, unstable floor, liquid, trap) enter the
  tile board as forms when WORLD defines the types.
- **ALL LANES** — the A/B/C teaching register (§2.6).
- DEMO: the indoor-combat entry (walk in a door, fight in the room) stays
  the first shippable piece and still closes demo row 1's fight half.
  Nothing here displaces RUN P0-DOOR, SOUNDS P0-WALK or RUN P0-SAVE.

# BOHEMIA QUESTBOOK — DEEP DIVE 07: WHODUNIT? (The Elder Scrolls IV: Oblivion, Dark Brotherhood)
Full teardown, the whole enchilada: event, staging, stage-by-stage flow, the multi-method kill map,
the social-manipulation system, the no-witness bonus, and Bohemia ports. This is the medium's model
for the CLOSED-BOX SYSTEMIC SET-PIECE + PLAYER-DRIVEN SOCIAL MANIPULATION — a locked sandbox where you
turn a group against itself. Widely called Oblivion's best quest. Reference only; Paolo does not read
it. No Bohemia quest written here.

Quest: "Whodunit?", a Dark Brotherhood (assassin's guild) contract in Oblivion. You infiltrate a house
party as the "sixth guest" and must murder the other five, ideally without any witness. A self-
contained, emergent murder-puzzle.

===============================================================================
## 0. THE PREMISE / STAKES
===============================================================================
- THE SETUP: the assassin guild sends you to Summitmist Manor (Skingrad). A guild agent posing as the
  DOORMAN (Fafnir) hands you the key. Five guests are inside, lured by a lie: they believe a chest of
  gold is hidden in the manor and have AGREED TO STAY LOCKED IN until it's found. In reality, THEY are
  the treasure — you're there to kill them all.
- THE LOCK: once you enter, YOU CANNOT LEAVE until the contract is done. A sealed box; you and five
  victims; one exit, opened only by completion. (The claustrophobia is the design.)
- THE TWIST GOAL: killing them is trivial (all guests have tiny health, die in one hit). The REAL game
  is the BONUS: kill all five WITHOUT being witnessed/suspected -> the "Night Mother's Blessing"
  (permanent +2 to Marksman, Security, Sneak, Acrobatics, Blade). The quest is easy to COMPLETE and
  hard to master — the challenge is entirely self-imposed via the bonus.
- THE DRAMATIC IRONY: the guests think they're in a treasure hunt; the player knows it's an
  execution. Every friendly conversation is played over that irony ("If I didn't know better, I'd say
  this whole thing is a trap" — one guest half-senses it).

===============================================================================
## 1. THE FULL STAGE-BY-STAGE FLOW
===============================================================================

### STAGE 1 — THE BRIEFING + THE KEY
- Ocheeva (guild mistress) gives the contract; go to Summitmist Manor; Fafnir the "doorman" (secret
  guild agent) hands you the key. STAGING: the guild has already seeded the trap — the doorman, the
  gold-chest lie, the locked door — you walk into a machine someone else built. You're the blade, not
  the architect.

### STAGE 2 — ENTER THE BOX (meet the marks)
- Inside, Matilde Petit greets you. GAG BEAT: you can openly tell her "I'm here to kill you all" — she
  thinks it's a JOKE, her disposition RISES, and it unlocks useful dialogue. (The truth is so absurd in
  context it reads as charm — dark comedy baked into the system.)
- The five marks: Dovesi Dran, Nels the Naughty, Neville, Matilde Petit, Primo Antonius. Each has a
  schedule, a personality, and OPINIONS of the others (some already dislike each other — exploitable).

### STAGE 3 — THE INTELLIGENCE PHASE (talk before you kill)
- Before killing, TALK to each guest: learn who they are, what they think of the others, and how to
  get them ALONE. Use the Speech mini-game to raise DISPOSITION (how much they trust/like you). High
  disposition = they'll follow your suggestions (go upstairs alone, wait for someone in a private room).
- STAGING: the manor's upper floors have private rooms — isolation is a geography you engineer. The
  puzzle is SEPARATION: get each mark alone, unwitnessed, then strike.

### STAGE 4 — THE KILL METHODS (the multi-solution sandbox)
Several fully-supported approaches, each a different "quest":

A) THE ISOLATION-STALK (stealth-rogue): raise a guest's disposition, coax them to a private upstairs
   room alone (e.g. convince Dovesi to go up to wait for Primo), follow, sneak-attack — one hit, one
   kill, no witness. Repeat, managing sightlines and who's where. The classic clean run.

B) THE POISONED APPLES (the detached/indirect method): pickpocket/collect ALL the food in the manor
   and from the guests' inventories, then place POISONED APPLES on the table. Each guest eats and dies
   on their own, no hand raised, no witness — you never even swing. (Poison apples bought from the
   guild vendor M'raaj-Dar or found in a barrel at Fort Farragut.) Environmental/indirect murder.

C) THE PARANOIA GAMBIT (the social-manipulation masterpiece): raise disposition above ~70 and you can
   CONVINCE guests that ANOTHER guest is the killer — turning them against each other so they do your
   killing FOR you. With four persuadable, you can seed a bloodbath; when two remain, convince one that
   the other is the murderer and let them kill, leaving the last with a false sense of security — then
   you finish them. (Only Matilde refuses to engage — you manipulate others onto her, or kill her last
   yourself.) The player becomes the puppeteer of a locked-room massacre.

### STAGE 5 — THE NO-WITNESS DISCIPLINE (the self-imposed mastery layer)
- The bonus requires NO murder be witnessed/suspected by a surviving guest. This demands sightline
  management, isolation timing, and (on the paranoia route) making the deaths look like the guests'
  OWN doing. Emergent tension: sometimes guests SPONTANEOUSLY start killing each other after the first
  death (the AI panics) — the system produces unscripted chaos you must adapt to.

### STAGE 6 — THE PAYOUT
- Kill all five; the door unlocks; return to Ocheeva. Reward: up to 600 gold (level-scaled) + (if
  unwitnessed) the Night Mother's Blessing (permanent +2 to five stealth/combat skills). This quest
  also raises INFAMY (guild crimes) — too much infamy locks you out of certain other content (a
  cross-system consequence).

===============================================================================
## 2. THE METHOD / SYSTEM MAP (compact)
===============================================================================
ENTRY: guild briefing -> doorman key -> locked box (no exit until done)
INTEL: talk to all 5, learn opinions + schedules, raise disposition (Speech mini-game)
KILL METHODS: isolation sneak-attack | poisoned apples (indirect, no swing) | paranoia (disposition
  >70 -> guests kill each other) | brute force (forfeits bonus)
BONUS GATE: zero witnesses/suspicion -> Night Mother's Blessing (+2 to 5 skills, permanent)
EMERGENT: guests may spontaneously turn on each other after the first death (AI chaos)
CROSS-SYSTEM: raises Infamy -> can lock other quests

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. THE CLOSED BOX: a sealed location (no exit until done) with a fixed cast — claustrophobic,
    focused, every variable on one stage. The constraint concentrates the design.
W2. EASY TO COMPLETE, HARD TO MASTER: the kill is trivial; the BONUS (no witnesses) is the real game.
    The challenge is SELF-IMPOSED — the player opts into difficulty for a reward, so mastery is
    voluntary and satisfying (no forced fail state).
W3. PLAYER AS PUPPETEER (social manipulation): the paranoia gambit lets you turn a group against
    ITSELF — the marks do your killing. Emergent social systems (disposition -> "X is the killer")
    produce a player-authored massacre, not a scripted one.
W4. THE INTELLIGENCE PHASE: you TALK before you kill — learning personalities, grudges, and schedules
    IS the gameplay; the murder is the execution of a plan you built from conversation.
W5. MULTIPLE FULLY-SUPPORTED VERBS: stealth-isolation / indirect-poison / social-paranoia / brute —
    each a genuinely different way to play the SAME box. (Multiple solutions, concentrated.)
W6. ISOLATION-AS-PUZZLE: the real challenge is SEPARATION — engineering privacy via geography +
    disposition. Sightlines and who's-where become a spatial-social puzzle.
W7. DRAMATIC IRONY: the marks think it's a treasure hunt; you know it's an execution. Every warm
    conversation plays over that gap — dark comedy + tension from asymmetric knowledge.
W8. EMERGENT CHAOS: the AI can spontaneously start killing after the first death — the system produces
    unscripted situations you must improvise around (a systemic sandbox, not a set script).
W9. THE INDIRECT KILL (never raise a hand): poisoned apples let you murder without an action — the
    victims kill themselves on your trap. Indirect agency is a distinct, chilling verb.
W10. CROSS-SYSTEM CONSEQUENCE: the quest feeds Infamy, which can lock other content — the deed echoes
    into the wider game's systems.

===============================================================================
## 4. BOHEMIA PORTS (directions, not built)
===============================================================================
- W1 (the closed box): a Bohemia "sealed sandbox" quest — a locked location (a besieged shelter, a
  quarantined block, a sealed Network facility) with a fixed cast and no exit until resolved; the
  constraint concentrates the design (ties our Q043 quiet-line + Q049 jail). Scope-isolated (per the
  Beyond-the-Beef "isolate the sandbox" law).
- W2 (easy complete, hard master): give Bohemia quests an OPTIONAL self-imposed mastery layer with a
  reward (do it non-lethally / unwitnessed / under-budget / without waking the servers) — voluntary
  difficulty, not a forced fail (ties our pacifist bonus rewards).
- W3/W6 (player as puppeteer + isolation-as-puzzle): a Bohemia social-manipulation quest where the
  dynasty turns a group against ITSELF (a faction cell, the Network's own agents, a set of rivals) via
  a disposition/standing system — the anti-Network divide-and-buy pattern TURNED on the enemy (invert
  Q037: WE do the fracturing, to them). Isolation/separation as the spatial-social puzzle.
- W4 (intelligence phase): make TALKING-before-acting the gameplay — learn personalities, grudges,
  schedules, then execute a plan built from conversation (ties Disco's dialogue-as-gameplay + our
  [READ]/investigation quests).
- W5 (multiple verbs in one box): the SAME Bohemia sealed scenario solvable via stealth / indirect
  (sabotage, contamination, cutting power) / social (turn them on each other) / force — concentrated
  multiple solutions.
- W7 (dramatic irony): let the player hold knowledge the NPCs don't (they think it's a rescue, you
  know it's a purge; they think you're an ally, you're the blade) — asymmetric knowledge for tension
  or dark comedy (carefully, per our tone + care rules).
- W8 (emergent chaos): let our AI/scheduler produce unscripted situations (a panicked crowd turning,
  guards improvising) the player must adapt to — a systemic sandbox, not a fixed script.
- W9 (the indirect kill): our systems should allow INDIRECT agency (poison the water, cut the coolant,
  reroute the power so a foe fails) — win without a direct hand (ties Q036's optional server-starve).
- W10 (cross-system consequence): Bohemia deeds should feed wider system states (an atrocity raises a
  "darkness"/infamy that locks merciful routes — ties Q019 march tally) — the act echoes outward.

---
# V2 PAYLOAD — BACKFILLED 7/16/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**THE FIVE GUESTS** — each wants the treasure chest rumored in Summitmist Manor, and each wants the other four to stop existing as competition. Individually:
- **MATILDE PETIT** — wants pedigree respected; paranoid, armed, and the first to turn violent if spooked. Trades gossip about the others freely.
- **PRIMO ANTONIUS** — wants to be liked despite the money; the softest read, the easiest to isolate.
- **DOVESI DRAN** — wants Primo, actually, sweetly, in the middle of a deathtrap. FUNCTION: the humanizing pair. Killing one in front of the other converts the survivor.
- **NELS THE NAUGHTY** — wants to drink away a dead family; the most sympathetic history in the room; violent when cornered.
- **NEVILLE** — wants order; ex-legion, armored, the hard kill and the natural suspect to frame.
Each guest will ACCUSE the others if fed suspicion. None will ever say: "it could be you." The premise (the guest who arrived last is the killer) is structurally unspeakable by the cast — the manor's social physics require them to suspect each other. THAT is the design.

**LUCIEN LACHANCE (offstage)** — wants it done UNSEEN, and pays a bonus for it. FUNCTION: the discipline layer. The witness rule converts a murder sandbox into a stealth-social puzzle.

## V2-B THE CONVERSATIONS (node trees)

NODE: PARLOR_INTAKE — entry: door closes behind you
  Five strangers, one lie ("we're all here for the chest"), and a free-roam social phase.
  Every guest has a HEARSAY node about every other guest: a 5x4 gossip matrix, all optional, all unmarked.
  > (ask Matilde about Nels)   [gate: none] -> M_ON_NELS ("a drunk; drunks are dangerous")
  > (ask Dovesi about Primo)   [gate: none] -> D_ON_PRIMO (the crush, offered unguarded)
  > ...20 such nodes total.
  THE FUNCTION: the matrix is the WEAPONS CACHE. Every fact is a lure or a frame. The conversation phase IS the loot phase. Cross-ref Q125 STAGE 3 (the plaza walk that is the entire mission): same law — the talking is load-bearing — but Whodunit makes it AMMUNITION rather than context.

NODE: ISOLATION_LURES — per guest, entry: learned their want
  Each want converts to a lure: Primo can be drawn away by flattery, Dovesi by a note "from" Primo, Matilde by feeding her paranoia until she attacks someone FOR you.
  > (tell Matilde that Neville is the killer)  [gate: knows:matilde_paranoia] TRAP-AS-TOOL -> she may draw steel herself; the manor does your work.
  THE CRAFT: the game lets NPC psychology be the murder weapon. No Speech stat gate anywhere — the gates are all KNOWLEDGE (did you do the gossip matrix). This is the .bq [gate: knows:] vocabulary, shipped in 2006.

NODE: SURVIVOR_COMFORT — entry: guests are dying and someone found a body
  The survivors' texts CHANGE as the count drops: suspicion -> terror -> pleading. Dovesi over Primo's body is the famous one.
  NOVERB: "I'm not the killer." — YOU CAN NEVER DENY IT. No dialogue exists to claim innocence. The game withholds the alibi verb from a professional liar in a house full of accusations, because the moment you could deny it, the tension would have a pressure valve. Bank it: REMOVE THE ALIBI VERB in any Bohemia quest where the player is the secret.

## V2-C THE BRANCH MAP

COUNT: 2 formal outcomes × a combinatorial interior.
B1 — ALL FIVE DEAD, NEVER WITNESSED: full pay + the bonus. The "perfect night."
B2 — ALL FIVE DEAD, WITNESSED AT LEAST ONCE: full pay, no bonus, a scolding.
(No fail state short of leaving; the interior — ORDER of kills, METHODS, WHO watched whom die, WHO turned on whom — is the actual branch space, and it is enormous and unscored.)
STRUCTURAL FINDING: the quest scores only the DISCIPLINE (witnesses), never the CRUELTY (methods/order). The most theatrical staging and the quietest knife pay identically; the player's style is their own business. Bohemia's conscience-without-a-meter, demonstrated by an assassination quest: the game watches ONE thing and stays silent on the rest, and the silence is where the player meets themselves. Cross-ref Q126 W6, Q2-B5.

## SOURCES
UESP Wiki (Oblivion:Whodunit — the locked box, the gold-chest lie, the Night Mother's Blessing +2/5
skills, the no-witness bonus); Game8 + TheGamer + GameRant + GuruGamer + Fextralife + Nightly Gaming
Binge + SuperCheats (stage-by-stage, the five marks, disposition>70 paranoia manipulation, poisoned-
apple method, isolation-stalk, the spontaneous-AI-chaos note, Infamy cross-lock). FUTURE: a piece on
Radiant-AI/emergent systems in Oblivion for the "unscripted chaos" design; the full Dark Brotherhood
arc (Lucien Lachance, the purification twist) as a follow-on deep-dive.

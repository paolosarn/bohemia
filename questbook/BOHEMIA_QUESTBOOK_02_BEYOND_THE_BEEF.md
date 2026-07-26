# BOHEMIA QUESTBOOK — DEEP DIVE 02: BEYOND THE BEEF (Fallout: New Vegas)
Full teardown, the whole enchilada: event, staging, stage-by-stage flow, script beats, the full
branch web, skill-gate map, reputation outcomes, and Bohemia ports. THIS is New Vegas's showcase of
MAXIMAL alt-solutions on a single node — the "web of madness" that made NV the reactivity gold
standard. Reference only; Paolo does not need to read it. No Bohemia quest written here.

Quest: "Beyond the Beef," a side quest at the Ultra-Luxe casino, The Strip. Notably the ONE NV quest
with (almost) no cross-faction repercussions — a self-contained sandbox built purely to show how many
ways one problem can be solved. Ties into the quest "Pheeble Will."

===============================================================================
## 0. THE PREMISE / STAKES
===============================================================================
- WHO: Heck Gunderson, a wealthy brahmin baron (rancher tycoon), drinking away his grief at the
  Ultra-Luxe bar; his son TED Gunderson has vanished inside the casino.
- THE HOOK: find Ted. Simple missing-person errand — you disarm at the door (White Glove Society
  casinos take your weapons; a STAGING constraint that shapes every violent route), offer to help.
- THE HIDDEN TRUTH: Ted was kidnapped by MORTIMER, a faction radical in the White Glove Society (the
  reformed-cannibal high-society faction), who wants to force the WGS back to CANNIBALISM by secretly
  serving Ted's flesh at an upcoming gala dinner.
- THE MORAL SPACE: save the innocent / join the cannibal plot / frame the father / profit off either
  side / slaughter everyone. The quest is a moral sandbox with a dozen viable exits.

===============================================================================
## 1. THE FULL STAGE-BY-STAGE FLOW (with every major branch)
===============================================================================

### STAGE 1 — THE DISARM + THE HOOK (Ultra-Luxe lobby)
- Surrender weapons at the door (WGS rule). STAGING: this single constraint is why so many routes
  funnel toward stealth, holdout weapons, fists, chems, or social — the level design PRE-SHAPES the
  solution space by disarming you.
- Meet Heck at the bar; accept the job to find Ted.

### STAGE 2 — THE INVESTIGATION (the staff)
- Talk to MARJORIE (WGS manager) at the Gourmand restaurant: she mentions ANOTHER recent
  disappearance (a bride, pre-wedding) — seeding the cannibal pattern. She can also, if your Strip
  rep is Accepted+, SPONSOR you as a WGS member (grants kitchen access — a social key that replaces
  lockpicking/violence later). CLUE: she points to an "investigator" in the building.
- Talk to CHAUNCEY (the investigator/contact): he reveals Ted is held in a member-only freezer, and
  lays out TWO nonviolent methods up front (cook a fake meal to expose Mortimer; or chem the WGS
  members unconscious). STAGING BEAT: right after he helps you, an assassin appears and KILLS Chauncey
  — ALWAYS, no matter your dialogue. (A scripted stakes-raiser: the plot has teeth; helping you is
  lethal; the clock is real.)

### STAGE 3 — THE FORK-MAKER: MORTIMER (the hinge conversation)
- Find Mortimer behind the reception desk. THIS CONVERSATION sets the entire quest's shape:
  - IF you convince him you're ALSO a cannibal — via Speech 62/63 OR the CANNIBAL perk OR (fallback)
    accepting Evil Karma + a non-neutral Strip rep — he CONFIDES the plot and RECRUITS you, handing
    over the penthouse key, kitchen key, and freezer key (full access to the hotel).
  - IF you DON'T ally with him — you go in the hard/stealthy way (lockpick, sponsored access, or force).
- DESIGN NOTE: one NPC is the branch-router. The same quest becomes "infiltrate the villain's plot
  from inside" OR "break in from outside" depending on a single social check. Access is granted by
  DECEPTION on one path and by STEALTH/SOCIAL/FORCE on the other.

### STAGE 4 — REACH TED (the freezer) — multiple keys
- Get into the kitchen: Marjorie's sponsorship (social), Mortimer's keys (deception), or lockpick
  (skill). Open the freezer; Ted is alive, traumatized, demanding to know who did this.
- MICRO-BRANCH (matters later): tell Ted the TRUTH, a LIE, or "no time to explain." Truth forces a
  later Speech check with Heck; lie/deflect earns WGS Fame cleanly. (A small dialogue choice with a
  delayed mechanical consequence — reactivity texture.)

### STAGE 5 — THE DIVERGENT RESOLUTIONS (the web — here's the "madness")
The quest now branches into fundamentally different quests. Major routes:

A) SAVE TED — EXPOSE MORTIMER (the "cook the fake meal" route, the clean-clever win)
   - In the kitchen, COOK an imitation-meat meal (a fake "long pig" dish) using ingredients on hand.
   - Wait until ~7 PM (dinner); use the intercom to call the Head Waiter to collect the dish. STAGING:
     if not WGS-sponsored, don WGS attire as a disguise or stay hidden so the waiter isn't hostile.
   - At the banquet in the Members-Only Area, the fake meal + the reveal EXPOSES Mortimer as trying to
     feed them human flesh — turning the WGS against HIM. Free Ted (after the waiter leaves — seeing
     Ted turns him hostile) and lead him out.
   - KNOWN FRAGILITY (emergent-systems cost): if you killed WGS guards in the kitchen, Mortimer may
     never give his speech; the whole dining room goes hostile unless you're disguised; you may have to
     fight out through the lobby. (The density of interacting states makes it bug-prone — the price of
     deep branching, and a real lesson about scope.)

B) SAVE TED — DRUG THE WGS (the "chem the wine" route, the stealth-pacifist win)
   - Requires Medicine 25 + Med-X. Find a wine bottle (wine cellar or by the kitchen stove), lace it.
   - Call the waiter at 7 PM to serve the drugged wine; the guests pass out; walk Ted out through the
     drugged banquet, confront/expose Mortimer, return Ted safe. (A cleaner, quieter A-variant.)

C) JOIN MORTIMER — KILL & COOK TED, FRAME HECK (the full villain route)
   - Ally with Mortimer; he gives the basement key. KILL Ted; collect a jar of his BLOOD.
   - Go to the Ultra-Luxe PENTHOUSE (trespassing; sneak or kill Heck's guards — "no consequences for
     going in guns blazing" here); SPREAD Ted's blood on the bed and in the sink (staging a murder scene).
   - Report the "murder" to a Securitron on the Strip; it moves to ARREST Heck; Heck resists and is
     KILLED. (This satisfies the linked "Pheeble Will" revenge quest.) Ted's body becomes the meal;
     the WGS returns to cannibalism. Full dark route.
   - VARIANT: if willing to sacrifice a COMPANION, you can lock a companion in the freezer as the meal
     instead of Ted (a grim systemic option the sandbox quietly allows).

D) SLAUGHTER ROUTE (the brute-force win)
   - Tell Heck the truth about the WGS; he's enraged and hands you a Sawed-Off Shotgun + shells and
     says just shoot everyone in the way. Rampage through the WGS, grab Ted, walk him out. (Violence as
     a first-class, provided-for solution — the game ARMS you for it.)

### STAGE 6 — RETURN TED / THE PAYOUT (reputation forks)
- Bring Ted to Heck. You're prompted on "what happened," and the SOCIAL choice sets the reward + rep:
  - LIE ("no idea who did it"): 500 caps + 500 XP + WGS Fame (protect the faction).
  - TRUTH (name the WGS): pass a Speech 35 check to convince Heck NOT to blockade the Strip -> Strip
    Fame. (Naming the culprit risks a Strip-wide economic blockade unless you talk him down — a
    political consequence.)
  - SIDE WITH HECK (against the WGS): 500 caps but Strip + WGS Infamy.
- DESIGN NOTE: even the ENDING conversation is a branch with divergent factional/economic outcomes —
  the reward is not fixed loot but a reputation-shaping social choice.

===============================================================================
## 2. THE BRANCH / SKILL-GATE MAP (compact)
===============================================================================
ACCESS to kitchen: Marjorie sponsorship (Strip rep Accepted+) | Mortimer's keys (Speech 62-63 /
  Cannibal perk / Evil-Karma fallback) | lockpick (skill)
CORE FORK (at Mortimer): ALLY (infiltrate the plot) vs REFUSE (break in)
SAVE-TED methods: cook fake meal (expose Mortimer) | drug wine (Medicine 25 + Med-X) | shotgun
  rampage (Heck arms you) | sneak-extract
VILLAIN methods: kill+cook Ted -> frame Heck via blood-staging + Securitron -> Heck dies (feeds
  Pheeble Will) | sacrifice a COMPANION as the meal instead
TELL TED: truth (later Speech 35 w/ Heck) | lie | deflect (WGS Fame)
PAYOUT: lie (caps+XP+WGS Fame) | truth+Speech35 (Strip Fame, no blockade) | side w/ Heck (caps, dual
  Infamy)
SCRIPTED CONSTANT: Chauncey always dies; disarmed at entry (shapes all violent routes).

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. ONE NODE, MANY QUESTS: a single incident (missing son) fans into save/expose/drug/rampage/join/
    frame/sacrifice — each a genuinely different quest with different verbs, not reskins. The NV "web."
W2. THE BRANCH-ROUTER NPC: Mortimer is a single conversation that forks the whole mission (ally vs
    refuse). Concentrating the fork in one character keeps a sprawling web legible.
W3. MULTIPLE KEYS TO ONE DOOR: kitchen access via social (sponsorship) / deception (keys) / skill
    (lockpick) — the SAME obstacle solved by whatever build you are. (NV Rule #1 in miniature.)
W4. THE DISARM CONSTRAINT SHAPES SOLUTIONS: taking your guns at the door pushes players toward stealth/
    chems/fists/social/disguise — level design that BREEDS creative solutions by removing the default.
W5. THE VILLAIN ROUTE IS FULLY BUILT: you can JOIN the cannibal plot, cook the victim, frame the
    father, and the game supports it end-to-end (blood-staging, a framed arrest, a linked revenge
    quest). Evil is a first-class, fully-authored path, not a fail state.
W6. DISGUISE + TIMED SET-PIECE: the 7 PM dinner + WGS-attire disguise + intercom-call-the-waiter is a
    heist-like timed social-stealth beat — a mini-caper inside the quest.
W7. THE ENDING IS A BRANCH TOO: the payout conversation forks caps/Fame/Infamy/political-blockade —
    the reward is a reputation choice, not fixed loot.
W8. SELF-CONTAINED SANDBOX: deliberately walled off from cross-faction repercussions so the designers
    could go MAXIMAL on internal branching without world-state spaghetti. (A lesson in SCOPING
    reactivity: isolate the sandbox to afford depth.)
W9. EMERGENT FRAGILITY AS HONEST COST: the same density that makes it great makes it bug-prone (kill a
    guard and Mortimer's speech may never fire). The takeaway isn't "don't branch" — it's "test the
    state-combinations, and isolate the sandbox so failures stay local."
W10. DELAYED MICRO-CONSEQUENCE: telling Ted the truth in the freezer forces a Speech check with Heck
    much later — small early dialogue choices ripple.
W11. COMPANION-AS-RESOURCE (grim systemic honesty): the sandbox lets you sacrifice a companion as the
    meal — the systems don't flinch from dark player creativity.

===============================================================================
## 4. BOHEMIA PORTS (directions, not built)
===============================================================================
- W1/W2 (one node, many quests + a router NPC): build a Bohemia "convergence incident" (smaller than
  the Q039 summit) — one event (a disappearance, a theft, a killing) with a single ROUTER NPC whose
  conversation forks the whole quest into save/expose/join/frame/rampage. Our factions (MOB, WGS-like
  CARTEL, TRADES) give the same "high-society-with-a-dark-secret" texture.
- W3 (multiple keys to one door): audit that Bohemia obstacles open via social/skill/faction/stealth,
  not one path — our [READ]/[BARTER]/standing gates already do this; make ACCESS specifically multi-key.
- W4 (constraint breeds creativity): use a diegetic CONSTRAINT (disarmed entering a faction hall, no
  electricity in a zone, a rationed resource) to push players off the default solution — level/economy
  design that breeds cleverness.
- W5 (fully-built villain route): keep authoring the dark path end-to-end (our BECOME ending, Q043
  betray, Q046 co-opt) — evil is a designed route with its own payoffs, never a fail state.
- W6 (timed disguise caper): a Bohemia infiltration with a diegetic clock + a disguise/perform beat
  (ties the KCD monastery lesson + our Q018 cult + Q043 the quiet line).
- W7 (the ending is a branch): make the FINAL report-back a reputation fork (lie/truth/side-with),
  not fixed loot — our Megaton law, applied specifically to the payout conversation.
- W8/W9 (scope the sandbox): for our most heavily-branched quests, ISOLATE them from cross-faction
  world-state so we can afford maximal internal branching without breaking the fold — a production law:
  contain the spaghetti.
- W11 (systems honor dark creativity): our engine should let players use the CITY-BUILDER/logistics/
  companion systems in grim ways the quest didn't script (sacrifice, starve, betray) — systemic
  solution space (the biggest gap flagged in the collection self-audit).

---
# V2 PAYLOAD — BACKFILLED 7/16/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**MORTIMER** — wants the White Glove Society returned to cannibalism, dressed as heritage. Will trade: membership, money, and a seat at the table. Will never say out loud: that the "return to the old ways" is HIS ambition wearing the Society's history as a costume; the membership mostly doesn't know. FUNCTION: the fork-maker. Every resolution routes through what you do about Mortimer.

**HECK GUNDERSON** — wants his son back, then wants Vegas punished. A beef baron with the leverage to starve a city. Will trade: caps for results. Will never say: that his grief converts to embargo the moment it curdles. FUNCTION: the ticking externality. His reaction is the quest's blast radius.

**TED GUNDERSON** — wants to go home. Locked in a freezer, marinating. FUNCTION: the meat. Also the witness: WHERE he is found and WHO he saw determines which resolutions stay open.

**PHILIPPE** — the chef. Wants status; got a kidnapping instead. Will trade: nothing willingly; he folds under pressure or gets replaced BY THE PLAYER in his own kitchen. FUNCTION: the weak link, and the door to the quest's blackest branch.

**MARJORIE** — wants the Society's reformed reputation protected. Genuinely reformed, genuinely in the dark. FUNCTION: the institution's honest face, which is what makes framing the institution possible.

**THE INVESTIGATOR (offstage)** — the White Gloves' own suspicion. FUNCTION: proof the Society is not a monolith, which the best resolution exploits.

## V2-B THE CONVERSATIONS (node trees)

NODE: MORTIMER_HINGE — the hinge conversation, entry: enough evidence to name him
  THE FAMOUS ONE. Mortimer can be confronted, joined, blackmailed, or bypassed entirely.
  > "I know what you're planning."               [gate: knows:plot]        -> M_CONFRONT (he denies, quest continues hostile)
  > "I want in."                                  [gate: none] TRAP+DOOR    -> M_JOIN (opens the cannibal branch; this trap is a REAL DOOR, the rarest kind)
  > "The Society will hear about this."          [gate: knows:plot]        -> M_FLIGHT (he flees; the Society investigates itself)
  > [Barter 45] "Heritage is expensive. Pay me." [gate: barter>=45]        -> M_BRIBE
  NOTE FOR THE COMPILE: FNV gates on SKILLS (Barter/Speech), not karma. Bohemia's .bq bans stat gates entirely; the port converts every skill gate here into a KNOWLEDGE or DEED gate. The quest loses nothing: every skill gate in Beyond the Beef has a non-skill route around it. THAT is the FNV design lesson — the stat check is a shortcut, never the only key.

NODE: FREEZER_TED — entry: found Ted
  > "Your father sent me. Let's go."     [gate: none]           -> ESCORT (the safe route)
  > "Stay put. I end this first."        [gate: none]           -> TED_WAITS (opens the resolutions that need the kitchen)
  > (leave him)                           [gate: none] SILENCE   -> TED_STAYS_MEAT (the door to B5)
  NOVERB: "It's going to be okay." Ted is not offered comfort by the game. He is offered EXITS. FNV's tone in one removed verb.

NODE: THE_SUBSTITUTION — the kitchen, entry: Ted out + a body needed
  The quest will let you replace Ted's corpse with another corpse, and the other corpse can be CARLYLE ST. CLAIR, an innocent man, lured and murdered by you for the purpose.
  > (lure St. Clair)   [gate: none] TRAP-THAT-IS-A-PLAN -> B5 opens
  THE CRAFT FINDING: the game's most evil branch requires the most PLAYER INITIATIVE. Nobody suggests it. No NPC plants it. You have to assemble it from parts, on purpose. Evil as a crafting recipe. Cross-ref Q126 W6 (the cruelest option is unmarked); this is the elaborated version: the cruelest option is UNWRITTEN and the player authors it.

NODE: HECK_PAYOUT — entry: resolution reached
  Same node, six different texts, depending on WHAT you tell him and WHETHER Ted is alive and WHAT Ted saw.
  > truth + Ted alive        -> caps, gratitude, no embargo
  > lie + Ted alive          [gate: ted_coached] -> caps, and the lie holds only if you coached Ted first (a DEPENDENT lie — the game checks the witness)
  > Ted dead + framed story  -> grief converts to the embargo threat; the Strip's food supply enters the ending slides
  THE MECHANIC TO STEAL: THE LIE HAS A WITNESS REQUIREMENT. You cannot just say it; you have to have ARRANGED it. Bohemia's .bq expresses this as [gate: flag:coached_witness] on the lie option — a lie that requires prep is a lie the player COMMITS to, not one they stumble into.

## V2-C THE BRANCH MAP

COUNT: 6 named resolutions (the wiki-famous "madness").
B1 — Ted rescued, Mortimer exposed, Society stays reformed. The "good" clear.
B2 — Ted rescued, Mortimer flees, investigator handles it internally.
B3 — Ted rescued via bribe/barter routes; Mortimer unpunished. WRITES: mortimer_free.
B4 — JOIN: Ted dies, player becomes a member, the Society returns to the old ways. WRITES: whitegloves_cannibal (faction-wide state change from ONE quest).
B5 — THE SUBSTITUTION: St. Clair murdered, Ted's death concealed, perfect crime, nobody ever knows. WRITES: stclair_dead, and NOTHING ELSE — the absence of consequence IS the consequence. No karma hit large enough to matter, no discovery. The game lets a perfect crime be perfect.
B6 — Shoot your way out: everything hostile, Ted alive or not, reputation destroyed.

STRUCTURAL FINDING: one quest flips a FACTION's permanent state (B4). Bohemia's 13-faction web should reserve this power for a handful of quests and mark them internally (the .bq @DO faction_state change is rare and loud in the validator).

## SOURCES
Fallout Wiki (fallout.wiki) + Fallout Fandom + The Vault (full route breakdown, skill gates, the
"only quest with no cross-faction repercussions" note, Pheeble Will link); TheGamer + Game8 +
SuperCheats + Wasteland Gamers + Altered Gamer (stage-by-stage, cook/drug/frame/rampage routes,
reputation payouts, the emergent-fragility bugs). FUTURE: a designer commentary on NV's sandbox-
scoping philosophy (Sawyer) for the "isolate the sandbox" law.

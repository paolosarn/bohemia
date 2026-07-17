# BOHEMIA — QUEST CRAFT RESEARCH (deep dive, 7/13/26)
Fresh research dump, poured into the vault. Design-craft principles + specific legendary-quest
teardowns from the four studios that define reactive quest design (Obsidian/New Vegas, CDPR/
Witcher 3, ZA/UM/Disco Elysium, Larian/D:OS2), pulled from postmortems, GDC talks, dev
interviews, and design criticism. This is the WHY beneath the reputations — the structural DNA
to build every Bohemia quest against. NO quests written here; this is the reference bench.

SOURCES pulled this session: Fallout Community Writing Guide (fallout.wiki); DualShockers +
NeoGAF + Legacy of Games on NV alt-solutions; TVTropes NV analysis (the "letting go" thesis);
Sasko GDC 2017 (Witcher 3 pacing-graph) via Wikipedia/Kotaku on the Bloody Baron; Disco Elysium
system analyses (Gabriel Chauri, Game Design Thinking, gameplayreflections "Meaning of Failure",
Forst Stories); Obsidian studio ethos (MS Source, RPGHQ, RPG Codex PAX panel); G2A on D:OS2.

===============================================================================
## PART A — THE CRAFT LAWS (the transferable principles)
===============================================================================

### A1. MULTIPLE SOLUTIONS, ALWAYS (the New Vegas first commandment)
The NV/Obsidian core rule, stated in the community Writing Guide as literal Rule #1: "We will
always allow for multiple solutions to any obstacle." Every obstacle takes at least: combat,
stealth/avoidance, speech/social, a skill/knowledge angle, and often a faction-leverage angle.
- The famous NV example (Legacy of Games): missing medical supplies at a camp -> stake out to
  catch the culprit, OR ask around for clues, OR run a medical analysis of the soldiers if you
  have the skill. Same objective, three entirely different routes, different outcomes.
- BOHEMIA APPLICATION: every quest node-tree already offers combat + pacifist; the law says push
  further — add the skill-angle and the faction-leverage angle as first-class routes, not flavor.
  Our [READ]/[MEDICINE]/[BARTER] gates ARE this. Keep at least 3 real approaches per obstacle.

### A2. THERE IS NO RIGHT ANSWER (every outcome carries a negative)
From the Fallout Writing Guide, verbatim principle: "Every quest outcome should have some
arguably negative outcome, and the player decides if this is worth it. Compromise should have
its own negative externalities, not be the best solution." Explicitly names Outer Worlds' flaw:
it "often had a 'best' solution, the obvious correct choice." NV's ending factions are the model
— Legion (order + slavery), NCR (citizenship + bureaucracy), House (freedom + autocracy), Yes
Man (liberty + chaos). Players STILL debate the best one. That debate is the design goal.
- BOHEMIA APPLICATION: this is already our Megaton law, but sharpen it — audit every quest so the
  COMPROMISE/middle route is NOT secretly the best. Our Q044 (build one, un-build three) and Q049
  (justice philosophy, each pattern has a body count) nail it. The tell of a broken quest: if a
  playtester can name the "correct" choice, the quest failed. Every route must cost something a
  reasonable player would mourn.

### A3. FAILURE IS A BRANCH, NOT A WALL (the Disco Elysium law)
The single most-cited Disco craft principle (gameplayreflections, Forst Stories, GDT): "Design
skill checks where failure advances the plot in unexpected directions. Instead of 'you don't
find the clue,' try 'you find a different clue that complicates everything.' Make failure as
narratively rich as success." Red checks (one-shot, story-altering) vs white checks (retryable).
Failure never softlocks the main story — it reroutes it. Failing a check can open dialogue/
narrative MORE interesting than passing.
- CAUTION (the anti-pattern, from the Disco critics): DON'T gate a whole quest chain behind a
  single check the player can't pass — "the narrative stops dead until you succeed" is the one
  thing everyone hates. Failure must ROUTE, never DEAD-END.
- BOHEMIA APPLICATION: our skill-gates currently mostly gate BONUS content (good). The upgrade:
  write the FAILURE branch of key checks as its own real content. If you fail the [READ] on the
  saboteur, you don't just "miss it" — you accuse the wrong person and it costs you. Bank a rule:
  NO check may hard-block quest completion; every failure has a written consequence-path.

### A4. SKILLS/VOICES AS CHARACTERS (the Disco reframe)
Disco's revolution: each skill is "both mechanical modifier and narrative character" with its own
voice, agenda, personality — they interrupt, argue, contradict each other, creating internal
conflict that drives external choice. Empathy whispers someone's lying; Authority pushes toward
domination. The player arbitrates the voices.
- BOHEMIA APPLICATION: we don't need 24 voices, but the principle ports to our 4-channel FACE/
  BODY/CAMERA/MUSIC presentation AND to companions. Our recurring NPCs (Vance's flicker, Nadia,
  Dr. Sama) can function as "externalized skills" — the companion who WANTS you to fight vs the
  one who wants you to talk, each nudging with their agenda. Consider: a light "instinct" line
  system where the dynasty's own hard-won traits (from prior quests) speak up in dialogue.

### A5. THE PACING GRAPH (Sasko / Witcher 3, GDC 2017)
CDPR maps every quest's story sequence to a PACING GRAPH: a plotted tension curve across each
scene/beat, marking where combat or other interactive gameplay sits relative to narrative
tension. Quests are conceptualized by TWO teams — writers (what happens) + designers (what the
player DOES) — then collaborate. Sasko's rule: avoid clichés unless used self-consciously;
frequently discard initial ideas to keep it fresh.
- BOHEMIA APPLICATION: bank a PACING-GRAPH pass as a production step. For each quest, sketch the
  tension curve — where's the lull, the spike, the gut-punch, the release. Our quests have beats
  but no explicit tension mapping. Add a one-line "pacing shape" to each (e.g. Q038: slow-burn
  investigation -> the Arlo reveal spike -> quiet moral choice -> the precedent gut-punch). Make
  sure combat/interactivity lands ON tension peaks, not randomly.

### A6. DELAYED / TWO-PART CONSEQUENCE (the Bloody Baron structure)
The Baron isn't one quest — it's "Family Matters" + "Return to Crookback Bog" + the buried
"Whispering Hillock" choice that most players hit BEFORE they understand its weight. The
Hillock choice (free or kill the tree spirit) is made early, in apparent isolation, and
silently determines the Baron's family's fate two quests later. The gut-punch: you can make the
morally obvious choice (save the orphans from the witches) and a village gets razed for it. And
the FINAL twist — regardless of outcome, the Baron's thugs end up running Velen as raw tyranny,
"you just made bad things even worse."
- BOHEMIA APPLICATION: this is our fold/precedent system's whole justification (Q038 precedent,
  Q040->042 resurfacing). The upgrade: plant a choice EARLY whose weight isn't clear until later,
  in apparent isolation. The player shouldn't always KNOW which choice is the load-bearing one.
  Bank: at least some consequence-triggers should be quiet at decision-time and loud at payoff.

### A7. SUBVERT THE INTRO EXPECTATION (the Baron build-up)
You first hear "the Bloody Baron" from a Nilfgaardian ambassador describing a one-dimensional
tyrant; you meet his thugs at an inn confirming it; then the quest subverts all of it into a
tragic, human, morally-grey father — and ENDS by circling back to the one-dimensional tyranny
you were promised (the thugs take over). The expectation is set, subverted, then tragically
fulfilled.
- BOHEMIA APPLICATION: use the district's RUMOR of an NPC to set a flat expectation, then subvert
  it on contact (our Q033 stalker-is-a-grieving-fan already does this). Bank it as a reusable
  shape: RUMOR (flat) -> CONTACT (human/complex) -> optionally a tragic return to the flat truth.

### A8. THE PROTAGONIST-PARALLEL ANTAGONIST (the Baron = Geralt mirror)
Sasko: "the Baron is a parallel to Geralt himself: two fathers who lost their loved ones, two
men with blood on their hands, both capable of doing anything for their families." The best
morally-grey figures are a DISTORTED MIRROR of the player's own situation/values.
- BOHEMIA APPLICATION: our Amalgamation IS this (a grave that can't let go — the dynasty's own
  "never lose anyone" fear at cosmic scale; Q053 BECOME makes the mirror literal). Bank the law:
  the strongest antagonists want the SAME thing the dynasty wants, by a darker means. Apply to
  mid-tier villains too (a hoarder who "planned," a false messiah who "gives hope").

### A9. THE UNIFYING THESIS (New Vegas = "letting go")
TVTropes' NV analysis: the whole game is thematically "about letting go." Every DLC villain
can't let go of something — Elijah (Old World tech), Ulysses (the past), the Think Tank (a world
for their science), the factions (Vegas/Hoover Dam). "Fallout New Vegas was caused by refusal to
let go." The Courier/Wild Card = the one who CAN let go. A single thematic spine runs through
every quest and every antagonist.
- BOHEMIA APPLICATION: we HAVE this — "consequence across time / what survives when a life ends"
  (Q038 keystone) AND, newly sharpened by this research, our own "letting go" echo is RIGHT THERE
  in the Amalgamation (a grave that won't let the dead go) and the LIBERATE ending (letting them
  go is the terrible mercy). Bank: make sure every antagonist embodies a FAILURE to let go of
  something (the hoarder, the false messiah, the stalker, the record-seizer). It's already latent;
  make it deliberate.

### A10. REACTIVITY = MEMORY (the world remembers)
NV's praised trait (DualShockers, Nocturnal Rambler on Disco): "its memory for your choices" —
the world references what you did previously, establishes running jokes, comments on consistent
behavior, adds modifiers to later checks (Disco: "+1 Kim trusts you"). This is what "feels like a
live GM." Companions each REPRESENT a faction and LEAVE if you act against their interests (NV) —
reactivity with teeth.
- CAUTION (RPGHQ thread): reactivity gets "convoluted very fast" — Oblivion modder needed a full
  map to track one NPC remembering a greeting. BG3 was criticized for strong early reactivity that
  "becomes next to nothing" — starting strong then half-assing is worse than consistent-modest.
  LESSON: pick the reactivity that TRULY MATTERS and do it fully, rather than spreading thin.
- BOHEMIA APPLICATION: our unrecorded-ledger + standing + fold IS this memory system. The caution
  is the important bank: don't promise reactivity we drop. Better a few DEEP remembered threads
  (Vance, the Family Box, the precedent flag, district-order) than a hundred shallow ones. Show
  the modifier to the player (Disco's "+1 Kim trusts you" transparency) — surface WHY a line
  unlocked, so the memory feels earned, not random.

### A11. CONVERSATION AS GAMEPLAY (Obsidian's "conversation gameplay")
Obsidian (Outer Worlds 2 devs, MS Source): "we design branching conversations the player can
navigate using strategy, unique opportunities based on the background they've chosen, and/or
random whimsy. We call it 'conversation gameplay.'" Dialogue is a TACTICAL space — background/
build unlocks unique options; the conversation is a puzzle with multiple keys.
- BOHEMIA APPLICATION: our upbringing/background flags (Q003 raised-hard/gentle) should unlock
  UNIQUE dialogue keys the way NV's skills do ("dialogue options for skills you aren't good in"
  were a fan favorite — the LOW-skill lines too, not just high). Bank: write background-gated AND
  low-stat lines, not only success lines. A dumb/blunt option is as fun as a smart one.

### A12. NO SAINTLY VICTIMS / MESSY REALISM (the Baron's wife problem, handled)
The Baron quest draws unease precisely because it humanizes an abuser without giving the wife a
full counter-voice — the critics (Shamus Young, ResetEra) debate whether it edges toward
sympathy-for-the-abuser. The lesson isn't "don't do grey" — it's: when you humanize a wrongdoer,
make sure the WRONGED aren't flattened into either saints or deserving-victims. Messy realism
(Sasko drew from real rural alcoholism/abuse he witnessed) is the strength; erasing the victim's
side is the risk.
- BOHEMIA APPLICATION: our child-safety + care rules already guard this. Bank the craft version:
  when a Bohemia quest humanizes a villain (the hoarder, the raider Raif, the Baron-type), give
  the WRONGED a real voice too (Esse's fierce grief answers the hoarder; the kin answers the
  grave). Never let sympathy-for-the-complex-villain silence the people they hurt.

===============================================================================
## PART B — THE STEAL TABLE (specific legendary quests, structural teardown)
===============================================================================
Named quests worth stealing SHAPES from (not content). Each: the shape, why it works, the
Bohemia port. Extends the original Quest Vault's steal table.

B1. BEYOND THE BEEF (New Vegas) — the multi-faction convergence node.
   SHAPE: one event (a cannibal cook + a missing VIP) that 4+ factions/actors each want resolved
   differently; wildly divergent solutions (save/frame/cook/expose), many bugs BECAUSE of the
   branching density. WHY: maximal alt-solutions on a single node — the "web of madness" NV is
   famous for. PORT: a Bohemia "convergence quest" where one incident pulls REDS/BLUES/CHURCH/
   MOB each wanting a different end — already latent in Q039 summit; make a SMALLER-scale one.

B2. THAT LUCKY OLD SUN (NV) — the infrastructure-allocation quest.
   SHAPE: reroute a solar plant's power to different regions; a pure distribution choice with
   winners/losers, no combat. WHY: infrastructure AS the quest (our exact thesis). PORT: this IS
   Q036 (the plant) + Q044 (the build) — validated. Bank more of these; they're on-brand.

B3. HEARTACHE BY THE NUMBERS (NV, Cass's companion quest) — the pre-seeded slow-burn.
   SHAPE: "starts way before you can recruit her"; you can visit the caravan sites BEFORE the
   quest exists; multiple ways to be sent to find her, one "seriously evil"; a route that REMOVES
   an available questline. WHY: the quest world exists before the quest triggers — reactivity of
   PRESENCE. PORT: plant Bohemia locations/NPCs the player can encounter BEFORE their quest
   activates, so the quest feels discovered, not spawned. Bank: some quests should be enter-able
   from the middle.

B4. THE WHISPERING HILLOCK (Witcher 3) — the isolated load-bearing choice (see A6).
   SHAPE: an early, apparently-standalone choice (free/kill the tree spirit) silently decides a
   major later outcome. PORT: our precedent/fold flags; add ones the player doesn't clock as
   load-bearing at decision time.

B5. THE WATER OF LIFE / any Disco "corpse reveal" beat — the tonal gut-drop.
   SHAPE (You Are the Miracle essay): a silly, favorable-feeling side quest (pestering a woman
   about her missing husband) that suddenly reveals his CORPSE — the tonal whiplash lands BECAUSE
   the build-up was light. WHY: earned devastation via tonal contrast. PORT: our release-valve
   quests (Q011 statue, Q020 zombie-video) can set up a later gut-drop by contrast; bank the
   technique — a light quest can be the SETUP for a heavy payoff elsewhere.

B6. DEAD MONEY (NV DLC) — "begin again" / letting-go-of-greed as mechanic.
   SHAPE: the gold is real and takes you IF you can't let it go (you can literally get trapped
   grabbing it); the whole DLC is "letting go." WHY: theme enforced by mechanics, not dialogue.
   PORT: our Q035 (sell/rebuild/return the cache) + the LIBERATE ending (let the dead go) already
   channel this. Bank: enforce theme through a MECHANIC the player feels, not an NPC's speech.

B7. THE BLOODY BARON (full, W3) — the rumor->human->tragic-return arc + protagonist mirror (A7,
   A8) + two-part delayed consequence (A6). The master example; three of our craft laws in one
   quest. PORT: build one Bohemia flagship that consciously chains all three (a faction warlord
   whose rumor is flat, whose truth is a mirror of the dynasty's own "keep everyone" drive, whose
   fate is set by an earlier quiet choice).

===============================================================================
## PART C — THE ANTI-PATTERNS (what the critics flag — don't do these)
===============================================================================
C1. THE HARD BRICK WALL: gating a whole quest/chain behind one un-passable check that stops the
   narrative dead (the #1 Disco complaint). RULE: failure routes, never dead-ends (A3).
C2. THE OBVIOUS BEST CHOICE: a "correct" solution that's just more-complicated-but-better (Outer
   Worlds' flaw). RULE: every route costs something (A2).
C3. THE DIALOGUE WHEEL ILLUSION: Yes/No/Sarcastic all leading to "go here, kill raiders" (Fallout
   4's flaw, per NeoGAF). RULE: options must lead to genuinely different DOING, not reskinned same.
C4. REACTIVITY BAIT-AND-SWITCH: strong reactivity early that decays to nothing (BG3 critique).
   RULE: fewer deep remembered threads > many shallow ones (A10).
C5. SAVE-SCUM-INDUCING RANDOM CHECKS: %-chance checks that reward reloading (Fallout 3 flaw). NV's
   FIXED-point checks felt better in a video game. RULE: our Dead-Eye dial is skill not RNG — keep
   social/quest gates deterministic on stats/flags, not dice, to avoid save-scum feel.
C6. FLATTENING THE WRONGED: humanizing a villain so hard the victim vanishes (Baron critique).
   RULE: give the wronged a real voice (A12).
C7. MANDATORY BETRAYAL WITH NO OUT: NV's forced "wipe out the Brotherhood" with no persuade/lie
   option, no alt-ending for the side you allied with (Legacy of Games complaint). RULE: don't
   force a player into an out-of-character mandatory act with no skill/faction escape hatch.

===============================================================================
## D — HOW THIS FEEDS THE BIBLE (integration)
===============================================================================
- The 12 CRAFT LAWS (Part A) become a PRODUCTION CHECKLIST: before any quest ships, pass it
  against A1 (3+ real solutions), A2 (no free route), A3 (failure routes not walls), A5 (pacing
  shape noted), A10 (reactivity we'll actually pay off), A12 (wronged have a voice).
- The STEAL TABLE (Part B) adds 7 vetted shapes to the vault's existing ~95 rows.
- The ANTI-PATTERNS (Part C) become a REGRESSION GATE: any quest matching an anti-pattern gets
  flagged and reworked.
- Confirms our existing spine is RIGHT: our fold/precedent = A6 delayed consequence; our
  Megaton = A2 no-right-answer; our infrastructure quests = B2; our Amalgamation = A8 mirror +
  A9 letting-go thesis. The research VALIDATES the architecture and sharpens the execution.
- NEXT: fold Part A's checklist into BOHEMIA_QUEST_PRODUCTION_LAW; re-audit the 53 existing
  quests against Part C anti-patterns on Paolo's word (not now).

## SOURCES (for re-pull / deeper dives)
Fallout Community Writing Guide (fallout.wiki/wiki/Community:Fallout_Writing_Guide) — the single
richest craft doc found; DualShockers "10 Reasons NV Gold Standard"; TVTropes Analysis/
FalloutNewVegas ("letting go"); Wikipedia + Kotaku "The Bloody Baron" (Sasko GDC 2017 pacing-
graph, two-team process); Disco Elysium: gameplayreflections "Meaning of Failure", Forst Stories,
Game Design Thinking, Gabriel Chauri (skills-as-characters, failure-as-branch); MS Source on
Obsidian "conversation gameplay"; RPGHQ + RPG Codex (reactivity cost/tooling reality); NeoGAF
(NV alt-solutions, F4 dialogue-wheel critique). Deeper future pulls: the actual Sasko GDC 2017
talk video; a Chris Avellone quest-design interview; the Alpha Protocol reactivity postmortem.

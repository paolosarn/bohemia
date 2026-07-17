# BOHEMIA QUESTBOOK #130 — "PARANOIA / GLARTHIR"
**Game:** The Elder Scrolls IV: Oblivion (2006)
**Studio:** Bethesda Game Studios
**Quest:** A wood elf pays you to surveil three neighbors he believes are conspiring against him. They aren't. What you REPORT decides who dies — and the quest's entire moral machinery runs on the fact that the client will believe whatever you say.
**Type:** INDIVIDUAL-QUEST DEEP DIVE — FORMAT v2. Mined from the whole-game pool.
**Filed:** 7/16/26

---

## 0 CORE IDEA

**The quest hands you a broken instrument — a paranoid man's trust — and grades you on nothing but what you choose to play on it.**

Glarthir approaches at midnight behind the chapel: whispers, gold, a job. Follow Bernadette Peneles. Then Toutius Sextius. Then Davide Surilie. Report each dawn. The surveillance is REAL GAMEPLAY — trailing schedules, watching windows — and it discovers, each time, nothing. They're gardening. They're shopping. They're living.

Then the mechanism bares itself: **your report is the only reality Glarthir has.** Tell him the truth (innocent) and his suspicion may slide to YOU — too many "innocents" and you join the conspiracy in his ledger. Confirm his fears and he escalates: a death list, payment for murders, or — if you refuse the list — he comes for you with an axe. Or report him to the guard and watch the Watch handle a sick man the way watches do. Or take his gold, tell him everything's fine, and manage a madman indefinitely for profit.

**The corpus needs this file because it is the purest CLIENT-EPISTEMOLOGY quest ever shipped: the quest-giver's model of reality is player-writable, and every write has a body attached.**

The life lesson underneath: **the most dangerous thing you can hand another person is confirmation.**

---

## 1 CAST + WHAT EACH ONE WANTS

**GLARTHIR** — wants the conspiracy CONFIRMED — not disproven, confirmed; the fear has become the frame, and every datum feeds it. Will trade: gold, escalating. Will never say: doubt about the premise; doubt gets reassigned to the doubter. FUNCTION: the client as unreliable instrument — the quest's real terrain is inside his head, and your reports are the only road in.
**BERNADETTE / TOUTIUS / DAVIDE** — want to garden, shop, and run a vineyard, respectively. Innocent to the pixel. FUNCTION: the stakes — three lives whose continuation depends on your paperwork.
**THE SKINGRAD GUARD (Captain Dion)** — wants public order; will handle Glarthir if told, with guard-grade nuance (badly, terminally, if it comes to the axe). FUNCTION: the institutional exit — available, blunt, and honest about what institutions do with the frightening ill.
**THE PLAYER** — wants... the quest never assumes: gold, truth, safety, or entertainment. FUNCTION: the pen in a paranoid man's ledger.

## 2 FULL EVENT FLOW (STAGE BY STAGE)

STAGE 0 — THE APPROACH: rumors first (townsfolk flag him as odd); then the note; then midnight behind the chapel. The quest auditions YOU — arrive and you've accepted the frame enough to stand in it.
STAGE 1-3 — THE TAILS: three surveillance jobs, one per target, each a real schedule-following exercise, each discovering mundane life. The gameplay TEACHES the truth before any report node asks what you'll do with it.
STAGE 4 — THE REPORTS: each dawn, the fork — innocent or guilty — and Glarthir's ledger updates. Innocents accumulate suspicion toward YOU; guilties accumulate a death list.
STAGE 5A — THE LIST: all three "confirmed" -> he hands you names and payment terms for three murders. Accept (and do them, or fake them — no, they must die; the game checks), refuse (he attacks you, axe, midnight), or expose him.
STAGE 5B — THE TURN: too much truth -> YOU'RE in the conspiracy; he attacks or spirals per state.
STAGE 5C — THE GUARD: report at any point -> Dion handles it; if Glarthir has gone violent, "handling" is a sword.
STAGE 6 — SETTLED STATES: three innocents alive and a dead or jailed or managed madman, in some combination the player authored, plus gold proportional to how long the meter was fed.

## 3 THE CONVERSATIONS (THE ACTUAL MACHINE)

NODE: CHAPEL_MIDNIGHT — entry: the note followed
  > "Who's watching you?"            [gate: none] -> G_EVERYONE — the roster; the certainty; the gold
  > "You need a healer, not a spy."  [gate: none] TRAP-OF-HONESTY -> G_RECOIL — early truth closes the quest's interior; he finds another instrument or worse. THE FINDING: THE HELP-VERB FIRES BLANKS AT PARANOIA — the honest sentence is not wrong, it is USELESS, and the quest prices the difference.
  > (take the gold)                  [gate: none] -> the tails begin
  NOVERB: "What if you're wrong?" — THE HYPOTHESIS IS UNHOSTABLE. His frame has no slot for it; the dialogue simply lacks the node, because HE lacks the node. INTERFACE AS PSYCHOLOGY (cf. Q98's procedural composure): the option list IS the character's epistemology. Bank as the file's core: WRITE THE CLIENT'S DIALOGUE OPTIONS FROM INSIDE THEIR MODEL.

NODE: THE_REPORT — each dawn, entry: tail complete
  > "She's innocent. It's gardening." [gate: knows:the_truth] TRUTH-AS-RISK -> his ledger moves — toward doubt of YOU, not of the premise. Truth spends YOUR credibility, not his theory's.
  > "You were right. She's in on it."  [gate: none] LIE-AS-FUEL -> gold now, a name on a list later. The lie is FRICTIONLESS at point of sale; the invoice arrives in stage 5A with an axe or a contract.
  > "I need more time."                [gate: none] STALL -> the meter holds; the madman is MANAGEABLE, indefinitely, for anyone willing to make a client of him. THE THIRD OPTION IS THE DARKEST: maintenance. Nobody dies and nothing heals and the gold keeps coming.

NODE: THE_LIST — entry: three confirmations
  > (take the contract)     [gate: none] -> three innocent-murders, paid; the karma system notices THESE (the meter that slept through Tenpenny wakes for retail murder — bank the inconsistency)
  > "No. This ends."        [gate: none] -> the axe at midnight; self-defense as the quest's forced closer
  > (to the guard)          [gate: none] -> Dion's sword or cell; the institution's mercy has exactly the granularity institutions have

## 4 THE BRANCH MAP

COUNT: 6 stable exits — (all-innocent -> turned on you) / (mixed -> partial list) / (all-guilty -> contract accepted) / (contract refused -> axe) / (guard, early -> managed) / (guard, late -> killed) — × the stall-state (indefinite maintenance) that most players never realize is a branch.
THE MAP'S FINDING: every exit is authored by REPORTS, not deeds — the player never once has to touch a weapon to kill three people; the pen does it at one remove. INSTRUMENTED HARM: the corpus's cleanest demonstration that information delivery is a weapon system (cf. Q9's editorial choice, Q129's meter-deafness — the trilogy is complete: which sentence he lives inside, which stamp you believe, and now WHOSE REALITY YOU WRITE).

## 5 HONEST FLAWS (BANKED)

F1 — THE TARGETS ARE CERTIFIED INNOCENT. The game never permits the tails to find ANYTHING ambiguous; the player's knowledge is total, which makes the lie-branch pure villainy instead of judgment under uncertainty. LAW: the surveillance should find ONE genuinely odd datum per target — writable either way — so confirmation becomes interpretation, not fabrication.
F2 — GLARTHIR'S ILLNESS IS A MONSTER COSTUME. The quest uses paranoia as a plot engine and exits through an axe; no branch models care beyond the guard's blade. Period-typical, banked as such, not excused.
F3 — THE STALL BRANCH IS INVISIBLE. Indefinite management — the most interesting exit — is undiscoverable except by accident; no rumor, no node names it.
F4 — THE KARMA WAKES INCONSISTENTLY (see node note): sleeping through brokered massacres elsewhere, alert to these retail ones. The meter's selective hearing, exhibit N.
F5 — THE TAILS ARE MECHANICALLY THIN. Following schedules in Oblivion is walking slowly behind a pathing NPC; the surveillance fantasy outruns its verbs.
F6 — TRUTH'S COST IS UNDER-TELEGRAPHED. That honest reports move suspicion onto YOU is discoverable only by suffering it; one in-world hint exists (townsfolk warnings), thin.
F7 — THE GUARD EXIT IS TOO CHEAP. One sentence to Dion closes the whole machine at any point; the institutional door has no toll (cf. Q126 F7's four-bypass gate).
F8 — NO NEIGHBOR EVER NOTICES THE TAIL. Three days of being followed by an armored stranger registers with no one; the watched world doesn't watch back.
F9 — THE GOLD CURVE REWARDS FEEDING THE FEAR. Payment scales with confirmations; the economy editorializes toward the lie (reward-gradient law, Q121's corollary, violated here in the WRONG direction on purpose or not — undecidable, banked).
F10 — AFTERMATH IS A ZERO. Whoever dies, Skingrad resumes; no funeral, no gossip-state, no guard-log entry readable later. The town has no memory organ (the anti-Fold).

## 6 WHY IT WORKS (W1–W10)

W1. **THE CLIENT'S REALITY IS PLAYER-WRITABLE.** Reports are writes to a man's world-model, and the model has a body count. No quest in the corpus makes the pen this literal.
W2. **THE GAMEPLAY TEACHES THE TRUTH BEFORE THE FORK ASKS.** You WATCH the innocence for three days before any node lets you deny it — the tails are the evidence; the reports are the confession.
W3. **TRUTH COSTS THE TRUTH-TELLER.** Honest reports spend your standing in his ledger, not his theory's. The corpus's cleanest model of why people stop correcting the paranoid: correction is expensive and billed to the corrector.
W4. **THE LIE IS FRICTIONLESS AT POINT OF SALE.** Confirmation costs one dialogue click and pays gold; the invoice arrives days later with names on it. Fear-feeding priced exactly like real life: cheap now, catastrophic on delivery.
W5. **MAINTENANCE IS A BRANCH.** The stall — managing a sick man forever for coin, curing nothing, killing no one — is the quest's darkest mirror and it's just... available, unmarked, indefinitely.
W6. **THE HYPOTHESIS HAS NO NODE.** "What if you're wrong" is absent because HE has no slot for it; the option list is a psychograph. Interface as the client's mind.
W7. **THE HELP-VERB FIRES BLANKS.** "You need a healer" is true, kind, and useless — the quest lets decency be correct and ineffective at once, which almost nothing in the medium permits.
W8. **THE INSTITUTION'S MERCY HAS INSTITUTIONAL GRANULARITY.** The guard exit works and is exactly as gentle as a city watch gets: the honest price of outsourcing a sick man to public order.
W9. **THE MIDNIGHT STAGING IS THE DIAGNOSIS.** Chapel shadows, passed notes, dawn drops — the quest wraps you in the paranoid's dramaturgy until following his stagecraft feels like procedure. Form as contagion.
W10. **NOBODY HAS TO DIE AND SOMEONE USUALLY DOES.** Every corpse in every branch is optional and authored; the quest's violence is 100% player-written through an intermediary who believes you. Responsibility with one layer of laundering — and the laundering is the lesson.

## 7 BOHEMIA PORTS

### PORT 1 — THE CLIENT WHOSE REALITY YOU WRITE [core]
**System:** dialogue spec / conscience / the 13 factions
One Bohemia client per act whose world-model is the actual quest terrain: reports write to their beliefs, beliefs write to their deeds, and the .bq models it as a visible-to-Claude, invisible-to-player LEDGER (@MODEL lines on the client: what they now believe, updated per report). F1's fix built in: every surveillance finds ONE ambiguous datum, honestly writable either way — confirmation becomes interpretation. [PENDING, Paolo's call.]
### PORT 2 — TRUTH BILLED TO THE TELLER [W3]
The Fold tracks a per-NPC CREDIBILITY line: honest corrections of a motivated believer SPEND it. Bohemia makes the real-world economics of truth-telling mechanical — and never editorializes about it.
### PORT 3 — THE MAINTENANCE BRANCH, NAMED [W5, F3 fixed]
The stall-state gets one discovery hook (a townsperson: "he's had 'investigators' before, you know") so the darkest branch is findable. The Fold logs maintenance income under its own heading. The ledger calls it what it is; no one else does.
### PORT 4 — THE WATCHED WORLD WATCHES BACK [F8 fixed]
Bohemia's tails have counter-surveillance: targets notice on a schedule; being seen following writes ITS own consequences. Surveillance becomes a two-ledger game — direct feed for the occupancy/schedule plumbing already in the engine.
### PORT 5 — THE AMALGAMATION AS GLARTHIR AT SCALE [the lore port]
The NETWORK's threat-model is a paranoid client with infrastructure: it pays (in access, in power) for CONFIRMATIONS of threats to itself, and the dynast's reports write to a machine's world-model with a city attached. The Q130 machine, industrialized: what the Amalgamation believes about the settlement is partly player-authored, and the axe it eventually swings was loaded one report at a time. [PENDING, Paolo's call — this is an Act-2/3 spine candidate.]

## SOURCES
- Elder Scrolls Wiki / UESP: Paranoia — full branch table, the suspicion mechanics per report, the death list, the axe trigger, the guard resolution. `https://en.uesp.net/wiki/Oblivion:Paranoia`
- Two decades of community canon: the quest's fixture status on best-sidequest lists; the stall-branch obscurity (F3); the illness-as-engine critique (F2). FUTURE DEEPER PULL: the strongest modern retrospective treatments, pro and con, for the F2 file.
- FUTURE DEEPER PULLS: (1) the exact suspicion-accumulation table (how many truths turn him) for PORT 1's model math. (2) Skingrad NPC schedules as the surveillance content spec. (3) Sibling candidate: the Dark Brotherhood's "Following a Lead" (paranoia from the institution's side).

---
*END #130*

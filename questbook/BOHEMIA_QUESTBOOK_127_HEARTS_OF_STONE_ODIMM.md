# BOHEMIA QUESTBOOK #127 — "HEARTS OF STONE / O'DIMM'S PACT"
**Game:** The Witcher 3: Hearts of Stone (2015)
**Studio:** CD Projekt Red
**Quest:** The expansion's spine: Olgierd von Everec sold his heart to Gaunter O'Dimm; Geralt is conscripted as the collector's errand-boy for three impossible wishes, and the finale is a choice between letting the devil collect and playing him at riddles for a soul that may not deserve saving.
**Type:** INDIVIDUAL-QUEST DEEP DIVE — FORMAT v2. Mined from the whole-game pool.
**Filed:** 7/16/26

---

## 0 CORE IDEA

**The devil here never lies, never cheats, and never hurries — he just reads contracts literally and lets human wishes do the killing.**

Where #126's Raphael is a buyer, O'Dimm is an ENFORCER. He is not tempting Olgierd; that happened years ago. The quest you play is the SERVICING of an old debt: Olgierd, immortal and numb, sets three impossible tasks to stall collection, and Geralt — bound to O'Dimm by his own smaller debt — must fulfill them. Bring the house of Everec fun like Vlodimir knew. Get Maximilian Borsodi's house. Fetch the violet rose.

Each wish is a monkey's paw the WISHER loaded himself: the fun ends with a dead man's ghost tasting life through your body and refusing to leave; the "house" of Borsodi is a heist that ends in fratricide; the rose belongs to a wife Olgierd loved into ruin, kept as a memory-ghost in a painted world.

**And the second idea, the one the whole file exists for: the immortality is the punishment.** Olgierd's heart of stone was the CONTRACT WORKING AS WRITTEN — he wished away pain and got numbness; nothing satisfies, nothing wounds, nothing matters. The devil didn't twist the wish. He honored it.

The life lesson underneath, never spoken: **you do not need to be cheated to lose everything. You just need to get exactly what you asked for.**

---

## 1 CAST + WHAT EACH ONE WANTS

**GAUNTER O'DIMM (Master Mirror)** — wants Olgierd's soul, on schedule, per the contract's terms — collection "on the moon" (which, being O'Dimm, exists: a mosaic on a floor). Will trade: rescue, information, patience. Will never say: what he is; every guess (devil, djinn, worse) is left standing. FUNCTION: the collector who wins by literalism — his power is reading what you signed.

**OLGIERD VON EVEREC** — wanted his love and his fortune back; paid with the capacity to care about either. Now wants... the wanting itself back, and can't. Will trade: impossible tasks as stalling. Will never say: that he knows he deserves collection; the numbness has eaten even his guilt. FUNCTION: the debtor as cautionary exhibit — the quest walks you through the wreckage his granted wishes made.

**VLODIMIR VON EVEREC (ghost)** — wants ONE NIGHT of life, borrowed through Geralt's body at a wedding. Will not leave when it ends. FUNCTION: wish one's payload — appetite without a body, the brother who shows what the Everecs were.

**SHANI** — wants a nice wedding and gets a haunted witcher. FUNCTION: the warm center wish one endangers; the human cost of a ghost's fun.

**IRIS VON EVEREC (memory/ghost)** — wanted her husband back the whole time he sat in her house not-caring. Lives now in a painted world assembled from her worst days. Will trade: the rose — but taking it means she must LET GO of the last thing anchoring her. FUNCTION: wish three's toll — the quest's kindest cruelty: freeing her requires convincing her to stop existing as she is.

**THE CARETAKER** — wants to garden. The garden is worse than that. FUNCTION: the pact's groundskeeping — evidence that O'Dimm's contracts staff themselves.

## 2 FULL EVENT FLOW (STAGE BY STAGE)

STAGE 0 — GERALT'S OWN DEBT [MANDATORY]: O'Dimm saves Geralt (brand on the face, terms accepted in a dungeon hold). The player enters the story ALREADY SIGNED — smaller print, same pen. Exit: serve as collector's proxy.
STAGE 1 — THE WEDDING (wish one) [MANDATORY, the tonal trap]: Vlodimir possesses Geralt for one night at Shani's friend's wedding. Comedy, romance, a genuinely good time — and then he won't leave, and O'Dimm evicts him with a word, mid-sentence, like turning off a tap. The fun was real AND it was a demonstration of who holds every leash.
STAGE 2 — THE HEIST (wish two) [MANDATORY, multi-approach]: the Borsodi auction house job. Crew assembly, vault, and the reveal: "his house" means the family fortune, and the wish resolves in a brother killing a brother while Geralt holds the door. The wish's grammar was Olgierd's revenge, notarized.
STAGE 3 — THE ROSE (wish three) [MANDATORY, the masterpiece]: the Everec estate; Iris's painted world; her memories staged as playable dioramas of a marriage rotting under a granted wish. The rose is hers; taking it is her release or her erasure, and the quest makes you ask her.
STAGE 4 — COLLECTION [MANDATORY]: the mosaic moon. O'Dimm arrives to collect. THE FORK: let him take Olgierd, or challenge — and the challenge is not combat, it's a RIDDLE in a pocket dimension where the answer is diegetic (the mirror shatters the pretense: his name was the hint all along).
STAGE 5 — AFTER: save Olgierd and he hands you the family saber and walks off changed and hollowed toward maybe-humanity; let O'Dimm collect and the devil pays a wish — precisely worded, safely modest if you're wise — and tips his hat.

## 3 THE CONVERSATIONS (THE ACTUAL MACHINE)

NODE: ODIMM_TERMS — the crossroads, entry: Geralt branded
  He explains the arrangement with the patience of a man who has never once been in a hurry.
  > "What are you?"                [gate: none] -> O_DEFLECT ("a mirror merchant") — the question is answered with merchandise
  > "And if I refuse?"             [gate: none] -> O_CALM — no threat; a reminder of terms already accepted. THE REGISTER: he never menaces, because the paperwork already did.
  > (study the brand)              [gate: none] SILENCE -> he waits. He always waits.
  NOVERB: "I'll pay you off." — THE DEBT HAS NO CASH EQUIVALENT. Cross-ref Q108 (the favor with no market): 2nd confirmation — the corpus's strongest debts are the ones money cannot touch.

NODE: IRIS_ASK — the painted world's end, entry: rose found
  She holds the rose. Taking it unmakes her tableau.
  > "Come with me. Leave this place."     [gate: none] -> I_CANNOT — the rescue verb offered and DECLINED BY THE WORLD (cf. rescue-denial register): she is made of this place now
  > "Give me the rose. It's time."        [gate: knows:her_story (the dioramas walked)] -> she yields it AWAKE — release as informed consent
  > (take it from her hand)               [gate: none] TRAP -> it works; she fades confused; the quest completes and something in it is broken forever, unscored
  NOVERB: "He still loves you." — THE COMFORTING LIE ABOUT OLGIERD IS NOT AVAILABLE. The stone heart cannot be spoken around. NO COMFORT VERBS (Q126 PORT 7), 4th confirmation.

NODE: THE_COLLECTION — the mosaic, entry: tasks done
  > "Take him. A deal's a deal."        [gate: none] -> B1. O'Dimm collects; then offers YOUR wish. The sub-node is a WORDING MINEFIELD: ask big and the grammar will eat you; the safe answers are modest and exact. THE DEVIL'S REWARD IS A LITERACY TEST.
  > "I challenge you for his soul."     [gate: none] -> THE RIDDLE. Failure = forfeit everything. Victory condition is COMPREHENSION (the mirror, the name, the world's hints) — not stats, not swordplay. COMPREHENSION IS A BRANCH, 9th confirmation, adversarial form: the final boss is a reading test.
  NOVERB: "Let's renegotiate the contract." — THE TERMS DO NOT MOVE. Cross-ref Q126 OFFER_NEED (haggling as trap): with O'Dimm the haggle option doesn't even exist. The two devils bracket the design space: Raphael amused by haggling, O'Dimm beyond its reach.

## 4 THE BRANCH MAP

COUNT: 2 terminal × the Iris sub-state × the wish-wording sub-branch.
B1 — COLLECTED: Olgierd's soul taken; Geralt's precisely-worded wish granted; O'Dimm remains at large in the world, humming. WRITES: odimm_free.
B2 — THE RIDDLE WON: Olgierd saved, hollow, handed back a life he must relearn wanting; O'Dimm banished (not destroyed — the difference is left deliberately open). WRITES: olgierd_saved.
B2x — IRIS RELEASED AWAKE vs TAKEN CONFUSED: no mechanical delta; the difference is entirely in what the player did and knows. (COMPREHENSION branch, moral form — cf. Q120.)

## 5 HONEST FLAWS (BANKED)

F1 — THE RIDDLE IS FAMOUSLY EASY. The finale's puzzle is solvable in seconds by most players (community consensus since release); the devil's checkmate resolves as a light stroll. LAW: if the final gate is comprehension, the comprehension must have been PAID FOR — the answer should require the expansion's full attention, not the room's.
F2 — GERALT'S OWN PACT IS UNDER-PRICED. The brand that starts everything costs Geralt nothing on either branch; the proxy's debt evaporates unexamined. LAW: the messenger's contract needs its own line-item.
F3 — WISH TWO IS A DIFFERENT GENRE. The heist is excellent AND tonally adrift from wishes one and three; the middle act is a caper wedged between a ghost story and a tragedy. Bank as a scoping note, not a sin: anthology quests must decide if variety is the point.
F4 — THE WEDDING'S CONSENT PROBLEM IS PLAYED FOR LAUGHS. Vlodimir pilots Geralt's body around Shani all night; the quest winks. Players noticed. LAW: possession-as-comedy needs the possessed's ledger acknowledged at least once.
F5 — IRIS'S WORLD IS SKIPPABLE AT SPEED. The dioramas (the expansion's heart) can be sprinted; the finale then asks about a marriage the player didn't watch. Theme-in-optional's cousin: THEME-IN-PACING.
F6 — O'DIMM'S DEFEAT IS OPTIONAL CANON. Banishing him changes nothing visible in the world after; the strongest antagonist in the franchise exits without residue on either branch. LAW: even a banished devil should leave a paperwork trail.
F7 — THE SABER IS A LOOT-SHAPED GOODBYE. Olgierd's parting gift converts the tragedy's final beat into an inventory event (cf. Q125 F6's model-ship problem, softer).
F8 — THE WISH MINEFIELD IS UNTELEGRAPHED ASYMMETRICALLY. Some "safe" wishes are only safe per wiki; blind players get grammar-punished for generosity. LAW: literalism traps must teach their grammar in-world first (O'Dimm does — but only if you listened; borderline, banked).
F9 — SHANI'S ARC IS A ROMANCE SIDECAR ON A DAMNATION STORY. Warm, well-written, and structurally a cul-de-sac the finale ignores.
F10 — THE MOON CLAUSE RESOLVES AS A PUN. The unbreakable contract's escape hinge is a floor mosaic; some players read genius, some read groan. Bank both: THE PUN CLAUSE divides rooms and that division is a tone choice, not an error.

## 6 WHY IT WORKS (W1–W10)

W1. **THE DEVIL IS A LITERALIST, NOT A LIAR.** Every catastrophe in the expansion is a wish working exactly as worded. O'Dimm's terror is grammatical — he is what happens when the universe has a legal department. Paired with #126's honest buyer: the corpus now holds both honest devils, and neither ever needs to lie.
W2. **THE IMMORTALITY IS THE PUNISHMENT.** Olgierd got everything back and the caring removed — the contract's cost was delivered INSIDE its benefit. The monkey's paw with no visible twist: the wish was the curse, whole and entire.
W3. **THE THREE WISHES ARE THREE AUTOPSIES.** Fun (the brother), fortune (the feud), love (the wife): each task tours a thing Olgierd already destroyed by wishing. The fetch list is a guided walk through the debtor's wreckage.
W4. **THE GHOST WON'T LEAVE WHEN THE PARTY ENDS.** Vlodimir's one night curdles in real time — appetite outliving its allotment is the whole Everec family in one beat, and O'Dimm's one-word eviction shows the leash without raising the voice.
W5. **THE PAINTED WORLD IS A MARRIAGE'S FILE FORMAT.** Iris's memories as walkable dioramas: the quest stores a relationship as LEVELS. The corpus's best staging of [READ]-as-space since Q124's descent — and here the archive is a person who must consent to being closed.
W6. **THE RELEASE REQUIRES HER YES.** The rose can be taken, but the quest's true version asks Iris to let go — informed, awake, on her own terms. Pre-consented truth (Q119) inverted into pre-consented ENDING.
W7. **THE FINAL BOSS IS A READING TEST.** No sword touches O'Dimm. The challenge is riddle and recognition — the player wins by having paid attention to the world's whispers. Comprehension as combat, the questbook's thesis given a boss slot.
W8. **THE REWARD IS A WORDING PROBLEM.** Win the safe branch and O'Dimm grants YOUR wish — and the scene is a literacy exam where ambition is the trap. The quest ends by making the player draft a contract opposite a literalist. Nothing in the corpus prices language higher.
W9. **THE COLLECTOR ALWAYS WAITED.** O'Dimm never chases, never presses, never arrives early. Patience as omnipotence: the scariest thing a power can do is be comfortable with your schedule (cf. Q126 W3's unexpiring offer — the two patience designs bracket temptation and enforcement).
W10. **BOTH ENDINGS COST THE SAME MAN DIFFERENTLY.** Collected, Olgierd pays with his soul; saved, he pays by having to live as someone who did all of it and now feels again. The rescue is not a refund. The corpus's cleanest NO-CLEAN-SURFACE finale this side of Q124.

## 7 BOHEMIA PORTS

### PORT 1 — THE LITERALIST COUNTERPARTY [W1, W8]
**System:** the Amalgamation / NETWORK contracts / .bq
The Amalgamation already IS O'Dimm's filing cabinet: uploads are contracts whose grammar outlives their signers. Bohemia's version: one NETWORK contract per act whose harm is entirely in its wording, honored perfectly. The .bq gains a @CLAUSE line for contract quests — the text of the deal is content, displayed verbatim, and the quest's solution is IN the wording. [PENDING, Paolo's call.]
### PORT 2 — THE WISH THAT WORKED [W2]
A dynast-adjacent figure who got EXACTLY what they asked the NETWORK for, and the getting is the ruin. No twist, no glitch: the request, honored. The Amalgamation's best horror is customer satisfaction. Cross-ref Q115 (the comforting lie): the pair covers both failure modes — the lie that recruits, and the truth that delivers.
### PORT 3 — THE ARCHIVE THAT MUST CONSENT TO CLOSE [W5, W6]
An Amalgamation memory-space (a dead person's rendered world) that the dynast must enter, walk, and then ask its inhabitant to let go of. Release requires the ghost's informed yes; taking the objective by force works and breaks something unscored. The Fold records WHICH way it went (cf. Q126 PORT 10's freely-given crown).
### PORT 4 — THE PROXY'S BRAND [F2 fixed]
If the dynast runs errands for a power, the dynast's own debt gets a ledger line and a due date. Bohemia prices the messenger.
### PORT 5 — THE READING-TEST BOSS [W7, F1 fixed]
One Act-3 confrontation with no combat resolution: the win condition is comprehension banked across the whole act, and the gate is EXPENSIVE (F1's fix: the answer requires the act's full attention, validator-checked against its knows: chain). Cross-ref Q111 (ungateable-by-format): this one IS gateable — a chain of knows: flags the player assembled by playing.

## SOURCES
- Witcher Wiki (Fandom): Hearts of Stone main quests — Evil's Soft First Touches; Dead Man's Party; Open Sesame; Scenes From a Marriage; Whatsoever a Man Soweth. Full flow, both endings, the wish sub-branch. `https://witcher.fandom.com/wiki/Hearts_of_Stone_expansion`
- Community criticism (Steam/Reddit consensus, banked since 2015): the riddle's easiness (F1), the wish-wording wiki-dependence (F8), Vlodimir/Shani consent discourse (F4). FUTURE DEEPER PULL: assemble the strongest single threads for each.
- CDPR interviews on O'Dimm's design (the "no combat finale" intent). FUTURE DEEPER PULL: primary quotes for W7's design-intent claim.
- FUTURE DEEPER PULLS: (1) Iris's diorama sequence, beat-by-beat, for PORT 3's build spec. (2) The full safe/unsafe wish table for PORT 1's grammar. (3) Scenes From a Marriage as [READ]-space level design — its own file candidate.

---
*END #127*

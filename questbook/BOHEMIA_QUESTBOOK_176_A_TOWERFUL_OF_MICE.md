# BOHEMIA QUESTBOOK #176 — "A TOWERFUL OF MICE (THE TRUTH OR THE MERCY, TO A GHOST)"
**Game:** The Witcher 3: Wild Hunt (2015)
**Studio:** CD Projekt Red
**Quest:** A Towerful of Mice — an island cursed by a massacre. A steward's daughter's ghost haunts a ruined tower where refugees were left to die and turned on each other; the player uncovers what really happened and must decide whether to tell her spirit the terrible truth or a comforting lie to end the curse.
**Type:** INDIVIDUAL-QUEST DEEP DIVE (mined fresh 7/17 from the Witcher catalogue; corpus anchor Q1/Q4 for the game's larger machines)
**FORMAT:** v2 — cast + conversation node trees + branch map.
**Filed:** 7/17/26
**Why pulled:** Bohemia's recorded-vs-unrecorded truth and its rescue-denial register need the model of a quest where lifting a curse means choosing between the honest horror and the merciful lie — and the choice determines who lives. A Towerful of Mice is the specimen: a massacre buried under a ghost's false memory, a truth that will shatter her, a lie that will comfort her, and a curse that resolves differently depending on which the player gives — with a life on the outcome. It is the honest-loss-vs-comforting-lie of #34/#173, the truth-delivery grid (our staged law), and the "what do you owe the dead: the truth or peace" question our whole thesis circles.

---

## 0 CORE IDEA

**An island is cursed by a buried massacre — refugees abandoned in a tower, starved, who turned on each other — and the ghost of the man's daughter haunts it, believing a false version; lifting the curse means telling her spirit either the shattering truth or a merciful lie, and which the player chooses decides who walks off the island alive.**

Off the coast, a plague once came, and a lord sealed the infected refugees in a tower on an island to contain it — then left them there. They starved. They turned on each other. The rats came, and worse. And the lord's steward, or his daughter Annabelle, died in the horror, cursed by the dying in their last moments. Now the island is haunted: Annabelle's ghost lingers, and her betrothed, who survived, has come back for her, unable to let her go. The player, investigating the curse, uncovers what actually happened — the abandonment, the cannibalism, the betrayal — a truth far uglier than the romantic tragedy the survivors tell themselves. And the curse can only be lifted by speaking to Annabelle's spirit: with the TRUTH (that she and the refugees committed atrocities, that the horror was real and mutual) or with a LIE (a comforting version that lets her rest in a story she can bear).

The machine is that mercy and honesty are opposed, and a life hangs on the choice. The truth may shatter Annabelle's spirit into vengeance; the lie may let her rest but denies the dead their real story. And crucially, the outcome determines who survives: depending on whether the player tells the truth or the lie, the ghost's reaction can kill her waiting betrothed, or spare him, or curse the player. There is no reading where the honest and the merciful align — the quest forces the player to decide what they owe a ghost: the dignity of the truth, or the peace of a lie, knowing the choice will cost someone. It is the purest small-scale version of Bohemia's central tension: the dead have a real story, and the living want a bearable one, and you cannot always give both.

**The life lesson underneath, never spoken:** what you owe the dead — the ugly truth of what they did and suffered, or the merciful lie that lets them rest — is a choice with a cost, and there is no version where honesty and comfort are the same gift.

---

## 1 CAST + WHAT EACH ONE WANTS

### ANNABELLE'S GHOST — the spirit who believes a false version
- **What she wants:** her betrothed, her rest, and to remain the woman she believes she was.
- **What she'll trade:** the curse's end, for a truth or a lie she can hold.
- **What she will never say out loud:** what she really did in the tower; the false memory is the mercy she's given herself.
- **Function:** THE DEAD WITH A BURIED STORY: a ghost holding a comforting lie, offered the truth or another lie.

### THE BETROTHED — the living man who won't let go
- **What he wants:** Annabelle back, or peace; he has returned to the cursed island for a woman who is dead and worse.
- **What he'll trade:** his safety; his life is on the outcome of what the player tells her.
- **Function:** THE STAKE: the living cost of the choice — the truth or the lie decides whether he survives her reaction.

### THE MASSACRE — the buried truth
- The abandonment, the starvation, the cannibalism, the mutual betrayal in the tower.
- **Function:** THE REAL STORY the survivors buried under a romantic tragedy — the ugly truth the player uncovers.

### THE PLAYER (Geralt) — the one who decides what the dead are owed
- **What they want:** to lift the curse, and to choose what to tell the ghost.
- **Function:** THE JUDGE OF WHAT'S OWED: the one who weighs the dead's true story against the living's bearable one.

### THE CURSE — the horror demanding resolution
- The haunting born of the massacre and the dying's last words.
- **Function:** THE MACHINE that forces the choice: the curse ends only by speaking truth or lie to the spirit.

---

## 2 FULL EVENT FLOW (STAGE BY STAGE)

### STAGE 1 — THE CURSED ISLAND [MANDATORY]
The player comes to the haunted island, hired to lift the curse or drawn by the betrothed's grief.

### STAGE 2 — THE INVESTIGATION [MANDATORY]
Uncover what really happened: the sealed refugees, the starvation, the cannibalism, the betrayal — the ugly truth under the romantic story.

### STAGE 3 — THE GHOST [MANDATORY]
Annabelle's spirit, holding a false, bearable version of her death, appears; the curse resolves only by speaking to her.

### STAGE 4 — THE CHOICE [MANDATORY, forks]
Tell her the truth (shattering, honest) or a lie (comforting, false) — and the reaction decides who survives.

### STAGE 5 — THE COST [MANDATORY]
The curse lifts; the betrothed lives or dies; the player carries the choice of what they told the dead.

---

## 3 THE CONVERSATIONS (THE ACTUAL MACHINE)

### NODE Mi-1 — the buried truth uncovered. Entry: stage 2.
The evidence of what the tower really held.
> (read the massacre: abandonment, starvation, cannibalism) [gate: investigation] -> the ugly truth; far worse than the romantic tragedy the survivors tell
> (the betrothed's romantic version) [gate: none] -> the comforting story the living hold; a mercy that buries the dead's real story
WHAT THIS NODE COSTS: the player's ability to unknow it; once you have the truth, telling the ghost a lie is a choice, not an ignorance.

### NODE Mi-2 — Annabelle's ghost. Entry: stage 3-4. The spirit, offered truth or mercy.
The dead woman holding her bearable version.
> (tell her the truth) [gate: none] -> she is shattered; the honest horror may turn her to vengeance; the dead given their real story at a terrible price
> (tell her the comforting lie) [gate: none] -> she may rest; the mercy that denies the dead their truth; peace bought with a falsehood
> "What do I owe you — the truth, or peace?" [gate: none] -> THE ONE LINE DOING THE WORK: the choice named; there is no version where honesty and comfort are the same gift
NOVERB "Tell her a truth that also comforts" — the truth is a massacre; there is no honest version that is bearable. The removed verb is the quest's spine: mercy and honesty are opposed here, and the player must choose which the dead are owed.

### NODE Mi-3 — the cost. Entry: stage 5. The choice's price paid.
The curse resolving on the reaction.
> (the betrothed lives / dies on the reaction) [gate: truth or lie] -> the living cost of what was told the dead; a man spared or killed by the player's choice of story
> WHAT THIS NODE COSTS: someone, whichever way — the truth or the lie decides who walks off the island, and the player carries what they chose to give the ghost.

---

## 4 THE BRANCH MAP

**COUNT: 2 core outcomes — tell the truth or tell the lie — each resolving the curse differently and deciding whether the betrothed survives, with the player's foreknowledge of the real massacre making the lie a choice, not an ignorance.**

- **THE TRUTH:** Annabelle is told what really happened; her spirit shatters, may turn to vengeance; the curse resolves in horror; the betrothed may die of her reaction. WRITES: the dead given their real story; the honest horror; a life possibly lost to the truth.
- **THE LIE:** Annabelle is told a bearable version; she may rest; the curse resolves in false peace; the betrothed's fate turns on the mercy. WRITES: the dead denied their truth; the comforting falsehood; peace bought with a lie.
- **THE LIVING COST:** the betrothed's survival hangs on which story the player gives the ghost — the choice about the dead has a body among the living.
- **THE THROUGH-LINE:** the branch is truth-versus-mercy — two answers to "what do you owe the dead, honesty or peace," and the quest makes them opposed, with a life on the outcome, refusing to let them align.

---

## 5 HONEST FLAWS (BANKED)

**F1 — THE OUTCOMES AREN'T CLEANLY TIED TO THE TRUTH/LIE CHOICE.** The quest's resolution (who survives, how the curse ends) depends on a tangle of factors beyond the truth/lie decision, so the profound "the story you tell the dead decides who lives" clarity is muddied — a player can tell the truth and get a bad outcome for reasons unrelated to honesty, blurring the moral.
**LAW FOR BOHEMIA:** if a choice about the dead's story determines a living cost, the LINK must be legible — the truth or the lie clearly causing the outcome — so the player owns the consequence of what they chose to tell. A moral choice whose result is a tangle teaches nothing (the #26/#160 legible-consequence law).

**F2 — THE GHOST'S FALSE MEMORY ISN'T BUILT ENOUGH FOR THE TRUTH TO SHATTER.** Annabelle's comforting version of her death is stated more than shown, so telling her the truth lands as a plot beat rather than the shattering of a person's self-protective illusion; the player never really feels the mercy of the lie she's given herself, so breaking it costs less than it should.
**LAW FOR BOHEMIA:** a dead person's self-protective false memory must be BUILT — felt as the mercy they gave themselves — so that telling the truth is felt as shattering it. The lie the dead tell themselves must be shown as their comfort before it is broken (the #35/#159 show-the-illusion law).

**F3 — THE PLAYER'S OWN STAKE IS ABSENT.** The player decides what the dead are owed but has no personal relationship to Annabelle or the betrothed, so the choice is a judgment made from outside — the "what do you owe the dead" question would cut deeper if the dead were the player's own, not strangers on a contract.
**LAW FOR BOHEMIA:** the truth-or-mercy choice about the dead cuts deepest when the dead are the dynast's OWN — a bloodline's buried atrocity, an ancestor's false memory — so the question is personal, not a stranger's curse. The fold makes the dead the player's, which is where the choice belongs (the #158 specific-person law, applied to the dead).

---

## 6 WHY IT WORKS (W1-W10)

W1. MERCY AND HONESTY ARE OPPOSED. The truth shatters, the lie comforts, and there is no version where they align — the quest forces the player to choose which the dead are owed, refusing the easy fusion of the two.
W2. A LIFE HANGS ON THE STORY. The betrothed survives or dies on what the player tells the ghost — the choice about the dead has a living cost, so honesty and mercy are not abstractions.
W3. THE TRUTH IS A MASSACRE. The buried story is abandonment, starvation, cannibalism — far uglier than the romantic tragedy the survivors tell, so telling it is genuinely brutal.
W4. THE GHOST HOLDS A MERCIFUL LIE. Annabelle believes a bearable version — the false memory is the mercy she gave herself, and the player must decide whether to take it from her.
W5. THE PLAYER KNOWS TOO MUCH TO PRETEND. Once the massacre is uncovered, telling the ghost a lie is a choice, not an ignorance — the player owns the falsehood if they give it.
W6. THE CHOICE IS WHAT YOU OWE THE DEAD. Truth or peace — the quest's core question is Bohemia's central tension in miniature: the dead have a real story, the living want a bearable one, and you cannot always give both.
W7. THE CURSE FORCES THE RESOLUTION. The haunting ends only by speaking to the spirit — the player cannot avoid the choice; the mechanic demands they decide what to tell the dead.
W8. THE HORROR IS UNDER A ROMANCE. The survivors tell a love story; the truth is atrocity — the gap between the comforting narrative and the ugly fact is the recorded-vs-unrecorded truth (#26) in one island.
W9. THERE IS NO CLEAN OUTCOME. Truth or lie, someone pays — the quest refuses a resolution where everyone is served, which is what makes the choice real.
W10. IT IS THE THESIS IN A GHOST STORY. What survives when a life ends, and what do we owe the dead's story — Bohemia's whole spine, asked by a haunted tower and answered by whether the player tells a ghost the truth.

---

## 7 BOHEMIA PORTS

### PORT 1 — THE TRUTH OR THE MERCY, TO THE DEAD [W1, W6, W10 — the core port]
**System:** the Amalgamation / the fold / dialogue scenes
A Bohemia quest where resolving a haunting or an Amalgamation-fragment means telling the dead either the shattering TRUTH of what they did and suffered or a comforting LIE they can rest in — mercy and honesty opposed, with a living cost on the outcome. The recorded-vs-unrecorded truth (#26) and the honest-loss-vs-comforting-lie (#34/#173) as a ghost story; Bohemia's central question in one choice.
```
@TALK the_ghost speaker=annabelle entry=curse_resolution
  @SAY Tell me it was quick. Tell me they loved me at the end. Tell me I was not what the tower made me.
  @SAY I have held a kind story so long. If you know the true one, I will feel you choose which to give.
  @OPT (tell her the truth)               [gate: none] -> ghost_truth
  @OPT (tell her the comforting lie)        [gate: none] -> ghost_mercy
  @OPT "What do I owe you — truth or peace?" [gate: none] -> ghost_question
  @NOVERB "Tell her a truth that also comforts"
@END
```
**THE NOVERB IS THE PORT:** the truth is a massacre; no honest version is bearable; mercy and honesty are opposed. Liberate tends toward the honest truth borne; the comforting lie is its own cost. [PENDING, Paolo's call: the buried atrocity.]

### PORT 2 — THE STORY'S CONSEQUENCE IS LEGIBLE [F1's law]
**System:** the fold / dialogue scenes
If a choice about the dead's story determines a living cost, the LINK is legible — the truth or the lie clearly causing the outcome — so the dynast owns the consequence of what they chose to tell. A moral choice whose result is a tangle teaches nothing (#26/#160's legible-consequence law).

### PORT 3 — THE DEAD'S SELF-PROTECTIVE LIE IS BUILT [F2's law]
**System:** the Amalgamation / the fold / dialogue scenes
A dead person's self-protective false memory is BUILT — felt as the mercy they gave themselves — so telling the truth is felt as shattering it. The lie the dead tell themselves is shown as their comfort before it is broken (#35/#159's show-the-illusion law).

### PORT 4 — THE DEAD ARE THE DYNAST'S OWN [F3's law]
**System:** the fold / the ~100-year arc
The truth-or-mercy choice cuts deepest when the dead are the dynast's OWN — a bloodline's buried atrocity, an ancestor's false memory — so the question is personal, not a stranger's curse. The fold makes the dead the player's (#158's specific-person law, applied to the dead).

---

## SOURCES
Mined fresh 7/17 (Witcher catalogue; corpus anchors Q1/Q4 carry the game's larger machines):
- Witcher Wiki (Fandom) and Fextralife — A Towerful of Mice quest stages, the island, the sealed plague refugees, Annabelle's ghost and betrothed, the massacre/cannibalism truth, the truth/lie choice and its outcomes. `https://witcher.fandom.com/wiki/A_Towerful_of_Mice` / `https://thewitcher3.wiki.fextralife.com/A+Towerful+of+Mice`
- FUTURE DEEPER PULLS: (1) the exact outcomes tied to the truth/lie choice, for the legible-consequence analysis F1/PORT 2; (2) Annabelle's false-memory dialogue for the show-the-illusion source F2/PORT 3; (3) the historical massacre's details as the buried-atrocity material for PORT 1.

---
*END #176*

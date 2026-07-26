# BOHEMIA QUESTBOOK #136 — "THE LANDSMEET"
**Game:** Dragon Age: Origins (2009)
**Studio:** BioWare
**Quest:** The civil war's verdict is a parliamentary session: nobles vote aloud, one by one, on charges argued in real time — and every vote was purchased or lost WEEKS earlier by side quests the player didn't know were ballots. The finale can be won by evidence, lost by arrogance, settled by a duel, or thrown to a queen.
**Type:** INDIVIDUAL-QUEST DEEP DIVE — FORMAT v2. Mined from the pool (queued from Q132).
**Filed:** 7/16/26

---

## 0 CORE IDEA

**The boss fight is a roll-call vote, and the player walks in having already cast most of it without noticing.**

Ferelden's civil war ends in a room: the Landsmeet, the nobles assembled, Loghain — regent, war hero, betrayer at Ostagar — defending his rule against the Warden's charges. The session is a REAL DEBATE: accusations raised, rebuttals offered, and the assembled banns voting AUDIBLY, house by house, as the argument lands. And the votes were pre-purchased: rescued relatives, resolved kidnappings, exposed scandals, a queen freed from a tower — weeks of side content silently converted into parliamentary arithmetic. Walk in having done the homework and the room chants your name; walk in cold and eloquence alone cannot carry it.

Then the verdict's OWN fork: win the vote and Loghain can be executed, or — the series' most argued-about option — CONSCRIPTED into the Grey Wardens (the order his crime betrayed), which costs you Alistair, permanently, on the spot. Lose the vote and it goes to trial by combat — a duel you can fight yourself or delegate to a champion. And above all of it: Anora, Loghain's daughter, the sitting queen, negotiating her survival across every branch — the quest's true final boss is a woman who never draws a weapon.

The life lesson underneath: **power is counted before the meeting starts; the meeting is where you find out what you already spent.**

---

## 1 CAST + WHAT EACH ONE WANTS

**LOGHAIN** — wants Ferelden safe from Orlais and believes the Blight is the lesser war; his treason is strategy in his own ledger. Will trade: nothing until beaten; then, conscripted, everything — including dying the Warden death his crime desecrated. Will never say: regret in the room; he saves it for after. FUNCTION: the antagonist as the debate's co-equal — his rebuttals are ARGUMENTS, and some land.
**ANORA** — wants the throne she already runs; will side with whoever guarantees it, INCLUDING against her father, and will testify accordingly. Will never say: love or loyalty as bindings — she prices them like everything else. FUNCTION: the swing vote with a crown; the quest's cleanest operator (cf. Q125's admirals — she is all four in one person, and better at it).
**ALISTAIR** — wants Loghain DEAD, non-negotiably; the conscription option detonates him — he leaves the party, the story, everything, on the spot. FUNCTION: the companion whose red line is real — the corpus's most expensive single dialogue option.
**THE BANNS (the voting bench)** — want their own: a rescued son, a settled feud, an avenged scandal — each vote a household with a ledger the player may or may not have touched. FUNCTION: the electorate as side-quest archaeology.
**ARL EAMON** — wants the Theirin line restored; the session's convener and the player's parliamentary handler. FUNCTION: procedure's voice.
**SER CAUTHRIEN** — wants her lord protected from the truth about her lord. FUNCTION: the loyal instrument at the door — fightable, or TALKABLE past on the strength of her own doubts, the quest's overlooked best minor node.

## 2 FULL EVENT FLOW (STAGE BY STAGE)

STAGE 0 — THE PRE-COUNT [weeks long, unlabeled]: Denerim's side content — the kidnapped bann's son, the tortured elves, Anora's rescue, the alienage's evidence — each writing silent vote-flags. The ballot assembled in fragments by a player who thinks they're doing errands.
STAGE 1 — THE EVE: Eamon's war-room; Anora's offer (her testimony for her throne); the evidence inventory audited. The player learns, at best partially, what they're walking in with.
STAGE 2 — THE DOOR: Cauthrien's stand — fight through Loghain's most loyal soldier, or turn her aside with her own misgivings (a persuasion built from HER conscience, not your charm).
STAGE 3 — THE SESSION: charges, rebuttals, and the ROLL CALL — banns voting aloud as evidence lands; each piece of homework a voice; each gap a silence or a hostile call. The room COUNTS in real time.
STAGE 4 — THE VERDICT FORK: majority -> Loghain yields or the crowd demands resolution; deadlock/loss -> TRIAL BY COMBAT (self or champion; choosing Alistair as champion writes its own foreshadowing; Loghain fights it himself, always — his one non-delegable act, cf. THE AUTHOR-CANNOT-DELEGATE law from OUR side of the aisle).
STAGE 5 — THE DISPOSITION: execute Loghain (Alistair or you swinging), or CONSCRIPT him — the Warden's ultimate prerogative, spending Alistair to gain the kingdom's best general. The room watches the player price a friendship against an asset, aloud.
STAGE 6 — THE THRONE: Anora, Alistair, or arrangements between — the session ends by settling a crown the quest never let you forget was the real agenda under the trial.

## 3 THE CONVERSATIONS (THE ACTUAL MACHINE)

NODE: THE_ROLL_CALL — the chamber, entry: charges laid
  Not one node — a LATTICE: each accusation is an option whose weight is a pre-existing flag:
  > "Ask Bann Sighard how his son came home."          [gate: flag:saved_oswyn]   -> a vote, aloud, with a reason attached
  > "The alienage. Tell them what you sold."           [gate: has:slaver_docs]    -> the room's loudest turn — evidence as detonation
  > "Anora will speak."                                [gate: flag:anora_deal]    -> the queen testifies AGAINST her father — or, if the deal was fumbled, FOR him: the same node, inverted by prior handling. THE SWING NODE: one NPC, two testimonies, keyed to weeks-old choices (Q125-W7's text-changing climax, at parliamentary scale).
  > (eloquence alone)                                  [gate: none]               -> partial; the unfunded argument sways SOME — the quest is honest that rhetoric has a floor and a ceiling.
  NOVERB: "This chamber has no right to try a war." — THE JURISDICTION CHALLENGE DOESN'T EXIST. Loghain's actual best argument (an emergency regent answers to the war, not the peerage) is given to HIM in fragments and denied to the room as a formal motion; the procedure's legitimacy is the one thing the procedure cannot debate. Bank: THE FORUM NEVER TRIES ITSELF (cf. Q125's facade — there the trial was about something else; here the trial cannot examine its own standing).

NODE: THE_CONSCRIPTION — verdict in hand, entry: Loghain kneeling
  > "He dies today."                       [gate: none] -> the execution; Alistair's arc holds
  > "The Wardens need him. Conscription."  [gate: none] THE DETONATOR -> Riordan's rite; ALISTAIR LEAVES — permanently, furiously, mid-scene; no charm, no history, no approval total un-writes it. THE CORPUS'S MOST EXPENSIVE DIALOGUE OPTION: one line, one companion, no undo. The red line that is ACTUALLY red — the anti-F3 (Q126's unanimous chorus was toothless; this dissent has teeth, walks, and takes his sword arm with him).
  NOVERB: "Alistair — I need you to accept this." — THE PERSUASION OF THE FRIEND IS NOT OFFERED. His line cannot be moved by any means the game contains; some people's limits are not content. 2nd confirmation of the UNPERSUADABLE-BY-DESIGN class (Q1's Tamara).

## 4 THE BRANCH MAP

COUNT: (vote won / lost->duel) × (execute / conscript) × (Anora / Alistair / joint / neither crowned) × (who swung the sword) — the corpus's widest POLITICAL matrix, every cell canon-legal.
THE MAP'S FINDING: the branches' INPUTS are almost entirely retrospective — the session is a rendering pass over weeks of prior state. THE LANDSMEET IS Q102'S ROOFTOP AT PARLIAMENT SCALE: every door out of the story is a relationship (here: a constituency) built without knowing it was a key. The two files should be read as one law at compile: THE FINALE IS A LEDGER-READ.

## 5 HONEST FLAWS (BANKED)

F1 — THE PRE-COUNT IS INVISIBLE UNTIL IT ISN'T. No mechanism previews your standing; players discover their ballot in the room. Thrilling once, opaque always — LAW: political capital needs a LEDGER VIEW (the Fold would simply show it; DA:O had no organ).
F2 — ELOQUENCE'S FLOOR IS TOO HIGH. A charm-specced Warden with zero homework still scrapes by too often; the roll-call's arithmetic bends to the protagonist more than the fiction admits.
F3 — THE DUEL RESET. Losing the VOTE converting to winnable COMBAT lets martial builds skip the entire political layer — the sword as universal solvent dissolves the quest's own thesis. LAW: the fallback resolution must cost what the primary would have paid (the duel is nearly free).
F4 — ANORA'S BETRAYAL TRIGGERS ARE TRIVIA. The queen flips on dialogue minutiae in the eve-scene; the operator's logic is real but its tripwires are quiz-shaped.
F5 — THE BANNS ARE VOTES, NOT PEOPLE, IN THE ROOM. Constituencies built in rich side quests compress to one shouted line each; the electorate's interiority is spent before the session that needed it.
F6 — CONSCRIPTION'S STRATEGIC CASE IS UNDERARGUED. The option that costs Alistair is barely advocated (Riordan's one scene); the quest prices the choice magnificently and briefs it poorly.
F7 — LOGHAIN'S REBUTTALS OUTCLASS THE VERDICT SPACE. His Orlais case is genuinely strong and no branch exists to partially credit it; the room can only convict or crown, never LEARN.
F8 — CAUTHRIEN IS FORGETTABLE BY PLACEMENT. The best minor node (loyalty talked past by its own doubt) sits at a door most players fight through on momentum.
F9 — THE THRONE SETTLEMENT OUTWEIGHS THE TRIAL AND ARRIVES EXHAUSTED. The crown's disposition — the war's actual stakes — resolves in the verdict's shadow with the room's drama already spent.
F10 — NO ABSTENTIONS EXIST. Every bann votes; the roll call has no cowards, no absentees, no bought silence — the parliament is cleaner than any parliament. The missing abstention is the missing realism (and the missing Q121-abstainer).

## 6 WHY IT WORKS (W1–W10)

W1. **THE BOSS FIGHT IS A ROLL-CALL VOTE.** The civil war resolves as parliamentary procedure with an audible count — the medium's fullest staging of politics AS the climax rather than before it.
W2. **THE BALLOT WAS CAST WEEKS AGO.** Side quests as silent constituencies: the session renders prior state. Q102's phonebook-law at institutional scale — the finale is a ledger-read.
W3. **THE SAME WITNESS TESTIFIES BOTH WAYS.** Anora's node inverts on weeks-old handling — one queen, two testimonies, the swing vote as reactivity's crown jewel.
W4. **THE ANTAGONIST ARGUES BACK, WELL.** Loghain's rebuttals are real arguments with real merit; the debate is a debate, not a sentencing hearing with extra steps.
W5. **THE RED LINE HAS TEETH.** Conscription costs Alistair — instantly, permanently, un-charmably. The corpus's most expensive line of dialogue, and the game never flinches from collecting.
W6. **THE UNPERSUADABLE EXISTS.** No build moves Alistair's limit — some people's boundaries are not content, and the design honors it by omission of the node.
W7. **THE DOOR CAN BE TALKED PAST WITH HER OWN DOUBT.** Cauthrien turned aside not by your charm but by her conscience, surfaced — persuasion as midwifery, the quest's best minor mechanism.
W8. **THE FALLBACK IS A DUEL THE ANTAGONIST WON'T DELEGATE.** Loghain fights his own trial-by-combat, always — the author-cannot-delegate law, honored by the OPPOSITION: his one non-negotiable dignity, and it characterizes him more than any speech.
W9. **THE OPERATOR NEVER DRAWS A WEAPON.** Anora survives every branch by negotiation alone — the quest's true final boss is leverage in a dress, and she usually wins something.
W10. **THE ROOM COUNTS ALOUD.** The roll call's audibility — each name, each reason — converts abstract standing into theater: the player HEARS their weeks of choices, one voice at a time. Feedback as ceremony.

## 7 BOHEMIA PORTS

### PORT 1 — THE LEDGER-READ FINALE [W1/W2, core]
**System:** the Fold / mayor persistence / the three arcs
Bohemia's act-finales are Landsmeets: assemblies (tribunal, council, the 13 factions' summit) whose votes render the Fold's accumulated state ALOUD — each faction's voice citing the actual entry that bought it ("the water ledger, month four — we remember"). F1's fix is native: the Fold IS the ledger view; the dynast can read their standing before walking in, and the drama relocates from surprise to CONFIRMATION. [PENDING, Paolo's call.]
### PORT 2 — THE RED LINE WITH TEETH [W5/W6]
One companion per generation carries an un-charmable limit that a single dynast decision detonates — permanently, mid-scene, no undo, no persuasion node. The .bq marks it @REDLINE and the validator confirms no gate can reach around it. The anti-laugh-track (Q126-F3's fix), built as architecture.
### PORT 3 — THE ABSTAINER IN THE ROLL CALL [F10 fixed, with Q121]
Bohemia's assemblies include abstentions, absences, and bought silence — and ONE named abstainer per vote whose refusal is itself a position the Fold records. The Q121 abstention-law, scaled to parliament.
### PORT 4 — THE FALLBACK THAT COSTS THE SAME [F3 fixed]
If a Bohemia political resolution has a physical fallback (duel, siege, dial-combat), the fallback's PRICE matches the political route's — paid in different currency (Q132's four-currency law applied to resolution paths). The sword is never the cheap door.
### PORT 5 — PERSUASION AS MIDWIFERY [W7]
Bohemia's talk-past nodes run on the TARGET's surfaced doubt, gated [gate: knows:their_misgiving] — learned by listening earlier, never by charm. Cauthrien's mechanism as the standard model for every guard, gate, and loyal instrument in the game. Cross-ref Q106 (deserved information) and Q130 (client epistemology): the persuasion trilogy is complete — deserve it, write it, or midwife it. There is no fourth way and Bohemia ships none.

## SOURCES
- Dragon Age Wiki (Fandom): The Landsmeet — the vote table and its side-quest keys, Anora's branch logic, the duel rules, the conscription rite, Alistair's departure, the throne dispositions. `https://dragonage.fandom.com/wiki/The_Landsmeet`
- Fifteen years of community canon: the conscription schism (the fandom's longest-running argument — F6/W5's constituency); the duel-reset critique (F3); the vote-key archaeology (W2's spreadsheets). FUTURE DEEPER PULL: the definitive conscription-debate threads — the player-ethics corpus on ONE dialogue option is unmatched anywhere; worth its own note for the @REDLINE spec.
- FUTURE DEEPER PULLS: (1) the full bann-by-bann vote-key table for PORT 1's Fold-citation spec. (2) Anora's eve-scene tripwires (F4's audit). (3) Sibling: the ME2 Suicide Mission — filed as #137 this batch; the two ledger-read finales should be compared at compile.

---
*END #136*

# BOHEMIA QUESTBOOK — DEEP DIVE 06: THE SUICIDE MISSION + LOYALTY SYSTEM (Mass Effect 2)
Full teardown, the whole enchilada: the loyalty-mission MODEL, the suicide-mission survival
architecture (the role-assignment math, the point thresholds, who-lives-who-dies), the stage-by-stage
finale, and Bohemia ports. This is the medium's model for SIDE CONTENT THAT IS THE GAME and for a
FINALE THAT READS THE WHOLE PLAYTHROUGH — the exact structure our Q050 endgame already echoes.
Reference only; Paolo does not read it. No Bohemia quest written here.

Game: Mass Effect 2 (BioWare, 2010). Commander Shepard recruits ~10-12 specialists, earns their
loyalty, upgrades the ship, then leads them through the Omega-4 Relay to assault the Collector Base.
Considered one of the best game LEVELS ever made (has its own Wikipedia page). The ENTIRE game is
structured as preparation for this one finale.

===============================================================================
## 0. THE CORE IDEA (the whole game is a wind-up to one payoff)
===============================================================================
ME2's architecture: the entire game is PREPARATION for the Suicide Mission. Every recruit, every
loyalty mission, every ship upgrade is a variable the finale reads. The genius is that "side content"
(companion loyalty missions) is LOAD-BEARING for the ending — skip it and your friends die. It solved
the RPG problem of "why do the side quests?" by making them the difference between your squad living
and dying, PERMANENTLY, carried into the sequel.

===============================================================================
## 1. THE LOYALTY-MISSION MODEL (the reusable structure)
===============================================================================
- TWO CHAPTERS PER COMPANION: each squadmate has (a) an ACQUISITION mission (recruit them — wake Grunt
  from the tank, break Jack out of prison) and (b) a LOYALTY mission (a personal, character-defining
  story — avenge a betrayal, confront a father, face a past sin).
- THE LOYALTY MISSION IS CHARACTERIZATION: it's where you LEARN who the companion really is; it
  deepens them from an archetype into a person. The mechanical reward (a 4th power, an alt outfit) is
  secondary to the CHARACTER payoff.
- LOYALTY IS EARNED AND LOSABLE: completing the mission earns loyalty. BUT loyalty can be LOST — most
  famously the Jack/Miranda confrontation, where two loyal companions clash and you must mediate
  (a Paragon/Renegade/skill check); pick wrong and one becomes DISLOYAL again, often right before the
  finale with no time to fix it. Loyalty is a live, fragile state, not a checkbox.
- CONSEQUENCE INTO THE SEQUEL: who lives/dies AND who's loyal carries into Mass Effect 3 — the stakes
  outlive the game.

===============================================================================
## 2. THE SUICIDE-MISSION SURVIVAL ARCHITECTURE (the math of who dies)
===============================================================================
The finale is a SYSTEM that reads your whole playthrough and computes survival. Three input classes:

### INPUT A — SHIP UPGRADES (three critical ones)
- Three specific Normandy upgrades (armor, shielding, a main gun) are ESSENTIAL. Miss them and you
  lose up to THREE companions in scripted deaths during the approach (the ship takes hits and specific
  crew die) — before the base is even entered. (Other upgrades are flavor; these three are survival.)

### INPUT B — LOYALTY (per companion)
- Each companion has a "hold-the-line" survival score; LOYAL companions score higher. Non-loyal
  companions are "weak links" more likely to die (and to get OTHERS killed if assigned to a role).

### INPUT C — ROLE ASSIGNMENT (the player as a commander reading their people)
The base is a sequence of TASKS; you ASSIGN companions to roles based on their fictional competence —
and the game CHECKS your reasoning against the character:
- TECH SPECIALIST (crawl the vents): must be an actual tech (Tali/Legion/Kasumi) AND loyal — pick a
  non-tech or a non-loyal one and they DIE in the vents.
- FIRE-TEAM LEADER (x2, escort + distraction): must be a proven LEADER (Garrus/Miranda/Jacob) AND
  loyal — pick a follower (a Jack, a Grunt) and they lose people / get the tech specialist killed.
  (The game KNOWS Garrus is a natural leader — C-Sec, squad command — and rewards you for knowing it too.)
- BIOTIC SPECIALIST (hold a shield/barrier): must be a strong biotic (Jack/Samara/Morinth) AND loyal —
  pick a weak biotic and a squadmate dies passing through.
- CREW ESCORT (send someone back with the rescued crew): ANY loyal squadmate survives the job; send no
  one and the kidnapped crew all die. (Sending a low-survival member here can SAVE them by removing
  them from the deadly final stretch — a strategic sacrifice-in-reverse.)
- FINAL-BATTLE SQUAD: bring your two STRONGEST; the ones you leave to "hold the line" face the swarm,
  and low-scoring / non-loyal hold-the-liners die.

### THE MATH (the threshold model)
- The "hold the line" survivors are computed from an AVERAGE survival score of the defenders: average
  >= 2.0, EVERYONE lives; between 1.0-2.0, you lose ONE; below 1.0, you lose more. Loyalty + smart
  assignment raise the average. (It's genuinely possible to beat it with NO loyalties if you assign
  cleverly and sacrifice weak links to the escort role — the system rewards understanding, not just
  completion.)
- THE CREW-TIMING TWIST: after the crew is kidnapped (post-Reaper-IFF), doing MORE missions kills more
  of them — do zero and all survive; dally and they die (except Dr. Chakwas, left to "bear witness").
  A hidden CLOCK punishes the player who wanders when their people are in danger. (You get ONE galaxy-
  map opening to squeeze Legion's loyalty mission in before the abduction — a knife-edge of timing.)

===============================================================================
## 3. THE FINALE, STAGE-BY-STAGE (compressed)
===============================================================================
- LEAD-UP: recover the Reaper IFF (rescuing Legion); installing it triggers the Collectors to attack
  the Normandy and KIDNAP the non-combat crew — the personal stakes spike (your people, taken).
- THE POINT OF NO RETURN: cross the Omega-4 Relay (a romance scene can precede it — the "night before").
  From here, no more missions; the finale runs.
- THE APPROACH: the Normandy runs a gauntlet; ship upgrades (Input A) determine scripted survival.
- THE BASE — three assignment gates (Input C): the vents (tech), the two fire-team-leader beats
  (leaders), the biotic-shield run — each mis-assignment = a death, staged as the character failing at
  a job they weren't right for.
- THE CREW RESCUE: send an escort or the crew dies.
- THE HOLD-THE-LINE + FINAL BOSS (the Human-Reaper): your final squad fights; the defenders' average
  (the math) decides who's alive when you regroup. Beat the boss.
- THE ROLL CALL: as you escape, the game literally tallies the survivors — the emotional gut-check of
  seeing who lived and who your choices killed. Shepard themselves can die (if too few survive / low
  prep), ending the imported-save line into ME3.

===============================================================================
## 4. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. THE WHOLE GAME IS THE WIND-UP: structure the entire experience as PREPARATION for one finale that
    reads every prior choice — the side content becomes the point.
W2. SIDE CONTENT = SURVIVAL: companion (loyalty) missions are optional in name but load-bearing for the
    ending — the strongest possible answer to "why do side quests?" (your friends live or die).
W3. LOYALTY EARNED, FRAGILE, LOSABLE: trust is a live state you can win AND lose (the Jack/Miranda
    clash), sometimes with no time to repair — relationships have stakes and upkeep.
W4. ROLE-ASSIGNMENT AS CHARACTER-KNOWLEDGE: the finale tests whether you KNOW your people (assign the
    leader to lead, the tech to the vents) — competence-casting; knowing the cast IS the skill check.
W5. PERMADEATH WITH DIGNITY: deaths are permanent, carried into the sequel, and STAGED as the character
    failing at a specific job — not random; each death is legible and earned by a player choice.
W6. THE HIDDEN CLOCK: once your people are kidnapped, wandering KILLS them — urgency enforced by
    world-state, punishing the player who ignores stated stakes (do zero missions = all crew live).
W7. THE MATH IS INVISIBLE BUT FAIR: a real survival formula (averages/thresholds) runs under the hood;
    the player feels the logic (loyal + right-role = live) without seeing the numbers — systemic,
    legible consequence.
W8. THE ROLL CALL: end by TALLYING the survivors — force the player to face exactly who their
    preparation saved or doomed. The reckoning is the emotional payoff.
W9. BEATABLE BY UNDERSTANDING, NOT GRINDING: you can save everyone with smart assignment even under-
    prepared, or lose people while "completing" everything — mastery is comprehension, not checklist.
W10. THE NIGHT BEFORE: a quiet character beat (romance/farewells) right before the point of no return —
    calm before the storm makes the stakes land.

===============================================================================
## 5. BOHEMIA PORTS (directions, not built)
===============================================================================
- W1/W2 (whole game is the wind-up + side = survival): OUR Q050 threshold ALREADY reads the assembled
  Reconstruction like this. UPGRADE: make the three endgame FINALES (Q051/052/053) read a survival/
  outcome computation from the whole playthrough — who you allied, what you assembled, who's loyal —
  so the district/companions LIVE or DIE at the climax based on preparation. The Reconstruction nodes
  = the "ship upgrades"; the faction/companion bonds = "loyalty."
- W3 (loyalty earned, fragile, losable): our recurring NPCs (Vance, Nadia, Dr. Sama, the coalition
  reps) should have a LIVE loyalty/trust state that can be won AND LOST (a late betrayal beat, an
  unmediated clash between two allies) — bonds need upkeep, and can break right before the endgame.
- W4 (role-assignment as character-knowledge): a Bohemia endgame beat where the dynasty ASSIGNS allies
  to roles in the final push (who holds the plant, who leads the evacuation, who fronts the negotiation)
  and the game checks whether you KNOW your people — competence-casting (ties our faction-web + Q039).
- W5 (permadeath with dignity): our fold already carries deaths forward; stage endgame companion deaths
  as LEGIBLE consequences of assignment/loyalty, not random — each death earned and readable.
- W6 (the hidden clock): a Bohemia endgame where, once the Amalgamation moves / the district is
  threatened, DALLYING costs lives (a soft clock that punishes ignoring stated stakes) — urgency via
  world-state, not a UI timer.
- W7 (invisible fair math): give our climax a real under-the-hood survival/outcome formula (assembled
  nodes + loyalty + district-order + assignments) the player FEELS but doesn't see — systemic, fair.
- W8 (the roll call): END our endgame with a TALLY — who of the district/companions/dynasty survived,
  forcing the player to face what their hundred years of choices saved or doomed (our succession Box +
  the fold epilogue can BE this roll call).
- W9 (beatable by understanding): make our endgame winnable by COMPREHENSION (knowing the enemy — our
  "beaten by knowing not shooting" thesis) rather than grind — already core; ME2 validates it.
- W10 (the night before): a quiet character beat before Q050's point-of-no-return (farewells, the ally
  at the door, the last supper) — calm before the descent (Q051 already opens tender; formalize it).

## SOURCES
Wikipedia "Suicide Mission (Mass Effect 2)" (level design, permadeath, ME3 carryover, critical
acclaim); Mass Effect Fandom (Loyalty system: acquisition+loyalty chapters, losable loyalty, powers/
outfits); TheGamer (BioWare built the game AROUND the suicide mission; archetypes; Jack/Miranda loss);
ScreenRant + RPG Site (the three essential upgrades, role-assignment rules, the crew-timing twist, the
best mission order); TV Tropes Analysis (the survival MATH — the 2.0/1.0 thresholds, weak-link
sacrifice-to-escort strategy). FUTURE: a BioWare postmortem on the survival-formula design; the Lair of
the Shadow Broker DLC as a companion-quest deep-dive (the "side story that outshines the main").

---
# V2 PAYLOAD — BACKFILLED 7/17/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**SHEPARD (the player as commander)** — wants everyone home. Will trade: the whole game's runtime, spent as preparation. Will never say out loud: that the finale is a test of whether they were PAYING ATTENTION to their people, not whether they love them. FUNCTION: the assigner. Every death in the base is a sentence Shepard wrote on the assignment screen.

**THE SQUAD (10-12 specialists)** — each wants their personal wound closed (the loyalty mission: the betrayal avenged, the father faced, the sin answered). Will trade: their survival odds. A companion whose story you finished holds the line harder. Will never say out loud: that loyalty is a NUMBER. The game keeps the math under the fiction. FUNCTION: the variables. Each is a survival score wearing a face you've come to know.

**JACK and MIRANDA (the clash)** — each wants the other proven wrong, and Shepard's word is the verdict. Will trade: their loyalty, ALREADY EARNED, put back on the table. FUNCTION: the fragility mechanism. Trust is a live state; this scene exists to prove it can break at the worst possible hour, with no time left to mend it.

**THE CREW (the non-combatants)** — want rescue, on a clock nobody shows you. FUNCTION: the hidden timer. Every mission flown after the abduction is paid for in their bodies; Dr. Chakwas is always spared, kept alive to bear witness.

**THE ILLUSIVE MAN (offstage)** — wants the base, not the people. FUNCTION: the frame. The mission is named suicide by the man who isn't going.

**THE COLLECTORS / THE HUMAN-REAPER** — want the crew as raw material. FUNCTION: the fixed collision (the ME2 Tribunal). The base doesn't negotiate; it computes.

## V2-B THE CONVERSATIONS (node trees; the finale's "dialogue" is assignment, and assignment is a node tree with people as options)

NODE: JACK_MIRANDA_CLASH — the Normandy, entry: both loyal, both missions done
  Two loyal companions at each other's throats; Shepard must rule.
  > (side with Jack)                 [gate: none]                    -> MIRANDA_DISLOYAL (her score drops; the finale remembers)
  > (side with Miranda)              [gate: none]                    -> JACK_DISLOYAL (same, mirrored)
  > "Stand down. Both of you."       [gate: Paragon/Renegade high]   -> BOTH_KEPT (the mediation check; the only clean exit)
  TRAP: ruling on the MERITS. The argument has no right answer; the check is whether Shepard's accumulated character (the Paragon/Renegade meter, i.e. the whole playthrough's tone) is strong enough to hold two proud people at once. Rule honestly and cheaply, lose one anyway.
  LOCKS: a failed mediation this late often locks the repair forever; the relay is waiting.

NODE: VENT_ASSIGN — the base door, entry: finale running
  The vents need a crawler. The roster is the option list.
  > "Tali/Legion/Kasumi, you're in."  [gate: assignee is tech AND loyal] -> VENTS_LIVE
  > "(anyone else), you're in."        [gate: none] TRAP                  -> VENTS_DIE (staged as the character failing at a job they weren't right for)
  NOVERB: "I'll crawl the vents myself." Shepard cannot self-assign. Command means sending someone, every time. The removed verb is the burden of the office.

NODE: LEADER_ASSIGN — twice (escort beat, distraction beat)
  > "Garrus/Miranda/Jacob leads."      [gate: assignee is a proven leader AND loyal] -> TEAM_HOLDS
  > "(a follower leads)"               [gate: none] TRAP                              -> TEAM_BLEEDS (their people die; a wrong leader kills the tech specialist too)
  THE CHECK IS CHARACTER-KNOWLEDGE (W4): the game knows Garrus ran C-Sec. It is checking whether YOU know it. The stat sheet won't tell you; the two games of fiction will.

NODE: BIOTIC_ASSIGN — the swarm corridor
  > "Jack/Samara/Morinth holds the field." [gate: strong biotic AND loyal] -> CORRIDOR_CLEAN
  > "(a weak biotic holds it)"             [gate: none] TRAP               -> A_SQUADMATE_DIES (the barrier flickers; someone crossing pays)

NODE: ESCORT_DECIDE — the rescued crew, entry: crew found alive (see THE CLOCK)
  > "Take them home."   [gate: any loyal squadmate assigned] -> CREW_LIVE + assignee REMOVED from the deadly stretch (the sacrifice-in-reverse: sending a weak link here SAVES them)
  > (no escort)         [gate: none] SILENCE                 -> CREW_DIE, all of them, off-screen
  THE BEST OPTION IS DISGUISED AS A COST: giving up a gun hand is how you save two lists at once. The system rewards understanding, not completion (W9).

NODE: THE_CLOCK — no speaker. The galaxy map itself, entry: crew abducted
  Every mission flown before the relay converts crew to corpses; zero missions = everyone lives; the map never says so.
  NOVERB: "How long do they have?" Nobody can be asked. The clock is real, hidden, and fair only in hindsight (W6). One opening exists to bank Legion's loyalty first; the knife-edge is the design.

NODE: HOLD_THE_LINE — the final door
  > "You two, with me."  [gate: none] -> the rest defend; their AVERAGE survival score (>=2.0 all live / 1.0-2.0 lose one / <1.0 lose more) runs the arithmetic
  WHAT THIS NODE COSTS: the strongest two are safest with you, which weakens the line. Every pick is a transfer of risk from one name to others. The math is invisible and legible at once (W7).

NODE: ROLL_CALL — the escape, no options
  The game tallies the survivors, name by name, to Shepard's face.
  NOVERB: (there is nothing to say. The preparation already said it.)

## V2-C THE BRANCH MAP

COUNT: 3 terminal classes x a per-name ledger (~12 independent life/death writes; the ledger IS the ending).

B1 — EVERYONE LIVES. Condition: three critical ship upgrades + loyalties + correct assignments + escort sent + defenders' average >=2.0. WRITES: full roster into ME3. The "perfect run" exists and is made of comprehension, not grind (W9).

B2 — PARTIAL LOSSES. The default. Each name dies at a legible failure point: the un-upgraded hull (approach), the wrong crawler (vents), the wrong leader (fire-team), the weak barrier (corridor), the empty escort slot (crew), the thin line (average). WRITES: each name separately; ME3 reads every one. CASHES: in the sequel, permanently.

B3 — SHEPARD DIES. Condition: too few survivors at the end (under-prepared, over-sacrificed). WRITES: the save line ENDS; no import to ME3. The game will let the protagonist be the last name on their own casualty list.

THE STRUCTURAL FINDING FOR THE COMPILE: this is the FINALE-IS-A-LEDGER-READ law at whole-game scale, and the exact blueprint Q050-053's endgame computation already echoes: side content as survival variables, a hidden fair formula, assignment as character-knowledge, and a roll call that makes the player face the arithmetic. The Bohemia upgrade over ME2: our ledger crosses GENERATIONS (the fold reads what the grandmother assigned), and the validator's GEN_FLAG_TEST exists because ME2's math ran once and Bohemia's must survive a hundred years of saves.

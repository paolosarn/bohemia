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

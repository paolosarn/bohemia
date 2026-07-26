# BOHEMIA QUESTBOOK #128 — "ANJU & KAFEI"
**Game:** The Legend of Zelda: Majora's Mask (2000)
**Studio:** Nintendo EAD
**Quest:** The longest sidequest in the game: reuniting an innkeeper and her cursed fiancé across all three days of a world that ends on the third — a quest played against schedules, solved by mail, and rewarded with a wedding that the apocalypse attends.
**Type:** INDIVIDUAL-QUEST DEEP DIVE — FORMAT v2. Mined from the whole-game pool.
**Filed:** 7/16/26

---

## 0 CORE IDEA

**The quest is a train timetable where every train is a person, and the puzzle is standing in the right grief at the right hour.**

Anju waits at the inn. Kafei — cursed into a child's body days before his wedding — hides in a back room, ashamed, robbed of the wedding mask he was to give her. The moon is three days from landing on everyone. The quest spans ALL THREE DAYS: letters mailed at exact hours, a postman's route, a thief's hideout that only opens on the final night, a meeting that requires two people to keep faith in each other on a schedule while the sky falls.

**And the mechanism the whole corpus needs: THE CLOCK IS THE DUNGEON.** There is no combat spine, no key items in chests — the keys are APPOINTMENTS. Miss one and the quest doesn't fail loudly; it just quietly becomes impossible until you rewind time and lose everything you built.

**The second idea: the reward is witnessing.** Complete it and you receive the Couple's Mask — but the actual payout is standing in the inn's room at the last hour as two people choose to meet the end married, together, having kept a promise the world did everything to break. The player's prize is being the only one who knows what it took.

The life lesson underneath: **love is not a feeling, it is logistics kept under pressure.**

---

## 1 CAST + WHAT EACH ONE WANTS

**ANJU** — wants Kafei to come back, and wants to deserve the waiting. Will trade: trust in a masked stranger carrying the right words. Will never say: doubt — she voices it exactly once, to decide against it. FUNCTION: the fixed point; her schedule is the quest's spine.
**KAFEI** — wants his face back and the Sun Mask back before he'll face her; shame has him hiding from the person most willing to see him. Will never say (until the letter): where he is. FUNCTION: the missing groom whose pride is the second antagonist.
**THE POSTMAN** — wants the mail delivered ON TIME, including through an apocalypse; his schedule is sacred and his crisis (flee or finish the route) is the quest's mirror-in-miniature. FUNCTION: the timetable made flesh — and the courier of the crucial letter.
**SAKON** — the thief who stole the Sun Mask; his hideout opens once, on the final night, far away. FUNCTION: the deadline's deadline.
**ANJU'S MOTHER** — wants Anju to give up and evacuate with the family; her counsel is REASONABLE. FUNCTION: the sensible voice the quest asks Anju to defy.
**THE MOON** — wants down. FUNCTION: the timer that makes every other want mean something.

## 2 FULL EVENT FLOW (STAGE BY STAGE)

STAGE 0 — THE TROUBLE ON THE WALL [MISSABLE ENTRY]: the Bombers' notebook points at sorrow density in Clock Town; Anju's entry begins with a misdelivered reservation and a stranger in a Kafei mask asking questions.
STAGE 1 — DAY ONE, THE LETTER: intercept Anju at the right hour wearing the right mask; she asks you — a stranger — to deliver a letter to a mailbox by midnight. The quest's first key is POSTAGE.
STAGE 2 — DAY TWO, THE HIDEOUT: the postman delivers; Kafei receives; follow the child in the Keaton mask to the back room. He tells you everything and gives you the pendant — PROOF OF LIFE to carry back. Anju, holding it, decides to wait instead of evacuate. The quest's midpoint is a woman declining rescue.
STAGE 3 — DAY THREE, SAKON'S HIDEOUT: across the canyon, the thief's door, the two-character puzzle run (Kafei and Link in tandem through the trap corridor) to recover the Sun Mask while the final hours drain.
STAGE 4 — THE FINAL HOUR, THE INN: race back. Anju has stayed. Kafei arrives — still a child, mask in hand. They exchange the Sun and Moon masks into the Couple's Mask, exchange vows, and ask you to leave them together for what comes. Exit: the world ends or you rewind; EITHER WAY the quest happened.
STAGE 5 — THE REWIND'S TAX: saving the world (main quest) means rewinding to Day One — where Anju is waiting again, letter unwritten, Kafei hidden, ALL OF IT UNDONE except the mask in your pocket and the fact that you know. The quest's afterlife is the player carrying a marriage no one else remembers.

## 3 THE CONVERSATIONS (THE ACTUAL MACHINE)

NODE: ANJU_KITCHEN — day one, 11:30 PM, entry: the right mask at the right hour
  She asks a stranger to carry her heart to a mailbox.
  > "Why trust me?"                 [gate: none] -> A_BECAUSE — the mask you wear is her fiancé's face; she is trusting the SHAPE of him. The saddest gate in the corpus: access via resemblance.
  > "He may not answer."            [gate: none] -> A_KNOWS — she has done that math nightly
  > (take the letter)               [gate: none] DEED -> the clock owns you now: mailbox before collection time or the chain dies silently
  NOVERB: "Evacuate. He'd want you safe." — THE SENSIBLE ADVICE IS NOT YOURS TO GIVE. Her mother owns that line; the player is the courier of hope, not its auditor. VERB OWNERSHIP: some sentences belong to specific NPCs, and the player's absence from them is characterization.

NODE: KAFEI_BACKROOM — day two, entry: followed the Keaton mask
  A man's voice in a child's body, facing away.
  > "Anju sent this." (the letter)    [gate: has:delivered] -> K_BREAKS — the pendant handed over: "give her this; tell her I will come."
  > "Why hide from HER?"              [gate: none] -> K_SHAME — the curse he could survive; being SEEN like this he thinks he can't
  > (say nothing; wait)                [gate: none] SILENCE -> he speaks anyway; the back of his head does the scene
  NOVERB: "She won't care what you look like." — THE REASSURANCE IS REMOVED. The player cannot argue him out of shame; only the SCHEDULE can — he must arrive on time as he is. Shame is not defeated by dialogue in this quest; it is defeated by APPOINTMENT-KEEPING. Bank hard: the questbook's only quest where punctuality IS the character arc.

NODE: ANJU_DECISION — day two evening, pendant delivered
  Her mother says leave; the pendant says stay.
  > (deliver the pendant)   [gate: has:pendant] -> she stays. THE MIDPOINT IS HER CHOICE, NOT YOURS — the player enables a decision and does not make it (cf. Q16's spear: leverage, not control; 2nd confirmation of THE CHOICE BELONGS TO ITS OWNER).

## 4 THE BRANCH MAP

COUNT: 1 true completion × N silent-failure states × the rewind paradox.
B1 — THE WEDDING AT THE END OF THE WORLD: all appointments kept; the Couple's Mask; the room they ask you to leave. WRITES: couples_mask (survives rewind — the ONLY thing that does).
B-fail (silent, many): any missed hour collapses the chain WITHOUT ANNOUNCEMENT — the quest never says "failed"; people just stand in the wrong rooms being sad on schedule. FAILURE AS AMBIENCE.
B-paradox — THE REWIND: completing the game un-happens the marriage; the mask remains. THE STRUCTURAL WOUND: the best ending of the sidequest cannot coexist with the best ending of the game in the same timeline — the player chooses which world gets to be real, and the quest is honest that saving everyone erases this.

## 5 HONEST FLAWS (BANKED)

F1 — THE GUIDE PROBLEM. Three days of exact hours across a dozen locations: the community verdict for 25 years is that blind completion is near-mythical. Theme-in-optional's terminal form: THEME-IN-SCHEDULING. LAW: clock-gated chains need in-world timetable objects (the Bombers' Notebook helps; it arrived undercooked).
F2 — SILENT FAILURE CUTS BOTH WAYS. No fail-state announcement is thematically perfect and practically brutal; players lose the chain without learning they lost it. LAW: ambience-failure needs one diegetic tell per broken link.
F3 — THE TANDEM CORRIDOR IS A DEXTERITY SPIKE. The Sakon hideout sequence bolts an execution test onto a scheduling quest; failure there wastes three real-time days. Genre whiplash at the worst hour.
F4 — THE REWIND TAX IS UNDER-ACKNOWLEDGED. The game never once lets Anju or Kafei sense the erasure; only the mask and the player carry it. Half the corpus would call that the point; bank the dissent.
F5 — ANJU'S MOTHER IS RIGHT AND UNREWARDED. The evacuation counsel is the survival play; the quest frames it as faithlessness. LAW: the sensible coward deserves one scene of vindication-adjacent dignity (cf. Q126 F3's unanimous chorus, inverted).
F6 — KAFEI'S CURSE IS A PLOT COUPON. Who cursed him and why (Skull Kid, offhand) is set dressing; the quest's engine never touches its own inciting magic.
F7 — THE POSTMAN STEALS THE THEME. His flee-or-finish crisis is the quest's thesis in one NPC and it lives in a side-branch most players miss. The best line of the arc is missable postage.
F8 — RESEMBLANCE-TRUST IS UNEXAMINED. Anju trusts the mask's face; the quest never prices what it means that hope will follow a costume. Bohemia MUST price this (the Amalgamation is made of resemblances).
F9 — THE REWARD MASK IS UNDERUSED. The Couple's Mask opens one door in the main game; the artifact that survives a timeline does almost nothing mechanically. LAW: relics that survive erasure should testify somewhere.
F10 — THREE-DAY REPETITION FATIGUE. Every retry replays known beats in real time; the quest's respect for schedules extends to punishing yours.

## 6 WHY IT WORKS (W1–W10)

W1. **THE CLOCK IS THE DUNGEON.** Keys are appointments; walls are other people's schedules; the map is a timetable. No quest in the corpus builds its entire challenge from WHEN.
W2. **EVERYONE KEEPS THEIR SCHEDULE INTO THE APOCALYPSE.** The postman delivers, the innkeeper checks in guests, the thief robs — the world ends in three days and everyone clocks in. Routine as courage, and as denial; the quest refuses to rule which.
W3. **THE MIDPOINT IS A WOMAN DECLINING RESCUE.** The pendant delivered, Anju chooses to stay in a doomed town for a maybe. The player enables the bravest decision in the game and is not consulted on it.
W4. **SHAME IS DEFEATED BY PUNCTUALITY.** Kafei's arc has no persuasion node — he is not talked out of hiding; he keeps an appointment as he is. Arrival is the apology.
W5. **THE WEDDING ASKS YOU TO LEAVE.** The quest's final beat excludes its player: the Couple's Mask is handed over and the door is closed. Witness, then absence — the reward includes being dismissed from it.
W6. **FAILURE IS AMBIENT.** Miss an hour and no screen tells you; the world just quietly holds its sadder configuration. The chain fails the way real plans fail: without ceremony.
W7. **THE PRIZE SURVIVES THE ERASURE AND THE MARRIAGE DOESN'T.** Rewind to save the world and only the mask and the player remember. The quest gives the player a memory with no witnesses — carrying it IS the reward's final form.
W8. **THE POSTMAN IS THE THESIS IN MINIATURE.** His final choice (flee vs finish the route) compresses the quest's whole argument about duty and terror into one uniformed man reading his own regulations for permission to be afraid.
W9. **HOPE TRAVELS BY MAIL.** The chain's crucial links are LETTERS with collection times — intimacy routed through infrastructure. The corpus's best marriage of logistics and longing (cf. Q101's supply-chain rescue: this is the supply chain OF a rescue of a marriage).
W10. **THE END OF THE WORLD ATTENDS A WEDDING.** The final hour's staging — vows under the falling moon — is the medium's cleanest statement that meaning is a thing people do at deadlines, not after them.

## 7 BOHEMIA PORTS

### PORT 1 — THE 120 BPM QUEST [W1, core]
**System:** 120 BPM LAW / scheduler / bohemia_scheduler.js
Bohemia's beat-quantized world is BUILT for this: one quest per act whose keys are all APPOINTMENTS on the settlement's real clock — NPC schedules the player must intersect, letters with collection beats, a door that opens once. The .bq gains time gates: [gate: clock:day2_2200]. The scheduler already ticks; this quest class makes it VISIBLE. [PENDING, Paolo's call.]
### PORT 2 — FAILURE AS AMBIENCE, WITH ONE TELL [W6, F2 fixed]
Missed links never announce; the world just reconfigures sadder. F2's fix: each broken link leaves ONE diegetic tell (an uncollected letter in the box, a light left on). The Fold logs the miss; the town doesn't.
### PORT 3 — RESEMBLANCE-TRUST, PRICED [F8]
The Amalgamation is resemblance at scale: portraits trusted because they wear the right face. One Bohemia quest where an NPC trusts the dynast BECAUSE of a resemblance (a mask, a coat, a dead relative's face), and the quest prices what that trust costs both parties when the resemblance is all it was. This is the file's sharpest gift to the lore.
### PORT 4 — THE PRIZE THAT SURVIVES THE ERASURE [W7, F9 fixed]
Roguelite law: one artifact class per generation survives the run-reset the way the Couple's Mask survives the rewind — and (F9's fix) it TESTIFIES: NPCs in the next run react to it without knowing why. The Fold knows.
### PORT 5 — THE WITNESS DISMISSED [W5]
Bohemia's warmest quests should end by asking the dynast to LEAVE — the reward room's final verb is the door. Cross-ref Q108's corner reunion: 2nd confirmation of UNCENTERED PAYOFFS: the best thing that happens is not about you, and the staging says so.

## SOURCES
- Zelda Wiki (Fandom): Anju and Kafei sidequest — full three-day timetable, both letters, the pendant, Sakon's hideout, the Couple's Mask. `https://zelda.fandom.com/wiki/Anju_and_Kafei`
- 25 years of community discourse: the guide-dependence consensus (F1), silent-failure pain (F2), the postman's arc as fan-canonized thesis (W8/F7). FUTURE DEEPER PULL: strongest single retrospectives (the quest has essay-length treatments; pull the best two).
- FUTURE DEEPER PULLS: (1) the exact Bombers' Notebook affordances — what the timetable UI got right/wrong, direct input for PORT 1's interface. (2) The postman's full schedule and final-hour scene for the miniature-thesis port. (3) Pamela's father (the other MM grief-quest) as a sibling file candidate.

---
*END #128*

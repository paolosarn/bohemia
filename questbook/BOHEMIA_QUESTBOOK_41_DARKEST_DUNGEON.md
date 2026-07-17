# BOHEMIA QUESTBOOK — DEEP DIVE 41: THE STRESS & AFFLICTION SYSTEM (Darkest Dungeon)
Full teardown, the whole enchilada: the stress meter, the affliction-vs-virtue resolve check, the
narrator, heroes-as-fragile-resources, the town stress-relief economy, the death's-door/heart-attack
system, the light/torch risk-reward, the honest flaws, and Bohemia ports. This is the medium's model
for PSYCHOLOGICAL ATTRITION AS THE CORE SYSTEM + characters who BREAK under pressure + managing PEOPLE,
not superheroes. Directly reinforces our This War of Mine guilt-system port (Q30). Red Hook Studios.
Reference only; Paolo does not read it. No Bohemia quest written here.

Game: Darkest Dungeon (Red Hook, 2016). A gothic roguelike party RPG: you lead flawed heroes into
dungeons beneath a cursed estate. The innovation: the real enemy isn't monsters — it's STRESS, famine,
disease, the dark, and the psychological toll on your heroes. Available on iPad (relevant to our
platform).

===============================================================================
## 0. THE CORE IDEA (why it's in the canon)
===============================================================================
- PSYCHOLOGICAL ATTRITION IS THE GAME: "battle not only unimaginable foes, but STRESS, famine, disease,
  and the ever-encroaching dark." Every hero has a STRESS meter alongside HP — and stress is often the
  DEADLIER threat. The game is about managing minds, not just health bars (cf. This War of Mine's mental-
  health system Q30, Pathologic's body-clock Q21 — DD systematizes the PSYCHE most fully).
- HEROES ARE FRAGILE RESOURCES, NOT SUPERHEROES: heroes have flaws, quirks, permadeath, and finite
  resilience. You don't power-fantasy through — you MANAGE a roster of breakable people, spend them
  carefully, and grieve the losses. "Understand digital characters as emotional entities" (cf. our
  survivors/dynasts as people, not stats; Fallout's anti-superhero stance Q38).
- THEME THROUGH MECHANIC: the stress system MAKES you feel the psychological cost of sending people into
  horror — you don't read about trauma, you MANAGE it, ration relief, and watch heroes crack (cf.
  Pathologic Q21, TWoM Q30, Spec Ops Q27, Frostpunk Q29 — the 11bit/Red Hook school).

===============================================================================
## 1. THE STRESS -> RESOLVE CHECK (the signature engine, torn down)
===============================================================================
- THE STRESS METER (0-100, then 100-200): fear, critical hits taken, darkness, monster attacks, and
  grim events pile STRESS onto a hero. At 100 stress, the hero hits a RESOLVE CHECK — a dramatic
  splash-screen crisis.
- AFFLICTION vs VIRTUE (the fork): the resolve check rolls (usually ~75-85% bad):
  - AFFLICTION (the common, bad outcome): the hero develops a negative psychological state — PARANOID,
    ABUSIVE, HOPELESS, FEARFUL, IRRATIONAL, MASOCHISTIC — and you LOSE control: they refuse heals, insult
    + stress OTHER party members, skip turns, act self-destructively. One broken mind can cascade and
    doom the whole party (stress SPREADS — an abusive hero stresses everyone).
  - VIRTUE (the rare, ~15% good outcome): the hero OVERCOMES the dark night of the soul and becomes
    STALWART / POWERFUL / VIGOROUS / FOCUSED / COURAGEOUS — self-heals, buffs, and CURES allies' stress
    for the rest of the mission. A clutch, unplannable turnaround you "get totally stoked" for.
- THE SECOND METER (100-200 -> heart attack): if stress hits 200, the hero suffers a HEART ATTACK —
  dropping to Death's Door, and another hit KILLS them. Stress can literally kill, independent of HP.
- YOU CAN'T RELY ON VIRTUE: it's a ~15% safety net, not a strategy — the community consensus is "don't
  plan on it." So you play to PREVENT stress, not to gamble on overcoming it (a risk-management loop).

===============================================================================
## 2. THE SUPPORTING SYSTEMS (how attrition is enforced)
===============================================================================
- THE STRESS-RELIEF ECONOMY (town): between runs, heroes de-stress at the Hamlet's TAVERN (gambling,
  drink, brothel) or ABBEY (prayer, meditation, flagellation) — but slots are LIMITED and cost gold, and
  some quirks make a hero REFUSE certain relief (a Faithless hero won't pray). You budget RECOVERY like
  any resource — and can't heal everyone, so you ROTATE a large roster (cf. Frostpunk resource-budget Q29,
  ME2 roster Q06).
- THE LIGHT/TORCH RISK-REWARD: dungeon LIGHT LEVEL is a dial — high light = less stress, more accuracy,
  safer; low light = MORE loot + rewards but far more stress + danger. A voluntary risk/greed lever (cf.
  our Dead-Eye greed/3x multiplier! — a direct parallel; New Vegas Dead Money greed).
- CAMPING (the mid-run relief): on long dungeons you CAMP — spend time on stress-heal skills OR buffs OR
  cooking, a mid-mission triage of limited actions (cf. ME2 prep Q06, Pathologic triage Q21).
- THE NARRATOR (the voice that frames it): a sonorous narrator celebrates your successes AND failures
  ("overconfidence is a slow and insidious killer") — a signature VOICE that editorializes the run,
  building dread + character (cf. GLaDOS voice-as-character Q36, our Amalgamation-voice potential).
- HEROES-AS-CONSUMABLE (the estate frame): the Darkest Dungeon final location makes heroes ONE-USE (they
  enter at 80 stress on reuse) — the theme literalized: this quest CONSUMES people; choose who you spend.

===============================================================================
## 3. THE HONEST FLAWS (banked)
===============================================================================
- RNG-DRIVEN MISERY / FEEL-BAD: the ~85% affliction rate + crits + heart attacks can feel PUNISHING and
  unfair — a bad-luck cascade wipes a party through no misplay. LESSON: psychological-attrition systems
  must feel like CONSEQUENCE, not just dice cruelty — give players enough control/mitigation that
  breakdowns feel EARNED, not random (cf. Pathologic sliders Q21; our odds-not-guarantees Q06 must still
  feel fair).
- GRIND / ROSTER CHURN: managing stress means rotating many heroes + repeating dungeons to recover them —
  can feel like busywork. LESSON: attrition needs PACING so recovery isn't tedious (cf. TWoM repetition
  Q30, our difficulty options).
- UNRELENTING TONE: the gothic despair is relentless; some bounce off the constant grimness. LESSON: even
  a dread-game needs texture + the occasional triumph (the Virtue high, a clutch win) to stay bearable
  (cf. Pathologic Q21, our SUN-MODE/tone instincts).
- STRESS-HEAL DOMINANCE: optimal play centers on stress-healers/prevention, which can narrow team comps.
  LESSON: don't let one counter-system become mandatory — keep varied answers to attrition viable.

===============================================================================
## 4. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. PSYCHOLOGICAL ATTRITION AS THE CORE: stress is a second HP bar that's often DEADLIER — the game is
    about managing minds under horror, not just health (cf. TWoM Q30, Pathologic Q21).
W2. THE RESOLVE CHECK (afflict vs virtue): at breaking point, a hero either CRACKS (lose control, harm
    the party) or OVERCOMES (rare clutch buff) — a dramatic, characterful crisis moment with real stakes.
W3. BREAKDOWN SPREADS: an afflicted hero STRESSES the others — psychological damage cascades through the
    group; one broken mind can doom the party (cf. TWoM community-as-resource Q30). Interdependence.
W4. HEROES ARE FRAGILE RESOURCES: flaws, quirks, permadeath, finite resilience — you MANAGE breakable
    people + grieve losses, not power-fantasy (cf. Fallout anti-superhero Q38, our survivors-as-people).
W5. THE STRESS-RELIEF ECONOMY: recovery is a LIMITED, budgeted resource (tavern/abbey slots + gold), and
    quirks gate which relief works — you can't heal everyone; rotate a roster (cf. Frostpunk Q29, ME2 Q06).
W6. THE LIGHT/GREED LEVER: dial danger UP for more reward (low light = more loot + more stress) — a
    voluntary risk/greed choice (DIRECT parallel to our Dead-Eye greed multiplier; Dead Money greed).
W7. MID-RUN TRIAGE (camping): limited camp actions force heal-vs-buff-vs-eat choices — resource triage
    inside a mission (cf. ME2 Q06, Pathologic Q21).
W8. THE EDITORIALIZING NARRATOR: a signature VOICE frames wins + losses with dread + wit — voice-as-
    character elevating a systems game (cf. GLaDOS Q36; our Amalgamation-voice + music strengths).
W9. THEME LITERALIZED (heroes as consumable): the final dungeon makes heroes one-use — "this consumes
    people; choose who you spend" — the mechanic IS the theme (cf. Spec Ops Q27, ME2 Q06).
W10. THE RARE TRIUMPH IN THE DARK (virtue): an unplannable ~15% overcoming that you're thrilled by — a
     glimmer of hope that makes the relentless dread bearable + memorable (cf. NieR chosen-meaning Q22).

===============================================================================
## 5. BOHEMIA PORTS (directions, not built) — reinforces our TWoM guilt-system port
===============================================================================
Darkest Dungeon is the most complete PSYCHOLOGICAL-ATTRITION system in games — it SHARPENS the This War
of Mine guilt-mechanic port (Q30) into a concrete, buildable model for Bohemia's survivors/dynasts. It's
also on iPad, proving the depth fits our platform.
- W1/W2/W3 (stress as a core system + resolve check + breakdown spreads): build the Bohemia CONSCIENCE/
  mental-health system (flagged in Q30) with a DARKEST DUNGEON spine — survivors/companions/heirs carry
  a STRESS/RESOLVE meter that grim events, cruelty, loss, and the Amalgamation's horror raise; at breaking
  point they either CRACK (an affliction: paranoia, despair, cruelty — losing reliability + stressing
  others) or, rarely, STEEL (a virtue: resolve, inspiration — buffing the group). Breakdown SPREADS
  through a settlement/family (interdependence). Ties our upbringing (Q003), succession traits, the
  unrecorded ledger; within our wellbeing rules (grief/breakdown with weight, resources for support).
- W4 (heroes as fragile resources): keep Bohemia's people BREAKABLE + mortal — the dynasty manages
  fragile survivors, not superheroes; losses are grieved, permadeath matters (validates our death-math +
  hardcore stance; ties Fallout Q38, our fold).
- W5/W7 (the stress-relief economy + mid-run triage): make PSYCHOLOGICAL RECOVERY a budgeted city-builder
  resource — our life-support/faith/community buildings (a tavern/abbey equivalent) provide LIMITED
  stress-relief slots the dynasty budgets, and some survivors REFUSE certain relief (a faith-averse
  survivor won't pray) — you can't heal everyone; triage recovery (ties Frostpunk Q29, ME2 Q06, TWoM Q30,
  Pathologic Q21, our currencies).
- W6 (the light/greed lever): we ALREADY have this — the Dead-Eye GREED/3x multiplier is Darkest
  Dungeon's torch-dial. Bank the parallel + extend the risk/greed lever to EXPLORATION/city-builder
  (push a zone harder for more yield at higher stress/danger) — voluntary greed as a core Bohemia verb
  (ties our combat dial, New Vegas Dead Money greed).
- W8 (the editorializing narrator): consider a signature Bohemia VOICE that frames wins/losses (the
  Amalgamation? a chronicler? the unrecorded ledger given voice) — voice-as-character elevating our
  systems, tied to our music/writing strengths (ties GLaDOS Q36, our Amalgamation-voice Q50).
- W9 (theme literalized — people are spent): our hardest content (an Amalgamation purge, a siege) can
  literalize "this consumes people; choose who you spend" — the mechanic carrying the thesis (ties Spec
  Ops Q27, ME2 Q06, Pathologic "can't save everyone" Q21, our death-math).
- W10 (the rare triumph in the dark): bank the VIRTUE glimmer — an unplannable, thrilling overcoming that
  makes relentless dread bearable (a survivor who STEELS at the brink) — hope that punctuates the grim
  (ties NieR chosen-meaning Q22, our SUN-MODE/tone; the counter to unrelenting misery).
- FLAWS (bank HARD): make breakdowns feel EARNED, not dice-cruelty (enough player control/mitigation —
  our odds-must-feel-fair, Q06/Pathologic Q21); PACE recovery so it's not grindy busywork; give the dread
  TEXTURE + triumphs so it's bearable (our SUN-MODE/tone/difficulty packages); and don't let one relief-
  system become mandatory (keep varied answers to attrition).

## SOURCES
Steam store + AlternativeTo + nuuvem + Apple App Store (the core pitch: "battle not only foes but stress/
famine/disease/dark," the Affliction System — paranoia/masochism/fear/irrationality, the narrator, camp
+ tavern/abbey stress relief, permadeath, iPad edition); Darkest Dungeon Wiki (the Darkest Dungeon final
location: scripted, heroes one-use/80-stress-on-reuse, choose-composition); Steam community threads (the
resolve check at 100 stress -> affliction vs virtue ~15%, the virtue types Stalwart/Powerful/Vigorous/
Focused/Courageous + their buffs/stress-cures, "don't plan on virtue," heart-attack at 200, stress
spreads via abusive heroes, avoid-30-stress risk-management, light-level risk/reward). Cross-ref Questbook
30 (TWoM — the guilt-system this sharpens), 21 (Pathologic — attrition/triage/sliders), 29 (Frostpunk —
resource-budget/dual-meter), 06 (ME2 — roster/prep/triage), 36 (GLaDOS — narrator voice), 38 (Fallout —
anti-superhero), 22 (NieR — hope-in-despair), 27 (Spec Ops — people-as-consumed), our conscience/mental-
health system + upbringing + succession + death-math + Dead-Eye greed + currencies + wellbeing/SUN-MODE/
difficulty rules. FUTURE: a Red Hook talk on the stress/affliction design; a RimWorld/Dwarf Fortress
deep-dive (emergent psychological simulation siblings).

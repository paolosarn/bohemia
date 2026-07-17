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

---
# V2 PAYLOAD — BACKFILLED 7/17/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**THE HEIR / THE PLAYER (the estate's inheritor)** — wants the family curse cleaned up, and will spend other people to do it. Will trade: heroes, by the roster, into the dark. Will never say out loud: that the estate consumes the people sent to save it, and that this was always the deal. FUNCTION: the manager of breakable people (W4). Not a power fantasy — a payroll of trauma.

**THE HEROES** — want, each, to survive one more run, and carry quirks and afflictions that make even that hard: a Faithless one who won't pray, a Kleptomaniac, a God-Fearing one who won't gamble. Will trade: their nerve, spent as STRESS, until it breaks. FUNCTION: fragile resources with faces (W4) — the game's whole moral weight is that the numbers have names.

**THE STRESS METER** — wants 100, then 200. FUNCTION: the second HP bar, deadlier than the first (W1). It kills by heart attack independent of health: the mind as the real battlefield.

**THE RESOLVE CHECK** — wants to roll badly, ~85% of the time. FUNCTION: the fork (W2): at the brink, a hero either CRACKS into affliction (paranoid, abusive, hopeless — and STRESSES the others, W3) or, rarely, STEELS into virtue (the ~15% clutch that saves the run, W10). The unplannable crisis that gives the system its drama.

**THE NARRATOR** — wants to editorialize your every triumph and corpse. "Overconfidence is a slow and insidious killer." FUNCTION: the voice-as-character (W8) that turns a spreadsheet of stress into gothic dread — the GLaDOS lesson (#36) in a systems game.

**THE TORCH** — wants to go out, because darkness pays. FUNCTION: the greed lever (W6): dim the light for more loot and more stress — Bohemia's Dead-Eye 3x multiplier, wearing a lantern.

## V2-B THE CONVERSATIONS (node trees; the machine's honesty: the "dialogue" here is with SYSTEMS and a narrator, not NPCs — the resolve check is the most dramatic conversation, and it's the hero talking to their own breaking point)

NODE: THE_TORCH_DIAL — any dungeon, entry: the light meter visible
  > (keep it bright)                [gate: torches] -> less stress, better odds, less loot; the coward's percentage, which is to say the survivor's
  > (let it burn low)               [gate: greed] -> more reward, more stress, more danger (W6); the voluntary gamble that IS the game's risk verb
  THE DIRECT PARALLEL: this is our Dead-Eye greed multiplier, already in Bohemia's DNA. The file's gift is proof the lever generalizes from combat to EXPLORATION.

NODE: THE_RESOLVE_CHECK — at 100 stress, entry: a hero's breaking point
  The splash screen. The narrator leans in. The dice roll.
  > (AFFLICTION ~85%)               [gate: the roll] -> PARANOID / ABUSIVE / HOPELESS / FEARFUL: control LOST. The hero refuses heals, insults allies, skips turns, self-harms — and RAISES everyone else's stress (W2, W3)
  > (VIRTUE ~15%)                   [gate: the roll] -> STALWART / COURAGEOUS / FOCUSED: self-heals, buffs, CURES the party's stress; the clutch you can't plan (W10)
  NOVERB: "Pull yourself together." The command does not exist. You cannot ORDER resolve; you can only have PREVENTED the stress that got here (the design's thesis: play to prevent, never to overcome). The removed verb is the whole risk-management loop.

NODE: THE_ABUSIVE_CASCADE — post-affliction, entry: one broken mind in a party of four
  > (keep pushing)                  [gate: none] TRAP -> the abusive hero stresses the others toward THEIR checks; one crack becomes four; the party dooms itself from inside (W3)
  > (retreat, cut losses)           [gate: none] -> abandon the loot, save the people; the triage the whole game teaches
  THE INTERDEPENDENCE (W3): psychological damage is contagious. The #30 lesson (community as resource) shown from its dark side: community as a stress vector.

NODE: THE_TOWN_RELIEF — between runs, the Hamlet, entry: gold in hand
  > (Tavern: drink, gamble, brothel) [gate: gold + slots + quirk allows] -> stress down, unless a quirk REFUSES it
  > (Abbey: pray, meditate, flagellate) [gate: gold + slots + quirk allows] -> stress down, unless Faithless
  > (send them back unrested)       [gate: none] TRAP -> the roster too thin, the mission too soon; the estate's appetite outpacing recovery
  THE ECONOMY (W5): recovery is BUDGETED, slotted, gold-gated, and quirk-blocked. You cannot heal everyone, so you ROTATE — a large roster of the breakable (the #06/#29 roster-triage lineage).

NODE: THE_CAMP — mid-long-run, entry: limited camp actions
  > (stress-heal skills)            [gate: actions] -> minds tended at the cost of buffs
  > (buff / cook / watch)           [gate: actions] -> the body tended at the cost of the mind
  THE TRIAGE (W7): the ME2 assignment screen (#06) compressed into a firelit minute — heal-vs-buff-vs-eat, never all three.

NODE: THE_FINAL_DUNGEON — the estate's heart, entry: the endgame
  Heroes enter at 80 stress on reuse. One-use. The theme, literalized.
  > (choose who to spend)           [gate: none] -> the mechanic IS the thesis (W9): this quest CONSUMES people, and the last choice is whose life the cure costs
  THE ONE LINE DOING THE WORK is the narrator's, over a veteran walking in for the last time: the estate does not return what it takes. Spec Ops' complicity (#27) and ME2's roll call (#06) fused into a resource cost.

## V2-C THE BRANCH MAP

COUNT: no authored ending-branches — the branch map is the ROSTER's fate (who cracked, who steeled, who died, who you spent at the end), compiled run by run. (The estate's story is fixed; WHO survives it is the whole variable.)

THE STRESS LAYER — per hero: intact / afflicted (6 negative states) / virtuous (5 positive) / heart-attacked / dead. Compounding, contagious (W2, W3).
THE ECONOMY LAYER — recovery budgeted, quirk-gated, roster-rotated (W5).
THE CONSUMPTION LAYER — the final dungeon spends people by name (W9): the ledger of who the cure cost.

THE STRUCTURAL FINDING FOR THE COMPILE: Darkest Dungeon is the BUILD SPEC for the conscience system #30 only sketched — This War of Mine proved guilt should be sticky and chosen; Darkest Dungeon proves HOW to make psychological attrition a SYSTEM. Lock-ins: (1) a STRESS/RESOLVE meter on survivors, companions, and heirs — grim events, cruelty, loss, and Amalgamation-horror raise it; at the brink they CRACK (an affliction that costs reliability and STRESSES others) or rarely STEEL (a virtue that buffs the settlement), with breakdown CONTAGIOUS across a family/block (the #30 community-as-resource shown from both sides); (2) PSYCHOLOGICAL RECOVERY as a budgeted city-builder resource — a tavern/abbey-class building with limited slots, gold cost, and quirk-refusals (a faith-averse survivor won't pray), forcing roster rotation and recovery triage (the #06/#29 lineage); (3) the GREED LEVER generalized — the Dead-Eye 3x multiplier is Darkest Dungeon's torch, and it should extend to EXPLORATION and the city-builder (push a zone harder for more yield at more stress); (4) the VIRTUE GLIMMER banked as the counter to unrelenting misery — an unplannable steeling that makes the dread bearable (the #22 chosen-meaning note, mechanized). Compile gates from the flaws, all four: breakdowns must feel EARNED not dice-cruel (player mitigation, the odds-feel-fair law from #06/#21); recovery PACED so it isn't grind; dread given TEXTURE and triumphs (SUN-MODE, the packages); and no single relief-system made mandatory. And the platform note is not incidental — Darkest Dungeon ships this depth on iPad, which is exactly Bohemia's target: the psychological-attrition system is PROVEN to fit the phone.

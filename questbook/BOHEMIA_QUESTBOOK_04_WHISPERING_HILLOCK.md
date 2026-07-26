# BOHEMIA QUESTBOOK — DEEP DIVE 04: THE WHISPERING HILLOCK (The Witcher 3)
Full teardown, the whole enchilada: event, staging, stage-by-stage flow, the complete branch/timing
map, and Bohemia ports. This is the medium's canonical example of the ISOLATED LOAD-BEARING CHOICE —
a "standalone" quest that silently decides a major, emotionally-loaded outcome elsewhere, whose weight
is HIDDEN at decision-time. The single most-studied "trolley problem" in open-world RPGs. Reference
only; Paolo does not read it. No Bohemia quest written here.

Quest: "The Whispering Hillock," a secondary quest in Velen, chained inside the Bloody Baron / Ladies
of the Wood questline (see Questbook 01). Suggested level 5 — you hit it EARLY, before you understand
the web it's wired into.

===============================================================================
## 0. THE PREMISE / STAKES
===============================================================================
- WHO: a malevolent SPIRIT trapped inside an ancient oak (the "Whispering Hillock"), guarded by a
  werewolf; the CRONES of Crookback Bog (grotesque swamp demigods) who intend to eat a group of
  ORPHANS; and — hidden — ANNA, the Baron's wife ("Gran"), secretly entangled with all of it.
- THE HOOK: during "Ladies of the Wood," the Ealdorman of Downwarren asks Geralt to investigate a
  haunted oak that's been killing villagers. It reads as a routine monster-investigation side quest.
- THE HIDDEN WEIGHT: the choice here (free vs kill the spirit) silently decides the fate of the
  orphans, the village of Downwarren, ANNA (the Baron's wife), and thus the BARON himself — the
  emotional payoff of a whole major questline the player may not connect to this oak. YOU DON'T KNOW
  THIS WHEN YOU CHOOSE. That's the entire design.
- THE TROLLEY PROBLEM: free the spirit -> orphans live, village dies, Anna dies, Baron suicides. Kill
  the spirit -> orphans eaten, village lives, Anna lives (but insane), Baron lives (hoping to heal her).
  No option saves everyone. The "obvious moral good" (save the children) carries the worst family cost.

===============================================================================
## 1. THE FULL STAGE-BY-STAGE FLOW
===============================================================================

### STAGE 1 — THE APPROACH (the warning)
- Head to the Ancient Oak south of Downwarren. As you near it, a disembodied VOICE warns you to STAY
  AWAY (staging: the quest tells you it's dangerous, in the spirit's own voice). Push on -> a WEREWOLF
  guards the cave entrance under the hill; kill it.
- Descend the partially-flooded tunnels to the tree's HEART embedded in the roots — a literal descent
  into the earth to a trapped thing (the underworld/heart-of-the-tree staging).

### STAGE 2 — THE SPIRIT'S OFFER (the fork opens)
- Talk to the spirit. It admits killing those who came near, and offers a DEAL: free it, and it will
  save the orphans the Crones mean to eat. The immediate frame: a trapped being + doomed children vs
  a monster that's been killing villagers. Sympathy is deliberately muddied — is it a savior or a liar?
- THE FORK (declared here, resolved by method):
  - HELP/FREE IT -> gather ritual ingredients (Stage 3a).
  - REFUSE/KILL IT -> attack the heart now (Stage 3b) — you can betray the "I'll help" line at any time.

### STAGE 3a — THE FREEING RITUAL (if you help)
- The spirit requires three items: a RAVEN'S FEATHER (a harpy nest west of Downwarren — you may
  already have it from helping the godling Johnny), the BONES/REMAINS of a spirit (a woman's remains
  near a water hag's territory in the bog, found via Witcher Senses under a gravestone; drowners
  nearby), and a WILD BLACK HORSE (tame it with Axii; the spirit possesses the mare).
- Complete the ritual -> the spirit is freed, possesses the black horse ("Black Beauty"), and races
  off to make good on its promise. STAGING: the spirit LEAVES as a black horse — you watch your choice
  gallop away, its consequences now out of your hands.
- SUB-BRANCH (trick it): once you have the ingredients, you can perform the ritual but NOT free it
  (don't complete the final step / don't stab-vs-stab correctly) — the spirit DIES without a fight.
  A third path: kill it WITHOUT combat, via the ritual itself.

### STAGE 3b — KILLING THE SPIRIT (if you refuse)
- Attack the heart in the roots. The tree defends itself: it sends ENDREGA WORKERS (insectoids) in
  waves; clear them, the branches become vulnerable, strike the heart; it re-raises defenses, repeat.
  A combat set-piece. The spirit dies.

### STAGE 4 — THE HIDDEN PAYOUT (resolved LATER, in Return to Crookback Bog)
The consequences don't land here — they land quests later, and MOST players don't trace them back:
- IF FREED: the spirit saves the orphans (they later appear safe under Marabella's care in Novigrad —
  IF the timing is "standard"). BUT it ATTACKS Downwarren, driving the villagers violently mad /
  killing most. AND the Crones, enraged at losing the orphans, punish ANNA (Gran) by cursing her into
  a WATER HAG. In Return to Crookback Bog, Geralt can lift the curse — but the curse is the only thing
  keeping her alive, so she DIES. The Baron, broken, HANGS HIMSELF at Crow's Perch.
- IF KILLED: Downwarren is SAFE (keeps worshiping the Crones; the Cult of the Eternal Fire oppresses
  them instead). The orphans VANISH from the orphanage — taken by the Crones ("plump as piglets" =
  eaten). Anna, no curse, but shattered by the loss of the children she tried to save, goes INSANE;
  the Baron takes her away to seek healing — both LIVE.
- NO REWARD DIFFERENCE: your loot/XP is identical either way. The choice ONLY determines who lives and
  who dies. The stakes are purely MORAL — there is no mechanical incentive, so the decision is clean of
  gamey motive. (Sasko's point: make the player choose on ETHICS, not rewards.)

### STAGE 5 — THE TIMING LOOPHOLE (system-mastery reward)
- If you FREE the spirit BEFORE consulting the Ealdorman in Ladies of the Wood (i.e. do the Hillock
  "early"/out of the intended order): Downwarren is still attacked, BUT Anna is NOT cursed into a water
  hag — meaning you can save the orphans AND spare Anna the curse (a route toward the "both live-ish"
  outcome without dooming Anna). CAVEAT (disputed in the community): some report the orphans then DON'T
  show up safe in Novigrad — the loophole may save Anna at the cost of the orphans' confirmed rescue.
  Either way: the ORDER you do quests in changes the outcome — deep, hidden, order-dependent reactivity
  that rewards players who engage the systems out of the railroad.

===============================================================================
## 2. THE BRANCH / TIMING MAP (compact)
===============================================================================
CHOICE: FREE (ritual: raven feather + spirit bones + black horse via Axii) | KILL (combat, endrega
  waves) | TRICK (ritual-but-don't-free -> spirit dies, no fight)
STANDARD TIMING (Hillock after consulting Ealdorman):
  FREE -> orphans saved (Novigrad) | Downwarren massacred | Anna -> water hag -> dies -> BARON SUICIDE
  KILL/TRICK -> Downwarren safe | orphans eaten by Crones | Anna insane but ALIVE -> Baron takes her
    away, both LIVE
LOOPHOLE TIMING (free BEFORE Ealdorman): Downwarren attacked | Anna NOT cursed (spared) | orphans'
  rescue possibly NOT confirmed (disputed)
REWARD: identical XP/loot on all paths (no mechanical incentive — pure ethics).

===============================================================================
## 3. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. THE HIDDEN LOAD: the choice's TRUE stakes (Anna, the Baron, the whole family payoff) are invisible
    at decision-time. You think you're deciding "save orphans vs kill a monster"; you're actually
    deciding whether the Baron's wife lives and he lives. The gap between apparent and real stakes is
    the entire genius.
W2. THE OBVIOUS-GOOD TRAP: "save the children" is the intuitive moral choice — and it triggers the
    worst family outcome (Anna's death, the Baron's suicide). The game punishes the reflexive good deed
    with tragedy, forcing the player to feel that good intentions ≠ good outcomes.
W3. NO CLEAN OPTION: every path kills someone (orphans OR Anna+Baron; Downwarren dies either way-ish).
    The player weighs incommensurable lives; there's no "right." (Game8: "both choices have necessary
    evils; weigh it yourself.")
W4. ZERO REWARD DIFFERENCE: identical loot/XP — the choice is stripped of gamey motive so it's PURELY
    ethical. (A masterstroke: reactivity that refuses to bribe you toward any option.)
W5. DELAYED, DISPLACED CONSEQUENCE: the payoff lands quests later, in a DIFFERENT quest (Return to
    Crookback Bog), so cause and effect are separated by hours — the world feels like it has a memory
    and a life beyond the immediate scene.
W6. THE AMBIGUOUS PETITIONER: the spirit is a monster that killed villagers AND the orphans' only
    savior — you can't tell if freeing it is mercy or catastrophe (it's both). The quest-giver is
    morally opaque BY DESIGN.
W7. ORDER-DEPENDENT REACTIVITY (the loophole): the SEQUENCE you tackle quests in changes outcomes —
    deep, hidden state that rewards system-mastery and replay. (The world runs on real conditions, not
    a script waiting for you.)
W8. THE CHOICE GALLOPS AWAY: freeing the spirit = it possesses a horse and RUNS OFF — a staging image
    of consequence leaving your control. You set something loose; you can't recall it.
W9. THE DESCENT: a flooded tunnel down to a heart in the roots — physical descent to a trapped thing;
    the staging matches the moral (going UNDER to face a buried truth).
W10. WORSHIP-OF-THE-MONSTER: Downwarren worships the Crones (their abusers) — killing the spirit
    "protects" people who venerate the real evil; the moral field is muddied on every axis.

===============================================================================
## 4. BOHEMIA PORTS (directions, not built)
===============================================================================
- W1/W5 (hidden load + delayed displaced consequence): THE core upgrade for our fold/precedent system.
  Plant Bohemia choices whose TRUE stakes are invisible at decision-time and land a GENERATION later in
  a different quest (our Q040->042 resurfacing is the frame; add cases where the player never clocks
  WHICH earlier choice was load-bearing — a "quiet at the moment, loud at payoff" law).
- W2 (obvious-good trap): build at least one Bohemia choice where the reflexive good deed (save the
  visible victim) triggers a worse hidden outcome — good intentions != good outcomes (ties our Q037
  root-cause, Q048 hope). Use sparingly; it's potent and can feel unfair if overused.
- W3/W4 (no clean option + zero reward difference): our Megaton law usually DIVERGES rewards; bank the
  INVERSE tool for our heaviest moral forks — a choice with IDENTICAL material payoff so it's decided on
  pure ethics (a "conscience node" with no loot incentive). Powerful for the endgame Liberate/Respect/
  Become and for succession.
- W6/W10 (ambiguous petitioner + worship-of-the-monster): our Amalgamation cult (Q018) — the Homeless
  worship the servers they live on; a "savior" who's also a threat. Bank the morally-opaque quest-giver
  whose true nature you can't read at decision-time.
- W7 (order-dependent reactivity): let some Bohemia outcomes depend on the ORDER quests are done, not
  just the choices — hidden state that rewards replay and system-mastery (scope carefully per the
  Beyond-the-Beef "isolate the sandbox" law so it doesn't break the fold).
- W8 (the choice gallops away): a staging principle — when the dynasty sets a major consequence loose,
  SHOW it leave their control (a released prisoner walks out, a freed AI-fragment departs, the coolant
  vents) — consequence as a thing you can't recall.
- W9 (the descent): our Amalgamation approaches (Q024, Q050) already descend; keep matching staging to
  moral (go UNDER to face a buried truth).

---
# V2 PAYLOAD — BACKFILLED 7/16/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**THE SPIRIT IN THE TREE** — wants OUT. Claims to be a druid's ghost; is (per the Crones, who are liars, and per ambient evidence, which is ambiguous) possibly the Crones' MOTHER, something old and terrible. Will trade: the orphans' lives — it will spirit them away from the Crones' larder. Will never say: what it actually is, or what it did when it was loose. FUNCTION: the offer you cannot verify. The quest's entire craft is that BOTH readings survive contact with all evidence.

**THE CRONES** — want the spirit dead and the orphans kept (as food). FUNCTION: the counterparty so vile that helping them feels wrong even when it saves Anna. The quest weaponizes your disgust as misdirection.

**THE ORPHANS** — want to not be eaten. Cannot advocate; they don't know what they're in. FUNCTION: the stakes that make "kill the monster" cost something.

**JOHNNY / THE VILLAGERS OF DOWNWARREN** — want their ears to stop bleeding and their village to survive. FUNCTION: the local scale. Freeing the spirit kills Downwarren to a man — the village that sent you.

**GERALT** — has no stake. FUNCTION: the point. This is the questbook's cleanest case of a choice with no self-interested option: every branch spends OTHER people.

## V2-B THE CONVERSATIONS (node trees)

NODE: SPIRIT_OFFER — the cave under the tree, entry: sent by the Crones
  A voice, a heartbeat in the dark, a horse skull. It knows why you came and bids before you speak.
  > "The Crones sent me to kill you."      [gate: none]  -> S_COUNTER (it makes the orphan offer)
  > "What are you?"                        [gate: none]  -> S_DRUID_STORY (the unverifiable claim)
  > "Prove it."                            [gate: none]  -> S_NOPROOF — THE NODE THAT MAKES THE QUEST. It cannot prove it. It says so. The game REFUSES to sell certainty at any skill level, any sign, any dialogue depth. There is no Axii option, no Witcher-senses tell, no lore book that settles it.
  > (attack)                               [gate: none]  -> FIGHT (3b)
  NOVERB: "Let me come back after I've checked." — SEE STAGE 5's loophole: you physically CAN leave and return (the timing exploit), but no dialogue supports it. The system permits what the conversation won't name. Bank the gap: system-honesty vs conversation-framing.

NODE: THE_RITUAL — entry: agreed to free it
  Ravens, a horse, the bones. Mechanical, not conversational — the quest goes quiet on purpose. You do the deed in silence and the silence is where the doubt lives.

NODE: DOWNWARREN_AFTER — entry: spirit freed, village dead
  The survivor(s) name what came through. No accusation NODE exists pointing at Geralt — nobody knows it was you.
  NOVERB: "I did this." — CONFESSION DOES NOT EXIST. The game will not let you buy relief. Cross-ref Q126 PORT 7 (no comfort verbs); this is the same law from the other side: no CONFESSION verbs either. Guilt is not purchasable down.

## V2-C THE BRANCH MAP

COUNT: 3 local × the Q1 coupling = the real map.
B1 — KILL THE SPIRIT: Downwarren lives (ears cost an ear-tithe to the Crones), orphans are eaten OFFSCREEN LATER, Anna survives mad, the Baron leaves with her (Q1-B1).
B2 — FREE THE SPIRIT: orphans saved, Downwarren slaughtered, Anna dies, THE BARON HANGS (Q1-B2).
B3 — FREE IT VIA THE TIMING LOOPHOLE (do this quest before the Crones ever assign it): identical rescue, and the Crones' retaliation targeting shifts; the game honors sequence-mastery with a marginally softer wiring. WRITES: the same flags, earlier.
THE COMPILE FINDING (the questbook's single most-cited mechanic): THE FORK'S TRUE COSTS RESOLVE IN A DIFFERENT QUEST (Q1's Return to Crookback Bog), AFTER COMMITMENT, WITH NO PREVIEW. Player-facing information at decision time: two unverifiable stories and a bad feeling. This is the anti-telegraphing law: Bohemia never shows consequence tooltips on moral forks. The .bq expresses it by having NO mechanism for outcome preview at all — the format cannot render "this will result in X."

## SOURCES
Witcher Fandom wiki (free/kill/trick outcomes, the ritual ingredients, the timing-loophole + its
disputed orphan-rescue caveat); Game8 + TheGamer + SegmentNext + GamerGuides + Gamer Walkthroughs +
Sportskeeda (stage-by-stage, the endrega combat, the "identical rewards" note, the Anna/Baron payoff
chain); Steam/Reddit community threads (player consensus on the loophole + "you can't save both").
Cross-ref Questbook 01 (Bloody Baron) for the family-payoff side. FUTURE: Sasko commentary on designing
choices with no reward incentive (the "pure ethics" philosophy).

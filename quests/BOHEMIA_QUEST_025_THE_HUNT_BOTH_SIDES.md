# BOHEMIA — QUEST 025: "NO CLEAN SIDE"
Full production build. Built to the dialogue/scene spec; template = 001-024. Tier-2
BOTH-SIDES FORK (Vault #38 The Hunt Both Sides + tradition XXXVIII TLOU2 humanized-kill +
Hircine dual-hire shape). Name catalog-adjacent. First quest where two hirers want
OPPOSITE things and each is sympathetic — the player picks a side and lives with it.

Design soul: hunters hire the dynasty to kill a "beast" preying on a settlement; the
beast — a NeuroLinked person — begs the dynasty to turn on the hunters instead. Both
sides have a real case and real blood on their hands. The quest refuses a clean answer
and makes the player ENACT a side (TLOU2), then shows the cost from the other's eyes.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_no_clean_side
- tier: 2 (marked from either side; the player can be hired by hunters OR find the beast first)
- fold: which side the dynasty took (and how) shapes REMNANTS vs HOMELESS relations and
  the dynasty's reputation for whose lives it counts.
- entry_conditions: a REMNANTS-backed hunter party (led by CASS) is tracking a "beast"
  killing outlying scavengers; the "beast" (ROAN) can be encountered first if the player
  explores.
- faction_wires: REMNANTS (the hunters), HOMELESS (the beast is one of theirs, NeuroLinked),
  the settlement caught between.
- music_pool: TENSION; a driving hunt motif; a mournful counter-motif for the beast; both
  play, and the mix shifts toward whichever side the player leans (the score takes no side
  until the player does).
- ledger_writes: recorded[hunt_outcome_*]; UNRECORDED[whose_dead_you_counted]; REMNANTS
  and HOMELESS standing shift oppositely.
- amalgamation_thread: LIGHT — Roan's implant ties to the Network (the recurring
  abandoned-sentinel motif, Q010/Q013), but the quest is about the CHOICE, not the mystery.

===============================================================================
## 2. CAST
===============================================================================
- CASS (id: cass) — leads the hunter party; lost her brother to the "beast" and hunts with
  grief, not cruelty. Her people ARE dying. Sympathetic. default_emotion: grim_grieving.
  faction: REMNANTS.
- ROAN (id: roan) — the "beast": a NeuroLinked man whose implant makes him kill in fugue
  states he can't control or remember; between episodes, a horrified person begging to be
  stopped OR freed, not slaughtered. He HAS killed. Sympathetic. default_emotion: haunted_
  lucid -> fugue_violence. faction: HOMELESS.
- WITNESS PIP (id: wpip) — a settler who saw a killing and can testify to the FUGUE (Roan
  wept over the body after) — the evidence that complicates the hunt. default_emotion:
  shaken_honest.
- THE PLAYER — [MEDICINE]/[TRADES] (the implant — a third path), [READ], standing.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
DUAL-ENTRY (hired by Cass OR find Roan first) -> HUB investigation (hear both sides, find
the witness) -> a BOTTLENECK CHOICE: SIDE WITH HUNTERS (kill Roan), SIDE WITH ROAN (turn on
the hunters), the THIRD PATH (disable the implant — save Roan without betraying the hunters,
the hardest), or BROKER (get both to stand down). Then the quest shows the OTHER side's grief.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_cass
  speaker: cass  emotion: grim_grieving  gesture: grip_a_worn_scarf  camera: two_shot
  music:{pool:TENSION,cue:hunt_motif}
  line: "The thing out there took six of us. Took my brother — I buried what was left in a
         sack. We're not monsters, we're SCARED and we're DYING. Help us put it down and
         the settlement sleeps again. That's all I want. Just for it to STOP."
  -> goto hub
node open_roan  (alternate entry — player finds Roan first)
  speaker: roan  emotion: haunted_lucid  gesture: hands_shaking  camera: closeup
  line: "Don't— I'm lucid now, I'm ME now, please listen while I still am. I don't CHOOSE
         it. The implant takes me and I wake up with— with blood I don't remember. I've
         BEGGED them to lock me up. They'd rather hunt me than cage the thing wearing me.
         I'm not asking you to let me go. I'm asking you not to make it a SPORT."
  -> goto hub
node hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Hear the hunters out — ride with Cass.)"     -> cass_side   [once]
   - "(Hear Roan between episodes.)"                  -> roan_side   [once]
   - "(Find the witness, Pip.)"                       -> wpip_01     [once]
   - "[MEDICINE/TRADES] (Examine what the implant does.)" -> clue_implant [require skill.medicine>=2 OR skill.trades>=2][once]
   - "(Decide.)"                                      -> choice_gate [show after 2]
node cass_side
  speaker: cass  emotion: grim_grieving  camera: closeup  micro_expression: jaw_set
  line: "You want to know if it's really a person? I've asked myself at every grave. Here's
         what I know: person or not, it keeps KILLING, and understanding it won't unbury my
         brother. Mercy's a luxury for people who aren't next."
  effect: knowledge[cass_grief_is_real]  -> goto hub
node roan_side
  speaker: roan  emotion: haunted_lucid  camera: closeup  micro_expression: tears_of_shame
  line: "I know their faces. Every one. I see them when I close my eyes — the ones the
         thing in me took. I'm not asking forgiveness. I'm asking for it to END without
         them getting to enjoy it. And if there's a way to cut the thing OUT of me... I'd
         rather be free than dead. But I'll take dead over being a trophy."
  effect: knowledge[roan_is_a_victim_too]  -> goto hub
node wpip_01
  speaker: wpip  emotion: shaken_honest  gesture: wont_look_up  camera: two_shot
  line: "I saw it take Dello. But after— after, it CHANGED back. Knelt by the body and
         SOBBED. Called Dello's name like they were friends. A beast doesn't grieve what
         it kills. I don't know what that thing is. But it's not just a beast. I wish it
         were. Be easier."
  effect: knowledge[the_beast_grieves] (the fugue confirmed — complicates the kill)  -> goto hub
node clue_implant  [MEDICINE/TRADES]
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:cyan_hum_faint}
  line: "(Roan's implant is Network work — a fugue-driver, like the sentinels. It CAN be
         disabled — risky, but it would end the killings WITHOUT ending Roan. The hunters
         don't know this is possible. The third path exists. It's just harder than a bullet.)"
  effect: knowledge[implant_can_be_disabled] (unlocks the third path)  -> goto hub

--- THE CHOICE ---
node choice_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold_both_motifs}
  choices:
   - "(Side with the hunters — put Roan down.)"                 -> route_hunters
   - "(Side with Roan — turn on the hunters.)"                  -> route_roan
   - "[MEDICINE/TRADES] (Disable the implant — save Roan, spare the hunters.)" [require knowledge.implant_can_be_disabled] -> route_third
   - "(Broker a truce — cage, not kill; hunt ends.)"            -> route_broker
node route_hunters
  speaker: roan (dying, lucid)  emotion: relief_and_grief  camera: closeup  micro_expression: final_tears
  line: "...thank you. it's— it's quiet now. tell them— tell them I didn't want to. tell
         them I'm SORRY. tell them—" (gone)
  effect: Roan dead; the settlement safe; Cass's people grateful; REMNANTS standing+,
    HOMELESS standing- (they lost one of theirs to a hunt); recorded[sided_hunters];
    UNRECORDED[counted_the_settlers]=true. Then the quest SHOWS the cost: Roan's HOMELESS
    kin hold a small funeral and ask the dynasty why he didn't get a cage. -> goto aftermath
node route_roan
  speaker: cass (dying or defeated)  emotion: betrayed_grief  camera: closeup
  line: "You— you're siding with the THING? After what it— my brother— " (if lethal) "...I
         hope it was worth their— " (falls / is driven off)
  effect: the hunters are stopped (killed or routed); Roan lives (still implanted unless
    third path); the settlement feels ABANDONED (some more die if Roan fugues again);
    HOMELESS standing+, REMNANTS standing-; recorded[sided_roan]; UNRECORDED[counted_the
    _cursed]=true. The quest SHOWS the cost: Cass's survivors, and the settlers Roan may
    kill later. -> goto aftermath
node route_third  [MEDICINE/TRADES — the hardest, best]
  speaker: roan + cass  camera: two_shot  music:{pool:TENSION,cue:rising_hope}
  beats: disable the implant mid-standoff (a skill sequence under pressure — the hunters
    may fire; the player protects Roan long enough to cut the fugue-driver, nonlethal). If
    it works, Roan comes back to himself PERMANENTLY, the killings end, and Cass witnesses
    that the "beast" was a caged man all along.
  effect (success): Roan freed + the killings ended + NO betrayal of the hunters (they get
    their safety AND a truth); Cass, shattered, must reckon with having hunted a victim;
    recorded[found_the_third_path]; UNRECORDED[cut_the_curse_out]=true; mindmap CLUE
    [network_fugue_implants] (Reconstruction). Both factions' standing preserved/raised.
    The reconciliation only skill + courage buys. -> goto aftermath
node route_broker
  speaker: cass  emotion: reluctant_agreement  camera: two_shot
  line: "...A cage. Not a kill. If you can hold it — hold HIM — and the killing STOPS, I'll
         call off the hunt. I want my people safe. I never wanted to be an executioner. If
         there's another way to safe, show me."
  effect: Roan is caged/contained (not killed, not free); the hunt ends; an uneasy peace;
    recorded[brokered_the_hunt]; UNRECORDED[chose_the_cage]=true; both factions grudgingly
    accept; Roan alive but imprisoned (a later quest could free/cure him). -> goto aftermath
node aftermath
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:mournful_resolve}
  line: "(However it ended, you saw both griefs. The settlers who buried their own. The
         homeless who lost a man the world had already thrown away. There was no side that
         didn't bleed. There was only the side you chose to count.)"
  effect: locks the standing shifts + the fold echo; UNRECORDED[whose_dead_you_counted]
    finalized. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- HUNTERS: settlement safe, Homeless embittered; an heir inherits REMNANTS goodwill + a
  Homeless grudge (they remember the dynasty hunts their cursed).
- ROAN: Homeless loyal, settlement abandoned (possible later deaths); an heir inherits
  Homeless trust + Remnants/settler resentment.
- THIRD PATH: both factions preserved + a Reconstruction clue (network_fugue_implants) +
  Roan a living, grateful ally who can testify to the Network's cruelty; the best legacy.
- BROKER: an uneasy peace + a caged man (a future moral thread); moderate standing both ways.
- UNRECORDED[whose_dead_you_counted] colors how both factions read the dynasty's values.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the quest lives in TWO grieving faces — Cass's jaw-set grief and Roan's tears-of-
  shame + the fugue_violence transformation (universal damage-reveal: the implant's glow
  as he shifts — rhymes with Mara/Q010). Both must read fully human (TLOU2 + Megaton).
  Pip's honest reluctance. Procedural lip-sync; Roan's fugue-voice distorted, his lucid
  voice soft.
BODY: the hunt is a tracking/standoff (scheduler + Dead Eye if it turns); Roan's fugue is
  a distinct violent loop vs his lucid stillness; the third path is a skill sequence under
  fire (protect + disable, dodge not kill). 
CAMERA: two_shots for both sides' pleas, closeups for the grief, hold on the choice with
  BOTH motifs playing. The aftermath frames the OTHER side's mourning (forcing the look —
  TLOU2). Cuts on beat.
MUSIC: a hunt motif AND a mournful beast counter-motif play together; the mix leans toward
  whichever side the player favors (the score takes no side until you do); mournful resolve
  in the aftermath. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + both-sides)
===============================================================================
- Pacifist-completable via the THIRD PATH (disable, don't kill) or BROKER (cage) — both
  harder than picking a side and shooting. Lethal on either side is available and easier.
- Rewards diverge (Megaton law): each side gains one faction and loses the other; the
  THIRD PATH is the only route that doesn't sacrifice a faction (gated behind skill +
  courage — Undertale mercy-is-harder); BROKER is the compromise. No side is clean.
- Core technique (TLOU2): the player ENACTS a side, then the aftermath shows the other
  side's grief — humanizing the "enemy" by making you count their dead too. The score's
  no-side-until-you-choose reinforces it.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON with DUAL-ENTRY (hired by either side). Uses the universal
damage-reveal (Roan's fugue/implant) + the dual-motif score that leans with player choice
+ the "aftermath shows the other side" beat. Reads ledger/standing/skill/knowledge/fold;
writes same + oppositely-shifting REMNANTS/HOMELESS standing + a Reconstruction clue (third
path). Deterministic + save-through. Gate: dual-entry both work, all four routes resolve,
third path gated behind the implant clue + resolves nonlethally, standing shifts oppositely,
aftermath shows the unchosen side's grief. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-024)
New engine: the BOTH-SIDES FORK — two sympathetic hirers wanting opposite things (kill the
beast / spare the victim), where the player ENACTS a side and the aftermath forces them to
count the other side's dead (TLOU2 humanized-kill), with a skill-gated THIRD PATH that
betrays no one (the hardest, best road) and oppositely-shifting faction standing. Introduces
dual-entry and the no-side-until-you-choose score. Bible at 25; the game now makes you pick
between two real griefs and live in the aftermath of both.

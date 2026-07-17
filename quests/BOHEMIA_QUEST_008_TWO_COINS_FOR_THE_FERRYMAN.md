# BOHEMIA — QUEST 008: "TWO COINS FOR THE FERRYMAN"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-007. Tier-2 SLOW-BURN OF FAITH (Vault #28 + tradition VII Sinnerman + XXXV
Howard restraint). A quest that walks, doesn't shoot — witness a dying believer's
holy/monstrous choice, no combat solution, the game never tells you who was right.

Design soul: a man wants to die on his own terms for a reason the player finds
either holy or monstrous, and asks the dynasty only to witness — or to carry two
coins for a passage he believes is real. No Dead Eye solves this. The choice is
whether to enable, stop, or quietly redirect a dying dream, and the game refuses to
score it (Sinnerman: a mirror, not a puzzle).

===============================================================================
## 1. HEADER
===============================================================================
- id: q_two_coins
- tier: 2 (unmarked-leaning side; found by the reservoir at dusk)
- fold: how the dynasty handled ELIAS's passing becomes a quiet local legend an heir
  can encounter (the ferryman story persists, true or not).
- entry_conditions: player reaches the LAKE MEAD reservoir edge (rising water, canon)
  at dusk and finds ELIAS preparing a small raft.
- faction_wires: CHURCH (Elias's faith), VOLUNTEERS (would stop him), HOMELESS
  (the drowned district below the risen water — his destination).
- music_pool: a slow LAMENT baseline (no COMBAT pool loaded — the quest signals by
  its own silence that violence isn't the verb here); one held tone at the launch.
- ledger_writes: recorded[elias_outcome_*]; UNRECORDED[you_witnessed]=true if the
  player stays to the end regardless of route.
- amalgamation_thread: NONE (a human quest about faith and letting go).

===============================================================================
## 2. CAST
===============================================================================
- ELIAS KORE (id: elias) — ~70, a former ferryman/boatman who ran Lake Mead tours
  before the crash. When the water ROSE post-collapse it drowned his old town —
  including his wife's grave and the church where they married. He believes if he
  rows out to where the steeple still breaks the surface and goes under with "two
  coins for the ferryman," he'll cross to her. Gentle, certain, unafraid. baked rig:
  skin #6, weathered coat. default_emotion: serene_certain.
- SISTER MAREN (id: maren) — a VOLUNTEERS worker who's been trying to talk Elias down
  for weeks; believes it's suicide dressed as faith. default_emotion: worried_kind.
- THE PLAYER — [MEDICINE] (see he's also terminally ill), CHURCH/VOLUNTEERS standing,
  and a [READ] all shape lines. NO combat option exists that resolves anything.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE (talk with Elias, talk with Maren, in any order — no rush, restraint)
-> a single quiet BRANCH at the water's edge: ENABLE (row him out / give the coins),
STOP (physically prevent, or convince him to wait), REDIRECT (offer a different
meaning), or WITNESS ONLY (let him choose, stay to the end). No route is "correct."

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE RESERVOIR AT DUSK ---
node open_01
  speaker: elias  emotion: serene_certain  gesture: tie_off_raft  camera: two_shot
  music:{pool:LAMENT,cue:soft_enter}
  line: "Evening, friend. You're just in time to help an old ferryman push off. Don't
         look so worried — I've made this crossing a thousand times. Just never as
         the passenger."
  -> goto hub

node hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "Where are you rowing to?"           -> spoke_where   [once]
   - "Why now?"                            -> spoke_why     [once]
   - "[MEDICINE] You're sick. Aren't you." -> spoke_med    [require skill.medicine>=2][once]
   - "(Talk to Sister Maren.)"            -> maren_01      [once]
   - "(Sit at the water with him.)"       -> sit           (restraint; opens the edge)
   - "(Go to the water's edge decision.)" -> edge_gate     [show after >=1 spoke]

node spoke_where
  speaker: elias  emotion: wistful  gesture: point_at_water  camera: closeup
  line: "See where the steeple noses out of the water, far there? That's St. Genesius.
         Married Nora in it. Buried her beside it. Then the lake rose and took the
         whole town for itself. She's down there. I aim to knock on the door."
  effect: reveal knowledge[his_destination_is_the_drowned_church]  -> goto hub
node spoke_why
  speaker: elias  emotion: gentle_certain  camera: closeup  micro_expression: soft_smile
  line: "Because I can still row. Next year, maybe not. I'd rather cross under my own
         oar than be carried. Two coins under my tongue — one for me, one for the fare.
         That's how you pay the ferryman. Everybody forgot. I never did."
  -> goto hub
node spoke_med  [MEDICINE]
  speaker: elias  emotion: unsurprised  camera: closeup  micro_expression: calm_nod
  line: "You've a healer's eye. Yes. The cough's got roots now. I could rattle in a
         cot for a season, or I could row out while my arms still answer. Which would
         YOU pick, if the door was right there on the water?"
  effect: reveal knowledge[elias_is_dying]  -> goto hub

--- MAREN (the other conscience) ---
node maren_01
  speaker: maren  emotion: worried_kind  gesture: wring_hands  camera: two_shot
  line: "He's not well in the body OR the grief. That's not faith out there, it's a
         man rowing into a lake to drown by a steeple. Help me stop him. Please. I
         can't watch another one go under."
  choices (PLR):
   - "Maybe it IS faith. His to make."   -> maren_push
   - "You're right. Let's stop him."     -> route_stop (jump)
node maren_push
  speaker: maren  emotion: torn  camera: closeup  micro_expression: eyes_shine
  line: "...I don't know anymore. I've buried people who wanted to live and can't save
         one who wants to go. If you let him — stay with him. Don't let him cross alone
         and afraid. That much I'd ask."
  effect: knowledge[maren_would_settle_for_witness]  -> goto hub

--- THE WATER'S EDGE (the quiet branch) ---
node edge_gate (speaker: PLR)  camera: closeup  music:{pool:LAMENT,cue:hold}
  choices:
   - "(Row him out. Give him the crossing.)"        -> route_enable
   - "(Stop him. Carry him back.)"                  -> route_stop
   - "(Offer him another way to reach her.)"        -> route_redirect
   - "(Say nothing. Stay. Let him choose.)"         -> route_witness

===============================================================================
## 5. THE ROUTES (none correct; the game never scores it)
===============================================================================
node route_enable
  speaker: elias  emotion: profound_peace  camera: two_shot  music:{pool:LAMENT,cue:one_held_tone}
  line: "...Thank you. Take an oar. You'll make a fair ferryman yourself one day."
  beats: the player rows him to the steeple (grid movement over water; slow, no timer,
    no prompt — pure witness). At the steeple Elias places the second coin in the
    player's hand: "For your fare, when it's your turn." He goes under, calm.
  effect: recorded[ferried_elias]; UNRECORDED[you_witnessed]=true; player keeps THE
    COIN (a Family-Box relic — passes down the fold); the reservoir gains a quiet
    legend NPCs repeat. No judgment appears. -> END
node route_stop
  speaker: elias  emotion: gentle_disappointment  camera: closeup  micro_expression: dim
  line: "...All right. All right. You've strong arms and a kind heart and I'm too
         tired to fight both. But friend — you didn't save me. You only made me wait
         for a worse door."
  effect: recorded[stopped_elias]; Elias enters Volunteers care and dies within the
    season anyway, in a cot — the outcome Maren feared saving him INTO; UNRECORDED
    [made_him_wait]=true. An heir may hear he "went hard, indoors, angry at the water."
    The game does not tell you it was wrong. It just shows you the cot. -> END
node route_redirect
  speaker: PLR + elias
  camera: two_shot  music:{pool:LAMENT,cue:warm_low}
  line (PLR): "She's not only under the water, Elias. She's in the steeple you can see
         from the shore. Tend it. Ring the bell for her while your arms still answer.
         Let people row out to YOU."
  effect (if Elias accepts — needs CHURCH standing or a passed [READ]): he becomes a
    keeper of a shoreline shrine to the drowned town; lives out his season with
    purpose; the shrine becomes a real district landmark + a Volunteers/Church bond.
    recorded[redirected_elias]; UNRECORDED[gave_him_a_shore]=true. The hardest, warmest
    outcome — it doesn't deny his faith, it re-aims it (Undertale mercy-is-harder). If
    he REFUSES (low standing), it falls back to edge_gate. -> END
node route_witness
  speaker: elias  emotion: grateful  camera: closeup  micro_expression: eyes_wet
  line: "You won't row me and you won't stop me. You'll just... stay. That's the
         kindest thing anyone's done since Nora. Watch the water with me a while.
         Then I'll decide."
  beats: a long quiet beat at the shore (no timer). If the player truly waits, Elias —
    unpressured — MORE OFTEN chooses to wait till morning and accept Maren's care of
    his own will, OR rows out at dawn at peace. The player's stillness gives him the
    dignity of an UNCOERCED choice.
  effect: recorded[witnessed_elias]; UNRECORDED[you_witnessed]=true; outcome is HIS,
    not yours — the purest expression of the quest's thesis. -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- FERRIED: the coin is a Family-Box relic passed down; generations later an heir
  holding it can learn its story and the reservoir's "ferryman" legend — a soft,
  strange grace.
- STOPPED: an heir hears the bitter version (he died indoors, angry). No judgment,
  just the cot — the game trusts the player to feel it (Papers-Please restraint).
- REDIRECTED: the shoreline shrine persists as a landmark + a Church/Volunteers bond
  an heir inherits; the best, warmest fold echo.
- WITNESSED: the legend is gentler and truer — "a stranger sat with the old ferryman
  and let him choose." The dynasty is remembered for its restraint.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Elias is serene throughout — the power is his CALM against Maren's distress.
  Micro-expressions: soft_smile, calm_nod, and the only crack is dim/eyes_wet at the
  branch. Maren carries the tension (eyes_shine, torn). Procedural lip-sync, slow.
BODY: minimal, deliberate — tie_off_raft, point_at_water, the rowing (a slow grid
  traversal over water). NO combat animations load; the body language is all stillness.
CAMERA: two_shots at the water, closeups for the faces, and a WIDE hold on the steeple
  breaking the surface (the destination as image). The rowing is unhurried, uncut.
MUSIC: a LAMENT baseline, DUCKING to a single held tone at the crossing — the quest is
  scored like a funeral, not an action beat. No COMBAT pool loaded at all (the absence
  is the message: this is not a fight). 120 BPM.

===============================================================================
## 8. ROUTES + THE NO-COMBAT LAW HERE
===============================================================================
- There is NO combat resolution and the quest signals it by not loading the COMBAT
  pool. Drawing the Dead Eye here does nothing but frighten Elias and Maren and lock
  the warm routes — the game quietly refuses to let violence be the answer (Sinnerman:
  the quest is a mirror). This is the deliberate counterweight to the combat quests.
- Rewards diverge (Megaton law) but subtly: a relic (ferried), a shrine + bond
  (redirected), a legend (witnessed), or a cold cot (stopped). None is "optimal"; each
  is a different answer to "what do you owe a dying person's dream."
- Fully pacifist by nature (Pacifist Path Law) — this quest is the purest proof that
  a Bohemia quest can be COMPLETE with zero violence.

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Notable: this scene deliberately does NOT load the COMBAT
music pool and flags no-lethal-resolution, proving the engine supports fully non-violent
quests as first-class. Reads ledger/standing/skill/knowledge/fold; writes same + a
Family-Box relic (ferried) or a landmark (redirected). Deterministic + save-through.
Gate: all four routes resolve, redirect's accept/refuse both handled, the coin-relic
and shrine-landmark persist, drawing a weapon locks warm routes as intended. Joins suite.

## 10. WHAT THIS PROVES (vs 001-007)
Seventh distinct engine + the purest PACIFIST proof: a slow-burn faith quest with NO
combat resolution — a dying believer's holy/monstrous choice the game refuses to score
(Sinnerman + Howard restraint). It proves Bohemia can hold a quest entirely in
stillness and moral witness, scored like a funeral, and leave a relic/legend/shrine to
the fold. The counterweight to the pillar's power struggle. The bible now spans seven
engines including one that never lets you draw.

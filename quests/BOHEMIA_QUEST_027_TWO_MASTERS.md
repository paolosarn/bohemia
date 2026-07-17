# BOHEMIA — QUEST 027: "TWO MASTERS, ONE KNIFE"
Full production build. Built to the dialogue/scene spec; template = 001-026. Tier-2
DOUBLE-AGENT / competing-loyalties (Vault seed pool + tradition on Fallout Killian-vs-
Gizmo two-master + Alpha Protocol reputation-travels). Name catalog-adjacent. First quest
where the player is hired by TWO opposed powers for the SAME job and must play both,
pick one, or burn both — and the choice travels.

Design soul: two bosses, one errand, and whoever you truly serve defines the dynasty's
standing in a whole district. A shopkeeper and a casino boss each hire the dynasty to
deal with the OTHER; the player can play double-agent, honestly pick a side, expose both,
or unite them against a hidden third party. Trust is the currency, and betrayal travels
(Alpha Protocol) — this district remembers exactly how the dynasty plays.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_two_masters
- tier: 2 (marked; both hirers approach the dynasty near-simultaneously)
- fold: who the dynasty served (and whether it played straight) sets district trust +
  which power holds the block into the fold; a reputation for double-dealing follows the
  bloodline (Alpha Protocol).
- entry_conditions: in a contested block, shopkeeper-syndicate leader MAVIS and casino
  boss DRUFFO each hire the dynasty to undermine/remove the other.
- faction_wires: TRADES (Mavis's syndicate), MOB (Ruffo's casino), REMNANTS (law, watching),
  and a hidden REDS/NETWORK hand (the third party manipulating both).
- music_pool: TENSION; a two-faced motif (a theme that plays "honest" or "sly" depending on
  the player's dealings); resolve varies by route.
- ledger_writes: recorded[two_masters_outcome_*]; UNRECORDED[how_crooked_you_played];
  district-trust + block-owner persist; a DOUBLE-DEALER reputation flag (travels).
- amalgamation_thread: LIGHT — the hidden third party is Network-backed (they profit if
  the block tears itself apart — ties Q002's manufactured-feud); a [READ] exposes them.

===============================================================================
## 2. CAST
===============================================================================
- MAVIS (id: mavis) — leads a shopkeepers' syndicate; keeps the block's small vendors
  alive against the casino's squeeze; hard but principled. default_emotion: sharp_protective.
  faction: TRADES.
- DRUFFO (id: ruffo) — casino boss; provides the block's only steady jobs and protection,
  at a price; ruthless but keeps order. default_emotion: jovial_menacing. faction: MOB.
- THE HIDDEN HAND / AGENT SERA (id: sera) — a REDS/Network broker quietly funding BOTH sides'
  grievances so the block destabilizes and can be bought cheap. default_emotion: pleasant_cool.
- THE PLAYER — [READ] (spot the manipulation), [BARTER], [INTIMIDATE], standing; every
  dealing is logged toward a trust/double-dealer reputation.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
PARALLEL TRACKS (two hirers, two trust meters) -> investigation that can reveal the HIDDEN
HAND -> a BRANCH: SERVE MAVIS, SERVE RUFFO, DOUBLE-AGENT (play both, high risk), EXPOSE THE
HIDDEN HAND (unite them), or BURN BOTH (seize the vacuum — Become). Trust meters + the
double-dealer flag shape outcomes and travel to the fold.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_mavis
  speaker: mavis  emotion: sharp_protective  gesture: slap_a_ledger  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "Ruffo's casino is choking my vendors — 'protection' fees that are just extortion.
         I hear you get things done. Help me clip his reach and every shopkeeper on this
         block owes you. But I need to know you're MINE, not his. This block's too small for
         a fence-sitter."
  -> goto hub
node open_ruffo  (near-simultaneous)
  speaker: ruffo  emotion: jovial_menacing  gesture: pour_a_drink_uninvited  camera: two_shot
  line: "Ahh, the new talent! Mavis got to you first, I'd bet — she always does the wounded-
         shopkeeper song. Truth is her syndicate's skimming MY protection revenue and
         spreading tales. Help me put her back in her lane and there's steady work in it for
         you. Real money. Pick the winning table, friend."
  -> goto hub
node hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Hear Mavis's case in full.)"        -> mavis_case [once]
   - "(Hear Ruffo's case in full.)"         -> ruffo_case [once]
   - "(Investigate who's REALLY squeezing the block.)" -> clue_hidden [once]
   - "(Decide how to play this.)"           -> choice_gate [show after 2]
node mavis_case
  speaker: mavis  emotion: sharp_protective  camera: closeup
  line: "My vendors feed this block. Ruffo's fees doubled in a season for no reason I can
         find. Somebody's whispering in his ear that we're a threat. We're not. We're just
         TIRED of being squeezed. ...Though I'll admit I've squeezed back. Nobody's clean here."
  effect: knowledge[mavis_is_pressured_from_somewhere] (the fee spike is unexplained)  -> goto hub
node ruffo_case
  speaker: ruffo  emotion: jovial_menacing  camera: closeup  micro_expression: flicker_of_worry
  line: "I RAISED the fees because MY costs went up — some broker's been jacking my supply
         rates and feeding me intel that Mavis is organizing against me. Maybe she is. Maybe
         I'm being played. But a boss who looks weak gets eaten, so I squeeze. You'd do the same."
  effect: knowledge[ruffo_is_pressured_from_somewhere] (BOTH sides squeezed by an unseen
    party — the manufactured-feud pattern, ties Q002)  -> goto hub
node clue_hidden
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:cyan_hum_faint}
  line: "(Follow the money: Ruffo's supply-rate hikes and Mavis's 'threat' rumors trace to
         the SAME broker — Sera, REDS-flagged, Network-adjacent. She's funding both sides'
         fears so the block eats itself and she buys the wreckage. Neither boss knows. The
         feud is MANUFACTURED.)"
  effect: knowledge[sera_manufactured_the_feud] (unlocks EXPOSE route; ties Q002/Q007)  -> goto hub

--- THE CHOICE ---
node choice_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Serve Mavis honestly — clip Ruffo.)"                 -> route_mavis
   - "(Serve Ruffo honestly — check Mavis.)"                 -> route_ruffo
   - "(Play both — double-agent for max profit.)"            -> route_double
   - "(Expose Sera — unite Mavis and Ruffo.)" [require knowledge.sera_manufactured_the_feud] -> route_expose
   - "(Burn both — seize the block in the chaos.)"           -> route_burn
node route_mavis
  speaker: mavis  emotion: fierce_gratitude  camera: two_shot  music:{pool:TENSION,cue:honest_resolve}
  line: "You held to your word. The vendors will remember it — and so will I. Ruffo's clipped,
         the block breathes. You've got a home here whenever you want one."
  effect: Mavis's syndicate holds the block; TRADES loyal, MOB hostile; recorded[served_mavis];
    UNRECORDED[played_straight]=true; a HONEST-DEALER rep (travels — future hirers trust you).
    (If Sera unexposed, she keeps manipulating — a lingering thread.) -> END
node route_ruffo
  speaker: ruffo  emotion: expansive_approval  camera: two_shot
  line: "A straight player! Rare. Mavis is checked, order holds, and there's steady work at my
         table for you and yours. You backed the winner. Smart."
  effect: Ruffo's casino holds the block; MOB loyal, TRADES resentful; recorded[served_ruffo];
    UNRECORDED[played_straight]=true; HONEST-DEALER rep; (Sera thread lingers if unexposed). -> END
node route_double
  speaker: PLR  camera: closeup  music:{pool:TENSION,cue:sly_motif}
  beats: play both sides — take both payments, feed each just enough to keep hiring you. A
    high-wire sequence of trust checks; if a check FAILS, one side discovers the double-deal
    and it turns violent (Dead Eye/flee) with BOTH now against you.
  effect (success): maximum caps from both; BUT the DOUBLE-DEALER flag is set (travels HARD —
    future hirers distrust you, some quests lock, some open); UNRECORDED[played_both]=true;
    the block stays unstable (Sera profits). Rich, untrusted, and you fed the manufactured feud.
  effect (fail): both sides turn on the dynasty; a fight or a burned block; worst rep hit. -> END
node route_expose  [the clean win]
  speaker: PLR (to Mavis + Ruffo together)  camera: three_shot  music:{pool:TENSION,cue:resolve}
  line: "You two have been at each other's throats over fees and rumors — both planted by the
         same broker, Sera, so you'd wreck the block and she'd buy it for scrap. You're not
         each other's enemy. She is. Here's the proof."
  effect: Mavis and Ruffo, stunned, stand down and turn on Sera (REDS/Network rebuffed);
    the block stabilizes under an uneasy Mavis-Ruffo detente; recorded[exposed_sera];
    UNRECORDED[named_the_hidden_hand]=true; the dynasty earns BOTH factions' respect + a
    HONEST-DEALER rep; the Network's block-play is foiled (ties Q002/Q007 — a pattern the
    dynasty now recognizes). The best fold inheritance. -> END
node route_burn
  speaker: PLR  camera: wide_block  music:{pool:TENSION,cue:cold}
  beats: let both sides bleed each other (feed the feud), then move the dynasty's own people
    into the vacuum. A power grab.
  effect: the dynasty SEIZES the block (real territory + income); both Mavis and Ruffo broken;
    the block resents its new owner; recorded[burned_both]; UNRECORDED[took_the_vacuum]=true;
    a RUTHLESS rep (travels — feared, not trusted); Sera may even ally with the dynasty (two
    predators) — a dark thread. The Become play at its coldest. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD (reputation TRAVELS — Alpha Protocol)
===============================================================================
- SERVE (either): the served faction holds the block + owes the dynasty; HONEST-DEALER rep
  opens trust-gated quests later; the unexposed Sera lingers as a hook.
- DOUBLE-AGENT: rich now; the DOUBLE-DEALER flag makes future hirers wary (some quests lock,
  some cynical ones open); the block stays unstable; an heir inherits a distrusted name.
- EXPOSE: block stabilized, both factions' respect, Network foiled; HONEST-DEALER rep; the
  best legacy — and the dynasty now RECOGNIZES the manufactured-feud pattern (Q002/Q007
  synergy: seeing it once, they spot it faster later).
- BURN: the dynasty owns the block by force; RUTHLESS rep (feared); resentment simmers;
  Sera-as-ally is a dark future thread.
- The rep flags (honest/double/ruthless) TRAVEL — NPCs across the district (and future
  quests) react to how the dynasty played its two masters.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Mavis's sharp protectiveness, Ruffo's jovial menace with a flicker_of_worry (both
  are being played and half-know it), Sera's pleasant-cool broker calm (the recurring
  manipulator archetype — kin to Vance). The double-agent route reads tension in the player's
  own dialogue choices. Procedural lip-sync.
BODY: talk-idle + gesture one-shots (slap_a_ledger, pour_a_drink_uninvited); the double-agent
  route stages tense hand-offs; burn route shows the block's takeover (scheduler). Combat only
  on a failed double-deal or the burn.
CAMERA: two_shots for each master's pitch, closeup on the investigation, three_shot for the
  expose (both masters + player), wide_block for the burn. Cuts on beat.
MUSIC: a TWO-FACED motif — the same theme plays "honest" (warm, open) or "sly" (chromatic,
  slippery) depending on the player's dealings; honest resolve on serve/expose, cold on burn,
  sly on double. The score reflects how crooked you played. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + reputation-travels)
===============================================================================
- Pacifist-completable: serving, exposing, and even double-dealing can avoid combat (double
  only turns violent on a failed check); burn can be done by manipulation more than murder.
- Rewards diverge (Megaton law): DOUBLE = most caps + a distrusted name; SERVE = one faction
  + an honest rep; EXPOSE = both factions' respect + the Network foiled (least immediate cash,
  best future); BURN = territory + a feared name. No route is "optimal" — each sets a different
  REPUTATION that travels (Alpha Protocol: the district and future quests remember).
- Introduces the TRAVELING-REPUTATION system (honest/double-dealer/ruthless flags that gate
  and open later content) — a reusable reactivity engine.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Introduces the TRAVELING-REPUTATION flags (honest/double-dealer/
ruthless — persist + gate future quests) + the two-faced score (honest/sly variants) + dual
parallel trust meters. Reads ledger/standing/skill/knowledge/reputation/fold; writes same +
block-owner + reputation flags. Deterministic + save-through. Gate: both hirers' entries work,
all five routes resolve, double-agent success+fail handled, expose gated behind the hidden-hand
clue, reputation flags set + persist + travel, two-faced score reflects dealings. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-026)
New engine: the TWO-MASTERS double-agent quest — hired by opposed powers for the same job,
resolved by serve/double/expose/burn, where TRUST is the currency and REPUTATION TRAVELS
(Alpha Protocol: honest/double-dealer/ruthless flags gate future content). Reveals the
manufactured-feud pattern again (Q002/Q007 synergy — the dynasty learns to spot the Network's
divide-and-buy play). Introduces traveling-reputation flags + the two-faced score. Bible at
27; the district now remembers exactly how the dynasty plays, and the Network's block-game
has a recognizable signature.

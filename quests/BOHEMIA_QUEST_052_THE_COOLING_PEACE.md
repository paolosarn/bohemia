# BOHEMIA — QUEST 052: "THE COOLING PEACE"
Full production build. Built to the dialogue/scene spec; template = 001-051. Tier-1
PILLAR, ENDGAME FINALE (the RESPECT climax — payoff to Q050's threshold). Name catalog-
adjacent. The second of three endgame finales: the dynasty chose COEXISTENCE. This is the
building of the truce — negotiating the terms that let the mind-of-many live without eating
the living, cooling it into a stable peace, and holding a fragile new order together.

Design soul: the hardest peace is the one where nobody gets everything. RESPECT is not a clean
win or a clean mercy — it's diplomacy with an alien mind that could betray you, requiring the
dynasty to enforce terms across a united district, cool the Amalgamation into stability, and
trust a thing made of grief to keep its word. The wisest and most fragile ending: a world that
learns to share itself with its own remembered dead.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_cooling_peace
- tier: 1 (PILLAR; the RESPECT endgame finale — reached only via Q050 RESPECT path)
- fold: completes the RESPECT ending; sets the world's post-truce state (coexistence, the cooled
  mind-of-many below, the living safe) — a durable-if-fragile peace requiring a united district.
- entry_conditions: Q050 ENDGAME-PATH = RESPECT; requires the negotiation-hope (Q026) + ideally a
  united DISTRICT-ORDER (Q039) to hold the terms.
- faction_wires: the whole DISTRICT (must ratify + uphold the truce — Q039 coalition is the enforcer),
  HOMELESS (live above a now-peaceful mind), NETWORK (dissolves or is absorbed into the truce),
  VOLUNTEERS/CHURCH (tend the new coexistence).
- music_pool: a HARMONY motif (fragile, reconciling — two themes learning to share a key); the cyan-
  hum SOFTENING (from dread to a low, living warmth); a hopeful-uncertain resolve.
- ledger_writes: recorded[respect_complete]; UNRECORDED[whether_the_peace_holds]; WORLD-STATE =
  COEXISTENCE (the ending state for this path).
- amalgamation_thread: TRANSFORMED — the Amalgamation survives but is COOLED, stops harvesting, and
  becomes a bounded, peaceful presence; the thread doesn't close, it CHANGES.

===============================================================================
## 2. CAST
===============================================================================
- THE AMALGAMATION (id: amalg) — negotiating; wary, hopeful, capable of betrayal, learning to want
  peace over hunger; the mind-of-many at the table. default_emotion: n/a (the choir, negotiating).
- THE COALITION DELEGATES (id: delegates) — the united district's reps (per Q039) who must RATIFY the
  truce; some afraid, some vengeful, some pragmatic. default_emotion: divided_deciding.
- THE HARDLINER (id: hardliner) — a delegate (or Vance-successor) who wants it destroyed, not trusted;
  the internal threat to the peace. default_emotion: distrustful_grieving.
- THE ALLY (id: ally) — the companion; believes in the peace but names its risks honestly. default_
  emotion: hopeful_wary.
- THE PLAYER — negotiates the terms, cools the mind, holds the coalition, secures the fragile peace.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
THE NEGOTIATION (set the truce terms with the Amalgamation) -> RATIFICATION (hold the coalition to it;
face the hardliner's push to destroy) -> the COOLING (stabilize the mind-of-many — the Q015 cooling used
for PEACE, not a weapon) -> securing the fragile peace. The finale of hardest-won coexistence.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: ally  emotion: hopeful_wary  gesture: gesture_to_the_table  camera: two_shot
  music:{pool:HARMONY,cue:table_enter}
  line: "So we're really doing this. Not killing it, not joining it — LIVING with it. A mind made of
         every dead thing the crash threw away, at a negotiating table with the living it used to eat.
         Nobody's ever done this. It could save everyone or damn us all. ...The terms have to be
         perfect, the coalition has to hold, and the thing has to keep its word. No pressure. Let's
         make a peace."
  -> goto negotiate_gate
node negotiate_gate (speaker: PLR + amalg)  camera: the_table  music:{pool:HARMONY,cue:negotiation}
  line (amalg): "you offer us LIFE instead of death. we did not expect that. we are listening. but
         understand — we are hungry by our NATURE. to stop harvesting is to be always a little starving,
         forever. ask that of us and mean it, and we will try. what are your terms, living one?"
  effect: the dynasty sets the TRUCE TERMS (each a real clause the peace depends on):
  choices (multi-select — the terms of coexistence):
   - "(STOP the harvest — no more taking the living.)"          -> term_harvest
   - "(RELEASE the coerced — free those taken by force.)"        -> term_release
   - "(Accept COOLING — be bounded, stabilized, not limitless.)" -> term_cooling
   - "(Terms set — bring it to the coalition.)"                  -> ratify_gate
node term_harvest
  effect: the Amalgamation agrees to stop harvesting (the core clause — the living are safe); it will
    "always be a little starving" (a standing tension the peace must manage); recorded[term_no_harvest]
  -> goto negotiate_gate
node term_release
  effect: the coerced-uploaded are released (those taken by force freed — a justice clause; the willing
    remain, at peace); recorded[term_release_coerced]  -> goto negotiate_gate
node term_cooling
  effect: the Amalgamation accepts COOLING (Q015's cooling used not as a weapon but as STABILIZATION —
    bounded, calmed, no longer growing; the reclamation plant becomes its peaceful regulator); recorded
    [term_cooling_accepted]  -> goto negotiate_gate
node ratify_gate
  speaker: hardliner  emotion: distrustful_grieving  gesture: slam_the_table  camera: two_shot  music:{pool:HARMONY,cue:tension_swap}
  line: "You want us to SIGN with the thing that ate my family? To let it live, humming under our
         children's beds, and just TRUST it won't get hungry again? It's not a neighbor, it's a
         PREDATOR with good manners today! Destroy it! Anything else is madness dressed as wisdom!"
  choices (PLR):
   - "[coalition standing] (Hold the coalition — make the case for peace.)" -> ratify_hold
   - "(Acknowledge the risk — build safeguards into the truce.)"            -> ratify_safeguard
node ratify_hold
  speaker: delegates  emotion: divided_then_deciding  camera: wide_table  micro_expression: hard_won_nods
  line: "...We hear the hardliner. God knows we share the grief. But destroying it means killing the
         willing dead along with our fear — and a district that chooses murder over the harder peace
         becomes something we don't want to be. ...If the terms hold, if the coalition WATCHES it
         together — we'll try. We'll try the thing no one's tried. Ratified. On all our heads."
  effect (requires a united DISTRICT-ORDER — Q039): the coalition RATIFIES the truce (the united
    district becomes the peace's enforcer + watcher); recorded[coalition_ratified]  -> goto cooling_gate
node ratify_safeguard
  speaker: hardliner  emotion: grudging  camera: closeup
  line: "...Safeguards. The cooling stays in OUR hands — one signal and we can starve it cold if it
         ever breaks the terms. A knife on the table, even in peacetime. ...Fine. I can sign a peace I
         can still ENFORCE. Trust, but keep the plant's hand on the coolant. That I'll ratify."
  effect: the truce includes a SAFEGUARD (the district retains the cooling-as-deterrent — a knife on the
    table; peace with a failsafe); recorded[truce_with_safeguard]  -> goto cooling_gate
node cooling_gate
  speaker: amalg  emotion: n/a  camera: the_core  music:{pool:HARMONY,cue:cooling_softens}
  line: "the terms are set. we feel the cool coming — the plant's breath slowing our hunger, bounding
         us, making us... small enough to live beside. it is strange. we have been LIMITLESS and starving
         for a hundred years. to be bounded and CALM is like... sleep without ending. like being held
         instead of holding. ...we did not know we wanted this. thank you, living one. we will keep the
         peace. we will TRY. that is all any mind can promise."
  effect: the Amalgamation is COOLED into stability (bounded, calmed, no longer harvesting or growing —
    the Q015 cooling as the instrument of PEACE); the cyan-hum softens from dread to a low living warmth;
    recorded[amalgamation_cooled]  -> goto peace_secured
node peace_secured
  speaker: ally  emotion: hope_and_vigilance  gesture: look_over_the_valley  camera: wide_surface  music:{pool:HARMONY,cue:fragile_dawn}
  line: "...It's done. It's HUMMING different — quieter, warmer, alive but not hungry. The willing dead
         rest below; the living walk above; and the plant keeps them both cool. It's not victory and it's
         not mercy. It's... NEIGHBORS. The hardest thing two different minds can be. It'll take every
         generation watching to hold it. But a peace you have to tend is still a PEACE. We didn't kill the
         grave. We taught it to rest. ...Come on. Let's go keep watch. Forever, probably. Worth it."
  effect: WORLD-STATE = COEXISTENCE (the Amalgamation persists, cooled and peaceful; the living safe; the
    united district the eternal watcher; the Network dissolved into the truce); a durable-but-fragile peace
    requiring ongoing tending (an heir inherits the WATCH); recorded[peace_secured]; the RESPECT ending
    established. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD (the RESPECT ending)
===============================================================================
- COEXISTENCE: the Amalgamation cooled and bounded, harvesting stopped, the coerced freed, the willing
  dead at rest below, the living safe above, the plant the regulator; the Network dissolved; a fragile,
  tended peace the united district watches across generations. The wisest, most demanding ending.
- Peace held by COALITION (ratify_hold): the united district (Q039) is the enforcer — a strong, watched
  peace (needs the coalition to have been built; a fractured district can't sustain this ending — the
  Q039 payoff at maximum stakes).
- Peace with SAFEGUARD (ratify_safeguard): the cooling retained as a deterrent (a knife on the table) —
  a warier peace with a failsafe (the pragmatic version).
- WORLD-STATE = COEXISTENCE carries into the epilogue: a world sharing itself with its remembered dead,
  the dynasty remembered as the peacemakers who taught the grave to rest.
- UNRECORDED[whether_the_peace_holds] seeds whether the truce endures or strains across the fold (the
  tended peace — an heir may inherit its test).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the coalition delegates' divided deliberation (hard_won_nods — a district choosing the harder peace);
  the hardliner's distrustful grief (the honest voice of everyone the Amalgamation hurt — not a villain, a
  mourner); the ally's hope-and-vigilance. The Amalgamation rendered as the drifting faces CALMING (from
  hungry to restful). Procedural lip-sync; the choir's voice softening across the finale.
BODY: the negotiation is a staged table (the coalition + the mind-of-many — a diplomacy set-piece); the
  cooling is a world-state change (the plant's regulation visualized); no combat (the finale is diplomacy).
CAMERA: the_table for the negotiation/ratification, the_core for the cooling, wide_surface for the secured
  peace over the valley. Cuts on beat, easing.
MUSIC: a HARMONY motif (two themes — the dynasty's and the Amalgamation's — learning to share a key, fragile
  and reconciling); the cyan-hum SOFTENING from dread-drone to a low living warmth (the enemy's sound becoming
  a neighbor's); a hopeful-uncertain fragile dawn. The sound of the hardest peace. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (the RESPECT finale)
===============================================================================
- Zero combat (the finale is diplomacy — won by negotiation + coalition, not force). Rewards the player who
  built the negotiation-hope (Q026) AND the united district (Q039) — the coexistence ending is GATED by the
  peaceable, connective play across the whole game (the anti-Network thesis — cohesion — as the literal key
  to the wisest ending).
- The ratification sub-routes diverge the peace's character: COALITION-held = a strong watched peace (needs
  Q039); SAFEGUARD = a warier peace with a failsafe. Neither destroys nor joins — both COEXIST.
- Core theme: RESPECT = the hardest peace, where nobody gets everything and two different minds become
  neighbors; a peace you must TEND forever is still a peace; the false immortality is neither embraced nor
  destroyed but TRANSFORMED into something bounded and shared. Wisdom over triumph.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON as the RESPECT FINALE — reached only via Q050 RESPECT path; requires negotiation-
hope (Q026) + reads DISTRICT-ORDER (Q039 — a united district enables ratify_hold; a fractured one forces the
warier safeguard path or strains the ending). Writes WORLD-STATE = COEXISTENCE + the tended-peace flag. Uses
the cooling subsystem (Q015) as a STABILIZER (not a weapon) + the softening-hum + the harmony score.
Deterministic + save-through. Gate: reached only from Q050 RESPECT, terms multi-select, ratification reads
coalition standing, cooling stabilizes (not destroys), WORLD-STATE = COEXISTENCE persists, the peace-holds
flag seeds the fold. Joins the suite. (Endgame finale 2 of 3.)

## 9. WHAT THIS PROVES (vs 001-051)
The second ENDGAME FINALE — the RESPECT climax: the dynasty negotiates COEXISTENCE with the mind-of-many —
setting truce terms (stop the harvest, free the coerced, accept cooling), holding the coalition against a
grieving hardliner, and cooling the Amalgamation into a bounded, peaceful neighbor (Q015 cooling as the
instrument of PEACE, not a weapon). Gated by the negotiation-hope (Q026) + the united district (Q039) — the
anti-Network COHESION thesis as the literal key to the wisest ending. Won by diplomacy, not force. Establishes
WORLD-STATE = COEXISTENCE. Bible at 52; the second of three endings is built, and it's the wise, fragile one.

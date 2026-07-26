# BOHEMIA — QUEST 031: "THE DATABANK SHE WON'T HAND OVER"
Full production build. Built to the dialogue/scene spec; template = 001-030. Tier-2
HEIST / loyalty-vs-law (Vault #31 Databank / Cyberpunk Sandra Dorsett + tradition on the
recorded-vs-unrecorded ledger, loyalty vs rules). Name from the vault. First dedicated
HEIST/infiltration quest — proves the immersive-sim deep-sim (Thief/Deus Ex) as a Bohemia
verb, and turns on a personal debt that pulls against the dynasty's stated rules.

Design soul: doing right by a person can mean doing wrong by the rules. Someone the dynasty
once saved asks help stealing back a databank too personal to trust to a fixer — going off
the books honors a bond but breaks the dynasty's own code. A heist where the real tension is
whether loyalty or law wins, and the ledger remembers which.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_databank
- tier: 2 (marked; a personal favor from a past-saved NPC)
- fold: honoring the bond vs following the rules shapes the dynasty's reputation for loyalty
  vs order, and whether SANNE (the asker) becomes a lifelong ally or a cut tie.
- entry_conditions: SANNE, an NPC the dynasty rescued in a prior quest (or a generic "you
  saved my life once"), asks help recovering a stolen databank from a fixer's vault.
- faction_wires: TRADES (the fixer holds it), MOB (vault security), REMNANTS (the "law" the
  dynasty may answer to), the personal bond with Sanne.
- music_pool: TENSION; a tight HEIST motif (rhythmic, tense, low); COMBAT if the heist goes
  loud; a warm resolve if the bond is honored.
- ledger_writes: recorded[databank_outcome_*]; UNRECORDED[loyalty_or_law] (the core axis);
  Sanne-bond persists.
- amalgamation_thread: LIGHT-optional — the databank MIGHT contain a fragment of Network data
  (Sanne's dead partner's uploaded portrait) — a tender micro-tie to the Reconstruction if the
  player reads it; easily left personal.

===============================================================================
## 2. CAST
===============================================================================
- SANNE (id: sanne) — an NPC the dynasty once saved; now begs help stealing back a databank the
  fixer VELL seized as "collateral." It holds the only surviving recording of her dead partner's
  voice (and maybe more). She can't trust a fixer with it — only the dynasty. default_emotion:
  raw_trusting. faction: none / civilian.
- FIXER VELL (id: vell) — holds the databank in a guarded vault; a by-the-book operator who
  considers it legally his (Sanne's debt collateral). Not a monster — he has a CLAIM. default_
  emotion: coolly_legal. faction: TRADES.
- CONSTABLE DRE (id: dre) — REMNANTS; if the dynasty has a "law-and-order" standing/rep, Dre
  expects it to respect Vell's legal claim (the RULES pulling against the bond). default_emotion:
  principled_watchful. faction: REMNANTS.
- THE PLAYER — [READ]/[TRADES] (crack the vault), stealth/dodge (Pacifist heist), standing.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HEIST STRUCTURE: plan (case the vault: guards, routes, the crack) -> execute (a deep-sim
infiltration — stealth/hack/social, Dead Eye only if loud) -> a resolution FORK: STEAL IT
(honor the bond, break the rules), BUY IT BACK (lawful, costs the dynasty), NEGOTIATE (get
Vell to release it — hardest), or TAKE THE LAWFUL SIDE (side with Vell/Dre against Sanne — the
cold-rules choice). The AXIS is loyalty vs law throughout.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: sanne  emotion: raw_trusting  gesture: press_your_hands  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "You saved me once. I've got no right to ask more, but you're the only one I'd trust
         with this. Vell took my databank as 'collateral' on a debt I'll never clear. It's got
         the last recording of Dov's voice — the only piece of him left. A fixer could sell that,
         or wipe it. Help me steal it back. I know it's against your rules. That's WHY I need
         someone whose rules I'd trust to break."
  choices (PLR):
   - "I'll get it back. However it takes."   -> heist_hub
   - "Is it really just his voice?"           -> spoke_contents
   - "There might be a lawful way."           -> spoke_lawful
node spoke_contents
  speaker: sanne  emotion: aching  camera: closeup  micro_expression: voice_catches
  line: "His voice. His laugh. A song he made me. And— (quieter) some data he pulled from the
         old servers before he died, said it was 'proof of something,' never told me what. I
         don't care about that part. I care about hearing him say my name again. Please."
  effect: knowledge[databank_holds_a_reconstruction_fragment] (optional Amalgamation micro-tie)
  -> goto heist_hub
node spoke_lawful
  speaker: sanne  emotion: bitter  camera: closeup
  line: "Lawful? The 'law' says it's Vell's now. The law made it collateral. If you follow the
         law here, you follow it right past me. ...But you decide whose rules matter. That's the
         whole ask."
  effect: knowledge[the_law_favors_vell] (the tension named)  -> goto heist_hub

--- THE HEIST (deep-sim planning + execution) ---
node heist_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Case the vault — guards and routes.)"     -> plan_case  [once]
   - "(Find the vault's weakness — the crack.)"    -> plan_crack [once]
   - "(Talk to Vell first — gauge the claim.)"     -> vell_01    [once]
   - "(Execute the plan.)"                          -> execute_gate [show after case+crack OR vell]
node plan_case
  speaker: PLR (internal)  camera: vault_exterior  music:{pool:TENSION,cue:heist_low}
  line: "(Vell's vault: two guards on rotation, a MOB-hired lock, a maintenance shaft nobody
         watches. A quiet way in exists — for someone patient. Loud is possible too, but loud
         brings the Remnants, and the Remnants side with the paper.)"
  effect: knowledge[the_quiet_route_exists]  -> goto heist_hub
node plan_crack
  speaker: PLR (internal)  camera: closeup
  line: "([TRADES]/[READ]: the lock's a salvaged Network model — same tech as everything else in
         this city. Crackable in silence with the right touch, or brute-forced with noise. The
         databank sits in a personal-effects drawer, not the money vault — Vell keeps it separate.
         Almost like he knows what it's worth to someone.)"
  effect: knowledge[the_crack_method]  -> goto heist_hub
node vell_01
  speaker: vell  emotion: coolly_legal  gesture: tap_a_contract  camera: two_shot
  line: "The Dov databank? Legally mine — signed collateral, her mark's right here. I'm not a
         monster; I haven't sold it. But a debt's a debt. If you're here to threaten me, know the
         Remnants back my paper. If you're here to DEAL... I'm a reasonable man with a price."
  effect: knowledge[vell_will_deal] (opens buy/negotiate routes)  -> goto heist_hub

--- EXECUTION + RESOLUTION ---
node execute_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Steal it — quiet heist, honor the bond.)"   -> route_steal [require knowledge.the_quiet_route_exists OR the_crack_method]
   - "(Buy it back from Vell — lawful, costly.)"    -> route_buy [require knowledge.vell_will_deal AND currency]
   - "(Negotiate its release — no caps, no theft.)" -> route_negotiate [require skill.barter>=3]
   - "(Side with Vell — the debt stands. Tell Sanne no.)" -> route_lawful
node route_steal
  speaker: sanne  emotion: overwhelmed_grateful  camera: closeup  micro_expression: tears
  music:{pool:TENSION,cue:warm_resolve}
  line: "(you hand her the databank; she plays it; a dead man's voice says her name) ...Dov. Oh
         God, that's— that's HIM. You broke your own rules for me. I'll never forget which way
         you chose when it counted. Never."
  effect: databank recovered by theft; Sanne a lifelong ALLY; recorded[stole_the_databank];
    UNRECORDED[chose_loyalty_over_law]=true; a DOUBLE-DEALER/lawbreaker nudge to rep (if REMNANTS
    aligned, standing-); optionally banks the Reconstruction fragment if read. The bond honored,
    the code bent. -> END
node route_buy
  speaker: vell  emotion: satisfied  camera: two_shot
  line: "Pleasure. Clean and legal. Tell Sanne her debt bought something back for once." (hands
    it over)
  effect: currency-=big; databank recovered lawfully; Sanne grateful (bond honored WITHOUT breaking
    the code — but the dynasty PAID for it); recorded[bought_the_databank]; UNRECORDED[honored_both]
    =true; REMNANTS/law standing preserved. The costly-clean route. -> END
node route_negotiate  [BARTER — hardest]
  speaker: vell  emotion: grudging_respect  camera: closeup  micro_expression: reluctant_nod
  line: "...You're arguing that a dead man's voice isn't collateral, it's a GRAVE, and selling it
         makes me a grave-robber not a fixer. ...Damn you, that's a good argument. Take it. The
         debt stands but the VOICE goes home. Don't make me regret being talked to."
  effect: databank released WITHOUT theft OR full payment (a BARTER win reframing the moral claim);
    Sanne's debt persists but the personal item is freed; recorded[negotiated_the_databank];
    UNRECORDED[found_the_third_way]=true; both Sanne AND Vell/law respect the dynasty. The wisest
    outcome. -> END
node route_lawful
  speaker: sanne  emotion: shattered_betrayed  camera: closeup  micro_expression: face_falls
  line: "...You're siding with the PAPER. Over me. Over Dov's voice. I saved my trust for the one
         person I thought had— (she stops) ...no. You follow your rules. I hope they keep you warm."
         (she leaves; the bond is severed)
  effect: recorded[sided_with_law]; UNRECORDED[chose_law_over_loyalty]=true; Sanne is LOST as an
    ally (a cut tie an heir inherits as a cold acquaintance); REMNANTS/order standing+; the dynasty
    kept its code and lost a person. The cold-principled choice (the game doesn't say it's wrong —
    order has value too — but it shows the human cost). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- STEAL: Sanne a lifelong ally (recurring aid across the fold); a lawbreaker mark (order-aligned
  factions warier); the bond over the code.
- BUY: the bond honored AND the law kept — but the dynasty is poorer; the balanced, costly good.
- NEGOTIATE: the wisest — both Sanne and Vell respect the dynasty; the item freed, the law intact,
  no caps spent; the reputation-gold outcome.
- LAWFUL: the code kept, Sanne lost; order-factions trust the dynasty more; an heir inherits a
  reputation for rules over relationships (opens some doors, closes others).
- Optional: if the Reconstruction fragment (Dov's "proof of something") is read, it banks a minor
  mystery clue — a tender path into the main plot through a love story.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Sanne's raw trust and its payoff (tears on steal, face_falls on lawful) is the emotional
  spine; Vell's coolly-legal composure cracking to grudging_respect on negotiate; Dre's principled
  watchfulness. Procedural lip-sync; the databank playback (Dov's recorded voice) is a diegetic
  audio beat — a dead man's voice in the room.
BODY: the heist is a deep-sim traversal (stealth/dodge, guard patrols via scheduler, the crack a
  skill beat); loud = Dead Eye. Gesture one-shots (press_your_hands, tap_a_contract).
CAMERA: two_shots for the personal beats, vault_exterior + tight infiltration framing for the
  heist, closeup on the databank playback (Sanne's face hearing Dov). Cuts on beat.
MUSIC: a tight rhythmic HEIST motif (tense, low, patient); COMBAT if loud; a WARM resolve when the
  voice plays (the bond honored); the diegetic recording (Dov's voice/song) cuts through. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + loyalty-vs-law)
===============================================================================
- Pacifist-completable: the heist can be fully stealth (no kills); buy/negotiate/lawful are non-
  combat. Loud Dead Eye is a failure-adjacent option, not required.
- Rewards diverge (Megaton law): STEAL = a lifelong ally + a lawbreaker mark; BUY = both honored +
  poorer; NEGOTIATE = the reputation-gold third way (respect all around); LAWFUL = order-standing +
  a lost friend. The AXIS is loyalty vs law, and every route trades one for the other — no free
  reconciliation except the skill-gated negotiate.
- Introduces the HEIST/deep-sim verb (Thief/Deus Ex infiltration) as a first-class Bohemia
  structure — reusable for future infiltrations.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON with a HEIST structure (plan -> deep-sim execute -> resolution). Uses
the scheduler's live patrols + a stealth/dodge layer + a crackable-lock skill beat + diegetic audio
playback (a recorded voice). Reads ledger/standing/skill/knowledge/currency/reputation/fold; writes
same + Sanne-bond + a loyalty/law rep flag + optional Reconstruction fragment. Deterministic + save-
through. Gate: heist plannable + executable (quiet AND loud), all four resolutions resolve, negotiate
gated behind barter, the bond/rep flags set + persist, diegetic playback fires, optional fragment
banks. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-030)
New engine: the HEIST / loyalty-vs-law quest — a deep-sim infiltration (Thief/Deus Ex) turning on a
personal debt that pulls against the dynasty's own rules, resolved by steal/buy/negotiate/lawful,
where the AXIS is loyalty vs law and every route trades one for the other. Introduces the heist/
deep-sim verb + diegetic recorded-voice playback + a tender love-story path into the Reconstruction.
Bible at 31; infiltration is now a first-class verb, and the ledger remembers whether the dynasty
keeps its code or its bonds.

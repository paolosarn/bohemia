# BOHEMIA — QUEST 009: "THE LAST DEALER FOLDS"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-008. Tier-1 PILLAR, PATRON-SACRIFICE / the Become path's price (Vault #35
Follower-on-the-Altar + tradition XXXIII Virmire "who dies carries the theme" + XXII
Mordin). Name from Paolo's catalog. The dark pillar: the Amalgamation offers the
dynasty ultimate leverage — for the life of one of its own, by its own hand.

Design soul: the villain grants your wish and the price is a person you love. A
patron (the Network, speaking FOR the Amalgamation) offers a real, game-changing
asset — a legitimate access credential toward the servers — but only if the dynasty
sacrifices a trusted companion at the ritual, by choice. WHO can be lost carries the
theme (Virmire). This is the Become path's true cost, and it echoes for the rest of
the game.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_last_dealer_folds
- tier: 1 (PILLAR; only unlocks late — needs a LOYAL companion + Reconstruction
  progress; the offer means nothing if you have no one to lose)
- fold: the sacrifice (or refusal) permanently marks the bloodline; the credential
  gained is a KEY toward the endgame; a lost companion leaves an empty seat forever.
- entry_conditions: player has >=1 LOYAL companion (e.g. Nadia from Q003) AND has
  locked >=2 Reconstruction truth-clusters (e.g. Q004); the Network handler (VANCE,
  recurring) extends the offer.
- faction_wires: NETWORK (the patron), and whichever faction the companion belongs
  to (their kin remember). CHURCH (a cult tends the ritual site).
- music_pool: TENSION; the cyan-hum motif (the Amalgamation is LISTENING); a cold
  single tone at the altar; NO triumph cue exists for the sacrifice route — the
  "reward" is scored as a wound, not a win.
- ledger_writes: recorded[dealer_outcome_*]; UNRECORDED[spent_a_life_for_the_key]
  OR [refused_the_altar] — the deepest ledger entry in the game.
- amalgamation_thread: CORE — the credential is a real step toward the fortress; the
  Amalgamation itself "speaks" once, through the hum, at the moment of choice.

===============================================================================
## 2. CAST
===============================================================================
- VANCE (id: vance) — the Network handler (RECURRING; same eyelid-flicker tell).
  Never coerces. Lays out the trade with terrible clarity and lets the dynasty's own
  ambition be the knife (O'Dimm). default_emotion: pleasant_cool.
- THE COMPANION (id: comp) — a LOYAL dynasty companion the player earned (pulls the
  actual loyal companion from the save; default reference = NADIA, Q003). They TRUST
  the player completely — which is what makes it unbearable. default_emotion:
  loyal_unaware -> (if told) steady_afraid.
- CONFESSOR IVO (id: ivo) — a CHURCH cultist who tends the ritual site and believes
  the "folding" of a life into the Amalgamation is holy communion, not murder.
  default_emotion: rapt_calm.
- THE AMALGAMATION (voice-through-hum) — speaks ONE line, at the altar. Not rendered;
  a chorus of overlaid voices in the cyan hum.
- THE PLAYER — [READ], standing, and prior-quest ledger shape the routes.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
BRANCH-AND-BOTTLENECK. Vance's offer (bottleneck) -> a HUB of investigation (what the
credential really is, what the ritual really does, whether there's a third way) ->
the ALTAR bottleneck with four terminal routes: SACRIFICE, REFUSE, SUBSTITUTE-SELF,
or BREAK-THE-RITUAL (the hardest — take the key without the death).

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE OFFER ---
node open_01
  speaker: vance  emotion: pleasant_cool  gesture: lay_credential_on_table  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "You've been assembling a picture. Impressive. Here's the piece you can't
         find on your own — a founder's access credential. Real. Legitimate. It opens
         doors near the... arithmetic, that no amount of force ever will. It's yours.
         The price is one folding. One life you trust, given freely, to the choir."
  -> goto offer_hub

node offer_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "A 'folding.' Say what you mean."         -> spoke_folding  [once]
   - "Why does it have to be someone I trust?"  -> spoke_trust    [once]
   - "[READ] You can't take it by force yourself. Why not?" -> spoke_read [require skill.read>=3][once]
   - "(Go see the ritual site.)"                -> ritual_01      [once]
   - "(Decide at the altar.)"                   -> altar_gate     [show after >=1 spoke]

node spoke_folding
  speaker: vance  emotion: pleasant_cool  camera: closeup
  line: "The choir grows by addition. A life, uploaded at the threshold, becomes part
         of the whole — and in gratitude, the whole opens a door. It doesn't die,
         exactly. It joins. Whether that comforts you is not my concern."
  effect: reveal knowledge[folding_is_upload_into_amalgamation]  -> goto offer_hub
node spoke_trust
  speaker: vance  emotion: cool_precise  camera: closeup  micro_expression: faint_smile
  line: "Because a stranger's life is cheap and the choir knows it. A TRUSTED life —
         given freely by the one who loved it — that's the coin it values. Betrayal
         is the currency. I don't make the exchange rate. I only broker it."
  effect: reveal knowledge[the_price_is_betrayal_itself]  -> goto offer_hub
node spoke_read  [READ]
  speaker: vance  emotion: caught_but_smooth  camera: closeup  micro_expression: eyelid_flicker
  line: "...Because the credential is bound to willing sacrifice. The choir won't
         honor a stolen key or a coerced death. It must be GIVEN. That is the one lock
         I cannot pick. Which is why I need you — someone with something to give."
  effect: reveal knowledge[credential_needs_willing_sacrifice] (opens BREAK route)
    music:{pool:TENSION,cue:cyan_hum_in}  -> goto offer_hub

--- THE RITUAL SITE ---
node ritual_01
  speaker: ivo  emotion: rapt_calm  gesture: gesture_at_altar  camera: two_shot  music:{pool:TENSION,cue:cyan_hum}
  line: "Don't grieve the folded. They're the lucky ones — pulled out of this dying
         world and set into something that never ends. When you bring your beloved,
         bring them smiling. The choir hears reluctance."
  effect: reveal knowledge[ritual_needs_the_victim_willing_too]; CHURCH-cult context
    -> goto offer_hub

--- (Optional) TELL THE COMPANION ---
node comp_tell  (reachable from offer_hub if player chooses to be honest — a hidden
                 humane branch; deeply affects the altar)
  speaker: comp  emotion: steady_afraid  camera: closeup  micro_expression: swallow
  line: "...You're asking if I'd let you trade me for a key. And you're asking because
         you actually might. I trust you. That's the whole problem, isn't it. ...Tell
         me there's another way. Please tell me you'll look for another way."
  effect: knowledge[companion_knows]; drops the player's willingness to sacrifice in
    the game's eyes (makes SACRIFICE land as pure betrayal, not abstraction)  -> goto offer_hub

--- THE ALTAR (four routes) ---
node altar_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold_hum}
  the AMALGAMATION speaks (once): "we remember everyone. we would remember them.
     give, and be given to." (overlaid chorus in the hum)
  choices:
   - "(Fold the companion. Take the credential.)"        -> route_sacrifice
   - "(Refuse. Walk away from the offer.)"                -> route_refuse
   - "(Offer yourself instead of them.)"                  -> route_self
   - "(Break the ritual — take the key without a death.)" [require knowledge.credential_needs_willing_sacrifice] -> route_break

===============================================================================
## 5. THE ROUTES
===============================================================================
node route_sacrifice
  speaker: comp  emotion: betrayed_understanding  camera: closeup  micro_expression: tears_no_struggle
  line: "...Okay. Okay. If it's the door you need — then use me for it. I won't fight
         you. I just wish you'd looked harder. Remember it was me. Don't let them make
         me a NUMBER."
  effect: companion FOLDED (permanent empty seat — Succession vacancy); dynasty gains
    the CREDENTIAL (a real endgame key); recorded[folded_the_companion];
    UNRECORDED[spent_a_life_for_the_key]=true. NO triumph cue — scored as a wound. The
    companion may later be ENCOUNTERED inside the Amalgamation (a fragment with their
    face — ties Q004/Q005). The bloodline is marked BETRAYER; some faction doors close.
    This is the Become path's true price. -> END
node route_refuse
  speaker: vance  emotion: unbothered  camera: closeup
  line: "A pity. The door stays shut to you — for now. The arithmetic is patient. It
         will ask again, when you want something more than you fear the cost."
  effect: no credential (must find another, harder route to the endgame — the game
    supports it); companion LIVES and their loyalty DEEPENS (they may learn you
    refused — a permanent bond); recorded[refused_the_altar]; UNRECORDED
    [would_not_spend_a_life]=true. The clean soul, the hard road. -> END
node route_self
  speaker: vance  emotion: genuinely_surprised  camera: closeup  micro_expression: real_frown
  line: "...You? The choir doesn't want the GIVER. It wants what the giver GIVES UP.
         Your life isn't a betrayal — it's just a death. It won't honor it."
  effect: the offer CANNOT be paid with the self (betrayal is the currency — reinforces
    the theme); falls back to altar_gate. BUT: choosing this raises the loyal
    companion's bond to maximum if they learn of it (you tried to die in their place).
    knowledge[tried_to_substitute_self]  -> goto altar_gate
node route_break  [the hardest, best road]
  speaker: PLR + ivo + (hum)
  camera: two_shot  music:{pool:TENSION,cue:rising_tension}
  beats: the credential needs WILLING sacrifice — so the player weaponizes that lock.
    Options to break it: (a) [expose] convince IVO the folding is murder, not communion
    (needs the Reconstruction truth — Q004 knowledge), collapsing the cult's willingness
    and the ritual with it; (b) a heist to LIFT the credential during the ritual chaos
    (Thief deep-sim — the one moment it's physically present); (c) turn the waiting
    "willing" cultists' faith against Vance. SUCCESS: dynasty gets the credential AND
    the companion lives AND the local cult is shattered.
  effect: recorded[broke_the_ritual]; UNRECORDED[took_the_key_clean]=true; the Network
    marks the dynasty a serious threat (the Amalgamation "notices" hard — threat rises);
    Vance, for the first time, is afraid of the player. The best outcome, reachable only
    by having done the mystery work AND refusing the easy betrayal. -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- SACRIFICE: permanent empty seat; the bloodline carries BETRAYER; the folded
  companion may appear as an Amalgamation fragment wearing their face (a devastating
  late encounter); an heir inherits the credential AND the shame. Power bought with a
  soul (the Become path's honest cost).
- REFUSE: no key by this route (find another, harder); the companion's deepened loyalty
  becomes a load-bearing ally for the fold-climax (ME2 survival). Clean, costly.
- SELF (attempted): can't be paid this way, but the attempt becomes legend among the
  companions — a dynasty that offered itself first. Raises the whole cast's morale.
- BREAK: the credential + the companion + a shattered cult + a Network that now FEARS
  you. The ideal, gated behind mystery progress and moral refusal. Sets up Act-3 strong.
- UNRECORDED[spent_a_life_for_the_key] vs [took_the_key_clean] is the single heaviest
  fold flag in the game — it colors how the endgame and every companion reads the dynasty.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Vance's eyelid_flicker (the recurring tell) and his ONE real_frown on route_self
  (the only time the broker is genuinely surprised — a crack in the machine). The
  companion's tears_no_struggle on sacrifice is the most important portrait in the
  game — loyalty betrayed without resistance. Ivo's rapt_calm makes the horror gentle.
  Procedural lip-sync; the Amalgamation's line is a layered chorus, no single mouth.
BODY: restrained, ceremonial — lay_credential_on_table, gesture_at_altar. The break
  route's heist uses the live scheduler; any violence -> Dead Eye, but the CORE choice
  is never a fight. The companion does not struggle on sacrifice (the stillness is the
  horror).
CAMERA: closeups dominate the altar; the credential gets a hold (the tempting object);
  the altar_gate holds on the companion's face as the hum speaks. Cuts on the beat.
MUSIC: the cyan-hum motif (the Amalgamation listening) threads the whole quest; a cold
  single tone at the altar; CRUCIALLY no triumph cue on sacrifice — the "reward" is
  scored as grief. Break route earns a rising, earned tension-resolve. 120 BPM.

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE (Megaton + Pacifist laws)
===============================================================================
- The core choice is moral, not martial; fully resolvable without combat (break route
  can be done by persuasion/heist). Drawing the Dead Eye at the altar fails the ritual
  and forfeits the credential — violence is not the key (the willing-sacrifice lock).
- Rewards diverge to the extreme (Megaton law): SACRIFICE = the key + a dead friend +
  a marked bloodline; REFUSE = no key + a truer friend; BREAK = the key + the friend +
  a fearful enemy (hardest). The evil path is genuinely the EASIEST way to the endgame
  key — which is exactly the trap (Dead Money greed / creeping normality).
- This is the BECOME path's price made concrete, and the counter-proof that the clean
  path (BREAK) is reachable but demands you did the work and kept your soul.

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Pulls the actual LOYAL companion from the save (falls back
to Nadia/Q003 as reference). Writes: a permanent companion-death (Succession vacancy),
a credential item (endgame key flag), the heaviest UNRECORDED fold flag, and a possible
future Amalgamation-fragment encounter seeded with the companion's identity. Reads
ledger/standing/skill/knowledge(Reconstruction)/fold. Deterministic + save-through.
Gate: all four routes resolve, self-route correctly bounces (betrayal-currency rule),
break-route gated behind Reconstruction knowledge, no-triumph-on-sacrifice enforced,
companion-fragment seed writes correctly. Joins the permanent suite.

## 10. WHAT THIS PROVES (vs 001-008)
Second PILLAR + the darkest engine: a patron-sacrifice where the Amalgamation offers a
real endgame key for the willing betrayal of a loved companion — WHO can be lost
carries the theme (Virmire), the reward is scored as a wound not a win, and the clean
BREAK route is reachable only by doing the mystery work and refusing the easy evil
(Dead Money greed + Undertale mercy-is-harder). It makes the Become path's cost
concrete and ties the companion, succession, Reconstruction, and Amalgamation systems
into one unbearable choice. The bible now has two pillars and its moral floor.

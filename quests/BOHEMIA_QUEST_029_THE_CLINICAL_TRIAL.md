# BOHEMIA — QUEST 029: "WHAT GROWS IN THE VAULT"
Full production build. Built to the dialogue/scene spec; template = 001-028. Tier-3
GREED-TRAP / hidden-horror (Vault #22 Clinical Trial + tradition XXVIII Dead-Money greed
+ the NeuroLink-seeding-hidden-in-a-get-rich-hook shape). Name from the vault. A "too good
to be true" fortune-for-volunteering hook that hides a Network implant program — the player
learns to distrust the easy windfall.

Design soul: the trap is the money. A shady doctor offers a fortune to volunteer for a
"trial," and the reward is real enough to tempt a desperate dynasty — but the trial installs
Network tech (the same NeuroLink that hollowed Orrin, made Mara, drives Roan). The quest
rewards SUSPICION over greed, and lets a player who takes the bait feel the cost (Dead Money:
the gold that kills you).

===============================================================================
## 1. HEADER
===============================================================================
- id: q_grows_in_vault
- tier: 3 (marked by a too-good poster; a greed-trap with an investigate-out)
- fold: exposing / shutting down / taking the deal shapes whether the Network's implant
  pipeline in this district is broken or fed; a player who took the implant carries it into
  the fold (a real, lasting cost).
- entry_conditions: a poster offers "life-changing compensation" for volunteers in a medical
  trial run by DR. COLE at a converted clinic ("the Vault").
- faction_wires: NETWORK (behind the trial — implant harvesting), VOLUNTEERS (suspicious),
  the desperate poor (the target volunteers).
- music_pool: TENSION; a deceptively WARM clinical motif (clean, reassuring — wrong);
  the cyan-hum beneath the "treatment" rooms; a cold reveal sting.
- ledger_writes: recorded[trial_outcome_*]; UNRECORDED[did_you_take_the_bait];
  mindmap CLUE[the_network_recruits_via_trials] (how implants spread — ties Q005/Q010/Q025).
- amalgamation_thread: MEDIUM — reveals the Network's RECRUITMENT method (how NeuroLinks get
  into people): not force, but DESPERATION dressed as opportunity (the economic horror again).

===============================================================================
## 2. CAST
===============================================================================
- DR. COLE (id: cole) — runs the "trial"; smooth, reassuring, frames the implant as a
  "wellness monitor"; a true-believer-or-cynic (player can probe which). Recruits the
  desperate. default_emotion: warm_clinical -> (if cornered) cold_efficient. faction: NETWORK-
  adjacent.
- JOND (id: jond) — a desperate father who's about to take the deal to feed his kids; the
  human stakes; can be warned or too-late. default_emotion: hopeful_desperate.
- MERA (id: mera) — a PRIOR volunteer, now subtly "off" — flat affect, a fresh scar behind
  the ear, forgetting things; the walking evidence. default_emotion: dimmed_uneasy.
- DR. SAMA (id: sama) — VOLUNTEERS (RECURRING); can analyze what the implant does. default_
  emotion: alarmed_careful.
- THE PLAYER — [READ], [MEDICINE] (spot the implant), [BARTER]; greed vs suspicion is the axis.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
TEMPTATION-then-INVESTIGATION: the hook (take the deal now for a fortune) is available
IMMEDIATELY (the greed trap) — OR the player can investigate first. HUB (probe Cole, examine
Mera, warn Jond) -> reveal -> a BRANCH: EXPOSE/SHUT DOWN, WARN THE VOLUNTEERS (save them,
Cole relocates), TAKE THE DEAL (greed — real reward, real implant), or ROB IT (steal the
compensation without the implant — the clever thief route).

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: cole  emotion: warm_clinical  gesture: gesture_to_a_clean_chair  camera: two_shot
  music:{pool:TENSION,cue:warm_clinical}
  line: "Welcome to the Vault. Simple arrangement: a brief procedure, a wellness monitor
         under the skin, and compensation that will change your family's life. No risk — I do
         it myself, I've done hundreds. Most volunteers say they feel CLEARER afterward. Shall
         we get you comfortable? Or do you have questions? Questions are fine. Everyone has a
         few. They pass."
  choices (PLR):
   - "(Take the deal now. My family needs it.)"  -> route_take (jump — the greed trap, available IMMEDIATELY)
   - "[MEDICINE] What exactly is the 'monitor'?"  -> spoke_med [require skill.medicine>=2]
   - "[READ] Why pay a fortune for a wellness study?" -> spoke_read [require skill.read>=3]
   - "(I'll look around first.)"                   -> invest_hub
node spoke_med  [MEDICINE]
  speaker: cole  emotion: warm_clinical  camera: closeup  micro_expression: too_smooth
  line: "A neural interface — passive, I assure you. It reads wellness signals. The
         placement's behind the ear. Perfectly safe. (his ease is the tell — no doctor is this
         calm about a brain implant)"
  effect: knowledge[the_monitor_is_a_neural_implant] (the NeuroLink)  -> goto invest_hub
node spoke_read  [READ]
  speaker: cole  emotion: warm_clinical  camera: closeup  micro_expression: eyelid_flicker
  line: "Because good data is expensive, and desperate people are honest test subjects. That's
         not sinister — it's economics. (the flicker says otherwise) You'll find the money is
         very real, whatever you suspect."
  effect: knowledge[the_trial_targets_the_desperate]  -> goto invest_hub
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Examine Mera, a prior volunteer.)"   -> mera_01  [once]
   - "(Warn Jond before he signs.)"          -> jond_01  [once]
   - "(Have Sama analyze the implant.)"      -> sama_01  [once]
   - "(Look behind the treatment rooms.)"    -> clue_back [once]
   - "(Decide.)"                              -> choice_gate [show after 2]
node mera_01
  speaker: mera  emotion: dimmed_uneasy  gesture: touch_scar_behind_ear  camera: closeup  micro_expression: lose_the_thread
  line: "The trial? It was— it paid, it really paid, my kids ate all winter. I just— sometimes
         I lose the— what were we— (she touches the scar) I feel CLEARER, Dr. Cole says. Clearer.
         I don't dream anymore. I used to dream. Is that clearer? I can't remember if I liked
         dreaming."
  effect: knowledge[the_implant_hollows_them] (Mera is being slowly emptied — ties Orrin/Q005)
  -> goto invest_hub
node jond_01
  speaker: jond  emotion: hopeful_desperate  gesture: clutch_the_poster  camera: two_shot
  line: "Don't try to talk me out of it. You don't have kids going to bed hungry. This is the
         first door anyone's opened for me in a year. Whatever it costs me — it's mine to spend.
         Unless you've got a better offer than 'stay poor and proud'?"
  effect: knowledge[jond_will_take_it_without_a_real_alternative] (warning alone won't save him —
    he needs an actual out)  -> goto invest_hub
node sama_01
  speaker: sama  emotion: alarmed_careful  gesture: hold_up_a_scan  camera: closeup  music:{pool:TENSION,cue:cyan_hum_in}
  line: "I pulled a reading off Mera. That 'monitor' is a NeuroLink harvester — it doesn't just
         READ her, it FEEDS. Uploads fragments of her to... somewhere. The servers, I'd bet.
         Cole isn't running a trial. He's running a FARM. And the crop is people's minds."
  effect: mindmap CLUE[the_network_recruits_via_trials] + [implants_upload_to_the_servers]
    (how the Amalgamation GROWS — recruitment via desperation)  -> goto invest_hub
node clue_back
  speaker: PLR (internal)  camera: back_rooms  music:{pool:TENSION,cue:cold_reveal}
  line: "(Behind the clean waiting room: rows of reclining volunteers, wires behind their ears,
         faces slack and CLEARER. A ledger of names and 'yield.' Cole's compensation is real
         because the product — the uploaded minds — is worth so much more. The desperate sell
         themselves by the gram and call it a paycheck.)"
  effect: knowledge[the_vault_is_a_mind_farm]  -> goto invest_hub

--- THE CHOICE ---
node choice_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Expose/shut down the Vault.)"  [require knowledge.the_vault_is_a_mind_farm] -> route_expose
   - "(Warn + relocate the volunteers — give Jond a real out.)"  -> route_warn
   - "(Take the deal. The money's real.)"                        -> route_take
   - "(Rob the compensation — skip the implant.)"                -> route_rob [READ/thief]
node route_expose
  speaker: cole  emotion: cold_efficient  camera: two_shot  micro_expression: mask_off
  line: "...You've seen the back rooms. Pity. I offered you a fortune and you chose to be a
         hero about strangers who VOLUNTEERED. They signed. It's not harvesting if they say
         yes. (he moves to shut it down / flee — a confrontation)"
  effect: the Vault is exposed/shut (Dead Eye or a nonlethal bust with Sama+Volunteers+
    Remnants); the Network's recruitment pipeline here is BROKEN; the harvested may or may not
    be recoverable; recorded[shut_the_vault]; UNRECORDED[broke_the_farm]=true; mindmap clue
    banks (a major Reconstruction node: how the Amalgamation grows). -> END
node route_warn
  speaker: jond  emotion: torn_then_swayed  camera: closeup
  line: "...A mind farm. And you're not just telling me no — you're offering my kids a real
         meal and honest work? ...Then I don't need Cole's door. ...God. I almost. I ALMOST.
         How many already walked in because nobody gave them another door?"
  effect (requires offering a REAL alternative — resources/work/Volunteers): Jond + current
    volunteers saved; Cole RELOCATES (pipeline moves, not broken — a partial win); recorded
    [warned_the_volunteers]; UNRECORDED[gave_them_another_door]=true; the humane route addresses
    the DESPERATION the trap exploits (the economic root). -> END
node route_take  (the greed trap — real reward, real cost)
  speaker: cole  emotion: warm_clinical  camera: closeup
  line: "Wonderful. Just relax. You'll feel clearer soon. And your family will never want
         again. See? Everyone has questions. They pass."
  effect: the dynasty member GETS the fortune (a large real windfall — the trap PAYS, Dead
    Money style) AND receives the NeuroLink implant (a lasting condition: periodic fugue/
    surveillance risk, the Network can "listen," a real fold-carried cost — possibly the seed
    of a later self-rescue quest); recorded[took_the_deal]; UNRECORDED[sold_yourself]=true. The
    game lets you take the gold that kills you (no scolding — the cost speaks for itself). -> END
node route_rob  [READ/thief]
  speaker: PLR  camera: back_rooms  music:{pool:TENSION,cue:sly}
  beats: case the Vault, lift the compensation cache during a procedure, leave WITHOUT taking
    the implant (a heist — stealth/dodge or a clean grab). SUCCESS: the money, no implant, and
    Cole's operation disrupted/robbed. FAIL: alarm, confrontation (Dead Eye/flee).
  effect (success): the windfall WITHOUT the cost; Cole set back; recorded[robbed_the_vault];
    UNRECORDED[took_the_gold_not_the_hook]=true; the clever-greed route (Dead Money's real
    lesson: you CAN walk out with the gold — if you refuse the thing that chains you to it). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- EXPOSE: the recruitment pipeline broken here; a major Reconstruction node (how the
  Amalgamation grows — via desperation-farming); an heir inherits a district warier of
  "too-good" offers.
- WARN: the immediate volunteers saved by addressing their DESPERATION (the root); Cole
  relocates (the pipeline persists elsewhere — a recurring hydra); the humane-but-incomplete win.
- TAKE: a windfall + a NeuroLink implant carried into the fold (a lasting vulnerability — the
  Network can listen; a potential fugue risk; possibly a later self-rescue thread). The gold
  that kills you.
- ROB: the money, no chain, Cole robbed — the clever escape (Dead Money's true lesson).
- mindmap[network_recruits_via_trials] + [implants_upload_to_servers] persist — the player now
  understands HOW the Amalgamation grows (recruitment via economic desperation — fusing the
  economic and sci-fi horror, ties Q028's debtors-became-homeless).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Cole's warm_clinical mask and its too-smooth/eyelid-flicker tells (and the mask_off on
  expose); Mera's dimmed, thread-losing affect (the walking cost — the horror in a face);
  Jond's desperate hope. Procedural lip-sync; Mera's speech trails and loops (the emptying).
BODY: the clean waiting room vs the back-room farm (staged spaces — the contrast IS the reveal);
  Mera touches her scar; the rob route uses stealth/dodge. Combat only on expose-confrontation
  or a failed rob.
CAMERA: two_shots in the reassuring front, closeup on Mera's dimmed face, back_rooms reveal
  (the slack faces + wires — the gut-image), closeup on Cole's mask dropping. Cuts on beat.
MUSIC: a deceptively WARM clinical motif (clean, reassuring — the wrongness is that it's too
  nice); the cyan-hum beneath the treatment rooms (the real machine); cold reveal on the back
  rooms. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the greed trap)
===============================================================================
- Pacifist-completable: expose can be a nonlethal bust; warn is dialogue; rob is stealth. Combat
  only on confrontation/failed rob.
- Rewards diverge (Megaton law) AND the trap is the POINT: TAKE = the biggest immediate windfall
  + a lasting implant cost (the gold that kills you); ROB = the windfall without the chain (clever);
  EXPOSE = no money + a broken pipeline + a Reconstruction node; WARN = no money + saved people +
  a persisting hydra. The most LUCRATIVE-seeming choice (take) is the trap; the game rewards
  SUSPICION (Dead Money greed lesson made mechanical).
- Reveals the Network's recruitment method: not force, but DESPERATION dressed as opportunity —
  the economic horror (Q028) fused with the sci-fi horror (the mind farm feeds the Amalgamation).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Introduces the GREED-TRAP structure (a real, tempting reward with a
hidden lasting cost — reusable) + the implant-as-carried-condition (a fold-persistent
vulnerability + possible later self-rescue quest) + the warm-clinical deceptive score. Reads
ledger/standing/skill/knowledge/fold; writes same + a Reconstruction node + (on take) a
persistent implant condition. Deterministic + save-through. Gate: the immediate greed-take is
available pre-investigation, all four routes resolve, warn requires a real alternative, rob
success+fail handled, take applies the persistent implant condition, mindmap nodes bank. Joins suite.

## 9. WHAT THIS PROVES (vs 001-028)
New engine: the GREED-TRAP / hidden-horror — a too-good fortune-for-volunteering hook that hides
a Network mind-farm, where the most tempting choice (take the deal) carries a lasting implant
cost (Dead Money's gold-that-kills-you, made mechanical) and the game rewards suspicion. Reveals
HOW the Amalgamation grows — recruitment via economic desperation — fusing the economic (Q028)
and sci-fi horror. Introduces the greed-trap structure + implant-as-carried-condition. Bible at
29; the enemy now has a recruitment method, and the player learns to distrust the easy windfall.

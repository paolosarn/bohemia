# BOHEMIA — QUEST 032: "THE LIAR'S BLOODLINE"
Full production build. Built to the dialogue/scene spec; template = 001-031. Tier-2
DARK PATRON-FAVOR / truth-vs-life (Vault #40 Liar's Bloodline / Malacath shape + tradition
XXX Pentiment doubt + the recorded-vs-unrecorded ledger). Name from the vault. A patron
reveals a celebrated faction hero was a fraud and asks the dynasty to end the last of that
bloodline to "kill the lie" — forcing a choice between a comforting truth and a living person.

Design soul: is a true story worth a life? A faction's founding hero — the myth that holds
its people together — was a fraud, and a patron wants the last descendant killed so the lie
dies with the blood. But the descendant is innocent, the myth does real GOOD, and the "truth"
serves the patron's agenda. The quest asks what a community owes to fact vs to the stories that
keep it alive (Pentiment: sometimes the true account destroys more than it heals).

===============================================================================
## 1. HEADER
===============================================================================
- id: q_liars_bloodline
- tier: 2 (marked; a patron with a hidden motive extends the "favor")
- fold: whether the myth is preserved, exposed, or the bloodline ended shapes the faction's
  cohesion and the dynasty's relationship to TRUTH itself (recorded vs unrecorded ledger).
- entry_conditions: a patron (REDS/Network-adjacent broker VANCE-archetype, or a rival faction
  head) brings the dynasty proof that the BLUES' founding hero "Saint Corda" was a fraud, and
  asks it to eliminate her last descendant, YOUNG CORDA.
- faction_wires: BLUES (the myth holds them together), the patron's faction (benefits if the
  BLUES fracture), the descendant (innocent).
- music_pool: TENSION; a reverent HYMN motif for the myth (the BLUES' anthem to Saint Corda);
  a cold counter-motif for the "truth"; the two contend.
- ledger_writes: recorded[corda_outcome_*]; UNRECORDED[what_you_did_to_the_truth] (killed it /
  told it / protected the lie); BLUES cohesion + the patron's gain shift.
- amalgamation_thread: LIGHT — the patron's motive (fracture the BLUES) ties the Network's
  divide-and-buy pattern (Q002/Q027); a [READ] exposes WHY they want the myth dead.

===============================================================================
## 2. CAST
===============================================================================
- THE PATRON / MERRIT (id: merrit) — a broker who "just wants the truth known," actually wants
  the BLUES fractured so his backers can move on their territory. Frames murder as historical
  hygiene. default_emotion: reasonable_cold. faction: REDS/Network-adjacent.
- YOUNG CORDA (id: ycorda) — the last descendant of Saint Corda; a decent, ordinary person who
  carries the myth as a burden and a gift; INNOCENT of the founder's fraud. default_emotion:
  weary_dignified. faction: BLUES.
- ELDER FEN (id: fen) — a BLUES elder who KNOWS the founding story is embellished but believes
  the myth's GOOD outweighs its truth (it stopped a war, feeds an orphanage). default_emotion:
  pragmatic_faithful. faction: BLUES.
- THE PLAYER — [READ] (the patron's motive), [MEDICINE]/investigation (verify the fraud claim),
  standing.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
INVESTIGATION HUB (verify the fraud claim, probe the patron's motive, meet the descendant and
the elder) -> a BOTTLENECK CHOICE: END THE BLOODLINE (do the favor), EXPOSE THE TRUTH (publicly
— fractures the BLUES but "honest"), PROTECT THE MYTH (bury the truth, refuse the patron), or
TURN THE PATRON (expose HIS motive to the BLUES). The axis: truth vs the good a lie does.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: merrit  emotion: reasonable_cold  gesture: lay_out_documents  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "The BLUES worship 'Saint Corda' — the martyr who supposedly died holding the water-line
         so her people could escape. It's a beautiful story. It's also a LIE. She ran. Others died
         covering HER. I have the proof. The myth is a rot at the heart of a whole faction, and it
         survives in one person: her descendant. End the bloodline, and the truth can finally
         breathe. I'll pay handsomely for honesty."
  choices (PLR):
   - "Why do YOU care about the truth?"        -> spoke_motive [READ]
   - "Let me verify the proof first."           -> invest_hub
   - "You're asking me to murder an innocent."  -> spoke_innocent
node spoke_motive  [READ]
  speaker: merrit  emotion: caught_smooth  camera: closeup  micro_expression: eyelid_flicker
  line: "I care about a CLEAN Vegas. Is it convenient that a fractured BLUES can't hold their
         territory against my backers? Perhaps. Truth and advantage aren't enemies. The story's
         still a lie whether or not I profit from ending it."
  effect: knowledge[merrit_wants_the_blues_fractured] (the divide-and-buy pattern — ties Q027)
  -> goto invest_hub
node spoke_innocent
  speaker: merrit  emotion: unmoved  camera: closeup
  line: "The descendant is the LIE'S vessel. Sentiment is how lies survive. But verify it yourself
         — I'd rather you act from conviction than doubt. Doubt makes for sloppy work."
  -> goto invest_hub
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Verify the fraud — old records, survivors' kin.)"  -> clue_fraud [once]
   - "(Meet Young Corda, the descendant.)"                 -> ycorda_01  [once]
   - "(Talk to Elder Fen about the myth.)"                 -> fen_01      [once]
   - "(Decide.)"                                            -> choice_gate [show after 2]
node clue_fraud
  speaker: PLR (internal)  camera: closeup_on_records  music:{pool:TENSION,cue:cold_counter}
  line: "(The records are real. Saint Corda ran. Three others held the line and drowned for her,
         their names scrubbed from the story so hers could shine. The myth IS a lie. And the lie
         built an orphanage, ended a blood-feud, gives ten thousand people a reason to be BLUE
         instead of just afraid. The truth is true. It is also a bomb.)"
  effect: knowledge[the_fraud_is_real_AND_the_myth_does_good] (both, inseparable — the trap)
  -> goto invest_hub
node ycorda_01
  speaker: ycorda  emotion: weary_dignified  gesture: touch_a_relic_pendant  camera: two_shot
  line: "You look at me like you're measuring me. Everyone does. I'm not a saint. I never claimed
         to be — that was four generations back. I sweep the meeting hall and I keep her pendant
         and I let people believe what keeps them kind to each other. If her story's not perfectly
         true... does that make the kindness fake? I've never understood why the truth would want
         to take that away."
  effect: knowledge[ycorda_is_innocent_and_thoughtful]  -> goto invest_hub
node fen_01
  speaker: fen  emotion: pragmatic_faithful  gesture: fold_hands  camera: closeup
  line: "You think I don't know Corda ran? I've read the same records. I've kept them SEALED for
         forty years. Not to deceive — to PROTECT. A people need a story to be good FOR. Take Corda
         and you don't give them truth, you give them nothing to hold. I've buried the fact so the
         faith could feed children. Judge me if you like. The children ate."
  effect: knowledge[fen_chose_the_useful_myth_knowingly] (Pentiment: the informed keeper of a
    protective lie)  -> goto invest_hub

--- THE CHOICE ---
node choice_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold_both_motifs}
  choices:
   - "(End the bloodline — do the patron's favor.)"        -> route_kill
   - "(Expose the truth publicly — let the myth fall.)"     -> route_expose
   - "(Protect the myth — bury the truth, refuse Merrit.)"  -> route_protect
   - "(Turn Merrit — expose HIS motive to the BLUES.)" [require knowledge.merrit_wants_the_blues_fractured] -> route_turn
node route_kill
  speaker: ycorda (dying)  emotion: uncomprehending  camera: closeup  micro_expression: no_understanding
  line: "...I don't— I sweep the HALL. I don't even— why— tell them I wasn't a— " (gone)
  effect: the bloodline ends; the myth loses its living vessel (it may wither OR harden into
    martyrdom — either way the BLUES are destabilized, which SERVES Merrit); recorded[ended_the
    _bloodline]; UNRECORDED[killed_the_truth_and_the_innocent]=true; the darkest, most patron-
    serving choice — a murder for a "truth" that mostly served someone else. -> END
node route_expose
  speaker: fen  emotion: grief_and_anger  camera: two_shot
  line: "...You've told them. Look at them — not enlightened. LOST. You gave them a fact and took
         their reason to be kind to each other. The orphanage board's already fighting over whether
         she 'deserves' the name. You were HONEST. I hope it was worth what it broke."
  effect: the truth is public; the BLUES fracture (the myth falls; some feel freed, most feel
    robbed); Young Corda is spared but shunned; recorded[exposed_the_truth]; UNRECORDED[told_the
    _true_story]=true; Merrit PROFITS (the BLUES weaken); honest and devastating (Pentiment: the
    true account destroyed more than it healed). -> END
node route_protect
  speaker: ycorda  emotion: quiet_relief  camera: closeup  micro_expression: exhale
  line: "You're not going to use it. The records — you're letting her stay a saint. ...Thank you.
         Not for me. For the kids who need her to have been brave. I'll keep sweeping the hall. I'll
         keep her pendant. Some truths are just... heavier than they're worth."
  effect: the truth is buried (the dynasty chooses the useful myth over the destructive fact);
    Young Corda safe; the BLUES stay cohesive; Merrit REFUSED (his play foiled); recorded[protected
    _the_myth]; UNRECORDED[chose_the_kind_lie]=true; a morally complex "good" (Frostpunk: sometimes
    the humane choice is the dishonest one) — the game doesn't call it clean, but it kept people fed
    and kind. -> END
node route_turn  [the clean win — expose the PATRON, not the myth]
  speaker: PLR (to the BLUES elders + Merrit)  camera: three_shot  music:{pool:TENSION,cue:resolve}
  line: "Merrit didn't bring me a truth. He brought me a WEAPON — a founder's secret he wants used
         to shatter you so his backers can take your water. Whether Corda ran or not, THIS man's
         motive is the only lie that matters today. Judge your saint on your own time. Right now,
         judge HIM."
  effect: Merrit exposed; the BLUES rally (against the outside threat, myth intact or examined on
    THEIR terms); Young Corda safe; the Network's divide-play foiled (ties Q027); recorded[turned
    _merrit]; UNRECORDED[named_the_real_liar]=true; the wisest outcome — reframes "truth vs myth" as
    "who profits from forcing the question NOW." The reputation-gold route. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- KILL: an innocent dead, the BLUES destabilized, Merrit's backers advance; an heir inherits a
  weakened BLUES and a bloodline-ender's shadow (a dark rep).
- EXPOSE: the myth falls, the BLUES fracture; an heir inherits a faction that lost its cohesion to
  an honest wound (some respect the truth-teller, most resent them).
- PROTECT: the myth endures, the BLUES stay whole; an heir inherits a cohesive faction and a dynasty
  known for choosing mercy over fact (a complex rep — some call it wisdom, some call it lies).
- TURN: the best — BLUES rally, Merrit foiled, the truth left for the BLUES to reckon with on their
  own terms; the dynasty spots the divide-and-buy pattern again (Q002/Q027 synergy).
- UNRECORDED[what_you_did_to_the_truth] colors the dynasty's relationship to honesty itself across
  the fold — a rare quest that puts TRUTH on the ledger.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Merrit's reasonable-cold mask + eyelid_flicker (the recurring manipulator tell); Young Corda's
  weary dignity (the innocent who never asked for the myth); Fen's pragmatic faith (the knowing
  keeper). The KILL route's ycorda "no_understanding" is a gut-punch portrait. Procedural lip-sync.
BODY: talk-heavy (an investigation/moral quest); gesture one-shots (lay_out_documents, touch_a_relic
  _pendant, fold_hands). The records are a readable place-node (Q028 environmental tech). Combat only
  if the player forces the kill loud.
CAMERA: two_shots for the pitches, closeup_on_records for the fraud proof, three_shot for the turn.
  Cuts on beat.
MUSIC: a reverent HYMN motif (the BLUES' anthem to Saint Corda) vs a cold "truth" counter-motif — the
  two contend, and the resolution's cue depends on which the player served; resolve on turn. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + truth-vs-good)
===============================================================================
- Pacifist-completable: expose/protect/turn are all non-combat; only KILL requires violence (and
  it's the patron-serving trap). Fully avoidable bloodshed.
- Rewards diverge (Megaton law): KILL = the patron's pay + a dead innocent + a shadow; EXPOSE = the
  "honest" high ground + a fractured faction + Merrit's profit; PROTECT = a cohesive faction + a
  complex "kind lie" rep; TURN = the clean win (BLUES rally, patron foiled, truth deferred to them).
  No route is simply "truth good / lie bad" — the quest weighs truth against the GOOD a story does.
- Theme (Pentiment/Frostpunk): sometimes the true account destroys more than it heals; the wisest
  move is often to ask WHO benefits from forcing the truth right now (the turn route).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Uses readable record-nodes (Q028 environmental tech) + the contending-
motif score (hymn vs truth) + a TRUTH ledger axis (a rare quest that logs the dynasty's relationship
to honesty). Reads ledger/standing/skill/knowledge/fold; writes same + BLUES cohesion + patron-gain
+ a truth-rep flag. Deterministic + save-through. Gate: fraud verifiable, all four routes resolve,
turn gated behind the patron-motive clue, the hymn/truth motifs contend + resolve per choice, truth-
rep flag persists. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-031)
New engine: the TRUTH-VS-GOOD dark patron-favor — a patron weaponizes a real historical fraud to
demand an innocent's death, forcing a choice between a comforting-but-false myth that does real good
and a destructive truth that serves the patron (Pentiment/Frostpunk). Resolved by kill/expose/protect/
turn, with the wisest route reframing "truth vs myth" as "who profits from forcing it now" (Q002/Q027
divide-and-buy synergy). Puts TRUTH itself on the ledger. Bible at 32; the game now weighs honesty
against the stories that keep people alive.

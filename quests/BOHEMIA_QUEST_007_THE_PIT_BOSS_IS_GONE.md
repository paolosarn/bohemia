# BOHEMIA — QUEST 007: "THE PIT BOSS IS GONE"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-006. Tier-1 PILLAR, VACANCY / SUCCESSION power-struggle (Vault seed #1 +
tradition XXV Landsmeet + Fallout Killian two-master + the Succession System — the
game's signature mechanic). Name from Paolo's catalog. First T1 in the bible.

Design soul: a district's power-broker vanishes, and society reorganizes around the
hole. The player doesn't just pick a winner — the WAY the vacancy fills becomes canon
the whole district lives under. This is the Succession System in miniature (the
mechanic Paolo wants to self-patent), a rehearsal for the dynasty's own folds.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_pitboss_gone
- tier: 1 (PILLAR; generation-spanning consequence; ledger-wired)
- fold: whoever ends up running the block — and HOW — sets the district's character
  for the rest of the game; an heir inherits the regime this quest installs.
- entry_conditions: the player has any standing with MOB; the pit boss (CALLOWAY)
  of a surviving Strip casino-block turns up dead/vanished; three claimants move.
- faction_wires: MOB (owns the block), REDS (want to buy it), HOMELESS (live under
  it), plus the CUSTOM/player faction (can seize it — the Become path).
- music_pool: TENSION; a lone piano "empty chair" motif under the vacancy; COMBAT
  only if the struggle turns violent; a TRIUMPH-adjacent swell on a clean install.
- ledger_writes: recorded[pitboss_outcome_*]; UNRECORDED[how_the_chair_was_filled]
  (clean/bloody/bought/seized — flips the district's mood a generation late).
- amalgamation_thread: LIGHT — one claimant (the REDS buyer) is Network-adjacent;
  a [READ] reveals the block's real value is what's UNDER it (the servers). Optional.

===============================================================================
## 2. CAST
===============================================================================
- CALLOWAY (id: calloway) — the vanished pit boss. Kept a brutal but STABLE peace:
  the block ate before it paid, the Homeless underneath were left alone. Present only
  as absence and testimony. (The vacancy is the character.)
- ROSA VANE (id: rosa) — Calloway's floor manager. Loyal to the block's people, wants
  to keep his peace but lacks his teeth. The "continuity" claimant. faction: MOB.
  default_emotion: steady_grieving.
- DECK MARROW (id: deck) — a MOB enforcer who thinks Rosa is weak and the block needs
  a harder hand. The "strongman" claimant. default_emotion: hungry_confident.
- VANCE (id: vance) — the REDS broker (RECURRING from Q002 if that was played). Offers
  to BUY the block "clean." The "capital" claimant; Network-adjacent. default_emotion:
  pleasant_cool.
- KING HOBO'S ENVOY (id: envoy) — from the Homeless HQ beneath the block; doesn't want
  a claimant, wants the block to keep ignoring what's under it. faction: HOMELESS.
  default_emotion: wary_quiet.
- THE PLAYER — [READ], [INTIMIDATE], [BARTER], MOB/HOMELESS standing gate routes.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE (investigate the disappearance + hear every claimant, any order) ->
a LANDSMEET-style BOTTLENECK (a block council where banked standing + provable
evidence decide who the room backs) -> BRANCH install (four regimes) -> optional
violent tiebreak if the council deadlocks. This is the Succession System's shape.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE VACANCY (Rosa brings you in) ---
node open_01
  speaker: rosa  emotion: steady_grieving  gesture: gesture_empty_office  camera: two_shot
  music:{pool:TENSION,cue:empty_chair_piano}
  line: "Calloway's chair's been cold three days. No body, no word. The block's
         holding its breath — and the wolves are already circling the pit. You've got
         a name here. Help me keep this place from eating itself."
  -> goto hub

node hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Investigate what happened to Calloway.)"  -> invest_01   [once]
   - "(Hear Rosa's claim.)"                        -> rosa_claim  [once]
   - "(Hear Deck's claim.)"                        -> deck_claim  [once]
   - "(Hear Vance's offer.)"                       -> vance_claim [once]
   - "(Meet the Homeless envoy.)"                  -> envoy_01    [once]
   - "(Call the block council.)"                   -> council_gate [show after >=2 claims]

--- INVESTIGATION (what happened — shapes leverage) ---
node invest_01
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:low}
  line: "(Calloway's office: no struggle. A packed bag he never took. A ledger open
         to the block's water-rights — and a note, half-burned: 'they want what's
         under us. won't sell them the floor.' He didn't run. He was removed for
         refusing to sell the ground over the servers.)"
  effect: reveal knowledge[calloway_refused_to_sell] AND knowledge[the_block_sits_on_
    something]; opens the [READ] confrontation with Vance  -> goto hub

--- THE CLAIMANTS ---
node rosa_claim
  speaker: rosa  emotion: steady_grieving  camera: closeup
  line: "I'm not hard like he was. But I know every family on this block by name. Back
         me and the block stays a HOME, not a holding. I just... can't hold it alone."
  effect: knowledge[rosa_needs_backing]  -> goto hub
node deck_claim
  speaker: deck  emotion: hungry_confident  gesture: crack_knuckles  camera: two_shot  micro_expression: smirk
  line: "Rosa'll get everyone killed being nice. A block like this needs a fist. Back
         ME and nobody crosses us twice. Cross me now, though, and we got a problem."
  effect: knowledge[deck_wants_it_hard]  -> goto hub
node vance_claim
  speaker: vance  emotion: pleasant_cool  gesture: slide_offer  camera: closeup
  line: "Grief is expensive. I'll buy the block clean — everyone paid, everyone
         relocated who wants to be. Quiet. Profitable. Modern. Just sign the floor
         over to me."
  choices (PLR):
   - "What do you actually want under the floor?" [require knowledge.the_block_sits_on_something] -> vance_read
   - "(Take the offer at face value.)"  -> goto hub
node vance_read  [READ]
  speaker: vance  emotion: caught_but_smooth  camera: closeup  micro_expression: eyelid_flicker
  line: "The FLOOR, friend. Real estate. What's beneath is... infrastructure. The kind
         my employers like to own. Leave it there."
  effect: reveal knowledge[vance_serves_network] (ties Q002/Q004); music:{pool:TENSION,cue:cold_sting}
  -> goto hub
node envoy_01
  speaker: envoy  emotion: wary_quiet  gesture: hood_low  camera: two_shot
  line: "We don't want a king up here. We want to be forgotten. Calloway forgot us on
         purpose — that was the deal. Whoever sits that chair: keep forgetting. Sell
         to the suit and they start DIGGING. Don't let them dig."
  effect: knowledge[homeless_want_status_quo]; HOMELESS standing gate for later  -> goto hub

--- THE COUNCIL (Landsmeet — banked standing + evidence decide the room) ---
node council_gate
  speaker: PLR (chairing)  camera: wide_council  music:{pool:TENSION,cue:hold}
  mechanic: each claimant arrives with SUPPORT = f(player standing with their faction
    + favors banked this quest + evidence). Player argues for one outcome; a PROVABLE
    accusation (the burned note, vance_serves_network) can swing the room; overreach
    without proof LOSES support (DA Landsmeet law).
  choices:
   - "(Back Rosa — continuity.)"                 -> install_rosa   [needs MOB standing/support]
   - "(Back Deck — the hard hand.)"              -> install_deck   [needs a show of force/INTIMIDATE]
   - "(Back Vance — sell it clean.)"             -> install_vance  [needs REDS support; HOMELESS turn on you]
   - "(Seize it yourself.)"                      -> install_self   [needs player-faction weight; the Become path]
   - "(Expose Vance; unite the block against the sale.)" [require knowledge.calloway_refused_to_sell AND knowledge.vance_serves_network] -> expose_vance

===============================================================================
## 5. THE INSTALLS (four regimes + the expose)
===============================================================================
node install_rosa
  speaker: rosa  emotion: moved_resolute  camera: closeup  music:{pool:TRIUMPH,cue:soft_swell}
  line: "...Then I'll hold it. With your name behind mine. The block stays a home. Come
         collect a favor whenever you need one — we remember who kept the lights on."
  effect: regime=CONTINUITY; block stays a home; HOMELESS left alone; MOB loyalty+;
    recorded[backed_rosa]; UNRECORDED[chair_filled_clean]=true. Rosa lacks teeth, so
    the block is KIND but VULNERABLE (a later gen may see it preyed on). -> END
node install_deck
  speaker: deck  emotion: triumphant  camera: two_shot  micro_expression: cold_grin
  line: "Smart. Now watch how quiet a block gets when everyone's scared. You and me,
         we're gonna do fine."
  effect: regime=STRONGMAN; block SAFE but harsh; tribute up, dissent down; some
    families flee; recorded[backed_deck]; UNRECORDED[chair_filled_by_fear]=true.
    Stable, cold, and Deck may become a problem an heir must handle. -> END
node install_vance
  speaker: vance  emotion: pleasant_cool  gesture: hand_you_a_cut  camera: closeup
  line: "A pleasure doing business. Your cut's generous. The relocations start Monday.
         The... excavations, shortly after."
  effect: regime=SOLD; block cleared/modernized; player gets caps; HOMELESS BETRAYED
    (they scatter or fight); the NETWORK begins digging toward the servers (advances
    the Amalgamation threat — a heavy fold cost); recorded[sold_the_block];
    UNRECORDED[let_them_dig]=true. The most lucrative, worst long-game. -> END
node install_self  [the Become path]
  speaker: PLR (to the block)  camera: wide_council  music:{pool:TENSION,cue:hold_then_resolve}
  line: "No boss. No suit. Me. The chair's mine now — and it answers to this block."
  effect: regime=DYNASTY; the player-faction annexes the block (real power + income +
    a foothold over the servers WITHOUT digging); MOB resents it (standing-); it's a
    naked power grab that DEFINES the bloodline (emergent Custom-faction identity);
    recorded[seized_the_block]; UNRECORDED[took_the_chair]=true. -> END
node expose_vance  [the clean pillar win]
  speaker: PLR + rosa + envoy  camera: three_shot  music:{pool:TENSION,cue:resolve}
  line: "Calloway died refusing to sell the ground over your homes. So we don't sell
         it either. Rosa holds the chair. The suit gets NOTHING. The block keeps
         forgetting what's underneath — on purpose."
  effect: regime=CONTINUITY+ALLIANCE; Rosa installed AND the Homeless become durable
    allies (they saw you protect the secret); Vance/Network rebuffed (threat delayed);
    recorded[exposed_vance_saved_block]; UNRECORDED[protected_the_floor]=true. The best
    fold inheritance: a kind block + a Homeless alliance for the Act-3 liberation. -> END

===============================================================================
## 6. VIOLENT TIEBREAK (if council deadlocks — Pacifist Path Law still holds)
===============================================================================
If no claimant has enough support (player spread themselves thin), the block erupts:
Deck moves on Rosa, or Vance's hired guns move in. The player may FIGHT (Dead Eye) to
install a winner by force, FLEE (the block falls to whoever's strongest — usually Deck
or Vance, a bad default), or broker a last-second standoff ([INTIMIDATE]/standing).
Force-installing writes UNRECORDED[chair_filled_in_blood]=true — the district remembers
it was born violent (Frostpunk/Megaton: a permanent scar). Combat is never REQUIRED;
it's the failure state of not banking enough support (the Succession lesson: power is
earned before the crisis, not during it — ME2 prep + Landsmeet).

===============================================================================
## 7. CONSEQUENCE ACROSS THE FOLD (this is a PILLAR — the whole district inherits it)
===============================================================================
- CONTINUITY (Rosa): kind, vulnerable block; heir may find it thriving OR preyed upon.
- STRONGMAN (Deck): safe, cold block; heir inherits a tyrant who may need removing.
- SOLD (Vance): block gone; the NETWORK is DIGGING; the Amalgamation threat is closer
  for every later generation (the worst long-game — you sold the future for caps).
- DYNASTY (self): the bloodline holds real power + a quiet foothold over the servers;
  defines the Custom faction; MOB resentment simmers into later gens.
- EXPOSE+ALLIANCE: the ideal — kind block, Homeless allies banked for Act-3, Network
  delayed. The clean pillar win, only reachable by investigating AND protecting the floor.
- UNRECORDED[how_the_chair_was_filled] colors the district's mood, safety, and loyalty
  for the rest of the game and into the fold.

===============================================================================
## 8. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Vance's eyelid_flicker (the recurring tell — continuity with Q002), Deck's
  cold_grin, Rosa's grief held steady, the envoy's hooded wariness. The council beat
  frames each claimant in turn (portraits) as support is tallied. Procedural lip-sync.
BODY: talk-idle loops; gesture one-shots (gesture_empty_office, crack_knuckles,
  slide_offer, hood_low). The empty office is a staged space (scheduler) the player
  walks — Calloway's absence made physical. Violent tiebreak -> Dead Eye/flee.
CAMERA: the EMPTY CHAIR gets its own hold (the vacancy is the subject); closeups per
  claimant; wide_council for the Landsmeet; three_shot for the expose. Cuts on beat.
MUSIC: lone-piano EMPTY-CHAIR motif under the vacancy; cold_sting on vance_read; a
  TRIUMPH swell ONLY on the clean installs (Rosa/expose); COMBAT on the tiebreak. 120 BPM.

===============================================================================
## 9. ROUTES + REWARD DIVERGENCE
===============================================================================
- Pacifist-completable end to end: every regime installs via the council if you bank
  support; combat is only the failure state of a deadlock. (Undertale: the peaceful
  path is HARDER — it requires investigating and banking standing beforehand.)
- Rewards diverge hard (Megaton law): SOLD is the most lucrative NOW and the worst
  future (Network digging); EXPOSE is the least lucrative NOW and the best future.
  DYNASTY is raw power at the cost of legitimacy. No path is "optimal" — each installs
  a different district and a different answer to "who should hold power, and how."
- This is the SUCCESSION SYSTEM rehearsed at district scale: society reorganizes around
  a vacancy, and the manner of filling it becomes canon. A dry run for the dynasty's folds.

===============================================================================
## 10. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Drives the SUCCESSION/VACANCY subsystem: a support-tally
(f(standing, banked favors, evidence)) resolves the council; the installed regime
writes a persistent district-governance state consumed by later quests + the fold.
Faction-graph + owner writes go through canon-wired shiftStanding. Conditions read
ledger/standing/skill/knowledge/economy/fold; effects write same + governance state.
Deterministic + save-through. Gate: all claimants reachable, council tallies correctly,
all four installs + expose resolve, deadlock->tiebreak resolves, evidence-swing works,
governance state persists across fold. Joins the permanent suite.

## 11. WHAT THIS PROVES (vs 001-006)
First T1 PILLAR + the SUCCESSION/VACANCY engine: a power-broker vanishes and the
district reorganizes around the hole via a Landsmeet-style council where BANKED
standing and PROVABLE evidence decide the room (not a menu pick). Five regimes, each
a different district the heir inherits, with the Amalgamation threat advancing on the
worst path. This is the signature mechanic rehearsed at district scale — the dry run
for the dynasty's own folds. The bible now covers all six T2/T3 engines PLUS its first
generation-spanning pillar. 7 for 7.

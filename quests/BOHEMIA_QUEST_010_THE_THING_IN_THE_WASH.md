# BOHEMIA — QUEST 010: "WHAT CRAWLS THE CONCRETE"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-009. Tier-2 CONTRACT (Vault #13 Thing-in-the-Wash + tradition on Witcher
contracts: the "monster" is a wronged human; investigate -> confront; negotiate the
fee). Name from Paolo's catalog tone. Fills the last open core engine: the CONTRACT.

Design soul: a bounty on a "monster" haunting the storm drains, killing scavengers.
The investigation reveals the monster is a NeuroLinked person the Amalgamation broke
and abandoned — once someone with a name. The Dead Eye is on the table (it IS a
contract), but the truth reframes the kill: is this a hunt, a mercy, or a rescue? The
fee is negotiable; the conscience isn't scored. Ties the Reconstruction (Q004/Q005).

===============================================================================
## 1. HEADER
===============================================================================
- id: q_crawls_concrete
- tier: 2 (marked contract; posted on a district board or given by a broker)
- fold: how the "monster" was handled (killed / freed / exposed) leaves a mark on the
  wash district and a Reconstruction clue an heir can inherit.
- entry_conditions: a contract is posted — scavengers dying in the SPRINGS wash
  tunnels; a broker (or the victims' crew) offers a bounty.
- faction_wires: TRADES/scavenger-crew (post the bounty), HOMELESS (the tunnels are
  theirs), NETWORK (installed the implant — the truth).
- music_pool: TENSION; a wet, close, arrhythmic tunnel motif; the cyan-hum bleeds in
  as the player nears the truth; COMBAT if the confrontation turns lethal.
- ledger_writes: recorded[contract_outcome_*]; UNRECORDED[knew_it_was_a_person]=true
  once the investigation reveals the truth (whether or not the player kills anyway).
- amalgamation_thread: MEDIUM — the implant ties to Q004 (fragments), Q005 (hollowed
  unhoused); a clue node advances the Reconstruction.

===============================================================================
## 2. CAST
===============================================================================
- THE "THING" / MARA (id: mara) — a woman NeuroLinked by the Network as a tunnel
  sentinel (like the sewer-demo cybernetic homeless), then abandoned when the node
  she guarded went dark. The implant drives her to attack intruders; between
  compulsions, fragments of the person surface. She was a wash-district water-worker
  before the crash. baked rig: skin #4 + reveal-state cybernetics (uses the universal
  damage-reveal engine). default_emotion: feral_flicker -> (in lucid gaps) terrified_lost.
- BROKER KESS (id: kess) — posts the bounty for the dead scavengers' crew; wants the
  "thing" dead and doesn't care what it is. default_emotion: hard_transactional.
- OLD TServo (id: tservo) — an unhoused tunnel-dweller who's watched Mara for months
  and knows she "used to talk." The witness who humanizes her. default_emotion: quiet_sad.
- THE PLAYER — [MEDICINE]/[TRADES] (recognize/disable the implant), [READ], standing.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
CONTRACT SPINE: negotiate fee -> HUB-AND-SPOKE investigation (track the kills, read
the tunnel, hear the witness) -> the CONFRONTATION with branching resolution: KILL
(the clean contract), FREE (disable the implant — hard, pacifist), EXPOSE (turn it on
the Network who made her), or LURE-AWAY (relocate her without a cure). Fee paid or
refused per route.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE CONTRACT (negotiate the fee — Witcher law) ---
node open_01
  speaker: kess  emotion: hard_transactional  gesture: slap_down_bounty  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "Three of my crew went into the Springs wash for cable and came back in
         pieces. Something's down there. Kill it, bring proof, get paid. Simple."
  choices (PLR):
   - "What's the pay?"                        -> fee_haggle
   - "What do you actually know about it?"    -> spoke_know
   - "(Head into the wash.)"                  -> invest_hub
node fee_haggle  [BARTER optional raises it]
  speaker: kess  emotion: grudging  camera: closeup
  line: "Enough to matter. More if you're good enough to haggle — fine, you are.
         Bring proof it's dead and it's yours."
  effect: set fee (higher if BARTER passed)  -> goto invest_hub
node spoke_know
  speaker: kess  emotion: dismissive  camera: closeup
  line: "It's fast, it's strong, it comes out of the dark. Monster. What else do you
         need? Don't overthink a paycheck."
  effect: knowledge[kess_doesnt_care_what_it_is]  -> goto invest_hub

--- INVESTIGATION (the truth surfaces) ---
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Examine the kill sites.)"     -> clue_kills   [once]
   - "(Read the tunnel deeper.)"     -> clue_tunnel  [once]
   - "(Talk to the tunnel-dweller.)" -> tservo_01    [once]
   - "(Confront the thing.)"         -> confront_gate [show after >=1 clue]
node clue_kills
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:wet_low}
  line: "(The scavengers weren't eaten. They were... guarded against. Blows to drive
         them BACK, not down. Two died of falls, fleeing. Whatever this is, it's
         defending a threshold — not hunting.)"
  effect: knowledge[it_guards_not_hunts]  -> goto invest_hub
node clue_tunnel
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:cyan_hum_faint}
  line: "(A dead Network relay-node, cold for years. And nest-signs — someone LIVES
         here. A scratched tally on the wall. Names. A child's height marked in
         chalk, years old. A monster doesn't keep a height chart.)"
  effect: knowledge[something_human_lives_here]  music:{pool:TENSION,cue:cyan_hum_in}
  -> goto invest_hub
node tservo_01
  speaker: tservo  emotion: quiet_sad  gesture: look_down_tunnel  camera: two_shot
  line: "You're here for Mara. That's her name — she still says it, some nights, over
         and over like she's holding onto it. Network wired her to guard that dead
         box and then forgot her. She used to fix the wash pumps. Now she just... guards
         nothing, from everyone."
  effect: reveal knowledge[the_thing_is_mara_a_person]; UNRECORDED[knew_it_was_a_person]=true
  -> goto invest_hub

--- THE CONFRONTATION ---
node confront_gate
  speaker: mara  emotion: feral_flicker  gesture: block_threshold  camera: closeup
  music:{pool:TENSION,cue:tense_hold}  micro_expression: implant_glow_pulse
  line: "BACK. Back back back — post is — post is HELD — " [a lucid flicker] "—please.
         Please don't. I can't— I can't stop my hands. Mara. My name is Mara. RUN."
  -> goto resolve_gate

node resolve_gate (speaker: PLR)  camera: closeup
  choices:
   - "(Put her down. Fulfill the contract.)"           -> route_kill
   - "[MEDICINE/TRADES] (Disable the implant — save her.)" [require skill.medicine>=2 OR skill.trades>=2] -> route_free
   - "(This is a Network crime. Expose it.)" [require knowledge.the_thing_is_mara_a_person] -> route_expose
   - "(Lure her out of the tunnels to safety.)"        -> route_lure
===============================================================================
## 5. THE ROUTES
===============================================================================
node route_kill
  speaker: mara  emotion: relief_in_death  camera: closeup  micro_expression: implant_dims
  line: "...thank you. thank you. tell someone I fixed the pumps. tell someone I had
         a NAME—"
  effect: DEAD EYE resolves it; contract fulfilled; fee paid by Kess; recorded
    [killed_mara]; UNRECORDED (if investigated)[knew_it_was_a_person]=true — a mercy
    or a murder depending on whether you learned the truth first. Her tally-wall and
    height chart remain for an heir to find. The clean paycheck, the heavy conscience.
    (If killed WITHOUT investigating: an heir can later learn what she was — the
    unrecorded ledger delivers the gut-punch late, Whispering Hillock.)  -> END
node route_free  [MEDICINE/TRADES — hard, pacifist]
  speaker: PLR + mara
  camera: closeup  music:{pool:TENSION,cue:hold}
  beats: disabling the implant is a REAL risk under her compulsive attacks — a skill
    sequence (dodge/evade per Pacifist Path Law while working, NOT Dead Eye). SUCCESS:
    the implant dies; Mara collapses, then weeps, herself again — but the person who
    wakes has YEARS of guarding to grieve. FAIL: she's driven off (not killed); can be
    re-attempted, or she flees deeper (a sad non-resolution).
  effect (success): recorded[freed_mara]; UNRECORDED[unmade_a_sentinel]=true; mindmap
    CLUE[network_abandons_its_tools] (ties Q004/Q005 Reconstruction). Mara may join the
    Volunteers or become a wash-pump fixer again (a restored district asset). Kess
    refuses to pay (no corpse) unless [BARTER]/standing — the RIGHT thing costs the fee.
  -> END
node route_expose  [requires knowing she's a person]
  speaker: PLR (to the crew / a council)  camera: two_shot  music:{pool:TENSION,cue:resolve}
  line: "Your 'monster' is a woman the Network wired to a dead box and walked away
         from. You want it dead to feel safe. I want the people who MADE it to answer."
  effect: recorded[exposed_the_network_sentinel]; UNRECORDED[named_the_maker]=true;
    Kess may turn (some crews want the Network named, some just want blood — standing
    check); advances the Reconstruction publicly (a rare above-ground clue). Mara's
    fate still needs resolving (loops to free/lure). The systemic-blame route (the
    thesis).  -> END
node route_lure
  speaker: mara  emotion: confused_following  camera: two_shot
  beats: using scavenged bait/routine, the player leads Mara out of the tunnels to a
    quieter margin where she harms no one — without curing her. A stopgap mercy.
  effect: recorded[relocated_mara]; she survives, still implanted, still lost, but
    alive and harmless; an heir may find her still out there, still saying her name;
    Kess considers the contract unfulfilled (no proof) — no fee. The incomplete kindness.
  -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- KILLED (uninvestigated): an heir later finds the tally-wall/height-chart and learns
  what the dynasty put down — a cold late gut-punch (unrecorded ledger).
- KILLED (investigated): logged as a mercy the dynasty chose knowingly; her name is
  remembered by Tservo's account.
- FREED: Mara restored; the wash pumps get fixed (a real district benefit next gen);
  Reconstruction clue banked (network_abandons_its_tools).
- EXPOSED: a public Network clue persists; an heir inherits a crew/council that has
  heard the Network named — softens later liberation work.
- LURED: Mara wanders the margins for generations, a living ghost an heir can meet.
- UNRECORDED[knew_it_was_a_person] is the flag that decides whether this reads as a
  hunt or a mercy across the fold.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Mara is the payload — feral_flicker cracking to terrified_lost, the implant_glow
  pulsing (uses the universal damage/reveal engine: her cybernetics show as she's hurt
  or lucid). The lucid gaps ("my name is Mara. RUN.") are the gut of the quest. Kess's
  hard transactionality and Tservo's quiet sadness frame the moral poles. Procedural
  lip-sync; her feral speech is broken/repetitive, her lucid speech slow and human.
BODY: talk-idle vs a threat-crouch loop; block_threshold as a RETURN one-shot. The FREE
  route uses the dodge/evade minigame (working under attack, non-lethal); the KILL route
  hands to Dead Eye. Reveal-state cybernetics animate via the universal damage-reveal.
CAMERA: wet close tunnel framing; closeups on Mara's flickers; the confrontation holds
  on her face at the lucid break. Cuts on beat.
MUSIC: an arrhythmic wet tunnel motif; the cyan-hum fades in as the truth surfaces
  (diegetic Amalgamation tell — consistent with Q004/Q009); COMBAT only on the kill
  route. 120 BPM swaps.

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton laws)
===============================================================================
- The contract INVITES the Dead Eye (it's a bounty) but never requires it: FREE, LURE,
  and EXPOSE are all non-lethal (FREE/LURE use dodge/evade, not killing). The pacifist
  path is HARDER and PAYS LESS (Kess won't pay without a corpse) — mercy costs the fee
  (Undertale + Megaton reward-divergence).
- Rewards diverge: KILL = guaranteed fee + a conscience; FREE = no fee + a restored
  person + a Reconstruction clue + a district benefit; EXPOSE = a public clue + shifted
  standing; LURE = no fee + a living ghost. The paycheck and the right thing point
  opposite ways — which is the whole point.

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Exercises the UNIVERSAL DAMAGE-REVEAL engine (Mara's
cybernetics surface as she's hurt/lucid) and the dodge/evade non-lethal path. Reads
ledger/standing/skill/knowledge/fold; writes same + a Reconstruction clue (free/expose)
+ a district-asset flag (free). Deterministic + save-through. Gate: all four routes
resolve, free-route success AND fail handled non-lethally, fee logic correct per route,
the person-truth flag sets on investigation, reveal-engine hooks fire. Joins the suite.

## 10. WHAT THIS PROVES (vs 001-009)
Fills the last open core engine: the CONTRACT (Witcher shape) — a bounty on a "monster"
that investigation reveals is a wronged NeuroLinked person, reframing the sanctioned
kill as a hunt/mercy/rescue the game refuses to score, with a negotiable fee and a
pacifist path that pays LESS. It exercises the universal damage-reveal engine and the
non-lethal dodge path, and advances the Reconstruction. With this, ALL core engines +
both pillars have reference builds. The bible's engine set is COMPLETE at 10 quests;
everything after is variation and volume toward ~90.

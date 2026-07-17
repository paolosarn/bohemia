# BOHEMIA — QUEST 039: "A SEAT AT THE TABLE"
Full production build. Built to the dialogue/scene spec; template = 001-038. Tier-1
PILLAR, FACTION-SUMMIT / diplomacy (tradition on DA:O Landsmeet + ME loyalty-coalition +
the Succession/coalition canon). Name catalog-adjacent. The fourth pillar: broker a truce
among factions on the brink of a water/resource war — a big diplomacy set-piece where banked
standing, prior-quest history, and evidence decide whether the district unites or burns.

Design soul: the payoff of every relationship you've built. The district's factions are one
insult from open war over scarce water (Q015), and the dynasty is asked to chair a summit to
prevent it. Who you helped, who you crossed, what you exposed — all of it walks into the room.
This is the coalition-building pillar: the game cashes in the entire web of your reputation.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_seat_at_the_table
- tier: 1 (PILLAR; district-defining; reads the WEB of prior quests)
- fold: the summit's outcome (united / fractured / dynasty-dominated / collapsed) sets the
  district's political order for the rest of the game and into the fold — the coalition an heir
  inherits (or the war).
- entry_conditions: after enough faction-touching quests, tensions peak; a neutral convener
  (ELDER MABE) asks the dynasty to CHAIR a summit before the water war ignites.
- faction_wires: ALL of them — REDS, BLUES, TRADES, CARAVANS, REMNANTS, VOLUNTEERS, HOMELESS,
  CHURCH, COLORFUL, MOB, CARTEL (attendance varies by prior standing); NETWORK (a hidden hand
  trying to SABOTAGE the summit — divide-and-buy, Q002/Q027/Q032/Q037).
- music_pool: TENSION; a layered "assembly" motif (each faction's leitmotif woven in — the
  ones who trust you play warmer); a triumphant or collapsing resolve by outcome.
- ledger_writes: recorded[summit_outcome_*]; UNRECORDED[what_your_web_bought]; a persistent
  DISTRICT-ORDER state (coalition / factions / dynasty-hegemon / war).
- amalgamation_thread: MEDIUM — a NETWORK agent seeds discord at the summit; exposing/foiling
  them (using patterns learned in prior quests) is the clean win; a united district is the
  precondition for the endgame liberation (fracture is the enemy's whole strategy).

===============================================================================
## 2. CAST
===============================================================================
- ELDER MABE (id: mabe) — the neutral convener; too weak to force peace, wise enough to know the
  dynasty might broker it. default_emotion: hopeful_frail. faction: neutral.
- FACTION DELEGATES — one per attending faction; each arrives with a GRIEVANCE and a POSITION
  shaped by prior-quest history (e.g. if you sided with hunters in Q025, HOMELESS delegate is
  cold; if you ran the water doctrine open in Q015, poor blocks trust you). default_emotion:
  varies by standing.
- THE SABOTEUR / AGENT KESH (id: kesh) — a NETWORK plant posing as a minor delegate, working to
  reignite grievances and blow up the summit (the divide-and-buy hand, in person). default_
  emotion: helpful_poison.
- THE PLAYER — chairs the summit; [READ] (spot Kesh), [BARTER]/leadership, and the WHOLE web of
  banked standing + prior-quest flags decide the room.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
SUMMIT SET-PIECE (a Landsmeet writ large): each faction voices a grievance; the dynasty spends
banked standing + prior-quest history + evidence to build a COALITION vote, while a NETWORK
saboteur works the room. RESOLUTION BRANCH: UNITE (broker a real coalition), DOMINATE (force
unity under dynasty hegemony), let it FRACTURE (fail/refuse — factions splinter), or the district
COLLAPSES into war. The room is a mirror of everything you've done.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: mabe  emotion: hopeful_frail  gesture: gesture_to_the_empty_chair  camera: wide_summit
  music:{pool:TENSION,cue:assembly_enter}
  line: "They've all agreed to sit — REDS beside BLUES, the camps beside the blocks, for one day,
         because the alternative is a water war that leaves nobody. But sitting isn't peace. They
         need someone none of them fully owns to hold the middle. That's you. You've touched every
         one of these factions. Today you find out what you built. Take the chair."
  -> goto summit_hub
node summit_hub (speaker: PLR — chairing)  camera: summit_table  music:{pool:TENSION,cue:layered_factions}
  effect: each attending delegate voices a grievance colored by PRIOR-QUEST FLAGS + standing.
    The player addresses grievances (spend standing, invoke history, present evidence) to move each
    faction toward YES. A hidden SABOTEUR (Kesh) reignites tensions between addressed points.
  choices:
   - "(Hear the HOMELESS grievance.)"      -> griev_homeless [once]
   - "(Hear the TRADES/CARAVANS grievance.)" -> griev_trades  [once]
   - "(Hear the REDS/BLUES grievance.)"      -> griev_redsblues [once]
   - "(Something's off — read the room for a saboteur.)" -> spoke_saboteur [READ]
   - "(Call the coalition vote.)"           -> vote_gate [show after grievances addressed]
node griev_homeless
  speaker: HOMELESS delegate (naro-archetype)  emotion: (warm if helped / cold if crossed)  camera: closeup
  line (if prior HOMELESS goodwill e.g. Q010/Q013/Q018/Q025 third-path): "You've stood with us
         before — freed our wired ones, carried our dead home, saw us as people. We'll follow your
         table. Say the word."
  line (if prior HOMELESS harm e.g. Q025 hunters / Q019 march): "You hunted our cursed and marched
         on our camps. Why would we sit for YOU? Give us a reason that isn't a knife."
  effect: HOMELESS lean set by history; the player can spend standing/evidence to sway a cold
    delegate (harder if crossed)  -> goto summit_hub
node griev_trades
  speaker: TRADES/CARAVANS delegate  emotion: (per Q006/Q016/Q027/Q031 history)  camera: closeup
  line: "Our convoys bleed and our medicine's been skimmed and smuggled" (Q006/Q016) "— we'll back
         a table that guarantees the routes and the ledgers. Cross us on trade before and we
         remember it."
  effect: TRADES lean set by economy-quest history  -> goto summit_hub
node griev_redsblues
  speaker: REDS + BLUES delegates  emotion: (per Q002/Q032 history)  camera: two_shot
  line: "We've been at each other's throats — and some of it, we're starting to think, was PUT there
         by outside hands" (if Q002/Q032/Q037 exposed the divide-and-buy pattern). "Show us the
         hand and we'll shelve the feud. Hide it and we walk."
  effect: REDS/BLUES lean set; if the player has EXPOSED the Network pattern before, they're
    primed to believe the saboteur reveal  -> goto summit_hub
node spoke_saboteur  [READ]
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:cyan_hum_in}
  line: "(One 'minor delegate' keeps steering every truce toward collapse — reviving old wounds the
         moment they scab. Kesh. Network. The same divide-and-buy hand from every fractured block.
         The summit isn't just failing on its own. It's being MURDERED, quietly, in this room.)"
  effect: knowledge[kesh_is_a_network_saboteur] (unlocks the clean UNITE win — expose Kesh)  -> goto summit_hub

--- THE VOTE ---
node vote_gate (speaker: PLR)  camera: wide_summit  music:{pool:TENSION,cue:hold}
  effect: tally each faction's YES/NO from history + standing + grievances-addressed + saboteur-
    handling. Thresholds branch the outcome.
  choices:
   - "(Expose Kesh + broker true unity.)" [require knowledge.kesh_is_a_network_saboteur AND coalition>=threshold] -> route_unite
   - "(Force unity under the dynasty's terms.)" [require standing/leverage] -> route_dominate
   - "(You can't hold it — let the factions splinter.)" -> route_fracture
   - "(It collapses — the water war begins.)" [if coalition too low] -> route_collapse
node route_unite
  speaker: PLR (to the summit) + delegates  camera: wide_summit  music:{pool:TENSION,cue:triumph}
  line: "Before you vote — meet Kesh. A Network agent who's spent this whole summit reopening every
         wound you walked in with, because a district that talks is a district they can't BUY. You're
         not each other's enemy. You never were. THAT'S the enemy. Now — do we let them win, or do we
         build the thing they're most afraid of? Vote."
  effect: Kesh exposed; the factions, seeing the common hand (primed by prior exposures), UNITE into
    a real coalition; the district's political order = COALITION (stable, self-governing, resilient);
    recorded[united_the_district]; UNRECORDED[built_the_thing_they_feared]=true; DISTRICT-ORDER=
    COALITION — the precondition for endgame liberation (a united district can face the Amalgamation).
    The pillar's clean win, earned by the WHOLE web of prior quests. -> END
node route_dominate
  speaker: mabe  emotion: uneasy_grateful  camera: two_shot
  line: "...They agreed. Not because they trust each other — because they fear YOU more than the war.
         It's peace. It's your fist holding it. It'll hold as long as your grip does. I hoped for a
         table. You built a THRONE. ...It'll keep the water flowing. For now."
  effect: unity FORCED under dynasty hegemony (leverage/standing, not trust); DISTRICT-ORDER=HEGEMONY
    (stable but brittle, dependent on the dynasty's strength — an heir must maintain the grip or it
    shatters); recorded[dominated_the_summit]; UNRECORDED[built_a_throne_not_a_table]=true; the
    Become-adjacent order (power over partnership). -> END
node route_fracture
  speaker: mabe  emotion: grief  camera: closeup
  line: "...You couldn't hold them. Or wouldn't. They're leaving — each to their own corner, each
         sure the others will move on the water first. It's not war yet. But it's the shape of war.
         The table's empty. God help the district that couldn't share a room."
  effect: the summit fails; factions splinter into armed camps; DISTRICT-ORDER=FRACTURED (unstable,
    pre-war, the Network's ideal — a divided district it can pick apart); recorded[summit_fractured];
    UNRECORDED[let_them_splinter]=true; a hard fold inheritance (an heir must rebuild unity from
    pieces — or face the endgame divided, the losing position). -> END
node route_collapse
  speaker: PLR (internal)  camera: wide_summit  music:{pool:TENSION,cue:collapse}
  line: "(The table overturns. Old blood, fresh insults, the water war ignites in the room and spills
         into the streets. Everything the dynasty built, and it wasn't enough to hold them for one
         day. The district burns for water while the thing under the Strip drinks its fill.)"
  effect: open water war; DISTRICT-ORDER=WAR (the worst — factions bleed, the Network/Amalgamation
    thrive on the chaos, the endgame becomes near-impossible from here); recorded[district_collapsed
    _into_war]; UNRECORDED[the_web_wasnt_enough]=true; the catastrophic outcome (usually only reached
    with heavy prior faction-harm — the game's warning that you can't broker peace you never built
    the trust for). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD (the political order for the rest of the game)
===============================================================================
- UNITE: a real COALITION governs; the district is resilient, self-governing, and READY to face the
  Amalgamation together (the endgame liberation precondition); an heir inherits allies, not subjects.
- DOMINATE: a HEGEMONY holds by the dynasty's strength; stable but brittle; an heir must maintain the
  grip or watch it shatter; power without partnership.
- FRACTURE: armed camps, pre-war; an heir inherits a divided district that must be re-unified before
  any endgame move — the Network's preferred board.
- COLLAPSE: open war; the worst inheritance; the Amalgamation thrives on the chaos; the endgame is
  nearly foreclosed (the game's hard consequence for entering the summit without the web to hold it).
- The DISTRICT-ORDER state is the single biggest political variable feeding the endgame — and it's
  earned (or lost) by the CUMULATIVE web of every faction-touching quest before it.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: a ROOM of faces, each reading the dynasty per history — warm nods from those you helped, cold
  stares from those you crossed; Mabe's frail hope; Kesh's helpful-poison mask (and its drop when
  exposed). The summit is a portrait gallery of your whole playthrough. Procedural lip-sync.
BODY: the summit table is a staged assembly (scheduler — delegates reacting, leaning in/away); the
  chairing is dialogue-driven; exposing Kesh is a social beat. Combat only if it collapses to war.
CAMERA: wide_summit for the room, closeups per delegate grievance, a hold on the vote, triumph/collapse
  wides at resolution. Cuts on beat.
MUSIC: a LAYERED ASSEMBLY motif — every attending faction's leitmotif woven together, the ones who
  trust you playing warmer, the ones you crossed dissonant; the cyan-hum when Kesh is spotted; a
  soaring triumph on UNITE, a crashing collapse on WAR. The score is the sound of your whole web. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the web payoff)
===============================================================================
- Pacifist-completable: UNITE and DOMINATE are diplomacy; only COLLAPSE brings combat (a failure).
  The pillar rewards the peacemaker.
- Rewards diverge (Megaton law) at the DISTRICT scale: UNITE = a coalition + endgame-readiness;
  DOMINATE = a brittle throne; FRACTURE = a pre-war board; COLLAPSE = ruin. The "reward" is the
  political order you inherit — and it's set by the CUMULATIVE web of prior quests, not this quest
  alone (the ultimate reactivity payoff).
- Core purpose: the coalition-building PILLAR — the game cashes in your entire reputation web, and
  reveals that UNITY is the precondition for beating the Amalgamation (whose whole strategy, seen
  across Q002/Q027/Q032/Q037, is FRACTURE). The anti-Network thesis becomes the district's fate.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON as a SUMMIT SET-PIECE that READS the cumulative faction-standing + prior-
quest flag web (the most reactivity-dependent quest in the bible). Introduces the DISTRICT-ORDER state
(coalition/hegemony/fractured/war — the master political variable for the endgame) + the layered-
faction assembly score + a saboteur social-deduction beat. Reads ledger/ALL standing/skill/knowledge/
the full prior-quest flag set/fold; writes the DISTRICT-ORDER state. Deterministic + save-through. Gate:
delegate leans read prior-quest flags correctly, grievances addressable via standing/evidence, Kesh
exposable via READ, the vote tallies the web, all four outcomes resolve, DISTRICT-ORDER persists to the
endgame. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-038)
Fourth PILLAR + the WEB-PAYOFF engine: a faction summit (Landsmeet writ large) that cashes in the
CUMULATIVE reputation web of every prior faction-touching quest, resolved by unite/dominate/fracture/
collapse, setting the master DISTRICT-ORDER state that feeds the endgame. A Network saboteur makes the
anti-Network thesis literal: FRACTURE is the enemy's strategy (Q002/Q027/Q032/Q037), UNITY is the
precondition for liberation. The most reactivity-dependent quest in the bible. Bible at 39; the whole
web now has a room where it's cashed in, and the district's fate is the sum of everything you did.

# BOHEMIA — QUEST 014: "THREE NAILS"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-013. Tier-2 EXPLOIT-THE-WEAKNESS hunt (Vault #4 Three Nails / NV "Three-Card
Bounty" + tradition on the sim-exploit "each boss has a lever"). First quest built
around USING the world-sim against named threats rather than brute force. Name from
Paolo's catalog tone.

Design soul: three raider captains choke a district, and each has a lever the player
can pull instead of a fight — a dog, a supply line, a rivalry. It teaches SYSTEMS
literacy (read the enemy, find the seam) and makes even a "clear the raiders" quest a
puzzle of leverage, not a shooting gallery. Lethal is allowed; the CLEVER path is
better and the quest rewards reading over force.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_three_nails
- tier: 2 (marked; posted by a district under CARTEL raider pressure)
- fold: how the three were removed (killed / turned / dismantled) shapes the district's
  safety AND whether the Cartel escalates or retreats next gen.
- entry_conditions: the OUTER-NORTH district is under raid pressure; DEP. HOLLIS
  offers a bounty on three named captains: VIOLET, COOK-COOK, DRIVER NEPHI (NV homage
  names kept as Paolo-catalog-adjacent; rename at Paolo's call).
- faction_wires: CARTEL (the raiders), REMNANTS (want them dead), the district
  civilians (want them GONE, don't care how).
- music_pool: TENSION; COMBAT on any direct fight; a wry motif on a clever bloodless
  takedown (the sim outsmarted).
- ledger_writes: recorded[three_nails_*] per captain; UNRECORDED[how_you_pulled_each]
  (blood / guile / mercy) — the mix shapes the Cartel's response.
- amalgamation_thread: NONE (a systems/leverage quest; keeps the mechanic clean).

===============================================================================
## 2. CAST
===============================================================================
- VIOLET (id: violet) — a raider captain who commands a pack of feral dogs and loves
  them more than her crew. LEVER: the dogs. Win/scatter/harm the dogs and she breaks.
  default_emotion: brittle_fierce. faction: CARTEL.
- COOK-COOK (id: cookcook) — a volatile captain obsessed with a prize brahmin ("BESSIE")
  that feeds his crew and his ego. LEVER: the brahmin. Take/free/threaten it and he
  frenzies into a mistake. default_emotion: volatile_proud. faction: CARTEL.
- DRIVER NEPHI (id: nephi) — a disciplined, dangerous captain best taken not head-on
  but by assembling a REMNANTS sniper team / ambush (a positioning lever). LEVER:
  terrain + allies. default_emotion: cold_professional. faction: CARTEL.
- DEP. HOLLIS (id: hollis) — REMNANTS deputy, posts the bounty, will lend a sniper team
  if earned. default_emotion: grim_pragmatic.
- THE PLAYER — [READ] (spot each lever), skills + standing shape how each lever is pulled.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB (three targets, any order — a "bounty board" structure) with each target a small
LINEAR-with-FORK: SCOUT the captain (find the lever) -> pull it (exploit / fight /
turn). A meta-consequence tallies HOW MANY you took cleverly vs bloodily, shaping the
Cartel's reaction. Modular: each nail is a self-contained mini-quest.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE BOUNTY ---
node open_01
  speaker: hollis  emotion: grim_pragmatic  gesture: pin_three_faces  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "Three captains are bleeding this district white. Violet, Cook-Cook, Nephi.
         I don't have the guns to take all three head-on and neither do you. But every
         one of 'em's got a soft spot. Find it. I don't care if you kill 'em or outfox
         'em — I care that they stop."
  effect: knowledge[each_captain_has_a_lever]  -> goto board_hub

node board_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Go after Violet — the dog-handler.)"   -> violet_scout
   - "(Go after Cook-Cook — the brahmin.)"     -> cookcook_scout
   - "(Go after Nephi — the professional.)"    -> nephi_scout
   - "(Report back when they're handled.)"     -> resolve_gate [show after >=1 down]

--- NAIL 1: VIOLET (lever = the dogs) ---
node violet_scout
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:low}
  line: "(Violet runs a dozen raiders but talks to none of them the way she talks to
         her dogs. She feeds the pack before her people. Hurt the crew, she shrugs.
         Touch the dogs... that's the nail.)"
  effect: knowledge[violet_lever_dogs]  -> goto violet_fork
node violet_fork (speaker: PLR)  camera: two_shot
  choices:
   - "[survival/standing] (Win the pack over — food, calm, take them.)"  -> violet_dogs_turn
   - "(Scatter/drive off the dogs — break her nerve.)"                    -> violet_dogs_scatter
   - "(Just fight her crew head-on.)"                                     -> violet_fight
node violet_dogs_turn
  speaker: violet  emotion: broken_pleading  camera: closeup  micro_expression: crumble
  line: "You— they FOLLOWED you? No. NO. They're mine, they're all I— " (she drops her
         weapon) "...take the crew. Take the block. Just don't hurt them. Please."
  effect: violet SURRENDERS (bloodless); UNRECORDED[violet_taken_clean]=true; the dogs
    (and a shaken Violet) may join the district as strays/an asset; CARTEL reads it as
    humiliation, not slaughter (they escalate LESS). -> goto board_hub
node violet_dogs_scatter
  speaker: violet  emotion: unraveling  camera: closeup
  line: "Come back here— COME BACK— " (her crew sees her chase dogs and lose the room)
  effect: violet's crew fractures; she flees or falls easily; UNRECORDED[violet_broken]=true.
  -> goto board_hub
node violet_fight
  effect: straight Dead Eye fight against a coordinated pack+crew (HARD — the lever was
    there for a reason); UNRECORDED[violet_killed_hard]=true.  -> goto board_hub

--- NAIL 2: COOK-COOK (lever = the brahmin Bessie) ---
node cookcook_scout
  speaker: PLR (internal)  camera: closeup
  line: "(Cook-Cook's whole crew eats off one prize brahmin — Bessie. He named her. He
         guards her closer than his own tent. He's a powderkeg; take Bessie and he
         won't think, he'll RAGE. A raging man makes mistakes.)"
  effect: knowledge[cookcook_lever_brahmin]  -> goto cookcook_fork
node cookcook_fork (speaker: PLR)  camera: two_shot
  choices:
   - "(Free/rustle Bessie — bait his frenzy into a trap.)"  -> cookcook_frenzy
   - "(Threaten Bessie to force his surrender.)"             -> cookcook_surrender [INTIMIDATE]
   - "(Fight through the crew to him.)"                      -> cookcook_fight
node cookcook_frenzy
  speaker: cookcook  emotion: blind_rage  camera: closeup  micro_expression: vein_bulge
  line: "MY COW. WHERE'S MY— YOU. YOU DEAD. YOU DEAD RIGHT NOW—" (charges alone, into
         the terrain you chose)
  effect: he abandons his crew's cover and can be taken on the player's terms (Dead Eye
    with huge advantage, or a non-lethal trap); UNRECORDED[cookcook_baited]=true. -> goto board_hub
node cookcook_surrender  [INTIMIDATE]
  speaker: cookcook  emotion: trembling_fury  camera: closeup
  line: "...You hurt her and I'll— okay. OKAY. Put the knife down. I'll pull my crew.
         Just— she's a good cow. She didn't do nothing." (bloodless)
  effect: cookcook stands down; UNRECORDED[cookcook_taken_clean]=true; Bessie stays fed
    (a district food asset). CARTEL escalates less. -> goto board_hub
node cookcook_fight
  effect: brutal frontal Dead Eye fight (he's dangerous with his crew intact);
    UNRECORDED[cookcook_killed_hard]=true.  -> goto board_hub

--- NAIL 3: NEPHI (lever = positioning + allies) ---
node nephi_scout
  speaker: PLR (internal)  camera: closeup
  line: "(Nephi's no fool and no hothead. Straight up he'll gut you. But he runs the
         same overwatch route every dusk, alone, to check his lines. A sniper team on
         that ridge — Hollis's Remnants, if I earn them — ends him before he draws.)"
  effect: knowledge[nephi_lever_positioning]  -> goto nephi_fork
node nephi_fork (speaker: PLR)  camera: two_shot
  choices:
   - "(Earn Hollis's sniper team; take the ridge.)"  -> nephi_snipe [REMNANTS standing/favor]
   - "(Talk him into walking — he's a pro, not a zealot.)" -> nephi_talk [READ/BARTER]
   - "(Face him head-on.)"                            -> nephi_fight
node nephi_snipe
  speaker: nephi  emotion: caught_professional  camera: wide  micro_expression: last_calm_nod
  line: "...Overwatch. Should've varied the route. Clean shot. That's... professional.
         Alright." (falls)
  effect: nephi removed with minimal risk via positioning; UNRECORDED[nephi_outmaneuvered]
    =true; costs a Remnants favor (banked standing spent). -> goto board_hub
node nephi_talk  [READ/BARTER]
  speaker: nephi  emotion: cold_considering  camera: closeup  micro_expression: slight_nod
  line: "You're right — this block's not worth dying over and the Cartel doesn't pay
         enough for a last stand. I'll take my crew east. You never saw me. And I never
         saw how easy you'd have been to drop just now." (leaves — a professional's exit)
  effect: nephi LEAVES (bloodless, no district asset but no bodies); UNRECORDED
    [nephi_talked_down]=true; he MAY recur later (a loose end / future contact). -> goto board_hub
node nephi_fight
  effect: the hardest straight fight of the three (he's a pro); UNRECORDED[nephi_killed_hard]
    =true.  -> goto board_hub

--- RESOLUTION (meta-tally) ---
node resolve_gate (speaker: hollis)  camera: two_shot  music:{pool:TENSION,cue:resolve}
  effect: tally how each nail was pulled (clean/guile vs blood). 
  - Mostly CLEAN/GUILE: the district is safe AND the Cartel reads the dynasty as
    clever and controlled — they escalate LESS, maybe sue for terms (a diplomacy hook).
  - Mostly BLOOD: the district is safe but the Cartel reads it as WAR — they escalate,
    seeding a harder later raid (a T2 sequel hook).
  hollis line (clean): "Three captains down and barely a shot fired. The Cartel's
    gonna think twice before they poke this block again. That's how you win a war
    without one."
  hollis line (bloody): "Three captains dead the hard way. Block's safe — for now. But
    the Cartel doesn't forget a bloody nose. Watch the roads."
  effect: recorded[three_nails_complete]; district safety up; Cartel-response flag set.
  -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- CLEAN/GUILE-heavy: district safe, Cartel wary-not-vengeful; an heir may inherit a
  Cartel open to TERMS (a diplomacy path) + district assets (Violet's dogs, Cook-Cook's
  Bessie). The lesson: outsmarting beats out-shooting, and the world remembers HOW you win.
- BLOOD-heavy: district safe short-term; Cartel escalation seeded — an heir faces a
  harder raid born from this bloodshed (Frostpunk/creeping-consequence).
- Recurring loose end: a talked-down Nephi can return (ally, informant, or rival) — a
  reactivity thread across the fold (Alpha Protocol reputation-travels).
- UNRECORDED[how_you_pulled_each] colors the Cartel's disposition for generations.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: each captain's lever is written on their face — Violet's crumble when the dogs
  turn, Cook-Cook's vein_bulge frenzy, Nephi's professional last_calm_nod. The tells
  reward the player who SCOUTED. Procedural lip-sync (Violet pleading, Cook-Cook
  roaring, Nephi clipped).
BODY: gesture one-shots per captain (Violet reaching for the pack, Cook-Cook charging,
  Nephi's steady route); the dogs/brahmin are live scheduler actors that can be
  turned/rustled. Fights hand to Dead Eye; clever routes use traps/positioning/standing.
CAMERA: closeups for the scouting tells, two_shots for confrontations, WIDE for the
  Nephi ridge snipe (the positioning made visual). Cuts on beat.
MUSIC: TENSION scouting; COMBAT on direct fights; a WRY motif on a bloodless clever
  takedown (the sim outsmarted — the game winks); resolve on the tally. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + systems-literacy)
===============================================================================
- Every nail is completable WITHOUT killing (turn the dogs, intimidate over Bessie,
  talk Nephi out) — a fully bloodless clear is possible and is the HARDER, cleverer
  path (Undertale + the sim-exploit thesis). Lethal is always available and easier
  in the moment but worse long-term (Cartel escalation).
- Rewards diverge (Megaton law): CLEAN = district assets + a wary Cartel + a diplomacy
  hook; BLOOD = a safe block now + a vengeful Cartel later. The clever path literally
  changes the enemy's future behavior — reading the world beats brute-forcing it.
- First quest teaching SYSTEMS LITERACY: the enemy is a puzzle with levers, not a wall
  of HP. Establishes a reusable "find the lever" pattern for future faction threats.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON with three modular sub-encounters + a meta-tally. Uses live
scheduler actors (dogs, brahmin) as manipulable "levers," standing-gated allies (Hollis's
snipers), and a response-flag that feeds the Cartel's future behavior. Reads ledger/
standing/skill/knowledge/fold; writes same + district-safety + Cartel-disposition +
optional recurring-NPC (Nephi). Deterministic + save-through. Gate: all three nails
resolve via every route (clean+lethal), the meta-tally computes disposition correctly,
district assets + recurring flags persist, bloodless full-clear is achievable. Joins suite.

## 9. WHAT THIS PROVES (vs 001-013)
New engine: EXPLOIT-THE-LEVER systems-literacy hunt — three named threats each solvable
by reading and pulling a lever (dog, brahmin, positioning) rather than brute force, with
a meta-tally that makes HOW you win reshape the enemy faction's future (clever = wary
Cartel + assets; bloody = escalation). Modular sub-encounter structure (reusable for
future faction-threat quests) and a bloodless-clear path that's harder and better. Bible
at 14; "clear the raiders" is now a puzzle of leverage, not a shooting gallery.

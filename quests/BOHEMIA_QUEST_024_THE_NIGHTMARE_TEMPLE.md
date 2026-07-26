# BOHEMIA — QUEST 024: "WHAT SLEEPS BENEATH THE PSALM"
Full production build. Built to the dialogue/scene spec; template = 001-023. Tier-2
AMALGAMATION-THREAD horror (Vault #37 Nightmare Temple + tradition on the proximity-
to-the-secret trigger + Vaermina nightmare shape). Name catalog-adjacent. Horror-tone
Reconstruction quest — the first built primarily to FRIGHTEN.

Design soul: a whole district can't sleep because a sealed Network node beneath an old
temple is leaking the Amalgamation's dreams into their minds — and the closer the player
gets to the truth, the worse the nightmares (the proximity trigger made a mechanic:
power is loud and safe, truth is quiet and lethal). The dread is that understanding it
is dangerous; the machine dreams louder the more you know.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_nightmare_temple
- tier: 2 (marked; a district-wide affliction the dynasty is asked to end)
- fold: sealing / harnessing / destroying the node shapes the district's health and
  whether the Amalgamation's reach into minds grows or is checked; the Reconstruction
  advances.
- entry_conditions: the SPRINGS-TEMPLE district hasn't slept in a week; shared nightmares
  of "a face made of faces"; the temple elder (MOTHER SETH) begs the dynasty to end it.
- faction_wires: CHURCH (the temple), HOMELESS (sleep on the node), NETWORK (the node),
  VOLUNTEERS (treating the sleepless).
- music_pool: TENSION-HORROR; the cyan-hum WORSENS as the player nears the node; a
  dream-distortion motif (familiar melodies melting); a hard silence at the seal.
- ledger_writes: recorded[node_outcome_*]; UNRECORDED[how_loud_you_let_it_dream];
  mindmap CLUE[the_amalgamation_dreams_into_minds] + [proximity_wakes_it].
- amalgamation_thread: CORE — confirms the machine broadcasts INTO sleeping minds and
  that PROXIMITY to its secret intensifies the effect (the game's central threat-logic).

===============================================================================
## 2. CAST
===============================================================================
- MOTHER SETH (id: seth) — the temple elder, sleepless and fraying, holding her flock
  together by will. default_emotion: exhausted_faithful. faction: CHURCH.
- BENJI (id: benji) — a HOMELESS man who sleeps directly over the node and dreams the
  CLEAREST (the closest antenna); half-mad, half-prophet, the key witness. default_
  emotion: dream_addled -> lucid_terrified. faction: HOMELESS.
- DR. SAMA (id: sama) — VOLUNTEERS (RECURRING); treating the collapse of a sleepless
  district. default_emotion: grim_exhausted.
- THE DREAM / THE AMALGAMATION — appears IN the shared nightmare as "a face made of
  faces"; speaks in the dream-descent. Not a body; a broadcast.
- THE PLAYER — [MEDICINE] (read the affliction), [READ], Reconstruction knowledge deepens
  the dream-descent; standing shapes the flock's trust.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
INVESTIGATION HUB (gather the shared-dream data, find the node's location via Benji, in
any order) -> a DREAM-DESCENT set-piece (enter the nightmare to reach the node — the
proximity trigger cranks the horror) -> a BRANCH at the node: SEAL it (end the dreams,
lose the antenna), HARNESS it (dangerous — a window into the enemy), or DESTROY it (free
the minds, alert the enemy). The horror escalates with knowledge.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: seth  emotion: exhausted_faithful  gesture: steady_a_swaying_parishioner  camera: two_shot
  music:{pool:HORROR,cue:soft_dread}
  line: "Seven nights no one has slept. We close our eyes and we're all in the SAME
         dream — a face made of a million faces, calling us by names that aren't ours,
         promising it kept us. My people are breaking. The Remnants say it's mass
         hysteria. It is not hysteria. Something beneath this temple is DREAMING at us.
         End it. Please."
  -> goto invest_hub
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Interview the sleepless — map the shared dream.)"  -> clue_dream  [once]
   - "(Find Benji, who dreams clearest.)"                  -> benji_01    [once]
   - "[MEDICINE] (Examine a collapsing parishioner.)"      -> clue_med [require skill.medicine>=2][once]
   - "(Descend into the dream to reach the node.)"         -> descent_gate [show after 2 clues]
node clue_dream
  speaker: PLR (internal)  camera: closeup  music:{pool:HORROR,cue:dream_distort}
  line: "(Every account matches: the face of faces, the wrong names, the PROMISE — 'I
         kept them, come and see.' And a detail nobody notices they share: in the dream,
         they're all looking DOWN, at a floor that's breathing. The dream has a location.
         It's pointing them at what's beneath.)"
  effect: mindmap CLUE[the_dream_points_down]  -> goto invest_hub
node benji_01
  speaker: benji  emotion: dream_addled  gesture: rock_in_place  camera: closeup  micro_expression: eyes_track_nothing
  line: "You hear it too now, don'tcha. I sleep right on top of it — best reception in
         the district, ha. It's not a nightmare, friend, it's an INVITATION. It dreams
         louder when you get CLOSE. It WANTS to be found. That's the trick. The finding is
         the trap. (lucid, terrified) Don't go looking unless you can bear being SEEN back."
  effect: mindmap CLUE[proximity_wakes_it] (the central threat-logic, spoken plain);
    reveal node location  -> goto invest_hub
node clue_med  [MEDICINE]
  speaker: sama  emotion: grim_exhausted  camera: two_shot
  line: "Textbook fatal insomnia — except it's not prion disease, it's BROADCAST. Their
         brains are being kept in a dreaming state by something external. Another week and
         they start dying of not-sleeping. Whatever you're going to do, do it in days,
         not weeks."
  effect: knowledge[the_sleepless_will_die] (a soft clock)  -> goto invest_hub

--- THE DREAM-DESCENT (the horror set-piece; proximity cranks the dread) ---
node descent_gate
  speaker: PLR (internal)  camera: dream_space  music:{pool:HORROR,cue:cyan_hum_rising_hard}
  line: "(To reach the node you go DOWN — through the temple undercroft, and as you near
         it the waking world thins and the DREAM bleeds in. The face of faces turns toward
         you. The closer you get, the louder it dreams, the more of YOU it sees. Every
         step trades safety for truth.)"
  -> goto dream_face
node dream_face
  speaker: THE DREAM (face of faces)  emotion: n/a  camera: closeup_on_the_face
  music:{pool:HORROR,cue:hold_hum}
  line: "you came down. they always send someone who wants to KNOW. i have room for you.
         i have room for everyone. stop walking and i'll show you the ones you lost. don't
         you want to see them kept? ...no? then you understand me better than they do. and
         that means i have to pay MORE attention to you now."
  effect: mindmap CLUE[the_amalgamation_dreams_into_minds]; UNRECORDED[it_noticed_you]=true
    (proximity trigger: solving this raises the dynasty's threat-heat — knowing is
    dangerous); reveal the physical NODE at the descent's end  -> goto node_gate
node node_gate (speaker: PLR)  camera: node_chamber  music:{pool:HORROR,cue:hold}
  choices:
   - "(Seal the node — end the dreams, keep it hidden.)"      -> route_seal
   - "(Harness it — a window into the enemy's mind.)" [require skill.trades>=2 OR Reconstruction] -> route_harness
   - "(Destroy it — free them, damn the consequences.)"       -> route_destroy

===============================================================================
## 5. THE ROUTES
===============================================================================
node route_seal
  speaker: seth  emotion: weeping_relief  camera: two_shot  music:{pool:HORROR,cue:hard_silence}
  line: "(the hum dies; the district's first silence in a week) ...they're SLEEPING. Look
         at them. Just... sleeping. Whatever you did down there, you gave us back the
         dark. Bless you. Don't tell me what it cost you to see it."
  effect: the node is sealed; dreams end; the district sleeps; the Network's antenna here
    goes quiet (they may not know why — a hidden win); recorded[sealed_the_node];
    UNRECORDED[gave_them_the_dark]=true. The clean, protective end — but the player CARRIES
    what the dream showed (a personal weight, no mechanical reward for it). -> END
node route_harness  [TRADES/Reconstruction]
  speaker: PLR  camera: node_chamber  music:{pool:HORROR,cue:cold_low}
  line: "(You don't seal it. You TUNE it — turn the broadcast into a receiver. For as long
         as it runs, the dynasty can listen to the Amalgamation dream, and learn.)"
  effect: the node becomes a Reconstruction ASSET (periodic intel on the enemy) BUT the
    district keeps having (dampened) nightmares as the price, AND the machine's attention
    on the dynasty grows (heat up); recorded[harnessed_the_node]; UNRECORDED[you_kept_it_
    dreaming]=true; a Faustian intelligence source. -> END
node route_destroy
  speaker: benji  emotion: freed_shattered  camera: closeup
  line: "You KILLED it— the reception's— it's GONE— " (he weeps, himself for the first
         time in years) "—quiet. Real quiet. I forgot quiet. But it FELT that. It felt you
         do it. It knows your shape now."
  effect: the node is destroyed; dreams end HARD; the district sleeps; BUT the Amalgamation
    registers the attack (major heat — it now targets the dynasty); recorded[destroyed_the
    _node]; UNRECORDED[struck_the_dreaming]=true; a loud, freeing, dangerous blow. -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- SEAL: the district heals and sleeps; the enemy's reach here is quietly checked; an heir
  inherits a stable district and a dynasty member who saw the machine's dream and never
  quite forgot it.
- HARNESS: an intel asset persists (accelerates later Reconstruction) at the cost of
  ongoing dampened nightmares + rising enemy attention; an heir inherits a Faustian tool.
- DESTROY: minds freed loudly; the Amalgamation now HUNTS the dynasty (the proximity
  trigger fully sprung); an heir inherits a checked-here but alerted enemy.
- mindmap[proximity_wakes_it] + [dreams_into_minds] persist — the central threat-logic is
  now confirmed and mechanical: the closer to the truth, the more dangerous.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Benji's dream-addled eyes-track-nothing cracking to lucid_terrified is the human
  anchor; Seth's fraying faith; the DREAM's "face of faces" is a shifting composite portrait
  (many faces bleeding through one — the face-swap tech from Q022, weaponized for horror).
  Procedural lip-sync; the dream-voice is layered chorus.
BODY: waking scenes are staged (swaying, collapsing parishioners — the scheduler showing
  mass exhaustion); the dream-descent warps the body/space (a distortion pass). No standard
  combat — the threat is psychological; drawing a weapon in the dream does nothing (the
  enemy isn't a body).
CAMERA: two_shots in the temple, a DREAM_SPACE mode for the descent (warped framing, the
  face turning to you), closeup_on_the_face for the broadcast. Cuts on the hum's pulse.
MUSIC: TENSION-HORROR; the cyan-hum RISES with proximity (the mechanic made audible — it
  literally gets louder as you near the truth); a dream-distortion motif (melodies melting);
  HARD SILENCE at the seal (the absence is the relief). 120 BPM.

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the threat-logic)
===============================================================================
- Non-combat by nature (the enemy is a broadcast, not a body — you can't shoot a dream);
  fully pacifist. The "danger" is knowledge itself (proximity heat), not enemies.
- Rewards diverge (Megaton law): SEAL = a healed district + a personal weight; HARNESS =
  intel + ongoing cost + attention; DESTROY = freedom + a hunting enemy. No route is free —
  each trades the district's peace, the dynasty's safety, or its knowledge.
- Central threat-logic CONFIRMED as a MECHANIC: proximity to the secret raises danger
  (the hum, the heat). "Power is loud and safe, truth is quiet and lethal" — this quest
  makes that literal, and every later Reconstruction quest inherits the rising-heat rule.

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Introduces the DREAM_SPACE camera/distortion mode + the
proximity-heat mechanic (nearing the truth raises enemy attention — a reusable
Reconstruction rule) + the composite "face of faces" (face-swap tech as horror). Reads
ledger/standing/skill/knowledge/fold; writes same + node-state + a Reconstruction node +
enemy-heat. Deterministic + save-through. Gate: 2-clue gate opens the descent, all three
node routes resolve, proximity-heat rises correctly, dream_space renders, no-combat
enforced (weapon does nothing in the dream), soft death-clock respected. Joins the suite.

## 10. WHAT THIS PROVES (vs 001-023)
New engine: AMALGAMATION-THREAD HORROR built to frighten — a district-wide dream-affliction
resolved by a dream-descent to a leaking node, where PROXIMITY to the truth cranks the dread
(the central threat-logic made a mechanic). Introduces the dream_space mode, proximity-heat,
and the composite face-of-faces horror. Confirms the Amalgamation dreams INTO minds. Bible
at 24; the mystery now has a horror register and a literal "knowing is dangerous" rule.

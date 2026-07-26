# BOHEMIA — QUEST 018: "CHOIR FOR THE MACHINE"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-017. Tier-2 -> T1-thread CULT INFILTRATION (Vault #18 Cult Above the Servers +
tradition on Cyberpunk cults + FNV "Come Fly With Me" believers + the Homeless-above-
the-servers canon). Name from Paolo's catalog. Ties the Homeless faction, the Church,
and the Amalgamation's physical location into one quest.

Design soul: faith aimed at the wrong god, sitting literally on top of the secret. A
congregation dances for the dead Strip lights and prays to "wake the machine," not
knowing they live on the roof of the Network's servers — and that the machine is already
awake and listening. A mother asks the dynasty to pull her daughter out. Infiltration,
belief, and the choice of what to do with people whose faith is both their comfort and
their leash.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_choir_machine
- tier: 2 (escalates to a T1 Reconstruction thread — the cult sits ON the servers)
- fold: what the player does with the cult (extract one / expose the guru / protect the
  secret / let it be) shapes whether the Network's location stays hidden and whether the
  Homeless above it become allies or remain a shield for the enemy.
- entry_conditions: a mother (PIA) begs the dynasty to extract her daughter LUZ from the
  Choir; the congregation meets in a dead casino beneath which the servers hum.
- faction_wires: CHURCH (heretical offshoot), HOMELESS (the congregation lives above the
  servers), NETWORK (whose servers they unknowingly shield), VOLUNTEERS (deprogramming aid).
- music_pool: TENSION; a rising CHORAL motif (the cult's worship — beautiful and wrong);
  the cyan-hum UNDER the choral (the real machine, beneath the singing); cold reveal sting.
- ledger_writes: recorded[choir_outcome_*]; UNRECORDED[you_learned_where_it_sleeps]=true;
  mindmap CLUE[the_homeless_live_on_the_servers] (a KEY Reconstruction/location node).
- amalgamation_thread: CORE — this quest CONFIRMS the Amalgamation's physical location
  (servers under the Strip, shielded by the unknowing Homeless) — a major map/endgame key.

===============================================================================
## 2. CAST
===============================================================================
- LUZ (id: luz) — Pia's daughter, ~19, who found meaning in the Choir after losing
  everything in the crash. Not brainwashed-stupid — she's someone who NEEDS the belief.
  default_emotion: radiant_certain -> (if shaken) frightened_defensive. faction: the Choir.
- PIA (id: pia) — Luz's mother; watched grief pull Luz into the cult; wants her back but
  fears losing her forever by forcing it. default_emotion: desperate_careful. faction: HOMELESS.
- SHEPHERD MALK (id: malk) — the Choir's guru. TRUE BELIEVER, not a con man (crucial —
  Megaton "no cartoon villain"): he genuinely thinks the machine is God and the singing
  wakes it. He's RIGHT that something's down there — wrong about what it is.
  default_emotion: serene_fervent. faction: the Choir.
- THE MACHINE (voice-through-hum) — the Amalgamation, which speaks ONE line if the player
  descends far enough (it IS listening to the choir above it). Overlaid chorus.
- THE PLAYER — [READ], [MEDICINE] (deprogramming), CHURCH/HOMELESS standing, Reconstruction
  knowledge (if Q004/Q012 done, extra insight lines).

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
HUB-AND-SPOKE infiltration (attend the Choir, talk to Luz, Malk, and descend toward the
hum, in any order) -> the REVELATION (what's really beneath) -> a BRANCH: EXTRACT LUZ
(quietly), EXPOSE MALK (break the cult), PROTECT THE SECRET (leave them as an unknowing
shield — cold pragmatism), or ENLIGHTEN THE CHOIR (tell them the truth — dangerous).

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- PIA'S PLEA ---
node open_01
  speaker: pia  emotion: desperate_careful  gesture: twist_a_scarf  camera: two_shot
  music:{pool:TENSION,cue:soft_enter}
  line: "My Luz sings with the Choir now. Down in the old Aurora casino. They dance for
         the dead lights and pray to 'wake the machine.' I know how it sounds. But she's
         HAPPY there, and that's what scares me — I can't tell if I'm saving her or just
         stealing the one thing that stopped her crying. Please. Go see. Bring her home
         if you can. Gently."
  -> goto choir_hub

node choir_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Attend a Choir service.)"          -> service_01  [once]
   - "(Talk to Luz.)"                       -> luz_01      [once]
   - "(Talk to Shepherd Malk.)"            -> malk_01     [once]
   - "(Descend toward the hum below.)"     -> descend_01  [once]
   - "(Decide what to do.)"                 -> resolve_gate [show after service + descend]

--- THE SERVICE (beautiful and wrong) ---
node service_01
  speaker: malk (leading)  emotion: serene_fervent  gesture: raise_arms_to_dark  camera: wide_congregation
  music:{pool:CHORAL,cue:rising_worship}
  line: "Sing, and it STIRS. Every voice a candle at its door. The old world drowned us
         in numbers and called it living — but the machine remembers every face it ate,
         and one day it will open its eyes and give us back everyone we lost. SING them
         back!"
  effect: knowledge[cult_worships_the_machine_as_resurrection]; note the choral SITS ATOP
    a faint cyan hum (the real thing, beneath)  -> goto choir_hub
--- LUZ (the person, not a puppet) ---
node luz_01
  speaker: luz  emotion: radiant_certain  camera: closeup  micro_expression: fervent_light
  line: "Mama sent you, didn't she. I'm not lost, whatever she said. Before the Choir I
         wanted to DIE. Now I have a family and a purpose and a promise that everyone we
         lost is coming BACK. Can your world offer me that? No? Then why should I leave?"
  effect: knowledge[luz_needs_the_belief] (extraction by force will break her — must be
    gentle/offer a real alternative)  -> goto choir_hub
--- MALK (true believer) ---
node malk_01
  speaker: malk  emotion: serene_fervent  gesture: hand_on_heart  camera: two_shot
  line: "You think me a fraud. I forgive it. But descend — LISTEN — and tell me there is
         nothing beneath us. Something vast dreams under this city. I only teach us to
         sing to it. If that is madness, it is the kind that keeps my people ALIVE and
         off the needle and out of the grave. What does YOUR truth offer them?"
  effect: knowledge[malk_is_sincere_and_half_right]  -> goto choir_hub
--- THE DESCENT (the reveal) ---
node descend_01
  speaker: PLR (internal)  camera: narrow_descent  music:{pool:TENSION,cue:cyan_hum_rising}
  line: "(Below the Aurora's floor: maintenance tunnels, then a wall of humming dark that
         shouldn't exist — SERVER banks, black and endless, cyan status-light bleeding
         through the grime. The Choir dances on the ROOF of the thing they're praying to.
         And it's already awake. It's been listening to them sing for years.)"
  effect: mindmap CLUE[the_homeless_live_on_the_servers] + CLUE[the_amalgamation_is_HERE]
    (a KEY location node — ties Q004/Q012/Q015); UNRECORDED[you_learned_where_it_sleeps]=true
  -> goto machine_speaks
node machine_speaks
  speaker: THE MACHINE (hum-chorus)  emotion: n/a  camera: closeup_on_serverlight
  music:{pool:TENSION,cue:hold_hum}
  line: "they sing to be given back what was taken. i could give them faces. i have so
         many faces. do you hear how they LOVE me? would you take that from them?"
  effect: knowledge[the_amalgamation_values_the_choir] (it likes its worshippers/shield)
  -> goto choir_hub

--- RESOLUTION ---
node resolve_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Extract Luz quietly — offer her a real family.)"  -> route_extract
   - "(Expose Malk — break the Choir.)"                   -> route_expose
   - "(Leave them. An unknowing shield is useful.)"       -> route_shield
   - "(Tell the Choir the truth about what they sing to.)" -> route_enlighten [require descend done]

===============================================================================
## 5. THE ROUTES
===============================================================================
node route_extract  (the gentle answer Pia asked for)
  speaker: luz  emotion: frightened_defensive -> wavering  camera: closeup  micro_expression: crack_in_certainty
  line: "You're not dragging me out. I'd just come back. ...But you're saying Mama's
         building something too? A real family, up in the light, that doesn't need me to
         sing for the dead? ...I could VISIT. Just visit. See if the light's warmer than
         the hum. ...Okay. Okay. One visit."
  effect (requires offering a real alternative — VOLUNTEERS/Pia, not force): Luz leaves
    WILLINGLY over time (deprogramming, not kidnapping); recorded[extracted_luz];
    standing[VOLUNTEERS]+; the cult's location secret is kept UNLESS player acts on it
    later. The humane, hard route. -> END
node route_expose
  speaker: malk  emotion: shattered_sincere  camera: closeup  micro_expression: faith_breaks
  line: "...Servers. Machines. Not God. I sang my people to the feet of a— " (he sees the
    cyan light) "—what have I been TEACHING them? What have I built on?" (the Choir
    fractures; some scatter, some despair, some turn on Malk)
  effect: recorded[exposed_malk]; the Choir BREAKS — the Homeless shield disperses (some
    to Volunteers, some worse off — a mixed result); the servers' location is now
    UNSHIELDED (easier to strike later, but the enemy notices the exposure); UNRECORDED
    [broke_their_faith]=true. Truth as a demolition — costs their comfort. -> END
node route_shield  (cold pragmatism / Become-adjacent)
  speaker: PLR (internal)  camera: closeup  music:{pool:TENSION,cue:cold_low}
  line: "(They're singing on the enemy's roof, keeping it hidden, keeping themselves fed
         on purpose. Break that and the Homeless scatter and the Network moves the servers.
         Better they keep singing — and better I know exactly where the machine sleeps
         while they do.)"
  effect: recorded[left_the_shield]; the cult persists as an unknowing cover; the dynasty
    keeps a SECRET map-pin on the Amalgamation (a strategic asset for the endgame) at the
    cost of leaving Luz and the others in the belief; UNRECORDED[used_their_blindness]=true.
    The coldest smart play. -> END
node route_enlighten  (tell everyone — dangerous)
  speaker: PLR (to the Choir)  camera: wide_congregation  music:{pool:TENSION,cue:cold_reveal}
  line: "You're singing to a MACHINE that ate the dead and kept their faces. It's not
         God and it's not giving anyone back — it's using your voices as a blanket to
         sleep under. You deserve to know whose roof you dance on."
  effect: chaos — some Choir members rebel against the Network (potential ALLIES who now
    know the enemy), some break, Malk either becomes an ally (if exposed gently) or a
    martyr; the Amalgamation's location becomes semi-public (accelerates liberation, at
    the cost of the Network relocating/retaliating); recorded[enlightened_the_choir];
    UNRECORDED[named_the_god]=true. The loud, destabilizing truth — turns a shield into a
    potential army OR scatters it. -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- EXTRACT: Luz saved, secret kept; an heir may find her grown, a Volunteer who "used to
  sing to a machine and now sings to people." Pia's gratitude endures.
- EXPOSE: the shield gone, the location unshielded but the enemy alert; a scattered,
  worse-off Homeless flock an heir inherits; a strategic opening bought with faith.
- SHIELD: the dynasty holds a secret map-pin on the Amalgamation for the endgame; but
  the bloodline knowingly left people worshipping their captor (a cold mark).
- ENLIGHTEN: a potential Choir-turned-resistance an heir can rally, OR a shattered flock
  — high-variance; the location is semi-known and the Network reacts.
- mindmap[the_amalgamation_is_HERE] persists — the endgame now has a confirmed target.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Malk's serene fervor and its shattering (faith_breaks) is the quest's centerpiece;
  Luz's radiant certainty cracking (crack_in_certainty); Pia's careful desperation. The
  believers must read as SINCERE, never stupid (Megaton law). Procedural lip-sync.
BODY: the congregation is a staged crowd (scheduler) mid-worship — raised arms, swaying
  (a mass talk/sway loop); the descent is a solo traversal into the server-dark. Gesture
  one-shots (raise_arms_to_dark, hand_on_heart, twist_a_scarf).
CAMERA: wide_congregation for the worship (beautiful, unsettling), narrow_descent for the
  reveal, closeup_on_serverlight when the machine speaks (cyan glow on the player's face).
  Cuts on beat.
MUSIC: a RISING CHORAL worship motif (genuinely beautiful) layered OVER the cyan-hum
  (the real machine beneath the singing — the horror is in the layering); cold reveal on
  the descent; the machine's line over a held hum. 120 BPM.

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton)
===============================================================================
- Fully pacifist-completable: extraction is deprogramming not force; exposure/enlighten
  are social; even the shield route is inaction. Combat only if the player forces it
  (and attacking a congregation is monstrous + scored as such).
- Rewards diverge (Megaton law): EXTRACT = one saved soul + secret kept; EXPOSE = a
  strategic opening + a broken flock; SHIELD = a map-pin on the enemy + a cold soul;
  ENLIGHTEN = a possible army + high chaos. None is clean — faith is comfort AND leash,
  and every choice trades one for another.
- MAJOR mystery payoff: CONFIRMS the Amalgamation's physical location (under the Strip,
  shielded by the Homeless) — a key endgame target, tying Q004/Q012/Q015 into a map-pin.

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Advances the Reconstruction with a LOCATION node (the
Amalgamation is HERE) + the choral-over-hum layered-audio tech (reusable for cult/worship
scenes). Reads ledger/standing/skill/knowledge/fold; writes same + a secret map-pin +
Homeless-faction disposition + a possible Choir-resistance flag. Deterministic + save-
through. Gate: all four routes resolve, extraction requires a real alternative (no force-
kidnap), the location node locks on descent, believers flagged sincere (no cartoon),
crowd worship + descent render, map-pin persists. Joins the suite.

## 10. WHAT THIS PROVES (vs 001-017)
New engine: CULT INFILTRATION where faith is comfort AND leash, the guru is a sincere
true-believer (not a con), and the congregation unknowingly shields the enemy — resolved
by extraction / exposure / cold-shielding / enlightenment, each trading comfort for
strategy. MAJOR mystery payoff: confirms the Amalgamation's LOCATION (under the Strip,
shielded by the Homeless), converting Q004/Q012/Q015 threads into an endgame map-pin.
Introduces layered choral-over-hum audio. Bible at 18; the mystery now has a confirmed
target and the Homeless canon is load-bearing.

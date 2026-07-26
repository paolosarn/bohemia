# BOHEMIA — QUEST 020: "LIGHTS, CAMERA, APOCALYPSE"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-019. Tier-3 RELEASE-VALVE / absurd (Vault #16 Zombie Video + tradition VI Yakuza
whiplash + the in-world MUSIC-promotion hook). Third release-valve (005 tragedy-under-
comedy, 011 warm comedy, now 020 pure absurd-action-comedy). Name = a catalog-adjacent
working title. Surfaces Paolo's MUSIC as literal in-world content (the whole quest is
a music video shoot).

Design soul: the biggest, dumbest, most FUN quest in the bible — a deliberate palate-
cleanser that also happens to promote the game's music in-world. A washed-up performer
is shooting a fake "infected attack" music video in a dead district and needs a
bodyguard as REAL scavengers close in. The comedy is the gap between the fake apocalypse
being filmed and the real one intruding. Pure joy, a summon/relic reward, zero dread.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_lights_camera
- tier: 3 (unmarked; triggered by stumbling onto the shoot in a dead district)
- fold: tiny — if the video gets made, it becomes in-world FAMOUS; an heir can find the
  track playing in bars/radios across Vegas (Paolo's music, canonized in the world).
- entry_conditions: player enters the dead NEON-GRAVEYARD district and finds a chaotic
  film shoot mid-take.
- faction_wires: COLORFUL (the performer's crew), TRADES (equipment), scavengers
  (freelance threat), the MUSIC catalog (the track being filmed).
- music_pool: the actual TRACK being shot (a real catalog song, diegetic — it plays as
  they film); PLAYFUL between takes; COMBAT (comedic) when scavengers hit; TRIUMPH on
  the premiere.
- ledger_writes: recorded[made_the_video]; UNRECORDED[the_plaza_had_fun]=true (positive).
- amalgamation_thread: NONE. The anti-dread quest. The absence is the medicine.

===============================================================================
## 2. CAST
===============================================================================
- DEXX VALENTINE (id: dexx) — a washed-up pre-crash pop star clinging to relevance,
  shooting a comeback music video for a track ("the infected banger") with a skeleton
  crew and more ego than budget. Loud, vain, secretly terrified he's a nobody now.
  default_emotion: theatrical_bravado -> (real fear when scavengers hit) -> genuine_heart.
  faction: COLORFUL.
- BUExtras (id: extras) — locals hired to play "the infected" in cheap makeup; they
  can't tell the player which staggering figures are actors and which are real threats
  (the core gag + tension). default_emotion: hammy.
- PRAX (id: prax) — Dexx's long-suffering director/camera-op who just wants ONE clean
  take. default_emotion: exhausted_deadpan. faction: COLORFUL.
- REAL SCAVENGERS (id: scavs) — freelancers who see a shoot full of gear and move in;
  the genuine threat amid the fake one. default_emotion: opportunistic.
- THE PLAYER — bodyguard, and (optionally) accidental co-star; skills shape the shoot.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
LINEAR ESCALATING SET-PIECE (get hired -> the shoot -> real scavengers intrude amid fake
zombies -> the climax take) with comedic FORKS (protect the shoot / protect the people /
join the performance) and a terminal fork on the video's fate. Fast, funny, low-stakes.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE SHOOT ---
node open_01
  speaker: dexx  emotion: theatrical_bravado  gesture: fling_scarf  camera: two_shot
  music:{pool:DIEGETIC_TRACK,cue:playback_start}
  line: "YOU. Yes, you, with the capable shoulders and the tragic backstory I can SEE in
         your eyes. Dexx Valentine. You've heard of me. Don't lie, it's undignified for
         us both. I'm shooting my comeback and my 'infected' keep wandering off to loot.
         Guard my vision for one afternoon and I'll make you a STAR. Or at least pay you."
  choices (PLR):
   - "What do you need guarded?"       -> spoke_gig
   - "Aren't real scavengers a risk out here?" -> spoke_risk
   - "(Sure. I'm in.)"                 -> shoot_begins
node spoke_gig
  speaker: prax  emotion: exhausted_deadpan  gesture: rub_eyes  camera: closeup
  line: "The gear, mostly. And Dexx's ego, which weighs more. We film the big attack
         scene at golden hour, the extras swarm him, he 'fights them off' while singing.
         Keep the actual murderers out of frame and I'll get my ONE. CLEAN. TAKE."
  -> goto shoot_ready
node spoke_risk
  speaker: dexx  emotion: waving_it_off  camera: closeup  micro_expression: flicker_of_fear
  line: "Risk is the ARTIST'S natural habitat! (quieter) ...also I couldn't afford a
         safe district. Look, just — if something staggers at me and it ISN'T acting,
         you'll know. Probably. Points if you keep it off-camera." -> goto shoot_ready
node shoot_ready (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Roll the shoot.)"        -> shoot_begins
   - "(Set a perimeter first.)" -> shoot_perimeter [READ — reduces later chaos]
node shoot_perimeter  [READ]
  effect: a smart setup (mark exits, brief the extras with a signal) — makes the
    scavenger intrusion easier to manage; recorded[set_perimeter]  -> goto shoot_begins

--- THE TAKE + THE INTRUSION (the core gag) ---
node shoot_begins
  speaker: dexx (performing)  emotion: full_diva  gesture: dramatic_singing  camera: film_frame
  music:{pool:DIEGETIC_TRACK,cue:verse}
  line: "(singing the catalog track as extras stagger in) — this is GOLD, Prax, tell me
         you're getting this, tell me the light's hitting my good side—"
  -> goto intrusion
node intrusion
  speaker: prax  emotion: alarm_breaking_deadpan  gesture: point_offframe  camera: wide_chaos
  music:{pool:COMBAT,cue:comedic_swap}
  line: "Dexx. DEXX. The three by the van. Those aren't ours. Those are REACHING wrong."
  (real scavengers move in among the costumed extras)
  -> goto chaos_fork
node chaos_fork (speaker: PLR)  camera: wide_chaos
  choices:
   - "(Fight off the scavengers — keep them off-camera.)"  -> route_guard
   - "(Get the extras and crew to safety — forget the shot.)" -> route_people
   - "(Fight them IN character — make it part of the video.)" -> route_star
node route_guard
  speaker: dexx  emotion: exhilarated  camera: film_frame  music:{pool:COMBAT,cue:heroic_comedic}
  line: "KEEP SINGING, keep the CAMERA on me, my bodyguard's got the — is that BLOOD? Is
         that real blood?! KEEP ROLLING!"
  effect: Dead Eye / nonlethal on the scavengers while the shoot continues; the take
    survives; recorded[guarded_the_shoot]  -> goto climax
node route_people
  speaker: prax  emotion: grateful_relief  camera: two_shot
  line: "...You got everyone out. The shot's blown. Dexx'll cry about it for a week. But
         nobody died for a music video. That's the right call. Thank you."
  effect: recorded[saved_the_crew]; no video (or a scrappy salvaged version); the RIGHT
    call over the cool one; standing[COLORFUL]+ (they remember you chose them). -> goto dexx_heart
node route_star
  speaker: dexx  emotion: pure_joy  camera: film_frame  music:{pool:DIEGETIC_TRACK,cue:drop}
  line: "YES! IMPROVISE! You and me, back to back, the REALEST fake apocalypse ever
         filmed! Prax are you SEEING this cinema?!"
  effect: a performance/combat hybrid beat (fight to the rhythm of the track — surfaces
    the music as gameplay); the video becomes accidentally LEGENDARY (real danger on
    film); recorded[became_a_costar]; UNRECORDED[the_plaza_had_fun]=true  -> goto climax

--- CLIMAX / THE TAKE ---
node climax
  speaker: dexx  emotion: triumphant_spent  gesture: collapse_dramatically  camera: film_frame
  music:{pool:DIEGETIC_TRACK,cue:final_chorus}
  line: "...and CUT. Cut. Prax. Prax, did we— did we get it?"
  -> goto dexx_heart
node dexx_heart  (the small real moment under the ego — Yakuza whiplash, but LIGHT)
  speaker: dexx  emotion: genuine_heart  camera: closeup  micro_expression: mask_drops
  line: "(quiet, for once) Before the crash I sold out arenas. Now I shoot in a graveyard
         with borrowed gear and hired ghosts. But out there just now, with the cameras
         rolling and the world ending for real and fake at the same time — I felt like
         DEXX VALENTINE again. Thank you. Truly. ...Okay, moment's over, I'm insufferable
         again. Let's talk about your PAYMENT and your obvious star quality."
  -> goto resolve_gate
node resolve_gate (speaker: PLR)  camera: two_shot
  choices:
   - "(Help him finish + release the video.)"  -> end_premiere
   - "(Take your pay, wish him luck.)"          -> end_paid
node end_premiere
  speaker: dexx  emotion: hopeful  camera: two_shot  music:{pool:TRIUMPH,cue:premiere}
  line: "It's going out to every working screen in Vegas. If even one person dances
         instead of despairs tonight — that's the whole point, isn't it? That's what the
         music's FOR."
  effect: the video RELEASES; the track becomes in-world famous (plays in bars/radio
    across the map — Paolo's music CANONIZED in the world); Dexx a recurring ally;
    recorded[released_the_video]; UNRECORDED[gave_vegas_a_song]=true. -> END
node end_paid
  speaker: dexx  emotion: warm  camera: closeup
  line: "Cash, then. Fair. But you'll hear the track around — and you'll know you kept
         the whole ridiculous dream breathing. Off you go, star. Try not to miss me."
  effect: recorded[got_paid]; the track still circulates (smaller); Dexx fond of the
    dynasty. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- PREMIERE: the track is a Vegas hit — an heir hears it in bars and on scavenged radios
  generations later (Paolo's music living IN the world's fiction); Dexx becomes a beloved
  recurring figure / a morale asset for the district.
- SAVED CREW (no video): the COLORFUL district remembers the dynasty chose people over
  spectacle — a warmth banked; Dexx humbled, maybe wiser.
- COSTAR: the "realest fake apocalypse" becomes a cult legend; the dynasty is (absurdly)
  a minor celebrity — a fun reputation thread.
- The positive UNRECORDED flags (had_fun / gave_vegas_a_song) are rare bright marks that
  lift the world's mood — proof the dynasty made joy, not just survived.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Dexx is a comedy engine — theatrical_bravado with flicker_of_fear leaking through,
  and the mask_drops beat (the real, scared, hopeful man under the diva). Prax's
  exhausted deadpan is the straight-man foil. The GAG face: extras hamming "infected"
  next to real scavengers "reaching wrong" — the player reads the difference. Procedural
  lip-sync (Dexx sings the track — full musical lip-sync showcase).
BODY: Dexx performs (dramatic_singing, collapse_dramatically); the shoot is a staged
  crowd of extras (scheduler) mixed with real threats; the COSTAR route syncs combat to
  the track's rhythm (music-as-gameplay). Comedic, energetic.
CAMERA: uses a FILM-FRAME camera mode (the in-world camera's framing — a fun meta layer:
  the player sees "the shot" Dexx wants) intercut with wide_chaos for the real danger.
  Cuts ON THE MUSIC (the track drives the edit). The premiere is a montage.
MUSIC: the actual catalog TRACK plays DIEGETICALLY (the quest is built around a real
  song — the purest in-world music surfacing); PLAYFUL between takes, comedic COMBAT on
  the intrusion, TRIUMPH at premiere. The song IS the quest. 120 BPM (the track's grid).

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE
===============================================================================
- Pacifist-capable: scavengers can be scared/driven off/nonlethally handled; the
  "people" route avoids all combat. Lethal is available (comedic) but never required.
- Rewards diverge (Megaton law, joyful register): PREMIERE = a canonized song + a
  celebrity ally + a world-mood lift; PEOPLE = COLORFUL warmth + the moral high ground;
  COSTAR = a cult-legend rep. The reward is JOY and a song in the world — the bible's
  proof that not every reward is grim.
- Deliberate release-valve (Yakuza law): the biggest, most FUN quest, placed to cleanse
  the palate after the March (019) and the sacrifice (009) — and it does double duty
  promoting the music in-world (the game's stated purpose: a vehicle for Paolo's music).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Introduces the FILM-FRAME camera mode (in-world camera
framing) + diegetic-track playback (a real MUS catalog song as the scene's spine, edit
synced to its 120 grid) + the "real-vs-fake threat" reading gag (extras vs scavengers).
Reads ledger/standing/skill/fold; writes same + a canonized-track world flag (plays
across the map) + a recurring ally (Dexx). Deterministic + save-through. Gate: all chaos-
fork + terminal routes resolve, diegetic track plays + drives the edit, film-frame mode
renders, canonized-track flag propagates to world audio, pacifist path clears. Joins suite.

## 9. WHAT THIS PROVES (vs 001-019)
Third release-valve (now pure absurd-action-comedy, distinct from 005's tragedy and 011's
warmth) + the game's MUSIC surfaced as literal in-world content: the whole quest is a
music-video shoot built around a real catalog track, with a film-frame camera mode and a
canonized-song reward that plays across Vegas for generations (fulfilling Bohemia's stated
purpose as a vehicle for Paolo's music). Establishes diegetic-track + film-frame tech.
Bible at 20; the tonal range is fully proven — the game can gut you (009/019), ache
quietly (001/013/017), and throw the dumbest, most joyful party in the ruins (020).

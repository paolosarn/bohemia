# BOHEMIA — QUEST 011: "THE MAN WHO HOLDS STILL"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-010. Tier-3 unmarked RELEASE-VALVE (Vault #19 The Statue / Yakuza street-
performer substory). Second release-valve in the bible (after 005) — proves the tone
engine repeats without repeating itself. Surfaces Paolo's MUSIC as an in-world verb.

Design soul: pure light. The city hands you an absurd little favor with a warm heart
and no dread underneath — the exhale between the heavy quests. A street performer
frozen as a living statue needs the dynasty to buy him a few minutes. The "combat" is
a performance minigame; the reward is a friendship and a laugh. Not every quest is a
wound (Yakuza: the game must breathe).

===============================================================================
## 1. HEADER
===============================================================================
- id: q_holds_still
- tier: 3 (unmarked; triggered by pausing near VITO in a market plaza)
- fold: tiny — if befriended, VITO becomes a recurring plaza fixture an heir can find
  still performing (or teaching a younger performer his act).
- entry_conditions: player pauses within 2 tiles of VITO in the COLORFUL market plaza.
- faction_wires: COLORFUL (the artists' district), TRADES (the loan shark), VOLUNTEERS.
- music_pool: a light PLAYFUL loop; the PERFORMANCE minigame pulls from Paolo's catalog
  (the player literally makes music/noise to draw a crowd); warm resolve on success.
- ledger_writes: recorded[helped_vito]; UNRECORDED[the_plaza_laughed]=true (a rare
  POSITIVE unrecorded flag — small joys count too).
- amalgamation_thread: NONE. Deliberately weightless. The contrast is the function.

===============================================================================
## 2. CAST
===============================================================================
- VITO (id: vito) — a street performer whose whole act is holding perfectly still as a
  "living statue," painted silver, on a crate. Sharp, funny, dead broke, proud of his
  craft. Can't break character in front of a crowd without losing the tips. baked rig:
  skin #2 + silver body-paint overlay. default_emotion: deadpan (frozen) -> lively
  (when unobserved). faction: COLORFUL.
- BRIX (id: brix) — a low-rent loan shark's runner come to collect from Vito, mid-act.
  Not a real threat, more nuisance than menace. default_emotion: bored_pushy. faction: TRADES.
- THE PLAYER — [BARTER] (pay the debt down), performance skill, standing shape options.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
LINEAR-with-a-FORK. The setup (Vito whispers a favor without moving his lips) -> the
PROBLEM (Brix arrives) -> a small FORK: DISTRACT (perform to pull the crowd/Brix away —
the minigame), PAY (clear his debt), SCARE-OFF (intimidate Brix), or EXPOSE (out Vito's
gimmick — the jerk option). Warm by default.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE FROZEN FAVOR ---
node open_01
  speaker: vito  emotion: deadpan_frozen  gesture: hold_statue_pose  camera: two_shot
  music:{pool:PLAYFUL,cue:light_enter}  micro_expression: eyes_only_flick_to_you
  line: "(barely moving his lips, ventriloquist-still) Don't react. Big tip crowd,
         don't spook 'em. Listen — silver fella needs a favor. There's a guy coming to
         break my legs over forty caps and I cannot run, I am a STATUE, it's my whole
         brand. Help a frozen man out?"
  -> goto favor_hub

node favor_hub (speaker: PLR)  camera: over_shoulder_player  (player must also not "react" — a fun framing)
  choices:
   - "(Whisper back) What do you need?"       -> spoke_need
   - "Why not just... move?"                   -> spoke_move
   - "(Wait — here comes trouble.)"            -> brix_enter [auto after >=1 spoke]
node spoke_need
  speaker: vito  emotion: deadpan_frozen  camera: closeup  micro_expression: tiny_grin
  line: "Buy me five minutes. Draw the crowd, draw HIM, anything — just don't let him
         see me flinch. A statue that flinches is a MIME, and I have STANDARDS."
  -> goto favor_hub
node spoke_move
  speaker: vito  emotion: mock_offended  camera: closeup
  line: "MOVE? Fifteen years I've perfected absolute stillness and you want me to
         hop off the crate like an amateur? I'd rather take the beating. ...I mean.
         Slightly rather. Please help."
  -> goto favor_hub

--- THE PROBLEM ARRIVES ---
node brix_enter
  speaker: brix  emotion: bored_pushy  gesture: poke_the_statue  camera: two_shot  music:{pool:PLAYFUL,cue:tension_wink}
  line: "Everybody says the silver guy hangs here. Forty caps, statue-man, I know
         you can hear me. Boss says I collect in caps or in kneecaps. ...You. You know
         this clown?"
  -> goto fork_gate

node fork_gate (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Perform — pull the crowd and Brix's attention away.)"  -> route_perform
   - "[BARTER] (Pay Vito's debt down.)"  [require currency>=cost] -> route_pay
   - "(Lean on Brix to walk away.)"      [INTIMIDATE or standing] -> route_scare
   - "(Nah. Point at the statue. 'He's your guy.')"           -> route_expose

===============================================================================
## 5. THE ROUTES
===============================================================================
node route_perform  (the MINIGAME — surfaces Paolo's music)
  speaker: PLR  camera: wide_plaza  music:{pool:PLAYFUL,cue:performance_track}
  beats: a short PERFORMANCE minigame — busk, sing, drum, or heckle-comedy (pulls a
    track from Paolo's catalog; timing/rhythm on the 120 grid). Success draws the plaza
    crowd (and Brix's attention) away from Vito long enough for him to "unfreeze" and
    vanish. Partial success = smaller crowd, tenser escape. It is genuinely FUN, no stakes.
  effect: recorded[performed_for_vito]; UNRECORDED[the_plaza_laughed]=true; Vito
    befriended (recurring plaza fixture); a small tip/relic reward; standing[COLORFUL]+.
  -> goto vito_thanks
node route_pay  [BARTER]
  speaker: brix  emotion: shrug_satisfied  camera: two_shot
  line: "Caps spend the same from anybody. Statue-man, your friend's got taste.
         We're square. ...You're still not gonna move, are you. Weird."
  effect: currency-=cost; recorded[paid_vitos_debt]; Vito befriended + indebted to you
    (a favor to call later). -> goto vito_thanks
node route_scare  [INTIMIDATE/standing]
  speaker: brix  emotion: reconsidering  camera: closeup  micro_expression: gulp
  line: "...Y'know what, forty caps ain't worth whatever YOU are. Statue's not going
         anywhere. I'll tell the boss he moved districts." (leaves)
  effect: recorded[scared_off_brix]; Vito safe but the debt lingers (Brix's boss may
    send someone worse later — a tiny seed). Vito befriended, wary-grateful. -> goto vito_thanks
node route_expose  (the jerk option — the game lets you be small)
  speaker: vito  emotion: betrayed_deadpan_breaking  camera: closeup  micro_expression: mask_cracks
  line: "...Wow. WOW. Fifteen years of stillness and a stranger rats me out for
         nothing. Enjoy the plaza, you absolute— " (he takes the beating; limps off)
  effect: recorded[sold_out_vito]; UNRECORDED[the_plaza_saw_you_do_it]=true; standing
    [COLORFUL]-; Vito is gone from the plaza (an heir won't find him) — a small meanness
    that costs a small warmth (Megaton: even petty cruelty has a price). -> END
node vito_thanks
  speaker: vito  emotion: delighted_alive  gesture: hop_off_crate  camera: two_shot  music:{pool:PLAYFUL,cue:warm_resolve}
  line: "You beautiful maniac, it WORKED. C'mere — no, I'm not hugging you, I'm silver,
         you'll get painted. Look, you ever need a crowd drawn, a distraction, a guy
         who can stand REALLY still — Vito's your man. Come by. I'll teach you the pose."
  effect: Vito becomes a recurring ally/plaza fixture (small favors: crowd-draws,
    distractions, lookout); the bible's proof that a reward can just be a FRIEND.  -> END

===============================================================================
## 6. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- HELPED (any warm route): Vito stays a plaza fixture; a later gen may find him older,
  teaching a kid his act — "the silver fella taught me stillness" — the craft outlived
  him (the same soft-inheritance beat as Orrin/Q005, but purely happy).
- PAID: Vito owes the dynasty a favor an heir can inherit and call in.
- SCARED: the debt seed may bloom into a tiny later nuisance quest (a hook, not a wound).
- EXPOSED: Vito's gone; the plaza's a little colder; an NPC remembers "somebody ratted
  out the statue guy once." A small, earned, permanent pettiness on the record.

===============================================================================
## 7. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the whole JOKE is facial control — Vito's deadpan_frozen with micro-expressions
  leaking through (eyes_only_flick, tiny_grin, mask_cracks). The comedy is him NOT
  moving his face while clearly alive behind it. Procedural lip-sync deliberately
  MINIMAL on his frozen lines (ventriloquist stillness) then full when he unfreezes.
BODY: hold_statue_pose is a locked idle (no heartbeat sway — the ONE time an actor
  deliberately doesn't breathe-loop, which is the gag); hop_off_crate is the release.
  Brix's poke_the_statue. The performance minigame uses full player animation.
CAMERA: two_shots for the plaza comedy, closeups for Vito's leaking micro-expressions,
  wide_plaza for the performance. Cuts on the beat (comedy timing).
MUSIC: a light PLAYFUL loop; the PERFORMANCE minigame pulls a real catalog track (the
  in-world music verb); warm_resolve on success. No dread, no cyan hum — the absence of
  the Amalgamation motif is itself the exhale. 120 BPM.

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE
===============================================================================
- Zero required combat (scare is a check, not a fight; if the player attacks Brix,
  Dead Eye applies but it's overkill for a forty-cap runner and sours the plaza).
- Rewards diverge gently (Megaton law, low stakes): PERFORM = a friend + a laugh + a
  positive unrecorded flag; PAY = a friend who owes you; SCARE = safety + a tiny debt
  seed; EXPOSE = petty cruelty + a colder plaza. The point is TONE, not stakes.
- This is a deliberate release-valve (Yakuza law): after pillars and sacrifices, the
  bible needs quests whose whole job is to make the player smile — so the heavy ones land.

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Notable: exercises the PERFORMANCE minigame hook (pulls a
MUS catalog track, rhythm on 120 grid) and the "locked no-breathe idle" (the statue
gag — an actor that deliberately suppresses the heartbeat sway loop). Reads ledger/
standing/skill/currency/fold; writes same + a recurring-ally flag. Deterministic +
save-through. Gate: all four routes resolve, performance success/partial both handled,
the locked-idle renders without the sway loop, recurring-ally persists. Joins suite.

## 10. WHAT THIS PROVES (vs 001-010)
Proves the RELEASE-VALVE engine REPEATS with fresh material (a second one, tonally
distinct from 005's tragedy-under-comedy — this one is comedy that STAYS warm), that a
reward can simply be a FRIEND, that the PERFORMANCE minigame surfaces Paolo's music as
an in-world verb, and that the engine supports a deliberately weightless quest (no
Amalgamation thread) as the necessary exhale between heavy beats. Bible at 11; the
tone-range is now proven to breathe both ways.

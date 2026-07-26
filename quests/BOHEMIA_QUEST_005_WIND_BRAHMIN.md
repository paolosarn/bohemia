# BOHEMIA — QUEST 005: "THE CAP COLLECTOR"
Full production build (whole enchilada). Built to the dialogue/scene spec; template
= 001-004. Tier-3 unmarked STREET-AMBUSH (Vault Batch 01 #8 + tradition VI Yakuza
whiplash). The bible's first RELEASE-VALVE quest: absurd-into-tender, so the dread
quests land twice as hard by contrast. Also a stealth Amalgamation micro-seed.

Design soul: the city grabs you mid-crossing with something that plays as a joke and
turns, quietly, into a gut-punch. Comedy buys the grief (Yakuza law). A broken
NeuroLinked vagrant tries to sell you invisible livestock for every cap you own —
and under the bit is a person the implant hollowed out, still performing a life he
lost. No villain. No timer. Restraint.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_cap_collector
- tier: 3 (unmarked; triggered by walking past ORRIN at a district edge)
- fold: tiny persistence — if handled with care, ORRIN's stall becomes a recurring
  landmark; an heir may find it tended by someone else (the kindness outlived him).
- entry_conditions: player crosses the OUTER-WEST wash edge within R=26 of ORRIN.
- faction_wires: HOMELESS (Orrin is unhoused); VOLUNTEERS (the aid route); NETWORK
  (his implant is theirs — the micro-seed).
- music_pool: a jaunty off-kilter TENSION-light loop (comedy) that DUCKS to a single
  warm tone the moment the bit cracks (the whiplash, scored).
- ledger_writes: recorded[met_orrin]; UNRECORDED[saw_the_person_under_it]=true if the
  player stays past the joke.
- amalgamation_thread: MICRO — one optional clue: his "herd" are the faces he can't
  stop counting (fragments-carry-faces, ties to Quest 004's mindmap node).

===============================================================================
## 2. CAST
===============================================================================
- ORRIN (id: orrin) — an unhoused man, NeuroLinked years ago by the Network (he
  doesn't know), which left him compulsively "counting a herd" only he can see. Was
  a livestock auctioneer on a Sloan-quarry cattle lot before the crash. Warm,
  fast-talking, performing an auction that ended a decade ago. baked rig: skin #5,
  rag outfit #3. default_emotion: manic_showman -> (cracks to) lost_gentle.
- THE PLAYER — upbringing gates [MEDICINE] (see the implant), [BARTER] (play along),
  [TRADES] (recognize the NeuroLink hardware).

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
LINEAR-with-CHECKS opening (the bit) into a small HUB (how you treat him) into a
BRANCH resolution (humor / help / expose the implant / walk). No combat. The whole
quest is a tone machine: comedy, then the floor drops.

===============================================================================
## 4. THE NODE TREE
===============================================================================
--- THE AMBUSH (he flags you down mid-walk) ---
node open_01
  speaker: orrin  emotion: manic_showman  gesture: sweep_arm_at_nothing  camera: two_shot
  music:{pool:COMEDY,cue:jaunty_enter}
  line: "YOU there — good eye, GOOD eye! Finest herd west of the quarry, look at 'em
         mill! Now I can't let the whole lot go, but for a serious buyer — how many
         caps you carrying? All of 'em? Perfect, that's the deposit!"
  -> goto bit_hub

node bit_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "There's... nothing there, man."          -> bit_deny
   - "How much for the whole herd? (play along)" -> bit_play   [BARTER optional]
   - "[TRADES] That's a NeuroLink relay on your neck." -> tech_see [require skill.trades>=2]
   - "[MEDICINE] When did the headaches start?" -> med_see [require skill.medicine>=2]
   - "(Just watch him a minute.)"               -> watch_him  (restraint)

--- THE BIT (comedy) ---
node bit_play
  speaker: orrin  emotion: delighted  gesture: mock_handshake  camera: closeup  music:{pool:COMEDY,cue:up}
  line: "A BUYER! Finally, a man of vision! Careful of the big one, she bites — no
         no, THAT one, the — well, you can't see her angle from there. Trust me,
         prize heifer, best on the lot!"
  -> goto crack_gate
node bit_deny
  speaker: orrin  emotion: flustered_then_faster  camera: closeup  micro_expression: eye_dart
  line: "Nothing— nothing THERE? Son, the lot's FULL, you're standing in the pen! I
         count 'em every hour, all forty head, I never miss a — I never — " [falters]
  -> goto crack_gate

--- THE CRACK (the whiplash — music ducks, comedy stops) ---
node crack_gate
  speaker: orrin  emotion: lost_gentle  gesture: hands_drop  camera: closeup
  music:{pool:COMEDY,cue:duck_to_one_warm_tone}  micro_expression: eyes_lose_focus
  line: "...I have to count 'em. If I stop counting I lose the count and if I lose
         the count I lose— I don't know what I lose. I just know I can't stop. Been
         counting since the lights went out. There used to be real ones. I think.
         There used to be a real everything."
  effect: UNRECORDED[saw_the_person_under_it]=true  -> goto care_hub

--- HOW YOU TREAT HIM (the hub) ---
node care_hub (speaker: PLR)  camera: two_shot
  choices:
   - "Then I'll help you count. (sit with him)"        -> count_with
   - "There are people who can quiet the counting."     -> help_route
   - "[TRADES/MEDICINE] I can pull the relay." [require tech_see OR med_see] -> pull_route
   - "(Buy the 'herd' for real. Give him the caps.)"    -> buy_route
   - "(Leave him to it.)"                                -> END_leave

===============================================================================
## 5. RESOLUTIONS
===============================================================================
node count_with  (the tender restraint answer — costs nothing but time)
  speaker: orrin  emotion: steadied  camera: closeup  micro_expression: small_settle
  line: "...Thirty-eight. Thirty-nine. Forty. All present. ...Nobody counts WITH me.
         Feels less like drowning. Come back sometime? I'll hold a good one for you."
  effect: recorded[counted_with_orrin]; his stall becomes a warm recurring stop;
    NO cure, but dignity — the Howard beat.  -> END
node help_route
  speaker: orrin  emotion: fragile_trust  camera: two_shot  music:{pool:COMEDY,cue:warm_low}
  line: "Quiet it? I— I don't know who I am without the herd. But I'm so tired.
         ...Okay. Walk me there. Don't let me turn back."
  effect: escort to VOLUNTEERS (Dr. Sama, ties to Q003); standing[VOLUNTEERS]+=2;
    Orrin enters slow care — over the fold he MAY recover (or not). ledger[helped_orrin]
  -> END
node pull_route  [requires seeing the relay]
  speaker: PLR + orrin
  camera: closeup  music:{pool:TENSION,cue:hold}
  beats: pulling the NeuroLink relay is a REAL risk — [MEDICINE]/[TRADES] check.
    SUCCESS: the counting stops; Orrin weeps, remembers his name (Orrin Vale), and
    the auction with it — grief floods in where the compulsion was. FAIL: he seizes;
    the player must get him to Volunteers fast (no death, but a scare).
  effect (success): mindmap CLUE[network_implants_hollow_the_unhoused]=true (ties Q004
    + the sewer-demo canon); UNRECORDED[freed_orrins_mind]=true; a hard, real mercy.
  -> END
node buy_route
  speaker: orrin  emotion: overwhelmed_joy  camera: closeup
  line: "SOLD! Sold to the man of vision! Oh, she's a beauty, you take good care of
         her now — " (he hands you nothing, beaming; you gave him everything)
  effect: currency -= all-carried; recorded[bought_the_herd]; Orrin eats for weeks;
    the absurd-tender ending — you bought air and it was the kindest trade you made.
  -> END

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the whole quest is a facial hinge — manic_showman (eyes bright, too wide)
  cracking to lost_gentle (eyes lose focus). Micro-expressions do the whiplash:
  eye_dart (caught), eyes_lose_focus (the crack), small_settle (counted with). The
  PORTRAIT sells the tragedy under the clown. Procedural lip-sync (fast/manic vs slow).
BODY: talk-idle with big auctioneer gestures (sweep_arm_at_nothing, mock_handshake)
  that DIE when the bit cracks (hands_drop) — the body language IS the turn. No combat.
CAMERA: two_shot for the bit's energy, closeup for the crack and every tender beat.
  The crack cut lands on the down-beat (scored whiplash).
MUSIC: a jaunty COMEDY loop that DUCKS TO ONE WARM TONE on crack_gate — the single
  most important cue in the quest, the exact moment the joke becomes a person. 120 BPM.

===============================================================================
## 7. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- COUNTED/BUY: Orrin lives out his days performing; his stall becomes a small warm
  landmark. An heir may find it kept by someone else — "old auctioneer taught me the
  count before he passed" — the kindness outlived the man (soft fold echo).
- HELPED/PULLED: Orrin may recover across the fold (Volunteers) or, if pulled,
  carries his real grief and his real NAME; either way the mindmap gains
  network_implants_hollow_the_unhoused — a Reconstruction clue (ties Q004 + sewer demo).
- LEFT: he's gone by the next gen; a passerby line: "used to be a fella counted cows
  that weren't there. Wonder what he was really counting."

===============================================================================
## 8. ROUTES + REWARD DIVERGENCE
===============================================================================
- Zero combat; fully pacifist by nature. The "cost" is caps (buy) or time (count) or
  risk (pull) — never violence.
- Rewards diverge (Megaton law): COUNT = dignity + a warm stop; BUY = you're broke +
  the kindest trade; HELP = a Volunteers bond + maybe a saved man; PULL = a hard mercy
  + a Reconstruction clue. No path is "optimal"; they're different kinds of decency.
- The absurd IS the point: this quest's job is TONE — it makes the Amalgamation dread
  land harder by first making you laugh, then breaking your heart (Yakuza whiplash law).

===============================================================================
## 9. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Introduces the COMEDY music pool + the duck-to-one-tone
whiplash cue as reusable tone tech. Conditions read ledger/skill/knowledge/fold;
effects write same + (optional) the mindmap clue. Deterministic + save-through. Gate:
all resolutions reachable, the crack fires from both bit paths, pull-check success AND
fail both resolve safely (no death), mindmap clue only sets on pull-success. Joins suite.

## 10. WHAT THIS PROVES (vs 001-004)
Fifth distinct engine: the RELEASE-VALVE street-ambush — comedy that cracks into
grief (Yakuza whiplash), scored with a duck-to-one-tone cue, zero combat, and a
stealth Amalgamation micro-seed that ties the tail back to the Reconstruction (Q004).
The bible now proves it can be FUNNY and devastating in the same breath — the tonal
range that makes the heavy quests hit twice as hard. Covers: tender-tail, branching-
moral, companion-succession, core-mystery, AND release-valve tone.

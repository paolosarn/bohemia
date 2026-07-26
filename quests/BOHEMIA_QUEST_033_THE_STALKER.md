# BOHEMIA — QUEST 033: "THE ONE WHO WATCHES THE STAGE"
Full production build. Built to the dialogue/scene spec; template = 001-032. Tier-3
PROTECTION / stalker-mystery (Vault #29 The Stalker + tradition VI Yakuza whiplash-tender +
the music-promotion hook). Name catalog-adjacent. A pop performer is hunted by someone who
"loves or loves to hate her" — a small protection case that turns tender when the stalker
is revealed as a grieving fan the crash broke.

Design soul: the danger is grief, not malice. A performer hires the dynasty to stop a stalker;
the investigation reveals the "threat" is a broken person clinging to the one beautiful thing
the crash left them. The quest asks whether protection means removal or reconnection — and
surfaces the music as the thing that kept someone alive.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_watches_the_stage
- tier: 3 (unmarked-leaning; a performer's plea)
- fold: how the stalker is handled (removed / helped / reconciled) shapes a tender recurring
  thread and the performer's arc; the music's role as a lifeline is reinforced.
- entry_conditions: LARK, a rising performer (surfaces Paolo's music), reports being followed
  by a figure who leaves unsettling gifts and notes.
- faction_wires: COLORFUL (the arts scene), VOLUNTEERS (mental-health support), the music
  catalog (Lark's songs are the emotional thread).
- music_pool: LARK's tracks (diegetic — a song becomes the KEY to the stalker's story);
  TENSION on the hunt; a warm resolve on reconciliation.
- ledger_writes: recorded[stalker_outcome_*]; UNRECORDED[was_it_a_threat_or_a_wound];
  a recurring-NPC thread.
- amalgamation_thread: NONE. A human quest about grief and the things that keep us alive.

===============================================================================
## 2. CAST
===============================================================================
- LARK (id: lark) — a rising COLORFUL performer, frightened by a persistent follower; wants
  safety, not necessarily punishment. default_emotion: nervous_kind. faction: COLORFUL.
- THE FOLLOWER / WISP (id: wisp) — a person the crash shattered (lost family, home, self) who
  latched onto Lark's music as the only thing that made living bearable; harmless in intent,
  frightening in behavior; doesn't understand the fear they cause. default_emotion: fixated_
  fragile -> (if reached) ashamed_lucid. faction: none.
- DR. SAMA (id: sama) — VOLUNTEERS (RECURRING); can offer Wisp real support. default_emotion:
  gentle_professional.
- THE PLAYER — [READ]/[MEDICINE] (recognize grief-fixation vs true threat), standing, restraint.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
INVESTIGATION (trace the follower via the gifts/notes; the CLUE is a song) -> the CONFRONTATION
(find Wisp) -> a tender FORK: REMOVE (scare/drive off — the easy, cold answer), HELP (connect
Wisp to support), RECONCILE (a supervised, boundaried moment between Lark and Wisp), or, if the
player misreads it, treat a wound as a threat (the cautionary path). Restraint-scored.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: lark  emotion: nervous_kind  gesture: clutch_a_note  camera: two_shot
  music:{pool:LARK_TRACK,cue:soft_diegetic}
  line: "Someone's been following me. Gifts on my doorstep — a dried flower, a lyric copied out
         by hand, a drawing of me MID-SONG. Notes that say 'you saved my life' and 'don't ever
         stop.' It's... I don't want to be cruel, but it FRIGHTENS me. I don't know if they love
         me or if they'll hurt me. I just want it to STOP. Safely, if it can be safe."
  -> goto invest_hub
node invest_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Examine the gifts and notes.)"        -> clue_gifts  [once]
   - "[MEDICINE] (Read the pattern — threat or fixation?)" -> clue_read [require skill.medicine>=2][once]
   - "(Stake out and follow the follower.)"  -> clue_follow [once]
   - "(Confront the follower.)"               -> confront_gate [show after 2]
node clue_gifts
  speaker: PLR (internal)  camera: closeup_on_gifts  music:{pool:LARK_TRACK,cue:one_lyric}
  line: "(The gifts aren't threats. They're OFFERINGS — careful, poor, made by hand. The
         copied lyric is from Lark's song about surviving the crash. It's been copied out dozens
         of times, the paper worn soft from handling. Whoever this is didn't stalk a celebrity.
         They clung to a LIFELINE and don't know the difference.)"
  effect: knowledge[the_gifts_are_devotion_not_menace]  -> goto invest_hub
node clue_read  [MEDICINE]
  speaker: PLR (internal)  camera: closeup
  line: "(No escalation pattern, no threats, no demands — the hallmarks of danger are ABSENT.
         This reads as grief-fixation: someone who lost everything and anchored to the one thing
         that still felt like being alive. Frightening to be the anchor. But this isn't a predator.
         It's a drowning person holding a song like a plank.)"
  effect: knowledge[this_is_grief_not_threat] (crucial: mishandling a wound as a threat is the
    cautionary path)  -> goto invest_hub
node clue_follow
  speaker: PLR (internal)  camera: night_street  music:{pool:LARK_TRACK,cue:distant_humming}
  line: "(You follow them home — a scavenged squat, walls papered with Lark's set-lists and a
         single cracked photo of a family. They're humming Lark's song to themselves in the dark,
         off-key, like a prayer. They don't even lock the door. There's nothing here to fear. Only
         someone the world already broke.)"
  effect: knowledge[wisp_lives_alone_with_the_music]  -> goto invest_hub

--- CONFRONTATION + FORK ---
node confront_gate
  speaker: wisp  emotion: fixated_fragile  gesture: freeze_caught  camera: closeup  micro_expression: terror_of_being_seen
  line: "You're— you're one of hers? Are you here to make me stop? Please don't make me stop. Her
         song is the only— when everything went, when they ALL went, her voice on a scavenged
         speaker was the only thing that— I'd never hurt her. I'd never. I just needed to be NEAR
         the thing that kept me breathing. ...Is that so wrong? Is it?"
  -> goto fork_gate
node fork_gate (speaker: PLR)  camera: closeup  music:{pool:TENSION,cue:hold}
  choices:
   - "(Connect Wisp to Dr. Sama — real support.)"          -> route_help [require knowledge.this_is_grief_not_threat]
   - "(Broker a boundaried, supervised meeting with Lark.)" -> route_reconcile [require knowledge.the_gifts_are_devotion_not_menace]
   - "(Warn them off hard — make them disappear.)"          -> route_remove
   - "(Treat them as a threat — drive them out for good.)"  -> route_misread
node route_help
  speaker: sama  emotion: gentle_professional  gesture: offer_a_hand  camera: two_shot  music:{pool:TENSION,cue:warm}
  line: "Hey. The song helped you hold on — that's not madness, that's SURVIVAL, and it means
         you're still in there fighting. Let's get you people to hold onto instead of just a
         voice on a speaker. You did the hard part already. You lived. Come on."
  effect: Wisp enters real support (the healthiest outcome); Lark is safe (Wisp, helped, stops the
    frightening behavior on their own); recorded[helped_wisp]; UNRECORDED[healed_a_wound]=true;
    standing[VOLUNTEERS]+; Wisp may recur, slowly rebuilding. -> goto lark_close
node route_reconcile
  speaker: lark  emotion: fear_softening  camera: three_shot  music:{pool:LARK_TRACK,cue:live_gentle}
  beats: a supervised, boundaried meeting (Sama present, clear limits). Lark hears WHY the song
    mattered; Wisp hears that the fear was real and agrees to boundaries. Lark sings the song ONCE,
    for Wisp, as a goodbye-and-a-blessing, not an invitation.
  line (lark): "...I wrote that song drowning too. I didn't know it reached anyone down there with
         me. I can't be your lifeline — that's too heavy for a stranger to carry. But I'm GLAD it
         held you. Let Sama's people be your lifeline now. And... thank you for telling me it
         mattered. Artists never know."
  effect: a rare, careful reconciliation (boundaries + support + mutual humanity); recorded
    [reconciled_lark_wisp]; UNRECORDED[gave_them_both_peace]=true; the warmest outcome; the music's
    power as a lifeline made explicit (Bohemia's purpose). -> goto lark_close
node route_remove
  speaker: wisp  emotion: crushed_compliant  camera: closeup
  line: "...Okay. Okay. I'll go. I'll stop. I won't— I'll find somewhere else to— I'm sorry. I'm
         sorry I frightened her. I only— never mind. I'm going." (they vanish)
  effect: Lark is safe (the fear ends); but Wisp is cast back into isolation with their lifeline
    severed (a colder outcome — the threat "handled," the person abandoned); recorded[drove_off_wisp];
    UNRECORDED[cut_the_plank_loose]=true; an heir may find Wisp worse off, or gone. Safe, and sad. -> goto lark_close
node route_misread  (the cautionary path — treating a wound as a threat)
  speaker: wisp  emotion: terror  camera: closeup  music:{pool:COMBAT,cue:swap}
  line: "No— no I'm not— I never TOUCHED her, I only— please, PLEASE don't—"
  effect: if the player escalates to force (Dead Eye/violence) against a harmless grieving person,
    it "works" (Wisp is driven out or worse) but writes UNRECORDED[hurt_the_grieving]=true; a real
    stain; the district may hear the dynasty brutalized a broken fan; Lark, learning the truth,
    is HORRIFIED (standing-). The quest's warning: not every frightening thing is a threat (the
    misread has a cost). -> goto lark_close
node lark_close
  speaker: lark  emotion: (varies by route)  camera: closeup  music:{pool:LARK_TRACK,cue:resolve}
  line (help/reconcile): "You could've just scared them off. You saw a PERSON instead. ...I'll keep
         singing. Maybe a little braver now, knowing where it lands."
  line (remove/misread): "It's over, then. I'm safe. ...I keep thinking about that worn-out lyric,
         though. Copied a hundred times. I hope wherever they went, they've still got the song."
  effect: locks the outcome + the fold thread. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- HELP: Wisp slowly rebuilds (a tender recurring thread — a life the dynasty saved by seeing a
  wound not a threat); Lark sings braver; the music's lifeline-power affirmed.
- RECONCILE: the warmest — both find peace; Lark's arc deepens; a model of boundaried compassion.
- REMOVE: Lark safe, Wisp abandoned; a colder fold echo (the person behind the fear, discarded).
- MISREAD: a stain (brutalized a grieving person); Lark horrified; the cautionary cost of treating
  wounds as threats.
- UNRECORDED[was_it_a_threat_or_a_wound] colors whether the dynasty is remembered for seeing people
  or seeing dangers.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Wisp's fixated fragility cracking to ashamed lucidity (terror_of_being_seen — the person who
  never meant to frighten); Lark's fear softening to gratitude. The FACE-read (grief vs threat) is
  the whole quest — the player who LOOKS sees a wound. Procedural lip-sync.
BODY: Wisp's careful, self-effacing movement (not a predator's); the squat is a readable place-node
  (Q028 tech — walls of set-lists, one family photo); combat only on the misread path.
CAMERA: two_shots with Lark, closeup on the gifts + Wisp's caught face, night_street for the follow,
  three_shot for the reconcile. Cuts on beat.
MUSIC: LARK's diegetic track threads the whole quest — a SPECIFIC SONG (about surviving the crash)
  is the clue AND the emotional key; the worn-copied lyric, the off-key humming in the dark, the
  live gentle reprise at reconciliation. The music IS the lifeline, made literal. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + restraint)
===============================================================================
- Pacifist by nature; the ONLY violence is the cautionary MISREAD path (and it's scored as a stain).
  Help/reconcile/remove are all non-combat.
- Rewards diverge (Megaton law, tender register): HELP = a saved life + a lifeline affirmed; RECONCILE
  = mutual peace (the warmest); REMOVE = safety + an abandoned person; MISREAD = a stain + a horrified
  performer. The EASY answer (scare them off) is cold; the misread is worst; SEEING the person is best.
- Theme: not every frightening thing is a threat — the quest rewards LOOKING before acting (the
  opposite of the mob-scapegoat in Q022), and makes the music a literal lifeline (Bohemia's purpose).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Uses a diegetic SONG as a clue+emotional-key + readable place-node (the
squat) + the grief-vs-threat read gate (mishandling = the cautionary path). Reads ledger/standing/
skill/knowledge/fold; writes same + a recurring-NPC thread + a "sees-people-vs-dangers" rep nudge.
Deterministic + save-through. Gate: the grief-vs-threat clues gate the humane routes, all four routes
resolve, misread flagged as a stain, diegetic song plays as clue + reprise, recurring thread persists.
Joins the suite.

## 9. WHAT THIS PROVES (vs 001-032)
New engine: the PROTECTION / stalker-mystery where the "threat" is a grieving person clinging to a
lifeline — the quest rewards LOOKING (grief vs threat) before acting, with help/reconcile/remove and a
cautionary MISREAD path (treating a wound as a threat = a stain). A specific diegetic SONG is the clue
and the emotional key, making the music a literal lifeline (Bohemia's purpose). The compassionate mirror
of Q022's mob-scapegoat. Bible at 33; the game now asks the player to see the person behind the fear.

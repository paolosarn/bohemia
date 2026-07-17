# BOHEMIA — QUEST 047: "THE LANGUAGE OF BIRDS"
Full production build. Built to the dialogue/scene spec; template = 001-046. Tier-3
TENDER / neurodivergent-witness (tradition XXXV Howard restraint + Undertale see-the-person +
the music-as-connection hook). Name catalog-adjacent. A nonverbal or differently-communicating
person holds the key to a district problem, and the quest is about LISTENING differently — the
warmest kind of deduction, where patience and attention (not force) unlock the answer.

Design soul: not everyone speaks the district's language, and the ones who don't are often the
ones who SEE most. A person who communicates through birds, patterns, or music — dismissed as
"touched" — witnessed something crucial, and only a dynasty patient enough to learn THEIR
language can understand. The quest rewards attention over force, and honors a mind that works
differently as a gift, not a deficit.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_language_of_birds
- tier: 3 (unmarked-leaning; a gentle deduction the district dismissed)
- fold: how the dynasty treated WIX (the differently-communicating witness) shapes a tender
  recurring thread and whether the district learns to value minds that work differently.
- entry_conditions: a crime/disappearance the district can't solve; the only witness is WIX, who
  everyone's written off as unable to help; the dynasty chooses to try anyway.
- faction_wires: VOLUNTEERS (Wix's care), COLORFUL (Wix's community), whichever faction the
  unsolved problem touches.
- music_pool: a gentle, patterned motif that becomes Wix's "language" (a musical/birdsong logic —
  ties the music hook); warm resolve on connection.
- ledger_writes: recorded[wix_outcome_*]; UNRECORDED[did_you_learn_to_listen]; a recurring thread.
- amalgamation_thread: NONE-to-LIGHT — Wix's pattern-sense could optionally perceive something
  about the servers/hum others miss (a differently-wired mind hearing the machine) — an optional
  Reconstruction micro-thread; otherwise purely human and tender.

===============================================================================
## 2. CAST
===============================================================================
- WIX (id: wix) — communicates through patterns: arranging objects, whistling birdsong sequences,
  rhythms — not through standard speech. Bright, present, seeing; dismissed by the district as
  "touched" or unreachable. Witnessed the key event and has been trying to TELL someone in the
  only language they have. default_emotion: patient_hopeful -> (understood) luminous_relief.
  faction: none / COLORFUL-adjacent.
- WIX'S SIBLING / DOVE (id: dove) — protective, exhausted from a lifetime of translating Wix to a
  world that won't slow down; wary of the dynasty's intentions. default_emotion: guarded_loving.
- DR. SAMA (id: sama) — VOLUNTEERS (RECURRING); gently frames Wix's communication as a language,
  not a symptom. default_emotion: warm_respectful.
- THE PLAYER — patience + [READ] (learn the pattern-language), attention over force.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
THE PROBLEM (an unsolved event; Wix is the only witness) -> LEARNING WIX'S LANGUAGE (a patient
pattern/music deduction — the core of the quest) -> understanding the witness -> a resolution FORK
on how the dynasty HONORS Wix: as a valued witness/friend (see-the-person), or dismisses them after
extracting the answer (the cold, transactional path — the cautionary version). Patience-scored.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: dove  emotion: guarded_loving  gesture: stand_protective  camera: two_shot
  music:{pool:PATTERN,cue:soft_enter}
  line: "You're here about the thing that happened. And someone told you my sibling Wix 'saw
         something.' Let me save you time: everyone comes, everyone gives up, everyone decides Wix is
         'not all there' and leaves. Wix sees MORE than any of you. You just don't speak the language.
         If you're here to poke and go, don't bother. If you're here to LISTEN — really listen — that's
         different. Which are you?"
  choices (PLR):
   - "I'm here to listen. However long it takes."  -> meet_wix
   - "How does Wix communicate?"                    -> spoke_how
   - "[READ] (Watch Wix before assuming anything.)" -> observe_wix
node spoke_how
  speaker: dove  emotion: softening_slightly  camera: closeup
  line: "Patterns. Wix arranges things — stones, feathers, sounds — in orders that MEAN. Whistles
         birdsong that isn't random, it's SYNTAX. Rhythms for feelings. It's a whole language, complete
         and consistent. Nobody bothers to learn it because it's easier to call Wix broken than to call
         themselves lazy. ...You still here?" -> goto meet_wix
node observe_wix  [READ]
  speaker: PLR (internal)  camera: closeup_on_wix  music:{pool:PATTERN,cue:birdsong_logic}
  line: "(Wix isn't agitated or absent — Wix is BUSY. Arranging pebbles in deliberate sequences,
         pausing, rearranging, whistling a phrase and watching to see if you follow. This isn't the
         behavior of someone lost. It's someone TRANSMITTING, patiently, to a world that keeps changing
         the channel. Wix has been trying to tell the story the whole time.)"
  effect: knowledge[wix_is_communicating_deliberately] (reframes Wix from symptom to sender)  -> goto meet_wix
node meet_wix
  speaker: wix  emotion: patient_hopeful  gesture: offer_a_pattern  camera: two_shot  music:{pool:PATTERN,cue:invitation}
  line: (Wix doesn't speak in words — Wix arranges three stones and whistles a rising phrase, watching
         your face to see if you'll meet them halfway) [the game presents Wix's PATTERN-LANGUAGE as a
         gentle deduction: match rhythms, follow sequences, learn the syntax]
  -> goto learn_gate
node learn_gate (speaker: PLR)  camera: closeup  music:{pool:PATTERN,cue:learning}
  choices:
   - "(Learn the pattern-language — patiently, on Wix's terms.)"  -> route_learn
   - "(Push Wix to 'just show you' the answer faster.)"           -> route_push
node route_push
  speaker: wix  emotion: withdrawing  camera: closeup  micro_expression: shutters_closed
  line: (Wix stops. Gathers the stones back. Turns away — the transmission ends when it's rushed) [Dove
         steps in]
  dove line: "There it is. You got impatient and Wix felt it and now Wix is GONE for the day. You can't
         RUSH a language. You proved you're like all the rest. ...Come back when you've got patience, or
         don't come back."
  effect: rushing FAILS (Wix withdraws); the answer stays locked; the player must return and try again
    PATIENTLY (the quest refuses to reward force); knowledge[you_cant_rush_it]  -> goto learn_gate
node route_learn
  speaker: wix  emotion: luminous_relief  gesture: full_pattern_unfurls  camera: two_shot  music:{pool:PATTERN,cue:understanding}
  line: (As you finally follow — matching Wix's rhythm, arranging the stones back, whistling the phrase
         RIGHT — Wix's whole face opens, and the pattern pours out: the full account of what Wix saw,
         told in sequence and song, clear as any words once you know the grammar) [Wix has been holding
         this, alone, waiting for one person to learn how to hear it]
  effect: knowledge[wix_reveals_what_they_saw] (the crime/disappearance SOLVED — Wix witnessed it
    precisely and remembered it perfectly in their own encoding); UNRECORDED[learned_to_listen]=true
  -> goto honor_gate

--- HOW THE DYNASTY HONORS WIX ---
node honor_gate (speaker: PLR)  camera: closeup  music:{pool:PATTERN,cue:hold}
  choices:
   - "(Honor Wix as a valued witness + friend.)"     -> route_honor
   - "(Take the answer and move on.)"                 -> route_extract
node route_honor
  speaker: dove + wix  emotion: overwhelmed_grateful  camera: two_shot  music:{pool:PATTERN,cue:warm_resolve}
  line (dove): "You LEARNED it. You sat in the dirt and learned my sibling's language and Wix has been
         GLOWING since. Do you know how long we've waited for one person from the outside to treat Wix
         like a mind worth learning instead of a problem to solve? ...Wix wants you to have this." (Wix
         gifts a pattern — a token of the language, a friendship)
  effect: Wix + Dove become recurring allies; Wix's pattern-sense is now a district ASSET (a witness/
         perceiver the dynasty values); the district begins to value differently-wired minds (a small
         cultural shift); recorded[honored_wix]; UNRECORDED[saw_the_gift_not_the_deficit]=true; standing
         [VOLUNTEERS/COLORFUL]+. The see-the-person warmth. -> END
node route_extract
  speaker: dove  emotion: quiet_hurt  camera: closeup  micro_expression: shoulders_fall
  line: "...You got what you came for and now you're leaving. Of course. Wix helped you and you'll
         forget Wix by sundown, like everyone. ...At least be honest about it. Wix will be. Wix always
         is. That's more than the rest of you manage." (the dynasty solved the problem but treated Wix
         as a tool)
  effect: the answer is gained but Wix is left un-honored (a cold extraction — the answer without the
    relationship); recorded[extracted_the_answer]; UNRECORDED[used_them_and_left]=true; a small coldness
    on the record (the quest quietly notes you took the gift and gave nothing back). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- HONORED: Wix + Dove recurring allies; Wix's perception a district asset; the district slowly learns
  to value minds that work differently (a cultural shift an heir inherits — a kinder district).
- EXTRACTED: the problem solved but Wix un-honored; a cold precedent (the dynasty uses the different and
  discards them); a small stain.
- The quest's real fold-effect is CULTURAL: did the dynasty teach the district that a different mind is
  a gift or a deficit? (compounds toward a more or less humane district over generations).
- Optional Amalgamation micro-thread: if pursued, Wix's pattern-sense perceives something ABOUT the hum/
  servers others miss (a differently-wired mind hearing the machine) — a tender, unexpected Reconstruction
  perceiver.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Wix's patient hope opening to luminous relief when finally understood (the single most rewarding
  face-turn in the tender-tail — a person SEEN at last); Dove's guarded love softening; the shutters-
  closed withdrawal on the push route (the cost of impatience, on a face). Procedural lip-sync for Dove/
  Sama; Wix communicates through PATTERN + whistled phrase (a non-speech expressive channel — a unique
  presentation beat). 
BODY: Wix's deliberate arranging (stones, feathers — the pattern-language made physical + visible); the
  player learning is a patient matching/rhythm interaction (attention, not force); no combat.
CAMERA: two_shots with Dove/Wix, closeup_on_wix's arrangements (the language as image), a warm hold when
  understanding lands. Cuts slow, patient (the pacing IS the theme).
MUSIC: a gentle PATTERN motif — Wix's "language" rendered as birdsong-logic + rhythm (ties the music hook:
  understanding Wix is literally a musical deduction); warm resolve on connection. The music IS the
  communication. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + tender + attention-over-force)
===============================================================================
- Fully pacifist (a patience/deduction quest); no combat at all.
- Rewards diverge (tender register): LEARN+HONOR = the answer + a friend + a cultural shift + Wix valued;
  LEARN+EXTRACT = the answer + a coldness; PUSH = failure (must return patiently). The quest REFUSES to
  reward force — rushing Wix fails, and the only way through is attention on Wix's terms (the anti-force
  design, purest form).
- Core theme: honor a mind that works differently as a GIFT, not a deficit (Undertale see-the-person +
  Howard restraint); reward patience and attention; a differently-communicating person as the one who
  SEES most. A tender, respectful portrait handled with care (no caricature — Wix is a full, capable,
  seeing person whose language the WORLD failed to learn, not the other way around).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Introduces the PATTERN-LANGUAGE interaction (a non-speech communication
channel — arranging/rhythm/whistled-phrase deduction, ties the music system) + a patience-gate (force
fails, attention succeeds) + a cultural-shift fold flag. Reads ledger/standing/skill/fold; writes same +
a recurring-ally thread + the cultural flag. Deterministic + save-through. Gate: the pattern-language
learnable via patient matching, push-route fails + requires patient return, learn-route reveals the
answer, honor/extract resolve, the cultural-shift + recurring thread persist, no combat. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-046)
New engine: the NEURODIVERGENT-WITNESS / attention-over-force tender quest — a differently-communicating
person (pattern/birdsong/rhythm language) holds the key, and only a dynasty patient enough to LEARN their
language understands (rushing FAILS). Honors a mind that works differently as a gift, not a deficit
(Undertale see-the-person + Howard restraint), and introduces a non-speech PATTERN-LANGUAGE interaction
tied to the music system. The purest anti-force design in the bible (attention is the only key). Bible at
47; patience itself is now a mechanic, and the district can learn to value minds that work differently.

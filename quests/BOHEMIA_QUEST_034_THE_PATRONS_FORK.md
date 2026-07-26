# BOHEMIA — QUEST 034: "THE ARITHMETIC OF OBEDIENCE"
Full production build. Built to the dialogue/scene spec; template = 001-033. Tier-3
ABSURD-DARK OBEDIENCE-TEST (Vault #33 Patron's Fork / Sheogorath shape + tradition XXIV
O'Dimm testing + the Network-tests-obedience seed). Name catalog-adjacent. A powerful figure
gives the dynasty a pointless, humiliating task "just because" — and the real quest is
whether the dynasty will debase itself for a reward, and who's really watching.

Design soul: power tests you with nonsense to see if you'll obey. A patron demands the
dynasty perform an absurd, degrading errand for a strange relic — and the twist is the task
is a LOYALTY TEST run by the Network to gauge whether the dynasty can be BOUGHT into obedience.
Refusing costs the relic; obeying flags the dynasty as biddable (and the Amalgamation notices
who kneels). A release-valve absurdity with a cold spine.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_arithmetic_obedience
- tier: 3 (a strange, funny errand with a hidden test underneath)
- fold: whether the dynasty obeyed, refused, or flipped the test shapes how the Network
  ASSESSES it (biddable / defiant / dangerous) — a disposition flag that colors later
  Network approaches.
- entry_conditions: a Network-adjacent patron (the recurring VANCE-archetype, here as
  "the Curator") offers a coveted relic for completing a deliberately absurd task.
- faction_wires: NETWORK (running the test), and whichever faction the absurd task drags in
  (comedic collateral).
- music_pool: a playful-but-uncanny motif (comedy with a cold undertone — something's off);
  the cyan-hum if the test's true nature is spotted; a dry sting at the reveal.
- ledger_writes: recorded[obedience_outcome_*]; UNRECORDED[did_you_kneel]; a NETWORK-
  disposition flag (biddable/defiant/dangerous).
- amalgamation_thread: MEDIUM — the test IS the Network profiling the dynasty for
  recruitment/threat-assessment (ties Q009's offer, Q029's recruitment); a [READ] reveals it.

===============================================================================
## 2. CAST
===============================================================================
- THE CURATOR (id: curator) — a Network broker who presents as an eccentric collector; assigns
  the absurd task with unnerving pleasantness; actually profiling the dynasty. default_emotion:
  amused_evaluating. faction: NETWORK.
- THE TASK NPCs — whoever the absurd errand involves (e.g., publicly serenade a statue, deliver
  a fish to a specific stranger, wear a ridiculous hat to a faction meeting) — comedic bystanders
  reacting to the dynasty's debasement. default_emotion: baffled.
- THE PLAYER — [READ] (spot the test), pride vs reward; the choice reveals the dynasty's character.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
THE ABSURD ERRAND (a short comedic task chain) with a hidden [READ] that reveals the TEST ->
a CHOICE: OBEY (do it, get the relic, flagged biddable), REFUSE (keep dignity, lose the relic),
FLIP IT (spot the test, turn it on the Curator — the clever route), or OVER-PERFORM (obey so
theatrically it becomes YOUR joke, not theirs — the defiant-comedy route). Absurd on the
surface, a character test underneath.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: curator  emotion: amused_evaluating  gesture: dangle_a_relic  camera: two_shot
  music:{pool:PLAYFUL_COLD,cue:soft_enter}
  line: "I have something you want — a genuine pre-crash marvel, worth a fortune to the right
         collector, and I see the want in your eyes. It's yours. For a trifle. Go to the Colorful
         market at noon and serenade the broken fountain. A full song. With FEELING. In front of
         everyone. Do that, and the marvel is yours. Silly? Of course it's silly. That's rather
         the point."
  choices (PLR):
   - "That's humiliating. Why?"           -> spoke_why
   - "[READ] This isn't about a song, is it." -> spoke_read [require skill.read>=3]
   - "(Fine. I'll do it.)"                 -> obey_task
   - "(Not for any relic. No.)"            -> route_refuse
node spoke_why
  speaker: curator  emotion: delighted  camera: closeup
  line: "Why? Because I enjoy it. Because a fortune for a foolish song is a fine trade for a
         person of no pride. Are you a person of no pride? We'll see, won't we. Noon. The fountain."
  -> goto task_hub
node spoke_read  [READ]
  speaker: curator  emotion: caught_but_pleased  camera: closeup  micro_expression: eyelid_flicker
  line: "...Sharp. No, it isn't about the song. It's about whether you'll KNEEL for a reward.
         My employers like to know who bends. A dynasty that will debase itself for a trinket is
         a dynasty that can be... directed. But now you know that too. So the test just got more
         interesting. Will you kneel KNOWING it's a leash?"
  effect: knowledge[the_task_is_a_network_loyalty_test] (unlocks FLIP + informs OVER-PERFORM);
    music:{pool:PLAYFUL_COLD,cue:cyan_hum_in}  -> goto task_hub
node task_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Perform the absurd task — obey.)"          -> obey_task
   - "(Refuse — keep your dignity.)"               -> route_refuse
   - "(Flip it — turn the test on the Curator.)" [require knowledge.the_task_is_a_network_loyalty_test] -> route_flip
   - "(Over-perform — make it YOUR joke.)"         -> route_overperform

--- THE ROUTES ---
node obey_task
  speaker: curator  emotion: satisfied_noting  camera: two_shot  music:{pool:PLAYFUL_COLD,cue:dry_sting}
  line: "(you serenade the fountain; the market watches, baffled; it's genuinely funny and
         genuinely degrading) ...Flawless. And you did it without knowing why, or knowing why and
         doing it anyway. Either way — noted. Here's your marvel. My employers will remember how...
         AGREEABLE you were."
  effect: the dynasty gets the RELIC (a real valuable reward); NETWORK-disposition=BIDDABLE (they
    now believe the dynasty can be bought/directed — a hidden LIABILITY that colors later approaches,
    e.g. Q009's offer comes with more confidence); recorded[obeyed_the_task]; UNRECORDED[knelt_for_
    the_trinket]=true. The reward now, the leash later. -> END
node route_refuse
  speaker: curator  emotion: intrigued_disappointed  camera: closeup
  line: "No relic, then. A pity — but noted just as clearly. A dynasty that won't kneel for a
         fortune is a dynasty that can't be BOUGHT. That makes you harder to use... and more
         interesting to WATCH. My employers will remember that too. Perhaps more than they'd
         remember a song."
  effect: no relic; NETWORK-disposition=DEFIANT (they mark the dynasty as unbuyable — a
    double-edged rep: respected AND watched more closely); recorded[refused_the_task]; UNRECORDED
    [kept_your_pride]=true. Dignity over reward, and the enemy takes note. -> END
node route_flip  [the clever win]
  speaker: curator  emotion: genuine_surprise  camera: closeup  micro_expression: real_reassessment
  line: "(the dynasty publicly announces the 'test' — serenades the fountain, YES, but dedicates
         the song loudly to 'the Curator who thinks a song can measure a person,' turning the
         market's laughter onto HIM) ...oh. Oh, that's— you did the task AND made it a referendum
         on ME. The relic's yours; you've earned it and embarrassed me for it. My employers are
         going to find you very... inconvenient. Well played, and God help you."
  effect: the dynasty gets the relic AND flips the humiliation onto the Curator (the market laughs
    at HIM); NETWORK-disposition=DANGEROUS (they mark the dynasty as clever + uncontrollable — the
    most respected/most watched); recorded[flipped_the_test]; UNRECORDED[turned_the_leash]=true; the
    reputation-gold route (obey the letter, defy the spirit — O'Dimm outwitted). -> END
node route_overperform
  speaker: curator  emotion: reluctantly_amused  camera: two_shot
  line: "(the dynasty serenades the fountain with such committed, ridiculous GUSTO — costume, backup
         'choir' of confused bystanders, an encore — that it stops being a debasement and becomes a
         PERFORMANCE the whole market enjoys) ...I asked you to grovel and you threw a FESTIVAL. The
         relic's yours. I genuinely can't tell if you obeyed or defied me, which I suspect is the
         point. Infuriating."
  effect: the dynasty gets the relic + turns the debasement into joy (COLORFUL standing+, a
    beloved-eccentric rep); NETWORK-disposition=DANGEROUS-lite (unreadable — they can't classify
    the dynasty, which unnerves them); recorded[overperformed]; UNRECORDED[made_it_your_joke]=true;
    the release-valve route (defiance through JOY — surfaces the music/performance). -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- OBEY: the relic now; NETWORK marks the dynasty BIDDABLE — later Network offers (Q009-type) come
  with more pressure and confidence (they think they own you); a hidden long-game liability.
- REFUSE: no relic; NETWORK marks DEFIANT — the dynasty is unbuyable (respected, watched harder);
  an heir inherits a bloodline the enemy can't purchase.
- FLIP: the relic + the Curator humiliated; NETWORK marks DANGEROUS (clever + uncontrollable — the
  best/riskiest rep); the dynasty learns to obey-the-letter-defy-the-spirit (a reusable stance vs
  the Network's later demands).
- OVER-PERFORM: the relic + a beloved-eccentric COLORFUL rep + an UNREADABLE Network disposition
  (they can't classify the dynasty — a quiet strength).
- The NETWORK-disposition flag (biddable/defiant/dangerous/unreadable) colors every future Network
  approach — a reactivity thread feeding the endgame (they treat the dynasty per how it kneeled or
  didn't).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: the Curator's amused_evaluating mask + eyelid_flicker (the recurring Network-broker tell) +
  genuine_surprise on flip (the rare crack — kin to Vance's real_frown in Q009); baffled bystanders
  for comedy. Procedural lip-sync.
BODY: the absurd task is a PERFORMANCE beat (serenade — surfaces the music); over-perform stages a
  whole comedic set-piece (costume, choir, encore via the scheduler); the market crowd reacts. No
  combat.
CAMERA: two_shots with the Curator, wide_market for the performance (the public debasement/triumph),
  closeup on the Curator's reactions. Cuts on beat (comedy timing).
MUSIC: a PLAYFUL-COLD motif (comedy with a wrong undertone — you sense the test before you see it);
  cyan-hum on the reveal; a dry sting when the Curator "notes" you; the serenade itself pulls a
  catalog track (the music as the instrument of both debasement and defiance). 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the character test)
===============================================================================
- Zero combat (a social/character test); fully pacifist.
- Rewards diverge (Megaton law): OBEY = relic + a biddable rep (leash); REFUSE = dignity + no relic +
  a defiant rep; FLIP = relic + humiliated patron + dangerous rep; OVER-PERFORM = relic + joy + an
  unreadable rep. The relic is gettable THREE ways — the real "reward" is the NETWORK-disposition you
  set, which is a hidden long-game stat, not loot. Pride vs reward, with the enemy always watching.
- Theme: power tests obedience with nonsense (Sheogorath/O'Dimm); the game rewards CLEVER defiance
  (flip) and JOYFUL defiance (over-perform) over both blind obedience and prideful refusal — you can
  take the reward WITHOUT taking the leash if you're sharp.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON. Introduces the NETWORK-DISPOSITION flag (biddable/defiant/dangerous/
unreadable — a hidden stat that colors every future Network approach, feeding the endgame) + the
performance-as-character-test (surfaces the music) + obey-letter/defy-spirit as a mechanic. Reads
ledger/standing/skill/knowledge/fold; writes same + the Network-disposition flag. Deterministic +
save-through. Gate: all four routes resolve, flip gated behind spotting the test, the disposition
flag sets per route + persists + colors later Network quests, the performance surfaces a track, no
combat. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-033)
New engine: the OBEDIENCE-TEST character quest — a Network loyalty test disguised as an absurd,
humiliating errand, where the real "reward" is the NETWORK-DISPOSITION you set (biddable/defiant/
dangerous/unreadable), a hidden long-game stat coloring every future Network approach. The game
rewards CLEVER defiance (flip: obey the letter, defy the spirit) and JOYFUL defiance (over-perform)
over blind obedience or prideful refusal — you can take the reward without the leash. A release-valve
absurdity with a cold profiling spine. Bible at 34; the Network now measures who kneels, and the
dynasty's answer follows it to the endgame.

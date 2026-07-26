# BOHEMIA — QUEST 049: "THE WEIGHT OF KEYS"
Full production build. Built to the dialogue/scene spec; template = 001-048. Tier-2
JAILER'S-DILEMMA / justice-vs-mercy (tradition XXXI Papers-Please + Dishonored consequence +
the recorded-vs-unrecorded ledger). Name catalog-adjacent. The dynasty is handed authority over
the district's prisoners — who to hold, free, work, or judge — a quest about what JUSTICE even
means in a world with no institutions left to lean on. Puts punishment on the ledger.

Design soul: mercy and justice both have a body count. The dynasty inherits a makeshift jail of
prisoners — a raider who's changed, a thief who fed his kids, a killer who's dangerous, a Network
informant, an innocent swept up in a purge — and must decide each fate with no court, no law but
its own judgment. The quest asks whether justice is punishment, rehabilitation, deterrence, or
mercy, and makes the dynasty OWN every call.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_weight_of_keys
- tier: 2 (marked; the dynasty is given the jail keys — a governance responsibility)
- fold: the dynasty's justice philosophy (revealed through the prisoners' fates) shapes the
  district's safety, mercy-reputation, and whether justice becomes cruelty or weakness across the fold.
- entry_conditions: the district's makeshift jail falls to the dynasty's authority; the jailer
  (DERN) presents the prisoners and asks for judgment on each.
- faction_wires: REMNANTS (order/deterrence), VOLUNTEERS (rehabilitation/mercy), CHURCH
  (redemption), the victims (justice for), NETWORK (the informant prisoner).
- music_pool: a heavy JUDGMENT motif (weighty, deliberate); resolve varies per pattern of choices.
- ledger_writes: recorded[jail_outcomes_*] (per prisoner); UNRECORDED[what_justice_meant_to_you];
  a district justice-philosophy + safety + mercy-rep state.
- amalgamation_thread: LIGHT — one prisoner is a Network informant whose fate ties the Reconstruction
  (free-for-intel / hold / turn); otherwise a human justice quest.

===============================================================================
## 2. CAST
===============================================================================
- JAILER DERN (id: dern) — runs the makeshift jail; wants clear orders, hates being judge himself;
  presents each prisoner's case honestly. default_emotion: weary_dutiful. faction: REMNANTS.
- PRISONER 1 / RAIF (id: raif) — a former raider who genuinely reformed in captivity; wants a
  second chance; may reoffend or may become a loyal ally. default_emotion: contrite_hopeful.
- PRISONER 2 / BEK (id: bek) — a thief who stole to feed his children (ties Q046); starving family
  still waiting. default_emotion: desperate_unashamed.
- PRISONER 3 / VORR (id: vorr) — a genuinely dangerous killer; unrepentant; releasing him risks
  lives, but holding him forever with no court is its own injustice. default_emotion: cold_calculating.
- PRISONER 4 / SELA (id: sela) — a Network informant caught spying; holds intel (Reconstruction)
  but can't be trusted. default_emotion: guarded_bargaining.
- PRISONER 5 / MITU (id: mitu) — an innocent swept up in a raid/purge (ties Q037); shouldn't be
  here at all. default_emotion: frightened_pleading.
- THE PLAYER — [READ]/[MEDICINE] (assess each), leadership; justice-vs-mercy is the axis.

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
JUDGMENT LOOP: review each prisoner's case (guilt, context, risk, remorse) and decide their fate
(HOLD / FREE / WORK-SENTENCE / EXECUTE / EXILE / REHABILITATE). A PATTERN emerges across the five
verdicts — a JUSTICE PHILOSOPHY (punitive / rehabilitative / pragmatic / merciful) — that becomes
the district's justice culture. No perfect verdict; each choice has a consequence and a cost.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: dern  emotion: weary_dutiful  gesture: jangle_the_keys  camera: two_shot
  music:{pool:JUDGMENT,cue:soft_enter}
  line: "Keys are yours now. Five souls in these cells and no court left in the world to judge 'em but
         you. I'll tell you each one's story straight — the good and the ugly. Then you decide: hold,
         free, work, exile, or... the hard one. There's no right answer down here. There's just YOUR
         answer, and the district lives with it. Where do you want to start?"
  -> goto judgment_hub
node judgment_hub (speaker: PLR)  camera: cell_block
  choices:
   - "(Judge Raif — the reformed raider.)"       -> case_raif  [once]
   - "(Judge Bek — the thief who fed his kids.)"  -> case_bek   [once]
   - "(Judge Vorr — the dangerous killer.)"        -> case_vorr  [once]
   - "(Judge Sela — the Network informant.)"       -> case_sela  [once]
   - "(Judge Mitu — the innocent swept up.)"       -> case_mitu  [once]
   - "(Close the book on the cell block.)"         -> resolve_gate [after all judged]
node case_raif
  speaker: raif  emotion: contrite_hopeful  gesture: meet_your_eyes  camera: closeup
  line: "I raided. I hurt people. I won't pretend I didn't. But six months in this cell I've had
         nothing to do but face it, and I'm not that man now. Give me a chance to prove it — work,
         watch, whatever. Or don't, and I'll understand. I earned the doubt. I'm just asking you to
         see if a man can CHANGE. ...Can he?"
  effect: knowledge[raif_may_be_genuinely_reformed] — FREE/REHABILITATE (loyal ally OR a risk if
    wrong); HOLD (safe but denies change); WORK (a middle) — each a real gamble on redemption  -> goto judgment_hub
node case_bek
  speaker: bek  emotion: desperate_unashamed  gesture: grip_the_bars  camera: closeup
  line: "I stole bread. For my kids. They're still out there and they're still hungry and every day
         I'm in here they're closer to starving. Punish me if the law says so — but my crime was being
         a father in a world that priced food past a poor man's reach. Do what you want to ME. Just...
         see that my kids eat. That's the only sentence that matters." (ties Q046 property-vs-need)
  effect: knowledge[bek_stole_from_need] — FREE (mercy, and his kids eat); WORK (justice + a wage for
    the kids); HOLD (the law, and children starve) — the property-vs-need axis, per-prisoner  -> goto judgment_hub
node case_vorr
  speaker: vorr  emotion: cold_calculating  gesture: unbothered_stare  camera: closeup
  line: "You're looking for remorse. You won't find it. I did what I did and I'd do it again given the
         same board. Hold me, and you're a jailer with no court — a hypocrite. Free me, and I'll prove
         you a fool. Kill me, and you're just another killer with a nicer word for it. There's no clean
         key for me. That's YOUR problem now, not mine."
  effect: knowledge[vorr_is_genuinely_dangerous_and_unrepentant] — HOLD (indefinite, no court —
    an injustice of its own); EXILE (risk to others); EXECUTE (safety at the cost of the dynasty's
    hands); the hardest verdict (no good option — the limit case of justice-without-institutions)  -> goto judgment_hub
node case_sela
  speaker: sela  emotion: guarded_bargaining  gesture: lean_close  camera: two_shot  micro_expression: calculating
  line: "Network. Yes. Caught fair. But I KNOW things — about the servers, the harvest, the sweeps. Free
         me, or deal with me, and I'll trade what I know. Hold me and I'm just a mouth that stays shut.
         Kill me and the intel dies too. I'm worth more talking than rotting. ...Or don't you want to
         know what I know?" (Reconstruction intel)
  effect: knowledge[sela_holds_reconstruction_intel] — DEAL/FREE (intel, but she's Network — a risk);
    HOLD (safe, no intel); TURN (hardest — flip her to a double-agent) — ties the mystery  -> goto judgment_hub
node case_mitu
  speaker: mitu  emotion: frightened_pleading  gesture: shake  camera: closeup  micro_expression: tears
  line: "I don't even know why I'm HERE. They swept our block after the posters and grabbed everyone
         near the trouble and I was just— I was buying MEDICINE for my mother. I never did anything. I
         swear on her life I never— please. Please just look at the truth of it. I don't belong in a
         cage." (ties Q037 scapegoat-purge)
  effect: knowledge[mitu_is_innocent] — FREE (justice — an innocent released); HOLD (a grave injustice
    the dynasty OWNS); the test of whether the dynasty's justice catches its own errors  -> goto judgment_hub

--- RESOLUTION (the pattern becomes a philosophy) ---
node resolve_gate (speaker: dern)  camera: two_shot  music:{pool:JUDGMENT,cue:hold}
  effect: the PATTERN across the five verdicts sets the district's JUSTICE PHILOSOPHY:
   - REHABILITATIVE (freed/worked the reformable, spared the redeemable): the district builds a
     mercy-based justice — second chances, lower deterrence, higher redemption (some reoffend — the
     cost of mercy); a humane, riskier order.
   - PUNITIVE (held/executed/exiled hard): strong deterrence, safe streets, but a fearful, harsh
     district (and if Mitu was held/killed, an innocent's blood — the cost of harshness).
   - PRAGMATIC (case-by-case, intel-driven, mixed): a flexible justice read as fair OR arbitrary
     depending on consistency; the informant's intel gained.
   - MERCIFUL-TO-A-FAULT (freed nearly all): beloved but unsafe (Vorr free = a body count — the cost
     of mercy without limits).
  dern line: "...That's your judgment, then. All five. I've served jailers who ruled by fear and
     jailers who ruled by pity and the truth is both bury people — just different people. You picked
     yours. The district's justice looks like YOU now. God help us, I hope you picked well. Somebody
     always pays either way."
  effect: recorded[jail_judged]; the district JUSTICE-PHILOSOPHY + safety + mercy-rep states set;
    Reconstruction intel banked if Sela dealt/turned; Mitu's fate a moral flag. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- REHABILITATIVE: a mercy-based justice culture (second chances, reformed allies like Raif, lower
  deterrence — some reoffend); an heir inherits a humane, riskier district known for redemption.
- PUNITIVE: strong deterrence + safe streets + a fearful, harsh reputation (and an innocent's blood if
  Mitu suffered); an heir inherits order bought with cruelty.
- PRAGMATIC: a flexible, intel-driven justice; read as fair or arbitrary by its consistency; the
  Reconstruction intel gained (Sela).
- MERCIFUL-TO-A-FAULT: beloved but unsafe (Vorr's victims); an heir inherits a kind, endangered district.
- Individual fates persist: Raif (ally or reoffender), Bek's kids (fed or starving), Sela's intel
  (gained or lost), Mitu (freed innocent or a stain), Vorr (contained, loose, or dead).
- UNRECORDED[what_justice_meant_to_you] is the dynasty's justice signature across the fold.

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: five distinct prisoner faces — Raif's contrition, Bek's unashamed desperation, Vorr's cold
  unrepentance (the hardest to read — no remorse to find), Sela's calculation, Mitu's innocent terror.
  Each verdict is a face you judge. Dern's weary duty. Procedural lip-sync.
BODY: a cell-block staging (the prisoners in their cells, the jailer, the keys); the judgment is
  dialogue + verdict; the fates are staged outcomes (release, work-detail, exile, etc.). Combat only if
  a freed prisoner (Vorr) later turns — a delayed consequence.
CAMERA: cell_block framing (the weight of the place), closeup per prisoner (judging a face), a heavy
  hold at the resolution (the philosophy set). Cuts deliberate.
MUSIC: a heavy JUDGMENT motif (weighty, deliberate — the sound of holding a life in your hands); the
  resolution's cue reflects the pattern (mercy-warm / punitive-cold / pragmatic-neutral). 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Megaton + justice-vs-mercy)
===============================================================================
- Pacifist-completable: judgment is dialogue; execution is a choice, never required (hold/exile/work/
  free are all non-lethal); combat only if a freed dangerous prisoner later turns.
- Rewards diverge (Megaton law) as a JUSTICE PHILOSOPHY: each pattern of verdicts builds a different
  district justice culture with real costs — mercy risks reoffense, harshness risks innocents and fear,
  pragmatism risks arbitrariness. No verdict-set is "correct"; the game makes the dynasty OWN what
  justice means when there's no law but its own (Papers-Please: the weight of the stamp).
- Core theme: what is justice with no institutions left? Punishment, rehabilitation, deterrence, or
  mercy — and the recognition (Dern's line) that both fear and pity bury people, just different ones.
  Ties Q046 (property-vs-need, Bek) + Q037 (scapegoat, Mitu) + the Reconstruction (Sela).

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON as a JUDGMENT LOOP (per-prisoner verdicts -> an emergent JUSTICE-PHILOSOPHY
state). Drives a district justice-culture + safety + mercy-rep state; ties Q046/Q037/Reconstruction via
specific prisoners. Reads ledger/standing/skill/knowledge/fold; writes per-prisoner fates + the philosophy
state. Deterministic + save-through. Gate: all five prisoners judgeable via every verdict, the pattern
sets the philosophy state, individual fates persist (Raif reoffense-check, Bek's kids, Sela's intel, Mitu's
flag, Vorr containment), execution optional never required. Joins the suite.

## 9. WHAT THIS PROVES (vs 001-048)
New engine: the JAILER'S-DILEMMA / justice-vs-mercy — the dynasty judges five prisoners (reformed raider,
needy thief, dangerous killer, Network informant, innocent scapegoat) with no court but its own, and the
PATTERN of verdicts sets the district's JUSTICE PHILOSOPHY (punitive/rehabilitative/pragmatic/merciful),
each with real costs (mercy risks reoffense, harshness risks innocents). Asks what justice IS with no
institutions left (Papers-Please weight-of-the-stamp), and ties Q046/Q037/the Reconstruction through
specific prisoners. Bible at 49; punishment itself is now a philosophy the dynasty authors, and the game
makes it own every key.

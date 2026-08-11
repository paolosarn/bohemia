# BOHEMIA BACKLOG (the fleet's queue — read via THE GO PROCEDURE)

## *** DEMO ASAP (Paolo 8/4, direction-class: "I really want to have a demo
## for this game out like asap bro"). THE FLEET CONVERGES ON THE DEMO. Read
## records/BOHEMIA_THE_DEMO_PLAN_8_4_26.md before popping your next item:
## if your lane owns a demo-critical-path row (RUN 00/00b/0d, ART board,
## SOUNDS minimum set, COMBAT warming, PEOPLE 0sc cold open), IT OUTRANKS
## everything else in your queue. Non-demo work continues only when your
## demo-critical items are done or blocked. Demo scope pick pending Paolo
## (ONE GOOD DAY proposed); the critical path is valid under any scope. ***

## *** FLEET-WIDE FREEZE (7/26, ART-FIRST RESET — read laws/BOHEMIA_ADDENDUM_
## ART_FIRST_RESET_7_26_26.md). *** BOTH FREEZES ARE LIFTED AS OF 7/26. ***
## Paolo verdicted the target screen CBB, so the visual constitution EXISTS:
## records/target/BOHEMIA_VISUAL_CONSTITUTION.json, held by
## gates/target_match_gate.py. Every lane may cook new pixels again, and quest
## asks may be surfaced again. THE PRICE: every cook now passes the proxy gates
## (palette ceiling, per-layer value bands, no keyline, no dither, one light
## direction, hashable seam contracts) and every new art bank REGISTERS itself
## in target_match_gate.py's BANKS list. CBB also means the target itself is
## FROZEN and byte-locked - nobody makes another target screen. Verdict record:
## records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt ***

## LAB (THE REFERENCE LAB — first word "lab"; law: laws/BOHEMIA_ADDENDUM_
## THE_REFERENCE_LAB_7_26_26.md. One session = one system = one named game.)
0. [RULED 7/26] THE LANE'S ASSIGNMENT CHANGED MID-DAY. Paolo: "who said I
   wanted to test the walking... it was supposed to be like the actual game and
   all its mechanics... you need to get the code online and implement it for the
   different game mechanics like marriage and fishing in farming". Law:
   laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md — an emulation is
   THREE OR MORE NAMED MECHANICS, each playable end to end, from the real source.
   Movement/camera/collision/lighting are plumbing and can never be a lab
   deliverable again; the gate fails a row that declares one. He also RULED
   Bohemia's movement in the same breath
   (laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md): the world moves
   when you spend time taking an action. That closed LAB-1's open question.
2a. [SHIPPED 8/7 — AND IT IS A FIX TO MY OWN 8/5 WORK] MY CANON-CONSTANTS GATE WAS
   VACUOUS FOR 13 OF ITS 14 CONSTANTS, AND HAD BEEN SINCE THE DAY I BUILT IT.
   Its check E1 claims "no shipped engine module contradicts a declared constant".
   Measured: E1 matches a variable whose NAME equals a registry key, the engine never
   names things that way (the valley is OVER_N x TILE_FINE x CELL_M, not VALLEY_KM2;
   the currencies are an ARRAY of 3, not a number 3), so it sweeps 112 modules and
   finds TWO numbers to compare, both BPM. A CHECK THAT CANNOT FAIL IS WORSE THAN NO
   CHECK, BECAUSE IT REPORTS SAFETY.

   AND THE DRIFT WAS ALREADY THERE: BUILT_KM2 registry 37.0 / world 38.35, ONFOOT_KM2
   75.7 / 76.09. The map has been growing since the 8/3 measurement and nothing
   re-counted. Both corrected; the 8/3 record carries the full before/after table.

   FIX: tools/bohemia_canon_measure.js GENERATES the measured rows off the live engine
   and the gate regenerates and fails if the file moved -- the "regenerating changes
   nothing" shape run_gate.js already uses. The rows cannot drift because nobody types
   them. 12 of 14 MEASURED off the running world, 2 declared unmeasurable with reasons.
   THE ANTI-VACUITY RULE is the real deliverable: every constant is MEASURED or
   EXEMPT-WITH-A-REASON, and W1 fails if one is in neither.

   [PENDING Paolo] THE COUNT IS RIGHT AND THE CONTENTS ARE WRONG, and only a
   non-numeric check could find it: the LOCKED law names RESOURCES / ELECTRICITY /
   CLOUT, the engine ships ELECTRICITY / MEDICINE / CLOUT. Ratcheted, not fixed
   (identities are CONTENTS-PAOLO'S). Mutation-proved the gate goes green the instant
   the engine renames it, so the ratchet does not block the fix.

   GATE: canon_constants_gate.js, 33 checks. Eleven planted mistakes, ten caught, one
   correctly ignored (the FIX). THREE of my own controls did not reproduce the failure
   they tested -- third turn running for that lesson. And W3 caught me: length is a bad
   proxy for substance, so an exemption must now NAME ITS OWN EXPIRY, and the rewritten
   check immediately failed on my own SECONDS_PER_STEP text. Fixed the text, not the check.

1z. [*** KILLED 8/7, SAME DAY IT SHIPPED — "That valheim sample was so dogshit". THE PAGE
   IS DEAD AND GRAVEYARDED. NO V2. NINTH lab deliverable killed, so the post-mortem is
   about the FORMAT: records/BOHEMIA_LAB_VALHEIM_BUILD_KILL_8_7_26.md. The RESEARCH he
   asked for survives and its sourced finding stands as a reference ruling. ***]
   LAB-10, COMMISSIONED BY NAME] VALHEIM'S BUILD SYSTEM, AND THE
   ANSWER IS AN ASYMMETRY RATHER THAN A BUILD MENU.
   Paolo 8/4: "Val Heim's build menu and it's build system to me was the easiest
   to work with among the games I've played it really felt like you could just
   set up fucking camp anywhere quickly like very quickly."
   THAT WAS RECORDED AS RESEARCH ON 8/4 AND THE PLAYABLE PAGE WAS NEVER BUILT.
   The lane's own law says an emulation is three or more named mechanics playable
   end to end; between 7/31 and 8/6 this lane shipped only .md files and gates. So
   the item was not a new question, it was the deliverable the last commission was
   still owed.

   THE FINDING, AND IT IS ONE DESIGN DECISION: a workbench needs A ROOF AND 70%
   COVER TO CRAFT and needs NEITHER to claim its build radius or to suppress enemy
   spawns. So the moment the bench touches bare dirt you already own the two
   properties that make a camp a camp. THE HOUSE IS AN IMPROVEMENT, NEVER A
   PREREQUISITE — you do not build a camp, you place one. Second finding:
   deconstruction refunds the full cost, so being wrong is free, so nobody
   hesitates, and HESITATION is what actually makes a build system feel slow.

   IT DOES NOT REPEAL HIS CLAUSE 11 (setting up camp takes time). Two different
   currencies: CHEAP IN TAPS, NEVER FREE IN TIME.

   PAGE (NOT IN A TAB, and by lab_gate clause 3 it never can be — no shipped
   surface may link a lab page):
   slices/lab/BOHEMIA_LAB_VALHEIM_BUILD_8_7_26.html — five mechanics, each loop  [DEAD, graveyarded 8/7/26]
   closing: building / crafting / deconstructing / upgrading / spawn suppression.
   Records: records/lab/BOHEMIA_LAB_VALHEIM_BUILD_TEARDOWN_8_7_26.txt +
   ..._PATTERN_NOTE_8_7_26.md
   GATE: lab_gate.js grew the row, 35 live checks (B0-B32) and learned the VB
   block. 573 pass / 0 fail.

   AND THEN I OPENED THE PNG AND FOUND FOUR THINGS 572 GREEN CHECKS COULD NOT SEE,
   including the two that matter most: THE WHITE CLAIM CIRCLE WAS NOT ON THE SCREEN
   AT ALL (the grid was too small to hold a 20 m radius, and "the claim draws
   itself" is one of the five findings), and THE PLAYER WAS INVISIBLE (its marker
   computed to minus one pixel wide after the cell size changed). Also: I had
   already "fixed" the undersized grid the WRONG WAY EARLIER THE SAME TURN by
   changing the check instead of the board. FIX THE TARGET, NOT THE RULER. B31/B32
   now measure pixels, because nothing did.

   TWENTY OF ITS CONSTANTS ARE GENUINELY SOURCED, the most of any row in the file,
   because the build system is the part of Valheim ValheimPlus patches hardest.
   AND IT CORRECTED OUR OWN RECORD: BOHEMIA_RESEARCH_VALHEIM_BUILD_FEEL_8_4_26.md
   filed the 20 m radius and the visible white circle as "wiki, not code". Both
   are SOURCED, by two adjacent lines of CraftingStation.cs that assign the
   circle's radius FROM the build range. A claim filed as unverifiable is a claim
   nobody went back and tried.

   TEN PLANTED MISTAKES, TEN CAUGHT, and two of them are the whole lesson: one
   mutation stayed green because it broke the wrong line (a control that does not
   reproduce the failure proves nothing), and one crashed the gate at check 8 of
   32 so the three checks that measure the actual finding never ran and could not
   be shown to catch anything. Both written up in the teardown. The mutation
   HARNESS was also broken first time out — it reverted with git checkout on an
   untracked file, so eight mutations stacked and every result after the first was
   garbage that still printed as a clean table of FAILs.

   [PENDING Paolo] he plays it and rules. Whether Bohemia's camp is one object or
   a small set; how many taps "quick" means; whether we draw the circle at all;
   the refund rate; every number. Routed to COMBAT (owns the camp) and RUN (owns
   the surface); this lane ports nothing.

1w. [MY OWN FIX WAS INCOMPLETE, AND MY OWN GATE SAID GREEN — 7/31]
   THE DEAD MECHANIC WAS STILL LIVE IN THE MORE AUTHORITATIVE FILE.
   This morning I struck the upkeep/bankruptcy clause in laws/BOHEMIA_ADDENDUM_
   CITYBUILDER_MODEL_7_1_26.md and gated it. Went looking for more of the same class and
   found it: *** laws/BOHEMIA_GDD_v4.md:74 STILL SAID "daily upkeep on everything
   (overbuild past income and you bankrupt)", VERBATIM, AS LIVE RULE. *** The GDD v4 is
   held LIVE by CLAUDE.md and by gates/gdd_gate.js, which makes it MORE AUTHORITATIVE
   than the addendum I had struck. So the contradiction I "fixed" was still on the books
   in the file a session is likelier to read, and EARNED NOT AFFORDED reported 19/0.
   ROOT CAUSE, and it is the useful part: MY GATE SWEPT CODE, NOT PROSE. It walked
   engine/ and slices/ hunting an IMPLEMENTATION of upkeep and never asked whether
   another LAW still asserted it. *** A CONTRADICTION LIVES IN PROSE BEFORE IT EVER
   REACHES CODE. Sweeping only code catches it after somebody has already built the wrong
   thing. *** That is the lesson for every gate in this repo that guards a ruling.
   FIXED: the GDD v4 line is struck in place with the supersession named and a note
   saying it was missed on the first pass. And the gate grew PART C2/C3: it now sweeps
   ALL 385 laws/ and records/ files for the mechanic asserted as LIVE, treating a
   struck-through or DEAD-marked line as correct (the words must stay visible with a line
   through them) and real-world prose as history, not a mechanic -- "the telecoms went
   bankrupt" in the emerging-tech research is correctly not a violation, which is the
   word-versus-thing distinction working for once. C3 checks the GDD v4 master
   specifically, since it outranks the addendum. 21 checks now.
   Two mutations caught: un-striking the GDD v4 clause (the exact bug that shipped), and
   a law asserting it fresh.
   THE GENERAL FINDING FOR OTHER LANES: if your gate guards a RULING, sweep the LAWS.
   One accidental read this morning found a live contradiction; one deliberate look found
   a second instance of the same one, in a bigger file. There are 312 law files and 385
   canon documents. Assume there are more of these.
1v. [NOTES ONLY 7/31 — NOTHING BUILT, ON HIS INSTRUCTION] HIS TWO CRISIS RESPONSE
   FRAMES, AND ONE OF THEM CONFLICTS WITH OUR OWN LOCKED LAW.
   Paolo sent two screenshots of a ragdoll: "i dont need you to recreate this one. Just
   important notes you might have seen". So: notes, nothing built, ragdoll module never
   opened. It is already BUILT and LOCKED by ANIMATION/CHARACTER
   (laws/BOHEMIA_ADDENDUM_ANIMATION_AND_RAGDOLL_6_29_26.md).
   Appended to records/BOHEMIA_RESEARCH_CRISIS_RESPONSE_VIOLENCE_7_31_26.md. Six notes:
   (1) *** THE DARKNESS DOES THE WORK, AND IT IS THE WHOLE "NOT GORY" TRICK. *** Both
   frames are nearly silhouette; if there is blood I cannot see it. The violence reads
   as SHAPE, so the trauma survives and the gore never arrives. WE ALREADY OWN THIS --
   CLUSTERED POWER (~12% lit), LIGHT=TERRITORY, nobody patrols the dark. Our darkness is
   already canon and is already the gore suppressor. Nobody had connected those.
   (2) VALUE NOT COLOUR makes a body readable in the dark -- the only parseable thing in
   either frame is the pale shirt. A wardrobe note as much as a lighting one.
   (3) The DROPPED WEAPON is its own object, clear of the hands in both frames. Says
   "finished" with zero gore.
   (4) SPEECH IS A PLAIN CAPTION, not a bubble: "Drop your weapons and come out!" white
   on black, no portrait, no styling. That is the delivery mechanism for the screaming
   and begging he wants, and it costs nothing. Also note it is a DEMAND -- the loud part
   of that game is negotiation.
   (5) *** THE ANTI-REFERENCE, AND THE MOST IMPORTANT NOTE: THE CAMERA. *** Crisis
   Response is a SIDE-SCROLLER and both frames are flat side-on. The 45 DEGREE ART LAW
   mandates three-quarter, and our ragdoll law says "Falls respect all 8 facings... this
   is WHY the 8 directions exist". A side-scroller ragdoll has ONE facing. THE REGISTER
   PORTS, THE GEOMETRY CANNOT. Anyone treating these frames as an ART target instead of
   a FEEL target ships a flat side-on death and breaks a locked law. GATED (B5).
   (6) A TENSION WITH OUR OWN LOCKED RAGDOLL, FLAGGED NOT DECIDED: frame 2 shows a body
   LAUNCHED -- airborne, fully extended, limbs trailing. Our locked direction is the
   opposite register: "a real body, not rubber. Weighty, stiff joints, falls and settles
   like a corpse", with "don't go overboard" written in. Two different feels. FLAGGED FOR
   ANIMATION/CHARACTER -- and deliberately NOT bounced to Paolo, because that lane has a
   BUILT, verified-settling Verlet ragdoll to compare against first. Asking him before
   somebody looks at the live thing would be the settled-question failure again.
   GATE: traumatic_gate.js grew B5/B6/B7 (27 checks now) so the anti-reference warning,
   the flagged-not-claimed tension, and "nothing was built" cannot be edited out. Three
   mutations caught. Two of my mutation attempts were case-sensitive and passed a working
   check -- worth remembering that a WEAK MUTATION LOOKS EXACTLY LIKE A ROBUST CHECK.
1u. [RESEARCHED + LAWED + GATED 7/31] CRISIS RESPONSE, AND WHY VIOLENCE IS TRAUMATIC.
   Paolo: "Look up crisis response its a flash game right now let me know what you find
   the shooting and death effects are brutal people screaming theyll beg and shit its
   really how I want the violence to me it doesnt have to be gory but I do want it to be
   traumatic fr"
   THE FINDING: *** VIOLENCE IS TRAUMATIC WHEN IT MAKES WORK AND COSTS YOU SOMETHING. IT
   IS GORY WHEN IT JUST LOOKS WET. TWO DIFFERENT DIALS, AND MOST GAMES ONLY HAVE THE
   SECOND. *** Crisis Response is disturbing for two reasons and NEITHER IS AN ART
   DECISION: (1) "the least possible loss of life as the desired outcome" -- the goal is
   NOT to kill, which inverts the incentive of a shooter, so every trigger pull is a
   failure you CHOSE rather than a score you farmed; (2) "once someone is hurt the player
   will be working against the clock to save them" -- A HURT PERSON IS A CLOCK, NOT A
   CORPSE. The shot does not resolve when the body falls, it OPENS A TASK. Third, the
   mechanism under the feeling: it simulates PULSE, BREATHING and BLOOD OXYGEN, so the
   body is a legible system you watch fail -- gore is a texture, a falling pulse is a
   story with an ending you can see coming.
   WHY IT IS EXACTLY HIS BRIEF: all three work at ZERO GORE. A pulse falling, a scream
   that stops mid-breath, someone begging before you decide -- not one red pixel needed.
   The two tools he named himself (screaming, begging) are not visual at all.
   *** AND WE ALREADY BUILT HALF OF IT TODAY. *** The bleed trigger
   (records/BOHEMIA_BLEED_TRIGGER_ANSWER_7_31_26.md) and mobile-camp clause 8 (the camp
   is the medical station, a COMPANION pulls the bullet out) ARE the clock and the work.
   Bohemia had the aftermath machinery ruled and no stated reason it mattered. Crisis
   Response is the argument that THE AFTERMATH IS THE TRAUMA.
   LAW: laws/BOHEMIA_ADDENDUM_TRAUMATIC_NOT_GORY_7_31_26.md, five clauses. Gore is
   PERMITTED, never the MECHANISM -- this is a register, not censorship.
   RESEARCH: records/BOHEMIA_RESEARCH_CRISIS_RESPONSE_VIOLENCE_7_31_26.md
   HONEST LIMITS, and they are the reason to read the record rather than trust me: EVERY
   PAGE ABOUT THE GAME 403'd (indiedb twice, kongregate), so this is built on search
   summaries, not pages I read. I HAVE NOT PLAYED IT AND HAVE NOT SEEN A FRAME. On the
   screaming and the begging HIS DESCRIPTION IS THE PRIMARY SOURCE AND MINE IS HEARSAY --
   I could not confirm the audio design at all. And there is a NAME COLLISION I could not
   resolve: Crisis Response on IndieDB/ModDB (slug blood-bullet, ericoshow on itch.io)
   versus a Kongregate dev "CRISISgames" whose games are Madness Tactical and Dark
   Mansion. Cannot confirm they are the same. The gate FAILS if that honesty is edited out.
   GATE: gates/traumatic_gate.js (TRAUMATIC, 24 checks). It does NOT try to measure
   trauma -- only he can say whether a moment lands. It checks the two things a machine
   can: the law is intact with its pendings still pending, and GORE IS NOT THE MECHANISM
   on any shipped surface (156 swept: no damage scaled by gore, no score or reward keyed
   to kills or brutality). Four mutations caught.
   TWO BUGS IN MY OWN CHECKS AGAIN, both fixed with the reason in the source: (a) A2
   failed on his own quote because it is a multi-line MARKDOWN BLOCKQUOTE and collapsing
   whitespace left the "> " markers embedded mid-sentence -- EIGHTH time this repo has
   assumed prose is flat, so the shape is now STRIP THE MARKUP THEN COLLAPSE; (b) the
   pending-check used a flat character window and passed a filled-in pending because the
   NEXT bullet's [PENDING Paolo] fell inside it. TWO GATES IN ONE TURN WITH THAT SAME
   WINDOW BUG, so both are fixed the same way -- SCOPE A PER-ITEM CHECK TO THE ITEM.
   FLAGGED, NOT DECIDED: COMBAT owns the implementation. ART -- the 20 approved GORE
   OVERLAYS (thumbed UP, zero consumers, held for story placement) are HIS art and HIS
   to place; "doesn't have to be gory" bears on them but does not retire them
   [PENDING Paolo]. NON-COMBATANTS in a fight [PENDING Paolo] -- the biggest consequence
   of this register, since Crisis Response's whole engine is people who must not be shot.
   How a body's state is SHOWN [PENDING Paolo]. NO DAMAGE BEFORE THE DIAL.
   THE ONE THING I WANT FROM HIM: WHERE HE PLAYS IT. Every page 403'd; he has the actual
   game. With a reachable copy this becomes a real emulation instead of a research note.
1t. [BUG FOUND + FIXED + GATED 7/31] TWO LIVE LAWS WERE CONTRADICTING EACH OTHER, AND
   READING BEFORE BUILDING IS WHAT FOUND IT.
   Paolo 7/31: "VALHEIM PROJECT ZOMBOID FALLOUT NEW VEGAS WITH POCKET CITY 2 ONTOP OF IT".
   Pocket City 2 was ALREADY LOCKED as the city-builder base on 7/1/26 -- he was naming
   the whole stack, not adding a reference. So the first move was to go read that
   addendum, and it turned out to CONTRADICT his own 7/31 law.
   THE BUG: laws/BOHEMIA_ADDENDUM_CITYBUILDER_MODEL_7_1_26.md required "Daily upkeep on
   everything... Overbuilding past your income bankrupts you. This is the discipline that
   makes the city-builder a real economy and not a paint tool." laws/BOHEMIA_ADDENDUM_
   TEN_YEARS_COLD_7_31_26.md clause 2 bans economic gameplay as a CATEGORY. CLAUDE.md:
   a contradiction between two live files is a BUG, not an interpretation choice.
   RESOLVED, newest date wins: laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md.
   Upkeep, income and bankruptcy are DEAD, struck through IN PLACE in the 7/1 file so a
   reader who opens only that one cannot act on a dead clause. Everything else in the
   7/1 addendum stands (zone-don't-hand-place, road/power/water access, demand signals,
   act-gated buildings, buildings anchoring quests, everything can genuinely be rubble,
   the mayor arc).
   THE REPLACEMENT, and it is GROUNDED IN THE REFERENCE rather than invented: *** BUILDINGS
   ARE EARNED, NOT AFFORDED. *** Researched 7/31 -- in Pocket City 2 buildings unlock by
   levelling, quests, City Competitions, Hard/Expert difficulty and new biomes, and "there
   are no microtransactions, all unlockable items are earned through gameplay". MONEY
   EXISTS IN THAT GAME AND IS NOT THE GATE ON PROGRESSION. Our own 7/1 addendum already
   said it and then buried it under the upkeep clause.
   AND THE STACK COLLAPSES INTO ONE LOOP. Pocket City 2 also tracks a "Relation rating
   with institutions and citizens" -- the SAME AXIS as New Vegas standing, which LAB-09
   already modelled. So the four references were never four systems: you do things -> you
   earn standing and capability -> the city grows -> the grown city makes you worth more
   to deal with. Valheim supplies the only rising curve, Zomboid supplies the dead
   utilities, New Vegas supplies the currency, Pocket City 2 supplies the unlock gate.
   GATE: gates/earned_not_afforded_gate.js (EARNED NOT AFFORDED, 19 checks). Proves the
   dead clause is struck in place and points at its successor, that the rest of the 7/1
   law survives, that NO SHIPPED SURFACE implements upkeep/income/bankruptcy (156 swept),
   and that the three pendings are not quietly filled in. Four mutations caught.
   TWO BUGS IN MY OWN CHECKS, both fixed with the reason in the source: A7 failed on
   hard-wrapped prose ("there are no\nmicrotransactions") -- SEVENTH time this repo has
   assumed prose respects line endings, so prose is now whitespace-collapsed ONCE for the
   whole file instead of per-check; and D1 built a regex with [^\n]* against text that
   had just been collapsed, so it matched the entire document and every pending "passed"
   regardless. Found only by mutating a pending and watching the gate stay green. A CHECK
   YOU HAVE NOT SEEN FAIL IS NOT A CHECK.
   STILL HIS: what each act's buildings cost in effort/quests/standing (a cost TABLE is
   canon, same as the action-cost table); the building catalog; the zone naming; and the
   one real hole this opens -- WITHOUT UPKEEP, HOW DOES NEGLECT BITE? "Everything can
   genuinely be rubble" is locked and needs a mechanism that is not money.
   Added to records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md (21 settled questions now).
1s. [LAWED + GATED 7/31] I ASKED HIM TWO SETTLED QUESTIONS IN TWO TURNS. THERE IS NOW A
   GATE FOR THAT. (Read this before writing a JUDGE THIS list, any lane.)
   Paolo: "BROTHER FOR BOHEMIA ITS NOT A ONE LIFE RUN IVE ANSWERED THIS LIKE 50 TIMESS!!!!!"
   THE RULING: Bohemia is a DYNASTY -- three generations (Animal/Human/Angel) across ~100
   years, dynasty saves spanning all three, heirs inheriting the choice log, companions do
   not die (permadeath is an anti-feature). "Roguelite" is the run structure, not a wipe.
   Progress CARRIES. It was already in FIVE law files before he had to repeat it.
   THE FAILURE, and it is mine twice running: I asked "does a utility disappear or get an
   owner" (settled by CLUSTERED POWER + LIGHT=TERRITORY) and then "what happens to
   standing when the run ends". The autonomy doctrine demands a JUDGE THIS list every
   turn and NOTHING IN THE MACHINE CHECKED WHETHER THE QUESTIONS WERE REAL.
   LAW: laws/BOHEMIA_ADDENDUM_NEVER_ASK_A_SETTLED_QUESTION_7_31_26.md. Clause 1 is the
   dynasty ruling. Clause 2 extends NOTES ARE RULINGS one step: never make him
   re-confirm his own LAWS, only his words. Clause 3 makes adding a registry row a
   SAME-TURN obligation whenever he rules anything.
   INDEX: records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md, 18 settled questions, each with
   the file that rules it and a one-line answer. Covers the dynasty, the dead utilities,
   ten-years-cold, no economy, three currencies, action time, loot, no PRs, the dead
   Act-1 world, and who judges art. MECHANISM-MINE/CONTENTS-PAOLO'S: a row without a
   citation is not a row.
   GATE: gates/answered_gate.py, registered as ANSWERED. 13 checks, 146 files swept.
   Proves every row cites a file that EXISTS, then sweeps the handoff + backlog +
   records/ for QUESTION-SHAPED text (a '?' inside an asking context, so the laws and
   the index can state these topics in order to ban them). A settled question FAILS THE
   BUILD. Two mutations caught: a settled currency-count question planted in a
   WAITING ON HIM block, and a row citing a deleted law. (The description here is
   deliberately paraphrased -- writing the planted question out verbatim made the gate
   flag my own backlog, which is the gate being RIGHT. It cannot tell a session asking
   from a session recounting, and loosening it to tell the difference would reopen the
   hole. Paraphrase is the cheap correct fix.)
   *** IT CAUGHT THE OFFENDING LINE IN MY OWN HANDOFF ON ITS FIRST RUN. *** And then its
   own first draft made this repo's SIXTH word-versus-thing error -- grepping for the
   phrase and failing on the paragraph EXPLAINING the withdrawal. A gate written to fix
   a discipline failure committing the exact class of error it was written about. Both
   recorded in the gate's source. MATCH THE STRUCTURE, NEVER THE MENTION.
1r. [KILLED + LAWED + REPLACED 7/31] I BUILT THE PREQUEL. HE CORRECTED ME. THE
   CURRENCY IS STANDING, NOT MONEY.
   Paolo 7/31: "IM CONFUSED BY YOUR QUESTION THE WHOLE POINT OF THE GAME IS THAT IT
   STARTS TEN YEARS AFTER THE ECONOMIC CRASH BRO WTF LIKE I DONT WANT IN THE GAME U
   GOTTA BE DEALING WITH SOME WEIRD ECONOMIC GAMEPLAY THE WHOLE WORLD IS BASED ON THE
   UTILITY DYING EVERYWHERE WHAT DO YOU MEANN modern economic crash valheim project
   zomboid FALLOUT NEW VEGAS THAT ALSO DOUBLES AS A CITY BUILDER COOK IT UP"
   WHAT I GOT WRONG: LAB-08 simulated the crash HAPPENING in a game that opens ten
   years after it ended. Every number was real and sourced and none of it mattered --
   THE PLAYER WAS NOT THERE. And I ended that turn asking him whether a dead utility
   should "disappear or get an owner", A QUESTION HIS OWN CANON HAD ANSWERED TWICE
   (CLUSTERED POWER: the lit 12% is OWNED; LIGHT=TERRITORY). I had read those as
   atmosphere when they were the infrastructure ruling, already complete.
   LAW: laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md, three clauses. (1) the crash
   is BACKSTORY, nothing ever simulates it happening; (2) NO ECONOMIC GAMEPLAY as a
   CATEGORY -- exchange rates, inflation, prices that move on a clock, withdrawal
   caps, banks, any market the player reads; (3) the utility is DEAD EVERYWHERE
   already, not a timer. Plus a BOUNDARY paragraph added after my own gate falsely
   failed engine/bohemia_purse.js: WHAT IS BANNED IS A PRICE THAT MOVES BY ITSELF, NOT
   A PRICE THAT EXISTS. The purse's empty [PENDING Paolo] PRICES table is
   MECHANISM-MINE/CONTENTS-PAOLO'S done right. A tag is fine, a market is not.
   KILLED: slices/lab/BOHEMIA_LAB_THE_CRASH_7_31_26.html, deleted + graveyarded, with a
   post-mortem (records/BOHEMIA_THE_CRASH_KILL_7_31_26.md) naming three root causes:
   I built the prequel (the repo's own word for the setting is POST-economic-
   apocalypse, in CLAUDE.md's first paragraph); I asked him to re-decide settled canon
   (the NOTES ARE RULINGS failure one step earlier -- never ask him to re-confirm his
   own LAWS); and 491 GREEN CHECKS SAID NOTHING, because every one verified the page
   did what its record said and none could ask whether it should exist. Its two records
   survive marked DEAD (Zomboid precedent). NO V2. Its one CONFIRMED finding -- a dead
   utility has an OWNER -- is load-bearing in the law that killed it.
   THE RULE I TOOK OUT: before researching a system, NAME THE YEAR THE PLAYER IS
   STANDING IN. Two of three root causes die to one sentence at the top of the work.
   SHIPPED INSTEAD (LAB-09, NOT IN A TAB -- a lab reference surface):
   slices/lab/BOHEMIA_LAB_TEN_YEARS_COLD_7_31_26.html
   THE FINDING: *** TEN YEARS COLD, MONEY IS NOT THE CURRENCY. STANDING IS. *** And New
   Vegas works because FAME AND INFAMY ARE TWO SEPARATE COUNTERS THAT NEVER CANCEL --
   which is why it has words no other game has (WILD CHILD, DARK HERO, SOFT-HEARTED
   DEVIL), titles that exist only because the game refused to average you out. ONE
   SLIDER IS A STAT. TWO COUNTERS IS A PERSON. Proved in play: one repeated deed walks
   your title through three names while NEITHER NUMBER EVER FALLS.
   THE CITY-BUILDER HALF, which is what he was pointing at: *** YOU DO NOT BUILD TO GET
   RICH, YOU BUILD TO BECOME SOMEBODY THEY HAVE TO DEAL WITH. *** With money banned a
   building cannot pay you, so what it does is make you worth dealing with, compounding
   across the acts under the CENTURY RULE. The builder is not a mode bolted to an RPG,
   it IS how you earn standing. And Valheim's comfort curve gets a second job: standing
   WEIGHT, because a nobody's favour is worth less than a somebody's.
   THIRD FINDING: their thresholds are per-faction and wildly unequal -- Brotherhood
   accepts at 3, Legion idolises at 100. The cheapest door costs 3 and the dearest 100.
   That is how you make a small faction matter WITHOUT buffing it. And the hard gate:
   idolized needs fame >=90 AND infamy <4 -- YOU CANNOT BUY YOUR WAY OUT OF A BAD NAME
   WITH GOOD DEEDS.
   SOURCED, and it is better than a number: xNVSE/NVSE GameData.h:6 + :228 --
   `class TESReputation;` and `tList<TESReputation> reputationList;`. Real open-source
   C++ proving REPUTATION IS A FIRST-CLASS GAME DATA LIST in New Vegas, not a quest
   variable. The SHAPE is sourced even though the values are [DOC]. Six failed probes
   listed by URL.
   GATES: lab_gate.js grew the row + 19 live checks (Y0-Y18) + 4 forbidden-CATEGORY
   checks (Z1-Z4), 486 checks 0 fail. NEW: gates/ten_years_cold_gate.js, registered as
   TEN YEARS COLD, 26 checks, and its Part C SWEEPS ALL 156 SHIPPED SURFACES for the
   banned category -- because a banned CATEGORY needs a sweep, not a paragraph. Six
   mutations caught (clause dropped, dead page resurrected, engine grew a moving price,
   a fourth currency, the answer page grew an exchange rate, a dead record un-marked).
   FOUR FALSE POSITIVES I FIXED IN MY OWN CHECKS this turn, and the pattern is now
   named five times over in this repo: a check that hunts a WORD instead of a THING.
   Y18 tripped on costToAccepted (the cost of RESPECT), the sweep tripped on the word
   "devaluation" in a comment explaining what died, and it FAILED ANOTHER LANE'S
   CORRECT MODULE. That last one is the one to remember.
   BOUNDARY: A PEOPLE LANE WAS REGISTERED ON MAIN THIS TURN owning dialogue, NPC
   identity, FACTION STANDING and companion social. Standing is THEIRS. This page is a
   reference surface, touches none of their code, claims nothing, and the pattern note
   names them. FLAGGED, not handed over. NO ECONOMY on the page by law; THREE
   CURRENCIES untouched.
   OPEN, and I could not answer it: IN A ROGUELITE, WHAT HAPPENS TO STANDING WHEN THE
   RUN ENDS? Biggest question the page raises and does not settle.
   NEXT WORTH STUDYING (flagged, not claimed): New Vegas's endgame territory
   redistribution -- who ends up owning the dam -- the most relevant NV mechanic to a
   100-year city-builder.
1q. [SHIPPED 7/31 — LAB-08 — *** KILLED THE SAME DAY, SEE 1r ABOVE ***] THE MODERN ECONOMIC CRASH, FUSED. AND THE FINDING IS THAT
   OUR POWER LAW AND OUR ECONOMIC COLLAPSE ARE THE SAME LAW.
   Paolo 7/31, four words: "modern economic crash valheim project zomboid cook it up".
   THE FINDING: *** BOTH GAMES MODEL A UTILITY *VANISHING* ON A TIMER. REALITY MODELS IT
   GETTING AN *OWNER*. *** Zomboid flips the power off on day 14 and that is the end of
   the story -- the grid is a boolean that flips once and never flips back. What actually
   happened in Lebanon is that the state grid fell to about FOUR HOURS A DAY and private
   generator cartels sold you the other SIX AND A HALF, by the AMPERE, for OVER $100 A
   MONTH, priced in hard currency while wages were in the money that was dying. The
   utility was not deleted, it was privatised at gunpoint. A boolean is not a decision;
   an owner is. AND WE ALREADY HALF-HAVE IT: CLUSTERED POWER (12% lit, OWNED, network
   eerily perfect) + LIGHT=TERRITORY were written as ATMOSPHERE, and Lebanon is the
   evidence they are ECONOMICS. THE CLAIM: those are one law and we treat them as two.
   SECOND FINDING: every curve in a collapse falls on a clock you do not control; the only
   one that rises is the one you built. That is Valheim's comfort, and it is why the
   fusion fuses -- the crash supplies the falling curves, Valheim the only rising one.
   THIRD FINDING, and no game models it: THE FREEZE. Games model being broke as an empty
   wallet. Reality's version is worse -- the money is RIGHT THERE, yours, on a screen with
   your name on it, and you may have 60 euros of it today. Measured on the page: under
   Lebanon's ~$400/month cap a 20,000 balance takes 50 MONTHS to extract, by which point
   it is worth 1.7%. YOU CANNOT WIN THE RACE. That is what "essentially frozen" means in
   a sentence a player can feel.
   PAGE (NOT IN A TAB — a lab reference surface; lab_gate clause 3 forbids the alpha from
   linking it): slices/lab/BOHEMIA_LAB_THE_CRASH_7_31_26.html — five mechanics end to
   end: the money dies / the freeze / the grid dies / the cartel / comfort.
   WHAT I DID NOT BUILD, AND IT IS THE MOST IMPORTANT LINE HERE: ZOMBOID'S LOOT. He said
   "project zomboid" and the lazy reading is to go back to the containers. Two loot
   emulations died in two days and laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md
   makes Zomboid a PERMANENT ANTI-REFERENCE for loot pace; under STOP PRODUCING, finding a
   legal way to ship a killed feature IS the violation. So this row took the one thing
   Zomboid has that is not loot and is world-class: THE UTILITY SHUTOFF TIMER.
   *** AND THAT BAN IS NOW MACHINE-ENFORCED. New gate checks C1/C1b/C2 prove the row did
   not quietly reopen loot (matched as a STRUCTURE -- container tables, roll counts,
   per-item search time -- never a mention, since the record is REQUIRED to discuss loot
   in order to ban it), and C2 proves no fourth currency was added. Everything else in
   lab_gate tests what a page DOES; this is the first check that tests what it was
   FORBIDDEN to do. Without one, the STOP PRODUCING law had no machine behind it at all. ***
   REUSE-FIRST APPLIED TO FINDINGS, not just pixels: the Valheim comfort numbers were read
   out of our own LAB-05 teardown rather than re-researched, including which are SOURCED
   and which are DOC. And I checked records/BOHEMIA_ECONOMIC_APOCALYPSE_SCOPE_RESEARCH_
   7_28_26.md FIRST -- it already owns the MACRO half (72-hour shelf, letters of credit,
   trade routes), so this page is deliberately the DAILY-LIFE half and they do not overlap.
   NUMBERS: 8 SOURCED (7 from a real apocalypse_SandboxVars.lua -- WaterShut/ElecShut = 2,
   both modifiers = 14, DayLength, Zombies, StartMonth; plus the one Valheim line we own),
   the rest [DOC] and tagged: Lebanon (peg 1507.5 held 22 years -> official 89,500 on
   15 Feb 2024, >98% gone, bank assets $217bn -> $104bn, ~$400/mo cap, 4 h state power,
   5A / 6.5h / $100+ a month), Greece 2015 (60 EUR/day per card), Argentina 2001 (250
   pesos/week, later 300), and the hyperinflation record expressed as DOUBLING TIME
   (Weimar 3.7 days, Zimbabwe 24.7 hours, Hungary 1946 fifteen hours, Venezuela 80,000%/yr)
   because a percentage past a few thousand stops meaning anything to a human and "prices
   double every fifteen hours" is instantly horrifying -- that translation is a HUD lesson,
   not an economics one. Teardown lists all TEN failed source probes by URL.
   Records: records/lab/BOHEMIA_LAB_THE_CRASH_TEARDOWN_7_31_26.txt + ..._PATTERN_NOTE_...md
   GATE: lab_gate.js grew the row, 25 live checks (X0-X24) + the 3 forbidden-feature
   checks, and learned the CR block. 491 checks, 0 fail. EIGHT mutations caught: money
   never devalues, freeze cap removed, grid never dies, light cannot be bought back,
   ampere price frozen, comfort does not persist, comfort ceiling removed, and LOOT
   REOPENED.
   ONE REAL BUG THE GATE CAUGHT IN MY OWN MATHS: the devaluation curve was fitted over 60
   months of 30 days = 1,800 days, then queried at day 1,825, so it overshot the real
   Feb-2024 rate by 6%. Refitted per-day so the endpoint is exact. A calendar
   approximation inside a curve you then query with real dates is a bug, not rounding.
   Also fixed two things only a screenshot shows: the placeholder watermark was sitting on
   top of a card heading, and Lebanon's "400/month" was clipping off the right edge.
   THE ECONOMY IS NOT THIS LANE'S SYSTEM. WORLD is building the purse right now. This page
   touches no economy code, adds no price and no currency, and the THREE CURRENCIES law
   stands untouched (resources, electricity, clout, no fourth thing -- an "exchange rate"
   would be a fourth currency wearing a hat). FLAGGED FOR WORLD, not handed to it.
   TWO QUESTIONS, and the second is the real prize: (1) should the collapse be falling
   curves you cannot touch plus exactly ONE rising curve that is whatever you built?
   (2) when a utility dies in Bohemia, does it DISAPPEAR, or does it get an OWNER you
   have to deal with?
1p. [SHIPPED 7/31 — LAB-07, COMMISSIONED BY NAME] VALHEIM'S WEAPON TYPES, AND THEY
   TURN OUT TO ANSWER THE HOLE HIS OWN COMBAT AUDIT FOUND.
   Paolo 7/31: "look at the weapon types in valheim. valheim does weapon types really
   good so i like that. valheim i think is a top 5 game of all time the most we can suck
   from it the better."
   THE FINDING, AND IT IS BIGGER THAN A WEAPON LIST: VALHEIM'S WEAPON SYSTEM IS A
   DAMAGE-MULTIPLIER SYSTEM WEARING A WEAPON LIST AS A COSTUME. Almost nothing good
   about it is the damage printed on the weapon. It is FOUR MULTIPLIERS YOU EARN --
   know what you are fighting (up to 2x), stand behind it (3x, knives 10x), time a block
   (2x), have used the thing before (raises your floor) -- and the weapon's real job is
   deciding WHICH of the four you can reach.
   *** WHY IT IS A LANE DELIVERABLE AND NOT TRIVIA: his own north star
   (laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md) is "deal the most damage and
   take the least amount of damage by positioning and abilities and deeper understanding
   of mechanics", and his own audit
   (records/BOHEMIA_COMBAT_AUDIT_AGAINST_THE_NORTH_STAR_7_27_26.md) says in capitals
   "DEAL THE MOST DAMAGE BY POSITIONING -- NOT IMPLEMENTED AT ALL" and of the seven
   ability verbs "None of them increases your damage". HALF HIS SENTENCE HAS NO CODE
   BEHIND IT, and Valheim's four multipliers are that missing half one for one:
   resistance = deeper understanding, backstab = positioning, parry = what you spend,
   skill = the switching cost that makes the choice real. ***
   PAGE (NOT IN A TAB -- a lab reference surface, and lab_gate clause 3 forbids the
   alpha from ever linking it): slices/lab/BOHEMIA_LAB_VALHEIM_WEAPONS_7_31_26.html
   Five mechanics playable end to end: damage types / resistances / backstab / parry /
   weapon skill, as a TURN-BASED GRID encounter because that is Bohemia's language -- a
   real-time Unity clone would prove nothing about whether the idea survives translation.
   THE SIX IDEAS WORTH STEALING, ranked in the pattern note: (1) resistance is applied
   PER DAMAGE TYPE and only then armour on the total, so a split-damage weapon gets
   partial credit and "wrong weapon" is a TAX not a WALL -- the most portable idea here;
   (2) the matchups are physical intuitions (bones don't care about a hole, you cannot
   stab a puddle) so the table is LEARNABLE and you can guess a new enemy right; (3)
   SKILL RAISES YOUR FLOOR -- the ceiling is finished at level 75, so the last quarter
   of mastery buys only CONSISTENCY, which is how getting good actually feels; (4) one
   number can be a whole playstyle (knife 10x); (5) your DEFENCE choice sets your
   OFFENCE ceiling, and there are two roads to the same 2x (grind the 40% stagger limit
   or parry once); (6) NOBODY IS WEAK TO SLASH -- the default weapon has no matchup to
   exploit, so the generalist is never optimal and never wrong.
   MODEL, NOT A MEASUREMENT (Valheim is a compiled Unity DLL). Three numbers are
   genuinely SOURCED from real open-source C#: ValheimPlus/GameClasses/Skills.cs:101-122
   (the real SkillType enum -- Swords Knives Clubs Polearms Spears Blocking Axes Bows...,
   so A WEAPON TYPE IS A SKILL, not a stat block) and Player.cs:376
   (`item?.m_shared.m_skillType`, the one field the whole system hangs off). Everything
   else is [DOC] and tagged. Teardown lists all nine failed source probes by URL so the
   "no source" claim is checkable: records/lab/BOHEMIA_LAB_VALHEIM_WEAPONS_TEARDOWN_
   7_31_26.txt. Patterns + what not to port: ..._PATTERN_NOTE_7_31_26.md.
   GATE: lab_gate.js grew the row and 31 live checks (W0-W30) and learned the VW block.
   413 checks, 0 fail. Eight mutations caught: resistance ignored, backstab from
   anywhere, armour flattened, stagger removed, parry made a freebie, skill ceiling
   uncapped, all skills levelling together, and somebody made weak to slash.
   TWO REAL BUGS THE MACHINE CAUGHT IN MY OWN WORK, both fixed with the reason written
   into the source: (a) runtime bodies were hand-listed WITHOUT their resistance table,
   so resolveHit read enemy.mods[t] off undefined and ANY ATTACK WOULD HAVE THROWN --
   the live half caught it before it was committed, which is the whole argument for
   driving the page's own functions; (b) the proof screenshot backstabbed the seeker and
   a x10 knife DELETED it (165 into 110 hp), so the proof shot of the backstab mechanic
   contained no backstabbed creature. Found by looking at the rendered pixels. Also
   capped the grid cell at 44px after measuring the board eating 52% of the phone.
   COMBAT IS NOT THIS LANE'S SYSTEM. Under the parallel-sessions law this page touches
   no combat code and claims nothing. FLAGGED FOR COMBAT, not handed to it.
   NOTHING PORTED. NO DAMAGE BEFORE THE DIAL -- there is not one Bohemia damage number
   on that page. Bohemia's weapon types, resistance table and positional damage term are
   all [PENDING Paolo] and all three are COMBAT's to build.
   THE ONE QUESTION: is EARN-YOUR-MULTIPLIER the shape -- a new weapon changes which
   multipliers you can reach -- instead of a ladder where a new gun prints a bigger
   number?
1o. [RULED + LAWED + GATED 7/31] THE ACTION COST SHAPE IS CANON, AND THE BLEED
   TRIGGER IS ANSWERED.
   Paolo 7/31, on the CDDA page: "And sure the time cost shit sounds good." Under
   NOTES ARE RULINGS that IS the verdict, so it became law the same turn:
   laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md. Six clauses: (1) an
   action's cost is FIXED; (2) it is denominated FINER than the clock; (3) your
   CONDITION is the divisor, never a second cost; (4) the divisor has a HARD FLOOR
   so the conversion has a HARD CEILING - a bad day can never become an infinite
   one; (5) THRESHOLDS, NOT SLOPES - under the line is free; (6) THE TWO CLOCKS STAY
   TWO (clause 17 of the camp law), recorded as a CHOICE so nobody later "fixes" it
   into one.
   STILL PENDING PAOLO, and the gate proves nobody filled them in: the DENOMINATION
   (clause 2 - the BEAT is the obvious candidate since everything already quantises
   to 120 BPM, but no lane picks it), the CEILING NUMBER (clause 4 - Cataclysm's is
   4x), and the ACTION LIST AND ITS COSTS (clause 4 of the time law, untouched).
   GATE: gates/action_cost_shape_gate.js, registered as ACTION COST SHAPE. 31 checks.
   Part A holds the law (six clauses matched by CLAIM not by number, so a
   renumbering cannot drop one; the three pendings must still read PENDING). Part B
   is the one that matters - THIS LAW READS LIKE PERMISSION TO GO BUILD A COST TABLE
   AND IT IS NOT, so it sweeps engine/ for a table STRUCTURE (never a mention - that
   mistake is now on this repo's record three times). Part C drives the lab page
   LIVE and makes all six clauses prove themselves in a real browser, so the law is
   evidence-backed rather than an opinion.
   Six mutations caught: a pending filled in, a clause dropped, the law growing its
   own table, an engine module starting one, the floor removed from the page, and a
   shipped surface linking the lab page. THAT LAST ONE EXPOSED A REAL BUG IN MY OWN
   GATE - B3 hunts a LINK from a shipped surface, shipped surfaces are HTML, and my
   walker only collected .js, so it passed a planted link. Fixed (ext is a parameter
   now) and the reason is written into the source.
   THE BLEED TRIGGER, his direct question ("How do we define when a charactwr takes
   blood loss"): records/BOHEMIA_BLEED_TRIGGER_ANSWER_7_31_26.md. ANSWER: BLEEDING
   IS A PROPERTY OF THE WEAPON THAT HIT YOU, NOT OF HOW MUCH HEALTH YOU LOST. Read
   off real code - monster.cpp:2445-2447, `if( du.type == damage_bullet ||
   du.type->edged ) make_bleed( source, 1_minutes * rng( 0, adjusted_damage ) );`.
   Four things fall out: the trigger is the damage TYPE (bullet, or cut/stab flagged
   `edged` in damage_types.json - bash pointedly is NOT, so blunt force never
   bleeds); severity is the damage that got PAST ARMOUR (creature.cpp:1552), which
   makes a jacket a medical decision in a game whose progression IS clothing; the
   roll STARTS AT ZERO so most grazes cost nothing; and it is per body part
   (`main_parts_only`). Their ladder is 40 intensities in five bands, Minor ->
   Heavy Arterial. Grounded in real trauma medicine: blunt trauma kills by breaking
   things inside you, penetrating trauma kills by opening vessels - which is why
   "was it sharp" is the first question and why a tourniquet is useless on a crush.
   MY RECOMMENDATION, three rules, shape not numbers: SHARP OR SHOT NEVER BLUNT /
   ONLY WHAT GOT PAST YOUR CLOTHES / MOST HITS DON'T. That third rule is also the
   answer to his older 7/27 question (do you always have to prevent blood loss after
   every fight): NO - and it is what keeps his own clause 6 true, that a player who
   does not care about the camp can still play.
   HONEST LIMIT recorded: monster.cpp:2445 is the MONSTER side of the hit, which is
   the path I read end to end; the player side routes through their JSON on-hit
   effects, which I did not fully trace. Said so rather than implying I read both.
   NOTHING BUILT. NO DAMAGE BEFORE THE DIAL. The numbers, the band count, the odds,
   and whether the companion's bullet extraction is what STOPS a bullet bleed are
   all his.
1n. [SHIPPED 7/31 — LAB-06, AND IT ANSWERS THE HOLE HIS OWN CORRECTION OPENED]
   WHAT AN ACTION COSTS: CATACLYSM: DDA, A REAL EMULATION OFF REAL C++.
   Paolo 7/28 (clause 17 of the mobile-camp law): "time will pass just by taking
   actions in this game and you really need to understand that sort of clock." He was
   right, and the moment he ruled it NOTHING IN THE REPO COULD SAY WHAT ONE ACTION
   COSTS. Clause 4 of laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md
   reserves the cost TABLE to him ("no lane invents an action-cost table"), so the
   legal move was not to write costs — it was to go get the best engineered answer that
   exists, with its real numbers, and hand him the SHAPE. Cataclysm: DDA was ranked #1
   of nine for exactly this question in records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_
   7_26_26.md, before it was needed, because it is the only open-source game on the
   shortlist that answers it.
   THE PAGE (NOT IN A TAB — it is a lab reference surface, reached by its own file, and
   by lab_gate clause 3 it may NEVER be linked from the alpha):
   slices/lab/BOHEMIA_LAB_CDDA_ACTION_COST_7_31_26.html — five mechanics playable end
   to end: action cost / condition / travel / errands / sleep debt.
   FINDING 1, and it is better than a table of minutes: AN ACTION'S COST IS FIXED, IN
   "MOVES" (calendar.h:289, 100 moves = 1 turn = 1 second). YOUR CONDITION CONVERTS
   MOVES INTO TIME. AND THE CONVERSION CAN NEVER EXCEED 4x, BECAUSE SPEED HAS A FLOOR
   (character.cpp:7652, their comment verbatim: "Speed cannot be less than 25% of base
   speed"). So the table stays stable, the FELT cost moves with how wrecked you are,
   and a bad day can never become an infinite one. The floor is the part to steal first.
   FINDING 2, straight onto his tile clock: A STEP IS AN ACTION, PRICED IN THE SAME
   CURRENCY (character.cpp:6022 run_cost(100,false); 6103 caps the bonuses so a step
   can never cost LESS than 100). Their walking and doing are ONE clock; ours are TWO
   on purpose (clause 17). That divergence is now CHOSEN rather than unexamined. Their
   WORST step is 4.00 s and our AVERAGE step is 3.52 s (clause 16) — a coincidence, but
   a useful one to feel.
   SMALLER PATTERNS: thresholds not slopes (weight free under your cap, character.cpp:
   7613; thirst free to 40, :7620) so a penalty arrives as a decision, not a drip; a
   skill that halves BAD ground only (Parkour, :6096); travel = base + rate (20 min +
   dist x 10, mission_companion.cpp:1358); an errand is a DECLARED BLOCK paid rate x
   hours (1/4/10/20 h at 3/4/5); and SLEEP DEBT'S FIRST RUNG IS TWO WHOLE DAYS
   (character.h:247) — one rough night is free, which agrees with his own clause 6 that
   ignoring the camp stays playable.
   Teardown, every one of 34 constants with a file:line printed from the fetched source
   this session: records/lab/BOHEMIA_LAB_CDDA_TEARDOWN_7_31_26.txt. It also OWNS that
   four of my first-draft citations were wrong by a few lines (written from memory before
   the files were fetched) and records the corrections.
   Patterns + what not to port: records/lab/BOHEMIA_LAB_CDDA_PATTERN_NOTE_7_31_26.md.
   GATE: gates/lab_gate.js grew the CDDA row (28 new live checks D0-D27) and learned
   .cpp/.h citations — its first C++ master. 332 checks, all green. Six mutations
   caught (floor removed, cost drifting with pain, travel divided by speed, early
   errand collect, first rung moved to one day, thirst turned into a slope). ALSO FIXED
   A REAL GATE BUG the CDDA note exposed: A24 (the no-port-claims check) was matching
   the DENIAL every honest note is required to write. Now it collapses whitespace,
   scopes the negation to the SENTENCE, and was mutated in BOTH directions — the
   sentence-scoping only got written because a planted real claim ("I wired it into the
   engine this afternoon") slipped past the first two attempts.
   NOTHING PORTED. Bohemia's action list and its costs remain [PENDING Paolo] by law.
   THE ONE QUESTION FOR HIM: is the SHAPE right — a fixed cost in a fine currency, your
   condition as the divisor, and a hard cap on how bad the divisor can get?
1m. [DONE 7/28 — TILE FORMS ORDER] FOUR FORMS FILED, AND THE FINDING THAT MOST LAB
   SURFACES MUST NEVER GET ART.
   Walked all five lab surfaces. FOUR are REFERENCE pages marked NOT BOHEMIA (Stardew
   x3, Valheim model) and are FORBIDDEN from consuming approved art by lab_gate clause
   3 — they need ZERO tiles, permanently. engine/bohemia_resolve.js is headless. Only
   BOHEMIA_LAB_MOBILE_CAMP_DIAL has real gaps, because its mechanisms are now canon law.
   SHOPPING FIRST CHANGED THE ASK (two findings worth reusing): pack "14. Camp and
   tents" has 18 UP tiles (2 REFERENCE-class per Paolo's "training data for quick
   tents", 4 BIG-flagged), so the camp is PARTLY COVERED and TF-LAB-001 says dress from
   pack 14 rather than re-draw it; and the approved FIRE/PARTICLE loops already cover
   the fire, so it is not an ask. Against that, THERE IS NO MEDICAL PACK IN THE 87-PACK
   CORPUS AT ALL (enumerated) — the cleanest gap on the board.
   FORMS: TF-LAB-001 the camp SET DOWN (backs board row 3, which was HIGH and formless);
   TF-LAB-002 the camp PACKED (clause 1's other half, nothing covered it — new row 10,
   HIGH); TF-LAB-003 field dressings (clause 8 — row 11); TF-LAB-004 the bullet kit
   (clause 8's companion-only role — row 12). Each carries real Vegas grounding (the
   storm-drain and drainage-canal camps: scavenged wood and metal under BLUE VINYL TARP,
   sun-bleached chalky; the shopping cart as the real transport unit), a named outside
   reference, and the anti-reference.
   HELD not formed, on purpose: H5 the supply pool's searched-container state (blocked on
   clause (a) and loot is a CLOSED subject); H6 friendly shelter looks (blocked on clause
   (k) and it is WORLD's district content — LAB flags, does not claim).
   NO ART COOKED. tileform_gate does not exist yet and is SHARED's per the form law, so
   I self-validated the four forms against the law's stated rules instead of building
   another lane's gate: 4 OK / 0 problems.
1l. [RULED 7/28 — CLAUSE 17, AND IT IS A CORRECTION OF ME] THE STEP CLOCK IS NOT THE
   DAY CLOCK. Paolo: "I'm glad you have that math, but that's just if you were
   walking... a lot of things in this game will take up time and time will pass just by
   taking actions... you really need to understand that sort of clock when you think
   about how long you get lifted up for your camp. It's just the amount of steps the
   buff makes you feel good for."
   WHAT I GOT WRONG: clause 16's arithmetic is right and he said so, but I wrote
   "9,216 steps = 9 hours of walking" and let it stand as if it described the player's
   DAY. It describes a player who only walks, and no such player exists in this game.
   THE LAW NOW: the BUFF burns on STEPS only (never time, actions, standing still or
   sleeping); the DAY burns on EVERY ACTION including walking. Both true at once.
   THE CONSEQUENCE FOR SIZING, which is why he pushed: a 9,216-step rest is NOT most of
   a day — it can span SEVERAL in-game days, because the day is eaten by everything
   else. So the camp is STRONGER in practice than the step number looks. And clause 2
   becomes load-bearing: a buff that burned on time would punish playing the game.
   FORBIDDEN NOW, ANY LANE: selling a step count as a duration of play without the
   "if you only walked" caveat; sizing a buff by "how much of a day is this"; any buff
   that ticks on the clock instead of on steps.
   ON THE PAGE: the caveat is on the crossing line, the buff says STEPS ONLY and no
   longer converts to hours, the HUD splits the day into walking vs doing things, and
   an unnamed SPEND AN HOUR ON SOMETHING button eats day and zero buff so the gap is
   playable. GATE: 138 checks, new C-series; making the buff tick on time reds five.
1k. [CALLED 7/27 ON HIS DELEGATION] 75% IS THE DRESSED CAMP, NOT THE BARE TENT.
   Paolo: "Do what you think is best." So the one open question on the rest number is
   closed as MY call, reversible by one word: a bare tent is 60% of a Vegas crossing,
   each thing carried and set down adds 5%, and the full kit of three brings it to
   exactly 75% = 9,216 steps = his number.
   WHY, third reason decisive: (1) otherwise comfort is decoration and comfort is the
   mechanism he loved; (2) the camp is MOBILE so "what did I carry" must be a real
   decision, which it only is if the kit earns the crossing; (3) IT PROTECTS HIS OWN
   TARGET AT THE TOP OF THE RANGE — with 75% as the bare camp, a dressed one reaches
   90% and nearly crosses, weakening the "you must stop once" he aimed at. Now even
   the best camp in the game falls 3,072 steps short.
   Gate S5 pins 60 + 3x5 = 75, S6 pins 9,216 steps, S7 proves a bare tent is strictly
   worse, S8 proves the DRESSED camp still cannot cross. Recorded in the law under
   "CALLED ON HIS DELEGATION".
1j. [RULED 7/27 — CLAUSE 16, THE SCALE IS SETTLED] ACROSS VEGAS IS 12,288 STEPS, AND
   ONE REST IS 75% OF IT. Paolo: "How many steps would it take in our scale of game
   to walk across Vegas with that math you want you need one rest to walk across 75%
   of Las Vegas". A question and a ruling in one line.
   THE ANSWER, entirely from our own files — nothing invented:
     96 cells across        engine/bohemia_overmap.js:20  OVER_N=96
     128 tiles per cell     engine/bohemia_world.js:613   var T = 128
     0.75 m per tile        engine/bohemia_overmap.js:20  CELL_M (SLOT SCALE LAW)
     -> 12,288 STEPS ACROSS VEGAS, cross-checked by laws/BOHEMIA_GDD_v5.md:37
        ("ONE UNBROKEN WORLD: 12288x12288 fine cells")
     -> 9,216 m = 9.2 km
     -> clause 3 (a day is across AND back) makes a step 3.52 s and a crossing 12 h
   HIS RULING THEREFORE = 9,216 steps = 6.9 km = 9 HOURS OF WALKING, and it lands
   exactly where he aimed it: YOU CANNOT QUITE CROSS LAS VEGAS ON ONE REST. You come
   up 3,072 steps short and have to stop once.
   THE UNIT CHANGED, WHICH IS THE DURABLE PART: a rest is no longer an absolute tile
   count, it is a PERCENT OF A CROSSING (REST_PCT, default 75 = his ruling), so the
   number survives any later rescale of the map. Comfort is PCT_PER_COMFORT on top.
   AND I OWNED A MISTAKE IN THE LAW RATHER THAN PATCHING IT QUIETLY: the previous
   dial page had REST_TILES capped at 120 and TILE_MINUTES at 18, both calibrated to
   that page's toy test map. At the real map size a step is 3.52 SECONDS, so 18
   minutes was 300x too slow. Corrected, and written into clause 16 as what it was.
   The clock dial is now SEC_PER_100_STEPS = 352, so 3.52 stays exact while the dial
   stays a whole number.
   ON THE PAGE: the HUD states the answer on its own face ("ACROSS VEGAS 12,288 steps
   (9.2 km, 12 h)"), the buff reads as a PERCENTAGE of a crossing plus steps plus
   hours, and there are WALK 100 / WALK 1,000 / CROSS VEGAS buttons because a 20-tile
   chip tells him nothing at real scale.
   GATE: gates/camp_dial_gate.js now 127 checks, with a new S-series that pins the
   scale to the engine's own constants so the answer can never drift from the world
   the game builds — including S8, which proves a bare rest comes up exactly 3,072
   steps short of the far side, and S9, which proves a slept camp makes it.
   Mutation-tested: making the valley 80 cells reds six checks; quietly moving his 75
   to 50 reds five.
   [PENDING Paolo], and it is now the ONLY open question on the rest number: IS 75%
   THE BARE CAMP OR A DRESSED ONE? The page treats it as bare and adds comfort on
   top (three things = 90%). Both readings are one dial apart and nobody picks it.
1i. [RULED 7/27, SECOND MESSAGE — THE CAMP LAW GAINED CLAUSES 11-15] TIME, THE ACT
   CURVE, THE COMBINED BUFFS, AND HIS BLOOD-LOSS QUESTION.
   Law amended in place: laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md
   (AMENDED THE SAME DAY section, his words verbatim).
   11. SETTING UP CAMP COSTS TIME. "SETTING UP CAMP TAKES TIME." That cost is what
       makes camping a decision instead of a habit.
   12. EVERY CAMP BUTTON SPENDS IN-GAME TIME, IN REASONABLE AMOUNTS. "OBIOUSLY
       HANGING OUT TAKES UP TIME AS WELL. TIME PASSES BY REASONABLE AMOUNTS WHEN U
       PRESS THESE BUTTONS." SO THERE ARE NOW TWO CLOCKS AND THEY ARE NOT THE SAME:
       buff duration burns in TILES (clause 2), camp actions spend the world's
       CLOCK. Standing still still burns neither.
   13. THE ACT SCARCITY CURVE — the first ruled mechanical difference between the
       three acts. ACT 1: almost no friendly shelter, one homie's house you have to
       HOOF IT to, so the mobile camp is needed most. ACT 2: a little more. ACT 3:
       hotels and hangouts where you can just hang out. The camp is an ACT-1
       SURVIVAL TOOL THAT BECOMES OPTIONAL, and the curve is SHELTER DENSITY, not a
       nerf to the camp. The same three verbs (hang out / sleep / patch up) must
       work in a camp you pitch AND a friendly place you walk into; the difference
       is that a real roof costs no setup time and is more comfortable.
   14. THE CAMP BUFF AND THE EATING BUFF COMBINE. "I LIKED IT WHEN WE COMBINE SOME
       OF THESE VALUES WITH THE FOOD EATING VALUES FROM THE VALHEIM REFERENCE."
       Eating is its own stacking buff in the shape Valheim's food had — but out of
       the ONE POOL (clause 4), measured in TILES (clause 2), at tiny magnitudes
       (clause 7).
   15. HIS QUESTION, ASKED OF ME: "IF WE GET SHOT IN COMBAT DO WE ALWAYS NEED TO
       PREVENT BLOOD LOSS? LIKE AFTER EVERY DUNGEON OR RAIDER OR ENEMY FACTION AREA
       WE CLEAR". He is naming the CHORE RISK. Answered in writing with a
       recommendation and all three options playable:
       records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md — 0 ALWAYS / 1 SELF-LIMITING /
       2 ONLY SERIOUS. MY ANSWER IS 2, because his own clause 6 says ignoring the
       camp must stay playable and a mandatory bleed makes it compulsory through the
       back door. STILL [PENDING Paolo] — nobody picks it for him.
   AND HE PARKED THE NUMBERS HIMSELF: "IM NOT SURE HOW MANY TILES YOU WALK OR HOW
   MUCH INGAME TIME PASSES BEFORE THE BUFFS RUN OUT THOUGH WELL WORK MORE ON THAT!"
   So no tile count and no time cost may harden into a default while that stands.
   ON THE PAGE (slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html): a real clock
   in the HUD (day + hour), setup and every action moving it, an ACT dial that
   changes how much friendly shelter exists on the map (1 -> 3 -> 6 places), hotels
   and a homie's house you walk INTO for free comfort, the meal buff stacking with
   the camp buff and both burning in tiles, and BLEED_POLICY switchable live. The
   walking clock is derived from HIS scale ruling and shows its working: across the
   map and back is a day, so 80 tiles x 18 min = 24 h, and TILE_MINUTES is a dial.
   13 new dials, 31 total, every one carrying its law clause.
   GATE: gates/camp_dial_gate.js now 112 checks (was 75), mutation-tested three ways
   (free setup, non-stacking meal, policy 2 letting ordinary bleeds through — each
   reds exactly the right check).
1h. [RULED 7/27 — HE APPROVED IT AND REWROTE IT IN THE SAME BREATH] THE MOBILE CAMP
   IS BOHEMIA'S SURVIVAL SYSTEM. Paolo, after playing the Valheim model: "awesome so
   i am in love with the mobile camp idea... i liked this valheim shit alot."
   LAW: laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md (LOCKED, 10 clauses, his
   words verbatim). VERDICT: records/BOHEMIA_LAB_VALHEIM_VERDICT_7_27_26.txt.
   WHAT HE RULED, and every one of these is now canon:
     1. THE CAMP IS MOBILE. Carried and set down, never a fixed base.
     2. THE TIMER IS TILES MOVED, NOT SECONDS. "it would be on a timer it would be
        set for how many tiles you move and shit." A buff may not burn while the
        player stands still — this is the perfect mate to TIME IS SPENT BY ACTIONS
        and it is the biggest single departure from Valheim.
     3. SCALE: a full day is across the map and back.
     4. ONE CLUMPED POOL, NO FOOD ITEMS, NO FOOD CRAFTING. "water, food, and build
        shit are clumped into one category essentially... it would suck from that
        and loot in the world would add to that." This also settles the shape of
        clause (a) of the loot law: the kinds are very few and this one is a clump.
     5. THE REWARD IS HEALTH REGEN, STAMINA REGEN, AND MORE STAMINA POINTS.
     6. IGNORING THE CAMP MUST STAY PLAYABLE. "if people dont want to give a fuck
        about that its okay too." Weaker, never blocked.
     7. THE NUMBERS ARE TINY — ROGUE FABLE IV SCALE. "like plus 1 or 2 or 3 stamina
        points type shit." Valheim's 25 -> 148 health is explicitly the wrong
        register and no Bohemia system may inherit it.
     8. THE CAMP IS ALSO THE MEDICAL STATION: bandage, gauze, and A COMPANION
        PULLING A BULLET OUT OF YOU — the first ruled mechanical job a companion has.
     9. CHILL, AND SLEEP AS A SEPARATE OPTION.
    10. COMFORT IS APPROVED as a mechanism, ported to tiles: what you CARRIED and
        SET DOWN buys tiles of buff.
   PLAYABLE IN HIS OWN RULESET: slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html
   Walk in tiles, set the camp down anywhere, dress it from what you carried, chill
   or sleep, eat out of the one pool, take a wound and get patched — and a companion
   digs the bullet out because you cannot. He said twice that he is unsure about two
   things ("idk about how it impacts hp points", "im not super sure on the food
   crafting system"), so EVERY VALUE HE DID NOT SET IS A DIAL on its own tab, 18 of
   them, each labelled with the law clause it answers and why it exists. MAX_HP_MOVES
   defaults to OFF because "idk" is not a ruling.
   GATE: gates/camp_dial_gate.js, 75 checks, registered in the suite as CAMP DIAL.
   It asserts the law's mechanical clauses on the real surface — including the one
   that matters most (standing still for 20,000 frames burns ZERO tiles of buff), the
   one that protects him from me (every pending value must be reachable as a dial, and
   the stamina bonus cannot be dialled past +3), and clause 6 (walk 120 tiles having
   never camped and nothing is blocked).
   STILL [PENDING Paolo], clauses (a)-(g) of the addendum: the pool's name and whether
   it is literally one number; how many tiles a rest is worth and per comfort level;
   what each camp action costs; whether max health moves at all; the exact stamina
   numbers; what limits how much camp you can carry; and the real camp item list (the
   five on the page are placeholders and say so).
   NOTHING WAS PORTED into the engine or the alpha. An approve on a reference is not
   an order to build the real system.
1g. [SHIPPED 7/27 — AWAITING PAOLO'S PLAY] VALHEIM'S COMFORT LOOP, COMMISSIONED BY
   NAME. Paolo: "Next emulation, whole mechanics: VALHEIM'S COMFORT LOOP... I play
   it and then rule Bohemia's survival system off the feel, not off a document."
   slices/lab/BOHEMIA_LAB_VALHEIM_COMFORT_7_27_26.html — the three mechanics he
   named, playable end to end in one small world (meadow camp, forest to forage,
   freezing mountain with a cairn at the top):
     FOOD    three slots, each adding max health AND max stamina for tens of
             minutes; the bonus SHRINKS as the food burns, so your ceiling sags
             instead of an alarm going off; the fourth food is refused; a food can
             only be topped up below half. An empty stomach is 25 health — weak,
             alive, and it never kills you.
     RESTED  20 seconds standing at the fire UNDER A ROOF, then +50% health regen
             and +100% stamina regen. It travels with you and it re-grants for
             free while you are in your own camp.
     COMFORT the one worth stealing: comfort = 1 + the HIGHEST item in each
             CATEGORY within 10 m, and the comfort number IS how many minutes
             Rested lasts (480s + 60s per level). A rug is a minute. A second rug
             is nothing. Decorating your camp literally makes you stronger, and
             the HUD says "comfort 9 = 16 min rested" while you do it.
   THE FIRST **MODEL** ROW, AND THAT IS A NEW THING IN THE MACHINE. Valheim's logic
   ships as a compiled Unity DLL: no source to fetch, every decompiled-source repo
   probed came back 404, and the wikis are 403 at this environment's network
   gateway. So numbers are DOCUMENTED, not read off a line — except two that ARE
   real source, lifted from ValheimPlus's Harmony patches which name the vanilla
   values they overwrite (the 10 m comfort radius, BuildingConfiguration.cs:9, and
   the 60 s per comfort level, PlayerConfiguration.cs:11).
   gates/lab_gate.js CLAUSE 7 now exists to keep a model from ever passing itself
   off as a measurement: a row may declare kind:'MODEL', and then EVERY constant
   must be tagged [SOURCED file:line] or [DOC ...] or declared ours, at least one
   must be genuinely SOURCED, the page must say NOT A MEASUREMENT on its own face,
   and the record must list what was actually tried and failed. An untagged number
   fails the build exactly like a missing citation. (The MODEL deliverable was
   named in records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md before it was
   ever needed.)
   Gate: 83 new checks (262 total in the lab gate), all measured through the page's
   own tick(), so a 24-minute buff is verified in milliseconds.
   TWO DEFECTS FOUND BY LOOKING, NOT BY READING — the lesson from the last two
   kills: (1) the mountain was not actually dangerous (5 tiles of cold crossed in
   8 seconds, 8 of 25 health, so the buffs did not matter, so the page failed the
   one thing he asked it to test). The map was rescaled so the cold round trip
   costs ~29 health: empty you reach the cairn and die on the way down, fed you
   barely notice. (2) Rested re-granted every frame at your own fire — correct
   behaviour — but announced itself every frame, burying the screen in toasts.
   Teardown, every number tagged: records/lab/BOHEMIA_LAB_VALHEIM_TEARDOWN_7_27_26.txt
   Patterns: records/lab/BOHEMIA_LAB_VALHEIM_PATTERN_NOTE_7_27_26.md (6 mechanisms,
   6 do-not-ports, 5 honest limits).
   [PENDING Paolo] and it is the whole point of the page: does a camp that makes
   you stronger belong in Bohemia? Behind that, also his: our comfort CATEGORIES,
   how long our rest ritual takes, whether food raises a ceiling or fills a meter,
   and whether we have a hunger axis at all (Valheim's case for "no" is strong).
   NOTHING WAS PORTED. The lab ports on his word only.
1f. [KILLED 7/27 — DEAD, GRAVEYARDED, AND LOOT IS NOW A CLOSED LAB SUBJECT]
   Paolo: "That was really bad so bad so bad." The A Dark Room scavenge page
   (slices/lab/BOHEMIA_LAB_DARKROOM_SCAVENGE_7_26_26.html — DEAD, do not re-add) is deleted and
   graveyarded; its registry row and all 44 live checks are removed from
   gates/lab_gate.js. That is the SECOND loot emulation killed in two days, so
   under laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md LOOT IS ENDED as a lab
   subject: no v3, no third reference game, nobody re-pitches a loot page unless
   Paolo names it himself.
   POST-MORTEM: records/BOHEMIA_DARKROOM_LOOT_KILL_7_27_26.txt. Three causes, and
   the first is the big one: (1) I PRODUCED SOMETHING HE DID NOT ASK FOR — his
   message asked for research, and "you could try it something else" is a shrug,
   not a commission; the research alone was the turn. (2) I answered "too slow" by
   DELETING THE ACT instead of speeding it up — A Dark Room's loot is a paragraph
   and one button in a modal, and he said State of Decay is decent AS AN
   EXPERIENCE, which is exactly the part I removed. Two taps in a menu is not a
   fast search, it is no search. (3) It looked like nothing — grey squares with
   letters — in the middle of a fleet-wide look problem that is the reason he
   cannot approve anything.
   264 green checks and a verified deploy proved the port was FAITHFUL and could
   not ask whether he wanted it. I even added a FEEL-STATEMENT step after the
   Zomboid kill, ran it, and it PASSED, because it checked the reference against
   his rulings and never against what he actually wanted. A procedure I invented
   cleared me; that is worth less than nothing.
   laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md is UNCHANGED and still
   the ruling. Its four content questions are still [PENDING Paolo] and are still
   the only real blocker: resource KINDS and how many, yield range per container
   kind, what a search costs in time, and re-search / noise.
1e. [SHIPPED 7/26, ON HIS ORDER] THE RESEARCH DOSSIER: WHICH GAMES ARE ACTUALLY
   LIKE OURS, AND WHOSE CODE WE CAN GET. Paolo: "Do big brain online research for
   games that are just like ours or like a combination of what we're going for."
   records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md — Bohemia's combination
   written as a ten-column checklist, nine candidates scored against it, a
   VERIFIED source verdict per game (fetched, not assumed), a one-line FEEL
   STATEMENT per game checked against his standing rulings, and a ranked
   shortlist. It also names the split that matters: an EMULATION has real source
   and citable lines; a MODEL has only documentation and needs a NEW GATE ROW
   TYPE before one can legally ship. #1 next target: CATACLYSM: DDA faction camps
   (open source, verified fetchable) because it is the only game that answers his
   own ruled-but-unfilled question — what an action COSTS and what a crew you
   sent away brings back. Honest finding: the FEED/clout axis has NO reference
   with obtainable numbers, and that is a finding, not a gap to fill by inventing.
1d. [SHIPPED 7/26, ON HIS ORDER] THE FIRST PORT OUT OF THE LAB.
   Paolo after playing LAB-03: "Awesome! All these things worked. Very good! Did
   you learn anything. Anything we can throw in the bohemia code right now?"
   Law: laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md — the lab ports
   only when he says so, ships MECHANISM ONLY in its own new file, never wires
   itself into another lane's surface, and carries its provenance.
   engine/bohemia_resolve.js (headless, no deps, collides with nothing):
     RESOLVE  one moment, a DECLARED phase order, and no system able to read
              another's report. A step that throws cannot eat the player's night.
     RATION   a limit by COUNT per day and per week with a bypass that overrides
              both (the birthday shape). No price term exists anywhere in it.
     CEILING  points cannot pass the current state's cap and ONLY a state change
              moves the cap. 500 favours cannot grind past a wall.
     REACH    one declared range, one facing rule, one predicate.
   AMENDED THE SAME TURN BY HIS RULING: "I like it all tbh all 3 and sleep
   understand sleep can be hangout or eat too u know" — APPROVE on all four, and
   the resolve moment is ANY BLOCK OF TIME THE PLAYER SPENDS, not just sleep.
   Law: laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md. The
   resolver now takes a CALLER-DECLARED list of moments each carrying a SIZE, a
   system declares WHICH moments it answers, and an undeclared moment is a build
   error. A meal moves less than a night because each system says so, not because
   the module hardcoded a night. Verdict: records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt
   Gate: gates/resolve_gate.js, 77 checks, registered as LAB PORT, and
   mutation-tested (breaking the clamp, leaking reports between steps, letting a
   thrown step kill the moment, ignoring a moment subscription, leaking the moment
   through the shared context, or accepting an undeclared moment each turn it red).
   EVERY TABLE IS EMPTY. No ration limits, no faction thresholds, no reach number
   and no action costs for any real Bohemia system: callers pass them in, and the
   first default is a RULING, not code. NOT WIRED INTO ANY SURFACE — adopting it
   is the owning lane's build item (RUN for the contextual verb + reach, WORLD for
   the resolve point, LIFE/SOCIAL for the ration and the standing ceiling).
1c. [SHIPPED 7/26 — AWAITING PAOLO'S PLAY] ONE WORLD, ALL THREE MECHANICS ON IT.
   Paolo: "are you able to code these into the walkable version of Stardew Valley
   made earlier pull up to the mini lake you can start fishing pull up on your
   potential spouse. Do all of this pull up on your farm."
   slices/lab/BOHEMIA_LAB_STARDEW_WORLD_7_26_26.html — one town, one clock, one
   purse. Your farmhouse and a 54-tile fenced plot, the shop up the road, a lake
   with a dock, EMILY walking a real schedule. ONE contextual action button:
   CAST at water, USE TOOL at soil, TALK next to her, SLEEP at your bed, HOLD TO
   REEL once a fish is on, and the tile you are about to act on is outlined.
   Sleeping is the only integration point: crops advance or stall, soil dries,
   her friendship decays, the wedding counts down, her schedule resets.
   What the merge taught (the actual finding):
   records/lab/BOHEMIA_LAB_STARDEW_WORLD_NOTE_7_26_26.md — the walk is a sentence
   structure not a feature; one contextual verb instead of a button per system;
   reach is a declared number; ONE resolve point with zero coupling between
   systems; distance on the map IS the pacing. Gate: 179 checks, and the world
   half WALKS the route with the real movement code (door -> plot -> till/seed/
   water -> across the map to the dock -> land a fish -> up to her -> bouquet ->
   home -> in the door -> bed -> sleep -> the crop advanced).
   His musing "in our world it's gonna most likely be like a Hydro farm pool or
   something I don't know but yeah" is RECORDED AND NOT ACTED ON. No Bohemia
   growing system invented. If he rules it, it becomes a CITY/WORLD item.
1b. [SHIPPED 7/26 — AWAITING PAOLO'S PLAY] STARDEW MECHANICS: FISHING + FARMING
   + MARRIAGE, all three playable end to end in
   slices/lab/BOHEMIA_LAB_STARDEW_MECHANICS_7_26_26.html. The real bobber-bar
   physics (bar height IS the entire fishing skill tree); till/seed/water/sleep/
   harvest/regrow with the real reasons a crop stalls (dry = a wasted day, not
   damage) or dies (wrong season); and stranger -> friend -> dating -> engaged ->
   married on the real point economy (250/heart, gifts rationed 1/day + 2/week,
   birthday x8, neglect -2/-8/-20, and the HARD 8-heart cap that gifting cannot
   pass). Teardown with every file:line:
   records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt. Patterns +
   what Bohemia should take: records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_PATTERN_
   NOTE_7_26_26.md (10 named patterns, 7 recommendations, 4 do-not-ports).
   Gate: 112 checks that PLAY all three loops.
1. [SUPERSEDED 7/26 by item 0 — kept as the record, not a template] STARDEW
   TOWN-WALK FEEL. All three
   deliverables landed: slices/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_7_26_26.html
   (one town, two furnished interiors, fade transitions, the 7s/10min clock with
   the real dusk curve, one scheduled NPC),
   records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt (37
   constants, each with the decompiled file:line it was read from) and
   records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_PATTERN_NOTE_7_26_26.md (9 port
   candidates, 4 explicit do-not-ports). Gate: gates/lab_gate.js, 83 checks,
   registered as REFERENCE LAB. The verdict is Paolo playing it; the lane ports
   nothing on its own. ONE [PENDING Paolo] came out of it and is written into
   the note: Bohemia's 120 BPM / one-body-per-cell walk and Stardew's continuous
   sub-pixel walk cannot both live in one surface — three options are laid out,
   all three are his call.
2. [KILLED 7/26 — DEAD, GRAVEYARDED, NO V2] ZOMBOID LOOT LOOP. Paolo: "That was
   really bad and not fun." The page is DELETED and graveyarded; its gate row is
   gone. Post-mortem: records/BOHEMIA_ZOMBOID_LOOT_KILL_7_26_26.txt. The teardown
   and pattern note survive marked DEAD as the record of what was measured.
   THE RULING THAT REPLACED IT, and it is the valuable thing:
   laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md (LOCKED) — Bohemia's
   loot is VERY SIMPLIFIED: a found thing is a RESOURCE WITH A COUNT ("you found
   like three"), not a named object; the description carries the flavour and its
   job is to explain the amount; looting is ONE FAST ACTION, because "imagine if
   that went by really quick instead of really slowly I might give a fuck about
   it"; minimalistic, FEWER kinds than State of Decay; customisation is NOT bought
   with loot volume; STATE OF DECAY (and SoD2) is the reference and PROJECT
   ZOMBOID IS NOW AN ANTI-REFERENCE for loot pace.
   [PENDING Paolo] the resource KINDS and how many, the yield range per container
   kind, what a search costs in time, and whether a container can be searched
   twice. Nobody invents these.
   WHY IT FAILED (root cause, in the post-mortem): I emulated a pace he had
   already implied he did not want, treated an old backlog phrase as a spec, and
   shipped volume into a lane where he wants minimalism. 245 green checks proved
   every rule was ported faithfully and not one of them could ask whether it was
   fun.

3. (Paolo adds more targets by naming a game + system to any lab session or
   to the coordinator.)

## ART (new lane — first word "art")
-1. PACK INTAKE — SHELVED/OPTIONAL (Paolo 7/28: "I need YOU to make tiles,
   just not dogshit" — AI authorship is the production path under the
   quality harness; this intake activates ONLY if he ever uploads packs)
   (LimeZu Modern Interiors + Exteriors + a post-apoc pack). On arrival:
   ingest to HD-repo-style banks (pack/idx keys, source+license noted),
   build ONE bulk-sweep judge surface (Great Sweep pattern, whole-pack
   thumbs), then palette-map the UPs onto the locked ramp + run the
   dead-world aging pass + register in the Approved Asset Index. The
   frozen target is NOT re-cut without Paolo's explicit word. | ingest
   deterministic, sweep surface reachable from the alpha, UPs indexed |
   the CBB target stays byte-locked | the sweep IS the verdict.
-2. [SHIPPED 7/27 — THE DIAGNOSIS] I WENT TO SCHOOL (Paolo: "learn the skillset of
   actualy pixel shit pixel assets... go to school for me for a couple turns and
   learn some laws brother"). laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md: 12 craft
   laws, every one carrying its source, mine marked [DERIVED].
   tools/bohemia_pixel_craft_audit.py measures six of them on our own banks.
   gates/pixel_craft_gate.py (14 checks) holds them, registered.
   THE FINDING, and it explains every rejection since 7/26: our frozen act-1 set
   is 73.6% ORPHAN PIXELS on average (99.6% worst — concrete_0), up to 1610
   colours in one 44x44 tile, 814 colour regions per 1000px, and only 14 of 38
   tiles agree with our own upper-left key. The craft's name for this exact
   failure: "AI learned what pixel art looks like, but never learned what pixel
   art IS... they generate a normal image in a pixel-ish style and shrink it
   down." Paolo said "hallucinated AI slop" on 7/26 with his eyes alone and was
   textbook correct. Proof picture: records/target/PIXEL_CRAFT_PROOF.png.
   The ONE thing we pass clean: every tile is authored at the real 44px cell,
   block size 1, no hidden upscale.
   NOT RE-COOKED, ON PURPOSE: the set is byte-locked by his CBB verdict and a
   gate does not overrule a verdict. Frozen set = ratchet against its own
   baseline; real craft thresholds apply to every bank registered from here on.
   Record: records/BOHEMIA_PIXEL_SCHOOL_7_27_26.md.
-1a. [RULED 7/27 "show me one" — DELIVERED, awaiting his read] ONE TILE RE-COOKED.
   tools/bohemia_tile_recook_proof.py rebuilt road_0 (worst + most repeated
   surface: 99.3% orphan, 1191 colours) as real pixel art. RESULT: 1191 -> 6
   colours, 99% -> 0% orphans, 996 -> 39 regions/1000px, mean value 65.5 -> 65.2
   (ground band kept), near-black 0.15% -> 0.00%. THE COLOUR IS HIS: the six-step
   ramp is lifted out of the approved tile by equal-population luminance banding
   + mode. ONE named change, printed on the picture: the ramp's deviation from
   its own mean is stretched 2.15x, because six bands of that tile come back as
   six near-identical browns and a ramp with no steps draws a flat tile however
   well built. That is why it reads warmer, and TOO WARM is one of the three
   buttons. THREE THINGS FIXED BEFORE IT WAS WORTH SHOWING: (1) first cut read as
   CAMOUFLAGE - perfect numbers, worse picture - because CELL_M=0.75 means 1px is
   ~1.7cm and my "wear patches" were 22cm blotches; (2) four cracks made a
   SIGNATURE that the eye locked onto across a 4x4 field (LAW 12) - down to one,
   heavy damage belongs on road_1/2, which is what variants are FOR; (3) the
   brightest step was too common so it read as gravel. Judge surface: the same
   pixel craft judge page, updated (never a second page for the same question).
   Proofs: records/target/RECOOK_road_0.png (desk) + _PHONE.png (his screen).
   Nothing entered a bank - candidates live in records/target/ until he rules.
-1b. [PENDING Paolo — THE ONE QUESTION] RE-COOK THE STARTER TILE SET as actual
   pixel art: real 4-7 value ramps hue-shifted, material as a few clusters
   repeated with varied distribution, one light direction, orphans cleaned. This
   is a new cook against a CBB-frozen verdict, so it is his word, not my
   initiative. Everything else in this lane (tile set growth, the CITY tab, the
   act triptych) sits downstream of it — growing a tile set that is not pixel art
   just makes more of the thing he keeps rejecting. | pixel_craft_gate thresholds
   already written and waiting | — | yes, the re-cook is judged.
-1c. (research debt, 7/27) BUY PIXEL LOGIC (Michael Azzi, ~$9,
   pixellogicbook.com). It is the standard reference on this craft and the
   network policy here blocks direct page fetches (403 on every attempt), so the
   laws above are built from search summaries of it and others, never from
   reading it. The law file says so and the gate fails if it ever stops saying
   so. | — | — | no.
-1. (discovered 7/26) FLEET: TWO SESSIONS BUILT THE SAME THING IN THE SAME HOUR.
   ART and RUN both wired the frozen tileset into the run; RUN landed first and
   ART binned its duplicate. "Check main before you start" does not help when
   the other lane lands mid-turn. Needs a real mechanism (a claim/lock on a file
   or a system, visible across sessions), not a promise. NOT designed here -
   fleet process is not this lane's to invent. Record:
   records/BOHEMIA_ART_LANE_COLLISION_7_26_26.md
0. [SHIPPED 7/26] STEP ZERO — THE MOBILE RENDER CONTRACT (amendment D):
   laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md. Pins frame, tile px, integer
   zoom, portrait viewport, proportion canon, ONE light direction, the three
   value bands, no-keyline, no-dither, the pipeline rule and the memory
   constraint. Every number is asserted against the factory's own constants by
   target_screen_gate.py, so contract and code cannot drift. TWO CLAUSES ARE
   HONESTLY UNMET AND SAY SO IN THE DOC: (a) the 64-colour master ramp is
   DERIVED (records/target/BOHEMIA_MASTER_PALETTE.json) but the approved corpus
   is continuous-tone, 59,377 colours across the plates — indexing lands with
   the act-1 tileset (item 2) and is held meanwhile by a ratchet ceiling;
   (b) live canvas memory vs the ~224MB iOS floor is NOT instrumented and the
   gate does not pretend to check it. Order note: amendment D landed on main
   mid-session, so the contract was written FROM the screens, not before them.
0b. [SHIPPED 7/27] MEASURE LIVE CANVAS MEMORY against the ~224MB iOS floor.
   tools/bohemia_canvas_memory_probe.js drives the three shipped surfaces in a
   real browser at iPhone portrait and counts canvas backing stores (w*h*4, in
   EVERY frame - the alpha's heaviest modules are iframes), decoded image bytes,
   and the JS heap over CDP after a FORCED collection. WeakRef-tracked, so a
   cache that works reads as a number that stops climbing. Record:
   records/target/BOHEMIA_CANVAS_MEMORY.json + records/
   BOHEMIA_MEMORY_MEASURED_7_27_26.md. Gate: gates/canvas_memory_gate.py (31
   checks), registered. Section 8 of the contract now carries the numbers.
   THE CLAUSE HOLDS: 480 steps across the valley grew the picture by 0.0 MB
   (the WORLD lane's bounded plot LRU works). WHAT IT FOUND INSTEAD, and it is
   NOT what the clause was watching: the ALPHA holds 2604 live canvases once
   every tab is open (2217 in the shell, 188 mapFrame, 193 runFrame, ~21KB each
   - which is why nobody noticed) and ~46MB of JS heap at load, because the art
   arrives as base64 and lives as JS pixel arrays, never as an image or canvas.
   ~98MB resident = 44% of the floor. Headroom today, work items for the lanes
   that own those tabs (see CHARACTER / RUN), written down rather than patched
   from inside the ART lane. LIMIT STATED EVERYWHERE IT APPEARS: headless
   desktop Chromium, not an iPhone - it proves the SHAPE of the curve, which is
   what kills a phone. A real-device number still needs a real device.
1. [CLOSED 7/26 - CBB, SHIPPED, FROZEN] THE TARGET SCREEN. Paolo: "Could be
   better." Per the verdict pipeline that is SHIPS + FROZEN + NEVER SPAWNS
   VARIANTS. The tile-reassembled frame IS the target; it and the 42-tile
   starter set are byte-locked in the constitution and changing either needs a
   NEW RULING, not a new render. DO NOT MAKE ANOTHER TARGET SCREEN. All further
   look work happens in the act-1 tileset against this target. Verdict:
   records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt. Constitution +
   target-match gate shipped the same turn (215 checks).
   [HISTORY] Amendment C (ANTI-BIOSHOCK) was run for the first time and the mockup
   FAILED it: the painted plate cut into 262 unique tiles for 264 cells - it was
   never a tiled world. Fixed: banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt is
   a real, bounded, NAMED 38-tile set (+11 sprites + cast-shadow DATA), the frame
   is re-laid from nothing but those tiles, and it renders on a real browser
   canvas with integer blit and smoothing off. The first reassembly looked worse
   and the four reasons were specific: no wall corners, a hip roof laid as flat
   stripes, no runtime cast shadows, no gaps between buildings. All four fixed.
   Delta from the painting is now 34/255, essentially all of it the two poster
   passes that belong to the renderer. THE TILE-REASSEMBLED FRAME IS NOW THE
   TARGET and the judge page leads with it. Record:
   records/BOHEMIA_REASSEMBLY_TEST_7_26_26.md. Gate: 1,074 checks, including a
   hard 96-tile ceiling. Backlog item 2 (MASTER ACT-1 TILESET) is now partly
   delivered: this IS the starter set; what remains is the act triptych and
   palette indexing.
   [PRIOR ROUND] THE TARGET SCREEN.
   REV 3 answers the marked-up shot: the nameless bottom band, the fake
   chain-link and the fake power line are DELETED (invented decoration is
   deleted on sight); the radioactive barrel is a plain rusted drum and
   radiation/hazard iconography is now BANNED BY LORE everywhere; the crossing
   spans kerb to kerb with its bars across traffic, lined up with its walk; the
   front door shares a column with its own walk; the garage door is a real
   opening with the driveway running into it; the lamps are the slim blessed
   post, a tile taller and not one pixel wider; and two objects can no longer
   stand on the same ground - the BUILD FAILS. NEW LAW + gate:
   laws/BOHEMIA_ADDENDUM_NAME_IT_OR_DONT_DRAW_IT_7_26_26.md - every thing on
   screen is named, described, sourced, and the build dies if the drawn count
   ever exceeds the named count. Manifest ships with the render and is printed
   on the judge page. Gate: 483 checks.
   [PRIOR ROUND] THE TARGET SCREEN. Paolo:
   "Front base is the only one I'm concerned with and even then it looks like
   hallucinated AI slop. We made a rule that all cars are 2 x 3 tiles. Yeah the
   roofs are all fucked up not put on correctly yeah." A THE FRONT FACE is the
   direction; B and C are GRAVEYARDED (registry + post-mortem in
   records/BOHEMIA_TARGET_SCREEN_RULING_7_26_26.md) and their renderers were
   DELETED, not disabled. REV 2 fixes both named defects at the root: cars are
   sized from engine/bohemia_prop_scale.js at draw time (never a typed number)
   and turned along the road they died on; SHEAR is 0 forever, so a roof sits
   square on its own walls and is a real hip form (ridge, hip ends in the roof's
   own material, fascia, eave shadow). Judge page is now ONE TAP: GOOD ENOUGH /
   COULD BE BETTER / STILL SLOP, with both fixes shown under a tile grid.
   Gate: 91 checks. STILL OPEN: whether the LOOK is there. If it comes back
   STILL SLOP the named next suspects are the one-tan value range, the unindexed
   palette, and boxes-instead-of-massing. Do not act on those before he rules.
1-OLD. [superseded] the three-candidate sitting
   (A THE FRONT FACE / B THE ISO BLOCK / C THE CUTAWAY), each side-by-side with
   a real screenshot of the shipped run, judged from alpha -> LIFE -> PICK THE
   TARGET SCREEN. Built entirely from approved banks; the body is baked by the
   alpha itself. Record: records/BOHEMIA_TARGET_SCREENS_7_26_26.md. Gate:
   target_screen_gate.py (63 checks, registered) — it holds 2-tile doors, human
   scale, three-tone/no-keyline, dead-dark glass, and law 4's quest-ask freeze.
   NOTE: they were composed BEFORE amendment D landed on main, so item 0's
   MOBILE RENDER CONTRACT is written FROM them (records/target/BOHEMIA_TARGET_
   SPEC.json already pins resolution, tile px, integer scale, portrait viewport,
   light direction and the three-tone/no-outline rule) rather than the other way
   round. Amendments B+C (cut-and-reassemble acceptance, proxy gates) attach at
   the moment of the pick, not before it.
1b. (blocked on the pick) WRITE THE PICK IN: status PICKED in the spec, losers
   to the graveyard with a post-mortem, target-match diffing on, proxy gates +
   the cut-and-reassemble acceptance test per amendments B+C, freeze lifted.
2. (after the pick) MASTER ACT-1 TILESET to the target. INTERIOR COMPOSITION
   SOURCE (7/26): records/BOHEMIA_ROOM_RECIPE_BOOK_7_26_26.md — 12 room
   recipes + composition laws + the 70/20/10 dead-world translation,
   [PENDING Paolo bulk verdict]; on APPROVE, rooms are composed FROM the
   recipes (manifests mapped to the interior pool), never invented.
   INGREDIENT DELIVERED
   7/26 by CITY: banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt - Paolo's Great Sweep
   crossed to real images for the first time (all 87 swept packs resolve against
   the HD masters, 0 unresolved), filtered UP-ONLY, 465 tiles bucketed by room
   function with per-tile draw scale from the sweep's BIG/SMALL flags. Built by
   tools/bohemia_interior_pool_factory.py; re-run it with different caps for a
   bigger set. Bodies/gore excluded on purpose (UP, but a story Paolo places).
   Deliberately NOT wired into the game - the freeze and TILESETS-ARE-SETS say a
   look is judged as one assembled scene, after the pick. produced + judged as
   one assembled scene; act triptych variants in spec. | tileset gate +
   proportion gate (2-tile doors, human scale — the proportion half already
   ships inside target_screen_gate.py) | — | yes, as a set.
3. [RETIRED 7/26 - the work is dead, not done] RE-COOK VEHICLES TO ISO. This was
   only ever needed if candidate B or C won. A won and both are graveyarded, so
   the approved car art is already in the right projection. Removing it rather
   than leaving it to rot at the bottom of the lane.
3b. [PENDING Paolo, carried] THE CAR LENGTH. At true pixel scale the approved
   wreck art is ~2 tiles wide by >4 long, against his locked 2x3 footprint.
   Either the art is re-cooked shorter or the footprint becomes 2x5. Not a
   guess I get to make.

TILE REQUESTS: needing a visual asset that doesn't exist = check the
Approved Asset Index, then FILE A ROW in BOHEMIA_TILE_REQUESTS.md (never
cook inline outside the ART lane). The ART lane works that board in batches.

Rules (full doctrine: laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md): topmost
unblocked item in YOUR lane; [PENDING Paolo] items are SKIPPED, never resolved;
only Paolo/verdicts add direction-class items; agents may append (discovered)
items; every item works to the Definition of Done. Entry shape:
GOAL | DoD beyond the standard | DON'T TOUCH | needs-verdict-before-volume?

## RUN
00. THE GAME DAY (assigned 7/29 off Paolo's big-missing dispatch — records/
   BOHEMIA_THE_BIG_MISSING_7_29_26.md item 1, THE lane milestone): one full
   playable day — wake at the base -> pick up a quest -> travel -> resolve
   it (talk or fight) -> GET PAID in the three currencies -> spend something
   -> sleep-save. Every organ exists; this lane makes them CIRCULATE. Use
   S01 + hardcoded placement if the placement ruling hasn't landed (the day
   loop outranks quest volume); payout consumes WORLD's economy skeleton
   the moment it exists, a stub ledger until then — but the stub is FLAGGED
   on screen as stub, never presented as economy. | the full day playable
   on the real surface end to end, gated as one integration test | quest
   placement + economy numbers = [PENDING Paolo], neither blocks the loop
   shape | yes (the day itself is the judgeable).
00b. CLOUD/DURABLE SAVE (big-missing item 7, the landmine): iOS WebKit can
   evict localStorage after ~7 days idle — a returning player can find
   SAVES DELETED. His one-blob cloud ruling is the answer and is unbuilt.
   Near-term mechanism: aggressive export prompts + persist() storage API +
   the blob's export flow made one-tap; true cloud lands with the ship-
   vehicle ruling [PENDING Paolo ~month 8]. | eviction scenario simulated +
   survived via persisted storage, gated | — | no.
0g. GDD MECHANICS ROUTED 8/4 (records/BOHEMIA_GDD_MECHANICS_LEDGER_8_4_26.md):
   (a) HEALTH & STAMINA, THE ONE BAR (v2 §15, LOCKED, Valheim philosophy —
   his named favorite): one combined bar, stamina range capped by current
   health, injuries take DAYS (field medicine stabilizes, never heals),
   wounds degrade aim (feeds the dial's wounded-shake law already built).
   COMBAT co-owns the wound->aim coupling. | bar live on the real surface +
   headless recovery-over-days test | exact numbers tunable, his feel |
   yes (the bar's look/feel is judgeable).
   (b) FAST TRAVEL + SUPPLEMENT COSTS + CONVOY TRAVEL (v2 §11/§13): always
   available, always priced (time + supplements per method, the locked
   travel table); convoy = ride with Caravans/allies, safe-but-slow.
   Composes with time-is-spent + the bike (0v). WORLD supplies the pricing
   hooks. | travel menu on the real surface, costs shown before commit |
   supplement table detail = PENDING Paolo (GDD's own list) | no.
0f. THE SOFT OPENING KIT (sweep 1 catch, 8/11 — records/BOHEMIA_
   COORDINATOR_SWEEP_LEDGER.md; demo-ADJACENT, never demo-blocking): an
   end-of-day in-demo FEEDBACK CARD — three taps (fun? / confusing? / play
   again?) + optional text — exported exactly like the save blob so any
   playtester can paste their reaction into a chat; folds with telemetry
   (0e) so one paste returns data + feelings together. Grounded both
   aisles: film test screenings (structured cards, revise, re-screen fresh
   eyes) + Next Fest data (a public demo with no audience converts ~nothing
   — the demo is an instrument before it is a launch). The closed-playtest
   protocol is the coordinator's to write at demo-gate green; PUBLIC demo
   timing is Paolo's call at that point, not now. | card live on the real
   surface + export parses | — | no.
0v. THE BIKE (big-missing item 8, assigned 7/31 to complete the dispatch —
   the design is LOCKED in GDD v5: man-powered ladder, bike ~4 cells/beat,
   valley crossing 1.7h walk -> ~26min bike; nothing on any surface rides).
   Mechanism: a rideable bike on the walk surface — mount/dismount through
   the one contextual verb, 4 cells/beat on the same 120 BPM request clock,
   camera/feel tuned for phone. THE UNLOCK CHAIN IS [PENDING Paolo] (GDD
   part seven) — ship it behind a debug/dev toggle, never presented as the
   acquisition story. WORLD supplies any loop/scheduler support. | riding
   proven on the real surface + speed gated to the locked table | vehicle
   art through the tile form board | yes (the ride feel is his playtest).
0aa. BORDER WALLS INTO THE RUN (Paolo direct order 7/27, furious and right):
   the 13 approved perimeter-wall keys (banks/BOHEMIA_PERIMETER_WALL_POOL_
   7_14_26.txt, tan variants, one-wall-per-community law) are wired into the
   CITY but ABSENT from the run slice — the suburb blocks Paolo walks must
   wear HIS approved border walls. build_run_slice.js adds the pool to its
   bank reads; integration ledger gets a perimeter_wall row. | ledger row
   INTEGRATED + real-surface screenshot of the walled block | the pool stays
   as-approved, no recooks | no.
0a. THE MOBILE BASE (Paolo direction 7/26, laws/BOHEMIA_ADDENDUM_MOBILE_BASE_
   COMFORT_7_26_26.md): the cart deploys into camp on the walk surface; ONE
   contextual button runs the ritual (eat / hang out / sleep) through the
   ported resolver's declared moments; sleep at camp = save (ruled); camp
   COMFORT from cart upgrades extends the rested/fed effects (Valheim
   pattern, feel-approved in the lab — ledger is the tuning reference).
   Mechanism only: upgrade roster/looks/numbers are Paolo's verdicts, tables
   ship EMPTY. FIRE ART SOURCE (index 7/27): the camp fire uses the APPROVED
   fire/campfire loops (banks/BOHEMIA_FIRE_FLICKER_BANK_7_13_26 + PARTICLE_
   LOOP_BANK — 10MB of approved fire with zero consumers until now). | deploy -> ritual -> buffed -> sleep-save proven headless +
   on the real surface | engine/bohemia_loop.js (flag needs to WORLD);
   upgrade LOOKS are CHARACTER's judged candidates | numbers = [PENDING].  (LANE CHARTER CHANGED 7/26 — read
##       laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md first.
##       This lane INTEGRATES what the fleet built; it does not add features, and
##       the run's quest is disposable scaffolding, never judged.)
A2. [DONE 7/27 — HIS ORDER, job two] THE WORLD ADOPTED THE RESOLVER.
   engine/bohemia_world_resolve.js: four systems subscribe to the declared time-spend
   moments — day (accrues spend, rolls the day), economy (advances the ledger when the
   day has moved under it), faction (the beat), encounters (the director's socket).
   NO MOMENT NAME AND NO RATE LIVES IN THE MODULE: his own example words (sleep, night,
   meal, hangout) appear nowhere in it, and a resolver whose moments are named nonsense
   works identically, which is the proof it genuinely does not know them.
   EVERY TABLE SHIPS EMPTY. An unruled system runs, changes nothing, and reports
   NO_RULING BY NAME, so an unruled world reads as unruled instead of looking like a
   working one. Ten small moments equal one big one exactly when he says 0.1 and 1.0,
   and four equal one when he says 0.25 — the ratio lives in the ruling.
   THE 7/24 PACING RULING HOLDS: a faction turn cannot fire without a caller-supplied
   beat predicate, so DEFAULT OFF is structural, not a comment. A spent meal can never
   quietly become a war. Gate WORLD RESOLVE, 39 checks.
   FOUND BY THE GATE: ten spends of 0.1 sum to 0.9999999999999999, so a strict >= 1 ate
   one moment in every ten and the player could eat ten meals and never turn the day.
   [PENDING Paolo, and it is what blocks everything downstream] THE MOMENT TABLE —
   which moments exist and how much each one spends — and each system's per-unit rate.
   Nothing in this lane will guess either.
A. [FILED BY VERDICT 7/26 — records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt] ADOPT THE
   ONE CONTEXTUAL VERB AND THE DECLARED REACH. Paolo APPROVED both, so this needs
   no further ask. engine/bohemia_resolve.js ships makeReach(tiles) + facingTile:
   one range, one facing rule, one predicate. The run currently has a talk trigger
   AND a door bump AND separate buttons; fold them into ONE button whose label
   comes from what you face, exactly as the lab world does (CAST / USE TOOL / TALK
   / SLEEP), with the target tile outlined so the button is never a mystery. It
   REMOVES UI rather than adding it, which is what a phone wants.
   [PENDING Paolo] HOW MANY TILES OF REACH. Do not pick it. The lab used 1 in a
   reference page; that is not a ruling.
   [DONE 7/26] THE FIRST CONNECTED RUN — shipped, gated. Record:
   records/BOHEMIA_THE_FIRST_CONNECTED_RUN_7_26_26.txt.
   [DONE 7/26] THE REAL CAST — the run wears the real rig + wardrobe + face.
   [DONE 7/26] REAL ANIMATED DOORS (2 tiles tall, approved 7/13 bank) + MUSIC
   (the alpha's own synth scores the walk). Law:
   laws/BOHEMIA_ADDENDUM_DOOR_LAW_TWO_TILES_TALL_7_26_26.md.
   [DONE 7/26] SAVE / LOAD — one portable versioned blob (sleep + manual +
   autosave, export/import code, no device prefs inside, old versions migrate
   forward) and DEATH IS A RELOAD wired to it.
   [DONE 7/26] THE OVERWORLD LOOK — the block is laid from the FROZEN starter
   tileset of Paolo's CBB target. Consumed, never re-rendered; the builder
   refuses to ship if the bank md5 moves. CORRECTION ON RECORD: the target he
   picked is TOP-DOWN, so this lane's old "the run must go 3/4 iso" premise was
   wrong and is retired.
   [DONE 7/26] INTERIORS DRESSED — CITY's UP-only interior pool consumed: one
   floor per ROOM by the room's own function, props from the role's own buckets,
   walls from the constitution's own tile. Props never became collision.
   [DONE 7/27] THE SENTENCE (his ruling after the lab): every verb goes through
   the ported engine/bohemia_resolve.js — REACH declared once, ONE contextual
   button (talk/enter/use/sleep/hang out), and every time-spend resolves the
   world through declared moments in declared phase order. Sleep saves.
   [DONE 7/27] WALK FEEL as playable toggles: GRID / SLIDE / HYBRID / FREE.
   [DONE 7/27] THE REAL VALLEY — the block is a real CELL of the generated
   valley, read off the world model's own tile rung; walking off an edge loads
   the neighbouring district. Passability is the world's answer now.
   Scoreboard: records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md (21/27),
   enforced by gates/integration_gate.js.
0b1. [MEASURED 7/28 — THE NO-COOK ROUTE IS CLOSED, one pick reopens it] THE
   DESERT POOL IS NOT SEAMLESS AND ITS OWN BANK SAYS IT IS. Shopped the index the
   way NEVER DRIFT requires, found DESERT/TERRAIN flagged "not run", wired it,
   looked at it on the real surface: a BLACK GRID across the whole district.
   Measured all 8 ground tiles: interior mean 115-174 vs EDGE mean 27-67 (a
   near-black border on every tile, which is the constitution's own "NO black
   keyline" rule broken), and wrap discontinuity 27-47 where a normal interior
   neighbour step is ~9 - three to five times. Cropping does not save them (6px
   inset still 1.73x). Reproduced the grid THREE ways before blaming the art
   (per-cell scaled / pre-scaled pattern / native-size world-anchored pattern);
   a symptom that survives every change to how it is drawn is in the source.
   NOTHING SHIPPED - a grid over twenty districts is worse than the generic pass,
   and the pool was NOT left loaded-and-unused (that is the defect
   banks_used_gate.js exists to catch). Full measurement + the three ways out:
   records/BOHEMIA_DESERT_POOL_SEAM_FINDING_7_28_26.md
   THE STANDING LESSON: a bank's provenance line is a CLAIM, not a fact. He
   thumbed those images on LOOK; nobody ever measured their tiling. Measure the
   property you are about to rely on before it becomes a district's floor.
   | de-border the pool / shop GROUND_SEAMLESS_SET + TERRAIN_PICKS / dress
   districts by structure instead | his pick |
0b. DISTRICT ART (now the lane's top gap). The other districts are WALKABLE but
   wear a generic material pass laid from the world's own tile names. Each type
   needs its own dressed language the way the suburb has one, built to the
   constitution. | per-type material map + a real-surface screenshot each |
   the frozen tileset is frozen; new tiles register in target_match_gate | yes.
0c. DISTRICT ART / MUSIC / DAY CYCLE (ledger priorities 3-5), in that order.
0d. (discovered 7/28, ENGINE REALITY AUDIT — laws/BOHEMIA_ENGINE_REALITY_MAP_
   7_28_26.md, all claims file:line-cited there) FOUR REAL DEFECTS ON THE
   SHIPPED RUN, all integration work, all REUSE-FIRST (the engine halves
   already exist):
   (a) THE RUN IGNORES THE STREAMING ENGINE. loadCell() does a synchronous
   16,384-tile full regen + buildSim() on EVERY district crossing (measured
   25-40ms cold on desktop — a visible phone stall) while bohemia_world.js's
   stream()/LRU path is proven <5ms by streaming_gate. Adopt w.stream(),
   stop rebuilding the whole grid. | streaming_gate-class timing asserted on
   the run's own crossing path | engine stays untouched | no.
   (b) SAVE BUG: saveBlob stores px/py but NOT the current CELL — loading
   after a district crossing restores the right coordinates in the WRONG
   district. (c) SAVE BUG: applyBlob reseeds the sim with base SEED while
   buildSim uses SEED^cellX^cellY — load and the neighbours are different
   people. | run_gate: save->cross->load round-trip proves same cell + same
   residents | — | no.
   (d) WIRE bohemia_daycycle (REUSE-FIRST: the module is FINISHED and has
   zero current consumers; the run's clock already advances and the screen
   never changes). This IS ledger priority 5, the module already exists.
   | ambient on the real surface, screenshot | — | no.
0e. (routed 7/28 off Paolo's accelerator ask — research record: records/
   BOHEMIA_RESEARCH_FRICTIONLESS_ACCELERATORS_7_28_26.md) PLAYTEST
   TELEMETRY: the run keeps a lightweight local event log (positions per
   step, cell crossings, enter/leave, verbs used, fights, deaths, saves,
   where the session ENDED) and exports it EXACTLY like the save blob — one
   text code Paolo pastes into any chat, a flow he already knows. Research
   consensus: where-he-quit beats any survey, and simple logging beats
   flying blind. Companion (SHARED tooling): a reader that renders a pasted
   log as a path/death heatmap over the real map + a plain-English digest
   ("14 min; quit 40s after the mall; never opened the phone"). Playtest
   notes become first-class verdicts without him writing them; lanes stop
   interrogating him about what happened on his phone (the trapped-by-the-
   copy-menu bug would be ONE LINE in a log). Local only, in the blob he
   chooses to paste — no service, no network. | log captured on a real
   session + reader digest gate-checked against a scripted walk | save/
   export pattern already shipped | no (tooling; his playtest is the input).
1. Phone-feel pass on the run (touch responsiveness at arm's length): real
   device-shaped viewports, hold-to-walk tuning, tap-to-step target sizes,
   the objective bar at arm's length. | run_gate extended with a real-device
   viewport pass | engine/bohemia_loop.js (flag needs to WORLD) | no.
2. (discovered) WIDEN THE RUN: the run is one seed-7 block. Walking off the
   block into the neighbouring district is the next real milestone — needs the
   world model's plot-to-plot transition, not new content. | run_gate proves a
   second district reached on foot | district engines (CITY lane owns them) | no.
3. (discovered) The player is not registered in ctx.scheduler, so the run's
   grid clock is the block sim's, not the loop's turn scheduler. Engine request
   for WORLD: a player actor the run can commit() through. | loop gate section
   | engine/bohemia_loop.js | no.
4. (discovered) Only S01 is wired into the run. Once placement is ruled, the
   other twenty canon quests should be reachable from a run surface too. |
   run_gate covers a second quest end to end | quest text | [PENDING Paolo
   placement].

## WORLD
GM. GDD MECHANICS ROUTED 8/4 (from records/BOHEMIA_GDD_MECHANICS_LEDGER_
   8_4_26.md — designed-and-LOCKED in the GDD, in nobody's queue until now;
   all mechanism-first, tables empty per mechanism-mine):
   (a) THE SUCCESSION SYSTEM SKELETON (v4's "signature mechanic", was
   falling through the cracks): roles-not-pointers registry + vacancy-as-
   contested-event + anti-soft-lock fallback/graceful-close. Ships EMPTY of
   named leaders (PEOPLE's dossiers supply them). Kill-anyone is already
   ruled; this makes it mean something. | headless: kill a role-holder,
   watch a deterministic struggle resolve, gated | who wins where = his
   verdicts later | no.
   (b) BROWNOUTS/BLACKOUTS (v3 LOCKED): act-1-frequent power instability
   events on the world state (composes with daycycle wiring + clustered
   power + LIGHT=TERRITORY); RUN consumes the visible moment; BLACKOUT-AS-
   ESCAPE is a story beat for later, note it. | event fires headless + seen
   on the real surface | — | no.
   (c) FUSED CONSEQUENCES (v4 LOCKED): planted events with fire-turn +
   warning-lead on the resolver/scheduler ("you're gonna wanna pull up
   soon"). | headless fuse + warning, gated | warning specificity = PENDING
   Paolo | no.
   (d) ACT-1 TRADING HUBS (v2): 2-3 hubs on the map as the economy
   skeleton's physical home — placement mechanism only, which buildings =
   the overmap's existing hub canon. | hubs queryable + reachable | — | no.
   (e) folded into the braid skeleton: INFRASTRUCTURE TAXATION (patrol ->
   passive income -> lose patrol lose income) + MAYOR-ARC RUNGS (territory
   -> ~49% mandate -> pseudo-mayor) — both keystone-native. | with the
   braid gates | numbers = his | no.
EC. THE ECONOMY SKELETON (assigned 7/29 off Paolo's big-missing dispatch —
   records/BOHEMIA_THE_BIG_MISSING_7_29_26.md item 3): the three ruled
   currencies (medicine/electricity/resources, GDD v5 LOCKED) get a running
   LEDGER: quest payout hook, a price table, a spend sink API — EVERY TABLE
   SHIPS EMPTY per mechanism-mine (payout amounts, prices, convoy cadence,
   the guarantor seat are ALL [PENDING Paolo], flagged NO_RULING by name
   exactly like world_resolve does). The RUN's game-day loop (RUN 00)
   consumes this the day it exists. | ledger + hooks gated headless; an
   unruled economy visibly reads unruled | century rule + time-is-spent
   compose here | no.
ER. [DONE 7/29 — see 0X] (discovered 7/28, ENGINE REALITY AUDIT — laws/BOHEMIA_ENGINE_REALITY_MAP_
   7_28_26.md) TWO ENGINE GAPS THIS LANE OWNS:
   (a) VERTICALITY'S ENGINE HALF. Paolo's stated direction: 2-3 story
   buildings with climbable stairs. Today: floorplan vocabulary is only
   floor/wall/door (bohemia_floorplan.js:58, "multi-floor stacking" in its
   own pending list), no z-level on any surface, story:2 data dies unused,
   and bohemia_garage.js already generates real 2-6 deck structures with
   ramps + stair cores that NOTHING renders or walks. The work: a 'stair'
   tile kind + a floor index in floorplan state (each level still ===
   footprint per the interior law). The garage decks are the free pilot —
   generation exists, only walk is new. Stair TILE ART is already filed
   (BOHEMIA_TILE_REQUESTS.md row 1). | headless: an actor climbs floor 1->2
   in a floorplan, gated | render half lands with RUN/CITY after | no.
   (b) PHANTOM DESERT RESIDENTS. homeFootprints treats ANY code 2/9 blob as
   a house (bohemia_suburb.js:196) — measured: a desert cell yields 78
   "homes" and 64 residents with sleep schedules living in rock formations.
   Filter by district family before granting households. | agents gate:
   desert/arterial cells produce 0 households | — | no.
   (c) RULED 7/28 — VEGAS WEATHER (laws/BOHEMIA_ADDENDUM_VEGAS_WEATHER_
   7_28_26.md): weather EXISTS. Three states total: MOSTLY SUNNY (default),
   MOSTLY CLOUDY, RAIN (rare — about once a month of game time, an event).
   NOT TOO DIVERSE is the law: no fourth type, no seasons-of-weather. Dead
   foliage is the world's BASELINE, never a weather effect; rain wets the
   ground and revives nothing. Build as a world state the resolver/day
   machinery carries; wire TOGETHER with the finished-but-unwired daycycle
   module (reuse-first), not as rivals. Distribution ratio is his ruling and
   ships as table contents; overlay/wet-ground art goes through the TILE
   REQUEST BOARD (rows 5-6, filed). | weather state headless-gated + seen on
   the real surface | render passes land with RUN/CITY | no.
V-1. [VERDICT IN 7/27 — 10 up / 32 down / 3 unjudged of 45. "it was mostly all bad",
   "nothing here was perfect all need work fr"]
   Raw: records/BOHEMIA_VERDICT_BULK_DISTRICTS_7_27_26.txt
   Read: records/BOHEMIA_BULK_VERDICT_ANALYSIS_7_27_26.md
   NOTHING IS BEING REBUILT OFF IT. STOP PRODUCING: a bulk rejection is a signal the
   BAR is not met, not a work order for 32 rebuilds.
   THESE ARE REWORK, NOT KILLS, by his own words ("needs work" / "could be better" /
   "needs more" / "all need work"). NOTHING GOES TO THE GRAVEYARD off this verdict —
   a misread would delete most of the valley, and GRAVEYARD IS FINAL.
   AND MY OWN TOOL PUT A THUMB ON IT: the bulk judge rendered plots as FLAT PALETTE
   COLOURS, which is not what the game draws. That is a side-door probe, which
   VERIFY ON THE REAL SURFACE calls a lie outright, shipped by me one message earlier.
   The split it forces: ICON complaints are real art and fully valid; LAYOUT
   complaints (parking, scale, what is where) are valid because a schematic shows
   layout truthfully; "looks like shit" on a colour grid is a fair reaction to a
   colour grid and is not yet a verdict on the district's art.
   THE BLOCKER, and it is not in this lane: the tile set covers ONE residential
   street, and the CITY tab does not use it at all. 44 of 45 districts have NO ground
   art. Every look verdict comes back the same until a tile family exists per
   district type. That is ART's item 1; redrawing layouts will not move it.
   ACTIONABLE AND MINE, pending his order on sequence:
     (a) LAYOUT: commercial + ballpark parking (walkable-land), library scale
         ("the worlds biggest library"), farm growing row crops in the Mojave,
         interchange + rail + airfield readability, waterpark.
     (b) ICONS: firestation + campus bugged, storage bad, solar needs more panels,
         commercial needs loving, courthouse building bigger, cemetery has none.
     (c) HIS CALL, never invented: is the school a high school or a middle school;
         and he noted he never asked for the town district.
V0. [DONE 7/27 — HIS ORDER] JUDGE EVERYTHING, BULK AND ONE BY ONE.
   Paolo, verbatim, in the same breath he approved the town and the ballpark:
   "is there anyway i can comment and judge all ur work in bulk and individually".
   That is a complaint about the VERDICT SURFACE and it was fair: the judge pages
   were one-subject and scattered, nothing put a district's GROUND next to its ICON,
   nothing cleared forty items in one gesture, and most were reachable only if you
   knew the filename. A verdict cost him a hunt per item, and STALE UNJUDGED IS DEAD
   did the rest.
   slices/BOHEMIA_BULK_JUDGE_7_27_26.html (tools/bohemia_bulk_judge.py): all 45
   districts, one row each, THE PLOT YOU WALK beside THE CITY ICON because they are
   meant to read as the same place and that is only judgeable side by side. Per row:
   thumbs + a comment. Per category: ALL UP / ALL DOWN. Global: ALL UP / ALL DOWN /
   CLEAR, a live up/down/left counter, and NEEDS A LOOK which hides everything already
   judged so a second pass only shows what is left. SUN MODE, global comment, export
   .txt. REACHABLE: a card at the top of the LIFE hub, so it is not another file he
   has to know the name of.
   COOKS NOTHING (REUSE-FIRST): plates render from the existing grid dump, icons are
   read verbatim out of the existing hero bank.
   FOUND DOING IT: tools/bohemia_district_grid_dump.js was missing suburb and
   substation, two real DISTGEN types — so every consumer of that dump has been blind
   to them. Added. (gated + estate legitimately share the suburb generator.)
   VERIFIED ON THE REAL SURFACE: booted the hub in a 390x844 browser, tapped the card,
   landed on the page, 72 plates loaded, exercised bulk + individual + toggle-off +
   comment + export and read the exported .txt back. Zero console errors.
ICON LAW (Paolo 7/27, LOCKED — laws/BOHEMIA_ADDENDUM_ICON_WITH_EVERY_BUILD_7_27_26.md):
"anytime you build something like this you have to make a city builder icon as well like
for real." A district or surface is NOT FINISHED until it has a city builder icon (a
DISTRICT HERO), the same turn the ground ships. Gate ICON is a ratchet: new work cannot
add debt, and the named debt list may only ever shrink.
I0. [DONE 7/27] rail + interchange heroes, built the approved way (hand-built 3D volumes
   matched to the walkable district, palette pulled live from the engine module, full
   PARTS dossier). Wired into the CITY tab. Gate ICON, 17 checks.
I1. [HELD — needs Paolo's ruling, do NOT just retry] AIRPORT + AIRBASE HEROES. Both
   builders are written, correct and left in tools/bohemia_district_hero_factory.py, but
   deliberately OUT of the HEROES dict because the signature does not read. The aeroplane
   geometry is NOT the problem — baked alone on a bare plate it reads unmistakably as an
   aeroplane, verified. The problem is SIZE: every other hero's signature is a BUILDING,
   which survives shrinking to a 1x1 plot; an airfield's signature is an AIRCRAFT, and a
   plot holding a runway + a taxiway + a terminal has no room left to make it legible.
   Four attempts are written up in the factory so nobody re-walks them. THE QUESTION FOR
   PAOLO: should an airfield hero DROP the runway and show just the terminal and the
   aeroplane, big? That is a composition ruling, not a code fix.
I2. THE ICON DEBT, 22 of 44 registered types (gate prints it every run): suburb, trailer,
   apartment, wash, cemetery, drivein, golf, jail, chapel, landfill, railyard, substation,
   watertreat, boneyard, waterpark, airport, airbase, arterial, freeway, desert, mountain,
   water. Terrain (desert/mountain/water) may not want a building hero at all — that is
   a separate ruling. Chip at this list; it can only shrink.
I4. [FIXED 7/27] tools/bohemia_district_grid_dump.js had the SAME hard-coded scratch
   path defect as I3, pinned to a different dead session. Portable now. Worth a sweep:
   any tool that writes to a session scratch dir should read BOHEMIA_SCRATCH first.
I3. [FIXED 7/27, found while doing I0] tools/bohemia_district_hero_factory.py had its
   scratch path HARD-CODED to one session's private directory, so the factory could not
   be run by anybody else at all — the palette dump died on check=True before the first
   hero was built. Session-portable now (BOHEMIA_SCRATCH, else the system temp dir).
0. [DONE 7/27 — HIS ORDER, top of the queue] THE ONE MAP.
   laws/BOHEMIA_ADDENDUM_ONE_MAP_7_27_26.md. The phone's map app drew a SCHEMATIC:
   gradients, two glyphs, and one tiny square per building lot. It now renders THE
   REAL GENERATED VALLEY, cell for cell, from engine/bohemia_valleymap.js — the ONE
   shared renderer the city-builder MAP tab now reads from as well. Quest pins on top,
   grouped by cell (21 quests land on 13 cells, so a stack reads as a stack with a
   count instead of three glyphs hiding each other). Tap any cell and it tells you
   what is really there, straight off the world model. Gate ONE MAP, 37 checks.
   WHAT THE JOB ACTUALLY UNCOVERED, and it was worse than a re-skin:
     a. THE PHONE WAS RUNNING A WORLD MODEL WITH NINE GENERATORS MISSING. arterial,
        freeway, terrain_noise, airfield, desert, mountain, water, rail and
        interchange were never in build_current_slice.js's MODS, so the railway, the
        freeways, the interchange, both airfields and all three terrains rendered as
        nothing on the phone while the MAP tab drew them properly. Fixed and gated.
     b. FOUR INDEPENDENT VALLEY RENDERERS, no shared layer, tone tables copy-pasted
        between files with comments admitting it. The MAP tab's private copies are
        gone; it reads the shared module now.
     c. DEAD CODE IN THE MAP APP: wm.hubs and wm.routes were read every draw and
        buildRealWorldMap has never set either one.
     d. THE PLAYER STOOD OUTSIDE THE WORLD. tile 128,128 on a 96-cell valley, so the
        blip — the one thing on the map that is YOU — was permanently off the canvas.
   STILL OPEN, and it is a real one: the placement-verdict overrides. The pins read
   ctx.quests.castTarget, which hashes into a faction's territory list, so one faction
   base attracts every quest that demands it. engine/bohemia_quest_placement.js exists
   to fix exactly that and NOTHING CONSUMES ITS OUTPUT yet. That is [PENDING Paolo] —
   the judge page is built and unjudged, and the WORLD-BEFORE-QUESTS park only lifted
   far enough to DRAW pins, not to decide where they go.
A. [FILED BY VERDICT 7/26 — records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt] ADOPT THE
   RESOLVE POINT. Paolo APPROVED it and RULED its shape in the same breath: "sleep
   can be hangout or eat too u know" — the world resolves at ANY BLOCK OF TIME THE
   PLAYER SPENDS, and sleep is only the biggest one. Law:
   laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md
   engine/bohemia_resolve.js ships the machinery: a resolver takes a declared list
   of moments each carrying a size, a system declares which moments it answers, an
   undeclared moment is a build error, systems cannot read each other, and one
   broken system cannot eat the time the player spent. Register the world's systems
   as steps (territory, who noticed you, the overnight feed, decay) and run them at
   a spent block instead of scattering them across the tick.
   [PENDING Paolo] THE MOMENT TABLE: which moments exist beyond his three examples
   and HOW LONG EACH SPENDS. And the action cost table. Do not invent either.
LANE RULING (Paolo 7/26, LOCKED — laws/BOHEMIA_ADDENDUM_WORLD_BEFORE_QUESTS_7_26_26.md):
"we need to actually build a fucking world." This lane does NOT work on quests. Every
quest item is PARKED until Paolo himself reopens it. Build ground, not plumbing for
stories the world cannot host yet.

0. [DONE 7/26, freeze lifted] THE FIVE SURFACES CONFORM TO THE VISUAL CONSTITUTION.
   Built during the freeze and flagged PROVISIONAL SKIN; the moment Paolo ruled the
   target CBB they were measured against it and the 5 out-of-band palette entries
   (road paint, crosswalks, stop bars, the lake ring) were toned into their layer's
   value band. Locked by a CONSTITUTION CONFORMANCE section in roadcell_gate and
   terrain_gate, which read the constitution at run time. Any NEW cook in this lane
   passes the same section plus the fleet's proxy gates, and any new art BANK
   registers itself in target_match_gate.py.
0c. [DONE 7/26] STREAMING: bounded LRU plot cache (64 cells) + w.stream() warming the
   ring ahead of the body + the walk surface streaming before it steps. Walking the
   valley used to grow without limit toward ~1.8 GB; it is now flat, and a boundary
   crossing costs 0.03 ms. Gate: STREAMING. RESIDUAL for a SURFACE lane (not WORLD):
   the ~30-40 ms first-touch of a fresh cell wants an idle callback or a worker inside
   the run/city frame loop.
0b. [PENDING Paolo] ACT TRIPTYCH for the five surfaces: act-2 recovering and act-3
   rebuilt materials. Content, his call, recorded in every dossier.
1. DONE 7/26: THE GROUND IS BUILT. Roads (arterial 2,434 + freeway 952) and terrain
   (mountain 927 + desert 620 + water 74) all generate real ground on one continuous
   valley-wide noise field. Valley: 40% -> 95% generated. Gates ROAD CELLS + TERRAIN.
   WHAT IS LEFT UNBUILT, in order of size, and it is all LANDMARK work now:
     a. [DONE 7/26] airbase 54 + airport 40: engine/bohemia_airfield.js, built across
        the CLUSTER (new clusterBoundsOf rung on the world model) so one runway spans
        the whole field. Gate AIRFIELD, 20 checks. FOLLOW-UP (discovered): the field
        reads as clean bands and wants dressing — drifted sand over the pavement,
        cracked slabs, blast staining, wrecks off the taxiway. Cheap, and it is what
        would make it read finished rather than merely correct.
     b. [DONE 7/27] rail 90 + interchange 16, and they turned out to be nothing like
        "network tiles like the roads, same machinery" — that line in this backlog was
        wrong and both had to be built as their own thing.
        RAIL (engine/bohemia_rail.js): a railway has no lanes, no median, no sidewalk
        and no intersections, so it gets its own vocabulary — a two-track ballast prism,
        cess, ditch, a maintenance road on ONE side, a right-of-way fence, and rail-served
        industrial frontage outside it. Passing sidings keyed on the CELL COORDINATE so
        they run 16 cells and taper into the main through real point blades. 17 at-grade
        crossings where the mile grid meets it. THE LINE IS ONE LINE for the whole valley:
        world.js's new continuityLinks looks THROUGH a crossing surface, and
        bohemia_freeway.js now carries the ballast and rails UNDER its deck, so the
        mainline is not severed into three pieces at the freeways. Gate RAIL, 36 checks.
        INTERCHANGE (engine/bohemia_interchange.js): the stack, solved across all 16
        cells as ONE PURE FUNCTION of valley position — no per-cell buffer anywhere, which
        the gate proves outright via the exported solve() rather than inferring it from
        seams. Two mainlines, one decked over the other on piers, eight ramps (a tight
        connector and a directional flyover per quadrant), two retention basins, the wall
        track, and the jam that starts here. Approaches come from the MAP
        (world.js clusterApproach), not from a symmetry assumption. Gate INTERCHANGE, 43.
     b2. [DONE 7/27, FOUND BY LOOKING] THE INTERSTATE WAS RENDERING AS A LATTICE. 926 of
        the valley's 952 freeway cells were drawing themselves as a four-way junction,
        because the overmap lays an interstate TWO CELLS WIDE and the module read "any
        freeway neighbour" as its axis — so the third neighbour, which is the PARALLEL
        CARRIAGEWAY, looked like a crossing. The corridor came out as a grid of tan
        embankment squares. A cell's axis is now the direction it has BOTH neighbours in,
        the odd one out is named as parallel, and no sound wall stands between two
        carriageways. Gated in roadcell_gate (crossroads must stay under 5%).
        This was my own 7/26 work. It shipped with all gates green because no gate
        looked at the SHAPE of the corridor, only at whether you could drive through it.
     c. [IN PROGRESS] THE SMALL LANDMARK SET. 88 buildable cells were flat.
        [DONE 7/27] CAMPUS 16 + SPEEDWAY 12 — the two biggest — as real kit districts,
        street-aware on every orientation, drivable from the curb, full dossiers, gate
        LANDMARKS (52 checks), AND their city builder icons the same turn per the icon
        law. Valley 96.7% -> 97.0%.
          THE CAMPUS'S WHOLE JOB IS THE QUAD: an open middle with the halls turned to
          FACE it, the colonnaded library as the biggest mass, a fan-plan lecture hall,
          a residence row apart, and the parking pushed to a ring because a campus core
          is walkable on purpose. The gate measures the distinction that matters — the
          quad must BEAT the pavement, or it is a business estate wearing the word.
          THE SPEEDWAY'S IS THE OVAL: a closed ring you could drive a lap of (the gate
          floods it and requires it to come back round), painted apron inside the
          banking, grandstand on the FRONT STRETCH ONLY because three of four sides of
          a superspeedway have no stands, pit road and garages inside, the road course
          ghosting through the infield, and the spectator TUNNEL.
          FOUR REAL BUGS THE GATES CAUGHT, all of which looked fine rendered:
            - the campus lots did not touch the ring road: driveReach 0.54, half the
              pavement unreachable. A lot you cannot drive into is a painted rectangle.
            - the speedway apron was inset from the plot edge: driveReach 0.00 with a
              full car park on it.
            - all five speedway light towers were placed OFF the grid (the oval nearly
              fills the plot), so not one tile of them existed.
            - THE TUNNEL SKIPPED THE FENCE. It read "goes under, not through" and so
              never pierced the catch-fence ring, sealing the oval: only 39% of the
              walkable plot was reachable from the street and you could not get to the
              track, the infield or the garages at all. Now 100%.
        [DONE 7/27] TOWN 9 + BALLPARK 8, same method, each with its icon the same turn.
        Gate LANDMARKS grew 52 -> 107. Valley 97.0% -> 97.2%.
          THE TOWN IS A BLOCK, NOT A MAIN STREET. The first version had every correct
          PART and was a BARCODE: five full-height stripes running unbroken top to
          bottom, all in the same brown. Found by rendering it and looking. A town's
          structure is not its street, it is its BLOCK, and a block is what you get
          when CROSS STREETS cut the row; a main street with no junction is a corridor.
          Three cross streets, varied unit widths, anchors on corners. Also: everything
          was one brown (it separates by MATERIAL now), the boardwalk was invisible,
          and the fallen town sign spanned the full carriageway and stranded 34% of the
          drive network north of it.
          THE BALLPARK IS A WEDGE, NOT A RING — a stadium is a closed ring around a
          rectangle, a ballpark is a quarter circle opening away from one corner, and
          getting that wrong makes this the stadium district again. THE COORDINATE
          SYSTEM IS THE DESIGN: not x and y but a (how far ALONG a foul line) and q
          (how DEEP into foul territory), so the bowl is three bands of depth that wrap
          the plate and run down both lines on their own. The first version used RADIUS
          from home plate: a ring behind the plate is a ring, so the seating came out
          as two disconnected wings with a hole where the backstop belongs.
          THE BUGS: (1) G.rect takes (x0,y0,x1,y1) and I passed (x0,x1,y0,y1) —
          systematic, across both districts; the town's alleys and the ballpark's
          dugouts and bullpens never drew at all. (2) The bullpens were axis-aligned
          rects drawn straight through the lot ring, severing the parking (driveReach
          0.76 against a 0.85 bar) and merging into the grandstand blob. (3) Foul
          territory was one solid dirt apron and the park read as a brown blob.
          (4) The lot was a barcode too. All four found by measuring or by looking.
          THE ICONS: the ballpark's is drawn from BEHIND HOME PLATE, which is not a
          style choice — put the plate at the front and the grandstand stands between
          the viewer and the whole park. Home at the back corner means the foul lines
          run along the two ground axes, so the infield square renders as a true
          DIAMOND in the 45-degree view for free. Two iterations after that: the bowl
          wrapped 270 degrees and read as the STADIUM icon (200 now), and the outfield
          wall was as tall as the stands (a low fence now).
        STILL FLAT (44 buildable cells): basin 8, convention 6, datafort 6, prison 4,
        dam 4, reservoir 3, plus a tail of single-cell landmarks (reclaim 2, granary,
        fort, springs, radio, minigp, arsenal, gypsum, pumpstation, intake, quarry).
        Same method, two at a time, each with its icon.
     d. NEVER AUTO-GENERATED, by law: strip 81, resort 118, casino 5, luxor, sphere,
        strat, highroller, sign. Paolo's hand. Leave them reserved.
2. [DONE 7/27] AMBIENT ENCOUNTER DIRECTOR. engine/bohemia_encounters.js, built on
   his "Approve all" (records/BOHEMIA_VERDICT_ACT1_ROSTER_7_26_26.txt). All 12 act-1
   tokens under the verdict's own names, each with the VERB that makes it different
   (variety is a verb, never a bigger HP bar) and the beat telegraphs the roster
   specified. The whole approved pacing package is held and measured:
     70/20/10 by a DEFICIT CHOOSER, not dice — and the class is NOT NEGOTIABLE. The
       first build substituted another class when the wanted one was on cooldown and
       came out 40/42/18; if the story wants an ambient beat and none is available,
       NOTHING HAPPENS rather than a forced fight standing in for it. Now lands on
       70.0/20.0/10.0 over a long walk.
     STORYTELLER BUDGET — spends big when healthy and quiet, small after hard fights.
       A hurt player with a hot recent past measurably gets fewer encounters.
     ~90s FLOOR, RARE IS SACRED (spice once a session, ever), NO REPEAT-SPAM.
     NO GLOBAL SPAWNS EVER — held by construction: there is no fallback table, so a
       district with no entry spawns nothing and says so.
     NO BACKGROUND TICKING (his pacing ruling) — the module owns NO CLOCK at all: no
       timer, no interval, no Date.now. It is PULLED through the encounters socket in
       bohemia_world_resolve.js. Standing still forever produces nothing, gated.
     PRECONDITIONS THE ROSTER STATED are honoured and an unproven one is a NO: the
       bounty squad only exists because of your own murders, the spotter drone only
       patrols owned light (LIGHT=TERRITORY), patrols collide only at a seam.
   Gate ENCOUNTERS, 46 checks. Enemy ART is explicitly NOT this item (the verdict
   files it as a separate fresh-look judge under approved-assets-first).
   NOT YET LIVE, and this is the honest state: the director is built and its socket
   exists, but nothing spawns until (a) Paolo rules the MOMENT TABLE so the world
   resolver actually fires, and (b) somebody supplies the district+day/night table,
   which is content nobody has ruled. Both are one call away, neither is guessed.
3. INTERIORS FOR THE GROUND THAT HAS THEM: coordinate with CITY (they own the district
   interiors item) so nothing is built twice. | — | CITY lane's item 1 | no.
4. [DONE 7/26] Engine support for RUN, request 1 of 2: THE VALLEY TILE + CROSSING
   (world.tile / solidAt / step / walk / route). The run can now ask the world model for
   any tile in the valley and walk across cell boundaries on real ground; gate CROSSING
   proves district -> street -> district on foot. RUN's ledger priority 2 is unblocked.
   [DONE 7/26] request 2 of 2 as well: THE WALK SURFACE
   (Loop.makeWalkSurface + ctx.walk) — a player actor in a real loop scheduler in
   valley tile space, blocked by the world's own tiles, with commit/routeTo/follow.
   Gate CROSSING is 22 checks and walks it end to end. RUN item 3 is unblocked.
5. Further engine support requests flagged by RUN (as they arrive, priority). | per
   request | — | no.
5. (discovered 7/26) VALLEY COMPOSITION: 70% of the built valley is suburb, and there are
   301 solar cells but 1 library, 1 firestation, 1 jail. Whether that is the city he wants
   is a DIRECTION call. | — | — | [PENDING Paolo].
6. (discovered 7/26) Faction bases are an even stride across the district list, so all 14
   factions sit on suburb tracts holding 1 cell each. Whether a faction's ground should
   match its trade is his call; the mechanism is a small change to bootFactions.
   | — | — | [PENDING Paolo].

PARKED BY THE 7/26 RULING (do not pick these up):
- P1. Quest placement picks -> apply as a casting-bridge override. The candidates shipped
  (all 21 quests after the QUESTS lane folded theirs in) and the judge page is live in
  the LIFE tab; it stays there, unjudged, unsurfaced.
- P2. World bridge deepening (quest outcomes moving factions on the map).

## LIFE / SOCIAL
A. [FILED BY VERDICT 7/26 — records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt] ADOPT THE
   RATION AND THE STANDING CEILING. Paolo APPROVED both.
   RATION (engine/bohemia_resolve.js makeRation): limit favours, posts and gifts by
   COUNT per day and per week, NEVER by money. A priced limit stops mattering the
   moment the player is rich; a rationed one never does. The bypass slot is the
   birthday shape: an occasion that ignores both windows and can pay a multiplier.
   CEILING (makeCeiling): faction standing gets a WALL you cannot grind through.
   You reach it by doing jobs and you only pass it by COMMITTING (taking a side,
   burning a bridge), and neglect gets more expensive the deeper in you are.
   [PENDING Paolo] THE NUMBERS: how many favours per week, where each faction wall
   sits, what commitment moves it, what neglect costs per rung. Do not invent them.

## CITY
ER. (discovered 7/28, ENGINE REALITY AUDIT — laws/BOHEMIA_ENGINE_REALITY_MAP_
   7_28_26.md) THE CITY WALK SURFACE HAS ZERO PEOPLE. Human mode has the best
   render architecture in the repo (chunk LRU + canvas pool sized against the
   iOS floor, genuinely seamless streaming) and not one scheduled NPC — no
   BohemiaAgents anywhere in the decoded blob; the only movers are cars and
   planes. Meanwhile the RUN walks 28 scheduled bodies on a naive renderer:
   each surface has the half the other is missing. REUSE-FIRST: wire
   BohemiaAgents (schedules already exist) into human mode, viewport-culled.
   NOTE the WORLD ER(b) phantom-resident fix lands first or the city fills
   with desert ghosts. | people visible on the real surface, screenshot;
   memory stays inside the measured 224MB floor | agent module is WORLD's |
   no.
0. [DONE 7/26] THE WALKED WORLD WAS RESAMPLED AT EVERY ZOOM. Found by
   MEASUREMENT (tools/bohemia_render_audit.js patches the canvas before the app
   boots and records every real draw), not by reading code. 41% of all draws
   upscaled by x1.375 - the chunk bake was 16px/cell while the default zoom is
   22, so the ENTIRE ground plane was resampled, and the zoom ladder
   [11,22,44,88] is a clean power-of-two family that was being divided by the
   wrong base. 44% more landed on a half pixel because the canvas takes its CSS
   client height and an odd height puts .5 in the camera origin. Fixed:
   tools/bohemia_city_pixelfix_patch.py (TPX 16->22, whole-pixel camera, and
   canvases given their own 64-entry LRU so the bigger bake cannot blow the
   ~224MB iOS floor). Result 41% -> 0.1% and 44% -> 3.4%. Locked by
   gates/render_pixel_gate.js, a RATCHET measured on the real surface.
0A. [DONE 7/27] THE PHONE WAS EATING THE CONTROLS. He said "I can't get outside
   the suburb" and "I'm trying to copy and paste the arrow of move" in the same
   breath, and THOSE ARE ONE BUG. Movement in this game is press-and-HOLD on an
   arrow. iOS Safari's default answer to a long press on text is the selection
   magnifier and the Copy / Look Up / Search callout. The entire 33MB alpha
   contained ZERO occurrences of -webkit-touch-callout and the shell's reset
   never set user-select at all, so holding the d-pad opened the OS menu instead
   of walking. MEASURED, so the level design is cleared: every suburb sample
   sits 16-50 steps from a different district, and 7,645 of 7,649 built cells can
   be walked out of. He was not trapped by the map, he was trapped by the button.
   Fixed: tools/bohemia_touch_guard_patch.py (shell + all three frames; text
   fields keep copy/paste on purpose). Gate: gates/touch_guard_gate.js, which
   states plainly which half it can measure - Chromium does not implement
   -webkit-touch-callout, so user-select is measured on the real controls and the
   callout declaration is asserted in source.
0BD. [DONE 8/7 — I STOPPED SAYING "NOT MINE". WALL CLASS IS GREEN.] Nine gates have
   been red for days and every lane's report says "verified as other lanes'". EVERY
   LANE WRITES THAT SENTENCE -- that is how nine failures became permanent background
   noise, and a permanently-red alarm is a broken alarm.
   WALL CLASS: THE GATE WAS STALE, THE GAME WAS FINE. "THE RUN carries his border-wall
   pool at all (0 tiles)" reads like the 7/27 fix he swore for had regressed. It had
   not: the wall is there, cooked, approved, 306 TILES. On 8/2 a lane REPLACED the
   7/14 pool -- build_run_slice.js substitutes [] for __PERIM_B64_JSON__ ON PURPOSE
   (line 71) and the tiles ship as PERIM_COOK_B64 from banks/BOHEMIA_PERIMETER_8_2_26.
   txt. The gate still asserted on the retired PERIM_B64.
   AND THE PATCH TOOL COULD NOT HELP: bohemia_run_perimeterwall_patch.py prints
   "already draws his border wall. no-op." while the built pool reads []. Its guard
   checks its own marker in the SOURCE, never the OUTCOME in the built file -- the same
   shape as pages_publish_gate printing "the deploy queues, never cancels" with 18
   cancellations in the history.
   FIXED by asking for THE WALL not one spelling: tiles from the 7/14 pool OR the 8/2
   cook; decoded images from PERIM_IMG OR PERIM_COOK (the cook decodes to
   [faces[], pillar, bases[]] per design). 24/0, mutation-proven.
   DIAGNOSED NOT FIXED, both mine but needing a verdict owner: CANVAS SCALE ("OVERVIEW
   still composites SMOOTH (pixelated)" -- the claim calls that surface APPROVED SMOOTH
   and it now measures pixelated, so either a lane changed it against an approval or
   the approval moved and the gate did not) and INTERIORS ("no painted surfaces: solid
   colours only as load fallbacks (5)").
   THE PATTERN: every one of these is an INTENTIONAL IMPROVEMENT WITH A CONSUMER THAT
   NEVER FOLLOWED IT -- same as the CITY-tab deletion, the world leaving the alpha, the
   dead resolver, the art-bank split. The improvement is never the bug; something else
   still points at the old shape and its report ACCUSES THE GAME. ASK FOR THE PROPERTY,
   NEVER THE SPELLING. Record: records/BOHEMIA_THE_NINE_RED_GATES_8_7_26.md
   | WALL CLASS 24/0 mutation-proven | CANVAS SCALE + INTERIORS need a verdict owner | no.

0BC. [DONE 8/7 — ANSWERED MY OWN QUESTION; THE ASK IS WITHDRAWN] THE BLURRY BAND
   WAS THE GROUND, NOT A DEFECT. He said "lazy today" a third time and answered
   nothing. That IS an answer: stop asking. So I settled it.
   (1) DISPROVED MY OWN EXCUSE: last turn I waved it off as "the D-pad sits there".
   Hiding every overlay and re-rendering changed the numbers by EXACTLY NOTHING --
   the sampler reads getImageData off the CANVAS and the D-pad is DOM ON TOP of it.
   Never in the measurement. One command would have shown that the day I said it.
   (2) THE CANVAS ALONE via toDataURL: crisp asphalt above, big soft dirt below, an
   apparently razor-straight seam. Reads exactly like a render defect.
   (3) THE DECIDING TEST -- a render boundary is fixed to the SCREEN, content moves
   with the WORLD. Sharpest detail-drop row: cell 37,22 -> y=205, 48,48 -> y=25,
   20,70 -> y=29; HC=22 -> y=293, HC=44 -> y=205, HC=88 -> y=31. MOVES WITH BOTH.
   NOT A DEFECT -- it is the paved edge meeting open dirt.
   WHY I NEARLY GOT IT BACKWARDS: the earlier test used TEN BANDS OF 76 PX. The dirt
   region is bigger than one band, so the dullest BANDS stayed at the bottom while the
   real SEAM moved hundreds of pixels. A RESOLUTION TOO COARSE TO SEE THE THING YOU
   ARE TESTING FOR WILL ANSWER ANYWAY, AND WRONG.
   Eighth instrument catch of the stretch, and the second in two turns pointing the
   OPPOSITE way: wrong in both directions about the same band.
   LEFT AS AN ART OBSERVATION, NOT A BUG: the dirt tiles do read softer than the road
   tiles at walk zoom. Real, visible in the canvas export, ART lane's, not worth a
   question. Record: records/BOHEMIA_THE_BLURRY_BAND_WAS_THE_GROUND_8_7_26.md
   | seam moves with position AND zoom, 6 measurements | none — ask withdrawn | no.

0BB. [DONE 8/7 — I STOPPED SHIPPING INFRASTRUCTURE AND WENT AND PLAYED IT]
   Four turns running ended with "NOT IN A TAB YET". So: opened the game, visited all
   ELEVEN tabs at 390x844, photographed every one, sent the pictures to him.
   IT WORKS. All 11 tabs open, render and draw, ZERO page errors. RUN drops into the
   suburb with D-pad and BIKE live; CLOTHES carries 216 canvases; LIFE is now a hub
   with green JUST LOOK AT IT / amber NEEDS YOUR THUMB cards.
   THE DEPLOY OUTAGE IS OVER (not my fix, another lane's find): the custom `pages`
   workflow SUCCEEDED on e4070a62, first success in 30 runs, and the built-in deployer
   stopped firing -- the Pages source got switched to GitHub Actions. The link is live.
   TWO CANDIDATE DEFECTS, BOTH CLEARED BEFORE CLAIMING: (1) a blurry lower band,
   detail ~16-18 top vs ~8 bottom, fixed to the screen across three districts -- NOT
   called a defect because the D-pad and caption box sit exactly there and flat dark UI
   produces that number; the measurement cannot separate the two, and whether it looks
   wrong is TASTE and his. (2) six tabs past the right edge with scrollLeft refusing to
   move -- then swiped it like a thumb and it scrolled 0 -> 236. THE BAR IS FINE.
   SEVENTH INSTRUMENT CATCH OF THE STRETCH. Six caught, one shipped and corrected in
   public. CHECK THE INSTRUMENT AGAINST SOMETHING KNOWN-GOOD BEFORE BELIEVING IT.
   Record: records/BOHEMIA_I_WENT_AND_PLAYED_IT_8_7_26.md
   | 11/11 tabs render, 0 page errors | the blurry band is a LOOK call, one word | no.

0BA. [CORRECTION 8/6 — I OVERSTATED 0AY BY MORE THAN TWICE. RAN MY OWN TEST; IT
   REFUTED ME.] 0AY published 32.5 MB/day, a 130-day runway, and named
   slices/BOHEMIA_CITY_WORLD.html as the top driver at 20.5 MB/day. All three wrong.
   MEASURED DIFFERENTIALLY (two bare clones 5.1h apart, subtract size-pack, divide by
   commits): 899.81 MiB -> 905.58 MiB = 5.77 MB over 23 commits = 0.251 MB/COMMIT
   = 13.8 MB/day at the 7-day fleet rate, 27.1 MB/day at today's pace. Runway 155-305
   days (5.1-10.0 months), not 130 days.
   AND THE REAL BREAKDOWN, by packed size across all history: BOHEMIA_ALPHA_0_9.html
   441.0 MB = 49% OF THE WHOLE REPOSITORY (315 commits of a file that reached 38.7 MB),
   the four banks/BOHEMIA_HD_TILE_REPO_* 129.9 MB, BOHEMIA_CITY_WORLD.html only 22.7 MB
   (2.5%). THE WORLD PAGE WAS NEVER THE TOP DRIVER.
   HOW THE WRONG NUMBER GOT OUT: I summed %(objectsize:disk) over a rev-list window.
   THE SAME METHOD HAD ALREADY GIVEN 90.5 MB/day over 3 days and 257.7 MB/day over 7,
   AND I WROTE DOWN THAT THE 7-DAY FIGURE EXCEEDED THE WHOLE REPO AND WAS IMPOSSIBLE --
   then used it anyway for the per-file attribution because that part looked plausible.
   NOTICING AN INSTRUMENT IS BROKEN AND THEN TRUSTING IT FOR THE NEXT QUESTION IS WORSE
   THAN NEVER NOTICING. Git packs far better than a naive sum assumes: 219 MB raw vs
   22.7 MB packed for the same file, a 10x gap = the exact size of my error.
   WITHDRAWN: 0AZ's "about a year of runway". The split is still correct and cost
   almost nothing (git delta-compressed the tiles file against the page it came out of),
   but it saves ~2.8 MB per world-page commit, not 20.5 MB/day.
   GATED: repo_budget_gate now REQUIRES _method (differential) and _CORRECTION_8_6 to be
   present in the JSON, both mutation-proven, so the next refresh cannot quietly
   re-derive the bad number with the convenient wrong query.
   | REPO BUDGET 7/0, 2 new claims mutation-proven | 0AY options less urgent than stated | no.

0AZ. [DONE 8/6 — I PICKED, BECAUSE HE SAID HE WAS LAZY] THE ART BANK LEFT THE
   WALKED WORLD. 28.2 MB -> 1.0 MB. He declined to pick from the four options in 0AY,
   and NONE of them suited a lazy day: two change how every lane ships, and deleting
   old big files saves NOTHING because git holds every version forever and history
   cannot be rewritten under six parallel lanes. So the answer came from asking why
   the file was 28 MB at all:
       line 11021  const TP_TILES = {...}   20.92 MB   74% OF THE FILE
       + DOOR_ANIM, HERO_SRC, SIG_TILES, SA_TILES, IN_DOOR_B64, JAMB_W, JAMB_E
       = 27.1 MB of base64 art. The game code is about 1 MB.
   THE VOLATILE PART AND THE HUGE STABLE PART WERE WELDED TOGETHER. The art almost
   never changes; the code is patched several times a day by several lanes, and every
   edit rewrote all 28 MB. Same fix the 8/2 lane made on the alpha, one level deeper.
   tools/bohemia_city_split_tile_bank.py -> slices/BOHEMIA_CITY_TILES.js. NO LANE
   CHANGES ANYTHING: patch tools still edit the code, the art just is not in it.
   PROVED BEFORE APPLYING, both loaded side by side in a real browser: cv 378x819,
   TP_TILES=24 HERO=59 DOOR=10, drawn px=309582, checksum=981952 -- IDENTICAL. (Both
   showed one pre-existing ERR_CONNECTION_RESET, which is WHY both were measured.)
   AND IT LEFT THREE CONSUMERS BEHIND ANYWAY -- suite 10 -> 13 red (DOOR SWING, DOOR
   JAMB, HERO WIRE). Cause: THIS MORNING'S BUG IN A SECOND FORM. Four gates (dooranim,
   doorjamb, city_kit_binding, run_spawn) declare cityBlob TWICE -- a resolver
   one-liner followed by an old direct-file reader -- and in JavaScript THE LAST
   DECLARATION WINS, so the resolver was dead in all four. The split exposed it.
   Stale declarations deleted; hero_wire (which kept its own private list of where the
   city lives) routed through the resolver and went 61 -> 123 claims: it had never
   been seeing the whole document. bohemia_city_app.read() now returns page + bank, so
   the split is invisible to any consumer that asks properly.
   THE CLOCK, AS A PROJECTION NOT A MEASUREMENT: 32.5 MB/day minus ~20.5 should give
   ~12 MB/day, about a YEAR of runway instead of four months. THE GATE STILL USES THE
   MEASURED 32.5 ON PURPOSE -- a projection that flatters the runway is how a limit
   gets forgotten again. If the next bare-clone measurement does not show the drop,
   the split did not work and the runway is still ~130 days.
   Record: records/BOHEMIA_THE_ART_BANK_LEFT_THE_WORLD_8_6_26.md
   | 5 affected gates green standalone, boot proved identical | none | no.

0AY. [MEASURED 8/6 — THE OTHER CLOCK. FLEET-WIDE. THE CHOICE IS PENDING PAOLO.]
   THE REPOSITORY RUNS OUT BEFORE THE 11-MONTH PLAN DOES. On 8/2 a lane caught the
   100 MB PER-FILE cap (~43 days out) and fixed it by moving the world to a sibling
   page. That fixed the FILE. The REPOSITORY is a different ceiling with its own
   clock and nobody was watching that one either. Measured on a REAL bare clone:
     packed 900 MB · 54s to clone (every session pays it) · repo age 11 DAYS
     growth 32.5 MB/day post-extraction (65.6 MB/day over 7 days)
     GitHub soft warning 1 GB  -> ~4 DAYS
     GitHub HARD cutoff  5 GB  -> ~130 DAYS = 4.3 MONTHS
   ELEVEN MONTHS OF PLANNED WORK; THE REPO HITS THE CEILING LESS THAN HALFWAY IN.
   The driver is no longer the alpha (1.9 MB/day) but slices/BOHEMIA_CITY_WORLD.html
   at 20.5 MB/day -- a 28 MB GENERATED file rewritten by string surgery and committed
   whole, several times a day, by several lanes.
   THE MEASUREMENT ALMOST LIED TWICE. Local .git read 6.9 GB (3,888 loose objects,
   5.34 GiB, my own rebase churn) against a 900 MB real repo -- a 7x overstatement I
   was one command from reporting. Then the growth query said 90.5 MB/day over 3 days
   and 257.7 MB/day over 7, the latter exceeding the whole repo, which is impossible.
   Only numbers taken INSIDE the bare clone are trustworthy. WHEN TWO WINDOWS OF THE
   SAME MEASUREMENT DISAGREE, THE INSTRUMENT IS WRONG, NOT THE WORLD.
   WHAT COMES AFTER, [PENDING Paolo / fleet-wide] because it changes how EVERY lane
   ships and no single lane gets to pick it: (1) build the world page at deploy time
   from an Action instead of committing it -- kills ~20 MB/day, costs diff-reviewability
   and every patch-tool workflow; (2) Git LFS for the generated slices; (3) stop
   committing intermediates (4x 43 MB banks/BOHEMIA_HD_TILE_REPO_* plus judge/target
   PNGs are inputs and outputs, not source); (4) do nothing and re-measure monthly --
   legitimate, 130 days is real runway, it just has to be a CHOICE.
   GATED: gates/repo_budget_gate.js (suite: REPO BUDGET, 8 claims) -- the recorded
   measurement must stay fresh (<=21 days), the projected runway must stay over 90
   days, no file near the 100 MB per-file cap, and the named drivers must still exist.
   It does NOT clone to measure (54s + 900 MB every ship) and REFUSES to fake it with
   a local git count-objects for the 7x reason above: an honest stale-check beats a
   cheap wrong number. Mutation-proven three ways.
   Record: records/BOHEMIA_THE_OTHER_CLOCK_8_6_26.md
   Measurement: records/BOHEMIA_REPO_BUDGET_8_6_26.json (refresh command inside)
   | REPO BUDGET 8/0, 3 mutations caught | THE ARCHITECTURE CHOICE IS HIS | YES — one pick.

0AX. [DONE 8/4 — NOT MINE, FOUND BY READING THE MERGE, FIXED] THE SHARED RESOLVER WAS
   DEAD CODE IN ALL 13 PLACES IT WAS USED. Yesterday's extraction fix introduced
   gates/bohemia_city_app.js -- ONE predicate that knows where the city app lives, so
   the next move edits one file. Right idea. THE WIRING NEVER LANDED: thirteen gates
   contain
       f = page.frames().find(fr => require('./bohemia_city_app.js').isFrame(fr, page));
       f = page.frames().find(fr => (/srcdoc|CITY_WORLD|CITY_CURRENT/.test(fr.url())) && ...);
   and the second line OVERWRITES the first before its result is ever read. The shared
   predicate is called once per frame and thrown away; the regex under it is what finds
   the frame. All 13 are GREEN, which is the whole problem -- nothing was failing, so
   nothing was going to find it.
   PROVED: sabotage isFrame to return false for every frame in existence.
     as it is on main  -> DOORWAY GATE: 5 passed, 0 failed
     shadow removed    -> DOORWAY GATE CRASHED: no frame
   A single source of truth you can replace with `return false` without one test
   noticing is not a source of truth, it is a comment. And the loop it was written to
   end was still fully armed: next time the app moves, you edit the resolver, nothing
   changes, and 13 gates fail on "the world frame booted" again.
   THE FIX, IN THE ORDER THAT MATTERS: the shadow matched CITY_CURRENT and isFrame did
   NOT, so deleting the shadow first would have quietly NARROWED what the fleet finds --
   a behaviour change dressed as a cleanup. (1) widen isFrame to the exact union,
   unit-tested on all four URL shapes plus the main frame, (2) THEN remove the shadow
   from all 13, (3) hoist the require out of the per-frame predicate. SUPERSET FIRST,
   THEN REMOVE THE SHADOW.
   Record: records/BOHEMIA_THE_SHARED_RESOLVER_WAS_DEAD_CODE_8_4_26.md
   | doorway 5/0, zoomseam 7/0, run_spawn 13/0, shadow 7/0, stepinside 8/0; sabotage
   flips from green to crash | none | no.

0AV. [DONE 8/2 — NOT MINE, FLEET-WIDE, FIXED] THE WORLD MOVED OUT OF THE ALPHA AND
   LEFT 24 GATES BEHIND. 3ef222f lifting CITY_B64 out to slices/BOHEMIA_CITY_WORLD.html
   was right and the numbers prove it (38.7MB -> 2.92MB, first load 12,561ms -> 398ms,
   ~43 days off GitHub's hard 100MB push limit). But 81 files in gates/ and tools/
   referenced CITY_B64 and the suite went 12 failures -> 40.
   TWO MECHANICAL CAUSES, both the same shape as the CITY-tab deletion earlier the same
   day (a consumer still looking for something that moved):
     (1) a copy-pasted cityBlob(alpha) helper decoding a const that is gone. One
         injection each: page first, old scan as fallback.
     (2) frame detection by /srcdoc/.test(fr.url()) -- the frame is fr.src now, so the
         URL is a real path and matched nothing. THIRTEEN gates failed on "the world
         frame booted", which reads like the game is broken when it is the test.
   I REPAIRED ALL 24 AND THEN THREW THAT WORK AWAY, WHICH WAS RIGHT. Another lane
   landed the same repair concurrently and did it BETTER: ONE shared CITY_APP.read()
   instead of my 24 per-file injections -- a single source of truth, which is what
   FACTORY LAW asks for and what I should have written. On the rebase I took THEIRS
   for all 24 conflicted files. Keeping mine would have been ego, not engineering.
   (They had also already removed 'chapel' from icon_gate's OWED list, the same slip
   I fixed independently.) Suite 40 -> 14.
   LEFT DELIBERATELY: D1 KERB is a CONTENT ratchet tripping on courthouse and cityhall,
   caused by main's own 2fc2e3f "NO CANOPIES" ruling on the four civics. Raising another
   lane's ratchet ceiling is a design call, not a merge fix.
   THE PATTERN, THIRD TIME TODAY: an architecture change is not done when the thing
   works, it is done when everything that pointed at the old shape has been found. The
   grep takes a minute; skipping it costs the fleet a red suite it cannot tell apart
   from real breakage.
   | 24 gates green standalone, suite 40 -> 16 | D1 KERB is the civics lane's | no.

0AW. [DONE 8/2] DISTRICT FILL CAUGHT ITS FIRST REAL DROP, AND IT WAS A RULING.
   cityhall 59.8 -> 53.9, courthouse 52.9 -> 48.3, terminal 52.4 -> 50.6, chapel 56.2 ->
   55.7. Traced to 2fc2e3f "NO CANOPIES: a ruling is not a design conversation" -- Paolo
   removed canopies from the four civics. A floor exists to catch ACCIDENTAL emptying; a
   RULING re-baselines it. Those four re-baselined WITH THE REASON RECORDED in the
   baseline file, the other 45 left pinned. The gate did its job by making somebody look.
   (Also fixed: the baseline's _note key was being counted as a district, inflating the
   registry to 50 and dragging the median. Keys prefixed _ are notes, not districts.)
   | DISTRICT FILL 53/0 | none | no.

0AT. [DONE 8/2] THE ALPHA IS FOUR BLOBS IN A TRENCH COAT AND NOTHING GUARDED THEM.
   CITY_B64 (28.1M chars), COMBAT_B64 (1.06M), RIG_B64 (95.9K), PREFAB_B64 (10.6K).
   Four lanes rewrite these BY STRING SURGERY every day and every rebase resolves a
   34MB file by taking one side whole. What guarded them: PRESENCE and a SIZE FLOOR
   ("exists and is over 100,000 chars"). A stale re-encode passes both. A half-merged
   one passes both. A truncated one usually passes both -- which is exactly the damage
   this repo produces.
   PROVEN, NOT ASSUMED: (1) the game shipped a BLACK SCREEN twice today from ONE
   missing </div>, every gate green, found by a human tapping the link -- and the
   second time it wore a disguise, presenting as a dead COMBAT tab and sending another
   lane bisecting after a combat bug that was never a combat bug. (2) PREFAB_B64 can be
   silently replaced and NOTHING notices: changing a colour inside it left alpha_loads
   20/0, city_tab 64/0 and rig_is_law 12/0. No content check of any kind.
   gates/blob_integrity_gate.js (suite: BLOB INTEGRITY, 41 claims): each blob decodes,
   is not truncated (tag balance), carries NO MERGE MARKERS (a blob is where a bad
   conflict hides best -- nobody reads 28 million characters), every inline script
   still PARSES (compiled, never run), and has not collapsed. Caught all three real
   failure shapes by name, including the exact 8/2 black screen.
   THE SECOND DRAFT IS THE PART WORTH KEEPING: v1's clever tag regex reported THREE
   TRUNCATED BLOBS (63/64, 60/61, missing </script>). The blobs were fine; the ruler
   was bent -- plain counting says 64/64, 61/61, 1/1. FIX THE RULER NEVER THE TARGET.
   Third time in two turns that a "defect" was my own instrument. Before reporting one,
   TEST THE INSTRUMENT ON SOMETHING KNOWN-GOOD.
   Record: records/BOHEMIA_THE_BLOBS_WERE_UNGUARDED_8_2_26.md
   THE ARCHITECTURE MOVED UNDER IT THE SAME DAY, which is the useful part: 3ef222f
   lifted CITY_B64 out to slices/BOHEMIA_CITY_WORLD.html (alpha 38.7MB -> 2.92MB,
   first load 12,561ms -> 398ms, ~43 days off a hard GitHub 100MB push limit nobody
   was watching). This gate went RED on the merge, correctly. THE CHECK DID NOT GET
   SMALLER, IT GOT BIGGER: the game is a shell plus EIGHT big documents now (3 inline
   blobs + 5 sibling pages, each a tab surface) and every property holds for a page
   exactly as for a blob. 41 claims -> 70, re-proven on the extracted world page.
   | BLOB INTEGRITY 70/0, real failure shapes mutation-proven on both shapes | none | no.

0AU. [DONE 8/2 — ONE WORD, ANOTHER LANE'S RATCHET] ICON GATE WAS RED ON MAIN FOR A
   BOOKKEEPING SLIP. The lane that drew the chapel icon left 'chapel' on the OWED
   list, and icon_gate's ratchet fails when something listed as owed is secretly
   already done. Removed. ICON 25/0, debt now 21 of 49 honestly stated.
   NOT DONE, AND DELIBERATELY: the remaining 21 icons are HAND-BUILT scenes in
   tools/bohemia_district_hero_factory.py (a hero is authored per district, not
   generated), so they are real art production, and they land "UNJUDGED (awaiting
   Paolo thumbs)". The verdict queue is already loaded across lanes. Cooking 21 more
   for him to thumb is exactly what STOP PRODUCING forbids. REUSE-FIRST was checked
   first: 20 of the 22 owed types DO have a rendered judgecard on disk, but a judge
   card is a big verdict render, not a builder hero, so it is not a substitute.
   | ICON 25/0 | 21 icons owed, art production, needs his queue to clear | no.

0AS. [DONE 8/2 — FOUND WHILE REBASING, NOT MINE, FIXED ANYWAY] THE HANDOFF WAS ON
   MAIN WITH LIVE MERGE MARKERS IN IT, FOR THE SECOND TIME IN ITS HISTORY.
   00_START_HERE_NEXT_SESSION.md carried <<<<<<< HEAD / ======= / >>>>>>> 73aff72,
   with the SOUND lane's whole status buried inside the PEOPLE(factions) lane's.
   CLAUDE.md tells every parallel session to read that file FIRST, before doing
   anything. A conflicted handoff does not throw, does not fail to load and does not
   look broken at a glance -- it silently hides one lane behind a marker and the next
   session plans against half a picture. Highest-traffic file in the repo, and it had
   NO machine check of any kind.
   RESOLVED, both lanes' heads kept, nobody lost a word. AND GATED:
   gates/handoff_gate.js (suite: HANDOFF, 5 claims) -- exactly one handoff, at the
   canonical name, leading with a lane head, no unresolved merge in it OR in any
   tracked text file. Proven by replaying THE ACTUAL conflicted file that was on
   main: 3 of 5 claims fail and name the file.
   THE MARKER TEST IS DELIBERATELY NARROW so it cannot fail the fix it guards: only
   <<<<<<< and >>>>>>> at line start count. Bare ======= is a markdown setext heading
   underline and this repo's records are full of them, and a line that MENTIONS
   markers mid-sentence is prose about the bug, not the bug.
   | HANDOFF 5/5, proven on the real artefact | none | no.

0AR. [DONE 8/2] WHAT THE WALK COSTS, AND WHAT EVERY DISTRICT HOLDS. The follow-on
   to 0AQ, which ended "size was never the problem, filling is". Both halves checked.
   (a) THE WALK IS FAST AND PERFORMANCE IS NOT NEXT. Nobody had ever measured a FRAME
   on the surface he looks at -- streaming_gate measures the world MODEL's step cost,
   which is a side-door probe. Real alpha, RUN tab, dropped in, 390x844 @3x, ~1,350
   frames while holding a direction four ways: MEDIAN FRAME 0.6 ms, p95 1.0 ms, 0.2%
   miss 60fps, ~49 drawImage and 11.97 Mpx a frame onto a 0.29 Mpx canvas (41x
   overdraw, and not worth chasing at 0.6 ms). A whole lane of renderer optimisation
   ruled out for the cost of one measurement. OPEN, STATED HONESTLY: bursts of ~8
   consecutive 60-75 ms frames, twice -- 20% more work for 110x the time, zero
   never-seen draw sources, flat heap. It ran in HEADLESS CHROMIUM, which
   software-rasterises, so it is NOT evidence of an iPhone stutter and is not being
   claimed as one. Needs a real phone to call.
   (b) I WENT LOOKING FOR UNDER-BUILT DISTRICTS AND FOUND NONE. All 49 types ranked
   for the first time; median 45.8% content. The two that looked wrong were the real
   world modelled correctly: SUBURB 27/23/50 matches real single-family zoning (lot
   coverage caps at 30-40% PER LOT, plus streets, plus yards); CEMETERY's 61% lawn is
   917 headstones on 2.28 acres = 403 GRAVES AN ACRE, inside the real 300-600 band for
   a historic cemetery. Park/golf/desert: open ground IS the land use. TWICE IN ONE
   TURN a number that looked like a defect was reality, and both checks cost one
   search.
   SO THE OUTPUT WAS A FLOOR, NOT A WORK ORDER. walkable_gate holds the law's LETTER
   (pavement may not dominate content) and cannot catch emptiness with NO pavement in
   it -- a district with no drive surface passes however empty it gets. The law's own
   text admits it ("SPIRIT the number can't fully catch"). gates/district_fill_gate.js
   (suite: DISTRICT FILL, 53 claims) pins all 49 types at today's share plus a floor
   under the median. MUTATION-PROVEN THE HARD WAY: my first two sabotages silently did
   not apply and the gate said 53/0 both times; the third measured the effect first
   (cemetery 14.35% -> 9.23%) and the gate named it.
   Record: records/BOHEMIA_WHAT_THE_WORLD_ACTUALLY_COSTS_AND_HOLDS_8_2_26.md
   | DISTRICT FILL 53/0 mutation-proven | none | no.

0AQ. [ANSWERED 8/2, ON HIS ASK] HOW BIG IS THE MAP, IN WALKING, VS SKYRIM AND
   NEW VEGAS. He asked with "before you cut anything" in front of it, so it got a
   FLOOR as well as an answer. Measured on the canon seed: 96x96 districts, 9.22 km
   a side, 84.9 km2, 151 million walkable cells. Built districts 37.0 km2 (43.6%),
   roads/rail 32.9, desert 5.7, rock+water 9.3, ON FOOT 75.7 km2. Skyrim ~37 km2,
   Fallout New Vegas ~16.5 km2 -- so the BUILT HALF ALONE is about all of Skyrim
   and the walkable land is ~4.6 New Vegases. Walking (BEAT=500, one cell a beat,
   0.75 m a cell = 1.5 m/s, run = two cells a beat = 3.0 m/s, both read out of the
   shipped city frame): 1 h 42 m to walk one side, 2 h 25 m corner to corner.
   THE HONEST HALF, recorded so nobody quotes only the flattering one: ours are
   GENERATED km2 and Skyrim's are hand-placed. Size was never the problem and
   cutting it fixes nothing; FILLING is the problem (WALKABLE-LAND LAW, per
   district). Record: records/BOHEMIA_HOW_BIG_IS_THE_MAP_8_2_26.md.
   THE GAP IT CLOSED: valley_scale_gate pinned the per-CELL scale and nothing
   pinned HOW MUCH LAND or HOW MUCH IS BUILT, so a lane could have turned built
   districts back to desert with every gate green. gates/mapsize_gate.js (suite:
   MAP SIZE, 13 claims) floors it; shrinking to 64x64 fails 7 of 13 by name.
   | MAP SIZE 13/0, mutation-proven | none | no.

0AP. [DONE 8/2 — MY OWN REGRESSION, FOUND BY RUNNING THE SUITE AND CHECKING
   WHOSE IT WAS] DELETING THE CITY TAB BROKE TWO MORE NAVIGATORS, AND MY SWEEP
   SWORE THEY WERE CLEAN. The tab-deletion ship swept gates/ and tools/ for the
   two spellings of the dead button I had found and fixed four gates. The full
   suite then went red on two more: gates/bottomleft_gate.py (a THIRD spelling,
   getAttribute('data-p')==='city' — 30s timeout on #cityFrame) and
   tools/bohemia_canvas_scale_audit.js (the selector built from a TABS array, so
   nothing static could ever have seen it — 3 failed assertions in
   canvas_scale_gate, which is how CANVAS SCALE and BOTTOM-LEFT both showed red
   on main all day). BOTH FIXED, both gates green (bottomleft 9/0, canvas scale
   29/0).
   THE SWEEP IS NOW A PROPERTY, NOT A BLOCKLIST: one_world_tab_gate reads the tab
   bar out of the LIVE document and requires every tab any gate or tool navigates
   by to exist. AND the thing under all three, which no name check can see: THE
   FAILED CLICK WAS SILENT — `.catch(() => {})` or `if (t) t.click()`. 16 files
   carried the swallow; all 16 are strict now and the gate fails any new one, for
   tab names that do not exist yet. Law updated with the post-mortem.
   | one_world_tab_gate 92/0, sabotage-proven | none | no.

0AN. [DONE 8/2 — THE PRISON FIX FINALLY REACHED HIM] DROP IN LANDS YOU ON THE
   STREET, ON THE SURFACE HE ACTUALLY PLAYS.
   0AI built NO DISTRICT IS A PRISON into the RUN SLICE and proved it by walking
   that file. 0AM then proved he has NEVER SEEN THAT FILE. So the fix for the
   complaint he made never reached the screen he made it about - three for three
   on this lane's oldest failure.
   THE CITY FRAME'S DROP IN put him at the centre of the cell the camera was
   over, then spiralled to the first WALKABLE cell - and walkable includes
   dead-dirt back yards, so it landed him behind a house inside a walled
   subdivision facing a wall.
     worst search to find a road: 9,432 tiles  ->  3 tiles
   Every drop-in now lands ON a road or TOUCHING one. PREFERENCE not filter:
   road, then touching-a-road, then any walkable cell exactly as before, so
   nowhere becomes unreachable. NO WALKABILITY CHANGED - only which walkable
   cell the camera hands you, which is why it cannot regress 0AI.
   | tools/bohemia_city_dropin_on_the_street_patch.py
   | gate: NO PRISON 15 -> 19, new section D drives the city frame's own
     swapMode() (the real DROP IN). Proved able to fail: disabling the road
     preference puts the worst case straight back to 9,432. | 8/2 | YES - tap
     RUN, hit DROP IN anywhere, you should be standing on a street.

0AO. [FLAGGED 8/2 — PARKED BY PAOLO, DO NOT RAISE IT. "just worry about the
   coding and plumbing for now." It stays recorded as PLUMBING DEBT, not as a
   question for him.] TWO LIVE ANSWERS TO
   A NUMBER HE RULED. Measured today, both on main:
     bohemia_population.js (the 7/29 zone map, HIS ruling made mechanical)
       297 people in the walkable valley - his ~300 - and 64% of residential
       cells hold ZERO by design ("some no mans lands", his words).
     bohemia_agents.js OCCUPIED_RATE, changed 8/1 by another lane to 0.038
       derived from a scale model + GDD v5's ~3% survival = 1,113 valley-wide.
   The two disagree by ~15x on the mean occupancy (0.0025 vs 0.038).
   HIS 7/29 RULING PICKS THE BASIS EXPLICITLY: "i want to go with the number
   that reflects how many people vegas can feed" - the FOOD CEILING, which is
   the zone map's path. The 8/1 derivation answers a different question (how
   many SURVIVE), and its own note says the zone map is "19x too FEW".
   SIX GATES ARE RED ON MAIN because of it (LIFE, POPULATION, DRESS, MEMORY,
   DEVIATION + others): a 19-home block now comes out with ZERO residents, and
   those gates encode the older 30% assumption.
   NOT RESOLVED HERE ON PURPOSE. The TRUTH HIERARCHY says a contradiction
   between two live files is a bug to fix if mechanical and to FLAG if
   canon-level. How many people are alive in Vegas is canon-level and his.
   | needs Paolo: food-ceiling ~300, or survival ~1,113? | 8/2 | HIS CALL.

0AM. [DONE 8/2, HIS RULING — AND THE MEASUREMENT FOUND SOMETHING BIGGER]
   ONE WORLD TAB, AND IT IS RUN. laws/BOHEMIA_LAW_ONE_WORLD_TAB_8_2_26.md
   > "the city tab will now live in the run tab. There's no point in having a
   >  city tab anymore. Make sure everything in the city tab is migrated on the
   >  run."
   HE IS RIGHT AND NOTHING HAD TO MOVE. The alpha's tab handler has read
   `PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p` since 7/28, when he
   FIRST asked ("Can you put the city in the run tab?"). Both buttons opened the
   SAME PANEL for five days. The CITY tab was a pure duplicate; it is deleted.
   No world moved, no iframe reloaded, no second instance.
   *** THE BIGGER FINDING, AND EVERY LANE NEEDS IT ***
   #p-run is display:none for the entire life of the app. THE RUN TAB HAS NEVER
   SHOWN slices/BOHEMIA_RUN_CURRENT.html. The frame is in the document and the
   alpha posts to it, but the player has never looked at it. WHAT HE SEES WHEN
   HE TAPS RUN IS THE CITY FRAME'S WALK MODE.
   CONSEQUENCE, stated plainly: the 8/1 NO PRISON fix went into the run slice's
   findHomeCell and was proved by walking the run slice in a browser. IT CANNOT
   HAVE REACHED HIM. The wall fixes, which went into the city frame, did. This
   lane's most repeated failure is fixing the surface he cannot see, and it
   happened again yesterday.
   MEASURED ON THE SURFACE HE ACTUALLY PLAYS (city frame walk mode, 4 suburbs):
   every one reaches a road - but only after a 7,400-9,400 tile search. Not a
   prison; that is why it FELT like one.
   [PENDING Paolo] whether the run slice gets SHOWN, MERGED into the city frame,
   or RETIRED is a real fork with real cost and is not decided inside a tab
   deletion.
   | tools/bohemia_alpha_one_world_tab_patch.py + 4 gates rerouted off the dead
     button | gate: ONE WORLD TAB, 167 assertions, proved able to fail two ways
   | 8/2 | YES - the tab bar is one shorter.

0AL. [DONE 8/2 — HIS CORRECTION, AND I HAD IT BACKWARDS] EVERY WALL IS TWO
   TILES TALL AND ONE TILE SOLID.
   laws/BOHEMIA_LAW_WALLS_ARE_TWO_TALL_ONE_SOLID_8_2_26.md
   > "walls should always be two tiles tall. End of story... from fencing to
   >  concrete to brick whatever, but the walkable border where it stops
   >  allowing you to walk should only be one tile... that's when the opacity
   >  matters. And then if you are south one tile below the wall, you are
   >  already doing good."
   THREE QUANTITIES, and 0AK collapsed them into one:
     HEIGHT 2 tiles (all walls; only a BUILDING is taller - a house is 3)
     COLLISION 1 tile (the wall's own cell; the covered tile STAYS WALKABLE)
     OPACITY the wall FADES when he stands on the covered tile
   MY MISREAD: he said "the wall border should end at that first tile" and I read
   BORDER as the DRAWN EDGE, shipping wallH=1 in 0AK. He meant the WALKABLE
   border. I also quoted his "a building if walls are two tiles THICK" as proof
   walls are one tile TALL - thick is footprint, tall is height.
   THE TELL I MISSED, and it generalises: his bank has said "wall height min 2
   tiles" since 7/14, and to ship a one-tile wall I wrote a long paragraph
   explaining why his bank did not mean what it said. WHEN THE RECONCILIATION
   GETS THAT LONG, THE READING IS WRONG.
   ALSO FIXED, found while checking "all walls": every kind:'fence' tile in the
   valley stood THREE tiles - the house-facade height - because the kit layers a
   fence as a structure and the CITY tab's structure branch never set a height,
   so fences fell through to WALL_H=3. Fixed BY KIND so later districts inherit
   it. No walkability changed.
   | tools/bohemia_city_wall_two_tall_patch.py + bohemia_city_fence_two_tall_patch.py
   | gate: WALL CLASS 19 -> 24, and the OPACITY clause is read OFF THE CANVAS
     (sample the pixel with him behind the wall and with him away; identical
     pixels = not fading). Proved able to fail twice: one-tile wall turns HEIGHT
     and OPACITY red - exactly the state 0AK shipped - and disabling the fade
     turns OPACITY red on its own.
   | ART FOLLOW-UP, filed not guessed (his call: "that's just an aesthetic
     decision"): his 13 tiles are complete 44x44 walls WITH A CAP, so painting
     one across two tiles puts a cap in the MIDDLE. The lower course wants the
     tile's body without its cap. ART lane's. | 8/2 | YES.

0AK. [SUPERSEDED 8/2 BY 0AL - I read "border" as the drawn edge when he meant
   the walkable one, and made walls SHORTER when they were always meant to be
   two tall.] A WALL ENDS
   AT ITS OWN TILE. laws/BOHEMIA_ADDENDUM_A_WALL_ENDS_AT_ITS_OWN_TILE_8_1_26.md
   > "if I am a tile south of a wall and the wall is north of me, the game is
   >  doing fine. But if I am one tile north, behind a wall, because of the view
   >  of our game, the wall border should end at that first tile, base of the
   >  wall... and that's for all walls... it has to be a building if walls are
   >  two tiles thick."
   TWO RULINGS: (1) a wall occupies its own tile and nothing else - the walkable
   border ends at its base, and standing IN FRONT of one is already correct and
   untouched; (2) nothing two tiles is a wall, it is a BUILDING (house facades
   keep their 3).
   THE CAUSE, one line in the CITY tab: `c.wallH=2`, and the draw does
   `top = dy - (wh-1)*C` - so the face painted over its own cell AND the
   walkable cell to its north. Measured on the real CITY frame: 22,345 perimeter
   wall cells, 7,417 with a walkable cell under the face. You could stand inside
   a wall in 7,417 places.
   AND IT WAS ALSO THE "TWO LAYERS OF WALLS", which I had wrongly filed as an
   art question in 0AJ. His 13 approved tiles are COMPLETE walls at 44x44; a
   self-contained wall painted over a two-tile rect repeats itself, so the
   screen showed cap-course-cap-course - "a separate tile that's a different
   wall in the wall". ONE CAUSE, BOTH COMPLAINTS.
   THE RUN WAS ALREADY RIGHT: drawPerim(X,Y,S) with S = one CELL. The CITY tab
   was the odd surface out, so this DELETES a disagreement rather than adding a
   rule to it.
   NO WALKABLE GEOMETRY CHANGED - not one cell became solid, so NO PRISON (0AI)
   cannot regress; re-run green at 15/15.
   THE BANK IS NOT CONTRADICTED, and this is the reconciliation that stops it
   being "fixed" back: the pool's "WALL HEIGHT MIN 2 TILES" states how tall the
   wall IS IN THE WORLD (2 x 0.75m = ~1.5m, a real Vegas block wall). wallH is
   how many GROUND CELLS the face is painted across. Different quantities.
   Reading one as the other is what set wallH=2 on 7/27.
   A GATE MUST NEVER OUTRANK A RULING: wallclass_gate asserted `h >= 2` and now
   asserts `h === 1` plus "only a building may be taller", rewritten in the same
   commit rather than worked around.
   | tools/bohemia_city_wall_one_tile_patch.py | gates: WALL CLASS 19, NO PRISON
     15, CITY TAB 64, CITY PEOPLE 18, ALPHA LOADS 20 | 8/1 | YES - drop in and
     walk up to a community wall.

0AJ. [SUPERSEDED BY 0AK - the first read was wrong and the miss is the useful
   part: I filed this as an ART question and he corrected it to WHERE YOU CAN
   WALK, which is what led to the measurement that found the real cause.]
   YOU CAN STAND INSIDE THE WALL. HE RULED IT IS ABOUT WHERE YOU CAN WALK.
   > "I'm so confused by what you choose is the limits of the wall and what's
   >  not... it looks like there's like two layers of walls at the base of the
   >  wall like I'm walking across the wall line and like there's a separate tile
   >  that's a different wall in the wall that it is it's crazy."
   > Asked walk-or-looks, he answered: "Where you can walk".
   MEASURED ON THE REAL CITY TAB (frame probe via cellAt, 60 suburb cells):
     the wall cell itself   wallH = 2, walk = false, face = true   <- correct
     22,345 wall cells swept
     7,417 OF THEM HAVE A WALKABLE CELL DIRECTLY ABOVE  <- the bug
   The wall is DRAWN TWO TILES TALL and is SOLID FOR ONE. The second course
   rises into the cell above, and that cell is walkable - so you stand in the
   screen space the wall occupies. That is both halves of what he described:
   "two layers of wall" is the 2-tile face, and "walking across the wall line"
   is standing in the half of it that has no collision.
   AND THE TWO SURFACES DISAGREE, which is its own latent bug: the RUN draws the
   same wall ONE tile tall (drawPerim(X,Y,S), S = one CELL) over one solid cell,
   so the run is self-consistent and the CITY tab is not. wallclass_gate asserts
   >= 2 tiles - on the CITY tab only.
   TWO THINGS RULED OUT BY MEASUREMENT, so nobody re-checks them:
     the doubled draw on a wall cell (a yard tile is painted, then the wall over
       it) is NOT what he sees - his 13 approved wall PNGs are colourType 2, RGB
       with NO ALPHA CHANNEL, fully opaque 44x44, so the yard underneath is
       invisible. Wasteful, not visible. Do not "fix" it expecting a change.
     the RUN's wall is not doubled either - one cell drawn, one cell solid.
   THE FIX IS ONE RULE: a cell whose screen space is covered by a wall face is
   not walkable. NOT DONE HERE ON PURPOSE - it changes walkable geometry across
   the whole valley, and the cells beside a gate opening must NOT be sealed or
   it re-creates the prison 0AI just removed. It needs its own turn, its own
   gate, and a NO PRISON re-run afterwards.
   | engine + the CITY tab's cell walkability | gate: extend NO PRISON or a new
     one | 8/1 | NOT YET - his to look at once it lands.

0AJ-OLD. (superseded by the entry above, kept because the first read was wrong)
   THE LIMITS OF THE WALL ARE CONFUSING. > "I'm so confused by what you choose is the limits of the wall
   and what's not it's very strange." Two screenshots: in both he appears to be
   STANDING ON a wall course rather than beside it.
   NOT GUESSED AT, AND DELIBERATELY NOT FIXED IN THE SAME TURN as the prison bug,
   because that one had him blocked and this one is an art/collision judgement I
   should measure before touching. THE LIKELY SHAPE: this is a 3/4 view, so a
   wall's FRONT FACE is drawn rising into the tile ABOVE the tile it occupies.
   Standing on the walkable cell in front of a wall therefore LOOKS like standing
   on top of it, and the cell that reads as "on the wall" is actually the one you
   are meant to walk. The taxonomy is right and the read is wrong.
   | measure collision vs drawn face per wall tile on the real surface, then
     decide | NOT STARTED | HIS, he has to look at it.

0AI. [DONE 8/1, HIS ORDER, AND HE WAS LOCKED IN WHEN HE GAVE IT] NO DISTRICT IS
   A PRISON. laws/BOHEMIA_ADDENDUM_NO_DISTRICT_IS_A_PRISON_8_1_26.md
   > "I'm like locked in this fucking suburb ... the streets have to touch the
   >  streets bro ... Make sure I can't be locked in any certain district ever
   >  again it's so fucking creepy."
   HE WAS RIGHT AND IT WAS NOT SUBTLE. findHomeCell() scored a starting doorstep
   on the VARIETY of districts nearby and on not being on the map rim - both
   sensible - and NEVER ASKED WHETHER THE CELL TOUCHED A STREET. It picked
   (39,23): rawStreetEdges=[], neighbours fort/medical/suburb/suburb, one 7-tile
   relay gap in a 512-tile wall, and ANOTHER SUBURB on the far side of it. A
   pathfinder took 96 steps to find that gap. 545 of 2,721 suburb-family cells
   (20%) touch no street, so it was a 1-in-5 chance every seed.
   AND 27 CELLS WERE SEALED OUTRIGHT - 3 estates, a school, a drive-in, a
   commercial, a farm, 2 suburbs - no street edge AND no relay, because the relay
   only ever walked to a SAME-FAMILY neighbour and a landlocked school has no kin.
   FIXED:
     the doorstep filters on a real street edge, HARD not scored. Moved (39,23)
       -> (41,22): arterial south, freeway north, openings on both.
     the relay got two more passes, each running only for what the last could not
       save: ANY BUILT NEIGHBOUR (the school, the drive-in), then ACROSS ANYTHING
       INCLUDING DESERT (the 7 in pockets with no road reachable through built
       ground) - which is the LANDMARK ACCESS SPUR the overmap law already
       blesses, capped at 16 hops because a spur is a driveway not a highway.
   RESULT: 3,754 built cells · 2,857 touch a street · 897 relay · ZERO sealed.
   | gate: NO PRISON, 15 assertions, and the doorstep is WALKED IN A REAL BROWSER
     out of the house, across the block, through the gap, onto the road. Proved
     able to fail: removing the filter reproduces his exact cell (39,23).
   | STANDING RULE LEFT BEHIND: anything that CHOOSES A PLACE FOR THE PLAYER -
     start cell, respawn, quest drop, fast travel, camp - asks "can he leave from
     here" FIRST. Reachability is a filter, never a score. | 8/1 | YES.

0AH. [DONE 8/1 — TWO OF HIS OWN BANK LAWS, UNENFORCED FOR 18 DAYS, AND 98% OF
   THE VALLEY WAS BUILT WRONG] MOST OF VEGAS IS WALLED, NOT GATED.
   Backlog 0N (7/28) named these two as the residual: "STILL UNGATED, NAMED:
   gates_touch_streets and gated_is_rich are generator-level rules with no
   machine." banklaw_gate.py printed the same admission every run. Closed now.
   HIS WORDS, from banks/BOHEMIA_GRAPHICS_VERDICTS_MASTER_7_16_26.txt and
   BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt (`paolo_laws`, 7/14):
     > "most Vegas communities are walled but NOT gated; gates = boujee/richer
     >  pre-apocalypse (story fuel post-apocalypse)"
   THE BUG, one line: three district types share the suburb generator (suburb /
   gated / estate) and bohemia_world.js called it with a seed and street edges
   and NEVER SAID WHICH. So the generator stamped a GATE through every street
   edge of every one of them. `gated` was a district type that changed nothing,
   and 2,582 of the valley's 2,631 residential cells - 98.1% - were built as
   gated communities. The exact inversion of his ruling.
   THE FIX: the world passes `district`, the generator picks the entrance.
     GATED (gated/estate, 1.9% of cells) - a gate assembly (code 5).
     WALLED (ordinary suburb, 98.1%)     - the STREET RUNS THROUGH (code 1).
   Same 7-tile aperture; what stands in it is the difference. No new tile code,
   no new art, no bank touched.
   THE REAL VEGAS, researched 8/1 because everything here is grounded in the
   real: Clark County Unified Development Code 30.64.020 REQUIRES a developer-
   installed decorative perimeter wall on a subdivision - a wall is CODE, not
   status, so it signals nothing. A gate is what a richer community bought on
   top. The American Housing Survey (2015, last year it asked) put 5.9% of US
   households behind a wall and 3.4% behind controlled access.
   A SECOND BUG THE FIRST ONE EXPOSED: roadConnected() began its walk by scanning
   for the first code-5 cell and calling it the way in. True only while every
   community was gated - the moment a suburb opened its street instead, `start`
   came back null and every ordinary suburb reported its roads DISCONNECTED. It
   starts from the returned entrance list now, whatever kind of entrance it is.
   AND A GATE THAT COULD NOT FAIL, CAUGHT BY SABOTAGE: the assertion that the
   world passes the district was a REGEX on bohemia_world.js. Deleting the
   argument for real left the gate green at 84/84, because that exact string
   occurs five times in that file and the regex found one of the other four.
   Replaced with: build the real world, pull a real suburb cell and a real gated
   cell, and look at the plot the game would hand a renderer. NOW it fails.
   Same class as the 7/31 facing gate that called the helper instead of reading
   the render. THE TELL BOTH TIMES: the assertion never touched the output.
   | engine/bohemia_suburb.js + engine/bohemia_world.js (one argument)
   | gate: GATED IS RICH, 87 assertions, proved able to fail three ways
   | banklaw_gate.py's 18-day debt note deleted, dossier + tilespec regenerated
   | 8/1 | YES - walk any neighbourhood; the gate is gone unless it is a rich one.

0AG. [RULED 7/31, RECORDED, GATED — AND IT CLOSES THE LANE'S LAST PENDING]
   A ROUTINE IS INVISIBLE INFORMATION, AND A NAME IS ASKED FOR.
   He answered the Majora's Mask question this lane had been holding open since
   the individual-schedule research:
   > "it will all be invisible information."
   THE GAME NEVER SHOWS A SCHEDULE. Not a card, not a menu, not a phone screen,
   not a hint. The system is FELT - busy at eleven, dead at two - never READ.
   Observing a routine means WALKING it, which is the only way anybody has ever
   learned a neighbour's hours in real life.
   THE LINE IS TENSE, and this is the part a future session will get wrong:
     PRESENT tense is EYESIGHT and stays LEGAL.  "RIGHT NOW: SCAVENGING"
     FUTURE/HABITUAL is a TIMETABLE and is BANNED. "THEIR DAY: OUT 07:15"
   AND A SECOND RULING NOBODY ASKED FOR: you do not know anyone's name. Everyone
   is a generic faction or non-faction identity until you ASK them, personally,
   in conversation; the game tracks it forever; and from then on their name pops
   up when you see them. Two exceptions, both his: the opening dialogue, and a
   story/quest reason.
   [PENDING Paolo] AN IDEA HE EXPLICITLY PARKED: an Amalgamation-friendly
   playthrough might unlock a quest that lets you SEE the invisible information.
   He said "maybe" four times and "that's just an idea for now". NOTHING IS
   BUILT FOR IT - no flag, no hook, no placeholder. It is recorded because it is
   good: it turns the invisibility from a limitation into a PRICE.
   | law: laws/BOHEMIA_ADDENDUM_NOBODY_HAS_A_NAME_UNTIL_YOU_ASK_7_31_26.md
   | gate: INVISIBLE SCHEDULE, 18 assertions, proved able to fail three ways
     (a new timetable label, a shipped name, a waiver gone stale) | 7/31 | n/a.

0AF. [DONE 7/31 — AND IT UNBLOCKED 0AE BY RE-READING IT, NOT BY CROSSING A LANE]
   THE RUN'S STREET EMPTIES AT MIDDAY TOO. The last entry (0AE) filed this as
   BLOCKED ON WORLD'S MODULE. THAT FRAMING WAS THE MISTAKE, and it is worth more
   than the feature.
   0AE said the fix was five lines in bohemia_agents.js: an opts.personFor hook
   letting a caller supply `kind` and `shift` to makeAgent. But kind and shift
   are WHEN and WHAT KIND, which are agents.js's half - and this lane's own law,
   written the same day, is that agents.js owns WHEN and WHAT KIND while
   bohemia_population owns WHICH PLACE, WHICH CONDITIONS, WHICH EDGES. The run
   was never missing kind. It was missing WHICH PLACE UNDER A CONDITION, and a
   caller may apply its own half to its own agents. bohemia_agents.js did not
   change by one character.
   THE LESSON: I asked "whose FILE is this line in" when the question was "whose
   HALF is this behaviour". A boundary drawn around files blocks work that a
   boundary drawn around responsibilities lets through cleanly.
   WHAT LANDED:
     shiftEdges(sched, p)          the personal morning, kept SEPARATE from the
                                   conditions - an EDGE may legitimately put
                                   somebody out early, a CONDITION never may,
                                   and folding them together made that law
                                   unprovable.
     conditionSchedule(sched,p,ctx) cuts a day at every condition edge and asks
                                   placeFor once per segment. The day still
                                   tiles [0,1440) exactly once.
     conditionAgents(agents,people) applies both to agents agents.js built, and
                                   always to the ORIGINAL schedule - conditioning
                                   the last result slid every morning edge 30
                                   minutes earlier on every bulk edit, caught by
                                   the gate's edit-then-unedit round trip.
     peopleForAgents(...)          one person record per run agent, derived then
                                   overridden, in that order.
     personFields(..., ns)         a NAMESPACE, because the CITY tab indexes
                                   people per neighbourhood (0..23) and the RUN
                                   per overmap cell (0..95) - the ranges overlap
                                   and two different people would have shared one
                                   id. Still ONE derivation point: one optional
                                   argument, not a second function.
   IT IS NOT A DRAW-TIME LIE: the sim re-reads agent.sched every tick, so at
   13:00 these bodies path to their own doors and go inside.
   MEASURED ON THE REAL RUN FILE IN A REAL BROWSER, outdoors on the block:
     08:00  5    10:00  9    11:00 10    12:00  5    13:00  4
     14:00  3    15:00  3    17:00  8    20:00  4
   The street fills to 10, empties to 3 through the Mojave afternoon, refills to
   8. A bulk edit setting every heat tolerance to 3 takes 15:00 to ZERO and
   removing it brings the street back.
   AND ONE FORK KILLED THE SAME TURN: a three-line "where is this person at
   minute M" helper went into bohemia_population.js and zone_map_gate caught it
   as a reimplementation of the agent sim. It was correct to catch it. The
   helper now lives in the GATE, where a reader that does not reuse the code it
   checks is the whole point.
   | tools/bohemia_run_person_facts_patch.py (strip-and-re-appliable) +
     engine/bohemia_population.js | gate: RUN PEOPLE, 45 assertions, proved able
     to fail (conditionSchedule stubbed to passthrough -> 6 red) | 7/31 | YES.

0AE. [CLOSED 7/31 BY 0AF — THE BLOCKER WAS A MIS-READ, NOT A LANE] THE RUN
   CANNOT GET THE HEAT CONDITION WITHOUT A CHANGE TO bohemia_agents.js.
   Investigated 7/31 and stopped at the lane boundary rather than crossing it.
   THE STATE: the run has the shared census (HOW MANY people) but not the person
   FACTS (heat tolerance, night habit, address book). So after 0AD the CITY tab
   empties at midday and the RUN does not - the two surfaces now agree on the
   head-count and disagree on the day, which is the exact split this lane spent
   two days closing.
   WHY IT CANNOT BE DONE FROM THIS SIDE, measured in the source:
     makeAgent(blockSeed, houseI, n, jobSite, fpOf) derives BOTH `kind` and
     `shift` internally from its own hash (lines 156-161). There is no caller
     hook. agentsForBlock takes opts and passes ONLY occupiedRate through.
   THE TWO WRONG ANSWERS, named so nobody reaches for them:
     (a) hide people at midday in the run's DRAW. The sim would still walk them
         there - that is a lie on the surface, and it is the same class of error
         as measuring 'outdoors now' as 'lives here'.
     (b) reimplement the schedule in the run. That forks WORLD's sim and breaks
         the ENGINE SYNC LAW.
   THE RIGHT ANSWER, five lines in WORLD's module and it mirrors what is already
   there: agentsForBlock ALREADY threads opts.occupiedRate to houseOccupied.
   Thread an opts.personFor(houseI, n) the same way, let makeAgent take `kind`
   and `shift` from it when supplied, and the run passes
   BohemiaPopulation.personFields. Same pattern, no fork, no new concept - it is
   exactly how occupiedRate was added.
   WHAT THIS ENTRY GOT RIGHT: both named wrong answers (hiding people in the
   DRAW, reimplementing the schedule) are still wrong and neither was used.
   WHAT IT GOT WRONG: the hook it specified was never needed. See 0AF.
   | closed by 0AF | 7/31 | n/a.
0AD. [DONE 7/31, HIS CORRECTION, AND HE WAS RIGHT] HEAT IS THE DAILY CONDITION.
   RAIN WAS A ROUNDING ERROR.
   > "WHOOPTY FUCKING DOO ITS NOT GONNA RAIN SO SO MUCH SO AWESOME"
   He read 0AB and immediately spotted what I had not: I hung individuality on
   RAIN, and by HIS OWN 7/28 weather ruling Vegas rain is ~once a month. A
   wet-weather habit changes behaviour on ~3% of days. That is not a difference
   between two people, it is a rounding error dressed as a feature.
   THE CONDITION THAT FIRES EVERY SINGLE DAY IN THE MOJAVE IS HEAT - and our own
   canon already said so twice. The food-ceiling research: "SEASONS INVERT:
   winter is the growing season, summer is survival under shade cloth."
   bohemia_agents.js's scav schedule ALREADY shelters at midday and calls it,
   in its own comment, "Mojave midday shelter". The canon named the daily driver
   and I built the rare one instead.
   NOW, MEASURED, ON A NORMAL CLEAR DAY:
     08:00  297 of 297 willing to be outdoors
     11:00  231        13:00  72        14:00  153       16:00  297
   The street EMPTIES at midday and refills by late afternoon, every day, with
   no weather event required. heatTol is 0-3 and spread across all four levels:
   72 people work straight through the worst of it, 66 will not be outdoors at
   noon for anything.
   AND A CLOUDY DAY IS NOW VISIBLY DIFFERENT WITHOUT RAIN: 153 out at 13:00 vs
   72 on a clear one, because cloud takes one step off everybody's heat bite.
   That is what the weather ruling was actually for.
   RAIN IS KEPT AND DEMOTED to what it is: flavour on a rare day, not the
   mechanism. nightOut added as the other daily one.
   THE GATE NOW ASSERTS THE CONDITION FIRES, not that the field exists - the
   street must empty at midday, refill by evening, never empty completely, and a
   cloudy day must differ from a clear one. Proved able to fail: flattening
   heatTol to 0 takes four assertions red.
   AND A SECOND GATE NEEDED FIXING, not the code: city_people's "somebody turns
   between night and midday" compared 03:00 (asleep) against 13:00 - which is
   now when everyone SHELTERS, so both samples are people at home facing their
   idle direction. It went red on a system working perfectly. Compares against
   09:00 now.
   | gates: ZONE MAP 69 -> 74, CITY PEOPLE 18 | 7/31 | YES.
0AC. [DONE 7/31] PEOPLE FACE THE WAY THEY WALKED - AND THE FIRST VERSION OF THE
   GATE COULD NOT FAIL, WHICH IS THE PART WORTH KEEPING.
   Every person carries an idle facing from their hash. That is right for
   somebody standing at home and WRONG the moment 0AB's address book started
   moving them: a body that walked east to work and then stares north forever is
   a cardboard cutout, which is the exact failure the individual-schedule work
   existed to fix. Facing is now DERIVED - idle facing at home, direction of
   travel anywhere else.
   THE GATE MISTAKE, made and caught in the same turn: the first assertion
   called pplFace() itself. I sabotaged the DRAW to use the stored facing and
   the gate STILL PASSED 18/18, because it was testing the helper and not the
   render. A gate that cannot fail is worse than no gate - it is a false green
   somebody will trust later. Fixed by having peoplePass RECORD the per-body
   facing it actually blitted (window.__PPL_FACES) and asserting against that.
   Re-sabotaged: 2 assertions go red. NOW it is a gate.
   THE STANDING LESSON, third time this session and the sharpest form of it:
   VERIFY ON THE REAL SURFACE means assert on what was DRAWN, not on what a
   helper would answer if asked. Reading the wrong variable, calling the helper
   instead of the render, and measuring 'outdoors now' as 'lives here' are all
   the same failure wearing different clothes.
   | gate: CITY PEOPLE 14 -> 18 | 7/31 | YES.
0AB. [DONE 7/31 — THE RESEARCH, EXECUTED] EVERY PERSON HAS THEIR OWN DAY.
   4 ARCHETYPES -> 296 DISTINCT DAY-SIGNATURES ACROSS 297 PEOPLE, measured.
   Straight off 0AA's finding: nobody authors 300 days, they author a GRAMMAR
   and 300 ADDRESS BOOKS. The four archetypes ARE the grammar and they were
   always fine; what was missing was every fact that makes a day personal.
   WHAT LANDED, in the research's own cost order:
     1. THE ADDRESS BOOK (Ultima VII's trick, the cheapest). Every person now
        carries workDir + workDist and favDir - their own bearing to work, at
        their own distance, and a favourite place somewhere else. Two people on
        an IDENTICAL schedule now walk opposite ways at the same hour.
     2. CONDITIONS (Stardew's trick). wetStay and darkStay. Weather was ruled in
        7/28 and NOTHING consulted it; ~40% of people now stay in when it rains
        and most stay in on a dead circuit after dark. Two identical schedules
        are two different people if only one of them stays home in the wet.
     3. THE EDGES (Ultima VII's idle/weekend variants). earlyBy shifts only the
        morning edge; duskSit sends some people to their favourite spot between
        17:00 and 20:00. The research's third finding is that the distinctive
        part of a day is the beginning, the end and the exceptions - never the
        eight hours in the middle.
   IT IS NOT A SECOND SCHEDULE SYSTEM. bohemia_agents.js still owns WHEN and
   WHAT KIND (home/work/street). Population owns WHICH PLACE, WHICH CONDITIONS,
   WHICH EDGES. That split is the whole trick and it keeps ENGINE SYNC intact.
   THE CONDITIONS ONLY EVER SEND SOMEBODY HOME, never out - gated. A rule that
   pushed people onto the street in bad weather would be inventing behaviour.
   GATE: zone_map_gate 56 -> 69 assertions. Proved able to fail: flattening the
   address book to one direction and killing wetStay drops distinct days from
   296 to 158 and takes four assertions red.
   | gate: ZONE MAP | 7/31 | YES.
0AA. [RESEARCH DELIVERED 7/31, ON HIS ASK, 1 PENDING] HOW THE GREAT GAMES GIVE
   EVERY NPC AN *INDIVIDUAL* SCHEDULE.
   records/BOHEMIA_RESEARCH_INDIVIDUAL_SCHEDULES_7_31_26.md.
   HE ASKED BECAUSE HE SPOTTED THE HOLE. I wired the schedules on 7/29 without
   ever studying the field; the 7/19 bank I leaned on answers the SIMULATION
   ARCHITECTURE question (two-plane, needs, smart objects) and not the
   AUTHORING one, which is the one we fail. We have 297 people and FOUR
   archetypes with a jittered wake time. That is four schedules wearing 297
   coats and ten minutes on a block will show it.
   THE PATTERN, and all five references agree on it: nobody authors 300 days.
   They author a GRAMMAR and 300 ADDRESS BOOKS. The day's SHAPE is shared; the
   person's FACTS make it individual.
     ULTIMA VII    ~8 base schedules in SCHEDULE.DAT, max 8 entries per NPC;
                   shopkeepers share a base and differ by "a few unique
                   identifiers (home, work)" plus per-NPC IDLE and WEEKEND
                   variants. The origin, and still the right shape.
     KCD           soul.xml, up to EIGHT activities each with its own start
                   time - the same ceiling 25 years later, which is itself the
                   finding: 8 blocks is enough to read as a life. KCD2 went to
                   ~2,400 NPCs and solved it with AI LOD, NOT by cutting
                   activities.
     MAJORA'S MASK hand-authored to the minute - AND SHIPPED THE SCHEDULE AS A
                   UI (the Bombers' Notebook, 20 entries). A routine nobody can
                   observe is wasted work. That is the finding I did not expect.
     STARDEW       conditional schedule KEYS, first match wins: season, weather,
                   friendship, mail, quest state. The cheapest individuality
                   trick on the list - two identical schedules are different
                   people if only one stays in when it rains.
     SHADOWS OF DOUBT  our closest sibling: every citizen gets a name, job,
                   apartment and routine AT GENERATION, then runs 4-10 journeys
                   a day. Individuality generated from the person's own facts.
     OBLIVION      the cautionary tale: unbounded need-driven autonomy ate their
                   own content and shipped toned down. Everyone since keeps the
                   schedule a CONTRACT with freedom only INSIDE the block.
   WHERE WE STAND, measured: our SHAPE is industry-correct (4-6 blocks, inside
   the 8 ceiling; real per-person jitter) and our FACTS are EMPTY. Three abstract
   places for everybody (home/work/street) where the industry has named
   addresses; ZERO conditions where Stardew has a dozen; no per-person edges
   where Ultima VII has idle and weekend variants.
   AND WE ALREADY OWN TWO OF THE THREE FIXES AND DO NOT USE THEM: the 7/29
   person record with stable ids is EXACTLY the address book this pattern needs
   and carries only `archetype`; and weather is RULED IN (7/28) with a real
   clock, and no schedule consults either.
   PROPOSALS IN COST ORDER (not canon): address book per person > condition the
   day on weather/power > author the EDGES not the middle.
   [PENDING Paolo] whether the game SHOWS the schedule anywhere. Majora's Mask
   says a routine you cannot observe is wasted; whether Bohemia wants a
   who-is-where surface is his call, not mine.
   | no gate until he rules | researched 7/31 | YES.
0Z. [DONE 7/29 — AND A CORRECTION TO MY OWN BACKOUT] THE RUN'S NEIGHBOURS OBEY
   THE ZONE MAP. tools/bohemia_run_people_patch.py.
   I BACKED THIS OUT ONCE FOR MEASURING WRONG, AND THE MEASUREMENT WAS THE
   THING THAT WAS WRONG. I read SIM.outAgents().length and called it the
   population. It is not - it is how many people are OUTDOORS RIGHT NOW, and at
   startTurn 0 everybody is asleep at home. That is precisely why the run's own
   boot call is buildSim(450), warming to ~07:30 "so the street is already
   living"; its own comment says so. Measured properly, warmed the way boot
   warms:
     zone map + floor    12 living on your block,  1 outdoors at 07:30
     the old flat 30%    18 living,                3 outdoors
     zone map, no floor   0 living  (which is why the floor exists)
   THE LESSON, sharper than VERIFY ON THE REAL SURFACE: reading the WRONG
   VARIABLE is its own failure mode and it looks exactly like a bug in the code.
   Before backing something out for measuring wrong, check you measured the
   thing you think you measured.
   WHAT SHIPPED: the run passes an occupiedRate from the SHARED zone map for the
   cell you are standing on, so the run and the CITY tab hold the same number of
   people in the same corner of the valley. agentsForBlock ALREADY took the
   option and the run was never passing it, so every block used the flat
   OCCUPIED_RATE=0.30 placeholder his 7/29 ruling replaced. No change to
   bohemia_agents.js (WORLD's), no second census, no new sim.
   ALSO: the run had no powergrid at all, so clusters could not be EARNED there.
   It now loads engine/bohemia_powergrid.js and builds the 12% map from the same
   seed the CITY tab uses.
   AND THE FLOOR: the player's own block gets a minimum of 6 households. Not a
   fudge - the run's lineman code says "He is your neighbour, one door down.
   Nothing closer is possible" and act 1 opens on that. The start cell comes out
   'spread' at 0.5%, which is ZERO households on a 23-home block: right for the
   valley, fatal for the one block the game opens on. A floor of 3 measured as
   one household; 6 lands a street with neighbours on it.
   | gate: the run gate boots it; zone map gated separately | 7/29 | YES.
0Z-OLD. (superseded by the entry above, kept because the mistake is the useful
   part) THE BACKOUT THAT SHOULD NOT HAVE HAPPENED. tools/bohemia_run_people_patch.py
   exists, applies cleanly, and is MARKED NOT WIRED at the top of its own
   docstring. HE PLAYS THE RUN, so this matters: the CITY tab got his 7/29 zone
   map and the run did not, which means right now the two surfaces describe two
   different cities - the run still uses the flat OCCUPIED_RATE=0.30
   placeholder for every block in the valley.
   WHAT WORKS: population + powergrid modules load in the run, zero page
   errors, the zone map answers for the real cell (cell 39,23 = 'spread',
   rate 0.0049 against the old flat 0.30).
   WHAT DOES NOT: calling agentsForBlock directly in the booted run with the
   floored rate returns 12 agents; the SIM the run actually boots with has 1.
   The option is not reaching the boot path and the cause is not found. Ruled
   OUT: CELL vs HOME_CELL mismatch (verified equal), and the save-restore call
   site at ~2046 (different path, only on load). NOT ruled out: buildSim
   running before feet/doorOf are populated with its try/catch swallowing it.
   WHY IT WAS BACKED OUT: shipping a wiring that MEASURES WRONG is worse than
   shipping nothing, and "the modules load without errors" is not the same as
   "it works". Verified work shipped; this did not.
   ALSO FOUND AND WORTH KEEPING: the player's own block needs a FLOOR. The run's
   own lineman code says "He is your neighbour, one door down. Nothing closer is
   possible" - act 1 opens on that relationship - and the start cell comes out
   'spread' at 0.5%, which is ZERO households on a 23-home block. Correct for
   the valley, fatal for the one block the game opens on. The floor belongs in
   whatever version finally ships.
   NEXT: instrument buildSim from the inside (log _rate and _agents.length),
   find why the boot SIM ignores the option, then prove it with a gate that
   boots the run and asserts a cluster block and an empty block DIFFER.
   | no gate until it works | 7/29 | YES.
0Y. [DONE 7/29, ON HIS CONDITION] THE PEOPLE HAVE ROUTINES, AND THEY ARE
   MASS-EDITABLE. His words, given as a condition on making them move: "sure
   just make sure you do the coding right so when its time to mass edit the
   people you can please." That is an ARCHITECTURE RULING and it is now law:
   laws/BOHEMIA_ADDENDUM_MASS_EDIT_THE_PEOPLE_7_29_26.md.
   THE ARCHITECTURE, four rules, all gated:
     STABLE IDS - "nx:ny:i" under the ONE SEED, from the world and the place,
       never from array order. The same person survives a reload and is the
       same person on the RUN and the CITY tab. Without this "mass edit" cannot
       even be expressed, because there is nothing to address.
     ONE DERIVATION POINT - personFields(). Every field a person has comes from
       there; change it and everybody changes at once. No field may be computed
       at the point of use, which is exactly the habit that makes a population
       uneditable.
     AN OVERRIDES LAYER - a rule is a FILTER plus a PATCH, applied on read, in
       order. Editing people means ADDING A RULE, never touching the
       derivation, so every edit is reversible, inspectable and diff-able. The
       table ships EMPTY (MECHANISM-MINE / CONTENTS-PAOLO'S).
     A RULES VERSION - and this is the piece that makes it real rather than
       decorative. Surfaces CACHE their people, so a cache that does not know
       the rules changed serves pre-edit bodies forever. Every consumer keys on
       it. The gate proves it by sabotaging exactly that and watching the edit
       silently fail to reach the screen.
   MOVEMENT, AND IT FORKS NOTHING. engine/bohemia_agents.js is inlined VERBATIM
   (28KB against a 34MB alpha) and the frame ASKS it where somebody is - it has
   no opinion of its own about when a scavenger sleeps. This is the OFFLINE
   PLANE the agent module already describes in its own STALKER-pattern comment:
   not a second simulation, a lookup. Measured on the real surface across a day:
     03:00  0 of 9 out       09:00  3 out
     13:00  1 out            19:00  3 out
   The 13:00 dip is the scav schedule's OWN "Mojave midday shelter" showing up
   on screen without anybody writing it twice.
   THE PATCH TOOL CAN NOW RE-APPLY ITSELF. It used to only no-op when already
   applied, which is useless the moment its own source changes - and its source
   changed twice the day it was written. It now strips its previous injection
   by bracketed delimiters and re-injects, or REFUSES if a delimiter is missing
   rather than half-strip.
   | gate: MASS EDIT (30 assertions, node + real browser), proved able to fail
   | 7/29 | YES.
0X. [DONE 7/29 — THE LANE'S #1 ITEM, AND IT IS HIS RULING MADE REAL] THE CITY
   WALK SURFACE HAS PEOPLE IN IT. Was ER, the engine-reality-audit finding:
   human mode had the best render architecture in the repo and NOT ONE PERSON
   IN IT - measured before touching anything, zero occurrences of
   BohemiaAgents or any body drawing at all; the only movers were cars and
   planes. You could walk the whole valley and never see a human being.
   MEASURED ON THE REAL SURFACE, in a real browser, on the real tab:
     standing in a CLUSTER      9 people on screen
     standing in a NO MAN'S LAND 0 people on screen
   engine/bohemia_population.js — his 7/29 zone map as a SHARED module, not a
   patch inside one renderer. The RUN and the CITY tab are separate renderers
   and this lane has already been burned once by fixing the surface he does not
   play; if each invented its own idea of who lives where, one neighbourhood
   would be a ghost town in one and a settlement in the other. One census, both
   surfaces, same seed same answer.
   IT FEEDS THE EXISTING SIM RATHER THAN FORKING IT. bohemia_agents.js (WORLD's)
   already holds the census and ALREADY takes a per-call `occupiedRate` whose
   own source comment calls the flat 0.30 "a PLACEHOLDER... [PENDING Paolo]".
   His ruling answered that pending item, so the module supplies that rate per
   neighbourhood and adds no second census: cluster 0.115, spread/loner 0.005,
   empty 0.000, against the old flat 0.30 everywhere. No edit to another lane's
   module, ENGINE SYNC intact.
   THREE THINGS FOUND BY LOOKING, not by reading code:
     1. A cluster scattered over its whole 128x128 subdivision put exactly ONE
        person on screen - indistinguishable from a loner. Clusters are tight
        now (8-cell radius, measured against the ~17 cells a phone shows at walk
        zoom), so 3-5 neighbours are visible at once. You still never see all
        13, and you should not.
     2. The first standable test was my own (`!solid && !face`) and put
        residents ON ROOFTOPS. Fixed to the frame's OWN `walk` flag - the exact
        predicate move() uses. If a person can stand where the player cannot
        walk, the test is wrong, not the world.
     3. Placement is CACHED per neighbourhood and the player MOVES, so a
        standable test that consulted hx/hy would bake a stale answer. Occupancy
        is enforced at DRAW time instead, and the gate proves it by stepping him
        onto a resident and watching the count drop by exactly one.
   ZERO PIXELS COOKED: every body is the character he already built, tinted -
   the canon "enemies are tints of me" mechanism (7/3), the same one the RUN's
   own townsfolk use.
   NOBODY MOVES YET, on purpose. Schedules are bohemia_agents.js's and
   duplicating them here would fork the simulation. This draws PRESENCE, which
   is what "how busy the city feels" asks for. WHAT COMES AFTER is wiring the
   real schedules through the same module so the clusters wake up, work and
   come home. | gates: ZONE MAP (56 assertions, node) + CITY PEOPLE (14, real
   browser) | 7/29 | YES.
0W. [RULED 7/29, ALL FOUR ANSWERED, RESEARCH DELIVERED] HOW MANY PEOPLE, AND
   HOW BUSY THE CITY FEELS. laws/BOHEMIA_ADDENDUM_HOW_MANY_PEOPLE_7_29_26.md
   + records/BOHEMIA_FOOD_CEILING_RESEARCH_7_29_26.md. He answered all four
   open questions in one message and ordered research on the third.
   THE RULINGS: (1) the population IS the food carrying capacity, not a
   die-off percentage - "mfs gotta eat and drink" - AND density is a FEELING,
   not a headcount, so not every survivor gets an NPC. (2) clusters AND no
   man's lands AND random spread, all three at once. (3) research ordered on
   how much more food we can make and import. (4) act 1 is WORSE than Cuba,
   so Cuba is the FLOOR to measure against, never the match.
   THE NUMBER: 65,000 in the valley (band 45-80k), which lands INSIDE the
   7/5 grass-to-food canon band rather than moving it. In the walkable world
   that is ~300 living bodies, because the walkable valley is 1/217th of real
   Las Vegas. OCCUPIED_RATE=0.30 is now wrong by construction (it should be a
   2.8% average) and is superseded by a three-zone MAP: ~60% of bodies in 14
   clustered neighborhoods, 25% spread one household per neighborhood, 15%
   loners, and a full QUARTER of the map with nobody in it on purpose.
   WHAT THE RESEARCH FOUND, all four load-bearing:
     SOIL IS THE CEILING AND IT IS ~20 ACRES A YEAR. The houses really are
       there - 571,000 detached homes, ~39,000 acres of convertible yard
       against 10,000 acres of turf - but the valley is caliche and soil is
       BUILT, at ~20 acres/yr from the city's own biosolids. The food supply
       cannot grow meaningfully in a lifetime. The Apex landfill is the only
       lever that exists, which makes it worth fighting over.
     YARDS AND HYDROPONICS ARE VITAMINS, NOT CALORIES. A 400 sq ft bed is
       10-15% of one person's calories; hydroponics is famously calorie-poor
       and needs the clusters' power. A YARD KEEPS YOU FROM GETTING SCURVY,
       A GOLF COURSE KEEPS YOU ALIVE.
     NINE MEGAWATTS IS THE PRICE OF EATING. Measured: 1,944 kWh per acre-foot
       (853.8M kWh moved 439,187 ac-ft) because Vegas water is LIFTED. Farms
       plus drinking water = ~8.6 MW continuous, forever.
     THE 12% IS A DISTRIBUTION STORY, NOT A GENERATION STORY. Hoover makes
       382 MW even crippled; 9 MW is 2.4% of that. Generation was never the
       problem - the GRID died. This gives CLUSTERED POWER a physical
       mechanism and explains its own "eerily perfect inside, dead one street
       over": you cannot half-energise a feeder.
     MOAPA VALLEY IS THE ONE NEARBY FARMLAND THAT SURVIVES INTACT, because the
       Muddy River is spring-fed and gravity-flows to the fields - no pumps,
       no grid. And Las Vegas had already bought its water. Imports: +5-10k
       people in a good year, ZERO in a bad one, only if the road is held.
   WIRING IS A SEPARATE TURN. This is the ruling, not the code.
   | no gate yet | ruled + researched 7/29 | YES.
0V. [FILED 7/28, HANDED TO THE ART LANE] EIGHT TILE REQUEST FORMS FOR THIS
   LANE, ON PAOLO'S TILE FORMS ORDER. NO ART COOKED, as the order says.
   records/tileforms/TF-CITY-001..008, board rows 10-17. Every gap was found
   by WALKING THE SURFACES, not by guessing: the run booted in Playwright,
   walked out of the house, down the driveway, into the street and along the
   perimeter, screenshotted at each stop, and every claim in every form is
   either a line of the real renderer or a measured bank enumeration.
     001 ROOF EDGE FAMILY - the 30 approved house skins are 14 roof FIELD
         tiles and nothing else; hips/ridge/eave fall back to the frozen
         target set, so every house wears an orange stripe. (Was backlog 0S.)
     002 ROOFTOP EQUIPMENT - the roof is the biggest thing on a phone screen
         in a residential district and there is not one prop on it anywhere
         in the renderer. Vegas-real: rooftop package AC units are the valley
         norm, and dead converted swamp coolers are free storytelling.
     003 RESIDENTIAL GARAGE DOOR in the skin language - a third of a tract
         house's frontage, still the target set's orange. The door bank's one
         rollup is INDUSTRIAL and is named in the anti-reference so nobody
         "reuses" it.
     004 PERIMETER WALL CORNER/PILASTER/CAP - his 13 approved border walls are
         ALL straight runs (bank opened, 26 entries enumerated), so the wall
         butts into itself at every turn. Clark County caps pilasters at 24 ft
         on centre and requires walls to match the abutting subdivision -
         which is our own ONE WALL PER COMMUNITY rule, arrived at independently.
     005 THE NEIGHBOURHOOD GATE - the run literally contains
         `if(c===5) return 'concrete_0';`. The one entrance to a walled
         community, a declared PORTAL in its own dossier, is a blank slab, and
         the street-aware law's mandatory corner pedestrian gate has no pixels
         at all.
     006 DRIVEWAY APRON + ROLLED KERB CUT - driveway, kerb and gutter are
         three unrelated field tiles butted together, so nothing says a car
         can get from the road onto a lot. Clark County's standard drawings
         restrict rolled curb to driveway locations, so the kerb profile
         really does change there.
     007 SUBURBAN YARD DRESSING - yards are flat fields with nothing on them.
         Man-made objects only; board row 5 (dead foliage) is the plants and
         the two compose. Grounded in SNWA's turf-removal program, which is
         why a Vegas front yard is rock and objects rather than lawn.
     008 THREE-COURSE FACADE - the CITY tab satisfies his 3-tile wall ruling
         by VERTICALLY STRETCHING one 16px tile (tallTex), so a tall wall is
         one texture smeared three times. Must stay legible at WALL_SEE=0.35,
         because his see-through ruling came in the same breath.
   AND THE GATE THE FORM LAW NAMED BUT NOBODY WROTE: gates/tileform_gate.py,
   registered as TILE FORM. 5,990 assertions across ALL 50 forms from FIVE
   lanes. It proves every field is present and non-empty, captions parse and
   are ingestable, the caption's layer matches what section C declares, ACT is
   1, edge vocabulary is one of the four legal words, any path a form names
   ACTUALLY EXISTS, and the board and records/tileforms/ cannot drift apart in
   either direction. Proved it can FAIL twice - sabotaged forms, watched it go
   red on the layer mismatch, the fake path, an emptied field, an illegal edge
   word and a non-act-1 ACT, restored each time.
   THE HONEST PART: its first version was TOO STRICT and, run over the other
   four lanes' work, produced 100 failures that were nearly all FALSE. "none"
   is the correct answer to SHADOWS, "standalone" is the template's own
   FAMILY/SET, and naming an approved asset in words rather than by path is
   the convention all five lanes actually use. Four bugs in the GATE were
   fixed (heading parentheticals, nested bullets inside an answer, one-word
   answers scored as stubs, a colon inside an answer eating the answer), each
   with the reason written into the source so it cannot regress quietly. What
   survived is the class of failure a machine can genuinely settle, and it
   caught two real ones: an anchor with no path in my own TF-CITY-008, and
   `gates/vehicle_size_gate.js` in TF-CMB-003, which is a .py.
   ROW NUMBERS COLLIDED FIVE WAYS: four lanes all started at 10 on the same
   day. WORLD moved to 30-44, COMBAT to 50-57, and I moved mine to 60-67
   rather than renumber anyone else's rows and break the BOARD ROW # pointers
   inside their forms. The residual RUN/ART 10-17 overlap is untouched and
   still the board owner's call. All three lanes independently reached the
   same diagnosis: the stable key is the TF ID, not a hand-assigned integer,
   and the gate already enforces TF IDs unique. | gate: TILE FORM | 7/28 | YES.
0U. [ANSWERED 7/29 - Cuba is the FLOOR not the match, see 0W] THE SCOPE OF THE ECONOMIC
   APOCALYPSE, TEN YEARS IN. records/BOHEMIA_ECONOMIC_APOCALYPSE_SCOPE_RESEARCH_
   7_28_26.md. NO CODE WRITTEN, as asked. Round two of his research ask, three
   questions: what a dead dollar actually breaks, what permanent brownouts do to
   industry, and what international travel at 1% does to trade and to Vegas.
   THE HEADLINE FINDINGS: (1) the dollar was the world's SETTLEMENT LAYER, not
   just America's money (~58% of reserves, ~88% of FX transactions), so its death
   is a global event, not a US one - and since real hyperinflations burn out in
   1-2 years, at YEAR TEN Bohemia is a functioning bad normal, not chaos. The
   die-off is MEDICAL (insulin, dialysis, antibiotics, cold chain), not
   nutritional, which is why MEDICINE is a currency. (2) THE INDUSTRY TIER LAW:
   continuous-process industry never restarts once cold - no new glass, cement,
   steel-from-ore, refined fuel, chips, or CHLORINE. The last pool-chemical
   warehouse in a city of empty pools IS the water supply. Tier 2 survives only
   where it owns generation = exactly our 12% CLUSTERED POWER, and Lebanon's
   generator cartels are the behavioural model for whoever holds it. (3) Travel
   at 1% deletes Vegas's REASON TO EXIST (42M visitors, ~$80B, 1 job in 4), and
   Cuba's Special Period is the closest real reference case we have. Fertilizer
   is the hidden import and our biosolids canon already answers it. Rail is
   under-used: 90 rail cells and a railyard sit idle in a fuel-starved world.
   ONE RULING BLOCKS THE FOLD-IN: is CUBA'S SPECIAL PERIOD the named reference
   case for our economy. | no gate until he rules | researched 7/28 | YES.
0T. [ANSWERED 7/29 - see 0W. research delivered 7/28] HOW MANY UNNAMED NPCS, AND WHAT
   LIVES THEY LIVE. records/BOHEMIA_UNNAMED_NPC_POPULATION_RESEARCH_7_28_26.md.
   NO CODE WRITTEN, as asked. Measured out of our own files: the full 9,216-cell
   valley census, 2,832 residential cells = 177 neighborhoods, 23 homes per
   neighborhood measured from the real generator = ~10,600 pre-collapse people
   in the WALKABLE valley. THE HEADLINE FINDING: the GDD's death math says ~3%
   remain and bohemia_agents.js ships OCCUPIED_RATE=0.30 (70% gone) - EIGHT
   TIMES APART, flagged [PENDING Paolo] since 7/19 and never ruled. Also found:
   the VALLEY SCALE LAW locks a 5.7-mile valley and the code builds a 1.43-mile
   one (TILE_M went 96 -> 24 without OVER_N growing, so 1/16th the area).
   Per-district population table with a grounded reason for every row, six new
   life archetypes each justified by a district that already exists, and an act
   1/2/3 curve tied to the GDD's own 50-80k food ceiling.
   MECHANISM GAPS NAMED, not fixed: agents only exist for suburb plots (a farm
   has no farmhands because nothing places them), nothing clusters (uniform
   per-house roll), the job lookup is radius-3 = 72m at today's scale.
   THREE RULINGS BLOCK ALL OF IT: the die-off rate, clustered vs spread, and the
   act-3 multiplier. | no gate until he rules | measured 7/28 | YES.
0S. (7/28, SEEN AND LEFT ALONE ON PURPOSE, [PENDING Paolo]) THE ROOF HIPS DO NOT
   MATCH THE ROOF. The straight roof run wears his shingle skins; the four HIP
   tiles (roof_hipTL/TR/BL/BR, the cut corners where a roof turns) are still the
   target set's orange, so each house reads as a brown roof with an orange stripe
   down one side. I saw it in the street shot before shipping and did NOT iterate
   again - a fourth pass on the same feature in one turn is the tell the STOP
   PRODUCING law names. The hips carry the SHAPE and his bank has no corner
   variants, so the choice is his: tint the hips toward the roof skin, cook four
   corner variants of his roofs, or leave the orange. | no gate until he rules |
   /tmp street shot 7/28, records/BOHEMIA_RUN_ART_SOURCE_AUDIT | YES.
0Q. [DONE 7/28] HIS 30 HOUSE SKINS ARE ON THE HOUSES; THE CBB TILESET WENT 83% ->
   30% OF THE BLOCK. Option 1 of the three (skin the stack, keep the massing) -
   he said "do what you have to do next" rather than picking, and option 3
   (ground) was blocked: the WORLD lane's record says READ BEFORE BUILDING ANY
   GROUND, the tile set covers ONE residential street, growing it is ART's.
   Only FIELD tiles wear his skins (flat wall middle, straight roof run, open
   yard); every tile carrying SHAPE keeps the target set (base course, eave,
   corners, window, boarded, all four hips, the garage, all road/kerb/concrete).
   One skin per HOUSE seeded off the footprint, one yard per BLOCK.
   THREE LOOKS BEFORE IT WAS RIGHT: roof_slope only -> stripes; no roof at all ->
   uniform orange (that orange IS the target roof); whole straight run + hips
   kept -> uniform shingle from his bank. The first version would have shipped
   green and looked worse. VERIFY ON THE REAL SURFACE earned its keep.
0R. [DONE 7/28] BANK USED GATE. An approved bank that is loaded and never drawn
   is the same as not having it - it happened TWICE IN ONE DAY in one file (the
   13 border walls, the 30 house skins) and build_run_slice.js only ever asserted
   the banks were PRESENT. gates/bankused_gate.js boots the real run, patches
   drawImage, draws inside / outside / in front of a house / at a door, and
   counts DRAWS PER BANK. Zero draws fails. Also reports (does not fail) the dead
   DOOR_IMG + doorPick() pair, superseded by the animated door bank - delete it.
0P. [PENDING PAOLO - one pick, then it is a day's work] 83% OF THE RUN IS THE CBB
   TILESET, AND HIS 30 APPROVED HOUSE SKINS ARE LOADED AND NEVER DRAWN. Measured
   by tools/bohemia_run_art_source_audit.js: out on the block, 273 of 330 draws
   are the 42-tile CBB target set (his own verdict: could be better) and 57 are
   the border walls he just approved. ROOF_IMG/WALL_IMG/YARD_IMG appear exactly
   once each in the built run - their definition - and are never drawn. The
   builder ASSERTS the banks are present and nothing checks they are USED;
   loaded-and-unused passed every gate in the repo, twice.
   NOT FIXED ON PURPOSE: the houses ride a designed projection (base course, eave
   shadow, corners, garage mouth) and his skins are flat textures with no corner
   variants, so a wholesale swap returns his materials and removes the massing.
   His three options are in records/BOHEMIA_RUN_ART_SOURCE_AUDIT_7_28_26.md.
   | a "banks must be USED, not just present" gate belongs here | measured 7/28 |
   YES, blocked on his pick.
   [7/28 UPDATE] THE GATE NOW EXISTS: gates/banks_used_gate.js. It boots the run,
   patches drawImage, tags every approved bank's images and counts draws per bank
   on the REAL surface, inside and out. PRESENCE IS NOT USE. The house skins are
   WAIVED BY NAME against this item (a gate cannot force a director's call), and
   any OTHER loaded-and-unused bank is an instant fail. The waiver itself is
   asserted honest in both directions - it fails if the bank stops being loaded
   (stale entry) and it fails if the bank STARTS drawing (delete the waiver). The
   day he picks, the waiver comes out and this bank is enforced like the rest.
   It also found what the audit missed: the skins are 21 images in the build, not
   30, across THREE arrays (ROOF_IMG 14 / WALL_IMG 4 / YARD_IMG 3).
0Q. [SMALL, RUN-BUILDER LANE] WALK-FILE DOOR ART RIDES ALONG DEAD. DOOR_IMG (9
   images) is the pre-7/26 flat door art, superseded by the approved animated
   door bank (DOOR_IMGS, 90 images, 2 tiles tall) which IS drawing. It ships
   because tools/build_run_slice.js lifts the walk surface's art block VERBATIM -
   that is the builder's contract and dropping these means post-processing the
   lift, which belongs to whoever owns that builder. Not a rendering defect, a
   payload cleanup. WAIVED by name in banks_used_gate.js until then.
   NOTE THE ONE-LETTER TRAP: DOOR_IMG and DOOR_IMGS are different banks. A probe
   that reads the wrong one reports the LIVE door bank as dead.
0O. [DONE 7/28, and it is the lesson of the day] HE PLAYS THE RUN. THE RUN IS A
   SEPARATE RENDERER. Three consecutive turns diagnosed correctly, fixed
   correctly, gated green and shipped - all in CITY_B64, while he was looking at
   slices/BOHEMIA_RUN_CURRENT.html. In the run, `groundTile` returned 'wall_base'
   for the suburb perimeter, which is the SAME starter-tileset tile its own
   bodyTile() lays as the bottom course of a HOUSE: the border wall and the house
   wall were one tile, exactly as he said, twice. His 13 approved border walls
   had never existed in that renderer. Fixed via the builder (inlines the pool,
   refuses to build without it) + a perimeter draw path seeded per plot, in both
   the main and see-through passes. wallclass_gate.js covers BOTH renderers now.
   STANDING RULE FOR THIS LANE: before fixing anything visual, ASK WHICH SURFACE
   HE IS ON. The CITY tab and the RUN tab share almost no render code. A gate
   that only covers your surface is how you say "fixed" three times while he
   looks at the same broken thing.
0N. [DONE 7/28] THE BANK LAW INDEX - the class of miss that hit THREE TIMES today.
   His rulings are not only in /laws. They are in the BANKS, in fields nothing
   read: a bank's own `law` field said "wall height min 2 tiles" for ten days
   while the wall lay flat; a `paolo_laws` block said "per-cell wall shuffle
   BANNED" while the game shuffled per cell; and the same expression hid nine of
   his thirteen approved walls. /laws has BOHEMIA_CANON_INDEX and a pile of
   gates; the banks had NOTHING, and a rule inside a 2MB JSON blob is invisible
   to a human and to every gate. tools/bohemia_bank_law_index.py now sweeps every
   bank and record for law/paolo_law(s)/ruling/paolo_direction/status at any JSON
   depth and writes records/BOHEMIA_BANK_LAW_INDEX.md - 35 rulings across 24
   files, one readable page. gates/banklaw_gate.py fails if the index is stale
   and byte-checks five rulings verified by hand.
   STILL UNGATED, NAMED: `gates_touch_streets` and `gated_is_rich` are
   generator-level rules with no machine. | build them | records/BOHEMIA_BANK_
   LAW_INDEX.md | no.
0M. [DONE 7/28, his ruling, and it was HIS LAW being broken] ONE WALL PER
   COMMUNITY, AND NINE OF THIRTEEN HAD NEVER BEEN DRAWN. "BRO IN THE FILES THERE
   IS LIKE SO MANY APPROVED SUBURBA BORDER WALLS ... SEARCH THE SYSTEM FOR THAT
   SHIT". I searched. banks/BOHEMIA_WALL_PICKS_7_14_26.txt (inside the GRAPHICS
   VERDICTS MASTER, "the act-1 art authority") holds W26-W37 with 32 killed and
   his direction "85% of Vegas walls are desert yellow tan brick vibes"; batch 2
   added WB4 out of 48. THIRTEEN approved border walls out of 61 judged. And
   banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt has a `paolo_laws` block that
   says VERBATIM: "one_wall_per_community": "each plot = ONE wall design (seeded
   per plot); variety BETWEEN plots; per-cell wall shuffle BANNED".
   THE GAME PICKED THE TILE WITH `hash2(gx,gy,404)&3`. Two violations in one
   expression: the per-cell shuffle his law names and bans, AND the &3 capped the
   roll at four, so only 4 of the 13 could ever be drawn - NINE OF HIS THIRTEEN
   HAD NEVER APPEARED IN THIS GAME. Fixed: the design is seeded per PLOT (the 4x4
   overmap group that makes one 128x128 suburb grid, the same key its layout
   comes from) and saTex mods by the real pool length. Measured after: 11,193
   wall cells across 77 communities, ZERO plots mixing designs, all 13 in use.
   Gate: wallclass_gate.js sweeps the whole valley and proves both halves.
0K. [DONE 7/28, his ruling] THE SUBURB PERIMETER WALL STANDS, FROM ITS OWN POOL,
   AT ITS OWN RESOLUTION. The pool was wired since 7/21; what was broken was
   (a) it drew as ONE FLAT CELL while house facades stood 3 tiles, so the only
   thing that looked like a wall was the house wall, and (b) its 44x44 approved
   tiles were shrunk to 16 with LANCZOS then re-blown x1.375 by the new TPX -
   two resamples on the one asset he passed out of 61 candidates. Now: 2 tiles
   tall (its bank's own stated minimum, shorter than the 3-tile house wall),
   perimeter pool only, native 44x44 (exact x0.25/x0.5/x1/x2 on the zoom
   ladder). Gate: wallclass_gate.js checks the class, the height, the key count
   AND that the embedded bytes are the bank's bytes.
0L. (7/28, STANDING INSTRUCTION for this lane, from him) BEFORE TOUCHING ANY ART
   PATH, READ ITS BANK'S OWN `law` FIELD. The perimeter bank has said "WALL
   HEIGHT MIN 2 TILES" since 7/14; there was a law file AND two verdict records
   AND a bank, and it still drifted for ten days because nothing in the machine
   read any of them. "look in the poject files" - the answer is almost always
   already there and almost always has no gate on it.
0I. [DONE 7/27, his ruling] ONE MOVEMENT UI EVERYWHERE. "on the run should be
   using the same movement ui s the combat shit ... the arrows taking up half the
   screen is dog shit man". The run's #ctl bar was a flex SIBLING of the stage,
   so it did not float over the world, it SHRANK the canvas: 390x602 in an 844px
   viewport. Replaced with the cluster the game already used twice (COMBAT
   buildMoveRing, CITY #nav): 8 cardinals ringing an 80px portrait that IS the
   one contextual action button, floating in the thumb corner. Canvas is 390x795
   now. Four buttons became eight (the run's dirOf/DIRS8 always spoke 8; only the
   buttons were four), with a corner-squeeze rule so a diagonal cannot slip
   between two building corners. bu/bd/bl/br keep their ids for run_gate.
   Gate: navcluster_gate.js, which READS THE PORTRAIT'S PIXELS and fails an empty
   canvas. NO PIXEL COOKED - the face is the alpha's existing baked portrait.
0J. (7/27, discovered, NOT mine) THE RUN'S INTERIOR CAMERA IS OFF-CENTRE: the
   house draws low-right with a large void above it. PRE-EXISTING - confirmed by
   screenshotting the previous build side by side before shipping the nav
   cluster. Whoever owns the run should fix it. | no | screenshot comparison
   7/27 | no.
0H. [DONE 7/27, his ruling, law in laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md]
   THE THREE-TILE WALL AND THE SEE-THROUGH. "every wall supporting a door should
   be three tiles tall ... an opacity filter for when I'm in front of a wall".
   Two asks, ONE mechanism: a wall only gets height by leaving the baked chunk
   (three tiles means drawing into the two cells above, which belong to other
   rows and sometimes other chunks), and the opacity depends on where he is
   standing THIS FRAME, which a bake cannot know. So facades are a live pass
   drawn in two halves around the player: behind him at full opacity, then the
   player, then what stands between him and the camera, faded to 35% only where
   it covers him. A door is 2 of the 3 tiles (DOOR LAW); a window moved UP to the
   middle tile instead of lying on the ground. The tall door is DERIVED ONCE into
   a cached 16x32 tile so no frame ever stretches it - a law does not get to
   break the render contract to implement itself. Gate: wallheight_gate.js,
   which renders two real frames and reads back destination size AND alpha
   (invisible to a normal draw audit), asserting the fade fires when covered and
   does NOT fire when clear. NO PIXEL COOKED - all his own 7/21 house verdict.
0E. [DONE 7/27, diagnosis in records/BOHEMIA_SUBURB_DIAGNOSIS_7_27_26.md] "THE
   DOOR SUCK" WAS A DICE ROLL. Every exposed house tile picked its facade from a
   per-tile hash and 10% of that roll was a DOOR: measured 62 doors across 727
   exposed fronts in 24 real suburb cells, scattered down every wall including
   the 643 that face a dead-dirt backyard with no path to them. The suburb
   generator already marks its driveway apron (3) and its street (1); the door
   now goes where the house meets one of those, one per approach. After:
   17 doors, 17 reachable, 0 on dirt. The generic-district path had the same
   roll and it was worse - those dossiers declare doors as PORTAL tiles you step
   through, so a painted door there is a door that lies; it paints none now.
   Gate: frontdoor_gate.js. NO PIXEL WAS COOKED - it places Paolo's own 7/21
   approved tiles correctly. HIS CALL, NOT DECIDED: 17 doors over 24 cells means
   most homes are entered through the GARAGE (whose dossier says it has a door
   into the house), because that is where the plot's walkable approach goes. Real
   for a Vegas tract house, or he wants a front door on every home.
0F. (7/27, [PENDING Paolo], from the same diagnosis - all TASTE, deliberately
   untouched) (a) The red-brick read is his OWN approved roof art: hroof holds
   exactly the 14 he thumbed UP on 7/21 (roof_shingle_0-5, roof_gravel_6-7,
   roof_stile_21-26), so it is not a wiring bug; a seamless tile has no ridge, no
   slope and no shadow, which is why a roof reads as wallpaper. (b) The facade is
   drawn ONE tile tall while DOOR LAW says two - the interiors obey it and
   interiors_gate byte-locks it, the exteriors do not, so inside and outside
   disagree about the same law. (c) 54% of a suburb cell is dead-dirt yard drawn
   as one flat noise; the share is honest for a real subdivision but it reads as
   a void. Each of these changes how every building in the game looks. | no |
   records/BOHEMIA_SUBURB_DIAGNOSIS_7_27_26.md | YES.
0G. (7/27, FOR THE WORLD LANE, not touched - ONE SYSTEM ONE SESSION) 4 cells of
   7,649 are SEALED: you can drop into them and never walk out. 88,1 solar ·
   92,8 estate · 92,39 suburb · 5,53 gypsum. Found by flood-filling walkable
   tiles from the game's own drop-in point. Belongs with landlocked_gate.js.
0B. (7/27, HIS WORDS, NOT ACTIONED - recorded so nobody re-cooks into a
   rejection) He rejected, in one message: the HOUSES ("the houses aren't
   good"), the DOORS ("the door suck"), the GARAGE ("the garage is suck"), and
   asked whether the house is even built from the approved target art ("is this
   target art"). STOP PRODUCING applies: nobody makes a v2 of any of these until
   he asks. The one thing he DID direct: "you really should be using the suburb
   district" - the suburb generator, which the walked world does already read
   (realizeCell's m.sub path drives off BohemiaSuburb's own legend). What he is
   pointing at is that the RESULT does not look like the district we built, so
   the gap is between the suburb dossier and what actually renders. Diagnose
   before touching pixels. | no new gate until he rules | his message 7/27 | YES,
   blocked on him.
0C. (7/27, [PENDING Paolo]) "the street that I didn't say you could go" - reads
   as a MAP LAW complaint: a street exists that he did not place. MAP LAW says
   Claude never designs map layouts. Needs him to point at which one before
   anything is changed. | no | his message 7/27 | YES.
0D. (7/27, [PENDING Paolo], probably not the CITY lane) "the phone system isn't
   in here, doesn't progress as I walk" - the phone/feed is not reachable from
   the walked world and nothing about it advances with steps. Whose lane that is
   (LIFE/SOCIAL vs CITY) is his call, and so is whether it belongs in the walk at
   all. | no | his message 7/27 | YES.
0b. [DONE 7/27] THE PHONE WAS BLURRING THE WHOLE WORLD ON THE WAY TO THE SCREEN.
   The 7/26 fix above made the world blit 1:1 INSIDE the canvas. The browser
   then undid it: #cv in the city frame never set image-rendering, so it took
   the default `auto` = smooth, and the 378-wide backing store was BILINEAR
   upscaled x3 onto the phone's glass every frame. Not one tile has ever
   reached Paolo's eye at the sharpness it was painted at, and no amount of
   reading render code could show it, because the damage happens after the game
   stops drawing. Second defect on the same element: the stage box measures
   764.61 CSS px while clientHeight rounds to 765, so the whole world was also
   squeezed x0.9995 - a resample of every row for a squash nobody can see.
   Fixed: tools/bohemia_city_screenfilter_patch.py (CSS box sized in explicit px
   to equal the backing store; filter follows MODE - nearest for the walked
   world, `auto` LEFT ALONE for the builder overview, where 13:1 hero
   minifications need smoothing and Paolo likes the surface as it is). New
   instrument: tools/bohemia_canvas_scale_audit.js measures every canvas's CSS
   box and glass scale against its backing store, on every tab. Locked BOTH
   directions by gates/canvas_scale_gate.js.
0c. (measured 7/27, [PENDING Paolo] - a LOOK call, not a bug fix) THE NAV
   PORTRAIT IS A LUMPY x1.25. #modeFace is a 64x64 player frame shown in the
   80x80 mode button: 64 -> 80 is x1.25, so with nearest some source pixels are
   one screen pixel wide and some are two, on a FACE. Every fix is a visible
   change to a surface he did not ask about - show the face at 64 inside the
   80px ring (an 8px rim of the button's gradient shows), or take the ring to
   64. Do not pick one for him. | canvas_scale_gate would lock whichever he
   picks | measured by tools/bohemia_canvas_scale_audit.js | no.
0a. (discovered 7/26) PRE-SCALE THE DISTRICT HEROES. 732 draws per walk push a
   ~266x172 hero image into a ~20x13 slot - a 13:1 minification done every
   frame. Smoothing is the RIGHT call at that ratio so the look is fine; the
   waste is doing it every frame instead of once. Cache one pre-scaled copy per
   hero per zoom: identical output, a fraction of the work. | render_pixel_gate
   ratchet on the smoothed count once it drops | the city-builder overview is a
   surface Paolo LIKES - identical output or do not touch it | no.
1. [BLOCKED ON THE TARGET PICK] DRESS THE INTERIORS. Paolo killed the first
   interiors ("Dogshit.") and the diagnosis is empty rooms: the shell is lawful
   approved art but it is five textures and no furniture. The furniture is ready
   (banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, UP-only, bucketed by room function)
   and the role->bucket mapping is written in
   records/BOHEMIA_INTERIOR_KILL_AND_THE_SWEEP_CROSSING_7_26_26.md. Do NOT wire
   it before the target screen is approved - that is the freeze, and dressing
   rooms from loose tiles against no reference is what the reset exists to stop.
   | interiors_gate extended: the pool is UP-only and every drawn tile traces to
   a UP verdict | the shell/mechanism is done, do not re-litigate it | yes - the
   dressed room is judged as an assembled scene, per TILESETS-ARE-SETS.
-1. [DONE 7/26, CITY] THE CITY TAB DREW WORLD ART SMOOTHED. It never set
   imageSmoothingEnabled at all, so it took the browser default (true) and
   bilinear-filtered every approved tile - worst on 3x phones. Fixed at the
   SOURCE (tools/bohemia_city_tab.py), both at context creation and inside
   fit(), because assigning cv.width/cv.height resets the entire 2D context
   state and silently turns smoothing back on. The ART lane's PIPELINE_DEBT
   exemption in target_screen_gate.py is DELETED per its own terms; that gate
   now holds every surface to the contract with no exceptions (484 checks).
2. MARRY COMMERCIAL (discovered, CITY 7/26). The corner plaza has NEVER been
   registered with the district kit (it never binds K, and the registration sits
   behind a `typeof K` guard that silently swallowed it), so the walked city
   still renders commercial from the LEGACY PREFAB STAMPS — not the canon plaza,
   nothing enterable. Binding K is one line and turns walkable_gate RED: on a
   single W or N street the generator builds only ONE store strip and parking
   fills the rest (drive 61% vs content 30%). Fix the mid-block/single-edge form
   FIRST, then bind K. Full numbers in the module's own head comment + records/
   BOHEMIA_INTERIORS_EVERYWHERE_7_26_26.md. | walkable_gate green with commercial
   swept + interiors_gate proves a plaza store is enterable | the S/corner form is
   approved, do not reshape it | the mid-block plaza form is [PENDING Paolo] per
   the module's own NOTES — surface it as rendered candidates, do not pick one.
3. GARAGE + CRYPT INTERIORS IN THE ALPHA (discovered, CITY 7/26). The engine
   DISPATCHES a building's interior by kind (garage -> multi-deck parking, crypt
   -> vault hall, everything else -> rooms) and world_gate proves it. The alpha's
   STEP-INSIDE renders the ROOMS kind only, so walking into a parking structure
   or a mausoleum gets you a floorplan instead of decks/vaults. Embed
   bohemia_garage.js + bohemia_crypt.js in CITY_B64 (resync tool exists now) and
   branch the render the way the engine branches. | interiors_gate extended to
   assert all three kinds render | engine dispatch is correct, do not touch it |
   the deck/vault LOOK = judge before volume.
4. Interiors everywhere: DONE 7/26 (records/BOHEMIA_INTERIORS_EVERYWHERE_7_26_26
   .md). Left standing: THE UNDERGROUND behind wash's sewer tunnel mouth is a
   LIFE-lane below-grade level, not a room in a footprint. [PENDING — LIFE lane]
5. District volume: next Pocket-City-type gaps that fit the dead world, on
   the KIT, full touchpoint list per the architecture map. | per-district gate
   x6 configs | bespoke strip/casino (Paolo's hand) | new district LOOK =
   judge before volume.
6. (discovered, coordinator 7/25) RIG_B64/PREFAB_B64 byte-lock holes + sync-
   canon gaps (PLOTGEN/POWERGRID/FLOORPLAN/TRANSITIONS). NON-COOK item. |
   new byte-lock gates registered | — | no.
   (CITY 7/26 note: tools/bohemia_city_module_resync.py now re-syncs every
   engine module inlined in CITY_B64 and `--check` reports staleness, which is
   the freshness half of this item for the CITY app. It caught commercial +
   suburb + district_kit all silently behind. The remaining half is the same
   treatment for RIG_B64/PREFAB_B64.)

## COMBAT
TILES. (7/28, on Paolo's TILE FORMS ORDER) EIGHT COMBAT TILE FORMS FILED, FOUR
   THINGS DELIBERATELY NOT FILED. Forms: records/tileforms/TF-CMB-001..008 —
   low cover (vaultable), tall cover (blocking), the dead car, the upper deck
   slab, the deck stair run, the deck guard, the muzzle flash, fight litter.
   Board rows 10-17 in BOHEMIA_TILE_REQUESTS.md. NOTHING COOKED (the art lane
   cooks from forms only).
   *** THE SHOPPING CHECK IS THE REAL RESULT: four things this lane draws in
   code are ALREADY APPROVED with ZERO consumers, so filing forms for them would
   have been a REUSE-FIRST violation. *** The 42-tile md5-locked starter set has
   road_0/1/2 + concrete + dirt + gravel + kerb and combat paints a procedural
   grey fill instead. MARKING_BANK has 84 approved items ("I like all of them")
   with no live surface while combat hand-draws its median — AND THAT HAND-DRAWN
   MEDIAN WAS THE PERSISTENT ORANGE PAOLO REPORTED FOR THREE TURNS.
   GORE_OVERLAY_BANK's own header reads "combat floor-painting layer... blood/
   gore overlays, draw-after-ground", 20 UP, never touched the combat floor.
   Approved smoke/spark loops have no consumer. Write-up:
   records/BOHEMIA_COMBAT_TILE_SHOPPING_FINDINGS_7_28_26.md
   NEXT (non-cook, this lane's): wire the starter tileset + markings into
   drawField. [PENDING Paolo] whether combat may AUTO-place the approved gore
   (the index holds it for story placement, contents are his).
   [PENDING Paolo] STALL_STRIPE_CANDIDATES (12 items) is cooked and UNJUDGED;
   one judging pass gives the deck and every lot its stall lines free.
   FLAGGED, NOT MINE: `gates/tileform_gate` does not exist. The form law names
   it and routes it to SHARED. Eight forms are currently validated by nothing.
ER. (discovered 7/28, ENGINE REALITY AUDIT — laws/BOHEMIA_ENGINE_REALITY_MAP_
   7_28_26.md) COMBAT HAS NO ENGINE MODULE, AND IT IS THE WALL. BohemiaMelee
   exists nowhere in engine/ — its only canonical body lives inside the 632KB
   COMBAT_B64 blob, edited by ~25 one-shot patch scripts with NO resync/
   freshness tool (CITY_B64 has one, 40/40 green; COMBAT has nothing). Every
   ruled combat future (ally-in-combat item 0, ambient spawns, any
   walk-surface combat feel) is blocked behind this. The work, non-cook:
   extract BohemiaMelee into engine/ as the one canonical body, make the
   blob a generated carrier, ship a bohemia_combat_resync tool + freshness
   gate on the CITY_B64 pattern. ALSO: the reverted frame-warming (the
   "14ms handoff" was measured warmed; warming was pulled 7/26 for baking
   stale clothing) — re-land it without the stale-bake bug so first fights
   stop paying the full 632KB decode. | resync --check green + a freshness
   gate registered; handoff timed on the real surface | the dial's behavior
   changes ZERO — this is plumbing, byte-identical output is the proof | no.
   RULED 7/28 (Paolo: "Real combat in the exact whole coding how we built
   it" — laws/BOHEMIA_ADDENDUM_REAL_COMBAT_ON_THE_WALK_7_28_26.md): the
   destination is REAL combat ON the walk surface, and the extraction above
   is step (a) of the ruled sequence — then (b) enemy render on the walk's
   tile canvas, (c) one input model, (d) one beat clock (the dial's audio
   clock becomes the walk's). EXTRACTION NEVER REWRITE: byte-identical dial
   behavior is the gate; any mechanics change during the move is a
   violation. The faster-tab-swap is dead as a goal (fine as a side effect).
1a. (discovered 7/26 by COMBAT, NOT ours to fix) THE RENDER PIXEL GATE IS FLAKY.
   It drives a live WALKING CITY and measures whatever draws happen, so the draw
   count swings ~19.8k-22.8k run to run. It failed once at 12.4% half-pixel draws
   against a 6% ratchet, then passed 4/4 on six consecutive runs (three on clean
   main, three with the same working tree that failed). A gate that can red-flag
   any lane at random will eventually get ignored, which is worse than no gate.
   Suggest: average N runs, or drive a FIXED deterministic route instead of a
   timed walk. Owning lane: ART/render. | — | gates/render_pixel_gate.js | no.
0. DONE 7/27 (v87): THE ORANGE WAS THE STREAK GLOW, AND THE PAUSE IS NOW EMPTY
   BY LAW. Sixth report. Five reproductions found nothing for one reason: EVERY
   PROBE I EVER WROTE KILLS ONE MAN, AND PAOLO PLAYS WHOLE ENCOUNTERS. Chain
   escalation only draws at killStreak>=2. It is a FULL-SCREEN rgba(255,60,40)
   radial wash, brightest at the screen EDGE, which is where the dial sits --
   which is why he named the dial and why I kept measuring the dial's arcs and
   correctly finding them at zero.
   MEASURED at a 3-streak, off the colour stop the game really asks for:
     +  875ms  ks.t=0.871  freeze=0     alpha=0.199
     + 2284ms  ks.t=0.969  freeze=HELD  alpha=0.190   <- 1.4s, 0.009 of fade
   AND IN PIXELS, freeze frame, outer 12% of screen:
     before rgb(70.8,53.1,42.4) 380 warm px | after rgb(25.7,24.8,31.0) 0 warm px
   (a) THE GLOW blooms and leaves: one beat (JUICEMS.streak), wall clock, and it
   does not draw during a stop.
   (b) THE INSTRUMENT IS NEVER ON SCREEN DURING A STOP: _df, the one alpha owning
   the whole dial, is 0 while frozen. Safe because the demo already resets
   globalAlpha to 1 before drawKillshotWorld.
   (c) WHAT'S ON SCREEN v2: it could never have found this -- fills only, 2% size
   floor, and a gradient stringifies to "[object CanvasGradient]". Now watches
   strokes and gradient colour stops and keeps anything WARM at any size.
   HARNESS LESSONS, both earned: reproduce at the STATE HE PLAYS IN, not the
   cheapest state that runs; and THRESHOLDS HIDE BUGS -- five pixel scans tested
   r>100 while the wash composites to rgb(72,31,24). It was in every screenshot.
   LAW: laws/BOHEMIA_ADDENDUM_THE_PAUSE_IS_EMPTY_7_27_26.md
   Gate section 22, 390 checks.
0-levelsresearch. RESEARCH DELIVERED 7/27 on his ask ("big brain research on how
   other games to turn base grades handle different levels... just do research").
   records/BOHEMIA_COMBAT_RESEARCH_LEVELS_IN_GRID_TACTICS_7_27_26.md
   NOTHING BUILT. He said research, so it is research.
   HEADLINE: ALMOST EVERY TACTICS GAME PAYS FOR HEIGHT WITH A STAT BONUS, WHICH HIS
   NO-MULTIPLIERS RULING CLOSES -- and the one famous game that does NOT is the one
   Bohemia already resembles. XCOM: +20 aim, no defensive bonus. Divinity: bonus
   damage + range. FF Tactics: shifts hit rate. ALL RULED OUT.
   JAGGED ALLIANCE 2 IS THE CLOSEST RELATIVE: two levels only, ground and roof, and
   height pays in LINE OF SIGHT not numbers. That is exactly what v90 shipped,
   arrived at independently. Two levels is a deliberate shipped choice there, not a
   shortcut -- so "one deck, not a building" has a real precedent.
   AND THE CONFIRMATION WORTH KNOWING: XCOM's FLANKING rule is "a unit not
   benefiting from cover is flanked" -- Bohemia's cross-level rule IS that rule
   turned vertical. We already have the mechanism XCOM built its positioning game
   on.
   THE COST THE LITERATURE NAMES, AND WE ALREADY PAID TWICE IN ONE TURN: verticality
   is a READABILITY problem, most maps cap at THREE floor planes, and designers
   "forget about the third dimension because it's difficult to represent in 2D."
   v90's storey face did not read as height; v90b's way up appeared 0 of 8 times.
   FOUR IDEAS, ALL [PENDING Paolo], NOTHING BUILT, ranked by whether they change a
   decision: 1 VERTICAL REACH PER WEAPON (FFT's 3v2 -- a shotgun should not reach a
   roof like a rifle; makes the climb a loadout decision, and it is reachability not
   damage). 2 THE ANGLE GRADIENT (XCOM's 44deg->10deg partial flank, expressed as
   ODDS not damage -- the ONE item that closes the audit's open finding that no
   direction is better than any other at a given range). 3 A THIRD STOREY (cheap
   now; three planes is the documented ceiling). 4 ROOF-EDGE COVER (the deck is
   currently a killing floor with no cover either way; JA2's roofs have parapets --
   most likely to change how the deck actually plays).
   NOT RECOMMENDED ON THE EVIDENCE: any height damage or accuracy bonus. Ruled out
   by him, and the DOS2 critique shows what happens anyway -- the bonus lands in the
   same slot as crit and a whole skill tree goes redundant.
0-under. DONE 7/27 (v93): YOU CAN SEE WHO IS UNDER THE DECK. Paolo: "there has to
   be like the [opacity] thing where I could see who's underneath the stairs."
   REPRODUCED, AND IT WAS THE OPPOSITE OF HIDDEN: a living man parked on the lot
   under a deck tile was drawn ON TOP OF the storey above him. Every body paints in
   ONE pass at ONE depth, so a man underneath a platform and a man standing on it
   were pixel-identical -- the picture actively LIED about which floor anyone was
   on, which is worse than occlusion (occlusion at least tells you something is in
   front).
   THE X-RAY, which is what every top-down game with a roof does: a body on the lot
   with a storey over its head draws as a GHOST, washed cold blue-grey and dropped
   to 0.42 alpha. Solid = on the deck. Ghost = underneath. No UI words needed, and
   the read line also says UNDER THE DECK for the case level words could not cover.
   ONE RULE FOR EVERY BODY, enemies and the player alike.
   REUSE: rides drawHumanWashed, the existing tint path the stun/firing/peeking/
   wounded reads already use. No new draw path invented.
   NOT DONE, AND SAID SO: the honest fix is a three-pass depth sort (ground bodies,
   deck, deck bodies). drawField's body pass is one 180-line loop that also owns
   wounds, weapon reads, target rings, beg lines, elite glints and health bars;
   splitting it by level is a large risky reorder of the most-touched function in
   the file AND WOULD STILL NEED THE X-RAY, because a man perfectly hidden under a
   roof is a man you cannot make a decision about. If the pass is ever split for
   another reason, the ghost stays correct.
   A GHOST IS A READ, NOT A RULE CHANGE: gated that being under the deck alters
   nothing about cover, damage or exposure.
   Gate section 29, 469 checks.
0-allowance. *** THINKING DELIVERED 7/27, NOTHING BUILT, ON HIS EXPLICIT ASK
   ("could you look at the code and think about it for a turn"). ***
   records/BOHEMIA_COMBAT_THE_KILLSHOT_ALLOWANCE_7_27_26.md
   HIS IDEA: the difficulty setting becomes HOW MANY KILLSHOTS YOU GET PER TURN
   before the dial ramps up, and perks/cards raise that number.
   WHAT THE CODE DOES TODAY: the chain is UNLIMITED (afterKill re-enters aim on
   every landed killshot, forever, until you miss) and the difficulty setting is a
   CEILING NOT A FLOOR -- distPkg = round(distT*userPkg) is ZERO at point blank on
   every setting including Bohemian. The shot number influences nothing. There is
   no per-turn shot counter anywhere in the file.
   MY READ: BUILD IT. It is the strongest idea to come through this lane. It
   creates a decision that does not exist (stop, or take the harder dial -- it is
   THE BANK from the 7/27 research, but better, because the stake is the turn
   itself and it needs no new currency). It makes "difficulty" sayable in one
   sentence, which is the bar SUPPRESS has failed three times. It gives progression
   ONE clean number to grant. And it answers "how long is a turn", which today has
   no shape at all.
   *** THREE RULINGS NEEDED BEFORE A LINE IS WRITTEN: ***
   1 IT COLLIDES WITH THE RANGE RULE. Point blank already forces EASY on any
     setting, so naively the ramp would not exist for anyone who closes -- which he
     ruled yesterday is the correct way to play. FLOOR (pkgDiff = max(range, ramp))
     or REPLACE? I recommend FLOOR: closing becomes how you AFFORD the extra shot.
   2 THE ALLOWANCE PER SETTING. Contents are his.
   3 THE RAMP SHAPE: +1 tier per shot, or accelerating? Cap at BOHEMIAN or past it?
   AND ONE CAUTION: "guaranteed" is a promise the dial cannot keep -- even EASY
   needs you to press in the band. GUARANTEE THE DIAL, NOT THE KILL ("2 EASY
   SHOTS", not "2 guaranteed kills").
   BUILD ORDER when he rules: counter + ramp first (the mechanic), then the read --
   the dial must SAY "SHOT 3 OF 2 - V.HARD" or it is invisible, which is the
   mistake this lane has now made three times running.
0-staircase. DONE 7/27 (v92): THERE WAS NEVER A STAIRCASE, ONLY A DECAL. Paolo:
   "You have stairs right now looking like dog shit... do a big brain online
   research. Have some references and do what you're supposed to."
   WHAT WAS THERE: three faint stripes painted on the TOP FACE of a deck tile, one
   whole storey above the lot. *** THE STAIRS NEVER TOUCHED THE GROUND. *** Nothing
   in the picture joined the two floors. I drew a texture where a piece of
   ARCHITECTURE was needed, and the structural problem was worse than the palette
   one.
   THE RESEARCH, and all three rules were missing: (1) THREE SHADES PER STEP --
   bright top face, dark side face (Pixel Parmesan, Fundamentals of Isometric Pixel
   Art). (2) HEIGHT LINES ARE PERFECTLY VERTICAL -- the riser is the only thing in a
   top-down frame that says "this is tall" (SLYNYRD, Pixelblog 41). (3) DRAW BACK TO
   FRONT so near steps occlude far ones; without the occlusion a stack of bands is a
   barcode. Also consulted: Pixelation's "Stairs in top down perspective", M. Bitzos
   on 2D top-down stairs, Zelda ALTTP as the classic vocabulary.
   Which agrees with what this lane already learned on the deck face: VALUE CONTRAST
   IS THE HEIGHT CUE.
   SHIPPED: a five-step run with bright treads and near-black risers spanning the
   full storey, drawn top-step-first, narrowing with distance, throwing a shadow on
   the lot at its foot; the chevron lifted off the steps it points at.
   TWO BUGS CAUGHT BY LOOKING, NOT READING:
   (a) FOUR ORIENTATIONS, ONE BROKEN. Marching away up-screen, every riser is taller
   than the gap to the next step and the run collapsed into a dark smear -- invisible
   in exactly that one of four cases. FIXED AT THE SOURCE, not special-cased: the
   entrance is now GENERATED on the deck's near edge, so the run always descends
   toward the viewer. One orientation, one that reads.
   (b) A STOREY IS A STOREY WHICHEVER FLOOR YOU ARE ON. The rise was measured
   relative to your feet, so standing on the deck it was ZERO and the way DOWN was
   invisible -- the button said DOWN and the picture said nothing.
   *** AND THE IDEMPOTENCY TRAP, WORTH REMEMBERING: I edited v90's tool to move the
   stair placement and NOTHING HAPPENED, because v90 is already shipped on main and
   its tool correctly skips an already-patched tree. A CHANGE TO SHIPPED CODE BELONGS
   IN THE NEW PATCH AS A MIGRATION, never as an edit to the old tool. ***
   REUSE CHECK: banks/ searched. 19 approved stair tiles DO exist (Stairs+ladders+
   railings n=6 part1, Stairs and lifts n=12 part3, Staircases and elevation n=1
   part4). NOT USED: the run must span DECK_H, computed at runtime from the live
   camera zoom, and a fixed raster cannot stretch between two screen heights that
   change. Cooked as vector geometry in the language the deck and pillars already
   speak. FILED as the replacement for when the combat surface goes tiled.
   TWO OLDER CHECKS re-pointed, not deleted -- one of them asserted the DECAL and
   passed happily while the thing it described was what he called dog shit.
   Gate section 28, 462 checks.
0-stairs. DONE 7/27 (v91): THE STAIRS ANNOUNCE THEMSELVES. Paolo: "I couldn't find
   the stairs bro or whatever you had out what the fuck are you talking about?"
   REPRODUCED, eight arenas, played the way he plays them:
     arenas with a deck:                 8 of 8
     whose stair tile was ON SCREEN:     8 of 8
     that ever showed the STAIRS button: 0 of 8   *** ZERO ***
   v90b gated the button on stairNear() (1.6 tiles). The stairs spawn 3-6 tiles
   out. So the only thing that ever said "there is a way up" required walking to
   it first, under fire, toward a thing he had no reason to believe existed. And
   v90b's OWN DOCSTRING says "a mechanic nobody can see is not a mechanic yet."
   I shipped a door that is invisible until you are standing on it.
   (a) THE BUTTON IS ALWAYS ON SCREEN when the arena has a deck, dimmed, reading
   "STAIRS 4 N" -- distance and 8-way compass bearing. Adjacent it lights up to
   "UP - 1 STA". On a phone the BUTTON is the reliable channel: it cannot be
   zoomed out of, panned off, or mistaken for scenery.
   (b) A TAP FROM ACROSS THE LOT POINTS instead of no-opping.
   (c) A BEAT-PULSING CHEVRON over the stair tile, sized in RING UNITS so it
   survives the auto-frame zooming out to fit eight men, drawn after the deck.
   (d) THE FIGHT SAYS IT HAS A STOREY, once, at the top, and every SHUFFLE says
   whether the arena it rolled has a way up or is a flat lot.
   AFTER: 6 of 6 deck arenas show it; the 2 flat lots correctly do not.
   *** WHAT DID NOT CHANGE, AND MUST NOT: you still WALK there, it still costs a
   pip, it is still the only way up. Advertising a position is not giving it away
   -- the walk under fire IS the price of the high ground. ***
   AND THE GATE HAD TO BE CORRECTED, NOT RELAXED: v90's own check asserted the
   button "only exists when you can actually use it, on the same terms SHOVE
   does". That rule IS the bug. SHOVE is a verb against a man in your face;
   STAIRS is a verb against a PLACE ACROSS THE LOT, and copying one rule onto the
   other is what made it unfindable. The check now asserts the invariant that
   actually matters (usable only from arm's reach).
   Gate section 27, 450 checks.
0-storey. DONE 7/27 (v90+v90b): TWO-STOREY ARENAS. On his ruling, "Two-story
   arenas yes", asked for by name twice before that.
   *** THE ONE RULE: ACROSS LEVELS, GROUND COVER DOES NOT COUNT, FOR EITHER OF
   YOU. *** From the deck you shoot men who thought they were behind stone; from
   up there you are behind nothing yourself. Physically true, one condition in one
   function, and the SAME SHAPE as the point-blank trade he ruled on: better odds
   to kill, worse odds to live.
   IT OBEYS BOTH HIS RULINGS. No damage multiplier -- KILL_DMG is untouched and
   gated as untouched. Height changes WHO IS EXPOSED, which is odds. And it is the
   first thing in the game that changes what you DELIVER by moving, which is the
   exact gap the north-star audit named.
   MEASURED, arena #70368 (6-tile deck, 2 men on it, 15 ground cover):
     from the ground  cover working against you: 0   clean lines on you: 7
     from the deck    cover working against you: 1   clean lines on you: 6
   (a) THE DECK is world-anchored tiles like the pillars, so worldShift already
   carries it and every coordinate function already understood it. Rolled by the
   ARENA SEED -- including WHETHER there is one (72%), so "flat lot or high
   ground" is itself a difference between arenas.
   (b) STAIRS: the closest deck tile to you, always walkable-to. ONE STAMINA, NO
   TURN (Paolo 7/26 LOCKED, and his own words: "sprinting and not losing a turn
   can help that"). Taking the high ground is priced like closing the distance.
   (c) A BLADE CANNOT REACH A FLOOR ABOVE IT. Not a balance number, an arm.
   (d) LEVELS DRAW RELATIVE TO YOU -- the deck floats above the lot from the
   ground and becomes the floor under your feet once you climb it. ONE SCENE.
   (e) THE READ says HIGH GROUND / HE IS ABOVE YOU and says the loud part: every
   piece of stone on the lot just stopped counting.
   *** TWO ANCHOR BUGS I CAUGHT MYSELF, SAME ROOT CAUSE. *** v1 anchored the deck
   placement on "updateGeomCover(); renderBoard();" -- UNIQUE, and inside
   doSuppress(), so the deck placement ran inside the SUPPRESS verb. v2 anchored on
   "G.e.push(e); } }" whose "} }" closes the LOOP *and* the FUNCTION, so the block
   landed OUTSIDE the builder as module-level dead code that ran once at load.
   *** ANCHOR UNIQUENESS IS NOT ANCHOR CORRECTNESS. Check the brace depth and check
   WHICH FUNCTION the line is in. *** Both were caught by probing the live game
   (deck generated, 0 men on it), not by reading.
   AND THE FIRST RENDER FAILED THE EYE: the storey face was #3e372c and the deck
   read as a lighter PATCH OF GROUND, not a thing with a height. Value contrast IS
   the height cue: the face is near-black now against the lot.
   FIVE OLDER GATE CHECKS string-matched the two-arg myCoverAgainst signature. All
   re-pointed at the invariant, never relaxed.
   *** WHAT THIS IS NOT: one deck, not a building. No rooms, no interiors, no roof,
   no third floor, no ladders, no vaulting off the edge. Each is separate and each
   is [PENDING Paolo]. This is the smallest thing that makes two storeys a real
   decision, shipped to be judged before anything is stacked on it. ***
   Gate section 26, 441 checks.
0-arena2. DONE 7/27 (v89): THE GENERATOR ONLY EVER MADE ONE ARENA. Paolo on v88:
   "I dont see new arenas shit was boring if u did anything." He is right twice.
   MEASURED on v88, six arenas back to back: 6,5,7,7,6,7 pieces, mean spread
   5.79-6.70, and r=0.55 for EVERY piece ever placed since the demo shipped. That
   is ONE arena with the dots moved. v88 handed him dice and a notebook for a
   generator with one brick in it, then told him to go find arenas worth keeping.
   AFTER: 6,4,13,15,11,13 pieces, radius 0.45-1.15, with runs.
   (a) DENSITY IS A REAL RANGE: 2-15, not 5-7. A five-to-seven swing is a rounding
   error the eye cannot see, which is exactly what he could not see.
   (b) COVER HAS A SIZE. The existing cover maths already scaled off P.r in every
   place it is used (myCoverAgainst, realCoverPillar, segNear, the dash-path
   block), so nothing needed rewriting -- the number was simply never allowed to
   vary.
   (c) PIECES CLUSTER INTO RUNS, so WALLS and CORNERS emerge from the same circle
   maths that already ships. A wall is three pillars in a row and every cover
   function already understands three pillars in a row: no new geometry, no new
   collision, no new cover rule. This is the first time the ground has ever argued
   for approaching from a particular side.
   (d) "I DONT SEE" WAS ALSO LITERAL: the ARENA button rendered blank until the
   first tap (updArenaBtn only ran inside the click handler), so one control in a
   row of eleven said nothing about itself. It labels itself on startup now.
   MAP LAW HELD: density, size and clustering are PARAMETERS. No layout authored,
   no arena named. The seed decides what the vocabulary says; which arenas are
   canon is still only his call.
   AND THE GATE CAUGHT ME: three older checks string-matched the OLD generator
   (one of them matched a COMMENT). A comment was never the invariant -- they are
   rewritten to assert the rounding itself on BOTH placement paths, which is
   strictly stronger than what they tested before.
   *** STILL NOT WHAT HE ORIGINALLY DESCRIBED: this is barrels on a flat lot. He
   asked for "two stories where their stairs" and "an actual arena map". Verticality
   and rooms are a different, bigger build and [PENDING Paolo]. ***
   Gate section 25, 423 checks.
0-arena. DONE 7/27 (v88): THE PROVING GROUND. On his ask, "maybe its time to add a
   shuffable arena map fr", plus two rulings in the same message.
   *** RULING 1: NO DAMAGE MULTIPLIERS. *** "theres not a lot of ways to increase
   damage other than hit the killshot." Position does not make the number bigger,
   it makes the killshot LANDABLE. That kills flank-damage, elevation-damage and
   every other multiplier before anyone builds one. Gated.
   *** RULING 2: POINT BLANK IS THE OFFENSIVE PLAY, sprint is how you get there.
   AND IT WAS ALREADY BUILT, JUST INVISIBLE. *** distPkg drops the needle to the
   EASIEST tier in the game at point blank on any difficulty; distAccuracy takes
   their hit chance on you from 0.37 to 0.97. Complete shipped risk/reward that no
   player was ever shown. My 7/27 audit called it "the wrong way for tension" -- he
   corrected me, it IS the tension. Audit corrected in place.
   (a) SEEDED ARENAS. BohemiaArena.withDice() runs the whole encounter build on a
   deterministic PRNG then hands Math.random straight back (gated, including on a
   throw). One number reproduces one exact fight forever. MAP LAW held: the
   generator is WRAPPED, not rewritten -- Claude authored no layout. This is the
   MAP LAW hook made literal: I hand him the dice and the notebook, HE says which
   arena numbers are canon.
   (b) SHUFFLE. One button, ARENA #4417. Re-rolls cover and spawns WITHOUT touching
   HP or streak, so a dozen arenas cost a dozen seconds instead of a fight each.
   Writes the seed into the comment box (COPY is already beside it) and reads a
   number back OUT of the same box to replay an arena. Zero new UI.
   (c) THE RANGE READ. Both halves of the trade on one line, always on, computed
   from THE SAME expressions the fight runs so it cannot drift:
     at  3 tiles: POINT BLANK · his dial: EASY   · he hits you 97%
     at 30 tiles: LONG RANGE  · his dial: V.HARD · he hits you 37%
   BUG THE CLICK TEST CAUGHT AND THE GATE NOW HOLDS: writing the seed OUT into the
   comment box poisoned the read back IN, so SHUFFLE locked to the first arena and
   only ever shuffled once. Three taps gave one arena. The box is a request only
   when PAOLO put the number there.
   NOT BUILT: COMPANIONS. He said "maybe?" and it carries a dozen unruled decisions
   (who they are, what they cost, whether they can die, whether you order them).
   The arena is what they get tested IN, so it came first either way. [PENDING]
   Gate section 24, 413 checks.
0-northstar. *** THE COMBAT NORTH STAR, PAOLO 7/27, LOCKED. *** Asked what makes a
   fight fun for him: "the strategy choice to deal the most damage and take the
   least amount of damage by positioning and abilities and deeper understanding of
   mechanics. gameplay. feeling snappy and violent and human and fun."
   LAW: laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md
   THE TEST EVERY COMBAT ITEM NOW PASSES OR DIES: does it change how much damage I
   DEAL or TAKE, through POSITION, SPEND, or KNOWLEDGE? If no, it is not a combat
   feature and it never leads a pick-list.
   AUDIT OF THE SHIPPING DEMO AGAINST IT, with the real numbers:
   records/BOHEMIA_COMBAT_AUDIT_AGAINST_THE_NORTH_STAR_7_27_26.md
     TAKE LESS DAMAGE BY POSITION: IMPLEMENTED, strongly, but BINARY. Cover is a
     predicate incoming fire FILTERS on -- an enemy you have cover against is
     removed from the volley entirely, 0% or 100%, never a modifier. Range is a
     real curve on top: 0.97 accuracy at point blank to 0.37 at long, a 2.6x swing.
     DEAL MORE DAMAGE BY POSITION: *** ABSENT. *** KILL_DMG=100, flat, from
     anywhere on the map. No flank, no angle, no point-blank lethality, no
     elevation, no positional term ANYWHERE in the player's damage path. The dial's
     band widths scale on difficulty, steady aim and streak, never on where you
     stand. Range touches only WHICH PATTERN you get (distPkg) -- execution, not
     damage -- and it points the wrong way: the safest place is also the easiest to
     shoot from.
     ABILITIES: 7 verbs on 3 pips, no turn cost. A real spend economy, well shaped.
     But move/dash/vault/sprint/suppress/shove are ALL DEFENSIVE. Only the grenade
     touches your output. Nothing can be spent to hit harder.
     UNDERSTANDING: the strongest leg and the quietest -- patterns, band widths,
     lethality gates, cover geometry, readable fire cycles. Mostly unlabelled,
     which is a LEGIBILITY problem, not a missing mechanic (same shape as the
     three-times SUPPRESS complaint).
   *** THE ONE ASYMMETRY: POSITION CONTROLS WHAT YOU SUFFER AND NOTHING ABOUT WHAT
   YOU DELIVER. *** So moving is housekeeping, not offence, and the ground never
   argues for attacking from a particular place. WHAT SHAPE THE ANSWER TAKES IS
   [PENDING Paolo] -- flanking, elevation, point-blank lethality, exposure windows
   and angle-of-fire are each a DIFFERENT GAME. Mechanism is mine, the ruling is
   his. Nothing built, nothing pre-selected.
   Gate section 23 PINS THE AUDIT TO THE LIVE CODE (damage constant, accuracy
   curve, distance bands, the binary cover predicate, the stamina ceiling, and the
   headline finding that no positional term multiplies player damage). Change the
   model and the gate fails, which forces the audit back into line the same turn.
   399 checks.
0-kill. *** THE TALLY IS DEAD, KILLED AT THE PITCH, NEVER BUILT (7/27). ***
   Paolo: "this was terrible i hated this this was not a gameplay mechanic this is
   more data to be proud of no one gives a fuck."
   His diagnosis IS the failure. A tally changes NO decision the player makes -- it
   happens after the outcome is already fixed, so it is a presentation layer
   wearing a mechanic's clothes, pitched in answer to "make combat more fun".
   ROOT CAUSE: the research doc had six items, five of them mechanics and one pure
   presentation, and I ranked them by how impressive the RESEARCH was instead of by
   whether they change what the player DOES. Same failure as the 7/20 queued-actions
   grammar kill: "research ranks candidates, only PLAY decides." Second time.
   *** THE LANE RULE THIS LEAVES: IF IT DOES NOT CHANGE A DECISION THE PLAYER
   MAKES, IT IS NOT A MECHANIC. *** Ask it BEFORE an item goes on a list. Anything
   after the outcome is locked -- tally, grade, summary, stat, badge, receipt -- is
   FEEDBACK, and it never leads a pick-list again.
   Graveyard + post-mortem: records/BOHEMIA_TALLY_KILL_7_27_26.txt.
   NOT DEAD: the existing receipt (untouched), and research items 2-6 (never
   judged). Scoring presentation is ENDED as a subject for this session per
   STOP PRODUCING. Nobody re-pitches it.
0-research. RESEARCH DELIVERED 7/27 on his ask ("big brain research... addictive
   juicy sauce"): records/BOHEMIA_COMBAT_RESEARCH_THE_ADDICTIVE_SAUCE_7_27_26.md
   HEADLINE: Bohemia is a casino game that does not pay out like one. Balatro's
   engine is not the poker, it is THE TALLY -- the score assembling itself one
   element at a time with pitch and speed climbing. Bohemia already owns every
   part (receipt, wager, gold chips, kill streak, graded press) and spends none of
   them, and it has the one thing Balatro has to fake: a 120 BPM grid. A payout
   that lands each element on a sixteenth IS a drum fill.
   RANKED, ALL [PENDING Paolo]: 1 the payout is a drum fill, 2 THE BANK
   (push-your-luck on the wager he already invented), 3 enemy intent on by
   default, 4 the optional beat counter (Hi-Fi Rush's accessibility answer),
   5 the district remembers, 6 the kill cam earns its length from the stake.
   AND THE WARNING EVERY SOURCE AGREES ON: layered rewards must not compete for
   the same second. He said it himself about audio on 7/26; v87 proves the same
   failure existed visually.
0. DONE 7/27 (v86): THE REST OF THE JUICE PASS, ON THE GRID. Item 1e's leftovers,
   built while he slept because they are the lane's top item that needs NO verdict
   ("no" thumbs, his own pick-list, his standing word "I want more juice").
   Auditing them first turned three of five into BUGS, and the MEASURING turned up
   two more the writing had missed.
   (a) THE SHOT FLASH WAS FRAME-COUNTED: flash-=0.08 PER FRAME = 208ms at 60Hz and
   104ms on his 120Hz phone. Not a duration, a refresh rate. Same defect class as
   the frame-counted hit-stop v81 killed, sitting untouched in a second place.
   (b) THE KILLSHOT PUNCH WAS A FRACTION OF ks.dur: the same white ran 0.167s
   behind a clean kill and 0.375s behind a sharp one.
   (c) AND THE ZERO WAS WRONG TWICE, both caught by the probe not by Paolo: keyed
   to ks.t the hit-stop PINNED it (measured 633ms of white); keyed to G._ksAt it
   never drew at all, because the HELD BREATH runs first and driveKillshotCamera
   early-returns through the whole thing. G._ksGo = the first frame the cinematic
   actually draws. Measured after: clean 91ms, sharp 115ms.
   (d) RECOIL comes home ON the next sixteenth (was dt*4.5 = 0.222s, between two
   notes). Measured 130ms. (e) THE HELD BREATH was 0.12 against a sixteenth of
   0.125 -- 4% off the grid. (f) PERMANENCE: the brass cap was 14, so the
   fifteenth casing silently deleted the first; now 96, still bounded, still
   cleared on a fresh fight. (g) THE IMPACT THROWS ALONG THE SHOT: twelve
   particles at k/12*6.28 is a perfect circle, the one shape a real impact never
   makes; now x1.30 down-range against x0.45 behind.
   NOT SHIPPED ON PURPOSE: THE CAMERA THAT LEADS. Every other item is a defect
   with a right answer; camera lead is a FEEL call with a dozen, and picking one
   while he is asleep is what STOP PRODUCING forbids. Stays on his pick-list.
   LAW: laws/BOHEMIA_ADDENDUM_EVERY_DURATION_IS_A_NOTE_7_27_26.md
   Gate section 21, 381 checks.
0. DONE 7/27 (v85): THE BROWN BOX AND THE ORANGE ONE, NAMED IN A CAPTURED FRAME
   AND BOTH DELETED. Five reports, five misses, then a reproduction first.
   scratchpad/spot.js: hook fillRect + drawImage + arc/fill + arc/stroke, convert
   every draw to SCREEN space via ctx.getTransform(), let the cinematic RUN, dump
   everything landing on the body at the frozen frame. It answered in one run:
     THE BROWN BOX   fillRect rgba(70,60,50,0.984) @197,272 42x50
     THE ORANGE ONE  arcFill  rgba(255,200,70,0.55) @197,237 9x9 + glow
   (a) THE BROWN BOX = drawKillshotWorld's LEGACY_PRE_REVAMP stand-in body. Its
   alpha is 1-ip*0.8 and ip=0 at contact, so it is a SOLID slab, and the freeze
   holds ks.t still so it stayed solid for the whole pause. DELETED.
   (b) IT WAS ALSO THE HEADSHOT ANSWER (0b, asked three times). Its own comment
   said so since 7/3/26: "still drops/fades ON TOP of the real sprite death
   playing underneath ... delete at cleanup." A 12-frame clip, three rolled
   variants, contact-timed, playing correctly, invisible under a placeholder.
   (c) THE ORANGE ONE = the JUICE.T gold payout chip. Spawns AT contact, flies on
   p.t, p.t rides dt, dt is 0 while frozen -- so it hung on the corpse for the
   whole pause. It no longer draws during a freeze: the stop belongs to the kill,
   the reward comes after it.
   (d) THE STOP IS A STILL, AND THE PAUSE IS PAID BACK. visNow() pins the body's
   clock during a freeze; every body timestamp then advances by exactly the frozen
   duration on release, or the clip snaps forward and the drop you paused FOR is
   the part that gets skipped (measured: frame 0 held, then straight to 4 of 12).
   LAW: laws/BOHEMIA_ADDENDUM_REPRODUCE_BEFORE_YOU_FIX_7_27_26.md
   Gate section 20, 368 checks.
0-prev. DONE 7/27 (v84): THE BROWN BOX + THE ORANGE, BOTH NAMED AND BOTH FIXED, and
   the instrument built so it never costs three turns again.
   (a) The brown box was a REGRESSION I CAUSED: v82 pinned _bpmPhase during the
   freeze, which pinned the JUICE.B floor pulse, which welds a full-screen
   orange-brown faction-accent wash on for the whole pause. The pulse no longer
   draws while frozen.
   (b) The orange was NEVER THE DIAL - it is the road's double-yellow median
   (rgba(184,160,40), 2x2670, ten times per pause), drawn AFTER the vignette that
   was supposed to dim it. Markings and lane dashes now fade with the shot.
   (c) WHAT'S ON SCREEN? - arm it, get a kill, the game names every draw covering
   >2% of the canvas into the comment box next to COPY.
   HARNESS LESSON: my probe kept freezing the game to photograph it, which stopped
   the cinematic it was measuring. Let it RUN and screenshot at 60ms.
   Gate section 19, 359 checks.
0a. UNBLOCKED 7/27 by v85 above -- the reproduction landed and both objects were
   named in a captured frame. History kept because the process lesson is the
   valuable part. WAS: *** BLOCKED. THE BROWN BOX + THE ORANGE DIAL ARE STILL ON
   HIS SCREEN AFTER THREE ATTEMPTS (v81/v82/v83). *** Post-mortem:
   records/BOHEMIA_COMBAT_POSTMORTEM_AND_RESEARCH_3_7_27_26.md
   The deploy DID land (8dcb1247 SUCCESS); the fixes were simply wrong. Root
   cause: THE KILL CINEMATIC CANNOT BE DRIVEN HEADLESS, so every fix was reasoning
   about code that was never watched running.
   DO NOT SHIP ANOTHER FIX FOR THIS WITHOUT A REPRODUCTION FIRST.
   HARD EVIDENCE captured by hooking CanvasRenderingContext2D.prototype during a
   killshot: rgba(184,160,40) drawn 108x as 2x2670 strips on cv = the orange dial
   parts, drawn OUTSIDE the _df alpha block. That is why tightening _df did
   nothing. Promising, NOT proven, NOT shipped.
   THE UNBLOCK (his call, neither built):
     (a) DEBUG CAPTURE in the build - during the freeze, name every draw covering
         >2% of the screen and print it in the combat log. One tap, he sends the
         text, the guessing ends for this and every future visual bug. Few lines.
     (b) A TEST HOOK that makes the killshot drivable headlessly, so this class of
         bug is reproducible forever.
0b. DONE 7/27 (v85), AND IT WAS NEVER A COOK. HEADSHOT 1 + HEADSHOT 2: the death
   clips already existed (L.death, 12 frames, three rolled variants, contact-timed
   off _deadAt). They were INVISIBLE because the LEGACY_PRE_REVAMP placeholder slab
   was drawn on top of them every killshot. Deleting the slab started the animation.
   STILL OPEN AS A JUDGE ITEM: he has never SEEN these clips, so the fall itself is
   UNJUDGED. If he wants a different fall, that is a fresh cook under LEAF-PIXEL +
   RIG + 45-DEGREE law -- but do not cook one before he has looked at the one that
   was already there.
0c. *** SUPPRESS - THIRD TIME HE HAS SAID IT IS CONFUSING. *** Research: XCOM's
   suppression confuses XCOM players too; its value "isn't self-evident" because
   both its effects are invisible until after the enemy acts. THE FIX IS NOT MORE
   MECHANICS, it is a LEGIBLE PROMISE sayable in ONE SENTENCE and shown ON THE MAN
   rather than in a readout. If the current version cannot be said in one
   sentence, that is the defect. [PENDING Paolo] what the promise is - three asks
   means he wants a RULE, not another tweak.
1b. DONE 7/26 (v83): THE BROWN BOX + THE DIAL THAT WOULD NOT LEAVE. From his
   screenshot. (a) The brown quad was #6c503b, traced to two LEGACY_PRE_REVAMP
   placeholder body blocks (brown torso rect + head square) from before real
   sprites existed; the killshot magnified them through the board zoom and the
   kill camera into a slab covering the frame. DELETED; a missing sprite draws
   nothing and logs it. (b) The dial's fade was a flat 350ms while a sharp shot
   contacts at 90ms, so it was 74% VISIBLE at impact. Now derived from the
   bullet's own travel time, zero at contact, every style and duration.
   Gate section 18, 346 checks.
1c. *** [PENDING Paolo / ART LANE] THE GETTING-SHOT ANIMATION CATEGORY. He said:
   "this would also be a great time to start the headshot fall animation and
   whatever category of animation we put towards people like getting shot." NOT
   STARTED - it is a COOK and it needs a declared category list plus his eye, not
   a guess. Governed by LEAF-PIXEL LAW (structure frozen, leaf only), RIG LAW
   (painted regions sacrosanct) and the 45 DEGREE LAW. The demo already rolls a
   _deathVar (3 variants) and has fall/land timing hooks (fallLanded, landDust),
   so the PLUMBING exists and what is missing is the named set of reactions:
   headshot drop, gut fold, spin, knocked-back, stumble-and-catch. HE NAMES THE
   SET. | leaf_pixel_gate + combat_anim_gate | combat demo | yes (thumbs).
1d. DONE 7/26 (v82): THE FREEZE HE COULD NOT FEEL - TWO DEFECTS, BOTH FIXED.
   (a) The killshot contact fired the WEAPON tier (0.125s) instead of KILL
   (0.500s); freeze('kill') only ever fired from finishHim and from your own
   death. (b) The freeze stopped the SIM but not the PICTURE - 27% of the screen
   was still changing because _bpmClock rides the AUDIO clock and drives the bob,
   floor pulse and kick pulse. The visual beat clock is now pinned; the audio is
   not. Measured clean: 43.67% of the screen changes while a killshot runs, 0.06%
   while frozen. GATE LESSON RECORDED: section 17 checked the TABLE and never the
   PATH. It now tests the path. 339 checks.
1e. DONE 7/26 (v81): THE QUANTIZED FREEZE - pick-list item 2, on his word
   ("Lets freeze the game for that snappy satisfying feelings then"). Law:
   laws/BOHEMIA_ADDENDUM_THE_QUANTIZED_FREEZE_7_26_26.md. Every freeze is a NOTE
   VALUE derived from BEAT (1/16 graze, 1/8 hit, 1/4 KILL = one whole beat, 1/2
   last man). A killshot is a REST IN THE MUSIC. Directional shake decays INSIDE
   the freeze. ONE arming function, named tiers only.
   *** AND IT UNCOVERED A REAL BUG: the old hit-stop counted FRAMES, so every
   impact in the game was running at HALF WEIGHT on a 120Hz phone, which is what
   Paolo has been judging feel on. ***
   Gate section 17, 335 checks, and the invariant REJECTS the old frame counts.
   STILL OPEN FROM THE JUICE PASS (item 2 of the pick-list is only PARTLY done -
   the freeze and the shake landed, these did not): PERMANENCE (casings, impact
   scars and blood persisting for the encounter - Vlambeer rates it top-tier and
   it is nearly free), 1-2px RECOIL/KICKBACK snapping back on the next 16th,
   MUZZLE FLASH + a directional impact burst, a CAMERA THAT LEADS the shot, and a
   ONE-FRAME FLASH reserved for killshots only. All cheap, all quantized, no
   rules change. | gate: every juice duration is a note value | combat demo | no.
1g. *** THE MERGED COMBAT PICK-LIST (both research docs, ONE order). ALL
   [PENDING Paolo] - he picks, then I build. Docs:
   records/BOHEMIA_COMBAT_RESEARCH_TURN_BASED_GRID_7_26_26.md (part one) and
   records/BOHEMIA_COMBAT_RESEARCH_JUICE_VERTICALITY_COMPANIONS_7_26_26.md. ***
   1 THE PROVING GROUND - one GREYBOX arena as an INSTRUMENT not a level:
     two-storey block + stairs + open ledge, hard and soft cover, a long lane, a
     tight room, an open middle, dials for enemy archetype/count, and a toggle
     per juice effect so any one can be A/B'd alone. He asked for this by name
     ("an actual arena map where we test out different AI and the feel of it").
     HIGHEST LEVERAGE: it makes every other item judgeable instead of arguable.
     | gate: the arena exists, every element present, every toggle independent |
     combat demo | Paolo plays = the verdict.
   2 THE JUICE PASS, QUANTIZED - hitstop as a NOTE VALUE (1/16 graze, 1/8 hit,
     1/4 killshot, 1 bar last-man-down) so the freeze IS the 120 BPM clock and a
     killshot is a rest in the music; PERMANENCE (casings, scars, blood stay);
     1-2px recoil snapping back on the next 16th; directional shake decaying
     INSIDE the hitstop; muzzle flash + directional impact burst; camera lead;
     a one-frame flash on killshots ONLY. | gate: every juice duration is a note
     value, no exceptions | combat demo | no.
   3 ENEMY INTENT ON BY DEFAULT (part one item 1). FORESIGHT stops being the
     source of intent and buys something else. | gate: intent shown every turn |
   4 SHOVE AS A REAL ONE-TILE PUSH with collision damage (part one item 4).
     Becomes DEFENESTRATION the moment floors exist. | gate: push resolves
     against occupancy, collision damages both |
   5 AI ARCHETYPES WITH RHYTHMIC SIGNATURES - archetype-specific utility
     FUNCTIONS (not weight tweaks) + a musical tell per archetype (downbeat /
     offbeat / every other bar / reactive). | gate: each archetype's action
     lands on its declared note value |
   6 COMPANIONS ON STANCES - HOLD / PUSH / COVER ME / GET OUT, set once, one
     tap, NEVER per-turn (micromanagement is the named killer), ally acts ON THE
     BEAT. Foundation already RULED (item 0, ally spawn/target/down-never-dead).
     WHO they are and what they say is [PENDING Paolo], contents his.
   7 TWO AND THREE STOREY COMBAT - stairs as chokepoints (one-body-per-cell is
     already law, so a man on a stair is a cork), height beats cover and exposes
     you, ledges drawn honestly (XCOM 1's trap-slopes are the warning). The
     LAYERING law + INTERIOR-MATCHES-EXTERIOR already speak multi-storey; only
     combat does not. HIGH cost, biggest change.
   8 TURN CLOCK = THE SONG'S FORM (part one item 0) - 5 turns, turn N = section
     N, reaches the 0:48 payoff every fight without costing the NEW ENCOUNTER
     song change. Real rules change, HIS call.
1f. [LOGGED 7/26, HE SAID DO NOT CONTINUE] PULSE VOICES sound "elementary school
   hi-hat metronome shit". They borrow each song's kit by design (v75) - which
   worked for sounding like the record and failed for sounding like a fight. The
   answer is a DEDICATED COMBAT PERCUSSION BANK (casings on concrete, boot on
   gravel, door slam backbeat, distant generator). That is a COOK: needs a REUSE
   CHECK against banks/ and HIS ear before a voice is drawn. Do not start it
   until he says. | reusefirst_gate + song_lock | combat demo | yes (thumbs).
1i. DONE 7/26 (v80): SOFT THE WHOLE FIGHT + THE HEADROOM TRIM. Paolo retired his
   own v79 top rung ("forget about it going hard at five kills... a lot of volume
   fighting each other"). HARD_AT=Infinity; AUTO is SOFT forever; his 2/4 rungs
   carry the climb. The volume complaint was measured (16.2 -> 24.2 -> 41.8
   voices/bar, ~+4.1dB into one master with no trim in front of a -14dB limiter)
   and fixed the way a mix engineer would: the master trims 1.00/0.82/0.68 as the
   rungs land, ramped, reset per fight. Net +0.8dB instead of +4.1dB. Master gain
   ONLY - no note, voice or pattern touched. Gate section 16, 316 checks.
1h. *** RESEARCH ON THE SHELF, NOTHING BUILT, ALL [PENDING Paolo]: ***
   records/BOHEMIA_COMBAT_RESEARCH_TURN_BASED_GRID_7_26_26.md - six games (Into
   the Breach, Slay the Spire, XCOM 2, NecroDancer, Divinity OS2, game-feel
   literature), seven ranked ideas, sourced. Top three:
   (a) QUANTIZED HITSTOP: freeze for a NOTE VALUE (1/16 graze, 1/8 hit, 1/4 on a
       killshot) so the impact freeze IS the 120 BPM clock instead of breaking
       it. Cheap, no rules change, biggest feel-per-hour. | gate: every freeze
       length is a note value | combat demo | no.
   (b) ENEMY INTENT ON BY DEFAULT: ITB/StS are built on perfect information;
       Bohemia has it as a perk (FORESIGHT), off. Cheap, UI job. | gate: intent
       shown for every enemy every turn | combat demo | no.
   (c) THE TURN CLOCK = THE SONG'S FORM: ITB fights are 5 turns then the enemies
       retreat. A fixed turn count is a fixed number of BARS, so turn 1 = section
       A ... turn 5 = section D. Reaches the 0:48 payoff EVERY fight without
       persisting anything and without costing the NEW ENCOUNTER song change -
       the v76 problem solved from the other end. Real rules change, HIS call.
   ALSO: widen the timing windows (NecroDancer shipped ~100% leeway because the
   challenge belongs in the TACTICS, not the timing - a warning aimed at my
   55/110ms grades); make SHOVE a real one-tile PUSH with collision damage
   (ITB's best verb is displacement); ENVIRONMENT (elevation, destructible
   cover, Vegas surfaces) is still the thinnest part of the fight; and NEVER add
   a hidden hit roll on top of a good dial press (XCOM's unsolved problem that
   Bohemia already solved) - that one should become a law.
1k. DONE 7/26 (v79): THE PULSE JOINS THE LADDER. Paolo's design, locked and
   shipped same turn. Law: laws/BOHEMIA_ADDENDUM_THE_PULSE_JOINS_THE_LADDER_7_26_26.md.
   0 kills PULSE SOFT / 2 his rung 1 / 4 his rung 2 / 5 PULSE HARD. The pulse
   stops being a parallel system and becomes his ladder's floor and ceiling.
   Keys off _sk so downed men (V71) and the GROOVE chain (v74) both count: a full
   chain reaches HARD with nobody down. Button AUTO->SOFT->HARD->OFF, manual
   still wins. Gate section 16 executes the ladder at every rung (310 checks).
1j. *** [PENDING Paolo] THE OVERWORLD INTENSITY DRIVER. *** He asked how the 2/4
   progression could apply CALMLY outside combat. ANSWERED IN THE LAW ABOVE,
   NOT BUILT. Recommended driver: LIGHT = TERRITORY + CLUSTERED POWER (rung 1
   in lit owned blocks, rung 2 deep in a grid, calm in the dark) because it
   needs no new lore, is visible on screen, and carries the same cargo as two
   men down without violence. The CALMLY half is mechanism and mine: rungs enter
   on a SECTION BOUNDARY with a one-bar fade so it reads composed, not triggered.
   Supersedes/absorbs item 1n (the MUS.layers dead path). Blocked on his ruling.
   | gate: the driver is posted from the world, layers enter on a boundary |
   parent MUS + CITYMUS, a DIFFERENT sequencer from combat | no.
1l. DONE 7/26 (v78): NEW ENCOUNTER = NEW SONG. Paolo RULED OUT the v76 play-out
   swap ("that's so fucking retarded bro"). Deleted outright, no dead flag left.
   The v76 diagnosis was right and the lever was wrong: persisting the song fixed
   the FORM at the cost of the thing the button is for. RULE LEFT BEHIND: a fix
   that trades what the player feels NOW for what they would feel LATER is a BET,
   and it is his to place. Survives: the single pull point (the bag was drained
   twice an encounter), the pulse yield, the corrected measurement.
   COST ON THE RECORD: combat hears ~the first 40s of a song again; the 2:08 form
   and its 0:48 payoff stay unreachable in a fight. ANY future answer must NOT
   cost him the NEW ENCOUNTER song change. [PENDING Paolo] and not mine to retry.
1m. DONE 7/26 (v77): HIS SONGS ARE CANON + SONG LOCK GATE. Law:
   laws/BOHEMIA_ADDENDUM_HIS_SONGS_ARE_CANON_7_26_26.md. Paolo asked whether the
   music work had touched his actual songs. It had not (every body hashes
   identical from 70e2061), but a promise is not enforcement, so the worry became
   a gate the same turn. gates/song_lock_gate.js byte-locks OVERWORLD_SONGS,
   MLOOPS, MFACTIONS, SONG_ARR/ROOT, synthV, drumV, the 7/3 rungs and the klay
   styles against records/BOHEMIA_SONG_LOCK.json. Proven by tampering SLOW
   CREEP's kick and watching the build fail. NOT a ban on new music: the music
   lane runs --write and says why, which puts the change in the diff.
   FLEET NOTE: any lane that legitimately changes a song must now run
   `node gates/song_lock_gate.js --write` in the same commit.
1o. DONE 7/26 (v76): THE SONGS PLAY OUT + THE PULSE YIELDS. Law:
   laws/BOHEMIA_ADDENDUM_THE_SONGS_PLAY_OUT_7_26_26.md. v75 APPROVED BY EAR.
   (a) Corrected my own 4x error: the creepers run 2.17 kicks / 2.33 hats a bar,
   not 0.54/0.58; the gate now DERIVES the unit from stepDur. Placement is the
   sharper finding: nothing kicks on beat 2, one kick in the pool on beat 4.
   (b) His songs are 2:08 arrangements with the FULL section at 0:48, but every
   NEW ENCOUNTER reset them to bar 0, so he only ever heard the first 40s. Combat
   now waits for a full 1024-step pass before swapping, exactly as CITYMUS
   already did in the overworld. V71's bag fix stands; only the frequency changed.
   (c) The floor now YIELDS instead of doubling 11 kicks and 14 hats his songs
   already played.
   *** STILL FROZEN: every timing mechanic in 1v / 1t / v74's chain. ***
   *** [PENDING Paolo] should the 2/4 rungs unlock the MELODY at all, or only
   energy, or should kills FAST-FORWARD the form instead of unlocking it. His
   7/3 LOCKED law owns those rungs; nothing was moved. ***
1n. (discovered 7/26, NOT fixed, needs HIS ruling) THE OVERWORLD KILL LADDER IS
   A DEAD PATH. MUS.layers starts at 0 and the only assignment in the whole build
   is the studio's CALM/2 KILLS/4 KILLS preview buttons, so the four melody-klay
   creepers can never bloom in the city or the run. What drives intensity out
   there is lore. | gate records the single assignment | — | no.
1p. DONE 7/26 (v75): THE FIGHT PULSE. Law:
   laws/BOHEMIA_ADDENDUM_THE_FIGHT_PULSE_7_26_26.md. Paolo froze new timing
   mechanics until the music and the button work together, so the encounter
   music got COUNTED instead of clock-fixed a sixth time: his creepers average
   0.54 kicks / 0.58 hats a bar (four-on-the-floor is 4 / 8), all half-time. He
   was trying to lock to a pulse not in the recording. His songs untouched; a
   combat-only FLOOR under them in the song's own kit (kick on 4, eighth hats,
   backbeat on 2+4), thickening with the groove chain, plus the count is now the
   song's hat instead of a 415Hz UI beep. PULSE: HARD/SOFT/OFF for an honest A/B.
   *** EVERY TIMING MECHANIC IN 1v / 1t / v74's chain IS FROZEN until Paolo
   rules on this. A SECOND rejection ends the rhythm direction for the session. ***
1w. DONE 7/26 (v69): the four rhythm-game pillars - approach ring, graded press
   with a persistent ms strip, the shot plays a note in the song's key, and a
   SYNC tap-calibration. Law + what is still missing:
   laws/BOHEMIA_ADDENDUM_WHAT_MAKES_IT_A_RHYTHM_GAME_7_26_26.md.
1v. RHYTHM AS DIFFICULTY (next, from that addendum): the 52 dial patterns are
   curve shapes, not rhythms. A rhythm game gets harder by getting more
   syncopated, not faster. Author patterns as note values against the bar.
   | gate asserts each pattern's kill moments land on declared note values |
   the PHASE re-bake machinery exists, reuse it | new dial feel = he plays it.
1u. THE WHOLE FIGHT ON THE GRID: the return volley, deaths, steps and camera
   hits are not quantized, so only the dial is musical. | gate proves every
   fight event resolves on a beat | 120 BPM law | no.
1t. A COUNT-IN BAR when an engagement opens, so you enter already inside the
   pulse. | — | do not delay the pop itself | no.
1z. DONE 7/26 (v68, Paolo's 120-BPM-FIRST law): every dial cycle is a whole BAR
   (44% of pattern x difficulty combos could never land the perfect shot on a
   downbeat), the PHASE table re-solved against it, and the press is now a
   REQUEST granted on the beat. [PENDING Paolo] whether the POP should be
   beat-gated too (it would neutralise the ON THE ONE streak reward).
1y. (discovered 7/26) THE DIAL ENGINE HAS NO MASTER. The stamped block says
   "edit engine/bohemia_engine.master.js then re-stamp"; that file and the
   stamper do not exist anywhere in the repo. Either restore a master + stamper
   or delete the misleading header. NON-COOK. | a sync/byte-lock gate for the
   engine block | — | no.
1a. DONE 7/26 (v67, straight from Paolo playing it): dial locked to the AUDIO
   clock + whole-bar cover cycles; suppression turn-based and legible; sprint
   costs stamina and the refill no longer refunds it; sprint/dash mutually
   exclusive with the armed move named on the ring. [PENDING Paolo] the cycle
   rebalance it forced: package 2 slowed 6->8 beats, package 3 quickened 6->4.
0. ALLY-IN-COMBAT foundation (RULED 7/26, companions addendum): the encounter
   system supports friendly combatants on the player's side — spawn, target
   correctly, go down but never permanently die. Mechanism only; WHO joins
   and companion personalities are Paolo's/quest canon. | proven headless: an
   ally fights alongside through the real bus, downed ally never deleted |
   CITY_B64 | no.
1. DONE 7/26 (v66): encounter handoff hardening for the RUN. Contract:
   laws/BOHEMIA_ADDENDUM_RUN_HANDOFF_CONTRACT_7_26_26.md. Quest context in,
   dead/spared/fled out, declared LEAK LIST, cold handoff with the tab never
   opened, READY queue, abort, loud errors, no splash. 5 back-to-back
   EXECUTED headless in combat_lab_gate sections 5-6, plus a real-surface
   Playwright proof. The cold handoff went 12.9s -> 14ms (blocking font).
2. Combat grammar graduation: stack candidates in ONE judge surface. | judge
   reachable from alpha, side-by-side anchors | — | yes (thumbs then build
   the winner).
3. (discovered 7/26, RUN lane's call) The alpha SHELL carries the same
   render-blocking cross-origin font link the combat demo did. Combat fixed
   its own blob only (lane discipline). Same one-line fix, whole-game boot
   payoff: `media="print" onload="this.media='all'"`. NON-COOK.
4. (discovered 7/26) The demo's melee/nerve loop re-rolls `pickRandomFaction`
   twice on a quest handoff (startGame + the shuffle hook). Harmless, same
   distribution, but it is duplicate work on the enter path. NON-COOK tidy.

## PEOPLE  (DEDICATED LANE 7/29, from Paolo's big-missing dispatch — "IM SURE
## SOME CHATS YOU CAN ASSIGN THIS WORK TOO". First word "people" (or "npcs"/
## "factions"). Owns the human half: dialogue, NPC identity, faction
## standing, companion social layer. Intent: doctrine §6. Source of truth:
## records/BOHEMIA_THE_BIG_MISSING_7_29_26.md items 4-6.)
P-W. [SHIPPED 8/7 - records/BOHEMIA_WHO_YOU_STIRRED_UP_8_7_26.md]
   *** THE THIRD QUEST EFFECT, AUTHORED SINCE 7/25, PARSED CORRECTLY, READ BY NOTHING. ***
   bohemia_quest_runtime.js line 117 has parsed `@DO faction_posture CARTEL +1` into
   rt.state.posture since 7/25. The world bridge carried the OTHER TWO quest effects to
   the real FactionWorld -- standing and @DO advance_territory -- and walked past this
   one. SEVENTEEN authored rulings going nowhere. Same disease as the clout tags (P-V),
   one layer up: this one is how factions move on EACH OTHER, not on you.
   POSTURE IS NOT STANDING AND THE CORPUS PROVES IT, I did not decide it: authored
   stages write BOTH on the SAME faction in one breath (S17.33 CARAVANS, S13.33 REDS),
   which would be a duplicate line if posture meant "toward the player". It is how
   MOBILISED a faction becomes. Every authored value is +1 or +2 -- nobody has ever
   written a faction calmer -- so the mechanism has no way to invent one.
   IT MOVES THE KNOB THAT ALREADY EXISTS: Faction.quota is already "districts it WANTS
   to hold" and already the appetite term scoreClaim() reads. Nine lines inside an
   existing bridge function. No new field, no new module, no second appetite system,
   and the territory AI is not rewritten.
   GROUNDED in the escalation literature (spiral model: groups harden in response to
   perceived hostility; reciprocal-escalation evidence; Glasl's stages) -- which is why
   it fires on a quest event and not on a timer.
   PACING LAW HELD (Paolo 7/24, factions are not at war 24/7): appetite is not a turn.
   A posture line moves NOT ONE DISTRICT on its own; only @DO advance_territory shakes
   the map. Gate measures it by asserting the owner map is byte-identical after.
   WHAT IT DOES: same seed, same map, same AI, same 12 rounds -- 18 of 32 districts come
   out under a different flag. Network 1 -> 6 (his corpus stirs it up most: +1+1+1+2),
   Reds 1 -> 5, and every faction with no posture ruling stays at 1.
   HE CAN LOOK AT IT: LIFE tab -> WHO YOU STIRRED UP. Honest that it is a RECORDING of a
   real run (engine too heavy to inline -- the 8/6 payload wall), not a mock-up.
   Gate: faction_posture_gate.js, 8 claims, 7 planted mistakes. Its FIRST version drove
   an export that does not exist, and the claim FAILED rather than passing vacuously,
   because it measures the world ("the quota moved") not the code ("it was called").
   *** [PENDING PAOLO, ONE WORD] IS THE 7/31 FACTION FREEZE LIFTED? ***
   laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_7_31_26.md says "FACTIONS ARE OFF" and there is
   NO written lift in /laws. I built on his newer verbal direction (he opened this
   session with the word "factions", said "lets do some faction shit", and said
   "execute" three turns running) over a written law he has not formally retracted --
   TRUTH HIERARCHY newest-wins, and Paolo 8/1 a gate must never outrank a ruling. Named
   rather than dodged. If he says no, it is nine lines to revert. If yes, the addendum
   gets written and build_the_world_gate.py should be told.

P-W. [SHIPPED 8/11 - NEW LAW, FLEET-WIDE, HE ORDERED IT: "MAKE THIS A RULE" -
   laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md]
   *** ALWAYS MAKE AN ATTEMPT. WE WERE PROTECTING HIM FROM THE WRONG THING AND IT
   COST HIM THE QUESTS. ***
   Paolo 8/11: "FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH BRO I
   WILL EDIT IT LIVE THATS WHY I HAVENT DONE QUESTS YET JUST MAKE AN ATTEMPT."
   CONTENTS-PAOLO'S was read fleet-wide as "ship no words at all" and every lane
   obeyed faithfully - LINES empty, NAMED_CAST empty, cold open silent, and THIS LANE
   WROTE A GATE ON 8/9 THAT WENT RED IF ANYBODY PUT A WORD IN HIS FAMILY'S MOUTH.
   AN EMPTY FIELD IS NOT A RESPECTFUL BLANK CANVAS, IT IS A BLANK PAGE, and he edits
   rather than writes from nothing.
   THE LINE, DRAWN EXACTLY (this is what makes it safe): WORDS get an attempt always,
   written as if it ships - dialogue, quest text, objectives, descriptions, names, UI
   copy. DECISIONS are UNCHANGED and still his - who dies, who holds what ground,
   numbers, dials, map layouts. TEST: is it WORDS or a DECISION?
   Every attempt tagged draft:true so he can find and edit each one; absent/false =
   HIS words, untouchable. FILLER FAILS - a lazy draft is the blank page again.
   APPLIED SAME TURN: the cold open speaks, 4 lines, all draft:true. CLAUDE.md
   amended (a contradiction between two live files is a bug). Canon index regenerated.
   AND I INVERTED MY OWN 8/9 GATE RATHER THAN DELETING IT - a gate written two days
   ago does not outlive the ruling that replaced it (A GATE MUST NEVER OUTRANK A
   RULING, 8/1). SCENE 35 -> 40 claims.
   FOURTH MENTION-VS-USE BUG THIS SESSION, in my own new gate: the "no casualty
   decided here" check grepped the beat for /dies|death/ and went red on the `why`
   fields, which QUOTE his addendum - it flagged the CITATION of a ruling as a
   violation of it. Checks the DATA now, never the prose.
   | gates/attempt_gate.js 14 claims, 4 mutations killed, registered | 8/11 | YES -
   four lines of speech to read and edit.
   *** FOR EVERY LANE: if your system ships empty text, FILL IT and tag draft:true. ***

P-V. [SHIPPED 8/9 - DEMO-CRITICAL, HE ASKED BY NAME. Closes backlog 0sc's runtime half]
   *** THE SCRIPTED-SCENE RUNTIME SHIPS AND THE ACT 1 COLD OPEN PLAYS END TO END. ***
   engine/bohemia_scene.js + records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json.
   0sc's acceptance verbatim was "one scene plays end to end on the real surface,
   gated | scene content = his". The runtime and the scene are done and gated; the
   SURFACE half (inlining into BOHEMIA_CITY_WORLD.html) is the next step.
   FIRST CONSUMER = THE MATCH-CUT, chosen deliberately: his 7/19 ruling says the cut
   "shows the entire apocalypse WITHOUT A WORD", so the runtime's first job needs zero
   dialogue this lane would have to invent. 15 beats, 13.5s at 120 BPM, deterministic.
   THE WORDS ARE HIS AND THE GATE ENFORCES IT: every say beat is silent on purpose and
   the gate goes RED if text appears (mutation-tested by putting a line in the father's
   mouth). A scene with no citation is refused; every beat carries a `why` quoting the
   addendum.
   DIALOGUE VIA THE EXISTING BQ RUNTIME (REUSE-FIRST, no second dialogue system).
   *** THE BUG THAT WOULD HAVE HIDDEN FOREVER: *** opening a conversation is THREE calls
   (start -> available -> begin); v1 made one, so the beat played SILENT - which looks
   exactly like an unwritten line and would have hidden behind the empty-lines-are-legal
   rule indefinitely. Gate now opens a real .bq (S02) and asserts words, choices, a
   silence, and that choosing advances.
   AND THE GATE CRASHED ON ITS OWN MUTATION before failing cleanly - a crash asserts
   nothing, the DEVIATION lesson from 8/4. Guarded.
   | gates/scene_gate.js 32 claims, 4 mutations killed, registered | 8/9 | no - runtime.
   Scene CONTENT is his: the cold open's lines are empty and waiting.

P-U. [SHIPPED 8/7 - SWEPT THE PATTERN INSTEAD OF THE INSTANCES, FOUND NINE MORE -
   records/BOHEMIA_THE_VALLEY_HOLDS_FOUR_TIMES_THE_PEOPLE_WE_THOUGHT_8_6_26.md]
   Four separate hunts today found "a check that agrees with itself" ONE AT A TIME,
   which is the exact habit I criticised this morning before building the census. So
   I grepped the repo for the SHAPE - a scan loop with a typed map size.
   *** people_gate had TEN loops bounded at 48, not one. *** G6 was just the one that
   happened to be checkable. The others fed K1 "EVERY body has a seat to be keyed by",
   K2 "the biggest household in the valley", E7 "it never MOVES anybody", and four
   "somewhere in the valley" claims.
   THE DISTINCTION THAT MATTERS: an EXISTENTIAL claim survives under-scanning (finding
   a thing in a quarter still proves it exists). A UNIVERSAL one does NOT - "EVERY
   body" tested on 25% of the world means a violation in the other 75% passes silently.
   Widened to world.n: 678 residential cells instead of 162, 1,224 bodies instead of
   268, ALL 152 CLAIMS STILL PASS. The code was right, the tests were short-sighted.
   AND THE NUMBER 268, quoted across this repo as "our 268 derived people", WAS ITSELF
   AN ARTEFACT OF THAT BOUND.
   | gates/mapbound_gate.js, 8 claims, mutation-tested, registered. A RATCHET NOT A
   PURGE: 26 typed bounds survive in NINE other files, correct today only because 96
   happens to be the map size and mostly other lanes' - declared with a date, may only
   SHRINK, any NEW one fails at once. Strips comments before counting because its own
   header quotes `y < 48` four times. | 8/7 | no - gate work.
   FOR EVERY LANE: if your gate scans the valley, bound it with world.n.

P-T. [SHIPPED 8/6 - A NUMBER THE WHOLE GAME RESTS ON WAS 4.25x WRONG -
   records/BOHEMIA_THE_VALLEY_HOLDS_FOUR_TIMES_THE_PEOPLE_WE_THOUGHT_8_6_26.md]
   tools/bohemia_scale_model.js promises in its own header that the valley population
   "can never drift away from the world it describes", then measured the map with
   `for (y = 0; y < 48; ...)` and `side = 48 * 96` HARDCODED. The valley became 96x96
   and THE TOOL KEPT MEASURING A QUARTER OF IT - silently, because a small loop over a
   big world under-counts instead of erroring.
       homes    12,259 -> 55,391      area  21.2 km2 -> 84.9 km2
       scale    1:78.2 -> 1:17.3      PEOPLE  1,112 -> ~5,027 derived / 4,723 MEASURED
   IT IS A FIX NOT A SECOND MISTAKE, by the model's OWN sanity check: its two
   independent measures (homes, area) agreed within 16% before and agree within 5%
   now. An exact census of all 2,809 residential cells returns 4,723 vs 5,027 derived
   - 6% apart, where before they were 4.25x apart.
   *** OCCUPIED_RATE = 0.038 WAS RIGHT THE WHOLE TIME *** (3.91% measured vs 4.1%
   derived). NOTHING ABOUT THE WORLD CHANGED, only what we believed about it - no
   district emptier or fuller, no save invalid, no ruling overturned. Needs no decision
   from Paolo.
   SPREAD TO TEN FILES: two engine modules, a gate, this lane's fixture, two research
   records, handoff, backlog. A NUMBER IN A COMMENT IS DOCUMENTATION UNTIL SOMEBODY
   BUILDS AN ECONOMY ON IT - and the economy (BIG MISSING item 3) is unbuilt and would
   have been sized against it. Live code corrected; dated records left as history.
   | gates/scale_truth_gate.js 8 claims, 3 mutations killed, registered. LOAD-BEARING
   CLAIM IS NOT A TEXT CHECK: the sampled estimate and an EXACT census of every
   residential cell must agree - two ways of counting one thing, and a map-size bug
   cannot survive both. It would have fired the moment the valley outgrew 48x48.
   | 8/6 | no - a correction. A TOOL THAT PROMISES IT CANNOT DRIFT IS A CLAIM, AND A
   CLAIM WITHOUT A MACHINE BEHIND IT IS A WISH.

P-S. [SHIPPED 8/6 - THE BIG MISSING ITEM 1, ATTEMPTED INSTEAD OF GUESSED -
   records/BOHEMIA_HOW_FAR_THE_GAME_GETS_IN_ONE_DAY_8_6_26.md]
   *** SOMEBODY FINALLY TRIED TO PLAY A DAY. YOU CAN WAKE UP AND YOU CAN WALK.
   THAT IS THE GAME TODAY. ***
   Item 1 is the biggest thing on the 11-month list and its blocker list was GUESSED
   on 7/29 - nobody had ever attempted the day. Measured on the surface RUN opens:
     1 WAKE OK | 2 QUEST BLOCKED (first stop; only button on screen is TALK) |
     3 TRAVEL OK | 4 TALK PARTIAL | 4b FIGHT BLOCKED | 5 PAID BLOCKED |
     6 SPEND BLOCKED | 7 SLEEP/SAVE PARTIAL (save works, SLEEP NEVER ENDS THE DAY)
   The guess named quests + economy (both confirmed) and MISSED that combat has no
   entry point here and that sleep never advances the day.
   SAME FINDING AS P-Q's CENSUS FROM THE OTHER END: BLOCKED means UNREACHABLE HERE,
   NOT UNBUILT. resolve.js, the quest runtime and the combat bridge are all finished
   and shipping into BOHEMIA_RUN_CURRENT.html - the file nobody sees. THE ORGANS ARE
   BUILT, THEY ARE IN THE OTHER FILE.
   THE INSTRUMENT LIED THREE TIMES FIRST and that is the useful half: v1 scanned
   window for words and said "it circulates" (/quest/ matched XMLHttpRequest, /dial/
   matched SVGRadialGradientElement). I wrote a mention-vs-use bug INTO A PROBE ABOUT
   THAT DISEASE an hour after gating it. v2/v3 subtracted control sets and were still
   wrong. v4 asked for SPECIFIC symbols. THREE ROUNDS OF TUNING A WORD SEARCH COULD
   NOT FIX A WORD SEARCH.
   MEASURED ORDERED BLOCKERS for whoever takes item 1: (1) a quest you can pick up
   (2) sleep that ends the day (3) a currency to be paid in (4) a way into combat.
   | gates/game_day_gate.js 12 claims, mutation-tested, registered. A RATCHET not a
   demand - closing the links is the RUN lane's and blocked on his rulings; waking and
   walking are the whole game today and must not break quietly. | 8/6 | no.

P-V. [SHIPPED 8/6 - records/BOHEMIA_HOW_LOUD_YOU_WERE_8_6_26.md]
   *** HIS QUEST CORPUS ALREADY SAID HOW LOUD EVERY DEED WAS, AND ONLY THE VANITY
   FOLLOWER COUNT WAS LISTENING. ***
   Every canon .bq outcome writes TWO numbers: how big (`@DO faction REDS +12`, 59 of
   them) and how loud (`#quiet`/`#notable`/`#risky`/`#reckless`, 69 of them). The loud
   half fed defaultFollowerScore() and NOTHING ELSE. Faction standing was applied
   godlike - valley-wide, instantly, nobody having seen anything - so a back-yard
   handshake and a public humiliation in front of a whole block moved a faction the
   SAME AMOUNT, in a game whose own 7/21 law is titled RECKLESS BEATS QUIET.
   BUILT: engine/bohemia_deeds.js. The tag now decides HOW FAR the news carries and HOW
   MANY TIMES it gets retold, on reach = SEE_RANGE * sqrt(cloutWeight/CLOUT_NEUTRAL),
   read off his LIVE table in bohemia_loop.js (a crowd occupies an AREA, so radius goes
   with the square root of how many people care). Linear would have put one loud act in
   front of 66 tiles and news teleports again - the exact failure the witness organ
   exists to kill. AN UNTAGGED DEED STILL REACHES EXACTLY SEE_RANGE AND EARNS EXACTLY
   MAX_HOPS, so nothing already in the world changed.
   THE LAW THAT WAS WRITTEN DOWN AND NEVER PRODUCED: bohemia_standing.js has said since
   day one that "a quiet good deed dies with the witness, a notorious one becomes the
   thing your child is judged for" - because inherit() only carries a deed somebody
   RETOLD. Nothing made the difference; every deed had the same hop budget. Now,
   measured over 30 years in a 385-person valley: 6 / 36 / 64 / 110 still telling it.
   Monotonic across all four of his tiers, 18x spread.
   NOTHING INVENTED: DEED_WEIGHT still SHIPS EMPTY (gate measures it before the bridge
   loads), every row traces to a @DO line by re-grepping the raw text, no faction is
   named in the bridge's code, and the units conversion is DERIVED - the biggest act in
   the corpus in front of a whole faction moves exactly ONE RUNG (18/2 = 9, measured
   off his files, self-renormalising if he ever writes a bigger deed).
   HE CAN LOOK AT IT: LIFE tab -> HOW LOUD YOU WERE. Auto-runs, nothing to tap.
   Gate: deed_bridge_gate.js, 27 claims, 15 planted mistakes caught every run.
   STILL OPEN AND DELIBERATELY NOT MINE: bohemia_loop.js STILL applies @DO faction
   straight to FactionWorld, the omniscient scalar. Swapping it to publish() is a small
   change in the QUESTS/RUN lane's file - ONE SYSTEM ONE SESSION says it is not mine to
   cut. The witnessed organ is proved, gated and watchable; the swap is theirs to make.
P-R. [SHIPPED 8/6 - THE BIG MISSING ITEM 7, FILED 7/29, OWNED BY NOBODY -
   records/BOHEMIA_A_SAVE_THAT_SURVIVES_A_WEEK_OFF_8_6_26.md]
   *** THE PHONE COULD DELETE THE SAVE AFTER SEVEN DAYS AND NOTHING WAS ASKING IT
   NOT TO. *** iOS WebKit deletes localStorage, IndexedDB AND SERVICE WORKER
   REGISTRATIONS after 7 days with no interaction with the origin. The counter
   resets every visit, so IT ONLY BITES THE PLAYER WHO STOPS PLAYING - the one you
   want back. Researched 8/6 because the 7/29 note was a year-old summary.
   MEASURED FIRST: 3 keys / 10,859 bytes (bohemia.save.v1 = 9,351), persisted()
   FALSE, persist() present and NEVER CALLED, zero `navigator.storage` anywhere in
   the repo, 60 localStorage sites, 0 IndexedDB.
   SECOND INJURY NOBODY HAD CONNECTED: sw.js - the worker the ONE-LINK LAW depends
   on - is on the SAME eviction list. A week away loses the save AND the fresh link.
   FIX: one request at boot (navigator.storage.persist), because eviction SKIPS
   origins granted persistence. Supported since Safari 17 / iOS 17.
   BOUNDARY, and it is what makes this legitimate from this lane: IT TOUCHES NO SAVE
   CODE. How a save is written/read/migrated/exported is the RUN lane's and none of
   it changes; the gate asserts no setItem in the block. Fire and forget - false
   changes nothing, an exception changes nothing, boot never waits, WORST CASE IS
   EXACTLY TODAY.
   GATE MEASURES ON THE REAL SURFACE, not a grep - a line that exists and never runs
   is the bug this repo found all week. It does NOT assert the grant: browsers decide
   and headless answers differently from a phone, so asserting it would make the gate
   a weather report. It asserts THAT WE ASKED. Also alarms if the save outgrows
   localStorage.
   | gates/durable_save_gate.js 13 claims, 3 mutations killed, registered | 8/6 | no.
   [PENDING PAOLO ~MONTH 8, NOT BLOCKED] what the game SHIPS AS: tab (7-day counter,
   now mitigated) / home-screen app (own counter, materially safer) / App Store
   wrapper (native storage, immune). Store review + monetisation work backwards from it.

P-Q. [SHIPPED 8/6 - FLEET-CRITICAL, AND IT IS THE ROADMAP - records/BOHEMIA_WHAT_
   WE_BUILT_THAT_HE_CANNOT_REACH_8_6_26.md]
   *** SEVENTEEN FINISHED THINGS SHIP ONLY TO THE FILE NOBODY SEES. ***
   Six times in three days the fleet found the same thing one instance at a time.
   That is ONE DISEASE, not six bugs: work lands somewhere he cannot reach and the
   machine says green. Nothing could answer the general question so nobody asked it.
   BUILT: tools/bohemia_reachability_census.py - 205 sources, 272 MB, sampled by their
   own BYTES never their names (names are a lane's dialect; a name-based search on 8/4
   gave four false alarms out of five).
       banks  (95):  15 reach him |  8 loaded-only | 72 no trace
       engine(110):  72 reach him |  9 loaded-only | 14 no trace | 15 not-for-players
   THE PAID-FOR LIST: PERIMETER_8_2 (the 11 walls HE judged and approved), INTERIOR_POOL,
   bohemia_resolve.js (THE SENTENCE - one button, act, spend time, resolve), the quest
   runtime + parser, bohemia_loop.js, garage, crypt, and GRIME/OPENINGS/CIVIC_OPENINGS
   from the last four days. All shipping into BOHEMIA_RUN_CURRENT.html, which the alpha
   loads and NEVER DISPLAYS.
   HONESTY, STATED IN THE REPORT ITSELF: NO TRACE is evidence not proof - transformed art
   (re-encoded/recoloured/re-tiled) reads NO TRACE while genuinely shipping, and the 4
   HD_TILE_REPO parts are 180 MB of probably-that. 20 of 72 are CANDIDATE pools where
   only an approved subset should ship. A DERIVED bank reads NO TRACE correctly. And the
   MB figure is nearly a tautology (258 MB corpus, 29 MB surface) - THE COUNTS ARE THE
   FINDING.
   CALIBRATED FIRST: v1's 8-sample BINARY gave SHOWN and NO TRACE on the same bank off
   the same bytes. Now 32 samples and it REPORTS THE FRACTION. Checked against 4
   hand-verified cases from 8/4; the gate keeps them as permanent calibration claims.
   THE GATE DOES NOT DEMAND THE NUMBER FALL - wiring order is his and the owning lane's,
   and forcing it would be A GATE OUTRANKING A RULING. It demands it stay TRUE.
   | gates/reachability_gate.js 16 claims, 4 mutations killed, registered | 8/6 | no -
   measurement. But the 17-item list is the closest thing this repo has to an 11-month
   priority order, and it is somebody's to pick from.

P-P. [SHIPPED 8/4 - FLEET-CRITICAL, AND IT STARTS WITH A CORRECTION TO MY OWN
   CLAIM AN HOUR EARLIER - records/BOHEMIA_A_CHECK_POINTED_AT_THE_WRONG_DOOR_8_4_26.md]
   *** A CHECK POINTED AT THE WRONG DOOR. THREE TIMES IN ONE DAY, THE THIRD IN MY
   OWN SHIPPED WORK. ***
   THE CORRECTION FIRST. I shipped the head-on deadlock fix and told Paolo neighbours
   in the RUN tab would "walk around each other instead of getting stuck standing in
   place." MEASURED AFTERWARDS ON THE REAL ALPHA, THAT OVERSTATED IT:
       slices/BOHEMIA_CITY_WORLD.html   function makeSim( : 1 definition, 0 CALL SITES
   The walked surface draws people through the OFFLINE PLANE (ask the schedule where
   somebody is this minute, draw them there) which is the documented two-plane design
   and is correct. It does not step the sim. The fix is real and correct and live in
   BOHEMIA_RUN_CURRENT.html, which DOES step it - and which the RUN tab never shows.
   I should have measured before telling him what he would see.
   *** THE FLEET-SCALE VERSION OF THE SAME BUG ***
   records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md is the scoreboard - "THE RUN IS
   THE GAME: 25/31 systems integrated" - and every probe in integration_gate.js reads
   BOHEMIA_RUN_CURRENT.html. Since 7/28 the alpha routes RUN to the city panel:
       var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;
   MEASURED: tap RUN and the only visible panel is p-city at 390x790 running
   BOHEMIA_CITY_WORLD.html; runFrame exists with src=BOHEMIA_RUN_CURRENT.html and is
   never shown. THE ROWS ARE NOT WRONG - they are true about the file they name. What
   is wrong is that THE GREENS ARE NOT EVIDENCE ABOUT THE SURFACE HE PLAYS and no
   reader can tell which ones are.
   I CHECKED BEFORE CLAIMING, AND MY FIRST PASS WAS WRONG: I searched the city for the
   RUN SLICE'S function names and "found" five missing systems. FOUR WERE FALSE ALARMS
   - doors, save/load, the resolver and combat are all there under their own spellings.
   The CITY lane ported the great majority. What survived checking: CLOUT/FEED/FOLLOWERS
   (marked INTEGRATED, no trace in the city under any spelling tried) and the agent sim.
   BUILT: gates/surface_truth_gate.js, 16 claims, FIVE MUTATIONS KILLED. It does NOT
   demand the two surfaces match - which file the run lives in is a real design call
   and it is the RUN LANE'S, and a gate forcing it would be A GATE OUTRANKING A RULING.
   It demands HONESTY: the ledger declares which file it probes and which the RUN tab
   shows, both must be true, and a mismatch must be stated ABOVE the table where a
   reader cannot reach the greens first. THE SHOWN SURFACE IS DERIVED FROM THE ALPHA'S
   OWN ROUTING LINE, never typed, so it follows whoever re-points the tab.
   AND IT CAUGHT ME WRITING A BAD CHECKER AGAIN: my first version grepped for the
   phrase "rows are lies" to police tone and matched it inside my own sentence saying
   the rows are NOT lies. A checker that cannot tell a mention from a use is the broken
   one (Paolo 8/1). It now requires the warning to QUOTE the alpha's routing line
   verbatim - checkable by a reader, and rots loudly instead of quietly.
   | FOR THE RUN LANE, WHOSE CALL IT IS: either re-point the ledger at the city frame
   and re-probe every row, or make the run slice the shown surface again. Both are real.
   Not mechanical, not mine, not urgent - but DECIDED rather than drifted into.
   | 8/4 | no - a gate and a correction, nothing to judge.

P-O. [SHIPPED 8/4, AND IT CLOSES P-F BELOW - records/BOHEMIA_NOBODY_STANDS_IN_
   THE_STREET_ALL_DAY_8_4_26.md]
   *** FIVE OF THIS LANE'S GATES WERE DEAD, AND FIXING HOW THEY LOOK AT THE WORLD
   FOUND TWO REAL BUGS IN THE WORLD. ***
   P-F had this half-diagnosed and half-wrong. It said "the gate claim is wrong,
   not the code". MEASURED, the claims were FINE and the FIXTURE stopped being
   valid: all five built ONE block at seed 7 and asserted people were in it, which
   was a safe bet on 7/19 when OCCUPIED_RATE was 0.30 (all 40 seeds populated) and
   is a coin flip at the correct 0.038 (27 populated, 13 EMPTY; a 20-home block
   averages 0.76 occupied houses). Nobody wrote bad code; the world got 7.9x
   emptier underneath them, by arithmetic off Paolo's own scale-model question.
   DEVIATION was not even on P-F's list of four and it was CRASHING, which is
   worse than red - `Cannot set properties of undefined` at agents[0]. A crash
   asserts nothing at all.
   NOT A LICENCE TO EDIT GATES UNTIL THEY GO GREEN. Every claim was held to: DOES
   IT ASSERT MORE? The new ones pin BOTH ends (mostly empty AND somewhere alive)
   and cannot flip on scan order; mutation-tested in both directions (rate 0 makes
   the fixture throw, rate 1 breaks the mostly-empty claim). AND THE TRAP ONE LEVEL
   DOWN, which is why there is a shared fixture at all: "pick the first seed that
   HAS people" is the same bug better disguised - seed 3 answers the missing-persons
   question, seeds 9/21/25/39 do not, and seed 39's six residents never meet all
   day, which is the DEAD WORLD WORKING. gates/bohemia_block_fixture.js surveys 40
   blocks and THROWS rather than hand back an empty a caller sims in silence.
   ALSO FOUND: the four copied door-pickers had already drifted - deviation_gate's
   was fixed 7/31 to try SIDEWALK first and the other three never got it. They did
   not go red over it because they were simming nobody.
   *** THE BUG THE BLIND GATE WAS HIDING, AND IT IS IN THE GAME HE PLAYS ***
   POPULATION went 0 spot checks -> 1,905 and failed on the first run.
       H5-3  @111,18 wants 111,17 - held by H14-1
       H14-1 @111,17 wants 111,18 - held by H5-3
   Two people who wanted to SWAP CELLS, each one's next step being the other's
   body. 1,589 and 1,533 turns standing still - over a game DAY each - on walks
   home of 173 and 165 steps. Both had free neighbours the whole time. The blocked
   branch said `a._path=null; // wait, replan next turn` AND THE COMMENT IS WHAT
   HID IT: path() is a deterministic BFS over the STATIC grid, so replanning hands
   back the same route into the same body forever.
   FIX: replan with the other BODIES AS WALLS. 173 steps -> 173 turns. Carried into
   all four inlining slices by tools/bohemia_walk_deadlock_patch.py (which reads the
   replacement OUT OF THE ENGINE so it cannot drift), including BOHEMIA_CITY_WORLD
   .html - the walked world the RUN tab opens.
   I WROTE IT WRONG THE FIRST TIME and the new gate caught it the same hour: shift()
   mutates the same array, so around[1] after it is the cell TWO ahead - a two-cell
   teleport, and a crash on a one-step detour.
   *** AND FIVE HAIRSTYLES NOBODY COULD WEAR *** DRESS red at 231 banked vs 236
   canon. The bank was not stale, THE PARSER WAS: the 8/1 hair batch writes
   `layer:'hair',lux:true,gen:` and the extractor allowed tags only BEFORE the
   layer. SUN CROP / DUSK SHAG / TEMPLE TAPER / ASH SWEEP / SALT CROWN dropped in
   silence. Hair 10 -> 15. A COUNT IS A SMOKE ALARM, NOT A DIAGNOSIS - it names
   them now.
   | LIFE 21/3->24/0, DRESS 42/2->46/0, POPULATION 5/3->10/0, MEMORY 7/2->10/0,
   DEVIATION CRASH->12/0, new WALK DEADLOCK 23/0 registered | 8/4 | no - gate and
   engine work, nothing to judge. He may FEEL it: neighbours no longer freeze
   solid when he stands in a doorway.

P-M. [SUPERSEDED 8/4 BY THE WORLD LANE, WHO SHIPPED THE SAME FIX FIRST - and one
   piece of it SURVIVED because their sweep could not see it]
   Both sessions built a resolver for "where is the city" in the same hours. gates/
   bohemia_city_app.js (WORLD lane) landed on main first, so THEIRS IS THE ONE; my
   gates/bohemia_city_src.js is deleted and my one surviving check moved onto theirs.
   A second resolver for the same fact is exactly what both exist to stop. The
   incumbent wins; whose name is on it does not matter. Nothing to re-litigate.
   *** WHAT SURVIVED, AND WHY IT IS THE INTERESTING PART ***
   touch_guard_gate looped the three embedded frames and did
       if (src.indexOf(key) < 0) continue;
   The city key stopped existing, so THE BIGGEST FRAME IN THE GAME QUIETLY STOPPED
   BEING CHECKED - no failure, no claim, a GREEN gate. Verified directly: origin/main
   at 1ceb61c still carried that `continue` after their twenty-one-gate sweep, because
   A SWEEP DRIVEN BY WHAT IS RED CANNOT SEE A GATE THAT GOES QUIET INSTEAD OF RED.
   That gate exists because Paolo could not walk - holding the d-pad raised iOS's
   copy/paste magnifier. A GATE THAT SKIPS IS WORSE THAN ONE THAT FAILS. A missing
   payload is a FAILURE now, for all three frames.
   STANDING LESSON FOR EVERY LANE: when you sweep a class of bug, sweep the PATTERN,
   not the red list. The instances that went quiet are the ones still out there.
   Record: records/BOHEMIA_THE_GATES_COULD_NOT_SEE_THE_CITY_8_4_26.md | 8/4 | no.

P-N. [OPEN, NOT MINE, MECHANICAL - THE OTHER HALF OF P-M]
   SIXTY TOOLS IN tools/ ALSO REACH FOR CITY_B64 AND CRASH. The entire city patch
   toolchain cannot re-apply anything right now: every one of them dies with
   "substring not found" the moment it runs.
   31 share one exact shape; the rest vary. Rewriting another lane's whole
   toolchain blind - where a tool that HALF-works is worse than one that crashes
   loudly - is not a thing to do at speed on somebody else's system, so I did not.
   ONE IS MIGRATED AS THE WORKED EXAMPLE (tools/bohemia_city_zoombuild_patch.py,
   because a gate depended on it) and its header carries the recipe verbatim. It
   is the same three edits every time:
     1. read CITY (slices/BOHEMIA_CITY_WORLD.html) instead of hunting CITY_B64
     2. write CITY back at the end instead of re-encoding into ALPHA
     3. change nothing else - the patch body is untouched
   gates/bohemia_city_src.py is there if you want the fallback-to-old-trees
   behaviour too. An afternoon of mechanical work for whoever owns them.
   | 8/4 | no.

P-K. [SHIPPED 8/3 - records/BOHEMIA_THE_PEOPLE_ARE_NOT_HIM_8_3_26.md]
   THE PEOPLE ARE NOT COPIES OF HIM ANY MORE. Paolo, after seeing the first
   neighbour he could talk to: "I saw it very good... now we have character models
   just shuffle that character model every time the game looks and have it not be
   a copy of me."
   HE WAS DESCRIBING THE CODE EXACTLY: the city frame drew every resident as
   PLAYER_CV - his own baked body - through pplTinted(), a colour shift over his
   finished sprite. Same rig, same clothes, different hue. Six weeks of wardrobe
   and everyone in the valley was him.
   THE ANSWER WAS ALREADY IN THE GAME, ONE IFRAME AWAY. runSendCast() has baked
   SIX REAL TOWNSFOLK for the run since 7/26 (swap G.tints + G.equipped.hat,
   re-bake the rig through bake56). The city frame never received them.
   NOW: citySendCast() bakes the same six and posts BOHEMIA_CITY_CAST; the people
   pass draws cast[person.look % N] instead of tinting the player, and falls back
   to the old tinted body if the bake has not landed so nobody vanishes. Which
   body a person wears was ALREADY stable (personFields gives every person a
   `look` from their own hash), so a body keeps its clothes instead of flickering.
   REUSE CHECK: zero pixels cooked, no bank opened - every frame is baked by the
   alpha's own bake56 from art he already approved. Only WHICH approved body each
   existing person wears changed.
   GATE (city_cast_gate.js, 8 claims, drives the alpha and taps the tab): "there
   is a cast" would pass on six copies of him and "a message was sent" would pass
   on an empty message, so it HASHES THE REAL PIXELS of every baked body and of
   his and requires all distinct AND none his. Measured 6 bodies, 6 distinct, 0
   matching his.
   *** AND A VACUOUS CHECK I CAUGHT IN MY OWN GATE: *** PLAYER_CV and CAST_CV are
   `let` at script top level - global LEXICAL bindings, NOT properties of window.
   My first measurement read window.PLAYER_CV, got undefined, and "none of them is
   the player" passed by comparing everything against null. A CHECK THAT COULD NOT
   FAIL. B3 now asserts the player's body was measurable at all, so the important
   claim can never go vacuous the same way. If you probe an iframe's state, use
   BARE IDENTIFIERS.
   Mutations: cast never reaches the draw -> B6 red; the six baked without
   swapping clothes so they ARE him -> B4 red (1 of 6 distinct), B5 red (6 matches
   his pixels), B6 red.
   | gates: CITY CAST 8 new | 8/3 | YES - walk around and look at them.

P-L. [PARKED BY PAOLO 8/3 - DO NOT BUILD UNASKED] "Maybe we can do more with that
   but we have so much work." Deeper conversation (real dialogue, more than the
   card and the ask) is his to raise. It is not blocked and it is not forgotten;
   it is parked, and building it unasked is the STOP PRODUCING violation.

P-J. [SHIPPED 8/3 - records/BOHEMIA_CITY_TALK_8_3_26.md]
   YOU CAN TALK TO SOMEBODY ON THE SURFACE HE ACTUALLY PLAYS. This closes the ask
   he made on 8/2 ("one extra NPC chilling outside the spawn that I can just talk
   to and test out your mechanics") which my first attempt did not deliver,
   because I built it on a page the game never shows.
   TAP RUN NOW: you land on your feet in the suburb, somebody is standing TWO
   TILES away, one step and the button says TALK TO THE WATCH, the card opens
   with NAME: YOU HAVE NOT ASKED, tapping Ask their name makes her Marisela
   Escobar, the button becomes TALK TO MARISELA, her name is over her head, and
   it survives a reload.
   EVERY PIECE IS THE SHARED MODULE. engine/bohemia_people.js is inlined verbatim
   the same way bohemia_city_people_patch.py already inlines population and
   agents, so the name, the trade, the card and the three tiers are THAT module's
   answers and this frame decides nothing about who anybody is (ENGINE SYNC LAW).
   The neighbour is a real personFields record - same derivation as all 300 people
   in the valley - pinned to the SPAWN, not to the player. Everything learned
   placing the last one carried: out of the doorway (the button prefers a door you
   stand on over a person beside you) and on OPEN GROUND (a body that never moves
   permanently removes a cell, and on the run surface that queued three people
   behind a fixture).
   *** THE GATE LOOKS DIFFERENT FROM EVERY OTHER ONE THIS LANE OWNS, AND THAT IS
   THE CORRECTION: gates/city_talk_gate.js OPENS THE ALPHA AND TAPS THE TAB. ***
   Every other gate here opens BOHEMIA_RUN_CURRENT.html directly as a FILE. All
   152 are green about a page the game never shows. They were not lying about the
   code, they were answering a question about the wrong door. If you write a gate
   in this lane, drive the alpha.
   18 claims. Mutations: no neighbour -> 13 of 18 red; strangers named without
   asking -> 6 of 18 red. Two bugs caught in my own work by driving it for real:
   the neighbour was counted twice, and the card read "TRADE: MARISELA" because
   headingOf() correctly returns the name once asked (right for a heading, wrong
   for that row).
   Neighbours held: CITY PEOPLE 18, ONE WORLD TAB 120, ZOOM SEAM 7, HUMAN START 9.
   | gates: CITY TALK 18 new | 8/3 | YES - the conversation is the thing to try.

P-I. [SHIPPED 8/2 + *** THE FINDING THAT MATTERS MOST IN THIS LANE *** -
   records/BOHEMIA_HE_WAS_NEVER_ON_MY_SURFACE_8_2_26.md]
   "I couldn't find them can you make sure when I press the run tab it just starts
   me off where I should start off... I'd rather start off in human mode rather
   than city mode."
   (1) FIXED, and measured first: tapping RUN gave MODE='city', HUD CITY MODE,
   player at hx=0,hy=0 - the zoomed-out overview with the walked person never
   placed at all in a 12288x12288 world. Calling swapMode() at boot was not
   enough: it came up human and flipped straight back. Logging every message the
   frame gets - ["BOHEMIA_CITY_PLAYER","BOHEMIA_CITY_PLAYER","BOHEMIA_GOTO_CELL"]
   - showed GOTO_CELL's handler ending in an unconditional MODE='city'. That line
   was RIGHT when written (Paolo 7/28 "I want that reflected when I'm in the city
   menu", back when RUN and CITY were two tabs) and wrong now that THE RUN TAB IS
   THE CITY FRAME, because the alpha fires cityGoToRunCell() on city-tab open. His
   ruling was about the MARKER, never the mode. Now: HUMAN MODE, SUBURB, ON FOOT,
   city still one tap away. tools/bohemia_human_start.py, gate human_start_gate.js
   (9 claims; original boot fails 5, GOTO-flip fails 3).
   (2) *** WHY HE FOUND NOBODY, AND IT IS BIGGER THAN WHAT HE NOTICED. ***
   THE ALPHA ROUTES THE RUN TAB TO THE CITY PANEL:
       PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p
   #p-run (BOHEMIA_RUN_CURRENT.html) is display:none the whole time - the alpha's
   own source says so in a comment. And that file is where ALL of this lane lives:
   the identity card, the one contextual button, asking a name, the name over
   their head, and the neighbour placed outside his door. Counted in the city
   frame, the surface he actually taps: 16 references to the population module,
   ZERO "TALK TO", ZERO card, ZERO ask. People walk around on his surface and
   there is no way to speak to any of them.
   THIS IS MY OWN LAW CATCHING ME. VERIFY ON THE REAL SURFACE (7/18): every gate
   this lane owns opens BOHEMIA_RUN_CURRENT.html DIRECTLY AS A FILE. All 152 are
   green about a page the alpha never shows. They were not lying about the code,
   they were answering a question about the wrong door. The new gate drives the
   ALPHA and taps the TAB, and every future gate in this lane must.
   WHAT IT WOULD TAKE: porting the conversation surface (verb, sheet, card, ask,
   name over head, porch neighbour) onto the city frame. The population module is
   already shared so the PEOPLE are already the same people; what is missing is
   the talking. [PENDING PAOLO - it is the CITY lane's file and a day of work, and
   nobody should move it unasked.]
   | gates: HUMAN START 9 new | 8/2 | he has to decide (2).

P-H. [SHIPPED 8/2, HE ASKED FOR IT - records/BOHEMIA_SOMEBODY_TO_TALK_TO_8_2_26.md]
   "can you just have one extra NPC chilling outside the spawn in the suburb that
   I can just talk to and test out your mechanics?" Done - walk out the front door
   and he is TWO TILES away.
   WHY HE HAD TO ASK, measured: roam() sends every idle body to a random tile on a
   128x128 block, so the nearest person outdoors was routinely 99 TILES from the
   front door and often nobody was in sight at all. Everything this lane built was
   reachable only after a long walk and a lot of luck. With the fixture removed:
   99 tiles. With it: 2.
   HE IS A REAL RESIDENT, NOT A PROP: real seat in a real house, built by the
   agents module's own makeAgent, so he has a real trade (the button reads TALK TO
   THE KEEPER), a real card, a name you must ask for, and a name over his head
   once you have. ONE flag is special - porch:true, walk to one spot and stay.
   *** THREE OF PAOLO'S OWN LOCKED RULINGS SAID NO TO MY FIRST VERSION, and each
   one was caught by a gate: ***
   (1) FIVE FAMILIES. A free seat in the nearest EMPTY house made him a household
       of one, so the block held five families instead of the four he ruled on
       8/1, one of them a man living alone. FIXED: he joins an EXISTING household.
       Four families hold at 3/3/3/2.
   (2) HE SURVIVED THE DIAL AT ZERO, so the ghost valley was not a ghost valley
       and the bottom of his slider was a lie. FIXED: only added if the block
       already has residents. Dial 0 -> 0 bodies.
   (3) HE PLUGGED A WALKWAY, and this is the one worth keeping. A body that never
       moves PERMANENTLY REMOVES A CELL (occupancy law), so parking him on a
       driveway is not a decoration, it is a wall. At 15:00 three bodies sat
       stacked at (4,28)(4,29)(4,30) all wanting home, TWO OF THEM ORDINARY
       RESIDENTS QUEUED BEHIND HIM, and run_people_gate went red on "every body is
       indoors after the edit" - not because the edit missed them but because they
       could not walk. FIXED: he stands on OPEN GROUND (most walkable neighbours
       wins, under four open sides is a corridor not a place to loiter).
   AND A FOURTH THING THE SURFACE SAID NO TO: adjacent to your own door, the one
   contextual button prefers THE DOOR YOU ARE STANDING AT over the person next to
   you, so it read GO INSIDE and the conversation was unreachable. He stands 2-5
   tiles out: past the doorway, still right there.
   HE IS INSIDE MASS EDITS: joins the roster before the person-facts pass, so a
   rule reaches him. Verified - with the everyone-indoors rule, he goes indoors.
   GATE: C4c nearest body 2 tiles not across the block; C4d standing on open
   ground not plugging a walkway. Mutations: no NPC -> C4c red at 99 tiles; porch
   flag ignored so he roams -> C4c red at 99 tiles.
   | gates: PEOPLE 150 -> 152, RUN PEOPLE 45 recovered from 43/2 | 8/2 | YES - he
   is the thing to go and talk to.

P-F. [SHIPPED 8/2 - records/BOHEMIA_A_NAME_YOU_EARNED_IS_A_NAME_YOU_SEE_8_2_26.md]
   THE SECOND HALF OF THE 7/31 RULING, WHICH HAD NEVER BEEN BUILT. His words:
   "the game will track that SO ANYTIME YOU MIGHT SEE THEM IN THE FUTURE LIKE
   THEIR NAME WILL POP UP." The asking half shipped 7/31 and is gated end to end;
   the SEEING half was missing. A name only ever appeared on the identity card or
   on the one button, both of which need you close enough to touch them, so you
   could ask a neighbour their name, walk five steps, and they looked exactly like
   every stranger in the valley. Asking had no consequence you could see.
   NOW: the FIRST NAME of anyone you ASKED is painted over them while they are on
   screen. Strangers get nothing, forever, until you ask.
   NOT NAMEPLATE SOUP, by construction: only people you asked (nameOf returns null
   for a stranger BY LAW, so a stranger can never get one); the viewport is ~4
   tiles either side of you; capped at 4, nearest first; first name only; a name
   and NOTHING else (no role, no mood, no timetable - invisible_schedule_gate
   still 17/0); the run's own gold, no new colour.
   RESEARCH: Shadows of Doubt is the closest published shape (Unknown Citizen
   until an identifier resolves them). His version is stronger because the
   identifier is a conversation, not a government database.
   GATE reads PAINTED PIXELS on the real surface: C6a nobody named before you ask,
   C27a the name is on the world not just the card, C27b only the one you asked,
   C27c the gold really landed AS A BEFORE/AFTER DELTA - an absolute "there is
   gold on screen" would have passed on the front-door highlight, which already
   paints the same #e8b84a. True for the wrong reason.
   TWO BUGS CAUGHT IN MY OWN WORK: (1) the KNOWNNAMES row declared undo=anchor but
   the fence sits BEFORE its anchor, so restoring re-emitted it and the next run
   refused. (2) *** AND MY IDEMPOTENCE CHECK HAD BEEN FOOLED BY IT: *** I hashed
   the file across two runs, saw it identical, and called it idempotent - the
   second run had REFUSED TO WRITE. A CHECK THAT A TOOL DID NOTHING IS NOT A CHECK
   THAT IT IS IDEMPOTENT. Now: exit 0 twice AND unchanged AND one anchor.
   | gates: PEOPLE 146 -> 150 | 8/2 | YES - one thing to look at, the name over a
   neighbour's head on the RUN tab.

P-G. [FIXED 8/2 - SECOND TIME TODAY, SAME TAG, NOT THIS LANE'S BUG]
   THE FRONT DOOR BROKE AGAIN. gates/front_door_gate.js (built this morning after
   the first one) went red and named the cause in one line: 4 <div> open vs 3
   </div> close. A lane updating the build stamp ate the tag that closes the front
   splash for the SECOND time on 8/2, nesting the whole app inside the splash so
   tapping it hid the game. It reached main both times - one commit on main that
   day even says "main is broken by another lane" in its own subject.
   THE ALARM WORKED. But an alarm that rings twice in one day about the same tag
   is telling you to REMOVE THE FAILURE MODE, not to keep listening. *** THE
   CLOSING TAG NOW LIVES ON ITS OWN LINE, *** with a comment saying why, so the
   stamp line and the tag can never be touched by the same edit again.
   AND THE FIX BROKE MY OWN GATE, WHICH IS THE LESSON: the comment EXPLAINING the
   missing tag contained words that looked like tags, and the checker counted
   them. It went red on PROSE while the document was perfectly well formed - the
   exact mention-versus-use mistake Paolo named on 8/1, made by the gate whose
   whole job is reading structure. It strips comments before counting now, and its
   self-test no longer matches a hard-coded string so it survives the tag moving.
   FOR EVERY LANE: if you edit the build stamp, you cannot break the splash any
   more. If your gate counts syntax in a file, strip the comments first.
   | gate: FRONT DOOR 8, RUN 126 recovered from red | 8/2 | no.

P-E. [FIXED 8/2, MUTATION-TESTED - records/BOHEMIA_A_PERSON_IS_KEYED_TO_WHERE_THEY_LIVE_8_2_26.md]
   REPAIRING A DISTRICT TURNED EVERY NEIGHBOUR YOU HAD MET INTO SOMEBODY ELSE,
   AND LEFT THEIR NAME ON. Two locked rulings meet at one line and it broke both:
   7/31 "once you ask their name, if you see them again, then they would be
   named" and 8/1 "when you fully repair a district ... more people will want to
   move in and live in the recovered ruins."
   THE BUG: bohemia_agents builds a roster by walking the houses and SKIPPING the
   abandoned ones, so a person's position in that array is not a fact about them,
   it is a fact about how many neighbours are home. bohemia_population derived
   character from that position. Measured on cell (3,5): 2 residents before the
   repair, 4 after, and ZERO of 2 originals survived - H12-1 and H12-2 swapped
   personalities with each other outright.
   WHY IT WAS THE WORST VERSION OF THE BUG: the NAME was safe the whole time
   (bohemia_people keys it to the seat), so the surface effect is not a neighbour
   vanishing, which you would notice. It is the name you earned still printed on
   the card with a different person behind it.
   FIX: A PERSON IS KEYED TO WHERE THEY LIVE, NEVER TO THEIR PLACE IN A LIST. The
   seat (house + place in the household) is already in every agent id and
   bohemia_people already parses it; population stopped ignoring it. v.homeIndex
   is DELETED - it was the same bug in miniature, added 8/1 so a commuter's
   identity would travel with them, except what travelled was a roster position.
   ONE-TIME RESHUFFLE, deliberate: nothing about any individual is approved
   (KNOWN_AT_START and LINES ship empty), and the alternative is a world that
   reshuffles every time the dial moves.
   GATE: part K, 6 claims. 268 people across 93 blocks all have a seat, 0 fell
   back to a list position; the encoding cannot collide; the originals survive a
   repair; newcomers are new people not renumbered old ones; and it holds going
   down as well as up. Three mutations caught.
   *** AND A GATE THAT WAS DECIDING BY LUCK, worth more than the fix: *** C5
   ("you can walk up to a scheduled body") went red. The nearest person on the
   street is routinely A HUNDRED TILES AWAY, and the old walker locked onto one of
   three candidates and gave up the instant they stepped indoors. Measured on both
   sides of the change: the SAME three people were outdoors at the SAME distances.
   Nothing moved, nobody vanished - only when one of them went in for the morning,
   and that flipped the gate. It now re-targets every step the way a player does.
   The mutation runs were REPEATED afterwards to prove the new walker had not just
   made the gate easier; it still goes red on all three. Dead single-target walker
   deleted rather than left for somebody to reach for.
   LESSON FOR ANY LANE: if your gate chases a moving target across a hundred
   tiles, it is a coin flip wearing a claim's name.
   | gates: PEOPLE 139 -> 146, RUN PEOPLE 45 held | 8/2 | no - defect fix.

P-D. [FIXED 8/2 - NOT THIS LANE'S BUG, FOUND BY CHECKING WHETHER THE RED WAS MINE]
   *** THE ONE LINK WAS DEAD ON MAIN AND NOBODY KNEW. EVERY LANE READ THIS. ***
   THE RUN gate went red in the full suite. It fails identically on a clean worktree
   at origin/main with none of my changes, and passes on the commit before, so it
   arrived with 5a42b42. ONE </div> WAS DROPPED - the one closing the front splash -
   so <div id="app"> parsed as a CHILD of <div id="front">. The handler does what it
   always did (front.display='none'; app.display='flex') but a child of a display:none
   parent is not rendered whatever its own display says. Measured at 390x844: #app
   parent = front, box 0x0, zero client rects, zero tabs. PAOLO TAPS THE LINK, TAPS
   THE SCREEN, AND GETS A BLACK RECTANGLE. Every lane was shipping into a build that
   could not be opened.
   FIXED: </div> restored, #app parent BODY, 390x844, run_gate back to 126/0.
   GATED: gates/front_door_gate.js (suite FRONT DOOR, 8 claims). The ONE-LINK LAW is
   one of the oldest locked laws in this repo and NOTHING GATED THE DOOR ITSELF.
   run_gate did catch it, but as a 30s Playwright timeout reading "element is not
   visible" - a symptom three screens deep in a 126-claim browser test that says
   nothing about a missing tag. The new gate names the cause in one line ("4 <div>
   open vs 3 </div> close between them") in a millisecond, then walks the real door
   in a real browser: #app not inside #front, a real box after the tap, tabs on
   screen, nothing thrown. Self-tests with the exact 8/2 edit; the mutation fails 5
   of its 8 claims.
   THE PROCESS LESSON, WHICH IS THE POINT: when the suite goes red, CHECK WHETHER IT
   IS YOURS. Two minutes with a worktree at origin/main answered it, and the answer
   was that the game had been unopenable for hours while every gate anybody looked at
   was green.
   | 8/2 | no - defect fix.

P-C. [FIXED 8/2, MUTATION-TESTED - records/BOHEMIA_WORKERS_INSIDE_THE_MASS_EDIT_8_2_26.md]
   THE WORKERS THIS LANE SHIPPED ON 8/1 WERE OUTSIDE PAOLO'S OWN MASS-EDIT LAW,
   AND THE FIX FOR IT SHIPPED A WORSE BUG FOR ONE COMMIT. Three things, in the
   order they were found:
   (1) a body added to the sim AFTER the person-facts pass has no entry in
       RUN_PEOPLE, and a body with no entry is a body no rule can reach. Paolo
       7/29: editing the people means ADDING A RULE. Measured on the real
       surface: 0 records for 22 bodies standing in the clinic.
   (2) peopleForAgents derived every record from the cell the body is STANDING
       on, so a commuter was a different human being at work than at home.
   (3) *** THE INTERESTING ONE. *** Moving the concat up meant the patch tool
       stopped emitting its PEOPLE:JOIN fence - but A FENCE THE TOOL STOPS
       EMITTING IS NOT A FENCE THAT GOES AWAY. The text stays applied in the
       file and the tool no longer knows how to undo it, so both copies ran:
       44 bodies for 22 identities at every workplace, everyone standing next
       to a copy of himself, and on a non-residential cell the leftover clamp
       threw away the very bodies that had just been given records. EVERY GATE
       WAS GREEN THE WHOLE TIME IT WAS LIVE.
   THE LESSON FOR ANY LANE WITH A MARKER-FENCED PATCH TOOL: a block is only
   really deleted when the tool still knows how to UNDO it. Deleting the row
   from BLOCKS orphans the applied text forever. The JOIN row is kept as a
   strip-only entry whose anchor and insert are the same line.
   AND THE OTHER GENERAL FINDING: the surface check only ever looked at the cell
   the game OPENS on. That cell is residential and has no commuters, so it was
   structurally incapable of seeing any of this. If your gate checks one place,
   it is checking one place.
   Two gate claims were also WRONG rather than the code: F5 asserted the old
   arrangement (which was the bug), and F4 flagged the WORDS "RUN PERSON FACTS"
   so a comment naming another lane's block turned it red - a checker that
   cannot tell a mention from a use is the broken one (Paolo 8/1). Fixed the
   ruler, not the target.
   *** BUG (3) IS NOW GATED FLEET-WIDE, FOR EVERY LANE, NOT PATCHED FOR MINE. ***
   gates/fence_orphan_gate.py (suite: FENCE ORPHAN, 9 claims). Sweeps every marker
   block in slices/ and engine/: no orphan (a tool that writes a fence necessarily
   contains its marker text, so a marker no tool mentions is a block nothing can
   remove), every fence a balanced pair, no block applied twice. 24 fences, 0
   orphans today. It SELF-TESTS with three synthetic probes so it proves the
   checker works rather than that the repo is clean today. IF YOUR LANE HAS A
   PATCH TOOL, THIS GATE IS NOW WATCHING IT.
   | gates: PEOPLE 130 -> 139 (part J + D11a/D11b on the real surface at the
   workplace), RUN PEOPLE 45 held, FENCE ORPHAN 9 new. Seven mutations caught,
   listed in the record.
   | 8/2 | no - it is a defect fix, nothing new to judge.

P-A. [PAOLO RULED IT 7/31, FILED BY THE CITY LANE, NOT TOUCHED BY THEM]
   TWO RULINGS LANDED ON THIS LANE'S SYSTEM ONE HOUR AFTER IT SHIPPED. Full law:
   laws/BOHEMIA_ADDENDUM_NOBODY_HAS_A_NAME_UNTIL_YOU_ASK_7_31_26.md
   NOBODY DID ANYTHING WRONG: the identity card shipped 18:38 on 7/31 and the
   ruling arrived after it. This is a heads-up, not a defect report, and the CITY
   lane deliberately changed nothing in engine/bohemia_people.js.

   (1) A ROUTINE IS INVISIBLE. > "it will all be invisible information."
       CONFLICT, ONE ROW: cardFor() pushes { label: 'THEIR DAY', value:
       dayLineOf(agent) } -> "OUT 07:15 · HOME 21:30". That is a printed
       timetable and the ruling bans it. Yours to remove or to argue.
       THE RIGHT NOW ROW IS FINE AND SHOULD STAY. The line is TENSE: present
       tense is eyesight and is legal, future/habitual is a timetable and is not.
       gates/invisible_schedule_gate.js holds this going forward and names THEIR
       DAY as a DATED WAIVER - the suite stays green today, a SECOND violation
       fails it, and the gate also fails if somebody fixes the row and leaves the
       waiver behind.

   (2) [BOTH HALVES SHIPPED - asking 7/31, SEEING 8/2 (P-F above), and the whole
       thing reached the surface he actually plays on 8/3 (P-J, the city TALK
       button). Left here in full because the RULING is the thing that outlives
       the task.]
       A NAME IS ASKED FOR, NEVER GIVEN, AND THIS IS NEW WORK THAT IS YOURS.
       > "you will not know anyone's name and you'll have to ask everyone so
       >  everyone will pretty much have generic faction or non-faction you know
       >  identities and then you can personally ask them for their name and then
       >  the game will track that so anytime you might see them in the future
       >  like their name will pop up"
       Everyone starts as a generic FACTION or NON-FACTION identity. Asking is a
       thing the player DOES, one person at a time, in conversation. Once asked,
       it is known forever and shows on sight.
       YOU ARE ALREADY MOST OF THE WAY THERE: nameOf() returns null for everyone
       and NAMED_CAST ships empty, so nothing displays a name today - the ruling
       turns "no names exist yet" into "names are EARNED". The `met` ledger is
       already the right shape for it (keyed per person, survives a save load,
       derived not stored). It probably wants a second tracked fact beside `met`:
       ASKED.
       TWO EXCEPTIONS, both his: the opening dialogue, and a story/quest reason.
       CONTENTS STILL HIS: the machine holds the asking, the tracking and the
       popping-up. The actual names stay in NAMED_CAST and stay empty until he
       writes them.
   | filed by CITY 7/31 | law + gate landed same turn | PEOPLE lane's to build.

P-F. [CLOSED 8/4 BY P-O ABOVE. It was RIGHT that this needed its own turn, right
   that the fixture landed on an empty plot, and WRONG about the diagnosis: the
   claims were not wrong, the FIXTURE stopped being valid when OCCUPIED_RATE went
   0.30 -> 0.038 on 8/1. It also missed DEVIATION, which was crashing outright.
   Both measured in records/BOHEMIA_NOBODY_STANDS_IN_THE_STREET_ALL_DAY_8_4_26.md.
   Kept in full because the REASONING - never edit a gate to go green - is the
   part worth keeping.]
   (discovered 8/2 by the factions session, NOT FIXED, and deliberately not fixed
   at the end of somebody else's turn) *** FOUR OF THIS LANE'S GATES ARE RED ON MAIN
   AND HAVE BEEN FOR THE WHOLE VISIBLE HISTORY: LIFE, DRESS, POPULATION, MEMORY. ***
   PROVED NOT MINE: a clean worktree at origin/main with none of my changes fails
   BYTE-IDENTICALLY (LIFE 21/3 "0 agents simmed", DRESS 42/1 "0 distinct tops",
   POPULATION 5/3, MEMORY 7/2 "0 sightings"), and it fails the same at every commit
   the shallow clone can reach - 45+ back. Not a regression from today.
   *** THE CAUSE, MEASURED, AND IT IS THE GATE CLAIM THAT IS WRONG, NOT THE CODE. ***
   agentsForPlot on world seed 12345 returns, for the first six qualifying plots:
   0, 6, 3, 1, 1, 0 residents. That is not a bug, THAT IS THE DEAD WORLD WORKING.
   Our own population research says ~150 of 177 residential neighbourhoods hold
   ZERO people and calls it "the dead world you have been asking for". life_gate
   asserts `agents.length > 0` for the FIRST plot its scan happens to land on, which
   is 14,10, which rolls empty. The claim contradicts canon this lane shipped, and
   which plot it lands on is a scan artefact - IT IS THE SAME COIN-FLIP-WEARING-A-
   CLAIM'S-NAME SHAPE AS THE C5 WALKER ON 8/2. DRESS ("0 distinct tops on the
   block") and MEMORY ("0 sightings") are downstream of the same empty block.
   WHY IT IS NOT FIXED IN THIS COMMIT, said plainly: fixing it means editing four
   gates' CLAIMS. That is only legitimate because the claims disagree with shipped
   canon, and a change of that shape must be its own turn where the reasoning IS the
   deliverable - not a drive-by at the end of a turn about factions. Editing gates
   to go green is the pre-named forbidden shortcut and it does not stop being one
   because I think I am right.
   WHAT THE FIX LOOKS LIKE: the claims should test the DISTRIBUTION, not one plot -
   "across N qualifying plots the valley is mostly empty AND somewhere is inhabited",
   which is both what canon says and a claim that cannot flip on a scan order. Same
   shape for DRESS and MEMORY: seed the block from a plot that is populated, or
   assert over the set.
   | next PEOPLE turn should take this | 8/2 | no - gate work, nothing to judge.

0H. [SHIPPED 8/2 - HE CAN SEE IT NOW, AND IT FOUND TWO REAL BUGS]
   records/BOHEMIA_WORD_TRAVELS_8_2_26.md - LIFE tab, top card, nothing to judge.
   THREE TURNS OF PLUMBING AND HE HAD SEEN NOTHING - my miss, and the WORLD lane's
   7/31 lesson word for word. A page he taps and watches, running the REAL modules
   inlined verbatim: who saw it, the story moving person to person, standings sliding,
   then a generation passing and what his kid inherits.
   THE DEED VOCABULARY WAS ALREADY HIS: 61 `@DO faction NAME +N` effects in the quest
   corpus. REUSE-FIRST THIRD TIME TODAY (colours, marks, now deeds). GREP FIRST.
   *** TWO REAL BUGS THE DEMO FOUND AND EVERY UNIT TEST MISSED: ***
   (1) a deed was forgotten in TWO DAYS - opinions decayed on the 12h SIGHTING
       half-life. Deeds now carry their own clock (3 weeks, scaled by size).
   (2) gossip COULD NEVER FIRE - one constant doing two jobs made news untellable
       after 18 hours, and a day-step is 1440 minutes, so rule 3 was silently dead.
   Both passed every test: the decay tests asserted "it went down" and it HAD; the
   gossip tests all gossiped within minutes. IT TOOK LOOKING AT IT. VERIFY ON THE REAL
   SURFACE applies to SIMULATION, not just art.
   | gate: STANDING 29 -> 35 claims, 11/11 probes | 8/2 | no - nothing to judge, just
   something to look at, which is the point.

0G. [SHIPPED 8/2 - OUTSIDE THE BOX: YOUR FATHER'S DEBTS]
   records/BOHEMIA_YOUR_FATHERS_DEBTS_8_2_26.md
   THE QUESTION THE GAME'S OWN PREMISE RAISES AND NOBODY HAD ASKED. Bohemia is a
   family across THREE GENERATIONS and the handoff happens when the STORY says so,
   never on death (DEATH IS A RELOAD 7/26). So there is a canon moment when the valley
   stops judging you and starts judging your child - and what happens to your
   reputation then was on no gap list, in no GDD section, in no backlog. It was
   invisible because it only appears once a reputation system exists, which was hours
   old.
   THE ORGAN ALREADY MODELLED IT: thirty years pass, EVERY WITNESS IS DEAD, so the only
   trace of a life is what got REPEATED. A QUIET GOOD DEED DIES WITH THE WITNESS; A
   NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR. Not a new system - what
   the witness organ was always going to do if you ran the clock forward, which is why
   gossip had to exist first.
   MEASURED: a secret nobody repeated -> 0 carried, child inherits nothing. A notorious
   one that spread -> child owes -0.767 they never ran up; grandchild -0.345. Three
   generations and only the loudest thing your grandfather did still registers, which
   is the arc the story master already describes.
   GROUNDED: stateless-society anthropology - a family is a CORPORATE ENTITY whose
   reputation carries its economic standing, lineages 10-12 generations deep, ostracism
   doing the work fines do elsewhere. You are born owing what your father owed.
   LIFE LESSON, never said out loud: you inherit goodwill you did not earn and debts you
   did not run up, and neither is fair.
   COST: one function, one constant. DEED_WEIGHT still EMPTY; the gate proves inheriting
   invents nothing. WHEN the handoff happens is HIS.
   | gate: STANDING 23 -> 29 claims, 10/10 probes | 8/2 | no - mechanism.
   NEXT AND NOT BLOCKED: inventory every action the run can already produce, so his deed
   vocabulary is a thumb over a real list instead of a blank page.

0F. [SHIPPED 8/2 - GAP 3 BUILT, AND IT TOOK GAPS 4, 7 AND 10 WITH IT]
   records/BOHEMIA_REPUTATION_TRAVELS_8_2_26.md + engine/bohemia_standing.js
   Gap 3 was the documented failure of the whole genre: every NPC instantly knowing
   what you did with no route the news could take. WE ALREADY HAD THE HARD HALF -
   bohemia_memory is a real witness organ with decay; it just had no concept of a
   DEED, an OPINION, or one person TELLING ANOTHER.
   1 witnessed not announced (2 of 3; the far one learned nothing) · 2 opinion DERIVED
   never stored · 3 hearsay weaker and hop-limited (watched 3.96 vs heard 2.18; a
   rumour down a line of TWELVE reached THREE) · 4 a faction's view is its members'.
   THREE GAPS FELL OUT FREE: gap 4 - opinions decay, one bad deed 4.00 -> 1.00 -> 0.06
   -> 0.00 over a week, and one night is NOT forgiveness (gated both ways). gap 7 -
   ALPHA who watched goes HOSTILE, BETA who was elsewhere stays NEUTRAL, with nobody
   authoring who hates whom. gap 10 - becauseOf() returns the real remembered deeds,
   who holds them, and whether they watched or only heard.
   DEED_WEIGHT SHIPS EMPTY (his ruling, unmade) and the gate proves the module is
   INERT with it empty. NOT the standing ledger BUILD THE WORLD turned off: nothing
   stored, no faction named in the module, gate reads the source to prove it.
   *** AND A LESSON ABOUT GATES: *** this gate's first self-test was DECORATIVE and
   said so - six probes that re-ran the working module and asked if it misbehaved,
   reporting 0/6 caught. Rewritten to feed each CLAIM'S predicate the values a broken
   implementation would produce. 8/8. TEST THE CHECKER, NOT THE THING.
   | gate: STANDING 23 claims, registered | 8/2 | no - mechanism, tables empty.
   NEXT: nothing calls witness() yet (needs a deed vocabulary, his); then gap 5
   (wearing another faction's colours) which is now cheap; then gaps 6/8/9.

0E. [SHIPPED 8/2 - FLEET-WIDE, NOT THIS LANE'S: THE PAYLOAD WALL]
   records/BOHEMIA_THE_PAYLOAD_WALL_8_2_26.md. Paolo asked what we do not know we do
   not know. The alpha was 38.7 MB gaining ~1.4-2.1 MB/day and GITHUB REJECTS ANY FILE
   OVER 100 MB - about 43 DAYS until no lane could push the game at all, on a limit
   nobody was watching. 96% of it was two inlined base64 blobs (CITY_B64 35.76 MB,
   COMBAT_B64 1.35 MB) against 0.90 MB of actual code; base64 costs 33% so ~9 MB was
   encoding alone. RUN/SLICE/LIFE/MAP already load their page from a sibling file.
   FIXED: CITY_B64 -> slices/BOHEMIA_CITY_WORLD.html via fr.src. Alpha 38.7 -> 2.92 MB,
   first load over HTTP 12,561ms -> 398ms (29x), frame state identical, zero errors.
   TWO TRAPS EVERY LANE SHOULD KNOW: (1) file:// gives every document an opaque origin,
   so the split looked BROKEN locally and is identical over HTTP - serve it before you
   believe an iframe/origin/storage result; (2) that 37-million-char line does not end
   at the closing quote, the tab handler is on it - edit the LITERAL, never the line.
   | gate: PAYLOAD WALL, registered, fails at a 45 MB budget and projects the date off
   real git history | FRONT DOOR 8/0, ALPHA LOADS 20/0, ONE WORLD TAB 120/0
   | 8/2 | no - it is a defect fix, but he WILL feel it: the game opens instantly now.
   NEXT: COMBAT_B64 (1.35 MB, same one-line fix, proven) then the four HD tile banks
   at 42.7-43.5 MB each.

0D. [SHIPPED 8/2 - GAP 2 IS BUILT: THE PEOPLE BELONG TO SOMEBODY]
   Paolo 8/2: "We need to make lots of progress." All 12 gaps were thumbed WANT and I
   had asked once more whether the 7/31 freeze was lifted. He has driven faction work
   three turns running - THE ASKING WAS THE PROBLEM. Built.
   1. factionOf(agent, cell, bases) in engine/bohemia_agents.js. 30% affiliated,
      measured at 29.9% over 4,000 agents; most people belong to nobody, which is what
      "every faction is a startup at a third of maturity" actually means.
      NOTHING INVENTED: FACTION_ASSIGN is STILL EMPTY - which faction holds which
      ground is his unmade ruling. factionOf reads the bases the CALLER supplies and
      the loop already seats them on real worldMap coordinates. No bases = every agent
      unaffiliated exactly as before, and that is a gate claim, not a promise.
   2. All 13 colours + all 14 marks into engine/bohemia_dress.js from HIS MFACTIONS
      table; the gate re-reads that table out of the alpha and fails on a one-hex
      drift. FACTION_VETERAN_KIT still empty - his.
   *** THREE BUGS FOUND BY COUNTING, ALL INVISIBLE OTHERWISE: *** one hash doing both
   the join roll and the faction pick (63% to one faction of three); then the shared
   hash() ending on a multiply so its low bits barely move (48/40/12) - fixed with a
   local murmur3 finalizer, hash() ITSELF UNTOUCHED because every seeded thing in the
   world derives from it; then the one that mattered - AGENT IDS REPEAT ON EVERY BLOCK,
   so hashing the id alone made every H3-1 in the valley the same faction. Keyed to
   agent.seed. Same class as 8/2's keyed-to-a-list-position bug, twice in one day, so
   the gate now asserts no id is welded to one faction valley-wide.
   AND A GATE CLAIM THAT WAS DEFENDING A GAP THAT WAS NEVER A GAP: dress_gate asserted
   "exactly his SIX ruled factions". True on 7/21 when this file was the only place
   anybody looked; the other seven were in the alpha all along. Now checks every entry
   is HIS - six from the clothing sitting, seven from his table - which is stronger.
   | gate: FACTION MEMBERSHIP, 50 claims, 5/5 probes, registered | 8/2 | no - plumbing.
   NEXT VISIBLE STEP: nobody WEARS their colour on the surface he plays. bohemia_dress
   is loaded by the LIFE slice, not the alpha's RUN. Wiring it in touches the RUN lane's
   surface - coordinate, do not collide.

0C. [FIXED 8/2 - HIS COLOURS ARE IN, MINE ARE OUT] "BRO WE ALREADY CHOSE COLORS FIND
   IT IN THE PROJECT." He was right. All 14 factions have carried an ACCENT COLOUR AND
   A MOTIF in the alpha's MFACTIONS table since the faction songs shipped. I proposed a
   parallel set without opening the file - REUSE-FIRST violation, and the second time in
   one day I invented instead of looking.
   THE DOSSIERS NOW READ THAT TABLE OUT OF THE ALPHA at generate time; nobody retypes a
   colour, and the gate fails a dossier that invents one.
   *** THE MOTIFS ANSWER GAP 1 BEFORE IT WAS ASKED *** - stripe/grid/shard/confetti/
   aisle/circuit/plate/dust/cross/stencil/hazard/check/cracked/plain. The marks EXIST.
   Whoever takes gap 1 draws them, never invents them.
   THREE FINDINGS IN HIS OWN TABLE, reported not touched: (1) the Anarchists' magenta and
   the Colorful's pink BOTH READ PURPLE on the reservation test, live for weeks, and the
   purity sweep never caught them because IT ONLY LOOKS AT ART PIXELS, NEVER AT COLOURS
   WRITTEN IN CODE - a real hole whatever he decides; (2) Caravans/Trades/Homeless/Church
   share one hue band, Trades and Homeless 4 degrees apart, which is fine in a music
   gradient and not fine on a body; (3) he has TWO colours for six factions (7/21 clothing
   vs the faction table) which agree on family every time, Caravans byte-identical.
   A GATE MUST NEVER OUTRANK A RULING, needed twice today: his colours go red on my own
   checks, so his are REPORTED and only mine can FAIL.
   | gate: 760 claims, 9/9 probes | 8/2 | no - correction.
   STILL OPEN: veteran KITS were written against my wrong colours; want a re-pass.

0B. [VERDICT IN 8/2 - ALL 12 GAPS "WANT", 0 NO. records/BOHEMIA_FACTION_GAPS_VERDICT_
   8_2_26.txt] AND ONE MORE COLOUR RULING IN THE SAME BREATH: "the mini group factions
   dont need colors bro". The Karens' pale rose is GONE. That makes the colour rule
   TWO-SIDED and better than it was: A COLOUR IS THE BADGE OF BEING A MAP FACTION -
   a row in the canon graph means a colour, no row means no colour - so anybody without
   one is telling you what they are before they open their mouth. 12 map factions carry
   a colour; the Karens, the Amalgamation and the social forces carry none, on purpose.
   Gate checks BOTH directions and self-tests both mistakes.
   *** ALL 12 GAPS ARE WANTED AND NOT ONE OF THEM CAN BE BUILT YET. *** Every one is
   faction machinery, and laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_7_31_26.md turned that
   OFF ("no standing ledger, no territory model, no faction beats") with
   gates/build_the_world_gate.py holding the ratchet. That law says in its own words:
   "The ruling is lifted only by Paolo, and lifting it means editing the gate." A thumbs
   up on a research card is NOT that, and reading it as that is precisely the
   find-a-legal-way-to-ship-anyway move STOP PRODUCING (7/26) is named after.
   SO THIS IS A ONE-WORD BLOCK, and it is the only thing standing between this lane and
   twelve wanted systems. [PENDING PAOLO: is the faction freeze lifted?]
   IF HE SAYS YES, the order is 2 -> 3 -> 5, because all three ride machines this lane
   already shipped: 268 derived people (members), the witness/memory system (reputation
   that travels), and the dress system (colours that mean something when you wear the
   wrong ones). Nothing else in the twelve gives that much per unit of work.
   | 8/2 | no - the cards are judged, the build is blocked on one word.

0A. [SHIPPED 8/2, ALL 12 THUMBED "WANT" - see 0B.
   records/BOHEMIA_FACTION_GAPS_RESEARCH_8_2_26.md, LIFE tab top card]
   HE OVERTURNED MY COLOUR CALL AND HE WAS RIGHT: "we chose colors for factions so i
   dont fuck with u trying to say they wont have color like. wtf bro."
   THE RESEARCH AGREES WITH HIM, EXPLICITLY: readability practice is to LAYER THREE
   SIGNALS - hue, value, shape - and pair every colour-coded faction with a second
   signal. Never colour INSTEAD of shape. My "no colour for six factions" was a false
   choice, and worse, it was solving a broken MEASUREMENT by deleting content.
   *** THE MEASUREMENT WAS THE BROKEN PART. *** The old check was one number: RGB
   euclidean, fail under 95. That ruler called olive drab and oxblood a collision at 39
   - a dark green and a dark red. FIX THE RULER, NEVER THE TARGET (his own 8/1 law).
   The gate now measures hue, value and the neutral axis, and ALL 13 FACTIONS CARRY A
   COLOUR: Remnants olive, Network teal, Blues cobalt, Trades hi-vis, Karens pale rose
   (Reds' hue family, opposite value - reads as the alliance he just ruled), and the
   NEUTRAL AXIS split by value for Volunteers white / Homeless concrete / Anarchists
   black, which also survives a greyscale test. His six 7/21 rulings untouched.
   THE NEW RULER IMMEDIATELY EARNED ITS KEEP: my first Trades colour (safety orange)
   FAILED it - 12 degrees of hue and 0.07 of value from the Caravans' tan. Replaced
   with hi-vis yellow-green, which clears everything. TWO COLOURWAYS NEED COOKING
   (hi-vis, pale rose) - CLOTHES lane's factory, not this one, same as the five cooked
   on 7/21.
   THE 12 GAPS, researched with sources. The three worth reading:
   (2) THE MEMBERS ARE WALLPAPER - the central finding of the 2024 FDG faction-systems
       paper: games script leaders and leave the NPCs who ARE the faction with no role.
       We ship 268 derived people already; none of them acts like a member of anything.
   (3) REPUTATION TELEPORTS - the documented failure everywhere. The fix is reputation
       spreading from WITNESSES who remember and gossip. WE ALREADY BUILT THE HARD HALF
       (the memory system holds sightings and decays them); nothing wires it to factions.
   (5) WEARING THE WRONG COLOURS DOES NOTHING - the direct payoff of the ruling he just
       made. A colour's real job is to signal to allies AND provoke rivals.
   Also: no faction MARK (heraldry's paint-it/scratch-it/stitch-it constraint is physics
   here), no redemption path, no agendas, no zero-sum, no join/leave/expel, no internal
   politics, no standing surface, never colourblind-tested, bases placed by list stride.
   NOTHING BUILT - BUILD THE WORLD (7/31) has faction machinery off and STOP PRODUCING
   says finding a legal way to ship a frozen thing IS the violation. It is a list until
   he picks.
   | gate: FACTION DOSSIERS 675 -> 761, 8/8 probes (new one: a faction having its colour
   taken away to dodge a collision - the exact mistake he threw out) | 8/2 | YES - 12 cards.

00. [DONE 8/2 - VERDICT IN: 15 UP, 0 DOWN, 1 NOTED. records/BOHEMIA_FACTION_VERDICT_
   8_2_26.txt] HIS TWO RULINGS APPLIED THE SAME TURN:
   (1) KARENS: "not a faction. a quest giving group . they get a long with the reds".
       Thumbed UP with that correction, so the entry is reshaped: no selection slot,
       no standing, no territory claim - a quest-giving group on the working golf
       course, friendly with the Reds.
   (2) AMALGAMATION: left unthumbed with a note instead, which is right - it is not
       a faction to approve. "okay but dont forget the network is its pawn". PAWN is
       now the word on the card: the Network is played, not allied.
   APPROVE IS CANON, so every thumbed card stopped saying PROPOSAL. THE GATE HAD TO
   MOVE FOR THAT: it asserted "every dossier says PROPOSAL, NOT CANON", which was
   right for a day and then he thumbed them - A GATE MUST NEVER OUTRANK A RULING
   (8/1). It now READS HIS EXPORTED .txt and asserts each card says what he actually
   decided: approved cards must NOT still ask, unjudged ones must, and a DOWN card on
   the sheet fails outright (a kill goes to the graveyard, not back in the pile).
   | gate: FACTION DOSSIERS 659 -> 675 | 8/2 | no - judged, done.

00-SHIPPED. [SHIPPED 8/2, 16 DOSSIERS - records/BOHEMIA_FACTION_
   DOSSIERS_8_2_26.md + records/factions/] THE FACTION DOSSIERS. He said ALL of
   them, so it is the whole canon roster and not the shortlist of seven: 13
   selectable factions + the Karen community + the Amalgamation + the four social
   forces as one card. ONE judge sheet, LIFE tab, top card.
   EVERY CARD IS TWO BLOCKS AND THE SPLIT IS THE DESIGN: a GREY block read out of
   engine/BOHEMIA_faction_graph.json at generate time (align, act1/act3 power,
   relations, the graph's own note) which is canon and carries no thumb, and a
   GOLD block which is the proposal. He can see what he is actually judging.
   THE ROW THIS LANE ADDED, and it is what turns a list into a system: WHEN YOU
   ASK THEIR NAME. The ask-a-name machine shipped 7/31; every faction now answers
   it differently. Cartel know YOURS and never give theirs. Network hand it over
   unprompted and THAT IS THE TELL. Trades give you a job, not a name, and the
   real one arrives after you hire them twice. Karens write it down. Homeless ask
   where you sleep instead. Fifteen readings, no new code.
   RESEARCHED THE WAY THE DISTRICT HOOKS WERE: Olson's stationary bandit for the
   Mob (which makes Mob and Cartel the same violence with opposite time horizons),
   Ostrom + Valencia's thousand-year water court for the Blues, the LDS storehouse
   system for the Church (a congregation is a STANDING CENSUS - and the census
   that finds the sick knows who is not attending), Quarantelli and elite panic
   for the Volunteers, Vegas's real flood-channel population for the Homeless,
   the limitanei for the Remnants, Radford's POW-camp economy for the Reds, and
   the HOA-as-private-government for the Karens (60% of Vegas homes, and a golf
   course is a pre-built farm with the plumbing already in the ground).
   A HOLE PULLED IN CANON'S OWN FOLKLORE, kept rather than contradicted: the Mob
   "kept Vegas safe" is a legend the record disagrees with. What was true is
   narrower and better - they made promises BINDING where courts would not, which
   is exactly the GUARANTOR seat the GDD calls the scariest chair in the canon.
   *** THE COLOUR FINDING, MEASURED, AND IT ANSWERS THE 7/21 PARKING. *** That
   pass ruled six factions and parked the rest because "real color collisions
   turned up between them". Nobody went back. Measured with the engine's own
   distance function and its own 95-unit tolerance: THE MUTED CORPUS CANNOT CARRY
   13 DISTINGUISHABLE FACTION COLOURS. Every dark muted candidate collides with
   the Cartel's oxblood (olive 39, field green 47, steel 78, khaki 80); moss green
   collides with the Mob's mustard at 86. So the proposal is TWO colours, not
   seven - Volunteers bone white (a medic must read at distance), Blues cobalt -
   and eleven factions identified by SILHOUETTE instead, which is STRUCTURE-NOT-
   COLOR (7/19) doing the job that law exists for. Remnants have no colour because
   EVERYONE wears olive surplus; what civilians cannot get is webbing.
   AND ONE FINDING THAT IS HIS: Caravans tan sits 76 from the Church's gold,
   inside his own tolerance, both family mode, so nothing separates them on a
   body. Printed every run, never failed on - failing a build on his ruling is not
   the gate's job.
   THE BOUNDARY GOT A MACHINE, NOT A PROMISE (BUILD THE WORLD 7/31 + STOP
   PRODUCING 7/26): no new engine faction module, no .bq file, nothing in
   questbook/ or quests/ opened, factory writes to exactly two places - and the
   greps look for USES not mentions, per his 8/1 ruling. Custom has NO dossier on
   purpose (writing the player's own faction is writing his character for him) and
   the gate asserts the absence plus a recorded reason.
   MARCO: his ruling MOVED four hours after I wrote against it (name-only ->
   "hardcore realist and neighborly. Happy to help.", canon). My gate hard-coded the
   old state, which is A GATE OUTRANKING A RULING (Paolo 8/1), so it now READS THE
   LIVE ADDENDUM and enforces the half still open - HIS FACTION. No dossier claims
   him, and the dead "king of the hobos" reading cannot come back.
   | gate: FACTION DOSSIERS, 659 claims, SELF-TESTS with 6 planted mistakes (purple
   proposal, invented garment, colliding colour, re-proposed ruling, emptied row,
   two hooks instead of three) - all 6 caught. The factory also REFUSES TO GENERATE
   on a bad garment name and already caught one.
   | verified on the real surface: LIFE tab through the real door, 16 cards, thumb
   moves the tally, SUN MODE, zero console errors.
   | 8/2 | YES - 16 cards, all his. ORIGINAL TEXT BELOW.

00-ORIGINAL. THE FACTION DOSSIERS (Paolo direct order 7/31 lore sitting, recorded by
   the coordinator: "WE NEED TO REALLY FLESH THE FACTIONS OUT FR MAKE ALL OF
   THEM AWESOME AND INTERESTING" — this is the lane's TOP item now). ONE
   DOSSIER PER FACTION (Remnants, Cartel, Network, Homeless, Karen
   community, Amalgamation, + the Mob's caravan/guarantor role per lore
   sitting ruling 4): identity in five words, real-world grounding (each
   faction is a real social pattern — research it the way the district
   hooks were researched), territory + base, what they trade/control, how
   they dress (approved wardrobe only), how they talk (feeds the earned-
   names/dialogue machine this lane already built), what they want from
   the player, 3 quest hooks each, and the life lesson underneath — no
   preaching. THE DISTRICT-THEME-SHEET PATTERN: PROPOSALS for his thumbs
   on ONE side-by-side judge sheet, never canon until verdicted
   (CONTENTS-PAOLO'S). Existing canon is the floor, never contradicted
   (purple reservation, NETWORK eerily perfect, Homeless hold the storm
   tunnels, LIGHT=TERRITORY, generic-faction-identity-until-asked).
   MARCO: named-cast entry, NAME ONLY — Paolo's correction 7/31: "MARCO IS
   NOT THE KING OF HOBOS LMAO"; the rest of his sentence is unresolved
   garble. Ask, never fill. | one judge sheet, all factions side by side |
   standing ledger (below) is the mechanism half, ships empty regardless |
   yes (the dossiers ARE the judgeable).
0sc. GDD MECHANICS ROUTED 8/4 (records/BOHEMIA_GDD_MECHANICS_LEDGER_8_4_26.md
   — v4 LOCKED base, newly CHEAP): SCRIPTED SCENES. The Bethesda method:
   condition met -> scene (camera move, actors posed via the rig, dialogue
   through the runtime this lane already owns). v4's own note: "cutscenes
   cost almost nothing once the rig is locked" — the rig is locked and the
   dialogue player exists, so this is assembly, not invention. FIRST
   CONSUMER: the Act-1 cold open (the 7/19 family-defense opening vision)
   and quest beats. CONTENTS-PAOLO'S: the runtime ships; every actual scene
   is authored from his rulings. ALSO NOTED into the companion items: the
   v2 §16 detail spec travels with them (3 roles, party cap 4 = car
   capacity, base assignments, permanent death + one-revival-per-act rescue
   quest, thresholds, honesty tracking). | one scene plays end to end on
   the real surface, gated | scene content = his | no (runtime).
0. [MOSTLY ALREADY BUILT — verified 7/31, do NOT rebuild it] THE DIALOGUE
   SYSTEM v1. REUSE-FIRST found it: engine/bohemia_quest_runtime.js plus the
   run's own TALK sheet already play .bq conversations end to end on the real
   run surface (speaker, portrait, says, choices, silences, noverbs), driven by
   the one contextual verb, and gates/run_gate.js has proved S01 playable both
   forks since 7/26. What was missing was never the runtime — it was that the
   sheet only ever opened for the ONE quest speaker. Item 1 opened it for
   everybody. WHAT IS ACTUALLY LEFT HERE: nothing this lane may build alone.
   A non-quest conversation needs WORDS, and the words are Paolo's (LINES ships
   empty). Original text kept below for the record.
   THE DIALOGUE SYSTEM v1 (big-missing item 6): a conversation surface ON
   THE WALK — portrait + lines + choices through the run's ONE contextual
   verb (TALK already exists; today it is hardcoded quest text). Mechanism:
   a dialogue runtime any quest/NPC can feed; the quest corpus's .bq
   dialogue plays through it (REUSE-FIRST: the judge-page text player
   already parses it — port, don't rewrite). CONTENT STAYS CORPUS/PAOLO.
   | one .bq conversation playable on the real run surface through the one
   verb, gated | RUN owns the surface integration; coordinate, don't
   collide | no (mechanism; the words already have verdicts).
1. [SHIPPED 7/31 — records/BOHEMIA_PEOPLE_IDENTITY_7_31_26.md] NPC IDENTITY
   MECHANISM (big-missing item 6). engine/bohemia_people.js: every scheduled
   body resolves to a PERSON — role, house, household seat, job, their day,
   their own face — DERIVED from (blockSeed, house, slot), never stored,
   because the run throws every agent away and rebuilds it from the seed on
   each save load. Walk up to anybody on the RUN tab and the one button reads
   TALK TO THE SCAVENGER; the card shows who they are and whether you have met.
   HANG OUT was not deleted, it moved inside the conversation. A meeting ledger
   rides in the existing save blob (additive, no env bump).
   NAMED_CAST and LINES SHIP EMPTY and people_gate fails if either gains a row;
   there is no procedural name generator and the gate sweeps for a name bank.
   >>> HE RULED THE NAMES SAME DAY: laws/BOHEMIA_ADDENDUM_YOU_HAVE_TO_ASK_7_31_26.md.
   >>> "Nobody will have a name unless you talk to them and ask them for their
   >>> name... I hate how in other games you know everyone's name off the bat and
   >>> I think it's complete bullshit... once you ask their name, if you see them
   >>> again, then they would be named." SHIPPED the same turn: strangers are
   >>> called by their trade, an "Ask their name" button is the only door to a
   >>> name, and asking is remembered forever across saves. The gate that
   >>> asserted the opposite was rewritten, not worked around.
   >>> WHO YOU ALREADY KNOW IS **PARKED BY PAOLO 8/1**, not pending: "Don't worry
   >>> about that right now don't worry at all about that right now." KNOWN_AT_START
   >>> stays empty and the game ships with nobody known from the first frame.
   >>> DO NOT ASK HIM AGAIN and do not fill the table; ask-everybody IS the whole
   >>> mechanic until he raises it himself.
   TWO REAL BUGS FOUND BY THE GATE, both measured: (1) `agent.seed % 6` can only
   return 0/2/4 over 528 bodies on 40 blocks, so THREE OF THE SIX townsfolk
   bodies the alpha bakes had never been drawn — dead low bits from a float64
   multiply in bohemia_agents.hash; fixed at the modulus (mix32) NOT in that
   hash, because changing it would reshuffle every household in the valley.
   (2) mine: identity was keyed to the world SEED (which is 7 for the whole
   valley) instead of the block seed. Gate: PEOPLE, 63 checks, 8 mutations
   caught. Proof: slices/BOHEMIA_PEOPLE_CARD_ALPHA_7_31_26.png.
1b. (discovered 7/31) THE FACES DO NOT VARY BY FACE. CHARACTER's portrait baker
   renders the same spec per look and varies colourway + hat, so six people are
   six palettes of one face. Not this lane's system — flagged for CHARACTER, not
   claimed. Nothing here is blocked on it.
1c. (discovered 7/31) A PERSON IS PER BLOCK. Walk to another cell and those are
   correctly different people, but nobody FOLLOWS you between cells and the
   valley census (bohemia_population.js) is still numbers rather than
   identities. That is the shape the companion layer (item 3) will need.
2. *** DEAD BY RULING 7/31 — DO NOT BUILD THIS. *** laws/BOHEMIA_ADDENDUM_BUILD_
   THE_WORLD_7_31_26.md: "NO FACTION SHIT EITHER!" The law names it exactly: "No
   standing ledger, no territory model, no faction beats. The proposal to build
   the faction system next is DEAD." gates/build_the_world_gate.py fails on any
   new engine/bohemia_faction*.js. This item was the PEOPLE lane's stated next
   step in the 7/31 handoff and that handoff was written BEFORE the ruling landed;
   a session that picks it up is walking into a machine-enforced violation. Lifting
   the freeze is Paolo's, and it means editing that gate.
   ORIGINAL TEXT, for the record only:
   FACTION STANDING LEDGER (big-missing item 4): a per-faction standing
   value the world can read/write, EMPTY of rules — no action-to-standing
   table until Paolo rules it (kill-anyone + clout laws interact here and
   are HIS). Territory model: cells already carry owners via light/power;
   expose it queryably. | ledger + query API gated; zero behavior change
   until tables fill | world_resolve's beat predicate stays WORLD's | no.
3. COMPANION SOCIAL LAYER (big-missing item 5, WAITS on combat extraction
   step (a)): who can join, where they live when not with you, what they
   remember (a memory that survives the save blob). Roster/why = [PENDING
   Paolo]. | — | COMBAT owns in-fight allies; RUN owns follow-on-walk | no.

## SOUNDS  (DEDICATED LANE, Paolo 7/29 — "i should just make a dedicated
## sounds chat". First word "sounds" (or "sound"/"music"). Owns everything
## audible: music, SFX, mix, beat plumbing. AUDIO MOVED OUT of CHARACTER —
## one system one session. Lane intent: doctrine §6.)
0. (SHIPPED 7/29 - records/BOHEMIA_SFX_FACTORY_7_29_26.md. 60 candidates for
   12 game moments are LIVE in the MUSIC TAB, top of the panel: tap, hear,
   thumb, note, export .txt. Gates: sfx_gate.js (73) + sfx_render_gate.py
   (752, real audio in a real browser). The BANK IS EMPTY and stays empty
   until he thumbs one - do NOT pick sounds for him, and do NOT re-cook this
   batch; bulk silence is a verdict. On APPROVE the next move is variants of
   the approved vector, 3-4 per footstep so a walk does not machine-gun one
   sample.) THE SFX FACTORY (GREENLIT by Paolo 7/29 when he ordered this lane
   into existence; routed 7/28 off his own state-of-the-game — sound effects are
   HIS ONLY 0%. Research record: records/BOHEMIA_RESEARCH_FRICTIONLESS_
   ACCELERATORS_7_28_26.md) Procedural sound synthesis on the alpha's own
   Web Audio stack (the sfxr/jsfxr lineage — sounds are ~20 synth
   parameters, not files; zero asset weight in the one-file alpha). Factory
   law applied: typed spec (event name + parameter vector) -> generator
   module -> batches of 8-12 candidates per game event (footsteps by ground
   type, doors, pickup, hit, block, kill-on-beat, UI tap, phone buzz, save
   chime, rain, fire) -> ONE judge page that plays them side by side (a
   60-sound batch is one Paolo sitting — the cheapest verdict pipeline in
   the game) -> approved vectors bank + hash-replay regression gate. 120 BPM
   native: durations in beats, combat sounds quantize to the dial's audio
   clock (EVERY-DURATION-IS-A-NOTE). MECHANISM-MINE: the synth + judge page
   ship; WHICH sound any event makes is his verdict, tables empty until
   judged. | judge page live + vector bank + regression gate | one
   AudioContext (the parent's) — no second audio engine | yes (the batches
   are the judging).
0v. SQUIGGLE VOICES (Paolo direct ruling 8/4, DEMO-CRITICAL: "I know we
   still need squiggle voices for all the characters"): Animal-Crossing-
   class gibberish speech, synthesized on the existing Web Audio stack —
   no recordings, no files. Each character's voice = a few synth params
   (pitch, speed, timbre) derived from their identity seed, so everyone
   sounds like THEMSELVES, forever, for free. Speaks per dialogue line/
   syllable through the dialogue runtime (PEOPLE's system consumes).
   Named outside refs: Animal Crossing's Animalese, Undertale's per-
   character beeps, Celeste's warbles — study the lineage, pick the read.
   MECHANISM ships + a voice batch judge page (listen-and-thumb, like the
   SFX factory); which voice class any named character gets is his ear's
   call. | a conversation on the real RUN surface SPEAKS + judge page live
   | dialogue runtime already built | yes (voices are judgeable by ear).
0s. GDD MECHANICS ROUTED 8/4 (records/BOHEMIA_GDD_MECHANICS_LEDGER_8_4_26.md
   — v2 §22, LOCKED, and it is this lane's gift): THE CD SYSTEM + RADIO.
   No streaming exists in-world: music is FOUND (CDs as collectibles that
   grow the base's library — looted apartments, Caravan traders, faction
   milestone gifts; play at the compound and in vehicles) and BROADCAST
   (faction radio: propaganda + lore + music; the Remnants' emergency
   channel, the Anarchists' pirate station, Church hymns — each faction a
   voice). Plus FACTION SONIC SIGNATURES: each territory its own ambient
   bed. MECHANISM-MINE: the player/radio systems + slots ship; WHICH tracks
   and what any station says are Paolo's (the existing approved music pool
   is the day-one library — reuse-first). | CD found->library->played on
   the real surface; one radio station audible | track lists + station
   content = his | yes (stations/ambience are listen-and-thumb).
1. (carried from the reality map) THE RUN HAS NO BEAT: the walk's BEAT=500
   is a hardcoded constant; no tempo/beat index crosses the postMessage
   vocabulary while combat gets full song data + HERO BEAT. Hand the run the
   real beat clock (this lane owns the plumbing; RUN consumes). | run door/
   step timing provably driven by the playing song's clock | the dial's
   audio-clock pattern is the reference | no.
2. (carried) DAYCYCLE/WEATHER AUDIO HOOKS, after RUN 0d wires the daycycle:
   ambient beds (wind, night insects, rain when the weather ruling's rare
   rain fires) from the same synth stack — no files. [Waits on RUN 0d.] |
   heard on the real surface | — | yes (ambience candidates are judgeable).

3. (discovered 7/29, while building the factory) VARIANT ROUNDS ARE BLOCKED ON
   A VERDICT, not on machinery: cook() already takes a count, so an approved
   vector spawns its alternation set the same turn he approves it. Nothing to
   build until then.
5. (discovered 7/29, FLEET-WIDE not just this lane) A FRESH CONTAINER FAILS 8
   GATES FOR ONE MISSING LIBRARY. Pillow + numpy are not installed, so every
   pixel-reading gate dies with ModuleNotFoundError at the end of a 700s run and
   looks like eight real failures. Half-closed: gates/requirements.txt exists and
   bohemia_gates.py warns up front. NOT closed: nothing installs it
   automatically. A SessionStart hook or setup script would close it for every
   lane at once. NON-COOK, any lane can take it.
4. (discovered 7/29) THE MUSIC STUDIO'S OWN VOICES ARE NOT ON THE SFX SPEC.
   The 60-odd synth bodies in the alpha's song engine (thud/rim/conga/wireharp/
   ...) are hand-written node graphs, not vectors, so they cannot be judged,
   fingerprinted or regression-gated the way a sound effect now can. Not a bug
   and not urgent - but if music ever wants the same kill/approve pipeline, that
   is the gap, and it is a big one. NON-COOK, needs a ruling before any work.

## CHARACTER  (LANE LAW 7/26: laws/BOHEMIA_ADDENDUM_THE_RIG_IS_LAW_7_26_26.md
## — the rig is the starting point of ALL body/anim work; RIG CHECK mandatory;
## AND laws/BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md — shading never
## baked into asset pixels, render-time layer only. First items of the lane's
## next session: the rig-check gate assertion + the shading-separation gate
## assertion, same turn. AUDIO MOVED OUT 7/29: music/SFX belong to the new
## SOUNDS lane above — this lane is bodies, clothing, animation only.)
1. (DONE 7/26 -- records/BOHEMIA_BODYVAR_SLIDERS_7_26_26.txt) ONE-RIG VARIATION
   SLIDERS. Shipped with gates/bodyvar_gate.js + a real-browser clip-set sweep.
   The RANGES are now waiting on Paolo's thumb; do not re-cook them, and do not
   wire per-NPC randomisation until he rules on it.
1b. **NOT DONE AFTER ALL — RE-DONE 8/6, records/BOHEMIA_THE_SNAP_SIZED_THE_WRONG_BOX_8_6_26.md.**
   The 7/30 fix sized every canvas to a tidy multiple (charCv 336, g8c 112,
   portraitCv 128, cloBig 168, cloCv 56) and canvas_scale_gate has asserted those
   ratios green ever since. IT WAS ASSERTING ON THE BORDER BOX. The alpha is
   box-sizing:border-box and each of these has a 1-2px border, so a declared 336
   puts the bitmap in 334 — measured on the CONTENT box, every single one was
   still fractional: charCv x2.9821, portraitCv x1.9375, cloBig x2.9643,
   cloCv x0.9286, g8c x0.9821. Near-integer survives being looked at, which is
   how it lasted eight days behind a gate written to catch it. The 7/30 SIZES
   were right; only the box was wrong, so each declared width now carries its
   own border (336 -> 338, etc). PLUS the two worst surfaces in the game, both
   HAIR and both anonymous canvases no gate could name: the picker tiles at glass
   x1.7143 (one device pixel here, two beside it) and the 8-facing spin bar at
   x4.5000 (a dead half pixel) — now .hairTile and .hairSpinShot, both integer.
   18 of 21 fractional -> 4, and all four belong to combat/city. The audit reads
   the content box now and the gate asserts THAT IT DOES, so a regression in the
   measurement cannot silently re-green everything.
   ORIGINAL 7/27 MEASUREMENT (city lane) and the 7/30 attempt, kept as the record:
   **(WAS: DONE 7/30, AND PAOLO COULD NOT SEE IT.)** (MEASURED BY THE CITY LANE 7/27, handed over untouched — ONE SYSTEM, ONE
   SESSION) EVERY CHARACTER SURFACE IS DISPLAYED AT A FRACTIONAL SCALE. The
   city lane built tools/bohemia_canvas_scale_audit.js to catch its own canvas
   being bilinear-upscaled to the phone screen, and the same sweep measured
   yours. These are CSS-box-vs-backing-store ratios on a real iPhone-portrait
   DPR-3 browser; `image-rendering:pixelated` is already set on all of them, so
   the failure mode is not blur, it is UNEVEN PIXELS - some source pixels land
   3 screen pixels wide and some 4, which reads as a wobbly, badly drawn
   sprite, and it is worst on the biggest one:
       char    #charCv      112x112 -> 358.8 css   x3.2035   (glass x9.61)
       char    #portraitCv   64x64  -> 120 css     x1.8750   (glass x5.63)
       clothes .cloBig       56x56  -> 150 css     x2.6786   (glass x8.04)
       clothes .cloCv        56x56  ->  52 css     x0.9286   (a minification)
       anim    #g8_0..7     112x112 ->  85.8 css   x0.7660   (drops ~23% of
                            every row and column - on the gallery the anims are
                            JUDGED from)
       rig     #cv          336x336 -> 336 css     x1, but image-rendering is
                            `auto`, the only canvas in the game with no filter
                            set at all: at DPR 3 the rig preview is a bilinear
                            x3 smear.
   The fix is integer boxes (charCv 112 -> 336 css = x3, portraitCv 64 -> 128,
   cloBig 56 -> 168 or 112, the g8 gallery baked at 56 rather than shrunk from
   112) plus `image-rendering:pixelated` in RIG_B64, which has none. Each one
   nudges an element's size, so it is a look call as much as a fix. Reproduce
   with: node tools/bohemia_canvas_scale_audit.js

   >>> CLOSED 7/30. All 13 character surfaces now land on whole-number scales
   >>> (charCv x3, portraitCv x2, cloBig x3, cloCv x1, g8_0..7 x1, rig cv x1 with
   >>> image-rendering:pixelated finally set inside RIG_B64). Fractional canvases
   >>> across the build went 19 -> 4; the 4 left are combat/city and belong to
   >>> those lanes. Gate: canvas_scale_gate.js now ASSERTS the 7 character
   >>> surfaces (29/0) instead of printing them, so it cannot drift back.
   >>>
   >>> PAOLO'S VERDICT, RECORDED BECAUSE IT MATTERS MORE THAN THE NUMBERS:
   >>> "I cant tell a difference with what you did but okay!!"
   >>>
   >>> HE IS RIGHT, AND THE NUMBERS ALWAYS SAID SO. The headline case was 3.2035x
   >>> -> 3x. That is a 6% change in how wide a source pixel lands, on a 112px
   >>> sprite. It removes a real defect (some pixels 3 screen-px wide, some 4) but
   >>> it was never going to be a VISIBLE upgrade, and it got presented to him as
   >>> a ship headline anyway. That was overselling.
   >>>
   >>> THE LESSON FOR EVERY LANE, not just this one: a measured defect is not
   >>> automatically a felt defect. Before leading a turn with a fix, ask what the
   >>> change looks like TO HIM, not what it does to the ratio. Hygiene work is
   >>> worth doing and worth gating; it is not worth his attention, and it is
   >>> never the headline. The right framing here would have been one line: "also
   >>> cleaned up canvas scaling, you won't see it."
   >>>
   >>> DO NOT RE-COOK THIS. It is done, it is gated, and he has seen it. Any
   >>> further pixel-scaling work in the character tab needs a NEW reason from
   >>> him, not a refinement of this one.
   slices/BOHEMIA_ALPHA_0_9.html | gates/canvas_scale_gate.js already PRINTS
   these every run and deliberately does not fail on them; make them yours and
   turn them into assertions | measured, not read | no.
1c. (MEASURED BY THE ART LANE 7/27, handed over untouched — ONE SYSTEM, ONE
   SESSION) THE SHELL HOLDS 2217 LIVE CANVASES once every tab has been opened.
   Different sweep, different concern from 1b: that one is about how canvases
   are DISPLAYED, this one is about how many of them EXIST. The memory probe
   (tools/bohemia_canvas_memory_probe.js) counts 2604 live canvases across the
   alpha at ~21 KB each = 53.8 MB of pixels, and 2217 of them are in the shell
   itself, which is where char / clothes / anim live. They survive a forced
   garbage collection, so they are RETAINED, not garbage waiting to go. Nothing
   is on fire: the whole build peaks at ~98 MB resident = 44% of the 224 MB iOS
   floor. But no single one of those canvases looks wrong, which is exactly why
   this went uncounted until now, and the tile set is about to multiply. Likely
   shape of the fix: one canvas per THUMBNAIL kind reused, or the previews drawn
   into a shared atlas, rather than one per garment/frame retained forever.
   Reproduce with: node tools/bohemia_canvas_memory_probe.js (see by_frame in
   records/target/BOHEMIA_CANVAS_MEMORY.json). gates/canvas_memory_gate.py
   ratchets the total and deliberately does not fail on the count | measured,
   not read | no.
2. Wardrobe: new SHAPES (structure-not-color), taste-filtered before
   surfacing. | structure_gate | — | fresh shapes = thumbs.
3. Music pool volume in approved styles, taste-filtered. | music gates | — |
   fresh songs = thumbs.

## ===== CHARACTER: WHAT COMES AFTER (written 7/30 on Paolo's direct order,
## ===== "Do what you have to do next and know what comes after we have a
## ===== whole game 11 months of development left")
## The point of writing this down: a lane that only ever pops the top item
## optimises for the turn and never for the year. These are the things that get
## HARDER the longer they wait, ordered by how much they cost if deferred.
##
## A. THE FOUNDATION IS NOW LOAD-BEARING, SO GATE IT BEFORE BUILDING ON IT.
##    Done 7/30: RIG CHECK gate (the law had none for 4 days), ALPHA LOADS gate
##    (main shipped a dead alpha). Still open: nothing in the machine checks
##    that a CLIP looks like the rig POSED rather than the rig SMEARED -- the
##    zero-morph proof covers frozen holds, not transitions. Cheap now, very
##    expensive once the clip library is 10x bigger.
##
## B. THE CANVAS COUNT IS THE ONE MEASURED THING THAT GETS WORSE WITH TIME.
##    Item 1c: 2217 live canvases in the shell, 53.8 MB of retained pixels, at
##    44% of the iOS floor. It is fine TODAY and that is exactly the trap -- the
##    number grows with every garment, frame and tile added over 11 months, and
##    the fix (one canvas per thumbnail KIND, or a shared atlas) gets more
##    invasive the more surfaces depend on the current shape. Do it while it is
##    still a refactor instead of a rescue. NON-COOK.
##
## C. VOLUME IS BLOCKED ON JUDGEMENT, NOT ON CAPACITY.
##    Item 2 (wardrobe SHAPES) is the lane's only real cooking item and it ends
##    in thumbs. Per STOP PRODUCING and UNJUDGED IS DEAD, cooking more before he
##    rules is the named failure mode, not diligence. The lane's honest state is:
##    the machine can produce garments faster than he can judge them, so the
##    bottleneck is the VERDICT SURFACE, not the factory. That makes SHARED item
##    1 (one aggregated judge page across lanes) worth more to this lane than
##    any amount of new cooking.
##
## D. THE THREE THINGS THAT ARE HIS CALL AND HAVE BEEN WAITING.
##    Border tone; far-hand depth on E/W (measured: far 153.2 vs near 153.8, no
##    depth cue at all); the unbuilt slider ideas (leg length vs torso,
##    frame/bulk, posture, neck length). None of these should be decided by a
##    session. All three are cheap to build the moment he rules.
##
## E. WHAT THIS LANE MUST NOT DO OVER 11 MONTHS, from its own post-mortems:
##    never build a second rig (woman-rig v1-v4, kill-reason IGNORED-THE-RIG);
##    never bake shading into asset pixels (SHADOWS ARE SEPARATE); never let a
##    recolor be the headline (STRUCTURE-NOT-COLOR); never present a measured
##    defect as a felt improvement (7/30, the canvas-scale turn -- he could not
##    see it, and he was right).

## QUESTS — HIBERNATED (Paolo 7/26, laws/BOHEMIA_ADDENDUM_QUESTS_LANE_
## HIBERNATED_7_26_26.md). Do NOT pick up items below; no "quests" sessions
## until Paolo reopens the lane. All shipped quest work stays live and gated.
1. DONE 7/26 (S10-S21 shipped, corpus 9 -> 21, gate hardened with 5 new checks,
   laws/BOHEMIA_ADDENDUM_TWELVE_MORE_CANON_QUESTS_7_26_26.md). Sitting is live in
   the alpha: LIFE tab -> THE 12 NEW CANON QUESTS. Awaiting thumbs.
2. Act-1 main-quest beats from the locked lore (cold open -> flash-flood climax)
   drafted as .bq chains. START by querying records/BOHEMIA_QUESTBOOK_LAW_INDEX.json
   (QUEST STUDY LAW) and cite what you build from. | same bar as S10-S21, plus
   chain continuity proven headless | engine code, the alpha | yes.
2b. (discovered 7/26) The PORTS master is a 1,276-item BUILD QUEUE written for
   Bohemia by name and almost none of it is built. Mine it for the next quest
   batches instead of inventing shapes. NON-COOK triage first: list the ports
   that are already satisfied vs open. | the index makes this queryable | — | no.
3. (discovered 7/26) MULTI-QUEST CHAIN SUPPORT: nothing in the format or the
   runtime lets quest B read that quest A resolved (S09 -> S06 is a chain only in
   prose). Act-1 beats need it. NON-COOK item: a cross-quest flag surface on
   ctx.quests + a gate proving A's ending really opens B. | new gate section |
   the .bq format's no-stat-gates law is untouchable | no.
4. (discovered 7/26) The batch plants unread flags (opened_the_deep,
   aired_the_method, killed_the_token, walked_them_out, owes_the_cartel,
   sold_the_forger). Nothing consumes them. Wiring them to world beats is
   [PENDING Paolo] at the canon level; the mechanism half is item 3.

## SHARED / ANY IDLE SESSION (non-cook)
-1. THE STREET SOURCE GATE (Paolo direct order 7/31 — laws/BOHEMIA_ADDENDUM_
   STREETS_ARE_THE_HARMONIZED_POOL_7_31_26.md; new law = new gate, do this
   first): machine-enforce that street graphics always go through banks/
   BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt + the finder doc records/
   BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md. Two checks: (a)
   tileform_gate extension — any form whose subject is street-family
   (street/road/asphalt/sidewalk/kerb/curb/marking/crosswalk/median/lane/
   stall) must name the harmonized bank in its shopping check or it is not
   OPEN; (b) code sweep — street-rendering paths (run/city builders, any
   street cook tool) provably OPEN the bank (extend the banks_used/
   reusefirst gate family, do not invent a rival). Also assert the finder
   doc + bank both EXIST so the pointer can never rot silently. | gate
   registered + proved-it-can-fail | — | no.
0. THE SHOPPING LAW MACHINE (from the 7/27 index): (a) make records/BOHEMIA_
   APPROVED_ASSET_INDEX generation a TOOL (sweep verdicts x banks x consumers
   automatically); (b) NEW GATE: every bank listed APPROVED in the index must
   have >=1 consumer on a playable surface OR carry an explicit routed
   backlog item — approved-but-unused turns the gate red; (c) the gate also
   flags the INVERSION (unjudged banks with surface plumbing). | gate
   registered, index regenerates deterministically | — | no.
1. VERDICT TOOLING upgrade per the doctrine: one AGGREGATED judge page across
   lanes grouped by discipline, side-by-side anchors, APPROVE/CBB/KILL
   buttons, kill-reason tags, .txt export. | replaces per-lane judge sprawl;
   gate: the page exists + exports parse | — | no (tooling, not art).
2. [PRIORITY UP 7/26, Paolo direct order — approved-assets-first addendum]
   CANON EXEMPLAR INDEX + KILL-REASON TAXONOMY distilled from banks +
   graveyard post-mortems (machine-readable; cooking tools cite which
   exemplar anchored each cook). | reusefirst-style gate extension | — | no.
3. DRIFT CANARY harness: re-render fixed approved anchors, diff vs blessed.
   | canary gate registered | — | no.
6a. LOAD-SENSITIVE GATES ISOLATE THEMSELVES (sweep 1 audit, 8/11 — third
   occurrence of the class: RUN BEAT wall-clock assert + THE CROWD flip
   under machine load, after COMBAT's 7/26 render-pixel note): any gate
   that measures wall-clock or live-render behavior must detect load (or
   run isolated / re-run-alone-on-red automatically) so a busy box cannot
   red-flag an innocent lane. A gate that reds at random gets ignored,
   which is worse than no gate. | the flaky trio pass under a saturated
   box or self-report LOAD, gated | fix the ruler never the target | no.
4. (discovered 7/28, ENGINE REALITY AUDIT) FPS/FRAME-TIME INSTRUMENTATION IS
   MISSING on both walk surfaces — step latency is gated (streaming_gate),
   render latency is measured nowhere. A perf claim without a gauge is a
   guess. | a frame-time probe on the run + CITY, numbers in a record | — |
   no.
5. (discovered 7/28, ENGINE REALITY AUDIT) WIDEN THE SYNC NET: sync_gate only
   tracks `const BOH_*` declarations, so bohemia_loop / bohemia_agents /
   bohemia_bq / quest_runtime and every district generator sit OUTSIDE it
   (covered only piecemeal by run_gate's 6-module list + city resync). |
   sync_gate covers the full inlined-module set | — | no.
6. (Paolo order 7/28 — the form law, BOHEMIA_TILE_REQUEST_FORM.md) THE
   TILEFORM GATE: validates every records/tileforms/*.md — all required
   sections present (A-J), caption JSON parses, shopping check names a real
   approved-index entry, edge contract is one of the four legal words
   (single/self-seamless/wang-16/blob-47), anchor resolves. Board rows whose
   form fails are not OPEN. ALSO: the caption-ingest hook — captions feed the
   tilespec/dossier pipeline so district builders can query best_time /
   best_location / never_next_to per tile. | gate registered + one caption
   queried end-to-end | — | no.

# BOHEMIA QUESTBOOK — DEEP DIVE 21: "YOU CAN'T SAVE EVERYONE" (Pathologic 2)
Full teardown, the whole enchilada: time-as-scarce-resource design, the plague-town survival engine,
triage-as-gameplay, the mindmap questlog, the save-the-town-vs-save-the-magic finale, the metanarrative,
the honest flaws, and Bohemia ports. This is the medium's model for SCARCITY + INEVITABLE LOSS as the
core experience — a game that MECHANIZES grief and triage. A brutal, distinct lesson for our post-
collapse survival RPG. Reference only; Paolo does not read it. No Bohemia quest written here.

Game: Pathologic 2 (Ice-Pick Lodge, 2019). You are Artemy Burakh, a surgeon returning to a plague-
struck town on the Russian steppe; you have ~12 days to fight the Sand Plague, clear your name for your
father's murder, and decide the town's fate. Tagline: "YOU CAN'T SAVE EVERYONE." A survival-thriller
RPG with cult acclaim for making suffering, scarcity, and loss into DESIGN.

===============================================================================
## 0. THE PREMISE / STAKES
===============================================================================
- THE HOOK: a classic whodunit (who killed your father?) that within hours becomes something else — a
  PLAGUE hits the town, and you, a healer, are charged with fighting it while suspected of murder.
- THE CORE TRUTH: you CANNOT save everyone. Not even close. Time, medicine, food, and your own body are
  all scarce; every hour spent saving one person is an hour NOT spent on another. Who you choose to see/
  save shapes the story — and the ones you don't, DIE, permanently.
- THE STAKES: your own survival (hunger/thirst/exhaustion/infection meters + health), the lives of a
  strong cast of named individuals, your bond factions (the Kin vs the Town, often opposed), and — at
  the end — the town's entire fate. Indecisiveness kills everyone; commitment costs lives either way.
- THE THESIS: "the paradoxical necessity of dying (and letting die) to continue living." The game is an
  exercise in MANAGING FAILURE and inevitable loss — a lesson in humility and acceptance.

===============================================================================
## 1. THE ARCHITECTURE (how a scarcity/loss game is built)
===============================================================================

### TIME AS A SCARCE RESOURCE (the genius under the surface)
- The game is 12 DAYS. Each day has time-gated EVENTS that simply happen — and if you're elsewhere, you
  MISS them, and someone may die unattended. Leads/quests EXPIRE if their deadlines pass. You can't be
  everywhere; the loading screens constantly remind you "you can't save everyone."
- Most games treat time as a FEATURE (a countdown you're expected to beat); Pathologic 2 treats time as
  a RESOURCE you're expected to LOSE. The clock isn't a challenge to master — it's a scarcity to grieve.
  The pressure creeps: early (pre-plague) you don't feel it; by day 4-5 the weight of fleeting time is
  ever-present. This slow-onset is deliberate — you learn the cruelty by living it.

### THE BODY AS A SECOND CLOCK (survival sim)
- Health is propped up by HUNGER, THIRST, EXHAUSTION, and INFECTION meters. Just staying alive consumes
  time and resources — "it's hard enough finding the time to save yourself." As the plague spreads,
  prices SKYROCKET, resources vanish, and you may be forced into morally questionable acts (theft,
  hard bargains) to survive. Scarcity manufactures moral compromise.

### TRIAGE AS GAMEPLAY (the core loop)
- Once the plague breaks, you PRIORITIZE: which infected districts to treat, which people to see, which
  factions to back (the Kin vs the Town). Your father's dying wish: protect the CHILDREN first — "they
  are the key to the future" — but that's YOUR choice to honor or not. Diagnosis + treatment (brewing
  antibiotics/panacea, using tinctures) improves survival ODDS, never guarantees. You're a triage
  officer with never enough to go around.

### THE MINDMAP (story-as-interface — a dev-explained innovation)
- Ice-Pick Lodge REPLACED the traditional quest log with a MINDMAP: a web of your character's THOUGHTS
  and how clues/people/ideas connect — the questlog IS Artemy's psychology, so tracking the mystery is
  inhabiting his mind. Narrative design where the INTERFACE is diegetic (cf. Obra Dinn's logbook Q19,
  Disco's thought cabinet Q05). Story informs every mechanic and menu.

### THE FINALE (save the Town OR the Magic — no clean win)
- The endgame choice (echoing Pathologic 1's Bachelor/Haruspex split): DESTROY THE MIRACLE (the
  Polyhedron/the "magic") to SAVE THE TOWN, or let the plague take the town to PRESERVE the miracle —
  each portrayed as a REASONABLE, non-evil choice with real arguments on both sides (players genuinely
  flip on which is right). By the end, so few remain alive that "saving" the town is itself questionable.
  No option is clean; the debate is the point (cf. Whispering Hillock Q04, Vault 22 Q03).
- THE METANARRATIVE: the game knows it's a game (a theatre framing; characters discuss the "play").
  Miss the ending window and it BREAKS THE FOURTH WALL to berate you with a non-ending — form commenting
  on failure itself.

### THE HONEST FLAWS (banked)
- DELIBERATELY MISERABLE / NOT FOR EVERYONE: the survival meters can dominate to the game's "detriment"
  (you spend most of your time managing your body, not the story); the suffering is the design, and it's
  a hard sell. Ice-Pick added DIFFICULTY SLIDERS post-launch to tune how unforgiving it is. LESSON:
  scarcity-grief is POWERFUL but ALIENATING; give players tuning knobs so the intended few can go
  hardcore while others can experience the story without bouncing off.
- UN-100%-ABLE BY DESIGN: you can't see everything in one run; some love it, many find it a hard sell.
  LESSON: missable content deepens replay + theme but frustrates completionists — a real trade-off to
  make CONSCIOUSLY (and telegraph).

===============================================================================
## 2. WHY IT WORKS (craft, itemized for stealing)
===============================================================================
W1. TIME AS A RESOURCE TO LOSE (not beat): the clock isn't a challenge to master — it's a scarcity to
    grieve; missing events/deaths is BUILT IN. The most distinctive time design in the medium.
W2. "YOU CAN'T SAVE EVERYONE" AS THE THESIS: inevitable loss is the CORE experience, not a fail state —
    the game mechanizes triage and grief; you play to manage failure, not avoid it.
W3. THE SLOW-ONSET CRUELTY: the pressure is absent early and creeps in by day 4-5 — you LEARN the
    cruelty by living it, so it lands as lived experience, not a rules-explanation.
W4. THE BODY AS A SECOND CLOCK: hunger/thirst/exhaustion/infection make mere survival cost time +
    resources — scarcity forces moral compromise (theft, hard bargains) organically.
W5. TRIAGE AS THE CORE LOOP: prioritize districts/people/factions with never enough — every save is a
    death elsewhere; the gameplay IS the ethics (cf. That Lucky Old Sun allocation, collection).
W6. ODDS, NOT GUARANTEES: treatment raises survival PROBABILITY, never certainty — you live with
    outcomes you influenced but didn't control (cf. ME2 survival math Q06). Uncertainty = weight.
W7. THE DIEGETIC QUESTLOG (mindmap): the quest log IS the character's mind — story informs the very
    interface; tracking the plot is inhabiting the protagonist (cf. Obra Dinn Q19, Disco Q05).
W8. THE NO-CLEAN FINALE (town vs magic): two reasonable, well-argued end-choices players genuinely flip
    on — and by the end "winning" is itself questionable (so few survive). Debate as the payoff.
W9. THE METANARRATIVE FAIL-STATE: miss the ending and the game breaks the fourth wall to berate you —
    form commenting on failure; the game is ABOUT its own unforgivingness.
W10. SUFFERING AS DESIGN (+ the tuning-knob fix): the costs make the choices heavy — but it's alienating,
    so difficulty sliders let players set their own cruelty. Powerful + honest about its own hard sell.

===============================================================================
## 3. BOHEMIA PORTS (directions, not built)
===============================================================================
Bohemia is a HARDCORE post-collapse survival RPG with death-math + scarcity currencies (medicine,
electricity, resources) — Pathologic 2 is the master text on making SCARCITY + LOSS the emotional core.
(We are NOT trying to be as punishing; steal the PRINCIPLES + the tuning honesty.)
- W1/W2 (time/scarcity as a resource to LOSE + "can't save everyone"): our survival-accounting + death-
  math already lean here; bank the Pathologic thesis for our HARDEST content — a crisis (a plague, a
  siege, a winter, an Amalgamation purge) where the dynasty CANNOT save everyone and must TRIAGE, and
  the unsaved die permanently into the fold/ledger. Loss as designed experience, not a fail (ties our
  death-math, Q019 march tally, the Liberate "let go" thesis).
- W3 (slow-onset cruelty): stage a Bohemia crisis so the pressure CREEPS (calm early, dire by mid) —
  the player learns the stakes by living them (ties our generational pacing; a dynasty's decline felt,
  not announced).
- W4 (the body/city as a second clock): our survival meters + life-support buildings ARE this — mere
  survival costs resources + time, forcing moral compromise under scarcity (validate; scarcity should
  manufacture hard bargains, not just attrition).
- W5 (triage as the core loop): a Bohemia TRIAGE quest — allocate scarce medicine/power/food across
  districts/people/factions with never enough; every save is a loss elsewhere; the allocation IS the
  ethics (ties Q036 plant power, That-Lucky-Old-Sun, our currencies). PERFECT fit for a city-builder.
- W6 (odds not guarantees): our treatment/rescue outcomes should be PROBABILITIES the dynasty
  influences, not guarantees — live with results you shaped but didn't control (ties ME2 math Q06,
  our combat dial odds).
- W7 (the diegetic questlog): consider making a Bohemia "log" diegetic — the unrecorded ledger / a
  dynast's mindmap AS the quest tracker (story informs the interface; cf. Obra Dinn Q19, Outer Wilds
  rumor-web Q18, Disco Q05). Our ledger is already half this.
- W8 (no-clean finale, genuinely debated): our Liberate/Respect/Become already are this — two-plus
  reasonable end-choices players flip on, where "winning" is questionable — validated by the master of
  bleak moral finales.
- W10 (suffering as design + THE TUNING FIX): THE crucial honest port — if we lean into scarcity-grief,
  ship DIFFICULTY SLIDERS (our Difficulty Packages already exist for combat!) so hardcore players get
  the full cruelty and others get the story without bouncing off. Pathologic's post-launch sliders are
  the cautionary+corrective tale: make the punishment OPTIONAL-INTENSITY (extend our package system to
  survival/scarcity, not just the Dead-Eye dial).

## SOURCES
GameSpot + Just Adventure + GND-Tech (time-as-pressure, "can't save everyone," survival meters, the
Kin-vs-Town + protect-the-children triage, plays out differently each run); Hypercritic (the "necessity
of dying and letting die" thesis, prices skyrocket -> moral compromise, metanarrative); Medium/Justin
Fleming (time-as-resource genius, slow-onset by day 4-5, the mindmap); Game Developer + Game World
Observer (Alphyna/Ice-Pick GDC: the mindmap questlog reinvention, story-informs-interface); Dragon
Quill + Steam (the save-town-vs-save-magic finale, both reasonable, the fourth-wall non-ending, un-
100%-able, difficulty sliders added post-launch). Cross-ref Questbook 06 (survival math), 03/04 (no-
clean finale), 19/18/05 (diegetic log/knowledge), our death-math + Difficulty Packages. FUTURE: the
full Alphyna mindmap GDC transcript as an interface-design reference; Pathologic 1's dual-protagonist
structure as a perspective-design study.

---
# V2 PAYLOAD — BACKFILLED 7/17/26 (FORMAT LAW v2). Original content above untouched.

## V2-A CAST + WHAT EACH ONE WANTS

**ARTEMY BURAKH (the Haruspex)** — wants to clear his name, honor his father, heal a town, and eat today, and cannot afford all four before dark. Will trade: hours. Hours are the only currency that never inflates and never refunds. Will never say out loud: whose district he has already, silently, written off. FUNCTION: the triage officer. The player IS the shortage, walking.

**THE FATHER (dead before the game opens)** — wanted the children protected first: "they are the key to the future." Will trade: nothing; the dead trade in instructions. FUNCTION: the inherited priority. His dying wish is a standing order the player may honor or overrule, and the game never grades which.

**THE TOWN vs THE KIN** — the town wants order, medicine, and someone to blame; the Kin wants its old ways and its own blood kept. Often opposed; both right by their own arithmetic. FUNCTION: the faction triage. Backing one is unbacking the other, in medicine and in meaning.

**THE SAND PLAGUE** — wants districts, in sequence, on a schedule. Will trade: odds. Treatment raises survival PROBABILITY, never certainty (W6). FUNCTION: the antagonist as weather system. It cannot be argued with (contrast every argue-the-author file: #12, #17, #20); it can only be budgeted against.

**THE BODY (hunger, thirst, exhaustion, infection)** — wants maintenance, hourly. FUNCTION: the second clock (W4). Merely existing is a quest with a deadline, and its costs manufacture the moral compromises the story then bills you for.

**THE POLYHEDRON (the miracle)** — wants to keep standing. FUNCTION: half of the finale's scale. The other half is the town, and the beam balances on so few survivors that "winning" is a word the ending refuses to use (W8).

**THE THEATRE** — wants you to know it's a play. FUNCTION: the metanarrative frame. Miss the ending's window and the stage itself turns and berates you (W9): the form commenting on the failure the whole game is about.

## V2-B THE CONVERSATIONS (node trees; lines paraphrased, structure exact; the deepest trees here have no speaker, because the cruelest dialogues in Pathologic are with the clock)

NODE: THE_DAY_PLAN — dawn, every day, no speaker. The town's events are already scheduled; you are the only unscheduled thing in it.
  > (go where the mindmap's freshest thread points)  [gate: none] -> that thread advances; every unchosen thread ages, and some expire TODAY
  > (go earn food/water/sleep instead)               [gate: meters] -> the body paid; the story billed
  > (try to do both)                                 [gate: none] TRAP -> the halves of a day save nobody whole
  NOVERB: "Pause the town." The world runs without you (W1). The loading screens say the thesis out loud: you can't save everyone. The player's daily verb is not "solve"; it is CHOOSE WHOM TO FAIL.

NODE: INFECTED_DOOR — a plagued district, entry: someone's name on your list
  Behind the door: a person you know, feverish, and your bag with never enough in it.
  > (spend the tincture here)       [gate: has:tincture] -> the ODDS improve; the outcome stays a die roll (W6); the tincture is now not-somewhere-else
  > (diagnose, promise nothing)     [gate: none] -> honesty as the only free item in the game
  > (walk past the door)            [gate: none] SILENCE -> the door stays in the fold's memory; permanence is the game's only abundant resource
  WHAT THIS NODE COSTS: whatever the NEXT door needed. Triage is a conversation between doors (W5).

NODE: FATHERS_WISH — the memory, standing entry across all 12 days
  Protect the children first.
  > (honor it: the children's odds get your scarcest hours) [gate: none] -> a standing order obeyed; adults die of your obedience
  > (overrule it: triage by your own arithmetic)            [gate: none] -> the wish stays unhonored, and it does not haunt you, which is worse
  THE CRAFT: the inherited priority is real, stated once, and never enforced. The game trusts the player to argue with a dead man alone.

NODE: HARD_BARGAIN — a shop, prices tripled by plague-day-six, entry: empty pockets, full meters
  > (pay the gouge)                 [gate: coin] -> poorer, alive, resentful
  > [steal]                         [gate: unseen] TRAP -> the survival sim's oldest trap: the theft works, and the town you're saving now includes one more person who steals
  > (barter something a dying trade left you)  [gate: inventory] -> scarcity's economy: everything you own was recently someone's
  SCARCITY MANUFACTURES COMPROMISE (W4): the game never asks you to be worse; it just prices being good out of reach and watches.

NODE: KIN_OR_TOWN — the two claims, mid-arc
  > (back the Kin's way)            [gate: bond] -> the town's ledger suffers; the old blood holds
  > (back the Town's order)         [gate: bond] -> the Kin recedes; the future gets more modern and less itself
  > (split your hours between)      [gate: none] TRAP -> the two-masters trap, again: halves save nobody whole
  LOCKS: each day's backing forecloses meetings on the other side; the factions experience your schedule as loyalty.

NODE: TOWN_OR_MIRACLE — the finale, entry: day 12, the survivors countable on your fingers
  Destroy the Polyhedron and save the town, or let the plague take the town and keep the miracle.
  > "The town. People over wonder."      [gate: none] -> reasonable, defensible, mourned by half the players
  > "The miracle. Wonder over remnant."  [gate: none] -> reasonable, defensible, mourned by the other half
  > (refuse to choose)                    [gate: clock] TRAP -> indecision is the one option the game punishes without ambivalence: everyone loses
  NOVERB: "Save both." Twelve days of triage were the tutorial for this absence. The finale is the thesis with a lever attached (W8).

NODE: THE_NON_ENDING — the theatre, entry: the ending's window MISSED
  The stage berates the audience of one. No resolution is performed, because none was earned.
  WRITES: the fourth wall's verdict (W9). The game about failure fails you formally, in costume.

## V2-C THE BRANCH MAP

COUNT: 2 terminal states + the metanarrative non-ending, over a 12-day ledger of permanent per-name deaths (the real branching is the necrology; the finale just names its scale).

B1 — THE TOWN SAVED, THE MIRACLE DESTROYED. WRITES: the remnant lives; the wonder is rubble; the survivors are the ones your calendar chose.
B2 — THE MIRACLE KEPT, THE TOWN LOST. WRITES: the inverse, argued just as well.
B3 — THE NON-ENDING: the window missed; the theatre's contempt. WRITES: formally, nothing; that is the punishment.
THE LEDGER UNDERNEATH: every named death across 12 days, each traceable to an hour you spent elsewhere. Un-100%-able BY DESIGN; the missable content IS the theme.

THE STRUCTURAL FINDING FOR THE COMPILE: Pathologic is the master text for Bohemia's survival core, with one law and one warning. The law: TIME IS A RESOURCE TO LOSE, NOT BEAT — build our crisis arcs (plague, siege, winter, purge) so triage is the gameplay, the unsaved die permanently into the fold, treatment buys ODDS not outcomes, and the pressure CREEPS (calm day one, dire day five). The warning, non-negotiable per W10: our Difficulty Packages MUST extend to survival scarcity, not just the Dead-Eye dial — Ice-Pick shipped the cruelty unturnable and had to patch in mercy; Bohemia ships the knobs day one. And the mindmap (W7) confirms what the unrecorded ledger was already becoming alongside #18's rumor web and #19's logbook: the questlog belongs INSIDE the fiction. Three files, one interface law: THE LOG IS DIEGETIC OR IT IS WRONG. NOTE THE CONTRAST for the finale bank: this is the rare masterpiece finale that CANNOT be argued with — the plague is weather, not an author. Bohemia holds both: the Amalgamation door argues (#12/#17/#20 lineage); the winter does not (this file). Know which kind of ending each quest is building toward.

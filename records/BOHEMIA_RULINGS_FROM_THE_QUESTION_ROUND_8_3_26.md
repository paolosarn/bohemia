# BOHEMIA — THE RULINGS FROM THE QUESTION ROUND (recorded 8/3/26)

He asked for big-brain reference-lab questions. I asked twelve across three tiers
(`records/BOHEMIA_LAB_QUESTIONS_FOR_PAOLO_8_1_26.md`), he answered every one of
them plus five follow-ups, and each time he said **"Don't do anything yet I'm
still answering your questions."**

I obeyed that, and then I kept obeying it after he had finished. **That was the
mistake.** GIT IS THE MEMORY: an answer that lives only in the chat is an answer
that dies with the context window. "Don't do anything" meant don't go build —
it never meant don't write it down. These rulings sat unrecorded for two days
while I shipped other things, which is exactly how he ends up answering the same
question a fifty-first time.

So this file is the record. **Nothing here is built.** Every ruling is tagged with
the lane that owns the work and with what is still his to say.

---

## THE TIME AND REST RULINGS

**R1 — THE CAMP IS A NO-SPAWN RADIUS, THE WAY A VALHEIM WORKBENCH IS.** Its
primary mechanical job is denying the area around it to spawns. LOCKED.
*Owner: COMBAT / the camp system. Fits clause structure already in
`laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md`.*

**R2 — TIME STILL MOVES WHILE YOU REST. RESTING IS NOT A PAUSE.** LOCKED.

**R3 — ★ REST IS A VISIBLE FAST-FORWARD, NEVER A FADE TO BLACK.** He was explicit
about this and it is the strongest art/UX ruling in the whole round: you WATCH the
time pass. No cut, no black screen, no "you rest for 8 hours" text card.
LOCKED. *Owner: RUN / the surface that renders rest.*

**R4 — RANDOM EVENTS CAN INTERRUPT REST. YES.** Which is the reason R3 has to be
true: you cannot be interrupted during a fade to black. LOCKED.

**R5 — LONGER REST IS A BETTER BUFF.** Eight hours "definitely gives a better
buff" than twenty minutes. It is a curve, not a binary. **The actual numbers are
[PENDING Paolo]** — NO DIAL, NO NUMBERS.

**R6 — REST CAN BE A LITTLE SCENE.** His words on making something of the long
rest: "we could make it like a little a scene out of it." A DIRECTION, not a
spec. *Owner: RUN + ANIMATION, and it does not authorise any art while the
freeze is on.*

**R7 — SLEEPING, CHILLING AND HANGING OUT ARE ONE THING WITH ONE SET OF
BENEFITS.** Not three systems, not three buffs. One verb wearing three names.
LOCKED, and it kills a whole category of duplicate design before it starts.

**R8 — THERE IS ONE UNIVERSAL CLOCK.** Verbatim: *"There is one universal clock.
Are you stupid?"* LOCKED, and it was already canon — this is on the settled list
now so nobody asks it again.

Note on R8 against `laws/BOHEMIA_ADDENDUM_THE_ACTION_COST_SHAPE_7_31_26.md` clause
6: **there is no contradiction.** ONE CLOCK, TWO METERS. The day is the single
universal clock; the camp buff is a separate *meter* that burns on steps. Two
things being spent is not two clocks. Writing that down here because it is exactly
the kind of apparent conflict a later session would "fix" and break something.

## THE MAP AND MOVEMENT RULINGS

**R9 — FAST TRAVEL IS GATED ON HAVING WALKED THE DISTRICT.** You unlock a
destination by having been there on foot. LOCKED. *Owner: MAP / CITY plumbing.*

**R10 — ENCUMBRANCE IS A SLOWDOWN, NOT A WALL.** *"I'm pretty sure it will be a
slow down."* LOCKED — and it lands perfectly on the action-cost shape already
approved: over-weight becomes a divisor on the conversion, under the threshold it
is free. That is clause 3 and clause 5 of the action cost shape doing their job
with zero new mechanism.

**R11 — ★ RULED 8/3/26: AN HEIR DOES NOT INHERIT THE WALKED MAP. "NO THEN".**
He asked me this one on 8/1, I recommended no, and he ruled **no** on 8/3. LOCKED.

The reasoning that stands behind it: an heir inheriting a fully-revealed valley
deletes the best thing about R9 for two thirds of the game — if fast travel is
unlocked by having walked somewhere, then handing a new generation the whole map
means nobody ever walks again. What the heir gets instead is the **family's**
places: the house, the camp sites, whatever the city has actually been built into.
Everything else is dark again and has to be walked.

Which is the good version anyway, because it makes the second and third generations
feel like *going back out* rather than resuming a save. Rerolling the map's darkness
is the mechanism that makes R24 (gear at the family house) and R22 (the city
remembers) land as inheritance instead of as a menu.

*Owner: MAP / CITY plumbing, same as R9. Nothing built.*

## THE DIALOGUE AND QUEST RULINGS

**R12 — ★ NO SAVE SCUMMING. CHECKS ARE BINARY: YOU CAN OR YOU CANNOT.** He is not
a fan of save scumming, and his reasoning is the good kind — a percentage check
*invites* the player to reload until it passes. So no dice roll on a social
check. LOCKED, and it is a hard structural ban.

**R13 — THE GATE ON A CHECK DOES NOT HAVE TO BE CHARISMA. IT CAN BE FACTION.**
Standing with a group is as legitimate a key as a personal stat. LOCKED as a
permission; the actual keys are content and therefore his.

**R14 — MAIN QUESTS CANNOT BE REFUSED.** LOCKED.

**R15 — SIDE QUESTS OFFER VARIATIONS INSTEAD OF REJECTION.** You do not turn one
down; you choose a different way through it. LOCKED. *Owner: QUESTS, and note it
must be built under QUEST STUDY LAW with real corpus citations.*

**R16 — YOU CLEAR A QUEST OFF THE PHONE.** The phone is where you exit out of a
quest to get it out of your list. LOCKED. *Owner: RUN / the phone UI.*

## THE CONSEQUENCE AND MEMORY RULINGS

**R17 — ★ RECORD EVERYTHING SILENTLY.** On mercy versus brutality: *"I think it's
definitely something to record and then we can do what we want with the
information."* So the ruling is a LEDGER, not a score: log the acts, do not show
the player a morality bar, decide later what reads it. LOCKED, and it is the
cleanest instruction in the round because it separates the plumbing (ours, now)
from the meaning (his, later).

**R18 — SPARING SOMEBODY AFTER YOU ALREADY SHOT THEM IS NOT THE SAME ACT AS
SPARING SOMEBODY WITH THEIR HANDS UP.** Two different entries in the ledger, and
the game should know the difference. LOCKED.

**R19 — NPCS COMMENT ON HOW YOU PLAY.** Mercy and hardcore both get remarked on.
LOCKED. *Owner: LIFE / whichever lane owns NPC talk.*

**R20 — WITNESSES AND VISIBLE ACTIONS NEED PLUMBING ON ALL NPCS.** His words:
*"looks like you oughta do some plumbing coating for witnesses and visible actions
tied to all NPC's."* Every NPC can witness; witnessing is a general capability,
not a special case for guards. LOCKED, and it is an explicit instruction to build
the plumbing.

**R21 — ★ STORIES SPREAD LIKE A PLAGUE.** The biggest idea in the round. Witnessed
acts propagate through the population like a virus, some spreading more easily
than others, in **different degrees of story**, and **NPCs have memory** — so what
is being modelled is the memory of the population, not a reputation number.
He also asked for research on how other games have done this.
**LOCKED as a direction. The mechanism is unbuilt and the spread rates are
[PENDING Paolo].**

This is the one that connects everything else: R17's ledger is what feeds it, R18
is the granularity it needs, R19 is how the player hears it, R20 is the sensor
layer, and Fallout: New Vegas's two-counter reputation
(`slices/lab/BOHEMIA_LAB_TEN_YEARS_COLD_7_31_26.html` — fame and infamy never
cancel) and RDR2's witness system (`records/BOHEMIA_RESEARCH_RDR2_8_1_26.md` —
two bits, a witness must physically travel to report, a bandana breaks ID) are
both already studied and both feed straight into it.

**THE RESEARCH HE ASKED FOR IS DONE, SAME TURN THIS FILE LANDED:**
`records/BOHEMIA_RESEARCH_STORIES_SPREAD_8_3_26.md`. Headline: **Dwarf Fortress
already built this, and its key move is that a rumour is an OBJECT, not a number** —
created by a witness, carried by whoever holds it, spread by anyone who heard it,
diffused at the moment the district unloads, and indexed by IDENTITY rather than by
person. Skyrim is the anti-reference and it fails for one reason: a meter cannot
remember who was in the room.

## THE DYNASTY RULINGS

**R22 — CHOICES MATTER TO THE CITY, AND CITY / FACTION / MAYOR CHOICES LINGER
ACROSS GENERATIONS.** LOCKED.

**R23 — NPCS MENTION YOUR FATHER.** LOCKED.

**R24 — ★ GEAR STORED AT THE FAMILY HOUSE CARRIES ACROSS GENERATIONS.** The family
house is the inheritance mechanism, and it is a *place*, not a menu. LOCKED, and
it is a beautiful piece of design: storing something becomes an act of leaving it
to your kid.

**R25 — NO INHERITED PERKS. A BOOSTED START INSTEAD.** Explicitly *not* individual
perks — "maybe a boosted start." LOCKED as a shape; what the boost is, is
[PENDING Paolo].

**R26 — THE CAMP IS UPGRADEABLE ACROSS ACTS.** You could be in act 3 still running
an act-1 camp. LOCKED — and note this quietly answers an older open question, "how
does neglect bite if there is no upkeep": **it does not bite, you just still have
the shitty camp.** Under
`laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md` that is exactly right —
falling behind is a *state you are still in*, never a bill you failed to pay.

**R27 — MAYBE ONE OLD ROBOT COMPANION.** Recorded as a MAYBE, not a ruling. His
word was "maybe" and it stays "maybe."

**R28 — ★ THE SOURCE OF ALL OF IT IS REALISM.** His stated basis for the whole
dynasty layer: *what realistically happens like 40 years after.* This is the test
to apply to every dynasty proposal from here on — not "is it fun", but "is that
what would actually happen." LOCKED as the standard.

## THE REFERENCE RULINGS

**R29 — HE NAMED ROGUE FABLE AS SOMETHING TO ATTEMPT IN A SESSION.** Recorded as
what he said. **NOTE, and this is important: the Rogue Fable IV direction I
subsequently took was KILLED on 8/1** ("The answer is no I don't like the
direction that you took this turn",
`records/BOHEMIA_RF4_DIRECTION_KILL_8_1_26.md`). So R29 is NOT live permission to
try it again. GRAVEYARD IS FINAL. The transcription here was garbled and I am not
going to guess what a garbled word meant — if he wants it revisited he will say
so.

**R30 — "LET'S LOOK INTO IT."** Approval to research one of the references I
raised. Open LAB item. The subject was a dynasty/legacy roguelite; the
transcription does not pin down which title with certainty, so the research will
cover the legacy-roguelite family rather than assert a name he did not clearly
say.

## HIS STANDING GOAL, IN HIS WORDS

> "I want to. To be a multimillionaire off this game so"

Recorded verbatim because it is the bar every one of these rulings is being held
to, and because R21 is the ruling he said it about.

---

## WHAT IS STILL HIS

- R5's rest numbers. R13's actual check keys.
  (**R11 came off this list on 8/3 — he ruled it. "NO THEN".**)
- R21's spread rates, degrees of story, and how long an NPC remembers.
- R25's boost.
- R27 — whether the robot companion exists at all.
- Every number in all of it. NO DAMAGE BEFORE THE DIAL, and no dial means no
  numbers anywhere else either.

## HOW THIS IS ENFORCED

Two ways, and neither is a promise to remember:

1. **The settled rows.** Every LOCKED ruling above that could plausibly be asked
   again is now a trigger row in `records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md`,
   swept by `gates/answered_gate.py`. Ask him one of these again and the build
   goes red.
2. **`gates/rulings_gate.js`**, registered as RULINGS. It holds this file intact,
   keeps the pendings pending, and sweeps every shipped surface for the two
   rulings that are STRUCTURAL BANS rather than tastes: **no percentage-based
   social check** (R12) and **no morality score shown to the player** (R17). Those
   are the two a lane could break by accident while believing it was helping.

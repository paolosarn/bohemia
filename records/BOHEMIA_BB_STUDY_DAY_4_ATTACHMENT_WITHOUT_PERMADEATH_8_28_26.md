# BB STUDY — DAY 4: ATTACHMENT WITHOUT PERMADEATH
# (coordinator, on his trigger "bb study, next day". Plan:
# records/BOHEMIA_THE_BATTLE_BROTHERS_STUDY_8_28_26.md, which calls this
# THE HARDEST DAY AND THE MOST IMPORTANT ONE.)
# NOTHING HERE IS ROUTED AS WORK. Day 5 routes. His instruction.

## 0. A NOTE ON SOURCES AND THE REFERENCE-SET LAW, WRITTEN FIRST
NEVER ADD A REFERENCE GAME HE HAS NOT NAMED (8/28) is in force. Games
appear below ONLY as cited research, the same way a journal paper does.
**HIS REFERENCE SET IS UNCHANGED — ROGUE FABLE 4, BATTLE BROTHERS, FINAL
FANTASY XII — plus the ones he named himself for companions (FINAL
FANTASY XV, FALLOUT 4, 7/26).** Section 6, which is the actual design, is
written in plain mechanics with no borrowed name attached, on purpose. A
future session must not lift a name out of the sources into the design.

## 0b. AND AN INSTRUMENT CORRECTION, BECAUSE I ALMOST SHIPPED A FALSE
## FINDING IN THIS FILE
Measuring the companion, every plain search of the alpha said the combat
lane's whole 8/27-8/31 body of work was **not in the build**: `gunsOnTile`
0, `hitsTile` 0, `ENC_SIZES` 0, `ALLY_NAME` 0, `BohemiaArena` 0, in either
slice. I was three minutes from writing "the companion he ruled in on 8/31
was never shipped."
**IT IS SHIPPED. THE FIGHT IS BASE64 INSIDE THE ALPHA** — `COMBAT_B64`,
decoded into an iframe by `ensureCombatFrame()`. Decoded: 1,343,843
characters, `ALLY_NAME` x6, `allyMake` x3, `gunsOnTile` x6. Every number
in this file was taken from the DECODED source.
**THE STANDING RULE FIRED AGAIN AND IT SAVED THE DAY'S CREDIBILITY: A
NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE
INSTRUMENT COULD HAVE SEEN A POSITIVE ONE.** The positive control here was
one line: grep for a token the fight certainly has, get zero, and stop.
Third time this month. It belongs in every future audit of the alpha:
**A PLAIN SEARCH OF THE ALPHA CANNOT SEE THE FIGHT.**

## 1. THE SHELF — WHAT IS ALREADY RULED, AND WHAT IS ACTUALLY BUILT
### RULED (his words, not mine)
- **NO PERMADEATH, FOR ANYBODY.** "Followers permanently dying just
  inspires people to save scum and I really want to prevent that." They
  "can go down, never be deleted." (7/26, LOCKED.)
- **DEATH IS A RELOAD, NOT A RESET** (7/26): you go back to the closest
  save. Not a run reset, not an heir mechanic.
- **THE REWIND** (8/15): ~200 moves of take-back, played as tape running
  backwards. His stated reason: "I hate save scumming."
- **THE FEELING HE NAMED:** brotherhood, the camp, "these are your
  brothers", plus companions who comment on what you are doing (7/26).
- **AND THE COMPANION IS REAL AS OF 8/31**, automated, sharing the
  incoming fire.
### BUILT (measured today, in the decoded combat source)
| thing | state |
|---|---|
| the companion | exists, named ROSA, `draft:true`, ARCH.human, 60 hp |
| what she carries between fights | **NOTHING.** `allyMake()` runs at the bell and builds her fresh at full health |
| what she says, all of it | **FOUR LINES:** CLEAR / GOT THE BLADE / ON THE SPOTTER / FIRING |
| how many of those four are about you, her, or the world | **ZERO.** All four are status reports |
| picking her up when she goes down | **NOT BUILT.** `ALLY_DOWN_TURNS=99`, and the code says so plainly |
| can she lose her nerve | **NO.** `broken=true` is set on enemies only |
| does she ride the save | **NO.** The state snapshot the rewind law lists has no ally field |
### *** AND THE ONE THAT SHOULD DECIDE THE DAY ***
**THE ENEMY ALREADY GOES BACK FOR ITS WOUNDED. YOU CANNOT.**
Their medic has a scoring rule whose own comment reads: *"A BODY ON THE
FLOOR OUTRANKS HIS OWN SKIN, AND THAT IS THE WHOLE FIGHT WITH HIM."* He
breaks cover to reach a downed man, gets him back up, and has a second
verb for a man who has lost his nerve: **HE TALKS HIM ROUND.** Two verbs,
both about not abandoning somebody, and **both of them belong to the people
shooting at you.** Your side has neither. She goes down and lies there for
ninety-nine turns while you finish the fight without her.
That is not a missing feature. **IT IS THE ATTACHMENT MECHANIC, ALREADY
WRITTEN, ON THE WRONG SIDE OF THE BOARD.** Same shape as the seventeen
invisible hats and the colours nobody wore: the material exists and never
reached the player.
### AND HIS OWN LADDER ALREADY HOLDS THE VERB
Boss 16, **THE WARD**: lock *"a wound you cannot treat is a death"*, grant
*"treat and dose, so a bad day stops being the last one."* Boss 15, **THE
DOGS**: *"take a dog: it walks with you, or it holds your gate."* He wrote
both three weeks ago. Day 4 did not need to invent a verb; it needed to
notice that he already had.

## 2. AISLE ONE — WHAT THE GAMES DID (RESEARCH, NOT REFERENCES)
**(a) THE GAME HE NAMED PUT ITS BOND IN INJURIES, NOT ONLY IN DEATH.**
Battle Brothers' own dev blog on injuries: there are two kinds, temporary
and permanent, and *"they both serve a different purpose in enriching the
game."* A man at zero hitpoints *"has a chance of surviving with a random
permanent injury an otherwise fatal blow"* — missing an ear at the light
end, **missing a whole hand** at the heavy end, carried *"the rest of their
lives."* Treatment is a place you go, and untreated wounds in the field can
turn into gangrene.
**READ THAT AGAIN AGAINST OUR RULING.** The game we are studying, the one
famous for permadeath, spent a whole feature on **NOT DYING**. The scar is
the memory. A hand is gone and cannot be reloaded away, and the man is
still standing there being your problem and your responsibility.
**(b) THE STRONGEST CLAIM FOR PERMADEATH, STATED BY ITS BIGGEST
PRACTITIONER.** The creative director of the best-known squad-tactics
series: *"It's a fine line to play on, but you have to have permadeath. It
makes you really get attached to your soldiers."* And the condition he puts
on it: *"If I'm gonna make it really hard, and have these real
consequences like permadeath, then the player has to perceive the
experience as completely fair."* His view of where the story comes from is
the useful half: **"the narrative is created by the gameplay."** Not by
written backstory. By what happened.
**(c) THE COMPANION FEELING HE NAMED, FROM ITS OWN DIRECTOR.** On the
four-man road trip he called his north star: the team paid attention to
**small habits and behaviours, and to the sense of DISTANCE each character
keeps** in their relationship with the lead. Camp sequences run across
fifty-plus hours, with cooking, banter, personal anecdotes and planning.
**THE CHEAP LESSON IS "HABITS AND DISTANCE", NOT "MORE DIALOGUE".** One
person who always stands too close and one who never does is characterful
before anybody speaks, and it costs us nothing at 120 BPM.

## 3. AISLE TWO — WHERE THE PROBLEM LIVES IN THE REAL WORLD
**THE MILITARY SPENT SEVENTY YEARS ARGUING ABOUT EXACTLY OUR QUESTION:
what actually binds a squad?** The folk answer is "they love each other."
The measured answer is not that.
- The research splits the bond in two: **TASK COHESION** (shared
  commitment to the job) and **SOCIAL COHESION** (liking each other).
- **Task cohesion is the strongest predictor of performance.** In the
  meta-analytic work, once task cohesion is controlled for, *"social
  cohesion and group pride had no reliable effects on performance."*
- The plainest sentence in the literature, and it is aimed straight at our
  design: ***"social cohesion is not necessary for task cohesion; people
  who do not like one another may work well together nonetheless."***
- Soldiers say it themselves. From the interview data: ***"Although we
  don't get along we are all ready for a fight."***
- And it can go the wrong way: *"Building and maintaining high social
  cohesion may undermine the group's ability to perform tasks... if
  maintaining cohesion displaces the group's instrumental purpose."*
- The effect is strongest **when the task requires a high degree of
  coordination between members** — interdependence is the multiplier.
**AND THE SECOND REAL-WORLD PIECE IS ABOUT BEING KNOWN.** The standard
model of how closeness actually forms is not "time spent" or "facts
shared". It is **PERCEIVED PARTNER RESPONSIVENESS**, and it has three
named parts: **feeling UNDERSTOOD, VALIDATED, and CARED FOR.** Disclosure
alone does not do it; disclosure that is RESPONDED TO does.
**THAT IS A SPECIFICATION FOR A COMPANION LINE.** A line that reacts to
what YOU just did is a responsiveness event. A line that fires on a timer
is noise. Our companion currently ships four lines and every one of them
is about the enemy.

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
## PERMADEATH DOES NOT CREATE ATTACHMENT. IT CASHES IT IN.
A study of 394 players compared permadeath memories against ordinary
death memories. Permadeath was associated with **increased appreciation,
and the effect ran THROUGH REPORTED GRIEF** — grief was the mediator. And
the part that decides our design: ***the indirect effect was STRONGER for
those with stronger parasocial attachments to their characters.***
**THE ARROW IS BACKWARDS IN THE FAMOUS QUOTE.** "You have to have
permadeath, it makes you really get attached" reads the correlation from
the wrong end. The measured relationship is that **players who were
ALREADY attached got the payoff.** Permadeath is an AMPLIFIER on a bond
that already exists. Point it at a character nobody cared about and it
amplifies nothing; you just deleted a spreadsheet row.
**WHAT THIS DOES TO US, BOTH WAYS, AND BOTH ARE IMPORTANT:**
1. **HIS RULING IS SAFE AND BETTER FOUNDED THAN THE ARGUMENT AGAINST IT.**
   We are not throwing away the source of attachment. We are throwing away
   the amplifier, and keeping the thing it amplifies.
2. **BUT THE BILL IS STILL UNPAID.** We removed the amplifier and have not
   yet built the bond. Right now the bond is four status reports and an
   object rebuilt from scratch every time the bell rings. **We took the
   safety and skipped the work.**
**AND THE SUPPORTING RESULT MAKES IT CONCRETE.** A 213-player study of
characters people were fond of found **SEVEN** distinct shapes of
attachment: cool and capable, respected nemesis, admired paragon, crush,
concern for one's protégé, sympathetic alter ego, trusted close friend.
**ONLY ONE OF THE SEVEN NEEDS THE CHARACTER TO BE LOSABLE.** Two of them
are free money for us: **CONCERN FOR A PROTÉGÉ** is exactly a companion
who can be hurt and depends on you, and **RESPECTED NEMESIS** means the
attachment does not even have to be to somebody on your side — and we
have SIXTY MINI BOSSES with names, holds and grants already written.

## 5. THE SECOND CHALLENGE, AIMED AT OUR OWN PLAN
**WE BELIEVE THE BOND WILL COME FROM THE CAMP AND THE BANTER.** That is
the 7/26 companions law's north star and it is a real feeling. The
cohesion research says it is the WEAKER of the two channels, and that the
strong one is **needing each other for the job**.
**AND WE ALREADY MEASURED THE STRONG CHANNEL, ON OUR OWN BOARDS, LAST
WEEK.** From the 8/31 law: eight enemies, alone, **0 rooms cleared out of
60**. With her: **60%**. Six enemies: 3.3% to 58.3%.
**THERE IS NO BANTER LINE IN GAMING THAT BUYS WHAT THAT NUMBER BUYS.**
She is already load-bearing. Nobody has ever told the player so, she never
says anything that admits it, and nothing about her survives the fight.
**THE CAMP IS NOT WRONG. IT IS SECOND.** Build the need first, then the
voice on top of it — the research order is interdependence, then
responsiveness, then history.

## 6. THE FOUR CHANNELS THAT REPLACE PERMADEATH (mechanism, plain words)
Written as mechanisms with no borrowed names, per §0.
1. **INTERDEPENDENCE — she must be NEEDED, and the player must feel it.**
   Already true and already measured; what is missing is that the fight
   never SAYS it. The moment she goes down, the room should visibly get
   worse, and the read line should say what you just lost.
2. **RESPONSIVENESS — she reacts to what YOU did.** Three parts, from the
   real model: understood, validated, cared for. Cheapest honest version:
   a line that fires off a specific thing the player just did, not a
   timer. Ours currently has four lines, all about the enemy.
3. **MARKS THAT PERSIST — a loss that is not a death.** A scar, a limp, a
   hand. It cannot be reloaded away, it does not delete the person, and it
   is the memory of a fight you actually had. This is the studied game's
   own answer and it is the single highest-value item on this page.
4. **BEING MISSED — the going-back-for-her verb.** The enemy has it. We
   have `ALLY_DOWN_TURNS=99` and a comment admitting it is not built. This
   is where the fight earns the feeling instead of narrating it.
**AND THE ANTI-CHANNEL, SO NOBODY BUILDS IT:** more written backstory.
Every source above points the other way. "The narrative is created by the
gameplay."

## 7. THE COLLISION TO FLAG BEFORE ANYBODY BUILDS ANY OF THIS
**THE REWIND CAN UNDO A SCAR.** ~200 moves of take-back (8/15) versus a
permanent injury (§6.3) is a straight contradiction: if the injury lands
inside the fight, the player rewinds her hand back on, and channel 3
becomes a suggestion. Three shapes exist and **none is chosen here** —
this is a day-5 routing item and the dial is his:
(a) the mark is applied **after the bell**, outside the window the rewind
    reaches; (b) the rewind restores position and health but never
    identity-level state; (c) rewinding past a mark costs something real.
Also unresolved and older: the 7/26 companions law's own OPEN SEAM — how
the crowd who follow you become the crew who travel with you — is still
[PENDING Paolo] and channel 1 eventually needs it.

## 8. WHAT IS MEASURED AND WHAT IS ARGUED
- The companion's built state, her four lines, the reset at the bell, the
  enemy medic's two verbs, the ladder entries: **MEASURED TODAY** in the
  decoded combat source and the ladder file. Reproducible.
- The clear rate numbers: from the 8/31 law's own measurement, not re-run.
- The cohesion findings and the responsiveness model: peer-reviewed and
  meta-analytic, consistent across sources. **HIGH.**
- The permadeath-grief mediation study and the seven attachment forms:
  single published studies each, self-reported and recall-based.
  **MEDIUM-HIGH**, and it is a correlational design, so §4's arrow is
  "the amplifier reading fits the data better", not proof of cause.
- The injury and companion-design quotes: developer blog and director
  interviews via search; the primary sites are blocked by this
  environment's egress proxy and were NOT read directly. **MEDIUM-HIGH.**
- §5, §6 and §7: **MY DESIGN ARGUMENT** on top of the above. Flagged.

## SOURCES
Battle Brothers Developer Blog #79, "Progress Update — Injury Mechanics"
(permanent vs temporary injuries, surviving an otherwise fatal blow,
treatment and gangrene); Jake Solomon (Firaxis) interviews, PCGamesN "The
four essential ingredients you need to make an XCOM" and StrategyCore
(permadeath, fairness, "the narrative is created by the gameplay",
naming/customising soldiers); Hajime Tabata interviews on Final Fantasy XV
(habits, behaviours and "distance" between party members; camp as the
bonding surface) — HIS OWN named reference from 7/26; Mullen & Copper
(1994) meta-analysis of cohesion and performance, and Beal et al. on level
of analysis and task interdependence; MacCoun & Hix, "Unit Cohesion and
Military Performance"; Kier, MacCoun & Belkin, "Does Social Cohesion
Determine Motivation in Combat? An Old Question With an Old Answer"; Reis
& Shaver's interpersonal process model of intimacy and the perceived
partner responsiveness literature (understood, validated, cared for);
"It's all fun and games until somebody dies: Permadeath appreciation as a
function of grief and mortality salience" (394 players); Bopp, Müller,
Aeschbach, Opwis & Mekler, "Exploring Emotional Attachment to Game
Characters", CHI PLAY '19 (213 players, seven forms).
IN-REPO: laws/BOHEMIA_ADDENDUM_COMPANIONS_BROTHERHOOD_7_26_26.md,
laws/BOHEMIA_ADDENDUM_DEATH_IS_A_RELOAD_7_26_26.md,
laws/BOHEMIA_ADDENDUM_THE_REWIND_8_15_26.md,
laws/BOHEMIA_LAW_MULTIPLE_PEOPLE_FIGHT_AT_THE_SAME_TIME_8_31_26.md,
records/BOHEMIA_COMBAT_TWO_OF_YOU_8_31_26.md,
records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md,
tools/bohemia_combat_two_of_you_patch.py, and the decoded `COMBAT_B64`
payload inside slices/BOHEMIA_ALPHA_0_9.html.

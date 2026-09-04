# BB STUDY — DAY 12: A FIGHT ENDS WHEN SOMEBODY DECIDES TO LEAVE
# (coordinator, on his trigger. Days 1-11: records/BOHEMIA_BB_STUDY_DAY_*.md)
# THE SUBJECT: MORALE AND THE ROUT. It is his own acceptance test.

## 0. THE QUESTION, AND IT IS HIS
> "every time it's ONE FUCKING BATTLE, it's not a 40 MINUTE LONG CHESS
> MATCH."
Eleven days have asked what a fight is made of. **NOBODY HAS ASKED WHAT
MAKES ONE END.** If the only way a fight can finish is that every body on
one side is on the floor, then the fight is exactly as long as the enemy
count, forever, and no amount of pacing work will fix it.

## 1. BB'S ANSWER: MORALE IS THE PACING SYSTEM, NOT A FLAVOUR STAT
Six states, and each one is a described mental condition rather than a
number:
- **CONFIDENT (+1)** — sure their side will win and they will live.
  Bonuses to hitting and to defence.
- **STEADY (0)** — prepared. No effect.
- **WAVERING (-1)** — *"something unsettling about how the combat is
  developing"*, and it makes the NEXT check worse too.
- **BREAKING (-2)** — *"almost sure the fight is lost... but still
  hanging on."*
- **FLEEING** — runs from enemies, **cannot fight or use skills**, drops
  its stances, and is instantly moved to the end of the turn order.
And it is steerable: **RALLY THE TROOPS** raises the success chance on a
Wavering or Breaking man.
**THE POINT: MORALE IS WHAT MAKES A FIGHT SHORTER THAN ITS BODY COUNT.**
The side that is losing stops being a side before it stops being alive.

## 2. THE OTHER AISLE — AND IT IS HARDER THAN THE GAME
Real pre-modern battle is not two lines grinding each other to zero. It is
one line deciding to leave.
- **The winners rarely suffered more than 5% fatalities**, even in long
  engagements.
- **The losers averaged 10-15%** — and **much of that was inflicted
  during the ROUT AND PURSUIT**, not during the fighting.
- The pursuit was a job of its own: light, fast troops chasing a broken
  force, sometimes into the next day, turning a defeat into a dissolution.
**SO THE DECISIVE MOMENT OF A BATTLE IS A DECISION TO LEAVE, AND THE
KILLING HAPPENS AFTER IT.** Winning is cheap. Losing is expensive. And the
gap between those two numbers is entirely made of what happens once
somebody breaks.
**THAT IS A FIGHT SHAPE, NOT A FACT:** short, decided by nerve, and with
the real drama sitting in what the winner chooses to do next.

## 3. THE SHELF, MEASURED, AND IT IS THE BEST-BUILT THING I HAVE FOUND
## ALL STUDY — WHICH MAKES §3(b) WORSE
### (a) THE NERVE SYSTEM IS REAL, GROUNDED, AND HIS
In the decoded fight: once **half** the enemy are down, every turn each
standing man rolls to break, at `0.10 + 0.05 per body past half`, and
**elites break at half that chance**. If he is not the last man he
**PANICS AND RUNS** — one tile a turn, straight out along his own bearing.
If he IS the last man he **puts his hands up**. The comment says whose
rule that is:
> *"LAST-MAN-ONLY SURRENDER (Paolo, ruled): nobody surrenders while his
> people are still shooting — he either holds or FLEES."*
The break lands **on the beat**. And the fight ends *"the instant nobody
can fight — nerve breaks and downings included"*, so a break really does
end the fight early. **This is a good system and it is already written.**
### (b) *** AND IT IS SWITCHED OFF. ***
```
const FEAR_ON=false;  /* [DIAL] until the perk exists, nothing switches
                         this on -- which is the ruling */
function theyFearYou(){ if(FEAR_ON)return true;
  try{ return !!(G.perks&&G.perks.fear); }catch(_e){ return false; } }
```
The perk now exists — THEY KNOW YOU, the EYE branch, level 2, *"men break
and run from you now"* — so it is reachable. **BUT BY DEFAULT, AND IN
EVERY FIGHT BEFORE HE BUYS IT, NOBODY EVER BREAKS.** Every fight is to the
last man.
**THE MECHANIC THAT ENDS FIGHTS EARLY IS OFF, AND IT IS SOLD AS AN
UPGRADE.** His acceptance test is that a fight not be a forty-minute chess
match, and the answer to it is behind a level-2 perk.
### (c) A MAN WHO BREAKS IS A DESPAWN
A fleeing man runs one tile a turn, straight away, out to a distance of
30, and that is the end of him. **No pursuit. No decision. No body, so no
loot and no XP (day 10).** The single most decisive event in a real
battle currently produces nothing at all.
### (d) AND THE PLAYER CANNOT LEAVE
There is an abort path, and its trigger is `BOHEMIA_ENCOUNTER_ABORT`,
commented *"the quest pulls you out."* **There is no withdraw.**
POSITIVE CONTROL, because this study has been burned by instruments
twice: I found a RUN button and checked what it does before claiming
anything — `doRun()` arms a movement mode *("tap a direction — you go
that way, as far as it is clear")*. It moves you inside the arena. It does
not leave.
**SO: THEY CANNOT BREAK UNLESS YOU BOUGHT A PERK, AND YOU CANNOT BREAK AT
ALL.** Losing costs you the last twenty minutes and nothing else, because
death is a reload (7/26).

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
**WE HAVE BEEN TREATING MORALE AS FLAVOUR — a scary perk, a nice read-out
line. IT IS THE PACING SYSTEM.** It is the only mechanism in the build
that can end a fight before the body count does, and his single loudest
design requirement is about how long a fight takes.
**AND THE HISTORY MAKES IT BIGGER THAN PACING: IT IS ALSO WHERE THE DRAMA
IS.** If winners lose 5% and losers lose 10-15% mostly in the pursuit,
then the interesting question in our fight is not "can I kill all eight."
It is **"they are running — do I chase?"**
That question is free content and it lands on rulings we already have:
- **CHASING IS WHERE THE MATERIAL IS.** Day 10: loot is on bodies, and a
  man who runs off the edge takes his with him. Pursuit has a real payoff.
- **NOT CHASING IS A CHARACTER STATEMENT.** Day 1's second axis is what
  you are KNOWN TO DO, kept separate from who likes you. Letting a broken
  man go is the cheapest, truest input that axis will ever get, and the
  survivor is the one who tells people.
- **AND HE ALREADY RULED THE HARDEST PART.** Last-man-only surrender is
  his. Sparing is already in the payload (`spared` is a real outcome).
  **The mercy verb exists; the moment that would make it mean something is
  the one that is switched off.**
**THE SECOND CHALLENGE, AIMED AT US:** we built a game where the only way
a fight can end is everyone on one side being on the floor — the exact
shape he said he did not want — and **the fix for the default case is a
`const`.**

## 5. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** morale as the thing that ends fights, on by default; a break
that is a per-man decision driven by what is happening, not a global
timer; the last man putting his hands up, which is already his ruling;
a rout that is a MOMENT — pursue or let them go — rather than a despawn;
and the asymmetry that winning is cheap and losing is expensive.
**REFUSE:** morale as a purchasable feature; a fight that can only end by
attrition; a pursuit that is automatic, because the whole value is that it
is a CHOICE; and any morale number set by us — the states are words, and
what the dials are is his.

## 6. ROUTED
- **COMBAT — BB-NERVE-ON.** `FEAR_ON` flips to true. Morale is default
  behaviour, not an upgrade. The perk stays and does something BETTER
  (they break sooner, or they break at the sight of you) rather than
  being the thing that makes breaking exist at all. Its own comment says
  the gate was written "until the perk exists" — **the perk exists.**
  This is the smallest row in the study that touches his loudest
  requirement.
- **COMBAT — BB-THE-ROUT.** A man who breaks is a decision, not a
  despawn. He runs, and you choose: go after him, or let him go. Pursuit
  is where the material is (day 10); letting him go is the cleanest input
  the "what you are known to do" axis will ever have (day 1), and the man
  who lives is the one who tells people. Sparing already exists in the
  outcome payload.
- **COMBAT / RUN — BB-YOU-CAN-LEAVE.** The player can withdraw. Right now
  a loss costs the last twenty minutes and nothing else, because death is
  a reload. A withdrawal that costs something real — ground, standing,
  what you dropped — is a better loss than a reload, and it is the only
  way a fight can be lost without being replayed.
**RUNNING ORDER:** behind the demo like everything else, EXCEPT
BB-NERVE-ON, which is a one-line default change against his loudest
stated requirement and should be measured the moment somebody touches
combat. It also composes with the two rows already jumping the queue: guns
bad in close makes men close, and a man who is closed on is a man who
breaks.

## 7. CONFIDENCE
- The nerve formula, the elite halving, last-man-only surrender, the beat
  timing, `FEAR_ON=false`, the fleeing behaviour, and the abort trigger:
  **MEASURED** in the decoded combat payload, with the RUN-button positive
  control stated.
- BB's six morale states, their described effects, Rally the Troops, and
  fleeing units losing their stances and going last: wiki and the
  developers' own dev blog #20 as reported. The blog is proxy-blocked here
  and was NOT read directly. **MEDIUM-HIGH.**
- The casualty asymmetry (winners under ~5%, losers 10-15%, much of it in
  the rout and pursuit) and the role of light troops in pursuit: standard
  military-history scholarship, consistent across sources. **HIGH** as a
  pattern; exact figures vary by period and battle and I have quoted them
  as ranges, not as constants.
- §4, §5 and §6: **MY ARGUMENT AND MY ROUTING.** That morale is the
  pacing system is a reading of his own acceptance test against our own
  code; the dials are his.

## SOURCES
Battle Brothers wiki (Morale, Combat Mechanics) and dev blog #20 on
bravery and morale as reported, for the six states, their effects, Rally
the Troops, and what happens to a fleeing unit. Scholarship on pre-modern
battle casualties and routs — the winners' low fatality rates, the
losers' 10-15% averages, and the concentration of deaths in the pursuit
rather than the melee. IN-REPO: the decoded `COMBAT_B64` payload inside
slices/BOHEMIA_ALPHA_0_9.html (the V35 nerve block, `theyFearYou`,
`FEAR_ON`, the fleeing step, `doRun`, `BOHEMIA_ENCOUNTER_ABORT`, the
`spared` outcome, the V188 tree's THEY KNOW YOU perk),
laws/BOHEMIA_ADDENDUM_DEATH_IS_A_RELOAD_7_26_26.md,
laws/BOHEMIA_ADDENDUM_YOU_ARE_THE_LEAD_8_28_26.md (the acceptance test),
and days 1-11 of this study.

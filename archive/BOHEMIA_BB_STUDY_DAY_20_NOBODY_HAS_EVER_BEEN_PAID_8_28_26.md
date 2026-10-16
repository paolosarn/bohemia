# BB STUDY -- DAY 20: WHAT A JOB IS ONCE YOU TAKE IT
# (coordinator, on his trigger. Days 1-19: records/BOHEMIA_BB_STUDY_DAY_*.md)
# DAY 1 ASKED WHAT WORK EXISTS. NOBODY ASKED WHAT A JOB *IS*.

## 0. THE QUESTION
Day 1 studied the OFFER -- what work exists, who offers it, what gates it.
Nineteen days later nobody has asked the next question: **once you say
yes, what have you actually agreed to?** Does it pay? Does it have a
clock? Can you walk away? Can the person who hired you be lying?

## 1. THE MEASUREMENT -- 687 THINGS A JOB CAN DO, AND NONE OF THEM IS PAY
Every `@DO` call in all 27 playable canon quests, counted:
```
203 set_stage        82 faction          17 faction_posture
110 complete_objective 58 bond           10 advance_territory
 93 learn             51 show_objective   9 cast
                      50 set_flag         4 play
```
**687 calls. `@DO pay` appears ZERO times.**
- The verb EXISTS: `case 'pay': s.reward[p[1]] += num(p[2])`, in the .bq
  language, built 8/11 on **his own ruling** -- asked what a day's work
  should pay he said *"Whatever currency the quest decides to give"*,
  which put the reward on the job instead of in a global table.
- **NOBODY HAS EVER WRITTEN ONE.** Not one of 27 quests declares a
  reward.
### AND THE REST OF THE CONTRACT IS ALSO NOT THERE
Measured across the language AND the corpus: `@DEADLINE`, `@EXPIRE`,
`@DAYS`, `@PAY`, `@REWARD`, `@TIMER` -- **zero, in both.** Zero hits for
haggle, negotiate-a-fee, counter-offer, advance or retainer.
**A JOB IN BOHEMIA HAS NO PRICE, NO CLOCK AND NO TERMS.** You are told
what somebody needs, you do it or you do not, and nothing comes back.

## 2. *** AND THE PIPE IS NOT MISSING. IT IS BUILT, WIRED, GATED, CALLED
## ON THE REAL SURFACE -- AND EMPTY. ***
This is the opposite shape from every pipe finding in this study so far,
and I ran it rather than reading it:
```
CURRENCIES      : [ 'resources', 'electricity', 'clout' ]
PAYOUT keys : 0    PRICES keys : 0    PRODUCTION keys : 0

FINISH A #notable JOB THE WAY ALL 27 CANON QUESTS FINISH:
{"applied":false,"reason":"NO_RULING","table":"PAYOUT","key":"COMPLETE",
 "about":"what a quest outcome pays is Paolo's ruling"}
balances after : {"resources":0,"electricity":0,"clout":0}

POSITIVE CONTROL -- the same call with a reward declared:
{"applied":true,"source":"quest","paid":{"resources":1},
 "balances":{"resources":1,"electricity":0,"clout":0}}
```
The chain is complete end to end: `payForToday()` on the walked surface
calls `BohemiaPayday.payForQuest`, which reads the quest's own reward,
falls back to `PURSE.PAYOUT`, credits a real ledger, and there is a
`payday_gate.js` proving all of it. **The instrument works. It pays
nothing because there is nothing to pay.**

## 3. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE: HE ALREADY RULED
## THIS, TWENTY DAYS AGO, AND IT WAS NEVER DONE. ***
I have spent this whole study writing "the number is his, so it waits".
**HE SENT THE NUMBER ON 8/15.**
> *"Anything that could cost a resource, we can't be tied up in this.
> Just make everything cost one. Just start off with one and then I'll
> move from there."*
laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md names the three
tables **by name** and says they *"fill with ones TODAY"*. Its own words:
*"The pipe is finished and the valve is his. ONE LETTER OPENS IT. He sent
the letter, and the letter is 1."*
**TODAY, 9/4, ALL THREE ARE STILL `{}` AND ALL THREE STILL CARRY THE
COMMENT `[PENDING Paolo]`** -- in `engine/bohemia_purse.js`, in
`slices/BOHEMIA_CITY_WORLD.html`, and in `slices/BOHEMIA_RUN_CURRENT.html`.
Backlog row E1 (*"DO THIS FIRST IN THIS LANE"*) is still open. And a
banner near the top of the same backlog says **"GET PAID and SPEND are
both live (his EVERYTHING-COSTS-ONE ruling unblocked them)"**, which is
how twenty days went by.
### AND THE HONEST PART, BECAUSE THE GATES DID NOT LIE
This is NOT another broken ruler. Both gates say it out loud, in their
own summary line, on every run:
- `placeholder_number_gate`: *"the three tables are still EMPTY -- WORLD
  owns filling them with tagged ones. This gate is standing before they
  arrive."*
- `demo_blockers_gate`: `22 passed, 0 failed (0 blockers · **3
  ruled-but-empty tables**)`
**THE MACHINE HAS BEEN TELLING US FOR TWENTY DAYS AND IT IS PRINTED
INSIDE A GREEN LINE.** Which is the real structural finding:
> **OUR GATES CAN SAY BROKEN OR FINE. THEY HAVE NO WORD FOR *OWED*.**
"He ruled it and nobody built it" is not broken -- nothing is failing --
so it rides along inside a pass, forever. A LAW WITHOUT A MACHINE GATE IS
NOT ENFORCED has a twin nobody wrote down:
> **A RULING IS NOT SHIPPED UNTIL SOMETHING RUNS IT.**
### AND THE COLLISION, WHICH IS WHY NO LANE COULD HAVE SEEN IT
`demo_blockers_gate` carries a *correct* comment: *"a ruling retires a
blocker without filling its table -- PAYOUT moved the reward onto the
quest itself."* That is a right reading of **8/11**. The **8/15** ruling
is NEWER and names PAYOUT explicitly. They are not even in conflict --
a quest declares its own reward, and anything undeclared falls through to
a table of ones -- but the two readings hand the job to two different
lanes. **QUESTS can correctly believe the reward belongs in the table.
WORLD can correctly believe it belongs on the quest. Both are reading a
real law. Nobody is wrong and nothing gets built.** Under EITHER reading
it is undone today, and the fix is 27 one-line edits or one table.

## 4. WHAT THE GAME HE NAMED DOES WITH A CONTRACT
- **YOU HAGGLE, AND HAGGLING HAS A COST CURVE.** Every haggle adds a
  random 3-6 "annoyance"; at 9 you are thrown out with a real reputation
  hit. So it is **safe once, risky twice, nearly impossible three
  times.** Asking for more is a decision, not a free button.
- **PAY IN ADVANCE IS A REAL TRADE, NOT A BONUS.** Taking 25% up front
  moves it out of the completion payment -- and it **raises the penalty
  for abandoning**, because you are walking away holding their money.
- **PAYMENT SHAPES:** more overall, all-on-completion, or per head
  returned. Different jobs, different shapes.
- **BREAKING A CONTRACT COSTS REPUTATION**, which costs you worse offers
  and higher prices in that town afterwards.

## 5. THE OTHER AISLE -- A CONTRACT NOBODY CAN ENFORCE
- **THE HANDSHAKE.** In informal markets the hard part is never whether
  a spoken deal counts, it is **proving what was agreed.** With no paper
  and no court, the enforcement is that *"it's unlikely either will do
  business with the other in the future"* -- reputation and repeat trade
  ARE the contract. That is day 16's shadow of the future arriving in a
  second aisle, and it is exactly our valley: no money, no courts, work
  passed hand to hand.
- **INCOMPLETE CONTRACTS (Hart and Holmström, Nobel 2016).** The
  foundational result: **it is impossible for a contract to specify every
  eventuality**, so the thing that actually matters is *which party gets
  to decide in the circumstances nobody wrote down* -- the residual
  control rights.
### *** AND WE ALREADY GAVE THOSE RIGHTS TO THE PLAYER, WHICH IS THE ONE
### PART OF THE CONTRACT WE BUILT BETTER THAN THE GAME WE ARE STUDYING. ***
Every one of our 27 quests completes at **three or four different tiers**
-- `#quiet`, `#notable`, `#risky`, `#reckless` (25/24/16/21 across the
corpus). The job says what somebody needs; **the PLAYER decides the
manner, and the manner is what gets recorded.** BB pays you for
completing. **We grade you on how.** That is the residual right in
mechanical form and it is the right half to have built first.
And failure has the same shape: all 27 quests carry a FAIL branch, every
one of them `#quiet`, and every one is reached **by saying so in a
conversation.** You do not fail a job here by running out of time. **You
fail it by telling somebody no, to their face.** That is better than a
timer and it should not be replaced by one.

## 6. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** the number he already sent, into the table (§3). The haggle
with a rising annoyance cost -- it is a real decision, it needs no
balance number under EVERYTHING COSTS ONE, and it pays off the first time
(day 16's test). Advance pay as a TRADE that raises what walking away
costs. And a job saying what it pays before you take it, which is day
19's disclosure row wearing a second hat.
**REFUSE:** a countdown timer on a quest. Our failure is a sentence
somebody says to a face, and a clock would replace the best thing we
have with the genre's most generic one. Also refused: inventing any
amount above 1 -- EVERYTHING COSTS ONE is his and it holds.

## 7. ROUTED
- **SHARED -- BB-THE-LETTER-IS-ONE.** *(the whole of §3.)* His 8/15 ruling
  is twenty days old and unexecuted, backlog row E1 is still open, and a
  status banner says it is done. Fill the three tables with **tagged**
  ones, keep the NO_RULING path for uncovered keys, and settle in one
  line which lane owns it so the 8/11 and 8/15 readings stop handing it
  to each other. **This is the highest effort-to-effect row in the entire
  study: it is one table, it is already ruled, and it turns the economy
  on.**
- **SHARED -- BB-A-GATE-CAN-SAY-OWED.** A gate has two words and needs a
  third. Something must read the laws for a ruling with a named target
  and assert the target actually carries it -- a green run that prints
  "3 ruled-but-empty tables" inside a pass is a warning nobody will ever
  read. Sibling of A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and it
  would have caught this on 8/16.
- **QUESTS -- BB-THE-JOB-PAYS.** Once the table is on, every quest that
  should pay something SPECIFIC says so in its own file, his 8/11 shape:
  a water run pays water, a courier job pays clout. One line per quest,
  amounts stay 1 until he tunes.
- **QUESTS / WORDS -- BB-ASK-FOR-MORE.** Haggling, in the conversation
  where the job is offered, with a rising cost to asking again. Free
  once, risky twice, and the third time they are done with you. No new
  screen: it is an `@OPT` on a `@TALK` node, which the language already
  has.
**RUNNING ORDER:** BB-THE-LETTER-IS-ONE is **ON THE DEMO PATH** and is
the second study row that is (after day 14's cold hand) -- the demo cut's
own "GET PAID then spend at a hub" beat cannot happen without it. The
other three queue behind the demo.

## 8. CONFIDENCE
- The 687-call histogram, zero `@DO pay`, zero deadline directives, the
  four outcome tiers and the 27 FAIL branches: **MEASURED** across all 27
  .bq files.
- The three empty tables, in all three files, and the `NO_RULING` result
  for a finished job: **RUN, NOT READ** -- a node probe against the real
  modules, with a positive control proving the same call pays correctly
  when a reward is declared.
- Both gates' summary lines: **RUN TODAY**, quoted verbatim.
- The 8/15 law text and backlog row E1: **QUOTED FROM THE REPO.**
- BB's haggle annoyance range, the 25% advance trade, and the abandonment
  penalty: wiki and Steam discussion. The dev blog on contract changes is
  proxy-blocked here and was NOT read directly. **MEDIUM-HIGH.**
- Handshake enforcement by repeat business, and Hart/Holmström's
  incomplete-contracts result on residual control rights: standard and
  well documented. **HIGH.**
- §3's "gates have no word for OWED", §5's claim that our outcome tiers
  ARE residual control rights, and §7: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
Battle Brothers wiki (Contracts) and Steam discussions on negotiation
mechanics (the 3-6 annoyance per haggle and the threshold of 9), the 25%
advance-pay trade, and the reputation penalty for cancelling a contract,
which is larger when money was taken in advance. Documentation of
informal and oral contracts, and of reputation and repeat business as the
enforcement mechanism where there is no paper. The 2016 Sveriges Riksbank
Prize press material and Oliver Hart's prize lecture "Incomplete
Contracts and Control" on the impossibility of specifying every
eventuality and the resulting importance of residual control rights.
IN-REPO: all 27 quests/bq/*.bq; the .bq parser's `case 'pay'` and its
8/11 header; engine/bohemia_purse.js (`PAYOUT`, `PRICES`, `PRODUCTION`,
`NO_RULING`); engine/bohemia_payday.js (`payForQuest`);
slices/BOHEMIA_CITY_WORLD.html (`payForToday`, and the same three empty
tables); gates/placeholder_number_gate.js and gates/demo_blockers_gate.js
run today; laws/BOHEMIA_ADDENDUM_EVERYTHING_COSTS_ONE_8_15_26.md;
BOHEMIA_BACKLOG.md rows E1 and the demo banner; and days 1-19 of this
study.
